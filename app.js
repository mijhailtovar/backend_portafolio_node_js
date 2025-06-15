'use strict'

//cargar modulos de node para cargar el servidor
var express = require('express');
var bodyParser = require('body-parser');

// Ejecutar express (http)
var app = express();

// Cargar ficheros rutas
var article_routes = require('./routes/article');

// Middlewares
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// CORS 
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


// añadir prefijos o rutas / cargar rutas
app.use('/api', article_routes);

/*
app.post('/datos-curso', (req, res) => {
    //console.log("hola mundo");
    var hola = req.body.hola;
    return res.status(200).send({
        curso: 'Master en Frameworks JS',
        autor: 'Mijhail Tovar',
        url: 'victorrobles.web',
        hola
    });
});
*/

// exportar modulo (fichero actual)
module.exports = app;

