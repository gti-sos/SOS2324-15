import express from "express";
import bodyParser from "body-parser";
import dataStore from "nedb";
import cors from "cors";
//Svelte
import {handler} from "./front/build/handler.js";

import {loadBackendOGG} from './back/API-OGG/index.js';
import {loadBackendSCG} from './back/API-SCG/index.js';
import {loadBackendMFC} from './back/API-MFC/index.js';

let app = express();
app.use(cors());

//creacion de bases de datos
let dbStudents = new dataStore();
let dbExams = new dataStore();
let dbSleep = new dataStore();

//Variables constantes
const PORT = (process.env.PORT || 10000);
const API_BASE_v1 = "/api/v1";

app.use(bodyParser.json());

//Recurso html principal
// app.use("/", express.static("./public"));

//Llamar a la api de Óscar García
loadBackendOGG(app, dbExams);
//Llamar a la api de Marta Fernández
loadBackendMFC(app, dbStudents);
//Llamar a la api de Sergio Cortés 
loadBackendSCG(app, dbSleep);

app.use(handler);


//Iniciar servicio
app.listen(PORT,() =>{
    console.log(`Server listening on http://localhost:${PORT}`);
    console.log(`API Óscar García on http://localhost:${PORT + API_BASE_v1}/students-performance-in-exams`);
    console.log(`API Marta Fernández on http://localhost:${PORT + API_BASE_v1}/students-performance-dataset`);
    console.log(`API Sergio Cortés on http://localhost:${PORT + API_BASE_v1}/students-sleep-health`);
});
console.log(`Server initializing...`);
