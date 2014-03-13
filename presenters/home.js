angular.module("HomeModule", [/*dependencies*/])
.factory("HomeService", [function(){
	return {
		run: function(){
			publish("home");
		}
	}
}]);