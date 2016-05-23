/*global history */
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History"
], function(Controller, History) {
	"use strict";

	return Controller.extend("de.uniorg.martian.controller.BaseController", {

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
		onNavTo: function(oEvent) {
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
		
        onOpenFragmentPopup : function(oEvent) {
            var oSource = oEvent.getSource(),
                oDomRef = oEvent.getParameter("domRef"),
                sName = oSource.data("fragmentName"),
                oFragment = this.getXmlFragment(sName);
                //oFragment = this.getXmlFragment("F" + new Date().toISOString().replace(/[-:T]/g,'').substr(0,14), sName); // test random fragmentId
                
            // delay because addDependent (inside getFragement) will do a async rerendering and the popover will immediately close without it
			jQuery.sap.delayedCall(0, this, function() {
                if (oFragment.openBy) {
                    // popover
                    oFragment.openBy((oDomRef) ? oDomRef : oSource);
                } else {
                    // dialog
                    oFragment.open();
                }
			});
        },
        
        /* helper to clone property values.
        * @public
        * @param {object} oData  the object to clone
        * @returns {object} the cloned object without references
        */          
        clone: function(oData, aDelete) {
            var oClone = jQuery.extend(true, {}, oData),
                sRemoveProp = "__metadata";
            
            if (!aDelete) {
                aDelete = [ sRemoveProp ];
            } else {
                aDelete.push(sRemoveProp);
            }
            for (var i = 0; i < aDelete.length; i++) {
                delete oClone[aDelete[i]];
            }
            return oClone;
            //return JSON.parse(JSON.stringify(oData));
        },
        
        sendAnalytics: function(oData) {
            if (ga) {
                // set current page
                ga("set", oData);
                // send update to google
                ga("send", "pageview");
            }
        },
        
		/**
		 * Convenience method for accessing the router in every controller of the application.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		getRouter: function() {
			return this.getOwnerComponent().getRouter();
		},

		getComponent: function() {
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
		 * Convenience method for getting the resource bundle text.
		 * @public
		 * @param {string} sKey  the property to read
		 * @param {string[]} aArgs? List of parameters which should replace the place holders "{n}" (n is the index) in the found locale-specific string value.
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		getText: function(sKey, aArgs) {
			return this.getResourceBundle().getText(sKey, aArgs);
		},

		/**
		 * @param {function} Constructor for the element
		 * @returns object|null
		 */
		findParentControl: function(oClass) {
			var node = this.getView().getParent();

			while (node !== null && !(node instanceof oClass)) {
				node = node.getParent();
			}

			return node;
		},
        
		/**
		 * Convenience method for accessing the event bus in every controller of the application.
		 * @param {boolean} bGlobal if true return core global EventBus else component EventBus
		 * @public
		 * @returns {sap.ui.core.EventBus} the event bus for this component
		 */
		getEventBus: function(bGlobal) {
			if (bGlobal) {
				// global event bus
				return sap.ui.getCore().getEventBus();
			} else {
				// component event bus
				var sComponentId = sap.ui.core.Component.getOwnerIdFor(this.getView());
				return sap.ui.component(sComponentId).getEventBus();
				//return this.getOwnerComponent().getEventBus();
			}
		},
		
        /* Convenience method for setting view context property
        * do not know why oContext has get but not set fn ?!?
        * @public
        * @param {string} sPath  path of the property to set
        * @param {object} oValue value to set the property to
        * @returns {boolean} true if the value was set correctly and false if errors occurred like the entry was not found or another entry was already updated.
        */ 
        setViewContextProperty: function(sPath, oValue) {
            var oContext = this.getView().getBindingContext();
            return oContext.getModel().setProperty(sPath, oValue, oContext);
        },
		
		/**
		 * Convenience method for loading and caching view fragments in every controller of the application.
		 * @param {string} [sId] id of the newly created Fragment
		 * @param {string | object} vFragment name of the Fragment (or Fragment configuration as described above, in this case no sId may be given. 
		 *                          Instead give the id inside the config object, if desired)
		 * @param {sap.ui.core.mvc.Controller} [oController] a Controller to be used for event handlers in the Fragment
		 * @public
		 * @static
		 * @return {sap.ui.core.Control|sap.ui.core.Control[]} the root Control(s) of the created Fragment instance
		 */
        getXmlFragment : function(sId, vFragment, oController) {
            var bWithId = (typeof (sId) === "string" && typeof (vFragment) === "string"),
                sName = (bWithId) ? vFragment : sId,
                sPrefix = sName.substr(0,1),
                oView = this.getView(),
                sViewId = oView.getId();
                
            // relative fragment name handling
            if (sPrefix === ".") {
                // resolve view relative path
                var sViewName = oView.getViewName(),
                    iLastDotPos = sViewName.lastIndexOf("."),
                    sPackage = sViewName.substr(0, iLastDotPos);
                sName = sPackage + sName;
            } else if (sPrefix === "/") {
                // resolve component relative path
                var sComponentName = this.getComponent().getMetadata().getComponentName();
                sName = sComponentName + ".view" + sName;
            }
            
            // lazy load fragment
            var sFragmentId = (bWithId) ? sId : sViewId,
                sCacheId = sFragmentId + "--" + sName,
                oCmp = this.getComponent();
                
            // make sure cache is existent
            if (!oCmp._mFragments) { oCmp._mFragments = {}; }
            
            // instantiate fragment if not in cache
            if (!oCmp._mFragments[sCacheId]) {
                if (oController && typeof oController === "string") {
                    oController = this;
                } else {
                    oController = this;
                }
                
                // attach owner component reference to controller
                if (!oController.component) { 
                    oController.component = sap.ui.core.Component.getOwnerComponentFor(oView);
                }
                    
                // instantiate and cache fragment
                oController.component.runAsOwner(function() {
                    oCmp._mFragments[sCacheId] = sap.ui.xmlfragment(sFragmentId, sName, oController);
                });
                
                // add fragment dependency to calling view
                oView.addDependent(oCmp._mFragments[sCacheId]);
                
                // toggle compact style
                jQuery.sap.syncStyleClass(
                    "sapUiSizeCompact", oView, oCmp._mFragments[sCacheId]
                );
            }
            
            // return cached fragment
            return oCmp._mFragments[sCacheId];
            
        }, // eof getXmlFragment   		
        
        applyTip : function(oTip) {
			var aTips = (Array.isArray(oTip)) ? oTip : [ oTip ],
				iLen = aTips.length,
				mAction = null;
				
			for (var i = 0; i < iLen; i++) {
				mAction = aTips[i];
				if (mAction && mAction.id) {
					var oView = (mAction.route) ? this.getView().byId("rootControl").getCurrentPage() : this.getView(),
						oId = oView.byId(mAction.id);
						
					if (oId) {
						if (!mAction.popoverPlacement) { mAction.popoverPlacement = "Bottom"; }
						if (mAction.popoverContent) {
							var mPopoverCfg = {
								title: mAction.popoverTitle,
								placement: mAction.popoverPlacement,
								contentWidth: mAction.contentWidth,
								horizontalScrolling: false,
								verticalScrolling: false
							};
							if (typeof mAction.popoverContent === "object") {
								mPopoverCfg.content = sap.ui.jsonview({
								    viewContent : {
								        Type: "sap.ui.core.mvc.JSONView",
								        content: mAction.popoverContent
								    }
								});
							} else {
								mPopoverCfg.content = new sap.m.Text({ text: mAction.popoverContent });
							}
							var oPopover = new sap.m.Popover(mPopoverCfg);
							if (!mAction.popoverTitle) { oPopover.setShowHeader(false); }
							oPopover.addStyleClass("sapUiContentPadding");	
							oPopover.openBy(oId);
						}
						if (mAction.focus === true && oId.focus) { oId.focus(); }
						if (mAction.open === true && oId.open) { oId.open(); }
						if (mAction.press === true && oId.firePress) { oId.firePress(); }
					}
				}
			}          
        }
        
	});

});