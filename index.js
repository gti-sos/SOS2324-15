// Importa las librerías necesarias para el servidor
import express from "express"; // Framework web para manejar rutas y solicitudes HTTP
import bodyParser from "body-parser"; // Middleware para parsear el cuerpo de las solicitudes HTTP
import dataStore from "nedb"; // Base de datos en memoria o archivo
import cors from "cors"; // Middleware para habilitar CORS (Cross-Origin Resource Sharing)
import request from "request"; // Librería para realizar solicitudes HTTP
// Importa el manejador de Svelte
import {handler} from "./front/build/handler.js";

// Importa las funciones para cargar diferentes APIs
import {loadBackendOGG} from './back/API-OGG/index-v2.js';
import {loadBackendSCG} from './back/API-SCG/index-v2.js';
import {loadBackendMFC} from './back/API-MFC/index-v2.js';

// Crea una instancia de la aplicación Express
let app = express();
app.use(cors()); // Usa CORS para permitir solicitudes de otros dominios

// Creación de bases de datos en memoria usando NeDB
let dbStudents = new dataStore();
let dbExams = new dataStore();
let dbSleep = new dataStore();

// Variables constantes
const PORT = (process.env.PORT || 10000); // Define el puerto, usa el de entorno o 10000 por defecto
const API_BASE_v1 = "/api/v1"; // Ruta base para la versión 1 de la API
const API_BASE_v2 = "/api/v2"; // Ruta base para la versión 2 de la API

app.use(bodyParser.json()); // Usa bodyParser para parsear cuerpos JSON en las solicitudes

// Rutas para redireccionar a la documentación de Postman de las APIs v1
app.get(API_BASE_v1 + "/students-sleep-health/docs", (req, res) => {
    res.redirect('https://documenter.getpostman.com/view/33032447/2sA2xh3DCL');
});

app.get(API_BASE_v1 + "/students-performance-in-exams/docs", (req, res) => {
    res.redirect('https://documenter.getpostman.com/view/33477031/2sA35HVzdi');
});

app.get(API_BASE_v1 + "/students-performance-dataset/docs", (req, res) => {
    res.redirect('https://documenter.getpostman.com/view/33030259/2sA2xnwUY5');
});

// Comentar en caso de servir contenido estático en la ruta raíz
// app.use("/", express.static("./public"));

// Carga las APIs de Óscar García, Marta Fernández y Sergio Cortés
loadBackendOGG(app, dbExams);
loadBackendMFC(app, dbStudents);
loadBackendSCG(app, dbSleep);

// Proxy para la API de Marta Fernández
app.use("/proxyMFC", async function(req, res) {
    const region = req.query.region || 'US'; // Obtén la región de los parámetros de la solicitud, por defecto 'US'
    const url = `https://yh-finance.p.rapidapi.com/auto-complete?q=tesla&region=${region}`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'c8c5805be4msh51b2331d0f2ac40p14efb1jsn56f9898c3d22', // Clave de la API
            'X-RapidAPI-Host': 'yh-finance.p.rapidapi.com' // Host de la API
        }
    };

    try {
        const response = await fetch(url, options); // Realiza la solicitud a la API
        const result = await response.json(); // Parsear la respuesta como JSON
        res.send(result); // Enviar el resultado al cliente
    } catch (error) {
        console.error(error); // En caso de error, mostrarlo en consola
        res.status(500).send('Error fetching data from API'); // Enviar un error 500 al cliente
    }
});

// Proxy para una API externa (Kenzo)
app.use("/proxyKenzo", function(req, res) {
    var url = "https://sos2324-16.ew.r.appspot.com/api/v2/stats-volleyball-integrations/data"; // URL de la API externa
    console.log('piped:' + req.url); // Loguea la URL solicitada
    req.pipe(request(url)).pipe(res); // Redirige la solicitud y respuesta a la API externa
});

// Proxy para una API externa (Óscar García)
app.use("/proxyOGG", function(req, res) {
    var url = "https://sos2324-11.appspot.com/api/v2/structural-payment-data"; // URL de la API externa
    console.log('piped:' + req.url); // Loguea la URL solicitada
    req.pipe(request(url)).pipe(res); // Redirige la solicitud y respuesta a la API externa
});

app.use(handler); // Usa el manejador de Svelte para manejar las rutas de la aplicación

// Iniciar el servidor en el puerto definido
app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`); // Mensaje de inicio del servidor
    console.log(`API Óscar García on http://localhost:${PORT + API_BASE_v2}/students-performance-in-exams`);
    console.log(`API Marta Fernández on http://localhost:${PORT + API_BASE_v2}/students-performance-dataset`);
    console.log(`API Sergio Cortés on http://localhost:${PORT + API_BASE_v2}/students-sleep-health`);
});
console.log(`Server initializing...`); // Mensaje indicando la inicialización del servidor
