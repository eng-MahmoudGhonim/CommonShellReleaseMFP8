define([

        "jquery",
        "backbone",
        "com/views/PageView",
        "com/views/Footer",
        "com/views/Header",
        "com/models/Constants",
        "com/utils/DataUtils",
        "com/models/shell/MessagesModel",
        "com/models/shell/UserProfileModel",
        "com/utils/UserUtils"

        ], function( $, Backbone, PageView, Footer,Header, Constants, DataUtils, Message, UserProfileModel,UserUtils ) {

	var MessagesPageView = PageView.extend({

		/**
		 * The View Constructor
		 * @param el, DOM element of the page
		 */
		template:{},
		events: {
			'pageshow':	'onPageShow',
			'tap #loadMore' : 'loadMore',
			'change .ui-radio input':'checkRadioSwitchedChanged',
			'change [type="checkbox"]':'checkBoxSwitchedChanged',
			'tap #delete_message' :'deleteNotificationMessage',
			'tap #unread_message' :'makeUnreadMessage',
			'tap #read_message' : 'makeReadMessage'
		},
		initialize: function(options)
		{
			PageView.prototype.initialize.call(this);


			options.phoneTitle = Globalize.localize("%shell.messages.title%", getApplicationLanguage());
			options.headerState = Header.STATE_MENU;
			PageView.prototype.initialize.call(this, options);
			messagesPageViewInstance= this;
			messagesPageViewInstance.messages_user_id = "";
			messagesPageViewInstance.messageList = null;
			messagesPageViewInstance.language = getApplicationLanguage();
			if(!isUndefinedOrNullOrBlank(UserProfileModel.getUserProfile())){
				messagesPageViewInstance.messages_user_id = UserProfileModel.getUserProfile().Users[0].user_id;
			}

			messagesPageViewInstance.requesttimes = 0;
		},
		onPageShow : function(event){
			event.preventDefault();
			messagesPageViewInstance = this;
			//Highlight icon in footer
//			MobileRouter.getFooter().fixFooterIcons('msgFooterLink');
			if(messagesPageViewInstance.language =='en'){
				$('#allBtnArrow').hide();
				$('#unreadBtnArrow').show()
			}
			else{
				$('#allBtnArrow').show();
				$('#unreadBtnArrow').hide()
			}
			var timeStamp = DataUtils.getLocalStorageData('rtaMessagesSaveTimeStamp', 'shell');
			$(".ui-loader").show();
			$("#messagesList").empty();
			$("#messagesList").listview("refresh");
			//MGRT71
      //	WL.Device.getNetworkInfo(function (networkInfo) {
  			//	if(networkInfo && networkInfo.isNetworkConnected == "true"){
        if(Utils.IS_NETWORK_CONNECTED==true){
					messagesPageViewInstance.getRecentMessages(timeStamp,function(list) {
						messagesPageViewInstance.messageList = list;
						messagesPageViewInstance.render();
					});
				} else {
					messagesPageViewInstance.loadCachedMessages(function(list) {
						messagesPageViewInstance.messageList = list;
						messagesPageViewInstance.render();
					});
				}
			//});
		},
		loadMore : function(event){
			event.preventDefault();
			startIndex = messagesPageViewInstance.messageList.length;
			var numberOfRecords = 20;
			if (startIndex <20)
				startIndex++;
			Message.getOldNotifications(messagesPageViewInstance.messages_user_id, startIndex, numberOfRecords, function(result) {
				if(result && result.invocationResult && result.invocationResult.resultSet && result.invocationResult.resultSet.length > 0) {
					messagesPageViewInstance.messageList = messagesPageViewInstance.messageList.concat(result.invocationResult.resultSet);
					$("#messagesList").empty();
					$("#messagesList").listview("refresh");
					if($("#radioSwitcher :radio:checked").val() == '1'){
						messagesPageViewInstance.render();
					}
					else{
						messagesPageViewInstance.render();
					}
				}
			});
		},
		checkBoxSwitchedChanged : function(event){
			if(event){
				event.preventDefault();
			}
			var checkedTab = $("#radioSwitcher :checked").attr('id');
			var checkedItem = null;
			if(event.target.id == "selectall-spanChecked"){
				if (event.target.checked == true)
				{
					$(".messageList-checkbox").prop("checked", true);
					$(".messageList-checkbox").checkboxradio('refresh');
					checkedItem = "selectall-checkbox";
				}
				else{
					$(".messageList-checkbox").prop("checked", false);
					$(".messageList-checkbox").checkboxradio('refresh');
				}
				messagesPageViewInstance.getNotificationHandlerIcon(checkedTab,checkedItem);
			}
			else if($(event.target).hasClass("messageList-checkbox")){

				var checkedbox= $('#messagesList :checkbox:checked');
				if ($('#messagesList :checkbox:checked').length == $('#messagesList li').length){
					$("#selectall-spanChecked").prop("checked", true);
					$("#selectall-spanChecked").checkboxradio('refresh');
				}else{
					$("#selectall-spanChecked").prop("checked", false);
					$("#selectall-spanChecked").checkboxradio('refresh');
				}
				if(event.target.checked == true)
					checkedItem = "messagelistItem";
				messagesPageViewInstance.getNotificationHandlerIcon(checkedTab,checkedItem);
			}
		},
		deleteNotificationMessage : function(event){
			event.preventDefault();
			messagesPageViewInstance.deletedMessages = [];
			try{
				var checkedbox= $('#messagesList :checkbox:checked');
				for(var i=0; i<checkedbox.length;i++){
					var selectedIndex= messagesPageViewInstance.getSelectedMessageIndex(i);
					var selectedMessage = messagesPageViewInstance.messageList[selectedIndex];
					selectedMessage["index"] = selectedIndex;
					messagesPageViewInstance.deletedMessages.push(selectedMessage);
				}
				messagesPageViewInstance.deleteAlert();
			}catch (e){}
		},
		makeUnreadMessage : function(event){
			event.preventDefault();
			try{

				var checkedbox= $('#messagesList :checkbox:checked');
				if(checkedbox.length>0){
					$(".ui-loader").show();
					messagesPageViewInstance.requesttimes=checkedbox.length;
					for(var i=0; i<checkedbox.length;i++){
						var selectedIndex= messagesPageViewInstance.getSelectedMessageIndex(i);
						var selectedMessage = messagesPageViewInstance.messageList[selectedIndex];
						messagesPageViewInstance.setMessageRead(selectedMessage.id,messagesPageViewInstance.messageList[i].status ,messagesPageViewInstance.messageList[i].Users_id);
					}

				}
			}catch (e){}
		},
		makeReadMessage  : function(event){
			event.preventDefault();
			try{
				var checkedbox= $('#messagesList :checkbox:checked');
				if(checkedbox.length>0){
					$(".ui-loader").show();
					messagesPageViewInstance.requesttimes=checkedbox.length;
					for(var i=0; i<checkedbox.length;i++){
						var selectedIndex= messagesPageViewInstance.getSelectedMessageIndex(i);
						var selectedMessage = messagesPageViewInstance.messageList[selectedIndex];
						messagesPageViewInstance.setMessageUnread(selectedMessage.id,messagesPageViewInstance.messageList[i].status ,messagesPageViewInstance.messageList[i].Users_id);
					}

				}
			}catch (e){}
		},
		deleteAlert: function(){
			try{

				var deleteMessagesPopup_Options = {
						popupId: "deleteMessagesPopup",
						title:localize("%shell.messages.delete.alert.title%"),
						content: localize("%shell.messages.delete.alert.text%"),
						primaryBtnText:  localize("%shell.option.yes%"),
						primaryBtnCallBack: function(){
							messagesPageViewInstance.deleteMessages();
						},
						primaryBtnDisabled: false,
						secondaryBtnText: localize("%shell.option.no%"),
						secondaryBtnCallBack: function (){
							messagesPageViewInstance.checkRadioSwitchedChanged();

						},
						secondaryBtnVisible: true,
						secondaryBtnDisabled: false,
						hideOnPrimaryClick: true,
						hideOnSecondaryClick: true,
						aroundClickable: true,
						onAroundClick: null
				}

				var deleteMessagesPopup = new Popup(deleteMessagesPopup_Options);
				deleteMessagesPopup.show();
			}catch(e){}
		},

		setMessageUnread:function (msgId, status, Users_id){
			$(".ui-loader").show();
			Message.setMessageUnread(msgId, status, Users_id, function(result) {
				var dateNow = new Date();
				var cachedMessages = DataUtils.getLocalStorageData("rtaMessages", "shell");
				try{
					var cached = JSON.parse(cachedMessages);

					DataUtils.setLocalStorageData("rtaMessages",JSON.stringify(cached),false,"shell");
				}
				catch(e) {
					console.log(e);
				}
				messagesPageViewInstance.requesttimes--;
				if(messagesPageViewInstance.requesttimes==0){
					$(".ui-loader").hide();
					messagesPageViewInstance.checkRadioSwitchedChanged();
				}
				$(".ui-loader").hide();
			});
		},
		setMessageRead:function (msgId, status, Users_id){
			$(".ui-loader").show();
			Message.setMessageRead(msgId, status,Users_id, function(result) {
				var dateNow = new Date();
				var cachedMessages = DataUtils.getLocalStorageData("rtaMessages", "shell");
				try{
					var cached = JSON.parse(cachedMessages);
					DataUtils.setLocalStorageData("rtaMessages",JSON.stringify(cached),false,"shell");
				}
				catch(e) {
					console.log(e);
				}
				messagesPageViewInstance.loadCachedMessages(function(list) {
					messagesPageViewInstance.messageList = list;
				});
				messagesPageViewInstance.requesttimes--;
				if(messagesPageViewInstance.requesttimes==0){
					$(".ui-loader").hide();
					messagesPageViewInstance.checkRadioSwitchedChanged();
				}
				$(".ui-loader").hide();
			});
		},
		getSelectedMessageIndex:function (i){
			return $($($('#messagesList :checkbox:checked')[i]).parent().parent().parent().parent()).attr('id').split('_')[1];
		},
		getMessageStatus:function(selectedIndex){
			if(selectedIndex instanceof Object){
				return selectedIndex.status;
			}
			// 1 for read and 0 for unread
			return messagesPageViewInstance.messageList[selectedIndex].status;
		},
		checkRadioSwitchedChanged:function (event){
			if(event){
				event.preventDefault();
			}
			$("#selectall-spanChecked").prop("checked", false);
			$("#selectall-spanChecked").checkboxradio('refresh');
			$(".notification-handlers-images").addClass("hidden");
			if($("#radioSwitcher :radio:checked").val() == '0'){
				$(".ui-loader").show();
				if(messagesPageViewInstance.language=='en'){
					$('#allBtnArrow').hide();
					$('#unreadBtnArrow').show()
				}
				else{
					$('#allBtnArrow').show();
					$('#unreadBtnArrow').hide()
				}

				$("#messagesList").empty();
				$("#messagesList").listview("refresh");
				messagesPageViewInstance.render();
			}
			else {
				if(messagesPageViewInstance.language =='en'){
					$('#allBtnArrow').show();
					$('#unreadBtnArrow').hide()
				}
				else{
					$('#allBtnArrow').hide();
					$('#unreadBtnArrow').show()
				}

				$("#messagesList").empty();
				$("#messagesList").listview("refresh");

				var timeStamp = DataUtils.getLocalStorageData('rtaMessagesSaveTimeStamp', 'shell');
				if(timeStamp == null || timeStamp == 0) {
					$(".ui-loader").show();
					messagesPageViewInstance.getAllMessages(messagesPageViewInstance.messages_user_id, function(list) {
						messagesPageViewInstance.messageList = list;
						messagesPageViewInstance.render();
					});
				}
				else {
					$(".ui-loader").show();
					messagesPageViewInstance.loadCachedMessages(function(list) {
						messagesPageViewInstance.messageList = list;
						messagesPageViewInstance.render();
					});
					messagesPageViewInstance.getRecentMessages(timeStamp, function(list) {
						$("#messagesList").empty();
						$("#messagesList").listview("refresh");
						messagesPageViewInstance.messageList = list;
						messagesPageViewInstance.render();
					});
				}
			}
		},

		deleteMessages:function (){
			var deletedMessages = messagesPageViewInstance.deletedMessages ;
			if(! isUndefinedOrNullOrBlank(deletedMessages) && deletedMessages.length > 0){
				var loadingInd = $(".ui-loader");
				loadingInd.show();
				var i = 0 ;
				var messagesLength = deletedMessages.length;
				for(i ; i<messagesLength ;i++){
					var msgId = deletedMessages[i].id;
					var m_action_index = deletedMessages[i].index ;
					var userId = '';
					try {
						userId = UserUtils.getUserProfile().Users[0].user_id;
					}
					catch(e) {}
					Message.deleteMessage(msgId, userId, function(result) {
						var cachedMessages = DataUtils.getLocalStorageData("rtaMessages", "shell");
						try {
							cachedList = JSON.parse(cachedMessages);
							cachedList.splice(m_action_index, 1);
							DataUtils.setLocalStorageData("rtaMessages",JSON.stringify(cachedList),false,"shell");
						}
						catch (e) {
							console.log(e);
						}


					});
				}
				messagesPageViewInstance.render();
				messagesPageViewInstance.checkRadioSwitchedChanged();
				//loadingInd.hide();
			}
		},
		getNotificationHandlerIcon : function(checkedTab , checkedItemID){

			var isFoundReadedMessage=false;
			var isFoundUnreadedMessage=false;
			var checkedbox= $('#messagesList :checkbox:checked');
			if (checkedbox.length==0)
			{
				$(".notification-handlers-images").addClass("hidden");
				return;
			}
			$(".notification-handlers-images").removeClass("hidden");
			if(checkedTab == "messages_unreaded"){
				$("#read_message").addClass("hidden");
			}
			else if(checkedTab == "message_all"){
				$("#unread_message").addClass("hidden");
				$("#read_message").addClass("hidden");
			}
			for(var i=0; i<checkedbox.length;i++){
				var selectedIndex= $(checkedbox[i]).parent().parent().parent().parent().attr('id').split('_')[1];
				//return all selected messages status number
				var messageStatus = messagesPageViewInstance.getMessageStatus(selectedIndex);
				if(messageStatus== '0'){
					isFoundUnreadedMessage=true;
				}else {
					isFoundReadedMessage = true;
				}
			}

			if(isFoundUnreadedMessage&&isFoundReadedMessage){
				//Contains Unread Messages and Contains Read Messages
				$("#unread_message").removeClass("hidden");
				$("#read_message").removeClass("hidden");
			}else if(isFoundUnreadedMessage&&!isFoundReadedMessage){
				//Contains Unread Messages and Not Contains Read Messages
				$("#unread_message").removeClass("hidden");
				$("#read_message").addClass("hidden");
			}else if(!isFoundUnreadedMessage&&isFoundReadedMessage){
				//Not Contains Unread Messages and Contains Read Messages
				$("#unread_message").addClass("hidden");
				$("#read_message").removeClass("hidden");
			}
		},
		getAllMessages: function(user_id, callback) {


			return Message.getAllMessages(user_id, function(result) {
				messagesPageViewInstance.messageList = result.invocationResult.resultSet;
				if(messagesPageViewInstance.messageList.length > 0) {
					DataUtils.setLocalStorageData("rtaMessagesSaveTimeStamp",JSON.stringify(new Date(result.invocationResult.resultSet[0].created).getTime()),false,"shell");
					messagesPageViewInstance.cacheMessages(messagesPageViewInstance.messageList);
				}
				callback(messagesPageViewInstance.messageList);
			});
		},

		getRecentMessages: function(timestamp, callback) {
			Message.getUserMessageAfterDate(messagesPageViewInstance.messages_user_id, timestamp, function(result) {
				if(result.invocationResult.resultSet.length > 0) {
					messagesPageViewInstance.messageList = result.invocationResult.resultSet;
					$.each(messagesPageViewInstance.messageList, function( index, value ) {
						this["messageIndex"] = index ;
					});
					DataUtils.setLocalStorageData("rtaMessagesSaveTimeStamp",JSON.stringify(new Date(result.invocationResult.resultSet[0].created).getTime()),false,"shell");
					messagesPageViewInstance.cacheMessages(messagesPageViewInstance.messageList);

					callback(messagesPageViewInstance.messageList);
				}else {
					var cachedMessages = DataUtils.getLocalStorageData("rtaMessages", "shell");
					messagesPageViewInstance.messageList = cachedMessages;
					$.each(messagesPageViewInstance.messageList, function( index, value ) {
						this["messageIndex"] = index ;
					});
					callback(messagesPageViewInstance.messageList);
				}
			});
		},

		loadCachedMessages: function(callback) {

			var cachedMessages = DataUtils.getLocalStorageData("rtaMessages", "shell");
			try{
				messagesPageViewInstance.messageList = JSON.parse(cachedMessages);
				$.each(messagesPageViewInstance.messageList, function( index, value ) {
					this["messageIndex"] = index ;
				});
				if(messagesPageViewInstance.messageList.length > 0)
					callback(messagesPageViewInstance.messageList);
			}
			catch(e){
				console.log(e);
			}
		},

		cacheMessages: function(list) {
			/*if(list.length > 20) {
				var messagesToStore = [];
				for(var i=0; i<20; i++)
					messagesToStore[i] = list[i];
				DataUtils.setLocalStorageData("rtaMessages",JSON.stringify(messagesToStore),false,"shell");
			}*/
			DataUtils.setLocalStorageData("rtaMessages",JSON.stringify(list),false,"shell");
			messagesPageViewInstance.messageList = list ;
		},

		render: function() {
			try{
				var unreadOnly = false;
				var messageList = messagesPageViewInstance.messageList;
				if($(".ui-radio input:checked").val() == 0){
					unreadOnly = true;
					messageList = messagesPageViewInstance.getUnReadMessages();
				}
				Message.updateNotificationsCounter();

				if(messageList && messageList.length > 0) {
					var messageListLength = messageList.length;
					for(var i=0; i<messageListLength; i++) {
						var item = messageList[i];
						messagesPageViewInstance.drawMessageHTML(item);
					}
					$("#messagesList").listview().listview("refresh");
					if($("#messagesList li").length>0){
						$('.messages-lists').show();
						$('#selectall-checkbox').show();
					}else{
						$('.messages-lists').hide();
						$('#selectall-checkbox').hide();
					}
					messagesPageViewInstance.showLoadMore(messageList);
				}
				$(".ui-loader").hide();
			}catch(e){
				$(".ui-loader").hide();
			}
		},
		showLoadMore : function (messageList){
			if(messageList.length <= 20){
				$("#loadMore").addClass("hidden");
			}else{
				$("#loadMore").removeClass("hidden");
			}
		},
		drawMessageHTML : function(item){
			var messageId = "message_" + item.messageIndex;
			var messageTextArea = "messageTextArea_" + item.messageIndex;
			var messageStatus = "";
			var title = "", description = "";

			if(item.status == 1)
				messageStatus = '<li id="'+messageId+'" class="message-item message-item-pos message-read" style="position: relative;">';
			else
				messageStatus = '<li id="'+messageId+'" class="message-item message-item-pos message-unread" style="position: relative;">';

			if(messagesPageViewInstance.language  == 'en') {
				title = item.title_en;
				description = item.message_en;
			}
			else {
				title = item.title_ar;
				description = item.message_ar;
			}
			var newMessageBody = messageStatus
			+ '<div class="holder-class"><div class=" message-item-pos">'
			+ '<div id="'+messageTextArea+'" class="message-text-area">'

			+'<div class="checkboxTextMainConatiner">'
			+'<span id="selectall-span" class="checkbox-container">'
			+'<label id="selectall-lbl">'
			+'<input class="checkbox-input messageList-checkbox" type="checkbox" data-theme="d" data-cacheval="false">'
			+'</label>'
			+'<span class="textColorCS checkbox-text">'+ title + '</span>'
			+'</span>'
			+'<div id="messageBriefArea">' +description+ '</div>'
			+ '</div></div></div></div></li>';

			$('#messagesList').append(newMessageBody);

			$('#messagesList input[type="checkbox"]').checkboxradio();
			$("#" + messageTextArea).on("tap", function(event) {
				event.preventDefault();

				try {
					var selectedIndex = this.id.split("_")[1];
					var params = {};

					var selectedMessage = messagesPageViewInstance.messageList[selectedIndex];
					if(selectedMessage) {
						if(messagesPageViewInstance.language == 'en') {
							params.m_title = selectedMessage.title_en;
							params.m_description = selectedMessage.message_en;
							params.m_action_name = selectedMessage.action_label_en;
						}
						else {
							params.m_title = selectedMessage.title_ar;
							params.m_description = selectedMessage.message_ar;
							params.m_action_name = selectedMessage.action_label_ar;
						}
						params.m_action_index = selectedIndex;
						params.m_msgId = selectedMessage.id;
						params.m_action_url = selectedMessage.action_url;
						params.m_action_sid = selectedMessage.service_id;

						Message.setMessageRead(selectedMessage.id, selectedMessage.status, selectedMessage.Users_id, function(result) {
							var dateNow = new Date();
							var cachedMessages = DataUtils.getLocalStorageData("rtaMessages", "shell");
							try{
								var cached = JSON.parse(cachedMessages);
								cached[selectedIndex].readed = dateNow;
								DataUtils.setLocalStorageData("rtaMessages",JSON.stringify(cached),false,"shell");
							}
							catch(e) {
								console.log(e);
							}

						});

						mobile.changePage("shell/MessageDescription.html", {data:params} );
					}
				}
				catch(e) {
					console.log("MessagesPageView :: Tap on message error :: " + e.toString());
				}
			});
		},
		getUnReadMessages : function(){
			var unreadMessagesList = [];
			var i = 0 ;
			var messagesLength = messagesPageViewInstance.messageList.length;
			for(i;i<messagesLength;i++){
				var item = messagesPageViewInstance.messageList[i];
				var status = messagesPageViewInstance.getMessageStatus(item);
				if(status != 1 ){
					item["messageIndex"] = i ;
					unreadMessagesList.push(item);
				}
			}
			return unreadMessagesList;
		},
		/**
		 * do any cleanup, remove window binding here
		 * @param none
		 */
		dispose: function() {
			delete messagesPageViewInstance ;
			PageView.prototype.dispose.call(this);
		},

	});

	// Returns the View class
	return MessagesPageView;

});
