define([ "jquery", "backbone", "com/models/shell/UserProfileModel" ], function($, Backbone, UserProfileModel) {

	var UserUtils = Backbone.Model.extend({}, {

		/**
		 * This function will return the user profile of the current application user
		 */
		getUserProfile : function() {
			return UserProfileModel.getUserProfile();
		},
		
		getUserProfileFromServer : function(callback) {
			UserProfileModel.getUserProfileFromServer(callback);
		},

		isUserProfileCached : function() {
			return UserProfileModel.isUserProfileCached();
		}
	});

	return UserUtils;
});
