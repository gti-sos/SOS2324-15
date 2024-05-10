<svelte:head>
    <script src="https://d3js.org/d3.v7.min.js"></script>
</svelte:head>

<script>
    import { onMount } from 'svelte';

    let performanceData = [];
    let populationData = {};

    async function getPerformanceData() {
        try {
            const response = await fetch("https://sos2324-15.appspot.com/api/v2/students-performance-dataset");
            performanceData = await response.json();
        } catch (error) {
            console.error(error);
        }
    }

    async function getPopulationData(country) {
        const url = `https://country55.p.rapidapi.com/api/countries?country=${country}`;
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': 'c8c5805be4msh51b2331d0f2ac40p14efb1jsn56f9898c3d22',
                'X-RapidAPI-Host': 'country55.p.rapidapi.com'
            }
        };

        try {
            const response = await fetch(url, options);
            const result = await response.json();
            populationData[country] = result;
        } catch (error) {
            console.error(error);
        }
    }

    async function combineData() {
        // Combina los datos de rendimiento y población por país
        const combinedData = performanceData.map(student => {
            const populationResponse = populationData[student.country];
            if (!populationResponse || populationResponse.population === undefined) {
                console.error(`No se encontró información de población para ${student.country}`);
                return null;
            }
            const population = populationResponse.population;
            const calificationAverage = student.calification_average;
            const calificationPercentage = (calificationAverage / 5) * 100; // Convertir la calificación a porcentaje
            const populationPercentage = population;


            return {
                country: student.country,
                calificationPercentage,
                populationPercentage
            };
        });

        // Filtra los elementos nulos
        const filteredData = combinedData.filter(data => data !== null);

        fillChart(filteredData);
    }

    function fillChart(data) {
        const margin = { top: 20, right: 20, bottom: 60, left: 60 };
        const width = 800 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        const svg = d3.select("#container")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        const x = d3.scaleBand()
            .domain(data.map(d => d.country))
            .range([0, width])
            .padding(0.1);

        const y1 = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.calificationPercentage)])
            .range([height, 0]);

        const y2 = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.populationPercentage)])
            .range([height, 0]);

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

    onMount(async () => {
        await getPerformanceData();
        const countries = [...new Set(performanceData.map(item => item.country))];
        await Promise.all(countries.map(country => getPopulationData(country)));
        combineData();
    });
</script>

<div id="container" style="width:100%; height:400px;"></div>
