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
			var ParkingCardsPageView = PageView.extend({
				
				initialize : function(options) {
					if(!options){
						options = {};
					}
					options.hideHeader = false;
					options.hideFooter = false;
					options.headerState = Header.STATE_MENU;
					options.phoneTitle = localize("%shell.parkingLaw.parkingCards%");
					PageView.prototype.initialize.call(this, options);

				},
				dispose : function() {
					PageView.prototype.dispose.call(this);
				},

			});

			// Returns the View class
			return ParkingCardsPageView;

		});