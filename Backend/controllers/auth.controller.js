const {response, request } = require('express');
const bcrypt = require('bcryptjs');
const {User} = require('../models');
const jwt = require('jsonwebtoken');
const { generarJWT } = require('../helpers/generar-JWT');

const login = async(req, res = response)=>{
    const {password, user} = req.body;
    
     try {
        const u = await User.findOne({where : {
            usuario : user,
            estado_user : true
        }});
        if(!u ){
            return res.status(401).json({
                msg: 'usuario y/o contraseña invalidos'
            })
        }
        const validarPass = bcrypt.compareSync(password, u.password);
        if(!validarPass){
            return res.status(401).json({
                msg: 'usuario y/o contraseña invalidos'
            })
        }
        const token = await generarJWT(u.id);
        return res.json({
            usuario : u,
            token,
            success : 'ok'
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: `Algo salio mal ---- ${error.message}`,
        })
    }
}
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
        res.status(200).json({
            token,
            usuario,
            success : 'ok'
        });
    }catch(err){
        // console.log(err);
        return res.status(401).json({
            msg: 'Token invalido',
            // error: err.message
        });
    }
}

module.exports = {
    login,
    validarToken
}