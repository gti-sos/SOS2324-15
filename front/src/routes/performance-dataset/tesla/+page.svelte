<svelte:head>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</svelte:head>

<script>
    import { onMount } from "svelte";

   

    let DATAAPI = "/ProxyMFC";
    if(dev){
        DATAAPI = "http://localhost:10000/ProxyMFC";
        
    }

    let dataAvailable = false;

    async function fetchData() {
        try {
            const res = await fetch(`${DATAAPI}?region=${region}`);
            const data = await res.json();
            console.log(`Data received:`, data);
            updateChart(data);
        } catch (error) {
            console.error(`Error fetching data:`, error);
        }
    }

    let region = "US"; // Default region

    async function updateChart(data) {
        try {
            const quotes = data.quotes;
            const chartData = quotes.map(quote => ({ name: quote.symbol, score: quote.score }));

            // Destroy existing chart if exists
            if (window.myChart) {
                window.myChart.destroy();
            }

            const ctx = document.getElementById('chart').getContext('2d');
            window.myChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: chartData.map(d => d.name),
                    datasets: [{
                        label: 'Score',
                        data: chartData.map(d => d.score),
                        backgroundColor: 'rgba(54, 162, 235, 0.5)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Ticker Symbol'
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Score'
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

<div>
    <label for="region">Select a Region:</label>
    <select id="region" bind:value={region}>
        <option value="US">United States</option>
        <option value="BR">Brazil</option>
        <option value="AU">Australia</option>
        <option value="CA">Canada</option>
        <option value="FR">France</option>
        <option value="DE">Germany</option>
        <option value="HK">Hong Kong</option>
        <option value="IN">India</option>
        <option value="IT">Italy</option>
        <option value="ES">Spain</option>
        <option value="GB">United Kingdom</option>
        <option value="SG">Singapore</option>
    </select>
    <button on:click={fetchData}>Search</button>
</div>

<div id="chart-container">
    <canvas id="chart"></canvas>
</div>
