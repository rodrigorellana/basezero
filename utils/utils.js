const pad = require('pad-left');
const uuidV4 = require('uuid/v4');
var _ = require('lodash');

exports.getRandomComplex = function()
{
    var randomObjs = [{
        "name": "UTI",
        "description": ""
    }, {
        "name": "UCI",
        "description": ""
    }, {
        "name": "NEO",
        "description": ""
    }, {
        "name": "ADU",
        "description": ""
    }, {
        "name": "MUJ",
        "description": ""
    }, {
        "name": "MAT",
        "description": ""
    }, {
        "name": "POL",
        "description": ""
    }];

    return _.sample(randomObjs);
};

exports.findMessage = function (array, findObject, success) {
    var ok = (success ? 'ok' : 'error');
    let arrayResult = _.filter(array, x => Object.keys(x)[0] === findObject.context);
    let outMsg = '';
    var arrMsg = {};
    if (arrayResult.length > 0) {
        arrayResult.forEach(function (result) {
            if (findObject.filter == null)
                arrMsg = result[findObject.context];
            else
                arrMsg = _.filter(result[findObject.context], x => x.id === findObject.filter);

            if (arrMsg.length && arrMsg.length > 0) {
                outMsg = arrMsg[0][ok];
                return false;
            }
            else if (arrMsg[ok]) {
                outMsg = arrMsg[ok];
                return false;
            }
        });
    }
    return outMsg;
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

