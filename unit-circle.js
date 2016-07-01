(function(window) {
    "use strict";
    
    // Ugly globals
    
    var _Canvas_this;
    var _UnitCircle_this;
    
    // Canvas
    
    function Canvas() {
        _Canvas_this = this;
        
        this.name = 'unit-circle';
        this.version = 0.001;
        this.htmlSample = '<' + this.name + '>' + '</' + this.name + '>';
    
        this.tag = this.name;
    }
    
    Canvas.prototype.config = {
        value: {
            "width": 600,
            "height": 600,
            "style": 'box-shadow: 1px 0px 5px #ccc; margin: 5px; vertical-align: top;'
        },
        set: function(parameters) {
            for(var pkey in parameters) {
                for(var ckey in this.value) {
                    if(pkey == ckey) {
                        this.value[ckey] = parameters[pkey];
                    }
                }
            }
            
        }
    };
    
    Canvas.prototype.parameters = {
        get: function() {
            /* global Helpers */
            return Helpers.dom.getDirective(_Canvas_this.tag, ['width', 'height']);
        }
    };
    
    Canvas.prototype.events = {
        register: function(event) {
              
        }
    };
    
    Canvas.prototype.append = function() {
        var parameters = this.parameters.get();
        
        console.log(parameters);
        
        for(var i = 0; i < parameters.length; i++) {
            this.config.set(parameters[i]);
            
            /* global Helpers */  
            Helpers.dom.replaceElement(this.tag, 'canvas', this.config.value);
        }
        
        if(!parameters) {
            return console.warn(this.htmlSample);
        }
        
        console.log(this);
    };
    
    Canvas.prototype.render = {};
    Canvas.prototype.update = {};
    
    Canvas.prototype.main = function() {
        this.append();
    };
    
    var canvas = new Canvas();
    
    // Unit Circle
    
    function UnitCircle() {
        _UnitCircle_this = this;
        Canvas.call(this);
    }
    
    UnitCircle.prototype = Object.create(Canvas.prototype);
    
    // Kick start
    
    window.onload = function() {
        canvas.main();
    };
    
})(window);