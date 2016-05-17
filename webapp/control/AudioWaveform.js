sap.ui.define([
    "sap/ui/core/Control",
    "sap/ui/core/ResizeHandler",
    "./js/wavesurfer.min"
], function(Control, ResizeHandler) {
    "use strict";

    var AudioWaveform = Control.extend("de.uniorg.martian.control.AudioWaveform", {
        metadata: {
            properties: {
                audioSrc: { 
                    type: "sap.ui.core.URI", 
                    defaultValue: null 
                },
				/** Use your own previously initialized AudioContext or leave blank.
				 */
				"audioContext": {
					type: "object",
					defaultValue: null
				},
				/** Speed at which to play audio. Lower number is slower.
				 */
				"audioRate": {
					type: "float",
					defaultValue: 1
				},
				/** WebAudio or MediaElement. In most cases you don't have to set this manually. 
				 *  MediaElement is a fallback for unsupported browsers.
				 */
				"backend": {
					type: "string",
					defaultValue: "WebAudio"
				},
				/**
				 * If specified, the waveform will be drawn like this.
				 */
				"barWidth": {
					type: "int",
					defaultValue: null
				},
				/** Whether to fill the entire container or draw only according to minPxPerSec.
				 * CSS-selector or HTML-element where the waveform should be drawn. This is the only required parameter.
				 */
				"container": {
					type: "mixed"
				},
				/** The fill color of the cursor indicating the playhead position.
				 */
				"cursorColor": {
					type: "sap.ui.core.CSSColor",
					defaultValue: "#333"
				},	
				// Measured in pixels.
				"cursorWidth": {
					type: "integer",
					defaultValue: 1
				},						
				/**
				 * Whether to fill the entire container or draw only according to minPxPerSec.
				 */
				"fillParent": {
					type: "boolean",
					defaultValue: true
				},	
				width : {type : "sap.ui.core.CSSSize", group : "Misc", defaultValue : null},
                height : {type : "sap.ui.core.CSSSize", group : "Misc", defaultValue : 128},
				/**
				 * The height of the waveform. Measured in pixels.
				 */
				 /*
				"height": {
					type: "integer",
					defaultValue: "128"
				},		
				*/
				/**
				 * Whether to hide the horizontal scrollbar when one would normally be shown.
				 */
				"hideScrollbar": {
					type: "boolean",
					defaultValue: false
				},						
				/**
				 * Whether the mouse interaction will be enabled at initialization. You can switch this parameter at any time later on.
				 */
				"interact": {
					type: "boolean",
					defaultValue: true
				},						
				/**
				 * Maximum width of a single canvas in pixels, excluding a small overlap (2 * pixelRatio, rounded up to the next even integer). 
				 * If the waveform is longer than this value, additional canvases will be used to render the waveform, 
				 * which is useful for very large waveforms that may be too wide for browsers to draw on a single canvas. 
				 * This parameter is only applicable to the MultiCanvas renderer.
				 */
				"maxCanvasWidth": {
					type: "integer",
					defaultValue: 4000
				},						
				/**
				 * 'audio' or 'video'. Only used with backend: 'MediaElement'.
				 */
				"mediaType": {
					type: "string",
					defaultValue: "audio"
				},						
				/**
				 * Minimum number of pixels per second of audio.
				 */
				"minPxPerSec": {
					type: "integer",
					defaultValue: "50"
				},						
				/**
				 * If true, normalize by the maximum peak instead of 1.0.
				 */
				"normalize": {
					type: "boolean",
					defaultValue: false
				},						
				/**
				 * Can be set to 1 for faster rendering.
				 */
				"pixelRatio": {
					type: "integer",
					defaultValue: window.devicePixelRatio
				},						
				/**
				 * The fill color of the part of the waveform behind the cursor.
				 */
				"progressColor": {
					type: "sap.ui.core.CSSColor",
					defaultValue: "#555"
				},						
				/**
				 * The renderer object used to draw the waveform. The MultiCanvas renderer can be used to render waveforms that cannot fit on a single canvas due to browser limitations.
				 */
				"renderer": {
					type: "string",
					defaultValue: "Canvas"
				},						
				/**
				 * Whether to scroll the container with a lengthy waveform. Otherwise the waveform is shrunk to the container width (see fillParent).
				 */
				"scrollParent": {
					type: "boolean",
					defaultValue: false
				},						
				/**
				 * Number of seconds to skip with the skipForward() and skipBackward() methods.
				 */
				"skipLength": {
					type: "float",
					defaultValue: 2
				},						
				/**
				 * The fill color of the waveform after the cursor.
				 */
				"waveColor": {
					type: "sap.ui.core.CSSColor",
					defaultValue: "#999"
				},						
				/**
				 * If a scrollbar is present, center the waveform around the progress
				 */
				"autoCenter": {
					type: "boolean",
					defaultValue: true
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
            oRm.renderControl(oControl._html);
            oRm.write("</div>");
        }
        
    });
    
    AudioWaveform.prototype.init = function() {
        this._sContainerId = this.getId() + "--audiosurfer";
		this._html = new sap.ui.core.HTML({
			content: "<div id='" + this._sContainerId + "' style='width:" + this.getWidth() + ";height:" + this.getHeight() + ";'></div>"
		}); 
    };
    
    AudioWaveform.prototype.onAfterRendering = function() {
        // http://wavesurfer-js.org/
        
        if (!this.initialized) {
            var mOptions =  {
                container: "#" + this._sContainerId,
                //container: $(this.getAggregation("_html").getDomRef()),
                height: 64,
                skipLength: this.getSkipLength(),
                barWidth: this.getBarWidth(),
                cursorColor: this.getCursorColor(),
                progressColor: this.getProgressColor(),
                waveColor: this.getWaveColor("#666666")
            };	   
            
            this._ws = WaveSurfer.create(mOptions);
            
            if (this.getAudioSrc()) {
                this._ws.load(this.getAudioSrc());
                //this._ws.load("media/houston.mp3");
            }
            
            // resize handler
            this.resizeID = ResizeHandler.register(jQuery.sap.domById(this._sContainerId), this.onResize.bind(this));    
            
            this.initialized = true;
        } else {
            //this._updateCenter();
        }
    };
    
	AudioWaveform.prototype.play = function() {
        this._ws.play();
    };
    
    AudioWaveform.prototype.pause = function() {
        this._ws.pause();
    };

    AudioWaveform.prototype.skipBackward = function() {
        this._ws.skipBackward();
    };

    AudioWaveform.prototype.skipForward = function() {
        this._ws.skipForward();
    };
		
	
    AudioWaveform.prototype.setPlaybackRate = function(fValue) {
        this._ws.setPlaybackRate(fValue);
    };
		
    AudioWaveform.prototype.onResize = function() {
        //console.log("resize AudioWaveform");
        //this._C3Chart.resize();
    };    
    
    AudioWaveform.prototype.exit = function() {
        ResizeHandler.deregister(this.resizeID);
        //this._C3Chart.destroy();
    };
    
    return AudioWaveform;

}, /* bExport= */ true);