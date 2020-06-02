
define([

"jquery", "backbone", "com/utils/DataUtils"], function($, Backbone, DataUtils) {

	var IncidentDetectionModel = Backbone.Model.extend({},{
		initialize : function() {
		},
		getUserConfig:function(){
			try {
				var userConfig =JSON.parse(DataUtils.getLocalStorageData("incidentDetectionConfig", "shell"));

				if(!userConfig){
					userConfig=[{name:"allAlerts",value:false},{name:"hospitals",value:false},{name:"airports",value:false},{name:"metroAndTram",value:false},
					            {name:"schools",value:false},{name:"shopping",value:false},{name:"airports",value:false},{name:"highSeverity",value:false},
					            {name:"dangerousTraffic",value:false}];
				}
				return  userConfig;
			} catch (e) {
				console.log(e)
				return [{name:"allAlerts",value:false},{name:"hospitals",value:false},{name:"airports",value:false},{name:"metroAndTram",value:false},
				        {name:"schools",value:false},{name:"shopping",value:false},{name:"airports",value:false},{name:"highSeverity",value:false},
				        {name:"dangerousTraffic",value:false}];

			}
		},

		saveIncidentDetectionConfig: function(result,callback) {
			try {
				if(typeof result != "string")
					result=JSON.stringify(result);
				DataUtils.setLocalStorageData("incidentDetectionConfig", result, false, "shell");
				standardNotificationTags(result,callback)
			} catch (e) {
				console.log(e);
				callback();
			}
		},
		
		saveIncidentLocalStorage:function(result,callback) {
			try {
				if(typeof result != "string")
					result=JSON.stringify(result);
				DataUtils.setLocalStorageData("incidentDetectionConfig", result, false, "shell");
				callback();
				
			} catch (e) {
				console.log(e);
				callback();
			}
		},
		setDefaultIncidentDetection: function(callback) {
			try {
				var result=[{name:"allAlerts",value:false},{name:"hospitals",value:false},{name:"airports",value:false},{name:"metroAndTram",value:false},
				            {name:"schools",value:false},{name:"shopping",value:false},{name:"airports",value:false},{name:"highSeverity",value:false},
				            {name:"dangerousTraffic",value:false}];
				if(typeof result != "string")
					result=JSON.stringify(result);
				DataUtils.setLocalStorageData("incidentDetectionConfig", result, false, "shell");

				var userConfig =JSON.parse(DataUtils.getLocalStorageData("incidentDetectionConfig", "shell"));
                 var subscribedTags=[];
				if(userConfig&&userConfig.length>0){
					
					for(var i=0;i<userConfig.length;i++){
						if(userConfig[i].value==true){
							subscribedTags.push(userConfig[i])
						}
					}
				}
				standardNotificationTags(subscribedTags,callback)
				
			} catch (e) {
				console.log(e);
				callback();
			}
		}

	});

	return IncidentDetectionModel;

});