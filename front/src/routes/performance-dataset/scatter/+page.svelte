<svelte:head>
    <!-- Importar Highcharts y los módulos necesarios -->
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/series-label.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
</svelte:head>

<script>
    // Importar onMount de Svelte para ejecutar código cuando el componente se monta
    import { onMount } from "svelte";

    // URL de la API de datos de rendimiento de estudiantes
    let DATAAPI = "https://sos2324-15.appspot.com/api/v2/students-performance-dataset";

    // Función para obtener datos de la API
    async function getData() {
        try {
            // Realizar la solicitud a la API
            const res = await fetch(DATAAPI);
            // Convertir la respuesta en un objeto JSON
            const data = await res.json();
            // Llamar a fillChart para crear el gráfico con los datos obtenidos
            fillChart(data);
        } catch (error) {
            // Manejo de errores
            console.log(`Error fetching data: ${error}`);
        }
    }

    // Función para crear y llenar el gráfico con los datos obtenidos
    async function fillChart(data) {
        const chart = Highcharts.chart('container', {
            chart: {
                type: 'scatter', // Tipo de gráfico
                plotBorderWidth: 1, // Ancho del borde del gráfico
                zoomType: 'xy' // Tipo de zoom
            },
            legend: {
                enabled: false // Desactivar la leyenda
            },
            title: {
                text: 'Relación entre Edad, Promedio de Calificación, Asistencia y Horas de Estudio' // Título del gráfico
            },
            xAxis: {
                gridLineWidth: 1, // Ancho de la línea de la cuadrícula
                title: {
                    text: 'Edad' // Título del eje X
                },
                labels: {
                    format: '{value}' // Formato de las etiquetas del eje X
                }
            },
            yAxis: {
                title: {
                    text: 'Promedio de Calificación' // Título del eje Y
                }
            },
            tooltip: {
                useHTML: true, // Usar HTML en el tooltip
                headerFormat: '<table>', // Formato del encabezado del tooltip
                pointFormat: '<tr><th colspan="2"><h3>{point.country}</h3></th></tr>' +
                    '<tr><th>Promedio de Calificación:</th><td>{point.y}</td></tr>' +
                    '<tr><th>Asistencia:</th><td>{point.attendance}%</td></tr>' +
                    '<tr><th>Horas de Estudio:</th><td>{point.studyHours}</td></tr>', // Formato del contenido del tooltip
                footerFormat: '</table>', // Formato del pie del tooltip
                followPointer: true // Seguir el puntero con el tooltip
            },
            plotOptions: {
                scatter: {
                    marker: {
                        radius: 5, // Tamaño base del marcador
                        symbol: 'circle', // Símbolo del marcador
                        lineWidth: 1, // Ancho del borde del marcador
                        lineColor: '#000000', // Color del borde del marcador
                        states: {
                            hover: {
                                enabled: true, // Habilitar efecto hover
                                lineColor: 'rgb(100,100,100)' // Color del borde en hover
                            }
                        }
                    },
                    states: {
                        hover: {
                            marker: {
                                enabled: false // Deshabilitar el marcador en hover
                            }
                        }
                    }
                }
            },
            series: [{
                // Configurar la serie de datos para el gráfico
                data: data.map((item) => ({
                    x: item.student_age, // Edad del estudiante (eje X)
                    y: item.calification_average, // Promedio de calificación (eje Y)
                    attendance: item.attendance_percentage, // Asistencia del estudiante
                    studyHours: item.weekly_study_hours, // Horas de estudio semanales
                    name: item.country, // País del estudiante
                    marker: {
                        radius: item.attendance_percentage * 0.2 // Ajuste del tamaño del marcador según el porcentaje de asistencia
                    },
                    color: `rgba(255, 0, 0, ${item.weekly_study_hours / 100 * 2})` // Color de los puntos según las horas de estudio
                })),
                colorByPoint: false // No colorear cada punto por separado
            }]
        });
    }

    // Ejecutar getData() al montar el componente
    onMount(() => {
        getData();
    })
</script>

<!-- Contenedor para el gráfico -->
<div id="container" style="width: 100%; height: 400px;"></div>

<!-- Descripción del gráfico -->
<div>Esta gráfica representa la relación entre la edad de los estudiantes (en el eje x), su promedio de calificación (en el eje y), su asistencia a clases (indicada por el tamaño de los puntos), y el número de horas de estudio semanal (indicado por el color de los puntos).</div>
