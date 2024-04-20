<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
</svelte:head>

<script>
    import { onMount } from "svelte";

    let DATAAPI = "http://localhost:10000/api/v2/students-performance-in-exams";

    async function getData() {
        try {
            const res = await fetch(DATAAPI);
            const data = await res.json();
            createChart(data);
        } catch (error) {
            console.log(`Error fetching data: ${error}`);
        }
    }

    function createChart(data) {
        // Procesar los datos para contar la cantidad de estudiantes por etnia y rango de reading_score
        const processedData = processData(data);

        // Crear el gráfico de área
        const chart = Highcharts.chart('container', {
            chart: {
                type: 'area'
            },
            title: {
                text: 'Distribución de Estudiantes por Etnia y Rango de nota de lectura'
            },
            xAxis: {
                categories: processedData.readingScoreRanges,
                tickInterval: 1,
                title: {
                    text: 'Rango de nota de lectura'
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Cantidad de Estudiantes'
                }
            },
            legend: {
                reversed: true
            },
            plotOptions: {
                area: {
                    stacking: 'normal'
                }
            },
            series: processedData.series
        });
    }

    function processData(data) {
        // Definir los rangos de reading_score
        const readingScoreRanges = ['0-20', '21-40', '41-60', '61-80', '81-100'];

        // Inicializar contadores por etnia y rango de reading_score
        const countsByEthnicityAndReadingScoreRange = {};

        // Contar la cantidad de estudiantes por etnia y rango de reading_score
        data.forEach(student => {
            const ethnicity = student.race_ethnicity;
            const readingScore = student.reading_score;
            const readingScoreRange = getReadingScoreRange(readingScore);
            if (!countsByEthnicityAndReadingScoreRange[ethnicity]) {
                countsByEthnicityAndReadingScoreRange[ethnicity] = {};
            }
            if (!countsByEthnicityAndReadingScoreRange[ethnicity][readingScoreRange]) {
                countsByEthnicityAndReadingScoreRange[ethnicity][readingScoreRange] = 0;
            }
            countsByEthnicityAndReadingScoreRange[ethnicity][readingScoreRange]++;
        });

        // Procesar los datos en el formato esperado por Highcharts
        const series = Object.keys(countsByEthnicityAndReadingScoreRange).map(ethnicity => ({
            name: ethnicity,
            data: readingScoreRanges.map(range => countsByEthnicityAndReadingScoreRange[ethnicity][range] || 0)
        }));

        return {
            readingScoreRanges,
            series
        };
    }

    function getReadingScoreRange(readingScore) {
        if (readingScore <= 20) {
            return '0-20';
        } else if (readingScore <= 40) {
            return '21-40';
        } else if (readingScore <= 60) {
            return '41-60';
        } else if (readingScore <= 80) {
            return '61-80';
        } else {
            return '81-100';
        }
    }

    onMount(() => {
        getData();
    })
</script>

<div id="container" style="width: 100%; height: 400px;"></div>
