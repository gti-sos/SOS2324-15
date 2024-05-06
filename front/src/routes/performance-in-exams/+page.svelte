<script>

    import { onMount } from "svelte";
    import {dev} from "$app/environment";
    import Mensaje from "../Mensaje.svelte";
    
    
    let API="/api/v2/students-performance-in-exams";
        if(dev){
            API="http://localhost:10000/api/v2/students-performance-in-exams";
        }
    
    let errorMsgTimeout;
    
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
    
    //offset
    let currentPage = 0;
    //limit
    const pageSize = 10;
    
    let mostrarTabla = false;
    
    let from = "";
    let to = "";
    let gender= "";
    let race_ethnicity=  "";
    let parental_level_of_education= "";
    let lunch= "";
    let test_preparation_course= "";
    let math_score= "";
    let reading_score="";
    let writing_score= "";
    let country="";
    let date= "";
    
    
    
    onMount(()=>{
            mostrarTabla = false;
            filterApplied = false;
            getStudents();
            
        })
    
    
        let filterApplied = false; // Variable para controlar si se ha aplicado un filtro
    
        async function getStudents() {
        try {
            let response;
            let parametros = `?limit=${pageSize}`;
            if (currentPage > 0) {
                const offset = currentPage * pageSize;
                parametros += `&offset=${offset}`;
            }
    
            // Verificamos si se han introducido parámetros de búsqueda
            if (gender !== "") {
                parametros += `&gender=${gender}`;
            }
            if (race_ethnicity !== "") {
                parametros += `&race_ethnicity=${race_ethnicity}`;
            }
            if (parental_level_of_education !== "") {
                parametros += `&parental_level_of_education=${parental_level_of_education}`;
            }
            if (lunch !== "") {
                parametros += `&lunch=${lunch}`;
            }
            if (test_preparation_course !== "") {
                parametros += `&test_preparation_course=${test_preparation_course}`;
            }
            if (math_score !== "") {
                parametros += `&math_score=${math_score}`;
            }
            if (reading_score !== "") {
                parametros += `&reading_score=${reading_score}`;
            }
            if (writing_score !== "") {
                parametros += `&writing_score=${writing_score}`;
            }
            if (country !== "") {
                parametros += `&country=${country}`;
            }
            if (date !== "") {
                parametros += `&date=${date}`;
            }
    
            response = await fetch(API + parametros, {
                method: "GET",
            });
    
            if (response.status === 404) {
                errorMsg = "No se encontraron datos que coincidan con los filtros especificados.";
                Students = []; // Limpiar el arreglo de estudiantes
                // Iniciar el temporizador para borrar el mensaje de error después de 5 segundos
                errorMsgTimeout = setTimeout(() => {
                errorMsg = "";
                }, 5000);

                return;
            }
    
            let data = await response.json();
    
            // Verificar si la respuesta contiene datos después de aplicar los filtros
            if (data.length === 0 && filterApplied) {
                errorMsg = "No se encontraron datos que coincidan con los filtros especificados.";
                
                Students = []; // Limpiar el arreglo de estudiantes
                return;
            } else if (data.length > 0 && filterApplied) {
                errorMsg = "La búsqueda se ha realizado con éxito.";
            }
    
    
            // Filtrar por rango de nota matemática si se especifica
            if (from !== "" && to !== "") {
                data = data.filter(student => student.math_score >= from && student.math_score <= to);
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
                
                // Iniciar el temporizador para borrar el mensaje de éxito después de 5 segundos
                setTimeout(() => {
                    msg = "";
                }, 5000);
            } else {
                errorMsg = "code: " + response.status;

                // Iniciar el temporizador para borrar el mensaje de error después de 5 segundos
                setTimeout(() => {
                    errorMsg = "";
                }, 5000);
            }
        } else {
            errorMsg = "La base de datos no está vacía";

            // Iniciar el temporizador para borrar el mensaje de error después de 5 segundos
            setTimeout(() => {
                errorMsg = "";
            }, 5000);
        }
    } catch (e) {
        errorMsg = e;

        // Iniciar el temporizador para borrar el mensaje de error después de 5 segundos
        setTimeout(() => {
            errorMsg = "";
        }, 5000);
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

            // Iniciar el temporizador para borrar el mensaje de éxito después de 5 segundos
            setTimeout(() => {
                msg = "";
            }, 5000);
        } else if (response.status === 404) {
            // Recurso no encontrado
            errorMsg = "El recurso no existe";

            // Iniciar el temporizador para borrar el mensaje de error después de 5 segundos
            setTimeout(() => {
                errorMsg = "";
            }, 5000);
        } else {
            // Otro código de estado
            errorMsg = "Error al eliminar el estudiante: " + response.statusText;

            // Iniciar el temporizador para borrar el mensaje de error después de 5 segundos
            setTimeout(() => {
                errorMsg = "";
            }, 5000);
        }
    } catch (e) {
        errorMsg = e.message;

        // Iniciar el temporizador para borrar el mensaje de error después de 5 segundos
        setTimeout(() => {
            errorMsg = "";
        }, 5000);
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

            // Iniciar el temporizador para borrar el mensaje de éxito después de 5 segundos
            setTimeout(() => {
                msg = "";
            }, 5000);
        }else{
            errorMsg="code: "+response.status;

            // Iniciar el temporizador para borrar el mensaje de error después de 5 segundos
            setTimeout(() => {
                errorMsg = "";
            }, 5000);
        }
    }catch(e){
        errorMsg=e;

        // Iniciar el temporizador para borrar el mensaje de error después de 5 segundos
        setTimeout(() => {
            errorMsg = "";
        }, 5000);
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
        });

        let status=await response.status;
        console.log(`Creation response status ${status}`);
        if(status===201){
            getStudents();
            msg="Estudiante creado correctamente";

            // Iniciar el temporizador para borrar el mensaje de éxito después de 5 segundos
            setTimeout(() => {
                msg = "";
            }, 5000);
        }else{
            errorMsg="code: "+status;

            // Iniciar el temporizador para borrar el mensaje de error después de 5 segundos
            setTimeout(() => {
                errorMsg = "";
            }, 5000);
        }
    }catch(e){
        errorMsg=e;

        // Iniciar el temporizador para borrar el mensaje de error después de 5 segundos
        setTimeout(() => {
            errorMsg = "";
        }, 5000);
    }
}
    
