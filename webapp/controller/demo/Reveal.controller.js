sap.ui.define([
	"de/uniorg/martian/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function(BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("de.uniorg.martian.controller.demo.Reveal", {
	    
		onInit: function() {
		    // attach navigation controller
		    this.getRouter().getRoute("reveal").attachPatternMatched(this.onRoutePatternMatched, this);
		},

        onRoutePatternMatched: function() {
            var oReveal = this.getView().byId("reveal");
			if (oReveal) {
			    oReveal.first();
			}
        },

		onHome: function(oEvent) {
			var oReveal = this.getView().byId("reveal");
			oReveal.first();
		}

	});

});