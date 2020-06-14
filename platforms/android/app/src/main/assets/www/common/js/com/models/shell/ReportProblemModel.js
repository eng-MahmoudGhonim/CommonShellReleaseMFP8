define([

		"jquery",
		"backbone"

	], function($, Backbone)
	{

	var ReportProblemModel = Backbone.Model.extend({},
	{
		submitProblem: function(problem,callback){
			parameters = JSON.stringify(problem);
			var invocationData = {
					adapter : 'CRMAdapter',
					procedure : 'reportProblem',
					parameters : [parameters]
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
							callback("Pass",data);
						}
						else{
							callback("backendCommError");
						}
					}
					else
						{
						//issue in communicating with the backend
							callback("backendCommError");
						}
				},
				function(result){
					//unable to communicate with the backend
					callback("backendCommError");
				}
			);
		}
	});

	return ReportProblemModel;

});
