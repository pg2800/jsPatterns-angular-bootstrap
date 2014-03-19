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
			value: function (topicName, options){
				var topic;
				options = options || {context: this}
				if(!topicName) return;
				if(!(topic = topics[topicName])) return;
				topic.forEach(function (handler){
					handler.call(options.context, options);
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
					topic.push(function (options){
						if(self[handler] && self[handler] instanceof Function) 
							return self[handler].call(options.context, options);
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
		function canvasMouseDownHandler(e){
			publish("canvasMouseDown", {context:$("canvas#theCanvasJSShadow")[0], e:e});
		}
		function canvasMousemoveHandler(e){
			publish("canvasMousemove", {context:$("canvas#theCanvasJSShadow")[0], e:e});
		}
		function canvasMouseUpHandler(e){
			publish("canvasMouseUp", {context:$("canvas#theCanvasJSShadow")[0], e:e});
		}
		function canvasDblClickHandler(e){
			publish("canvasDblClick", {context:$("canvas#theCanvasJSShadow")[0], e:e});
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
			$("#theCanvasJS").on("mousedown", canvasMouseDownHandler);
			$("#theCanvasJS").on("mousemove", canvasMousemoveHandler);
			$("#theCanvasJS").on("mouseup", canvasMouseUpHandler);
			$("#theCanvasJS").on("dblclick", canvasDblClickHandler);
			handlers = true;
		}
		handler();


	});

})(jQuery);