sap.ui.define([
	"sap/ui/core/Control",
	"./js/jSignature.min"
], function(Control) {
	"use strict";

	var Signature = Control.extend("de.uniorg.martian.control.Signature", {
		// https://github.com/willowsystems/jSignature

		_bInitialized: false,

		metadata: {
			properties: {
				width: {
					type: "sap.ui.core.CSSSize",
					group: "Misc",
					defaultValue: null
				},
				height: {
					type: "sap.ui.core.CSSSize",
					group: "Misc",
					defaultValue: null
				}
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
			//oRm.renderControl(oControl._canvas);
			oRm.write("</div>");
		}

	});

	Signature.prototype.init = function() {
		/*
		this._sContainerId = this.getId() + "--canvas";
		this._canvas = new sap.ui.core.HTML({
		    content: "<canvas style='width:100%;height:100%;' id='" + this._sContainerId + "'></canvas>"
		});
		*/
	};

	Signature.prototype.onAfterRendering = function() {
		var $DomNode = this.$();

		$DomNode.jSignature({
			"width": this.getWidth(), //"ratio",
			"height": this.getHeight(), //"ratio",
			"sizeRatio": 6, // only used when height = 'ratio'
			"color": "#e7921e",
			"background-color": "#f00",
			"decor-color": "#000",
			"lineWidth": 0,
			"minFatFingerCompensation": -10,
			"showUndoButton": false
		});
	};
	
	Signature.prototype.exportImage = function() {
		var $DomNode = this.$();
		
		return $DomNode.jSignature("getData", "image");
	};
	
	Signature.prototype.exportSvg = function() {
		var $DomNode = this.$();
		
		return $DomNode.jSignature("getData", "svg");
	};

	Signature.prototype.reset = function() {
		var $DomNode = this.$();
		
		return $DomNode.jSignature("reset");
	};
	
	Signature.prototype.onResize = function() {
		//this._C3Chart.resize();
	};

	/**
	 * This overrides the default setter of the playAudioc property.
	 *
	 * @param {boolean} bPlayAudio
	 * @public
	 */
	Signature.prototype.setPlay = function(bPlay) {
		if (bPlay === this.getPlay()) {
			return this;
		}
		this.setProperty("play", bPlay, true);
	};

	Signature.prototype.exit = function() {
		//ResizeHandler.deregister(this.resizeID);
		//this._C3Chart.destroy();
	};
	
	Signature.prototype.animate = function() {
	    // http://codepen.io/ghepting/pen/xnezB
        /*
        (function () {
            window.signature = {
                initialize: function () {
                    return $('.signature svg').each(function () {
                        var delay, i, len, length, path, paths, previousStrokeLength, results, speed;
                        paths = $('path, circle, rect', this);
                        delay = 0;
                        results = [];
                        for (i = 0, len = paths.length; i < len; i++) {
                            if (window.CP.shouldStopExecution(1)) {
                                break;
                            }
                            path = paths[i];
                            length = path.getTotalLength();
                            previousStrokeLength = speed || 0;
                            speed = length < 100 ? 20 : Math.floor(length);
                            delay += previousStrokeLength + 100;
                            results.push($(path).css('transition', 'none').attr('data-length', length).attr('data-speed', speed).attr('data-delay', delay).attr('stroke-dashoffset', length).attr('stroke-dasharray', length + ',' + length));
                        }
                        window.CP.exitedLoop(1);
                        return results;
                    });
                },
                animate: function () {
                    return $('.signature svg').each(function () {
                        var delay, i, len, length, path, paths, results, speed;
                        paths = $('path, circle, rect', this);
                        results = [];
                        for (i = 0, len = paths.length; i < len; i++) {
                            if (window.CP.shouldStopExecution(2)) {
                                break;
                            }
                            path = paths[i];
                            length = $(path).attr('data-length');
                            speed = $(path).attr('data-speed');
                            delay = $(path).attr('data-delay');
                            results.push($(path).css('transition', 'stroke-dashoffset ' + speed + 'ms ' + delay + 'ms linear').attr('stroke-dashoffset', '0'));
                        }
                        window.CP.exitedLoop(2);
                        return results;
                    });
                }
            };
            $(document).ready(function () {
                window.signature.initialize();
                return $('button').on('click', function () {
                    window.signature.initialize();
                    return setTimeout(function () {
                        return window.signature.animate();
                    }, 500);
                });
            });
            $(window).load(function () {
                return window.signature.animate();
            });
        }.call(this));
          
        */
	};

	return Signature;

}, /* bExport= */ true);