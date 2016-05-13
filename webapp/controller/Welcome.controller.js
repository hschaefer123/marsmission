sap.ui.define([
	"de/uniorg/martian/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function(BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("de.uniorg.martian.controller.Welcome", {
	    
        onInit : function() {
			// Control state model
			var oViewModel = new JSONModel();
			this.setModel(oViewModel, "ui");     
        },
        
        onWarp : function() {
            hyperspace = 1;
        }

	});

});