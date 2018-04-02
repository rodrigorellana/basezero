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

    getMessage(obj, success, data) {
        var codeError = (success ? 0 : 500);

        if (!obj.filter && !obj.context) {
            return { error: codeError, message: obj, object: data };
        }
        else {
            var filter = {};
            var secondFilter = null;
            if (obj.filter && !obj.filter.first)
                filter = (obj.filter.name ? obj.filter.name : obj.filter);
            else if (obj.filter.first) {
                filter = (obj.filter.first.name ? obj.filter.first.name : obj.filter.first);
                secondFilter = (obj.filter.second.name ? obj.filter.second.name : obj.filter.second);
            }
            var context = ((obj.context && obj.context.name) ? obj.context.name : obj.context);
            var galenoMessages = this.galeno.getMessages();

            this.msg = utils.findMessage(galenoMessages, { context, filter }, success);
            if (!utils.validString(this.msg))
                this.msg = utils.findMessage(this.main.messages, { context, filter }, success);

            if (utils.validString(secondFilter)) {
                let sfilter = utils.findMessage(galenoMessages, { context, filter: secondFilter }, success);
                if (utils.validString(sfilter))
                    this.msg += ': ' + sfilter;
            }

            if (!utils.validString(this.msg))
                this.msg = utils.findMessage(galenoMessages, { context: 'default' }, success);

            return { error: codeError, message: this.msg, object: data };
        }
    }

    constructor(config) {
        //get all this from cache
        if (!config)
            config = utils.getDefaultConfiguration();

        this.main = _.clone(enclosureData); //PULG enc get from datastore with and ID
        //this.main = Object.assign({}, enclosureData); //PULG enc get from datastore with and ID
        if (!this.main.areas)
            this.main.areas = [];

        if (!this.main.context)
            this.main.context = [];

        this.galeno = new galeno.Galeno;
        this.flagsTypes = new Enum(this.galeno.getFlags());
        this.galenoBedStatus = this.galeno.getBedStatus();
        this.main.complex = this.main.complex.concat(this.galeno.getComplex());
        this.main.networks = utils.getRandomNetworks(2);
        this.main.name = utils.getRandomWord();
        this.main.code = this.main.name.substring(0, 3);
        this.main.internalId = utils.generateGUID();

        this.config = config;
        this.config.takenStatus = _.filter(this.galenoBedStatus, x => x.name === config.takenStatus)[0];
        this.config.releaseStatus = _.filter(this.galenoBedStatus, x => x.name === config.releaseStatus)[0];
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

    createBeds(bedType, quantity, options = { log: true }) {
        if (options.log) {
            console.log('create %d beds of %s type in %s enclosure', quantity, bedType, this.main.name);
        }

        for (let i = 1; i <= quantity; i++) {
            let newBed = Object.assign({}, bed);
            newBed.mainStatus = this.getBedStatus(bedType, true);
            newBed.localStatus = this.getBedStatus(bedType, false);
            newBed.internalId = utils.generateGUID();
            newBed.enclosureId = this.main.internalId;
            newBed.complex = utils.getRandomComplex(2);
            newBed.artifacts = utils.getRandomArtifacts();

            if (i % 2 === 0) {
                newBed.artifacts = null;
                // newBed.complex =  _.union(newBed.complex, [utils.getRandomComplex()]);
            }
            this.getAllBeds().push(newBed);
        }
    }

    getUniverse(options = { log: true }) {
        var allBeds = this.getAllBeds();
        var result = [];

        this.galenoBedStatus.forEach(function (galenoStatus) {
            let bedOfType = _.filter(allBeds,
                x => x.mainStatus != null
                    && x.mainStatus.name === galenoStatus.name);

            result.push({ 'Status': galenoStatus.name, 'Quantity': bedOfType.length });
        });

        this.main.bedStatus.forEach(function (localStatus) {
            let bedOfType = _.filter(allBeds,
                x => x.localStatus != null
                    && x.localStatus.name === localStatus.name);

            result.push({ 'Status': localStatus.name, 'Quantity': bedOfType.length });
        });

        if (options.log) {
            console.log(colors.warn('\n -= Listing universe on [%s] enclosure =-'), this.main.name);
        }
        return result;
    }

    createBedsUniverse(universe, options = { log: true }) {
        var main = this;
        main.beds = [];
        Object.keys(universe).forEach(function (type) {
            var quantity = universe[type];
            main.createBeds(type, _.random(2, quantity), options);
        });

        if (options.log) {
            console.log(colors.green("Universe: %d beds created on [%s] enclosure"), this.beds.length, this.main.name);
        }
    }

    createUsersUniverse(users, options = { log: true }) {
        var main = this;
        main.users = [];
        
        Object.keys(users).forEach(function (type) {
            var quantity = users[type];
            var finalQ = _.random(2, quantity);

            for (let index = 1; index <= finalQ; index++) {
                let name = utils.getRandomUserName();

                let user = {
                    internalId: utils.generateGUID(),
                    name,
                    email: name.split(' ')[0].toLowerCase() + _.sampleSize(['@gov.cl', '@gmail.com', '@hotmail.com', '@outlook.com', '@minsal.cl']),
                    role: type
                };

                main.users.push(user);
            }
        });

        if (options.log) {
            console.log(colors.green("Users: %d created on [%s] enclosure"), this.users.length, this.main.name);
        }
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
                && x.mainStatus.name === this.config.takenStatus.name
                && x.mainStatus.blocked == false);
        return setBeds;
    }

    getReleasedBeds(options) {
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

    releaseBed(bedSearch) {
        var success = true;
        var bedFound = null;
        var main = this;
        var filterMsg = this.config.releaseStatus;

        try {
            if (!bedSearch) {
                var busyBeds = main.getOccupedBeds();
                bedFound = _.sample(busyBeds);
            }
            else if (utils.validString(bedSearch.code))
                bedFound = _.filter(this.getAllBeds(), x => x.code == bedSearch.code)[0];
            else if (utils.validString(bedSearch.internalId))
                bedFound = this.getBed(bedSearch.internalId);

            if (bedFound) {
                main.changeStatusBed(bedFound, this.config.releaseStatus);
            } else {
                filterMsg = { first: filterMsg, second: this.config.notFoundStatus };
                bedFound = bedSearch;
                success = false;
            }
        } catch (e) {
            success = false;
            bedFound = e;
        }

        return this.getMessage({ context: this.config.bedStatus, filter: filterMsg }, success, bedFound);
    }

    requestBed(bedRequest) {

    }

    findBed(bedFind, options = { log: true, findSimilar: true }) {

        var eventualBeds = this.getReleasedBeds();
        var complexToFind = utils.getPropertyValuesFromArray(bedFind.complex, 'name');
        var artifactsToFind = utils.getPropertyValuesFromArray(bedFind.artifacts, 'name');
        //     Paso 1. Buscar cama idéntica
        //     Entre todas las camas actuales liberadas del recinto, buscar la del mismo tipo de la requerida
        var foundBeds = [];
        _(eventualBeds).forEach(function (tmpBed) {
            let tmpFound = _.filter(tmpBed.complex, x => _.includes(complexToFind, x.name));
            if (tmpFound.length > 0)
                foundBeds.push(tmpBed);
        });

        if (options.findSimilar) {
            //     Paso 2. Buscar cama similar
            //     Entre todas las camas actuales liberadas del recinto, buscar la que tenga similares características a la solicitada. 
            var withArtifacts = _.filter(eventualBeds, x => x.artifacts !== null && x.artifacts.length > 0);
            _(withArtifacts).forEach(function (artifactBed) {
                var artifacts = utils.getPropertyValuesFromArray(artifactBed.artifacts, 'name');
                var intersection = _.intersectionBy(artifactsToFind, artifacts);
                if (intersection.length > 0)
                    foundBeds.push(artifactBed);
            });
        }

        var finalBeds = _.uniq(foundBeds);
        if (options.log) {
            let logMsg = 'Finding bed {artifacts [%s] - complex [%s] on enclosure [%s]} : [%d] beds found';
            console.log(colors.help(logMsg), artifactsToFind.join(', '), complexToFind.join(','), this.main.name, finalBeds.length);
        }

        return finalBeds;
    }

    takeBed(bedSearch) {
        var main = this;
        var success = true;
        var bedFound = null;
        var filterMsg = this.config.takenStatus;

        try {
            if (!bedSearch) {
                var releasedBeds = main.getReleasedBeds();
                bedFound = _.sample(releasedBeds);
            }
            else if (utils.validString(bedSearch.code))
                bedFound = _.filter(this.getAllBeds(), x => x.code == bedSearch.code)[0];
            else if (utils.validString(bedSearch.internalId))
                bedFound = this.getBed(bedSearch.internalId);

            if (bedFound) {
                main.changeStatusBed(bedFound, this.config.takenStatus);
            } else {
                filterMsg = { first: filterMsg, second: this.config.notFoundStatus };
                bedFound = bedSearch;
                success = false;
            }
        } catch (e) {
            success = false;
            bedFound = e;
        }

        return this.getMessage({ context: this.config.bedStatus, filter: filterMsg }, success, bedFound);
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
        } while (flag === true);

        var allBeds = this.getAllBeds();
        var res = [];
        var cnt = 1;
        var code = null;
        do {
            let s3 = this.main.name.substring(0, 3);
            var abr = utils.padLeft(cnt, this.main.bedLenghtCode, '0');
            code = s3 + '-' + abr;
            res = _.filter(allBeds, x => x.code === code);
            cnt++;
        } while (res.length > 0);

        main.setFlag(1, false);
        return code;
    }

    identifyBed(bed, options) {
        var success = true;
        var currentBed = null;
        var filterMsg = {};

        try {
            var identificationType = options.identificationType;
            var enumTypes = new Enum(this.galeno.getIdentifycationType());
            currentBed = this.getBed(bed.internalId);
            currentBed.identificationType = enumTypes.get(identificationType);
            filterMsg = currentBed.identificationType.key;

            if (utils.validString(currentBed.code) && !options.overwrite) {
                success = false;
                filterMsg = { first: filterMsg, second: this.config.AlreadyExitsCode };
            }
            else if (currentBed.identificationType == enumTypes.AutomaticString) {
                currentBed.code = this.getCodeRandomString();
            }
        }
        catch (e) {
            success = false;
            currentBed = e;
        }
        return this.getMessage({ context: this.config.identificationType, filter: filterMsg }, success, currentBed);
    }

    createAreas(areas) {
        var exists = [];
        var msg = '';
        var success = true;

        try {
            var cnt = 0;
            areas.forEach(function (area) {
                var hasSame = _.filter(this.main.areas, x => x.name === area.name);
                if (hasSame.length > 0)
                    exists.push(area);
                else {
                    this.main.areas.push(area);
                    cnt++;
                }
            }, this);

            msg = `Areas ingresadas (${cnt})`;
            if (exists.length > 0)
                msg += `, areas existentes (${exists.length})`;

        } catch (e) {
            msg = e;
            success = false;
        }

        return this.getMessage(msg, success, exists);
    }

    createComplex(complexs) {
        var exists = [];
        var msg = '';
        var success = true;

        try {
            var cnt = 0;
            complexs.forEach(function (complex) {
                var hasSame = _.filter(this.main.complex, x => x.name === complex.name);
                if (hasSame.length > 0)
                    exists.push(complex);
                else {
                    complex.id = utils.generateGUID();
                    this.main.complex.push(complex);
                    cnt++;
                }
            }, this);

            msg = `Complejidades ingresadas (${cnt})`;
            if (exists.length > 0)
                msg += `, complejidades existentes (${exists.length})`;

        } catch (e) {
            msg = e;
            success = false;
        }

        return this.getMessage(msg, success, exists);
    }
}


exports.Enclosure = Enclosure;