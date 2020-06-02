define(["com/views/PageView",
        "com/views/Header",
        "com/models/shell/AuthenticationModel"
        ], function(  PageView, Header  ,AuthenticationModel) {
	var HelpCenterPage = PageView.extend({
		events: {
			'tap #LiveChatId': 'openLiveChatPage',
			'tap #FeedBackId': 'openFeedBackPage',
			'tap #FrequentlyAskedId': 'openFrequentlyAskedPage',
			'tap #ContactUsId': 'openContactUsPage',
			'tap #PoliceAmbulance': 'callPoliceAmbulance',
			'tap #RoadServices': 'callRoadServices',
			'tap #FireDepartement': 'callFireDepartement',
			'tap #ChatBotId':'openChatBot'
		},
		initialize: function(options) {
			options.phoneTitle = localize("%shell.footer.HelpCenter%");
			options.headerState = Header.STATE_MENU;
			PageView.prototype.initialize.call(this, options);        		
		},
		openChatBot:function(e){
			e.preventDefault();
			mobile.changePage('shell/chat_bot.html');
		},
		callPoliceAmbulance:function(e)
		{
			e.preventDefault();
			window.open("tel:999", '_system');
		},
		callRoadServices:function(e)
		{
			e.preventDefault();
			window.open("tel:80088088", '_system');
		},
		callFireDepartement:function(e)
		{
			e.preventDefault();
			window.open("tel:997", '_system');
		},


		openLiveChatPage:function(e)
		{
			e.preventDefault();

			if (!navigator.onLine){
				showInternetProblemPopup();
				return;
			}
			try { 
				var mChatOpenPopup_Options = {
						popupId: "mChatOpenPopup",
						title: localize("%shell.menu.mchat%"),
						content: localize("%shell.popup.mchat.message%"),
						primaryBtnText: localize("%shell.dialog.button.ok%"),
						primaryBtnCallBack: this.openChatPage,
						primaryBtnDisabled: false,
						secondaryBtnText: localize("%shell.label.cancel%"),
						secondaryBtnCallBack: null,
						secondaryBtnVisible: true,
						secondaryBtnDisabled: false,
						hideOnPrimaryClick: true,
						hideOnSecondaryClick: true,
						aroundClickable: true,
						onAroundClick: null
				}

				var mChatOpenPopup = new Popup(mChatOpenPopup_Options);
				mChatOpenPopup.show();
			}catch(e){$('.ui-loader').hide();}

		},
		openChatPage:function (){
			mobile.changePage('shell/mchat_iframe.html');
		},
		openFeedBackPage:function(e)
		{
			e.preventDefault();
			if(!AuthenticationModel.isAuthenticated()){
				var loginRegisterPopup = new Popup("loginRegisterPopup");
				loginRegisterPopup.show();
			}else {
				mobile.changePage("shell/feedback_form.html");

			}
		},

		openFrequentlyAskedPage:function(e)
		{

			e.preventDefault();
			if (getApplicationLanguage() == 'en') {
				window.open("https://www.rta.ae/wps/portal/rta/ae/contact-us/help-and-support/AllGuides?lang=en", "_system")
			} else {
				window.open("https://www.rta.ae/wps/portal/rta/ae/contact-us/help-and-support/AllGuides?lang=ar", "_system")
			}
			// e.preventDefault();
			// var commingSoonPopup = new Popup("commingSoonPopup");
			// commingSoonPopup.show();
		},

		openContactUsPage:function(e)
		{
			e.preventDefault();
			mobile.changePage("shell/contact_rta.html");
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
	return HelpCenterPage;

});