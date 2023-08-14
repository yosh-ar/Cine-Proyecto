const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('cine', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    logging : false,    
    pool: {
        max: 20,
        min: 0,
        acquire: 60000,
        idle: 10000
    }

});
module.exports = sequelize;