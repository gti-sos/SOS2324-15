const datos = [
  { gender: 'female', race_ethnicity: 'group B', parental_level_of_education: "bachelor's degree", lunch: 'standard', test_preparation_course: 'none', math_score: 72, reading_score: 72, writing_score: 74, country: 'japan', date: '05/05/2023' },
  { gender: 'female', race_ethnicity: 'group C', parental_level_of_education: 'some college', lunch: 'standard', test_preparation_course: 'completed', math_score: 69, reading_score: 90, writing_score: 88, country: 'peru', date: '03/08/2023' },
  { gender: 'female', race_ethnicity: 'group B', parental_level_of_education: "master's degree", lunch: 'standard', test_preparation_course: 'none', math_score: 90, reading_score: 95, writing_score: 93, country: 'poland', date: '6/26/2023' },
  { gender: 'male', race_ethnicity: 'group A', parental_level_of_education: "associate's degree", lunch: 'free/reduced', test_preparation_course: 'none', math_score: 47, reading_score: 57, writing_score: 44, country: 'brazil', date: '01/10/2024' },
  { gender: 'male', race_ethnicity: 'group C', parental_level_of_education: 'some college', lunch: 'standard', test_preparation_course: 'none', math_score: 76, reading_score: 78, writing_score: 75, country: 'philippines', date: '1/16/2024' },
  { gender: 'female', race_ethnicity: 'group B', parental_level_of_education: "associate's degree", lunch: 'standard', test_preparation_course: 'none', math_score: 71, reading_score: 83, writing_score: 78, country: 'china', date: '11/14/2023' },
  { gender: 'female', race_ethnicity: 'group B', parental_level_of_education: 'some college', lunch: 'standard', test_preparation_course: 'completed', math_score: 88, reading_score: 95, writing_score: 92, country: 'trinidad and Tobago', date: '09/02/2023' },
  { gender: 'male', race_ethnicity: 'group B', parental_level_of_education: 'some college', lunch: 'free/reduced', test_preparation_course: 'none', math_score: 40, reading_score: 43, writing_score: 39, country: 'united States', date: '6/18/2023' },
  { gender: 'male', race_ethnicity: 'group D', parental_level_of_education: 'high school', lunch: 'free/reduced', test_preparation_course: 'completed', math_score: 64, reading_score: 64, writing_score: 67, country: 'costa Rica', date: '02/05/2024' },
  { gender: 'female', race_ethnicity: 'group B', parental_level_of_education: 'high school', lunch: 'free/reduced', test_preparation_course: 'none', math_score: 38, reading_score: 60, writing_score: 50, country: 'china', date: '5/17/2023' }
];

export default datos;


//   // Valor a buscar en el campo de información geográfica
//   const valorGeografico = 'China'; 

   // Valor a buscar en el campo de información numérica
  const valorNumerico = 'math_score'

//   // Filtra las filas que comparten el valor en el campo geográfico
//   const filasFiltradas = datos.filter((fila) => fila.country === valorGeografico);

//   // Extrae el campo numérico de interés (reemplaza 'physical_activity_level' con el nombre real del campo)
//   const valoresNumericos = filasFiltradas.map((fila) => fila.physical_activity_level);

//   // Calcula la media de los valores numéricos
//   const media = valoresNumericos.reduce((acc, valor) => acc + valor, 0) / valoresNumericos.length;

//   console.log(La media para el campo ${valorNumerico} para ${valorGeografico} es: ${media});


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
    acc.suma = (acc.suma || 0) + fila.math_scoreu;
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