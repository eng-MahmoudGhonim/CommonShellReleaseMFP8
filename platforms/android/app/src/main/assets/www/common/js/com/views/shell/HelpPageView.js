define([ 
		
		"jquery", 
		"backbone",
		"com/views/PageView",
		"com/models/Constants",
		"com/utils/DataUtils",
	    "com/models/shell/HelpModel",
	    "com/views/Header"
	
	], function( $, Backbone, PageView, Constants, DataUtils, HelpModel, Header) {
		
    // Extends PagView class
    var HelpPageView = PageView.extend({
    	events: {
			'pageshow': 'onPageShow',
			'keyup #searchInput':'onSearch',
			'tap .ui-input-clear':'onCloseTap'
		},

    	/**
         * The View Constructor
         * @param el, DOM element of the page
         */
        initialize: function(options) 
        {
        	HelpPageViewInstance = this;
        	options.phoneTitle = Globalize.localize("%shell.help.title%", getApplicationLanguage());
			options.headerState = Header.STATE_MENU;
            options.currentScrollingContentId = "content";

			PageView.prototype.initialize.call(this, options);

        },
        onPageShow:function(){
//        	document.getElementById("HelpPage").setAttribute("data-role","content");

        	HelpModel.getHelpData(function(data){
				if(data && (data instanceof Array) && data.length > 0){
					HelpPageViewInstance.data = data;
					for(var i=0;i<data.length;i++){
		        		var temp = document.getElementById("itemTemplate")
		        					.getElementsByClassName("itemCont")[0].cloneNode(true);
		        		
		        		temp.querySelector('input[type=checkbox]').onclick = HelpPageViewInstance.onCollapseItemClick;
		        		temp.querySelector('input[type=checkbox]').index = i;
		        		
		        		if(getApplicationLanguage() == "en"){
		        			temp.querySelector('.head').textContent = data[i].title_EN;
			        		temp.querySelector('.content').innerHTML = data[i].article_EN;
		        		}else{
		        			temp.querySelector('.head').textContent = data[i].title_AR;
			        		temp.querySelector('.content').innerHTML = data[i].article_AR;
//			        		.replace(/(<([^>]+)>)/ig,'')
		        		}
		        		document.getElementById("HelpPage").querySelector('.collapsible').appendChild(temp);
		        	}
				}
			});
        },
        onCollapseItemClick: function(e){
			var currentItem = document.getElementById("HelpPage")
				.getElementsByClassName("itemCont")[e.currentTarget.index];
			if(!e.currentTarget.checked){
				currentItem.className += " active";
			}else{
				currentItem.className = currentItem.className.replace(" active","");
			}
		},
		onCloseTap:function(){
			var items = document.getElementById("HelpPage")
					.getElementsByClassName("itemCont");
			for(var k=0; k < items.length; k++){
				items[k].style.display = "block";
			}
		},
		onSearch:function(e){
			var searchText = document.getElementById("searchInput").value;
			var collapseItems = document.getElementById("HelpPage")
				.getElementsByClassName("itemCont");
			var contentToSearch = HelpPageViewInstance.data;
			var searchResult = [];
			for(var i = 0; i < contentToSearch.length; i++){
				for(var j in contentToSearch[i]){
					if(contentToSearch[i][j].toLowerCase().indexOf(searchText.toLowerCase()) != -1){
						searchResult.push(i);
						break;
					}
				}
			}

			for(var k=0; k < collapseItems.length; k++){
				if(searchResult.indexOf(k) != -1){
					collapseItems[k].style.display = "block";
				}else{
					collapseItems[k].style.display = "none";
				}
			}
		},
         /**
         * do any cleanup, remove window binding here
         * @param none
         */
        dispose: function() {
        	PageView.prototype.dispose.call(this);
        }
    });

    // Returns the View class
    return HelpPageView;

});