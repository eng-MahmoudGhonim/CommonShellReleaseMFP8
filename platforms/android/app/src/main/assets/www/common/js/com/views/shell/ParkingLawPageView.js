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
			var ParkingLawPageView = PageView.extend({
				events: {
					'pageshow': 'onPageShow',
					'tap #parkingCards': 'onparkingCardsTab',
					'tap #zoneCategories': 'onzoneCategoriesTab',
					'tap #waysToPay': 'onwaysToPayTab',
					'tap #parkingFines': 'onparkingFinesTab',
				},
				initialize : function(options) {
					var self = this;
					ParkingLawPageViewInstance = this;
					ParkingLawPageViewInstance.language = getApplicationLanguage();

					if(!options){
						options = {};
					}
					ParkingLawPageViewInstance.options = options;
					options.hideHeader = false;
					options.hideFooter = false;
					options.headerState = Header.STATE_MENU;
					options.phoneTitle = Globalize.localize("%shell.parkingLaw.title%", ParkingLawPageViewInstance.language);
					PageView.prototype.initialize.call(this, options);
				},
				onPageShow: function() {
//					document.getElementById("ParkingLawPage").setAttribute("data-role","content");
					var items = document.getElementsByClassName("lawItem");
					for(var i=0;i<items.length;i++){
						items[i].style.webkitTransform = "translate3d(0,0,0)";
					}
				},
				onzoneCategoriesTab: function(event){
					setTimeout(function(){ 
						if(getApplicationLanguage() == "en"){
							mobile.changePage("shell/zone_categories_en.html");
						}else{
							mobile.changePage("shell/zone_categories_ar.html");
						}
					}, 200);
 
					
					
				},
				onparkingCardsTab:function(event){
					setTimeout(function(){ mobile.changePage("shell/parking_cards.html");}, 200);
				},
				onwaysToPayTab:function(){
					setTimeout(function(){ mobile.changePage("shell/ways_to_pay.html");}, 200);
				},
				onparkingFinesTab:function(){
					setTimeout(function(){ mobile.changePage("shell/parking_fines.html");}, 200);
				},
				dispose : function() {
					PageView.prototype.dispose.call(this);
				},

			});

			// Returns the View class
			return ParkingLawPageView;

		});