

const API_BASE = "/api/v2/students-performance-dataset";
import datos from "../index-MFC.js";
let data_MFC = datos;



function loadBackendMFC1(app,dbStudents){
  // Get con redirección a doc Postman

  app.get(API_BASE+"/docs",(req,res) => {

    res.status(301).redirect("https://documenter.getpostman.com/view/33030259/2sA2xnwUY5")

  });







      //GET GENERAL 

      app.get(API_BASE + "/", (req, res) => {
        const queryParameters = req.query;
        const limit = parseInt(queryParameters.limit) || 10;
        const offset = parseInt(queryParameters.offset) || 0;
        let from = req.query.from;
        let to = req.query.to;
    
        let query = {};
    
        // Verifica si hay parámetros 'from' y 'to'
        if (from !== undefined && to !== undefined) {
            const fromAge = parseInt(from);
            const toAge = parseInt(to);
            if (isNaN(fromAge) || isNaN(toAge)) {
                return res.status(400).send("Invalid age format. Please provide valid age values.");
            }
            // Si las edades son válidas, construye la consulta para filtrar por el rango de edades
            query.student_age = { $gte: fromAge, $lte: toAge };
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
            dbStudents.count({}, (err, count) => {
                if (err) {
                    res.sendStatus(500);
                } else {
                    if (count === 0) {
                        res.status(200).json([]);
                    } else {
                        dbStudents.find({}).skip(offset).limit(limit).exec((err, data) => {
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
            dbStudents.find(query).skip(offset).limit(limit).exec((err, data) => {
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
        dbStudents.count({}, (err, count) => {
            if (err) {
                console.error("Error al verificar si la base de datos está vacía:", err);
                res.sendStatus(500); // Error interno del servidor
            } else {
                if (count === 0) {
                    // Insertar datos iniciales solo si la colección está vacía
                    dbStudents.insert(data_MFC, (err, docs) => {
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
      const expectedFields = ['country', 'student_age', 'sex', 'additional_work', 'sports_activity', 'transportation', 'weekly_study_hours', 'reading', 'listening_in_class', 'project_work', 'attendance_percentage', 'calification_average', 'date'];
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









  //POST PARA PAIS CONCRETO (metodo no permitido)
    app.post(API_BASE + "/:country", (req, res) => {
      res.status(405).json({ error: 'Method not allowed,405' });
    })







    // Get datos para un año específico
  app.get(`${API_BASE}/year/:year`, (req, res) => {
    const year = req.params.year;
    dbStudents.find({ year: year }, (err, yearData) => {
      if (err) {
        res.status(500).json({ message: 'Internal Error' });
      } else {
        if (yearData.length > 0) {
          res.status(200).json(yearData);
        } else {
          res.status(404).json({ message: 'Data not found for the specified year' });
        }
      }
    });
  });









  // Get Pais especifico

  app.get(API_BASE + "/:country", (req, res) => {
    const countryName = req.params.country;
    dbStudents.find({ country: countryName }, (err, countryData) => {
      if (err) {
        res.status(500).json({ message: 'Internal Error' });
      } else {
        if (countryData.length > 0) {
          // Eliminar el campo _id de cada objeto en el array
          const countryDataSinID = countryData.map(({ _id, ...rest }) => rest);
          res.status(200).json(countryDataSinID);
        } else {
          res.status(404).json({ message: 'Country not found' });
        }
      }
    });
  });






  // GET PAIS Y EDAD DEL ESTUDIANTE CONCRETA

  app.get(`${API_BASE}/:country/:student_age`, (req, res) => {
    const countryName = req.params.country;
    const studentAge = parseInt(req.params.student_age); // Parsear la edad como un número entero

    // Verificar si la edad es válida
    if (isNaN(studentAge)) {
      res.status(400).json({ error: 'Invalid student age' });
      return;
    }

    // Verificar la existencia de datos para el país y edad del estudiante especificada
    dbStudents.find({ country: countryName, student_age: studentAge }, (err, datos) => {
      if (err) {
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      if (datos.length > 0) {
        // Eliminar el campo _id de cada objeto en el array
        const datosSinID = datos.map(({ _id, ...rest }) => rest);
        res.status(200).json(datosSinID[0]); // Devuelve un array de objetos sin el campo _id
      } else {
        res.status(404).json({ message: 'Data not found for the specified country and student age' });
      }
    });
  });












  // PUT para actualizar datos de un país y una edad específica


  app.put(`${API_BASE}/:country/:student_age`, (req, res) => {
    const countryName = req.params.country;
    const studentAge = parseInt(req.params.student_age);
    const newData = req.body;

    // Verificar si la edad es un número válido
    if (isNaN(studentAge)) {
        res.status(400).json({ message: 'Invalid student age' });
        return;
    }

    // Verificar si el JSON recibido contiene los campos esperados
    const expectedFields = ['country', 'student_age', 'sex', 'additional_work', 'sports_activity', 'transportation', 'weekly_study_hours', 'reading', 'listening_in_class', 'project_work', 'attendance_percentage', 'calification_average', 'date'];
    const receivedFields = Object.keys(newData);

    const isValidData = expectedFields.every(field => receivedFields.includes(field));

    if (!isValidData) {
        // Si no contiene los campos esperados, devolver un código de estado 400
        res.status(400).json({ message: 'Bad request - Missing or unexpected fields' });
    } else {
        // Actualizar el documento en la base de datos
        dbStudents.update({ country: countryName, student_age: studentAge }, newData, {}, (err, numUpdated) => {
            if (err) {
                res.status(500).json({ message: 'Internal Error' });
            } else {
                if (numUpdated === 1) {
                    res.status(200).json({ message: 'Updated', updatedData: newData });
                } else {
                    res.status(404).json({ message: 'Data not found for the specified country and student age' });
                }
            }
        });
    }
  });











  // DELETE para eliminar datos de un país y una edad específica


  app.delete(`${API_BASE}/:country/:student_age`, (req, res) => {
    const countryName = req.params.country;
    const studentAge = parseInt(req.params.student_age);

    // Verificar si la edad es un número válido
    if (isNaN(studentAge)) {
        res.status(400).json({ message: 'Invalid student age' });
        return;
    }

    // Eliminar el documento de la base de datos
    dbStudents.remove({ country: countryName, student_age: studentAge }, { multi: true }, (err, numRemoved) => {
        if (err) {
            res.status(500).json({ message: 'Internal Error' });
        } else {
            if (numRemoved >= 1) {
                res.status(200).json({ message: 'Deleted' });
            } else {
                res.status(404).json({ message: 'Data not found for the specified country and student age' });
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










  //Put general mal (metodo no permitido)


  app.put(API_BASE, (req, res) => {
    res.status(405).json({ error: 'Method not allowed,405' });
  })
    

  }
export {loadBackendMFC1};