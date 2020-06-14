
/* JavaScript content from js/com/models/shell/GreenPointsModel.js in folder common */
define([

"jquery", "backbone", "com/utils/DataUtils",  "com/models/shell/UserProfileModel"], function($, Backbone, DataUtils, UserProfileModel) {

	var GreenPointsModel = Backbone.Model.extend({

		/**
		 * set model defaults
		 */
		defaults : {
			userid : '',
			username : '',
			cardid : '',
			score : '',
			rank : '',
			comparison : '',
			timePT : '',
			co2PT : '',
			moneyPT : '',
			happinessPT : '',
			envImpactPT : '',
			timeDT : '',
			co2DT : '',
			moneyDT : '',
			happinessDT : '',
			envImpactDT : ''
		}},{

			/**
			 * initialize model
			 */
			initialize : function() {
			},

			/**
			 * get green points score
			 */
			getGreenPointsRanking: function(score, callback) {
				try {
					var invocationData = {
							adapter : 'GreenPointsDbAdapter',
							procedure : 'getGreenPointsRanking',
							parameters : [ score ]
					};

					invokeWLResourceRequest(invocationData,
						function(result) {
							if (result && result.invocationResult) {
								callback(result.invocationResult.resultSet);
							} else {
								callback(null);
							}
						},
						function(result) {
							callback(null, true);
						}
					);
				} catch (e) {
					callback(null, true);
				}
			},
			getGreenPoints : function(callback) {

				try {
					var self = this;
					var user_id = UserProfileModel.getUserProfile().Users[0].user_id;

					var invocationData = {
							adapter : 'GreenPointsDbAdapter',
							procedure : 'getGreenPoints',
							parameters : [ user_id ]
					};

					invokeWLResourceRequest(invocationData,
						function(result) {
							if (result && result.invocationResult) {
								callback(result.invocationResult.resultSet[0]);
							} else {
								callback(null);
							}
						},
						function(result) {
							callback(null, true);
						}
					);
				} catch (e) {
					callback(null, true);
				}
			}
		});

	return GreenPointsModel;

});
