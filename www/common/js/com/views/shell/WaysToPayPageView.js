define([
        "com/models/drivers_and_vehicles/DVDashboardModel",
        "com/views/PageView",
        "com/views/Header",
        "com/utils/Utils"
        ],
        function(DVDashboardModel, PageView, Header, Utils) {

	// Extends PagView class
	var WaysToPayPageView = PageView.extend({
		events: {
			'pageshow': 'onPageShow',
		},
		initialize : function(options) {
			WaysToPayPageViewInstance = this;

			if(!options){
				options = {};
			}
			WaysToPayPageViewInstance.options = options;
			options.hideHeader = false;
			options.hideFooter = false;
			options.headerState = Header.STATE_MENU;
			options.phoneTitle = localize("%shell.waysToPay.title%");
			PageView.prototype.initialize.call(this, options);

		},
		onPageShow: function() {

			document.getElementById("clickNParkButton").onclick = function(){

				DVDashboardModel.onClickNParkAtWayToPay();
			}
			document.getElementById("purchaseParkingPermitButton").onclick = function(){
				DVDashboardModel.onPurchaseAParkingPermitAtWayToPay();

			}
			document.getElementById("rtaApp").onclick = function(){
				if(Utils.isAndroid()){
					window.open('market://details?id=com.rta.rtadubai',"_system"); 
				}else if(Utils.isiOS()){
					window.open('itms-apps://itunes.apple.com/app/id426109507',"_system"); 
				}

			}

			document.getElementById("dvApp").onclick = function(){
				if(Utils.isAndroid()){
					window.open('market://details?id=com.rta.driversandvehicles',"_system"); 
				}else if(Utils.isiOS()){
					window.open('itms-apps://itunes.apple.com/app/id912748782',"_system"); 
				}
			}
		},
		dispose : function() {
			PageView.prototype.dispose.call(this);
		},

	});

	// Returns the View class
	return WaysToPayPageView;

});