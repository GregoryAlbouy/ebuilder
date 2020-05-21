"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

Object.defineProperty(exports, "__esModule", {
  value: true
});

var EBuilderError_1 = require("./EBuilderError");

var EBuilderAnimation = /*#__PURE__*/function () {
  function EBuilderAnimation(duration) {
    var _this = this;

    (0, _classCallCheck2["default"])(this, EBuilderAnimation);
    this.duration = 200;
    this.then = {
      then: function then(resolve) {
        return setTimeout(resolve, _this.duration);
      }
    };
    if (duration && duration < 0) throw new EBuilderError_1["default"]('Invalid animation duration', name);else this.duration = duration || this.duration;
  }
  /*
   * Using css transitions
   */


  (0, _createClass2["default"])(EBuilderAnimation, [{
    key: "swap",
    value: function swap(a, b) {
      var _this2 = this;

      var offset = {
        h: b.getBoundingClientRect().left - a.getBoundingClientRect().left,
        v: b.getBoundingClientRect().top - a.getBoundingClientRect().top
      };
      [a, b].map(function (elt) {
        return elt.style.transition = "transform ".concat(_this2.duration, "ms");
      });
      a.style.transform = "translate(".concat(offset.h, "px, ").concat(offset.v, "px)");
      b.style.transform = "translate(".concat(-offset.h, "px, ").concat(-offset.v, "px)");
      setTimeout(function () {
        [a, b].forEach(function (elt) {
          elt.style.transform = '';
          elt.style.transition = '';
        });
      }, this.duration);
    }
  }, {
    key: "swap2",
    value: function swap2(a, b) {
      var _this3 = this;

      var dist = {
        x: b.getBoundingClientRect().left - a.getBoundingClientRect().left,
        y: b.getBoundingClientRect().top - a.getBoundingClientRect().top
      };
      var vOffsetMax = a.getBoundingClientRect().height / 2;

      var step = function step(timestamp) {
        progress = (timestamp - start) / _this3.duration;
        if (progress > 1) progress = 1;
        dy = progress <= .5 ? vOffsetMax * progress * 2 : vOffsetMax * (1 - progress) * 2;
        a.style.transform = "translate(".concat(dist.x * progress, "px, ").concat(dist.y * progress + dy, "px)");
        b.style.transform = "translate(".concat(-dist.x * progress, "px, ").concat(-dist.y * progress - dy, "px)");
        progress < 1 ? requestAnimationFrame(step) : end();
      };

      var end = function end() {
        [a, b].forEach(function (elt) {
          return elt.style.transform = '';
        });
      };

      var dy = 0,
          progress = 0,
          start = performance.now();
      requestAnimationFrame(step);
      return this.then;
    }
  }]);
  return EBuilderAnimation;
}();

exports["default"] = EBuilderAnimation;