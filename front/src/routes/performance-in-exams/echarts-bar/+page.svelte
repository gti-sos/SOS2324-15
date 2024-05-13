<svelte:head>
    <script src="https://cdn.jsdelivr.net/npm/echarts/dist/echarts.min.js"></script>
</svelte:head>

<script>
    import { onMount } from "svelte";

    let DATAAPI = "https://cryptocurrency-news2.p.rapidapi.com/v1/coindesk";
    let chartData = [];

    onMount(() => {
        getData();
    });

    async function getData() {
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': '8a2c80dd91msh64b38b25bf27192p195e18jsnceff42e30ed3',
                'X-RapidAPI-Host': 'cryptocurrency-news2.p.rapidapi.com'
            }
        };

        try {
            const response = await fetch(DATAAPI, options);
            const result = await response.json();
            console.log(result);

            if (result.data && result.data.length > 0) {
                // Seleccionamos solo las primeras 10 noticias para simplificar
                const simplifiedData = result.data.slice(0, 10);

                chartData = simplifiedData.map(item => ({
                    title: item.title,
                    value: item.title.split(' ').length // Contamos las palabras en el título
                }));

                createGraph(chartData);
            }
        } catch (error) {
            console.error(`Error fetching data: ${error}`);
        }
    }

    function createGraph(data) {
        const chartDom = document.getElementById('echarts-chart');
        const myChart = echarts.init(chartDom);

        const option = {
            title: {
                text: 'Número de Palabras en los Títulos de las Noticias de Coindesk'
            },
            xAxis: {
                type: 'category',
                data: data.map(item => item.title),
                axisLabel: {
                    rotate: 45,
                    interval: 0
                }
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: data.map(item => item.value),
                type: 'bar'
            }]
        };

        myChart.setOption(option);
    }
</script>

<style>
    #echarts-chart {
        width: 100%;
        height: 400px;
    }
</style>

<div id="echarts-chart"></div>
