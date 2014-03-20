angular.module("HistoryStackModule", [/*dependencies*/])
.factory("HistoryStackService", [function(){
	return {
		run: function(){
			var historyStack = (function(){
				var currentNode;
				function ListNode(command, undo){
					this.previous = null;
					this.redo = command || null;
					this.undo = undo || null;
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
				function addNode(command, undo){
					var node = new ListNode(command, undo);
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
					addTimePeriod: addNode,
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
					function Div(options){
						Object.defineProperty("Uid", {value: Guid()});
						this.border_color = options.border_color;
						this.background_color = options.background_color;
						this.border_thickness = options.border_thickness;
						this.round_edges = options.round_edges;
					}
					function newDiv(options){
						var div = new Div(options);
						divs[div.Uid] = div;
						return div;
					}
					function getDiv(Uid){
						return divs[Uid];
					}
					return { // Revealing module pattern
						newDiv: newDiv,
						getDiv: getDiv
					}
				})();

				function addDiv(){}
				function addDiv_Undo(){}

				var macros = {}; 
				function record_Macro(){}

				function applyMacro(){}
				function applyMacro_Undo(){}

				var commands = {
					addDiv: addDiv,
					applyMacro: applyMacro
				}
				var undos = {
					addDiv: addDiv_Undo,
					applyMacro: applyMacro_Undo
				}
				function execute(command, options, context){ // this is also a facade
					context = context || {};
					var undo = createUndo(command, options, context),
					redo = function (){
						if(commands[command]) return commands[command].call(context, options);
					};
				}
				return {
					execute: execute
				}
			})();

			publish("historyStack");
		}
	};
}]);