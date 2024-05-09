<svelte:head>
    <!-- Importar la biblioteca ZingChart -->
    <script src="https://cdn.zingchart.com/zingchart.min.js"></script>
</svelte:head>

<script>
    import { onMount } from 'svelte';

    let DATAAPI = "https://sos2324-11.appspot.com/api/v2/structural-investment-data";

    // Función asíncrona para obtener datos
    async function getData() {
        try {
            const res = await fetch(DATAAPI);
            const data = await res.json();
            console.log(`Data received: ${JSON.stringify(data, null, 2)}`);
            createStackedAreaChart(data);
            
        } catch (error) {
            console.log(`Error fetching data: ${error}`);
        }
    }

    // Función para crear el gráfico de tipo Stacked Area Chart
    function createStackedAreaChart(data) {
        // Configurar los datos para el gráfico
        const chartData = {
            type: 'area',
            plot: {
                stacked: true
            },
            title: {
                text: 'Stacked Area Chart'
            },
            scaleX: {
                label: {
                    text: 'Year'
                },
                values: data.map(item => item.year)
            },
            scaleY: {
                label: {
                    text: 'Value'
                }
            },
            series: [
                {
                    values: data.map(item => item.total_net_payments),
                    text: 'Total Net Payments'
                },
                {
                    values: data.map(item => item.net_planned_eu_amount),
                    text: 'Net Planned EU Amount'
                },
                {
                    values: data.map(item => item.cumulative_annual_pre_financing),
                    text: 'Cumulative Annual Pre Financing'
                }
            ]
        };

        // Renderizar el gráfico en el contenedor con id 'stacked-area-chart'
        zingchart.render({
            id: 'stacked-area-chart',
            data: chartData,
            height: '100%',
            width: '100%'
        });
    }

    onMount(() => {
        getData();
    });
</script>


<div id="stacked-area-chart"></div>
