
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

function sumarCuatroHoras(hora) {
    const momentHora = moment(hora, 'HH:mm').add(4, 'hours');
    return momentHora.format('HH:mm');
}
function restartCuatroHoras(hora) {
    const momentHora = moment(hora, 'HH:mm').subtract(4, 'hours');
    return momentHora.format('HH:mm');
}
function validarHoraEnIntervalo(arr, hora) {
    for (let i = 0; i < arr.length - 1; i++) {
      const horaActual = arr[i].hora;
      const horaSiguiente = arr[i + 1].hora;
      const HoraNormal = hora.format('HH:mm');
      const horaActualMasCua = hora.add(4, 'hours').format('HH:mm');
        //--01:00      10          --05:00                                    14:00
        //--9:30       10          --13:30                                    14:00
        // console.log(hora.add(4, 'hours').format('HH:mm'),restartCuatroHoras(horaActual));
      if (HoraNormal >= horaActual && horaActualMasCua <= restartCuatroHoras(horaSiguiente)) {
        // console.log(i);
        console.log(HoraNormal, horaActual, horaActualMasCua, restartCuatroHoras(horaSiguiente))
        // console.log('primer if');
        return {
          intervalo: `${horaActual} - ${horaSiguiente}`,
          horaIngresada: HoraNormal
        };
      }else if(horaActualMasCua<=restartCuatroHoras(horaActual)){
        // console.log('segundo');
        return {
            intervalo: `es valido`,
            horaIngresada: HoraNormal
          };
      }else if(HoraNormal >= horaActual && HoraNormal >= horaSiguiente){
        // // console.log(HoraNormal, horaActual);
        // console.log('tercero');
        return {
            intervalo: `es valido`,
            horaIngresada: HoraNormal
          };
      }
    //   console.log(horaActualMasCua,HoraNormal , horaActual,horaSiguiente)
    }
  
    return null;
}


module.exports= {
    ordenarHoras,
    sumarCuatroHoras,
    validarHoraEnIntervalo
}