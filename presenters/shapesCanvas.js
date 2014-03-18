angular.module("ShapesCanvasModule", [/*dependencies*/])
.factory("ShapesCanvasService", [function(){
	return {
		run: function(){
			// factory of shapes
			var shapesAbstractFactory = (function (){
				var polygons = [];
				function renderPolygons(){

				}
				function deg2rad(angle) {
					return angle * (Math.PI/180.0);
				}
				function Polygon(x, y, z, radius, numOfSides, color, fill){
					this.x = x;
					this.y = y;
					this.z = z;
					this.color = color || "#0000FF";
					this.fill = fill || "#0000FF";
					this.radius = radius;
					this.numOfSides = numOfSides > 0 ? numOfSides : 1;
				}
				Polygon.prototype.drawPolygon = function (context) {
					var radius = this.radius,
					x = this.x - radius,
					y = this.y - radius, 
					numOfSides = this.numOfSides,
					fillStyle = this.fill,
					fillStyle = this.color,
					angChange = deg2rad(360.0/numOfSides),
					prevX, prevY, firstX, firstY;
					context.strokeStyle = this.color;
					context.lineWidth = 3;
					for(var i=0;i<numofsides;i++) { 
						angle = i * angChange;
						prevX = x;
						prevY = y;
						x = x + Math.cos(angle);
						y = y + Math.sin(angle) * radius;
						if(i > 0) {
							context.moveTo(prevX, prevY);
							context.lineTo(x, y);
						}
						else {
							firstX = x;
							firstY = y;
						}
						if(i == numOfSides - 1) context.lineTo(firstX,firstY);
						context.stroke();
					}
					Polygon.prototype.checkPoint = function (numOfSides, x_CoordinatesArray, float *y_CoordinatesArray, float x_coordinate, float y_coordinate){
						var i, j, c = false;
						for (i = 0, j = numOfSides-1; i < numOfSides; j = i++) {
							if ( ((y_CoordinatesArray[i]>y_coordinate) != (y_CoordinatesArray[j]>y_coordinate)) &&
								(x_coordinate < (x_CoordinatesArray[j]-x_CoordinatesArray[i]) * 
									(y_coordinate-y_CoordinatesArray[i]) / (y_CoordinatesArray[j]-y_CoordinatesArray[i]) + x_CoordinatesArray[i]) )
								c = !c;
						}
						return c;
					};
				}
				function newPolygon(x, y, z, radius, numOfSides, color, fill){
					return new Polygon(x, y, z, radius, numOfSides, color, fill);
				}
				return {
					newPolygon: newPolygon
				};
			})();

			// mediator
			// to tell which one has been clicked and also update whatever it needs to update
			// on canvas click
			function shapesMediator(e){
				console.log(this);
				console.log(e);
			}



			
			function renderShapesFacade(){

				return {
					/// execute	
				};
			}
			// facade
			({}).subscribe("shapesCreatorMediator", function (){

			});
			

			publish("shapesCanvas");





			// //get a reference to the canvas
			// var ctx = document.getElementById("theCanvasJS").getContext("2d");

			// //draw a circle
			// ctx.beginPath();
			// ctx.arc(60, 75, 20, 0 * Math.PI, 2 * Math.PI, true); 
			// ctx.closePath();
			// ctx.fill();

			// // Draw triangle
			// ctx.fillStyle="#A2322E";
			// ctx.beginPath();
			// // Draw a triangle location for each corner from x:y 100,110 -> 200,10 -> 300,110 (it will return to first point)
			// ctx.moveTo(100,110);
			// ctx.lineTo(200,10);
			// ctx.lineTo(300,110);
			// ctx.closePath();
			// ctx.fill();




		}
	};
}]);