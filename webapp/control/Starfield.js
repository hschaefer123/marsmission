sap.ui.define([
    "sap/ui/core/Control",
    "sap/ui/core/ResizeHandler",
    "./js/starfield"
    //"./js/starfield"
], function(Control, ResizeHandler) {
    "use strict";
    
    //http://www.kevs3d.co.uk/dev/warpfield/

    var Starfield = Control.extend('de.uniorg.martian.control.Starfield', {
        
        _bInitialized: false,
        _bStarfieldInitialized: false,
        
        metadata: {
            properties: {
                width : {type : "sap.ui.core.CSSSize", group : "Misc", defaultValue : null},
                height : {type : "sap.ui.core.CSSSize", group : "Misc", defaultValue : null},
                animate : {type : "boolean", group : "Misc", defaultValue : true},
                // add data type to control allowed directions!!!
                direction : {type : "string", group : "Misc", defaultValue : "CENTER"}
            },
            events: {}
        },
        
        renderer: function(oRm, oControl) {
            oRm.write("<div ");
            oRm.writeControlData(oControl);
            oRm.addStyle("width", oControl.getWidth());
            oRm.addStyle("height", oControl.getHeight());
            oRm.writeClasses();
            oRm.writeStyles();
            oRm.write(">");
            oRm.renderControl(oControl._html);
            oRm.write("</div>");
        }
        
    });
    
    Starfield.prototype.init = function() {
        this._sContainerId = this.getId() + "--starfield";
        this._html = new sap.ui.core.HTML({
            content: "<div style='width:100%;height:100%;' id='" + this._sContainerId + "'></div>"
        });
    };
    
    Starfield.prototype.onAfterRendering = function() {
        if (this.getAnimate()) {
            this._render();
            
            // resize handler
            this.resizeID = ResizeHandler.register(jQuery.sap.domById(this._sContainerId), this.onResize.bind(this));    
        }
        
        this._bInitialized = true;
    };
    
    Starfield.prototype._render = function() {
        if (this._bStarfieldInitialized) {
            return;
        }
        
        lol.direction = "CENTER";
        lol.target = "__app0-BG";
        lol.init();
        
        this._bStarfieldInitialized = true;
    };

    /**
     * This overrides the default setter of the direction property.
     *
     * @param {string} sDirection
     * @public
     */    
    Starfield.prototype.setDirection = function(sDirection) {
        if (sDirection === this.getDirection()) {
            return this;
        }
        this.setProperty("direction", sDirection, true);
        
        lol.direction = sDirection;
    };
    
    /**
     * This overrides the default setter of the playAudioc property.
     *
     * @param {boolean} bPlayAudio
     * @public
     */
    Starfield.prototype.setAnimate = function(bAnimate) {
        if (bAnimate === this.getAnimate()) {
            return this;
        }
        this.setProperty("animate", bAnimate, true);

        if (!this._bInitialized) {
            return false;
        }
        
        // initialize audio on first play
        if (!this._bStarfieldInitialized) {
            this._render();
        } else {
            if (bAnimate) {
                lol.anim.start();
            } else {
                lol.anim.stop();
            }
        }
    };    
    
    Starfield.prototype.onResize = function() {
        lol.resize();
        //this._Starfield.resizer();
        //window.Starfield.resizer();
    };      
    
    Starfield.prototype.exit = function() {
        this._Starfield.destroy();
    };
    
    return Starfield;
    
}, /* bExport= */ true);