
define(["com/views/PageView", "com/views/Header"], function(PageView, Header) {
	var IncidentsPageView = PageView.extend({
		events: {
			'pageshow': 'onPageShow'
		},
		initialize: function(options) {
			IncidentsPageViewInstance = this;
			options.headerState = Header.STATE_MENU;
			options.phoneTitle = localize("User Location");
			PageView.prototype.initialize.call(this, options);
		},
		
		destoryOldMap:function(){
			var googleAPIs = GoogleAPIs.getInstance();

			googleAPIs.destroyGoogleScripts(function (){
				var params = {
						"googleAPI":"Maps JavaScript API",
						"appName":"SHELL",
						"options":{
							"region":"AE",
							"callback":"IncidentsPageViewInstance.iniatMap"
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
		},
		
		onPageShow: function() {
			try{
				latLocation= 25.234241;  // default
				lngLocation=55.356575;
				IncidentsPageViewInstance.markers=[];
				IncidentsPageViewInstance.latLngList=[];

				
				IncidentsPageViewInstance.destoryOldMap();
				
				//	$.getScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyBs6Cxa7JP9u16_O5CA73EuwlwIKKE-G6g&libraries=drawing&region=UAE&sensor=false&callback=IncidentsPageViewInstance.iniatMap');
				/*var googleAPIs = GoogleAPIs.getInstance();

				googleAPIs.destroyGoogleScripts(function (){
					var params = {
							"googleAPI":"Maps JavaScript API",
							"appName":"SHELL",
							"options":{
								"region":"AE",
								"callback":"IncidentsPageViewInstance.iniatMap"
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
				});*/
			}
			catch(e){
				console.log(e);
			}
		},


		highlightMarker: function(index) {
			try{
				var markers=IncidentsPageViewInstance.markers;
				console.log("highlightMarker");
				var opacity;
				if (index != undefined) {
					opacity = 0.2;
					for (var i = 0; i < markers.length; i++) {
						markers[i].setOptions({
							opacity: opacity
						});
					}
					markers[index].setOptions({
						opacity: 1
					});
					markers[index].icon.size.height = 35;
					markers[index].icon.size.width = 35;
				} else {
					opacity = 1;
					for (var i = 0; i < markers.length; i++) {
						markers[i].setOptions({
							opacity: opacity
						});
						markers[i].icon.size.height = 20;
						markers[i].icon.size.width = 20;
					}
				}
			}
			catch(e){
				console.log(e);
			}
		},

		iniatMap:function(){
			try{
				var notificationTitle="";
				var notificationBody="";
				var bgColor="#ebfdf9";
				var urlParams=IncidentsPageViewInstance.options;
				if(urlParams.data&&urlParams.data.payload){
					var replaceQuotes= urlParams.data.payload.replace(/'/g, '"');
					var parseObject=JSON.parse(replaceQuotes);
					notificationTitle= urlParams.data.notificationTitle;
					notificationBody=urlParams.data.notificationBody? urlParams.data.notificationBody.replace(new RegExp("\\+","g"),' '):"";
					bgColor=urlParams.data.bgColor?urlParams.data.bgColor:"#ebfdf9";

					map = new google.maps.Map(document.getElementById('googleMapLocation'), {
						center: {lat: latLocation, lng: lngLocation},
						zoom: 10,
						disableDefaultUI: true,
						gestureHandling: "greedy"
					});

					var icon = {
							url:
								/*"https/://mfp-staging.rta.ae:6443/index/smartgov/apps/dubai_drive/images/" +*/ // this is for testing
								"https://m.rta.ae/index/smartgov/apps/dubai_drive/images/incident-pin-40.png",  // production
								scaledSize: new google.maps.Size(20, 20), // scaled size
								origin: new google.maps.Point(0, 0), // origin
								anchor: new google.maps.Point(0, 0) // anchor
					};
					if(parseObject.details&&parseObject.details.length>0){

						document.querySelector("#IncidentUser .servicesList").style.height=(parseObject.details.length)*70 +"px";
						var template = document.getElementById("incidentTemplate");
						for(var i=0;i<parseObject.details.length;i++){
							var item = $(template).clone()[0];
							item.style.display = "block";
							item.setAttribute("id", "");
							item.setAttribute("index", i);

							item.addEventListener('click', function(event) {
								event.preventDefault();
								//	alert("hi");
								// remove style before 
								var allitems=document.getElementsByClassName("serviceItem");
								for(var j=0;j<allitems.length;j++)
								{
									allitems[j].style.border="none";
								}

								this.style.border = "thick solid red";
								var index=parseInt(event.currentTarget.attributes.index.value);
								var markers=IncidentsPageViewInstance.markers;
								var Latlng = new google.maps.LatLng(IncidentsPageViewInstance.latLngList[index].lat, IncidentsPageViewInstance.latLngList[index].lng);

								map.setCenter(Latlng);
								//map.setZoom(14);
								IncidentsPageViewInstance.highlightMarker(index)
							});
							item.querySelector(".serviceTitle").innerText=parseObject.details[i].msg.replace(/\+/g,' ');
							latLocation=parseObject.details[i].lat;
							lngLocation=parseObject.details[i].lng;
							latLocation=parseFloat(latLocation);
							lngLocation=parseFloat(lngLocation);
							IncidentsPageViewInstance.latLngList.push({lat:latLocation,lng:lngLocation})
							var marker = new google.maps.Marker({
								position: {lat: latLocation, lng: lngLocation},
								map: map,
								icon: icon
							});
							IncidentsPageViewInstance.markers.push(marker)
							if(notificationBody){

								var contentString = "<div class='notificationBodyPopup'>"+notificationBody+"</div>";
								var infowindow = new google.maps.InfoWindow({
									content: contentString
								});
							}
							google.maps.event.addListener(marker, 'click', function() {
								//infowindow.open(map, marker);

								map.setZoom(15);
								map.setCenter(marker.getPosition());
							});

							document.getElementById("incidentsList").appendChild(item);
						}}
					document.getElementById('googleMapLocation').style.height="100%";
				}
				else{
					IncidentsPageViewInstance.defaultMap();
				}
			}
			catch(e){
				console.log(e);
				IncidentsPageViewInstance.defaultMap();
			}
		},

		defaultMap:function(){
			IncidentsPageViewInstance.destoryOldMap();
			map = new google.maps.Map(document.getElementById('googleMapLocation'), {
				center: {lat: 25.234241, lng: 55.356575},
				zoom: 10,
				disableDefaultUI: true,
				gestureHandling: "greedy"
			});
		},
		
		dispose: function() {
			PageView.prototype.dispose.call(this);
		}
	});
	return IncidentsPageView;
});