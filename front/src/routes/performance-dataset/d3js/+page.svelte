<svelte:head>
    <meta charset="UTF-8"> <!-- Define el juego de caracteres utilizado (UTF-8) -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0"> <!-- Configura el ancho de la ventana gráfica para dispositivos móviles -->
    <title>Gráfico de Área con D3.js</title> <!-- Define el título del documento -->
    <!-- Incluye la biblioteca D3.js desde una CDN -->
    <script src="https://d3js.org/d3.v6.min.js"></script>
</svelte:head>

<script>
    import { onMount } from "svelte"; // Importa la función onMount de Svelte

    const DATAAPI = "https://sos2324-15.appspot.com/api/v2/students-performance-dataset"; // URL de la API de datos

    onMount(() => { // Llama a fetchData cuando el componente se monta
        fetchData();
    });

    async function fetchData() { // Función asíncrona para obtener datos de la API
        try {
            const res = await fetch(DATAAPI); // Realiza una solicitud fetch a la URL de la API y espera la respuesta
            const data = await res.json(); // Convierte la respuesta en un objeto JSON
            createChart(data); // Llama a la función para crear el gráfico
        } catch (error) { // Captura errores durante la obtención de datos
            console.log(`Error fetching data: ${error}`);
        }
    }

    function createChart(data) { // Función para crear el gráfico
        // Agrupa los datos por país y sexo, calculando la media de calificaciones
        const avgCalificationByCountryAndSex = d3.rollups(
            data,
            v => d3.mean(v, d => d.calification_average), // Calcula la media de las calificaciones
            d => d.country, // Agrupa por país
            d => d.sex // Agrupa por sexo
        );

        // Convierte los datos a un formato compatible con D3.js
        const dataset = Array.from(avgCalificationByCountryAndSex, ([country, values]) => ({
            country, // País del grupo de datos
            male: values.find(d => d[0].toLowerCase() === "male")?.[1] || 0, // Promedio de calificación para hombres
            female: values.find(d => d[0].toLowerCase() === "female")?.[1] || 0 // Promedio de calificación para mujeres
        }));

        // Crea el contenedor SVG
        const svg = d3.select("#chart-container")
            .append("svg") // Añade un elemento SVG
            .attr("width", 800) // Define el ancho del SVG
            .attr("height", 600); // Define el alto del SVG

        // Crea escalas
        const xScale = d3.scaleBand()
            .domain(dataset.map(d => d.country)) // Define el dominio de la escala X basado en los países
            .range([50, 750]) // Define el rango de la escala X
            .padding(0.1); // Define el espaciado entre bandas

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(dataset, d => Math.max(d.male, d.female))]) // Define el dominio de la escala Y basado en las calificaciones máximas
            .nice() // Ajusta el dominio para que los extremos sean "bonitos"
            .range([550, 50]); // Define el rango de la escala Y

        // Crea el generador de áreas
        const area = d3.area()
            .x(d => xScale(d.country) + xScale.bandwidth() / 2) // Define la posición X de cada punto
            .y0(d => yScale(d.male)) // Define la posición Y de la base del área (para hombres)
            .y1(d => yScale(d.female)); // Define la posición Y del tope del área (para mujeres)

        // Dibuja áreas masculinas
        svg.selectAll(".male-area")
            .data([dataset.filter(d => d.male > 0)]) // Filtra datos para áreas masculinas
            .join("path") // Une datos al elemento path
            .attr("class", "male-area") // Asigna la clase CSS
            .attr("d", d => area(d)) // Define la forma del área usando el generador de áreas
            .attr("fill", "steelblue") // Color de relleno para áreas masculinas
            .attr("opacity", 0.6); // Define la opacidad

        // Dibuja áreas femeninas
        svg.selectAll(".female-area")
            .data([dataset.filter(d => d.female > 0)]) // Filtra datos para áreas femeninas
            .join("path") // Une datos al elemento path
            .attr("class", "female-area") // Asigna la clase CSS
            .attr("d", d => area(d)) // Define la forma del área usando el generador de áreas
            .attr("fill", "salmon") // Color de relleno para áreas femeninas
            .attr("opacity", 0.6); // Define la opacidad

        // Crea ejes
        const xAxis = d3.axisBottom(xScale); // Crea el eje X basado en la escala X
        const yAxis = d3.axisLeft(yScale); // Crea el eje Y basado en la escala Y

        // Agrega ejes al SVG
        svg.append("g")
            .attr("transform", "translate(0, 550)") // Coloca el eje X en la posición correcta
            .call(xAxis); // Llama al generador de ejes para dibujar el eje X

        svg.append("g")
            .attr("transform", "translate(50, 0)") // Coloca el eje Y en la posición correcta
            .call(yAxis); // Llama al generador de ejes para dibujar el eje Y

        // Agrega etiquetas de los ejes
        svg.append("text")
            .attr("x", 400) // Posición X de la etiqueta
            .attr("y", 590) // Posición Y de la etiqueta
            .text("País"); // Texto de la etiqueta del eje X

        svg.append("text")
            .attr("x", -300) // Posición X de la etiqueta
            .attr("y", 10) // Posición Y de la etiqueta
            .attr("transform", "rotate(-90)") // Rota la etiqueta -90 grados
            .text("Promedio de Calificación"); // Texto de la etiqueta del eje Y

        // Crea leyenda
        const legend = svg.append("g")
            .attr("class", "legend") // Asigna la clase CSS
            .attr("transform", "translate(700,50)"); // Posiciona la leyenda

        // Define los datos y colores para la leyenda
        const legendData = ["Masculino", "Femenino"]; // Datos de la leyenda
        const legendColors = ["steelblue", "salmon"]; // Colores de la leyenda

        // Agrega rectángulos coloreados a la leyenda
        legend.selectAll("rect")
            .data(legendData) // Une los datos a los elementos rect
            .enter() // Entra en el modo de unión de datos
            .append("rect") // Añade un rectángulo para cada entrada de datos
            .attr("x", 0) // Posición X del rectángulo
            .attr("y", (d, i) => i * 20) // Posición Y basada en el índice
            .attr("width", 10) // Ancho del rectángulo
            .attr("height", 10) // Alto del rectángulo
            .attr("fill", (d, i) => legendColors[i]); // Color de relleno basado en los colores de la leyenda

        // Agrega etiquetas a la leyenda
        legend.selectAll("text")
            .data(legendData) // Une los datos a los elementos text
            .enter() // Entra en el modo de unión de datos
            .append("text") // Añade un texto para cada entrada de datos
            .attr("x", 15) // Posición X del texto
            .attr("y", (d, i) => i * 20 + 9) // Posición Y basada en el índice
            .text(d => d); // Texto basado en los datos de la leyenda
    }
</script>

<!-- Contenedor para el gráfico -->
<div id="chart-container"></div>
