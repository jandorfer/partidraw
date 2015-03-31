(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var ParticleScene = _interopRequire(require("./ParticleScene"));

var AreaSinkBehavior = _interopRequire(require("./behaviors/AreaSinkBehavior"));

var FireflyBehavior = _interopRequire(require("./behaviors/FireflyBehavior"));

var WrappingBoundsBehavior = _interopRequire(require("./behaviors/WrappingBoundsBehavior"));

var PARTICLE_COUNT = 1500;

function setup() {
    var renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.view);
    renderer.view.style.position = "absolute";
    renderer.view.style.left = "0";
    renderer.view.style.top = "0";

    var boundsWrapping = new WrappingBoundsBehavior(window.innerWidth, window.innerHeight);

    var particles = new ParticleScene(PARTICLE_COUNT, new FireflyBehavior(), AreaSinkBehavior.Rectangle(0, 0, window.innerWidth, window.innerHeight), boundsWrapping);

    var update = function () {
        particles.update();
        renderer.render(particles.container);
        requestAnimationFrame(update);
    };
    requestAnimationFrame(update);

    var resize = function () {
        var width = window.innerWidth,
            height = window.innerHeight;
        boundsWrapping.width = width;
        boundsWrapping.height = height;
        renderer.view.style.width = width + "px";
        renderer.view.style.height = height + "px";
        renderer.resize(width, height);
    };
    window.addEventListener("resize", resize);
    window.onorientationchange = resize;

    window.onclick = function () {
        particles.behaviors[1].area = AreaSinkBehavior.Rectangle(Math.floor(Math.random() * (window.innerWidth / 2)), Math.floor(Math.random() * (window.innerHeight / 2)), Math.floor(Math.random() * (window.innerWidth / 3)), Math.floor(Math.random() * (window.innerHeight / 3))).area;
    };
}

