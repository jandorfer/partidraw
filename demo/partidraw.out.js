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

},{"./ParticleScene":2,"./behaviors/AreaSinkBehavior":3,"./behaviors/FireflyBehavior":5,"./behaviors/WrappingBoundsBehavior":6,"./modes/Mode":8,"./modes/MouseDrawAreaMode":9,"./modes/RandomAreaResetMode":10}],2:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Particle = _interopRequire(require("./graphics/particle"));

var ParticleScene = (function () {
    function ParticleScene(count) {
        for (var _len = arguments.length, behaviors = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            behaviors[_key - 1] = arguments[_key];
        }

        _classCallCheck(this, ParticleScene);

        this.particles = [];
        this.behaviors = behaviors;
        this.container = new PIXI.DisplayObjectContainer();

        for (var i = 0; i < count; i++) {
            var particle = new Particle({ color: 16777215, alpha: Math.random(), x: 0, y: 0 });
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

},{"./graphics/particle":7}],3:[function(require,module,exports){
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

/**
 * A circular particle that extends from PIXI graphics
 */

var Particle = (function () {
    function Particle(_ref) {
        var color = _ref.color;
        var alpha = _ref.alpha;
        var x = _ref.x;
        var y = _ref.y;

        _classCallCheck(this, Particle);

        var pixiGraphic = new PIXI.Graphics();
        pixiGraphic.lineStyle(0);
        pixiGraphic.beginFill(color, alpha);
        pixiGraphic.drawCircle(x, y, Particle.randomInt(1, 3));
        pixiGraphic.endFill();

        return pixiGraphic;
    }

    _createClass(Particle, null, {
        randomInt: {
            value: function randomInt(min, max) {
                return Math.floor(Math.random() * (max - min)) + min;
            }
        }
    });

    return Particle;
})();

module.exports = Particle;

},{}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
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

},{"../behaviors/AreaSinkBehavior":3,"./Mode":8}],10:[function(require,module,exports){
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

},{"../behaviors/AreaSinkBehavior":3,"./Mode":8}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvY2hhcmxlc2tpbmcvcGFydGlkcmF3L3NyYy9wYXJ0aWRyYXcuanMiLCIvVXNlcnMvY2hhcmxlc2tpbmcvcGFydGlkcmF3L3NyYy9QYXJ0aWNsZVNjZW5lLmpzIiwiL1VzZXJzL2NoYXJsZXNraW5nL3BhcnRpZHJhdy9zcmMvYmVoYXZpb3JzL0FyZWFTaW5rQmVoYXZpb3IuanMiLCIvVXNlcnMvY2hhcmxlc2tpbmcvcGFydGlkcmF3L3NyYy9iZWhhdmlvcnMvQmVoYXZpb3IuanMiLCIvVXNlcnMvY2hhcmxlc2tpbmcvcGFydGlkcmF3L3NyYy9iZWhhdmlvcnMvRmlyZWZseUJlaGF2aW9yLmpzIiwiL1VzZXJzL2NoYXJsZXNraW5nL3BhcnRpZHJhdy9zcmMvYmVoYXZpb3JzL1dyYXBwaW5nQm91bmRzQmVoYXZpb3IuanMiLCIvVXNlcnMvY2hhcmxlc2tpbmcvcGFydGlkcmF3L3NyYy9ncmFwaGljcy9wYXJ0aWNsZS5qcyIsIi9Vc2Vycy9jaGFybGVza2luZy9wYXJ0aWRyYXcvc3JjL21vZGVzL01vZGUuanMiLCIvVXNlcnMvY2hhcmxlc2tpbmcvcGFydGlkcmF3L3NyYy9tb2Rlcy9Nb3VzZURyYXdBcmVhTW9kZS5qcyIsIi9Vc2Vycy9jaGFybGVza2luZy9wYXJ0aWRyYXcvc3JjL21vZGVzL1JhbmRvbUFyZWFSZXNldE1vZGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7OztJQ0FPLGFBQWEsMkJBQU0saUJBQWlCOztJQUNwQyxnQkFBZ0IsMkJBQU0sOEJBQThCOztJQUNwRCxlQUFlLDJCQUFNLDZCQUE2Qjs7SUFDbEQsc0JBQXNCLDJCQUFNLG9DQUFvQzs7SUFFaEUsSUFBSSwyQkFBTSxjQUFjOztJQUN4QixpQkFBaUIsMkJBQU0sMkJBQTJCOztJQUNsRCxtQkFBbUIsMkJBQU0sNkJBQTZCOztBQUU3RCxJ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LENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLE1BQU0sQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFBLEFBQUMsQ0FBQyxFQUNwRCxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxNQUFNLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQSxBQUFDLENBQUMsRUFDbkQsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksTUFBTSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUEsQUFBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7YUFDdEU7Ozs7V0FiZ0IsbUJBQW1CO0dBQVMsSUFBSTs7aUJBQWhDLG1CQUFtQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgUGFydGljbGVTY2VuZSBmcm9tIFwiLi9QYXJ0aWNsZVNjZW5lXCI7XG5pbXBvcnQgQXJlYVNpbmtCZWhhdmlvciBmcm9tIFwiLi9iZWhhdmlvcnMvQXJlYVNpbmtCZWhhdmlvclwiO1xuaW1wb3J0IEZpcmVmbHlCZWhhdmlvciBmcm9tIFwiLi9iZWhhdmlvcnMvRmlyZWZseUJlaGF2aW9yXCI7XG5pbXBvcnQgV3JhcHBpbmdCb3VuZHNCZWhhdmlvciBmcm9tIFwiLi9iZWhhdmlvcnMvV3JhcHBpbmdCb3VuZHNCZWhhdmlvclwiO1xuXG5pbXBvcnQgTW9kZSBmcm9tIFwiLi9tb2Rlcy9Nb2RlXCI7XG5pbXBvcnQgTW91c2VEcmF3QXJlYU1vZGUgZnJvbSBcIi4vbW9kZXMvTW91c2VEcmF3QXJlYU1vZGVcIjtcbmltcG9ydCBSYW5kb21BcmVhUmVzZXRNb2RlIGZyb20gXCIuL21vZGVzL1JhbmRvbUFyZWFSZXNldE1vZGVcIjtcblxuY29uc3QgUEFSVElDTEVfQ09VTlQgPSAxNTAwO1xuXG5jbGFzcyBQYXJ0aWNsZURyYXdpbmcge1xuICAgIGNvbnN0cnVjdG9yKGNvdW50KSB7XG4gICAgICAgIHRoaXMuY291bnQgPSBjb3VudDtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuc2V0dXBTY2VuZSgpO1xuICAgICAgICB0aGlzLnNldHVwUmVuZGVyZXIoKTtcbiAgICAgICAgdGhpcy5zZXR1cE1vZGVzKCk7XG4gICAgICAgIHRoaXMuc2V0dXBUb2dnbGVzKCk7XG4gICAgICAgIHRoaXMuc2V0dXBSZXNpemUoKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMudGljaygpO1xuICAgIH1cbiAgICBcbiAgICBzZXR1cFNjZW5lKCkge1xuICAgICAgICB0aGlzLmZpcmVmbHkgPSBuZXcgRmlyZWZseUJlaGF2aW9yKCk7XG4gICAgICAgIHRoaXMuYm91bmRzV3JhcHBpbmcgPSBuZXcgV3JhcHBpbmdCb3VuZHNCZWhhdmlvcih3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KTtcbiAgICAgICAgdGhpcy5hcmVhU2luayA9IEFyZWFTaW5rQmVoYXZpb3IuUmVjdGFuZ2xlKDAsIDAsIHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xuXHRcbiAgICAgICAgdGhpcy5zY2VuZSA9IG5ldyBQYXJ0aWNsZVNjZW5lKFxuICAgICAgICAgICAgdGhpcy5jb3VudCwgXG4gICAgICAgICAgICB0aGlzLmZpcmVmbHksIFxuICAgICAgICAgICAgdGhpcy5hcmVhU2luayxcbiAgICAgICAgICAgIHRoaXMuYm91bmRzV3JhcHBpbmcpO1xuICAgIH1cbiAgICBcbiAgICBzZXR1cFJlbmRlcmVyKCkge1xuICAgICAgICB0aGlzLnJlbmRlcmVyID0gUElYSS5hdXRvRGV0ZWN0UmVuZGVyZXIod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XG4gICAgICAgIHRoaXMucmVuZGVyZXIudmlldy5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcbiAgICAgICAgdGhpcy5yZW5kZXJlci52aWV3LnN0eWxlLmxlZnQgPSBcIjBcIjtcbiAgICAgICAgdGhpcy5yZW5kZXJlci52aWV3LnN0eWxlLnRvcCA9IFwiMFwiO1xuICAgICAgICBcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLnJlbmRlcmVyLnZpZXcpO1xuICAgIH1cbiAgICBcbiAgICBzZXR1cE1vZGVzKCkge1xuICAgICAgICB0aGlzLm1vZGUgPSAxO1xuICAgICAgICB0aGlzLm1vZGVzID0gW1xuICAgICAgICAgICAgbmV3IE1vZGUoKSxcbiAgICAgICAgICAgIG5ldyBSYW5kb21BcmVhUmVzZXRNb2RlKHRoaXMuYXJlYVNpbmspLFxuICAgICAgICAgICAgbmV3IE1vdXNlRHJhd0FyZWFNb2RlKHRoaXMuYXJlYVNpbmspXG4gICAgICAgIF07XG4gICAgICAgIFxuICAgICAgICB3aW5kb3cub25jbGljayA9IChlKSA9PiB7IHRoaXMubW9kZXNbdGhpcy5tb2RlXS5vbmNsaWNrKGUpOyB9XG4gICAgICAgIHdpbmRvdy5vbm1vdXNlZG93biA9IChlKSA9PiB7IHRoaXMubW9kZXNbdGhpcy5tb2RlXS5vbm1vdXNlZG93bihlKTsgfVxuICAgICAgICB3aW5kb3cub25tb3VzZW1vdmUgPSAoZSkgPT4geyB0aGlzLm1vZGVzW3RoaXMubW9kZV0ub25tb3VzZW1vdmUoZSk7IH1cbiAgICAgICAgd2luZG93Lm9ubW91c2V1cCA9IChlKSA9PiB7IHRoaXMubW9kZXNbdGhpcy5tb2RlXS5vbm1vdXNldXAoZSk7IH1cbiAgICAgICAgXG4gICAgICAgIHRoaXMuc2V0dXBNb2RlU3dpdGNoZXIoKTtcbiAgICB9XG4gICAgXG4gICAgc2V0dXBNb2RlU3dpdGNoZXIoKSB7XG4gICAgICAgIGxldCByb290ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtb2RlLXN3aXRjaGVyXCIpO1xuICAgICAgICBsZXQgZGVzYyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibW9kZS1kZXNjXCIpO1xuICAgICAgICBpZiAoIXJvb3QpIHJldHVybjtcbiAgICAgICAgXG4gICAgICAgIGxldCBzZWxlY3RlZCA9IG51bGw7XG4gICAgICAgIGZvciAobGV0IGk9MDsgaTx0aGlzLm1vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICAgICAgICAgIGxpbmsuc2V0QXR0cmlidXRlKFwiaHJlZlwiLCBcIiNcIik7XG4gICAgICAgICAgICBsaW5rLm9uY2xpY2sgPSAoZSkgPT4ge1xuICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgaWYgKHNlbGVjdGVkKSBzZWxlY3RlZC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICAgICBzZWxlY3RlZCA9IGxpbms7XG4gICAgICAgICAgICAgICAgbGluay5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICAgICBpZiAoZGVzYykgZGVzYy5pbm5lckhUTUwgPSB0aGlzLm1vZGVzW2ldLmRlc2NyaXB0aW9uO1xuICAgICAgICAgICAgICAgIHRoaXMuc3dpdGNoTW9kZShpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLm1vZGUgPT09IGkpIHtcbiAgICAgICAgICAgICAgICBsaW5rLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgICAgIGlmIChkZXNjKSBkZXNjLmlubmVySFRNTCA9IHRoaXMubW9kZXNbaV0uZGVzY3JpcHRpb247XG4gICAgICAgICAgICAgICAgc2VsZWN0ZWQgPSBsaW5rO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGluay5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0aGlzLm1vZGVzW2ldLm5hbWUpKTtcbiAgICAgICAgICAgIHJvb3QuYXBwZW5kQ2hpbGQobGluayk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgc2V0dXBUb2dnbGVzKCkge1xuICAgICAgICBsZXQgcm9vdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidG9nZ2xlc1wiKTtcbiAgICAgICAgaWYgKCFyb290KSByZXR1cm47XG4gICAgICAgIFxuICAgICAgICBsZXQgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICAgICAgbGluay5zZXRBdHRyaWJ1dGUoXCJocmVmXCIsIFwiI1wiKTtcbiAgICAgICAgbGluay5vbmNsaWNrID0gKGUpID0+IHtcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICB0aGlzLmFyZWFTaW5rLmFyZWEgPSBBcmVhU2lua0JlaGF2aW9yLlJlY3RhbmdsZSgwLCAwLCB3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KS5hcmVhO1xuICAgICAgICB9XG4gICAgICAgIGxpbmsuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoXCJyZXNldFwiKSk7XG4gICAgICAgIHJvb3QuYXBwZW5kQ2hpbGQobGluayk7XG4gICAgICAgIFxuICAgICAgICBsZXQgbGluazIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgICAgIGxpbmsyLnNldEF0dHJpYnV0ZShcImhyZWZcIiwgXCIjXCIpO1xuICAgICAgICBsaW5rMi5vbmNsaWNrID0gKGUpID0+IHtcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICB0aGlzLmZpcmVmbHkuZW5hYmxlZCA9ICF0aGlzLmZpcmVmbHkuZW5hYmxlZDtcbiAgICAgICAgICAgIGxpbmsyLmlubmVySFRNTCA9IFwiZmlyZWZseSBcIiArICh0aGlzLmZpcmVmbHkuZW5hYmxlZCA/IFwib25cIiA6IFwib2ZmXCIpO1xuICAgICAgICB9XG4gICAgICAgIGxpbmsyLmlubmVySFRNTCA9IFwiZmlyZWZseSBcIiArICh0aGlzLmZpcmVmbHkuZW5hYmxlZCA/IFwib25cIiA6IFwib2ZmXCIpO1xuICAgICAgICByb290LmFwcGVuZENoaWxkKGxpbmsyKTtcbiAgICAgICAgXG4gICAgICAgIGxldCBsaW5rMyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICAgICAgbGluazMuc2V0QXR0cmlidXRlKFwiaHJlZlwiLCBcIiNcIik7XG4gICAgICAgIGxpbmszLm9uY2xpY2sgPSAoZSkgPT4ge1xuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIHRoaXMuYm91bmRzV3JhcHBpbmcuZW5hYmxlZCA9ICF0aGlzLmJvdW5kc1dyYXBwaW5nLmVuYWJsZWQ7XG4gICAgICAgICAgICBsaW5rMy5pbm5lckhUTUwgPSBcIndyYXBwaW5nIFwiICsgKHRoaXMuYm91bmRzV3JhcHBpbmcuZW5hYmxlZCA/IFwib25cIiA6IFwib2ZmXCIpO1xuICAgICAgICB9XG4gICAgICAgIGxpbmszLmlubmVySFRNTCA9IFwid3JhcHBpbmcgXCIgKyAodGhpcy5ib3VuZHNXcmFwcGluZy5lbmFibGVkID8gXCJvblwiIDogXCJvZmZcIik7XG4gICAgICAgIHJvb3QuYXBwZW5kQ2hpbGQobGluazMpO1xuICAgIH1cbiAgICBcbiAgICBzZXR1cFJlc2l6ZSgpIHtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMucmVzaXplKTtcbiAgICAgICAgd2luZG93Lm9ub3JpZW50YXRpb25jaGFuZ2UgPSB0aGlzLnJlc2l6ZTtcbiAgICB9XG4gICAgXG4gICAgcmVzaXplKCkge1xuICAgICAgICBsZXQgd2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aCwgaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0OyBcblx0XHR0aGlzLmJvdW5kc1dyYXBwaW5nLndpZHRoID0gd2lkdGg7XG5cdFx0dGhpcy5ib3VuZHNXcmFwcGluZy5oZWlnaHQgPSBoZWlnaHQ7XG4gICAgICAgIHRoaXMucmVuZGVyZXIudmlldy5zdHlsZS53aWR0aCA9IHdpZHRoICsgXCJweFwiXG4gICAgICAgIHRoaXMucmVuZGVyZXIudmlldy5zdHlsZS5oZWlnaHQgPSBoZWlnaHQgKyBcInB4XCJcbiAgICAgICAgdGhpcy5yZW5kZXJlci5yZXNpemUod2lkdGgsIGhlaWdodCk7XG4gICAgfVxuICAgIFxuICAgIHRpY2soKSB7XG4gICAgICAgIHRoaXMuc2NlbmUudXBkYXRlKCk7XG4gICAgICAgIHRoaXMucmVuZGVyZXIucmVuZGVyKHRoaXMuc2NlbmUuY29udGFpbmVyKTtcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMudGljay5iaW5kKHRoaXMpKTtcbiAgICB9XG4gICAgXG4gICAgc3dpdGNoTW9kZShtb2RlLCBlKSB7XG4gICAgICAgIGlmIChtb2RlIDwgMCB8fCBtb2RlID4gdGhpcy5tb2Rlcy5sZW5ndGgpIHJldHVybjtcbiAgICAgICAgXG4gICAgICAgIHRoaXMubW9kZXNbdGhpcy5tb2RlXS5zdG9wKCk7XG4gICAgICAgIHRoaXMubW9kZSA9IG1vZGU7XG4gICAgICAgIHRoaXMubW9kZXNbdGhpcy5tb2RlXS5zdGFydCgpO1xuICAgIH1cbn1cblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IG5ldyBQYXJ0aWNsZURyYXdpbmcoUEFSVElDTEVfQ09VTlQpKTtcbiIsImltcG9ydCBQYXJ0aWNsZSBmcm9tIFwiLi9ncmFwaGljcy9wYXJ0aWNsZVwiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBhcnRpY2xlU2NlbmUge1xuXG4gICAgY29uc3RydWN0b3IoY291bnQsIC4uLmJlaGF2aW9ycykge1xuICAgICAgICB0aGlzLnBhcnRpY2xlcyA9IFtdO1xuICAgICAgICB0aGlzLmJlaGF2aW9ycyA9IGJlaGF2aW9ycztcbiAgICAgICAgdGhpcy5jb250YWluZXIgPSBuZXcgUElYSS5EaXNwbGF5T2JqZWN0Q29udGFpbmVyKCk7XG5cbiAgICAgICAgZm9yIChsZXQgaT0wOyBpPGNvdW50OyBpKyspIHtcbiAgICAgICAgICAgIHZhciBwYXJ0aWNsZSA9IG5ldyBQYXJ0aWNsZSh7Y29sb3I6MHhGRkZGRkYsYWxwaGE6TWF0aC5yYW5kb20oKSx4OjAseTowfSk7XG4gICAgICAgICAgICBwYXJ0aWNsZS5zY2FsZS54ID0gMC4yO1xuICAgICAgICAgICAgcGFydGljbGUuc2NhbGUueSA9IDAuMjtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gQlVHIFBpeGkgdjMgcmM0IFBhcnRpY2xlQ29udGFpbmVyIGRvZXNuJ3Qgc3VwcG9ydCB0cmFuc3BhcmVuY3kgYXQgYWxsXG4gICAgICAgICAgICBwYXJ0aWNsZS5hbHBoYSA9IDAuNjtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgZm9yIChsZXQgaj0wOyBqPGJlaGF2aW9ycy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgIGJlaGF2aW9yc1tqXS5pbml0aWFsaXplKHBhcnRpY2xlLCBpLCBjb3VudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMucGFydGljbGVzLnB1c2gocGFydGljbGUpO1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuYWRkQ2hpbGQocGFydGljbGUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIHVwZGF0ZSgpIHtcbiAgICAgICAgZm9yIChsZXQgaT0wOyBpPHRoaXMucGFydGljbGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBqPTA7IGo8dGhpcy5iZWhhdmlvcnMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICB0aGlzLmJlaGF2aW9yc1tqXS51cGRhdGUodGhpcy5wYXJ0aWNsZXNbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSIsImltcG9ydCBCZWhhdmlvciBmcm9tIFwiLi9CZWhhdmlvclwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBcmVhU2lua0JlaGF2aW9yIGV4dGVuZHMgQmVoYXZpb3Ige1xuXG4gICAgY29uc3RydWN0b3IoYXJlYSkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmFyZWEgPSBhcmVhO1xuICAgIH1cblxuICAgIGluaXRpYWxpemUocGFydGljbGUsIGluZGV4LCBjb3VudCkge1xuICAgICAgICBwYXJ0aWNsZS5wZXJjZW50SW5kZXggPSAoMS4wICogaW5kZXgpIC8gKDEuMCAqIGNvdW50KTtcbiAgICB9XG4gICAgXG4gICAgdXBkYXRlKHBhcnRpY2xlKSB7XG4gICAgICAgIGlmICghdGhpcy5lbmFibGVkKSByZXR1cm47XG4gICAgICAgIFxuICAgICAgICBsZXQgcG9zID0gTWF0aC5mbG9vcih0aGlzLmFyZWEubGVuZ3RoICogcGFydGljbGUucGVyY2VudEluZGV4KTtcbiAgICAgICAgbGV0IHNpbmsgPSB0aGlzLmFyZWFbcG9zXTtcbiAgICAgICAgbGV0IGRpcmVjdGlvbiA9IE1hdGguYXRhbjIoc2luay54IC0gcGFydGljbGUucG9zaXRpb24ueCwgc2luay55IC0gcGFydGljbGUucG9zaXRpb24ueSk7XG4gICAgICAgIFxuICAgICAgICBsZXQgc3BlZWQgPSBwYXJ0aWNsZS5zcGVlZDtcbiAgICAgICAgaWYgKHNwZWVkIDw9IDApIHNwZWVkID0gMC4xO1xuICAgICAgICBzcGVlZCA9IHNwZWVkICogKDAuMSAqIE1hdGguc3FydChNYXRoLnBvdyhzaW5rLnggLSBwYXJ0aWNsZS5wb3NpdGlvbi54LCAyKSwgTWF0aC5wb3coc2luay55IC0gcGFydGljbGUucG9zaXRpb24ueSkpKTtcbiAgICAgICAgXG4gICAgICAgIHBhcnRpY2xlLnBvc2l0aW9uLnggKz0gTWF0aC5zaW4oZGlyZWN0aW9uKSAqIHNwZWVkO1xuICAgICAgICBwYXJ0aWNsZS5wb3NpdGlvbi55ICs9IE1hdGguY29zKGRpcmVjdGlvbikgKiBzcGVlZDtcbiAgICB9XG4gICAgICAgIFxuICAgIHN0YXRpYyBzaHVmZmxlKGFycmF5KSB7XG4gICAgICAgIHZhciBjdXJyZW50SW5kZXggPSBhcnJheS5sZW5ndGgsIHRlbXBvcmFyeVZhbHVlLCByYW5kb21JbmRleCA7XG5cbiAgICAgICAgd2hpbGUgKDAgIT09IGN1cnJlbnRJbmRleCkge1xuICAgICAgICAgICAgcmFuZG9tSW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjdXJyZW50SW5kZXgpO1xuICAgICAgICAgICAgY3VycmVudEluZGV4IC09IDE7XG5cbiAgICAgICAgICAgIHRlbXBvcmFyeVZhbHVlID0gYXJyYXlbY3VycmVudEluZGV4XTtcbiAgICAgICAgICAgIGFycmF5W2N1cnJlbnRJbmRleF0gPSBhcnJheVtyYW5kb21JbmRleF07XG4gICAgICAgICAgICBhcnJheVtyYW5kb21JbmRleF0gPSB0ZW1wb3JhcnlWYWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBhcnJheTtcbiAgICB9XG4gICAgXG4gICAgc3RhdGljIFJlY3RhbmdsZSh4LCB5LCB3aWR0aCwgaGVpZ2h0KSB7XG4gICAgICAgIGlmICh3aWR0aCA8PSAwKSB3aWR0aCA9IDE7XG4gICAgICAgIGlmIChoZWlnaHQgPD0gMCkgaGVpZ2h0ID0gMTtcbiAgICAgICAgbGV0IGFyZWEgPSBuZXcgQXJyYXkod2lkdGggKiBoZWlnaHQpO1xuICAgICAgICBmb3IgKGxldCBpPTA7IGk8d2lkdGg7IGkrKykge1xuICAgICAgICAgICAgZm9yIChsZXQgaj0wOyBqPGhlaWdodDsgaisrKSB7XG4gICAgICAgICAgICAgICAgYXJlYVtqICogd2lkdGggKyBpXSA9IHt4OiB4ICsgaSwgeTogeSArIGp9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGFyZWEgPSBBcmVhU2lua0JlaGF2aW9yLnNodWZmbGUoYXJlYSk7XG4gICAgICAgIHJldHVybiBuZXcgQXJlYVNpbmtCZWhhdmlvcihhcmVhKTtcbiAgICB9XG59IiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmVoYXZpb3Ige1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmVuYWJsZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIGluaXRpYWxpemUocGFydGljbGUpIHt9XG4gICAgXG4gICAgdXBkYXRlKHBhcnRpY2xlKSB7fVxufSIsImltcG9ydCBCZWhhdmlvciBmcm9tIFwiLi9CZWhhdmlvclwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGaXJlZmx5QmVoYXZpb3IgZXh0ZW5kcyBCZWhhdmlvciB7XG5cbiAgICBpbml0aWFsaXplKHBhcnRpY2xlKSB7XG4gICAgICAgIHBhcnRpY2xlLmRpcmVjdGlvbiA9IHBhcnRpY2xlLmRpcmVjdGlvbiB8fCBNYXRoLnJhbmRvbSgpICogTWF0aC5QSSAqIDI7XG4gICAgICAgIHBhcnRpY2xlLnpkaXJlY3Rpb24gPSBwYXJ0aWNsZS56ZGlyZWN0aW9uIHx8IE1hdGgucmFuZG9tKCkgKiBNYXRoLlBJICogMjtcbiAgICAgICAgcGFydGljbGUuc3BlZWQgPSBwYXJ0aWNsZS5zcGVlZCB8fCAxO1xuICAgICAgICBwYXJ0aWNsZS50dXJuID0gTWF0aC5yYW5kb20oKSAtIDAuNTtcbiAgICAgICAgcGFydGljbGUuenR1cm4gPSBNYXRoLnJhbmRvbSgpIC0gMC41O1xuICAgIH1cbiAgICBcbiAgICB1cGRhdGUocGFydGljbGUpIHtcbiAgICAgICAgaWYgKCF0aGlzLmVuYWJsZWQpIHJldHVybjtcbiAgICAgICAgXG4gICAgICAgIHBhcnRpY2xlLmRpcmVjdGlvbiArPSBwYXJ0aWNsZS50dXJuICogMC4xO1xuICAgICAgICBwYXJ0aWNsZS56ZGlyZWN0aW9uICs9IHBhcnRpY2xlLnp0dXJuICogMC41O1xuICAgICAgICBwYXJ0aWNsZS50dXJuICs9IDAuMTUgKiAoTWF0aC5yYW5kb20oKSAtIDAuNSk7XG4gICAgICAgIGlmIChwYXJ0aWNsZS50dXJuID4gMSkgcGFydGljbGUudHVybiA9IDE7XG4gICAgICAgIGlmIChwYXJ0aWNsZS50dXJuIDwgLTEpIHBhcnRpY2xlLnR1cm4gPSAtMTtcbiAgICAgICAgcGFydGljbGUuenR1cm4gKz0gMC4wNSAqIChNYXRoLnJhbmRvbSgpIC0gMC41KTtcbiAgICAgICAgXG4gICAgICAgIHBhcnRpY2xlLnBvc2l0aW9uLnggKz0gTWF0aC5zaW4ocGFydGljbGUuZGlyZWN0aW9uKSAqIHBhcnRpY2xlLnNwZWVkO1xuICAgICAgICBwYXJ0aWNsZS5wb3NpdGlvbi55ICs9IE1hdGguY29zKHBhcnRpY2xlLmRpcmVjdGlvbikgKiBwYXJ0aWNsZS5zcGVlZDtcbiAgICAgICAgXG4gICAgICAgIC8vIEJVRyBQaXhpIHYzIHJjNCBQYXJ0aWNsZUNvbnRhaW5lciBub3QgYWxsb3dpbmcgc2NhbGUgYW5pbWF0aW9uXG4gICAgICAgIGxldCB6b2ZmID0gTWF0aC5zaW4ocGFydGljbGUuemRpcmVjdGlvbikgKiAwLjA1O1xuICAgICAgICBwYXJ0aWNsZS5zY2FsZS54ICs9IHpvZmY7XG4gICAgICAgIHBhcnRpY2xlLnNjYWxlLnkgKz0gem9mZjtcbiAgICB9XG59IiwiaW1wb3J0IEJlaGF2aW9yIGZyb20gXCIuL0JlaGF2aW9yXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdyYXBwaW5nQm91bmRzQmVoYXZpb3IgZXh0ZW5kcyBCZWhhdmlvciB7XG5cbiAgICBjb25zdHJ1Y3Rvcih3aWR0aCwgaGVpZ2h0KSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMud2lkdGggPSB3aWR0aDtcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XG4gICAgfVxuXG4gICAgdXBkYXRlKHBhcnRpY2xlKSB7XG4gICAgICAgIGlmICghdGhpcy5lbmFibGVkKSByZXR1cm47XG4gICAgXG4gICAgICAgIGlmIChwYXJ0aWNsZS5wb3NpdGlvbi54ID4gdGhpcy53aWR0aCkge1xuICAgICAgICAgICAgcGFydGljbGUucG9zaXRpb24ueCA9IHBhcnRpY2xlLnBvc2l0aW9uLnggLSB0aGlzLndpZHRoO1xuICAgICAgICB9IGVsc2UgaWYgKHBhcnRpY2xlLnBvc2l0aW9uLnggPCAwKSB7XG4gICAgICAgICAgICBwYXJ0aWNsZS5wb3NpdGlvbi54ID0gcGFydGljbGUucG9zaXRpb24ueCArIHRoaXMud2lkdGg7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGlmIChwYXJ0aWNsZS5wb3NpdGlvbi55ID4gdGhpcy5oZWlnaHQpIHtcbiAgICAgICAgICAgIHBhcnRpY2xlLnBvc2l0aW9uLnkgPSBwYXJ0aWNsZS5wb3NpdGlvbi55IC0gdGhpcy5oZWlnaHQ7XG4gICAgICAgIH0gZWxzZSBpZiAocGFydGljbGUucG9zaXRpb24ueSA8IDApIHtcbiAgICAgICAgICAgIHBhcnRpY2xlLnBvc2l0aW9uLnkgPSBwYXJ0aWNsZS5wb3NpdGlvbi55ICsgdGhpcy5oZWlnaHQ7XG4gICAgICAgIH1cbiAgICB9XG59IiwiLyoqXG4gKiBBIGNpcmN1bGFyIHBhcnRpY2xlIHRoYXQgZXh0ZW5kcyBmcm9tIFBJWEkgZ3JhcGhpY3NcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGFydGljbGUge1xuICAgIHN0YXRpYyByYW5kb21JbnQoIG1pbiwgbWF4ICkge1xuICAgICAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbikpICsgbWluO1xuICAgIH1cbiAgICBjb25zdHJ1Y3Rvcigge2NvbG9yLGFscGhhLHgseX0gKSB7XG4gICAgICAgIGxldCBwaXhpR3JhcGhpYyA9IG5ldyBQSVhJLkdyYXBoaWNzKCk7XG4gICAgICAgIHBpeGlHcmFwaGljLmxpbmVTdHlsZSgwKTtcbiAgICAgICAgcGl4aUdyYXBoaWMuYmVnaW5GaWxsKGNvbG9yLCBhbHBoYSk7XG4gICAgICAgIHBpeGlHcmFwaGljLmRyYXdDaXJjbGUoeCwgeSwgUGFydGljbGUucmFuZG9tSW50KDEsMykpO1xuICAgICAgICBwaXhpR3JhcGhpYy5lbmRGaWxsKCk7XG5cbiAgICAgICAgcmV0dXJuIHBpeGlHcmFwaGljO1xuICAgIH1cblxufSIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIE1vZGUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLm5hbWUgPSBcIk5vbmVcIjtcbiAgICAgICAgdGhpcy5kZXNjcmlwdGlvbiA9IFwiQ2hvb3NlIGEgZGlmZmVyZW50IG1vZGUuXCI7XG4gICAgfVxuICAgIFxuICAgIHN0YXJ0KCkge31cbiAgICBzdG9wKCkge31cbiAgICBcbiAgICBvbmNsaWNrKGUpIHt9XG4gICAgb25tb3VzZWRvd24oZSkge31cbiAgICBvbm1vdXNlbW92ZShlKSB7fVxuICAgIG9ubW91c2V1cChlKSB7fVxufSIsImltcG9ydCBNb2RlIGZyb20gXCIuL01vZGVcIjtcbmltcG9ydCBBcmVhU2lua0JlaGF2aW9yIGZyb20gXCIuLi9iZWhhdmlvcnMvQXJlYVNpbmtCZWhhdmlvclwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNb3VzZURyYXdBcmVhTW9kZSBleHRlbmRzIE1vZGUge1xuICAgIGNvbnN0cnVjdG9yKHNpbmspIHtcbiAgICAgICAgdGhpcy5uYW1lID0gXCJEcmF3aW5nXCI7XG4gICAgICAgIHRoaXMuZGVzY3JpcHRpb24gPSBcIkNsaWNrIGFuZCBkcmFnIHRoZSBtb3VzZSB0byBzZXQgdGhlIHBhdGggZm9yIHBhcnRpY2xlcyB0byBmaWxsLlwiO1xuICAgICAgICB0aGlzLnNpbmsgPSBzaW5rO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5zdGFydGVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuYWN0aXZlID0gZmFsc2U7XG4gICAgfVxuICAgICAgICBcbiAgICBvbm1vdXNlZG93bihlKSB7XG4gICAgICAgIGlmICghdGhpcy5zdGFydGVkKSB7XG4gICAgICAgICAgICB0aGlzLnN0YXJ0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgLy8gQ2xlYXIgdGhlIGN1cnJlbnQgYXJlYSB0aGUgZmlyc3QgdGltZSBhcm91bmRcbiAgICAgICAgICAgIHRoaXMuc2luay5hcmVhID0gW107XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHRoaXMuYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5hZGRQb2ludChlKTtcbiAgICB9XG4gICAgXG4gICAgb25tb3VzZW1vdmUoZSkge1xuICAgICAgICBpZiAodGhpcy5hY3RpdmUpIHtcbiAgICAgICAgICAgIHRoaXMuYWRkUG9pbnQoZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgb25tb3VzZXVwKGUpIHtcbiAgICAgICAgdGhpcy5hY3RpdmUgPSBmYWxzZTtcbiAgICB9XG4gICAgXG4gICAgc3RvcCgpIHtcbiAgICAgICAgdGhpcy5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5zdGFydGVkID0gZmFsc2U7XG4gICAgfVxuICAgIFxuICAgIGFkZFBvaW50KGUpIHtcbiAgICAgICAgdGhpcy5zaW5rLmFyZWEucHVzaCh7eDogZS5jbGllbnRYLCB5OiBlLmNsaWVudFl9KTtcbiAgICB9XG59IiwiaW1wb3J0IE1vZGUgZnJvbSBcIi4vTW9kZVwiO1xuaW1wb3J0IEFyZWFTaW5rQmVoYXZpb3IgZnJvbSBcIi4uL2JlaGF2aW9ycy9BcmVhU2lua0JlaGF2aW9yXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJhbmRvbUFyZWFSZXNldE1vZGUgZXh0ZW5kcyBNb2RlIHtcbiAgICBjb25zdHJ1Y3RvcihzaW5rKSB7XG4gICAgICAgIHRoaXMubmFtZSA9IFwiUmFuZG9tIFJlY3RcIjtcbiAgICAgICAgdGhpcy5kZXNjcmlwdGlvbiA9IFwiQ2xpY2sgYW55d2hlcmUgdG8gcmFuZG9tbHkgcmVzZXQgdGhlIHRhcmdldCBzaGFwZS5cIjtcbiAgICAgICAgdGhpcy5zaW5rID0gc2luaztcbiAgICB9XG4gICAgXG4gICAgb25jbGljayhlKSB7XG4gICAgICAgIHRoaXMuc2luay5hcmVhID0gQXJlYVNpbmtCZWhhdmlvci5SZWN0YW5nbGUoXG4gICAgICAgICAgICAgICAgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKHdpbmRvdy5pbm5lcldpZHRoIC8gMikpLCBcbiAgICAgICAgICAgICAgICBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAod2luZG93LmlubmVySGVpZ2h0IC8gMikpLCBcbiAgICAgICAgICAgICAgICBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAod2luZG93LmlubmVyV2lkdGggLyAzKSksIFxuICAgICAgICAgICAgICAgIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICh3aW5kb3cuaW5uZXJIZWlnaHQgLyAzKSkpLmFyZWE7XG4gICAgfVxufSJdfQ==
