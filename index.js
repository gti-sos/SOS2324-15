
let express = require("express")
let app = express();
let dataStore= require("nedb");

let bodyParser=require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let API_MFC=require("./API-MFC");
let API_OGG=require("./API-OGG");
let API_SCG=require("./API-SCG");

let dbStudents= new dataStore();
let dbExams= new dataStore();
let dbSleep = new dataStore(); 

API_MFC(app,dbStudents);
API_OGG(app,dbExams);
API_SCG(app,dbSleep);


// Configurar body-parser
app.use(bodyParser.json());

const path = require('path');
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use("/",express.static("./public"));


const PORT = (process.env.PORT || 10000);
app.listen(PORT,()=>{
    console.log(`Server listening on port ${PORT}.`);
});





