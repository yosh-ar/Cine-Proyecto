const {response, request } = require('express');
const {DetalleSala, Programacion, User, Sala} = require('../../models');
const Sequelize = require('sequelize');
const {getPagination, getPagingData} = require('../../resources/pagination');
const {customFormatterHora,customFormatter} = require('../../resources/dates');
const sequelize = require('../../db/config');
const Op = Sequelize.Op;
const moment = require('moment');

const indexProgramacion = async(req = request, res = response)=>{
    const {page = 1, limite =10, search = '', criterio = 'usuario', fecha_inicio ='', fecha_fin =''} = req.query;
    // console.log('entro');
    let programacion
    let response;
    const opt1 ={
        limit: parseInt(limite) || 10,
        page: parseInt(page) || 0,
    }
    const {limit, offset}  = getPagination(opt1.page, opt1.limit);
    if(search == '' && fecha_inicio == '' && fecha_fin == '' ){
        try{
            programacion = await Programacion.findAndCountAll({
                offset: offset,
                limit: limit,
                order: [
                    ['createdAt', 'DESC']
                ],
                include : [
                    {model : User},
                ]
            });
            response = getPagingData(programacion, page, limit);
        }catch(err){
            console.log(err)
            return res.status(400).json({
                msg: 'Algo salio mal',
                err
            });
        }
    }else{
        try{
            if(criterio == 'fecha' && fecha_inicio!='' && fecha_fin !=''){
                programacion = await Programacion.findAndCountAll({  
                    where : {
                        fecha:{[Op.between]: [fecha_inicio, fecha_fin]}
                    },      
                    offset: offset,
                    limit: limit,
                    order: [
                        ['createdAt', 'DESC']
                    ],
                    include : [
                        {model : User},
                    ]
                });
            }
        
            else if(criterio =='usuario' && search !=''){
                programacion = await Programacion.findAndCountAll({  
                    offset: offset,
                    limit: limit,
                    order: [
                        ['createdAt', 'DESC']
                    ],
                    include : [
                        {model : User,     where:{ [criterio]: { [Op.like]: `%${search}%`}},},
                    ]
                });
            }
            else{
                try{
                    programacion = await Programacion.findAndCountAll({
                        offset: offset,
                        limit: limit,
                        order: [
                            ['createdAt', 'DESC']
                        ],
                        include : [
                            {model : User},
                        ]
                    });
                    response = getPagingData(programacion, page, limit);
                }catch(err){
                    console.log(err)
                    return res.status(400).json({
                        msg: 'Algo salio mal',
                        err
                    });
                }
            }
            response = getPagingData(programacion, page, limit);    
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
const storeProgramin = async (req, res) => {
    const t = await sequelize.transaction();
    try{
        const { ...resto } = req.body;

        const programacion = new Programacion({ transaction: t })
        programacion.fecha = customFormatter(new Date());
        programacion.userId = resto.usuario;
        await programacion.save();

        for await(det of resto.data){
            const Detalle = new DetalleSala({ transaction: t});
            Detalle.programacionId = programacion.id;
            Detalle.salaId = det.salaId;
            Detalle.nombre_pelicula = det.nombre;
            Detalle.idmovie = det.idmovie;
            Detalle.fecha = det.fecha;
            Detalle.fecha_hora = det.fecha_hora;
            Detalle.hora = det.hora;
            await Detalle.save();
        }
        await t.commit();

        res.status(200).json({
            msg: 'success'
        })
    }catch (error) {
        await t.rollback();
        console.log(error);
        res.status(500).json({
            msg: 'Ocurrio un error, hable con el administrador backend'
        })    
    }
}
const anularProgramacion = async(req = resquest, res = response)=>{
    const {id} = req.body;
   
    try {
        const t = await sequelize.transaction();

        const programacion = await Programacion.findOne({where: {id : id}},{ transaction: t })
        programacion.estado = false;
        await programacion.save();
        
        const detalles = await DetalleSala.findAll({where: {programacionId : id}});
        for await (det of detalles) {
            await DetalleSala.update({estado : false}, {where: {id : det.id}},{ transaction: t } );
        }

        await t.commit();
        res.json({
            msg : 'Actualización realizada con éxito'
        });

    } catch (error) {
        await t.rollback();
        console.log(error);
        res.status(500).json({
            msg: 'Ocurrio un error, hable con el administrador backend'
        })    
    }
}
const wiewProgramacion = async ( req = request, res = response) => {
    const {id} = req.query;
    try {
        const programacion = await Programacion.findOne({
            where: {id : id},
            include : [
                {model : DetalleSala, include : [{model: Sala}]},
                
                {model : User, attributes :['usuario'],},
            ]
        })
        res.status(200).json({
            msg: 'Ok',
            programacion
        })
    }catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

const indexGetSalas = async (req, res) => {
    try {
        const salas = await Sala.findAll({where:{estado : true}});
        res.status(200).json({
            msg : 'ok',
            data : salas
        })
    } catch (error) {
        return res.status(400).json({ msg : 'algo salio mal', error});
    }
}

const validaProgramacion = async(req, res)=>{
    try {
        const {idSala, fecha_recibe, hora_entra} =  req.query;
    
        const salas = await DetalleSala.findAll(
            {
                where:{
                    fecha: {
                        [Op.gte]: fecha_recibe
                      },
                      salaId : idSala,
                    estado : true
                }
            }
        );
        let newArr = ordenarHoras(salas);
    
        const horaIngresada = moment(hora_entra, 'HH:mm');

        const horasConCuatroHorasSumadas = newArr.map(obj => {
            return { hora: sumarCuatroHoras(obj.hora) };
          });
        
        const intervaloEncajado = validarHoraEnIntervalo(horasConCuatroHorasSumadas, horaIngresada);

        let bandera =  (intervaloEncajado) ? true : false 
       
        res.status(200).json({
            msg : 'ok',
            bandera
        })
    } catch (error) {
        console.log(error);
        return res.status(400).json({ msg : 'algo salio mal', error});
    }
}



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
  
module.exports = {
    storeProgramin,
    indexProgramacion,
    anularProgramacion,
    indexGetSalas,wiewProgramacion,validaProgramacion,
    validaProgramacion
}


