
define(["com/views/PageView", "com/views/Header","com/models/shell/IncidentDetectionModel","com/utils/DataUtils"], function(PageView, Header,IncidentDetectionModel,DataUtils) {
	var IncidentDetectionPageView = PageView.extend({
		events: {
			'pageshow': 'onPageShow'
		},
		initialize: function(options) {
			options.headerState = Header.STATE_MENU;
			options.phoneTitle = localize("%shell.sidepanel.notifications%");
			options.subTitle=localize("%shell.incidentDetection.IncidentDetection%");
			PageView.prototype.initialize.call(this, options);
			IncidentDetectionPageViewInstance=this;
		},
		getConfigValue:function(arr,key){
			try{
				for (var i=0; i < arr.length; i++) {
					if (arr[i].name == key) {
						return arr[i].value;
					}
				}
			}
			catch(e){
				console.log(e);
				var generalErrorPopup = new Popup("generalErrorPopup");
				generalErrorPopup.show();
			}
		},
		onPageShow: function() {
			try{
				IncidentDetectionPageViewInstance.UserChanges=[];
				var saveButton= document.getElementById("saveStandardAlerts").classList;
				if(!saveButton.contains("disabled"))
					saveButton.add("disabled");
				var parseuserConfig=IncidentDetectionModel.getUserConfig();


				function RemoveExistElement(nameKey){
					if(nameKey){
						for (var i=0; i < IncidentDetectionPageViewInstance.UserChanges.length; i++) {
							if (IncidentDetectionPageViewInstance.UserChanges[i].name == nameKey) {
								IncidentDetectionPageViewInstance.UserChanges.splice(i, 1); 
							}
						}
					}
				}

				function getAllAlerts(isChecked){
					try{
						var allElements=document.getElementsByClassName("incidentNotification");
						if(allElements){
							for (var i = 0; i < allElements.length; i++) {
								var	classname=allElements[i].querySelector(".standardAlertsActions");
								var currentElementValue=classname.getAttribute("data-inputValue");
								if(isChecked==true){
									activateCheckbox(classname);
									// document.getElementById("saveStandardAlerts").classList.remove("disabled");
									IncidentDetectionPageViewInstance.UserChanges=[{name:"allAlerts",value:true},{name:"hospitals",value:true},{name:"airports",value:true},{name:"metroAndTram",value:true},
									                                               {name:"schools",value:true},{name:"shopping",value:true},{name:"sports",value:true},{name:"highSeverity",value:true},
									                                               {name:"dangerousTraffic",value:true}];
									if(currentElementValue!="allAlerts"){
										classname.disabled = true;  
										allElements[i].style.opacity = "0.6";
									}
								}
								else{
									deactivateCheckbox(classname);

									classname.disabled = false;  
									allElements[i].style.opacity = "2";
								}
							}
						}
					}
					catch(e){
						console.log(e);
					}
				}
				var allElements=document.getElementsByClassName("incidentNotification");
				if(allElements){
					for (var i = 0; i < allElements.length; i++) {
						var	inputElement=allElements[i].querySelector(".standardAlertsActions");
						// Apply old Configuration 
						var currentElement=allElements[i].querySelector(".standardAlertsActions").getAttribute("data-inputValue");
						var isChecked=IncidentDetectionPageViewInstance.getConfigValue(parseuserConfig,currentElement);

						if(isChecked)
							activateCheckbox(inputElement);
						else
							deactivateCheckbox(inputElement);

						// Configure All Alerts
						if(parseuserConfig[0].name=="allAlerts"&&parseuserConfig[0].value==true){
							activateCheckbox(inputElement);
							if(currentElement!="allAlerts"){
								inputElement.disabled = true;  
								allElements[i].style.opacity = "0.6";
							}
						}

						inputElement.addEventListener('click', function(){
							// manage UI Changes
							var inputName = this.getAttribute("data-inputValue");
							var isChecked=this.checked;

							if(inputName=="allAlerts"){
								getAllAlerts(isChecked);
							}
							else
							{
								var currentElementName=this.getAttribute("data-inputValue");
								var isChecked=this.checked;
								if(currentElementName){
									var currentResult={name:currentElementName,value:isChecked};
									// remove exist element 
									RemoveExistElement(currentElementName)
									IncidentDetectionPageViewInstance.UserChanges.push(currentResult);
								}
							}
							// save button enable or disable
							document.getElementById("saveStandardAlerts").classList.remove("disabled");

							if(isChecked){
								activateCheckbox(this);
							}else{
								deactivateCheckbox(this);
							}
						}, false);
					}
				}

				function checkDefault(){
					var userConfig = DataUtils.getLocalStorageData("incidentDetectionConfig", "shell");
					if(userConfig){
						for(var i =0;i<userConfig.length;i++){
							if(userConfig[i].value==false)
								return false;
						}
					}
				}

				document.getElementById("resetStandardAlerts").addEventListener('click',function(){
					$(".ui-loader").show();
					setTimeout(function(){
						$(".ui-loader").hide();
					}, 50000);

					var result=[{name:"allAlerts",value:true},{name:"hospitals",value:true},{name:"airports",value:true},{name:"metroAndTram",value:true},
					            {name:"schools",value:true},{name:"shopping",value:true},{name:"sports",value:true},{name:"highSeverity",value:true},
					            {name:"dangerousTraffic",value:true}];

					standardNotificationTags(result,function(){
						//  var stringfyElements=JSON.stringify(result);
						IncidentDetectionModel.saveIncidentDetectionConfig(result,function(){
							$(".ui-loader").hide();
							var saveChangesSuccessPopup = new Popup("saveChangesSuccessPopup");
							saveChangesSuccessPopup.show();
						});
					});
				});

				document.getElementById("saveStandardAlerts").addEventListener('click',function(){

					$(".ui-loader").show();
					setTimeout(function(){
						$(".ui-loader").hide();
					}, 50000);

					var allElements=document.getElementsByClassName("incidentNotification");
					var result=[];
					if(allElements){
						for (var i = 0; i < allElements.length; i++) {
							var	classname=allElements[i].querySelector(".standardAlertsActions");
							var currentElementName=classname.getAttribute("data-inputValue");
							var isChecked=classname.checked;
							var currentResult={name:currentElementName,value:isChecked};
							result.push(currentResult);
						}}
					if(IncidentDetectionPageViewInstance.UserChanges&&IncidentDetectionPageViewInstance.UserChanges.length>0)
					{
						standardNotificationTags(IncidentDetectionPageViewInstance.UserChanges,function(){
							IncidentDetectionModel.saveIncidentLocalStorage(result,function(){
								$(".ui-loader").hide();
								//mobile.changePage("shell/notifications_settings.html");
								history.back();
								if(document.getElementById("saveStandardAlerts"))
									document.getElementById("saveStandardAlerts").classList.add("disabled");
							});
						});
					}
					else{
						$(".ui-loader").hide();
					}
				});
			}
			catch(e){
				console.log(e);
				var generalErrorPopup = new Popup("generalErrorPopup");
				generalErrorPopup.show();
			}
		},
		dispose: function() {
			PageView.prototype.dispose.call(this);
		}
	});
	return IncidentDetectionPageView;
});