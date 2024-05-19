<svelte:head>
    <!-- Importar Highcharts y los módulos necesarios -->
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/treemap.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
</svelte:head>

<script>
    // Importar onMount de Svelte para ejecutar código cuando el componente se monta
    import { onMount } from "svelte";

    // URL y opciones de la API de Hearthstone
    const url = 'https://omgvamp-hearthstone-v1.p.rapidapi.com/info';
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'c8c5805be4msh51b2331d0f2ac40p14efb1jsn56f9898c3d22', // Clave de la API
            'X-RapidAPI-Host': 'omgvamp-hearthstone-v1.p.rapidapi.com' // Host de la API
        }
    };

    // Función para obtener datos de la API
    async function getData() {
        try {
            // Realizar la solicitud a la API
            const res = await fetch(url, options);
            // Convertir la respuesta en un objeto JSON
            const data = await res.json();
            // Crear el gráfico con los datos obtenidos
            createChart(data);
        } catch (error) {
            // Manejo de errores
            console.log(`Error fetching data: ${error}`);
        }
    }

    // Función para crear el gráfico de Treemap
    function createChart(data) {
        // Preparar los datos para el Treemap
        const treemapData = [
            {
                name: 'Clases',
                value: data.classes.length, // Cantidad de clases
                color: '#7cb5ec' // Color de la sección
            },
            {
                name: 'Sets',
                value: data.sets.length, // Cantidad de sets
                color: '#434348' // Color de la sección
            },
            {
                name: 'Estándares',
                value: data.standard.length, // Cantidad de estándares
                color: '#90ed7d' // Color de la sección
            },
            {
                name: 'Wild',
                value: data.wild.length, // Cantidad de wild
                color: '#f7a35c' // Color de la sección
            },
            {
                name: 'Tipos de Cartas',
                value: data.types.length, // Cantidad de tipos de cartas
                color: '#8085e9' // Color de la sección
            },
            {
                name: 'Calidades de Cartas',
                value: data.qualities.length, // Cantidad de calidades de cartas
                color: '#f15c80' // Color de la sección
            },
            {
                name: 'Razas',
                value: data.races.length, // Cantidad de razas
                color: '#e4d354' // Color de la sección
            }
        ];

        // Configuración del gráfico con Highcharts
        Highcharts.chart('container', {
            series: [{
                type: 'treemap', // Tipo de gráfico
                layoutAlgorithm: 'squarified', // Algoritmo de disposición
                allowDrillToNode: true, // Permitir hacer zoom en los nodos
                dataLabels: {
                    enabled: false // Desactivar etiquetas de datos
                },
                levelIsConstant: false, // Permitir niveles diferentes
                levels: [{
                    level: 1, // Nivel de zoom
                    dataLabels: {
                        enabled: true // Activar etiquetas de datos
                    },
                    borderWidth: 3 // Ancho del borde
                }],
                data: treemapData // Datos para el Treemap
            }],
            title: {
                text: 'Información General de Hearthstone' // Título del gráfico
            }
        });
    }

    // Ejecutar getData() al montar el componente
    onMount(() => {
        getData();
    });
</script>

<!-- Contenedor para el gráfico -->
<div id="container" style="width: 100%; height: 600px;"></div>
