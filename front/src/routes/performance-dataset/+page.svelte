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
    country: "peru",
    student_age: 27,
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

//offset
let currentPage = 0;
//limit
const pageSize = 10;

let mostrarTabla = false;

let from = "";
let to = "";
let country= "";
let student_age=  "";
let sex= "";
let additional_work= "";
let sports_activity= "";
let transportation= "";
let weekly_study_hours="";
let reading= "";
let listening_in_class="";
let project_work= "";
let attendance_percentage="";
let calification_average= "";
let date="";



onMount(()=>{
        mostrarTabla = false;
        getStudents();
        
    })


    async function getStudents() {
    try {
        let response;
        let parametros = `?limit=${pageSize}`;
        if (currentPage > 0) {
            const offset = currentPage * pageSize;
            parametros += `&offset=${offset}`;
        }

        // Verificamos si se han introducido parámetros de búsqueda
        if (country !== "") {
            parametros += `&country=${country}`;
        }
        if (student_age !== "") {
            parametros += `&student_age=${student_age}`;
        }
        if (sex !== "") {
            parametros += `&sex=${sex}`;
        }
        if (additional_work !== "") {
            parametros += `&additional_work=${additional_work}`;
        }
        if (sports_activity !== "") {
            parametros += `&sports_activity=${sports_activity}`;
        }
        if (transportation !== "") {
            parametros += `&transportation=${transportation}`;
        }
        if (weekly_study_hours !== "") {
            parametros += `&weekly_study_hours=${weekly_study_hours}`;
        }
        if (reading !== "") {
            parametros += `&reading=${reading}`;
        }
        if (listening_in_class !== "") {
            parametros += `&listening_in_class=${listening_in_class}`;
        }
        if (project_work !== "") {
            parametros += `&project_work=${project_work}`;
        }
        if (attendance_percentage !== "") {
            parametros += `&attendance_percentage=${attendance_percentage}`;
        }
        if (calification_average !== "") {
            parametros += `&calification_average=${calification_average}`;
        }
        if (date !== "") {
            parametros += `&date=${date}`;
        }

        response = await fetch(API + parametros, {
            method: "GET",
        });

        let data = await response.json();
         // Verificar si la respuesta contiene datos después de aplicar los filtros
         if (data.length === 0) {
            errorMsg = "No quedan más datos después de aplicar el filtro.";
            return;
        }
        // Filtrar por rango de edad si se especifica
        if (from !== "" && to !== "") {
            data = data.filter(student => student.student_age >= from && student.student_age <= to);
        }
        Students = data;
        console.log(data);
    } catch (e) {
        errorMsg = e;
    }
}





    async function loadInitialData() {
    try {
        if (Students.length === 0) {
            let response = await fetch(API + '/loadInitialData', {
                method: 'GET'
            });

            if (response.status === 200) {
                getStudents();
                msg = "Datos cargados correctamente";
            } else {
                errorMsg = "code: " + response.status;
            }
        } else {
            errorMsg = "La base de datos no está vacía";
        }
    } catch (e) {
        errorMsg = e;
    }
}


