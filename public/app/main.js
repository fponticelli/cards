(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
var __moduleName = "client/main";
var Stream = require('streamy/stream').Stream;
var Fragment = require('./ui/fragment').Fragment;
var $__0 = require('./ui/properties'),
    Properties = $__0.Properties,
    Formats = $__0.Formats,
    Editors = $__0.Editors;
var $__0 = require('ui/dom'),
    Dom = $__0.Dom,
    Query = $__0.Query;
var StringValue = require('streamy/value').StringValue;
Dom.ready((function() {
  var container = document.querySelector('.container'),
      editor = new Fragment(),
      number = new Fragment(),
      fragment = new Fragment();
  editor.attachTo(container);
  number.attachTo(container);
  fragment.attachTo(container);
  Properties.addText(editor);
  Properties.addText(fragment);
  Properties.addText(number);
  Properties.addValue(fragment, "String");
  fragment.value = " Hey Franco";
  fragment.value.feed(fragment.text);
  Properties.addValue(number, "Float");
  Properties.addVisible(fragment);
  Stream.interval(300).cancelOn(Stream.delay(6500).subscribe((function() {
    return Properties.removeVisible(fragment);
  }))).reduce(true, (function(acc) {
    return !acc;
  })).feed(fragment.visible);
  Properties.addStrong(fragment, true);
  Formats.addNumeric(number, "$ 0,0.00");
  Stream.sequence(["$ 0,0.00", "0.000", "0,0"], 2000, true).feed(number.format);
  Properties.addLink(number);
  number.link = "http://google.com";
  Stream.delay(5000).subscribe((function() {
    return Properties.removeLink(number);
  }));
  Stream.delay(8000).subscribe((function() {
    return Properties.removeTooltip(number);
  }));
  Properties.addTooltip(number, "tooltip text goes here");
  Stream.interval(1000).reduce(0, (function(acc) {
    return acc + 3000 / 7;
  })).feed(number.value);
  Editors.addText(editor);
  editor.editor.value.log();
  editor.editor.focus();
}));


},{"./ui/fragment":3,"./ui/properties":4,"streamy/stream":17,"streamy/value":18,"ui/dom":20}],2:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<span class=\"fragment\"><span class=\"content\"></span></span>");;return buf.join("");
};
},{"jade/runtime":15}],3:[function(require,module,exports){
"use strict";
var __moduleName = "client/ui/fragment";
var Html = require('ui/dom').Html;
var $__1 = require('./propertycontainer'),
    PropertyContainer = $__1.PropertyContainer,
    $ = $__1.$;
var template = require('./fragment.jade')();
var Fragment = function Fragment() {
  $traceurRuntime.superCall(this, $Fragment.prototype, "constructor", [Html.parse(template)]);
};
var $Fragment = Fragment;
($traceurRuntime.createClass)(Fragment, {
  attachTo: function(container) {
    container.appendChild(this[$]);
  },
  detach: function() {
    if (!this[$].parentNode)
      throw new Error('Fragment is not attached');
    this[$].parentNode.removeChild(this[$]);
  }
}, {}, PropertyContainer);
;
module.exports = {
  get Fragment() {
    return Fragment;
  },
  __esModule: true
};


},{"./fragment.jade":2,"./propertycontainer":5,"ui/dom":20}],4:[function(require,module,exports){
"use strict";
var __moduleName = "client/ui/properties";
var string = require('string'),
    numeral = require('numeral');
var $__2 = require('ui/dom'),
    Dom = $__2.Dom,
    Query = $__2.Query;
var $__2 = require('streamy/value'),
    StringValue = $__2.StringValue,
    BoolValue = $__2.BoolValue,
    FloatValue = $__2.FloatValue,
    DateValue = $__2.DateValue;
function addSwapClassFragment(name) {
  var className = arguments[1] !== (void 0) ? arguments[1] : name;
  return function(fragment) {
    var defaultValue = arguments[1] !== (void 0) ? arguments[1] : false;
    fragment.addValue(name, new BoolValue(defaultValue), function(value, el) {
      return Dom.stream(value).applySwapClass(el, className);
    });
  };
}
function addAttributeFragment(name, attribute) {
  return function(fragment) {
    var text = arguments[1] !== (void 0) ? arguments[1] : "";
    fragment.addValue(name, new StringValue(text), function(value, el) {
      return Dom.stream(value).applyAttribute(attribute, el);
    });
  };
}
function createValue(type) {
  for (var args = [],
      $__0 = 1; $__0 < arguments.length; $__0++)
    args[$__0 - 1] = arguments[$__0];
  switch (type) {
    case "String":
      return new (Function.prototype.bind.apply(StringValue, $traceurRuntime.spread([null], args)))();
    case "Bool":
      return new (Function.prototype.bind.apply(BoolValue, $traceurRuntime.spread([null], args)))();
    case "Float":
      return new (Function.prototype.bind.apply(FloatValue, $traceurRuntime.spread([null], args)))();
    case "Date":
      return new (Function.prototype.bind.apply(DateValue, $traceurRuntime.spread([null], args)))();
  }
}
var p = {
  value: function(fragment, type) {
    for (var args = [],
        $__1 = 2; $__1 < arguments.length; $__1++)
      args[$__1 - 2] = arguments[$__1];
    var value = typeof type === "string" ? createValue.apply(null, $traceurRuntime.spread([type], args)) : type;
    fragment.addValue("value", value, function(value, el) {
      return (function() {});
    });
  },
  text: function(fragment) {
    var text = arguments[1] !== (void 0) ? arguments[1] : "";
    fragment.addValue("text", new StringValue(text), function(value, el) {
      var content = Query.first('.content', el);
      return Dom.stream(value).applyText(content);
    });
  },
  visible: function(fragment) {
    var defaultValue = arguments[1] !== (void 0) ? arguments[1] : true;
    fragment.addValue("visible", new BoolValue(defaultValue), function(value, el) {
      return Dom.stream(value).applyDisplay(el);
    });
  },
  strong: addSwapClassFragment('strong'),
  emphasis: addSwapClassFragment('emphasis'),
  strike: addSwapClassFragment('strike'),
  tooltip: addAttributeFragment('tooltip', 'title'),
  link: function(fragment) {
    var url = arguments[1] !== (void 0) ? arguments[1] : "";
    fragment.addValue("link", new StringValue(url), function(value, el) {
      var a = document.createElement('a'),
          ƒ = (function(url) {
            return a.href = url;
          });
      a.target = "_blank";
      {
        try {
          throw undefined;
        } catch ($i) {
          $i = 0;
          for (; $i < el.childNodes.length; $i++) {
            try {
              throw undefined;
            } catch (i) {
              i = $i;
              try {
                a.appendChild(el.childNodes[i]);
              } finally {
                $i = i;
              }
            }
          }
        }
      }
      el.appendChild(a);
      value.subscribe(ƒ);
      return (function() {
        value.unsubscribe(ƒ);
        el.removeChild(a);
        {
          try {
            throw undefined;
          } catch ($i) {
            $i = 0;
            for (; $i < a.childNodes.length; $i++) {
              try {
                throw undefined;
              } catch (i) {
                i = $i;
                try {
                  el.appendChild(a.childNodes[i]);
                } finally {
                  $i = i;
                }
              }
            }
          }
        }
      });
    });
  }
};
var Properties = {};
for (var $name in p) {
  try {
    throw undefined;
  } catch (keyAdd) {
    try {
      throw undefined;
    } catch (keyRemove) {
      try {
        throw undefined;
      } catch (cap) {
        try {
          throw undefined;
        } catch (name) {
          name = $name;
          {
            cap = string(name).capitalize().s;
            keyRemove = 'remove' + cap;
            keyAdd = 'add' + cap;
          }
          Properties[keyAdd] = p[name];
          Properties[keyRemove] = function(fragment) {
            fragment.remove(name);
          };
        }
      }
    }
  }
}
var Formats = {
  addNumeric: function(fragment) {
    var defaultFormat = arguments[1] !== (void 0) ? arguments[1] : "";
    var value = fragment.value,
        text = fragment.text;
    if (!value) {
      throw new Error("'format' requires the property 'value'");
    }
    if (!text) {
      throw new Error("'format' requires the property 'text'");
    }
    fragment.addValue("format", new StringValue(defaultFormat), function(format) {
      var stream = value.zip(format);
      stream.spread((function(value, format) {
        if (format === "") {
          format = Math.floor(value) === value ? "0,0" : "0,0.000";
        }
        text.value = numeral(value).format(format);
      }));
      return stream.cancel.bind(stream);
    });
  },
  remove: function(fragment) {
    fragment.remove('format');
  }
};
var Editors = {
  addText: function(fragment) {
    var container = fragment.addContainer("editor", "value");
    container.addValue("value", new StringValue(""), function(value, el) {
      var content = Query.first('.content', el),
          stream = value.map((function(s) {
            return s.length === 0;
          })).unique(),
          streamƒ = Dom.stream(stream).applySwapClass(content, 'empty'),
          listenƒ = (function(e) {
            value.push(el.innerText);
          });
      content.setAttribute("contenteditable", true);
      content.addEventListener("input", listenƒ, false);
      return function() {
        streamƒ();
        content.removeEventListener("input", listenƒ, false);
        content.removeAttribute("contenteditable");
      };
    });
    container.addBehavior("focus", function(el) {
      var content = Query.first('.content', el);
      return function() {
        content.focus();
      };
    });
  },
  remove: function(fragment) {
    fragment.remove('editor');
  }
};
;
module.exports = {
  get Properties() {
    return Properties;
  },
  get Formats() {
    return Formats;
  },
  get Editors() {
    return Editors;
  },
  __esModule: true
};


},{"numeral":16,"streamy/value":18,"string":19,"ui/dom":20}],5:[function(require,module,exports){
"use strict";
var __moduleName = "client/ui/propertycontainer";
var Html = require('ui/dom').Html;
var u = Symbol(),
    $ = Symbol(),
    _parent = Symbol();
var PropertyContainer = function PropertyContainer(element, parent) {
  this[_parent] = parent;
  this[u] = {};
  this[$] = element;
};
var $PropertyContainer = PropertyContainer;
($traceurRuntime.createClass)(PropertyContainer, {
  addValue: function(name, value, wire) {
    if (name in this)
      throw new Error(("A property '" + name + "' already exists"));
    Object.defineProperty(this, name, {
      configurable: true,
      enumerable: true,
      writeable: false,
      get: (function() {
        return value;
      }),
      set: (function(v) {
        return value.push(v);
      })
    });
    this[u][name] = wire.call(this, value, this[$]);
  },
  addContainer: function(name, defaultField, wire) {
    if (this[u][name])
      throw new Error(("A property '" + name + "' already exists"));
    var container = new $PropertyContainer(this[$], this),
        setter = (defaultField) ? function(v) {
          container[defaultField].push(v);
        } : function() {
          throw new Error('Property Container doesn\'t have a default field');
        },
        unwire = wire && wire.call(this, this[$]) || function() {};
    this[u][name] = (function() {
      unwire();
      container.removeAll.bind(container);
    });
    Object.defineProperty(this, name, {
      configurable: true,
      enumerable: true,
      writeable: false,
      get: (function() {
        return container;
      }),
      set: setter
    });
    return container;
  },
  addBehavior: function(name, wire) {
    var $__0 = this;
    if (this[u][name])
      throw new Error(("A property '" + name + "' already exists"));
    this[u][name] = (function() {});
    var ƒ = wire.call(this, this[$]);
    Object.defineProperty(this, name, {
      configurable: true,
      enumerable: true,
      writeable: false,
      get: (function() {
        return ƒ.bind($__0);
      })
    });
  },
  remove: function(name) {
    if (!this[u][name])
      throw ("Object doesn't contain a property '" + name + "'");
    this[u][name]();
    delete this[u][name];
    delete this[name];
  },
  removeAll: function() {
    for (var $key in this[u]) {
      try {
        throw undefined;
      } catch (key) {
        key = $key;
        this.remove(key);
      }
    }
  },
  properties: function() {
    var arr = [];
    for (var $key in this[u]) {
      try {
        throw undefined;
      } catch (key) {
        key = $key;
        arr.push(key);
      }
    }
    return arr;
  },
  get parent() {
    return this[_parent];
  },
  toJSON: function() {
    var out = {};
    for (var $key in this[u]) {
      try {
        throw undefined;
      } catch (key) {
        key = $key;
        if ("isDefault" in this[key] && this[key].isDefault)
          continue;
        out[key] = this[key].value;
      }
    }
    return out;
  }
}, {});
;
module.exports = {
  get PropertyContainer() {
    return PropertyContainer;
  },
  get $() {
    return $;
  },
  __esModule: true
};


},{"ui/dom":20}],6:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.once = noop;
process.off = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],7:[function(require,module,exports){
(function (process,global){
(function(global) {
  'use strict';
  if (global.$traceurRuntime) {
    return;
  }
  var $Object = Object;
  var $TypeError = TypeError;
  var $create = $Object.create;
  var $defineProperties = $Object.defineProperties;
  var $defineProperty = $Object.defineProperty;
  var $freeze = $Object.freeze;
  var $getOwnPropertyDescriptor = $Object.getOwnPropertyDescriptor;
  var $getOwnPropertyNames = $Object.getOwnPropertyNames;
  var $getPrototypeOf = $Object.getPrototypeOf;
  var $hasOwnProperty = $Object.prototype.hasOwnProperty;
  var $toString = $Object.prototype.toString;
  function nonEnum(value) {
    return {
      configurable: true,
      enumerable: false,
      value: value,
      writable: true
    };
  }
  var types = {
    void: function voidType() {},
    any: function any() {},
    string: function string() {},
    number: function number() {},
    boolean: function boolean() {}
  };
  var method = nonEnum;
  var counter = 0;
  function newUniqueString() {
    return '__$' + Math.floor(Math.random() * 1e9) + '$' + ++counter + '$__';
  }
  var symbolInternalProperty = newUniqueString();
  var symbolDescriptionProperty = newUniqueString();
  var symbolDataProperty = newUniqueString();
  var symbolValues = $create(null);
  function isSymbol(symbol) {
    return typeof symbol === 'object' && symbol instanceof SymbolValue;
  }
  function typeOf(v) {
    if (isSymbol(v))
      return 'symbol';
    return typeof v;
  }
  function Symbol(description) {
    var value = new SymbolValue(description);
    if (!(this instanceof Symbol))
      return value;
    throw new TypeError('Symbol cannot be new\'ed');
  }
  $defineProperty(Symbol.prototype, 'constructor', nonEnum(Symbol));
  $defineProperty(Symbol.prototype, 'toString', method(function() {
    var symbolValue = this[symbolDataProperty];
    if (!getOption('symbols'))
      return symbolValue[symbolInternalProperty];
    if (!symbolValue)
      throw TypeError('Conversion from symbol to string');
    var desc = symbolValue[symbolDescriptionProperty];
    if (desc === undefined)
      desc = '';
    return 'Symbol(' + desc + ')';
  }));
  $defineProperty(Symbol.prototype, 'valueOf', method(function() {
    var symbolValue = this[symbolDataProperty];
    if (!symbolValue)
      throw TypeError('Conversion from symbol to string');
    if (!getOption('symbols'))
      return symbolValue[symbolInternalProperty];
    return symbolValue;
  }));
  function SymbolValue(description) {
    var key = newUniqueString();
    $defineProperty(this, symbolDataProperty, {value: this});
    $defineProperty(this, symbolInternalProperty, {value: key});
    $defineProperty(this, symbolDescriptionProperty, {value: description});
    $freeze(this);
    symbolValues[key] = this;
  }
  $defineProperty(SymbolValue.prototype, 'constructor', nonEnum(Symbol));
  $defineProperty(SymbolValue.prototype, 'toString', {
    value: Symbol.prototype.toString,
    enumerable: false
  });
  $defineProperty(SymbolValue.prototype, 'valueOf', {
    value: Symbol.prototype.valueOf,
    enumerable: false
  });
  $freeze(SymbolValue.prototype);
  Symbol.iterator = Symbol();
  function toProperty(name) {
    if (isSymbol(name))
      return name[symbolInternalProperty];
    return name;
  }
  function getOwnPropertyNames(object) {
    var rv = [];
    var names = $getOwnPropertyNames(object);
    for (var i = 0; i < names.length; i++) {
      var name = names[i];
      if (!symbolValues[name])
        rv.push(name);
    }
    return rv;
  }
  function getOwnPropertyDescriptor(object, name) {
    return $getOwnPropertyDescriptor(object, toProperty(name));
  }
  function getOwnPropertySymbols(object) {
    var rv = [];
    var names = $getOwnPropertyNames(object);
    for (var i = 0; i < names.length; i++) {
      var symbol = symbolValues[names[i]];
      if (symbol)
        rv.push(symbol);
    }
    return rv;
  }
  function hasOwnProperty(name) {
    return $hasOwnProperty.call(this, toProperty(name));
  }
  function getOption(name) {
    return global.traceur && global.traceur.options[name];
  }
  function setProperty(object, name, value) {
    var sym,
        desc;
    if (isSymbol(name)) {
      sym = name;
      name = name[symbolInternalProperty];
    }
    object[name] = value;
    if (sym && (desc = $getOwnPropertyDescriptor(object, name)))
      $defineProperty(object, name, {enumerable: false});
    return value;
  }
  function defineProperty(object, name, descriptor) {
    if (isSymbol(name)) {
      if (descriptor.enumerable) {
        descriptor = $create(descriptor, {enumerable: {value: false}});
      }
      name = name[symbolInternalProperty];
    }
    $defineProperty(object, name, descriptor);
    return object;
  }
  function polyfillObject(Object) {
    $defineProperty(Object, 'defineProperty', {value: defineProperty});
    $defineProperty(Object, 'getOwnPropertyNames', {value: getOwnPropertyNames});
    $defineProperty(Object, 'getOwnPropertyDescriptor', {value: getOwnPropertyDescriptor});
    $defineProperty(Object.prototype, 'hasOwnProperty', {value: hasOwnProperty});
    Object.getOwnPropertySymbols = getOwnPropertySymbols;
    function is(left, right) {
      if (left === right)
        return left !== 0 || 1 / left === 1 / right;
      return left !== left && right !== right;
    }
    $defineProperty(Object, 'is', method(is));
    function assign(target, source) {
      var props = $getOwnPropertyNames(source);
      var p,
          length = props.length;
      for (p = 0; p < length; p++) {
        target[props[p]] = source[props[p]];
      }
      return target;
    }
    $defineProperty(Object, 'assign', method(assign));
    function mixin(target, source) {
      var props = $getOwnPropertyNames(source);
      var p,
          descriptor,
          length = props.length;
      for (p = 0; p < length; p++) {
        descriptor = $getOwnPropertyDescriptor(source, props[p]);
        $defineProperty(target, props[p], descriptor);
      }
      return target;
    }
    $defineProperty(Object, 'mixin', method(mixin));
  }
  function exportStar(object) {
    for (var i = 1; i < arguments.length; i++) {
      var names = $getOwnPropertyNames(arguments[i]);
      for (var j = 0; j < names.length; j++) {
        (function(mod, name) {
          $defineProperty(object, name, {
            get: function() {
              return mod[name];
            },
            enumerable: true
          });
        })(arguments[i], names[j]);
      }
    }
    return object;
  }
  function toObject(value) {
    if (value == null)
      throw $TypeError();
    return $Object(value);
  }
  function spread() {
    var rv = [],
        k = 0;
    for (var i = 0; i < arguments.length; i++) {
      var valueToSpread = toObject(arguments[i]);
      for (var j = 0; j < valueToSpread.length; j++) {
        rv[k++] = valueToSpread[j];
      }
    }
    return rv;
  }
  function getPropertyDescriptor(object, name) {
    while (object !== null) {
      var result = $getOwnPropertyDescriptor(object, name);
      if (result)
        return result;
      object = $getPrototypeOf(object);
    }
    return undefined;
  }
  function superDescriptor(homeObject, name) {
    var proto = $getPrototypeOf(homeObject);
    if (!proto)
      throw $TypeError('super is null');
    return getPropertyDescriptor(proto, name);
  }
  function superCall(self, homeObject, name, args) {
    var descriptor = superDescriptor(homeObject, name);
    if (descriptor) {
      if ('value' in descriptor)
        return descriptor.value.apply(self, args);
      if (descriptor.get)
        return descriptor.get.call(self).apply(self, args);
    }
    throw $TypeError("super has no method '" + name + "'.");
  }
  function superGet(self, homeObject, name) {
    var descriptor = superDescriptor(homeObject, name);
    if (descriptor) {
      if (descriptor.get)
        return descriptor.get.call(self);
      else if ('value' in descriptor)
        return descriptor.value;
    }
    return undefined;
  }
  function superSet(self, homeObject, name, value) {
    var descriptor = superDescriptor(homeObject, name);
    if (descriptor && descriptor.set) {
      descriptor.set.call(self, value);
      return value;
    }
    throw $TypeError("super has no setter '" + name + "'.");
  }
  function getDescriptors(object) {
    var descriptors = {},
        name,
        names = $getOwnPropertyNames(object);
    for (var i = 0; i < names.length; i++) {
      var name = names[i];
      descriptors[name] = $getOwnPropertyDescriptor(object, name);
    }
    return descriptors;
  }
  function createClass(ctor, object, staticObject, superClass) {
    $defineProperty(object, 'constructor', {
      value: ctor,
      configurable: true,
      enumerable: false,
      writable: true
    });
    if (arguments.length > 3) {
      if (typeof superClass === 'function')
        ctor.__proto__ = superClass;
      ctor.prototype = $create(getProtoParent(superClass), getDescriptors(object));
    } else {
      ctor.prototype = object;
    }
    $defineProperty(ctor, 'prototype', {
      configurable: false,
      writable: false
    });
    return $defineProperties(ctor, getDescriptors(staticObject));
  }
  function getProtoParent(superClass) {
    if (typeof superClass === 'function') {
      var prototype = superClass.prototype;
      if ($Object(prototype) === prototype || prototype === null)
        return superClass.prototype;
    }
    if (superClass === null)
      return null;
    throw new TypeError();
  }
  function defaultSuperCall(self, homeObject, args) {
    if ($getPrototypeOf(homeObject) !== null)
      superCall(self, homeObject, 'constructor', args);
  }
  var ST_NEWBORN = 0;
  var ST_EXECUTING = 1;
  var ST_SUSPENDED = 2;
  var ST_CLOSED = 3;
  var END_STATE = -2;
  var RETHROW_STATE = -3;
  function addIterator(object) {
    return defineProperty(object, Symbol.iterator, nonEnum(function() {
      return this;
    }));
  }
  function getInternalError(state) {
    return new Error('Traceur compiler bug: invalid state in state machine: ' + state);
  }
  function GeneratorContext() {
    this.state = 0;
    this.GState = ST_NEWBORN;
    this.storedException = undefined;
    this.finallyFallThrough = undefined;
    this.sent_ = undefined;
    this.returnValue = undefined;
    this.tryStack_ = [];
  }
  GeneratorContext.prototype = {
    pushTry: function(catchState, finallyState) {
      if (finallyState !== null) {
        var finallyFallThrough = null;
        for (var i = this.tryStack_.length - 1; i >= 0; i--) {
          if (this.tryStack_[i].catch !== undefined) {
            finallyFallThrough = this.tryStack_[i].catch;
            break;
          }
        }
        if (finallyFallThrough === null)
          finallyFallThrough = RETHROW_STATE;
        this.tryStack_.push({
          finally: finallyState,
          finallyFallThrough: finallyFallThrough
        });
      }
      if (catchState !== null) {
        this.tryStack_.push({catch: catchState});
      }
    },
    popTry: function() {
      this.tryStack_.pop();
    },
    get sent() {
      this.maybeThrow();
      return this.sent_;
    },
    set sent(v) {
      this.sent_ = v;
    },
    get sentIgnoreThrow() {
      return this.sent_;
    },
    maybeThrow: function() {
      if (this.action === 'throw') {
        this.action = 'next';
        throw this.sent_;
      }
    },
    end: function() {
      switch (this.state) {
        case END_STATE:
          return this;
        case RETHROW_STATE:
          throw this.storedException;
        default:
          throw getInternalError(this.state);
      }
    }
  };
  function getNextOrThrow(ctx, moveNext, action) {
    return function(x) {
      switch (ctx.GState) {
        case ST_EXECUTING:
          throw new Error(("\"" + action + "\" on executing generator"));
        case ST_CLOSED:
          throw new Error(("\"" + action + "\" on closed generator"));
        case ST_NEWBORN:
          if (action === 'throw') {
            ctx.GState = ST_CLOSED;
            throw x;
          }
          if (x !== undefined)
            throw $TypeError('Sent value to newborn generator');
        case ST_SUSPENDED:
          ctx.GState = ST_EXECUTING;
          ctx.action = action;
          ctx.sent = x;
          var value = moveNext(ctx);
          var done = value === ctx;
          if (done)
            value = ctx.returnValue;
          ctx.GState = done ? ST_CLOSED : ST_SUSPENDED;
          return {
            value: value,
            done: done
          };
      }
    };
  }
  function generatorWrap(innerFunction, self) {
    var moveNext = getMoveNext(innerFunction, self);
    var ctx = new GeneratorContext();
    return addIterator({
      next: getNextOrThrow(ctx, moveNext, 'next'),
      throw: getNextOrThrow(ctx, moveNext, 'throw')
    });
  }
  function AsyncFunctionContext() {
    GeneratorContext.call(this);
    this.err = undefined;
    var ctx = this;
    ctx.result = new Promise(function(resolve, reject) {
      ctx.resolve = resolve;
      ctx.reject = reject;
    });
  }
  AsyncFunctionContext.prototype = Object.create(GeneratorContext.prototype);
  AsyncFunctionContext.prototype.end = function() {
    switch (this.state) {
      case END_STATE:
        return;
      case RETHROW_STATE:
        this.reject(this.storedException);
      default:
        this.reject(getInternalError(this.state));
    }
  };
  function asyncWrap(innerFunction, self) {
    var moveNext = getMoveNext(innerFunction, self);
    var ctx = new AsyncFunctionContext();
    ctx.createCallback = function(newState) {
      return function(value) {
        ctx.state = newState;
        ctx.value = value;
        moveNext(ctx);
      };
    };
    ctx.createErrback = function(newState) {
      return function(err) {
        ctx.state = newState;
        ctx.err = err;
        moveNext(ctx);
      };
    };
    moveNext(ctx);
    return ctx.result;
  }
  function getMoveNext(innerFunction, self) {
    return function(ctx) {
      while (true) {
        try {
          return innerFunction.call(self, ctx);
        } catch (ex) {
          ctx.storedException = ex;
          var last = ctx.tryStack_[ctx.tryStack_.length - 1];
          if (!last) {
            ctx.GState = ST_CLOSED;
            ctx.state = END_STATE;
            throw ex;
          }
          ctx.state = last.catch !== undefined ? last.catch : last.finally;
          if (last.finallyFallThrough !== undefined)
            ctx.finallyFallThrough = last.finallyFallThrough;
        }
      }
    };
  }
  function setupGlobals(global) {
    global.Symbol = Symbol;
    polyfillObject(global.Object);
  }
  setupGlobals(global);
  global.$traceurRuntime = {
    asyncWrap: asyncWrap,
    createClass: createClass,
    defaultSuperCall: defaultSuperCall,
    exportStar: exportStar,
    generatorWrap: generatorWrap,
    setProperty: setProperty,
    setupGlobals: setupGlobals,
    spread: spread,
    superCall: superCall,
    superGet: superGet,
    superSet: superSet,
    toObject: toObject,
    toProperty: toProperty,
    type: types,
    typeof: typeOf
  };
})(typeof global !== 'undefined' ? global : this);
(function() {
  function buildFromEncodedParts(opt_scheme, opt_userInfo, opt_domain, opt_port, opt_path, opt_queryData, opt_fragment) {
    var out = [];
    if (opt_scheme) {
      out.push(opt_scheme, ':');
    }
    if (opt_domain) {
      out.push('//');
      if (opt_userInfo) {
        out.push(opt_userInfo, '@');
      }
      out.push(opt_domain);
      if (opt_port) {
        out.push(':', opt_port);
      }
    }
    if (opt_path) {
      out.push(opt_path);
    }
    if (opt_queryData) {
      out.push('?', opt_queryData);
    }
    if (opt_fragment) {
      out.push('#', opt_fragment);
    }
    return out.join('');
  }
  ;
  var splitRe = new RegExp('^' + '(?:' + '([^:/?#.]+)' + ':)?' + '(?://' + '(?:([^/?#]*)@)?' + '([\\w\\d\\-\\u0100-\\uffff.%]*)' + '(?::([0-9]+))?' + ')?' + '([^?#]+)?' + '(?:\\?([^#]*))?' + '(?:#(.*))?' + '$');
  var ComponentIndex = {
    SCHEME: 1,
    USER_INFO: 2,
    DOMAIN: 3,
    PORT: 4,
    PATH: 5,
    QUERY_DATA: 6,
    FRAGMENT: 7
  };
  function split(uri) {
    return (uri.match(splitRe));
  }
  function removeDotSegments(path) {
    if (path === '/')
      return '/';
    var leadingSlash = path[0] === '/' ? '/' : '';
    var trailingSlash = path.slice(-1) === '/' ? '/' : '';
    var segments = path.split('/');
    var out = [];
    var up = 0;
    for (var pos = 0; pos < segments.length; pos++) {
      var segment = segments[pos];
      switch (segment) {
        case '':
        case '.':
          break;
        case '..':
          if (out.length)
            out.pop();
          else
            up++;
          break;
        default:
          out.push(segment);
      }
    }
    if (!leadingSlash) {
      while (up-- > 0) {
        out.unshift('..');
      }
      if (out.length === 0)
        out.push('.');
    }
    return leadingSlash + out.join('/') + trailingSlash;
  }
  function joinAndCanonicalizePath(parts) {
    var path = parts[ComponentIndex.PATH] || '';
    path = removeDotSegments(path);
    parts[ComponentIndex.PATH] = path;
    return buildFromEncodedParts(parts[ComponentIndex.SCHEME], parts[ComponentIndex.USER_INFO], parts[ComponentIndex.DOMAIN], parts[ComponentIndex.PORT], parts[ComponentIndex.PATH], parts[ComponentIndex.QUERY_DATA], parts[ComponentIndex.FRAGMENT]);
  }
  function canonicalizeUrl(url) {
    var parts = split(url);
    return joinAndCanonicalizePath(parts);
  }
  function resolveUrl(base, url) {
    var parts = split(url);
    var baseParts = split(base);
    if (parts[ComponentIndex.SCHEME]) {
      return joinAndCanonicalizePath(parts);
    } else {
      parts[ComponentIndex.SCHEME] = baseParts[ComponentIndex.SCHEME];
    }
    for (var i = ComponentIndex.SCHEME; i <= ComponentIndex.PORT; i++) {
      if (!parts[i]) {
        parts[i] = baseParts[i];
      }
    }
    if (parts[ComponentIndex.PATH][0] == '/') {
      return joinAndCanonicalizePath(parts);
    }
    var path = baseParts[ComponentIndex.PATH];
    var index = path.lastIndexOf('/');
    path = path.slice(0, index + 1) + parts[ComponentIndex.PATH];
    parts[ComponentIndex.PATH] = path;
    return joinAndCanonicalizePath(parts);
  }
  function isAbsolute(name) {
    if (!name)
      return false;
    if (name[0] === '/')
      return true;
    var parts = split(name);
    if (parts[ComponentIndex.SCHEME])
      return true;
    return false;
  }
  $traceurRuntime.canonicalizeUrl = canonicalizeUrl;
  $traceurRuntime.isAbsolute = isAbsolute;
  $traceurRuntime.removeDotSegments = removeDotSegments;
  $traceurRuntime.resolveUrl = resolveUrl;
})();
(function(global) {
  'use strict';
  var $__2 = $traceurRuntime,
      canonicalizeUrl = $__2.canonicalizeUrl,
      resolveUrl = $__2.resolveUrl,
      isAbsolute = $__2.isAbsolute;
  var moduleInstantiators = Object.create(null);
  var baseURL;
  if (global.location && global.location.href)
    baseURL = resolveUrl(global.location.href, './');
  else
    baseURL = '';
  var UncoatedModuleEntry = function UncoatedModuleEntry(url, uncoatedModule) {
    this.url = url;
    this.value_ = uncoatedModule;
  };
  ($traceurRuntime.createClass)(UncoatedModuleEntry, {}, {});
  var UncoatedModuleInstantiator = function UncoatedModuleInstantiator(url, func) {
    $traceurRuntime.superCall(this, $UncoatedModuleInstantiator.prototype, "constructor", [url, null]);
    this.func = func;
  };
  var $UncoatedModuleInstantiator = UncoatedModuleInstantiator;
  ($traceurRuntime.createClass)(UncoatedModuleInstantiator, {getUncoatedModule: function() {
      if (this.value_)
        return this.value_;
      return this.value_ = this.func.call(global);
    }}, {}, UncoatedModuleEntry);
  function getUncoatedModuleInstantiator(name) {
    if (!name)
      return;
    var url = ModuleStore.normalize(name);
    return moduleInstantiators[url];
  }
  ;
  var moduleInstances = Object.create(null);
  var liveModuleSentinel = {};
  function Module(uncoatedModule) {
    var isLive = arguments[1];
    var coatedModule = Object.create(null);
    Object.getOwnPropertyNames(uncoatedModule).forEach((function(name) {
      var getter,
          value;
      if (isLive === liveModuleSentinel) {
        var descr = Object.getOwnPropertyDescriptor(uncoatedModule, name);
        if (descr.get)
          getter = descr.get;
      }
      if (!getter) {
        value = uncoatedModule[name];
        getter = function() {
          return value;
        };
      }
      Object.defineProperty(coatedModule, name, {
        get: getter,
        enumerable: true
      });
    }));
    Object.preventExtensions(coatedModule);
    return coatedModule;
  }
  var ModuleStore = {
    normalize: function(name, refererName, refererAddress) {
      if (typeof name !== "string")
        throw new TypeError("module name must be a string, not " + typeof name);
      if (isAbsolute(name))
        return canonicalizeUrl(name);
      if (/[^\.]\/\.\.\//.test(name)) {
        throw new Error('module name embeds /../: ' + name);
      }
      if (name[0] === '.' && refererName)
        return resolveUrl(refererName, name);
      return canonicalizeUrl(name);
    },
    get: function(normalizedName) {
      var m = getUncoatedModuleInstantiator(normalizedName);
      if (!m)
        return undefined;
      var moduleInstance = moduleInstances[m.url];
      if (moduleInstance)
        return moduleInstance;
      moduleInstance = Module(m.getUncoatedModule(), liveModuleSentinel);
      return moduleInstances[m.url] = moduleInstance;
    },
    set: function(normalizedName, module) {
      normalizedName = String(normalizedName);
      moduleInstantiators[normalizedName] = new UncoatedModuleInstantiator(normalizedName, (function() {
        return module;
      }));
      moduleInstances[normalizedName] = module;
    },
    get baseURL() {
      return baseURL;
    },
    set baseURL(v) {
      baseURL = String(v);
    },
    registerModule: function(name, func) {
      var normalizedName = ModuleStore.normalize(name);
      if (moduleInstantiators[normalizedName])
        throw new Error('duplicate module named ' + normalizedName);
      moduleInstantiators[normalizedName] = new UncoatedModuleInstantiator(normalizedName, func);
    },
    bundleStore: Object.create(null),
    register: function(name, deps, func) {
      if (!deps || !deps.length) {
        this.registerModule(name, func);
      } else {
        this.bundleStore[name] = {
          deps: deps,
          execute: func
        };
      }
    },
    getAnonymousModule: function(func) {
      return new Module(func.call(global), liveModuleSentinel);
    },
    getForTesting: function(name) {
      var $__0 = this;
      if (!this.testingPrefix_) {
        Object.keys(moduleInstances).some((function(key) {
          var m = /(traceur@[^\/]*\/)/.exec(key);
          if (m) {
            $__0.testingPrefix_ = m[1];
            return true;
          }
        }));
      }
      return this.get(this.testingPrefix_ + name);
    }
  };
  ModuleStore.set('@traceur/src/runtime/ModuleStore', new Module({ModuleStore: ModuleStore}));
  var setupGlobals = $traceurRuntime.setupGlobals;
  $traceurRuntime.setupGlobals = function(global) {
    setupGlobals(global);
  };
  $traceurRuntime.ModuleStore = ModuleStore;
  global.System = {
    register: ModuleStore.register.bind(ModuleStore),
    get: ModuleStore.get,
    set: ModuleStore.set,
    normalize: ModuleStore.normalize
  };
  $traceurRuntime.getModuleImpl = function(name) {
    var instantiator = getUncoatedModuleInstantiator(name);
    return instantiator && instantiator.getUncoatedModule();
  };
})(typeof global !== 'undefined' ? global : this);
System.register("traceur-runtime@0.0.32/src/runtime/polyfills/utils", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.32/src/runtime/polyfills/utils";
  var toObject = $traceurRuntime.toObject;
  function toUint32(x) {
    return x | 0;
  }
  return {
    get toObject() {
      return toObject;
    },
    get toUint32() {
      return toUint32;
    }
  };
});
System.register("traceur-runtime@0.0.32/src/runtime/polyfills/ArrayIterator", [], function() {
  "use strict";
  var $__4;
  var __moduleName = "traceur-runtime@0.0.32/src/runtime/polyfills/ArrayIterator";
  var $__5 = System.get("traceur-runtime@0.0.32/src/runtime/polyfills/utils"),
      toObject = $__5.toObject,
      toUint32 = $__5.toUint32;
  var ARRAY_ITERATOR_KIND_KEYS = 1;
  var ARRAY_ITERATOR_KIND_VALUES = 2;
  var ARRAY_ITERATOR_KIND_ENTRIES = 3;
  var ArrayIterator = function ArrayIterator() {};
  ($traceurRuntime.createClass)(ArrayIterator, ($__4 = {}, Object.defineProperty($__4, "next", {
    value: function() {
      var iterator = toObject(this);
      var array = iterator.iteratorObject_;
      if (!array) {
        throw new TypeError('Object is not an ArrayIterator');
      }
      var index = iterator.arrayIteratorNextIndex_;
      var itemKind = iterator.arrayIterationKind_;
      var length = toUint32(array.length);
      if (index >= length) {
        iterator.arrayIteratorNextIndex_ = Infinity;
        return createIteratorResultObject(undefined, true);
      }
      iterator.arrayIteratorNextIndex_ = index + 1;
      if (itemKind == ARRAY_ITERATOR_KIND_VALUES)
        return createIteratorResultObject(array[index], false);
      if (itemKind == ARRAY_ITERATOR_KIND_ENTRIES)
        return createIteratorResultObject([index, array[index]], false);
      return createIteratorResultObject(index, false);
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__4, Symbol.iterator, {
    value: function() {
      return this;
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), $__4), {});
  function createArrayIterator(array, kind) {
    var object = toObject(array);
    var iterator = new ArrayIterator;
    iterator.iteratorObject_ = object;
    iterator.arrayIteratorNextIndex_ = 0;
    iterator.arrayIterationKind_ = kind;
    return iterator;
  }
  function createIteratorResultObject(value, done) {
    return {
      value: value,
      done: done
    };
  }
  function entries() {
    return createArrayIterator(this, ARRAY_ITERATOR_KIND_ENTRIES);
  }
  function keys() {
    return createArrayIterator(this, ARRAY_ITERATOR_KIND_KEYS);
  }
  function values() {
    return createArrayIterator(this, ARRAY_ITERATOR_KIND_VALUES);
  }
  return {
    get entries() {
      return entries;
    },
    get keys() {
      return keys;
    },
    get values() {
      return values;
    }
  };
});
System.register("traceur-runtime@0.0.32/node_modules/rsvp/lib/rsvp/asap", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.32/node_modules/rsvp/lib/rsvp/asap";
  var $__default = function asap(callback, arg) {
    var length = queue.push([callback, arg]);
    if (length === 1) {
      scheduleFlush();
    }
  };
  var browserGlobal = (typeof window !== 'undefined') ? window : {};
  var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
  function useNextTick() {
    return function() {
      process.nextTick(flush);
    };
  }
  function useMutationObserver() {
    var iterations = 0;
    var observer = new BrowserMutationObserver(flush);
    var node = document.createTextNode('');
    observer.observe(node, {characterData: true});
    return function() {
      node.data = (iterations = ++iterations % 2);
    };
  }
  function useSetTimeout() {
    return function() {
      setTimeout(flush, 1);
    };
  }
  var queue = [];
  function flush() {
    for (var i = 0; i < queue.length; i++) {
      var tuple = queue[i];
      var callback = tuple[0],
          arg = tuple[1];
      callback(arg);
    }
    queue = [];
  }
  var scheduleFlush;
  if (typeof process !== 'undefined' && {}.toString.call(process) === '[object process]') {
    scheduleFlush = useNextTick();
  } else if (BrowserMutationObserver) {
    scheduleFlush = useMutationObserver();
  } else {
    scheduleFlush = useSetTimeout();
  }
  return {get default() {
      return $__default;
    }};
});
System.register("traceur-runtime@0.0.32/src/runtime/polyfills/Promise", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.32/src/runtime/polyfills/Promise";
  var async = System.get("traceur-runtime@0.0.32/node_modules/rsvp/lib/rsvp/asap").default;
  function isPromise(x) {
    return x && typeof x === 'object' && x.status_ !== undefined;
  }
  function chain(promise) {
    var onResolve = arguments[1] !== (void 0) ? arguments[1] : (function(x) {
      return x;
    });
    var onReject = arguments[2] !== (void 0) ? arguments[2] : (function(e) {
      throw e;
    });
    var deferred = getDeferred(promise.constructor);
    switch (promise.status_) {
      case undefined:
        throw TypeError;
      case 'pending':
        promise.onResolve_.push([deferred, onResolve]);
        promise.onReject_.push([deferred, onReject]);
        break;
      case 'resolved':
        promiseReact(deferred, onResolve, promise.value_);
        break;
      case 'rejected':
        promiseReact(deferred, onReject, promise.value_);
        break;
    }
    return deferred.promise;
  }
  function getDeferred(C) {
    var result = {};
    result.promise = new C((function(resolve, reject) {
      result.resolve = resolve;
      result.reject = reject;
    }));
    return result;
  }
  var Promise = function Promise(resolver) {
    var $__6 = this;
    this.status_ = 'pending';
    this.onResolve_ = [];
    this.onReject_ = [];
    resolver((function(x) {
      promiseResolve($__6, x);
    }), (function(r) {
      promiseReject($__6, r);
    }));
  };
  ($traceurRuntime.createClass)(Promise, {
    catch: function(onReject) {
      return this.then(undefined, onReject);
    },
    then: function() {
      var onResolve = arguments[0] !== (void 0) ? arguments[0] : (function(x) {
        return x;
      });
      var onReject = arguments[1];
      var $__6 = this;
      var constructor = this.constructor;
      return chain(this, (function(x) {
        x = promiseCoerce(constructor, x);
        return x === $__6 ? onReject(new TypeError) : isPromise(x) ? x.then(onResolve, onReject) : onResolve(x);
      }), onReject);
    }
  }, {
    resolve: function(x) {
      return new this((function(resolve, reject) {
        resolve(x);
      }));
    },
    reject: function(r) {
      return new this((function(resolve, reject) {
        reject(r);
      }));
    },
    cast: function(x) {
      if (x instanceof this)
        return x;
      if (isPromise(x)) {
        var result = getDeferred(this);
        chain(x, result.resolve, result.reject);
        return result.promise;
      }
      return this.resolve(x);
    },
    all: function(values) {
      var deferred = getDeferred(this);
      var count = 0;
      var resolutions = [];
      try {
        for (var i = 0; i < values.length; i++) {
          ++count;
          this.cast(values[i]).then(function(i, x) {
            resolutions[i] = x;
            if (--count === 0)
              deferred.resolve(resolutions);
          }.bind(undefined, i), (function(r) {
            if (count > 0)
              count = 0;
            deferred.reject(r);
          }));
        }
        if (count === 0)
          deferred.resolve(resolutions);
      } catch (e) {
        deferred.reject(e);
      }
      return deferred.promise;
    },
    race: function(values) {
      var deferred = getDeferred(this);
      try {
        for (var i = 0; i < values.length; i++) {
          this.cast(values[i]).then((function(x) {
            deferred.resolve(x);
          }), (function(r) {
            deferred.reject(r);
          }));
        }
      } catch (e) {
        deferred.reject(e);
      }
      return deferred.promise;
    }
  });
  function promiseResolve(promise, x) {
    promiseDone(promise, 'resolved', x, promise.onResolve_);
  }
  function promiseReject(promise, r) {
    promiseDone(promise, 'rejected', r, promise.onReject_);
  }
  function promiseDone(promise, status, value, reactions) {
    if (promise.status_ !== 'pending')
      return;
    for (var i = 0; i < reactions.length; i++) {
      promiseReact(reactions[i][0], reactions[i][1], value);
    }
    promise.status_ = status;
    promise.value_ = value;
    promise.onResolve_ = promise.onReject_ = undefined;
  }
  function promiseReact(deferred, handler, x) {
    async((function() {
      try {
        var y = handler(x);
        if (y === deferred.promise)
          throw new TypeError;
        else if (isPromise(y))
          chain(y, deferred.resolve, deferred.reject);
        else
          deferred.resolve(y);
      } catch (e) {
        deferred.reject(e);
      }
    }));
  }
  var thenableSymbol = '@@thenable';
  function promiseCoerce(constructor, x) {
    if (isPromise(x)) {
      return x;
    } else if (x && typeof x.then === 'function') {
      var p = x[thenableSymbol];
      if (p) {
        return p;
      } else {
        var deferred = getDeferred(constructor);
        x[thenableSymbol] = deferred.promise;
        try {
          x.then(deferred.resolve, deferred.reject);
        } catch (e) {
          deferred.reject(e);
        }
        return deferred.promise;
      }
    } else {
      return x;
    }
  }
  return {get Promise() {
      return Promise;
    }};
});
System.register("traceur-runtime@0.0.32/src/runtime/polyfills/String", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.32/src/runtime/polyfills/String";
  var $toString = Object.prototype.toString;
  var $indexOf = String.prototype.indexOf;
  var $lastIndexOf = String.prototype.lastIndexOf;
  function startsWith(search) {
    var string = String(this);
    if (this == null || $toString.call(search) == '[object RegExp]') {
      throw TypeError();
    }
    var stringLength = string.length;
    var searchString = String(search);
    var searchLength = searchString.length;
    var position = arguments.length > 1 ? arguments[1] : undefined;
    var pos = position ? Number(position) : 0;
    if (isNaN(pos)) {
      pos = 0;
    }
    var start = Math.min(Math.max(pos, 0), stringLength);
    return $indexOf.call(string, searchString, pos) == start;
  }
  function endsWith(search) {
    var string = String(this);
    if (this == null || $toString.call(search) == '[object RegExp]') {
      throw TypeError();
    }
    var stringLength = string.length;
    var searchString = String(search);
    var searchLength = searchString.length;
    var pos = stringLength;
    if (arguments.length > 1) {
      var position = arguments[1];
      if (position !== undefined) {
        pos = position ? Number(position) : 0;
        if (isNaN(pos)) {
          pos = 0;
        }
      }
    }
    var end = Math.min(Math.max(pos, 0), stringLength);
    var start = end - searchLength;
    if (start < 0) {
      return false;
    }
    return $lastIndexOf.call(string, searchString, start) == start;
  }
  function contains(search) {
    if (this == null) {
      throw TypeError();
    }
    var string = String(this);
    var stringLength = string.length;
    var searchString = String(search);
    var searchLength = searchString.length;
    var position = arguments.length > 1 ? arguments[1] : undefined;
    var pos = position ? Number(position) : 0;
    if (isNaN(pos)) {
      pos = 0;
    }
    var start = Math.min(Math.max(pos, 0), stringLength);
    return $indexOf.call(string, searchString, pos) != -1;
  }
  function repeat(count) {
    if (this == null) {
      throw TypeError();
    }
    var string = String(this);
    var n = count ? Number(count) : 0;
    if (isNaN(n)) {
      n = 0;
    }
    if (n < 0 || n == Infinity) {
      throw RangeError();
    }
    if (n == 0) {
      return '';
    }
    var result = '';
    while (n--) {
      result += string;
    }
    return result;
  }
  function codePointAt(position) {
    if (this == null) {
      throw TypeError();
    }
    var string = String(this);
    var size = string.length;
    var index = position ? Number(position) : 0;
    if (isNaN(index)) {
      index = 0;
    }
    if (index < 0 || index >= size) {
      return undefined;
    }
    var first = string.charCodeAt(index);
    var second;
    if (first >= 0xD800 && first <= 0xDBFF && size > index + 1) {
      second = string.charCodeAt(index + 1);
      if (second >= 0xDC00 && second <= 0xDFFF) {
        return (first - 0xD800) * 0x400 + second - 0xDC00 + 0x10000;
      }
    }
    return first;
  }
  function raw(callsite) {
    var raw = callsite.raw;
    var len = raw.length >>> 0;
    if (len === 0)
      return '';
    var s = '';
    var i = 0;
    while (true) {
      s += raw[i];
      if (i + 1 === len)
        return s;
      s += arguments[++i];
    }
  }
  function fromCodePoint() {
    var codeUnits = [];
    var floor = Math.floor;
    var highSurrogate;
    var lowSurrogate;
    var index = -1;
    var length = arguments.length;
    if (!length) {
      return '';
    }
    while (++index < length) {
      var codePoint = Number(arguments[index]);
      if (!isFinite(codePoint) || codePoint < 0 || codePoint > 0x10FFFF || floor(codePoint) != codePoint) {
        throw RangeError('Invalid code point: ' + codePoint);
      }
      if (codePoint <= 0xFFFF) {
        codeUnits.push(codePoint);
      } else {
        codePoint -= 0x10000;
        highSurrogate = (codePoint >> 10) + 0xD800;
        lowSurrogate = (codePoint % 0x400) + 0xDC00;
        codeUnits.push(highSurrogate, lowSurrogate);
      }
    }
    return String.fromCharCode.apply(null, codeUnits);
  }
  return {
    get startsWith() {
      return startsWith;
    },
    get endsWith() {
      return endsWith;
    },
    get contains() {
      return contains;
    },
    get repeat() {
      return repeat;
    },
    get codePointAt() {
      return codePointAt;
    },
    get raw() {
      return raw;
    },
    get fromCodePoint() {
      return fromCodePoint;
    }
  };
});
System.register("traceur-runtime@0.0.32/src/runtime/polyfills/polyfills", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.32/src/runtime/polyfills/polyfills";
  var Promise = System.get("traceur-runtime@0.0.32/src/runtime/polyfills/Promise").Promise;
  var $__9 = System.get("traceur-runtime@0.0.32/src/runtime/polyfills/String"),
      codePointAt = $__9.codePointAt,
      contains = $__9.contains,
      endsWith = $__9.endsWith,
      fromCodePoint = $__9.fromCodePoint,
      repeat = $__9.repeat,
      raw = $__9.raw,
      startsWith = $__9.startsWith;
  var $__9 = System.get("traceur-runtime@0.0.32/src/runtime/polyfills/ArrayIterator"),
      entries = $__9.entries,
      keys = $__9.keys,
      values = $__9.values;
  function maybeDefineMethod(object, name, value) {
    if (!(name in object)) {
      Object.defineProperty(object, name, {
        value: value,
        configurable: true,
        enumerable: false,
        writable: true
      });
    }
  }
  function maybeAddFunctions(object, functions) {
    for (var i = 0; i < functions.length; i += 2) {
      var name = functions[i];
      var value = functions[i + 1];
      maybeDefineMethod(object, name, value);
    }
  }
  function polyfillPromise(global) {
    if (!global.Promise)
      global.Promise = Promise;
  }
  function polyfillString(String) {
    maybeAddFunctions(String.prototype, ['codePointAt', codePointAt, 'contains', contains, 'endsWith', endsWith, 'startsWith', startsWith, 'repeat', repeat]);
    maybeAddFunctions(String, ['fromCodePoint', fromCodePoint, 'raw', raw]);
  }
  function polyfillArray(Array, Symbol) {
    maybeAddFunctions(Array.prototype, ['entries', entries, 'keys', keys, 'values', values]);
    if (Symbol && Symbol.iterator) {
      Object.defineProperty(Array.prototype, Symbol.iterator, {
        value: values,
        configurable: true,
        enumerable: false,
        writable: true
      });
    }
  }
  function polyfill(global) {
    polyfillPromise(global);
    polyfillString(global.String);
    polyfillArray(global.Array, global.Symbol);
  }
  polyfill(this);
  var setupGlobals = $traceurRuntime.setupGlobals;
  $traceurRuntime.setupGlobals = function(global) {
    setupGlobals(global);
    polyfill(global);
  };
  return {};
});
System.register("traceur-runtime@0.0.32/src/runtime/polyfill-import", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.32/src/runtime/polyfill-import";
  var $__11 = System.get("traceur-runtime@0.0.32/src/runtime/polyfills/polyfills");
  return {};
});
System.get("traceur-runtime@0.0.32/src/runtime/polyfill-import" + '');

}).call(this,require("/Users/francoponticelli/projects/cards/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"/Users/francoponticelli/projects/cards/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":6}],8:[function(require,module,exports){
"use strict";
exports.test = function () {
    return false;
};
},{}],9:[function(require,module,exports){
"use strict";
var types = [
    require("./nextTick"),
    require("./mutation"),
    require("./postMessage"),
    require("./messageChannel"),
    require("./stateChange"),
    require("./timeout")
];
var handlerQueue = [];
function drainQueue() {
    var i = 0,
        task,
        innerQueue = handlerQueue;
	handlerQueue = [];
	/*jslint boss: true */
	while (task = innerQueue[i++]) {
		task();
	}
}
var nextTick;
var i = -1;
var len = types.length;
while (++ i < len) {
    if (types[i].test()) {
        nextTick = types[i].install(drainQueue);
        break;
    }
}
module.exports = function (task) {
    var len, i, args;
    var nTask = task;
    if (arguments.length > 1 && typeof task === "function") {
        args = new Array(arguments.length - 1);
        i = 0;
        while (++i < arguments.length) {
            args[i - 1] = arguments[i];
        }
        nTask = function () {
            task.apply(undefined, args);
        };
    }
    if ((len = handlerQueue.push(nTask)) === 1) {
        nextTick(drainQueue);
    }
    return len;
};
module.exports.clear = function (n) {
    if (n <= handlerQueue.length) {
        handlerQueue[n - 1] = function () {};
    }
    return this;
};

},{"./messageChannel":10,"./mutation":11,"./nextTick":8,"./postMessage":12,"./stateChange":13,"./timeout":14}],10:[function(require,module,exports){
(function (global){
"use strict";

exports.test = function () {
    return typeof global.MessageChannel !== "undefined";
};

exports.install = function (func) {
    var channel = new global.MessageChannel();
    channel.port1.onmessage = func;
    return function () {
        channel.port2.postMessage(0);
    };
};
}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],11:[function(require,module,exports){
(function (global){
"use strict";
//based off rsvp
//https://github.com/tildeio/rsvp.js/blob/master/lib/rsvp/async.js

var MutationObserver = global.MutationObserver || global.WebKitMutationObserver;

exports.test = function () {
    return MutationObserver;
};

exports.install = function (handle) {
    var observer = new MutationObserver(handle);
    var element = global.document.createElement("div");
    observer.observe(element, { attributes: true });

    // Chrome Memory Leak: https://bugs.webkit.org/show_bug.cgi?id=93661
    global.addEventListener("unload", function () {
        observer.disconnect();
        observer = null;
    }, false);
    return function () {
        element.setAttribute("drainQueue", "drainQueue");
    };
};
}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],12:[function(require,module,exports){
(function (global){
"use strict";
exports.test = function () {
    // The test against `importScripts` prevents this implementation from being installed inside a web worker,
    // where `global.postMessage` means something completely different and can"t be used for this purpose.

    if (!global.postMessage || global.importScripts) {
        return false;
    }

    var postMessageIsAsynchronous = true;
    var oldOnMessage = global.onmessage;
    global.onmessage = function () {
        postMessageIsAsynchronous = false;
    };
    global.postMessage("", "*");
    global.onmessage = oldOnMessage;

    return postMessageIsAsynchronous;
};

exports.install = function (func) {
    var codeWord = "com.calvinmetcalf.setImmediate" + Math.random();
    function globalMessage(event) {
        if (event.source === global && event.data === codeWord) {
            func();
        }
    }
    if (global.addEventListener) {
        global.addEventListener("message", globalMessage, false);
    } else {
        global.attachEvent("onmessage", globalMessage);
    }
    return function () {
        global.postMessage(codeWord, "*");
    };
};
}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],13:[function(require,module,exports){
(function (global){
"use strict";

exports.test = function () {
    return "document" in global && "onreadystatechange" in global.document.createElement("script");
};

exports.install = function (handle) {
    return function () {

        // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
        // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
        var scriptEl = global.document.createElement("script");
        scriptEl.onreadystatechange = function () {
            handle();

            scriptEl.onreadystatechange = null;
            scriptEl.parentNode.removeChild(scriptEl);
            scriptEl = null;
        };
        global.document.documentElement.appendChild(scriptEl);

        return handle;
    };
};
}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],14:[function(require,module,exports){
"use strict";
exports.test = function () {
    return true;
};

exports.install = function (t) {
    return function () {
        setTimeout(t, 0);
    };
};
},{}],15:[function(require,module,exports){
(function (global){
!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.jade=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
'use strict';

/**
 * Merge two attribute objects giving precedence
 * to values in object `b`. Classes are special-cased
 * allowing for arrays and merging/joining appropriately
 * resulting in a string.
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Object} a
 * @api private
 */

exports.merge = function merge(a, b) {
  if (arguments.length === 1) {
    var attrs = a[0];
    for (var i = 1; i < a.length; i++) {
      attrs = merge(attrs, a[i]);
    }
    return attrs;
  }
  var ac = a['class'];
  var bc = b['class'];

  if (ac || bc) {
    ac = ac || [];
    bc = bc || [];
    if (!Array.isArray(ac)) ac = [ac];
    if (!Array.isArray(bc)) bc = [bc];
    a['class'] = ac.concat(bc).filter(nulls);
  }

  for (var key in b) {
    if (key != 'class') {
      a[key] = b[key];
    }
  }

  return a;
};

/**
 * Filter null `val`s.
 *
 * @param {*} val
 * @return {Boolean}
 * @api private
 */

function nulls(val) {
  return val != null && val !== '';
}

/**
 * join array as classes.
 *
 * @param {*} val
 * @return {String}
 */
exports.joinClasses = joinClasses;
function joinClasses(val) {
  return Array.isArray(val) ? val.map(joinClasses).filter(nulls).join(' ') : val;
}

/**
 * Render the given classes.
 *
 * @param {Array} classes
 * @param {Array.<Boolean>} escaped
 * @return {String}
 */
exports.cls = function cls(classes, escaped) {
  var buf = [];
  for (var i = 0; i < classes.length; i++) {
    if (escaped && escaped[i]) {
      buf.push(exports.escape(joinClasses([classes[i]])));
    } else {
      buf.push(joinClasses(classes[i]));
    }
  }
  var text = joinClasses(buf);
  if (text.length) {
    return ' class="' + text + '"';
  } else {
    return '';
  }
};

/**
 * Render the given attribute.
 *
 * @param {String} key
 * @param {String} val
 * @param {Boolean} escaped
 * @param {Boolean} terse
 * @return {String}
 */
exports.attr = function attr(key, val, escaped, terse) {
  if ('boolean' == typeof val || null == val) {
    if (val) {
      return ' ' + (terse ? key : key + '="' + key + '"');
    } else {
      return '';
    }
  } else if (0 == key.indexOf('data') && 'string' != typeof val) {
    return ' ' + key + "='" + JSON.stringify(val).replace(/'/g, '&apos;') + "'";
  } else if (escaped) {
    return ' ' + key + '="' + exports.escape(val) + '"';
  } else {
    return ' ' + key + '="' + val + '"';
  }
};

/**
 * Render the given attributes object.
 *
 * @param {Object} obj
 * @param {Object} escaped
 * @return {String}
 */
exports.attrs = function attrs(obj, terse){
  var buf = [];

  var keys = Object.keys(obj);

  if (keys.length) {
    for (var i = 0; i < keys.length; ++i) {
      var key = keys[i]
        , val = obj[key];

      if ('class' == key) {
        if (val = joinClasses(val)) {
          buf.push(' ' + key + '="' + val + '"');
        }
      } else {
        buf.push(exports.attr(key, val, false, terse));
      }
    }
  }

  return buf.join('');
};

/**
 * Escape the given string of `html`.
 *
 * @param {String} html
 * @return {String}
 * @api private
 */

exports.escape = function escape(html){
  var result = String(html)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
  if (result === '' + html) return html;
  else return result;
};

/**
 * Re-throw the given `err` in context to the
 * the jade in `filename` at the given `lineno`.
 *
 * @param {Error} err
 * @param {String} filename
 * @param {String} lineno
 * @api private
 */

exports.rethrow = function rethrow(err, filename, lineno, str){
  if (!(err instanceof Error)) throw err;
  if ((typeof window != 'undefined' || !filename) && !str) {
    err.message += ' on line ' + lineno;
    throw err;
  }
  try {
    str =  str || _dereq_('fs').readFileSync(filename, 'utf8')
  } catch (ex) {
    rethrow(err, null, lineno)
  }
  var context = 3
    , lines = str.split('\n')
    , start = Math.max(lineno - context, 0)
    , end = Math.min(lines.length, lineno + context);

  // Error context
  var context = lines.slice(start, end).map(function(line, i){
    var curr = i + start + 1;
    return (curr == lineno ? '  > ' : '    ')
      + curr
      + '| '
      + line;
  }).join('\n');

  // Alter exception message
  err.path = filename;
  err.message = (filename || 'Jade') + ':' + lineno
    + '\n' + context + '\n\n' + err.message;
  throw err;
};

},{"fs":2}],2:[function(_dereq_,module,exports){

},{}]},{},[1])
(1)
});
}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],16:[function(require,module,exports){
/*!
 * numeral.js
 * version : 1.5.3
 * author : Adam Draper
 * license : MIT
 * http://adamwdraper.github.com/Numeral-js/
 */

(function () {

    /************************************
        Constants
    ************************************/

    var numeral,
        VERSION = '1.5.3',
        // internal storage for language config files
        languages = {},
        currentLanguage = 'en',
        zeroFormat = null,
        defaultFormat = '0,0',
        // check for nodeJS
        hasModule = (typeof module !== 'undefined' && module.exports);


    /************************************
        Constructors
    ************************************/


    // Numeral prototype object
    function Numeral (number) {
        this._value = number;
    }

    /**
     * Implementation of toFixed() that treats floats more like decimals
     *
     * Fixes binary rounding issues (eg. (0.615).toFixed(2) === '0.61') that present
     * problems for accounting- and finance-related software.
     */
    function toFixed (value, precision, roundingFunction, optionals) {
        var power = Math.pow(10, precision),
            optionalsRegExp,
            output;
            
        //roundingFunction = (roundingFunction !== undefined ? roundingFunction : Math.round);
        // Multiply up by precision, round accurately, then divide and use native toFixed():
        output = (roundingFunction(value * power) / power).toFixed(precision);

        if (optionals) {
            optionalsRegExp = new RegExp('0{1,' + optionals + '}$');
            output = output.replace(optionalsRegExp, '');
        }

        return output;
    }

    /************************************
        Formatting
    ************************************/

    // determine what type of formatting we need to do
    function formatNumeral (n, format, roundingFunction) {
        var output;

        // figure out what kind of format we are dealing with
        if (format.indexOf('$') > -1) { // currency!!!!!
            output = formatCurrency(n, format, roundingFunction);
        } else if (format.indexOf('%') > -1) { // percentage
            output = formatPercentage(n, format, roundingFunction);
        } else if (format.indexOf(':') > -1) { // time
            output = formatTime(n, format);
        } else { // plain ol' numbers or bytes
            output = formatNumber(n._value, format, roundingFunction);
        }

        // return string
        return output;
    }

    // revert to number
    function unformatNumeral (n, string) {
        var stringOriginal = string,
            thousandRegExp,
            millionRegExp,
            billionRegExp,
            trillionRegExp,
            suffixes = ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
            bytesMultiplier = false,
            power;

        if (string.indexOf(':') > -1) {
            n._value = unformatTime(string);
        } else {
            if (string === zeroFormat) {
                n._value = 0;
            } else {
                if (languages[currentLanguage].delimiters.decimal !== '.') {
                    string = string.replace(/\./g,'').replace(languages[currentLanguage].delimiters.decimal, '.');
                }

                // see if abbreviations are there so that we can multiply to the correct number
                thousandRegExp = new RegExp('[^a-zA-Z]' + languages[currentLanguage].abbreviations.thousand + '(?:\\)|(\\' + languages[currentLanguage].currency.symbol + ')?(?:\\))?)?$');
                millionRegExp = new RegExp('[^a-zA-Z]' + languages[currentLanguage].abbreviations.million + '(?:\\)|(\\' + languages[currentLanguage].currency.symbol + ')?(?:\\))?)?$');
                billionRegExp = new RegExp('[^a-zA-Z]' + languages[currentLanguage].abbreviations.billion + '(?:\\)|(\\' + languages[currentLanguage].currency.symbol + ')?(?:\\))?)?$');
                trillionRegExp = new RegExp('[^a-zA-Z]' + languages[currentLanguage].abbreviations.trillion + '(?:\\)|(\\' + languages[currentLanguage].currency.symbol + ')?(?:\\))?)?$');

                // see if bytes are there so that we can multiply to the correct number
                for (power = 0; power <= suffixes.length; power++) {
                    bytesMultiplier = (string.indexOf(suffixes[power]) > -1) ? Math.pow(1024, power + 1) : false;

                    if (bytesMultiplier) {
                        break;
                    }
                }

                // do some math to create our number
                n._value = ((bytesMultiplier) ? bytesMultiplier : 1) * ((stringOriginal.match(thousandRegExp)) ? Math.pow(10, 3) : 1) * ((stringOriginal.match(millionRegExp)) ? Math.pow(10, 6) : 1) * ((stringOriginal.match(billionRegExp)) ? Math.pow(10, 9) : 1) * ((stringOriginal.match(trillionRegExp)) ? Math.pow(10, 12) : 1) * ((string.indexOf('%') > -1) ? 0.01 : 1) * (((string.split('-').length + Math.min(string.split('(').length-1, string.split(')').length-1)) % 2)? 1: -1) * Number(string.replace(/[^0-9\.]+/g, ''));

                // round if we are talking about bytes
                n._value = (bytesMultiplier) ? Math.ceil(n._value) : n._value;
            }
        }
        return n._value;
    }

    function formatCurrency (n, format, roundingFunction) {
        var symbolIndex = format.indexOf('$'),
            openParenIndex = format.indexOf('('),
            minusSignIndex = format.indexOf('-'),
            space = '',
            spliceIndex,
            output;

        // check for space before or after currency
        if (format.indexOf(' $') > -1) {
            space = ' ';
            format = format.replace(' $', '');
        } else if (format.indexOf('$ ') > -1) {
            space = ' ';
            format = format.replace('$ ', '');
        } else {
            format = format.replace('$', '');
        }

        // format the number
        output = formatNumber(n._value, format, roundingFunction);

        // position the symbol
        if (symbolIndex <= 1) {
            if (output.indexOf('(') > -1 || output.indexOf('-') > -1) {
                output = output.split('');
                spliceIndex = 1;
                if (symbolIndex < openParenIndex || symbolIndex < minusSignIndex){
                    // the symbol appears before the "(" or "-"
                    spliceIndex = 0;
                }
                output.splice(spliceIndex, 0, languages[currentLanguage].currency.symbol + space);
                output = output.join('');
            } else {
                output = languages[currentLanguage].currency.symbol + space + output;
            }
        } else {
            if (output.indexOf(')') > -1) {
                output = output.split('');
                output.splice(-1, 0, space + languages[currentLanguage].currency.symbol);
                output = output.join('');
            } else {
                output = output + space + languages[currentLanguage].currency.symbol;
            }
        }

        return output;
    }

    function formatPercentage (n, format, roundingFunction) {
        var space = '',
            output,
            value = n._value * 100;

        // check for space before %
        if (format.indexOf(' %') > -1) {
            space = ' ';
            format = format.replace(' %', '');
        } else {
            format = format.replace('%', '');
        }

        output = formatNumber(value, format, roundingFunction);
        
        if (output.indexOf(')') > -1 ) {
            output = output.split('');
            output.splice(-1, 0, space + '%');
            output = output.join('');
        } else {
            output = output + space + '%';
        }

        return output;
    }

    function formatTime (n) {
        var hours = Math.floor(n._value/60/60),
            minutes = Math.floor((n._value - (hours * 60 * 60))/60),
            seconds = Math.round(n._value - (hours * 60 * 60) - (minutes * 60));
        return hours + ':' + ((minutes < 10) ? '0' + minutes : minutes) + ':' + ((seconds < 10) ? '0' + seconds : seconds);
    }

    function unformatTime (string) {
        var timeArray = string.split(':'),
            seconds = 0;
        // turn hours and minutes into seconds and add them all up
        if (timeArray.length === 3) {
            // hours
            seconds = seconds + (Number(timeArray[0]) * 60 * 60);
            // minutes
            seconds = seconds + (Number(timeArray[1]) * 60);
            // seconds
            seconds = seconds + Number(timeArray[2]);
        } else if (timeArray.length === 2) {
            // minutes
            seconds = seconds + (Number(timeArray[0]) * 60);
            // seconds
            seconds = seconds + Number(timeArray[1]);
        }
        return Number(seconds);
    }

    function formatNumber (value, format, roundingFunction) {
        var negP = false,
            signed = false,
            optDec = false,
            abbr = '',
            abbrK = false, // force abbreviation to thousands
            abbrM = false, // force abbreviation to millions
            abbrB = false, // force abbreviation to billions
            abbrT = false, // force abbreviation to trillions
            abbrForce = false, // force abbreviation
            bytes = '',
            ord = '',
            abs = Math.abs(value),
            suffixes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
            min,
            max,
            power,
            w,
            precision,
            thousands,
            d = '',
            neg = false;

        // check if number is zero and a custom zero format has been set
        if (value === 0 && zeroFormat !== null) {
            return zeroFormat;
        } else {
            // see if we should use parentheses for negative number or if we should prefix with a sign
            // if both are present we default to parentheses
            if (format.indexOf('(') > -1) {
                negP = true;
                format = format.slice(1, -1);
            } else if (format.indexOf('+') > -1) {
                signed = true;
                format = format.replace(/\+/g, '');
            }

            // see if abbreviation is wanted
            if (format.indexOf('a') > -1) {
                // check if abbreviation is specified
                abbrK = format.indexOf('aK') >= 0;
                abbrM = format.indexOf('aM') >= 0;
                abbrB = format.indexOf('aB') >= 0;
                abbrT = format.indexOf('aT') >= 0;
                abbrForce = abbrK || abbrM || abbrB || abbrT;

                // check for space before abbreviation
                if (format.indexOf(' a') > -1) {
                    abbr = ' ';
                    format = format.replace(' a', '');
                } else {
                    format = format.replace('a', '');
                }

                if (abs >= Math.pow(10, 12) && !abbrForce || abbrT) {
                    // trillion
                    abbr = abbr + languages[currentLanguage].abbreviations.trillion;
                    value = value / Math.pow(10, 12);
                } else if (abs < Math.pow(10, 12) && abs >= Math.pow(10, 9) && !abbrForce || abbrB) {
                    // billion
                    abbr = abbr + languages[currentLanguage].abbreviations.billion;
                    value = value / Math.pow(10, 9);
                } else if (abs < Math.pow(10, 9) && abs >= Math.pow(10, 6) && !abbrForce || abbrM) {
                    // million
                    abbr = abbr + languages[currentLanguage].abbreviations.million;
                    value = value / Math.pow(10, 6);
                } else if (abs < Math.pow(10, 6) && abs >= Math.pow(10, 3) && !abbrForce || abbrK) {
                    // thousand
                    abbr = abbr + languages[currentLanguage].abbreviations.thousand;
                    value = value / Math.pow(10, 3);
                }
            }

            // see if we are formatting bytes
            if (format.indexOf('b') > -1) {
                // check for space before
                if (format.indexOf(' b') > -1) {
                    bytes = ' ';
                    format = format.replace(' b', '');
                } else {
                    format = format.replace('b', '');
                }

                for (power = 0; power <= suffixes.length; power++) {
                    min = Math.pow(1024, power);
                    max = Math.pow(1024, power+1);

                    if (value >= min && value < max) {
                        bytes = bytes + suffixes[power];
                        if (min > 0) {
                            value = value / min;
                        }
                        break;
                    }
                }
            }

            // see if ordinal is wanted
            if (format.indexOf('o') > -1) {
                // check for space before
                if (format.indexOf(' o') > -1) {
                    ord = ' ';
                    format = format.replace(' o', '');
                } else {
                    format = format.replace('o', '');
                }

                ord = ord + languages[currentLanguage].ordinal(value);
            }

            if (format.indexOf('[.]') > -1) {
                optDec = true;
                format = format.replace('[.]', '.');
            }

            w = value.toString().split('.')[0];
            precision = format.split('.')[1];
            thousands = format.indexOf(',');

            if (precision) {
                if (precision.indexOf('[') > -1) {
                    precision = precision.replace(']', '');
                    precision = precision.split('[');
                    d = toFixed(value, (precision[0].length + precision[1].length), roundingFunction, precision[1].length);
                } else {
                    d = toFixed(value, precision.length, roundingFunction);
                }

                w = d.split('.')[0];

                if (d.split('.')[1].length) {
                    d = languages[currentLanguage].delimiters.decimal + d.split('.')[1];
                } else {
                    d = '';
                }

                if (optDec && Number(d.slice(1)) === 0) {
                    d = '';
                }
            } else {
                w = toFixed(value, null, roundingFunction);
            }

            // format number
            if (w.indexOf('-') > -1) {
                w = w.slice(1);
                neg = true;
            }

            if (thousands > -1) {
                w = w.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + languages[currentLanguage].delimiters.thousands);
            }

            if (format.indexOf('.') === 0) {
                w = '';
            }

            return ((negP && neg) ? '(' : '') + ((!negP && neg) ? '-' : '') + ((!neg && signed) ? '+' : '') + w + d + ((ord) ? ord : '') + ((abbr) ? abbr : '') + ((bytes) ? bytes : '') + ((negP && neg) ? ')' : '');
        }
    }

    /************************************
        Top Level Functions
    ************************************/

    numeral = function (input) {
        if (numeral.isNumeral(input)) {
            input = input.value();
        } else if (input === 0 || typeof input === 'undefined') {
            input = 0;
        } else if (!Number(input)) {
            input = numeral.fn.unformat(input);
        }

        return new Numeral(Number(input));
    };

    // version number
    numeral.version = VERSION;

    // compare numeral object
    numeral.isNumeral = function (obj) {
        return obj instanceof Numeral;
    };

    // This function will load languages and then set the global language.  If
    // no arguments are passed in, it will simply return the current global
    // language key.
    numeral.language = function (key, values) {
        if (!key) {
            return currentLanguage;
        }

        if (key && !values) {
            if(!languages[key]) {
                throw new Error('Unknown language : ' + key);
            }
            currentLanguage = key;
        }

        if (values || !languages[key]) {
            loadLanguage(key, values);
        }

        return numeral;
    };
    
    // This function provides access to the loaded language data.  If
    // no arguments are passed in, it will simply return the current
    // global language object.
    numeral.languageData = function (key) {
        if (!key) {
            return languages[currentLanguage];
        }
        
        if (!languages[key]) {
            throw new Error('Unknown language : ' + key);
        }
        
        return languages[key];
    };

    numeral.language('en', {
        delimiters: {
            thousands: ',',
            decimal: '.'
        },
        abbreviations: {
            thousand: 'k',
            million: 'm',
            billion: 'b',
            trillion: 't'
        },
        ordinal: function (number) {
            var b = number % 10;
            return (~~ (number % 100 / 10) === 1) ? 'th' :
                (b === 1) ? 'st' :
                (b === 2) ? 'nd' :
                (b === 3) ? 'rd' : 'th';
        },
        currency: {
            symbol: '$'
        }
    });

    numeral.zeroFormat = function (format) {
        zeroFormat = typeof(format) === 'string' ? format : null;
    };

    numeral.defaultFormat = function (format) {
        defaultFormat = typeof(format) === 'string' ? format : '0.0';
    };

    /************************************
        Helpers
    ************************************/

    function loadLanguage(key, values) {
        languages[key] = values;
    }

    /************************************
        Floating-point helpers
    ************************************/

    // The floating-point helper functions and implementation
    // borrows heavily from sinful.js: http://guipn.github.io/sinful.js/

    /**
     * Array.prototype.reduce for browsers that don't support it
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce#Compatibility
     */
    if ('function' !== typeof Array.prototype.reduce) {
        Array.prototype.reduce = function (callback, opt_initialValue) {
            'use strict';
            
            if (null === this || 'undefined' === typeof this) {
                // At the moment all modern browsers, that support strict mode, have
                // native implementation of Array.prototype.reduce. For instance, IE8
                // does not support strict mode, so this check is actually useless.
                throw new TypeError('Array.prototype.reduce called on null or undefined');
            }
            
            if ('function' !== typeof callback) {
                throw new TypeError(callback + ' is not a function');
            }

            var index,
                value,
                length = this.length >>> 0,
                isValueSet = false;

            if (1 < arguments.length) {
                value = opt_initialValue;
                isValueSet = true;
            }

            for (index = 0; length > index; ++index) {
                if (this.hasOwnProperty(index)) {
                    if (isValueSet) {
                        value = callback(value, this[index], index, this);
                    } else {
                        value = this[index];
                        isValueSet = true;
                    }
                }
            }

            if (!isValueSet) {
                throw new TypeError('Reduce of empty array with no initial value');
            }

            return value;
        };
    }

    
    /**
     * Computes the multiplier necessary to make x >= 1,
     * effectively eliminating miscalculations caused by
     * finite precision.
     */
    function multiplier(x) {
        var parts = x.toString().split('.');
        if (parts.length < 2) {
            return 1;
        }
        return Math.pow(10, parts[1].length);
    }

    /**
     * Given a variable number of arguments, returns the maximum
     * multiplier that must be used to normalize an operation involving
     * all of them.
     */
    function correctionFactor() {
        var args = Array.prototype.slice.call(arguments);
        return args.reduce(function (prev, next) {
            var mp = multiplier(prev),
                mn = multiplier(next);
        return mp > mn ? mp : mn;
        }, -Infinity);
    }        


    /************************************
        Numeral Prototype
    ************************************/


    numeral.fn = Numeral.prototype = {

        clone : function () {
            return numeral(this);
        },

        format : function (inputString, roundingFunction) {
            return formatNumeral(this, 
                  inputString ? inputString : defaultFormat, 
                  (roundingFunction !== undefined) ? roundingFunction : Math.round
              );
        },

        unformat : function (inputString) {
            if (Object.prototype.toString.call(inputString) === '[object Number]') { 
                return inputString; 
            }
            return unformatNumeral(this, inputString ? inputString : defaultFormat);
        },

        value : function () {
            return this._value;
        },

        valueOf : function () {
            return this._value;
        },

        set : function (value) {
            this._value = Number(value);
            return this;
        },

        add : function (value) {
            var corrFactor = correctionFactor.call(null, this._value, value);
            function cback(accum, curr, currI, O) {
                return accum + corrFactor * curr;
            }
            this._value = [this._value, value].reduce(cback, 0) / corrFactor;
            return this;
        },

        subtract : function (value) {
            var corrFactor = correctionFactor.call(null, this._value, value);
            function cback(accum, curr, currI, O) {
                return accum - corrFactor * curr;
            }
            this._value = [value].reduce(cback, this._value * corrFactor) / corrFactor;            
            return this;
        },

        multiply : function (value) {
            function cback(accum, curr, currI, O) {
                var corrFactor = correctionFactor(accum, curr);
                return (accum * corrFactor) * (curr * corrFactor) /
                    (corrFactor * corrFactor);
            }
            this._value = [this._value, value].reduce(cback, 1);
            return this;
        },

        divide : function (value) {
            function cback(accum, curr, currI, O) {
                var corrFactor = correctionFactor(accum, curr);
                return (accum * corrFactor) / (curr * corrFactor);
            }
            this._value = [this._value, value].reduce(cback);            
            return this;
        },

        difference : function (value) {
            return Math.abs(numeral(this._value).subtract(value).value());
        }

    };

    /************************************
        Exposing Numeral
    ************************************/

    // CommonJS module is defined
    if (hasModule) {
        module.exports = numeral;
    }

    /*global ender:false */
    if (typeof ender === 'undefined') {
        // here, `this` means `window` in the browser, or `global` on the server
        // add `numeral` as a global object via a string identifier,
        // for Closure Compiler 'advanced' mode
        this['numeral'] = numeral;
    }

    /*global define:false */
    if (typeof define === 'function' && define.amd) {
        define([], function () {
            return numeral;
        });
    }
}).call(this);

},{}],17:[function(require,module,exports){
"use strict";
var __moduleName = "node_modules/streamy/stream";
var Timer = require('ui/timer').default;
var _listeners = Symbol(),
    _cancel = Symbol();
var Source = function Source(callback) {
  var $__0 = this;
  this[_listeners] = [];
  var sink = (function(value) {
    Timer.immediate((function() {
      $__0[_listeners].map((function(ƒ) {
        return ƒ(value);
      }));
    }));
  });
  callback(sink);
};
($traceurRuntime.createClass)(Source, {
  cancel: function() {
    this[_listeners] = [];
  },
  cancelOn: function(source) {
    var $__0 = this;
    var ƒ;
    ƒ = (function() {
      source.unsubscribe(ƒ);
      $__0.cancel();
    });
    source.subscribe(ƒ);
    return this;
  },
  subscribe: function(ƒ) {
    this[_listeners].push(ƒ);
    return this;
  },
  unsubscribe: function(ƒ) {
    this[_listeners].splice(this[_listeners].indexOf(ƒ), 1);
  },
  map: function(ƒ) {
    return Stream.map(this, ƒ);
  },
  filter: function(ƒ) {
    return Stream.filter(this, ƒ);
  },
  unique: function() {
    return Stream.unique(this);
  },
  log: function(prefix) {
    return Stream.log(this, prefix);
  },
  toBool: function() {
    return Stream.toBool(this);
  },
  negate: function() {
    return Stream.negate(this);
  },
  zip: function() {
    var $__7;
    for (var others = [],
        $__2 = 0; $__2 < arguments.length; $__2++)
      others[$__2] = arguments[$__2];
    return ($__7 = Stream).zip.apply($__7, $traceurRuntime.spread([this], others));
  },
  spread: function(ƒ) {
    return Stream.spread(this, ƒ);
  },
  flatMap: function() {
    return Stream.flatMap(this);
  },
  merge: function() {
    var $__7;
    for (var others = [],
        $__3 = 0; $__3 < arguments.length; $__3++)
      others[$__3] = arguments[$__3];
    return ($__7 = Stream).merge.apply($__7, $traceurRuntime.spread([this], others));
  },
  reduce: function(acc, ƒ) {
    return Stream.reduce(this, acc, ƒ);
  },
  feed: function(destValue) {
    return Stream.feed(this, destValue);
  },
  wrap: function(ƒ) {
    ƒ(this);
    return this;
  }
}, {});
var PushSource = function PushSource() {
  var $__0 = this;
  $traceurRuntime.superCall(this, $PushSource.prototype, "constructor", [(function(sink) {
    return $__0.push = sink;
  })]);
};
var $PushSource = PushSource;
($traceurRuntime.createClass)(PushSource, {}, {}, Source);
var CancelableSource = function CancelableSource(cancelƒ) {
  $traceurRuntime.superCall(this, $CancelableSource.prototype, "constructor", []);
  this[_cancel] = cancelƒ.bind(this);
};
var $CancelableSource = CancelableSource;
($traceurRuntime.createClass)(CancelableSource, {cancel: function() {
    this[_cancel]();
    $traceurRuntime.superCall(this, $CancelableSource.prototype, "cancel", []);
  }}, {}, PushSource);
var Stream = {
  subscribe: function(source, ƒ) {
    var bƒ,
        stream = new CancelableSource(function() {
          source.unsubscribe(bƒ);
        });
    bƒ = ƒ.bind(null, stream);
    source.subscribe(bƒ);
    return stream;
  },
  map: function(source, ƒ) {
    return this.subscribe(source, (function(stream, value) {
      return stream.push(ƒ(value));
    }));
  },
  filter: function(source, ƒ) {
    return this.subscribe(source, (function(stream, value) {
      if (ƒ(value))
        stream.push(value);
    }));
  },
  unique: function(source) {
    return this.filter(source, (function() {
      var last;
      return function(v) {
        if (last !== v) {
          last = v;
          return true;
        } else {
          return false;
        }
      };
    })());
  },
  toBool: function(source) {
    return this.map(source, (function(v) {
      return !!v;
    }));
  },
  negate: function(source) {
    return this.map(source, (function(v) {
      return !v;
    }));
  },
  log: function(source, prefix) {
    return this.map(source, (function(v) {
      if (prefix)
        console.log(prefix, v);
      else
        console.log(v);
      return v;
    }));
  },
  zip: function() {
    for (var sources = [],
        $__4 = 0; $__4 < arguments.length; $__4++)
      sources[$__4] = arguments[$__4];
    var length = sources.length,
        unsubs = [],
        stream = new CancelableSource((function() {
          unsubs.map((function(source, i) {
            return sources[i].unsubscribe(unsubs[i]);
          }));
        })),
        values = new Array(length),
        flags = new Array(length),
        update = (function() {
          if (flags.filter((function(v) {
            return v;
          })).length === length) {
            update = (function() {
              return stream.push(values);
            });
            update();
          }
        });
    for (var i = 0; i < length; i++) {
      ((function(i) {
        sources[i].subscribe(unsubs[i] = (function(v) {
          values[i] = v;
          flags[i] = true;
          update();
        }));
      }))(i);
    }
    return stream;
  },
  spread: function(source, ƒ) {
    return this.subscribe(source, (function(stream, arr) {
      return stream.push(ƒ.apply(null, arr));
    }));
  },
  flatMap: function(source) {
    return this.subscribe(source, (function(stream, arr) {
      for (var $v in arr) {
        try {
          throw undefined;
        } catch (v) {
          v = $v;
          stream.push(v);
        }
      }
    }));
  },
  merge: function() {
    for (var sources = [],
        $__5 = 0; $__5 < arguments.length; $__5++)
      sources[$__5] = arguments[$__5];
    var stream,
        ƒ = (function(v) {
          return stream.push(v);
        });
    stream = new CancelableSource((function() {
      sources.map((function(source) {
        return source.unsubscribe(ƒ);
      }));
    }));
    sources.map((function(source) {
      return source.subscribe(ƒ);
    }));
    return stream;
  },
  interval: function(ms, value) {
    var id,
        stream = new CancelableSource(function() {
          clearInterval(id);
        });
    id = setInterval((function() {
      return stream.push(value);
    }), ms);
    return stream;
  },
  delay: function(ms, value) {
    var id,
        stream = new CancelableSource(function() {
          clearTimeout(id);
        });
    id = setTimeout((function() {
      stream.push(value);
      Timer.immediate(stream.cancel.bind(stream));
    }), ms);
    return stream;
  },
  reduce: function(source, acc, ƒ) {
    return this.subscribe(source, (function(stream, value) {
      return stream.push(acc = ƒ(acc, value));
    }));
  },
  feed: function(source, dest) {
    return this.subscribe(source, (function(stream, value) {
      stream.push(value);
      dest.push(value);
    }));
  },
  fromArray: function(values) {
    var stream = new PushSource();
    values.map((function(v) {
      return stream.push(v);
    }));
    return stream;
  },
  sequence: function(values, interval) {
    var repeat = arguments[2] !== (void 0) ? arguments[2] : false;
    var $__0 = this;
    var id,
        stream = new CancelableSource(function() {
          clearInterval(id);
        }),
        index = 0;
    id = setInterval((function() {
      if (index === values.length) {
        if (repeat) {
          index = 0;
        } else {
          clearInterval(id);
          $__0.cancel();
          return;
        }
      }
      stream.push(values[index++]);
    }), interval);
    return stream;
  }
};
;
module.exports = {
  get Stream() {
    return Stream;
  },
  get Source() {
    return Source;
  },
  get PushSource() {
    return PushSource;
  },
  __esModule: true
};


},{"ui/timer":21}],18:[function(require,module,exports){
"use strict";
var __moduleName = "node_modules/streamy/value";
var $__2 = require('./stream'),
    Source = $__2.Source,
    Stream = $__2.Stream;
var _value = Symbol(),
    _defaultValue = Symbol(),
    _update = Symbol();
var Value = function Value(value, defaultValue) {
  var $__0 = this;
  var callback = (function(sink) {
    $__0[_update] = sink;
  });
  $traceurRuntime.superCall(this, $Value.prototype, "constructor", [callback]);
  this[_defaultValue] = defaultValue;
  this[_value] = value;
};
var $Value = Value;
($traceurRuntime.createClass)(Value, {
  subscribe: function(ƒ) {
    ƒ(this[_value]);
    $traceurRuntime.superCall(this, $Value.prototype, "subscribe", [ƒ]);
    return this;
  },
  push: function(value) {
    if (value === this[_value])
      return;
    this[_value] = value;
    this[_update](value);
  },
  get value() {
    return this[_value];
  },
  set value(v) {
    this.push(v);
  },
  get isDefault() {
    return this[_value] === this[_defaultValue];
  },
  reset: function() {
    this.value = this[_defaultValue];
  }
}, {}, Source);
var StringValue = function StringValue() {
  var value = arguments[0] !== (void 0) ? arguments[0] : "";
  var defaultValue = arguments[1] !== (void 0) ? arguments[1] : value;
  $traceurRuntime.superCall(this, $StringValue.prototype, "constructor", [value, defaultValue]);
};
var $StringValue = StringValue;
($traceurRuntime.createClass)(StringValue, {push: function(value) {
    $traceurRuntime.superCall(this, $StringValue.prototype, "push", [(value && value.toString && value.toString()) || (value && ("" + value)) || ""]);
  }}, {}, Value);
var BoolValue = function BoolValue() {
  var value = arguments[0] !== (void 0) ? arguments[0] : false;
  var defaultValue = arguments[1] !== (void 0) ? arguments[1] : value;
  $traceurRuntime.superCall(this, $BoolValue.prototype, "constructor", [value, defaultValue]);
};
var $BoolValue = BoolValue;
($traceurRuntime.createClass)(BoolValue, {
  push: function(value) {
    $traceurRuntime.superCall(this, $BoolValue.prototype, "push", [!!value]);
  },
  toggle: function() {
    this.push(!this.value);
  }
}, {}, Value);
var FloatValue = function FloatValue() {
  var value = arguments[0] !== (void 0) ? arguments[0] : 0.0;
  var defaultValue = arguments[1] !== (void 0) ? arguments[1] : value;
  $traceurRuntime.superCall(this, $FloatValue.prototype, "constructor", [value, defaultValue]);
};
var $FloatValue = FloatValue;
($traceurRuntime.createClass)(FloatValue, {push: function(value) {
    $traceurRuntime.superCall(this, $FloatValue.prototype, "push", [+new Number(value)]);
  }}, {}, Value);
var defaultDate = new Date(null);
var DateValue = function DateValue() {
  var value = arguments[0] !== (void 0) ? arguments[0] : defaultDate;
  var defaultValue = arguments[1] !== (void 0) ? arguments[1] : value;
  $traceurRuntime.superCall(this, $DateValue.prototype, "constructor", [value, defaultValue]);
};
var $DateValue = DateValue;
($traceurRuntime.createClass)(DateValue, {push: function(value) {
    $traceurRuntime.superCall(this, $DateValue.prototype, "push", [new Date(value)]);
  }}, {}, Value);
module.exports = {
  get Value() {
    return Value;
  },
  get StringValue() {
    return StringValue;
  },
  get BoolValue() {
    return BoolValue;
  },
  get FloatValue() {
    return FloatValue;
  },
  get DateValue() {
    return DateValue;
  },
  __esModule: true
};


},{"./stream":17}],19:[function(require,module,exports){
/*
string.js - Copyright (C) 2012-2013, JP Richardson <jprichardson@gmail.com>
*/

!(function() {
  "use strict";

  var VERSION = '1.8.0';

  var ENTITIES = {};

//******************************************************************************
// Added an initialize function which is essentially the code from the S
// constructor.  Now, the S constructor calls this and a new method named
// setValue calls it as well.  The setValue function allows constructors for
// modules that extend string.js to set the initial value of an object without
// knowing the internal workings of string.js.
//
// Also, all methods which return a new S object now call:
//
//      return new this.constructor(s);
//
// instead of:
//
//      return new S(s);
//
// This allows extended objects to keep their proper instanceOf and constructor.
//******************************************************************************

  function initialize (object, s) {
    if (s !== null && s !== undefined) {
      if (typeof s === 'string')
        object.s = s;
      else
        object.s = s.toString();
    } else {
      object.s = s; //null or undefined
    }

    object.orig = s; //original object, currently only used by toCSV() and toBoolean()

    if (s !== null && s !== undefined) {
      if (object.__defineGetter__) {
        object.__defineGetter__('length', function() {
          return object.s.length;
        })
      } else {
        object.length = s.length;
      }
    } else {
      object.length = -1;
    }
  }

  function S(s) {
  	initialize(this, s);
  }

  var __nsp = String.prototype;
  var __sp = S.prototype = {

    between: function(left, right) {
      var s = this.s;
      var startPos = s.indexOf(left);
      var endPos = s.indexOf(right, startPos + left.length);
      if (endPos == -1 && right != null) 
        return new this.constructor('')
      else if (endPos == -1 && right == null)
        return new this.constructor(s.substring(startPos + left.length))
      else 
        return new this.constructor(s.slice(startPos + left.length, endPos));
    },

    //# modified slightly from https://github.com/epeli/underscore.string
    camelize: function() {
      var s = this.trim().s.replace(/(\-|_|\s)+(.)?/g, function(mathc, sep, c) {
        return (c ? c.toUpperCase() : '');
      });
      return new this.constructor(s);
    },

    capitalize: function() {
      return new this.constructor(this.s.substr(0, 1).toUpperCase() + this.s.substring(1).toLowerCase());
    },

    charAt: function(index) {
      return this.s.charAt(index);
    },

    chompLeft: function(prefix) {
      var s = this.s;
      if (s.indexOf(prefix) === 0) {
         s = s.slice(prefix.length);
         return new this.constructor(s);
      } else {
        return this;
      }
    },

    chompRight: function(suffix) {
      if (this.endsWith(suffix)) {
        var s = this.s;
        s = s.slice(0, s.length - suffix.length);
        return new this.constructor(s);
      } else {
        return this;
      }
    },

    //#thanks Google
    collapseWhitespace: function() {
      var s = this.s.replace(/[\s\xa0]+/g, ' ').replace(/^\s+|\s+$/g, '');
      return new this.constructor(s);
    },

    contains: function(ss) {
      return this.s.indexOf(ss) >= 0;
    },

    count: function(ss) {
      var count = 0
        , pos = this.s.indexOf(ss)

      while (pos >= 0) {
        count += 1
        pos = this.s.indexOf(ss, pos + 1)
      }

      return count
    },

    //#modified from https://github.com/epeli/underscore.string
    dasherize: function() {
      var s = this.trim().s.replace(/[_\s]+/g, '-').replace(/([A-Z])/g, '-$1').replace(/-+/g, '-').toLowerCase();
      return new this.constructor(s);
    },

    decodeHtmlEntities: function() { //https://github.com/substack/node-ent/blob/master/index.js
      var s = this.s;
      s = s.replace(/&#(\d+);?/g, function (_, code) {
        return String.fromCharCode(code);
      })
      .replace(/&#[xX]([A-Fa-f0-9]+);?/g, function (_, hex) {
        return String.fromCharCode(parseInt(hex, 16));
      })
      .replace(/&([^;\W]+;?)/g, function (m, e) {
        var ee = e.replace(/;$/, '');
        var target = ENTITIES[e] || (e.match(/;$/) && ENTITIES[ee]);
            
        if (typeof target === 'number') {
          return String.fromCharCode(target);
        }
        else if (typeof target === 'string') {
          return target;
        }
        else {
          return m;
        }
      })

      return new this.constructor(s);
    },

    endsWith: function(suffix) {
      var l  = this.s.length - suffix.length;
      return l >= 0 && this.s.indexOf(suffix, l) === l;
    },

    escapeHTML: function() { //from underscore.string
      return new this.constructor(this.s.replace(/[&<>"']/g, function(m){ return '&' + reversedEscapeChars[m] + ';'; }));
    },

    ensureLeft: function(prefix) {
      var s = this.s;
      if (s.indexOf(prefix) === 0) {
        return this;
      } else {
        return new this.constructor(prefix + s);
      }
    },

    ensureRight: function(suffix) {
      var s = this.s;
      if (this.endsWith(suffix))  {
        return this;
      } else {
        return new this.constructor(s + suffix);
      }
    },

    humanize: function() { //modified from underscore.string
      if (this.s === null || this.s === undefined)
        return new this.constructor('')
      var s = this.underscore().replace(/_id$/,'').replace(/_/g, ' ').trim().capitalize()
      return new this.constructor(s)
    },

    isAlpha: function() {
      return !/[^a-z\xC0-\xFF]/.test(this.s.toLowerCase());
    },

    isAlphaNumeric: function() {
      return !/[^0-9a-z\xC0-\xFF]/.test(this.s.toLowerCase());
    },

    isEmpty: function() {
      return this.s === null || this.s === undefined ? true : /^[\s\xa0]*$/.test(this.s);
    },

    isLower: function() {
      return this.isAlpha() && this.s.toLowerCase() === this.s;
    },

    isNumeric: function() {
      return !/[^0-9]/.test(this.s);
    },

    isUpper: function() {
      return this.isAlpha() && this.s.toUpperCase() === this.s;
    },

    left: function(N) {
      if (N >= 0) {
        var s = this.s.substr(0, N);
        return new this.constructor(s);
      } else {
        return this.right(-N);
      }
    },
    
    lines: function() { //convert windows newlines to unix newlines then convert to an Array of lines
      return this.replaceAll('\r\n', '\n').s.split('\n');
    },

    pad: function(len, ch) { //https://github.com/component/pad
      if (ch == null) ch = ' ';
      if (this.s.length >= len) return new this.constructor(this.s);
      len = len - this.s.length;
      var left = Array(Math.ceil(len / 2) + 1).join(ch);
      var right = Array(Math.floor(len / 2) + 1).join(ch);
      return new this.constructor(left + this.s + right);
    },

    padLeft: function(len, ch) { //https://github.com/component/pad
      if (ch == null) ch = ' ';
      if (this.s.length >= len) return new this.constructor(this.s);
      return new this.constructor(Array(len - this.s.length + 1).join(ch) + this.s);
    },

    padRight: function(len, ch) { //https://github.com/component/pad
      if (ch == null) ch = ' ';
      if (this.s.length >= len) return new this.constructor(this.s);
      return new this.constructor(this.s + Array(len - this.s.length + 1).join(ch));
    },

    parseCSV: function(delimiter, qualifier, escape, lineDelimiter) { //try to parse no matter what
      delimiter = delimiter || ',';
      escape = escape || '\\'
      if (typeof qualifier == 'undefined')
        qualifier = '"';

      var i = 0, fieldBuffer = [], fields = [], len = this.s.length, inField = false, self = this;
      var ca = function(i){return self.s.charAt(i)};
      if (typeof lineDelimiter !== 'undefined') var rows = [];

      if (!qualifier)
        inField = true;

      while (i < len) {
        var current = ca(i);
        switch (current) {
          case escape:
          //fix for issues #32 and #35
          if (inField && ((escape !== qualifier) || ca(i+1) === qualifier)) {
              i += 1;
              fieldBuffer.push(ca(i));
              break;
          }
          if (escape !== qualifier) break;
          case qualifier:
            inField = !inField;
            break;
          case delimiter:
            if (inField && qualifier)
              fieldBuffer.push(current);
            else {
              fields.push(fieldBuffer.join(''))
              fieldBuffer.length = 0;
            }
            break;
          case lineDelimiter:
            if (inField) {
                fieldBuffer.push(current);
            } else {
                if (rows) {
                    fields.push(fieldBuffer.join(''))
                    rows.push(fields);
                    fields = [];
                    fieldBuffer.length = 0;
                }
            }
            break;
          default:
            if (inField)
              fieldBuffer.push(current);
            break;
        }
        i += 1;
      }

      fields.push(fieldBuffer.join(''));
      if (rows) {
        rows.push(fields);
        return rows;
      }
      return fields;
    },

    replaceAll: function(ss, r) {
      //var s = this.s.replace(new RegExp(ss, 'g'), r);
      var s = this.s.split(ss).join(r)
      return new this.constructor(s);
    },

    right: function(N) {
      if (N >= 0) {
        var s = this.s.substr(this.s.length - N, N);
        return new this.constructor(s);
      } else {
        return this.left(-N);
      }
    },

    setValue: function (s) {
	  initialize(this, s);
	  return this;
    },

    slugify: function() {
      var sl = (new S(this.s.replace(/[^\w\s-]/g, '').toLowerCase())).dasherize().s;
      if (sl.charAt(0) === '-')
        sl = sl.substr(1);
      return new this.constructor(sl);
    },

    startsWith: function(prefix) {
      return this.s.lastIndexOf(prefix, 0) === 0;
    },

    stripPunctuation: function() {
      //return new this.constructor(this.s.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()]/g,""));
      return new this.constructor(this.s.replace(/[^\w\s]|_/g, "").replace(/\s+/g, " "));
    },

    stripTags: function() { //from sugar.js
      var s = this.s, args = arguments.length > 0 ? arguments : [''];
      multiArgs(args, function(tag) {
        s = s.replace(RegExp('<\/?' + tag + '[^<>]*>', 'gi'), '');
      });
      return new this.constructor(s);
    },

    template: function(values, opening, closing) {
      var s = this.s
      var opening = opening || Export.TMPL_OPEN
      var closing = closing || Export.TMPL_CLOSE

      var open = opening.replace(/[-[\]()*\s]/g, "\\$&").replace(/\$/g, '\\$')
      var close = closing.replace(/[-[\]()*\s]/g, "\\$&").replace(/\$/g, '\\$')
      var r = new RegExp(open + '(.+?)' + close, 'g')
        //, r = /\{\{(.+?)\}\}/g
      var matches = s.match(r) || [];

      matches.forEach(function(match) {
        var key = match.substring(opening.length, match.length - closing.length);//chop {{ and }}
        if (typeof values[key] != 'undefined')
          s = s.replace(match, values[key]);
      });
      return new this.constructor(s);
    },

    times: function(n) {
      return new this.constructor(new Array(n + 1).join(this.s));
    },

    toBoolean: function() {
      if (typeof this.orig === 'string') {
        var s = this.s.toLowerCase();
        return s === 'true' || s === 'yes' || s === 'on';
      } else
        return this.orig === true || this.orig === 1;
    },

    toFloat: function(precision) {
      var num = parseFloat(this.s)
      if (precision)
        return parseFloat(num.toFixed(precision))
      else
        return num
    },

    toInt: function() { //thanks Google
      // If the string starts with '0x' or '-0x', parse as hex.
      return /^\s*-?0x/i.test(this.s) ? parseInt(this.s, 16) : parseInt(this.s, 10)
    },

    trim: function() {
      var s;
      if (typeof __nsp.trim === 'undefined') 
        s = this.s.replace(/(^\s*|\s*$)/g, '')
      else 
        s = this.s.trim()
      return new this.constructor(s);
    },

    trimLeft: function() {
      var s;
      if (__nsp.trimLeft)
        s = this.s.trimLeft();
      else
        s = this.s.replace(/(^\s*)/g, '');
      return new this.constructor(s);
    },

    trimRight: function() {
      var s;
      if (__nsp.trimRight)
        s = this.s.trimRight();
      else
        s = this.s.replace(/\s+$/, '');
      return new this.constructor(s);
    },

    truncate: function(length, pruneStr) { //from underscore.string, author: github.com/rwz
      var str = this.s;

      length = ~~length;
      pruneStr = pruneStr || '...';

      if (str.length <= length) return new this.constructor(str);

      var tmpl = function(c){ return c.toUpperCase() !== c.toLowerCase() ? 'A' : ' '; },
        template = str.slice(0, length+1).replace(/.(?=\W*\w*$)/g, tmpl); // 'Hello, world' -> 'HellAA AAAAA'

      if (template.slice(template.length-2).match(/\w\w/))
        template = template.replace(/\s*\S+$/, '');
      else
        template = new S(template.slice(0, template.length-1)).trimRight().s;

      return (template+pruneStr).length > str.length ? new S(str) : new S(str.slice(0, template.length)+pruneStr);
    },

    toCSV: function() {
      var delim = ',', qualifier = '"', escape = '\\', encloseNumbers = true, keys = false;
      var dataArray = [];

      function hasVal(it) {
        return it !== null && it !== '';
      }

      if (typeof arguments[0] === 'object') {
        delim = arguments[0].delimiter || delim;
        delim = arguments[0].separator || delim;
        qualifier = arguments[0].qualifier || qualifier;
        encloseNumbers = !!arguments[0].encloseNumbers;
        escape = arguments[0].escape || escape;
        keys = !!arguments[0].keys;
      } else if (typeof arguments[0] === 'string') {
        delim = arguments[0];
      }

      if (typeof arguments[1] === 'string')
        qualifier = arguments[1];

      if (arguments[1] === null)
        qualifier = null;

       if (this.orig instanceof Array)
        dataArray  = this.orig;
      else { //object
        for (var key in this.orig)
          if (this.orig.hasOwnProperty(key))
            if (keys)
              dataArray.push(key);
            else
              dataArray.push(this.orig[key]);
      }

      var rep = escape + qualifier;
      var buildString = [];
      for (var i = 0; i < dataArray.length; ++i) {
        var shouldQualify = hasVal(qualifier)
        if (typeof dataArray[i] == 'number')
          shouldQualify &= encloseNumbers;
        
        if (shouldQualify)
          buildString.push(qualifier);
        
        if (dataArray[i] !== null && dataArray[i] !== undefined) {
          var d = new S(dataArray[i]).replaceAll(qualifier, rep).s;
          buildString.push(d);
        } else 
          buildString.push('')

        if (shouldQualify)
          buildString.push(qualifier);
        
        if (delim)
          buildString.push(delim);
      }

      //chop last delim
      //console.log(buildString.length)
      buildString.length = buildString.length - 1;
      return new this.constructor(buildString.join(''));
    },

    toString: function() {
      return this.s;
    },

    //#modified from https://github.com/epeli/underscore.string
    underscore: function() {
      var s = this.trim().s.replace(/([a-z\d])([A-Z]+)/g, '$1_$2').replace(/[-\s]+/g, '_').toLowerCase();
      if ((new S(this.s.charAt(0))).isUpper()) {
        s = '_' + s;
      }
      return new this.constructor(s);
    },

    unescapeHTML: function() { //from underscore.string
      return new this.constructor(this.s.replace(/\&([^;]+);/g, function(entity, entityCode){
        var match;

        if (entityCode in escapeChars) {
          return escapeChars[entityCode];
        } else if (match = entityCode.match(/^#x([\da-fA-F]+)$/)) {
          return String.fromCharCode(parseInt(match[1], 16));
        } else if (match = entityCode.match(/^#(\d+)$/)) {
          return String.fromCharCode(~~match[1]);
        } else {
          return entity;
        }
      }));
    },

    valueOf: function() {
      return this.s.valueOf();
    }

  }

  var methodsAdded = [];
  function extendPrototype() {
    for (var name in __sp) {
      (function(name){
        var func = __sp[name];
        if (!__nsp.hasOwnProperty(name)) {
          methodsAdded.push(name);
          __nsp[name] = function() {
            String.prototype.s = this;
            return func.apply(this, arguments);
          }
        }
      })(name);
    }
  }

  function restorePrototype() {
    for (var i = 0; i < methodsAdded.length; ++i)
      delete String.prototype[methodsAdded[i]];
    methodsAdded.length = 0;
  }


/*************************************
/* Attach Native JavaScript String Properties
/*************************************/

  var nativeProperties = getNativeStringProperties();
  for (var name in nativeProperties) {
    (function(name) {
      var stringProp = __nsp[name];
      if (typeof stringProp == 'function') {
        //console.log(stringProp)
        if (!__sp[name]) {
          if (nativeProperties[name] === 'string') {
            __sp[name] = function() {
              //console.log(name)
              return new this.constructor(stringProp.apply(this, arguments));
            }
          } else {
            __sp[name] = stringProp;
          }
        }
      }
    })(name);
  }


/*************************************
/* Function Aliases
/*************************************/

  __sp.repeat = __sp.times;
  __sp.include = __sp.contains;
  __sp.toInteger = __sp.toInt;
  __sp.toBool = __sp.toBoolean;
  __sp.decodeHTMLEntities = __sp.decodeHtmlEntities //ensure consistent casing scheme of 'HTML'


//******************************************************************************
// Set the constructor.  Without this, string.js objects are instances of
// Object instead of S.
//******************************************************************************

  __sp.constructor = S;


/*************************************
/* Private Functions
/*************************************/

  function getNativeStringProperties() {
    var names = getNativeStringPropertyNames();
    var retObj = {};

    for (var i = 0; i < names.length; ++i) {
      var name = names[i];
      var func = __nsp[name];
      try {
        var type = typeof func.apply('teststring', []);
        retObj[name] = type;
      } catch (e) {}
    }
    return retObj;
  }

  function getNativeStringPropertyNames() {
    var results = [];
    if (Object.getOwnPropertyNames) {
      results = Object.getOwnPropertyNames(__nsp);
      results.splice(results.indexOf('valueOf'), 1);
      results.splice(results.indexOf('toString'), 1);
      return results;
    } else { //meant for legacy cruft, this could probably be made more efficient
      var stringNames = {};
      var objectNames = [];
      for (var name in String.prototype)
        stringNames[name] = name;

      for (var name in Object.prototype)
        delete stringNames[name];

      //stringNames['toString'] = 'toString'; //this was deleted with the rest of the object names
      for (var name in stringNames) {
        results.push(name);
      }
      return results;
    }
  }

  function Export(str) {
    return new S(str);
  };

  //attach exports to StringJSWrapper
  Export.extendPrototype = extendPrototype;
  Export.restorePrototype = restorePrototype;
  Export.VERSION = VERSION;
  Export.TMPL_OPEN = '{{';
  Export.TMPL_CLOSE = '}}';
  Export.ENTITIES = ENTITIES;



/*************************************
/* Exports
/*************************************/

  if (typeof module !== 'undefined'  && typeof module.exports !== 'undefined') {
    module.exports = Export;

  } else {

    if(typeof define === "function" && define.amd) {
      define([], function() {
        return Export;
      });
    } else {
      window.S = Export;
    }
  }


/*************************************
/* 3rd Party Private Functions
/*************************************/

  //from sugar.js
  function multiArgs(args, fn) {
    var result = [], i;
    for(i = 0; i < args.length; i++) {
      result.push(args[i]);
      if(fn) fn.call(args, args[i], i);
    }
    return result;
  }

  //from underscore.string
  var escapeChars = {
    lt: '<',
    gt: '>',
    quot: '"',
    apos: "'",
    amp: '&'
  };

  //from underscore.string
  var reversedEscapeChars = {};
  for(var key in escapeChars){ reversedEscapeChars[escapeChars[key]] = key; }

  ENTITIES = {
    "amp" : "&",
    "gt" : ">",
    "lt" : "<",
    "quot" : "\"",
    "apos" : "'",
    "AElig" : 198,
    "Aacute" : 193,
    "Acirc" : 194,
    "Agrave" : 192,
    "Aring" : 197,
    "Atilde" : 195,
    "Auml" : 196,
    "Ccedil" : 199,
    "ETH" : 208,
    "Eacute" : 201,
    "Ecirc" : 202,
    "Egrave" : 200,
    "Euml" : 203,
    "Iacute" : 205,
    "Icirc" : 206,
    "Igrave" : 204,
    "Iuml" : 207,
    "Ntilde" : 209,
    "Oacute" : 211,
    "Ocirc" : 212,
    "Ograve" : 210,
    "Oslash" : 216,
    "Otilde" : 213,
    "Ouml" : 214,
    "THORN" : 222,
    "Uacute" : 218,
    "Ucirc" : 219,
    "Ugrave" : 217,
    "Uuml" : 220,
    "Yacute" : 221,
    "aacute" : 225,
    "acirc" : 226,
    "aelig" : 230,
    "agrave" : 224,
    "aring" : 229,
    "atilde" : 227,
    "auml" : 228,
    "ccedil" : 231,
    "eacute" : 233,
    "ecirc" : 234,
    "egrave" : 232,
    "eth" : 240,
    "euml" : 235,
    "iacute" : 237,
    "icirc" : 238,
    "igrave" : 236,
    "iuml" : 239,
    "ntilde" : 241,
    "oacute" : 243,
    "ocirc" : 244,
    "ograve" : 242,
    "oslash" : 248,
    "otilde" : 245,
    "ouml" : 246,
    "szlig" : 223,
    "thorn" : 254,
    "uacute" : 250,
    "ucirc" : 251,
    "ugrave" : 249,
    "uuml" : 252,
    "yacute" : 253,
    "yuml" : 255,
    "copy" : 169,
    "reg" : 174,
    "nbsp" : 160,
    "iexcl" : 161,
    "cent" : 162,
    "pound" : 163,
    "curren" : 164,
    "yen" : 165,
    "brvbar" : 166,
    "sect" : 167,
    "uml" : 168,
    "ordf" : 170,
    "laquo" : 171,
    "not" : 172,
    "shy" : 173,
    "macr" : 175,
    "deg" : 176,
    "plusmn" : 177,
    "sup1" : 185,
    "sup2" : 178,
    "sup3" : 179,
    "acute" : 180,
    "micro" : 181,
    "para" : 182,
    "middot" : 183,
    "cedil" : 184,
    "ordm" : 186,
    "raquo" : 187,
    "frac14" : 188,
    "frac12" : 189,
    "frac34" : 190,
    "iquest" : 191,
    "times" : 215,
    "divide" : 247,
    "OElig;" : 338,
    "oelig;" : 339,
    "Scaron;" : 352,
    "scaron;" : 353,
    "Yuml;" : 376,
    "fnof;" : 402,
    "circ;" : 710,
    "tilde;" : 732,
    "Alpha;" : 913,
    "Beta;" : 914,
    "Gamma;" : 915,
    "Delta;" : 916,
    "Epsilon;" : 917,
    "Zeta;" : 918,
    "Eta;" : 919,
    "Theta;" : 920,
    "Iota;" : 921,
    "Kappa;" : 922,
    "Lambda;" : 923,
    "Mu;" : 924,
    "Nu;" : 925,
    "Xi;" : 926,
    "Omicron;" : 927,
    "Pi;" : 928,
    "Rho;" : 929,
    "Sigma;" : 931,
    "Tau;" : 932,
    "Upsilon;" : 933,
    "Phi;" : 934,
    "Chi;" : 935,
    "Psi;" : 936,
    "Omega;" : 937,
    "alpha;" : 945,
    "beta;" : 946,
    "gamma;" : 947,
    "delta;" : 948,
    "epsilon;" : 949,
    "zeta;" : 950,
    "eta;" : 951,
    "theta;" : 952,
    "iota;" : 953,
    "kappa;" : 954,
    "lambda;" : 955,
    "mu;" : 956,
    "nu;" : 957,
    "xi;" : 958,
    "omicron;" : 959,
    "pi;" : 960,
    "rho;" : 961,
    "sigmaf;" : 962,
    "sigma;" : 963,
    "tau;" : 964,
    "upsilon;" : 965,
    "phi;" : 966,
    "chi;" : 967,
    "psi;" : 968,
    "omega;" : 969,
    "thetasym;" : 977,
    "upsih;" : 978,
    "piv;" : 982,
    "ensp;" : 8194,
    "emsp;" : 8195,
    "thinsp;" : 8201,
    "zwnj;" : 8204,
    "zwj;" : 8205,
    "lrm;" : 8206,
    "rlm;" : 8207,
    "ndash;" : 8211,
    "mdash;" : 8212,
    "lsquo;" : 8216,
    "rsquo;" : 8217,
    "sbquo;" : 8218,
    "ldquo;" : 8220,
    "rdquo;" : 8221,
    "bdquo;" : 8222,
    "dagger;" : 8224,
    "Dagger;" : 8225,
    "bull;" : 8226,
    "hellip;" : 8230,
    "permil;" : 8240,
    "prime;" : 8242,
    "Prime;" : 8243,
    "lsaquo;" : 8249,
    "rsaquo;" : 8250,
    "oline;" : 8254,
    "frasl;" : 8260,
    "euro;" : 8364,
    "image;" : 8465,
    "weierp;" : 8472,
    "real;" : 8476,
    "trade;" : 8482,
    "alefsym;" : 8501,
    "larr;" : 8592,
    "uarr;" : 8593,
    "rarr;" : 8594,
    "darr;" : 8595,
    "harr;" : 8596,
    "crarr;" : 8629,
    "lArr;" : 8656,
    "uArr;" : 8657,
    "rArr;" : 8658,
    "dArr;" : 8659,
    "hArr;" : 8660,
    "forall;" : 8704,
    "part;" : 8706,
    "exist;" : 8707,
    "empty;" : 8709,
    "nabla;" : 8711,
    "isin;" : 8712,
    "notin;" : 8713,
    "ni;" : 8715,
    "prod;" : 8719,
    "sum;" : 8721,
    "minus;" : 8722,
    "lowast;" : 8727,
    "radic;" : 8730,
    "prop;" : 8733,
    "infin;" : 8734,
    "ang;" : 8736,
    "and;" : 8743,
    "or;" : 8744,
    "cap;" : 8745,
    "cup;" : 8746,
    "int;" : 8747,
    "there4;" : 8756,
    "sim;" : 8764,
    "cong;" : 8773,
    "asymp;" : 8776,
    "ne;" : 8800,
    "equiv;" : 8801,
    "le;" : 8804,
    "ge;" : 8805,
    "sub;" : 8834,
    "sup;" : 8835,
    "nsub;" : 8836,
    "sube;" : 8838,
    "supe;" : 8839,
    "oplus;" : 8853,
    "otimes;" : 8855,
    "perp;" : 8869,
    "sdot;" : 8901,
    "lceil;" : 8968,
    "rceil;" : 8969,
    "lfloor;" : 8970,
    "rfloor;" : 8971,
    "lang;" : 9001,
    "rang;" : 9002,
    "loz;" : 9674,
    "spades;" : 9824,
    "clubs;" : 9827,
    "hearts;" : 9829,
    "diams;" : 9830
  }


}).call(this);

},{}],20:[function(require,module,exports){
"use strict";
var __moduleName = "node_modules/ui/dom";
var p = Symbol(),
    Html = {
      parseAll: function(html) {
        var el = document.createElement('div');
        el.innerHTML = html;
        return Array.prototype.slice.apply(el.childNodes);
      },
      parse: function(html) {
        return this.parseAll(html)[0];
      }
    };
var DomStream = function DomStream(source) {
  this[p] = source;
};
($traceurRuntime.createClass)(DomStream, {
  applyDisplay: function(el) {
    var display = arguments[1] !== (void 0) ? arguments[1] : "";
    var $__0 = this;
    var old = el.style.display,
        ƒ = (function(v) {
          return el.style.display = v ? display : "none";
        });
    this[p].subscribe(ƒ);
    return (function() {
      $__0[p].unsubscribe(ƒ);
      el.style.display = old;
    });
  },
  applyText: function(el) {
    var $__0 = this;
    var old = el.innerHTML,
        ƒ = (function(v) {
          return el.innerHTML = v || "";
        });
    this[p].subscribe(ƒ);
    return (function() {
      $__0[p].unsubscribe(ƒ);
      ƒ(old);
    });
  },
  applyAttribute: function(name, el) {
    var $__0 = this;
    var old = el.getAttribute(name),
        ƒ = (function(v) {
          v == null ? el.removeAttribute(name) : el.setAttribute(name, v);
        });
    this[p].subscribe(ƒ);
    return (function() {
      $__0[p].unsubscribe(ƒ);
      ƒ(old);
    });
  },
  applySwapClass: function(el, className) {
    var $__0 = this;
    var has = el.classList.contains(className),
        ƒ = (function(v) {
          return v ? el.classList.add(className) : el.classList.remove(className);
        });
    this[p].subscribe(ƒ);
    return (function() {
      $__0[p].unsubscribe(ƒ);
      ƒ(has);
    });
  }
}, {});
var Dom = {
  stream: function(source) {
    return new DomStream(source);
  },
  ready: function(ƒ) {
    if (ƒ)
      document.addEventListener("DOMContentLoaded", ƒ, false);
    else
      return new Promise((function(resolve) {
        return document.addEventListener("DOMContentLoaded", resolve, false);
      }));
  }
};
var Query = {
  first: function(selector, ctx) {
    return (ctx || document).querySelector(selector);
  },
  all: function(selector, ctx) {
    return (ctx || document).query(selector);
  }
};
;
module.exports = {
  get Html() {
    return Html;
  },
  get Query() {
    return Query;
  },
  get Dom() {
    return Dom;
  },
  __esModule: true
};


},{}],21:[function(require,module,exports){
"use strict";
var __moduleName = "node_modules/ui/timer";
var immediate = require('immediate'),
    Timer = {
      delay: function(ms, ƒ) {
        if (ƒ)
          return setTimeout(ƒ, ms);
        else
          return new Promise((function(resolve) {
            return setTimeout(resolve, ms);
          }));
      },
      immediate: function(ƒ) {
        if (ƒ)
          return immediate(ƒ);
        else
          return new Promise((function(resolve) {
            return immediate(resolve);
          }));
      },
      debounce: function(ƒ) {
        var ms = arguments[1] !== (void 0) ? arguments[1] : 0;
        var tid,
            context,
            args,
            laterƒ;
        return function() {
          context = this;
          args = arguments;
          laterƒ = function() {
            if (!immediate)
              ƒ.apply(context, args);
          };
          clearTimeout(tid);
          tid = setTimeout(laterƒ, ms);
        };
      },
      reduce: function(ƒ) {
        var ms = arguments[1] !== (void 0) ? arguments[1] : 0;
        var tid,
            context,
            args;
        return function() {
          context = this;
          args = arguments;
          if (tid)
            return;
          tid = setTimeout(function() {
            tid = null;
            ƒ.apply(context, args);
          }, ms);
        };
      }
    };
var $__default = Timer;
module.exports = {
  get default() {
    return $__default;
  },
  __esModule: true
};


},{"immediate":9}]},{},[7,1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvZnJhbmNvcG9udGljZWxsaS9wcm9qZWN0cy9jYXJkcy9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvY2xpZW50L21haW4uanMiLCIvVXNlcnMvZnJhbmNvcG9udGljZWxsaS9wcm9qZWN0cy9jYXJkcy9jbGllbnQvdWkvZnJhZ21lbnQuamFkZSIsIi9Vc2Vycy9mcmFuY29wb250aWNlbGxpL3Byb2plY3RzL2NhcmRzL2NsaWVudC91aS9mcmFnbWVudC5qcyIsIi9Vc2Vycy9mcmFuY29wb250aWNlbGxpL3Byb2plY3RzL2NhcmRzL2NsaWVudC91aS9wcm9wZXJ0aWVzLmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvY2xpZW50L3VpL3Byb3BlcnR5Y29udGFpbmVyLmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2luc2VydC1tb2R1bGUtZ2xvYmFscy9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL2VzNmlmeS9ub2RlX21vZHVsZXMvdHJhY2V1ci9iaW4vdHJhY2V1ci1ydW50aW1lLmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL2ltbWVkaWF0ZS9saWIvZmFrZU5leHRUaWNrLmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL2ltbWVkaWF0ZS9saWIvaW5kZXguanMiLCIvVXNlcnMvZnJhbmNvcG9udGljZWxsaS9wcm9qZWN0cy9jYXJkcy9ub2RlX21vZHVsZXMvaW1tZWRpYXRlL2xpYi9tZXNzYWdlQ2hhbm5lbC5qcyIsIi9Vc2Vycy9mcmFuY29wb250aWNlbGxpL3Byb2plY3RzL2NhcmRzL25vZGVfbW9kdWxlcy9pbW1lZGlhdGUvbGliL211dGF0aW9uLmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL2ltbWVkaWF0ZS9saWIvcG9zdE1lc3NhZ2UuanMiLCIvVXNlcnMvZnJhbmNvcG9udGljZWxsaS9wcm9qZWN0cy9jYXJkcy9ub2RlX21vZHVsZXMvaW1tZWRpYXRlL2xpYi9zdGF0ZUNoYW5nZS5qcyIsIi9Vc2Vycy9mcmFuY29wb250aWNlbGxpL3Byb2plY3RzL2NhcmRzL25vZGVfbW9kdWxlcy9pbW1lZGlhdGUvbGliL3RpbWVvdXQuanMiLCIvVXNlcnMvZnJhbmNvcG9udGljZWxsaS9wcm9qZWN0cy9jYXJkcy9ub2RlX21vZHVsZXMvamFkZS9ydW50aW1lLmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL251bWVyYWwvbnVtZXJhbC5qcyIsIi9Vc2Vycy9mcmFuY29wb250aWNlbGxpL3Byb2plY3RzL2NhcmRzL25vZGVfbW9kdWxlcy9zdHJlYW15L3N0cmVhbS5qcyIsIi9Vc2Vycy9mcmFuY29wb250aWNlbGxpL3Byb2plY3RzL2NhcmRzL25vZGVfbW9kdWxlcy9zdHJlYW15L3ZhbHVlLmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL3N0cmluZy9saWIvc3RyaW5nLmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL3VpL2RvbS5qcyIsIi9Vc2Vycy9mcmFuY29wb250aWNlbGxpL3Byb2plY3RzL2NhcmRzL25vZGVfbW9kdWxlcy91aS90aW1lci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtB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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOXpDQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25OQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwOUJBOztHQUFJLENBQUEsQ0FBQyxFQUFHLENBQUEsTUFBTSxFQUFFO1VBQ1I7Q0FDUCxhQUFRLENBQVIsVUFBUyxJQUFJO1dBQ1IsQ0FBQSxFQUFFLEVBQUssQ0FBQSxRQUFRLGNBQWMsQ0FBQyxLQUFLLENBQUM7QUFDeEMsQ0FBQSxTQUFFLFVBQVUsRUFBRyxLQUFJLENBQUM7Q0FDcEIsYUFBTyxDQUFBLEtBQUssVUFBVSxNQUFNLE1BQU0sQ0FBQyxFQUFFLFdBQVcsQ0FBQyxDQUFDO09BQ2xEO0NBQ0QsVUFBSyxDQUFMLFVBQU0sSUFBSSxDQUFFO0NBQ1gsYUFBTyxDQUFBLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO09BQzlCO0NBQUEsSUFDRDtlQUVELFNBQU0sVUFBUyxDQUNGLE1BQU0sQ0FBRTtBQUNuQixDQUFBLEtBQUksQ0FBQyxDQUFDLENBQUMsRUFBRyxPQUFNLENBQUM7Q0FDakI7O0NBQ0QsYUFBWSxDQUFaLFVBQWEsRUFBRSxBQUFjO09BQVosUUFBTyw2Q0FBRyxHQUFFOztPQUN4QixDQUFBLEdBQUcsRUFBRyxDQUFBLEVBQUUsTUFBTSxRQUFRO0FBQ3pCLENBQUEsUUFBQyxhQUFJLENBQUM7Z0JBQUssQ0FBQSxFQUFFLE1BQU0sUUFBUSxFQUFHLENBQUEsQ0FBQyxFQUFHLFFBQU8sRUFBRyxPQUFNO1VBQUE7QUFDbkQsQ0FBQSxPQUFJLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztDQUNyQixxQkFBYTtBQUNaLENBQUEsVUFBSyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3ZCLENBQUEsT0FBRSxNQUFNLFFBQVEsRUFBRyxJQUFHLENBQUM7S0FDdkIsRUFBQztHQUNGO0NBQ0QsVUFBUyxDQUFULFVBQVUsRUFBRTs7T0FDUCxDQUFBLEdBQUcsRUFBRyxDQUFBLEVBQUUsVUFBVTtBQUNyQixDQUFBLFFBQUMsYUFBSSxDQUFDO2dCQUFLLENBQUEsRUFBRSxVQUFVLEVBQUcsQ0FBQSxDQUFDLEdBQUksR0FBRTtVQUFBO0FBQ2xDLENBQUEsT0FBSSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7Q0FDckIscUJBQWE7QUFDWixDQUFBLFVBQUssQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN2QixDQUFBLE1BQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUNQLEVBQUM7R0FDRjtDQUNELGVBQWMsQ0FBZCxVQUFlLElBQUksQ0FBRSxDQUFBLEVBQUU7O09BQ2xCLENBQUEsR0FBRyxFQUFHLENBQUEsRUFBRSxhQUFhLENBQUMsSUFBSSxDQUFDO0FBQzlCLENBQUEsUUFBQyxhQUFJLENBQUMsQ0FBSztBQUNWLENBQUEsVUFBQyxHQUFJLEtBQUksQ0FBQSxDQUFHLENBQUEsRUFBRSxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQSxDQUFHLENBQUEsRUFBRSxhQUFhLENBQUMsSUFBSSxDQUFFLEVBQUMsQ0FBQyxDQUFDO1NBQ2hFLENBQUE7QUFDRixDQUFBLE9BQUksQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0NBQ3JCLHFCQUFhO0FBQ1osQ0FBQSxVQUFLLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdkIsQ0FBQSxNQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDUCxFQUFDO0dBQ0Y7Q0FDRCxlQUFjLENBQWQsVUFBZSxFQUFFLENBQUUsQ0FBQSxTQUFTOztPQUN2QixDQUFBLEdBQUcsRUFBRyxDQUFBLEVBQUUsVUFBVSxTQUFTLENBQUMsU0FBUyxDQUFDO0FBQ3pDLENBQUEsUUFBQyxhQUFJLENBQUM7Z0JBQUssQ0FBQSxDQUFDLEVBQUcsQ0FBQSxFQUFFLFVBQVUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFBLENBQUcsQ0FBQSxFQUFFLFVBQVUsT0FBTyxDQUFDLFNBQVMsQ0FBQztVQUFBO0FBQzVFLENBQUEsT0FBSSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7Q0FDckIscUJBQWE7QUFDWixDQUFBLFVBQUssQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN2QixDQUFBLE1BQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUNQLEVBQUM7R0FDRjs7R0FHRSxDQUFBLEdBQUcsRUFBRztDQUNULE9BQU0sQ0FBTixVQUFPLE1BQU0sQ0FBRTtDQUNkLFNBQU8sSUFBSSxVQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7R0FDN0I7Q0FDRCxNQUFLLENBQUwsVUFBTSxDQUFDO0NBQ04sT0FBRyxDQUFDO0FBQ0gsQ0FBQSxhQUFRLGlCQUFpQixDQUFDLGtCQUFrQixDQUFFLEVBQUMsQ0FBRSxNQUFLLENBQUMsQ0FBQzs7Q0FFeEQsV0FBTyxJQUFJLFFBQU8sV0FBRSxPQUFPO2NBQUssQ0FBQSxRQUFRLGlCQUFpQixDQUFDLGtCQUFrQixDQUFFLFFBQU8sQ0FBRSxNQUFLLENBQUM7U0FBQyxDQUFDO0NBQUEsRUFDaEc7Q0FDRDtHQUVHLENBQUEsS0FBSyxFQUFHO0NBQ1gsTUFBSyxDQUFMLFVBQU0sUUFBUSxDQUFFLENBQUEsR0FBRyxDQUFFO0NBQ3BCLFNBQU8sQ0FBQSxDQUFDLEdBQUcsR0FBSSxTQUFRLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0dBQ2pEO0NBRUQsSUFBRyxDQUFILFVBQUksUUFBUSxDQUFFLENBQUEsR0FBRyxDQUFFO0NBQ2xCLFNBQU8sQ0FBQSxDQUFDLEdBQUcsR0FBSSxTQUFRLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0dBQ3pDO0NBQUEsQUFDRDs7Ozs7Ozs7Ozs7Ozs7Q0FFMkI7OztBQzlFNUI7O0dBQUksQ0FBQSxTQUFTLEVBQUcsQ0FBQSxPQUFPLENBQUMsV0FBVyxDQUFDO1dBQzNCO0NBQ1IsVUFBSyxDQUFMLFVBQU0sRUFBRSxDQUFFLENBQUEsQ0FBQztDQUNWLFdBQUcsQ0FBQztDQUNILGVBQU8sQ0FBQSxVQUFVLENBQUMsQ0FBQyxDQUFFLEdBQUUsQ0FBQyxDQUFDOztDQUV6QixlQUFPLElBQUksUUFBTyxXQUFFLE9BQU87a0JBQUssQ0FBQSxVQUFVLENBQUMsT0FBTyxDQUFFLEdBQUUsQ0FBQzthQUFDLENBQUM7Q0FBQSxNQUMxRDtDQUNELGNBQVMsQ0FBVCxVQUFVLENBQUM7Q0FDVixXQUFHLENBQUM7Q0FDSCxlQUFPLENBQUEsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDOztDQUVwQixlQUFPLElBQUksUUFBTyxXQUFFLE9BQU87a0JBQUssQ0FBQSxTQUFTLENBQUMsT0FBTyxDQUFDO2FBQUMsQ0FBQztDQUFBLE1BQ3JEO0NBQ0QsYUFBUSxDQUFSLFVBQVMsQ0FBQyxBQUFRO1dBQU4sR0FBRSw2Q0FBRyxFQUFDO1dBQ2IsQ0FBQSxHQUFHO0FBQUUsQ0FBQSxrQkFBTztBQUFFLENBQUEsZUFBSTtBQUFFLENBQUEsaUJBQU07Q0FDOUIsYUFBTyxVQUFTLENBQUU7QUFDakIsQ0FBQSxnQkFBTyxFQUFHLEtBQUksQ0FBQztBQUNmLENBQUEsYUFBSSxFQUFHLFVBQVMsQ0FBQztBQUNqQixDQUFBLGVBQU0sRUFBRyxVQUFTLENBQUU7Q0FDbkIsZUFBSSxDQUFDLFNBQVM7QUFBRSxDQUFBLGNBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBRSxLQUFJLENBQUMsQ0FBQztDQUFBLFVBQ3ZDLENBQUM7QUFDRixDQUFBLHFCQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDbEIsQ0FBQSxZQUFHLEVBQUcsQ0FBQSxVQUFVLENBQUMsTUFBTSxDQUFFLEdBQUUsQ0FBQyxDQUFDO1NBQzdCLENBQUM7T0FDRjtDQUNELFdBQU0sQ0FBTixVQUFPLENBQUMsQUFBUTtXQUFOLEdBQUUsNkNBQUcsRUFBQztXQUNYLENBQUEsR0FBRztBQUFFLENBQUEsa0JBQU87QUFBRSxDQUFBLGVBQUk7Q0FDdEIsYUFBTyxVQUFTLENBQUU7QUFDakIsQ0FBQSxnQkFBTyxFQUFHLEtBQUksQ0FBQztBQUNmLENBQUEsYUFBSSxFQUFHLFVBQVMsQ0FBQztDQUNqQixhQUFHLEdBQUc7Q0FBRSxrQkFBTztBQUNmLENBRGUsWUFDWixFQUFHLENBQUEsVUFBVSxDQUFDLFNBQVMsQ0FBRTtBQUMzQixDQUFBLGNBQUcsRUFBRyxLQUFJLENBQUM7QUFDWCxDQUFBLFlBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBRSxLQUFJLENBQUMsQ0FBQztXQUN2QixDQUFFLEdBQUUsQ0FBQyxDQUFDO1NBQ1AsQ0FBQztPQUNGO0tBQ0Q7Z0JBRWMsTUFBSzs7Ozs7OztDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgeyBTdHJlYW0gfSBmcm9tICdzdHJlYW15L3N0cmVhbSc7XG5pbXBvcnQgeyBGcmFnbWVudCB9IGZyb20gJy4vdWkvZnJhZ21lbnQnO1xuaW1wb3J0IHsgUHJvcGVydGllcywgRm9ybWF0cywgRWRpdG9ycyB9IGZyb20gJy4vdWkvcHJvcGVydGllcyc7XG5pbXBvcnQgeyBEb20sIFF1ZXJ5IH0gZnJvbSAndWkvZG9tJztcblxuaW1wb3J0IHsgU3RyaW5nVmFsdWUgfSBmcm9tICdzdHJlYW15L3ZhbHVlJztcblxuRG9tLnJlYWR5KCgpID0+IHtcblx0bGV0IGNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb250YWluZXInKSxcblx0XHRlZGl0b3IgICAgPSBuZXcgRnJhZ21lbnQoKSxcblx0XHRudW1iZXIgICAgPSBuZXcgRnJhZ21lbnQoKSxcblx0XHRmcmFnbWVudCAgPSBuZXcgRnJhZ21lbnQoKTtcblxuXHRlZGl0b3IuYXR0YWNoVG8oY29udGFpbmVyKTtcblx0bnVtYmVyLmF0dGFjaFRvKGNvbnRhaW5lcik7XG5cdGZyYWdtZW50LmF0dGFjaFRvKGNvbnRhaW5lcik7XG5cblx0Ly8gYWRkIHRleHQgcHJvcGVydHkgYW5kIHJlbmRlcmluZ1xuXHRQcm9wZXJ0aWVzLmFkZFRleHQoZWRpdG9yKTtcblx0UHJvcGVydGllcy5hZGRUZXh0KGZyYWdtZW50KTtcblx0UHJvcGVydGllcy5hZGRUZXh0KG51bWJlcik7XG5cblx0Ly8gYWRkIGEgdmFsdWVcblx0UHJvcGVydGllcy5hZGRWYWx1ZShmcmFnbWVudCwgXCJTdHJpbmdcIik7XG5cdGZyYWdtZW50LnZhbHVlID0gXCIgSGV5IEZyYW5jb1wiO1xuXHQvLyBtYW51YWxseSB3aXJlIHZhbHVlIHRvIHRleHRcblx0ZnJhZ21lbnQudmFsdWUuZmVlZChmcmFnbWVudC50ZXh0KTtcblxuXHRQcm9wZXJ0aWVzLmFkZFZhbHVlKG51bWJlciwgXCJGbG9hdFwiKTtcblxuXHQvLyBtYWtlIGl0IGJsaW5rXG5cdFByb3BlcnRpZXMuYWRkVmlzaWJsZShmcmFnbWVudCk7XG5cdFN0cmVhbS5pbnRlcnZhbCgzMDApXG5cdFx0LmNhbmNlbE9uKFN0cmVhbS5kZWxheSg2NTAwKS5zdWJzY3JpYmUoKCkgPT4gUHJvcGVydGllcy5yZW1vdmVWaXNpYmxlKGZyYWdtZW50KSkpXG5cdFx0LnJlZHVjZSh0cnVlLCAoYWNjKSA9PiAhYWNjKVxuXHRcdC5mZWVkKGZyYWdtZW50LnZpc2libGUpO1xuXG5cdC8vIG1ha2UgYm9sZFxuXHRQcm9wZXJ0aWVzLmFkZFN0cm9uZyhmcmFnbWVudCwgdHJ1ZSk7XG5cblx0Ly8gYWRkIGZvcm1hdFxuXHRGb3JtYXRzLmFkZE51bWVyaWMobnVtYmVyLCBcIiQgMCwwLjAwXCIpO1xuXG5cdC8vIGNoYW5nZSBmb3JtYXQgZHluYW1pY2FsbHlcblx0U3RyZWFtXG5cdFx0LnNlcXVlbmNlKFtcIiQgMCwwLjAwXCIsIFwiMC4wMDBcIiwgXCIwLDBcIl0sIDIwMDAsIHRydWUpXG5cdFx0LmZlZWQobnVtYmVyLmZvcm1hdCk7XG5cblx0Ly8gYWRkIGxpbmtcblx0UHJvcGVydGllcy5hZGRMaW5rKG51bWJlcik7XG5cdG51bWJlci5saW5rID0gXCJodHRwOi8vZ29vZ2xlLmNvbVwiO1xuXG5cdC8vIHJlbW92ZSBsaW5rIGFmdGVyIDUgc2Vjc1xuXHRTdHJlYW0uZGVsYXkoNTAwMClcblx0XHQuc3Vic2NyaWJlKCgpID0+IFByb3BlcnRpZXMucmVtb3ZlTGluayhudW1iZXIpKTtcblxuXHQvLyByZW1vdmUgdG9vbHRpcCBhZnRlciA4IHNlY3Ncblx0U3RyZWFtLmRlbGF5KDgwMDApXG5cdFx0LnN1YnNjcmliZSgoKSA9PiBQcm9wZXJ0aWVzLnJlbW92ZVRvb2x0aXAobnVtYmVyKSk7XG5cblx0Ly8gYWRkIHRvb2x0aXBcblx0UHJvcGVydGllcy5hZGRUb29sdGlwKG51bWJlciwgXCJ0b29sdGlwIHRleHQgZ29lcyBoZXJlXCIpO1xuXG5cdC8vIHVwZGF0ZSBudW1iZXJcblx0U3RyZWFtLmludGVydmFsKDEwMDApXG5cdFx0LnJlZHVjZSgwLCAoYWNjKSA9PiBhY2MgKyAzMDAwLzcpXG5cdFx0Ly8uc3Vic2NyaWJlKCgpID0+IGNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KG51bWJlcikpKVxuXHRcdC8vLnN1YnNjcmliZSgoKSA9PiBjb25zb2xlLmxvZyhudW1iZXIucHJvcGVydGllcygpKSlcblx0XHQuZmVlZChudW1iZXIudmFsdWUpO1xuXG5cdC8vIGF0dGVtcHQgYXQgYWRkaW5nIHRleHQgZWRpdG9yXG5cdEVkaXRvcnMuYWRkVGV4dChlZGl0b3IpO1xuXHRlZGl0b3IuZWRpdG9yLnZhbHVlLmxvZygpO1xuXHRlZGl0b3IuZWRpdG9yLmZvY3VzKCk7XG5cblx0Ly8gdGVzdCBjYW5jZWxcblx0Ly8gbGV0IHMgPSBTdHJlYW0uc2VxdWVuY2UoWzEsMiwzXSwgMjAwLCB0cnVlKS5jYW5jZWxPbihTdHJlYW0uZGVsYXkoNTAwMCkpO1xuXHQvLyBzLmxvZyhcIlNcIik7XG5cdC8vIGxldCBtID0gcy5tYXAoKHYpID0+IC12ICogOSkuY2FuY2VsT24oU3RyZWFtLmRlbGF5KDI1MDApKTtcblx0Ly8gbS5sb2coXCJNXCIpO1xufSk7XG5cbiIsInZhciBqYWRlID0gcmVxdWlyZShcImphZGUvcnVudGltZVwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHtcbnZhciBidWYgPSBbXTtcbnZhciBqYWRlX21peGlucyA9IHt9O1xudmFyIGphZGVfaW50ZXJwO1xuXG5idWYucHVzaChcIjxzcGFuIGNsYXNzPVxcXCJmcmFnbWVudFxcXCI+PHNwYW4gY2xhc3M9XFxcImNvbnRlbnRcXFwiPjwvc3Bhbj48L3NwYW4+XCIpOztyZXR1cm4gYnVmLmpvaW4oXCJcIik7XG59OyIsImltcG9ydCB7IEh0bWwgfSBmcm9tICd1aS9kb20nO1xuaW1wb3J0IHsgUHJvcGVydHlDb250YWluZXIsICQgfSBmcm9tICcuL3Byb3BlcnR5Y29udGFpbmVyJztcblxubGV0IHRlbXBsYXRlID0gcmVxdWlyZSgnLi9mcmFnbWVudC5qYWRlJykoKTtcblxuY2xhc3MgRnJhZ21lbnQgZXh0ZW5kcyBQcm9wZXJ0eUNvbnRhaW5lciB7XG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHN1cGVyKEh0bWwucGFyc2UodGVtcGxhdGUpKTtcblx0fVxuXG5cdGF0dGFjaFRvKGNvbnRhaW5lcikge1xuXHRcdGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzWyRdKTtcblx0fVxuXG5cdGRldGFjaCgpIHtcblx0XHRpZighdGhpc1skXS5wYXJlbnROb2RlKVxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdGcmFnbWVudCBpcyBub3QgYXR0YWNoZWQnKTtcblx0XHR0aGlzWyRdLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodGhpc1skXSk7XG5cdH1cbn1cblxuZXhwb3J0IHsgRnJhZ21lbnQgfTsiLCJsZXQgc3RyaW5nICA9IHJlcXVpcmUoJ3N0cmluZycpLFxuXHRudW1lcmFsID0gcmVxdWlyZSgnbnVtZXJhbCcpO1xuXG5pbXBvcnQgeyBEb20sIFF1ZXJ5IH0gZnJvbSAndWkvZG9tJztcbmltcG9ydCB7IFN0cmluZ1ZhbHVlLCBCb29sVmFsdWUsIEZsb2F0VmFsdWUsIERhdGVWYWx1ZSB9IGZyb20gJ3N0cmVhbXkvdmFsdWUnO1xuXG5mdW5jdGlvbiBhZGRTd2FwQ2xhc3NGcmFnbWVudChuYW1lLCBjbGFzc05hbWUgPSBuYW1lKSB7XG5cdHJldHVybiBmdW5jdGlvbihmcmFnbWVudCwgZGVmYXVsdFZhbHVlID0gZmFsc2UpIHtcblx0XHRmcmFnbWVudC5hZGRWYWx1ZShuYW1lLCBuZXcgQm9vbFZhbHVlKGRlZmF1bHRWYWx1ZSksIGZ1bmN0aW9uKHZhbHVlLCBlbCkge1xuXHRcdFx0cmV0dXJuIERvbS5zdHJlYW0odmFsdWUpLmFwcGx5U3dhcENsYXNzKGVsLCBjbGFzc05hbWUpO1xuXHRcdH0pO1xuXHR9O1xufVxuXG5mdW5jdGlvbiBhZGRBdHRyaWJ1dGVGcmFnbWVudChuYW1lLCBhdHRyaWJ1dGUpIHtcblx0cmV0dXJuIGZ1bmN0aW9uKGZyYWdtZW50LCB0ZXh0ID0gXCJcIikge1xuXHRcdGZyYWdtZW50LmFkZFZhbHVlKG5hbWUsIG5ldyBTdHJpbmdWYWx1ZSh0ZXh0KSwgZnVuY3Rpb24odmFsdWUsIGVsKSB7XG5cdFx0XHRyZXR1cm4gRG9tLnN0cmVhbSh2YWx1ZSkuYXBwbHlBdHRyaWJ1dGUoYXR0cmlidXRlLCBlbCk7XG5cdFx0fSk7XG5cdH1cbn1cblxuZnVuY3Rpb24gY3JlYXRlVmFsdWUodHlwZSwgLi4uYXJncykge1xuXHRzd2l0Y2godHlwZSkge1xuXHRcdGNhc2UgXCJTdHJpbmdcIjpcblx0XHRcdHJldHVybiBuZXcgU3RyaW5nVmFsdWUoLi4uYXJncyk7XG5cdFx0Y2FzZSBcIkJvb2xcIjpcblx0XHRcdHJldHVybiBuZXcgQm9vbFZhbHVlKC4uLmFyZ3MpO1xuXHRcdGNhc2UgXCJGbG9hdFwiOlxuXHRcdFx0cmV0dXJuIG5ldyBGbG9hdFZhbHVlKC4uLmFyZ3MpO1xuXHRcdGNhc2UgXCJEYXRlXCI6XG5cdFx0XHRyZXR1cm4gbmV3IERhdGVWYWx1ZSguLi5hcmdzKTtcblx0fVxufVxuXG5sZXQgcCA9IHtcblx0dmFsdWU6IGZ1bmN0aW9uKGZyYWdtZW50LCB0eXBlLCAuLi5hcmdzKSB7XG5cdFx0bGV0IHZhbHVlID0gdHlwZW9mIHR5cGUgPT09IFwic3RyaW5nXCIgPyBjcmVhdGVWYWx1ZSh0eXBlLCAuLi5hcmdzKSA6IHR5cGU7XG5cdFx0ZnJhZ21lbnQuYWRkVmFsdWUoXCJ2YWx1ZVwiLCB2YWx1ZSwgZnVuY3Rpb24odmFsdWUsIGVsKSB7XG5cdFx0XHRyZXR1cm4gKCkgPT4ge307XG5cdFx0fSk7XG5cdH0sXG5cdHRleHQ6IGZ1bmN0aW9uKGZyYWdtZW50LCB0ZXh0ID0gXCJcIikge1xuXHRcdGZyYWdtZW50LmFkZFZhbHVlKFwidGV4dFwiLCBuZXcgU3RyaW5nVmFsdWUodGV4dCksIGZ1bmN0aW9uKHZhbHVlLCBlbCkge1xuXHRcdFx0bGV0IGNvbnRlbnQgPSBRdWVyeS5maXJzdCgnLmNvbnRlbnQnLCBlbCk7XG5cdFx0XHRyZXR1cm4gRG9tLnN0cmVhbSh2YWx1ZSkuYXBwbHlUZXh0KGNvbnRlbnQpO1xuXHRcdH0pO1xuXHR9LFxuXHR2aXNpYmxlOiBmdW5jdGlvbihmcmFnbWVudCwgZGVmYXVsdFZhbHVlID0gdHJ1ZSkge1xuXHRcdGZyYWdtZW50LmFkZFZhbHVlKFwidmlzaWJsZVwiLCBuZXcgQm9vbFZhbHVlKGRlZmF1bHRWYWx1ZSksIGZ1bmN0aW9uKHZhbHVlLCBlbCkge1xuXHRcdFx0cmV0dXJuIERvbS5zdHJlYW0odmFsdWUpLmFwcGx5RGlzcGxheShlbCk7XG5cdFx0fSk7XG5cdH0sXG5cdHN0cm9uZzogYWRkU3dhcENsYXNzRnJhZ21lbnQoJ3N0cm9uZycpLFxuXHRlbXBoYXNpczogYWRkU3dhcENsYXNzRnJhZ21lbnQoJ2VtcGhhc2lzJyksXG5cdHN0cmlrZTogYWRkU3dhcENsYXNzRnJhZ21lbnQoJ3N0cmlrZScpLFxuXHR0b29sdGlwOiBhZGRBdHRyaWJ1dGVGcmFnbWVudCgndG9vbHRpcCcsICd0aXRsZScpLFxuXHRsaW5rOiBmdW5jdGlvbihmcmFnbWVudCwgdXJsID0gXCJcIikge1xuXHRcdGZyYWdtZW50LmFkZFZhbHVlKFwibGlua1wiLCBuZXcgU3RyaW5nVmFsdWUodXJsKSwgZnVuY3Rpb24odmFsdWUsIGVsKSB7XG5cdFx0XHRsZXQgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKSxcblx0XHRcdFx0xpIgPSAodXJsKSA9PiBhLmhyZWYgPSB1cmw7XG5cdFx0XHRhLnRhcmdldCA9IFwiX2JsYW5rXCI7XG5cdFx0XHRmb3IobGV0IGkgPSAwOyBpIDwgZWwuY2hpbGROb2Rlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRhLmFwcGVuZENoaWxkKGVsLmNoaWxkTm9kZXNbaV0pO1xuXHRcdFx0fVxuXHRcdFx0ZWwuYXBwZW5kQ2hpbGQoYSk7XG5cdFx0XHR2YWx1ZS5zdWJzY3JpYmUoxpIpO1xuXHRcdFx0cmV0dXJuICgpID0+IHtcblx0XHRcdFx0dmFsdWUudW5zdWJzY3JpYmUoxpIpO1xuXHRcdFx0XHRlbC5yZW1vdmVDaGlsZChhKTtcblx0XHRcdFx0Zm9yKGxldCBpID0gMDsgaSA8IGEuY2hpbGROb2Rlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdGVsLmFwcGVuZENoaWxkKGEuY2hpbGROb2Rlc1tpXSk7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFx0fSk7XG5cdH1cbn07XG5cbmxldCBQcm9wZXJ0aWVzID0ge1xuXG59O1xuXG5mb3IobGV0IG5hbWUgaW4gcCkge1xuXHRsZXQgY2FwICAgICAgID0gc3RyaW5nKG5hbWUpLmNhcGl0YWxpemUoKS5zLFxuXHRcdGtleVJlbW92ZSA9ICdyZW1vdmUnICsgY2FwLFxuXHRcdGtleUFkZCAgICA9ICdhZGQnICsgY2FwO1xuXHRQcm9wZXJ0aWVzW2tleUFkZF0gPSBwW25hbWVdO1xuXHRQcm9wZXJ0aWVzW2tleVJlbW92ZV0gPSBmdW5jdGlvbihmcmFnbWVudCkgeyBmcmFnbWVudC5yZW1vdmUobmFtZSk7IH07XG59XG5cbmxldCBGb3JtYXRzID0ge1xuXHRhZGROdW1lcmljKGZyYWdtZW50LCBkZWZhdWx0Rm9ybWF0ID0gXCJcIikge1xuXHRcdGxldCB2YWx1ZSA9IGZyYWdtZW50LnZhbHVlLFxuXHRcdFx0dGV4dCAgPSBmcmFnbWVudC50ZXh0O1xuXHRcdGlmKCF2YWx1ZSkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiJ2Zvcm1hdCcgcmVxdWlyZXMgdGhlIHByb3BlcnR5ICd2YWx1ZSdcIik7XG5cdFx0fVxuXHRcdGlmKCF0ZXh0KSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCInZm9ybWF0JyByZXF1aXJlcyB0aGUgcHJvcGVydHkgJ3RleHQnXCIpO1xuXHRcdH1cblx0XHRmcmFnbWVudC5hZGRWYWx1ZShcImZvcm1hdFwiLCBuZXcgU3RyaW5nVmFsdWUoZGVmYXVsdEZvcm1hdCksIGZ1bmN0aW9uKGZvcm1hdCkge1xuXHRcdFx0bGV0IHN0cmVhbSA9IHZhbHVlLnppcChmb3JtYXQpO1xuXHRcdFx0c3RyZWFtLnNwcmVhZCgodmFsdWUsIGZvcm1hdCkgPT4ge1xuXHRcdFx0XHRcdGlmKGZvcm1hdCA9PT0gXCJcIikge1xuXHRcdFx0XHRcdFx0Zm9ybWF0ID0gTWF0aC5mbG9vcih2YWx1ZSkgPT09IHZhbHVlID8gXCIwLDBcIiA6IFwiMCwwLjAwMFwiO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR0ZXh0LnZhbHVlID0gbnVtZXJhbCh2YWx1ZSkuZm9ybWF0KGZvcm1hdCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIHN0cmVhbS5jYW5jZWwuYmluZChzdHJlYW0pO1xuXHRcdH0pO1xuXHR9LFxuXHRyZW1vdmUoZnJhZ21lbnQpIHtcblx0XHRmcmFnbWVudC5yZW1vdmUoJ2Zvcm1hdCcpO1xuXHR9XG59XG5cbmxldCBFZGl0b3JzID0ge1xuXHRhZGRUZXh0KGZyYWdtZW50KSB7XG5cdFx0dmFyIGNvbnRhaW5lciA9IGZyYWdtZW50LmFkZENvbnRhaW5lcihcImVkaXRvclwiLCBcInZhbHVlXCIpO1xuXHRcdGNvbnRhaW5lci5hZGRWYWx1ZShcInZhbHVlXCIsIG5ldyBTdHJpbmdWYWx1ZShcIlwiKSwgZnVuY3Rpb24odmFsdWUsIGVsKSB7XG5cdFx0XHRsZXQgY29udGVudCA9IFF1ZXJ5LmZpcnN0KCcuY29udGVudCcsIGVsKSxcblx0XHRcdFx0c3RyZWFtICA9IHZhbHVlLm1hcCgocykgPT4gcy5sZW5ndGggPT09IDApLnVuaXF1ZSgpLFxuXHRcdFx0XHRzdHJlYW3GkiA9IERvbS5zdHJlYW0oc3RyZWFtKS5hcHBseVN3YXBDbGFzcyhjb250ZW50LCAnZW1wdHknKSxcblx0XHRcdFx0bGlzdGVuxpIgPSAoZSkgPT4ge1xuXHRcdFx0XHRcdHZhbHVlLnB1c2goZWwuaW5uZXJUZXh0KTtcblx0XHRcdFx0fTtcblxuXHRcdFx0Y29udGVudC5zZXRBdHRyaWJ1dGUoXCJjb250ZW50ZWRpdGFibGVcIiwgdHJ1ZSk7XG5cdFx0XHRjb250ZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCBsaXN0ZW7GkiwgZmFsc2UpO1xuXG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHN0cmVhbcaSKCk7XG5cdFx0XHRcdGNvbnRlbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsIGxpc3RlbsaSLCBmYWxzZSk7XG5cdFx0XHRcdGNvbnRlbnQucmVtb3ZlQXR0cmlidXRlKFwiY29udGVudGVkaXRhYmxlXCIpO1xuXHRcdFx0fTtcblx0XHR9KTtcblx0XHRjb250YWluZXIuYWRkQmVoYXZpb3IoXCJmb2N1c1wiLCBmdW5jdGlvbihlbCkge1xuXHRcdFx0bGV0IGNvbnRlbnQgPSBRdWVyeS5maXJzdCgnLmNvbnRlbnQnLCBlbClcblx0XHRcdHJldHVybiBmdW5jdGlvbigpIHsgY29udGVudC5mb2N1cygpOyB9O1xuXHRcdH0pO1xuXHR9LFxuXHRyZW1vdmUoZnJhZ21lbnQpIHtcblx0XHRmcmFnbWVudC5yZW1vdmUoJ2VkaXRvcicpO1xuXHR9XG59XG5cbmV4cG9ydCB7IFByb3BlcnRpZXMsIEZvcm1hdHMsIEVkaXRvcnMgfTsiLCJpbXBvcnQgeyBIdG1sIH0gZnJvbSAndWkvZG9tJztcblxubGV0IHUgPSBTeW1ib2woKSxcblx0JCA9IFN5bWJvbCgpLFxuXHRfcGFyZW50ID0gU3ltYm9sKCk7XG5cbi8vIFRPRE8sIGFkZCBwcm9wZXJ0aWVzIGl0ZXJhdG9yXG5jbGFzcyBQcm9wZXJ0eUNvbnRhaW5lciB7XG5cdGNvbnN0cnVjdG9yKGVsZW1lbnQsIHBhcmVudCkge1xuXHRcdHRoaXNbX3BhcmVudF0gPSBwYXJlbnQ7XG5cdFx0dGhpc1t1XSA9IHt9O1xuXHRcdHRoaXNbJF0gPSBlbGVtZW50O1xuXHR9XG5cblx0YWRkVmFsdWUobmFtZSwgdmFsdWUsIHdpcmUpIHtcblx0XHRpZihuYW1lIGluIHRoaXMpXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEEgcHJvcGVydHkgJyR7bmFtZX0nIGFscmVhZHkgZXhpc3RzYCk7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIG5hbWUsIHtcblx0XHRcdGNvbmZpZ3VyYWJsZTogdHJ1ZSxcblx0XHRcdGVudW1lcmFibGU6IHRydWUsXG5cdFx0XHR3cml0ZWFibGU6IGZhbHNlLFxuXHRcdFx0Z2V0OiAoKSA9PiB2YWx1ZSxcblx0XHRcdHNldDogKHYpID0+IHZhbHVlLnB1c2godilcblx0XHR9KTtcblx0XHR0aGlzW3VdW25hbWVdID0gd2lyZS5jYWxsKHRoaXMsIHZhbHVlLCB0aGlzWyRdKTtcblx0fVxuXG5cdGFkZENvbnRhaW5lcihuYW1lLCBkZWZhdWx0RmllbGQsIHdpcmUpIHtcblx0XHRpZih0aGlzW3VdW25hbWVdKVxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBBIHByb3BlcnR5ICcke25hbWV9JyBhbHJlYWR5IGV4aXN0c2ApO1xuXHRcdGxldCBjb250YWluZXIgPSBuZXcgUHJvcGVydHlDb250YWluZXIodGhpc1skXSwgdGhpcyksXG5cdFx0XHRzZXR0ZXIgPSAoZGVmYXVsdEZpZWxkKSA/XG5cdFx0XHRcdGZ1bmN0aW9uKHYpIHsgY29udGFpbmVyW2RlZmF1bHRGaWVsZF0ucHVzaCh2KTsgfSA6XG5cdFx0XHRcdGZ1bmN0aW9uKCkgeyB0aHJvdyBuZXcgRXJyb3IoJ1Byb3BlcnR5IENvbnRhaW5lciBkb2VzblxcJ3QgaGF2ZSBhIGRlZmF1bHQgZmllbGQnKTsgfSxcblx0XHRcdHVud2lyZSA9IHdpcmUgJiYgd2lyZS5jYWxsKHRoaXMsIHRoaXNbJF0pIHx8IGZ1bmN0aW9uKCl7fTtcblx0XHR0aGlzW3VdW25hbWVdID0gKCkgPT4ge1xuXHRcdFx0dW53aXJlKCk7XG5cdFx0XHRjb250YWluZXIucmVtb3ZlQWxsLmJpbmQoY29udGFpbmVyKTtcblx0XHR9O1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBuYW1lLCB7XG5cdFx0XHRjb25maWd1cmFibGU6IHRydWUsXG5cdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuXHRcdFx0d3JpdGVhYmxlOiBmYWxzZSxcblx0XHRcdGdldDogKCkgPT4gY29udGFpbmVyLFxuXHRcdFx0c2V0OiBzZXR0ZXJcblx0XHR9KTtcblx0XHRyZXR1cm4gY29udGFpbmVyO1xuXHR9XG5cblx0YWRkQmVoYXZpb3IobmFtZSwgd2lyZSkge1xuXHRcdGlmKHRoaXNbdV1bbmFtZV0pXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEEgcHJvcGVydHkgJyR7bmFtZX0nIGFscmVhZHkgZXhpc3RzYCk7XG5cdFx0dGhpc1t1XVtuYW1lXSA9ICgpID0+IHt9O1xuXHRcdGxldCDGkiA9IHdpcmUuY2FsbCh0aGlzLCB0aGlzWyRdKTtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgbmFtZSwge1xuXHRcdFx0Y29uZmlndXJhYmxlOiB0cnVlLFxuXHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcblx0XHRcdHdyaXRlYWJsZTogZmFsc2UsXG5cdFx0XHRnZXQ6ICgpID0+IMaSLmJpbmQodGhpcylcblx0XHR9KTtcblx0fVxuXG5cdHJlbW92ZShuYW1lKSB7XG5cdFx0aWYoIXRoaXNbdV1bbmFtZV0pXG5cdFx0XHR0aHJvdyBgT2JqZWN0IGRvZXNuJ3QgY29udGFpbiBhIHByb3BlcnR5ICcke25hbWV9J2A7XG5cdFx0dGhpc1t1XVtuYW1lXSgpO1xuXHRcdGRlbGV0ZSB0aGlzW3VdW25hbWVdO1xuXHRcdGRlbGV0ZSB0aGlzW25hbWVdO1xuXHR9XG5cblx0cmVtb3ZlQWxsKCkge1xuXHRcdGZvcihsZXQga2V5IGluIHRoaXNbdV0pXG5cdFx0XHR0aGlzLnJlbW92ZShrZXkpO1xuXHR9XG5cblx0cHJvcGVydGllcygpIHtcblx0XHRsZXQgYXJyID0gW107XG5cdFx0Zm9yKGxldCBrZXkgaW4gdGhpc1t1XSlcblx0XHRcdGFyci5wdXNoKGtleSlcblx0XHRyZXR1cm4gYXJyO1xuXHR9XG5cblx0Z2V0IHBhcmVudCgpIHtcblx0XHRyZXR1cm4gdGhpc1tfcGFyZW50XTtcblx0fVxuXG5cdHRvSlNPTigpIHtcblx0XHRsZXQgb3V0ID0ge307XG5cdFx0Zm9yKGxldCBrZXkgaW4gdGhpc1t1XSkge1xuXHRcdFx0aWYoXCJpc0RlZmF1bHRcIiBpbiB0aGlzW2tleV0gJiYgdGhpc1trZXldLmlzRGVmYXVsdClcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRvdXRba2V5XSA9IHRoaXNba2V5XS52YWx1ZTtcblx0XHR9XG5cdFx0cmV0dXJuIG91dDtcblx0fVxufVxuXG5cbmV4cG9ydCB7IFByb3BlcnR5Q29udGFpbmVyLCAkIH07IiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG5cbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxucHJvY2Vzcy5uZXh0VGljayA9IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNhblNldEltbWVkaWF0ZSA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnXG4gICAgJiYgd2luZG93LnNldEltbWVkaWF0ZTtcbiAgICB2YXIgY2FuUG9zdCA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnXG4gICAgJiYgd2luZG93LnBvc3RNZXNzYWdlICYmIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyXG4gICAgO1xuXG4gICAgaWYgKGNhblNldEltbWVkaWF0ZSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGYpIHsgcmV0dXJuIHdpbmRvdy5zZXRJbW1lZGlhdGUoZikgfTtcbiAgICB9XG5cbiAgICBpZiAoY2FuUG9zdCkge1xuICAgICAgICB2YXIgcXVldWUgPSBbXTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBmdW5jdGlvbiAoZXYpIHtcbiAgICAgICAgICAgIHZhciBzb3VyY2UgPSBldi5zb3VyY2U7XG4gICAgICAgICAgICBpZiAoKHNvdXJjZSA9PT0gd2luZG93IHx8IHNvdXJjZSA9PT0gbnVsbCkgJiYgZXYuZGF0YSA9PT0gJ3Byb2Nlc3MtdGljaycpIHtcbiAgICAgICAgICAgICAgICBldi5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICBpZiAocXVldWUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZm4gPSBxdWV1ZS5zaGlmdCgpO1xuICAgICAgICAgICAgICAgICAgICBmbigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgdHJ1ZSk7XG5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIG5leHRUaWNrKGZuKSB7XG4gICAgICAgICAgICBxdWV1ZS5wdXNoKGZuKTtcbiAgICAgICAgICAgIHdpbmRvdy5wb3N0TWVzc2FnZSgncHJvY2Vzcy10aWNrJywgJyonKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gbmV4dFRpY2soZm4pIHtcbiAgICAgICAgc2V0VGltZW91dChmbiwgMCk7XG4gICAgfTtcbn0pKCk7XG5cbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59XG5cbi8vIFRPRE8oc2h0eWxtYW4pXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbiIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwpe1xuKGZ1bmN0aW9uKGdsb2JhbCkge1xuICAndXNlIHN0cmljdCc7XG4gIGlmIChnbG9iYWwuJHRyYWNldXJSdW50aW1lKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHZhciAkT2JqZWN0ID0gT2JqZWN0O1xuICB2YXIgJFR5cGVFcnJvciA9IFR5cGVFcnJvcjtcbiAgdmFyICRjcmVhdGUgPSAkT2JqZWN0LmNyZWF0ZTtcbiAgdmFyICRkZWZpbmVQcm9wZXJ0aWVzID0gJE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzO1xuICB2YXIgJGRlZmluZVByb3BlcnR5ID0gJE9iamVjdC5kZWZpbmVQcm9wZXJ0eTtcbiAgdmFyICRmcmVlemUgPSAkT2JqZWN0LmZyZWV6ZTtcbiAgdmFyICRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPSAkT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcjtcbiAgdmFyICRnZXRPd25Qcm9wZXJ0eU5hbWVzID0gJE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzO1xuICB2YXIgJGdldFByb3RvdHlwZU9mID0gJE9iamVjdC5nZXRQcm90b3R5cGVPZjtcbiAgdmFyICRoYXNPd25Qcm9wZXJ0eSA9ICRPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuICB2YXIgJHRvU3RyaW5nID0gJE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG4gIGZ1bmN0aW9uIG5vbkVudW0odmFsdWUpIHtcbiAgICByZXR1cm4ge1xuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICB3cml0YWJsZTogdHJ1ZVxuICAgIH07XG4gIH1cbiAgdmFyIHR5cGVzID0ge1xuICAgIHZvaWQ6IGZ1bmN0aW9uIHZvaWRUeXBlKCkge30sXG4gICAgYW55OiBmdW5jdGlvbiBhbnkoKSB7fSxcbiAgICBzdHJpbmc6IGZ1bmN0aW9uIHN0cmluZygpIHt9LFxuICAgIG51bWJlcjogZnVuY3Rpb24gbnVtYmVyKCkge30sXG4gICAgYm9vbGVhbjogZnVuY3Rpb24gYm9vbGVhbigpIHt9XG4gIH07XG4gIHZhciBtZXRob2QgPSBub25FbnVtO1xuICB2YXIgY291bnRlciA9IDA7XG4gIGZ1bmN0aW9uIG5ld1VuaXF1ZVN0cmluZygpIHtcbiAgICByZXR1cm4gJ19fJCcgKyBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxZTkpICsgJyQnICsgKytjb3VudGVyICsgJyRfXyc7XG4gIH1cbiAgdmFyIHN5bWJvbEludGVybmFsUHJvcGVydHkgPSBuZXdVbmlxdWVTdHJpbmcoKTtcbiAgdmFyIHN5bWJvbERlc2NyaXB0aW9uUHJvcGVydHkgPSBuZXdVbmlxdWVTdHJpbmcoKTtcbiAgdmFyIHN5bWJvbERhdGFQcm9wZXJ0eSA9IG5ld1VuaXF1ZVN0cmluZygpO1xuICB2YXIgc3ltYm9sVmFsdWVzID0gJGNyZWF0ZShudWxsKTtcbiAgZnVuY3Rpb24gaXNTeW1ib2woc3ltYm9sKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBzeW1ib2wgPT09ICdvYmplY3QnICYmIHN5bWJvbCBpbnN0YW5jZW9mIFN5bWJvbFZhbHVlO1xuICB9XG4gIGZ1bmN0aW9uIHR5cGVPZih2KSB7XG4gICAgaWYgKGlzU3ltYm9sKHYpKVxuICAgICAgcmV0dXJuICdzeW1ib2wnO1xuICAgIHJldHVybiB0eXBlb2YgdjtcbiAgfVxuICBmdW5jdGlvbiBTeW1ib2woZGVzY3JpcHRpb24pIHtcbiAgICB2YXIgdmFsdWUgPSBuZXcgU3ltYm9sVmFsdWUoZGVzY3JpcHRpb24pO1xuICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBTeW1ib2wpKVxuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1N5bWJvbCBjYW5ub3QgYmUgbmV3XFwnZWQnKTtcbiAgfVxuICAkZGVmaW5lUHJvcGVydHkoU3ltYm9sLnByb3RvdHlwZSwgJ2NvbnN0cnVjdG9yJywgbm9uRW51bShTeW1ib2wpKTtcbiAgJGRlZmluZVByb3BlcnR5KFN5bWJvbC5wcm90b3R5cGUsICd0b1N0cmluZycsIG1ldGhvZChmdW5jdGlvbigpIHtcbiAgICB2YXIgc3ltYm9sVmFsdWUgPSB0aGlzW3N5bWJvbERhdGFQcm9wZXJ0eV07XG4gICAgaWYgKCFnZXRPcHRpb24oJ3N5bWJvbHMnKSlcbiAgICAgIHJldHVybiBzeW1ib2xWYWx1ZVtzeW1ib2xJbnRlcm5hbFByb3BlcnR5XTtcbiAgICBpZiAoIXN5bWJvbFZhbHVlKVxuICAgICAgdGhyb3cgVHlwZUVycm9yKCdDb252ZXJzaW9uIGZyb20gc3ltYm9sIHRvIHN0cmluZycpO1xuICAgIHZhciBkZXNjID0gc3ltYm9sVmFsdWVbc3ltYm9sRGVzY3JpcHRpb25Qcm9wZXJ0eV07XG4gICAgaWYgKGRlc2MgPT09IHVuZGVmaW5lZClcbiAgICAgIGRlc2MgPSAnJztcbiAgICByZXR1cm4gJ1N5bWJvbCgnICsgZGVzYyArICcpJztcbiAgfSkpO1xuICAkZGVmaW5lUHJvcGVydHkoU3ltYm9sLnByb3RvdHlwZSwgJ3ZhbHVlT2YnLCBtZXRob2QoZnVuY3Rpb24oKSB7XG4gICAgdmFyIHN5bWJvbFZhbHVlID0gdGhpc1tzeW1ib2xEYXRhUHJvcGVydHldO1xuICAgIGlmICghc3ltYm9sVmFsdWUpXG4gICAgICB0aHJvdyBUeXBlRXJyb3IoJ0NvbnZlcnNpb24gZnJvbSBzeW1ib2wgdG8gc3RyaW5nJyk7XG4gICAgaWYgKCFnZXRPcHRpb24oJ3N5bWJvbHMnKSlcbiAgICAgIHJldHVybiBzeW1ib2xWYWx1ZVtzeW1ib2xJbnRlcm5hbFByb3BlcnR5XTtcbiAgICByZXR1cm4gc3ltYm9sVmFsdWU7XG4gIH0pKTtcbiAgZnVuY3Rpb24gU3ltYm9sVmFsdWUoZGVzY3JpcHRpb24pIHtcbiAgICB2YXIga2V5ID0gbmV3VW5pcXVlU3RyaW5nKCk7XG4gICAgJGRlZmluZVByb3BlcnR5KHRoaXMsIHN5bWJvbERhdGFQcm9wZXJ0eSwge3ZhbHVlOiB0aGlzfSk7XG4gICAgJGRlZmluZVByb3BlcnR5KHRoaXMsIHN5bWJvbEludGVybmFsUHJvcGVydHksIHt2YWx1ZToga2V5fSk7XG4gICAgJGRlZmluZVByb3BlcnR5KHRoaXMsIHN5bWJvbERlc2NyaXB0aW9uUHJvcGVydHksIHt2YWx1ZTogZGVzY3JpcHRpb259KTtcbiAgICAkZnJlZXplKHRoaXMpO1xuICAgIHN5bWJvbFZhbHVlc1trZXldID0gdGhpcztcbiAgfVxuICAkZGVmaW5lUHJvcGVydHkoU3ltYm9sVmFsdWUucHJvdG90eXBlLCAnY29uc3RydWN0b3InLCBub25FbnVtKFN5bWJvbCkpO1xuICAkZGVmaW5lUHJvcGVydHkoU3ltYm9sVmFsdWUucHJvdG90eXBlLCAndG9TdHJpbmcnLCB7XG4gICAgdmFsdWU6IFN5bWJvbC5wcm90b3R5cGUudG9TdHJpbmcsXG4gICAgZW51bWVyYWJsZTogZmFsc2VcbiAgfSk7XG4gICRkZWZpbmVQcm9wZXJ0eShTeW1ib2xWYWx1ZS5wcm90b3R5cGUsICd2YWx1ZU9mJywge1xuICAgIHZhbHVlOiBTeW1ib2wucHJvdG90eXBlLnZhbHVlT2YsXG4gICAgZW51bWVyYWJsZTogZmFsc2VcbiAgfSk7XG4gICRmcmVlemUoU3ltYm9sVmFsdWUucHJvdG90eXBlKTtcbiAgU3ltYm9sLml0ZXJhdG9yID0gU3ltYm9sKCk7XG4gIGZ1bmN0aW9uIHRvUHJvcGVydHkobmFtZSkge1xuICAgIGlmIChpc1N5bWJvbChuYW1lKSlcbiAgICAgIHJldHVybiBuYW1lW3N5bWJvbEludGVybmFsUHJvcGVydHldO1xuICAgIHJldHVybiBuYW1lO1xuICB9XG4gIGZ1bmN0aW9uIGdldE93blByb3BlcnR5TmFtZXMob2JqZWN0KSB7XG4gICAgdmFyIHJ2ID0gW107XG4gICAgdmFyIG5hbWVzID0gJGdldE93blByb3BlcnR5TmFtZXMob2JqZWN0KTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5hbWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgbmFtZSA9IG5hbWVzW2ldO1xuICAgICAgaWYgKCFzeW1ib2xWYWx1ZXNbbmFtZV0pXG4gICAgICAgIHJ2LnB1c2gobmFtZSk7XG4gICAgfVxuICAgIHJldHVybiBydjtcbiAgfVxuICBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqZWN0LCBuYW1lKSB7XG4gICAgcmV0dXJuICRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqZWN0LCB0b1Byb3BlcnR5KG5hbWUpKTtcbiAgfVxuICBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMob2JqZWN0KSB7XG4gICAgdmFyIHJ2ID0gW107XG4gICAgdmFyIG5hbWVzID0gJGdldE93blByb3BlcnR5TmFtZXMob2JqZWN0KTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5hbWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgc3ltYm9sID0gc3ltYm9sVmFsdWVzW25hbWVzW2ldXTtcbiAgICAgIGlmIChzeW1ib2wpXG4gICAgICAgIHJ2LnB1c2goc3ltYm9sKTtcbiAgICB9XG4gICAgcmV0dXJuIHJ2O1xuICB9XG4gIGZ1bmN0aW9uIGhhc093blByb3BlcnR5KG5hbWUpIHtcbiAgICByZXR1cm4gJGhhc093blByb3BlcnR5LmNhbGwodGhpcywgdG9Qcm9wZXJ0eShuYW1lKSk7XG4gIH1cbiAgZnVuY3Rpb24gZ2V0T3B0aW9uKG5hbWUpIHtcbiAgICByZXR1cm4gZ2xvYmFsLnRyYWNldXIgJiYgZ2xvYmFsLnRyYWNldXIub3B0aW9uc1tuYW1lXTtcbiAgfVxuICBmdW5jdGlvbiBzZXRQcm9wZXJ0eShvYmplY3QsIG5hbWUsIHZhbHVlKSB7XG4gICAgdmFyIHN5bSxcbiAgICAgICAgZGVzYztcbiAgICBpZiAoaXNTeW1ib2wobmFtZSkpIHtcbiAgICAgIHN5bSA9IG5hbWU7XG4gICAgICBuYW1lID0gbmFtZVtzeW1ib2xJbnRlcm5hbFByb3BlcnR5XTtcbiAgICB9XG4gICAgb2JqZWN0W25hbWVdID0gdmFsdWU7XG4gICAgaWYgKHN5bSAmJiAoZGVzYyA9ICRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqZWN0LCBuYW1lKSkpXG4gICAgICAkZGVmaW5lUHJvcGVydHkob2JqZWN0LCBuYW1lLCB7ZW51bWVyYWJsZTogZmFsc2V9KTtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgZnVuY3Rpb24gZGVmaW5lUHJvcGVydHkob2JqZWN0LCBuYW1lLCBkZXNjcmlwdG9yKSB7XG4gICAgaWYgKGlzU3ltYm9sKG5hbWUpKSB7XG4gICAgICBpZiAoZGVzY3JpcHRvci5lbnVtZXJhYmxlKSB7XG4gICAgICAgIGRlc2NyaXB0b3IgPSAkY3JlYXRlKGRlc2NyaXB0b3IsIHtlbnVtZXJhYmxlOiB7dmFsdWU6IGZhbHNlfX0pO1xuICAgICAgfVxuICAgICAgbmFtZSA9IG5hbWVbc3ltYm9sSW50ZXJuYWxQcm9wZXJ0eV07XG4gICAgfVxuICAgICRkZWZpbmVQcm9wZXJ0eShvYmplY3QsIG5hbWUsIGRlc2NyaXB0b3IpO1xuICAgIHJldHVybiBvYmplY3Q7XG4gIH1cbiAgZnVuY3Rpb24gcG9seWZpbGxPYmplY3QoT2JqZWN0KSB7XG4gICAgJGRlZmluZVByb3BlcnR5KE9iamVjdCwgJ2RlZmluZVByb3BlcnR5Jywge3ZhbHVlOiBkZWZpbmVQcm9wZXJ0eX0pO1xuICAgICRkZWZpbmVQcm9wZXJ0eShPYmplY3QsICdnZXRPd25Qcm9wZXJ0eU5hbWVzJywge3ZhbHVlOiBnZXRPd25Qcm9wZXJ0eU5hbWVzfSk7XG4gICAgJGRlZmluZVByb3BlcnR5KE9iamVjdCwgJ2dldE93blByb3BlcnR5RGVzY3JpcHRvcicsIHt2YWx1ZTogZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yfSk7XG4gICAgJGRlZmluZVByb3BlcnR5KE9iamVjdC5wcm90b3R5cGUsICdoYXNPd25Qcm9wZXJ0eScsIHt2YWx1ZTogaGFzT3duUHJvcGVydHl9KTtcbiAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzID0gZ2V0T3duUHJvcGVydHlTeW1ib2xzO1xuICAgIGZ1bmN0aW9uIGlzKGxlZnQsIHJpZ2h0KSB7XG4gICAgICBpZiAobGVmdCA9PT0gcmlnaHQpXG4gICAgICAgIHJldHVybiBsZWZ0ICE9PSAwIHx8IDEgLyBsZWZ0ID09PSAxIC8gcmlnaHQ7XG4gICAgICByZXR1cm4gbGVmdCAhPT0gbGVmdCAmJiByaWdodCAhPT0gcmlnaHQ7XG4gICAgfVxuICAgICRkZWZpbmVQcm9wZXJ0eShPYmplY3QsICdpcycsIG1ldGhvZChpcykpO1xuICAgIGZ1bmN0aW9uIGFzc2lnbih0YXJnZXQsIHNvdXJjZSkge1xuICAgICAgdmFyIHByb3BzID0gJGdldE93blByb3BlcnR5TmFtZXMoc291cmNlKTtcbiAgICAgIHZhciBwLFxuICAgICAgICAgIGxlbmd0aCA9IHByb3BzLmxlbmd0aDtcbiAgICAgIGZvciAocCA9IDA7IHAgPCBsZW5ndGg7IHArKykge1xuICAgICAgICB0YXJnZXRbcHJvcHNbcF1dID0gc291cmNlW3Byb3BzW3BdXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgfVxuICAgICRkZWZpbmVQcm9wZXJ0eShPYmplY3QsICdhc3NpZ24nLCBtZXRob2QoYXNzaWduKSk7XG4gICAgZnVuY3Rpb24gbWl4aW4odGFyZ2V0LCBzb3VyY2UpIHtcbiAgICAgIHZhciBwcm9wcyA9ICRnZXRPd25Qcm9wZXJ0eU5hbWVzKHNvdXJjZSk7XG4gICAgICB2YXIgcCxcbiAgICAgICAgICBkZXNjcmlwdG9yLFxuICAgICAgICAgIGxlbmd0aCA9IHByb3BzLmxlbmd0aDtcbiAgICAgIGZvciAocCA9IDA7IHAgPCBsZW5ndGg7IHArKykge1xuICAgICAgICBkZXNjcmlwdG9yID0gJGdldE93blByb3BlcnR5RGVzY3JpcHRvcihzb3VyY2UsIHByb3BzW3BdKTtcbiAgICAgICAgJGRlZmluZVByb3BlcnR5KHRhcmdldCwgcHJvcHNbcF0sIGRlc2NyaXB0b3IpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICB9XG4gICAgJGRlZmluZVByb3BlcnR5KE9iamVjdCwgJ21peGluJywgbWV0aG9kKG1peGluKSk7XG4gIH1cbiAgZnVuY3Rpb24gZXhwb3J0U3RhcihvYmplY3QpIHtcbiAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIG5hbWVzID0gJGdldE93blByb3BlcnR5TmFtZXMoYXJndW1lbnRzW2ldKTtcbiAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgbmFtZXMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgKGZ1bmN0aW9uKG1vZCwgbmFtZSkge1xuICAgICAgICAgICRkZWZpbmVQcm9wZXJ0eShvYmplY3QsIG5hbWUsIHtcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHJldHVybiBtb2RbbmFtZV07XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgICAgIH0pO1xuICAgICAgICB9KShhcmd1bWVudHNbaV0sIG5hbWVzW2pdKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG9iamVjdDtcbiAgfVxuICBmdW5jdGlvbiB0b09iamVjdCh2YWx1ZSkge1xuICAgIGlmICh2YWx1ZSA9PSBudWxsKVxuICAgICAgdGhyb3cgJFR5cGVFcnJvcigpO1xuICAgIHJldHVybiAkT2JqZWN0KHZhbHVlKTtcbiAgfVxuICBmdW5jdGlvbiBzcHJlYWQoKSB7XG4gICAgdmFyIHJ2ID0gW10sXG4gICAgICAgIGsgPSAwO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgdmFsdWVUb1NwcmVhZCA9IHRvT2JqZWN0KGFyZ3VtZW50c1tpXSk7XG4gICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHZhbHVlVG9TcHJlYWQubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgcnZbaysrXSA9IHZhbHVlVG9TcHJlYWRbal07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBydjtcbiAgfVxuICBmdW5jdGlvbiBnZXRQcm9wZXJ0eURlc2NyaXB0b3Iob2JqZWN0LCBuYW1lKSB7XG4gICAgd2hpbGUgKG9iamVjdCAhPT0gbnVsbCkge1xuICAgICAgdmFyIHJlc3VsdCA9ICRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqZWN0LCBuYW1lKTtcbiAgICAgIGlmIChyZXN1bHQpXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICBvYmplY3QgPSAkZ2V0UHJvdG90eXBlT2Yob2JqZWN0KTtcbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuICBmdW5jdGlvbiBzdXBlckRlc2NyaXB0b3IoaG9tZU9iamVjdCwgbmFtZSkge1xuICAgIHZhciBwcm90byA9ICRnZXRQcm90b3R5cGVPZihob21lT2JqZWN0KTtcbiAgICBpZiAoIXByb3RvKVxuICAgICAgdGhyb3cgJFR5cGVFcnJvcignc3VwZXIgaXMgbnVsbCcpO1xuICAgIHJldHVybiBnZXRQcm9wZXJ0eURlc2NyaXB0b3IocHJvdG8sIG5hbWUpO1xuICB9XG4gIGZ1bmN0aW9uIHN1cGVyQ2FsbChzZWxmLCBob21lT2JqZWN0LCBuYW1lLCBhcmdzKSB7XG4gICAgdmFyIGRlc2NyaXB0b3IgPSBzdXBlckRlc2NyaXB0b3IoaG9tZU9iamVjdCwgbmFtZSk7XG4gICAgaWYgKGRlc2NyaXB0b3IpIHtcbiAgICAgIGlmICgndmFsdWUnIGluIGRlc2NyaXB0b3IpXG4gICAgICAgIHJldHVybiBkZXNjcmlwdG9yLnZhbHVlLmFwcGx5KHNlbGYsIGFyZ3MpO1xuICAgICAgaWYgKGRlc2NyaXB0b3IuZ2V0KVxuICAgICAgICByZXR1cm4gZGVzY3JpcHRvci5nZXQuY2FsbChzZWxmKS5hcHBseShzZWxmLCBhcmdzKTtcbiAgICB9XG4gICAgdGhyb3cgJFR5cGVFcnJvcihcInN1cGVyIGhhcyBubyBtZXRob2QgJ1wiICsgbmFtZSArIFwiJy5cIik7XG4gIH1cbiAgZnVuY3Rpb24gc3VwZXJHZXQoc2VsZiwgaG9tZU9iamVjdCwgbmFtZSkge1xuICAgIHZhciBkZXNjcmlwdG9yID0gc3VwZXJEZXNjcmlwdG9yKGhvbWVPYmplY3QsIG5hbWUpO1xuICAgIGlmIChkZXNjcmlwdG9yKSB7XG4gICAgICBpZiAoZGVzY3JpcHRvci5nZXQpXG4gICAgICAgIHJldHVybiBkZXNjcmlwdG9yLmdldC5jYWxsKHNlbGYpO1xuICAgICAgZWxzZSBpZiAoJ3ZhbHVlJyBpbiBkZXNjcmlwdG9yKVxuICAgICAgICByZXR1cm4gZGVzY3JpcHRvci52YWx1ZTtcbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuICBmdW5jdGlvbiBzdXBlclNldChzZWxmLCBob21lT2JqZWN0LCBuYW1lLCB2YWx1ZSkge1xuICAgIHZhciBkZXNjcmlwdG9yID0gc3VwZXJEZXNjcmlwdG9yKGhvbWVPYmplY3QsIG5hbWUpO1xuICAgIGlmIChkZXNjcmlwdG9yICYmIGRlc2NyaXB0b3Iuc2V0KSB7XG4gICAgICBkZXNjcmlwdG9yLnNldC5jYWxsKHNlbGYsIHZhbHVlKTtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG4gICAgdGhyb3cgJFR5cGVFcnJvcihcInN1cGVyIGhhcyBubyBzZXR0ZXIgJ1wiICsgbmFtZSArIFwiJy5cIik7XG4gIH1cbiAgZnVuY3Rpb24gZ2V0RGVzY3JpcHRvcnMob2JqZWN0KSB7XG4gICAgdmFyIGRlc2NyaXB0b3JzID0ge30sXG4gICAgICAgIG5hbWUsXG4gICAgICAgIG5hbWVzID0gJGdldE93blByb3BlcnR5TmFtZXMob2JqZWN0KTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5hbWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgbmFtZSA9IG5hbWVzW2ldO1xuICAgICAgZGVzY3JpcHRvcnNbbmFtZV0gPSAkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iamVjdCwgbmFtZSk7XG4gICAgfVxuICAgIHJldHVybiBkZXNjcmlwdG9ycztcbiAgfVxuICBmdW5jdGlvbiBjcmVhdGVDbGFzcyhjdG9yLCBvYmplY3QsIHN0YXRpY09iamVjdCwgc3VwZXJDbGFzcykge1xuICAgICRkZWZpbmVQcm9wZXJ0eShvYmplY3QsICdjb25zdHJ1Y3RvcicsIHtcbiAgICAgIHZhbHVlOiBjdG9yLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICB3cml0YWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMykge1xuICAgICAgaWYgKHR5cGVvZiBzdXBlckNsYXNzID09PSAnZnVuY3Rpb24nKVxuICAgICAgICBjdG9yLl9fcHJvdG9fXyA9IHN1cGVyQ2xhc3M7XG4gICAgICBjdG9yLnByb3RvdHlwZSA9ICRjcmVhdGUoZ2V0UHJvdG9QYXJlbnQoc3VwZXJDbGFzcyksIGdldERlc2NyaXB0b3JzKG9iamVjdCkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjdG9yLnByb3RvdHlwZSA9IG9iamVjdDtcbiAgICB9XG4gICAgJGRlZmluZVByb3BlcnR5KGN0b3IsICdwcm90b3R5cGUnLCB7XG4gICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgd3JpdGFibGU6IGZhbHNlXG4gICAgfSk7XG4gICAgcmV0dXJuICRkZWZpbmVQcm9wZXJ0aWVzKGN0b3IsIGdldERlc2NyaXB0b3JzKHN0YXRpY09iamVjdCkpO1xuICB9XG4gIGZ1bmN0aW9uIGdldFByb3RvUGFyZW50KHN1cGVyQ2xhc3MpIHtcbiAgICBpZiAodHlwZW9mIHN1cGVyQ2xhc3MgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHZhciBwcm90b3R5cGUgPSBzdXBlckNsYXNzLnByb3RvdHlwZTtcbiAgICAgIGlmICgkT2JqZWN0KHByb3RvdHlwZSkgPT09IHByb3RvdHlwZSB8fCBwcm90b3R5cGUgPT09IG51bGwpXG4gICAgICAgIHJldHVybiBzdXBlckNsYXNzLnByb3RvdHlwZTtcbiAgICB9XG4gICAgaWYgKHN1cGVyQ2xhc3MgPT09IG51bGwpXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCk7XG4gIH1cbiAgZnVuY3Rpb24gZGVmYXVsdFN1cGVyQ2FsbChzZWxmLCBob21lT2JqZWN0LCBhcmdzKSB7XG4gICAgaWYgKCRnZXRQcm90b3R5cGVPZihob21lT2JqZWN0KSAhPT0gbnVsbClcbiAgICAgIHN1cGVyQ2FsbChzZWxmLCBob21lT2JqZWN0LCAnY29uc3RydWN0b3InLCBhcmdzKTtcbiAgfVxuICB2YXIgU1RfTkVXQk9STiA9IDA7XG4gIHZhciBTVF9FWEVDVVRJTkcgPSAxO1xuICB2YXIgU1RfU1VTUEVOREVEID0gMjtcbiAgdmFyIFNUX0NMT1NFRCA9IDM7XG4gIHZhciBFTkRfU1RBVEUgPSAtMjtcbiAgdmFyIFJFVEhST1dfU1RBVEUgPSAtMztcbiAgZnVuY3Rpb24gYWRkSXRlcmF0b3Iob2JqZWN0KSB7XG4gICAgcmV0dXJuIGRlZmluZVByb3BlcnR5KG9iamVjdCwgU3ltYm9sLml0ZXJhdG9yLCBub25FbnVtKGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSkpO1xuICB9XG4gIGZ1bmN0aW9uIGdldEludGVybmFsRXJyb3Ioc3RhdGUpIHtcbiAgICByZXR1cm4gbmV3IEVycm9yKCdUcmFjZXVyIGNvbXBpbGVyIGJ1ZzogaW52YWxpZCBzdGF0ZSBpbiBzdGF0ZSBtYWNoaW5lOiAnICsgc3RhdGUpO1xuICB9XG4gIGZ1bmN0aW9uIEdlbmVyYXRvckNvbnRleHQoKSB7XG4gICAgdGhpcy5zdGF0ZSA9IDA7XG4gICAgdGhpcy5HU3RhdGUgPSBTVF9ORVdCT1JOO1xuICAgIHRoaXMuc3RvcmVkRXhjZXB0aW9uID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuZmluYWxseUZhbGxUaHJvdWdoID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuc2VudF8gPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5yZXR1cm5WYWx1ZSA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLnRyeVN0YWNrXyA9IFtdO1xuICB9XG4gIEdlbmVyYXRvckNvbnRleHQucHJvdG90eXBlID0ge1xuICAgIHB1c2hUcnk6IGZ1bmN0aW9uKGNhdGNoU3RhdGUsIGZpbmFsbHlTdGF0ZSkge1xuICAgICAgaWYgKGZpbmFsbHlTdGF0ZSAhPT0gbnVsbCkge1xuICAgICAgICB2YXIgZmluYWxseUZhbGxUaHJvdWdoID0gbnVsbDtcbiAgICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5U3RhY2tfLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgaWYgKHRoaXMudHJ5U3RhY2tfW2ldLmNhdGNoICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGZpbmFsbHlGYWxsVGhyb3VnaCA9IHRoaXMudHJ5U3RhY2tfW2ldLmNhdGNoO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChmaW5hbGx5RmFsbFRocm91Z2ggPT09IG51bGwpXG4gICAgICAgICAgZmluYWxseUZhbGxUaHJvdWdoID0gUkVUSFJPV19TVEFURTtcbiAgICAgICAgdGhpcy50cnlTdGFja18ucHVzaCh7XG4gICAgICAgICAgZmluYWxseTogZmluYWxseVN0YXRlLFxuICAgICAgICAgIGZpbmFsbHlGYWxsVGhyb3VnaDogZmluYWxseUZhbGxUaHJvdWdoXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgaWYgKGNhdGNoU3RhdGUgIT09IG51bGwpIHtcbiAgICAgICAgdGhpcy50cnlTdGFja18ucHVzaCh7Y2F0Y2g6IGNhdGNoU3RhdGV9KTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHBvcFRyeTogZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLnRyeVN0YWNrXy5wb3AoKTtcbiAgICB9LFxuICAgIGdldCBzZW50KCkge1xuICAgICAgdGhpcy5tYXliZVRocm93KCk7XG4gICAgICByZXR1cm4gdGhpcy5zZW50XztcbiAgICB9LFxuICAgIHNldCBzZW50KHYpIHtcbiAgICAgIHRoaXMuc2VudF8gPSB2O1xuICAgIH0sXG4gICAgZ2V0IHNlbnRJZ25vcmVUaHJvdygpIHtcbiAgICAgIHJldHVybiB0aGlzLnNlbnRfO1xuICAgIH0sXG4gICAgbWF5YmVUaHJvdzogZnVuY3Rpb24oKSB7XG4gICAgICBpZiAodGhpcy5hY3Rpb24gPT09ICd0aHJvdycpIHtcbiAgICAgICAgdGhpcy5hY3Rpb24gPSAnbmV4dCc7XG4gICAgICAgIHRocm93IHRoaXMuc2VudF87XG4gICAgICB9XG4gICAgfSxcbiAgICBlbmQ6IGZ1bmN0aW9uKCkge1xuICAgICAgc3dpdGNoICh0aGlzLnN0YXRlKSB7XG4gICAgICAgIGNhc2UgRU5EX1NUQVRFOlxuICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICBjYXNlIFJFVEhST1dfU1RBVEU6XG4gICAgICAgICAgdGhyb3cgdGhpcy5zdG9yZWRFeGNlcHRpb247XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgdGhyb3cgZ2V0SW50ZXJuYWxFcnJvcih0aGlzLnN0YXRlKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG4gIGZ1bmN0aW9uIGdldE5leHRPclRocm93KGN0eCwgbW92ZU5leHQsIGFjdGlvbikge1xuICAgIHJldHVybiBmdW5jdGlvbih4KSB7XG4gICAgICBzd2l0Y2ggKGN0eC5HU3RhdGUpIHtcbiAgICAgICAgY2FzZSBTVF9FWEVDVVRJTkc6XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKChcIlxcXCJcIiArIGFjdGlvbiArIFwiXFxcIiBvbiBleGVjdXRpbmcgZ2VuZXJhdG9yXCIpKTtcbiAgICAgICAgY2FzZSBTVF9DTE9TRUQ6XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKChcIlxcXCJcIiArIGFjdGlvbiArIFwiXFxcIiBvbiBjbG9zZWQgZ2VuZXJhdG9yXCIpKTtcbiAgICAgICAgY2FzZSBTVF9ORVdCT1JOOlxuICAgICAgICAgIGlmIChhY3Rpb24gPT09ICd0aHJvdycpIHtcbiAgICAgICAgICAgIGN0eC5HU3RhdGUgPSBTVF9DTE9TRUQ7XG4gICAgICAgICAgICB0aHJvdyB4O1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoeCAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgdGhyb3cgJFR5cGVFcnJvcignU2VudCB2YWx1ZSB0byBuZXdib3JuIGdlbmVyYXRvcicpO1xuICAgICAgICBjYXNlIFNUX1NVU1BFTkRFRDpcbiAgICAgICAgICBjdHguR1N0YXRlID0gU1RfRVhFQ1VUSU5HO1xuICAgICAgICAgIGN0eC5hY3Rpb24gPSBhY3Rpb247XG4gICAgICAgICAgY3R4LnNlbnQgPSB4O1xuICAgICAgICAgIHZhciB2YWx1ZSA9IG1vdmVOZXh0KGN0eCk7XG4gICAgICAgICAgdmFyIGRvbmUgPSB2YWx1ZSA9PT0gY3R4O1xuICAgICAgICAgIGlmIChkb25lKVxuICAgICAgICAgICAgdmFsdWUgPSBjdHgucmV0dXJuVmFsdWU7XG4gICAgICAgICAgY3R4LkdTdGF0ZSA9IGRvbmUgPyBTVF9DTE9TRUQgOiBTVF9TVVNQRU5ERUQ7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICAgIGRvbmU6IGRvbmVcbiAgICAgICAgICB9O1xuICAgICAgfVxuICAgIH07XG4gIH1cbiAgZnVuY3Rpb24gZ2VuZXJhdG9yV3JhcChpbm5lckZ1bmN0aW9uLCBzZWxmKSB7XG4gICAgdmFyIG1vdmVOZXh0ID0gZ2V0TW92ZU5leHQoaW5uZXJGdW5jdGlvbiwgc2VsZik7XG4gICAgdmFyIGN0eCA9IG5ldyBHZW5lcmF0b3JDb250ZXh0KCk7XG4gICAgcmV0dXJuIGFkZEl0ZXJhdG9yKHtcbiAgICAgIG5leHQ6IGdldE5leHRPclRocm93KGN0eCwgbW92ZU5leHQsICduZXh0JyksXG4gICAgICB0aHJvdzogZ2V0TmV4dE9yVGhyb3coY3R4LCBtb3ZlTmV4dCwgJ3Rocm93JylcbiAgICB9KTtcbiAgfVxuICBmdW5jdGlvbiBBc3luY0Z1bmN0aW9uQ29udGV4dCgpIHtcbiAgICBHZW5lcmF0b3JDb250ZXh0LmNhbGwodGhpcyk7XG4gICAgdGhpcy5lcnIgPSB1bmRlZmluZWQ7XG4gICAgdmFyIGN0eCA9IHRoaXM7XG4gICAgY3R4LnJlc3VsdCA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgY3R4LnJlc29sdmUgPSByZXNvbHZlO1xuICAgICAgY3R4LnJlamVjdCA9IHJlamVjdDtcbiAgICB9KTtcbiAgfVxuICBBc3luY0Z1bmN0aW9uQ29udGV4dC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEdlbmVyYXRvckNvbnRleHQucHJvdG90eXBlKTtcbiAgQXN5bmNGdW5jdGlvbkNvbnRleHQucHJvdG90eXBlLmVuZCA9IGZ1bmN0aW9uKCkge1xuICAgIHN3aXRjaCAodGhpcy5zdGF0ZSkge1xuICAgICAgY2FzZSBFTkRfU1RBVEU6XG4gICAgICAgIHJldHVybjtcbiAgICAgIGNhc2UgUkVUSFJPV19TVEFURTpcbiAgICAgICAgdGhpcy5yZWplY3QodGhpcy5zdG9yZWRFeGNlcHRpb24pO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhpcy5yZWplY3QoZ2V0SW50ZXJuYWxFcnJvcih0aGlzLnN0YXRlKSk7XG4gICAgfVxuICB9O1xuICBmdW5jdGlvbiBhc3luY1dyYXAoaW5uZXJGdW5jdGlvbiwgc2VsZikge1xuICAgIHZhciBtb3ZlTmV4dCA9IGdldE1vdmVOZXh0KGlubmVyRnVuY3Rpb24sIHNlbGYpO1xuICAgIHZhciBjdHggPSBuZXcgQXN5bmNGdW5jdGlvbkNvbnRleHQoKTtcbiAgICBjdHguY3JlYXRlQ2FsbGJhY2sgPSBmdW5jdGlvbihuZXdTdGF0ZSkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIGN0eC5zdGF0ZSA9IG5ld1N0YXRlO1xuICAgICAgICBjdHgudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgbW92ZU5leHQoY3R4KTtcbiAgICAgIH07XG4gICAgfTtcbiAgICBjdHguY3JlYXRlRXJyYmFjayA9IGZ1bmN0aW9uKG5ld1N0YXRlKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgIGN0eC5zdGF0ZSA9IG5ld1N0YXRlO1xuICAgICAgICBjdHguZXJyID0gZXJyO1xuICAgICAgICBtb3ZlTmV4dChjdHgpO1xuICAgICAgfTtcbiAgICB9O1xuICAgIG1vdmVOZXh0KGN0eCk7XG4gICAgcmV0dXJuIGN0eC5yZXN1bHQ7XG4gIH1cbiAgZnVuY3Rpb24gZ2V0TW92ZU5leHQoaW5uZXJGdW5jdGlvbiwgc2VsZikge1xuICAgIHJldHVybiBmdW5jdGlvbihjdHgpIHtcbiAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcmV0dXJuIGlubmVyRnVuY3Rpb24uY2FsbChzZWxmLCBjdHgpO1xuICAgICAgICB9IGNhdGNoIChleCkge1xuICAgICAgICAgIGN0eC5zdG9yZWRFeGNlcHRpb24gPSBleDtcbiAgICAgICAgICB2YXIgbGFzdCA9IGN0eC50cnlTdGFja19bY3R4LnRyeVN0YWNrXy5sZW5ndGggLSAxXTtcbiAgICAgICAgICBpZiAoIWxhc3QpIHtcbiAgICAgICAgICAgIGN0eC5HU3RhdGUgPSBTVF9DTE9TRUQ7XG4gICAgICAgICAgICBjdHguc3RhdGUgPSBFTkRfU1RBVEU7XG4gICAgICAgICAgICB0aHJvdyBleDtcbiAgICAgICAgICB9XG4gICAgICAgICAgY3R4LnN0YXRlID0gbGFzdC5jYXRjaCAhPT0gdW5kZWZpbmVkID8gbGFzdC5jYXRjaCA6IGxhc3QuZmluYWxseTtcbiAgICAgICAgICBpZiAobGFzdC5maW5hbGx5RmFsbFRocm91Z2ggIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIGN0eC5maW5hbGx5RmFsbFRocm91Z2ggPSBsYXN0LmZpbmFsbHlGYWxsVGhyb3VnaDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gIH1cbiAgZnVuY3Rpb24gc2V0dXBHbG9iYWxzKGdsb2JhbCkge1xuICAgIGdsb2JhbC5TeW1ib2wgPSBTeW1ib2w7XG4gICAgcG9seWZpbGxPYmplY3QoZ2xvYmFsLk9iamVjdCk7XG4gIH1cbiAgc2V0dXBHbG9iYWxzKGdsb2JhbCk7XG4gIGdsb2JhbC4kdHJhY2V1clJ1bnRpbWUgPSB7XG4gICAgYXN5bmNXcmFwOiBhc3luY1dyYXAsXG4gICAgY3JlYXRlQ2xhc3M6IGNyZWF0ZUNsYXNzLFxuICAgIGRlZmF1bHRTdXBlckNhbGw6IGRlZmF1bHRTdXBlckNhbGwsXG4gICAgZXhwb3J0U3RhcjogZXhwb3J0U3RhcixcbiAgICBnZW5lcmF0b3JXcmFwOiBnZW5lcmF0b3JXcmFwLFxuICAgIHNldFByb3BlcnR5OiBzZXRQcm9wZXJ0eSxcbiAgICBzZXR1cEdsb2JhbHM6IHNldHVwR2xvYmFscyxcbiAgICBzcHJlYWQ6IHNwcmVhZCxcbiAgICBzdXBlckNhbGw6IHN1cGVyQ2FsbCxcbiAgICBzdXBlckdldDogc3VwZXJHZXQsXG4gICAgc3VwZXJTZXQ6IHN1cGVyU2V0LFxuICAgIHRvT2JqZWN0OiB0b09iamVjdCxcbiAgICB0b1Byb3BlcnR5OiB0b1Byb3BlcnR5LFxuICAgIHR5cGU6IHR5cGVzLFxuICAgIHR5cGVvZjogdHlwZU9mXG4gIH07XG59KSh0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJyA/IGdsb2JhbCA6IHRoaXMpO1xuKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBidWlsZEZyb21FbmNvZGVkUGFydHMob3B0X3NjaGVtZSwgb3B0X3VzZXJJbmZvLCBvcHRfZG9tYWluLCBvcHRfcG9ydCwgb3B0X3BhdGgsIG9wdF9xdWVyeURhdGEsIG9wdF9mcmFnbWVudCkge1xuICAgIHZhciBvdXQgPSBbXTtcbiAgICBpZiAob3B0X3NjaGVtZSkge1xuICAgICAgb3V0LnB1c2gob3B0X3NjaGVtZSwgJzonKTtcbiAgICB9XG4gICAgaWYgKG9wdF9kb21haW4pIHtcbiAgICAgIG91dC5wdXNoKCcvLycpO1xuICAgICAgaWYgKG9wdF91c2VySW5mbykge1xuICAgICAgICBvdXQucHVzaChvcHRfdXNlckluZm8sICdAJyk7XG4gICAgICB9XG4gICAgICBvdXQucHVzaChvcHRfZG9tYWluKTtcbiAgICAgIGlmIChvcHRfcG9ydCkge1xuICAgICAgICBvdXQucHVzaCgnOicsIG9wdF9wb3J0KTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKG9wdF9wYXRoKSB7XG4gICAgICBvdXQucHVzaChvcHRfcGF0aCk7XG4gICAgfVxuICAgIGlmIChvcHRfcXVlcnlEYXRhKSB7XG4gICAgICBvdXQucHVzaCgnPycsIG9wdF9xdWVyeURhdGEpO1xuICAgIH1cbiAgICBpZiAob3B0X2ZyYWdtZW50KSB7XG4gICAgICBvdXQucHVzaCgnIycsIG9wdF9mcmFnbWVudCk7XG4gICAgfVxuICAgIHJldHVybiBvdXQuam9pbignJyk7XG4gIH1cbiAgO1xuICB2YXIgc3BsaXRSZSA9IG5ldyBSZWdFeHAoJ14nICsgJyg/OicgKyAnKFteOi8/Iy5dKyknICsgJzopPycgKyAnKD86Ly8nICsgJyg/OihbXi8/I10qKUApPycgKyAnKFtcXFxcd1xcXFxkXFxcXC1cXFxcdTAxMDAtXFxcXHVmZmZmLiVdKiknICsgJyg/OjooWzAtOV0rKSk/JyArICcpPycgKyAnKFtePyNdKyk/JyArICcoPzpcXFxcPyhbXiNdKikpPycgKyAnKD86IyguKikpPycgKyAnJCcpO1xuICB2YXIgQ29tcG9uZW50SW5kZXggPSB7XG4gICAgU0NIRU1FOiAxLFxuICAgIFVTRVJfSU5GTzogMixcbiAgICBET01BSU46IDMsXG4gICAgUE9SVDogNCxcbiAgICBQQVRIOiA1LFxuICAgIFFVRVJZX0RBVEE6IDYsXG4gICAgRlJBR01FTlQ6IDdcbiAgfTtcbiAgZnVuY3Rpb24gc3BsaXQodXJpKSB7XG4gICAgcmV0dXJuICh1cmkubWF0Y2goc3BsaXRSZSkpO1xuICB9XG4gIGZ1bmN0aW9uIHJlbW92ZURvdFNlZ21lbnRzKHBhdGgpIHtcbiAgICBpZiAocGF0aCA9PT0gJy8nKVxuICAgICAgcmV0dXJuICcvJztcbiAgICB2YXIgbGVhZGluZ1NsYXNoID0gcGF0aFswXSA9PT0gJy8nID8gJy8nIDogJyc7XG4gICAgdmFyIHRyYWlsaW5nU2xhc2ggPSBwYXRoLnNsaWNlKC0xKSA9PT0gJy8nID8gJy8nIDogJyc7XG4gICAgdmFyIHNlZ21lbnRzID0gcGF0aC5zcGxpdCgnLycpO1xuICAgIHZhciBvdXQgPSBbXTtcbiAgICB2YXIgdXAgPSAwO1xuICAgIGZvciAodmFyIHBvcyA9IDA7IHBvcyA8IHNlZ21lbnRzLmxlbmd0aDsgcG9zKyspIHtcbiAgICAgIHZhciBzZWdtZW50ID0gc2VnbWVudHNbcG9zXTtcbiAgICAgIHN3aXRjaCAoc2VnbWVudCkge1xuICAgICAgICBjYXNlICcnOlxuICAgICAgICBjYXNlICcuJzpcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnLi4nOlxuICAgICAgICAgIGlmIChvdXQubGVuZ3RoKVxuICAgICAgICAgICAgb3V0LnBvcCgpO1xuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHVwKys7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgb3V0LnB1c2goc2VnbWVudCk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICghbGVhZGluZ1NsYXNoKSB7XG4gICAgICB3aGlsZSAodXAtLSA+IDApIHtcbiAgICAgICAgb3V0LnVuc2hpZnQoJy4uJyk7XG4gICAgICB9XG4gICAgICBpZiAob3V0Lmxlbmd0aCA9PT0gMClcbiAgICAgICAgb3V0LnB1c2goJy4nKTtcbiAgICB9XG4gICAgcmV0dXJuIGxlYWRpbmdTbGFzaCArIG91dC5qb2luKCcvJykgKyB0cmFpbGluZ1NsYXNoO1xuICB9XG4gIGZ1bmN0aW9uIGpvaW5BbmRDYW5vbmljYWxpemVQYXRoKHBhcnRzKSB7XG4gICAgdmFyIHBhdGggPSBwYXJ0c1tDb21wb25lbnRJbmRleC5QQVRIXSB8fCAnJztcbiAgICBwYXRoID0gcmVtb3ZlRG90U2VnbWVudHMocGF0aCk7XG4gICAgcGFydHNbQ29tcG9uZW50SW5kZXguUEFUSF0gPSBwYXRoO1xuICAgIHJldHVybiBidWlsZEZyb21FbmNvZGVkUGFydHMocGFydHNbQ29tcG9uZW50SW5kZXguU0NIRU1FXSwgcGFydHNbQ29tcG9uZW50SW5kZXguVVNFUl9JTkZPXSwgcGFydHNbQ29tcG9uZW50SW5kZXguRE9NQUlOXSwgcGFydHNbQ29tcG9uZW50SW5kZXguUE9SVF0sIHBhcnRzW0NvbXBvbmVudEluZGV4LlBBVEhdLCBwYXJ0c1tDb21wb25lbnRJbmRleC5RVUVSWV9EQVRBXSwgcGFydHNbQ29tcG9uZW50SW5kZXguRlJBR01FTlRdKTtcbiAgfVxuICBmdW5jdGlvbiBjYW5vbmljYWxpemVVcmwodXJsKSB7XG4gICAgdmFyIHBhcnRzID0gc3BsaXQodXJsKTtcbiAgICByZXR1cm4gam9pbkFuZENhbm9uaWNhbGl6ZVBhdGgocGFydHMpO1xuICB9XG4gIGZ1bmN0aW9uIHJlc29sdmVVcmwoYmFzZSwgdXJsKSB7XG4gICAgdmFyIHBhcnRzID0gc3BsaXQodXJsKTtcbiAgICB2YXIgYmFzZVBhcnRzID0gc3BsaXQoYmFzZSk7XG4gICAgaWYgKHBhcnRzW0NvbXBvbmVudEluZGV4LlNDSEVNRV0pIHtcbiAgICAgIHJldHVybiBqb2luQW5kQ2Fub25pY2FsaXplUGF0aChwYXJ0cyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBhcnRzW0NvbXBvbmVudEluZGV4LlNDSEVNRV0gPSBiYXNlUGFydHNbQ29tcG9uZW50SW5kZXguU0NIRU1FXTtcbiAgICB9XG4gICAgZm9yICh2YXIgaSA9IENvbXBvbmVudEluZGV4LlNDSEVNRTsgaSA8PSBDb21wb25lbnRJbmRleC5QT1JUOyBpKyspIHtcbiAgICAgIGlmICghcGFydHNbaV0pIHtcbiAgICAgICAgcGFydHNbaV0gPSBiYXNlUGFydHNbaV07XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChwYXJ0c1tDb21wb25lbnRJbmRleC5QQVRIXVswXSA9PSAnLycpIHtcbiAgICAgIHJldHVybiBqb2luQW5kQ2Fub25pY2FsaXplUGF0aChwYXJ0cyk7XG4gICAgfVxuICAgIHZhciBwYXRoID0gYmFzZVBhcnRzW0NvbXBvbmVudEluZGV4LlBBVEhdO1xuICAgIHZhciBpbmRleCA9IHBhdGgubGFzdEluZGV4T2YoJy8nKTtcbiAgICBwYXRoID0gcGF0aC5zbGljZSgwLCBpbmRleCArIDEpICsgcGFydHNbQ29tcG9uZW50SW5kZXguUEFUSF07XG4gICAgcGFydHNbQ29tcG9uZW50SW5kZXguUEFUSF0gPSBwYXRoO1xuICAgIHJldHVybiBqb2luQW5kQ2Fub25pY2FsaXplUGF0aChwYXJ0cyk7XG4gIH1cbiAgZnVuY3Rpb24gaXNBYnNvbHV0ZShuYW1lKSB7XG4gICAgaWYgKCFuYW1lKVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIGlmIChuYW1lWzBdID09PSAnLycpXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB2YXIgcGFydHMgPSBzcGxpdChuYW1lKTtcbiAgICBpZiAocGFydHNbQ29tcG9uZW50SW5kZXguU0NIRU1FXSlcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICAkdHJhY2V1clJ1bnRpbWUuY2Fub25pY2FsaXplVXJsID0gY2Fub25pY2FsaXplVXJsO1xuICAkdHJhY2V1clJ1bnRpbWUuaXNBYnNvbHV0ZSA9IGlzQWJzb2x1dGU7XG4gICR0cmFjZXVyUnVudGltZS5yZW1vdmVEb3RTZWdtZW50cyA9IHJlbW92ZURvdFNlZ21lbnRzO1xuICAkdHJhY2V1clJ1bnRpbWUucmVzb2x2ZVVybCA9IHJlc29sdmVVcmw7XG59KSgpO1xuKGZ1bmN0aW9uKGdsb2JhbCkge1xuICAndXNlIHN0cmljdCc7XG4gIHZhciAkX18yID0gJHRyYWNldXJSdW50aW1lLFxuICAgICAgY2Fub25pY2FsaXplVXJsID0gJF9fMi5jYW5vbmljYWxpemVVcmwsXG4gICAgICByZXNvbHZlVXJsID0gJF9fMi5yZXNvbHZlVXJsLFxuICAgICAgaXNBYnNvbHV0ZSA9ICRfXzIuaXNBYnNvbHV0ZTtcbiAgdmFyIG1vZHVsZUluc3RhbnRpYXRvcnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICB2YXIgYmFzZVVSTDtcbiAgaWYgKGdsb2JhbC5sb2NhdGlvbiAmJiBnbG9iYWwubG9jYXRpb24uaHJlZilcbiAgICBiYXNlVVJMID0gcmVzb2x2ZVVybChnbG9iYWwubG9jYXRpb24uaHJlZiwgJy4vJyk7XG4gIGVsc2VcbiAgICBiYXNlVVJMID0gJyc7XG4gIHZhciBVbmNvYXRlZE1vZHVsZUVudHJ5ID0gZnVuY3Rpb24gVW5jb2F0ZWRNb2R1bGVFbnRyeSh1cmwsIHVuY29hdGVkTW9kdWxlKSB7XG4gICAgdGhpcy51cmwgPSB1cmw7XG4gICAgdGhpcy52YWx1ZV8gPSB1bmNvYXRlZE1vZHVsZTtcbiAgfTtcbiAgKCR0cmFjZXVyUnVudGltZS5jcmVhdGVDbGFzcykoVW5jb2F0ZWRNb2R1bGVFbnRyeSwge30sIHt9KTtcbiAgdmFyIFVuY29hdGVkTW9kdWxlSW5zdGFudGlhdG9yID0gZnVuY3Rpb24gVW5jb2F0ZWRNb2R1bGVJbnN0YW50aWF0b3IodXJsLCBmdW5jKSB7XG4gICAgJHRyYWNldXJSdW50aW1lLnN1cGVyQ2FsbCh0aGlzLCAkVW5jb2F0ZWRNb2R1bGVJbnN0YW50aWF0b3IucHJvdG90eXBlLCBcImNvbnN0cnVjdG9yXCIsIFt1cmwsIG51bGxdKTtcbiAgICB0aGlzLmZ1bmMgPSBmdW5jO1xuICB9O1xuICB2YXIgJFVuY29hdGVkTW9kdWxlSW5zdGFudGlhdG9yID0gVW5jb2F0ZWRNb2R1bGVJbnN0YW50aWF0b3I7XG4gICgkdHJhY2V1clJ1bnRpbWUuY3JlYXRlQ2xhc3MpKFVuY29hdGVkTW9kdWxlSW5zdGFudGlhdG9yLCB7Z2V0VW5jb2F0ZWRNb2R1bGU6IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHRoaXMudmFsdWVfKVxuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZV87XG4gICAgICByZXR1cm4gdGhpcy52YWx1ZV8gPSB0aGlzLmZ1bmMuY2FsbChnbG9iYWwpO1xuICAgIH19LCB7fSwgVW5jb2F0ZWRNb2R1bGVFbnRyeSk7XG4gIGZ1bmN0aW9uIGdldFVuY29hdGVkTW9kdWxlSW5zdGFudGlhdG9yKG5hbWUpIHtcbiAgICBpZiAoIW5hbWUpXG4gICAgICByZXR1cm47XG4gICAgdmFyIHVybCA9IE1vZHVsZVN0b3JlLm5vcm1hbGl6ZShuYW1lKTtcbiAgICByZXR1cm4gbW9kdWxlSW5zdGFudGlhdG9yc1t1cmxdO1xuICB9XG4gIDtcbiAgdmFyIG1vZHVsZUluc3RhbmNlcyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gIHZhciBsaXZlTW9kdWxlU2VudGluZWwgPSB7fTtcbiAgZnVuY3Rpb24gTW9kdWxlKHVuY29hdGVkTW9kdWxlKSB7XG4gICAgdmFyIGlzTGl2ZSA9IGFyZ3VtZW50c1sxXTtcbiAgICB2YXIgY29hdGVkTW9kdWxlID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh1bmNvYXRlZE1vZHVsZSkuZm9yRWFjaCgoZnVuY3Rpb24obmFtZSkge1xuICAgICAgdmFyIGdldHRlcixcbiAgICAgICAgICB2YWx1ZTtcbiAgICAgIGlmIChpc0xpdmUgPT09IGxpdmVNb2R1bGVTZW50aW5lbCkge1xuICAgICAgICB2YXIgZGVzY3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHVuY29hdGVkTW9kdWxlLCBuYW1lKTtcbiAgICAgICAgaWYgKGRlc2NyLmdldClcbiAgICAgICAgICBnZXR0ZXIgPSBkZXNjci5nZXQ7XG4gICAgICB9XG4gICAgICBpZiAoIWdldHRlcikge1xuICAgICAgICB2YWx1ZSA9IHVuY29hdGVkTW9kdWxlW25hbWVdO1xuICAgICAgICBnZXR0ZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoY29hdGVkTW9kdWxlLCBuYW1lLCB7XG4gICAgICAgIGdldDogZ2V0dGVyLFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICB9KTtcbiAgICB9KSk7XG4gICAgT2JqZWN0LnByZXZlbnRFeHRlbnNpb25zKGNvYXRlZE1vZHVsZSk7XG4gICAgcmV0dXJuIGNvYXRlZE1vZHVsZTtcbiAgfVxuICB2YXIgTW9kdWxlU3RvcmUgPSB7XG4gICAgbm9ybWFsaXplOiBmdW5jdGlvbihuYW1lLCByZWZlcmVyTmFtZSwgcmVmZXJlckFkZHJlc3MpIHtcbiAgICAgIGlmICh0eXBlb2YgbmFtZSAhPT0gXCJzdHJpbmdcIilcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIm1vZHVsZSBuYW1lIG11c3QgYmUgYSBzdHJpbmcsIG5vdCBcIiArIHR5cGVvZiBuYW1lKTtcbiAgICAgIGlmIChpc0Fic29sdXRlKG5hbWUpKVxuICAgICAgICByZXR1cm4gY2Fub25pY2FsaXplVXJsKG5hbWUpO1xuICAgICAgaWYgKC9bXlxcLl1cXC9cXC5cXC5cXC8vLnRlc3QobmFtZSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdtb2R1bGUgbmFtZSBlbWJlZHMgLy4uLzogJyArIG5hbWUpO1xuICAgICAgfVxuICAgICAgaWYgKG5hbWVbMF0gPT09ICcuJyAmJiByZWZlcmVyTmFtZSlcbiAgICAgICAgcmV0dXJuIHJlc29sdmVVcmwocmVmZXJlck5hbWUsIG5hbWUpO1xuICAgICAgcmV0dXJuIGNhbm9uaWNhbGl6ZVVybChuYW1lKTtcbiAgICB9LFxuICAgIGdldDogZnVuY3Rpb24obm9ybWFsaXplZE5hbWUpIHtcbiAgICAgIHZhciBtID0gZ2V0VW5jb2F0ZWRNb2R1bGVJbnN0YW50aWF0b3Iobm9ybWFsaXplZE5hbWUpO1xuICAgICAgaWYgKCFtKVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgdmFyIG1vZHVsZUluc3RhbmNlID0gbW9kdWxlSW5zdGFuY2VzW20udXJsXTtcbiAgICAgIGlmIChtb2R1bGVJbnN0YW5jZSlcbiAgICAgICAgcmV0dXJuIG1vZHVsZUluc3RhbmNlO1xuICAgICAgbW9kdWxlSW5zdGFuY2UgPSBNb2R1bGUobS5nZXRVbmNvYXRlZE1vZHVsZSgpLCBsaXZlTW9kdWxlU2VudGluZWwpO1xuICAgICAgcmV0dXJuIG1vZHVsZUluc3RhbmNlc1ttLnVybF0gPSBtb2R1bGVJbnN0YW5jZTtcbiAgICB9LFxuICAgIHNldDogZnVuY3Rpb24obm9ybWFsaXplZE5hbWUsIG1vZHVsZSkge1xuICAgICAgbm9ybWFsaXplZE5hbWUgPSBTdHJpbmcobm9ybWFsaXplZE5hbWUpO1xuICAgICAgbW9kdWxlSW5zdGFudGlhdG9yc1tub3JtYWxpemVkTmFtZV0gPSBuZXcgVW5jb2F0ZWRNb2R1bGVJbnN0YW50aWF0b3Iobm9ybWFsaXplZE5hbWUsIChmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIG1vZHVsZTtcbiAgICAgIH0pKTtcbiAgICAgIG1vZHVsZUluc3RhbmNlc1tub3JtYWxpemVkTmFtZV0gPSBtb2R1bGU7XG4gICAgfSxcbiAgICBnZXQgYmFzZVVSTCgpIHtcbiAgICAgIHJldHVybiBiYXNlVVJMO1xuICAgIH0sXG4gICAgc2V0IGJhc2VVUkwodikge1xuICAgICAgYmFzZVVSTCA9IFN0cmluZyh2KTtcbiAgICB9LFxuICAgIHJlZ2lzdGVyTW9kdWxlOiBmdW5jdGlvbihuYW1lLCBmdW5jKSB7XG4gICAgICB2YXIgbm9ybWFsaXplZE5hbWUgPSBNb2R1bGVTdG9yZS5ub3JtYWxpemUobmFtZSk7XG4gICAgICBpZiAobW9kdWxlSW5zdGFudGlhdG9yc1tub3JtYWxpemVkTmFtZV0pXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignZHVwbGljYXRlIG1vZHVsZSBuYW1lZCAnICsgbm9ybWFsaXplZE5hbWUpO1xuICAgICAgbW9kdWxlSW5zdGFudGlhdG9yc1tub3JtYWxpemVkTmFtZV0gPSBuZXcgVW5jb2F0ZWRNb2R1bGVJbnN0YW50aWF0b3Iobm9ybWFsaXplZE5hbWUsIGZ1bmMpO1xuICAgIH0sXG4gICAgYnVuZGxlU3RvcmU6IE9iamVjdC5jcmVhdGUobnVsbCksXG4gICAgcmVnaXN0ZXI6IGZ1bmN0aW9uKG5hbWUsIGRlcHMsIGZ1bmMpIHtcbiAgICAgIGlmICghZGVwcyB8fCAhZGVwcy5sZW5ndGgpIHtcbiAgICAgICAgdGhpcy5yZWdpc3Rlck1vZHVsZShuYW1lLCBmdW5jKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuYnVuZGxlU3RvcmVbbmFtZV0gPSB7XG4gICAgICAgICAgZGVwczogZGVwcyxcbiAgICAgICAgICBleGVjdXRlOiBmdW5jXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSxcbiAgICBnZXRBbm9ueW1vdXNNb2R1bGU6IGZ1bmN0aW9uKGZ1bmMpIHtcbiAgICAgIHJldHVybiBuZXcgTW9kdWxlKGZ1bmMuY2FsbChnbG9iYWwpLCBsaXZlTW9kdWxlU2VudGluZWwpO1xuICAgIH0sXG4gICAgZ2V0Rm9yVGVzdGluZzogZnVuY3Rpb24obmFtZSkge1xuICAgICAgdmFyICRfXzAgPSB0aGlzO1xuICAgICAgaWYgKCF0aGlzLnRlc3RpbmdQcmVmaXhfKSB7XG4gICAgICAgIE9iamVjdC5rZXlzKG1vZHVsZUluc3RhbmNlcykuc29tZSgoZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgICAgdmFyIG0gPSAvKHRyYWNldXJAW15cXC9dKlxcLykvLmV4ZWMoa2V5KTtcbiAgICAgICAgICBpZiAobSkge1xuICAgICAgICAgICAgJF9fMC50ZXN0aW5nUHJlZml4XyA9IG1bMV07XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLmdldCh0aGlzLnRlc3RpbmdQcmVmaXhfICsgbmFtZSk7XG4gICAgfVxuICB9O1xuICBNb2R1bGVTdG9yZS5zZXQoJ0B0cmFjZXVyL3NyYy9ydW50aW1lL01vZHVsZVN0b3JlJywgbmV3IE1vZHVsZSh7TW9kdWxlU3RvcmU6IE1vZHVsZVN0b3JlfSkpO1xuICB2YXIgc2V0dXBHbG9iYWxzID0gJHRyYWNldXJSdW50aW1lLnNldHVwR2xvYmFscztcbiAgJHRyYWNldXJSdW50aW1lLnNldHVwR2xvYmFscyA9IGZ1bmN0aW9uKGdsb2JhbCkge1xuICAgIHNldHVwR2xvYmFscyhnbG9iYWwpO1xuICB9O1xuICAkdHJhY2V1clJ1bnRpbWUuTW9kdWxlU3RvcmUgPSBNb2R1bGVTdG9yZTtcbiAgZ2xvYmFsLlN5c3RlbSA9IHtcbiAgICByZWdpc3RlcjogTW9kdWxlU3RvcmUucmVnaXN0ZXIuYmluZChNb2R1bGVTdG9yZSksXG4gICAgZ2V0OiBNb2R1bGVTdG9yZS5nZXQsXG4gICAgc2V0OiBNb2R1bGVTdG9yZS5zZXQsXG4gICAgbm9ybWFsaXplOiBNb2R1bGVTdG9yZS5ub3JtYWxpemVcbiAgfTtcbiAgJHRyYWNldXJSdW50aW1lLmdldE1vZHVsZUltcGwgPSBmdW5jdGlvbihuYW1lKSB7XG4gICAgdmFyIGluc3RhbnRpYXRvciA9IGdldFVuY29hdGVkTW9kdWxlSW5zdGFudGlhdG9yKG5hbWUpO1xuICAgIHJldHVybiBpbnN0YW50aWF0b3IgJiYgaW5zdGFudGlhdG9yLmdldFVuY29hdGVkTW9kdWxlKCk7XG4gIH07XG59KSh0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJyA/IGdsb2JhbCA6IHRoaXMpO1xuU3lzdGVtLnJlZ2lzdGVyKFwidHJhY2V1ci1ydW50aW1lQDAuMC4zMi9zcmMvcnVudGltZS9wb2x5ZmlsbHMvdXRpbHNcIiwgW10sIGZ1bmN0aW9uKCkge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgdmFyIF9fbW9kdWxlTmFtZSA9IFwidHJhY2V1ci1ydW50aW1lQDAuMC4zMi9zcmMvcnVudGltZS9wb2x5ZmlsbHMvdXRpbHNcIjtcbiAgdmFyIHRvT2JqZWN0ID0gJHRyYWNldXJSdW50aW1lLnRvT2JqZWN0O1xuICBmdW5jdGlvbiB0b1VpbnQzMih4KSB7XG4gICAgcmV0dXJuIHggfCAwO1xuICB9XG4gIHJldHVybiB7XG4gICAgZ2V0IHRvT2JqZWN0KCkge1xuICAgICAgcmV0dXJuIHRvT2JqZWN0O1xuICAgIH0sXG4gICAgZ2V0IHRvVWludDMyKCkge1xuICAgICAgcmV0dXJuIHRvVWludDMyO1xuICAgIH1cbiAgfTtcbn0pO1xuU3lzdGVtLnJlZ2lzdGVyKFwidHJhY2V1ci1ydW50aW1lQDAuMC4zMi9zcmMvcnVudGltZS9wb2x5ZmlsbHMvQXJyYXlJdGVyYXRvclwiLCBbXSwgZnVuY3Rpb24oKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuICB2YXIgJF9fNDtcbiAgdmFyIF9fbW9kdWxlTmFtZSA9IFwidHJhY2V1ci1ydW50aW1lQDAuMC4zMi9zcmMvcnVudGltZS9wb2x5ZmlsbHMvQXJyYXlJdGVyYXRvclwiO1xuICB2YXIgJF9fNSA9IFN5c3RlbS5nZXQoXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjMyL3NyYy9ydW50aW1lL3BvbHlmaWxscy91dGlsc1wiKSxcbiAgICAgIHRvT2JqZWN0ID0gJF9fNS50b09iamVjdCxcbiAgICAgIHRvVWludDMyID0gJF9fNS50b1VpbnQzMjtcbiAgdmFyIEFSUkFZX0lURVJBVE9SX0tJTkRfS0VZUyA9IDE7XG4gIHZhciBBUlJBWV9JVEVSQVRPUl9LSU5EX1ZBTFVFUyA9IDI7XG4gIHZhciBBUlJBWV9JVEVSQVRPUl9LSU5EX0VOVFJJRVMgPSAzO1xuICB2YXIgQXJyYXlJdGVyYXRvciA9IGZ1bmN0aW9uIEFycmF5SXRlcmF0b3IoKSB7fTtcbiAgKCR0cmFjZXVyUnVudGltZS5jcmVhdGVDbGFzcykoQXJyYXlJdGVyYXRvciwgKCRfXzQgPSB7fSwgT2JqZWN0LmRlZmluZVByb3BlcnR5KCRfXzQsIFwibmV4dFwiLCB7XG4gICAgdmFsdWU6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGl0ZXJhdG9yID0gdG9PYmplY3QodGhpcyk7XG4gICAgICB2YXIgYXJyYXkgPSBpdGVyYXRvci5pdGVyYXRvck9iamVjdF87XG4gICAgICBpZiAoIWFycmF5KSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ09iamVjdCBpcyBub3QgYW4gQXJyYXlJdGVyYXRvcicpO1xuICAgICAgfVxuICAgICAgdmFyIGluZGV4ID0gaXRlcmF0b3IuYXJyYXlJdGVyYXRvck5leHRJbmRleF87XG4gICAgICB2YXIgaXRlbUtpbmQgPSBpdGVyYXRvci5hcnJheUl0ZXJhdGlvbktpbmRfO1xuICAgICAgdmFyIGxlbmd0aCA9IHRvVWludDMyKGFycmF5Lmxlbmd0aCk7XG4gICAgICBpZiAoaW5kZXggPj0gbGVuZ3RoKSB7XG4gICAgICAgIGl0ZXJhdG9yLmFycmF5SXRlcmF0b3JOZXh0SW5kZXhfID0gSW5maW5pdHk7XG4gICAgICAgIHJldHVybiBjcmVhdGVJdGVyYXRvclJlc3VsdE9iamVjdCh1bmRlZmluZWQsIHRydWUpO1xuICAgICAgfVxuICAgICAgaXRlcmF0b3IuYXJyYXlJdGVyYXRvck5leHRJbmRleF8gPSBpbmRleCArIDE7XG4gICAgICBpZiAoaXRlbUtpbmQgPT0gQVJSQVlfSVRFUkFUT1JfS0lORF9WQUxVRVMpXG4gICAgICAgIHJldHVybiBjcmVhdGVJdGVyYXRvclJlc3VsdE9iamVjdChhcnJheVtpbmRleF0sIGZhbHNlKTtcbiAgICAgIGlmIChpdGVtS2luZCA9PSBBUlJBWV9JVEVSQVRPUl9LSU5EX0VOVFJJRVMpXG4gICAgICAgIHJldHVybiBjcmVhdGVJdGVyYXRvclJlc3VsdE9iamVjdChbaW5kZXgsIGFycmF5W2luZGV4XV0sIGZhbHNlKTtcbiAgICAgIHJldHVybiBjcmVhdGVJdGVyYXRvclJlc3VsdE9iamVjdChpbmRleCwgZmFsc2UpO1xuICAgIH0sXG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgd3JpdGFibGU6IHRydWVcbiAgfSksIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSgkX180LCBTeW1ib2wuaXRlcmF0b3IsIHtcbiAgICB2YWx1ZTogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgIHdyaXRhYmxlOiB0cnVlXG4gIH0pLCAkX180KSwge30pO1xuICBmdW5jdGlvbiBjcmVhdGVBcnJheUl0ZXJhdG9yKGFycmF5LCBraW5kKSB7XG4gICAgdmFyIG9iamVjdCA9IHRvT2JqZWN0KGFycmF5KTtcbiAgICB2YXIgaXRlcmF0b3IgPSBuZXcgQXJyYXlJdGVyYXRvcjtcbiAgICBpdGVyYXRvci5pdGVyYXRvck9iamVjdF8gPSBvYmplY3Q7XG4gICAgaXRlcmF0b3IuYXJyYXlJdGVyYXRvck5leHRJbmRleF8gPSAwO1xuICAgIGl0ZXJhdG9yLmFycmF5SXRlcmF0aW9uS2luZF8gPSBraW5kO1xuICAgIHJldHVybiBpdGVyYXRvcjtcbiAgfVxuICBmdW5jdGlvbiBjcmVhdGVJdGVyYXRvclJlc3VsdE9iamVjdCh2YWx1ZSwgZG9uZSkge1xuICAgIHJldHVybiB7XG4gICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICBkb25lOiBkb25lXG4gICAgfTtcbiAgfVxuICBmdW5jdGlvbiBlbnRyaWVzKCkge1xuICAgIHJldHVybiBjcmVhdGVBcnJheUl0ZXJhdG9yKHRoaXMsIEFSUkFZX0lURVJBVE9SX0tJTkRfRU5UUklFUyk7XG4gIH1cbiAgZnVuY3Rpb24ga2V5cygpIHtcbiAgICByZXR1cm4gY3JlYXRlQXJyYXlJdGVyYXRvcih0aGlzLCBBUlJBWV9JVEVSQVRPUl9LSU5EX0tFWVMpO1xuICB9XG4gIGZ1bmN0aW9uIHZhbHVlcygpIHtcbiAgICByZXR1cm4gY3JlYXRlQXJyYXlJdGVyYXRvcih0aGlzLCBBUlJBWV9JVEVSQVRPUl9LSU5EX1ZBTFVFUyk7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBnZXQgZW50cmllcygpIHtcbiAgICAgIHJldHVybiBlbnRyaWVzO1xuICAgIH0sXG4gICAgZ2V0IGtleXMoKSB7XG4gICAgICByZXR1cm4ga2V5cztcbiAgICB9LFxuICAgIGdldCB2YWx1ZXMoKSB7XG4gICAgICByZXR1cm4gdmFsdWVzO1xuICAgIH1cbiAgfTtcbn0pO1xuU3lzdGVtLnJlZ2lzdGVyKFwidHJhY2V1ci1ydW50aW1lQDAuMC4zMi9ub2RlX21vZHVsZXMvcnN2cC9saWIvcnN2cC9hc2FwXCIsIFtdLCBmdW5jdGlvbigpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG4gIHZhciBfX21vZHVsZU5hbWUgPSBcInRyYWNldXItcnVudGltZUAwLjAuMzIvbm9kZV9tb2R1bGVzL3JzdnAvbGliL3JzdnAvYXNhcFwiO1xuICB2YXIgJF9fZGVmYXVsdCA9IGZ1bmN0aW9uIGFzYXAoY2FsbGJhY2ssIGFyZykge1xuICAgIHZhciBsZW5ndGggPSBxdWV1ZS5wdXNoKFtjYWxsYmFjaywgYXJnXSk7XG4gICAgaWYgKGxlbmd0aCA9PT0gMSkge1xuICAgICAgc2NoZWR1bGVGbHVzaCgpO1xuICAgIH1cbiAgfTtcbiAgdmFyIGJyb3dzZXJHbG9iYWwgPSAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpID8gd2luZG93IDoge307XG4gIHZhciBCcm93c2VyTXV0YXRpb25PYnNlcnZlciA9IGJyb3dzZXJHbG9iYWwuTXV0YXRpb25PYnNlcnZlciB8fCBicm93c2VyR2xvYmFsLldlYktpdE11dGF0aW9uT2JzZXJ2ZXI7XG4gIGZ1bmN0aW9uIHVzZU5leHRUaWNrKCkge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHByb2Nlc3MubmV4dFRpY2soZmx1c2gpO1xuICAgIH07XG4gIH1cbiAgZnVuY3Rpb24gdXNlTXV0YXRpb25PYnNlcnZlcigpIHtcbiAgICB2YXIgaXRlcmF0aW9ucyA9IDA7XG4gICAgdmFyIG9ic2VydmVyID0gbmV3IEJyb3dzZXJNdXRhdGlvbk9ic2VydmVyKGZsdXNoKTtcbiAgICB2YXIgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcnKTtcbiAgICBvYnNlcnZlci5vYnNlcnZlKG5vZGUsIHtjaGFyYWN0ZXJEYXRhOiB0cnVlfSk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgbm9kZS5kYXRhID0gKGl0ZXJhdGlvbnMgPSArK2l0ZXJhdGlvbnMgJSAyKTtcbiAgICB9O1xuICB9XG4gIGZ1bmN0aW9uIHVzZVNldFRpbWVvdXQoKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgc2V0VGltZW91dChmbHVzaCwgMSk7XG4gICAgfTtcbiAgfVxuICB2YXIgcXVldWUgPSBbXTtcbiAgZnVuY3Rpb24gZmx1c2goKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBxdWV1ZS5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHR1cGxlID0gcXVldWVbaV07XG4gICAgICB2YXIgY2FsbGJhY2sgPSB0dXBsZVswXSxcbiAgICAgICAgICBhcmcgPSB0dXBsZVsxXTtcbiAgICAgIGNhbGxiYWNrKGFyZyk7XG4gICAgfVxuICAgIHF1ZXVlID0gW107XG4gIH1cbiAgdmFyIHNjaGVkdWxlRmx1c2g7XG4gIGlmICh0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcgJiYge30udG9TdHJpbmcuY2FsbChwcm9jZXNzKSA9PT0gJ1tvYmplY3QgcHJvY2Vzc10nKSB7XG4gICAgc2NoZWR1bGVGbHVzaCA9IHVzZU5leHRUaWNrKCk7XG4gIH0gZWxzZSBpZiAoQnJvd3Nlck11dGF0aW9uT2JzZXJ2ZXIpIHtcbiAgICBzY2hlZHVsZUZsdXNoID0gdXNlTXV0YXRpb25PYnNlcnZlcigpO1xuICB9IGVsc2Uge1xuICAgIHNjaGVkdWxlRmx1c2ggPSB1c2VTZXRUaW1lb3V0KCk7XG4gIH1cbiAgcmV0dXJuIHtnZXQgZGVmYXVsdCgpIHtcbiAgICAgIHJldHVybiAkX19kZWZhdWx0O1xuICAgIH19O1xufSk7XG5TeXN0ZW0ucmVnaXN0ZXIoXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjMyL3NyYy9ydW50aW1lL3BvbHlmaWxscy9Qcm9taXNlXCIsIFtdLCBmdW5jdGlvbigpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG4gIHZhciBfX21vZHVsZU5hbWUgPSBcInRyYWNldXItcnVudGltZUAwLjAuMzIvc3JjL3J1bnRpbWUvcG9seWZpbGxzL1Byb21pc2VcIjtcbiAgdmFyIGFzeW5jID0gU3lzdGVtLmdldChcInRyYWNldXItcnVudGltZUAwLjAuMzIvbm9kZV9tb2R1bGVzL3JzdnAvbGliL3JzdnAvYXNhcFwiKS5kZWZhdWx0O1xuICBmdW5jdGlvbiBpc1Byb21pc2UoeCkge1xuICAgIHJldHVybiB4ICYmIHR5cGVvZiB4ID09PSAnb2JqZWN0JyAmJiB4LnN0YXR1c18gIT09IHVuZGVmaW5lZDtcbiAgfVxuICBmdW5jdGlvbiBjaGFpbihwcm9taXNlKSB7XG4gICAgdmFyIG9uUmVzb2x2ZSA9IGFyZ3VtZW50c1sxXSAhPT0gKHZvaWQgMCkgPyBhcmd1bWVudHNbMV0gOiAoZnVuY3Rpb24oeCkge1xuICAgICAgcmV0dXJuIHg7XG4gICAgfSk7XG4gICAgdmFyIG9uUmVqZWN0ID0gYXJndW1lbnRzWzJdICE9PSAodm9pZCAwKSA/IGFyZ3VtZW50c1syXSA6IChmdW5jdGlvbihlKSB7XG4gICAgICB0aHJvdyBlO1xuICAgIH0pO1xuICAgIHZhciBkZWZlcnJlZCA9IGdldERlZmVycmVkKHByb21pc2UuY29uc3RydWN0b3IpO1xuICAgIHN3aXRjaCAocHJvbWlzZS5zdGF0dXNfKSB7XG4gICAgICBjYXNlIHVuZGVmaW5lZDpcbiAgICAgICAgdGhyb3cgVHlwZUVycm9yO1xuICAgICAgY2FzZSAncGVuZGluZyc6XG4gICAgICAgIHByb21pc2Uub25SZXNvbHZlXy5wdXNoKFtkZWZlcnJlZCwgb25SZXNvbHZlXSk7XG4gICAgICAgIHByb21pc2Uub25SZWplY3RfLnB1c2goW2RlZmVycmVkLCBvblJlamVjdF0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3Jlc29sdmVkJzpcbiAgICAgICAgcHJvbWlzZVJlYWN0KGRlZmVycmVkLCBvblJlc29sdmUsIHByb21pc2UudmFsdWVfKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdyZWplY3RlZCc6XG4gICAgICAgIHByb21pc2VSZWFjdChkZWZlcnJlZCwgb25SZWplY3QsIHByb21pc2UudmFsdWVfKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICB9XG4gIGZ1bmN0aW9uIGdldERlZmVycmVkKEMpIHtcbiAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgcmVzdWx0LnByb21pc2UgPSBuZXcgQygoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICByZXN1bHQucmVzb2x2ZSA9IHJlc29sdmU7XG4gICAgICByZXN1bHQucmVqZWN0ID0gcmVqZWN0O1xuICAgIH0pKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIHZhciBQcm9taXNlID0gZnVuY3Rpb24gUHJvbWlzZShyZXNvbHZlcikge1xuICAgIHZhciAkX182ID0gdGhpcztcbiAgICB0aGlzLnN0YXR1c18gPSAncGVuZGluZyc7XG4gICAgdGhpcy5vblJlc29sdmVfID0gW107XG4gICAgdGhpcy5vblJlamVjdF8gPSBbXTtcbiAgICByZXNvbHZlcigoZnVuY3Rpb24oeCkge1xuICAgICAgcHJvbWlzZVJlc29sdmUoJF9fNiwgeCk7XG4gICAgfSksIChmdW5jdGlvbihyKSB7XG4gICAgICBwcm9taXNlUmVqZWN0KCRfXzYsIHIpO1xuICAgIH0pKTtcbiAgfTtcbiAgKCR0cmFjZXVyUnVudGltZS5jcmVhdGVDbGFzcykoUHJvbWlzZSwge1xuICAgIGNhdGNoOiBmdW5jdGlvbihvblJlamVjdCkge1xuICAgICAgcmV0dXJuIHRoaXMudGhlbih1bmRlZmluZWQsIG9uUmVqZWN0KTtcbiAgICB9LFxuICAgIHRoZW46IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIG9uUmVzb2x2ZSA9IGFyZ3VtZW50c1swXSAhPT0gKHZvaWQgMCkgPyBhcmd1bWVudHNbMF0gOiAoZnVuY3Rpb24oeCkge1xuICAgICAgICByZXR1cm4geDtcbiAgICAgIH0pO1xuICAgICAgdmFyIG9uUmVqZWN0ID0gYXJndW1lbnRzWzFdO1xuICAgICAgdmFyICRfXzYgPSB0aGlzO1xuICAgICAgdmFyIGNvbnN0cnVjdG9yID0gdGhpcy5jb25zdHJ1Y3RvcjtcbiAgICAgIHJldHVybiBjaGFpbih0aGlzLCAoZnVuY3Rpb24oeCkge1xuICAgICAgICB4ID0gcHJvbWlzZUNvZXJjZShjb25zdHJ1Y3RvciwgeCk7XG4gICAgICAgIHJldHVybiB4ID09PSAkX182ID8gb25SZWplY3QobmV3IFR5cGVFcnJvcikgOiBpc1Byb21pc2UoeCkgPyB4LnRoZW4ob25SZXNvbHZlLCBvblJlamVjdCkgOiBvblJlc29sdmUoeCk7XG4gICAgICB9KSwgb25SZWplY3QpO1xuICAgIH1cbiAgfSwge1xuICAgIHJlc29sdmU6IGZ1bmN0aW9uKHgpIHtcbiAgICAgIHJldHVybiBuZXcgdGhpcygoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIHJlc29sdmUoeCk7XG4gICAgICB9KSk7XG4gICAgfSxcbiAgICByZWplY3Q6IGZ1bmN0aW9uKHIpIHtcbiAgICAgIHJldHVybiBuZXcgdGhpcygoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIHJlamVjdChyKTtcbiAgICAgIH0pKTtcbiAgICB9LFxuICAgIGNhc3Q6IGZ1bmN0aW9uKHgpIHtcbiAgICAgIGlmICh4IGluc3RhbmNlb2YgdGhpcylcbiAgICAgICAgcmV0dXJuIHg7XG4gICAgICBpZiAoaXNQcm9taXNlKHgpKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSBnZXREZWZlcnJlZCh0aGlzKTtcbiAgICAgICAgY2hhaW4oeCwgcmVzdWx0LnJlc29sdmUsIHJlc3VsdC5yZWplY3QpO1xuICAgICAgICByZXR1cm4gcmVzdWx0LnByb21pc2U7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5yZXNvbHZlKHgpO1xuICAgIH0sXG4gICAgYWxsOiBmdW5jdGlvbih2YWx1ZXMpIHtcbiAgICAgIHZhciBkZWZlcnJlZCA9IGdldERlZmVycmVkKHRoaXMpO1xuICAgICAgdmFyIGNvdW50ID0gMDtcbiAgICAgIHZhciByZXNvbHV0aW9ucyA9IFtdO1xuICAgICAgdHJ5IHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2YWx1ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICArK2NvdW50O1xuICAgICAgICAgIHRoaXMuY2FzdCh2YWx1ZXNbaV0pLnRoZW4oZnVuY3Rpb24oaSwgeCkge1xuICAgICAgICAgICAgcmVzb2x1dGlvbnNbaV0gPSB4O1xuICAgICAgICAgICAgaWYgKC0tY291bnQgPT09IDApXG4gICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUocmVzb2x1dGlvbnMpO1xuICAgICAgICAgIH0uYmluZCh1bmRlZmluZWQsIGkpLCAoZnVuY3Rpb24ocikge1xuICAgICAgICAgICAgaWYgKGNvdW50ID4gMClcbiAgICAgICAgICAgICAgY291bnQgPSAwO1xuICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KHIpO1xuICAgICAgICAgIH0pKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY291bnQgPT09IDApXG4gICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShyZXNvbHV0aW9ucyk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGRlZmVycmVkLnJlamVjdChlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgIH0sXG4gICAgcmFjZTogZnVuY3Rpb24odmFsdWVzKSB7XG4gICAgICB2YXIgZGVmZXJyZWQgPSBnZXREZWZlcnJlZCh0aGlzKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmFsdWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgdGhpcy5jYXN0KHZhbHVlc1tpXSkudGhlbigoZnVuY3Rpb24oeCkge1xuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSh4KTtcbiAgICAgICAgICB9KSwgKGZ1bmN0aW9uKHIpIHtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdChyKTtcbiAgICAgICAgICB9KSk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgZGVmZXJyZWQucmVqZWN0KGUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgfVxuICB9KTtcbiAgZnVuY3Rpb24gcHJvbWlzZVJlc29sdmUocHJvbWlzZSwgeCkge1xuICAgIHByb21pc2VEb25lKHByb21pc2UsICdyZXNvbHZlZCcsIHgsIHByb21pc2Uub25SZXNvbHZlXyk7XG4gIH1cbiAgZnVuY3Rpb24gcHJvbWlzZVJlamVjdChwcm9taXNlLCByKSB7XG4gICAgcHJvbWlzZURvbmUocHJvbWlzZSwgJ3JlamVjdGVkJywgciwgcHJvbWlzZS5vblJlamVjdF8pO1xuICB9XG4gIGZ1bmN0aW9uIHByb21pc2VEb25lKHByb21pc2UsIHN0YXR1cywgdmFsdWUsIHJlYWN0aW9ucykge1xuICAgIGlmIChwcm9taXNlLnN0YXR1c18gIT09ICdwZW5kaW5nJylcbiAgICAgIHJldHVybjtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlYWN0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgcHJvbWlzZVJlYWN0KHJlYWN0aW9uc1tpXVswXSwgcmVhY3Rpb25zW2ldWzFdLCB2YWx1ZSk7XG4gICAgfVxuICAgIHByb21pc2Uuc3RhdHVzXyA9IHN0YXR1cztcbiAgICBwcm9taXNlLnZhbHVlXyA9IHZhbHVlO1xuICAgIHByb21pc2Uub25SZXNvbHZlXyA9IHByb21pc2Uub25SZWplY3RfID0gdW5kZWZpbmVkO1xuICB9XG4gIGZ1bmN0aW9uIHByb21pc2VSZWFjdChkZWZlcnJlZCwgaGFuZGxlciwgeCkge1xuICAgIGFzeW5jKChmdW5jdGlvbigpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHZhciB5ID0gaGFuZGxlcih4KTtcbiAgICAgICAgaWYgKHkgPT09IGRlZmVycmVkLnByb21pc2UpXG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcjtcbiAgICAgICAgZWxzZSBpZiAoaXNQcm9taXNlKHkpKVxuICAgICAgICAgIGNoYWluKHksIGRlZmVycmVkLnJlc29sdmUsIGRlZmVycmVkLnJlamVjdCk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHkpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBkZWZlcnJlZC5yZWplY3QoZSk7XG4gICAgICB9XG4gICAgfSkpO1xuICB9XG4gIHZhciB0aGVuYWJsZVN5bWJvbCA9ICdAQHRoZW5hYmxlJztcbiAgZnVuY3Rpb24gcHJvbWlzZUNvZXJjZShjb25zdHJ1Y3RvciwgeCkge1xuICAgIGlmIChpc1Byb21pc2UoeCkpIHtcbiAgICAgIHJldHVybiB4O1xuICAgIH0gZWxzZSBpZiAoeCAmJiB0eXBlb2YgeC50aGVuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB2YXIgcCA9IHhbdGhlbmFibGVTeW1ib2xdO1xuICAgICAgaWYgKHApIHtcbiAgICAgICAgcmV0dXJuIHA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgZGVmZXJyZWQgPSBnZXREZWZlcnJlZChjb25zdHJ1Y3Rvcik7XG4gICAgICAgIHhbdGhlbmFibGVTeW1ib2xdID0gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB4LnRoZW4oZGVmZXJyZWQucmVzb2x2ZSwgZGVmZXJyZWQucmVqZWN0KTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIGRlZmVycmVkLnJlamVjdChlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHg7XG4gICAgfVxuICB9XG4gIHJldHVybiB7Z2V0IFByb21pc2UoKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZTtcbiAgICB9fTtcbn0pO1xuU3lzdGVtLnJlZ2lzdGVyKFwidHJhY2V1ci1ydW50aW1lQDAuMC4zMi9zcmMvcnVudGltZS9wb2x5ZmlsbHMvU3RyaW5nXCIsIFtdLCBmdW5jdGlvbigpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG4gIHZhciBfX21vZHVsZU5hbWUgPSBcInRyYWNldXItcnVudGltZUAwLjAuMzIvc3JjL3J1bnRpbWUvcG9seWZpbGxzL1N0cmluZ1wiO1xuICB2YXIgJHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcbiAgdmFyICRpbmRleE9mID0gU3RyaW5nLnByb3RvdHlwZS5pbmRleE9mO1xuICB2YXIgJGxhc3RJbmRleE9mID0gU3RyaW5nLnByb3RvdHlwZS5sYXN0SW5kZXhPZjtcbiAgZnVuY3Rpb24gc3RhcnRzV2l0aChzZWFyY2gpIHtcbiAgICB2YXIgc3RyaW5nID0gU3RyaW5nKHRoaXMpO1xuICAgIGlmICh0aGlzID09IG51bGwgfHwgJHRvU3RyaW5nLmNhbGwoc2VhcmNoKSA9PSAnW29iamVjdCBSZWdFeHBdJykge1xuICAgICAgdGhyb3cgVHlwZUVycm9yKCk7XG4gICAgfVxuICAgIHZhciBzdHJpbmdMZW5ndGggPSBzdHJpbmcubGVuZ3RoO1xuICAgIHZhciBzZWFyY2hTdHJpbmcgPSBTdHJpbmcoc2VhcmNoKTtcbiAgICB2YXIgc2VhcmNoTGVuZ3RoID0gc2VhcmNoU3RyaW5nLmxlbmd0aDtcbiAgICB2YXIgcG9zaXRpb24gPSBhcmd1bWVudHMubGVuZ3RoID4gMSA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZDtcbiAgICB2YXIgcG9zID0gcG9zaXRpb24gPyBOdW1iZXIocG9zaXRpb24pIDogMDtcbiAgICBpZiAoaXNOYU4ocG9zKSkge1xuICAgICAgcG9zID0gMDtcbiAgICB9XG4gICAgdmFyIHN0YXJ0ID0gTWF0aC5taW4oTWF0aC5tYXgocG9zLCAwKSwgc3RyaW5nTGVuZ3RoKTtcbiAgICByZXR1cm4gJGluZGV4T2YuY2FsbChzdHJpbmcsIHNlYXJjaFN0cmluZywgcG9zKSA9PSBzdGFydDtcbiAgfVxuICBmdW5jdGlvbiBlbmRzV2l0aChzZWFyY2gpIHtcbiAgICB2YXIgc3RyaW5nID0gU3RyaW5nKHRoaXMpO1xuICAgIGlmICh0aGlzID09IG51bGwgfHwgJHRvU3RyaW5nLmNhbGwoc2VhcmNoKSA9PSAnW29iamVjdCBSZWdFeHBdJykge1xuICAgICAgdGhyb3cgVHlwZUVycm9yKCk7XG4gICAgfVxuICAgIHZhciBzdHJpbmdMZW5ndGggPSBzdHJpbmcubGVuZ3RoO1xuICAgIHZhciBzZWFyY2hTdHJpbmcgPSBTdHJpbmcoc2VhcmNoKTtcbiAgICB2YXIgc2VhcmNoTGVuZ3RoID0gc2VhcmNoU3RyaW5nLmxlbmd0aDtcbiAgICB2YXIgcG9zID0gc3RyaW5nTGVuZ3RoO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgdmFyIHBvc2l0aW9uID0gYXJndW1lbnRzWzFdO1xuICAgICAgaWYgKHBvc2l0aW9uICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcG9zID0gcG9zaXRpb24gPyBOdW1iZXIocG9zaXRpb24pIDogMDtcbiAgICAgICAgaWYgKGlzTmFOKHBvcykpIHtcbiAgICAgICAgICBwb3MgPSAwO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHZhciBlbmQgPSBNYXRoLm1pbihNYXRoLm1heChwb3MsIDApLCBzdHJpbmdMZW5ndGgpO1xuICAgIHZhciBzdGFydCA9IGVuZCAtIHNlYXJjaExlbmd0aDtcbiAgICBpZiAoc3RhcnQgPCAwKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiAkbGFzdEluZGV4T2YuY2FsbChzdHJpbmcsIHNlYXJjaFN0cmluZywgc3RhcnQpID09IHN0YXJ0O1xuICB9XG4gIGZ1bmN0aW9uIGNvbnRhaW5zKHNlYXJjaCkge1xuICAgIGlmICh0aGlzID09IG51bGwpIHtcbiAgICAgIHRocm93IFR5cGVFcnJvcigpO1xuICAgIH1cbiAgICB2YXIgc3RyaW5nID0gU3RyaW5nKHRoaXMpO1xuICAgIHZhciBzdHJpbmdMZW5ndGggPSBzdHJpbmcubGVuZ3RoO1xuICAgIHZhciBzZWFyY2hTdHJpbmcgPSBTdHJpbmcoc2VhcmNoKTtcbiAgICB2YXIgc2VhcmNoTGVuZ3RoID0gc2VhcmNoU3RyaW5nLmxlbmd0aDtcbiAgICB2YXIgcG9zaXRpb24gPSBhcmd1bWVudHMubGVuZ3RoID4gMSA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZDtcbiAgICB2YXIgcG9zID0gcG9zaXRpb24gPyBOdW1iZXIocG9zaXRpb24pIDogMDtcbiAgICBpZiAoaXNOYU4ocG9zKSkge1xuICAgICAgcG9zID0gMDtcbiAgICB9XG4gICAgdmFyIHN0YXJ0ID0gTWF0aC5taW4oTWF0aC5tYXgocG9zLCAwKSwgc3RyaW5nTGVuZ3RoKTtcbiAgICByZXR1cm4gJGluZGV4T2YuY2FsbChzdHJpbmcsIHNlYXJjaFN0cmluZywgcG9zKSAhPSAtMTtcbiAgfVxuICBmdW5jdGlvbiByZXBlYXQoY291bnQpIHtcbiAgICBpZiAodGhpcyA9PSBudWxsKSB7XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoKTtcbiAgICB9XG4gICAgdmFyIHN0cmluZyA9IFN0cmluZyh0aGlzKTtcbiAgICB2YXIgbiA9IGNvdW50ID8gTnVtYmVyKGNvdW50KSA6IDA7XG4gICAgaWYgKGlzTmFOKG4pKSB7XG4gICAgICBuID0gMDtcbiAgICB9XG4gICAgaWYgKG4gPCAwIHx8IG4gPT0gSW5maW5pdHkpIHtcbiAgICAgIHRocm93IFJhbmdlRXJyb3IoKTtcbiAgICB9XG4gICAgaWYgKG4gPT0gMCkge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgICB2YXIgcmVzdWx0ID0gJyc7XG4gICAgd2hpbGUgKG4tLSkge1xuICAgICAgcmVzdWx0ICs9IHN0cmluZztcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICBmdW5jdGlvbiBjb2RlUG9pbnRBdChwb3NpdGlvbikge1xuICAgIGlmICh0aGlzID09IG51bGwpIHtcbiAgICAgIHRocm93IFR5cGVFcnJvcigpO1xuICAgIH1cbiAgICB2YXIgc3RyaW5nID0gU3RyaW5nKHRoaXMpO1xuICAgIHZhciBzaXplID0gc3RyaW5nLmxlbmd0aDtcbiAgICB2YXIgaW5kZXggPSBwb3NpdGlvbiA/IE51bWJlcihwb3NpdGlvbikgOiAwO1xuICAgIGlmIChpc05hTihpbmRleCkpIHtcbiAgICAgIGluZGV4ID0gMDtcbiAgICB9XG4gICAgaWYgKGluZGV4IDwgMCB8fCBpbmRleCA+PSBzaXplKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICB2YXIgZmlyc3QgPSBzdHJpbmcuY2hhckNvZGVBdChpbmRleCk7XG4gICAgdmFyIHNlY29uZDtcbiAgICBpZiAoZmlyc3QgPj0gMHhEODAwICYmIGZpcnN0IDw9IDB4REJGRiAmJiBzaXplID4gaW5kZXggKyAxKSB7XG4gICAgICBzZWNvbmQgPSBzdHJpbmcuY2hhckNvZGVBdChpbmRleCArIDEpO1xuICAgICAgaWYgKHNlY29uZCA+PSAweERDMDAgJiYgc2Vjb25kIDw9IDB4REZGRikge1xuICAgICAgICByZXR1cm4gKGZpcnN0IC0gMHhEODAwKSAqIDB4NDAwICsgc2Vjb25kIC0gMHhEQzAwICsgMHgxMDAwMDtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZpcnN0O1xuICB9XG4gIGZ1bmN0aW9uIHJhdyhjYWxsc2l0ZSkge1xuICAgIHZhciByYXcgPSBjYWxsc2l0ZS5yYXc7XG4gICAgdmFyIGxlbiA9IHJhdy5sZW5ndGggPj4+IDA7XG4gICAgaWYgKGxlbiA9PT0gMClcbiAgICAgIHJldHVybiAnJztcbiAgICB2YXIgcyA9ICcnO1xuICAgIHZhciBpID0gMDtcbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgcyArPSByYXdbaV07XG4gICAgICBpZiAoaSArIDEgPT09IGxlbilcbiAgICAgICAgcmV0dXJuIHM7XG4gICAgICBzICs9IGFyZ3VtZW50c1srK2ldO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBmcm9tQ29kZVBvaW50KCkge1xuICAgIHZhciBjb2RlVW5pdHMgPSBbXTtcbiAgICB2YXIgZmxvb3IgPSBNYXRoLmZsb29yO1xuICAgIHZhciBoaWdoU3Vycm9nYXRlO1xuICAgIHZhciBsb3dTdXJyb2dhdGU7XG4gICAgdmFyIGluZGV4ID0gLTE7XG4gICAgdmFyIGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgaWYgKCFsZW5ndGgpIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG4gICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgIHZhciBjb2RlUG9pbnQgPSBOdW1iZXIoYXJndW1lbnRzW2luZGV4XSk7XG4gICAgICBpZiAoIWlzRmluaXRlKGNvZGVQb2ludCkgfHwgY29kZVBvaW50IDwgMCB8fCBjb2RlUG9pbnQgPiAweDEwRkZGRiB8fCBmbG9vcihjb2RlUG9pbnQpICE9IGNvZGVQb2ludCkge1xuICAgICAgICB0aHJvdyBSYW5nZUVycm9yKCdJbnZhbGlkIGNvZGUgcG9pbnQ6ICcgKyBjb2RlUG9pbnQpO1xuICAgICAgfVxuICAgICAgaWYgKGNvZGVQb2ludCA8PSAweEZGRkYpIHtcbiAgICAgICAgY29kZVVuaXRzLnB1c2goY29kZVBvaW50KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvZGVQb2ludCAtPSAweDEwMDAwO1xuICAgICAgICBoaWdoU3Vycm9nYXRlID0gKGNvZGVQb2ludCA+PiAxMCkgKyAweEQ4MDA7XG4gICAgICAgIGxvd1N1cnJvZ2F0ZSA9IChjb2RlUG9pbnQgJSAweDQwMCkgKyAweERDMDA7XG4gICAgICAgIGNvZGVVbml0cy5wdXNoKGhpZ2hTdXJyb2dhdGUsIGxvd1N1cnJvZ2F0ZSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KG51bGwsIGNvZGVVbml0cyk7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBnZXQgc3RhcnRzV2l0aCgpIHtcbiAgICAgIHJldHVybiBzdGFydHNXaXRoO1xuICAgIH0sXG4gICAgZ2V0IGVuZHNXaXRoKCkge1xuICAgICAgcmV0dXJuIGVuZHNXaXRoO1xuICAgIH0sXG4gICAgZ2V0IGNvbnRhaW5zKCkge1xuICAgICAgcmV0dXJuIGNvbnRhaW5zO1xuICAgIH0sXG4gICAgZ2V0IHJlcGVhdCgpIHtcbiAgICAgIHJldHVybiByZXBlYXQ7XG4gICAgfSxcbiAgICBnZXQgY29kZVBvaW50QXQoKSB7XG4gICAgICByZXR1cm4gY29kZVBvaW50QXQ7XG4gICAgfSxcbiAgICBnZXQgcmF3KCkge1xuICAgICAgcmV0dXJuIHJhdztcbiAgICB9LFxuICAgIGdldCBmcm9tQ29kZVBvaW50KCkge1xuICAgICAgcmV0dXJuIGZyb21Db2RlUG9pbnQ7XG4gICAgfVxuICB9O1xufSk7XG5TeXN0ZW0ucmVnaXN0ZXIoXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjMyL3NyYy9ydW50aW1lL3BvbHlmaWxscy9wb2x5ZmlsbHNcIiwgW10sIGZ1bmN0aW9uKCkge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgdmFyIF9fbW9kdWxlTmFtZSA9IFwidHJhY2V1ci1ydW50aW1lQDAuMC4zMi9zcmMvcnVudGltZS9wb2x5ZmlsbHMvcG9seWZpbGxzXCI7XG4gIHZhciBQcm9taXNlID0gU3lzdGVtLmdldChcInRyYWNldXItcnVudGltZUAwLjAuMzIvc3JjL3J1bnRpbWUvcG9seWZpbGxzL1Byb21pc2VcIikuUHJvbWlzZTtcbiAgdmFyICRfXzkgPSBTeXN0ZW0uZ2V0KFwidHJhY2V1ci1ydW50aW1lQDAuMC4zMi9zcmMvcnVudGltZS9wb2x5ZmlsbHMvU3RyaW5nXCIpLFxuICAgICAgY29kZVBvaW50QXQgPSAkX185LmNvZGVQb2ludEF0LFxuICAgICAgY29udGFpbnMgPSAkX185LmNvbnRhaW5zLFxuICAgICAgZW5kc1dpdGggPSAkX185LmVuZHNXaXRoLFxuICAgICAgZnJvbUNvZGVQb2ludCA9ICRfXzkuZnJvbUNvZGVQb2ludCxcbiAgICAgIHJlcGVhdCA9ICRfXzkucmVwZWF0LFxuICAgICAgcmF3ID0gJF9fOS5yYXcsXG4gICAgICBzdGFydHNXaXRoID0gJF9fOS5zdGFydHNXaXRoO1xuICB2YXIgJF9fOSA9IFN5c3RlbS5nZXQoXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjMyL3NyYy9ydW50aW1lL3BvbHlmaWxscy9BcnJheUl0ZXJhdG9yXCIpLFxuICAgICAgZW50cmllcyA9ICRfXzkuZW50cmllcyxcbiAgICAgIGtleXMgPSAkX185LmtleXMsXG4gICAgICB2YWx1ZXMgPSAkX185LnZhbHVlcztcbiAgZnVuY3Rpb24gbWF5YmVEZWZpbmVNZXRob2Qob2JqZWN0LCBuYW1lLCB2YWx1ZSkge1xuICAgIGlmICghKG5hbWUgaW4gb2JqZWN0KSkge1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwgbmFtZSwge1xuICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlXG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gbWF5YmVBZGRGdW5jdGlvbnMob2JqZWN0LCBmdW5jdGlvbnMpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGZ1bmN0aW9ucy5sZW5ndGg7IGkgKz0gMikge1xuICAgICAgdmFyIG5hbWUgPSBmdW5jdGlvbnNbaV07XG4gICAgICB2YXIgdmFsdWUgPSBmdW5jdGlvbnNbaSArIDFdO1xuICAgICAgbWF5YmVEZWZpbmVNZXRob2Qob2JqZWN0LCBuYW1lLCB2YWx1ZSk7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIHBvbHlmaWxsUHJvbWlzZShnbG9iYWwpIHtcbiAgICBpZiAoIWdsb2JhbC5Qcm9taXNlKVxuICAgICAgZ2xvYmFsLlByb21pc2UgPSBQcm9taXNlO1xuICB9XG4gIGZ1bmN0aW9uIHBvbHlmaWxsU3RyaW5nKFN0cmluZykge1xuICAgIG1heWJlQWRkRnVuY3Rpb25zKFN0cmluZy5wcm90b3R5cGUsIFsnY29kZVBvaW50QXQnLCBjb2RlUG9pbnRBdCwgJ2NvbnRhaW5zJywgY29udGFpbnMsICdlbmRzV2l0aCcsIGVuZHNXaXRoLCAnc3RhcnRzV2l0aCcsIHN0YXJ0c1dpdGgsICdyZXBlYXQnLCByZXBlYXRdKTtcbiAgICBtYXliZUFkZEZ1bmN0aW9ucyhTdHJpbmcsIFsnZnJvbUNvZGVQb2ludCcsIGZyb21Db2RlUG9pbnQsICdyYXcnLCByYXddKTtcbiAgfVxuICBmdW5jdGlvbiBwb2x5ZmlsbEFycmF5KEFycmF5LCBTeW1ib2wpIHtcbiAgICBtYXliZUFkZEZ1bmN0aW9ucyhBcnJheS5wcm90b3R5cGUsIFsnZW50cmllcycsIGVudHJpZXMsICdrZXlzJywga2V5cywgJ3ZhbHVlcycsIHZhbHVlc10pO1xuICAgIGlmIChTeW1ib2wgJiYgU3ltYm9sLml0ZXJhdG9yKSB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoQXJyYXkucHJvdG90eXBlLCBTeW1ib2wuaXRlcmF0b3IsIHtcbiAgICAgICAgdmFsdWU6IHZhbHVlcyxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgd3JpdGFibGU6IHRydWVcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBwb2x5ZmlsbChnbG9iYWwpIHtcbiAgICBwb2x5ZmlsbFByb21pc2UoZ2xvYmFsKTtcbiAgICBwb2x5ZmlsbFN0cmluZyhnbG9iYWwuU3RyaW5nKTtcbiAgICBwb2x5ZmlsbEFycmF5KGdsb2JhbC5BcnJheSwgZ2xvYmFsLlN5bWJvbCk7XG4gIH1cbiAgcG9seWZpbGwodGhpcyk7XG4gIHZhciBzZXR1cEdsb2JhbHMgPSAkdHJhY2V1clJ1bnRpbWUuc2V0dXBHbG9iYWxzO1xuICAkdHJhY2V1clJ1bnRpbWUuc2V0dXBHbG9iYWxzID0gZnVuY3Rpb24oZ2xvYmFsKSB7XG4gICAgc2V0dXBHbG9iYWxzKGdsb2JhbCk7XG4gICAgcG9seWZpbGwoZ2xvYmFsKTtcbiAgfTtcbiAgcmV0dXJuIHt9O1xufSk7XG5TeXN0ZW0ucmVnaXN0ZXIoXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjMyL3NyYy9ydW50aW1lL3BvbHlmaWxsLWltcG9ydFwiLCBbXSwgZnVuY3Rpb24oKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuICB2YXIgX19tb2R1bGVOYW1lID0gXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjMyL3NyYy9ydW50aW1lL3BvbHlmaWxsLWltcG9ydFwiO1xuICB2YXIgJF9fMTEgPSBTeXN0ZW0uZ2V0KFwidHJhY2V1ci1ydW50aW1lQDAuMC4zMi9zcmMvcnVudGltZS9wb2x5ZmlsbHMvcG9seWZpbGxzXCIpO1xuICByZXR1cm4ge307XG59KTtcblN5c3RlbS5nZXQoXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjMyL3NyYy9ydW50aW1lL3BvbHlmaWxsLWltcG9ydFwiICsgJycpO1xuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcIi9Vc2Vycy9mcmFuY29wb250aWNlbGxpL3Byb2plY3RzL2NhcmRzL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9pbnNlcnQtbW9kdWxlLWdsb2JhbHMvbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qc1wiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pIiwiXCJ1c2Ugc3RyaWN0XCI7XG5leHBvcnRzLnRlc3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xufTsiLCJcInVzZSBzdHJpY3RcIjtcbnZhciB0eXBlcyA9IFtcbiAgICByZXF1aXJlKFwiLi9uZXh0VGlja1wiKSxcbiAgICByZXF1aXJlKFwiLi9tdXRhdGlvblwiKSxcbiAgICByZXF1aXJlKFwiLi9wb3N0TWVzc2FnZVwiKSxcbiAgICByZXF1aXJlKFwiLi9tZXNzYWdlQ2hhbm5lbFwiKSxcbiAgICByZXF1aXJlKFwiLi9zdGF0ZUNoYW5nZVwiKSxcbiAgICByZXF1aXJlKFwiLi90aW1lb3V0XCIpXG5dO1xudmFyIGhhbmRsZXJRdWV1ZSA9IFtdO1xuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICB2YXIgaSA9IDAsXG4gICAgICAgIHRhc2ssXG4gICAgICAgIGlubmVyUXVldWUgPSBoYW5kbGVyUXVldWU7XG5cdGhhbmRsZXJRdWV1ZSA9IFtdO1xuXHQvKmpzbGludCBib3NzOiB0cnVlICovXG5cdHdoaWxlICh0YXNrID0gaW5uZXJRdWV1ZVtpKytdKSB7XG5cdFx0dGFzaygpO1xuXHR9XG59XG52YXIgbmV4dFRpY2s7XG52YXIgaSA9IC0xO1xudmFyIGxlbiA9IHR5cGVzLmxlbmd0aDtcbndoaWxlICgrKyBpIDwgbGVuKSB7XG4gICAgaWYgKHR5cGVzW2ldLnRlc3QoKSkge1xuICAgICAgICBuZXh0VGljayA9IHR5cGVzW2ldLmluc3RhbGwoZHJhaW5RdWV1ZSk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHRhc2spIHtcbiAgICB2YXIgbGVuLCBpLCBhcmdzO1xuICAgIHZhciBuVGFzayA9IHRhc2s7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIHR5cGVvZiB0YXNrID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgICAgIGkgPSAwO1xuICAgICAgICB3aGlsZSAoKytpIDwgYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICAgICAgblRhc2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0YXNrLmFwcGx5KHVuZGVmaW5lZCwgYXJncyk7XG4gICAgICAgIH07XG4gICAgfVxuICAgIGlmICgobGVuID0gaGFuZGxlclF1ZXVlLnB1c2goblRhc2spKSA9PT0gMSkge1xuICAgICAgICBuZXh0VGljayhkcmFpblF1ZXVlKTtcbiAgICB9XG4gICAgcmV0dXJuIGxlbjtcbn07XG5tb2R1bGUuZXhwb3J0cy5jbGVhciA9IGZ1bmN0aW9uIChuKSB7XG4gICAgaWYgKG4gPD0gaGFuZGxlclF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBoYW5kbGVyUXVldWVbbiAtIDFdID0gZnVuY3Rpb24gKCkge307XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xufTtcbiIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcblwidXNlIHN0cmljdFwiO1xuXG5leHBvcnRzLnRlc3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBnbG9iYWwuTWVzc2FnZUNoYW5uZWwgIT09IFwidW5kZWZpbmVkXCI7XG59O1xuXG5leHBvcnRzLmluc3RhbGwgPSBmdW5jdGlvbiAoZnVuYykge1xuICAgIHZhciBjaGFubmVsID0gbmV3IGdsb2JhbC5NZXNzYWdlQ2hhbm5lbCgpO1xuICAgIGNoYW5uZWwucG9ydDEub25tZXNzYWdlID0gZnVuYztcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICBjaGFubmVsLnBvcnQyLnBvc3RNZXNzYWdlKDApO1xuICAgIH07XG59O1xufSkuY2FsbCh0aGlzLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG5cInVzZSBzdHJpY3RcIjtcbi8vYmFzZWQgb2ZmIHJzdnBcbi8vaHR0cHM6Ly9naXRodWIuY29tL3RpbGRlaW8vcnN2cC5qcy9ibG9iL21hc3Rlci9saWIvcnN2cC9hc3luYy5qc1xuXG52YXIgTXV0YXRpb25PYnNlcnZlciA9IGdsb2JhbC5NdXRhdGlvbk9ic2VydmVyIHx8IGdsb2JhbC5XZWJLaXRNdXRhdGlvbk9ic2VydmVyO1xuXG5leHBvcnRzLnRlc3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIE11dGF0aW9uT2JzZXJ2ZXI7XG59O1xuXG5leHBvcnRzLmluc3RhbGwgPSBmdW5jdGlvbiAoaGFuZGxlKSB7XG4gICAgdmFyIG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoaGFuZGxlKTtcbiAgICB2YXIgZWxlbWVudCA9IGdsb2JhbC5kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIG9ic2VydmVyLm9ic2VydmUoZWxlbWVudCwgeyBhdHRyaWJ1dGVzOiB0cnVlIH0pO1xuXG4gICAgLy8gQ2hyb21lIE1lbW9yeSBMZWFrOiBodHRwczovL2J1Z3Mud2Via2l0Lm9yZy9zaG93X2J1Zy5jZ2k/aWQ9OTM2NjFcbiAgICBnbG9iYWwuYWRkRXZlbnRMaXN0ZW5lcihcInVubG9hZFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIG9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgb2JzZXJ2ZXIgPSBudWxsO1xuICAgIH0sIGZhbHNlKTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShcImRyYWluUXVldWVcIiwgXCJkcmFpblF1ZXVlXCIpO1xuICAgIH07XG59O1xufSkuY2FsbCh0aGlzLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG5cInVzZSBzdHJpY3RcIjtcbmV4cG9ydHMudGVzdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAvLyBUaGUgdGVzdCBhZ2FpbnN0IGBpbXBvcnRTY3JpcHRzYCBwcmV2ZW50cyB0aGlzIGltcGxlbWVudGF0aW9uIGZyb20gYmVpbmcgaW5zdGFsbGVkIGluc2lkZSBhIHdlYiB3b3JrZXIsXG4gICAgLy8gd2hlcmUgYGdsb2JhbC5wb3N0TWVzc2FnZWAgbWVhbnMgc29tZXRoaW5nIGNvbXBsZXRlbHkgZGlmZmVyZW50IGFuZCBjYW5cInQgYmUgdXNlZCBmb3IgdGhpcyBwdXJwb3NlLlxuXG4gICAgaWYgKCFnbG9iYWwucG9zdE1lc3NhZ2UgfHwgZ2xvYmFsLmltcG9ydFNjcmlwdHMpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHZhciBwb3N0TWVzc2FnZUlzQXN5bmNocm9ub3VzID0gdHJ1ZTtcbiAgICB2YXIgb2xkT25NZXNzYWdlID0gZ2xvYmFsLm9ubWVzc2FnZTtcbiAgICBnbG9iYWwub25tZXNzYWdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBwb3N0TWVzc2FnZUlzQXN5bmNocm9ub3VzID0gZmFsc2U7XG4gICAgfTtcbiAgICBnbG9iYWwucG9zdE1lc3NhZ2UoXCJcIiwgXCIqXCIpO1xuICAgIGdsb2JhbC5vbm1lc3NhZ2UgPSBvbGRPbk1lc3NhZ2U7XG5cbiAgICByZXR1cm4gcG9zdE1lc3NhZ2VJc0FzeW5jaHJvbm91cztcbn07XG5cbmV4cG9ydHMuaW5zdGFsbCA9IGZ1bmN0aW9uIChmdW5jKSB7XG4gICAgdmFyIGNvZGVXb3JkID0gXCJjb20uY2FsdmlubWV0Y2FsZi5zZXRJbW1lZGlhdGVcIiArIE1hdGgucmFuZG9tKCk7XG4gICAgZnVuY3Rpb24gZ2xvYmFsTWVzc2FnZShldmVudCkge1xuICAgICAgICBpZiAoZXZlbnQuc291cmNlID09PSBnbG9iYWwgJiYgZXZlbnQuZGF0YSA9PT0gY29kZVdvcmQpIHtcbiAgICAgICAgICAgIGZ1bmMoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAoZ2xvYmFsLmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgICAgICAgZ2xvYmFsLmFkZEV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIGdsb2JhbE1lc3NhZ2UsIGZhbHNlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBnbG9iYWwuYXR0YWNoRXZlbnQoXCJvbm1lc3NhZ2VcIiwgZ2xvYmFsTWVzc2FnZSk7XG4gICAgfVxuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGdsb2JhbC5wb3N0TWVzc2FnZShjb2RlV29yZCwgXCIqXCIpO1xuICAgIH07XG59O1xufSkuY2FsbCh0aGlzLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG5cInVzZSBzdHJpY3RcIjtcblxuZXhwb3J0cy50ZXN0ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBcImRvY3VtZW50XCIgaW4gZ2xvYmFsICYmIFwib25yZWFkeXN0YXRlY2hhbmdlXCIgaW4gZ2xvYmFsLmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7XG59O1xuXG5leHBvcnRzLmluc3RhbGwgPSBmdW5jdGlvbiAoaGFuZGxlKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAvLyBDcmVhdGUgYSA8c2NyaXB0PiBlbGVtZW50OyBpdHMgcmVhZHlzdGF0ZWNoYW5nZSBldmVudCB3aWxsIGJlIGZpcmVkIGFzeW5jaHJvbm91c2x5IG9uY2UgaXQgaXMgaW5zZXJ0ZWRcbiAgICAgICAgLy8gaW50byB0aGUgZG9jdW1lbnQuIERvIHNvLCB0aHVzIHF1ZXVpbmcgdXAgdGhlIHRhc2suIFJlbWVtYmVyIHRvIGNsZWFuIHVwIG9uY2UgaXQncyBiZWVuIGNhbGxlZC5cbiAgICAgICAgdmFyIHNjcmlwdEVsID0gZ2xvYmFsLmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7XG4gICAgICAgIHNjcmlwdEVsLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGhhbmRsZSgpO1xuXG4gICAgICAgICAgICBzY3JpcHRFbC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBudWxsO1xuICAgICAgICAgICAgc2NyaXB0RWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzY3JpcHRFbCk7XG4gICAgICAgICAgICBzY3JpcHRFbCA9IG51bGw7XG4gICAgICAgIH07XG4gICAgICAgIGdsb2JhbC5kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuYXBwZW5kQ2hpbGQoc2NyaXB0RWwpO1xuXG4gICAgICAgIHJldHVybiBoYW5kbGU7XG4gICAgfTtcbn07XG59KS5jYWxsKHRoaXMsdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KSIsIlwidXNlIHN0cmljdFwiO1xuZXhwb3J0cy50ZXN0ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0cnVlO1xufTtcblxuZXhwb3J0cy5pbnN0YWxsID0gZnVuY3Rpb24gKHQpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICBzZXRUaW1lb3V0KHQsIDApO1xuICAgIH07XG59OyIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbiFmdW5jdGlvbihlKXtpZihcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyltb2R1bGUuZXhwb3J0cz1lKCk7ZWxzZSBpZihcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQpZGVmaW5lKGUpO2Vsc2V7dmFyIGY7XCJ1bmRlZmluZWRcIiE9dHlwZW9mIHdpbmRvdz9mPXdpbmRvdzpcInVuZGVmaW5lZFwiIT10eXBlb2YgZ2xvYmFsP2Y9Z2xvYmFsOlwidW5kZWZpbmVkXCIhPXR5cGVvZiBzZWxmJiYoZj1zZWxmKSxmLmphZGU9ZSgpfX0oZnVuY3Rpb24oKXt2YXIgZGVmaW5lLG1vZHVsZSxleHBvcnRzO3JldHVybiAoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSh7MTpbZnVuY3Rpb24oX2RlcmVxXyxtb2R1bGUsZXhwb3J0cyl7XG4ndXNlIHN0cmljdCc7XG5cbi8qKlxuICogTWVyZ2UgdHdvIGF0dHJpYnV0ZSBvYmplY3RzIGdpdmluZyBwcmVjZWRlbmNlXG4gKiB0byB2YWx1ZXMgaW4gb2JqZWN0IGBiYC4gQ2xhc3NlcyBhcmUgc3BlY2lhbC1jYXNlZFxuICogYWxsb3dpbmcgZm9yIGFycmF5cyBhbmQgbWVyZ2luZy9qb2luaW5nIGFwcHJvcHJpYXRlbHlcbiAqIHJlc3VsdGluZyBpbiBhIHN0cmluZy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gYVxuICogQHBhcmFtIHtPYmplY3R9IGJcbiAqIEByZXR1cm4ge09iamVjdH0gYVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZXhwb3J0cy5tZXJnZSA9IGZ1bmN0aW9uIG1lcmdlKGEsIGIpIHtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICB2YXIgYXR0cnMgPSBhWzBdO1xuICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYS5sZW5ndGg7IGkrKykge1xuICAgICAgYXR0cnMgPSBtZXJnZShhdHRycywgYVtpXSk7XG4gICAgfVxuICAgIHJldHVybiBhdHRycztcbiAgfVxuICB2YXIgYWMgPSBhWydjbGFzcyddO1xuICB2YXIgYmMgPSBiWydjbGFzcyddO1xuXG4gIGlmIChhYyB8fCBiYykge1xuICAgIGFjID0gYWMgfHwgW107XG4gICAgYmMgPSBiYyB8fCBbXTtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoYWMpKSBhYyA9IFthY107XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGJjKSkgYmMgPSBbYmNdO1xuICAgIGFbJ2NsYXNzJ10gPSBhYy5jb25jYXQoYmMpLmZpbHRlcihudWxscyk7XG4gIH1cblxuICBmb3IgKHZhciBrZXkgaW4gYikge1xuICAgIGlmIChrZXkgIT0gJ2NsYXNzJykge1xuICAgICAgYVtrZXldID0gYltrZXldO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBhO1xufTtcblxuLyoqXG4gKiBGaWx0ZXIgbnVsbCBgdmFsYHMuXG4gKlxuICogQHBhcmFtIHsqfSB2YWxcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBudWxscyh2YWwpIHtcbiAgcmV0dXJuIHZhbCAhPSBudWxsICYmIHZhbCAhPT0gJyc7XG59XG5cbi8qKlxuICogam9pbiBhcnJheSBhcyBjbGFzc2VzLlxuICpcbiAqIEBwYXJhbSB7Kn0gdmFsXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmV4cG9ydHMuam9pbkNsYXNzZXMgPSBqb2luQ2xhc3NlcztcbmZ1bmN0aW9uIGpvaW5DbGFzc2VzKHZhbCkge1xuICByZXR1cm4gQXJyYXkuaXNBcnJheSh2YWwpID8gdmFsLm1hcChqb2luQ2xhc3NlcykuZmlsdGVyKG51bGxzKS5qb2luKCcgJykgOiB2YWw7XG59XG5cbi8qKlxuICogUmVuZGVyIHRoZSBnaXZlbiBjbGFzc2VzLlxuICpcbiAqIEBwYXJhbSB7QXJyYXl9IGNsYXNzZXNcbiAqIEBwYXJhbSB7QXJyYXkuPEJvb2xlYW4+fSBlc2NhcGVkXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmV4cG9ydHMuY2xzID0gZnVuY3Rpb24gY2xzKGNsYXNzZXMsIGVzY2FwZWQpIHtcbiAgdmFyIGJ1ZiA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGNsYXNzZXMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoZXNjYXBlZCAmJiBlc2NhcGVkW2ldKSB7XG4gICAgICBidWYucHVzaChleHBvcnRzLmVzY2FwZShqb2luQ2xhc3NlcyhbY2xhc3Nlc1tpXV0pKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGJ1Zi5wdXNoKGpvaW5DbGFzc2VzKGNsYXNzZXNbaV0pKTtcbiAgICB9XG4gIH1cbiAgdmFyIHRleHQgPSBqb2luQ2xhc3NlcyhidWYpO1xuICBpZiAodGV4dC5sZW5ndGgpIHtcbiAgICByZXR1cm4gJyBjbGFzcz1cIicgKyB0ZXh0ICsgJ1wiJztcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gJyc7XG4gIH1cbn07XG5cbi8qKlxuICogUmVuZGVyIHRoZSBnaXZlbiBhdHRyaWJ1dGUuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGtleVxuICogQHBhcmFtIHtTdHJpbmd9IHZhbFxuICogQHBhcmFtIHtCb29sZWFufSBlc2NhcGVkXG4gKiBAcGFyYW0ge0Jvb2xlYW59IHRlcnNlXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmV4cG9ydHMuYXR0ciA9IGZ1bmN0aW9uIGF0dHIoa2V5LCB2YWwsIGVzY2FwZWQsIHRlcnNlKSB7XG4gIGlmICgnYm9vbGVhbicgPT0gdHlwZW9mIHZhbCB8fCBudWxsID09IHZhbCkge1xuICAgIGlmICh2YWwpIHtcbiAgICAgIHJldHVybiAnICcgKyAodGVyc2UgPyBrZXkgOiBrZXkgKyAnPVwiJyArIGtleSArICdcIicpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICB9IGVsc2UgaWYgKDAgPT0ga2V5LmluZGV4T2YoJ2RhdGEnKSAmJiAnc3RyaW5nJyAhPSB0eXBlb2YgdmFsKSB7XG4gICAgcmV0dXJuICcgJyArIGtleSArIFwiPSdcIiArIEpTT04uc3RyaW5naWZ5KHZhbCkucmVwbGFjZSgvJy9nLCAnJmFwb3M7JykgKyBcIidcIjtcbiAgfSBlbHNlIGlmIChlc2NhcGVkKSB7XG4gICAgcmV0dXJuICcgJyArIGtleSArICc9XCInICsgZXhwb3J0cy5lc2NhcGUodmFsKSArICdcIic7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuICcgJyArIGtleSArICc9XCInICsgdmFsICsgJ1wiJztcbiAgfVxufTtcblxuLyoqXG4gKiBSZW5kZXIgdGhlIGdpdmVuIGF0dHJpYnV0ZXMgb2JqZWN0LlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEBwYXJhbSB7T2JqZWN0fSBlc2NhcGVkXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmV4cG9ydHMuYXR0cnMgPSBmdW5jdGlvbiBhdHRycyhvYmosIHRlcnNlKXtcbiAgdmFyIGJ1ZiA9IFtdO1xuXG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXMob2JqKTtcblxuICBpZiAoa2V5cy5sZW5ndGgpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyArK2kpIHtcbiAgICAgIHZhciBrZXkgPSBrZXlzW2ldXG4gICAgICAgICwgdmFsID0gb2JqW2tleV07XG5cbiAgICAgIGlmICgnY2xhc3MnID09IGtleSkge1xuICAgICAgICBpZiAodmFsID0gam9pbkNsYXNzZXModmFsKSkge1xuICAgICAgICAgIGJ1Zi5wdXNoKCcgJyArIGtleSArICc9XCInICsgdmFsICsgJ1wiJyk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGJ1Zi5wdXNoKGV4cG9ydHMuYXR0cihrZXksIHZhbCwgZmFsc2UsIHRlcnNlKSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGJ1Zi5qb2luKCcnKTtcbn07XG5cbi8qKlxuICogRXNjYXBlIHRoZSBnaXZlbiBzdHJpbmcgb2YgYGh0bWxgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBodG1sXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5leHBvcnRzLmVzY2FwZSA9IGZ1bmN0aW9uIGVzY2FwZShodG1sKXtcbiAgdmFyIHJlc3VsdCA9IFN0cmluZyhodG1sKVxuICAgIC5yZXBsYWNlKC8mL2csICcmYW1wOycpXG4gICAgLnJlcGxhY2UoLzwvZywgJyZsdDsnKVxuICAgIC5yZXBsYWNlKC8+L2csICcmZ3Q7JylcbiAgICAucmVwbGFjZSgvXCIvZywgJyZxdW90OycpO1xuICBpZiAocmVzdWx0ID09PSAnJyArIGh0bWwpIHJldHVybiBodG1sO1xuICBlbHNlIHJldHVybiByZXN1bHQ7XG59O1xuXG4vKipcbiAqIFJlLXRocm93IHRoZSBnaXZlbiBgZXJyYCBpbiBjb250ZXh0IHRvIHRoZVxuICogdGhlIGphZGUgaW4gYGZpbGVuYW1lYCBhdCB0aGUgZ2l2ZW4gYGxpbmVub2AuXG4gKlxuICogQHBhcmFtIHtFcnJvcn0gZXJyXG4gKiBAcGFyYW0ge1N0cmluZ30gZmlsZW5hbWVcbiAqIEBwYXJhbSB7U3RyaW5nfSBsaW5lbm9cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmV4cG9ydHMucmV0aHJvdyA9IGZ1bmN0aW9uIHJldGhyb3coZXJyLCBmaWxlbmFtZSwgbGluZW5vLCBzdHIpe1xuICBpZiAoIShlcnIgaW5zdGFuY2VvZiBFcnJvcikpIHRocm93IGVycjtcbiAgaWYgKCh0eXBlb2Ygd2luZG93ICE9ICd1bmRlZmluZWQnIHx8ICFmaWxlbmFtZSkgJiYgIXN0cikge1xuICAgIGVyci5tZXNzYWdlICs9ICcgb24gbGluZSAnICsgbGluZW5vO1xuICAgIHRocm93IGVycjtcbiAgfVxuICB0cnkge1xuICAgIHN0ciA9ICBzdHIgfHwgX2RlcmVxXygnZnMnKS5yZWFkRmlsZVN5bmMoZmlsZW5hbWUsICd1dGY4JylcbiAgfSBjYXRjaCAoZXgpIHtcbiAgICByZXRocm93KGVyciwgbnVsbCwgbGluZW5vKVxuICB9XG4gIHZhciBjb250ZXh0ID0gM1xuICAgICwgbGluZXMgPSBzdHIuc3BsaXQoJ1xcbicpXG4gICAgLCBzdGFydCA9IE1hdGgubWF4KGxpbmVubyAtIGNvbnRleHQsIDApXG4gICAgLCBlbmQgPSBNYXRoLm1pbihsaW5lcy5sZW5ndGgsIGxpbmVubyArIGNvbnRleHQpO1xuXG4gIC8vIEVycm9yIGNvbnRleHRcbiAgdmFyIGNvbnRleHQgPSBsaW5lcy5zbGljZShzdGFydCwgZW5kKS5tYXAoZnVuY3Rpb24obGluZSwgaSl7XG4gICAgdmFyIGN1cnIgPSBpICsgc3RhcnQgKyAxO1xuICAgIHJldHVybiAoY3VyciA9PSBsaW5lbm8gPyAnICA+ICcgOiAnICAgICcpXG4gICAgICArIGN1cnJcbiAgICAgICsgJ3wgJ1xuICAgICAgKyBsaW5lO1xuICB9KS5qb2luKCdcXG4nKTtcblxuICAvLyBBbHRlciBleGNlcHRpb24gbWVzc2FnZVxuICBlcnIucGF0aCA9IGZpbGVuYW1lO1xuICBlcnIubWVzc2FnZSA9IChmaWxlbmFtZSB8fCAnSmFkZScpICsgJzonICsgbGluZW5vXG4gICAgKyAnXFxuJyArIGNvbnRleHQgKyAnXFxuXFxuJyArIGVyci5tZXNzYWdlO1xuICB0aHJvdyBlcnI7XG59O1xuXG59LHtcImZzXCI6Mn1dLDI6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpe1xuXG59LHt9XX0se30sWzFdKVxuKDEpXG59KTtcbn0pLmNhbGwodGhpcyx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pIiwiLyohXG4gKiBudW1lcmFsLmpzXG4gKiB2ZXJzaW9uIDogMS41LjNcbiAqIGF1dGhvciA6IEFkYW0gRHJhcGVyXG4gKiBsaWNlbnNlIDogTUlUXG4gKiBodHRwOi8vYWRhbXdkcmFwZXIuZ2l0aHViLmNvbS9OdW1lcmFsLWpzL1xuICovXG5cbihmdW5jdGlvbiAoKSB7XG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgIENvbnN0YW50c1xuICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgIHZhciBudW1lcmFsLFxuICAgICAgICBWRVJTSU9OID0gJzEuNS4zJyxcbiAgICAgICAgLy8gaW50ZXJuYWwgc3RvcmFnZSBmb3IgbGFuZ3VhZ2UgY29uZmlnIGZpbGVzXG4gICAgICAgIGxhbmd1YWdlcyA9IHt9LFxuICAgICAgICBjdXJyZW50TGFuZ3VhZ2UgPSAnZW4nLFxuICAgICAgICB6ZXJvRm9ybWF0ID0gbnVsbCxcbiAgICAgICAgZGVmYXVsdEZvcm1hdCA9ICcwLDAnLFxuICAgICAgICAvLyBjaGVjayBmb3Igbm9kZUpTXG4gICAgICAgIGhhc01vZHVsZSA9ICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cyk7XG5cblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgQ29uc3RydWN0b3JzXG4gICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5cbiAgICAvLyBOdW1lcmFsIHByb3RvdHlwZSBvYmplY3RcbiAgICBmdW5jdGlvbiBOdW1lcmFsIChudW1iZXIpIHtcbiAgICAgICAgdGhpcy5fdmFsdWUgPSBudW1iZXI7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW1wbGVtZW50YXRpb24gb2YgdG9GaXhlZCgpIHRoYXQgdHJlYXRzIGZsb2F0cyBtb3JlIGxpa2UgZGVjaW1hbHNcbiAgICAgKlxuICAgICAqIEZpeGVzIGJpbmFyeSByb3VuZGluZyBpc3N1ZXMgKGVnLiAoMC42MTUpLnRvRml4ZWQoMikgPT09ICcwLjYxJykgdGhhdCBwcmVzZW50XG4gICAgICogcHJvYmxlbXMgZm9yIGFjY291bnRpbmctIGFuZCBmaW5hbmNlLXJlbGF0ZWQgc29mdHdhcmUuXG4gICAgICovXG4gICAgZnVuY3Rpb24gdG9GaXhlZCAodmFsdWUsIHByZWNpc2lvbiwgcm91bmRpbmdGdW5jdGlvbiwgb3B0aW9uYWxzKSB7XG4gICAgICAgIHZhciBwb3dlciA9IE1hdGgucG93KDEwLCBwcmVjaXNpb24pLFxuICAgICAgICAgICAgb3B0aW9uYWxzUmVnRXhwLFxuICAgICAgICAgICAgb3V0cHV0O1xuICAgICAgICAgICAgXG4gICAgICAgIC8vcm91bmRpbmdGdW5jdGlvbiA9IChyb3VuZGluZ0Z1bmN0aW9uICE9PSB1bmRlZmluZWQgPyByb3VuZGluZ0Z1bmN0aW9uIDogTWF0aC5yb3VuZCk7XG4gICAgICAgIC8vIE11bHRpcGx5IHVwIGJ5IHByZWNpc2lvbiwgcm91bmQgYWNjdXJhdGVseSwgdGhlbiBkaXZpZGUgYW5kIHVzZSBuYXRpdmUgdG9GaXhlZCgpOlxuICAgICAgICBvdXRwdXQgPSAocm91bmRpbmdGdW5jdGlvbih2YWx1ZSAqIHBvd2VyKSAvIHBvd2VyKS50b0ZpeGVkKHByZWNpc2lvbik7XG5cbiAgICAgICAgaWYgKG9wdGlvbmFscykge1xuICAgICAgICAgICAgb3B0aW9uYWxzUmVnRXhwID0gbmV3IFJlZ0V4cCgnMHsxLCcgKyBvcHRpb25hbHMgKyAnfSQnKTtcbiAgICAgICAgICAgIG91dHB1dCA9IG91dHB1dC5yZXBsYWNlKG9wdGlvbmFsc1JlZ0V4cCwgJycpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICB9XG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgIEZvcm1hdHRpbmdcbiAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAvLyBkZXRlcm1pbmUgd2hhdCB0eXBlIG9mIGZvcm1hdHRpbmcgd2UgbmVlZCB0byBkb1xuICAgIGZ1bmN0aW9uIGZvcm1hdE51bWVyYWwgKG4sIGZvcm1hdCwgcm91bmRpbmdGdW5jdGlvbikge1xuICAgICAgICB2YXIgb3V0cHV0O1xuXG4gICAgICAgIC8vIGZpZ3VyZSBvdXQgd2hhdCBraW5kIG9mIGZvcm1hdCB3ZSBhcmUgZGVhbGluZyB3aXRoXG4gICAgICAgIGlmIChmb3JtYXQuaW5kZXhPZignJCcpID4gLTEpIHsgLy8gY3VycmVuY3khISEhIVxuICAgICAgICAgICAgb3V0cHV0ID0gZm9ybWF0Q3VycmVuY3kobiwgZm9ybWF0LCByb3VuZGluZ0Z1bmN0aW9uKTtcbiAgICAgICAgfSBlbHNlIGlmIChmb3JtYXQuaW5kZXhPZignJScpID4gLTEpIHsgLy8gcGVyY2VudGFnZVxuICAgICAgICAgICAgb3V0cHV0ID0gZm9ybWF0UGVyY2VudGFnZShuLCBmb3JtYXQsIHJvdW5kaW5nRnVuY3Rpb24pO1xuICAgICAgICB9IGVsc2UgaWYgKGZvcm1hdC5pbmRleE9mKCc6JykgPiAtMSkgeyAvLyB0aW1lXG4gICAgICAgICAgICBvdXRwdXQgPSBmb3JtYXRUaW1lKG4sIGZvcm1hdCk7XG4gICAgICAgIH0gZWxzZSB7IC8vIHBsYWluIG9sJyBudW1iZXJzIG9yIGJ5dGVzXG4gICAgICAgICAgICBvdXRwdXQgPSBmb3JtYXROdW1iZXIobi5fdmFsdWUsIGZvcm1hdCwgcm91bmRpbmdGdW5jdGlvbik7XG4gICAgICAgIH1cblxuICAgICAgICAvLyByZXR1cm4gc3RyaW5nXG4gICAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgfVxuXG4gICAgLy8gcmV2ZXJ0IHRvIG51bWJlclxuICAgIGZ1bmN0aW9uIHVuZm9ybWF0TnVtZXJhbCAobiwgc3RyaW5nKSB7XG4gICAgICAgIHZhciBzdHJpbmdPcmlnaW5hbCA9IHN0cmluZyxcbiAgICAgICAgICAgIHRob3VzYW5kUmVnRXhwLFxuICAgICAgICAgICAgbWlsbGlvblJlZ0V4cCxcbiAgICAgICAgICAgIGJpbGxpb25SZWdFeHAsXG4gICAgICAgICAgICB0cmlsbGlvblJlZ0V4cCxcbiAgICAgICAgICAgIHN1ZmZpeGVzID0gWydLQicsICdNQicsICdHQicsICdUQicsICdQQicsICdFQicsICdaQicsICdZQiddLFxuICAgICAgICAgICAgYnl0ZXNNdWx0aXBsaWVyID0gZmFsc2UsXG4gICAgICAgICAgICBwb3dlcjtcblxuICAgICAgICBpZiAoc3RyaW5nLmluZGV4T2YoJzonKSA+IC0xKSB7XG4gICAgICAgICAgICBuLl92YWx1ZSA9IHVuZm9ybWF0VGltZShzdHJpbmcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHN0cmluZyA9PT0gemVyb0Zvcm1hdCkge1xuICAgICAgICAgICAgICAgIG4uX3ZhbHVlID0gMDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKGxhbmd1YWdlc1tjdXJyZW50TGFuZ3VhZ2VdLmRlbGltaXRlcnMuZGVjaW1hbCAhPT0gJy4nKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0cmluZyA9IHN0cmluZy5yZXBsYWNlKC9cXC4vZywnJykucmVwbGFjZShsYW5ndWFnZXNbY3VycmVudExhbmd1YWdlXS5kZWxpbWl0ZXJzLmRlY2ltYWwsICcuJyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gc2VlIGlmIGFiYnJldmlhdGlvbnMgYXJlIHRoZXJlIHNvIHRoYXQgd2UgY2FuIG11bHRpcGx5IHRvIHRoZSBjb3JyZWN0IG51bWJlclxuICAgICAgICAgICAgICAgIHRob3VzYW5kUmVnRXhwID0gbmV3IFJlZ0V4cCgnW15hLXpBLVpdJyArIGxhbmd1YWdlc1tjdXJyZW50TGFuZ3VhZ2VdLmFiYnJldmlhdGlvbnMudGhvdXNhbmQgKyAnKD86XFxcXCl8KFxcXFwnICsgbGFuZ3VhZ2VzW2N1cnJlbnRMYW5ndWFnZV0uY3VycmVuY3kuc3ltYm9sICsgJyk/KD86XFxcXCkpPyk/JCcpO1xuICAgICAgICAgICAgICAgIG1pbGxpb25SZWdFeHAgPSBuZXcgUmVnRXhwKCdbXmEtekEtWl0nICsgbGFuZ3VhZ2VzW2N1cnJlbnRMYW5ndWFnZV0uYWJicmV2aWF0aW9ucy5taWxsaW9uICsgJyg/OlxcXFwpfChcXFxcJyArIGxhbmd1YWdlc1tjdXJyZW50TGFuZ3VhZ2VdLmN1cnJlbmN5LnN5bWJvbCArICcpPyg/OlxcXFwpKT8pPyQnKTtcbiAgICAgICAgICAgICAgICBiaWxsaW9uUmVnRXhwID0gbmV3IFJlZ0V4cCgnW15hLXpBLVpdJyArIGxhbmd1YWdlc1tjdXJyZW50TGFuZ3VhZ2VdLmFiYnJldmlhdGlvbnMuYmlsbGlvbiArICcoPzpcXFxcKXwoXFxcXCcgKyBsYW5ndWFnZXNbY3VycmVudExhbmd1YWdlXS5jdXJyZW5jeS5zeW1ib2wgKyAnKT8oPzpcXFxcKSk/KT8kJyk7XG4gICAgICAgICAgICAgICAgdHJpbGxpb25SZWdFeHAgPSBuZXcgUmVnRXhwKCdbXmEtekEtWl0nICsgbGFuZ3VhZ2VzW2N1cnJlbnRMYW5ndWFnZV0uYWJicmV2aWF0aW9ucy50cmlsbGlvbiArICcoPzpcXFxcKXwoXFxcXCcgKyBsYW5ndWFnZXNbY3VycmVudExhbmd1YWdlXS5jdXJyZW5jeS5zeW1ib2wgKyAnKT8oPzpcXFxcKSk/KT8kJyk7XG5cbiAgICAgICAgICAgICAgICAvLyBzZWUgaWYgYnl0ZXMgYXJlIHRoZXJlIHNvIHRoYXQgd2UgY2FuIG11bHRpcGx5IHRvIHRoZSBjb3JyZWN0IG51bWJlclxuICAgICAgICAgICAgICAgIGZvciAocG93ZXIgPSAwOyBwb3dlciA8PSBzdWZmaXhlcy5sZW5ndGg7IHBvd2VyKyspIHtcbiAgICAgICAgICAgICAgICAgICAgYnl0ZXNNdWx0aXBsaWVyID0gKHN0cmluZy5pbmRleE9mKHN1ZmZpeGVzW3Bvd2VyXSkgPiAtMSkgPyBNYXRoLnBvdygxMDI0LCBwb3dlciArIDEpIDogZmFsc2U7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGJ5dGVzTXVsdGlwbGllcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBkbyBzb21lIG1hdGggdG8gY3JlYXRlIG91ciBudW1iZXJcbiAgICAgICAgICAgICAgICBuLl92YWx1ZSA9ICgoYnl0ZXNNdWx0aXBsaWVyKSA/IGJ5dGVzTXVsdGlwbGllciA6IDEpICogKChzdHJpbmdPcmlnaW5hbC5tYXRjaCh0aG91c2FuZFJlZ0V4cCkpID8gTWF0aC5wb3coMTAsIDMpIDogMSkgKiAoKHN0cmluZ09yaWdpbmFsLm1hdGNoKG1pbGxpb25SZWdFeHApKSA/IE1hdGgucG93KDEwLCA2KSA6IDEpICogKChzdHJpbmdPcmlnaW5hbC5tYXRjaChiaWxsaW9uUmVnRXhwKSkgPyBNYXRoLnBvdygxMCwgOSkgOiAxKSAqICgoc3RyaW5nT3JpZ2luYWwubWF0Y2godHJpbGxpb25SZWdFeHApKSA/IE1hdGgucG93KDEwLCAxMikgOiAxKSAqICgoc3RyaW5nLmluZGV4T2YoJyUnKSA+IC0xKSA/IDAuMDEgOiAxKSAqICgoKHN0cmluZy5zcGxpdCgnLScpLmxlbmd0aCArIE1hdGgubWluKHN0cmluZy5zcGxpdCgnKCcpLmxlbmd0aC0xLCBzdHJpbmcuc3BsaXQoJyknKS5sZW5ndGgtMSkpICUgMik/IDE6IC0xKSAqIE51bWJlcihzdHJpbmcucmVwbGFjZSgvW14wLTlcXC5dKy9nLCAnJykpO1xuXG4gICAgICAgICAgICAgICAgLy8gcm91bmQgaWYgd2UgYXJlIHRhbGtpbmcgYWJvdXQgYnl0ZXNcbiAgICAgICAgICAgICAgICBuLl92YWx1ZSA9IChieXRlc011bHRpcGxpZXIpID8gTWF0aC5jZWlsKG4uX3ZhbHVlKSA6IG4uX3ZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuLl92YWx1ZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmb3JtYXRDdXJyZW5jeSAobiwgZm9ybWF0LCByb3VuZGluZ0Z1bmN0aW9uKSB7XG4gICAgICAgIHZhciBzeW1ib2xJbmRleCA9IGZvcm1hdC5pbmRleE9mKCckJyksXG4gICAgICAgICAgICBvcGVuUGFyZW5JbmRleCA9IGZvcm1hdC5pbmRleE9mKCcoJyksXG4gICAgICAgICAgICBtaW51c1NpZ25JbmRleCA9IGZvcm1hdC5pbmRleE9mKCctJyksXG4gICAgICAgICAgICBzcGFjZSA9ICcnLFxuICAgICAgICAgICAgc3BsaWNlSW5kZXgsXG4gICAgICAgICAgICBvdXRwdXQ7XG5cbiAgICAgICAgLy8gY2hlY2sgZm9yIHNwYWNlIGJlZm9yZSBvciBhZnRlciBjdXJyZW5jeVxuICAgICAgICBpZiAoZm9ybWF0LmluZGV4T2YoJyAkJykgPiAtMSkge1xuICAgICAgICAgICAgc3BhY2UgPSAnICc7XG4gICAgICAgICAgICBmb3JtYXQgPSBmb3JtYXQucmVwbGFjZSgnICQnLCAnJyk7XG4gICAgICAgIH0gZWxzZSBpZiAoZm9ybWF0LmluZGV4T2YoJyQgJykgPiAtMSkge1xuICAgICAgICAgICAgc3BhY2UgPSAnICc7XG4gICAgICAgICAgICBmb3JtYXQgPSBmb3JtYXQucmVwbGFjZSgnJCAnLCAnJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmb3JtYXQgPSBmb3JtYXQucmVwbGFjZSgnJCcsICcnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGZvcm1hdCB0aGUgbnVtYmVyXG4gICAgICAgIG91dHB1dCA9IGZvcm1hdE51bWJlcihuLl92YWx1ZSwgZm9ybWF0LCByb3VuZGluZ0Z1bmN0aW9uKTtcblxuICAgICAgICAvLyBwb3NpdGlvbiB0aGUgc3ltYm9sXG4gICAgICAgIGlmIChzeW1ib2xJbmRleCA8PSAxKSB7XG4gICAgICAgICAgICBpZiAob3V0cHV0LmluZGV4T2YoJygnKSA+IC0xIHx8IG91dHB1dC5pbmRleE9mKCctJykgPiAtMSkge1xuICAgICAgICAgICAgICAgIG91dHB1dCA9IG91dHB1dC5zcGxpdCgnJyk7XG4gICAgICAgICAgICAgICAgc3BsaWNlSW5kZXggPSAxO1xuICAgICAgICAgICAgICAgIGlmIChzeW1ib2xJbmRleCA8IG9wZW5QYXJlbkluZGV4IHx8IHN5bWJvbEluZGV4IDwgbWludXNTaWduSW5kZXgpe1xuICAgICAgICAgICAgICAgICAgICAvLyB0aGUgc3ltYm9sIGFwcGVhcnMgYmVmb3JlIHRoZSBcIihcIiBvciBcIi1cIlxuICAgICAgICAgICAgICAgICAgICBzcGxpY2VJbmRleCA9IDA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG91dHB1dC5zcGxpY2Uoc3BsaWNlSW5kZXgsIDAsIGxhbmd1YWdlc1tjdXJyZW50TGFuZ3VhZ2VdLmN1cnJlbmN5LnN5bWJvbCArIHNwYWNlKTtcbiAgICAgICAgICAgICAgICBvdXRwdXQgPSBvdXRwdXQuam9pbignJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG91dHB1dCA9IGxhbmd1YWdlc1tjdXJyZW50TGFuZ3VhZ2VdLmN1cnJlbmN5LnN5bWJvbCArIHNwYWNlICsgb3V0cHV0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKG91dHB1dC5pbmRleE9mKCcpJykgPiAtMSkge1xuICAgICAgICAgICAgICAgIG91dHB1dCA9IG91dHB1dC5zcGxpdCgnJyk7XG4gICAgICAgICAgICAgICAgb3V0cHV0LnNwbGljZSgtMSwgMCwgc3BhY2UgKyBsYW5ndWFnZXNbY3VycmVudExhbmd1YWdlXS5jdXJyZW5jeS5zeW1ib2wpO1xuICAgICAgICAgICAgICAgIG91dHB1dCA9IG91dHB1dC5qb2luKCcnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgb3V0cHV0ID0gb3V0cHV0ICsgc3BhY2UgKyBsYW5ndWFnZXNbY3VycmVudExhbmd1YWdlXS5jdXJyZW5jeS5zeW1ib2w7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZvcm1hdFBlcmNlbnRhZ2UgKG4sIGZvcm1hdCwgcm91bmRpbmdGdW5jdGlvbikge1xuICAgICAgICB2YXIgc3BhY2UgPSAnJyxcbiAgICAgICAgICAgIG91dHB1dCxcbiAgICAgICAgICAgIHZhbHVlID0gbi5fdmFsdWUgKiAxMDA7XG5cbiAgICAgICAgLy8gY2hlY2sgZm9yIHNwYWNlIGJlZm9yZSAlXG4gICAgICAgIGlmIChmb3JtYXQuaW5kZXhPZignICUnKSA+IC0xKSB7XG4gICAgICAgICAgICBzcGFjZSA9ICcgJztcbiAgICAgICAgICAgIGZvcm1hdCA9IGZvcm1hdC5yZXBsYWNlKCcgJScsICcnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZvcm1hdCA9IGZvcm1hdC5yZXBsYWNlKCclJywgJycpO1xuICAgICAgICB9XG5cbiAgICAgICAgb3V0cHV0ID0gZm9ybWF0TnVtYmVyKHZhbHVlLCBmb3JtYXQsIHJvdW5kaW5nRnVuY3Rpb24pO1xuICAgICAgICBcbiAgICAgICAgaWYgKG91dHB1dC5pbmRleE9mKCcpJykgPiAtMSApIHtcbiAgICAgICAgICAgIG91dHB1dCA9IG91dHB1dC5zcGxpdCgnJyk7XG4gICAgICAgICAgICBvdXRwdXQuc3BsaWNlKC0xLCAwLCBzcGFjZSArICclJyk7XG4gICAgICAgICAgICBvdXRwdXQgPSBvdXRwdXQuam9pbignJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvdXRwdXQgPSBvdXRwdXQgKyBzcGFjZSArICclJztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZm9ybWF0VGltZSAobikge1xuICAgICAgICB2YXIgaG91cnMgPSBNYXRoLmZsb29yKG4uX3ZhbHVlLzYwLzYwKSxcbiAgICAgICAgICAgIG1pbnV0ZXMgPSBNYXRoLmZsb29yKChuLl92YWx1ZSAtIChob3VycyAqIDYwICogNjApKS82MCksXG4gICAgICAgICAgICBzZWNvbmRzID0gTWF0aC5yb3VuZChuLl92YWx1ZSAtIChob3VycyAqIDYwICogNjApIC0gKG1pbnV0ZXMgKiA2MCkpO1xuICAgICAgICByZXR1cm4gaG91cnMgKyAnOicgKyAoKG1pbnV0ZXMgPCAxMCkgPyAnMCcgKyBtaW51dGVzIDogbWludXRlcykgKyAnOicgKyAoKHNlY29uZHMgPCAxMCkgPyAnMCcgKyBzZWNvbmRzIDogc2Vjb25kcyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdW5mb3JtYXRUaW1lIChzdHJpbmcpIHtcbiAgICAgICAgdmFyIHRpbWVBcnJheSA9IHN0cmluZy5zcGxpdCgnOicpLFxuICAgICAgICAgICAgc2Vjb25kcyA9IDA7XG4gICAgICAgIC8vIHR1cm4gaG91cnMgYW5kIG1pbnV0ZXMgaW50byBzZWNvbmRzIGFuZCBhZGQgdGhlbSBhbGwgdXBcbiAgICAgICAgaWYgKHRpbWVBcnJheS5sZW5ndGggPT09IDMpIHtcbiAgICAgICAgICAgIC8vIGhvdXJzXG4gICAgICAgICAgICBzZWNvbmRzID0gc2Vjb25kcyArIChOdW1iZXIodGltZUFycmF5WzBdKSAqIDYwICogNjApO1xuICAgICAgICAgICAgLy8gbWludXRlc1xuICAgICAgICAgICAgc2Vjb25kcyA9IHNlY29uZHMgKyAoTnVtYmVyKHRpbWVBcnJheVsxXSkgKiA2MCk7XG4gICAgICAgICAgICAvLyBzZWNvbmRzXG4gICAgICAgICAgICBzZWNvbmRzID0gc2Vjb25kcyArIE51bWJlcih0aW1lQXJyYXlbMl0pO1xuICAgICAgICB9IGVsc2UgaWYgKHRpbWVBcnJheS5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgICAgIC8vIG1pbnV0ZXNcbiAgICAgICAgICAgIHNlY29uZHMgPSBzZWNvbmRzICsgKE51bWJlcih0aW1lQXJyYXlbMF0pICogNjApO1xuICAgICAgICAgICAgLy8gc2Vjb25kc1xuICAgICAgICAgICAgc2Vjb25kcyA9IHNlY29uZHMgKyBOdW1iZXIodGltZUFycmF5WzFdKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gTnVtYmVyKHNlY29uZHMpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZvcm1hdE51bWJlciAodmFsdWUsIGZvcm1hdCwgcm91bmRpbmdGdW5jdGlvbikge1xuICAgICAgICB2YXIgbmVnUCA9IGZhbHNlLFxuICAgICAgICAgICAgc2lnbmVkID0gZmFsc2UsXG4gICAgICAgICAgICBvcHREZWMgPSBmYWxzZSxcbiAgICAgICAgICAgIGFiYnIgPSAnJyxcbiAgICAgICAgICAgIGFiYnJLID0gZmFsc2UsIC8vIGZvcmNlIGFiYnJldmlhdGlvbiB0byB0aG91c2FuZHNcbiAgICAgICAgICAgIGFiYnJNID0gZmFsc2UsIC8vIGZvcmNlIGFiYnJldmlhdGlvbiB0byBtaWxsaW9uc1xuICAgICAgICAgICAgYWJickIgPSBmYWxzZSwgLy8gZm9yY2UgYWJicmV2aWF0aW9uIHRvIGJpbGxpb25zXG4gICAgICAgICAgICBhYmJyVCA9IGZhbHNlLCAvLyBmb3JjZSBhYmJyZXZpYXRpb24gdG8gdHJpbGxpb25zXG4gICAgICAgICAgICBhYmJyRm9yY2UgPSBmYWxzZSwgLy8gZm9yY2UgYWJicmV2aWF0aW9uXG4gICAgICAgICAgICBieXRlcyA9ICcnLFxuICAgICAgICAgICAgb3JkID0gJycsXG4gICAgICAgICAgICBhYnMgPSBNYXRoLmFicyh2YWx1ZSksXG4gICAgICAgICAgICBzdWZmaXhlcyA9IFsnQicsICdLQicsICdNQicsICdHQicsICdUQicsICdQQicsICdFQicsICdaQicsICdZQiddLFxuICAgICAgICAgICAgbWluLFxuICAgICAgICAgICAgbWF4LFxuICAgICAgICAgICAgcG93ZXIsXG4gICAgICAgICAgICB3LFxuICAgICAgICAgICAgcHJlY2lzaW9uLFxuICAgICAgICAgICAgdGhvdXNhbmRzLFxuICAgICAgICAgICAgZCA9ICcnLFxuICAgICAgICAgICAgbmVnID0gZmFsc2U7XG5cbiAgICAgICAgLy8gY2hlY2sgaWYgbnVtYmVyIGlzIHplcm8gYW5kIGEgY3VzdG9tIHplcm8gZm9ybWF0IGhhcyBiZWVuIHNldFxuICAgICAgICBpZiAodmFsdWUgPT09IDAgJiYgemVyb0Zvcm1hdCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIHplcm9Gb3JtYXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBzZWUgaWYgd2Ugc2hvdWxkIHVzZSBwYXJlbnRoZXNlcyBmb3IgbmVnYXRpdmUgbnVtYmVyIG9yIGlmIHdlIHNob3VsZCBwcmVmaXggd2l0aCBhIHNpZ25cbiAgICAgICAgICAgIC8vIGlmIGJvdGggYXJlIHByZXNlbnQgd2UgZGVmYXVsdCB0byBwYXJlbnRoZXNlc1xuICAgICAgICAgICAgaWYgKGZvcm1hdC5pbmRleE9mKCcoJykgPiAtMSkge1xuICAgICAgICAgICAgICAgIG5lZ1AgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGZvcm1hdCA9IGZvcm1hdC5zbGljZSgxLCAtMSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGZvcm1hdC5pbmRleE9mKCcrJykgPiAtMSkge1xuICAgICAgICAgICAgICAgIHNpZ25lZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgZm9ybWF0ID0gZm9ybWF0LnJlcGxhY2UoL1xcKy9nLCAnJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHNlZSBpZiBhYmJyZXZpYXRpb24gaXMgd2FudGVkXG4gICAgICAgICAgICBpZiAoZm9ybWF0LmluZGV4T2YoJ2EnKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgLy8gY2hlY2sgaWYgYWJicmV2aWF0aW9uIGlzIHNwZWNpZmllZFxuICAgICAgICAgICAgICAgIGFiYnJLID0gZm9ybWF0LmluZGV4T2YoJ2FLJykgPj0gMDtcbiAgICAgICAgICAgICAgICBhYmJyTSA9IGZvcm1hdC5pbmRleE9mKCdhTScpID49IDA7XG4gICAgICAgICAgICAgICAgYWJickIgPSBmb3JtYXQuaW5kZXhPZignYUInKSA+PSAwO1xuICAgICAgICAgICAgICAgIGFiYnJUID0gZm9ybWF0LmluZGV4T2YoJ2FUJykgPj0gMDtcbiAgICAgICAgICAgICAgICBhYmJyRm9yY2UgPSBhYmJySyB8fCBhYmJyTSB8fCBhYmJyQiB8fCBhYmJyVDtcblxuICAgICAgICAgICAgICAgIC8vIGNoZWNrIGZvciBzcGFjZSBiZWZvcmUgYWJicmV2aWF0aW9uXG4gICAgICAgICAgICAgICAgaWYgKGZvcm1hdC5pbmRleE9mKCcgYScpID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgYWJiciA9ICcgJztcbiAgICAgICAgICAgICAgICAgICAgZm9ybWF0ID0gZm9ybWF0LnJlcGxhY2UoJyBhJywgJycpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGZvcm1hdCA9IGZvcm1hdC5yZXBsYWNlKCdhJywgJycpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChhYnMgPj0gTWF0aC5wb3coMTAsIDEyKSAmJiAhYWJickZvcmNlIHx8IGFiYnJUKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHRyaWxsaW9uXG4gICAgICAgICAgICAgICAgICAgIGFiYnIgPSBhYmJyICsgbGFuZ3VhZ2VzW2N1cnJlbnRMYW5ndWFnZV0uYWJicmV2aWF0aW9ucy50cmlsbGlvbjtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZSAvIE1hdGgucG93KDEwLCAxMik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChhYnMgPCBNYXRoLnBvdygxMCwgMTIpICYmIGFicyA+PSBNYXRoLnBvdygxMCwgOSkgJiYgIWFiYnJGb3JjZSB8fCBhYmJyQikge1xuICAgICAgICAgICAgICAgICAgICAvLyBiaWxsaW9uXG4gICAgICAgICAgICAgICAgICAgIGFiYnIgPSBhYmJyICsgbGFuZ3VhZ2VzW2N1cnJlbnRMYW5ndWFnZV0uYWJicmV2aWF0aW9ucy5iaWxsaW9uO1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlIC8gTWF0aC5wb3coMTAsIDkpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYWJzIDwgTWF0aC5wb3coMTAsIDkpICYmIGFicyA+PSBNYXRoLnBvdygxMCwgNikgJiYgIWFiYnJGb3JjZSB8fCBhYmJyTSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBtaWxsaW9uXG4gICAgICAgICAgICAgICAgICAgIGFiYnIgPSBhYmJyICsgbGFuZ3VhZ2VzW2N1cnJlbnRMYW5ndWFnZV0uYWJicmV2aWF0aW9ucy5taWxsaW9uO1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlIC8gTWF0aC5wb3coMTAsIDYpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYWJzIDwgTWF0aC5wb3coMTAsIDYpICYmIGFicyA+PSBNYXRoLnBvdygxMCwgMykgJiYgIWFiYnJGb3JjZSB8fCBhYmJySykge1xuICAgICAgICAgICAgICAgICAgICAvLyB0aG91c2FuZFxuICAgICAgICAgICAgICAgICAgICBhYmJyID0gYWJiciArIGxhbmd1YWdlc1tjdXJyZW50TGFuZ3VhZ2VdLmFiYnJldmlhdGlvbnMudGhvdXNhbmQ7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUgLyBNYXRoLnBvdygxMCwgMyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBzZWUgaWYgd2UgYXJlIGZvcm1hdHRpbmcgYnl0ZXNcbiAgICAgICAgICAgIGlmIChmb3JtYXQuaW5kZXhPZignYicpID4gLTEpIHtcbiAgICAgICAgICAgICAgICAvLyBjaGVjayBmb3Igc3BhY2UgYmVmb3JlXG4gICAgICAgICAgICAgICAgaWYgKGZvcm1hdC5pbmRleE9mKCcgYicpID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgYnl0ZXMgPSAnICc7XG4gICAgICAgICAgICAgICAgICAgIGZvcm1hdCA9IGZvcm1hdC5yZXBsYWNlKCcgYicsICcnKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBmb3JtYXQgPSBmb3JtYXQucmVwbGFjZSgnYicsICcnKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBmb3IgKHBvd2VyID0gMDsgcG93ZXIgPD0gc3VmZml4ZXMubGVuZ3RoOyBwb3dlcisrKSB7XG4gICAgICAgICAgICAgICAgICAgIG1pbiA9IE1hdGgucG93KDEwMjQsIHBvd2VyKTtcbiAgICAgICAgICAgICAgICAgICAgbWF4ID0gTWF0aC5wb3coMTAyNCwgcG93ZXIrMSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlID49IG1pbiAmJiB2YWx1ZSA8IG1heCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnl0ZXMgPSBieXRlcyArIHN1ZmZpeGVzW3Bvd2VyXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtaW4gPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZSAvIG1pbjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBzZWUgaWYgb3JkaW5hbCBpcyB3YW50ZWRcbiAgICAgICAgICAgIGlmIChmb3JtYXQuaW5kZXhPZignbycpID4gLTEpIHtcbiAgICAgICAgICAgICAgICAvLyBjaGVjayBmb3Igc3BhY2UgYmVmb3JlXG4gICAgICAgICAgICAgICAgaWYgKGZvcm1hdC5pbmRleE9mKCcgbycpID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgb3JkID0gJyAnO1xuICAgICAgICAgICAgICAgICAgICBmb3JtYXQgPSBmb3JtYXQucmVwbGFjZSgnIG8nLCAnJyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZm9ybWF0ID0gZm9ybWF0LnJlcGxhY2UoJ28nLCAnJyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgb3JkID0gb3JkICsgbGFuZ3VhZ2VzW2N1cnJlbnRMYW5ndWFnZV0ub3JkaW5hbCh2YWx1ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChmb3JtYXQuaW5kZXhPZignWy5dJykgPiAtMSkge1xuICAgICAgICAgICAgICAgIG9wdERlYyA9IHRydWU7XG4gICAgICAgICAgICAgICAgZm9ybWF0ID0gZm9ybWF0LnJlcGxhY2UoJ1suXScsICcuJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHcgPSB2YWx1ZS50b1N0cmluZygpLnNwbGl0KCcuJylbMF07XG4gICAgICAgICAgICBwcmVjaXNpb24gPSBmb3JtYXQuc3BsaXQoJy4nKVsxXTtcbiAgICAgICAgICAgIHRob3VzYW5kcyA9IGZvcm1hdC5pbmRleE9mKCcsJyk7XG5cbiAgICAgICAgICAgIGlmIChwcmVjaXNpb24pIHtcbiAgICAgICAgICAgICAgICBpZiAocHJlY2lzaW9uLmluZGV4T2YoJ1snKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIHByZWNpc2lvbiA9IHByZWNpc2lvbi5yZXBsYWNlKCddJywgJycpO1xuICAgICAgICAgICAgICAgICAgICBwcmVjaXNpb24gPSBwcmVjaXNpb24uc3BsaXQoJ1snKTtcbiAgICAgICAgICAgICAgICAgICAgZCA9IHRvRml4ZWQodmFsdWUsIChwcmVjaXNpb25bMF0ubGVuZ3RoICsgcHJlY2lzaW9uWzFdLmxlbmd0aCksIHJvdW5kaW5nRnVuY3Rpb24sIHByZWNpc2lvblsxXS5sZW5ndGgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGQgPSB0b0ZpeGVkKHZhbHVlLCBwcmVjaXNpb24ubGVuZ3RoLCByb3VuZGluZ0Z1bmN0aW9uKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB3ID0gZC5zcGxpdCgnLicpWzBdO1xuXG4gICAgICAgICAgICAgICAgaWYgKGQuc3BsaXQoJy4nKVsxXS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgZCA9IGxhbmd1YWdlc1tjdXJyZW50TGFuZ3VhZ2VdLmRlbGltaXRlcnMuZGVjaW1hbCArIGQuc3BsaXQoJy4nKVsxXTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBkID0gJyc7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKG9wdERlYyAmJiBOdW1iZXIoZC5zbGljZSgxKSkgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgZCA9ICcnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdyA9IHRvRml4ZWQodmFsdWUsIG51bGwsIHJvdW5kaW5nRnVuY3Rpb24pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBmb3JtYXQgbnVtYmVyXG4gICAgICAgICAgICBpZiAody5pbmRleE9mKCctJykgPiAtMSkge1xuICAgICAgICAgICAgICAgIHcgPSB3LnNsaWNlKDEpO1xuICAgICAgICAgICAgICAgIG5lZyA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aG91c2FuZHMgPiAtMSkge1xuICAgICAgICAgICAgICAgIHcgPSB3LnRvU3RyaW5nKCkucmVwbGFjZSgvKFxcZCkoPz0oXFxkezN9KSsoPyFcXGQpKS9nLCAnJDEnICsgbGFuZ3VhZ2VzW2N1cnJlbnRMYW5ndWFnZV0uZGVsaW1pdGVycy50aG91c2FuZHMpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoZm9ybWF0LmluZGV4T2YoJy4nKSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHcgPSAnJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuICgobmVnUCAmJiBuZWcpID8gJygnIDogJycpICsgKCghbmVnUCAmJiBuZWcpID8gJy0nIDogJycpICsgKCghbmVnICYmIHNpZ25lZCkgPyAnKycgOiAnJykgKyB3ICsgZCArICgob3JkKSA/IG9yZCA6ICcnKSArICgoYWJicikgPyBhYmJyIDogJycpICsgKChieXRlcykgPyBieXRlcyA6ICcnKSArICgobmVnUCAmJiBuZWcpID8gJyknIDogJycpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICBUb3AgTGV2ZWwgRnVuY3Rpb25zXG4gICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgbnVtZXJhbCA9IGZ1bmN0aW9uIChpbnB1dCkge1xuICAgICAgICBpZiAobnVtZXJhbC5pc051bWVyYWwoaW5wdXQpKSB7XG4gICAgICAgICAgICBpbnB1dCA9IGlucHV0LnZhbHVlKCk7XG4gICAgICAgIH0gZWxzZSBpZiAoaW5wdXQgPT09IDAgfHwgdHlwZW9mIGlucHV0ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgaW5wdXQgPSAwO1xuICAgICAgICB9IGVsc2UgaWYgKCFOdW1iZXIoaW5wdXQpKSB7XG4gICAgICAgICAgICBpbnB1dCA9IG51bWVyYWwuZm4udW5mb3JtYXQoaW5wdXQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBOdW1lcmFsKE51bWJlcihpbnB1dCkpO1xuICAgIH07XG5cbiAgICAvLyB2ZXJzaW9uIG51bWJlclxuICAgIG51bWVyYWwudmVyc2lvbiA9IFZFUlNJT047XG5cbiAgICAvLyBjb21wYXJlIG51bWVyYWwgb2JqZWN0XG4gICAgbnVtZXJhbC5pc051bWVyYWwgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgIHJldHVybiBvYmogaW5zdGFuY2VvZiBOdW1lcmFsO1xuICAgIH07XG5cbiAgICAvLyBUaGlzIGZ1bmN0aW9uIHdpbGwgbG9hZCBsYW5ndWFnZXMgYW5kIHRoZW4gc2V0IHRoZSBnbG9iYWwgbGFuZ3VhZ2UuICBJZlxuICAgIC8vIG5vIGFyZ3VtZW50cyBhcmUgcGFzc2VkIGluLCBpdCB3aWxsIHNpbXBseSByZXR1cm4gdGhlIGN1cnJlbnQgZ2xvYmFsXG4gICAgLy8gbGFuZ3VhZ2Uga2V5LlxuICAgIG51bWVyYWwubGFuZ3VhZ2UgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZXMpIHtcbiAgICAgICAgaWYgKCFrZXkpIHtcbiAgICAgICAgICAgIHJldHVybiBjdXJyZW50TGFuZ3VhZ2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoa2V5ICYmICF2YWx1ZXMpIHtcbiAgICAgICAgICAgIGlmKCFsYW5ndWFnZXNba2V5XSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBsYW5ndWFnZSA6ICcgKyBrZXkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY3VycmVudExhbmd1YWdlID0ga2V5O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHZhbHVlcyB8fCAhbGFuZ3VhZ2VzW2tleV0pIHtcbiAgICAgICAgICAgIGxvYWRMYW5ndWFnZShrZXksIHZhbHVlcyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbnVtZXJhbDtcbiAgICB9O1xuICAgIFxuICAgIC8vIFRoaXMgZnVuY3Rpb24gcHJvdmlkZXMgYWNjZXNzIHRvIHRoZSBsb2FkZWQgbGFuZ3VhZ2UgZGF0YS4gIElmXG4gICAgLy8gbm8gYXJndW1lbnRzIGFyZSBwYXNzZWQgaW4sIGl0IHdpbGwgc2ltcGx5IHJldHVybiB0aGUgY3VycmVudFxuICAgIC8vIGdsb2JhbCBsYW5ndWFnZSBvYmplY3QuXG4gICAgbnVtZXJhbC5sYW5ndWFnZURhdGEgPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIGlmICgha2V5KSB7XG4gICAgICAgICAgICByZXR1cm4gbGFuZ3VhZ2VzW2N1cnJlbnRMYW5ndWFnZV07XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGlmICghbGFuZ3VhZ2VzW2tleV0pIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBsYW5ndWFnZSA6ICcgKyBrZXkpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gbGFuZ3VhZ2VzW2tleV07XG4gICAgfTtcblxuICAgIG51bWVyYWwubGFuZ3VhZ2UoJ2VuJywge1xuICAgICAgICBkZWxpbWl0ZXJzOiB7XG4gICAgICAgICAgICB0aG91c2FuZHM6ICcsJyxcbiAgICAgICAgICAgIGRlY2ltYWw6ICcuJ1xuICAgICAgICB9LFxuICAgICAgICBhYmJyZXZpYXRpb25zOiB7XG4gICAgICAgICAgICB0aG91c2FuZDogJ2snLFxuICAgICAgICAgICAgbWlsbGlvbjogJ20nLFxuICAgICAgICAgICAgYmlsbGlvbjogJ2InLFxuICAgICAgICAgICAgdHJpbGxpb246ICd0J1xuICAgICAgICB9LFxuICAgICAgICBvcmRpbmFsOiBmdW5jdGlvbiAobnVtYmVyKSB7XG4gICAgICAgICAgICB2YXIgYiA9IG51bWJlciAlIDEwO1xuICAgICAgICAgICAgcmV0dXJuICh+fiAobnVtYmVyICUgMTAwIC8gMTApID09PSAxKSA/ICd0aCcgOlxuICAgICAgICAgICAgICAgIChiID09PSAxKSA/ICdzdCcgOlxuICAgICAgICAgICAgICAgIChiID09PSAyKSA/ICduZCcgOlxuICAgICAgICAgICAgICAgIChiID09PSAzKSA/ICdyZCcgOiAndGgnO1xuICAgICAgICB9LFxuICAgICAgICBjdXJyZW5jeToge1xuICAgICAgICAgICAgc3ltYm9sOiAnJCdcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgbnVtZXJhbC56ZXJvRm9ybWF0ID0gZnVuY3Rpb24gKGZvcm1hdCkge1xuICAgICAgICB6ZXJvRm9ybWF0ID0gdHlwZW9mKGZvcm1hdCkgPT09ICdzdHJpbmcnID8gZm9ybWF0IDogbnVsbDtcbiAgICB9O1xuXG4gICAgbnVtZXJhbC5kZWZhdWx0Rm9ybWF0ID0gZnVuY3Rpb24gKGZvcm1hdCkge1xuICAgICAgICBkZWZhdWx0Rm9ybWF0ID0gdHlwZW9mKGZvcm1hdCkgPT09ICdzdHJpbmcnID8gZm9ybWF0IDogJzAuMCc7XG4gICAgfTtcblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgSGVscGVyc1xuICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgIGZ1bmN0aW9uIGxvYWRMYW5ndWFnZShrZXksIHZhbHVlcykge1xuICAgICAgICBsYW5ndWFnZXNba2V5XSA9IHZhbHVlcztcbiAgICB9XG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgIEZsb2F0aW5nLXBvaW50IGhlbHBlcnNcbiAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAvLyBUaGUgZmxvYXRpbmctcG9pbnQgaGVscGVyIGZ1bmN0aW9ucyBhbmQgaW1wbGVtZW50YXRpb25cbiAgICAvLyBib3Jyb3dzIGhlYXZpbHkgZnJvbSBzaW5mdWwuanM6IGh0dHA6Ly9ndWlwbi5naXRodWIuaW8vc2luZnVsLmpzL1xuXG4gICAgLyoqXG4gICAgICogQXJyYXkucHJvdG90eXBlLnJlZHVjZSBmb3IgYnJvd3NlcnMgdGhhdCBkb24ndCBzdXBwb3J0IGl0XG4gICAgICogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvQXJyYXkvUmVkdWNlI0NvbXBhdGliaWxpdHlcbiAgICAgKi9cbiAgICBpZiAoJ2Z1bmN0aW9uJyAhPT0gdHlwZW9mIEFycmF5LnByb3RvdHlwZS5yZWR1Y2UpIHtcbiAgICAgICAgQXJyYXkucHJvdG90eXBlLnJlZHVjZSA9IGZ1bmN0aW9uIChjYWxsYmFjaywgb3B0X2luaXRpYWxWYWx1ZSkge1xuICAgICAgICAgICAgJ3VzZSBzdHJpY3QnO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAobnVsbCA9PT0gdGhpcyB8fCAndW5kZWZpbmVkJyA9PT0gdHlwZW9mIHRoaXMpIHtcbiAgICAgICAgICAgICAgICAvLyBBdCB0aGUgbW9tZW50IGFsbCBtb2Rlcm4gYnJvd3NlcnMsIHRoYXQgc3VwcG9ydCBzdHJpY3QgbW9kZSwgaGF2ZVxuICAgICAgICAgICAgICAgIC8vIG5hdGl2ZSBpbXBsZW1lbnRhdGlvbiBvZiBBcnJheS5wcm90b3R5cGUucmVkdWNlLiBGb3IgaW5zdGFuY2UsIElFOFxuICAgICAgICAgICAgICAgIC8vIGRvZXMgbm90IHN1cHBvcnQgc3RyaWN0IG1vZGUsIHNvIHRoaXMgY2hlY2sgaXMgYWN0dWFsbHkgdXNlbGVzcy5cbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcnJheS5wcm90b3R5cGUucmVkdWNlIGNhbGxlZCBvbiBudWxsIG9yIHVuZGVmaW5lZCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoJ2Z1bmN0aW9uJyAhPT0gdHlwZW9mIGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihjYWxsYmFjayArICcgaXMgbm90IGEgZnVuY3Rpb24nKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGluZGV4LFxuICAgICAgICAgICAgICAgIHZhbHVlLFxuICAgICAgICAgICAgICAgIGxlbmd0aCA9IHRoaXMubGVuZ3RoID4+PiAwLFxuICAgICAgICAgICAgICAgIGlzVmFsdWVTZXQgPSBmYWxzZTtcblxuICAgICAgICAgICAgaWYgKDEgPCBhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBvcHRfaW5pdGlhbFZhbHVlO1xuICAgICAgICAgICAgICAgIGlzVmFsdWVTZXQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IgKGluZGV4ID0gMDsgbGVuZ3RoID4gaW5kZXg7ICsraW5kZXgpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5oYXNPd25Qcm9wZXJ0eShpbmRleCkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzVmFsdWVTZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gY2FsbGJhY2sodmFsdWUsIHRoaXNbaW5kZXhdLCBpbmRleCwgdGhpcyk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHRoaXNbaW5kZXhdO1xuICAgICAgICAgICAgICAgICAgICAgICAgaXNWYWx1ZVNldCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghaXNWYWx1ZVNldCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1JlZHVjZSBvZiBlbXB0eSBhcnJheSB3aXRoIG5vIGluaXRpYWwgdmFsdWUnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIFxuICAgIC8qKlxuICAgICAqIENvbXB1dGVzIHRoZSBtdWx0aXBsaWVyIG5lY2Vzc2FyeSB0byBtYWtlIHggPj0gMSxcbiAgICAgKiBlZmZlY3RpdmVseSBlbGltaW5hdGluZyBtaXNjYWxjdWxhdGlvbnMgY2F1c2VkIGJ5XG4gICAgICogZmluaXRlIHByZWNpc2lvbi5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBtdWx0aXBsaWVyKHgpIHtcbiAgICAgICAgdmFyIHBhcnRzID0geC50b1N0cmluZygpLnNwbGl0KCcuJyk7XG4gICAgICAgIGlmIChwYXJ0cy5sZW5ndGggPCAyKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gTWF0aC5wb3coMTAsIHBhcnRzWzFdLmxlbmd0aCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2l2ZW4gYSB2YXJpYWJsZSBudW1iZXIgb2YgYXJndW1lbnRzLCByZXR1cm5zIHRoZSBtYXhpbXVtXG4gICAgICogbXVsdGlwbGllciB0aGF0IG11c3QgYmUgdXNlZCB0byBub3JtYWxpemUgYW4gb3BlcmF0aW9uIGludm9sdmluZ1xuICAgICAqIGFsbCBvZiB0aGVtLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGNvcnJlY3Rpb25GYWN0b3IoKSB7XG4gICAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICAgICAgcmV0dXJuIGFyZ3MucmVkdWNlKGZ1bmN0aW9uIChwcmV2LCBuZXh0KSB7XG4gICAgICAgICAgICB2YXIgbXAgPSBtdWx0aXBsaWVyKHByZXYpLFxuICAgICAgICAgICAgICAgIG1uID0gbXVsdGlwbGllcihuZXh0KTtcbiAgICAgICAgcmV0dXJuIG1wID4gbW4gPyBtcCA6IG1uO1xuICAgICAgICB9LCAtSW5maW5pdHkpO1xuICAgIH0gICAgICAgIFxuXG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgIE51bWVyYWwgUHJvdG90eXBlXG4gICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5cbiAgICBudW1lcmFsLmZuID0gTnVtZXJhbC5wcm90b3R5cGUgPSB7XG5cbiAgICAgICAgY2xvbmUgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVtZXJhbCh0aGlzKTtcbiAgICAgICAgfSxcblxuICAgICAgICBmb3JtYXQgOiBmdW5jdGlvbiAoaW5wdXRTdHJpbmcsIHJvdW5kaW5nRnVuY3Rpb24pIHtcbiAgICAgICAgICAgIHJldHVybiBmb3JtYXROdW1lcmFsKHRoaXMsIFxuICAgICAgICAgICAgICAgICAgaW5wdXRTdHJpbmcgPyBpbnB1dFN0cmluZyA6IGRlZmF1bHRGb3JtYXQsIFxuICAgICAgICAgICAgICAgICAgKHJvdW5kaW5nRnVuY3Rpb24gIT09IHVuZGVmaW5lZCkgPyByb3VuZGluZ0Z1bmN0aW9uIDogTWF0aC5yb3VuZFxuICAgICAgICAgICAgICApO1xuICAgICAgICB9LFxuXG4gICAgICAgIHVuZm9ybWF0IDogZnVuY3Rpb24gKGlucHV0U3RyaW5nKSB7XG4gICAgICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGlucHV0U3RyaW5nKSA9PT0gJ1tvYmplY3QgTnVtYmVyXScpIHsgXG4gICAgICAgICAgICAgICAgcmV0dXJuIGlucHV0U3RyaW5nOyBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB1bmZvcm1hdE51bWVyYWwodGhpcywgaW5wdXRTdHJpbmcgPyBpbnB1dFN0cmluZyA6IGRlZmF1bHRGb3JtYXQpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHZhbHVlIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICAgICAgICB9LFxuXG4gICAgICAgIHZhbHVlT2YgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdmFsdWU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0IDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLl92YWx1ZSA9IE51bWJlcih2YWx1ZSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcblxuICAgICAgICBhZGQgOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIHZhciBjb3JyRmFjdG9yID0gY29ycmVjdGlvbkZhY3Rvci5jYWxsKG51bGwsIHRoaXMuX3ZhbHVlLCB2YWx1ZSk7XG4gICAgICAgICAgICBmdW5jdGlvbiBjYmFjayhhY2N1bSwgY3VyciwgY3VyckksIE8pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYWNjdW0gKyBjb3JyRmFjdG9yICogY3VycjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX3ZhbHVlID0gW3RoaXMuX3ZhbHVlLCB2YWx1ZV0ucmVkdWNlKGNiYWNrLCAwKSAvIGNvcnJGYWN0b3I7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcblxuICAgICAgICBzdWJ0cmFjdCA6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgdmFyIGNvcnJGYWN0b3IgPSBjb3JyZWN0aW9uRmFjdG9yLmNhbGwobnVsbCwgdGhpcy5fdmFsdWUsIHZhbHVlKTtcbiAgICAgICAgICAgIGZ1bmN0aW9uIGNiYWNrKGFjY3VtLCBjdXJyLCBjdXJySSwgTykge1xuICAgICAgICAgICAgICAgIHJldHVybiBhY2N1bSAtIGNvcnJGYWN0b3IgKiBjdXJyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fdmFsdWUgPSBbdmFsdWVdLnJlZHVjZShjYmFjaywgdGhpcy5fdmFsdWUgKiBjb3JyRmFjdG9yKSAvIGNvcnJGYWN0b3I7ICAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcblxuICAgICAgICBtdWx0aXBseSA6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgZnVuY3Rpb24gY2JhY2soYWNjdW0sIGN1cnIsIGN1cnJJLCBPKSB7XG4gICAgICAgICAgICAgICAgdmFyIGNvcnJGYWN0b3IgPSBjb3JyZWN0aW9uRmFjdG9yKGFjY3VtLCBjdXJyKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gKGFjY3VtICogY29yckZhY3RvcikgKiAoY3VyciAqIGNvcnJGYWN0b3IpIC9cbiAgICAgICAgICAgICAgICAgICAgKGNvcnJGYWN0b3IgKiBjb3JyRmFjdG9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX3ZhbHVlID0gW3RoaXMuX3ZhbHVlLCB2YWx1ZV0ucmVkdWNlKGNiYWNrLCAxKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9LFxuXG4gICAgICAgIGRpdmlkZSA6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgZnVuY3Rpb24gY2JhY2soYWNjdW0sIGN1cnIsIGN1cnJJLCBPKSB7XG4gICAgICAgICAgICAgICAgdmFyIGNvcnJGYWN0b3IgPSBjb3JyZWN0aW9uRmFjdG9yKGFjY3VtLCBjdXJyKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gKGFjY3VtICogY29yckZhY3RvcikgLyAoY3VyciAqIGNvcnJGYWN0b3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fdmFsdWUgPSBbdGhpcy5fdmFsdWUsIHZhbHVlXS5yZWR1Y2UoY2JhY2spOyAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZGlmZmVyZW5jZSA6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIE1hdGguYWJzKG51bWVyYWwodGhpcy5fdmFsdWUpLnN1YnRyYWN0KHZhbHVlKS52YWx1ZSgpKTtcbiAgICAgICAgfVxuXG4gICAgfTtcblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgRXhwb3NpbmcgTnVtZXJhbFxuICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgIC8vIENvbW1vbkpTIG1vZHVsZSBpcyBkZWZpbmVkXG4gICAgaWYgKGhhc01vZHVsZSkge1xuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IG51bWVyYWw7XG4gICAgfVxuXG4gICAgLypnbG9iYWwgZW5kZXI6ZmFsc2UgKi9cbiAgICBpZiAodHlwZW9mIGVuZGVyID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAvLyBoZXJlLCBgdGhpc2AgbWVhbnMgYHdpbmRvd2AgaW4gdGhlIGJyb3dzZXIsIG9yIGBnbG9iYWxgIG9uIHRoZSBzZXJ2ZXJcbiAgICAgICAgLy8gYWRkIGBudW1lcmFsYCBhcyBhIGdsb2JhbCBvYmplY3QgdmlhIGEgc3RyaW5nIGlkZW50aWZpZXIsXG4gICAgICAgIC8vIGZvciBDbG9zdXJlIENvbXBpbGVyICdhZHZhbmNlZCcgbW9kZVxuICAgICAgICB0aGlzWydudW1lcmFsJ10gPSBudW1lcmFsO1xuICAgIH1cblxuICAgIC8qZ2xvYmFsIGRlZmluZTpmYWxzZSAqL1xuICAgIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAgICAgZGVmaW5lKFtdLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVtZXJhbDtcbiAgICAgICAgfSk7XG4gICAgfVxufSkuY2FsbCh0aGlzKTtcbiIsImltcG9ydCBUaW1lciBmcm9tICd1aS90aW1lcic7XG5cbmxldCBfbGlzdGVuZXJzID0gU3ltYm9sKCksXG5cdF9jYW5jZWwgPSBTeW1ib2woKTtcblxuY2xhc3MgU291cmNlIHtcblx0Y29uc3RydWN0b3IoY2FsbGJhY2spIHtcblx0XHQvLyBUT0RPLCByZXBsYWNlIHdpdGggTWFwIG9yIFdlYWtNYXA/XG5cdFx0dGhpc1tfbGlzdGVuZXJzXSA9IFtdO1xuXHRcdGxldCBzaW5rID0gKHZhbHVlKSA9PiB7XG5cdFx0XHRUaW1lci5pbW1lZGlhdGUoKCkgPT4ge1xuXHRcdFx0XHR0aGlzW19saXN0ZW5lcnNdLm1hcCjGkiA9PiDGkih2YWx1ZSkpO1xuXHRcdFx0fSk7XG5cdFx0fTtcblx0XHRjYWxsYmFjayhzaW5rKTtcblx0fVxuXHRjYW5jZWwoKSB7XG5cdFx0dGhpc1tfbGlzdGVuZXJzXSA9IFtdO1xuXHR9XG5cdGNhbmNlbE9uKHNvdXJjZSkge1xuXHRcdGxldCDGkjtcblx0XHTGkiA9ICgpID0+IHtcblx0XHRcdHNvdXJjZS51bnN1YnNjcmliZSjGkik7XG5cdFx0XHR0aGlzLmNhbmNlbCgpO1xuXHRcdH07XG5cdFx0c291cmNlLnN1YnNjcmliZSjGkik7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblx0c3Vic2NyaWJlKMaSKSB7XG5cdFx0dGhpc1tfbGlzdGVuZXJzXS5wdXNoKMaSKTtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXHR1bnN1YnNjcmliZSjGkikge1xuXHRcdHRoaXNbX2xpc3RlbmVyc10uc3BsaWNlKHRoaXNbX2xpc3RlbmVyc10uaW5kZXhPZijGkiksIDEpO1xuXHR9XG5cdG1hcCjGkikge1xuXHRcdHJldHVybiBTdHJlYW0ubWFwKHRoaXMsIMaSKTtcblx0fVxuXHRmaWx0ZXIoxpIpIHtcblx0XHRyZXR1cm4gU3RyZWFtLmZpbHRlcih0aGlzLCDGkik7XG5cdH1cblx0dW5pcXVlKCkge1xuXHRcdHJldHVybiBTdHJlYW0udW5pcXVlKHRoaXMpO1xuXHR9XG5cdGxvZyhwcmVmaXgpIHtcblx0XHRyZXR1cm4gU3RyZWFtLmxvZyh0aGlzLCBwcmVmaXgpO1xuXHR9XG5cdHRvQm9vbCgpIHtcblx0XHRyZXR1cm4gU3RyZWFtLnRvQm9vbCh0aGlzKTtcblx0fVxuXHRuZWdhdGUoKSB7XG5cdFx0cmV0dXJuIFN0cmVhbS5uZWdhdGUodGhpcyk7XG5cdH1cblx0emlwKC4uLm90aGVycykge1xuXHRcdHJldHVybiBTdHJlYW0uemlwKHRoaXMsIC4uLm90aGVycyk7XG5cdH1cblx0c3ByZWFkKMaSKSB7XG5cdFx0cmV0dXJuIFN0cmVhbS5zcHJlYWQodGhpcywgxpIpO1xuXHR9XG5cdGZsYXRNYXAoKSB7XG5cdFx0cmV0dXJuIFN0cmVhbS5mbGF0TWFwKHRoaXMpO1xuXHR9XG5cdG1lcmdlKC4uLm90aGVycykge1xuXHRcdHJldHVybiBTdHJlYW0ubWVyZ2UodGhpcywgLi4ub3RoZXJzKTtcblx0fVxuXHRyZWR1Y2UoYWNjLCDGkikge1xuXHRcdHJldHVybiBTdHJlYW0ucmVkdWNlKHRoaXMsIGFjYywgxpIpO1xuXHR9XG5cdGZlZWQoZGVzdFZhbHVlKSB7XG5cdFx0cmV0dXJuIFN0cmVhbS5mZWVkKHRoaXMsIGRlc3RWYWx1ZSk7XG5cdH1cblx0d3JhcCjGkikge1xuXHRcdMaSKHRoaXMpO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG59XG5cbmNsYXNzIFB1c2hTb3VyY2UgZXh0ZW5kcyBTb3VyY2Uge1xuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRzdXBlcigoc2luaykgPT4gdGhpcy5wdXNoID0gc2luayk7XG5cdH1cbn1cblxuY2xhc3MgQ2FuY2VsYWJsZVNvdXJjZSBleHRlbmRzIFB1c2hTb3VyY2Uge1xuXHRjb25zdHJ1Y3RvcihjYW5jZWzGkikge1xuXHRcdHN1cGVyKCk7XG5cdFx0dGhpc1tfY2FuY2VsXSA9IGNhbmNlbMaSLmJpbmQodGhpcyk7XG5cdH1cblx0Y2FuY2VsKCkge1xuXHRcdHRoaXNbX2NhbmNlbF0oKTtcblx0XHRzdXBlcigpO1xuXHR9XG59XG5cbi8vIHNob3VsZCBJIHByb3BhZ2F0ZSB0aGUgY2FuY2VsIG1ldGhvZD9cbmxldCBTdHJlYW0gPSB7XG5cdHN1YnNjcmliZShzb3VyY2UsIMaSKSB7XG5cdFx0bGV0IGLGkixcblx0XHRcdHN0cmVhbSA9IG5ldyBDYW5jZWxhYmxlU291cmNlKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRzb3VyY2UudW5zdWJzY3JpYmUoYsaSKTtcblx0XHRcdH0pO1xuXHRcdGLGkiA9IMaSLmJpbmQobnVsbCwgc3RyZWFtKTtcblx0XHRzb3VyY2Uuc3Vic2NyaWJlKGLGkik7XG5cdFx0cmV0dXJuIHN0cmVhbTtcblx0fSxcblx0bWFwKHNvdXJjZSwgxpIpIHtcblx0XHRyZXR1cm4gdGhpcy5zdWJzY3JpYmUoc291cmNlLCAoc3RyZWFtLCB2YWx1ZSkgPT4gc3RyZWFtLnB1c2goxpIodmFsdWUpKSk7XG5cdH0sXG5cdGZpbHRlcihzb3VyY2UsIMaSKSB7XG5cdFx0cmV0dXJuIHRoaXMuc3Vic2NyaWJlKHNvdXJjZSwgKHN0cmVhbSwgdmFsdWUpID0+IHsgaWYoxpIodmFsdWUpKSBzdHJlYW0ucHVzaCh2YWx1ZSkgfSk7XG5cdH0sXG5cdHVuaXF1ZShzb3VyY2UpIHtcblx0XHRyZXR1cm4gdGhpcy5maWx0ZXIoc291cmNlLCAoZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgbGFzdDtcblx0XHRcdHJldHVybiBmdW5jdGlvbih2KSB7XG5cdFx0XHRcdGlmKGxhc3QgIT09IHYpIHtcblx0XHRcdFx0XHRsYXN0ID0gdjtcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFx0fSkoKSk7XG5cdH0sXG5cdHRvQm9vbChzb3VyY2UpIHtcblx0XHRyZXR1cm4gdGhpcy5tYXAoc291cmNlLCAodikgPT4gISF2KTtcblx0fSxcblx0bmVnYXRlKHNvdXJjZSkge1xuXHRcdHJldHVybiB0aGlzLm1hcChzb3VyY2UsICh2KSA9PiAhdik7XG5cdH0sXG5cdGxvZyhzb3VyY2UsIHByZWZpeCkge1xuXHRcdHJldHVybiB0aGlzLm1hcChzb3VyY2UsICh2KSA9PiB7XG5cdFx0XHRpZihwcmVmaXgpXG5cdFx0XHRcdGNvbnNvbGUubG9nKHByZWZpeCwgdik7XG5cdFx0XHRlbHNlXG5cdFx0XHRcdGNvbnNvbGUubG9nKHYpO1xuXHRcdFx0cmV0dXJuIHY7XG5cdFx0fSk7XG5cdH0sXG5cdHppcCguLi5zb3VyY2VzKSB7XG5cdFx0bGV0IGxlbmd0aCA9IHNvdXJjZXMubGVuZ3RoLFxuXHRcdFx0dW5zdWJzID0gW10sXG5cdFx0XHRzdHJlYW0gPSBuZXcgQ2FuY2VsYWJsZVNvdXJjZSgoKSA9PiB7IHVuc3Vicy5tYXAoKHNvdXJjZSwgaSkgPT4gc291cmNlc1tpXS51bnN1YnNjcmliZSh1bnN1YnNbaV0pKSB9KSxcblx0XHRcdHZhbHVlcyA9IG5ldyBBcnJheShsZW5ndGgpLFxuXHRcdFx0ZmxhZ3MgID0gbmV3IEFycmF5KGxlbmd0aCksXG5cdFx0XHR1cGRhdGUgPSAoKSA9PiB7XG5cdFx0XHRcdGlmKGZsYWdzLmZpbHRlcigodikgPT4gdikubGVuZ3RoID09PSBsZW5ndGgpIHtcblx0XHRcdFx0XHR1cGRhdGUgPSAoKSA9PiBzdHJlYW0ucHVzaCh2YWx1ZXMpO1xuXHRcdFx0XHRcdHVwZGF0ZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG5cdFx0XHQoKGkpID0+IHtcblx0XHRcdFx0c291cmNlc1tpXS5zdWJzY3JpYmUodW5zdWJzW2ldID0gKHYpID0+IHtcblx0XHRcdFx0XHR2YWx1ZXNbaV0gPSB2O1xuXHRcdFx0XHRcdGZsYWdzW2ldID0gdHJ1ZTtcblx0XHRcdFx0XHR1cGRhdGUoKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9KShpKTtcblx0XHR9XG5cdFx0cmV0dXJuIHN0cmVhbTtcblx0fSxcblx0c3ByZWFkKHNvdXJjZSwgxpIpIHtcblx0XHRyZXR1cm4gdGhpcy5zdWJzY3JpYmUoc291cmNlLCAoc3RyZWFtLCBhcnIpID0+IHN0cmVhbS5wdXNoKMaSLmFwcGx5KG51bGwsIGFycikpKTtcblx0fSxcblx0ZmxhdE1hcChzb3VyY2UpIHtcblx0XHRyZXR1cm4gdGhpcy5zdWJzY3JpYmUoc291cmNlLCAoc3RyZWFtLCBhcnIpID0+IHtcblx0XHRcdGZvcihsZXQgdiBpbiBhcnIpXG5cdFx0XHRcdHN0cmVhbS5wdXNoKHYpO1xuXHRcdH0pO1xuXHR9LFxuXHRtZXJnZSguLi5zb3VyY2VzKSB7XG5cdFx0bGV0IHN0cmVhbSxcblx0XHRcdMaSID0gKHYpID0+IHN0cmVhbS5wdXNoKHYpO1xuXHRcdHN0cmVhbSA9IG5ldyBDYW5jZWxhYmxlU291cmNlKCgpID0+IHtcblx0XHRcdHNvdXJjZXMubWFwKChzb3VyY2UpID0+IHNvdXJjZS51bnN1YnNjcmliZSjGkikpO1xuXHRcdH0pO1xuXHRcdHNvdXJjZXMubWFwKChzb3VyY2UpID0+IHNvdXJjZS5zdWJzY3JpYmUoxpIpKTtcblx0XHRyZXR1cm4gc3RyZWFtO1xuXHR9LFxuXHRpbnRlcnZhbChtcywgdmFsdWUpIHtcblx0XHRsZXQgaWQsXG5cdFx0XHRzdHJlYW0gPSBuZXcgQ2FuY2VsYWJsZVNvdXJjZShmdW5jdGlvbigpIHsgY2xlYXJJbnRlcnZhbChpZCk7IH0pO1xuXHRcdGlkID0gc2V0SW50ZXJ2YWwoKCkgPT4gc3RyZWFtLnB1c2godmFsdWUpLCBtcyk7XG5cdFx0cmV0dXJuIHN0cmVhbTtcblx0fSxcblx0ZGVsYXkobXMsIHZhbHVlKSB7XG5cdFx0bGV0IGlkLFxuXHRcdFx0c3RyZWFtID0gbmV3IENhbmNlbGFibGVTb3VyY2UoZnVuY3Rpb24oKSB7IGNsZWFyVGltZW91dChpZCk7IH0pO1xuXHRcdGlkID0gc2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHRzdHJlYW0ucHVzaCh2YWx1ZSk7XG5cdFx0XHQvLyBjYW5jZWwgbmVlZHMgdG8gaGFwcGVuIGFmdGVyIHRoZSBwdXNoIGlzIHJlYWxpemVkXG5cdFx0XHRUaW1lci5pbW1lZGlhdGUoc3RyZWFtLmNhbmNlbC5iaW5kKHN0cmVhbSkpO1xuXHRcdH0sIG1zKTtcblx0XHRyZXR1cm4gc3RyZWFtO1xuXHR9LFxuXHRyZWR1Y2Uoc291cmNlLCBhY2MsIMaSKSB7XG5cdFx0cmV0dXJuIHRoaXMuc3Vic2NyaWJlKHNvdXJjZSwgKHN0cmVhbSwgdmFsdWUpID0+IHN0cmVhbS5wdXNoKGFjYyA9IMaSKGFjYywgdmFsdWUpKSk7XG5cdH0sXG5cdGZlZWQoc291cmNlLCBkZXN0KSB7XG5cdFx0cmV0dXJuIHRoaXMuc3Vic2NyaWJlKHNvdXJjZSwgKHN0cmVhbSwgdmFsdWUpID0+IHtcblx0XHRcdHN0cmVhbS5wdXNoKHZhbHVlKTtcblx0XHRcdGRlc3QucHVzaCh2YWx1ZSk7XG5cdFx0fSk7XG5cdH0sXG5cdGZyb21BcnJheSh2YWx1ZXMpIHtcblx0XHRsZXQgc3RyZWFtID0gbmV3IFB1c2hTb3VyY2UoKTtcblx0XHR2YWx1ZXMubWFwKCh2KSA9PiBzdHJlYW0ucHVzaCh2KSk7XG5cdFx0cmV0dXJuIHN0cmVhbTtcblx0fSxcblx0c2VxdWVuY2UodmFsdWVzLCBpbnRlcnZhbCwgcmVwZWF0ID0gZmFsc2UpIHtcblx0XHRsZXQgaWQsXG5cdFx0XHRzdHJlYW0gPSBuZXcgQ2FuY2VsYWJsZVNvdXJjZShmdW5jdGlvbigpIHsgY2xlYXJJbnRlcnZhbChpZCk7IH0pLFxuXHRcdFx0aW5kZXggPSAwO1xuXG5cdFx0aWQgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG5cdFx0XHRpZihpbmRleCA9PT0gdmFsdWVzLmxlbmd0aCkge1xuXHRcdFx0XHRpZihyZXBlYXQpIHtcblx0XHRcdFx0XHRpbmRleCA9IDA7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Y2xlYXJJbnRlcnZhbChpZCk7XG5cdFx0XHRcdFx0dGhpcy5jYW5jZWwoKTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHN0cmVhbS5wdXNoKHZhbHVlc1tpbmRleCsrXSk7XG5cdFx0fSwgaW50ZXJ2YWwpO1xuXHRcdHJldHVybiBzdHJlYW07XG5cdH1cblx0Ly8gVE9ET1xuXHQvLyB1bnRpbCjGkilcblx0Ly8gdGFrZShuKVxuXHQvLyBza2lwKG4pXG5cdC8vIHRocm90dGxlXG5cdC8vIGZpZWxkKG5hbWUpXG5cdC8vIG1ldGhvZChuYW1lLCAuLi5hcmdzKVxufVxuXG5leHBvcnQgeyBTdHJlYW0sIFNvdXJjZSwgUHVzaFNvdXJjZSB9OyIsImltcG9ydCB7IFNvdXJjZSwgU3RyZWFtIH0gZnJvbSAnLi9zdHJlYW0nXG5cbnZhciBfdmFsdWUgPSBTeW1ib2woKSxcblx0X2RlZmF1bHRWYWx1ZSA9IFN5bWJvbCgpLFxuXHRfdXBkYXRlID0gU3ltYm9sKCk7XG5cbmV4cG9ydCBjbGFzcyBWYWx1ZSBleHRlbmRzIFNvdXJjZSB7XG5cdGNvbnN0cnVjdG9yKHZhbHVlLCBkZWZhdWx0VmFsdWUpIHtcblx0XHRsZXQgY2FsbGJhY2sgPSAoc2luaykgPT4ge1xuXHRcdFx0dGhpc1tfdXBkYXRlXSA9IHNpbms7XG5cdFx0fTtcblx0XHRzdXBlcihjYWxsYmFjayk7XG5cdFx0dGhpc1tfZGVmYXVsdFZhbHVlXSA9IGRlZmF1bHRWYWx1ZTtcblx0XHR0aGlzW192YWx1ZV0gPSB2YWx1ZTtcblx0fVxuXHRzdWJzY3JpYmUoxpIpIHtcblx0XHTGkih0aGlzW192YWx1ZV0pO1xuXHRcdHN1cGVyLnN1YnNjcmliZSjGkik7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblx0cHVzaCh2YWx1ZSkge1xuXHRcdGlmKHZhbHVlID09PSB0aGlzW192YWx1ZV0pXG5cdFx0XHRyZXR1cm47XG5cdFx0dGhpc1tfdmFsdWVdID0gdmFsdWU7XG5cdFx0dGhpc1tfdXBkYXRlXSh2YWx1ZSk7XG5cdH1cblx0Z2V0IHZhbHVlKCkge1xuXHRcdHJldHVybiB0aGlzW192YWx1ZV07XG5cdH1cblx0c2V0IHZhbHVlKHYpIHtcblx0XHR0aGlzLnB1c2godik7XG5cdH1cblx0Z2V0IGlzRGVmYXVsdCgpIHtcblx0XHRyZXR1cm4gdGhpc1tfdmFsdWVdID09PSB0aGlzW19kZWZhdWx0VmFsdWVdO1xuXHR9XG5cdHJlc2V0KCkge1xuXHRcdHRoaXMudmFsdWUgPSB0aGlzW19kZWZhdWx0VmFsdWVdO1xuXHR9XG59XG5cbmV4cG9ydCBjbGFzcyBTdHJpbmdWYWx1ZSBleHRlbmRzIFZhbHVlIHtcblx0Y29uc3RydWN0b3IodmFsdWUgPSBcIlwiLCBkZWZhdWx0VmFsdWUgPSB2YWx1ZSkge1xuXHRcdHN1cGVyKHZhbHVlLCBkZWZhdWx0VmFsdWUpO1xuXHR9XG5cdHB1c2godmFsdWUpIHtcblx0XHRzdXBlci5wdXNoKCh2YWx1ZSAmJiB2YWx1ZS50b1N0cmluZyAmJiB2YWx1ZS50b1N0cmluZygpKSB8fCAodmFsdWUgJiYgKFwiXCIgKyB2YWx1ZSkpIHx8IFwiXCIpO1xuXHR9XG59XG5cbmV4cG9ydCBjbGFzcyBCb29sVmFsdWUgZXh0ZW5kcyBWYWx1ZSB7XG5cdGNvbnN0cnVjdG9yKHZhbHVlID0gZmFsc2UsIGRlZmF1bHRWYWx1ZSA9IHZhbHVlKSB7XG5cdFx0c3VwZXIodmFsdWUsIGRlZmF1bHRWYWx1ZSk7XG5cdH1cblx0cHVzaCh2YWx1ZSkge1xuXHRcdHN1cGVyLnB1c2goISF2YWx1ZSk7XG5cdH1cblx0dG9nZ2xlKCkge1xuXHRcdHRoaXMucHVzaCghdGhpcy52YWx1ZSk7XG5cdH1cbn1cblxuZXhwb3J0IGNsYXNzIEZsb2F0VmFsdWUgZXh0ZW5kcyBWYWx1ZSB7XG5cdGNvbnN0cnVjdG9yKHZhbHVlID0gMC4wLCBkZWZhdWx0VmFsdWUgPSB2YWx1ZSkge1xuXHRcdHN1cGVyKHZhbHVlLCBkZWZhdWx0VmFsdWUpO1xuXHR9XG5cdHB1c2godmFsdWUpIHtcblx0XHRzdXBlci5wdXNoKCtuZXcgTnVtYmVyKHZhbHVlKSk7XG5cdH1cbn1cblxudmFyIGRlZmF1bHREYXRlID0gbmV3IERhdGUobnVsbCk7XG5leHBvcnQgY2xhc3MgRGF0ZVZhbHVlIGV4dGVuZHMgVmFsdWUge1xuXHRjb25zdHJ1Y3Rvcih2YWx1ZSA9IGRlZmF1bHREYXRlLCBkZWZhdWx0VmFsdWUgPSB2YWx1ZSkge1xuXHRcdHN1cGVyKHZhbHVlLCBkZWZhdWx0VmFsdWUpO1xuXHR9XG5cdHB1c2godmFsdWUpIHtcblx0XHRzdXBlci5wdXNoKG5ldyBEYXRlKHZhbHVlKSk7XG5cdH1cbn0iLCIvKlxuc3RyaW5nLmpzIC0gQ29weXJpZ2h0IChDKSAyMDEyLTIwMTMsIEpQIFJpY2hhcmRzb24gPGpwcmljaGFyZHNvbkBnbWFpbC5jb20+XG4qL1xuXG4hKGZ1bmN0aW9uKCkge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICB2YXIgVkVSU0lPTiA9ICcxLjguMCc7XG5cbiAgdmFyIEVOVElUSUVTID0ge307XG5cbi8vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vLyBBZGRlZCBhbiBpbml0aWFsaXplIGZ1bmN0aW9uIHdoaWNoIGlzIGVzc2VudGlhbGx5IHRoZSBjb2RlIGZyb20gdGhlIFNcbi8vIGNvbnN0cnVjdG9yLiAgTm93LCB0aGUgUyBjb25zdHJ1Y3RvciBjYWxscyB0aGlzIGFuZCBhIG5ldyBtZXRob2QgbmFtZWRcbi8vIHNldFZhbHVlIGNhbGxzIGl0IGFzIHdlbGwuICBUaGUgc2V0VmFsdWUgZnVuY3Rpb24gYWxsb3dzIGNvbnN0cnVjdG9ycyBmb3Jcbi8vIG1vZHVsZXMgdGhhdCBleHRlbmQgc3RyaW5nLmpzIHRvIHNldCB0aGUgaW5pdGlhbCB2YWx1ZSBvZiBhbiBvYmplY3Qgd2l0aG91dFxuLy8ga25vd2luZyB0aGUgaW50ZXJuYWwgd29ya2luZ3Mgb2Ygc3RyaW5nLmpzLlxuLy9cbi8vIEFsc28sIGFsbCBtZXRob2RzIHdoaWNoIHJldHVybiBhIG5ldyBTIG9iamVjdCBub3cgY2FsbDpcbi8vXG4vLyAgICAgIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3RvcihzKTtcbi8vXG4vLyBpbnN0ZWFkIG9mOlxuLy9cbi8vICAgICAgcmV0dXJuIG5ldyBTKHMpO1xuLy9cbi8vIFRoaXMgYWxsb3dzIGV4dGVuZGVkIG9iamVjdHMgdG8ga2VlcCB0aGVpciBwcm9wZXIgaW5zdGFuY2VPZiBhbmQgY29uc3RydWN0b3IuXG4vLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuXG4gIGZ1bmN0aW9uIGluaXRpYWxpemUgKG9iamVjdCwgcykge1xuICAgIGlmIChzICE9PSBudWxsICYmIHMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKHR5cGVvZiBzID09PSAnc3RyaW5nJylcbiAgICAgICAgb2JqZWN0LnMgPSBzO1xuICAgICAgZWxzZVxuICAgICAgICBvYmplY3QucyA9IHMudG9TdHJpbmcoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgb2JqZWN0LnMgPSBzOyAvL251bGwgb3IgdW5kZWZpbmVkXG4gICAgfVxuXG4gICAgb2JqZWN0Lm9yaWcgPSBzOyAvL29yaWdpbmFsIG9iamVjdCwgY3VycmVudGx5IG9ubHkgdXNlZCBieSB0b0NTVigpIGFuZCB0b0Jvb2xlYW4oKVxuXG4gICAgaWYgKHMgIT09IG51bGwgJiYgcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAob2JqZWN0Ll9fZGVmaW5lR2V0dGVyX18pIHtcbiAgICAgICAgb2JqZWN0Ll9fZGVmaW5lR2V0dGVyX18oJ2xlbmd0aCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiBvYmplY3Qucy5sZW5ndGg7XG4gICAgICAgIH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvYmplY3QubGVuZ3RoID0gcy5sZW5ndGg7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIG9iamVjdC5sZW5ndGggPSAtMTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBTKHMpIHtcbiAgXHRpbml0aWFsaXplKHRoaXMsIHMpO1xuICB9XG5cbiAgdmFyIF9fbnNwID0gU3RyaW5nLnByb3RvdHlwZTtcbiAgdmFyIF9fc3AgPSBTLnByb3RvdHlwZSA9IHtcblxuICAgIGJldHdlZW46IGZ1bmN0aW9uKGxlZnQsIHJpZ2h0KSB7XG4gICAgICB2YXIgcyA9IHRoaXMucztcbiAgICAgIHZhciBzdGFydFBvcyA9IHMuaW5kZXhPZihsZWZ0KTtcbiAgICAgIHZhciBlbmRQb3MgPSBzLmluZGV4T2YocmlnaHQsIHN0YXJ0UG9zICsgbGVmdC5sZW5ndGgpO1xuICAgICAgaWYgKGVuZFBvcyA9PSAtMSAmJiByaWdodCAhPSBudWxsKSBcbiAgICAgICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKCcnKVxuICAgICAgZWxzZSBpZiAoZW5kUG9zID09IC0xICYmIHJpZ2h0ID09IG51bGwpXG4gICAgICAgIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3RvcihzLnN1YnN0cmluZyhzdGFydFBvcyArIGxlZnQubGVuZ3RoKSlcbiAgICAgIGVsc2UgXG4gICAgICAgIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3RvcihzLnNsaWNlKHN0YXJ0UG9zICsgbGVmdC5sZW5ndGgsIGVuZFBvcykpO1xuICAgIH0sXG5cbiAgICAvLyMgbW9kaWZpZWQgc2xpZ2h0bHkgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vZXBlbGkvdW5kZXJzY29yZS5zdHJpbmdcbiAgICBjYW1lbGl6ZTogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcyA9IHRoaXMudHJpbSgpLnMucmVwbGFjZSgvKFxcLXxffFxccykrKC4pPy9nLCBmdW5jdGlvbihtYXRoYywgc2VwLCBjKSB7XG4gICAgICAgIHJldHVybiAoYyA/IGMudG9VcHBlckNhc2UoKSA6ICcnKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKHMpO1xuICAgIH0sXG5cbiAgICBjYXBpdGFsaXplOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3Rvcih0aGlzLnMuc3Vic3RyKDAsIDEpLnRvVXBwZXJDYXNlKCkgKyB0aGlzLnMuc3Vic3RyaW5nKDEpLnRvTG93ZXJDYXNlKCkpO1xuICAgIH0sXG5cbiAgICBjaGFyQXQ6IGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgICByZXR1cm4gdGhpcy5zLmNoYXJBdChpbmRleCk7XG4gICAgfSxcblxuICAgIGNob21wTGVmdDogZnVuY3Rpb24ocHJlZml4KSB7XG4gICAgICB2YXIgcyA9IHRoaXMucztcbiAgICAgIGlmIChzLmluZGV4T2YocHJlZml4KSA9PT0gMCkge1xuICAgICAgICAgcyA9IHMuc2xpY2UocHJlZml4Lmxlbmd0aCk7XG4gICAgICAgICByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3Iocyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgY2hvbXBSaWdodDogZnVuY3Rpb24oc3VmZml4KSB7XG4gICAgICBpZiAodGhpcy5lbmRzV2l0aChzdWZmaXgpKSB7XG4gICAgICAgIHZhciBzID0gdGhpcy5zO1xuICAgICAgICBzID0gcy5zbGljZSgwLCBzLmxlbmd0aCAtIHN1ZmZpeC5sZW5ndGgpO1xuICAgICAgICByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3Iocyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8jdGhhbmtzIEdvb2dsZVxuICAgIGNvbGxhcHNlV2hpdGVzcGFjZTogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcyA9IHRoaXMucy5yZXBsYWNlKC9bXFxzXFx4YTBdKy9nLCAnICcpLnJlcGxhY2UoL15cXHMrfFxccyskL2csICcnKTtcbiAgICAgIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3RvcihzKTtcbiAgICB9LFxuXG4gICAgY29udGFpbnM6IGZ1bmN0aW9uKHNzKSB7XG4gICAgICByZXR1cm4gdGhpcy5zLmluZGV4T2Yoc3MpID49IDA7XG4gICAgfSxcblxuICAgIGNvdW50OiBmdW5jdGlvbihzcykge1xuICAgICAgdmFyIGNvdW50ID0gMFxuICAgICAgICAsIHBvcyA9IHRoaXMucy5pbmRleE9mKHNzKVxuXG4gICAgICB3aGlsZSAocG9zID49IDApIHtcbiAgICAgICAgY291bnQgKz0gMVxuICAgICAgICBwb3MgPSB0aGlzLnMuaW5kZXhPZihzcywgcG9zICsgMSlcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGNvdW50XG4gICAgfSxcblxuICAgIC8vI21vZGlmaWVkIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL2VwZWxpL3VuZGVyc2NvcmUuc3RyaW5nXG4gICAgZGFzaGVyaXplOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBzID0gdGhpcy50cmltKCkucy5yZXBsYWNlKC9bX1xcc10rL2csICctJykucmVwbGFjZSgvKFtBLVpdKS9nLCAnLSQxJykucmVwbGFjZSgvLSsvZywgJy0nKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKHMpO1xuICAgIH0sXG5cbiAgICBkZWNvZGVIdG1sRW50aXRpZXM6IGZ1bmN0aW9uKCkgeyAvL2h0dHBzOi8vZ2l0aHViLmNvbS9zdWJzdGFjay9ub2RlLWVudC9ibG9iL21hc3Rlci9pbmRleC5qc1xuICAgICAgdmFyIHMgPSB0aGlzLnM7XG4gICAgICBzID0gcy5yZXBsYWNlKC8mIyhcXGQrKTs/L2csIGZ1bmN0aW9uIChfLCBjb2RlKSB7XG4gICAgICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKGNvZGUpO1xuICAgICAgfSlcbiAgICAgIC5yZXBsYWNlKC8mI1t4WF0oW0EtRmEtZjAtOV0rKTs/L2csIGZ1bmN0aW9uIChfLCBoZXgpIHtcbiAgICAgICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUocGFyc2VJbnQoaGV4LCAxNikpO1xuICAgICAgfSlcbiAgICAgIC5yZXBsYWNlKC8mKFteO1xcV10rOz8pL2csIGZ1bmN0aW9uIChtLCBlKSB7XG4gICAgICAgIHZhciBlZSA9IGUucmVwbGFjZSgvOyQvLCAnJyk7XG4gICAgICAgIHZhciB0YXJnZXQgPSBFTlRJVElFU1tlXSB8fCAoZS5tYXRjaCgvOyQvKSAmJiBFTlRJVElFU1tlZV0pO1xuICAgICAgICAgICAgXG4gICAgICAgIGlmICh0eXBlb2YgdGFyZ2V0ID09PSAnbnVtYmVyJykge1xuICAgICAgICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKHRhcmdldCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodHlwZW9mIHRhcmdldCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICByZXR1cm4gdGFyZ2V0O1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIHJldHVybiBtO1xuICAgICAgICB9XG4gICAgICB9KVxuXG4gICAgICByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3Iocyk7XG4gICAgfSxcblxuICAgIGVuZHNXaXRoOiBmdW5jdGlvbihzdWZmaXgpIHtcbiAgICAgIHZhciBsICA9IHRoaXMucy5sZW5ndGggLSBzdWZmaXgubGVuZ3RoO1xuICAgICAgcmV0dXJuIGwgPj0gMCAmJiB0aGlzLnMuaW5kZXhPZihzdWZmaXgsIGwpID09PSBsO1xuICAgIH0sXG5cbiAgICBlc2NhcGVIVE1MOiBmdW5jdGlvbigpIHsgLy9mcm9tIHVuZGVyc2NvcmUuc3RyaW5nXG4gICAgICByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3IodGhpcy5zLnJlcGxhY2UoL1smPD5cIiddL2csIGZ1bmN0aW9uKG0peyByZXR1cm4gJyYnICsgcmV2ZXJzZWRFc2NhcGVDaGFyc1ttXSArICc7JzsgfSkpO1xuICAgIH0sXG5cbiAgICBlbnN1cmVMZWZ0OiBmdW5jdGlvbihwcmVmaXgpIHtcbiAgICAgIHZhciBzID0gdGhpcy5zO1xuICAgICAgaWYgKHMuaW5kZXhPZihwcmVmaXgpID09PSAwKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKHByZWZpeCArIHMpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBlbnN1cmVSaWdodDogZnVuY3Rpb24oc3VmZml4KSB7XG4gICAgICB2YXIgcyA9IHRoaXMucztcbiAgICAgIGlmICh0aGlzLmVuZHNXaXRoKHN1ZmZpeCkpICB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKHMgKyBzdWZmaXgpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBodW1hbml6ZTogZnVuY3Rpb24oKSB7IC8vbW9kaWZpZWQgZnJvbSB1bmRlcnNjb3JlLnN0cmluZ1xuICAgICAgaWYgKHRoaXMucyA9PT0gbnVsbCB8fCB0aGlzLnMgPT09IHVuZGVmaW5lZClcbiAgICAgICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKCcnKVxuICAgICAgdmFyIHMgPSB0aGlzLnVuZGVyc2NvcmUoKS5yZXBsYWNlKC9faWQkLywnJykucmVwbGFjZSgvXy9nLCAnICcpLnRyaW0oKS5jYXBpdGFsaXplKClcbiAgICAgIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3RvcihzKVxuICAgIH0sXG5cbiAgICBpc0FscGhhOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiAhL1teYS16XFx4QzAtXFx4RkZdLy50ZXN0KHRoaXMucy50b0xvd2VyQ2FzZSgpKTtcbiAgICB9LFxuXG4gICAgaXNBbHBoYU51bWVyaWM6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuICEvW14wLTlhLXpcXHhDMC1cXHhGRl0vLnRlc3QodGhpcy5zLnRvTG93ZXJDYXNlKCkpO1xuICAgIH0sXG5cbiAgICBpc0VtcHR5OiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLnMgPT09IG51bGwgfHwgdGhpcy5zID09PSB1bmRlZmluZWQgPyB0cnVlIDogL15bXFxzXFx4YTBdKiQvLnRlc3QodGhpcy5zKTtcbiAgICB9LFxuXG4gICAgaXNMb3dlcjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5pc0FscGhhKCkgJiYgdGhpcy5zLnRvTG93ZXJDYXNlKCkgPT09IHRoaXMucztcbiAgICB9LFxuXG4gICAgaXNOdW1lcmljOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiAhL1teMC05XS8udGVzdCh0aGlzLnMpO1xuICAgIH0sXG5cbiAgICBpc1VwcGVyOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLmlzQWxwaGEoKSAmJiB0aGlzLnMudG9VcHBlckNhc2UoKSA9PT0gdGhpcy5zO1xuICAgIH0sXG5cbiAgICBsZWZ0OiBmdW5jdGlvbihOKSB7XG4gICAgICBpZiAoTiA+PSAwKSB7XG4gICAgICAgIHZhciBzID0gdGhpcy5zLnN1YnN0cigwLCBOKTtcbiAgICAgICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKHMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmlnaHQoLU4pO1xuICAgICAgfVxuICAgIH0sXG4gICAgXG4gICAgbGluZXM6IGZ1bmN0aW9uKCkgeyAvL2NvbnZlcnQgd2luZG93cyBuZXdsaW5lcyB0byB1bml4IG5ld2xpbmVzIHRoZW4gY29udmVydCB0byBhbiBBcnJheSBvZiBsaW5lc1xuICAgICAgcmV0dXJuIHRoaXMucmVwbGFjZUFsbCgnXFxyXFxuJywgJ1xcbicpLnMuc3BsaXQoJ1xcbicpO1xuICAgIH0sXG5cbiAgICBwYWQ6IGZ1bmN0aW9uKGxlbiwgY2gpIHsgLy9odHRwczovL2dpdGh1Yi5jb20vY29tcG9uZW50L3BhZFxuICAgICAgaWYgKGNoID09IG51bGwpIGNoID0gJyAnO1xuICAgICAgaWYgKHRoaXMucy5sZW5ndGggPj0gbGVuKSByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3IodGhpcy5zKTtcbiAgICAgIGxlbiA9IGxlbiAtIHRoaXMucy5sZW5ndGg7XG4gICAgICB2YXIgbGVmdCA9IEFycmF5KE1hdGguY2VpbChsZW4gLyAyKSArIDEpLmpvaW4oY2gpO1xuICAgICAgdmFyIHJpZ2h0ID0gQXJyYXkoTWF0aC5mbG9vcihsZW4gLyAyKSArIDEpLmpvaW4oY2gpO1xuICAgICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKGxlZnQgKyB0aGlzLnMgKyByaWdodCk7XG4gICAgfSxcblxuICAgIHBhZExlZnQ6IGZ1bmN0aW9uKGxlbiwgY2gpIHsgLy9odHRwczovL2dpdGh1Yi5jb20vY29tcG9uZW50L3BhZFxuICAgICAgaWYgKGNoID09IG51bGwpIGNoID0gJyAnO1xuICAgICAgaWYgKHRoaXMucy5sZW5ndGggPj0gbGVuKSByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3IodGhpcy5zKTtcbiAgICAgIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3RvcihBcnJheShsZW4gLSB0aGlzLnMubGVuZ3RoICsgMSkuam9pbihjaCkgKyB0aGlzLnMpO1xuICAgIH0sXG5cbiAgICBwYWRSaWdodDogZnVuY3Rpb24obGVuLCBjaCkgeyAvL2h0dHBzOi8vZ2l0aHViLmNvbS9jb21wb25lbnQvcGFkXG4gICAgICBpZiAoY2ggPT0gbnVsbCkgY2ggPSAnICc7XG4gICAgICBpZiAodGhpcy5zLmxlbmd0aCA+PSBsZW4pIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3Rvcih0aGlzLnMpO1xuICAgICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKHRoaXMucyArIEFycmF5KGxlbiAtIHRoaXMucy5sZW5ndGggKyAxKS5qb2luKGNoKSk7XG4gICAgfSxcblxuICAgIHBhcnNlQ1NWOiBmdW5jdGlvbihkZWxpbWl0ZXIsIHF1YWxpZmllciwgZXNjYXBlLCBsaW5lRGVsaW1pdGVyKSB7IC8vdHJ5IHRvIHBhcnNlIG5vIG1hdHRlciB3aGF0XG4gICAgICBkZWxpbWl0ZXIgPSBkZWxpbWl0ZXIgfHwgJywnO1xuICAgICAgZXNjYXBlID0gZXNjYXBlIHx8ICdcXFxcJ1xuICAgICAgaWYgKHR5cGVvZiBxdWFsaWZpZXIgPT0gJ3VuZGVmaW5lZCcpXG4gICAgICAgIHF1YWxpZmllciA9ICdcIic7XG5cbiAgICAgIHZhciBpID0gMCwgZmllbGRCdWZmZXIgPSBbXSwgZmllbGRzID0gW10sIGxlbiA9IHRoaXMucy5sZW5ndGgsIGluRmllbGQgPSBmYWxzZSwgc2VsZiA9IHRoaXM7XG4gICAgICB2YXIgY2EgPSBmdW5jdGlvbihpKXtyZXR1cm4gc2VsZi5zLmNoYXJBdChpKX07XG4gICAgICBpZiAodHlwZW9mIGxpbmVEZWxpbWl0ZXIgIT09ICd1bmRlZmluZWQnKSB2YXIgcm93cyA9IFtdO1xuXG4gICAgICBpZiAoIXF1YWxpZmllcilcbiAgICAgICAgaW5GaWVsZCA9IHRydWU7XG5cbiAgICAgIHdoaWxlIChpIDwgbGVuKSB7XG4gICAgICAgIHZhciBjdXJyZW50ID0gY2EoaSk7XG4gICAgICAgIHN3aXRjaCAoY3VycmVudCkge1xuICAgICAgICAgIGNhc2UgZXNjYXBlOlxuICAgICAgICAgIC8vZml4IGZvciBpc3N1ZXMgIzMyIGFuZCAjMzVcbiAgICAgICAgICBpZiAoaW5GaWVsZCAmJiAoKGVzY2FwZSAhPT0gcXVhbGlmaWVyKSB8fCBjYShpKzEpID09PSBxdWFsaWZpZXIpKSB7XG4gICAgICAgICAgICAgIGkgKz0gMTtcbiAgICAgICAgICAgICAgZmllbGRCdWZmZXIucHVzaChjYShpKSk7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoZXNjYXBlICE9PSBxdWFsaWZpZXIpIGJyZWFrO1xuICAgICAgICAgIGNhc2UgcXVhbGlmaWVyOlxuICAgICAgICAgICAgaW5GaWVsZCA9ICFpbkZpZWxkO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSBkZWxpbWl0ZXI6XG4gICAgICAgICAgICBpZiAoaW5GaWVsZCAmJiBxdWFsaWZpZXIpXG4gICAgICAgICAgICAgIGZpZWxkQnVmZmVyLnB1c2goY3VycmVudCk7XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgZmllbGRzLnB1c2goZmllbGRCdWZmZXIuam9pbignJykpXG4gICAgICAgICAgICAgIGZpZWxkQnVmZmVyLmxlbmd0aCA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIGxpbmVEZWxpbWl0ZXI6XG4gICAgICAgICAgICBpZiAoaW5GaWVsZCkge1xuICAgICAgICAgICAgICAgIGZpZWxkQnVmZmVyLnB1c2goY3VycmVudCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChyb3dzKSB7XG4gICAgICAgICAgICAgICAgICAgIGZpZWxkcy5wdXNoKGZpZWxkQnVmZmVyLmpvaW4oJycpKVxuICAgICAgICAgICAgICAgICAgICByb3dzLnB1c2goZmllbGRzKTtcbiAgICAgICAgICAgICAgICAgICAgZmllbGRzID0gW107XG4gICAgICAgICAgICAgICAgICAgIGZpZWxkQnVmZmVyLmxlbmd0aCA9IDA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGlmIChpbkZpZWxkKVxuICAgICAgICAgICAgICBmaWVsZEJ1ZmZlci5wdXNoKGN1cnJlbnQpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgaSArPSAxO1xuICAgICAgfVxuXG4gICAgICBmaWVsZHMucHVzaChmaWVsZEJ1ZmZlci5qb2luKCcnKSk7XG4gICAgICBpZiAocm93cykge1xuICAgICAgICByb3dzLnB1c2goZmllbGRzKTtcbiAgICAgICAgcmV0dXJuIHJvd3M7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmllbGRzO1xuICAgIH0sXG5cbiAgICByZXBsYWNlQWxsOiBmdW5jdGlvbihzcywgcikge1xuICAgICAgLy92YXIgcyA9IHRoaXMucy5yZXBsYWNlKG5ldyBSZWdFeHAoc3MsICdnJyksIHIpO1xuICAgICAgdmFyIHMgPSB0aGlzLnMuc3BsaXQoc3MpLmpvaW4ocilcbiAgICAgIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3RvcihzKTtcbiAgICB9LFxuXG4gICAgcmlnaHQ6IGZ1bmN0aW9uKE4pIHtcbiAgICAgIGlmIChOID49IDApIHtcbiAgICAgICAgdmFyIHMgPSB0aGlzLnMuc3Vic3RyKHRoaXMucy5sZW5ndGggLSBOLCBOKTtcbiAgICAgICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKHMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubGVmdCgtTik7XG4gICAgICB9XG4gICAgfSxcblxuICAgIHNldFZhbHVlOiBmdW5jdGlvbiAocykge1xuXHQgIGluaXRpYWxpemUodGhpcywgcyk7XG5cdCAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIHNsdWdpZnk6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHNsID0gKG5ldyBTKHRoaXMucy5yZXBsYWNlKC9bXlxcd1xccy1dL2csICcnKS50b0xvd2VyQ2FzZSgpKSkuZGFzaGVyaXplKCkucztcbiAgICAgIGlmIChzbC5jaGFyQXQoMCkgPT09ICctJylcbiAgICAgICAgc2wgPSBzbC5zdWJzdHIoMSk7XG4gICAgICByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3Ioc2wpO1xuICAgIH0sXG5cbiAgICBzdGFydHNXaXRoOiBmdW5jdGlvbihwcmVmaXgpIHtcbiAgICAgIHJldHVybiB0aGlzLnMubGFzdEluZGV4T2YocHJlZml4LCAwKSA9PT0gMDtcbiAgICB9LFxuXG4gICAgc3RyaXBQdW5jdHVhdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAvL3JldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3Rvcih0aGlzLnMucmVwbGFjZSgvW1xcLiwtXFwvIyEkJVxcXiZcXCo7Ont9PVxcLV9gfigpXS9nLFwiXCIpKTtcbiAgICAgIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3Rvcih0aGlzLnMucmVwbGFjZSgvW15cXHdcXHNdfF8vZywgXCJcIikucmVwbGFjZSgvXFxzKy9nLCBcIiBcIikpO1xuICAgIH0sXG5cbiAgICBzdHJpcFRhZ3M6IGZ1bmN0aW9uKCkgeyAvL2Zyb20gc3VnYXIuanNcbiAgICAgIHZhciBzID0gdGhpcy5zLCBhcmdzID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgPyBhcmd1bWVudHMgOiBbJyddO1xuICAgICAgbXVsdGlBcmdzKGFyZ3MsIGZ1bmN0aW9uKHRhZykge1xuICAgICAgICBzID0gcy5yZXBsYWNlKFJlZ0V4cCgnPFxcLz8nICsgdGFnICsgJ1tePD5dKj4nLCAnZ2knKSwgJycpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3Iocyk7XG4gICAgfSxcblxuICAgIHRlbXBsYXRlOiBmdW5jdGlvbih2YWx1ZXMsIG9wZW5pbmcsIGNsb3NpbmcpIHtcbiAgICAgIHZhciBzID0gdGhpcy5zXG4gICAgICB2YXIgb3BlbmluZyA9IG9wZW5pbmcgfHwgRXhwb3J0LlRNUExfT1BFTlxuICAgICAgdmFyIGNsb3NpbmcgPSBjbG9zaW5nIHx8IEV4cG9ydC5UTVBMX0NMT1NFXG5cbiAgICAgIHZhciBvcGVuID0gb3BlbmluZy5yZXBsYWNlKC9bLVtcXF0oKSpcXHNdL2csIFwiXFxcXCQmXCIpLnJlcGxhY2UoL1xcJC9nLCAnXFxcXCQnKVxuICAgICAgdmFyIGNsb3NlID0gY2xvc2luZy5yZXBsYWNlKC9bLVtcXF0oKSpcXHNdL2csIFwiXFxcXCQmXCIpLnJlcGxhY2UoL1xcJC9nLCAnXFxcXCQnKVxuICAgICAgdmFyIHIgPSBuZXcgUmVnRXhwKG9wZW4gKyAnKC4rPyknICsgY2xvc2UsICdnJylcbiAgICAgICAgLy8sIHIgPSAvXFx7XFx7KC4rPylcXH1cXH0vZ1xuICAgICAgdmFyIG1hdGNoZXMgPSBzLm1hdGNoKHIpIHx8IFtdO1xuXG4gICAgICBtYXRjaGVzLmZvckVhY2goZnVuY3Rpb24obWF0Y2gpIHtcbiAgICAgICAgdmFyIGtleSA9IG1hdGNoLnN1YnN0cmluZyhvcGVuaW5nLmxlbmd0aCwgbWF0Y2gubGVuZ3RoIC0gY2xvc2luZy5sZW5ndGgpOy8vY2hvcCB7eyBhbmQgfX1cbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZXNba2V5XSAhPSAndW5kZWZpbmVkJylcbiAgICAgICAgICBzID0gcy5yZXBsYWNlKG1hdGNoLCB2YWx1ZXNba2V5XSk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3RvcihzKTtcbiAgICB9LFxuXG4gICAgdGltZXM6IGZ1bmN0aW9uKG4pIHtcbiAgICAgIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3RvcihuZXcgQXJyYXkobiArIDEpLmpvaW4odGhpcy5zKSk7XG4gICAgfSxcblxuICAgIHRvQm9vbGVhbjogZnVuY3Rpb24oKSB7XG4gICAgICBpZiAodHlwZW9mIHRoaXMub3JpZyA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgdmFyIHMgPSB0aGlzLnMudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgcmV0dXJuIHMgPT09ICd0cnVlJyB8fCBzID09PSAneWVzJyB8fCBzID09PSAnb24nO1xuICAgICAgfSBlbHNlXG4gICAgICAgIHJldHVybiB0aGlzLm9yaWcgPT09IHRydWUgfHwgdGhpcy5vcmlnID09PSAxO1xuICAgIH0sXG5cbiAgICB0b0Zsb2F0OiBmdW5jdGlvbihwcmVjaXNpb24pIHtcbiAgICAgIHZhciBudW0gPSBwYXJzZUZsb2F0KHRoaXMucylcbiAgICAgIGlmIChwcmVjaXNpb24pXG4gICAgICAgIHJldHVybiBwYXJzZUZsb2F0KG51bS50b0ZpeGVkKHByZWNpc2lvbikpXG4gICAgICBlbHNlXG4gICAgICAgIHJldHVybiBudW1cbiAgICB9LFxuXG4gICAgdG9JbnQ6IGZ1bmN0aW9uKCkgeyAvL3RoYW5rcyBHb29nbGVcbiAgICAgIC8vIElmIHRoZSBzdHJpbmcgc3RhcnRzIHdpdGggJzB4JyBvciAnLTB4JywgcGFyc2UgYXMgaGV4LlxuICAgICAgcmV0dXJuIC9eXFxzKi0/MHgvaS50ZXN0KHRoaXMucykgPyBwYXJzZUludCh0aGlzLnMsIDE2KSA6IHBhcnNlSW50KHRoaXMucywgMTApXG4gICAgfSxcblxuICAgIHRyaW06IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHM7XG4gICAgICBpZiAodHlwZW9mIF9fbnNwLnRyaW0gPT09ICd1bmRlZmluZWQnKSBcbiAgICAgICAgcyA9IHRoaXMucy5yZXBsYWNlKC8oXlxccyp8XFxzKiQpL2csICcnKVxuICAgICAgZWxzZSBcbiAgICAgICAgcyA9IHRoaXMucy50cmltKClcbiAgICAgIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3RvcihzKTtcbiAgICB9LFxuXG4gICAgdHJpbUxlZnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHM7XG4gICAgICBpZiAoX19uc3AudHJpbUxlZnQpXG4gICAgICAgIHMgPSB0aGlzLnMudHJpbUxlZnQoKTtcbiAgICAgIGVsc2VcbiAgICAgICAgcyA9IHRoaXMucy5yZXBsYWNlKC8oXlxccyopL2csICcnKTtcbiAgICAgIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3RvcihzKTtcbiAgICB9LFxuXG4gICAgdHJpbVJpZ2h0OiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBzO1xuICAgICAgaWYgKF9fbnNwLnRyaW1SaWdodClcbiAgICAgICAgcyA9IHRoaXMucy50cmltUmlnaHQoKTtcbiAgICAgIGVsc2VcbiAgICAgICAgcyA9IHRoaXMucy5yZXBsYWNlKC9cXHMrJC8sICcnKTtcbiAgICAgIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3RvcihzKTtcbiAgICB9LFxuXG4gICAgdHJ1bmNhdGU6IGZ1bmN0aW9uKGxlbmd0aCwgcHJ1bmVTdHIpIHsgLy9mcm9tIHVuZGVyc2NvcmUuc3RyaW5nLCBhdXRob3I6IGdpdGh1Yi5jb20vcnd6XG4gICAgICB2YXIgc3RyID0gdGhpcy5zO1xuXG4gICAgICBsZW5ndGggPSB+fmxlbmd0aDtcbiAgICAgIHBydW5lU3RyID0gcHJ1bmVTdHIgfHwgJy4uLic7XG5cbiAgICAgIGlmIChzdHIubGVuZ3RoIDw9IGxlbmd0aCkgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKHN0cik7XG5cbiAgICAgIHZhciB0bXBsID0gZnVuY3Rpb24oYyl7IHJldHVybiBjLnRvVXBwZXJDYXNlKCkgIT09IGMudG9Mb3dlckNhc2UoKSA/ICdBJyA6ICcgJzsgfSxcbiAgICAgICAgdGVtcGxhdGUgPSBzdHIuc2xpY2UoMCwgbGVuZ3RoKzEpLnJlcGxhY2UoLy4oPz1cXFcqXFx3KiQpL2csIHRtcGwpOyAvLyAnSGVsbG8sIHdvcmxkJyAtPiAnSGVsbEFBIEFBQUFBJ1xuXG4gICAgICBpZiAodGVtcGxhdGUuc2xpY2UodGVtcGxhdGUubGVuZ3RoLTIpLm1hdGNoKC9cXHdcXHcvKSlcbiAgICAgICAgdGVtcGxhdGUgPSB0ZW1wbGF0ZS5yZXBsYWNlKC9cXHMqXFxTKyQvLCAnJyk7XG4gICAgICBlbHNlXG4gICAgICAgIHRlbXBsYXRlID0gbmV3IFModGVtcGxhdGUuc2xpY2UoMCwgdGVtcGxhdGUubGVuZ3RoLTEpKS50cmltUmlnaHQoKS5zO1xuXG4gICAgICByZXR1cm4gKHRlbXBsYXRlK3BydW5lU3RyKS5sZW5ndGggPiBzdHIubGVuZ3RoID8gbmV3IFMoc3RyKSA6IG5ldyBTKHN0ci5zbGljZSgwLCB0ZW1wbGF0ZS5sZW5ndGgpK3BydW5lU3RyKTtcbiAgICB9LFxuXG4gICAgdG9DU1Y6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGRlbGltID0gJywnLCBxdWFsaWZpZXIgPSAnXCInLCBlc2NhcGUgPSAnXFxcXCcsIGVuY2xvc2VOdW1iZXJzID0gdHJ1ZSwga2V5cyA9IGZhbHNlO1xuICAgICAgdmFyIGRhdGFBcnJheSA9IFtdO1xuXG4gICAgICBmdW5jdGlvbiBoYXNWYWwoaXQpIHtcbiAgICAgICAgcmV0dXJuIGl0ICE9PSBudWxsICYmIGl0ICE9PSAnJztcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiBhcmd1bWVudHNbMF0gPT09ICdvYmplY3QnKSB7XG4gICAgICAgIGRlbGltID0gYXJndW1lbnRzWzBdLmRlbGltaXRlciB8fCBkZWxpbTtcbiAgICAgICAgZGVsaW0gPSBhcmd1bWVudHNbMF0uc2VwYXJhdG9yIHx8IGRlbGltO1xuICAgICAgICBxdWFsaWZpZXIgPSBhcmd1bWVudHNbMF0ucXVhbGlmaWVyIHx8IHF1YWxpZmllcjtcbiAgICAgICAgZW5jbG9zZU51bWJlcnMgPSAhIWFyZ3VtZW50c1swXS5lbmNsb3NlTnVtYmVycztcbiAgICAgICAgZXNjYXBlID0gYXJndW1lbnRzWzBdLmVzY2FwZSB8fCBlc2NhcGU7XG4gICAgICAgIGtleXMgPSAhIWFyZ3VtZW50c1swXS5rZXlzO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgYXJndW1lbnRzWzBdID09PSAnc3RyaW5nJykge1xuICAgICAgICBkZWxpbSA9IGFyZ3VtZW50c1swXTtcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiBhcmd1bWVudHNbMV0gPT09ICdzdHJpbmcnKVxuICAgICAgICBxdWFsaWZpZXIgPSBhcmd1bWVudHNbMV07XG5cbiAgICAgIGlmIChhcmd1bWVudHNbMV0gPT09IG51bGwpXG4gICAgICAgIHF1YWxpZmllciA9IG51bGw7XG5cbiAgICAgICBpZiAodGhpcy5vcmlnIGluc3RhbmNlb2YgQXJyYXkpXG4gICAgICAgIGRhdGFBcnJheSAgPSB0aGlzLm9yaWc7XG4gICAgICBlbHNlIHsgLy9vYmplY3RcbiAgICAgICAgZm9yICh2YXIga2V5IGluIHRoaXMub3JpZylcbiAgICAgICAgICBpZiAodGhpcy5vcmlnLmhhc093blByb3BlcnR5KGtleSkpXG4gICAgICAgICAgICBpZiAoa2V5cylcbiAgICAgICAgICAgICAgZGF0YUFycmF5LnB1c2goa2V5KTtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgZGF0YUFycmF5LnB1c2godGhpcy5vcmlnW2tleV0pO1xuICAgICAgfVxuXG4gICAgICB2YXIgcmVwID0gZXNjYXBlICsgcXVhbGlmaWVyO1xuICAgICAgdmFyIGJ1aWxkU3RyaW5nID0gW107XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRhdGFBcnJheS5sZW5ndGg7ICsraSkge1xuICAgICAgICB2YXIgc2hvdWxkUXVhbGlmeSA9IGhhc1ZhbChxdWFsaWZpZXIpXG4gICAgICAgIGlmICh0eXBlb2YgZGF0YUFycmF5W2ldID09ICdudW1iZXInKVxuICAgICAgICAgIHNob3VsZFF1YWxpZnkgJj0gZW5jbG9zZU51bWJlcnM7XG4gICAgICAgIFxuICAgICAgICBpZiAoc2hvdWxkUXVhbGlmeSlcbiAgICAgICAgICBidWlsZFN0cmluZy5wdXNoKHF1YWxpZmllcik7XG4gICAgICAgIFxuICAgICAgICBpZiAoZGF0YUFycmF5W2ldICE9PSBudWxsICYmIGRhdGFBcnJheVtpXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgdmFyIGQgPSBuZXcgUyhkYXRhQXJyYXlbaV0pLnJlcGxhY2VBbGwocXVhbGlmaWVyLCByZXApLnM7XG4gICAgICAgICAgYnVpbGRTdHJpbmcucHVzaChkKTtcbiAgICAgICAgfSBlbHNlIFxuICAgICAgICAgIGJ1aWxkU3RyaW5nLnB1c2goJycpXG5cbiAgICAgICAgaWYgKHNob3VsZFF1YWxpZnkpXG4gICAgICAgICAgYnVpbGRTdHJpbmcucHVzaChxdWFsaWZpZXIpO1xuICAgICAgICBcbiAgICAgICAgaWYgKGRlbGltKVxuICAgICAgICAgIGJ1aWxkU3RyaW5nLnB1c2goZGVsaW0pO1xuICAgICAgfVxuXG4gICAgICAvL2Nob3AgbGFzdCBkZWxpbVxuICAgICAgLy9jb25zb2xlLmxvZyhidWlsZFN0cmluZy5sZW5ndGgpXG4gICAgICBidWlsZFN0cmluZy5sZW5ndGggPSBidWlsZFN0cmluZy5sZW5ndGggLSAxO1xuICAgICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKGJ1aWxkU3RyaW5nLmpvaW4oJycpKTtcbiAgICB9LFxuXG4gICAgdG9TdHJpbmc6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMucztcbiAgICB9LFxuXG4gICAgLy8jbW9kaWZpZWQgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vZXBlbGkvdW5kZXJzY29yZS5zdHJpbmdcbiAgICB1bmRlcnNjb3JlOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBzID0gdGhpcy50cmltKCkucy5yZXBsYWNlKC8oW2EtelxcZF0pKFtBLVpdKykvZywgJyQxXyQyJykucmVwbGFjZSgvWy1cXHNdKy9nLCAnXycpLnRvTG93ZXJDYXNlKCk7XG4gICAgICBpZiAoKG5ldyBTKHRoaXMucy5jaGFyQXQoMCkpKS5pc1VwcGVyKCkpIHtcbiAgICAgICAgcyA9ICdfJyArIHM7XG4gICAgICB9XG4gICAgICByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3Iocyk7XG4gICAgfSxcblxuICAgIHVuZXNjYXBlSFRNTDogZnVuY3Rpb24oKSB7IC8vZnJvbSB1bmRlcnNjb3JlLnN0cmluZ1xuICAgICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKHRoaXMucy5yZXBsYWNlKC9cXCYoW147XSspOy9nLCBmdW5jdGlvbihlbnRpdHksIGVudGl0eUNvZGUpe1xuICAgICAgICB2YXIgbWF0Y2g7XG5cbiAgICAgICAgaWYgKGVudGl0eUNvZGUgaW4gZXNjYXBlQ2hhcnMpIHtcbiAgICAgICAgICByZXR1cm4gZXNjYXBlQ2hhcnNbZW50aXR5Q29kZV07XG4gICAgICAgIH0gZWxzZSBpZiAobWF0Y2ggPSBlbnRpdHlDb2RlLm1hdGNoKC9eI3goW1xcZGEtZkEtRl0rKSQvKSkge1xuICAgICAgICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKHBhcnNlSW50KG1hdGNoWzFdLCAxNikpO1xuICAgICAgICB9IGVsc2UgaWYgKG1hdGNoID0gZW50aXR5Q29kZS5tYXRjaCgvXiMoXFxkKykkLykpIHtcbiAgICAgICAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZSh+fm1hdGNoWzFdKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gZW50aXR5O1xuICAgICAgICB9XG4gICAgICB9KSk7XG4gICAgfSxcblxuICAgIHZhbHVlT2Y6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMucy52YWx1ZU9mKCk7XG4gICAgfVxuXG4gIH1cblxuICB2YXIgbWV0aG9kc0FkZGVkID0gW107XG4gIGZ1bmN0aW9uIGV4dGVuZFByb3RvdHlwZSgpIHtcbiAgICBmb3IgKHZhciBuYW1lIGluIF9fc3ApIHtcbiAgICAgIChmdW5jdGlvbihuYW1lKXtcbiAgICAgICAgdmFyIGZ1bmMgPSBfX3NwW25hbWVdO1xuICAgICAgICBpZiAoIV9fbnNwLmhhc093blByb3BlcnR5KG5hbWUpKSB7XG4gICAgICAgICAgbWV0aG9kc0FkZGVkLnB1c2gobmFtZSk7XG4gICAgICAgICAgX19uc3BbbmFtZV0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIFN0cmluZy5wcm90b3R5cGUucyA9IHRoaXM7XG4gICAgICAgICAgICByZXR1cm4gZnVuYy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSkobmFtZSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcmVzdG9yZVByb3RvdHlwZSgpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1ldGhvZHNBZGRlZC5sZW5ndGg7ICsraSlcbiAgICAgIGRlbGV0ZSBTdHJpbmcucHJvdG90eXBlW21ldGhvZHNBZGRlZFtpXV07XG4gICAgbWV0aG9kc0FkZGVkLmxlbmd0aCA9IDA7XG4gIH1cblxuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLyogQXR0YWNoIE5hdGl2ZSBKYXZhU2NyaXB0IFN0cmluZyBQcm9wZXJ0aWVzXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICB2YXIgbmF0aXZlUHJvcGVydGllcyA9IGdldE5hdGl2ZVN0cmluZ1Byb3BlcnRpZXMoKTtcbiAgZm9yICh2YXIgbmFtZSBpbiBuYXRpdmVQcm9wZXJ0aWVzKSB7XG4gICAgKGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgIHZhciBzdHJpbmdQcm9wID0gX19uc3BbbmFtZV07XG4gICAgICBpZiAodHlwZW9mIHN0cmluZ1Byb3AgPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAvL2NvbnNvbGUubG9nKHN0cmluZ1Byb3ApXG4gICAgICAgIGlmICghX19zcFtuYW1lXSkge1xuICAgICAgICAgIGlmIChuYXRpdmVQcm9wZXJ0aWVzW25hbWVdID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgX19zcFtuYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKG5hbWUpXG4gICAgICAgICAgICAgIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3RvcihzdHJpbmdQcm9wLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBfX3NwW25hbWVdID0gc3RyaW5nUHJvcDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KShuYW1lKTtcbiAgfVxuXG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vKiBGdW5jdGlvbiBBbGlhc2VzXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICBfX3NwLnJlcGVhdCA9IF9fc3AudGltZXM7XG4gIF9fc3AuaW5jbHVkZSA9IF9fc3AuY29udGFpbnM7XG4gIF9fc3AudG9JbnRlZ2VyID0gX19zcC50b0ludDtcbiAgX19zcC50b0Jvb2wgPSBfX3NwLnRvQm9vbGVhbjtcbiAgX19zcC5kZWNvZGVIVE1MRW50aXRpZXMgPSBfX3NwLmRlY29kZUh0bWxFbnRpdGllcyAvL2Vuc3VyZSBjb25zaXN0ZW50IGNhc2luZyBzY2hlbWUgb2YgJ0hUTUwnXG5cblxuLy8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8vIFNldCB0aGUgY29uc3RydWN0b3IuICBXaXRob3V0IHRoaXMsIHN0cmluZy5qcyBvYmplY3RzIGFyZSBpbnN0YW5jZXMgb2Zcbi8vIE9iamVjdCBpbnN0ZWFkIG9mIFMuXG4vLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuXG4gIF9fc3AuY29uc3RydWN0b3IgPSBTO1xuXG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vKiBQcml2YXRlIEZ1bmN0aW9uc1xuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgZnVuY3Rpb24gZ2V0TmF0aXZlU3RyaW5nUHJvcGVydGllcygpIHtcbiAgICB2YXIgbmFtZXMgPSBnZXROYXRpdmVTdHJpbmdQcm9wZXJ0eU5hbWVzKCk7XG4gICAgdmFyIHJldE9iaiA9IHt9O1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuYW1lcy5sZW5ndGg7ICsraSkge1xuICAgICAgdmFyIG5hbWUgPSBuYW1lc1tpXTtcbiAgICAgIHZhciBmdW5jID0gX19uc3BbbmFtZV07XG4gICAgICB0cnkge1xuICAgICAgICB2YXIgdHlwZSA9IHR5cGVvZiBmdW5jLmFwcGx5KCd0ZXN0c3RyaW5nJywgW10pO1xuICAgICAgICByZXRPYmpbbmFtZV0gPSB0eXBlO1xuICAgICAgfSBjYXRjaCAoZSkge31cbiAgICB9XG4gICAgcmV0dXJuIHJldE9iajtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldE5hdGl2ZVN0cmluZ1Byb3BlcnR5TmFtZXMoKSB7XG4gICAgdmFyIHJlc3VsdHMgPSBbXTtcbiAgICBpZiAoT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMpIHtcbiAgICAgIHJlc3VsdHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhfX25zcCk7XG4gICAgICByZXN1bHRzLnNwbGljZShyZXN1bHRzLmluZGV4T2YoJ3ZhbHVlT2YnKSwgMSk7XG4gICAgICByZXN1bHRzLnNwbGljZShyZXN1bHRzLmluZGV4T2YoJ3RvU3RyaW5nJyksIDEpO1xuICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgfSBlbHNlIHsgLy9tZWFudCBmb3IgbGVnYWN5IGNydWZ0LCB0aGlzIGNvdWxkIHByb2JhYmx5IGJlIG1hZGUgbW9yZSBlZmZpY2llbnRcbiAgICAgIHZhciBzdHJpbmdOYW1lcyA9IHt9O1xuICAgICAgdmFyIG9iamVjdE5hbWVzID0gW107XG4gICAgICBmb3IgKHZhciBuYW1lIGluIFN0cmluZy5wcm90b3R5cGUpXG4gICAgICAgIHN0cmluZ05hbWVzW25hbWVdID0gbmFtZTtcblxuICAgICAgZm9yICh2YXIgbmFtZSBpbiBPYmplY3QucHJvdG90eXBlKVxuICAgICAgICBkZWxldGUgc3RyaW5nTmFtZXNbbmFtZV07XG5cbiAgICAgIC8vc3RyaW5nTmFtZXNbJ3RvU3RyaW5nJ10gPSAndG9TdHJpbmcnOyAvL3RoaXMgd2FzIGRlbGV0ZWQgd2l0aCB0aGUgcmVzdCBvZiB0aGUgb2JqZWN0IG5hbWVzXG4gICAgICBmb3IgKHZhciBuYW1lIGluIHN0cmluZ05hbWVzKSB7XG4gICAgICAgIHJlc3VsdHMucHVzaChuYW1lKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHRzO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIEV4cG9ydChzdHIpIHtcbiAgICByZXR1cm4gbmV3IFMoc3RyKTtcbiAgfTtcblxuICAvL2F0dGFjaCBleHBvcnRzIHRvIFN0cmluZ0pTV3JhcHBlclxuICBFeHBvcnQuZXh0ZW5kUHJvdG90eXBlID0gZXh0ZW5kUHJvdG90eXBlO1xuICBFeHBvcnQucmVzdG9yZVByb3RvdHlwZSA9IHJlc3RvcmVQcm90b3R5cGU7XG4gIEV4cG9ydC5WRVJTSU9OID0gVkVSU0lPTjtcbiAgRXhwb3J0LlRNUExfT1BFTiA9ICd7eyc7XG4gIEV4cG9ydC5UTVBMX0NMT1NFID0gJ319JztcbiAgRXhwb3J0LkVOVElUSUVTID0gRU5USVRJRVM7XG5cblxuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLyogRXhwb3J0c1xuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICAmJiB0eXBlb2YgbW9kdWxlLmV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBFeHBvcnQ7XG5cbiAgfSBlbHNlIHtcblxuICAgIGlmKHR5cGVvZiBkZWZpbmUgPT09IFwiZnVuY3Rpb25cIiAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICBkZWZpbmUoW10sIGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gRXhwb3J0O1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHdpbmRvdy5TID0gRXhwb3J0O1xuICAgIH1cbiAgfVxuXG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vKiAzcmQgUGFydHkgUHJpdmF0ZSBGdW5jdGlvbnNcbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gIC8vZnJvbSBzdWdhci5qc1xuICBmdW5jdGlvbiBtdWx0aUFyZ3MoYXJncywgZm4pIHtcbiAgICB2YXIgcmVzdWx0ID0gW10sIGk7XG4gICAgZm9yKGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7IGkrKykge1xuICAgICAgcmVzdWx0LnB1c2goYXJnc1tpXSk7XG4gICAgICBpZihmbikgZm4uY2FsbChhcmdzLCBhcmdzW2ldLCBpKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8vZnJvbSB1bmRlcnNjb3JlLnN0cmluZ1xuICB2YXIgZXNjYXBlQ2hhcnMgPSB7XG4gICAgbHQ6ICc8JyxcbiAgICBndDogJz4nLFxuICAgIHF1b3Q6ICdcIicsXG4gICAgYXBvczogXCInXCIsXG4gICAgYW1wOiAnJidcbiAgfTtcblxuICAvL2Zyb20gdW5kZXJzY29yZS5zdHJpbmdcbiAgdmFyIHJldmVyc2VkRXNjYXBlQ2hhcnMgPSB7fTtcbiAgZm9yKHZhciBrZXkgaW4gZXNjYXBlQ2hhcnMpeyByZXZlcnNlZEVzY2FwZUNoYXJzW2VzY2FwZUNoYXJzW2tleV1dID0ga2V5OyB9XG5cbiAgRU5USVRJRVMgPSB7XG4gICAgXCJhbXBcIiA6IFwiJlwiLFxuICAgIFwiZ3RcIiA6IFwiPlwiLFxuICAgIFwibHRcIiA6IFwiPFwiLFxuICAgIFwicXVvdFwiIDogXCJcXFwiXCIsXG4gICAgXCJhcG9zXCIgOiBcIidcIixcbiAgICBcIkFFbGlnXCIgOiAxOTgsXG4gICAgXCJBYWN1dGVcIiA6IDE5MyxcbiAgICBcIkFjaXJjXCIgOiAxOTQsXG4gICAgXCJBZ3JhdmVcIiA6IDE5MixcbiAgICBcIkFyaW5nXCIgOiAxOTcsXG4gICAgXCJBdGlsZGVcIiA6IDE5NSxcbiAgICBcIkF1bWxcIiA6IDE5NixcbiAgICBcIkNjZWRpbFwiIDogMTk5LFxuICAgIFwiRVRIXCIgOiAyMDgsXG4gICAgXCJFYWN1dGVcIiA6IDIwMSxcbiAgICBcIkVjaXJjXCIgOiAyMDIsXG4gICAgXCJFZ3JhdmVcIiA6IDIwMCxcbiAgICBcIkV1bWxcIiA6IDIwMyxcbiAgICBcIklhY3V0ZVwiIDogMjA1LFxuICAgIFwiSWNpcmNcIiA6IDIwNixcbiAgICBcIklncmF2ZVwiIDogMjA0LFxuICAgIFwiSXVtbFwiIDogMjA3LFxuICAgIFwiTnRpbGRlXCIgOiAyMDksXG4gICAgXCJPYWN1dGVcIiA6IDIxMSxcbiAgICBcIk9jaXJjXCIgOiAyMTIsXG4gICAgXCJPZ3JhdmVcIiA6IDIxMCxcbiAgICBcIk9zbGFzaFwiIDogMjE2LFxuICAgIFwiT3RpbGRlXCIgOiAyMTMsXG4gICAgXCJPdW1sXCIgOiAyMTQsXG4gICAgXCJUSE9STlwiIDogMjIyLFxuICAgIFwiVWFjdXRlXCIgOiAyMTgsXG4gICAgXCJVY2lyY1wiIDogMjE5LFxuICAgIFwiVWdyYXZlXCIgOiAyMTcsXG4gICAgXCJVdW1sXCIgOiAyMjAsXG4gICAgXCJZYWN1dGVcIiA6IDIyMSxcbiAgICBcImFhY3V0ZVwiIDogMjI1LFxuICAgIFwiYWNpcmNcIiA6IDIyNixcbiAgICBcImFlbGlnXCIgOiAyMzAsXG4gICAgXCJhZ3JhdmVcIiA6IDIyNCxcbiAgICBcImFyaW5nXCIgOiAyMjksXG4gICAgXCJhdGlsZGVcIiA6IDIyNyxcbiAgICBcImF1bWxcIiA6IDIyOCxcbiAgICBcImNjZWRpbFwiIDogMjMxLFxuICAgIFwiZWFjdXRlXCIgOiAyMzMsXG4gICAgXCJlY2lyY1wiIDogMjM0LFxuICAgIFwiZWdyYXZlXCIgOiAyMzIsXG4gICAgXCJldGhcIiA6IDI0MCxcbiAgICBcImV1bWxcIiA6IDIzNSxcbiAgICBcImlhY3V0ZVwiIDogMjM3LFxuICAgIFwiaWNpcmNcIiA6IDIzOCxcbiAgICBcImlncmF2ZVwiIDogMjM2LFxuICAgIFwiaXVtbFwiIDogMjM5LFxuICAgIFwibnRpbGRlXCIgOiAyNDEsXG4gICAgXCJvYWN1dGVcIiA6IDI0MyxcbiAgICBcIm9jaXJjXCIgOiAyNDQsXG4gICAgXCJvZ3JhdmVcIiA6IDI0MixcbiAgICBcIm9zbGFzaFwiIDogMjQ4LFxuICAgIFwib3RpbGRlXCIgOiAyNDUsXG4gICAgXCJvdW1sXCIgOiAyNDYsXG4gICAgXCJzemxpZ1wiIDogMjIzLFxuICAgIFwidGhvcm5cIiA6IDI1NCxcbiAgICBcInVhY3V0ZVwiIDogMjUwLFxuICAgIFwidWNpcmNcIiA6IDI1MSxcbiAgICBcInVncmF2ZVwiIDogMjQ5LFxuICAgIFwidXVtbFwiIDogMjUyLFxuICAgIFwieWFjdXRlXCIgOiAyNTMsXG4gICAgXCJ5dW1sXCIgOiAyNTUsXG4gICAgXCJjb3B5XCIgOiAxNjksXG4gICAgXCJyZWdcIiA6IDE3NCxcbiAgICBcIm5ic3BcIiA6IDE2MCxcbiAgICBcImlleGNsXCIgOiAxNjEsXG4gICAgXCJjZW50XCIgOiAxNjIsXG4gICAgXCJwb3VuZFwiIDogMTYzLFxuICAgIFwiY3VycmVuXCIgOiAxNjQsXG4gICAgXCJ5ZW5cIiA6IDE2NSxcbiAgICBcImJydmJhclwiIDogMTY2LFxuICAgIFwic2VjdFwiIDogMTY3LFxuICAgIFwidW1sXCIgOiAxNjgsXG4gICAgXCJvcmRmXCIgOiAxNzAsXG4gICAgXCJsYXF1b1wiIDogMTcxLFxuICAgIFwibm90XCIgOiAxNzIsXG4gICAgXCJzaHlcIiA6IDE3MyxcbiAgICBcIm1hY3JcIiA6IDE3NSxcbiAgICBcImRlZ1wiIDogMTc2LFxuICAgIFwicGx1c21uXCIgOiAxNzcsXG4gICAgXCJzdXAxXCIgOiAxODUsXG4gICAgXCJzdXAyXCIgOiAxNzgsXG4gICAgXCJzdXAzXCIgOiAxNzksXG4gICAgXCJhY3V0ZVwiIDogMTgwLFxuICAgIFwibWljcm9cIiA6IDE4MSxcbiAgICBcInBhcmFcIiA6IDE4MixcbiAgICBcIm1pZGRvdFwiIDogMTgzLFxuICAgIFwiY2VkaWxcIiA6IDE4NCxcbiAgICBcIm9yZG1cIiA6IDE4NixcbiAgICBcInJhcXVvXCIgOiAxODcsXG4gICAgXCJmcmFjMTRcIiA6IDE4OCxcbiAgICBcImZyYWMxMlwiIDogMTg5LFxuICAgIFwiZnJhYzM0XCIgOiAxOTAsXG4gICAgXCJpcXVlc3RcIiA6IDE5MSxcbiAgICBcInRpbWVzXCIgOiAyMTUsXG4gICAgXCJkaXZpZGVcIiA6IDI0NyxcbiAgICBcIk9FbGlnO1wiIDogMzM4LFxuICAgIFwib2VsaWc7XCIgOiAzMzksXG4gICAgXCJTY2Fyb247XCIgOiAzNTIsXG4gICAgXCJzY2Fyb247XCIgOiAzNTMsXG4gICAgXCJZdW1sO1wiIDogMzc2LFxuICAgIFwiZm5vZjtcIiA6IDQwMixcbiAgICBcImNpcmM7XCIgOiA3MTAsXG4gICAgXCJ0aWxkZTtcIiA6IDczMixcbiAgICBcIkFscGhhO1wiIDogOTEzLFxuICAgIFwiQmV0YTtcIiA6IDkxNCxcbiAgICBcIkdhbW1hO1wiIDogOTE1LFxuICAgIFwiRGVsdGE7XCIgOiA5MTYsXG4gICAgXCJFcHNpbG9uO1wiIDogOTE3LFxuICAgIFwiWmV0YTtcIiA6IDkxOCxcbiAgICBcIkV0YTtcIiA6IDkxOSxcbiAgICBcIlRoZXRhO1wiIDogOTIwLFxuICAgIFwiSW90YTtcIiA6IDkyMSxcbiAgICBcIkthcHBhO1wiIDogOTIyLFxuICAgIFwiTGFtYmRhO1wiIDogOTIzLFxuICAgIFwiTXU7XCIgOiA5MjQsXG4gICAgXCJOdTtcIiA6IDkyNSxcbiAgICBcIlhpO1wiIDogOTI2LFxuICAgIFwiT21pY3JvbjtcIiA6IDkyNyxcbiAgICBcIlBpO1wiIDogOTI4LFxuICAgIFwiUmhvO1wiIDogOTI5LFxuICAgIFwiU2lnbWE7XCIgOiA5MzEsXG4gICAgXCJUYXU7XCIgOiA5MzIsXG4gICAgXCJVcHNpbG9uO1wiIDogOTMzLFxuICAgIFwiUGhpO1wiIDogOTM0LFxuICAgIFwiQ2hpO1wiIDogOTM1LFxuICAgIFwiUHNpO1wiIDogOTM2LFxuICAgIFwiT21lZ2E7XCIgOiA5MzcsXG4gICAgXCJhbHBoYTtcIiA6IDk0NSxcbiAgICBcImJldGE7XCIgOiA5NDYsXG4gICAgXCJnYW1tYTtcIiA6IDk0NyxcbiAgICBcImRlbHRhO1wiIDogOTQ4LFxuICAgIFwiZXBzaWxvbjtcIiA6IDk0OSxcbiAgICBcInpldGE7XCIgOiA5NTAsXG4gICAgXCJldGE7XCIgOiA5NTEsXG4gICAgXCJ0aGV0YTtcIiA6IDk1MixcbiAgICBcImlvdGE7XCIgOiA5NTMsXG4gICAgXCJrYXBwYTtcIiA6IDk1NCxcbiAgICBcImxhbWJkYTtcIiA6IDk1NSxcbiAgICBcIm11O1wiIDogOTU2LFxuICAgIFwibnU7XCIgOiA5NTcsXG4gICAgXCJ4aTtcIiA6IDk1OCxcbiAgICBcIm9taWNyb247XCIgOiA5NTksXG4gICAgXCJwaTtcIiA6IDk2MCxcbiAgICBcInJobztcIiA6IDk2MSxcbiAgICBcInNpZ21hZjtcIiA6IDk2MixcbiAgICBcInNpZ21hO1wiIDogOTYzLFxuICAgIFwidGF1O1wiIDogOTY0LFxuICAgIFwidXBzaWxvbjtcIiA6IDk2NSxcbiAgICBcInBoaTtcIiA6IDk2NixcbiAgICBcImNoaTtcIiA6IDk2NyxcbiAgICBcInBzaTtcIiA6IDk2OCxcbiAgICBcIm9tZWdhO1wiIDogOTY5LFxuICAgIFwidGhldGFzeW07XCIgOiA5NzcsXG4gICAgXCJ1cHNpaDtcIiA6IDk3OCxcbiAgICBcInBpdjtcIiA6IDk4MixcbiAgICBcImVuc3A7XCIgOiA4MTk0LFxuICAgIFwiZW1zcDtcIiA6IDgxOTUsXG4gICAgXCJ0aGluc3A7XCIgOiA4MjAxLFxuICAgIFwienduajtcIiA6IDgyMDQsXG4gICAgXCJ6d2o7XCIgOiA4MjA1LFxuICAgIFwibHJtO1wiIDogODIwNixcbiAgICBcInJsbTtcIiA6IDgyMDcsXG4gICAgXCJuZGFzaDtcIiA6IDgyMTEsXG4gICAgXCJtZGFzaDtcIiA6IDgyMTIsXG4gICAgXCJsc3F1bztcIiA6IDgyMTYsXG4gICAgXCJyc3F1bztcIiA6IDgyMTcsXG4gICAgXCJzYnF1bztcIiA6IDgyMTgsXG4gICAgXCJsZHF1bztcIiA6IDgyMjAsXG4gICAgXCJyZHF1bztcIiA6IDgyMjEsXG4gICAgXCJiZHF1bztcIiA6IDgyMjIsXG4gICAgXCJkYWdnZXI7XCIgOiA4MjI0LFxuICAgIFwiRGFnZ2VyO1wiIDogODIyNSxcbiAgICBcImJ1bGw7XCIgOiA4MjI2LFxuICAgIFwiaGVsbGlwO1wiIDogODIzMCxcbiAgICBcInBlcm1pbDtcIiA6IDgyNDAsXG4gICAgXCJwcmltZTtcIiA6IDgyNDIsXG4gICAgXCJQcmltZTtcIiA6IDgyNDMsXG4gICAgXCJsc2FxdW87XCIgOiA4MjQ5LFxuICAgIFwicnNhcXVvO1wiIDogODI1MCxcbiAgICBcIm9saW5lO1wiIDogODI1NCxcbiAgICBcImZyYXNsO1wiIDogODI2MCxcbiAgICBcImV1cm87XCIgOiA4MzY0LFxuICAgIFwiaW1hZ2U7XCIgOiA4NDY1LFxuICAgIFwid2VpZXJwO1wiIDogODQ3MixcbiAgICBcInJlYWw7XCIgOiA4NDc2LFxuICAgIFwidHJhZGU7XCIgOiA4NDgyLFxuICAgIFwiYWxlZnN5bTtcIiA6IDg1MDEsXG4gICAgXCJsYXJyO1wiIDogODU5MixcbiAgICBcInVhcnI7XCIgOiA4NTkzLFxuICAgIFwicmFycjtcIiA6IDg1OTQsXG4gICAgXCJkYXJyO1wiIDogODU5NSxcbiAgICBcImhhcnI7XCIgOiA4NTk2LFxuICAgIFwiY3JhcnI7XCIgOiA4NjI5LFxuICAgIFwibEFycjtcIiA6IDg2NTYsXG4gICAgXCJ1QXJyO1wiIDogODY1NyxcbiAgICBcInJBcnI7XCIgOiA4NjU4LFxuICAgIFwiZEFycjtcIiA6IDg2NTksXG4gICAgXCJoQXJyO1wiIDogODY2MCxcbiAgICBcImZvcmFsbDtcIiA6IDg3MDQsXG4gICAgXCJwYXJ0O1wiIDogODcwNixcbiAgICBcImV4aXN0O1wiIDogODcwNyxcbiAgICBcImVtcHR5O1wiIDogODcwOSxcbiAgICBcIm5hYmxhO1wiIDogODcxMSxcbiAgICBcImlzaW47XCIgOiA4NzEyLFxuICAgIFwibm90aW47XCIgOiA4NzEzLFxuICAgIFwibmk7XCIgOiA4NzE1LFxuICAgIFwicHJvZDtcIiA6IDg3MTksXG4gICAgXCJzdW07XCIgOiA4NzIxLFxuICAgIFwibWludXM7XCIgOiA4NzIyLFxuICAgIFwibG93YXN0O1wiIDogODcyNyxcbiAgICBcInJhZGljO1wiIDogODczMCxcbiAgICBcInByb3A7XCIgOiA4NzMzLFxuICAgIFwiaW5maW47XCIgOiA4NzM0LFxuICAgIFwiYW5nO1wiIDogODczNixcbiAgICBcImFuZDtcIiA6IDg3NDMsXG4gICAgXCJvcjtcIiA6IDg3NDQsXG4gICAgXCJjYXA7XCIgOiA4NzQ1LFxuICAgIFwiY3VwO1wiIDogODc0NixcbiAgICBcImludDtcIiA6IDg3NDcsXG4gICAgXCJ0aGVyZTQ7XCIgOiA4NzU2LFxuICAgIFwic2ltO1wiIDogODc2NCxcbiAgICBcImNvbmc7XCIgOiA4NzczLFxuICAgIFwiYXN5bXA7XCIgOiA4Nzc2LFxuICAgIFwibmU7XCIgOiA4ODAwLFxuICAgIFwiZXF1aXY7XCIgOiA4ODAxLFxuICAgIFwibGU7XCIgOiA4ODA0LFxuICAgIFwiZ2U7XCIgOiA4ODA1LFxuICAgIFwic3ViO1wiIDogODgzNCxcbiAgICBcInN1cDtcIiA6IDg4MzUsXG4gICAgXCJuc3ViO1wiIDogODgzNixcbiAgICBcInN1YmU7XCIgOiA4ODM4LFxuICAgIFwic3VwZTtcIiA6IDg4MzksXG4gICAgXCJvcGx1cztcIiA6IDg4NTMsXG4gICAgXCJvdGltZXM7XCIgOiA4ODU1LFxuICAgIFwicGVycDtcIiA6IDg4NjksXG4gICAgXCJzZG90O1wiIDogODkwMSxcbiAgICBcImxjZWlsO1wiIDogODk2OCxcbiAgICBcInJjZWlsO1wiIDogODk2OSxcbiAgICBcImxmbG9vcjtcIiA6IDg5NzAsXG4gICAgXCJyZmxvb3I7XCIgOiA4OTcxLFxuICAgIFwibGFuZztcIiA6IDkwMDEsXG4gICAgXCJyYW5nO1wiIDogOTAwMixcbiAgICBcImxvejtcIiA6IDk2NzQsXG4gICAgXCJzcGFkZXM7XCIgOiA5ODI0LFxuICAgIFwiY2x1YnM7XCIgOiA5ODI3LFxuICAgIFwiaGVhcnRzO1wiIDogOTgyOSxcbiAgICBcImRpYW1zO1wiIDogOTgzMFxuICB9XG5cblxufSkuY2FsbCh0aGlzKTtcbiIsImxldCBwID0gU3ltYm9sKCksXG5cdEh0bWwgPSB7XG5cdHBhcnNlQWxsKGh0bWwpIHtcblx0XHRsZXQgZWwgICA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdGVsLmlubmVySFRNTCA9IGh0bWw7XG5cdFx0cmV0dXJuIEFycmF5LnByb3RvdHlwZS5zbGljZS5hcHBseShlbC5jaGlsZE5vZGVzKTtcblx0fSxcblx0cGFyc2UoaHRtbCkge1xuXHRcdHJldHVybiB0aGlzLnBhcnNlQWxsKGh0bWwpWzBdO1xuXHR9XG59O1xuXG5jbGFzcyBEb21TdHJlYW0ge1xuXHRjb25zdHJ1Y3Rvcihzb3VyY2UpIHtcblx0XHR0aGlzW3BdID0gc291cmNlO1xuXHR9XG5cdGFwcGx5RGlzcGxheShlbCwgZGlzcGxheSA9IFwiXCIpIHtcblx0XHRsZXQgb2xkID0gZWwuc3R5bGUuZGlzcGxheSxcblx0XHRcdMaSID0gKHYpID0+IGVsLnN0eWxlLmRpc3BsYXkgPSB2ID8gZGlzcGxheSA6IFwibm9uZVwiO1xuXHRcdHRoaXNbcF0uc3Vic2NyaWJlKMaSKTtcblx0XHRyZXR1cm4gKCkgPT4ge1xuXHRcdFx0dGhpc1twXS51bnN1YnNjcmliZSjGkik7XG5cdFx0XHRlbC5zdHlsZS5kaXNwbGF5ID0gb2xkO1xuXHRcdH07XG5cdH1cblx0YXBwbHlUZXh0KGVsKSB7XG5cdFx0bGV0IG9sZCA9IGVsLmlubmVySFRNTCxcblx0XHRcdMaSID0gKHYpID0+IGVsLmlubmVySFRNTCA9IHYgfHwgXCJcIjtcblx0XHR0aGlzW3BdLnN1YnNjcmliZSjGkik7XG5cdFx0cmV0dXJuICgpID0+IHtcblx0XHRcdHRoaXNbcF0udW5zdWJzY3JpYmUoxpIpO1xuXHRcdFx0xpIob2xkKTtcblx0XHR9O1xuXHR9XG5cdGFwcGx5QXR0cmlidXRlKG5hbWUsIGVsKSB7XG5cdFx0bGV0IG9sZCA9IGVsLmdldEF0dHJpYnV0ZShuYW1lKSxcblx0XHRcdMaSID0gKHYpID0+IHtcblx0XHRcdFx0diA9PSBudWxsID8gZWwucmVtb3ZlQXR0cmlidXRlKG5hbWUpIDogZWwuc2V0QXR0cmlidXRlKG5hbWUsIHYpO1xuXHRcdFx0fVxuXHRcdHRoaXNbcF0uc3Vic2NyaWJlKMaSKTtcblx0XHRyZXR1cm4gKCkgPT4ge1xuXHRcdFx0dGhpc1twXS51bnN1YnNjcmliZSjGkik7XG5cdFx0XHTGkihvbGQpO1xuXHRcdH07XG5cdH1cblx0YXBwbHlTd2FwQ2xhc3MoZWwsIGNsYXNzTmFtZSkge1xuXHRcdGxldCBoYXMgPSBlbC5jbGFzc0xpc3QuY29udGFpbnMoY2xhc3NOYW1lKSxcblx0XHRcdMaSID0gKHYpID0+IHYgPyBlbC5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSkgOiBlbC5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzTmFtZSk7XG5cdFx0dGhpc1twXS5zdWJzY3JpYmUoxpIpO1xuXHRcdHJldHVybiAoKSA9PiB7XG5cdFx0XHR0aGlzW3BdLnVuc3Vic2NyaWJlKMaSKTtcblx0XHRcdMaSKGhhcyk7XG5cdFx0fTtcblx0fVxufVxuXG5sZXQgRG9tID0ge1xuXHRzdHJlYW0oc291cmNlKSB7XG5cdFx0cmV0dXJuIG5ldyBEb21TdHJlYW0oc291cmNlKTtcblx0fSxcblx0cmVhZHkoxpIpIHtcblx0XHRpZijGkilcblx0XHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIMaSLCBmYWxzZSk7XG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCByZXNvbHZlLCBmYWxzZSkpO1xuXHR9XG59XG5cbmxldCBRdWVyeSA9IHtcblx0Zmlyc3Qoc2VsZWN0b3IsIGN0eCkge1xuXHRcdHJldHVybiAoY3R4IHx8IGRvY3VtZW50KS5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcblx0fSxcblxuXHRhbGwoc2VsZWN0b3IsIGN0eCkge1xuXHRcdHJldHVybiAoY3R4IHx8IGRvY3VtZW50KS5xdWVyeShzZWxlY3Rvcik7XG5cdH1cbn07XG5cbmV4cG9ydCB7IEh0bWwsIFF1ZXJ5LCBEb20gfTsiLCJsZXQgaW1tZWRpYXRlID0gcmVxdWlyZSgnaW1tZWRpYXRlJyksXG5cdFRpbWVyID0ge1xuXHRkZWxheShtcywgxpIpIHtcblx0XHRpZijGkilcblx0XHRcdHJldHVybiBzZXRUaW1lb3V0KMaSLCBtcyk7XG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIG1zKSk7XG5cdH0sXG5cdGltbWVkaWF0ZSjGkikge1xuXHRcdGlmKMaSKVxuXHRcdFx0cmV0dXJuIGltbWVkaWF0ZSjGkik7XG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBpbW1lZGlhdGUocmVzb2x2ZSkpO1xuXHR9LFxuXHRkZWJvdW5jZSjGkiwgbXMgPSAwKSB7XG5cdFx0bGV0IHRpZCwgY29udGV4dCwgYXJncywgbGF0ZXLGkjtcblx0XHRyZXR1cm4gZnVuY3Rpb24oKSB7XG5cdFx0XHRjb250ZXh0ID0gdGhpcztcblx0XHRcdGFyZ3MgPSBhcmd1bWVudHM7XG5cdFx0XHRsYXRlcsaSID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGlmICghaW1tZWRpYXRlKSDGki5hcHBseShjb250ZXh0LCBhcmdzKTtcblx0XHRcdH07XG5cdFx0XHRjbGVhclRpbWVvdXQodGlkKTtcblx0XHRcdHRpZCA9IHNldFRpbWVvdXQobGF0ZXLGkiwgbXMpO1xuXHRcdH07XG5cdH0sXG5cdHJlZHVjZSjGkiwgbXMgPSAwKSB7XG5cdFx0bGV0IHRpZCwgY29udGV4dCwgYXJncztcblx0XHRyZXR1cm4gZnVuY3Rpb24oKSB7XG5cdFx0XHRjb250ZXh0ID0gdGhpcztcblx0XHRcdGFyZ3MgPSBhcmd1bWVudHM7XG5cdFx0XHRpZih0aWQpIHJldHVybjtcblx0XHRcdHRpZCA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHRpZCA9IG51bGw7XG5cdFx0XHRcdMaSLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuXHRcdFx0fSwgbXMpO1xuXHRcdH07XG5cdH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IFRpbWVyOyJdfQ==
