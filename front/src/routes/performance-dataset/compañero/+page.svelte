<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
</svelte:head>

<script>
    import { onMount } from "svelte";

    let DATAAPI1 = "https://sos2324-13.appspot.com/api/v2/salaries-datasets";
    let DATAAPI2 = "https://sos2324-15.appspot.com/api/v2/students-performance-dataset";

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

    async function fillChart(data1, data2) {
        const mergedData = mergeData(data1, data2);

        const chart = Highcharts.chart('container', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Salaries and Average Performance by Country'
            },
            xAxis: {
                categories: mergedData.map(item => item.country)
            },
            yAxis: [{ // Primary yAxis
                labels: {
                    format: '{value} $',
                    style: {
                        color: Highcharts.getOptions().colors[1]
                    }
                },
                title: {
                    text: 'Salary',
                    style: {
                        color: Highcharts.getOptions().colors[1]
                    }
                }
            }, { // Secondary yAxis
                title: {
                    text: 'Average Performance',
                    style: {
                        color: Highcharts.getOptions().colors[0]
                    }
                },
                labels: {
                    format: '{value}',
                    style: {
                        color: Highcharts.getOptions().colors[0]
                    }
                },
                opposite: true
            }],
            tooltip: {
                shared: true
            },
            series: [{
                name: 'Average Performance',
                type: 'column',
                yAxis: 1,
                data: mergedData.map(item => item.average_performance)
            }, {
                name: 'Salary',
                type: 'column',
                data: mergedData.map(item => item.salary)
            }]
        });
    }

    function mergeData(data1, data2) {
        let mergedData = [];
        data1.forEach(item1 => {
            const country = item1.country.toLowerCase();
            let item2 = data2.find(item => item.country.toLowerCase() === country);
            if (item2) {
                mergedData.push({
                    country: item1.country,
                    salary: item1.salary,
                    average_performance: item2.calification_average
                });
            }
        });
        return mergedData;
    }

    onMount(async () => {
        const data1 = await getData1();
        const data2 = await getData2();
        fillChart(data1, data2);
    })
</script>

<div id="container" style="width:100%; height:600px;"></div>
