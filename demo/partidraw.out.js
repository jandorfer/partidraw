(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var ParticleScene = _interopRequire(require("./ParticleScene"));

var AreaSinkBehavior = _interopRequire(require("./behaviors/AreaSinkBehavior"));

var FireflyBehavior = _interopRequire(require("./behaviors/FireflyBehavior"));

var WrappingBoundsBehavior = _interopRequire(require("./behaviors/WrappingBoundsBehavior"));

var RandomAreaResetMode = _interopRequire(require("./modes/RandomAreaResetMode"));

var PARTICLE_COUNT = 1500;

var ParticleDrawing = (function () {
    function ParticleDrawing(count) {
        _classCallCheck(this, ParticleDrawing);

        this.count = count;

        this.setupScene();
        this.setupRenderer();
        this.setupModes();
        this.setupResize();

        this.tick();
    }

    _createClass(ParticleDrawing, {
        setupScene: {
            value: function setupScene() {
                this.firefly = new FireflyBehavior();
                this.boundsWrapping = new WrappingBoundsBehavior(window.innerWidth, window.innerHeight);
                this.areaSink = AreaSinkBehavior.Rectangle(0, 0, window.innerWidth, window.innerHeight);

                this.scene = new ParticleScene(this.count, this.firefly, this.areaSink, this.boundsWrapping);
            }
        },
        setupRenderer: {
            value: function setupRenderer() {
                this.renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight);
                this.renderer.view.style.position = "absolute";
                this.renderer.view.style.left = "0";
                this.renderer.view.style.top = "0";

                document.body.appendChild(this.renderer.view);
            }
        },
        setupModes: {
            value: function setupModes() {
                var _this = this;

                this.mode = 0;
                this.modes = [new RandomAreaResetMode(this.areaSink)];

                window.onclick = function (e) {
                    _this.modes[_this.mode].onclick(e);
                };
                window.mousedown = function (e) {
                    _this.modes[_this.mode].mousedown(e);
                };
                window.mouseup = function (e) {
                    _this.modes[_this.mode].mouseup(e);
                };
            }
        },
        setupResize: {
            value: function setupResize() {
                window.addEventListener("resize", this.resize);
                window.onorientationchange = this.resize;
            }
        },
        resize: {
            value: function resize() {
                var width = window.innerWidth,
                    height = window.innerHeight;
                this.boundsWrapping.width = width;
                this.boundsWrapping.height = height;
                this.renderer.view.style.width = width + "px";
                this.renderer.view.style.height = height + "px";
                this.renderer.resize(width, height);
            }
        },
        tick: {
            value: function tick() {
                this.scene.update();
                this.renderer.render(this.scene.container);
                requestAnimationFrame(this.tick.bind(this));
            }
        }
    });

    return ParticleDrawing;
})();

document.addEventListener("DOMContentLoaded", function () {
    return new ParticleDrawing(PARTICLE_COUNT);
});

},{"./ParticleScene":2,"./behaviors/AreaSinkBehavior":3,"./behaviors/FireflyBehavior":5,"./behaviors/WrappingBoundsBehavior":6,"./modes/RandomAreaResetMode":8}],2:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var ParticleScene = (function () {
    function ParticleScene(count) {
        for (var _len = arguments.length, behaviors = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            behaviors[_key - 1] = arguments[_key];
        }

        _classCallCheck(this, ParticleScene);

        this.particles = [];
        this.behaviors = behaviors;
        this.container = new PIXI.ParticleContainer(count, [true, true, false, true, true]);
        this.texture = new PIXI.Texture.fromImage("sprite.png");

        for (var i = 0; i < count; i++) {
            var particle = new PIXI.Sprite(this.texture);
            particle.anchor.set(0.5);
            particle.scale.x = 0.2;
            particle.scale.y = 0.2;

            // BUG Pixi v3 rc4 ParticleContainer doesn't support transparency at all
            particle.alpha = 0.6;

            for (var j = 0; j < behaviors.length; j++) {
                behaviors[j].initialize(particle, i, count);
            }

            this.particles.push(particle);
            this.container.addChild(particle);
        }
    }

    _createClass(ParticleScene, {
        update: {
            value: function update() {
                for (var i = 0; i < this.particles.length; i++) {
                    for (var j = 0; j < this.behaviors.length; j++) {
                        this.behaviors[j].update(this.particles[i]);
                    }
                }
            }
        }
    });

    return ParticleScene;
})();

