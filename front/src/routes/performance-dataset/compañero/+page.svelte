<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Combined Data Bar Chart</title>
    <script src="https://d3js.org/d3.v7.min.js" charset="utf-8"></script>
</head>
<body>
    <h2>Combined Data Bar Chart</h2>
    <div id="container"></div>
    <div id="legend" style="text-align: center; margin-top: 10px;">
        <span style="color: steelblue; font-weight: bold;">Patrimonio Neto</span> &nbsp; | &nbsp;
        <span style="color: orange; font-weight: bold;">Calificación Promedio</span>
    </div>

    <script>
        const DATAAPI1 = "https://sos2324-22.appspot.com/api/v2/forbes-billionaires-list";
        const DATAAPI2 = "https://sos2324-15.appspot.com/api/v2/students-performance-dataset";

        async function fetchData() {
            try {
                const response1 = await fetch(DATAAPI1);
                const response2 = await fetch(DATAAPI2);
                const data1 = await response1.json();
                const data2 = await response2.json();
                return { data1, data2 };
            } catch (error) {
                console.error("Error fetching data:", error);
                return { data1: [], data2: [] };
            }
        }

        async function drawChart() {
            const { data1, data2 } = await fetchData();
            const mergedData = mergeData(data1, data2);

            const margin = { top: 20, right: 30, bottom: 50, left: 60 };
            const width = 600 - margin.left - margin.right;
            const height = 400 - margin.top - margin.bottom;

            const svg = d3.select("#container")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

            const x = d3.scaleBand()
                .domain(mergedData.map(d => d.country))
                .range([0, width])
                .padding(0.1);

            const yNetWorth = d3.scaleLinear()
                .domain([0, d3.max(mergedData, d => d.net_worth)])
                .range([height, 0]);

            const yAvgCalification = d3.scaleLinear()
                .domain([0, d3.max(mergedData, d => d.calification_average)])
                .range([height, 0]);

            svg.append("g")
                .attr("transform", `translate(0,${height})`)
                .call(d3.axisBottom(x));

            svg.append("g")
                .call(d3.axisLeft(yNetWorth).tickFormat(d => `$${d}B`))
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", "-5.1em")
                .attr("text-anchor", "end")
                .attr("fill", "#000")
                .text("Net Worth (in Billion $)");

            svg.append("g")
                .attr("transform", `translate(${width},0)`)
                .call(d3.axisRight(yAvgCalification).tickFormat(d => d.toFixed(2)))
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", "-5.1em")
                .attr("text-anchor", "end")
                .attr("fill", "#000")
                .text("Average Calification");

            svg.selectAll(".barNetWorth")
                .data(mergedData)
                .enter()
                .append("rect")
                .attr("class", "barNetWorth")
                .attr("x", d => x(d.country))
                .attr("y", d => yNetWorth(d.net_worth))
                .attr("width", x.bandwidth() / 2)
                .attr("height", d => height - yNetWorth(d.net_worth))
                .attr("fill", "steelblue");

            svg.selectAll(".barAvgCalification")
                .data(mergedData)
                .enter()
                .append("rect")
                .attr("class", "barAvgCalification")
                .attr("x", d => x(d.country) + x.bandwidth() / 2)
                .attr("y", d => yAvgCalification(d.calification_average))
                .attr("width", x.bandwidth() / 2)
                .attr("height", d => height - yAvgCalification(d.calification_average))
                .attr("fill", "orange");

            svg.append("text")
                .attr("transform", `translate(${width / 2},${height + margin.top + 20})`)
                .style("text-anchor", "middle")
                .text("Countries");

            svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - margin.left)
                .attr("x", 0 - (height / 2))
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .text("Net Worth (in Billion $)");

            svg.append("text")
                .attr("transform", `translate(${width},${width + margin.right}) rotate(-90)`)
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .text("Average Calification");
        }

        function mergeData(data1, data2) {
            const mergedData = [];
            for (const item1 of data1) {
                const country = item1.country.toLowerCase();
                const item2 = data2.find(item => item.country.toLowerCase() === country);
                if (item2) {
                    mergedData.push({
                        country: item1.country,
                        net_worth: item1.net_worth,
                        calification_average: item2.calification_average
                    });
                }
            }
            return mergedData;
        }

        drawChart();
    </script>
</body>
</html>
