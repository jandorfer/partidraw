(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var ParticleScene = _interopRequire(require("./ParticleScene"));

var AreaSinkBehavior = _interopRequire(require("./behaviors/AreaSinkBehavior"));

var FireflyBehavior = _interopRequire(require("./behaviors/FireflyBehavior"));

var WrappingBoundsBehavior = _interopRequire(require("./behaviors/WrappingBoundsBehavior"));

var Mode = _interopRequire(require("./modes/Mode"));

var MouseDrawAreaMode = _interopRequire(require("./modes/MouseDrawAreaMode"));

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

                this.mode = 1;
                this.modes = [new Mode(), new RandomAreaResetMode(this.areaSink), new MouseDrawAreaMode(this.areaSink)];

                window.onclick = function (e) {
                    _this.modes[_this.mode].onclick(e);
                };
                window.onmousedown = function (e) {
                    _this.modes[_this.mode].onmousedown(e);
                };
                window.onmousemove = function (e) {
                    _this.modes[_this.mode].onmousemove(e);
                };
                window.onmouseup = function (e) {
                    _this.modes[_this.mode].onmouseup(e);
                };

                this.setupModeSwitcher();
            }
        },
        setupModeSwitcher: {
            value: function setupModeSwitcher() {
                var _this = this;

                var root = document.getElementById("mode-switcher");
                var desc = document.getElementById("mode-desc");
                if (!root) {
                    return;
                }var selected = null;
                for (var i = 0; i < this.modes.length; i++) {
                    (function (i) {
                        var link = document.createElement("a");
                        link.setAttribute("href", "#");
                        link.onclick = function (e) {
                            e.stopPropagation();
                            if (selected) selected.classList.remove("active");
                            selected = link;
                            link.classList.add("active");
                            if (desc) desc.innerHTML = _this.modes[i].description;
                            _this.switchMode(i);
                        };
                        if (_this.mode === i) {
                            link.classList.add("active");
                            if (desc) desc.innerHTML = _this.modes[i].description;
                            selected = link;
                        }
                        link.appendChild(document.createTextNode(_this.modes[i].name));
                        root.appendChild(link);
                    })(i);
                }
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
        },
        switchMode: {
            value: function switchMode(mode, e) {
                if (mode < 0 || mode > this.modes.length) {
                    return;
                }this.modes[this.mode].stop();
                this.mode = mode;
                this.modes[this.mode].start();
            }
        }
    });

    return ParticleDrawing;
})();

