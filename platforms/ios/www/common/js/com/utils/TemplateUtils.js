define([

        "jquery", 
        "backbone",
        "handlebars",
        "com/models/Constants",
        "com/utils/Utils",

        ], function($, Backbone, Handlebars, Constants,Utils) {

	var TemplateUtils = Backbone.Model.extend({},

			{

		/**
		 * process a handlebar template
		 * @param template, name string to the template without the extension
		 * @param params, object to process the handlebar template
		 * @param onTemplateHandler, function to receive the post processed html of the template
		 * @param templateIsFullPath, boolean, [optional] specifies if the template param specifies the full path to the template
		 * @param async, boolean [optional], default is true
		 */
		getTemplate: function(template, params, onTemplateHandler, templateIsFullPath, async)
		{
			$.ajax({
				type: "GET",
				url: templateIsFullPath ? template : MobileRouter.baseUrl + '/' + Constants.FOLDER_TEMPLATES + template + Constants.EXTENSION_TEMPLATES,
						async: typeof async =="undefined" ? true : async,
								cache: true,
								dataType: "text",
								success: function(data){
									var template = Handlebars.compile(data);
									Handlebars.registerPartial("customContent","");
									Handlebars.registerPartial("message","");

									var html = params ? template(params) : template({});
									html = Utils.applyLocalization(html,getApplicationLanguage());
									if(onTemplateHandler){
										onTemplateHandler(html,data);
									}
								}
			});	
		},
		getStaticTemp:  function(template, onTemplateHandler, templateIsFullPath, async)
		{
			$.ajax({
				type: "GET",
				url: templateIsFullPath ? template : MobileRouter.baseUrl + '/' + Constants.FOLDER_TEMPLATES + template + Constants.EXTENSION_TEMPLATES,
						async: typeof async =="undefined" ? false : async,
								cache: true,
								dataType: "text",
								success: function(data){
									 
									data = Utils.applyLocalization(data,getApplicationLanguage());
									if(onTemplateHandler){
										onTemplateHandler(data);
									}
								}
			});	
		},
		bindPopupTemplateData : function(template,templateContainerID,data){
			if(data && data.customContent){
				Handlebars.registerPartial("customContent", data.customContent);
			}
			if(data && data.message){
				Handlebars.registerPartial("message", data.message);
			}
			var template = Handlebars.compile(template);
			var html = data ? template(data) : template({});
			html = Utils.applyLocalization(html,getApplicationLanguage());
			if(isUndefinedOrNullOrBlank($("#content").has("#"+templateContainerID)) || $("#content").has("#"+templateContainerID).length ==0){
				$("[data-role='content']").append(html);
			}
			else{
				try{
					$('[data-role="popup"]').popup( "destroy");
				}catch(e){

				}
				$("#"+templateContainerID).replaceWith(html);
			}
			$("#"+templateContainerID + " form").enhanceWithin('form');
			return html ;
			/*if(data && data.customContent){
				$(".popupCustomContent").replaceWith(data.customContent);
			}*/
		},
		bindTemplateData : function(template,templateContainerID,contianerReplace,data){
			var template = Handlebars.compile(template);
			var html = data ? template(data) : template({});
			html = Utils.applyLocalization(html,getApplicationLanguage());
			if(isUndefinedOrNullOrBlank($("#content").has("#"+templateContainerID)) || $("#content").has("#"+templateContainerID).length == 0){
				$("[data-role='content']").append(html);
			}
			else if (contianerReplace==true){
				$("#"+templateContainerID).replaceWith(html);
			}else{
				$("#"+templateContainerID).append(html);				
			}
		},
		customBindTemplateData:function(template,templateConfig,data,timeout){
			if(isUndefinedOrNullOrBlank(timeout)){
				timeout=0;
			}
			var template = Handlebars.compile(template);
			var html = data ? template(data) : template({});
			html = Utils.applyLocalization(html,getApplicationLanguage());
			if (templateConfig.replaceTemplate==true && !isUndefinedOrNullOrBlank(templateConfig.templateContainerID ) )
			{
				$("#"+templateConfig.templateContainerID).replaceWith(html);
			}
			else if (templateConfig.appendToHtmlTemplate==true 
					&& !isUndefinedOrNullOrBlank(templateConfig.templateContainerID ) ){
				$("#"+templateConfig.templateContainerID).append(html);				
			}
			/*if(isUndefinedOrNullOrBlank($("#content").has("#"+templateContainerID)) || $("#content").has("#"+templateContainerID).length == 0){
			$("[data-role='content']").append(html);
		}
		else if (contianerReplace==true){
		}else{
		}*/
			/*_.delay(function(template) {


			}, timeout,template);*/
			/*	setTimeout(function(template,templateConfig,data) {

				var template = Handlebars.compile(template);
				var html = data ? template(data) : template({});
				html = Utils.applyLocalization(html,getApplicationLanguage());
				if (templateConfig.replaceTemplate==true && !isUndefinedOrNullOrBlank(templateConfig.templateContainerID ) )
				{
					$("#"+templateConfig.templateContainerID).replaceWith(html);
				}
				else if (templateConfig.appendToHtmlTemplate==true 
						&& !isUndefinedOrNullOrBlank(templateConfig.templateContainerID ) ){
					$("#"+templateConfig.templateContainerID).append(html);				
				}
				if(isUndefinedOrNullOrBlank($("#content").has("#"+templateContainerID)) || $("#content").has("#"+templateContainerID).length == 0){
				$("[data-role='content']").append(html);
			}
			else if (contianerReplace==true){
			}else{
			}
			}, timeout);*/

		}

			});

	return TemplateUtils;

}); 