function wlSuccessfullyInitialized(){
/* JavaScript content from js/PushNotificationHandler.js in folder common */
//Push notification functions, keep in global scope
window.PushEventSource = window.PushEventSource||"RTA_Drivers_And_Vehicles_Push_Source";
//console.log(PushEventSource);
//Possible values
//RTA_Public_Transport_Push_Source, Smart_Taxi_Push_Source, RTA_Corporate_Services_Push_Source
//RTA_Drivers_And_Vehicles_Push_Source, Smart_Dubai_Parking_Push_Source, Wojhati_Push_Source

function isPushSupported(){
	var pushEnvSupported = false;
	if(WL.Client.Push){
		var env = WL.Client.getEnvironment();
		if((env == WL.Environment.ANDROID)
				|| (env == WL.Environment.IPAD)
				|| (env == WL.Environment.IPHONE)
				|| (env == WL.Environment.WINDOWS_PHONE_8)){
			pushEnvSupported = true;
		}
	}

	return pushEnvSupported;
}

function isPushSubscribed(){
	var isSubscribed = false;
	if (isPushSupported()){
		isSubscribed = WL.Client.Push.isSubscribed('myPush');
	}
	return isSubscribed;
}

//---------------------------- Set up push notifications -------------------------------
if (isPushSupported()){

	WL.Client.Push.onReadyToSubscribe = function(){
		console.log("onReadyToSubscribe");

		WL.Client.Push.registerEventSourceCallback(
				"myPush",
				"PushAdapter",
				window.PushEventSource,
				pushNotificationReceived);
		console.log(window.PushEventSource);
		if(WL.Client.isUserAuthenticated("masterTest")){
			//Now subscribe
			doSubscribe();
		}
	};
}

//--------------------------------- Subscribe ------------------------------------
function doSubscribe(){
	try{
		console.log('doSubscribe() Called');
		setTimeout(
				function(){
					if (isPushSupported()){
						WL.Client.Push.registerEventSourceCallback(
								"myPush",
								"PushAdapter",
								window.PushEventSource,
								pushNotificationReceived);

						WL.Client.Push.subscribe("myPush", {
							onSuccess: doSubscribeSuccess,
							onFailure: doSubscribeFailure
						});
					}
				}, 5000);
	} catch (e) {
		console.log(e);
	}
}



function doSubscribeSuccess(){
	console.log("doSubscribeSuccess");
}

function doSubscribeFailure(){
	console.log("doSubscribeFailure");
}

//------------------------------- Unsubscribe ---------------------------------------
function doUnsubscribe(){
	console.log('Alert - doUnsubscribe() Called');
	if (isPushSupported()){
		WL.Client.Push.unsubscribe("myPush", {
			onSuccess: doUnsubscribeSuccess,
			onFailure: doUnsubscribeFailure
		});
	}
}

function doUnsubscribeSuccess(){
	console.log("doUnsubscribeSuccess");
}

function doUnsubscribeFailure(){
	console.log("doUnsubscribeFailure");
}

//------------------------------- Handle received notification ---------------------------------------
function pushNotificationReceived(props, payload){
	var returnedObject = props;
	try{
		var notificationElem=document.getElementById("notificationBtn");
		if(notificationElem)
		{
			document.getElementById("notificationBtn").classList.remove("icon-notifications")
			document.getElementById("notificationBtn").classList.add("icon-notifications-new")

			setTimeout(function(){ document.getElementById("notificationBtn").style.webkitTransform   = "translate(1px, 0px)";
			document.getElementById("notificationBtn").style.webkitTransform  = "rotate(-20deg)" }, 100);

			setTimeout(function(){ document.getElementById("notificationBtn").style.webkitTransform   = "translate(0px, 0px)";
			document.getElementById("notificationBtn").style.webkitTransform  = "rotate(20deg)" }, 200);

			setTimeout(function(){ document.getElementById("notificationBtn").style.webkitTransform   = "translate(1px, 0px)";
			document.getElementById("notificationBtn").style.webkitTransform  = "rotate(-20deg);" }, 300);

			setTimeout(function(){document.getElementById("notificationBtn").style.webkitTransform   = "translate(0px, 0px)";
			document.getElementById("notificationBtn").style.webkitTransform  = "rotate(20deg);" }, 400);

			setTimeout(function(){ document.getElementById("notificationBtn").style.webkitTransform   = "translate(1px, 0px)";
			document.getElementById("notificationBtn").style.webkitTransform  = "rotate(-20deg)" }, 500);

			setTimeout(function(){ document.getElementById("notificationBtn").style.webkitTransform   = "translate(0px, 0px)";
			document.getElementById("notificationBtn").style.webkitTransform  = "rotate(20deg)" }, 600);

			setTimeout(function(){ document.getElementById("notificationBtn").style.webkitTransform   = "translate(1px, 0px)";
			document.getElementById("notificationBtn").style.webkitTransform  = "rotate(-20deg);" }, 700);

			setTimeout(function(){document.getElementById("notificationBtn").style.webkitTransform   = "translate(0px, 0px)";
			document.getElementById("notificationBtn").style.webkitTransform  = "rotate(20deg);" }, 800);
			if(dashboardPageViewInstance&&typeof dashboardPageViewInstance.callNotification === 'function')
				dashboardPageViewInstance.callNotification(payload);
		}
	}
	catch(e){
		console.log(e);
	}
}


function doSubscribeSuccess(){
	console.log("doSubscribeSuccess");
}

function doSubscribeFailure(){
	console.log("doSubscribeFailure");
}

//-------------------------tag subscribe ----------------

//Standard Notificationn
function standardNotificationTags(tagsList, callback) {
	try{
		if(tagsList&&tagsList.length>0)
		{
			var tagsNumber=tagsList&&tagsList.length;
			var counter=0;
			for(var i=0; i<tagsList.length;i++){
				var tagName=tagsList[i].name+"-notification"
				if(tagsList[i].value==true){

					WL.Client.Push.subscribeTag(tagName, {
						onSuccess: function(e){
							counter++;
							if(counter==tagsNumber)
								callback();
						},
						onFailure: function(e){
							counter++;
							if(counter==tagsNumber)
								callback();
						}
					});
				}
				else{
					//unsubscribe
					WL.Client.Push.unsubscribeTag(tagName, {
						onSuccess: function(e){
							counter++;
							if(counter==tagsNumber)
								callback();
						},
						onFailure: function(e){
							counter++;
							if(counter==tagsNumber)
								callback();
						}
					});

				}

			}
		}
		else{callback();}
	} catch (e) {
		console.log(e);
		callback();
	}
}

//general Notifacation

function subscribeToGeneralTag() {

	WL.Client.Push.subscribeTag("general-notification", {
		onSuccess: subscribeTagSuccess,
		onFailure: subscribeTagFailure
	});
}

/*function subscribeToSampleTag2() {
	WL.Client.Push.subscribeTag("service-notification", {
		onSuccess: subscribeTagSuccess,
		onFailure: subscribeTagFailure
	});
}*/

function subscribeTagSuccess() {
	localStorage.setItem("shellActiveGeneralNotification","true");
	console.log("subscribeTagSuccess");

	/*WL.SimpleDialog.show("Tag Notifications", "Subscribed to tag", [ {
	    text : 'Close',
	    handler : function() {}
	  }
	  ]);*/
}

function subscribeTagFailure() {
	console.log("subscribeTagFailure");
	/*WL.SimpleDialog.show("Tag Notifications", "Failed subscribing to tag", [ {
	    text : 'Close',
	    handler : function() {}
	  }
	  ]);*/
}


//------------------------------- Unsubscribe from tag --------------------------------
function unsubscribeGeneralTag() {
	WL.Client.Push.unsubscribeTag("general-notification", {
		onSuccess: unsubscribeTagSuccess,
		onFailure: unsubscribeTagFailure
	});
}

function unsubscribeFromSampleTag2() {
	WL.Client.Push.unsubscribeTag("sample-tag2", {
		onSuccess: unsubscribeTagSuccess,
		onFailure: unsubscribeTagFailure
	});
}

function unsubscribeTagSuccess(response) {
	localStorage.setItem("shellActiveGeneralNotification","false");
	/*WL.SimpleDialog.show("Tag Notifications", "Unsubscribe from tag", [ {
	    text : 'Close',
	    handler : function() {}
	  }
	  ]);*/
}

function unsubscribeTagFailure(response) {

	/*WL.SimpleDialog.show("Tag Notifications", "Failed subscribing from tag", [ {
	    text : 'Close',
	    handler : function() {}
	  }
	  ]);*/
}


//---------------------------- Set up push notifications -------------------------------
var counter=0 ;
if (isPushSupported()){

	var isGeneralNotificationActive = localStorage.getItem("shellActiveGeneralNotification");
	if(isGeneralNotificationActive == null
			&& isGeneralNotificationActive != "true"
				&&isGeneralNotificationActive != "false" ){
		var subscribeGeneral = setInterval(function() {
			console.log("current subscribe try number " + counter);
			subscribeToGeneralTag();
			var isSubscribe = localStorage.getItem("shellActiveGeneralNotification");
			if(isSubscribe != null||counter>10) //stop interval after 10 tries
			{
				clearInterval(subscribeGeneral);

			}
			counter++;
		}, 2000);

	}
}
}
