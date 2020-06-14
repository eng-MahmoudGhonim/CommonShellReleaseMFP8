
/* JavaScript content from js/com/views/shell/FeedbackFormPageView.js in folder common */

/* JavaScript content from js/com/views/shell/FeedbackFormPageView.js in folder common */
define(["com/views/PageView",
        "com/views/Header",
        "com/utils/Utils",
        "com/utils/UserUtils",
        "com/models/Constants",
        "com/models/shell/FeedbackFormModel",
		 "com/models/shell/CaptchaModel"
        ], function(PageView, Header, Utils, UserUtils,Constants, FeedbackFormModel,CaptchaModel) {
	var loadingHandlerThread = null;
	var FeedbackFormPageView = PageView.extend({
		events: {
					pageshow: "onPageShow"
				},
		initialize: function(options)
		{
			feedbackFormPageViewInstance=this;
			options.phoneTitle = localize("%shell.footer.HelpCenter%");
			options.subTitle=localize("%shell.sendfeedback.title%");
			options.headerState = Header.STATE_MENU;

			PageView.prototype.initialize.call(this, options);


			this.$el.on("change", "#selectFeedbackChoice", function(event) {
				event.preventDefault();
				if(document.getElementById('feedbackText').value.length <= 500 && document.getElementById('feedbackText').value.length > 20 && $('#selectFeedbackChoice').val() != "pleaseselect"&& $('#selectFeedbackChoice').val() != null&&feedbackFormPageViewInstance.newCaptch.isValid){
					document.getElementById("sendFeedbackBtn").classList.remove('disabled');
				}else {
					document.getElementById("sendFeedbackBtn").classList.add('disabled');
				}
			});

			this.$el.on("keyup", "#feedbackText", function(event) {
				if(this.value.length <= 500 && this.value.length > 20 && $('#selectFeedbackChoice').val() != "pleaseselect"&& $('#selectFeedbackChoice').val() != null&&feedbackFormPageViewInstance.newCaptch.isValid){
					document.getElementById("sendFeedbackBtn").classList.remove('disabled');
				}else {
					document.getElementById("sendFeedbackBtn").classList.add('disabled');
				}
			});

			this.$el.on("tap", "#sendFeedbackBtn", function(event) {
				try{
					event.preventDefault();
					document.activeElement.blur();

					$(".ui-loader").show();
					loadingHandlerThread = window.setTimeout(function() {
						$(".ui-loader").hide();
						loadingHandlerThread = null;
					}, 90000);

					var userInfo = {};
					try {
						userInfo = UserUtils.getUserProfile().Users[0];
					}
					catch(e) {}

					var feedbackContent = {};
					feedbackContent.Name = userInfo.first_name_en + " " + userInfo.last_name_en;
					feedbackContent.Mobile = userInfo.mobile;
					feedbackContent.EmailAddress = userInfo.mail;
					feedbackContent.CaseType = $('#selectFeedbackChoice').val();
					feedbackContent.Message = $('textarea[id=feedbackText]').val();

					if(typeof device != "undefined" && device){
						feedbackContent.DeviceModel = device.model;
						feedbackContent.DeviceOS = device.platform;
						feedbackContent.OSVersion = device.version;
					}
					//feedbackContent.AppVersion = WL.Client.getAppProperty("APP_VERSION");
          feedbackContent.AppVersion = Utils.APP_VERSION;// WL.Client.getAppProperty("APP_VERSION");


					feedbackContent.ApplicationID=Constants.APP_ID ;
					// after press update
					var captcha={
							"key":feedbackFormPageViewInstance.newCaptch.captchaKey,
							"userAnswerId":feedbackFormPageViewInstance.newCaptch.captchaAnswer,
							"type":feedbackFormPageViewInstance.newCaptch.captchaType,
					}

					var captchaObject=JSON.stringify(captcha);


					FeedbackFormModel.submitFeedback(feedbackContent,captchaObject,feedbackFormPageViewInstance._getdata);

				}catch(e){
					$(".ui-loader").hide();
					var generalErrorPopup = new Popup('generalErrorPopup');
					generalErrorPopup.show();
				}
			});
			this.$el.on("pageshow", function(){

				var param = $(this).data("url").split("?")[1];
				$('#feedbackLbl').html(param);

				var userInfo = {};
				try {
					userInfo = UserUtils.getUserProfile().Users[0];
					document.getElementById('firstName').value = userInfo.first_name_en;
					document.getElementById('lastName').value = userInfo.last_name_en;
					document.getElementById('email').value = userInfo.mail;
				}
				catch(e) {}

//				$('#nameLbl').html(userInfo.first_name_en + " " + userInfo.last_name_en);
//				$('#mobileLbl').html(userInfo.mobile);
//				$('#emailLbl').html(userInfo.mail);
			});
		},
onPageShow: function() {
// start call captcha
var captchaOptions = {
					lang: getApplicationLanguage(),
					captchaModel: CaptchaModel,
					serviceName:"Feedback",
					onChange: function() {
						if(document.getElementById('feedbackText').value.length <= 500 && document.getElementById('feedbackText').value.length > 20 && $('#selectFeedbackChoice').val() != "pleaseselect"&& $('#selectFeedbackChoice').val() != null&&feedbackFormPageViewInstance.newCaptch.isValid){
							document.getElementById("sendFeedbackBtn").classList.remove('disabled');
						}else {
							document.getElementById("sendFeedbackBtn").classList.add('disabled');
						}
					}
			};

			feedbackFormPageViewInstance.newCaptch = new captcha(captchaOptions);

			//End call captcha

		},
		dispose: function() {
			PageView.prototype.dispose.call(this);
		},

		_getdata: function(myFlag){
			if(loadingHandlerThread) {
				window.clearTimeout(loadingHandlerThread);
				loadingHandlerThread = null;
			}

			$(".ui-loader").hide();

			if(myFlag == true){

				var successFeedbackPopup_Options = {
						popupId: "successFeedbackPopup",
						title:localize("%shell.feedback.success.title%"),
						content: localize("%shell.feedback.success.message%"),
						primaryBtnText:  localize("%shell.dialog.button.ok%"),
						primaryBtnCallBack: function(){
							mobile.changePage("shell/home.html");
						},
						primaryBtnDisabled: false,
						secondaryBtnText: null,
						secondaryBtnCallBack: null,
						secondaryBtnVisible: false,
						secondaryBtnDisabled: false,
						hideOnPrimaryClick: true,
						hideOnSecondaryClick: true,
						aroundClickable: true,
						onAroundClick:  function(){
							mobile.changePage("shell/home.html");
						}
				}

				var successFeedbackPopup = new Popup(successFeedbackPopup_Options);
				successFeedbackPopup.show();
				$("#facebookImg").click(function(event){
					event.preventDefault();
					var fbWindow = window.open("http://www.facebook.com/rtadubai",'_system');
				});
				$("#twitterImg").click(function(event){
					event.preventDefault();
					var twitterWindow = window.open("http://twitter.com/RTA_Dubai",'_system');
				});
			}
			else{
				var customHomeErrorPopup = new Popup("customHomeErrorPopup");
				customHomeErrorPopup.options.content=localize("%shell.feedback.UnableToSendFeedback%");
				customHomeErrorPopup.show();
			}
		}

	});

	// Returns the View class
	return FeedbackFormPageView;

});
