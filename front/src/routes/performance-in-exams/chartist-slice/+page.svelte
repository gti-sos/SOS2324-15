<svelte:head>
    <script src="https://cdn.jsdelivr.net/npm/chartist/dist/chartist.min.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/chartist/dist/chartist.min.css">
</svelte:head>

<script>
    import { onMount } from "svelte";

    let dataAvailable = false;
    let genres = [];

    onMount(() => {
        getData();
    });

    async function getData() {
        const url = 'https://streaming-availability.p.rapidapi.com/genres';
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': '8a2c80dd91msh64b38b25bf27192p195e18jsnceff42e30ed3',
                'X-RapidAPI-Host': 'streaming-availability.p.rapidapi.com'
            }
        };

        try {
            const response = await fetch(url, options);
            const result = await response.json();
            console.log(result);
            genres = Object.entries(result.result).map(([id, genre]) => ({ id, genre }));
            if (genres.length > 0) {
                dataAvailable = true;
                createGraphChartist(genres);
            }
        } catch (error) {
            console.error(error);
        }
    }

    function createGraphChartist(data) {
        var options = {
            labelInterpolationFnc: function(value) {
                return value[0]
            }
        };

        var responsiveOptions = [
            ['screen and (min-width: 640px)', {
                chartPadding: 30,
                labelOffset: 100,
                labelDirection: 'explode',
                labelInterpolationFnc: function(value) {
                    return value;
                }
            }],
            ['screen and (min-width: 1024px)', {
                labelOffset: 80,
                chartPadding: 20
            }]
        ];

        var colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33E0', '#33E0FF', '#E0FF33', '#FF3333', '#33FF33', '#3333FF', '#FFFF33', '#33FFFF', '#FF5733', '#33FF57', '#3357FF', '#FF33E0', '#33E0FF', '#E0FF33', '#FF3333', '#33FF33', '#3333FF'];

        var chartData = {
            labels: data.map(item => item.genre),
            series: data.map((item, index) => ({
                value: 1,
                meta: item.genre,
            }))
        };

        var chart = new Chartist.Pie('.ct-chart', chartData, options, responsiveOptions);

        // Apply colors to slices
        chart.on('draw', function(data) {
            if(data.type === 'slice') {
                var index = data.index;
                data.element._node.style.fill = colors[index];
                data.element._node.style.stroke = colors[index];
            }
        });
    }
</script>

<style>
    .ct-chart {
        width: 100%;
        height: 350px;
        margin-bottom: 20px; 
    }
    h3 {
        text-align: center;
    }
</style>

<br>
<h3>Géneros de películas y series</h3>
<div class="ct-chart"></div>
