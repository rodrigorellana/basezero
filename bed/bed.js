class Bed {
    
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

    createBeds(bedType, quantity) {
        console.log('create %d beds of %s type in %s enclosure', quantity, bedType, this.main.name);
        for (let i = 1; i <= quantity; i++) {
            let newBed = Object.assign({}, bed);
            newBed.mainStatus = this.getBedStatus(bedType, true);
            newBed.localStatus = this.getBedStatus(bedType, false);
            newBed.internalId = utils.generateGUID();
            newBed.enclosureId = this.main.internalId;
            this.getAllBeds().push(newBed);
        }
    }
}