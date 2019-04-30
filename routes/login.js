var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var app = express();
var Usuario = require('../models/usuario');
var Config = require('../config/config');



//===================================
// Autenticacion google
//===================================
const { OAuth2Client } = require('google-auth-library');
var config = require('../config/config');
const client = new OAuth2Client(config.CLIENT_ID);

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: config.CLIENT_ID,

    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

app.post('/google', async (req, res) => {
    var token = req.body.token;
    var googleUser = await verify(token).catch(e => {
        return res.status(403).json({
            ok: false,
            message: 'token no valido',
        });
    });

    Usuario.findOne({ email: googleUser.email }).then(usrdb => {
        if (usrdb) {
            if (usrdb.google === false) {
                return res.status(400).json({
                    ok: true,
                    message: 'Debe utilizar su autenticacion normal',
                })

            } else {
                var token = jwt.sign({ usuario: usrdb }, Config.SEDD, { expiresIn: 14400 });
                return res.status(200).json({
                    ok: true,
                    message: usrdb,
                    token,
                    id: usrdb._id
                });
            }
        } else {
            //El usuario no existe
            var usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';
            usuario.save().then(usr => {
                var token = jwt.sign({ usuario: usr }, Config.SEDD, { expiresIn: 14400 });
                return res.status(200).json({
                    ok: true,
                    message: usr,
                    token,
                    id: usr._id
                });

            }).catch(err => {
                return res.status(500).json({
                    ok: true,
                    message: 'Error al buscar usuarios',
                    errors: err
                })

            });
        }
    }).catch(err => {
        return res.status(500).json({
            ok: true,
            message: 'Error al buscar usuarios',
            errors: err
        })

    });

    // return res.status(200).json({
    //     ok: true,
    //     message: googleUser,

    // });



});
//===================================
// Autenticacion normal
//===================================
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