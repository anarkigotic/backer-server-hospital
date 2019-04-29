var express = require('express');
var mongoose = require('mongoose');
var app = express();
var bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({ extended: true }));

var appRoutes = require('./routes/app');
var usersRoutes = require('./routes/usuario');
var userLogin = require('./routes/login');

app.use('/usuario', usersRoutes);
app.use('/login', userLogin);



mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', { useNewUrlParser: true, useCreateIndex: true }, (err, res) => {
    if (err) throw err;
    console.log("base de datos: \x1b[32m%s\x1b[0m", "online");

})

app.listen(3000, () => {
    console.log("servidor: \x1b[32m%s\x1b[0m", "online");
})

