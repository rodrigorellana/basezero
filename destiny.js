class DestinyStage
{
  constructor(destinyName, desc)
  {
    this.name = destinyName;  
    this.description = desc;
  }
}

class Destiny
{
    constructor(...stages) {    
        this.Stages = [];       
        stages.forEach(function(element) {            
            var stage = new DestinyStage(element, null);
            this.Stages.push(stage);   
        }, this); 
    }    
}


exports.Destiny = Destiny;
exports.DestinyStage = DestinyStage;