//console.log("Hola Mundo");



let country = ["Portugal","China"," Denmark","France","France","United States","France","Poland","China","France",
"China","Denmark","Philippines","France","Iran","Canada","Denmark","Armenia","China"];

let hours = [17, 14, 1, 22, 5, 9, 23, 21, 18, 10, 11, 22, 13, 4, 11, 3, 1, 1, 7, 9, 7];


// Creamos un objeto para contar la frecuencia de aparición de cada país
const countCountries = {};
country.forEach((pais) => {
  countCountries[pais] = (countCountries[pais] || 0) + 1;
});

// Filtramos los países que aparecen más de una vez
const paisesRepetidos = Object.keys(countCountries).filter((pais) => countCountries[pais] > 1);

// Inicializamos un objeto para almacenar las sumas y contar la cantidad de horas para cada país repetido
const sumasHoras = {};
const counts = {};
paisesRepetidos.forEach((pais) => {
  sumasHoras[pais] = 0;
  counts[pais] = 0;
});

// Sumamos las horas para cada país repetido
for (let i = 0; i < country.length; i++) {
  const pais = country[i];
  if (paisesRepetidos.includes(pais)) {
    sumasHoras[pais] += hours[i];
    counts[pais]++;
  }
}

// Calculamos las medias para cada país repetido
const medias = {};
paisesRepetidos.forEach((pais) => {
  medias[pais] = sumasHoras[pais] / counts[pais];
});

console.log("Media de horas por país que aparece más de una vez:");
console.log(medias);



    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    




























