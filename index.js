let cool = require("cool-ascii-faces");
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

let data_OGG= require('./index-OGG');
let data_MFC= require('./index-MFC');
let data_SCG= require('./index-SCG');

// Configurar body-parser
app.use(bodyParser.json());

const path = require('path');
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use("/",express.static("./public"));

app.get("/cool",(req ,res)=>{
    res.send(`<html><body><h1>${cool()}</h1></body></html>`)
});
const PORT = (process.env.PORT || 10000);
app.listen(PORT,()=>{
    console.log(`Server listening on port ${PORT}.`);
});



//Oscar Garcia

function calcularMediaMathScore(datos) {
    const valorNumerico = 'math_score';
    const repeticionesPorPais = datos.reduce((acc, fila) => {
      acc[fila.country] = (acc[fila.country] || 0) + 1;
      return acc;
    }, {});
    const paisesRepetidos = Object.keys(repeticionesPorPais).filter((pais) => repeticionesPorPais[pais] >= 2);
    const sumasYRecuentosPorPais = {};
    paisesRepetidos.forEach((pais) => {
      const filasFiltradas = datos.filter((fila) => fila.country === pais);
      sumasYRecuentosPorPais[pais] = filasFiltradas.reduce((acc, fila) => {
        acc.suma = (acc.suma || 0) + fila.math_score;
        acc.recuento = (acc.recuento || 0) + 1;
        return acc;
      }, {});
    });
    const totalSumaRecuento = Object.values(sumasYRecuentosPorPais).reduce((acc, { suma, recuento }) => {
      acc.suma += suma;
      acc.recuento += recuento;
      return acc;
    }, { suma: 0, recuento: 0 });
    const media = totalSumaRecuento.suma / totalSumaRecuento.recuento;
    return media;
  }
  
  
app.get("/samples/OGG", (req,res)=>{
    const valorNumerico = 'math_score';
    const result = calcularMediaMathScore(data_OGG); 
    res.send(`<html> <body> <h1> La media total del campo numérico ${valorNumerico} es: ${result} </h1> </body> </html>`)
});


//Marta Fernández Carmona

function calcularMediaHorasEstudio(datos) {
  const paisesRepetidos = datos.reduce((acc, dato) => {
    if (acc[dato.country]) {
      acc[dato.country]++;
    } else {
      acc[dato.country] = 1;
    }
    return acc;
  }, {});
  
  const paisesConMasDeUnaAparicion = Object.keys(paisesRepetidos).filter(pais => paisesRepetidos[pais] > 1);
  
  // Calcular la media de las horas de estudio para los países seleccionados
  const horasDeEstudio = paisesConMasDeUnaAparicion.map(pais => {
    const filasFiltradas = datos.filter((fila) => fila.country === pais);
    const horasEstudio = filasFiltradas.map((fila) => fila.weekly_study_hours);
    const mediaHorasEstudio = horasEstudio.reduce((acc, valor) => acc + valor, 0) / horasEstudio.length;
    return { pais, mediaHorasEstudio };
  });

  return horasDeEstudio.map(resultado => `<p>País: ${resultado.pais}, Media de horas de estudio: ${resultado.mediaHorasEstudio}</p>`).join('');
}


app.get("/samples/MFC", (req,res) => {
  const resultado = calcularMediaHorasEstudio(data_MFC);
  res.send(`<html><body>${resultado}</body></html>`);
});




// Sergio Kenzo Cortés González

function calculaActFisicaPorPais(datos){

  const valorNumerico = 'physical_activity_level'
  const resultadosPorPais = {};

  // Obtén la cuenta de repeticiones de cada país
  const repeticionesPorPais = datos.reduce((acc, fila) => {
    acc[fila.country] = (acc[fila.country] || 0) + 1;
    return acc;
  }, {});

  // Filtra los países que se repiten dos veces o más
  const paisesRepetidos = Object.keys(repeticionesPorPais).filter((pais) => repeticionesPorPais[pais] >= 2);

  // Inicializa un objeto para almacenar las sumas y recuentos de valores numéricos por país
  const sumasYRecuentosPorPais = {};

  // Calcula la suma y recuento de valores numéricos para cada país repetido
  paisesRepetidos.forEach((pais) => {
    const filasFiltradas = datos.filter((fila) => fila.country === pais);
    const suma = filasFiltradas.reduce((acc, fila) => acc + fila[valorNumerico], 0);
    const recuento = filasFiltradas.length;
    const media = suma / recuento;

    resultadosPorPais[pais] = {
      media,
      recuento,
    };
  });

  return resultadosPorPais;
}

// app.get("/samples/SCG", (req, res) => {
//   const valorNumerico = 'physical_activity_level'
//   const resultado = calculaActFisicaPorPais(data_SCG);
//   res.send(`<html> <body> <h1> Medias del campo ${valorNumerico} para todos los países con repeticiones: 
//     ${resultado} </h1> </body> </html>`)
// });

app.get("/samples/SCG", (req, res) => {
  const valorNumerico = 'physical_activity_level';
  const resultado = calculaActFisicaPorPais(data_SCG);

  // Itera sobre las propiedades del objeto resultado
  const resultadosHTML = Object.keys(resultado).map((pais) => {
    const media = resultado[pais].media;
    const recuento = resultado[pais].recuento;

    return `<p>País: ${pais}, Media: ${media}, Recuento: ${recuento}</p>`;
  }).join('');

  res.send(`
    <html>
      <body>
        <h1>Medias del campo ${valorNumerico} para todos los países con repeticiones:</h1>
        ${resultadosHTML}
      </body>
    </html>
  `);
});


