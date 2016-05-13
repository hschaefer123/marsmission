sap.ui.define([
	"de/uniorg/martian/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function(BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("de.uniorg.martian.controller.Signature", {

		onInit: function() {
			var sBlankImageUri = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";

			// Control state model
			var oViewModel = new JSONModel({
				image: sBlankImageUri,
				mime: ''
			});
			this.setModel(oViewModel, "ui");
		},

		onReset: function(oEvent) {
			var oSig = this.getView().byId("signature");

			oSig.reset();
			this.getModel("ui").setProperty("/mime", "");
		},

		onExportImage: function(oEvent) {
			var oSig = this.getView().byId("signature");

			var oImage = oSig.exportImage(),
				oModel = this.getModel("ui");
			oModel.setProperty("/image", "data:" + oImage[0] + "," + oImage[1]);
			oModel.setProperty("/mime", "PNG");
		},

		onExportSvg: function(oEvent) {
			var oSig = this.getView().byId("signature");

			var oImage = oSig.exportSvg(),
				oModel = this.getModel("ui");
			oModel.setProperty("/image", "data:" + oImage[0] + "," + oImage[1]);
			oModel.setProperty("/mime", "SVG");
		}

	});

});