<svelte:head>
    <!-- Cargamos la biblioteca Highcharts desde su CDN -->
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <!-- Cargamos el módulo de exportación de Highcharts para permitir la exportación de gráficos -->
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <!-- Cargamos el módulo de exportación de datos de Highcharts para exportar los datos del gráfico -->
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
</svelte:head>

<script>
    // Importamos onMount de Svelte para ejecutar código cuando el componente se monta
    import { onMount } from "svelte";

    // Definimos la URL de la API de datos
    let DATAAPI = "https://sos2324-15.appspot.com/api/v2/students-performance-dataset";

    // Función para obtener los datos de la API
    async function getData() {
        try {
            // Realizamos una solicitud fetch a la API
            const res = await fetch(DATAAPI);
            // Convertimos la respuesta en un objeto JSON
            const data = await res.json();
            // Llamamos a la función createChart pasando los datos obtenidos
            createChart(data);
        } catch (error) {
            // En caso de error, lo mostramos en la consola
            console.log(`Error fetching data: ${error}`);
        }
    }

    // Función para crear el gráfico utilizando Highcharts
    function createChart(data) {
        // Procesamos los datos para contar la cantidad de estudiantes por país y rango de edad
        const processedData = processData(data);

        // Creamos el gráfico de barras apiladas con Highcharts
        const chart = Highcharts.chart('container', {
            chart: {
                type: 'bar' // Tipo de gráfico: barra
            },
            title: {
                text: 'Distribución de Estudiantes por País y Rango de Edad' // Título del gráfico
            },
            xAxis: {
                categories: processedData.ageRanges, // Categorías del eje X (rangos de edad)
                tickInterval: 1, // Establecemos el intervalo de los ticks del eje X a 1
                title: {
                    text: 'Rango de edad' // Título del eje X
                }
            },
            yAxis: {
                min: 0, // Valor mínimo del eje Y
                title: {
                    text: 'Cantidad de Estudiantes' // Título del eje Y
                }
            },
            legend: {
                reversed: true // Invertimos el orden de la leyenda
            },
            plotOptions: {
                series: {
                    stacking: 'normal' // Configuramos las series para apilarlas
                }
            },
            series: processedData.series // Datos de las series procesadas
        });
    }

    // Función para procesar los datos obtenidos de la API
    function processData(data) {
        // Definimos los rangos de edad
        const ageRanges = ['0-10', '11-20', '21-30', '31-40', '41-50', '51+'];

        // Inicializamos un objeto para contar los estudiantes por país y rango de edad
        const countsByCountryAndAgeRange = {};

        // Recorremos cada estudiante en los datos obtenidos
        data.forEach(student => {
            const country = student.country; // Obtenemos el país del estudiante
            const age = student.student_age; // Obtenemos la edad del estudiante
            const ageRange = getAgeRange(age); // Obtenemos el rango de edad del estudiante

            // Si no existe el país en el objeto, lo inicializamos
            if (!countsByCountryAndAgeRange[country]) {
                countsByCountryAndAgeRange[country] = {};
            }

            // Si no existe el rango de edad en el país, lo inicializamos
            if (!countsByCountryAndAgeRange[country][ageRange]) {
                countsByCountryAndAgeRange[country][ageRange] = 0;
            }

            // Incrementamos el contador de estudiantes para el país y rango de edad
            countsByCountryAndAgeRange[country][ageRange]++;
        });

        // Procesamos los datos en el formato esperado por Highcharts
        const series = Object.keys(countsByCountryAndAgeRange).map(country => ({
            name: country, // Nombre del país
            data: ageRanges.map(range => countsByCountryAndAgeRange[country][range] || 0) // Datos de estudiantes por rango de edad
        }));

        return {
            ageRanges, // Rangos de edad
            series // Series de datos
        };
    }

    // Función para obtener el rango de edad basado en la edad del estudiante
    function getAgeRange(age) {
        if (age <= 10) {
            return '0-10';
        } else if (age <= 20) {
            return '11-20';
        } else if (age <= 30) {
            return '21-30';
        } else if (age <= 40) {
            return '31-40';
        } else if (age <= 50) {
            return '41-50';
        } else {
            return '51+';
        }
    }

    // Ejecutamos la función getData cuando el componente se monta
    onMount(() => {
        getData();
    });
</script>

<!-- Contenedor del gráfico -->
<div id="container" style="width: 100%; height: 400px;"></div>
