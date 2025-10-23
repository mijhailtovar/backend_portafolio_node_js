'use strict'

var mongoose = require('mongoose');
var app = require('./app');

// ** 1. Usar la variable de entorno PORT, o 3900 por defecto **
var port = process.env.PORT || 3900; 

// ** 2. Usar la variable de entorno MONGODB_URI, o la local por defecto **
var url = process.env.MONGODB_URI || 'mongodb://localhost:27017/api_rest_blog';

mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;

// Conectar usando la variable 'url'
mongoose.connect(url, {useNewUrlParser: true}) 
    .then(() => {
        console.log('Conexión a la base de datos se realizó correctamente');

        // Crear servidor y ponerme a escuchar peticiones http
        app.listen(port, () => {
            console.log('Servidor corriendo en el puerto: ' + port);
        });
    })
    .catch(error => console.log(error)); // Añadir manejo de errores por si falla la conexión