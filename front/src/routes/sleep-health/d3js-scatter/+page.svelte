<svelte:head>
    <script src="https://d3js.org/d3.v7.min.js"></script>
</svelte:head>

<script>
    import { onMount } from "svelte";

    const API_URL = 'https://job-salary-data.p.rapidapi.com/job-salary?job_title=nodejs%20developer&location=new%20york%2C%20usa&radius=200';
    const API_HEADERS = {
        'X-RapidAPI-Key': '5521785c1amshf4a2f48314b1a49p12527bjsn35d8a0deed98',
    'X-RapidAPI-Host': 'job-salary-data.p.rapidapi.com'
    };

    async function fetchData() {
        try {
            const response = await fetch(API_URL, { headers: API_HEADERS });
            const data = await response.json();
            createChart(data.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    function createChart(data) {
        const width = 600;
        const height = 400;
        const margin = { top: 40, right: 20, bottom: 80, left: 100 }; // Ajuste del margen izquierdo

        // Encontrar el valor máximo para los salarios mínimos y máximos
        const maxSalary = d3.max(data, d => d.max_salary);
        const minSalary = d3.min(data.filter(d => d.min_salary > 0), d => d.min_salary);

        const svg = d3.select("#chart-container")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        const maxDomain = Math.max(maxSalary, minSalary);

        const x = d3.scaleLinear()
            .domain([0, maxDomain])
            .range([margin.left, width - margin.right]);

        const y = d3.scaleLinear()
            .domain([0, maxDomain])
            .range([height - margin.bottom, margin.top]);

        svg.append("g")
            .attr("transform", `translate(0, ${height - margin.bottom})`)
            .call(d3.axisBottom(x))
            .append("text")
            .attr("x", width / 2)
            .attr("y", margin.bottom / 1.5)
            .attr("fill", "black")
            .attr("font-weight", "bold")
            .attr("text-anchor", "middle")
            .text("Max Salary");

        svg.append("g")
            .attr("transform", `translate(${margin.left}, 0)`)
            .call(d3.axisLeft(y))
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", -margin.left / 2)
            .attr("dy", "1em") // Ajuste vertical
            .attr("fill", "black")
            .attr("font-weight", "bold")
            .attr("text-anchor", "middle")
            .text("Min Salary");

        svg.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", d => x(d.max_salary))
            .attr("cy", d => y(d.min_salary))
            .attr("r", 5)
            .style("fill", "steelblue");

        svg.append("text")
            .attr("x", width / 2)
            .attr("y", margin.top / 2)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("font-weight", "bold")
            .text("Salary Scatter Plot");
    }

    onMount(() => {
        fetchData();
    });
</script>

<div id="chart-container"></div>
