define(["com/views/PageView",
        "com/views/Header",
        "com/models/Constants"
        ], function(PageView, Header ,Constants ) {
	var PersonalizePageView = PageView.extend({

		events:{
			"pageshow":"onPageShow"
		},
		initialize: function(options)
		{
			PersonalizePageViewInstance = this;
			options.phoneTitle = localize("%shell.sidepanel.aboutrta%");
			options.headerState = Header.STATE_MENU;
			PageView.prototype.initialize.call(this, options);

		},
		addTile:function(){
			var items = document.querySelectorAll(".tileCont");
			items[this.index].classList.add('active');
			DashboardConfig.tiles[this.index].enabled = true;
			localStorage.setItem("shellDashboardConfig_"+Constants.APP_ID, JSON.stringify(DashboardConfig));
		},
		removeTile:function(){
			console.log(this.index)
			var items = document.querySelectorAll(".tileCont");
			items[this.index].classList.remove('active');
			DashboardConfig.tiles[this.index].enabled = false;
			localStorage.setItem("shellDashboardConfig_"+Constants.APP_ID, JSON.stringify(DashboardConfig));
		},
		onPageShow:function(data) {

			switch(Constants.APP_ID){
			case "RTA_Public_Transport":
				document.getElementsByClassName("tileTitle")[0].innerHTML=localize("%shell.dashboard.pta.title%");
				break;
			case "RTA_Corporate_Services":
				document.getElementsByClassName("tileTitle")[0].innerHTML=localize("%shell.dashboard.corporate.title%");
				break;
			case "RTA_Drivers_And_Vehicles":
				document.getElementsByClassName("tileTitle")[0].innerHTML=localize("%shell.dashboard.dv.title%");
				break;
			}

			document.querySelector("#dashboardPage.personalize .icon-cancel").onclick = function(){
				mobile.changePage("shell/dashboard.html")
			}
			for(var i=0;i<PersonalizeData.length;i++){
				if(PersonalizeData[i].el.querySelector(".reloadCont"))
					PersonalizeData[i].el.querySelector(".reloadCont").parentElement.removeChild(PersonalizeData[i].el.querySelector(".reloadCont"));
				if(PersonalizeData[i].el.querySelector(".tileLoader"))
					PersonalizeData[i].el.querySelector(".tileLoader").parentElement.removeChild(PersonalizeData[i].el.querySelector(".tileLoader"));
				if(PersonalizeData[i].el.querySelector(".serviceListCtrl"))
					PersonalizeData[i].el.querySelector(".serviceListCtrl").parentElement.removeChild(PersonalizeData[i].el.querySelector(".serviceListCtrl"));

				var overlayEl = document.createElement('div');
				overlayEl.className = "overlayCont";
				var blurEl = document.createElement('div');
				blurEl.className = "blurCont";
				overlayEl.appendChild(blurEl)
				PersonalizeData[i].el.appendChild(overlayEl);

				var tileCont = document.createElement('div');
				tileCont.appendChild(PersonalizeData[i].el);
				tileCont.classList.add("tileCont");
				if(PersonalizeData[i].el.id !="driveModeTile" )
					tileCont.classList.add("list-group-item");

				var addBtn = document.createElement('span');
				addBtn.className = "icon-add";
				addBtn.index = i;
				addBtn.onclick = PersonalizePageViewInstance.addTile;

				var removeBtn = document.createElement('span');
				removeBtn.innerText = "-";
				removeBtn.className = "iconRemove";
				removeBtn.index = i;

				removeBtn.onclick = PersonalizePageViewInstance.removeTile;

				tileCont.appendChild(addBtn);
				tileCont.appendChild(removeBtn);

				if(PersonalizeData[i].enabled)
					tileCont.classList.add('active') ;
				document.querySelector("#simpleList").appendChild(tileCont)
			}


			return;
			setTimeout(function (){
				var list = document.getElementById("simpleList");
				Sortable.create(list,{
					animation: 150,
					scroll:list,
					handle:'.expandButton',
					onChoose: function (evt) {
//						console.log(evt)
					},
					onEnd: function (evt) {
//						console.log(evt.item);
//						//set new index
//						evt.item.getElementsByClassName('iconRemove')[0].index=evt.newIndex
//						//set old index
//						reseting
						var items= document.getElementsByClassName('tileCont')
						for(var i = 0;i<items.length ;i++ ){
							items[i].getElementsByClassName('iconRemove')[0].index= i;
							items[i].getElementsByClassName('icon-add')[0].index= i;
						}


					}});
			})
		},
		dispose: function() {
			PageView.prototype.dispose.call(this);
		},

	});

	// Returns the View class
	return PersonalizePageView;

});