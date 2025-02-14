// models/usuario.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database/db');  

const Usuario = sequelize.define('Usuario', {
  id_usuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name_usuario: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pass_usuario: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'usuarios',  
  timestamps: false,      
});

module.exports = Usuario;
