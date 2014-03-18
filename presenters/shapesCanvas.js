angular.module("ShapesCanvasModule", [/*dependencies*/])
.factory("ShapesCanvasService", [function(){
	return {
		run: function(){

			// factory of shapes
			var shapesAbstractFactory = (function (){
				function deg2rad(angle) {
					return angle * (Math.PI/180.0);
				}
				function Polygon(x, y, z, radius, numOfSides, color, fill){
					if(numOfSides<1) numOfSides = 1;
					this.x = x;
					this.y = y;
					this.z = z;
					this.color = color || "#0000FF";
					this.fill = fill || "#0000FF";
					this.radius = radius;
					this.numOfSides = numOfSides;
				}
				Polygon.prototype.drawPolygon = function (context) {
					var x = this.x,
					y = this.y,
					radius = this.radius,
					numOfSides = this.numOfSides,
 					fillStyle = this.fill,
 					fillStyle = this.color,
 					angChange = deg2rad(360.0/numOfSides),
					prevX,
					prevY,
					firstX,
					firstY;
					context.strokeStyle = this.color;
					context.lineWidth = 3;
					for(var i=0;i<numofsides;i++) { 
						angle=i*angChange;
						prevX=x1;
						prevY=y1;
						x1=x+Math.cos(angle);
						var y1=y+Math.sin(angle) * radius;
						if(i> 0) {
							context.moveTo(prevX,prevY);
							context.lineTo(x1,y1);
						}
						else {
							firstX = x1;
							firstY = y1;
						}
						if(i == numOfSides-1)
							context.lineTo(firstX,firstY);
						context.stroke();
					}
				}
				function newPolygon(){
					return new Polygon(arguments);
				}
				return {
					newPolygon: newPolygon
				};
			})();
			

			// facade
			function renderShapesFacade(){

				return {
					/// execute	
				};
			}

			// mediator
			// to tell which one has been clicked and also update whatever it needs to update

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



			publish("shapesCanvas");

		}
	};
}]);