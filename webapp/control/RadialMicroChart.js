sap.ui.define([
    "jquery.sap.global", 
    "./library", 
    "sap/ui/core/Control", 
    "de/uniorg/martian/control/RadialMicroChartRenderer"
    ], 
    function(jQuery, library, Control, Renderer) {
    "use strict";
    var RadialMicroChart = Control.extend("de.uniorg.martian.control.RadialMicroChart", {
        constructor: function(i, s) {
            var p;
            if (s && typeof s.percentage === "number") {
                p = true;
            } else if (i && typeof i.percentage === "number") {
                p = true;
            } else {
                p = false;
            }
            try {
                Control.apply(this, arguments);
                this._bPercentageMode = p;
            } catch (e) {
                this.destroy();
                throw e;
            }
        },
        metadata: {
            library: "sap.suite.ui.microchart",
            properties: {
                total: {
                    group: "Data",
                    type: "float",
                    defaultValue: null 
                },
                fraction: {
                    group: "Data",
                    type: "float",
                    defaultValue: null 
                },
                percentage: {
                    group: "Data",
                    type: "float",
                    defaultValue: null 
                },
                valueColor: {
                    group: "Appearance",
                    type: "sap.m.ValueCSSColor",
                    defaultValue: "Neutral"
                }
            },
            events: {
                press: {}
            }
        }
    });
    RadialMicroChart.prototype.init = function() {
        this._rb = sap.ui.getCore().getLibraryResourceBundle("de.uniorg.martian.control.i18n");
        this._bPercentageMode;
    }
    ;
    RadialMicroChart.prototype.onBeforeRendering = function() {
        if (!this._bPercentageMode) {
            if (this.getTotal() === 0) {
                jQuery.sap.log.error("Total can not be 0, please add a valid total value");
            } else {
                this.setProperty("percentage", Math.round((this.getFraction() * 100 / this.getTotal()) * 10) / 10, true);
            }
        }
    }
    ;
    RadialMicroChart.prototype.onAfterRendering = function() {
        Renderer._handleOnAfterRendering(this);
    }
    ;
    RadialMicroChart.prototype.ontap = function(e) {
        if (sap.ui.Device.browseRenderer.internet_explorer) {
            this.$().focus();
        }
        this.firePress();
    }
    ;
    RadialMicroChart.prototype.onkeydown = function(e) {
        if (e.which === jQuery.sap.KeyCodes.SPACE) {
            e.preventDefault();
        }
    }
    ;
    RadialMicroChart.prototype.onkeyup = function(e) {
        if (e.which === jQuery.sap.KeyCodes.ENTER || e.which === jQuery.sap.KeyCodes.SPACE) {
            this.firePress();
            e.preventDefault();
        }
    }
    ;
    RadialMicroChart.prototype.attachEvent = function(e, d, f, b) {
        sap.ui.core.Control.prototype.attachEvent.call(this, e, d, f, b);
        if (e === "press") {
            this.rerender();
        }
        return this;
    }
    ;
    RadialMicroChart.prototype.detachEvent = function(e, f, b) {
        sap.ui.core.Control.prototype.detachEvent.call(this, e, f, b);
        if (e === "press") {
            this.rerender();
        }
        return this;
    }
    ;
    RadialMicroChart.prototype._getPercentageMode = function() {
        return this._bPercentageMode;
    }
    ;
    RadialMicroChart.prototype.setPercentage = function(p) {
        if (p) {
            if (p !== this.getPercentage()) {
                this._bPercentageMode = true;
                this.setProperty("percentage", p);
            }
        } else {
            this._bPercentageMode = false;
            this.setProperty("percentage", null );
        }
    }
    ;
    RadialMicroChart.prototype._isValueColorInstanceOfValueColor = function() {
        var v = this.getValueColor();
        for (var V in sap.m.ValueColor) {
            if (V === v) {
                return true;
            }
        }
        return false;
    }
    ;
    RadialMicroChart.prototype._getTooltipText = function() {
        var t = this.getTooltip_Text();
        if (!t) {
            t = this._getAriaAndTooltipText();
        } else if (this._isTooltipSuppressed()) {
            t = null ;
        }
        return t;
    }
    ;
    RadialMicroChart.prototype._getAriaText = function() {
        var A = this.getTooltip_Text();
        if (!A || this._isTooltipSuppressed()) {
            A = this._getAriaAndTooltipText();
        }
        return A;
    }
    ;
    RadialMicroChart.prototype._isTooltipSuppressed = function() {
        var t = this.getTooltip_Text();
        if (t && jQuery.trim(t).length === 0) {
            return true;
        } else {
            return false;
        }
    }
    ;
    RadialMicroChart.prototype._getAriaAndTooltipText = function() {
        var t;
        var p = this.getPercentage();
        if (p > 100) {
            p = 100;
        } else if (p < 0) {
            p = 0;
        }
        if (this._isValueColorInstanceOfValueColor()) {
            t = this._rb.getText("RADIALMICROCHART_ARIA_LABEL", [this.getPercentage(), this._getStatusText()]);
        } else {
            t = this._rb.getText("RADIALMICROCHART_ARIA_LABEL", [p, sap.m.ValueColor.Neutral]);
        }
        return t;
    }
    ;
    RadialMicroChart.prototype._getStatusText = function() {
        var v = this.getValueColor();
        switch (v) {
        case sap.m.ValueColor.Error:
            return this._rb.getText("SEMANTIC_COLOR_ERROR");
        case sap.m.ValueColor.Critical:
            return this._rb.getText("SEMANTIC_COLOR_CRITICAL");
        case sap.m.ValueColor.Good:
            return this._rb.getText("SEMANTIC_COLOR_GOOD");
        default:
            return this._rb.getText("SEMANTIC_COLOR_NEUTRAL");
        }
    }
    ;
    return RadialMicroChart;
});