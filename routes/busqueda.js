var express = require('express');
var app = express();

var Hospital = require('../models/hospital');
var Usuario = require('../models/usuario');
var Medico = require('../models/medico');

//BUSQUEDA EN TODAS LAS COLLECCIONES
app.get('/todo/:busqueda', (req, res) => {
    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');
    // MEDICO
    var medicoPromesa = Medico.find()
        .or([{ 'nombre': regex }, { 'email': regex }])
        .populate('usuario', 'nombre email');
    // HOSPITAL
    var HospitalPromesa = Hospital.find()
        .or([{ 'nombre': regex }, { 'email': regex }])
        .populate('usuario', 'nombre email')

    //USUARIO
    var UsuarioPromesa = Usuario.find({}, 'nombre email role')
        .or([{ 'nombre': regex }, { 'email': regex }]);

    // RESOLVE PROMOSISES
    Promise.all([medicoPromesa, HospitalPromesa, UsuarioPromesa]).then(result => {
        var medicos = result[0];
        var hospitales = result[1];
        var usuarios = result[2];
        res.status(200).json({
            ok: true,
            medicos,
            hospitales,
            usuarios
        })
    }).catch(err => {
        res.status(200).json({
            ok: false,
            errors: err
        })

    })

});
//BUSQUEDA POR COLLECION
app.get('/coleccion/:tabla/:busqueda', (req, res) => {
    var {
        tabla,
        busqueda
    } = req.params;
    var regex = new RegExp(busqueda, 'i');
    var promesa;
    switch (tabla) {
        case 'usuarios':
            promesa = Usuario.find({}, 'nombre email role')
                .or([{ 'nombre': regex }, { 'email': regex }]);
            break;
        case 'medicos':
            promesa = Medico.find()
                .or([{ 'nombre': regex }, { 'email': regex }])
                .populate('usuario', 'nombre email');
            break;
        case 'hospitales':
            promesa = Hospital.find()
                .or([{ 'nombre': regex }, { 'email': regex }])
                .populate('usuario', 'nombre email');
            break;
        default:
            res.status(400).json({
                ok: false,
                message: 'informacion no valida'
            });
            break;

    }

    promesa.then(doc => {
        res.status(200).json({
            ok: true,
            [tabla]: doc
        });

    })


})


module.exports = app;