var galenoData = require('./config.json');
var _ = require('lodash');
var utils = require('./../utils/utils');
var colors = require('colors');

class Galeno {

    constructor() {
        this.main = galenoData;
    }

    getBedStatus() {
        return this.main.bedStatus;
    }
    getMessages() {
        return this.main.messages;
    }
    getIdentifycationType() {
        return this.main.identificationType;
    }
    getFlags() {
        return this.main.flags;
    }
    getComplex() {
        return this.main.complex;
    }
    getEnclosuresByNetwork(network) {
        //give me all enclosures wich networks existis one with name network.name
        let enclosures = _.filter(global.enclosures, x => _.includes(utils.getPropertyValuesFromArray(x.main.networks, 'name'), network.name));
        return enclosures;
    }
    getEnclosuresByInternalId(closureId) {
        //give me all enclosures wich networks existis one with name network.name
        let enclosure = _.filter(global.enclosures, x => x.main.internalId == closureId);
        return enclosure[0].main;
    }

    sendNotification(objMsg, targets, options = { log: true }) {
        if (options.log) {
            console.log(objMsg.msg, objMsg.obj, targets.join(', '));
        }
    }

    findBed(bed, options) {
        var networks = [];
        if (bed.enclosureId)
        {
            networks = this.getEnclosuresByInternalId(bed.enclosureId).networks;
            bed.enclosure = this.getEnclosuresByInternalId(bed.enclosureId);
        }

        let logMsg = 'START for bed {artifacts [%s] - complex [%s]}';
        console.log(colors.warn(logMsg),
            (bed.artifacts ? utils.getPropertyValuesFromArray(bed.artifacts, 'name').join(', ') : ''),
            (bed.complex ? utils.getPropertyValuesFromArray(bed.complex, 'name').join(', ') : ''));

        var foundBeds = []; //TODO: mejorar con es6
        var config = { log: false, findSimilar: false };
        if (options) {
            Object.keys(options).forEach(function (type) {
                config[type] = options[type];
            });
        }

        var main = this;
        var cntBeds = 0;
        _(networks).forEach(function (network) {
            _(main.getEnclosuresByNetwork(network)).forEach(function (enclosure) {
                let beds = enclosure.findBed.call(enclosure, bed, config);
                if (beds.length > 0)
                    foundBeds.push({ enclosure: enclosure.main.name, beds });
                // TODO: pulish output to client
                // foundBeds.push(
                //     {
                //         enclosure: {
                //             name: enclosure.main.name,
                //             internalId: enclosure.main.internalId
                //         },
                //         beds : {

                //         }
                //     });
                cntBeds += beds.length;
            });
        });

        logMsg = 'FINISH for bed {artifacts [%s] - complex [%s]} : in [%d] enclosures with [%d] total beds found';
        console.log(colors.warn(logMsg),
            (bed.artifacts ? utils.getPropertyValuesFromArray(bed.artifacts, 'name').join(', ') : ''),
            (bed.complex ? utils.getPropertyValuesFromArray(bed.complex, 'name').join(', ') : ''),
            foundBeds.length,
            cntBeds);

        //TODO unique
        //ir por cada enclopsure y por cada gestora de cama a avisarle de que tiene X camas
        //que cumplen con la requerida
        return foundBeds;
    }
}


exports.Galeno = Galeno;