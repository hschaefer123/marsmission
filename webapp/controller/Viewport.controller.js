sap.ui.define([
	"de/uniorg/martian/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"jquery.sap.global"
], function(BaseController, JSONModel, jQuery) {
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
			
			// handle orientation change
			//window.addEventListener("deviceorientation", this.onOrientationChange.bind(this), false);
		},

		onAfterRendering: function() {
		    this._removeSplashScreen();
		    this._attachStarfieldDirectionFromRouting();
		    
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
		
		_toggleMenu: function() {
		    //var oMeArea = this.getView().byId("meArea");
		    
		    this._meAreaVisible = !this._meAreaVisible;
		    
		    this.getView().toggleStyleClass("meAreaVisible", this._meAreaVisible);
		    //oMeArea.toggleStyleClass("open", this._meAreaVisible);
		    this.getModel("app").setProperty("/meAreaVisible", this._meAreaVisible);
		},
		
		onToggleSideContent: function(oEvent) {
			var oTB = oEvent.getSource(),
				bPressed = oTB.getPressed();

			this.getModel("shell").setProperty("/showSideContent", bPressed);
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