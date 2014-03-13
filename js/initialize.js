(function($){
	// Publish && Subscribe
	(function(){
		var topics = {};
		// Publish
		Object.defineProperty(window, "publish", {
			value: function (topicName){
				var topic;
				if(!topicName) return;
				if(!(topic = topics[topicName])) return;
				topic.forEach(function (handler){
					handler();
				});
			}
		});
		// Subscriber
		Object.defineProperty(Object.prototype, "subscribe", {
			value: function (topicName, handler){
				if(!topicName || !handler) return;
				var self = this, topic = topics[topicName] || (topics[topicName] = []);
				if(handler instanceof Function){
					topic.push(handler);
				} else if(typeof handler == "string"){
					topic.push(function (){
						if(self[handler] && self[handler] instanceof Function) return self[handler]();
						else return;
					});
				}
			}
		});
	})();

	var links = $("#menuLinks a");
	Object.keys(links).forEach(function (key){
		var link = links[key], reference;
		if(!(link instanceof HTMLElement)) return;
		reference = link.getAttribute("data-meta");
		link.subscribe(reference, function(){
			$("#menuLinks .active").attr("class", "");
			$(link).parent().attr("class", "active");
		});
	});
})(jQuery);