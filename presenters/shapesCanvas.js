angular.module("ShapesCanvasModule", [/*dependencies*/])
.factory("ShapesCanvasService", [function(){
	return {
		run: function(){

			//must be at the beginning


			// factory of shapes
			var shapesCommandRevealingModule = (function (){
				var shapesFactory = (function (){
					function Shape(options){
						var self = this;
						Object.keys(options).forEach(function (key){
							if(!options.hasOwnProperty(key)) return;
							self[key] = options[key];
						});
					}
					// Shape.prototype.move
					function Circle(options){

					}
					// Circle.prototype.calculate	
					function Triangle(options){

					}
					function Square(options){

					}
					return {
						circle: Circle,
						triangle: Triangle,
						square: Square
					};
				})();
				function createShape(type, options){
					if(!type || type.constructor !== String) return;
					return shapesFactory[type] && new shapes[type](options);
				}
				return { // revealing module pattern
					create: createShape, //command pattern

				};
			})();
			

			// facade
			function renderShapesFacade(){

				return {
					// execute	
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