angular.module("HistoryStackModule", [/*dependencies*/])
.factory("HistoryStackService", [function(){
	return {
		run: function(){
			publish("historyStack");
		}
	};
}]);