define([
		
		"jquery", 
		"backbone",
		"com/models/shell/ServicesDirectoryModel"
		
	], function($, Backbone, ServicesDirectoryModel) 
	{
	
	var ServiceDirectoryUtils = Backbone.Model.extend({},
	{
		getAllServices: function(callback){
			ServicesDirectoryModel.getAllServices(callback);
		}, 
		
		isServiceInApp:function(serviceId){
			return ServicesDirectoryModel.isServiceInApp(serviceId);
		},
		
		getServiceDetails:function(serviceId, callback){
			ServicesDirectoryModel.getServiceDetails(serviceId, callback);
		}
		
	});

	return ServiceDirectoryUtils;

});