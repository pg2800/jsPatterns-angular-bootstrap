angular.module("ShapesCanvasModule", [/*dependencies*/])
.factory("ShapesCanvasService", [function(){
	return {
		run: function(){
			publish("shapesCanvas");
		}
	};
}]);