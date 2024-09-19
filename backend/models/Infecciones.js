const { DataTypes } = require('sequelize');
const { bd } = require('../config/db');

const Infecciones = bd.define('Infeccionesa6', {
     departamento: {
        type: DataTypes.STRING,
    }, 
    departamento_nombre: {
        type: DataTypes.STRING,
    },
    provincia_id: {
        type: DataTypes.INTEGER,
    },
    provincia_nombre: {
        type: DataTypes.STRING,
    },
    año: {
        type: DataTypes.INTEGER,
    },
    semanas_epidemiologicas: {
        type: DataTypes.INTEGER,
    },
    evento_nombre: {
        type: DataTypes.STRING,
    },
    grupo_edad_id: {
        type: DataTypes.INTEGER,
    },
    grupo_edad_desc: {
        type: DataTypes.STRING,
    },
    cantidad_casos: {
        type: DataTypes.INTEGER,
    }
}, {
    timestamps: false
});

module.exports = Infecciones;
