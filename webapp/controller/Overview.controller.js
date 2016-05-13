sap.ui.define([
	"de/uniorg/martian/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function(BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("de.uniorg.martian.controller.Overview", {

		onInit: function() {
			// Control state model
			var oViewModel = new JSONModel();
			this.setModel(oViewModel, "ui");

			this.updateData();
			this._fnTimeout = setInterval(this.updateData.bind(this), 5000);
		},

		updateData: function() {
			var oUiModel = this.getModel("ui");

			oUiModel.setProperty("/C3ChartData", [
				["IN", this.getRandomNumber(20, 40), this.getRandomNumber(20, 40), this.getRandomNumber(20, 40), this.getRandomNumber(20, 40),
					this.getRandomNumber(20, 40)
				],
				["OUT", this.getRandomNumber(0, 15), this.getRandomNumber(0, 15), this.getRandomNumber(0, 15), this.getRandomNumber(0, 15), this
					.getRandomNumber(0, 15)
				]
			]);

			oUiModel.setProperty("/Temperature", this.getRandomNumber(20, 40));
		},

		getRandomNumber: function(fMin, fMax) {
			return Math.random() * (fMax - fMin) + fMin;
		},

		onAfterRendering: function() {
			this._AudioWaveform = this.getView().byId("audiowaveform");
		},

		onPlay: function() {
			this._AudioWaveform.play();
		},

		onPause: function() {
			this._AudioWaveform.pause();
		},

		onSkipBackward: function() {
			this._AudioWaveform.skipBackward();
		},

		onSkipForward: function() {
			this._AudioWaveform.skipForward();
		},

		onChangeRate: function(oEvent) {
			//var oItem = oEvent.getParameter("selectedItem");
			var oValue = oEvent.getParameter("value");

			//this._ws.setPlaybackRate(oItem.getKey());
			this._AudioWaveform.setPlaybackRate(oValue);
		}

	});

});