const {User, Rol} = require('../../models');
const rolIdExist = async(id)=>{
    const rol = await Rol.findByPk(id);
    if(!rol){
        throw new Error(`El id de rol no existe en nuestros registros`);
    }
}
const userIdExist = async(id)=>{
    const user = await User.findByPk(id);

    if(!user){
        throw new Error(`El id de la User no existe en nuestros registros`);
    }
}
module.exports = {rolIdExist,
    userIdExist}