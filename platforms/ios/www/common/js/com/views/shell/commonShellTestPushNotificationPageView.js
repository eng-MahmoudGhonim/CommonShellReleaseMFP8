define([ 		
		"jquery", 
		"backbone",
		"com/views/PageView",
		"com/models/shell/pushNotificationModel"
	
	], function( $, Backbone, PageView, pushNotificationModel) {

	var commonShellTestPushNotificationPageView = PageView.extend({
		
    	/**
         * The View Constructor
         * @param el, DOM element of the page
         */
    	
        initialize: function(options)
        {
        	options.phoneTitle = "Test Push Notification";
			PageView.prototype.initialize.call(this, options);	
			this.$el.on("tap", "#sendPushNotification", function(event) {
				event.preventDefault();
				
				var username, serviceID, bodyText;
				
				if(!$("#pushUserID").val() && !$("#pushServiceID").val() && !$("#pushText").val()){
					alert('All fields are required');
					return false;
				}
				
				username = $("#pushUserID").val();
				serviceID =  $("#pushServiceID").val();
				bodyText =  $("#pushText").val();
				pushNotificationModel.pushNotification(username,serviceID,bodyText);
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
    return commonShellTestPushNotificationPageView;

});