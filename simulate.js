
var enclosureLib = require('./enclosure/enclosure');
var universe = require('./enclosure/enclosureUniverse.json');

var enclosureConfig = {
    releaseStatus: 'Liberada',
    takenStatus: 'Ocupada',
    bedStatus: 'bedStatus'
};

const enclosure = new enclosureLib.Enclosure(enclosureConfig);
enclosure.createUniverse(universe);

var bed12 = enclosure.beds[12];

console.log(enclosure.getUniverse());

// console.log(enclosure.releaseBed());
// console.log(enclosure.releaseBed(bed12));

// console.log(enclosure.getUniverse());
console.log(enclosure.takeBed());

console.log(enclosure.getUniverse());

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


// console.log(enclosure.beds);