const {Programacion, DetalleSala, Sala} = require('../../models');


const programacionIdExist = async(id)=>{
    const value = await Programacion.findByPk(id);
    if(!value){
        throw new Error(`El id de programacion no existe en nuestros registros`);
    }
}

const DetalleSalaIdExist = async(id)=>{
    const value = await DetalleSala.findByPk(id);
    // console.log(id, value)
    if(!value){
        throw new Error(`El id  no existe en nuestros registros`);
    }
}

const salaIdExist = async(id)=>{
    const value = await Sala.findByPk(id);
    if(!value){
        throw new Error(`El id de sala no existe en nuestros registros`);
    }
}

module.exports= {
    programacionIdExist,
    salaIdExist,DetalleSalaIdExist
}