//ocultamos y mostramos la tabla
function toggleTabla() {
    mostrarTabla = !mostrarTabla;
}
    
    
// Vaciar todos los campos de la tabla de filtrado
function limpiarCampos() {
    gender = "";
    race_ethnicity = "";
    parental_level_of_education = "";
    lunch = "";
    test_preparation_course = "";
    math_score = "";
    reading_score = "";
    writing_score = "";
    country = "";
    date = "";
    from = "";
    to = "";
    getStudents();
}
    
async function nextPage() {
    if (Students.length >= pageSize) {
        currentPage++;
        await getStudents();
    } else {
        errorMsg = "No hay más datos disponibles en la página siguiente.";
        setTimeout(() => {
        errorMsg = "";
        }, 5000);
    }
    }

    async function prevPage() {
    if (currentPage > 0) {
        currentPage--;
        await getStudents();
    } else {
        errorMsg = "Ya estás en la primera página.";
        setTimeout(() => {
        errorMsg = "";
        }, 5000);
    }
    }
    
</script>

<div>
    <a href="performance-in-exams/column"><button>Ver Gráfica Column</button></a>
    <a href="performance-in-exams/area"><button>Ver Gráfica Area</button></a>
    <a href="performance-in-exams/amcharts"><button>Ver Gráfica Amcharts (API de compañero de SOS)</button></a>
    <a href="performance-in-exams/chartist"><button>Ver Gráfica Chartist (API Streaming Availability de rapidapi)</button></a>
</div>
    
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
        <li class="studentItem"> <a href="/performance-in-exams/{Student.country}/{Student.math_score}">{Student.country} - {Student.math_score}</a>  <button on:click="{deleteStudents(Student.country+"/"+Student.math_score)}">Borrar</button> </li>
        
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
                    <th> Genero </th>
                    <th> Etnia </th>
                    <th> Nivel de educación parental </th>
                    <th> Dieta </th>
                    <th> Curso de preparación </th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        <input id="genderFilter" bind:value={gender} />
                    </td>
                    <td>
                        <input id="raceEthnicityFilter" bind:value={race_ethnicity} />
                    </td>
                    <td>
                        <input id="parentalEducationFilter" bind:value={parental_level_of_education} />
                    </td>
                    <td>
                        <input id="lunchFilter" bind:value={lunch} />
                    </td>
                    <td>
                        <input id="testPreparationFilter" bind:value={test_preparation_course} />
                    </td>
                </tr>
                <tr>
                    <th> Nota Matemática </th>
                    <th> Nota de Lectura </th>
                    <th> Nota de Redacción </th>
                    <th> País </th>
                    <th> Fecha </th>
                </tr>
                <tr>
                    <td>
                        <input id="mathScoreFilter" bind:value={math_score} />
                    </td>
                    <td>
                        <input id="lectureScoreFilter" bind:value={reading_score} />
                    </td>
                    <td>
                        <input id="writingScoreFilter" bind:value={writing_score} />
                    </td>
                    <td>
                        <input id="countryFilter" bind:value={country} />
                    </td>
                    <td>
                        <input id="dateFilter" bind:value={date} />
                    </td>
                </tr>
                <tr>
                    <th> Desde la nota matemática </th>
                    <th> Hasta la nota matemática </th>
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
      
    
    
    
    