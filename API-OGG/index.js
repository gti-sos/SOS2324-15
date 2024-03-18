
const API_BASE="/api/v1/students-performance-in-exams";

let data_OGG=require('../index-OGG');

  module.exports= (app,dbExams) =>{

  //GET GENERAL 
  app.get(API_BASE + "/", (req, res) => {
    const queryParameters = req.query;
    const limit = parseInt(queryParameters.limit) || 10;
    const offset = parseInt(queryParameters.offset) || 0;
    let from = req.query.from;
    let to = req.query.to;
  
    let query = {};
  
    // Verifica si hay parámetros 'from' y 'to' para math_score
    if (from !== undefined && to !== undefined) {
      const fromMathScore = parseInt(from);
      const toMathScore = parseInt(to);
      if (isNaN(fromMathScore) || isNaN(toMathScore)) {
          return res.status(400).send("Invalid math_score format. Please provide valid values.");
      }
      // Si los valores son válidos, construye la consulta para filtrar por el rango de math_score
      query.math_score = { $gte: fromMathScore, $lte: toMathScore };
    }
  
    // Construir la consulta basada en los parámetros proporcionados
    Object.keys(queryParameters).forEach(key => {
        if (key !== 'limit' && key !== 'offset' && key !== 'from' && key !== 'to') {
            const value = !isNaN(queryParameters[key]) ? parseFloat(queryParameters[key]) : queryParameters[key];
            if (typeof value === 'string') {
                query[key] = new RegExp(value, 'i');
            } else {
                query[key] = value;
            }
        }
    });
  
    // Verificar si se proporcionaron parámetros de búsqueda
    const hasSearchParameters = Object.keys(queryParameters).some(key => key !== 'limit' && key !== 'offset' && key !== 'from' && key !== 'to');
  
    if (!hasSearchParameters) {
        dbExams.count({}, (err, count) => {
            if (err) {
                res.sendStatus(500);
            } else {
                if (count === 0) {
                    res.status(200).json([]);
                } else {
                    dbExams.find(query).skip(offset).limit(limit).exec((err, data) => {
                        if (err) {
                            res.sendStatus(500);
                        } else {
                            const resultsWithoutId = data.map(d => {
                                const { _id, ...datWithoutId } = d;
                                return datWithoutId;
                            });
                            res.status(200).json(resultsWithoutId);
                        }
                    });
                }
            }
        });
    } else {
        dbExams.find(query).skip(offset).limit(limit).exec((err, data) => {
            if (err) {
                res.status(500).send("Internal Server Error");
                return;
            }
            if (data.length > 0) {
                const formattedData = data.map((d) => {
                    const { _id, ...formatted } = d;
                    return formatted;
                });
                res.status(200).json(formattedData);
            } else {
                res.status(404).send("Not Found");
            }
        });
    }
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



// Get con redirección a doc Postman

app.get(API_BASE+"/docs",(req,res) => {

  res.status(301).redirect("https://documenter.getpostman.com/view/33477031/2sA2xnxABg")

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
        // Eliminar el campo '_id' de cada objeto en el array
        const dataWithoutId = countryData.map(item => {
          const { _id, ...data } = item;
          return data;
        });
        res.status(200).json(dataWithoutId);
      } else {
        res.status(404).json({ message: 'Country not found' });
      }
    }
  });
});



// GET PAIS Y NOTA DE EXAMEN DE ESTUDIANTE CONCRETO

app.get(`${API_BASE}/:country/:math_score`, (req, res) => {
  const countryName = req.params.country;
  const mathScore = parseInt(req.params.math_score); 

  // Verificar si la nota es válida
  if (isNaN(mathScore)) {
    res.status(400).json({ error: 'Invalid math score' });
    return;
  }

  // Verificar la existencia de datos para el país y nota del estudiante especificada
  dbExams.find({ country: countryName, math_score: mathScore }, (err, datos) => {
    if (err) {
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    if (datos.length > 0) {
      // Elimina el campo '_id' del objeto
      const { _id, ...dataWithoutId } = datos[0];
      res.status(200).json(dataWithoutId); // Devuelve un array de objetos
    } else {
      res.status(404).json({ message: 'Data not found for the specified country and math score' });
    }
  });
  
});

// PUT para actualizar datos de un país y una nota específica


app.put(`${API_BASE}/:country/:math_score`, (req, res) => {
  const countryName = req.params.country;
  const mathScore = parseInt(req.params.math_score);
  const newData = req.body;

  // Verificar si la nota es un número válido
  if (isNaN(mathScore)) {
      res.status(400).json({ message: 'Invalid math score' });
      return;
  }

  // Verificar si el JSON recibido contiene los campos esperados
  const expectedFields = ['gender', 'race_ethnicity', 'parental_level_of_education', 'lunch', 'test_preparation_course', 'math_score', 'reading_score', 'writing_score', 'country', 'date'];
  const receivedFields = Object.keys(newData);

  const isValidData = expectedFields.every(field => receivedFields.includes(field));

  if (!isValidData) {
      // Si no contiene los campos esperados, devolver un código de estado 400
      res.status(400).json({ message: 'Bad request - Missing or unexpected fields' });
  } else {
      // Actualizar el documento en la base de datos
      dbExams.update({ country: countryName, math_score: mathScore }, newData, {}, (err, numUpdated) => {
          if (err) {
              res.status(500).json({ message: 'Internal Error' });
          } else {
              if (numUpdated === 1) {
                  res.status(200).json({ message: 'Updated', updatedData: newData });
              } else {
                  res.status(404).json({ message: 'Data not found for the specified country and math score' });
              }
          }
      });
  }
});


// DELETE para eliminar datos de un país y una nota específica


app.delete(`${API_BASE}/:country/:math_score`, (req, res) => {
  const countryName = req.params.country;
  const mathScore = parseInt(req.params.math_score);

  // Verificar si la nota es válida
  if (isNaN(mathScore)) {
      res.status(400).json({ message: 'Invalid math Score' });
      return;
  }

  // Eliminar el documento de la base de datos
  dbExams.remove({ country: countryName, math_score: mathScore }, { multi: true }, (err, numRemoved) => {
      if (err) {
          res.status(500).json({ message: 'Internal Error' });
      } else {
          if (numRemoved >= 1) {
              res.status(200).json({ message: 'Deleted' });
          } else {
              res.status(404).json({ message: 'Data not found for the specified country and math score' });
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








//Put genera mal (no se permite)


app.put(API_BASE, (req, res) => {
  res.status(405).json({ error: 'Method not allowed,405' });
})
  }