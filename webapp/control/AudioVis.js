sap.ui.define([
    "sap/ui/core/Control",
    "sap/ui/core/ResizeHandler",
    "./js/webaudiox"
], function(Control, ResizeHandler) {
    "use strict";

    var AudioVis = Control.extend("de.uniorg.martian.control.AudioVis", {
        
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
                },
                src: {
                    type: "string",
                    group: "Misc",
                    defaultValue: null
                },
                play: {
                    type: "boolean",
                    group: "Misc",
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
            oRm.renderControl(oControl._canvas);
            oRm.write("</div>");
        }

    });

    AudioVis.prototype.init = function() {
        this._sContainerId = this.getId() + "--canvas";
        this._canvas = new sap.ui.core.HTML({
            content: "<canvas style='width:100%;height:100%;' id='" + this._sContainerId + "'></canvas>"
        });
    };
    
    AudioVis.prototype.exit = function() {
        ResizeHandler.deregister(this.resizeID);
        //this._C3Chart.destroy();
    };

    AudioVis.prototype.onAfterRendering = function() {
        //var $DomNode = this.$()
        //$DomNode.on("load", jQuery.proxy(this.onload, this));
        //var oDomRef = this.getDomRef();
        
        if (this.getPlay()) {
            this._render();
            
            // resize handler
            this.resizeID = ResizeHandler.register(jQuery.sap.domById(this._sContainerId), this.onResize.bind(this));
        }

        this._bInitialized = true;
    };
    
    AudioVis.prototype.onResize = function() {
        //this._C3Chart.resize();
    };
    
    AudioVis.prototype._render = function() {
        if (this.canvas) {
            return;
        }
        
        // initialize canvas
        var $div = this.$()[0];
        this.canvas = $("#" + this._sContainerId)[0];
        this.ctx = this.canvas.getContext("2d");
            
        this.canvas.width = $div.clientWidth;
        this.canvas.height = $div.clientHeight;
        
        // initialize web audio
        this._initAudio();
        
        // loop and update
        window.requestAnimationFrame(this._update.bind(this));
    };

    AudioVis.prototype._initAudio = function() {
        // create WebAudio API context
        var audioCtx = new (window.AudioContext || window.webkitAudioContext)(); // new AudioContext();
        
        if (!audioCtx) {
            alert("No Web Audio API support");
            return;
        }
        
        var lineOut = new WebAudiox.LineOut(audioCtx);
        this.lineOut = lineOut;
        var analyser = audioCtx.createAnalyser();
        this.analyser = analyser;
        analyser.connect(lineOut.destination);
        lineOut.destination	= analyser;

        // load a sound and play it immediatly
        WebAudiox.loadBuffer(audioCtx, this.getSrc(), function(buffer){
            // init AudioBufferSourceNode
            var source  = audioCtx.createBufferSource();
            source.buffer = buffer
            source.loop	= true
            source.connect(lineOut.destination)
            // start the sound now
            source.start(0);
            this.AudioBufferSourceNode = source;
        }.bind(this));        
    };
    
    AudioVis.prototype._update = function() {
        if (!this.lineOut.isMuted) {
            // clear the canvas
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            // put the sound in the canvas
            this._analyzerUpdate(this.analyser);
        }
        // next loop
        window.requestAnimationFrame(this._update.bind(this));
    };

    AudioVis.prototype._analyzerUpdate = function(analyser) {
        // get the average for the first channel
        var freqData = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(freqData);
        
        // normalized
        var iNumBars = 32;
        var iOffsetEnd = parseInt(iNumBars / 3);
        
        var aHistogram = new Float32Array(iNumBars);
        WebAudiox.ByteToNormalizedFloat32Array(freqData, aHistogram);
        
        // draw the spectrum
        var barStep	= this.canvas.width / (iNumBars - iOffsetEnd);
        var barWidth = barStep * 0.8;
        
        //ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        this.ctx.fillStyle = "rgba(231,146,30,0.1)";
        this.ctx.lineCap = "round";
        
        for (var i = 0; i < iNumBars - iOffsetEnd; i++){
            this.ctx.fillRect(i * barStep, (1 - aHistogram[i]) * this.canvas.height, barWidth, this.canvas.height);
        }
    };

    /**
     * This overrides the default setter of the playAudioc property.
     *
     * @param {boolean} bPlayAudio
     * @public
     */
    AudioVis.prototype.setPlay = function(bPlay) {
        if (bPlay === this.getPlay()) {
            return this;
        }
        this.setProperty("play", bPlay, true);

        if (!this._bInitialized) {
            return false;
        }

        // initialize audio on first play
        if (!this.canvas) {
            this._render();
        }
        
        // toggle mute audio
        if (this.lineOut.isMuted === bPlay) {
            this.lineOut.toggleMute();
        }
    };

    return AudioVis;

}, /* bExport= */ true);