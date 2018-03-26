const pad = require('pad-left');
const uuidV4 = require('uuid/v4');

exports.validString = function (val) {
    if (!val || val.trim() === '')
        return false;

    return true;
}

exports.padLeft = function (str, quantity, chr) {
    return pad(str, quantity, chr);
}

exports.generateGUID = function () {
    return uuidV4();
}

exports.success = function (msg, bed) {
    return {
        error: 0,
        message: 'La cama fue indetificada correctamente ' + bed.code
    };
}