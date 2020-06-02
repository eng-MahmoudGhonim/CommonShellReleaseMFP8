define([ 
		
		"jquery", 
		"backbone",
		"com/views/PageView",
		"com/views/Header",
	
	], function( $, Backbone, PageView, Header ) {
		
    // Extends PagView class
    var FeedbackFormSuccessPageView = PageView.extend({
    	
    	/**
         * The View Constructor
         * @param el, DOM element of the page
         */
        initialize: function(options) 
        {
        	options.phoneTitle = Globalize.localize("%shell.feedbackformsuccess.title%", getApplicationLanguage());
        	options.headerState = Header.STATE_MENU;
        	PageView.prototype.initialize.call(this, options);
        	
        	this.$el.on("tap", "#facebookImg", function(event) {
        		event.preventDefault();
        		var fbWindow = window.open("http://www.facebook.com/rtadubai",'_system');
        	});
        	
        	this.$el.on("tap", "#twitterImg", function(event) {
        		event.preventDefault();
				var twitterWindow = window.open("http://twitter.com/RTA_Dubai",'_system');
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
    return FeedbackFormSuccessPageView;

});