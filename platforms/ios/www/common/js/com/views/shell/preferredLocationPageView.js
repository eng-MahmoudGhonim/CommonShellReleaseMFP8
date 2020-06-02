
define(["com/views/PageView", "com/views/Header","com/models/shell/NotificationsModel","com/models/shell/IncidentDetectionModel", "com/utils/DataUtils"], function(PageView, Header,NotificationsModel,IncidentDetectionModel,DataUtils) {
	var preferredLocationPageView = PageView.extend({
		events: {
			'pageshow': 'onPageShow'
		},
		initialize: function(options) {
			options.headerState = Header.STATE_MENU;
			options.phoneTitle = localize("Preferred Location");
			PageView.prototype.initialize.call(this, options);
			preferredLocationInstance=this;
		},
		onPageShow: function() {
			try{
				var saveButton= document.getElementById("savePreferredAlerts").classList;
				if(!saveButton.contains("disabled"))
					saveButton.add("disabled");
				//	$.getScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyBs6Cxa7JP9u16_O5CA73EuwlwIKKE-G6g&libraries=drawing&region=UAE&sensor=false&callback=IncidentsPageViewInstance.iniatMap');
				var googleAPIs = GoogleAPIs.getInstance();

				googleAPIs.destroyGoogleScripts(function (){
					var params = {
							"googleAPI":"Maps JavaScript API",
							"appName":"SHELL",
							"options":{
								"region":"AE",
								"callback":"preferredLocationInstance.iniatMap"
							}
					};
					var googleAPIs = GoogleAPIs.getInstance();
					googleAPIs.generateMapsURL(params.appName,params.googleAPI,params.options,
							function (url){
						console.log(url);

						if(url&&!url.error){
							$.getScript(url);
						}
					});
				});
			}
			catch(e){
				console.log(e)
			}
		},

		iniatMap:function(){
			try{
				var latLocation= 25.234241;
				var lngLocation=55.356575;
				var notificationTitle="";
				var notificationBody="";
				var bgColor="#ebfdf9";

				map = new google.maps.Map(document.getElementById("googleMapPreferredLocation"), {
					center: {lat: latLocation, lng: lngLocation},
					zoom: 12,
					disableDefaultUI: true,
					gestureHandling: "greedy"
				});

				var boun=localStorage.getItem("currentBounds");

				NotificationsModel.getUserLocation(function(result){
					console.log("result get"+result[0]);

					var southWesting= JSON.parse(result[0].southWest);
					var northEast=JSON.parse(result[0].northEast);
					var  bounds="";
					if(southWesting&&northEast){
						bounds= new google.maps.LatLngBounds(
								new google.maps.LatLng(southWesting["southWest"].lat,southWesting["southWest"].lng),//south west
								new google.maps.LatLng(northEast["northEast"].lat,northEast["northEast"].lng)) //north east
					}


					// Define a rectangle and set its editable property to true.
					rectangle = new google.maps.Rectangle({
						bounds: bounds,
						editable: false
					});
					rectangle.setMap(map);
				});
				if(notificationBody){

					var contentString = "<div class='notificationBodyPopup'>"+notificationBody+"</div>";
					var infowindow = new google.maps.InfoWindow({
						content: contentString
					});
				}

				document.getElementById('savePreferredAlerts').addEventListener('click',function(){
					setTimeout(function(){
						$(".ui-loader").hide();
					}, 50000);
					var northest=preferredLocationInstance.NorthEast;
					var southwst=preferredLocationInstance.SouthWest;
					if(northest && southwst){
						$(".ui-loader").show();
						NotificationsModel.insertUserPreferredLocation(northest,southwst,function(result){
							console.log("result"+result);
							// unsubscribe standard notifications 
							var parseuserConfig = IncidentDetectionModel.getUserConfig();
							var subscribedTags=[];
							if(parseuserConfig&&parseuserConfig.length>0){
								for(var i =0;i<parseuserConfig.length;i++){
									if(parseuserConfig[i].value==true)
									{
										//change to be unsubscribe 
										parseuserConfig[i].value=false;
										subscribedTags.push(parseuserConfig[i]);
									}
								}
							}
							if(subscribedTags&&subscribedTags.length>0)
							{
								// set default false if
								var result=[{name:"allAlerts",value:false},{name:"hospitals",value:false},{name:"airports",value:false},{name:"metroAndTram",value:false},
								            {name:"schools",value:false},{name:"shopping",value:false},{name:"sports",value:false},{name:"highSeverity",value:false},
								            {name:"dangerousTraffic",value:false}];

								standardNotificationTags(subscribedTags,function(){
									IncidentDetectionModel.saveIncidentDetectionConfig(result,function(){
										$(".ui-loader").hide();
									});
								});
							}
							else{
								$(".ui-loader").hide();
								//mobile.changePage("shell/custom_alerts.html");
								history.back();
							}
						});
					}
					// clear old 
					preferredLocationInstance.NorthEast="";
					preferredLocationInstance.SouthWest="";
				});

				document.getElementById('googleMapPreferredLocation').style.height="100%";
				var drawingManager = new google.maps.drawing.DrawingManager({
					//drawingMode: google.maps.drawing.OverlayType.MARKER,
					drawingControl: true,
					drawingControlOptions: {
						position: google.maps.ControlPosition.TOP_CENTER,
						drawingModes: ['rectangle']
					},
					markerOptions: {icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'},
					circleOptions: {
						fillColor: '#ffff00',
						fillOpacity: 1,
						strokeWeight: 5,
						clickable: true,
						editable: true,
						zIndex: 1
					}
				});

				google.maps.event.addListener(drawingManager, 'rectanglecomplete', function (rectangle) {
					var coordinates = (rectangle.bounds);
					console.log(coordinates);
				});

				google.maps.event.addListener(drawingManager, 'overlaycomplete', function(overlay) {
					document.getElementById("savePreferredAlerts").classList.remove("disabled");
					if(typeof rectangle !== 'undefined'&&rectangle.overlay)
						rectangle.overlay.setMap(null);
					else if(typeof rectangle !== 'undefined')
						rectangle.setMap(null);
					rectangle = overlay;
					if(overlay&&overlay.overlay){
						var bounds = overlay.overlay.getBounds();
						var start = bounds.getNorthEast();
						var end = bounds.getSouthWest();

						preferredLocationInstance.NorthEast=JSON.stringify({"northEast":start});
						preferredLocationInstance.SouthWest=JSON.stringify({"southWest":end});
						console.log(bounds);
						console.log("Start is "+start.toUrlValue(6)+"\n"+ " " + "End is"+end.toUrlValue(6))
					}
				});
				drawingManager.setMap(map);
			}
			catch(e){
				console.log(e)
			}
		},
		dispose: function() {
			PageView.prototype.dispose.call(this);
		}
	});
	return preferredLocationPageView;
});