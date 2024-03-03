


const datos = [
    { person_id: 13, gender: 'Male', age: 25, bachelor_degree: 'Software Engineer', quality_of_sleep: 6, physical_activity_level: 42, stress_level: 6, bmi_category: 'Overweight', daily_steps: 4200, sleep_disorder: 'None', country: 'Malaysia', date: '6/27/2023' },
    { person_id: 26, gender: 'Male', age: 18, bachelor_degree: 'Doctor', quality_of_sleep: 7, physical_activity_level: 75, stress_level: 6, bmi_category: 'Normal', daily_steps: 8000, sleep_disorder: 'None', country: 'China', date: '07/03/2023' },
    { person_id: 27, gender: 'Male', age: 19, bachelor_degree: 'Doctor', quality_of_sleep: 7, physical_activity_level: 75, stress_level: 6, bmi_category: 'Normal', daily_steps: 8000, sleep_disorder: 'None', country: 'South Africa', date: '6/16/2023' },
    { person_id: 28, gender: 'Male', age: 22, bachelor_degree: 'Doctor', quality_of_sleep: 7, physical_activity_level: 75, stress_level: 6, bmi_category: 'Normal', daily_steps: 8000, sleep_disorder: 'None', country: 'Poland', date: '3/26/2023' },
    { person_id: 29, gender: 'Male', age: 23, bachelor_degree: 'Doctor', quality_of_sleep: 7, physical_activity_level: 75, stress_level: 6, bmi_category: 'Normal', daily_steps: 8000, sleep_disorder: 'None', country: 'France', date: '5/24/2023' },
    { person_id: 30, gender: 'Male', age: 18, bachelor_degree: 'Doctor', quality_of_sleep: 7, physical_activity_level: 75, stress_level: 6, bmi_category: 'Normal', daily_steps: 8000, sleep_disorder: 'None', country: 'Tajikistan', date: '05/11/2023' },
    { person_id: 31, gender: 'Female', age: 19, bachelor_degree: 'Nurse', quality_of_sleep: 5, physical_activity_level: 35, stress_level: 7, bmi_category: 'Normal Weight', daily_steps: 4100, sleep_disorder: 'Sleep Apnea', country: 'China', date: '05/10/2023' },
    { person_id: 32, gender: 'Female', age: 20, bachelor_degree: 'Nurse', quality_of_sleep: 5, physical_activity_level: 35, stress_level: 7, bmi_category: 'Normal Weight', daily_steps: 4100, sleep_disorder: 'Insomnia', country: 'France', date: '2/15/2023' },
    { person_id: 33, gender: 'Female', age: 22, bachelor_degree: 'Nurse', quality_of_sleep: 8, physical_activity_level: 75, stress_level: 4, bmi_category: 'Normal Weight', daily_steps: 6800, sleep_disorder: 'None', country: 'Poland', date: '3/21/2023' },
    { person_id: 34, gender: 'Male', age: 26, bachelor_degree: 'Doctor', quality_of_sleep: 6, physical_activity_level: 30, stress_level: 8, bmi_category: 'Normal', daily_steps: 5000, sleep_disorder: 'None', country: 'Croatia', date: '9/17/2023' },
    { person_id: 35, gender: 'Male', age: 25, bachelor_degree: 'Doctor', quality_of_sleep: 7, physical_activity_level: 75, stress_level: 6, bmi_category: 'Normal', daily_steps: 8000, sleep_disorder: 'None', country: 'Canada', date: '9/20/2023' },
    { person_id: 36, gender: 'Male', age: 29, bachelor_degree: 'Doctor', quality_of_sleep: 6, physical_activity_level: 30, stress_level: 8, bmi_category: 'Normal', daily_steps: 5000, sleep_disorder: 'None', country: 'China', date: '1/19/2024' }
  ];
  
  module.exports = datos;



//   // Valor a buscar en el campo de información geográfica
//   const valorGeografico = 'China'; 

     // Valor a buscar en el campo de información numérica
    const valorNumerico = 'physical_activity_level'
  
//   // Filtra las filas que comparten el valor en el campo geográfico
//   const filasFiltradas = datos.filter((fila) => fila.country === valorGeografico);
  
//   // Extrae el campo numérico de interés (reemplaza 'physical_activity_level' con el nombre real del campo)
//   const valoresNumericos = filasFiltradas.map((fila) => fila.physical_activity_level);
  
//   // Calcula la media de los valores numéricos
//   const media = valoresNumericos.reduce((acc, valor) => acc + valor, 0) / valoresNumericos.length;
  
//   console.log(`La media para el campo ${valorNumerico} para ${valorGeografico} es: ${media}`);
  

// Obtén la cuenta de repeticiones de cada país
const repeticionesPorPais = datos.reduce((acc, fila) => {
    acc[fila.country] = (acc[fila.country] || 0) + 1;
    return acc;
  }, {});
  
  // Filtra los países que se repiten dos veces o más
  const paisesRepetidos = Object.keys(repeticionesPorPais).filter((pais) => repeticionesPorPais[pais] >= 2);
  
  // Inicializa un objeto para almacenar las sumas y recuentos de valores numéricos por país
  const sumasYRecuentosPorPais = {};
  
  // Calcula la suma y recuento de valores numéricos para cada país repetido
  paisesRepetidos.forEach((pais) => {
    const filasFiltradas = datos.filter((fila) => fila.country === pais);
    sumasYRecuentosPorPais[pais] = filasFiltradas.reduce((acc, fila) => {
      acc.suma = (acc.suma || 0) + fila.physical_activity_level;
      acc.recuento = (acc.recuento || 0) + 1;
      return acc;
    }, {});
  });
  
  // Calcula y muestra la media para cada país repetido
  paisesRepetidos.forEach((pais) => {
    const { suma, recuento } = sumasYRecuentosPorPais[pais];
    const media = suma / recuento;
    console.log(`La media del campo numérico ${valorNumerico} para ${pais} es: ${media}`);
  });
