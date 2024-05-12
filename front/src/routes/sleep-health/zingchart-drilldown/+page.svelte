<svelte:head>
    <script src="https://cdn.zingchart.com/zingchart.min.js"></script>
</svelte:head>

<script>
    import { onMount } from "svelte";

    let DATAAPI = "https://myanimelist.p.rapidapi.com/anime/top/all";

    async function getData() {
        try {
            const response = await fetch(DATAAPI, {
                headers: {
                    'X-RapidAPI-Key': '0dc3a0ede5msha185d0707695226p16642djsn7d00483d4d85',
                    'X-RapidAPI-Host': 'myanimelist.p.rapidapi.com'
                }
            });
            const data = await response.json();
            createChart(data);
        } catch (error) {
            console.log(`Error fetching data: ${error}`);
        }
    }

    function createChart(data) {
        const topAnimes = data.slice(0, 10).map(anime => ({
            title: anime.title,
            rank: anime.rank
        }));

        const chartConfig = {
            type: 'bar',
            title: {
                text: 'Top 10 Animes',
                backgroundColor: 'none',
                fontColor: '#A4A4A4',
                fontFamily: 'Arial',
                fontSize: '18px'
            },
            plot: {
                animation: {
                    delay: 300,
                    effect: 'ANIMATION_EXPAND_TOP',
                    method: 'ANIMATION_LINEAR',
                    sequence: 'ANIMATION_BY_PLOT_AND_NODE',
                    speed: '500'
                },
                barsOverlap: '100%',
                borderRadius: '8px',
                hoverState: {
                    visible: false
                }
            },
            plotarea: {
                margin: '60px 20px 20px 140px'
            },
            scaleX: {
                labels: topAnimes.map(anime => anime.title),
                item: {
                    autoAlign: true,
                    fontSize: '10px',
                    lineColor: 'none',
                    paddingRight: '20px'
                }
            },
            scaleY: {
                visible: true
            },
            series: [
                {
                    values: topAnimes.map(anime => anime.rank),
                    text: topAnimes.map(anime => anime.title),
                    backgroundColor: ['#6699CC', '#9966CC', '#6633CC', '#9933CC', '#CC66CC', '#CC66FF', '#FF66FF', '#FF99FF', '#FF99CC', '#FF9966'],
                    barWidth: '40px',
                    borderColor: '#e8e3e3',
                    fillAngle: 90
                }
            ]
        };

        zingchart.render({
            id: 'myChart',
            data: chartConfig,
            height: '500px',
            width: '100%'
        });
    }

    onMount(() => {
        getData();
    })
</script>

<div id="myChart"></div>
