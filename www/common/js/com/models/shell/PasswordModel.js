define([

"jquery", "backbone", "com/utils/DataUtils", "com/utils/Utils", "com/models/shell/UserProfileModel"

], function($, Backbone, DataUtils, Utils, UserProfileModel) {

	var PasswordModel = Backbone.Model.extend({}, {
		SUCCESS : "SUCCESS",
		FAILED : "FAILED",
		NOTEXIST:"NOTEXIST",

		hash:function(text){
			var shaObj = new jsSHA("SHA-1", "TEXT");
			shaObj.update(text);
			var hash = shaObj.getHash("HEX");
			return hash;
		},
		encPassword:function (userId,password){

			var key=this.hash(userId);
//		 	console.log("Hashed key   :   " + key.toString());

			key = key.substring(0, 16);
//		 	console.log("key length  :   " + key.toString().length);

			var encoded_key = CryptoJS.enc.Utf8.parse(key);
			var iv = CryptoJS.enc.Utf8.parse(key);
			var cipher = CryptoJS.AES.encrypt(password,encoded_key,{
										iv: iv,
										mode: CryptoJS.mode.CBC,
										padding: CryptoJS.pad.Pkcs7
										});
			cipherText = cipher.ciphertext.toString(CryptoJS.enc.Base64);
//			console.log("cipherText  :   " + cipherText);
			return cipherText;
		},
		forgetPassword : function(emailAddress, callback) {
			var self = this;

			var invocationData = {
					adapter : "portalAdapter",
					procedure : "forgetPassword",
					parameters : [ emailAddress]
			};

			invokeWLResourceRequest(invocationData,
				function(result) {
					if(result.invocationResult&&result.invocationResult.responseID&&!result.invocationResult.failure)
					{
						callback(self.SUCCESS);
					}
					else
					{
						callback(self.NOTEXIST);
					}
				},

				function(result) {
					callback(self.FAILED);
				}

			);

		}
	});

	return PasswordModel;

});
