
const API_BASE="/api/v1";

let data_OGG= require('../index-OGG');



  module.exports= (app) =>{

    app.get(API_BASE+"/data_OGG", (req,res) => {
  
        res.send(JSON.stringify(data_OGG));
      });
      
      app.post(API_BASE+"/data_OGG",(req,res)=>{
        let datos = req.body;
        data_OGG.push(datos);
        res.sendStatus(201,"Created");
      });

  }