(function(window) {
    "use strict";
    
    function Calc() {}
    
    Calc.prototype.square = function(x) {
        return x * x;  
    };
        
    Calc.prototype.distance = function(x1, x2, y1, y2) {
        var distance = this.square(x2 - x1) + this.square(y2 - y1);
        return Math.sqrt(distance);
    };
    
    Calc.prototype.integer = function(x) {
        return Math[x < 0 ? 'ceil' : 'floor'](x);
    };
    
    window.Calc = new Calc;
    
})(window);