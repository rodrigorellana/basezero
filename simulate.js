
var enclosureLib = require('./enclosure/enclosure');

var universe = require('./enclosure/enclosureUniverse.json')
// test
const enclosure = new enclosureLib.Enclosure();
console.log(1);

enclosure.createUniverse(universe);

// var beds = enclosure.beds;
// var bed = beds[12];

console.log(enclosure.getUniverse());

// var b1 = enclosure.releaseBed();
// var b2 = enclosure.releaseBed(bed);

// // console.log(enclosure.getUniverse());
// var b3 = enclosure.takeBed();

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
// console.log(enclosure.identifyBed(b2, 3));
// console.log(enclosure.identifyBed(b3, 3));


// console.log(enclosure.beds);