(function(){
	angular.module("patterns", /*dependencies*/["ngRoute", "HomeModule", "SearchFilterModule", "ShapesCanvasModule", "HistoryStackModule"])

	.controller("HomeController", ["HomeService", function (HomeService){
		publish("leaving");
		HomeService.run();
	}])
	.controller("SearchFilterController", ["SearchFilterService", function (SearchFilterService){
		publish("leaving");
		SearchFilterService.run();
	}])
	.controller("ShapesCanvasController", ["ShapesCanvasService", function (ShapesCanvasService){
		publish("leaving");
		ShapesCanvasService.run();
	}])
	.controller("HistoryStackController", ["HistoryStackService", function (HistoryStackService){
		publish("leaving");
		HistoryStackService.run();
		publish("historyStack");
	}])

	.config(["$routeProvider", function($routeProvider){
		$routeProvider.when("/", {
			templateUrl: "views/home.html",
			controller: "HomeController"
		})
		.when("/search_filter", {
			templateUrl: "views/searchFilter.html",
			controller: "SearchFilterController"
		})
		.when("/shapes_canvas", {
			templateUrl: "views/shapesCanvas.html",
			controller: "ShapesCanvasController"
		})
		.when("/history_stack", {
			templateUrl: "views/historyStack.html",
			controller: "HistoryStackController"
		})
		.otherwise({
			templateUrl: "views/home.html",
			controller: "HomeController"
		});
	}]);
})();