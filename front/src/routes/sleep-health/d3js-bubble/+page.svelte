<svelte:head>
    <script src="https://d3js.org/d3.v7.min.js"></script>
</svelte:head>

<script>
    import { onMount } from "svelte";

    const studentSleepAPI = 'https://sos2324-15.appspot.com/api/v2/students-sleep-health';
    const covidAPI = 'https://covid-193.p.rapidapi.com/statistics';
    const covidHeaders = {
        'X-RapidAPI-Key': '5521785c1amshf4a2f48314b1a49p12527bjsn35d8a0deed98',
        'X-RapidAPI-Host': 'covid-193.p.rapidapi.com'
    };

    async function fetchData() {
        try {
            // Fetch data from student sleep API
            const studentResponse = await fetch(studentSleepAPI);
            const studentData = await studentResponse.json();

            // Fetch data from COVID API
            const covidResponse = await fetch(covidAPI, { headers: covidHeaders });
            const covidData = await covidResponse.json();

            // Verifica si hay datos en 'response'
            if (covidData && covidData.response) {
                // Accede a los datos dentro de 'response'
                const responseData = covidData.response;

                // Filtrar solo los países en común entre ambas APIs
                const commonCountries = studentData
                    .map(student => student.country.toLowerCase())
                    .filter(country => responseData.some(data => data.country.toLowerCase() === country));

                // Filtrar los datos para los países en común
                const filteredStudentData = studentData.filter(student => commonCountries.includes(student.country.toLowerCase()));
                const filteredCovidData = responseData.filter(data => commonCountries.includes(data.country.toLowerCase()));

                // Llama a la función para crear el gráfico
                createChart(filteredStudentData, filteredCovidData);
            } else {
                console.error('No se encontraron datos en la respuesta de la API COVID');
            }
        } catch (error) {
            console.error('Error al obtener los datos:', error);
        }
    }

    function createChart(studentData, covidData) {
        // Specify the dimensions of the chart.
        const width = 600;
        const height = 400;
        const margin = 10;

        // Create the SVG container.
        const svg = d3.select("#chart-container")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        // Compute the maximum quality of sleep.
        const maxQuality = d3.max(studentData, d => d.quality_of_sleep);
        const maxCases = d3.max(covidData, d => d.cases.total);

        // Scale for the radius of the circles.
        const radiusScale = d3.scaleLinear()
            .domain([0, maxQuality])
            .range([20, 50]); // Adjust the range for the size of the bubbles

        // Scale for the color of the circles.
        const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

        // Create a force simulation.
        const simulation = d3.forceSimulation(covidData)
            .force("x", d3.forceX(width / 2).strength(0.05))
            .force("y", d3.forceY(height / 2).strength(0.05))
            .force("collide", d3.forceCollide().radius(d => radiusScale(getSleepQuality(d.country)) + 2).iterations(2));

        // Place each bubble according to the country and quality of sleep.
        const node = svg.selectAll("circle")
            .data(covidData)
            .enter().append("circle")
            .attr("r", d => radiusScale(getSleepQuality(d.country))) // Size of the bubble
            .attr("fill", d => colorScale(d.country)) // Color of the bubble
            .attr("fill-opacity", 0.7)
            .on("mouseover", function (event, d) {
                // Show the quality of sleep and COVID cases when hovering over the bubble
                const tooltip = svg.append("g")
                    .attr("class", "tooltip")
                    .style("display", "none");

                tooltip.append("rect")
                    .attr("width", 120)
                    .attr("height", 60)
                    .attr("fill", "white")
                    .style("opacity", 0.7);

                tooltip.append("text")
                    .text(`Quality of Sleep: ${getSleepQuality(d.country)}`)
                    .attr("x", 10)
                    .attr("y", 20);

                tooltip.append("text")
                    .text(`COVID Cases: ${d.cases.total}`)
                    .attr("x", 10)
                    .attr("y", 40);

                tooltip.attr("transform", `translate(${d3.pointer(event)[0]}, ${d3.pointer(event)[1]})`);
                tooltip.style("display", "block");
            })
            .on("mouseout", function (event, d) {
                // Hide the tooltip when mouse leaves the bubble
                d3.select(".tooltip").remove();
            });

        // Run the simulation and update the positions of the bubbles.
        simulation.on("tick", () => {
            node.attr("cx", d => d.x)
                .attr("cy", d => d.y);
        });

        // Function to get the quality of sleep for a country.
        function getSleepQuality(country) {
            const student = studentData.find(student => student.country.toLowerCase() === country.toLowerCase());
            return student ? student.quality_of_sleep : "No data";
        }

        // Add legend
        const legend = svg.selectAll(".legend")
            .data(colorScale.domain())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function (d, i) {
                return "translate(0," + i * 20 + ")";
            });

        // Add legend colored rectangles
        legend.append("rect")
            .attr("x", width - 18)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", colorScale);

        // Add legend text
        legend.append("text")
            .attr("x", width - 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function (d) {
                return d;
            });

    }

    onMount(() => {
        fetchData();
    }); 
</script>

<div id="chart-container">
    <h2>Distribución de calidad de sueño y casos COVID por país</h2>
</div>
