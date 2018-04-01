var galenoData = require('./config.json');
var _ = require('lodash');
var utils = require('./../utils/utils');

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

    findBed(bed, options) {
        var networks = [];
        if (bed.enclosureId)
            networks = this.getEnclosuresByInternalId(bed.enclosureId).networks;

        var foundBeds = [];
        var config = { firstEnclosure: false, log: false };
        if (options) {
            Object.keys(options).forEach(function (type) {
                config[type] = options[type];
            });
        }

        var main = this;
        _(networks).forEach(function (network) {
            _(main.getEnclosuresByNetwork(network)).forEach(function (enclosure) {
                let beds = enclosure.findBed.call(enclosure, bed, config);
                if (beds.length > 0)
                    foundBeds.push({ enclosure: enclosure.main.name, beds });
            });
        });

        return foundBeds;
    }
}


exports.Galeno = Galeno;