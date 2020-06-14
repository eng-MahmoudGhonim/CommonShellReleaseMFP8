Function.prototype.clone = function() {
  var that = this;
  var temp = function temporary() {
    return that.apply(this, arguments);
  };
  for (var key in this) {
    if (this.hasOwnProperty(key)) {
      temp[key] = this[key];
    }
  }
  return temp;
};
define([
  "com/views/PageView",
  "com/models/Constants",
  "com/utils/Utils",
  "com/utils/DataUtils",
  "com/views/Header",
  "com/models/shell/UserProfileModel",
  "com/models/shell/AuthenticationModel"
], function(
  PageView,
  Constants,
  DataUtils,
  Header,
  UserProfileModel,
  AuthenticationModel
) {
  // Extends PageView class
  var MChatPageView = PageView.extend({
    events: {
      pageshow: "onPageShow",
      "tap .closeContainer": "closeIFrame"
    },
    initialize: function(options) {
      MChatPageViewInstance = this;
      var iframe = DataUtils.getLocalStorageData("iframeURL", "shell");
      DataUtils.removeFromLocalStorage("iframeURL", "shell");
      if (!options) {
        options = {};
      }
      options.headerState = Header.STATE_MENU;
      options.phoneTitle = Globalize.localize(
        "%shell.FOOTER.MCHAT%",
        getApplicationLanguage()
      );
      PageView.prototype.initialize.call(this, options);
      var content =
        "<div>" +
        Globalize.localize(
          "%shell.mchat.leaveChatPopup.contentPart1%",
          getApplicationLanguage()
        ) +
        "</div><br/><div>" +
        Globalize.localize(
          "%shell.mchat.leaveChatPopup.contentPart2%",
          getApplicationLanguage()
        ) +
        "</div>";
      var options = {
        popupId: "leaveChatPopup",
        title: localize("%shell.mchat.leaveChatPopup.title%"),
        content: content,
        primaryBtnText: localize("%shell.mchat.leaveChatPopup.okBtn%"),
        primaryBtnCallBack: null,
        primaryBtnDisabled: false,
        secondaryBtnText: localize("%shell.mchat.leaveChatPopup.cancelBtn%"),
        secondaryBtnCallBack: function() {
          //						MobileRouter.getFooter().fixFooterIcons('mChatLink');
        },
        secondaryBtnVisible: true,
        secondaryBtnDisabled: false,
        hideOnPrimaryClick: true,
        hideOnSecondaryClick: true,
        aroundClickable: true,
        onAroundClick: null
      };
      MChatPageViewInstance.leaveChatPopup = new Popup(options);
    },
    onPageShow: function(e) {
      e.preventDefault();
      //			MobileRouter.getFooter().fixFooterIcons('mChatLink');
      MChatPageViewInstance = this;
      //window.open(MChatPageViewInstance.URL, "iframeSource");
      $(".ui-loader").show();
      document
        .getElementById("chatiFrame")
        .contentWindow.location.replace(this.getChatURL());
      $("iframe").load(function() {
        // do something once the iframe is loaded
        $(".ui-loader").hide();
        $("#closeContainer").removeClass("hidden");
        document.activeElement.blur();
      });
    },
    closeIFrame: function(e) {
      e.preventDefault();
      mobile.changePage(MChatPageViewInstance.previousURL);
      /*if(window.frames['iframeSource'].location.href.indexOf('ePayReceiver/EpayRedirect') != -1 )
				mobile.changePage(MChatPageViewInstance.previousURL,{data:{ePayComplete:true}});
			else{
				mobile.changePage(MChatPageViewInstance.previousURL,{data:{ePayComplete:false}});
			}*/
    },
    onCloseChat: function(url) {
      MChatPageViewInstance.exitUrl = url;
      MChatPageViewInstance.leaveChatPopup.options.primaryBtnCallBack = function() {
        history.back = MChatPageViewInstance.back;
        mobile.changePage = MChatPageViewInstance.changePage;
        mobile.changePage(MChatPageViewInstance.exitUrl);
      };
      MChatPageViewInstance.leaveChatPopup.show();
    },
    onBack: function() {
      MChatPageViewInstance.leaveChatPopup.options.primaryBtnCallBack = function() {
        history.back = MChatPageViewInstance.back;
        mobile.changePage = MChatPageViewInstance.changePage;
        history.back();
      };
      MChatPageViewInstance.leaveChatPopup.show();
    },
    getChatURL: function() {
      //    	EN: https://chat.rta.ae/RtaAppChat/web/livechat?lang=en&name=Ahmed%20Mohamed&email=rtatestacc@gmail.com&phone=00971501234567&appname=dubaidrive&ver=6.5.1

      var chatOpened = false;
      //Get language info
      var lang = getApplicationLanguage();
      var chatURL = "";
      var skill = "",
        //ver = WL.Client.getAppProperty("APP_VERSION"),
        ver = utils.APP_VERSION,//WL.Client.getAppProperty("APP_VERSION"),
        appname = "";
      if (Constants.APP_ID == "RTA_Drivers_And_Vehicles") {
        appname = "Dubaidrive";
        if (lang == "en") {
          skill = "WC_Driver_Vehicle_License_Eng";
        } else {
          skill = "WC_Driver_Vehicle_License_Arab";
        }
      } else if (Constants.APP_ID == "RTA_Corporate_Services") {
        appname = "corporate";
        if (lang == "en") {
          skill = "WC_Business_Corp_Services_Eng";
        } else {
          skill = "WC_Business_Corp_Services_Arab";
        }
      } else if (Constants.APP_ID == "RTA_Public_Transport") {
        appname = "pta";
        if (lang == "en") {
          skill = "WC_Public_Trans_Serv_English";
        } else {
          skill = "WC_Public_Trans_Serv_Arabic";
        }
      } else if (Constants.APP_ID == "Smart_Dubai_Parking") {
        if (lang == "en") {
          skill = "WC_Parking_English";
        } else {
          skill = "WC_Parking_Arabic";
        }
      } else {
        if (lang == "en") {
          skill = "WC_General_Inquiry_English";
        } else {
          skill = "WC_General_Inquiry_Arabic";
        }
      }
      //Get user info
      var user_id = "";
      try {
        var userInfo = UserProfileModel.getUserProfile().Users[0];
        user_id = userInfo.user_id;
        var name = userInfo.first_name_en + " " + userInfo.last_name_en;
        var email = userInfo.mail;
        var phone = userInfo.mobile;
      } catch (e) {}

      //			user_id = "islammohamed12";
      //			var name = "islam";
      //			var email = "islammohamed12@gmail.com";
      //			var phone = "00971569782178";
      ver = "3.5";
      if (user_id) {
        chatURL =
          Constants.CHAT_URL +
          "?" +
          encodeURI(
              "lang=" +
              lang +
              "&name=" +
              name +
              "&email=" +
              email +
              "&phone=" +
              phone +
              "&skillset=" +
              skill +
              "&appname=" +
              appname+
              "&ver=3.5"
          );

        //				chatURL = Constants.CHAT_URL + '?' + encodeURI('mobile=' + 'true' + '&lang=' + lang + '&name=' + name + '&email=' + email + '&skill=' + skill + '&phone=' + phone+ '&ver=' + ver+ '&appname=' + appname);

        //				chatURL = mobile.baseUrl + '/pages/shell/chat_landing_page.html' + '?' + encodeURI('URL='+Constants.CHAT_URL+'&mobile=' + 'true' + '&lang=' + lang + '&name=' + name + '&email=' + email + '&skill=' + skill + '&phone=' + phone+ '&ver=' + ver+ '&appname=' + appname);
      } else {
        chatURL =
          Constants.CHAT_URL +
          "?" +
          encodeURI(
              "lang=" +
              lang +"&name=&email=&phone="+
              "&skillset=" +
              skill +
              "&appname=" +
              appname+
              "&ver=3.5"
          );
      }
      console.log("Chat URL is : ");
      console.log(chatURL);
      return chatURL;
    },
    logoutChat: function() {
      $.post("https://chat.rta.ae/rta-chat/web/operations", {
        agentAccepted: "true",
        operation: "closeChat"
      })
        .done(function(result, status) {
          console.log("success to log out");
        })
        .fail(function(error) {
          console.log("falied to log out");
        });
    },
    dispose: function() {
      //			history.back = MChatPageViewInstance.back;
      //			mobile.changePage = MChatPageViewInstance.changePage
      this.logoutChat();
      delete MChatPageViewInstance;
      PageView.prototype.dispose.call(this);
    }
  });
  // Returns the View class
  return MChatPageView;
});
