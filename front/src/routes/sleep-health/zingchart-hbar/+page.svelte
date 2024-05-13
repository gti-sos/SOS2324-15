<svelte:head>
    <script src="https://cdn.zingchart.com/zingchart.min.js"></script>
</svelte:head>

<script>
    import { onMount } from "svelte";

    let DATAAPI = "https://sos2324-15.appspot.com/proxyKenzo";

    async function getData() {
        try {
            const res = await fetch(DATAAPI);
            const data = await res.json();
            createChart(data);
        } catch (error) {
            console.log(`Error fetching data: ${error}`);
        }
    }

    function createChart(data) {
        const weightRanges = [
            { label: '0-40', count: 0 },
            { label: '40-70', count: 0 },
            { label: '70-90', count: 0 },
            { label: '90-120', count: 0 }
        ];

        // Count players in each weight range
        data.forEach(player => {
            if (player.weight >= 90) weightRanges[3].count++;
            else if (player.weight >= 70) weightRanges[2].count++;
            else if (player.weight >= 40) weightRanges[1].count++;
            else weightRanges[0].count++;
        });

        const chartConfig = {
            type: 'hbar',
            title: {
                text: 'Player Weight Distribution',
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
                labels: ['0-40', '40-70', '70-90', '90-120'],
                item: {
                    autoAlign: true,
                    fontSize: '14px',
                    lineColor: 'none',
                    paddingRight: '20px'
                },
                tick: {
                    visible: false
                }
            },
            scaleY: {
                visible: false
            },
            series: [
                {
                    values: weightRanges.map(range => range.count),
                    backgroundColor: ['#FF9999', '#FFCC66', '#66CCCC', '#99CC99'],
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
