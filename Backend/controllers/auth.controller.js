const {response, request } = require('express');
const bcrypt = require('bcryptjs');
const {User} = require('../models');
const jwt = require('jsonwebtoken');
// const { generarJWT } = require('../helpers/generar-JWT');

const login = async(req, res = response)=>{
    console.log('login')
    // const {password, user} = req.body;
    // // console.log(password, user)
    //  try {
    //     // validar si el usuario existe
    //     const u = await User.findOne({where : {
    //         usuario : user,
    //         estado_user : true
    //     }});
    //     // console.log(usuario);
    //     if(u == null && !u ){
    //         return res.status(401).json({
    //             msg: 'usuario y/o contraseña invalidos'
    //         })
    //     }
    //     const validarPass = bcrypt.compareSync(password, u.password);
    //     if(!validarPass){
    //         return res.status(401).json({
    //             msg: 'usuario y/o contraseña invalidos'
    //         })
    //     }
    //     const token = await generarJWT(u.id);
    //     // console.log(token)
    //     return res.json({
    //         usuario : u,
    //         token,
    //         success : 'ok'
    //     });
        
    // } catch (error) {
    //     console.log(error);
        
    //     return res.status(500).json({
    //         msg: 'Algo salio mal, seguramente fue su culpa exis de',
    //     })
    // }
}
const validarToken = async(req = request, res = response, next)=>{
    // console.log(req)
    const token = req.header('x-token');
    // console.log(token, 'hola');

    if(!token){
        return res.status(401).json({
            msg: 'Introduce el token en la petición'
        });
    }
    try{
        const {uid} = jwt.verify(token, process.env.SECRETPRIVATEKEY);
    //    console.log(uid);
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
        // req.user = usuario;
        // console.log(usuario, token)
        res.status(200).json({
            token,
            usuario,
            success : 'ok'
        });
    }catch(err){
        console.log(err);
        return res.status(401).json({
            msg: 'Token invalido'
        });
    }
}

module.exports = {
    login,
    // validarToken
}