angular.module("ShapesCanvasModule", [/*dependencies*/])
.factory("ShapesCanvasService", [function(){
	return {
		run: function(){
			// factory of shapes
			var shapesAbstractFactory = (function (){
				var polygons = {};
				var color = 0; // max: 16777215
				function nextUniversalColor(){
					color+=1;
					if(color > 16777215) throw "NO MORE SHAPES TO BUILD";
					return "#" + ("000000" + color.toString(16)).slice(-6);
				}
				function deg2rad(angle) {return angle * (Math.PI/180.0);}
				function Polygon(x, y, z, radius, numOfSides, color, fill){
					Object.defineProperty(this, "UniversalColorID", {value: nextUniversalColor()});
					this.x = x;
					this.y = y;
					this.z = z;
					this.color = color || this.UniversalColorID;
					this.fill = fill || this.UniversalColorID;
					this.radius = radius;
					this.numOfSides = numOfSides > 0 ? numOfSides : 1;
				}
				Object.defineProperties(Polygon.prototype, {
					"renderInto": {
						value: function (context, shadow) {
							var radius = this.radius,
							x = this.x - radius/2,
							y = this.y - radius/2, 
							// z = this.z,
							numOfSides = this.numOfSides,
							angChange = deg2rad(360.0/numOfSides),
							prevX, prevY, firstX = x, firstY = y;

							context = context.getContext('2d');
							shadow = shadow.getContext('2d');

							context.beginPath();
							shadow.beginPath();

							context.strokeStyle = this.color;
							shadow.strokeStyle = this.UniversalColorID;

							context.fillStyle = this.fill;
							shadow.fillStyle = this.UniversalColorID;

							context.lineWidth = shadow.lineWidth = 3;
							var angle;
							for(var i=0;i<numOfSides;i++) { 
								angle = i * angChange;
								prevX = x;
								prevY = y;
								x = x + Math.cos(angle) * radius;
								y = y + Math.sin(angle) * radius;
								context.lineTo(x, y);
								shadow.lineTo(x, y);
							}
							context.closePath();
							context.fill();
							context.stroke();
							shadow.closePath();
							shadow.fill();
							shadow.stroke();
						}
					}
				});
				//
				function newPolygon(x, y, z, radius, numOfSides, color, fill){
					var p = new Polygon(x, y, z, radius, numOfSides, color, fill);
					return polygons[p.UniversalColorID] = p;
				}
				function getPolygons(){
					return polygons;
				}
				function clearPolygons(){
					polygons = {};
					color = 0;
				}
				return {
					newPolygon: newPolygon,
					getPolygons: getPolygons,
					clearPolygons: clearPolygons
				};
			})();

			// facade to render shapes into canvas
			var canvasFacade = (function (){
				function renderPolygonsInto(canvas, shadow){
					// HACK TO CLEAR CANVAS and SHADOW:
					canvas.width = canvas.width;
					shadow.width = shadow.width;

					var polygons = shapesAbstractFactory.getPolygons();
					for(var key in polygons){
						if(!polygons.hasOwnProperty(key)) return; 
						polygons[key].renderInto(canvas, shadow);
					}
				}
				function findPos(obj) {
					var curleft = 0, curtop = 0;
					if (obj.offsetParent) {
						do {
							curleft += obj.offsetLeft;
							curtop += obj.offsetTop;
						} while (obj = obj.offsetParent);
						return { x: curleft, y: curtop };
					}
				}
				function rgbToHex(r, g, b) {
					if (r > 255 || g > 255 || b > 255) throw "Invalid color component";
					return ((r << 16) | (g << 8) | b).toString(16);
				}

				var sizes = {small:40, medium:70, large:100};
				function getSize(){
					var val = $("#inputSize").val().toLowerCase(), size, num;
					if((size = sizes[val])) return size;
					if((num = Number(val)) && num > 30 && num < 110) return num;
					return sizes.medium;
				}
				var shapes = {triangle:3, quadrilateral:4, pentagon:5};
				function getShape(){
					var val = $("#inputShape").val().toLowerCase(), shape, num;
					if((shape = shapes[val])) return shape;
					if((num = Number(val)) && num > 2 && num < 15) return num;
					return shapes.quadrilateral;
				}
				var colors = {black:"#000000", blue:"#0000ff", red:"#ff0000"},
				hexRegEx = /^#(?:[0-9a-zA-Z]{3}|[0-9a-zA-Z]{6})$/;
				function getColor(c){
					var color, test;
					if((color = colors[c])) return color;
					if((test = hexRegEx.test(c))) return c;
					return colors.blue;
				}
				function getStrokeColor(){
					var val = $("#inputStroke").val().toLowerCase();
					return getColor(val);
				}
				function getFillColor(){
					var val = $("#inputFill").val().toLowerCase();
					return getColor(val);
				}
				var z_index = 0;
				function mouseDoubleClick(options){
					e = options.e;
					var pos = findPos(this),
					x = x_init = e.pageX - pos.x,
					y = y_init = e.pageY - pos.y,
					size = getSize(),
					shape = getShape(),
					stroke = getStrokeColor(),
					fill = getFillColor();

					shapesAbstractFactory.newPolygon(x, y, z_index++, size, shape, stroke, fill);
					publish("renderCanvas");
				}
				var shape, x_init, y_init;
				function mouseDownHandler(options){
					e = options.e;
					var context = this.getContext('2d'),
					pos = findPos(this),
					x = x_init = e.pageX - pos.x, 
					y = y_init = e.pageY - pos.y, 
					p = context.getImageData(x, y, 1, 1).data,
					polygons = shapesAbstractFactory.getPolygons();
					shape = polygons["#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6)];
					if(shape) shape.z = z_index++;
				}
				function mouseMoveHandler(options){
					e = options.e;
					if(!shape || !x_init || !y_init) return;
					var pos = findPos(this),
					x = e.pageX - pos.x, 
					y = e.pageY - pos.y;

					x_init += x - x_init;
					y_init += y - y_init;

					shape.x = x_init;
					shape.y = y_init;
					publish("renderCanvas");
				}
				function mouseUpHandler(options){
					e = options.e;
					shape = x_init = y_init = null;
				}

				return {
					renderPolygonsInto: renderPolygonsInto,
					mouseDownHandler: mouseDownHandler,
					mouseMoveHandler: mouseMoveHandler,
					mouseUpHandler: mouseUpHandler,
					mouseDoubleClick: mouseDoubleClick
				};
			})();

			// subscribing to event
			shapesAbstractFactory.subscribe("clearCanvas", "clearPolygons");
			var canvasContainer = document.getElementById("canvasContainer").childNodes;
			canvasFacade.subscribe("canvasMouseDown", "mouseDownHandler");
			canvasFacade.subscribe("canvasMousemove", "mouseMoveHandler");
			canvasFacade.subscribe("canvasMouseUp", "mouseUpHandler");
			canvasFacade.subscribe("canvasDblClick", "mouseDoubleClick");
			({}).subscribe("renderCanvas", function (){
				canvasFacade.renderPolygonsInto(canvasContainer[1], canvasContainer[3]);
			});

			publish("shapesCanvas");
		}
	};
}]);