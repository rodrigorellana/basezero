
  var util = require('util');
 var prompt = require('prompt');
var aa ;

  prompt.start();

   prompt.get(['username'], function (err, result) 
   {
    if (err) 
        { return onErr(err); }
        this.aa = result.username;
    console.log('Command-line input received:');
    console.log('  Username: ' + result.username);
    // console.log('  Email: ' + result.email);
      console.log('asdddd');
  });

  function onErr(err) {
    console.log(err);
    return 1;
  }

  console.log('asd');