<svelte:head>
    <script src="https://d3js.org/d3.v7.min.js"></script>
</svelte:head>

<script>
    import { onMount } from "svelte";

    let dataAvailable = false;
    let countryData = {};

    onMount(() => {
        fetchData();
    });

    async function fetchData() {
        const selectedCountry = document.getElementById('countrySelect').value;

        try {
            const response = await fetch(`https://covid-19-tracking.p.rapidapi.com/v1`, {
                method: 'GET',
                headers: {
                    'X-RapidAPI-Key': "c8c5805be4msh51b2331d0f2ac40p14efb1jsn56f9898c3d22",
                    'X-RapidAPI-Host': 'covid-19-tracking.p.rapidapi.com'
                }
            });
            const data = await response.json();
            countryData = data.find(d => d.Country_text === selectedCountry);
            if (countryData) {
                dataAvailable = true;
                updateChart(countryData);
            } else {
                console.error("Data for selected country not found.");
            }
        } catch (error) {
            console.error(error);
        }
    }

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

        var color = d3.scaleOrdinal()
            .domain(data.map(function (d) { return d.label; }))
            .range(["#1f77b4", "#ff7f0e", "#2ca02c"]); // Cambiar colores aquí

        var arc = d3.arc()
            .outerRadius(radius - 10)
            .innerRadius(0);

        var pie = d3.pie()
            .sort(null)
            .value(function (d) { return d.value; });

        var svg = chartContainer.append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        var g = svg.selectAll(".arc")
            .data(pie(data))
            .enter().append("g")
            .attr("class", "arc");

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

<br>
<h3>COVID-19 Data</h3>
<select id="countrySelect">
    <option value="World">World</option>
    <option value="USA">USA</option>
    <option value="France">France</option>
    <option value="Germany">Germany</option>
    <option value="Russia">Russia</option>
    <option value="Spain">Spain</option>
    <option value="Finland">Finland</option>
    <option value="Bulgaria">Bulgaria</option>
    <option value="India">China</option>
    <!-- Agregar más países aquí -->
</select>

<!-- Botón para actualizar los datos -->
<button on:click={updateData}>Buscar</button>

<!-- Contenedor para la gráfica -->
<div id="chartContainer"></div>

<!-- Contenedor para mostrar Total Deaths fuera de la gráfica -->
<div id="totalDeaths"></div>
