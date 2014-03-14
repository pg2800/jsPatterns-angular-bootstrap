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

	// Subscribers
	var links = $("#menuLinks a");
	Object.keys(links).forEach(function (key){
		var link = links[key], reference;
		if(!(link instanceof HTMLElement)) return;
		reference = link.getAttribute("data-meta");
 		// Subscribing links for selected menu link 
 		link.subscribe(reference, function(){
 			$("#menuLinks .active").attr("class", "");
 			$(link).parent().attr("class", "active");
 		});
 	});

	// Subscribing Canvas from shapesCanvas View to rezise the canvas.
	({}).subscribe("shapesCanvas", function(){
		addEvent(window, "resize", handler);
		function handler(){
			var canvasContainers = document.getElementsByClassName("canvasContainer");
			var theCanvas = document.getElementById("theCanvasJS");
			if(!theCanvas) {
				removeHandler(); 
				return;
			}
			var canvasHeight = getComputedStylePropertyValue(theCanvas, "height");
			Object.keys(canvasContainers).forEach(function(key){
				if(!(canvasContainers[key] instanceof HTMLElement)) return;
				$(canvasContainers[key]).css("height", canvasHeight);
			});
		}
		function removeHandler(){
			removeEvent(window, "resize", handler);
			return true;
		}
		handler();
	});
})(jQuery);