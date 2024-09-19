const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const {bd, conectarBD } = require('../config/db');
const Infecciones = require('../models/Infecciones');

const router = express.Router();

const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('archivoCSV'), async (req, res) => {
    try {
        await conectarBD();
        if (!req.file) {
            return res.status(400).send('No se subió ningún archivo');
        }
        const rutaArchivo = req.file.path;

        fs.createReadStream(rutaArchivo)
            .pipe(csv())
            .on('data', async (fila) => {
                try {
                    console.log(fila)
                    const {
                        departamento,
                        departamento_nombre,
                        provincia_id,
                        provincia_nombre,
                        año,
                        semanas_epidemiologicas,
                        evento_nombre,
                        grupo_edad_id,
                        grupo_edad_desc,
                        cantidad_casos
                    } = fila;
                    await Infecciones.create({
                        departamento,
                        departamento_nombre,
                        provincia_id,
                        provincia_nombre,
                        año,
                        semanas_epidemiologicas,
                        evento_nombre,
                        grupo_edad_id,
                        grupo_edad_desc,
                        cantidad_casos
                    });
                } catch (error) {
                    console.log(error);
                }
            })
            .on('end', () => {
                console.log('Archivo CSV procesado correctamente.');
                res.send('Archivo procesado y datos guardados en la base de datos');
            });

    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error al procesar el archivo');
    }
});

router.get('/', async (req, res) => {
    try {
        const infecciones = await Infecciones.findAll();
        res.json(infecciones);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener infecciones');
    }
});

router.get('/departamento/:departamento_id', async (req, res) => {
    const { departamento_id } = req.params;
    try {
        const infecciones = await Infecciones.findAll({
            where: { departamento_id }
        });
        res.json(infecciones);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener infecciones por departamento');
    }
});

router.get('/provincia/:provincia_id', async (req, res) => {
    const { provincia_id } = req.params;
    try {
        const infecciones = await Infecciones.findAll({
            where: { provincia_id }
        });
        res.json(infecciones);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener infecciones por provincia');
    }
});

router.get('/ano/:año', async (req, res) => {
    const { año } = req.params;
    try {
        const infecciones = await Infecciones.findAll({
            where: { año }
        });
        res.json(infecciones);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener infecciones por año');
    }
});

module.exports = router;