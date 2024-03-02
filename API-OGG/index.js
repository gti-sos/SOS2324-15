
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

    app.get(API_BASE+"/loadInitialData",(req,res)=>{
      dbExams.insert(data_OGG);
      res.sendStatus(200,"Ok");
  });

//Post general
  app.post(API_BASE,(req,res)=>{
    let general = req.body;
    dbExams.insert(general);
    res.sendStatus(201,"Created");
});

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
  }