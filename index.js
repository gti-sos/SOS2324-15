import express from "express";
import bodyParser from "body-parser";
import dataStore from "nedb";
import cors from "cors";
import request from "request";
//Svelte
import {handler} from "./front/build/handler.js";

import {loadBackendOGG} from './back/API-OGG/index-v2.js';
import {loadBackendSCG} from './back/API-SCG/index-v2.js';

import {loadBackendMFC} from './back/API-MFC/index-v2.js';


let app = express();
app.use(cors());

//creacion de bases de datos
let dbStudents = new dataStore();
let dbExams = new dataStore();
let dbSleep = new dataStore();

//Variables constantes
const PORT = (process.env.PORT || 10000);
const API_BASE_v1 = "/api/v1";
const API_BASE_v2 = "/api/v2";


app.use(bodyParser.json());

// llamadas postman apis v1

app.get(API_BASE_v1+"/students-sleep-health/docs", (req,res) => {
    res.redirect('https://documenter.getpostman.com/view/33032447/2sA2xh3DCL');
});

app.get(API_BASE_v1+"/students-performance-in-exams/docs", (req,res) => {
    res.redirect('https://documenter.getpostman.com/view/33477031/2sA35HVzdi');
});

app.get(API_BASE_v1+"/students-performance-dataset/docs", (req,res) => {
    res.redirect('https://documenter.getpostman.com/view/33030259/2sA2xnwUY5');
});


//Recurso html principal
// app.use("/", express.static("./public"));

//Llamar a la api de Óscar García
loadBackendOGG(app, dbExams);
//Llamar a la api de Marta Fernández
loadBackendMFC(app, dbStudents);
//Llamar a la api de Sergio Cortés 
loadBackendSCG(app, dbSleep);

app.use("/proxyMFC", function(req,res){
    var url= "https://sos2324-15.appspot.com/api/v2/students-performance-dataset";
    console.log('piped:' + req.url);
    req.pipe(request(url)).pipe(res);
});

app.use("/proxyKenzo", function(req,res){
    var url= "https://sos2324-16.appspot.com/api/v2/stats-volleyball";
    console.log('piped:' + req.url);
    req.pipe(request(url)).pipe(res);
});

app.use("/proxyOGG", function(req,res){
    var url= "https://sos2324-11.appspot.com/api/v2/structural-payment-data";
    console.log('piped:' + req.url);
    req.pipe(request(url)).pipe(res);
});

app.use(handler);


//Iniciar servicio
app.listen(PORT,() =>{
    console.log(`Server listening on http://localhost:${PORT}`);
    console.log(`API Óscar García on http://localhost:${PORT + API_BASE_v2}/students-performance-in-exams`);
    console.log(`API Marta Fernández on http://localhost:${PORT + API_BASE_v2}/students-performance-dataset`);
    console.log(`API Sergio Cortés on http://localhost:${PORT + API_BASE_v2}/students-sleep-health`);
});
console.log(`Server initializing...`);
