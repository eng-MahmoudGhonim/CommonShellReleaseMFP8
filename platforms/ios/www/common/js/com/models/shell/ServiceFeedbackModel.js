define([
		
		"jquery", 
		"backbone",
		"com/models/Constants",
		"com/models/shell/GroupingModel"
		
		
	], function($, Backbone,Constants,GroupingModel) 
	{

	var ServiceFeedbackModel = Backbone.Model.extend({},
	{
		submitServiceFeedback: function(ratingObject,callback){
			
			var invocationData = {
					adapter : 'userProfile',
					procedure : 'setUserServiceFeedback',
					parameters : [ratingObject.user_id, ratingObject.service_id, ratingObject.user_comment, ratingObject.prefered_contact_time, ratingObject.user_mobile, ratingObject.q1, ratingObject.q2, ratingObject.q3, ratingObject.q4]
			};

			WL.Client.invokeProcedure(invocationData, {
				onSuccess : function(response) {
					if(response.status == 200)
					//	response.invocationContext.callback(true);
						callback(true);
				},
				onFailure : function(response) {
					//console.log(response.toString());
					callback(false);
				},
				invocationContext: this
			});
			
			//Make a phonecall if overall feedback is zero or user requested a call
			if(ratingObject.q4 == "1" &&(ratingObject.user_id !=null && ratingObject.user_id!=undefined&&ratingObject.user_id!="")){
				
				var mobileNumber=((ratingObject.user_mobile && ratingObject.user_mobile.length == 9)? "User mobile: " + ratingObject.user_mobile : "");
				var deviceModel=device.model?"Device Model: "+device.model :"" ;
				var deviceVersion=device.version? "OS Number: "+device.version:"" ;
				var q1Answer=ratingObject.q1?("Saves My Time: "+ ratingObject.q1) :"" ;
				var q2Aswer =ratingObject.q2?("Ease to Use: "+ ratingObject.q2) :"" ;
				var q4Answer=(ratingObject.q4?("Overall: "+ ratingObject.q4) :"");
				var userComment=(ratingObject.user_comment? "User comment: " + ratingObject.user_comment:"") ;
				var msg =mobileNumber +"\r\n"+deviceModel +"\r\n"+deviceVersion+"\r\n" +"App Version: "+WL.Client.getAppProperty(WL.AppProperty.APP_VERSION) +"\r\n"
						 +"Service Name: "+GroupingModel.getServicesName(ratingObject.service_id,model) +"\r\n"
						  +q1Answer+"\r\n"+q2Aswer+"\r\n"+q4Answer+"\r\n"+userComment;

				
				var params = {
						EmailAddress: ratingObject.user_id,
						Subject: Constants.APP_ID,
						Message: msg
				};
				
				invocationParams = JSON.stringify(params);
				
				var invocationData = {
						adapter : 'CRMAdapter',
						procedure : 'createPhoneCall',
						parameters : [invocationParams]
				};
				
				WL.Client.invokeProcedure(invocationData, {
					//TODO: Check if phone call is true
					onSuccess : function(result) {
						console.log(result+'Registered a phone call success');
					},
					onFailure : function(result) {
						console.log(result+'Registered a phone call Failure');
					}
				});
			}
		}
	});

	return ServiceFeedbackModel;

});