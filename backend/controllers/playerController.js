const sequelizeDB = require("../database/db");
const player = require("../models/players");
const usuario = require("../models/usuarios");
const { Op } = require('sequelize');
const { validationResult } = require('express-validator');


exports.getPlayers=async(req, res)=>{
    try {

        const limit = parseInt(req.query.limit) || 10; //nro resultados por page
        const page = parseInt(req.query.page) || 1; //nro pagina inicial default es 1

        const offset = (page - 1) * limit; //se calcula el desplazado de pag

        const clubFilter = req.query.club_name || null;  
        const nameFilter = req.query.long_name || null; 
        const gameFilter = req.query.fifa_version || null;  
        const posFilter = req.query.player_positions || null;  

        const where = {};

        if (clubFilter){
            where.club_name =  { [Op.like]: `%${clubFilter}%` };;
        }
        
        if (nameFilter){
            where.long_name = { [Op.like]: `%${nameFilter}%` };
        }

        if (gameFilter){
            where.fifa_version =  gameFilter ;
        }

        if (posFilter){
            where.player_positions = posFilter;
        }
        

        const players = await player.findAll({
            where:where,
            limit:limit,
            offset:offset,
        });

        const totalPlayers = await player.count({where:where}); //total de jugadores
        const totalPages = Math.ceil(totalPlayers / limit);

        res.status(200).json({
            players,       
            totalPlayers,  
            totalPages,     
            currentPage: page,  
            limit,        // Cantidad de resultados por pag
            clubFilter,
            nameFilter,
            gameFilter,
            posFilter,
        });

    } catch (error) {
        console.log(error);
        res.status(500).send('INTERNAL SERVER ERROR');        
    }
}

exports.getPlayer = async (req, res) => {
    try {
      const playerID = req.params.id;
      const playerData = await player.findByPk(playerID);
  
      if (!playerData) {
        return res.status(404).send("JUGADOR NO ENCONTRADO");  // asegurarse de usar 'return' aquí para evitar más respuestas
      }
  
      res.status(200).json({
        id: playerData.id,
        fifa_version: playerData.fifa_version,
        fifa_update: playerData.fifa_update,
        player_face_url: playerData.player_face_url,
        nombre: playerData.long_name,
        player_positions: playerData.player_positions,
        club_name: playerData.club_name,
        nationality_name: playerData.nationality_name,
        overall: playerData.overall,
        potential: playerData.potential,
        value_eur: playerData.value_eur,
        wage_eur: playerData.wage_eur,
        age: playerData.age,
        height_cm: playerData.height_cm,
        weight_kg: playerData.weight_kg,
        preferred_foot: playerData.preferred_foot,
        weak_foot: playerData.weak_foot,
        skill_moves: playerData.skill_moves,
        international_reputation: playerData.international_reputation,
        work_rate: playerData.work_rate,
        body_type: playerData.body_type,
  
        // Atributos físicos y habilidades
        pace: playerData.pace,
        shooting: playerData.shooting,
        passing: playerData.passing,
        dribbling: playerData.dribbling,
        defending: playerData.defending,
        physic: playerData.physic,
  
        // Habilidades específicas de ataque
        attacking_crossing: playerData.attacking_crossing,
        attacking_finishing: playerData.attacking_finishing,
        attacking_heading_accuracy: playerData.attacking_heading_accuracy,
        attacking_short_passing: playerData.attacking_short_passing,
        attacking_volleys: playerData.attacking_volleys,
  
        // Habilidades técnicas
        skill_dribbling: playerData.skill_dribbling,
        skill_curve: playerData.skill_curve,
        skill_fk_accuracy: playerData.skill_fk_accuracy,
        skill_long_passing: playerData.skill_long_passing,
        skill_ball_control: playerData.skill_ball_control,
  
        // Atributos de movimiento
        movement_acceleration: playerData.movement_acceleration,
        movement_sprint_speed: playerData.movement_sprint_speed,
        movement_agility: playerData.movement_agility,
        movement_reactions: playerData.movement_reactions,
        movement_balance: playerData.movement_balance,
  
        // Atributos de poder
        power_shot_power: playerData.power_shot_power,
        power_jumping: playerData.power_jumping,
        power_stamina: playerData.power_stamina,
        power_strength: playerData.power_strength,
        power_long_shots: playerData.power_long_shots,
  
        // Atributos mentales
        mentality_aggression: playerData.mentality_aggression,
        mentality_interceptions: playerData.mentality_interceptions,
        mentality_positioning: playerData.mentality_positioning,
        mentality_vision: playerData.mentality_vision,
        mentality_penalties: playerData.mentality_penalties,
        mentality_composure: playerData.mentality_composure,
  
        // Atributos defensivos
        defending_marking: playerData.defending_marking,
        defending_standing_tackle: playerData.defending_standing_tackle,
        defending_sliding_tackle: playerData.defending_sliding_tackle,
  
        // Atributos de portero (si aplica)
        goalkeeping_diving: playerData.goalkeeping_diving,
        goalkeeping_handling: playerData.goalkeeping_handling,
        goalkeeping_kicking: playerData.goalkeeping_kicking,
        goalkeeping_positioning: playerData.goalkeeping_positioning,
        goalkeeping_reflexes: playerData.goalkeeping_reflexes,
        goalkeeping_speed: playerData.goalkeeping_speed,
  
        // Rasgos del jugador (traits)
        player_traits: playerData.player_traits,
      });
  
    } catch (error) {
      res.status(500).send("ERROR INTERNO");
    }
  };
  
exports.editPlayer=async(req,res)=>{
    try {
        const playerID = req.params.id;
        const playerData=await player.findByPk(playerID);
        const updatedPlayer=await playerData.update(req.body);


        res.status(200).json(updatedPlayer);

    } catch (error) {
        res.status(500).send("ERROR INTERNO");

    }
}

exports.createPlayer=async(req,res)=>{
    try {
        const playerData=await player.create(req.body);
        
        res.status(200).json(playerData);

    } catch (error) {
        res.status(500).send("ERROR INTERNO");
        console.log(error);
    }
}

exports.login = async (req, res) => {
    const { name_usuario, pass_usuario } = req.body;

    try {
        
        const errors = validationResult(req);
        const user = await usuario.findOne({ where: { name_usuario } });
        
        
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // comparo la contraseña ingresada con la almacenada
        if (pass_usuario !== user.pass_usuario) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }


        return res.status(200).json({
            message: 'Login exitoso',
        });

    } catch (error) {
        console.error('Error en login:', error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};

