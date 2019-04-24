var express = require('express');
var mongoose = require('mongoose');
var app = express();



app.get('/',(req,res,next)=>{
        res.status(200).json({
            ok:true,
            message:"Hola mundo"
        })
})

mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB',(err,res)=>{
    if(err) throw err;
    console.log("base de datos: \x1b[32m%s\x1b[0m","online");

})

app.listen(3000, () => {
    console.log("servidor: \x1b[32m%s\x1b[0m","online");
})

