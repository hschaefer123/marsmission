sap.ui.define([
	"de/uniorg/martian/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"jquery.sap.storage",
	"sap/m/MessageBox"
], function(BaseController, JSONModel, storage, MessageBox) {
	"use strict";

	return BaseController.extend("de.uniorg.martian.controller.MeArea", {
	    
		onInit: function() {
			// local web storage
			this.oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
		},	    
		
		onAfterRendering: function() {
			var bAnimateStars = this.oStorage.get("animateStars");
			this._setAnimateStars((bAnimateStars === null) ? true : bAnimateStars);
		},
		
		onLanguageChange: function(oEvent) {
			var sLanguage = oEvent.getParameter("selectedItem").getKey();
			
			sap.ui.getCore().getConfiguration().setLanguage(sLanguage);
			// WORKAROUND
			this.getModel().oHeaders["Accept-Language"] = sap.ui.getCore().getConfiguration().getLanguage();
			this.getModel().refresh();
		},

		onLogoff: function() {
			MessageBox.confirm("Are you sure to logoff?", {
				title: "Confirmation",
				onClose: function(oAction) {
					if (oAction === MessageBox.Action.OK) {
						//this.getEventBus().publish("menu", "close");
						//this.getComponent().logout();
					}
				}.bind(this)
			});
		},
		
		onAnimateStarsChange: function(oEvent) {
		    this._setAnimateStars(oEvent.getParameter("state"));
		},
		
		onPlayAudioChange: function(oEvent) {
			this._setAudioState(oEvent.getParameter("state"));
		},		
		
		_setAnimateStars: function(bAnimateStars) {
            // store value in global app model
            this.getModel("app").setProperty("/animateStars", bAnimateStars);
			// remember star animation state inside local web storage
			this.oStorage.put("animateStars", bAnimateStars);
		},
		
		_setAudioState: function(bPlayAudio) {
		    this.getModel("app").setProperty("/playAudio", bPlayAudio);
		}		
		
	});

});