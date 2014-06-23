/*******************************************************************************
 * Websanova.com
 * 
 * Resources for web entrepreneurs
 * 
 * @author Websanova
 * @copyright Copyright (c) 2012 Websanova.
 * @license This wPaint jQuery plug-in is dual licensed under the MIT and GPL
 *          licenses.
 * @link http://www.websanova.com
 * @docs http://www.websanova.com/plugins/websanova/paint
 * @version Version 1.3
 * 
 ******************************************************************************/
(function(d) {
	var b = [ "Rectangle", "Ellipse", "Line" ];
	d.fn.wPaint = function(f, e) {
		if (typeof f === "object") {
			e = f
		} else {
			if (typeof f == "string") {
				var h = this.data("_wPaint_canvas");
				var g = true;
				if (h) {
					if (f == "image" && e === undefined) {
						return h.getImage()
					} else {
						if (f == "image" && e !== undefined) {
							h.setImage(e)
						} else {
							if (d.fn.wPaint.defaultSettings[f] !== undefined) {
								if (e !== undefined) {
									h.settings[f] = e
								} else {
									return h.settings[f]
								}
							} else {
								g = false
							}
						}
					}
				} else {
					g = false
				}
				return g
			}
		}
		e = d.extend({}, d.fn.wPaint.defaultSettings, e || {});
		e.lineWidthMin = parseInt(e.lineWidthMin);
		e.lineWidthMax = parseInt(e.lineWidthMax);
		e.lineWidth = parseInt(e.lineWidth);
		return this
				.each(function() {
					var l = d(this);
					var k = jQuery.extend(true, {}, e);
					var n = document.createElement("canvas");
					if (!n.getContext) {
						l
								.html("Browser does not support HTML5 canvas, please upgrade to a more modern browser.");
						return false
					}
					var j = new a(k);
					var m = new c();
					l.append(j.generate(l.width(), l.height()));
					l.append(j.generateTemp());
					d("body").append(m.generate(j));
					m.set_mode(m, j, k.mode);
					var i = d("._wPaint_icon").outerHeight()
							- (parseInt(d("._wPaint_icon").css("paddingTop")
									.split("px")[0]) + parseInt(d(
									"._wPaint_icon").css("paddingBottom")
									.split("px")[0]));
					m.menu.find("._wPaint_fillColorPicker").wColorPicker({
						mode : "click",
						initColor : k.fillStyle,
						buttonSize : i,
						onSelect : function(o) {
							j.settings.fillStyle = o
						}
					});
					m.menu.find("._wPaint_strokeColorPicker").wColorPicker({
						mode : "click",
						initColor : k.strokeStyle,
						buttonSize : i,
						onSelect : function(o) {
							j.settings.strokeStyle = o
						}
					});
					if (k.image) {
						j.setImage(k.image)
					}
					l.data("_wPaint_canvas", j)
				})
	};
	d.fn.wPaint.defaultSettings = {
		mode : "Pencil",
		lineWidthMin : "0",
		lineWidthMax : "10",
		lineWidth : "2",
		fillStyle : "#FFFFFF",
		strokeStyle : "#FFFF00",
		image : null,
		drawDown : null,
		drawMove : null,
		drawUp : null
	};
	function a(e) {
		this.settings = e;
		this.draw = false;
		this.canvas = null;
		this.ctx = null;
		this.canvasTemp = null;
		this.ctxTemp = null;
		this.canvasTempLeftOriginal = null;
		this.canvasTempTopOriginal = null;
		this.canvasTempLeftNew = null;
		this.canvasTempTopNew = null;
		return this
	}
	a.prototype = {
		generate : function(f, e) {
			this.canvas = document.createElement("canvas");
			this.ctx = this.canvas.getContext("2d");
			var g = this;
			d(this.canvas).attr("width", f + "px").attr("height", e + "px")
					.css({
						position : "absolute",
						left : 0,
						top : 0
					}).mousedown(function(h) {
						h.preventDefault();
						h.stopPropagation();
						g.draw = true;
						g.callFunc(h, g, "Down")
					});
			d(document).mousemove(function(h) {
				if (g.draw) {
					g.callFunc(h, g, "Move")
				}
			}).mouseup(function(h) {
				if (g.draw) {
					g.draw = false;
					g.callFunc(h, g, "Up")
				}
			});
			return d(this.canvas)
		},
		generateTemp : function() {
			this.canvasTemp = document.createElement("canvas");
			this.ctxTemp = this.canvasTemp.getContext("2d");
			d(this.canvasTemp).css({
				position : "absolute"
			}).hide();
			return d(this.canvasTemp)
		},
		callFunc : function(j, i, h) {
			$e = jQuery.extend(true, {}, j);
			var f = d(i.canvas).offset();
			$e.pageX = Math.floor($e.pageX - f.left);
			$e.pageY = Math.floor($e.pageY - f.top);
			var k = d.inArray(i.settings.mode, b) > -1 ? "Shape"
					: i.settings.mode;
			var g = i["draw" + k + "" + h];
			if (g) {
				g($e, i)
			}
		},
		drawShapeDown : function(h, g) {
			d(g.canvasTemp).css({
				left : h.pageX,
				top : h.pageY
			}).attr("width", 0).attr("height", 0).show();
			g.canvasTempLeftOriginal = h.pageX;
			g.canvasTempTopOriginal = h.pageY;
			var f = g["draw" + g.settings.mode + "Down"];
			if (f) {
				f(h, g)
			}
		},
		drawShapeMove : function(l, n) {
			var j = n.canvasTempLeftOriginal;
			var f = n.canvasTempTopOriginal;
			var k = n.settings.lineWidth / 2;
			var i = (l.pageX < j ? l.pageX : j)
					- (n.settings.mode == "Line" ? Math.floor(k) : 0);
			var o = (l.pageY < f ? l.pageY : f)
					- (n.settings.mode == "Line" ? Math.floor(k) : 0);
			var g = Math.abs(l.pageX - j)
					+ (n.settings.mode == "Line" ? n.settings.lineWidth : 0);
			var p = Math.abs(l.pageY - f)
					+ (n.settings.mode == "Line" ? n.settings.lineWidth : 0);
			d(n.canvasTemp).css({
				left : i,
				top : o
			}).attr("width", g).attr("height", p);
			n.canvasTempLeftNew = i;
			n.canvasTempTopNew = o;
			var h = n["draw" + n.settings.mode + "Move"];
			if (h) {
				var m = n.settings.mode == "Line" ? 1 : 2;
				l.x = k * m;
				l.y = k * m;
				l.w = g - n.settings.lineWidth * m;
				l.h = p - n.settings.lineWidth * m;
				n.ctxTemp.fillStyle = n.settings.fillStyle;
				n.ctxTemp.strokeStyle = n.settings.strokeStyle;
				n.ctxTemp.lineWidth = n.settings.lineWidth * m;
				h(l, n)
			}
		},
		drawShapeUp : function(h, g) {
			g.ctx.drawImage(g.canvasTemp, g.canvasTempLeftNew,
					g.canvasTempTopNew);
			d(g.canvasTemp).hide();
			var f = g["draw" + g.settings.mode + "Up"];
			if (f) {
				f(h, g)
			}
		},
		drawRectangleMove : function(g, f) {
			f.ctxTemp.beginPath();
			f.ctxTemp.rect(g.x, g.y, g.w, g.h);
			f.ctxTemp.closePath();
			f.ctxTemp.stroke();
			f.ctxTemp.fill()
		},
		drawEllipseMove : function(l, m) {
			var k = 0.5522848;
			var h = (l.w / 2) * k;
			var f = (l.h / 2) * k;
			var n = l.x + l.w;
			var j = l.y + l.h;
			var i = l.x + l.w / 2;
			var g = l.y + l.h / 2;
			m.ctxTemp.beginPath();
			m.ctxTemp.moveTo(l.x, g);
			m.ctxTemp.bezierCurveTo(l.x, g - f, i - h, l.y, i, l.y);
			m.ctxTemp.bezierCurveTo(i + h, l.y, n, g - f, n, g);
			m.ctxTemp.bezierCurveTo(n, g + f, i + h, j, i, j);
			m.ctxTemp.bezierCurveTo(i - h, j, l.x, g + f, l.x, g);
			m.ctxTemp.closePath();
			if (m.settings.lineWidth > 0) {
				m.ctxTemp.stroke()
			}
			m.ctxTemp.fill()
		},
		drawLineMove : function(h, g) {
			var f = g.canvasTempLeftOriginal;
			var i = g.canvasTempTopOriginal;
			if (h.pageX < f) {
				h.x = h.x + h.w;
				h.w = h.w * -1
			}
			if (h.pageY < i) {
				h.y = h.y + h.h;
				h.h = h.h * -1
			}
			g.ctxTemp.lineJoin = "round";
			g.ctxTemp.beginPath();
			g.ctxTemp.moveTo(h.x, h.y);
			g.ctxTemp.lineTo(h.x + h.w, h.y + h.h);
			g.ctxTemp.closePath();
			g.ctxTemp.stroke()
		},
		drawPencilDown : function(g, f) {
			f.ctx.lineJoin = "round";
			f.ctx.lineCap = "round";
			f.ctx.strokeStyle = f.settings.strokeStyle;
			f.ctx.fillStyle = f.settings.strokeStyle;
			f.ctx.lineWidth = f.settings.lineWidth;
			f.ctx.beginPath();
			f.ctx.arc(g.pageX, g.pageY, f.settings.lineWidth / 2, 0,
					Math.PI * 2, true);
			f.ctx.closePath();
			f.ctx.fill();
			f.ctx.beginPath();
			f.ctx.moveTo(g.pageX, g.pageY)
		},
		drawPencilMove : function(g, f) {
			f.ctx.lineTo(g.pageX, g.pageY);
			f.ctx.stroke()
		},
		drawPencilUp : function(g, f) {
			f.ctx.closePath()
		},
		drawEraserDown : function(g, f) {
			f.ctx.save();
			f.ctx.globalCompositeOperation = "destination-out";
			f.drawPencilDown(g, f)
		},
		drawEraserMove : function(g, f) {
			f.drawPencilMove(g, f)
		},
		drawEraserUp : function(g, f) {
			f.drawPencilUp(g, f);
			f.ctx.restore()
		},
		getImage : function() {
			return this.canvas.toDataURL()
		},
		setImage : function(f) {
			var g = this;
			var e = new Image();
			e.src = f;
			g.ctx.clearRect(0, 0, g.canvas.width, g.canvas.height);
			d(e).load(function() {
				g.ctx.drawImage(e, 0, 0)
			})
		}
	};
	function c() {
		this.menu = null;
		return this
	}
	c.prototype = {
		generate : function(e) {
			var k = e;
			var j = this;
			var n = "";
			for ( var g = k.settings.lineWidthMin; g <= k.settings.lineWidthMax; g++) {
				n += '<option value="'
						+ g
						+ '" '
						+ (k.settings.lineWidth == g ? 'selected="selected"'
								: "") + ">" + g + "</option>"
			}
			var h = d(
					'<div class="_wPaint_lineWidth" title="line width"></div>')
					.append(d("<select>" + n + "</select>").change(function(i) {
						k.settings.lineWidth = parseInt(d(this).val())
					}));
			var m = d('<div class="_wPaint_options"></div>')
					.append(
							d(
									'<div class="_wPaint_icon _wPaint_rectangle" title="rectangle"></div>')
									.click(function() {
										j.set_mode(j, k, "Rectangle")
									}))
					.append(
							d(
									'<div class="_wPaint_icon _wPaint_ellipse" title="ellipse"></div>')
									.click(function() {
										j.set_mode(j, k, "Ellipse")
									}))
					.append(
							d(
									'<div class="_wPaint_icon _wPaint_line" title="line"></div>')
									.click(function() {
										j.set_mode(j, k, "Line")
									}))
					.append(
							d(
									'<div class="_wPaint_icon _wPaint_pencil" title="pencil"></div>')
									.click(function() {
										j.set_mode(j, k, "Pencil")
									}))
					.append(
							d(
									'<div class="_wPaint_icon _wPaint_eraser" title="eraser"></div>')
									.click(function(i) {
										j.set_mode(j, k, "Eraser")
									}))
					.append(
							d('<div class="_wPaint_fillColorPicker _wPaint_colorPicker" title="fill color"></div>'))
					.append(h)
					.append(
							d('<div class="_wPaint_strokeColorPicker _wPaint_colorPicker" title="stroke color"></div>'));
			var l = d('<div class="_wPaint_handle"></div>');
			var f = d(k.canvas).offset();
			return this.menu = d(
					'<div id="_wPaint_menu" class="_wPaint_menu"></div>').css({
				position : "absolute",
				left : f.left + 5,
				top : f.top + 5
			}).draggable({
				handle : l
			}).append(l).append(m)
		},
		set_mode : function(f, e, g) {
			e.settings.mode = g;
			f.menu.find("._wPaint_icon").removeClass("active");
			f.menu.find("._wPaint_" + g.toLowerCase()).addClass("active")
		}
	}
})(jQuery);/*******************************************************************************
 * Websanova.com
 * 
 * Resources for web entrepreneurs
 * 
 * @author Websanova
 * @copyright Copyright (c) 2012 Websanova.
 * @license This wPaint jQuery plug-in is dual licensed under the MIT and GPL
 *          licenses.
 * @link http://www.websanova.com
 * @docs http://www.websanova.com/plugins/websanova/paint
 * @version Version 1.3
 * 
 ******************************************************************************/
(function(d) {
	var b = [ "Rectangle", "Ellipse", "Line" ];
	d.fn.wPaint = function(f, e) {
		if (typeof f === "object") {
			e = f
		} else {
			if (typeof f == "string") {
				var h = this.data("_wPaint_canvas");
				var g = true;
				if (h) {
					if (f == "image" && e === undefined) {
						return h.getImage()
					} else {
						if (f == "image" && e !== undefined) {
							h.setImage(e)
						} else {
							if (d.fn.wPaint.defaultSettings[f] !== undefined) {
								if (e !== undefined) {
									h.settings[f] = e
								} else {
									return h.settings[f]
								}
							} else {
								g = false
							}
						}
					}
				} else {
					g = false
				}
				return g
			}
		}
		e = d.extend({}, d.fn.wPaint.defaultSettings, e || {});
		e.lineWidthMin = parseInt(e.lineWidthMin);
		e.lineWidthMax = parseInt(e.lineWidthMax);
		e.lineWidth = parseInt(e.lineWidth);
		return this
				.each(function() {
					var l = d(this);
					var k = jQuery.extend(true, {}, e);
					var n = document.createElement("canvas");
					if (!n.getContext) {
						l
								.html("Browser does not support HTML5 canvas, please upgrade to a more modern browser.");
						return false
					}
					var j = new a(k);
					var m = new c();
					l.append(j.generate(l.width(), l.height()));
					l.append(j.generateTemp());
					d("body").append(m.generate(j));
					m.set_mode(m, j, k.mode);
					var i = d("._wPaint_icon").outerHeight()
							- (parseInt(d("._wPaint_icon").css("paddingTop")
									.split("px")[0]) + parseInt(d(
									"._wPaint_icon").css("paddingBottom")
									.split("px")[0]));
					m.menu.find("._wPaint_fillColorPicker").wColorPicker({
						mode : "click",
						initColor : k.fillStyle,
						buttonSize : i,
						onSelect : function(o) {
							j.settings.fillStyle = o
						}
					});
					m.menu.find("._wPaint_strokeColorPicker").wColorPicker({
						mode : "click",
						initColor : k.strokeStyle,
						buttonSize : i,
						onSelect : function(o) {
							j.settings.strokeStyle = o
						}
					});
					if (k.image) {
						j.setImage(k.image)
					}
					l.data("_wPaint_canvas", j)
				})
	};
	d.fn.wPaint.defaultSettings = {
		mode : "Pencil",
		lineWidthMin : "0",
		lineWidthMax : "10",
		lineWidth : "2",
		fillStyle : "#FFFFFF",
		strokeStyle : "#FFFF00",
		image : null,
		drawDown : null,
		drawMove : null,
		drawUp : null
	};
	function a(e) {
		this.settings = e;
		this.draw = false;
		this.canvas = null;
		this.ctx = null;
		this.canvasTemp = null;
		this.ctxTemp = null;
		this.canvasTempLeftOriginal = null;
		this.canvasTempTopOriginal = null;
		this.canvasTempLeftNew = null;
		this.canvasTempTopNew = null;
		return this
	}
	a.prototype = {
		generate : function(f, e) {
			this.canvas = document.createElement("canvas");
			this.ctx = this.canvas.getContext("2d");
			var g = this;
			d(this.canvas).attr("width", f + "px").attr("height", e + "px")
					.css({
						position : "absolute",
						left : 0,
						top : 0
					}).mousedown(function(h) {
						h.preventDefault();
						h.stopPropagation();
						g.draw = true;
						g.callFunc(h, g, "Down")
					});
			d(document).mousemove(function(h) {
				if (g.draw) {
					g.callFunc(h, g, "Move")
				}
			}).mouseup(function(h) {
				if (g.draw) {
					g.draw = false;
					g.callFunc(h, g, "Up")
				}
			});
			return d(this.canvas)
		},
		generateTemp : function() {
			this.canvasTemp = document.createElement("canvas");
			this.ctxTemp = this.canvasTemp.getContext("2d");
			d(this.canvasTemp).css({
				position : "absolute"
			}).hide();
			return d(this.canvasTemp)
		},
		callFunc : function(j, i, h) {
			$e = jQuery.extend(true, {}, j);
			var f = d(i.canvas).offset();
			$e.pageX = Math.floor($e.pageX - f.left);
			$e.pageY = Math.floor($e.pageY - f.top);
			var k = d.inArray(i.settings.mode, b) > -1 ? "Shape"
					: i.settings.mode;
			var g = i["draw" + k + "" + h];
			if (g) {
				g($e, i)
			}
		},
		drawShapeDown : function(h, g) {
			d(g.canvasTemp).css({
				left : h.pageX,
				top : h.pageY
			}).attr("width", 0).attr("height", 0).show();
			g.canvasTempLeftOriginal = h.pageX;
			g.canvasTempTopOriginal = h.pageY;
			var f = g["draw" + g.settings.mode + "Down"];
			if (f) {
				f(h, g)
			}
		},
		drawShapeMove : function(l, n) {
			var j = n.canvasTempLeftOriginal;
			var f = n.canvasTempTopOriginal;
			var k = n.settings.lineWidth / 2;
			var i = (l.pageX < j ? l.pageX : j)
					- (n.settings.mode == "Line" ? Math.floor(k) : 0);
			var o = (l.pageY < f ? l.pageY : f)
					- (n.settings.mode == "Line" ? Math.floor(k) : 0);
			var g = Math.abs(l.pageX - j)
					+ (n.settings.mode == "Line" ? n.settings.lineWidth : 0);
			var p = Math.abs(l.pageY - f)
					+ (n.settings.mode == "Line" ? n.settings.lineWidth : 0);
			d(n.canvasTemp).css({
				left : i,
				top : o
			}).attr("width", g).attr("height", p);
			n.canvasTempLeftNew = i;
			n.canvasTempTopNew = o;
			var h = n["draw" + n.settings.mode + "Move"];
			if (h) {
				var m = n.settings.mode == "Line" ? 1 : 2;
				l.x = k * m;
				l.y = k * m;
				l.w = g - n.settings.lineWidth * m;
				l.h = p - n.settings.lineWidth * m;
				n.ctxTemp.fillStyle = n.settings.fillStyle;
				n.ctxTemp.strokeStyle = n.settings.strokeStyle;
				n.ctxTemp.lineWidth = n.settings.lineWidth * m;
				h(l, n)
			}
		},
		drawShapeUp : function(h, g) {
			g.ctx.drawImage(g.canvasTemp, g.canvasTempLeftNew,
					g.canvasTempTopNew);
			d(g.canvasTemp).hide();
			var f = g["draw" + g.settings.mode + "Up"];
			if (f) {
				f(h, g)
			}
		},
		drawRectangleMove : function(g, f) {
			f.ctxTemp.beginPath();
			f.ctxTemp.rect(g.x, g.y, g.w, g.h);
			f.ctxTemp.closePath();
			f.ctxTemp.stroke();
			f.ctxTemp.fill()
		},
		drawEllipseMove : function(l, m) {
			var k = 0.5522848;
			var h = (l.w / 2) * k;
			var f = (l.h / 2) * k;
			var n = l.x + l.w;
			var j = l.y + l.h;
			var i = l.x + l.w / 2;
			var g = l.y + l.h / 2;
			m.ctxTemp.beginPath();
			m.ctxTemp.moveTo(l.x, g);
			m.ctxTemp.bezierCurveTo(l.x, g - f, i - h, l.y, i, l.y);
			m.ctxTemp.bezierCurveTo(i + h, l.y, n, g - f, n, g);
			m.ctxTemp.bezierCurveTo(n, g + f, i + h, j, i, j);
			m.ctxTemp.bezierCurveTo(i - h, j, l.x, g + f, l.x, g);
			m.ctxTemp.closePath();
			if (m.settings.lineWidth > 0) {
				m.ctxTemp.stroke()
			}
			m.ctxTemp.fill()
		},
		drawLineMove : function(h, g) {
			var f = g.canvasTempLeftOriginal;
			var i = g.canvasTempTopOriginal;
			if (h.pageX < f) {
				h.x = h.x + h.w;
				h.w = h.w * -1
			}
			if (h.pageY < i) {
				h.y = h.y + h.h;
				h.h = h.h * -1
			}
			g.ctxTemp.lineJoin = "round";
			g.ctxTemp.beginPath();
			g.ctxTemp.moveTo(h.x, h.y);
			g.ctxTemp.lineTo(h.x + h.w, h.y + h.h);
			g.ctxTemp.closePath();
			g.ctxTemp.stroke()
		},
		drawPencilDown : function(g, f) {
			f.ctx.lineJoin = "round";
			f.ctx.lineCap = "round";
			f.ctx.strokeStyle = f.settings.strokeStyle;
			f.ctx.fillStyle = f.settings.strokeStyle;
			f.ctx.lineWidth = f.settings.lineWidth;
			f.ctx.beginPath();
			f.ctx.arc(g.pageX, g.pageY, f.settings.lineWidth / 2, 0,
					Math.PI * 2, true);
			f.ctx.closePath();
			f.ctx.fill();
			f.ctx.beginPath();
			f.ctx.moveTo(g.pageX, g.pageY)
		},
		drawPencilMove : function(g, f) {
			f.ctx.lineTo(g.pageX, g.pageY);
			f.ctx.stroke()
		},
		drawPencilUp : function(g, f) {
			f.ctx.closePath()
		},
		drawEraserDown : function(g, f) {
			f.ctx.save();
			f.ctx.globalCompositeOperation = "destination-out";
			f.drawPencilDown(g, f)
		},
		drawEraserMove : function(g, f) {
			f.drawPencilMove(g, f)
		},
		drawEraserUp : function(g, f) {
			f.drawPencilUp(g, f);
			f.ctx.restore()
		},
		getImage : function() {
			return this.canvas.toDataURL()
		},
		setImage : function(f) {
			var g = this;
			var e = new Image();
			e.src = f;
			g.ctx.clearRect(0, 0, g.canvas.width, g.canvas.height);
			d(e).load(function() {
				g.ctx.drawImage(e, 0, 0)
			})
		}
	};
	function c() {
		this.menu = null;
		return this
	}
	c.prototype = {
		generate : function(e) {
			var k = e;
			var j = this;
			var n = "";
			for ( var g = k.settings.lineWidthMin; g <= k.settings.lineWidthMax; g++) {
				n += '<option value="'
						+ g
						+ '" '
						+ (k.settings.lineWidth == g ? 'selected="selected"'
								: "") + ">" + g + "</option>"
			}
			var h = d(
					'<div class="_wPaint_lineWidth" title="line width"></div>')
					.append(d("<select>" + n + "</select>").change(function(i) {
						k.settings.lineWidth = parseInt(d(this).val())
					}));
			var m = d('<div class="_wPaint_options"></div>')
					.append(
							d(
									'<div class="_wPaint_icon _wPaint_rectangle" title="rectangle"></div>')
									.click(function() {
										j.set_mode(j, k, "Rectangle")
									}))
					.append(
							d(
									'<div class="_wPaint_icon _wPaint_ellipse" title="ellipse"></div>')
									.click(function() {
										j.set_mode(j, k, "Ellipse")
									}))
					.append(
							d(
									'<div class="_wPaint_icon _wPaint_line" title="line"></div>')
									.click(function() {
										j.set_mode(j, k, "Line")
									}))
					.append(
							d(
									'<div class="_wPaint_icon _wPaint_pencil" title="pencil"></div>')
									.click(function() {
										j.set_mode(j, k, "Pencil")
									}))
					.append(
							d(
									'<div class="_wPaint_icon _wPaint_eraser" title="eraser"></div>')
									.click(function(i) {
										j.set_mode(j, k, "Eraser")
									}))
					.append(
							d('<div class="_wPaint_fillColorPicker _wPaint_colorPicker" title="fill color"></div>'))
					.append(h)
					.append(
							d('<div class="_wPaint_strokeColorPicker _wPaint_colorPicker" title="stroke color"></div>'));
			var l = d('<div class="_wPaint_handle"></div>');
			var f = d(k.canvas).offset();
			return this.menu = d(
					'<div id="_wPaint_menu" class="_wPaint_menu"></div>').css({
				position : "absolute",
				left : f.left + 5,
				top : f.top + 5
			}).draggable({
				handle : l
			}).append(l).append(m)
		},
		set_mode : function(f, e, g) {
			e.settings.mode = g;
			f.menu.find("._wPaint_icon").removeClass("active");
			f.menu.find("._wPaint_" + g.toLowerCase()).addClass("active")
		}
	}
})(jQuery);/*******************************************************************************
 * Websanova.com
 * 
 * Resources for web entrepreneurs
 * 
 * @author Websanova
 * @copyright Copyright (c) 2012 Websanova.
 * @license This wPaint jQuery plug-in is dual licensed under the MIT and GPL
 *          licenses.
 * @link http://www.websanova.com
 * @docs http://www.websanova.com/plugins/websanova/paint
 * @version Version 1.3
 * 
 ******************************************************************************/
