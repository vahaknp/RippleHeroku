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
})(jQuery);