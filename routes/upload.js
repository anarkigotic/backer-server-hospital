var express = require('express');
var app = express();
var fs = require('fs');
var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');


app.put('/:tipo/:id', (req, res) => {
    var {
        tipo,
        id
    } = req.params;

    var tiposValidos = ['hospitales', 'medicos', 'usuarios'];
    if (!tiposValidos.includes(tipo)) {
        return res.status(400).json({
            ok: false,
            mensaje: 'tipo de coleccion no es valida'
        });
    }
    if (!req.files) {
        return res.status(500).json({
            ok: false,
            message: 'no selecciono ningun archivo',
            errors: { message: 'debe seleciona una imagen' }
        });
    }
    var archivo = req.files.imagen;
    var extencion = archivo.name.split('.').pop();
    var extencionesValidas = ['jpeg', 'jpg', 'png', 'gif'];

    if (!extencionesValidas.includes(extencion)) {
        return res.status(500).json({
            ok: false,
            message: 'extencion de archivo es invalido',
            errors: { message: 'Las extenciones validad son ' + extencionesValidas.join(', ') + "." }
        });
    }
    var nombreArchvo = `${id}-${new Date().getMilliseconds()}.${extencion}`;
    var path = `./uploads/${tipo}/${nombreArchvo}`;
    archivo.mv(path).then(() => {
        subirPortipo(tipo, id, nombreArchvo, res);

    }).catch(err => {
        return res.status(500).json({
            ok: true,
            errors: err
        })
    });

})

function subirPortipo(tipo, id, nombreArchvo, res) {
    if (tipo === 'usuarios') {
        Usuario.findById(id).then(usuario => {

            if (!usuario) {
                fs.unlink('./uploads/usuarios/' +nombreArchvo);
                return res.status(400).json({
                    ok: false,
                    errors: [{ error: 'no existe el usuario con ese id' }]
                })
            }
            var pathViejo = './uploads/usuarios/' + usuario.img;
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }
            usuario.img = nombreArchvo;
            usuario.save().then(usr => {
                usr.password = ':(';
                return res.status(200).json({
                    ok: true,
                    mensaje: `imagen de uaurio : ${nombreArchvo} actualizado`,
                    usuario: usr
                });

            }).catch(err => {
                return res.status(500).json({
                    ok: false,
                    errors: err
                })

            });
        })
    }
    if (tipo === 'medicos') {
        Medico.findById(id).then(medico => {
            if (!medico) {
                fs.unlink('./uploads/medicos/' +nombreArchvo);
                return res.status(400).json({
                    ok: false,
                    errors: [{ error: 'no existe el medico con ese id' }]
                })
            }
            var pathViejo = './uploads/medicos/' + medico.img;
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }
            medico.img = nombreArchvo;
            medico.save().then(med => {
                return res.status(200).json({
                    ok: true,
                    mensaje: `imagen de uaurio : ${nombreArchvo} actualizado`,
                    medico: med
                });

            }).catch(err => {
                return res.status(500).json({
                    ok: true,
                    errors: err
                })

            });
        })

    }
    if (tipo === 'hospitales') {
        Hospital.findById(id).then(hospital => {
            if (!hospital) {
                fs.unlink('./uploads/hospitales/' +nombreArchvo);
                return res.status(400).json({
                    ok: false,
                    errors: [{ error: 'no existe un hospital con ese id' }]
                })
            }
            var pathViejo = './uploads/hospitales/' + hospital.img;
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }
            hospital.img = nombreArchvo;
            hospital.save().then(hos => {
                return res.status(200).json({
                    ok: true,
                    mensaje: `imagen de hospital : ${nombreArchvo} actualizado`,
                    hospital: hos
                });

            }).catch(err => {
                return res.status(500).json({
                    ok: true,
                    errors: err
                })

            });
        })

    }

}


module.exports = app;