(function(window) {
    "use strict";

	// Kick start

	window.onload = function() {
	    var canvas = new Canvas();
	    var unitCircle = new UnitCircle();

	    canvas.main();
	    unitCircle.main();

	    window.canvas = canvas;
	    window.unitCircle = unitCircle;
	};

})(window);