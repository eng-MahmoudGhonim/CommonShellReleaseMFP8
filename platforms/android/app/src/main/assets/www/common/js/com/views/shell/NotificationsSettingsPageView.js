
define(["com/views/PageView", "com/views/Header", "com/utils/DataUtils","com/models/shell/IncidentDetectionModel","com/models/shell/NotificationsModel"], function(PageView, Header,DataUtils,IncidentDetectionModel,NotificationsModel) {
	var NotificationsSettingsPageView = PageView.extend({
		events: {
			'pageshow': 'onPageShow'
		},
		initialize: function(options) {
			NotificationsSettingsInstance=this;
			options.headerState = Header.STATE_MENU;
			options.phoneTitle = localize("%shell.Notifications.Notifications%");
			options.hideFooter = true;
			PageView.prototype.initialize.call(this, options);
		},
		onPageShow: function() {
			try{
				document.querySelector("#standardAlerts").addEventListener('click',function(){
					mobile.changePage("shell/incident_detection.html");
				});

				var resetButton = document.getElementById('resetBtn');
				resetButton.onclick=function(event){
					activateCheckbox(document.getElementById('generalNotifications-checkbox'));
					setTimeout(function(){ 	NotificationsSettingsInstance.generalNotifications(true); }, 300);

				};
				var generalNotificationswitch = document.getElementById('generalNotifications-checkbox');


				var isGeneralNotificationActive = localStorage.getItem("shellActiveGeneralNotification");
				if(isGeneralNotificationActive == "true"){
					activateCheckbox(generalNotificationswitch);

				}else{
					deactivateCheckbox(generalNotificationswitch);
				}

				generalNotificationswitch.onchange = function(event){
					var checked =this.checked;
					if(checked ==false) {
						//localStorage.setItem("shellActiveGeneralNotification","false");
						deactivateCheckbox(this);
						// excute action
						NotificationsSettingsInstance.generalNotifications(checked);

					}else {
						//localStorage.setItem("shellActiveGeneralNotification","true");
						activateCheckbox(this);
						// excute action
						NotificationsSettingsInstance.generalNotifications(checked);
					}
				};
				// Incident Detection

				var incidentNotificationswitch = document.getElementById('IncidentNotificationsSettings-checkbox');
				var isIncidentNotificationActive = localStorage.getItem("shellIncidentNotification");// change it to be incident
				if(isIncidentNotificationActive == "true"){
					activateCheckbox(incidentNotificationswitch);
					document.querySelector("#standardAlerts").style.display="block";
					document.querySelector("#customAlertNotifications").style.display="block";

					// Get Number of selection 
					var userConfig=IncidentDetectionModel.getUserConfig();
					var counter=0;// number of selected 
					for (var i=0; i < userConfig.length; i++) {
						if (userConfig[i].value ==true ) {
							counter++;
						}
					}
					if(counter==9)
						document.getElementById("showAllAlerts").innerText=localize("%shell.notificationsSettings.AllAlerts%");
					else
						document.getElementById("showAllAlerts").innerText=counter +" "+localize("%shell.notificationsSettings.Selections%");

				}else{
					deactivateCheckbox(incidentNotificationswitch);
					document.querySelector("#standardAlerts").style.display="none";
					document.querySelector("#customAlertNotifications").style.display="none";
				}

				incidentNotificationswitch.onchange = function(event){
					try{
						var checked=this.checked;
						//var checked =document.querySelector('#IncidentNotificationsSettingsLabel').classList.contains("shell-lever-active");
						var element=this;
						var result=[{name:"allAlerts",value:false},{name:"hospitals",value:false},{name:"airports",value:false},{name:"metroAndTram",value:false},
						            {name:"schools",value:false},{name:"shopping",value:false},{name:"airports",value:false},{name:"highSeverity",value:false},
						            {name:"dangerousTraffic",value:false}];
						if(checked ==false) {
							$(".ui-loader").show();
							localStorage.setItem("shellIncidentNotification","false");

							// excute action
							document.querySelector("#standardAlerts").style.display="none";
							document.querySelector("#customAlertNotifications").style.display="none";


							IncidentDetectionModel.setDefaultIncidentDetection(function(){
								$(".ui-loader").hide();
								deactivateCheckbox(element);

								//Delete User from DB If user logged in 
								var userProfile = DataUtils.getLocalStorageData("userProfile", "shell");
								if (userProfile) 
								{
									NotificationsModel.deleteUserLocation(function(){
										$(".ui-loader").hide();
									});
								}

							});

						}else {
							localStorage.setItem("shellIncidentNotification","true");
							document.getElementById("showAllAlerts").innerText=0 +" "+localize("%shell.notificationsSettings.Selections%");
							activateCheckbox(element);
							document.querySelector("#standardAlerts").style.display="block";
							document.querySelector("#customAlertNotifications").style.display="block";

						}
					}catch(e){
						console.log(e);
					}
				};

				// open custom notification Page
				document.getElementById("customAlertNotifications").addEventListener('click',function(){
					//mobile.changePage("shell/custom_alerts.html");  // for testing 
					var userId = "";
					var userProfile = DataUtils.getLocalStorageData("userProfile", "shell");
					if (!userProfile) 
					{
						userProfile = JSON.parse(userProfile);
						userId = userProfile && userProfile.Users[0] ? userProfile.Users[0].user_id : null;
						var loginOptions = {
								scenario: "changePage",
								url: "shell/custom_alerts.html"
						};
						window.LoginViewControl.show(loginOptions);
					}
					else{
						mobile.changePage("shell/custom_alerts.html");
					}
				});
			}
			catch(e){
				console.log(e)
			}
		},

		generalNotifications:function(checked){
			if(checked){
				subscribeToGeneralTag();
			}else{

				unsubscribeGeneralTag();
			}
		},
		personalNotifications:function(checked){
			if(checked){
				doSubscribe();
			}else{
				doUnsubscribe();
			}
		},

		dispose: function() {
			PageView.prototype.dispose.call(this);
		}
	});
	return NotificationsSettingsPageView;
});