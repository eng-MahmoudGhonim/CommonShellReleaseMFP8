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
			var ParkingFinesPageView = PageView.extend({
				events: {
					'pageshow': 'onPageShow',
				},
				initialize : function(options) {
					var self = this;
					ParkingFinesPageViewInstance = this;


					ParkingFinesPageViewInstance.language = getApplicationLanguage();

					if(!options){
						options = {};
					}
					ParkingFinesPageViewInstance.options = options;
					options.hideHeader = false;
					options.hideFooter = false;
					options.hideSidePanel = true;
					options.headerState = Header.STATE_MENU;
					options.phoneTitle = Globalize.localize("%shell.parkingFines.title%", ParkingFinesPageViewInstance.language);
					PageView.prototype.initialize.call(this, options);

				},
				onPageShow: function() {
//					document.getElementById("ParkingFinesPage").setAttribute("data-role","content");
				},
				dispose : function() {
					PageView.prototype.dispose.call(this);
				},

			});

			// Returns the View class
			return ParkingFinesPageView;

		});