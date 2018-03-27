const pad = require('pad-left');
const uuidV4 = require('uuid/v4');
var _ = require('lodash');

exports.findMessage = function (array, context, filter) {
    let arrayResult = _.filter(array, x => Object.keys(x)[0] === context);
    let arrMsg = [];
    if (arrayResult.length > 0) {
        arrayResult.forEach(function (result) {
            if (filter == null)
                arrMsg = result[context];
            else
                arrMsg = _.filter(result[context], x => x.id === filter);
        });
    }

    return arrMsg;
};

exports.validString = function (val) {
    if (!val || val.trim() === '')
        return false;

    return true;
};

exports.padLeft = function (str, quantity, chr) {
    return pad(str, quantity, chr);
};

exports.generateGUID = function () {
    return uuidV4();
};

exports.success = function (msg, bed) {
    return {
        error: 0,
        message: 'La cama fue indetificada correctamente ' + bed.code
    };
};

exports.getDefaultConfiguration = function () {
    return {
        releaseStatus: 'Liberada',
        takenStatus: 'Ocupada',
        bedStatus: 'bedStatus'
    };
};

