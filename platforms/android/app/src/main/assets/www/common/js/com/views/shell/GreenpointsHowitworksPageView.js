define(["com/views/PageView",
        "com/models/shell/AuthenticationModel",
        "com/views/Header",
        "com/utils/DataUtils",
        "com/models/Constants"

        ], function(PageView, AuthenticationModel, Header, DataUtils, Constants ) {

	var GreenpointsHowitworksPageView = PageView.extend({

		events:{
			'pageshow':'onPageShow'
		},
		onPageShow:function(){
			
			document.getElementById("viewGPButton").onclick=function(event){
				event.preventDefault();
				DataUtils.setLocalStorageData("SHOW_LOGIN", false, false, 'shell');
				try{MobileRouter._header.backAction(event);}catch(e){}
			}
			setTimeout(function (){
				var collapsible = new Collapsible(document.querySelector(".collapseCont"));
				setTimeout(function(){document.getElementsByClassName("collapseHead")[0].click();},300);
			});
		},
		initialize: function(options) 
		{
			options.headerState = Header.STATE_SIMPLE;			
			options.phoneTitle = localize("%shell.green.points.title%");
			PageView.prototype.initialize.call(this, options);

		},
		dispose: function() {
			PageView.prototype.dispose.call(this);
		}
	});

	// Returns the View class
	return GreenpointsHowitworksPageView;

});