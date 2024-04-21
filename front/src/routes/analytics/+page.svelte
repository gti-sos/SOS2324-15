<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
</svelte:head>

<script>
    import { onMount } from "svelte";

    let DATAAPI1 = "http://localhost:10000/api/v2/students-sleep-health";
    let DATAAPI2 = "http://localhost:10000/api/v2/students-performance-in-exams";
    let DATAAPI3 = "http://localhost:10000/api/v2/students-performance-dataset";

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
        // Merge data from all sources
        const mergedData = mergeData(data1, data2, data3);

        const chart = Highcharts.chart('container', {
            chart: {
                type: 'scatter',
                zoomType: 'xy'
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
            legend: {
                layout: 'vertical',
                align: 'left',
                verticalAlign: 'top',
                x: 100,
                y: 70,
                floating: true,
                backgroundColor: Highcharts.defaultOptions.chart.backgroundColor,
                borderWidth: 1
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
                    },
                    tooltip: {
                        headerFormat: '<b>{series.name}</b><br>',
                        pointFormat: '{point.x} Quality of Sleep, {point.y} Average Score, {point.z} Study Hours'
                    }
                }
            },
            series: mergedData
        });
    }

    function mergeData(data1, data2, data3) {
    let mergedData = [];
    data1.forEach(item1 => {
        let item2 = data2.find(item => item.country === item1.country);
        let item3 = data3.find(item => item.country === item1.country);
        if (item2 && item3) {
            mergedData.push({
                name: item1.country,
                data: [[item1.quality_of_sleep, item2.calification_average, item3.weekly_study_hours]]
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

<div id="container" style="width:100%; height:400px;"></div>
