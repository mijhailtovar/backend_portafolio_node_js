// index.js (Sustituye la línea antigua por la nueva)
'use strict'

var mongoose = require('mongoose');
var app = require('./app');

var port = process.env.PORT || 3900; 

// *** CAMBIO CLAVE AQUÍ: Usamos MONGO_URL ***
var url = process.env.MONGO_URL || 'mongodb://localhost:27017/api_rest_blog';

mongoose.set('useFindAndModify', false);
// Adicional: usa la opción useUnifiedTopology: true, recomendada por Mongoose
mongoose.Promise = global.Promise;
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}) 
    .then(() => {
        console.log('Conexión a la base de datos se realizó correctamente');

        // Crear servidor y ponerme a escuchar peticiones http
        app.listen(port, () => {
            console.log('Servidor corriendo en el puerto: ' + port);
        });
    })
    .catch(error => {
        console.error('Error al conectar a la base de datos:', error.message);
    });