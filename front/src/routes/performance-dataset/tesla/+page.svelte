<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tesla Quotes</title>
    <script src="https://d3js.org/d3.v7.min.js"></script>
</head>
<body>
    <label for="region">Select a Region:</label>
    <select id="region">
        <option value="US">United States</option>
        <option value="BR">Brazil</option>
        <option value="AU">Australia</option>
        <option value="CA">Canada</option>
        <option value="FR">France</option>
        <option value="DE">Germany</option>
        <option value="HK">Hong Kong</option>
        <option value="IN">India</option>
        <option value="IT">Italy</option>
        <option value="ES">Spain</option>
        <option value="GB">United Kingdom</option>
        <option value="SG">Singapore</option>
    </select>
    <button onclick="fetchData()">Search</button>
    <div id="chart"></div>

    <script>
        async function fetchData() {
            const region = document.getElementById('region').value;
            const url = `https://yh-finance.p.rapidapi.com/auto-complete?q=tesla&region=${region}`;
            const options = {
                method: 'GET',
                headers: {
                    'X-RapidAPI-Key': 'c8c5805be4msh51b2331d0f2ac40p14efb1jsn56f9898c3d22',
                    'X-RapidAPI-Host': 'yh-finance.p.rapidapi.com'
                }
            };

            try {
                const response = await fetch(url, options);
                const result = await response.json();
                console.log(result);

                // Limpiamos el div del gráfico si ya existe uno
                d3.select("#chart").selectAll("*").remove();

                // Creamos el gráfico
                const svg = d3.select("#chart")
                    .append("svg")
                    .attr("width", 800)
                    .attr("height", 400);

                const quotes = result.quotes;
                const data = quotes.map(quote => ({ name: quote.symbol, score: quote.score }));

                const margin = { top: 20, right: 20, bottom: 60, left: 40 };
                const width = +svg.attr("width") - margin.left - margin.right;
                const height = +svg.attr("height") - margin.top - margin.bottom;

                const x = d3.scaleBand().rangeRound([0, width]).padding(0.1);
                const y = d3.scaleLinear().rangeRound([height, 0]);

                const g = svg.append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                x.domain(data.map(d => d.name));
                y.domain([0, d3.max(data, d => d.score)]);

                g.append("g")
                    .attr("class", "axis axis-x")
                    .attr("transform", "translate(0," + height + ")")
                    .call(d3.axisBottom(x))
                    .append("text")
                    .attr("x", width / 2)
                    .attr("y", margin.bottom - 10)
                    .attr("fill", "#000")
                    .attr("text-anchor", "middle")
                    .text("Ticker Symbol");

                g.append("g")
                    .attr("class", "axis axis-y")
                    .call(d3.axisLeft(y).ticks(10))
                    .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", -margin.left + 10)
                    .attr("x", -height / 2)
                    .attr("fill", "#000")
                    .attr("text-anchor", "middle")
                    .text("Score");

                g.selectAll(".bar")
                    .data(data)
                    .enter().append("rect")
                    .attr("class", "bar")
                    .attr("x", d => x(d.name))
                    .attr("y", d => y(d.score))
                    .attr("width", x.bandwidth())
                    .attr("height", d => height - y(d.score));
            } catch (error) {
                console.error(error);
            }
        }
    </script>
</body>
</html>
