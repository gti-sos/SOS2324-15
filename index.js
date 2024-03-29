import express from "express";
import dataStore from "nedb";
import bodyParser from "body-parser";
import { handler } from "./front/build/handler.js";


import {loadBackendMFC} from './API-MFC/index-v2.js';
const API_OGG = require("./API-OGG/index.js");
const API_SCG = require("./API-SCG/index.js");


const app = express();
const PORT = process.env.PORT || 10000;

// Configurar body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



app.use("/", express.static("./public"));

// API
const dbStudents = new dataStore();
const dbExams = new dataStore();
const dbSleep = new dataStore();

loadBackendMFC(app, dbStudents);
API_OGG(app, dbExams);
API_SCG(app, dbSleep);


// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.use(handler);

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}.`);
});
