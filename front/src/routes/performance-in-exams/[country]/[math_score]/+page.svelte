<script>

    import { onMount } from "svelte";
    import {dev} from "$app/environment";
    import Mensaje from  "../../../Mensaje.svelte";
    
    
    let API="/api/v2/students-performance-in-exams";
        if(dev){
            API="http://localhost:10000/api/v2/students-performance-in-exams";
        }

    import {page} from '$app/stores';
    let pais=$page.params.country;
    let nota=$page.params.math_score;
    let paisElegido={};
    let datos=[];
    let paisAnt=pais;
    let notaAnt=nota;
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
            if(s.country===pais && s.math_score===Number(nota)){
                paisElegido=s;
            }
        });
        if(paisElegido.country===undefined || paisElegido===null ){
            errorMsg="code: "+404;
        }
    }
    async function putStudent(pais,nota){
        try{
            let response=await fetch(API+"/"+pais+"/"+nota,{
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
        notaAnt=paisElegido.math_score;
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
        <Mensaje tipo="error" mensaje={`No existe un contacto con nacionalidad ${pais} y nota matemática ${nota}`}/>
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
                <input bind:value={paisElegido.gender}>
            </td>
            <td>
                <input bind:value={paisElegido.race_ethnicity}>
            </td>
            <td>
                <input bind:value={paisElegido.parental_level_of_education}>
            </td>
            <td>
                <input bind:value={paisElegido.lunch}>
            </td>
            <td>
                <input bind:value={paisElegido.test_preparation_course}>
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
                    <input type="number" bind:value={paisElegido.math_score}>
                </td>
                <td>
                    <input type="number" bind:value={paisElegido.reading_score}>
                </td>
                <td>
                    <input type="number" bind:value={paisElegido.writing_score}>
                </td>
                <td>
                    <input bind:value={paisElegido.country}>
                </td>
                <td>
                    <input bind:value={paisElegido.date}>
                </td>
            </tr>
        </tbody>

</table>

<form action="/performance-dataset/{paisElegido.country}/{paisElegido.math_score}">
    <button type="submit"  on:click="{putStudent(paisAnt,notaAnt)}" on:click="{actualizaDatos}">Guardar cambios</button> 
</form>