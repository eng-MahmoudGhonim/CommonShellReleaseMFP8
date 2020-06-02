
/* JavaScript content from js/com/views/shell/MPayDetailsPageView.js in folder common */
define([ 

        "jquery", 
        "backbone",
        "com/views/PageView",
        "com/views/Header",
        "com/models/shell/PaymentModel",
        "com/utils/Utils",
        "com/utils/DataUtils",
        "com/models/shell/HapinessMeterRatingModel"

        ], function( $, Backbone, PageView, Header, PaymentModel,Utils, DataUtils,HapinessMeterRatingModel) {

	var loadingInd = null;
	var loadThread = null;

	// Extends PageView class
	var MPayDetailsPageView = PageView.extend({

		/**
		 * The View Constructor
		 * @param el, DOM element of the page
		 **/
		events: {
			'pageshow': 'onPageShow',
			'tap #Continue-btn':'registerTrasnation',
			'tap #CancelLink':'cancelTransaction',
			'tap #registerId':'registerMPay',

		},
		initialize: function(options)
		{
			options.hideHeader = false;
			options.hideSidePanel = true;
			options.phoneTitle = "";
			options.headerState = Header.STATE_SIMPLE;
			mpayDetailsPageViewInstance = this ;
			mpayDetailsPageViewInstance.options = options ;
			PageView.prototype.initialize.call(this, options);


			options.phoneTitle = Globalize.localize("%shell.payment.title%", getApplicationLanguage());

			PageView.prototype.initialize.call(this, options);
			try{
				var amount = "";
				var paymentData  = options.data ;
				if(! isUndefinedOrNullOrBlank(paymentData) &&  ! isUndefinedOrNullOrBlank(paymentData.AMOUNT)){
					amount = options.data.AMOUNT ; 
					if(!isUndefinedOrNullOrBlank(amount)){
						$('.mPayAmount').text(amount);
					}else{
						$(".mPayAmountDetails").addClass("hidden");
					}
				}else if (! isUndefinedOrNullOrBlank(paymentData) && ! isUndefinedOrNullOrBlank(paymentData.EDATA)){
					$(".ui-loader").show();
					PaymentModel.decryptmPayAmount(paymentData,function(result){
						$(".ui-loader").hide();
						amount = result;
						if(! isUndefinedOrNullOrBlank(amount)){
							$(".mPayAmountDetails").removeClass("hidden");
							$('.mPayAmount').text(amount);
						}else{
							$(".mPayAmountDetails").addClass("hidden");
						}
					},function(e){
						$(".ui-loader").hide();
					});
				}
			}catch(e){
				console.log(e);
			}
		},
		onPageShow:function(){
			var self=this;
			var options={
					direction:(getApplicationLanguage()=='en') ? "ltr": "rtl",
							element:document.getElementById("mpayStepper"),
							enablePages:true
			}
			mpayDetailsPageViewInstance.stepper = new Stepper(options);
			var options={
					direction:(getApplicationLanguage()=='en') ? "ltr": "rtl",
							element:document.getElementById("mpayPinInput"),
							autoClearFocus:true
			}
			mpayDetailsPageViewInstance.pinInput = new PinInput(options);
			mpayDetailsPageViewInstance.pinInput.onchange=mpayDetailsPageViewInstance.updatePayBtn;

			document.getElementById("OTPButton").onclick = function(event){
				mpayDetailsPageViewInstance.registerTrasnation(event);
			};
			document.getElementById("RegistermPayButton").onclick = function(event){
				mpayDetailsPageViewInstance.registerMPay(event);
			};

			document.getElementById("PayButton").onclick = function(event){
				mpayDetailsPageViewInstance.processmPayTransaction(event);
			};
			document.getElementById("ResendOTPButton").onclick = function(event){
				mpayDetailsPageViewInstance.resendOTPAgain(event);
			};


			mpayDetailsPageViewInstance.usernameValidator = new Validator(document.querySelector("#userNameField"), {
				validations: [
				              {
				            	  regEx: "empty",
				            	  errorMessage: localize("%shell.mpay.validation.username.required%"),
				            	  order: 0
				              },
				              {
				            	  regEx: "email",
				            	  errorMessage: localize("%shell.mpay.validation.username.notcorect%"),
				            	  order: 1
				              }
				              ],
				              onValidate: mpayDetailsPageViewInstance.updateContinueBtn
			});


		},
		updateContinueBtn:function (){

			if (mpayDetailsPageViewInstance.usernameValidator.isValid) {
				document.getElementById("OTPButton").className = "shell-button waves-effect";
			} else {
				document.getElementById("OTPButton").className = "shell-button waves-effect disabled";
			}
		},
		updatePayBtn:function (){	
			if (mpayDetailsPageViewInstance.pinInput.isVaild()) {
				document.getElementById("PayButton").className = "shell-button waves-effect";
			} else {
				document.getElementById("PayButton").className = "shell-button waves-effect disabled";
			}
		},
		registerMPay : function(event){
			event.preventDefault();
			var registerWin = window.open("http://mpay.dubai.ae/userPortal", '_system');
			registerWin.focus();
		},
		cancelTransaction : function (event){
			event.preventDefault();
			history.back();
		},
		registerTrasnation : function(event){
			event.preventDefault();
			var self=this;

//			if(!$("#mpayUsername").valid()){
			var mPayAccount = $('input[id=username_input]').val();
			mpayDetailsPageViewInstance = this;
			var data = mpayDetailsPageViewInstance.options.data;
			data.CUSTOMER_ACCOUNT = mPayAccount;

			loadingInd = $(".ui-loader");

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

			PaymentModel.mPayRegisterTransaction(data, function(result){
				var errMsg = localize("%shell.error.auth.99%");

				if(result && result.STATUS_CODE){
					if(result.STATUS_CODE == '01' || result.STATUS_CODE == '02'){
						data.TRX_ID = result.TRX_ID;
						data.TIMESTAMP = result.TIMESTAMP;
						if(loadingInd) {
							loadingInd.hide();
						}
//						DataUtils.setLocalStorageData('paymentData',JSON.stringify(data),true,'shell');

						mpayDetailsPageViewInstance.DSGdata = {} ;
						for (var key in data) {
							if (data.hasOwnProperty(key)) {
								mpayDetailsPageViewInstance.DSGdata[key] = Utils.replacePlusSigns(data[key]);
							}
						}
						mpayDetailsPageViewInstance.pinInput.clear()
						mpayDetailsPageViewInstance.stepper.activateStep(1);

						setTimeout(function(){ 	document.getElementById("mpayPinInput").getElementsByTagName("input")[0].focus(); }, 600);
						//mobile.changePage("shell/mPay_code.html", {data:data});
						return;
					}else if(result.STATUS_CODE == '1003'){
						errMsg = localize("%shell.mPayDetails.Duplicate_service_reference_number%");
					}else if(result.STATUS_CODE == '1007'){
						//errMsg = localize("%shell.mPayDetails.Account_wallet_payment_is_disabled%");
						
						if(loadingInd) {
							loadingInd.hide();
						}
						
						var errorWalletPopup = new Popup("mpayWalletBlockedPopup");
						
						setTimeout(function() {
							errorWalletPopup.show();
						}, 600);
						history.back();
						return;
					}else if(result.STATUS_CODE == '1011'){
						//errMsg = localize("%shell.mPayDetails.Invalid_customer_account%");
						
						if(loadingInd) {
							loadingInd.hide();
						}
						
						var errorNotFoundPopup = new Popup("mpayUserNotFoundPopup");
						
						setTimeout(function() {
							errorNotFoundPopup.show();
						}, 600);
						history.back();
						return;
						
					}else if(result.STATUS_CODE == '1018'){
						errMsg = localize("%shell.mPayDetails.Maximum_number_of_daily_transactions_exceeded%");
					}else if(result.STATUS_CODE == '1019'){
						errMsg = localize("%shell.mPayDetails.Transaction_expired%");
					}else if(result.STATUS_CODE == '1020'){
						errMsg = localize("%shell.mPayDetails.Transaction_already_processed%");
					}else{
						errMsg = localize("%shell.mPayDetails.Something_went_wrong%");
					}
				}else{
					errMsg = Globalize.localize("%shell.mPayDetails.Something_went_wrong%", getApplicationLanguage());
				}

				if(loadingInd) {
					loadingInd.hide();
				}
				var errorPopup = new Popup("customErrorPopup");
				errorPopup.options.content =errMsg;
				errorPopup.show();
				history.back();
			}); 
//			}
		},
		processmPayTransaction : function(e){
			e.preventDefault();
			try {
				var self=this;
//				if($("#mPayOTPForm").valid()){
				var OTP = mpayDetailsPageViewInstance.pinInput.value;
				if(! _.isEmpty(mpayDetailsPageViewInstance.DSGdata))
				{
					DSGdata = mpayDetailsPageViewInstance.DSGdata;
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
			}catch(e){}
		},
		resendOTPAgain : function(e){
			e.preventDefault();
			if(! _.isEmpty(mpayDetailsPageViewInstance.DSGdata))
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

				PaymentModel.mPayRegenerateOTP(mpayDetailsPageViewInstance.DSGdata, function(results){
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
			delete mpayDetailsPageViewInstance;
			PageView.prototype.dispose.call(this);

		},

	});

	// Returns the View class
	return MPayDetailsPageView;

});