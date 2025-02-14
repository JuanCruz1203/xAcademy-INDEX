const { Sequelize } = require("sequelize");

const sequelizeDB = new Sequelize('fifaplayers', "root", "", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
});

sequelizeDB.authenticate()
  .then(() => {
    console.log("Conexión a la base de datos exitosa");
  })
  .catch((error) => {
    console.error("No se pudo conectar a la base de datos:", error);
  });

module.exports = sequelizeDB;