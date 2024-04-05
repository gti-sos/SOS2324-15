<script>

    import { onMount } from "svelte";
    import {dev} from "$app/environment";
    import Mensaje from  "../../../Mensaje.svelte";
    
    
    let API="/api/v2/students-performance-dataset";
        if(dev){
            API="http://localhost:10000/api/v2/students-performance-dataset";
        }

    import {page} from '$app/stores';
    let pais=$page.params.country;
    let edad=$page.params.student_age;
    let paisElegido={};
    let datos=[];
    let paisAnt=pais;
    let edadAnt=edad;
    let msg="";
    let errorMsg="";

    onMount(()=>{
        getStudent();
        getStudentElegido();
    })

    async function getStudent(){
        let response=await fetch(API,{
                            method:"GET"
                        })

        let data=await response.json();
        datos=data;
    }

    async function getStudentElegido(){
        let response=await fetch(API,{
                            method:"GET"
                        });
        let data=await response.json();
        datos=data
        datos.forEach((s) => {
            if(s.country===pais && s.student_age===Number(edad)){
                paisElegido=s;
            }
        });
        if(paisElegido.country===undefined || paisElegido===null ){
            errorMsg="code: "+404;
        }
    }
    async function putStudent(pais,edad){
        try{
            let response=await fetch(API+"/"+pais+"/"+edad,{
                method:"PUT",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(paisElegido,null,2)
            });
            let status=await response.status;
            console.log(`Creation response status ${status}`);
            if(status===200){
                getStudent();
                msg="Cambios actualizados correctamente";
            }else{
                errorMsg="code: "+status;
            }
        }catch(e){
            errorMsg=e;
        }
    }
    
    async function actualizaDatos(){
        paisAnt=paisElegido.country;
        edadAnt=paisElegido.student_age;
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
        <Mensaje tipo="error" mensaje={`No existe un contacto con nacionalidad ${pais} y edad ${edad}`}/>
    {/if}
</div>
{/if}

<table>
    <thead>
        <tr>
            <th>
                Country
            </th>
            <th>
                Edad
            </th>
            <th>
                Sex
            </th>
            <th>
                Trabajo adicional
            </th>
            <th>
                Actividad deportiva
            </th>
            <th>
                Transporte
            </th>
            <th>
                Horas de estudio a la semana
            </th>
            
            
        </tr>

    </thead>
    <tbody>
        <tr>
            <td>
                <input bind:value={paisElegido.country}>
            </td>
            <td>
                <input type="number" bind:value={paisElegido.student_age}>
            </td>
            <td>
                <input bind:value={paisElegido.sex}>
            </td>
            <td>
                <input bind:value={paisElegido.additional_work}>
            </td>
            <td>
                <input bind:value={paisElegido.sports_activity}>
            </td>
            <td>
                <input bind:value={paisElegido.transportation}>
            </td>
            <td>
                <input type="number" bind:value={paisElegido.weekly_study_hours}>
            </td>
        </tr>

    </tbody>
    <thead>
        <tr>
            <th>
                Lee
            </th>
            <th>
                Atencion en clase
            </th>
            <th>
                Proyecto de trabajo
            </th>
            <th>
                Porcentaje de Atencion
            </th>
            <th>
                Calificacion media
            </th>
            <th>
                Fecha
            </th>

        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                <input bind:value={paisElegido.reading}>
            </td>
            <td>
                <input bind:value={paisElegido.listening_in_class}>
            </td>
            <td>
                <input bind:value={paisElegido.project_work}>
            </td>
            <td>
                <input type="number" bind:value={paisElegido.attendance_percentage}>
            </td>
            <td>
                <input type="number" bind:value={paisElegido.calification_average}>
            </td>
            <td>
                <input bind:value={paisElegido.date}>
            </td>

        </tr>
    </tbody>

</table>

<form action="/performance-dataset/{paisElegido.country}/{paisElegido.student_age}">
    <button type="submit"  on:click="{putStudent(paisAnt,edadAnt)}" on:click="{actualizaDatos}">Guardar cambios</button> 
</form>
<style>
button {
    background-color:#02b073;
    color: white;
    padding: 10px 20px; /* Ajusta el padding según sea necesario */
    border: none;
    border-radius: 5px;
    margin-right: 10px; /* Ajusta el margen entre botones */
    margin-bottom: 10px; /* Ajusta el margen inferior de los botones */
  }

</style>