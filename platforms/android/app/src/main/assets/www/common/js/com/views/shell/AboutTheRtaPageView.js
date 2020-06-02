define([ 
		
		"jquery", 
		"backbone",
		"com/views/PageView",
		"com/views/Header",
		'com/models/shell/AboutRTAModel'
	
	], function( $, Backbone, PageView, Header ,AboutRTAModel ) {
    var AboutTheRtaPageView = PageView.extend({
    	 
        initialize: function(options)
        {
        	var self = this;
        	options.phoneTitle = Globalize.localize("%shell.sidepanel.aboutrta%", getApplicationLanguage());
        	language=getApplicationLanguage();
        	options.headerState = Header.STATE_MENU;
			PageView.prototype.initialize.call(this, options);
			
			this.$el.on("pageshow", function(){
					AboutRTAModel.getAboutRTAData(self.getRTAData);
			});
			
        },
        // this is test 
        getRTAData:function(data) {
        	if(data && (data instanceof Array) && data.length > 0){
            	var language = getApplicationLanguage();
            	
            	
            	if(language == "en"){
            		for(var i=0;i<data.length;i++){
                		var html= '<section class="headerBoldTextStyle headerBackground">';
                		html+= data[i].title_EN;
                		html+= '</section><div class="customListSection">';
                		html+= data[i].content_EN;
                		html+= '</div>';
            			$("#aboutRTAContent").append(html);
            		}
            	}
            	else{
            		for(var i=0;i<data.length;i++){
                		var html= '<section class="headerBoldTextStyle headerBackground">';
                		html+= data[i].title_AR;
                		html+= '</section><div>';
                		html+= data[i].content_AR;
                		html+= '</div>';
            			$("#aboutRTAContent").append(html);
            		}
            	}
        	}
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
    return AboutTheRtaPageView;

});