module.exports = ParticleScene;

},{}],3:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Behavior = _interopRequire(require("./Behavior"));

var AreaSinkBehavior = (function (_Behavior) {
    function AreaSinkBehavior(area) {
        _classCallCheck(this, AreaSinkBehavior);

        this.area = area;
    }

    _inherits(AreaSinkBehavior, _Behavior);

    _createClass(AreaSinkBehavior, {
        initialize: {
            value: function initialize(particle, index, count) {
                particle.percentIndex = 1 * index / (1 * count);
            }
        },
        update: {
            value: function update(particle) {
                var pos = Math.floor(this.area.length * particle.percentIndex);
                var sink = this.area[pos];
                var direction = Math.atan2(sink.x - particle.position.x, sink.y - particle.position.y);

                var speed = particle.speed;
                if (speed <= 0) speed = 0.1;
                speed = speed * (0.1 * Math.sqrt(Math.pow(sink.x - particle.position.x, 2), Math.pow(sink.y - particle.position.y)));

                particle.position.x += Math.sin(direction) * speed;
                particle.position.y += Math.cos(direction) * speed;
            }
        }
    }, {
        shuffle: {
            value: function shuffle(array) {
                var currentIndex = array.length,
                    temporaryValue,
                    randomIndex;

                while (0 !== currentIndex) {
                    randomIndex = Math.floor(Math.random() * currentIndex);
                    currentIndex -= 1;

                    temporaryValue = array[currentIndex];
                    array[currentIndex] = array[randomIndex];
                    array[randomIndex] = temporaryValue;
                }

                return array;
            }
        },
        Rectangle: {
            value: function Rectangle(x, y, width, height) {
                if (width <= 0) width = 1;
                if (height <= 0) height = 1;
                var area = new Array(width * height);
                for (var i = 0; i < width; i++) {
                    for (var j = 0; j < height; j++) {
                        area[j * width + i] = { x: x + i, y: y + j };
                    }
                }
                area = AreaSinkBehavior.shuffle(area);
                return new AreaSinkBehavior(area);
            }
        }
    });

    return AreaSinkBehavior;
})(Behavior);

module.exports = AreaSinkBehavior;

},{"./Behavior":4}],4:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Behavior = (function () {
    function Behavior() {
        _classCallCheck(this, Behavior);
    }

    _createClass(Behavior, {
        initialize: {
            value: function initialize(particle) {}
        },
        update: {
            value: function update(particle) {}
        }
    });

    return Behavior;
})();

module.exports = Behavior;

},{}],5:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Behavior = _interopRequire(require("./Behavior"));

var FireflyBehavior = (function (_Behavior) {
    function FireflyBehavior() {
        _classCallCheck(this, FireflyBehavior);

        if (_Behavior != null) {
            _Behavior.apply(this, arguments);
        }
    }

    _inherits(FireflyBehavior, _Behavior);

    _createClass(FireflyBehavior, {
        initialize: {
            value: function initialize(particle) {
                particle.direction = particle.direction || Math.random() * Math.PI * 2;
                particle.zdirection = particle.zdirection || Math.random() * Math.PI * 2;
                particle.speed = particle.speed || 1;
                particle.turn = Math.random() - 0.5;
                particle.zturn = Math.random() - 0.5;
            }
        },
        update: {
            value: function update(particle) {
                particle.direction += particle.turn * 0.1;
                particle.zdirection += particle.zturn * 0.5;
                particle.turn += 0.15 * (Math.random() - 0.5);
                if (particle.turn > 1) particle.turn = 1;
                if (particle.turn < -1) particle.turn = -1;
                particle.zturn += 0.05 * (Math.random() - 0.5);

                particle.position.x += Math.sin(particle.direction) * particle.speed;
                particle.position.y += Math.cos(particle.direction) * particle.speed;

                // BUG Pixi v3 rc4 ParticleContainer not allowing scale animation
                var zoff = Math.sin(particle.zdirection) * 0.05;
                particle.scale.x += zoff;
                particle.scale.y += zoff;
            }
        }
    });

    return FireflyBehavior;
})(Behavior);

module.exports = FireflyBehavior;

},{"./Behavior":4}],6:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Behavior = _interopRequire(require("./Behavior"));

