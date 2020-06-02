define([

	"jquery",
	"backbone",	
	"com/models/shell/SocialSharingModel"

], function($, Backbone,SocialSharingModel) {

	var SocialSharingUtils = Backbone.Model.extend({}, {
		
		share:function(message , image, link){
			
			SocialSharingModel.share(message , image, link);
		}	
		
	});
	

	return SocialSharingUtils;

});
