<svelte:head>
    <script src="https://cdn.jsdelivr.net/npm/echarts/dist/echarts.min.js"></script>
</svelte:head>

<script>
    import { onMount } from "svelte";

    let dataAvailable = false;
    let DATAAPI = "https://virtual-number.p.rapidapi.com/api/v1/e-sim/all-countries";
    let chartData = [];

    onMount(() => {
        getData();
    });

    async function getData() {
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': '8a2c80dd91msh64b38b25bf27192p195e18jsnceff42e30ed3',
                'X-RapidAPI-Host': 'virtual-number.p.rapidapi.com'
            }
        };

        try {
            const response = await fetch(DATAAPI, options);
            const data = await response.json();
            console.log(`Data received:${JSON.stringify(data, null, 2)}`);
            
            if (data) {
                // Aquí ajustamos los datos para que estén en el formato adecuado
                chartData = [{
                    name: 'Paises Virtual Number',
                    children: data.map(country => ({
                        name: country.countryName,
                        value: country.countryCode
                    }))
                }];
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
            tooltip: {
                trigger: 'item',
                triggerOn: 'mousemove'
            },
            series: [
                {
                    type: 'tree',
                    data: data,
                    top: '1%',
                    left: '7%',
                    bottom: '1%',
                    right: '20%',
                    symbolSize: 7,
                    label: {
                        position: 'left',
                        verticalAlign: 'middle',
                        align: 'right',
                        fontSize: 9
                    },
                    leaves: {
                        label: {
                            position: 'right',
                            verticalAlign: 'middle',
                            align: 'left'
                        }
                    },
                    emphasis: {
                        focus: 'descendant'
                    },
                    expandAndCollapse: true,
                    animationDuration: 550,
                    animationDurationUpdate: 750
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
