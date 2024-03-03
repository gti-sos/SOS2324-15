const API_BASE = "/api/v1/students-sleep-health";
let data_SCG = require('../index-SCG');



  module.exports= (app,dbSleep) =>{


    
    // Get sobre api

    app.get(API_BASE,(req,res)=>{

      dbSleep.find({},(err,datosSleep)=>{

          if(err){
              res.sendStatus(500,"Internal Error");
          }else{
            res.send(JSON.stringify(datosSleep.map((c)=>{
              delete c._id;
              return c;
                })));  
          }
      });
  });


 
   
    //Get crea datos si esta vacio en loadInitialData

    app.get(API_BASE+"/loadInitialData",(req,res)=>{
      dbSleep.insert(data_SCG);
      res.sendStatus(200,"Ok");
  });


  //Post sobre api

  app.post(API_BASE, (req, res) => {
    try {
      const nuevoDato = req.body;
  
      // Verificar si los datos requeridos están presentes
      if (!nuevoDato || !nuevoDato.country) {
        throw new Error("Datos incompletos. Se requiere 'country'.");
      }
  
      // Insertar el nuevo dato en la base de datos
      dbSleep.insert(nuevoDato);
  
      // Responder con el estado 201 Created
      res.status(201).json({ message: 'Created', nuevoDato });
    } catch (error) {
      console.error("Error en la solicitud POST:", error);
      res.status(500).json({ error: 'Internal Server Error' });
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

  app.put(`${API_BASE}/:country`, (req, res) => {
    try {
      const countryToUpdate = req.params.country;
      const nuevoDato = req.body;

      // Verificar si los datos requeridos están presentes
      if (!nuevoDato || !countryToUpdate || !nuevoDato.country) {
        throw new Error("Datos incompletos. Se requiere 'country' en la URL y en el cuerpo.");
      }

      // Buscar el dato existente en la base de datos basado en el valor de country
      const datoExistente = dbSleep.findOne({ country: countryToUpdate });

      // Verificar si el dato existe
      if (!datoExistente) {
        throw new Error(`No se encontró ningún dato para el 'country' especificado: ${countryToUpdate}`);
      }

      // Actualizar el dato existente con los nuevos valores
      dbSleep.update({ country: countryToUpdate }, { $set: nuevoDato });

      // Responder con el estado 200 OK
      res.status(200).json({ message: 'Updated', updatedData: { country: countryToUpdate, ...nuevoDato } });
    } catch (error) {
      console.error("Error en la solicitud PUT:", error);
      res.status(400).json({ error: error.message });
    }
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