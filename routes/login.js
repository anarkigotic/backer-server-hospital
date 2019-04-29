var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var app = express();
var Usuario = require('../models/usuario');
var Config = require('../config/config');



app.post('/', (req, res) => {
    var body = req.body;

    Usuario.findOne({ email: body.email }).then(usr => {
        if (!usr) {
            res.status(400).json({
                ok: true,
                message: 'credenciales incorrectas -emial',
                errors: usr
            })

        }
        if (!bcrypt.compareSync(body.password, usr.password)) {
            res.status(400).json({
                ok: true,
                message: 'credenciales incorrectas -password',
                errors: null
            });
        } else {
            usr.password = ':)';
            var token = jwt.sign({ usuario: usr }, Config.SEDD, { expiresIn: 14400 });

            res.status(200).json({
                ok: true,
                message: usr,
                token, 
                id: usr._id
            });
        }

    }).catch(err => {
        res.status(500).json({
            ok: true,
            message: 'Error al buscar usuarios',
            errors: err
        })

    });

});

module.exports = app;