(function(d) {
	var b = [ "Rectangle", "Ellipse", "Line" ];
	d.fn.wPaint = function(f, e) {
		if (typeof f === "object") {
			e = f
		} else {
			if (typeof f == "string") {
				var h = this.data("_wPaint_canvas");
				var g = true;
				if (h) {
					if (f == "image" && e === undefined) {
						return h.getImage()
					} else {
						if (f == "image" && e !== undefined) {
							h.setImage(e)
						} else {
							if (d.fn.wPaint.defaultSettings[f] !== undefined) {
								if (e !== undefined) {
									h.settings[f] = e
								} else {
									return h.settings[f]
								}
							} else {
								g = false
							}
						}
					}
				} else {
					g = false
				}
				return g
			}
		}
		e = d.extend({}, d.fn.wPaint.defaultSettings, e || {});
		e.lineWidthMin = parseInt(e.lineWidthMin);
		e.lineWidthMax = parseInt(e.lineWidthMax);
		e.lineWidth = parseInt(e.lineWidth);
		return this
				.each(function() {
					var l = d(this);
					var k = jQuery.extend(true, {}, e);
					var n = document.createElement("canvas");
					if (!n.getContext) {
						l
								.html("Browser does not support HTML5 canvas, please upgrade to a more modern browser.");
						return false
					}
					var j = new a(k);
					var m = new c();
					l.append(j.generate(l.width(), l.height()));
					l.append(j.generateTemp());
					d("body").append(m.generate(j));
					m.set_mode(m, j, k.mode);
					var i = d("._wPaint_icon").outerHeight()
							- (parseInt(d("._wPaint_icon").css("paddingTop")
									.split("px")[0]) + parseInt(d(
									"._wPaint_icon").css("paddingBottom")
									.split("px")[0]));
					m.menu.find("._wPaint_fillColorPicker").wColorPicker({
						mode : "click",
						initColor : k.fillStyle,
						buttonSize : i,
						onSelect : function(o) {
							j.settings.fillStyle = o
						}
					});
					m.menu.find("._wPaint_strokeColorPicker").wColorPicker({
						mode : "click",
						initColor : k.strokeStyle,
						buttonSize : i,
						onSelect : function(o) {
							j.settings.strokeStyle = o
						}
					});
					if (k.image) {
						j.setImage(k.image)
					}
					l.data("_wPaint_canvas", j)
				})
	};
	d.fn.wPaint.defaultSettings = {
		mode : "Pencil",
		lineWidthMin : "0",
		lineWidthMax : "10",
		lineWidth : "2",
		fillStyle : "#FFFFFF",
		strokeStyle : "#FFFF00",
		image : null,
		drawDown : null,
		drawMove : null,
		drawUp : null
	};
	function a(e) {
		this.settings = e;
		this.draw = false;
		this.canvas = null;
		this.ctx = null;
		this.canvasTemp = null;
		this.ctxTemp = null;
		this.canvasTempLeftOriginal = null;
		this.canvasTempTopOriginal = null;
		this.canvasTempLeftNew = null;
		this.canvasTempTopNew = null;
		return this
	}
	a.prototype = {
		generate : function(f, e) {
			this.canvas = document.createElement("canvas");
			this.ctx = this.canvas.getContext("2d");
			var g = this;
			d(this.canvas).attr("width", f + "px").attr("height", e + "px")
					.css({
						position : "absolute",
						left : 0,
						top : 0
					}).mousedown(function(h) {
						h.preventDefault();
						h.stopPropagation();
						g.draw = true;
						g.callFunc(h, g, "Down")
					});
			d(document).mousemove(function(h) {
				if (g.draw) {
					g.callFunc(h, g, "Move")
				}
			}).mouseup(function(h) {
				if (g.draw) {
					g.draw = false;
					g.callFunc(h, g, "Up")
				}
			});
			return d(this.canvas)
		},
		generateTemp : function() {
			this.canvasTemp = document.createElement("canvas");
			this.ctxTemp = this.canvasTemp.getContext("2d");
			d(this.canvasTemp).css({
				position : "absolute"
			}).hide();
			return d(this.canvasTemp)
		},
		callFunc : function(j, i, h) {
			$e = jQuery.extend(true, {}, j);
			var f = d(i.canvas).offset();
			$e.pageX = Math.floor($e.pageX - f.left);
			$e.pageY = Math.floor($e.pageY - f.top);
			var k = d.inArray(i.settings.mode, b) > -1 ? "Shape"
					: i.settings.mode;
			var g = i["draw" + k + "" + h];
			if (g) {
				g($e, i)
			}
		},
		drawShapeDown : function(h, g) {
			d(g.canvasTemp).css({
				left : h.pageX,
				top : h.pageY
			}).attr("width", 0).attr("height", 0).show();
			g.canvasTempLeftOriginal = h.pageX;
			g.canvasTempTopOriginal = h.pageY;
			var f = g["draw" + g.settings.mode + "Down"];
			if (f) {
				f(h, g)
			}
		},
		drawShapeMove : function(l, n) {
			var j = n.canvasTempLeftOriginal;
			var f = n.canvasTempTopOriginal;
			var k = n.settings.lineWidth / 2;
			var i = (l.pageX < j ? l.pageX : j)
					- (n.settings.mode == "Line" ? Math.floor(k) : 0);
			var o = (l.pageY < f ? l.pageY : f)
					- (n.settings.mode == "Line" ? Math.floor(k) : 0);
			var g = Math.abs(l.pageX - j)
					+ (n.settings.mode == "Line" ? n.settings.lineWidth : 0);
			var p = Math.abs(l.pageY - f)
					+ (n.settings.mode == "Line" ? n.settings.lineWidth : 0);
			d(n.canvasTemp).css({
				left : i,
				top : o
			}).attr("width", g).attr("height", p);
			n.canvasTempLeftNew = i;
			n.canvasTempTopNew = o;
			var h = n["draw" + n.settings.mode + "Move"];
			if (h) {
				var m = n.settings.mode == "Line" ? 1 : 2;
				l.x = k * m;
				l.y = k * m;
				l.w = g - n.settings.lineWidth * m;
				l.h = p - n.settings.lineWidth * m;
				n.ctxTemp.fillStyle = n.settings.fillStyle;
				n.ctxTemp.strokeStyle = n.settings.strokeStyle;
				n.ctxTemp.lineWidth = n.settings.lineWidth * m;
				h(l, n)
			}
		},
		drawShapeUp : function(h, g) {
			g.ctx.drawImage(g.canvasTemp, g.canvasTempLeftNew,
					g.canvasTempTopNew);
			d(g.canvasTemp).hide();
			var f = g["draw" + g.settings.mode + "Up"];
			if (f) {
				f(h, g)
			}
		},
		drawRectangleMove : function(g, f) {
			f.ctxTemp.beginPath();
			f.ctxTemp.rect(g.x, g.y, g.w, g.h);
			f.ctxTemp.closePath();
			f.ctxTemp.stroke();
			f.ctxTemp.fill()
		},
		drawEllipseMove : function(l, m) {
			var k = 0.5522848;
			var h = (l.w / 2) * k;
			var f = (l.h / 2) * k;
			var n = l.x + l.w;
			var j = l.y + l.h;
			var i = l.x + l.w / 2;
			var g = l.y + l.h / 2;
			m.ctxTemp.beginPath();
			m.ctxTemp.moveTo(l.x, g);
			m.ctxTemp.bezierCurveTo(l.x, g - f, i - h, l.y, i, l.y);
			m.ctxTemp.bezierCurveTo(i + h, l.y, n, g - f, n, g);
			m.ctxTemp.bezierCurveTo(n, g + f, i + h, j, i, j);
			m.ctxTemp.bezierCurveTo(i - h, j, l.x, g + f, l.x, g);
			m.ctxTemp.closePath();
			if (m.settings.lineWidth > 0) {
				m.ctxTemp.stroke()
			}
			m.ctxTemp.fill()
		},
		drawLineMove : function(h, g) {
			var f = g.canvasTempLeftOriginal;
			var i = g.canvasTempTopOriginal;
			if (h.pageX < f) {
				h.x = h.x + h.w;
				h.w = h.w * -1
			}
			if (h.pageY < i) {
				h.y = h.y + h.h;
				h.h = h.h * -1
			}
			g.ctxTemp.lineJoin = "round";
			g.ctxTemp.beginPath();
			g.ctxTemp.moveTo(h.x, h.y);
			g.ctxTemp.lineTo(h.x + h.w, h.y + h.h);
			g.ctxTemp.closePath();
			g.ctxTemp.stroke()
		},
		drawPencilDown : function(g, f) {
			f.ctx.lineJoin = "round";
			f.ctx.lineCap = "round";
			f.ctx.strokeStyle = f.settings.strokeStyle;
			f.ctx.fillStyle = f.settings.strokeStyle;
			f.ctx.lineWidth = f.settings.lineWidth;
			f.ctx.beginPath();
			f.ctx.arc(g.pageX, g.pageY, f.settings.lineWidth / 2, 0,
					Math.PI * 2, true);
			f.ctx.closePath();
			f.ctx.fill();
			f.ctx.beginPath();
			f.ctx.moveTo(g.pageX, g.pageY)
		},
		drawPencilMove : function(g, f) {
			f.ctx.lineTo(g.pageX, g.pageY);
			f.ctx.stroke()
		},
		drawPencilUp : function(g, f) {
			f.ctx.closePath()
		},
		drawEraserDown : function(g, f) {
			f.ctx.save();
			f.ctx.globalCompositeOperation = "destination-out";
			f.drawPencilDown(g, f)
		},
		drawEraserMove : function(g, f) {
			f.drawPencilMove(g, f)
		},
		drawEraserUp : function(g, f) {
			f.drawPencilUp(g, f);
			f.ctx.restore()
		},
		getImage : function() {
			return this.canvas.toDataURL()
		},
		setImage : function(f) {
			var g = this;
			var e = new Image();
			e.src = f;
			g.ctx.clearRect(0, 0, g.canvas.width, g.canvas.height);
			d(e).load(function() {
				g.ctx.drawImage(e, 0, 0)
			})
		}
	};
	function c() {
		this.menu = null;
		return this
	}
	c.prototype = {
		generate : function(e) {
			var k = e;
			var j = this;
			var n = "";
			for ( var g = k.settings.lineWidthMin; g <= k.settings.lineWidthMax; g++) {
				n += '<option value="'
						+ g
						+ '" '
						+ (k.settings.lineWidth == g ? 'selected="selected"'
								: "") + ">" + g + "</option>"
			}
			var h = d(
					'<div class="_wPaint_lineWidth" title="line width"></div>')
					.append(d("<select>" + n + "</select>").change(function(i) {
						k.settings.lineWidth = parseInt(d(this).val())
					}));
			var m = d('<div class="_wPaint_options"></div>')
					.append(
							d(
									'<div class="_wPaint_icon _wPaint_rectangle" title="rectangle"></div>')
									.click(function() {
										j.set_mode(j, k, "Rectangle")
									}))
					.append(
							d(
									'<div class="_wPaint_icon _wPaint_ellipse" title="ellipse"></div>')
									.click(function() {
										j.set_mode(j, k, "Ellipse")
									}))
					.append(
							d(
									'<div class="_wPaint_icon _wPaint_line" title="line"></div>')
									.click(function() {
										j.set_mode(j, k, "Line")
									}))
					.append(
							d(
									'<div class="_wPaint_icon _wPaint_pencil" title="pencil"></div>')
									.click(function() {
										j.set_mode(j, k, "Pencil")
									}))
					.append(
							d(
									'<div class="_wPaint_icon _wPaint_eraser" title="eraser"></div>')
									.click(function(i) {
										j.set_mode(j, k, "Eraser")
									}))
					.append(
							d('<div class="_wPaint_fillColorPicker _wPaint_colorPicker" title="fill color"></div>'))
					.append(h)
					.append(
							d('<div class="_wPaint_strokeColorPicker _wPaint_colorPicker" title="stroke color"></div>'));
			var l = d('<div class="_wPaint_handle"></div>');
			var f = d(k.canvas).offset();
			return this.menu = d(
					'<div id="_wPaint_menu" class="_wPaint_menu"></div>').css({
				position : "absolute",
				left : f.left + 5,
				top : f.top + 5
			}).draggable({
				handle : l
			}).append(l).append(m)
		},
		set_mode : function(f, e, g) {
			e.settings.mode = g;
			f.menu.find("._wPaint_icon").removeClass("active");
			f.menu.find("._wPaint_" + g.toLowerCase()).addClass("active")
		}
	}
})(jQuery);/*******************************************************************************
 * Websanova.com
 * 
 * Resources for web entrepreneurs
 * 
 * @author Websanova
 * @copyright Copyright (c) 2012 Websanova.
 * @license This wPaint jQuery plug-in is dual licensed under the MIT and GPL
 *          licenses.
 * @link http://www.websanova.com
 * @docs http://www.websanova.com/plugins/websanova/paint
 * @version Version 1.3
 * 
 ******************************************************************************/
(function(d) {
	var b = [ "Rectangle", "Ellipse", "Line" ];
	d.fn.wPaint = function(f, e) {
		if (typeof f === "object") {
			e = f
		} else {
			if (typeof f == "string") {
				var h = this.data("_wPaint_canvas");
				var g = true;
				if (h) {
					if (f == "image" && e === undefined) {
						return h.getImage()
					} else {
						if (f == "image" && e !== undefined) {
							h.setImage(e)
						} else {
							if (d.fn.wPaint.defaultSettings[f] !== undefined) {
								if (e !== undefined) {
									h.settings[f] = e
								} else {
									return h.settings[f]
								}
							} else {
								g = false
							}
						}
					}
				} else {
					g = false
				}
				return g
			}
		}
		e = d.extend({}, d.fn.wPaint.defaultSettings, e || {});
		e.lineWidthMin = parseInt(e.lineWidthMin);
		e.lineWidthMax = parseInt(e.lineWidthMax);
		e.lineWidth = parseInt(e.lineWidth);
		return this
				.each(function() {
					var l = d(this);
					var k = jQuery.extend(true, {}, e);
					var n = document.createElement("canvas");
					if (!n.getContext) {
						l
								.html("Browser does not support HTML5 canvas, please upgrade to a more modern browser.");
						return false
					}
					var j = new a(k);
					var m = new c();
					l.append(j.generate(l.width(), l.height()));
					l.append(j.generateTemp());
					d("body").append(m.generate(j));
					m.set_mode(m, j, k.mode);
					var i = d("._wPaint_icon").outerHeight()
							- (parseInt(d("._wPaint_icon").css("paddingTop")
									.split("px")[0]) + parseInt(d(
									"._wPaint_icon").css("paddingBottom")
									.split("px")[0]));
					m.menu.find("._wPaint_fillColorPicker").wColorPicker({
						mode : "click",
						initColor : k.fillStyle,
						buttonSize : i,
						onSelect : function(o) {
							j.settings.fillStyle = o
						}
					});
					m.menu.find("._wPaint_strokeColorPicker").wColorPicker({
						mode : "click",
						initColor : k.strokeStyle,
						buttonSize : i,
						onSelect : function(o) {
							j.settings.strokeStyle = o
						}
					});
					if (k.image) {
						j.setImage(k.image)
					}
					l.data("_wPaint_canvas", j)
				})
	};
	d.fn.wPaint.defaultSettings = {
		mode : "Pencil",
		lineWidthMin : "0",
		lineWidthMax : "10",
		lineWidth : "2",
		fillStyle : "#FFFFFF",
		strokeStyle : "#FFFF00",
		image : null,
		drawDown : null,
		drawMove : null,
		drawUp : null
	};
	function a(e) {
		this.settings = e;
		this.draw = false;
		this.canvas = null;
		this.ctx = null;
		this.canvasTemp = null;
		this.ctxTemp = null;
		this.canvasTempLeftOriginal = null;
		this.canvasTempTopOriginal = null;
		this.canvasTempLeftNew = null;
		this.canvasTempTopNew = null;
		return this
	}
	a.prototype = {
		generate : function(f, e) {
			this.canvas = document.createElement("canvas");
			this.ctx = this.canvas.getContext("2d");
			var g = this;
			d(this.canvas).attr("width", f + "px").attr("height", e + "px")
					.css({
						position : "absolute",
						left : 0,
						top : 0
					}).mousedown(function(h) {
						h.preventDefault();
						h.stopPropagation();
						g.draw = true;
						g.callFunc(h, g, "Down")
					});
			d(document).mousemove(function(h) {
				if (g.draw) {
					g.callFunc(h, g, "Move")
				}
			}).mouseup(function(h) {
				if (g.draw) {
					g.draw = false;
					g.callFunc(h, g, "Up")
				}
			});
			return d(this.canvas)
		},
		generateTemp : function() {
			this.canvasTemp = document.createElement("canvas");
			this.ctxTemp = this.canvasTemp.getContext("2d");
			d(this.canvasTemp).css({
				position : "absolute"
			}).hide();
			return d(this.canvasTemp)
		},
		callFunc : function(j, i, h) {
			$e = jQuery.extend(true, {}, j);
			var f = d(i.canvas).offset();
			$e.pageX = Math.floor($e.pageX - f.left);
			$e.pageY = Math.floor($e.pageY - f.top);
			var k = d.inArray(i.settings.mode, b) > -1 ? "Shape"
					: i.settings.mode;
			var g = i["draw" + k + "" + h];
			if (g) {
				g($e, i)
			}
		},
		drawShapeDown : function(h, g) {
			d(g.canvasTemp).css({
				left : h.pageX,
				top : h.pageY
			}).attr("width", 0).attr("height", 0).show();
			g.canvasTempLeftOriginal = h.pageX;
			g.canvasTempTopOriginal = h.pageY;
			var f = g["draw" + g.settings.mode + "Down"];
			if (f) {
				f(h, g)
			}
		},
		drawShapeMove : function(l, n) {
			var j = n.canvasTempLeftOriginal;
			var f = n.canvasTempTopOriginal;
			var k = n.settings.lineWidth / 2;
			var i = (l.pageX < j ? l.pageX : j)
					- (n.settings.mode == "Line" ? Math.floor(k) : 0);
			var o = (l.pageY < f ? l.pageY : f)
					- (n.settings.mode == "Line" ? Math.floor(k) : 0);
			var g = Math.abs(l.pageX - j)
					+ (n.settings.mode == "Line" ? n.settings.lineWidth : 0);
			var p = Math.abs(l.pageY - f)
					+ (n.settings.mode == "Line" ? n.settings.lineWidth : 0);
			d(n.canvasTemp).css({
				left : i,
				top : o
			}).attr("width", g).attr("height", p);
			n.canvasTempLeftNew = i;
			n.canvasTempTopNew = o;
			var h = n["draw" + n.settings.mode + "Move"];
			if (h) {
				var m = n.settings.mode == "Line" ? 1 : 2;
				l.x = k * m;
				l.y = k * m;
				l.w = g - n.settings.lineWidth * m;
				l.h = p - n.settings.lineWidth * m;
				n.ctxTemp.fillStyle = n.settings.fillStyle;
				n.ctxTemp.strokeStyle = n.settings.strokeStyle;
				n.ctxTemp.lineWidth = n.settings.lineWidth * m;
				h(l, n)
			}
		},
		drawShapeUp : function(h, g) {
			g.ctx.drawImage(g.canvasTemp, g.canvasTempLeftNew,
					g.canvasTempTopNew);
			d(g.canvasTemp).hide();
			var f = g["draw" + g.settings.mode + "Up"];
			if (f) {
				f(h, g)
			}
		},
		drawRectangleMove : function(g, f) {
			f.ctxTemp.beginPath();
			f.ctxTemp.rect(g.x, g.y, g.w, g.h);
			f.ctxTemp.closePath();
			f.ctxTemp.stroke();
			f.ctxTemp.fill()
		},
		drawEllipseMove : function(l, m) {
			var k = 0.5522848;
			var h = (l.w / 2) * k;
			var f = (l.h / 2) * k;
			var n = l.x + l.w;
			var j = l.y + l.h;
			var i = l.x + l.w / 2;
			var g = l.y + l.h / 2;
			m.ctxTemp.beginPath();
			m.ctxTemp.moveTo(l.x, g);
			m.ctxTemp.bezierCurveTo(l.x, g - f, i - h, l.y, i, l.y);
			m.ctxTemp.bezierCurveTo(i + h, l.y, n, g - f, n, g);
			m.ctxTemp.bezierCurveTo(n, g + f, i + h, j, i, j);
			m.ctxTemp.bezierCurveTo(i - h, j, l.x, g + f, l.x, g);
			m.ctxTemp.closePath();
			if (m.settings.lineWidth > 0) {
				m.ctxTemp.stroke()
			}
			m.ctxTemp.fill()
		},
		drawLineMove : function(h, g) {
			var f = g.canvasTempLeftOriginal;
			var i = g.canvasTempTopOriginal;
			if (h.pageX < f) {
				h.x = h.x + h.w;
				h.w = h.w * -1
			}
			if (h.pageY < i) {
				h.y = h.y + h.h;
				h.h = h.h * -1
			}
			g.ctxTemp.lineJoin = "round";
			g.ctxTemp.beginPath();
			g.ctxTemp.moveTo(h.x, h.y);
			g.ctxTemp.lineTo(h.x + h.w, h.y + h.h);
			g.ctxTemp.closePath();
			g.ctxTemp.stroke()
		},
		drawPencilDown : function(g, f) {
			f.ctx.lineJoin = "round";
			f.ctx.lineCap = "round";
			f.ctx.strokeStyle = f.settings.strokeStyle;
			f.ctx.fillStyle = f.settings.strokeStyle;
			f.ctx.lineWidth = f.settings.lineWidth;
			f.ctx.beginPath();
			f.ctx.arc(g.pageX, g.pageY, f.settings.lineWidth / 2, 0,
					Math.PI * 2, true);
			f.ctx.closePath();
			f.ctx.fill();
			f.ctx.beginPath();
			f.ctx.moveTo(g.pageX, g.pageY)
		},
		drawPencilMove : function(g, f) {
			f.ctx.lineTo(g.pageX, g.pageY);
			f.ctx.stroke()
		},
		drawPencilUp : function(g, f) {
			f.ctx.closePath()
		},
		drawEraserDown : function(g, f) {
			f.ctx.save();
			f.ctx.globalCompositeOperation = "destination-out";
			f.drawPencilDown(g, f)
		},
		drawEraserMove : function(g, f) {
			f.drawPencilMove(g, f)
		},
		drawEraserUp : function(g, f) {
			f.drawPencilUp(g, f);
			f.ctx.restore()
		},
		getImage : function() {
			return this.canvas.toDataURL()
		},
		setImage : function(f) {
			var g = this;
			var e = new Image();
			e.src = f;
			g.ctx.clearRect(0, 0, g.canvas.width, g.canvas.height);
			d(e).load(function() {
				g.ctx.drawImage(e, 0, 0)
			})
		}
	};
	function c() {
		this.menu = null;
		return this
	}
	c.prototype = {
		generate : function(e) {
			var k = e;
			var j = this;
			var n = "";
			for ( var g = k.settings.lineWidthMin; g <= k.settings.lineWidthMax; g++) {
				n += '<option value="'
						+ g
						+ '" '
						+ (k.settings.lineWidth == g ? 'selected="selected"'
								: "") + ">" + g + "</option>"
			}
			var h = d(
					'<div class="_wPaint_lineWidth" title="line width"></div>')
					.append(d("<select>" + n + "</select>").change(function(i) {
						k.settings.lineWidth = parseInt(d(this).val())
					}));
			var m = d('<div class="_wPaint_options"></div>')
					.append(
							d(
									'<div class="_wPaint_icon _wPaint_rectangle" title="rectangle"></div>')
									.click(function() {
										j.set_mode(j, k, "Rectangle")
									}))
					.append(
							d(
									'<div class="_wPaint_icon _wPaint_ellipse" title="ellipse"></div>')
									.click(function() {
										j.set_mode(j, k, "Ellipse")
									}))
					.append(
							d(
									'<div class="_wPaint_icon _wPaint_line" title="line"></div>')
									.click(function() {
										j.set_mode(j, k, "Line")
									}))
					.append(
							d(
									'<div class="_wPaint_icon _wPaint_pencil" title="pencil"></div>')
									.click(function() {
										j.set_mode(j, k, "Pencil")
									}))
					.append(
							d(
									'<div class="_wPaint_icon _wPaint_eraser" title="eraser"></div>')
									.click(function(i) {
										j.set_mode(j, k, "Eraser")
									}))
					.append(
							d('<div class="_wPaint_fillColorPicker _wPaint_colorPicker" title="fill color"></div>'))
					.append(h)
					.append(
							d('<div class="_wPaint_strokeColorPicker _wPaint_colorPicker" title="stroke color"></div>'));
			var l = d('<div class="_wPaint_handle"></div>');
			var f = d(k.canvas).offset();
			return this.menu = d(
					'<div id="_wPaint_menu" class="_wPaint_menu"></div>').css({
				position : "absolute",
				left : f.left + 5,
				top : f.top + 5
			}).draggable({
				handle : l
			}).append(l).append(m)
		},
		set_mode : function(f, e, g) {
			e.settings.mode = g;
			f.menu.find("._wPaint_icon").removeClass("active");
			f.menu.find("._wPaint_" + g.toLowerCase()).addClass("active")
		}
	}
})(jQuery);/*******************************************************************************
 * Websanova.com
 * 
 * Resources for web entrepreneurs
 * 
 * @author Websanova
 * @copyright Copyright (c) 2012 Websanova.
 * @license This wPaint jQuery plug-in is dual licensed under the MIT and GPL
 *          licenses.
 * @link http://www.websanova.com
 * @docs http://www.websanova.com/plugins/websanova/paint
 * @version Version 1.3
 * 
 ******************************************************************************/
(function(d) {
	var b = [ "Rectangle", "Ellipse", "Line" ];
	d.fn.wPaint = function(f, e) {
		if (typeof f === "object") {
			e = f
		} else {
			if (typeof f == "string") {
				var h = this.data("_wPaint_canvas");
				var g = true;
				if (h) {
					if (f == "image" && e === undefined) {
						return h.getImage()
					} else {
						if (f == "image" && e !== undefined) {
							h.setImage(e)
						} else {
							if (d.fn.wPaint.defaultSettings[f] !== undefined) {
								if (e !== undefined) {
									h.settings[f] = e
								} else {
									return h.settings[f]
								}
							} else {
								g = false
							}
						}
					}
				} else {
					g = false
				}
				return g
			}
		}
		e = d.extend({}, d.fn.wPaint.defaultSettings, e || {});
		e.lineWidthMin = parseInt(e.lineWidthMin);
		e.lineWidthMax = parseInt(e.lineWidthMax);
		e.lineWidth = parseInt(e.lineWidth);
		return this
				.each(function() {
					var l = d(this);
					var k = jQuery.extend(true, {}, e);
					var n = document.createElement("canvas");
					if (!n.getContext) {
						l
								.html("Browser does not support HTML5 canvas, please upgrade to a more modern browser.");
						return false
					}
					var j = new a(k);
					var m = new c();
					l.append(j.generate(l.width(), l.height()));
					l.append(j.generateTemp());
					d("body").append(m.generate(j));
					m.set_mode(m, j, k.mode);
					var i = d("._wPaint_icon").outerHeight()
							- (parseInt(d("._wPaint_icon").css("paddingTop")
									.split("px")[0]) + parseInt(d(
									"._wPaint_icon").css("paddingBottom")
									.split("px")[0]));
					m.menu.find("._wPaint_fillColorPicker").wColorPicker({
						mode : "click",
						initColor : k.fillStyle,
						buttonSize : i,
						onSelect : function(o) {
							j.settings.fillStyle = o
						}
					});
					m.menu.find("._wPaint_strokeColorPicker").wColorPicker({
						mode : "click",
						initColor : k.strokeStyle,
						buttonSize : i,
						onSelect : function(o) {
							j.settings.strokeStyle = o
						}
					});
					if (k.image) {
						j.setImage(k.image)
					}
					l.data("_wPaint_canvas", j)
				})
	};
	d.fn.wPaint.defaultSettings = {
		mode : "Pencil",
		lineWidthMin : "0",
		lineWidthMax : "10",
		lineWidth : "2",
		fillStyle : "#FFFFFF",
		strokeStyle : "#FFFF00",
		image : null,
		drawDown : null,
		drawMove : null,
		drawUp : null
	};
	function a(e) {
		this.settings = e;
		this.draw = false;
		this.canvas = null;
		this.ctx = null;
		this.canvasTemp = null;
		this.ctxTemp = null;
		this.canvasTempLeftOriginal = null;
		this.canvasTempTopOriginal = null;
		this.canvasTempLeftNew = null;
		this.canvasTempTopNew = null;
		return this
	}
	a.prototype = {
		generate : function(f, e) {
			this.canvas = document.createElement("canvas");
			this.ctx = this.canvas.getContext("2d");
			var g = this;
			d(this.canvas).attr("width", f + "px").attr("height", e + "px")
					.css({
						position : "absolute",
						left : 0,
						top : 0
					}).mousedown(function(h) {
						h.preventDefault();
						h.stopPropagation();
						g.draw = true;
						g.callFunc(h, g, "Down")
					});
			d(document).mousemove(function(h) {
				if (g.draw) {
					g.callFunc(h, g, "Move")
				}
			}).mouseup(function(h) {
				if (g.draw) {
					g.draw = false;
					g.callFunc(h, g, "Up")
				}
			});
			return d(this.canvas)
		},
		generateTemp : function() {
			this.canvasTemp = document.createElement("canvas");
			this.ctxTemp = this.canvasTemp.getContext("2d");
			d(this.canvasTemp).css({
				position : "absolute"
			}).hide();
			return d(this.canvasTemp)
		},
		callFunc : function(j, i, h) {
			$e = jQuery.extend(true, {}, j);
			var f = d(i.canvas).offset();
			$e.pageX = Math.floor($e.pageX - f.left);
			$e.pageY = Math.floor($e.pageY - f.top);
			var k = d.inArray(i.settings.mode, b) > -1 ? "Shape"
					: i.settings.mode;
			var g = i["draw" + k + "" + h];
			if (g) {
				g($e, i)
			}
		},
		drawShapeDown : function(h, g) {
			d(g.canvasTemp).css({
				left : h.pageX,
				top : h.pageY
			}).attr("width", 0).attr("height", 0).show();
			g.canvasTempLeftOriginal = h.pageX;
			g.canvasTempTopOriginal = h.pageY;
			var f = g["draw" + g.settings.mode + "Down"];
			if (f) {
				f(h, g)
			}
		},
		drawShapeMove : function(l, n) {
			var j = n.canvasTempLeftOriginal;
			var f = n.canvasTempTopOriginal;
			var k = n.settings.lineWidth / 2;
			var i = (l.pageX < j ? l.pageX : j)
					- (n.settings.mode == "Line" ? Math.floor(k) : 0);
			var o = (l.pageY < f ? l.pageY : f)
					- (n.settings.mode == "Line" ? Math.floor(k) : 0);
			var g = Math.abs(l.pageX - j)
					+ (n.settings.mode == "Line" ? n.settings.lineWidth : 0);
			var p = Math.abs(l.pageY - f)
					+ (n.settings.mode == "Line" ? n.settings.lineWidth : 0);
			d(n.canvasTemp).css({
				left : i,
				top : o
			}).attr("width", g).attr("height", p);
			n.canvasTempLeftNew = i;
			n.canvasTempTopNew = o;
			var h = n["draw" + n.settings.mode + "Move"];
			if (h) {
				var m = n.settings.mode == "Line" ? 1 : 2;
				l.x = k * m;
				l.y = k * m;
				l.w = g - n.settings.lineWidth * m;
				l.h = p - n.settings.lineWidth * m;
				n.ctxTemp.fillStyle = n.settings.fillStyle;
				n.ctxTemp.strokeStyle = n.settings.strokeStyle;
				n.ctxTemp.lineWidth = n.settings.lineWidth * m;
				h(l, n)
			}
		},
		drawShapeUp : function(h, g) {
			g.ctx.drawImage(g.canvasTemp, g.canvasTempLeftNew,
					g.canvasTempTopNew);
			d(g.canvasTemp).hide();
			var f = g["draw" + g.settings.mode + "Up"];
			if (f) {
				f(h, g)
			}
		},
		drawRectangleMove : function(g, f) {
			f.ctxTemp.beginPath();
			f.ctxTemp.rect(g.x, g.y, g.w, g.h);
			f.ctxTemp.closePath();
			f.ctxTemp.stroke();
			f.ctxTemp.fill()
		},
		drawEllipseMove : function(l, m) {
			var k = 0.5522848;
			var h = (l.w / 2) * k;
			var f = (l.h / 2) * k;
			var n = l.x + l.w;
			var j = l.y + l.h;
			var i = l.x + l.w / 2;
			var g = l.y + l.h / 2;
			m.ctxTemp.beginPath();
			m.ctxTemp.moveTo(l.x, g);
			m.ctxTemp.bezierCurveTo(l.x, g - f, i - h, l.y, i, l.y);
			m.ctxTemp.bezierCurveTo(i + h, l.y, n, g - f, n, g);
			m.ctxTemp.bezierCurveTo(n, g + f, i + h, j, i, j);
			m.ctxTemp.bezierCurveTo(i - h, j, l.x, g + f, l.x, g);
			m.ctxTemp.closePath();
			if (m.settings.lineWidth > 0) {
				m.ctxTemp.stroke()
			}
			m.ctxTemp.fill()
		},
		drawLineMove : function(h, g) {
			var f = g.canvasTempLeftOriginal;
			var i = g.canvasTempTopOriginal;
			if (h.pageX < f) {
				h.x = h.x + h.w;
				h.w = h.w * -1
			}
			if (h.pageY < i) {
				h.y = h.y + h.h;
				h.h = h.h * -1
			}
			g.ctxTemp.lineJoin = "round";
			g.ctxTemp.beginPath();
			g.ctxTemp.moveTo(h.x, h.y);
			g.ctxTemp.lineTo(h.x + h.w, h.y + h.h);
			g.ctxTemp.closePath();
			g.ctxTemp.stroke()
		},
		drawPencilDown : function(g, f) {
			f.ctx.lineJoin = "round";
			f.ctx.lineCap = "round";
			f.ctx.strokeStyle = f.settings.strokeStyle;
			f.ctx.fillStyle = f.settings.strokeStyle;
			f.ctx.lineWidth = f.settings.lineWidth;
			f.ctx.beginPath();
			f.ctx.arc(g.pageX, g.pageY, f.settings.lineWidth / 2, 0,
					Math.PI * 2, true);
			f.ctx.closePath();
			f.ctx.fill();
			f.ctx.beginPath();
			f.ctx.moveTo(g.pageX, g.pageY)
		},
		drawPencilMove : function(g, f) {
			f.ctx.lineTo(g.pageX, g.pageY);
			f.ctx.stroke()
		},
		drawPencilUp : function(g, f) {
			f.ctx.closePath()
		},
		drawEraserDown : function(g, f) {
			f.ctx.save();
			f.ctx.globalCompositeOperation = "destination-out";
			f.drawPencilDown(g, f)
		},
		drawEraserMove : function(g, f) {
			f.drawPencilMove(g, f)
		},
		drawEraserUp : function(g, f) {
			f.drawPencilUp(g, f);
			f.ctx.restore()
		},
		getImage : function() {
			return this.canvas.toDataURL()
		},
		setImage : function(f) {
			var g = this;
			var e = new Image();
			e.src = f;
			g.ctx.clearRect(0, 0, g.canvas.width, g.canvas.height);
			d(e).load(function() {
				g.ctx.drawImage(e, 0, 0)
			})
		}
	};
	function c() {
		this.menu = null;
		return this
	}
	c.prototype = {
		generate : function(e) {
			var k = e;
			var j = this;
			var n = "";
			for ( var g = k.settings.lineWidthMin; g <= k.settings.lineWidthMax; g++) {
				n += '<option value="'
						+ g
						+ '" '
						+ (k.settings.lineWidth == g ? 'selected="selected"'
								: "") + ">" + g + "</option>"
			}
			var h = d(
					'<div class="_wPaint_lineWidth" title="line width"></div>')
					.append(d("<select>" + n + "</select>").change(function(i) {
						k.settings.lineWidth = parseInt(d(this).val())
					}));
			var m = d('<div class="_wPaint_options"></div>')
					.append(
							d(
									'<div class="_wPaint_icon _wPaint_rectangle" title="rectangle"></div>')
									.click(function() {
										j.set_mode(j, k, "Rectangle")
									}))
					.append(
							d(
									'<div class="_wPaint_icon _wPaint_ellipse" title="ellipse"></div>')
									.click(function() {
										j.set_mode(j, k, "Ellipse")
									}))
					.append(
							d(
									'<div class="_wPaint_icon _wPaint_line" title="line"></div>')
									.click(function() {
										j.set_mode(j, k, "Line")
									}))
					.append(
							d(
									'<div class="_wPaint_icon _wPaint_pencil" title="pencil"></div>')
									.click(function() {
										j.set_mode(j, k, "Pencil")
									}))
					.append(
							d(
									'<div class="_wPaint_icon _wPaint_eraser" title="eraser"></div>')
									.click(function(i) {
										j.set_mode(j, k, "Eraser")
									}))
					.append(
							d('<div class="_wPaint_fillColorPicker _wPaint_colorPicker" title="fill color"></div>'))
					.append(h)
					.append(
							d('<div class="_wPaint_strokeColorPicker _wPaint_colorPicker" title="stroke color"></div>'));
			var l = d('<div class="_wPaint_handle"></div>');
			var f = d(k.canvas).offset();
			return this.menu = d(
					'<div id="_wPaint_menu" class="_wPaint_menu"></div>').css({
				position : "absolute",
				left : f.left + 5,
				top : f.top + 5
			}).draggable({
				handle : l
			}).append(l).append(m)
		},
		set_mode : function(f, e, g) {
			e.settings.mode = g;
			f.menu.find("._wPaint_icon").removeClass("active");
			f.menu.find("._wPaint_" + g.toLowerCase()).addClass("active")
		}
	}
})(jQuery);/*******************************************************************************
 * Websanova.com
 * 
 * Resources for web entrepreneurs
 * 
 * @author Websanova
 * @copyright Copyright (c) 2012 Websanova.
 * @license This wPaint jQuery plug-in is dual licensed under the MIT and GPL
 *          licenses.
 * @link http://www.websanova.com
 * @docs http://www.websanova.com/plugins/websanova/paint
 * @version Version 1.3
 * 
 ******************************************************************************/
