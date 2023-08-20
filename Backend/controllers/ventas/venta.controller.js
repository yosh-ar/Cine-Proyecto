const {response, request } = require('express');
const {DetalleSala, Venta, DetalleVenta, User,DetalleReserva} = require('../../models');
const Sequelize = require('sequelize');
const {getPagination, getPagingData} = require('../../resources/pagination');
const {customFormatterHora,customFormatter} = require('../../resources/dates');
const sequelize = require('../../db/config');
const Op = Sequelize.Op;
const moment = require('moment');

const storeVenta  =  async(req = request, res = response)=>{
    const t = await sequelize.transaction();
    try{
        const { ...resto } = req.body;

        const registro = await Venta.findOne({
            limit : 1,
            order: [
                ['createdAt', 'DESC']
            ],
        })
        const r = (registro == null) ? 1 : parseInt(registro.no_venta) +1;


        const venta = new Venta({transaction: t});
        venta.no_venta = r;
        venta.fecha_venta = customFormatter(new Date());
        venta.hora = customFormatterHora(new Date());
        venta.userId= resto.userId;
        venta.detalleSalaId= resto.detalleSalaId;
        venta.total_boletos= resto.total_boletos;
        venta.total_venta = resto.total;
        await venta.save();

        for await(det of resto.data){
            const Detalle = new DetalleVenta({ transaction: t});
            Detalle.ventaId = venta.id;
            Detalle.fila = det.fila;
            Detalle.no_asiento = det.no_asiento;
            await Detalle.save();

            const reserva = new DetalleReserva({ transaction: t});
            reserva.ventaId = venta.id;
            reserva.detalleSalaId = venta.detalleSalaId;
            reserva.fila = det.fila;
            reserva.no_asiento = det.no_asiento;
            await reserva.save();
        }

        await t.commit();

        res.status(200).json({
            msg: 'success'
        })
    }catch (error) {
        await t.rollback();
        console.log(error);
        return res.status(500).send(error);
    }
}

const getReservaMovie = async(req = request, res = response)=>{
    const {id} = req.query;
    try {
        const reservas = await DetalleReserva.findAll({
            where: {detalleSalaId : id},
            
        })
        res.status(200).json({
            msg: 'Ok',
            reservas
        })
    }catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

module.exports = {
    getReservaMovie,
    storeVenta
}
