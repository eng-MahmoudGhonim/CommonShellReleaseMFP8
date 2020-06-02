define([ 
		
		"jquery", 
		"backbone",
		"com/views/PageView",
		"com/models/Constants",
		"com/utils/Utils",
		"com/utils/DataUtils",
		"com/models/shell/MessagesModel",
		"com/views/Header", 
		"com/utils/UserUtils"
	
	], function( $, Backbone, PageView, Constants, Utils, DataUtils, Message, Header, UserUtils) {
		
    // Extends PageView class
    var MessagesDescriptionPageView = PageView.extend({
    	
    	/**
         * The View Constructor
         * @param el, DOM element of the page
         */
    	events: {
    	'pageshow':	'onPageShow',
		'tap #actionBtn' : 'actionButton',
		'tap #deletBtn' : 'deleteButton',
    	},
        initialize: function(options) 
        {
        	messageDescriptionPageViewInstance = this ;
        	var message_title, message_description, message_actionname;
			messageDescriptionPageViewInstance.options = options ;
        	options.phoneTitle = Globalize.localize("%shell.messages.title%", getApplicationLanguage());
        	options.headerState = Header.STATE_MENU;
			PageView.prototype.initialize.call(this, options);			
        },
        onPageShow : function(event){
			event.preventDefault();
			//Highlight icon in footer
//			MobileRouter.getFooter().fixFooterIcons('msgFooterLink');
			var options = messageDescriptionPageViewInstance.options;
			if(options.data && options.data.m_title && options.data.m_description) {
				
				message_title = Utils.replacePlusSigns(options.data.m_title);
				message_description = Utils.replacePlusSigns(options.data.m_description);
				message_actionname = Utils.replacePlusSigns(options.data.m_action_name);
				
				$("#message_title").html(message_title);
				$("#message_description").html(message_description);
				
				if(options.data.m_action_url == "" || options.data.m_action_name == "")
					$("#actionBtn").addClass('action-btn-hide');
				else
					$("#actionBtn").html(message_actionname);
			}
		},
		actionButton : function(event){
			event.preventDefault();
			var options = messageDescriptionPageViewInstance.options;
			if(options.data.m_action_url){
				mobile.navigate(options.data.m_action_url, {trigger: true});
			}
		},
		deleteButton : function(event){
			event.preventDefault();
			var options = messageDescriptionPageViewInstance.options;
			var userId = '';
			try {
				userId = UserUtils.getUserProfile().Users[0].user_id;
			}
			catch(e) {}
			Message.deleteMessage(options.data.m_msgId, userId, function(result) {
				var cachedMessages = DataUtils.getLocalStorageData("rtaMessages", "shell");
				try {
					cachedList = JSON.parse(cachedMessages);
					cachedList.splice(options.data.m_action_index, 1);
					DataUtils.setLocalStorageData("rtaMessages",JSON.stringify(cachedList),false,"shell");
				}
				catch (e) {
					console.log(e);
				}
				mobile.changePage("shell/messages.html");
			});
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
    return MessagesDescriptionPageView;

});