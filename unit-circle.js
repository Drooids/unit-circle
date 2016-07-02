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
        this.htmlSample = 'Please include: ' + '<' + this.name + '>' + '</' + this.name + '>';
    
        this.tag = this.name;
    }
    
    Canvas.prototype.canvas = {
        getActive: function() {
            var _this = _Canvas_this;
            
            for(var key in _this.config.list) {
                if(_this.config.list[key]['active']) {
                    return _this.config.list[key];
                }
            }
        }
    };

    Canvas.prototype.config = {
        default: {
            "id": 0,
            "width": 600,
            "height": 600,
            "style": 'box-shadow: 1px 0px 5px #ccc; margin: 5px; vertical-align: top;',
            "mouse": {
                "x": 0,
                "y": 0
            },
            "keyboard": {
                "pressed": false,
                
                // key -> string
                // keyCode -> integer
                // pressed -> boolean
                "keys": [],
            },
            "active": false
        },
        
        list: {},
        
        // parameters -> object
        merge: function(parameters) {
            var config = {};
            
            for(var key in this.default) {
                config[key] = this.default[key];
            }
            
            for(var pkey in parameters) {
                for(var ckey in this.default) {
                    if(pkey == ckey) {
                        config[ckey] = parameters[pkey];
                    }
                }
            }
            
            return config;
        },

        // config -> object
        save: function(config) {
            this.list[config.id] = config;
        },
        
        // id -> string
        get: function(id) {
            return this.list[id];
        }
    };
    
    Canvas.prototype.parameters = {
        get: function() {
            var _this = _Canvas_this;
            
            /* global Helpers */
            return Helpers.dom.getDirective(_this.tag, ['width', 'height']);
        }
    };
    
    Canvas.prototype.events = {
        handleMouse: function(event) {
            var _this = _Canvas_this;
            
            event.preventDefault();
            
            var canvas = _this.config.get(event.target.id);
            
            canvas.mouse.x = event.clientX - event.target.offsetLeft;
            canvas.mouse.y = event.clientY - event.target.offsetTop;
        },
        handleMouseEnter: function(event) {
            var _this = _Canvas_this;
            
            event.preventDefault();
            
            var canvas = _this.config.get(event.target.id);
            canvas.active = true;
        },
        handleMouseLeave: function(event) {
            var _this = _Canvas_this;
            
            event.preventDefault();
            
            var canvas = _this.config.get(event.target.id);
            canvas.active = false;
        },
        handleDoubleClick: function(event) {
            event.preventDefault();
        },
        handleKeyUp: function(event) {
            var _this = _Canvas_this;
            var canvas = _this.canvas.getActive();
            
            if(canvas) {
                var key = canvas.keyboard.keys[event.keyCode];
                
                if(key) {
                    key.pressed = false;
                    canvas.keyboard.pressed = false;
                }
            }
        },
        handleKeyDown: function(event) {
            var _this = _Canvas_this;
            var canvas = _this.canvas.getActive();
            
            event.preventDefault();
            
            if(canvas) {
                var key = {};
                
                key[event.keyCode] = {
                    key: event.key,
                    keyCode: event.keyCode,
                    pressed: true
                };
                
                canvas.keyboard.keys.push(key);
                canvas.keyboard.pressed = true;
            }
        },
        register: function() {
            var _this = _Canvas_this;
            var configList = _this.config.list;
            
            // window
            
            window.addEventListener('keyup', this.handleKeyUp);
            window.addEventListener('keydown', this.handleKeyDown);
            
            // Canvas
            
            for(var key in configList) {
                var canvas = document.getElementById(key);
                
                canvas.addEventListener('mouseenter', this.handleMouseEnter);
                canvas.addEventListener('mouseleave', this.handleMouseLeave);
                canvas.addEventListener('mousedown', this.handleMouse);
                canvas.addEventListener('mousemove', this.handleMouse);
                
                canvas.addEventListener('dblclick', this.handleDoubleClick);
            }
            
        }
    };
    
    Canvas.prototype.append = function() {
        var parameters = this.parameters.get();
        
        if(!parameters.length) {
            return console.warn(this.htmlSample);
        }
        
        for(var i = 0; i < parameters.length; i++) {
            parameters[i]['id'] = Helpers.generateId('unitCircle_');
        
            var config = this.config.merge(parameters[i]);
            this.config.save(config);
            
            /* global Helpers */  
            Helpers.dom.replaceElement(this.tag, 'canvas', config);
        }
        
    };
    
    Canvas.prototype.render = {};
    Canvas.prototype.update = {};
    
    Canvas.prototype.main = function() {
        this.append();
        this.events.register();
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