define([
    "jquery",
    "backbone",
    "com/utils/DataUtils",
    "com/models/shell/UserProfileModel",
    "com/models/shell/ServicesDirectoryModel",
    "com/models/Constants"
], function ($, Backbone, DataUtils, UserProfileModel, ServicesDirectoryModel, Constants) {
    var GroupingModel = Backbone.Model.extend({}, {
        getPageURLToNavigate: function (servID) {
        	for(var i=0;i<ServiceCategories.length;i++){
        		for(var j=0;j<ServiceCategories[i].CategoryServices.length;j++){
            		if(ServiceCategories[i].CategoryServices[j].ServiceId == servID){
            			return ServiceCategories[i].CategoryServices[j].ServicePageUrl;
            		}
            	}
        	}
        	return "";
        },


        getServicesName: function (ServID) {
        	for(var i=0;i<ServiceCategories.length;i++){
        		for(var j=0;j<ServiceCategories[i].CategoryServices.length;j++){
            		if(ServiceCategories[i].CategoryServices[j].ServiceId == ServID){
            			if(getApplicationLanguage() == "en"){
            				return ServiceCategories[i].CategoryServices[j].ServiceNameEn;
            			}else{
            				return ServiceCategories[i].CategoryServices[j].ServiceNameAr;
            			}
            			
            		}
            	}
        	}
        	return ""
        },


        getCategoryName: function (CatID) {
        	for(var i=0;i<ServiceCategories.length;i++){
        		for(var j=0;j<ServiceCategories[i].CategoryServices.length;j++){
            		if(ServiceCategories[i].CategoryServices[j].ServiceId == ServID){
            			if(getApplicationLanguage() == "en"){
            				return ServiceCategories[i].CategoryNameEn;
            			}else{
            				return ServiceCategories[i].CategoryNameAr;
            			}
            			
            		}
            	}
        	}
        	return ""
        },
        getCategoryIcon: function (CatID) {
        	for(var i=0;i<ServiceCategories.length;i++){
           		if(ServiceCategories[i].CategoryId == CatID){
           			return ServiceCategories[i].Icon
            	}
            	
        	}
        	return ""
        },
        checkIfUndefinedorNullorEmpty: function (param) {
            if (param == undefined || param == null || param == "") {
                return true;
            }
            return false;
        },
        getuserFavoritServices: function (callBackFunction) {
        	var favStack = UserProfileModel.getFavFromStack();
            if (favStack.length > 0) {
                GroupingModel.syncUserFavoriteServices(callBackFunction);
            } else {
            	GroupingModel.getOnlineUserFavoriteServices(callBackFunction);
            }
        },
        getOnlineUserFavoriteServices: function (callBackFunction) {
            try {
                var userFavoritServicesList = {};
                if (UserProfileModel.getUserProfile()) {
                    var userid = UserProfileModel.getUserProfile().Users[0].user_id;
                    if (userid) {
                        UserProfileModel.getUserFavoriteServicesFromDB(userid, function (flag, result) {
                            {
                                if (flag == "SUCCESS") {
                                    //						console.log("retreive favorite services from DB Success");
                                    for (var favSrvIndex = 0; favSrvIndex < result.length; favSrvIndex++) {
                                        if (ServicesDirectoryModel.isServiceInThisApp(result[favSrvIndex].id) == true) {
                                            var returnItem = ServicesDirectoryModel.returnSubCatAndCatForService(result[favSrvIndex].id);
                                            userFavoritServicesList[result[favSrvIndex].id] = {};
                                            userFavoritServicesList[result[favSrvIndex].id].serviceId = result[favSrvIndex].id;
                                            userFavoritServicesList[result[favSrvIndex].id].cat = returnItem.Cat_ID;
//                                            userFavoritServicesList[result[favSrvIndex].id].subCat = returnItem.SubCat_ID;
                                            userFavoritServicesList[result[favSrvIndex].id].serv_url = returnItem.serv_url;

                                        }
                                    }
                                    DataUtils.setLocalStorageData("userFavoritServices", JSON.stringify(userFavoritServicesList), false, "shell");
                                    userFavoritServicesList = UserProfileModel.mergeFavoritesWithStack(userFavoritServicesList);
                                    callBackFunction(userFavoritServicesList, userid);
                                    return;
                                } else {
                                    var cashedList = DataUtils.getLocalStorageData("userFavoritServices", "shell");
                                    if (cashedList != null)
                                        userFavoritServicesList = JSON.parse(cashedList);
                                    userFavoritServicesList = UserProfileModel.mergeFavoritesWithStack(userFavoritServicesList);
                                    callBackFunction(userFavoritServicesList, userid);
                                    return;
                                }
                            }
                        });
                    } else {
                        callBackFunction(userFavoritServicesList, userid);
                        return;
                    }
                } else {
                    //				console.log("retreive favorite services from DB Failed");
                    var constantFavorites =window.favouriteServices ;// Constants.APP_Favourites[Constants.APP_ID];
                    if (constantFavorites != undefined || constantFavorites != null) {
                        if (constantFavorites.length > 0) {
                            for (var i = 0; i < constantFavorites.length; i++) {
                                userFavoritServicesList[constantFavorites[i].id] = constantFavorites[i];
                            }
                            callBackFunction(userFavoritServicesList);
                        } else {
                            callBackFunction(userFavoritServicesList);
                        }


                    } else {
                        callBackFunction(userFavoritServicesList);
                    }
                    //				userFavoritServicesList = this.getServiceItemsObjects(userFavoritServicesList);

                    return;

                }
            } catch (e) {

            }
        },

        syncUserFavoriteServices: function (callBackFunction) {
            try {
                var userFavoritServicesList = {};
                if (UserProfileModel.getUserProfile()) {
                    var userid = UserProfileModel.getUserProfile().Users[0].user_id;
                    if (userid) {
                        UserProfileModel.updateOfflineFavoriteServicesInDB(userid, function (flag, result) {
                            {
                                if (flag == "SUCCESS") {
                                    //						console.log("retreive favorite services from DB Success");
                                    for (var favSrvIndex = 0; favSrvIndex < result.length; favSrvIndex++) {
                                        if (ServicesDirectoryModel.isServiceInThisApp(result[favSrvIndex].id) == true) {
                                            var returnItem = ServicesDirectoryModel.returnSubCatAndCatForService(result[favSrvIndex].id);
                                            userFavoritServicesList[result[favSrvIndex].id] = {};
                                            userFavoritServicesList[result[favSrvIndex].id].serviceId = result[favSrvIndex].id;
                                            userFavoritServicesList[result[favSrvIndex].id].cat = returnItem.Cat_ID;
//                                            userFavoritServicesList[result[favSrvIndex].id].subCat = returnItem.SubCat_ID;
                                            userFavoritServicesList[result[favSrvIndex].id].serv_url = returnItem.serv_url;

                                        }
                                    }
                                    DataUtils.setLocalStorageData("userFavoritServices", JSON.stringify(userFavoritServicesList), false, "shell");
                                    UserProfileModel.emptyFavStack();
                                    userFavoritServicesList = UserProfileModel.mergeFavoritesWithStack(userFavoritServicesList);
                                    callBackFunction(userFavoritServicesList, userid);
                                    return;
                                } else {
                                    var cashedList = DataUtils.getLocalStorageData("userFavoritServices", "shell");
                                    if (cashedList != null)
                                        userFavoritServicesList = JSON.parse(cashedList);
                                    userFavoritServicesList = UserProfileModel.mergeFavoritesWithStack(userFavoritServicesList);
                                    callBackFunction(userFavoritServicesList, userid);
                                    return;
                                }
                            }
                        });
                    } else {
                        callBackFunction(userFavoritServicesList, userid);
                        return;
                    }
                }
            } catch (e) {

            }
        },
        
        openCurrentSerivce: function (serviceId) {
            // Open service if available
            var urlRetrievedObj = GroupingModel.getPageURLToNavigate(serviceId);
            if (urlRetrievedObj != "") {
                mobile.changePage(urlRetrievedObj);
            }
        }
    });
    return GroupingModel;
});