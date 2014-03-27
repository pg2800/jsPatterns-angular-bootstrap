// Object.defineProperty(Object.prototype, "forEach", {
// 	enumerable: false,
// 	value: function (fn){
// 		for(var o in this){
// 			if(this.hasOwnProperty(o)) fn.call(this[o], o, this);
// 		}
// 	}
// });
// Object.defineProperty(Array.prototype, "sample", {
// 	enumerable: false,
// 	value: function (){
// 		return this[Math.floor(Math.random() * this.length)];
// 	}
// });
// Object.defineProperty(Object.prototype, "parentConstructor", {
// 	enumerable: false,
// 	value: function(){
// 		return this.constructor? this.constructor.name : "";
// 	}
// });
Object.defineProperty(Function.prototype, "inheritsFrom", {
	enumerable: false,
	value: function (parent){
		if(parent.constructor === Function) {
			this.prototype = Object.create(parent.prototype);
			this.prototype.constructor = this;
			Object.defineProperty(this.prototype, "parent", {
				enumerable: false,
				writable: true,
				configurable: true,
				value: parent.prototype
			});
			Object.defineProperty(this.prototype, "inheritProperties", {
				enumerable: false,
				writable: true,
				configurable: true,
				value: function(){
					parent.apply(this, arguments);
				}
			});
		} else{
			if(parent.constructor !== Object) return;
			this.prototype = parent;
			this.prototype.constructor = this;
			Object.defineProperty(this.prototype, "parent", {
				enumerable: false,
				writable: true,
				configurable: true,
				value: parent
			});
		}
	}
});

window.extend = function(toObj, fromObj){
	if(!toObj || !fromObj) return;
	var propertiesArr = !!arguments[2];//[].slice.call(arguments, 2);
	if(!propertiesArr) for(var prop in fromObj){
		if(fromObj.hasOwnProperty(prop)) toObj[prop] = fromObj[prop];
	} else {
		propertiesArr = [].slice.call(arguments, 2);
		propertiesArr.forEach(function(prop){
			if(fromObj[prop]) toObj[prop] = fromObj[prop];
		});
	}
};

(function guidGenerator(){
	function s4() {
		return Math.floor((1 + Math.random()) * 0x10000)
		.toString(16)
		.substring(1);
	}

	// window.Guid = function () {
	// 	return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
	// 	s4() + '-' + s4() + s4() + s4();
	// };
})();