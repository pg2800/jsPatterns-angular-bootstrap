(function(){
	angular.module("patterns", /*dependencies*/["ngRoute", "HomeModule", "SearchFilterModule", "ShapesCanvasModule", "HistoryStackModule"])

	.controller("HomeController", ["HomeService", function (HomeService){
		HomeService.run();
	}])
	.controller("SearchFilterController", ["SearchFilterService", function (SearchFilterService){
		SearchFilterService.run();
	}])
	.controller("ShapesCanvasController", ["ShapesCanvasService", function (ShapesCanvasService){
		ShapesCanvasService.run();
	}])
	.controller("HistoryStackController", ["HistoryStackService", function (HistoryStackService){
		HistoryStackService.run();
	}])

	.config(["$routeProvider", function($routeProvider){
		$routeProvider.when("/", {
			templateUrl: "../views/home.html",
			controller: "HomeController"
		})
		.when("/search_filter", {
			templateUrl: "../views/searchFilter.html",
			controller: "SearchFilterController"
		})
		.when("/shapes_canvas", {
			templateUrl: "../views/shapesCanvas.html",
			controller: "ShapesCanvasController"
		})
		.when("/history_stack", {
			templateUrl: "../views/historyStack.html",
			controller: "HistoryStackController"
		})
		.otherwise({
			templateUrl: "../views/home.html",
			controller: "HomeController"
		});
	}]);
})();