var prompt = require('prompt');
var util = require('util');
var mainEvent = require('./event');
var mainDestiny = require('./destiny');

const readline = require('readline');
const rl = readline.createInterface({input: process.stdin, output: process.stdout});

// --------------------------
const eventRechazar = new mainEvent.Event();
eventRechazar.name = "-= Rechazar Encomienda =-";
eventRechazar.descripcion = "rechazo de un paquete por X motivo";
eventRechazar.onStart = function (e) {
    console.log('\tOn start REJECTED event');   
    var msg = "dear user this item was rejected: " + e.MainObject.description + ", on stage : " + e.CurrentStage.name;
    e.MessageTo("someEmails@gmail.com", msg);
}
// --------------------------

var solicitud = { //may be anything, even a array
    description: 'mesa de ping pong',
    width: 100.45,
    weight: 100,
    length: 300.67
}

//must order be important !!
var destinys = new mainDestiny.Destiny("Ensure storage amount", 
"Send to customs", 
"Send to airport", 
"Send to client", 
"Received by client");

const eventEnviar = new mainEvent.Event(solicitud);
eventEnviar.name = "-= Enviar Encomienda =-";
eventEnviar.descripcion = "envio de un paquete hacia su destinatario";
eventEnviar.SetStates('StockRevision', 'Rejected', 'Send', 'Received');
eventEnviar.SetUserProfiles('Storage Supervisor', 'Customs Supervisor', 'Transporter', 'Destination Client');

// destiny.Stages[1].doLogic = function(){     console.log('\tdo logic from
// destiny'); };
eventEnviar.SetDestiny(destinys);

eventEnviar.States[0].doLogic = function (e) { //at first STATE do....
    console.log('\tDo logic from event change state');
    // e.AlertTo('Storage Supervisor')
};

eventEnviar.SetStageLogic(0, function (e) { //at first stage step do....
    console. log('\tDo logic from event');     
    e.AlertTo('Storage Supervisor')
    e.SetCurrentState(0); //change to StockRevision state
}); 


eventEnviar.SetStageLogic(1, function (e) { //at send to custom stage step do....      
    e.AlertTo('Transporters')
   // e.SetCurrentState(0); //change to StockRevision state
}); 


// console.log(event.CurrentStage);
eventEnviar.Start();

// var aaa;
// prompt.start();
// prompt.get(['username'], function (err, result) 
// {
//     if (err) 
//     { return onErr(err); }
//     //console.log('USER INTERACTION = 1: Hay Stock, 2: No Hay Stock =');
//     // console.log(' User Response: ' + result.username);    
//     this.aaa = result.username;
// });

// function onErr(err) {
//     console.log(err);
//     return 1;
// }

//   console.log(aaa);    


 rl.question('USER INTERACTION = 1: Hay Stock, 2: No Hay Stock ', (answer) => 
    {
        if (answer == 2) {
            // no product inventary logic supervisor   
            eventEnviar.SetCurrentState(1); //Rejected 
            eventRechazar.descripcion = "sin inventario";                     
            eventEnviar.ContinueWith(eventRechazar);
        }
        if(answer == 1) {
            eventEnviar.SetCurrentState(2); 
            eventEnviar.Next();
        }
        rl.close();
    });


// console.log("ENDcl WORKFLOW!");
