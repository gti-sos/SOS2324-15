<svelte:head>
    <!-- Cargamos la biblioteca D3.js desde su CDN -->
    <script src="https://d3js.org/d3.v7.min.js"></script>
</svelte:head>

<script>
    // Importamos onMount de Svelte para ejecutar código cuando el componente se monta
    import { onMount } from 'svelte';

    // Definimos variables para almacenar los datos de rendimiento y de población
    let performanceData = [];
    let populationData = {};

    // Función para obtener los datos de rendimiento de la API
    async function getPerformanceData() {
        try {
            // Realizamos una solicitud fetch a la API de rendimiento
            const response = await fetch("https://sos2324-15.appspot.com/api/v2/students-performance-dataset");
            // Convertimos la respuesta en un objeto JSON y lo almacenamos en performanceData
            performanceData = await response.json();
        } catch (error) {
            // En caso de error, lo mostramos en la consola
            console.error(error);
        }
    }

    // Función para obtener los datos de población de la API para un país específico
    async function getPopulationData(country) {
        // Construimos la URL para la solicitud de datos de población
        const url = `https://country55.p.rapidapi.com/api/countries?country=${country}`;
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': 'c8c5805be4msh51b2331d0f2ac40p14efb1jsn56f9898c3d22',
                'X-RapidAPI-Host': 'country55.p.rapidapi.com'
            }
        };

        try {
            // Realizamos una solicitud fetch a la API de población
            const response = await fetch(url, options);
            // Convertimos la respuesta en un objeto JSON y lo almacenamos en populationData
            const result = await response.json();
            populationData[country] = result;
        } catch (error) {
            // En caso de error, lo mostramos en la consola
            console.error(error);
        }
    }

    // Función para combinar los datos de rendimiento y población por país
    async function combineData() {
        // Combina los datos de rendimiento y población por país
        const combinedData = performanceData.map(student => {
            const populationResponse = populationData[student.country];
            if (!populationResponse || populationResponse.population === undefined) {
                // En caso de no encontrar información de población, mostramos un error en la consola y retornamos null
                console.error(`No se encontró información de población para ${student.country}`);
                return null;
            }
            const population = populationResponse.population;
            const calificationAverage = student.calification_average;
            // Convertimos la calificación promedio a un porcentaje
            const calificationPercentage = (calificationAverage / 5) * 100;
            const populationPercentage = population;

            // Retornamos un objeto con los datos combinados
            return {
                country: student.country,
                calificationPercentage,
                populationPercentage
            };
        });

        // Filtramos los elementos nulos
        const filteredData = combinedData.filter(data => data !== null);

        // Llamamos a la función fillChart pasando los datos filtrados
        fillChart(filteredData);
    }

    // Función para crear el gráfico utilizando D3.js
    function fillChart(data) {
        // Definimos márgenes y dimensiones del gráfico
        const margin = { top: 20, right: 20, bottom: 60, left: 60 };
        const width = 800 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        // Creamos un elemento SVG dentro del contenedor con id "container"
        const svg = d3.select("#container")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // Configuramos la escala x (band) y la escala y1 (lineal)
        const x = d3.scaleBand()
            .domain(data.map(d => d.country))
            .range([0, width])
            .padding(0.1);

        const y1 = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.calificationPercentage)])
            .range([height, 0]);

        // Configuramos la escala y2 (lineal)
        const y2 = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.populationPercentage)])
            .range([height, 0]);

        // Añadimos los ejes x y y al gráfico
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        svg.append("g")
            .call(d3.axisLeft(y1))
            .append("text")
            .attr("fill", "#000")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "-5.1em")
            .attr("text-anchor", "end")
            .text("Calificación Promedio (%)");

        svg.append("g")
            .attr("transform", "translate(" + width + " ,0)")
            .call(d3.axisRight(y2))
            .append("text")
            .attr("fill", "#000")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "-5.1em")
            .attr("text-anchor", "end")
            .text("Población (%)");

        // Añadimos las barras del gráfico para calificación
        svg.selectAll(".bar1")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "bar1")
            .attr("x", d => x(d.country))
            .attr("y", d => y1(d.calificationPercentage))
            .attr("width", x.bandwidth() / 2)
            .attr("height", d => height - y1(d.calificationPercentage))
            .style("fill", "steelblue");

        // Añadimos las barras del gráfico para población
        svg.selectAll(".bar2")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "bar2")
            .attr("x", d => x(d.country) + x.bandwidth() / 2)
            .attr("y", d => y2(d.populationPercentage))
            .attr("width", x.bandwidth() / 2)
            .attr("height", d => height - y2(d.populationPercentage))
            .style("fill", "orange");
    }

    // Ejecutamos la función getData cuando el componente se monta
    onMount(async () => {
        await getPerformanceData();
        const countries = [...new Set(performanceData.map(item => item.country))];
        await Promise.all(countries.map(country => getPopulationData(country)));
        combineData();
    });
</script>

<!-- Contenedor del gráfico -->
<div id="container" style="width:100%; height:400px;"></div>
