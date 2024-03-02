
const API_BASE="/api/v1/students-performance-dataset";

let data_MFC= require('../index-MFC');


let datosStudents= [];


  module.exports= (app) =>{


   
    //Get crea datos si esta vacio en loadInitialData

    app.get(API_BASE + "/loadInitialData", (req, res) => {
      if (datosStudents.length === 0) {
        let initialData =[
          { country: "China", student_age: 25, sex: "Male", additional_work: "Yes", sports_activity: "No", transportation: "Private", weekly_study_hours: 17, reading: "Yes", listening_in_class: "No", project_work: "No", attendance_percentage: 84, calification_average: 3.5, date: "09/04/2023" },
          { country: "China", student_age: 25, sex: "Male", additional_work: "Yes", sports_activity: "No", transportation: "Private", weekly_study_hours: 14, reading: "Yes", listening_in_class: "Yes", project_work: "Yes", attendance_percentage: 97, calification_average: 3, date: "3/20/2023" },
          { country: "Portugal", student_age: 19, sex: "Male", additional_work: "No", sports_activity: "No", transportation: "Private", weekly_study_hours: 1, reading: "No", listening_in_class: "No", project_work: "Yes", attendance_percentage: 79, calification_average: 1, date: "10/29/2023" },
          { country: "China", student_age: 20, sex: "Female", additional_work: "Yes", sports_activity: "No", transportation: "Bus", weekly_study_hours: 22, reading: "No", listening_in_class: "No", project_work: "No", attendance_percentage: 93, calification_average: 4, date: "02/03/2024" },
          { country: "Denmark", student_age: 25, sex: "Male", additional_work: "No", sports_activity: "No", transportation: "Bus", weekly_study_hours: 5, reading: "Yes", listening_in_class: "Yes", project_work: "Yes", attendance_percentage: 96, calification_average: 1, date: "5/14/2023" },
          { country: "France", student_age: 24, sex: "Male", additional_work: "No", sports_activity: "No", transportation: "Private", weekly_study_hours: 9, reading: "Yes", listening_in_class: "Yes", project_work: "Yes", attendance_percentage: 80, calification_average: 2, date: "03/06/2023" },
          { country: "France", student_age: 20, sex: "Male", additional_work: "No", sports_activity: "No", transportation: "Private", weekly_study_hours: 23, reading: "No", listening_in_class: "Yes", project_work: "Yes", attendance_percentage: 86, calification_average: 4, date: "07/08/2023" },
          { country: "United States", student_age: 20, sex: "Female", additional_work: "Yes", sports_activity: "Yes", transportation: "Bus", weekly_study_hours: 21, reading: "No", listening_in_class: "Yes", project_work: "Yes", attendance_percentage: 97, calification_average: 4, date: "1/20/2024" },
          { country: "France", student_age: 20, sex: "Female", additional_work: "No", sports_activity: "Yes", transportation: "Bus", weekly_study_hours: 18, reading: "No", listening_in_class: "No", project_work: "Yes", attendance_percentage: 89, calification_average: 3.5, date: "2/23/2023" },
          { country: "Poland", student_age: 21, sex: "Female", additional_work: "No", sports_activity: "No", transportation: "Bus", weekly_study_hours: 10, reading: "No", listening_in_class: "No", project_work: "No", attendance_percentage: 96, calification_average: 2, date: "11/22/2023" }
        ];
        datosStudents=initialData;
        res.status(201).json({ message: 'Created initial data' });
    } else {
        res.status(409).json({ message: 'Data already exists' });
    }
});

 // Get Pais especifico

 app.get(API_BASE + "/:country", (req, res) => {
  const countryName = req.params.country;
  const countryData = datosStudents.filter(data => data.country === countryName);
  if (countryData.length > 0) {
      res.status(200).json(countryData);
  } else {
      res.status(404).json({ message: 'Country not found' });
  }
});
        
    
// Get Todos los datos
  app.get(API_BASE, (req,res) => {
  
      res.send(JSON.stringify(datosStudents));
    });




  // Post crear datos general
  app.post(API_BASE + "/", (req,res) => {
    let datos = req.body;
    
    const mismoDato = datosStudents.some(p => p.country === datos.country && p.date === datos.date);
    if (mismoDato) {
        res.status(409).send("Conflict"); //ya existe
    } else if (!datos || Object.keys(datos).length === 0) {
        res.status(400).send("Bad Request"); //no son validos
    } else {
        datosStudents.push(datos);
        res.status(201).send("Created"); //creados
    }
  });




  //Put mal

  app.put(API_BASE + "/", (req, res) => {
    //aunque no se autorice, el put recibe datos como cuerpo
    let datos = req.body;
    res.sendStatus(405, "Method Not Allowed");
});

 //Delete

 app.delete(API_BASE + "/", (req, res) => {
  datosStudents.splice(0, datosStudents.length);
  res.sendStatus(200, "Ok");
});



   

}