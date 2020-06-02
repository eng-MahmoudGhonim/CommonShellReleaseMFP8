define(["com/views/PageView", "com/views/Header","com/models/shell/UserProfileModel"], function(PageView, Header,UserProfileModel) {
    var ChatBotPageView = PageView.extend({
        events: {
            'pageshow': 'onPageShow',
            'tap #cancelChatbot': 'cancelChatbot'
        },
        initialize: function(options) {
        	ChatBotPageViewInstance = this;
            options.headerState = Header.STATE_MENU;
            options.phoneTitle = localize("Chat Bot");
            options.hideHeader = true;
			options.hideFooter = true;
            PageView.prototype.initialize.call(this, options);

        },
        cancelChatbot: function() {
			history.back();
		},

    	getChatURL: function() {
    		

			var chatOpened = false;
			//Get language info
			var lang = getApplicationLanguage();
			var chatURL = '';
			
			//Get user info
			var user_id = "";
			try {
				var userInfo = UserProfileModel.getUserProfile().Users[0];
				user_id = userInfo.user_id;
				var name = userInfo.first_name_en + " " + userInfo.last_name_en;
				var email = userInfo.mail;
				var phone = userInfo.mobile;
			} catch (e) {}
			if (user_id) {
				chatURL = "https://uat-rta-chat-bot.eu-de.mybluemix.net/"+'?'+ encodeURI('name='+name+'&email='+email+'&phone='+phone+'&appname=rtadubai')
			} else {
				chatURL = "https://uat-rta-chat-bot.eu-de.mybluemix.net/"+'?'+ encodeURI('appname=rtadubai');// guest url
			}
			return chatURL;
		
    	},
        onPageShow: function(e) {
        	
        	e.preventDefault();
			MChatPageViewInstance = this;
			$(".ui-loader").show();
			document.getElementById("chatBotiFrame").contentWindow.location.replace(this.getChatURL())
			$("iframe").load(function() {
				// do something once the iframe is loaded
				$(".ui-loader").hide();
				/*$("#closeContainer").removeClass("hidden");*/
				document.activeElement.blur();
			});
        },
        dispose: function() {
            PageView.prototype.dispose.call(this);
        }
    });
    return ChatBotPageView;
});