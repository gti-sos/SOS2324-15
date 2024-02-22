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
    const result = calcularMediaMathScore(data_OGG); 
    res.send(`<html> <body> <h1> La media total del campo numérico ${valorNumerico} es: ${mediaTotalMathScores} </h1> </body> </html>`)
});
