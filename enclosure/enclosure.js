var Enum = require('enum');
var colors = require('colors');
var enclosureData = require('./enclosure.json');
var bed = require('./../bed/bed.json');
var galeno = require('./../galeno/galeno');
var _ = require('lodash');
var utils = require('./../utils/utils');

colors.setTheme({
    silly: 'rainbow',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'grey',
    info: 'green',
    data: 'grey',
    help: 'cyan',
    warn: 'yellow',
    debug: 'blue',
    error: 'red'
});

class Enclosure {

    getMessages(context) {
        var bedStatus = _.filter(this.galeno.getMessages(), x => Object.keys(x)[0] === context)[0];
        var array = bedStatus[context];
        return array; this.main.messages.bedStatus;

        // var localBedStatus = _.filter(this.main.messages, x =>  Object.keys(x)[0] === context)[0];
        // array = localBedStatus[context];
    }

    constructor() {
        //get all this from cache
        this.main = enclosureData; //PULG enc get from datastore with and ID
        if (!this.main.areas)
            this.main.areas = [];

        if (!this.main.context)
            this.main.context = [];

        this.galeno = new galeno.Galeno;
        this.flagsTypes = new Enum(this.galeno.getFlags());
        this.galenoBedStatus = this.galeno.getBedStatus();
        this.main.complex = this.main.complex.concat(this.galeno.getComplex());

        // var gal = this.galeno.getMessages();
        // this.main.messages.concat(this.getMessages('bedStatus'));

        this.config = {};
        this.config.ocupedStatus = _.filter(this.galenoBedStatus, x => x.name === "Ocupada")[0];
        this.config.releaseStatus = _.filter(this.galenoBedStatus, x => x.name === "Liberada")[0];
    }

    getBedStatus(status, fromMain) {
        var foundStatus = _.filter(this.galenoBedStatus, x => x.name === status);

        if (fromMain && (!foundStatus || foundStatus.length === 0))
            return null;
        else if (!foundStatus || foundStatus.length === 0) {
            foundStatus = _.filter(this.main.bedStatus, x => x.name === status);
            if (!foundStatus || foundStatus.length === 0)
                return null;
            else return foundStatus[0];
        }
        else return foundStatus[0];
    }

    getAllBeds() {
        return this.beds;
        //PULG bed get from datastore
    }

    createBeds(bedType, quantity) {
        console.log('create %d beds of %s type in %s enclosure', quantity, bedType, this.main.name);
        for (let i = 1; i <= quantity; i++) {
            let newBed = Object.assign({}, bed);
            newBed.mainStatus = this.getBedStatus(bedType, true);
            newBed.localStatus = this.getBedStatus(bedType, false);
            newBed.internalId = utils.generateGUID();
            newBed.enclosureId = this.main.internalId;
            this.getAllBeds().push(newBed);
        }
    }

    getUniverse() {
        var allBeds = this.getAllBeds();
        var result = [];

        this.galenoBedStatus.forEach(function (galenoStatus) {
            let bedOfType = _.filter(allBeds,
                x => x.mainStatus != null
                    && x.mainStatus.name === galenoStatus.name);

            result.push({ "Status": galenoStatus.name, "Quantity": bedOfType.length });
        });

        this.main.bedStatus.forEach(function (localStatus) {
            let bedOfType = _.filter(allBeds,
                x => x.localStatus != null
                    && x.localStatus.name === localStatus.name);

            result.push({ "Status": localStatus.name, "Quantity": bedOfType.length });
        });

        console.log(colors.warn("-= Universe =-"));
        return result;
    }

    createUniverse(universe) {
        var main = this;
        main.beds = [];
        Object.keys(universe).forEach(function (type) {
            var quantity = universe[type];
            main.createBeds(type, quantity);
        });
        console.log(colors.green("Universe: %d beds created"), main.beds.length);
    }

    changeStatusBed(bed, status) {

        console.log(colors.debug("Change state %s to %s on bed id %s"),
            (bed.mainStatus ? bed.mainStatus.name : 'null'),
            status.name,
            bed.internalId);
        bed.mainStatus = status;
        bed.localStatus = status;
    }

    getOccupedBeds() {
        var allBeds = this.getAllBeds();

        var setBeds = _.filter(allBeds,
            x => x.code === null
                && x.mainStatus != null
                && x.mainStatus.name === this.config.ocupedStatus.name
                && x.mainStatus.blocked == false);
        return setBeds;
    }