document.addEventListener("DOMContentLoaded", function () {
    return new ParticleDrawing(PARTICLE_COUNT);
});

},{"./ParticleScene":2,"./behaviors/AreaSinkBehavior":3,"./behaviors/FireflyBehavior":5,"./behaviors/WrappingBoundsBehavior":6,"./modes/Mode":7,"./modes/MouseDrawAreaMode":8,"./modes/RandomAreaResetMode":9}],2:[function(require,module,exports){
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

        this.name = "None";
        this.description = "Choose a different mode.";
    }

    _createClass(Mode, {
        start: {
            value: function start() {}
        },
        stop: {
            value: function stop() {}
        },
        onclick: {
            value: function onclick(e) {}
        },
        onmousedown: {
            value: function onmousedown(e) {}
        },
        onmousemove: {
            value: function onmousemove(e) {}
        },
        onmouseup: {
            value: function onmouseup(e) {}
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

var MouseDrawAreaMode = (function (_Mode) {
    function MouseDrawAreaMode(sink) {
        _classCallCheck(this, MouseDrawAreaMode);

        this.name = "Drawing";
        this.description = "Click and drag the mouse to set the path for particles to fill.";
        this.sink = sink;

        this.started = false;
        this.active = false;
    }

    _inherits(MouseDrawAreaMode, _Mode);

    _createClass(MouseDrawAreaMode, {
        onmousedown: {
            value: function onmousedown(e) {
                if (!this.started) {
                    this.started = true;
                    // Clear the current area the first time around
                    this.sink.area = [];
                }

                this.active = true;
                this.addPoint(e);
            }
        },
        onmousemove: {
            value: function onmousemove(e) {
                if (this.active) {
                    this.addPoint(e);
                }
            }
        },
        onmouseup: {
            value: function onmouseup(e) {
                this.active = false;
            }
        },
        stop: {
            value: function stop() {
                this.active = false;
                this.started = false;
            }
        },
        addPoint: {
            value: function addPoint(e) {
                this.sink.area.push({ x: e.clientX, y: e.clientY });
            }
        }
    });

    return MouseDrawAreaMode;
})(Mode);

module.exports = MouseDrawAreaMode;

},{"../behaviors/AreaSinkBehavior":3,"./Mode":7}],9:[function(require,module,exports){
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

        this.name = "Random Rect";
        this.description = "Click anywhere to randomly reset the target shape.";
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJEOi9kZXYvcGFydGlkcmF3L3NyYy9wYXJ0aWRyYXcuanMiLCJEOi9kZXYvcGFydGlkcmF3L3NyYy9QYXJ0aWNsZVNjZW5lLmpzIiwiRDovZGV2L3BhcnRpZHJhdy9zcmMvYmVoYXZpb3JzL0FyZWFTaW5rQmVoYXZpb3IuanMiLCJEOi9kZXYvcGFydGlkcmF3L3NyYy9iZWhhdmlvcnMvQmVoYXZpb3IuanMiLCJEOi9kZXYvcGFydGlkcmF3L3NyYy9iZWhhdmlvcnMvRmlyZWZseUJlaGF2aW9yLmpzIiwiRDovZGV2L3BhcnRpZHJhdy9zcmMvYmVoYXZpb3JzL1dyYXBwaW5nQm91bmRzQmVoYXZpb3IuanMiLCJEOi9kZXYvcGFydGlkcmF3L3NyYy9tb2Rlcy9Nb2RlLmpzIiwiRDovZGV2L3BhcnRpZHJhdy9zcmMvbW9kZXMvTW91c2VEcmF3QXJlYU1vZGUuanMiLCJEOi9kZXYvcGFydGlkcmF3L3NyYy9tb2Rlcy9SYW5kb21BcmVhUmVzZXRNb2RlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7SUNBTyxhQUFhLDJCQUFNLGlCQUFpQjs7SUFDcEMsZ0JBQWdCLDJCQUFNLDhCQUE4Qjs7SUFDcEQsZUFBZSwyQkFBTSw2QkFBNkI7O0lBQ2xELHNCQUFzQiwyQkFBTSxvQ0FBb0M7O0lBRWhFLElBQUksMkJBQU0sY0FBYzs7SUFDeEIsaUJBQWlCLDJCQUFNLDJCQUEyQjs7SUFDbEQsbUJBQW1CLDJCQUFNLDZCQUE2Qjs7QUFFN0QsSUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDOztJQUV0QixlQUFlO0FBQ04sYUFEVCxlQUFlLENBQ0wsS0FBSyxFQUFFOzhCQURqQixlQUFlOztBQUViLFlBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDOztBQUVuQixZQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7QUFDbEIsWUFBSSxDQUFDLGFB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RyxDQUFDO0FBQ3BDLHdCQUFRLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxHQUFHLENBQUM7YUFDeEM7O0FBRUQsY0FBTTttQkFBQSxnQkFBQyxRQUFRLEVBQUU7QUFDYix3QkFBUSxDQUFDLFNBQVMsSUFBSSxRQUFRLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQztBQUMxQyx3QkFBUSxDQUFDLFVBQVUsSUFBSSxRQUFRLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQztBQUM1Qyx3QkFBUSxDQUFDLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEdBQUcsQ0FBQSxBQUFDLENBQUM7QUFDOUMsb0JBQUksUUFBUSxDQUFDLElBQUksR0FBRyxDQUFDLEVBQUUsUUFBUSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7QUFDekMsb0JBQUksUUFBUSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQzNDLHdCQUFRLENBQUMsS0FBSyxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsR0FBRyxDQUFBLEFBQUMsQ0FBQzs7QUFFL0Msd0JBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUM7QUFDckUsd0JBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUM7OztBQUdyRSxvQkFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLEdBQUcsSUFBSSxDQUFDO0FBQ2hELHdCQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUM7QUFDekIsd0JBQVEsQ0FBQyxLQUFLLENBQUMsQ0FB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bUJBQUEsaUJBQUMsQ0FBQyxFQUFFO0FBQ1Asb0JBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLGdCQUFnQixDQUFDLFNBQVMsQ0FDbkMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksTUFBTSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUEsQUFBQyxDQUFDLEVBQ25ELElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLE1BQU0sQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFBLEFBQUMsQ0FBQyxFQUNwRCxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxNQUFNLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQSxBQUFDLENBQUMsRUFDbkQsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksTUFBTSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUEsQUFBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7YUFDdEU7Ozs7V0FiZ0IsbUJBQW1CO0dBQVMsSUFBSTs7aUJBQWhDLG1CQUFtQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgUGFydGljbGVTY2VuZSBmcm9tIFwiLi9QYXJ0aWNsZVNjZW5lXCI7XHJcbmltcG9ydCBBcmVhU2lua0JlaGF2aW9yIGZyb20gXCIuL2JlaGF2aW9ycy9BcmVhU2lua0JlaGF2aW9yXCI7XHJcbmltcG9ydCBGaXJlZmx5QmVoYXZpb3IgZnJvbSBcIi4vYmVoYXZpb3JzL0ZpcmVmbHlCZWhhdmlvclwiO1xyXG5pbXBvcnQgV3JhcHBpbmdCb3VuZHNCZWhhdmlvciBmcm9tIFwiLi9iZWhhdmlvcnMvV3JhcHBpbmdCb3VuZHNCZWhhdmlvclwiO1xyXG5cclxuaW1wb3J0IE1vZGUgZnJvbSBcIi4vbW9kZXMvTW9kZVwiO1xyXG5pbXBvcnQgTW91c2VEcmF3QXJlYU1vZGUgZnJvbSBcIi4vbW9kZXMvTW91c2VEcmF3QXJlYU1vZGVcIjtcclxuaW1wb3J0IFJhbmRvbUFyZWFSZXNldE1vZGUgZnJvbSBcIi4vbW9kZXMvUmFuZG9tQXJlYVJlc2V0TW9kZVwiO1xyXG5cclxuY29uc3QgUEFSVElDTEVfQ09VTlQgPSAxNTAwO1xyXG5cclxuY2xhc3MgUGFydGljbGVEcmF3aW5nIHtcclxuICAgIGNvbnN0cnVjdG9yKGNvdW50KSB7XHJcbiAgICAgICAgdGhpcy5jb3VudCA9IGNvdW50O1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuc2V0dXBTY2VuZSgpO1xyXG4gICAgICAgIHRoaXMuc2V0dXBSZW5kZXJlcigpO1xyXG4gICAgICAgIHRoaXMuc2V0dXBNb2RlcygpO1xyXG4gICAgICAgIHRoaXMuc2V0dXBSZXNpemUoKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnRpY2soKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgc2V0dXBTY2VuZSgpIHtcclxuICAgICAgICB0aGlzLmZpcmVmbHkgPSBuZXcgRmlyZWZseUJlaGF2aW9yKCk7XHJcbiAgICAgICAgdGhpcy5ib3VuZHNXcmFwcGluZyA9IG5ldyBXcmFwcGluZ0JvdW5kc0JlaGF2aW9yKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xyXG4gICAgICAgIHRoaXMuYXJlYVNpbmsgPSBBcmVhU2lua0JlaGF2aW9yLlJlY3RhbmdsZSgwLCAwLCB3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KTtcclxuXHRcclxuICAgICAgICB0aGlzLnNjZW5lID0gbmV3IFBhcnRpY2xlU2NlbmUoXHJcbiAgICAgICAgICAgIHRoaXMuY291bnQsIFxyXG4gICAgICAgICAgICB0aGlzLmZpcmVmbHksIFxyXG4gICAgICAgICAgICB0aGlzLmFyZWFTaW5rLFxyXG4gICAgICAgICAgICB0aGlzLmJvdW5kc1dyYXBwaW5nKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgc2V0dXBSZW5kZXJlcigpIHtcclxuICAgICAgICB0aGlzLnJlbmRlcmVyID0gUElYSS5hdXRvRGV0ZWN0UmVuZGVyZXIod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XHJcbiAgICAgICAgdGhpcy5yZW5kZXJlci52aWV3LnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xyXG4gICAgICAgIHRoaXMucmVuZGVyZXIudmlldy5zdHlsZS5sZWZ0ID0gXCIwXCI7XHJcbiAgICAgICAgdGhpcy5yZW5kZXJlci52aWV3LnN0eWxlLnRvcCA9IFwiMFwiO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5yZW5kZXJlci52aWV3KTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgc2V0dXBNb2RlcygpIHtcclxuICAgICAgICB0aGlzLm1vZGUgPSAxO1xyXG4gICAgICAgIHRoaXMubW9kZXMgPSBbXHJcbiAgICAgICAgICAgIG5ldyBNb2RlKCksXHJcbiAgICAgICAgICAgIG5ldyBSYW5kb21BcmVhUmVzZXRNb2RlKHRoaXMuYXJlYVNpbmspLFxyXG4gICAgICAgICAgICBuZXcgTW91c2VEcmF3QXJlYU1vZGUodGhpcy5hcmVhU2luaylcclxuICAgICAgICBdO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHdpbmRvdy5vbmNsaWNrID0gKGUpID0+IHsgdGhpcy5tb2Rlc1t0aGlzLm1vZGVdLm9uY2xpY2soZSk7IH1cclxuICAgICAgICB3aW5kb3cub25tb3VzZWRvd24gPSAoZSkgPT4geyB0aGlzLm1vZGVzW3RoaXMubW9kZV0ub25tb3VzZWRvd24oZSk7IH1cclxuICAgICAgICB3aW5kb3cub25tb3VzZW1vdmUgPSAoZSkgPT4geyB0aGlzLm1vZGVzW3RoaXMubW9kZV0ub25tb3VzZW1vdmUoZSk7IH1cclxuICAgICAgICB3aW5kb3cub25tb3VzZXVwID0gKGUpID0+IHsgdGhpcy5tb2Rlc1t0aGlzLm1vZGVdLm9ubW91c2V1cChlKTsgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuc2V0dXBNb2RlU3dpdGNoZXIoKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgc2V0dXBNb2RlU3dpdGNoZXIoKSB7XHJcbiAgICAgICAgbGV0IHJvb3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1vZGUtc3dpdGNoZXJcIik7XHJcbiAgICAgICAgbGV0IGRlc2MgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1vZGUtZGVzY1wiKTtcclxuICAgICAgICBpZiAoIXJvb3QpIHJldHVybjtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgc2VsZWN0ZWQgPSBudWxsO1xyXG4gICAgICAgIGZvciAobGV0IGk9MDsgaTx0aGlzLm1vZGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xyXG4gICAgICAgICAgICBsaW5rLnNldEF0dHJpYnV0ZShcImhyZWZcIiwgXCIjXCIpO1xyXG4gICAgICAgICAgICBsaW5rLm9uY2xpY2sgPSAoZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgICAgICAgIGlmIChzZWxlY3RlZCkgc2VsZWN0ZWQuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICAgICBzZWxlY3RlZCA9IGxpbms7XHJcbiAgICAgICAgICAgICAgICBsaW5rLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGRlc2MpIGRlc2MuaW5uZXJIVE1MID0gdGhpcy5tb2Rlc1tpXS5kZXNjcmlwdGlvbjtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3dpdGNoTW9kZShpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5tb2RlID09PSBpKSB7XHJcbiAgICAgICAgICAgICAgICBsaW5rLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGRlc2MpIGRlc2MuaW5uZXJIVE1MID0gdGhpcy5tb2Rlc1tpXS5kZXNjcmlwdGlvbjtcclxuICAgICAgICAgICAgICAgIHNlbGVjdGVkID0gbGluaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsaW5rLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRoaXMubW9kZXNbaV0ubmFtZSkpO1xyXG4gICAgICAgICAgICByb290LmFwcGVuZENoaWxkKGxpbmspO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgc2V0dXBSZXNpemUoKSB7XHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMucmVzaXplKTtcclxuICAgICAgICB3aW5kb3cub25vcmllbnRhdGlvbmNoYW5nZSA9IHRoaXMucmVzaXplO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICByZXNpemUoKSB7XHJcbiAgICAgICAgbGV0IHdpZHRoID0gd2luZG93LmlubmVyV2lkdGgsIGhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDsgXHJcblx0XHR0aGlzLmJvdW5kc1dyYXBwaW5nLndpZHRoID0gd2lkdGg7XHJcblx0XHR0aGlzLmJvdW5kc1dyYXBwaW5nLmhlaWdodCA9IGhlaWdodDtcclxuICAgICAgICB0aGlzLnJlbmRlcmVyLnZpZXcuc3R5bGUud2lkdGggPSB3aWR0aCArIFwicHhcIlxyXG4gICAgICAgIHRoaXMucmVuZGVyZXIudmlldy5zdHlsZS5oZWlnaHQgPSBoZWlnaHQgKyBcInB4XCJcclxuICAgICAgICB0aGlzLnJlbmRlcmVyLnJlc2l6ZSh3aWR0aCwgaGVpZ2h0KTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgdGljaygpIHtcclxuICAgICAgICB0aGlzLnNjZW5lLnVwZGF0ZSgpO1xyXG4gICAgICAgIHRoaXMucmVuZGVyZXIucmVuZGVyKHRoaXMuc2NlbmUuY29udGFpbmVyKTtcclxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy50aWNrLmJpbmQodGhpcykpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBzd2l0Y2hNb2RlKG1vZGUsIGUpIHtcclxuICAgICAgICBpZiAobW9kZSA8IDAgfHwgbW9kZSA+IHRoaXMubW9kZXMubGVuZ3RoKSByZXR1cm47XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5tb2Rlc1t0aGlzLm1vZGVdLnN0b3AoKTtcclxuICAgICAgICB0aGlzLm1vZGUgPSBtb2RlO1xyXG4gICAgICAgIHRoaXMubW9kZXNbdGhpcy5tb2RlXS5zdGFydCgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4gbmV3IFBhcnRpY2xlRHJhd2luZyhQQVJUSUNMRV9DT1VOVCkpO1xyXG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBQYXJ0aWNsZVNjZW5lIHtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihjb3VudCwgLi4uYmVoYXZpb3JzKSB7XHJcbiAgICAgICAgdGhpcy5wYXJ0aWNsZXMgPSBbXTtcclxuICAgICAgICB0aGlzLmJlaGF2aW9ycyA9IGJlaGF2aW9ycztcclxuICAgICAgICB0aGlzLmNvbnRhaW5lciA9IG5ldyBQSVhJLlBhcnRpY2xlQ29udGFpbmVyKGNvdW50LCBbdHJ1ZSwgdHJ1ZSwgZmFsc2UsIHRydWUsIHRydWVdKTtcclxuICAgICAgICB0aGlzLnRleHR1cmUgPSBuZXcgUElYSS5UZXh0dXJlLmZyb21JbWFnZShcInNwcml0ZS5wbmdcIik7XHJcbiAgICAgICAgXHJcbiAgICAgICAgZm9yIChsZXQgaT0wOyBpPGNvdW50OyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIHBhcnRpY2xlID0gbmV3IFBJWEkuU3ByaXRlKHRoaXMudGV4dHVyZSk7XHJcbiAgICAgICAgICAgIHBhcnRpY2xlLmFuY2hvci5zZXQoMC41KTtcclxuICAgICAgICAgICAgcGFydGljbGUuc2NhbGUueCA9IDAuMjtcclxuICAgICAgICAgICAgcGFydGljbGUuc2NhbGUueSA9IDAuMjtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIEJVRyBQaXhpIHYzIHJjNCBQYXJ0aWNsZUNvbnRhaW5lciBkb2Vzbid0IHN1cHBvcnQgdHJhbnNwYXJlbmN5IGF0IGFsbFxyXG4gICAgICAgICAgICBwYXJ0aWNsZS5hbHBoYSA9IDAuNjtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGZvciAobGV0IGo9MDsgajxiZWhhdmlvcnMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIGJlaGF2aW9yc1tqXS5pbml0aWFsaXplKHBhcnRpY2xlLCBpLCBjb3VudCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMucGFydGljbGVzLnB1c2gocGFydGljbGUpO1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5hZGRDaGlsZChwYXJ0aWNsZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICB1cGRhdGUoKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaT0wOyBpPHRoaXMucGFydGljbGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGo9MDsgajx0aGlzLmJlaGF2aW9ycy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5iZWhhdmlvcnNbal0udXBkYXRlKHRoaXMucGFydGljbGVzW2ldKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsImltcG9ydCBCZWhhdmlvciBmcm9tIFwiLi9CZWhhdmlvclwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXJlYVNpbmtCZWhhdmlvciBleHRlbmRzIEJlaGF2aW9yIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihhcmVhKSB7XHJcbiAgICAgICAgdGhpcy5hcmVhID0gYXJlYTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0aWFsaXplKHBhcnRpY2xlLCBpbmRleCwgY291bnQpIHtcclxuICAgICAgICBwYXJ0aWNsZS5wZXJjZW50SW5kZXggPSAoMS4wICogaW5kZXgpIC8gKDEuMCAqIGNvdW50KTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgdXBkYXRlKHBhcnRpY2xlKSB7XHJcbiAgICAgICAgbGV0IHBvcyA9IE1hdGguZmxvb3IodGhpcy5hcmVhLmxlbmd0aCAqIHBhcnRpY2xlLnBlcmNlbnRJbmRleCk7XHJcbiAgICAgICAgbGV0IHNpbmsgPSB0aGlzLmFyZWFbcG9zXTtcclxuICAgICAgICBsZXQgZGlyZWN0aW9uID0gTWF0aC5hdGFuMihzaW5rLnggLSBwYXJ0aWNsZS5wb3NpdGlvbi54LCBzaW5rLnkgLSBwYXJ0aWNsZS5wb3NpdGlvbi55KTtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgc3BlZWQgPSBwYXJ0aWNsZS5zcGVlZDtcclxuICAgICAgICBpZiAoc3BlZWQgPD0gMCkgc3BlZWQgPSAwLjE7XHJcbiAgICAgICAgc3BlZWQgPSBzcGVlZCAqICgwLjEgKiBNYXRoLnNxcnQoTWF0aC5wb3coc2luay54IC0gcGFydGljbGUucG9zaXRpb24ueCwgMiksIE1hdGgucG93KHNpbmsueSAtIHBhcnRpY2xlLnBvc2l0aW9uLnkpKSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcGFydGljbGUucG9zaXRpb24ueCArPSBNYXRoLnNpbihkaXJlY3Rpb24pICogc3BlZWQ7XHJcbiAgICAgICAgcGFydGljbGUucG9zaXRpb24ueSArPSBNYXRoLmNvcyhkaXJlY3Rpb24pICogc3BlZWQ7XHJcbiAgICB9XHJcbiAgICAgICAgXHJcbiAgICBzdGF0aWMgc2h1ZmZsZShhcnJheSkge1xyXG4gICAgICAgIHZhciBjdXJyZW50SW5kZXggPSBhcnJheS5sZW5ndGgsIHRlbXBvcmFyeVZhbHVlLCByYW5kb21JbmRleCA7XHJcblxyXG4gICAgICAgIHdoaWxlICgwICE9PSBjdXJyZW50SW5kZXgpIHtcclxuICAgICAgICAgICAgcmFuZG9tSW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjdXJyZW50SW5kZXgpO1xyXG4gICAgICAgICAgICBjdXJyZW50SW5kZXggLT0gMTtcclxuXHJcbiAgICAgICAgICAgIHRlbXBvcmFyeVZhbHVlID0gYXJyYXlbY3VycmVudEluZGV4XTtcclxuICAgICAgICAgICAgYXJyYXlbY3VycmVudEluZGV4XSA9IGFycmF5W3JhbmRvbUluZGV4XTtcclxuICAgICAgICAgICAgYXJyYXlbcmFuZG9tSW5kZXhdID0gdGVtcG9yYXJ5VmFsdWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gYXJyYXk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHN0YXRpYyBSZWN0YW5nbGUoeCwgeSwgd2lkdGgsIGhlaWdodCkge1xyXG4gICAgICAgIGlmICh3aWR0aCA8PSAwKSB3aWR0aCA9IDE7XHJcbiAgICAgICAgaWYgKGhlaWdodCA8PSAwKSBoZWlnaHQgPSAxO1xyXG4gICAgICAgIGxldCBhcmVhID0gbmV3IEFycmF5KHdpZHRoICogaGVpZ2h0KTtcclxuICAgICAgICBmb3IgKGxldCBpPTA7IGk8d2lkdGg7IGkrKykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBqPTA7IGo8aGVpZ2h0OyBqKyspIHtcclxuICAgICAgICAgICAgICAgIGFyZWFbaiAqIHdpZHRoICsgaV0gPSB7eDogeCArIGksIHk6IHkgKyBqfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBhcmVhID0gQXJlYVNpbmtCZWhhdmlvci5zaHVmZmxlKGFyZWEpO1xyXG4gICAgICAgIHJldHVybiBuZXcgQXJlYVNpbmtCZWhhdmlvcihhcmVhKTtcclxuICAgIH1cclxufSIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIEJlaGF2aW9yIHtcclxuXHJcbiAgICBpbml0aWFsaXplKHBhcnRpY2xlKSB7fVxyXG4gICAgXHJcbiAgICB1cGRhdGUocGFydGljbGUpIHt9XHJcbn0iLCJpbXBvcnQgQmVoYXZpb3IgZnJvbSBcIi4vQmVoYXZpb3JcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZpcmVmbHlCZWhhdmlvciBleHRlbmRzIEJlaGF2aW9yIHtcclxuXHJcbiAgICBpbml0aWFsaXplKHBhcnRpY2xlKSB7XHJcbiAgICAgICAgcGFydGljbGUuZGlyZWN0aW9uID0gcGFydGljbGUuZGlyZWN0aW9uIHx8IE1hdGgucmFuZG9tKCkgKiBNYXRoLlBJICogMjtcclxuICAgICAgICBwYXJ0aWNsZS56ZGlyZWN0aW9uID0gcGFydGljbGUuemRpcmVjdGlvbiB8fCBNYXRoLnJhbmRvbSgpICogTWF0aC5QSSAqIDJcclxuICAgICAgICBwYXJ0aWNsZS5zcGVlZCA9IHBhcnRpY2xlLnNwZWVkIHx8IDE7XHJcbiAgICAgICAgcGFydGljbGUudHVybiA9IE1hdGgucmFuZG9tKCkgLSAwLjU7XHJcbiAgICAgICAgcGFydGljbGUuenR1cm4gPSBNYXRoLnJhbmRvbSgpIC0gMC41O1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICB1cGRhdGUocGFydGljbGUpIHtcclxuICAgICAgICBwYXJ0aWNsZS5kaXJlY3Rpb24gKz0gcGFydGljbGUudHVybiAqIDAuMTtcclxuICAgICAgICBwYXJ0aWNsZS56ZGlyZWN0aW9uICs9IHBhcnRpY2xlLnp0dXJuICogMC41O1xyXG4gICAgICAgIHBhcnRpY2xlLnR1cm4gKz0gMC4xNSAqIChNYXRoLnJhbmRvbSgpIC0gMC41KTtcclxuICAgICAgICBpZiAocGFydGljbGUudHVybiA+IDEpIHBhcnRpY2xlLnR1cm4gPSAxO1xyXG4gICAgICAgIGlmIChwYXJ0aWNsZS50dXJuIDwgLTEpIHBhcnRpY2xlLnR1cm4gPSAtMTtcclxuICAgICAgICBwYXJ0aWNsZS56dHVybiArPSAwLjA1ICogKE1hdGgucmFuZG9tKCkgLSAwLjUpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHBhcnRpY2xlLnBvc2l0aW9uLnggKz0gTWF0aC5zaW4ocGFydGljbGUuZGlyZWN0aW9uKSAqIHBhcnRpY2xlLnNwZWVkO1xyXG4gICAgICAgIHBhcnRpY2xlLnBvc2l0aW9uLnkgKz0gTWF0aC5jb3MocGFydGljbGUuZGlyZWN0aW9uKSAqIHBhcnRpY2xlLnNwZWVkO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIEJVRyBQaXhpIHYzIHJjNCBQYXJ0aWNsZUNvbnRhaW5lciBub3QgYWxsb3dpbmcgc2NhbGUgYW5pbWF0aW9uXHJcbiAgICAgICAgbGV0IHpvZmYgPSBNYXRoLnNpbihwYXJ0aWNsZS56ZGlyZWN0aW9uKSAqIDAuMDU7XHJcbiAgICAgICAgcGFydGljbGUuc2NhbGUueCArPSB6b2ZmO1xyXG4gICAgICAgIHBhcnRpY2xlLnNjYWxlLnkgKz0gem9mZjtcclxuICAgIH1cclxufSIsImltcG9ydCBCZWhhdmlvciBmcm9tIFwiLi9CZWhhdmlvclwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV3JhcHBpbmdCb3VuZHNCZWhhdmlvciBleHRlbmRzIEJlaGF2aW9yIHtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih3aWR0aCwgaGVpZ2h0KSB7XHJcbiAgICAgICAgdGhpcy53aWR0aCA9IHdpZHRoO1xyXG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZShwYXJ0aWNsZSkge1xyXG4gICAgICAgIGlmIChwYXJ0aWNsZS5wb3NpdGlvbi54ID4gdGhpcy53aWR0aCkge1xyXG4gICAgICAgICAgICBwYXJ0aWNsZS5wb3NpdGlvbi54ID0gcGFydGljbGUucG9zaXRpb24ueCAtIHRoaXMud2lkdGg7XHJcbiAgICAgICAgfSBlbHNlIGlmIChwYXJ0aWNsZS5wb3NpdGlvbi54IDwgMCkge1xyXG4gICAgICAgICAgICBwYXJ0aWNsZS5wb3NpdGlvbi54ID0gcGFydGljbGUucG9zaXRpb24ueCArIHRoaXMud2lkdGg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGlmIChwYXJ0aWNsZS5wb3NpdGlvbi55ID4gdGhpcy5oZWlnaHQpIHtcclxuICAgICAgICAgICAgcGFydGljbGUucG9zaXRpb24ueSA9IHBhcnRpY2xlLnBvc2l0aW9uLnkgLSB0aGlzLmhlaWdodDtcclxuICAgICAgICB9IGVsc2UgaWYgKHBhcnRpY2xlLnBvc2l0aW9uLnkgPCAwKSB7XHJcbiAgICAgICAgICAgIHBhcnRpY2xlLnBvc2l0aW9uLnkgPSBwYXJ0aWNsZS5wb3NpdGlvbi55ICsgdGhpcy5oZWlnaHQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgTW9kZSB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLm5hbWUgPSBcIk5vbmVcIjtcclxuICAgICAgICB0aGlzLmRlc2NyaXB0aW9uID0gXCJDaG9vc2UgYSBkaWZmZXJlbnQgbW9kZS5cIjtcclxuICAgIH1cclxuICAgIFxyXG4gICAgc3RhcnQoKSB7fVxyXG4gICAgc3RvcCgpIHt9XHJcbiAgICBcclxuICAgIG9uY2xpY2soZSkge31cclxuICAgIG9ubW91c2Vkb3duKGUpIHt9XHJcbiAgICBvbm1vdXNlbW92ZShlKSB7fVxyXG4gICAgb25tb3VzZXVwKGUpIHt9XHJcbn0iLCJpbXBvcnQgTW9kZSBmcm9tIFwiLi9Nb2RlXCI7XHJcbmltcG9ydCBBcmVhU2lua0JlaGF2aW9yIGZyb20gXCIuLi9iZWhhdmlvcnMvQXJlYVNpbmtCZWhhdmlvclwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTW91c2VEcmF3QXJlYU1vZGUgZXh0ZW5kcyBNb2RlIHtcclxuICAgIGNvbnN0cnVjdG9yKHNpbmspIHtcclxuICAgICAgICB0aGlzLm5hbWUgPSBcIkRyYXdpbmdcIjtcclxuICAgICAgICB0aGlzLmRlc2NyaXB0aW9uID0gXCJDbGljayBhbmQgZHJhZyB0aGUgbW91c2UgdG8gc2V0IHRoZSBwYXRoIGZvciBwYXJ0aWNsZXMgdG8gZmlsbC5cIjtcclxuICAgICAgICB0aGlzLnNpbmsgPSBzaW5rO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuc3RhcnRlZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuYWN0aXZlID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgICAgICAgXHJcbiAgICBvbm1vdXNlZG93bihlKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnN0YXJ0ZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5zdGFydGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgLy8gQ2xlYXIgdGhlIGN1cnJlbnQgYXJlYSB0aGUgZmlyc3QgdGltZSBhcm91bmRcclxuICAgICAgICAgICAgdGhpcy5zaW5rLmFyZWEgPSBbXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5hY3RpdmUgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuYWRkUG9pbnQoZSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIG9ubW91c2Vtb3ZlKGUpIHtcclxuICAgICAgICBpZiAodGhpcy5hY3RpdmUpIHtcclxuICAgICAgICAgICAgdGhpcy5hZGRQb2ludChlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIG9ubW91c2V1cChlKSB7XHJcbiAgICAgICAgdGhpcy5hY3RpdmUgPSBmYWxzZTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgc3RvcCgpIHtcclxuICAgICAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuc3RhcnRlZCA9IGZhbHNlO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBhZGRQb2ludChlKSB7XHJcbiAgICAgICAgdGhpcy5zaW5rLmFyZWEucHVzaCh7eDogZS5jbGllbnRYLCB5OiBlLmNsaWVudFl9KTtcclxuICAgIH1cclxufSIsImltcG9ydCBNb2RlIGZyb20gXCIuL01vZGVcIjtcclxuaW1wb3J0IEFyZWFTaW5rQmVoYXZpb3IgZnJvbSBcIi4uL2JlaGF2aW9ycy9BcmVhU2lua0JlaGF2aW9yXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSYW5kb21BcmVhUmVzZXRNb2RlIGV4dGVuZHMgTW9kZSB7XHJcbiAgICBjb25zdHJ1Y3RvcihzaW5rKSB7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gXCJSYW5kb20gUmVjdFwiO1xyXG4gICAgICAgIHRoaXMuZGVzY3JpcHRpb24gPSBcIkNsaWNrIGFueXdoZXJlIHRvIHJhbmRvbWx5IHJlc2V0IHRoZSB0YXJnZXQgc2hhcGUuXCI7XHJcbiAgICAgICAgdGhpcy5zaW5rID0gc2luaztcclxuICAgIH1cclxuICAgIFxyXG4gICAgb25jbGljayhlKSB7XHJcbiAgICAgICAgdGhpcy5zaW5rLmFyZWEgPSBBcmVhU2lua0JlaGF2aW9yLlJlY3RhbmdsZShcclxuICAgICAgICAgICAgICAgIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICh3aW5kb3cuaW5uZXJXaWR0aCAvIDIpKSwgXHJcbiAgICAgICAgICAgICAgICBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAod2luZG93LmlubmVySGVpZ2h0IC8gMikpLCBcclxuICAgICAgICAgICAgICAgIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICh3aW5kb3cuaW5uZXJXaWR0aCAvIDMpKSwgXHJcbiAgICAgICAgICAgICAgICBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAod2luZG93LmlubmVySGVpZ2h0IC8gMykpKS5hcmVhO1xyXG4gICAgfVxyXG59Il19
