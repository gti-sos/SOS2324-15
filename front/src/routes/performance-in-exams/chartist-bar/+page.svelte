<svelte:head>
    <script src="https://cdn.jsdelivr.net/npm/chartist/dist/chartist.min.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/chartist/dist/chartist.min.css">
</svelte:head>

<script>
    import { onMount } from "svelte";

    let dataAvailable = false;
    let holidayTypes = [];

    onMount(() => {
        getData();
    });

    async function getData() {
        const url = 'https://worldwide-national-holidays.p.rapidapi.com/getyearholidays?country=us&year=2024';
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': '51e8c5d9f4mshf0f3df44f4104cep1ace94jsn2a5b158fba16',
                'X-RapidAPI-Host': 'worldwide-national-holidays.p.rapidapi.com'
            }
        };  

        try {
            const response = await fetch(url, options);
            const result = await response.json();
            console.log(result);
            const holidayData = result.data;
            // Count the occurrences of each holiday type
            const typeCounts = holidayData.reduce((acc, holiday) => {
                acc[holiday.type] = (acc[holiday.type] || 0) + 1;
                return acc;
            }, {});
            // Convert object to array of objects
            holidayTypes = Object.entries(typeCounts).map(([type, count]) => ({ type, count }));
            if (holidayTypes.length > 0) {
                dataAvailable = true;
                createBarChart(holidayTypes);
            }
        } catch (error) {
            console.error(error);
        }
    }

    function createBarChart(data) {
        var chartData = {
            labels: data.map(item => item.type), // Usamos los tipos de festividades como etiquetas
            series: [data.map(item => item.count)]
        };

        var options = {
            high: Math.max(...chartData.series[0]) + 1,
            low: 0,
            axisX: {
                // Estilo de los nombres en el eje X
                textAnchor: 'middle',
                fontSize: '14px',
                fontFamily: 'Arial, sans-serif',
                fill: '#333' // Color del texto
            },
            // Estilo de las barras
            barWidth: 40, // Grosor de las barras
            chartPadding: {
                top: 20,
                right: 20,
                bottom: 30,
                left: 20
            },
            barColors: ['#7cb342'] // Color de las barras
        };

        new Chartist.Bar('.ct-chart', chartData, options);
    }
</script>

<style>
    .ct-chart {
        width: 100%;
        height: 350px;
        margin-bottom: 20px;
    }
    h3 {
        text-align: center;
    }
</style>

<br>
<h3>Recuento de tipos de festividades</h3>
<div class="ct-chart"></div>
