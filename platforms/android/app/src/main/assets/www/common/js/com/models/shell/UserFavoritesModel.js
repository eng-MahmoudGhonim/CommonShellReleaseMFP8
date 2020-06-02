define([

        "jquery", 
        "backbone",
        "com/models/Constants",
        "com/utils/Utils",
        "com/utils/DataUtils",
        "com/models/shell/UserProfileModel",
        "com/models/shell/AuthenticationModel",
        "com/models/shell/GroupingModel",

        ], function($, Backbone, Constants, Utils, DataUtils, UserProfileModel, AuthenticationModel, GroupingModel) 
        {

	var UserFavoritesModel = Backbone.Model.extend({},
	{
		addFavorite:function(serviceId,callBack){
			if(navigator.onLine) {
				UserFavoritesModel.addFavoriteOnline(serviceId,callBack);
			}else{
				UserFavoritesModel.addFavoriteOffline(serviceId,callBack);
			}
		},
		removeFavorite:function(serviceId,callBack){
			if(navigator.onLine) {
				UserFavoritesModel.removeFavoriteOnline(serviceId,callBack);
			}else{
				UserFavoritesModel.removeFavoriteOffline(serviceId,callBack);
			}
		},
		isFavorite:function(serviceId){
			var cashedList = JSON.parse(localStorage.getItem("shelluserFavoritServices"));
			var favoriteList = UserProfileModel.mergeFavoritesWithStack(cashedList);
			if(favoriteList == null)
				favoriteList = {};
			
			return favoriteList[serviceId] != undefined;
		},
		getFavoriteList:function(callBack){
			GroupingModel.getuserFavoritServices(function(userFavoritServicesList){
				callBack(userFavoritServicesList);
			});
		},
		addFavoriteOnline:function(serviceId,callBack){
			var favoriteList = JSON.parse(localStorage.getItem("shelluserFavoritServices"));
			if(favoriteList == null)
				favoriteList = {};
			
//			if(favoriteList[serviceId] != undefined){
//				callBack("SUCCESS")
//				return;
//			}
			
			favoriteList[serviceId] = {
					serviceId:serviceId
			}
			
		    var favParam = {};
		    favParam["service_id"] = serviceId;
		    favParam["user_id"] = UserProfileModel.getUserProfile().Users[0].user_id;
		    favParam["service_title"] = '';

		    UserProfileModel.setUserFavoriteServiceInDB(favParam, function (e) {
		    	if (e != "FAILED") {
		        	DataUtils.setLocalStorageData("userFavoritServices", JSON.stringify(favoriteList), false, "shell");
		            callBack("SUCCESS");
		        } else {
		        	callBack("FAILED");
		            var generalErrorPopup = new Popup('generalErrorPopup');
					generalErrorPopup.show();
		        }
		    });
		},
		removeFavoriteOnline:function (serviceId, callBack) {
			var favoriteList = JSON.parse(localStorage.getItem("shelluserFavoritServices"));
			if(favoriteList == null)
				favoriteList = {};
			
//			if(favoriteList[serviceId] == undefined){
//				callBack("SUCCESS")
//				return;
//			}
			
		    var favParam = {};
		    favParam["service_id"] = serviceId;
		    favParam["user_id"] = UserProfileModel.getUserProfile().Users[0].user_id;
		    favParam["service_title"] = '';

		   
		    UserProfileModel.deleteUserFavoriteServiceFromDB(favParam, function (e) {
		    	if (e != "FAILED") {
		        	delete favoriteList[serviceId];
		            DataUtils.setLocalStorageData("userFavoritServices", JSON.stringify(favoriteList), false, "shell");
		            callBack("SUCCESS");
		        } else {
		        	callBack("FAILED");
		            var generalErrorPopup = new Popup('generalErrorPopup');
					generalErrorPopup.show();
		        }
		   });
		    
		},
		addFavoriteOffline:function(serviceId,callBack){
			var favoriteList = JSON.parse(localStorage.getItem("shelluserFavoritServices"));
			if(favoriteList == null)
				favoriteList = {};
			
//			if(favoriteList[serviceId] != undefined){
//				callBack("SUCCESS")
//				return;
//			}
				

			var service = {
				ServiceId:serviceId
			}
		        
		    UserProfileModel.updateOfflineStack(service, "add");
			callBack("SUCCESS");
		},
		removeFavoriteOffline:function (serviceId, callBack) {
			var favoriteList = JSON.parse(localStorage.getItem("shelluserFavoritServices"));
			if(favoriteList == null)
				favoriteList = {};
			
//			if(favoriteList[serviceId] == undefined){
//				callBack("SUCCESS")
//				return;
//			}

			var service = {
				ServiceId:serviceId
			}
			
		    UserProfileModel.updateOfflineStack(service, "remove");
			callBack("SUCCESS");
		}
	});

	return UserFavoritesModel;

});