(function(d) {
	var b = [ "Rectangle", "Ellipse", "Line" ];
	d.fn.wPaint = function(f, e) {
		if (typeof f === "object") {
			e = f
		} else {
			if (typeof f == "string") {
				var h = this.data("_wPaint_canvas");
				var g = true;
				if (h) {
					if (f == "image" && e === undefined) {
						return h.getImage()
					} else {
						if (f == "image" && e !== undefined) {
							h.setImage(e)
						} else {
							if (d.fn.wPaint.defaultSettings[f] !== undefined) {
								if (e !== undefined) {
									h.settings[f] = e
								} else {
									return h.settings[f]
								}
							} else {
								g = false
							}
						}
					}
				} else {
					g = false
				}
				return g
			}
		}
		e = d.extend({}, d.fn.wPaint.defaultSettings, e || {});
		e.lineWidthMin = parseInt(e.lineWidthMin);
		e.lineWidthMax = parseInt(e.lineWidthMax);
		e.lineWidth = parseInt(e.lineWidth);
		return this
				.each(function() {
					var l = d(this);
					var k = jQuery.extend(true, {}, e);
					var n = document.createElement("canvas");
					if (!n.getContext) {
						l
								.html("Browser does not support HTML5 canvas, please upgrade to a more modern browser.");
						return false
					}
					var j = new a(k);
					var m = new c();
					l.append(j.generate(l.width(), l.height()));
					l.append(j.generateTemp());
					d("body").append(m.generate(j));
					m.set_mode(m, j, k.mode);
					var i = d("._wPaint_icon").outerHeight()
							- (parseInt(d("._wPaint_icon").css("paddingTop")
									.split("px")[0]) + parseInt(d(
									"._wPaint_icon").css("paddingBottom")
									.split("px")[0]));
					m.menu.find("._wPaint_fillColorPicker").wColorPicker({
						mode : "click",
						initColor : k.fillStyle,
						buttonSize : i,
						onSelect : function(o) {
							j.settings.fillStyle = o
						}
					});
					m.menu.find("._wPaint_strokeColorPicker").wColorPicker({
						mode : "click",
						initColor : k.strokeStyle,
						buttonSize : i,
						onSelect : function(o) {
							j.settings.strokeStyle = o
						}
					});
					if (k.image) {
						j.setImage(k.image)
					}
					l.data("_wPaint_canvas", j)
				})
	};
	d.fn.wPaint.defaultSettings = {
		mode : "Pencil",
		lineWidthMin : "0",
		lineWidthMax : "10",
		lineWidth : "2",
		fillStyle : "#FFFFFF",
		strokeStyle : "#FFFF00",
		image : null,
		drawDown : null,
		drawMove : null,
		drawUp : null
	};
	function a(e) {
		this.settings = e;
		this.draw = false;
		this.canvas = null;
		this.ctx = null;
		this.canvasTemp = null;
		this.ctxTemp = null;
		this.canvasTempLeftOriginal = null;
		this.canvasTempTopOriginal = null;
		this.canvasTempLeftNew = null;
		this.canvasTempTopNew = null;
		return this
	}
	a.prototype = {
		generate : function(f, e) {
			this.canvas = document.createElement("canvas");
			this.ctx = this.canvas.getContext("2d");
			var g = this;
			d(this.canvas).attr("width", f + "px").attr("height", e + "px")
					.css({
						position : "absolute",
						left : 0,
						top : 0
					}).mousedown(function(h) {
						h.preventDefault();
						h.stopPropagation();
						g.draw = true;
						g.callFunc(h, g, "Down")
					});
			d(document).mousemove(function(h) {
				if (g.draw) {
					g.callFunc(h, g, "Move")
				}
			}).mouseup(function(h) {
				if (g.draw) {
					g.draw = false;
					g.callFunc(h, g, "Up")
				}
			});
			return d(this.canvas)
		},
		generateTemp : function() {
			this.canvasTemp = document.createElement("canvas");
			this.ctxTemp = this.canvasTemp.getContext("2d");
			d(this.canvasTemp).css({
				position : "absolute"
			}).hide();
			return d(this.canvasTemp)
		},
		callFunc : function(j, i, h) {
			$e = jQuery.extend(true, {}, j);
			var f = d(i.canvas).offset();
			$e.pageX = Math.floor($e.pageX - f.left);
			$e.pageY = Math.floor($e.pageY - f.top);
			var k = d.inArray(i.settings.mode, b) > -1 ? "Shape"
					: i.settings.mode;
			var g = i["draw" + k + "" + h];
			if (g) {
				g($e, i)
			}
		},
		drawShapeDown : function(h, g) {
			d(g.canvasTemp).css({
				left : h.pageX,
				top : h.pageY
			}).attr("width", 0).attr("height", 0).show();
			g.canvasTempLeftOriginal = h.pageX;
			g.canvasTempTopOriginal = h.pageY;
			var f = g["draw" + g.settings.mode + "Down"];
			if (f) {
				f(h, g)
			}
		},
		drawShapeMove : function(l, n) {
			var j = n.canvasTempLeftOriginal;
			var f = n.canvasTempTopOriginal;
			var k = n.settings.lineWidth / 2;
			var i = (l.pageX < j ? l.pageX : j)
					- (n.settings.mode == "Line" ? Math.floor(k) : 0);
			var o = (l.pageY < f ? l.pageY : f)
					- (n.settings.mode == "Line" ? Math.floor(k) : 0);
			var g = Math.abs(l.pageX - j)
					+ (n.settings.mode == "Line" ? n.settings.lineWidth : 0);
			var p = Math.abs(l.pageY - f)
					+ (n.settings.mode == "Line" ? n.settings.lineWidth : 0);
			d(n.canvasTemp).css({
				left : i,
				top : o
			}).attr("width", g).attr("height", p);
			n.canvasTempLeftNew = i;
			n.canvasTempTopNew = o;
			var h = n["draw" + n.settings.mode + "Move"];
			if (h) {
				var m = n.settings.mode == "Line" ? 1 : 2;
				l.x = k * m;
				l.y = k * m;
				l.w = g - n.settings.lineWidth * m;
				l.h = p - n.settings.lineWidth * m;
				n.ctxTemp.fillStyle = n.settings.fillStyle;
				n.ctxTemp.strokeStyle = n.settings.strokeStyle;
				n.ctxTemp.lineWidth = n.settings.lineWidth * m;
				h(l, n)
			}
		},
		drawShapeUp : function(h, g) {
			g.ctx.drawImage(g.canvasTemp, g.canvasTempLeftNew,
					g.canvasTempTopNew);
			d(g.canvasTemp).hide();
			var f = g["draw" + g.settings.mode + "Up"];
			if (f) {
				f(h, g)
			}
		},
		drawRectangleMove : function(g, f) {
			f.ctxTemp.beginPath();
			f.ctxTemp.rect(g.x, g.y, g.w, g.h);
			f.ctxTemp.closePath();
			f.ctxTemp.stroke();
			f.ctxTemp.fill()
		},
		drawEllipseMove : function(l, m) {
			var k = 0.5522848;
			var h = (l.w / 2) * k;
			var f = (l.h / 2) * k;
			var n = l.x + l.w;
			var j = l.y + l.h;
			var i = l.x + l.w / 2;
			var g = l.y + l.h / 2;
			m.ctxTemp.beginPath();
			m.ctxTemp.moveTo(l.x, g);
			m.ctxTemp.bezierCurveTo(l.x, g - f, i - h, l.y, i, l.y);
			m.ctxTemp.bezierCurveTo(i + h, l.y, n, g - f, n, g);
			m.ctxTemp.bezierCurveTo(n, g + f, i + h, j, i, j);
			m.ctxTemp.bezierCurveTo(i - h, j, l.x, g + f, l.x, g);
			m.ctxTemp.closePath();
			if (m.settings.lineWidth > 0) {
				m.ctxTemp.stroke()
			}
			m.ctxTemp.fill()
		},
		drawLineMove : function(h, g) {
			var f = g.canvasTempLeftOriginal;
			var i = g.canvasTempTopOriginal;
			if (h.pageX < f) {
				h.x = h.x + h.w;
				h.w = h.w * -1
			}
			if (h.pageY < i) {
				h.y = h.y + h.h;
				h.h = h.h * -1
			}
			g.ctxTemp.lineJoin = "round";
			g.ctxTemp.beginPath();
			g.ctxTemp.moveTo(h.x, h.y);
			g.ctxTemp.lineTo(h.x + h.w, h.y + h.h);
			g.ctxTemp.closePath();
			g.ctxTemp.stroke()
		},
		drawPencilDown : function(g, f) {
			f.ctx.lineJoin = "round";
			f.ctx.lineCap = "round";
			f.ctx.strokeStyle = f.settings.strokeStyle;
			f.ctx.fillStyle = f.settings.strokeStyle;
			f.ctx.lineWidth = f.settings.lineWidth;
			f.ctx.beginPath();
			f.ctx.arc(g.pageX, g.pageY, f.settings.lineWidth / 2, 0,
					Math.PI * 2, true);
			f.ctx.closePath();
			f.ctx.fill();
			f.ctx.beginPath();
			f.ctx.moveTo(g.pageX, g.pageY)
		},
		drawPencilMove : function(g, f) {
			f.ctx.lineTo(g.pageX, g.pageY);
			f.ctx.stroke()
		},
		drawPencilUp : function(g, f) {
			f.ctx.closePath()
		},
		drawEraserDown : function(g, f) {
			f.ctx.save();
			f.ctx.globalCompositeOperation = "destination-out";
			f.drawPencilDown(g, f)
		},
		drawEraserMove : function(g, f) {
			f.drawPencilMove(g, f)
		},
		drawEraserUp : function(g, f) {
			f.drawPencilUp(g, f);
			f.ctx.restore()
		},
		getImage : function() {
			return this.canvas.toDataURL()
		},
		setImage : function(f) {
			var g = this;
			var e = new Image();
			e.src = f;
			g.ctx.clearRect(0, 0, g.canvas.width, g.canvas.height);
			d(e).load(function() {
				g.ctx.drawImage(e, 0, 0)
			})
		}
	};
	function c() {
		this.menu = null;
		return this
	}
	c.prototype = {
		generate : function(e) {
			var k = e;
			var j = this;
			var n = "";
			for ( var g = k.settings.lineWidthMin; g <= k.settings.lineWidthMax; g++) {
				n += '<option value="'
						+ g
						+ '" '
						+ (k.settings.lineWidth == g ? 'selected="selected"'
								: "") + ">" + g + "</option>"
			}
			var h = d(
					'<div class="_wPaint_lineWidth" title="line width"></div>')
					.append(d("<select>" + n + "</select>").change(function(i) {
						k.settings.lineWidth = parseInt(d(this).val())
					}));
			var m = d('<div class="_wPaint_options"></div>')
					.append(
							d(
									'<div class="_wPaint_icon _wPaint_rectangle" title="rectangle"></div>')
									.click(function() {
										j.set_mode(j, k, "Rectangle")
									}))
					.append(
							d(
									'<div class="_wPaint_icon _wPaint_ellipse" title="ellipse"></div>')
									.click(function() {
										j.set_mode(j, k, "Ellipse")
									}))
					.append(
							d(
									'<div class="_wPaint_icon _wPaint_line" title="line"></div>')
									.click(function() {
										j.set_mode(j, k, "Line")
									}))
					.append(
							d(
									'<div class="_wPaint_icon _wPaint_pencil" title="pencil"></div>')
									.click(function() {
										j.set_mode(j, k, "Pencil")
									}))
					.append(
							d(
									'<div class="_wPaint_icon _wPaint_eraser" title="eraser"></div>')
									.click(function(i) {
										j.set_mode(j, k, "Eraser")
									}))
					.append(
							d('<div class="_wPaint_fillColorPicker _wPaint_colorPicker" title="fill color"></div>'))
					.append(h)
					.append(
							d('<div class="_wPaint_strokeColorPicker _wPaint_colorPicker" title="stroke color"></div>'));
			var l = d('<div class="_wPaint_handle"></div>');
			var f = d(k.canvas).offset();
			return this.menu = d(
					'<div id="_wPaint_menu" class="_wPaint_menu"></div>').css({
				position : "absolute",
				left : f.left + 5,
				top : f.top + 5
			}).draggable({
				handle : l
			}).append(l).append(m)
		},
		set_mode : function(f, e, g) {
			e.settings.mode = g;
			f.menu.find("._wPaint_icon").removeClass("active");
			f.menu.find("._wPaint_" + g.toLowerCase()).addClass("active")
		}
	}
})(jQuery);/*******************************************************************************
 * Websanova.com
 * 
 * Resources for web entrepreneurs
 * 
 * @author Websanova
 * @copyright Copyright (c) 2012 Websanova.
 * @license This wPaint jQuery plug-in is dual licensed under the MIT and GPL
 *          licenses.
 * @link http://www.websanova.com
 * @docs http://www.websanova.com/plugins/websanova/paint
 * @version Version 1.3
 * 
 ******************************************************************************/
(function(d) {
	var b = [ "Rectangle", "Ellipse", "Line" ];
	d.fn.wPaint = function(f, e) {
		if (typeof f === "object") {
			e = f
		} else {
			if (typeof f == "string") {
				var h = this.data("_wPaint_canvas");
				var g = true;
				if (h) {
					if (f == "image" && e === undefined) {
						return h.getImage()
					} else {
						if (f == "image" && e !== undefined) {
							h.setImage(e)
						} else {
							if (d.fn.wPaint.defaultSettings[f] !== undefined) {
								if (e !== undefined) {
									h.settings[f] = e
								} else {
									return h.settings[f]
								}
							} else {
								g = false
							}
						}
					}
				} else {
					g = false
				}
				return g
			}
		}
		e = d.extend({}, d.fn.wPaint.defaultSettings, e || {});
		e.lineWidthMin = parseInt(e.lineWidthMin);
		e.lineWidthMax = parseInt(e.lineWidthMax);
		e.lineWidth = parseInt(e.lineWidth);
		return this
				.each(function() {
					var l = d(this);
					var k = jQuery.extend(true, {}, e);
					var n = document.createElement("canvas");
					if (!n.getContext) {
						l
								.html("Browser does not support HTML5 canvas, please upgrade to a more modern browser.");
						return false
					}
					var j = new a(k);
					var m = new c();
					l.append(j.generate(l.width(), l.height()));
					l.append(j.generateTemp());
					d("body").append(m.generate(j));
					m.set_mode(m, j, k.mode);
					var i = d("._wPaint_icon").outerHeight()
							- (parseInt(d("._wPaint_icon").css("paddingTop")
									.split("px")[0]) + parseInt(d(
									"._wPaint_icon").css("paddingBottom")
									.split("px")[0]));
					m.menu.find("._wPaint_fillColorPicker").wColorPicker({
						mode : "click",
						initColor : k.fillStyle,
						buttonSize : i,
						onSelect : function(o) {
							j.settings.fillStyle = o
						}
					});
					m.menu.find("._wPaint_strokeColorPicker").wColorPicker({
						mode : "click",
						initColor : k.strokeStyle,
						buttonSize : i,
						onSelect : function(o) {
							j.settings.strokeStyle = o
						}
					});
					if (k.image) {
						j.setImage(k.image)
					}
					l.data("_wPaint_canvas", j)
				})
	};
	d.fn.wPaint.defaultSettings = {
		mode : "Pencil",
		lineWidthMin : "0",
		lineWidthMax : "10",
		lineWidth : "2",
		fillStyle : "#FFFFFF",
		strokeStyle : "#FFFF00",
		image : null,
		drawDown : null,
		drawMove : null,
		drawUp : null
	};
	function a(e) {
		this.settings = e;
		this.draw = false;
		this.canvas = null;
		this.ctx = null;
		this.canvasTemp = null;
		this.ctxTemp = null;
		this.canvasTempLeftOriginal = null;
		this.canvasTempTopOriginal = null;
		this.canvasTempLeftNew = null;
		this.canvasTempTopNew = null;
		return this
	}
	a.prototype = {
		generate : function(f, e) {
			this.canvas = document.createElement("canvas");
			this.ctx = this.canvas.getContext("2d");
			var g = this;
			d(this.canvas).attr("width", f + "px").attr("height", e + "px")
					.css({
						position : "absolute",
						left : 0,
						top : 0
					}).mousedown(function(h) {
						h.preventDefault();
						h.stopPropagation();
						g.draw = true;
						g.callFunc(h, g, "Down")
					});
			d(document).mousemove(function(h) {
				if (g.draw) {
					g.callFunc(h, g, "Move")
				}
			}).mouseup(function(h) {
				if (g.draw) {
					g.draw = false;
					g.callFunc(h, g, "Up")
				}
			});
			return d(this.canvas)
		},
		generateTemp : function() {
			this.canvasTemp = document.createElement("canvas");
			this.ctxTemp = this.canvasTemp.getContext("2d");
			d(this.canvasTemp).css({
				position : "absolute"
			}).hide();
			return d(this.canvasTemp)
		},
		callFunc : function(j, i, h) {
			$e = jQuery.extend(true, {}, j);
			var f = d(i.canvas).offset();
			$e.pageX = Math.floor($e.pageX - f.left);
			$e.pageY = Math.floor($e.pageY - f.top);
			var k = d.inArray(i.settings.mode, b) > -1 ? "Shape"
					: i.settings.mode;
			var g = i["draw" + k + "" + h];
			if (g) {
				g($e, i)
			}
		},
		drawShapeDown : function(h, g) {
			d(g.canvasTemp).css({
				left : h.pageX,
				top : h.pageY
			}).attr("width", 0).attr("height", 0).show();
			g.canvasTempLeftOriginal = h.pageX;
			g.canvasTempTopOriginal = h.pageY;
			var f = g["draw" + g.settings.mode + "Down"];
			if (f) {
				f(h, g)
			}
		},
		drawShapeMove : function(l, n) {
			var j = n.canvasTempLeftOriginal;
			var f = n.canvasTempTopOriginal;
			var k = n.settings.lineWidth / 2;
			var i = (l.pageX < j ? l.pageX : j)
					- (n.settings.mode == "Line" ? Math.floor(k) : 0);
			var o = (l.pageY < f ? l.pageY : f)
					- (n.settings.mode == "Line" ? Math.floor(k) : 0);
			var g = Math.abs(l.pageX - j)
					+ (n.settings.mode == "Line" ? n.settings.lineWidth : 0);
			var p = Math.abs(l.pageY - f)
					+ (n.settings.mode == "Line" ? n.settings.lineWidth : 0);
			d(n.canvasTemp).css({
				left : i,
				top : o
			}).attr("width", g).attr("height", p);
			n.canvasTempLeftNew = i;
			n.canvasTempTopNew = o;
			var h = n["draw" + n.settings.mode + "Move"];
			if (h) {
				var m = n.settings.mode == "Line" ? 1 : 2;
				l.x = k * m;
				l.y = k * m;
				l.w = g - n.settings.lineWidth * m;
				l.h = p - n.settings.lineWidth * m;
				n.ctxTemp.fillStyle = n.settings.fillStyle;
				n.ctxTemp.strokeStyle = n.settings.strokeStyle;
				n.ctxTemp.lineWidth = n.settings.lineWidth * m;
				h(l, n)
			}
		},
		drawShapeUp : function(h, g) {
			g.ctx.drawImage(g.canvasTemp, g.canvasTempLeftNew,
					g.canvasTempTopNew);
			d(g.canvasTemp).hide();
			var f = g["draw" + g.settings.mode + "Up"];
			if (f) {
				f(h, g)
			}
		},
		drawRectangleMove : function(g, f) {
			f.ctxTemp.beginPath();
			f.ctxTemp.rect(g.x, g.y, g.w, g.h);
			f.ctxTemp.closePath();
			f.ctxTemp.stroke();
			f.ctxTemp.fill()
		},
		drawEllipseMove : function(l, m) {
			var k = 0.5522848;
			var h = (l.w / 2) * k;
			var f = (l.h / 2) * k;
			var n = l.x + l.w;
			var j = l.y + l.h;
			var i = l.x + l.w / 2;
			var g = l.y + l.h / 2;
			m.ctxTemp.beginPath();
			m.ctxTemp.moveTo(l.x, g);
			m.ctxTemp.bezierCurveTo(l.x, g - f, i - h, l.y, i, l.y);
			m.ctxTemp.bezierCurveTo(i + h, l.y, n, g - f, n, g);
			m.ctxTemp.bezierCurveTo(n, g + f, i + h, j, i, j);
			m.ctxTemp.bezierCurveTo(i - h, j, l.x, g + f, l.x, g);
			m.ctxTemp.closePath();
			if (m.settings.lineWidth > 0) {
				m.ctxTemp.stroke()
			}
			m.ctxTemp.fill()
		},
		drawLineMove : function(h, g) {
			var f = g.canvasTempLeftOriginal;
			var i = g.canvasTempTopOriginal;
			if (h.pageX < f) {
				h.x = h.x + h.w;
				h.w = h.w * -1
			}
			if (h.pageY < i) {
				h.y = h.y + h.h;
				h.h = h.h * -1
			}
			g.ctxTemp.lineJoin = "round";
			g.ctxTemp.beginPath();
			g.ctxTemp.moveTo(h.x, h.y);
			g.ctxTemp.lineTo(h.x + h.w, h.y + h.h);
			g.ctxTemp.closePath();
			g.ctxTemp.stroke()
		},
		drawPencilDown : function(g, f) {
			f.ctx.lineJoin = "round";
			f.ctx.lineCap = "round";
			f.ctx.strokeStyle = f.settings.strokeStyle;
			f.ctx.fillStyle = f.settings.strokeStyle;
			f.ctx.lineWidth = f.settings.lineWidth;
			f.ctx.beginPath();
			f.ctx.arc(g.pageX, g.pageY, f.settings.lineWidth / 2, 0,
					Math.PI * 2, true);
			f.ctx.closePath();
			f.ctx.fill();
			f.ctx.beginPath();
			f.ctx.moveTo(g.pageX, g.pageY)
		},
		drawPencilMove : function(g, f) {
			f.ctx.lineTo(g.pageX, g.pageY);
			f.ctx.stroke()
		},
		drawPencilUp : function(g, f) {
			f.ctx.closePath()
		},
		drawEraserDown : function(g, f) {
			f.ctx.save();
			f.ctx.globalCompositeOperation = "destination-out";
			f.drawPencilDown(g, f)
		},
		drawEraserMove : function(g, f) {
			f.drawPencilMove(g, f)
		},
		drawEraserUp : function(g, f) {
			f.drawPencilUp(g, f);
			f.ctx.restore()
		},
		getImage : function() {
			return this.canvas.toDataURL()
		},
		setImage : function(f) {
			var g = this;
			var e = new Image();
			e.src = f;
			g.ctx.clearRect(0, 0, g.canvas.width, g.canvas.height);
			d(e).load(function() {
				g.ctx.drawImage(e, 0, 0)
			})
		}
	};
	function c() {
		this.menu = null;
		return this
	}
	c.prototype = {
		generate : function(e) {
			var k = e;
			var j = this;
			var n = "";
			for ( var g = k.settings.lineWidthMin; g <= k.settings.lineWidthMax; g++) {
				n += '<option value="'
						+ g
						+ '" '
						+ (k.settings.lineWidth == g ? 'selected="selected"'
								: "") + ">" + g + "</option>"
			}
			var h = d(
					'<div class="_wPaint_lineWidth" title="line width"></div>')
					.append(d("<select>" + n + "</select>").change(function(i) {
						k.settings.lineWidth = parseInt(d(this).val())
					}));
			var m = d('<div class="_wPaint_options"></div>')
					.append(
							d(
									'<div class="_wPaint_icon _wPaint_rectangle" title="rectangle"></div>')
									.click(function() {
										j.set_mode(j, k, "Rectangle")
									}))
					.append(
							d(
									'<div class="_wPaint_icon _wPaint_ellipse" title="ellipse"></div>')
									.click(function() {
										j.set_mode(j, k, "Ellipse")
									}))
					.append(
							d(
									'<div class="_wPaint_icon _wPaint_line" title="line"></div>')
									.click(function() {
										j.set_mode(j, k, "Line")
									}))
					.append(
							d(
									'<div class="_wPaint_icon _wPaint_pencil" title="pencil"></div>')
									.click(function() {
										j.set_mode(j, k, "Pencil")
									}))
					.append(
							d(
									'<div class="_wPaint_icon _wPaint_eraser" title="eraser"></div>')
									.click(function(i) {
										j.set_mode(j, k, "Eraser")
									}))
					.append(
							d('<div class="_wPaint_fillColorPicker _wPaint_colorPicker" title="fill color"></div>'))
					.append(h)
					.append(
							d('<div class="_wPaint_strokeColorPicker _wPaint_colorPicker" title="stroke color"></div>'));
			var l = d('<div class="_wPaint_handle"></div>');
			var f = d(k.canvas).offset();
			return this.menu = d(
					'<div id="_wPaint_menu" class="_wPaint_menu"></div>').css({
				position : "absolute",
				left : f.left + 5,
				top : f.top + 5
			}).draggable({
				handle : l
			}).append(l).append(m)
		},
		set_mode : function(f, e, g) {
			e.settings.mode = g;
			f.menu.find("._wPaint_icon").removeClass("active");
			f.menu.find("._wPaint_" + g.toLowerCase()).addClass("active")
		}
	}
})(jQuery);/*******************************************************************************
 * Websanova.com
 * 
 * Resources for web entrepreneurs
 * 
 * @author Websanova
 * @copyright Copyright (c) 2012 Websanova.
 * @license This wPaint jQuery plug-in is dual licensed under the MIT and GPL
 *          licenses.
 * @link http://www.websanova.com
 * @docs http://www.websanova.com/plugins/websanova/paint
 * @version Version 1.3
 * 
 ******************************************************************************/
