<svelte:head>
    <script src="https://cdn.amcharts.com/lib/5/index.js"></script>
    <script src="https://cdn.amcharts.com/lib/5/percent.js"></script>
    <script src="https://cdn.amcharts.com/lib/5/map.js"></script>
    <script src="https://cdn.amcharts.com/lib/5/themes/Animated.js"></script>
    <script src="https://cdn.amcharts.com/lib/5/geodata/continentsLow.js"></script>
    <script src="https://cdn.amcharts.com/lib/5/geodata/worldLow.js"></script>
</svelte:head>

<script>
    import { onMount } from "svelte";
    let dataAvailable = false;

    let DATAAPI = "https://sos2324-11.appspot.com/api/v2/structural-payment-data";

    async function getData() {
        try {
            const res = await fetch(DATAAPI);
            const data = await res.json();

            if (data.length > 0) {
                dataAvailable = true;
                createAmchartsGraph(data);
            }
        } catch (error) {
            console.log(`Error fetching data: ${error}`);
        }
    }

    // Crear un gráfico de mapa utilizando amcharts
    function createAmchartsGraph(data) {

var root = am5.Root.new("chartdiv");

// Establecer temas
root.setThemes([
    am5themes_Animated.new(root)
]);

// Crear el gráfico de mapa
var chart = root.container.children.push(am5map.MapChart.new(root, {
    panX: "translateX",
    panY: "translateY",
    projection: am5map.geoMercator(),
}));

// Crear el título del gráfico
var title = root.container.children.push(am5.Label.new(root, {
    text: 'Número de datos por país',
    fontSize: 30,
    fontWeight: "bold",
    x: am5.percent(35), 
    y: am5.percent(0),
    fill: am5.color("#333"), 


}));

// Crear la serie principal de polígonos para los países
var polygonSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {
    geoJSON: am5geodata_worldLow,
    exclude: ["AQ"] // Excluir la Antártida
}));

// Agrupar y sumar los datos por país
const groupedData = data.reduce((acc, item) => {
    if (!acc[item.ms]) {
        acc[item.ms] = {
            id: item.ms,
            name: item.ms_name,
            value: 0
        };
    }
    acc[item.ms].value += 1;
    return acc;
}, {});

// Convertir el objeto agrupado en un array
const filteredData = Object.values(groupedData);

// Asignar los valores acumulados a los polígonos
polygonSeries.data.setAll(filteredData.map(item => ({
    id: item.id,
    name: item.name,
    value: item.value // Usar el valor acumulado para el mapa
})));

// Configurar tooltips para mostrar información sobre los países
polygonSeries.mapPolygons.template.setAll({
    tooltipText: "{name}: {value}",
    toggleKey: "active",
    interactive: true
});

// Crear estados para los polígonos al pasar el mouse y al hacer clic
polygonSeries.mapPolygons.template.states.create("hover", {
    fill: root.interfaceColors.get("primaryButtonHover") // Cambiar el color de fondo al pasar el mouse
});

polygonSeries.mapPolygons.template.states.create("active", {
    fill: root.interfaceColors.get("primaryButtonHover") // Cambiar el color de fondo al hacer clic
});

var previousPolygon;

// Manejar el evento de activación de un polígono
polygonSeries.mapPolygons.template.on("active", function (active, target) {
    if (previousPolygon && previousPolygon != target) {
        previousPolygon.set("active", false); // Desactivar el polígono anterior
    }
    if (target.get("active")) {
        polygonSeries.zoomToDataItem(target.dataItem); // Enfocar el mapa en el país seleccionado
    }
    else {
        chart.goHome(); // Volver al nivel de zoom inicial si se hace clic fuera de un polígono
    }
    previousPolygon = target;
});

// Añadir control de zoom
chart.set("zoomControl", am5map.ZoomControl.new(root, {}));

// Configurar el clic en el fondo del mapa para volver al nivel de zoom inicial
chart.chartContainer.get("background").events.on("click", function () {
    chart.goHome();
});

// Hacer que las cosas se animen al cargar
chart.appear(1000, 100);
}


    onMount(async () => {
        await getData();
    });
</script>

<style>
    #chartdiv {
        width: 100%;
        height: 410px;
        margin-bottom: 20px; 
    }
</style>

<br>
<div id="chartdiv"></div>
