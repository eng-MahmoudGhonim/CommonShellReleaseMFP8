define(["com/views/PageView","com/utils/Utils","com/models/Constants"], function( PageView,Utils,Constants) {
	var ArrangeDashboardServicesPageView = PageView.extend({
		events:{
			'pageshow':'onPageShow'
		},
		initialize: function(options)
		{
			ArrangeDashboardServicesPageView = this;
			options.hideFooter=true;
			options.hideHeader=true;
			options.enabledInternetManagament=false;
			localStorage.setItem("shellDashboardTilesOrder", "true");
//			var shellDashboardTilesOrder = localStorage.getItem("shellDashboardTilesOrder");
//			if (shellDashboardTilesOrder==null || shellDashboardTilesOrder == undefined ){
//				var defaultArray = ["vehicleTile","finesTile","parkingTile","salikTile","myDocsTile","platesTile","docsTile"];
//				localStorage.setItem("shellDashboardTilesOrder", JSON.stringify(defaultArray));
//			}
			PageView.prototype.initialize.call(this, options);
		},
		onPageShow:function(){

			var orderNumber=0;
			for(var i=0;i<DashboardConfig.tiles.length;i++){
				if(DashboardConfig.tiles[i].sortable){
					var temp = document.querySelector("#template .list-group-item").cloneNode(true);
					temp.setAttribute("data-id",DashboardConfig.tiles[i].name)
					temp.querySelector(".arrangeNumber").innerText = orderNumber + 1;
					if(getApplicationLanguage() == "en"){
						temp.querySelector(".itemContent").innerText = DashboardConfig.tiles[i].displayNameEn;
					}else{
						temp.querySelector(".itemContent").innerText = DashboardConfig.tiles[i].displayNameAr;
					}
					document.querySelector("#simpleList").appendChild(temp);
					orderNumber++;
				}
			}

			var image = document.getElementById("bg");
			image.src = "../../../common/images/shell/splash/bg.jpg";

			document.getElementById("saveButton").onclick=function (){
				Utils.loadHomePage();
			};
			var list = document.getElementById("simpleList");
			window._sortable = Sortable.create(list,{
				animation: 150,
				onChoose: function (evt) {
					var allItems = document.getElementsByClassName("list-group-item");
					for(var i = 0;i<allItems.length;i++){
						var item =allItems[i];
						item.getElementsByClassName("arrangeNumber")[0].style.WebkitTransform="scale(0)";
					}

				},
				onEnd: function (evt) {
					var allItems = document.getElementsByClassName("list-group-item");
					var sortedArr=_sortable.toArray();
					for(var i = 0;i<allItems.length;i++){
						var item =allItems[i];
						item.getElementsByClassName("arrangeNumber")[0].innerHTML=sortedArr.indexOf(allItems[i].getAttribute("data-id")) + 1;
						item.getElementsByClassName("arrangeNumber")[0].style.WebkitTransform="scale(1)";
					}

				},
				group: "shellDashboardTilesOrder",
				store: {

					get: function (sortable) {
						return DashboardConfig.tiles;

//						var order = localStorage.getItem(sortable.options.group.name);
//						return order ? JSON.parse(order) : [];
//						var order = localStorage.getItem(sortable.options.group.name);
//						return order ? order.split('|') : [];
					},


					set: function (sortable) {
						var items  = sortable.toArray();
						var nonsortable = null;
						for(var j=0;j<DashboardConfig.tiles.length;j++){
							if(!DashboardConfig.tiles[j].sortable){
								nonsortable = DashboardConfig.tiles[j];
							}
						}
						if(nonsortable)
							items.splice(nonsortable.order, 0, nonsortable.name);
						for(var i = 0;i<items.length;i++){
							for(var j=0;j<DashboardConfig.tiles.length;j++){
								if(items[i] == DashboardConfig.tiles[j].name){
									DashboardConfig.tiles[j].order = i;
								}
							}
						}
						DashboardConfig.tiles = DashboardConfig.tiles.sort(function(a,b){
							return a.order - b.order;
						});
						localStorage.setItem("shellDashboardConfig_"+Constants.APP_ID, JSON.stringify(DashboardConfig));

						localStorage.setItem("shellDashboardTilesOrder", "true");
//						var order = sortable.toArray();
//						localStorage.setItem(sortable.options.group.name, order.join('|'));
					}
				}
			});
		}

	});

	// Returns the View class
	return ArrangeDashboardServicesPageView;

});
