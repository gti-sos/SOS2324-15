<svelte:head>
    <!-- Cargamos la biblioteca Chart.js desde un CDN -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</svelte:head>

<script>
    // Importamos onMount de Svelte para ejecutar código cuando el componente se monta
    import { onMount } from "svelte";

    // Definimos las URLs de las APIs de datos
    let DATAAPI1 = "https://sos2324-22.appspot.com/api/v2/forbes-billionaires-list";
    let DATAAPI2 = "https://sos2324-15.appspot.com/api/v2/students-performance-dataset";

    // Indicador de disponibilidad de datos
    let dataAvailable = false;

    // Función asíncrona para obtener los datos de ambas APIs
    async function fetchData() {
        try {
            // Realizamos las solicitudes fetch a ambas APIs
            const response1 = await fetch(DATAAPI1);
            const response2 = await fetch(DATAAPI2);
            // Convertimos las respuestas en objetos JSON
            const data1 = await response1.json();
            const data2 = await response2.json();
            // Combinamos los datos obtenidos
            const mergedData = mergeData(data1, data2);
            // Actualizamos el gráfico con los datos combinados
            updateChart(mergedData);
        } catch (error) {
            // En caso de error, lo mostramos en la consola
            console.error(`Error fetching data:`, error);
        }
    }

    // Función para combinar los datos de ambas APIs
    function mergeData(data1, data2) {
        const mergedData = [];
        for (const item1 of data1) {
            const country = item1.country;
            // Buscamos el país en los datos de la segunda API (ignorando mayúsculas/minúsculas)
            const item2 = data2.find(item => item.country.toLowerCase() === country.toLowerCase());
            if (item2) {
                // Si encontramos coincidencia, combinamos los datos en un objeto y lo añadimos a mergedData
                mergedData.push({
                    country: country,
                    net_worth: item1.net_worth,
                    attendance_percentage: item2.attendance_percentage
                });
            }
        }
        return mergedData;
    }

    // Función para actualizar el gráfico con los datos proporcionados
    async function updateChart(data) {
        try {
            // Obtenemos el contexto del elemento canvas donde se dibujará el gráfico
            const ctx = document.getElementById('chart').getContext('2d');
            // Creamos un nuevo gráfico de tipo radar utilizando Chart.js
            new Chart(ctx, {
                type: 'radar',
                data: {
                    // Usamos los nombres de los países como etiquetas del gráfico
                    labels: data.map(d => d.country),
                    datasets: [{
                        // Primer conjunto de datos: Patrimonio Neto
                        label: 'Patrimonio Neto',
                        data: data.map(d => d.net_worth),
                        backgroundColor: 'rgba(54, 162, 235, 0.5)', // Color de fondo de las áreas
                        borderColor: 'rgba(54, 162, 235, 1)', // Color del borde de las áreas
                        borderWidth: 1 // Ancho del borde de las áreas
                    }, {
                        // Segundo conjunto de datos: Porcentaje de Asistencia
                        label: 'Porcentaje de Asistencia',
                        data: data.map(d => d.attendance_percentage),
                        backgroundColor: 'rgba(255, 99, 132, 0.5)', // Color de fondo de las áreas
                        borderColor: 'rgba(255, 99, 132, 1)', // Color del borde de las áreas
                        borderWidth: 1 // Ancho del borde de las áreas
                    }]
                },
                options: {
                    // Opciones de configuración del gráfico
                    scales: {
                        r: {
                            angleLines: {
                                display: true // Mostrar líneas angulares
                            },
                            suggestedMin: 0, // Valor mínimo sugerido para la escala radial
                            suggestedMax: 100, // Valor máximo sugerido para la escala radial
                            grid: {
                                color: 'rgba(0, 0, 0, 0.1)' // Color de la cuadrícula
                            },
                            pointLabels: {
                                fontSize: 14 // Tamaño de fuente de las etiquetas de los puntos
                            }
                        }
                    }
                }
            });
        } catch (error) {
            // En caso de error, lo mostramos en la consola
            console.error(error);
        }
    }

    // Ejecutamos la función fetchData cuando el componente se monta
    onMount(async () => {
        await fetchData(); // Obtenemos los datos al montar el componente
        dataAvailable = true; // Indicamos que los datos están disponibles
    });
</script>

<style>
    #chart-container {
        margin-top: 20px; 
    }
</style>

<!-- Contenedor para el gráfico -->
<div id="chart-container">
    <canvas id="chart"></canvas> <!-- Elemento canvas donde se dibujará el gráfico -->
</div>
