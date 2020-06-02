define([ 
        "jquery", 
        "backbone",
        "com/views/PageView",
        "com/views/Header",
        "com/utils/Utils",
        "com/utils/UserUtils",
        "com/models/Constants",
        "com/models/shell/GroupingModel"
        ], function( $, Backbone, PageView, Header, Utils, UserUtils,Constants,GroupingModel) {
	var loadingInd = null;
	var loadingHandlerThread = null;

	// Extends PagView class
	var HomeSearchPageView = PageView.extend({
		/**
		 * The View Constructor
		 * @param el, DOM element of the page
		 */
		initialize: function(options) 
		{
			var self = this;
			options.phoneTitle = Globalize.localize("%shell.feedbackform.title%", getApplicationLanguage());
			options.hideHeader = true;
			options.hideFooter = true;
			options.headerState = Header.STATE_SIMPLE;
			PageView.prototype.initialize.call(this, options);
			this.$el.on("tap", ".ui-menu-item a", self.onSearchServiceItemTap );
			this.$el.on("tap", ".ui-input-clear", function(event) {
				event.preventDefault();
				$('input[data-type="search"]').val("");
				$("#searchList").html("");
				$('#searchList').listview().listview('refresh');
				$('input[data-type="search"]').trigger("keyup");


			});

			this.$el.on("focusin keyup", "#homeSearch-input", function(event) {
				event.preventDefault();
				self.loadServicesSearchList($("#homeSearch-input").val());
			});
			this.$el.on("tap", "#startMicrophone", function(event) {
				event.preventDefault();
				$("#homeSearch-input").val();
				self.loadServicesSearchList();
				var time;
				//var  recognition = new SpeechRecognition();
				window.plugins.speechRecognition.onresult = function(event) {
					clearTimeout(time);
					$("#startMicrophone").addClass("inactive").removeClass("active");
					if (event.results.length > 0) {
						var value = event.results[0][0].transcript;
						$("#homeSearch-input").val(value);
						self.loadServicesSearchList(value);
					}

				}
				window.plugins.speechRecognition.lang = getApplicationLanguage();
				$("#startMicrophone").addClass("active").removeClass("inactive");
				window.plugins.speechRecognition.start();
				time = setTimeout(function(){
					window.plugins.speechRecognition.stop();
				},5000);
			});
			this.$el.on("tap", "#cancelBtn", function(event) {
				event.preventDefault();
				mobile.changePage('shell/home.html');
			});

		},
		/* Navigate to load the search result which will be a service to load */
		loadServicesSearchList:function(searchText){

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
								this.createAvailableServiceList(i);
							}
						}
					}else 
					{
						if(!GroupingModel.checkIfUndefinedorNullorEmpty(GroupingModel.getServicesName(model._listOfCatSer.services_ids[Constants.APP_ID][i].service_id,model)) &&
								!GroupingModel.checkIfUndefinedorNullorEmpty(GroupingModel.getCategoryName(model._listOfCatSer.services_ids[Constants.APP_ID][i].cat_id,model))){
							if((model._listOfCatSer.services_ids[Constants.APP_ID][i].serv_url != "")
									&&(GroupingModel.checkContainMulipleWord(splitSearchArray,GroupingModel.getServicesName(model._listOfCatSer.services_ids[Constants.APP_ID][i].service_id,model)))
									||(GroupingModel.checkContainMulipleWord(splitSearchArray,GroupingModel.getCategoryName(model._listOfCatSer.services_ids[Constants.APP_ID][i].cat_id,model)))){
								this.createAvailableServiceList(i);
							}
						}						
					}

				}
//				/searchCategories.sort(sortNumber);

				for (var i=0 ; i< searchCategories.length;i++){
					var temp = "";
					category_id=searchCategories[i];
					sub_categoryList=Object.keys(_.groupBy(_.groupBy(searchFoundedServices,'cat_id')[category_id],'sub_cat_id'));
					if((!sub_categoryList.length<1)&& sub_categoryList[0]!=""){
						for (var j=0 ; j< sub_categoryList.length;j++){
							temp =this.createServicesHtml(searchFoundedServices,category_id,sub_categoryList[j]);
							html = _.union(html,[temp]);
						}
					}else 
					{
						//No Secound Level
						temp =this.createServicesHtml(searchFoundedServices,category_id);
						html = _.union(html,[temp]);
					}
				}
				$("#searchList").html(html);
				$('#searchList').listview().listview('refresh');
			}catch(e){

			}
		},

		createServicesHtml:function (searchFoundedServices,categoryId,subCategoryId){
			try 
			{
				var idos_service_codes=new Array();
				var service_header=new Array();
				var _Html='';
				if(GroupingModel.checkIfUndefinedorNullorEmpty(subCategoryId))
				{
					subCategoryId=null;
				}
				var SubServices=_.groupBy(_.groupBy(GroupingModel.getServicesList(categoryId,subCategoryId,model),'cat_id')[categoryId],"sub_cat_id")[subCategoryId];

				for (var i=0 ; i< model._listOfCatSer.services_ids[Constants.APP_ID].length;i++){
					var header='';
					if(this.SearchKeyArrayValue(searchFoundedServices,"idos",model._listOfCatSer.services_ids[Constants.APP_ID][i].service_id)){
						if(subCategoryId==null)
						{
							header= GroupingModel.getCategoryName(categoryId,model);
						}
						else {
							header=GroupingModel.getSubCategoryName(categoryId,subCategoryId,model);

						}
						if(service_header.indexOf(header)== -1 )
							_Html+= '<li class="ui-autocomplete-category">'+header+'</li>';

						if(idos_service_codes.indexOf(model._listOfCatSer.services_ids[Constants.APP_ID][i].service_id)== -1)
							_Html+= '<li class="ui-menu-item" role="presentation"><a id="'+model._listOfCatSer.services_ids[Constants.APP_ID][i].service_id+'" class="ui-corner-all" tabindex="-1">'+GroupingModel.getServicesName(model._listOfCatSer.services_ids[Constants.APP_ID][i].service_id,model)+'</a></li>';

						idos_service_codes.push(model._listOfCatSer.services_ids[Constants.APP_ID][i].service_id);
						service_header.push(header);
					}
				}
				return _Html;
			}catch(e){
				return '';
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
			if(!this.SearchKeyArrayValue(searchFoundedServices,"id",model._listOfCatSer.services_ids[Constants.APP_ID][i].service_id)){
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

		onSearchServiceItemTap :function(event) {
			event.preventDefault();
			var serviceId = this.id;
			$(this).css('background-color', '#ececec');
			$(this).css('-webkit-box-shadow', '0 0 12px #38c');
			$(this).css('-moz-box-shadow', '0 0 12px #38c');
			$(this).css('box-shadow', '0 0 12px #38c');
			GroupingModel.openCurrentSerivce(serviceId);

		},
	});    

	// Returns the View class
	return HomeSearchPageView;

});