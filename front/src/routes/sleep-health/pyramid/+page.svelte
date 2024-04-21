<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
	<script src="https://code.highcharts.com/modules/export-data.js"></script>
	<script src="https://code.highcharts.com/modules/accessibility.js"></script>
    <script src="https://code.highcharts.com/modules/funnel.js"></script>
</svelte:head>

<script>
    import { onMount } from "svelte";

    let DATAAPI = "https://sos2324-15.appspot.com/api/v2/students-sleep-health";

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
        // Ordenar los datos por 'daily_steps' de menor a mayor
        data.sort((a, b) => a.daily_steps - b.daily_steps);

        // Crear el gráfico de tipo 'pyramid'
        Highcharts.chart('container', {
            chart: {
                type: 'pyramid'
            },
            title: {
                text: 'Ranking de países con más pasos diarios',
                x: -50
            },
            plotOptions: {
                series: {
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b> ({point.y:,.0f})',
                        softConnector: true
                    },
                    center: ['40%', '50%'],
                    width: '80%'
                }
            },
            legend: {
                enabled: false
            },
            series: [{
                name: 'Unique users',
                data: data.map(record => [record.country, record.daily_steps])
            }],
            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 500
                    },
                    chartOptions: {
                        plotOptions: {
                            series: {
                                dataLabels: {
                                    inside: true
                                },
                                center: ['50%', '50%'],
                                width: '100%'
                            }
                        }
                    }
                }]
            }
        });
    }

    onMount(() => {
        getData();
    })
</script>

<div id="container" style="width: 100%; height: 400px;"></div>