document.addEventListener("DOMContentLoaded", setup);

},{"./ParticleScene":2,"./behaviors/AreaSinkBehavior":3,"./behaviors/FireflyBehavior":5,"./behaviors/WrappingBoundsBehavior":6}],2:[function(require,module,exports){
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

},{"./Behavior":4}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJEOi9kZXYvcGFydGlkcmF3L3NyYy9wYXJ0aWRyYXcuanMiLCJEOi9kZXYvcGFydGlkcmF3L3NyYy9QYXJ0aWNsZVNjZW5lLmpzIiwiRDovZGV2L3BhcnRpZHJhdy9zcmMvYmVoYXZpb3JzL0FyZWFTaW5rQmVoYXZpb3IuanMiLCJEOi9kZXYvcGFydGlkcmF3L3NyYy9iZWhhdmlvcnMvQmVoYXZpb3IuanMiLCJEOi9kZXYvcGFydGlkcmF3L3NyYy9iZWhhdmlvcnMvRmlyZWZseUJlaGF2aW9yLmpzIiwiRDovZGV2L3BhcnRpZHJhdy9zcmMvYmVoYXZpb3JzL1dyYXBwaW5nQm91bmRzQmVoYXZpb3IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0lDQU8sYUFBYSwyQkFBTSxpQkFBaUI7O0lBQ3BDLGdCQUFnQiwyQkFBTSw4QkFBOEI7O0lBQ3BELGVBQWUsMkJBQU0sNkJBQTZCOztJQUNsRCxzQkFBc0IsMkJBQU0sb0NBQW9DOztBQUV2RSxJQUFNLGNBQWMsR0FBRyxJQUFJLENBQUM7O0FBRTVCLFNBQVMsS0FBSyxHQUFHO0FBQ2hCLFFBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUMzRSxZQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDNUMsWUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLFVBQVUsQ0FBQztBQUMxQyxZQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDO0FBQy9CLFlBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7O0FBRTlCLFFBQUksY0FBYyxHQUFH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QUFVLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFBO0FBQ3hFLHdCQUFRLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDO0FBQ3JDLHdCQUFRLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxHQUFHLENBQUM7QUFDcEMsd0JBQVEsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEdBQUcsQ0FBQzthQUN4Qzs7QUFFRCxjQUFNO21CQUFBLGdCQUFDLFFBQVEsRUFBRTtBQUNiLHdCQUFRLENBQUMsU0FBUyxJQUFJLFFBQVEsQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDO0FBQzFDLHdCQUFRLENBQUMsVUFBVSxJQUFJLFFBQVEsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDO0FBQzVDLHdCQUFRLENBQUMsSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsR0FBRyxDQUFBLEFBQUMsQ0FBQztBQUM5QyxvQkFBSSxRQUFRLENBQUMsSUFBSSxHQUFHLENBQUMsRUFBRSxRQUFRLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztBQUN6QyxvQkFBSSxRQUFRLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDM0Msd0JBQVEsQ0FBQyxLQUFLLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxHQUFHLENBQUEsQUFBQyxDQUFDOztBQUUvQyx3QkFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQztBQUNyRSx3QkFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQzs7O0FBR3JFLG9CQUFJLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsR0FBRyxJQUFJLENBQUM7QUFDaEQsd0JBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQztBQUN6Qix3QkFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDO2FBQzVCOzs7O1dBekJnQixlQUFlO0dBQVMsUUFBUTs7aUJBQWhDLGVBQWU7Ozs7Ozs7Ozs7Ozs7SUNGN0IsUUFBUSwyQkFBTSxZQUFZOztJQUVaLHNCQUFzQjtBQUU1QixhQUZNLHNCQUFzQixDQUUzQixLQUFLLEVBQUUsTUFBTSxFQUFFOzhCQUZWLHNCQUFzQjs7QUFHbkMsWUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7QUFDbkIsWUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7S0FDeEI7O2NBTGdCLHNCQUFzQjs7aUJBQXRCLHNCQUFzQjtBQU92QyxjQUFNO21CQUFBLGdCQUFDLFFBQVEsRUFBRTtBQUNiLG9CQUFJLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLEVBQUU7QUFDbEMsNEJBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7aUJBQzFELE1BQU0sSUFBSSxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUU7QUFDaEMsNEJBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7aUJBQzFEOztBQUVELG9CQUFJLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUU7QUFDbkMsNEJBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7aUJBQzNELE1BQU0sSUFBSSxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUU7QUFDaEMsNEJBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7aUJBQzNEO2FBQ0o7Ozs7V0FuQmdCLHNCQUFzQjtHQUFTLFFBQVE7O2lCQUF2QyxzQkFBc0IiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IFBhcnRpY2xlU2NlbmUgZnJvbSBcIi4vUGFydGljbGVTY2VuZVwiO1xyXG5pbXBvcnQgQXJlYVNpbmtCZWhhdmlvciBmcm9tIFwiLi9iZWhhdmlvcnMvQXJlYVNpbmtCZWhhdmlvclwiO1xyXG5pbXBvcnQgRmlyZWZseUJlaGF2aW9yIGZyb20gXCIuL2JlaGF2aW9ycy9GaXJlZmx5QmVoYXZpb3JcIjtcclxuaW1wb3J0IFdyYXBwaW5nQm91bmRzQmVoYXZpb3IgZnJvbSBcIi4vYmVoYXZpb3JzL1dyYXBwaW5nQm91bmRzQmVoYXZpb3JcIjtcclxuXHJcbmNvbnN0IFBBUlRJQ0xFX0NPVU5UID0gMTUwMDtcclxuXHJcbmZ1bmN0aW9uIHNldHVwKCkge1xyXG5cdGxldCByZW5kZXJlciA9IFBJWEkuYXV0b0RldGVjdFJlbmRlcmVyKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xyXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChyZW5kZXJlci52aWV3KTtcclxuXHRyZW5kZXJlci52aWV3LnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xyXG5cdHJlbmRlcmVyLnZpZXcuc3R5bGUubGVmdCA9IFwiMFwiO1xyXG5cdHJlbmRlcmVyLnZpZXcuc3R5bGUudG9wID0gXCIwXCI7XHJcblx0XHJcblx0bGV0IGJvdW5kc1dyYXBwaW5nID0gbmV3IFdyYXBwaW5nQm91bmRzQmVoYXZpb3Iod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XHJcblx0XHJcblx0bGV0IHBhcnRpY2xlcyA9IG5ldyBQYXJ0aWNsZVNjZW5lKFxyXG4gICAgICAgICAgICBQQVJUSUNMRV9DT1VOVCwgXHJcbiAgICAgICAgICAgIG5ldyBGaXJlZmx5QmVoYXZpb3IoKSwgXHJcbiAgICAgICAgICAgIEFyZWFTaW5rQmVoYXZpb3IuUmVjdGFuZ2xlKDAsIDAsIHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpLFxyXG4gICAgICAgICAgICBib3VuZHNXcmFwcGluZyk7XHJcbiAgICAgICAgICAgIFxyXG5cdHZhciB1cGRhdGUgPSAoKSA9PiB7XHJcbiAgICAgICAgcGFydGljbGVzLnVwZGF0ZSgpO1xyXG4gICAgICAgIHJlbmRlcmVyLnJlbmRlcihwYXJ0aWNsZXMuY29udGFpbmVyKTtcclxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodXBkYXRlKTtcclxuXHR9XHJcblx0cmVxdWVzdEFuaW1hdGlvbkZyYW1lKHVwZGF0ZSk7XHJcblx0XHJcblx0dmFyIHJlc2l6ZSA9ICgpID0+IHtcclxuXHRcdGxldCB3aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoLCBoZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7IFxyXG5cdFx0Ym91bmRzV3JhcHBpbmcud2lkdGggPSB3aWR0aDtcclxuXHRcdGJvdW5kc1dyYXBwaW5nLmhlaWdodCA9IGhlaWdodDtcclxuICAgICAgICByZW5kZXJlci52aWV3LnN0eWxlLndpZHRoID0gd2lkdGggKyBcInB4XCJcclxuICAgICAgICByZW5kZXJlci52aWV3LnN0eWxlLmhlaWdodCA9IGhlaWdodCArIFwicHhcIlxyXG4gICAgICAgIHJlbmRlcmVyLnJlc2l6ZSh3aWR0aCwgaGVpZ2h0KTtcclxuXHR9XHJcblx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHJlc2l6ZSk7XHJcbiAgICB3aW5kb3cub25vcmllbnRhdGlvbmNoYW5nZSA9IHJlc2l6ZTtcclxuICAgIFxyXG4gICAgd2luZG93Lm9uY2xpY2sgPSAoKSA9PiB7XHJcbiAgICAgICAgcGFydGljbGVzLmJlaGF2aW9yc1sxXS5hcmVhID0gQXJlYVNpbmtCZWhhdmlvci5SZWN0YW5nbGUoXHJcbiAgICAgICAgICAgIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICh3aW5kb3cuaW5uZXJXaWR0aCAvIDIpKSwgXHJcbiAgICAgICAgICAgIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICh3aW5kb3cuaW5uZXJIZWlnaHQgLyAyKSksIFxyXG4gICAgICAgICAgICBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAod2luZG93LmlubmVyV2lkdGggLyAzKSksIFxyXG4gICAgICAgICAgICBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAod2luZG93LmlubmVySGVpZ2h0IC8gMykpKS5hcmVhO1xyXG4gICAgfVxyXG59XHJcblxyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgc2V0dXApO1xyXG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBQYXJ0aWNsZVNjZW5lIHtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihjb3VudCwgLi4uYmVoYXZpb3JzKSB7XHJcbiAgICAgICAgdGhpcy5wYXJ0aWNsZXMgPSBbXTtcclxuICAgICAgICB0aGlzLmJlaGF2aW9ycyA9IGJlaGF2aW9ycztcclxuICAgICAgICB0aGlzLmNvbnRhaW5lciA9IG5ldyBQSVhJLlBhcnRpY2xlQ29udGFpbmVyKGNvdW50LCBbdHJ1ZSwgdHJ1ZSwgZmFsc2UsIHRydWUsIHRydWVdKTtcclxuICAgICAgICB0aGlzLnRleHR1cmUgPSBuZXcgUElYSS5UZXh0dXJlLmZyb21JbWFnZShcInNwcml0ZS5wbmdcIik7XHJcbiAgICAgICAgXHJcbiAgICAgICAgZm9yIChsZXQgaT0wOyBpPGNvdW50OyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIHBhcnRpY2xlID0gbmV3IFBJWEkuU3ByaXRlKHRoaXMudGV4dHVyZSk7XHJcbiAgICAgICAgICAgIHBhcnRpY2xlLmFuY2hvci5zZXQoMC41KTtcclxuICAgICAgICAgICAgcGFydGljbGUuc2NhbGUueCA9IDAuMjtcclxuICAgICAgICAgICAgcGFydGljbGUuc2NhbGUueSA9IDAuMjtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIEJVRyBQaXhpIHYzIHJjNCBQYXJ0aWNsZUNvbnRhaW5lciBkb2Vzbid0IHN1cHBvcnQgdHJhbnNwYXJlbmN5IGF0IGFsbFxyXG4gICAgICAgICAgICBwYXJ0aWNsZS5hbHBoYSA9IDAuNjtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGZvciAobGV0IGo9MDsgajxiZWhhdmlvcnMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIGJlaGF2aW9yc1tqXS5pbml0aWFsaXplKHBhcnRpY2xlLCBpLCBjb3VudCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMucGFydGljbGVzLnB1c2gocGFydGljbGUpO1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5hZGRDaGlsZChwYXJ0aWNsZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICB1cGRhdGUoKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaT0wOyBpPHRoaXMucGFydGljbGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGo9MDsgajx0aGlzLmJlaGF2aW9ycy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5iZWhhdmlvcnNbal0udXBkYXRlKHRoaXMucGFydGljbGVzW2ldKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsImltcG9ydCBCZWhhdmlvciBmcm9tIFwiLi9CZWhhdmlvclwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXJlYVNpbmtCZWhhdmlvciBleHRlbmRzIEJlaGF2aW9yIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihhcmVhKSB7XHJcbiAgICAgICAgdGhpcy5hcmVhID0gYXJlYTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0aWFsaXplKHBhcnRpY2xlLCBpbmRleCwgY291bnQpIHtcclxuICAgICAgICBwYXJ0aWNsZS5wZXJjZW50SW5kZXggPSAoMS4wICogaW5kZXgpIC8gKDEuMCAqIGNvdW50KTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgdXBkYXRlKHBhcnRpY2xlKSB7XHJcbiAgICAgICAgbGV0IHBvcyA9IE1hdGguZmxvb3IodGhpcy5hcmVhLmxlbmd0aCAqIHBhcnRpY2xlLnBlcmNlbnRJbmRleCk7XHJcbiAgICAgICAgbGV0IHNpbmsgPSB0aGlzLmFyZWFbcG9zXTtcclxuICAgICAgICBsZXQgZGlyZWN0aW9uID0gTWF0aC5hdGFuMihzaW5rLnggLSBwYXJ0aWNsZS5wb3NpdGlvbi54LCBzaW5rLnkgLSBwYXJ0aWNsZS5wb3NpdGlvbi55KTtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgc3BlZWQgPSBwYXJ0aWNsZS5zcGVlZDtcclxuICAgICAgICBpZiAoc3BlZWQgPD0gMCkgc3BlZWQgPSAwLjE7XHJcbiAgICAgICAgc3BlZWQgPSBzcGVlZCAqICgwLjEgKiBNYXRoLnNxcnQoTWF0aC5wb3coc2luay54IC0gcGFydGljbGUucG9zaXRpb24ueCwgMiksIE1hdGgucG93KHNpbmsueSAtIHBhcnRpY2xlLnBvc2l0aW9uLnkpKSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcGFydGljbGUucG9zaXRpb24ueCArPSBNYXRoLnNpbihkaXJlY3Rpb24pICogc3BlZWQ7XHJcbiAgICAgICAgcGFydGljbGUucG9zaXRpb24ueSArPSBNYXRoLmNvcyhkaXJlY3Rpb24pICogc3BlZWQ7XHJcbiAgICB9XHJcbiAgICAgICAgXHJcbiAgICBzdGF0aWMgc2h1ZmZsZShhcnJheSkge1xyXG4gICAgICAgIHZhciBjdXJyZW50SW5kZXggPSBhcnJheS5sZW5ndGgsIHRlbXBvcmFyeVZhbHVlLCByYW5kb21JbmRleCA7XHJcblxyXG4gICAgICAgIHdoaWxlICgwICE9PSBjdXJyZW50SW5kZXgpIHtcclxuICAgICAgICAgICAgcmFuZG9tSW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjdXJyZW50SW5kZXgpO1xyXG4gICAgICAgICAgICBjdXJyZW50SW5kZXggLT0gMTtcclxuXHJcbiAgICAgICAgICAgIHRlbXBvcmFyeVZhbHVlID0gYXJyYXlbY3VycmVudEluZGV4XTtcclxuICAgICAgICAgICAgYXJyYXlbY3VycmVudEluZGV4XSA9IGFycmF5W3JhbmRvbUluZGV4XTtcclxuICAgICAgICAgICAgYXJyYXlbcmFuZG9tSW5kZXhdID0gdGVtcG9yYXJ5VmFsdWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gYXJyYXk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHN0YXRpYyBSZWN0YW5nbGUoeCwgeSwgd2lkdGgsIGhlaWdodCkge1xyXG4gICAgICAgIGlmICh3aWR0aCA8PSAwKSB3aWR0aCA9IDE7XHJcbiAgICAgICAgaWYgKGhlaWdodCA8PSAwKSBoZWlnaHQgPSAxO1xyXG4gICAgICAgIGxldCBhcmVhID0gbmV3IEFycmF5KHdpZHRoICogaGVpZ2h0KTtcclxuICAgICAgICBmb3IgKGxldCBpPTA7IGk8d2lkdGg7IGkrKykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBqPTA7IGo8aGVpZ2h0OyBqKyspIHtcclxuICAgICAgICAgICAgICAgIGFyZWFbaiAqIHdpZHRoICsgaV0gPSB7eDogeCArIGksIHk6IHkgKyBqfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBhcmVhID0gQXJlYVNpbmtCZWhhdmlvci5zaHVmZmxlKGFyZWEpO1xyXG4gICAgICAgIHJldHVybiBuZXcgQXJlYVNpbmtCZWhhdmlvcihhcmVhKTtcclxuICAgIH1cclxufSIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIEJlaGF2aW9yIHtcclxuXHJcbiAgICBpbml0aWFsaXplKHBhcnRpY2xlKSB7fVxyXG4gICAgXHJcbiAgICB1cGRhdGUocGFydGljbGUpIHt9XHJcbn0iLCJpbXBvcnQgQmVoYXZpb3IgZnJvbSBcIi4vQmVoYXZpb3JcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZpcmVmbHlCZWhhdmlvciBleHRlbmRzIEJlaGF2aW9yIHtcclxuXHJcbiAgICBpbml0aWFsaXplKHBhcnRpY2xlKSB7XHJcbiAgICAgICAgcGFydGljbGUuZGlyZWN0aW9uID0gcGFydGljbGUuZGlyZWN0aW9uIHx8IE1hdGgucmFuZG9tKCkgKiBNYXRoLlBJICogMjtcclxuICAgICAgICBwYXJ0aWNsZS56ZGlyZWN0aW9uID0gcGFydGljbGUuemRpcmVjdGlvbiB8fCBNYXRoLnJhbmRvbSgpICogTWF0aC5QSSAqIDJcclxuICAgICAgICBwYXJ0aWNsZS5zcGVlZCA9IHBhcnRpY2xlLnNwZWVkIHx8IDE7XHJcbiAgICAgICAgcGFydGljbGUudHVybiA9IE1hdGgucmFuZG9tKCkgLSAwLjU7XHJcbiAgICAgICAgcGFydGljbGUuenR1cm4gPSBNYXRoLnJhbmRvbSgpIC0gMC41O1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICB1cGRhdGUocGFydGljbGUpIHtcclxuICAgICAgICBwYXJ0aWNsZS5kaXJlY3Rpb24gKz0gcGFydGljbGUudHVybiAqIDAuMTtcclxuICAgICAgICBwYXJ0aWNsZS56ZGlyZWN0aW9uICs9IHBhcnRpY2xlLnp0dXJuICogMC41O1xyXG4gICAgICAgIHBhcnRpY2xlLnR1cm4gKz0gMC4xNSAqIChNYXRoLnJhbmRvbSgpIC0gMC41KTtcclxuICAgICAgICBpZiAocGFydGljbGUudHVybiA+IDEpIHBhcnRpY2xlLnR1cm4gPSAxO1xyXG4gICAgICAgIGlmIChwYXJ0aWNsZS50dXJuIDwgLTEpIHBhcnRpY2xlLnR1cm4gPSAtMTtcclxuICAgICAgICBwYXJ0aWNsZS56dHVybiArPSAwLjA1ICogKE1hdGgucmFuZG9tKCkgLSAwLjUpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHBhcnRpY2xlLnBvc2l0aW9uLnggKz0gTWF0aC5zaW4ocGFydGljbGUuZGlyZWN0aW9uKSAqIHBhcnRpY2xlLnNwZWVkO1xyXG4gICAgICAgIHBhcnRpY2xlLnBvc2l0aW9uLnkgKz0gTWF0aC5jb3MocGFydGljbGUuZGlyZWN0aW9uKSAqIHBhcnRpY2xlLnNwZWVkO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIEJVRyBQaXhpIHYzIHJjNCBQYXJ0aWNsZUNvbnRhaW5lciBub3QgYWxsb3dpbmcgc2NhbGUgYW5pbWF0aW9uXHJcbiAgICAgICAgbGV0IHpvZmYgPSBNYXRoLnNpbihwYXJ0aWNsZS56ZGlyZWN0aW9uKSAqIDAuMDU7XHJcbiAgICAgICAgcGFydGljbGUuc2NhbGUueCArPSB6b2ZmO1xyXG4gICAgICAgIHBhcnRpY2xlLnNjYWxlLnkgKz0gem9mZjtcclxuICAgIH1cclxufSIsImltcG9ydCBCZWhhdmlvciBmcm9tIFwiLi9CZWhhdmlvclwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV3JhcHBpbmdCb3VuZHNCZWhhdmlvciBleHRlbmRzIEJlaGF2aW9yIHtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih3aWR0aCwgaGVpZ2h0KSB7XHJcbiAgICAgICAgdGhpcy53aWR0aCA9IHdpZHRoO1xyXG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZShwYXJ0aWNsZSkge1xyXG4gICAgICAgIGlmIChwYXJ0aWNsZS5wb3NpdGlvbi54ID4gdGhpcy53aWR0aCkge1xyXG4gICAgICAgICAgICBwYXJ0aWNsZS5wb3NpdGlvbi54ID0gcGFydGljbGUucG9zaXRpb24ueCAtIHRoaXMud2lkdGg7XHJcbiAgICAgICAgfSBlbHNlIGlmIChwYXJ0aWNsZS5wb3NpdGlvbi54IDwgMCkge1xyXG4gICAgICAgICAgICBwYXJ0aWNsZS5wb3NpdGlvbi54ID0gcGFydGljbGUucG9zaXRpb24ueCArIHRoaXMud2lkdGg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGlmIChwYXJ0aWNsZS5wb3NpdGlvbi55ID4gdGhpcy5oZWlnaHQpIHtcclxuICAgICAgICAgICAgcGFydGljbGUucG9zaXRpb24ueSA9IHBhcnRpY2xlLnBvc2l0aW9uLnkgLSB0aGlzLmhlaWdodDtcclxuICAgICAgICB9IGVsc2UgaWYgKHBhcnRpY2xlLnBvc2l0aW9uLnkgPCAwKSB7XHJcbiAgICAgICAgICAgIHBhcnRpY2xlLnBvc2l0aW9uLnkgPSBwYXJ0aWNsZS5wb3NpdGlvbi55ICsgdGhpcy5oZWlnaHQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59Il19
