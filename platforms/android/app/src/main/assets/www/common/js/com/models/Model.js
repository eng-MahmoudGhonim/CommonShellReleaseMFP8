define([ 
	
		"jquery", 
		"backbone",
		"com/models/SettingsModel",
		"com/models/Constants",
		 
	], function( $, Backbone, SettingsModel, Constants ) {

    var Model = Backbone.Model.extend({
		
		initialize: function(attributes, options)
		{
			this.set({
				"settings" : new SettingsModel(),
			});
		}
    
    });

    return Model;

});
