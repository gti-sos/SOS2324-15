<script>

import { onMount } from "svelte";


let API="http://localhost:10000/api/v2/students-performance-dataset";
//if(dev){
//    API="http://localhost:10000/api/v1/students-performance-dataset";
//}



let Students = [];
let errorMsg = "";
let msg = "";
let newStudent = {
    "country": "China",
    "student_age": 25,
    "sex": "Male",
    "additional_work": "Yes",
    "sports_activity": "No",
    "transportation": "Private",
    "weekly_study_hours": 17,
    "reading": "Yes",
    "listening_in_class": "No",
    "project_work": "No",
    "attendance_percentage": 84,
    "calification_average": 3.5,
    "date": "09/04/2023"
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
            msg="Datos creados correctamente";
        }else{
            errorMsg="code: "+status;
        }
    }catch(e){
        errorMsg=e;
    }

    }


</script>


<ul>
    {#each Students as Student }
    <li>{Student.country}</li>
        
    {/each}

    <button on:click="{createStudent}">Crear datos academicos</button>
</ul>