var WrappingBoundsBehavior = (function (_Behavior) {
    function WrappingBoundsBehavior(width, height) {
        _classCallCheck(this, WrappingBoundsBehavior);

        this.width = width;
        this.height = height;
    }

    _inherits(WrappingBoundsBehavior, _Behavior);

    _createClass(WrappingBoundsBehavior, {
        update: {
            value: function update(particle) {
                if (particle.position.x > this.width) {
                    particle.position.x = particle.position.x - this.width;
                } else if (particle.position.x < 0) {
                    particle.position.x = particle.position.x + this.width;
                }

                if (particle.position.y > this.height) {
                    particle.position.y = particle.position.y - this.height;
                } else if (particle.position.y < 0) {
                    particle.position.y = particle.position.y + this.height;
                }
            }
        }
    });

    return WrappingBoundsBehavior;
})(Behavior);

module.exports = WrappingBoundsBehavior;

},{"./Behavior":4}],7:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Mode = (function () {
    function Mode() {
        _classCallCheck(this, Mode);
    }

    _createClass(Mode, {
        onclick: {
            value: function onclick(e) {}
        },
        onmousedown: {
            value: function onmousedown(e) {}
        },
        onmousemove: {
            value: function onmousemove(e) {}
        }
    });

    return Mode;
})();

module.exports = Mode;

},{}],8:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Mode = _interopRequire(require("./Mode"));

var AreaSinkBehavior = _interopRequire(require("../behaviors/AreaSinkBehavior"));

var RandomAreaResetMode = (function (_Mode) {
    function RandomAreaResetMode(sink) {
        _classCallCheck(this, RandomAreaResetMode);

        this.sink = sink;
    }

    _inherits(RandomAreaResetMode, _Mode);

    _createClass(RandomAreaResetMode, {
        onclick: {
            value: function onclick(e) {
                this.sink.area = AreaSinkBehavior.Rectangle(Math.floor(Math.random() * (window.innerWidth / 2)), Math.floor(Math.random() * (window.innerHeight / 2)), Math.floor(Math.random() * (window.innerWidth / 3)), Math.floor(Math.random() * (window.innerHeight / 3))).area;
            }
        }
    });

    return RandomAreaResetMode;
})(Mode);

