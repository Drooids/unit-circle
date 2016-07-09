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

        Canvas.listeners = {
            onRender: [],
            onUpdate: [],

            onMouseEnter: [],
            onMouseLeave: [],
            onMouseMove: [],

            onDoubleClick: [],
            onKeyDown: [],
            onKeyUp: [],
            onHover: []
        };

        Canvas.executeListeners = function(methodName) {
            for (var i = 0, len = Canvas.listeners[methodName].length; i < len; i++)
                Canvas.listeners[methodName][i].apply(this);
        };

    }

    Canvas.prototype.canvas = {
        getAll: function() {
            var _this = _Canvas_this;

            // Config list already contains canvas and ctx
            return _this.config.list;
        },
        getActive: function() {
            var _this = _Canvas_this;

            for(var key in _this.config.list) {
                if(_this.config.list[key]['active']) {
                    return _this.config.list[key];
                }
            }
        },
        // config -> object
        build: function(config) {
            var canvas = document.getElementById(config.id);

            config.canvas = canvas;
            config.ctx = canvas.getContext('2d');
        }
    };

    Canvas.prototype.config = {
        default: {
            "canvas": {},
            "ctx": {},

            "id": 0,
            "width": 400,
            "height": 400,
            "style": 'box-shadow: 1px 0px 5px #ccc;\
                        margin:5px;\
                        vertical-align: top;',

            "mouse": {
                "x": 0,
                "y": 0,
                "startX": 0,
                "startY": 0,
            },
            "keyboard": {
                "pressed": false,

                // key -> string
                // keyCode -> integer
                // pressed -> boolean
                "keys": {},
            },

            "active": false,

            "disable": {
                "render": false,
                "update": false,
                "clear": false,
            }
        },

        list: {},

        // parameters -> object
        merge: function(parameters) {

            // Scope issue
            var config = JSON.parse(JSON.stringify(this.default));

            for(var pkey in parameters) {
                for(var ckey in config) {
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
        default: ['width', 'height', 'style'],

        get: function() {
            var _this = _Canvas_this;

            /* global Helpers */
            return Helpers.dom.getDirective(_this.tag, this.default);
        }
    };

    Canvas.prototype.events = {
        handleMouse: function(event) {
            var _this = _Canvas_this;

            event.preventDefault();

            var canvas = _this.config.get(event.target.id);

            canvas.mouse.x = event.pageX - event.target.offsetLeft;
            canvas.mouse.y = event.pageY - event.target.offsetTop;

            if(canvas.mouse.startX) {
                canvas.mouse.x = -(canvas.mouse.startX - canvas.mouse.x);
            }

            if(canvas.mouse.startY) {
                canvas.mouse.y = canvas.mouse.startY - canvas.mouse.y;
            }

            Canvas.executeListeners.call(this, 'onMouseMove');
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

                canvas.keyboard.keys[event.keyCode] = key;
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

    Canvas.prototype.iteration = {
        // Delta time
        dt: null,

        // Delta u, where u represents time in multiples of our nominal interval
        du: null,

        _NOMINAL_UPDATE_INTERVAL: 16.666,
        _frameTime_ms: null,
        _frameTimeDelta_ms: null,

        _debug: false,

        clear: function(ctx) {
            var prevfillStyle = ctx.fillStyle;
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.fillStyle = prevfillStyle;
        },

        render: function(canvas) {
            if(!canvas.active) {
                return;
            }

            if(!canvas.disable.clear) {
                this.clear(canvas.ctx);
            }

            if(this._debug) {
                if(canvas) {
                    canvas.ctx.fillText("Delta time: " + this.dt, 0, 10);
                    canvas.ctx.fillText("Delta u: " + this.du, 0, 20);
                }
            }

            Canvas.executeListeners.call(this, 'onRender');
        },

        update: function(dt) {
            this.dt = dt;
            this.du = (dt / this._NOMINAL_UPDATE_INTERVAL);

             Canvas.executeListeners.call(this, 'onUpdate');
        },

        _iter: function(frameTime) {
            var _this = _Canvas_this;
            var canvases = _this.canvas.getAll();

            // Frame time and deltas

            if(_this._frameTime_ms === null) {
                _this._frameTime_ms = frameTime;
            }

            _this._frameTimeDelta_ms = frameTime - _this._frameTime_ms;
            _this._frameTime_ms = frameTime;

            // Update

            _this.iteration.update(_this._frameTimeDelta_ms);

            // Render

            for(var key in canvases) {
                _this.iteration.render(canvases[key]);
            }

            _this.iteration._requestNextIteration();
        },

        _requestNextIteration: function() {
             window.requestAnimationFrame(this._iter);
        },

        main: function() {
            this._requestNextIteration();
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

            /* global Helpers */
            Helpers.dom.replaceElement(this.tag, 'canvas', config);

            this.canvas.build(config);

            this.config.save(config);
        }
    };

    Canvas.prototype.main = function() {
        // Replace <unit-circle>
        this.append();

        // Events
        this.events.register();

        // Animation/Game loop
        this.iteration.main();
    };

    // Unit Circle

    function UnitCircle() {
        _UnitCircle_this = this;

        this.width = 0;
        this.height = 0;
        this.widthRatio = 1;
        this.heightRatio = 1;

        this.radius = 0;

        this.offset = 0.8;

        this.x = 0;
        this.y = 0;

        this.sinTheta = 0;
        this.cosTheta = 0;
        this.slope = 0;
        this.angleRad = 0;
        this.angleDegrees = 0;
        this.outerAngleRad = 0;
        this.outerAngleDegrees = 0;

        Canvas.listeners.onUpdate.push(this.update);
        Canvas.listeners.onRender.push(this.render);
        Canvas.listeners.onMouseMove.push(this.onMouseMove);
    }

    // Inherit canvas
    UnitCircle.prototype = new Canvas();

    UnitCircle.prototype.update = function() {
        var _this = _UnitCircle_this;
        var canvas = _this.canvas.getActive();

        if(canvas) {
            _this.width = canvas.width / 2;
            _this.height = canvas.height / 2;

            _this.widthRatio = _this.width / _this.height;
            _this.heightRatio = _this.height / _this.width;

            _this.slope = Math.atan2(canvas.mouse.y, canvas.mouse.x);

            _this.angleRad = _this.slope;
            _this.angleDegrees = _this.slope * 180 / Math.PI;

            _this.outerAngleRad = _this.angleRad;
            _this.outerAngleDegrees = _this.angleDegrees;

            if(_this.angleRad < 0) {
                _this.outerAngleRad = _this.outerAngleRad + 2 * Math.PI;
                _this.outerAngleDegrees = _this.angleDegrees + 360;
            }

            _this.cosTheta = Math.cos(_this.slope);
            _this.sinTheta = Math.sin(-_this.slope);

            _this.x = _this.cosTheta * _this.width * _this.offset;
            _this.y = _this.sinTheta * _this.height * _this.offset;

            if(_this.widthRatio > _this.heightRatio) {
                _this.x = _this.x * _this.heightRatio;
                _this.radius = _this.width * _this.heightRatio * _this.offset;
            } else {
                _this.y = _this.y * _this.widthRatio;
                _this.radius = _this.height * _this.widthRatio * _this.offset;
            }

            _this.x = _this.x + _this.width;
            _this.y = _this.y + _this.height;
        }

    };

    UnitCircle.prototype.render = function() {
        var _this = _UnitCircle_this;
        var canvas = _UnitCircle_this.canvas.getActive();

        if(canvas) {

            // Circle

            canvas.ctx.save();

            canvas.ctx.beginPath();
            canvas.ctx.arc(_this.width, _this.height, _this.radius, 0, 2 * Math.PI, true);
            canvas.ctx.strokeStyle = '#ccc';
            canvas.ctx.stroke();
            canvas.ctx.closePath();

            canvas.ctx.restore();

            // Triangle

            canvas.ctx.beginPath();

            canvas.ctx.moveTo(_this.width, _this.height);
            canvas.ctx.lineTo(_this.x, _this.y);
            canvas.ctx.lineTo(_this.x, _this.height);
            canvas.ctx.lineTo(_this.width, _this.height);
            canvas.ctx.stroke();

            canvas.ctx.closePath();

            // Little vertex circle

            canvas.ctx.beginPath();

            canvas.ctx.arc(_this.x, _this.y, 5, 0, 2 * Math.PI, true);
            canvas.ctx.fillStyle = '#ccc';
            canvas.ctx.stroke();
            canvas.ctx.fill();

            canvas.ctx.closePath();

        }
    };

    UnitCircle.prototype.onMouseMove = function() {
        var _this = _UnitCircle_this;
    };

    UnitCircle.prototype.main = function() {
        var canvases = _UnitCircle_this.canvas.getAll();

        for(var key in canvases) {
            canvases[key].mouse.startX = canvases[key].width / 2;
            canvases[key].mouse.startY = canvases[key].height / 2;
        }
    };

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