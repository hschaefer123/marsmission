sap.ui.define([
	"de/uniorg/martian/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"jquery.sap.global",
	"sap/ui/core/routing/HashChanger"
], function(BaseController, JSONModel, jQuery, HashChanger) {
	"use strict";

	return BaseController.extend("de.uniorg.martian.controller.Viewport", {
        
        _meAreaVisible: false,
        
		onInit: function() {
			// Control state model
			var oViewModel = new JSONModel({
				showSideContent: false,
				orientation: {
					alpha: 0,
					beta: 0,
					gamma: 0
				}
			});
			this.setModel(oViewModel, "shell");
			
			// attach display router Analytics
			if (this.getComponent().getProperty("useAnalytics")) {
                this.getRouter().attachRoutePatternMatched(this._onRoutePatternMatched, this);
			}
			
			// handle orientation change
			//window.addEventListener("deviceorientation", this.onOrientationChange.bind(this), false);
		},

		onAfterRendering: function() {
		    this._removeSplashScreen();
		    this._attachStarfieldDirectionFromRouting();
		    
			// show tips if enabled
			this._showTips();
		    
            // attach shell content click event to close user menu 
            jQuery.sap.byId(this.getView().getId() + "--" + "meArea")
                .bind("click", this.onContentClick.bind(this));
		},
		
        exit : function() {
           jQuery.sap.byId(this.getView().getId() + "--" + "meArea")
                .unbind("click", this.onContentClick.bind(this));
        },		
        
        onContentClick : function(evt) {
            //var oDomTarget = evt.target;
            var xPos = evt.clientX,
                yPos = evt.clientY;
            if (this._meAreaVisible && xPos > 260) { // && oTarget !== openbtn (var oTarget = evt.target;)
                //if (evt.stopPropagation) { evt.stopPropagation(); }
                //if (evt.cancelBubble !== null) { evt.cancelBubble = true; }
                this._toggleMenu(); 
            }
        },        
		
		/*
		onOrientationChange : function(event) {
		    var oModel = this.getModel("app");
		    oModel.setProperty("/orientation/alpha", event.alpha);
		    oModel.setProperty("/orientation/beta", event.beta);
		    oModel.setProperty("/orientation/gamma", event.gamma);
		},
		*/
		
		onMenu: function(oEvent) {
		    this._toggleMenu();
		},
		
		onToggleSideContent: function(oEvent) {
			var oTB = oEvent.getSource(),
				bPressed = oTB.getPressed();

			this.getModel("shell").setProperty("/showSideContent", bPressed);
		},
		
		_showTips: function() {
			if (!this.getModel("app").getProperty("/showTips")) {
				return;
			}
			
			this.applyTip([
				{			    
					"id": "meAreaBtn",
					"contentWidth" : "30%",
					"popoverContent": "Show/Hide the me area. You can also close the me area with a click anywhere in the content."
				}, {
					"id": "viewportHomeBtn",
					"contentWidth" : "30%",
					"popoverContent": "Navigate back to overview page by title click."
				}, {
					"id": "sideContentToggleBtn",
					"contentWidth" : "30%",
					"popoverContent": "Show/Hide side content information area."
				}
			]);
		},
		
		_onRoutePatternMatched: function(oEvent) {
            var oHashChanger = HashChanger.getInstance(),
                sPageHash = oHashChanger.getHash(),
                oData = {};
                
            if (!oData.page) {
                oData.page = "/" + sPageHash;
            }
            this.sendAnalytics(oData);
        }, 
		
		_toggleMenu: function() {
		    //var oMeArea = this.getView().byId("meArea");
		    
		    this._meAreaVisible = !this._meAreaVisible;
		    
		    this.getView().toggleStyleClass("meAreaVisible", this._meAreaVisible);
		    //oMeArea.toggleStyleClass("open", this._meAreaVisible);
		    this.getModel("app").setProperty("/meAreaVisible", this._meAreaVisible);
		},
		
		_removeSplashScreen: function() {
			// hide SplashScreen and cleanup...
			jQuery("#root").css("visibility", "visible");
			jQuery("#uoUiSplashScreen").animate({
				opacity: 0
			}, 2000, function() {
				// onAnimationComplete...
				jQuery("#uoUiSplashScreen").remove();
			});
		},
		
		_attachStarfieldDirectionFromRouting: function() {
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
		}

	});

});