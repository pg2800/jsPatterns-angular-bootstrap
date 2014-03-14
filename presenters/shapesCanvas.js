angular.module("ShapesCanvasModule", [/*dependencies*/])
.factory("ShapesCanvasService", [function(){
	return {
		run: function(){
			function fixCanvasHeight(){
				var canvasContainers = document.getElementsByClassName("canvasContainer");
				Object.keys(canvasContainers).forEach(function(key){
					console.log(key);
				});
			}
			fixCanvasHeight();

			// //get a reference to the canvas
			// var ctx = document.getElementById("modelCanvasJS").getContext("2d");

			// //draw a circle
			// ctx.beginPath();
			// ctx.arc(60, 75, 20, 0 * Math.PI, 2 * Math.PI, true); 
			// ctx.closePath();
			// ctx.fill();
			// publish("shapesCanvas");
		}
	};
}]);