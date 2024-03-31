<script>

import { onMount } from "svelte";
import {dev} from "$app/environment";
import Mensaje from "../Mensaje.svelte";


let API="/api/v2/students-performance-dataset";
    if(dev){
        API="http://localhost:10000/api/v2/students-performance-dataset";
    }



let Students = [];
let errorMsg = "";
let msg = "";
let newStudent = {
    country: "china",
    student_age: 25,
    sex: "Male",
    additional_work: "Yes",
    sports_activity: "No",
    transportation: "Private",
    weekly_study_hours: 17,
    reading: "Yes",
    listening_in_class: "No",
    project_work: "No",
    attendance_percentage: 84,
    calification_average: 3.5,
    date: "09/04/2023"
};




onMount(()=>{
        getStudents();
    })

    

async function getStudents(){
    let response = await fetch(API,{
                        method:"GET"
                    })

    let data = await response.json();
    Students=data;
    console.log(data);
    }

    async function deleteStudents(n){
        try{
            let response=await fetch(API+"/"+n,{
                                method:"DELETE"
                            })

            if(response.status===200){
                getStudents();
                msg="Estudiante borrado";
            }else{
                errorMsg="code: "+response.status;
            }
        }catch(e){
            errorMsg=e;
        }
    }


async function deleteGeneralStudents(){
        console.log(`Deleting all`);

        try{
            let response=await fetch(API+"/",{
                                method:"DELETE"
                            })

            if(response.status===200){
                getStudents();
                msg="Borrado general completado";
            }else{
                errorMsg="code: "+response.status;
            }
        }catch(e){
            errorMsg=e;
        }
    }

    async function createStudent(){

try{
    let response=await fetch(API,{
                        method:"POST",
                        headers:{
                            "Content-Type":"application/json"
                        },
                        body:JSON.stringify(newStudent,null,2)
                    })

    let status=await response.status;
    console.log(`Creation response status ${status}`);
    if(status===201){
        getStudents();
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
        <Mensaje tipo="error" mensaje={`Existe un dato con país ${newStudent.country}`}/>
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
                <input bind:value={newStudent.country}>
            </td>
            <td>
                <input type="number" bind:value={newStudent.age}>
            </td>
            <td>
                <input bind:value={newStudent.sex}>
            </td>
            <td>
                <input bind:value={newStudent.additional_work}>
            </td>
            <td>
                <input bind:value={newStudent.sports_activity}>
            </td>
            <td>
                <input bind:value={newStudent.transportation}>
            </td>
            <td>
                <input type="number" bind:value={newStudent.weekly_study_hours}>
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
                <input bind:value={newStudent.reading}>
            </td>
            <td>
                <input bind:value={newStudent.listening_in_class}>
            </td>
            <td>
                <input bind:value={newStudent.project_work}>
            </td>
            <td>
                <input type="number" bind:value={newStudent.attendance_percentage}>
            </td>
            <td>
                <input type="number" bind:value={newStudent.calification_average}>
            </td>
            <td>
                <input bind:value={newStudent.date}>
            </td>

        </tr>
    </tbody>

</table>

<ul>
    {#each Students as Student }
    <li> <a href="/performance-dataset/{Student.country}/{Student.age}">{Student.country} - {Student.age}</a>  <button on:click="{deleteStudents(Student.country+"/"+Student.student_age)}">Borrar</button> </li>
    
    {/each}
    <button on:click="{createStudent}">Crear datos académicos</button>
    <button on:click="{deleteGeneralStudents}">Eliminar lista</button>
</ul>



