let cool = require("cool-ascii-faces");
let express = require("express")
let app = express();

let data_OGG= require('./index-OGG');
let data_MFC= require('./index-MFC');
let data_SCG= require('./index-SCG');


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