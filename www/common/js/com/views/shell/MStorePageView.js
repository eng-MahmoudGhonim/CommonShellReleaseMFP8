
/* JavaScript content from js/com/views/shell/MStorePageView.js in folder common */
define(["com/views/PageView", "com/views/Header", "com/models/shell/MStoreCoverModel", "com/models/shell/UserProfileModel", "com/models/shell/AuthenticationModel", "com/models/drivers_and_vehicles/DVDashboardModel"], function(PageView, Header, MStoreCoverModel, UserProfileModel, AuthenticationModel,DVDashboardModel) {
	var MStorePageView = PageView.extend({
		events: {
			'pageshow': 'onPageShow'
		},
		initialize: function(options) {
			options.phoneTitle = localize("%shell.mstore.title%");
			options.headerState = Header.STATE_MENU;
			PageView.prototype.initialize.call(this, options);
		},
		onPageShow: function(event) {
			event.preventDefault();
			try {
				if (AuthenticationModel.isAuthenticated()) {
					
					// logged user but not linked with traffic
					if(!UserProfileModel.getUserProfile().Users[0].traffic_number){
						document.querySelector("#guestUserWindow").style.display="block";
						document.querySelector("#linkedUserWindow").style.display="none";
						
						document.querySelector("#mydocsRegister").style.display="none";
						document.querySelector("#mydocsLogin").style.display="none";
						
						document.querySelector("#mstore #registerDuabiDrive").style.display="none";
						document.querySelector("#mstore #loggedToView").style.display="block";
						document.querySelector("#mstore #loginAndAddtrafficfile").style.display="none";
						document.querySelector("#mstore #linkedtrafficCodeNumberBtn").addEventListener("click", function(event){
							DVDashboardModel.onLinkTrafficFileClick();
						});
					}
					else
						{
						// logged user and linked 
						document.querySelector("#guestUserWindow").style.display="none";
						document.querySelector("#linkedUserWindow").style.display="block";
						
						document.querySelector("#mydocsRegister").style.display="block";
						document.querySelector("#mydocsLogin").style.display="block";
						
						
						}
					
					

					var myvehiclesCount = 0;
					var mylicenseCount = 0;
					var myplatesCount = 0;
					var userId = "";
					userId = UserProfileModel.getUserProfile().Users[0].user_id;
					$(".ui-loader").show();
					MStoreCoverModel.requestCardsDetails(userId, "", function(result) {
						$(".ui-loader").hide();
						console.log(result);

						
						
						
						
						var vehicles =result["Vehicle License"]? MStoreCoverModel.buildVehicleItemsObjects(result["Vehicle License"]):null;
						var myplates = result["Plate Ownership Certificate"]?MStoreCoverModel.buildPlatesItemsObjects(result["Plate Ownership Certificate"]):null;
						var mylicense =result["Driving License"]&&result["Driving License"][0]? MStoreCoverModel.buildLicenseItemObject(result["Driving License"][0]):null;
						if (vehicles != null && vehicles != undefined && vehicles.length > 0) {
							myvehiclesCount = vehicles.length;
						}
						
							if (mylicense != null || mylicense != undefined) {
							if (mylicense.frontView && mylicense.backView )
								mylicenseCount = "1";
						}
						
						if (myplates != null || myplates != undefined && myplates.length > 0) {
							myplatesCount = myplates.length;
						}

//						if (result["Vehicle License"] != null && result["Vehicle License"] != undefined && result["Vehicle License"].length > 0) {
//							myvehiclesCount = result["Vehicle License"].length;
//						}
//						if (result["Driving License"] != null || result["Driving License"] != undefined && result["Driving License"].length > 0) {
//							if (result["Driving License"][0] && result["Driving License"][0].Images  && result["Driving License"][0].Images.length >0 )
//								mylicenseCount = result["Driving License"].length;
//						}
//						if (result["Plate Ownership Certificate"] != null || result["Plate Ownership Certificate"] != undefined && result["Plate Ownership Certificate"].length > 0) {
//							myplatesCount = result["Plate Ownership Certificate"].length;
//						}

						document.getElementById("myvehiclesnumber").innerText = myvehiclesCount;
						if (myvehiclesCount > 0 ) {
							document.getElementById("viewmyvehicles").classList.remove("disabled");							
							document.querySelector("#viewmyvehicles").onclick = function() {
								mobile.changePage("shell/mStore_vehicles.html")
							}
							document.querySelector("#viewmyvehiclescont").onclick = function() {
								mobile.changePage("shell/mStore_vehicles.html")
							}
						}
						document.getElementById("mylicensenumber").innerText = mylicenseCount;
						if (mylicenseCount > 0) {
							document.getElementById("viewmylicense").classList.remove("disabled");
							document.querySelector("#viewmylicense").onclick = function() {
								mobile.changePage("shell/mStore_license.html")
							}
							document.querySelector("#viewmylicensecont").onclick = function() {
								mobile.changePage("shell/mStore_license.html")
							}
						}
						document.getElementById("myplatesnumber").innerText = myplatesCount;
						if (myplatesCount > 0) {
							document.getElementById("viewmyplates").classList.remove("disabled");
							document.querySelector("#viewmyplates").onclick = function() {
								mobile.changePage("shell/mstore_plates.html")
							}
							document.querySelector("#viewmyplatescont").onclick = function() {
								mobile.changePage("shell/mstore_plates.html")
							}
						}
					});


				}
				else
				{
					// check for null
					document.querySelector("#guestUserWindow").style.display="block";
					document.querySelector("#linkedUserWindow").style.display="none";
					document.querySelector("#linkedtrafficCodeNumberBtn").style.display="none";
					
					document.querySelector("#mstore #registerDuabiDrive").style.display="block";
					document.querySelector("#mstore #loggedToView").style.display="none";
					
					document.querySelector("#mstore #loginAndAddtrafficfile").style.display="block";
					document.querySelector("#mstore #linkAndAddtrafficfile").style.display="none";


					document.querySelector("#mydocsLogin").onclick = function() {
						window.LoginViewControl.show();
					}

					document.querySelector("#mydocsRegister").onclick = function() {
						mobile.changePage("shell/register.html", true);
					}
					
					
				}
			} catch (e) {}
			
			
			
		},
		dispose: function() {
			PageView.prototype.dispose.call(this);
		}
	});
	return MStorePageView;
});
