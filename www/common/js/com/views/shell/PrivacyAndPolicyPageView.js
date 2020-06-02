define([ 
		
		"jquery", 
		"backbone",
		"com/views/PageView",
		"com/views/Header",
		'com/models/shell/PrivacyAndSecurityModel'
	
	], function( $, Backbone, PageView, Header, PrivacyAndSecurityModel ) {
		
    // Extends PagView class
    var PrivacyAndPolicyPageView = PageView.extend({
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
        	PrivacyAndPolicyPageViewInstance = this;

        	options.phoneTitle = Globalize.localize("%shell.privacy.title%", getApplicationLanguage());
			options.headerState = Header.STATE_MENU;
        	PageView.prototype.initialize.call(this, options);
        	
        },

        getPrivacyAndSecurityData:function(data) {
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
        	PrivacyAndPolicyPageViewInstance.data = data;
        	PrivacyAndPolicyPageViewInstance.bindData();
        	
//            	   var regex = /(https?:\/\/([-\w\.]+)+(:\d+)?(\/([\w\/_\.]*(\?\S+)?)?)?)/ig;
//			        // Replace plain text links by hyperlinks
//		        	var replaced_text = data.replace(regex, "<a href=\"#\" onclick=\"javascript:window.open('$1', '_system');\">$1</a>");
//            		$("#PrivacyAndPolicyTag").html(replaced_text);
            	
        },
        bindData:function(){
        	for(var i=0;i<PrivacyAndPolicyPageViewInstance.data.length;i++){
        		var temp = document.getElementById("itemTemplate")
        					.getElementsByClassName("itemCont")[0].cloneNode(true);
        		
        		temp.querySelector('input[type=checkbox]').onclick = PrivacyAndPolicyPageViewInstance.onCollapseItemClick;
        		temp.querySelector('input[type=checkbox]').index = i;
        		
        		temp.querySelector('.head').textContent = PrivacyAndPolicyPageViewInstance.data[i].mainHead;
        		temp.querySelector('.content').innerHTML = PrivacyAndPolicyPageViewInstance.data[i].mainContent;
        		if(PrivacyAndPolicyPageViewInstance.data[i].subContent)
        			temp.querySelector('.content').innerHTML += PrivacyAndPolicyPageViewInstance.data[i].subContent;
        		
        		document.getElementById("privacyAndPolicyPage").querySelector('.collapsible').appendChild(temp);
        	}
        },
		onPageShow: function() {
//			document.getElementById("privacyAndPolicyPage").setAttribute("data-role","content");
			PrivacyAndSecurityModel.getPrivacyAndSecurityContent(PrivacyAndPolicyPageViewInstance.getPrivacyAndSecurityData);
			if(getApplicationLanguage() == "en"){
				var style = document.createElement("style");
                style.innerText = "#privacyAndPolicyPage .content::first-letter {text-transform: uppercase;}";
            	document.getElementById("privacyAndPolicyPage").appendChild(style);
			}
		},
		onCollapseItemClick: function(e){
			var currentItem = document.getElementById("privacyAndPolicyPage")
				.getElementsByClassName("itemCont")[e.currentTarget.index];
			if(!e.currentTarget.checked){
				currentItem.className += " active";
			}else{
				currentItem.className = currentItem.className.replace(" active","");
			}
		},
		onCloseTap:function(){
			var items = document.getElementById("privacyAndPolicyPage")
					.getElementsByClassName("itemCont");
			for(var k=0; k < items.length; k++){
				items[k].style.display = "block";
			}
		},
		onSearch:function(e){
			var searchText = document.getElementById("searchInput").value;
			var collapseItems = document.getElementById("privacyAndPolicyPage")
				.getElementsByClassName("itemCont");
			var contentToSearch = PrivacyAndPolicyPageViewInstance.data;
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
    return PrivacyAndPolicyPageView;

});