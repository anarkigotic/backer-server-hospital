var express = require('express');
var bcrypt = require('bcryptjs');
var app = express();
var Usuario = require('../models/usuario');
var middelwares = require('../middelwares/auth');



app.get('/',middelwares.verificaToken, (req, res) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);
    Usuario.find({}, 'nombre email img role')
    .skip(desde)
    .limit(3)
    .then(usuarios => {
            Usuario.count({}).then(count=>{
                res.status(200).json({
                   ok: true,
                   usuarios,
                   total:count
                   //usuarioToken : req.usuario 
               })
            })
    }).catch(err => {
        return res.status(500).json({
            ok: false,
            message: 'Error cargando usuarios',
            errors: err
        })
    })
})

// CREAR USUARIOS
app.post('/', middelwares.verificaToken,(req, res) => {
    var body = req.body;
    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    })
    usuario.save().then(usuario => {
        res.status(201).json({
            ok: true,
            message: 'se creo un usuario correctamente',
            usuario
        })

    }).catch(err => {
        return res.status(400).json({
            ok: false,
            message: 'Error cargando usuarios',
            errors: err
        })

    })

});

// ACTUALIZAR USUARIO
app.put('/:id', middelwares.verificaToken,(req, res) => {
    var id = req.params.id;
    var body = req.body;
    Usuario.findById(id).then(usuario => {
        if (!usuario) {
            res.status(400).json({
                ok: true,
                message: `El usuario con el id ${id} no existe`,
                errors: 'no existe usuario con ese id'
            })
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;
        usuario.save().then(usr => {
            usr.password = ':(';
            res.status(200).json({
                ok: true,
                usuario
            })

        }).catch(err => {
            res.status(400).json({
                ok: false,
                message: 'mensaje al actualizar',
                errors: err
            })
        })

    }).catch(err => {
        return res.status(500).json({
            ok: false,
            message: 'Error cargando usuarios',
            errors: err
        })

    })


})

//  BORAR USUARIO
app.delete('/:id', (req, res) => {
    var id = req.params.id;
    Usuario.findByIdAndRemove(id).then(usr => {
        if (!usr) {
            res.status(400).json({
                ok: true,
                message: `El usuario con el id ${id} no existe`,
                errors: 'no existe usuario con ese id'
            })
        }
        res.status(200).json({
            ok: true,
            usuario: usr,
            message: 'usuario borrado exitosamente'
        })

    }).catch(err => {

        return res.status(500).json({
            ok: false,
            message: 'Error borreando usuario',
            errors: err
        })

    })

});



module.exports = app