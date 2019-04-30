var express = require('express');
var mongoose = require('mongoose');
var app = express();
var bodyParser = require('body-parser');
var fileUpload = require('express-fileupload');
var serverIndex = require('serve-index');
var cors = require('cors');

// app.use(express.static(__dirname+'/'));
// app.use('/uploads',serverIndex(__dirname+'/uploads'));

app.use(cors({ origin: true, credentials: true }))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

var appRoutes = require('./routes/app');
var usersRoutes = require('./routes/usuario');
var userLogin = require('./routes/login');
var userHospitals = require('./routes/hospital');
var userMedicos = require('./routes/medico');
var userBusqueda = require('./routes/busqueda');
var useUpload = require('./routes/upload');
var useImg = require('./routes/imagenes');

app.use('/usuario', usersRoutes);
app.use('/login', userLogin);
app.use('/hospitales', userHospitals);
app.use('/medicos', userMedicos);
app.use('/busqueda', userBusqueda);
app.use('/upload', useUpload);
app.use('/img',   useImg);



mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', { useNewUrlParser: true, useCreateIndex: true }, (err, res) => {
    if (err) throw err;
    console.log("base de datos: \x1b[32m%s\x1b[0m", "online");

})

app.listen(3000, () => {
    console.log("servidor: \x1b[32m%s\x1b[0m", "online");
})

