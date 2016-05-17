sap.ui.define([
	"de/uniorg/martian/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"jquery.sap.global",
	"jquery.sap.storage"
], function(BaseController, JSONModel, jQuery, storage) {
	"use strict";

	return BaseController.extend("de.uniorg.martian.controller.Viewport", {
	    
		onInit: function() {
			// Control state model
			var oViewModel = new JSONModel({
				animateStars: true,
				playAudio: false,
				showSideContent: false,
				orientation: {
					alpha: 0,
					beta: 0,
					gamma: 0
				}
			});
			this.setModel(oViewModel, "shell");

			// local web storage
			this.oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);

			var bAnimateStars = this.oStorage.get("animateStars");
			this._setAnimateStars((bAnimateStars === null) ? true : bAnimateStars);

			// force button to enable audio for iOS to hacj touchBeforeAudio bug (and to not annoy user ;-)
			this._setAudioState(false);

			// handle orientation change
			//window.addEventListener("deviceorientation", this.onOrientationChange.bind(this), false);

			//var oEventBus = sap.ui.getCore().getEventBus();
			var oEventBus = this.getEventBus();
			oEventBus.subscribe("Shell", "navTo", this.onNavToEvent, this);
		},

		onAfterRendering: function() {
			// hide SplashScreen and cleanup...
			jQuery("#root").css("visibility", "visible");
			jQuery("#uoUiSplashScreen").animate({
				opacity: 0
			}, 2000, function() {
				// onAnimationComplete...
				jQuery("#uoUiSplashScreen").remove();
			});

			// attach routing direction/slide handling to control starfield animation 
			var oNavContainer = this.getComponent().getRootContainer(),
				oStarfield = this.getView().byId("starfield");

			oNavContainer.attachNavigate({}, function(oEvent) {
				var bIsRight = oEvent.getParameter("isTo");
				oStarfield.setDirection((bIsRight) ? "RIGHT" : "LEFT");
			}, this);
			oNavContainer.attachAfterNavigate({}, function() {
				oStarfield.setDirection("CENTER");
			}, this);
		},

		/*
		onOrientationChange : function(event) {
		    var oModel = this.getModel("shell");
		    oModel.setProperty("/orientation/alpha", event.alpha);
		    oModel.setProperty("/orientation/beta", event.beta);
		    oModel.setProperty("/orientation/gamma", event.gamma);
		},
		*/

		onPlayAudioToggle: function(oEvent) {
			this._setAudioState(!oEvent.getSource().getPressed());
		},

		onAnimateStarsToggle: function(oEvent) {
			this._setAnimateStars(oEvent.getSource().getPressed());
		},

		onToggleSideContent: function(oEvent) {
			var oTB = oEvent.getSource(),
				bPressed = oTB.getPressed();

			this.getModel("shell").setProperty("/showSideContent", bPressed);
		},

		_setAudioState: function(bPlayAudio) {
			var oTB = this.getView().byId("muteBtn");

			oTB.setIcon((bPlayAudio) ? "mimes/svg/speaker.svg" : "mimes/svg/mute.svg");
			oTB.setPressed(!bPlayAudio);

			this.getModel("shell").setProperty("/playAudio", bPlayAudio);
			// remember audio mute state inside local web storage
			this.oStorage.put("playAudio", bPlayAudio);
		},

		_setAnimateStars: function(bAnimateStars) {
			var oTB = this.getView().byId("animateStarsBtn");

			oTB.setIcon((bAnimateStars) ? "sap-icon://favorite" : "sap-icon://unfavorite");
			oTB.setPressed(bAnimateStars);

			this.getModel("shell").setProperty("/animateStars", bAnimateStars);
			// remember audio mute state inside local web storage
			this.oStorage.put("animateStars", bAnimateStars);
		}

	});

});