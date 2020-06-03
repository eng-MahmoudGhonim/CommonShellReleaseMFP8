define([
"jquery",
"backbone",
"com/utils/DataUtils",
"com/utils/Utils",
"com/models/shell/ServicesDirectoryModel",
"com/models/Constants"
], function($, Backbone, DataUtils, Utils,ServicesDirectoryModel,Constants) {

	var captchaModel = Backbone.Model.extend({}, {
		SUCCESS : "SUCCESS",
		FAILED : "FAILED",
		NOTEXIST:"NOTEXIST",

		GetRandomAnswers : function(id, count,callBack)
		{
			var invocationData = {
					adapter : "captchaAdapter",
					procedure : "allANSWERS"//"GetRandomFour",
						//parameters : [id,count]
			};

			invokeWLResourceRequest(invocationData,
				function(result) {
					var data = result.invocationResult.resultSet;
					callBack(JSON.stringify(data))
					//console.log(result);
				},
				function(result) {
					//console.log(result);
					callBack(result)
				}
			);
		},
		GenerateCaptcha:function(key,quesId,renderImages,serviceName)
		{
			var invocationData = {
					adapter : "captchaAdapter",
					procedure : "GenerateCaptcha",
					parameters : [key,quesId,serviceName]
			};

			invokeWLResourceRequest(invocationData,
				function(result) {

					var data = result.invocationResult;

					renderImages("Success" ,data);
				},
				function(result) {

					//	var data = result.invocationResult;
					renderImages("Failed" ,"")
				}
			);

		},

		GenerateSpeechCaptcha:function(key,renderSpeechCaptchaData,serviceName)
		{

			var invocationData = {
					adapter : "captchaAdapter",
					procedure : "GenerateSpeechCaptcha",
					parameters : [key,serviceName]
			};

			invokeWLResourceRequest(invocationData,
				function(result) {

					var data = result.invocationResult;
					renderSpeechCaptchaData("Success" ,data);
				},
				function(result) {
					renderSpeechCaptchaData("Failed","","");
				}
			);
		},

		CheckCaptcha:function(key,userAnswerId,checkAnswer)
		{

			var invocationData = {
					adapter : "captchaAdapter",
					procedure : "CheckCaptcha",
					parameters : [key,userAnswerId]
			};
			invokeWLResourceRequest(invocationData,
				function(result) {
					var data ={"isValid":result.invocationResult.isValid,"type":"Icon","answer":userAnswerId};
					checkAnswer(data);
				},
				function(result) {
					var data ={"isValid":"InValid","type":"Icon","answer":userAnswerId};
					checkAnswer(data);

				}
			);
		},

		CheckSpeechCaptcha:function(key,inputText,checkAnswer)
		{
			var invocationData = {
					adapter : "captchaAdapter",
					procedure : "CheckSpeechCaptcha",
					parameters : [key,inputText]
			};
			invokeWLResourceRequest(invocationData,
				function(result) {

					var data ={"isValid":result.invocationResult.isValid,"type":"Speech","answer":inputText};
					checkAnswer(data);
				},
				function(result) {
					var data ={"isValid":"InValid","type":"Speech","answer":inputText };
					checkAnswer(data);

				}
			);
		}
	});
	return captchaModel;
});
