define([ 

        "jquery", 
        "backbone",
        "com/views/PageView",
        "com/views/Header",
        "com/models/shell/PaymentModel",
        "com/utils/Utils",
        "com/utils/DataUtils",
        "com/models/shell/HapinessMeterRatingModel"

        ], function( $, Backbone, PageView, Header, PaymentModel, Utils ,DataUtils,HapinessMeterRatingModel) {

	var loadingInd = null;
	var loadThread = null;
	var DSGdata = {};

	// Extends PageView class
	var MPayCodeView = PageView.extend({

		/**
		 * The View Constructor
		 * @param el, DOM element of the page
		 */
		events: {
			'tap #mPayCodeSubmit':'processmPayTransaction',
			'tap  #cancelmPayTransaction':'cancelmPay',
			'tap  #resendmPayOTP':'resendOTPAgain'
		},
		initialize: function(options) 
		{
			options.hideHeader = false;
			options.hideFooter = true;
			options.hideSidePanel = true;
			options.phoneTitle = "";
			options.headerState = Header.STATE_SIMPLER;
			PageView.prototype.initialize.call(this, options);
			mpayCodePageviewInstance = this;

			options.phoneTitle = Globalize.localize("%shell.mPayCode.Title%", getApplicationLanguage());

			PageView.prototype.initialize.call(this, options);

			// pass the data to a global variable
			var data = options.data;
			mpayCodePageviewInstance.DSGdata = {} ;
			for (var key in data) {
				if (data.hasOwnProperty(key)) {
					mpayCodePageviewInstance.DSGdata[key] = Utils.replacePlusSigns(data[key]);
				}
			}

		},
		processmPayTransaction : function(e){
			e.preventDefault();
			if($("#mPayOTPForm").valid()){
				var OTP = $('input[id=otp_field]').val();
				if(! _.isEmpty(mpayCodePageviewInstance.DSGdata))
				{
					DSGdata = mpayCodePageviewInstance.DSGdata;
					DSGdata.OTP = OTP;
					loadingInd = $(".ui-loader");

					loadingInd.show();
					PaymentModel.mPayProcessTransaction(DSGdata, function(result){
						if(loadingInd) {
							loadingInd.hide();
						}
						var errMsg = localize("%shell.error.auth.99%");		
						if(result && result.STATUS_CODE){
							if(result.STATUS_CODE == '01' || result.STATUS_CODE == '02'){
								mobile.changePage(DSGdata.returnURL, {data:DSGdata});
								HapinessMeterRatingModel.showHappinessMeter(true);
								return;
							}else if(result.STATUS_CODE == '1003'){
								errMsg = Globalize.localize("%shell.mPayDetails.Duplicate_service_reference_number%", getApplicationLanguage());
							}else if(result.STATUS_CODE == '1006'){
								errMsg = Globalize.localize("%shell.mPayDetails.Payment_failed%", getApplicationLanguage());
							}else if(result.STATUS_CODE == '1010'){
								errMsg = Globalize.localize("%shell.mPayDetails.Invalid_OTP%", getApplicationLanguage());
							}else if(result.STATUS_CODE == '1018'){
								errMsg = Globalize.localize("%shell.mPayDetails.Maximum_number_of_daily_transactions_exceeded%", getApplicationLanguage());
							}else if(result.STATUS_CODE == '1019'){
								errMsg = Globalize.localize("%shell.mPayDetails.Transaction_expired%", getApplicationLanguage());
							}else if(result.STATUS_CODE == '1020'){
								errMsg = Globalize.localize("%shell.mPayDetails.Transaction_already_processed%", getApplicationLanguage());
							}else{
								errMsg = Globalize.localize("%shell.mPayDetails.Something_went_wrong%", getApplicationLanguage());
							}
						}else{
							errMsg = Globalize.localize("%shell.mPayDetails.Something_went_wrong%", getApplicationLanguage());
						}
						var errorPopup = new Popup("customErrorPopup");
						errorPopup.options.content =errMsg;
						errorPopup.show();
					});
				}
				else{
					if(loadingInd) {
						loadingInd.hide();
					}
					var generalErrorPopup = new Popup('generalErrorPopup');
					generalErrorPopup.show();
				}
			}
		},
		cancelmPay : function (e){
			e.preventDefault();
			window.history.go(-2);
		},
		resendOTPAgain : function(e){
			e.preventDefault();
			if(! _.isEmpty(mpayCodePageviewInstance.DSGdata))
			{
				$("#resendmPayOTP").css("opacity", "1");
				var loadingInd = $(".ui-loader");

				loadingInd.show();

				if(loadThread) {
					window.clearTimeout(loadThread);
					loadThread = null;
				}
				loadThread = window.setTimeout(function() {
					if(loadingInd) {
						loadingInd.hide();
					}
				}, 120000);

				PaymentModel.mPayRegenerateOTP(mpayCodePageviewInstance.DSGdata, function(results){
					if(loadingInd) {
						loadingInd.hide();
					}
					if(isUndefinedOrNullOrBlank(results.isAdapterSuccess)){
						
						var errorPopup = new Popup("customErrorPopup");
						errorPopup.options.content =localize("%shell.error.auth.99%");
						errorPopup.show();
					}

					console.log(results);
				});
			}
			else{
				var generalErrorPopup = new Popup('generalErrorPopup');
				generalErrorPopup.show();
			}
		},
		/**
		 * do any cleanup, remove window binding here
		 * @param none
		 */
		dispose: function() {
			PageView.prototype.dispose.call(this);
		},

	});

	// Returns the View class
	return MPayCodeView;

});