<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gráfico de Área con D3.js</title>
    <!-- Incluye la biblioteca D3.js -->
    <script src="https://d3js.org/d3.v6.min.js"></script>
</head>
<body>
    <!-- Contenedor para el gráfico -->
    <div id="chart-container"></div>

    <script>
        // URL de la API de datos
        const DATAAPI = "https://sos2324-15.appspot.com/api/v2/students-performance-dataset";

        // Función asincrónica para obtener los datos de la API
        async function getData() {
            try {
                const res = await fetch(DATAAPI);
                const data = await res.json();
                createChart(data); // Llama a la función para crear el gráfico
            } catch (error) {
                console.log(`Error fetching data: ${error}`);
            }
        }

        function createChart(data) {
            // Agrupar los datos por país y sexo
            const avgCalificationByCountryAndSex = d3.rollups(
                data,
                v => d3.mean(v, d => d.calification_average),
                d => d.country,
                d => d.sex
            );

            // Convertir los datos a un formato compatible con D3.js
            const dataset = Array.from(avgCalificationByCountryAndSex, ([country, values]) => ({
                country,
                male: values.find(d => d[0].toLowerCase() === "male")?.[1] || 0,
                female: values.find(d => d[0].toLowerCase() === "female")?.[1] || 0
            }));

            // Crear el contenedor SVG
            const svg = d3.select("#chart-container")
                .append("svg")
                .attr("width", 800)
                .attr("height", 600);

            // Crear escalas
            const xScale = d3.scaleBand()
                .domain(dataset.map(d => d.country))
                .range([50, 750])
                .padding(0.1);

            const yScale = d3.scaleLinear()
                .domain([0, d3.max(dataset, d => Math.max(d.male, d.female))])
                .nice()
                .range([550, 50]);

            // Crear generador de áreas
            const area = d3.area()
                .x(d => xScale(d.country) + xScale.bandwidth() / 2)
                .y0(d => yScale(d.male))
                .y1(d => yScale(d.female));

            // Dibujar áreas masculinas
            svg.selectAll(".male-area")
                .data([dataset.filter(d => d.male > 0)])
                .join("path")
                .attr("class", "male-area")
                .attr("d", d => area(d))
                .attr("fill", "steelblue")
                .attr("opacity", 0.6);

            // Dibujar áreas femeninas
            svg.selectAll(".female-area")
                .data([dataset.filter(d => d.female > 0)])
                .join("path")
                .attr("class", "female-area")
                .attr("d", d => area(d))
                .attr("fill", "salmon")
                .attr("opacity", 0.6);

            // Crear ejes
            const xAxis = d3.axisBottom(xScale);
            const yAxis = d3.axisLeft(yScale);

            // Agregar ejes al SVG
            svg.append("g")
                .attr("transform", "translate(0, 550)")
                .call(xAxis);

            svg.append("g")
                .attr("transform", "translate(50, 0)")
                .call(yAxis);

            // Agregar etiquetas de los ejes
            svg.append("text")
                .attr("x", 400)
                .attr("y", 590)
                .text("País");

            svg.append("text")
                .attr("x", -300)
                .attr("y", 10)
                .attr("transform", "rotate(-90)")
                .text("Promedio de Calificación");

            // Crear leyenda
            const legend = svg.append("g")
                .attr("class", "legend")
                .attr("transform", "translate(700,50)");

            // Define los datos y colores para la leyenda
            const legendData = ["Masculino", "Femenino"];
            const legendColors = ["steelblue", "salmon"];

            // Agregar rectángulos coloreados a la leyenda
            legend.selectAll("rect")
                .data(legendData)
                .enter()
                .append("rect")
                .attr("x", 0)
                .attr("y", (d, i) => i * 20)
                .attr("width", 10)
                .attr("height", 10)
                .attr("fill", (d, i) => legendColors[i]);

            // Agregar etiquetas a la leyenda
            legend.selectAll("text")
                .data(legendData)
                .enter()
                .append("text")
                .attr("x", 15)
                .attr("y", (d, i) => i * 20 + 9)
                .text(d => d);
        }

        // Llama a la función `getData` cuando el componente está montado
        getData();
    </script>
</body>
</html>
