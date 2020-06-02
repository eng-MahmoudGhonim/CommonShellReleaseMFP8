define([

        "jquery",
        "backbone",
        "com/models/Constants",
        "com/utils/Utils",
        "com/utils/DataUtils",
        //"com/views/PageView",
        "com/views/ModalDialog",
        "com/models/shell/GroupingModel",
        "speechRecognition"
        ], function( $, Backbone, Constants, Utils, DataUtils,ModalDialog,GroupingModel,SpeechRecognition) {
	var HomeSearchPageView = ModalDialog.extend(
			{

				/**
				 * The View Constructor
				 * @param el, DOM element of the page
				 */
				name: "HomeSearchPageView",
				templateHtml :'<form id="searchForm"><div id="searchFieldsContainer" class="ui-grid-a">'+
				'<div class="ui-block-a search-holder">'+

				'<input id="homeSearch-input" type="search" class="controls"'+
				' placeholder="%shell.searchPage.search.placeHolder%"/>'+
				'<div id="startMicrophone" class="ui-block-b inactive"></div>'+
				'</div>'+

				'<div id="cancelButtonSearch" class="ui-block-c">'+
				'<button id="cancelBtn" data-role="button" class="ui-normal-btn">%shell.login.forget.cancel%</button>'+
				'</div>'+
				'</div>'+
				'<span class="listen">%shell.searchPage.search.listening%</span>'+
				'<ul class="ui-autocomplete ui-front ui-menu ui-widget ui-widget-content ui-corner-all" id="searchList" tabindex="0" style="position: initial;">'+
				'</ul></form>',
				initialize: function()
				{
					self = this;
					_.bindAll( this, "render");
					var templateRendered = Utils.applyLocalization(this.templateHtml);
					this.template = _.template(templateRendered);
					self.onPageShow();
//					$("#header").addClass("headrBluring");
//					$(".ui-page").addClass("bodyBluring");
//					$("#footer").addClass("footerBluring");

				},

				events:
				{
					"submit #searchForm":"onFormSubmit",
					"tap .ui-menu-item a": "onSearchServiceItemTap",
					"tap .ui-input-clear" :"onClearSearch",
					"keyup #homeSearch-input":"onSearchAction",
					"tap #cancelBtn":"closeSearch",
					"tap #startMicrophone":"speakSearch",
					"tap .ui-menu-item a":"onSearchServiceItemTap"
				},
				onSearchServiceItemTap : function(event){
					event.preventDefault();
					var serviceId = event.target.id;
					$(this).css('background-color', '#ececec');
					$(this).css('-webkit-box-shadow', '0 0 12px #38c');
					$(this).css('-moz-box-shadow', '0 0 12px #38c');
					$(this).css('box-shadow', '0 0 12px #38c');
					GroupingModel.openCurrentSerivce(serviceId);
					$("#header").removeClass("headrBluring");
					$(".ui-page").removeClass("bodyBluring");
					$("#footer").removeClass("footerBluring");
					self.hideModal();

				},
				speakSearch : function(event){
					event.preventDefault();
					if (!navigator.onLine){
						showInternetProblemPopup();
						return;
					}
					var time;
					$("#homeSearch-input").val("");
					$("#homeSearch-input").blur();
					$('input[data-type="search"]').trigger("keyup");
					//$(".search-holder a").addClass("ui-input-clear-hidden");
					$(".listen").css("display","block");
					self.loadServicesSearchList();
					//var  recognition = new SpeechRecognition();
					window.plugins.speechRecognition.onresult = function(event) {
						$("#startMicrophone").addClass("inactive").removeClass("active");
						$(".listen").css("display","none");
					        if (event.results.length > 0) {
					            var value = event.results[0][0].transcript;
					            $("#homeSearch-input").val(value);
					            if (!Utils.isiOS()){
					            	if($("#homeSearch-input").val() != ""){
					            		document.getElementById("startMicrophone").style.display = "none";
					            	}
								}
					            $(".search-holder a").removeClass("ui-input-clear-hidden");
					            self.loadServicesSearchList(value);
					     }
					     clearTimeout(time);
					}
					window.plugins.speechRecognition.onerror = function(){
						$("#startMicrophone").addClass("inactive").removeClass("active");
						$(".listen").css("display","none");
						$("#homeSearch-input").val("");
						$("#searchList").html("");
						$('#searchList').listview().listview('refresh');
						$('input[data-type="search"]').trigger("keyup");
						clearTimeout(time);
					}

					window.plugins.speechRecognition.lang = getApplicationLanguage();
					$("#startMicrophone").addClass("active").removeClass("inactive");
					window.plugins.speechRecognition.start();
					time = setTimeout(function(){
						window.plugins.speechRecognition.stop();
					},7000);
				},
				closeSearch : function(event){
					event.preventDefault();
					$("#header").removeClass("headrBluring");
					$(".ui-page").removeClass("bodyBluring");
					$("#footer").removeClass("footerBluring");
					self.hideModal();
				},
				onPageShow : function(){
					var serviceCategoriesFilePath = window.mobile.baseUrl +"/common/data/service_categories.json";
					model = MobileRouter.getModel();
					listOfCategories= model._listOfCatSer;
					$.getJSON(serviceCategoriesFilePath, function( servicesCategoires ) {
						model._listOfCatSer = servicesCategoires;
					}) .fail(function() {
						console.log( "error" );
					});
					if (Utils.isiOS()){
						setTimeout(function(){
							document.getElementById("startMicrophone").style.display = "none";
						});
					}
				},
				onClearSearch: function(event){
					event.preventDefault();
					$('input[data-type="search"]').val("");
					$("#searchList").html("");
					$('#searchList').listview().listview('refresh');
					$('input[data-type="search"]').trigger("keyup");
				},
				onSearchAction:function(event){
					event.preventDefault();
					if (!Utils.isiOS()){
						if(document.getElementById("homeSearch-input").value != ""){
							document.getElementById("startMicrophone").style.display = "none";
						}else{
							document.getElementById("startMicrophone").style.display = "block";
						}
					}
					self.loadServicesSearchList($("#homeSearch-input").val());
//					document.getElementById().onsubmit = function(e){
//						e.preventDefault();
//				 		$("#homeSearch-input").blur();
//					}
				},
				loadServicesSearchList : function(searchText){
					try {
						$("#searchList").html("");
						if (GroupingModel.checkIfUndefinedorNullorEmpty(searchText)){
							return;
						}


						searchFoundedServicesNames = new Array();
						searchSubCategories = new Array();
						searchFoundedServices = new Array() ;
						searchCategories = new Array();
						var html='';
						var splitSearchArray = searchText.split(" ");
						for(var i=0 ; i <model._listOfCatSer.services_ids[Constants.APP_ID].length ; i++){
							if(!GroupingModel.checkIfUndefinedorNullorEmpty (_.groupBy(GroupingModel.getSubCategoryList(model._listOfCatSer.services_ids[Constants.APP_ID][i].cat_id,model),"cat_id")[model._listOfCatSer.services_ids[Constants.APP_ID][i].cat_id]))
							{
								if(!GroupingModel.checkIfUndefinedorNullorEmpty(GroupingModel.getServicesName(model._listOfCatSer.services_ids[Constants.APP_ID][i].service_id,model)) &&//check if service name is not empty
										!GroupingModel.checkIfUndefinedorNullorEmpty(GroupingModel.getSubCategoryName(model._listOfCatSer.services_ids[Constants.APP_ID][i].cat_id,model._listOfCatSer.services_ids[Constants.APP_ID][i].sub_cat_id,model))&& // sub category name is not empty
										!GroupingModel.checkIfUndefinedorNullorEmpty(GroupingModel.getCategoryName(model._listOfCatSer.services_ids[Constants.APP_ID][i].cat_id,model))){//checking that category names not empty
									if(model._listOfCatSer.services_ids[Constants.APP_ID][i].serv_url !=""
											&&((GroupingModel.checkContainMulipleWord(splitSearchArray,GroupingModel.getServicesName(model._listOfCatSer.services_ids[Constants.APP_ID][i].service_id,model))
											||(GroupingModel.checkContainMulipleWord(splitSearchArray,GroupingModel.getCategoryName(model._listOfCatSer.services_ids[Constants.APP_ID][i].cat_id,model)))
											||(GroupingModel.checkContainMulipleWord(splitSearchArray,GroupingModel.getSubCategoryName(model._listOfCatSer.services_ids[Constants.APP_ID][i].cat_id,model._listOfCatSer.services_ids[Constants.APP_ID][i].sub_cat_id,model)))))){
										self.createAvailableServiceList(i);
									}
								}
							}else
							{
								if(!GroupingModel.checkIfUndefinedorNullorEmpty(GroupingModel.getServicesName(model._listOfCatSer.services_ids[Constants.APP_ID][i].service_id,model)) &&
										!GroupingModel.checkIfUndefinedorNullorEmpty(GroupingModel.getCategoryName(model._listOfCatSer.services_ids[Constants.APP_ID][i].cat_id,model))){
									if((model._listOfCatSer.services_ids[Constants.APP_ID][i].serv_url != "")
									&&(GroupingModel.checkContainMulipleWord(splitSearchArray,GroupingModel.getServicesName(model._listOfCatSer.services_ids[Constants.APP_ID][i].service_id,model)))
													||(GroupingModel.checkContainMulipleWord(splitSearchArray,GroupingModel.getCategoryName(model._listOfCatSer.services_ids[Constants.APP_ID][i].cat_id,model)))){
										self.createAvailableServiceList(i);
									}
								}
							}

						}
//						/searchCategories.sort(sortNumber);

						for (var i=0 ; i< searchCategories.length;i++){
							var temp = "";
							category_id=searchCategories[i];
							sub_categoryList=Object.keys(_.groupBy(_.groupBy(searchFoundedServices,'cat_id')[category_id],'sub_cat_id'));
							if((!sub_categoryList.length<1)&& sub_categoryList[0]!="" && sub_categoryList[0]!="null"){
								for (var j=0 ; j< sub_categoryList.length;j++){
									temp =self.createServicesHtml(searchFoundedServices,category_id,sub_categoryList[j]);
									html = _.union(html,[temp]);
								}
							}else
							{
								//No Secound Level
								temp =self.createServicesHtml(searchFoundedServices,category_id);
								html = _.union(html,[temp]);
							}
						}
						$("#searchList").html(html);
						$('#searchList').listview().listview('refresh');
					}catch(e){

					}
				},
				createAvailableServiceList:function (i){
					var serviceElement = {};
					if(model._listOfCatSer.services_sub_categories[Constants.APP_ID]!= undefined)
					{
						for(var j=0 ; j<model._listOfCatSer.services_sub_categories[Constants.APP_ID]; i++){
							searchSubCategories["name"] = servicesCategoriesList.service_sub_categories[j]["sub_cat_id"];
						}
					}

					serviceElement["id"]=model._listOfCatSer.services_ids[Constants.APP_ID][i].service_id;
					serviceElement["sub_cat_id"] = model._listOfCatSer.services_ids[Constants.APP_ID][i].sub_cat_id;
					serviceElement["name"] = GroupingModel.getServicesName(model._listOfCatSer.services_ids[Constants.APP_ID][i].service_id,model);
					serviceElement["cat_id"]=model._listOfCatSer.services_ids[Constants.APP_ID][i].cat_id;
					serviceElement["idos"]=model._listOfCatSer.services_ids[Constants.APP_ID][i].service_id;

					if(searchCategories.indexOf(serviceElement.cat_id)== -1 )
						searchCategories.push(serviceElement.cat_id);
					if(!self.SearchKeyArrayValue(searchFoundedServices,"id",model._listOfCatSer.services_ids[Constants.APP_ID][i].service_id)){
						searchFoundedServices.push(serviceElement);
						searchFoundedServicesNames.push(serviceElement.name);
					}

				},
				SearchKeyArrayValue:function  (array,key,value){
					for(var i =0 ; i<array.length ; i++){
						if(array[i][key]==value){
							return true;
						}
					}
					return false;
				},
				createServicesHtml:function (searchFoundedServices,categoryId,subCategoryId){
					try
					{
						var idos_service_codes=new Array();
						var service_header=new Array();
						var _Html='';
						var isFirst = false;
						if(GroupingModel.checkIfUndefinedorNullorEmpty(subCategoryId))
						{
							subCategoryId=null;
						}
						var SubServices=_.groupBy(_.groupBy(GroupingModel.getServicesList(categoryId,subCategoryId,model),'cat_id')[categoryId],"sub_cat_id")[subCategoryId];

						for (var i=0 ; i< model._listOfCatSer.services_ids[Constants.APP_ID].length;i++){
							var header='';
							var icon='';
							if(self.SearchKeyArrayValue(searchFoundedServices,"idos",model._listOfCatSer.services_ids[Constants.APP_ID][i].service_id)){
								if(subCategoryId==null)
								{
									header = GroupingModel.getCategoryName(categoryId,model);

								}
								else {
									header=GroupingModel.getSubCategoryName(categoryId,subCategoryId,model);
								}
								icon = GroupingModel.getCategoryIcon(categoryId,model);
								if(service_header.indexOf(header)== -1 ){
									_Html+= '<li class="ui-autocomplete-category"><img src="'+icon+'"  class="cat-icon"></img>'+header+'</li>';
									isFirst = true;
								}

								if (idos_service_codes.indexOf(model._listOfCatSer.services_ids[Constants.APP_ID][i].service_id) == -1&& model._listOfCatSer.services_ids[Constants.APP_ID][i].sub_cat_id == subCategoryId&& model._listOfCatSer.services_ids[Constants.APP_ID][i].cat_id == categoryId){
									var classAdded = "";
									if(isFirst){
										classAdded = "first-item";
										isFirst = false;
									}
									_Html+= '<li class="ui-menu-item '+classAdded+'" role="presentation"><a id="'+model._listOfCatSer.services_ids[Constants.APP_ID][i].service_id+'" class="ui-corner-all" tabindex="-1">'+GroupingModel.getServicesName(model._listOfCatSer.services_ids[Constants.APP_ID][i].service_id,model)+'</a></li>';7

								}

								idos_service_codes.push(model._listOfCatSer.services_ids[Constants.APP_ID][i].service_id);
								service_header.push(header);
							}
						}
						return _Html;
					}catch(e){
						return '';
					}
				},
				onFormSubmit:function(){
					document.getElementById("homeSearch-input").blur();
					return false;
				},
				render: function()
				{
					if($("#modalContainer").length != 0)
					$("#modalContainer").remove();
					$(this.el).html( this.template());
					return this;
				},
				dispose : function(){

					//delete ModalDialog;
				}
			});
	return HomeSearchPageView;

});
