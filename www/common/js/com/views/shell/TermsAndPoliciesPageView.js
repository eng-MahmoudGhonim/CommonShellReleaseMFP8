
define([

        "jquery",
        "backbone",
        "com/views/PageView",
        "com/views/Header",
        'com/models/shell/TermsConditionsModel'

        ], function( $, Backbone, PageView, Header, TermsConditionsModel ) {

	// Extends PagView class
	var TermsAndPoliciesPageView = PageView.extend({
		events: {
			'pageshow': 'onPageShow',
			'tap .ui-input-clear':'onCloseTap'
		},
		/**
		 * The View Constructor
		 * @param el, DOM element of the page
		 */
		initialize: function(options)
		{
			self = this;
			options.phoneTitle = Globalize.localize("%shell.terms.title%", getApplicationLanguage());

			if(options.data&&options.data.isOpenedFromSplash=="true" ){
				options.hideFooter = true;
				options.headerState = Header.STATE_TITLE_BACK;
				setTimeout(function (){$(".ui-page-active").css("bottom","0px");});
			}else {
				options.headerState = Header.STATE_MENU;
			}

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
			self.data = data;
			self.bindData();
		},
		bindData:function(container,data){
			var titleHead = document.querySelector("#Template .collapseHead").cloneNode(true);
			titleHead.id = container;
			var titleBody = document.querySelector("#Template .collapseBody").cloneNode(true);
			titleBody.id = "body-"+container;
			if(container == "policies"){
				if(getApplicationLanguage() == "en"){
					titleHead.querySelector('.title').textContent = "Security and Privacy policies";
				}else{
					titleHead.querySelector('.title').textContent = "سياسة الأمن والخصوصية";
				}
			}else{
				if(getApplicationLanguage() == "en"){
					titleHead.querySelector('.title').textContent = "Terms & Conditions";
				}else{
					titleHead.querySelector('.title').textContent = "الشروط والأحكام";
				}
			}
			document.querySelector('#TermsAndPoliciesPage #termsCont').appendChild(titleHead);
			document.querySelector('#TermsAndPoliciesPage #termsCont').appendChild(titleBody);
			for(var i=0;i<data.length;i++){

				var head = document.querySelector("#Template .collapseHead").cloneNode(true);
				var body = document.querySelector("#Template .collapseBody").cloneNode(true);

				head.querySelector('.title').textContent = data[i].mainHead;
				body.querySelector('.item').innerHTML = data[i].mainContent;
				if(data[i].subContent)
					body.querySelector('.item').innerHTML += data[i].subContent;


				document.querySelector('#TermsAndPoliciesPage #termsCont').appendChild(head);
				document.querySelector('#TermsAndPoliciesPage #termsCont').appendChild(body);
			}

			setTimeout(function(){
				self.collapsible = new Collapsible(document.querySelector(".collapseCont"));
			});
		},
		onPageShow: function() {
//			document.getElementById("TermsAndPoliciesPage").setAttribute("data-role","content");
//			TermsConditionsModel.getTermsAndConditionsContent(self.getTermsConditionsData);
			if(getApplicationLanguage() == "en"){
				document.getElementById("lastUpdate").innerText = "Last updated on Sep 29, 2019";

			}else{
				document.getElementById("lastUpdate").innerText = "أخر تحديث سبتمبر 29, 2019";
			}
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
			var timer = null;
			document.querySelector("#searchInput").onkeyup  =function(e)
			{

				/*if(e)
				e.preventDefault();*/

				clearTimeout(timer);

				timer=setTimeout(function () {
					self.onSearch(e);
				},500);


			}
		},
		onSearch:function(e){
			//e.preventDefault();
			var searchText = document.getElementById("searchInput").value;
			if(searchText)
			{
				searchText=searchText.trim();
			}
			var heads = [].slice.call(document.querySelectorAll("#termsCont .collapseHead"), 0);
			var allHeads=heads;
			heads.splice(0, 1);
			heads.splice(self.policies.length, 1);
			var bodies = [].slice.call(document.querySelectorAll("#termsCont .collapseBody"), 0);
			var allBodies=bodies;
			bodies.splice(0, 1);
			bodies.splice(self.policies.length, 1);
			var contentToPolicies = self.policies;

			var searchPolicyResult = [];
			for(var i = 0; i < contentToPolicies.length; i++){
				for(var j in contentToPolicies[i]){
					if(contentToPolicies[i][j].toLowerCase().indexOf(searchText.toLowerCase()) != -1){
						searchPolicyResult.push(contentToPolicies[i]);
						break;
					}
				}
			}
			var contentTerms=self.terms;
			var searchTermsResult = [];
			for(var i = 0; i < contentTerms.length; i++){
				for(var j in contentTerms[i]){
					if(contentTerms[i][j].toLowerCase().indexOf(searchText.toLowerCase()) != -1){
						searchTermsResult.push(contentTerms[i]);
						break;
					}
				}
			}

			if(searchPolicyResult ||searchTermsResult)
			{
				document.getElementById("termsCont").innerHTML=""
				if(searchPolicyResult.length>0)
				  self.bindData("policies",searchPolicyResult);
				  if(searchTermsResult.length>0)
				self.bindData("terms",searchTermsResult);

			}


			 else
			{
				document.getElementById("termsCont").innerHTML="";
				self.bindData("terms",self.terms);
				self.bindData("policies",self.policies);

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
	return TermsAndPoliciesPageView;

});
