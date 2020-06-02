define([ 
		"jquery", 
		"backbone",
		"com/views/PageView",
		"com/utils/DataUtils",
		"com/models/shell/HandleBarsHelpers"
	], function( $, Backbone, PageView,DataUtils,HandleBarsHelpers) {
	
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
        	document.addEventListener("logoutEventSuccess", function(event) {
        		DataUtils.setLocalStorageData('sidepanel-activeTab',null,false,'shell');
        	}, false);
        	document.addEventListener("pageHomeOnCreate", function(event) {
//        		console.log('11');
//        		handleLinkingForServiceCategory("8",false);
         	}, false);
        	document.addEventListener("linkActionButton", function(event) {
        		// [Event handler task] Code goes here
        		alert("linkActionButton");
        	}, false);
        	document.addEventListener("gettingLinkingDetailsEvent", function(event) {
        		// [Event handler task] Code goes here
        		alert("gettingLinkingDetailsEvent");
        	}, false);
        	
        	document.addEventListener("linkAttributesUpdated", function(event) {
        		// [Event handler task] Code goes here
        		console.log("linkAttributesUpdated");
        		try {
        			//call linking from local storage
        			//handleLinkingForServiceCategory("8",false);
        			// this line for rebinding the service list
        			dashboardPageViewInstance.bindServices();
        		}catch(e){}
        		
        	}, false);
        	
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
