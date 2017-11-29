var request = require('request');

//Variables for Homebridge
var Service, Characteristic;

//Kumocloud Service
const KumoLoginURL = 'https://geo-c.kumocloud.com/login';
const KumoUpdateURL = 'https://geo-c.kumocloud.com/getDeviceUpdates'

module.exports = function( homebridge ) {    
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    
    homebridge.registerAccessory("homebridge-kumo", "Kumo", Kumo);
};

function Kumo(log, config) {
    this.log = log;
    //geturl
    //posturl
    
    this.name = config.name;
    
    //Kumo Cloud Token
    this.token = null;
    
    //Mini-Split Serial
    this.serial = config.serial || null;
    
    //Get Username and Password From Config
    this.username = config.username || null;
    this.password = config.password || null;
    
    //Login
    if( null != this.username && null != this.password ) {
        
        //Request Login
        request.post( 
            KumoLoginURL,
            { json: {"username":this.username, "password":this.password, "appVersion":"2.2.0"} },
            function (error, response, body ) {
                
                //Handle Response From Login
                console.log("Token Status Code: " + response.statusCode);
    
                if( !error && 200 == response.statusCode ) {
                    //Got a good response, get token      
                    this.token = body[0].token;
                                        
                    console.log("Token: " + this.token);
                    
                    //Todo: Parse "Device Update" data
                }
            }.bind(this)
        );
    }
    
    this.service = new Service.Thermostat(this.name);
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
                
        request.post( 
            KumoUpdateURL,
            { body: '["' + this.token + '",["' + this.serial + '"]]' },
            function (error, response, body ) {
                
                //Handle Response From Login
                console.log("Get Cur Temp Status Code: " + response.statusCode);
    
                if( !error && 200 == response.statusCode ) {
                    //Got a good response, get token      
//                    this.token = body[0].token;
                    
                    var data = JSON.parse(body);
                    
                    console.log(data[2][0][0].room_temp);
                    //console.log(body.room_temp);
                    
                    //Todo: Parse "Device Update" data
                    callback( null, data[2][0][0].room_temp );
                }
                else {
                    callback( error );
                }
            }.bind(this)
        );
    },
    
    getTargetTemperature: function(callback) {
        console.log("Get Target Temperature!");
        
        callback( null, 72);
    },
    
    setTargetTemperature: function(value, callback) {
        console.log("Set Target Temperature: " + value );
        console.log("Token: " + this.token);

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

        this.service
            .getCharacteristic(Characteristic.CurrentHeatingCoolingState)
                .on('get', this.getCurrentHeatingCoolingState.bind(this));

        this.service
            .getCharacteristic(Characteristic.TargetHeatingCoolingState)
                .on('get', this.getTargetHeatingCoolingState.bind(this));
        
        this.service
            .getCharacteristic(Characteristic.CurrentTemperature)
                .on('get', this.getCurrentTemperature.bind(this));
        
        this.service
            .getCharacteristic(Characteristic.TargetTemperature)
                .on('get', this.getTargetTemperature.bind(this))
                .on('set', this.setTargetTemperature.bind(this));
        
        this.service
            .getCharacteristic(Characteristic.TemperatureDisplayUnits)
                .on('get', this.getTemperatureDisplayUnits.bind(this))
                .on('set', this.setTemperatureDisplayUnits.bind(this));    
        
        return [informationService, this.service];
    }
};