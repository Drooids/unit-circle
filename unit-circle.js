(function(window) {
    "use strict";

    // Ugly globals

    var _UnitCircle_this;

    function UnitCircle() {
        _UnitCircle_this = this;

        this.width = 0;
        this.height = 0;
        this.widthRatio = 1;
        this.heightRatio = 1;

        this.radius = 0;

        this.offset = 0.7;

        this.x = 0;
        this.y = 0;

        this.sinTheta = 0;
        this.cosTheta = 0;
        this.slope = 0;
        this.angleRad = 0;
        this.angleDegrees = 0;
        this.outerAngleRad = 0;
        this.outerAngleDegrees = 0;

        this.lifeSpan = 0;

        Canvas.listeners.onUpdate.push(this.update);
        Canvas.listeners.onRender.push(this.render);
        Canvas.listeners.onMouseMove.push(this.onMouseMove);
    }

    // Inherit canvas
    UnitCircle.prototype = new Canvas;

    UnitCircle.prototype.update = function(canvas, startAngle) {
        var _this = _UnitCircle_this;
        var canvas = canvas;

        if(!canvas) {
            canvas = _UnitCircle_this.canvas.getActive();
        }

        if(canvas) {
            _this.width = canvas.width / 2;
            _this.height = canvas.height / 2;

            _this.widthRatio = _this.width / _this.height;
            _this.heightRatio = _this.height / _this.width;

            _this.slope = Math.atan2(canvas.mouse.y, canvas.mouse.x);

            if(startAngle) {
                _this.slope += startAngle;
            }

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

            _this.lifeSpan += (_this.iteration.du / _this.iteration.NOMINAL_UPDATE_INTERVAL) / 5;

            if(_this.lifeSpan >= 1) {
                _this.lifeSpan = 1;
            }

        }

    };

    UnitCircle.prototype.render = function(canvas) {
        var _this = _UnitCircle_this;
        var canvas = canvas;

        if(!canvas) {
            canvas = _UnitCircle_this.canvas.getActive();
        }

        if(canvas) {

            // Circle

            canvas.ctx.save();

            canvas.ctx.beginPath();

            var circleAround = _this.lifeSpan * 2 * Math.PI;
            if(_this.lifeSpan == 1) {
                circleAround = 0;
            }

            canvas.ctx.arc(_this.width, _this.height, _this.radius, circleAround, 2 * Math.PI, true);
            canvas.ctx.strokeStyle = 'rgba(0, 0, 0,' + _this.lifeSpan + ')';
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

            canvas.ctx.arc(_this.x, _this.y, 5, circleAround, 2 * Math.PI, true);
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

            this.update(canvases[key], 0.7071067811865476);
            this.render(canvases[key], 0.7071067811865476);
        }
    };

    window.UnitCircle = UnitCircle;

})(window);
