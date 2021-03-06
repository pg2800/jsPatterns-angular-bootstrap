(function($, Hammer){
	// Publish && Subscribe
	(function publishSubscribe(){
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
	// CONFLICTS: when classes are called "canvasContainer"s because the controller uses them for a special canvas.
	({}).subscribe("shapesCanvas", function(){
		$(window).on("resize", handler);
		(function fixes(){
			$("button#changeVisibility").on("click", function (){
				$("canvas#theCanvasJSShadow").css("visibility", ($("canvas#theCanvasJSShadow").css("visibility")) == "visible"? "hidden" : "visible");
			});
			$("button#clearCanvas").on("click", function (){
				$("canvas#theCanvasJSShadow").attr("width", $("canvas#theCanvasJSShadow").attr("width"));
				$("canvas#theCanvasJS").attr("width", $("canvas#theCanvasJS").attr("width"));
				publish("clearCanvas");
			});
		})();

		// Validations
		(function validations (){
			var alphaOrNumeric = /^(?:[a-zA-Z]*|[0-9]*)$/;
			function validateOrAlphanumeric(input){
				$(input).on("input", function(){
					if(!alphaOrNumeric.test(this.value)) {
						$(this).parent().addClass("has-error");
						$(this).parent().removeClass("has-success");
					}
					else {
						$(this).parent().addClass("has-success");
						$(this).parent().removeClass("has-error");
					}
				});
			}
			validateOrAlphanumeric($("input[type=text][name=size]"));
			validateOrAlphanumeric($("input[type=text][name=shape]"));

			var color = /^(?:[a-zA-Z]*|\#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}))$/;
			function validateColor(input){
				$(input).on("input", function(){
					if(!color.test(this.value)) {
						$(this).parent().addClass("has-error");
						$(this).parent().removeClass("has-success");
					}
					else {
						$(this).parent().addClass("has-success");
						$(this).parent().removeClass("has-error");
					}
				});
			}
			validateColor($("input[type=text][name=stroke]"));
			validateColor($("input[type=text][name=fill]"));
		})();

		(function colorSelectersEventHandlers(){
			$("input#firstColorInput").on("change", function(){
				$("input[type=text][name=stroke]").attr("value", $(this).val());
			});
			$("input#secondColorInput").on("change", function(){
				$("input[type=text][name=fill]").attr("value", $(this).val());
			});
		})();

		(function selectedOptionFromDropDowns(){
			$("ul[name=specs]").each(function(){
				var self = this;
				$(self).find("a").each(function(){
					$(this).on("click", function (){
						$("input[name="+$(self).attr("id")+"]").val($(this).text());
					});
				});
			});
		})();
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
			});
			addHandlers(canvasID+"Shadow");
			publish("renderCanvas");
		}
		function canvasMouseDownHandler(e){
			publish("canvasMouseDown", {context:$("canvas#theCanvasJSShadow")[0], e:e.gesture.srcEvent});
		}
		function canvasMousemoveHandler(e){
			publish("canvasMousemove", {context:$("canvas#theCanvasJSShadow")[0], e:e.gesture.srcEvent});
		}
		function canvasMouseUpHandler(e){
			publish("canvasMouseUp", {context:$("canvas#theCanvasJSShadow")[0], e:e.gesture.srcEvent});
		}
		function canvasDblClickHandler(e){
			publish("canvasDblClick", {context:$("canvas#theCanvasJSShadow")[0], e:e.gesture.srcEvent});
		}
		function removeHandler(){
			$(window).off("resize", handler);
			$("#theCanvasJS").off("touch", canvasMouseDownHandler);
			$("#theCanvasJS").off("drag", canvasMousemoveHandler);
			$("#theCanvasJS").off("release", canvasMouseUpHandler);
			$("#theCanvasJS").off("doubletap", canvasDblClickHandler);
			return true;
		}
		var handlers = false;
		function addHandlers(id){
			if(handlers) return;
			var elem = document.getElementById("theCanvasJS");
			Hammer(elem).on("touch", canvasMouseDownHandler);
			Hammer(elem).on("drag", canvasMousemoveHandler);
			Hammer(elem).on("release", canvasMouseUpHandler);
			Hammer(elem).on("doubletap", canvasDblClickHandler);
			handlers = true;
		}
		handler();
	});

	// This will be executed first when the controller publishes the topic
	function doubletap(e){
		publish("addDiv", {
			border_color: $("#border-color input").val(),
			background_color: $("#background-color input").val(),
			border_thickness: $("#border-thickness").val(),
			round_edges: $("#round-edges").val(),
			parentElement: this
		});
	}
	function dragstart(e){
		if(!e.target) return;
		publish("draggingStarted", {
			event: e,
			target: e.target,
			targetID: $(e.target).attr("id"),
			selectedPanel: this,
			parent: $(e.target).parent()
		});
	}
	function drag(e){
		if(!e.target) return;
		publish("dragging", {
			event: e,
			targetID: $(e.target).attr("id"),
			selectedPanel: this
		});
	}
	function dragend(e){
		if(!e.target) return;
		publish("draggingEnded", {
			event: e,
			targetID: $(e.target).attr("id"),
			selectedPanel: this,
			parent: $(e.target).parent()
		});
	}
	function keydown(e){
		if(event.which == 13 || event.keyCode == 13) return doubletap.apply(document.getElementById("shapesPanelBody"));
		if( (e.which === 90 && e.ctrlKey && e.shiftKey) || (e.which === 89 && e.ctrlKey) ){
			publish("redo");
		}
		else if( e.which === 90 && e.ctrlKey ){
			publish("undo");
		}          
	}
	function releaseColor(e){
		var obj = {};
		obj.name = $(e.target).attr("name");
		obj.val = "#" + $(e.target).val();
		publish("RECstep", obj);
		publish("decorate", obj);
	}
	function releasePixel(e){
		var obj = {};
		obj.name = $(e.target).attr("name");
		obj.val = $(e.target).val() + "px";
		publish("RECstep", obj);
		publish("decorate", obj);
	}

	var recording = false;
	function stopRecroding(){
		$(this).addClass("btn-info");
		$(this).removeClass("btn-danger");
		$(this).removeClass("active");
		recording = false;
		publish("recording", {r: recording});
	}
	function startRecroding(){
		$(this).removeClass("btn-info");
		$(this).addClass("btn-danger");
		$(this).addClass("active");
		recording = true;
		publish("recording", {r: recording});
	}
	function record(e){
		if(!recording){
			startRecroding.apply(this);
		} else {
			stopRecroding.apply(this);
		}
	}
	function discard(e){
		publish("discardMacro");
		stopRecroding.apply(document.getElementById("REC"));
	}
	function save(e){
		publish("saveMacro");
		stopRecroding.apply(document.getElementById("REC"));
	}

	({}).subscribe("historyStack", function (){
		$("#REC").on("click", record);
		$("#DISCARD").on("click", discard);
		$("#SAVE").on("click", save);
		$(".pick-a-color").pickAColor({
			showSpectrum            : true,
			showSavedColors         : true,
			saveColorsPerElement    : false,
			fadeMenuToggle          : true,
			showHexInput            : true,
			showBasicColors         : true,
			allowBlank              : false
		});
		$('.slider').slider({
			range: true,
			min: 0,
			max: 10,
			value: 5
		});

		var wrapper = document.getElementById("panelWrapper");

		$(document).on("keydown", keydown); 
		Hammer(document.getElementById("shapesPanelBody")).on("doubletap", doubletap);
		Hammer(wrapper).on("dragstart", dragstart);
		Hammer(wrapper).on("drag", drag);
		Hammer(wrapper).on("dragend", dragend);

		$("#background-color input").on("change", releaseColor);
		$("#border-color input").on("change", releaseColor);
		$('#border-thickness').slider().on("slideStop", releasePixel);
		$('#round-edges').slider().on("slideStop", releasePixel);


	});

})(jQuery, Hammer);