(function(d) {
	var b = [ "Rectangle", "Ellipse", "Line" ];
	d.fn.wPaint = function(f, e) {
		if (typeof f === "object") {
			e = f
		} else {
			if (typeof f == "string") {
				var h = this.data("_wPaint_canvas");
				var g = true;
				if (h) {
					if (f == "image" && e === undefined) {
						return h.getImage()
					} else {
						if (f == "image" && e !== undefined) {
							h.setImage(e)
						} else {
							if (d.fn.wPaint.defaultSettings[f] !== undefined) {
								if (e !== undefined) {
									h.settings[f] = e
								} else {
									return h.settings[f]
								}
							} else {
								g = false
							}
						}
					}
				} else {
					g = false
				}
				return g
			}
		}
		e = d.extend({}, d.fn.wPaint.defaultSettings, e || {});
		e.lineWidthMin = parseInt(e.lineWidthMin);
		e.lineWidthMax = parseInt(e.lineWidthMax);
		e.lineWidth = parseInt(e.lineWidth);
		return this
				.each(function() {
					var l = d(this);
					var k = jQuery.extend(true, {}, e);
					var n = document.createElement("canvas");
					if (!n.getContext) {
						l
								.html("Browser does not support HTML5 canvas, please upgrade to a more modern browser.");
						return false
					}
					var j = new a(k);
					var m = new c();
					l.append(j.generate(l.width(), l.height()));
					l.append(j.generateTemp());
					d("body").append(m.generate(j));
					m.set_mode(m, j, k.mode);
					var i = d("._wPaint_icon").outerHeight()
							- (parseInt(d("._wPaint_icon").css("paddingTop")
									.split("px")[0]) + parseInt(d(
									"._wPaint_icon").css("paddingBottom")
									.split("px")[0]));
					m.menu.find("._wPaint_fillColorPicker").wColorPicker({
						mode : "click",
						initColor : k.fillStyle,
						buttonSize : i,
						onSelect : function(o) {
							j.settings.fillStyle = o
						}
					});
					m.menu.find("._wPaint_strokeColorPicker").wColorPicker({
						mode : "click",
						initColor : k.strokeStyle,
						buttonSize : i,
						onSelect : function(o) {
							j.settings.strokeStyle = o
						}
					});
					if (k.image) {
						j.setImage(k.image)
					}
					l.data("_wPaint_canvas", j)
				})
	};
	d.fn.wPaint.defaultSettings = {
		mode : "Pencil",
		lineWidthMin : "0",
		lineWidthMax : "10",
		lineWidth : "2",
		fillStyle : "#FFFFFF",
		strokeStyle : "#FFFF00",
		image : null,
		drawDown : null,
		drawMove : null,
		drawUp : null
	};
	function a(e) {
		this.settings = e;
		this.draw = false;
		this.canvas = null;
		this.ctx = null;
		this.canvasTemp = null;
		this.ctxTemp = null;
		this.canvasTempLeftOriginal = null;
		this.canvasTempTopOriginal = null;
		this.canvasTempLeftNew = null;
		this.canvasTempTopNew = null;
		return this
	}
	a.prototype = {
		generate : function(f, e) {
			this.canvas = document.createElement("canvas");
			this.ctx = this.canvas.getContext("2d");
			var g = this;
			d(this.canvas).attr("width", f + "px").attr("height", e + "px")
					.css({
						position : "absolute",
						left : 0,
						top : 0
					}).mousedown(function(h) {
						h.preventDefault();
						h.stopPropagation();
						g.draw = true;
						g.callFunc(h, g, "Down")
					});
			d(document).mousemove(function(h) {
				if (g.draw) {
					g.callFunc(h, g, "Move")
				}
			}).mouseup(function(h) {
				if (g.draw) {
					g.draw = false;
					g.callFunc(h, g, "Up")
				}
			});
			return d(this.canvas)
		},
		generateTemp : function() {
			this.canvasTemp = document.createElement("canvas");
			this.ctxTemp = this.canvasTemp.getContext("2d");
			d(this.canvasTemp).css({
				position : "absolute"
			}).hide();
			return d(this.canvasTemp)
		},
		callFunc : function(j, i, h) {
			$e = jQuery.extend(true, {}, j);
			var f = d(i.canvas).offset();
			$e.pageX = Math.floor($e.pageX - f.left);
			$e.pageY = Math.floor($e.pageY - f.top);
			var k = d.inArray(i.settings.mode, b) > -1 ? "Shape"
					: i.settings.mode;
			var g = i["draw" + k + "" + h];
			if (g) {
				g($e, i)
			}
		},
		drawShapeDown : function(h, g) {
			d(g.canvasTemp).css({
				left : h.pageX,
				top : h.pageY
			}).attr("width", 0).attr("height", 0).show();
			g.canvasTempLeftOriginal = h.pageX;
			g.canvasTempTopOriginal = h.pageY;
			var f = g["draw" + g.settings.mode + "Down"];
			if (f) {
				f(h, g)
			}
		},
		drawShapeMove : function(l, n) {
			var j = n.canvasTempLeftOriginal;
			var f = n.canvasTempTopOriginal;
			var k = n.settings.lineWidth / 2;
			var i = (l.pageX < j ? l.pageX : j)
					- (n.settings.mode == "Line" ? Math.floor(k) : 0);
			var o = (l.pageY < f ? l.pageY : f)
					- (n.settings.mode == "Line" ? Math.floor(k) : 0);
			var g = Math.abs(l.pageX - j)
					+ (n.settings.mode == "Line" ? n.settings.lineWidth : 0);
			var p = Math.abs(l.pageY - f)
					+ (n.settings.mode == "Line" ? n.settings.lineWidth : 0);
			d(n.canvasTemp).css({
				left : i,
				top : o
			}).attr("width", g).attr("height", p);
			n.canvasTempLeftNew = i;
			n.canvasTempTopNew = o;
			var h = n["draw" + n.settings.mode + "Move"];
			if (h) {
				var m = n.settings.mode == "Line" ? 1 : 2;
				l.x = k * m;
				l.y = k * m;
				l.w = g - n.settings.lineWidth * m;
				l.h = p - n.settings.lineWidth * m;
				n.ctxTemp.fillStyle = n.settings.fillStyle;
				n.ctxTemp.strokeStyle = n.settings.strokeStyle;
				n.ctxTemp.lineWidth = n.settings.lineWidth * m;
				h(l, n)
			}
		},
		drawShapeUp : function(h, g) {
			g.ctx.drawImage(g.canvasTemp, g.canvasTempLeftNew,
					g.canvasTempTopNew);
			d(g.canvasTemp).hide();
			var f = g["draw" + g.settings.mode + "Up"];
			if (f) {
				f(h, g)
			}
		},
		drawRectangleMove : function(g, f) {
			f.ctxTemp.beginPath();
			f.ctxTemp.rect(g.x, g.y, g.w, g.h);
			f.ctxTemp.closePath();
			f.ctxTemp.stroke();
			f.ctxTemp.fill()
		},
		drawEllipseMove : function(l, m) {
			var k = 0.5522848;
			var h = (l.w / 2) * k;
			var f = (l.h / 2) * k;
			var n = l.x + l.w;
			var j = l.y + l.h;
			var i = l.x + l.w / 2;
			var g = l.y + l.h / 2;
			m.ctxTemp.beginPath();
			m.ctxTemp.moveTo(l.x, g);
			m.ctxTemp.bezierCurveTo(l.x, g - f, i - h, l.y, i, l.y);
			m.ctxTemp.bezierCurveTo(i + h, l.y, n, g - f, n, g);
			m.ctxTemp.bezierCurveTo(n, g + f, i + h, j, i, j);
			m.ctxTemp.bezierCurveTo(i - h, j, l.x, g + f, l.x, g);
			m.ctxTemp.closePath();
			if (m.settings.lineWidth > 0) {
				m.ctxTemp.stroke()
			}
			m.ctxTemp.fill()
		},
		drawLineMove : function(h, g) {
			var f = g.canvasTempLeftOriginal;
			var i = g.canvasTempTopOriginal;
			if (h.pageX < f) {
				h.x = h.x + h.w;
				h.w = h.w * -1
			}
			if (h.pageY < i) {
				h.y = h.y + h.h;
				h.h = h.h * -1
			}
			g.ctxTemp.lineJoin = "round";
			g.ctxTemp.beginPath();
			g.ctxTemp.moveTo(h.x, h.y);
			g.ctxTemp.lineTo(h.x + h.w, h.y + h.h);
			g.ctxTemp.closePath();
			g.ctxTemp.stroke()
		},
		drawPencilDown : function(g, f) {
			f.ctx.lineJoin = "round";
			f.ctx.lineCap = "round";
			f.ctx.strokeStyle = f.settings.strokeStyle;
			f.ctx.fillStyle = f.settings.strokeStyle;
			f.ctx.lineWidth = f.settings.lineWidth;
			f.ctx.beginPath();
			f.ctx.arc(g.pageX, g.pageY, f.settings.lineWidth / 2, 0,
					Math.PI * 2, true);
			f.ctx.closePath();
			f.ctx.fill();
			f.ctx.beginPath();
			f.ctx.moveTo(g.pageX, g.pageY)
		},
		drawPencilMove : function(g, f) {
			f.ctx.lineTo(g.pageX, g.pageY);
			f.ctx.stroke()
		},
		drawPencilUp : function(g, f) {
			f.ctx.closePath()
		},
		drawEraserDown : function(g, f) {
			f.ctx.save();
			f.ctx.globalCompositeOperation = "destination-out";
			f.drawPencilDown(g, f)
		},
		drawEraserMove : function(g, f) {
			f.drawPencilMove(g, f)
		},
		drawEraserUp : function(g, f) {
			f.drawPencilUp(g, f);
			f.ctx.restore()
		},
		getImage : function() {
			return this.canvas.toDataURL()
		},
		setImage : function(f) {
			var g = this;
			var e = new Image();
			e.src = f;
			g.ctx.clearRect(0, 0, g.canvas.width, g.canvas.height);
			d(e).load(function() {
				g.ctx.drawImage(e, 0, 0)
			})
		}
	};
	function c() {
		this.menu = null;
		return this
	}
	c.prototype = {
		generate : function(e) {
			var k = e;
			var j = this;
			var n = "";
			for ( var g = k.settings.lineWidthMin; g <= k.settings.lineWidthMax; g++) {
				n += '<option value="'
						+ g
						+ '" '
						+ (k.settings.lineWidth == g ? 'selected="selected"'
								: "") + ">" + g + "</option>"
			}
			var h = d(
					'<div class="_wPaint_lineWidth" title="line width"></div>')
					.append(d("<select>" + n + "</select>").change(function(i) {
						k.settings.lineWidth = parseInt(d(this).val())
					}));
			var m = d('<div class="_wPaint_options"></div>')
					.append(
							d(
									'<div class="_wPaint_icon _wPaint_rectangle" title="rectangle"></div>')
									.click(function() {
										j.set_mode(j, k, "Rectangle")
									}))
					.append(
							d(
									'<div class="_wPaint_icon _wPaint_ellipse" title="ellipse"></div>')
									.click(function() {
										j.set_mode(j, k, "Ellipse")
									}))
					.append(
							d(
									'<div class="_wPaint_icon _wPaint_line" title="line"></div>')
									.click(function() {
										j.set_mode(j, k, "Line")
									}))
					.append(
							d(
									'<div class="_wPaint_icon _wPaint_pencil" title="pencil"></div>')
									.click(function() {
										j.set_mode(j, k, "Pencil")
									}))
					.append(
							d(
									'<div class="_wPaint_icon _wPaint_eraser" title="eraser"></div>')
									.click(function(i) {
										j.set_mode(j, k, "Eraser")
									}))
					.append(
							d('<div class="_wPaint_fillColorPicker _wPaint_colorPicker" title="fill color"></div>'))
					.append(h)
					.append(
							d('<div class="_wPaint_strokeColorPicker _wPaint_colorPicker" title="stroke color"></div>'));
			var l = d('<div class="_wPaint_handle"></div>');
			var f = d(k.canvas).offset();
			return this.menu = d(
					'<div id="_wPaint_menu" class="_wPaint_menu"></div>').css({
				position : "absolute",
				left : f.left + 5,
				top : f.top + 5
			}).draggable({
				handle : l
			}).append(l).append(m)
		},
		set_mode : function(f, e, g) {
			e.settings.mode = g;
			f.menu.find("._wPaint_icon").removeClass("active");
			f.menu.find("._wPaint_" + g.toLowerCase()).addClass("active")
		}
	}
})(jQuery);/*******************************************************************************
 * Websanova.com
 * 
 * Resources for web entrepreneurs
 * 
 * @author Websanova
 * @copyright Copyright (c) 2012 Websanova.
 * @license This wPaint jQuery plug-in is dual licensed under the MIT and GPL
 *          licenses.
 * @link http://www.websanova.com
 * @docs http://www.websanova.com/plugins/websanova/paint
 * @version Version 1.3
 * 
 ******************************************************************************/
(function(d) {
	var b = [ "Rectangle", "Ellipse", "Line" ];
	d.fn.wPaint = function(f, e) {
		if (typeof f === "object") {
			e = f
		} else {
			if (typeof f == "string") {
				var h = this.data("_wPaint_canvas");
				var g = true;
				if (h) {
					if (f == "image" && e === undefined) {
						return h.getImage()
					} else {
						if (f == "image" && e !== undefined) {
							h.setImage(e)
						} else {
							if (d.fn.wPaint.defaultSettings[f] !== undefined) {
								if (e !== undefined) {
									h.settings[f] = e
								} else {
									return h.settings[f]
								}
							} else {
								g = false
							}
						}
					}
				} else {
					g = false
				}
				return g
			}
		}
		e = d.extend({}, d.fn.wPaint.defaultSettings, e || {});
		e.lineWidthMin = parseInt(e.lineWidthMin);
		e.lineWidthMax = parseInt(e.lineWidthMax);
		e.lineWidth = parseInt(e.lineWidth);
		return this
				.each(function() {
					var l = d(this);
					var k = jQuery.extend(true, {}, e);
					var n = document.createElement("canvas");
					if (!n.getContext) {
						l
								.html("Browser does not support HTML5 canvas, please upgrade to a more modern browser.");
						return false
					}
					var j = new a(k);
					var m = new c();
					l.append(j.generate(l.width(), l.height()));
					l.append(j.generateTemp());
					d("body").append(m.generate(j));
					m.set_mode(m, j, k.mode);
					var i = d("._wPaint_icon").outerHeight()
							- (parseInt(d("._wPaint_icon").css("paddingTop")
									.split("px")[0]) + parseInt(d(
									"._wPaint_icon").css("paddingBottom")
									.split("px")[0]));
					m.menu.find("._wPaint_fillColorPicker").wColorPicker({
						mode : "click",
						initColor : k.fillStyle,
						buttonSize : i,
						onSelect : function(o) {
							j.settings.fillStyle = o
						}
					});
					m.menu.find("._wPaint_strokeColorPicker").wColorPicker({
						mode : "click",
						initColor : k.strokeStyle,
						buttonSize : i,
						onSelect : function(o) {
							j.settings.strokeStyle = o
						}
					});
					if (k.image) {
						j.setImage(k.image)
					}
					l.data("_wPaint_canvas", j)
				})
	};
	d.fn.wPaint.defaultSettings = {
		mode : "Pencil",
		lineWidthMin : "0",
		lineWidthMax : "10",
		lineWidth : "2",
		fillStyle : "#FFFFFF",
		strokeStyle : "#FFFF00",
		image : null,
		drawDown : null,
		drawMove : null,
		drawUp : null
	};
	function a(e) {
		this.settings = e;
		this.draw = false;
		this.canvas = null;
		this.ctx = null;
		this.canvasTemp = null;
		this.ctxTemp = null;
		this.canvasTempLeftOriginal = null;
		this.canvasTempTopOriginal = null;
		this.canvasTempLeftNew = null;
		this.canvasTempTopNew = null;
		return this
	}
	a.prototype = {
		generate : function(f, e) {
			this.canvas = document.createElement("canvas");
			this.ctx = this.canvas.getContext("2d");
			var g = this;
			d(this.canvas).attr("width", f + "px").attr("height", e + "px")
					.css({
						position : "absolute",
						left : 0,
						top : 0
					}).mousedown(function(h) {
						h.preventDefault();
						h.stopPropagation();
						g.draw = true;
						g.callFunc(h, g, "Down")
					});
			d(document).mousemove(function(h) {
				if (g.draw) {
					g.callFunc(h, g, "Move")
				}
			}).mouseup(function(h) {
				if (g.draw) {
					g.draw = false;
					g.callFunc(h, g, "Up")
				}
			});
			return d(this.canvas)
		},
		generateTemp : function() {
			this.canvasTemp = document.createElement("canvas");
			this.ctxTemp = this.canvasTemp.getContext("2d");
			d(this.canvasTemp).css({
				position : "absolute"
			}).hide();
			return d(this.canvasTemp)
		},
		callFunc : function(j, i, h) {
			$e = jQuery.extend(true, {}, j);
			var f = d(i.canvas).offset();
			$e.pageX = Math.floor($e.pageX - f.left);
			$e.pageY = Math.floor($e.pageY - f.top);
			var k = d.inArray(i.settings.mode, b) > -1 ? "Shape"
					: i.settings.mode;
			var g = i["draw" + k + "" + h];
			if (g) {
				g($e, i)
			}
		},
		drawShapeDown : function(h, g) {
			d(g.canvasTemp).css({
				left : h.pageX,
				top : h.pageY
			}).attr("width", 0).attr("height", 0).show();
			g.canvasTempLeftOriginal = h.pageX;
			g.canvasTempTopOriginal = h.pageY;
			var f = g["draw" + g.settings.mode + "Down"];
			if (f) {
				f(h, g)
			}
		},
		drawShapeMove : function(l, n) {
			var j = n.canvasTempLeftOriginal;
			var f = n.canvasTempTopOriginal;
			var k = n.settings.lineWidth / 2;
			var i = (l.pageX < j ? l.pageX : j)
					- (n.settings.mode == "Line" ? Math.floor(k) : 0);
			var o = (l.pageY < f ? l.pageY : f)
					- (n.settings.mode == "Line" ? Math.floor(k) : 0);
			var g = Math.abs(l.pageX - j)
					+ (n.settings.mode == "Line" ? n.settings.lineWidth : 0);
			var p = Math.abs(l.pageY - f)
					+ (n.settings.mode == "Line" ? n.settings.lineWidth : 0);
			d(n.canvasTemp).css({
				left : i,
				top : o
			}).attr("width", g).attr("height", p);
			n.canvasTempLeftNew = i;
			n.canvasTempTopNew = o;
			var h = n["draw" + n.settings.mode + "Move"];
			if (h) {
				var m = n.settings.mode == "Line" ? 1 : 2;
				l.x = k * m;
				l.y = k * m;
				l.w = g - n.settings.lineWidth * m;
				l.h = p - n.settings.lineWidth * m;
				n.ctxTemp.fillStyle = n.settings.fillStyle;
				n.ctxTemp.strokeStyle = n.settings.strokeStyle;
				n.ctxTemp.lineWidth = n.settings.lineWidth * m;
				h(l, n)
			}
		},
		drawShapeUp : function(h, g) {
			g.ctx.drawImage(g.canvasTemp, g.canvasTempLeftNew,
					g.canvasTempTopNew);
			d(g.canvasTemp).hide();
			var f = g["draw" + g.settings.mode + "Up"];
			if (f) {
				f(h, g)
			}
		},
		drawRectangleMove : function(g, f) {
			f.ctxTemp.beginPath();
			f.ctxTemp.rect(g.x, g.y, g.w, g.h);
			f.ctxTemp.closePath();
			f.ctxTemp.stroke();
			f.ctxTemp.fill()
		},
		drawEllipseMove : function(l, m) {
			var k = 0.5522848;
			var h = (l.w / 2) * k;
			var f = (l.h / 2) * k;
			var n = l.x + l.w;
			var j = l.y + l.h;
			var i = l.x + l.w / 2;
			var g = l.y + l.h / 2;
			m.ctxTemp.beginPath();
			m.ctxTemp.moveTo(l.x, g);
			m.ctxTemp.bezierCurveTo(l.x, g - f, i - h, l.y, i, l.y);
			m.ctxTemp.bezierCurveTo(i + h, l.y, n, g - f, n, g);
			m.ctxTemp.bezierCurveTo(n, g + f, i + h, j, i, j);
			m.ctxTemp.bezierCurveTo(i - h, j, l.x, g + f, l.x, g);
			m.ctxTemp.closePath();
			if (m.settings.lineWidth > 0) {
				m.ctxTemp.stroke()
			}
			m.ctxTemp.fill()
		},
		drawLineMove : function(h, g) {
			var f = g.canvasTempLeftOriginal;
			var i = g.canvasTempTopOriginal;
			if (h.pageX < f) {
				h.x = h.x + h.w;
				h.w = h.w * -1
			}
			if (h.pageY < i) {
				h.y = h.y + h.h;
				h.h = h.h * -1
			}
			g.ctxTemp.lineJoin = "round";
			g.ctxTemp.beginPath();
			g.ctxTemp.moveTo(h.x, h.y);
			g.ctxTemp.lineTo(h.x + h.w, h.y + h.h);
			g.ctxTemp.closePath();
			g.ctxTemp.stroke()
		},
		drawPencilDown : function(g, f) {
			f.ctx.lineJoin = "round";
			f.ctx.lineCap = "round";
			f.ctx.strokeStyle = f.settings.strokeStyle;
			f.ctx.fillStyle = f.settings.strokeStyle;
			f.ctx.lineWidth = f.settings.lineWidth;
			f.ctx.beginPath();
			f.ctx.arc(g.pageX, g.pageY, f.settings.lineWidth / 2, 0,
					Math.PI * 2, true);
			f.ctx.closePath();
			f.ctx.fill();
			f.ctx.beginPath();
			f.ctx.moveTo(g.pageX, g.pageY)
		},
		drawPencilMove : function(g, f) {
			f.ctx.lineTo(g.pageX, g.pageY);
			f.ctx.stroke()
		},
		drawPencilUp : function(g, f) {
			f.ctx.closePath()
		},
		drawEraserDown : function(g, f) {
			f.ctx.save();
			f.ctx.globalCompositeOperation = "destination-out";
			f.drawPencilDown(g, f)
		},
		drawEraserMove : function(g, f) {
			f.drawPencilMove(g, f)
		},
		drawEraserUp : function(g, f) {
			f.drawPencilUp(g, f);
			f.ctx.restore()
		},
		getImage : function() {
			return this.canvas.toDataURL()
		},
		setImage : function(f) {
			var g = this;
			var e = new Image();
			e.src = f;
			g.ctx.clearRect(0, 0, g.canvas.width, g.canvas.height);
			d(e).load(function() {
				g.ctx.drawImage(e, 0, 0)
			})
		}
	};
	function c() {
		this.menu = null;
		return this
	}
	c.prototype = {
		generate : function(e) {
			var k = e;
			var j = this;
			var n = "";
			for ( var g = k.settings.lineWidthMin; g <= k.settings.lineWidthMax; g++) {
				n += '<option value="'
						+ g
						+ '" '
						+ (k.settings.lineWidth == g ? 'selected="selected"'
								: "") + ">" + g + "</option>"
			}
			var h = d(
					'<div class="_wPaint_lineWidth" title="line width"></div>')
					.append(d("<select>" + n + "</select>").change(function(i) {
						k.settings.lineWidth = parseInt(d(this).val())
					}));
			var m = d('<div class="_wPaint_options"></div>')
					.append(
							d(
									'<div class="_wPaint_icon _wPaint_rectangle" title="rectangle"></div>')
									.click(function() {
										j.set_mode(j, k, "Rectangle")
									}))
					.append(
							d(
									'<div class="_wPaint_icon _wPaint_ellipse" title="ellipse"></div>')
									.click(function() {
										j.set_mode(j, k, "Ellipse")
									}))
					.append(
							d(
									'<div class="_wPaint_icon _wPaint_line" title="line"></div>')
									.click(function() {
										j.set_mode(j, k, "Line")
									}))
					.append(
							d(
									'<div class="_wPaint_icon _wPaint_pencil" title="pencil"></div>')
									.click(function() {
										j.set_mode(j, k, "Pencil")
									}))
					.append(
							d(
									'<div class="_wPaint_icon _wPaint_eraser" title="eraser"></div>')
									.click(function(i) {
										j.set_mode(j, k, "Eraser")
									}))
					.append(
							d('<div class="_wPaint_fillColorPicker _wPaint_colorPicker" title="fill color"></div>'))
					.append(h)
					.append(
							d('<div class="_wPaint_strokeColorPicker _wPaint_colorPicker" title="stroke color"></div>'));
			var l = d('<div class="_wPaint_handle"></div>');
			var f = d(k.canvas).offset();
			return this.menu = d(
					'<div id="_wPaint_menu" class="_wPaint_menu"></div>').css({
				position : "absolute",
				left : f.left + 5,
				top : f.top + 5
			}).draggable({
				handle : l
			}).append(l).append(m)
		},
		set_mode : function(f, e, g) {
			e.settings.mode = g;
			f.menu.find("._wPaint_icon").removeClass("active");
			f.menu.find("._wPaint_" + g.toLowerCase()).addClass("active")
		}
	}
})(jQuery);function on_load() 
{
	makeSubShape(4, 1, 120, '#content')
	template = $("#posts").html();
    $('#content').append(_.template(template,{"array":array}));
    $('.vahaksucks').each(function(index){
        $(this).hide(0);
    });
}

function on_load2(){
	template = $("#posts").html();
    $('#pending').append(_.template(template,{"array":array}));
}


// ######## SHAPES ######## // 

function makeShape(dataID, Armenian, English, Place, Name, NameArm, leDate, Votes, idcount, size, color, ondiv)
{
	var canvas = document.createElement('canvas');
	
	console.log(color);
	canvas.color = color
	canvas.id = "canvas";
	canvas.width = size;
	canvas.height = size;

	canvas.setAttribute('number', idcount)
	canvas.setAttribute('dataID', dataID)
	canvas.setAttribute('Armenian', Armenian)
	canvas.setAttribute('English', English)
	canvas.setAttribute('Place', Place)
	canvas.setAttribute('Name', Name)
	canvas.setAttribute('NameArm', NameArm)
	canvas.setAttribute('Date', leDate)
	canvas.setAttribute('Votes', Votes)
	canvas.setAttribute('Place', Place)
	canvas.setAttribute('prevClicked', 0)

	$('#content').append(canvas);
	
	drawShapeUp(canvas)
}

function makeSubShape(Votes, idcount, size, ondiv)
{
	var canvas = document.createElement('canvas');

	canvas.color = "#FFD464"
	canvas.id = "canvas";
	//canvas.id = "submitShape";
	canvas.width = size;
	canvas.height = size;

	canvas.setAttribute('number', idcount)
	canvas.setAttribute('Votes', Votes)
	canvas.setAttribute('prevClicked', 0)

	$('#content').append(canvas);
	
	drawShapeUp(canvas)
}

function makeShapeHull(size, sides, ondiv, isSubmit, isChecked)
{
	var canvas = document.createElement('canvas');
	canvas.id = "hull"

	if (isSubmit)
		canvas.style.marginTop = "3px"


	width = size
	height = size
	canvas.width = width
	canvas.height = height

	if (isChecked)
	{
		canvas.checked =  true;
		canvas.setAttribute('Sides', parseInt(sides) - 1)
	}
	else
	{
		canvas.checked =  false;
		canvas.setAttribute('Sides', parseInt(sides))
	}

	$(ondiv).append(canvas);

	drawShapeHull(canvas, sides)
}


function drawShapeUp(canvasIn)
{	
	var canvas = canvasIn

	id = $(canvas).attr('number')
	sides = $(canvas).attr('Votes')
	width = canvas.width
	height = canvas.height
	color = canvas.color

	var graphics = canvas.getContext("2d");

	// clear
	graphics.clearRect(0,0,width,height);
	canvas.width = canvas.width;
	
	// draw
	offset = 5
	fill = true
	stroke = false
	shapeGraphics(graphics, color, width, sides, offset, fill, stroke)


	// text
	graphics.fillStyle = "#FFFFFF";;
	graphics.textAlign="center"

	if (id == 1)
	{
		graphics.font = 'bold 33pt arial';
		graphics.fillText(armConvert(-1),width/2,height/2 + 16);
	}
	else
	{
		graphics.font = 'normal 27pt arian_amu';
		graphics.fillText(armConvert(sides),width/2,height/2 + 13);
	}
}

function drawShapeDown(canvasIn)
{
	var canvas = canvasIn

	id = $(canvas).attr('number')
	sides = $(canvas).attr('Votes')
	width = canvas.width
	height = canvas.height
	color = canvas.color
	color = '#FFFFFF'

	var graphics = canvas.getContext("2d");

	graphics.globalAlpha   = 0.2;
	
	offset = 5
	fill = true
	stroke = false

	shapeGraphics(graphics, color, width, sides, offset, fill, stroke)
}


function drawShapeHull(canvasIn, sides, check)
{
	var canvas = canvasIn
	width = canvas.width
	height = canvas.height
	var graphics = canvas.getContext("2d");

	// clear
	graphics.clearRect(0,0,width,height);
	canvas.width = canvas.width;

	fix = 0.5;
	middle = width/2;

	if (check)
	{
		fix = 0;
		//check
		graphics.moveTo(middle - 6 + fix - 2, middle + fix);
		graphics.lineTo(middle + fix - 2, middle + 6 + fix); 
		graphics.lineTo(middle + 12 + fix - 2, middle - 6 + fix);
	}
	else
	{
		// +
		graphics.moveTo(middle + fix,middle - 8 + fix);
		graphics.lineTo(middle + fix, middle + 8 + fix);
		graphics.moveTo(middle - 8 + fix, middle + fix); 
		graphics.lineTo(middle + 8 + fix, middle + fix);
	}

	// draw
	graphics.stroke()
	offset = 5
	fill = false
	stroke = true
	shapeGraphics(graphics, color, width, sides, offset, fill, stroke)
} 

function shapeGraphics(graphics, color, width, sides, offset, fill, stroke)
{
	graphics.fillStyle = color
	graphics.strokeStyle = "#000000"
	graphics.lineWidth=1;

	if(sides == 3)
		pushdown = 4;
	else
		pushdown = 0;

	graphics.beginPath();
	graphics.moveTo(width/2,offset);  

	
	rad = width/2 - offset
	angle = (sides-2) * Math.PI/sides

	for (var i=1;i<=sides-1;i++)
	{ 
		l = Math.sqrt(2*rad*rad*(1 - Math.cos((Math.PI*2/sides) * i)))
		pointx = l * Math.cos((Math.PI/2 - angle/2)*i)
		pointy = l * Math.sin((Math.PI/2 - angle/2)*i) + offset	+ pushdown
		graphics.lineTo(pointx + width/2 , pointy); 
	}
	graphics.closePath();

	if (fill)
		graphics.fill()
	if (stroke)
		graphics.stroke()
}

function placeArrowBar(ondiv)
{
	var canvas = document.createElement('canvas');

	position = ondiv.attr('number');
	canvas.id = "arrowBar";
	canvas.height = 30
	canvas.width = 600

	var graphics = canvas.getContext("2d");

	graphics.strokeStyle = "#000000"
	graphics.lineWidth = "1";

	fix = 0.5
	start = ((position-1)%4) * 150 + 75 - 20

	graphics.beginPath();
	graphics.moveTo(start + fix,0 + fix);  

	graphics.lineTo(start + 6 + fix, 6 + fix); 
	graphics.moveTo(start + fix, 0 + fix); 
	graphics.lineTo(start - 6 + fix, 6 + fix); 

	graphics.moveTo(0 + fix, 15 + fix);
	graphics.lineTo(start + fix, 15+ fix); 
	graphics.lineTo(start + fix, 1 + fix);  


	graphics.stroke();

	$(ondiv).append(canvas);
}



// ######## Shape CLICK ######## // 

$('#content').on('click', '#canvas',  function(e) 
{
    e.preventDefault();

    prevClicked = $(this).attr('prevClicked')
    clickedBefore = $(this).hasClass('clickedBefore');
    clickid = $(this).attr('number')
    Votes = $(this).attr('Votes')
	htmlstring = getVSHtml($(this), clickid == 1);
	drawShapeUp($(this)[0]);
	drawShapeDown($(this)[0])

    if (clickid == prevClicked){
    	// If this shaped was already clicked
    	//drawShapeDown($(this)[0])

   		$('.vahaksucks').each(function(index){
			$(this).hide('fast');

			// set prevClicked on all shapes back to 0
			$('canvas').each(function()
		    {
		    	if ($(this).prop('id') == "canvas")
					$(this).attr("prevClicked", 0);
		    });
			
        });
    }
    else
    {
    	//drawShapeDown($(this)[0]);
        $('canvas').each(function(index, obj)
        {
        	if($(this).prop('id') == "canvas" && $(this).attr('number') != clickid)
            	drawShapeUp($(this)[0]);
        });

    	$('.vahaksucks').each(function(index){
    		if ($(this).attr('number') == clickid)
    		{
    			if (!clickedBefore)
    			{
    				fillVS($(this), htmlstring, false)
				}
				if(Math.floor((clickid-1)/4) == Math.floor((prevClicked-1)/4) && clickid != prevClicked)
    				$(this).show();
    			else
					$(this).show('fast');	
    		}
    		else
    		{
				if(Math.floor((clickid-1)/4) == Math.floor((prevClicked-1)/4) && clickid != prevClicked)
    				$(this).hide();
    			else
					$(this).hide('fast');	
    		}
    	});

    	$('canvas').each(function()
	    {
	    	if ($(this).prop('id') == "canvas")
	        	$(this).attr("prevClicked", clickid);
	    });
    };

    if (!clickedBefore)
    	$(this).toggleClass("clickedBefore");
});



// ######## Mouse over/out ######## //

//Canvas

$('#content').on('mouseover', '#canvas',  function(e) {
		e.preventDefault();
		if ($(this).attr('number') != $(this).attr('prevClicked'))
		{
			drawShapeDown($(this)[0])
		}			
});

$('#content').on('mouseout', '#canvas',  function(e) {
		e.preventDefault();
		if ($(this).attr('number') != $(this).attr('prevClicked'))
		{
			drawShapeUp($(this)[0])
		}
			
});

//Hull

$('#content').on('mouseover', '#hull',  function(e) {
		e.preventDefault();
		sides = $(this).attr('Sides')
		drawShapeHull($(this)[0], parseInt(sides) + 1, true)
			
});

$('#content').on('mouseout', '#hull',  function(e) {
		e.preventDefault();
		sides = $(this).attr('Sides')
		if (!$(this).prop('checked'))
		{
			drawShapeHull($(this)[0], parseInt(sides), false)
		}		
});


// ######## onCLICK ######## //

