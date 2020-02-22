const Sequelize = require("sequelize");
const connection= new Sequelize('guiaperguntas','root','starcraft',{
  host:'localhost',
  dialect: 'mysql'
});

module.exports = connection;
