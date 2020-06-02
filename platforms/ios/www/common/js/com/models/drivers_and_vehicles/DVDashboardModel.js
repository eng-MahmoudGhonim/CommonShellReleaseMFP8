define([
	"jquery", "backbone",
	"com/utils/DataUtils",
	"com/utils/Utils",
	"com/models/shell/UserProfileModel",
	"com/utils/TemplateUtils",
	"jqueryui"
], function ($, Backbone, DataUtils, Utils, UserProfileModel, TemplateUtils) {
	var USER_Service_Related = 'serviceRelated';
	var DVDashboardModel = Backbone.Model.extend({}, {

		getServiceRelatedInfoByKey: function (key, callback, async, _UserProfileModel) {
			try {
				var result = null;
				if (async == true) {
					_UserProfileModel.getPortalProfile(function (profile) {
						if (profile && profile.serviceRelatedInfo) {
							var _serviceRelatedInfo = (Object.prototype.toString.call(profile.serviceRelatedInfo) === '[object Array]') ? profile.serviceRelatedInfo : convertObiectToArray(profile.serviceRelatedInfo);
							_UserProfileModel.setServiceRelatedInfo(_serviceRelatedInfo);
							if (key != "ALL") {
								for (var i = 0; i < _serviceRelatedInfo.length; i++) {
									if (_serviceRelatedInfo[i].serviceId == key) {
										var SalikAccountRemoved = DataUtils.getLocalStorageData("SalikAccountRemoved", "shell")
										var SalikAccountRemovedLink = DataUtils.getLocalStorageData("SalikAccountRemovedLink", "shell")
										if (key == "SALIK") {
											if (SalikAccountRemoved == "true" && (SalikAccountRemovedLink === _serviceRelatedInfo[i].linkingAttribute || _serviceRelatedInfo[i].linkingAttribute == null)) {
												result = null;

											} else {
												DataUtils.setLocalStorageData("SalikAccountRemoved", "false", true, "shell");
												result = _serviceRelatedInfo[i];
											}
										} else {
											result = _serviceRelatedInfo[i];
										}




									}
								}
							} else {
								var SalikAccountRemoved = DataUtils.getLocalStorageData("SalikAccountRemoved", "shell")
								var SalikAccountRemovedLink = DataUtils.getLocalStorageData("SalikAccountRemovedLink", "shell")
								for (var i = 0; i < _serviceRelatedInfo.length; i++) {
									if (_serviceRelatedInfo[i].serviceId == "SALIK") {
										if (SalikAccountRemoved == "true" && (SalikAccountRemovedLink === _serviceRelatedInfo[i].linkingAttribute || _serviceRelatedInfo[i].linkingAttribute == null)) {
											_serviceRelatedInfo.splice(i, 1);
										} else {
											DataUtils.setLocalStorageData("SalikAccountRemoved", "false", true, "shell");
										}
									}
								}
								result = _serviceRelatedInfo;
							}
							callback(result);
						}

						else {
							callback(null);
						}

					});
				} else {
					var serviceRelatedInfo = DataUtils.getLocalStorageData(USER_Service_Related, "shell");
					if (serviceRelatedInfo) {
						serviceRelatedInfo = JSON.parse(serviceRelatedInfo);
						if (key != "ALL") {
							for (var i = 0; i < serviceRelatedInfo.length; i++) {
								if (serviceRelatedInfo[i].serviceId == key) {
									var SalikAccountRemoved = DataUtils.getLocalStorageData("SalikAccountRemoved", "shell")
									var SalikAccountRemovedLink = DataUtils.getLocalStorageData("SalikAccountRemovedLink", "shell")
									if (key == "SALIK") {
										if (SalikAccountRemoved == "true" && (SalikAccountRemovedLink === serviceRelatedInfo[i].linkingAttribute || serviceRelatedInfo[i].linkingAttribute == null)) {
											result = null;

										} else {
											DataUtils.setLocalStorageData("SalikAccountRemoved", "false", true, "shell");
											result = serviceRelatedInfo[i];
										}
									} else {
										result = serviceRelatedInfo[i];
									}



								}
							}
						} else {
							var SalikAccountRemoved = DataUtils.getLocalStorageData("SalikAccountRemoved", "shell")
							var SalikAccountRemovedLink = DataUtils.getLocalStorageData("SalikAccountRemovedLink", "shell")
							for (var i = 0; i < serviceRelatedInfo.length; i++) {
								if (serviceRelatedInfo[i].serviceId == "SALIK") {
									if (SalikAccountRemoved == "true" && (SalikAccountRemovedLink === serviceRelatedInfo[i].linkingAttribute || serviceRelatedInfo[i].linkingAttribute == null)) {
										serviceRelatedInfo.splice(i, 1);
									} else {
										DataUtils.setLocalStorageData("SalikAccountRemoved", "false", true, "shell");
									}
								}
							}
							result = serviceRelatedInfo;
						}
						callback(result);
					} else {
						callback(null);
					}
				}
			} catch (e) { }
		},
		openSalikLinkPopup:function (){alert("openSalikLinkPopup")},
		onClickNParkAtWayToPay: function () {
			alert("onClickNParkAtWayToPay")
		},
		onPurchaseAParkingPermitAtWayToPay: function () {
			alert("onPurchaseAParkingPermitAtWayToPay")
		},
		onDriverLicenseTileClick: function () {
			//TODO
			alert("onDriverLicenseTileClick")
		},
		onlinkLicenseBtnClick: function () {
			//TODO
			alert("onlinkLicenseBtnClick")
		},
		getDriverLicenseDetails: function (callBack) {
			callBack({
				licenseNumber: "52923",
				blackpoints: "3",
				expiredate: (getApplicationLanguage() == 'en') ? "Mar 12th 2017" : "12 مارس 2017", //it should be with the following format "Mar 12th 2017" in english and in arabic "12 مارس 2017"
			});
		},
		////////////////////PARKING TILE//////////////////////////////////
		onClickNParkClicked: function () {
			alert("onClickNParkClicked")
			/*
			 * called when click n park button clicked in guest mode
			 */
		},
		onExtendBtnClick: function (ticketId) {
			alert("onExtendBtnClick " + ticketId);
			/*
			 * called when active ticket extend button clicked
			 * it will have ticket id passed in the parameters
			 */
		},
		getCashedActiveTickets: function (callBack) {
			/*TODO retrieve the cashed parking Active tickets from local storage
			NOTE: the returned tickets should be active which means that they are not expired
			if there are any cashed active tickets,
			the callback function should be called with the following parameter object:
			- if there are no active tickets the callback function should be called with null parameter

			*/
			var tickets = [/*

				{
					ticketId: 1111111,
					expiryTime: new Date(new Date().getTime() + (60000 * 61)),
					plate: {
						plateNo: "88888",
						plateCode: "AA",
						plateSource: "Dubai"

					},
					zone: {
						zoneNo: "314",
						zoneCategory: "C"
					}
				}, {
					ticketId: 1111111,
					expiryTime: new Date(new Date().getTime() + (60000 * 61)),
					plate: {
						plateNo: "12345",
						plateCode: "Z",
						plateSource: "Dubai",
						isDubaiLogo: true

					},
					zone: {
						zoneNo: "314",
						zoneCategory: "C"
					}
				}, {
					ticketId: 1111111,
					expiryTime: new Date(new Date().getTime() + (60000 * 61)),
					plate: {
						plateNo: "53316",
						plateCode: "T",
						plateSource: "Dubai"
					},
					zone: {
						zoneNo: "314",
						zoneCategory: "C"
					}
				}, {
					ticketId: 2222222,
					expiryTime: new Date(new Date().getTime() + (60000 * 30)),
					plate: {
						plateNo: "5353",
						plateCode: "11",
						plateSource: "Abu Dhabi"
					},
					zone: {
						zoneNo: "212",
						zoneCategory: "A"
					}
				}, {
					ticketId: 2222222,
					expiryTime: new Date(new Date().getTime() + (60000 * 45)),
					plate: {
						plateNo: "5353",
						plateCode: "castle",
						plateSource: "Abu Dhabi"
					},
					zone: {
						zoneNo: "212",
						zoneCategory: "A"
					}
				}, {
					ticketId: 2222222,
					expiryTime: new Date(new Date().getTime() + (60000 * 15)),
					plate: {
						plateNo: "5353",
						plateCode: "",
						plateSource: "Abu Dhabi"
					},
					zone: {
						zoneNo: "212",
						zoneCategory: "A"
					}
				}, {
					ticketId: 2222222,
					expiryTime: new Date(new Date().getTime() + (60000 * 20)),
					plate: {
						plateNo: "5353",
						plateCode: "E",
						plateSource: "Ajman"
					},
					zone: {
						zoneNo: "212",
						zoneCategory: "A"
					}
				}, {
					ticketId: 2222222,
					expiryTime: new Date(new Date().getTime() + (60000 * 29)),
					plate: {
						plateNo: "5353",
						plateCode: "E",
						plateSource: "Umm AlQuwain"
					},
					zone: {
						zoneNo: "212",
						zoneCategory: "A"
					}
				}, {
					ticketId: 2222222,
					expiryTime: new Date(new Date().getTime() + (60000 * 69)),
					plate: {
						plateNo: "5353",
						plateCode: "E",
						plateSource: "Ras Al Khaimah"
					},
					zone: {
						zoneNo: "212",
						zoneCategory: "A"
					}
				}, {
					ticketId: 2222222,
					expiryTime: new Date(new Date().getTime() + (60000 * 120)),
					plate: {
						plateNo: "5353",
						plateCode: "castle",
						plateSource: "Ras Al Khaimah"
					},
					zone: {
						zoneNo: "212",
						zoneCategory: "A"
					}
				}, {
					ticketId: 2222222,
					expiryTime: new Date(new Date().getTime() + (60000 * 10)),
					plate: {
						plateNo: "5353",
						plateCode: "",
						plateSource: "Sharjah"
					},
					zone: {
						zoneNo: "212",
						zoneCategory: "A"
					}
				}
				, {
					ticketId: 2222222,
					expiryTime: new Date(new Date().getTime() + (60000 * 17)),
					plate: {
						plateNo: "5353",
						plateCode: "S",
						plateSource: "Fujairah"
					},
					zone: {
						zoneNo: "212",
						zoneCategory: "A"
					}
				}
			*/];

			callBack(tickets);

		},
		getParkingActiveTickets: function (callBack) {
			/*
			 * TODO retrieve the cashed parking Active tickets from backend
			 * NOTE: the returned tickets should be active which means that they
			 * are not expired if there are active tickets, the callback
			 * function should be called with the following parameter object: [ {
			 * timeRemaining: Date Object plate:{ plateNo: string plateCode:
			 * string plateSource: string } zone:{ zoneNo: string zoneCategory:
			 * string eg: A,B,C,D .. etc } }, { ....... } ]
			 *  - if there are no active tickets the callback function should be
			 * called with null parameter
			 * In Case of error use calback(null)
			 * In Case of no active tickets use calback([])
			 *
			 */
			callBack([ {
			 ticketId:456544,
				expiryTime :new Date(new Date().getTime() + (500000 * 2)) ,
				plate : {
					plateNo : "53316",
					plateCode : "T",
					plateSource : "Dubai",
					isDubaiLogo:true
					
				},
				zone : {
					zoneNo : "314",
					zoneCategory : "C"
				}
			},
		
			{
				 ticketId:456544,
					expiryTime :new Date(new Date().getTime() + (500000 * 2)) ,
					plate : {
						plateNo : "52216",
						plateCode : "M",
						plateSource : "Dubai",
						isDubaiLogo:true,
						isDubaiMotorcycle:true
					},
					zone : {
						zoneNo : "314",
						zoneCategory : "C"
					}
				}
			
			
			
			
			,{
				ticketId:456544,
				expiryTime : new Date(new Date().getTime() + (500000 * 2)),
				plate : {
					plateNo : "53532",
					plateCode : "J",
					plateSource : "Abu Dhabi"
				},
				zone : {
					zoneNo : "212",
					zoneCategory : "A"
				}
			} ,
			{
				ticketId:456544,
				expiryTime : new Date(new Date().getTime() + (500000 * 2)),
				plate : {
					plateNo : "53532",
					plateCode : "Y",
					plateSource : "Sharjah"
				},
				zone : {
					zoneNo : "212",
					zoneCategory : "A"
				}
			},
			{
				ticketId:456544,
				expiryTime : new Date(new Date().getTime() + (500000 * 2)),
				plate : {
					plateNo : "53532",
					plateCode : "X",
					plateSource : "Umm AlQuwain"
				},
				zone : {
					zoneNo : "212",
					zoneCategory : "A"
				}
			} ,
			{
				ticketId:456544,
				expiryTime : new Date(new Date().getTime() + (500000 * 2)),
				plate : {
					plateNo : "53532",
					plateCode : "W",
					plateSource : "Ras Al Khaimah"
				},
				zone : {
					zoneNo : "212",
					zoneCategory : "A"
				}
			},
			{
				ticketId:456544,
				expiryTime : new Date(new Date().getTime() + (500000 * 2)),
				plate : {
					plateNo : "53532",
					plateCode : "Z",
					plateSource : "Fujairah"
				},
				zone : {
					zoneNo : "212",
					zoneCategory : "A"
				}
			},
			           {
							ticketId:456554,
							expiryTime : new Date(new Date().getTime() + (500000 * 2)),
							plate : {
								plateNo : "135",
								plateCode : "11",
								plateSource : "Ajman"
							},
							zone : {
								zoneNo : "212",
								zoneCategory : "A"
							}
						},
			           
			           {
							ticketId:456556,
							expiryTime : new Date(new Date().getTime() + (500000 * 2)),
							plate : {
								plateNo : "12345",
								plateCode : "B",
								plateSource : "Oman"
							},
							zone : {
								zoneNo : "212",
								zoneCategory : "A"
							}
						},
			           ,
			        {
							ticketId:456556,
							expiryTime : new Date(new Date().getTime() + (500000 * 2)),
							plate : {
								plateNo : "7890",
								plateCode : "B",
								plateSource : "Bahrain"
							},
							zone : {
								zoneNo : "212",
								zoneCategory : "A"
							}
						},
			           {
							ticketId:456556,
							expiryTime : new Date(new Date().getTime() + (500000 * 2)),
							plate : {
								plateNo : "7890",
								plateCode : "B",
								plateSource : "KSA"
							},
							zone : {
								zoneNo : "212",
								zoneCategory : "A"
							}
						},
			           {
							ticketId:456556,
							expiryTime : new Date(new Date().getTime() + (500000 * 2)),
							plate : {
								plateNo : "7890",
								plateCode : "16",
								plateSource : "Kuwait"
							},
							zone : {
								zoneNo : "212",
								zoneCategory : "A"
							}
						}
			           
			           ]);
			 

			/*window.activeTicketsList = {
				data: null,
				count: 0
			}
			setTimeout(function () {
				//in error case


				callBack(window.activeTicketsList.data);
				window.activeTicketsList.count++;
				if (window.activeTicketsList.count > 1) {
					window.activeTicketsList.data = [];
				}

			}, 5700);*/
		},
		getNearstZone: function (callBack, location) {
			/*TODO get the nearest zone based on the current user location
			the callBack function should be called with nearest zone
			and the passed object will be as following
			{
				zoneNo: string
				zoneCategory: string eg: A,B,C,D .. etc
				distance: string distance in meters
			}
			*/
			setTimeout(function () {
				callBack({
					zoneNo: "314",
					zoneCategory: "C",
					distance: "20.3589775588"
				});
			}, 1000);
		},
		getParkingBalance: function (callBack) {
			/* get parking balance from back end
			 * if parking balance sceeded send the balance in the callback
			 * if backend error send null
			 * ex: callBack(balance);
			 */
			var balance = 294;
			setTimeout(function () {
				callBack(balance);
			}, 7000);
		},
		getParkingCashedBalance: function (callBack) {
			// parking balance from cashed / localstorage
			var balance = null;
			callBack(balance);
		},
		/////////////////////TRAFFIC FILE NUMBER////////////////////////////////////////
		onLinkTrafficFileClick: function () {
			var shelllinkTFNPopup_Options = {
				popupId: "shelllinkTFNPopup",
				title: "Link traffic code number",
				content: "Link your traffic code number in order to view your Docs",
				primaryBtnText: "Link Now",
				primaryBtnCallBack: function () { },
				primaryBtnDisabled: false,
				secondaryBtnText: "Cancel",
				secondaryBtnCallBack: null,
				secondaryBtnVisible: true,
				secondaryBtnDisabled: false,
				hideOnPrimaryClick: true,
				hideOnSecondaryClick: true,
				aroundClickable: true,
				onAroundClick: null
			}

			var shelllinkTFNPopup = new Popup(shelllinkTFNPopup_Options);
			shelllinkTFNPopup.show();
		},
		getTrafficFileNumber: function () {
			var trafficNo = null;
			try { trafficNo = UserProfileModel.getUserProfile().Users[0].traffic_number; } catch (e) { }
			return trafficNo;
		},
		/////////////////////FINES TILES////////////////////////////////////////
		onPayAFineBtnClick: function () {
			alert("onPayAFineBtnClick");
		},
		onPayForFriendClick: function () {
			alert("onPayForFriendClick");
		},
		onPayNowBtnClick: function () {
			alert("onPayNowBtnClick");
		},
		getCashedFines: function (callBack) {
			//gets total fines amount from cashe
			//send 0 or null in the callback if there is no fines
			callBack(1150);
		},
		getFines: function (callBack) {
			//gets total fines amount from backend
			setTimeout(function () {
				//send the balance in the callback and null in case of backend error
				callBack(-1);
			}, 7000);
		},
		/////////////////////Vehicle Tile////////////////////////////////////////
		getCashedVehicles: function (callBack) {
			var vehicles = [{
				carLogo: "../../common/images/shell/mercedesLogo.png", // url to the image or base64,
				carName: "Mercedes S500",
				expiryDate: new Date(),//Date Object,
				plate: {
					plateNo: "53316",
					plateCode: "K",
					plateSource: "Kuwait"
				},
			}/*,
			{
				carLogo: "../../common/images/shell/mercedesLogo.png", // url to the image or base64,
				carName: "Mercedes S500",
				expiryDate: new Date(),//Date Object,
				plate: {
					plateNo: "53316",
					plateCode: "K",
					plateSource: "Bahrain"
				},
			}*/];
			callBack(vehicles);
		},
		getVehicles: function (callBack) {
			var vehicles = [
							{
								carLogo: "../../common/images/shell/mercedesLogo.png", // url to the image or base64,
								carName: "Mercedes S500",
								expiryDate: new Date(),//Date Object,
								plate: {
									plateNo: "53316",
									plateCode: "T",
									plateSource: "Dubai",
									isDubaiMotorcycle:true
								},
							},
							{
								carLogo: "../../common/images/shell/mercedesLogo.png", // url to the image or base64,
								carName: "Mercedes S500",
								expiryDate: new Date(),//Date Object,
								plate: {
									plateNo: "533",
									plateCode: "D",
									plateSource: "Abu Dhabi"
								},
							}, {
								carLogo: "../../common/images/shell/mercedesLogo.png", // url to the image or base64,
								carName: "Mercedes S500",
								expiryDate: new Date(),//Date Object,
								plate: {
									plateNo: "16",
									plateCode: "J",
									plateSource: "Sharjah",
									isDubaiLogo: true
								},
							},
							{
								carLogo: "../../common/images/shell/mercedesLogo.png", // url to the image or base64,
								carName: "Mercedes S500",
								expiryDate: new Date(),//Date Object,
								plate: {
									plateNo: "53316",
									plateCode: "A",
									plateSource: "Ajman"
								},
							},
							{
								carLogo: "../../common/images/shell/mercedesLogo.png", // url to the image or base64,
								carName: "Mercedes S500",
								expiryDate: new Date(),//Date Object,
								plate: {
									plateNo: "516",
									plateCode: "A",
									plateSource: "Umm AlQuwain"
								},
							},
							{
								carLogo: "../../common/images/shell/mercedesLogo.png", // url to the image or base64,
								carName: "Mercedes S500",
								expiryDate: new Date(),//Date Object,
								plate: {
									plateNo: "16",
									plateCode: "A",
									plateSource: "Ras Al Khaymah"
								},
							},
							
							{
								carLogo: "../../common/images/shell/mercedesLogo.png", // url to the image or base64,
								carName: "Mercedes S500",
								expiryDate: new Date(),//Date Object,
								plate: {
									plateNo: "53316",
									plateCode: "A",
									plateSource: "Al Fujairah"
								},
							},
							{
								carLogo: "../../common/images/shell/mercedesLogo.png", // url to the image or base64,
								carName: "Mercedes S500",
								expiryDate: new Date(),//Date Object,
								plate: {
									plateNo: "53316",
									plateCode: "K",
									plateSource: "KSA"
								},
							},
							{
								carLogo: "../../common/images/shell/mercedesLogo.png", // url to the image or base64,
								carName: "Mercedes S500",
								expiryDate: new Date(),//Date Object,
								plate: {
									plateNo: "53316",
									plateCode: "K",
									plateSource: "Kuwait"
								},
							},
							{
								carLogo: "../../common/images/shell/mercedesLogo.png", // url to the image or base64,
								carName: "Mercedes S500",
								expiryDate: new Date(),//Date Object,
								plate: {
									plateNo: "53316",
									plateCode: "K",
									plateSource: "Bahrain"
								},
							},
							{
								carLogo: "../../common/images/shell/mercedesLogo.png", // url to the image or base64,
								carName: "Mercedes S500",
								expiryDate: new Date(),//Date Object,
								plate: {
									plateNo: "53316",
									plateCode: "K",
									plateSource: "Oman"
								},
							}
							
						];

			setTimeout(function () {
				callBack(vehicles);
			}, 5000);

		},
		/////////////////////Plates Tile////////////////////////////////////////
		onPlatesForSaleBtnClick: function () {
			alert("onPlatesForSaleBtnClick");
		},
		getCashedPlatesForSale: function (callBack) {
			var plates = [{
				plateNo: "007",
				plateCode: "J",
				plateSource: "Dubai"
			}, {
				plateNo: "6666",
				plateCode: "S",
				plateSource: "Dubai"
			}];

			callBack(plates);
		},
		getPlatesForSale: function (callBack) {
			var plates = [{
				plateNo: "007",
				plateCode: "J",
				plateSource: "Dubai"
			}, {
				plateNo: "6666",
				plateCode: "S",
				plateSource: "Dubai"
			}];
			setTimeout(function () {
				callBack(plates);
			}, 2000);

		},
		/////////////////////Docs tile////////////////////////////////////////
		onApplyFormCertClick: function () {
			alert("onApplyFormCertClick");
		},
		//////////////////////Salik tile//////////////////////////////////////
		onLinkSalikBtnClick: function () {
			alert("onLinkSalikBtnClick");
		},
		onRechargeBtnClick: function () {
			alert("onRechargeBtnClick");
		},
		// onLinkSalikBtnClickForGuest:function(){
		// 	alert("onLinkSalikBtnClickForGuest");
		// },
		onViewDisputeBtnClick: function (disputeNumber) {
			alert("disputeNumber is : " + disputeNumber)
		},
		onViewViolationBtnClick: function (violationNumber) {
			alert("disputeNumber is : " + violationNumber)
		},
		getCashedSalikBalance: function (callback) {
			//			callback(150);
			var accountDetails = {
				accountNumber: "511516156",
				balance: "50,399"
			};
			//			callback(null);
			callback(accountDetails);
		},
		getSalikBalance: function (callback) {
			setTimeout(function () {
				//return null of be issue
				// callback(-1); in case of the user not Linked

				var accountDetails = {
					accountNumber: "511516156",
					balance: "50,399".replace(/,/g, "")
				};
				callback(accountDetails);
			}, 5500);
		},
		getCachedSalikViolation: function (callback) {
			var violationDetails = {
				violationNumber: "12345678",
				violationAmount: "50",
				plate: {
					plateNo: "5555",
					plateCode: "J",
					plateSource: "Bahrain"
				}
			};
			//			callback(null);
			callback(violationDetails);

		},
		getSalikViolation: function (callback) {
			setTimeout(function () {
				var violationDetails = {
					violationNumber: "12345678",
					violationAmount: "50",
					plate: {
						plateNo: "666",
						plateCode: "T",
						plateSource: "Dubai"
						
					}
				};
				//return null of be issue
				//				callback({});
				callback(violationDetails);
			}, 6000);
		},
		getCachedSalikDispute: function (callback) {
			// if no cache return empty object {}  === callback({})
			//if there is recent dispute return it like below object === callback(disputeDetails)
			var disputeDetails = {
				disputeNumber: "1089472128",
				disputeDate: "20/10/2017"
			};
			callback(disputeDetails);
		},
		getSalikDispute: function (callback) {
			// if no dispute return empty object {}  === callback({})
			//if Be error return null
			//if there is recent dispute return it like below object === callback(disputeDetails)

			setTimeout(function () {
				var disputeDetails = {
					disputeNumber: "1089472128",
					disputeDate: "01/12/2018"
				};
				//return null of be issue
				//				callback({});
				callback(disputeDetails);
			}, 7000);

		},
		///////////////////////Drive Mode Tile///////////////////////////////
		openDriveMode: function (data) {

		},
		openDriveModeDirections: function (data) {
			alert("directions");
		},
		openDriveModeDirectionsForContactRTA: function (data) {
			alert("directions");
		},
		onUpdateMobileNumber: function (linkingAttribute) {
			console.log(linkingAttribute)

			if (!isUndefinedOrNullOrBlank(linkingAttribute))
				UserProfileModel.updateServiceRelatedInfoByKey("MPARKING", linkingAttribute)

		}, openEnquirePage: function () {
			alert("openEnquirePage");
		},
		///////////////////////Driver Tile///////////////////////////////
		onLinkBtnDriverTileClick: function () {
			alert("onLinkBtnDriverTileClick");
		},
		getCashedLicenseAndPermitDetails: function (callback) {
			//Getting data from the cache
			// licenseDetails and permitDetails is required to be filled by app team 
			// licenseDetails object contain licenseNumber,blackpoints, isToExpire,expiredate
			// permitDetails object contain permitNumber,classType, isToExpire,expiredate
			// licenseNumber is driver license number 
			// blackpoints are the number of driver black points  
			// isToExpire is boolean (true , false ) should be true in case of the license or the permit to expire soon


			var licenseDetails = {
				licenseNumber: "63617832",
				blackpoints: "5",
				isToExpire: false,
				expiredate: (getApplicationLanguage() == 'en') ? "10/12/2018" : "10/12/2018", //it should be with the following format "Mar 12th 2017" in english and in arabic "12 مارس 2017"
			}
			var permitDetails = {
				permitNumber: "63617832",
				classType: "LMVA Regular Class",
				isToExpire: true,
				expiredate: (getApplicationLanguage() == 'en') ? "10/12/2018" : "10/12/2018", //it should be with the following format "Mar 12th 2017" in english and in arabic "12 مارس 2017"
			}

			// Case 1 : there is license and permit
			var driverTileDetails = {
				licenseDetails:licenseDetails,
				permitDetails:permitDetails
			}
			callback(driverTileDetails);

			// Case 2 : there is license and no permit
			// var driverTileDetails = {
			// 	licenseDetails:licenseDetails
			// }
			//callback(driverTileDetails);

			// Case 3 : there is no license and have permit
			// var driverTileDetails = {
			// 	permitDetails:permitDetails
			// }
			//callback(driverTileDetails);

			// Case 4 : there is no license and no permit
			// callback(null);

			//Case 5 : there is no cached data
			// callback(null);
		},
		getLicenseAndPermitDetails: function (callback) {
			//Getting the data from BE
			var licenseDetails = {
				licenseNumber: "63617831",
				blackpoints: "2",
				isToExpire: true,
				expiredate: (getApplicationLanguage() == 'en') ? "11/12/2018" : "11/12/2018", //it should be with the following format "Mar 12th 2017" in english and in arabic "12 مارس 2017"
			}
			var permitDetails = {
				permitNumber: "123456789",
				classType: "LMVA Regular Class 2",
				isToExpire: false,
				expiredate: (getApplicationLanguage() == 'en') ? "11/12/2018" : "11/12/2018", //it should be with the following format "Mar 12th 2017" in english and in arabic "12 مارس 2017"
			}
			var driverTileDetails = {
					licenseDetails:licenseDetails,
					permitDetails:permitDetails
			}





			// Case 1 : there is license and permit
			// var driverTileDetails = {
			// 	licenseDetails:licenseDetails,
			// 	permitDetails
			// }
			// setTimeout(function () {
			// 	callback(driverTileDetails);
			// }, 5000);

			// Case 2 : there is license and no permit
			// var driverTileDetails = {
			// 	licenseDetails:licenseDetails
			// }
			//callback(driverTileDetails);

			// Case 3 : there is no license and have permit
			// var driverTileDetails = {
			// 	permitDetails:permitDetails
			// }
			//callback(driverTileDetails);

			// Case 4 : there is error
			// callback(null);

			//Case 5 : there is no cached data
			// setTimeout(function () {
			// 	callback(null);
			// }, 5000);

			// Case 6 : there is no Dubai license and no permit and have traffic file number
			
			setTimeout(function () {
				callback({});
			}, 5000);
		},
	});

	return DVDashboardModel;
});
