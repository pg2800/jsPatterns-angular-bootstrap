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
	// This will be executed first when the controller publishes the topic
	({}).subscribe("shapesCanvas", function(){
		$(window).on("resize", handler);
		function handler(){
			var canvasContainer = document.getElementById("canvasContainer");
			if(!canvasContainer) return removeHandler();
			canvasID = canvasContainer.getAttribute("data-canvasID"),
			height = Number(($(canvasContainer).css("height")).replace(/px$/,"")),
			width = Number(($(canvasContainer).css("width")).replace(/px$/,""));
			if(!canvasID || !height || !width) return;

			// fixes
			height = (height-3)+"px";
			width = (width-4)+"px";
			var marginLeft = "-13px",
			marginTop = "-7px";

			$(canvasContainer).children("canvas").each(function(){
				$(this).attr("height", height);
				$(this).attr("width", width);
				$(this).css("margin-left", marginLeft);
				$(this).css("margin-top", marginTop);
			})
			addHandlers(canvasID+"Shadow");
			publish("renderCanvas");
		}
		function canvasMouseDownHandler(){
			publish("canvasMouseDown");
			console.log("canvasMouseDown");
		}
		function canvasMousemoveHandler(){
			publish("canvasMousemove");
			console.log("canvasMousemove");
		}
		function canvasMouseUpHandler(){
			publish("canvasMouseUp");
			console.log("canvasMouseUp");
		}
		function canvasDblClickHandler(){
			publish("canvasDblClick");
			console.log("canvasDblClick");
		}
		function removeHandler(){
			$(window).off("resize", handler);
			$(window).off("mousedown", canvasMouseDownHandler);
			$(window).off("mousemove", canvasMousemoveHandler);
			$(window).off("mouseup", canvasMouseUpHandler);
			$(window).off("dblclick", canvasDblClickHandler);
			return true;
		}
		var handlers = false;
		function addHandlers(id){
			if(handlers) return;
			$("#" + id).on("mousedown", canvasMouseDownHandler);
			$("#" + id).on("mousemove", canvasMousemoveHandler);
			$("#" + id).on("mouseup", canvasMouseUpHandler);
			$("#" + id).on("dblclick", canvasDblClickHandler);
			handlers = true;
		}
		handler();


	});

})(jQuery);