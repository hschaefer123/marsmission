sap.ui.define([
    "sap/ui/core/Control", 
    "jquery.sap.global" 
    ], 
    function ( Control, jQuery ) {

    var Reveal = Control.extend( "de.uniorg.martian.control.viewer.Reveal", { /** @lends uniorg.ui.viewer.reveal.Reveal **/
        metadata: {
            properties:   {
                width: {
                    type: "sap.ui.core.CSSSize",
                    group: "Misc",
                    defaultValue: null
                },
                height: {
                    type: "sap.ui.core.CSSSize",
                    group: "Misc",
                    defaultValue: null
                },
                slideSource: { type: "sap.ui.core.URI", defaultValue: null },
                viewDistance: { type: "int", defaultValue: 3 },
                controls: { type: "boolean", defaultValue: true },
                progress: { type: "boolean", defaultValue: true },
                slideNumber: { type: "boolean", defaultValue: false },
                overview: { type: "boolean", defaultValue: true },
                center: { type: "boolean", defaultValue: true },
                loop: { type: "boolean", defaultValue: false },
                rtl: { type: "boolean", defaultValue: false },
                fragments: { type: "boolean", defaultValue: true },
                transition: { type: "string", defaultValue: "default" },
                transitionSpeed: { type: "string", defaultValue: "default" },
                backgroundTransition: { type: "string", defaultValue: "default" },
                theme: { type: "string", defaultValue: "default" }
            }
        },
        renderer: {
            render: function ( oRm, oControl ) {
                oRm.write("<iframe");
                oRm.writeControlData(oControl);
                oRm.addClass("uoRevealFrame");
                oRm.writeClasses();
                oRm.addStyle("width", oControl.getWidth());
                oRm.addStyle("height", oControl.getHeight());
                oRm.addStyle("border", 0);
                oRm.writeStyles();
                oRm.writeAttribute("scrolling", "no");
                oRm.writeAttribute("allowfullscreen", "true");
                oRm.write(" />");
            }
        }
    } );

    Reveal.prototype.getRevealConfig = function() {
        return {
            controls: this.getControls(),
            progress: this.getProgress(),
            slideNumber: this.getSlideNumber(),
            overview: this.getOverview(),
            center: this.getCenter(),
            loop: this.getLoop(),
            rtl: this.getRtl(),
            fragments: this.getFragments(),
            embedded: false,
            previewLinks: true,
            viewDistance: this.getViewDistance(),
            theme: this.getTheme(),
            transition: this.getTransition(),
            transitionSpeed: this.getTransitionSpeed(),
            backgroundTransition: this.getBackgroundTransition(),
            Xdependencies: [
                { 
                    src: "plugin/highlight/highlight.js", async: true, callback: function() { hljs.initHighlightingOnLoad(); } 
                }
			]
        };
    };

    Reveal.prototype.onAfterRendering = function() {
        var sBasePath = jQuery.sap.getModulePath( "de.uniorg.martian.assets.reveal" );
        var oConfig = this.getRevealConfig();
        var oFrame = this.getDomRef();
        var sSourceUrl = this.getSlideSource();
        oFrame.onload = function() {
            jQuery.get(sSourceUrl, function(oData) {
                //oFrame.contentWindow.setRevealContent(oData, oConfig);
                oFrame.contentWindow.Reveal.configure(oConfig);
                //console.log("REVEAL", oFrame.contentWindow.Reveal);
                //oFrame.contentWindow.document.on("touchmove", false);
                /*
                oFrame.contentWindow.document.addEventListener("touchmove", function(e) {
                    e.preventDefault();
                });
                */
            });
        };
        oFrame.src = sSourceUrl;
        //noScroll = document.getElementById("cant-touch-this");
        // avoid scroll
        /*
        oFrame.contentWindow.document.addEventListener("touchmove", function(e) {
            e.preventDefault();
        });
        */
    };

    Reveal.prototype.getReveal = function() {
        if (this.getDomRef() && this.getDomRef().contentWindow) {
            return this.getDomRef().contentWindow.Reveal;
        } else {
            // TODO: delegate after
            return null;
        }
    };

    Reveal.prototype.previous = function() {
        var oReveal = this.getReveal();
        if (oReveal) {
            this.getReveal().prev();
        }
    };

    Reveal.prototype.next = function() {
        var oReveal = this.getReveal();
        if (oReveal) {
            this.getReveal().next();
        }
    };

    Reveal.prototype.first = function() {
        var oReveal = this.getReveal();
        if (oReveal) {
            while(!this.getReveal().isFirstSlide()) {
                this.previous();
            }
        }
    };

    Reveal.prototype.last = function() {
        var oReveal = this.getReveal();
        if (oReveal) {
            while(!this.getReveal().isLastSlide()) {
                this.next();
            }
        }
    };

    return Reveal;
    
}, true);