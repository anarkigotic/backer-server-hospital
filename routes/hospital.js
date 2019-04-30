var Hospital = require('../models/hospital');
var express = require('express');
var moddelware = require('../middelwares/auth');
var app = express();

// LISTAR HOSPITALES
app.get('/', (req, res) => {
    var desde = req.query.desde;
    desde = Number(desde);
    Hospital.find({}, { __v: 0 })
        .populate('usuario', { nombre: 1, email: 1 })
        .skip(desde)
        .limit(3)
        .then(hospitales => {
            Hospital.count({}).then(hospitalcount => {
                res.status(200).json({
                    ok: true,
                    hospitales,
                    total:hospitalcount
                })
            })
        }).catch(err => {
            res.status(500).json({
                ok: false,
                message: 'error al cargar hospitales',
                errors: err
            })
        });
});
// CREAR HOSPITAL
app.post('/', moddelware.verificaToken, (req, res) => {
    var body = req.body;
    var hospital = new Hospital({
        nombre: body.nombre,
        usuario: body.usuario
    });
    hospital.save().then(hospital => {
        res.status(200).json({
            ok: true,
            hospital
        })
    }).catch(err => {
        res.status(500).json({
            ok: false,
            message: 'error al actualizar el hospital',
            errors: err
        })
    })
})
// ACTUALIZAR HOSPITAL
app.put('/:id', moddelware.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;
    Hospital.findByIdAndUpdate(id, body, { new: true }).then(hospital => {
        if (!hospital) {
            return res.status(400).json({
                ok: false,
                message: 'no se encontro un hospital con ese id'
            })
        }
        return res.status(200).json({
            ok: true,
            hospital
        })
    }).catch(err => {
        return res.status(500).json({
            ok: false,
            message: 'error al actualizar el hospital',
            errors: err
        })
    })
})
// ELIMINAR HOSPITAL
app.delete('/:id', moddelware.verificaToken, (req, res) => {
    var id = req.params.id;
    Hospital.findByIdAndDelete(id).then(hospital => {
        if (!hospital) {
            return res.status(400).json({
                ok: false,
                message: 'no existe un hospital con ese id para borrar',
                hospital
            })
        }
        return res.status(200).json({
            ok: true,
            message: 'hospital borrado correctamente',
            hospital
        })

    }).catch(err => {

        return res.status(500).json({
            ok: false,
            message: 'error al borrar  hospital',
            errors: err
        })
    })
});


module.exports = app;