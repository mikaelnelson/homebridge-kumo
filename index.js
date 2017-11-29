var Service, Characteristic;

module.exports = function( homebridge ) {    
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    
    homebridge.registerAccessory("homebridge-kumo", "Kumo", Kumo);
};

function Kumo(log, config) {
    this.log = log;
    //geturl
    //posturl
}

Kumo.prototype = {
    identity: function(callback) {
        console.log("Request Identity!");
        callback(null);
    },
    
    getCurrentHeatingCoolingState: function(callback) {
        console.log("Get Current Heating/Cooling State!");
        
        //Perform Callback To Return Result
        callback( null, Characteristic.TargetHeatingCoolingState.AUTO);
    },
    
    getTargetHeatingCoolingState: function(callback) {
        console.log("Get Target Heating/Cooling State!");
        
        callback( null, Characteristic.TargetHeatingCoolingState.AUTO);
    },
    
    getCurrentTemperature: function(callback) {
        console.log("Get Current Temperature!");
        
        callback( null, 72 );
    },
    
    getTargetTemperature: function(callback) {
        console.log("Get Target Temperature!");
        
        callback( null, 72);
    },
    
    setTargetTemperature: function(value, callback) {
        console.log("Set Target Temperature: " + value );
        
        callback(null);
    },
    
    getTemperatureDisplayUnits: function(callback) {
        console.log("Get Temperature Display Units!");
        
        callback( null, Characteristic.TemperatureDisplayUnits.CELSIUS);
    },
    
    setTemperatureDisplayUnits: function(value, callback) {
        console.log("Set Temperature Display Units!");
        
        callback( null );
    },
    
    getServices: function() {
        let informationService = new Service.AccessoryInformation();

        informationService
            .setCharacteristic( Characteristic.Manufacturer, "Kumo")
            .setCharacteristic( Characteristic.Model, "Kumo Model")
            .setCharacteristic( Characteristic.SerialNumber, "1234");

        let thermostatService = new Service.Thermostat("Kumo");

        thermostatService
            .getCharacteristic(Characteristic.CurrentHeatingCoolingState)
                .on('get', this.getCurrentHeatingCoolingState.bind(this));

        thermostatService
            .getCharacteristic(Characteristic.TargetHeatingCoolingState)
                .on('get', this.getTargetHeatingCoolingState.bind(this));
        
        thermostatService
            .getCharacteristic(Characteristic.CurrentTemperature)
                .on('get', this.getCurrentTemperature.bind(this));
        
        thermostatService
            .getCharacteristic(Characteristic.TargetTemperature)
                .on('get', this.getTargetTemperature.bind(this))
                .on('set', this.setTargetTemperature.bind(this));
        
        thermostatService
            .getCharacteristic(Characteristic.TemperatureDisplayUnits)
                .on('get', this.getTemperatureDisplayUnits.bind(this))
                .on('set', this.setTemperatureDisplayUnits.bind(this));    
        
        this.informationService = informationService;
        this.thermostatService = thermostatService;

        return [informationService, thermostatService];
    }
};