$('#content').on('click', '#hull',  function(e) {
	e.preventDefault();
	if(!$(this).prop('checked'))
	{
		clickid = $(this).parent().attr('number')

		// check if submit hull
		if(clickid == 1)
		{
			$.post( 
		     "insert.php",
		     {english: $('#english').val(), armenian: $('#armenian').val(), engName: $('#engName').val(), armName: $('#armName').val(), location: $('#location').val()},
		     function(data) {
		        $('#page').append(data);
		 	});
		}
		else
		{
			$('canvas').each(function()
		    {
		    	canvasEl = $(this)
		    	if (canvasEl.prop('id') == "canvas" && canvasEl.attr('number') == clickid)
		    	{
		        	dataID = canvasEl.attr('dataID');
		        	$.post( 
					     "upvote.php",
					     {ID: canvasEl.attr('dataID')},
					     function(data) {
					        console.log('upvoted')
				 	});

				 	// redraw shape
				 	canvasEl.attr('Votes', parseInt(canvasEl.attr('Votes')) +1);
				 	drawShapeUp($(this)[0])
				 	drawShapeDown($(this)[0])

				 	// refill VS
				 	$('.vahaksucks').each(function(index){
			    		if ($(this).attr('number') == clickid)
			    		{
			    			$(this).html("");
				 			fillVS($(this), getVSHtml(canvasEl, false), true);
				 		}
				 	});
		        }
		    });	
			
		}
	}
	$(this).prop('checked', true)
});

// Click pending

$('#pending').on('click', '#live',  function(e) {
	e.preventDefault();
	console.log($(this).attr('id_number'));
	$.post( 
     "../update.php",
     {ID: $(this).attr('id_number')},
     function(data) {
        location.reload(true)
 	});

});


$('#pending').on('click', '#kill',  function(e) {
	e.preventDefault();
	console.log("KILL");
	$.post( 
     "../kill.php",
     {ID: $(this).attr('id_number')},
     function(data) {
        location.reload(true)
 	});
});

$('#pending').on('click', '#delete',  function(e) {
	e.preventDefault();
	console.log("DELETED");
	$.post( 
     "../delete.php",
     {ID: $(this).attr('id_number')},
     function(data) {
        location.reload(true)
 	});
});


$('#pending').on('click', '#edit',  function(e) {
	e.preventDefault();
	console.log("id:", $(this).attr('id_number'), "arm:", $(this).siblings("#Armenian").val(), "eng:", $(this).siblings("#English").val(), "pla:", $(this).siblings("#Place").val(), "name:", $(this).siblings("#Name").val(), "armname:", $(this).siblings("#NameArm").val());
	$.post( 
     "../edit.php",
     {ID: $(this).attr('id_number'), armenian: $(this).siblings("#Armenian").val(), english: $(this).siblings("#English").val(), place: $(this).siblings("#Place").val(), name: $(this).siblings("#Name").val(), namearm: $(this).siblings("#NameArm").val()},
     function(data) {
        location.reload(true)
     });
 });


// ######## OTHER ######## // 

function rounder (number){
	remainder = number%4
		if (remainder == 0){
			return number
		}
		else{
			return Number(number) + 4 - remainder;
	};
}



function armConvert(number)
{	
	// submit case
	if (number == -1)
	{
		return "+"
	}
	//

	var letters = new Array("Ա","Բ","Գ","Դ","Ե","Զ","Է","Ը","Թ","Ժ","Ի","Լ","Խ","Ծ","Կ","Հ","Ձ","Ղ","Ճ","Մ","Յ","Ն","Շ","Ո","Չ","Պ","Ջ","Ռ","Ս","Վ","Տ","Ր","Ց","Ւ","Փ","Ք");
	round = 0
	outcome = ""
	while (number != 0)
	{
		curr = number % 10;
		number = Math.floor(number / 10);
		if (curr != 0)
		{
			outcome =  letters[curr + 10*round - (round +1)] + outcome;
		}
		round += 1;
	}
	return (outcome)
}

function getVSHtml(canvas, isSubmit)
{
	if(isSubmit)
	{
	    htmlstring = "  <div class='submittext'> \
					<input type='textbox' class='contentBox' id='english' placeholder='In English'></input> \
					<input type='textbox' class='contentBox' id='armenian' placeholder='Հայերենով'></input> \
					<input type='textbox' class='infoBox' id='engName' placeholder='Name in English'></input> \
					<input type='textbox' class='infoBox' id='armName' placeholder='Անունդ Հայերենով'></input> \
					<input type='textbox' class='infoBox' id='location' placeholder='Location'></input> \
				</div> "

	}
	else
	{

		Armenian = canvas.attr('Armenian')
	    English = canvas.attr('English')
	    Place = canvas.attr('Place')
	    Name = canvas.attr('Name')
	    NameArm = canvas.attr('NameArm')
	    leDate = canvas.attr('Date')
	    Votes = canvas.attr('Votes')

	    // other shape vahaksucks html
	    htmlstring = "	<span class='engFont'> In " +Place+", <br>	\
	    				"+Name+" Thought: '"+English+"'  <br>	\
	    				</span> <span class='armFont'> "+NameArm+"ը ըսավ: '"+Armenian+"'  <br> \
	    				Զինքը վաստակած է "+Votes+" կողմ: </span> 	"	
	}
	
    return (htmlstring)
}

function fillVS(vsElement, htmlstring, isHullChecked)
{
	placeArrowBar(vsElement);

	if(clickid == 1)
		makeShapeHull(80, 3, vsElement, true, isHullChecked)
	else
		makeShapeHull(80, Votes, vsElement, false, isHullChecked)

	vsElement.append(htmlstring);
}function on_load() 
{
	makeSubShape(4, 1, 120, '#content')
	template = $("#posts").html();
    $('#content').append(_.template(template,{"array":array}));
    $('.vahaksucks').each(function(index){
        $(this).hide(0);
    });
}

function on_load2(){
	template = $("#posts").html();
    $('#pending').append(_.template(template,{"array":array}));
}


// ######## SHAPES ######## // 

function makeShape(dataID, Armenian, English, Place, Name, NameArm, leDate, Votes, idcount, size, color, ondiv)
{
	var canvas = document.createElement('canvas');
	
	console.log(color);
	canvas.color = color
	canvas.id = "canvas";
	canvas.width = size;
	canvas.height = size;

	canvas.setAttribute('number', idcount)
	canvas.setAttribute('dataID', dataID)
	canvas.setAttribute('Armenian', Armenian)
	canvas.setAttribute('English', English)
	canvas.setAttribute('Place', Place)
	canvas.setAttribute('Name', Name)
	canvas.setAttribute('NameArm', NameArm)
	canvas.setAttribute('Date', leDate)
	canvas.setAttribute('Votes', Votes)
	canvas.setAttribute('Place', Place)
	canvas.setAttribute('prevClicked', 0)

	$('#content').append(canvas);
	
	drawShapeUp(canvas)
}

function makeSubShape(Votes, idcount, size, ondiv)
{
	var canvas = document.createElement('canvas');

	canvas.color = "#FFD464"
	canvas.id = "canvas";
	//canvas.id = "submitShape";
	canvas.width = size;
	canvas.height = size;

	canvas.setAttribute('number', idcount)
	canvas.setAttribute('Votes', Votes)
	canvas.setAttribute('prevClicked', 0)

	$('#content').append(canvas);
	
	drawShapeUp(canvas)
}

function makeShapeHull(size, sides, ondiv, isSubmit, isChecked)
{
	var canvas = document.createElement('canvas');
	canvas.id = "hull"

	if (isSubmit)
		canvas.style.marginTop = "3px"


	width = size
	height = size
	canvas.width = width
	canvas.height = height

	if (isChecked)
	{
		canvas.checked =  true;
		canvas.setAttribute('Sides', parseInt(sides) - 1)
	}
	else
	{
		canvas.checked =  false;
		canvas.setAttribute('Sides', parseInt(sides))
	}

	$(ondiv).append(canvas);

	drawShapeHull(canvas, sides)
}


function drawShapeUp(canvasIn)
{	
	var canvas = canvasIn

	id = $(canvas).attr('number')
	sides = $(canvas).attr('Votes')
	width = canvas.width
	height = canvas.height
	color = canvas.color

	var graphics = canvas.getContext("2d");

	// clear
	graphics.clearRect(0,0,width,height);
	canvas.width = canvas.width;
	
	// draw
	offset = 5
	fill = true
	stroke = false
	shapeGraphics(graphics, color, width, sides, offset, fill, stroke)


	// text
	graphics.fillStyle = "#FFFFFF";;
	graphics.textAlign="center"

	if (id == 1)
	{
		graphics.font = 'bold 33pt arial';
		graphics.fillText(armConvert(-1),width/2,height/2 + 16);
	}
	else
	{
		graphics.font = 'normal 27pt arian_amu';
		graphics.fillText(armConvert(sides),width/2,height/2 + 13);
	}
}

function drawShapeDown(canvasIn)
{
	var canvas = canvasIn

	id = $(canvas).attr('number')
	sides = $(canvas).attr('Votes')
	width = canvas.width
	height = canvas.height
	color = canvas.color
	color = '#FFFFFF'

	var graphics = canvas.getContext("2d");

	graphics.globalAlpha   = 0.2;
	
	offset = 5
	fill = true
	stroke = false

	shapeGraphics(graphics, color, width, sides, offset, fill, stroke)
}


function drawShapeHull(canvasIn, sides, check)
{
	var canvas = canvasIn
	width = canvas.width
	height = canvas.height
	var graphics = canvas.getContext("2d");

	// clear
	graphics.clearRect(0,0,width,height);
	canvas.width = canvas.width;

	fix = 0.5;
	middle = width/2;

	if (check)
	{
		fix = 0;
		//check
		graphics.moveTo(middle - 6 + fix - 2, middle + fix);
		graphics.lineTo(middle + fix - 2, middle + 6 + fix); 
		graphics.lineTo(middle + 12 + fix - 2, middle - 6 + fix);
	}
	else
	{
		// +
		graphics.moveTo(middle + fix,middle - 8 + fix);
		graphics.lineTo(middle + fix, middle + 8 + fix);
		graphics.moveTo(middle - 8 + fix, middle + fix); 
		graphics.lineTo(middle + 8 + fix, middle + fix);
	}

	// draw
	graphics.stroke()
	offset = 5
	fill = false
	stroke = true
	shapeGraphics(graphics, color, width, sides, offset, fill, stroke)
} 

function shapeGraphics(graphics, color, width, sides, offset, fill, stroke)
{
	graphics.fillStyle = color
	graphics.strokeStyle = "#000000"
	graphics.lineWidth=1;

	if(sides == 3)
		pushdown = 4;
	else
		pushdown = 0;

	graphics.beginPath();
	graphics.moveTo(width/2,offset);  

	
	rad = width/2 - offset
	angle = (sides-2) * Math.PI/sides

	for (var i=1;i<=sides-1;i++)
	{ 
		l = Math.sqrt(2*rad*rad*(1 - Math.cos((Math.PI*2/sides) * i)))
		pointx = l * Math.cos((Math.PI/2 - angle/2)*i)
		pointy = l * Math.sin((Math.PI/2 - angle/2)*i) + offset	+ pushdown
		graphics.lineTo(pointx + width/2 , pointy); 
	}
	graphics.closePath();

	if (fill)
		graphics.fill()
	if (stroke)
		graphics.stroke()
}

function placeArrowBar(ondiv)
{
	var canvas = document.createElement('canvas');

	position = ondiv.attr('number');
	canvas.id = "arrowBar";
	canvas.height = 30
	canvas.width = 600

	var graphics = canvas.getContext("2d");

	graphics.strokeStyle = "#000000"
	graphics.lineWidth = "1";

	fix = 0.5
	start = ((position-1)%4) * 150 + 75 - 20

	graphics.beginPath();
	graphics.moveTo(start + fix,0 + fix);  

	graphics.lineTo(start + 6 + fix, 6 + fix); 
	graphics.moveTo(start + fix, 0 + fix); 
	graphics.lineTo(start - 6 + fix, 6 + fix); 

	graphics.moveTo(0 + fix, 15 + fix);
	graphics.lineTo(start + fix, 15+ fix); 
	graphics.lineTo(start + fix, 1 + fix);  


	graphics.stroke();

	$(ondiv).append(canvas);
}



// ######## Shape CLICK ######## // 

$('#content').on('click', '#canvas',  function(e) 
{
    e.preventDefault();

    prevClicked = $(this).attr('prevClicked')
    clickedBefore = $(this).hasClass('clickedBefore');
    clickid = $(this).attr('number')
    Votes = $(this).attr('Votes')
	htmlstring = getVSHtml($(this), clickid == 1);
	drawShapeUp($(this)[0]);
	drawShapeDown($(this)[0])

    if (clickid == prevClicked){
    	// If this shaped was already clicked
    	//drawShapeDown($(this)[0])

   		$('.vahaksucks').each(function(index){
			$(this).hide('fast');

			// set prevClicked on all shapes back to 0
			$('canvas').each(function()
		    {
		    	if ($(this).prop('id') == "canvas")
					$(this).attr("prevClicked", 0);
		    });
			
        });
    }
    else
    {
    	//drawShapeDown($(this)[0]);
        $('canvas').each(function(index, obj)
        {
        	if($(this).prop('id') == "canvas" && $(this).attr('number') != clickid)
            	drawShapeUp($(this)[0]);
        });

    	$('.vahaksucks').each(function(index){
    		if ($(this).attr('number') == clickid)
    		{
    			if (!clickedBefore)
    			{
    				fillVS($(this), htmlstring, false)
				}
				if(Math.floor((clickid-1)/4) == Math.floor((prevClicked-1)/4) && clickid != prevClicked)
    				$(this).show();
    			else
					$(this).show('fast');	
    		}
    		else
    		{
				if(Math.floor((clickid-1)/4) == Math.floor((prevClicked-1)/4) && clickid != prevClicked)
    				$(this).hide();
    			else
					$(this).hide('fast');	
    		}
    	});

    	$('canvas').each(function()
	    {
	    	if ($(this).prop('id') == "canvas")
	        	$(this).attr("prevClicked", clickid);
	    });
    };

    if (!clickedBefore)
    	$(this).toggleClass("clickedBefore");
});



// ######## Mouse over/out ######## //

//Canvas

$('#content').on('mouseover', '#canvas',  function(e) {
		e.preventDefault();
		if ($(this).attr('number') != $(this).attr('prevClicked'))
		{
			drawShapeDown($(this)[0])
		}			
});

$('#content').on('mouseout', '#canvas',  function(e) {
		e.preventDefault();
		if ($(this).attr('number') != $(this).attr('prevClicked'))
		{
			drawShapeUp($(this)[0])
		}
			
});

//Hull

$('#content').on('mouseover', '#hull',  function(e) {
		e.preventDefault();
		sides = $(this).attr('Sides')
		drawShapeHull($(this)[0], parseInt(sides) + 1, true)
			
});

$('#content').on('mouseout', '#hull',  function(e) {
		e.preventDefault();
		sides = $(this).attr('Sides')
		if (!$(this).prop('checked'))
		{
			drawShapeHull($(this)[0], parseInt(sides), false)
		}		
});


// ######## onCLICK ######## //

$('#content').on('click', '#hull',  function(e) {
	e.preventDefault();
	if(!$(this).prop('checked'))
	{
		clickid = $(this).parent().attr('number')

		// check if submit hull
		if(clickid == 1)
		{
			$.post( 
		     "insert.php",
		     {english: $('#english').val(), armenian: $('#armenian').val(), engName: $('#engName').val(), armName: $('#armName').val(), location: $('#location').val()},
		     function(data) {
		        $('#page').append(data);
		 	});
		}
		else
		{
			$('canvas').each(function()
		    {
		    	canvasEl = $(this)
		    	if (canvasEl.prop('id') == "canvas" && canvasEl.attr('number') == clickid)
		    	{
		        	dataID = canvasEl.attr('dataID');
		        	$.post( 
					     "upvote.php",
					     {ID: canvasEl.attr('dataID')},
					     function(data) {
					        console.log('upvoted')
				 	});

				 	// redraw shape
				 	canvasEl.attr('Votes', parseInt(canvasEl.attr('Votes')) +1);
				 	drawShapeUp($(this)[0])
				 	drawShapeDown($(this)[0])

				 	// refill VS
				 	$('.vahaksucks').each(function(index){
			    		if ($(this).attr('number') == clickid)
			    		{
			    			$(this).html("");
				 			fillVS($(this), getVSHtml(canvasEl, false), true);
				 		}
				 	});
		        }
		    });	
			
		}
	}
	$(this).prop('checked', true)
});

// Click pending

$('#pending').on('click', '#live',  function(e) {
	e.preventDefault();
	console.log($(this).attr('id_number'));
	$.post( 
     "../update.php",
     {ID: $(this).attr('id_number')},
     function(data) {
        location.reload(true)
 	});

});


$('#pending').on('click', '#kill',  function(e) {
	e.preventDefault();
	console.log("KILL");
	$.post( 
     "../kill.php",
     {ID: $(this).attr('id_number')},
     function(data) {
        location.reload(true)
 	});
});

$('#pending').on('click', '#delete',  function(e) {
	e.preventDefault();
	console.log("DELETED");
	$.post( 
     "../delete.php",
     {ID: $(this).attr('id_number')},
     function(data) {
        location.reload(true)
 	});
});


$('#pending').on('click', '#edit',  function(e) {
	e.preventDefault();
	console.log("id:", $(this).attr('id_number'), "arm:", $(this).siblings("#Armenian").val(), "eng:", $(this).siblings("#English").val(), "pla:", $(this).siblings("#Place").val(), "name:", $(this).siblings("#Name").val(), "armname:", $(this).siblings("#NameArm").val());
	$.post( 
     "../edit.php",
     {ID: $(this).attr('id_number'), armenian: $(this).siblings("#Armenian").val(), english: $(this).siblings("#English").val(), place: $(this).siblings("#Place").val(), name: $(this).siblings("#Name").val(), namearm: $(this).siblings("#NameArm").val()},
     function(data) {
        location.reload(true)
     });
 });


// ######## OTHER ######## // 

function rounder (number){
	remainder = number%4
		if (remainder == 0){
			return number
		}
		else{
			return Number(number) + 4 - remainder;
	};
}



function armConvert(number)
{	
	// submit case
	if (number == -1)
	{
		return "+"
	}
	//

	var letters = new Array("Ա","Բ","Գ","Դ","Ե","Զ","Է","Ը","Թ","Ժ","Ի","Լ","Խ","Ծ","Կ","Հ","Ձ","Ղ","Ճ","Մ","Յ","Ն","Շ","Ո","Չ","Պ","Ջ","Ռ","Ս","Վ","Տ","Ր","Ց","Ւ","Փ","Ք");
	round = 0
	outcome = ""
	while (number != 0)
	{
		curr = number % 10;
		number = Math.floor(number / 10);
		if (curr != 0)
		{
			outcome =  letters[curr + 10*round - (round +1)] + outcome;
		}
		round += 1;
	}
	return (outcome)
}

function getVSHtml(canvas, isSubmit)
{
	if(isSubmit)
	{
	    htmlstring = "  <div class='submittext'> \
					<input type='textbox' class='contentBox' id='english' placeholder='In English'></input> \
					<input type='textbox' class='contentBox' id='armenian' placeholder='Հայերենով'></input> \
					<input type='textbox' class='infoBox' id='engName' placeholder='Name in English'></input> \
					<input type='textbox' class='infoBox' id='armName' placeholder='Անունդ Հայերենով'></input> \
					<input type='textbox' class='infoBox' id='location' placeholder='Location'></input> \
				</div> "

	}
	else
	{

		Armenian = canvas.attr('Armenian')
	    English = canvas.attr('English')
	    Place = canvas.attr('Place')
	    Name = canvas.attr('Name')
	    NameArm = canvas.attr('NameArm')
	    leDate = canvas.attr('Date')
	    Votes = canvas.attr('Votes')

	    // other shape vahaksucks html
	    htmlstring = "	<span class='engFont'> In " +Place+", <br>	\
	    				"+Name+" Thought: '"+English+"'  <br>	\
	    				</span> <span class='armFont'> "+NameArm+"ը ըսավ: '"+Armenian+"'  <br> \
	    				Զինքը վաստակած է "+Votes+" կողմ: </span> 	"	
	}
	
    return (htmlstring)
}

function fillVS(vsElement, htmlstring, isHullChecked)
{
	placeArrowBar(vsElement);

	if(clickid == 1)
		makeShapeHull(80, 3, vsElement, true, isHullChecked)
	else
		makeShapeHull(80, Votes, vsElement, false, isHullChecked)

	vsElement.append(htmlstring);
}function on_load() 
{
	makeSubShape(4, 1, 120, '#content')
	template = $("#posts").html();
    $('#content').append(_.template(template,{"array":array}));
    $('.vahaksucks').each(function(index){
        $(this).hide(0);
    });
}

function on_load2(){
	template = $("#posts").html();
    $('#pending').append(_.template(template,{"array":array}));
}


// ######## SHAPES ######## // 

function makeShape(dataID, Armenian, English, Place, Name, NameArm, leDate, Votes, idcount, size, color, ondiv)
{
	var canvas = document.createElement('canvas');
	
	console.log(color);
	canvas.color = color
	canvas.id = "canvas";
	canvas.width = size;
	canvas.height = size;

	canvas.setAttribute('number', idcount)
	canvas.setAttribute('dataID', dataID)
	canvas.setAttribute('Armenian', Armenian)
	canvas.setAttribute('English', English)
	canvas.setAttribute('Place', Place)
	canvas.setAttribute('Name', Name)
	canvas.setAttribute('NameArm', NameArm)
	canvas.setAttribute('Date', leDate)
	canvas.setAttribute('Votes', Votes)
	canvas.setAttribute('Place', Place)
	canvas.setAttribute('prevClicked', 0)

	$('#content').append(canvas);
	
	drawShapeUp(canvas)
}

function makeSubShape(Votes, idcount, size, ondiv)
{
	var canvas = document.createElement('canvas');

	canvas.color = "#FFD464"
	canvas.id = "canvas";
	//canvas.id = "submitShape";
	canvas.width = size;
	canvas.height = size;

	canvas.setAttribute('number', idcount)
	canvas.setAttribute('Votes', Votes)
	canvas.setAttribute('prevClicked', 0)

	$('#content').append(canvas);
	
	drawShapeUp(canvas)
}

function makeShapeHull(size, sides, ondiv, isSubmit, isChecked)
{
	var canvas = document.createElement('canvas');
	canvas.id = "hull"

	if (isSubmit)
		canvas.style.marginTop = "3px"


	width = size
	height = size
	canvas.width = width
	canvas.height = height

	if (isChecked)
	{
		canvas.checked =  true;
		canvas.setAttribute('Sides', parseInt(sides) - 1)
	}
	else
	{
		canvas.checked =  false;
		canvas.setAttribute('Sides', parseInt(sides))
	}

	$(ondiv).append(canvas);

	drawShapeHull(canvas, sides)
}


function drawShapeUp(canvasIn)
{	
	var canvas = canvasIn

	id = $(canvas).attr('number')
	sides = $(canvas).attr('Votes')
	width = canvas.width
	height = canvas.height
	color = canvas.color

	var graphics = canvas.getContext("2d");

	// clear
	graphics.clearRect(0,0,width,height);
	canvas.width = canvas.width;
	
	// draw
	offset = 5
	fill = true
	stroke = false
	shapeGraphics(graphics, color, width, sides, offset, fill, stroke)


	// text
	graphics.fillStyle = "#FFFFFF";;
	graphics.textAlign="center"

	if (id == 1)
	{
		graphics.font = 'bold 33pt arial';
		graphics.fillText(armConvert(-1),width/2,height/2 + 16);
	}
	else
	{
		graphics.font = 'normal 27pt arian_amu';
		graphics.fillText(armConvert(sides),width/2,height/2 + 13);
	}
}

function drawShapeDown(canvasIn)
{
	var canvas = canvasIn

	id = $(canvas).attr('number')
	sides = $(canvas).attr('Votes')
	width = canvas.width
	height = canvas.height
	color = canvas.color
	color = '#FFFFFF'

	var graphics = canvas.getContext("2d");

	graphics.globalAlpha   = 0.2;
	
	offset = 5
	fill = true
	stroke = false

	shapeGraphics(graphics, color, width, sides, offset, fill, stroke)
}


function drawShapeHull(canvasIn, sides, check)
{
	var canvas = canvasIn
	width = canvas.width
	height = canvas.height
	var graphics = canvas.getContext("2d");

	// clear
	graphics.clearRect(0,0,width,height);
	canvas.width = canvas.width;

	fix = 0.5;
	middle = width/2;

	if (check)
	{
		fix = 0;
		//check
		graphics.moveTo(middle - 6 + fix - 2, middle + fix);
		graphics.lineTo(middle + fix - 2, middle + 6 + fix); 
		graphics.lineTo(middle + 12 + fix - 2, middle - 6 + fix);
	}
	else
	{
		// +
		graphics.moveTo(middle + fix,middle - 8 + fix);
		graphics.lineTo(middle + fix, middle + 8 + fix);
		graphics.moveTo(middle - 8 + fix, middle + fix); 
		graphics.lineTo(middle + 8 + fix, middle + fix);
	}

	// draw
	graphics.stroke()
	offset = 5
	fill = false
	stroke = true
	shapeGraphics(graphics, color, width, sides, offset, fill, stroke)
} 

function shapeGraphics(graphics, color, width, sides, offset, fill, stroke)
{
	graphics.fillStyle = color
	graphics.strokeStyle = "#000000"
	graphics.lineWidth=1;

	if(sides == 3)
		pushdown = 4;
	else
		pushdown = 0;

	graphics.beginPath();
	graphics.moveTo(width/2,offset);  

	
	rad = width/2 - offset
	angle = (sides-2) * Math.PI/sides

	for (var i=1;i<=sides-1;i++)
	{ 
		l = Math.sqrt(2*rad*rad*(1 - Math.cos((Math.PI*2/sides) * i)))
		pointx = l * Math.cos((Math.PI/2 - angle/2)*i)
		pointy = l * Math.sin((Math.PI/2 - angle/2)*i) + offset	+ pushdown
		graphics.lineTo(pointx + width/2 , pointy); 
	}
	graphics.closePath();

	if (fill)
		graphics.fill()
	if (stroke)
		graphics.stroke()
}

function placeArrowBar(ondiv)
{
	var canvas = document.createElement('canvas');

	position = ondiv.attr('number');
	canvas.id = "arrowBar";
	canvas.height = 30
	canvas.width = 600

	var graphics = canvas.getContext("2d");

	graphics.strokeStyle = "#000000"
	graphics.lineWidth = "1";

	fix = 0.5
	start = ((position-1)%4) * 150 + 75 - 20

	graphics.beginPath();
	graphics.moveTo(start + fix,0 + fix);  

	graphics.lineTo(start + 6 + fix, 6 + fix); 
	graphics.moveTo(start + fix, 0 + fix); 
	graphics.lineTo(start - 6 + fix, 6 + fix); 

	graphics.moveTo(0 + fix, 15 + fix);
	graphics.lineTo(start + fix, 15+ fix); 
	graphics.lineTo(start + fix, 1 + fix);  


	graphics.stroke();

	$(ondiv).append(canvas);
}



// ######## Shape CLICK ######## // 

$('#content').on('click', '#canvas',  function(e) 
{
    e.preventDefault();

    prevClicked = $(this).attr('prevClicked')
    clickedBefore = $(this).hasClass('clickedBefore');
    clickid = $(this).attr('number')
    Votes = $(this).attr('Votes')
	htmlstring = getVSHtml($(this), clickid == 1);
	drawShapeUp($(this)[0]);
	drawShapeDown($(this)[0])

    if (clickid == prevClicked){
    	// If this shaped was already clicked
    	//drawShapeDown($(this)[0])

   		$('.vahaksucks').each(function(index){
			$(this).hide('fast');

			// set prevClicked on all shapes back to 0
			$('canvas').each(function()
		    {
		    	if ($(this).prop('id') == "canvas")
					$(this).attr("prevClicked", 0);
		    });
			
        });
    }
    else
    {
    	//drawShapeDown($(this)[0]);
        $('canvas').each(function(index, obj)
        {
        	if($(this).prop('id') == "canvas" && $(this).attr('number') != clickid)
            	drawShapeUp($(this)[0]);
        });

    	$('.vahaksucks').each(function(index){
    		if ($(this).attr('number') == clickid)
    		{
    			if (!clickedBefore)
    			{
    				fillVS($(this), htmlstring, false)
				}
				if(Math.floor((clickid-1)/4) == Math.floor((prevClicked-1)/4) && clickid != prevClicked)
    				$(this).show();
    			else
					$(this).show('fast');	
    		}
    		else
    		{
				if(Math.floor((clickid-1)/4) == Math.floor((prevClicked-1)/4) && clickid != prevClicked)
    				$(this).hide();
    			else
					$(this).hide('fast');	
    		}
    	});

    	$('canvas').each(function()
	    {
	    	if ($(this).prop('id') == "canvas")
	        	$(this).attr("prevClicked", clickid);
	    });
    };

    if (!clickedBefore)
    	$(this).toggleClass("clickedBefore");
});



// ######## Mouse over/out ######## //

//Canvas

$('#content').on('mouseover', '#canvas',  function(e) {
		e.preventDefault();
		if ($(this).attr('number') != $(this).attr('prevClicked'))
		{
			drawShapeDown($(this)[0])
		}			
});

$('#content').on('mouseout', '#canvas',  function(e) {
		e.preventDefault();
		if ($(this).attr('number') != $(this).attr('prevClicked'))
		{
			drawShapeUp($(this)[0])
		}
			
});

//Hull

$('#content').on('mouseover', '#hull',  function(e) {
		e.preventDefault();
		sides = $(this).attr('Sides')
		drawShapeHull($(this)[0], parseInt(sides) + 1, true)
			
});

$('#content').on('mouseout', '#hull',  function(e) {
		e.preventDefault();
		sides = $(this).attr('Sides')
		if (!$(this).prop('checked'))
		{
			drawShapeHull($(this)[0], parseInt(sides), false)
		}		
});


// ######## onCLICK ######## //

$('#content').on('click', '#hull',  function(e) {
	e.preventDefault();
	if(!$(this).prop('checked'))
	{
		clickid = $(this).parent().attr('number')

		// check if submit hull
		if(clickid == 1)
		{
			$.post( 
		     "insert.php",
		     {english: $('#english').val(), armenian: $('#armenian').val(), engName: $('#engName').val(), armName: $('#armName').val(), location: $('#location').val()},
		     function(data) {
		        $('#page').append(data);
		 	});
		}
		else
		{
			$('canvas').each(function()
		    {
		    	canvasEl = $(this)
		    	if (canvasEl.prop('id') == "canvas" && canvasEl.attr('number') == clickid)
		    	{
		        	dataID = canvasEl.attr('dataID');
		        	$.post( 
					     "upvote.php",
					     {ID: canvasEl.attr('dataID')},
					     function(data) {
					        console.log('upvoted')
				 	});

				 	// redraw shape
				 	canvasEl.attr('Votes', parseInt(canvasEl.attr('Votes')) +1);
				 	drawShapeUp($(this)[0])
				 	drawShapeDown($(this)[0])

				 	// refill VS
				 	$('.vahaksucks').each(function(index){
			    		if ($(this).attr('number') == clickid)
			    		{
			    			$(this).html("");
				 			fillVS($(this), getVSHtml(canvasEl, false), true);
				 		}
				 	});
		        }
		    });	
			
		}
	}
	$(this).prop('checked', true)
});

// Click pending

$('#pending').on('click', '#live',  function(e) {
	e.preventDefault();
	console.log($(this).attr('id_number'));
	$.post( 
     "../update.php",
     {ID: $(this).attr('id_number')},
     function(data) {
        location.reload(true)
 	});

});


