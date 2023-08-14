const {response, request} = require('express');
const jwt = require('jsonwebtoken');
const {User} = require('../../models');

const validarToken = async(req = request, res = response, next)=>{
    const token = req.header('x-token');

    if(!token){
        return res.status(401).json({
            msg: 'Introduce el token en la petición'
        });
    }
    try{
        const {uid} = jwt.verify(token, process.env.SECRETPRIVATEKEY);
       
        const usuario = await User.findByPk(uid);
        // Usuario existente
        if(!usuario){
            return res.status(401).json({
                msg: 'Token invalido'
            }); 
        }
        // USUARIO ACTIVO
        if(!usuario.estado_user){
            return res.status(401).json({
                msg: 'Token invalido'
            });
        }
        // aunque el token sea valido, verificamos si el usuario existe y si esta activo
        // de lo contrario no pasas la peticion
        req.user = usuario;
        next();
    }catch(err){
        console.log(err);
        return res.status(401).json({
            msg: 'Token invalido'
        });
    }
}

module.exports = validarToken;