    getReleasedBeds() {
        var allBeds = this.getAllBeds();

        var setBeds = _.filter(allBeds,
            x => x.code === null
                && x.mainStatus != null
                && x.mainStatus.name === this.config.releaseStatus.name
                && x.mainStatus.blocked == false);
        return setBeds;
    }

    getBed(internalId) {
        var bed = _.filter(this.getAllBeds(),
            x => x.internalId === internalId);

        return bed[0];
    }

    releaseBed(bed) {
        var main = this;
        var filterBed = null;

        if (!bed) {
            var busyBeds = main.getOccupedBeds();
            filterBed = _.sample(busyBeds);
        }
        else if (utils.validString(bed.code))
            filterBed = _.filter(this.getAllBeds(), x => x.code == bed.code)[0];
        else if (utils.validString(bed.internalId))
            filterBed = this.getBed(bed.internalId);

        if (filterBed) {
            main.changeStatusBed(filterBed, this.config.releaseStatus);
            return utils.success(1, filterBed);
        }

        return null;
    }

    takeBed(bed) {
        var main = this;
        var filterBed = null;

        if (!bed) {
            var releasedBeds = main.getReleasedBeds();
            filterBed = _.sample(releasedBeds);
        }
        else if (utils.validString(bed.code))
            filterBed = _.filter(this.getAllBeds(), x => x.code == bed.code)[0];
        else if (utils.validString(bed.internalId))
            filterBed = this.getBed(bed.internalId);

        if (filterBed) {
            main.changeStatusBed(filterBed, this.config.ocupedStatus);
            return filterBed;
            //PULG save bed to datastore
        }
        return null;
    }

    getFlag(flag) {
        if (!this.flags) {
            this.setFlag(flag, true);
            return false;
        }

        return this.flags[this.flagsTypes.get(flag).key];
    }

    setFlag(flag, value) {
        if (!this.flags)
            this.flags = [];

        this.flags[this.flagsTypes.get(flag).key] = value;
    }

    getCodeRandomString() {
        var flag = true;
        var main = this;
        do {
            flag = main.getFlag(1);
        } while (flag === true)

        var allBeds = this.getAllBeds();
        var res = [];
        var cnt = 1;
        var code = null;
        do {
            let s3 = this.main.id.substring(0, 3);
            var abr = utils.padLeft(cnt, this.main.bedLenghtCode, '0')
            code = s3 + '-' + abr;
            res = _.filter(allBeds, x => x.code === code);
            cnt++;
        } while (res.length > 0)

        main.setFlag(1, false);
        return code;
    }

    identifyBed(bed, identificationType) {
        var enumTypes = new Enum(this.galeno.getIdentifycationType());
        var currentBed = this.getBed(bed.internalId);

        if (utils.validString(currentBed.code)) {
            return {
                error: 0,
                message: 'La cama ya tiene codigo'
            };
        }

        if (identificationType == enumTypes.AutomaticQR) {

        }
        else if (identificationType == enumTypes.AutomaticBars) {

        }
        else if (identificationType == enumTypes.AutomaticString) {
            bed.code = this.getCodeRandomString();
        }
        else if (identificationType == enumTypes.ManualString) {

        }

        bed.identificationType = enumTypes.get(identificationType);
        currentBed = bed;
        return {
            error: 0,
            message: 'La cama fue indetificada correctamente ' + bed.code
        };
    }

    createAreas(areas) {
        var exists = [];
        var cnt = 0;
        areas.forEach(function (area) {
            var hasSame = _.filter(this.main.areas, x => x.name === area.name);
            if (hasSame.length > 0)
                exists.push(area)
            else {
                this.main.areas.push(area);
                cnt++;
            }
        }, this);

        var msg = `Areas ingresadas (${cnt})`;
        if (exists.length > 0)
            msg += `, areas existentes (${exists.length})`;

        return { error: 0, message: msg, object: exists }
    }

    createComplex(complexs) {
        var exists = [];
        var cnt = 0;
        complexs.forEach(function (complex) {
            var hasSame = _.filter(this.main.complex, x => x.name === complex.name);
            if (hasSame.length > 0)
                exists.push(complex)
            else {
                this.main.complex.push(complex);
                cnt++;
            }
        }, this);

        var msg = `Complejidades ingresadas (${cnt})`;
        if (exists.length > 0)
            msg += `, complejidades existentes (${exists.length})`;

        return { error: 0, message: msg, object: exists }
    }
}


exports.Enclosure = Enclosure;