define([ 
		"jquery", 
		"backbone",
		"com/views/PageView"
		], function( $, Backbone, PageView) {
	
    var StartUpPageView = PageView.extend({
    	
    	/**
         * The View Constructor
         * @param el, DOM element of the page
         */
    	initialize: function(options) 
        {
    		// to initialize the class
        },
    	onStartUp: function() 
        {
//        	console.log('Testing ::::: Do this on startup');
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
    return StartUpPageView;

});
