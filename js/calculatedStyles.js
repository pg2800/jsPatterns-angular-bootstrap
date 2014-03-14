(function preloadedFunctions(){
	// Preseted methods.
	if(window.getComputedStyle){
		window.getComputedStylePropertyValue = function(element, prop){
			var computedStyle = window.getComputedStyle(element, null);
			if(!computedStyle) return null;
			if(computedStyle.getPropertyValue) {
				return computedStyle.getPropertyValue(prop);
			} else if (computedStyle.getAttribute) {
				return computedStyle.getAttribute(prop);
			} else if(computedStyle[prop]) {
				return computedStyle[prop];
			};
		};
	}
	// jQuery JavaScript Library v1.9.0
	// http://www.minhacienda.gov.co/portal/pls/portal/PORTAL.wwsbr_imt_services.GenericView?p_docname=6240612.JS&p_type=DOC&p_viewservice=VAHWSTH&p_searchstring=
	// For IE8 or less
	else if ( document.documentElement.currentStyle ) {
		var rnumnonpx = new RegExp( "^(" + core_pnum + ")(?!px)[a-z%]+$", "i" ),
		rposition = /^(top|right|bottom|left)$/,
		core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source;
		window.getComputedStylePropertyValue = function(element, prop){
			var left, rsLeft,
			ret = element.currentStyle && element.currentStyle[ prop ],
			style = element.style;

			if ( ret == null && style && style[ prop ] ) {
				ret = style[ prop ];
			}
			if ( rnumnonpx.test( ret ) && !rposition.test( prop ) ) {
				left = style.left;
				rsLeft = element.runtimeStyle && element.runtimeStyle.left;
				if ( rsLeft ) {
					element.runtimeStyle.left = element.currentStyle.left;
				}
				style.left = prop === "fontSize" ? "1em" : ret;
				ret = style.pixelLeft + "px";
				style.left = left;
				if ( rsLeft ) {
					element.runtimeStyle.left = rsLeft;
				}
			}
			return ret === "" ? "auto" : ret;
		};
	};
})();