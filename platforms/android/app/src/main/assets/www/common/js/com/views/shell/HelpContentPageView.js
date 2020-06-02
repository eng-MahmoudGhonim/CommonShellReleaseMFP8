define(
		[

		"jquery",
		"backbone",
		"com/views/PageView",
		"com/views/Header",
		"com/utils/DataUtils",
	    "com/models/shell/HelpModel",
	    "com/utils/Utils"

		],
		function($, Backbone, PageView, Header, DataUtils, HelpModel, Utils) {

	// Extends PagView class
	var HelpContentPageView = PageView.extend({
		/**
		 * The View Constructor
		 * 
		 * @param el,
		 *            DOM element of the page
		 */
		initialize : function(options) {
			options.headerState = Header.STATE_MENU;
			PageView.prototype.initialize.call(this, options);
			
			this.$el.on("pageshow", function () {
				if (options.data && options.data.id) {
					var topicId = options.data.id;
					HelpModel.getHelpData(function(data){
						if(data && (data instanceof Array) && data.length > 0){
							for(var i=0;i<data.length;i++){
		            			if(topicId == data[i].id){
		            				var language = getApplicationLanguage();
		            				var header = MobileRouter.getHeader();
		            				if(language == "en"){
		    							
		            				 header.setHeaderText(data[i].title_EN);
		            					 $(helpTitle).html(data[i].title_EN);
		            			        // Get the content
		            			        var str = data[i].article_EN;
		            			        // Set the regex string
		            			        var regex = /(https?:\/\/([-\w\.]+)+(:\d+)?(\/([\w\/_\.]*(\?\S+)?)?)?)/ig;
		            			        // Replace plain text links by hyperlinks
		            			        	var replaced_text = str.replace(regex, "<a href=\"#\" onclick=\"javascript:window.open('$1', '_system');\">$1</a>");

		            					$(helpContent).html(replaced_text);
		            					/*$(helpTitle).html(data[i].title_EN);
		            	                 //check if the header is overflowing then set text-left as they are conflicting*/
		            					if ($(phone_title)[0].scrollWidth >  $(phone_title).innerWidth())
		            	           		$(phone_title).css({ 'text-align' : 'left'});
		            	           		else
		            	           		$(phone_title).css({ 'text-align' : 'center'});
		            				}
		            				else{
		            					 header.setHeaderText(data[i].title_AR);
		            					$(helpTitle).html(data[i].title_AR); 
		            					 // Get the content
		            			        var str = data[i].article_AR;
		            			        // Set the regex string
		            			        var regex = /(https?:\/\/([-\w\.]+)+(:\d+)?(\/([\w\/_\.]*(\?\S+)?)?)?)/ig;
		            			        // Replace plain text links by hyperlinks
		            			        	var replaced_text = str.replace(regex, "<a href=\"#\" onclick=\"javascript:window.open('$1', '_system');\">$1</a>");

		            					$(helpContent).html(replaced_text);
		            					 //check if the header is overflowing then set text-align:right as they are conflicting
		            		           if ($(phone_title)[0].scrollWidth >  $(phone_title).innerWidth()) 
		            		           	$(phone_title).css({ 'text-align' : 'right'});
		            		           	else
		            		           	$(phone_title).css({ 'text-align' : 'center'});
		            				}
		            				break;
		            			}
							}
						}
					});
				}		
			});
		},


		/**
		 * do any cleanup, remove window binding here
		 * 
		 * @param none
		 */
		dispose : function() {
			PageView.prototype.dispose.call(this);
		},

	});

	// Returns the View class
	return HelpContentPageView;

});