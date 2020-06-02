define([
		"jquery", 
		"backbone",
		"com/utils/DataUtils",
		"dateformat"
	], function($, Backbone, DataUtils) {
	
	var ActivityLoggerModel = Backbone.Model.extend({}, {
		LOCAL_STORAGE_LOGGER : "LOCAL_STORAGE_LOGGER",
		
		getLoginDate:function() {
			var msDate = (new Date()).getTime();
			 var DateString = DataUtils.getLocalStorageData(this.LOCAL_STORAGE_LOGGER);
			 if(DateString && DateString != "null" && parseInt(DateString)) {	
				 msDate = parseInt(DateString);
			 }
 
	    	 return msDate;
		},
		
	  	updateLoginDate: function() {
	    	 var currentDate = new Date();
	    	 var newLastLoginDate = currentDate.getTime();
	    	
	    	DataUtils.setLocalStorageData(this.LOCAL_STORAGE_LOGGER, newLastLoginDate, false);
	  	}
	});
	
	return ActivityLoggerModel;

});