
const API_BASE="/api/v1";

let data_MFC= require('../index-MFC');



  module.exports= (app) =>{

    app.get(API_BASE+"/data_MFC", (req,res) => {
  
        res.send(JSON.stringify(data_MFC));
      });
      
      app.post(API_BASE+"/data_MFC",(req,res)=>{
        let datos = req.body;
        data_MFC.push(datos);
        res.sendStatus(201,"Created");
      });

  }