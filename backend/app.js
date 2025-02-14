const express = require("express");
const session = require('express-session');
const app = express();
const cors = require('cors');
const PORT = 8080;
const router = require('./router');
const sequelizeDB = require('./database/db');
const Player = require('./models/players');
const Usuario = require('./models/usuarios');

app.use(cors());

sequelizeDB.sync()
  .then(() => {
    console.log("Modelos sincronizados correctamente.");

    app.listen(PORT, () => {
      console.log("SERVIDOR OK");
    });
  })
  
  .catch((error) => {
    console.error("Error al sincronizar los modelos:", error);
  });


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: 'tu_clave_secreta_aqui', 
  resave: false,
  saveUninitialized: true
}));


app.use("/api", router);

// handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Ocurrió un error en el servidor" });
});


