const {response, request } = require('express');
const {User, Rol} = require('../../models');
const Sequelize = require('sequelize');
const {getPagination, getPagingData} = require('../../resources/pagination');
const Op = Sequelize.Op;
const bcrypt = require('bcryptjs');
const sequelize = require('../../db/config');


const indexUser = async(req = request, res = response)=>{
    const {page = 1, limite =10, search = '', criterio = 'usuario'} = req.query;

    let usuarios
    let response;
    const opt1 ={
        limit: parseInt(limite) || 10,
        page: parseInt(page) || 0,
    }
    const {limit, offset}  = getPagination(opt1.page, opt1.limit);
    if(search == ''){
        try{
            usuarios = await User.findAndCountAll({
                offset: offset,
                limit: limit,
                order: [
                    ['createdAt', 'DESC']
                ],
                include : [
                
                    {model : Rol},
                ]
            });
            response = getPagingData(usuarios, page, limit);
         
        }catch(err){
        
            return res.status(400).json({
                msg: 'Algo salio mal',
                err
            });
        }
    }else{
        try{
            usuarios = await User.findAndCountAll({  
                offset: offset,
                limit: limit,
                where:{ [criterio]: { [Op.like]: `%${search}%`}},
                include : [
                    {model : Rol},

                ]
            });
            response = getPagingData(usuarios, page, limit);
            
        }catch(err){
            console.log(err);
            return res.status(400).json({
                msg: 'Algo salio mal',
                err
            });
        }
    }
    res.send(response);
}
const postUser = async( req = request , res = response ) => {
    const { estado, fecha, ...resto } = req.body;
    const data = {
        usuario : resto.usuario,
        password : resto.password,
        roleId  : resto.rol,
     
    }
    try {
        const user = new User(data);
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(resto.password, salt);
        await user.save();

        res.json({
            msg:'ok'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Ocurrio un error, hable con el administrador backend'
        })    
    }
}
const updateUser = async( req = request , res = response ) => {
    const { estado, fecha, ...resto } = req.body;

    const data = {
        usuario : resto.usuario,
        password : resto.password,
        roleId  : resto.rol,
        id : resto.id,
     
    }
    try {
        let password ='';
        if(data.password){
            const salt = bcrypt.genSaltSync();
            password = bcrypt.hashSync(data.password, salt);
        }
        // console.log(data);
        const user = await User.update({
            usuario : data.usuario,
            password : password,
            roleId : data.roleId,
        }, {where : {id : data.id}});


        res.json({
            msg : 'Actualización realizada con éxito'
        } );

    } catch (error) {

        console.log(error);
        res.status(500).json({
            msg: 'Ocurrio un error, hable con el administrador backend'
        })    
    }
}
const desactivarUser = async(req = resquest, res = response)=>{
    const {...resto } = req.body;
    const data = {
        id : resto.id
    }
    try {
        const user = await User.update({
            estado_user: 0,
        }, {where : {id : data.id}});
        // console.log(user, data.id)
        res.json({
            msg : 'Actualización realizada con éxito'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Ocurrio un error, hable con el administrador backend'
        })    
    }
}
const activarUser = async(req = resquest, res = response)=>{
    const {...resto } = req.body;
    const data = {
        id : resto.id
    }
    try {
        const user = await User.update({
            estado_user: 1,
        }, {where : {id : data.id}});
        res.json({
            msg : 'Actualización realizada con éxito'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Ocurrio un error, hable con el administrador backend'
        })    
    }
}
const selectRol = async(req, res) => {
    try {
        const roles = await Rol.findAll({where:{estado : true}});
        res.status(200).json({
            msg : 'ok',
            data : roles
        })
    } catch (error) {
        return res.status(400).json({ msg : 'algo salio mal', error});
    }
}

module.exports = {
    indexUser,
    postUser,
    updateUser,
    desactivarUser,
    activarUser,
    selectRol
}