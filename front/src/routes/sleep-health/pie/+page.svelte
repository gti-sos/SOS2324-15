<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
</svelte:head>

<script>
    import { onMount } from "svelte";

    let DATAAPI="https://sos2324-15.appspot.com/api/v2/students-sleep-health";

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
        // Procesar los datos para contar la cantidad de estudiantes por cada tipo de trastorno del sueño
        const sleepDisorderCounts = processData(data);

        // Crear el gráfico de sectores (pie chart)
        Highcharts.chart('container', {
            chart: {
                type: 'pie'
            },
            title: {
                text: 'Distribución de Trastornos del Sueño'
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.y}</b>'
            },
            series: [{
                name: 'Cantidad',
                colorByPoint: true,
                data: sleepDisorderCounts
            }]
        });
    }

    function processData(data) {
        // Contar la cantidad de cada tipo de trastorno del sueño
        const sleepDisorderCounts = {};
        data.forEach(student => {
            const disorder = student.sleep_disorder;
            if (!sleepDisorderCounts[disorder]) {
                sleepDisorderCounts[disorder] = 0;
            }
            sleepDisorderCounts[disorder]++;
        });

        // Convertir los datos en el formato esperado por Highcharts
        const chartData = [];
        for (const [disorder, count] of Object.entries(sleepDisorderCounts)) {
            chartData.push({ name: disorder, y: count });
        }
        return chartData;
    }

    onMount(() => {
        getData();
    })
</script>

<div id="container" style="width: 100%; height: 400px;"></div>
