<svelte:head>
    <!-- Importar la biblioteca Chart.js -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</svelte:head>

<script>
    // Importar onMount de Svelte para ejecutar código cuando el componente se monta
    import { onMount } from "svelte";

    // URL de la API de datos
    let DATAAPI = "https://sos2324-15.appspot.com/proxyMFC";

    // Indicador de disponibilidad de datos
    let dataAvailable = false;

    // Función asincrónica para obtener datos de la API
    async function fetchData() {
        try {
            const res = await fetch(`${DATAAPI}?region=${region}`);
            const data = await res.json();
            console.log(`Data received:`, data);
            updateChart(data); // Llamar a la función para actualizar el gráfico con los datos recibidos
        } catch (error) {
            console.error(`Error fetching data:`, error);
        }
    }

    let region = "US"; // Región predeterminada

    // Función para actualizar el gráfico con los datos proporcionados
    async function updateChart(data) {
        try {
            const quotes = data.quotes;
            const chartData = quotes.map(quote => ({ name: quote.symbol, score: quote.score }));

            // Destruir el gráfico existente si existe
            if (window.myChart) {
                window.myChart.destroy();
            }

            const ctx = document.getElementById('chart').getContext('2d');
            // Crear un nuevo gráfico con Chart.js
            window.myChart = new Chart(ctx, {
                type: 'bar', // Tipo de gráfico
                data: {
                    labels: chartData.map(d => d.name), // Nombres de las etiquetas
                    datasets: [{
                        label: 'Score', // Etiqueta del conjunto de datos
                        data: chartData.map(d => d.score), // Datos del gráfico
                        backgroundColor: 'rgba(54, 162, 235, 0.5)', // Color de fondo de las barras
                        borderColor: 'rgba(54, 162, 235, 1)', // Color del borde de las barras
                        borderWidth: 1 // Ancho del borde de las barras
                    }]
                },
                options: {
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Ticker Symbol' // Título del eje X
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Score' // Título del eje Y
                            }
                        }
                    }
                }
            });
        } catch (error) {
            console.error(error);
        }
    }

    // Ejecutar fetchData() al montar el componente
    onMount(async () => {
        await fetchData(); // Obtener datos al montar el componente
        dataAvailable = true; // Establecer el indicador de disponibilidad de datos en verdadero
    });
</script>

<style>
    #chart-container {
        margin-top: 20px; 
    }
</style>

<!-- Selector de región y botón de búsqueda -->
<div>
    <label for="region">Select a Region:</label>
    <select id="region" bind:value={region}> <!-- Selector de región -->
        <option value="US">United States</option> <!-- Opciones para seleccionar la región -->
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
    <button on:click={fetchData}>Search</button> <!-- Botón para buscar datos -->
</div>

<!-- Contenedor para el gráfico -->
<div id="chart-container">
    <canvas id="chart"></canvas> <!-- Lienzo del gráfico -->
</div>
