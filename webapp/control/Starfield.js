sap.ui.define([
	"sap/ui/core/Control",
	"sap/ui/core/ResizeHandler"
], function(Control, ResizeHandler) {
	"use strict";

	//http://www.kevs3d.co.uk/dev/warpfield/

	var Starfield = Control.extend("de.uniorg.martian.control.Starfield", {

		_bInitialized: false,
		_bStarfieldInitialized: false,

		metadata: {
			properties: {
				width: {
					type: "sap.ui.core.CSSSize",
					group: "Appearance",
					defaultValue: null
				},
				height: {
					type: "sap.ui.core.CSSSize",
					group: "Appearance",
					defaultValue: null
				},
				positionAbsolute: {
					type: "boolean",
					group: "Appearance",
					defaultValue: null
				},
				/**
				 * Background image of the Starfield
				 */
				backgroundImage: {
					type: "sap.ui.core.URI",
					group: "Appearance",
					defaultValue: null
				},
				canvasBackgroundColor: {
					type: "sap.ui.core.CSSColor",
					group: "Appearance",
					defaultValue: "null"
				},
				/**
				 * 2d graphics context global alpha
				 */
				globalAlpha: {
					type: "float",
					group: "Appearance",
					defaultValue: "0.25"
				},
				animate: {
					type: "boolean",
					group: "Misc",
					defaultValue: true
				},
				// add data type to control allowed directions!!!
				direction: {
					type: "string",
					group: "Misc",
					defaultValue: "CENTER"
				}
			},
			events: {}
		},

		renderer: function(oRm, oControl) {
			oRm.write("<div");
			oRm.writeControlData(oControl);
			oRm.addStyle("width", oControl.getWidth());
			oRm.addStyle("height", oControl.getHeight());
			if (oControl.getBackgroundImage()) {
                oRm.addStyle("position", "absolute");
			}
			if (oControl.getBackgroundImage()) {
		        oRm.addStyle("background-image", "url('" + oControl.getBackgroundImage() + "')");
                oRm.addStyle("background-size", "cover");
			}
			oRm.writeClasses();
			oRm.writeStyles();
			oRm.write(">");
			oRm.renderControl(oControl._canvas);
			// viewBox=\"0 0 FORMRATIO FORMRATIO\"
			//oRm.write("<canvas style=\"width:100%;height:100%;\"></canvas>");
			oRm.write("</div>");
		}
	});

	Starfield.prototype.init = function() {
		this._sContainerId = this.getId() + "--starfield2";
		this._canvas = new sap.ui.core.HTML({
			content: "<canvas style='width:100%;height:100%;' id='" + this._sContainerId + "'></canvas>"
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

		// The higher this value, the less the fps will reflect temporary variations
		// A value of 1 will only keep the last value
		var filterStrength = 20;
		var frameTime = 0,
			lastLoop = new Date(),
			thisLoop;

		// initialize canvas
		var that = this,
			$DomNode = this.$(),
			oDomRef = $DomNode[0],
			//$div = this.$()[0],
			$CanvasNode = $("#" + this._sContainerId),
			canvas = $CanvasNode[0],
			ctx = canvas.getContext("2d"),
			width = oDomRef.clientWidth,
			height = oDomRef.clientHeight,
			mousex = width / 2,
			mousey = height / 2,
			portrait = width < height;
			
		this.canvas = canvas;
		that.mouseX = mousex;
		canvas.width = width;
		canvas.height = height;
		
        if (this.getCanvasBackgroundColor()) {
            $CanvasNode.css("background-color", this.getCanvasBackgroundColor());
        }
		
		// get 2d graphics context and set global alpha
		ctx.globalAlpha = this.getGlobalAlpha();

		// setup aliases
		var Rnd = Math.random,
			Sin = Math.sin,
			Floor = Math.floor;

		// constants and storage for objects that represent star positions
		var warpZ = 10, //12,
			units = 256, //500,
			stars = [],
			cycle = 0,
			//Z = 0.025 + (1 / 25 * 2);
			Z = 0.025;

		this.Z = Z;

		// mouse events
		/*
		function addCanvasEventListener(name, fn) {
			canvas.addEventListener(name, fn, false);
		}
		
		addCanvasEventListener("mousemove", function(e) {
		    mousex = e.clientX;
		    mousey = e.clientY;
		});
		
		function fnWwheel(e) {
			var delta = 0;
			if (e.detail) {
				delta = -e.detail / 3;
			} else {
				delta = e.wheelDelta / 120;
			}
			var doff = (delta / 25);
			if (delta > 0 && Z + doff <= 0.5 || delta < 0 && Z + doff >= 0.01) {
				Z += (delta / 25);
				//console.log(delta +" " +Z);
			}
		}
		addCanvasEventListener("DOMMouseScroll", fnWwheel);
		addCanvasEventListener("mousewheel", fnWheel);
		*/

		function fnOrientation(e) {
			if (e.beta !== null && e.gamma !== null) { // alpha [0,360] beta [-180,180] gamma [-90,90]
				var x = e.gamma,
					y = e.beta;

				if (!portrait) {
					x = e.beta * -1;
					y = e.gamma;
				}

				that.mouseX = (width / 2) + (x * 4);
			}
		}
		window.addEventListener("deviceorientation", fnOrientation, false);

		// function to reset a star object
		function resetstar(a) {
			a.x = (Rnd() * width - (width * 0.5)) * warpZ;
			a.y = (Rnd() * height - (height * 0.5)) * warpZ;
			a.z = warpZ;
			a.px = 0;
			a.py = 0;
		}

		// initial star setup
		for (var i = 0, n; i < units; i++) {
			n = {};
			resetstar(n);
			stars.push(n);
		}

		var fnResize = function() {
			width = oDomRef.clientWidth;
			height = oDomRef.clientHeight;
			mousex = width / 2;
			mousey = height / 2;
			portrait = width < height;

			that.mouseX = mousex;
			canvas.width = width;
			canvas.height = height;
			//ctx.scale(lol.pr.w, lol.pr.h);
		};
		this.fnResize = fnResize;

		// star rendering anim function
		var fnRf = function() {
			if (!that.getAnimate()) {
				return;
			}

			// clear background
			ctx.fillStyle = "#000";
			//ctx.fillStyle = "rgba(0,0,0,0.5)";
			//ctx.fillRect(0, 0, width, height);
			ctx.clearRect(0, 0, width, height); /* clear viewport */

			// mouse position to head towards
			var ms = that.mouseStep;
			mousex = that.mouseX;
			Z = that.Z;

			var cx = (mousex - width / 2) + (width / 2),
				cy = (mousey - height / 2) + (height / 2);

			that.mouseStep -= 0.1;

			// update all stars
			var sat = Floor(Z * 500); // Z range 0.01 -> 0.5
			if (sat > 100) sat = 100;
			for (i = 0; i < units; i++) {
				var n = stars[i], // the star
					xx = n.x / n.z, // star position
					yy = n.y / n.z,
					e = (1.0 / n.z + 1) * 2; // size i.e. z

				if (n.px !== 0) {
					// hsl colour from a sine wave
					ctx.strokeStyle = "hsl(" + ((cycle * i) % 360) + "," + sat + "%,80%)";
					ctx.lineWidth = e;
					ctx.beginPath();
					ctx.moveTo(xx + cx, yy + cy);
					ctx.lineTo(n.px + cx, n.py + cy);
					ctx.stroke();
				}

				// update star position values with new settings
				n.px = xx;
				n.py = yy;
				n.z -= Z;

				// reset when star is out of the view field
				if (n.z < Z || n.px > width || n.py > height) {
					// reset star
					resetstar(n);
				}
			}

			// colour cycle sinewave rotation
			cycle += 0.01;

			// calc FPS
			var thisFrameTime = (thisLoop = new Date()) - lastLoop;
			frameTime += (thisFrameTime - frameTime) / filterStrength;
			lastLoop = thisLoop;

			ctx.font = "12px Arial";
			ctx.fillStyle = "#fff";
			var sInfo = (1000 / frameTime).toFixed(1) + " fps (" + window.sap.ui.version + ")";
			ctx.fillText(sInfo, 8, height - 8);

			window.requestAnimationFrame(fnRf);
		};

		this.animate = fnRf;

		// start animation loop
		window.requestAnimationFrame(this.animate);

		//lol.direction = "CENTER";

		this._bStarfieldInitialized = true;
	};

	/**
	 * This overrides the default setter of the direction property.
	 *
	 * @param {string} sDirection
	 * @public
	 */
	Starfield.prototype.setDirection = function(sDirection) {
		var _sDirection = sDirection.toUpperCase();

		if (_sDirection === this.getDirection()) {
			return this;
		}
		this.setProperty("direction", _sDirection, true);

		if (_sDirection === "LEFT") {
			this.mouseX = 0;
			this.mouseStep = 1;
			this.Z = 0.08;
		} else if (_sDirection === "RIGHT") {
			this.mouseX = this.canvas.width;
			this.mouseStep = 1;
			this.Z = 0.08;
		} else if (_sDirection === "CENTER") {
			this.mouseX = this.canvas.width / 2;
			this.mouseStep = 0;
			this.Z = 0.025;
		}
		//lol.direction = sDirection;
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
				// start animation loop
				window.requestAnimationFrame(this.animate);
			}
		}
	};

	Starfield.prototype.onResize = function() {
		this.fnResize();
	};

	Starfield.prototype.exit = function() {
		//this._Starfield.destroy();
	};

	return Starfield;

}, /* bExport= */ true);