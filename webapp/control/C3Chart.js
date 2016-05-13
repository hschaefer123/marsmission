sap.ui.define([
    "sap/ui/core/Control",
    "sap/ui/core/ResizeHandler",
    "sap/ui/thirdparty/d3",
    "./js/c3.min"
], function(Control, ResizeHandler) {
    "use strict";

    var C3Chart = Control.extend('de.uniorg.martian.control.C3Chart', {
        metadata: {
            properties: {
                width : {type : "sap.ui.core.CSSSize", group : "Misc", defaultValue : null},
                height : {type : "sap.ui.core.CSSSize", group : "Misc", defaultValue : null},
                data: {
                    type: "object"
                }
            },
            events: {
                unload: {
                    enablePreventDefault: true,
                    chartIDs: {
                        type: 'string[]'
                    }
                }
            }
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
    
    C3Chart.prototype.init = function() {
        this._sContainerId = this.getId() + "--container";
        this._html = new sap.ui.core.HTML({
            content: "<div style='width:100%;height:100%;' id='" + this._sContainerId + "'></div>"
        });
    };
    
    C3Chart.prototype.onAfterRendering = function() {
        if (!this.initialized) {
            this.createChart();
            
            // resize handler
            this.resizeID = ResizeHandler.register(jQuery.sap.domById(this._sContainerId), this.onResize.bind(this));    
            
            // binding update
			this.getBinding("data").attachChange(this.updateData.bind(this));
            
            this.initialized = true;
        } else {
            //this._updateCenter();
        }
    };
    
    C3Chart.prototype.updateData = function() {
        var aChartData = this.getData();
        this._C3Chart.load({
            columns: aChartData,
            keys: {
                value: ["IN", "OUT"]
            },  
            types: {
                IN: 'area-spline',
                OUT: 'area-spline'
            }    
        });
        //console.log(aChartData);
    };
    
    C3Chart.prototype.createChart = function() {
        var chartData = this.getData();
        
        // required due to lifecycle calls > init of undefined vars
        if (chartData === undefined) {
            return;
        }
            
        this._C3Chart = c3.generate({
            bindto: '#' + this._sContainerId,
            data: {
                columns: chartData,
                keys: {
                    value: ["IN", "OUT"]
                },  
                types: {
                    IN: 'area-spline',
                    OUT: 'area-spline'
                }    
            },
            size:  {
                height: 128
            },
            color: {
                pattern: ["#e7921e", "#f4cd97"]
            }
            /*
            axis: {
              y: {
                label: {
                  text: 'Y Label',
                  position: 'outer-middle'
                },
                tick: {
                  format: d3.format("$,") // ADD
                }
              },
              y2: {
                show: true,
                label: {
                  text: 'Y2 Label',
                  position: 'outer-middle'
                }
              }
            }
            */
        });            
    };
        
    C3Chart.prototype.onResize = function() {
        //this.setSize();
        this._C3Chart.resize();
    };    
    
    C3Chart.prototype.exit = function() {
        ResizeHandler.deregister(this.resizeID);
        this._C3Chart.destroy();
    };
    
    C3Chart.prototype.unload = function(chartIDs) {
        this._C3Chart.unload({
            ids: chartIDs
        });
    };
    
    return C3Chart;

}, /* bExport= */ true);