$('#pending').on('click', '#kill',  function(e) {
	e.preventDefault();
	console.log("KILL");
	$.post( 
     "../kill.php",
     {ID: $(this).attr('id_number')},
     function(data) {
        location.reload(true)
 	});
});

$('#pending').on('click', '#delete',  function(e) {
	e.preventDefault();
	console.log("DELETED");
	$.post( 
     "../delete.php",
     {ID: $(this).attr('id_number')},
     function(data) {
        location.reload(true)
 	});
});


$('#pending').on('click', '#edit',  function(e) {
	e.preventDefault();
	console.log("id:", $(this).attr('id_number'), "arm:", $(this).siblings("#Armenian").val(), "eng:", $(this).siblings("#English").val(), "pla:", $(this).siblings("#Place").val(), "name:", $(this).siblings("#Name").val(), "armname:", $(this).siblings("#NameArm").val());
	$.post( 
     "../edit.php",
     {ID: $(this).attr('id_number'), armenian: $(this).siblings("#Armenian").val(), english: $(this).siblings("#English").val(), place: $(this).siblings("#Place").val(), name: $(this).siblings("#Name").val(), namearm: $(this).siblings("#NameArm").val()},
     function(data) {
        location.reload(true)
     });
 });


// ######## OTHER ######## // 

function rounder (number){
	remainder = number%4
		if (remainder == 0){
			return number
		}
		else{
			return Number(number) + 4 - remainder;
	};
}



function armConvert(number)
{	
	// submit case
	if (number == -1)
	{
		return "+"
	}
	//

	var letters = new Array("Ա","Բ","Գ","Դ","Ե","Զ","Է","Ը","Թ","Ժ","Ի","Լ","Խ","Ծ","Կ","Հ","Ձ","Ղ","Ճ","Մ","Յ","Ն","Շ","Ո","Չ","Պ","Ջ","Ռ","Ս","Վ","Տ","Ր","Ց","Ւ","Փ","Ք");
	round = 0
	outcome = ""
	while (number != 0)
	{
		curr = number % 10;
		number = Math.floor(number / 10);
		if (curr != 0)
		{
			outcome =  letters[curr + 10*round - (round +1)] + outcome;
		}
		round += 1;
	}
	return (outcome)
}

function getVSHtml(canvas, isSubmit)
{
	if(isSubmit)
	{
	    htmlstring = "  <div class='submittext'> \
					<input type='textbox' class='contentBox' id='english' placeholder='In English'></input> \
					<input type='textbox' class='contentBox' id='armenian' placeholder='Հայերենով'></input> \
					<input type='textbox' class='infoBox' id='engName' placeholder='Name in English'></input> \
					<input type='textbox' class='infoBox' id='armName' placeholder='Անունդ Հայերենով'></input> \
					<input type='textbox' class='infoBox' id='location' placeholder='Location'></input> \
				</div> "

	}
	else
	{

		Armenian = canvas.attr('Armenian')
	    English = canvas.attr('English')
	    Place = canvas.attr('Place')
	    Name = canvas.attr('Name')
	    NameArm = canvas.attr('NameArm')
	    leDate = canvas.attr('Date')
	    Votes = canvas.attr('Votes')

	    // other shape vahaksucks html
	    htmlstring = "	<span class='engFont'> In " +Place+", <br>	\
	    				"+Name+" Thought: '"+English+"'  <br>	\
	    				</span> <span class='armFont'> "+NameArm+"ը ըսավ: '"+Armenian+"'  <br> \
	    				Զինքը վաստակած է "+Votes+" կողմ: </span> 	"	
	}
	
    return (htmlstring)
}

function fillVS(vsElement, htmlstring, isHullChecked)
{
	placeArrowBar(vsElement);

	if(clickid == 1)
		makeShapeHull(80, 3, vsElement, true, isHullChecked)
	else
		makeShapeHull(80, Votes, vsElement, false, isHullChecked)

	vsElement.append(htmlstring);
}function on_load() 
{
	makeSubShape(4, 1, 120, '#content')
	template = $("#posts").html();
    $('#content').append(_.template(template,{"array":array}));
    $('.vahaksucks').each(function(index){
        $(this).hide(0);
    });
}

function on_load2(){
	template = $("#posts").html();
    $('#pending').append(_.template(template,{"array":array}));
}


// ######## SHAPES ######## // 

function makeShape(dataID, Armenian, English, Place, Name, NameArm, leDate, Votes, idcount, size, color, ondiv)
{
	var canvas = document.createElement('canvas');
	
	console.log(color);
	canvas.color = color
	canvas.id = "canvas";
	canvas.width = size;
	canvas.height = size;

	canvas.setAttribute('number', idcount)
	canvas.setAttribute('dataID', dataID)
	canvas.setAttribute('Armenian', Armenian)
	canvas.setAttribute('English', English)
	canvas.setAttribute('Place', Place)
	canvas.setAttribute('Name', Name)
	canvas.setAttribute('NameArm', NameArm)
	canvas.setAttribute('Date', leDate)
	canvas.setAttribute('Votes', Votes)
	canvas.setAttribute('Place', Place)
	canvas.setAttribute('prevClicked', 0)

	$('#content').append(canvas);
	
	drawShapeUp(canvas)
}

function makeSubShape(Votes, idcount, size, ondiv)
{
	var canvas = document.createElement('canvas');

	canvas.color = "#FFD464"
	canvas.id = "canvas";
	//canvas.id = "submitShape";
	canvas.width = size;
	canvas.height = size;

	canvas.setAttribute('number', idcount)
	canvas.setAttribute('Votes', Votes)
	canvas.setAttribute('prevClicked', 0)

	$('#content').append(canvas);
	
	drawShapeUp(canvas)
}

function makeShapeHull(size, sides, ondiv, isSubmit, isChecked)
{
	var canvas = document.createElement('canvas');
	canvas.id = "hull"

	if (isSubmit)
		canvas.style.marginTop = "3px"


	width = size
	height = size
	canvas.width = width
	canvas.height = height

	if (isChecked)
	{
		canvas.checked =  true;
		canvas.setAttribute('Sides', parseInt(sides) - 1)
	}
	else
	{
		canvas.checked =  false;
		canvas.setAttribute('Sides', parseInt(sides))
	}

	$(ondiv).append(canvas);

	drawShapeHull(canvas, sides)
}


function drawShapeUp(canvasIn)
{	
	var canvas = canvasIn

	id = $(canvas).attr('number')
	sides = $(canvas).attr('Votes')
	width = canvas.width
	height = canvas.height
	color = canvas.color

	var graphics = canvas.getContext("2d");

	// clear
	graphics.clearRect(0,0,width,height);
	canvas.width = canvas.width;
	
	// draw
	offset = 5
	fill = true
	stroke = false
	shapeGraphics(graphics, color, width, sides, offset, fill, stroke)


	// text
	graphics.fillStyle = "#FFFFFF";;
	graphics.textAlign="center"

	if (id == 1)
	{
		graphics.font = 'bold 33pt arial';
		graphics.fillText(armConvert(-1),width/2,height/2 + 16);
	}
	else
	{
		graphics.font = 'normal 27pt arian_amu';
		graphics.fillText(armConvert(sides),width/2,height/2 + 13);
	}
}

function drawShapeDown(canvasIn)
{
	var canvas = canvasIn

	id = $(canvas).attr('number')
	sides = $(canvas).attr('Votes')
	width = canvas.width
	height = canvas.height
	color = canvas.color
	color = '#FFFFFF'

	var graphics = canvas.getContext("2d");

	graphics.globalAlpha   = 0.2;
	
	offset = 5
	fill = true
	stroke = false

	shapeGraphics(graphics, color, width, sides, offset, fill, stroke)
}


function drawShapeHull(canvasIn, sides, check)
{
	var canvas = canvasIn
	width = canvas.width
	height = canvas.height
	var graphics = canvas.getContext("2d");

	// clear
	graphics.clearRect(0,0,width,height);
	canvas.width = canvas.width;

	fix = 0.5;
	middle = width/2;

	if (check)
	{
		fix = 0;
		//check
		graphics.moveTo(middle - 6 + fix - 2, middle + fix);
		graphics.lineTo(middle + fix - 2, middle + 6 + fix); 
		graphics.lineTo(middle + 12 + fix - 2, middle - 6 + fix);
	}
	else
	{
		// +
		graphics.moveTo(middle + fix,middle - 8 + fix);
		graphics.lineTo(middle + fix, middle + 8 + fix);
		graphics.moveTo(middle - 8 + fix, middle + fix); 
		graphics.lineTo(middle + 8 + fix, middle + fix);
	}

	// draw
	graphics.stroke()
	offset = 5
	fill = false
	stroke = true
	shapeGraphics(graphics, color, width, sides, offset, fill, stroke)
} 

function shapeGraphics(graphics, color, width, sides, offset, fill, stroke)
{
	graphics.fillStyle = color
	graphics.strokeStyle = "#000000"
	graphics.lineWidth=1;

	if(sides == 3)
		pushdown = 4;
	else
		pushdown = 0;

	graphics.beginPath();
	graphics.moveTo(width/2,offset);  

	
	rad = width/2 - offset
	angle = (sides-2) * Math.PI/sides

	for (var i=1;i<=sides-1;i++)
	{ 
		l = Math.sqrt(2*rad*rad*(1 - Math.cos((Math.PI*2/sides) * i)))
		pointx = l * Math.cos((Math.PI/2 - angle/2)*i)
		pointy = l * Math.sin((Math.PI/2 - angle/2)*i) + offset	+ pushdown
		graphics.lineTo(pointx + width/2 , pointy); 
	}
	graphics.closePath();

	if (fill)
		graphics.fill()
	if (stroke)
		graphics.stroke()
}

function placeArrowBar(ondiv)
{
	var canvas = document.createElement('canvas');

	position = ondiv.attr('number');
	canvas.id = "arrowBar";
	canvas.height = 30
	canvas.width = 600

	var graphics = canvas.getContext("2d");

	graphics.strokeStyle = "#000000"
	graphics.lineWidth = "1";

	fix = 0.5
	start = ((position-1)%4) * 150 + 75 - 20

	graphics.beginPath();
	graphics.moveTo(start + fix,0 + fix);  

	graphics.lineTo(start + 6 + fix, 6 + fix); 
	graphics.moveTo(start + fix, 0 + fix); 
	graphics.lineTo(start - 6 + fix, 6 + fix); 

	graphics.moveTo(0 + fix, 15 + fix);
	graphics.lineTo(start + fix, 15+ fix); 
	graphics.lineTo(start + fix, 1 + fix);  


	graphics.stroke();

	$(ondiv).append(canvas);
}



// ######## Shape CLICK ######## // 

$('#content').on('click', '#canvas',  function(e) 
{
    e.preventDefault();

    prevClicked = $(this).attr('prevClicked')
    clickedBefore = $(this).hasClass('clickedBefore');
    clickid = $(this).attr('number')
    Votes = $(this).attr('Votes')
	htmlstring = getVSHtml($(this), clickid == 1);
	drawShapeUp($(this)[0]);
	drawShapeDown($(this)[0])

    if (clickid == prevClicked){
    	// If this shaped was already clicked
    	//drawShapeDown($(this)[0])

   		$('.vahaksucks').each(function(index){
			$(this).hide('fast');

			// set prevClicked on all shapes back to 0
			$('canvas').each(function()
		    {
		    	if ($(this).prop('id') == "canvas")
					$(this).attr("prevClicked", 0);
		    });
			
        });
    }
    else
    {
    	//drawShapeDown($(this)[0]);
        $('canvas').each(function(index, obj)
        {
        	if($(this).prop('id') == "canvas" && $(this).attr('number') != clickid)
            	drawShapeUp($(this)[0]);
        });

    	$('.vahaksucks').each(function(index){
    		if ($(this).attr('number') == clickid)
    		{
    			if (!clickedBefore)
    			{
    				fillVS($(this), htmlstring, false)
				}
				if(Math.floor((clickid-1)/4) == Math.floor((prevClicked-1)/4) && clickid != prevClicked)
    				$(this).show();
    			else
					$(this).show('fast');	
    		}
    		else
    		{
				if(Math.floor((clickid-1)/4) == Math.floor((prevClicked-1)/4) && clickid != prevClicked)
    				$(this).hide();
    			else
					$(this).hide('fast');	
    		}
    	});

    	$('canvas').each(function()
	    {
	    	if ($(this).prop('id') == "canvas")
	        	$(this).attr("prevClicked", clickid);
	    });
    };

    if (!clickedBefore)
    	$(this).toggleClass("clickedBefore");
});



// ######## Mouse over/out ######## //

//Canvas

$('#content').on('mouseover', '#canvas',  function(e) {
		e.preventDefault();
		if ($(this).attr('number') != $(this).attr('prevClicked'))
		{
			drawShapeDown($(this)[0])
		}			
});

$('#content').on('mouseout', '#canvas',  function(e) {
		e.preventDefault();
		if ($(this).attr('number') != $(this).attr('prevClicked'))
		{
			drawShapeUp($(this)[0])
		}
			
});

//Hull

$('#content').on('mouseover', '#hull',  function(e) {
		e.preventDefault();
		sides = $(this).attr('Sides')
		drawShapeHull($(this)[0], parseInt(sides) + 1, true)
			
});

$('#content').on('mouseout', '#hull',  function(e) {
		e.preventDefault();
		sides = $(this).attr('Sides')
		if (!$(this).prop('checked'))
		{
			drawShapeHull($(this)[0], parseInt(sides), false)
		}		
});


// ######## onCLICK ######## //

$('#content').on('click', '#hull',  function(e) {
	e.preventDefault();
	if(!$(this).prop('checked'))
	{
		clickid = $(this).parent().attr('number')

		// check if submit hull
		if(clickid == 1)
		{
			$.post( 
		     "insert.php",
		     {english: $('#english').val(), armenian: $('#armenian').val(), engName: $('#engName').val(), armName: $('#armName').val(), location: $('#location').val()},
		     function(data) {
		        $('#page').append(data);
		 	});
		}
		else
		{
			$('canvas').each(function()
		    {
		    	canvasEl = $(this)
		    	if (canvasEl.prop('id') == "canvas" && canvasEl.attr('number') == clickid)
		    	{
		        	dataID = canvasEl.attr('dataID');
		        	$.post( 
					     "upvote.php",
					     {ID: canvasEl.attr('dataID')},
					     function(data) {
					        console.log('upvoted')
				 	});

				 	// redraw shape
				 	canvasEl.attr('Votes', parseInt(canvasEl.attr('Votes')) +1);
				 	drawShapeUp($(this)[0])
				 	drawShapeDown($(this)[0])

				 	// refill VS
				 	$('.vahaksucks').each(function(index){
			    		if ($(this).attr('number') == clickid)
			    		{
			    			$(this).html("");
				 			fillVS($(this), getVSHtml(canvasEl, false), true);
				 		}
				 	});
		        }
		    });	
			
		}
	}
	$(this).prop('checked', true)
});

// Click pending

$('#pending').on('click', '#live',  function(e) {
	e.preventDefault();
	console.log($(this).attr('id_number'));
	$.post( 
     "../update.php",
     {ID: $(this).attr('id_number')},
     function(data) {
        location.reload(true)
 	});

});


$('#pending').on('click', '#kill',  function(e) {
	e.preventDefault();
	console.log("KILL");
	$.post( 
     "../kill.php",
     {ID: $(this).attr('id_number')},
     function(data) {
        location.reload(true)
 	});
});

$('#pending').on('click', '#delete',  function(e) {
	e.preventDefault();
	console.log("DELETED");
	$.post( 
     "../delete.php",
     {ID: $(this).attr('id_number')},
     function(data) {
        location.reload(true)
 	});
});


$('#pending').on('click', '#edit',  function(e) {
	e.preventDefault();
	console.log("id:", $(this).attr('id_number'), "arm:", $(this).siblings("#Armenian").val(), "eng:", $(this).siblings("#English").val(), "pla:", $(this).siblings("#Place").val(), "name:", $(this).siblings("#Name").val(), "armname:", $(this).siblings("#NameArm").val());
	$.post( 
     "../edit.php",
     {ID: $(this).attr('id_number'), armenian: $(this).siblings("#Armenian").val(), english: $(this).siblings("#English").val(), place: $(this).siblings("#Place").val(), name: $(this).siblings("#Name").val(), namearm: $(this).siblings("#NameArm").val()},
     function(data) {
        location.reload(true)
     });
 });


// ######## OTHER ######## // 

function rounder (number){
	remainder = number%4
		if (remainder == 0){
			return number
		}
		else{
			return Number(number) + 4 - remainder;
	};
}



function armConvert(number)
{	
	// submit case
	if (number == -1)
	{
		return "+"
	}
	//

	var letters = new Array("Ա","Բ","Գ","Դ","Ե","Զ","Է","Ը","Թ","Ժ","Ի","Լ","Խ","Ծ","Կ","Հ","Ձ","Ղ","Ճ","Մ","Յ","Ն","Շ","Ո","Չ","Պ","Ջ","Ռ","Ս","Վ","Տ","Ր","Ց","Ւ","Փ","Ք");
	round = 0
	outcome = ""
	while (number != 0)
	{
		curr = number % 10;
		number = Math.floor(number / 10);
		if (curr != 0)
		{
			outcome =  letters[curr + 10*round - (round +1)] + outcome;
		}
		round += 1;
	}
	return (outcome)
}

function getVSHtml(canvas, isSubmit)
{
	if(isSubmit)
	{
	    htmlstring = "  <div class='submittext'> \
					<input type='textbox' class='contentBox' id='english' placeholder='In English'></input> \
					<input type='textbox' class='contentBox' id='armenian' placeholder='Հայերենով'></input> \
					<input type='textbox' class='infoBox' id='engName' placeholder='Name in English'></input> \
					<input type='textbox' class='infoBox' id='armName' placeholder='Անունդ Հայերենով'></input> \
					<input type='textbox' class='infoBox' id='location' placeholder='Location'></input> \
				</div> "

	}
	else
	{

		Armenian = canvas.attr('Armenian')
	    English = canvas.attr('English')
	    Place = canvas.attr('Place')
	    Name = canvas.attr('Name')
	    NameArm = canvas.attr('NameArm')
	    leDate = canvas.attr('Date')
	    Votes = canvas.attr('Votes')

	    // other shape vahaksucks html
	    htmlstring = "	<span class='engFont'> In " +Place+", <br>	\
	    				"+Name+" Thought: '"+English+"'  <br>	\
	    				</span> <span class='armFont'> "+NameArm+"ը ըսավ: '"+Armenian+"'  <br> \
	    				Զինքը վաստակած է "+Votes+" կողմ: </span> 	"	
	}
	
    return (htmlstring)
}

function fillVS(vsElement, htmlstring, isHullChecked)
{
	placeArrowBar(vsElement);

	if(clickid == 1)
		makeShapeHull(80, 3, vsElement, true, isHullChecked)
	else
		makeShapeHull(80, Votes, vsElement, false, isHullChecked)

	vsElement.append(htmlstring);
}function on_load() 
{
	makeSubShape(4, 1, 120, '#content')
	template = $("#posts").html();
    $('#content').append(_.template(template,{"array":array}));
    $('.vahaksucks').each(function(index){
        $(this).hide(0);
    });
}

function on_load2(){
	template = $("#posts").html();
    $('#pending').append(_.template(template,{"array":array}));
}


// ######## SHAPES ######## // 

function makeShape(dataID, Armenian, English, Place, Name, NameArm, leDate, Votes, idcount, size, color, ondiv)
{
	var canvas = document.createElement('canvas');
	
	console.log(color);
	canvas.color = color
	canvas.id = "canvas";
	canvas.width = size;
	canvas.height = size;

	canvas.setAttribute('number', idcount)
	canvas.setAttribute('dataID', dataID)
	canvas.setAttribute('Armenian', Armenian)
	canvas.setAttribute('English', English)
	canvas.setAttribute('Place', Place)
	canvas.setAttribute('Name', Name)
	canvas.setAttribute('NameArm', NameArm)
	canvas.setAttribute('Date', leDate)
	canvas.setAttribute('Votes', Votes)
	canvas.setAttribute('Place', Place)
	canvas.setAttribute('prevClicked', 0)

	$('#content').append(canvas);
	
	drawShapeUp(canvas)
}

function makeSubShape(Votes, idcount, size, ondiv)
{
	var canvas = document.createElement('canvas');

	canvas.color = "#FFD464"
	canvas.id = "canvas";
	//canvas.id = "submitShape";
	canvas.width = size;
	canvas.height = size;

	canvas.setAttribute('number', idcount)
	canvas.setAttribute('Votes', Votes)
	canvas.setAttribute('prevClicked', 0)

	$('#content').append(canvas);
	
	drawShapeUp(canvas)
}

function makeShapeHull(size, sides, ondiv, isSubmit, isChecked)
{
	var canvas = document.createElement('canvas');
	canvas.id = "hull"

	if (isSubmit)
		canvas.style.marginTop = "3px"


	width = size
	height = size
	canvas.width = width
	canvas.height = height

	if (isChecked)
	{
		canvas.checked =  true;
		canvas.setAttribute('Sides', parseInt(sides) - 1)
	}
	else
	{
		canvas.checked =  false;
		canvas.setAttribute('Sides', parseInt(sides))
	}

	$(ondiv).append(canvas);

	drawShapeHull(canvas, sides)
}


function drawShapeUp(canvasIn)
{	
	var canvas = canvasIn

	id = $(canvas).attr('number')
	sides = $(canvas).attr('Votes')
	width = canvas.width
	height = canvas.height
	color = canvas.color

	var graphics = canvas.getContext("2d");

	// clear
	graphics.clearRect(0,0,width,height);
	canvas.width = canvas.width;
	
	// draw
	offset = 5
	fill = true
	stroke = false
	shapeGraphics(graphics, color, width, sides, offset, fill, stroke)


	// text
	graphics.fillStyle = "#FFFFFF";;
	graphics.textAlign="center"

	if (id == 1)
	{
		graphics.font = 'bold 33pt arial';
		graphics.fillText(armConvert(-1),width/2,height/2 + 16);
	}
	else
	{
		graphics.font = 'normal 27pt arian_amu';
		graphics.fillText(armConvert(sides),width/2,height/2 + 13);
	}
}

function drawShapeDown(canvasIn)
{
	var canvas = canvasIn

	id = $(canvas).attr('number')
	sides = $(canvas).attr('Votes')
	width = canvas.width
	height = canvas.height
	color = canvas.color
	color = '#FFFFFF'

	var graphics = canvas.getContext("2d");

	graphics.globalAlpha   = 0.2;
	
	offset = 5
	fill = true
	stroke = false

	shapeGraphics(graphics, color, width, sides, offset, fill, stroke)
}


function drawShapeHull(canvasIn, sides, check)
{
	var canvas = canvasIn
	width = canvas.width
	height = canvas.height
	var graphics = canvas.getContext("2d");

	// clear
	graphics.clearRect(0,0,width,height);
	canvas.width = canvas.width;

	fix = 0.5;
	middle = width/2;

	if (check)
	{
		fix = 0;
		//check
		graphics.moveTo(middle - 6 + fix - 2, middle + fix);
		graphics.lineTo(middle + fix - 2, middle + 6 + fix); 
		graphics.lineTo(middle + 12 + fix - 2, middle - 6 + fix);
	}
	else
	{
		// +
		graphics.moveTo(middle + fix,middle - 8 + fix);
		graphics.lineTo(middle + fix, middle + 8 + fix);
		graphics.moveTo(middle - 8 + fix, middle + fix); 
		graphics.lineTo(middle + 8 + fix, middle + fix);
	}

	// draw
	graphics.stroke()
	offset = 5
	fill = false
	stroke = true
	shapeGraphics(graphics, color, width, sides, offset, fill, stroke)
} 

function shapeGraphics(graphics, color, width, sides, offset, fill, stroke)
{
	graphics.fillStyle = color
	graphics.strokeStyle = "#000000"
	graphics.lineWidth=1;

	if(sides == 3)
		pushdown = 4;
	else
		pushdown = 0;

	graphics.beginPath();
	graphics.moveTo(width/2,offset);  

	
	rad = width/2 - offset
	angle = (sides-2) * Math.PI/sides

	for (var i=1;i<=sides-1;i++)
	{ 
		l = Math.sqrt(2*rad*rad*(1 - Math.cos((Math.PI*2/sides) * i)))
		pointx = l * Math.cos((Math.PI/2 - angle/2)*i)
		pointy = l * Math.sin((Math.PI/2 - angle/2)*i) + offset	+ pushdown
		graphics.lineTo(pointx + width/2 , pointy); 
	}
	graphics.closePath();

	if (fill)
		graphics.fill()
	if (stroke)
		graphics.stroke()
}

function placeArrowBar(ondiv)
{
	var canvas = document.createElement('canvas');

	position = ondiv.attr('number');
	canvas.id = "arrowBar";
	canvas.height = 30
	canvas.width = 600

	var graphics = canvas.getContext("2d");

	graphics.strokeStyle = "#000000"
	graphics.lineWidth = "1";

	fix = 0.5
	start = ((position-1)%4) * 150 + 75 - 20

	graphics.beginPath();
	graphics.moveTo(start + fix,0 + fix);  

	graphics.lineTo(start + 6 + fix, 6 + fix); 
	graphics.moveTo(start + fix, 0 + fix); 
	graphics.lineTo(start - 6 + fix, 6 + fix); 

	graphics.moveTo(0 + fix, 15 + fix);
	graphics.lineTo(start + fix, 15+ fix); 
	graphics.lineTo(start + fix, 1 + fix);  


	graphics.stroke();

	$(ondiv).append(canvas);
}



// ######## Shape CLICK ######## // 

$('#content').on('click', '#canvas',  function(e) 
{
    e.preventDefault();

    prevClicked = $(this).attr('prevClicked')
    clickedBefore = $(this).hasClass('clickedBefore');
    clickid = $(this).attr('number')
    Votes = $(this).attr('Votes')
	htmlstring = getVSHtml($(this), clickid == 1);
	drawShapeUp($(this)[0]);
	drawShapeDown($(this)[0])

    if (clickid == prevClicked){
    	// If this shaped was already clicked
    	//drawShapeDown($(this)[0])

   		$('.vahaksucks').each(function(index){
			$(this).hide('fast');

			// set prevClicked on all shapes back to 0
			$('canvas').each(function()
		    {
		    	if ($(this).prop('id') == "canvas")
					$(this).attr("prevClicked", 0);
		    });
			
        });
    }
    else
    {
    	//drawShapeDown($(this)[0]);
        $('canvas').each(function(index, obj)
        {
        	if($(this).prop('id') == "canvas" && $(this).attr('number') != clickid)
            	drawShapeUp($(this)[0]);
        });

    	$('.vahaksucks').each(function(index){
    		if ($(this).attr('number') == clickid)
    		{
    			if (!clickedBefore)
    			{
    				fillVS($(this), htmlstring, false)
				}
				if(Math.floor((clickid-1)/4) == Math.floor((prevClicked-1)/4) && clickid != prevClicked)
    				$(this).show();
    			else
					$(this).show('fast');	
    		}
    		else
    		{
				if(Math.floor((clickid-1)/4) == Math.floor((prevClicked-1)/4) && clickid != prevClicked)
    				$(this).hide();
    			else
					$(this).hide('fast');	
    		}
    	});

    	$('canvas').each(function()
	    {
	    	if ($(this).prop('id') == "canvas")
	        	$(this).attr("prevClicked", clickid);
	    });
    };

    if (!clickedBefore)
    	$(this).toggleClass("clickedBefore");
});



// ######## Mouse over/out ######## //

//Canvas

$('#content').on('mouseover', '#canvas',  function(e) {
		e.preventDefault();
		if ($(this).attr('number') != $(this).attr('prevClicked'))
		{
			drawShapeDown($(this)[0])
		}			
});

$('#content').on('mouseout', '#canvas',  function(e) {
		e.preventDefault();
		if ($(this).attr('number') != $(this).attr('prevClicked'))
		{
			drawShapeUp($(this)[0])
		}
			
});

//Hull

$('#content').on('mouseover', '#hull',  function(e) {
		e.preventDefault();
		sides = $(this).attr('Sides')
		drawShapeHull($(this)[0], parseInt(sides) + 1, true)
			
});

$('#content').on('mouseout', '#hull',  function(e) {
		e.preventDefault();
		sides = $(this).attr('Sides')
		if (!$(this).prop('checked'))
		{
			drawShapeHull($(this)[0], parseInt(sides), false)
		}		
});


// ######## onCLICK ######## //

$('#content').on('click', '#hull',  function(e) {
	e.preventDefault();
	if(!$(this).prop('checked'))
	{
		clickid = $(this).parent().attr('number')

		// check if submit hull
		if(clickid == 1)
		{
			$.post( 
		     "insert.php",
		     {english: $('#english').val(), armenian: $('#armenian').val(), engName: $('#engName').val(), armName: $('#armName').val(), location: $('#location').val()},
		     function(data) {
		        $('#page').append(data);
		 	});
		}
		else
		{
			$('canvas').each(function()
		    {
		    	canvasEl = $(this)
		    	if (canvasEl.prop('id') == "canvas" && canvasEl.attr('number') == clickid)
		    	{
		        	dataID = canvasEl.attr('dataID');
		        	$.post( 
					     "upvote.php",
					     {ID: canvasEl.attr('dataID')},
					     function(data) {
					        console.log('upvoted')
				 	});

				 	// redraw shape
				 	canvasEl.attr('Votes', parseInt(canvasEl.attr('Votes')) +1);
				 	drawShapeUp($(this)[0])
				 	drawShapeDown($(this)[0])

				 	// refill VS
				 	$('.vahaksucks').each(function(index){
			    		if ($(this).attr('number') == clickid)
			    		{
			    			$(this).html("");
				 			fillVS($(this), getVSHtml(canvasEl, false), true);
				 		}
				 	});
		        }
		    });	
			
		}
	}
	$(this).prop('checked', true)
});

// Click pending

$('#pending').on('click', '#live',  function(e) {
	e.preventDefault();
	console.log($(this).attr('id_number'));
	$.post( 
     "../update.php",
     {ID: $(this).attr('id_number')},
     function(data) {
        location.reload(true)
 	});

});


$('#pending').on('click', '#kill',  function(e) {
	e.preventDefault();
	console.log("KILL");
	$.post( 
     "../kill.php",
     {ID: $(this).attr('id_number')},
     function(data) {
        location.reload(true)
 	});
});

$('#pending').on('click', '#delete',  function(e) {
	e.preventDefault();
	console.log("DELETED");
	$.post( 
     "../delete.php",
     {ID: $(this).attr('id_number')},
     function(data) {
        location.reload(true)
 	});
});


$('#pending').on('click', '#edit',  function(e) {
	e.preventDefault();
	console.log("id:", $(this).attr('id_number'), "arm:", $(this).siblings("#Armenian").val(), "eng:", $(this).siblings("#English").val(), "pla:", $(this).siblings("#Place").val(), "name:", $(this).siblings("#Name").val(), "armname:", $(this).siblings("#NameArm").val());
	$.post( 
     "../edit.php",
     {ID: $(this).attr('id_number'), armenian: $(this).siblings("#Armenian").val(), english: $(this).siblings("#English").val(), place: $(this).siblings("#Place").val(), name: $(this).siblings("#Name").val(), namearm: $(this).siblings("#NameArm").val()},
     function(data) {
        location.reload(true)
     });
 });


// ######## OTHER ######## // 

