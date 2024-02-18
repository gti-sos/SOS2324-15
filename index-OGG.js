let paises = ["Japan","Peru","Poland","Brazil","Philippines","China","Trinidad and Tobago","United States","Costa Rica","China"];
let mathScore = [72, 69, 90, 47, 76, 71, 88, 40 ,33 ,64];

function contarElementosConPosiciones(array) {
    const contador = {};
    array.forEach((elemento, indice) => {
      if (!contador[elemento]) {
        contador[elemento] = {
          repeticiones: 0,
          posiciones: []
        };
      }
      contador[elemento].repeticiones++;
      contador[elemento].posiciones.push(indice);
    });
  
    const repetidos = {};
    for (const [elemento, info] of Object.entries(contador)) {
      if (info.repeticiones > 1) {
        repetidos[elemento] = info.posiciones;
      }
    }
  
    return repetidos;
}

let recuento = contarElementosConPosiciones(paises);

let suma = 0;
let contador = 0;

for (const elemento in recuento) {
  const posiciones = recuento[elemento];
  posiciones.forEach(posicion => {
    if (mathScore[posicion] !== undefined) {
      suma += mathScore[posicion];
      contador++;
    }
  });
}

const media = suma / contador;
console.log("La media de los valores que se repiten son:", media);
