'use strict'

var validator = require('validator');
var fs = require('fs');
var path = require('path');

var Article = require('../models/article');
const { param } = require('../routes/article');
const article = require('../models/article');

var controller = {

    datosCurso: (req, res) => {
        //console.log("hola mundo");
        var hola = req.body.hola;
        return res.status(200).send({
            curso: 'Master en Frameworks JS',
            autor: 'Mijhail Tovar',
            url: 'victorrobles.web',
            hola
        });
    },

    test: (req, res) => {
        return res.status(200).send({
            message: 'Soy la accion test de mi controlador de articulos'
        });
    },

    save: (req, res) => {
        //recoger los parametros por post
            var params = req.body;

        //validar datos - validator
        try{
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);

        }catch(err){
            return res.status(200).send({
                status: 'error',
                message: 'Faltan datos por enviar !!'
            });
        }

        if (validate_content && validate_title) {
            //crear el objeto a guardar
            var article = new Article();

            // asignar valores
            article.title = params.title;
            article.content = params.content;

            if (params.image) {
                article.image = params.image;
            }else{
                article.image = null;
            }
            
            // Guardar el articulo
            article.save((err, articleStored) => {
                if (err || !articleStored) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'El articulo no se a guardado !!!'
                    });
                }

                //devolver una respuesta
                return res.status(200).send({
                    status: 'success',
                    article: articleStored
                }); 

            });
                   
        }else{
            return res.status(200).send({
                status: 'error',
                message: 'Los datos no son validos !!'
            });
        }

    },

    getArticles: (req, res) => {

        var query = Article.find({});

        var last = req.params.last;
        if (last || last != undefined) {
            query.limit(5);
        }

        //Find
        query.sort('-_id').exec((err, articles) => {

            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'error al devolver los articulos'
                });
            }

            if (!articles) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay articulos para mostrar'
                });
            }

            return res.status(200).send({
                status: 'success',
                articles
            });

        });
        
    },

    getArticle: (req, res) =>{

        //recoger el id de la url
        var articleId = req.params.id;

        //comprobar que existe
        if (!articleId || articleId == null) {
            return res.status(404).send({
                status: 'error',
                message: 'No existe el articulo'
            });
        }
        //buscar el articulo 
        Article.findById(articleId, (err, article) => {

            if (err || !article) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe el articulo'
                });
            }

            //devolver el articulo en json
            //devolver el articulo en json
        // ----> ¡AQUÍ ESTÁ EL CAMBIO! <---- deebes verificar si esto te genera 
        // problemas en el futuro
            return res.status(200).send({
                status: 'success',
                article
            });
        });

        
    },

    update: (req, res) =>{
        //recoger el id del articulo por la url
        var articleId = req.params.id;

        // recoger los datos que llegan por put
        var params = req.body;

        // validar los datos
        try {
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
        } catch (err) {
            return res.status(200).send({
                status: 'error',
                message: 'faltan datos por enviar'
            });
        }

        //hacer find and update
        if (validate_content && validate_title) {
            // find and update
            Article.findOneAndUpdate({_id: articleId}, params, {new:true}, (err, articleUpdated) => {
                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'error al actualizar !!'
                    });
                }

                if (!articleUpdated) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'no existe el articulo !!'
                    });
                }

                //eevolver respuesta
                return res.status(200).send({
                    status: 'success',
                    article: articleUpdated
                });
            });
        }else{
            
        }

    },

    delete: (req, res) => {

        // recoger el id de la url
        var articleId = req.params.id;

        //find and delete
        Article.findOneAndDelete({_id: articleId}, (err, articleRemoved) => {
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al borrar !!'
                });
            }

            if (!articleRemoved) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No se ha borrado el articulo, puede que no existe (no llega article removed) !!'
                });
            }

            return res.status(200).send({
                status: 'success',
                article: articleRemoved
            });
        });

    },

    upload: (req, res) => {
        //configurar el modulo del connect multiparty router/article.js (hecho)

        // recoger el fichero de la peticion
        var file_name = 'Imagen no subida...';

        if (!req.files) {
            return res.status(404).send({
                status: 'error',
                message: file_name
             });
        }

        //conseguir el nombre y la extension del archivo solo en windows
        //var file_path = req.files.file0.path;
        //var file_split = file_path.split('\\');

        /**ADVERTENCIA EN LINUX O MAC */
        //var file_split = file_path.split('/');

        // NOMBRE DEL ARCHIVO
        //var file_name = file_split[2];

        //CODIGO QUE FUNCIONA EN PRODUCCION
        // CÓDIGO CLAVE PARA LA RUTA: Usar '/' para Linux (Railway)
        var file_path = req.files.file0.path;
        var file_split = file_path.split('/'); // <-- CAMBIO A BARRA INCLINADA '/'
        
        // NOMBRE DEL ARCHIVO: Ya que estamos usando la barra de Linux, 
        // el nombre del archivo siempre será el ÚLTIMO elemento del array.
        var file_name = file_split[file_split.length - 1]; // <-- MEJOR MANERA DE OBTENER EL NOMBRE

        //extension del fichero
        var extension_split = file_name.split('\.');
        var file_ext = extension_split[1];

        // comprobar la extension, solo imagenes, si no es valida borrar el fichero
        if (file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif') {
            // borrar el archivo subido
            fs.unlink(file_path, (err) => {
                return res.status(200).send({
                    status: 'error',
                    message: 'la extension de la imagen no es valida !!!'
                 });
            });
        }else{
            // si todo es valido, sacando id de la url
            var articleId = req.params.id;

            if (articleId) {
                // buscar el articulo, asignarle el nombre de la imagen y actualizarlo
                Article.findOneAndUpdate({_id: articleId}, {image: file_name}, {new:true}, (err, articleUpdated) => {
                    
                    if (err || !articleUpdated) {
                        return res.status(200).send({
                            status: 'error',
                            message: 'error al guardar la imagen de articulo'
                        });
                    }
                    
                    return res.status(200).send({
                        status: 'success',
                        article: articleUpdated
                    });
                });
            }else{
                return res.status(200).send({
                    status: 'success',
                    image: file_name
                });
            }
            
            
        }
    },// end upload file

    getImage: (req, res) => {

        var file = req.params.image;
        //var path_file = './upload/articles/' + file;

        // CORRECCIÓN DE RUTA: Usa path.join para compatibilidad y la ruta correcta
        // __dirname es el directorio actual; '..' sube al directorio principal.
        var path_file = path.join(__dirname, '..', 'uploads', 'articles', file); // <-- RUTA CORREGIDA

        fs.exists(path_file, (exists) => {

            //console.log(exists);
            if (exists) {
                return res.sendFile(path.resolve(path_file));
            }else{
                return res.status(404).send({
                    status: 'error',
                    message: 'la imagen no existe !!!'
                });
            }
        });

        
    },

    search: (req, res) => {

        //sacar el string a buscar
        var searchString = req.params.search;

        // find or
        Article.find({ "$or": [
            { "title": { "$regex": searchString, "$options": "i"}},
            { "content": { "$regex": searchString, "$options": "i"}}
        ]})
        .sort([['date', 'descending']])
        .exec((err, articles) => {

            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error en la peticion !!'
                });
            }

            if (!articles || articles.length <= 0) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay articulos que coincidan con tu busqueda !!'
                });
            }
            
            return res.status(200).send({
                status: 'success',
                articles
            });
        });
        
    }

}; // end controller

module.exports = controller;