function rounder (number){
	remainder = number%4
		if (remainder == 0){
			return number
		}
		else{
			return Number(number) + 4 - remainder;
	};
}



function armConvert(number)
{	
	// submit case
	if (number == -1)
	{
		return "+"
	}
	//

	var letters = new Array("Ա","Բ","Գ","Դ","Ե","Զ","Է","Ը","Թ","Ժ","Ի","Լ","Խ","Ծ","Կ","Հ","Ձ","Ղ","Ճ","Մ","Յ","Ն","Շ","Ո","Չ","Պ","Ջ","Ռ","Ս","Վ","Տ","Ր","Ց","Ւ","Փ","Ք");
	round = 0
	outcome = ""
	while (number != 0)
	{
		curr = number % 10;
		number = Math.floor(number / 10);
		if (curr != 0)
		{
			outcome =  letters[curr + 10*round - (round +1)] + outcome;
		}
		round += 1;
	}
	return (outcome)
}

function getVSHtml(canvas, isSubmit)
{
	if(isSubmit)
	{
	    htmlstring = "  <div class='submittext'> \
					<input type='textbox' class='contentBox' id='english' placeholder='In English'></input> \
					<input type='textbox' class='contentBox' id='armenian' placeholder='Հայերենով'></input> \
					<input type='textbox' class='infoBox' id='engName' placeholder='Name in English'></input> \
					<input type='textbox' class='infoBox' id='armName' placeholder='Անունդ Հայերենով'></input> \
					<input type='textbox' class='infoBox' id='location' placeholder='Location'></input> \
				</div> "

	}
	else
	{

		Armenian = canvas.attr('Armenian')
	    English = canvas.attr('English')
	    Place = canvas.attr('Place')
	    Name = canvas.attr('Name')
	    NameArm = canvas.attr('NameArm')
	    leDate = canvas.attr('Date')
	    Votes = canvas.attr('Votes')

	    // other shape vahaksucks html
	    htmlstring = "	<span class='engFont'> In " +Place+", <br>	\
	    				"+Name+" Thought: '"+English+"'  <br>	\
	    				</span> <span class='armFont'> "+NameArm+"ը ըսավ: '"+Armenian+"'  <br> \
	    				Զինքը վաստակած է "+Votes+" կողմ: </span> 	"	
	}
	
    return (htmlstring)
}

function fillVS(vsElement, htmlstring, isHullChecked)
{
	placeArrowBar(vsElement);

	if(clickid == 1)
		makeShapeHull(80, 3, vsElement, true, isHullChecked)
	else
		makeShapeHull(80, Votes, vsElement, false, isHullChecked)

	vsElement.append(htmlstring);
}function on_load() 
{
	makeSubShape(4, 1, 120, '#content')
	template = $("#posts").html();
    $('#content').append(_.template(template,{"array":array}));
    $('.vahaksucks').each(function(index){
        $(this).hide(0);
    });
}

function on_load2(){
	template = $("#posts").html();
    $('#pending').append(_.template(template,{"array":array}));
}


// ######## SHAPES ######## // 

function makeShape(dataID, Armenian, English, Place, Name, NameArm, leDate, Votes, idcount, size, color, ondiv)
{
	var canvas = document.createElement('canvas');
	
	console.log(color);
	canvas.color = color
	canvas.id = "canvas";
	canvas.width = size;
	canvas.height = size;

	canvas.setAttribute('number', idcount)
	canvas.setAttribute('dataID', dataID)
	canvas.setAttribute('Armenian', Armenian)
	canvas.setAttribute('English', English)
	canvas.setAttribute('Place', Place)
	canvas.setAttribute('Name', Name)
	canvas.setAttribute('NameArm', NameArm)
	canvas.setAttribute('Date', leDate)
	canvas.setAttribute('Votes', Votes)
	canvas.setAttribute('Place', Place)
	canvas.setAttribute('prevClicked', 0)

	$('#content').append(canvas);
	
	drawShapeUp(canvas)
}

function makeSubShape(Votes, idcount, size, ondiv)
{
	var canvas = document.createElement('canvas');

	canvas.color = "#FFD464"
	canvas.id = "canvas";
	//canvas.id = "submitShape";
	canvas.width = size;
	canvas.height = size;

	canvas.setAttribute('number', idcount)
	canvas.setAttribute('Votes', Votes)
	canvas.setAttribute('prevClicked', 0)

	$('#content').append(canvas);
	
	drawShapeUp(canvas)
}

function makeShapeHull(size, sides, ondiv, isSubmit, isChecked)
{
	var canvas = document.createElement('canvas');
	canvas.id = "hull"

	if (isSubmit)
		canvas.style.marginTop = "3px"


	width = size
	height = size
	canvas.width = width
	canvas.height = height

	if (isChecked)
	{
		canvas.checked =  true;
		canvas.setAttribute('Sides', parseInt(sides) - 1)
	}
	else
	{
		canvas.checked =  false;
		canvas.setAttribute('Sides', parseInt(sides))
	}

	$(ondiv).append(canvas);

	drawShapeHull(canvas, sides)
}


function drawShapeUp(canvasIn)
{	
	var canvas = canvasIn

	id = $(canvas).attr('number')
	sides = $(canvas).attr('Votes')
	width = canvas.width
	height = canvas.height
	color = canvas.color

	var graphics = canvas.getContext("2d");

	// clear
	graphics.clearRect(0,0,width,height);
	canvas.width = canvas.width;
	
	// draw
	offset = 5
	fill = true
	stroke = false
	shapeGraphics(graphics, color, width, sides, offset, fill, stroke)


	// text
	graphics.fillStyle = "#FFFFFF";;
	graphics.textAlign="center"

	if (id == 1)
	{
		graphics.font = 'bold 33pt arial';
		graphics.fillText(armConvert(-1),width/2,height/2 + 16);
	}
	else
	{
		graphics.font = 'normal 27pt arian_amu';
		graphics.fillText(armConvert(sides),width/2,height/2 + 13);
	}
}

function drawShapeDown(canvasIn)
{
	var canvas = canvasIn

	id = $(canvas).attr('number')
	sides = $(canvas).attr('Votes')
	width = canvas.width
	height = canvas.height
	color = canvas.color
	color = '#FFFFFF'

	var graphics = canvas.getContext("2d");

	graphics.globalAlpha   = 0.2;
	
	offset = 5
	fill = true
	stroke = false

	shapeGraphics(graphics, color, width, sides, offset, fill, stroke)
}


function drawShapeHull(canvasIn, sides, check)
{
	var canvas = canvasIn
	width = canvas.width
	height = canvas.height
	var graphics = canvas.getContext("2d");

	// clear
	graphics.clearRect(0,0,width,height);
	canvas.width = canvas.width;

	fix = 0.5;
	middle = width/2;

	if (check)
	{
		fix = 0;
		//check
		graphics.moveTo(middle - 6 + fix - 2, middle + fix);
		graphics.lineTo(middle + fix - 2, middle + 6 + fix); 
		graphics.lineTo(middle + 12 + fix - 2, middle - 6 + fix);
	}
	else
	{
		// +
		graphics.moveTo(middle + fix,middle - 8 + fix);
		graphics.lineTo(middle + fix, middle + 8 + fix);
		graphics.moveTo(middle - 8 + fix, middle + fix); 
		graphics.lineTo(middle + 8 + fix, middle + fix);
	}

	// draw
	graphics.stroke()
	offset = 5
	fill = false
	stroke = true
	shapeGraphics(graphics, color, width, sides, offset, fill, stroke)
} 

function shapeGraphics(graphics, color, width, sides, offset, fill, stroke)
{
	graphics.fillStyle = color
	graphics.strokeStyle = "#000000"
	graphics.lineWidth=1;

	if(sides == 3)
		pushdown = 4;
	else
		pushdown = 0;

	graphics.beginPath();
	graphics.moveTo(width/2,offset);  

	
	rad = width/2 - offset
	angle = (sides-2) * Math.PI/sides

	for (var i=1;i<=sides-1;i++)
	{ 
		l = Math.sqrt(2*rad*rad*(1 - Math.cos((Math.PI*2/sides) * i)))
		pointx = l * Math.cos((Math.PI/2 - angle/2)*i)
		pointy = l * Math.sin((Math.PI/2 - angle/2)*i) + offset	+ pushdown
		graphics.lineTo(pointx + width/2 , pointy); 
	}
	graphics.closePath();

	if (fill)
		graphics.fill()
	if (stroke)
		graphics.stroke()
}

function placeArrowBar(ondiv)
{
	var canvas = document.createElement('canvas');

	position = ondiv.attr('number');
	canvas.id = "arrowBar";
	canvas.height = 30
	canvas.width = 600

	var graphics = canvas.getContext("2d");

	graphics.strokeStyle = "#000000"
	graphics.lineWidth = "1";

	fix = 0.5
	start = ((position-1)%4) * 150 + 75 - 20

	graphics.beginPath();
	graphics.moveTo(start + fix,0 + fix);  

	graphics.lineTo(start + 6 + fix, 6 + fix); 
	graphics.moveTo(start + fix, 0 + fix); 
	graphics.lineTo(start - 6 + fix, 6 + fix); 

	graphics.moveTo(0 + fix, 15 + fix);
	graphics.lineTo(start + fix, 15+ fix); 
	graphics.lineTo(start + fix, 1 + fix);  


	graphics.stroke();

	$(ondiv).append(canvas);
}



// ######## Shape CLICK ######## // 

$('#content').on('click', '#canvas',  function(e) 
{
    e.preventDefault();

    prevClicked = $(this).attr('prevClicked')
    clickedBefore = $(this).hasClass('clickedBefore');
    clickid = $(this).attr('number')
    Votes = $(this).attr('Votes')
	htmlstring = getVSHtml($(this), clickid == 1);
	drawShapeUp($(this)[0]);
	drawShapeDown($(this)[0])

    if (clickid == prevClicked){
    	// If this shaped was already clicked
    	//drawShapeDown($(this)[0])

   		$('.vahaksucks').each(function(index){
			$(this).hide('fast');

			// set prevClicked on all shapes back to 0
			$('canvas').each(function()
		    {
		    	if ($(this).prop('id') == "canvas")
					$(this).attr("prevClicked", 0);
		    });
			
        });
    }
    else
    {
    	//drawShapeDown($(this)[0]);
        $('canvas').each(function(index, obj)
        {
        	if($(this).prop('id') == "canvas" && $(this).attr('number') != clickid)
            	drawShapeUp($(this)[0]);
        });

    	$('.vahaksucks').each(function(index){
    		if ($(this).attr('number') == clickid)
    		{
    			if (!clickedBefore)
    			{
    				fillVS($(this), htmlstring, false)
				}
				if(Math.floor((clickid-1)/4) == Math.floor((prevClicked-1)/4) && clickid != prevClicked)
    				$(this).show();
    			else
					$(this).show('fast');	
    		}
    		else
    		{
				if(Math.floor((clickid-1)/4) == Math.floor((prevClicked-1)/4) && clickid != prevClicked)
    				$(this).hide();
    			else
					$(this).hide('fast');	
    		}
    	});

    	$('canvas').each(function()
	    {
	    	if ($(this).prop('id') == "canvas")
	        	$(this).attr("prevClicked", clickid);
	    });
    };

    if (!clickedBefore)
    	$(this).toggleClass("clickedBefore");
});



// ######## Mouse over/out ######## //

//Canvas

$('#content').on('mouseover', '#canvas',  function(e) {
		e.preventDefault();
		if ($(this).attr('number') != $(this).attr('prevClicked'))
		{
			drawShapeDown($(this)[0])
		}			
});

$('#content').on('mouseout', '#canvas',  function(e) {
		e.preventDefault();
		if ($(this).attr('number') != $(this).attr('prevClicked'))
		{
			drawShapeUp($(this)[0])
		}
			
});

//Hull

$('#content').on('mouseover', '#hull',  function(e) {
		e.preventDefault();
		sides = $(this).attr('Sides')
		drawShapeHull($(this)[0], parseInt(sides) + 1, true)
			
});

$('#content').on('mouseout', '#hull',  function(e) {
		e.preventDefault();
		sides = $(this).attr('Sides')
		if (!$(this).prop('checked'))
		{
			drawShapeHull($(this)[0], parseInt(sides), false)
		}		
});


// ######## onCLICK ######## //

$('#content').on('click', '#hull',  function(e) {
	e.preventDefault();
	if(!$(this).prop('checked'))
	{
		clickid = $(this).parent().attr('number')

		// check if submit hull
		if(clickid == 1)
		{
			$.post( 
		     "insert.php",
		     {english: $('#english').val(), armenian: $('#armenian').val(), engName: $('#engName').val(), armName: $('#armName').val(), location: $('#location').val()},
		     function(data) {
		        $('#page').append(data);
		 	});
		}
		else
		{
			$('canvas').each(function()
		    {
		    	canvasEl = $(this)
		    	if (canvasEl.prop('id') == "canvas" && canvasEl.attr('number') == clickid)
		    	{
		        	dataID = canvasEl.attr('dataID');
		        	$.post( 
					     "upvote.php",
					     {ID: canvasEl.attr('dataID')},
					     function(data) {
					        console.log('upvoted')
				 	});

				 	// redraw shape
				 	canvasEl.attr('Votes', parseInt(canvasEl.attr('Votes')) +1);
				 	drawShapeUp($(this)[0])
				 	drawShapeDown($(this)[0])

				 	// refill VS
				 	$('.vahaksucks').each(function(index){
			    		if ($(this).attr('number') == clickid)
			    		{
			    			$(this).html("");
				 			fillVS($(this), getVSHtml(canvasEl, false), true);
				 		}
				 	});
		        }
		    });	
			
		}
	}
	$(this).prop('checked', true)
});

// Click pending

$('#pending').on('click', '#live',  function(e) {
	e.preventDefault();
	console.log($(this).attr('id_number'));
	$.post( 
     "../update.php",
     {ID: $(this).attr('id_number')},
     function(data) {
        location.reload(true)
 	});

});


$('#pending').on('click', '#kill',  function(e) {
	e.preventDefault();
	console.log("KILL");
	$.post( 
     "../kill.php",
     {ID: $(this).attr('id_number')},
     function(data) {
        location.reload(true)
 	});
});

$('#pending').on('click', '#delete',  function(e) {
	e.preventDefault();
	console.log("DELETED");
	$.post( 
     "../delete.php",
     {ID: $(this).attr('id_number')},
     function(data) {
        location.reload(true)
 	});
});


$('#pending').on('click', '#edit',  function(e) {
	e.preventDefault();
	console.log("id:", $(this).attr('id_number'), "arm:", $(this).siblings("#Armenian").val(), "eng:", $(this).siblings("#English").val(), "pla:", $(this).siblings("#Place").val(), "name:", $(this).siblings("#Name").val(), "armname:", $(this).siblings("#NameArm").val());
	$.post( 
     "../edit.php",
     {ID: $(this).attr('id_number'), armenian: $(this).siblings("#Armenian").val(), english: $(this).siblings("#English").val(), place: $(this).siblings("#Place").val(), name: $(this).siblings("#Name").val(), namearm: $(this).siblings("#NameArm").val()},
     function(data) {
        location.reload(true)
     });
 });


// ######## OTHER ######## // 

function rounder (number){
	remainder = number%4
		if (remainder == 0){
			return number
		}
		else{
			return Number(number) + 4 - remainder;
	};
}



function armConvert(number)
{	
	// submit case
	if (number == -1)
	{
		return "+"
	}
	//

	var letters = new Array("Ա","Բ","Գ","Դ","Ե","Զ","Է","Ը","Թ","Ժ","Ի","Լ","Խ","Ծ","Կ","Հ","Ձ","Ղ","Ճ","Մ","Յ","Ն","Շ","Ո","Չ","Պ","Ջ","Ռ","Ս","Վ","Տ","Ր","Ց","Ւ","Փ","Ք");
	round = 0
	outcome = ""
	while (number != 0)
	{
		curr = number % 10;
		number = Math.floor(number / 10);
		if (curr != 0)
		{
			outcome =  letters[curr + 10*round - (round +1)] + outcome;
		}
		round += 1;
	}
	return (outcome)
}

function getVSHtml(canvas, isSubmit)
{
	if(isSubmit)
	{
	    htmlstring = "  <div class='submittext'> \
					<input type='textbox' class='contentBox' id='english' placeholder='In English'></input> \
					<input type='textbox' class='contentBox' id='armenian' placeholder='Հայերենով'></input> \
					<input type='textbox' class='infoBox' id='engName' placeholder='Name in English'></input> \
					<input type='textbox' class='infoBox' id='armName' placeholder='Անունդ Հայերենով'></input> \
					<input type='textbox' class='infoBox' id='location' placeholder='Location'></input> \
				</div> "

	}
	else
	{

		Armenian = canvas.attr('Armenian')
	    English = canvas.attr('English')
	    Place = canvas.attr('Place')
	    Name = canvas.attr('Name')
	    NameArm = canvas.attr('NameArm')
	    leDate = canvas.attr('Date')
	    Votes = canvas.attr('Votes')

	    // other shape vahaksucks html
	    htmlstring = "	<span class='engFont'> In " +Place+", <br>	\
	    				"+Name+" Thought: '"+English+"'  <br>	\
	    				</span> <span class='armFont'> "+NameArm+"ը ըսավ: '"+Armenian+"'  <br> \
	    				Զինքը վաստակած է "+Votes+" կողմ: </span> 	"	
	}
	
    return (htmlstring)
}

function fillVS(vsElement, htmlstring, isHullChecked)
{
	placeArrowBar(vsElement);

	if(clickid == 1)
		makeShapeHull(80, 3, vsElement, true, isHullChecked)
	else
		makeShapeHull(80, Votes, vsElement, false, isHullChecked)

	vsElement.append(htmlstring);
}function on_load() 
{
	makeSubShape(4, 1, 120, '#content')
	template = $("#posts").html();
    $('#content').append(_.template(template,{"array":array}));
    $('.vahaksucks').each(function(index){
        $(this).hide(0);
    });
}

function on_load2(){
	template = $("#posts").html();
    $('#pending').append(_.template(template,{"array":array}));
}


// ######## SHAPES ######## // 

function makeShape(dataID, Armenian, English, Place, Name, NameArm, leDate, Votes, idcount, size, color, ondiv)
{
	var canvas = document.createElement('canvas');
	
	console.log(color);
	canvas.color = color
	canvas.id = "canvas";
	canvas.width = size;
	canvas.height = size;

	canvas.setAttribute('number', idcount)
	canvas.setAttribute('dataID', dataID)
	canvas.setAttribute('Armenian', Armenian)
	canvas.setAttribute('English', English)
	canvas.setAttribute('Place', Place)
	canvas.setAttribute('Name', Name)
	canvas.setAttribute('NameArm', NameArm)
	canvas.setAttribute('Date', leDate)
	canvas.setAttribute('Votes', Votes)
	canvas.setAttribute('Place', Place)
	canvas.setAttribute('prevClicked', 0)

	$('#content').append(canvas);
	
	drawShapeUp(canvas)
}

function makeSubShape(Votes, idcount, size, ondiv)
{
	var canvas = document.createElement('canvas');

	canvas.color = "#FFD464"
	canvas.id = "canvas";
	//canvas.id = "submitShape";
	canvas.width = size;
	canvas.height = size;

	canvas.setAttribute('number', idcount)
	canvas.setAttribute('Votes', Votes)
	canvas.setAttribute('prevClicked', 0)

	$('#content').append(canvas);
	
	drawShapeUp(canvas)
}

function makeShapeHull(size, sides, ondiv, isSubmit, isChecked)
{
	var canvas = document.createElement('canvas');
	canvas.id = "hull"

	if (isSubmit)
		canvas.style.marginTop = "3px"


	width = size
	height = size
	canvas.width = width
	canvas.height = height

	if (isChecked)
	{
		canvas.checked =  true;
		canvas.setAttribute('Sides', parseInt(sides) - 1)
	}
	else
	{
		canvas.checked =  false;
		canvas.setAttribute('Sides', parseInt(sides))
	}

	$(ondiv).append(canvas);

	drawShapeHull(canvas, sides)
}


function drawShapeUp(canvasIn)
{	
	var canvas = canvasIn

	id = $(canvas).attr('number')
	sides = $(canvas).attr('Votes')
	width = canvas.width
	height = canvas.height
	color = canvas.color

	var graphics = canvas.getContext("2d");

	// clear
	graphics.clearRect(0,0,width,height);
	canvas.width = canvas.width;
	
	// draw
	offset = 5
	fill = true
	stroke = false
	shapeGraphics(graphics, color, width, sides, offset, fill, stroke)


	// text
	graphics.fillStyle = "#FFFFFF";;
	graphics.textAlign="center"

	if (id == 1)
	{
		graphics.font = 'bold 33pt arial';
		graphics.fillText(armConvert(-1),width/2,height/2 + 16);
	}
	else
	{
		graphics.font = 'normal 27pt arian_amu';
		graphics.fillText(armConvert(sides),width/2,height/2 + 13);
	}
}

function drawShapeDown(canvasIn)
{
	var canvas = canvasIn

	id = $(canvas).attr('number')
	sides = $(canvas).attr('Votes')
	width = canvas.width
	height = canvas.height
	color = canvas.color
	color = '#FFFFFF'

	var graphics = canvas.getContext("2d");

	graphics.globalAlpha   = 0.2;
	
	offset = 5
	fill = true
	stroke = false

	shapeGraphics(graphics, color, width, sides, offset, fill, stroke)
}


function drawShapeHull(canvasIn, sides, check)
{
	var canvas = canvasIn
	width = canvas.width
	height = canvas.height
	var graphics = canvas.getContext("2d");

	// clear
	graphics.clearRect(0,0,width,height);
	canvas.width = canvas.width;

	fix = 0.5;
	middle = width/2;

	if (check)
	{
		fix = 0;
		//check
		graphics.moveTo(middle - 6 + fix - 2, middle + fix);
		graphics.lineTo(middle + fix - 2, middle + 6 + fix); 
		graphics.lineTo(middle + 12 + fix - 2, middle - 6 + fix);
	}
	else
	{
		// +
		graphics.moveTo(middle + fix,middle - 8 + fix);
		graphics.lineTo(middle + fix, middle + 8 + fix);
		graphics.moveTo(middle - 8 + fix, middle + fix); 
		graphics.lineTo(middle + 8 + fix, middle + fix);
	}

	// draw
	graphics.stroke()
	offset = 5
	fill = false
	stroke = true
	shapeGraphics(graphics, color, width, sides, offset, fill, stroke)
} 

function shapeGraphics(graphics, color, width, sides, offset, fill, stroke)
{
	graphics.fillStyle = color
	graphics.strokeStyle = "#000000"
	graphics.lineWidth=1;

	if(sides == 3)
		pushdown = 4;
	else
		pushdown = 0;

	graphics.beginPath();
	graphics.moveTo(width/2,offset);  

	
	rad = width/2 - offset
	angle = (sides-2) * Math.PI/sides

	for (var i=1;i<=sides-1;i++)
	{ 
		l = Math.sqrt(2*rad*rad*(1 - Math.cos((Math.PI*2/sides) * i)))
		pointx = l * Math.cos((Math.PI/2 - angle/2)*i)
		pointy = l * Math.sin((Math.PI/2 - angle/2)*i) + offset	+ pushdown
		graphics.lineTo(pointx + width/2 , pointy); 
	}
	graphics.closePath();

	if (fill)
		graphics.fill()
	if (stroke)
		graphics.stroke()
}

function placeArrowBar(ondiv)
{
	var canvas = document.createElement('canvas');

	position = ondiv.attr('number');
	canvas.id = "arrowBar";
	canvas.height = 30
	canvas.width = 600

	var graphics = canvas.getContext("2d");

	graphics.strokeStyle = "#000000"
	graphics.lineWidth = "1";

	fix = 0.5
	start = ((position-1)%4) * 150 + 75 - 20

	graphics.beginPath();
	graphics.moveTo(start + fix,0 + fix);  

	graphics.lineTo(start + 6 + fix, 6 + fix); 
	graphics.moveTo(start + fix, 0 + fix); 
	graphics.lineTo(start - 6 + fix, 6 + fix); 

	graphics.moveTo(0 + fix, 15 + fix);
	graphics.lineTo(start + fix, 15+ fix); 
	graphics.lineTo(start + fix, 1 + fix);  


	graphics.stroke();

	$(ondiv).append(canvas);
}



// ######## Shape CLICK ######## // 

$('#content').on('click', '#canvas',  function(e) 
{
    e.preventDefault();

    prevClicked = $(this).attr('prevClicked')
    clickedBefore = $(this).hasClass('clickedBefore');
    clickid = $(this).attr('number')
    Votes = $(this).attr('Votes')
	htmlstring = getVSHtml($(this), clickid == 1);
	drawShapeUp($(this)[0]);
	drawShapeDown($(this)[0])

    if (clickid == prevClicked){
    	// If this shaped was already clicked
    	//drawShapeDown($(this)[0])

   		$('.vahaksucks').each(function(index){
			$(this).hide('fast');

			// set prevClicked on all shapes back to 0
			$('canvas').each(function()
		    {
		    	if ($(this).prop('id') == "canvas")
					$(this).attr("prevClicked", 0);
		    });
			
        });
    }
    else
    {
    	//drawShapeDown($(this)[0]);
        $('canvas').each(function(index, obj)
        {
        	if($(this).prop('id') == "canvas" && $(this).attr('number') != clickid)
            	drawShapeUp($(this)[0]);
        });

    	$('.vahaksucks').each(function(index){
    		if ($(this).attr('number') == clickid)
    		{
    			if (!clickedBefore)
    			{
    				fillVS($(this), htmlstring, false)
				}
				if(Math.floor((clickid-1)/4) == Math.floor((prevClicked-1)/4) && clickid != prevClicked)
    				$(this).show();
    			else
					$(this).show('fast');	
    		}
    		else
    		{
				if(Math.floor((clickid-1)/4) == Math.floor((prevClicked-1)/4) && clickid != prevClicked)
    				$(this).hide();
    			else
					$(this).hide('fast');	
    		}
    	});

    	$('canvas').each(function()
	    {
	    	if ($(this).prop('id') == "canvas")
	        	$(this).attr("prevClicked", clickid);
	    });
    };

    if (!clickedBefore)
    	$(this).toggleClass("clickedBefore");
});



// ######## Mouse over/out ######## //

//Canvas

$('#content').on('mouseover', '#canvas',  function(e) {
		e.preventDefault();
		if ($(this).attr('number') != $(this).attr('prevClicked'))
		{
			drawShapeDown($(this)[0])
		}			
});

$('#content').on('mouseout', '#canvas',  function(e) {
		e.preventDefault();
		if ($(this).attr('number') != $(this).attr('prevClicked'))
		{
			drawShapeUp($(this)[0])
		}
			
});

//Hull

$('#content').on('mouseover', '#hull',  function(e) {
		e.preventDefault();
		sides = $(this).attr('Sides')
		drawShapeHull($(this)[0], parseInt(sides) + 1, true)
			
});

$('#content').on('mouseout', '#hull',  function(e) {
		e.preventDefault();
		sides = $(this).attr('Sides')
		if (!$(this).prop('checked'))
		{
			drawShapeHull($(this)[0], parseInt(sides), false)
		}		
});


// ######## onCLICK ######## //

$('#content').on('click', '#hull',  function(e) {
	e.preventDefault();
	if(!$(this).prop('checked'))
	{
		clickid = $(this).parent().attr('number')

		// check if submit hull
		if(clickid == 1)
		{
			$.post( 
		     "insert.php",
		     {english: $('#english').val(), armenian: $('#armenian').val(), engName: $('#engName').val(), armName: $('#armName').val(), location: $('#location').val()},
		     function(data) {
		        $('#page').append(data);
		 	});
		}
		else
		{
			$('canvas').each(function()
		    {
		    	canvasEl = $(this)
		    	if (canvasEl.prop('id') == "canvas" && canvasEl.attr('number') == clickid)
		    	{
		        	dataID = canvasEl.attr('dataID');
		        	$.post( 
					     "upvote.php",
					     {ID: canvasEl.attr('dataID')},
					     function(data) {
					        console.log('upvoted')
				 	});

				 	// redraw shape
				 	canvasEl.attr('Votes', parseInt(canvasEl.attr('Votes')) +1);
				 	drawShapeUp($(this)[0])
				 	drawShapeDown($(this)[0])

				 	// refill VS
				 	$('.vahaksucks').each(function(index){
			    		if ($(this).attr('number') == clickid)
			    		{
			    			$(this).html("");
				 			fillVS($(this), getVSHtml(canvasEl, false), true);
				 		}
				 	});
		        }
		    });	
			
		}
	}
	$(this).prop('checked', true)
});

// Click pending

$('#pending').on('click', '#live',  function(e) {
	e.preventDefault();
	console.log($(this).attr('id_number'));
	$.post( 
     "../update.php",
     {ID: $(this).attr('id_number')},
     function(data) {
        location.reload(true)
 	});

});


$('#pending').on('click', '#kill',  function(e) {
	e.preventDefault();
	console.log("KILL");
	$.post( 
     "../kill.php",
     {ID: $(this).attr('id_number')},
     function(data) {
        location.reload(true)
 	});
});

$('#pending').on('click', '#delete',  function(e) {
	e.preventDefault();
	console.log("DELETED");
	$.post( 
     "../delete.php",
     {ID: $(this).attr('id_number')},
     function(data) {
        location.reload(true)
 	});
});


$('#pending').on('click', '#edit',  function(e) {
	e.preventDefault();
	console.log("id:", $(this).attr('id_number'), "arm:", $(this).siblings("#Armenian").val(), "eng:", $(this).siblings("#English").val(), "pla:", $(this).siblings("#Place").val(), "name:", $(this).siblings("#Name").val(), "armname:", $(this).siblings("#NameArm").val());
	$.post( 
     "../edit.php",
     {ID: $(this).attr('id_number'), armenian: $(this).siblings("#Armenian").val(), english: $(this).siblings("#English").val(), place: $(this).siblings("#Place").val(), name: $(this).siblings("#Name").val(), namearm: $(this).siblings("#NameArm").val()},
     function(data) {
        location.reload(true)
     });
 });


// ######## OTHER ######## // 

function rounder (number){
	remainder = number%4
		if (remainder == 0){
			return number
		}
		else{
			return Number(number) + 4 - remainder;
	};
}



function armConvert(number)
{	
	// submit case
	if (number == -1)
	{
		return "+"
	}
	//

	var letters = new Array("Ա","Բ","Գ","Դ","Ե","Զ","Է","Ը","Թ","Ժ","Ի","Լ","Խ","Ծ","Կ","Հ","Ձ","Ղ","Ճ","Մ","Յ","Ն","Շ","Ո","Չ","Պ","Ջ","Ռ","Ս","Վ","Տ","Ր","Ց","Ւ","Փ","Ք");
	round = 0
	outcome = ""
	while (number != 0)
	{
		curr = number % 10;
		number = Math.floor(number / 10);
		if (curr != 0)
		{
			outcome =  letters[curr + 10*round - (round +1)] + outcome;
		}
		round += 1;
	}
	return (outcome)
}