module.exports = RandomAreaResetMode;

},{"../behaviors/AreaSinkBehavior":3,"./Mode":7}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJEOi9kZXYvcGFydGlkcmF3L3NyYy9wYXJ0aWRyYXcuanMiLCJEOi9kZXYvcGFydGlkcmF3L3NyYy9QYXJ0aWNsZVNjZW5lLmpzIiwiRDovZGV2L3BhcnRpZHJhdy9zcmMvYmVoYXZpb3JzL0FyZWFTaW5rQmVoYXZpb3IuanMiLCJEOi9kZXYvcGFydGlkcmF3L3NyYy9iZWhhdmlvcnMvQmVoYXZpb3IuanMiLCJEOi9kZXYvcGFydGlkcmF3L3NyYy9iZWhhdmlvcnMvRmlyZWZseUJlaGF2aW9yLmpzIiwiRDovZGV2L3BhcnRpZHJhdy9zcmMvYmVoYXZpb3JzL1dyYXBwaW5nQm91bmRzQmVoYXZpb3IuanMiLCJEOi9kZXYvcGFydGlkcmF3L3NyYy9tb2Rlcy9Nb2RlLmpzIiwiRDovZGV2L3BhcnRpZHJhdy9zcmMvbW9kZXMvUmFuZG9tQXJlYVJlc2V0TW9kZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7O0lDQU8sYUFBYSwyQkFBTSxpQkFBaUI7O0lBQ3BDLGdCQUFnQiwyQkFBTSw4QkFBOEI7O0lBQ3BELGVBQWUsMkJBQU0sNkJBQTZCOztJQUNsRCxzQkFBc0IsMkJBQU0sb0NBQW9DOztJQUVoRSxtQkFBbUIsMkJBQU0sNkJBQTZCOztBQUU3RCxJQUFNLGNBQWMsR0FBRyxJQUFJLENBQUM7O0lBRXRCLGVBQWU7QUFDTixhQURULGVBQWUsQ0FDTCxLQUFLLEVBQUU7OEJBRGpCLGVBQWU7O0FBRWIsWUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7O0FBRW5CLFlBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztBQUNsQixZQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7QUFDckIsWUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0FBQ2xCLFlBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQzs7QUFFbkIsWUFBSSxDQUFDLElBQUksRUFB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V0FBVyxHQUFHLENBQUMsQ0FBQSxBQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQzthQUN0RTs7OztXQVhnQixtQkFBbUI7R0FBUyxJQUFJOztpQkFBaEMsbUJBQW1CIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBQYXJ0aWNsZVNjZW5lIGZyb20gXCIuL1BhcnRpY2xlU2NlbmVcIjtcclxuaW1wb3J0IEFyZWFTaW5rQmVoYXZpb3IgZnJvbSBcIi4vYmVoYXZpb3JzL0FyZWFTaW5rQmVoYXZpb3JcIjtcclxuaW1wb3J0IEZpcmVmbHlCZWhhdmlvciBmcm9tIFwiLi9iZWhhdmlvcnMvRmlyZWZseUJlaGF2aW9yXCI7XHJcbmltcG9ydCBXcmFwcGluZ0JvdW5kc0JlaGF2aW9yIGZyb20gXCIuL2JlaGF2aW9ycy9XcmFwcGluZ0JvdW5kc0JlaGF2aW9yXCI7XHJcblxyXG5pbXBvcnQgUmFuZG9tQXJlYVJlc2V0TW9kZSBmcm9tIFwiLi9tb2Rlcy9SYW5kb21BcmVhUmVzZXRNb2RlXCI7XHJcblxyXG5jb25zdCBQQVJUSUNMRV9DT1VOVCA9IDE1MDA7XHJcblxyXG5jbGFzcyBQYXJ0aWNsZURyYXdpbmcge1xyXG4gICAgY29uc3RydWN0b3IoY291bnQpIHtcclxuICAgICAgICB0aGlzLmNvdW50ID0gY291bnQ7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5zZXR1cFNjZW5lKCk7XHJcbiAgICAgICAgdGhpcy5zZXR1cFJlbmRlcmVyKCk7XHJcbiAgICAgICAgdGhpcy5zZXR1cE1vZGVzKCk7XHJcbiAgICAgICAgdGhpcy5zZXR1cFJlc2l6ZSgpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMudGljaygpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBzZXR1cFNjZW5lKCkge1xyXG4gICAgICAgIHRoaXMuZmlyZWZseSA9IG5ldyBGaXJlZmx5QmVoYXZpb3IoKTtcclxuICAgICAgICB0aGlzLmJvdW5kc1dyYXBwaW5nID0gbmV3IFdyYXBwaW5nQm91bmRzQmVoYXZpb3Iod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XHJcbiAgICAgICAgdGhpcy5hcmVhU2luayA9IEFyZWFTaW5rQmVoYXZpb3IuUmVjdGFuZ2xlKDAsIDAsIHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xyXG5cdFxyXG4gICAgICAgIHRoaXMuc2NlbmUgPSBuZXcgUGFydGljbGVTY2VuZShcclxuICAgICAgICAgICAgdGhpcy5jb3VudCwgXHJcbiAgICAgICAgICAgIHRoaXMuZmlyZWZseSwgXHJcbiAgICAgICAgICAgIHRoaXMuYXJlYVNpbmssXHJcbiAgICAgICAgICAgIHRoaXMuYm91bmRzV3JhcHBpbmcpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBzZXR1cFJlbmRlcmVyKCkge1xyXG4gICAgICAgIHRoaXMucmVuZGVyZXIgPSBQSVhJLmF1dG9EZXRlY3RSZW5kZXJlcih3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KTtcclxuICAgICAgICB0aGlzLnJlbmRlcmVyLnZpZXcuc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XHJcbiAgICAgICAgdGhpcy5yZW5kZXJlci52aWV3LnN0eWxlLmxlZnQgPSBcIjBcIjtcclxuICAgICAgICB0aGlzLnJlbmRlcmVyLnZpZXcuc3R5bGUudG9wID0gXCIwXCI7XHJcbiAgICAgICAgXHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLnJlbmRlcmVyLnZpZXcpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBzZXR1cE1vZGVzKCkge1xyXG4gICAgICAgIHRoaXMubW9kZSA9IDA7XHJcbiAgICAgICAgdGhpcy5tb2RlcyA9IFtcclxuICAgICAgICAgICAgbmV3IFJhbmRvbUFyZWFSZXNldE1vZGUodGhpcy5hcmVhU2luaylcclxuICAgICAgICBdO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHdpbmRvdy5vbmNsaWNrID0gKGUpID0+IHsgdGhpcy5tb2Rlc1t0aGlzLm1vZGVdLm9uY2xpY2soZSk7IH1cclxuICAgICAgICB3aW5kb3cubW91c2Vkb3duID0gKGUpID0+IHsgdGhpcy5tb2Rlc1t0aGlzLm1vZGVdLm1vdXNlZG93bihlKTsgfVxyXG4gICAgICAgIHdpbmRvdy5tb3VzZXVwID0gKGUpID0+IHsgdGhpcy5tb2Rlc1t0aGlzLm1vZGVdLm1vdXNldXAoZSk7IH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgc2V0dXBSZXNpemUoKSB7XHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMucmVzaXplKTtcclxuICAgICAgICB3aW5kb3cub25vcmllbnRhdGlvbmNoYW5nZSA9IHRoaXMucmVzaXplO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICByZXNpemUoKSB7XHJcbiAgICAgICAgbGV0IHdpZHRoID0gd2luZG93LmlubmVyV2lkdGgsIGhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDsgXHJcblx0XHR0aGlzLmJvdW5kc1dyYXBwaW5nLndpZHRoID0gd2lkdGg7XHJcblx0XHR0aGlzLmJvdW5kc1dyYXBwaW5nLmhlaWdodCA9IGhlaWdodDtcclxuICAgICAgICB0aGlzLnJlbmRlcmVyLnZpZXcuc3R5bGUud2lkdGggPSB3aWR0aCArIFwicHhcIlxyXG4gICAgICAgIHRoaXMucmVuZGVyZXIudmlldy5zdHlsZS5oZWlnaHQgPSBoZWlnaHQgKyBcInB4XCJcclxuICAgICAgICB0aGlzLnJlbmRlcmVyLnJlc2l6ZSh3aWR0aCwgaGVpZ2h0KTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgdGljaygpIHtcclxuICAgICAgICB0aGlzLnNjZW5lLnVwZGF0ZSgpO1xyXG4gICAgICAgIHRoaXMucmVuZGVyZXIucmVuZGVyKHRoaXMuc2NlbmUuY29udGFpbmVyKTtcclxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy50aWNrLmJpbmQodGhpcykpO1xyXG4gICAgfVxyXG59XHJcblxyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4gbmV3IFBhcnRpY2xlRHJhd2luZyhQQVJUSUNMRV9DT1VOVCkpO1xyXG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBQYXJ0aWNsZVNjZW5lIHtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihjb3VudCwgLi4uYmVoYXZpb3JzKSB7XHJcbiAgICAgICAgdGhpcy5wYXJ0aWNsZXMgPSBbXTtcclxuICAgICAgICB0aGlzLmJlaGF2aW9ycyA9IGJlaGF2aW9ycztcclxuICAgICAgICB0aGlzLmNvbnRhaW5lciA9IG5ldyBQSVhJLlBhcnRpY2xlQ29udGFpbmVyKGNvdW50LCBbdHJ1ZSwgdHJ1ZSwgZmFsc2UsIHRydWUsIHRydWVdKTtcclxuICAgICAgICB0aGlzLnRleHR1cmUgPSBuZXcgUElYSS5UZXh0dXJlLmZyb21JbWFnZShcInNwcml0ZS5wbmdcIik7XHJcbiAgICAgICAgXHJcbiAgICAgICAgZm9yIChsZXQgaT0wOyBpPGNvdW50OyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIHBhcnRpY2xlID0gbmV3IFBJWEkuU3ByaXRlKHRoaXMudGV4dHVyZSk7XHJcbiAgICAgICAgICAgIHBhcnRpY2xlLmFuY2hvci5zZXQoMC41KTtcclxuICAgICAgICAgICAgcGFydGljbGUuc2NhbGUueCA9IDAuMjtcclxuICAgICAgICAgICAgcGFydGljbGUuc2NhbGUueSA9IDAuMjtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIEJVRyBQaXhpIHYzIHJjNCBQYXJ0aWNsZUNvbnRhaW5lciBkb2Vzbid0IHN1cHBvcnQgdHJhbnNwYXJlbmN5IGF0IGFsbFxyXG4gICAgICAgICAgICBwYXJ0aWNsZS5hbHBoYSA9IDAuNjtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGZvciAobGV0IGo9MDsgajxiZWhhdmlvcnMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIGJlaGF2aW9yc1tqXS5pbml0aWFsaXplKHBhcnRpY2xlLCBpLCBjb3VudCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMucGFydGljbGVzLnB1c2gocGFydGljbGUpO1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5hZGRDaGlsZChwYXJ0aWNsZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICB1cGRhdGUoKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaT0wOyBpPHRoaXMucGFydGljbGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGo9MDsgajx0aGlzLmJlaGF2aW9ycy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5iZWhhdmlvcnNbal0udXBkYXRlKHRoaXMucGFydGljbGVzW2ldKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsImltcG9ydCBCZWhhdmlvciBmcm9tIFwiLi9CZWhhdmlvclwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXJlYVNpbmtCZWhhdmlvciBleHRlbmRzIEJlaGF2aW9yIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihhcmVhKSB7XHJcbiAgICAgICAgdGhpcy5hcmVhID0gYXJlYTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0aWFsaXplKHBhcnRpY2xlLCBpbmRleCwgY291bnQpIHtcclxuICAgICAgICBwYXJ0aWNsZS5wZXJjZW50SW5kZXggPSAoMS4wICogaW5kZXgpIC8gKDEuMCAqIGNvdW50KTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgdXBkYXRlKHBhcnRpY2xlKSB7XHJcbiAgICAgICAgbGV0IHBvcyA9IE1hdGguZmxvb3IodGhpcy5hcmVhLmxlbmd0aCAqIHBhcnRpY2xlLnBlcmNlbnRJbmRleCk7XHJcbiAgICAgICAgbGV0IHNpbmsgPSB0aGlzLmFyZWFbcG9zXTtcclxuICAgICAgICBsZXQgZGlyZWN0aW9uID0gTWF0aC5hdGFuMihzaW5rLnggLSBwYXJ0aWNsZS5wb3NpdGlvbi54LCBzaW5rLnkgLSBwYXJ0aWNsZS5wb3NpdGlvbi55KTtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgc3BlZWQgPSBwYXJ0aWNsZS5zcGVlZDtcclxuICAgICAgICBpZiAoc3BlZWQgPD0gMCkgc3BlZWQgPSAwLjE7XHJcbiAgICAgICAgc3BlZWQgPSBzcGVlZCAqICgwLjEgKiBNYXRoLnNxcnQoTWF0aC5wb3coc2luay54IC0gcGFydGljbGUucG9zaXRpb24ueCwgMiksIE1hdGgucG93KHNpbmsueSAtIHBhcnRpY2xlLnBvc2l0aW9uLnkpKSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcGFydGljbGUucG9zaXRpb24ueCArPSBNYXRoLnNpbihkaXJlY3Rpb24pICogc3BlZWQ7XHJcbiAgICAgICAgcGFydGljbGUucG9zaXRpb24ueSArPSBNYXRoLmNvcyhkaXJlY3Rpb24pICogc3BlZWQ7XHJcbiAgICB9XHJcbiAgICAgICAgXHJcbiAgICBzdGF0aWMgc2h1ZmZsZShhcnJheSkge1xyXG4gICAgICAgIHZhciBjdXJyZW50SW5kZXggPSBhcnJheS5sZW5ndGgsIHRlbXBvcmFyeVZhbHVlLCByYW5kb21JbmRleCA7XHJcblxyXG4gICAgICAgIHdoaWxlICgwICE9PSBjdXJyZW50SW5kZXgpIHtcclxuICAgICAgICAgICAgcmFuZG9tSW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjdXJyZW50SW5kZXgpO1xyXG4gICAgICAgICAgICBjdXJyZW50SW5kZXggLT0gMTtcclxuXHJcbiAgICAgICAgICAgIHRlbXBvcmFyeVZhbHVlID0gYXJyYXlbY3VycmVudEluZGV4XTtcclxuICAgICAgICAgICAgYXJyYXlbY3VycmVudEluZGV4XSA9IGFycmF5W3JhbmRvbUluZGV4XTtcclxuICAgICAgICAgICAgYXJyYXlbcmFuZG9tSW5kZXhdID0gdGVtcG9yYXJ5VmFsdWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gYXJyYXk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHN0YXRpYyBSZWN0YW5nbGUoeCwgeSwgd2lkdGgsIGhlaWdodCkge1xyXG4gICAgICAgIGlmICh3aWR0aCA8PSAwKSB3aWR0aCA9IDE7XHJcbiAgICAgICAgaWYgKGhlaWdodCA8PSAwKSBoZWlnaHQgPSAxO1xyXG4gICAgICAgIGxldCBhcmVhID0gbmV3IEFycmF5KHdpZHRoICogaGVpZ2h0KTtcclxuICAgICAgICBmb3IgKGxldCBpPTA7IGk8d2lkdGg7IGkrKykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBqPTA7IGo8aGVpZ2h0OyBqKyspIHtcclxuICAgICAgICAgICAgICAgIGFyZWFbaiAqIHdpZHRoICsgaV0gPSB7eDogeCArIGksIHk6IHkgKyBqfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBhcmVhID0gQXJlYVNpbmtCZWhhdmlvci5zaHVmZmxlKGFyZWEpO1xyXG4gICAgICAgIHJldHVybiBuZXcgQXJlYVNpbmtCZWhhdmlvcihhcmVhKTtcclxuICAgIH1cclxufSIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIEJlaGF2aW9yIHtcclxuXHJcbiAgICBpbml0aWFsaXplKHBhcnRpY2xlKSB7fVxyXG4gICAgXHJcbiAgICB1cGRhdGUocGFydGljbGUpIHt9XHJcbn0iLCJpbXBvcnQgQmVoYXZpb3IgZnJvbSBcIi4vQmVoYXZpb3JcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZpcmVmbHlCZWhhdmlvciBleHRlbmRzIEJlaGF2aW9yIHtcclxuXHJcbiAgICBpbml0aWFsaXplKHBhcnRpY2xlKSB7XHJcbiAgICAgICAgcGFydGljbGUuZGlyZWN0aW9uID0gcGFydGljbGUuZGlyZWN0aW9uIHx8IE1hdGgucmFuZG9tKCkgKiBNYXRoLlBJICogMjtcclxuICAgICAgICBwYXJ0aWNsZS56ZGlyZWN0aW9uID0gcGFydGljbGUuemRpcmVjdGlvbiB8fCBNYXRoLnJhbmRvbSgpICogTWF0aC5QSSAqIDJcclxuICAgICAgICBwYXJ0aWNsZS5zcGVlZCA9IHBhcnRpY2xlLnNwZWVkIHx8IDE7XHJcbiAgICAgICAgcGFydGljbGUudHVybiA9IE1hdGgucmFuZG9tKCkgLSAwLjU7XHJcbiAgICAgICAgcGFydGljbGUuenR1cm4gPSBNYXRoLnJhbmRvbSgpIC0gMC41O1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICB1cGRhdGUocGFydGljbGUpIHtcclxuICAgICAgICBwYXJ0aWNsZS5kaXJlY3Rpb24gKz0gcGFydGljbGUudHVybiAqIDAuMTtcclxuICAgICAgICBwYXJ0aWNsZS56ZGlyZWN0aW9uICs9IHBhcnRpY2xlLnp0dXJuICogMC41O1xyXG4gICAgICAgIHBhcnRpY2xlLnR1cm4gKz0gMC4xNSAqIChNYXRoLnJhbmRvbSgpIC0gMC41KTtcclxuICAgICAgICBpZiAocGFydGljbGUudHVybiA+IDEpIHBhcnRpY2xlLnR1cm4gPSAxO1xyXG4gICAgICAgIGlmIChwYXJ0aWNsZS50dXJuIDwgLTEpIHBhcnRpY2xlLnR1cm4gPSAtMTtcclxuICAgICAgICBwYXJ0aWNsZS56dHVybiArPSAwLjA1ICogKE1hdGgucmFuZG9tKCkgLSAwLjUpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHBhcnRpY2xlLnBvc2l0aW9uLnggKz0gTWF0aC5zaW4ocGFydGljbGUuZGlyZWN0aW9uKSAqIHBhcnRpY2xlLnNwZWVkO1xyXG4gICAgICAgIHBhcnRpY2xlLnBvc2l0aW9uLnkgKz0gTWF0aC5jb3MocGFydGljbGUuZGlyZWN0aW9uKSAqIHBhcnRpY2xlLnNwZWVkO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIEJVRyBQaXhpIHYzIHJjNCBQYXJ0aWNsZUNvbnRhaW5lciBub3QgYWxsb3dpbmcgc2NhbGUgYW5pbWF0aW9uXHJcbiAgICAgICAgbGV0IHpvZmYgPSBNYXRoLnNpbihwYXJ0aWNsZS56ZGlyZWN0aW9uKSAqIDAuMDU7XHJcbiAgICAgICAgcGFydGljbGUuc2NhbGUueCArPSB6b2ZmO1xyXG4gICAgICAgIHBhcnRpY2xlLnNjYWxlLnkgKz0gem9mZjtcclxuICAgIH1cclxufSIsImltcG9ydCBCZWhhdmlvciBmcm9tIFwiLi9CZWhhdmlvclwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV3JhcHBpbmdCb3VuZHNCZWhhdmlvciBleHRlbmRzIEJlaGF2aW9yIHtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih3aWR0aCwgaGVpZ2h0KSB7XHJcbiAgICAgICAgdGhpcy53aWR0aCA9IHdpZHRoO1xyXG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZShwYXJ0aWNsZSkge1xyXG4gICAgICAgIGlmIChwYXJ0aWNsZS5wb3NpdGlvbi54ID4gdGhpcy53aWR0aCkge1xyXG4gICAgICAgICAgICBwYXJ0aWNsZS5wb3NpdGlvbi54ID0gcGFydGljbGUucG9zaXRpb24ueCAtIHRoaXMud2lkdGg7XHJcbiAgICAgICAgfSBlbHNlIGlmIChwYXJ0aWNsZS5wb3NpdGlvbi54IDwgMCkge1xyXG4gICAgICAgICAgICBwYXJ0aWNsZS5wb3NpdGlvbi54ID0gcGFydGljbGUucG9zaXRpb24ueCArIHRoaXMud2lkdGg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGlmIChwYXJ0aWNsZS5wb3NpdGlvbi55ID4gdGhpcy5oZWlnaHQpIHtcclxuICAgICAgICAgICAgcGFydGljbGUucG9zaXRpb24ueSA9IHBhcnRpY2xlLnBvc2l0aW9uLnkgLSB0aGlzLmhlaWdodDtcclxuICAgICAgICB9IGVsc2UgaWYgKHBhcnRpY2xlLnBvc2l0aW9uLnkgPCAwKSB7XHJcbiAgICAgICAgICAgIHBhcnRpY2xlLnBvc2l0aW9uLnkgPSBwYXJ0aWNsZS5wb3NpdGlvbi55ICsgdGhpcy5oZWlnaHQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgTW9kZSB7XHJcbiAgICBvbmNsaWNrKGUpIHt9XHJcbiAgICBvbm1vdXNlZG93bihlKSB7fVxyXG4gICAgb25tb3VzZW1vdmUoZSkge31cclxufSIsImltcG9ydCBNb2RlIGZyb20gXCIuL01vZGVcIjtcclxuaW1wb3J0IEFyZWFTaW5rQmVoYXZpb3IgZnJvbSBcIi4uL2JlaGF2aW9ycy9BcmVhU2lua0JlaGF2aW9yXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSYW5kb21BcmVhUmVzZXRNb2RlIGV4dGVuZHMgTW9kZSB7XHJcbiAgICBjb25zdHJ1Y3RvcihzaW5rKSB7XHJcbiAgICAgICAgdGhpcy5zaW5rID0gc2luaztcclxuICAgIH1cclxuICAgIFxyXG4gICAgb25jbGljayhlKSB7XHJcbiAgICAgICAgdGhpcy5zaW5rLmFyZWEgPSBBcmVhU2lua0JlaGF2aW9yLlJlY3RhbmdsZShcclxuICAgICAgICAgICAgICAgIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICh3aW5kb3cuaW5uZXJXaWR0aCAvIDIpKSwgXHJcbiAgICAgICAgICAgICAgICBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAod2luZG93LmlubmVySGVpZ2h0IC8gMikpLCBcclxuICAgICAgICAgICAgICAgIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICh3aW5kb3cuaW5uZXJXaWR0aCAvIDMpKSwgXHJcbiAgICAgICAgICAgICAgICBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAod2luZG93LmlubmVySGVpZ2h0IC8gMykpKS5hcmVhO1xyXG4gICAgfVxyXG59Il19
