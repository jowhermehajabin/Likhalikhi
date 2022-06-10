const Sequelize = require('sequelize');
const sequelize = new Sequelize('newsblog', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
});

module.exports = sequelize;