
define(["jquery", "backbone"], function($, Backbone) {

	var CorporateSidePanelModel = Backbone.Model.extend({}, {
		openMyTransaction: function () {
			var commingSoonPopup = new Popup("commingSoonPopup");
			commingSoonPopup.show();
		},
		openMyPlaces: function () {
			var commingSoonPopup = new Popup("commingSoonPopup");
			commingSoonPopup.show();
		},
	});
	return CorporateSidePanelModel;
});
