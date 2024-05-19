<svelte:head>
    <!-- Cargamos la biblioteca D3.js desde un CDN -->
    <script src="https://d3js.org/d3.v7.min.js"></script>
</svelte:head>

<script>
    // Importamos onMount de Svelte para ejecutar código cuando el componente se monta
    import { onMount } from "svelte";

    // Indicador de disponibilidad de datos
    let dataAvailable = false;
    // Objeto para almacenar los datos del país seleccionado
    let countryData = {};

    // Ejecutamos la función fetchData cuando el componente se monta
    onMount(() => {
        fetchData();
    });

    // Función asíncrona para obtener los datos del país seleccionado
    async function fetchData() {
        // Obtenemos el valor del país seleccionado en el elemento select
        const selectedCountry = document.getElementById('countrySelect').value;
        // Construimos la URL para la API de datos COVID-19
        const url = `https://covid-19-tracking.p.rapidapi.com/v1/${selectedCountry.toLowerCase()}`;
        // Opciones para la solicitud fetch
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': 'bb72de2ab2mshe618cbc704dd147p19ad8cjsnf39d149f3e42',
                'X-RapidAPI-Host': 'covid-19-tracking.p.rapidapi.com'
            }
        };

        try {
            // Realizamos la solicitud fetch a la API
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            // Convertimos la respuesta en objeto JSON
            countryData = await response.json();
            // Indicamos que los datos están disponibles
            dataAvailable = true;
            // Actualizamos la gráfica con los datos obtenidos
            updateChart(countryData);
        } catch (error) {
            // En caso de error, lo mostramos en la consola
            console.error("Fetch error:", error);
        }
    }

    // Función para actualizar la gráfica con los datos proporcionados
    function updateChart(countryData) {
        // Seleccionar el elemento contenedor de la gráfica
        var chartContainer = d3.select("#chartContainer");

        // Limpiar el contenedor
        chartContainer.html("");

        // Crear los datos para la gráfica
        var data = [
            { label: "Total Cases", value: parseFloat(countryData["Total Cases_text"].replace(/,/g, '')) },
            { label: "Total Deaths", value: parseFloat(countryData["Total Deaths_text"].replace(/,/g, '')) },
            { label: "Total Recovered", value: parseFloat(countryData["Total Recovered_text"].replace(/,/g, '')) }
        ];

        // Crear la gráfica de tipo pie
        var width = 400;
        var height = 400;
        var radius = Math.min(width, height) / 2;

        // Definir la escala de colores para las secciones de la gráfica
        var color = d3.scaleOrdinal()
            .domain(data.map(function (d) { return d.label; }))
            .range(["#1f77b4", "#ff7f0e", "#2ca02c"]); // Cambiar colores aquí

        // Definir los arcos de la gráfica
        var arc = d3.arc()
            .outerRadius(radius - 10)
            .innerRadius(0);

        // Definir la función de pie para los datos
        var pie = d3.pie()
            .sort(null)
            .value(function (d) { return d.value; });

        // Crear el elemento SVG donde se dibujará la gráfica
        var svg = chartContainer.append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        // Crear los elementos g para cada sección de la gráfica
        var g = svg.selectAll(".arc")
            .data(pie(data))
            .enter().append("g")
            .attr("class", "arc");

        // Dibujar los arcos en la gráfica
        g.append("path")
            .attr("d", arc)
            .style("fill", function (d) { return color(d.data.label); });

        // Añadir etiquetas dentro de la gráfica
        g.append("text")
            .attr("transform", function (d) { return "translate(" + arc.centroid(d) + ")"; })
            .attr("dy", ".35em")
            .text(function (d) { return d.data.label; });

        // Mostrar los valores numéricos en las secciones de la gráfica
        g.append("text")
            .attr("transform", function (d) { return "translate(" + arc.centroid(d) + ")"; })
            .attr("dy", "1.5em")
            .style("text-anchor", "middle")
            .text(function (d) {
                // Formatear el valor numérico
                var formattedValue = formatNumber(d.data.value);
                return formattedValue;
            })
            .style("font-size", "14px"); // Ajustar el tamaño de la fuente aquí

        // Mostrar Total Deaths fuera de la gráfica
        var totalDeaths = d3.select("#totalDeaths");
        totalDeaths.text("Total Deaths: " + countryData["Total Deaths_text"]);
    }

    // Función para formatear el número
    function formatNumber(number) {
        // Formatear el número con comas y asegurarse de que siempre tenga dos decimales
        return number.toLocaleString(undefined, { minimumFractionDigits: 0 });
    }

    // Función para actualizar los datos al hacer clic en el botón
    function updateData() {
        fetchData();
    }
</script>

<style>
    h3 {
        text-align: center;
    }
</style>

<!-- Encabezado de la página -->
<br>
<h3>COVID-19 Data</h3>

<!-- Selección de país -->
<select id="countrySelect">
    <option value="world">World</option>
    <option value="usa">USA</option>
    <option value="france">France</option>
    <option value="germany">Germany</option>
    <option value="russia">Russia</option>
    <option value="spain">Spain</option>
    <option value="finland">Finland</option>
    <option value="bulgaria">Bulgaria</option>
    <option value="china">China</option>
    <!-- Agregar más países aquí -->
</select>

<!-- Botón para actualizar los datos -->
<button on:click={updateData}>Buscar</button>

<!-- Contenedor para la gráfica -->
<div id="chartContainer"></div>

<!-- Contenedor para mostrar Total Deaths fuera de la gráfica -->
<div id="totalDeaths"></div>
