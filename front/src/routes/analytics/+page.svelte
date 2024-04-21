<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/highcharts-3d.js"></script> <!-- Módulo 3D -->
    <script src="https://code.highcharts.com/modules/exporting.js"></script> <!-- Módulo de exportación -->
    <script src="https://code.highcharts.com/modules/accessibility.js"></script> <!-- Módulo de accesibilidad -->

</svelte:head>

<script>
    import { onMount } from "svelte";

    //let DATAAPI1 = "http://localhost:10000/api/v2/students-sleep-health";
    let DATAAPI1 = "https://sos2324-15.appspot.com/api/v2/students-sleep-health";
    //let DATAAPI2 = "http://localhost:10000/api/v2/students-performance-in-exams";
    let DATAAPI2 = "https://sos2324-15.appspot.com/api/v2/students-performance-in-exams";
   //let DATAAPI3 = "http://localhost:10000/api/v2/students-performance-dataset";
    let DATAAPI3 = "https://sos2324-15.appspot.com/api/v2/students-performance-dataset";

    async function getData1() {
        try {
            const res = await fetch(DATAAPI1);
            return await res.json();
        } catch (error) {
            console.log(`Error fetching data from API 1: ${error}`);
            return [];
        }
    }

    async function getData2() {
        try {
            const res = await fetch(DATAAPI2);
            return await res.json();
        } catch (error) {
            console.log(`Error fetching data from API 2: ${error}`);
            return [];
        }
    }

    async function getData3() {
        try {
            const res = await fetch(DATAAPI3);
            return await res.json();
        } catch (error) {
            console.log(`Error fetching data from API 3: ${error}`);
            return [];
        }
    }

    async function fillChart(data1, data2, data3) {
        const mergedData = mergeData(data1, data2, data3);

        const chart = Highcharts.chart('container', {
            chart: {
                type: 'scatter3d',
                options3d: {
                    enabled: true,
                    alpha: 10,
                    beta: 30,
                    depth: 400,
                    viewDistance: 50
                }
            },
            title: {
                text: 'Quality of Sleep vs. Average Score vs. Study Hours by Country'
            },
            xAxis: {
                title: {
                    enabled: true,
                    text: 'Quality of Sleep'
                },
                startOnTick: true,
                endOnTick: true,
                showLastLabel: true
            },
            yAxis: {
                title: {
                    text: 'Average Score'
                }
            },
            zAxis: {
                title: {
                    text: 'Study Hours'
                }
            },
            tooltip: {
                formatter: function () {
                    return '<b>' + this.point.country + '</b><br>' +
                        'Quality of Sleep: ' + this.point.x + '<br>' +
                        'Average Score: ' + this.point.y + '<br>' +
                        'Study Hours: ' + this.point.z;
                }
            },
            plotOptions: {
                scatter: {
                    marker: {
                        radius: 5,
                        states: {
                            hover: {
                                enabled: true,
                                lineColor: 'rgb(100,100,100)'
                            }
                        }
                    },
                    states: {
                        hover: {
                            marker: {
                                enabled: false
                            }
                        }
                    }
                }
            },
            series: mergedData
        });
    }

    function mergeData(data1, data2, data3) {
        let mergedData = [];
        data1.forEach(item1 => {
            const country = item1.country.toLowerCase();
            let item2 = data2.find(item => item.country.toLowerCase() === country);
            let item3 = data3.find(item => item.country.toLowerCase() === country);
            if (item2 && item3) {
                mergedData.push({
                    name: country,
                    data: [{
                        x: item1.quality_of_sleep,
                        y: item2.math_score,
                        z: item3.weekly_study_hours,
                        country: item1.country // Agregar el atributo country al punto de datos
                    }],
                    type: 'scatter3d'
                });
            }
        });
        return mergedData;
    }

    onMount(async () => {
        const data1 = await getData1();
        const data2 = await getData2();
        const data3 = await getData3();
        fillChart(data1, data2, data3);
    })
</script>

<div id="container" style="width:100%; height:600px;"></div>