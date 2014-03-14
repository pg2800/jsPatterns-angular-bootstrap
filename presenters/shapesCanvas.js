angular.module("ShapesCanvasModule", [/*dependencies*/])
.factory("ShapesCanvasService", [function(){
	return {
		run: function(){

			//get a reference to the canvas
			var ctx = document.getElementById("theCanvasJS").getContext("2d");

			//draw a circle
			ctx.beginPath();
			ctx.arc(60, 75, 20, 0 * Math.PI, 2 * Math.PI, true); 
			ctx.closePath();
			ctx.fill();

			// Draw triangle
			ctx.fillStyle="#A2322E";
			ctx.beginPath();
			// Draw a triangle location for each corner from x:y 100,110 -> 200,10 -> 300,110 (it will return to first point)
			ctx.moveTo(100,110);
			ctx.lineTo(200,10);
			ctx.lineTo(300,110);
			ctx.closePath();
			ctx.fill();



			publish("shapesCanvas");

		}
	};
}]);