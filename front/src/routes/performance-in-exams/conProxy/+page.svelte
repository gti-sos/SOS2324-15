<svelte:head>

    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"></script>

</svelte:head>

<script>
  import { onMount } from 'svelte';

  let dataAvailable = false; 
  const apiUrl1 = 'https://sos2324-11.appspot.com/api/v2/structural-payment-data';
  const apiUrl2 = 'https://www.thesportsdb.com/api/v1/json/3/search_all_teams.php?s=Soccer&c=Spain';
  let yearData = [];

  async function fetchData(url) {
    const response = await fetch(url);
    const data = await response.json();
    console.log('Data fetched from', url, data);
    return data;
  }

  async function combinedData() {
    const data1 = await fetchData(apiUrl1);
    const data2 = await fetchData(apiUrl2);

    // Verificar si hay datos disponibles en ambas fuentes
    if (!Array.isArray(data1) || !data2 || !Array.isArray(data2.teams)) {
        console.error('No se pudieron obtener los datos de ambas fuentes.');
        return;
    }

    const combinedData = {};

    if (data1.length === 0) {
        dataAvailable = false;
      } else {
        dataAvailable=true;

    // Iterar sobre los datos de la URL1 y construir un conjunto de años
    const yearsFromData1 = new Set(data1.map(entry => parseInt(entry.year , 10)));
    console.log("Años url1", yearsFromData1)
    const yearsFromData2 = new Set(data2.teams.map(team => parseInt(team.intFormedYear, 10)));
    console.log("Años url2", yearsFromData2)

    //Encomtarr años en comun
    const commonYears = Array.from(new Set([...yearsFromData1].filter(year => yearsFromData2.has(year))));
    console.log("Años comun", commonYears)

       // Iterar sobre los años comunes y obtener los datos correspondientes de cada URL
       commonYears.forEach(year => {
            const dataFromUrl1 = data1.find(entry => entry.year === year );
            const dataFromUrl2 = data2.teams.find(team => team.intFormedYear === year.toString());
            console.log("1", dataFromUrl1)
            console.log("2", dataFromUrl2)
            if (dataFromUrl1 && dataFromUrl2) {
                // Asegurarse de que combinedData sea un objeto para poder agregar propiedades
                if (!combinedData[year]) {
                    combinedData[year] = {
                        year: year,
                        net_planned_eu_amount: 0,
                        idAPIfootball: 0,
                    };
                }
                combinedData[year].net_planned_eu_amount = dataFromUrl1.net_planned_eu_amount || 0;
                combinedData[year].idAPIfootball += dataFromUrl2.idAPIfootball || 0;
        
            }
        });

    
  }

    // Filtrar solo los años comunes con datos en ambas fuentes
    yearData = Object.values(combinedData);
    console.log("Datos combinados" , yearData);
  
}


function createChart() {
    if (!dataAvailable) return; 
    if (!yearData || yearData.length === 0) return;

    Highcharts.chart('chart-container', {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Datos combinados por año'
        },
        xAxis: {
            categories: yearData.map(data => data.year)
        },
        yAxis: [{
            title: {
                text: 'Popularity Rate'
            }
        }, {
            title: {
                text: 'ID API Football'
            },
            opposite: true
        }],
        series: [{
            name: 'Popularity Rate',
            data: yearData.map(data => data.net_planned_eu_amount),
            yAxis: 0,
            dataLabels: {
                enabled: true,
                format: '{y}'
            }
        }, {
            name: 'ID API Football',
            data: yearData.map(data => parseInt(data.idAPIfootball)),
            yAxis: 1,
            dataLabels: {
                enabled: true,
                format: '{y}'
            },
            pointWidth: 40 // Ajustar el ancho de la columna de la serie "ID API Football"
        }]
    });
}   
  
    onMount(async () => {
      await combinedData();
    if (dataAvailable) {
      createChart();
    }
    });

</script>