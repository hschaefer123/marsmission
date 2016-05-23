sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"de/uniorg/martian/model/models"
], function(UIComponent, Device, models) {
	"use strict";

	return UIComponent.extend("de.uniorg.martian.Component", {
	    
		metadata: {
			manifest: "json",
			properties: {
                useAnalytics: { type : "boolean", defaultValue : false }
            }
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function() {
            /**************************************************************
            * Google Analytics
            **************************************************************/
            var oUi5Manifest = this.getManifestEntry("sap.ui5");
            if (oUi5Manifest.analytics && oUi5Manifest.analytics.hostname === window.location.hostname) {
                this._initAnalytics(oUi5Manifest.analytics);
                this.setProperty("useAnalytics", true);
            }

			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
			
			// create the views based on the url/hash
			this.getRouter().initialize();
		},
		
		/**
		 * @return {sap.ui.core.Control} the routing root control
		 * use after init (ex. onAfterRendering)
		 * @public
		 */
		getRootContainer: function() {
			var sControlId = this.getMetadata().getRoutingConfig().controlId;
			return this.getAggregation("rootControl").byId(sControlId);
		},
		
        /**
         * initialize Analytics services.
         *
         * @return {void}
         * @private
         */
        _initAnalytics: function(oConfig) {
            if (oConfig.service === "googleAnalytics") {
                var dScript = document.createElement("script");
                dScript.async = true;
                dScript.src   = "//www.google-analytics.com/analytics.js";
                
                window.ga = window.ga || function() {
                    ( ga.q = ga.q || [] ).push(arguments);
                };
                ga.l = +new Date();
                ga("create", oConfig.trackingId, "auto");
                
                document.head.appendChild(dScript);
            }
        }
        
	});

});