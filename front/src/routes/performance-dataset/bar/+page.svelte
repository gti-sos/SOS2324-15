<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
</svelte:head>

<script>
    import { onMount } from "svelte";

    let DATAAPI = "http://localhost:10000/data";

    async function getData() {
        try {
            const res = await fetch(DATAAPI);
            const data = await res.json();
            createChart(data);
        } catch (error) {
            console.log(`Error fetching data: ${error}`);
        }
    }

    function createChart(data) {
        // Procesar los datos para contar la cantidad de estudiantes por país y rango de edad
        const processedData = processData(data);

        // Crear el gráfico de barras apiladas
        const chart = Highcharts.chart('container', {
            chart: {
                type: 'bar'
            },
            title: {
                text: 'Distribución de Estudiantes por País y Rango de Edad'
            },
            xAxis: {
                categories: processedData.ageRanges,
                tickInterval: 1, // Establecer el intervalo de los ticks del eje x a 1
                title: {
                    text: 'Rango de edad'
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Cantidad de Estudiantes'
                }
            },
            legend: {
                reversed: true
            },
            plotOptions: {
                series: {
                    stacking: 'normal'
                }
            },
            series: processedData.series
        });
    }

    function processData(data) {
        // Definir los rangos de edad
        const ageRanges = ['0-10', '11-20', '21-30', '31-40', '41-50', '51+'];

        // Inicializar contadores por país y rango de edad
        const countsByCountryAndAgeRange = {};

        // Contar la cantidad de estudiantes por país y rango de edad
        data.forEach(student => {
            const country = student.country;
            const age = student.student_age;
            const ageRange = getAgeRange(age);
            if (!countsByCountryAndAgeRange[country]) {
                countsByCountryAndAgeRange[country] = {};
            }
            if (!countsByCountryAndAgeRange[country][ageRange]) {
                countsByCountryAndAgeRange[country][ageRange] = 0;
            }
            countsByCountryAndAgeRange[country][ageRange]++;
        });

        // Procesar los datos en el formato esperado por Highcharts
        const series = Object.keys(countsByCountryAndAgeRange).map(country => ({
            name: country,
            data: ageRanges.map(range => countsByCountryAndAgeRange[country][range] || 0)
        }));

        return {
            ageRanges,
            series
        };
    }

    function getAgeRange(age) {
        if (age <= 10) {
            return '0-10';
        } else if (age <= 20) {
            return '11-20';
        } else if (age <= 30) {
            return '21-30';
        } else if (age <= 40) {
            return '31-40';
        } else if (age <= 50) {
            return '41-50';
        } else {
            return '51+';
        }
    }

    onMount(() => {
        getData();
    })
</script>

<div id="container" style="width: 100%; height: 400px;"></div>
