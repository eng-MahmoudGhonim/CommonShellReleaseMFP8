define([
        "jquery",
        "backbone",
        "com/views/PageView",
        "com/views/Header",
        "com/views/Footer",
        "com/utils/Utils",
        "com/utils/UserUtils",
        "com/utils/DataUtils",
        "com/models/shell/ActivityLoggerModel",
        "com/models/shell/AuthenticationModel",
        "com/models/shell/ServicesDirectoryModel",
        "com/models/shell/UserProfileModel",
        "com/models/shell/MStoreCoverModel",
        "com/models/shell/MessagesModel",
        "com/models/shell/GroupingModel",
        "com/models/Constants",
        "com/models/shell/GreenPointsModel",
        "com/utils/AuthenticationUtils",
        "com/models/shell/SocialSharingModel",
        "jqueryMd5"

], function ($, Backbone, PageView, Header, Footer, Utils, UserUtils, DataUtils, ActivityLoggerModel, AuthenticationModel,
        		ServicesDirectoryModel, UserProfileModel, MStoreCoverModel, MessagesModel, GroupingModel, Constants, GreenPointsModel,AuthenticationUtils,SocialSharingModel) {

    // Extends PagView class
    var CSFavoriteServicesPageView = PageView.extend({
        events: {
            'pageshow': 'onPageShow',
            'pagebeforeshow': 'onPageBeforeShow',
            'tap #dashboardTab': 'openDashboardPage'
        },
        initialize: function (options) {
        	CSFavoriteServicesPageViewInstance = this;
        	options.headerState = Header.STATE_MENU;
			options.phoneTitle = Globalize.localize("%shell.favoriteservice.title%", getApplicationLanguage());
            PageView.prototype.initialize.call(this, options);
        },
        onPageBeforeShow: function () {

        },
        sortList: function (array, propertyName) {
            return array.sort(function (a, b) {
                return a[propertyName] - b[propertyName];
            });
        },
        loadCategories: function () {
            var categories = [];
            var CategoryList = model._listOfCatSer.service_categories[Constants.APP_ID];
            CategoryList = CSFavoriteServicesPageViewInstance.sortList(CategoryList, "cat_order");
            for (var i = 0; i < CategoryList.length; i++) {
                var category = {
                    CategoryId: CategoryList[i].cat_id,
                    CategoryNameAr: CategoryList[i].cat_name_ar,
                    CategoryNameEn: CategoryList[i].cat_name_en,
                    SubCategories: [],
                    CategoryTheme: {
                    	IconUrl: "../../common/images/shell/grouping/"+Constants.APP_ID+"/" + CategoryList[i].cat_icon + ".png",
                        Color: CategoryList[i].cat_color !== undefined ? CategoryList[i].cat_color : null
                    },
                    CategoryServices: []
                }
                categories.push(category);
            }
            return categories;
        },
        loadSubCategories: function (categoryId) {
            var subs = [];
            var subCategories = _.groupBy(GroupingModel.getSubCategoryList(categoryId, model), 'cat_id')[categoryId];
            if (!GroupingModel.checkIfUndefinedorNullorEmpty(subCategories)) {
                subCategories = CSFavoriteServicesPageViewInstance.sortList(subCategories, "sub_category_order");
                for (var j = 0; j < subCategories.length; j++) {
                    var subCategory = {
                        SubCategoryId: subCategories[j].sub_cat_id,
                        NameAr: subCategories[j].sub_name_ar,
                        NameEn: subCategories[j].sub_name_en
                    }
                    subs.push(subCategory);
                }
            }
            return subs;
        },
        loadCategoryServices: function (categoryId, subcategoryId,userFavoritServicesList) {
            var services = [];
            var SubServices = _.groupBy(GroupingModel.getServicesList(categoryId, subcategoryId, model), 'cat_id')[categoryId];
            SubServices = CSFavoriteServicesPageViewInstance.sortList(SubServices, 'service_order');
            for(var i in userFavoritServicesList){
	            for (var k = 0; k < SubServices.length; k++) {
	            	if(SubServices[k].service_id == i){
	            		var service = {
	    	                    ServiceNameAr: SubServices[k].service_name_ar,
	    	                    ServiceNameEn: SubServices[k].service_name_en,
	    	                    ServicePageUrl: SubServices[k].serv_url,
	    	                    ServiceId: SubServices[k].service_id,
	    	                    ServiceInformationPageUrl: "",
	    	                    isFavorite: true,
	    	            }
	    	            services.push(service);
	            	}
	            }
            }

//            if(AuthenticationUtils.isAuthenticated()){
//	            for(var i in userFavoritServicesList){
//					for(var j=0;j<services.length;j++){
//						if(services[j].ServiceId == i)
//							services[j].isFavorite = true;
//					}
//				}
//            }

            return services;
        },
        removeFavorite:function(serviceItem,done){
        	var service = serviceItem.serviceobject
        	if (navigator.onLine) {
	        	var favParam = {};
				favParam["service_id"] = service.ServiceId;
				favParam["service_title"]='';
				favParam["user_id"] = UserProfileModel.getUserProfile().Users[0].user_id;
				UserProfileModel.deleteUserFavoriteServiceFromDB(favParam,function(e){
					if(e != "FAILED"){
						delete CSFavoriteServicesPageViewInstance.userFavoritServicesList[service.ServiceId];
						DataUtils.setLocalStorageData("userFavoritServices", JSON.stringify(CSFavoriteServicesPageViewInstance.userFavoritServicesList), false, "shell");
						service.isFavorite = false;
						done(serviceItem);
					}else{
						done(serviceItem);
						var generalErrorPopup = new Popup('generalErrorPopup');
						generalErrorPopup.show();					}
				});
	        } else {
	        	delete CSFavoriteServicesPageViewInstance.userFavoritServicesList[service.ServiceId];
                UserProfileModel.updateOfflineStack(service, "remove");
                service.isFavorite = false;
                done(serviceItem);
	        }
        },
        loadServices: function () {
        	GroupingModel.getuserFavoritServices(function(userFavoritServicesList){
        		document.getElementById("servicesLoader").style.display = "none";
        		//var cashedList = DataUtils.getLocalStorageData("userFavoritServices","shell");
        		CSFavoriteServicesPageViewInstance.userFavoritServicesList = userFavoritServicesList;
        		var list = [];
	            var CategoryList = CSFavoriteServicesPageViewInstance.loadCategories(model);
	            for (var i = 0; i < CategoryList.length; i++) {
	                CategoryList[i].SubCategories = CSFavoriteServicesPageViewInstance.loadSubCategories(CategoryList[i].CategoryId);

	                if (CategoryList[i].SubCategories.length > 0) {
	                    for (var k = 0; k < CategoryList[i].SubCategories.length; k++) {
	                    	var subCatServ = CSFavoriteServicesPageViewInstance.loadCategoryServices(CategoryList[i].CategoryId, CategoryList[i].SubCategories[k].SubCategoryId,CSFavoriteServicesPageViewInstance.userFavoritServicesList);
	                    	CategoryList[i].CategoryServices = CategoryList[i].CategoryServices.concat(subCatServ);
	                    }
	                } else {
	                    CategoryList[i].CategoryServices = CSFavoriteServicesPageViewInstance.loadCategoryServices(CategoryList[i].CategoryId, null,CSFavoriteServicesPageViewInstance.userFavoritServicesList);
	                }
	                if(CategoryList[i].CategoryServices.length > 0)
	                	list.push(CategoryList[i]);
	            }
	            if(list.length > 0){
	            	document.getElementById("servicesContainer").style.display = "block";
	            	var appUrl = Utils.getAppStoreLink();
		            var slider =
		            	new ServiceSlider(list, getApplicationLanguage(), AuthenticationUtils.isAuthenticated(), appUrl,SocialSharingModel,true);

		            slider.onRemoveClick(CSFavoriteServicesPageViewInstance.removeFavorite);
	            }else{
	            	document.getElementById("noFavorites").style.display = "block";
	            }
	        });
        },
        onPageShow: function () {
//        	document.getElementById("CSFavoriteServicesPageView").setAttribute("data-role","content");
            model = MobileRouter.getModel();
            var servicesCategoiressList = "";
            var serviceCategoriesFilePath = "";
            serviceCategoriesFilePath = window.mobile.baseUrl +"/common/data/service_categories.json";
            document.getElementById("goServices").onclick = function(){
            	mobile.changePage("shell/home.html", {
    				servicesList: true
    			});
            }
            $.getJSON(serviceCategoriesFilePath, function (servicesCategoires) {
                model._listOfCatSer = servicesCategoires;
                CSFavoriteServicesPageViewInstance.loadServices();
            }).fail(function () {
                console.log("error");
            });
        },
        openDashboardPage: function (event) {
            event.preventDefault();
            mobile.changePage(Constants.HOMEPAGE_URL);
        },
        dispose: function () {
            PageView.prototype.dispose.call(this);
        },

    });

    // Returns the View class
    return CSFavoriteServicesPageView;

});
