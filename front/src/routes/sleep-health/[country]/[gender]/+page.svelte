<script>

    import { onMount } from "svelte";
    import {dev} from "$app/environment";
    import Mensaje from "../../../Mensaje.svelte";

    let API="/api/v2/students-sleep-health";
    if(dev){
        API="http://localhost:10000/api/v2/students-sleep-health";
    }
    import {page} from '$app/stores';
    let pais=$page.params.country;
    let sexo=$page.params.gender;
    let aElegido={};
    let misDatos=[];
    let errorMsg="";
    let msg="";
    let paisAnt=pais;
    let sexoAnt=sexo;

    onMount(()=>{
        getSleep();
        getAlumnoElegido();
    })

    async function getSleep(){
        let response=await fetch(API,{
                            method:"GET"
                        })

        let data=await response.json();
        misDatos=data;
    }

    async function actualizaDatos(){
        paisAnt=aElegido.country;
        sexoAnt=aElegido.gender;
    }


    async function getAlumnoElegido(){
        let response=await fetch(API,{
                            method:"GET"
                        })

        let data=await response.json();
        misDatos=data
        misDatos.forEach((j) => {
            if(j.country===pais && j.gender===sexo){
                aElegido=j;
            }
        });
        if(aElegido.person_id===undefined || aElegido===null ){ 
            errorMsg="code: "+404;
        }

        
    }


    async function updateSleep(n){

        try{
            let response=await fetch(API+"/"+n,{
                                method:"PUT",
                                headers:{
                                    "Content-Type":"application/json"
                                },
                                body:JSON.stringify(aElegido,null,2)
                            })

            let status=await response.status;
            console.log(`Creation response status ${status}`);
            if(status===200){
                getSleep();
                msg="Cambios actualizados correctamente";
            }else{
                errorMsg="code: "+status;
            }
        }catch(e){
            errorMsg=e;
        }

    }



</script>

{#if msg!=""}
<div>
    <Mensaje tipo="exito" mensaje={msg} />
</div>
{/if}
{#if errorMsg!=""}
<div>
    {#if errorMsg=="code: 400"}
        <Mensaje tipo="error" mensaje="La petición realizada es incorrecta" />
    {/if}
    {#if errorMsg=="code: 404"}
        <Mensaje tipo="error" mensaje={`No existe un contacto con nacionalidad ${pais} y sexo ${sexo}`}/>
    {/if}
</div>   
{/if}

<table>
    <thead>
        <tr>
            <th>
                Identificador
            </th>
            <th>
                Género
            </th>
            <th>
                Edad
            </th>
            <th>
                Grado Universitario
            </th>
            <th>
                Calidad de sueño
            </th>
            <th>
                Nivel de actividad física
            </th>
        </tr>

    </thead>
    <tbody>
        <tr>
            <td>
                <input type="number" bind:value={aElegido.person_id}>
            </td>
            <td>
                <input bind:value={aElegido.gender}>
            </td>
            <td>
                <input type="number" bind:value={aElegido.age}>
            </td>
            <td>
                <input bind:value={aElegido.bachelor_degree}>
            </td>
            <td>
                <input type="number" bind:value={aElegido.quality_of_sleep}>
            </td>
            <td>
                <input type="number" bind:value={aElegido.physical_activity_level}>
            </td>
        </tr>

    </tbody>
    <thead>
        <tr>
            <th>
                Nivel de estrés
            </th>
            <th>
                Masa Corporal
            </th>
            <th>
                Pasos diarios
            </th>
            <th>
                Trastorno del Sueño
            </th>
            <th>
                País
            </th>
            <th>
                Fecha de Registro
            </th>

        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                <input type="number" bind:value={aElegido.stress_level}>
            </td>
            <td>
                <input bind:value={aElegido.bmi_category}>
            </td>
            <td>
                <input type="number" bind:value={aElegido.daily_steps}>
            </td>
            <td>
                <input bind:value={aElegido.sleep_disorder}>
            </td>
            <td>
                <input bind:value={aElegido.country}>
            </td>
            <td>
                <input bind:value={aElegido.date}>
            </td>

        </tr>
    </tbody>

</table>

<br>
<form action="/sleep-health/{aElegido.country}/{aElegido.gender}">
    <button type="submit"  on:click="{updateSleep(`${paisAnt}/${sexoAnt}`)}" on:click="{actualizaDatos}">Actualiza los datos</button> 
</form>

<br>