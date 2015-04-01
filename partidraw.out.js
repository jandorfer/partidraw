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
        this.setupToggles();
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
        setupToggles: {
            value: function setupToggles() {
                var _this = this;

                var root = document.getElementById("toggles");
                if (!root) {
                    return;
                }var link = document.createElement("a");
                link.setAttribute("href", "#");
                link.onclick = function (e) {
                    e.stopPropagation();
                    _this.areaSink.area = AreaSinkBehavior.Rectangle(0, 0, window.innerWidth, window.innerHeight).area;
                };
                link.appendChild(document.createTextNode("reset"));
                root.appendChild(link);

                var link2 = document.createElement("a");
                link2.setAttribute("href", "#");
                link2.onclick = function (e) {
                    e.stopPropagation();
                    _this.firefly.enabled = !_this.firefly.enabled;
                    link2.innerHTML = "firefly " + (_this.firefly.enabled ? "on" : "off");
                };
                link2.innerHTML = "firefly " + (this.firefly.enabled ? "on" : "off");
                root.appendChild(link2);

                var link3 = document.createElement("a");
                link3.setAttribute("href", "#");
                link3.onclick = function (e) {
                    e.stopPropagation();
                    _this.boundsWrapping.enabled = !_this.boundsWrapping.enabled;
                    link3.innerHTML = "wrapping " + (_this.boundsWrapping.enabled ? "on" : "off");
                };
                link3.innerHTML = "wrapping " + (this.boundsWrapping.enabled ? "on" : "off");
                root.appendChild(link3);
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

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Behavior = _interopRequire(require("./Behavior"));

var AreaSinkBehavior = (function (_Behavior) {
    function AreaSinkBehavior(area) {
        _classCallCheck(this, AreaSinkBehavior);

        _get(Object.getPrototypeOf(AreaSinkBehavior.prototype), "constructor", this).call(this);
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
                if (!this.enabled) {
                    return;
                }var pos = Math.floor(this.area.length * particle.percentIndex);
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

        this.enabled = true;
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
                if (!this.enabled) {
                    return;
                }particle.direction += particle.turn * 0.1;
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

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Behavior = _interopRequire(require("./Behavior"));

var WrappingBoundsBehavior = (function (_Behavior) {
    function WrappingBoundsBehavior(width, height) {
        _classCallCheck(this, WrappingBoundsBehavior);

        _get(Object.getPrototypeOf(WrappingBoundsBehavior.prototype), "constructor", this).call(this);
        this.width = width;
        this.height = height;
    }

    _inherits(WrappingBoundsBehavior, _Behavior);

    _createClass(WrappingBoundsBehavior, {
        update: {
            value: function update(particle) {
                if (!this.enabled) {
                    return;
                }if (particle.position.x > this.width) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJEOi9kZXYvcGFydGlkcmF3L3NyYy9wYXJ0aWRyYXcuanMiLCJEOi9kZXYvcGFydGlkcmF3L3NyYy9QYXJ0aWNsZVNjZW5lLmpzIiwiRDovZGV2L3BhcnRpZHJhdy9zcmMvYmVoYXZpb3JzL0FyZWFTaW5rQmVoYXZpb3IuanMiLCJEOi9kZXYvcGFydGlkcmF3L3NyYy9iZWhhdmlvcnMvQmVoYXZpb3IuanMiLCJEOi9kZXYvcGFydGlkcmF3L3NyYy9iZWhhdmlvcnMvRmlyZWZseUJlaGF2aW9yLmpzIiwiRDovZGV2L3BhcnRpZHJhdy9zcmMvYmVoYXZpb3JzL1dyYXBwaW5nQm91bmRzQmVoYXZpb3IuanMiLCJEOi9kZXYvcGFydGlkcmF3L3NyYy9tb2Rlcy9Nb2RlLmpzIiwiRDovZGV2L3BhcnRpZHJhdy9zcmMvbW9kZXMvTW91c2VEcmF3QXJlYU1vZGUuanMiLCJEOi9kZXYvcGFydGlkcmF3L3NyYy9tb2Rlcy9SYW5kb21BcmVhUmVzZXRNb2RlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7SUNBTyxhQUFhLDJCQUFNLGlCQUFpQjs7SUFDcEMsZ0JBQWdCLDJCQUFNLDhCQUE4Qjs7SUFDcEQsZUFBZSwyQkFBTSw2QkFBNkI7O0lBQ2xELHNCQUFzQiwyQkFBTSxvQ0FBb0M7O0lBRWhFLElBQUksMkJBQU0sY0FBYzs7SUFDeEIsaUJBQWlCLDJCQUFNLDJCQUEyQjs7SUFDbEQsbUJBQW1CLDJCQUFNLDZCQUE2Qjs7QUFFN0QsSUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDOztJQUV0QixlQUFlO0FBQ04sYUFEVCxlQUFlLENBQ0wsS0FBSyxFQUFFOzhCQURqQixlQUFlOztBQUViLFlBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDOztBQUVuQixZQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7QUFDbEIsWUFBSSxDQUFDLGFB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QUFtQjtBQU9wQyxlQUFPO21CQUFBLGlCQUFDLENBQUMsRUFBRTtBQUNQLG9CQUFJLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxnQkFBZ0IsQ0FBQyxTQUFTLENBQ25DLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLE1BQU0sQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFBLEFBQUMsQ0FBQyxFQUNuRCxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxNQUFNLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQSxBQUFDLENBQUMsRUFDcEQsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksTUFBTSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUEsQUFBQyxDQUFDLEVBQ25ELElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLE1BQU0sQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFBLEFBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO2FBQ3RFOzs7O1dBYmdCLG1CQUFtQjtHQUFTLElBQUk7O2lCQUFoQyxtQkFBbUIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IFBhcnRpY2xlU2NlbmUgZnJvbSBcIi4vUGFydGljbGVTY2VuZVwiO1xyXG5pbXBvcnQgQXJlYVNpbmtCZWhhdmlvciBmcm9tIFwiLi9iZWhhdmlvcnMvQXJlYVNpbmtCZWhhdmlvclwiO1xyXG5pbXBvcnQgRmlyZWZseUJlaGF2aW9yIGZyb20gXCIuL2JlaGF2aW9ycy9GaXJlZmx5QmVoYXZpb3JcIjtcclxuaW1wb3J0IFdyYXBwaW5nQm91bmRzQmVoYXZpb3IgZnJvbSBcIi4vYmVoYXZpb3JzL1dyYXBwaW5nQm91bmRzQmVoYXZpb3JcIjtcclxuXHJcbmltcG9ydCBNb2RlIGZyb20gXCIuL21vZGVzL01vZGVcIjtcclxuaW1wb3J0IE1vdXNlRHJhd0FyZWFNb2RlIGZyb20gXCIuL21vZGVzL01vdXNlRHJhd0FyZWFNb2RlXCI7XHJcbmltcG9ydCBSYW5kb21BcmVhUmVzZXRNb2RlIGZyb20gXCIuL21vZGVzL1JhbmRvbUFyZWFSZXNldE1vZGVcIjtcclxuXHJcbmNvbnN0IFBBUlRJQ0xFX0NPVU5UID0gMTUwMDtcclxuXHJcbmNsYXNzIFBhcnRpY2xlRHJhd2luZyB7XHJcbiAgICBjb25zdHJ1Y3Rvcihjb3VudCkge1xyXG4gICAgICAgIHRoaXMuY291bnQgPSBjb3VudDtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnNldHVwU2NlbmUoKTtcclxuICAgICAgICB0aGlzLnNldHVwUmVuZGVyZXIoKTtcclxuICAgICAgICB0aGlzLnNldHVwTW9kZXMoKTtcclxuICAgICAgICB0aGlzLnNldHVwVG9nZ2xlcygpO1xyXG4gICAgICAgIHRoaXMuc2V0dXBSZXNpemUoKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnRpY2soKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgc2V0dXBTY2VuZSgpIHtcclxuICAgICAgICB0aGlzLmZpcmVmbHkgPSBuZXcgRmlyZWZseUJlaGF2aW9yKCk7XHJcbiAgICAgICAgdGhpcy5ib3VuZHNXcmFwcGluZyA9IG5ldyBXcmFwcGluZ0JvdW5kc0JlaGF2aW9yKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xyXG4gICAgICAgIHRoaXMuYXJlYVNpbmsgPSBBcmVhU2lua0JlaGF2aW9yLlJlY3RhbmdsZSgwLCAwLCB3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KTtcclxuXHRcclxuICAgICAgICB0aGlzLnNjZW5lID0gbmV3IFBhcnRpY2xlU2NlbmUoXHJcbiAgICAgICAgICAgIHRoaXMuY291bnQsIFxyXG4gICAgICAgICAgICB0aGlzLmZpcmVmbHksIFxyXG4gICAgICAgICAgICB0aGlzLmFyZWFTaW5rLFxyXG4gICAgICAgICAgICB0aGlzLmJvdW5kc1dyYXBwaW5nKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgc2V0dXBSZW5kZXJlcigpIHtcclxuICAgICAgICB0aGlzLnJlbmRlcmVyID0gUElYSS5hdXRvRGV0ZWN0UmVuZGVyZXIod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XHJcbiAgICAgICAgdGhpcy5yZW5kZXJlci52aWV3LnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xyXG4gICAgICAgIHRoaXMucmVuZGVyZXIudmlldy5zdHlsZS5sZWZ0ID0gXCIwXCI7XHJcbiAgICAgICAgdGhpcy5yZW5kZXJlci52aWV3LnN0eWxlLnRvcCA9IFwiMFwiO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5yZW5kZXJlci52aWV3KTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgc2V0dXBNb2RlcygpIHtcclxuICAgICAgICB0aGlzLm1vZGUgPSAxO1xyXG4gICAgICAgIHRoaXMubW9kZXMgPSBbXHJcbiAgICAgICAgICAgIG5ldyBNb2RlKCksXHJcbiAgICAgICAgICAgIG5ldyBSYW5kb21BcmVhUmVzZXRNb2RlKHRoaXMuYXJlYVNpbmspLFxyXG4gICAgICAgICAgICBuZXcgTW91c2VEcmF3QXJlYU1vZGUodGhpcy5hcmVhU2luaylcclxuICAgICAgICBdO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHdpbmRvdy5vbmNsaWNrID0gKGUpID0+IHsgdGhpcy5tb2Rlc1t0aGlzLm1vZGVdLm9uY2xpY2soZSk7IH1cclxuICAgICAgICB3aW5kb3cub25tb3VzZWRvd24gPSAoZSkgPT4geyB0aGlzLm1vZGVzW3RoaXMubW9kZV0ub25tb3VzZWRvd24oZSk7IH1cclxuICAgICAgICB3aW5kb3cub25tb3VzZW1vdmUgPSAoZSkgPT4geyB0aGlzLm1vZGVzW3RoaXMubW9kZV0ub25tb3VzZW1vdmUoZSk7IH1cclxuICAgICAgICB3aW5kb3cub25tb3VzZXVwID0gKGUpID0+IHsgdGhpcy5tb2Rlc1t0aGlzLm1vZGVdLm9ubW91c2V1cChlKTsgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuc2V0dXBNb2RlU3dpdGNoZXIoKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgc2V0dXBNb2RlU3dpdGNoZXIoKSB7XHJcbiAgICAgICAgbGV0IHJvb3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1vZGUtc3dpdGNoZXJcIik7XHJcbiAgICAgICAgbGV0IGRlc2MgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1vZGUtZGVzY1wiKTtcclxuICAgICAgICBpZiAoIXJvb3QpIHJldHVybjtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgc2VsZWN0ZWQgPSBudWxsO1xyXG4gICAgICAgIGZvciAobGV0IGk9MDsgaTx0aGlzLm1vZGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xyXG4gICAgICAgICAgICBsaW5rLnNldEF0dHJpYnV0ZShcImhyZWZcIiwgXCIjXCIpO1xyXG4gICAgICAgICAgICBsaW5rLm9uY2xpY2sgPSAoZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgICAgICAgIGlmIChzZWxlY3RlZCkgc2VsZWN0ZWQuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICAgICBzZWxlY3RlZCA9IGxpbms7XHJcbiAgICAgICAgICAgICAgICBsaW5rLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGRlc2MpIGRlc2MuaW5uZXJIVE1MID0gdGhpcy5tb2Rlc1tpXS5kZXNjcmlwdGlvbjtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3dpdGNoTW9kZShpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5tb2RlID09PSBpKSB7XHJcbiAgICAgICAgICAgICAgICBsaW5rLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGRlc2MpIGRlc2MuaW5uZXJIVE1MID0gdGhpcy5tb2Rlc1tpXS5kZXNjcmlwdGlvbjtcclxuICAgICAgICAgICAgICAgIHNlbGVjdGVkID0gbGluaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsaW5rLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRoaXMubW9kZXNbaV0ubmFtZSkpO1xyXG4gICAgICAgICAgICByb290LmFwcGVuZENoaWxkKGxpbmspO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgc2V0dXBUb2dnbGVzKCkge1xyXG4gICAgICAgIGxldCByb290ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0b2dnbGVzXCIpO1xyXG4gICAgICAgIGlmICghcm9vdCkgcmV0dXJuO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xyXG4gICAgICAgIGxpbmsuc2V0QXR0cmlidXRlKFwiaHJlZlwiLCBcIiNcIik7XHJcbiAgICAgICAgbGluay5vbmNsaWNrID0gKGUpID0+IHtcclxuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgICAgdGhpcy5hcmVhU2luay5hcmVhID0gQXJlYVNpbmtCZWhhdmlvci5SZWN0YW5nbGUoMCwgMCwgd2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCkuYXJlYTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGluay5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcInJlc2V0XCIpKTtcclxuICAgICAgICByb290LmFwcGVuZENoaWxkKGxpbmspO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBsaW5rMiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcclxuICAgICAgICBsaW5rMi5zZXRBdHRyaWJ1dGUoXCJocmVmXCIsIFwiI1wiKTtcclxuICAgICAgICBsaW5rMi5vbmNsaWNrID0gKGUpID0+IHtcclxuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgICAgdGhpcy5maXJlZmx5LmVuYWJsZWQgPSAhdGhpcy5maXJlZmx5LmVuYWJsZWQ7XHJcbiAgICAgICAgICAgIGxpbmsyLmlubmVySFRNTCA9IFwiZmlyZWZseSBcIiArICh0aGlzLmZpcmVmbHkuZW5hYmxlZCA/IFwib25cIiA6IFwib2ZmXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsaW5rMi5pbm5lckhUTUwgPSBcImZpcmVmbHkgXCIgKyAodGhpcy5maXJlZmx5LmVuYWJsZWQgPyBcIm9uXCIgOiBcIm9mZlwiKTtcclxuICAgICAgICByb290LmFwcGVuZENoaWxkKGxpbmsyKTtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgbGluazMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XHJcbiAgICAgICAgbGluazMuc2V0QXR0cmlidXRlKFwiaHJlZlwiLCBcIiNcIik7XHJcbiAgICAgICAgbGluazMub25jbGljayA9IChlKSA9PiB7XHJcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgIHRoaXMuYm91bmRzV3JhcHBpbmcuZW5hYmxlZCA9ICF0aGlzLmJvdW5kc1dyYXBwaW5nLmVuYWJsZWQ7XHJcbiAgICAgICAgICAgIGxpbmszLmlubmVySFRNTCA9IFwid3JhcHBpbmcgXCIgKyAodGhpcy5ib3VuZHNXcmFwcGluZy5lbmFibGVkID8gXCJvblwiIDogXCJvZmZcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxpbmszLmlubmVySFRNTCA9IFwid3JhcHBpbmcgXCIgKyAodGhpcy5ib3VuZHNXcmFwcGluZy5lbmFibGVkID8gXCJvblwiIDogXCJvZmZcIik7XHJcbiAgICAgICAgcm9vdC5hcHBlbmRDaGlsZChsaW5rMyk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHNldHVwUmVzaXplKCkge1xyXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLnJlc2l6ZSk7XHJcbiAgICAgICAgd2luZG93Lm9ub3JpZW50YXRpb25jaGFuZ2UgPSB0aGlzLnJlc2l6ZTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcmVzaXplKCkge1xyXG4gICAgICAgIGxldCB3aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoLCBoZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7IFxyXG5cdFx0dGhpcy5ib3VuZHNXcmFwcGluZy53aWR0aCA9IHdpZHRoO1xyXG5cdFx0dGhpcy5ib3VuZHNXcmFwcGluZy5oZWlnaHQgPSBoZWlnaHQ7XHJcbiAgICAgICAgdGhpcy5yZW5kZXJlci52aWV3LnN0eWxlLndpZHRoID0gd2lkdGggKyBcInB4XCJcclxuICAgICAgICB0aGlzLnJlbmRlcmVyLnZpZXcuc3R5bGUuaGVpZ2h0ID0gaGVpZ2h0ICsgXCJweFwiXHJcbiAgICAgICAgdGhpcy5yZW5kZXJlci5yZXNpemUod2lkdGgsIGhlaWdodCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHRpY2soKSB7XHJcbiAgICAgICAgdGhpcy5zY2VuZS51cGRhdGUoKTtcclxuICAgICAgICB0aGlzLnJlbmRlcmVyLnJlbmRlcih0aGlzLnNjZW5lLmNvbnRhaW5lcik7XHJcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMudGljay5iaW5kKHRoaXMpKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgc3dpdGNoTW9kZShtb2RlLCBlKSB7XHJcbiAgICAgICAgaWYgKG1vZGUgPCAwIHx8IG1vZGUgPiB0aGlzLm1vZGVzLmxlbmd0aCkgcmV0dXJuO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMubW9kZXNbdGhpcy5tb2RlXS5zdG9wKCk7XHJcbiAgICAgICAgdGhpcy5tb2RlID0gbW9kZTtcclxuICAgICAgICB0aGlzLm1vZGVzW3RoaXMubW9kZV0uc3RhcnQoKTtcclxuICAgIH1cclxufVxyXG5cclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IG5ldyBQYXJ0aWNsZURyYXdpbmcoUEFSVElDTEVfQ09VTlQpKTtcclxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGFydGljbGVTY2VuZSB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoY291bnQsIC4uLmJlaGF2aW9ycykge1xyXG4gICAgICAgIHRoaXMucGFydGljbGVzID0gW107XHJcbiAgICAgICAgdGhpcy5iZWhhdmlvcnMgPSBiZWhhdmlvcnM7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIgPSBuZXcgUElYSS5QYXJ0aWNsZUNvbnRhaW5lcihjb3VudCwgW3RydWUsIHRydWUsIGZhbHNlLCB0cnVlLCB0cnVlXSk7XHJcbiAgICAgICAgdGhpcy50ZXh0dXJlID0gbmV3IFBJWEkuVGV4dHVyZS5mcm9tSW1hZ2UoXCJzcHJpdGUucG5nXCIpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGZvciAobGV0IGk9MDsgaTxjb3VudDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBwYXJ0aWNsZSA9IG5ldyBQSVhJLlNwcml0ZSh0aGlzLnRleHR1cmUpO1xyXG4gICAgICAgICAgICBwYXJ0aWNsZS5hbmNob3Iuc2V0KDAuNSk7XHJcbiAgICAgICAgICAgIHBhcnRpY2xlLnNjYWxlLnggPSAwLjI7XHJcbiAgICAgICAgICAgIHBhcnRpY2xlLnNjYWxlLnkgPSAwLjI7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvLyBCVUcgUGl4aSB2MyByYzQgUGFydGljbGVDb250YWluZXIgZG9lc24ndCBzdXBwb3J0IHRyYW5zcGFyZW5jeSBhdCBhbGxcclxuICAgICAgICAgICAgcGFydGljbGUuYWxwaGEgPSAwLjY7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBmb3IgKGxldCBqPTA7IGo8YmVoYXZpb3JzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICBiZWhhdmlvcnNbal0uaW5pdGlhbGl6ZShwYXJ0aWNsZSwgaSwgY291bnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLnBhcnRpY2xlcy5wdXNoKHBhcnRpY2xlKTtcclxuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuYWRkQ2hpbGQocGFydGljbGUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgdXBkYXRlKCkge1xyXG4gICAgICAgIGZvciAobGV0IGk9MDsgaTx0aGlzLnBhcnRpY2xlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBqPTA7IGo8dGhpcy5iZWhhdmlvcnMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYmVoYXZpb3JzW2pdLnVwZGF0ZSh0aGlzLnBhcnRpY2xlc1tpXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgQmVoYXZpb3IgZnJvbSBcIi4vQmVoYXZpb3JcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFyZWFTaW5rQmVoYXZpb3IgZXh0ZW5kcyBCZWhhdmlvciB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoYXJlYSkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5hcmVhID0gYXJlYTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0aWFsaXplKHBhcnRpY2xlLCBpbmRleCwgY291bnQpIHtcclxuICAgICAgICBwYXJ0aWNsZS5wZXJjZW50SW5kZXggPSAoMS4wICogaW5kZXgpIC8gKDEuMCAqIGNvdW50KTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgdXBkYXRlKHBhcnRpY2xlKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmVuYWJsZWQpIHJldHVybjtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgcG9zID0gTWF0aC5mbG9vcih0aGlzLmFyZWEubGVuZ3RoICogcGFydGljbGUucGVyY2VudEluZGV4KTtcclxuICAgICAgICBsZXQgc2luayA9IHRoaXMuYXJlYVtwb3NdO1xyXG4gICAgICAgIGxldCBkaXJlY3Rpb24gPSBNYXRoLmF0YW4yKHNpbmsueCAtIHBhcnRpY2xlLnBvc2l0aW9uLngsIHNpbmsueSAtIHBhcnRpY2xlLnBvc2l0aW9uLnkpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBzcGVlZCA9IHBhcnRpY2xlLnNwZWVkO1xyXG4gICAgICAgIGlmIChzcGVlZCA8PSAwKSBzcGVlZCA9IDAuMTtcclxuICAgICAgICBzcGVlZCA9IHNwZWVkICogKDAuMSAqIE1hdGguc3FydChNYXRoLnBvdyhzaW5rLnggLSBwYXJ0aWNsZS5wb3NpdGlvbi54LCAyKSwgTWF0aC5wb3coc2luay55IC0gcGFydGljbGUucG9zaXRpb24ueSkpKTtcclxuICAgICAgICBcclxuICAgICAgICBwYXJ0aWNsZS5wb3NpdGlvbi54ICs9IE1hdGguc2luKGRpcmVjdGlvbikgKiBzcGVlZDtcclxuICAgICAgICBwYXJ0aWNsZS5wb3NpdGlvbi55ICs9IE1hdGguY29zKGRpcmVjdGlvbikgKiBzcGVlZDtcclxuICAgIH1cclxuICAgICAgICBcclxuICAgIHN0YXRpYyBzaHVmZmxlKGFycmF5KSB7XHJcbiAgICAgICAgdmFyIGN1cnJlbnRJbmRleCA9IGFycmF5Lmxlbmd0aCwgdGVtcG9yYXJ5VmFsdWUsIHJhbmRvbUluZGV4IDtcclxuXHJcbiAgICAgICAgd2hpbGUgKDAgIT09IGN1cnJlbnRJbmRleCkge1xyXG4gICAgICAgICAgICByYW5kb21JbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGN1cnJlbnRJbmRleCk7XHJcbiAgICAgICAgICAgIGN1cnJlbnRJbmRleCAtPSAxO1xyXG5cclxuICAgICAgICAgICAgdGVtcG9yYXJ5VmFsdWUgPSBhcnJheVtjdXJyZW50SW5kZXhdO1xyXG4gICAgICAgICAgICBhcnJheVtjdXJyZW50SW5kZXhdID0gYXJyYXlbcmFuZG9tSW5kZXhdO1xyXG4gICAgICAgICAgICBhcnJheVtyYW5kb21JbmRleF0gPSB0ZW1wb3JhcnlWYWx1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBhcnJheTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgc3RhdGljIFJlY3RhbmdsZSh4LCB5LCB3aWR0aCwgaGVpZ2h0KSB7XHJcbiAgICAgICAgaWYgKHdpZHRoIDw9IDApIHdpZHRoID0gMTtcclxuICAgICAgICBpZiAoaGVpZ2h0IDw9IDApIGhlaWdodCA9IDE7XHJcbiAgICAgICAgbGV0IGFyZWEgPSBuZXcgQXJyYXkod2lkdGggKiBoZWlnaHQpO1xyXG4gICAgICAgIGZvciAobGV0IGk9MDsgaTx3aWR0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGo9MDsgajxoZWlnaHQ7IGorKykge1xyXG4gICAgICAgICAgICAgICAgYXJlYVtqICogd2lkdGggKyBpXSA9IHt4OiB4ICsgaSwgeTogeSArIGp9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGFyZWEgPSBBcmVhU2lua0JlaGF2aW9yLnNodWZmbGUoYXJlYSk7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBBcmVhU2lua0JlaGF2aW9yKGFyZWEpO1xyXG4gICAgfVxyXG59IiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmVoYXZpb3Ige1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5lbmFibGVkID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0aWFsaXplKHBhcnRpY2xlKSB7fVxyXG4gICAgXHJcbiAgICB1cGRhdGUocGFydGljbGUpIHt9XHJcbn0iLCJpbXBvcnQgQmVoYXZpb3IgZnJvbSBcIi4vQmVoYXZpb3JcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZpcmVmbHlCZWhhdmlvciBleHRlbmRzIEJlaGF2aW9yIHtcclxuXHJcbiAgICBpbml0aWFsaXplKHBhcnRpY2xlKSB7XHJcbiAgICAgICAgcGFydGljbGUuZGlyZWN0aW9uID0gcGFydGljbGUuZGlyZWN0aW9uIHx8IE1hdGgucmFuZG9tKCkgKiBNYXRoLlBJICogMjtcclxuICAgICAgICBwYXJ0aWNsZS56ZGlyZWN0aW9uID0gcGFydGljbGUuemRpcmVjdGlvbiB8fCBNYXRoLnJhbmRvbSgpICogTWF0aC5QSSAqIDJcclxuICAgICAgICBwYXJ0aWNsZS5zcGVlZCA9IHBhcnRpY2xlLnNwZWVkIHx8IDE7XHJcbiAgICAgICAgcGFydGljbGUudHVybiA9IE1hdGgucmFuZG9tKCkgLSAwLjU7XHJcbiAgICAgICAgcGFydGljbGUuenR1cm4gPSBNYXRoLnJhbmRvbSgpIC0gMC41O1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICB1cGRhdGUocGFydGljbGUpIHtcclxuICAgICAgICBpZiAoIXRoaXMuZW5hYmxlZCkgcmV0dXJuO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHBhcnRpY2xlLmRpcmVjdGlvbiArPSBwYXJ0aWNsZS50dXJuICogMC4xO1xyXG4gICAgICAgIHBhcnRpY2xlLnpkaXJlY3Rpb24gKz0gcGFydGljbGUuenR1cm4gKiAwLjU7XHJcbiAgICAgICAgcGFydGljbGUudHVybiArPSAwLjE1ICogKE1hdGgucmFuZG9tKCkgLSAwLjUpO1xyXG4gICAgICAgIGlmIChwYXJ0aWNsZS50dXJuID4gMSkgcGFydGljbGUudHVybiA9IDE7XHJcbiAgICAgICAgaWYgKHBhcnRpY2xlLnR1cm4gPCAtMSkgcGFydGljbGUudHVybiA9IC0xO1xyXG4gICAgICAgIHBhcnRpY2xlLnp0dXJuICs9IDAuMDUgKiAoTWF0aC5yYW5kb20oKSAtIDAuNSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcGFydGljbGUucG9zaXRpb24ueCArPSBNYXRoLnNpbihwYXJ0aWNsZS5kaXJlY3Rpb24pICogcGFydGljbGUuc3BlZWQ7XHJcbiAgICAgICAgcGFydGljbGUucG9zaXRpb24ueSArPSBNYXRoLmNvcyhwYXJ0aWNsZS5kaXJlY3Rpb24pICogcGFydGljbGUuc3BlZWQ7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gQlVHIFBpeGkgdjMgcmM0IFBhcnRpY2xlQ29udGFpbmVyIG5vdCBhbGxvd2luZyBzY2FsZSBhbmltYXRpb25cclxuICAgICAgICBsZXQgem9mZiA9IE1hdGguc2luKHBhcnRpY2xlLnpkaXJlY3Rpb24pICogMC4wNTtcclxuICAgICAgICBwYXJ0aWNsZS5zY2FsZS54ICs9IHpvZmY7XHJcbiAgICAgICAgcGFydGljbGUuc2NhbGUueSArPSB6b2ZmO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IEJlaGF2aW9yIGZyb20gXCIuL0JlaGF2aW9yXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXcmFwcGluZ0JvdW5kc0JlaGF2aW9yIGV4dGVuZHMgQmVoYXZpb3Ige1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHdpZHRoLCBoZWlnaHQpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMud2lkdGggPSB3aWR0aDtcclxuICAgICAgICB0aGlzLmhlaWdodCA9IGhlaWdodDtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUocGFydGljbGUpIHtcclxuICAgICAgICBpZiAoIXRoaXMuZW5hYmxlZCkgcmV0dXJuO1xyXG4gICAgXHJcbiAgICAgICAgaWYgKHBhcnRpY2xlLnBvc2l0aW9uLnggPiB0aGlzLndpZHRoKSB7XHJcbiAgICAgICAgICAgIHBhcnRpY2xlLnBvc2l0aW9uLnggPSBwYXJ0aWNsZS5wb3NpdGlvbi54IC0gdGhpcy53aWR0aDtcclxuICAgICAgICB9IGVsc2UgaWYgKHBhcnRpY2xlLnBvc2l0aW9uLnggPCAwKSB7XHJcbiAgICAgICAgICAgIHBhcnRpY2xlLnBvc2l0aW9uLnggPSBwYXJ0aWNsZS5wb3NpdGlvbi54ICsgdGhpcy53aWR0aDtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKHBhcnRpY2xlLnBvc2l0aW9uLnkgPiB0aGlzLmhlaWdodCkge1xyXG4gICAgICAgICAgICBwYXJ0aWNsZS5wb3NpdGlvbi55ID0gcGFydGljbGUucG9zaXRpb24ueSAtIHRoaXMuaGVpZ2h0O1xyXG4gICAgICAgIH0gZWxzZSBpZiAocGFydGljbGUucG9zaXRpb24ueSA8IDApIHtcclxuICAgICAgICAgICAgcGFydGljbGUucG9zaXRpb24ueSA9IHBhcnRpY2xlLnBvc2l0aW9uLnkgKyB0aGlzLmhlaWdodDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBNb2RlIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMubmFtZSA9IFwiTm9uZVwiO1xyXG4gICAgICAgIHRoaXMuZGVzY3JpcHRpb24gPSBcIkNob29zZSBhIGRpZmZlcmVudCBtb2RlLlwiO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBzdGFydCgpIHt9XHJcbiAgICBzdG9wKCkge31cclxuICAgIFxyXG4gICAgb25jbGljayhlKSB7fVxyXG4gICAgb25tb3VzZWRvd24oZSkge31cclxuICAgIG9ubW91c2Vtb3ZlKGUpIHt9XHJcbiAgICBvbm1vdXNldXAoZSkge31cclxufSIsImltcG9ydCBNb2RlIGZyb20gXCIuL01vZGVcIjtcclxuaW1wb3J0IEFyZWFTaW5rQmVoYXZpb3IgZnJvbSBcIi4uL2JlaGF2aW9ycy9BcmVhU2lua0JlaGF2aW9yXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNb3VzZURyYXdBcmVhTW9kZSBleHRlbmRzIE1vZGUge1xyXG4gICAgY29uc3RydWN0b3Ioc2luaykge1xyXG4gICAgICAgIHRoaXMubmFtZSA9IFwiRHJhd2luZ1wiO1xyXG4gICAgICAgIHRoaXMuZGVzY3JpcHRpb24gPSBcIkNsaWNrIGFuZCBkcmFnIHRoZSBtb3VzZSB0byBzZXQgdGhlIHBhdGggZm9yIHBhcnRpY2xlcyB0byBmaWxsLlwiO1xyXG4gICAgICAgIHRoaXMuc2luayA9IHNpbms7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5zdGFydGVkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5hY3RpdmUgPSBmYWxzZTtcclxuICAgIH1cclxuICAgICAgICBcclxuICAgIG9ubW91c2Vkb3duKGUpIHtcclxuICAgICAgICBpZiAoIXRoaXMuc3RhcnRlZCkge1xyXG4gICAgICAgICAgICB0aGlzLnN0YXJ0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAvLyBDbGVhciB0aGUgY3VycmVudCBhcmVhIHRoZSBmaXJzdCB0aW1lIGFyb3VuZFxyXG4gICAgICAgICAgICB0aGlzLnNpbmsuYXJlYSA9IFtdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmFjdGl2ZSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5hZGRQb2ludChlKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgb25tb3VzZW1vdmUoZSkge1xyXG4gICAgICAgIGlmICh0aGlzLmFjdGl2ZSkge1xyXG4gICAgICAgICAgICB0aGlzLmFkZFBvaW50KGUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgb25tb3VzZXVwKGUpIHtcclxuICAgICAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBzdG9wKCkge1xyXG4gICAgICAgIHRoaXMuYWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5zdGFydGVkID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGFkZFBvaW50KGUpIHtcclxuICAgICAgICB0aGlzLnNpbmsuYXJlYS5wdXNoKHt4OiBlLmNsaWVudFgsIHk6IGUuY2xpZW50WX0pO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IE1vZGUgZnJvbSBcIi4vTW9kZVwiO1xyXG5pbXBvcnQgQXJlYVNpbmtCZWhhdmlvciBmcm9tIFwiLi4vYmVoYXZpb3JzL0FyZWFTaW5rQmVoYXZpb3JcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJhbmRvbUFyZWFSZXNldE1vZGUgZXh0ZW5kcyBNb2RlIHtcclxuICAgIGNvbnN0cnVjdG9yKHNpbmspIHtcclxuICAgICAgICB0aGlzLm5hbWUgPSBcIlJhbmRvbSBSZWN0XCI7XHJcbiAgICAgICAgdGhpcy5kZXNjcmlwdGlvbiA9IFwiQ2xpY2sgYW55d2hlcmUgdG8gcmFuZG9tbHkgcmVzZXQgdGhlIHRhcmdldCBzaGFwZS5cIjtcclxuICAgICAgICB0aGlzLnNpbmsgPSBzaW5rO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBvbmNsaWNrKGUpIHtcclxuICAgICAgICB0aGlzLnNpbmsuYXJlYSA9IEFyZWFTaW5rQmVoYXZpb3IuUmVjdGFuZ2xlKFxyXG4gICAgICAgICAgICAgICAgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKHdpbmRvdy5pbm5lcldpZHRoIC8gMikpLCBcclxuICAgICAgICAgICAgICAgIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICh3aW5kb3cuaW5uZXJIZWlnaHQgLyAyKSksIFxyXG4gICAgICAgICAgICAgICAgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKHdpbmRvdy5pbm5lcldpZHRoIC8gMykpLCBcclxuICAgICAgICAgICAgICAgIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICh3aW5kb3cuaW5uZXJIZWlnaHQgLyAzKSkpLmFyZWE7XHJcbiAgICB9XHJcbn0iXX0=
