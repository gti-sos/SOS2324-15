
<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
</svelte:head>

<script>
    import { onMount } from 'svelte';

    let performanceData = [];
    let populationData = {};

    async function getPerformanceData() {
        try {
            const response = await fetch("https://sos2324-15.appspot.com/api/v2/students-performance-dataset");
            performanceData = await response.json();
        } catch (error) {
            console.error(error);
        }
    }

    async function getPopulationData(country) {
        const url = `https://country55.p.rapidapi.com/api/countries?country=${country}`;
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': 'c8c5805be4msh51b2331d0f2ac40p14efb1jsn56f9898c3d22',
                'X-RapidAPI-Host': 'country55.p.rapidapi.com'
            }
        };

        try {
            const response = await fetch(url, options);
            const result = await response.json();
            populationData[country] = result;
        } catch (error) {
            console.error(error);
        }
    }

    async function combineData() {
        // Combina los datos de rendimiento y población por país
        const combinedData = performanceData.map(student => {
            const populationResponse = populationData[student.country];
            if (!populationResponse || populationResponse.population === undefined) {
                console.error(`No se encontró información de población para ${student.country}`);
                return null;
            }
            const population = populationResponse.population;
            const calificationPercentage = (student.calification_average / 5) * 100; // Convertir la calificación a porcentaje
            const populationPercentage = (population / populationData[student.country].population) * 100;

            return {
                country: student.country,
                calificationPercentage,
                populationPercentage
            };
        });

        // Filtra los elementos nulos
        const filteredData = combinedData.filter(data => data !== null);

        fillChart(filteredData);
    }


    function fillChart(data) {
        Highcharts.chart('container', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Calificación promedio de estudiantes vs. Población por país'
            },
            xAxis: {
                categories: data.map(item => item.country)
            },
            yAxis: [{
                min: 0,
                title: {
                    text: 'Porcentaje'
                }
            }],
            series: [{
                name: 'Calificación Promedio',
                data: data.map(item => item.calificationPercentage)
            }, {
                name: 'Población',
                data: data.map(item => item.populationPercentage)
            }]
        });
    }

    onMount(async () => {
        await getPerformanceData();
        const countries = [...new Set(performanceData.map(item => item.country))];
        await Promise.all(countries.map(country => getPopulationData(country)));
        combineData();
    });
</script>

<div id="container" style="width:100%; height:400px;"></div>
