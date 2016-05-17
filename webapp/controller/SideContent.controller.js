sap.ui.define([
	"de/uniorg/martian/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function(BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("de.uniorg.martian.controller.SideContent", {

		onInit: function() {
			var oList = this.byId("list");

			oList.attachEventOnce("updateFinished", function() {
				//this.updateData();
				this._fnTimeout = setInterval(this.updateData.bind(this), 5000);
			}.bind(this));
		},

		updateData: function() {
			var oModel = this.getModel(),
				sModelName = oModel.getMetadata().getName();

			if (sModelName === "sap.ui.model.json.JSONModel") {
				// workaround for OData MockServer audio bug
				oModel.setProperty("/Crew/0/Fraction", this.getRandomNumber(3000, 7000));
				oModel.setProperty("/Crew/1/Fraction", this.getRandomNumber(3000, 7000));
				oModel.setProperty("/Crew/2/Fraction", this.getRandomNumber(3000, 7000));
				oModel.setProperty("/Crew/3/Fraction", 0);
				oModel.setProperty("/Crew/4/Fraction", this.getRandomNumber(3000, 7000));
				oModel.setProperty("/Crew/5/Fraction", this.getRandomNumber(3000, 7000));
			} else {
				oModel.setProperty("/Crew('JOHANNSEN')/Fraction", this.getRandomNumber(3000, 7000));
				oModel.setProperty("/Crew('LEWIS')/Fraction", this.getRandomNumber(3000, 7000));
				oModel.setProperty("/Crew('VOGEL')/Fraction", this.getRandomNumber(3000, 7000));
				oModel.setProperty("/Crew('WATNEY')/Fraction", 0);
				oModel.setProperty("/Crew('BECK')/Fraction", this.getRandomNumber(3000, 7000));
				oModel.setProperty("/Crew('MARTINEZ')/Fraction", this.getRandomNumber(3000, 7000));
			}
		},

		getRandomNumber: function(fMin, fMax) {
			var fVal = (Math.random() * (fMax - fMin) + fMin) / 1000;
			return Number(fVal.toFixed(4));
		}

	});

});