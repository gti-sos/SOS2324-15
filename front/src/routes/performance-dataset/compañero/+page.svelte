<svelte:head>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</svelte:head>

<script>
    import { onMount } from "svelte";

    let DATAAPI1 = "https://sos2324-22.appspot.com/api/v2/forbes-billionaires-list";
    let DATAAPI2 = "https://sos2324-15.appspot.com/api/v2/students-performance-dataset";

    let dataAvailable = false;

    async function fetchData() {
        try {
            const response1 = await fetch(DATAAPI1);
            const response2 = await fetch(DATAAPI2);
            const data1 = await response1.json();
            const data2 = await response2.json();
            const mergedData = mergeData(data1, data2);
            updateChart(mergedData);
        } catch (error) {
            console.error(`Error fetching data:`, error);
        }
    }

    function mergeData(data1, data2) {
        const mergedData = [];
        for (const item1 of data1) {
            const country = item1.country;
            const item2 = data2.find(item => item.country.toLowerCase() === country.toLowerCase()); // Lowercasing both country names for case-insensitive comparison
            if (item2) {
                mergedData.push({
                    country: country,
                    net_worth: item1.net_worth,
                    attendance_percentage: item2.attendance_percentage
                });
            }
        }
        return mergedData;
    }

    async function updateChart(data) {
        try {
            const ctx = document.getElementById('chart').getContext('2d');
            new Chart(ctx, {
                type: 'radar',
                data: {
                    labels: data.map(d => d.country),
                    datasets: [{
                        label: 'Patrimonio Neto',
                        data: data.map(d => d.net_worth),
                        backgroundColor: 'rgba(54, 162, 235, 0.5)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    }, {
                        label: 'Porcentaje de Asistencia',
                        data: data.map(d => d.attendance_percentage),
                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        r: {
                            angleLines: {
                                display: true
                            },
                            suggestedMin: 0,
                            suggestedMax: 100,
                            grid: {
                                color: 'rgba(0, 0, 0, 0.1)'
                            },
                            pointLabels: {
                                fontSize: 14
                            }
                        }
                    }
                }
            });
        } catch (error) {
            console.error(error);
        }
    }

    onMount(async () => {
        await fetchData(); // Fetch data on component mount
        dataAvailable = true;
    });
</script>

<style>
    #chart-container {
        margin-top: 20px;
    }
</style>

<div id="chart-container">
    <canvas id="chart"></canvas>
</div>
