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
					parameters : [parameters,captchaObject],
					invocationContext: this
			};
			//Calling adapter
			invokeWLResourceRequest(invocationData,
				function(result){
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
				function(result){
					callback(false);
				}

			);
		}
	});

	return FeedbackFormModel;

});
