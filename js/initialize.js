(function($){
	// Observer:
	$('.nav a').on('click', function(){
		$(".navbar-toggle").click();
	});
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
			if(canvasContainers.length<1) {
				removeHandler();
				return;
			}
			Object.keys(canvasContainers).forEach(function (key){
				if(!(canvasContainers[key] instanceof HTMLElement))return;
				var canvasContainer = canvasContainers[key], 
				canvasID = canvasContainer.getAttribute("data-canvasID"),
				height = Number(($(canvasContainer).css("height")).replace(/px$/,"")),
				width = Number(($(canvasContainer).css("width")).replace(/px$/,""));
				if(!canvasID || !height || !width) return;
				var canvas, canvasExists = !!(canvas = $(canvasContainer).children("canvas")[0]);
				canvas = canvas || document.createElement("canvas");
				$(canvas).attr("id", canvasID);
				$(canvas).attr("height", (height-3)+"px");
				$(canvas).attr("width", (width-4)+"px");
				$(canvas).css("margin-left", "-13px");
				$(canvas).css("margin-top", "-7px");
				if(!canvasExists) canvasContainer.appendChild(canvas); 
				publish("renderCanvas");
			});
			//
		}
		function removeHandler(){
			removeEvent(window, "resize", handler);
			return true;
		}
		handler();

	});

})(jQuery);