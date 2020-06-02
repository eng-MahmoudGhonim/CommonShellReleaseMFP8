
define(["jquery", "backbone"], function($, Backbone) {

	var DVSidePanelModel = Backbone.Model.extend({}, {
		openMyTransaction: function (event) {
			var commingSoonPopup = new Popup("commingSoonPopup");
			commingSoonPopup.show();
		},
		openMyPlaces: function (event) {
			var commingSoonPopup = new Popup("commingSoonPopup");
			commingSoonPopup.show();
		},
	});
	return DVSidePanelModel;
});
