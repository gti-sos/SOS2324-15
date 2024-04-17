<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>

</svelte:head>

<script>
    import {onMount} from "svelte";

    let DATAAPI = "http://localhost:10000/data";
    
    async function getData(){
        try{
            const res = await fetch(DATAAPI);
            const data = await res.json();
            console.log(`Data received: ${JSON.stringify(data,null,2)}'`);
            fillChart(data.map((o)=> o.v)); 
        } catch (error){
            console.log( `Error fetching data: ${error}`);
        } 
    }


    async function fillChart(d){
        const chart = Highcharts.chart('container', {
                            chart: {
                                type: 'line'
                            },
                            title: {
                                text: 'Sample SOS Graph'
                            },
                            yAxis: {
                                title: {
                                    text: 'SOS Data'
                                }
                            },
                            plotOptions: {
                                line: {
                                    dataLabels: {
                                        enabled: true
                                    },
                                    enableMouseTracking: false
                                }
                            },
                            series: [{
                                name: 'My data',
                                data: d}
                            ]
                        });

    }

    onMount(()=>{
        getData();
    })


</script>


<div id="container" style="width:100%; height:400px;"></div>