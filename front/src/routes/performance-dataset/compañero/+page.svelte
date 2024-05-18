<svelte:head>
  <script src="https://code.highcharts.com/highcharts.js"></script>
</svelte:head>

<script>
  import { onMount } from 'svelte';

  let chartContainer;

  async function fetchData() {
    const DATAAPI1 = "https://sos2324-22.appspot.com/api/v2/forbes-billionaires-list";
    const DATAAPI2 = "https://sos2324-15.appspot.com/api/v2/students-performance-dataset";

    try {
      const response1 = await fetch(DATAAPI1);
      const response2 = await fetch(DATAAPI2);
      const data1 = await response1.json();
      const data2 = await response2.json();
      const mergedData = mergeData(data1, data2);
      return mergedData;
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  }

  function normalizeCountryName(countryName) {
    // Normalizar el nombre del país a minúsculas
    return countryName.toLowerCase();
  }

  function mergeData(data1, data2) {
    const mergedData = [];
    for (const item1 of data1) {
      const country = normalizeCountryName(item1.country);
      const item2 = data2.find(item => normalizeCountryName(item.country) === country);
      if (item2) {
        mergedData.push({
          country: country,
          net_worth: item1.net_worth,
          calification_average: item2.calification_average
        });
      }
    }
    return mergedData;
  }

  function drawChart(mergedData) {
    const categories = mergedData.map(d => d.country);
    const netWorth = mergedData.map(d => d.net_worth);
    const avgCalification = mergedData.map(d => d.calification_average);

    Highcharts.chart(chartContainer, {
      chart: {
        polar: true,
        type: 'line'
      },
      title: {
        text: 'Gráfico de Radar de Datos Combinados'
      },
      xAxis: {
        categories: categories,
        tickmarkPlacement: 'on',
        lineWidth: 0
      },
      yAxis: {
        gridLineInterpolation: 'polygon',
        lineWidth: 0,
        min: 0
      },
      tooltip: {
        shared: true
      },
      series: [{
        name: 'Patrimonio Neto',
        data: netWorth,
        pointPlacement: 'on',
        color: 'rgba(54, 162, 235, 0.5)'
      }, {
        name: 'Calificación Promedio',
        data: avgCalification,
        pointPlacement: 'on',
        color: 'rgba(255, 159, 64, 0.5)'
      }]
    });
  }

  onMount(async () => {
    const mergedData = await fetchData();
    if (mergedData.length > 0) {
      drawChart(mergedData);
    }
  });
</script>

<div bind:this={chartContainer}></div>

<style>
  div {
    width: 600px;
    height: 400px;
  }
</style>
