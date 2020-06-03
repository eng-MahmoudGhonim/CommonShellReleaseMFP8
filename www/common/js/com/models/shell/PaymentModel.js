define([


		"jquery",
		"backbone",
		"com/models/Constants",
		"com/utils/Utils",
		"com/models/shell/UserProfileModel",
		"com/models/shell/ServicesDirectoryModel",
		"com/models/shell/AuthenticationModel",
		"com/utils/DataUtils",
		"com/models/shell/HapinessMeterRatingModel"

	], function($, Backbone, CONSTANTS, Utils, UserProfileModel, ServicesDirectoryModel, AuthenticationModel,DataUtils,HapinessMeterRatingModel)
	{

	var PaymentModel = Backbone.Model.extend({},
	{
		ePayQueryTransaction: function(DSGOptions,callback){
			var invocationData = {
					adapter : "ePayAdapter",
					procedure : "getTransactionStatus",
					parameters : [ DSGOptions.SPCODE, DSGOptions.SERVCODE, DSGOptions.SPTRN ],
					invocationContext: this
			};
			//Calling adapter
			invokeWLResourceRequest(invocationData,
				function(result){
					if(result.invocationResult.isSuccessful && result.invocationResult.result){
						var data = $.parseXML(result.invocationResult.result);

						var msgCode = $(data).find( "MESSAGECODE" );
						var msg = $(data).find( "MESSAGE" );

						if(msgCode){
							console.log(msgCode.text());
							//isSuccessful means a successful query from DSG and doesn't mean the payment process is completed
							callback({isSuccessful: true,
								code: msgCode.text(),
								msg: msg.text(),
								queryResponse: result.invocationResult.result});
						}
						else{
							callback({isSuccessful: false});
						}
					}
					else{
						callback({isSuccessful: false});
					}
				},
				function(result){
					callback({isSuccessful: false});
				}

			);
		},

		performEPay: function(busyInd , DSGOptions, callbackFunction){

			this.fillDSGOptions(DSGOptions);

			//Register callback
			var deferred = $.Deferred();
			if(callbackFunction){
				deferred.done(function(data){

					//Call callback function
					callbackFunction(data);
				});
			}

			//Display busy indicator




			//ePay Step 1,2 - Generate request token
			var invocationData = {
					adapter : "ePayAdapter",
					procedure : "createEPayRequest",
					parameters : [ DSGOptions ],
					invocationContext: this
			};
			DataUtils.setLocalStorageData("DSGOptions",DSGOptions,false,"shell");
			//Calling adapter
			invokeWLResourceRequest(invocationData,{
				function(result){

					if(result && result.invocationResult
						&& result.invocationResult.isSuccessful
						&& result.invocationResult.token
						&& (result.invocationResult.token.indexOf('http') == 0)){

						var epayPageUrl = result.invocationResult.token;
						deferred.resolve({ePayComplete:true,URL:epayPageUrl});

					}
					else{
						console.log('ePay failed');
						$(".ui-loader").hide();
						deferred.resolve({ePayComplete:false});
					}

				},
				function(result){
					busyInd.hide();
					deferred.resolve({ePayComplete:false});
				}

			);
		},

		fillDSGOptions: function(DSGOptions){
			if(typeof DSGOptions === 'object'){
				if(AuthenticationModel.isAuthenticated()){
					DSGOptions.AUTHENTICATED = 'YES';
					try {
						var userInfo = UserProfileModel.getUserProfile().Users[0];
						DSGOptions.USERNAME = userInfo.mail;
						DSGOptions.FULLNAMEEN = userInfo.first_name_en + " " + userInfo.last_name_en;
						DSGOptions.FULLNAMEAR = userInfo.first_name_ar + " " + userInfo.last_name_ar;
						DSGOptions.MOBILENO = userInfo.mobile.replace(/[^0-9]/g, "").replace(/^00/g, ""); //Makes sure No 00 or symbols included
						DSGOptions.NATIONALITY = ''; //TODO: update this after changing countries saved to ISO format
						DSGOptions.EMIRATESID = userInfo.id_number;
					}
					catch(e) {
					}
				}
				else{
					DSGOptions.AUTHENTICATED = 'NO';
				}
				//Handle different property name
				if(DSGOptions.SERVICE_ID){
					DSGOptions.SERVICEID = DSGOptions.SERVICE_ID;
				}
				if(DSGOptions.SERVICEID){
					var serviceDetails = ServicesDirectoryModel.getSyncServiceDetails(DSGOptions.SERVICEID);
					DSGOptions.SERVICENAMEEN = serviceDetails.serviceName_EN?serviceDetails.serviceName_EN:'';
					DSGOptions.SERVICENAMEAR = serviceDetails.serviceName_AR?serviceDetails.serviceName_AR:'';
				}
				DSGOptions.APPNAME = CONSTANTS.APP_ID;
				HapinessMeterRatingModel.transactionData = {
						"transactionID":DSGOptions.SPTRN ? DSGOptions.SPTRN : DSGOptions.SP_TRN,
						"gessEnabled":"false",
						"serviceCode":DSGOptions.SERVICEID,
						"serviceDescription":DSGOptions.Services,
						"channel":"WEB"
				}
			}
			return DSGOptions;
		},
		decryptmPayAmount: function(DSGOptions,successCallback , failureCallback){
			DSGOptions = this.fillDSGOptions(DSGOptions);
			var invocationData = {
					adapter : 'mPayAdapter',
					procedure : 'decryptAmount',
					parameters : [DSGOptions],
					invocationContext: this
			};
			invokeWLResourceRequest(invocationData,
				function(result){
					var returnedData = {};
					returnedData.TRX_ID = '';
					returnedData.TIMESTAMP = '';
						if(result && result.status == 200
							&& result.invocationResult
							&& result.invocationResult.isSuccessful == true )
							{// loop through all the array until we find our property DEG$TRX_ID
							var DSGOptions = result.invocationResult.DSGOptions;
	            			if(! isUndefinedOrNullOrBlank(DSGOptions.AMOUNT)){
	            				successCallback(DSGOptions.AMOUNT);
	            			}else{
								failureCallback();
							}

						}else{
							failureCallback(result.invocationResult);
						}
					},
				function() {
					failureCallback();
				}

			);
		},
		mPayRegisterTransaction: function(params, callback){

			params = this.fillDSGOptions(params);

				parameters = params; // no need to stringify... the Adapter accepts it as an object
				var invocationData = {
						adapter : 'mPayAdapter',
						procedure : 'registerTransaction',
						parameters : [parameters],
						invocationContext: this
				};
				invokeWLResourceRequest(invocationData,
					function(result){
						var returnedData = {};
						returnedData.TRX_ID = '';
						returnedData.TIMESTAMP = '';
						if(result.invocationResult.output.isSuccessful == true){
							if(result
								&& result.invocationResult
								&& result.invocationResult.output
								&& result.invocationResult.output.Envelope
								&& result.invocationResult.output.Envelope.Body
								&& result.invocationResult.output.Envelope.Body.registerTransactionResponse
								&& result.invocationResult.output.Envelope.Body.registerTransactionResponse.properties
								&& result.invocationResult.output.Envelope.Body.registerTransactionResponse.properties.property){
								// loop through all the array until we find our property DEG$TRX_ID
		            			result.invocationResult.output.Envelope.Body.registerTransactionResponse.properties.property.forEach(function(element){
		            				if(element.name == "DEG$TRX_ID"){
		            					// Happy path TRX_ID
		            					returnedData.TRX_ID = element.value;
		            				}
		            				if(element.name == "DEG$STATUS_CODE"){
		            					// if DEG returned any error code.
		            					returnedData.STATUS_CODE = element.value;
		            				}
		            			});

		            			// we have to use the same time stamp throughout the transaction
		            			returnedData.TIMESTAMP = result.invocationResult.TIMESTAMP;

		            			// TODO remove the true and change the logic to read from the STATUS_CODE
		            			callback(returnedData);

							}else{
								console.log("something is missing from DEG response");
								callback();
							}
						}
					},
					function() {
						callback(null);
					}

				);
		},

		mPayProcessTransaction: function(params, callback){

				parameters = params; // no need to stringify... the Adapter accepts it as an object
				var invocationData = {
						adapter : 'mPayAdapter',
						procedure : 'processTransaction',
						parameters : [parameters],
						invocationContext: this
				};

				invokeWLResourceRequest(invocationData,
					function(result){
						if(result.invocationResult.output.isSuccessful == true){
							if(result
								&& result.invocationResult
								&& result.invocationResult.output
								&& result.invocationResult.output.Envelope
								&& result.invocationResult.output.Envelope.Body
								&& result.invocationResult.output.Envelope.Body.processTransactionResponse
								&& result.invocationResult.output.Envelope.Body.processTransactionResponse.properties
								&& result.invocationResult.output.Envelope.Body.processTransactionResponse.properties.property){

								// loop through all the array until we find our property DEG$TRX_ID
		            			result.invocationResult.output.Envelope.Body.processTransactionResponse.properties.property.forEach(function(element){
		            				if(element.name == "DEG$STATUS_CODE"){
		            					// if DEG returned any error code.
		            					callback({STATUS_CODE: element.value});
		            				}
		            			});

							}else{
								callback();
							}
						}
					},
					function() {
						// result.isAdapterSuccess = false;
						//Fire callback
						callback();
					}

				);

		},

		mPayInquireTransactionStatus: function(params, callback){

				parameters = JSON.stringify(params);
				var invocationData = {
						adapter : 'mPayAdapter',
						procedure : 'inquireTransactionStatus',
						parameters : [parameters],
						invocationContext: this
				};

				invokeWLResourceRequest(invocationData,
					function(result){
						result.isAdapterSuccess = true;
						//Fire callback
						callback(result);
					},
					function() {
						result.isAdapterSuccess = false;
						//Fire callback
						callback(result);
					}

				);

		},
		mPayRegenerateOTP: function(params, callback){

				parameters = params;
				var invocationData = {
						adapter : 'mPayAdapter',
						procedure : 'regenerateOTP',
						parameters : [parameters],
						invocationContext: this
				};

				invokeWLResourceRequest(invocationData,
					function(result){
						result.isAdapterSuccess = true;
						//Fire callback
						callback(result);
					},
					function(result) {
						result.isAdapterSuccess = false;
						//Fire callback
						callback(result);
					}

				);
 		}
	});

	return PaymentModel;

});