async function deleteStudents(n) {
    try {
        let response = await fetch(API + "/" + n, {
            method: "DELETE"
        });

        if (response.status === 200) {
            getStudents();
            msg = "Estudiante borrado";
        } else if (response.status === 404) {
            // Recurso no encontrado
            errorMsg = "El recurso no existe";
        } else {
            // Otro código de estado
            errorMsg = "Error al eliminar el estudiante: " + response.statusText;
        }
    } catch (e) {
        errorMsg = e.message;
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

//ocultamos y mostramos la tabla
function toggleTabla() {
    mostrarTabla = !mostrarTabla;
}


// Vaciar todos los campos de la tabla de filtrado
function limpiarCampos() {
    country = "";
    student_age = "";
    sex = "";
    additional_work = "";
    sports_activity = "";
    transportation = "";
    weekly_study_hours = "";
    reading = "";
    listening_in_class = "";
    project_work = "";
    attendance_percentage = "";
    calification_average = "";
    date = "";
    getStudents();
}

function nextPage() {
    if (Students.length >= pageSize) {
        currentPage++;
        getData();
    } else {
        errorMsg = "No hay más datos disponibles en la página siguiente.";
        setTimeout(() => {
            errorMsg = "";
        }, 5000);
    }
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        getData();
    } else {
        errorMsg = "Ya estás en la primera página.";
        setTimeout(() => {
            errorMsg = "";
        }, 5000);
    }
}




</script>

{#if msg !== ""}
<div>
  <Mensaje tipo="exito" mensaje={msg} />
</div>
{/if}
{#if errorMsg !== ""}
<div>
  {#if errorMsg === "code: 409"}
  <Mensaje tipo="error" mensaje={`Existe un dato con país ${newStudent.country}`} />
  {:else}
  <Mensaje tipo="error" mensaje={errorMsg} />
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
                <input type="number" bind:value={newStudent.student_age}>
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
    <li class="studentItem"> <a href="/performance-dataset/{Student.country}/{Student.student_age}">{Student.country} - {Student.student_age}</a>  <button on:click="{deleteStudents(Student.country+"/"+Student.student_age)}">Borrar</button> </li>
    
    {/each}
    <button on:click="{createStudent}">Crear datos académicos</button>
    <button on:click="{deleteGeneralStudents}">Eliminar lista</button>
    <button on:click="{loadInitialData}">Cargar datos</button>
    <button on:click={toggleTabla}>Filtrar</button>


</ul>
<div>
    <button id="pagAv" on:click={prevPage}>Página anterior</button>
        Página: {currentPage}
    <button id="pagNe" on:click={nextPage}>Página siguiente</button>
</div>
    

{#if mostrarTabla}
<div class="container">
<div class="tabla-container">
    <div class="search-menu">
    <table class:tabla={mostrarTabla}>
        <caption><div class="search-menu-title">
            Menú de búsqueda
          </div></caption>
        <thead>
            <tr>
                <th> País </th>
                <th> Edad del estudiante </th>
                <th> Sexo </th>
                <th> Trabajo adicional </th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>
                    <input id="countryFilter" bind:value={country} />
                </td>
                <td>
                    <input id="studentAgeFilter" bind:value={student_age} />
                </td>
                <td>
                    <input id="sexFilter" bind:value={sex} />
                </td>
                <td>
                    <input id="additionalWorkFilter" bind:value={additional_work} />
                </td>
            </tr>
            <tr>
                <th> Actividad deportiva </th>
                <th> Transporte </th>
                <th> Horas de estudio a la semana </th>
                <th> Lectura </th>
            </tr>
            <tr>
                <td>
                    <input id="sportsActivityFilter" bind:value={sports_activity} />
                </td>
                <td>
                    <input id="transportationFilter" bind:value={transportation} />
                </td>
                <td>
                    <input id="weeklyStudyHoursFilter" bind:value={weekly_study_hours} />
                </td>
                <td>
                    <input id="readingFilter" bind:value={reading} />
                </td>
            </tr>
            <tr>
                <th> Atención en clase </th>
                <th> Proyecto de trabajo </th>
                <th> Porcentaje de Asistencia </th>
                <th> Calificación media </th>
                <th> Fecha </th>
            </tr>
            <tr>
                <td>
                    <input id="listeningInClassFilter" bind:value={listening_in_class} />
                </td>
                <td>
                    <input id="projectWorkFilter" bind:value={project_work} />
                </td>
                <td>
                    <input id="attendancePercentageFilter" bind:value={attendance_percentage} />
                </td>
                <td>
                    <input id="calificationAverageFilter" bind:value={calification_average} />
                </td>
                <td>
                    <input id="dateFilter" bind:value={date} />
                </td>
            </tr>
            <tr>
                <th> Desde la edad </th>
                <th> Hasta la edad </th>
            </tr>
            <tr>
                <td>
                    <input type="number" id="fromFilter" bind:value={from} />
                </td>
                <td>
                    <input type="number" id="toFilter" bind:value={to} />
                </td>
            </tr>
            <tr>
                <button id="search" on:click={getStudents}>Buscar</button>
                <button id="erase" on:click={limpiarCampos}>Limpiar búsqueda</button>
            </tr>
        </tbody>
    </table>
    </div>
</div>
</div>
{/if}

<style>
    /* Estilos para el contenedor principal */
    .container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh; /* Ajusta la altura para ocupar toda la altura visible */
    }
  
    /* Estilos para la tabla */
    .tabla-container {
      text-align: center;
      margin-bottom: 20px;
    }
  
    /* Estilos para el cuadro del texto "Menú de búsqueda" */
    .search-menu-title {
      background-color: #02b073;
      color: white;
      padding: 20px; /* Aumenta el padding */
      border-radius: 10px; /* Aumenta el radio del borde */
      display: inline-block;
      margin-bottom: 10px;
      font-size: 20px; /* Aumenta el tamaño de la letra */
      width: 100%; /* Hace que el cuadro ocupe todo el ancho */
      text-align: center; /* Centra el texto horizontalmente */
    }
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
  



