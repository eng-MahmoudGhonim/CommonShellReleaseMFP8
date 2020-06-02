define([ 
		
		"jquery", 
		"backbone",
		"com/views/PageView",
		"touchslider"
	
	], function( $, Backbone, PageView ) {
		
    // Extends PagView class
    var TutorialPageView = PageView.extend({
    	

    	/**
         * The View Constructor
         * @param el, DOM element of the page
         */
        initialize: function(options) 
        {
//        	
//        	 ;
//			 
//        	options.phoneTitle = Globalize.localize("Tutorial", getApplicationLanguage());
        	options.hideFooter = true;
			options.hideHeader = true;
        	        	
			PageView.prototype.initialize.call(this, options);
			
			
			this.$el.on("pageshow", function(){
				$('#slider1').sliderTouch({
		        	nav:"dots"
		        });
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
    return TutorialPageView;

});