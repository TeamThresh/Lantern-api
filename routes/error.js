/**
 * Created by YS on 2017-02-10.
 */
var errorCode = require('./errorCode');

module.exports = function (err, res, mode) {
    console.log(err);
    var error;
    console.log(err.status);
    err.status == undefined ? error = errorCode[500] : error = errorCode[err.status];
    console.log(errorCode[500]);
    console.log(error);
    if (mode === 'development') {
        // development error handler
        res.status(error.status).json(error.msg);

    } else if (mode === 'production') {
        // production error handler
        res.status(error.status).json(error.msg);
    }
};
