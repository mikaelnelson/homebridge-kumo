var Service, Characteristic;
var switchState = false;

module.exports = function( homebridge ) {
    console.log("Homebridge!");
    
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    
    homebridge.registerAccessory("switch-plugin", "MySwitch", mySwitch);
};

mySwitch.prototype = {
  getServices: function() {
      let informationService = new Service.AccessoryInformation();
      
      informationService
        .setCharacteristic( Characteristic.Manufacturer, "Switch Manu")
        .setCharacteristic( Characteristic.Model, "Switch Model")
        .setCharacteristic( Characteristic.SerialNumber, "1234");
      
      let switchService = new Service.Switch("My Switch");
      
      switchService
        .getCharacteristic(Characteristic.On)
            .on('get', this.getSwitchOnCharacteristic.bind(this))
            .on('set', this.setSwitchOnCharacteristic.bind(this));
      
      this.informationService = informationService;
      this.switchService = switchService;
      
      return [informationService, switchService];
  },
    
  getSwitchOnCharacteristic: function( next ) {
      const me = this;
      console.log("Get Switch State!");
        
      return next( null, switchState );
  },
    
  setSwitchOnCharacteristic: function(on, next) {
      const me = this;
      console.log("Set Switch State: " + on);
        
      switchState = on;
      
      return next();
  }
};

function mySwitch(log, config) {
    this.log = log;
    //geturl
    //posturl
}

