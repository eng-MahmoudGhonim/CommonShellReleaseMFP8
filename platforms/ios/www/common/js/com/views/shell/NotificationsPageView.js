
/* JavaScript content from js/com/views/shell/NotificationsPageView.js in folder common */

/* JavaScript content from js/com/views/shell/NotificationsPageView.js in folder common */

/* JavaScript content from js/com/views/shell/NotificationsPageView.js in folder common */

define(["jquery", "com/utils/DataUtils", "com/views/PageView", "com/views/Header", "com/models/shell/NotificationsModel", "com/models/shell/HapinessMeterRatingModel"], function($, DataUtils, PageView, Header, NotificationsModel, HapinessMeterRatingModel) {
	var NotificaionsPageView = PageView.extend({
		events: {
			'pageshow': 'onPageShow',
			'tap #cancelNotifications': 'cancelNotification',
			'tap #ChckBDeleteNotification': 'OpenCloseRemoveNotifications',
			"tap #RemoveNotificationsBtn": "RemoveSelctedNotifications"
		},
		initialize: function(options) {
			options.headerState = Header.STATE_MENU;
			options.phoneTitle = localize("%shell.Notifications.Notifications%");
			options.hideHeader = true;
			options.hideFooter = true;
			PageView.prototype.initialize.call(this, options);
			NotificaionsPageView.selectedNotificationIndex = 0;
			NotificaionsPageView.openDeleteNotification = 0; /*flag  to know if  open or close all Notifications  */
			NotificationInstance = this;

		},
		/*remove selected notifcations */
		RemoveSelctedNotifications: function(e) {
			var checkedElements = document.querySelectorAll('.termsRow input[type="checkbox"]:checked');
			NotificationInstance.CheckHideRemoveButton();
			if (checkedElements && checkedElements.length > 0) {
				var checkedIds = [];
				for (var i = 0; i < checkedElements.length; i++) {
					var id = checkedElements[i].getAttribute("notificationId");
					checkedIds.push(id);
				}
				NotificationsModel.DeleteUserNotifications(checkedIds, NotificationInstance.RemoveNotificationFromUI)
			}
		},
		RemoveNotificationFromUI: function() {
			var checkedElements = document.querySelectorAll('.termsRow input[type="checkbox"]:checked');
			if (checkedElements && checkedElements.length > 0) {
				var dur=checkedElements.length>10?0.3:0.5;
				for (var i = 0; i < checkedElements.length; i++) {
					var element = checkedElements[i].parentElement ? checkedElements[i].parentElement.parentElement : "";
					
					var durationTime = dur + 0.5;
					NotificationInstance.DeleteNotificationElement(element, durationTime);
				}
			}
		},
		CheckHideRemoveButton: function() {
			var checkedElements = document.querySelectorAll('.termsRow input[type="checkbox"]:checked');
			var allElements = document.querySelectorAll('#NotificationsList .NotificatiomTile');
			if (checkedElements && allElements && (allElements.length - checkedElements.length) == 0) document.getElementById("RemoveNotificationsBtn").style.webkitTransform = "translate(0px,100px)";
		},
		OpenCloseRemoveNotifications: function() {
			NotificaionsPageView.openDeleteNotification == 0 ? NotificaionsPageView.openDeleteNotification = 1 : NotificaionsPageView.openDeleteNotification = 0;
			NotificationInstance.renderCheckedCounter();
			var tilesList = document.querySelectorAll(".NotificatiomTile .NotificationItem");
			if (tilesList && tilesList.length > 0) {
				for (var i = 0; i < tilesList.length; i++) {
					var currentElement = document.querySelectorAll(".NotificatiomTile  .NotificationItem")[i];
					currentElement.classList.toggle('MoveNotification');
					currentElement.removeAttribute("style");
					document.getElementsByClassName("EditNotification")[i].classList.remove("ChangeZIndex");
					if (NotificaionsPageView.openDeleteNotification == 1) /*this is open*/ 
					{
						document.querySelector("#NotificationsHeader .CheckAll").style.color = "#171c8f";
						tilesList[i].style.pointerEvents = "none";
						document.getElementById("RemoveNotificationsBtn").style.webkitTransform = "translate(0px,0px)";
						document.getElementById("RemoveNotificationsBtn").style.transitionDuration = "0.5s";
					} else {
						tilesList[i].style.pointerEvents = "";
						document.querySelectorAll(".NotificatiomTile input")[i].checked = false; /*un check checkbox*/ 
						document.getElementById("RemoveNotificationsBtn").style.webkitTransform = "translate(0px,100px)";
						document.querySelector("#NotificationsHeader .CheckAll").style.color = "black";
					}
				}
			}
			NotificationInstance.CheckHideRemoveButton();
		},
		renderCheckedCounter: function() {
			var checkedElements = document.querySelectorAll('.termsRow input[type="checkbox"]:checked');
			if (checkedElements) {
				document.querySelector(".RemoveCount").innerHTML = "[" + checkedElements.length + "]";
			}
		},
		cancelNotification: function() {
			history.back();
		},

		notificationColorConfig:function(item,currentNotification){

			if (notificationsConfig&&item&&currentNotification) {
				var type = currentNotification.Type ? currentNotification.Type : "GenericInfo";
				var currentType = notificationsConfig[type];
				if (currentType && !isEmpty(currentType)) {
					var iconColor = currentType.IconColor ? currentType.IconColor : "";
					var borderColor = currentType.CricleBorderColor ? currentType.CricleBorderColor : "";
					var iconBackGroungcolor = currentType.IconBackGroundColor ? currentType.IconBackGroundColor : "";
					var textColor = currentType.TextColor ? currentType.TextColor : "";
					var tileBG = currentType.TileBackGroundColor ? currentType.TileBackGroundColor : "";
					
					 item.querySelector(".NotificationBody").setAttribute("backgroundPopup", tileBG);
					/*show Notification Datetime for accident */ 
					if (type == "RoadInfo" && currentNotification.NotificationDate) {

						item.querySelector("#notificationDateTime").style.display = "block";
						item.querySelector("#notificationDateTime i").classList.add("icon-calendar");
						item.querySelector("#notificationDateTime i").style.color = textColor;
						item.querySelector("#notificationDateTime i").style.background = tileBG;
						item.querySelector("#notificationDateTime .NotificationTime").style.color = textColor;
						item.querySelector("#notificationDateTime .NotificationTime").innerHTML =  currentNotification.NotificationDate;
					}
					/*Add Action Url If valid URL*/ 
					var action_URL = currentNotification.Action_URL ?currentNotification.Action_URL : "";
					if (action_URL) {
						item.querySelector(".NotificationMess").addEventListener('click', function(e) {
							e.preventDefault();
							if (e.currentTarget.attributes.NotifType && e.currentTarget.attributes.NotifType.value == "Happiness") {
								HapinessMeterRatingModel.showHappinessMeter(false);
							} else if (e.currentTarget.attributes.NotificationURL && e.currentTarget.attributes.NotificationURL.value) {
								var current = e.currentTarget.attributes.NotificationURL.value;
								current.indexOf(".html") != -1 ? mobile.changePage(current) : "";
							}
						});
					}
					item.querySelector(".NotificationMess").style.background = tileBG;
					item.querySelector(".icon").style.color = iconColor;
					item.querySelector(".icon").style.border = "1px solid " + borderColor;
					currentType.Radius ? item.querySelector(".NotificationMess").style.borderRadius = "5px" : "";
					item.querySelector(".icon").style.background = iconBackGroungcolor;
					item.querySelector(".NotificationTitle").style.color = textColor;
					item.querySelector(".NotificationBody").style.color = textColor;
				}
			}
		},
		bindNotificationBody:function(item,currentNotification,id,i){

			item.querySelector(".NotificationItem").setAttribute("id", "Noti" + id);
			item.querySelector(".NotificationItem").setAttribute("index", i);
			var iconName = currentNotification.Icon_Name ?currentNotification.Icon_Name : "";
			if (iconName) item.querySelector(".NotificationMess i").classList.add(iconName.replace(/\s/g, ''));
			item.querySelector(".NotificationItem").setAttribute("NotificationId", id);
			var title_En = currentNotification.Title_En ? currentNotification.Title_En : "";
			var title_Ar = currentNotification.Title_Ar ? currentNotification.Title_Ar : "";
			item.querySelector(".NotificationMess .NotificationTitle").innerHTML = (getApplicationLanguage() == 'en') ? title_En : title_Ar;
			var body_En = currentNotification.Body_En ? currentNotification.Body_En : "";
			var body_Ar = currentNotification.Body_Ar ? currentNotification.Body_Ar : "";
			var body = (getApplicationLanguage() == 'en') ? body_En : body_Ar;
			item.querySelector(".NotificationMess .NotificationBody").innerHTML = body;
			item.querySelector(".NotificationMess").setAttribute("NotificationURL", currentNotification.Action_URL);
			item.querySelector(".NotificationMess").setAttribute("NotifType", currentNotification.Type);
			item.querySelector(".EditNotification").setAttribute("id", "EditNotification" + i);
			item.querySelector(".removeNotification").setAttribute("index", i);
			item.querySelector(".removeNotification").setAttribute("NotificationId", id);

			/* set height of notification*/
			var height = 90;
			if (body.length > 100 && body.length < 150) height = 110;
			else if (body.length > 150) height = 145;
			document.querySelector(".removeNotification").style.paddingTop = height / 3 + "px";
			item.style.height = height + "Px";
			item.querySelector(".NotificationMess").style.height = height - 10 + "Px";
			item.querySelector(".EditNotification").style.height = height - 10 + "Px";
			item.querySelector(".NotificationMess .NotificationBody").style.height = height - 60 + "Px"; 
		},

		bindNotifications: function(notificationsList) {
			try{
				var isEmptyNotification=false;
				document.getElementById("NotificationsList").innerHTML = "";
				if (notificationsList && notificationsList.length > 0) {
					var template = document.getElementById("NotificationTemplate");
					for (var i = 0; i < notificationsList.length; i++) {
						/*check if item not deleted from user before*/ 
						if (!notificationsList[i].hasOwnProperty("IsDeleted") || (notificationsList[i].hasOwnProperty("IsDeleted") && notificationsList[i].IsDeleted == false)) {
							var item = $(template).clone()[0];
							isEmptyNotification=true;
							var id = notificationsList[i].Id ? notificationsList[i].Id : "";
							item.addEventListener('click', function(event) {
								event.preventDefault();
								if (NotificaionsPageView.openDeleteNotification == 1) /*one  is mean checkbox is appear*/
								{
									var checkBox = this.querySelector('.termsRow input[type="checkbox"]');
									(checkBox && checkBox.checked) ? checkBox.checked = false: checkBox.checked = true;;
									NotificationInstance.renderCheckedCounter();
								}
							});
							item.style.display = "block";
							item.setAttribute("id", "Notification" + i);
							item.indxId = id;
							//handle CheckBoxes
							item.getElementsByClassName("CheckNotification")[0].id = i;
							item.getElementsByClassName("CheckNotification")[0].setAttribute("name", i);
							item.querySelector(".CheckNotification").setAttribute("notificationId", id)
							item.querySelector(".termsRow .waves-effect").setAttribute("for", i);
							item.querySelector(".CheckNotification").addEventListener('change', function(event) {
								event.preventDefault();
								NotificationInstance.renderCheckedCounter();
							});
							/*handle notification body*/ 
							NotificationInstance.bindNotificationBody(item,notificationsList[i],id,i)

							/*Handle event remove Button click */ 
							item.querySelector(".removeNotification").addEventListener('touchstart', function(e) {
								e.preventDefault();
								var current = e.currentTarget.attributes.NotificationId;
								if (current) {
									var checkList = [];
									checkList.push(current.value);
									NotificationsModel.DeleteUserNotifications(checkList, null)
									var currentNotification = this.parentElement.parentElement.parentElement;
									NotificationInstance.DeleteNotificationElement(currentNotification)
								}
							});
							/*Read color configuration*/ 
							NotificationInstance.notificationColorConfig(item,notificationsList[i])
							// Add event for notification
							
							if(item.querySelector(".NotificationBody")){

                        	var title_En = notificationsList[i].Title_En ? notificationsList[i].Title_En : "";
			                var title_Ar = notificationsList[i].Title_Ar ? notificationsList[i].Title_Ar : "";
			               
			                var body_En = notificationsList[i].Body_En ? notificationsList[i].Body_En : "";
			                var body_Ar = notificationsList[i].Body_Ar ? notificationsList[i].Body_Ar : "";
                            
			            	var title=getApplicationLanguage() != 'en'?title_Ar:title_En;
			            	var body=getApplicationLanguage() != 'en'?body_Ar:body_En;
			            	
                         /*   item.querySelector(".NotificationBody").setAttribute("notificationTitle", title);
							 item.querySelector(".NotificationBody").setAttribute("notificationBody", body);
							 item.querySelector(".NotificationBody").setAttribute("lat", 25.234241);
							 item.querySelector(".NotificationBody").setAttribute("lng", 55.356575);*/
			            	  var payload = notificationsList[i].Payload ? notificationsList[i].Payload : "";
			            	 item.querySelector(".NotificationBody").setAttribute("payload",payload);
			            	

							item.querySelector(".NotificationBody").addEventListener('click', function(e) {
								// Add lat long
							 //  event.stopPropagation();
                              /*  var notificationTitle= e.currentTarget.attributes.notificationTitle.value;
                                 var notificationBody= e.currentTarget.attributes.notificationBody.value;
                                 var lat=  e.currentTarget.attributes.lat.value;
                                 var lng=   e.currentTarget.attributes.lng.value;
                                 var BGColor=e.currentTarget.attributes.backgroundPopup.value;
                                  mobile.changePage("shell/incidents.html", {data:{lat: lat, lng:lng,notificationTitle:notificationTitle,notificationBody:notificationBody,bgColor:BGColor}} );
                                 */
								 var payload=e.currentTarget.attributes.payload.value;
								 if(payload)
								     mobile.changePage("shell/incidents.html", {data:{payload: payload}} );
							});
							}
							document.getElementById("NotificationsList").appendChild(item);
						}
					}
				}
				if(!isEmptyNotification) {
					NotificationInstance.EmptyNotificationBackground(true);
				}
				NotificationInstance.AddSwipeToNotificationList();
				$(".ui-loader").hide();
				NotificationInstance.AnimationSwipeFirstTime();
			}
			catch(e){
				$(".ui-loader").hide();
				var showText=false;
				NotificationInstance.EmptyNotificationBackground(showText);
				var generalErrorPopup = new Popup('generalErrorPopup');
				generalErrorPopup.show();
			}
		},
		AnimationSwipeFirstTime: function() {
			var animateNotification = DataUtils.getLocalStorageData("NotificationsAnimated", "shell");
			if (isUndefinedOrNullOrBlank(animateNotification) || animateNotification != "true") {
				DataUtils.setLocalStorageData("NotificationsAnimated", true, true, "shell");
				if (Swiped._elems && Swiped._elems.length > 0) {
					/*open Swipe for first time only*/ 
					Swiped._elems.forEach(function(Swiped) {
						var dir = -1; // english
						if (getApplicationLanguage() != 'en') dir = 1;
						Swiped.animation(1 * dir * Swiped.width);
						Swiped.swiped = true;
						Swiped.transitionEnd(Swiped.elem, Swiped.onOpen);
						Swiped.resetValue();
					});
					/* close all after 1 sec*/
					setTimeout(function() {
						Swiped._elems.forEach(function(Swiped) {
							var dir = 1;
							if (getApplicationLanguage() != 'en') dir = -1;
							Swiped.animation(0 * dir * Swiped.width);
							Swiped.swiped = true;
							Swiped.duration = "2000";
							Swiped.duration = "200";
							Swiped.transitionEnd(Swiped.elem, Swiped.onClose);
							Swiped.resetValue();
						})
					}, 1000);
				}
			}
		},
		EmptyNotificationBackground: function(showText) {
			if (!document.querySelector("#NotificationsList .NotificatiomTile")) {
				/*Empty Notification*/ 
				document.getElementById("RemoveNotificationsBtn").style.webkitTransform = "translate(0px,100px)";
				var item = document.getElementById("NotificationsList");
				item.style.backgroundImage = "url('../../common/images/shell/notifications/bg-notification.png')";
				item.style.backgroundRepeat = "no-repeat";
				item.style.backgroundSize = "cover";
				item.style.width = "100%";
				item.style.margin = "0px";
				item.style.height = "100%";
				var div = document.createElement('div');
				div.id = 'EmptyNotificationsMess';
				var header = document.createElement('span');
				header.id = "CurrentUserNotications";
				/*Get Current User*/ 
				if(showText)
				{
					var userInfo = {};
					try {
						userInfoString = DataUtils.getLocalStorageData("userProfile", "shell");
						if (userInfoString) {
							userInfo = JSON.parse(userInfoString);
						}

					} catch (e) {}
					var currentuser=userInfo&&userInfo.Users&&userInfo.Users.length>0?userInfo.Users[0]:"";
					var userName = currentuser ?currentuser.first_name_en + ",": "";
					header.innerHTML="";
					header.innerHTML = localize("%shell.Notifications.hi%") +" "+userName;
					var desc = document.createElement('span');
					desc.innerHTML="";
					desc.id = "EmptyNotificationBody";

					desc.innerHTML = localize("%shell.Notifications.EmptyNotificationMessage%");
					document.getElementById("NotificationsList").innerHTML="";
					div.appendChild(header);
					div.appendChild(desc);
				}
				item.appendChild(div);
			}},
			DeleteNotificationElement: function(element, durationTime) {
				if (element) {
					/*increase time removing for soft remove*/
					durationTime = durationTime ? durationTime : 1;
					element.style.transitionDuration = durationTime + "s";
					element.style.webkitTransform = "translate(-500px,0px)";
					setTimeout(function() {
						element.remove();
						NotificationInstance.renderCheckedCounter();
						NotificationInstance.EmptyNotificationBackground(true);
					}, (durationTime * 300));
				}
			},
			AddSwipeToNotificationList: function() {
				var tilesList = document.querySelectorAll(".NotificatiomTile .NotificationItem");
				if (tilesList) {
					for (var i = 0; i < tilesList.length; i++) {
						/*get touch index*/ 
						tilesList[i].addEventListener('touchstart', function(e) {
							var swap;
							var index = e.currentTarget.attributes.index;
							if (index) {
								var index = JSON.parse(index.value);
								NotificaionsPageView.selectedNotificationIndex = index;
							}
						}, false);
						var currentId = tilesList[i].attributes.notificationid ? tilesList[i].attributes.notificationid.value : "";
						if (currentId) {
							var id = "#Noti" + currentId;
							var index = i;
							if (getApplicationLanguage() == 'en') {
								Swiped.init({
									query: id,
									right: 80,
									onMove: function() {
										var index = NotificaionsPageView.selectedNotificationIndex;
										var editElement = document.getElementById("EditNotification" + NotificaionsPageView.selectedNotificationIndex);
										editElement ? editElement.classList.remove("ChangeZIndex") : "";
									},
									onClose: function() {
										var index = NotificaionsPageView.selectedNotificationIndex;
										var editElement = document.getElementById("EditNotification" + NotificaionsPageView.selectedNotificationIndex);
										editElement ? editElement.classList.remove("ChangeZIndex") : "";
									},
									onOpen: function() {
										var index = NotificaionsPageView.selectedNotificationIndex;
										var mainElBounding = this.elem.getBoundingClientRect();
										var editElem = document.getElementById("EditNotification" + NotificaionsPageView.selectedNotificationIndex);
										if (mainElBounding.x < 0 && editElem) editElem.classList.contains("ChangeZIndex") == false ? editElem.classList.add("ChangeZIndex") : "";
									}
								});
							} else {
								Swiped.init({
									query: id,
									left: 80,
									onMove: function() {
										var index = NotificaionsPageView.selectedNotificationIndex;
										var editElement = document.getElementById("EditNotification" + NotificaionsPageView.selectedNotificationIndex);
										editElement ? editElement.classList.remove("ChangeZIndex") : "";
									},
									onClose: function() {
										var index = NotificaionsPageView.selectedNotificationIndex;
										var editElement = document.getElementById("EditNotification" + NotificaionsPageView.selectedNotificationIndex);
										editElement ? editElement.classList.remove("ChangeZIndex") : "";
									},
									onOpen: function() {
										var index = NotificaionsPageView.selectedNotificationIndex;
										var mainElBounding = this.elem.getBoundingClientRect();
										var editElem = document.getElementById("EditNotification" + NotificaionsPageView.selectedNotificationIndex);
										if (mainElBounding.x < 0 && editElem) editElem.classList.contains("ChangeZIndex") == false ? editElem.classList.add("ChangeZIndex") : "";
									}
								});
							}
						}
					}
				}
			},
			swipeNotificationIcon:function(){
				var notificationElem=document.getElementById("notificationBtn");

				if(notificationElem&&notificationElem.classList.contains("icon-notifications-new"))
				{
					notificationElem.classList.remove("icon-notifications-new")
					notificationElem.classList.add("icon-notifications");

				}
			},
			updateDashboardNotification:function(){
				var notificationElem=document.getElementById("notificationBtn");
				if(notificationElem&&notificationElem.classList.contains("icon-notifications-new"))
				{
					notificationElem.classList.remove("icon-notifications-new")
					notificationElem.classList.add("icon-notifications");
					
				}
				
				var notificationList=DataUtils.getLocalStorageData('userNotifications', "shell");
				var currentElement;
				if(notificationList&&notificationList.length>0)
				{
					var notifications=JSON.parse(notificationList);
					if(notifications.length>0){
					currentElement=notifications[0];
					notifications[0].IsShowDB=true;
					DataUtils.setLocalStorageData('userNotifications',JSON.stringify(notifications), true, "shell");
					}
				}
			},
			onPageShow: function() {
				NotificationInstance.swipeNotificationIcon();
				$(".ui-loader").show();
				/*this is if loader exist*/
				setTimeout(function() {
					$(".ui-loader").hide();
				}, 50000);
				/*refresh when scrol down*/  
				document.querySelector("#NotificationsList").addEventListener('scroll', function(e) {
					var generalNotification = localStorage.getItem("shellActiveGeneralNotification");
					generalNotification = generalNotification != null ? JSON.parse(generalNotification):false;
					
					// check is enable general notification setting  setting 
					if ($("#NotificationsList").scrollTop() == 0&&NotificaionsPageView.openDeleteNotification != 1&&generalNotification==true) {
						var notifications = DataUtils.getLocalStorageData('userNotifications', "shell");
						NotificationInstance.bindNotifications(JSON.parse(notifications));
					}
				});
				//var notifications = DataUtils.getLocalStorageData('userNotifications', "shell");
				//NotificationInstance.bindNotifications(JSON.parse(notifications));
				NotificationsModel.getLast30DaysNotifications(function(result){
					$(".ui-loader").hide();
					NotificationInstance.bindNotifications(result);

					document.getElementById("RemoveNotificationsBtn").style.webkitTransform = "translate(0px,100px)";
					//update Dashboard
					NotificationInstance.updateDashboardNotification();
					
				});
				

			},
			dispose: function() {
				PageView.prototype.dispose.call(this);
			}
	});
	return NotificaionsPageView;
});