var destiny = require('./destiny');

class EventState {
  constructor(eventName)
  {
    this.name = eventName;
    this.someElemment = 'test';
    this.someThingElse = 123;
  }
}

class UserProfile {
  constructor(userProfileName)
  {
    this.name = userProfileName;
    // this.someElemment = 'test'; this.someThingElse = 123;
  }
}

class Event {

  constructor(mainObject) {
    this.MainObject = mainObject;
    this.Destiny =  new destiny.Destiny();
    this.CurrentStage = new destiny.DestinyStage();
    this.CurrentState = new EventState();
    this.stageIndex = -1;
  }

  SetStates(...states)
  {
    this.States = []; //una lista de estados de evento
    states.forEach(function (element) {
      var state = new EventState(element);
      this.States.push(state);
    }, this);
  }

  SetCurrentState(newState)
  {
     var oldState = this.CurrentState;
     this.CurrentState =  this.States[newState];
     console.log("STATE change to: " + this.CurrentState.name);
     this.manageChangeState(oldState);     
  }

  manageChangeState(oldState)
  {
      if (this.CurrentState.doLogic)
      {
        console.log('\tState have logic!')
        this.CurrentState.doLogic(this);
      }
  }

  SetDestiny(destiny)
  {
    this.Destiny = destiny;
  }

  SetUserProfiles(...profiles)
  {
    this.Profiles = [];
    profiles.forEach(function (element) { //una lista de perfiles de usuario
      var profile = new UserProfile(element);
      this
        .Profiles
        .push(profile);
    }, this);
  }

  get area() {
    return this.Next();
  }

  Back() {}

  NextToStage()
  {}

  Next() {  
      if (!this.Destiny || !this.Destiny.Stages || this.Destiny.Stages.length == 0)
        {
          console.log("\t\t %s event have no stages!", this.name);
          return;
        }

     this.stageIndex++;       
     
        this.CurrentStage = this.Destiny.Stages[this.stageIndex];
        console.log("Next STAGE to: " + this.CurrentStage.name);
        this.manageChangeStage(this.stageIndex-1, this.stageIndex);
     
      // todo: validar que no sobrepase el lengt
  }

  SetStageLogic(indexStage, logicFunction)
  {
     this.Destiny.Stages[indexStage].doLogic = logicFunction;
  }

 SetStateLogic(indexState, logicFunction)
  {
     this.States[indexState].doLogic = logicFunction;
  }
  
  manageChangeStage(old, neww)
  {       
      if (this.Destiny.Stages[neww].doLogic)
      {
        console.log('\tStage have logic!')
        this.Destiny.Stages[neww].doLogic(this);
      }
  }

  Stop()
  {}

  Start(fromEvent)
  {
    console.log("Starting %s workflow!!...", this.name);
    if (this.stageIndex > -1)
      throw new Error("Event doesn't finished yet!");

    if (this.onStart)
    {
       console.log('\tStart have logic!')
       this.onStart(fromEvent);
    }

    this.Next();    
  }

  ContinueWith(newEvent)
  {
     console.log("");
     console.log("Continue with event: %s", newEvent.name);   
     newEvent.Start(this);    
  }

  AlertTo(roles)
  {
      console.log('\t\tSend notifications to users in roles: %s', roles);
      //send prefixed notifications to all users in roles according some predefined text message
  }

  MessageTo(targetInformations, message)
  {
     console.log('\t\tSend message: %s to: %s', message,targetInformations);
      //send notifications to all users in roles
  }
}

exports.world = function () {
  console.log('Hellodddd World');
}

exports.Event = Event;