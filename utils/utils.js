const pad = require('pad-left');
const uuidV4 = require('uuid/v4');
const randomData = require('./randomData.json');
const NodeCache = require('node-cache');
const myCache = new NodeCache({ stdTTL: 0, checkperiod: 0, useClones: true, deleteOnExpire: false });
var _ = require('lodash');
const randomWord = require('random-word');
var randomName = require('node-random-name');

function wait(ms) {
    var start = new Date().getTime();
    var end = start;
    while (end < start + ms) {
        end = new Date().getTime();
    }
}

exports.getRandomWord = function () {
    return randomWord();
};

exports.getRandomUserName = function () {
    wait(1); 

    return randomName({ gender: _.sample(['male', 'female']) });
};

exports.getRandomArtifacts = function (quantity) {
    var successGetcache = myCache.get("getRandomArtifacts");
    if (successGetcache == undefined) {
        _.map(randomData.artifacts, function (ra) { return ra.id = exports.generateGUID() });
        myCache.set("getRandomArtifacts", randomData.artifacts, 10000);
        successGetcache = randomData.artifacts;
    }

    var q = quantity || _.random(2, successGetcache.length);
    return _.sampleSize(successGetcache, q);
};

exports.getRandomComplex = function (quantity) {
    var successGetcache = myCache.get("getRandomComplex");
    if (successGetcache == undefined) {
        _.map(randomData.complex, function (rc) { return rc.id = exports.generateGUID() });
        myCache.set("getRandomComplex", randomData.complex, 10000);
        successGetcache = randomData.complex;
    }

    var q = quantity || _.random(2, successGetcache.length);
    return _.sampleSize(successGetcache, q);
};

exports.getRandomNetworks = function (quantity) {
    var successGetcache = myCache.get("getRandomNetworks");
    if (successGetcache == undefined) {
        _.map(randomData.networks, function (rc) { return rc.id = exports.generateGUID() });
        myCache.set("getRandomNetworks", randomData.networks, 10000);
        successGetcache = randomData.networks;
    }

    var q = quantity || _.random(2, successGetcache.length);
    return _.sampleSize(successGetcache, q);
};

exports.getPropertyValuesFromArray = function (arrayObject, propertyName) {
    var properties = [];
    if (!arrayObject || arrayObject.length == 0)
        return properties;

    _(arrayObject).forEach(function (tmpObject) {
        if (tmpObject && tmpObject[propertyName])
            properties.push(tmpObject[propertyName]);
    });
    return properties;
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

