<svelte:head>
    <!-- Importar Highcharts y los módulos necesarios -->
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/treemap.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
</svelte:head>

<script>
    import { onMount } from "svelte";

    // URL y opciones de la API de Hearthstone
    const url = 'https://omgvamp-hearthstone-v1.p.rapidapi.com/info';
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'c8c5805be4msh51b2331d0f2ac40p14efb1jsn56f9898c3d22',
            'X-RapidAPI-Host': 'omgvamp-hearthstone-v1.p.rapidapi.com'
        }
    };

    // Función para obtener datos de la API
    async function getData() {
        try {
            const res = await fetch(url, options);
            const data = await res.json();
            createChart(data); // Crear el gráfico con los datos obtenidos
        } catch (error) {
            console.log(`Error fetching data: ${error}`); // Manejo de errores
        }
    }

    // Función para crear el gráfico de Treemap
    function createChart(data) {
        const treemapData = [
            {
                name: 'Clases',
                value: data.classes.length,
                color: '#7cb5ec'
            },
            {
                name: 'Sets',
                value: data.sets.length,
                color: '#434348'
            },
            {
                name: 'Estándares',
                value: data.standard.length,
                color: '#90ed7d'
            },
            {
                name: 'Wild',
                value: data.wild.length,
                color: '#f7a35c'
            },
            {
                name: 'Tipos de Cartas',
                value: data.types.length,
                color: '#8085e9'
            },
            {
                name: 'Calidades de Cartas',
                value: data.qualities.length,
                color: '#f15c80'
            },
            {
                name: 'Razas',
                value: data.races.length,
                color: '#e4d354'
            }
        ];

        // Configuración del gráfico con Highcharts
        Highcharts.chart('container', {
            series: [{
                type: 'treemap',
                layoutAlgorithm: 'squarified',
                allowDrillToNode: true,
                dataLabels: {
                    enabled: false
                },
                levelIsConstant: false,
                levels: [{
                    level: 1,
                    dataLabels: {
                        enabled: true
                    },
                    borderWidth: 3
                }],
                data: treemapData
            }],
            title: {
                text: 'Información General de Hearthstone'
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
