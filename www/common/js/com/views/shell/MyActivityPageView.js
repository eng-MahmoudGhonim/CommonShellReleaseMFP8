define([ 
        "jquery", 
        "backbone",
        "com/views/PageView",
        "com/views/Header",
        "com/utils/Utils",
        "com/utils/DataUtils",
        "com/models/shell/RecentActivityModel",
        "com/models/shell/ActivityLoggerModel",
        "com/models/shell/UserProfileModel",
        "com/models/shell/ServicesDirectoryModel",
        "com/models/Constants",
        "dateformat",
        ], function($, Backbone, PageView, Header, Utils, DataUtils, RecentActivityModel, ActivityLoggerModel, UserProfileModel, ServicesDirectoryModel,Constants) {

	var MyActivityPageView = PageView.extend({

		/**
		 * The View Constructor
		 * @param el, DOM element of the page
		 */
		initialize: function(options) 
		{
			myActivityPageViewInstance = this;
			myActivityPageViewInstance.language = getApplicationLanguage();
			myActivityPageViewInstance.recentActivityUserId = "";
			options.phoneTitle = Globalize.localize("%shell.FOOTER.recentActivity%", myActivityPageViewInstance.language);
			options.headerState = Header.STATE_MENU;
			myActivityPageViewInstance.PAYMENT_STATUS = {
					SUCCESS_1: "0",
					SUCCESS_2: "00",
					FAILURE: "failure"
			};
			PageView.prototype.initialize.call(this, options);
			if(! isUndefinedOrNullOrBlank(UserProfileModel.getUserProfile()) && ! isUndefinedOrNullOrBlank(UserProfileModel.getUserProfile().Users[0]) && ! isEmptyObject(UserProfileModel.getUserProfile().Users[0]))
				recentActivityUserId = UserProfileModel.getUserProfile().Users[0].user_id;

			this.$el.on("pageshow", function(e) {
				e.preventDefault();
				//myActivityPageViewInstance = this;
//        		MobileRouter.getFooter().fixFooterIcons('myacitivity');
				RecentActivityModel.requestRecentActivities(recentActivityUserId, true, myActivityPageViewInstance.displayPageData);
			});
			this.$el.on('tap','.ui-input-clear',function(e){
				e.preventDefault();
				$("#pageSearch").val('');
				$("#pageSearch").keyup();
			});
			this.$el.on("keyup","#pageSearch", function(e) {
				e.preventDefault();
				// Retrieve the input field text and reset the count to zero
				var filter = $(this).val();
				filter = filter.toLowerCase();
				// Loop through the comment list
				$("#recentAcitivityList li.list-view-item").each(function(){
					var text = $(this).text().toLowerCase() ; 
					// If the list item does not contain the text phrase fade it out
					if (text.search(new RegExp(filter, "i")) < 0) {
						$(this).fadeOut();

						// Show the list item if the phrase matches and increase the count by 1
					} else {
						$(this).fadeIn();
					}
				});
			});

		},
		displayPageData: function(recentActivities) {
			try {
				$("#recentAcitivityList").html("");
				if(recentActivities && recentActivities.length > 0) {
					ServicesDirectoryModel.getCachedServices(function(allRTAServices) {
						if(allRTAServices) {
//							allRTAServices = JSON.parse(allRTAServices);
							if(allRTAServices) {
								var allRTAServicesHashMap = {};
								var allRTAServicesLength = allRTAServices.length;
								for (var i = 0; i < allRTAServicesLength; i++) {
									var serviceItem = allRTAServices[i];
									allRTAServicesHashMap[serviceItem.serviceID] = serviceItem;
								}

								var recentActivitiesLength = recentActivities.length;
								for(var i=0;i<recentActivitiesLength;i++) {
									var activity = recentActivities[i];
									if((Constants.APP_ID =="RTA_Drivers_And_Vehicles" && activity.app_name == "Smart_Dubai_Parking") || activity.app_name == Constants.APP_ID){
										var type = activity.activity_type;
										var title = "";
										var dateTime = activity.modified;
										var sptrn = activity.sptrn;
										var currency = activity.currency = Globalize.localize("%shell.Recent_activity.currency%", myActivityPageViewInstance.language);
										var amount = parseInt(activity.amount);
										var status = activity.status;
										var statusClass = "";
										var statusLabel = "";
										var paymentTypeTxt = "";
										if(status == myActivityPageViewInstance.PAYMENT_STATUS.SUCCESS_1 || status == myActivityPageViewInstance.PAYMENT_STATUS.SUCCESS_2) {
											statusClass = 'paid';
											statusLabel = localize("%shell.myActivity.paid.label%");
										}
										else if(status == myActivityPageViewInstance.PAYMENT_STATUS.FAILURE) {
											statusClass = 'failed';
											statusLabel = localize("%shell.myActivity.failed.label%");        
										}
										else {
											statusClass = 'in-progress';
											statusLabel = localize("%shell.myActivity.inProgress.label%");                	        			
										}
										if(dateTime) {
											if(dateTime.indexOf(".") >= 0) {
												dateTime = dateTime.split(".")[0];
											}
											while(dateTime.indexOf("-") >= 0) {
												dateTime = dateTime.replace("-", "/");
											}

										}
										dateTime = getDateAndTimeFromDateTime(dateTime);
										var date ;
										var time ;
										if(isUndefinedOrNullOrBlank(dateTime) || isEmptyObject(dateTime)) {
											date = "" ;
											time = "" ;
										}else{
											date = dateTime.date;
											date = $.format.date(date, "dd/MM/yyyy");
											time = dateTime.time;
										}
										date = date.reverse("/");
										var serviceFullDetails = allRTAServicesHashMap[activity.service_id];
										if(serviceFullDetails) {
											if(!myActivityPageViewInstance.language || myActivityPageViewInstance.language.toLowerCase() == "en") {
												title = serviceFullDetails.serviceName_EN;
												amount = currency +" "+amount;
												
												//time = time.reverse(":");
											}
											else if(myActivityPageViewInstance.language.toLowerCase() == "ar") {
												title = serviceFullDetails.serviceName_AR;
												amount = amount+" "+currency;
											}
										}

										if(!title) {
											title = "";
										}

										if(!sptrn) {
											sptrn = "";
										}
										if(!currency) {
											currency = "";
										}
										if(!amount) {
											amount = "0";
										}

										var activityItem  = '<li class="list-view-item animated slideInUp">'+
										'<h3 class="list-title">'+
										'<span class="text-holder">'+title+'</span>'+
										'<span class="status '+statusClass+'">'+statusLabel+'</span>'+
										'</h3>'+
										'<div class="list-content">'+
										'<ul class="sub-list">'+
										'<li class="reference full-width">'+
										'<span class="name">%shell.myActivity.refrence.label%</span>'+
										'<span class="val">'+sptrn+'</span>'+
										'</li>'+
										'<li class="amt full-width">'+
										'<span class="name">%shell.myActivity.amount.label%</span>'+
										'<span class="val">'+amount+'</span>'+
										'</li>'+
										'<li class="date">'+
										'<span class="name">%shell.myActivity.date.label%</span>'+
										'<span class="val">'+date+'</span>'+
										'</li>'+
										'<li class="time">'+
										'<span class="name">%shell.myActivity.time.label%</span>'+
										'<span class="val">'+time+'</span>'+
										'</li>'+
										'</ul>'+
										'</div>'+
										'</li>'
										activityItem = Utils.applyLocalization(activityItem);

										$("#recentAcitivityList").append(activityItem);
									}
								}
								if($("#recentAcitivityList li").length == 0){
									$(".no-data-found").removeClass("hidden");
									$(".data-found").addClass("hidden");
								}else{
									$(".no-data-found").addClass("hidden");
									$(".data-found").removeClass("hidden");
								}
							}
							else{
								$(".no-data-found").removeClass("hidden");
								$(".data-found").addClass("hidden");
							}
						}
						else{
							$(".no-data-found").removeClass("hidden");
							$(".data-found").addClass("hidden");
						}
					}, true);
				}else{
					$(".no-data-found").removeClass("hidden");
					$(".data-found").addClass("hidden");
				}
			}
			catch(e) {

			}
		},

		dispose: function() {
			//delete myActivityPageViewInstance ;
			PageView.prototype.dispose.call(this);
		},

	});

	return MyActivityPageView;

});