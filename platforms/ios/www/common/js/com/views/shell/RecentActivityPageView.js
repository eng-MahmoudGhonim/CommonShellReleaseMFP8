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
		"dateformat"
	], function($, Backbone, PageView, Header, Utils, DataUtils, RecentActivityModel, ActivityLoggerModel, UserProfileModel, ServicesDirectoryModel) {
		var RECENT_DATE_PATTERN = "dd/MM/yyyy HH:mm";
		var PAYMENT_TYPES = {
				MPAY: "mpay",
				EPAY: "epay"
		};
		var PAYMENT_STATUS = {
				SUCCESS_1: "0",
				SUCCESS_2: "00",
				FAILURE: "failure"
		};
	
		var self = null;
		var recentActivityUserId = "";
		var deviceProperties = {
			model : null,
			settings : null,
			language : "en"
		};
	
    var RecentActivityPageView = PageView.extend({
    	
    	/**
         * The View Constructor
         * @param el, DOM element of the page
         */
        initialize: function(options) 
        {
        	self = this;
			deviceProperties.language = getApplicationLanguage();
        	
        	options.phoneTitle = Globalize.localize("%shell.recentactivity.title%", deviceProperties.language);
        	options.headerState = Header.STATE_MENU;
        	PageView.prototype.initialize.call(this, options);
        	
        	// Get logged-in user id
        	try {
        		recentActivityUserId = UserProfileModel.getUserProfile().Users[0].user_id;
        	}
        	catch(e) {
        		recentActivityUserId = "";
        	}
        	//
        	
        	
        	this.$el.on("pageshow", function() {
//        		MobileRouter.getFooter().fixFooterIcons('myacitivity');
				var deviceClass = "mobile";
				 
				// Get last logged-in time
	        	var lastLoggedDate = ActivityLoggerModel.getLoginDate();
	        	//lastLoggedDate = $.format.date(lastLoggedDate, RECENT_DATE_PATTERN);
	        	lastLoggedDate=self.formatDate(lastLoggedDate);
	        	$("#recentActivityLastLoggedin").text(lastLoggedDate);
	        	//
	        	
				$("#content").removeClass("mobile").removeClass("browser-mobile").removeClass("browser").addClass(deviceClass);
				
				RecentActivityModel.requestRecentActivities(recentActivityUserId, true, self.displayPageData);
			});
        },
        
        dispose: function() {
        	PageView.prototype.dispose.call(this);
        },
        
        formatDate:function(dateInMilliSec)
        {
        	var compReformattedDate = (new Date(dateInMilliSec)).toString();
        	var SplittedDate =compReformattedDate.split(' ');
        	var formattedDateToUse=SplittedDate[2]+'/'+self.mapMonth(SplittedDate[1])+'/'+SplittedDate[3]+' '+SplittedDate[4];
        	return formattedDateToUse;
        	
        },
        mapMonth:function(inputMonthToMap)
        {
        	var monthInDig;
        	switch(inputMonthToMap.toLowerCase()) {
            case 'jan':
            	monthInDig='01';
                break;
            case 'feb':
            	monthInDig='02';
                break;
            case 'mar':
            	monthInDig='03';
                break;
            case 'apr':
            	monthInDig='04';
                break;
            case 'may':
            	monthInDig='05';
                break;
            case 'jun':
            	monthInDig='06';
                break;
            case 'jul':
            	monthInDig='07';
                break;
            case 'aug':
            	monthInDig='08';
                break;
            case 'sep':
            	monthInDig='09';
                break;
            case 'oct':
            	monthInDig='10';
                break;
            case 'nov':
            	monthInDig='11';
                break;
            case 'dec':
            	monthInDig='12';
                break;
                
        }
        	return monthInDig;
        },
        displayPageData: function(recentActivities) {
        	try {
        		$("#recentActivityPaymentsList").html("");
            	if(recentActivities && recentActivities.length > 0) {
            		ServicesDirectoryModel.getCachedServices(function(allRTAServices) {
            			if(allRTAServices) {
//            				allRTAServices = JSON.parse(allRTAServices);
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
            	        			
            	        			var type = activity.activity_type;
            	        			var title = "";
            	        			var dateTime = activity.modified;
            	        			var sptrn = activity.sptrn;
            	        			var currency = activity.currency = Globalize.localize("%shell.Recent_activity.currency%", deviceProperties.language);
            	        			var amount = parseInt(activity.amount);
            	        			var status = activity.status;
            	        			var statusHTML = "";
            	        			var paymentTypeTxt = "";
            	        			
            	        			if(type) {
            	        				type = type.toLowerCase();
            	        				if(type == PAYMENT_TYPES.MPAY) {
            	        					paymentTypeTxt = Globalize.localize("%shell.yourPayment.mPay%", deviceProperties.language);
            	        				}
            	        				else if(type == PAYMENT_TYPES.EPAY) {
            	        					paymentTypeTxt = Globalize.localize("%shell.yourPayment.ePay%", deviceProperties.language);
            	        				}
            	        				paymentTypeTxt+="&nbsp;&nbsp;&nbsp;";
            	        			}
            	        			if(status == PAYMENT_STATUS.SUCCESS_1 || status == PAYMENT_STATUS.SUCCESS_2) {
            	        				statusHTML = '<img alt="Status" src="../../common/images/shell/img_payment_success.png" class="recent-activity-status" />';
            	        			}
            	        			else if(status == PAYMENT_STATUS.FAILURE) {
            	        				statusHTML = '<img alt="Status" src="../../common/images/shell/img_payment_failure.png" class="recent-activity-status" />';
            	        			}
            	        			else {
            	        				statusHTML = '<img alt="Status" src="../../common/images/shell/img_payment_pending.png" class="recent-activity-status" />';
            	        			}
            	        			
            	        			var serviceFullDetails = allRTAServicesHashMap[activity.service_id];
            	        			if(serviceFullDetails) {
            	        				if(!deviceProperties.language || deviceProperties.language.toLowerCase() == "en") {
                	        				title = serviceFullDetails.serviceName_EN;
                	        			}
                	        			else if(deviceProperties.language.toLowerCase() == "ar") {
                	        				title = serviceFullDetails.serviceName_AR;
                	        			}
            	        			}
            	        			
            	        			if(!title) {
            	        				title = "";
            	        			}
            	        			if(dateTime) {
            	        				if(dateTime.indexOf(".") >= 0) {
            	        					dateTime = dateTime.split(".")[0];
            	    					}
            	        				while(dateTime.indexOf("-") >= 0) {
            	        					dateTime = dateTime.replace("-", "/");
            	        				}
            	        				
            	        				dateTime = new Date(dateTime);
            	        				//dateTime = $.format.date(dateTime.getTime(), RECENT_DATE_PATTERN);
            	        				dateTime=self.formatDate(dateTime.getTime());
            	        			}
            	        			
            	        			if(!dateTime) {
            	        				dateTime = "";
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
            	        			
            	        			$("#recentActivityPaymentsList")
            	        			.append('<table class="recent-activity-row"><tr><td class="cell-1"><div class="recent-activity-title">'
            	        					+title+'</div><div>'
            	        					+dateTime+'</div><div class="recent-activity-reference">'
            	        					+paymentTypeTxt+sptrn+'</div>'
            	        					+'</td><td class="cell-2 recent-activity-payment-info">'
            	        					+'<table class="full-width-bound"><tr><td><div class="recent-activity-amount-label">'
            	        					+currency+'</div><div class="recent-activity-amount">'
            	        					+amount+'</div></td><td>'+statusHTML+'</td></tr></table></td></tr></table>');
            	        		}
            				}
            			}
    				}, true);
            	}
        	}
        	catch(e) {
        		
        	}
        }
        
    });
    
    return RecentActivityPageView;

});