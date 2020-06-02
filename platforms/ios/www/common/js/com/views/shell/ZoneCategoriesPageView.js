define(
		[

		 "jquery",
		 "backbone",
		 "com/views/PageView",
		 "com/views/Header",
		 "com/utils/Utils",
		 "com/models/shell/CustomerSupportCenterModel"
		 ],
		 function($, Backbone, PageView, Header, Utils,CustomerSupportCenterModel) {

			// Extends PagView class
			var ZoneCategoriesPageView = PageView.extend({
				events: {
					'pageshow': 'onPageShow'
				},
				initialize : function(options) {
					ZoneCategoriesPageViewInstance = this;

					if(!options){
						options = {};
					}
					ZoneCategoriesPageViewInstance.options = options;

					options.headerState = Header.STATE_MENU;
					options.phoneTitle = localize("%shell.zoneCategories.title%");
					PageView.prototype.initialize.call(this, options);

				},
				onPageShow: function() {
					var collapsible1 = null,
					 collapsible2 = null,
					 collapsible3 = null;
					setTimeout(function(){
						collapsible1 = new Collapsible(document.getElementById("collapsibleEl1"));
//						setTimeout(function(){document.getElementsByClassName("collapseHead")[0].click();},300);
						collapsible1.onOpen = function(){
							collapsible2.close();
							collapsible3.close();
						}
					});
					setTimeout(function(){
						collapsible2 = new Collapsible(document.getElementById("collapsibleEl2"));
						collapsible2.onOpen = function(){
							collapsible1.close();
							collapsible3.close();
						}
					});
					setTimeout(function(){
						collapsible3 = new Collapsible(document.getElementById("collapsibleEl3"));
						collapsible3.onOpen = function(){
							collapsible1.close();
							collapsible2.close();
						}
					});
		},
		dispose : function() {
			PageView.prototype.dispose.call(this);
		},

		});

		// Returns the View class
		return ZoneCategoriesPageView;

	});