define([

"jquery", "backbone", "com/models/shell/AuthenticationModel"

], function($, Backbone, AuthenticationModel) {

	var AuthenticationUtils = Backbone.Model.extend({}, {
	
		authenticate : function(callback) {
			AuthenticationModel.requestAuthentication(callback);
		},

		deAuthenticate : function(redirectPage, callback) {
			AuthenticationModel.deAuthenticate(redirectPage, callback);
		},
		
		getActiveUserId : function() {
			return AuthenticationModel.getActiveUserId();
		},

		isAuthenticated : function() {
			return AuthenticationModel.isAuthenticated();
		},
		
		isAuthenticatedWithServer : function() {
			return AuthenticationModel.isAuthenticatedWithServer();
		}
	});

	return AuthenticationUtils;

});
