<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
</svelte:head>

<script>
    import { onMount } from "svelte";

    let DATAAPI = "https://sos2324-15.appspot.com/api/v2/students-performance-in-exams";

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
        // Procesar los datos para contar la cantidad de estudiantes por país y rango de math_score
        const processedData = processData(data);

        // Crear el gráfico de columnas apiladas
        const chart = Highcharts.chart('container', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Distribución de Estudiantes por País y Rango de Nota Matemática'
            },
            xAxis: {
                categories: processedData.mathScoreRanges,
                tickInterval: 1,
                title: {
                    text: 'Rango de Nota Matemática'
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
                series: {
                    stacking: 'normal'
                }
            },
            series: processedData.series
        });
    }

    function processData(data) {
        // Definir los rangos de math_score
        const mathScoreRanges = ['0-20', '21-40', '41-60', '61-80', '81-100'];

        // Inicializar contadores por país y rango de math_score
        const countsByCountryAndMathScoreRange = {};

        // Contar la cantidad de estudiantes por país y rango de math_score
        data.forEach(student => {
            const country = student.country;
            const mathScore = student.math_score;
            const mathScoreRange = getMathScoreRange(mathScore);
            if (!countsByCountryAndMathScoreRange[country]) {
                countsByCountryAndMathScoreRange[country] = {};
            }
            if (!countsByCountryAndMathScoreRange[country][mathScoreRange]) {
                countsByCountryAndMathScoreRange[country][mathScoreRange] = 0;
            }
            countsByCountryAndMathScoreRange[country][mathScoreRange]++;
        });

        // Procesar los datos en el formato esperado por Highcharts
        const series = Object.keys(countsByCountryAndMathScoreRange).map(country => ({
            name: country,
            data: mathScoreRanges.map(range => countsByCountryAndMathScoreRange[country][range] || 0)
        }));

        return {
            mathScoreRanges,
            series
        };
    }

    function getMathScoreRange(mathScore) {
        if (mathScore <= 20) {
            return '0-20';
        } else if (mathScore <= 40) {
            return '21-40';
        } else if (mathScore <= 60) {
            return '41-60';
        } else if (mathScore <= 80) {
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
