define([ 
		
		"jquery", 
		"backbone",
		"com/views/PageView",
		"com/views/Header",
		'com/models/shell/TermsConditionsModel'
	
	], function( $, Backbone, PageView, Header, TermsConditionsModel ) {
		
    // Extends PagView class
    var TermsAndConditionsPageView = PageView.extend({
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
        	TermsAndConditionsPageViewInstance = this;
        	 
        	options.phoneTitle = Globalize.localize("%shell.terms.title%", getApplicationLanguage());
			options.headerState = Header.STATE_MENU;
        	PageView.prototype.initialize.call(this, options);
        },

        getTermsConditionsData:function(data) {
        	var language = getApplicationLanguage();
        	if(!(data && data instanceof Array && data.length > 0 && data[0].content_AR != "")){
        		data = localize("%shell.securityAndPreviacy.content%");
        	}else{
        		if(language == "en"){
            		data = data[0].content_EN;
        		}else{
        			data = data[0].content_AR;
        		}
			     
        	}
        	TermsAndConditionsPageViewInstance.data = data;
        	TermsAndConditionsPageViewInstance.bindData();
        },
        bindData:function(){
        	for(var i=0;i<TermsAndConditionsPageViewInstance.data.length;i++){
        		var temp = document.getElementById("itemTemplate")
        					.getElementsByClassName("itemCont")[0].cloneNode(true);
        		
        		temp.querySelector('input[type=checkbox]').onclick = TermsAndConditionsPageViewInstance.onCollapseItemClick;
        		temp.querySelector('input[type=checkbox]').index = i;
        		
        		temp.querySelector('.head').textContent = TermsAndConditionsPageViewInstance.data[i].mainHead;
        		temp.querySelector('.content').innerHTML = TermsAndConditionsPageViewInstance.data[i].mainContent;
        		if(TermsAndConditionsPageViewInstance.data[i].subContent)
        			temp.querySelector('.content').innerHTML += TermsAndConditionsPageViewInstance.data[i].subContent;
        		
        		document.getElementById("TermsAndConditionsPage").querySelector('.collapsible').appendChild(temp);
        	}
        },
		onPageShow: function() {
//			document.getElementById("TermsAndConditionsPage").setAttribute("data-role","content");
			TermsConditionsModel.getTermsAndConditionsContent(TermsAndConditionsPageViewInstance.getTermsConditionsData);
		},
		onCollapseItemClick: function(e){
			var currentItem = document.getElementById("TermsAndConditionsPage")
				.getElementsByClassName("itemCont")[e.currentTarget.index];
			if(!e.currentTarget.checked){
				currentItem.className += " active";
			}else{
				currentItem.className = currentItem.className.replace(" active","");
			}
		},
		onCloseTap:function(){
			var items = document.getElementById("TermsAndConditionsPage")
					.getElementsByClassName("itemCont");
			for(var k=0; k < items.length; k++){
				items[k].style.display = "block";
			}
		},
		onSearch:function(e){
			var searchText = document.getElementById("searchInput").value;
			var collapseItems = document.getElementById("TermsAndConditionsPage")
				.getElementsByClassName("itemCont");
			var contentToSearch = TermsAndConditionsPageViewInstance.data;
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
        },

    });

    // Returns the View class
    return TermsAndConditionsPageView;

});