define([

"jquery", "backbone", "com/utils/Utils", "com/utils/DataUtils", "com/models/shell/AuthenticationModel"

], function($, Backbone, Utils, DataUtils, AuthenticationModel) {

	var RecentActivityModel = Backbone.Model.extend({}, {
		LOCAL_STORAGE_ACTIVITIES : "RECENT_ACTIVITIES",
		SESSION_EXPIRY_IN_MS : 0,

		requestRecentActivities : function(userId, showLoadingAlert, callback) {
			var self = this;

			var pageData = self.getPageDataFromStorage();
			//MGRT71
			WL.Device.getNetworkInfo(function (networkInfo) {
				if (self._isValidPageData(pageData) || (networkInfo && networkInfo.isNetworkConnected == "false")) {
					if(!pageData) {
						pageData = {};
					}
					if(!pageData.data) {
						pageData.data = [];
					}

					callback(pageData.data);
				} else if((networkInfo && networkInfo.isNetworkConnected == "true")){
					var recentActivities = [];
					var loadingInd = $(".ui-loader");

					try {
						if (showLoadingAlert) {
							loadingInd.show();
						}

						var invocationData = {
							adapter : "recentActivities",
							procedure : "getRecentActivities",
							parameters : [ userId ]
						};
						invokeWLResourceRequest(invocationData,
							function(result) {
								WL.Logger.debug("RecentActivityModel :: requestRecentActivities :: Invocation success");
								if (showLoadingAlert && loadingInd) {
									loadingInd.hide();
								}

								if (result && result.invocationResult && result.invocationResult.resultSet) {
									recentActivities = result.invocationResult.resultSet;
								}

								if(recentActivities && recentActivities.length > 0) {
									recentActivities.sort(self._compareDates);
								}

								var pageDataPack = {
									data : recentActivities,
									date : (new Date()).getTime()
								};
								self.setPageDataToStorage(pageDataPack);

								callback(pageDataPack.data);
							},
							function(result) {
								WL.Logger.debug("RecentActivityModel :: requestRecentActivities :: Invocation failure");
								if (showLoadingAlert && loadingInd) {
									loadingInd.hide();
								}

								var pageDataPack = {
									data : recentActivities,
									date : (new Date()).getTime()
								};
								self.setPageDataToStorage(pageDataPack);

								callback(pageDataPack.data);
							}
						);
					} catch (e) {
						WL.Logger.debug("RecentActivityModel :: requestRecentActivities :: Invocation error");
						if (showLoadingAlert && loadingInd) {
							loadingInd.hide();
						}

						var pageDataPack = {
							data : recentActivities,
							date : (new Date()).getTime()
						};
						self.setPageDataToStorage(pageDataPack);

						callback(pageDataPack.data);
					}
				}
			});
		},

		setPageDataToStorage : function(recentActivities) {
			if (recentActivities) {
				DataUtils.setLocalStorageData(this.LOCAL_STORAGE_ACTIVITIES, JSON.stringify(recentActivities), false, 'shell');
			} else {
				DataUtils.setLocalStorageData(this.LOCAL_STORAGE_ACTIVITIES, "", false, 'shell');
			}
		},

		getPageDataFromStorage : function() {
			var data = DataUtils.getLocalStorageData(this.LOCAL_STORAGE_ACTIVITIES, 'shell');
			if (data) {
				return JSON.parse(data);
			}

			return [];
		},

		destroyStoredData : function() {
			DataUtils.removeFromLocalStorage(this.LOCAL_STORAGE_ACTIVITIES, 'shell');
		},

		_isValidPageData : function(pageData) {
			var self = this;
			var dateNow = new Date().getTime();

			return (pageData && pageData.data && pageData.date && !$.isEmptyObject(pageData.data) && ((dateNow - pageData.date) < self.SESSION_EXPIRY_IN_MS));
		},

		_compareDates : function(item1, item2) {
			try {
				var date1 = item1.modified;
				var date2 = item2.modified;

				if(date1.indexOf(".") >= 0) {
					date1 = date1.split(".")[0];
				}
				if(date2.indexOf(".") >= 0) {
					date2 = date2.split(".")[0];
				}
				while(date1.indexOf("-") >= 0) {
					date1 = date1.replace("-", "/");
				}
				while(date2.indexOf("-") >= 0) {
					date2 = date2.replace("-", "/");
				}

				var item1Date = new Date(date1);
				var item2Date = new Date(date2);

				return (item1Date.getTime() < item2Date.getTime());
			}
			catch(e) {
				return 0;
			}
		}
	});

	return RecentActivityModel;
});
