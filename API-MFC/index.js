
const API_BASE="/api/v1/students-performance-dataset";

let data_MFC=require('../index-MFC');


let datosStudents= [];


  module.exports= (app,dbStudents) =>{

    // Get Todos los datos general
    app.get(API_BASE,(req,res)=>{

      dbStudents.find({},(err,datosStudents)=>{

          if(err){
              res.sendStatus(500,"Internal Error");
          }else{
            res.send(JSON.stringify(datosStudents.map((c)=>{
              delete c._id;
              return c;
                })));  
          }
      });
  });


   
    //Get crea datos si esta vacio en loadInitialData

    app.get(API_BASE+"/loadInitialData",(req,res)=>{
      dbStudents.insert(data_MFC);
      res.sendStatus(200,"Ok");
  });

//Post general
  app.post(API_BASE,(req,res)=>{
    let general = req.body;
    dbStudents.insert(general);
    res.sendStatus(201,"Created");
});

 // Get Pais especifico

 app.get(API_BASE + "/:country", (req, res) => {
  const countryName = req.params.country;
  dbStudents.find({ country: countryName }, (err, countryData) => {
    if (err) {
      res.status(500).json({ message: 'Internal Error' });
    } else {
      if (countryData.length > 0) {
        res.status(200).json(countryData);
      } else {
        res.status(404).json({ message: 'Country not found' });
      }
    }
  });
});



 //delete pais especifico

 app.delete(API_BASE+"/:country",(req,res)=>{
  let country = req.params.country;

  dbStudents.remove({ "country": country},{},(err,numRemoved)=>{
      if(err){
          res.sendStatus(500,"Internal Error");
      }else{
         if(numRemoved >= 1){
              res.sendStatus(200,"Ok");
         } else {
              res.sendStatus(404,"Not found");
         }
      }
  });
  
});
        

 //Delete general

 app.delete(API_BASE + "/", (req, res) => {
  datosStudents.splice(0, datosStudents.length);
  res.sendStatus(200, "Ok");
});


// Put especifico

app.put(API_BASE + "/:country", (req, res) => {
  const countryName = req.params.country;
  const nuevoDato = req.body;
  const countryIndex = datosStudents.findIndex(datos => datos.country === countryName);
  if (countryIndex !== -1) {
      datosStudents[countryIndex] = nuevoDato;
      res.status(200).json({ message: 'Updated' });
  } else {
      res.status(400).json({ message: 'Bad request,400' });
  }
});


// Post concreto (No esta permitido)
app.post(API_BASE + "/:country", (req, res) => {
  res.status(405).json({ error: 'Method not allowed,405' });
})


//Put general mal (no se permite)

// PUT GENERAL - Método no permitido
app.put(API_BASE + "/", (req, res) => {
  res.status(405).json({ error: 'Method not allowed,405' });
})
   

}