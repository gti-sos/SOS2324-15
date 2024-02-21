//console.log("Hola Mundo");


let express = require("express");

let app = express();

const PORT = 10015;



  
  const datos = [
    {
      "student_age": 25,
      "sex": "Male",
      "additional_work": "Yes",
      "sports_activity": "No",
      "transportation": "Private",
      "weekly_study_hours": 17,
      "reading": "Yes",
      "listening_in_class": "No",
      "project_work": "No",
      "attendance_percentage": 84,
      "calification_average": 3.5,
      "country": "China",
      "date": "09/04/2023"
  },
  {
      "student_age": 25,
      "sex": "Male",
      "additional_work": "Yes",
      "sports_activity": "No",
      "transportation": "Private",
      "weekly_study_hours": 14,
      "reading": "Yes",
      "listening_in_class": "Yes",
      "project_work": "Yes",
      "attendance_percentage": 97,
      "calification_average": 3,
      "country": "China",
      "date": "3/20/2023"
  },
  {
      "student_age": 19,
      "sex": "Male",
      "additional_work": "No",
      "sports_activity": "No",
      "transportation": "Private",
      "weekly_study_hours": 1,
      "reading": "No",
      "listening_in_class": "No",
      "project_work": "Yes",
      "attendance_percentage": 79,
      "calification_average": 1,
      "country": "Portugal",
      "date": "10/29/2023"
  },
  {
      "student_age": 20,
      "sex": "Female",
      "additional_work": "Yes",
      "sports_activity": "No",
      "transportation": "Bus",
      "weekly_study_hours": 22,
      "reading": "No",
      "listening_in_class": "No",
      "project_work": "No",
      "attendance_percentage": 93,
      "calification_average": 4,
      "country": "China",
      "date": "02/03/2024"
  },
  {
      "student_age": 25,
      "sex": "Male",
      "additional_work": "No",
      "sports_activity": "No",
      "transportation": "Bus",
      "weekly_study_hours": 5,
      "reading": "Yes",
      "listening_in_class": "Yes",
      "project_work": "Yes",
      "attendance_percentage": 96,
      "calification_average": 1,
      "country": "Denmark",
      "date": "5/14/2023"
  },
  {
      "student_age": 24,
      "sex": "Male",
      "additional_work": "No",
      "sports_activity": "No",
      "transportation": "Private",
      "weekly_study_hours": 9,
      "reading": "Yes",
      "listening_in_class": "Yes",
      "project_work": "Yes",
      "attendance_percentage": 80,
      "calification_average": 2,
      "country": "France",
      "date": "03/06/2023"
  },
  {
      "student_age": 20,
      "sex": "Male",
      "additional_work": "No",
      "sports_activity": "No",
      "transportation": "Private",
      "weekly_study_hours": 23,
      "reading": "No",
      "listening_in_class": "Yes",
      "project_work": "Yes",
      "attendance_percentage": 86,
      "calification_average": 4,
      "country": "France",
      "date": "07/08/2023"
  },
  {
      "student_age": 20,
      "sex": "Female",
      "additional_work": "Yes",
      "sports_activity": "Yes",
      "transportation": "Bus",
      "weekly_study_hours": 21,
      "reading": "No",
      "listening_in_class": "Yes",
      "project_work": "Yes",
      "attendance_percentage": 97,
      "calification_average": 4,
      "country": "United States",
      "date": "1/20/2024"
  },
  {
      "student_age": 20,
      "sex": "Female",
      "additional_work": "No",
      "sports_activity": "Yes",
      "transportation": "Bus",
      "weekly_study_hours": 18,
      "reading": "No",
      "listening_in_class": "No",
      "project_work": "Yes",
      "attendance_percentage": 89,
      "calification_average": 3.5,
      "country": "France",
      "date": "2/23/2023"
  },
  {
      "student_age": 21,
      "sex": "Female",
      "additional_work": "No",
      "sports_activity": "No",
      "transportation": "Bus",
      "weekly_study_hours": 10,
      "reading": "No",
      "listening_in_class": "No",
      "project_work": "No",
      "attendance_percentage": 96,
      "calification_average": 2,
      "country": "Poland",
      "date": "11/22/2023"
  }
  ];
  
  // Filtrar países que aparecen más de una vez
  const paisesRepetidos = datos.reduce((acc, dato) => {
    if (acc[dato.country]) {
      acc[dato.country]++;
    } else {
      acc[dato.country] = 1;
    }
    return acc;
  }, {});
  
  const paisesConMasDeUnaAparicion = Object.keys(paisesRepetidos).filter(pais => paisesRepetidos[pais] > 1);
  
  // Calcular la media de las horas de estudio para los países seleccionados
  const horasDeEstudio = paisesConMasDeUnaAparicion.map(pais => {
    const filasFiltradas = datos.filter((fila) => fila.country === pais);
    const horasEstudio = filasFiltradas.map((fila) => fila.weekly_study_hours);
    const mediaHorasEstudio = horasEstudio.reduce((acc, valor) => acc + valor, 0) / horasEstudio.length;
    return { pais, mediaHorasEstudio };
  });
  

  /*
  app.get("/samples/MFC", (req,res) => {
    res.send(`<html><body><h1> ${horasDeEstudio(datos)}</h1></body></html>`);
  });

  
  app.get("/samples/MFC", (req, res) => {
  const horasDeEstudioString = JSON.stringify(horasDeEstudio, null, 2);
  res.send(`<html><body><pre>${horasDeEstudioString}</pre></body></html>`);
});

  */
app.get("/samples/MFC", (req,res) => {
  const htmlResult = horasDeEstudio.map(resultado => `<p>País: ${resultado.pais}, Media de horas de estudio: ${resultado.mediaHorasEstudio}</p>`).join('');
  res.send(`<html><body>${htmlResult}</body></html>`);
});

  
  app.listen(10015);
  
  console.log(`Server listening on port ${PORT}.`);

  
  
console.log(horasDeEstudio);

//https://sos2324-15-mfc.ew.r.appspot.com
