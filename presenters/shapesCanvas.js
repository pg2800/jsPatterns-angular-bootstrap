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
							z = this.z,
							numOfSides = this.numOfSides,
							angChange = deg2rad(360.0/numOfSides),
							prevX, prevY, firstX, firstY;

							context = context.getContext('2d');
							shadow = shadow.getContext('2d');

							context.beginPath();
							shadow.beginPath();

							context.strokeStyle = this.color;
							context.fillStyle = this.fill;
							shadow.strokeStyle = this.UniversalColorID,
							shadow.fillStyle = this.UniversalColorID,
							context.lineWidth = shadow.lineWidth = 3;
							for(var i=0;i<numOfSides;i++) { 
								angle = i * angChange;
								prevX = x;
								prevY = y;
								x = x + Math.cos(angle) * radius;
								y = y + Math.sin(angle) * radius;
								if(i > 0) {
									context.moveTo(prevX, prevY, z);
									shadow.moveTo(prevX, prevY, z);
									context.lineTo(x, y);
									shadow.lineTo(x, y);
								}
								else {
									firstX = x;
									firstY = y;
								}
								if(i == numOfSides - 1) {
									context.lineTo(firstX,firstY);
									shadow.lineTo(firstX,firstY);
								} 
							}
							context.closePath();
							shadow.closePath();

							context.stroke();
							context.fill();
							shadow.stroke();
							shadow.fill();
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
				return {
					newPolygon: newPolygon,
					getPolygons: getPolygons
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

				var z_index = 0;
				function mouseDoubleClick(options){
					e = options.e;
					var pos = findPos(this),
					x = x_init = e.pageX - pos.x,
					y = y_init = e.pageY - pos.y;
					shapesAbstractFactory.newPolygon(x, y, z_index++, 100, 3, "red", "blue");
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