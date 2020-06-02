define([

        "jquery", 
        "backbone",
        "com/models/shell/PaymentModel",
        "com/models/shell/UserProfileModel"

        ], function($, Backbone, PaymentModel, UserProfileModel) 
        {

	var PaymentUtils = Backbone.Model.extend({},
	{
		
		/**
		 * This method will handle payment via ePay on mobile app and mobile web
		 * @DSGOptions : { SPCODE, SERVCODE, PYMTCHANNELCODE, VERSIONCODE, SPTRN, AMOUNT}
		 * @callbackFunction : function(){}
		 * callback function arg: {isSuccessful:true} is A successful query to DSG, and doesn't mean payment paid
		 * 						   {code:{}} is transaction status code coming from DSG, Note: it is available only when isSuccessful is true.
		 */
		//isSuccessful means a successful query from DSG and doesn't mean the payment process is completed
		performEPay: function(busyInd , DSGOptions, callbackFunction){
			return PaymentModel.performEPay(busyInd,DSGOptions, callbackFunction);
		},
	
		performMPay: function(DSGOptions, returnURL){
			DSGOptions.returnURL = returnURL;
			// time stamp is being generated on the server side. 
			// On JS time stamp can be tolerated as per the local clock of the device. 
			mobile.changePage("shell/mPay_details.html", {data:DSGOptions} );
		}

	});

	return PaymentUtils;

});
