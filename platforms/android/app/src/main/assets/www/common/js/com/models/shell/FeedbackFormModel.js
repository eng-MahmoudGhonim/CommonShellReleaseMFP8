define([
		
		"jquery", 
		"backbone"
		
	], function($, Backbone) 
	{

	var FeedbackFormModel = Backbone.Model.extend({},
	{
		
		submitFeedback: function(feedback,captchaObject,callback){
			parameters = JSON.stringify(feedback);
			var invocationData = {
					adapter : 'CRMAdapter',
					procedure : 'sendFeedback',
					parameters : [parameters,captchaObject]
			};
			//Calling adapter
			WL.Client.invokeProcedure(invocationData,{
				onSuccess : function(result){
					if(result.invocationResult.isSuccessful){
						var data = result.invocationResult;
						if(data && data.Envelope && data.Envelope.Body
								&& data.Envelope.Body.CreateCase_Response 
								&& data.Envelope.Body.CreateCase_Response.CreateCaseResult ){
							data = data.Envelope.Body.CreateCase_Response.CreateCaseResult;
							callback(true,data);
						}
						else{
							callback(false);
						}
					}
					
				},
				onFailure : function(result){
					callback(false);
				},
				invocationContext: this
			});
		}
	});

	return FeedbackFormModel;

});