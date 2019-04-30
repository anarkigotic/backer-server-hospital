var express = require('express');
var Medico = require('../models/medico');
var middelware = require('../middelwares/auth');
var app = express();

// LISTAR MEDICO
app.get('/', (req, res) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);
    Medico.find({},{__v:0})
    .populate({path:'usuario',select:{nombre:1,email:1}})
    .populate({path:'hospital',select:{nombre:1}})
    .skip(desde)
    .limit(3)
    .then(doc => {
        Medico.count({}).then(medicocount=>{
            res.status(200).json({
                ok: true,
                message: doc,
                total:medicocount
            })
        })
    }).catch(err => {
        res.status(500).json({
            ok: true,
            errors: err
        })

    });

})
// CREAR MEDICO
app.post('/', middelware.verificaToken, (req, res) => {
    var body = req.body;
    var medico = new Medico(body);
    medico.save().then(medico => {
        res.status(200).json({
            ok: true,
            message: medico
        })
    }).catch(err => {
        res.status(500).json({
            ok: false,
            errors: err
        })
    })

})
// ACTUALIZAR MEDICO
app.put('/:id', middelware.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;
    Medico.findByIdAndUpdate(id, body).then(medicoNew => {
        if (!medicoNew) {
            res.status(400).json({
                ok: false,
                message: 'no existe el medico con ese id'
            })
        } else {
            res.status(200).json({
                ok: true,
                message: medicoNew
            })
        }
    }).catch(err => {
        res.status(500).json({
            ok: false,
            message: 'error al actualizar medico',
            errors: err
        })
    });

})
// BORRAR MEDICO
app.delete('/:id', middelware.verificaToken, (req, res) => {
    var id = req.params.id;
    Medico.findByIdAndDelete(id).then(medico => {
        if (!medico) {
            return res.status(400).json({
                ok: true,
                message: 'no existe un medico con ese id',
                message: medico
            })
        }
        return res.status(200).json({
            ok: true,
            message: medico
        })
    }).catch(err => {
        res.status(500).json({
            ok: false,
            message: 'error al borrar medico',
            errors: err
        })
    })
})


module.exports = app;