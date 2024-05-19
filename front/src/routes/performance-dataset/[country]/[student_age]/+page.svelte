<script>
    // Importamos onMount de Svelte para ejecutar código cuando el componente se monta
    import { onMount } from "svelte";
    // Importamos la variable dev del entorno de la aplicación para detectar si estamos en modo desarrollo
    import { dev } from "$app/environment";
    // Importamos el componente Mensaje desde una ruta relativa
    import Mensaje from "../../../Mensaje.svelte";
    
    // Definimos la URL base de la API
    let API = "/api/v2/students-performance-dataset";
    // Si estamos en modo desarrollo, cambiamos la URL a la del entorno local
    if (dev) {
        API = "http://localhost:10000/api/v2/students-performance-dataset";
    }

    // Importamos la tienda de la página actual para acceder a los parámetros de la URL
    import { page } from '$app/stores';
    // Obtenemos el parámetro 'country' de la URL actual y lo asignamos a 'pais'
    let pais = $page.params.country;
    // Obtenemos el parámetro 'student_age' de la URL actual y lo asignamos a 'edad'
    let edad = $page.params.student_age;
    // Inicializamos un objeto vacío para almacenar los datos del país seleccionado
    let paisElegido = {};
    // Inicializamos un array vacío para almacenar todos los datos obtenidos de la API
    let datos = [];
    // Guardamos los valores iniciales de país y edad
    let paisAnt = pais;
    let edadAnt = edad;
    // Inicializamos variables para mensajes de éxito y error
    let msg = "";
    let errorMsg = "";

    // Ejecutamos estas funciones cuando el componente se monta
    onMount(() => {
        getStudent();
        getStudentElegido();
    });

    // Función para obtener todos los datos de los estudiantes de la API
    async function getStudent() {
        let response = await fetch(API, {
            method: "GET"
        });
        // Convertimos la respuesta en un objeto JSON
        let data = await response.json();
        // Almacenamos los datos obtenidos en la variable 'datos'
        datos = data;
    }

    // Función para obtener los datos del estudiante específico basado en país y edad
    async function getStudentElegido() {
        let response = await fetch(API, {
            method: "GET"
        });
        // Convertimos la respuesta en un objeto JSON
        let data = await response.json();
        // Almacenamos los datos obtenidos en la variable 'datos'
        datos = data;
        // Recorremos el array 'datos' para encontrar el estudiante que coincida con el país y la edad
        datos.forEach((s) => {
            if (s.country === pais && s.student_age === Number(edad)) {
                paisElegido = s;
            }
        });
        // Si no se encuentra el estudiante, mostramos un mensaje de error
        if (paisElegido.country === undefined || paisElegido === null) {
            errorMsg = "code: " + 404;
        }
    }

    // Función para actualizar los datos del estudiante
    async function putStudent(pais, edad) {
        try {
            let response = await fetch(API + "/" + pais + "/" + edad, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                // Enviamos los datos del país elegido como cuerpo de la solicitud
                body: JSON.stringify(paisElegido, null, 2)
            });
            // Obtenemos el estado de la respuesta
            let status = await response.status;
            console.log(`Creation response status ${status}`);
            // Si la actualización es exitosa, obtenemos nuevamente los datos
            if (status === 200) {
                getStudent();
                msg = "Cambios actualizados correctamente";
            } else {
                errorMsg = "code: " + status;
            }
        } catch (e) {
            errorMsg = e;
        }
    }

    // Función para actualizar las variables anteriores con los datos nuevos
    async function actualizaDatos() {
        paisAnt = paisElegido.country;
        edadAnt = paisElegido.student_age;
    }
</script>

{#if msg != ""}
<div>
    <!-- Si msg no está vacío, mostramos un componente Mensaje con tipo 'exito' -->
    <Mensaje tipo="exito" mensaje={msg} />
</div>
{/if}
{#if errorMsg != ""}
<div>
    <!-- Si errorMsg no está vacío, mostramos mensajes de error específicos según el código -->
    {#if errorMsg == "code: 400"}
        <Mensaje tipo="error" mensaje="La petición realizada es incorrecta" />
    {/if}
    {#if errorMsg == "code: 404"}
        <Mensaje tipo="error" mensaje={`No existe un contacto con nacionalidad ${pais} y edad ${edad}`} />
    {/if}
</div>
{/if}

<table>
    <thead>
        <tr>
            <th>Country</th>
            <th>Edad</th>
            <th>Sex</th>
            <th>Trabajo adicional</th>
            <th>Actividad deportiva</th>
            <th>Transporte</th>
            <th>Horas de estudio a la semana</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <!-- Inputs vinculados a las propiedades de 'paisElegido' para permitir la edición -->
            <td><input bind:value={paisElegido.country}></td>
            <td><input type="number" bind:value={paisElegido.student_age}></td>
            <td><input bind:value={paisElegido.sex}></td>
            <td><input bind:value={paisElegido.additional_work}></td>
            <td><input bind:value={paisElegido.sports_activity}></td>
            <td><input bind:value={paisElegido.transportation}></td>
            <td><input type="number" bind:value={paisElegido.weekly_study_hours}></td>
        </tr>
    </tbody>
    <thead>
        <tr>
            <th>Lee</th>
            <th>Atencion en clase</th>
            <th>Proyecto de trabajo</th>
            <th>Porcentaje de Atencion</th>
            <th>Calificacion media</th>
            <th>Fecha</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <!-- Inputs vinculados a las propiedades adicionales de 'paisElegido' -->
            <td><input bind:value={paisElegido.reading}></td>
            <td><input bind:value={paisElegido.listening_in_class}></td>
            <td><input bind:value={paisElegido.project_work}></td>
            <td><input type="number" bind:value={paisElegido.attendance_percentage}></td>
            <td><input type="number" bind:value={paisElegido.calification_average}></td>
            <td><input bind:value={paisElegido.date}></td>
        </tr>
    </tbody>
</table>

<form action="/performance-dataset/{paisElegido.country}/{paisElegido.student_age}">
    <!-- Botón para guardar cambios que ejecuta las funciones putStudent y actualizaDatos al hacer clic -->
    <button type="submit" on:click="{putStudent(paisAnt, edadAnt)}" on:click="{actualizaDatos}">Guardar cambios</button>
</form>

<style>
/* Estilo para el botón */
button {
    background-color: #02b073;
    color: white;
    padding: 10px 20px; /* Ajusta el padding según sea necesario */
    border: none;
    border-radius: 5px;
    margin-right: 10px; /* Ajusta el margen entre botones */
    margin-bottom: 10px; /* Ajusta el margen inferior de los botones */
}
</style>
