var jwt = require('jsonwebtoken');
var Config = require('../config/config');

function verificaToken(req, res, next){
    var token = req.query.token;
    jwt.verify(token, Config.SEDD, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                message: 'Token incorrecto ',
                errors: err
            })
        }
        req.usuario = decoded;
        next();

    })
}

module.exports = {
    verificaToken
}