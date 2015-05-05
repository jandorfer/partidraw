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
var scale = 1;

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
                this.renderer = PIXI.autoDetectRenderer(window.innerWidth * scale, window.innerHeight * scale, { antialias: true, resolution: 2 });
                this.renderer.view.style.position = "fixed";
                this.renderer.view.style.left = "0";
                this.renderer.view.style.top = "0";
                this.renderer.view.style.bottom = "0";
                this.renderer.view.style.right = "0";

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
                window.addEventListener("resize", this.resize.bind(this));
                window.onorientationchange = this.resize.bind(this);
            }
        },
        resize: {
            value: function resize() {
                var width = window.innerWidth,
                    height = window.innerHeight;
                this.boundsWrapping.width = width;
                this.boundsWrapping.height = height;
                this.renderer.resize(width * scale, height * scale);
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
        this.container = new PIXI.Container();

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvY2hhcmxlc2tpbmcvcGFydGlkcmF3L3NyYy9wYXJ0aWRyYXcuanMiLCIvVXNlcnMvY2hhcmxlc2tpbmcvcGFydGlkcmF3L3NyYy9QYXJ0aWNsZVNjZW5lLmpzIiwiL1VzZXJzL2NoYXJsZXNraW5nL3BhcnRpZHJhdy9zcmMvYmVoYXZpb3JzL0FyZWFTaW5rQmVoYXZpb3IuanMiLCIvVXNlcnMvY2hhcmxlc2tpbmcvcGFydGlkcmF3L3NyYy9iZWhhdmlvcnMvQmVoYXZpb3IuanMiLCIvVXNlcnMvY2hhcmxlc2tpbmcvcGFydGlkcmF3L3NyYy9iZWhhdmlvcnMvRmlyZWZseUJlaGF2aW9yLmpzIiwiL1VzZXJzL2NoYXJsZXNraW5nL3BhcnRpZHJhdy9zcmMvYmVoYXZpb3JzL1dyYXBwaW5nQm91bmRzQmVoYXZpb3IuanMiLCIvVXNlcnMvY2hhcmxlc2tpbmcvcGFydGlkcmF3L3NyYy9ncmFwaGljcy9wYXJ0aWNsZS5qcyIsIi9Vc2Vycy9jaGFybGVza2luZy9wYXJ0aWRyYXcvc3JjL21vZGVzL01vZGUuanMiLCIvVXNlcnMvY2hhcmxlc2tpbmcvcGFydGlkcmF3L3NyYy9tb2Rlcy9Nb3VzZURyYXdBcmVhTW9kZS5qcyIsIi9Vc2Vycy9jaGFybGVza2luZy9wYXJ0aWRyYXcvc3JjL21vZGVzL1JhbmRvbUFyZWFSZXNldE1vZGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7OztJQ0FPLGFBQWEsMkJBQU0saUJBQWlCOztJQUNwQyxnQkFBZ0IsMkJBQU0sOEJBQThCOztJQUNwRCxlQUFlLDJCQUFNLDZCQUE2Qjs7SUFDbEQsc0JBQXNCLDJCQUFNLG9DQUFvQzs7SUFFaEUsSUFBSSwyQkFBTSxjQUFjOztJQUN4QixpQkFBaUIsMkJBQU0sMkJBQTJCOztJQUNsRCxtQkFBbUIsMkJBQU0sNkJBQTZCOztBQUU3RCxJ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QUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsZ0JBQWdCLENBQUMsU0FBUyxDQUNuQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxNQUFNLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQSxBQUFDLENBQUMsRUFDbkQsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksTUFBTSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUEsQUFBQyxDQUFDLEVBQ3BELElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLE1BQU0sQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFBLEFBQUMsQ0FBQyxFQUNuRCxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxNQUFNLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQSxBQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQzthQUN0RTs7OztXQWJnQixtQkFBbUI7R0FBUyxJQUFJOztpQkFBaEMsbUJBQW1CIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBQYXJ0aWNsZVNjZW5lIGZyb20gXCIuL1BhcnRpY2xlU2NlbmVcIjtcbmltcG9ydCBBcmVhU2lua0JlaGF2aW9yIGZyb20gXCIuL2JlaGF2aW9ycy9BcmVhU2lua0JlaGF2aW9yXCI7XG5pbXBvcnQgRmlyZWZseUJlaGF2aW9yIGZyb20gXCIuL2JlaGF2aW9ycy9GaXJlZmx5QmVoYXZpb3JcIjtcbmltcG9ydCBXcmFwcGluZ0JvdW5kc0JlaGF2aW9yIGZyb20gXCIuL2JlaGF2aW9ycy9XcmFwcGluZ0JvdW5kc0JlaGF2aW9yXCI7XG5cbmltcG9ydCBNb2RlIGZyb20gXCIuL21vZGVzL01vZGVcIjtcbmltcG9ydCBNb3VzZURyYXdBcmVhTW9kZSBmcm9tIFwiLi9tb2Rlcy9Nb3VzZURyYXdBcmVhTW9kZVwiO1xuaW1wb3J0IFJhbmRvbUFyZWFSZXNldE1vZGUgZnJvbSBcIi4vbW9kZXMvUmFuZG9tQXJlYVJlc2V0TW9kZVwiO1xuXG5jb25zdCBQQVJUSUNMRV9DT1VOVCA9IDE1MDA7XG5jb25zdCBzY2FsZSA9IDE7XG5cbmNsYXNzIFBhcnRpY2xlRHJhd2luZyB7XG4gICAgY29uc3RydWN0b3IoIGNvdW50ICkge1xuICAgICAgICB0aGlzLmNvdW50ID0gY291bnQ7XG5cbiAgICAgICAgdGhpcy5zZXR1cFNjZW5lKCk7XG4gICAgICAgIHRoaXMuc2V0dXBSZW5kZXJlcigpO1xuICAgICAgICB0aGlzLnNldHVwTW9kZXMoKTtcbiAgICAgICAgdGhpcy5zZXR1cFRvZ2dsZXMoKTtcbiAgICAgICAgdGhpcy5zZXR1cFJlc2l6ZSgpO1xuXG4gICAgICAgIHRoaXMudGljaygpO1xuICAgIH1cblxuICAgIHNldHVwU2NlbmUoKSB7XG4gICAgICAgIHRoaXMuZmlyZWZseSA9IG5ldyBGaXJlZmx5QmVoYXZpb3IoKTtcbiAgICAgICAgdGhpcy5ib3VuZHNXcmFwcGluZyA9IG5ldyBXcmFwcGluZ0JvdW5kc0JlaGF2aW9yKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xuICAgICAgICB0aGlzLmFyZWFTaW5rID0gQXJlYVNpbmtCZWhhdmlvci5SZWN0YW5nbGUoMCwgMCwgd2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XG5cbiAgICAgICAgdGhpcy5zY2VuZSA9IG5ldyBQYXJ0aWNsZVNjZW5lKFxuICAgICAgICAgICAgdGhpcy5jb3VudCxcbiAgICAgICAgICAgIHRoaXMuZmlyZWZseSxcbiAgICAgICAgICAgIHRoaXMuYXJlYVNpbmssXG4gICAgICAgICAgICB0aGlzLmJvdW5kc1dyYXBwaW5nKTtcbiAgICB9XG5cbiAgICBzZXR1cFJlbmRlcmVyKCkge1xuICAgICAgICB0aGlzLnJlbmRlcmVyID0gUElYSS5hdXRvRGV0ZWN0UmVuZGVyZXIod2luZG93LmlubmVyV2lkdGggKiBzY2FsZSwgd2luZG93LmlubmVySGVpZ2h0ICogc2NhbGUse2FudGlhbGlhczp0cnVlLHJlc29sdXRpb246Mn0pO1xuICAgICAgICB0aGlzLnJlbmRlcmVyLnZpZXcuc3R5bGUucG9zaXRpb24gPSBcImZpeGVkXCI7XG4gICAgICAgIHRoaXMucmVuZGVyZXIudmlldy5zdHlsZS5sZWZ0ID0gXCIwXCI7XG4gICAgICAgIHRoaXMucmVuZGVyZXIudmlldy5zdHlsZS50b3AgPSBcIjBcIjtcbiAgICAgICAgdGhpcy5yZW5kZXJlci52aWV3LnN0eWxlLmJvdHRvbSA9IFwiMFwiO1xuICAgICAgICB0aGlzLnJlbmRlcmVyLnZpZXcuc3R5bGUucmlnaHQgPSBcIjBcIjtcblxuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMucmVuZGVyZXIudmlldyk7XG4gICAgfVxuXG4gICAgc2V0dXBNb2RlcygpIHtcbiAgICAgICAgdGhpcy5tb2RlID0gMTtcbiAgICAgICAgdGhpcy5tb2RlcyA9IFtcbiAgICAgICAgICAgIG5ldyBNb2RlKCksXG4gICAgICAgICAgICBuZXcgUmFuZG9tQXJlYVJlc2V0TW9kZSh0aGlzLmFyZWFTaW5rKSxcbiAgICAgICAgICAgIG5ldyBNb3VzZURyYXdBcmVhTW9kZSh0aGlzLmFyZWFTaW5rKVxuICAgICAgICBdO1xuXG4gICAgICAgIHdpbmRvdy5vbmNsaWNrID0gKCBlICkgPT4ge1xuICAgICAgICAgICAgdGhpcy5tb2Rlc1t0aGlzLm1vZGVdLm9uY2xpY2soZSk7XG4gICAgICAgIH1cbiAgICAgICAgd2luZG93Lm9ubW91c2Vkb3duID0gKCBlICkgPT4ge1xuICAgICAgICAgICAgdGhpcy5tb2Rlc1t0aGlzLm1vZGVdLm9ubW91c2Vkb3duKGUpO1xuICAgICAgICB9XG4gICAgICAgIHdpbmRvdy5vbm1vdXNlbW92ZSA9ICggZSApID0+IHtcbiAgICAgICAgICAgIHRoaXMubW9kZXNbdGhpcy5tb2RlXS5vbm1vdXNlbW92ZShlKTtcbiAgICAgICAgfVxuICAgICAgICB3aW5kb3cub25tb3VzZXVwID0gKCBlICkgPT4ge1xuICAgICAgICAgICAgdGhpcy5tb2Rlc1t0aGlzLm1vZGVdLm9ubW91c2V1cChlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2V0dXBNb2RlU3dpdGNoZXIoKTtcbiAgICB9XG5cbiAgICBzZXR1cE1vZGVTd2l0Y2hlcigpIHtcbiAgICAgICAgbGV0IHJvb3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1vZGUtc3dpdGNoZXJcIik7XG4gICAgICAgIGxldCBkZXNjID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtb2RlLWRlc2NcIik7XG4gICAgICAgIGlmICggIXJvb3QgKSByZXR1cm47XG5cbiAgICAgICAgbGV0IHNlbGVjdGVkID0gbnVsbDtcbiAgICAgICAgZm9yICggbGV0IGkgPSAwOyBpIDwgdGhpcy5tb2Rlcy5sZW5ndGg7IGkrKyApIHtcbiAgICAgICAgICAgIGxldCBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgICAgICAgICAgbGluay5zZXRBdHRyaWJ1dGUoXCJocmVmXCIsIFwiI1wiKTtcbiAgICAgICAgICAgIGxpbmsub25jbGljayA9ICggZSApID0+IHtcbiAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgIGlmICggc2VsZWN0ZWQgKSBzZWxlY3RlZC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICAgICBzZWxlY3RlZCA9IGxpbms7XG4gICAgICAgICAgICAgICAgbGluay5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICAgICBpZiAoIGRlc2MgKSBkZXNjLmlubmVySFRNTCA9IHRoaXMubW9kZXNbaV0uZGVzY3JpcHRpb247XG4gICAgICAgICAgICAgICAgdGhpcy5zd2l0Y2hNb2RlKGkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCB0aGlzLm1vZGUgPT09IGkgKSB7XG4gICAgICAgICAgICAgICAgbGluay5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICAgICBpZiAoIGRlc2MgKSBkZXNjLmlubmVySFRNTCA9IHRoaXMubW9kZXNbaV0uZGVzY3JpcHRpb247XG4gICAgICAgICAgICAgICAgc2VsZWN0ZWQgPSBsaW5rO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGluay5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0aGlzLm1vZGVzW2ldLm5hbWUpKTtcbiAgICAgICAgICAgIHJvb3QuYXBwZW5kQ2hpbGQobGluayk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXR1cFRvZ2dsZXMoKSB7XG4gICAgICAgIGxldCByb290ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0b2dnbGVzXCIpO1xuICAgICAgICBpZiAoICFyb290ICkgcmV0dXJuO1xuXG4gICAgICAgIGxldCBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgICAgICBsaW5rLnNldEF0dHJpYnV0ZShcImhyZWZcIiwgXCIjXCIpO1xuICAgICAgICBsaW5rLm9uY2xpY2sgPSAoIGUgKSA9PiB7XG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgdGhpcy5hcmVhU2luay5hcmVhID0gQXJlYVNpbmtCZWhhdmlvci5SZWN0YW5nbGUoMCwgMCwgd2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCkuYXJlYTtcbiAgICAgICAgfTtcbiAgICAgICAgbGluay5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcInJlc2V0XCIpKTtcbiAgICAgICAgcm9vdC5hcHBlbmRDaGlsZChsaW5rKTtcblxuICAgICAgICBsZXQgbGluazIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgICAgIGxpbmsyLnNldEF0dHJpYnV0ZShcImhyZWZcIiwgXCIjXCIpO1xuICAgICAgICBsaW5rMi5vbmNsaWNrID0gKCBlICkgPT4ge1xuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIHRoaXMuZmlyZWZseS5lbmFibGVkID0gIXRoaXMuZmlyZWZseS5lbmFibGVkO1xuICAgICAgICAgICAgbGluazIuaW5uZXJIVE1MID0gXCJmaXJlZmx5IFwiICsgKHRoaXMuZmlyZWZseS5lbmFibGVkID8gXCJvblwiIDogXCJvZmZcIik7XG4gICAgICAgIH07XG4gICAgICAgIGxpbmsyLmlubmVySFRNTCA9IFwiZmlyZWZseSBcIiArICh0aGlzLmZpcmVmbHkuZW5hYmxlZCA/IFwib25cIiA6IFwib2ZmXCIpO1xuICAgICAgICByb290LmFwcGVuZENoaWxkKGxpbmsyKTtcblxuICAgICAgICBsZXQgbGluazMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgICAgIGxpbmszLnNldEF0dHJpYnV0ZShcImhyZWZcIiwgXCIjXCIpO1xuICAgICAgICBsaW5rMy5vbmNsaWNrID0gKCBlICkgPT4ge1xuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIHRoaXMuYm91bmRzV3JhcHBpbmcuZW5hYmxlZCA9ICF0aGlzLmJvdW5kc1dyYXBwaW5nLmVuYWJsZWQ7XG4gICAgICAgICAgICBsaW5rMy5pbm5lckhUTUwgPSBcIndyYXBwaW5nIFwiICsgKHRoaXMuYm91bmRzV3JhcHBpbmcuZW5hYmxlZCA/IFwib25cIiA6IFwib2ZmXCIpO1xuICAgICAgICB9O1xuICAgICAgICBsaW5rMy5pbm5lckhUTUwgPSBcIndyYXBwaW5nIFwiICsgKHRoaXMuYm91bmRzV3JhcHBpbmcuZW5hYmxlZCA/IFwib25cIiA6IFwib2ZmXCIpO1xuICAgICAgICByb290LmFwcGVuZENoaWxkKGxpbmszKTtcbiAgICB9XG5cbiAgICBzZXR1cFJlc2l6ZSgpIHtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMucmVzaXplLmJpbmQodGhpcykpO1xuICAgICAgICB3aW5kb3cub25vcmllbnRhdGlvbmNoYW5nZSA9IHRoaXMucmVzaXplLmJpbmQodGhpcyk7XG4gICAgfVxuXG4gICAgcmVzaXplKCkge1xuICAgICAgICBsZXQgd2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aCwgaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuICAgICAgICB0aGlzLmJvdW5kc1dyYXBwaW5nLndpZHRoID0gd2lkdGg7XG4gICAgICAgIHRoaXMuYm91bmRzV3JhcHBpbmcuaGVpZ2h0ID0gaGVpZ2h0O1xuICAgICAgICB0aGlzLnJlbmRlcmVyLnJlc2l6ZSh3aWR0aCAqIHNjYWxlLCBoZWlnaHQgKiBzY2FsZSk7XG4gICAgfVxuXG4gICAgdGljaygpIHtcbiAgICAgICAgdGhpcy5zY2VuZS51cGRhdGUoKTtcbiAgICAgICAgdGhpcy5yZW5kZXJlci5yZW5kZXIodGhpcy5zY2VuZS5jb250YWluZXIpO1xuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy50aWNrLmJpbmQodGhpcykpO1xuICAgIH1cblxuICAgIHN3aXRjaE1vZGUoIG1vZGUsIGUgKSB7XG4gICAgICAgIGlmICggbW9kZSA8IDAgfHwgbW9kZSA+IHRoaXMubW9kZXMubGVuZ3RoICkgcmV0dXJuO1xuXG4gICAgICAgIHRoaXMubW9kZXNbdGhpcy5tb2RlXS5zdG9wKCk7XG4gICAgICAgIHRoaXMubW9kZSA9IG1vZGU7XG4gICAgICAgIHRoaXMubW9kZXNbdGhpcy5tb2RlXS5zdGFydCgpO1xuICAgIH1cbn1cblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IG5ldyBQYXJ0aWNsZURyYXdpbmcoUEFSVElDTEVfQ09VTlQpKTtcbiIsImltcG9ydCBQYXJ0aWNsZSBmcm9tIFwiLi9ncmFwaGljcy9wYXJ0aWNsZVwiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBhcnRpY2xlU2NlbmUge1xuXG4gICAgY29uc3RydWN0b3IoY291bnQsIC4uLmJlaGF2aW9ycykge1xuICAgICAgICB0aGlzLnBhcnRpY2xlcyA9IFtdO1xuICAgICAgICB0aGlzLmJlaGF2aW9ycyA9IGJlaGF2aW9ycztcbiAgICAgICAgdGhpcy5jb250YWluZXIgPSBuZXcgUElYSS5Db250YWluZXIoKTtcblxuICAgICAgICBmb3IgKGxldCBpPTA7IGk8Y291bnQ7IGkrKykge1xuICAgICAgICAgICAgdmFyIHBhcnRpY2xlID0gbmV3IFBhcnRpY2xlKHtjb2xvcjoweEZGRkZGRixhbHBoYTpNYXRoLnJhbmRvbSgpLHg6MCx5OjB9KTtcbiAgICAgICAgICAgIHBhcnRpY2xlLnNjYWxlLnggPSAwLjI7XG4gICAgICAgICAgICBwYXJ0aWNsZS5zY2FsZS55ID0gMC4yO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBCVUcgUGl4aSB2MyByYzQgUGFydGljbGVDb250YWluZXIgZG9lc24ndCBzdXBwb3J0IHRyYW5zcGFyZW5jeSBhdCBhbGxcbiAgICAgICAgICAgIHBhcnRpY2xlLmFscGhhID0gMC42O1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBmb3IgKGxldCBqPTA7IGo8YmVoYXZpb3JzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgYmVoYXZpb3JzW2pdLmluaXRpYWxpemUocGFydGljbGUsIGksIGNvdW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy5wYXJ0aWNsZXMucHVzaChwYXJ0aWNsZSk7XG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5hZGRDaGlsZChwYXJ0aWNsZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgdXBkYXRlKCkge1xuICAgICAgICBmb3IgKGxldCBpPTA7IGk8dGhpcy5wYXJ0aWNsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGZvciAobGV0IGo9MDsgajx0aGlzLmJlaGF2aW9ycy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgIHRoaXMuYmVoYXZpb3JzW2pdLnVwZGF0ZSh0aGlzLnBhcnRpY2xlc1tpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59IiwiaW1wb3J0IEJlaGF2aW9yIGZyb20gXCIuL0JlaGF2aW9yXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFyZWFTaW5rQmVoYXZpb3IgZXh0ZW5kcyBCZWhhdmlvciB7XG5cbiAgICBjb25zdHJ1Y3RvcihhcmVhKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuYXJlYSA9IGFyZWE7XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZShwYXJ0aWNsZSwgaW5kZXgsIGNvdW50KSB7XG4gICAgICAgIHBhcnRpY2xlLnBlcmNlbnRJbmRleCA9ICgxLjAgKiBpbmRleCkgLyAoMS4wICogY291bnQpO1xuICAgIH1cbiAgICBcbiAgICB1cGRhdGUocGFydGljbGUpIHtcbiAgICAgICAgaWYgKCF0aGlzLmVuYWJsZWQpIHJldHVybjtcbiAgICAgICAgXG4gICAgICAgIGxldCBwb3MgPSBNYXRoLmZsb29yKHRoaXMuYXJlYS5sZW5ndGggKiBwYXJ0aWNsZS5wZXJjZW50SW5kZXgpO1xuICAgICAgICBsZXQgc2luayA9IHRoaXMuYXJlYVtwb3NdO1xuICAgICAgICBsZXQgZGlyZWN0aW9uID0gTWF0aC5hdGFuMihzaW5rLnggLSBwYXJ0aWNsZS5wb3NpdGlvbi54LCBzaW5rLnkgLSBwYXJ0aWNsZS5wb3NpdGlvbi55KTtcbiAgICAgICAgXG4gICAgICAgIGxldCBzcGVlZCA9IHBhcnRpY2xlLnNwZWVkO1xuICAgICAgICBpZiAoc3BlZWQgPD0gMCkgc3BlZWQgPSAwLjE7XG4gICAgICAgIHNwZWVkID0gc3BlZWQgKiAoMC4xICogTWF0aC5zcXJ0KE1hdGgucG93KHNpbmsueCAtIHBhcnRpY2xlLnBvc2l0aW9uLngsIDIpLCBNYXRoLnBvdyhzaW5rLnkgLSBwYXJ0aWNsZS5wb3NpdGlvbi55KSkpO1xuICAgICAgICBcbiAgICAgICAgcGFydGljbGUucG9zaXRpb24ueCArPSBNYXRoLnNpbihkaXJlY3Rpb24pICogc3BlZWQ7XG4gICAgICAgIHBhcnRpY2xlLnBvc2l0aW9uLnkgKz0gTWF0aC5jb3MoZGlyZWN0aW9uKSAqIHNwZWVkO1xuICAgIH1cbiAgICAgICAgXG4gICAgc3RhdGljIHNodWZmbGUoYXJyYXkpIHtcbiAgICAgICAgdmFyIGN1cnJlbnRJbmRleCA9IGFycmF5Lmxlbmd0aCwgdGVtcG9yYXJ5VmFsdWUsIHJhbmRvbUluZGV4IDtcblxuICAgICAgICB3aGlsZSAoMCAhPT0gY3VycmVudEluZGV4KSB7XG4gICAgICAgICAgICByYW5kb21JbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGN1cnJlbnRJbmRleCk7XG4gICAgICAgICAgICBjdXJyZW50SW5kZXggLT0gMTtcblxuICAgICAgICAgICAgdGVtcG9yYXJ5VmFsdWUgPSBhcnJheVtjdXJyZW50SW5kZXhdO1xuICAgICAgICAgICAgYXJyYXlbY3VycmVudEluZGV4XSA9IGFycmF5W3JhbmRvbUluZGV4XTtcbiAgICAgICAgICAgIGFycmF5W3JhbmRvbUluZGV4XSA9IHRlbXBvcmFyeVZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGFycmF5O1xuICAgIH1cbiAgICBcbiAgICBzdGF0aWMgUmVjdGFuZ2xlKHgsIHksIHdpZHRoLCBoZWlnaHQpIHtcbiAgICAgICAgaWYgKHdpZHRoIDw9IDApIHdpZHRoID0gMTtcbiAgICAgICAgaWYgKGhlaWdodCA8PSAwKSBoZWlnaHQgPSAxO1xuICAgICAgICBsZXQgYXJlYSA9IG5ldyBBcnJheSh3aWR0aCAqIGhlaWdodCk7XG4gICAgICAgIGZvciAobGV0IGk9MDsgaTx3aWR0aDsgaSsrKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBqPTA7IGo8aGVpZ2h0OyBqKyspIHtcbiAgICAgICAgICAgICAgICBhcmVhW2ogKiB3aWR0aCArIGldID0ge3g6IHggKyBpLCB5OiB5ICsgan07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgYXJlYSA9IEFyZWFTaW5rQmVoYXZpb3Iuc2h1ZmZsZShhcmVhKTtcbiAgICAgICAgcmV0dXJuIG5ldyBBcmVhU2lua0JlaGF2aW9yKGFyZWEpO1xuICAgIH1cbn0iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBCZWhhdmlvciB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuZW5hYmxlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZShwYXJ0aWNsZSkge31cbiAgICBcbiAgICB1cGRhdGUocGFydGljbGUpIHt9XG59IiwiaW1wb3J0IEJlaGF2aW9yIGZyb20gXCIuL0JlaGF2aW9yXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZpcmVmbHlCZWhhdmlvciBleHRlbmRzIEJlaGF2aW9yIHtcblxuICAgIGluaXRpYWxpemUocGFydGljbGUpIHtcbiAgICAgICAgcGFydGljbGUuZGlyZWN0aW9uID0gcGFydGljbGUuZGlyZWN0aW9uIHx8IE1hdGgucmFuZG9tKCkgKiBNYXRoLlBJICogMjtcbiAgICAgICAgcGFydGljbGUuemRpcmVjdGlvbiA9IHBhcnRpY2xlLnpkaXJlY3Rpb24gfHwgTWF0aC5yYW5kb20oKSAqIE1hdGguUEkgKiAyO1xuICAgICAgICBwYXJ0aWNsZS5zcGVlZCA9IHBhcnRpY2xlLnNwZWVkIHx8IDE7XG4gICAgICAgIHBhcnRpY2xlLnR1cm4gPSBNYXRoLnJhbmRvbSgpIC0gMC41O1xuICAgICAgICBwYXJ0aWNsZS56dHVybiA9IE1hdGgucmFuZG9tKCkgLSAwLjU7XG4gICAgfVxuICAgIFxuICAgIHVwZGF0ZShwYXJ0aWNsZSkge1xuICAgICAgICBpZiAoIXRoaXMuZW5hYmxlZCkgcmV0dXJuO1xuICAgICAgICBcbiAgICAgICAgcGFydGljbGUuZGlyZWN0aW9uICs9IHBhcnRpY2xlLnR1cm4gKiAwLjE7XG4gICAgICAgIHBhcnRpY2xlLnpkaXJlY3Rpb24gKz0gcGFydGljbGUuenR1cm4gKiAwLjU7XG4gICAgICAgIHBhcnRpY2xlLnR1cm4gKz0gMC4xNSAqIChNYXRoLnJhbmRvbSgpIC0gMC41KTtcbiAgICAgICAgaWYgKHBhcnRpY2xlLnR1cm4gPiAxKSBwYXJ0aWNsZS50dXJuID0gMTtcbiAgICAgICAgaWYgKHBhcnRpY2xlLnR1cm4gPCAtMSkgcGFydGljbGUudHVybiA9IC0xO1xuICAgICAgICBwYXJ0aWNsZS56dHVybiArPSAwLjA1ICogKE1hdGgucmFuZG9tKCkgLSAwLjUpO1xuICAgICAgICBcbiAgICAgICAgcGFydGljbGUucG9zaXRpb24ueCArPSBNYXRoLnNpbihwYXJ0aWNsZS5kaXJlY3Rpb24pICogcGFydGljbGUuc3BlZWQ7XG4gICAgICAgIHBhcnRpY2xlLnBvc2l0aW9uLnkgKz0gTWF0aC5jb3MocGFydGljbGUuZGlyZWN0aW9uKSAqIHBhcnRpY2xlLnNwZWVkO1xuICAgICAgICBcbiAgICAgICAgLy8gQlVHIFBpeGkgdjMgcmM0IFBhcnRpY2xlQ29udGFpbmVyIG5vdCBhbGxvd2luZyBzY2FsZSBhbmltYXRpb25cbiAgICAgICAgbGV0IHpvZmYgPSBNYXRoLnNpbihwYXJ0aWNsZS56ZGlyZWN0aW9uKSAqIDAuMDU7XG4gICAgICAgIHBhcnRpY2xlLnNjYWxlLnggKz0gem9mZjtcbiAgICAgICAgcGFydGljbGUuc2NhbGUueSArPSB6b2ZmO1xuICAgIH1cbn0iLCJpbXBvcnQgQmVoYXZpb3IgZnJvbSBcIi4vQmVoYXZpb3JcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV3JhcHBpbmdCb3VuZHNCZWhhdmlvciBleHRlbmRzIEJlaGF2aW9yIHtcblxuICAgIGNvbnN0cnVjdG9yKHdpZHRoLCBoZWlnaHQpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy53aWR0aCA9IHdpZHRoO1xuICAgICAgICB0aGlzLmhlaWdodCA9IGhlaWdodDtcbiAgICB9XG5cbiAgICB1cGRhdGUocGFydGljbGUpIHtcbiAgICAgICAgaWYgKCF0aGlzLmVuYWJsZWQpIHJldHVybjtcbiAgICBcbiAgICAgICAgaWYgKHBhcnRpY2xlLnBvc2l0aW9uLnggPiB0aGlzLndpZHRoKSB7XG4gICAgICAgICAgICBwYXJ0aWNsZS5wb3NpdGlvbi54ID0gcGFydGljbGUucG9zaXRpb24ueCAtIHRoaXMud2lkdGg7XG4gICAgICAgIH0gZWxzZSBpZiAocGFydGljbGUucG9zaXRpb24ueCA8IDApIHtcbiAgICAgICAgICAgIHBhcnRpY2xlLnBvc2l0aW9uLnggPSBwYXJ0aWNsZS5wb3NpdGlvbi54ICsgdGhpcy53aWR0aDtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgaWYgKHBhcnRpY2xlLnBvc2l0aW9uLnkgPiB0aGlzLmhlaWdodCkge1xuICAgICAgICAgICAgcGFydGljbGUucG9zaXRpb24ueSA9IHBhcnRpY2xlLnBvc2l0aW9uLnkgLSB0aGlzLmhlaWdodDtcbiAgICAgICAgfSBlbHNlIGlmIChwYXJ0aWNsZS5wb3NpdGlvbi55IDwgMCkge1xuICAgICAgICAgICAgcGFydGljbGUucG9zaXRpb24ueSA9IHBhcnRpY2xlLnBvc2l0aW9uLnkgKyB0aGlzLmhlaWdodDtcbiAgICAgICAgfVxuICAgIH1cbn0iLCIvKipcbiAqIEEgY2lyY3VsYXIgcGFydGljbGUgdGhhdCBleHRlbmRzIGZyb20gUElYSSBncmFwaGljc1xuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQYXJ0aWNsZSB7XG4gICAgc3RhdGljIHJhbmRvbUludCggbWluLCBtYXggKSB7XG4gICAgICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluKSkgKyBtaW47XG4gICAgfVxuICAgIGNvbnN0cnVjdG9yKCB7Y29sb3IsYWxwaGEseCx5fSApIHtcbiAgICAgICAgbGV0IHBpeGlHcmFwaGljID0gbmV3IFBJWEkuR3JhcGhpY3MoKTtcbiAgICAgICAgcGl4aUdyYXBoaWMubGluZVN0eWxlKDApO1xuICAgICAgICBwaXhpR3JhcGhpYy5iZWdpbkZpbGwoY29sb3IsIGFscGhhKTtcbiAgICAgICAgcGl4aUdyYXBoaWMuZHJhd0NpcmNsZSh4LCB5LCBQYXJ0aWNsZS5yYW5kb21JbnQoMSwzKSk7XG4gICAgICAgIHBpeGlHcmFwaGljLmVuZEZpbGwoKTtcblxuICAgICAgICByZXR1cm4gcGl4aUdyYXBoaWM7XG4gICAgfVxuXG59IiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgTW9kZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMubmFtZSA9IFwiTm9uZVwiO1xuICAgICAgICB0aGlzLmRlc2NyaXB0aW9uID0gXCJDaG9vc2UgYSBkaWZmZXJlbnQgbW9kZS5cIjtcbiAgICB9XG4gICAgXG4gICAgc3RhcnQoKSB7fVxuICAgIHN0b3AoKSB7fVxuICAgIFxuICAgIG9uY2xpY2soZSkge31cbiAgICBvbm1vdXNlZG93bihlKSB7fVxuICAgIG9ubW91c2Vtb3ZlKGUpIHt9XG4gICAgb25tb3VzZXVwKGUpIHt9XG59IiwiaW1wb3J0IE1vZGUgZnJvbSBcIi4vTW9kZVwiO1xuaW1wb3J0IEFyZWFTaW5rQmVoYXZpb3IgZnJvbSBcIi4uL2JlaGF2aW9ycy9BcmVhU2lua0JlaGF2aW9yXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1vdXNlRHJhd0FyZWFNb2RlIGV4dGVuZHMgTW9kZSB7XG4gICAgY29uc3RydWN0b3Ioc2luaykge1xuICAgICAgICB0aGlzLm5hbWUgPSBcIkRyYXdpbmdcIjtcbiAgICAgICAgdGhpcy5kZXNjcmlwdGlvbiA9IFwiQ2xpY2sgYW5kIGRyYWcgdGhlIG1vdXNlIHRvIHNldCB0aGUgcGF0aCBmb3IgcGFydGljbGVzIHRvIGZpbGwuXCI7XG4gICAgICAgIHRoaXMuc2luayA9IHNpbms7XG4gICAgICAgIFxuICAgICAgICB0aGlzLnN0YXJ0ZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5hY3RpdmUgPSBmYWxzZTtcbiAgICB9XG4gICAgICAgIFxuICAgIG9ubW91c2Vkb3duKGUpIHtcbiAgICAgICAgaWYgKCF0aGlzLnN0YXJ0ZWQpIHtcbiAgICAgICAgICAgIHRoaXMuc3RhcnRlZCA9IHRydWU7XG4gICAgICAgICAgICAvLyBDbGVhciB0aGUgY3VycmVudCBhcmVhIHRoZSBmaXJzdCB0aW1lIGFyb3VuZFxuICAgICAgICAgICAgdGhpcy5zaW5rLmFyZWEgPSBbXTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgdGhpcy5hY3RpdmUgPSB0cnVlO1xuICAgICAgICB0aGlzLmFkZFBvaW50KGUpO1xuICAgIH1cbiAgICBcbiAgICBvbm1vdXNlbW92ZShlKSB7XG4gICAgICAgIGlmICh0aGlzLmFjdGl2ZSkge1xuICAgICAgICAgICAgdGhpcy5hZGRQb2ludChlKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBvbm1vdXNldXAoZSkge1xuICAgICAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlO1xuICAgIH1cbiAgICBcbiAgICBzdG9wKCkge1xuICAgICAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLnN0YXJ0ZWQgPSBmYWxzZTtcbiAgICB9XG4gICAgXG4gICAgYWRkUG9pbnQoZSkge1xuICAgICAgICB0aGlzLnNpbmsuYXJlYS5wdXNoKHt4OiBlLmNsaWVudFgsIHk6IGUuY2xpZW50WX0pO1xuICAgIH1cbn0iLCJpbXBvcnQgTW9kZSBmcm9tIFwiLi9Nb2RlXCI7XG5pbXBvcnQgQXJlYVNpbmtCZWhhdmlvciBmcm9tIFwiLi4vYmVoYXZpb3JzL0FyZWFTaW5rQmVoYXZpb3JcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmFuZG9tQXJlYVJlc2V0TW9kZSBleHRlbmRzIE1vZGUge1xuICAgIGNvbnN0cnVjdG9yKHNpbmspIHtcbiAgICAgICAgdGhpcy5uYW1lID0gXCJSYW5kb20gUmVjdFwiO1xuICAgICAgICB0aGlzLmRlc2NyaXB0aW9uID0gXCJDbGljayBhbnl3aGVyZSB0byByYW5kb21seSByZXNldCB0aGUgdGFyZ2V0IHNoYXBlLlwiO1xuICAgICAgICB0aGlzLnNpbmsgPSBzaW5rO1xuICAgIH1cbiAgICBcbiAgICBvbmNsaWNrKGUpIHtcbiAgICAgICAgdGhpcy5zaW5rLmFyZWEgPSBBcmVhU2lua0JlaGF2aW9yLlJlY3RhbmdsZShcbiAgICAgICAgICAgICAgICBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAod2luZG93LmlubmVyV2lkdGggLyAyKSksIFxuICAgICAgICAgICAgICAgIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICh3aW5kb3cuaW5uZXJIZWlnaHQgLyAyKSksIFxuICAgICAgICAgICAgICAgIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICh3aW5kb3cuaW5uZXJXaWR0aCAvIDMpKSwgXG4gICAgICAgICAgICAgICAgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKHdpbmRvdy5pbm5lckhlaWdodCAvIDMpKSkuYXJlYTtcbiAgICB9XG59Il19
