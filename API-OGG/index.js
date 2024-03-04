
const API_BASE="/api/v1/students-performance-in-exams";

let data_OGG=require('../index-OGG');


let datosStudents= [];


  module.exports= (app,dbExams) =>{

    // Get Todos los datos general
    app.get(API_BASE,(req,res)=>{

      dbExams.find({},(err,datosStudents)=>{

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

    app.get(API_BASE + "/loadInitialData", (req, res) => {
      // Verificar si la colección está vacía
      dbExams.count({}, (err, count) => {
          if (err) {
              console.error("Error al verificar si la base de datos está vacía:", err);
              res.sendStatus(500); // Error interno del servidor
          } else {
              if (count === 0) {
                  // Insertar datos iniciales solo si la colección está vacía
                  dbExams.insert(data_OGG, (err, docs) => {
                      if (err) {
                          console.error("Error al insertar datos iniciales:", err);
                          res.sendStatus(500); // Error interno del servidor
                      } else {
                          console.log("Datos iniciales insertados correctamente.");
                          res.sendStatus(200); // Ok
                      }
                  });
              } else {
                  console.log("La base de datos ya contiene datos, no se insertarán datos iniciales.");
                  res.sendStatus(200); // Ok
              }
          }
      });
  });




  // POST general
  app.post(API_BASE, (req, res) => {
    const newData = req.body;

    // Verificar si el JSON recibido contiene los campos esperados
  const expectedFields = ['gender','race_ethnicity','parental_level_of_education','lunch','test_preparation_course','math_score','reading_score','writing_score','country','date'];
    const receivedFields = Object.keys(newData);

    const isValidData = expectedFields.every(field => receivedFields.includes(field));

    if (!isValidData) {
      // Si no contiene los campos esperados, devolver un código de estado 400
      res.status(400).json({ message: 'Bad request - Missing or unexpected fields' });
    } else {
      // Verificar si ya existe un documento con la misma country en la base de datos
      dbExams.findOne({ country: newData.country }, (err, existingData) => {
        if (err) {
          res.status(500).json({ message: 'Internal Error' });
        } else {
          if (existingData) {
            res.status(409).json({ message: 'Resource already exists' });
          } else {
            // Si no existe, insertar el nuevo documento
            dbExams.insert(newData, (err, insertedData) => {
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
  dbExams.find({ country: countryName }, (err, countryData) => {
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

  dbExams.remove({ "country": country},{ multi: true },(err,numRemoved)=>{
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
  dbExams.remove({}, { multi: true }, (err, numRemoved) => {
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
  dbExams.update({ country: countryNameURL }, newData, {}, (err, numUpdated) => {
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


app.put(API_BASE, (req, res) => {
  res.status(405).json({ error: 'Method not allowed,405' });
})
  }