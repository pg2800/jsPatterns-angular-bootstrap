angular.module("HistoryStackModule", [/*dependencies*/])
.factory("HistoryStackService", [function(){
	return {
		run: function(){
			var historyStack = (function(){
				var currentNode;
				function ListNode(commandFn, undoFn){
					this.previous = null;
					this.redo = commandFn || null;
					this.undo = undoFn || null;
					this.next = null;
				}
				currentNode = new ListNode();
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
			historyStack.subscribe("undo", "undo");
			historyStack.subscribe("redo", "redo");

			var commandPattern = (function(){
				var divFactory = (function(){
					var divs = {};
					var counter = 1;
					function invertColor(hexTripletColor) {
						var color = hexTripletColor;
				    color = color.substring(1);           // remove #
				    color = parseInt(color, 16);          // convert to integer
				    color = 0xFFFFFF ^ color;             // invert three bytes
				    color = color.toString(16);           // convert to hex
				    color = ("000000" + color).slice(-6); // pad with leading zeros
				    color = "#" + color;                  // prepend #
				    return color;
				  }
				  function Div(options){
				  	var self = this;
				  	Object.defineProperty(self, "Uid", {value: Guid()});
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
					return { // Revealing module pattern
						newDiv: newDiv,
						getDiv: getDiv,
						removeDiv: removeDiv
					}
				})();

				// The subscribers to the drag goes in here because:
				// The dragging events need access to the divs and I did not want to create an access to the outside of the divFactory through the command pattern
				var draggingDiv, insideModifyingArea, parent, edditing,
				shapesPanel = document.getElementById("shapesPanel"),
				edditingPanel = document.getElementById("modifyingPanel");
				({}).subscribe("draggingStarted", function (event){
					draggingDiv = divFactory.getDiv(event.targetID);
					if(!draggingDiv || !event.target) return;
					draggingDiv = event.target;
					$(draggingDiv).css("position", "absolute");
					parent = $(event.parent).offset();
					edditing = $(edditingPanel).offset();
				});
				({}).subscribe("dragging", function (event){
					if(!draggingDiv || !event.event) return;
					event = event.event.gesture.srcEvent;
					var x = event.pageX - parent.left, y = event.pageY - parent.top;

					draggingDiv.style.left = x - 29 +"px";
					draggingDiv.style.top = y - 5 +"px";
					insideModifyingArea = (x<=edditing.right && x>=edditing.left && y>=edditing.top && y<=edditing.bottom)? true : false;
				});
				({}).subscribe("draggingEnded", function (event){
					if(!draggingDiv) return;
					if(insideModifyingArea){
						if(event.parent != edditingPanel) {
							publish("moveDiv", {
								draggingTarget: draggingDiv,
								to: edditingPanel
							});
						}
					} else {
						if(event.parent == edditingPanel) {
							publish("moveDiv", {
								draggingTarget: draggingDiv,
								to: shapesPanel
							});
						}
					}
					draggingDiv.style.position = "";
					draggingDiv = undefined;
					insideModifyingArea = undefined;
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
					var div = document.getElementById(options.divUid);
				}
				function moveTo_Undo(options){

				}

				var macros = {}; 
				function record_Macro(){}
				function applyMacro(){}
				function applyMacro_Undo(){}

				var commands = {
					addDiv: addDiv,
					applyMacro: applyMacro
				},
				undos = { // must be equal than the commands
					addDiv: addDiv_Undo,
					applyMacro: applyMacro_Undo
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

			({}).subscribe("addDiv", function (options){
				commandPattern.execute("addDiv", options);
			});
			({}).subscribe("moveDiv", function (options){
				console.log(options);
			});
			

			publish("historyStack");
		}
	};
}]);