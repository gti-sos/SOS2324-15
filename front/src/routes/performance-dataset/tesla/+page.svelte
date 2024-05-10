<svelte:head>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</svelte:head>

<script>
    import { onMount } from "svelte";

    let dataAvailable = false;

    let fetchData = async () => {
        const region = document.getElementById('region').value;
        const url = `https://yh-finance.p.rapidapi.com/auto-complete?q=tesla&region=${region}`;
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': 'c8c5805be4msh51b2331d0f2ac40p14efb1jsn56f9898c3d22',
                'X-RapidAPI-Host': 'yh-finance.p.rapidapi.com'
            }
        };

        try {
            const response = await fetch(url, options);
            const result = await response.json();
            console.log(result);

            const quotes = result.quotes;
            const data = quotes.map(quote => ({ name: quote.symbol, score: quote.score }));

            // Destruir el gráfico existente si existe
            if (window.myChart) {
                window.myChart.destroy();
            }

            const ctx = document.getElementById('chart').getContext('2d');
            window.myChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: data.map(d => d.name),
                    datasets: [{
                        label: 'Score',
                        data: data.map(d => d.score),
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
        // Puedes cargar datos adicionales aquí si es necesario
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
    <select id="region">
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
