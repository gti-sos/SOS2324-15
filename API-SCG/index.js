const API_BASE="/api/v1/students-sleep-health";


let data_SCG = require('../index-SCG');


let datosSleep = [];


  module.exports= (app,dbSleep) =>{

    // Get Todos los datos general
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



}