<script>

    import { onMount } from "svelte";
    import {dev} from "$app/environment";
    import Mensaje from "../Mensaje.svelte";
    
    
    let API="/api/v2/students-performance-in-exams";
        if(dev){
            API="https://sos2324-15.ew.r.appspot.com/api/v2/students-performance-in-exams";
        }
    
    
    
    let Students = [];
    let errorMsg = "";
    let msg = "";
    let newStudent = {
        gender: "female",
        race_ethnicity: "group C",
        parental_level_of_education: "high school",
        lunch: "standard",
        test_preparation_course: "none",
        math_score: 54,
        reading_score: 23,
        writing_score: 67,
        country: "rusia",
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
                    Genero
                </th>
                <th>
                    Etnia
                </th>
                <th>
                    Nivel de educación parental
                </th>
                <th>
                    Dieta
                </th>
                <th>
                    Curso de preparación
                </th>
            </tr>
    
        </thead>
        <tbody>
            <tr>
                <td>
                    <input bind:value={newStudent.gender}>
                </td>
                <td>
                    <input bind:value={newStudent.race_ethnicity}>
                </td>
                <td>
                    <input bind:value={newStudent.parental_level_of_education}>
                </td>
                <td>
                    <input bind:value={newStudent.lunch}>
                </td>
                <td>
                    <input bind:value={newStudent.test_preparation_course}>
                </td>
            </tr>
        </tbody>

            <thead>
                <tr>
                    <th>
                        Nota Matemática
                    </th>
                    <th>
                        Nota de Lectura
                    </th>
                    <th>
                        Nota de Redacción
                    </th>
                    <th>
                        País
                    </th>
                    <th>
                        Fecha
                    </th>
                    
                    
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        <input type="number" bind:value={newStudent.math_score}>
                    </td>
                    <td>
                        <input type="number" bind:value={newStudent.reading_score}>
                    </td>
                    <td>
                        <input type="number" bind:value={newStudent.writing_score}>
                    </td>
                    <td>
                        <input bind:value={newStudent.country}>
                    </td>
                    <td>
                        <input bind:value={newStudent.date}>
                    </td>
                </tr>
            </tbody>
    
    </table>
    
    <ul>
        {#each Students as Student }
        <li> <a href="/students-performance-in-exams/{Student.country}/{Student.math_score}">{Student.country} - {Student.age}</a>  <button on:click="{deleteStudents(Student.country+"/"+Student.math_score)}">Borrar</button> </li>
        
        {/each}
        <button on:click="{createStudent}">Crear datos académicos</button>
        <button on:click="{deleteGeneralStudents}">Eliminar lista</button>
    </ul>
    
    
    
    