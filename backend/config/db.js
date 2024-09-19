// Importa el módulo Sequelize para manejar la conexión con la base de datos
const {Sequelize} = require ("sequelize");
// Importa el módulo pg para configurar el uso de PostgreSQL con Sequelize
const pg = require ("pg");
// Importa la función config de dotenv para cargar las variables de entorno desde un archivo .env
const {config} = require ("dotenv");
config(); // Ejecuta la función para cargar las variables de entorno

// Crea una instancia de Sequelize, configurando la conexión a la base de datos PostgreSQL
const bd = new Sequelize({
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  host: process.env.POSTGRES_HOST,
  dialectModule: pg,
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

const conectarBD = async () => {
    try {
        await bd.authenticate();
        console.log('Conectado a la base de datos PostgreSQL');
    } catch (error) {
        console.error('No se pudo conectar a la base de datos:', error);
    }
};

module.exports = { bd, conectarBD };
