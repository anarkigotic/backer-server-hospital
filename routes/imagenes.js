var express = require('express');
const path = require('path');
const fs = require('fs');
var app = express();

app.get('/:tipo/:img', (req, res) => {
    var tipo = req.params.tipo;
    var img = req.params.img;

    var pathImage = path.resolve(__dirname, `../uploads/${tipo}/${img}`);
    if (fs.existsSync(pathImage)) {
        res.sendFile(pathImage);
    } else {
        var pathNoImage = path.resolve(__dirname, '../assets/no-img.jpg');
        res.sendFile(pathNoImage);
    }


    // res.status(200).json({
    //     ok: true,
    //     mesagge: 'peticion realizada correctamente'
    // });
});

module.exports = app;