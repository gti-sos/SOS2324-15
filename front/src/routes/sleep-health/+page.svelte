<script>
    import { onMount } from "svelte";
    import {dev} from "$app/environment";
    import Mensaje from "../Mensaje.svelte";
     
    let API="/api/v2/students-sleep-health";
    if(dev){
        API="http://localhost:10000/api/v2/students-sleep-health";
    }

    let errorMsgTimeout;

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


    //offset
    let currentPage = 0;
    //limit
    const pageSize = 10;

    let mostrarTabla = false; 
    
    let from = "";
    let to = ""; 

    let person_id =  ""; 
    let gender =  "";
    let age = "";
    let bachelor_degree = ""; 
    let quality_of_sleep = "";
    let physical_activity_level = "";
    let stress_level = "";
    let bmi_category = "";
    let daily_steps = ""; 
    let sleep_disorder = ""; 
    let country = "";
    let date = "";



    onMount(()=>{
        mostrarTabla = false;
        filterApplied = false;
        getSleep();
    })

    let filterApplied = false; // Variable para controlar si se ha aplicado un filtro

    async function getSleep(){
        try {
            let response;
            let parametros = `?limit=${pageSize}`;
            if (currentPage > 0) {
                const offset = currentPage * pageSize;
                parametros += `&offset=${offset}`;
            }

            // Verificamos si se han introducido parámetros de búsqueda
            if (person_id !== "") {
                parametros += `&person_id=${person_id}`;
            }
            if (gender !== "") {
                parametros += `&gender=${gender}`;
            }
            if (age !== "") {
                parametros += `&age=${age}`;
            }
            if (bachelor_degree !== "") {
                parametros += `&bachelor_degree=${bachelor_degree}`;
            }
            if (quality_of_sleep !== "") {
                parametros += `&quality_of_sleep=${quality_of_sleep}`;
            }
            if (physical_activity_level !== "") {
                parametros += `&physical_activity_level=${physical_activity_level}`;
            }
            if (stress_level !== "") {
                parametros += `&stress_level=${stress_level}`;
            }
            if (bmi_category !== "") {
                parametros += `&bmi_category=${bmi_category}`;
            }
            if (daily_steps !== "") {
                parametros += `&daily_steps=${daily_steps}`;
            }
            if (sleep_disorder !== "") {
                parametros += `&sleep_disorder=${sleep_disorder}`;
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
                sleep = []; // Limpiar el arreglo de estudiantes

                // Iniciar el temporizador para borrar el mensaje de error después de 5 segundos
                errorMsgTimeout = setTimeout(() => {
                    errorMsg = "";
                }, 5000);

                return;
            }

            let data = await response.json();

            // Filtrar por rango de edad si se especifica
            if (from !== "" && to !== "") {
                data = data.filter(sleep => sleep.age >= from && sleep.age <= to);
            }

            sleep = data;
            console.log(data);

             // Verificar si se han aplicado filtros
            if (
                person_id !== "" ||
                gender !== "" ||
                age !== "" ||
                bachelor_degree !== "" ||
                quality_of_sleep !== "" ||
                physical_activity_level !== "" ||
                stress_level !== "" ||
                bmi_category !== "" ||
                daily_steps !== "" ||
                sleep_disorder !== "" ||
                country !== "" ||
                date !== "" ||
                from !== "" ||
                to !== ""
            ) {
                filterApplied = true;
            } else {
                filterApplied = false;
            }

            if (data.length > 0 && filterApplied) {

                // Mostrar mensaje de éxito
                msg = "La búsqueda se ha realizado con éxito.";

                // Iniciar el temporizador para borrar el mensaje de éxito después de 5 segundos
                setTimeout(() => {
                    msg = "";
                }, 5000);
            }



        } catch (e) {
            errorMsg = e;
            // Iniciar el temporizador para borrar el mensaje de error después de 5 segundos
            errorMsgTimeout = setTimeout(() => {
                errorMsg = "";
            }, 5000);
        }
    }



    
    async function loadInitialData() {
        try {
            if (sleep.length === 0) {
                let response = await fetch(API + '/loadInitialData', {
                    method: 'GET'
                });

                if (response.status === 200) {
                    getSleep();
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

    async function deleteSleep(n) {
        try {
            let response = await fetch(API + "/" + n, {
                method: "DELETE"
            });

            if (response.status === 200) {
                getSleep();
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



    async function deleteGeneralSleep(){
        console.log(`Deleting all`);

        try{
            let response=await fetch(API+"/",{
                method:"DELETE"
            })

            if(response.status===200){
                getSleep();
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



    async function createSleep(){
        try{
            let response=await fetch(API,{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(newSleep,null,2)
            });

            let status=await response.status;
            console.log(`Creation response status ${status}`);
            if(status===201){
                getSleep();
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
        person_id =  ""; 
        gender =  "";
        age = "";
        bachelor_degree = ""; 
        quality_of_sleep = "";
        physical_activity_level = "";
        stress_level = "";
        bmi_category = "";
        daily_steps = ""; 
        sleep_disorder = ""; 
        country = "";
        date = "";
        from ="";
        to="";
        getSleep();
    }


    async function nextPage() {
    if (sleep.length >= pageSize) {
      currentPage++;
      await getSleep();
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
      await getSleep();
    } else {
      errorMsg = "Ya estás en la primera página.";
      setTimeout(() => {
        errorMsg = "";
      }, 5000);
    }
  }

</script>



<div>
    <a href="sleep-health/pie"><button>Ver Gráfica Pie</button></a>
    <a href="sleep-health/pyramid"><button>Ver Gráfica Pyramid</button></a>
</div>

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
        <li> <a href="/sleep-health/{sleep_j.country}/{sleep_j.gender}">{sleep_j.country} - {sleep_j.age}</a>  <button on:click="{deleteSleep(sleep_j.country+"/"+sleep_j.gender)}">Borrar</button> </li>
        
    {/each}
    <br>
    <br>
    <button on:click="{createSleep}">Crear estudiante nuevo </button> 
    <button on:click="{deleteGeneralSleep}">Eliminar lista</button>
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
                <th> Identificador </th>
                <th> Género </th>
                <th> Edad  </th>
                <th> Grado Universitario </th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>
                    <input type="number" id="person_idFilter" bind:value={person_id} />
                </td>
                <td>
                    <input id="genderFilter" bind:value={gender} />
                </td>
                <td>
                    <input type="number" id="ageFilter" bind:value={age} />
                </td>
                <td>
                    <input id="bachelor_degreeFilter" bind:value={bachelor_degree} />
                </td>
            </tr>
            <tr>
                <th> Calidad de sueño </th>
                <th> Nivel de actividad física </th>
                <th> Nivel de estrés </th>
                <th> Masa Corporal </th>
            </tr>
            <tr>
                <td>
                    <input type="number" id="quality_of_sleepFilter" bind:value={quality_of_sleep} />
                </td>
                <td>
                    <input type="number" id="physical_activity_levelFilter" bind:value={physical_activity_level} />
                </td>
                <td>
                    <input type="number" id="stress_levelFilter" bind:value={stress_level} />
                </td>
                <td>
                    <input id="bmi_categoryFilter" bind:value={bmi_category} />
                </td>
            </tr>
            <tr>
                <th> Pasos diarios </th>
                <th> Trastorno del sueño </th>
                <th> País </th>
                <th> Fecha de Registro </th>
            </tr>
            <tr>
                <td>
                    <input type="number" id="daily_stepsFilter" bind:value={daily_steps} />
                </td>
                <td>
                    <input id="sleep_disorderFilter" bind:value={sleep_disorder} />
                </td>
                <td>
                    <input id="countryFilter" bind:value={country} />
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
                <button id="search" on:click={getSleep}>Buscar</button>
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
  





