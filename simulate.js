var enclosureLib = require('./enclosure/enclosure');
var universe = require('./enclosure/enclosureUniverse.json');
// var _ = require('lodash');
var galenoConfig = require('./galeno/galeno');

var enclosureConfig = {
    releaseStatus: 'Liberada',
    takenStatus: 'Ocupada',
    bedStatus: 'bedStatus',
    notFoundStatus: 'Inexistente',
    AlreadyExitsCode: 'AlreadyExitsCode',
    identificationType: "identificationType"
};

global.enclosures = [];
for (let index = 0; index < 100; index++) {
    global.enclosures.push(new enclosureLib.Enclosure(Object.assign({}, enclosureConfig)));
    var current = global.enclosures[global.enclosures.length - 1];
    current.createBedsUniverse(universe.beds, { log: false });
    current.createUsersUniverse(universe.users, { log: false });
}

var galeno = new galenoConfig.Galeno();

var enclosure = global.enclosures[0];
var bed12 = enclosure.beds[12];
let newBed = Object.assign({}, bed12);

// console.log(enclosure.getUniverse());

// console.log(enclosure);
//newBed.code = 'asds';
//console.log(enclosure.releaseBed(newBed));
// console.log(enclosure.releaseBed(bed12));

// console.log(enclosure.getUniverse());
// console.log(enclosure.takeBed());

newBed.complex.length = 1;
if (newBed.artifacts)
    newBed.artifacts.length = 3;


galeno.findBed(newBed, { log: false });

// var complex = [
//     {
//         name: "UTI",
//         description: ""
//     },
//     {
//         name: "NEO",
//     }
//     ,
//     {
//         name: "NEasdO",
//     }
// ];

// console.log(enclosure.createComplex(complex));

// console.log(b1.internalId);
// console.log(b2.internalId);
// console.log(b3.internalId);

// console.log(enclosure.identifyBed(b1, 3));
// bed12.code = 'asddddd';
// console.log(enclosure.identifyBed(bed12, { identificationType: 3 }));
// console.log(enclosure.identifyBed(b3, 3));

