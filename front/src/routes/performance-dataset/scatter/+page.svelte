<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/series-label.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
</svelte:head>

<script>
    import { onMount } from "svelte";

    let DATAAPI="https://sos2324-15.appspot.com/api/v2/students-performance-dataset";
    

    async function getData() {
        try {
            const res = await fetch(DATAAPI);
            const data = await res.json();
            fillChart(data);
        } catch (error) {
            console.log(`Error fetching data: ${error}`);
        }
    }

    async function fillChart(data) {
        const chart = Highcharts.chart('container', {
            chart: {
                type: 'scatter',
                plotBorderWidth: 1,
                zoomType: 'xy'
            },
            legend: {
                enabled: false
            },
            title: {
                text: 'Relación entre Edad, Promedio de Calificación, Asistencia y Horas de Estudio'
            },
            xAxis: {
                gridLineWidth: 1,
                title: {
                    text: 'Edad'
                },
                labels: {
                    format: '{value}'
                }
            },
            yAxis: {
                title: {
                    text: 'Promedio de Calificación'
                }
            },
            tooltip: {
                useHTML: true,
                headerFormat: '<table>',
                pointFormat: '<tr><th colspan="2"><h3>{point.country}</h3></th></tr>' +
                    '<tr><th>Promedio de Calificación:</th><td>{point.y}</td></tr>' +
                    '<tr><th>Asistencia:</th><td>{point.attendance}%</td></tr>' +
                    '<tr><th>Horas de Estudio:</th><td>{point.studyHours}</td></tr>',
                footerFormat: '</table>',
                followPointer: true
            },
            plotOptions: {
                scatter: {
                    marker: {
                        radius: 5, // Tamaño base del marcador
                        symbol: 'circle',
                        lineWidth: 1, // Ancho del borde del marcador
                        lineColor: '#000000', // Color del borde del marcador
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
                    }
                }
            },
            series: [{
                data: data.map((item) => ({
                    x: item.student_age,
                    y: item.calification_average,
                    attendance: item.attendance_percentage,
                    studyHours: item.weekly_study_hours,
                    name: item.country,
                    marker: {
                        radius: item.attendance_percentage * 0.2 // Ajuste del tamaño del marcador según el porcentaje de asistencia
                    },
                    color: `rgba(255, 0, 0, ${item.weekly_study_hours / 100 * 2})` // Color de los puntos según las horas de estudio
                })),
                colorByPoint: false
            }]
        });
    }

    onMount(() => {
        getData();
    })
</script>

<div id="container" style="width: 100%; height: 400px;"></div>
<div>Esta gráfica representa la relación entre la edad de los estudiantes (en el eje x), su promedio de calificación (en el eje y), su asistencia a clases (indicada por el tamaño de los puntos), y el número de horas de estudio semanal (indicado por el color de los puntos).</div>
