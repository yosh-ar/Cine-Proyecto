const moment = require('moment');
function ordenarHoras(arr) {
    const manana = "06:00"; // Hora de inicio de la mañana
    const noche = "23:59"; // Hora de finalización de la noche
  
    arr.sort((obj1, obj2) => {
      const hora1 = obj1.hora;
      const hora2 = obj2.hora;
  
      if (hora1 >= manana && hora1 <= noche && hora2 >= manana && hora2 <= noche) {
        return hora1.localeCompare(hora2);
      } else if (hora1 < manana && hora2 >= manana && hora2 <= noche) {
        return 1;
      } else if (hora1 >= manana && hora1 <= noche && hora2 > noche) {
        return -1;
      } else {
        return hora1.localeCompare(hora2);
      }
    });
  
    return arr;
}


function calcularHoras(hora, operacion) {
  // console.log(hora, operacion);
  const [horas, minutos, segundos] = hora.split(':');

  let horasNumericas = parseInt(horas);
  const minutosNumericos = parseInt(minutos);
  const segundosNumericos = parseInt(segundos);

  horasNumericas += operacion;

  while (horasNumericas < 0) {
    horasNumericas += 24;
  }

  horasNumericas %= 24;

  const horasFormateadas = horasNumericas < 10 ? '0' + horasNumericas : horasNumericas;
  const minutosFormateados = minutosNumericos < 10 ? '0' + minutosNumericos : minutosNumericos;
  const segundosFormateados = segundosNumericos < 10 ? '0' + segundosNumericos : segundosNumericos;

  return `${horasFormateadas}:${minutosFormateados}:${segundosFormateados}`;


}
function validarHoraEnIntervalo(arr, hora) {
  //true significa que si puede programar la pelicula
  const horaEntrada = hora + ':00';
    if(arr.length==1){
      const cuatroHorasDReserva =calcularHoras(arr[arr.length-1].hora, 4);
      const cuatroHorasAreserva = calcularHoras(arr[arr.length-1].hora, -4);

      if(horaEntrada <=cuatroHorasAreserva){
        // console.log(`La hora ${horaEntrada} encaja antes de ${cuatroHorasAreserva}.`);
        return true; 
      }else{
        if(cuatroHorasDReserva == '00:00:00'){
          return false
        }else if(horaEntrada >=cuatroHorasDReserva){
          // console.log(`La hora ${horaEntrada} encaja despues de ${cuatroHorasDReserva}.`);
         return true;
        }
      }
    }else{
      for (let i = 0; i < arr.length - 1; i++) {
        const horaActual = arr[i].hora;
        const horaSiguiente = arr[i + 1].hora;
        const horaActualMasCuatro = calcularHoras(horaActual,4);
        const horaActualMenosCuatro = calcularHoras(horaActual, -4);
        const horaSiguienteCuatroAntes = calcularHoras(horaSiguiente, -4)
          if(i==0 && horaEntrada <= horaActualMenosCuatro){
            // console.log(`La hora ${horaEntrada} encaja antes de ${horaActualMenosCuatro}.`);
            return true;
          }
          else if (horaEntrada >= horaActualMasCuatro && horaEntrada <=horaSiguienteCuatroAntes) {
            // console.log(`La hora ${horaEntrada} encaja antes de ${horaSiguienteCuatroAntes}. y despues de ${horaActualMasCuatro}`);
            return true;
          }else if(i == arr.length - 1 && horaEntrada >=horaActualMasCuatro){
            // console.log(`La hora ${horaEntrada} encaja despues de ${horaActualMasCuatro}.`);
            return true;
          }
      }
    }
   
  
    return null;
}


module.exports= {
    ordenarHoras,
    // sumarCuatroHoras,
    validarHoraEnIntervalo
}