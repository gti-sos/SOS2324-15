
const API_BASE = "/api/v1/students-sleep-health";
let data_SCG = require('../index-SCG');


  module.exports= (app,dbSleep) =>{


    
  //   // Get sobre api

  //   app.get(API_BASE,(req,res)=>{

  //     dbSleep.find({},(err,datosSleep)=>{

  //         if(err){
  //             res.sendStatus(500,"Internal Error");
  //         }else{
  //           res.send(JSON.stringify(datosSleep.map((c)=>{
  //             delete c._id;
  //             return c;
  //               })));  
  //         }
  //     });
  // });




//   // Get sobre api con paginación y filtros
// app.get(API_BASE, (req, res) => {
//   // Obtener parámetros de consulta
//   const filters = req.query;
//   const limit = parseInt(filters.limit) || 10;  // Valor por defecto de 10 si no se proporciona

//   // Construir el objeto de filtro basado en los parámetros de consulta
//   const filterObject = {};

//   // Iterar sobre los parámetros de la consulta y agregarlos al objeto de filtro
//   Object.keys(filters).forEach(key => {
//     if (key !== 'limit') {
//       filterObject[key] = filters[key];
//     }
//   });

//   // Realizar la búsqueda en la base de datos con los filtros y paginación
//   dbSleep.find(filterObject)
//     .limit(limit)
//     .exec((err, filteredData) => {
//       if (err) {
//         res.status(500).json({ message: 'Internal Error' });
//       } else {
//         // Si no hay error, devolver los datos filtrados
//         res.status(200).json(filteredData);
//       }
//     });
// });

  
// Get sobre api con paginación y filtros


// app.get(API_BASE, (req, res) => {
//   // Obtener parámetros de consulta
//   const filters = req.query;
//   const limit = parseInt(filters.limit) || 10;  // Valor por defecto de 10 si no se proporciona

//   // Construir el objeto de filtro basado en los parámetros de consulta
//   const filterObject = {};

//   // Iterar sobre los parámetros de la consulta y agregarlos al objeto de filtro
//   Object.keys(filters).forEach(key => {
//     if (key !== 'limit') {
//       // Verificar si el valor es numérico
//       const value = isNaN(filters[key]) ? filters[key] : parseInt(filters[key]);

//       filterObject[key] = value;
//     }
//   });

//   // Realizar la búsqueda en la base de datos con los filtros y paginación
//   dbSleep.find(filterObject)
//     .limit(limit)
//     .exec((err, filteredData) => {
//       if (err) {
//         res.status(500).json({ message: 'Internal Error' });
//       } else {
//         // Si no hay error, devolver los datos filtrados
//         res.status(200).json(filteredData);
//       }
//     });
// });

  
  //GET GENERAL 

  // Búsqueda de datos con parámetros específicos y paginación
  app.get(API_BASE, (req, res) => {
    // Obtenemos los parámetros de búsqueda y paginación de la solicitud
    const queryParameters = req.query;
    const limit = parseInt(queryParameters.limit) || 10; // Tamaño de página predeterminado: 10
    const offset = parseInt(queryParameters.offset) || 0; // Offset predeterminado: 0

    // Construimos la consulta de búsqueda basada en los parámetros proporcionados
    let query = {};

    // Iteramos sobre cada parámetro de búsqueda
    Object.keys(queryParameters).forEach(key => {
        // Si el parámetro no es "limit", "offset" u otros parámetros de paginación, lo consideramos como un atributo de búsqueda
        if (key !== 'limit' && key !== 'offset') {
            // Verificamos si el valor es numérico
            const value = !isNaN(queryParameters[key]) ? parseInt(queryParameters[key]) : queryParameters[key];
            // Si es numérico, agregamos un filtro de igualdad, de lo contrario, realizamos la búsqueda de texto como antes
            query[key] = !isNaN(value) ? value : new RegExp(value, 'i');
        }
    });

    // Ejecutamos la consulta en la base de datos con paginación
    dbSleep.find(query).skip(offset).limit(limit).exec((err, datosSleep) => {
        if (err) {
            res.status(500).json({ message: 'Internal Error' });
        } else {
            // Eliminamos el campo _id de los resultados
            const resultsWithoutId = datosSleep.map(student => {
                const { _id, ...studentWithoutId } = student;
                return studentWithoutId;
            });
            res.status(200).json(resultsWithoutId);
        }
    });
});









 
   
    //Get crea datos si esta vacio en loadInitialData

    app.get(API_BASE+"/loadInitialData",(req,res)=>{
      dbSleep.insert(data_SCG);
      res.sendStatus(200,"Ok");
  });


  // Get con redirección a doc Postman

  app.get(API_BASE+"/docs",(req,res) => {

    res.status(301).redirect("https://documenter.getpostman.com/view/33032447/2sA2xh3DCL")

  });

  //Post sobre api

  // app.post(API_BASE, (req, res) => {
  //   try {
  //     const nuevoDato = req.body;
  
  //     // Verificar si los datos requeridos están presentes
  //     if (!nuevoDato || !nuevoDato.country) {
  //       throw new Error("Datos incompletos. Se requiere 'country'.");
  //     }
  
  //     // Insertar el nuevo dato en la base de datos
  //     dbSleep.insert(nuevoDato);
  
  //     // Responder con el estado 201 Created
  //     res.status(201).json({ message: 'Created', nuevoDato });
  //   } catch (error) {
  //     console.error("Error en la solicitud POST:", error);
  //     res.status(500).json({ error: 'Internal Server Error' });
  //   }
  // }); 


  app.post(API_BASE, (req, res) => {
    const newData = req.body;

    // Verificar si el JSON recibido contiene los campos esperados
    const expectedFields = ['person_id', 'gender', 'age', 'bachelor_degree', 'quality_of_sleep', 'physical_activity_level', 'stress_level', 'bmi_category', 'daily_steps', 'sleep_disorder', 'country', 'date'];
    const receivedFields = Object.keys(newData);

    const isValidData = expectedFields.every(field => receivedFields.includes(field));

    if (!isValidData) {
      // Si no contiene los campos esperados, devolver un código de estado 400
      res.status(400).json({ message: 'Bad request - Missing or unexpected fields' });
    } else {
      // Verificar si ya existe un documento con la misma country en la base de datos
      dbSleep.findOne({ country: newData.country }, (err, existingData) => {
        if (err) {
          res.status(500).json({ message: 'Internal Error' });
        } else {
          if (existingData) {
            res.status(409).json({ message: 'Resource already exists' });
          } else {
            // Si no existe, insertar el nuevo documento
            dbSleep.insert(newData, (err, insertedData) => {
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

 
  //Put sobre api

  app.put(API_BASE, (req, res) => {
    res.status(405).json({ error: 'Method not allowed,405' });
  });

  // Delete sobre api

  app.delete(API_BASE, (req, res) => {
    dbSleep.remove({}, { multi: true }, (err, numRemoved) => {
      if (err) {
        res.sendStatus(500, 'Internal Error');
      } else {
        if (numRemoved >= 1) {
          res.sendStatus(200, 'Ok');
        } else {
          res.sendStatus(404, 'Not found');
        }
      }
    });
  });

  

  // Get sobre valor concreto de country

  app.get(API_BASE + "/:country", (req, res) => {
    const countryName = req.params.country;

    // Verificar si el parámetro country está presente
    if (!countryName) {
      res.status(400).json({ error: "Bad Request. Se requiere 'country' como parámetro." });
      return;
    }

    // Buscar datos según el país en la base de datos
    dbSleep.find({ country: countryName }, (err, countryData) => {
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


  //Post sobre un valor de country

  app.post(API_BASE + "/:country", (req, res) => {
    res.status(405).json({ error: 'Method not allowed,405' });
  })

  //Put sobre un valor de country

  // app.put(API_BASE + "/:country", (req, res) => {
  //   const countryNameURL = req.params.country;
  //   const newData = req.body;
  //   const countryNameBody = newData.country;
  
  //   // Verifica si la country en la URL coincide con la del body
  //   if (countryNameURL !== countryNameBody) {
  //     res.status(400).json({ message: 'Country mismatch between URL and body' });
  //     return;
  //   }
    
  //   // Actualiza el documento en la base de datos
  //   dbSleep.update({ country: countryNameURL }, newData, {}, (err, numUpdated) => {
  //     if (err) {
  //       res.status(500).json({ message: 'Internal Error' });
  //     } else {
  //       if (numUpdated === 1) {
  //         res.status(200).json({ message: 'Updated', updatedData: newData });
  //       } else {
  //         res.status(404).json({ message: 'Country not found' });
  //       }
  //     }
  //   });
  // });

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
  dbSleep.update({ country: countryNameURL }, newData, {}, (err, numUpdated) => {
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


  //Delete sobre valor de country

  app.delete(API_BASE+"/:country",(req,res)=>{
    let country = req.params.country;
  
    dbSleep.remove({ "country": country},{ multi: true },(err,numRemoved)=>{
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


  



  }