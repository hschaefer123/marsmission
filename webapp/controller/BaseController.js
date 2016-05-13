/*global history */
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History"
], function(Controller, History) {
	"use strict";

	return Controller.extend("de.uniorg.martian.controller.BaseController", {
		/**
		 * Convenience method for accessing the router in every controller of the application.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		getRouter: function() {
			return this.getOwnerComponent().getRouter();
		},
		
        getComponent : function() {
            return sap.ui.core.Component.getOwnerComponentFor(
                this.getView()
            );
        },
        
		/**
		 * Convenience method for getting the view model by name in every controller of the application.
		 * @public
		 * @param {string} sName the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getModel: function(sName) {
			return this.getView().getModel(sName);
		},

		/**
		 * Convenience method for setting the view model in every controller of the application.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
		setModel: function(oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		/**
		 * Convenience method for getting the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
		 */
		getResourceBundle: function() {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

		/**
		 * Event handler  for navigating back.
		 * It checks if there is a history entry. If yes, history.go(-1) will happen.
		 * If not, it will replace the current entry of the browser history with the master route.
		 * @public
		 */
		onNavBack: function() {
			var sPreviousHash = History.getInstance().getPreviousHash();

			if (sPreviousHash !== undefined) {
				// The history contains a previous entry
				history.go(-1);
			} else {
				// Otherwise we go backwards with a forward history
				var bReplace = true;
				this.getRouter().navTo("master", {}, bReplace);
			}
		},
		
		/**
		 * Event handler for navigating to defined route.
		 * You have to define a custom data route name property
		 * e.g. XMLView -> data:routeName="routeName"
		 * e.g. JSView  -> customData : [{ key : "routeName", value : "routeName" }]
		 * 
		 * @param {sap.ui.base.Event} oEvent - the navigate to event.
		 * @returns {undefined} undefined
		 * @public
		 */
        onNavTo : function(oEvent) {
            var oItem = oEvent.getParameter("listItem") || oEvent.getSource(),
                sRouteName = oItem.data("routeName") || oItem.data("route"),
                oRouteConfig = oItem.data("routeConfig") || {},
                oConfig = oItem.data("config") || {},
                sTitle = oItem.data("title"),
                sUrl = oItem.data("url") || undefined;
                
            // title detection
            if (!sTitle) {
                if (typeof oItem.getTitle === "function") {
                    sTitle = oItem.getTitle();
                } else if (typeof oItem.getHeader === "function") {
                    sTitle = oItem.getHeader();
                }
            }
                
            // special iframe handling
            if (sUrl) {
                var sTarget = (sRouteName) ? "onpremise" : "window";
                oConfig.page = "/" + sTarget + "/" + sUrl;
                oRouteConfig.src = encodeURIComponent(sUrl);
                oRouteConfig.title = encodeURIComponent(sTitle);
            }
                
            // route handling
            if (sRouteName) {
                // nav to with history 
                this.getRouter().navTo(sRouteName, oRouteConfig, false);
            }
            
        },
		
		/**
		 * Convenience method for accessing the event bus in every controller of the application.
		 * @param {boolean} bGlobal if true return core global EventBus else component EventBus
		 * @public
		 * @returns {sap.ui.core.EventBus} the event bus for this component
		 */
        getEventBus : function(bGlobal) {
            if (bGlobal) {
                // global event bus
                return sap.ui.getCore().getEventBus();
            } else {
                // component event bus
                var sComponentId = sap.ui.core.Component.getOwnerIdFor(this.getView());
                return sap.ui.component(sComponentId).getEventBus();    
                //return this.getOwnerComponent().getEventBus();
            }
        }		

	});

});