function getVSHtml(canvas, isSubmit)
{
	if(isSubmit)
	{
	    htmlstring = "  <div class='submittext'> \
					<input type='textbox' class='contentBox' id='english' placeholder='In English'></input> \
					<input type='textbox' class='contentBox' id='armenian' placeholder='Հայերենով'></input> \
					<input type='textbox' class='infoBox' id='engName' placeholder='Name in English'></input> \
					<input type='textbox' class='infoBox' id='armName' placeholder='Անունդ Հայերենով'></input> \
					<input type='textbox' class='infoBox' id='location' placeholder='Location'></input> \
				</div> "

	}
	else
	{

		Armenian = canvas.attr('Armenian')
	    English = canvas.attr('English')
	    Place = canvas.attr('Place')
	    Name = canvas.attr('Name')
	    NameArm = canvas.attr('NameArm')
	    leDate = canvas.attr('Date')
	    Votes = canvas.attr('Votes')

	    // other shape vahaksucks html
	    htmlstring = "	<span class='engFont'> In " +Place+", <br>	\
	    				"+Name+" Thought: '"+English+"'  <br>	\
	    				</span> <span class='armFont'> "+NameArm+"ը ըսավ: '"+Armenian+"'  <br> \
	    				Զինքը վաստակած է "+Votes+" կողմ: </span> 	"	
	}
	
    return (htmlstring)
}

function fillVS(vsElement, htmlstring, isHullChecked)
{
	placeArrowBar(vsElement);

	if(clickid == 1)
		makeShapeHull(80, 3, vsElement, true, isHullChecked)
	else
		makeShapeHull(80, Votes, vsElement, false, isHullChecked)

	vsElement.append(htmlstring);
}function on_load() 
{
	makeSubShape(4, 1, 120, '#content')
	template = $("#posts").html();
    $('#content').append(_.template(template,{"array":array}));
    $('.vahaksucks').each(function(index){
        $(this).hide(0);
    });
}

function on_load2(){
	template = $("#posts").html();
    $('#pending').append(_.template(template,{"array":array}));
}


// ######## SHAPES ######## // 

function makeShape(dataID, Armenian, English, Place, Name, NameArm, leDate, Votes, idcount, size, color, ondiv)
{
	var canvas = document.createElement('canvas');
	
	console.log(color);
	canvas.color = color
	canvas.id = "canvas";
	canvas.width = size;
	canvas.height = size;

	canvas.setAttribute('number', idcount)
	canvas.setAttribute('dataID', dataID)
	canvas.setAttribute('Armenian', Armenian)
	canvas.setAttribute('English', English)
	canvas.setAttribute('Place', Place)
	canvas.setAttribute('Name', Name)
	canvas.setAttribute('NameArm', NameArm)
	canvas.setAttribute('Date', leDate)
	canvas.setAttribute('Votes', Votes)
	canvas.setAttribute('Place', Place)
	canvas.setAttribute('prevClicked', 0)

	$('#content').append(canvas);
	
	drawShapeUp(canvas)
}

function makeSubShape(Votes, idcount, size, ondiv)
{
	var canvas = document.createElement('canvas');

	canvas.color = "#FFD464"
	canvas.id = "canvas";
	//canvas.id = "submitShape";
	canvas.width = size;
	canvas.height = size;

	canvas.setAttribute('number', idcount)
	canvas.setAttribute('Votes', Votes)
	canvas.setAttribute('prevClicked', 0)

	$('#content').append(canvas);
	
	drawShapeUp(canvas)
}

function makeShapeHull(size, sides, ondiv, isSubmit, isChecked)
{
	var canvas = document.createElement('canvas');
	canvas.id = "hull"

	if (isSubmit)
		canvas.style.marginTop = "3px"


	width = size
	height = size
	canvas.width = width
	canvas.height = height

	if (isChecked)
	{
		canvas.checked =  true;
		canvas.setAttribute('Sides', parseInt(sides) - 1)
	}
	else
	{
		canvas.checked =  false;
		canvas.setAttribute('Sides', parseInt(sides))
	}

	$(ondiv).append(canvas);

	drawShapeHull(canvas, sides)
}


function drawShapeUp(canvasIn)
{	
	var canvas = canvasIn

	id = $(canvas).attr('number')
	sides = $(canvas).attr('Votes')
	width = canvas.width
	height = canvas.height
	color = canvas.color

	var graphics = canvas.getContext("2d");

	// clear
	graphics.clearRect(0,0,width,height);
	canvas.width = canvas.width;
	
	// draw
	offset = 5
	fill = true
	stroke = false
	shapeGraphics(graphics, color, width, sides, offset, fill, stroke)


	// text
	graphics.fillStyle = "#FFFFFF";;
	graphics.textAlign="center"

	if (id == 1)
	{
		graphics.font = 'bold 33pt arial';
		graphics.fillText(armConvert(-1),width/2,height/2 + 16);
	}
	else
	{
		graphics.font = 'normal 27pt arian_amu';
		graphics.fillText(armConvert(sides),width/2,height/2 + 13);
	}
}

function drawShapeDown(canvasIn)
{
	var canvas = canvasIn

	id = $(canvas).attr('number')
	sides = $(canvas).attr('Votes')
	width = canvas.width
	height = canvas.height
	color = canvas.color
	color = '#FFFFFF'

	var graphics = canvas.getContext("2d");

	graphics.globalAlpha   = 0.2;
	
	offset = 5
	fill = true
	stroke = false

	shapeGraphics(graphics, color, width, sides, offset, fill, stroke)
}


function drawShapeHull(canvasIn, sides, check)
{
	var canvas = canvasIn
	width = canvas.width
	height = canvas.height
	var graphics = canvas.getContext("2d");

	// clear
	graphics.clearRect(0,0,width,height);
	canvas.width = canvas.width;

	fix = 0.5;
	middle = width/2;

	if (check)
	{
		fix = 0;
		//check
		graphics.moveTo(middle - 6 + fix - 2, middle + fix);
		graphics.lineTo(middle + fix - 2, middle + 6 + fix); 
		graphics.lineTo(middle + 12 + fix - 2, middle - 6 + fix);
	}
	else
	{
		// +
		graphics.moveTo(middle + fix,middle - 8 + fix);
		graphics.lineTo(middle + fix, middle + 8 + fix);
		graphics.moveTo(middle - 8 + fix, middle + fix); 
		graphics.lineTo(middle + 8 + fix, middle + fix);
	}

	// draw
	graphics.stroke()
	offset = 5
	fill = false
	stroke = true
	shapeGraphics(graphics, color, width, sides, offset, fill, stroke)
} 

function shapeGraphics(graphics, color, width, sides, offset, fill, stroke)
{
	graphics.fillStyle = color
	graphics.strokeStyle = "#000000"
	graphics.lineWidth=1;

	if(sides == 3)
		pushdown = 4;
	else
		pushdown = 0;

	graphics.beginPath();
	graphics.moveTo(width/2,offset);  

	
	rad = width/2 - offset
	angle = (sides-2) * Math.PI/sides

	for (var i=1;i<=sides-1;i++)
	{ 
		l = Math.sqrt(2*rad*rad*(1 - Math.cos((Math.PI*2/sides) * i)))
		pointx = l * Math.cos((Math.PI/2 - angle/2)*i)
		pointy = l * Math.sin((Math.PI/2 - angle/2)*i) + offset	+ pushdown
		graphics.lineTo(pointx + width/2 , pointy); 
	}
	graphics.closePath();

	if (fill)
		graphics.fill()
	if (stroke)
		graphics.stroke()
}

function placeArrowBar(ondiv)
{
	var canvas = document.createElement('canvas');

	position = ondiv.attr('number');
	canvas.id = "arrowBar";
	canvas.height = 30
	canvas.width = 600

	var graphics = canvas.getContext("2d");

	graphics.strokeStyle = "#000000"
	graphics.lineWidth = "1";

	fix = 0.5
	start = ((position-1)%4) * 150 + 75 - 20

	graphics.beginPath();
	graphics.moveTo(start + fix,0 + fix);  

	graphics.lineTo(start + 6 + fix, 6 + fix); 
	graphics.moveTo(start + fix, 0 + fix); 
	graphics.lineTo(start - 6 + fix, 6 + fix); 

	graphics.moveTo(0 + fix, 15 + fix);
	graphics.lineTo(start + fix, 15+ fix); 
	graphics.lineTo(start + fix, 1 + fix);  


	graphics.stroke();

	$(ondiv).append(canvas);
}



// ######## Shape CLICK ######## // 

$('#content').on('click', '#canvas',  function(e) 
{
    e.preventDefault();

    prevClicked = $(this).attr('prevClicked')
    clickedBefore = $(this).hasClass('clickedBefore');
    clickid = $(this).attr('number')
    Votes = $(this).attr('Votes')
	htmlstring = getVSHtml($(this), clickid == 1);
	drawShapeUp($(this)[0]);
	drawShapeDown($(this)[0])

    if (clickid == prevClicked){
    	// If this shaped was already clicked
    	//drawShapeDown($(this)[0])

   		$('.vahaksucks').each(function(index){
			$(this).hide('fast');

			// set prevClicked on all shapes back to 0
			$('canvas').each(function()
		    {
		    	if ($(this).prop('id') == "canvas")
					$(this).attr("prevClicked", 0);
		    });
			
        });
    }
    else
    {
    	//drawShapeDown($(this)[0]);
        $('canvas').each(function(index, obj)
        {
        	if($(this).prop('id') == "canvas" && $(this).attr('number') != clickid)
            	drawShapeUp($(this)[0]);
        });

    	$('.vahaksucks').each(function(index){
    		if ($(this).attr('number') == clickid)
    		{
    			if (!clickedBefore)
    			{
    				fillVS($(this), htmlstring, false)
				}
				if(Math.floor((clickid-1)/4) == Math.floor((prevClicked-1)/4) && clickid != prevClicked)
    				$(this).show();
    			else
					$(this).show('fast');	
    		}
    		else
    		{
				if(Math.floor((clickid-1)/4) == Math.floor((prevClicked-1)/4) && clickid != prevClicked)
    				$(this).hide();
    			else
					$(this).hide('fast');	
    		}
    	});

    	$('canvas').each(function()
	    {
	    	if ($(this).prop('id') == "canvas")
	        	$(this).attr("prevClicked", clickid);
	    });
    };

    if (!clickedBefore)
    	$(this).toggleClass("clickedBefore");
});



// ######## Mouse over/out ######## //

//Canvas

$('#content').on('mouseover', '#canvas',  function(e) {
		e.preventDefault();
		if ($(this).attr('number') != $(this).attr('prevClicked'))
		{
			drawShapeDown($(this)[0])
		}			
});

$('#content').on('mouseout', '#canvas',  function(e) {
		e.preventDefault();
		if ($(this).attr('number') != $(this).attr('prevClicked'))
		{
			drawShapeUp($(this)[0])
		}
			
});

//Hull

$('#content').on('mouseover', '#hull',  function(e) {
		e.preventDefault();
		sides = $(this).attr('Sides')
		drawShapeHull($(this)[0], parseInt(sides) + 1, true)
			
});

$('#content').on('mouseout', '#hull',  function(e) {
		e.preventDefault();
		sides = $(this).attr('Sides')
		if (!$(this).prop('checked'))
		{
			drawShapeHull($(this)[0], parseInt(sides), false)
		}		
});


// ######## onCLICK ######## //

$('#content').on('click', '#hull',  function(e) {
	e.preventDefault();
	if(!$(this).prop('checked'))
	{
		clickid = $(this).parent().attr('number')

		// check if submit hull
		if(clickid == 1)
		{
			$.post( 
		     "insert.php",
		     {english: $('#english').val(), armenian: $('#armenian').val(), engName: $('#engName').val(), armName: $('#armName').val(), location: $('#location').val()},
		     function(data) {
		        $('#page').append(data);
		 	});
		}
		else
		{
			$('canvas').each(function()
		    {
		    	canvasEl = $(this)
		    	if (canvasEl.prop('id') == "canvas" && canvasEl.attr('number') == clickid)
		    	{
		        	dataID = canvasEl.attr('dataID');
		        	$.post( 
					     "upvote.php",
					     {ID: canvasEl.attr('dataID')},
					     function(data) {
					        console.log('upvoted')
				 	});

				 	// redraw shape
				 	canvasEl.attr('Votes', parseInt(canvasEl.attr('Votes')) +1);
				 	drawShapeUp($(this)[0])
				 	drawShapeDown($(this)[0])

				 	// refill VS
				 	$('.vahaksucks').each(function(index){
			    		if ($(this).attr('number') == clickid)
			    		{
			    			$(this).html("");
				 			fillVS($(this), getVSHtml(canvasEl, false), true);
				 		}
				 	});
		        }
		    });	
			
		}
	}
	$(this).prop('checked', true)
});

// Click pending

$('#pending').on('click', '#live',  function(e) {
	e.preventDefault();
	console.log($(this).attr('id_number'));
	$.post( 
     "../update.php",
     {ID: $(this).attr('id_number')},
     function(data) {
        location.reload(true)
 	});

});


$('#pending').on('click', '#kill',  function(e) {
	e.preventDefault();
	console.log("KILL");
	$.post( 
     "../kill.php",
     {ID: $(this).attr('id_number')},
     function(data) {
        location.reload(true)
 	});
});

$('#pending').on('click', '#delete',  function(e) {
	e.preventDefault();
	console.log("DELETED");
	$.post( 
     "../delete.php",
     {ID: $(this).attr('id_number')},
     function(data) {
        location.reload(true)
 	});
});


$('#pending').on('click', '#edit',  function(e) {
	e.preventDefault();
	console.log("id:", $(this).attr('id_number'), "arm:", $(this).siblings("#Armenian").val(), "eng:", $(this).siblings("#English").val(), "pla:", $(this).siblings("#Place").val(), "name:", $(this).siblings("#Name").val(), "armname:", $(this).siblings("#NameArm").val());
	$.post( 
     "../edit.php",
     {ID: $(this).attr('id_number'), armenian: $(this).siblings("#Armenian").val(), english: $(this).siblings("#English").val(), place: $(this).siblings("#Place").val(), name: $(this).siblings("#Name").val(), namearm: $(this).siblings("#NameArm").val()},
     function(data) {
        location.reload(true)
     });
 });


// ######## OTHER ######## // 

function rounder (number){
	remainder = number%4
		if (remainder == 0){
			return number
		}
		else{
			return Number(number) + 4 - remainder;
	};
}



function armConvert(number)
{	
	// submit case
	if (number == -1)
	{
		return "+"
	}
	//

	var letters = new Array("Ա","Բ","Գ","Դ","Ե","Զ","Է","Ը","Թ","Ժ","Ի","Լ","Խ","Ծ","Կ","Հ","Ձ","Ղ","Ճ","Մ","Յ","Ն","Շ","Ո","Չ","Պ","Ջ","Ռ","Ս","Վ","Տ","Ր","Ց","Ւ","Փ","Ք");
	round = 0
	outcome = ""
	while (number != 0)
	{
		curr = number % 10;
		number = Math.floor(number / 10);
		if (curr != 0)
		{
			outcome =  letters[curr + 10*round - (round +1)] + outcome;
		}
		round += 1;
	}
	return (outcome)
}

function getVSHtml(canvas, isSubmit)
{
	if(isSubmit)
	{
	    htmlstring = "  <div class='submittext'> \
					<input type='textbox' class='contentBox' id='english' placeholder='In English'></input> \
					<input type='textbox' class='contentBox' id='armenian' placeholder='Հայերենով'></input> \
					<input type='textbox' class='infoBox' id='engName' placeholder='Name in English'></input> \
					<input type='textbox' class='infoBox' id='armName' placeholder='Անունդ Հայերենով'></input> \
					<input type='textbox' class='infoBox' id='location' placeholder='Location'></input> \
				</div> "

	}
	else
	{

		Armenian = canvas.attr('Armenian')
	    English = canvas.attr('English')
	    Place = canvas.attr('Place')
	    Name = canvas.attr('Name')
	    NameArm = canvas.attr('NameArm')
	    leDate = canvas.attr('Date')
	    Votes = canvas.attr('Votes')

	    // other shape vahaksucks html
	    htmlstring = "	<span class='engFont'> In " +Place+", <br>	\
	    				"+Name+" Thought: '"+English+"'  <br>	\
	    				</span> <span class='armFont'> "+NameArm+"ը ըսավ: '"+Armenian+"'  <br> \
	    				Զինքը վաստակած է "+Votes+" կողմ: </span> 	"	
	}
	
    return (htmlstring)
}

function fillVS(vsElement, htmlstring, isHullChecked)
{
	placeArrowBar(vsElement);

	if(clickid == 1)
		makeShapeHull(80, 3, vsElement, true, isHullChecked)
	else
		makeShapeHull(80, Votes, vsElement, false, isHullChecked)

	vsElement.append(htmlstring);
}function on_load() 
{
	makeSubShape(4, 1, 120, '#content')
	template = $("#posts").html();
    $('#content').append(_.template(template,{"array":array}));
    $('.vahaksucks').each(function(index){
        $(this).hide(0);
    });
}

function on_load2(){
	template = $("#posts").html();
    $('#pending').append(_.template(template,{"array":array}));
}


// ######## SHAPES ######## // 

function makeShape(dataID, Armenian, English, Place, Name, NameArm, leDate, Votes, idcount, size, color, ondiv)
{
	var canvas = document.createElement('canvas');
	
	console.log(color);
	canvas.color = color
	canvas.id = "canvas";
	canvas.width = size;
	canvas.height = size;

	canvas.setAttribute('number', idcount)
	canvas.setAttribute('dataID', dataID)
	canvas.setAttribute('Armenian', Armenian)
	canvas.setAttribute('English', English)
	canvas.setAttribute('Place', Place)
	canvas.setAttribute('Name', Name)
	canvas.setAttribute('NameArm', NameArm)
	canvas.setAttribute('Date', leDate)
	canvas.setAttribute('Votes', Votes)
	canvas.setAttribute('Place', Place)
	canvas.setAttribute('prevClicked', 0)

	$('#content').append(canvas);
	
	drawShapeUp(canvas)
}

function makeSubShape(Votes, idcount, size, ondiv)
{
	var canvas = document.createElement('canvas');

	canvas.color = "#FFD464"
	canvas.id = "canvas";
	//canvas.id = "submitShape";
	canvas.width = size;
	canvas.height = size;

	canvas.setAttribute('number', idcount)
	canvas.setAttribute('Votes', Votes)
	canvas.setAttribute('prevClicked', 0)

	$('#content').append(canvas);
	
	drawShapeUp(canvas)
}

function makeShapeHull(size, sides, ondiv, isSubmit, isChecked)
{
	var canvas = document.createElement('canvas');
	canvas.id = "hull"

	if (isSubmit)
		canvas.style.marginTop = "3px"


	width = size
	height = size
	canvas.width = width
	canvas.height = height

	if (isChecked)
	{
		canvas.checked =  true;
		canvas.setAttribute('Sides', parseInt(sides) - 1)
	}
	else
	{
		canvas.checked =  false;
		canvas.setAttribute('Sides', parseInt(sides))
	}

	$(ondiv).append(canvas);

	drawShapeHull(canvas, sides)
}


function drawShapeUp(canvasIn)
{	
	var canvas = canvasIn

	id = $(canvas).attr('number')
	sides = $(canvas).attr('Votes')
	width = canvas.width
	height = canvas.height
	color = canvas.color

	var graphics = canvas.getContext("2d");

	// clear
	graphics.clearRect(0,0,width,height);
	canvas.width = canvas.width;
	
	// draw
	offset = 5
	fill = true
	stroke = false
	shapeGraphics(graphics, color, width, sides, offset, fill, stroke)


	// text
	graphics.fillStyle = "#FFFFFF";;
	graphics.textAlign="center"

	if (id == 1)
	{
		graphics.font = 'bold 33pt arial';
		graphics.fillText(armConvert(-1),width/2,height/2 + 16);
	}
	else
	{
		graphics.font = 'normal 27pt arian_amu';
		graphics.fillText(armConvert(sides),width/2,height/2 + 13);
	}
}

function drawShapeDown(canvasIn)
{
	var canvas = canvasIn

	id = $(canvas).attr('number')
	sides = $(canvas).attr('Votes')
	width = canvas.width
	height = canvas.height
	color = canvas.color
	color = '#FFFFFF'

	var graphics = canvas.getContext("2d");

	graphics.globalAlpha   = 0.2;
	
	offset = 5
	fill = true
	stroke = false

	shapeGraphics(graphics, color, width, sides, offset, fill, stroke)
}


function drawShapeHull(canvasIn, sides, check)
{
	var canvas = canvasIn
	width = canvas.width
	height = canvas.height
	var graphics = canvas.getContext("2d");

	// clear
	graphics.clearRect(0,0,width,height);
	canvas.width = canvas.width;

	fix = 0.5;
	middle = width/2;

	if (check)
	{
		fix = 0;
		//check
		graphics.moveTo(middle - 6 + fix - 2, middle + fix);
		graphics.lineTo(middle + fix - 2, middle + 6 + fix); 
		graphics.lineTo(middle + 12 + fix - 2, middle - 6 + fix);
	}
	else
	{
		// +
		graphics.moveTo(middle + fix,middle - 8 + fix);
		graphics.lineTo(middle + fix, middle + 8 + fix);
		graphics.moveTo(middle - 8 + fix, middle + fix); 
		graphics.lineTo(middle + 8 + fix, middle + fix);
	}

	// draw
	graphics.stroke()
	offset = 5
	fill = false
	stroke = true
	shapeGraphics(graphics, color, width, sides, offset, fill, stroke)
} 

function shapeGraphics(graphics, color, width, sides, offset, fill, stroke)
{
	graphics.fillStyle = color
	graphics.strokeStyle = "#000000"
	graphics.lineWidth=1;

	if(sides == 3)
		pushdown = 4;
	else
		pushdown = 0;

	graphics.beginPath();
	graphics.moveTo(width/2,offset);  

	
	rad = width/2 - offset
	angle = (sides-2) * Math.PI/sides

	for (var i=1;i<=sides-1;i++)
	{ 
		l = Math.sqrt(2*rad*rad*(1 - Math.cos((Math.PI*2/sides) * i)))
		pointx = l * Math.cos((Math.PI/2 - angle/2)*i)
		pointy = l * Math.sin((Math.PI/2 - angle/2)*i) + offset	+ pushdown
		graphics.lineTo(pointx + width/2 , pointy); 
	}
	graphics.closePath();

	if (fill)
		graphics.fill()
	if (stroke)
		graphics.stroke()
}

function placeArrowBar(ondiv)
{
	var canvas = document.createElement('canvas');

	position = ondiv.attr('number');
	canvas.id = "arrowBar";
	canvas.height = 30
	canvas.width = 600

	var graphics = canvas.getContext("2d");

	graphics.strokeStyle = "#000000"
	graphics.lineWidth = "1";

	fix = 0.5
	start = ((position-1)%4) * 150 + 75 - 20

	graphics.beginPath();
	graphics.moveTo(start + fix,0 + fix);  

	graphics.lineTo(start + 6 + fix, 6 + fix); 
	graphics.moveTo(start + fix, 0 + fix); 
	graphics.lineTo(start - 6 + fix, 6 + fix); 

	graphics.moveTo(0 + fix, 15 + fix);
	graphics.lineTo(start + fix, 15+ fix); 
	graphics.lineTo(start + fix, 1 + fix);  


	graphics.stroke();

	$(ondiv).append(canvas);
}



// ######## Shape CLICK ######## // 

$('#content').on('click', '#canvas',  function(e) 
{
    e.preventDefault();

    prevClicked = $(this).attr('prevClicked')
    clickedBefore = $(this).hasClass('clickedBefore');
    clickid = $(this).attr('number')
    Votes = $(this).attr('Votes')
	htmlstring = getVSHtml($(this), clickid == 1);
	drawShapeUp($(this)[0]);
	drawShapeDown($(this)[0])

    if (clickid == prevClicked){
    	// If this shaped was already clicked
    	//drawShapeDown($(this)[0])

   		$('.vahaksucks').each(function(index){
			$(this).hide('fast');

			// set prevClicked on all shapes back to 0
			$('canvas').each(function()
		    {
		    	if ($(this).prop('id') == "canvas")
					$(this).attr("prevClicked", 0);
		    });
			
        });
    }
    else
    {
    	//drawShapeDown($(this)[0]);
        $('canvas').each(function(index, obj)
        {
        	if($(this).prop('id') == "canvas" && $(this).attr('number') != clickid)
            	drawShapeUp($(this)[0]);
        });

    	$('.vahaksucks').each(function(index){
    		if ($(this).attr('number') == clickid)
    		{
    			if (!clickedBefore)
    			{
    				fillVS($(this), htmlstring, false)
				}
				if(Math.floor((clickid-1)/4) == Math.floor((prevClicked-1)/4) && clickid != prevClicked)
    				$(this).show();
    			else
					$(this).show('fast');	
    		}
    		else
    		{
				if(Math.floor((clickid-1)/4) == Math.floor((prevClicked-1)/4) && clickid != prevClicked)
    				$(this).hide();
    			else
					$(this).hide('fast');	
    		}
    	});

    	$('canvas').each(function()
	    {
	    	if ($(this).prop('id') == "canvas")
	        	$(this).attr("prevClicked", clickid);
	    });
    };

    if (!clickedBefore)
    	$(this).toggleClass("clickedBefore");
});



// ######## Mouse over/out ######## //

//Canvas

$('#content').on('mouseover', '#canvas',  function(e) {
		e.preventDefault();
		if ($(this).attr('number') != $(this).attr('prevClicked'))
		{
			drawShapeDown($(this)[0])
		}			
});

$('#content').on('mouseout', '#canvas',  function(e) {
		e.preventDefault();
		if ($(this).attr('number') != $(this).attr('prevClicked'))
		{
			drawShapeUp($(this)[0])
		}
			
});

//Hull

$('#content').on('mouseover', '#hull',  function(e) {
		e.preventDefault();
		sides = $(this).attr('Sides')
		drawShapeHull($(this)[0], parseInt(sides) + 1, true)
			
});

$('#content').on('mouseout', '#hull',  function(e) {
		e.preventDefault();
		sides = $(this).attr('Sides')
		if (!$(this).prop('checked'))
		{
			drawShapeHull($(this)[0], parseInt(sides), false)
		}		
});


// ######## onCLICK ######## //

$('#content').on('click', '#hull',  function(e) {
	e.preventDefault();
	if(!$(this).prop('checked'))
	{
		clickid = $(this).parent().attr('number')

		// check if submit hull
		if(clickid == 1)
		{
			$.post( 
		     "insert.php",
		     {english: $('#english').val(), armenian: $('#armenian').val(), engName: $('#engName').val(), armName: $('#armName').val(), location: $('#location').val()},
		     function(data) {
		        $('#page').append(data);
		 	});
		}
		else
		{
			$('canvas').each(function()
		    {
		    	canvasEl = $(this)
		    	if (canvasEl.prop('id') == "canvas" && canvasEl.attr('number') == clickid)
		    	{
		        	dataID = canvasEl.attr('dataID');
		        	$.post( 
					     "upvote.php",
					     {ID: canvasEl.attr('dataID')},
					     function(data) {
					        console.log('upvoted')
				 	});

				 	// redraw shape
				 	canvasEl.attr('Votes', parseInt(canvasEl.attr('Votes')) +1);
				 	drawShapeUp($(this)[0])
				 	drawShapeDown($(this)[0])

				 	// refill VS
				 	$('.vahaksucks').each(function(index){
			    		if ($(this).attr('number') == clickid)
			    		{
			    			$(this).html("");
				 			fillVS($(this), getVSHtml(canvasEl, false), true);
				 		}
				 	});
		        }
		    });	
			
		}
	}
	$(this).prop('checked', true)
});

// Click pending

$('#pending').on('click', '#live',  function(e) {
	e.preventDefault();
	console.log($(this).attr('id_number'));
	$.post( 
     "../update.php",
     {ID: $(this).attr('id_number')},
     function(data) {
        location.reload(true)
 	});

});


$('#pending').on('click', '#kill',  function(e) {
	e.preventDefault();
	console.log("KILL");
	$.post( 
     "../kill.php",
     {ID: $(this).attr('id_number')},
     function(data) {
        location.reload(true)
 	});
});

$('#pending').on('click', '#delete',  function(e) {
	e.preventDefault();
	console.log("DELETED");
	$.post( 
     "../delete.php",
     {ID: $(this).attr('id_number')},
     function(data) {
        location.reload(true)
 	});
});


$('#pending').on('click', '#edit',  function(e) {
	e.preventDefault();
	console.log("id:", $(this).attr('id_number'), "arm:", $(this).siblings("#Armenian").val(), "eng:", $(this).siblings("#English").val(), "pla:", $(this).siblings("#Place").val(), "name:", $(this).siblings("#Name").val(), "armname:", $(this).siblings("#NameArm").val());
	$.post( 
     "../edit.php",
     {ID: $(this).attr('id_number'), armenian: $(this).siblings("#Armenian").val(), english: $(this).siblings("#English").val(), place: $(this).siblings("#Place").val(), name: $(this).siblings("#Name").val(), namearm: $(this).siblings("#NameArm").val()},
     function(data) {
        location.reload(true)
     });
 });


// ######## OTHER ######## // 

function rounder (number){
	remainder = number%4
		if (remainder == 0){
			return number
		}
		else{
			return Number(number) + 4 - remainder;
	};
}



function armConvert(number)
{	
	// submit case
	if (number == -1)
	{
		return "+"
	}
	//

	var letters = new Array("Ա","Բ","Գ","Դ","Ե","Զ","Է","Ը","Թ","Ժ","Ի","Լ","Խ","Ծ","Կ","Հ","Ձ","Ղ","Ճ","Մ","Յ","Ն","Շ","Ո","Չ","Պ","Ջ","Ռ","Ս","Վ","Տ","Ր","Ց","Ւ","Փ","Ք");
	round = 0
	outcome = ""
	while (number != 0)
	{
		curr = number % 10;
		number = Math.floor(number / 10);
		if (curr != 0)
		{
			outcome =  letters[curr + 10*round - (round +1)] + outcome;
		}
		round += 1;
	}
	return (outcome)
}

function getVSHtml(canvas, isSubmit)
{
	if(isSubmit)
	{
	    htmlstring = "  <div class='submittext'> \
					<input type='textbox' class='contentBox' id='english' placeholder='In English'></input> \
					<input type='textbox' class='contentBox' id='armenian' placeholder='Հայերենով'></input> \
					<input type='textbox' class='infoBox' id='engName' placeholder='Name in English'></input> \
					<input type='textbox' class='infoBox' id='armName' placeholder='Անունդ Հայերենով'></input> \
					<input type='textbox' class='infoBox' id='location' placeholder='Location'></input> \
				</div> "

	}
	else
	{

		Armenian = canvas.attr('Armenian')
	    English = canvas.attr('English')
	    Place = canvas.attr('Place')
	    Name = canvas.attr('Name')
	    NameArm = canvas.attr('NameArm')
	    leDate = canvas.attr('Date')
	    Votes = canvas.attr('Votes')

	    // other shape vahaksucks html
	    htmlstring = "	<span class='engFont'> In " +Place+", <br>	\
	    				"+Name+" Thought: '"+English+"'  <br>	\
	    				</span> <span class='armFont'> "+NameArm+"ը ըսավ: '"+Armenian+"'  <br> \
	    				Զինքը վաստակած է "+Votes+" կողմ: </span> 	"	
	}
	
    return (htmlstring)
}

function fillVS(vsElement, htmlstring, isHullChecked)
{
	placeArrowBar(vsElement);

	if(clickid == 1)
		makeShapeHull(80, 3, vsElement, true, isHullChecked)
	else
		makeShapeHull(80, Votes, vsElement, false, isHullChecked)

	vsElement.append(htmlstring);
}