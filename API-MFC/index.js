const API_BASE = "/api/v1/students-performance-dataset";
let data_MFC = require('../index-MFC');



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




  // POST general
  app.post(API_BASE, (req, res) => {
    const newData = req.body;

    // Verificar si el JSON recibido contiene los campos esperados
    const expectedFields = ['country', 'student_age', 'sex', 'additional_work', 'sports_activity', 'transportation', 'weekly_study_hours', 'reading', 'listening_in_class', 'project_work', 'attendance_percentage', 'calification_average', 'year'];
    const receivedFields = Object.keys(newData);

    const isValidData = expectedFields.every(field => receivedFields.includes(field));

    if (!isValidData) {
      // Si no contiene los campos esperados, devolver un código de estado 400
      res.status(400).json({ message: 'Bad request - Missing or unexpected fields' });
    } else {
      // Verificar si ya existe un documento con la misma country en la base de datos
      dbStudents.findOne({ country: newData.country }, (err, existingData) => {
        if (err) {
          res.status(500).json({ message: 'Internal Error' });
        } else {
          if (existingData) {
            res.status(409).json({ message: 'Resource already exists' });
          } else {
            // Si no existe, insertar el nuevo documento
            dbStudents.insert(newData, (err, insertedData) => {
              if (err) {
                res.status(500).json({ message: 'Internal Error' });
              } else {
                res.status(201).json({ message: 'Created', insertedData });
              }
            });
          }
        }
      });
    }
  });


//POST PARA PAIS CONCRETO
  app.post(API_BASE + "/:country", (req, res) => {
    res.status(405).json({ error: 'Method not allowed,405' });
  })


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

  dbStudents.remove({ "country": country},{ multi: true },(err,numRemoved)=>{
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
        

 

// Delete general
app.delete(API_BASE + "/", (req, res) => {
  dbStudents.remove({}, { multi: true }, (err, numRemoved) => {
    if (err) {
      res.status(500).json({ message: 'Internal Error' });
    } else {
      res.status(200).json({ message: 'All data deleted successfully' });
    }
  });
});





// PUT para actualizar datos de un país específico
app.put(API_BASE + "/:country", (req, res) => {
  const countryNameURL = req.params.country;
  const newData = req.body;
  const countryNameBody = newData.country;

  // Verifica si la country en la URL coincide con la del body
  if (countryNameURL !== countryNameBody) {
    res.status(400).json({ message: 'Country mismatch between URL and body' });
    return;
  }
  
  // Actualiza el documento en la base de datos
  dbStudents.update({ country: countryNameURL }, newData, {}, (err, numUpdated) => {
    if (err) {
      res.status(500).json({ message: 'Internal Error' });
    } else {
      if (numUpdated === 1) {
        res.status(200).json({ message: 'Updated', updatedData: newData });
      } else {
        res.status(404).json({ message: 'Country not found' });
      }
    }
  });
});








//Put general mal (no se permite)

// PUT GENERAL - Método no permitido
app.put(API_BASE, (req, res) => {
  res.status(405).json({ error: 'Method not allowed,405' });
})
   

}