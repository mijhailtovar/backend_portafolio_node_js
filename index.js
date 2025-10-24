// index.js (Sustituye la línea antigua por la nueva)
'use strict'

var mongoose = require('mongoose');
var app = require('./app');
const fs = require('fs');
const path = require('path');

var port = process.env.PORT || 3900; 

// *** CAMBIO CLAVE AQUÍ: Usamos MONGO_URL ***
var url = process.env.MONGO_URL || 'mongodb://localhost:27017/api_rest_blog';

mongoose.set('useFindAndModify', false);
// Adicional: usa la opción useUnifiedTopology: true, recomendada por Mongoose
mongoose.Promise = global.Promise;
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}) 
    .then(() => {
        console.log('Conexión a la base de datos se realizó correctamente');

        // ** RUTA CORREGIDA: uploads/articles **
        const UPLOAD_DIR = path.join(__dirname, 'uploads', 'articles'); 

        // ********** LÓGICA CLAVE **********
        // Crea la carpeta si no existe (vital para Railway)
        if (!fs.existsSync(UPLOAD_DIR)) {
            // { recursive: true } es esencial
            fs.mkdirSync(UPLOAD_DIR, { recursive: true });
            console.log(`Directorio de subida creado en Railway: ${UPLOAD_DIR}`);
        }
        // **********************************

        // Crear servidor y ponerme a escuchar peticiones http
        app.listen(port, () => {
            console.log('Servidor corriendo en el puerto: ' + port);
        });
    })
    .catch(error => {
        console.error('Error al conectar a la base de datos:', error.message);
    });