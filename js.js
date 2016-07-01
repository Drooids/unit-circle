(function(window) {
    "use strict";
    
    Function.prototype.method = function(name, func) {
        try {
            
            this.prototype[name] = func;
            return this;
            
        } catch(error) {
            console.warn(error);
        }
    };
    
})(window);