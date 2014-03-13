(function(){
  // I test for features at the beginning of the declaration instead of everytime that we have to add an event.
  if(document.addEventListener) {
    window.addEvent = function (elem, type, handler, useCapture){
      elem.addEventListener(type, handler, !!useCapture);
      return handler;
    }
    window.removeEvent = function (elem, type, handler, useCapture){
      elem.removeEventListener(type, handler, !!useCapture);
    }
  } 
  else if (document.attachEvent) {
    window.addEvent = function (elem, type, handler) {
      type = "on" + type;
      // Bounded the element as the context
      // Because the attachEvent uses the window object to add the event and we don't want to polute it.
      var boundedHandler = function() {
        return handler.apply(elem, arguments);
      };
      elem.attachEvent(type, boundedHandler);
      return boundedHandler; // for removal purposes
    }
    window.removeEvent = function(elem, type, handler){
      type = "on" + type;
      elem.detachEvent(type, handler);
    }
  } 
  else { 
    // Browser don't support W3C or MSFT model, go on with traditional
    window.addEvent = function(elem, type, handler){
      type = "on" + type;
      elem.memoize = elem.memoize || {};
      if(!elem.memoize[type]){
        // This code will be executed just one time.
        elem.memoize[type] = { counter: 0 };
        elem[type] = function(){
          for(key in nameSpace){
            if(nameSpace.hasOwnProperty(key)){
              if(typeof nameSpace[key] == "function"){
                nameSpace[key].apply(this, arguments);
              }
            }
          }
        }
      }
      // Thanks to hoisting we can point to nameSpace variable above.
      // Thanks to closures we are going to be able to access its value when the event is triggered.
      // I used closures for the nameSpace because it improved 44% in performance in my laptop.
      var nameSpace = elem.memoize[type], id = nameSpace.counter++;
      nameSpace[id] = handler;
      // I return the id for us to be able to remove a specific function binded to the event.
      return id;
    };
    window.removeEvent = function(elem, type, handlerID){
      type = "on" + type;
      // I remove the handler with the id
      if(elem.memoize && elem.memoize[type] && elem.memoize[type][handlerID]) elem.memoize[type][handlerID] = undefined;
    };
  };
})();
