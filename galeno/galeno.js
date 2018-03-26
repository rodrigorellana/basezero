var galenoData = require('./config.json');

class Galeno {

    constructor()
    {
        this.main = galenoData;      
    }

    getBedStatus()
    {
        return this.main.bedStatus;
    }
    getMessages()
    {
        return this.main.messages;
    }
    getIdentifycationType()
    {
        return this.main.identificationType;
    }
    getFlags()
    {
        return this.main.Flags;
    }
}


exports.Galeno = Galeno;