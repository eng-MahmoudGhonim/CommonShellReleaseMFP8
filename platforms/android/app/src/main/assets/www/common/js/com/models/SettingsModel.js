define([ 
	
		"jquery", 
		"backbone",
		"globalize",
		"com/models/Constants",
		"com/utils/DataUtils",
		 
	], function( $, Backbone, G, Constants, DataUtils ) {

    var SettingsModel = Backbone.Model.extend({
		
		initialize: function(attributes, options)
		{
			var deviceLanguage = "en";
			if( deviceLanguage != "en" && deviceLanguage != "ar" ){
				deviceLanguage = Constants.SETTINGS_DEFAULT_LANGUAGE;
			}
			this.set({
				"language": DataUtils.getLocalStorageData("language") || deviceLanguage, 
			});
			
			//trigger language change so transition direction is set correctly
			this.changeLanguage(this.get("language"));
		},
        
        /**
         * change language
         * also change the the default transition direction
         * @param language, code string
         */
        changeLanguage: function(language)
        {
        	this.set("language", language);
        	var culture = Globalize.culture(language);
        	$.mobile.changePage.defaults.reverse = culture.isRTL;
        },
		
		/**
		 * save settings to localStorage
		 * remove from localstorage if data is undefined
		 * @param none
		 */
		save: function()
		{
			DataUtils.setLocalStorageData("language", this.get("language"));
			$(window).trigger(Constants.EVENT_SETTINGS_UPDATE);
			console.log("Settings saved to localStorage.");
		},
		
		/**
		 * reset settings and save
		 * @param none
		 */
		reset: function()
		{
			console.log("Settings reset to default");
			this.set("language", WL.App.getDeviceLanguage()); //use device language on reset
			this.save();
		}
		
    });

    return SettingsModel;

} );