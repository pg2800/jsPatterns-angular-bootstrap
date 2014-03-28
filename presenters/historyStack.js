var subscribed = false;
angular.module("HistoryStackModule", [/*dependencies*/])
.factory("HistoryStackService", [function(){
	return {
		run: function(){
			var historyStack = (function(){
				var currentNode;
				function eraseHISTORY(){
					removeCurrentFutureNodes();
					removeCurrentPastNodes();
					currentNode = new ListNode();
				}
				function ListNode(commandFn, undoFn){
					this.previous = null;
					this.redo = commandFn || null;
					this.undo = undoFn || null;
					this.next = null;
				}
				currentNode = new ListNode();
				function removeCurrentPastNodes(){
					var pastNode = currentNode.previous;
					while(pastNode){
						pastNode.next.previous = null // forces previous node to stop pointing at this node
						pastNode.next = null; // forces this node to stop pointing at previous node
						pastNode = pastNode.previous; // moves to next node
					}
				}
				function removeCurrentFutureNodes(){
					var futureNode = currentNode.next;
					while(futureNode){
						futureNode.previous.next = null // forces previous node to stop pointing at this node
						futureNode.previous = null; // forces this node to stop pointing at previous node
						futureNode = futureNode.next; // moves to next node
					}
				}
				function addNode(commandFn, undoFn){
					var node = new ListNode(commandFn, undoFn);
					removeCurrentFutureNodes();
					currentNode.next = node;
					node.previous = currentNode;
					currentNode = node;
				}
				function undo(){
					if(!currentNode.previous) return;
					if(!currentNode.undo) throw "History Stack Presenter :: Missing undo";
					currentNode.undo();
					currentNode = currentNode.previous;
				}
				function redo(){
					if(!currentNode.next) return;
					if(!currentNode.next.redo) throw "History Stack Presenter :: Missing redo";
					currentNode.next.redo();
					currentNode = currentNode.next;
				}
				return {
					store: addNode,
					undo: undo,
					redo: redo
				};
			})();

			//subscribe to undo and redo events
			if(!subscribed) historyStack.subscribe("undo", "undo");
			if(!subscribed) historyStack.subscribe("redo", "redo");
			if(!subscribed) historyStack.subscribe("leaving", "eraseHISTORY");

			var macrosAPI = (function(){
				var recording = false, macros = {}, temporalMacro = [];
				// macros = {
				// 	1: [{property: .. , value: ..}, {property: .. , value: ..}]
				// }
				function status(options){
					recording = options.r;
				}
				function discard(){
					temporalMacro = [];
				}
				function record_Step(options){
					// obj.name = $(e.target).attr("name");
					// obj.val = $(e.target).val() + "px";
					if(!recording) return;
					temporalMacro.push(options);
				}
				function save_Macro(){
					if(temporalMacro.length<1) return;
					var index = Object.keys(macros).length;
					macros[index] = temporalMacro;
					temporalMacro = [];

					var listItem = document.createElement("li"),
					theButton = document.createElement("div"),
					applyButton = document.createElement("button"),
					removeButton = document.createElement("button"),
					icon = document.createElement("span");

					$(icon).addClass("glyphicon");
					$(icon).addClass("glyphicon-remove-sign");
					$(removeButton).attr("type", "button");
					$(removeButton).addClass("btn");
					$(removeButton).addClass("btn-danger");
					$(removeButton).append(icon);

					$(applyButton).attr("data-macroID", index);
					$(applyButton).attr("type", "button");
					$(applyButton).addClass("btn");
					$(applyButton).addClass("btn-default");
					$(applyButton).append(document.createTextNode("Macro " + index));
					$(applyButton).on("click", function (){
						var id = $(this).attr("data-macroID");
						publish("applyMacro", {
							macroID: id
						});
					});

					$(removeButton).addClass("btn");
					$(removeButton).addClass("btn-danger");
					$(removeButton).on("click", function (){
						$("#macro_"+index).remove();
					});

					$(theButton).addClass("btn-group");
					// $(theButton).addClass("col-xs-12");
					// $(theButton).addClass("fill-width");
					$(theButton).append(applyButton);
					$(theButton).append(removeButton);

					// $(listItem).addClass("row");
					$(listItem).attr("id", "macro_"+index);
					$(listItem).append(theButton);
					$("#MACRO_BUTTONS").append(listItem);

					/*
					MACRO_BUTTONS
						<li>
							<div class="btn-group">
								<button data-macroID="-1" type="button" class="btn btn-default">
									Macro 1
								</button>
								<button type="button" class="btn btn-danger">
									<span class="glyphicon glyphicon-remove-sign"></span>
								</button>
							</div>
						</li>
						*/
					//
				}
				function apply_Macro(options){
					var thisMacro = options.macroID;
					if(!thisMacro) thisMacro = temporalMacro;
					else thisMacro = macros[thisMacro];
					publish("decorateMacro", {macro: thisMacro});
				}
				return {
					record_Step: record_Step,
					save_Macro: save_Macro,
					apply_Macro: apply_Macro,
					status: status,
					discard: discard
				};
			})();

			if(!subscribed) ({}).subscribe("applyMacro", function (options){
				macrosAPI.apply_Macro(options);
			});
			//				
			if(!subscribed) ({}).subscribe("recording", function (options){
				macrosAPI.status(options);
			});
			//
			if(!subscribed) ({}).subscribe("RECstep", function (options){
				macrosAPI.record_Step(options);
			});
			//
			if(!subscribed) ({}).subscribe("discardMacro", function (){
				macrosAPI.discard();
			});
			//
			if(!subscribed) ({}).subscribe("decorateMacro", function (options){
				var macro = options.macro;
				if(!macro) return;
				macro.forEach(function (step){
					publish("decorate", {
						name: step.property,
						val: step.value
					});
				});
			});
			//
			if(!subscribed) ({}).subscribe("saveMacro", function (options){
				macrosAPI.save_Macro(options);
			});
			//




			var commandPattern = (function(){
				function invertColor(hexTripletColor) {
					var color = hexTripletColor;
					//
				  color = color.substring(1);           // remove #
				  color = parseInt(color, 16);          // convert to integer
				  color = 0xFFFFFF ^ color;             // invert three bytes
				  color = color.toString(16);           // convert to hex
				  color = ("000000" + color).slice(-6); // pad with leading zeros
				  color = "#" + color;                  // prepend #
				  return color;
				}
				//
				var divFactory = (function(){
					var divs = {};
					var counter = 0;
					if(!subscribed) ({}).subscribe("leaving", function(){
						divs = {};
						counter = 0;
					});
				  //
				  function Div(options){
				  	var self = this;
				  	Object.defineProperty(self, "Uid", {value: counter});
				  	self.border_color = options.border_color;
				  	self.background_color = options.background_color;
				  	self.border_thickness = options.border_thickness;
				  	self.round_edges = options.round_edges;
				  	self.HTMLelement = (function(){
				  		var div = document.createElement("div");
				  		$(div).attr("class", "div div-draggable text-center");
				  		$(div).attr("id", self.Uid);
				  		$(div).css("border-color", "#"+self.border_color);
				  		$(div).css("background-color", "#"+self.background_color);
				  		$(div).css("color", invertColor("#"+self.background_color));
				  		$(div).css("border-width", self.border_thickness+"px");
				  		$(div).css("border-radius", self.round_edges+"px");
				  		$(div).append(document.createTextNode(counter));
				  		return div;
				  	})();
				  }
				  function newDiv(options){
				  	counter++;
				  	var div = new Div(options);
				  	divs[div.Uid] = div;
				  	return div;
				  }
				  function getDiv(Uid){
				  	return divs[Uid];
				  }
				  function removeDiv(Uid){
				  	counter--;
				  	delete divs[Uid];
				  }
				  // Revealing module pattern
				  return { 
				  	newDiv: newDiv,
				  	getDiv: getDiv,
				  	removeDiv: removeDiv
				  }
				})();

				// The subscribers to the drag goes in here because:
				// The dragging events need access to the divs and I did not want to create an access to the outside of the divFactory through the command pattern
				var draggingDiv, insideModifyingArea, parent, edditing,
				shapesPanel = document.getElementById("shapesPanel"),
				editingPanel = document.getElementById("modifyingPanel"),
				shapesPanelBody = document.getElementById("shapesPanelBody"),
				editingPanelBody = document.getElementById("modifyingPanelBody");
				if(!subscribed) ({}).subscribe("draggingStarted", function (event){
					draggingDiv = divFactory.getDiv(event.targetID);
					if(!draggingDiv || !event.target) return;
					draggingDiv = $("#" + event.targetID);
					$(draggingDiv).css("position", "fixed");
					parent = $(event.parent).offset();
					edditing = $(editingPanel).offset();
					edditing.bottom = edditing.top + Number($(editingPanel).css("height").replace("px",""));
					edditing.right = edditing.left + Number($(editingPanel).css("width").replace("px",""));
				});
				//	
				if(!subscribed) ({}).subscribe("dragging", function (event){
					if(!draggingDiv || !event.event) return;
					event = event.event.gesture.srcEvent;
					var x = event.clientX, y = event.clientY;

					$(draggingDiv).css("left", x - 45 +"px");
					$(draggingDiv).css("top", y - 45 +"px");
					insideModifyingArea = (event.pageX<=edditing.right && event.pageX>=edditing.left && event.pageY>=edditing.top && event.pageY<=edditing.bottom)? true : false;
				});
				//
				if(!subscribed) ({}).subscribe("draggingEnded", function (event){
					if(!draggingDiv) return;
					if(insideModifyingArea){
						if(event.parent.attr("id") != "modifyingPanelBody") {
							publish("moveDiv", {
								draggingTarget: $(draggingDiv).attr("id"),
								to: editingPanelBody,
								from: shapesPanelBody
							});
						}
					} else {
						if(event.parent.attr("id") == "modifyingPanelBody") {
							publish("moveDiv", {
								draggingTarget: $(draggingDiv).attr("id"),
								to: shapesPanelBody,
								from: editingPanelBody
							});
						}
					}
					$(draggingDiv).css("position", "");
					$(draggingDiv).css("left", "");
					$(draggingDiv).css("top", "");
					draggingDiv = undefined;
					insideModifyingArea = false;
				});
				//
				function addDiv(options){
					var div = divFactory.newDiv(options),
					undoOptions = (options.divUid = div.Uid, options);
					options.parentElement.appendChild(div.HTMLelement);
					return undoOptions;
				}
				function addDiv_Undo(options){
					var div = document.getElementById(options.divUid);
					div.parentElement.removeChild(div);
					divFactory.removeDiv(options.divUid);
				}
				function moveTo(options){
					var appendTo = options.to,
					movedFrom = options.from,
					undoOptions = (options.to = movedFrom, options.from = appendTo, options);
					$(appendTo).append($("#" + options.draggingTarget));
					return undoOptions;
				}
				function moveTo_Undo(options){
					var appendTo = options.to,
					movedFrom = options.from,
					undoOptions = (options.to = movedFrom, options.from = appendTo, options);
					$(appendTo).append($("#" + options.draggingTarget));
					return undoOptions;
				}
				function decorate(options){
					// options = {element:..., name:..., val:...}
					var div = document.getElementById(options.element);
					console.log(options);
					var ret = {
						element: options.element,
						name: options.name,
						val: rgb2hex($(div).css(options.name))
					};
					$(div).css(options.name, options.val);
					$(div).css("color", invertColor(rgb2hex($(div).css("background-color"))));
					//
					return ret;
				}
				function decorate_undo(options){
					var div = document.getElementById(options.element);
					$(div).css(options.name, options.val);
					$(div).css("color", invertColor(rgb2hex($(div).css("background-color"))));
					//
				}
				var commands = {
					addDiv: addDiv,
					moveTo: moveTo,
					decorate: decorate
				},
				undos = { // must be equal than the commands
					addDiv: addDiv_Undo,
					moveTo: moveTo_Undo,
					decorate: decorate_undo
				};
				function execute(command, options){ // this is also a facade
					if(!commands[command]) return;
					var undoOptions = commands[command](options);
					function _do() { commands[command](options); }
					function _undo() { undos[command](undoOptions); }
					historyStack.store(_do, _undo);
				}
				return { 
					execute: execute
				};
			})();

			if(!subscribed) ({}).subscribe("addDiv", function (options){
				commandPattern.execute("addDiv", options);
			});
			//
			if(!subscribed) ({}).subscribe("moveDiv", function (options){
				commandPattern.execute("moveTo", options);
			});
			//
			if(!subscribed) ({}).subscribe("decorate", function (options){
				var divs = $("#modifyingPanelBody div");
				divs.each(function (div){
					div = divs[div];
					options.element = $(div).attr("id");
					console.log(options);
					commandPattern.execute("decorate", {
						element: options.element,
						name: options.name,
						val: options.val
					});
				});
			});
			//

			subscribed = true;
		}
	};
}]);