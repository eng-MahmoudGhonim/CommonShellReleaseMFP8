define(["com/utils/Utils"], function(Utils) {
  var CorporateDashboardModel = Backbone.Model.extend(
    {},
    {
      checkUserVerification: function(username, callback) {
        callback(username, true, function() {
          //show popup here
          console.log("USER IS NOT VERIFIED");
        });
        //			callback(username,true);
      },
      ///////////////////////////////eNoc Tile ///////////////////////////
      //events
      eNOCLogin: function(event) {
        // Guest eNOC login , write the logic here
        //alert("eNOCLogin")
        window.LoginViewControl.show();
      },
      eNOCViewStatus: function(event) {
        alert("eNOCViewStatus");
      },
      isAuthorizedForENOC: function(callback) {
        //call async , local storage
        setTimeout(function() {
          callback({ isAuthorized: true });
        }, 3000);
      },
      getENOC: function(callback) {
        // result should be number , null in case of backend error
        setTimeout(function() {
          //simulate that the BE return values
          //				callback({appCounts:800,lastMonths:3});
          //simulate that the BE doesn't return values
          callback({ appCounts: 0, lastMonths: 0 });
          //simulate that the BE return error failure
          //				callback(null);

          //trick to simulate the reload functionality
          //				window.counter=window.counter||1;
          //				if (window.counter>1){
          //				callback({appCounts:10,lastMonths:3});
          //				}else {
          //				window.counter++;
          //				callback(null);
          //				}
        }, 3000);
      },
      getCachedENOC: function(callback) {
        // result should be number , null in case of back end error

        //simulate that the Cache return values
        callback({ appCounts: 150, lastMonths: 6 });
        //simulate that the Cache doesn't return values
        //			callback({appCounts:0,lastMonths:0});
        //simulate that the Cache not found
        //			callback(null);
      },

      ///////////////////////////////eWallet Tile ///////////////////////////
      //events
      linkEWallet: function(event) {
        // Guest eNOC login , write the logic here
        alert("linkEWallet");
      },
      eWalletLinkMore: function(event) {
        // Guest eNOC login , write the logic here
        alert("eWalletLinkMore");
      },
      getEWalletBalance: function(callback) {
        //get from BE
        // in case of there is data from BE
        //			var object = {eWalletBalance:2500};
        //if there are returned data callback(object);
        //if no data object = {eWalletBalance:0} -> callback({}); -> show login tile with zero balance
        //if error object = null -> callback(object) -> show reload icon

        setTimeout(function() {
          //simulate that the BE return values
          // callback({eWalletBalance:2500});
          //simulate that the BE doesn't return values
          //				callback({eWalletBalance:0});
          //simulate that the BE return error failure
          //				callback(null);

          window.counter = window.counter || 1;
          if (window.counter > 1) {
            callback({ eWalletBalance: 2500 });
          } else {
            window.counter++;
            callback(null);
          }
        }, 3000);
      },

      getCachedEWalletBalance: function(callback) {
        // getLocalStorage //No need

        //simulate that the Cache return values
        callback({ eWalletBalance: 5400 });
        //simulate that the Cache doesn't return values
        //			callback({eWalletBalance:0});
        //simulate that the Cache not found
        //			callback(null);
      },

      ///////////////////////////////Commercial Transport Tile ///////////////////////////
      //events
      commercialTransportLogin: function(event) {
        //			alert("commercialTransportLogin")
        window.LoginViewControl.show();
      },

      getCommercialIssuedLicenses: function(callback) {
        setTimeout(function() {
          //simulate that the BE return values
          // callback({issuedLicenses:9,expireDate:"01/01/2017"});
          //simulate that the BE doesn't return values
          // callback({issuedLicenses:0,expireDate:null});
          //simulate that the BE return error failure
          // callback(null);

          // trick to simulate the reload functionality
          window.counter = window.counter || 1;
          if (window.counter > 1) {
            callback({ issuedLicenses: 9, expireDate: "01/01/2017" });
          } else {
            window.counter++;
            callback(null);
          }
        }, 3000);
      },

      getCachedCommercialIssuedLicenses: function(callback) {
        // getLocalStorage //No need

        //simulate that the Cache return values
        callback({ issuedLicenses: 15, expireDate: "27/12/2017" });
        //simulate that the Cache doesn't return values
        // callback({issuedLicenses:0,expireDate:null});
        //simulate that the Cache not found
        // callback(null);
      },

      ///////////////////////////////Vehicle Tile ///////////////////////////

      getVehicleTileDashboard: function() {
        return "shell/commonShellExamples.html";
      },
      vehicleLogin: function(event) {
        window.LoginViewControl.show();
      },

      getVehicles: function(callback) {
        setTimeout(function() {
          //simulate that the BE return values
          // callback({activeVehicles:19,expireVehicles:4});
          //simulate that the BE doesn't return values
          // callback({activeVehicles:0,expireVehicles:null});
          //simulate that the BE return error failure
          // callback(null);

          // trick to simulate the reload functionality
          window.counter = window.counter || 1;
          if (window.counter > 1) {
            callback({ activeVehicles: 9, expireVehicles: 2 });
          } else {
            window.counter++;
            callback(null);
          }
        }, 3000);
      },

      getCachedVehicles: function(callback) {
        // getLocalStorage //No need

        //simulate that the Cache return values
        // callback({activeVehicles:15,expireVehicles:4});
        //simulate that the Cache doesn't return values
        // callback({activeVehicles:0,expireVehicles:null});
        //simulate that the Cache not found
        callback(null);
      },
      ///////////////////////////////Plate Tile ///////////////////////////

      getPlateTileDashboard: function() {
        return "shell/commonShellExamples.html";
      },
      plateLogin: function(event) {
        window.LoginViewControl.show();
      },

      getPlates: function(callback) {
        setTimeout(function() {
          //simulate that the BE return values
          // callback({activePlates:19,expirePlates:4});
          //simulate that the BE doesn't return values
          // callback({activePlates:0,expirePlates:null});
          //simulate that the BE return error failure
          // callback(null);

          // trick to simulate the reload functionality
          window.counter = window.counter || 1;
          if (window.counter > 1) {
            callback({ activePlates: 89, expirePlates: 28 });
          } else {
            window.counter++;
            callback(null);
          }
        }, 3000);
      },

      getCachedPlates: function(callback) {
        // getLocalStorage //No need

        //simulate that the Cache return values
        callback({ activePlates: 88, expirePlates: 9 });
        //simulate that the Cache doesn't return values
        // callback({activePlates:0,expirePlates:null});
        //simulate that the Cache not found
        // callback(null);
      },
      ///////////////////////////////Driver Licensing Tile ///////////////////////////

      //events
      viewDriverLicensingServices: function(event) {
        //			alert("viewDriverLicensingServices")
        var categoryId = 3;
        Utils.loadServicePage(categoryId);
      },

      ///////////////////////////////Traffic And Roads Tile ///////////////////////////

      //events
      viewTrafficAndRoadsServices: function(event) {
        //			alert("viewTrafficAndRoadsServices")
        var categoryId = 5;
        Utils.loadServicePage(categoryId);
      },

      ///////////////////////////////Contracts Tile ///////////////////////////

      //events
      viewContractsSevices: function(event) {
        //			alert("viewContractsSevices")
        var categoryId = 9;
        Utils.loadServicePage(categoryId);
      },

      ///////////////////////////////Metro Tile ///////////////////////////

      //events
      viewMetroServices: function(event) {
        //			alert("viewMetroServices")
        var categoryId = 8;
        Utils.loadServicePage(categoryId);
      },

      /////////////////////////Fines Tile////////////////////////////
      getCorporateFines: function(callback) {
        setTimeout(function() {
          callback(null);
        }, 10000);
        //			callback({
        //			finesAmount:1500,
        //			permitsCount:5,
        //			permitExpiryDate:"15 October 2017"
        //			});
      },

      ///////////////////////////////Fines Tile ///////////////////////////
      //events
      finesTileLogin: function(event) {
        // Guest fines login , write the logic here
        // alert("finesTileLogin");
        window.LoginViewControl.show();
      },
      getFines: function(callback) {
        setTimeout(function() {
          //simulate that the BE return values
          callback({
            finesAmount: 200,
            blackPoints: 5,
            permitExpiryDate: "15 October 2017"
          });
          //simulate that the BE doesn't return values
        //   callback({});
          //simulate that the BE return error failure
        //   callback(null);
        }, 3000);
      },

      getCachedFines: function(callback) {
        //simulate that the Cache return values
        // callback({
        //   finesAmount: 500,
        //   blackPoints: 15,
        //   permitExpiryDate: "18 October 2010"
        // });
        //simulate that the Cache doesn't return values
        // callback({});
        //simulate that the Cache not found
        callback(null);
      }
    }
  );

  return CorporateDashboardModel;
});
