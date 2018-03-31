
var enclosureLib = require('./enclosure/enclosure');
var universe = require('./enclosure/enclosureUniverse.json');
var _ = require('lodash');



// var o1 = { a: 1, b: 2, c: { d: 1 } };
// var o2 = { c: { d: 1 }, b: 2, a: 1 };

// console.log(_.isEqual(o1, o2));
// process.exit();

var enclosureConfig = {
    releaseStatus: 'Liberada',
    takenStatus: 'Ocupada',
    bedStatus: 'bedStatus',
    notFoundStatus: 'Inexistente'   
};

const enclosure = new enclosureLib.Enclosure(enclosureConfig);
enclosure.createUniverse(universe);

var bed12 = enclosure.beds[12];
let newBed = Object.assign({}, bed12);

console.log(enclosure.getUniverse());
//newBed.code = 'asds';
//console.log(enclosure.releaseBed(newBed));
// console.log(enclosure.releaseBed(bed12));

// console.log(enclosure.getUniverse());
console.log(enclosure.takeBed());

newBed.complex.length = 1;
newBed.artifacts.length = 3;
var bedsFound = enclosure.findBed(newBed);

var complex = [
    {
        name: "UTI",
        description: ""
    },
    {
        name: "NEO",
    }
    ,
    {
        name: "NEasdO",
    }
];

console.log(enclosure.createComplex(complex));



// console.log(b1.internalId);
// console.log(b2.internalId);
// console.log(b3.internalId);

// console.log(enclosure.identifyBed(b1, 3));
bed12.code = 'asd';
console.log(enclosure.identifyBed(bed12, 3));
// console.log(enclosure.identifyBed(b3, 3));

