<svelte:head>
    <script src="https://cdn.jsdelivr.net/npm/echarts/dist/echarts.min.js"></script>
</svelte:head>

<script>
    import { onMount } from "svelte";

    let dataAvailable = false;
    let DATAAPI = "https://opencritic-api.p.rapidapi.com/game/search?criteria=the%20withcer%203";
    let chartData = [];

    onMount(() => {
        getData();
    });

    async function getData() {
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': '8a2c80dd91msh64b38b25bf27192p195e18jsnceff42e30ed3',
                'X-RapidAPI-Host': 'opencritic-api.p.rapidapi.com'
            }
        };

        try {
            const response = await fetch(DATAAPI, options);
            const data = await response.json();
            console.log(data);
            
            if (data && data.length > 0) {
                // Ajustamos los datos para que estén en el formato adecuado para el gráfico de dispersión
                chartData = data.map(game => ({
                    name: game.name,
                    value: [game.id, game.dist]
                }));
                dataAvailable = true;
                createGraph(chartData);
            }
        } catch (error) {
            console.log(`Error fetching data: ${error}`);
        }
    }

    function createGraph(data) {
        const chartDom = document.getElementById('echarts-chart');
        const myChart = echarts.init(chartDom);

        myChart.showLoading();
        myChart.hideLoading();

        const option = {
            title: {
                text: 'Juegos de The Witcher 3: Wild Hunt'
            },
            xAxis: {
                name: 'ID'
            },
            yAxis: {
                name: 'Distancia'
            },
            series: [
                {
                    name: 'Juegos',
                    symbolSize: 20,
                    data: data,
                    type: 'scatter',
                    label: {
                        show: true,
                        formatter: '{b}'
                    }
                }
            ]
        };

        myChart.setOption(option);
    }
</script>

<style>
    #echarts-chart {
        width: 100%;
        height: 350px;
        margin-bottom: 20px;
    }
</style>

<div id="echarts-chart"></div>
