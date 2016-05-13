sap.ui.define([
    "jquery.sap.global"
    ], function(jQuery) {
    "use strict";
    var RadialMicroChartRenderer = {};
    RadialMicroChartRenderer.FORM_RATIO = 1000;
    RadialMicroChartRenderer.BACKGROUND_CIRCLE_BORDER_WIDTH = 1;
    RadialMicroChartRenderer.BACKGROUND_CIRCLE_RADIUS = 500; //500;
    RadialMicroChartRenderer.SEGMENT_STROKE_WIDTH = 3;
    RadialMicroChartRenderer.CIRCLE_BORDER_WIDTH = 87.5;
    RadialMicroChartRenderer.CIRCLE_BORDER_LINE_WIDTH = 16;
    RadialMicroChartRenderer.CIRCLE_RADIUS = 410; //441.75;
    RadialMicroChartRenderer.SVG_VIEWBOX_CENTER_FACTOR = "50%";
    RadialMicroChartRenderer.X_ROTATION = 0;
    RadialMicroChartRenderer.SWEEP_FLAG = 1;
    RadialMicroChartRenderer.NUMBER_FONT_SIZE = 200; //235;
    RadialMicroChartRenderer.EDGE_CASE_SIZE_ACCESSIBLE_COLOR = 54;
    RadialMicroChartRenderer.EDGE_CASE_SIZE_SHOW_TEXT = 46;
    RadialMicroChartRenderer.EDGE_CASE_SIZE_MICRO_CHART = 24;
    
    RadialMicroChartRenderer.render = function(r, c) {
        this._writeDivStartElement(c, r);
        this._writeSVGStartElement(r);
        //this._writeBackground(r);
        this._writeSegments(c, r);
        if (this._renderingOfInnerContentIsRequired(c)) {
            this._writeBorders(r);
            if (this._innerCircleRequired(c)) {
                this._writeCircle(c, r);
            } else {
                this._writeCircleWithPathElements(c, r);
            }
            this._writeText(c, r);
        }
        r.write("</svg>");
        r.write("</div>");
    }
    ;
    RadialMicroChartRenderer._writeDivStartElement = function(c, r) {
        r.write("<div");
        r.writeControlData(c);
        var t = c._getTooltipText();
        if (t) {
            r.writeAttributeEscaped("title", t);
        }
        r.writeAttribute("role", "img");
        r.writeAttributeEscaped("aria-label", c._getAriaText());
        if (c.hasListeners("press")) {
            r.addClass("sapSuiteUiMicroChartPointer");
            r.writeAttribute("tabindex", "0");
        }
        r.addClass("uoSvgUiRMC");
        r.writeClasses();
        r.writeStyles();
        r.write(">");
    }
    ;
    RadialMicroChartRenderer._writeSVGStartElement = function(r) {
        var p;
        if (!sap.ui.getCore().getConfiguration().getRTL()) {
            p = "xMaxYMid meet";
        } else {
            p = "xMinYMid meet";
        }
        r.write("<svg width=\"100%\" height=\"100%\" viewBox=\"0 0 " + RadialMicroChartRenderer.FORM_RATIO + ' ' + RadialMicroChartRenderer.FORM_RATIO + "\" preserveAspectRatio=\"" + p + "\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\">");
    }
    ;
    RadialMicroChartRenderer._writeBackground = function(r) {
        r.write("<circle class=\"sapSuiteUiMicroChartRMCCircleBackground\" cx=\"" + RadialMicroChartRenderer.SVG_VIEWBOX_CENTER_FACTOR + "\" cy=\"" + RadialMicroChartRenderer.SVG_VIEWBOX_CENTER_FACTOR + "\" r=\"" + RadialMicroChartRenderer.BACKGROUND_CIRCLE_RADIUS + "\" stroke-width=\"" + this.BACKGROUND_CIRCLE_BORDER_WIDTH + "\" />");
    }
    ;
    RadialMicroChartRenderer._writeBorders = function(r) {
        r.write("<circle class=\"uoSvgUiRMCHCBIncompleteBorder\" cx=\"" + RadialMicroChartRenderer.SVG_VIEWBOX_CENTER_FACTOR + "\" cy=\"" + RadialMicroChartRenderer.SVG_VIEWBOX_CENTER_FACTOR + "\" r=\"" + (RadialMicroChartRenderer.CIRCLE_RADIUS + RadialMicroChartRenderer.CIRCLE_BORDER_WIDTH / 2.0 - RadialMicroChartRenderer.BACKGROUND_CIRCLE_BORDER_WIDTH) + "\" stroke-width=\"" + RadialMicroChartRenderer.BACKGROUND_CIRCLE_BORDER_WIDTH + "\" />");
        r.write("<circle class=\"uoSvgUiRMCHCBIncompleteBorder\" cx=\"" + RadialMicroChartRenderer.SVG_VIEWBOX_CENTER_FACTOR + "\" cy=\"" + RadialMicroChartRenderer.SVG_VIEWBOX_CENTER_FACTOR + "\" r=\"" + (RadialMicroChartRenderer.CIRCLE_RADIUS - RadialMicroChartRenderer.CIRCLE_BORDER_WIDTH / 2.0 + RadialMicroChartRenderer.BACKGROUND_CIRCLE_BORDER_WIDTH) + "\" stroke-width=\"" + RadialMicroChartRenderer.BACKGROUND_CIRCLE_BORDER_WIDTH + "\" />");
    }
    ;
    RadialMicroChartRenderer._writeCircle = function(c, r) {
        r.write("<circle class=\"" + this._getSVGStringForColor(this._getFullCircleColor(c), c) + "\" cx=\"" + RadialMicroChartRenderer.SVG_VIEWBOX_CENTER_FACTOR + "\" cy=\"" + RadialMicroChartRenderer.SVG_VIEWBOX_CENTER_FACTOR + "\" r=\"" + RadialMicroChartRenderer.CIRCLE_RADIUS + "\" fill=\"transparent\" stroke-width=\"" + RadialMicroChartRenderer.CIRCLE_BORDER_WIDTH + "px\" />");
    }
    ;
    RadialMicroChartRenderer._writeCircleWithPathElements = function(c, r) {
        var l = c.getPercentage() > 50 ? 1 : 0;
        var p = this._calculatePathCoordinates(c);
        this._writePath2(l, p, c, r);
        this._writePath1(l, p, c, r);
    }
    ;
    RadialMicroChartRenderer._writePath1 = function(l, p, c, r) {
        var P = "M" + p[0] + " " + p[1] + " A " + RadialMicroChartRenderer.CIRCLE_RADIUS + " " + RadialMicroChartRenderer.CIRCLE_RADIUS + ", " + RadialMicroChartRenderer.X_ROTATION + ", " + l + ", " + RadialMicroChartRenderer.SWEEP_FLAG + ", " + p[2] + " " + p[3];
        r.write("<path class=\"uoSvgUiRMCPath" + this._getSVGStringForColor(this._getPathColor(c), c) + "d=\"" + P + "\" fill=\"transparent\" stroke-linecap=\"round\" stroke-width=\"" + RadialMicroChartRenderer.CIRCLE_BORDER_WIDTH + "px\" />");
    }
    ;
    RadialMicroChartRenderer._writePath2 = function(l, p, c, r) {
        var P = "M" + p[2] + " " + p[3] + " A " + RadialMicroChartRenderer.CIRCLE_RADIUS + " " + RadialMicroChartRenderer.CIRCLE_RADIUS + ", " + RadialMicroChartRenderer.X_ROTATION + ", " + (1 - l) + ", " + RadialMicroChartRenderer.SWEEP_FLAG + ", " + p[0] + " " + p[1];
        r.write("<path class=\"uoSvgUiRMCPath uoSvgUiRMCPathIncomplete\" d=\"" + P + "\" fill=\"transparent\" stroke-width=\"" + RadialMicroChartRenderer.CIRCLE_BORDER_LINE_WIDTH + "px\" />");
    }
    ;
    RadialMicroChartRenderer._writeSegments = function(c, r) {
        r.write("<line x1=\"0\" y1=\"" + (RadialMicroChartRenderer.BACKGROUND_CIRCLE_RADIUS - 8)  + "\" x2=\"192\" y2=\"" + (RadialMicroChartRenderer.BACKGROUND_CIRCLE_RADIUS - 8) + "\" stroke=\"white\" stroke-width=\"" + RadialMicroChartRenderer.CIRCLE_BORDER_LINE_WIDTH + "px\" />");
        r.write("<line x1=\"808\" y1=\"" + (RadialMicroChartRenderer.BACKGROUND_CIRCLE_RADIUS - 8)  + "\" x2=\"1000\" y2=\"" + (RadialMicroChartRenderer.BACKGROUND_CIRCLE_RADIUS - 8) + "\" stroke=\"white\" stroke-width=\"" + RadialMicroChartRenderer.CIRCLE_BORDER_LINE_WIDTH + "px\" />");
    }
    ;
    RadialMicroChartRenderer._writeText = function(c, r) {
        r.write("<text class=\"uoSvgUiRMCFont\" aria-hidden=\"true\" text-anchor=\"middle\" alignment-baseline=\"middle\"" + "\" font-size=\"" + RadialMicroChartRenderer.NUMBER_FONT_SIZE + "\" x=\"" + RadialMicroChartRenderer.SVG_VIEWBOX_CENTER_FACTOR + "\" y=\"" + this._getVerticalViewboxCenterFactorForText() + "\"> " + this._generateTextContent(c) + "</text>");
    }
    ;
    RadialMicroChartRenderer._renderingOfInnerContentIsRequired = function(c) {
        if (c._getPercentageMode() || (c.getTotal() !== 0)) {
            return true;
        } else {
            return false;
        }
    }
    ;
    RadialMicroChartRenderer._getSVGStringForColor = function(c, a) {
        if (a._isValueColorInstanceOfValueColor()) {
            return " " + c + "\"";
        } else if (c === "uoSvgUiRMCPathIncomplete") {
            return " " + c + "\"";
        } else {
            return "\" stroke=\"" + c + "\"";
        }
    }
    ;
    RadialMicroChartRenderer._getVerticalViewboxCenterFactorForText = function() {
        if (sap.ui.Device.browser.msie) {
            return "55%";
        } else if (sap.ui.Device.browser.mozilla) {
            return "56%";
        } else {
            return "51%";
        }
    }
    ;
    RadialMicroChartRenderer._innerCircleRequired = function(c) {
        if (c.getPercentage() >= 100 || c.getPercentage() <= 0) {
            return true;
        } else {
            return false;
        }
    }
    ;
    RadialMicroChartRenderer._calculatePathCoordinates = function(c) {
        var p = this._getPercentageForCircleRendering(c);
        var C = [];
        C.push(RadialMicroChartRenderer.FORM_RATIO / 2 + RadialMicroChartRenderer.CIRCLE_RADIUS * Math.cos(-Math.PI / 2.0));
        C.push(RadialMicroChartRenderer.FORM_RATIO / 2 + RadialMicroChartRenderer.CIRCLE_RADIUS * Math.sin(-Math.PI / 2.0));
        C.push(RadialMicroChartRenderer.FORM_RATIO / 2 + RadialMicroChartRenderer.CIRCLE_RADIUS * Math.cos(-Math.PI / 2.0 + p / 100 * 2 * Math.PI));
        C.push(RadialMicroChartRenderer.FORM_RATIO / 2 + RadialMicroChartRenderer.CIRCLE_RADIUS * Math.sin(-Math.PI / 2.0 + p / 100 * 2 * Math.PI));
        return C;
    }
    ;
    RadialMicroChartRenderer._getPercentageForCircleRendering = function(c) {
        var p = c.getPercentage();
        var P = p;
        if (p > 99) {
            P = 99;
        }
        if (p < 1) {
            P = 1;
        }
        return P;
    }
    ;
    RadialMicroChartRenderer._handleOnAfterRendering = function(c) {
        var p;
        if (c.getParent() instanceof sap.m.TileContent) {
            p = c.getParent().$().css("min-width");
            c.getParent().$().width(p);
            if (sap.ui.Device.browser.msie || sap.ui.Device.browser.edge) {
                c.$().width(parseInt(p, 10) - 16);
            }
        } else {
            if (c.getParent() !== undefined && c.getParent() !== null  && c.getParent().getHeight !== undefined && c.getParent().getHeight !== null ) {
                var P = parseFloat(c.getParent().$().height()) - 2;
                c.$().height(P);
                c.$().children("svg").height(P);
            }
            if (c.getParent() !== undefined && c.getParent() !== null  && c.getParent().getWidth !== undefined && c.getParent().getWidth !== null ) {
                p = parseFloat(c.getParent().$().width()) - 2;
                c.$().width(p);
                c.$().children("svg").width(p);
            }
        }
        if (parseInt(c.$().children("svg").css("height"), 10) < RadialMicroChartRenderer.EDGE_CASE_SIZE_MICRO_CHART || parseInt(c.$().children("svg").css("width"), 10) < RadialMicroChartRenderer.EDGE_CASE_SIZE_MICRO_CHART) {
            c.$().hide();
            return;
        }
        var $ = c.$().find("text");
        if (parseInt(c.$().children("svg").css("height"), 10) <= RadialMicroChartRenderer.EDGE_CASE_SIZE_SHOW_TEXT || parseInt(c.$().children("svg").css("width"), 10) <= RadialMicroChartRenderer.EDGE_CASE_SIZE_SHOW_TEXT) {
            $.hide();
        } else {
            var C = $.attr("class");
            if (C) {
                var t = this._getTextColorClass(c);
                if (C.indexOf(t) < 0) {
                    $.attr("class", C + " " + t);
                }
            }
        }
    }
    ;
    RadialMicroChartRenderer._getTextColorClass = function(c) {
        var s = parseInt(jQuery.sap.byId(c.getId()).children("svg").css("height"), 10);
        if (s <= RadialMicroChartRenderer.EDGE_CASE_SIZE_ACCESSIBLE_COLOR && (!c._isValueColorInstanceOfValueColor() || c.getValueColor() === sap.m.ValueColor.Neutral)) {
            return "uoSvgUiRMCAccessibleTextColor";
        } else {
            switch (c.getValueColor()) {
            case sap.m.ValueColor.Good:
                return "uoSvgUiRMCGoodTextColor";
            case sap.m.ValueColor.Error:
                return "uoSvgUiRMCErrorTextColor";
            case sap.m.ValueColor.Critical:
                return "sauoSvgUiRMCCriticalTextColor";
            default:
                return "uoSvgUiRMCNeutralTextColor";
            }
        }
    }
    ;
    RadialMicroChartRenderer._getFullCircleColor = function(c) {
        if (c.getPercentage() >= 100) {
            return this._getPathColor(c);
        }
        if (c.getPercentage() <= 0) {
            return "uoSvgUiRMCPathIncomplete";
        }
    }
    ;
    RadialMicroChartRenderer._getPathColor = function(c) {
        var v = c.getValueColor();
        if (c._isValueColorInstanceOfValueColor()) {
            switch (v) {
            case sap.m.ValueColor.Good:
                return "sapSuiteUiMicroChartRMCPathGood";
            case sap.m.ValueColor.Error:
                return "sapSuiteUiMicroChartRMCPathError";
            case sap.m.ValueColor.Critical:
                return "sapSuiteUiMicroChartRMCPathCritical";
            default:
                return "sapSuiteUiMicroChartRMCPathNeutral";
            }
        } else {
            return v;
        }
    }
    ;
    RadialMicroChartRenderer._generateTextContent = function(c) {
        if (c.getPercentage() === 100) {
            return c._rb.getText("RADIALMICROCHART_PERCENTAGE_TEXT", [100]);
        }
        if (c.getPercentage() === 0) {
            return c._rb.getText("RADIALMICROCHART_PERCENTAGE_TEXT", [0]);
        }
        if (c.getPercentage() >= 100) {
            jQuery.sap.log.error("Values over 100%(" + c.getPercentage() + "%) are not supported");
            return c._rb.getText("RADIALMICROCHART_PERCENTAGE_TEXT", [100]);
        }
        if (c.getPercentage() <= 0) {
            jQuery.sap.log.error("Values below 0%(" + c.getPercentage() + "%) are not supported");
            return c._rb.getText("RADIALMICROCHART_PERCENTAGE_TEXT", [0]);
        }
        return c._rb.getText("RADIALMICROCHART_PERCENTAGE_TEXT", [c.getPercentage()]);
    }
    ;
    return RadialMicroChartRenderer;
}, true);