const express = require('express');
const router = express.Router();
const conexion = require('./database/db.js');  
const { body } = require('express-validator');
const playerController = require('./controllers/playerController.js');

router.get('/players', playerController.getPlayers);
router.get('/players/:id', playerController.getPlayer);
router.post('/players/create', playerController.createPlayer);
router.put('/players/edit/:id', playerController.editPlayer);

router.post('/login',[

    body('name_usuario')
    .notEmpty().withMessage('El nombre de usuario es obligatorio')
    .isLength({ min: 5 }).withMessage('El nombre de usuario debe tener al menos 5 caracteres'),

    body('pass_usuario')
    .notEmpty().withMessage('El nombre de usuario es obligatorio')
    .isLength({ min: 5 }).withMessage('La contraseña debe tener al menos 5 caracteres'),


], playerController.login);

module.exports=router;