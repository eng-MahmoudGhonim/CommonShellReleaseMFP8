define(["com/utils/TemplateUtils",
        "com/utils/Utils",
        "com/models/Constants",
        'com/models/shell/PrivacyAndSecurityModel',
        'com/models/shell/TermsConditionsModel'

        ], function(TemplateUtils, Utils, Constants,PrivacyAndSecurityModel,TermsConditionsModel ) {

	// Extends Backbone.View
	var SplashForUpdates = Backbone.View.extend( {
		initialize: function(options)
		{
			self = this;
			var showSplashForUpdates = false;
			if(Constants.privacyVN != localStorage.getItem("shellPrivacyVN")){
				showSplashForUpdates = true;
			}
			if(Constants.termsVN != localStorage.getItem("shellTermsVN")){
				showSplashForUpdates = true;
			}
			if(showSplashForUpdates)
				self.render(options.parent);
		},

		/**
		 * Renders the view
		 * @param parent, parent DOM element to render the view
		 * @param onRendered, function
		 */
		render: function(parent, onRendered)
		{
			var onTemplate = function(html)
			{
				var wrapper = document.createElement("div");
				wrapper.innerHTML = html;
				wrapper.firstChild.getElementsByClassName("banner")[0]
					.getElementsByTagName("img")[0].src =
						"images/shell/" + Constants.APP_ID + "_SplashForUpdatesHeader.jpg" ;

				if(getApplicationLanguage() == "en"){
					wrapper.firstChild.getElementsByClassName("didRead")[0].innerText =
						"Have you read our updated  Terms & Policies?";
					wrapper.firstChild.getElementsByClassName("greeting")[0].innerText = "Hi,"
					wrapper.firstChild.getElementsByClassName("info")[0].innerHTML =
					"<div>RTA would like to inform you, that we have made some changes to the <span>Terms & Policies</span> for " +
					Utils.getAppName(Constants.APP_ID) + " App." +
					"</div>" +
					"<div>Please read them to make sure you understand the changes that may be important for you.</div>"+
					"<div>By using this application, you are agreeing to comply with and be bound by the terms & conditions of use</div>";
					wrapper.querySelector("#readBtn").innerText = "Read our Terms and Policies";
					wrapper.querySelector("#acceptBtn").innerText = "I agree to the Terms & Policies";
//					wrapper.querySelector("#rejectBtn").innerText = "Disagree";
					wrapper.querySelector("#policiesTitle").innerText = "Security and Privacy policies";
					wrapper.querySelector("#termsTitle").innerText = "Terms & Conditions";
					wrapper.querySelector("#lastUpdate").innerText = "Last updated on Sep 18, 2016";
				}else{
					wrapper.firstChild.getElementsByClassName("didRead")[0].innerText =
						"هل قرأت التحديثات الجديدة للشروط والأحكام ؟ ";
					wrapper.firstChild.getElementsByClassName("greeting")[0].innerText = "مرحبا,"
					wrapper.firstChild.getElementsByClassName("info")[0].innerHTML =
					"<div>إننا في هيئة الطرق والمواصلات نود إعلامك أننا قمنا بعمل بعض التغييرات على <span> الشروط و الأحكام </span> لتطبيق " +
					Utils.getAppName(Constants.APP_ID) +
					"</div>" +
					"<div>يرجى التفضل بقراءتها للتأكد من فهم التغيرات التي قد تكون مهمة بالنسبة لك.</div>"+
					"<div>باستخدام هذا التطبيق, أنت توافق على الالتزام بشروط و أحكام الإستخدام</div>";
					wrapper.querySelector("#readBtn").innerText = "قراءة الشروط والأحكام";
					wrapper.querySelector("#acceptBtn").innerText = "أوافق على الشروط و الأحكام.";
//					wrapper.querySelector("#rejectBtn").innerText = "غير موافق";
					wrapper.querySelector("#policiesTitle").innerText = "سياسة الأمن والخصوصية";
					wrapper.querySelector("#termsTitle").innerText = "الشروط والأحكام";
					wrapper.querySelector("#lastUpdate").innerText  = "أخر تحديث سبتمبر 18, 2016";
				}
				wrapper.querySelector("#acceptBtn").onclick = self.acceptTerms;
//				wrapper.querySelector("#rejectBtn").onclick = self.closeApp;
				wrapper.querySelector("#readBtn").onclick = self.openTerms;
				wrapper.querySelector("#closeBtn").onclick = self.closeTerms;
				wrapper.querySelector("#searchInput").onkeyup = self.onSearch;
				document.body.appendChild(wrapper.firstChild);
//				document.getElementById("splashForUpdates")
//					.getElementsByClassName("ui-input-clear")[0].onclick = self.onCloseTap;
//				document.body.removeChild(document.getElementById("splashForUpdates"))
				$.getJSON(window.mobile.baseUrl +"/common/data/fallback_rta_privacy_security.json", function(pData){
					if(getApplicationLanguage() == "en"){
						pData = pData[0].content_EN;
	        		}else{
	        			pData = pData[0].content_AR;
	        		}
					self.policies = pData;
					self.bindData("policies",self.policies);
				});
				$.getJSON(window.mobile.baseUrl +"/common/data/fallback_rta_terms_conditions.json", function(tData){
					if(getApplicationLanguage() == "en"){
						tData = tData[0].content_EN;
	        		}else{
	        			tData = tData[0].content_AR;
	        		}
					self.terms = tData;
					self.bindData("terms",self.terms);

				});
			};
			TemplateUtils.getTemplate("splashForUpdates", {}, onTemplate);

			return this; //Maintains chainability
		},
		closeApp:function(){
			navigator.app.exitApp();
		},
		acceptTerms:function(){
			localStorage.setItem("shellPrivacyVN",Constants.privacyVN);
			localStorage.setItem("shellTermsVN",Constants.termsVN);
			document.body.removeChild(document.getElementById("splashForUpdates"))
		},
		openTerms:function(){
			document.querySelector("#termsPop").style.display = "block";
			document.querySelector("#termsPop").style.webkitTransform = "translate3d(0,0,0)";
		},
		closeTerms:function(){
			document.querySelector("#termsPop").style.webkitTransform = "";
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
        	self.data = data;
        	self.bindData();
        },
        bindData:function(container,data){
        	for(var i=0;i<data.length;i++){

        		var temp = document.getElementById("itemTemplate")
        					.getElementsByClassName("itemCont")[0].cloneNode(true);

        		temp.querySelector('input[type=checkbox]').onclick = self.onCollapseItemClick;
        		temp.querySelector('input[type=checkbox]').index = i;

        		temp.querySelector('.head').textContent = data[i].mainHead;
        		temp.querySelector('.content').innerHTML = data[i].mainContent;
        		if(data[i].subContent)
        			temp.querySelector('.content').innerHTML += data[i].subContent;

        		document.getElementById("splashForUpdates").querySelector('#'+container).appendChild(temp);
        	}
        },
        onCollapseItemClick: function(e){
			var currentItem = e.currentTarget.parentElement;
			if(!e.currentTarget.checked){
				currentItem.className += " active";
			}else{
				currentItem.className = currentItem.className.replace(" active","");
			}
		},
		onCloseTap:function(){
			var items = document.getElementById("splashForUpdates")
					.getElementsByClassName("itemCont");
			for(var k=0; k < items.length; k++){
				items[k].style.display = "block";
			}
		},
		onSearch:function(e){
			var searchText = document.getElementById("searchInput").value;
			var collapseItems = document.getElementById("policies")
				.getElementsByClassName("itemCont");
			var contentToSearch = self.policies;
			var searchResult = [];
			for(var i = 0; i < contentToSearch.length; i++){
				for(var j in contentToSearch[i]){
					if(contentToSearch[i][j].toLowerCase().indexOf(searchText.toLowerCase()) != -1){
						searchResult.push(i);
						break;
					}
				}
			}

			if(searchResult.length == 0){
				document.getElementById("policiesTitle").style.display = "none";
			}else{
				document.getElementById("policiesTitle").style.display = "block";
			}
			for(var k=0; k < collapseItems.length; k++){
				if(searchResult.indexOf(k) != -1){
					collapseItems[k].style.display = "block";
				}else{
					collapseItems[k].style.display = "none";
				}
			}

			collapseItems = document.getElementById("terms")
				.getElementsByClassName("itemCont");
			contentToSearch = self.terms;
			searchResult = [];
			for(var i = 0; i < contentToSearch.length; i++){
				for(var j in contentToSearch[i]){
					if(contentToSearch[i][j].toLowerCase().indexOf(searchText.toLowerCase()) != -1){
						searchResult.push(i);
						break;
					}
				}
			}
			if(searchResult.length == 0){
				document.getElementById("termsTitle").style.display = "none";
			}else{
				document.getElementById("termsTitle").style.display = "block";
			}
			for(var k=0; k < collapseItems.length; k++){
				if(searchResult.indexOf(k) != -1){
					collapseItems[k].style.display = "block";
				}else{
					collapseItems[k].style.display = "none";
				}
			}
		},
		dispose: function() {
			this.$el.remove();
		},

	});

	// Returns the View class
	return SplashForUpdates;

});
