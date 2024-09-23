// app.js o index.js o el archivo principal de tu aplicación

const express = require('express');
const { bd } = require('./config/db');
const Infecciones = require('./models/Infecciones'); // Asegúrate de importar todos tus modelos

const app = express();

app.use(express.json());

// Sincroniza la base de datos
bd.sync() // Elimina la tabla si existe y la vuelve a crear
    .then(() => {
        console.log('Base de datos sincronizada');
    })
    .catch(err => {
        console.error('Error al sincronizar la base de datos:', err);
    });

// Rutas y middleware
app.use('/infecciones', require('./routes/Infecciones'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
