<script>
    import { onMount } from "svelte";
    import {dev} from "$app/environment";
    import Mensaje from "../Mensaje.svelte";
     
    let API="/api/v1/students-sleep-health";
    if(dev){
        API="http://localhost:10000/api/v1/students-sleep-health";
    }

    let sleep=[];
    let errorMsg="";
    let msg="";
    let newSleep = {person_id: 13, 
                    gender: 'Male', 
                    age: 25, 
                    bachelor_degree: 'Software Engineer', 
                    quality_of_sleep: 6, 
                    physical_activity_level: 42, 
                    stress_level: 6, 
                    bmi_category: 'Overweight', 
                    daily_steps: 4200, 
                    sleep_disorder: 'None', 
                    country: 'malaysia', 
                    date: '6/27/2023'};

    onMount(()=>{
        getSleep();
    })

    async function getSleep(){
        let response=await fetch(API,{
                            method:"GET"
                        })

        let data=await response.json();
        sleep=data;
        console.log(data);
    }

    async function deleteSleep(id,n){
        console.log(`Deleting student number${id}`);

        try{
            let response=await fetch(API+"/"+n,{
                                method:"DELETE"
                            })

            if(response.status===200){
                getSleep();
                msg="Estudiante borrado";
            }else{
                errorMsg="code: "+response.status;
            }
        }catch(e){
            errorMsg=e;
        }
    }

    async function deleteGeneralSleep(){
        console.log(`Deleting all`);

        try{
            let response=await fetch(API+"/",{
                                method:"DELETE"
                            })

            if(response.status===200){
                getSleep();
                msg="Borrado general completado";
            }else{
                errorMsg="code: "+response.status;
            }
        }catch(e){
            errorMsg=e;
        }
    }

    async function createSleep(){

        try{
            let response=await fetch(API,{
                                method:"POST",
                                headers:{
                                    "Content-Type":"application/json"
                                },
                                body:JSON.stringify(newSleep,null,2)
                            })

            let status=await response.status;
            console.log(`Creation response status ${status}`);
            if(status===201){
                getSleep();
                msg="Estudiante creado correctamente";
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
    {#if errorMsg=="code: 409"}
        <Mensaje tipo="error" mensaje={`Existe un dato con país ${newSleep.country}`}/>
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
                <input type="number" bind:value={newSleep.person_id}>
            </td>
            <td>
                <input bind:value={newSleep.gender}>
            </td>
            <td>
                <input type="number" bind:value={newSleep.age}>
            </td>
            <td>
                <input bind:value={newSleep.bachelor_degree}>
            </td>
            <td>
                <input type="number" bind:value={newSleep.quality_of_sleep}>
            </td>
            <td>
                <input type="number" bind:value={newSleep.physical_activity_level}>
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
                <input type="number" bind:value={newSleep.stress_level}>
            </td>
            <td>
                <input bind:value={newSleep.bmi_category}>
            </td>
            <td>
                <input type="number" bind:value={newSleep.daily_steps}>
            </td>
            <td>
                <input bind:value={newSleep.sleep_disorder}>
            </td>
            <td>
                <input bind:value={newSleep.country}>
            </td>
            <td>
                <input bind:value={newSleep.date}>
            </td>

        </tr>
    </tbody>

</table>

<ul>
    {#each sleep as sleep_j}
        <li> <a href="/sleep-health/{sleep_j.country}/{sleep_j.gender}">{sleep_j.country} - {sleep_j.age}</a>  <button on:click="{deleteSleep(sleep_j.person_id,sleep_j.country+"/"+sleep_j.gender)}">Borrar</button> </li>
        
    {/each}
    <br>
    <br>
    <button on:click="{createSleep}">Crear estudiante nuevo </button> <button on:click="{deleteGeneralSleep}">Eliminar lista</button>
</ul>     




