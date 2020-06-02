define(["com/models/Constants",
        "com/models/shell/UserProfileModel",
        "com/models/shell/AuthenticationModel",
        "com/models/corporates/CorporateDashboardModel"
        ], function (Constants, UserProfileModel, AuthenticationModel, CorporateDashboardModel) {

	var DashboardModel = Backbone.Model.extend({

	}, {
		isLoggedin: false,
		dashboardConfig: [],
		dashboardConfigGuest: [],
		dashboardConfigLogin: [],
		getDeviceState: function () {
			//TODO get device internet connectivity and GPS connectivity

			var isOnline = navigator.onLine;
			return {
				internetOnline: isOnline,
				GPSOnline: true,
			}
		},
		isUserLoggedIn: function () {
			return AuthenticationModel.isAuthenticated();
		},
		isLocationEnabled: function (callBack) {
			navigator.geolocation.getCurrentPosition(
					function (e) { callBack(true, e); },
					function (e) { callBack(false, e); },
					{
						maximumAge: 3000,
						timeout: 3000,
						enableHighAccuracy: false
					}
			);
		},
		getCorporateFines:function(callback){
			CorporateDashboardModel.getCorporateFines(callback);
		},
		/*
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * *******************************eNOC***************************************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 */
		eNocGuestControl:function(el){
			el.getElementsByClassName("eNOCLogin")[0].onclick =function(e){
				e.preventDefault();
				e.stopPropagation();
				CorporateDashboardModel.eNOCLogin(e);
			}

//			el.querySelector(".eNOCLogin").onclick =function(e){
//			e.preventDefault();
//			e.stopPropagation();
//			CorporateDashboardModel.eNOCLogin(e);
//			}
		},
		eNocLoggedInControl:function (el){

			el.getElementsByClassName("eNOCViewStatus")[0].onclick =function(e){
				e.preventDefault();
				e.stopPropagation();
				CorporateDashboardModel.eNOCViewStatus(e);
			}
			DashboardViewModel.eNocTile.showLoading();

			//counter setup 
			var options = {
					useEasing: false,
					useGrouping: true,
					separator: ',',
					decimal: '.',
					prefix: '',
					suffix: ''
			};
			var eNocUpdated = false;

			var balanceCounter = new CountUp(el.querySelector("#apps-count"), 100, 999, 0, 2, options);

			var runCounter = function () {
				if (!eNocUpdated) {
					var start, end;
					if (el.querySelector("#apps-count").innerText > 100) {
						start = 999;
						end = 100;
					} else {
						start = 100;
						end = 999;
					}
					balanceCounter = new CountUp(el.querySelector("#apps-count"), start, end, 0, 2, options);
					balanceCounter.start(runCounter);
				}
			}

			balanceCounter.start(runCounter);

			//check if the user is authorized
			CorporateDashboardModel.isAuthorizedForENOC(function (result){
				//check for authorization
				if (result.isAuthorized){
					CorporateDashboardModel.getCachedENOC(function (cachedENOC){
						if (cachedENOC != null && cachedENOC != undefined) {
							// Cache Found
							// show data from cache
							if (cachedENOC.appCounts > 0) {
								eNocUpdated = true;
								balanceCounter = new CountUp(el.querySelector("#apps-count"), 100, cachedENOC.appCounts, 0, 2, options);
								balanceCounter.start();
							}
							CorporateDashboardModel.getENOC(function (eNocs){
								if(!document.getElementById("dashboardPage"))return;
								//check the back end		
								if (eNocs != null && eNocs != undefined) {
									// binding the number of ENOCs
									//eNoc should return number here
									eNocUpdated = true;
									DashboardViewModel.eNocTile.hideLoading();
									if (eNocs.appCounts > 0) {
										balanceCounter = new CountUp(el.querySelector("#apps-count"),  cachedENOC.appCounts, eNocs.appCounts, 0, 2, options);
										balanceCounter.start();
										el.querySelector("#last-months").innerHTML=eNocs.lastMonths;
									} else {
										DashboardViewModel.eNocTile.template="NoNOCs";
									}

								} else {
									DashboardViewModel.eNocTile.hideLoading();
									eNocUpdated = true;
									DashboardViewModel.eNocTile.showReload();
									if(!(cachedENOC.appCounts > 0) ){
										balanceCounter = new CountUp(el.querySelector("#apps-count"), 100, 0, 0, 2, options);
										balanceCounter.start();
									}
								}
								DashboardViewModel.onReloadFinished();
							});

						}else {
							// No Cache state
							CorporateDashboardModel.getENOC(function (eNocs){
								if(!document.getElementById("dashboardPage"))return;
								//check the back end		
								if (eNocs != null && eNocs != undefined) {
									// binding the number of ENOCs
									//eNoc should return number here
									eNocUpdated = true;
									DashboardViewModel.eNocTile.hideLoading();
									if (eNocs.appCounts > 0) {
										balanceCounter = new CountUp(el.querySelector("#apps-count"), 100, eNocs.appCounts, 0, 2, options);
										balanceCounter.start();
										el.querySelector("#last-months").innerHTML=eNocs.lastMonths;
									} else {
										DashboardViewModel.eNocTile.template="NoNOCs";
									}

								} else {
									DashboardViewModel.eNocTile.hideLoading();
									eNocUpdated = true;
									balanceCounter = new CountUp(el.querySelector("#apps-count"), 100, 0, 0, 2, options);
									balanceCounter.start();
									DashboardViewModel.eNocTile.showReload();
									//show reload
								}
								DashboardViewModel.onReloadFinished();
							});
						}
					});
				}else {
					DashboardViewModel.eNocTile.hideLoading();
					DashboardViewModel.eNocTile.template="NotAuthorized";
				}

			});

			this.reload = function(callBack){
				DashboardViewModel.eNocTile.showLoading();
				CorporateDashboardModel.getENOC(function (eNocs){
					if(!document.getElementById("dashboardPage"))return;
					//check the back end		
					if (eNocs != null && eNocs != undefined) {
						callBack(true,DashboardViewModel.eNocTile);
						DashboardViewModel.eNocTile.hideLoading();
						if (eNocs.appCounts > 0) {
							balanceCounter = new CountUp(el.querySelector("#apps-count"), el.querySelector("#apps-count").innerText, eNocs.appCounts, 0, 2, options);
							balanceCounter.start();
							el.querySelector("#last-months").innerHTML=eNocs.lastMonths;
						} else {
							DashboardViewModel.eNocTile.template="NoNOCs";
						}

					} else {
						callBack(false,DashboardViewModel.eNocTile);
						DashboardViewModel.eNocTile.hideLoading();
						//show reload
					}
					DashboardViewModel.onReloadFinished();
				});
			}
		},
		/*
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * *******************************eWallet***************************************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 */
		eWalletGuestControl:function(el){
			el.querySelector(".linkEWallet").onclick =function(e){
				e.preventDefault();
				e.stopPropagation();
				CorporateDashboardModel.linkEWallet(e);
			}
		},
		eWalletLoggedInControl:function (el){
			el.getElementsByClassName("eWalletLinkMore")[0].onclick =function(e){
				e.preventDefault();
				e.stopPropagation();
				CorporateDashboardModel.eWalletLinkMore(e);
			}
			DashboardViewModel.eWalletTile.showLoading();

			//counter setup 
			var options = {
					useEasing: false,
					useGrouping: true,
					separator: ',',
					decimal: '.',
					prefix: '',
					suffix: ''
			};
			var eWalletUpdated = false;

			var balanceCounter = new CountUp(el.querySelector("#apps-count"), 100, 999, 0, 2, options);

			var runCounter = function () {
				if (!eWalletUpdated) {
					var start, end;
					if (el.querySelector("#apps-count").innerText > 100) {
						start = 999;
						end = 100;
					} else {
						start = 100;
						end = 999;
					}
					balanceCounter = new CountUp(el.querySelector("#apps-count"), start, end, 0, 2, options);
					balanceCounter.start(runCounter);
				}
			}

			balanceCounter.start(runCounter);



			CorporateDashboardModel.getCachedEWalletBalance(function (cachedEWalletBalance){
				if (cachedEWalletBalance != null && cachedEWalletBalance != undefined) {
					// Cache Found
					// show data from cache
					if (cachedEWalletBalance.eWalletBalance > 0) {
						eWalletUpdated = true;
						balanceCounter = new CountUp(el.querySelector("#apps-count"), 100, cachedEWalletBalance.eWalletBalance, 0, 2, options);
						balanceCounter.start();
					}
					CorporateDashboardModel.getEWalletBalance(function (eWalletBalanceResult){
						if(!document.getElementById("dashboardPage"))return;
						//check the back end		
						if (eWalletBalanceResult != null && eWalletBalanceResult != undefined) {
							
							eWalletUpdated = true;
							DashboardViewModel.eWalletTile.hideLoading();
							if (eWalletBalanceResult.eWalletBalance > 0) {
								balanceCounter = new CountUp(el.querySelector("#apps-count"),  cachedEWalletBalance.eWalletBalance, eWalletBalanceResult.eWalletBalance, 0, 2, options);
								balanceCounter.start();
							} else {
								balanceCounter = new CountUp(el.querySelector("#apps-count"), 100, 0, 0, 2, options);
								balanceCounter.start();
							}

						} else {
							DashboardViewModel.eWalletTile.hideLoading();
							eWalletUpdated = true;
							DashboardViewModel.eWalletTile.showReload();
							if(!(cachedEWalletBalance.eWalletBalance > 0) ){
								balanceCounter = new CountUp(el.querySelector("#apps-count"), 100, 0, 0, 2, options);
								balanceCounter.start();
							}
						}
						DashboardViewModel.onReloadFinished();
					});

				}else {
					// No Cache state
					CorporateDashboardModel.getEWalletBalance(function (eWalletBalanceResult){
						if(!document.getElementById("dashboardPage"))return;
						//check the back end		
						if (eWalletBalanceResult != null && eWalletBalanceResult != undefined) {
		
							eWalletUpdated = true;
							DashboardViewModel.eWalletTile.hideLoading();
							if (eWalletBalanceResult.eWalletBalance > 0) {
								balanceCounter = new CountUp(el.querySelector("#apps-count"), 100, eWalletBalanceResult.eWalletBalance, 0, 2, options);
								balanceCounter.start();
							} else {
								balanceCounter = new CountUp(el.querySelector("#apps-count"), 100, 0, 0, 2, options);
								balanceCounter.start();
							}

						} else {
							DashboardViewModel.eWalletTile.hideLoading();
							eWalletUpdated = true;
							balanceCounter = new CountUp(el.querySelector("#apps-count"), 100, 0, 0, 2, options);
							balanceCounter.start();
							DashboardViewModel.eWalletTile.showReload();
							//show reload
						}
						DashboardViewModel.onReloadFinished();
					});
				}
			});



			this.reload = function(callBack){
				DashboardViewModel.eWalletTile.showLoading();
				CorporateDashboardModel.getEWalletBalance(function (eWalletBalanceResult){
					if(!document.getElementById("dashboardPage"))return;
					//check the back end		
					if (eWalletBalanceResult != null && eWalletBalanceResult != undefined) {
						callBack(true,DashboardViewModel.eWalletTile);
						DashboardViewModel.eWalletTile.hideLoading();
						var counterStart= 0;
						if (el.querySelector("#apps-count").innerText)
						counterStart=parseInt(el.querySelector("#apps-count").innerText.replace(',',''));
						if (eWalletBalanceResult.eWalletBalance > 0) {
							balanceCounter = new CountUp(el.querySelector("#apps-count"),counterStart,eWalletBalanceResult.eWalletBalance,0, 2, options);
							balanceCounter.start();
						} else {
							balanceCounter = new CountUp(el.querySelector("#apps-count"), 100, 0, 0, 2, options);
							balanceCounter.start();
						}

					} else {
						callBack(false,DashboardViewModel.eWalletTile);
						DashboardViewModel.eWalletTile.hideLoading();
						//show reload
					}
					DashboardViewModel.onReloadFinished();
				});
			}




		},
		/*
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * *******************************Fines**************************************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 */
		finesGuestControl:function(el){
			el.querySelector(".finesTileLogin").onclick =function(e){
				e.preventDefault();
				e.stopPropagation();
				CorporateDashboardModel.finesTileLogin(e);
			}
		},
		finesLoggedInControl:function (el){
			DashboardViewModel.finesTile.showLoading();
			//counter setup 
			var options = {
					useEasing: false,
					useGrouping: true,
					separator: ',',
					decimal: '.',
					prefix: '',
					suffix: ''
			};
			var finesUpdated = false;

			var balanceCounter = new CountUp(el.querySelector("#apps-count"), 100, 999, 0, 2, options);

			var runCounter = function () {
				if (!finesUpdated) {
					var start, end;
					if (el.querySelector("#apps-count").innerText > 100) {
						start = 999;
						end = 100;
					} else {
						start = 100;
						end = 999;
					}
					balanceCounter = new CountUp(el.querySelector("#apps-count"), start, end, 0, 2, options);
					balanceCounter.start(runCounter);
				}
			}

			balanceCounter.start(runCounter);



			CorporateDashboardModel.getCachedFines(function (cachedFines){
				if (cachedFines != null && cachedFines != undefined) {
					// Cache Found
					// show data from cache
					if (cachedFines.finesAmount) {
						finesUpdated = true;
						balanceCounter = new CountUp(el.querySelector("#apps-count"), 100, cachedFines.finesAmount, 0, 2, options);
						balanceCounter.start();
					}
					CorporateDashboardModel.getFines(function (fines){
						if(!document.getElementById("dashboardPage"))return;
						//check the back end		
						if (fines != null && fines != undefined) {
							
							finesUpdated = true;
							DashboardViewModel.finesTile.hideLoading();
							if (fines.finesAmount) {
								balanceCounter = new CountUp(el.querySelector("#apps-count"),  cachedFines.finesAmount, fines.finesAmount, 0, 2, options);
								balanceCounter.start();
								el.querySelector("#expireDate").innerHTML=fines.blackPoints;

							} else {
								balanceCounter = new CountUp(el.querySelector("#apps-count"), 100, 0, 0, 2, options);
								balanceCounter.start();
							}

						} else {
							DashboardViewModel.finesTile.hideLoading();
							finesUpdated = true;
							DashboardViewModel.finesTile.showReload();
							if(!(cachedFines.eWalletBalance > 0) ){
								balanceCounter = new CountUp(el.querySelector("#apps-count"), 100, 0, 0, 2, options);
								balanceCounter.start();
							}
						}
						DashboardViewModel.onReloadFinished();
					});

				}else {
					// No Cache state
					CorporateDashboardModel.getFines(function (fines){
						if(!document.getElementById("dashboardPage"))return;
						//check the back end		
						if (fines != null && fines != undefined) {
		
							finesUpdated = true;
							DashboardViewModel.finesTile.hideLoading();
							if (fines.finesAmount) {
								balanceCounter = new CountUp(el.querySelector("#apps-count"), 100, fines.finesAmount, 0, 2, options);
								balanceCounter.start();
								el.querySelector("#expireDate").innerHTML=fines.blackPoints;
								 
							} else {
								balanceCounter = new CountUp(el.querySelector("#apps-count"), 100, 0, 0, 2, options);
								balanceCounter.start();
							}

						} else {
							DashboardViewModel.finesTile.hideLoading();
							finesUpdated = true;
							balanceCounter = new CountUp(el.querySelector("#apps-count"), 100, 0, 0, 2, options);
							balanceCounter.start();
							DashboardViewModel.finesTile.showReload();
							//show reload
						}
						DashboardViewModel.onReloadFinished();
					});
				}
			});



			this.reload = function(callBack){
				DashboardViewModel.finesTile.showLoading();
				CorporateDashboardModel.getFines(function (fines){
					if(!document.getElementById("dashboardPage"))return;
					//check the back end		
					if (fines != null && fines != undefined) {
						callBack(true,DashboardViewModel.eWalletTile);
						DashboardViewModel.finesTile.hideLoading();
						var counterStart= 0;
						if (el.querySelector("#apps-count").innerText)
						counterStart=parseInt(el.querySelector("#apps-count").innerText.replace(',',''));
						if (fines.finesAmount) {
							balanceCounter = new CountUp(el.querySelector("#apps-count"),counterStart,fines.finesAmount,0, 2, options);
							balanceCounter.start();
						} else {
							balanceCounter = new CountUp(el.querySelector("#apps-count"), 100, 0, 0, 2, options);
							balanceCounter.start();
						}

					} else {
						callBack(false,DashboardViewModel.finesTile);
						DashboardViewModel.finesTile.hideLoading();
						//show reload
					}
					DashboardViewModel.onReloadFinished();
				});
			}

		},
		/*
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * *******************************commercial Transport***************************************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 */
		commercialTransportGuestControl:function(el){
			el.querySelector(".commercialTransportLogin").onclick =function(e){
				e.preventDefault();
				e.stopPropagation();
				CorporateDashboardModel.commercialTransportLogin(e);
			}
		},
		commercialTransportControl:function (el){
			DashboardViewModel.commercialTransportTile.showLoading();
			
						//counter setup 
			var options = {
					useEasing: false,
					useGrouping: true,
					separator: ',',
					decimal: '.',
					prefix: '',
					suffix: ''
			};
			var commercialTransportUpdated = false;

			var balanceCounter = new CountUp(el.querySelector("#apps-count"), 100, 999, 0, 2, options);

			var runCounter = function () {
				if (!commercialTransportUpdated) {
					var start, end;
					if (el.querySelector("#apps-count").innerText > 100) {
						start = 999;
						end = 100;
					} else {
						start = 100;
						end = 999;
					}
					balanceCounter = new CountUp(el.querySelector("#apps-count"), start, end, 0, 2, options);
					balanceCounter.start(runCounter);
				}
			}
			
			balanceCounter.start(runCounter);


			CorporateDashboardModel.getCachedCommercialIssuedLicenses(function (cachedIssuedLicenses){
				if (cachedIssuedLicenses != null && cachedIssuedLicenses != undefined) {
					// Cache Found
					// show data from cache
					if (cachedIssuedLicenses.issuedLicenses > 0) {
						commercialTransportUpdated = true;
						balanceCounter = new CountUp(el.querySelector("#apps-count"), 100, cachedIssuedLicenses.issuedLicenses, 0, 2, options);
						balanceCounter.start();


						if(cachedIssuedLicenses.expireDate){
							el.querySelector(".expiryDate").innerHTML=cachedIssuedLicenses.expireDate;
							setTimeout(function(){el.querySelector(".expiryCont").style.transform="translate3d(0,0,0)";},1700);
						}
					}
					CorporateDashboardModel.getCommercialIssuedLicenses(function (issuedLicensesResult){
						if(!document.getElementById("dashboardPage"))return;
						//check the back end		
						if (issuedLicensesResult != null && issuedLicensesResult != undefined) {
							
							commercialTransportUpdated = true;
							DashboardViewModel.commercialTransportTile.hideLoading();
							if (issuedLicensesResult.issuedLicenses > 0) {
								balanceCounter = new CountUp(el.querySelector("#apps-count"),  cachedIssuedLicenses.issuedLicenses, issuedLicensesResult.issuedLicenses, 0, 2, options);
								balanceCounter.start();
								if(issuedLicensesResult.expireDate){
									el.querySelector(".expiryDate").innerHTML=issuedLicensesResult.expireDate;
									setTimeout(function(){el.querySelector(".expiryCont").style.transform="translate3d(0,0,0)";},1700);
								}
							} else {
								setTimeout(function(){el.querySelector(".expiryCont").style.transform="translate3d(0,50px,0)";},1700);								
								balanceCounter = new CountUp(el.querySelector("#apps-count"), 100, 0, 0, 2, options);
								balanceCounter.start();
							}

						} else {
							
							DashboardViewModel.commercialTransportTile.hideLoading();
							commercialTransportUpdated = true;
							DashboardViewModel.commercialTransportTile.showReload();
							if(!(cachedIssuedLicenses.issuedLicenses > 0) ){
								balanceCounter = new CountUp(el.querySelector("#apps-count"), 100, 0, 0, 2, options);
								balanceCounter.start();
							}
						}
						DashboardViewModel.onReloadFinished();
					});

				}else {
					// No Cache state
					CorporateDashboardModel.getCommercialIssuedLicenses(function (issuedLicensesResult){
						if(!document.getElementById("dashboardPage"))return;
						//check the back end		
						if (issuedLicensesResult != null && issuedLicensesResult != undefined) {
		
							commercialTransportUpdated = true;
							DashboardViewModel.commercialTransportTile.hideLoading();
							
							if (issuedLicensesResult.issuedLicenses > 0) {
								balanceCounter = new CountUp(el.querySelector("#apps-count"), 100, issuedLicensesResult.issuedLicenses, 0, 2, options);
								balanceCounter.start();

								if(issuedLicensesResult.expireDate){
									el.querySelector(".expiryDate").innerHTML=issuedLicensesResult.expireDate;
									setTimeout(function(){el.querySelector(".expiryCont").style.transform="translate3d(0,0,0)";},1700);
								}



							} else {
								balanceCounter = new CountUp(el.querySelector("#apps-count"), 100, 0, 0, 2, options);
								balanceCounter.start();
							}

						} else {
							DashboardViewModel.commercialTransportTile.hideLoading();
							commercialTransportUpdated = true;
							balanceCounter = new CountUp(el.querySelector("#apps-count"), 100, 0, 0, 2, options);
							balanceCounter.start();
							DashboardViewModel.commercialTransportTile.showReload();
							//show reload
						}
						DashboardViewModel.onReloadFinished();
					});
				}
			});

			this.reload = function(callBack){
				DashboardViewModel.commercialTransportTile.showLoading();
				CorporateDashboardModel.getCommercialIssuedLicenses(function (issuedLicensesResult){
					if(!document.getElementById("dashboardPage"))return;
					//check the back end		
					if (issuedLicensesResult != null && issuedLicensesResult != undefined) {
						callBack(true,DashboardViewModel.commercialTransportTile);
						DashboardViewModel.commercialTransportTile.hideLoading();
						var counterStart= 0;
						if (el.querySelector("#apps-count").innerText)
						counterStart=parseInt(el.querySelector("#apps-count").innerText.replace(',',''));
						if (issuedLicensesResult.issuedLicenses > 0) {
							balanceCounter = new CountUp(el.querySelector("#apps-count"), counterStart, issuedLicensesResult.issuedLicenses, 0, 2, options);
							balanceCounter.start();

							if(issuedLicensesResult.expireDate){
								el.querySelector(".expiryDate").innerHTML=issuedLicensesResult.expireDate;
								setTimeout(function(){el.querySelector(".expiryCont").style.transform="translate3d(0,0,0)";},1700);
							}
						} else {
							balanceCounter = new CountUp(el.querySelector("#apps-count"), 100, 0, 0, 2, options);
							balanceCounter.start();
						}

					} else {
						callBack(false,DashboardViewModel.commercialTransportTile);
						DashboardViewModel.commercialTransportTile.hideLoading();
						//show reload
					}
					DashboardViewModel.onReloadFinished();
				});
			}
		},

		/*
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * *******************************Vehcile Tile*******************************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 */

		getVehicleTileDashboard:function (){
			return CorporateDashboardModel.getVehicleTileDashboard();
		},
		vehicleGuestControl:function(el){
			el.querySelector(".vehicleLogin").onclick =function(e){
				e.preventDefault();
				e.stopPropagation();
				CorporateDashboardModel.vehicleLogin(e);
			}
		},
		vehiclesControl:function(el){

			DashboardViewModel.vehiclesTile.showLoading();
			
			var options = {
					useEasing: false,
					useGrouping: true,
					separator: ',',
					decimal: '.',
					prefix: '',
					suffix: ''
			};
			var vehiclesUpdated = false;

			var balanceCounter = new CountUp(el.querySelector("#apps-count"), 100, 999, 0, 2, options);

			var runCounter = function () {
				if (!vehiclesUpdated) {
					var start, end;
					if (el.querySelector("#apps-count").innerText > 100) {
						start = 999;
						end = 100;
					} else {
						start = 100;
						end = 999;
					}
					balanceCounter = new CountUp(el.querySelector("#apps-count"), start, end, 0, 2, options);
					balanceCounter.start(runCounter);
				}
			}
			
			balanceCounter.start(runCounter);


			CorporateDashboardModel.getCachedVehicles(function (cachedVehicles){
				if (cachedVehicles != null && cachedVehicles != undefined) {
					// Cache Found
					// show data from cache
					if (cachedVehicles.activeVehicles > 0) {
						vehiclesUpdated = true;
						balanceCounter = new CountUp(el.querySelector("#apps-count"), 100, cachedVehicles.activeVehicles, 0, 2, options);
						balanceCounter.start();


						if(cachedVehicles.expireVehicles){
							el.querySelector(".expiryDate").innerHTML=cachedVehicles.expireVehicles;
							setTimeout(function(){el.querySelector(".expiryCont").style.transform="translate3d(0,0,0)";},1700);
						}
					}
					CorporateDashboardModel.getVehicles(function (vehiclesResult){
						if(!document.getElementById("dashboardPage"))return;
						//check the back end		
						if (vehiclesResult != null && vehiclesResult != undefined) {
							
							vehiclesUpdated = true;
							DashboardViewModel.vehiclesTile.hideLoading();
							if (vehiclesResult.activeVehicles > 0) {
								balanceCounter = new CountUp(el.querySelector("#apps-count"),  cachedVehicles.activeVehicles, vehiclesResult.activeVehicles, 0, 2, options);
								balanceCounter.start();
								if(vehiclesResult.expireVehicles){
									el.querySelector(".expiryDate").innerHTML=vehiclesResult.expireVehicles;
									setTimeout(function(){el.querySelector(".expiryCont").style.transform="translate3d(0,0,0)";},1700);
								}
							} else {
								setTimeout(function(){el.querySelector(".expiryCont").style.transform="translate3d(0,50px,0)";},1700);								
								balanceCounter = new CountUp(el.querySelector("#apps-count"), 100, 0, 0, 2, options);
								balanceCounter.start();
							}

						} else {
							
							DashboardViewModel.vehiclesTile.hideLoading();
							vehiclesUpdated = true;
							DashboardViewModel.vehiclesTile.showReload();
							if(!(cachedVehicles.activeVehicles > 0) ){
								balanceCounter = new CountUp(el.querySelector("#apps-count"), 100, 0, 0, 2, options);
								balanceCounter.start();
							}
						}
						DashboardViewModel.onReloadFinished();
					});

				}else {
					// No Cache state
					CorporateDashboardModel.getVehicles(function (vehiclesResult){
						if(!document.getElementById("dashboardPage"))return;
						//check the back end		
						if (vehiclesResult != null && vehiclesResult != undefined) {
		
							vehiclesUpdated = true;
							DashboardViewModel.vehiclesTile.hideLoading();
							
							if (vehiclesResult.activeVehicles > 0) {
								balanceCounter = new CountUp(el.querySelector("#apps-count"), 100, vehiclesResult.activeVehicles, 0, 2, options);
								balanceCounter.start();

								if(vehiclesResult.expireVehicles){
									el.querySelector(".expiryDate").innerHTML=vehiclesResult.expireVehicles;
									setTimeout(function(){el.querySelector(".expiryCont").style.transform="translate3d(0,0,0)";},1700);
								}



							} else {
								balanceCounter = new CountUp(el.querySelector("#apps-count"), 100, 0, 0, 2, options);
								balanceCounter.start();
							}

						} else {
							DashboardViewModel.vehiclesTile.hideLoading();
							vehiclesUpdated = true;
							balanceCounter = new CountUp(el.querySelector("#apps-count"), 100, 0, 0, 2, options);
							balanceCounter.start();
							DashboardViewModel.vehiclesTile.showReload();
							//show reload
						}
						DashboardViewModel.onReloadFinished();
					});
				}
			});


			this.reload = function(callBack){
				DashboardViewModel.vehiclesTile.showLoading();
				CorporateDashboardModel.getVehicles(function (vehiclesResult){
					if(!document.getElementById("dashboardPage"))return;
					//check the back end		
					if (vehiclesResult != null && vehiclesResult != undefined) {
						callBack(true,DashboardViewModel.vehiclesTile);
						DashboardViewModel.vehiclesTile.hideLoading();
						var counterStart= 0;
						if (el.querySelector("#apps-count").innerText)
						counterStart=parseInt(el.querySelector("#apps-count").innerText.replace(',',''));
						if (vehiclesResult.activeVehicles > 0) {
							balanceCounter = new CountUp(el.querySelector("#apps-count"), counterStart, vehiclesResult.activeVehicles, 0, 2, options);
							balanceCounter.start();

							if(vehiclesResult.expireVehicles){
								el.querySelector(".expiryDate").innerHTML=vehiclesResult.expireVehicles;
								setTimeout(function(){el.querySelector(".expiryCont").style.transform="translate3d(0,0,0)";},1700);
							}
						} else {
							balanceCounter = new CountUp(el.querySelector("#apps-count"), 100, 0, 0, 2, options);
							balanceCounter.start();
						}

					} else {
						callBack(false,DashboardViewModel.vehiclesTile);
						DashboardViewModel.vehiclesTile.hideLoading();
						//show reload
					}
					DashboardViewModel.onReloadFinished();
				});
			}
		},
		/*
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * *******************************Plate Tile*******************************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 */
		getPlateTileDashboard:function (){
			return CorporateDashboardModel.getPlateTileDashboard();
		},
		plateGuestControl:function(el){
			el.querySelector(".plateLogin").onclick =function(e){
				e.preventDefault();
				e.stopPropagation();
				CorporateDashboardModel.plateLogin(e);
			}
		},
		plateControl:function(el){
			
			DashboardViewModel.platesTileCorporate.showLoading();
			
			var options = {
					useEasing: false,
					useGrouping: true,
					separator: ',',
					decimal: '.',
					prefix: '',
					suffix: ''
			};
			var platesUpdated = false;

			var balanceCounter = new CountUp(el.querySelector("#apps-count"), 100, 999, 0, 2, options);

			var runCounter = function () {
				if (!platesUpdated) {
					var start, end;
					if (el.querySelector("#apps-count").innerText > 100) {
						start = 999;
						end = 100;
					} else {
						start = 100;
						end = 999;
					}
					balanceCounter = new CountUp(el.querySelector("#apps-count"), start, end, 0, 2, options);
					balanceCounter.start(runCounter);
				}
			}
			
			balanceCounter.start(runCounter);


			CorporateDashboardModel.getCachedPlates(function (cachedPlates){
				if (cachedPlates != null && cachedPlates != undefined) {
					// Cache Found
					// show data from cache
					if (cachedPlates.activePlates > 0) {
						platesUpdated = true;
						balanceCounter = new CountUp(el.querySelector("#apps-count"), 100, cachedPlates.activePlates, 0, 2, options);
						balanceCounter.start();


						if(cachedPlates.expirePlates){
							el.querySelector(".expiryDate").innerHTML=cachedPlates.expirePlates;
							setTimeout(function(){el.querySelector(".expiryCont").style.transform="translate3d(0,0,0)";},1700);
						}
					}
					CorporateDashboardModel.getPlates(function (platesResult){
						if(!document.getElementById("dashboardPage"))return;
						//check the back end		
						if (platesResult != null && platesResult != undefined) {
							
							platesUpdated = true;
							DashboardViewModel.platesTileCorporate.hideLoading();
							if (platesResult.activePlates > 0) {
								balanceCounter = new CountUp(el.querySelector("#apps-count"),  cachedPlates.activePlates, platesResult.activePlates, 0, 2, options);
								balanceCounter.start();
								if(platesResult.expirePlates){
									el.querySelector(".expiryDate").innerHTML=platesResult.expirePlates;
									setTimeout(function(){el.querySelector(".expiryCont").style.transform="translate3d(0,0,0)";},1700);
								}
							} else {
								setTimeout(function(){el.querySelector(".expiryCont").style.transform="translate3d(0,50px,0)";},1700);								
								balanceCounter = new CountUp(el.querySelector("#apps-count"), 100, 0, 0, 2, options);
								balanceCounter.start();
							}

						} else {
							
							DashboardViewModel.platesTileCorporate.hideLoading();
							platesUpdated = true;
							DashboardViewModel.platesTileCorporate.showReload();
							if(!(cachedPlates.activePlates > 0) ){
								balanceCounter = new CountUp(el.querySelector("#apps-count"), 100, 0, 0, 2, options);
								balanceCounter.start();
							}
						}
						DashboardViewModel.onReloadFinished();
					});

				}else {
					// No Cache state
					CorporateDashboardModel.getPlates(function (platesResult){
						if(!document.getElementById("dashboardPage"))return;
						//check the back end		
						if (platesResult != null && platesResult != undefined) {
		
							platesUpdated = true;
							DashboardViewModel.platesTileCorporate.hideLoading();
							
							if (platesResult.activePlates > 0) {
								balanceCounter = new CountUp(el.querySelector("#apps-count"), 100, platesResult.activePlates, 0, 2, options);
								balanceCounter.start();

								if(platesResult.expirePlates){
									el.querySelector(".expiryDate").innerHTML=platesResult.expirePlates;
									setTimeout(function(){el.querySelector(".expiryCont").style.transform="translate3d(0,0,0)";},1700);
								}



							} else {
								balanceCounter = new CountUp(el.querySelector("#apps-count"), 100, 0, 0, 2, options);
								balanceCounter.start();
							}

						} else {
							DashboardViewModel.platesTileCorporate.hideLoading();
							platesUpdated = true;
							balanceCounter = new CountUp(el.querySelector("#apps-count"), 100, 0, 0, 2, options);
							balanceCounter.start();
							DashboardViewModel.platesTileCorporate.showReload();
							//show reload
						}
						DashboardViewModel.onReloadFinished();
					});
				}
			});


			this.reload = function(callBack){
				DashboardViewModel.platesTileCorporate.showLoading();
				CorporateDashboardModel.getPlates(function (platesResult){
					if(!document.getElementById("dashboardPage"))return;
					//check the back end		
					if (platesResult != null && platesResult != undefined) {
						callBack(true,DashboardViewModel.platesTileCorporate);
						DashboardViewModel.platesTileCorporate.hideLoading();
						var counterStart= 0;
						if (el.querySelector("#apps-count").innerText != "")
						counterStart=parseInt(el.querySelector("#apps-count").innerText.replace(',',''));
						if (platesResult.activePlates > 0) {
							balanceCounter = new CountUp(el.querySelector("#apps-count"), counterStart, platesResult.activePlates, 0, 2, options);
							balanceCounter.start();

							if(platesResult.expirePlates){
								el.querySelector(".expiryDate").innerHTML=platesResult.expirePlates;
								setTimeout(function(){el.querySelector(".expiryCont").style.transform="translate3d(0,0,0)";},1700);
							}
						} else {
							balanceCounter = new CountUp(el.querySelector("#apps-count"), 100, 0, 0, 2, options);
							balanceCounter.start();
						}

					} else {
						callBack(false,DashboardViewModel.platesTileCorporate);
						DashboardViewModel.platesTileCorporate.hideLoading();
						//show reload
					}
					DashboardViewModel.onReloadFinished();
				});
			}
		},
		/*
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * *******************************Traffic And Roads***************************************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 */
		trafficAndRoadsGuestControl:function(el){
			el.querySelector(".viewTrafficAndRoadsServices").onclick =function(e){
				e.preventDefault();
				e.stopPropagation();
				CorporateDashboardModel.viewTrafficAndRoadsServices(e);
			}
		},
		/*
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * *******************************Driver Licensing***************************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 */

		driverLicensingGuestControl:function(el){
			el.querySelector(".viewDriverLicensingServices").onclick =function(e){
				e.preventDefault();
				e.stopPropagation();
				CorporateDashboardModel.viewDriverLicensingServices(e);
			}
		},
		/*
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * *******************************Contracts and Purchasing*******************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 */
		contractsGuestControl:function(el){
			el.querySelector(".viewContractsSevices").onclick =function(e){
				e.preventDefault();
				e.stopPropagation();
				CorporateDashboardModel.viewContractsSevices(e);
			}
		},
		/*
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * *******************************Metro and Tram***************************************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 */
		metroGuestControl:function(el){
			el.querySelector(".viewMetroServices").onclick =function(e){
				e.preventDefault();
				e.stopPropagation();
				CorporateDashboardModel.viewMetroServices(e);
			}
//			DashboardViewModel.metroTile.showLoading();
		}
	});

	return DashboardModel;

});
