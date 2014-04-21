(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
var __moduleName = "client/main";
var Stream = require('streamy/stream').Stream;
var Fragment = require('./ui/fragment').Fragment;
var $__0 = require('./ui/properties'),
    Properties = $__0.Properties,
    Formats = $__0.Formats;
var $__0 = require('ui/dom'),
    Dom = $__0.Dom,
    Query = $__0.Query;
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
  Stream.sequence(2000, ["$ 0,0.00", "0.000", "0,0"], true).feed(number.format);
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
  })).subscribe((function() {
    return console.log(number.properties());
  })).feed(number.value);
  editor.addPropertyValue("editor", {}, function(prop, el) {
    var text = editor.text;
    if (!text) {
      throw new Error("'editor' requires the property 'text'");
    }
    var content = Query.first('.content', el),
        stream = text.map((function(s) {
          return s.length === 0;
        })).unique(),
        streamƒ = Dom.stream(stream).applySwapClass(content, 'empty'),
        listenƒ = (function(e) {
          text.push(el.innerText);
        });
    content.setAttribute("contenteditable", true);
    content.addEventListener("input", listenƒ, false);
    prop.focus = (function() {
      return content.focus();
    });
    return function() {
      streamƒ();
      content.removeEventListener("input", listenƒ, false);
      content.removeAttribute("contenteditable");
    };
  });
  editor.editor.focus();
}));


},{"./ui/fragment":3,"./ui/properties":4,"streamy/stream":16,"ui/dom":19}],2:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<span class=\"fragment\"><span class=\"content\"></span></span>");;return buf.join("");
};
},{"jade/runtime":14}],3:[function(require,module,exports){
"use strict";
var __moduleName = "client/ui/fragment";
var Html = require('ui/dom').Html;
var template = require('./fragment.jade')(),
    $ = Symbol(),
    p = Symbol(),
    u = Symbol(),
    parent = Symbol();
var PropertyContainer = function PropertyContainer(parent) {
  this[parent] = parent;
  this[u] = {};
};
var $PropertyContainer = PropertyContainer;
($traceurRuntime.createClass)(PropertyContainer, {
  addPropertyValue: function(name, value, wire) {
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
  addPropertyContainer: function(name, defaultField) {
    if (this[u][name])
      throw new Error(("A property '" + name + "' already exists"));
    var container = new $PropertyContainer(),
        setter = (defaultField) ? function(v) {
          container[defaultField].push(v);
        } : function() {
          throw new Error('Property Container doesn\'t have a default field');
        };
    this[u][name] = container.removeProperties.bind(container);
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
  removeProperty: function(name) {
    if (!this[u][name])
      throw ("Object doesn't contain a property '" + name + "'");
    this[u][name]();
    delete this[u][name];
    delete this[name];
  },
  removeProperties: function() {
    for (var $key in this[u]) {
      try {
        throw undefined;
      } catch (key) {
        key = $key;
        this.removeProperty(key);
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
    return this[parent];
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
var Fragment = function Fragment() {
  this[$] = Html.parse(template);
  this[p] = {};
  this[u] = {};
};
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
  get PropertyContainer() {
    return PropertyContainer;
  },
  get $() {
    return $;
  },
  get p() {
    return p;
  },
  __esModule: true
};


},{"./fragment.jade":2,"ui/dom":19}],4:[function(require,module,exports){
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
    fragment.addPropertyValue(name, new BoolValue(defaultValue), function(value, el) {
      return Dom.stream(value).applySwapClass(el, className);
    });
  };
}
function addAttributeFragment(name, attribute) {
  return function(fragment) {
    var text = arguments[1] !== (void 0) ? arguments[1] : "";
    fragment.addPropertyValue(name, new StringValue(text), function(value, el) {
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
    fragment.addPropertyValue("value", value, function(value, el) {
      return (function() {});
    });
  },
  text: function(fragment) {
    var text = arguments[1] !== (void 0) ? arguments[1] : "";
    fragment.addPropertyValue("text", new StringValue(text), function(value, el) {
      var content = Query.first('.content', el);
      return Dom.stream(value).applyText(content);
    });
  },
  visible: function(fragment) {
    var defaultValue = arguments[1] !== (void 0) ? arguments[1] : true;
    fragment.addPropertyValue("visible", new BoolValue(defaultValue), function(value, el) {
      return Dom.stream(value).applyDisplay(el);
    });
  },
  strong: addSwapClassFragment('strong'),
  emphasis: addSwapClassFragment('emphasis'),
  strike: addSwapClassFragment('strike'),
  tooltip: addAttributeFragment('tooltip', 'title'),
  link: function(fragment) {
    var url = arguments[1] !== (void 0) ? arguments[1] : "";
    fragment.addPropertyValue("link", new StringValue(url), function(value, el) {
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
    fragment.addPropertyValue("format", new StringValue(defaultFormat), function(format) {
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
    fragment.removeProperty('format');
  }
};
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
            fragment.removeProperty(name);
          };
        }
      }
    }
  }
}
;
module.exports = {
  get Properties() {
    return Properties;
  },
  get Formats() {
    return Formats;
  },
  __esModule: true
};


},{"numeral":15,"streamy/value":17,"string":18,"ui/dom":19}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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
},{"/Users/francoponticelli/projects/cards/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":5}],7:[function(require,module,exports){
"use strict";
exports.test = function () {
    return false;
};
},{}],8:[function(require,module,exports){
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

},{"./messageChannel":9,"./mutation":10,"./nextTick":7,"./postMessage":11,"./stateChange":12,"./timeout":13}],9:[function(require,module,exports){
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
},{}],10:[function(require,module,exports){
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
},{}],11:[function(require,module,exports){
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
},{}],12:[function(require,module,exports){
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
},{}],13:[function(require,module,exports){
"use strict";
exports.test = function () {
    return true;
};

exports.install = function (t) {
    return function () {
        setTimeout(t, 0);
    };
};
},{}],14:[function(require,module,exports){
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
},{}],15:[function(require,module,exports){
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

},{}],16:[function(require,module,exports){
"use strict";
var __moduleName = "node_modules/streamy/stream";
var Timer = require('ui/timer').default;
var _listeners = Symbol();
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
    var $__9;
    for (var others = [],
        $__4 = 0; $__4 < arguments.length; $__4++)
      others[$__4] = arguments[$__4];
    return ($__9 = Stream).zip.apply($__9, $traceurRuntime.spread([this], others));
  },
  spread: function(ƒ) {
    return Stream.spread(this, ƒ);
  },
  flatMap: function() {
    return Stream.flatMap(this);
  },
  merge: function() {
    var $__9;
    for (var others = [],
        $__5 = 0; $__5 < arguments.length; $__5++)
      others[$__5] = arguments[$__5];
    return ($__9 = Stream).merge.apply($__9, $traceurRuntime.spread([this], others));
  },
  reduce: function(acc, ƒ) {
    return Stream.reduce(this, acc, ƒ);
  },
  feed: function(destValue) {
    return Stream.feed(this, destValue);
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
  this.cancel = cancelƒ.bind(this);
};
var $CancelableSource = CancelableSource;
($traceurRuntime.createClass)(CancelableSource, {cancelOn: function(source) {
    source.subscribe(this.cancel);
    return this;
  }}, {}, PushSource);
var Stream = {
  map: function(source, ƒ) {
    var stream = new PushSource();
    source.subscribe((function(value) {
      stream.push(ƒ(value));
    }));
    return stream;
  },
  filter: function(source, ƒ) {
    var stream = new PushSource();
    source.subscribe((function(value) {
      if (ƒ(value))
        stream.push(value);
    }));
    return stream;
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
        $__6 = 0; $__6 < arguments.length; $__6++)
      sources[$__6] = arguments[$__6];
    var length = sources.length,
        stream = new PushSource(),
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
        sources[i].subscribe((function(v) {
          values[i] = v;
          flags[i] = true;
          update();
        }));
      }))(i);
    }
    return stream;
  },
  spread: function(source, ƒ) {
    var $__0 = this;
    var stream = new PushSource();
    source.subscribe((function(arr) {
      stream.push(ƒ.apply($__0, arr));
    }));
    return stream;
  },
  flatMap: function(source) {
    var stream = new PushSource();
    source.subscribe((function(arr) {
      for (var $v in arr) {
        try {
          throw undefined;
        } catch (v) {
          v = $v;
          stream.push(v);
        }
      }
    }));
    return stream;
  },
  merge: function() {
    for (var sources = [],
        $__7 = 0; $__7 < arguments.length; $__7++)
      sources[$__7] = arguments[$__7];
    var stream = new PushSource();
    for (var $__2 = sources[Symbol.iterator](),
        $__3; !($__3 = $__2.next()).done; ) {
      try {
        throw undefined;
      } catch (source) {
        source = $__3.value;
        {
          source.subscribe((function(v) {
            stream.push(v);
          }));
        }
      }
    }
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
      return stream.push(value);
    }), ms);
    return stream;
  },
  reduce: function(source, acc, ƒ) {
    var stream = new PushSource();
    source.subscribe((function(value) {
      return stream.push(acc = ƒ(acc, value));
    }));
    return stream;
  },
  feed: function(source, dest) {
    var ƒ = (function(v) {
      return dest.push(v);
    });
    source.subscribe(ƒ);
    return (function() {
      return source.unsubscribe(ƒ);
    });
  },
  fromArray: function(values) {
    var stream = new PushSource();
    values.map((function(v) {
      return stream.push(v);
    }));
    return stream;
  },
  sequence: function(interval, values) {
    var repeat = arguments[2] !== (void 0) ? arguments[2] : false;
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


},{"ui/timer":20}],17:[function(require,module,exports){
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


},{"./stream":16}],18:[function(require,module,exports){
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

},{}],19:[function(require,module,exports){
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


},{}],20:[function(require,module,exports){
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


},{"immediate":8}]},{},[6,1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvZnJhbmNvcG9udGljZWxsaS9wcm9qZWN0cy9jYXJkcy9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvY2xpZW50L21haW4uanMiLCIvVXNlcnMvZnJhbmNvcG9udGljZWxsaS9wcm9qZWN0cy9jYXJkcy9jbGllbnQvdWkvZnJhZ21lbnQuamFkZSIsIi9Vc2Vycy9mcmFuY29wb250aWNlbGxpL3Byb2plY3RzL2NhcmRzL2NsaWVudC91aS9mcmFnbWVudC5qcyIsIi9Vc2Vycy9mcmFuY29wb250aWNlbGxpL3Byb2plY3RzL2NhcmRzL2NsaWVudC91aS9wcm9wZXJ0aWVzLmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2luc2VydC1tb2R1bGUtZ2xvYmFscy9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL2VzNmlmeS9ub2RlX21vZHVsZXMvdHJhY2V1ci9iaW4vdHJhY2V1ci1ydW50aW1lLmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL2ltbWVkaWF0ZS9saWIvZmFrZU5leHRUaWNrLmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL2ltbWVkaWF0ZS9saWIvaW5kZXguanMiLCIvVXNlcnMvZnJhbmNvcG9udGljZWxsaS9wcm9qZWN0cy9jYXJkcy9ub2RlX21vZHVsZXMvaW1tZWRpYXRlL2xpYi9tZXNzYWdlQ2hhbm5lbC5qcyIsIi9Vc2Vycy9mcmFuY29wb250aWNlbGxpL3Byb2plY3RzL2NhcmRzL25vZGVfbW9kdWxlcy9pbW1lZGlhdGUvbGliL211dGF0aW9uLmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL2ltbWVkaWF0ZS9saWIvcG9zdE1lc3NhZ2UuanMiLCIvVXNlcnMvZnJhbmNvcG9udGljZWxsaS9wcm9qZWN0cy9jYXJkcy9ub2RlX21vZHVsZXMvaW1tZWRpYXRlL2xpYi9zdGF0ZUNoYW5nZS5qcyIsIi9Vc2Vycy9mcmFuY29wb250aWNlbGxpL3Byb2plY3RzL2NhcmRzL25vZGVfbW9kdWxlcy9pbW1lZGlhdGUvbGliL3RpbWVvdXQuanMiLCIvVXNlcnMvZnJhbmNvcG9udGljZWxsaS9wcm9qZWN0cy9jYXJkcy9ub2RlX21vZHVsZXMvamFkZS9ydW50aW1lLmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL251bWVyYWwvbnVtZXJhbC5qcyIsIi9Vc2Vycy9mcmFuY29wb250aWNlbGxpL3Byb2plY3RzL2NhcmRzL25vZGVfbW9kdWxlcy9zdHJlYW15L3N0cmVhbS5qcyIsIi9Vc2Vycy9mcmFuY29wb250aWNlbGxpL3Byb2plY3RzL2NhcmRzL25vZGVfbW9kdWxlcy9zdHJlYW15L3ZhbHVlLmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL3N0cmluZy9saWIvc3RyaW5nLmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL3VpL2RvbS5qcyIsIi9Vc2Vycy9mcmFuY29wb250aWNlbGxpL3Byb2plY3RzL2NhcmRzL25vZGVfbW9kdWxlcy91aS90aW1lci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBOztxQkFBdUIsZ0JBQWdCO3VCQUNkLGVBQWU7bUJBQ0osaUJBQWlCOzs7bUJBQzFCLFFBQVE7OztBQUVuQyxDQUFBLEVB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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOXpDQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25OQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3A5QkE7O0dBQUksQ0FBQSxDQUFDLEVBQUcsQ0FBQSxNQUFNLEVBQUU7VUFDUjtDQUNQLGFBQVEsQ0FBUixVQUFTLElBQUk7V0FDUixDQUFBLEVBQUUsRUFBSyxDQUFBLFFBQVEsY0FBYyxDQUFDLEtBQUssQ0FBQztBQUN4QyxDQUFBLFNBQUUsVUFBVSxFQUFHLEtBQUksQ0FBQztDQUNwQixhQUFPLENBQUEsS0FBSyxVQUFVLE1BQU0sTUFBTSxDQUFDLEVBQUUsV0FBVyxDQUFDLENBQUM7T0FDbEQ7Q0FDRCxVQUFLLENBQUwsVUFBTSxJQUFJLENBQUU7Q0FDWCxhQUFPLENBQUEsSUFBSSxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7T0FDOUI7Q0FBQSxJQUNEO2VBRUQsU0FBTSxVQUFTLENBQ0YsTUFBTSxDQUFFO0FBQ25CLENBQUEsS0FBSSxDQUFDLENBQUMsQ0FBQyxFQUFHLE9BQU0sQ0FBQztDQUNqQjs7Q0FDRCxhQUFZLENBQVosVUFBYSxFQUFFLEFBQWM7T0FBWixRQUFPLDZDQUFHLEdBQUU7O09BQ3hCLENBQUEsR0FBRyxFQUFHLENBQUEsRUFBRSxNQUFNLFFBQVE7QUFDekIsQ0FBQSxRQUFDLGFBQUksQ0FBQztnQkFBSyxDQUFBLEVBQUUsTUFBTSxRQUFRLEVBQUcsQ0FBQSxDQUFDLEVBQUcsUUFBTyxFQUFHLE9BQU07VUFBQTtBQUNuRCxDQUFBLE9BQUksQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0NBQ3JCLHFCQUFhO0FBQ1osQ0FBQSxVQUFLLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdkIsQ0FBQSxPQUFFLE1BQU0sUUFBUSxFQUFHLElBQUcsQ0FBQztLQUN2QixFQUFDO0dBQ0Y7Q0FDRCxVQUFTLENBQVQsVUFBVSxFQUFFOztPQUNQLENBQUEsR0FBRyxFQUFHLENBQUEsRUFBRSxVQUFVO0FBQ3JCLENBQUEsUUFBQyxhQUFJLENBQUM7Z0JBQUssQ0FBQSxFQUFFLFVBQVUsRUFBRyxDQUFBLENBQUMsR0FBSSxHQUFFO1VBQUE7QUFDbEMsQ0FBQSxPQUFJLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztDQUNyQixxQkFBYTtBQUNaLENBQUEsVUFBSyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3ZCLENBQUEsTUFBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ1AsRUFBQztHQUNGO0NBQ0QsZUFBYyxDQUFkLFVBQWUsSUFBSSxDQUFFLENBQUEsRUFBRTs7T0FDbEIsQ0FBQSxHQUFHLEVBQUcsQ0FBQSxFQUFFLGFBQWEsQ0FBQyxJQUFJLENBQUM7QUFDOUIsQ0FBQSxRQUFDLGFBQUksQ0FBQyxDQUFLO0FBQ1YsQ0FBQSxVQUFDLEdBQUksS0FBSSxDQUFBLENBQUcsQ0FBQSxFQUFFLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFBLENBQUcsQ0FBQSxFQUFFLGFBQWEsQ0FBQyxJQUFJLENBQUUsRUFBQyxDQUFDLENBQUM7U0FDaEUsQ0FBQTtBQUNGLENBQUEsT0FBSSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7Q0FDckIscUJBQWE7QUFDWixDQUFBLFVBQUssQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN2QixDQUFBLE1BQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUNQLEVBQUM7R0FDRjtDQUNELGVBQWMsQ0FBZCxVQUFlLEVBQUUsQ0FBRSxDQUFBLFNBQVM7O09BQ3ZCLENBQUEsR0FBRyxFQUFHLENBQUEsRUFBRSxVQUFVLFNBQVMsQ0FBQyxTQUFTLENBQUM7QUFDekMsQ0FBQSxRQUFDLGFBQUksQ0FBQztnQkFBSyxDQUFBLENBQUMsRUFBRyxDQUFBLEVBQUUsVUFBVSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUEsQ0FBRyxDQUFBLEVBQUUsVUFBVSxPQUFPLENBQUMsU0FBUyxDQUFDO1VBQUE7QUFDNUUsQ0FBQSxPQUFJLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztDQUNyQixxQkFBYTtBQUNaLENBQUEsVUFBSyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3ZCLENBQUEsTUFBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ1AsRUFBQztHQUNGOztHQUdFLENBQUEsR0FBRyxFQUFHO0NBQ1QsT0FBTSxDQUFOLFVBQU8sTUFBTSxDQUFFO0NBQ2QsU0FBTyxJQUFJLFVBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztHQUM3QjtDQUNELE1BQUssQ0FBTCxVQUFNLENBQUM7Q0FDTixPQUFHLENBQUM7QUFDSCxDQUFBLGFBQVEsaUJBQWlCLENBQUMsa0JBQWtCLENBQUUsRUFBQyxDQUFFLE1BQUssQ0FBQyxDQUFDOztDQUV4RCxXQUFPLElBQUksUUFBTyxXQUFFLE9BQU87Y0FBSyxDQUFBLFFBQVEsaUJBQWlCLENBQUMsa0JBQWtCLENBQUUsUUFBTyxDQUFFLE1BQUssQ0FBQztTQUFDLENBQUM7Q0FBQSxFQUNoRztDQUNEO0dBRUcsQ0FBQSxLQUFLLEVBQUc7Q0FDWCxNQUFLLENBQUwsVUFBTSxRQUFRLENBQUUsQ0FBQSxHQUFHLENBQUU7Q0FDcEIsU0FBTyxDQUFBLENBQUMsR0FBRyxHQUFJLFNBQVEsQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUM7R0FDakQ7Q0FFRCxJQUFHLENBQUgsVUFBSSxRQUFRLENBQUUsQ0FBQSxHQUFHLENBQUU7Q0FDbEIsU0FBTyxDQUFBLENBQUMsR0FBRyxHQUFJLFNBQVEsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7R0FDekM7Q0FBQSxBQUNEOzs7Ozs7Ozs7Ozs7OztDQUUyQjs7O0FDOUU1Qjs7R0FBSSxDQUFBLFNBQVMsRUFBRyxDQUFBLE9BQU8sQ0FBQyxXQUFXLENBQUM7V0FDM0I7Q0FDUixVQUFLLENBQUwsVUFBTSxFQUFFLENBQUUsQ0FBQSxDQUFDO0NBQ1YsV0FBRyxDQUFDO0NBQ0gsZUFBTyxDQUFBLFVBQVUsQ0FBQyxDQUFDLENBQUUsR0FBRSxDQUFDLENBQUM7O0NBRXpCLGVBQU8sSUFBSSxRQUFPLFdBQUUsT0FBTztrQkFBSyxDQUFBLFVBQVUsQ0FBQyxPQUFPLENBQUUsR0FBRSxDQUFDO2FBQUMsQ0FBQztDQUFBLE1BQzFEO0NBQ0QsY0FBUyxDQUFULFVBQVUsQ0FBQztDQUNWLFdBQUcsQ0FBQztDQUNILGVBQU8sQ0FBQSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7O0NBRXBCLGVBQU8sSUFBSSxRQUFPLFdBQUUsT0FBTztrQkFBSyxDQUFBLFNBQVMsQ0FBQyxPQUFPLENBQUM7YUFBQyxDQUFDO0NBQUEsTUFDckQ7Q0FDRCxhQUFRLENBQVIsVUFBUyxDQUFDLEFBQVE7V0FBTixHQUFFLDZDQUFHLEVBQUM7V0FDYixDQUFBLEdBQUc7QUFBRSxDQUFBLGtCQUFPO0FBQUUsQ0FBQSxlQUFJO0FBQUUsQ0FBQSxpQkFBTTtDQUM5QixhQUFPLFVBQVMsQ0FBRTtBQUNqQixDQUFBLGdCQUFPLEVBQUcsS0FBSSxDQUFDO0FBQ2YsQ0FBQSxhQUFJLEVBQUcsVUFBUyxDQUFDO0FBQ2pCLENBQUEsZUFBTSxFQUFHLFVBQVMsQ0FBRTtDQUNuQixlQUFJLENBQUMsU0FBUztBQUFFLENBQUEsY0FBQyxNQUFNLENBQUMsT0FBTyxDQUFFLEtBQUksQ0FBQyxDQUFDO0NBQUEsVUFDdkMsQ0FBQztBQUNGLENBQUEscUJBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNsQixDQUFBLFlBQUcsRUFBRyxDQUFBLFVBQVUsQ0FBQyxNQUFNLENBQUUsR0FBRSxDQUFDLENBQUM7U0FDN0IsQ0FBQztPQUNGO0NBQ0QsV0FBTSxDQUFOLFVBQU8sQ0FBQyxBQUFRO1dBQU4sR0FBRSw2Q0FBRyxFQUFDO1dBQ1gsQ0FBQSxHQUFHO0FBQUUsQ0FBQSxrQkFBTztBQUFFLENBQUEsZUFBSTtDQUN0QixhQUFPLFVBQVMsQ0FBRTtBQUNqQixDQUFBLGdCQUFPLEVBQUcsS0FBSSxDQUFDO0FBQ2YsQ0FBQSxhQUFJLEVBQUcsVUFBUyxDQUFDO0NBQ2pCLGFBQUcsR0FBRztDQUFFLGtCQUFPO0FBQ2YsQ0FEZSxZQUNaLEVBQUcsQ0FBQSxVQUFVLENBQUMsU0FBUyxDQUFFO0FBQzNCLENBQUEsY0FBRyxFQUFHLEtBQUksQ0FBQztBQUNYLENBQUEsWUFBQyxNQUFNLENBQUMsT0FBTyxDQUFFLEtBQUksQ0FBQyxDQUFDO1dBQ3ZCLENBQUUsR0FBRSxDQUFDLENBQUM7U0FDUCxDQUFDO09BQ0Y7S0FDRDtnQkFFYyxNQUFLOzs7Ozs7O0NBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCB7IFN0cmVhbSB9IGZyb20gJ3N0cmVhbXkvc3RyZWFtJztcbmltcG9ydCB7IEZyYWdtZW50IH0gZnJvbSAnLi91aS9mcmFnbWVudCc7XG5pbXBvcnQgeyBQcm9wZXJ0aWVzLCBGb3JtYXRzIH0gZnJvbSAnLi91aS9wcm9wZXJ0aWVzJztcbmltcG9ydCB7IERvbSwgUXVlcnkgfSBmcm9tICd1aS9kb20nO1xuXG5Eb20ucmVhZHkoKCkgPT4ge1xuXHRsZXQgY29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvbnRhaW5lcicpLFxuXHRcdGVkaXRvciAgICA9IG5ldyBGcmFnbWVudCgpLFxuXHRcdG51bWJlciAgICA9IG5ldyBGcmFnbWVudCgpLFxuXHRcdGZyYWdtZW50ICA9IG5ldyBGcmFnbWVudCgpO1xuXG5cdGVkaXRvci5hdHRhY2hUbyhjb250YWluZXIpO1xuXHRudW1iZXIuYXR0YWNoVG8oY29udGFpbmVyKTtcblx0ZnJhZ21lbnQuYXR0YWNoVG8oY29udGFpbmVyKTtcblxuXHQvLyBhZGQgdGV4dCBwcm9wZXJ0eSBhbmQgcmVuZGVyaW5nXG5cdFByb3BlcnRpZXMuYWRkVGV4dChlZGl0b3IpO1xuXHRQcm9wZXJ0aWVzLmFkZFRleHQoZnJhZ21lbnQpO1xuXHRQcm9wZXJ0aWVzLmFkZFRleHQobnVtYmVyKTtcblxuXHQvLyBhZGQgYSB2YWx1ZVxuXHRQcm9wZXJ0aWVzLmFkZFZhbHVlKGZyYWdtZW50LCBcIlN0cmluZ1wiKTtcblx0ZnJhZ21lbnQudmFsdWUgPSBcIiBIZXkgRnJhbmNvXCI7XG5cdC8vIG1hbnVhbGx5IHdpcmUgdmFsdWUgdG8gdGV4dFxuXHRmcmFnbWVudC52YWx1ZS5mZWVkKGZyYWdtZW50LnRleHQpO1xuXG5cdFByb3BlcnRpZXMuYWRkVmFsdWUobnVtYmVyLCBcIkZsb2F0XCIpO1xuXG5cdC8vIG1ha2UgaXQgYmxpbmtcblx0UHJvcGVydGllcy5hZGRWaXNpYmxlKGZyYWdtZW50KTtcblx0U3RyZWFtLmludGVydmFsKDMwMClcblx0XHQuY2FuY2VsT24oU3RyZWFtLmRlbGF5KDY1MDApLnN1YnNjcmliZSgoKSA9PiBQcm9wZXJ0aWVzLnJlbW92ZVZpc2libGUoZnJhZ21lbnQpKSlcblx0XHQucmVkdWNlKHRydWUsIChhY2MpID0+ICFhY2MpXG5cdFx0LmZlZWQoZnJhZ21lbnQudmlzaWJsZSk7XG5cblx0Ly8gbWFrZSBib2xkXG5cdFByb3BlcnRpZXMuYWRkU3Ryb25nKGZyYWdtZW50LCB0cnVlKTtcblxuXHQvLyBhZGQgZm9ybWF0XG5cdEZvcm1hdHMuYWRkTnVtZXJpYyhudW1iZXIsIFwiJCAwLDAuMDBcIik7XG5cblx0Ly8gY2hhbmdlIGZvcm1hdCBkeW5hbWljYWxseVxuXHRTdHJlYW1cblx0XHQuc2VxdWVuY2UoMjAwMCwgW1wiJCAwLDAuMDBcIiwgXCIwLjAwMFwiLCBcIjAsMFwiXSwgdHJ1ZSlcblx0XHQuZmVlZChudW1iZXIuZm9ybWF0KTtcblxuXHQvLyBhZGQgbGlua1xuXHRQcm9wZXJ0aWVzLmFkZExpbmsobnVtYmVyKTtcblx0bnVtYmVyLmxpbmsgPSBcImh0dHA6Ly9nb29nbGUuY29tXCI7XG5cblx0Ly8gcmVtb3ZlIGxpbmsgYWZ0ZXIgNSBzZWNzXG5cdFN0cmVhbS5kZWxheSg1MDAwKVxuXHRcdC5zdWJzY3JpYmUoKCkgPT4gUHJvcGVydGllcy5yZW1vdmVMaW5rKG51bWJlcikpO1xuXG5cdC8vIHJlbW92ZSB0b29sdGlwIGFmdGVyIDggc2Vjc1xuXHRTdHJlYW0uZGVsYXkoODAwMClcblx0XHQuc3Vic2NyaWJlKCgpID0+IFByb3BlcnRpZXMucmVtb3ZlVG9vbHRpcChudW1iZXIpKTtcblxuXHQvLyBhZGQgdG9vbHRpcFxuXHRQcm9wZXJ0aWVzLmFkZFRvb2x0aXAobnVtYmVyLCBcInRvb2x0aXAgdGV4dCBnb2VzIGhlcmVcIik7XG5cblx0Ly8gdXBkYXRlIG51bWJlclxuXHRTdHJlYW0uaW50ZXJ2YWwoMTAwMClcblx0XHQucmVkdWNlKDAsIChhY2MpID0+IGFjYyArIDMwMDAvNylcblx0XHQvLy5zdWJzY3JpYmUoKCkgPT4gY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkobnVtYmVyKSkpXG5cdFx0LnN1YnNjcmliZSgoKSA9PiBjb25zb2xlLmxvZyhudW1iZXIucHJvcGVydGllcygpKSlcblx0XHQuZmVlZChudW1iZXIudmFsdWUpO1xuXG5cdC8vIGF0dGVtcHQgYXQgYWRkaW5nIHRleHQgZWRpdG9yXG5cdGVkaXRvci5hZGRQcm9wZXJ0eVZhbHVlKFwiZWRpdG9yXCIsIHt9LCBmdW5jdGlvbihwcm9wLCBlbCkge1xuXHRcdGxldCB0ZXh0ID0gZWRpdG9yLnRleHQ7XG5cdFx0aWYoIXRleHQpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihcIidlZGl0b3InIHJlcXVpcmVzIHRoZSBwcm9wZXJ0eSAndGV4dCdcIik7XG5cdFx0fVxuXHRcdGxldCBjb250ZW50ID0gUXVlcnkuZmlyc3QoJy5jb250ZW50JywgZWwpLFxuXHRcdFx0c3RyZWFtICA9IHRleHQubWFwKChzKSA9PiBzLmxlbmd0aCA9PT0gMCkudW5pcXVlKCksXG5cdFx0XHRzdHJlYW3GkiA9IERvbS5zdHJlYW0oc3RyZWFtKS5hcHBseVN3YXBDbGFzcyhjb250ZW50LCAnZW1wdHknKSxcblx0XHRcdGxpc3RlbsaSID0gKGUpID0+IHtcblx0XHRcdFx0dGV4dC5wdXNoKGVsLmlubmVyVGV4dCk7XG5cdFx0XHR9O1xuXHRcdGNvbnRlbnQuc2V0QXR0cmlidXRlKFwiY29udGVudGVkaXRhYmxlXCIsIHRydWUpO1xuXHRcdGNvbnRlbnQuYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsIGxpc3RlbsaSLCBmYWxzZSk7XG5cdFx0cHJvcC5mb2N1cyA9ICgpID0+IGNvbnRlbnQuZm9jdXMoKTtcblx0XHRyZXR1cm4gZnVuY3Rpb24oKSB7XG5cdFx0XHRzdHJlYW3GkigpO1xuXHRcdFx0Y29udGVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgbGlzdGVuxpIsIGZhbHNlKTtcblx0XHRcdGNvbnRlbnQucmVtb3ZlQXR0cmlidXRlKFwiY29udGVudGVkaXRhYmxlXCIpO1xuXHRcdH07XG5cdH0pO1xuXHRlZGl0b3IuZWRpdG9yLmZvY3VzKCk7XG59KTtcblxuIiwidmFyIGphZGUgPSByZXF1aXJlKFwiamFkZS9ydW50aW1lXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge1xudmFyIGJ1ZiA9IFtdO1xudmFyIGphZGVfbWl4aW5zID0ge307XG52YXIgamFkZV9pbnRlcnA7XG5cbmJ1Zi5wdXNoKFwiPHNwYW4gY2xhc3M9XFxcImZyYWdtZW50XFxcIj48c3BhbiBjbGFzcz1cXFwiY29udGVudFxcXCI+PC9zcGFuPjwvc3Bhbj5cIik7O3JldHVybiBidWYuam9pbihcIlwiKTtcbn07IiwiaW1wb3J0IHsgSHRtbCB9IGZyb20gJ3VpL2RvbSc7XG5cbmxldCB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4vZnJhZ21lbnQuamFkZScpKCksXG5cdCQgPSBTeW1ib2woKSxcblx0cCA9IFN5bWJvbCgpLFxuXHR1ID0gU3ltYm9sKCksXG5cdHBhcmVudCA9IFN5bWJvbCgpO1xuXG4vLyBUT0RPLCBhZGQgcHJvcGVydGllcyBpdGVyYXRvclxuY2xhc3MgUHJvcGVydHlDb250YWluZXIge1xuXHRjb25zdHJ1Y3RvcihwYXJlbnQpIHtcblx0XHR0aGlzW3BhcmVudF0gPSBwYXJlbnQ7XG5cdFx0dGhpc1t1XSA9IHt9O1xuXHR9XG5cblx0YWRkUHJvcGVydHlWYWx1ZShuYW1lLCB2YWx1ZSwgd2lyZSkge1xuXHRcdGlmKG5hbWUgaW4gdGhpcylcblx0XHRcdHRocm93IG5ldyBFcnJvcihgQSBwcm9wZXJ0eSAnJHtuYW1lfScgYWxyZWFkeSBleGlzdHNgKTtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgbmFtZSwge1xuXHRcdFx0Y29uZmlndXJhYmxlOiB0cnVlLFxuXHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcblx0XHRcdHdyaXRlYWJsZTogZmFsc2UsXG5cdFx0XHRnZXQ6ICgpID0+IHZhbHVlLFxuXHRcdFx0c2V0OiAodikgPT4gdmFsdWUucHVzaCh2KVxuXHRcdH0pO1xuXHRcdHRoaXNbdV1bbmFtZV0gPSB3aXJlLmNhbGwodGhpcywgdmFsdWUsIHRoaXNbJF0pO1xuXHR9XG5cblx0YWRkUHJvcGVydHlDb250YWluZXIobmFtZSwgZGVmYXVsdEZpZWxkKSB7XG5cdFx0aWYodGhpc1t1XVtuYW1lXSlcblx0XHRcdHRocm93IG5ldyBFcnJvcihgQSBwcm9wZXJ0eSAnJHtuYW1lfScgYWxyZWFkeSBleGlzdHNgKTtcblx0XHRsZXQgY29udGFpbmVyID0gbmV3IFByb3BlcnR5Q29udGFpbmVyKCksXG5cdFx0XHRzZXR0ZXIgPSAoZGVmYXVsdEZpZWxkKSA/XG5cdFx0XHRcdGZ1bmN0aW9uKHYpIHsgY29udGFpbmVyW2RlZmF1bHRGaWVsZF0ucHVzaCh2KTsgfSA6XG5cdFx0XHRcdGZ1bmN0aW9uKCkgeyB0aHJvdyBuZXcgRXJyb3IoJ1Byb3BlcnR5IENvbnRhaW5lciBkb2VzblxcJ3QgaGF2ZSBhIGRlZmF1bHQgZmllbGQnKTsgfTtcblx0XHR0aGlzW3VdW25hbWVdID0gY29udGFpbmVyLnJlbW92ZVByb3BlcnRpZXMuYmluZChjb250YWluZXIpO1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBuYW1lLCB7XG5cdFx0XHRjb25maWd1cmFibGU6IHRydWUsXG5cdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuXHRcdFx0d3JpdGVhYmxlOiBmYWxzZSxcblx0XHRcdGdldDogKCkgPT4gY29udGFpbmVyLFxuXHRcdFx0c2V0OiBzZXR0ZXJcblx0XHR9KTtcblx0XHRyZXR1cm4gY29udGFpbmVyO1xuXHR9XG5cblx0cmVtb3ZlUHJvcGVydHkobmFtZSkge1xuXHRcdGlmKCF0aGlzW3VdW25hbWVdKVxuXHRcdFx0dGhyb3cgYE9iamVjdCBkb2Vzbid0IGNvbnRhaW4gYSBwcm9wZXJ0eSAnJHtuYW1lfSdgO1xuXHRcdHRoaXNbdV1bbmFtZV0oKTtcblx0XHRkZWxldGUgdGhpc1t1XVtuYW1lXTtcblx0XHRkZWxldGUgdGhpc1tuYW1lXTtcblx0fVxuXG5cdHJlbW92ZVByb3BlcnRpZXMoKSB7XG5cdFx0Zm9yKGxldCBrZXkgaW4gdGhpc1t1XSlcblx0XHRcdHRoaXMucmVtb3ZlUHJvcGVydHkoa2V5KTtcblx0fVxuXG5cdHByb3BlcnRpZXMoKSB7XG5cdFx0bGV0IGFyciA9IFtdO1xuXHRcdGZvcihsZXQga2V5IGluIHRoaXNbdV0pXG5cdFx0XHRhcnIucHVzaChrZXkpXG5cdFx0cmV0dXJuIGFycjtcblx0fVxuXG5cdGdldCBwYXJlbnQoKSB7XG5cdFx0cmV0dXJuIHRoaXNbcGFyZW50XTtcblx0fVxuXG5cdHRvSlNPTigpIHtcblx0XHRsZXQgb3V0ID0ge307XG5cdFx0Zm9yKGxldCBrZXkgaW4gdGhpc1t1XSkge1xuXHRcdFx0aWYoXCJpc0RlZmF1bHRcIiBpbiB0aGlzW2tleV0gJiYgdGhpc1trZXldLmlzRGVmYXVsdClcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRvdXRba2V5XSA9IHRoaXNba2V5XS52YWx1ZTtcblx0XHR9XG5cdFx0cmV0dXJuIG91dDtcblx0fVxufVxuXG5jbGFzcyBGcmFnbWVudCBleHRlbmRzIFByb3BlcnR5Q29udGFpbmVyIHtcblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0dGhpc1skXSA9IEh0bWwucGFyc2UodGVtcGxhdGUpO1xuXHRcdHRoaXNbcF0gPSB7fTtcblx0XHR0aGlzW3VdID0ge307XG5cdH1cblxuXHRhdHRhY2hUbyhjb250YWluZXIpIHtcblx0XHRjb250YWluZXIuYXBwZW5kQ2hpbGQodGhpc1skXSk7XG5cdH1cblxuXHRkZXRhY2goKSB7XG5cdFx0aWYoIXRoaXNbJF0ucGFyZW50Tm9kZSlcblx0XHRcdHRocm93IG5ldyBFcnJvcignRnJhZ21lbnQgaXMgbm90IGF0dGFjaGVkJyk7XG5cdFx0dGhpc1skXS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRoaXNbJF0pO1xuXHR9XG59XG5cblxuXG5leHBvcnQgeyBGcmFnbWVudCwgUHJvcGVydHlDb250YWluZXIsICQsIHAgfTsiLCJsZXQgc3RyaW5nICA9IHJlcXVpcmUoJ3N0cmluZycpLFxuXHRudW1lcmFsID0gcmVxdWlyZSgnbnVtZXJhbCcpO1xuXG5pbXBvcnQgeyBEb20sIFF1ZXJ5IH0gZnJvbSAndWkvZG9tJztcbmltcG9ydCB7IFN0cmluZ1ZhbHVlLCBCb29sVmFsdWUsIEZsb2F0VmFsdWUsIERhdGVWYWx1ZSB9IGZyb20gJ3N0cmVhbXkvdmFsdWUnO1xuXG5mdW5jdGlvbiBhZGRTd2FwQ2xhc3NGcmFnbWVudChuYW1lLCBjbGFzc05hbWUgPSBuYW1lKSB7XG5cdHJldHVybiBmdW5jdGlvbihmcmFnbWVudCwgZGVmYXVsdFZhbHVlID0gZmFsc2UpIHtcblx0XHRmcmFnbWVudC5hZGRQcm9wZXJ0eVZhbHVlKG5hbWUsIG5ldyBCb29sVmFsdWUoZGVmYXVsdFZhbHVlKSwgZnVuY3Rpb24odmFsdWUsIGVsKSB7XG5cdFx0XHRyZXR1cm4gRG9tLnN0cmVhbSh2YWx1ZSkuYXBwbHlTd2FwQ2xhc3MoZWwsIGNsYXNzTmFtZSk7XG5cdFx0fSk7XG5cdH07XG59XG5cbmZ1bmN0aW9uIGFkZEF0dHJpYnV0ZUZyYWdtZW50KG5hbWUsIGF0dHJpYnV0ZSkge1xuXHRyZXR1cm4gZnVuY3Rpb24oZnJhZ21lbnQsIHRleHQgPSBcIlwiKSB7XG5cdFx0ZnJhZ21lbnQuYWRkUHJvcGVydHlWYWx1ZShuYW1lLCBuZXcgU3RyaW5nVmFsdWUodGV4dCksIGZ1bmN0aW9uKHZhbHVlLCBlbCkge1xuXHRcdFx0cmV0dXJuIERvbS5zdHJlYW0odmFsdWUpLmFwcGx5QXR0cmlidXRlKGF0dHJpYnV0ZSwgZWwpO1xuXHRcdH0pO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVZhbHVlKHR5cGUsIC4uLmFyZ3MpIHtcblx0c3dpdGNoKHR5cGUpIHtcblx0XHRjYXNlIFwiU3RyaW5nXCI6XG5cdFx0XHRyZXR1cm4gbmV3IFN0cmluZ1ZhbHVlKC4uLmFyZ3MpO1xuXHRcdGNhc2UgXCJCb29sXCI6XG5cdFx0XHRyZXR1cm4gbmV3IEJvb2xWYWx1ZSguLi5hcmdzKTtcblx0XHRjYXNlIFwiRmxvYXRcIjpcblx0XHRcdHJldHVybiBuZXcgRmxvYXRWYWx1ZSguLi5hcmdzKTtcblx0XHRjYXNlIFwiRGF0ZVwiOlxuXHRcdFx0cmV0dXJuIG5ldyBEYXRlVmFsdWUoLi4uYXJncyk7XG5cdH1cbn1cblxubGV0IHAgPSB7XG5cdHZhbHVlOiBmdW5jdGlvbihmcmFnbWVudCwgdHlwZSwgLi4uYXJncykge1xuXHRcdGxldCB2YWx1ZSA9IHR5cGVvZiB0eXBlID09PSBcInN0cmluZ1wiID8gY3JlYXRlVmFsdWUodHlwZSwgLi4uYXJncykgOiB0eXBlO1xuXHRcdGZyYWdtZW50LmFkZFByb3BlcnR5VmFsdWUoXCJ2YWx1ZVwiLCB2YWx1ZSwgZnVuY3Rpb24odmFsdWUsIGVsKSB7XG5cdFx0XHRyZXR1cm4gKCkgPT4ge307XG5cdFx0fSk7XG5cdH0sXG5cdHRleHQ6IGZ1bmN0aW9uKGZyYWdtZW50LCB0ZXh0ID0gXCJcIikge1xuXHRcdGZyYWdtZW50LmFkZFByb3BlcnR5VmFsdWUoXCJ0ZXh0XCIsIG5ldyBTdHJpbmdWYWx1ZSh0ZXh0KSwgZnVuY3Rpb24odmFsdWUsIGVsKSB7XG5cdFx0XHRsZXQgY29udGVudCA9IFF1ZXJ5LmZpcnN0KCcuY29udGVudCcsIGVsKTtcblx0XHRcdHJldHVybiBEb20uc3RyZWFtKHZhbHVlKS5hcHBseVRleHQoY29udGVudCk7XG5cdFx0fSk7XG5cdH0sXG5cdHZpc2libGU6IGZ1bmN0aW9uKGZyYWdtZW50LCBkZWZhdWx0VmFsdWUgPSB0cnVlKSB7XG5cdFx0ZnJhZ21lbnQuYWRkUHJvcGVydHlWYWx1ZShcInZpc2libGVcIiwgbmV3IEJvb2xWYWx1ZShkZWZhdWx0VmFsdWUpLCBmdW5jdGlvbih2YWx1ZSwgZWwpIHtcblx0XHRcdHJldHVybiBEb20uc3RyZWFtKHZhbHVlKS5hcHBseURpc3BsYXkoZWwpO1xuXHRcdH0pO1xuXHR9LFxuXHRzdHJvbmc6IGFkZFN3YXBDbGFzc0ZyYWdtZW50KCdzdHJvbmcnKSxcblx0ZW1waGFzaXM6IGFkZFN3YXBDbGFzc0ZyYWdtZW50KCdlbXBoYXNpcycpLFxuXHRzdHJpa2U6IGFkZFN3YXBDbGFzc0ZyYWdtZW50KCdzdHJpa2UnKSxcblx0dG9vbHRpcDogYWRkQXR0cmlidXRlRnJhZ21lbnQoJ3Rvb2x0aXAnLCAndGl0bGUnKSxcblx0bGluazogZnVuY3Rpb24oZnJhZ21lbnQsIHVybCA9IFwiXCIpIHtcblx0XHRmcmFnbWVudC5hZGRQcm9wZXJ0eVZhbHVlKFwibGlua1wiLCBuZXcgU3RyaW5nVmFsdWUodXJsKSwgZnVuY3Rpb24odmFsdWUsIGVsKSB7XG5cdFx0XHRsZXQgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKSxcblx0XHRcdFx0xpIgPSAodXJsKSA9PiBhLmhyZWYgPSB1cmw7XG5cdFx0XHRhLnRhcmdldCA9IFwiX2JsYW5rXCI7XG5cdFx0XHRmb3IobGV0IGkgPSAwOyBpIDwgZWwuY2hpbGROb2Rlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRhLmFwcGVuZENoaWxkKGVsLmNoaWxkTm9kZXNbaV0pO1xuXHRcdFx0fVxuXHRcdFx0ZWwuYXBwZW5kQ2hpbGQoYSk7XG5cdFx0XHR2YWx1ZS5zdWJzY3JpYmUoxpIpO1xuXHRcdFx0cmV0dXJuICgpID0+IHtcblx0XHRcdFx0dmFsdWUudW5zdWJzY3JpYmUoxpIpO1xuXHRcdFx0XHRlbC5yZW1vdmVDaGlsZChhKTtcblx0XHRcdFx0Zm9yKGxldCBpID0gMDsgaSA8IGEuY2hpbGROb2Rlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdGVsLmFwcGVuZENoaWxkKGEuY2hpbGROb2Rlc1tpXSk7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFx0fSk7XG5cdH1cbn07XG5cbmxldCBQcm9wZXJ0aWVzID0ge1xuXG59O1xuXG5sZXQgRm9ybWF0cyA9IHtcblx0YWRkTnVtZXJpYyhmcmFnbWVudCwgZGVmYXVsdEZvcm1hdCA9IFwiXCIpIHtcblx0XHRsZXQgdmFsdWUgPSBmcmFnbWVudC52YWx1ZSxcblx0XHRcdHRleHQgID0gZnJhZ21lbnQudGV4dDtcblx0XHRpZighdmFsdWUpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihcIidmb3JtYXQnIHJlcXVpcmVzIHRoZSBwcm9wZXJ0eSAndmFsdWUnXCIpO1xuXHRcdH1cblx0XHRpZighdGV4dCkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiJ2Zvcm1hdCcgcmVxdWlyZXMgdGhlIHByb3BlcnR5ICd0ZXh0J1wiKTtcblx0XHR9XG5cdFx0ZnJhZ21lbnQuYWRkUHJvcGVydHlWYWx1ZShcImZvcm1hdFwiLCBuZXcgU3RyaW5nVmFsdWUoZGVmYXVsdEZvcm1hdCksIGZ1bmN0aW9uKGZvcm1hdCkge1xuXHRcdFx0bGV0IHN0cmVhbSA9IHZhbHVlLnppcChmb3JtYXQpO1xuXHRcdFx0c3RyZWFtLnNwcmVhZCgodmFsdWUsIGZvcm1hdCkgPT4ge1xuXHRcdFx0XHRcdGlmKGZvcm1hdCA9PT0gXCJcIikge1xuXHRcdFx0XHRcdFx0Zm9ybWF0ID0gTWF0aC5mbG9vcih2YWx1ZSkgPT09IHZhbHVlID8gXCIwLDBcIiA6IFwiMCwwLjAwMFwiO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR0ZXh0LnZhbHVlID0gbnVtZXJhbCh2YWx1ZSkuZm9ybWF0KGZvcm1hdCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIHN0cmVhbS5jYW5jZWwuYmluZChzdHJlYW0pO1xuXHRcdH0pO1xuXHR9LFxuXHRyZW1vdmUoZnJhZ21lbnQpIHtcblx0XHRmcmFnbWVudC5yZW1vdmVQcm9wZXJ0eSgnZm9ybWF0Jyk7XG5cdH1cbn1cblxuZm9yKGxldCBuYW1lIGluIHApIHtcblx0bGV0IGNhcCAgICAgICA9IHN0cmluZyhuYW1lKS5jYXBpdGFsaXplKCkucyxcblx0XHRrZXlSZW1vdmUgPSAncmVtb3ZlJyArIGNhcCxcblx0XHRrZXlBZGQgICAgPSAnYWRkJyArIGNhcDtcblx0UHJvcGVydGllc1trZXlBZGRdID0gcFtuYW1lXTtcblx0UHJvcGVydGllc1trZXlSZW1vdmVdID0gZnVuY3Rpb24oZnJhZ21lbnQpIHsgZnJhZ21lbnQucmVtb3ZlUHJvcGVydHkobmFtZSk7IH07XG59XG5cbmV4cG9ydCB7IFByb3BlcnRpZXMsIEZvcm1hdHMgfTsiLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcblxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG5wcm9jZXNzLm5leHRUaWNrID0gKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY2FuU2V0SW1tZWRpYXRlID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCdcbiAgICAmJiB3aW5kb3cuc2V0SW1tZWRpYXRlO1xuICAgIHZhciBjYW5Qb3N0ID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCdcbiAgICAmJiB3aW5kb3cucG9zdE1lc3NhZ2UgJiYgd2luZG93LmFkZEV2ZW50TGlzdGVuZXJcbiAgICA7XG5cbiAgICBpZiAoY2FuU2V0SW1tZWRpYXRlKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoZikgeyByZXR1cm4gd2luZG93LnNldEltbWVkaWF0ZShmKSB9O1xuICAgIH1cblxuICAgIGlmIChjYW5Qb3N0KSB7XG4gICAgICAgIHZhciBxdWV1ZSA9IFtdO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGZ1bmN0aW9uIChldikge1xuICAgICAgICAgICAgdmFyIHNvdXJjZSA9IGV2LnNvdXJjZTtcbiAgICAgICAgICAgIGlmICgoc291cmNlID09PSB3aW5kb3cgfHwgc291cmNlID09PSBudWxsKSAmJiBldi5kYXRhID09PSAncHJvY2Vzcy10aWNrJykge1xuICAgICAgICAgICAgICAgIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgIGlmIChxdWV1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBmbiA9IHF1ZXVlLnNoaWZ0KCk7XG4gICAgICAgICAgICAgICAgICAgIGZuKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LCB0cnVlKTtcblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gbmV4dFRpY2soZm4pIHtcbiAgICAgICAgICAgIHF1ZXVlLnB1c2goZm4pO1xuICAgICAgICAgICAgd2luZG93LnBvc3RNZXNzYWdlKCdwcm9jZXNzLXRpY2snLCAnKicpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbiBuZXh0VGljayhmbikge1xuICAgICAgICBzZXRUaW1lb3V0KGZuLCAwKTtcbiAgICB9O1xufSkoKTtcblxucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn1cblxuLy8gVE9ETyhzaHR5bG1hbilcbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCl7XG4oZnVuY3Rpb24oZ2xvYmFsKSB7XG4gICd1c2Ugc3RyaWN0JztcbiAgaWYgKGdsb2JhbC4kdHJhY2V1clJ1bnRpbWUpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgdmFyICRPYmplY3QgPSBPYmplY3Q7XG4gIHZhciAkVHlwZUVycm9yID0gVHlwZUVycm9yO1xuICB2YXIgJGNyZWF0ZSA9ICRPYmplY3QuY3JlYXRlO1xuICB2YXIgJGRlZmluZVByb3BlcnRpZXMgPSAkT2JqZWN0LmRlZmluZVByb3BlcnRpZXM7XG4gIHZhciAkZGVmaW5lUHJvcGVydHkgPSAkT2JqZWN0LmRlZmluZVByb3BlcnR5O1xuICB2YXIgJGZyZWV6ZSA9ICRPYmplY3QuZnJlZXplO1xuICB2YXIgJGdldE93blByb3BlcnR5RGVzY3JpcHRvciA9ICRPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO1xuICB2YXIgJGdldE93blByb3BlcnR5TmFtZXMgPSAkT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXM7XG4gIHZhciAkZ2V0UHJvdG90eXBlT2YgPSAkT2JqZWN0LmdldFByb3RvdHlwZU9mO1xuICB2YXIgJGhhc093blByb3BlcnR5ID0gJE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG4gIHZhciAkdG9TdHJpbmcgPSAkT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcbiAgZnVuY3Rpb24gbm9uRW51bSh2YWx1ZSkge1xuICAgIHJldHVybiB7XG4gICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgIHdyaXRhYmxlOiB0cnVlXG4gICAgfTtcbiAgfVxuICB2YXIgdHlwZXMgPSB7XG4gICAgdm9pZDogZnVuY3Rpb24gdm9pZFR5cGUoKSB7fSxcbiAgICBhbnk6IGZ1bmN0aW9uIGFueSgpIHt9LFxuICAgIHN0cmluZzogZnVuY3Rpb24gc3RyaW5nKCkge30sXG4gICAgbnVtYmVyOiBmdW5jdGlvbiBudW1iZXIoKSB7fSxcbiAgICBib29sZWFuOiBmdW5jdGlvbiBib29sZWFuKCkge31cbiAgfTtcbiAgdmFyIG1ldGhvZCA9IG5vbkVudW07XG4gIHZhciBjb3VudGVyID0gMDtcbiAgZnVuY3Rpb24gbmV3VW5pcXVlU3RyaW5nKCkge1xuICAgIHJldHVybiAnX18kJyArIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDFlOSkgKyAnJCcgKyArK2NvdW50ZXIgKyAnJF9fJztcbiAgfVxuICB2YXIgc3ltYm9sSW50ZXJuYWxQcm9wZXJ0eSA9IG5ld1VuaXF1ZVN0cmluZygpO1xuICB2YXIgc3ltYm9sRGVzY3JpcHRpb25Qcm9wZXJ0eSA9IG5ld1VuaXF1ZVN0cmluZygpO1xuICB2YXIgc3ltYm9sRGF0YVByb3BlcnR5ID0gbmV3VW5pcXVlU3RyaW5nKCk7XG4gIHZhciBzeW1ib2xWYWx1ZXMgPSAkY3JlYXRlKG51bGwpO1xuICBmdW5jdGlvbiBpc1N5bWJvbChzeW1ib2wpIHtcbiAgICByZXR1cm4gdHlwZW9mIHN5bWJvbCA9PT0gJ29iamVjdCcgJiYgc3ltYm9sIGluc3RhbmNlb2YgU3ltYm9sVmFsdWU7XG4gIH1cbiAgZnVuY3Rpb24gdHlwZU9mKHYpIHtcbiAgICBpZiAoaXNTeW1ib2wodikpXG4gICAgICByZXR1cm4gJ3N5bWJvbCc7XG4gICAgcmV0dXJuIHR5cGVvZiB2O1xuICB9XG4gIGZ1bmN0aW9uIFN5bWJvbChkZXNjcmlwdGlvbikge1xuICAgIHZhciB2YWx1ZSA9IG5ldyBTeW1ib2xWYWx1ZShkZXNjcmlwdGlvbik7XG4gICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIFN5bWJvbCkpXG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignU3ltYm9sIGNhbm5vdCBiZSBuZXdcXCdlZCcpO1xuICB9XG4gICRkZWZpbmVQcm9wZXJ0eShTeW1ib2wucHJvdG90eXBlLCAnY29uc3RydWN0b3InLCBub25FbnVtKFN5bWJvbCkpO1xuICAkZGVmaW5lUHJvcGVydHkoU3ltYm9sLnByb3RvdHlwZSwgJ3RvU3RyaW5nJywgbWV0aG9kKGZ1bmN0aW9uKCkge1xuICAgIHZhciBzeW1ib2xWYWx1ZSA9IHRoaXNbc3ltYm9sRGF0YVByb3BlcnR5XTtcbiAgICBpZiAoIWdldE9wdGlvbignc3ltYm9scycpKVxuICAgICAgcmV0dXJuIHN5bWJvbFZhbHVlW3N5bWJvbEludGVybmFsUHJvcGVydHldO1xuICAgIGlmICghc3ltYm9sVmFsdWUpXG4gICAgICB0aHJvdyBUeXBlRXJyb3IoJ0NvbnZlcnNpb24gZnJvbSBzeW1ib2wgdG8gc3RyaW5nJyk7XG4gICAgdmFyIGRlc2MgPSBzeW1ib2xWYWx1ZVtzeW1ib2xEZXNjcmlwdGlvblByb3BlcnR5XTtcbiAgICBpZiAoZGVzYyA9PT0gdW5kZWZpbmVkKVxuICAgICAgZGVzYyA9ICcnO1xuICAgIHJldHVybiAnU3ltYm9sKCcgKyBkZXNjICsgJyknO1xuICB9KSk7XG4gICRkZWZpbmVQcm9wZXJ0eShTeW1ib2wucHJvdG90eXBlLCAndmFsdWVPZicsIG1ldGhvZChmdW5jdGlvbigpIHtcbiAgICB2YXIgc3ltYm9sVmFsdWUgPSB0aGlzW3N5bWJvbERhdGFQcm9wZXJ0eV07XG4gICAgaWYgKCFzeW1ib2xWYWx1ZSlcbiAgICAgIHRocm93IFR5cGVFcnJvcignQ29udmVyc2lvbiBmcm9tIHN5bWJvbCB0byBzdHJpbmcnKTtcbiAgICBpZiAoIWdldE9wdGlvbignc3ltYm9scycpKVxuICAgICAgcmV0dXJuIHN5bWJvbFZhbHVlW3N5bWJvbEludGVybmFsUHJvcGVydHldO1xuICAgIHJldHVybiBzeW1ib2xWYWx1ZTtcbiAgfSkpO1xuICBmdW5jdGlvbiBTeW1ib2xWYWx1ZShkZXNjcmlwdGlvbikge1xuICAgIHZhciBrZXkgPSBuZXdVbmlxdWVTdHJpbmcoKTtcbiAgICAkZGVmaW5lUHJvcGVydHkodGhpcywgc3ltYm9sRGF0YVByb3BlcnR5LCB7dmFsdWU6IHRoaXN9KTtcbiAgICAkZGVmaW5lUHJvcGVydHkodGhpcywgc3ltYm9sSW50ZXJuYWxQcm9wZXJ0eSwge3ZhbHVlOiBrZXl9KTtcbiAgICAkZGVmaW5lUHJvcGVydHkodGhpcywgc3ltYm9sRGVzY3JpcHRpb25Qcm9wZXJ0eSwge3ZhbHVlOiBkZXNjcmlwdGlvbn0pO1xuICAgICRmcmVlemUodGhpcyk7XG4gICAgc3ltYm9sVmFsdWVzW2tleV0gPSB0aGlzO1xuICB9XG4gICRkZWZpbmVQcm9wZXJ0eShTeW1ib2xWYWx1ZS5wcm90b3R5cGUsICdjb25zdHJ1Y3RvcicsIG5vbkVudW0oU3ltYm9sKSk7XG4gICRkZWZpbmVQcm9wZXJ0eShTeW1ib2xWYWx1ZS5wcm90b3R5cGUsICd0b1N0cmluZycsIHtcbiAgICB2YWx1ZTogU3ltYm9sLnByb3RvdHlwZS50b1N0cmluZyxcbiAgICBlbnVtZXJhYmxlOiBmYWxzZVxuICB9KTtcbiAgJGRlZmluZVByb3BlcnR5KFN5bWJvbFZhbHVlLnByb3RvdHlwZSwgJ3ZhbHVlT2YnLCB7XG4gICAgdmFsdWU6IFN5bWJvbC5wcm90b3R5cGUudmFsdWVPZixcbiAgICBlbnVtZXJhYmxlOiBmYWxzZVxuICB9KTtcbiAgJGZyZWV6ZShTeW1ib2xWYWx1ZS5wcm90b3R5cGUpO1xuICBTeW1ib2wuaXRlcmF0b3IgPSBTeW1ib2woKTtcbiAgZnVuY3Rpb24gdG9Qcm9wZXJ0eShuYW1lKSB7XG4gICAgaWYgKGlzU3ltYm9sKG5hbWUpKVxuICAgICAgcmV0dXJuIG5hbWVbc3ltYm9sSW50ZXJuYWxQcm9wZXJ0eV07XG4gICAgcmV0dXJuIG5hbWU7XG4gIH1cbiAgZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlOYW1lcyhvYmplY3QpIHtcbiAgICB2YXIgcnYgPSBbXTtcbiAgICB2YXIgbmFtZXMgPSAkZ2V0T3duUHJvcGVydHlOYW1lcyhvYmplY3QpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbmFtZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBuYW1lID0gbmFtZXNbaV07XG4gICAgICBpZiAoIXN5bWJvbFZhbHVlc1tuYW1lXSlcbiAgICAgICAgcnYucHVzaChuYW1lKTtcbiAgICB9XG4gICAgcmV0dXJuIHJ2O1xuICB9XG4gIGZ1bmN0aW9uIGdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmplY3QsIG5hbWUpIHtcbiAgICByZXR1cm4gJGdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmplY3QsIHRvUHJvcGVydHkobmFtZSkpO1xuICB9XG4gIGZ1bmN0aW9uIGdldE93blByb3BlcnR5U3ltYm9scyhvYmplY3QpIHtcbiAgICB2YXIgcnYgPSBbXTtcbiAgICB2YXIgbmFtZXMgPSAkZ2V0T3duUHJvcGVydHlOYW1lcyhvYmplY3QpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbmFtZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBzeW1ib2wgPSBzeW1ib2xWYWx1ZXNbbmFtZXNbaV1dO1xuICAgICAgaWYgKHN5bWJvbClcbiAgICAgICAgcnYucHVzaChzeW1ib2wpO1xuICAgIH1cbiAgICByZXR1cm4gcnY7XG4gIH1cbiAgZnVuY3Rpb24gaGFzT3duUHJvcGVydHkobmFtZSkge1xuICAgIHJldHVybiAkaGFzT3duUHJvcGVydHkuY2FsbCh0aGlzLCB0b1Byb3BlcnR5KG5hbWUpKTtcbiAgfVxuICBmdW5jdGlvbiBnZXRPcHRpb24obmFtZSkge1xuICAgIHJldHVybiBnbG9iYWwudHJhY2V1ciAmJiBnbG9iYWwudHJhY2V1ci5vcHRpb25zW25hbWVdO1xuICB9XG4gIGZ1bmN0aW9uIHNldFByb3BlcnR5KG9iamVjdCwgbmFtZSwgdmFsdWUpIHtcbiAgICB2YXIgc3ltLFxuICAgICAgICBkZXNjO1xuICAgIGlmIChpc1N5bWJvbChuYW1lKSkge1xuICAgICAgc3ltID0gbmFtZTtcbiAgICAgIG5hbWUgPSBuYW1lW3N5bWJvbEludGVybmFsUHJvcGVydHldO1xuICAgIH1cbiAgICBvYmplY3RbbmFtZV0gPSB2YWx1ZTtcbiAgICBpZiAoc3ltICYmIChkZXNjID0gJGdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmplY3QsIG5hbWUpKSlcbiAgICAgICRkZWZpbmVQcm9wZXJ0eShvYmplY3QsIG5hbWUsIHtlbnVtZXJhYmxlOiBmYWxzZX0pO1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eShvYmplY3QsIG5hbWUsIGRlc2NyaXB0b3IpIHtcbiAgICBpZiAoaXNTeW1ib2wobmFtZSkpIHtcbiAgICAgIGlmIChkZXNjcmlwdG9yLmVudW1lcmFibGUpIHtcbiAgICAgICAgZGVzY3JpcHRvciA9ICRjcmVhdGUoZGVzY3JpcHRvciwge2VudW1lcmFibGU6IHt2YWx1ZTogZmFsc2V9fSk7XG4gICAgICB9XG4gICAgICBuYW1lID0gbmFtZVtzeW1ib2xJbnRlcm5hbFByb3BlcnR5XTtcbiAgICB9XG4gICAgJGRlZmluZVByb3BlcnR5KG9iamVjdCwgbmFtZSwgZGVzY3JpcHRvcik7XG4gICAgcmV0dXJuIG9iamVjdDtcbiAgfVxuICBmdW5jdGlvbiBwb2x5ZmlsbE9iamVjdChPYmplY3QpIHtcbiAgICAkZGVmaW5lUHJvcGVydHkoT2JqZWN0LCAnZGVmaW5lUHJvcGVydHknLCB7dmFsdWU6IGRlZmluZVByb3BlcnR5fSk7XG4gICAgJGRlZmluZVByb3BlcnR5KE9iamVjdCwgJ2dldE93blByb3BlcnR5TmFtZXMnLCB7dmFsdWU6IGdldE93blByb3BlcnR5TmFtZXN9KTtcbiAgICAkZGVmaW5lUHJvcGVydHkoT2JqZWN0LCAnZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yJywge3ZhbHVlOiBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3J9KTtcbiAgICAkZGVmaW5lUHJvcGVydHkoT2JqZWN0LnByb3RvdHlwZSwgJ2hhc093blByb3BlcnR5Jywge3ZhbHVlOiBoYXNPd25Qcm9wZXJ0eX0pO1xuICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPSBnZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG4gICAgZnVuY3Rpb24gaXMobGVmdCwgcmlnaHQpIHtcbiAgICAgIGlmIChsZWZ0ID09PSByaWdodClcbiAgICAgICAgcmV0dXJuIGxlZnQgIT09IDAgfHwgMSAvIGxlZnQgPT09IDEgLyByaWdodDtcbiAgICAgIHJldHVybiBsZWZ0ICE9PSBsZWZ0ICYmIHJpZ2h0ICE9PSByaWdodDtcbiAgICB9XG4gICAgJGRlZmluZVByb3BlcnR5KE9iamVjdCwgJ2lzJywgbWV0aG9kKGlzKSk7XG4gICAgZnVuY3Rpb24gYXNzaWduKHRhcmdldCwgc291cmNlKSB7XG4gICAgICB2YXIgcHJvcHMgPSAkZ2V0T3duUHJvcGVydHlOYW1lcyhzb3VyY2UpO1xuICAgICAgdmFyIHAsXG4gICAgICAgICAgbGVuZ3RoID0gcHJvcHMubGVuZ3RoO1xuICAgICAgZm9yIChwID0gMDsgcCA8IGxlbmd0aDsgcCsrKSB7XG4gICAgICAgIHRhcmdldFtwcm9wc1twXV0gPSBzb3VyY2VbcHJvcHNbcF1dO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICB9XG4gICAgJGRlZmluZVByb3BlcnR5KE9iamVjdCwgJ2Fzc2lnbicsIG1ldGhvZChhc3NpZ24pKTtcbiAgICBmdW5jdGlvbiBtaXhpbih0YXJnZXQsIHNvdXJjZSkge1xuICAgICAgdmFyIHByb3BzID0gJGdldE93blByb3BlcnR5TmFtZXMoc291cmNlKTtcbiAgICAgIHZhciBwLFxuICAgICAgICAgIGRlc2NyaXB0b3IsXG4gICAgICAgICAgbGVuZ3RoID0gcHJvcHMubGVuZ3RoO1xuICAgICAgZm9yIChwID0gMDsgcCA8IGxlbmd0aDsgcCsrKSB7XG4gICAgICAgIGRlc2NyaXB0b3IgPSAkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHNvdXJjZSwgcHJvcHNbcF0pO1xuICAgICAgICAkZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBwcm9wc1twXSwgZGVzY3JpcHRvcik7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGFyZ2V0O1xuICAgIH1cbiAgICAkZGVmaW5lUHJvcGVydHkoT2JqZWN0LCAnbWl4aW4nLCBtZXRob2QobWl4aW4pKTtcbiAgfVxuICBmdW5jdGlvbiBleHBvcnRTdGFyKG9iamVjdCkge1xuICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgbmFtZXMgPSAkZ2V0T3duUHJvcGVydHlOYW1lcyhhcmd1bWVudHNbaV0pO1xuICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBuYW1lcy5sZW5ndGg7IGorKykge1xuICAgICAgICAoZnVuY3Rpb24obW9kLCBuYW1lKSB7XG4gICAgICAgICAgJGRlZmluZVByb3BlcnR5KG9iamVjdCwgbmFtZSwge1xuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIG1vZFtuYW1lXTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pKGFyZ3VtZW50c1tpXSwgbmFtZXNbal0pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb2JqZWN0O1xuICB9XG4gIGZ1bmN0aW9uIHRvT2JqZWN0KHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlID09IG51bGwpXG4gICAgICB0aHJvdyAkVHlwZUVycm9yKCk7XG4gICAgcmV0dXJuICRPYmplY3QodmFsdWUpO1xuICB9XG4gIGZ1bmN0aW9uIHNwcmVhZCgpIHtcbiAgICB2YXIgcnYgPSBbXSxcbiAgICAgICAgayA9IDA7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciB2YWx1ZVRvU3ByZWFkID0gdG9PYmplY3QoYXJndW1lbnRzW2ldKTtcbiAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgdmFsdWVUb1NwcmVhZC5sZW5ndGg7IGorKykge1xuICAgICAgICBydltrKytdID0gdmFsdWVUb1NwcmVhZFtqXTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJ2O1xuICB9XG4gIGZ1bmN0aW9uIGdldFByb3BlcnR5RGVzY3JpcHRvcihvYmplY3QsIG5hbWUpIHtcbiAgICB3aGlsZSAob2JqZWN0ICE9PSBudWxsKSB7XG4gICAgICB2YXIgcmVzdWx0ID0gJGdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmplY3QsIG5hbWUpO1xuICAgICAgaWYgKHJlc3VsdClcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIG9iamVjdCA9ICRnZXRQcm90b3R5cGVPZihvYmplY3QpO1xuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG4gIGZ1bmN0aW9uIHN1cGVyRGVzY3JpcHRvcihob21lT2JqZWN0LCBuYW1lKSB7XG4gICAgdmFyIHByb3RvID0gJGdldFByb3RvdHlwZU9mKGhvbWVPYmplY3QpO1xuICAgIGlmICghcHJvdG8pXG4gICAgICB0aHJvdyAkVHlwZUVycm9yKCdzdXBlciBpcyBudWxsJyk7XG4gICAgcmV0dXJuIGdldFByb3BlcnR5RGVzY3JpcHRvcihwcm90bywgbmFtZSk7XG4gIH1cbiAgZnVuY3Rpb24gc3VwZXJDYWxsKHNlbGYsIGhvbWVPYmplY3QsIG5hbWUsIGFyZ3MpIHtcbiAgICB2YXIgZGVzY3JpcHRvciA9IHN1cGVyRGVzY3JpcHRvcihob21lT2JqZWN0LCBuYW1lKTtcbiAgICBpZiAoZGVzY3JpcHRvcikge1xuICAgICAgaWYgKCd2YWx1ZScgaW4gZGVzY3JpcHRvcilcbiAgICAgICAgcmV0dXJuIGRlc2NyaXB0b3IudmFsdWUuYXBwbHkoc2VsZiwgYXJncyk7XG4gICAgICBpZiAoZGVzY3JpcHRvci5nZXQpXG4gICAgICAgIHJldHVybiBkZXNjcmlwdG9yLmdldC5jYWxsKHNlbGYpLmFwcGx5KHNlbGYsIGFyZ3MpO1xuICAgIH1cbiAgICB0aHJvdyAkVHlwZUVycm9yKFwic3VwZXIgaGFzIG5vIG1ldGhvZCAnXCIgKyBuYW1lICsgXCInLlwiKTtcbiAgfVxuICBmdW5jdGlvbiBzdXBlckdldChzZWxmLCBob21lT2JqZWN0LCBuYW1lKSB7XG4gICAgdmFyIGRlc2NyaXB0b3IgPSBzdXBlckRlc2NyaXB0b3IoaG9tZU9iamVjdCwgbmFtZSk7XG4gICAgaWYgKGRlc2NyaXB0b3IpIHtcbiAgICAgIGlmIChkZXNjcmlwdG9yLmdldClcbiAgICAgICAgcmV0dXJuIGRlc2NyaXB0b3IuZ2V0LmNhbGwoc2VsZik7XG4gICAgICBlbHNlIGlmICgndmFsdWUnIGluIGRlc2NyaXB0b3IpXG4gICAgICAgIHJldHVybiBkZXNjcmlwdG9yLnZhbHVlO1xuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG4gIGZ1bmN0aW9uIHN1cGVyU2V0KHNlbGYsIGhvbWVPYmplY3QsIG5hbWUsIHZhbHVlKSB7XG4gICAgdmFyIGRlc2NyaXB0b3IgPSBzdXBlckRlc2NyaXB0b3IoaG9tZU9iamVjdCwgbmFtZSk7XG4gICAgaWYgKGRlc2NyaXB0b3IgJiYgZGVzY3JpcHRvci5zZXQpIHtcbiAgICAgIGRlc2NyaXB0b3Iuc2V0LmNhbGwoc2VsZiwgdmFsdWUpO1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cbiAgICB0aHJvdyAkVHlwZUVycm9yKFwic3VwZXIgaGFzIG5vIHNldHRlciAnXCIgKyBuYW1lICsgXCInLlwiKTtcbiAgfVxuICBmdW5jdGlvbiBnZXREZXNjcmlwdG9ycyhvYmplY3QpIHtcbiAgICB2YXIgZGVzY3JpcHRvcnMgPSB7fSxcbiAgICAgICAgbmFtZSxcbiAgICAgICAgbmFtZXMgPSAkZ2V0T3duUHJvcGVydHlOYW1lcyhvYmplY3QpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbmFtZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBuYW1lID0gbmFtZXNbaV07XG4gICAgICBkZXNjcmlwdG9yc1tuYW1lXSA9ICRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqZWN0LCBuYW1lKTtcbiAgICB9XG4gICAgcmV0dXJuIGRlc2NyaXB0b3JzO1xuICB9XG4gIGZ1bmN0aW9uIGNyZWF0ZUNsYXNzKGN0b3IsIG9iamVjdCwgc3RhdGljT2JqZWN0LCBzdXBlckNsYXNzKSB7XG4gICAgJGRlZmluZVByb3BlcnR5KG9iamVjdCwgJ2NvbnN0cnVjdG9yJywge1xuICAgICAgdmFsdWU6IGN0b3IsXG4gICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgIHdyaXRhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAzKSB7XG4gICAgICBpZiAodHlwZW9mIHN1cGVyQ2xhc3MgPT09ICdmdW5jdGlvbicpXG4gICAgICAgIGN0b3IuX19wcm90b19fID0gc3VwZXJDbGFzcztcbiAgICAgIGN0b3IucHJvdG90eXBlID0gJGNyZWF0ZShnZXRQcm90b1BhcmVudChzdXBlckNsYXNzKSwgZ2V0RGVzY3JpcHRvcnMob2JqZWN0KSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGN0b3IucHJvdG90eXBlID0gb2JqZWN0O1xuICAgIH1cbiAgICAkZGVmaW5lUHJvcGVydHkoY3RvciwgJ3Byb3RvdHlwZScsIHtcbiAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICB3cml0YWJsZTogZmFsc2VcbiAgICB9KTtcbiAgICByZXR1cm4gJGRlZmluZVByb3BlcnRpZXMoY3RvciwgZ2V0RGVzY3JpcHRvcnMoc3RhdGljT2JqZWN0KSk7XG4gIH1cbiAgZnVuY3Rpb24gZ2V0UHJvdG9QYXJlbnQoc3VwZXJDbGFzcykge1xuICAgIGlmICh0eXBlb2Ygc3VwZXJDbGFzcyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdmFyIHByb3RvdHlwZSA9IHN1cGVyQ2xhc3MucHJvdG90eXBlO1xuICAgICAgaWYgKCRPYmplY3QocHJvdG90eXBlKSA9PT0gcHJvdG90eXBlIHx8IHByb3RvdHlwZSA9PT0gbnVsbClcbiAgICAgICAgcmV0dXJuIHN1cGVyQ2xhc3MucHJvdG90eXBlO1xuICAgIH1cbiAgICBpZiAoc3VwZXJDbGFzcyA9PT0gbnVsbClcbiAgICAgIHJldHVybiBudWxsO1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoKTtcbiAgfVxuICBmdW5jdGlvbiBkZWZhdWx0U3VwZXJDYWxsKHNlbGYsIGhvbWVPYmplY3QsIGFyZ3MpIHtcbiAgICBpZiAoJGdldFByb3RvdHlwZU9mKGhvbWVPYmplY3QpICE9PSBudWxsKVxuICAgICAgc3VwZXJDYWxsKHNlbGYsIGhvbWVPYmplY3QsICdjb25zdHJ1Y3RvcicsIGFyZ3MpO1xuICB9XG4gIHZhciBTVF9ORVdCT1JOID0gMDtcbiAgdmFyIFNUX0VYRUNVVElORyA9IDE7XG4gIHZhciBTVF9TVVNQRU5ERUQgPSAyO1xuICB2YXIgU1RfQ0xPU0VEID0gMztcbiAgdmFyIEVORF9TVEFURSA9IC0yO1xuICB2YXIgUkVUSFJPV19TVEFURSA9IC0zO1xuICBmdW5jdGlvbiBhZGRJdGVyYXRvcihvYmplY3QpIHtcbiAgICByZXR1cm4gZGVmaW5lUHJvcGVydHkob2JqZWN0LCBTeW1ib2wuaXRlcmF0b3IsIG5vbkVudW0oZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9KSk7XG4gIH1cbiAgZnVuY3Rpb24gZ2V0SW50ZXJuYWxFcnJvcihzdGF0ZSkge1xuICAgIHJldHVybiBuZXcgRXJyb3IoJ1RyYWNldXIgY29tcGlsZXIgYnVnOiBpbnZhbGlkIHN0YXRlIGluIHN0YXRlIG1hY2hpbmU6ICcgKyBzdGF0ZSk7XG4gIH1cbiAgZnVuY3Rpb24gR2VuZXJhdG9yQ29udGV4dCgpIHtcbiAgICB0aGlzLnN0YXRlID0gMDtcbiAgICB0aGlzLkdTdGF0ZSA9IFNUX05FV0JPUk47XG4gICAgdGhpcy5zdG9yZWRFeGNlcHRpb24gPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5maW5hbGx5RmFsbFRocm91Z2ggPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5zZW50XyA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLnJldHVyblZhbHVlID0gdW5kZWZpbmVkO1xuICAgIHRoaXMudHJ5U3RhY2tfID0gW107XG4gIH1cbiAgR2VuZXJhdG9yQ29udGV4dC5wcm90b3R5cGUgPSB7XG4gICAgcHVzaFRyeTogZnVuY3Rpb24oY2F0Y2hTdGF0ZSwgZmluYWxseVN0YXRlKSB7XG4gICAgICBpZiAoZmluYWxseVN0YXRlICE9PSBudWxsKSB7XG4gICAgICAgIHZhciBmaW5hbGx5RmFsbFRocm91Z2ggPSBudWxsO1xuICAgICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlTdGFja18ubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICBpZiAodGhpcy50cnlTdGFja19baV0uY2F0Y2ggIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgZmluYWxseUZhbGxUaHJvdWdoID0gdGhpcy50cnlTdGFja19baV0uY2F0Y2g7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZpbmFsbHlGYWxsVGhyb3VnaCA9PT0gbnVsbClcbiAgICAgICAgICBmaW5hbGx5RmFsbFRocm91Z2ggPSBSRVRIUk9XX1NUQVRFO1xuICAgICAgICB0aGlzLnRyeVN0YWNrXy5wdXNoKHtcbiAgICAgICAgICBmaW5hbGx5OiBmaW5hbGx5U3RhdGUsXG4gICAgICAgICAgZmluYWxseUZhbGxUaHJvdWdoOiBmaW5hbGx5RmFsbFRocm91Z2hcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBpZiAoY2F0Y2hTdGF0ZSAhPT0gbnVsbCkge1xuICAgICAgICB0aGlzLnRyeVN0YWNrXy5wdXNoKHtjYXRjaDogY2F0Y2hTdGF0ZX0pO1xuICAgICAgfVxuICAgIH0sXG4gICAgcG9wVHJ5OiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMudHJ5U3RhY2tfLnBvcCgpO1xuICAgIH0sXG4gICAgZ2V0IHNlbnQoKSB7XG4gICAgICB0aGlzLm1heWJlVGhyb3coKTtcbiAgICAgIHJldHVybiB0aGlzLnNlbnRfO1xuICAgIH0sXG4gICAgc2V0IHNlbnQodikge1xuICAgICAgdGhpcy5zZW50XyA9IHY7XG4gICAgfSxcbiAgICBnZXQgc2VudElnbm9yZVRocm93KCkge1xuICAgICAgcmV0dXJuIHRoaXMuc2VudF87XG4gICAgfSxcbiAgICBtYXliZVRocm93OiBmdW5jdGlvbigpIHtcbiAgICAgIGlmICh0aGlzLmFjdGlvbiA9PT0gJ3Rocm93Jykge1xuICAgICAgICB0aGlzLmFjdGlvbiA9ICduZXh0JztcbiAgICAgICAgdGhyb3cgdGhpcy5zZW50XztcbiAgICAgIH1cbiAgICB9LFxuICAgIGVuZDogZnVuY3Rpb24oKSB7XG4gICAgICBzd2l0Y2ggKHRoaXMuc3RhdGUpIHtcbiAgICAgICAgY2FzZSBFTkRfU1RBVEU6XG4gICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIGNhc2UgUkVUSFJPV19TVEFURTpcbiAgICAgICAgICB0aHJvdyB0aGlzLnN0b3JlZEV4Y2VwdGlvbjtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICB0aHJvdyBnZXRJbnRlcm5hbEVycm9yKHRoaXMuc3RhdGUpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbiAgZnVuY3Rpb24gZ2V0TmV4dE9yVGhyb3coY3R4LCBtb3ZlTmV4dCwgYWN0aW9uKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHgpIHtcbiAgICAgIHN3aXRjaCAoY3R4LkdTdGF0ZSkge1xuICAgICAgICBjYXNlIFNUX0VYRUNVVElORzpcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoKFwiXFxcIlwiICsgYWN0aW9uICsgXCJcXFwiIG9uIGV4ZWN1dGluZyBnZW5lcmF0b3JcIikpO1xuICAgICAgICBjYXNlIFNUX0NMT1NFRDpcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoKFwiXFxcIlwiICsgYWN0aW9uICsgXCJcXFwiIG9uIGNsb3NlZCBnZW5lcmF0b3JcIikpO1xuICAgICAgICBjYXNlIFNUX05FV0JPUk46XG4gICAgICAgICAgaWYgKGFjdGlvbiA9PT0gJ3Rocm93Jykge1xuICAgICAgICAgICAgY3R4LkdTdGF0ZSA9IFNUX0NMT1NFRDtcbiAgICAgICAgICAgIHRocm93IHg7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh4ICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICB0aHJvdyAkVHlwZUVycm9yKCdTZW50IHZhbHVlIHRvIG5ld2Jvcm4gZ2VuZXJhdG9yJyk7XG4gICAgICAgIGNhc2UgU1RfU1VTUEVOREVEOlxuICAgICAgICAgIGN0eC5HU3RhdGUgPSBTVF9FWEVDVVRJTkc7XG4gICAgICAgICAgY3R4LmFjdGlvbiA9IGFjdGlvbjtcbiAgICAgICAgICBjdHguc2VudCA9IHg7XG4gICAgICAgICAgdmFyIHZhbHVlID0gbW92ZU5leHQoY3R4KTtcbiAgICAgICAgICB2YXIgZG9uZSA9IHZhbHVlID09PSBjdHg7XG4gICAgICAgICAgaWYgKGRvbmUpXG4gICAgICAgICAgICB2YWx1ZSA9IGN0eC5yZXR1cm5WYWx1ZTtcbiAgICAgICAgICBjdHguR1N0YXRlID0gZG9uZSA/IFNUX0NMT1NFRCA6IFNUX1NVU1BFTkRFRDtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICAgICAgZG9uZTogZG9uZVxuICAgICAgICAgIH07XG4gICAgICB9XG4gICAgfTtcbiAgfVxuICBmdW5jdGlvbiBnZW5lcmF0b3JXcmFwKGlubmVyRnVuY3Rpb24sIHNlbGYpIHtcbiAgICB2YXIgbW92ZU5leHQgPSBnZXRNb3ZlTmV4dChpbm5lckZ1bmN0aW9uLCBzZWxmKTtcbiAgICB2YXIgY3R4ID0gbmV3IEdlbmVyYXRvckNvbnRleHQoKTtcbiAgICByZXR1cm4gYWRkSXRlcmF0b3Ioe1xuICAgICAgbmV4dDogZ2V0TmV4dE9yVGhyb3coY3R4LCBtb3ZlTmV4dCwgJ25leHQnKSxcbiAgICAgIHRocm93OiBnZXROZXh0T3JUaHJvdyhjdHgsIG1vdmVOZXh0LCAndGhyb3cnKVxuICAgIH0pO1xuICB9XG4gIGZ1bmN0aW9uIEFzeW5jRnVuY3Rpb25Db250ZXh0KCkge1xuICAgIEdlbmVyYXRvckNvbnRleHQuY2FsbCh0aGlzKTtcbiAgICB0aGlzLmVyciA9IHVuZGVmaW5lZDtcbiAgICB2YXIgY3R4ID0gdGhpcztcbiAgICBjdHgucmVzdWx0ID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICBjdHgucmVzb2x2ZSA9IHJlc29sdmU7XG4gICAgICBjdHgucmVqZWN0ID0gcmVqZWN0O1xuICAgIH0pO1xuICB9XG4gIEFzeW5jRnVuY3Rpb25Db250ZXh0LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoR2VuZXJhdG9yQ29udGV4dC5wcm90b3R5cGUpO1xuICBBc3luY0Z1bmN0aW9uQ29udGV4dC5wcm90b3R5cGUuZW5kID0gZnVuY3Rpb24oKSB7XG4gICAgc3dpdGNoICh0aGlzLnN0YXRlKSB7XG4gICAgICBjYXNlIEVORF9TVEFURTpcbiAgICAgICAgcmV0dXJuO1xuICAgICAgY2FzZSBSRVRIUk9XX1NUQVRFOlxuICAgICAgICB0aGlzLnJlamVjdCh0aGlzLnN0b3JlZEV4Y2VwdGlvbik7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aGlzLnJlamVjdChnZXRJbnRlcm5hbEVycm9yKHRoaXMuc3RhdGUpKTtcbiAgICB9XG4gIH07XG4gIGZ1bmN0aW9uIGFzeW5jV3JhcChpbm5lckZ1bmN0aW9uLCBzZWxmKSB7XG4gICAgdmFyIG1vdmVOZXh0ID0gZ2V0TW92ZU5leHQoaW5uZXJGdW5jdGlvbiwgc2VsZik7XG4gICAgdmFyIGN0eCA9IG5ldyBBc3luY0Z1bmN0aW9uQ29udGV4dCgpO1xuICAgIGN0eC5jcmVhdGVDYWxsYmFjayA9IGZ1bmN0aW9uKG5ld1N0YXRlKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgY3R4LnN0YXRlID0gbmV3U3RhdGU7XG4gICAgICAgIGN0eC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICBtb3ZlTmV4dChjdHgpO1xuICAgICAgfTtcbiAgICB9O1xuICAgIGN0eC5jcmVhdGVFcnJiYWNrID0gZnVuY3Rpb24obmV3U3RhdGUpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgY3R4LnN0YXRlID0gbmV3U3RhdGU7XG4gICAgICAgIGN0eC5lcnIgPSBlcnI7XG4gICAgICAgIG1vdmVOZXh0KGN0eCk7XG4gICAgICB9O1xuICAgIH07XG4gICAgbW92ZU5leHQoY3R4KTtcbiAgICByZXR1cm4gY3R4LnJlc3VsdDtcbiAgfVxuICBmdW5jdGlvbiBnZXRNb3ZlTmV4dChpbm5lckZ1bmN0aW9uLCBzZWxmKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKGN0eCkge1xuICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICByZXR1cm4gaW5uZXJGdW5jdGlvbi5jYWxsKHNlbGYsIGN0eCk7XG4gICAgICAgIH0gY2F0Y2ggKGV4KSB7XG4gICAgICAgICAgY3R4LnN0b3JlZEV4Y2VwdGlvbiA9IGV4O1xuICAgICAgICAgIHZhciBsYXN0ID0gY3R4LnRyeVN0YWNrX1tjdHgudHJ5U3RhY2tfLmxlbmd0aCAtIDFdO1xuICAgICAgICAgIGlmICghbGFzdCkge1xuICAgICAgICAgICAgY3R4LkdTdGF0ZSA9IFNUX0NMT1NFRDtcbiAgICAgICAgICAgIGN0eC5zdGF0ZSA9IEVORF9TVEFURTtcbiAgICAgICAgICAgIHRocm93IGV4O1xuICAgICAgICAgIH1cbiAgICAgICAgICBjdHguc3RhdGUgPSBsYXN0LmNhdGNoICE9PSB1bmRlZmluZWQgPyBsYXN0LmNhdGNoIDogbGFzdC5maW5hbGx5O1xuICAgICAgICAgIGlmIChsYXN0LmZpbmFsbHlGYWxsVGhyb3VnaCAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgY3R4LmZpbmFsbHlGYWxsVGhyb3VnaCA9IGxhc3QuZmluYWxseUZhbGxUaHJvdWdoO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgfVxuICBmdW5jdGlvbiBzZXR1cEdsb2JhbHMoZ2xvYmFsKSB7XG4gICAgZ2xvYmFsLlN5bWJvbCA9IFN5bWJvbDtcbiAgICBwb2x5ZmlsbE9iamVjdChnbG9iYWwuT2JqZWN0KTtcbiAgfVxuICBzZXR1cEdsb2JhbHMoZ2xvYmFsKTtcbiAgZ2xvYmFsLiR0cmFjZXVyUnVudGltZSA9IHtcbiAgICBhc3luY1dyYXA6IGFzeW5jV3JhcCxcbiAgICBjcmVhdGVDbGFzczogY3JlYXRlQ2xhc3MsXG4gICAgZGVmYXVsdFN1cGVyQ2FsbDogZGVmYXVsdFN1cGVyQ2FsbCxcbiAgICBleHBvcnRTdGFyOiBleHBvcnRTdGFyLFxuICAgIGdlbmVyYXRvcldyYXA6IGdlbmVyYXRvcldyYXAsXG4gICAgc2V0UHJvcGVydHk6IHNldFByb3BlcnR5LFxuICAgIHNldHVwR2xvYmFsczogc2V0dXBHbG9iYWxzLFxuICAgIHNwcmVhZDogc3ByZWFkLFxuICAgIHN1cGVyQ2FsbDogc3VwZXJDYWxsLFxuICAgIHN1cGVyR2V0OiBzdXBlckdldCxcbiAgICBzdXBlclNldDogc3VwZXJTZXQsXG4gICAgdG9PYmplY3Q6IHRvT2JqZWN0LFxuICAgIHRvUHJvcGVydHk6IHRvUHJvcGVydHksXG4gICAgdHlwZTogdHlwZXMsXG4gICAgdHlwZW9mOiB0eXBlT2ZcbiAgfTtcbn0pKHR5cGVvZiBnbG9iYWwgIT09ICd1bmRlZmluZWQnID8gZ2xvYmFsIDogdGhpcyk7XG4oZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIGJ1aWxkRnJvbUVuY29kZWRQYXJ0cyhvcHRfc2NoZW1lLCBvcHRfdXNlckluZm8sIG9wdF9kb21haW4sIG9wdF9wb3J0LCBvcHRfcGF0aCwgb3B0X3F1ZXJ5RGF0YSwgb3B0X2ZyYWdtZW50KSB7XG4gICAgdmFyIG91dCA9IFtdO1xuICAgIGlmIChvcHRfc2NoZW1lKSB7XG4gICAgICBvdXQucHVzaChvcHRfc2NoZW1lLCAnOicpO1xuICAgIH1cbiAgICBpZiAob3B0X2RvbWFpbikge1xuICAgICAgb3V0LnB1c2goJy8vJyk7XG4gICAgICBpZiAob3B0X3VzZXJJbmZvKSB7XG4gICAgICAgIG91dC5wdXNoKG9wdF91c2VySW5mbywgJ0AnKTtcbiAgICAgIH1cbiAgICAgIG91dC5wdXNoKG9wdF9kb21haW4pO1xuICAgICAgaWYgKG9wdF9wb3J0KSB7XG4gICAgICAgIG91dC5wdXNoKCc6Jywgb3B0X3BvcnQpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAob3B0X3BhdGgpIHtcbiAgICAgIG91dC5wdXNoKG9wdF9wYXRoKTtcbiAgICB9XG4gICAgaWYgKG9wdF9xdWVyeURhdGEpIHtcbiAgICAgIG91dC5wdXNoKCc/Jywgb3B0X3F1ZXJ5RGF0YSk7XG4gICAgfVxuICAgIGlmIChvcHRfZnJhZ21lbnQpIHtcbiAgICAgIG91dC5wdXNoKCcjJywgb3B0X2ZyYWdtZW50KTtcbiAgICB9XG4gICAgcmV0dXJuIG91dC5qb2luKCcnKTtcbiAgfVxuICA7XG4gIHZhciBzcGxpdFJlID0gbmV3IFJlZ0V4cCgnXicgKyAnKD86JyArICcoW146Lz8jLl0rKScgKyAnOik/JyArICcoPzovLycgKyAnKD86KFteLz8jXSopQCk/JyArICcoW1xcXFx3XFxcXGRcXFxcLVxcXFx1MDEwMC1cXFxcdWZmZmYuJV0qKScgKyAnKD86OihbMC05XSspKT8nICsgJyk/JyArICcoW14/I10rKT8nICsgJyg/OlxcXFw/KFteI10qKSk/JyArICcoPzojKC4qKSk/JyArICckJyk7XG4gIHZhciBDb21wb25lbnRJbmRleCA9IHtcbiAgICBTQ0hFTUU6IDEsXG4gICAgVVNFUl9JTkZPOiAyLFxuICAgIERPTUFJTjogMyxcbiAgICBQT1JUOiA0LFxuICAgIFBBVEg6IDUsXG4gICAgUVVFUllfREFUQTogNixcbiAgICBGUkFHTUVOVDogN1xuICB9O1xuICBmdW5jdGlvbiBzcGxpdCh1cmkpIHtcbiAgICByZXR1cm4gKHVyaS5tYXRjaChzcGxpdFJlKSk7XG4gIH1cbiAgZnVuY3Rpb24gcmVtb3ZlRG90U2VnbWVudHMocGF0aCkge1xuICAgIGlmIChwYXRoID09PSAnLycpXG4gICAgICByZXR1cm4gJy8nO1xuICAgIHZhciBsZWFkaW5nU2xhc2ggPSBwYXRoWzBdID09PSAnLycgPyAnLycgOiAnJztcbiAgICB2YXIgdHJhaWxpbmdTbGFzaCA9IHBhdGguc2xpY2UoLTEpID09PSAnLycgPyAnLycgOiAnJztcbiAgICB2YXIgc2VnbWVudHMgPSBwYXRoLnNwbGl0KCcvJyk7XG4gICAgdmFyIG91dCA9IFtdO1xuICAgIHZhciB1cCA9IDA7XG4gICAgZm9yICh2YXIgcG9zID0gMDsgcG9zIDwgc2VnbWVudHMubGVuZ3RoOyBwb3MrKykge1xuICAgICAgdmFyIHNlZ21lbnQgPSBzZWdtZW50c1twb3NdO1xuICAgICAgc3dpdGNoIChzZWdtZW50KSB7XG4gICAgICAgIGNhc2UgJyc6XG4gICAgICAgIGNhc2UgJy4nOlxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICcuLic6XG4gICAgICAgICAgaWYgKG91dC5sZW5ndGgpXG4gICAgICAgICAgICBvdXQucG9wKCk7XG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgdXArKztcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICBvdXQucHVzaChzZWdtZW50KTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKCFsZWFkaW5nU2xhc2gpIHtcbiAgICAgIHdoaWxlICh1cC0tID4gMCkge1xuICAgICAgICBvdXQudW5zaGlmdCgnLi4nKTtcbiAgICAgIH1cbiAgICAgIGlmIChvdXQubGVuZ3RoID09PSAwKVxuICAgICAgICBvdXQucHVzaCgnLicpO1xuICAgIH1cbiAgICByZXR1cm4gbGVhZGluZ1NsYXNoICsgb3V0LmpvaW4oJy8nKSArIHRyYWlsaW5nU2xhc2g7XG4gIH1cbiAgZnVuY3Rpb24gam9pbkFuZENhbm9uaWNhbGl6ZVBhdGgocGFydHMpIHtcbiAgICB2YXIgcGF0aCA9IHBhcnRzW0NvbXBvbmVudEluZGV4LlBBVEhdIHx8ICcnO1xuICAgIHBhdGggPSByZW1vdmVEb3RTZWdtZW50cyhwYXRoKTtcbiAgICBwYXJ0c1tDb21wb25lbnRJbmRleC5QQVRIXSA9IHBhdGg7XG4gICAgcmV0dXJuIGJ1aWxkRnJvbUVuY29kZWRQYXJ0cyhwYXJ0c1tDb21wb25lbnRJbmRleC5TQ0hFTUVdLCBwYXJ0c1tDb21wb25lbnRJbmRleC5VU0VSX0lORk9dLCBwYXJ0c1tDb21wb25lbnRJbmRleC5ET01BSU5dLCBwYXJ0c1tDb21wb25lbnRJbmRleC5QT1JUXSwgcGFydHNbQ29tcG9uZW50SW5kZXguUEFUSF0sIHBhcnRzW0NvbXBvbmVudEluZGV4LlFVRVJZX0RBVEFdLCBwYXJ0c1tDb21wb25lbnRJbmRleC5GUkFHTUVOVF0pO1xuICB9XG4gIGZ1bmN0aW9uIGNhbm9uaWNhbGl6ZVVybCh1cmwpIHtcbiAgICB2YXIgcGFydHMgPSBzcGxpdCh1cmwpO1xuICAgIHJldHVybiBqb2luQW5kQ2Fub25pY2FsaXplUGF0aChwYXJ0cyk7XG4gIH1cbiAgZnVuY3Rpb24gcmVzb2x2ZVVybChiYXNlLCB1cmwpIHtcbiAgICB2YXIgcGFydHMgPSBzcGxpdCh1cmwpO1xuICAgIHZhciBiYXNlUGFydHMgPSBzcGxpdChiYXNlKTtcbiAgICBpZiAocGFydHNbQ29tcG9uZW50SW5kZXguU0NIRU1FXSkge1xuICAgICAgcmV0dXJuIGpvaW5BbmRDYW5vbmljYWxpemVQYXRoKHBhcnRzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcGFydHNbQ29tcG9uZW50SW5kZXguU0NIRU1FXSA9IGJhc2VQYXJ0c1tDb21wb25lbnRJbmRleC5TQ0hFTUVdO1xuICAgIH1cbiAgICBmb3IgKHZhciBpID0gQ29tcG9uZW50SW5kZXguU0NIRU1FOyBpIDw9IENvbXBvbmVudEluZGV4LlBPUlQ7IGkrKykge1xuICAgICAgaWYgKCFwYXJ0c1tpXSkge1xuICAgICAgICBwYXJ0c1tpXSA9IGJhc2VQYXJ0c1tpXTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHBhcnRzW0NvbXBvbmVudEluZGV4LlBBVEhdWzBdID09ICcvJykge1xuICAgICAgcmV0dXJuIGpvaW5BbmRDYW5vbmljYWxpemVQYXRoKHBhcnRzKTtcbiAgICB9XG4gICAgdmFyIHBhdGggPSBiYXNlUGFydHNbQ29tcG9uZW50SW5kZXguUEFUSF07XG4gICAgdmFyIGluZGV4ID0gcGF0aC5sYXN0SW5kZXhPZignLycpO1xuICAgIHBhdGggPSBwYXRoLnNsaWNlKDAsIGluZGV4ICsgMSkgKyBwYXJ0c1tDb21wb25lbnRJbmRleC5QQVRIXTtcbiAgICBwYXJ0c1tDb21wb25lbnRJbmRleC5QQVRIXSA9IHBhdGg7XG4gICAgcmV0dXJuIGpvaW5BbmRDYW5vbmljYWxpemVQYXRoKHBhcnRzKTtcbiAgfVxuICBmdW5jdGlvbiBpc0Fic29sdXRlKG5hbWUpIHtcbiAgICBpZiAoIW5hbWUpXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgaWYgKG5hbWVbMF0gPT09ICcvJylcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIHZhciBwYXJ0cyA9IHNwbGl0KG5hbWUpO1xuICAgIGlmIChwYXJ0c1tDb21wb25lbnRJbmRleC5TQ0hFTUVdKVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gICR0cmFjZXVyUnVudGltZS5jYW5vbmljYWxpemVVcmwgPSBjYW5vbmljYWxpemVVcmw7XG4gICR0cmFjZXVyUnVudGltZS5pc0Fic29sdXRlID0gaXNBYnNvbHV0ZTtcbiAgJHRyYWNldXJSdW50aW1lLnJlbW92ZURvdFNlZ21lbnRzID0gcmVtb3ZlRG90U2VnbWVudHM7XG4gICR0cmFjZXVyUnVudGltZS5yZXNvbHZlVXJsID0gcmVzb2x2ZVVybDtcbn0pKCk7XG4oZnVuY3Rpb24oZ2xvYmFsKSB7XG4gICd1c2Ugc3RyaWN0JztcbiAgdmFyICRfXzIgPSAkdHJhY2V1clJ1bnRpbWUsXG4gICAgICBjYW5vbmljYWxpemVVcmwgPSAkX18yLmNhbm9uaWNhbGl6ZVVybCxcbiAgICAgIHJlc29sdmVVcmwgPSAkX18yLnJlc29sdmVVcmwsXG4gICAgICBpc0Fic29sdXRlID0gJF9fMi5pc0Fic29sdXRlO1xuICB2YXIgbW9kdWxlSW5zdGFudGlhdG9ycyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gIHZhciBiYXNlVVJMO1xuICBpZiAoZ2xvYmFsLmxvY2F0aW9uICYmIGdsb2JhbC5sb2NhdGlvbi5ocmVmKVxuICAgIGJhc2VVUkwgPSByZXNvbHZlVXJsKGdsb2JhbC5sb2NhdGlvbi5ocmVmLCAnLi8nKTtcbiAgZWxzZVxuICAgIGJhc2VVUkwgPSAnJztcbiAgdmFyIFVuY29hdGVkTW9kdWxlRW50cnkgPSBmdW5jdGlvbiBVbmNvYXRlZE1vZHVsZUVudHJ5KHVybCwgdW5jb2F0ZWRNb2R1bGUpIHtcbiAgICB0aGlzLnVybCA9IHVybDtcbiAgICB0aGlzLnZhbHVlXyA9IHVuY29hdGVkTW9kdWxlO1xuICB9O1xuICAoJHRyYWNldXJSdW50aW1lLmNyZWF0ZUNsYXNzKShVbmNvYXRlZE1vZHVsZUVudHJ5LCB7fSwge30pO1xuICB2YXIgVW5jb2F0ZWRNb2R1bGVJbnN0YW50aWF0b3IgPSBmdW5jdGlvbiBVbmNvYXRlZE1vZHVsZUluc3RhbnRpYXRvcih1cmwsIGZ1bmMpIHtcbiAgICAkdHJhY2V1clJ1bnRpbWUuc3VwZXJDYWxsKHRoaXMsICRVbmNvYXRlZE1vZHVsZUluc3RhbnRpYXRvci5wcm90b3R5cGUsIFwiY29uc3RydWN0b3JcIiwgW3VybCwgbnVsbF0pO1xuICAgIHRoaXMuZnVuYyA9IGZ1bmM7XG4gIH07XG4gIHZhciAkVW5jb2F0ZWRNb2R1bGVJbnN0YW50aWF0b3IgPSBVbmNvYXRlZE1vZHVsZUluc3RhbnRpYXRvcjtcbiAgKCR0cmFjZXVyUnVudGltZS5jcmVhdGVDbGFzcykoVW5jb2F0ZWRNb2R1bGVJbnN0YW50aWF0b3IsIHtnZXRVbmNvYXRlZE1vZHVsZTogZnVuY3Rpb24oKSB7XG4gICAgICBpZiAodGhpcy52YWx1ZV8pXG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlXztcbiAgICAgIHJldHVybiB0aGlzLnZhbHVlXyA9IHRoaXMuZnVuYy5jYWxsKGdsb2JhbCk7XG4gICAgfX0sIHt9LCBVbmNvYXRlZE1vZHVsZUVudHJ5KTtcbiAgZnVuY3Rpb24gZ2V0VW5jb2F0ZWRNb2R1bGVJbnN0YW50aWF0b3IobmFtZSkge1xuICAgIGlmICghbmFtZSlcbiAgICAgIHJldHVybjtcbiAgICB2YXIgdXJsID0gTW9kdWxlU3RvcmUubm9ybWFsaXplKG5hbWUpO1xuICAgIHJldHVybiBtb2R1bGVJbnN0YW50aWF0b3JzW3VybF07XG4gIH1cbiAgO1xuICB2YXIgbW9kdWxlSW5zdGFuY2VzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgdmFyIGxpdmVNb2R1bGVTZW50aW5lbCA9IHt9O1xuICBmdW5jdGlvbiBNb2R1bGUodW5jb2F0ZWRNb2R1bGUpIHtcbiAgICB2YXIgaXNMaXZlID0gYXJndW1lbnRzWzFdO1xuICAgIHZhciBjb2F0ZWRNb2R1bGUgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHVuY29hdGVkTW9kdWxlKS5mb3JFYWNoKChmdW5jdGlvbihuYW1lKSB7XG4gICAgICB2YXIgZ2V0dGVyLFxuICAgICAgICAgIHZhbHVlO1xuICAgICAgaWYgKGlzTGl2ZSA9PT0gbGl2ZU1vZHVsZVNlbnRpbmVsKSB7XG4gICAgICAgIHZhciBkZXNjciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodW5jb2F0ZWRNb2R1bGUsIG5hbWUpO1xuICAgICAgICBpZiAoZGVzY3IuZ2V0KVxuICAgICAgICAgIGdldHRlciA9IGRlc2NyLmdldDtcbiAgICAgIH1cbiAgICAgIGlmICghZ2V0dGVyKSB7XG4gICAgICAgIHZhbHVlID0gdW5jb2F0ZWRNb2R1bGVbbmFtZV07XG4gICAgICAgIGdldHRlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjb2F0ZWRNb2R1bGUsIG5hbWUsIHtcbiAgICAgICAgZ2V0OiBnZXR0ZXIsXG4gICAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgIH0pO1xuICAgIH0pKTtcbiAgICBPYmplY3QucHJldmVudEV4dGVuc2lvbnMoY29hdGVkTW9kdWxlKTtcbiAgICByZXR1cm4gY29hdGVkTW9kdWxlO1xuICB9XG4gIHZhciBNb2R1bGVTdG9yZSA9IHtcbiAgICBub3JtYWxpemU6IGZ1bmN0aW9uKG5hbWUsIHJlZmVyZXJOYW1lLCByZWZlcmVyQWRkcmVzcykge1xuICAgICAgaWYgKHR5cGVvZiBuYW1lICE9PSBcInN0cmluZ1wiKVxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwibW9kdWxlIG5hbWUgbXVzdCBiZSBhIHN0cmluZywgbm90IFwiICsgdHlwZW9mIG5hbWUpO1xuICAgICAgaWYgKGlzQWJzb2x1dGUobmFtZSkpXG4gICAgICAgIHJldHVybiBjYW5vbmljYWxpemVVcmwobmFtZSk7XG4gICAgICBpZiAoL1teXFwuXVxcL1xcLlxcLlxcLy8udGVzdChuYW1lKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ21vZHVsZSBuYW1lIGVtYmVkcyAvLi4vOiAnICsgbmFtZSk7XG4gICAgICB9XG4gICAgICBpZiAobmFtZVswXSA9PT0gJy4nICYmIHJlZmVyZXJOYW1lKVxuICAgICAgICByZXR1cm4gcmVzb2x2ZVVybChyZWZlcmVyTmFtZSwgbmFtZSk7XG4gICAgICByZXR1cm4gY2Fub25pY2FsaXplVXJsKG5hbWUpO1xuICAgIH0sXG4gICAgZ2V0OiBmdW5jdGlvbihub3JtYWxpemVkTmFtZSkge1xuICAgICAgdmFyIG0gPSBnZXRVbmNvYXRlZE1vZHVsZUluc3RhbnRpYXRvcihub3JtYWxpemVkTmFtZSk7XG4gICAgICBpZiAoIW0pXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB2YXIgbW9kdWxlSW5zdGFuY2UgPSBtb2R1bGVJbnN0YW5jZXNbbS51cmxdO1xuICAgICAgaWYgKG1vZHVsZUluc3RhbmNlKVxuICAgICAgICByZXR1cm4gbW9kdWxlSW5zdGFuY2U7XG4gICAgICBtb2R1bGVJbnN0YW5jZSA9IE1vZHVsZShtLmdldFVuY29hdGVkTW9kdWxlKCksIGxpdmVNb2R1bGVTZW50aW5lbCk7XG4gICAgICByZXR1cm4gbW9kdWxlSW5zdGFuY2VzW20udXJsXSA9IG1vZHVsZUluc3RhbmNlO1xuICAgIH0sXG4gICAgc2V0OiBmdW5jdGlvbihub3JtYWxpemVkTmFtZSwgbW9kdWxlKSB7XG4gICAgICBub3JtYWxpemVkTmFtZSA9IFN0cmluZyhub3JtYWxpemVkTmFtZSk7XG4gICAgICBtb2R1bGVJbnN0YW50aWF0b3JzW25vcm1hbGl6ZWROYW1lXSA9IG5ldyBVbmNvYXRlZE1vZHVsZUluc3RhbnRpYXRvcihub3JtYWxpemVkTmFtZSwgKGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gbW9kdWxlO1xuICAgICAgfSkpO1xuICAgICAgbW9kdWxlSW5zdGFuY2VzW25vcm1hbGl6ZWROYW1lXSA9IG1vZHVsZTtcbiAgICB9LFxuICAgIGdldCBiYXNlVVJMKCkge1xuICAgICAgcmV0dXJuIGJhc2VVUkw7XG4gICAgfSxcbiAgICBzZXQgYmFzZVVSTCh2KSB7XG4gICAgICBiYXNlVVJMID0gU3RyaW5nKHYpO1xuICAgIH0sXG4gICAgcmVnaXN0ZXJNb2R1bGU6IGZ1bmN0aW9uKG5hbWUsIGZ1bmMpIHtcbiAgICAgIHZhciBub3JtYWxpemVkTmFtZSA9IE1vZHVsZVN0b3JlLm5vcm1hbGl6ZShuYW1lKTtcbiAgICAgIGlmIChtb2R1bGVJbnN0YW50aWF0b3JzW25vcm1hbGl6ZWROYW1lXSlcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdkdXBsaWNhdGUgbW9kdWxlIG5hbWVkICcgKyBub3JtYWxpemVkTmFtZSk7XG4gICAgICBtb2R1bGVJbnN0YW50aWF0b3JzW25vcm1hbGl6ZWROYW1lXSA9IG5ldyBVbmNvYXRlZE1vZHVsZUluc3RhbnRpYXRvcihub3JtYWxpemVkTmFtZSwgZnVuYyk7XG4gICAgfSxcbiAgICBidW5kbGVTdG9yZTogT2JqZWN0LmNyZWF0ZShudWxsKSxcbiAgICByZWdpc3RlcjogZnVuY3Rpb24obmFtZSwgZGVwcywgZnVuYykge1xuICAgICAgaWYgKCFkZXBzIHx8ICFkZXBzLmxlbmd0aCkge1xuICAgICAgICB0aGlzLnJlZ2lzdGVyTW9kdWxlKG5hbWUsIGZ1bmMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5idW5kbGVTdG9yZVtuYW1lXSA9IHtcbiAgICAgICAgICBkZXBzOiBkZXBzLFxuICAgICAgICAgIGV4ZWN1dGU6IGZ1bmNcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGdldEFub255bW91c01vZHVsZTogZnVuY3Rpb24oZnVuYykge1xuICAgICAgcmV0dXJuIG5ldyBNb2R1bGUoZnVuYy5jYWxsKGdsb2JhbCksIGxpdmVNb2R1bGVTZW50aW5lbCk7XG4gICAgfSxcbiAgICBnZXRGb3JUZXN0aW5nOiBmdW5jdGlvbihuYW1lKSB7XG4gICAgICB2YXIgJF9fMCA9IHRoaXM7XG4gICAgICBpZiAoIXRoaXMudGVzdGluZ1ByZWZpeF8pIHtcbiAgICAgICAgT2JqZWN0LmtleXMobW9kdWxlSW5zdGFuY2VzKS5zb21lKChmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgICB2YXIgbSA9IC8odHJhY2V1ckBbXlxcL10qXFwvKS8uZXhlYyhrZXkpO1xuICAgICAgICAgIGlmIChtKSB7XG4gICAgICAgICAgICAkX18wLnRlc3RpbmdQcmVmaXhfID0gbVsxXTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuZ2V0KHRoaXMudGVzdGluZ1ByZWZpeF8gKyBuYW1lKTtcbiAgICB9XG4gIH07XG4gIE1vZHVsZVN0b3JlLnNldCgnQHRyYWNldXIvc3JjL3J1bnRpbWUvTW9kdWxlU3RvcmUnLCBuZXcgTW9kdWxlKHtNb2R1bGVTdG9yZTogTW9kdWxlU3RvcmV9KSk7XG4gIHZhciBzZXR1cEdsb2JhbHMgPSAkdHJhY2V1clJ1bnRpbWUuc2V0dXBHbG9iYWxzO1xuICAkdHJhY2V1clJ1bnRpbWUuc2V0dXBHbG9iYWxzID0gZnVuY3Rpb24oZ2xvYmFsKSB7XG4gICAgc2V0dXBHbG9iYWxzKGdsb2JhbCk7XG4gIH07XG4gICR0cmFjZXVyUnVudGltZS5Nb2R1bGVTdG9yZSA9IE1vZHVsZVN0b3JlO1xuICBnbG9iYWwuU3lzdGVtID0ge1xuICAgIHJlZ2lzdGVyOiBNb2R1bGVTdG9yZS5yZWdpc3Rlci5iaW5kKE1vZHVsZVN0b3JlKSxcbiAgICBnZXQ6IE1vZHVsZVN0b3JlLmdldCxcbiAgICBzZXQ6IE1vZHVsZVN0b3JlLnNldCxcbiAgICBub3JtYWxpemU6IE1vZHVsZVN0b3JlLm5vcm1hbGl6ZVxuICB9O1xuICAkdHJhY2V1clJ1bnRpbWUuZ2V0TW9kdWxlSW1wbCA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICB2YXIgaW5zdGFudGlhdG9yID0gZ2V0VW5jb2F0ZWRNb2R1bGVJbnN0YW50aWF0b3IobmFtZSk7XG4gICAgcmV0dXJuIGluc3RhbnRpYXRvciAmJiBpbnN0YW50aWF0b3IuZ2V0VW5jb2F0ZWRNb2R1bGUoKTtcbiAgfTtcbn0pKHR5cGVvZiBnbG9iYWwgIT09ICd1bmRlZmluZWQnID8gZ2xvYmFsIDogdGhpcyk7XG5TeXN0ZW0ucmVnaXN0ZXIoXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjMyL3NyYy9ydW50aW1lL3BvbHlmaWxscy91dGlsc1wiLCBbXSwgZnVuY3Rpb24oKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuICB2YXIgX19tb2R1bGVOYW1lID0gXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjMyL3NyYy9ydW50aW1lL3BvbHlmaWxscy91dGlsc1wiO1xuICB2YXIgdG9PYmplY3QgPSAkdHJhY2V1clJ1bnRpbWUudG9PYmplY3Q7XG4gIGZ1bmN0aW9uIHRvVWludDMyKHgpIHtcbiAgICByZXR1cm4geCB8IDA7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBnZXQgdG9PYmplY3QoKSB7XG4gICAgICByZXR1cm4gdG9PYmplY3Q7XG4gICAgfSxcbiAgICBnZXQgdG9VaW50MzIoKSB7XG4gICAgICByZXR1cm4gdG9VaW50MzI7XG4gICAgfVxuICB9O1xufSk7XG5TeXN0ZW0ucmVnaXN0ZXIoXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjMyL3NyYy9ydW50aW1lL3BvbHlmaWxscy9BcnJheUl0ZXJhdG9yXCIsIFtdLCBmdW5jdGlvbigpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG4gIHZhciAkX180O1xuICB2YXIgX19tb2R1bGVOYW1lID0gXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjMyL3NyYy9ydW50aW1lL3BvbHlmaWxscy9BcnJheUl0ZXJhdG9yXCI7XG4gIHZhciAkX181ID0gU3lzdGVtLmdldChcInRyYWNldXItcnVudGltZUAwLjAuMzIvc3JjL3J1bnRpbWUvcG9seWZpbGxzL3V0aWxzXCIpLFxuICAgICAgdG9PYmplY3QgPSAkX181LnRvT2JqZWN0LFxuICAgICAgdG9VaW50MzIgPSAkX181LnRvVWludDMyO1xuICB2YXIgQVJSQVlfSVRFUkFUT1JfS0lORF9LRVlTID0gMTtcbiAgdmFyIEFSUkFZX0lURVJBVE9SX0tJTkRfVkFMVUVTID0gMjtcbiAgdmFyIEFSUkFZX0lURVJBVE9SX0tJTkRfRU5UUklFUyA9IDM7XG4gIHZhciBBcnJheUl0ZXJhdG9yID0gZnVuY3Rpb24gQXJyYXlJdGVyYXRvcigpIHt9O1xuICAoJHRyYWNldXJSdW50aW1lLmNyZWF0ZUNsYXNzKShBcnJheUl0ZXJhdG9yLCAoJF9fNCA9IHt9LCBPYmplY3QuZGVmaW5lUHJvcGVydHkoJF9fNCwgXCJuZXh0XCIsIHtcbiAgICB2YWx1ZTogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgaXRlcmF0b3IgPSB0b09iamVjdCh0aGlzKTtcbiAgICAgIHZhciBhcnJheSA9IGl0ZXJhdG9yLml0ZXJhdG9yT2JqZWN0XztcbiAgICAgIGlmICghYXJyYXkpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignT2JqZWN0IGlzIG5vdCBhbiBBcnJheUl0ZXJhdG9yJyk7XG4gICAgICB9XG4gICAgICB2YXIgaW5kZXggPSBpdGVyYXRvci5hcnJheUl0ZXJhdG9yTmV4dEluZGV4XztcbiAgICAgIHZhciBpdGVtS2luZCA9IGl0ZXJhdG9yLmFycmF5SXRlcmF0aW9uS2luZF87XG4gICAgICB2YXIgbGVuZ3RoID0gdG9VaW50MzIoYXJyYXkubGVuZ3RoKTtcbiAgICAgIGlmIChpbmRleCA+PSBsZW5ndGgpIHtcbiAgICAgICAgaXRlcmF0b3IuYXJyYXlJdGVyYXRvck5leHRJbmRleF8gPSBJbmZpbml0eTtcbiAgICAgICAgcmV0dXJuIGNyZWF0ZUl0ZXJhdG9yUmVzdWx0T2JqZWN0KHVuZGVmaW5lZCwgdHJ1ZSk7XG4gICAgICB9XG4gICAgICBpdGVyYXRvci5hcnJheUl0ZXJhdG9yTmV4dEluZGV4XyA9IGluZGV4ICsgMTtcbiAgICAgIGlmIChpdGVtS2luZCA9PSBBUlJBWV9JVEVSQVRPUl9LSU5EX1ZBTFVFUylcbiAgICAgICAgcmV0dXJuIGNyZWF0ZUl0ZXJhdG9yUmVzdWx0T2JqZWN0KGFycmF5W2luZGV4XSwgZmFsc2UpO1xuICAgICAgaWYgKGl0ZW1LaW5kID09IEFSUkFZX0lURVJBVE9SX0tJTkRfRU5UUklFUylcbiAgICAgICAgcmV0dXJuIGNyZWF0ZUl0ZXJhdG9yUmVzdWx0T2JqZWN0KFtpbmRleCwgYXJyYXlbaW5kZXhdXSwgZmFsc2UpO1xuICAgICAgcmV0dXJuIGNyZWF0ZUl0ZXJhdG9yUmVzdWx0T2JqZWN0KGluZGV4LCBmYWxzZSk7XG4gICAgfSxcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICB3cml0YWJsZTogdHJ1ZVxuICB9KSwgT2JqZWN0LmRlZmluZVByb3BlcnR5KCRfXzQsIFN5bWJvbC5pdGVyYXRvciwge1xuICAgIHZhbHVlOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgd3JpdGFibGU6IHRydWVcbiAgfSksICRfXzQpLCB7fSk7XG4gIGZ1bmN0aW9uIGNyZWF0ZUFycmF5SXRlcmF0b3IoYXJyYXksIGtpbmQpIHtcbiAgICB2YXIgb2JqZWN0ID0gdG9PYmplY3QoYXJyYXkpO1xuICAgIHZhciBpdGVyYXRvciA9IG5ldyBBcnJheUl0ZXJhdG9yO1xuICAgIGl0ZXJhdG9yLml0ZXJhdG9yT2JqZWN0XyA9IG9iamVjdDtcbiAgICBpdGVyYXRvci5hcnJheUl0ZXJhdG9yTmV4dEluZGV4XyA9IDA7XG4gICAgaXRlcmF0b3IuYXJyYXlJdGVyYXRpb25LaW5kXyA9IGtpbmQ7XG4gICAgcmV0dXJuIGl0ZXJhdG9yO1xuICB9XG4gIGZ1bmN0aW9uIGNyZWF0ZUl0ZXJhdG9yUmVzdWx0T2JqZWN0KHZhbHVlLCBkb25lKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgIGRvbmU6IGRvbmVcbiAgICB9O1xuICB9XG4gIGZ1bmN0aW9uIGVudHJpZXMoKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUFycmF5SXRlcmF0b3IodGhpcywgQVJSQVlfSVRFUkFUT1JfS0lORF9FTlRSSUVTKTtcbiAgfVxuICBmdW5jdGlvbiBrZXlzKCkge1xuICAgIHJldHVybiBjcmVhdGVBcnJheUl0ZXJhdG9yKHRoaXMsIEFSUkFZX0lURVJBVE9SX0tJTkRfS0VZUyk7XG4gIH1cbiAgZnVuY3Rpb24gdmFsdWVzKCkge1xuICAgIHJldHVybiBjcmVhdGVBcnJheUl0ZXJhdG9yKHRoaXMsIEFSUkFZX0lURVJBVE9SX0tJTkRfVkFMVUVTKTtcbiAgfVxuICByZXR1cm4ge1xuICAgIGdldCBlbnRyaWVzKCkge1xuICAgICAgcmV0dXJuIGVudHJpZXM7XG4gICAgfSxcbiAgICBnZXQga2V5cygpIHtcbiAgICAgIHJldHVybiBrZXlzO1xuICAgIH0sXG4gICAgZ2V0IHZhbHVlcygpIHtcbiAgICAgIHJldHVybiB2YWx1ZXM7XG4gICAgfVxuICB9O1xufSk7XG5TeXN0ZW0ucmVnaXN0ZXIoXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjMyL25vZGVfbW9kdWxlcy9yc3ZwL2xpYi9yc3ZwL2FzYXBcIiwgW10sIGZ1bmN0aW9uKCkge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgdmFyIF9fbW9kdWxlTmFtZSA9IFwidHJhY2V1ci1ydW50aW1lQDAuMC4zMi9ub2RlX21vZHVsZXMvcnN2cC9saWIvcnN2cC9hc2FwXCI7XG4gIHZhciAkX19kZWZhdWx0ID0gZnVuY3Rpb24gYXNhcChjYWxsYmFjaywgYXJnKSB7XG4gICAgdmFyIGxlbmd0aCA9IHF1ZXVlLnB1c2goW2NhbGxiYWNrLCBhcmddKTtcbiAgICBpZiAobGVuZ3RoID09PSAxKSB7XG4gICAgICBzY2hlZHVsZUZsdXNoKCk7XG4gICAgfVxuICB9O1xuICB2YXIgYnJvd3Nlckdsb2JhbCA9ICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykgPyB3aW5kb3cgOiB7fTtcbiAgdmFyIEJyb3dzZXJNdXRhdGlvbk9ic2VydmVyID0gYnJvd3Nlckdsb2JhbC5NdXRhdGlvbk9ic2VydmVyIHx8IGJyb3dzZXJHbG9iYWwuV2ViS2l0TXV0YXRpb25PYnNlcnZlcjtcbiAgZnVuY3Rpb24gdXNlTmV4dFRpY2soKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgcHJvY2Vzcy5uZXh0VGljayhmbHVzaCk7XG4gICAgfTtcbiAgfVxuICBmdW5jdGlvbiB1c2VNdXRhdGlvbk9ic2VydmVyKCkge1xuICAgIHZhciBpdGVyYXRpb25zID0gMDtcbiAgICB2YXIgb2JzZXJ2ZXIgPSBuZXcgQnJvd3Nlck11dGF0aW9uT2JzZXJ2ZXIoZmx1c2gpO1xuICAgIHZhciBub2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJycpO1xuICAgIG9ic2VydmVyLm9ic2VydmUobm9kZSwge2NoYXJhY3RlckRhdGE6IHRydWV9KTtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICBub2RlLmRhdGEgPSAoaXRlcmF0aW9ucyA9ICsraXRlcmF0aW9ucyAlIDIpO1xuICAgIH07XG4gIH1cbiAgZnVuY3Rpb24gdXNlU2V0VGltZW91dCgpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICBzZXRUaW1lb3V0KGZsdXNoLCAxKTtcbiAgICB9O1xuICB9XG4gIHZhciBxdWV1ZSA9IFtdO1xuICBmdW5jdGlvbiBmbHVzaCgpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHF1ZXVlLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgdHVwbGUgPSBxdWV1ZVtpXTtcbiAgICAgIHZhciBjYWxsYmFjayA9IHR1cGxlWzBdLFxuICAgICAgICAgIGFyZyA9IHR1cGxlWzFdO1xuICAgICAgY2FsbGJhY2soYXJnKTtcbiAgICB9XG4gICAgcXVldWUgPSBbXTtcbiAgfVxuICB2YXIgc2NoZWR1bGVGbHVzaDtcbiAgaWYgKHR5cGVvZiBwcm9jZXNzICE9PSAndW5kZWZpbmVkJyAmJiB7fS50b1N0cmluZy5jYWxsKHByb2Nlc3MpID09PSAnW29iamVjdCBwcm9jZXNzXScpIHtcbiAgICBzY2hlZHVsZUZsdXNoID0gdXNlTmV4dFRpY2soKTtcbiAgfSBlbHNlIGlmIChCcm93c2VyTXV0YXRpb25PYnNlcnZlcikge1xuICAgIHNjaGVkdWxlRmx1c2ggPSB1c2VNdXRhdGlvbk9ic2VydmVyKCk7XG4gIH0gZWxzZSB7XG4gICAgc2NoZWR1bGVGbHVzaCA9IHVzZVNldFRpbWVvdXQoKTtcbiAgfVxuICByZXR1cm4ge2dldCBkZWZhdWx0KCkge1xuICAgICAgcmV0dXJuICRfX2RlZmF1bHQ7XG4gICAgfX07XG59KTtcblN5c3RlbS5yZWdpc3RlcihcInRyYWNldXItcnVudGltZUAwLjAuMzIvc3JjL3J1bnRpbWUvcG9seWZpbGxzL1Byb21pc2VcIiwgW10sIGZ1bmN0aW9uKCkge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgdmFyIF9fbW9kdWxlTmFtZSA9IFwidHJhY2V1ci1ydW50aW1lQDAuMC4zMi9zcmMvcnVudGltZS9wb2x5ZmlsbHMvUHJvbWlzZVwiO1xuICB2YXIgYXN5bmMgPSBTeXN0ZW0uZ2V0KFwidHJhY2V1ci1ydW50aW1lQDAuMC4zMi9ub2RlX21vZHVsZXMvcnN2cC9saWIvcnN2cC9hc2FwXCIpLmRlZmF1bHQ7XG4gIGZ1bmN0aW9uIGlzUHJvbWlzZSh4KSB7XG4gICAgcmV0dXJuIHggJiYgdHlwZW9mIHggPT09ICdvYmplY3QnICYmIHguc3RhdHVzXyAhPT0gdW5kZWZpbmVkO1xuICB9XG4gIGZ1bmN0aW9uIGNoYWluKHByb21pc2UpIHtcbiAgICB2YXIgb25SZXNvbHZlID0gYXJndW1lbnRzWzFdICE9PSAodm9pZCAwKSA/IGFyZ3VtZW50c1sxXSA6IChmdW5jdGlvbih4KSB7XG4gICAgICByZXR1cm4geDtcbiAgICB9KTtcbiAgICB2YXIgb25SZWplY3QgPSBhcmd1bWVudHNbMl0gIT09ICh2b2lkIDApID8gYXJndW1lbnRzWzJdIDogKGZ1bmN0aW9uKGUpIHtcbiAgICAgIHRocm93IGU7XG4gICAgfSk7XG4gICAgdmFyIGRlZmVycmVkID0gZ2V0RGVmZXJyZWQocHJvbWlzZS5jb25zdHJ1Y3Rvcik7XG4gICAgc3dpdGNoIChwcm9taXNlLnN0YXR1c18pIHtcbiAgICAgIGNhc2UgdW5kZWZpbmVkOlxuICAgICAgICB0aHJvdyBUeXBlRXJyb3I7XG4gICAgICBjYXNlICdwZW5kaW5nJzpcbiAgICAgICAgcHJvbWlzZS5vblJlc29sdmVfLnB1c2goW2RlZmVycmVkLCBvblJlc29sdmVdKTtcbiAgICAgICAgcHJvbWlzZS5vblJlamVjdF8ucHVzaChbZGVmZXJyZWQsIG9uUmVqZWN0XSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAncmVzb2x2ZWQnOlxuICAgICAgICBwcm9taXNlUmVhY3QoZGVmZXJyZWQsIG9uUmVzb2x2ZSwgcHJvbWlzZS52YWx1ZV8pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3JlamVjdGVkJzpcbiAgICAgICAgcHJvbWlzZVJlYWN0KGRlZmVycmVkLCBvblJlamVjdCwgcHJvbWlzZS52YWx1ZV8pO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gIH1cbiAgZnVuY3Rpb24gZ2V0RGVmZXJyZWQoQykge1xuICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICByZXN1bHQucHJvbWlzZSA9IG5ldyBDKChmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIHJlc3VsdC5yZXNvbHZlID0gcmVzb2x2ZTtcbiAgICAgIHJlc3VsdC5yZWplY3QgPSByZWplY3Q7XG4gICAgfSkpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgdmFyIFByb21pc2UgPSBmdW5jdGlvbiBQcm9taXNlKHJlc29sdmVyKSB7XG4gICAgdmFyICRfXzYgPSB0aGlzO1xuICAgIHRoaXMuc3RhdHVzXyA9ICdwZW5kaW5nJztcbiAgICB0aGlzLm9uUmVzb2x2ZV8gPSBbXTtcbiAgICB0aGlzLm9uUmVqZWN0XyA9IFtdO1xuICAgIHJlc29sdmVyKChmdW5jdGlvbih4KSB7XG4gICAgICBwcm9taXNlUmVzb2x2ZSgkX182LCB4KTtcbiAgICB9KSwgKGZ1bmN0aW9uKHIpIHtcbiAgICAgIHByb21pc2VSZWplY3QoJF9fNiwgcik7XG4gICAgfSkpO1xuICB9O1xuICAoJHRyYWNldXJSdW50aW1lLmNyZWF0ZUNsYXNzKShQcm9taXNlLCB7XG4gICAgY2F0Y2g6IGZ1bmN0aW9uKG9uUmVqZWN0KSB7XG4gICAgICByZXR1cm4gdGhpcy50aGVuKHVuZGVmaW5lZCwgb25SZWplY3QpO1xuICAgIH0sXG4gICAgdGhlbjogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgb25SZXNvbHZlID0gYXJndW1lbnRzWzBdICE9PSAodm9pZCAwKSA/IGFyZ3VtZW50c1swXSA6IChmdW5jdGlvbih4KSB7XG4gICAgICAgIHJldHVybiB4O1xuICAgICAgfSk7XG4gICAgICB2YXIgb25SZWplY3QgPSBhcmd1bWVudHNbMV07XG4gICAgICB2YXIgJF9fNiA9IHRoaXM7XG4gICAgICB2YXIgY29uc3RydWN0b3IgPSB0aGlzLmNvbnN0cnVjdG9yO1xuICAgICAgcmV0dXJuIGNoYWluKHRoaXMsIChmdW5jdGlvbih4KSB7XG4gICAgICAgIHggPSBwcm9taXNlQ29lcmNlKGNvbnN0cnVjdG9yLCB4KTtcbiAgICAgICAgcmV0dXJuIHggPT09ICRfXzYgPyBvblJlamVjdChuZXcgVHlwZUVycm9yKSA6IGlzUHJvbWlzZSh4KSA/IHgudGhlbihvblJlc29sdmUsIG9uUmVqZWN0KSA6IG9uUmVzb2x2ZSh4KTtcbiAgICAgIH0pLCBvblJlamVjdCk7XG4gICAgfVxuICB9LCB7XG4gICAgcmVzb2x2ZTogZnVuY3Rpb24oeCkge1xuICAgICAgcmV0dXJuIG5ldyB0aGlzKChmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgcmVzb2x2ZSh4KTtcbiAgICAgIH0pKTtcbiAgICB9LFxuICAgIHJlamVjdDogZnVuY3Rpb24ocikge1xuICAgICAgcmV0dXJuIG5ldyB0aGlzKChmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgcmVqZWN0KHIpO1xuICAgICAgfSkpO1xuICAgIH0sXG4gICAgY2FzdDogZnVuY3Rpb24oeCkge1xuICAgICAgaWYgKHggaW5zdGFuY2VvZiB0aGlzKVxuICAgICAgICByZXR1cm4geDtcbiAgICAgIGlmIChpc1Byb21pc2UoeCkpIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IGdldERlZmVycmVkKHRoaXMpO1xuICAgICAgICBjaGFpbih4LCByZXN1bHQucmVzb2x2ZSwgcmVzdWx0LnJlamVjdCk7XG4gICAgICAgIHJldHVybiByZXN1bHQucHJvbWlzZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLnJlc29sdmUoeCk7XG4gICAgfSxcbiAgICBhbGw6IGZ1bmN0aW9uKHZhbHVlcykge1xuICAgICAgdmFyIGRlZmVycmVkID0gZ2V0RGVmZXJyZWQodGhpcyk7XG4gICAgICB2YXIgY291bnQgPSAwO1xuICAgICAgdmFyIHJlc29sdXRpb25zID0gW107XG4gICAgICB0cnkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZhbHVlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICsrY291bnQ7XG4gICAgICAgICAgdGhpcy5jYXN0KHZhbHVlc1tpXSkudGhlbihmdW5jdGlvbihpLCB4KSB7XG4gICAgICAgICAgICByZXNvbHV0aW9uc1tpXSA9IHg7XG4gICAgICAgICAgICBpZiAoLS1jb3VudCA9PT0gMClcbiAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShyZXNvbHV0aW9ucyk7XG4gICAgICAgICAgfS5iaW5kKHVuZGVmaW5lZCwgaSksIChmdW5jdGlvbihyKSB7XG4gICAgICAgICAgICBpZiAoY291bnQgPiAwKVxuICAgICAgICAgICAgICBjb3VudCA9IDA7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZWplY3Qocik7XG4gICAgICAgICAgfSkpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjb3VudCA9PT0gMClcbiAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHJlc29sdXRpb25zKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgZGVmZXJyZWQucmVqZWN0KGUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgfSxcbiAgICByYWNlOiBmdW5jdGlvbih2YWx1ZXMpIHtcbiAgICAgIHZhciBkZWZlcnJlZCA9IGdldERlZmVycmVkKHRoaXMpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2YWx1ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICB0aGlzLmNhc3QodmFsdWVzW2ldKS50aGVuKChmdW5jdGlvbih4KSB7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHgpO1xuICAgICAgICAgIH0pLCAoZnVuY3Rpb24ocikge1xuICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KHIpO1xuICAgICAgICAgIH0pKTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBkZWZlcnJlZC5yZWplY3QoZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICB9XG4gIH0pO1xuICBmdW5jdGlvbiBwcm9taXNlUmVzb2x2ZShwcm9taXNlLCB4KSB7XG4gICAgcHJvbWlzZURvbmUocHJvbWlzZSwgJ3Jlc29sdmVkJywgeCwgcHJvbWlzZS5vblJlc29sdmVfKTtcbiAgfVxuICBmdW5jdGlvbiBwcm9taXNlUmVqZWN0KHByb21pc2UsIHIpIHtcbiAgICBwcm9taXNlRG9uZShwcm9taXNlLCAncmVqZWN0ZWQnLCByLCBwcm9taXNlLm9uUmVqZWN0Xyk7XG4gIH1cbiAgZnVuY3Rpb24gcHJvbWlzZURvbmUocHJvbWlzZSwgc3RhdHVzLCB2YWx1ZSwgcmVhY3Rpb25zKSB7XG4gICAgaWYgKHByb21pc2Uuc3RhdHVzXyAhPT0gJ3BlbmRpbmcnKVxuICAgICAgcmV0dXJuO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVhY3Rpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICBwcm9taXNlUmVhY3QocmVhY3Rpb25zW2ldWzBdLCByZWFjdGlvbnNbaV1bMV0sIHZhbHVlKTtcbiAgICB9XG4gICAgcHJvbWlzZS5zdGF0dXNfID0gc3RhdHVzO1xuICAgIHByb21pc2UudmFsdWVfID0gdmFsdWU7XG4gICAgcHJvbWlzZS5vblJlc29sdmVfID0gcHJvbWlzZS5vblJlamVjdF8gPSB1bmRlZmluZWQ7XG4gIH1cbiAgZnVuY3Rpb24gcHJvbWlzZVJlYWN0KGRlZmVycmVkLCBoYW5kbGVyLCB4KSB7XG4gICAgYXN5bmMoKGZ1bmN0aW9uKCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdmFyIHkgPSBoYW5kbGVyKHgpO1xuICAgICAgICBpZiAoeSA9PT0gZGVmZXJyZWQucHJvbWlzZSlcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yO1xuICAgICAgICBlbHNlIGlmIChpc1Byb21pc2UoeSkpXG4gICAgICAgICAgY2hhaW4oeSwgZGVmZXJyZWQucmVzb2x2ZSwgZGVmZXJyZWQucmVqZWN0KTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoeSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGRlZmVycmVkLnJlamVjdChlKTtcbiAgICAgIH1cbiAgICB9KSk7XG4gIH1cbiAgdmFyIHRoZW5hYmxlU3ltYm9sID0gJ0BAdGhlbmFibGUnO1xuICBmdW5jdGlvbiBwcm9taXNlQ29lcmNlKGNvbnN0cnVjdG9yLCB4KSB7XG4gICAgaWYgKGlzUHJvbWlzZSh4KSkge1xuICAgICAgcmV0dXJuIHg7XG4gICAgfSBlbHNlIGlmICh4ICYmIHR5cGVvZiB4LnRoZW4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHZhciBwID0geFt0aGVuYWJsZVN5bWJvbF07XG4gICAgICBpZiAocCkge1xuICAgICAgICByZXR1cm4gcDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBkZWZlcnJlZCA9IGdldERlZmVycmVkKGNvbnN0cnVjdG9yKTtcbiAgICAgICAgeFt0aGVuYWJsZVN5bWJvbF0gPSBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHgudGhlbihkZWZlcnJlZC5yZXNvbHZlLCBkZWZlcnJlZC5yZWplY3QpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgZGVmZXJyZWQucmVqZWN0KGUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4geDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHtnZXQgUHJvbWlzZSgpIHtcbiAgICAgIHJldHVybiBQcm9taXNlO1xuICAgIH19O1xufSk7XG5TeXN0ZW0ucmVnaXN0ZXIoXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjMyL3NyYy9ydW50aW1lL3BvbHlmaWxscy9TdHJpbmdcIiwgW10sIGZ1bmN0aW9uKCkge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgdmFyIF9fbW9kdWxlTmFtZSA9IFwidHJhY2V1ci1ydW50aW1lQDAuMC4zMi9zcmMvcnVudGltZS9wb2x5ZmlsbHMvU3RyaW5nXCI7XG4gIHZhciAkdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuICB2YXIgJGluZGV4T2YgPSBTdHJpbmcucHJvdG90eXBlLmluZGV4T2Y7XG4gIHZhciAkbGFzdEluZGV4T2YgPSBTdHJpbmcucHJvdG90eXBlLmxhc3RJbmRleE9mO1xuICBmdW5jdGlvbiBzdGFydHNXaXRoKHNlYXJjaCkge1xuICAgIHZhciBzdHJpbmcgPSBTdHJpbmcodGhpcyk7XG4gICAgaWYgKHRoaXMgPT0gbnVsbCB8fCAkdG9TdHJpbmcuY2FsbChzZWFyY2gpID09ICdbb2JqZWN0IFJlZ0V4cF0nKSB7XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoKTtcbiAgICB9XG4gICAgdmFyIHN0cmluZ0xlbmd0aCA9IHN0cmluZy5sZW5ndGg7XG4gICAgdmFyIHNlYXJjaFN0cmluZyA9IFN0cmluZyhzZWFyY2gpO1xuICAgIHZhciBzZWFyY2hMZW5ndGggPSBzZWFyY2hTdHJpbmcubGVuZ3RoO1xuICAgIHZhciBwb3NpdGlvbiA9IGFyZ3VtZW50cy5sZW5ndGggPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkO1xuICAgIHZhciBwb3MgPSBwb3NpdGlvbiA/IE51bWJlcihwb3NpdGlvbikgOiAwO1xuICAgIGlmIChpc05hTihwb3MpKSB7XG4gICAgICBwb3MgPSAwO1xuICAgIH1cbiAgICB2YXIgc3RhcnQgPSBNYXRoLm1pbihNYXRoLm1heChwb3MsIDApLCBzdHJpbmdMZW5ndGgpO1xuICAgIHJldHVybiAkaW5kZXhPZi5jYWxsKHN0cmluZywgc2VhcmNoU3RyaW5nLCBwb3MpID09IHN0YXJ0O1xuICB9XG4gIGZ1bmN0aW9uIGVuZHNXaXRoKHNlYXJjaCkge1xuICAgIHZhciBzdHJpbmcgPSBTdHJpbmcodGhpcyk7XG4gICAgaWYgKHRoaXMgPT0gbnVsbCB8fCAkdG9TdHJpbmcuY2FsbChzZWFyY2gpID09ICdbb2JqZWN0IFJlZ0V4cF0nKSB7XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoKTtcbiAgICB9XG4gICAgdmFyIHN0cmluZ0xlbmd0aCA9IHN0cmluZy5sZW5ndGg7XG4gICAgdmFyIHNlYXJjaFN0cmluZyA9IFN0cmluZyhzZWFyY2gpO1xuICAgIHZhciBzZWFyY2hMZW5ndGggPSBzZWFyY2hTdHJpbmcubGVuZ3RoO1xuICAgIHZhciBwb3MgPSBzdHJpbmdMZW5ndGg7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICB2YXIgcG9zaXRpb24gPSBhcmd1bWVudHNbMV07XG4gICAgICBpZiAocG9zaXRpb24gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBwb3MgPSBwb3NpdGlvbiA/IE51bWJlcihwb3NpdGlvbikgOiAwO1xuICAgICAgICBpZiAoaXNOYU4ocG9zKSkge1xuICAgICAgICAgIHBvcyA9IDA7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgdmFyIGVuZCA9IE1hdGgubWluKE1hdGgubWF4KHBvcywgMCksIHN0cmluZ0xlbmd0aCk7XG4gICAgdmFyIHN0YXJ0ID0gZW5kIC0gc2VhcmNoTGVuZ3RoO1xuICAgIGlmIChzdGFydCA8IDApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuICRsYXN0SW5kZXhPZi5jYWxsKHN0cmluZywgc2VhcmNoU3RyaW5nLCBzdGFydCkgPT0gc3RhcnQ7XG4gIH1cbiAgZnVuY3Rpb24gY29udGFpbnMoc2VhcmNoKSB7XG4gICAgaWYgKHRoaXMgPT0gbnVsbCkge1xuICAgICAgdGhyb3cgVHlwZUVycm9yKCk7XG4gICAgfVxuICAgIHZhciBzdHJpbmcgPSBTdHJpbmcodGhpcyk7XG4gICAgdmFyIHN0cmluZ0xlbmd0aCA9IHN0cmluZy5sZW5ndGg7XG4gICAgdmFyIHNlYXJjaFN0cmluZyA9IFN0cmluZyhzZWFyY2gpO1xuICAgIHZhciBzZWFyY2hMZW5ndGggPSBzZWFyY2hTdHJpbmcubGVuZ3RoO1xuICAgIHZhciBwb3NpdGlvbiA9IGFyZ3VtZW50cy5sZW5ndGggPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkO1xuICAgIHZhciBwb3MgPSBwb3NpdGlvbiA/IE51bWJlcihwb3NpdGlvbikgOiAwO1xuICAgIGlmIChpc05hTihwb3MpKSB7XG4gICAgICBwb3MgPSAwO1xuICAgIH1cbiAgICB2YXIgc3RhcnQgPSBNYXRoLm1pbihNYXRoLm1heChwb3MsIDApLCBzdHJpbmdMZW5ndGgpO1xuICAgIHJldHVybiAkaW5kZXhPZi5jYWxsKHN0cmluZywgc2VhcmNoU3RyaW5nLCBwb3MpICE9IC0xO1xuICB9XG4gIGZ1bmN0aW9uIHJlcGVhdChjb3VudCkge1xuICAgIGlmICh0aGlzID09IG51bGwpIHtcbiAgICAgIHRocm93IFR5cGVFcnJvcigpO1xuICAgIH1cbiAgICB2YXIgc3RyaW5nID0gU3RyaW5nKHRoaXMpO1xuICAgIHZhciBuID0gY291bnQgPyBOdW1iZXIoY291bnQpIDogMDtcbiAgICBpZiAoaXNOYU4obikpIHtcbiAgICAgIG4gPSAwO1xuICAgIH1cbiAgICBpZiAobiA8IDAgfHwgbiA9PSBJbmZpbml0eSkge1xuICAgICAgdGhyb3cgUmFuZ2VFcnJvcigpO1xuICAgIH1cbiAgICBpZiAobiA9PSAwKSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIHZhciByZXN1bHQgPSAnJztcbiAgICB3aGlsZSAobi0tKSB7XG4gICAgICByZXN1bHQgKz0gc3RyaW5nO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIGZ1bmN0aW9uIGNvZGVQb2ludEF0KHBvc2l0aW9uKSB7XG4gICAgaWYgKHRoaXMgPT0gbnVsbCkge1xuICAgICAgdGhyb3cgVHlwZUVycm9yKCk7XG4gICAgfVxuICAgIHZhciBzdHJpbmcgPSBTdHJpbmcodGhpcyk7XG4gICAgdmFyIHNpemUgPSBzdHJpbmcubGVuZ3RoO1xuICAgIHZhciBpbmRleCA9IHBvc2l0aW9uID8gTnVtYmVyKHBvc2l0aW9uKSA6IDA7XG4gICAgaWYgKGlzTmFOKGluZGV4KSkge1xuICAgICAgaW5kZXggPSAwO1xuICAgIH1cbiAgICBpZiAoaW5kZXggPCAwIHx8IGluZGV4ID49IHNpemUpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHZhciBmaXJzdCA9IHN0cmluZy5jaGFyQ29kZUF0KGluZGV4KTtcbiAgICB2YXIgc2Vjb25kO1xuICAgIGlmIChmaXJzdCA+PSAweEQ4MDAgJiYgZmlyc3QgPD0gMHhEQkZGICYmIHNpemUgPiBpbmRleCArIDEpIHtcbiAgICAgIHNlY29uZCA9IHN0cmluZy5jaGFyQ29kZUF0KGluZGV4ICsgMSk7XG4gICAgICBpZiAoc2Vjb25kID49IDB4REMwMCAmJiBzZWNvbmQgPD0gMHhERkZGKSB7XG4gICAgICAgIHJldHVybiAoZmlyc3QgLSAweEQ4MDApICogMHg0MDAgKyBzZWNvbmQgLSAweERDMDAgKyAweDEwMDAwO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmlyc3Q7XG4gIH1cbiAgZnVuY3Rpb24gcmF3KGNhbGxzaXRlKSB7XG4gICAgdmFyIHJhdyA9IGNhbGxzaXRlLnJhdztcbiAgICB2YXIgbGVuID0gcmF3Lmxlbmd0aCA+Pj4gMDtcbiAgICBpZiAobGVuID09PSAwKVxuICAgICAgcmV0dXJuICcnO1xuICAgIHZhciBzID0gJyc7XG4gICAgdmFyIGkgPSAwO1xuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICBzICs9IHJhd1tpXTtcbiAgICAgIGlmIChpICsgMSA9PT0gbGVuKVxuICAgICAgICByZXR1cm4gcztcbiAgICAgIHMgKz0gYXJndW1lbnRzWysraV07XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIGZyb21Db2RlUG9pbnQoKSB7XG4gICAgdmFyIGNvZGVVbml0cyA9IFtdO1xuICAgIHZhciBmbG9vciA9IE1hdGguZmxvb3I7XG4gICAgdmFyIGhpZ2hTdXJyb2dhdGU7XG4gICAgdmFyIGxvd1N1cnJvZ2F0ZTtcbiAgICB2YXIgaW5kZXggPSAtMTtcbiAgICB2YXIgbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICBpZiAoIWxlbmd0aCkge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgdmFyIGNvZGVQb2ludCA9IE51bWJlcihhcmd1bWVudHNbaW5kZXhdKTtcbiAgICAgIGlmICghaXNGaW5pdGUoY29kZVBvaW50KSB8fCBjb2RlUG9pbnQgPCAwIHx8IGNvZGVQb2ludCA+IDB4MTBGRkZGIHx8IGZsb29yKGNvZGVQb2ludCkgIT0gY29kZVBvaW50KSB7XG4gICAgICAgIHRocm93IFJhbmdlRXJyb3IoJ0ludmFsaWQgY29kZSBwb2ludDogJyArIGNvZGVQb2ludCk7XG4gICAgICB9XG4gICAgICBpZiAoY29kZVBvaW50IDw9IDB4RkZGRikge1xuICAgICAgICBjb2RlVW5pdHMucHVzaChjb2RlUG9pbnQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29kZVBvaW50IC09IDB4MTAwMDA7XG4gICAgICAgIGhpZ2hTdXJyb2dhdGUgPSAoY29kZVBvaW50ID4+IDEwKSArIDB4RDgwMDtcbiAgICAgICAgbG93U3Vycm9nYXRlID0gKGNvZGVQb2ludCAlIDB4NDAwKSArIDB4REMwMDtcbiAgICAgICAgY29kZVVuaXRzLnB1c2goaGlnaFN1cnJvZ2F0ZSwgbG93U3Vycm9nYXRlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkobnVsbCwgY29kZVVuaXRzKTtcbiAgfVxuICByZXR1cm4ge1xuICAgIGdldCBzdGFydHNXaXRoKCkge1xuICAgICAgcmV0dXJuIHN0YXJ0c1dpdGg7XG4gICAgfSxcbiAgICBnZXQgZW5kc1dpdGgoKSB7XG4gICAgICByZXR1cm4gZW5kc1dpdGg7XG4gICAgfSxcbiAgICBnZXQgY29udGFpbnMoKSB7XG4gICAgICByZXR1cm4gY29udGFpbnM7XG4gICAgfSxcbiAgICBnZXQgcmVwZWF0KCkge1xuICAgICAgcmV0dXJuIHJlcGVhdDtcbiAgICB9LFxuICAgIGdldCBjb2RlUG9pbnRBdCgpIHtcbiAgICAgIHJldHVybiBjb2RlUG9pbnRBdDtcbiAgICB9LFxuICAgIGdldCByYXcoKSB7XG4gICAgICByZXR1cm4gcmF3O1xuICAgIH0sXG4gICAgZ2V0IGZyb21Db2RlUG9pbnQoKSB7XG4gICAgICByZXR1cm4gZnJvbUNvZGVQb2ludDtcbiAgICB9XG4gIH07XG59KTtcblN5c3RlbS5yZWdpc3RlcihcInRyYWNldXItcnVudGltZUAwLjAuMzIvc3JjL3J1bnRpbWUvcG9seWZpbGxzL3BvbHlmaWxsc1wiLCBbXSwgZnVuY3Rpb24oKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuICB2YXIgX19tb2R1bGVOYW1lID0gXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjMyL3NyYy9ydW50aW1lL3BvbHlmaWxscy9wb2x5ZmlsbHNcIjtcbiAgdmFyIFByb21pc2UgPSBTeXN0ZW0uZ2V0KFwidHJhY2V1ci1ydW50aW1lQDAuMC4zMi9zcmMvcnVudGltZS9wb2x5ZmlsbHMvUHJvbWlzZVwiKS5Qcm9taXNlO1xuICB2YXIgJF9fOSA9IFN5c3RlbS5nZXQoXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjMyL3NyYy9ydW50aW1lL3BvbHlmaWxscy9TdHJpbmdcIiksXG4gICAgICBjb2RlUG9pbnRBdCA9ICRfXzkuY29kZVBvaW50QXQsXG4gICAgICBjb250YWlucyA9ICRfXzkuY29udGFpbnMsXG4gICAgICBlbmRzV2l0aCA9ICRfXzkuZW5kc1dpdGgsXG4gICAgICBmcm9tQ29kZVBvaW50ID0gJF9fOS5mcm9tQ29kZVBvaW50LFxuICAgICAgcmVwZWF0ID0gJF9fOS5yZXBlYXQsXG4gICAgICByYXcgPSAkX185LnJhdyxcbiAgICAgIHN0YXJ0c1dpdGggPSAkX185LnN0YXJ0c1dpdGg7XG4gIHZhciAkX185ID0gU3lzdGVtLmdldChcInRyYWNldXItcnVudGltZUAwLjAuMzIvc3JjL3J1bnRpbWUvcG9seWZpbGxzL0FycmF5SXRlcmF0b3JcIiksXG4gICAgICBlbnRyaWVzID0gJF9fOS5lbnRyaWVzLFxuICAgICAga2V5cyA9ICRfXzkua2V5cyxcbiAgICAgIHZhbHVlcyA9ICRfXzkudmFsdWVzO1xuICBmdW5jdGlvbiBtYXliZURlZmluZU1ldGhvZChvYmplY3QsIG5hbWUsIHZhbHVlKSB7XG4gICAgaWYgKCEobmFtZSBpbiBvYmplY3QpKSB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqZWN0LCBuYW1lLCB7XG4gICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgd3JpdGFibGU6IHRydWVcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBtYXliZUFkZEZ1bmN0aW9ucyhvYmplY3QsIGZ1bmN0aW9ucykge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZnVuY3Rpb25zLmxlbmd0aDsgaSArPSAyKSB7XG4gICAgICB2YXIgbmFtZSA9IGZ1bmN0aW9uc1tpXTtcbiAgICAgIHZhciB2YWx1ZSA9IGZ1bmN0aW9uc1tpICsgMV07XG4gICAgICBtYXliZURlZmluZU1ldGhvZChvYmplY3QsIG5hbWUsIHZhbHVlKTtcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gcG9seWZpbGxQcm9taXNlKGdsb2JhbCkge1xuICAgIGlmICghZ2xvYmFsLlByb21pc2UpXG4gICAgICBnbG9iYWwuUHJvbWlzZSA9IFByb21pc2U7XG4gIH1cbiAgZnVuY3Rpb24gcG9seWZpbGxTdHJpbmcoU3RyaW5nKSB7XG4gICAgbWF5YmVBZGRGdW5jdGlvbnMoU3RyaW5nLnByb3RvdHlwZSwgWydjb2RlUG9pbnRBdCcsIGNvZGVQb2ludEF0LCAnY29udGFpbnMnLCBjb250YWlucywgJ2VuZHNXaXRoJywgZW5kc1dpdGgsICdzdGFydHNXaXRoJywgc3RhcnRzV2l0aCwgJ3JlcGVhdCcsIHJlcGVhdF0pO1xuICAgIG1heWJlQWRkRnVuY3Rpb25zKFN0cmluZywgWydmcm9tQ29kZVBvaW50JywgZnJvbUNvZGVQb2ludCwgJ3JhdycsIHJhd10pO1xuICB9XG4gIGZ1bmN0aW9uIHBvbHlmaWxsQXJyYXkoQXJyYXksIFN5bWJvbCkge1xuICAgIG1heWJlQWRkRnVuY3Rpb25zKEFycmF5LnByb3RvdHlwZSwgWydlbnRyaWVzJywgZW50cmllcywgJ2tleXMnLCBrZXlzLCAndmFsdWVzJywgdmFsdWVzXSk7XG4gICAgaWYgKFN5bWJvbCAmJiBTeW1ib2wuaXRlcmF0b3IpIHtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShBcnJheS5wcm90b3R5cGUsIFN5bWJvbC5pdGVyYXRvciwge1xuICAgICAgICB2YWx1ZTogdmFsdWVzLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZVxuICAgICAgfSk7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIHBvbHlmaWxsKGdsb2JhbCkge1xuICAgIHBvbHlmaWxsUHJvbWlzZShnbG9iYWwpO1xuICAgIHBvbHlmaWxsU3RyaW5nKGdsb2JhbC5TdHJpbmcpO1xuICAgIHBvbHlmaWxsQXJyYXkoZ2xvYmFsLkFycmF5LCBnbG9iYWwuU3ltYm9sKTtcbiAgfVxuICBwb2x5ZmlsbCh0aGlzKTtcbiAgdmFyIHNldHVwR2xvYmFscyA9ICR0cmFjZXVyUnVudGltZS5zZXR1cEdsb2JhbHM7XG4gICR0cmFjZXVyUnVudGltZS5zZXR1cEdsb2JhbHMgPSBmdW5jdGlvbihnbG9iYWwpIHtcbiAgICBzZXR1cEdsb2JhbHMoZ2xvYmFsKTtcbiAgICBwb2x5ZmlsbChnbG9iYWwpO1xuICB9O1xuICByZXR1cm4ge307XG59KTtcblN5c3RlbS5yZWdpc3RlcihcInRyYWNldXItcnVudGltZUAwLjAuMzIvc3JjL3J1bnRpbWUvcG9seWZpbGwtaW1wb3J0XCIsIFtdLCBmdW5jdGlvbigpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG4gIHZhciBfX21vZHVsZU5hbWUgPSBcInRyYWNldXItcnVudGltZUAwLjAuMzIvc3JjL3J1bnRpbWUvcG9seWZpbGwtaW1wb3J0XCI7XG4gIHZhciAkX18xMSA9IFN5c3RlbS5nZXQoXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjMyL3NyYy9ydW50aW1lL3BvbHlmaWxscy9wb2x5ZmlsbHNcIik7XG4gIHJldHVybiB7fTtcbn0pO1xuU3lzdGVtLmdldChcInRyYWNldXItcnVudGltZUAwLjAuMzIvc3JjL3J1bnRpbWUvcG9seWZpbGwtaW1wb3J0XCIgKyAnJyk7XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2luc2VydC1tb2R1bGUtZ2xvYmFscy9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCJcInVzZSBzdHJpY3RcIjtcbmV4cG9ydHMudGVzdCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG59OyIsIlwidXNlIHN0cmljdFwiO1xudmFyIHR5cGVzID0gW1xuICAgIHJlcXVpcmUoXCIuL25leHRUaWNrXCIpLFxuICAgIHJlcXVpcmUoXCIuL211dGF0aW9uXCIpLFxuICAgIHJlcXVpcmUoXCIuL3Bvc3RNZXNzYWdlXCIpLFxuICAgIHJlcXVpcmUoXCIuL21lc3NhZ2VDaGFubmVsXCIpLFxuICAgIHJlcXVpcmUoXCIuL3N0YXRlQ2hhbmdlXCIpLFxuICAgIHJlcXVpcmUoXCIuL3RpbWVvdXRcIilcbl07XG52YXIgaGFuZGxlclF1ZXVlID0gW107XG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIHZhciBpID0gMCxcbiAgICAgICAgdGFzayxcbiAgICAgICAgaW5uZXJRdWV1ZSA9IGhhbmRsZXJRdWV1ZTtcblx0aGFuZGxlclF1ZXVlID0gW107XG5cdC8qanNsaW50IGJvc3M6IHRydWUgKi9cblx0d2hpbGUgKHRhc2sgPSBpbm5lclF1ZXVlW2krK10pIHtcblx0XHR0YXNrKCk7XG5cdH1cbn1cbnZhciBuZXh0VGljaztcbnZhciBpID0gLTE7XG52YXIgbGVuID0gdHlwZXMubGVuZ3RoO1xud2hpbGUgKCsrIGkgPCBsZW4pIHtcbiAgICBpZiAodHlwZXNbaV0udGVzdCgpKSB7XG4gICAgICAgIG5leHRUaWNrID0gdHlwZXNbaV0uaW5zdGFsbChkcmFpblF1ZXVlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAodGFzaykge1xuICAgIHZhciBsZW4sIGksIGFyZ3M7XG4gICAgdmFyIG5UYXNrID0gdGFzaztcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgdHlwZW9mIHRhc2sgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICAgICAgaSA9IDA7XG4gICAgICAgIHdoaWxlICgrK2kgPCBhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgICAgICBuVGFzayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRhc2suYXBwbHkodW5kZWZpbmVkLCBhcmdzKTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgaWYgKChsZW4gPSBoYW5kbGVyUXVldWUucHVzaChuVGFzaykpID09PSAxKSB7XG4gICAgICAgIG5leHRUaWNrKGRyYWluUXVldWUpO1xuICAgIH1cbiAgICByZXR1cm4gbGVuO1xufTtcbm1vZHVsZS5leHBvcnRzLmNsZWFyID0gZnVuY3Rpb24gKG4pIHtcbiAgICBpZiAobiA8PSBoYW5kbGVyUXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGhhbmRsZXJRdWV1ZVtuIC0gMV0gPSBmdW5jdGlvbiAoKSB7fTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuIiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbmV4cG9ydHMudGVzdCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdHlwZW9mIGdsb2JhbC5NZXNzYWdlQ2hhbm5lbCAhPT0gXCJ1bmRlZmluZWRcIjtcbn07XG5cbmV4cG9ydHMuaW5zdGFsbCA9IGZ1bmN0aW9uIChmdW5jKSB7XG4gICAgdmFyIGNoYW5uZWwgPSBuZXcgZ2xvYmFsLk1lc3NhZ2VDaGFubmVsKCk7XG4gICAgY2hhbm5lbC5wb3J0MS5vbm1lc3NhZ2UgPSBmdW5jO1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNoYW5uZWwucG9ydDIucG9zdE1lc3NhZ2UoMCk7XG4gICAgfTtcbn07XG59KS5jYWxsKHRoaXMsdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KSIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcblwidXNlIHN0cmljdFwiO1xuLy9iYXNlZCBvZmYgcnN2cFxuLy9odHRwczovL2dpdGh1Yi5jb20vdGlsZGVpby9yc3ZwLmpzL2Jsb2IvbWFzdGVyL2xpYi9yc3ZwL2FzeW5jLmpzXG5cbnZhciBNdXRhdGlvbk9ic2VydmVyID0gZ2xvYmFsLk11dGF0aW9uT2JzZXJ2ZXIgfHwgZ2xvYmFsLldlYktpdE11dGF0aW9uT2JzZXJ2ZXI7XG5cbmV4cG9ydHMudGVzdCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gTXV0YXRpb25PYnNlcnZlcjtcbn07XG5cbmV4cG9ydHMuaW5zdGFsbCA9IGZ1bmN0aW9uIChoYW5kbGUpIHtcbiAgICB2YXIgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcihoYW5kbGUpO1xuICAgIHZhciBlbGVtZW50ID0gZ2xvYmFsLmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgb2JzZXJ2ZXIub2JzZXJ2ZShlbGVtZW50LCB7IGF0dHJpYnV0ZXM6IHRydWUgfSk7XG5cbiAgICAvLyBDaHJvbWUgTWVtb3J5IExlYWs6IGh0dHBzOi8vYnVncy53ZWJraXQub3JnL3Nob3dfYnVnLmNnaT9pZD05MzY2MVxuICAgIGdsb2JhbC5hZGRFdmVudExpc3RlbmVyKFwidW5sb2FkXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgb2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICAgICAgICBvYnNlcnZlciA9IG51bGw7XG4gICAgfSwgZmFsc2UpO1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKFwiZHJhaW5RdWV1ZVwiLCBcImRyYWluUXVldWVcIik7XG4gICAgfTtcbn07XG59KS5jYWxsKHRoaXMsdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KSIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcblwidXNlIHN0cmljdFwiO1xuZXhwb3J0cy50ZXN0ID0gZnVuY3Rpb24gKCkge1xuICAgIC8vIFRoZSB0ZXN0IGFnYWluc3QgYGltcG9ydFNjcmlwdHNgIHByZXZlbnRzIHRoaXMgaW1wbGVtZW50YXRpb24gZnJvbSBiZWluZyBpbnN0YWxsZWQgaW5zaWRlIGEgd2ViIHdvcmtlcixcbiAgICAvLyB3aGVyZSBgZ2xvYmFsLnBvc3RNZXNzYWdlYCBtZWFucyBzb21ldGhpbmcgY29tcGxldGVseSBkaWZmZXJlbnQgYW5kIGNhblwidCBiZSB1c2VkIGZvciB0aGlzIHB1cnBvc2UuXG5cbiAgICBpZiAoIWdsb2JhbC5wb3N0TWVzc2FnZSB8fCBnbG9iYWwuaW1wb3J0U2NyaXB0cykge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgdmFyIHBvc3RNZXNzYWdlSXNBc3luY2hyb25vdXMgPSB0cnVlO1xuICAgIHZhciBvbGRPbk1lc3NhZ2UgPSBnbG9iYWwub25tZXNzYWdlO1xuICAgIGdsb2JhbC5vbm1lc3NhZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHBvc3RNZXNzYWdlSXNBc3luY2hyb25vdXMgPSBmYWxzZTtcbiAgICB9O1xuICAgIGdsb2JhbC5wb3N0TWVzc2FnZShcIlwiLCBcIipcIik7XG4gICAgZ2xvYmFsLm9ubWVzc2FnZSA9IG9sZE9uTWVzc2FnZTtcblxuICAgIHJldHVybiBwb3N0TWVzc2FnZUlzQXN5bmNocm9ub3VzO1xufTtcblxuZXhwb3J0cy5pbnN0YWxsID0gZnVuY3Rpb24gKGZ1bmMpIHtcbiAgICB2YXIgY29kZVdvcmQgPSBcImNvbS5jYWx2aW5tZXRjYWxmLnNldEltbWVkaWF0ZVwiICsgTWF0aC5yYW5kb20oKTtcbiAgICBmdW5jdGlvbiBnbG9iYWxNZXNzYWdlKGV2ZW50KSB7XG4gICAgICAgIGlmIChldmVudC5zb3VyY2UgPT09IGdsb2JhbCAmJiBldmVudC5kYXRhID09PSBjb2RlV29yZCkge1xuICAgICAgICAgICAgZnVuYygpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmIChnbG9iYWwuYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgICAgICBnbG9iYWwuYWRkRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIiwgZ2xvYmFsTWVzc2FnZSwgZmFsc2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGdsb2JhbC5hdHRhY2hFdmVudChcIm9ubWVzc2FnZVwiLCBnbG9iYWxNZXNzYWdlKTtcbiAgICB9XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZ2xvYmFsLnBvc3RNZXNzYWdlKGNvZGVXb3JkLCBcIipcIik7XG4gICAgfTtcbn07XG59KS5jYWxsKHRoaXMsdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KSIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcblwidXNlIHN0cmljdFwiO1xuXG5leHBvcnRzLnRlc3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIFwiZG9jdW1lbnRcIiBpbiBnbG9iYWwgJiYgXCJvbnJlYWR5c3RhdGVjaGFuZ2VcIiBpbiBnbG9iYWwuZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtcbn07XG5cbmV4cG9ydHMuaW5zdGFsbCA9IGZ1bmN0aW9uIChoYW5kbGUpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIC8vIENyZWF0ZSBhIDxzY3JpcHQ+IGVsZW1lbnQ7IGl0cyByZWFkeXN0YXRlY2hhbmdlIGV2ZW50IHdpbGwgYmUgZmlyZWQgYXN5bmNocm9ub3VzbHkgb25jZSBpdCBpcyBpbnNlcnRlZFxuICAgICAgICAvLyBpbnRvIHRoZSBkb2N1bWVudC4gRG8gc28sIHRodXMgcXVldWluZyB1cCB0aGUgdGFzay4gUmVtZW1iZXIgdG8gY2xlYW4gdXAgb25jZSBpdCdzIGJlZW4gY2FsbGVkLlxuICAgICAgICB2YXIgc2NyaXB0RWwgPSBnbG9iYWwuZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtcbiAgICAgICAgc2NyaXB0RWwub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaGFuZGxlKCk7XG5cbiAgICAgICAgICAgIHNjcmlwdEVsLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IG51bGw7XG4gICAgICAgICAgICBzY3JpcHRFbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHNjcmlwdEVsKTtcbiAgICAgICAgICAgIHNjcmlwdEVsID0gbnVsbDtcbiAgICAgICAgfTtcbiAgICAgICAgZ2xvYmFsLmRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5hcHBlbmRDaGlsZChzY3JpcHRFbCk7XG5cbiAgICAgICAgcmV0dXJuIGhhbmRsZTtcbiAgICB9O1xufTtcbn0pLmNhbGwodGhpcyx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pIiwiXCJ1c2Ugc3RyaWN0XCI7XG5leHBvcnRzLnRlc3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRydWU7XG59O1xuXG5leHBvcnRzLmluc3RhbGwgPSBmdW5jdGlvbiAodCkge1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNldFRpbWVvdXQodCwgMCk7XG4gICAgfTtcbn07IiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xuIWZ1bmN0aW9uKGUpe2lmKFwib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzKW1vZHVsZS5leHBvcnRzPWUoKTtlbHNlIGlmKFwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZClkZWZpbmUoZSk7ZWxzZXt2YXIgZjtcInVuZGVmaW5lZFwiIT10eXBlb2Ygd2luZG93P2Y9d2luZG93OlwidW5kZWZpbmVkXCIhPXR5cGVvZiBnbG9iYWw/Zj1nbG9iYWw6XCJ1bmRlZmluZWRcIiE9dHlwZW9mIHNlbGYmJihmPXNlbGYpLGYuamFkZT1lKCl9fShmdW5jdGlvbigpe3ZhciBkZWZpbmUsbW9kdWxlLGV4cG9ydHM7cmV0dXJuIChmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pKHsxOltmdW5jdGlvbihfZGVyZXFfLG1vZHVsZSxleHBvcnRzKXtcbid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBNZXJnZSB0d28gYXR0cmlidXRlIG9iamVjdHMgZ2l2aW5nIHByZWNlZGVuY2VcbiAqIHRvIHZhbHVlcyBpbiBvYmplY3QgYGJgLiBDbGFzc2VzIGFyZSBzcGVjaWFsLWNhc2VkXG4gKiBhbGxvd2luZyBmb3IgYXJyYXlzIGFuZCBtZXJnaW5nL2pvaW5pbmcgYXBwcm9wcmlhdGVseVxuICogcmVzdWx0aW5nIGluIGEgc3RyaW5nLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBhXG4gKiBAcGFyYW0ge09iamVjdH0gYlxuICogQHJldHVybiB7T2JqZWN0fSBhXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5leHBvcnRzLm1lcmdlID0gZnVuY3Rpb24gbWVyZ2UoYSwgYikge1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgIHZhciBhdHRycyA9IGFbMF07XG4gICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhLmxlbmd0aDsgaSsrKSB7XG4gICAgICBhdHRycyA9IG1lcmdlKGF0dHJzLCBhW2ldKTtcbiAgICB9XG4gICAgcmV0dXJuIGF0dHJzO1xuICB9XG4gIHZhciBhYyA9IGFbJ2NsYXNzJ107XG4gIHZhciBiYyA9IGJbJ2NsYXNzJ107XG5cbiAgaWYgKGFjIHx8IGJjKSB7XG4gICAgYWMgPSBhYyB8fCBbXTtcbiAgICBiYyA9IGJjIHx8IFtdO1xuICAgIGlmICghQXJyYXkuaXNBcnJheShhYykpIGFjID0gW2FjXTtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoYmMpKSBiYyA9IFtiY107XG4gICAgYVsnY2xhc3MnXSA9IGFjLmNvbmNhdChiYykuZmlsdGVyKG51bGxzKTtcbiAgfVxuXG4gIGZvciAodmFyIGtleSBpbiBiKSB7XG4gICAgaWYgKGtleSAhPSAnY2xhc3MnKSB7XG4gICAgICBhW2tleV0gPSBiW2tleV07XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGE7XG59O1xuXG4vKipcbiAqIEZpbHRlciBudWxsIGB2YWxgcy5cbiAqXG4gKiBAcGFyYW0geyp9IHZhbFxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIG51bGxzKHZhbCkge1xuICByZXR1cm4gdmFsICE9IG51bGwgJiYgdmFsICE9PSAnJztcbn1cblxuLyoqXG4gKiBqb2luIGFycmF5IGFzIGNsYXNzZXMuXG4gKlxuICogQHBhcmFtIHsqfSB2YWxcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuZXhwb3J0cy5qb2luQ2xhc3NlcyA9IGpvaW5DbGFzc2VzO1xuZnVuY3Rpb24gam9pbkNsYXNzZXModmFsKSB7XG4gIHJldHVybiBBcnJheS5pc0FycmF5KHZhbCkgPyB2YWwubWFwKGpvaW5DbGFzc2VzKS5maWx0ZXIobnVsbHMpLmpvaW4oJyAnKSA6IHZhbDtcbn1cblxuLyoqXG4gKiBSZW5kZXIgdGhlIGdpdmVuIGNsYXNzZXMuXG4gKlxuICogQHBhcmFtIHtBcnJheX0gY2xhc3Nlc1xuICogQHBhcmFtIHtBcnJheS48Qm9vbGVhbj59IGVzY2FwZWRcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuZXhwb3J0cy5jbHMgPSBmdW5jdGlvbiBjbHMoY2xhc3NlcywgZXNjYXBlZCkge1xuICB2YXIgYnVmID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgY2xhc3Nlcy5sZW5ndGg7IGkrKykge1xuICAgIGlmIChlc2NhcGVkICYmIGVzY2FwZWRbaV0pIHtcbiAgICAgIGJ1Zi5wdXNoKGV4cG9ydHMuZXNjYXBlKGpvaW5DbGFzc2VzKFtjbGFzc2VzW2ldXSkpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYnVmLnB1c2goam9pbkNsYXNzZXMoY2xhc3Nlc1tpXSkpO1xuICAgIH1cbiAgfVxuICB2YXIgdGV4dCA9IGpvaW5DbGFzc2VzKGJ1Zik7XG4gIGlmICh0ZXh0Lmxlbmd0aCkge1xuICAgIHJldHVybiAnIGNsYXNzPVwiJyArIHRleHQgKyAnXCInO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiAnJztcbiAgfVxufTtcblxuLyoqXG4gKiBSZW5kZXIgdGhlIGdpdmVuIGF0dHJpYnV0ZS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30ga2V5XG4gKiBAcGFyYW0ge1N0cmluZ30gdmFsXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGVzY2FwZWRcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gdGVyc2VcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuZXhwb3J0cy5hdHRyID0gZnVuY3Rpb24gYXR0cihrZXksIHZhbCwgZXNjYXBlZCwgdGVyc2UpIHtcbiAgaWYgKCdib29sZWFuJyA9PSB0eXBlb2YgdmFsIHx8IG51bGwgPT0gdmFsKSB7XG4gICAgaWYgKHZhbCkge1xuICAgICAgcmV0dXJuICcgJyArICh0ZXJzZSA/IGtleSA6IGtleSArICc9XCInICsga2V5ICsgJ1wiJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG4gIH0gZWxzZSBpZiAoMCA9PSBrZXkuaW5kZXhPZignZGF0YScpICYmICdzdHJpbmcnICE9IHR5cGVvZiB2YWwpIHtcbiAgICByZXR1cm4gJyAnICsga2V5ICsgXCI9J1wiICsgSlNPTi5zdHJpbmdpZnkodmFsKS5yZXBsYWNlKC8nL2csICcmYXBvczsnKSArIFwiJ1wiO1xuICB9IGVsc2UgaWYgKGVzY2FwZWQpIHtcbiAgICByZXR1cm4gJyAnICsga2V5ICsgJz1cIicgKyBleHBvcnRzLmVzY2FwZSh2YWwpICsgJ1wiJztcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gJyAnICsga2V5ICsgJz1cIicgKyB2YWwgKyAnXCInO1xuICB9XG59O1xuXG4vKipcbiAqIFJlbmRlciB0aGUgZ2l2ZW4gYXR0cmlidXRlcyBvYmplY3QuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHBhcmFtIHtPYmplY3R9IGVzY2FwZWRcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuZXhwb3J0cy5hdHRycyA9IGZ1bmN0aW9uIGF0dHJzKG9iaiwgdGVyc2Upe1xuICB2YXIgYnVmID0gW107XG5cbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhvYmopO1xuXG4gIGlmIChrZXlzLmxlbmd0aCkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7ICsraSkge1xuICAgICAgdmFyIGtleSA9IGtleXNbaV1cbiAgICAgICAgLCB2YWwgPSBvYmpba2V5XTtcblxuICAgICAgaWYgKCdjbGFzcycgPT0ga2V5KSB7XG4gICAgICAgIGlmICh2YWwgPSBqb2luQ2xhc3Nlcyh2YWwpKSB7XG4gICAgICAgICAgYnVmLnB1c2goJyAnICsga2V5ICsgJz1cIicgKyB2YWwgKyAnXCInKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYnVmLnB1c2goZXhwb3J0cy5hdHRyKGtleSwgdmFsLCBmYWxzZSwgdGVyc2UpKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gYnVmLmpvaW4oJycpO1xufTtcblxuLyoqXG4gKiBFc2NhcGUgdGhlIGdpdmVuIHN0cmluZyBvZiBgaHRtbGAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGh0bWxcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmV4cG9ydHMuZXNjYXBlID0gZnVuY3Rpb24gZXNjYXBlKGh0bWwpe1xuICB2YXIgcmVzdWx0ID0gU3RyaW5nKGh0bWwpXG4gICAgLnJlcGxhY2UoLyYvZywgJyZhbXA7JylcbiAgICAucmVwbGFjZSgvPC9nLCAnJmx0OycpXG4gICAgLnJlcGxhY2UoLz4vZywgJyZndDsnKVxuICAgIC5yZXBsYWNlKC9cIi9nLCAnJnF1b3Q7Jyk7XG4gIGlmIChyZXN1bHQgPT09ICcnICsgaHRtbCkgcmV0dXJuIGh0bWw7XG4gIGVsc2UgcmV0dXJuIHJlc3VsdDtcbn07XG5cbi8qKlxuICogUmUtdGhyb3cgdGhlIGdpdmVuIGBlcnJgIGluIGNvbnRleHQgdG8gdGhlXG4gKiB0aGUgamFkZSBpbiBgZmlsZW5hbWVgIGF0IHRoZSBnaXZlbiBgbGluZW5vYC5cbiAqXG4gKiBAcGFyYW0ge0Vycm9yfSBlcnJcbiAqIEBwYXJhbSB7U3RyaW5nfSBmaWxlbmFtZVxuICogQHBhcmFtIHtTdHJpbmd9IGxpbmVub1xuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZXhwb3J0cy5yZXRocm93ID0gZnVuY3Rpb24gcmV0aHJvdyhlcnIsIGZpbGVuYW1lLCBsaW5lbm8sIHN0cil7XG4gIGlmICghKGVyciBpbnN0YW5jZW9mIEVycm9yKSkgdGhyb3cgZXJyO1xuICBpZiAoKHR5cGVvZiB3aW5kb3cgIT0gJ3VuZGVmaW5lZCcgfHwgIWZpbGVuYW1lKSAmJiAhc3RyKSB7XG4gICAgZXJyLm1lc3NhZ2UgKz0gJyBvbiBsaW5lICcgKyBsaW5lbm87XG4gICAgdGhyb3cgZXJyO1xuICB9XG4gIHRyeSB7XG4gICAgc3RyID0gIHN0ciB8fCBfZGVyZXFfKCdmcycpLnJlYWRGaWxlU3luYyhmaWxlbmFtZSwgJ3V0ZjgnKVxuICB9IGNhdGNoIChleCkge1xuICAgIHJldGhyb3coZXJyLCBudWxsLCBsaW5lbm8pXG4gIH1cbiAgdmFyIGNvbnRleHQgPSAzXG4gICAgLCBsaW5lcyA9IHN0ci5zcGxpdCgnXFxuJylcbiAgICAsIHN0YXJ0ID0gTWF0aC5tYXgobGluZW5vIC0gY29udGV4dCwgMClcbiAgICAsIGVuZCA9IE1hdGgubWluKGxpbmVzLmxlbmd0aCwgbGluZW5vICsgY29udGV4dCk7XG5cbiAgLy8gRXJyb3IgY29udGV4dFxuICB2YXIgY29udGV4dCA9IGxpbmVzLnNsaWNlKHN0YXJ0LCBlbmQpLm1hcChmdW5jdGlvbihsaW5lLCBpKXtcbiAgICB2YXIgY3VyciA9IGkgKyBzdGFydCArIDE7XG4gICAgcmV0dXJuIChjdXJyID09IGxpbmVubyA/ICcgID4gJyA6ICcgICAgJylcbiAgICAgICsgY3VyclxuICAgICAgKyAnfCAnXG4gICAgICArIGxpbmU7XG4gIH0pLmpvaW4oJ1xcbicpO1xuXG4gIC8vIEFsdGVyIGV4Y2VwdGlvbiBtZXNzYWdlXG4gIGVyci5wYXRoID0gZmlsZW5hbWU7XG4gIGVyci5tZXNzYWdlID0gKGZpbGVuYW1lIHx8ICdKYWRlJykgKyAnOicgKyBsaW5lbm9cbiAgICArICdcXG4nICsgY29udGV4dCArICdcXG5cXG4nICsgZXJyLm1lc3NhZ2U7XG4gIHRocm93IGVycjtcbn07XG5cbn0se1wiZnNcIjoyfV0sMjpbZnVuY3Rpb24oX2RlcmVxXyxtb2R1bGUsZXhwb3J0cyl7XG5cbn0se31dfSx7fSxbMV0pXG4oMSlcbn0pO1xufSkuY2FsbCh0aGlzLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCIvKiFcbiAqIG51bWVyYWwuanNcbiAqIHZlcnNpb24gOiAxLjUuM1xuICogYXV0aG9yIDogQWRhbSBEcmFwZXJcbiAqIGxpY2Vuc2UgOiBNSVRcbiAqIGh0dHA6Ly9hZGFtd2RyYXBlci5naXRodWIuY29tL051bWVyYWwtanMvXG4gKi9cblxuKGZ1bmN0aW9uICgpIHtcblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgQ29uc3RhbnRzXG4gICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgdmFyIG51bWVyYWwsXG4gICAgICAgIFZFUlNJT04gPSAnMS41LjMnLFxuICAgICAgICAvLyBpbnRlcm5hbCBzdG9yYWdlIGZvciBsYW5ndWFnZSBjb25maWcgZmlsZXNcbiAgICAgICAgbGFuZ3VhZ2VzID0ge30sXG4gICAgICAgIGN1cnJlbnRMYW5ndWFnZSA9ICdlbicsXG4gICAgICAgIHplcm9Gb3JtYXQgPSBudWxsLFxuICAgICAgICBkZWZhdWx0Rm9ybWF0ID0gJzAsMCcsXG4gICAgICAgIC8vIGNoZWNrIGZvciBub2RlSlNcbiAgICAgICAgaGFzTW9kdWxlID0gKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKTtcblxuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICBDb25zdHJ1Y3RvcnNcbiAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cblxuICAgIC8vIE51bWVyYWwgcHJvdG90eXBlIG9iamVjdFxuICAgIGZ1bmN0aW9uIE51bWVyYWwgKG51bWJlcikge1xuICAgICAgICB0aGlzLl92YWx1ZSA9IG51bWJlcjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbXBsZW1lbnRhdGlvbiBvZiB0b0ZpeGVkKCkgdGhhdCB0cmVhdHMgZmxvYXRzIG1vcmUgbGlrZSBkZWNpbWFsc1xuICAgICAqXG4gICAgICogRml4ZXMgYmluYXJ5IHJvdW5kaW5nIGlzc3VlcyAoZWcuICgwLjYxNSkudG9GaXhlZCgyKSA9PT0gJzAuNjEnKSB0aGF0IHByZXNlbnRcbiAgICAgKiBwcm9ibGVtcyBmb3IgYWNjb3VudGluZy0gYW5kIGZpbmFuY2UtcmVsYXRlZCBzb2Z0d2FyZS5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiB0b0ZpeGVkICh2YWx1ZSwgcHJlY2lzaW9uLCByb3VuZGluZ0Z1bmN0aW9uLCBvcHRpb25hbHMpIHtcbiAgICAgICAgdmFyIHBvd2VyID0gTWF0aC5wb3coMTAsIHByZWNpc2lvbiksXG4gICAgICAgICAgICBvcHRpb25hbHNSZWdFeHAsXG4gICAgICAgICAgICBvdXRwdXQ7XG4gICAgICAgICAgICBcbiAgICAgICAgLy9yb3VuZGluZ0Z1bmN0aW9uID0gKHJvdW5kaW5nRnVuY3Rpb24gIT09IHVuZGVmaW5lZCA/IHJvdW5kaW5nRnVuY3Rpb24gOiBNYXRoLnJvdW5kKTtcbiAgICAgICAgLy8gTXVsdGlwbHkgdXAgYnkgcHJlY2lzaW9uLCByb3VuZCBhY2N1cmF0ZWx5LCB0aGVuIGRpdmlkZSBhbmQgdXNlIG5hdGl2ZSB0b0ZpeGVkKCk6XG4gICAgICAgIG91dHB1dCA9IChyb3VuZGluZ0Z1bmN0aW9uKHZhbHVlICogcG93ZXIpIC8gcG93ZXIpLnRvRml4ZWQocHJlY2lzaW9uKTtcblxuICAgICAgICBpZiAob3B0aW9uYWxzKSB7XG4gICAgICAgICAgICBvcHRpb25hbHNSZWdFeHAgPSBuZXcgUmVnRXhwKCcwezEsJyArIG9wdGlvbmFscyArICd9JCcpO1xuICAgICAgICAgICAgb3V0cHV0ID0gb3V0cHV0LnJlcGxhY2Uob3B0aW9uYWxzUmVnRXhwLCAnJyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgIH1cblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgRm9ybWF0dGluZ1xuICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgIC8vIGRldGVybWluZSB3aGF0IHR5cGUgb2YgZm9ybWF0dGluZyB3ZSBuZWVkIHRvIGRvXG4gICAgZnVuY3Rpb24gZm9ybWF0TnVtZXJhbCAobiwgZm9ybWF0LCByb3VuZGluZ0Z1bmN0aW9uKSB7XG4gICAgICAgIHZhciBvdXRwdXQ7XG5cbiAgICAgICAgLy8gZmlndXJlIG91dCB3aGF0IGtpbmQgb2YgZm9ybWF0IHdlIGFyZSBkZWFsaW5nIHdpdGhcbiAgICAgICAgaWYgKGZvcm1hdC5pbmRleE9mKCckJykgPiAtMSkgeyAvLyBjdXJyZW5jeSEhISEhXG4gICAgICAgICAgICBvdXRwdXQgPSBmb3JtYXRDdXJyZW5jeShuLCBmb3JtYXQsIHJvdW5kaW5nRnVuY3Rpb24pO1xuICAgICAgICB9IGVsc2UgaWYgKGZvcm1hdC5pbmRleE9mKCclJykgPiAtMSkgeyAvLyBwZXJjZW50YWdlXG4gICAgICAgICAgICBvdXRwdXQgPSBmb3JtYXRQZXJjZW50YWdlKG4sIGZvcm1hdCwgcm91bmRpbmdGdW5jdGlvbik7XG4gICAgICAgIH0gZWxzZSBpZiAoZm9ybWF0LmluZGV4T2YoJzonKSA+IC0xKSB7IC8vIHRpbWVcbiAgICAgICAgICAgIG91dHB1dCA9IGZvcm1hdFRpbWUobiwgZm9ybWF0KTtcbiAgICAgICAgfSBlbHNlIHsgLy8gcGxhaW4gb2wnIG51bWJlcnMgb3IgYnl0ZXNcbiAgICAgICAgICAgIG91dHB1dCA9IGZvcm1hdE51bWJlcihuLl92YWx1ZSwgZm9ybWF0LCByb3VuZGluZ0Z1bmN0aW9uKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHJldHVybiBzdHJpbmdcbiAgICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICB9XG5cbiAgICAvLyByZXZlcnQgdG8gbnVtYmVyXG4gICAgZnVuY3Rpb24gdW5mb3JtYXROdW1lcmFsIChuLCBzdHJpbmcpIHtcbiAgICAgICAgdmFyIHN0cmluZ09yaWdpbmFsID0gc3RyaW5nLFxuICAgICAgICAgICAgdGhvdXNhbmRSZWdFeHAsXG4gICAgICAgICAgICBtaWxsaW9uUmVnRXhwLFxuICAgICAgICAgICAgYmlsbGlvblJlZ0V4cCxcbiAgICAgICAgICAgIHRyaWxsaW9uUmVnRXhwLFxuICAgICAgICAgICAgc3VmZml4ZXMgPSBbJ0tCJywgJ01CJywgJ0dCJywgJ1RCJywgJ1BCJywgJ0VCJywgJ1pCJywgJ1lCJ10sXG4gICAgICAgICAgICBieXRlc011bHRpcGxpZXIgPSBmYWxzZSxcbiAgICAgICAgICAgIHBvd2VyO1xuXG4gICAgICAgIGlmIChzdHJpbmcuaW5kZXhPZignOicpID4gLTEpIHtcbiAgICAgICAgICAgIG4uX3ZhbHVlID0gdW5mb3JtYXRUaW1lKHN0cmluZyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoc3RyaW5nID09PSB6ZXJvRm9ybWF0KSB7XG4gICAgICAgICAgICAgICAgbi5fdmFsdWUgPSAwO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAobGFuZ3VhZ2VzW2N1cnJlbnRMYW5ndWFnZV0uZGVsaW1pdGVycy5kZWNpbWFsICE9PSAnLicpIHtcbiAgICAgICAgICAgICAgICAgICAgc3RyaW5nID0gc3RyaW5nLnJlcGxhY2UoL1xcLi9nLCcnKS5yZXBsYWNlKGxhbmd1YWdlc1tjdXJyZW50TGFuZ3VhZ2VdLmRlbGltaXRlcnMuZGVjaW1hbCwgJy4nKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBzZWUgaWYgYWJicmV2aWF0aW9ucyBhcmUgdGhlcmUgc28gdGhhdCB3ZSBjYW4gbXVsdGlwbHkgdG8gdGhlIGNvcnJlY3QgbnVtYmVyXG4gICAgICAgICAgICAgICAgdGhvdXNhbmRSZWdFeHAgPSBuZXcgUmVnRXhwKCdbXmEtekEtWl0nICsgbGFuZ3VhZ2VzW2N1cnJlbnRMYW5ndWFnZV0uYWJicmV2aWF0aW9ucy50aG91c2FuZCArICcoPzpcXFxcKXwoXFxcXCcgKyBsYW5ndWFnZXNbY3VycmVudExhbmd1YWdlXS5jdXJyZW5jeS5zeW1ib2wgKyAnKT8oPzpcXFxcKSk/KT8kJyk7XG4gICAgICAgICAgICAgICAgbWlsbGlvblJlZ0V4cCA9IG5ldyBSZWdFeHAoJ1teYS16QS1aXScgKyBsYW5ndWFnZXNbY3VycmVudExhbmd1YWdlXS5hYmJyZXZpYXRpb25zLm1pbGxpb24gKyAnKD86XFxcXCl8KFxcXFwnICsgbGFuZ3VhZ2VzW2N1cnJlbnRMYW5ndWFnZV0uY3VycmVuY3kuc3ltYm9sICsgJyk/KD86XFxcXCkpPyk/JCcpO1xuICAgICAgICAgICAgICAgIGJpbGxpb25SZWdFeHAgPSBuZXcgUmVnRXhwKCdbXmEtekEtWl0nICsgbGFuZ3VhZ2VzW2N1cnJlbnRMYW5ndWFnZV0uYWJicmV2aWF0aW9ucy5iaWxsaW9uICsgJyg/OlxcXFwpfChcXFxcJyArIGxhbmd1YWdlc1tjdXJyZW50TGFuZ3VhZ2VdLmN1cnJlbmN5LnN5bWJvbCArICcpPyg/OlxcXFwpKT8pPyQnKTtcbiAgICAgICAgICAgICAgICB0cmlsbGlvblJlZ0V4cCA9IG5ldyBSZWdFeHAoJ1teYS16QS1aXScgKyBsYW5ndWFnZXNbY3VycmVudExhbmd1YWdlXS5hYmJyZXZpYXRpb25zLnRyaWxsaW9uICsgJyg/OlxcXFwpfChcXFxcJyArIGxhbmd1YWdlc1tjdXJyZW50TGFuZ3VhZ2VdLmN1cnJlbmN5LnN5bWJvbCArICcpPyg/OlxcXFwpKT8pPyQnKTtcblxuICAgICAgICAgICAgICAgIC8vIHNlZSBpZiBieXRlcyBhcmUgdGhlcmUgc28gdGhhdCB3ZSBjYW4gbXVsdGlwbHkgdG8gdGhlIGNvcnJlY3QgbnVtYmVyXG4gICAgICAgICAgICAgICAgZm9yIChwb3dlciA9IDA7IHBvd2VyIDw9IHN1ZmZpeGVzLmxlbmd0aDsgcG93ZXIrKykge1xuICAgICAgICAgICAgICAgICAgICBieXRlc011bHRpcGxpZXIgPSAoc3RyaW5nLmluZGV4T2Yoc3VmZml4ZXNbcG93ZXJdKSA+IC0xKSA/IE1hdGgucG93KDEwMjQsIHBvd2VyICsgMSkgOiBmYWxzZTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoYnl0ZXNNdWx0aXBsaWVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIGRvIHNvbWUgbWF0aCB0byBjcmVhdGUgb3VyIG51bWJlclxuICAgICAgICAgICAgICAgIG4uX3ZhbHVlID0gKChieXRlc011bHRpcGxpZXIpID8gYnl0ZXNNdWx0aXBsaWVyIDogMSkgKiAoKHN0cmluZ09yaWdpbmFsLm1hdGNoKHRob3VzYW5kUmVnRXhwKSkgPyBNYXRoLnBvdygxMCwgMykgOiAxKSAqICgoc3RyaW5nT3JpZ2luYWwubWF0Y2gobWlsbGlvblJlZ0V4cCkpID8gTWF0aC5wb3coMTAsIDYpIDogMSkgKiAoKHN0cmluZ09yaWdpbmFsLm1hdGNoKGJpbGxpb25SZWdFeHApKSA/IE1hdGgucG93KDEwLCA5KSA6IDEpICogKChzdHJpbmdPcmlnaW5hbC5tYXRjaCh0cmlsbGlvblJlZ0V4cCkpID8gTWF0aC5wb3coMTAsIDEyKSA6IDEpICogKChzdHJpbmcuaW5kZXhPZignJScpID4gLTEpID8gMC4wMSA6IDEpICogKCgoc3RyaW5nLnNwbGl0KCctJykubGVuZ3RoICsgTWF0aC5taW4oc3RyaW5nLnNwbGl0KCcoJykubGVuZ3RoLTEsIHN0cmluZy5zcGxpdCgnKScpLmxlbmd0aC0xKSkgJSAyKT8gMTogLTEpICogTnVtYmVyKHN0cmluZy5yZXBsYWNlKC9bXjAtOVxcLl0rL2csICcnKSk7XG5cbiAgICAgICAgICAgICAgICAvLyByb3VuZCBpZiB3ZSBhcmUgdGFsa2luZyBhYm91dCBieXRlc1xuICAgICAgICAgICAgICAgIG4uX3ZhbHVlID0gKGJ5dGVzTXVsdGlwbGllcikgPyBNYXRoLmNlaWwobi5fdmFsdWUpIDogbi5fdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG4uX3ZhbHVlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZvcm1hdEN1cnJlbmN5IChuLCBmb3JtYXQsIHJvdW5kaW5nRnVuY3Rpb24pIHtcbiAgICAgICAgdmFyIHN5bWJvbEluZGV4ID0gZm9ybWF0LmluZGV4T2YoJyQnKSxcbiAgICAgICAgICAgIG9wZW5QYXJlbkluZGV4ID0gZm9ybWF0LmluZGV4T2YoJygnKSxcbiAgICAgICAgICAgIG1pbnVzU2lnbkluZGV4ID0gZm9ybWF0LmluZGV4T2YoJy0nKSxcbiAgICAgICAgICAgIHNwYWNlID0gJycsXG4gICAgICAgICAgICBzcGxpY2VJbmRleCxcbiAgICAgICAgICAgIG91dHB1dDtcblxuICAgICAgICAvLyBjaGVjayBmb3Igc3BhY2UgYmVmb3JlIG9yIGFmdGVyIGN1cnJlbmN5XG4gICAgICAgIGlmIChmb3JtYXQuaW5kZXhPZignICQnKSA+IC0xKSB7XG4gICAgICAgICAgICBzcGFjZSA9ICcgJztcbiAgICAgICAgICAgIGZvcm1hdCA9IGZvcm1hdC5yZXBsYWNlKCcgJCcsICcnKTtcbiAgICAgICAgfSBlbHNlIGlmIChmb3JtYXQuaW5kZXhPZignJCAnKSA+IC0xKSB7XG4gICAgICAgICAgICBzcGFjZSA9ICcgJztcbiAgICAgICAgICAgIGZvcm1hdCA9IGZvcm1hdC5yZXBsYWNlKCckICcsICcnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZvcm1hdCA9IGZvcm1hdC5yZXBsYWNlKCckJywgJycpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gZm9ybWF0IHRoZSBudW1iZXJcbiAgICAgICAgb3V0cHV0ID0gZm9ybWF0TnVtYmVyKG4uX3ZhbHVlLCBmb3JtYXQsIHJvdW5kaW5nRnVuY3Rpb24pO1xuXG4gICAgICAgIC8vIHBvc2l0aW9uIHRoZSBzeW1ib2xcbiAgICAgICAgaWYgKHN5bWJvbEluZGV4IDw9IDEpIHtcbiAgICAgICAgICAgIGlmIChvdXRwdXQuaW5kZXhPZignKCcpID4gLTEgfHwgb3V0cHV0LmluZGV4T2YoJy0nKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgb3V0cHV0ID0gb3V0cHV0LnNwbGl0KCcnKTtcbiAgICAgICAgICAgICAgICBzcGxpY2VJbmRleCA9IDE7XG4gICAgICAgICAgICAgICAgaWYgKHN5bWJvbEluZGV4IDwgb3BlblBhcmVuSW5kZXggfHwgc3ltYm9sSW5kZXggPCBtaW51c1NpZ25JbmRleCl7XG4gICAgICAgICAgICAgICAgICAgIC8vIHRoZSBzeW1ib2wgYXBwZWFycyBiZWZvcmUgdGhlIFwiKFwiIG9yIFwiLVwiXG4gICAgICAgICAgICAgICAgICAgIHNwbGljZUluZGV4ID0gMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgb3V0cHV0LnNwbGljZShzcGxpY2VJbmRleCwgMCwgbGFuZ3VhZ2VzW2N1cnJlbnRMYW5ndWFnZV0uY3VycmVuY3kuc3ltYm9sICsgc3BhY2UpO1xuICAgICAgICAgICAgICAgIG91dHB1dCA9IG91dHB1dC5qb2luKCcnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgb3V0cHV0ID0gbGFuZ3VhZ2VzW2N1cnJlbnRMYW5ndWFnZV0uY3VycmVuY3kuc3ltYm9sICsgc3BhY2UgKyBvdXRwdXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAob3V0cHV0LmluZGV4T2YoJyknKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgb3V0cHV0ID0gb3V0cHV0LnNwbGl0KCcnKTtcbiAgICAgICAgICAgICAgICBvdXRwdXQuc3BsaWNlKC0xLCAwLCBzcGFjZSArIGxhbmd1YWdlc1tjdXJyZW50TGFuZ3VhZ2VdLmN1cnJlbmN5LnN5bWJvbCk7XG4gICAgICAgICAgICAgICAgb3V0cHV0ID0gb3V0cHV0LmpvaW4oJycpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBvdXRwdXQgPSBvdXRwdXQgKyBzcGFjZSArIGxhbmd1YWdlc1tjdXJyZW50TGFuZ3VhZ2VdLmN1cnJlbmN5LnN5bWJvbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZm9ybWF0UGVyY2VudGFnZSAobiwgZm9ybWF0LCByb3VuZGluZ0Z1bmN0aW9uKSB7XG4gICAgICAgIHZhciBzcGFjZSA9ICcnLFxuICAgICAgICAgICAgb3V0cHV0LFxuICAgICAgICAgICAgdmFsdWUgPSBuLl92YWx1ZSAqIDEwMDtcblxuICAgICAgICAvLyBjaGVjayBmb3Igc3BhY2UgYmVmb3JlICVcbiAgICAgICAgaWYgKGZvcm1hdC5pbmRleE9mKCcgJScpID4gLTEpIHtcbiAgICAgICAgICAgIHNwYWNlID0gJyAnO1xuICAgICAgICAgICAgZm9ybWF0ID0gZm9ybWF0LnJlcGxhY2UoJyAlJywgJycpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZm9ybWF0ID0gZm9ybWF0LnJlcGxhY2UoJyUnLCAnJyk7XG4gICAgICAgIH1cblxuICAgICAgICBvdXRwdXQgPSBmb3JtYXROdW1iZXIodmFsdWUsIGZvcm1hdCwgcm91bmRpbmdGdW5jdGlvbik7XG4gICAgICAgIFxuICAgICAgICBpZiAob3V0cHV0LmluZGV4T2YoJyknKSA+IC0xICkge1xuICAgICAgICAgICAgb3V0cHV0ID0gb3V0cHV0LnNwbGl0KCcnKTtcbiAgICAgICAgICAgIG91dHB1dC5zcGxpY2UoLTEsIDAsIHNwYWNlICsgJyUnKTtcbiAgICAgICAgICAgIG91dHB1dCA9IG91dHB1dC5qb2luKCcnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG91dHB1dCA9IG91dHB1dCArIHNwYWNlICsgJyUnO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmb3JtYXRUaW1lIChuKSB7XG4gICAgICAgIHZhciBob3VycyA9IE1hdGguZmxvb3Iobi5fdmFsdWUvNjAvNjApLFxuICAgICAgICAgICAgbWludXRlcyA9IE1hdGguZmxvb3IoKG4uX3ZhbHVlIC0gKGhvdXJzICogNjAgKiA2MCkpLzYwKSxcbiAgICAgICAgICAgIHNlY29uZHMgPSBNYXRoLnJvdW5kKG4uX3ZhbHVlIC0gKGhvdXJzICogNjAgKiA2MCkgLSAobWludXRlcyAqIDYwKSk7XG4gICAgICAgIHJldHVybiBob3VycyArICc6JyArICgobWludXRlcyA8IDEwKSA/ICcwJyArIG1pbnV0ZXMgOiBtaW51dGVzKSArICc6JyArICgoc2Vjb25kcyA8IDEwKSA/ICcwJyArIHNlY29uZHMgOiBzZWNvbmRzKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB1bmZvcm1hdFRpbWUgKHN0cmluZykge1xuICAgICAgICB2YXIgdGltZUFycmF5ID0gc3RyaW5nLnNwbGl0KCc6JyksXG4gICAgICAgICAgICBzZWNvbmRzID0gMDtcbiAgICAgICAgLy8gdHVybiBob3VycyBhbmQgbWludXRlcyBpbnRvIHNlY29uZHMgYW5kIGFkZCB0aGVtIGFsbCB1cFxuICAgICAgICBpZiAodGltZUFycmF5Lmxlbmd0aCA9PT0gMykge1xuICAgICAgICAgICAgLy8gaG91cnNcbiAgICAgICAgICAgIHNlY29uZHMgPSBzZWNvbmRzICsgKE51bWJlcih0aW1lQXJyYXlbMF0pICogNjAgKiA2MCk7XG4gICAgICAgICAgICAvLyBtaW51dGVzXG4gICAgICAgICAgICBzZWNvbmRzID0gc2Vjb25kcyArIChOdW1iZXIodGltZUFycmF5WzFdKSAqIDYwKTtcbiAgICAgICAgICAgIC8vIHNlY29uZHNcbiAgICAgICAgICAgIHNlY29uZHMgPSBzZWNvbmRzICsgTnVtYmVyKHRpbWVBcnJheVsyXSk7XG4gICAgICAgIH0gZWxzZSBpZiAodGltZUFycmF5Lmxlbmd0aCA9PT0gMikge1xuICAgICAgICAgICAgLy8gbWludXRlc1xuICAgICAgICAgICAgc2Vjb25kcyA9IHNlY29uZHMgKyAoTnVtYmVyKHRpbWVBcnJheVswXSkgKiA2MCk7XG4gICAgICAgICAgICAvLyBzZWNvbmRzXG4gICAgICAgICAgICBzZWNvbmRzID0gc2Vjb25kcyArIE51bWJlcih0aW1lQXJyYXlbMV0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBOdW1iZXIoc2Vjb25kcyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZm9ybWF0TnVtYmVyICh2YWx1ZSwgZm9ybWF0LCByb3VuZGluZ0Z1bmN0aW9uKSB7XG4gICAgICAgIHZhciBuZWdQID0gZmFsc2UsXG4gICAgICAgICAgICBzaWduZWQgPSBmYWxzZSxcbiAgICAgICAgICAgIG9wdERlYyA9IGZhbHNlLFxuICAgICAgICAgICAgYWJiciA9ICcnLFxuICAgICAgICAgICAgYWJicksgPSBmYWxzZSwgLy8gZm9yY2UgYWJicmV2aWF0aW9uIHRvIHRob3VzYW5kc1xuICAgICAgICAgICAgYWJick0gPSBmYWxzZSwgLy8gZm9yY2UgYWJicmV2aWF0aW9uIHRvIG1pbGxpb25zXG4gICAgICAgICAgICBhYmJyQiA9IGZhbHNlLCAvLyBmb3JjZSBhYmJyZXZpYXRpb24gdG8gYmlsbGlvbnNcbiAgICAgICAgICAgIGFiYnJUID0gZmFsc2UsIC8vIGZvcmNlIGFiYnJldmlhdGlvbiB0byB0cmlsbGlvbnNcbiAgICAgICAgICAgIGFiYnJGb3JjZSA9IGZhbHNlLCAvLyBmb3JjZSBhYmJyZXZpYXRpb25cbiAgICAgICAgICAgIGJ5dGVzID0gJycsXG4gICAgICAgICAgICBvcmQgPSAnJyxcbiAgICAgICAgICAgIGFicyA9IE1hdGguYWJzKHZhbHVlKSxcbiAgICAgICAgICAgIHN1ZmZpeGVzID0gWydCJywgJ0tCJywgJ01CJywgJ0dCJywgJ1RCJywgJ1BCJywgJ0VCJywgJ1pCJywgJ1lCJ10sXG4gICAgICAgICAgICBtaW4sXG4gICAgICAgICAgICBtYXgsXG4gICAgICAgICAgICBwb3dlcixcbiAgICAgICAgICAgIHcsXG4gICAgICAgICAgICBwcmVjaXNpb24sXG4gICAgICAgICAgICB0aG91c2FuZHMsXG4gICAgICAgICAgICBkID0gJycsXG4gICAgICAgICAgICBuZWcgPSBmYWxzZTtcblxuICAgICAgICAvLyBjaGVjayBpZiBudW1iZXIgaXMgemVybyBhbmQgYSBjdXN0b20gemVybyBmb3JtYXQgaGFzIGJlZW4gc2V0XG4gICAgICAgIGlmICh2YWx1ZSA9PT0gMCAmJiB6ZXJvRm9ybWF0ICE9PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gemVyb0Zvcm1hdDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIHNlZSBpZiB3ZSBzaG91bGQgdXNlIHBhcmVudGhlc2VzIGZvciBuZWdhdGl2ZSBudW1iZXIgb3IgaWYgd2Ugc2hvdWxkIHByZWZpeCB3aXRoIGEgc2lnblxuICAgICAgICAgICAgLy8gaWYgYm90aCBhcmUgcHJlc2VudCB3ZSBkZWZhdWx0IHRvIHBhcmVudGhlc2VzXG4gICAgICAgICAgICBpZiAoZm9ybWF0LmluZGV4T2YoJygnKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgbmVnUCA9IHRydWU7XG4gICAgICAgICAgICAgICAgZm9ybWF0ID0gZm9ybWF0LnNsaWNlKDEsIC0xKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZm9ybWF0LmluZGV4T2YoJysnKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgc2lnbmVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBmb3JtYXQgPSBmb3JtYXQucmVwbGFjZSgvXFwrL2csICcnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gc2VlIGlmIGFiYnJldmlhdGlvbiBpcyB3YW50ZWRcbiAgICAgICAgICAgIGlmIChmb3JtYXQuaW5kZXhPZignYScpID4gLTEpIHtcbiAgICAgICAgICAgICAgICAvLyBjaGVjayBpZiBhYmJyZXZpYXRpb24gaXMgc3BlY2lmaWVkXG4gICAgICAgICAgICAgICAgYWJicksgPSBmb3JtYXQuaW5kZXhPZignYUsnKSA+PSAwO1xuICAgICAgICAgICAgICAgIGFiYnJNID0gZm9ybWF0LmluZGV4T2YoJ2FNJykgPj0gMDtcbiAgICAgICAgICAgICAgICBhYmJyQiA9IGZvcm1hdC5pbmRleE9mKCdhQicpID49IDA7XG4gICAgICAgICAgICAgICAgYWJiclQgPSBmb3JtYXQuaW5kZXhPZignYVQnKSA+PSAwO1xuICAgICAgICAgICAgICAgIGFiYnJGb3JjZSA9IGFiYnJLIHx8IGFiYnJNIHx8IGFiYnJCIHx8IGFiYnJUO1xuXG4gICAgICAgICAgICAgICAgLy8gY2hlY2sgZm9yIHNwYWNlIGJlZm9yZSBhYmJyZXZpYXRpb25cbiAgICAgICAgICAgICAgICBpZiAoZm9ybWF0LmluZGV4T2YoJyBhJykgPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICBhYmJyID0gJyAnO1xuICAgICAgICAgICAgICAgICAgICBmb3JtYXQgPSBmb3JtYXQucmVwbGFjZSgnIGEnLCAnJyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZm9ybWF0ID0gZm9ybWF0LnJlcGxhY2UoJ2EnLCAnJyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGFicyA+PSBNYXRoLnBvdygxMCwgMTIpICYmICFhYmJyRm9yY2UgfHwgYWJiclQpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gdHJpbGxpb25cbiAgICAgICAgICAgICAgICAgICAgYWJiciA9IGFiYnIgKyBsYW5ndWFnZXNbY3VycmVudExhbmd1YWdlXS5hYmJyZXZpYXRpb25zLnRyaWxsaW9uO1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlIC8gTWF0aC5wb3coMTAsIDEyKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGFicyA8IE1hdGgucG93KDEwLCAxMikgJiYgYWJzID49IE1hdGgucG93KDEwLCA5KSAmJiAhYWJickZvcmNlIHx8IGFiYnJCKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGJpbGxpb25cbiAgICAgICAgICAgICAgICAgICAgYWJiciA9IGFiYnIgKyBsYW5ndWFnZXNbY3VycmVudExhbmd1YWdlXS5hYmJyZXZpYXRpb25zLmJpbGxpb247XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUgLyBNYXRoLnBvdygxMCwgOSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChhYnMgPCBNYXRoLnBvdygxMCwgOSkgJiYgYWJzID49IE1hdGgucG93KDEwLCA2KSAmJiAhYWJickZvcmNlIHx8IGFiYnJNKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIG1pbGxpb25cbiAgICAgICAgICAgICAgICAgICAgYWJiciA9IGFiYnIgKyBsYW5ndWFnZXNbY3VycmVudExhbmd1YWdlXS5hYmJyZXZpYXRpb25zLm1pbGxpb247XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUgLyBNYXRoLnBvdygxMCwgNik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChhYnMgPCBNYXRoLnBvdygxMCwgNikgJiYgYWJzID49IE1hdGgucG93KDEwLCAzKSAmJiAhYWJickZvcmNlIHx8IGFiYnJLKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHRob3VzYW5kXG4gICAgICAgICAgICAgICAgICAgIGFiYnIgPSBhYmJyICsgbGFuZ3VhZ2VzW2N1cnJlbnRMYW5ndWFnZV0uYWJicmV2aWF0aW9ucy50aG91c2FuZDtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZSAvIE1hdGgucG93KDEwLCAzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHNlZSBpZiB3ZSBhcmUgZm9ybWF0dGluZyBieXRlc1xuICAgICAgICAgICAgaWYgKGZvcm1hdC5pbmRleE9mKCdiJykgPiAtMSkge1xuICAgICAgICAgICAgICAgIC8vIGNoZWNrIGZvciBzcGFjZSBiZWZvcmVcbiAgICAgICAgICAgICAgICBpZiAoZm9ybWF0LmluZGV4T2YoJyBiJykgPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICBieXRlcyA9ICcgJztcbiAgICAgICAgICAgICAgICAgICAgZm9ybWF0ID0gZm9ybWF0LnJlcGxhY2UoJyBiJywgJycpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGZvcm1hdCA9IGZvcm1hdC5yZXBsYWNlKCdiJywgJycpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGZvciAocG93ZXIgPSAwOyBwb3dlciA8PSBzdWZmaXhlcy5sZW5ndGg7IHBvd2VyKyspIHtcbiAgICAgICAgICAgICAgICAgICAgbWluID0gTWF0aC5wb3coMTAyNCwgcG93ZXIpO1xuICAgICAgICAgICAgICAgICAgICBtYXggPSBNYXRoLnBvdygxMDI0LCBwb3dlcisxKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUgPj0gbWluICYmIHZhbHVlIDwgbWF4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBieXRlcyA9IGJ5dGVzICsgc3VmZml4ZXNbcG93ZXJdO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1pbiA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlIC8gbWluO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHNlZSBpZiBvcmRpbmFsIGlzIHdhbnRlZFxuICAgICAgICAgICAgaWYgKGZvcm1hdC5pbmRleE9mKCdvJykgPiAtMSkge1xuICAgICAgICAgICAgICAgIC8vIGNoZWNrIGZvciBzcGFjZSBiZWZvcmVcbiAgICAgICAgICAgICAgICBpZiAoZm9ybWF0LmluZGV4T2YoJyBvJykgPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICBvcmQgPSAnICc7XG4gICAgICAgICAgICAgICAgICAgIGZvcm1hdCA9IGZvcm1hdC5yZXBsYWNlKCcgbycsICcnKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBmb3JtYXQgPSBmb3JtYXQucmVwbGFjZSgnbycsICcnKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBvcmQgPSBvcmQgKyBsYW5ndWFnZXNbY3VycmVudExhbmd1YWdlXS5vcmRpbmFsKHZhbHVlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGZvcm1hdC5pbmRleE9mKCdbLl0nKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgb3B0RGVjID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBmb3JtYXQgPSBmb3JtYXQucmVwbGFjZSgnWy5dJywgJy4nKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdyA9IHZhbHVlLnRvU3RyaW5nKCkuc3BsaXQoJy4nKVswXTtcbiAgICAgICAgICAgIHByZWNpc2lvbiA9IGZvcm1hdC5zcGxpdCgnLicpWzFdO1xuICAgICAgICAgICAgdGhvdXNhbmRzID0gZm9ybWF0LmluZGV4T2YoJywnKTtcblxuICAgICAgICAgICAgaWYgKHByZWNpc2lvbikge1xuICAgICAgICAgICAgICAgIGlmIChwcmVjaXNpb24uaW5kZXhPZignWycpID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJlY2lzaW9uID0gcHJlY2lzaW9uLnJlcGxhY2UoJ10nLCAnJyk7XG4gICAgICAgICAgICAgICAgICAgIHByZWNpc2lvbiA9IHByZWNpc2lvbi5zcGxpdCgnWycpO1xuICAgICAgICAgICAgICAgICAgICBkID0gdG9GaXhlZCh2YWx1ZSwgKHByZWNpc2lvblswXS5sZW5ndGggKyBwcmVjaXNpb25bMV0ubGVuZ3RoKSwgcm91bmRpbmdGdW5jdGlvbiwgcHJlY2lzaW9uWzFdLmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZCA9IHRvRml4ZWQodmFsdWUsIHByZWNpc2lvbi5sZW5ndGgsIHJvdW5kaW5nRnVuY3Rpb24pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHcgPSBkLnNwbGl0KCcuJylbMF07XG5cbiAgICAgICAgICAgICAgICBpZiAoZC5zcGxpdCgnLicpWzFdLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICBkID0gbGFuZ3VhZ2VzW2N1cnJlbnRMYW5ndWFnZV0uZGVsaW1pdGVycy5kZWNpbWFsICsgZC5zcGxpdCgnLicpWzFdO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGQgPSAnJztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAob3B0RGVjICYmIE51bWJlcihkLnNsaWNlKDEpKSA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBkID0gJyc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB3ID0gdG9GaXhlZCh2YWx1ZSwgbnVsbCwgcm91bmRpbmdGdW5jdGlvbik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGZvcm1hdCBudW1iZXJcbiAgICAgICAgICAgIGlmICh3LmluZGV4T2YoJy0nKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgdyA9IHcuc2xpY2UoMSk7XG4gICAgICAgICAgICAgICAgbmVnID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRob3VzYW5kcyA+IC0xKSB7XG4gICAgICAgICAgICAgICAgdyA9IHcudG9TdHJpbmcoKS5yZXBsYWNlKC8oXFxkKSg/PShcXGR7M30pKyg/IVxcZCkpL2csICckMScgKyBsYW5ndWFnZXNbY3VycmVudExhbmd1YWdlXS5kZWxpbWl0ZXJzLnRob3VzYW5kcyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChmb3JtYXQuaW5kZXhPZignLicpID09PSAwKSB7XG4gICAgICAgICAgICAgICAgdyA9ICcnO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gKChuZWdQICYmIG5lZykgPyAnKCcgOiAnJykgKyAoKCFuZWdQICYmIG5lZykgPyAnLScgOiAnJykgKyAoKCFuZWcgJiYgc2lnbmVkKSA/ICcrJyA6ICcnKSArIHcgKyBkICsgKChvcmQpID8gb3JkIDogJycpICsgKChhYmJyKSA/IGFiYnIgOiAnJykgKyAoKGJ5dGVzKSA/IGJ5dGVzIDogJycpICsgKChuZWdQICYmIG5lZykgPyAnKScgOiAnJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgIFRvcCBMZXZlbCBGdW5jdGlvbnNcbiAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICBudW1lcmFsID0gZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgICAgIGlmIChudW1lcmFsLmlzTnVtZXJhbChpbnB1dCkpIHtcbiAgICAgICAgICAgIGlucHV0ID0gaW5wdXQudmFsdWUoKTtcbiAgICAgICAgfSBlbHNlIGlmIChpbnB1dCA9PT0gMCB8fCB0eXBlb2YgaW5wdXQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBpbnB1dCA9IDA7XG4gICAgICAgIH0gZWxzZSBpZiAoIU51bWJlcihpbnB1dCkpIHtcbiAgICAgICAgICAgIGlucHV0ID0gbnVtZXJhbC5mbi51bmZvcm1hdChpbnB1dCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3IE51bWVyYWwoTnVtYmVyKGlucHV0KSk7XG4gICAgfTtcblxuICAgIC8vIHZlcnNpb24gbnVtYmVyXG4gICAgbnVtZXJhbC52ZXJzaW9uID0gVkVSU0lPTjtcblxuICAgIC8vIGNvbXBhcmUgbnVtZXJhbCBvYmplY3RcbiAgICBudW1lcmFsLmlzTnVtZXJhbCA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgcmV0dXJuIG9iaiBpbnN0YW5jZW9mIE51bWVyYWw7XG4gICAgfTtcblxuICAgIC8vIFRoaXMgZnVuY3Rpb24gd2lsbCBsb2FkIGxhbmd1YWdlcyBhbmQgdGhlbiBzZXQgdGhlIGdsb2JhbCBsYW5ndWFnZS4gIElmXG4gICAgLy8gbm8gYXJndW1lbnRzIGFyZSBwYXNzZWQgaW4sIGl0IHdpbGwgc2ltcGx5IHJldHVybiB0aGUgY3VycmVudCBnbG9iYWxcbiAgICAvLyBsYW5ndWFnZSBrZXkuXG4gICAgbnVtZXJhbC5sYW5ndWFnZSA9IGZ1bmN0aW9uIChrZXksIHZhbHVlcykge1xuICAgICAgICBpZiAoIWtleSkge1xuICAgICAgICAgICAgcmV0dXJuIGN1cnJlbnRMYW5ndWFnZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChrZXkgJiYgIXZhbHVlcykge1xuICAgICAgICAgICAgaWYoIWxhbmd1YWdlc1trZXldKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIGxhbmd1YWdlIDogJyArIGtleSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjdXJyZW50TGFuZ3VhZ2UgPSBrZXk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodmFsdWVzIHx8ICFsYW5ndWFnZXNba2V5XSkge1xuICAgICAgICAgICAgbG9hZExhbmd1YWdlKGtleSwgdmFsdWVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBudW1lcmFsO1xuICAgIH07XG4gICAgXG4gICAgLy8gVGhpcyBmdW5jdGlvbiBwcm92aWRlcyBhY2Nlc3MgdG8gdGhlIGxvYWRlZCBsYW5ndWFnZSBkYXRhLiAgSWZcbiAgICAvLyBubyBhcmd1bWVudHMgYXJlIHBhc3NlZCBpbiwgaXQgd2lsbCBzaW1wbHkgcmV0dXJuIHRoZSBjdXJyZW50XG4gICAgLy8gZ2xvYmFsIGxhbmd1YWdlIG9iamVjdC5cbiAgICBudW1lcmFsLmxhbmd1YWdlRGF0YSA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgaWYgKCFrZXkpIHtcbiAgICAgICAgICAgIHJldHVybiBsYW5ndWFnZXNbY3VycmVudExhbmd1YWdlXTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgaWYgKCFsYW5ndWFnZXNba2V5XSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIGxhbmd1YWdlIDogJyArIGtleSk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHJldHVybiBsYW5ndWFnZXNba2V5XTtcbiAgICB9O1xuXG4gICAgbnVtZXJhbC5sYW5ndWFnZSgnZW4nLCB7XG4gICAgICAgIGRlbGltaXRlcnM6IHtcbiAgICAgICAgICAgIHRob3VzYW5kczogJywnLFxuICAgICAgICAgICAgZGVjaW1hbDogJy4nXG4gICAgICAgIH0sXG4gICAgICAgIGFiYnJldmlhdGlvbnM6IHtcbiAgICAgICAgICAgIHRob3VzYW5kOiAnaycsXG4gICAgICAgICAgICBtaWxsaW9uOiAnbScsXG4gICAgICAgICAgICBiaWxsaW9uOiAnYicsXG4gICAgICAgICAgICB0cmlsbGlvbjogJ3QnXG4gICAgICAgIH0sXG4gICAgICAgIG9yZGluYWw6IGZ1bmN0aW9uIChudW1iZXIpIHtcbiAgICAgICAgICAgIHZhciBiID0gbnVtYmVyICUgMTA7XG4gICAgICAgICAgICByZXR1cm4gKH5+IChudW1iZXIgJSAxMDAgLyAxMCkgPT09IDEpID8gJ3RoJyA6XG4gICAgICAgICAgICAgICAgKGIgPT09IDEpID8gJ3N0JyA6XG4gICAgICAgICAgICAgICAgKGIgPT09IDIpID8gJ25kJyA6XG4gICAgICAgICAgICAgICAgKGIgPT09IDMpID8gJ3JkJyA6ICd0aCc7XG4gICAgICAgIH0sXG4gICAgICAgIGN1cnJlbmN5OiB7XG4gICAgICAgICAgICBzeW1ib2w6ICckJ1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBudW1lcmFsLnplcm9Gb3JtYXQgPSBmdW5jdGlvbiAoZm9ybWF0KSB7XG4gICAgICAgIHplcm9Gb3JtYXQgPSB0eXBlb2YoZm9ybWF0KSA9PT0gJ3N0cmluZycgPyBmb3JtYXQgOiBudWxsO1xuICAgIH07XG5cbiAgICBudW1lcmFsLmRlZmF1bHRGb3JtYXQgPSBmdW5jdGlvbiAoZm9ybWF0KSB7XG4gICAgICAgIGRlZmF1bHRGb3JtYXQgPSB0eXBlb2YoZm9ybWF0KSA9PT0gJ3N0cmluZycgPyBmb3JtYXQgOiAnMC4wJztcbiAgICB9O1xuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICBIZWxwZXJzXG4gICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgZnVuY3Rpb24gbG9hZExhbmd1YWdlKGtleSwgdmFsdWVzKSB7XG4gICAgICAgIGxhbmd1YWdlc1trZXldID0gdmFsdWVzO1xuICAgIH1cblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgRmxvYXRpbmctcG9pbnQgaGVscGVyc1xuICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgIC8vIFRoZSBmbG9hdGluZy1wb2ludCBoZWxwZXIgZnVuY3Rpb25zIGFuZCBpbXBsZW1lbnRhdGlvblxuICAgIC8vIGJvcnJvd3MgaGVhdmlseSBmcm9tIHNpbmZ1bC5qczogaHR0cDovL2d1aXBuLmdpdGh1Yi5pby9zaW5mdWwuanMvXG5cbiAgICAvKipcbiAgICAgKiBBcnJheS5wcm90b3R5cGUucmVkdWNlIGZvciBicm93c2VycyB0aGF0IGRvbid0IHN1cHBvcnQgaXRcbiAgICAgKiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9BcnJheS9SZWR1Y2UjQ29tcGF0aWJpbGl0eVxuICAgICAqL1xuICAgIGlmICgnZnVuY3Rpb24nICE9PSB0eXBlb2YgQXJyYXkucHJvdG90eXBlLnJlZHVjZSkge1xuICAgICAgICBBcnJheS5wcm90b3R5cGUucmVkdWNlID0gZnVuY3Rpb24gKGNhbGxiYWNrLCBvcHRfaW5pdGlhbFZhbHVlKSB7XG4gICAgICAgICAgICAndXNlIHN0cmljdCc7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChudWxsID09PSB0aGlzIHx8ICd1bmRlZmluZWQnID09PSB0eXBlb2YgdGhpcykge1xuICAgICAgICAgICAgICAgIC8vIEF0IHRoZSBtb21lbnQgYWxsIG1vZGVybiBicm93c2VycywgdGhhdCBzdXBwb3J0IHN0cmljdCBtb2RlLCBoYXZlXG4gICAgICAgICAgICAgICAgLy8gbmF0aXZlIGltcGxlbWVudGF0aW9uIG9mIEFycmF5LnByb3RvdHlwZS5yZWR1Y2UuIEZvciBpbnN0YW5jZSwgSUU4XG4gICAgICAgICAgICAgICAgLy8gZG9lcyBub3Qgc3VwcG9ydCBzdHJpY3QgbW9kZSwgc28gdGhpcyBjaGVjayBpcyBhY3R1YWxseSB1c2VsZXNzLlxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FycmF5LnByb3RvdHlwZS5yZWR1Y2UgY2FsbGVkIG9uIG51bGwgb3IgdW5kZWZpbmVkJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmICgnZnVuY3Rpb24nICE9PSB0eXBlb2YgY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGNhbGxiYWNrICsgJyBpcyBub3QgYSBmdW5jdGlvbicpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgaW5kZXgsXG4gICAgICAgICAgICAgICAgdmFsdWUsXG4gICAgICAgICAgICAgICAgbGVuZ3RoID0gdGhpcy5sZW5ndGggPj4+IDAsXG4gICAgICAgICAgICAgICAgaXNWYWx1ZVNldCA9IGZhbHNlO1xuXG4gICAgICAgICAgICBpZiAoMSA8IGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IG9wdF9pbml0aWFsVmFsdWU7XG4gICAgICAgICAgICAgICAgaXNWYWx1ZVNldCA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvciAoaW5kZXggPSAwOyBsZW5ndGggPiBpbmRleDsgKytpbmRleCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmhhc093blByb3BlcnR5KGluZGV4KSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXNWYWx1ZVNldCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBjYWxsYmFjayh2YWx1ZSwgdGhpc1tpbmRleF0sIGluZGV4LCB0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdGhpc1tpbmRleF07XG4gICAgICAgICAgICAgICAgICAgICAgICBpc1ZhbHVlU2V0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFpc1ZhbHVlU2V0KSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignUmVkdWNlIG9mIGVtcHR5IGFycmF5IHdpdGggbm8gaW5pdGlhbCB2YWx1ZScpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgXG4gICAgLyoqXG4gICAgICogQ29tcHV0ZXMgdGhlIG11bHRpcGxpZXIgbmVjZXNzYXJ5IHRvIG1ha2UgeCA+PSAxLFxuICAgICAqIGVmZmVjdGl2ZWx5IGVsaW1pbmF0aW5nIG1pc2NhbGN1bGF0aW9ucyBjYXVzZWQgYnlcbiAgICAgKiBmaW5pdGUgcHJlY2lzaW9uLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIG11bHRpcGxpZXIoeCkge1xuICAgICAgICB2YXIgcGFydHMgPSB4LnRvU3RyaW5nKCkuc3BsaXQoJy4nKTtcbiAgICAgICAgaWYgKHBhcnRzLmxlbmd0aCA8IDIpIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBNYXRoLnBvdygxMCwgcGFydHNbMV0ubGVuZ3RoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHaXZlbiBhIHZhcmlhYmxlIG51bWJlciBvZiBhcmd1bWVudHMsIHJldHVybnMgdGhlIG1heGltdW1cbiAgICAgKiBtdWx0aXBsaWVyIHRoYXQgbXVzdCBiZSB1c2VkIHRvIG5vcm1hbGl6ZSBhbiBvcGVyYXRpb24gaW52b2x2aW5nXG4gICAgICogYWxsIG9mIHRoZW0uXG4gICAgICovXG4gICAgZnVuY3Rpb24gY29ycmVjdGlvbkZhY3RvcigpIHtcbiAgICAgICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgICAgICByZXR1cm4gYXJncy5yZWR1Y2UoZnVuY3Rpb24gKHByZXYsIG5leHQpIHtcbiAgICAgICAgICAgIHZhciBtcCA9IG11bHRpcGxpZXIocHJldiksXG4gICAgICAgICAgICAgICAgbW4gPSBtdWx0aXBsaWVyKG5leHQpO1xuICAgICAgICByZXR1cm4gbXAgPiBtbiA/IG1wIDogbW47XG4gICAgICAgIH0sIC1JbmZpbml0eSk7XG4gICAgfSAgICAgICAgXG5cblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgTnVtZXJhbCBQcm90b3R5cGVcbiAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cblxuICAgIG51bWVyYWwuZm4gPSBOdW1lcmFsLnByb3RvdHlwZSA9IHtcblxuICAgICAgICBjbG9uZSA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBudW1lcmFsKHRoaXMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGZvcm1hdCA6IGZ1bmN0aW9uIChpbnB1dFN0cmluZywgcm91bmRpbmdGdW5jdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuIGZvcm1hdE51bWVyYWwodGhpcywgXG4gICAgICAgICAgICAgICAgICBpbnB1dFN0cmluZyA/IGlucHV0U3RyaW5nIDogZGVmYXVsdEZvcm1hdCwgXG4gICAgICAgICAgICAgICAgICAocm91bmRpbmdGdW5jdGlvbiAhPT0gdW5kZWZpbmVkKSA/IHJvdW5kaW5nRnVuY3Rpb24gOiBNYXRoLnJvdW5kXG4gICAgICAgICAgICAgICk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgdW5mb3JtYXQgOiBmdW5jdGlvbiAoaW5wdXRTdHJpbmcpIHtcbiAgICAgICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoaW5wdXRTdHJpbmcpID09PSAnW29iamVjdCBOdW1iZXJdJykgeyBcbiAgICAgICAgICAgICAgICByZXR1cm4gaW5wdXRTdHJpbmc7IFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHVuZm9ybWF0TnVtZXJhbCh0aGlzLCBpbnB1dFN0cmluZyA/IGlucHV0U3RyaW5nIDogZGVmYXVsdEZvcm1hdCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgdmFsdWUgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdmFsdWU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgdmFsdWVPZiA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl92YWx1ZTtcbiAgICAgICAgfSxcblxuICAgICAgICBzZXQgOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuX3ZhbHVlID0gTnVtYmVyKHZhbHVlKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9LFxuXG4gICAgICAgIGFkZCA6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgdmFyIGNvcnJGYWN0b3IgPSBjb3JyZWN0aW9uRmFjdG9yLmNhbGwobnVsbCwgdGhpcy5fdmFsdWUsIHZhbHVlKTtcbiAgICAgICAgICAgIGZ1bmN0aW9uIGNiYWNrKGFjY3VtLCBjdXJyLCBjdXJySSwgTykge1xuICAgICAgICAgICAgICAgIHJldHVybiBhY2N1bSArIGNvcnJGYWN0b3IgKiBjdXJyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fdmFsdWUgPSBbdGhpcy5fdmFsdWUsIHZhbHVlXS5yZWR1Y2UoY2JhY2ssIDApIC8gY29yckZhY3RvcjtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9LFxuXG4gICAgICAgIHN1YnRyYWN0IDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICB2YXIgY29yckZhY3RvciA9IGNvcnJlY3Rpb25GYWN0b3IuY2FsbChudWxsLCB0aGlzLl92YWx1ZSwgdmFsdWUpO1xuICAgICAgICAgICAgZnVuY3Rpb24gY2JhY2soYWNjdW0sIGN1cnIsIGN1cnJJLCBPKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFjY3VtIC0gY29yckZhY3RvciAqIGN1cnI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl92YWx1ZSA9IFt2YWx1ZV0ucmVkdWNlKGNiYWNrLCB0aGlzLl92YWx1ZSAqIGNvcnJGYWN0b3IpIC8gY29yckZhY3RvcjsgICAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9LFxuXG4gICAgICAgIG11bHRpcGx5IDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICBmdW5jdGlvbiBjYmFjayhhY2N1bSwgY3VyciwgY3VyckksIE8pIHtcbiAgICAgICAgICAgICAgICB2YXIgY29yckZhY3RvciA9IGNvcnJlY3Rpb25GYWN0b3IoYWNjdW0sIGN1cnIpO1xuICAgICAgICAgICAgICAgIHJldHVybiAoYWNjdW0gKiBjb3JyRmFjdG9yKSAqIChjdXJyICogY29yckZhY3RvcikgL1xuICAgICAgICAgICAgICAgICAgICAoY29yckZhY3RvciAqIGNvcnJGYWN0b3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fdmFsdWUgPSBbdGhpcy5fdmFsdWUsIHZhbHVlXS5yZWR1Y2UoY2JhY2ssIDEpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZGl2aWRlIDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICBmdW5jdGlvbiBjYmFjayhhY2N1bSwgY3VyciwgY3VyckksIE8pIHtcbiAgICAgICAgICAgICAgICB2YXIgY29yckZhY3RvciA9IGNvcnJlY3Rpb25GYWN0b3IoYWNjdW0sIGN1cnIpO1xuICAgICAgICAgICAgICAgIHJldHVybiAoYWNjdW0gKiBjb3JyRmFjdG9yKSAvIChjdXJyICogY29yckZhY3Rvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl92YWx1ZSA9IFt0aGlzLl92YWx1ZSwgdmFsdWVdLnJlZHVjZShjYmFjayk7ICAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcblxuICAgICAgICBkaWZmZXJlbmNlIDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gTWF0aC5hYnMobnVtZXJhbCh0aGlzLl92YWx1ZSkuc3VidHJhY3QodmFsdWUpLnZhbHVlKCkpO1xuICAgICAgICB9XG5cbiAgICB9O1xuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICBFeHBvc2luZyBOdW1lcmFsXG4gICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgLy8gQ29tbW9uSlMgbW9kdWxlIGlzIGRlZmluZWRcbiAgICBpZiAoaGFzTW9kdWxlKSB7XG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gbnVtZXJhbDtcbiAgICB9XG5cbiAgICAvKmdsb2JhbCBlbmRlcjpmYWxzZSAqL1xuICAgIGlmICh0eXBlb2YgZW5kZXIgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIC8vIGhlcmUsIGB0aGlzYCBtZWFucyBgd2luZG93YCBpbiB0aGUgYnJvd3Nlciwgb3IgYGdsb2JhbGAgb24gdGhlIHNlcnZlclxuICAgICAgICAvLyBhZGQgYG51bWVyYWxgIGFzIGEgZ2xvYmFsIG9iamVjdCB2aWEgYSBzdHJpbmcgaWRlbnRpZmllcixcbiAgICAgICAgLy8gZm9yIENsb3N1cmUgQ29tcGlsZXIgJ2FkdmFuY2VkJyBtb2RlXG4gICAgICAgIHRoaXNbJ251bWVyYWwnXSA9IG51bWVyYWw7XG4gICAgfVxuXG4gICAgLypnbG9iYWwgZGVmaW5lOmZhbHNlICovXG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgICBkZWZpbmUoW10sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBudW1lcmFsO1xuICAgICAgICB9KTtcbiAgICB9XG59KS5jYWxsKHRoaXMpO1xuIiwiaW1wb3J0IFRpbWVyIGZyb20gJ3VpL3RpbWVyJztcblxubGV0IF9saXN0ZW5lcnMgPSBTeW1ib2woKTtcblxuY2xhc3MgU291cmNlIHtcblx0Y29uc3RydWN0b3IoY2FsbGJhY2spIHtcblx0XHQvLyBUT0RPLCByZXBsYWNlIHdpdGggTWFwIG9yIFdlYWtNYXA/XG5cdFx0dGhpc1tfbGlzdGVuZXJzXSA9IFtdO1xuXHRcdGxldCBzaW5rID0gKHZhbHVlKSA9PiB7XG5cdFx0XHRUaW1lci5pbW1lZGlhdGUoKCkgPT4ge1xuXHRcdFx0XHR0aGlzW19saXN0ZW5lcnNdLm1hcCjGkiA9PiDGkih2YWx1ZSkpO1xuXHRcdFx0fSk7XG5cdFx0fTtcblx0XHRjYWxsYmFjayhzaW5rKTtcblx0fVxuXHRjYW5jZWwoKSB7XG5cdFx0dGhpc1tfbGlzdGVuZXJzXSA9IFtdO1xuXHR9XG5cdHN1YnNjcmliZSjGkikge1xuXHRcdHRoaXNbX2xpc3RlbmVyc10ucHVzaCjGkik7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblx0dW5zdWJzY3JpYmUoxpIpIHtcblx0XHR0aGlzW19saXN0ZW5lcnNdLnNwbGljZSh0aGlzW19saXN0ZW5lcnNdLmluZGV4T2YoxpIpLCAxKTtcblx0fVxuXHRtYXAoxpIpIHtcblx0XHRyZXR1cm4gU3RyZWFtLm1hcCh0aGlzLCDGkik7XG5cdH1cblx0ZmlsdGVyKMaSKSB7XG5cdFx0cmV0dXJuIFN0cmVhbS5maWx0ZXIodGhpcywgxpIpO1xuXHR9XG5cdHVuaXF1ZSgpIHtcblx0XHRyZXR1cm4gU3RyZWFtLnVuaXF1ZSh0aGlzKTtcblx0fVxuXHRsb2cocHJlZml4KSB7XG5cdFx0cmV0dXJuIFN0cmVhbS5sb2codGhpcywgcHJlZml4KTtcblx0fVxuXHR0b0Jvb2woKSB7XG5cdFx0cmV0dXJuIFN0cmVhbS50b0Jvb2wodGhpcyk7XG5cdH1cblx0bmVnYXRlKCkge1xuXHRcdHJldHVybiBTdHJlYW0ubmVnYXRlKHRoaXMpO1xuXHR9XG5cdHppcCguLi5vdGhlcnMpIHtcblx0XHRyZXR1cm4gU3RyZWFtLnppcCh0aGlzLCAuLi5vdGhlcnMpO1xuXHR9XG5cdHNwcmVhZCjGkikge1xuXHRcdHJldHVybiBTdHJlYW0uc3ByZWFkKHRoaXMsIMaSKTtcblx0fVxuXHRmbGF0TWFwKCkge1xuXHRcdHJldHVybiBTdHJlYW0uZmxhdE1hcCh0aGlzKTtcblx0fVxuXHRtZXJnZSguLi5vdGhlcnMpIHtcblx0XHRyZXR1cm4gU3RyZWFtLm1lcmdlKHRoaXMsIC4uLm90aGVycyk7XG5cdH1cblx0cmVkdWNlKGFjYywgxpIpIHtcblx0XHRyZXR1cm4gU3RyZWFtLnJlZHVjZSh0aGlzLCBhY2MsIMaSKTtcblx0fVxuXHRmZWVkKGRlc3RWYWx1ZSkge1xuXHRcdHJldHVybiBTdHJlYW0uZmVlZCh0aGlzLCBkZXN0VmFsdWUpO1xuXHR9XG59XG5cbmNsYXNzIFB1c2hTb3VyY2UgZXh0ZW5kcyBTb3VyY2Uge1xuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRzdXBlcigoc2luaykgPT4gdGhpcy5wdXNoID0gc2luayk7XG5cdH1cbn1cblxuY2xhc3MgQ2FuY2VsYWJsZVNvdXJjZSBleHRlbmRzIFB1c2hTb3VyY2Uge1xuXHRjb25zdHJ1Y3RvcihjYW5jZWzGkikge1xuXHRcdHN1cGVyKCk7XG5cdFx0dGhpcy5jYW5jZWwgPSBjYW5jZWzGki5iaW5kKHRoaXMpO1xuXHR9XG5cdGNhbmNlbE9uKHNvdXJjZSkge1xuXHRcdHNvdXJjZS5zdWJzY3JpYmUodGhpcy5jYW5jZWwpO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG59XG5cbi8vIHNob3VsZCBJIHByb3BhZ2F0ZSB0aGUgY2FuY2VsIG1ldGhvZD9cbmxldCBTdHJlYW0gPSB7XG5cdG1hcChzb3VyY2UsIMaSKSB7XG5cdFx0bGV0IHN0cmVhbSA9IG5ldyBQdXNoU291cmNlKCk7XG5cdFx0c291cmNlLnN1YnNjcmliZSgodmFsdWUpID0+IHtcblx0XHRcdHN0cmVhbS5wdXNoKMaSKHZhbHVlKSk7XG5cdFx0fSk7XG5cdFx0cmV0dXJuIHN0cmVhbTtcblx0fSxcblx0ZmlsdGVyKHNvdXJjZSwgxpIpIHtcblx0XHRsZXQgc3RyZWFtID0gbmV3IFB1c2hTb3VyY2UoKTtcblx0XHRzb3VyY2Uuc3Vic2NyaWJlKCh2YWx1ZSkgPT4ge1xuXHRcdFx0aWYoxpIodmFsdWUpKVxuXHRcdFx0XHRzdHJlYW0ucHVzaCh2YWx1ZSk7XG5cdFx0fSk7XG5cdFx0cmV0dXJuIHN0cmVhbTtcblx0fSxcblx0dW5pcXVlKHNvdXJjZSkge1xuXHRcdHJldHVybiB0aGlzLmZpbHRlcihzb3VyY2UsIChmdW5jdGlvbigpIHtcblx0XHRcdHZhciBsYXN0O1xuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uKHYpIHtcblx0XHRcdFx0aWYobGFzdCAhPT0gdikge1xuXHRcdFx0XHRcdGxhc3QgPSB2O1xuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHR9KSgpKTtcblx0fSxcblx0dG9Cb29sKHNvdXJjZSkge1xuXHRcdHJldHVybiB0aGlzLm1hcChzb3VyY2UsICh2KSA9PiAhIXYpO1xuXHR9LFxuXHRuZWdhdGUoc291cmNlKSB7XG5cdFx0cmV0dXJuIHRoaXMubWFwKHNvdXJjZSwgKHYpID0+ICF2KTtcblx0fSxcblx0bG9nKHNvdXJjZSwgcHJlZml4KSB7XG5cdFx0cmV0dXJuIHRoaXMubWFwKHNvdXJjZSwgKHYpID0+IHtcblx0XHRcdGlmKHByZWZpeClcblx0XHRcdFx0Y29uc29sZS5sb2cocHJlZml4LCB2KTtcblx0XHRcdGVsc2Vcblx0XHRcdFx0Y29uc29sZS5sb2codik7XG5cdFx0XHRyZXR1cm4gdjtcblx0XHR9KTtcblx0fSxcblx0emlwKC4uLnNvdXJjZXMpIHtcblx0XHRsZXQgbGVuZ3RoID0gc291cmNlcy5sZW5ndGgsXG5cdFx0XHRzdHJlYW0gPSBuZXcgUHVzaFNvdXJjZSgpLFxuXHRcdFx0dmFsdWVzID0gbmV3IEFycmF5KGxlbmd0aCksXG5cdFx0XHRmbGFncyAgPSBuZXcgQXJyYXkobGVuZ3RoKSxcblx0XHRcdHVwZGF0ZSA9ICgpID0+IHtcblx0XHRcdFx0aWYoZmxhZ3MuZmlsdGVyKCh2KSA9PiB2KS5sZW5ndGggPT09IGxlbmd0aCkge1xuXHRcdFx0XHRcdHVwZGF0ZSA9ICgpID0+IHN0cmVhbS5wdXNoKHZhbHVlcyk7XG5cdFx0XHRcdFx0dXBkYXRlKCk7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcblx0XHRcdCgoaSkgPT4ge1xuXHRcdFx0XHRzb3VyY2VzW2ldLnN1YnNjcmliZSgodikgPT4ge1xuXHRcdFx0XHRcdHZhbHVlc1tpXSA9IHY7XG5cdFx0XHRcdFx0ZmxhZ3NbaV0gPSB0cnVlO1xuXHRcdFx0XHRcdHVwZGF0ZSgpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0pKGkpO1xuXHRcdH1cblx0XHRyZXR1cm4gc3RyZWFtO1xuXHR9LFxuXHRzcHJlYWQoc291cmNlLCDGkikge1xuXHRcdGxldCBzdHJlYW0gPSBuZXcgUHVzaFNvdXJjZSgpO1xuXHRcdHNvdXJjZS5zdWJzY3JpYmUoKGFycikgPT4ge1xuXHRcdFx0c3RyZWFtLnB1c2goxpIuYXBwbHkodGhpcywgYXJyKSk7XG5cdFx0fSk7XG5cdFx0cmV0dXJuIHN0cmVhbTtcblx0fSxcblx0ZmxhdE1hcChzb3VyY2UpIHtcblx0XHRsZXQgc3RyZWFtID0gbmV3IFB1c2hTb3VyY2UoKTtcblx0XHRzb3VyY2Uuc3Vic2NyaWJlKChhcnIpID0+IHtcblx0XHRcdGZvcihsZXQgdiBpbiBhcnIpXG5cdFx0XHRcdHN0cmVhbS5wdXNoKHYpO1xuXHRcdH0pO1xuXHRcdHJldHVybiBzdHJlYW07XG5cdH0sXG5cdG1lcmdlKC4uLnNvdXJjZXMpIHtcblx0XHRsZXQgc3RyZWFtID0gbmV3IFB1c2hTb3VyY2UoKTtcblx0XHRmb3IobGV0IHNvdXJjZSBvZiBzb3VyY2VzKSB7XG5cdFx0XHRzb3VyY2Uuc3Vic2NyaWJlKCh2KSA9PiB7XG5cdFx0XHRcdHN0cmVhbS5wdXNoKHYpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdHJldHVybiBzdHJlYW07XG5cdH0sXG5cdGludGVydmFsKG1zLCB2YWx1ZSkge1xuXHRcdGxldCBpZCxcblx0XHRcdHN0cmVhbSA9IG5ldyBDYW5jZWxhYmxlU291cmNlKGZ1bmN0aW9uKCkgeyBjbGVhckludGVydmFsKGlkKTsgfSk7XG5cdFx0aWQgPSBzZXRJbnRlcnZhbCgoKSA9PiBzdHJlYW0ucHVzaCh2YWx1ZSksIG1zKTtcblx0XHRyZXR1cm4gc3RyZWFtO1xuXHR9LFxuXHRkZWxheShtcywgdmFsdWUpIHtcblx0XHRsZXQgaWQsXG5cdFx0XHRzdHJlYW0gPSBuZXcgQ2FuY2VsYWJsZVNvdXJjZShmdW5jdGlvbigpIHsgY2xlYXJUaW1lb3V0KGlkKTsgfSk7XG5cdFx0aWQgPSBzZXRUaW1lb3V0KCgpID0+IHN0cmVhbS5wdXNoKHZhbHVlKSwgbXMpO1xuXHRcdHJldHVybiBzdHJlYW07XG5cdH0sXG5cdHJlZHVjZShzb3VyY2UsIGFjYywgxpIpIHtcblx0XHRsZXQgc3RyZWFtID0gbmV3IFB1c2hTb3VyY2UoKTtcblx0XHRzb3VyY2Uuc3Vic2NyaWJlKCh2YWx1ZSkgPT4gc3RyZWFtLnB1c2goYWNjID0gxpIoYWNjLCB2YWx1ZSkpKTtcblx0XHRyZXR1cm4gc3RyZWFtO1xuXHR9LFxuXHRmZWVkKHNvdXJjZSwgZGVzdCkge1xuXHRcdGxldCDGkiA9ICh2KSA9PiBkZXN0LnB1c2godik7XG5cdFx0c291cmNlLnN1YnNjcmliZSjGkik7XG5cdFx0cmV0dXJuICgpID0+IHNvdXJjZS51bnN1YnNjcmliZSjGkik7XG5cdH0sXG5cdGZyb21BcnJheSh2YWx1ZXMpIHtcblx0XHRsZXQgc3RyZWFtID0gbmV3IFB1c2hTb3VyY2UoKTtcblx0XHR2YWx1ZXMubWFwKCh2KSA9PiBzdHJlYW0ucHVzaCh2KSk7XG5cdFx0cmV0dXJuIHN0cmVhbTtcblx0fSxcblx0c2VxdWVuY2UoaW50ZXJ2YWwsIHZhbHVlcywgcmVwZWF0ID0gZmFsc2UpIHtcblx0XHRsZXQgaWQsXG5cdFx0XHRzdHJlYW0gPSBuZXcgQ2FuY2VsYWJsZVNvdXJjZShmdW5jdGlvbigpIHsgY2xlYXJJbnRlcnZhbChpZCk7IH0pLFxuXHRcdFx0aW5kZXggPSAwO1xuXG5cdFx0aWQgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG5cdFx0XHRpZihpbmRleCA9PT0gdmFsdWVzLmxlbmd0aCkge1xuXHRcdFx0XHRpZihyZXBlYXQpIHtcblx0XHRcdFx0XHRpbmRleCA9IDA7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Y2xlYXJJbnRlcnZhbChpZCk7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRzdHJlYW0ucHVzaCh2YWx1ZXNbaW5kZXgrK10pO1xuXHRcdH0sIGludGVydmFsKTtcblx0XHRyZXR1cm4gc3RyZWFtO1xuXHR9XG5cdC8vIFRPRE9cblx0Ly8gdW50aWwoxpIpXG5cdC8vIHRha2Uobilcblx0Ly8gc2tpcChuKVxuXHQvLyB0aHJvdHRsZVxuXHQvLyBmaWVsZChuYW1lKVxuXHQvLyBtZXRob2QobmFtZSwgLi4uYXJncylcbn1cblxuZXhwb3J0IHsgU3RyZWFtLCBTb3VyY2UsIFB1c2hTb3VyY2UgfTsiLCJpbXBvcnQgeyBTb3VyY2UsIFN0cmVhbSB9IGZyb20gJy4vc3RyZWFtJ1xuXG52YXIgX3ZhbHVlID0gU3ltYm9sKCksXG5cdF9kZWZhdWx0VmFsdWUgPSBTeW1ib2woKSxcblx0X3VwZGF0ZSA9IFN5bWJvbCgpO1xuXG5leHBvcnQgY2xhc3MgVmFsdWUgZXh0ZW5kcyBTb3VyY2Uge1xuXHRjb25zdHJ1Y3Rvcih2YWx1ZSwgZGVmYXVsdFZhbHVlKSB7XG5cdFx0bGV0IGNhbGxiYWNrID0gKHNpbmspID0+IHtcblx0XHRcdHRoaXNbX3VwZGF0ZV0gPSBzaW5rO1xuXHRcdH07XG5cdFx0c3VwZXIoY2FsbGJhY2spO1xuXHRcdHRoaXNbX2RlZmF1bHRWYWx1ZV0gPSBkZWZhdWx0VmFsdWU7XG5cdFx0dGhpc1tfdmFsdWVdID0gdmFsdWU7XG5cdH1cblx0c3Vic2NyaWJlKMaSKSB7XG5cdFx0xpIodGhpc1tfdmFsdWVdKTtcblx0XHRzdXBlci5zdWJzY3JpYmUoxpIpO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cdHB1c2godmFsdWUpIHtcblx0XHRpZih2YWx1ZSA9PT0gdGhpc1tfdmFsdWVdKVxuXHRcdFx0cmV0dXJuO1xuXHRcdHRoaXNbX3ZhbHVlXSA9IHZhbHVlO1xuXHRcdHRoaXNbX3VwZGF0ZV0odmFsdWUpO1xuXHR9XG5cdGdldCB2YWx1ZSgpIHtcblx0XHRyZXR1cm4gdGhpc1tfdmFsdWVdO1xuXHR9XG5cdHNldCB2YWx1ZSh2KSB7XG5cdFx0dGhpcy5wdXNoKHYpO1xuXHR9XG5cdGdldCBpc0RlZmF1bHQoKSB7XG5cdFx0cmV0dXJuIHRoaXNbX3ZhbHVlXSA9PT0gdGhpc1tfZGVmYXVsdFZhbHVlXTtcblx0fVxuXHRyZXNldCgpIHtcblx0XHR0aGlzLnZhbHVlID0gdGhpc1tfZGVmYXVsdFZhbHVlXTtcblx0fVxufVxuXG5leHBvcnQgY2xhc3MgU3RyaW5nVmFsdWUgZXh0ZW5kcyBWYWx1ZSB7XG5cdGNvbnN0cnVjdG9yKHZhbHVlID0gXCJcIiwgZGVmYXVsdFZhbHVlID0gdmFsdWUpIHtcblx0XHRzdXBlcih2YWx1ZSwgZGVmYXVsdFZhbHVlKTtcblx0fVxuXHRwdXNoKHZhbHVlKSB7XG5cdFx0c3VwZXIucHVzaCgodmFsdWUgJiYgdmFsdWUudG9TdHJpbmcgJiYgdmFsdWUudG9TdHJpbmcoKSkgfHwgKHZhbHVlICYmIChcIlwiICsgdmFsdWUpKSB8fCBcIlwiKTtcblx0fVxufVxuXG5leHBvcnQgY2xhc3MgQm9vbFZhbHVlIGV4dGVuZHMgVmFsdWUge1xuXHRjb25zdHJ1Y3Rvcih2YWx1ZSA9IGZhbHNlLCBkZWZhdWx0VmFsdWUgPSB2YWx1ZSkge1xuXHRcdHN1cGVyKHZhbHVlLCBkZWZhdWx0VmFsdWUpO1xuXHR9XG5cdHB1c2godmFsdWUpIHtcblx0XHRzdXBlci5wdXNoKCEhdmFsdWUpO1xuXHR9XG5cdHRvZ2dsZSgpIHtcblx0XHR0aGlzLnB1c2goIXRoaXMudmFsdWUpO1xuXHR9XG59XG5cbmV4cG9ydCBjbGFzcyBGbG9hdFZhbHVlIGV4dGVuZHMgVmFsdWUge1xuXHRjb25zdHJ1Y3Rvcih2YWx1ZSA9IDAuMCwgZGVmYXVsdFZhbHVlID0gdmFsdWUpIHtcblx0XHRzdXBlcih2YWx1ZSwgZGVmYXVsdFZhbHVlKTtcblx0fVxuXHRwdXNoKHZhbHVlKSB7XG5cdFx0c3VwZXIucHVzaCgrbmV3IE51bWJlcih2YWx1ZSkpO1xuXHR9XG59XG5cbnZhciBkZWZhdWx0RGF0ZSA9IG5ldyBEYXRlKG51bGwpO1xuZXhwb3J0IGNsYXNzIERhdGVWYWx1ZSBleHRlbmRzIFZhbHVlIHtcblx0Y29uc3RydWN0b3IodmFsdWUgPSBkZWZhdWx0RGF0ZSwgZGVmYXVsdFZhbHVlID0gdmFsdWUpIHtcblx0XHRzdXBlcih2YWx1ZSwgZGVmYXVsdFZhbHVlKTtcblx0fVxuXHRwdXNoKHZhbHVlKSB7XG5cdFx0c3VwZXIucHVzaChuZXcgRGF0ZSh2YWx1ZSkpO1xuXHR9XG59IiwiLypcbnN0cmluZy5qcyAtIENvcHlyaWdodCAoQykgMjAxMi0yMDEzLCBKUCBSaWNoYXJkc29uIDxqcHJpY2hhcmRzb25AZ21haWwuY29tPlxuKi9cblxuIShmdW5jdGlvbigpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgdmFyIFZFUlNJT04gPSAnMS44LjAnO1xuXG4gIHZhciBFTlRJVElFUyA9IHt9O1xuXG4vLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLy8gQWRkZWQgYW4gaW5pdGlhbGl6ZSBmdW5jdGlvbiB3aGljaCBpcyBlc3NlbnRpYWxseSB0aGUgY29kZSBmcm9tIHRoZSBTXG4vLyBjb25zdHJ1Y3Rvci4gIE5vdywgdGhlIFMgY29uc3RydWN0b3IgY2FsbHMgdGhpcyBhbmQgYSBuZXcgbWV0aG9kIG5hbWVkXG4vLyBzZXRWYWx1ZSBjYWxscyBpdCBhcyB3ZWxsLiAgVGhlIHNldFZhbHVlIGZ1bmN0aW9uIGFsbG93cyBjb25zdHJ1Y3RvcnMgZm9yXG4vLyBtb2R1bGVzIHRoYXQgZXh0ZW5kIHN0cmluZy5qcyB0byBzZXQgdGhlIGluaXRpYWwgdmFsdWUgb2YgYW4gb2JqZWN0IHdpdGhvdXRcbi8vIGtub3dpbmcgdGhlIGludGVybmFsIHdvcmtpbmdzIG9mIHN0cmluZy5qcy5cbi8vXG4vLyBBbHNvLCBhbGwgbWV0aG9kcyB3aGljaCByZXR1cm4gYSBuZXcgUyBvYmplY3Qgbm93IGNhbGw6XG4vL1xuLy8gICAgICByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3Iocyk7XG4vL1xuLy8gaW5zdGVhZCBvZjpcbi8vXG4vLyAgICAgIHJldHVybiBuZXcgUyhzKTtcbi8vXG4vLyBUaGlzIGFsbG93cyBleHRlbmRlZCBvYmplY3RzIHRvIGtlZXAgdGhlaXIgcHJvcGVyIGluc3RhbmNlT2YgYW5kIGNvbnN0cnVjdG9yLlxuLy8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcblxuICBmdW5jdGlvbiBpbml0aWFsaXplIChvYmplY3QsIHMpIHtcbiAgICBpZiAocyAhPT0gbnVsbCAmJiBzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGlmICh0eXBlb2YgcyA9PT0gJ3N0cmluZycpXG4gICAgICAgIG9iamVjdC5zID0gcztcbiAgICAgIGVsc2VcbiAgICAgICAgb2JqZWN0LnMgPSBzLnRvU3RyaW5nKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG9iamVjdC5zID0gczsgLy9udWxsIG9yIHVuZGVmaW5lZFxuICAgIH1cblxuICAgIG9iamVjdC5vcmlnID0gczsgLy9vcmlnaW5hbCBvYmplY3QsIGN1cnJlbnRseSBvbmx5IHVzZWQgYnkgdG9DU1YoKSBhbmQgdG9Cb29sZWFuKClcblxuICAgIGlmIChzICE9PSBudWxsICYmIHMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKG9iamVjdC5fX2RlZmluZUdldHRlcl9fKSB7XG4gICAgICAgIG9iamVjdC5fX2RlZmluZUdldHRlcl9fKCdsZW5ndGgnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gb2JqZWN0LnMubGVuZ3RoO1xuICAgICAgICB9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb2JqZWN0Lmxlbmd0aCA9IHMubGVuZ3RoO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBvYmplY3QubGVuZ3RoID0gLTE7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gUyhzKSB7XG4gIFx0aW5pdGlhbGl6ZSh0aGlzLCBzKTtcbiAgfVxuXG4gIHZhciBfX25zcCA9IFN0cmluZy5wcm90b3R5cGU7XG4gIHZhciBfX3NwID0gUy5wcm90b3R5cGUgPSB7XG5cbiAgICBiZXR3ZWVuOiBmdW5jdGlvbihsZWZ0LCByaWdodCkge1xuICAgICAgdmFyIHMgPSB0aGlzLnM7XG4gICAgICB2YXIgc3RhcnRQb3MgPSBzLmluZGV4T2YobGVmdCk7XG4gICAgICB2YXIgZW5kUG9zID0gcy5pbmRleE9mKHJpZ2h0LCBzdGFydFBvcyArIGxlZnQubGVuZ3RoKTtcbiAgICAgIGlmIChlbmRQb3MgPT0gLTEgJiYgcmlnaHQgIT0gbnVsbCkgXG4gICAgICAgIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3RvcignJylcbiAgICAgIGVsc2UgaWYgKGVuZFBvcyA9PSAtMSAmJiByaWdodCA9PSBudWxsKVxuICAgICAgICByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3Iocy5zdWJzdHJpbmcoc3RhcnRQb3MgKyBsZWZ0Lmxlbmd0aCkpXG4gICAgICBlbHNlIFxuICAgICAgICByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3Iocy5zbGljZShzdGFydFBvcyArIGxlZnQubGVuZ3RoLCBlbmRQb3MpKTtcbiAgICB9LFxuXG4gICAgLy8jIG1vZGlmaWVkIHNsaWdodGx5IGZyb20gaHR0cHM6Ly9naXRodWIuY29tL2VwZWxpL3VuZGVyc2NvcmUuc3RyaW5nXG4gICAgY2FtZWxpemU6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHMgPSB0aGlzLnRyaW0oKS5zLnJlcGxhY2UoLyhcXC18X3xcXHMpKyguKT8vZywgZnVuY3Rpb24obWF0aGMsIHNlcCwgYykge1xuICAgICAgICByZXR1cm4gKGMgPyBjLnRvVXBwZXJDYXNlKCkgOiAnJyk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3RvcihzKTtcbiAgICB9LFxuXG4gICAgY2FwaXRhbGl6ZTogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3IodGhpcy5zLnN1YnN0cigwLCAxKS50b1VwcGVyQ2FzZSgpICsgdGhpcy5zLnN1YnN0cmluZygxKS50b0xvd2VyQ2FzZSgpKTtcbiAgICB9LFxuXG4gICAgY2hhckF0OiBmdW5jdGlvbihpbmRleCkge1xuICAgICAgcmV0dXJuIHRoaXMucy5jaGFyQXQoaW5kZXgpO1xuICAgIH0sXG5cbiAgICBjaG9tcExlZnQ6IGZ1bmN0aW9uKHByZWZpeCkge1xuICAgICAgdmFyIHMgPSB0aGlzLnM7XG4gICAgICBpZiAocy5pbmRleE9mKHByZWZpeCkgPT09IDApIHtcbiAgICAgICAgIHMgPSBzLnNsaWNlKHByZWZpeC5sZW5ndGgpO1xuICAgICAgICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKHMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgfSxcblxuICAgIGNob21wUmlnaHQ6IGZ1bmN0aW9uKHN1ZmZpeCkge1xuICAgICAgaWYgKHRoaXMuZW5kc1dpdGgoc3VmZml4KSkge1xuICAgICAgICB2YXIgcyA9IHRoaXMucztcbiAgICAgICAgcyA9IHMuc2xpY2UoMCwgcy5sZW5ndGggLSBzdWZmaXgubGVuZ3RoKTtcbiAgICAgICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKHMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8vI3RoYW5rcyBHb29nbGVcbiAgICBjb2xsYXBzZVdoaXRlc3BhY2U6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHMgPSB0aGlzLnMucmVwbGFjZSgvW1xcc1xceGEwXSsvZywgJyAnKS5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLCAnJyk7XG4gICAgICByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3Iocyk7XG4gICAgfSxcblxuICAgIGNvbnRhaW5zOiBmdW5jdGlvbihzcykge1xuICAgICAgcmV0dXJuIHRoaXMucy5pbmRleE9mKHNzKSA+PSAwO1xuICAgIH0sXG5cbiAgICBjb3VudDogZnVuY3Rpb24oc3MpIHtcbiAgICAgIHZhciBjb3VudCA9IDBcbiAgICAgICAgLCBwb3MgPSB0aGlzLnMuaW5kZXhPZihzcylcblxuICAgICAgd2hpbGUgKHBvcyA+PSAwKSB7XG4gICAgICAgIGNvdW50ICs9IDFcbiAgICAgICAgcG9zID0gdGhpcy5zLmluZGV4T2Yoc3MsIHBvcyArIDEpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBjb3VudFxuICAgIH0sXG5cbiAgICAvLyNtb2RpZmllZCBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9lcGVsaS91bmRlcnNjb3JlLnN0cmluZ1xuICAgIGRhc2hlcml6ZTogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcyA9IHRoaXMudHJpbSgpLnMucmVwbGFjZSgvW19cXHNdKy9nLCAnLScpLnJlcGxhY2UoLyhbQS1aXSkvZywgJy0kMScpLnJlcGxhY2UoLy0rL2csICctJykudG9Mb3dlckNhc2UoKTtcbiAgICAgIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3RvcihzKTtcbiAgICB9LFxuXG4gICAgZGVjb2RlSHRtbEVudGl0aWVzOiBmdW5jdGlvbigpIHsgLy9odHRwczovL2dpdGh1Yi5jb20vc3Vic3RhY2svbm9kZS1lbnQvYmxvYi9tYXN0ZXIvaW5kZXguanNcbiAgICAgIHZhciBzID0gdGhpcy5zO1xuICAgICAgcyA9IHMucmVwbGFjZSgvJiMoXFxkKyk7Py9nLCBmdW5jdGlvbiAoXywgY29kZSkge1xuICAgICAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZShjb2RlKTtcbiAgICAgIH0pXG4gICAgICAucmVwbGFjZSgvJiNbeFhdKFtBLUZhLWYwLTldKyk7Py9nLCBmdW5jdGlvbiAoXywgaGV4KSB7XG4gICAgICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKHBhcnNlSW50KGhleCwgMTYpKTtcbiAgICAgIH0pXG4gICAgICAucmVwbGFjZSgvJihbXjtcXFddKzs/KS9nLCBmdW5jdGlvbiAobSwgZSkge1xuICAgICAgICB2YXIgZWUgPSBlLnJlcGxhY2UoLzskLywgJycpO1xuICAgICAgICB2YXIgdGFyZ2V0ID0gRU5USVRJRVNbZV0gfHwgKGUubWF0Y2goLzskLykgJiYgRU5USVRJRVNbZWVdKTtcbiAgICAgICAgICAgIFxuICAgICAgICBpZiAodHlwZW9mIHRhcmdldCA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZSh0YXJnZXQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiB0YXJnZXQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gbTtcbiAgICAgICAgfVxuICAgICAgfSlcblxuICAgICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKHMpO1xuICAgIH0sXG5cbiAgICBlbmRzV2l0aDogZnVuY3Rpb24oc3VmZml4KSB7XG4gICAgICB2YXIgbCAgPSB0aGlzLnMubGVuZ3RoIC0gc3VmZml4Lmxlbmd0aDtcbiAgICAgIHJldHVybiBsID49IDAgJiYgdGhpcy5zLmluZGV4T2Yoc3VmZml4LCBsKSA9PT0gbDtcbiAgICB9LFxuXG4gICAgZXNjYXBlSFRNTDogZnVuY3Rpb24oKSB7IC8vZnJvbSB1bmRlcnNjb3JlLnN0cmluZ1xuICAgICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKHRoaXMucy5yZXBsYWNlKC9bJjw+XCInXS9nLCBmdW5jdGlvbihtKXsgcmV0dXJuICcmJyArIHJldmVyc2VkRXNjYXBlQ2hhcnNbbV0gKyAnOyc7IH0pKTtcbiAgICB9LFxuXG4gICAgZW5zdXJlTGVmdDogZnVuY3Rpb24ocHJlZml4KSB7XG4gICAgICB2YXIgcyA9IHRoaXMucztcbiAgICAgIGlmIChzLmluZGV4T2YocHJlZml4KSA9PT0gMCkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3RvcihwcmVmaXggKyBzKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgZW5zdXJlUmlnaHQ6IGZ1bmN0aW9uKHN1ZmZpeCkge1xuICAgICAgdmFyIHMgPSB0aGlzLnM7XG4gICAgICBpZiAodGhpcy5lbmRzV2l0aChzdWZmaXgpKSAge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3RvcihzICsgc3VmZml4KTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgaHVtYW5pemU6IGZ1bmN0aW9uKCkgeyAvL21vZGlmaWVkIGZyb20gdW5kZXJzY29yZS5zdHJpbmdcbiAgICAgIGlmICh0aGlzLnMgPT09IG51bGwgfHwgdGhpcy5zID09PSB1bmRlZmluZWQpXG4gICAgICAgIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3RvcignJylcbiAgICAgIHZhciBzID0gdGhpcy51bmRlcnNjb3JlKCkucmVwbGFjZSgvX2lkJC8sJycpLnJlcGxhY2UoL18vZywgJyAnKS50cmltKCkuY2FwaXRhbGl6ZSgpXG4gICAgICByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3IocylcbiAgICB9LFxuXG4gICAgaXNBbHBoYTogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gIS9bXmEtelxceEMwLVxceEZGXS8udGVzdCh0aGlzLnMudG9Mb3dlckNhc2UoKSk7XG4gICAgfSxcblxuICAgIGlzQWxwaGFOdW1lcmljOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiAhL1teMC05YS16XFx4QzAtXFx4RkZdLy50ZXN0KHRoaXMucy50b0xvd2VyQ2FzZSgpKTtcbiAgICB9LFxuXG4gICAgaXNFbXB0eTogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5zID09PSBudWxsIHx8IHRoaXMucyA9PT0gdW5kZWZpbmVkID8gdHJ1ZSA6IC9eW1xcc1xceGEwXSokLy50ZXN0KHRoaXMucyk7XG4gICAgfSxcblxuICAgIGlzTG93ZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuaXNBbHBoYSgpICYmIHRoaXMucy50b0xvd2VyQ2FzZSgpID09PSB0aGlzLnM7XG4gICAgfSxcblxuICAgIGlzTnVtZXJpYzogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gIS9bXjAtOV0vLnRlc3QodGhpcy5zKTtcbiAgICB9LFxuXG4gICAgaXNVcHBlcjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5pc0FscGhhKCkgJiYgdGhpcy5zLnRvVXBwZXJDYXNlKCkgPT09IHRoaXMucztcbiAgICB9LFxuXG4gICAgbGVmdDogZnVuY3Rpb24oTikge1xuICAgICAgaWYgKE4gPj0gMCkge1xuICAgICAgICB2YXIgcyA9IHRoaXMucy5zdWJzdHIoMCwgTik7XG4gICAgICAgIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3RvcihzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJpZ2h0KC1OKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIFxuICAgIGxpbmVzOiBmdW5jdGlvbigpIHsgLy9jb252ZXJ0IHdpbmRvd3MgbmV3bGluZXMgdG8gdW5peCBuZXdsaW5lcyB0aGVuIGNvbnZlcnQgdG8gYW4gQXJyYXkgb2YgbGluZXNcbiAgICAgIHJldHVybiB0aGlzLnJlcGxhY2VBbGwoJ1xcclxcbicsICdcXG4nKS5zLnNwbGl0KCdcXG4nKTtcbiAgICB9LFxuXG4gICAgcGFkOiBmdW5jdGlvbihsZW4sIGNoKSB7IC8vaHR0cHM6Ly9naXRodWIuY29tL2NvbXBvbmVudC9wYWRcbiAgICAgIGlmIChjaCA9PSBudWxsKSBjaCA9ICcgJztcbiAgICAgIGlmICh0aGlzLnMubGVuZ3RoID49IGxlbikgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKHRoaXMucyk7XG4gICAgICBsZW4gPSBsZW4gLSB0aGlzLnMubGVuZ3RoO1xuICAgICAgdmFyIGxlZnQgPSBBcnJheShNYXRoLmNlaWwobGVuIC8gMikgKyAxKS5qb2luKGNoKTtcbiAgICAgIHZhciByaWdodCA9IEFycmF5KE1hdGguZmxvb3IobGVuIC8gMikgKyAxKS5qb2luKGNoKTtcbiAgICAgIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3RvcihsZWZ0ICsgdGhpcy5zICsgcmlnaHQpO1xuICAgIH0sXG5cbiAgICBwYWRMZWZ0OiBmdW5jdGlvbihsZW4sIGNoKSB7IC8vaHR0cHM6Ly9naXRodWIuY29tL2NvbXBvbmVudC9wYWRcbiAgICAgIGlmIChjaCA9PSBudWxsKSBjaCA9ICcgJztcbiAgICAgIGlmICh0aGlzLnMubGVuZ3RoID49IGxlbikgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKHRoaXMucyk7XG4gICAgICByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3IoQXJyYXkobGVuIC0gdGhpcy5zLmxlbmd0aCArIDEpLmpvaW4oY2gpICsgdGhpcy5zKTtcbiAgICB9LFxuXG4gICAgcGFkUmlnaHQ6IGZ1bmN0aW9uKGxlbiwgY2gpIHsgLy9odHRwczovL2dpdGh1Yi5jb20vY29tcG9uZW50L3BhZFxuICAgICAgaWYgKGNoID09IG51bGwpIGNoID0gJyAnO1xuICAgICAgaWYgKHRoaXMucy5sZW5ndGggPj0gbGVuKSByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3IodGhpcy5zKTtcbiAgICAgIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3Rvcih0aGlzLnMgKyBBcnJheShsZW4gLSB0aGlzLnMubGVuZ3RoICsgMSkuam9pbihjaCkpO1xuICAgIH0sXG5cbiAgICBwYXJzZUNTVjogZnVuY3Rpb24oZGVsaW1pdGVyLCBxdWFsaWZpZXIsIGVzY2FwZSwgbGluZURlbGltaXRlcikgeyAvL3RyeSB0byBwYXJzZSBubyBtYXR0ZXIgd2hhdFxuICAgICAgZGVsaW1pdGVyID0gZGVsaW1pdGVyIHx8ICcsJztcbiAgICAgIGVzY2FwZSA9IGVzY2FwZSB8fCAnXFxcXCdcbiAgICAgIGlmICh0eXBlb2YgcXVhbGlmaWVyID09ICd1bmRlZmluZWQnKVxuICAgICAgICBxdWFsaWZpZXIgPSAnXCInO1xuXG4gICAgICB2YXIgaSA9IDAsIGZpZWxkQnVmZmVyID0gW10sIGZpZWxkcyA9IFtdLCBsZW4gPSB0aGlzLnMubGVuZ3RoLCBpbkZpZWxkID0gZmFsc2UsIHNlbGYgPSB0aGlzO1xuICAgICAgdmFyIGNhID0gZnVuY3Rpb24oaSl7cmV0dXJuIHNlbGYucy5jaGFyQXQoaSl9O1xuICAgICAgaWYgKHR5cGVvZiBsaW5lRGVsaW1pdGVyICE9PSAndW5kZWZpbmVkJykgdmFyIHJvd3MgPSBbXTtcblxuICAgICAgaWYgKCFxdWFsaWZpZXIpXG4gICAgICAgIGluRmllbGQgPSB0cnVlO1xuXG4gICAgICB3aGlsZSAoaSA8IGxlbikge1xuICAgICAgICB2YXIgY3VycmVudCA9IGNhKGkpO1xuICAgICAgICBzd2l0Y2ggKGN1cnJlbnQpIHtcbiAgICAgICAgICBjYXNlIGVzY2FwZTpcbiAgICAgICAgICAvL2ZpeCBmb3IgaXNzdWVzICMzMiBhbmQgIzM1XG4gICAgICAgICAgaWYgKGluRmllbGQgJiYgKChlc2NhcGUgIT09IHF1YWxpZmllcikgfHwgY2EoaSsxKSA9PT0gcXVhbGlmaWVyKSkge1xuICAgICAgICAgICAgICBpICs9IDE7XG4gICAgICAgICAgICAgIGZpZWxkQnVmZmVyLnB1c2goY2EoaSkpO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGVzY2FwZSAhPT0gcXVhbGlmaWVyKSBicmVhaztcbiAgICAgICAgICBjYXNlIHF1YWxpZmllcjpcbiAgICAgICAgICAgIGluRmllbGQgPSAhaW5GaWVsZDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgZGVsaW1pdGVyOlxuICAgICAgICAgICAgaWYgKGluRmllbGQgJiYgcXVhbGlmaWVyKVxuICAgICAgICAgICAgICBmaWVsZEJ1ZmZlci5wdXNoKGN1cnJlbnQpO1xuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgIGZpZWxkcy5wdXNoKGZpZWxkQnVmZmVyLmpvaW4oJycpKVxuICAgICAgICAgICAgICBmaWVsZEJ1ZmZlci5sZW5ndGggPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSBsaW5lRGVsaW1pdGVyOlxuICAgICAgICAgICAgaWYgKGluRmllbGQpIHtcbiAgICAgICAgICAgICAgICBmaWVsZEJ1ZmZlci5wdXNoKGN1cnJlbnQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAocm93cykge1xuICAgICAgICAgICAgICAgICAgICBmaWVsZHMucHVzaChmaWVsZEJ1ZmZlci5qb2luKCcnKSlcbiAgICAgICAgICAgICAgICAgICAgcm93cy5wdXNoKGZpZWxkcyk7XG4gICAgICAgICAgICAgICAgICAgIGZpZWxkcyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICBmaWVsZEJ1ZmZlci5sZW5ndGggPSAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBpZiAoaW5GaWVsZClcbiAgICAgICAgICAgICAgZmllbGRCdWZmZXIucHVzaChjdXJyZW50KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGkgKz0gMTtcbiAgICAgIH1cblxuICAgICAgZmllbGRzLnB1c2goZmllbGRCdWZmZXIuam9pbignJykpO1xuICAgICAgaWYgKHJvd3MpIHtcbiAgICAgICAgcm93cy5wdXNoKGZpZWxkcyk7XG4gICAgICAgIHJldHVybiByb3dzO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZpZWxkcztcbiAgICB9LFxuXG4gICAgcmVwbGFjZUFsbDogZnVuY3Rpb24oc3MsIHIpIHtcbiAgICAgIC8vdmFyIHMgPSB0aGlzLnMucmVwbGFjZShuZXcgUmVnRXhwKHNzLCAnZycpLCByKTtcbiAgICAgIHZhciBzID0gdGhpcy5zLnNwbGl0KHNzKS5qb2luKHIpXG4gICAgICByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3Iocyk7XG4gICAgfSxcblxuICAgIHJpZ2h0OiBmdW5jdGlvbihOKSB7XG4gICAgICBpZiAoTiA+PSAwKSB7XG4gICAgICAgIHZhciBzID0gdGhpcy5zLnN1YnN0cih0aGlzLnMubGVuZ3RoIC0gTiwgTik7XG4gICAgICAgIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3RvcihzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxlZnQoLU4pO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBzZXRWYWx1ZTogZnVuY3Rpb24gKHMpIHtcblx0ICBpbml0aWFsaXplKHRoaXMsIHMpO1xuXHQgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICBzbHVnaWZ5OiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBzbCA9IChuZXcgUyh0aGlzLnMucmVwbGFjZSgvW15cXHdcXHMtXS9nLCAnJykudG9Mb3dlckNhc2UoKSkpLmRhc2hlcml6ZSgpLnM7XG4gICAgICBpZiAoc2wuY2hhckF0KDApID09PSAnLScpXG4gICAgICAgIHNsID0gc2wuc3Vic3RyKDEpO1xuICAgICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKHNsKTtcbiAgICB9LFxuXG4gICAgc3RhcnRzV2l0aDogZnVuY3Rpb24ocHJlZml4KSB7XG4gICAgICByZXR1cm4gdGhpcy5zLmxhc3RJbmRleE9mKHByZWZpeCwgMCkgPT09IDA7XG4gICAgfSxcblxuICAgIHN0cmlwUHVuY3R1YXRpb246IGZ1bmN0aW9uKCkge1xuICAgICAgLy9yZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3IodGhpcy5zLnJlcGxhY2UoL1tcXC4sLVxcLyMhJCVcXF4mXFwqOzp7fT1cXC1fYH4oKV0vZyxcIlwiKSk7XG4gICAgICByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3IodGhpcy5zLnJlcGxhY2UoL1teXFx3XFxzXXxfL2csIFwiXCIpLnJlcGxhY2UoL1xccysvZywgXCIgXCIpKTtcbiAgICB9LFxuXG4gICAgc3RyaXBUYWdzOiBmdW5jdGlvbigpIHsgLy9mcm9tIHN1Z2FyLmpzXG4gICAgICB2YXIgcyA9IHRoaXMucywgYXJncyA9IGFyZ3VtZW50cy5sZW5ndGggPiAwID8gYXJndW1lbnRzIDogWycnXTtcbiAgICAgIG11bHRpQXJncyhhcmdzLCBmdW5jdGlvbih0YWcpIHtcbiAgICAgICAgcyA9IHMucmVwbGFjZShSZWdFeHAoJzxcXC8/JyArIHRhZyArICdbXjw+XSo+JywgJ2dpJyksICcnKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKHMpO1xuICAgIH0sXG5cbiAgICB0ZW1wbGF0ZTogZnVuY3Rpb24odmFsdWVzLCBvcGVuaW5nLCBjbG9zaW5nKSB7XG4gICAgICB2YXIgcyA9IHRoaXMuc1xuICAgICAgdmFyIG9wZW5pbmcgPSBvcGVuaW5nIHx8IEV4cG9ydC5UTVBMX09QRU5cbiAgICAgIHZhciBjbG9zaW5nID0gY2xvc2luZyB8fCBFeHBvcnQuVE1QTF9DTE9TRVxuXG4gICAgICB2YXIgb3BlbiA9IG9wZW5pbmcucmVwbGFjZSgvWy1bXFxdKCkqXFxzXS9nLCBcIlxcXFwkJlwiKS5yZXBsYWNlKC9cXCQvZywgJ1xcXFwkJylcbiAgICAgIHZhciBjbG9zZSA9IGNsb3NpbmcucmVwbGFjZSgvWy1bXFxdKCkqXFxzXS9nLCBcIlxcXFwkJlwiKS5yZXBsYWNlKC9cXCQvZywgJ1xcXFwkJylcbiAgICAgIHZhciByID0gbmV3IFJlZ0V4cChvcGVuICsgJyguKz8pJyArIGNsb3NlLCAnZycpXG4gICAgICAgIC8vLCByID0gL1xce1xceyguKz8pXFx9XFx9L2dcbiAgICAgIHZhciBtYXRjaGVzID0gcy5tYXRjaChyKSB8fCBbXTtcblxuICAgICAgbWF0Y2hlcy5mb3JFYWNoKGZ1bmN0aW9uKG1hdGNoKSB7XG4gICAgICAgIHZhciBrZXkgPSBtYXRjaC5zdWJzdHJpbmcob3BlbmluZy5sZW5ndGgsIG1hdGNoLmxlbmd0aCAtIGNsb3NpbmcubGVuZ3RoKTsvL2Nob3Age3sgYW5kIH19XG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWVzW2tleV0gIT0gJ3VuZGVmaW5lZCcpXG4gICAgICAgICAgcyA9IHMucmVwbGFjZShtYXRjaCwgdmFsdWVzW2tleV0pO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3Iocyk7XG4gICAgfSxcblxuICAgIHRpbWVzOiBmdW5jdGlvbihuKSB7XG4gICAgICByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3IobmV3IEFycmF5KG4gKyAxKS5qb2luKHRoaXMucykpO1xuICAgIH0sXG5cbiAgICB0b0Jvb2xlYW46IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHR5cGVvZiB0aGlzLm9yaWcgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHZhciBzID0gdGhpcy5zLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIHJldHVybiBzID09PSAndHJ1ZScgfHwgcyA9PT0gJ3llcycgfHwgcyA9PT0gJ29uJztcbiAgICAgIH0gZWxzZVxuICAgICAgICByZXR1cm4gdGhpcy5vcmlnID09PSB0cnVlIHx8IHRoaXMub3JpZyA9PT0gMTtcbiAgICB9LFxuXG4gICAgdG9GbG9hdDogZnVuY3Rpb24ocHJlY2lzaW9uKSB7XG4gICAgICB2YXIgbnVtID0gcGFyc2VGbG9hdCh0aGlzLnMpXG4gICAgICBpZiAocHJlY2lzaW9uKVxuICAgICAgICByZXR1cm4gcGFyc2VGbG9hdChudW0udG9GaXhlZChwcmVjaXNpb24pKVxuICAgICAgZWxzZVxuICAgICAgICByZXR1cm4gbnVtXG4gICAgfSxcblxuICAgIHRvSW50OiBmdW5jdGlvbigpIHsgLy90aGFua3MgR29vZ2xlXG4gICAgICAvLyBJZiB0aGUgc3RyaW5nIHN0YXJ0cyB3aXRoICcweCcgb3IgJy0weCcsIHBhcnNlIGFzIGhleC5cbiAgICAgIHJldHVybiAvXlxccyotPzB4L2kudGVzdCh0aGlzLnMpID8gcGFyc2VJbnQodGhpcy5zLCAxNikgOiBwYXJzZUludCh0aGlzLnMsIDEwKVxuICAgIH0sXG5cbiAgICB0cmltOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBzO1xuICAgICAgaWYgKHR5cGVvZiBfX25zcC50cmltID09PSAndW5kZWZpbmVkJykgXG4gICAgICAgIHMgPSB0aGlzLnMucmVwbGFjZSgvKF5cXHMqfFxccyokKS9nLCAnJylcbiAgICAgIGVsc2UgXG4gICAgICAgIHMgPSB0aGlzLnMudHJpbSgpXG4gICAgICByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3Iocyk7XG4gICAgfSxcblxuICAgIHRyaW1MZWZ0OiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBzO1xuICAgICAgaWYgKF9fbnNwLnRyaW1MZWZ0KVxuICAgICAgICBzID0gdGhpcy5zLnRyaW1MZWZ0KCk7XG4gICAgICBlbHNlXG4gICAgICAgIHMgPSB0aGlzLnMucmVwbGFjZSgvKF5cXHMqKS9nLCAnJyk7XG4gICAgICByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3Iocyk7XG4gICAgfSxcblxuICAgIHRyaW1SaWdodDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcztcbiAgICAgIGlmIChfX25zcC50cmltUmlnaHQpXG4gICAgICAgIHMgPSB0aGlzLnMudHJpbVJpZ2h0KCk7XG4gICAgICBlbHNlXG4gICAgICAgIHMgPSB0aGlzLnMucmVwbGFjZSgvXFxzKyQvLCAnJyk7XG4gICAgICByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3Iocyk7XG4gICAgfSxcblxuICAgIHRydW5jYXRlOiBmdW5jdGlvbihsZW5ndGgsIHBydW5lU3RyKSB7IC8vZnJvbSB1bmRlcnNjb3JlLnN0cmluZywgYXV0aG9yOiBnaXRodWIuY29tL3J3elxuICAgICAgdmFyIHN0ciA9IHRoaXMucztcblxuICAgICAgbGVuZ3RoID0gfn5sZW5ndGg7XG4gICAgICBwcnVuZVN0ciA9IHBydW5lU3RyIHx8ICcuLi4nO1xuXG4gICAgICBpZiAoc3RyLmxlbmd0aCA8PSBsZW5ndGgpIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3RvcihzdHIpO1xuXG4gICAgICB2YXIgdG1wbCA9IGZ1bmN0aW9uKGMpeyByZXR1cm4gYy50b1VwcGVyQ2FzZSgpICE9PSBjLnRvTG93ZXJDYXNlKCkgPyAnQScgOiAnICc7IH0sXG4gICAgICAgIHRlbXBsYXRlID0gc3RyLnNsaWNlKDAsIGxlbmd0aCsxKS5yZXBsYWNlKC8uKD89XFxXKlxcdyokKS9nLCB0bXBsKTsgLy8gJ0hlbGxvLCB3b3JsZCcgLT4gJ0hlbGxBQSBBQUFBQSdcblxuICAgICAgaWYgKHRlbXBsYXRlLnNsaWNlKHRlbXBsYXRlLmxlbmd0aC0yKS5tYXRjaCgvXFx3XFx3LykpXG4gICAgICAgIHRlbXBsYXRlID0gdGVtcGxhdGUucmVwbGFjZSgvXFxzKlxcUyskLywgJycpO1xuICAgICAgZWxzZVxuICAgICAgICB0ZW1wbGF0ZSA9IG5ldyBTKHRlbXBsYXRlLnNsaWNlKDAsIHRlbXBsYXRlLmxlbmd0aC0xKSkudHJpbVJpZ2h0KCkucztcblxuICAgICAgcmV0dXJuICh0ZW1wbGF0ZStwcnVuZVN0cikubGVuZ3RoID4gc3RyLmxlbmd0aCA/IG5ldyBTKHN0cikgOiBuZXcgUyhzdHIuc2xpY2UoMCwgdGVtcGxhdGUubGVuZ3RoKStwcnVuZVN0cik7XG4gICAgfSxcblxuICAgIHRvQ1NWOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBkZWxpbSA9ICcsJywgcXVhbGlmaWVyID0gJ1wiJywgZXNjYXBlID0gJ1xcXFwnLCBlbmNsb3NlTnVtYmVycyA9IHRydWUsIGtleXMgPSBmYWxzZTtcbiAgICAgIHZhciBkYXRhQXJyYXkgPSBbXTtcblxuICAgICAgZnVuY3Rpb24gaGFzVmFsKGl0KSB7XG4gICAgICAgIHJldHVybiBpdCAhPT0gbnVsbCAmJiBpdCAhPT0gJyc7XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YgYXJndW1lbnRzWzBdID09PSAnb2JqZWN0Jykge1xuICAgICAgICBkZWxpbSA9IGFyZ3VtZW50c1swXS5kZWxpbWl0ZXIgfHwgZGVsaW07XG4gICAgICAgIGRlbGltID0gYXJndW1lbnRzWzBdLnNlcGFyYXRvciB8fCBkZWxpbTtcbiAgICAgICAgcXVhbGlmaWVyID0gYXJndW1lbnRzWzBdLnF1YWxpZmllciB8fCBxdWFsaWZpZXI7XG4gICAgICAgIGVuY2xvc2VOdW1iZXJzID0gISFhcmd1bWVudHNbMF0uZW5jbG9zZU51bWJlcnM7XG4gICAgICAgIGVzY2FwZSA9IGFyZ3VtZW50c1swXS5lc2NhcGUgfHwgZXNjYXBlO1xuICAgICAgICBrZXlzID0gISFhcmd1bWVudHNbMF0ua2V5cztcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGFyZ3VtZW50c1swXSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgZGVsaW0gPSBhcmd1bWVudHNbMF07XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YgYXJndW1lbnRzWzFdID09PSAnc3RyaW5nJylcbiAgICAgICAgcXVhbGlmaWVyID0gYXJndW1lbnRzWzFdO1xuXG4gICAgICBpZiAoYXJndW1lbnRzWzFdID09PSBudWxsKVxuICAgICAgICBxdWFsaWZpZXIgPSBudWxsO1xuXG4gICAgICAgaWYgKHRoaXMub3JpZyBpbnN0YW5jZW9mIEFycmF5KVxuICAgICAgICBkYXRhQXJyYXkgID0gdGhpcy5vcmlnO1xuICAgICAgZWxzZSB7IC8vb2JqZWN0XG4gICAgICAgIGZvciAodmFyIGtleSBpbiB0aGlzLm9yaWcpXG4gICAgICAgICAgaWYgKHRoaXMub3JpZy5oYXNPd25Qcm9wZXJ0eShrZXkpKVxuICAgICAgICAgICAgaWYgKGtleXMpXG4gICAgICAgICAgICAgIGRhdGFBcnJheS5wdXNoKGtleSk7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIGRhdGFBcnJheS5wdXNoKHRoaXMub3JpZ1trZXldKTtcbiAgICAgIH1cblxuICAgICAgdmFyIHJlcCA9IGVzY2FwZSArIHF1YWxpZmllcjtcbiAgICAgIHZhciBidWlsZFN0cmluZyA9IFtdO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhQXJyYXkubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgdmFyIHNob3VsZFF1YWxpZnkgPSBoYXNWYWwocXVhbGlmaWVyKVxuICAgICAgICBpZiAodHlwZW9mIGRhdGFBcnJheVtpXSA9PSAnbnVtYmVyJylcbiAgICAgICAgICBzaG91bGRRdWFsaWZ5ICY9IGVuY2xvc2VOdW1iZXJzO1xuICAgICAgICBcbiAgICAgICAgaWYgKHNob3VsZFF1YWxpZnkpXG4gICAgICAgICAgYnVpbGRTdHJpbmcucHVzaChxdWFsaWZpZXIpO1xuICAgICAgICBcbiAgICAgICAgaWYgKGRhdGFBcnJheVtpXSAhPT0gbnVsbCAmJiBkYXRhQXJyYXlbaV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHZhciBkID0gbmV3IFMoZGF0YUFycmF5W2ldKS5yZXBsYWNlQWxsKHF1YWxpZmllciwgcmVwKS5zO1xuICAgICAgICAgIGJ1aWxkU3RyaW5nLnB1c2goZCk7XG4gICAgICAgIH0gZWxzZSBcbiAgICAgICAgICBidWlsZFN0cmluZy5wdXNoKCcnKVxuXG4gICAgICAgIGlmIChzaG91bGRRdWFsaWZ5KVxuICAgICAgICAgIGJ1aWxkU3RyaW5nLnB1c2gocXVhbGlmaWVyKTtcbiAgICAgICAgXG4gICAgICAgIGlmIChkZWxpbSlcbiAgICAgICAgICBidWlsZFN0cmluZy5wdXNoKGRlbGltKTtcbiAgICAgIH1cblxuICAgICAgLy9jaG9wIGxhc3QgZGVsaW1cbiAgICAgIC8vY29uc29sZS5sb2coYnVpbGRTdHJpbmcubGVuZ3RoKVxuICAgICAgYnVpbGRTdHJpbmcubGVuZ3RoID0gYnVpbGRTdHJpbmcubGVuZ3RoIC0gMTtcbiAgICAgIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3RvcihidWlsZFN0cmluZy5qb2luKCcnKSk7XG4gICAgfSxcblxuICAgIHRvU3RyaW5nOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLnM7XG4gICAgfSxcblxuICAgIC8vI21vZGlmaWVkIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL2VwZWxpL3VuZGVyc2NvcmUuc3RyaW5nXG4gICAgdW5kZXJzY29yZTogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcyA9IHRoaXMudHJpbSgpLnMucmVwbGFjZSgvKFthLXpcXGRdKShbQS1aXSspL2csICckMV8kMicpLnJlcGxhY2UoL1stXFxzXSsvZywgJ18nKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgaWYgKChuZXcgUyh0aGlzLnMuY2hhckF0KDApKSkuaXNVcHBlcigpKSB7XG4gICAgICAgIHMgPSAnXycgKyBzO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKHMpO1xuICAgIH0sXG5cbiAgICB1bmVzY2FwZUhUTUw6IGZ1bmN0aW9uKCkgeyAvL2Zyb20gdW5kZXJzY29yZS5zdHJpbmdcbiAgICAgIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3Rvcih0aGlzLnMucmVwbGFjZSgvXFwmKFteO10rKTsvZywgZnVuY3Rpb24oZW50aXR5LCBlbnRpdHlDb2RlKXtcbiAgICAgICAgdmFyIG1hdGNoO1xuXG4gICAgICAgIGlmIChlbnRpdHlDb2RlIGluIGVzY2FwZUNoYXJzKSB7XG4gICAgICAgICAgcmV0dXJuIGVzY2FwZUNoYXJzW2VudGl0eUNvZGVdO1xuICAgICAgICB9IGVsc2UgaWYgKG1hdGNoID0gZW50aXR5Q29kZS5tYXRjaCgvXiN4KFtcXGRhLWZBLUZdKykkLykpIHtcbiAgICAgICAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZShwYXJzZUludChtYXRjaFsxXSwgMTYpKTtcbiAgICAgICAgfSBlbHNlIGlmIChtYXRjaCA9IGVudGl0eUNvZGUubWF0Y2goL14jKFxcZCspJC8pKSB7XG4gICAgICAgICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUofn5tYXRjaFsxXSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIGVudGl0eTtcbiAgICAgICAgfVxuICAgICAgfSkpO1xuICAgIH0sXG5cbiAgICB2YWx1ZU9mOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLnMudmFsdWVPZigpO1xuICAgIH1cblxuICB9XG5cbiAgdmFyIG1ldGhvZHNBZGRlZCA9IFtdO1xuICBmdW5jdGlvbiBleHRlbmRQcm90b3R5cGUoKSB7XG4gICAgZm9yICh2YXIgbmFtZSBpbiBfX3NwKSB7XG4gICAgICAoZnVuY3Rpb24obmFtZSl7XG4gICAgICAgIHZhciBmdW5jID0gX19zcFtuYW1lXTtcbiAgICAgICAgaWYgKCFfX25zcC5oYXNPd25Qcm9wZXJ0eShuYW1lKSkge1xuICAgICAgICAgIG1ldGhvZHNBZGRlZC5wdXNoKG5hbWUpO1xuICAgICAgICAgIF9fbnNwW25hbWVdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBTdHJpbmcucHJvdG90eXBlLnMgPSB0aGlzO1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pKG5hbWUpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHJlc3RvcmVQcm90b3R5cGUoKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtZXRob2RzQWRkZWQubGVuZ3RoOyArK2kpXG4gICAgICBkZWxldGUgU3RyaW5nLnByb3RvdHlwZVttZXRob2RzQWRkZWRbaV1dO1xuICAgIG1ldGhvZHNBZGRlZC5sZW5ndGggPSAwO1xuICB9XG5cblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8qIEF0dGFjaCBOYXRpdmUgSmF2YVNjcmlwdCBTdHJpbmcgUHJvcGVydGllc1xuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgdmFyIG5hdGl2ZVByb3BlcnRpZXMgPSBnZXROYXRpdmVTdHJpbmdQcm9wZXJ0aWVzKCk7XG4gIGZvciAodmFyIG5hbWUgaW4gbmF0aXZlUHJvcGVydGllcykge1xuICAgIChmdW5jdGlvbihuYW1lKSB7XG4gICAgICB2YXIgc3RyaW5nUHJvcCA9IF9fbnNwW25hbWVdO1xuICAgICAgaWYgKHR5cGVvZiBzdHJpbmdQcm9wID09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhzdHJpbmdQcm9wKVxuICAgICAgICBpZiAoIV9fc3BbbmFtZV0pIHtcbiAgICAgICAgICBpZiAobmF0aXZlUHJvcGVydGllc1tuYW1lXSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIF9fc3BbbmFtZV0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhuYW1lKVxuICAgICAgICAgICAgICByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3Ioc3RyaW5nUHJvcC5hcHBseSh0aGlzLCBhcmd1bWVudHMpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgX19zcFtuYW1lXSA9IHN0cmluZ1Byb3A7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSkobmFtZSk7XG4gIH1cblxuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLyogRnVuY3Rpb24gQWxpYXNlc1xuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgX19zcC5yZXBlYXQgPSBfX3NwLnRpbWVzO1xuICBfX3NwLmluY2x1ZGUgPSBfX3NwLmNvbnRhaW5zO1xuICBfX3NwLnRvSW50ZWdlciA9IF9fc3AudG9JbnQ7XG4gIF9fc3AudG9Cb29sID0gX19zcC50b0Jvb2xlYW47XG4gIF9fc3AuZGVjb2RlSFRNTEVudGl0aWVzID0gX19zcC5kZWNvZGVIdG1sRW50aXRpZXMgLy9lbnN1cmUgY29uc2lzdGVudCBjYXNpbmcgc2NoZW1lIG9mICdIVE1MJ1xuXG5cbi8vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vLyBTZXQgdGhlIGNvbnN0cnVjdG9yLiAgV2l0aG91dCB0aGlzLCBzdHJpbmcuanMgb2JqZWN0cyBhcmUgaW5zdGFuY2VzIG9mXG4vLyBPYmplY3QgaW5zdGVhZCBvZiBTLlxuLy8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcblxuICBfX3NwLmNvbnN0cnVjdG9yID0gUztcblxuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLyogUHJpdmF0ZSBGdW5jdGlvbnNcbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gIGZ1bmN0aW9uIGdldE5hdGl2ZVN0cmluZ1Byb3BlcnRpZXMoKSB7XG4gICAgdmFyIG5hbWVzID0gZ2V0TmF0aXZlU3RyaW5nUHJvcGVydHlOYW1lcygpO1xuICAgIHZhciByZXRPYmogPSB7fTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbmFtZXMubGVuZ3RoOyArK2kpIHtcbiAgICAgIHZhciBuYW1lID0gbmFtZXNbaV07XG4gICAgICB2YXIgZnVuYyA9IF9fbnNwW25hbWVdO1xuICAgICAgdHJ5IHtcbiAgICAgICAgdmFyIHR5cGUgPSB0eXBlb2YgZnVuYy5hcHBseSgndGVzdHN0cmluZycsIFtdKTtcbiAgICAgICAgcmV0T2JqW25hbWVdID0gdHlwZTtcbiAgICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgfVxuICAgIHJldHVybiByZXRPYmo7XG4gIH1cblxuICBmdW5jdGlvbiBnZXROYXRpdmVTdHJpbmdQcm9wZXJ0eU5hbWVzKCkge1xuICAgIHZhciByZXN1bHRzID0gW107XG4gICAgaWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKSB7XG4gICAgICByZXN1bHRzID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoX19uc3ApO1xuICAgICAgcmVzdWx0cy5zcGxpY2UocmVzdWx0cy5pbmRleE9mKCd2YWx1ZU9mJyksIDEpO1xuICAgICAgcmVzdWx0cy5zcGxpY2UocmVzdWx0cy5pbmRleE9mKCd0b1N0cmluZycpLCAxKTtcbiAgICAgIHJldHVybiByZXN1bHRzO1xuICAgIH0gZWxzZSB7IC8vbWVhbnQgZm9yIGxlZ2FjeSBjcnVmdCwgdGhpcyBjb3VsZCBwcm9iYWJseSBiZSBtYWRlIG1vcmUgZWZmaWNpZW50XG4gICAgICB2YXIgc3RyaW5nTmFtZXMgPSB7fTtcbiAgICAgIHZhciBvYmplY3ROYW1lcyA9IFtdO1xuICAgICAgZm9yICh2YXIgbmFtZSBpbiBTdHJpbmcucHJvdG90eXBlKVxuICAgICAgICBzdHJpbmdOYW1lc1tuYW1lXSA9IG5hbWU7XG5cbiAgICAgIGZvciAodmFyIG5hbWUgaW4gT2JqZWN0LnByb3RvdHlwZSlcbiAgICAgICAgZGVsZXRlIHN0cmluZ05hbWVzW25hbWVdO1xuXG4gICAgICAvL3N0cmluZ05hbWVzWyd0b1N0cmluZyddID0gJ3RvU3RyaW5nJzsgLy90aGlzIHdhcyBkZWxldGVkIHdpdGggdGhlIHJlc3Qgb2YgdGhlIG9iamVjdCBuYW1lc1xuICAgICAgZm9yICh2YXIgbmFtZSBpbiBzdHJpbmdOYW1lcykge1xuICAgICAgICByZXN1bHRzLnB1c2gobmFtZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0cztcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBFeHBvcnQoc3RyKSB7XG4gICAgcmV0dXJuIG5ldyBTKHN0cik7XG4gIH07XG5cbiAgLy9hdHRhY2ggZXhwb3J0cyB0byBTdHJpbmdKU1dyYXBwZXJcbiAgRXhwb3J0LmV4dGVuZFByb3RvdHlwZSA9IGV4dGVuZFByb3RvdHlwZTtcbiAgRXhwb3J0LnJlc3RvcmVQcm90b3R5cGUgPSByZXN0b3JlUHJvdG90eXBlO1xuICBFeHBvcnQuVkVSU0lPTiA9IFZFUlNJT047XG4gIEV4cG9ydC5UTVBMX09QRU4gPSAne3snO1xuICBFeHBvcnQuVE1QTF9DTE9TRSA9ICd9fSc7XG4gIEV4cG9ydC5FTlRJVElFUyA9IEVOVElUSUVTO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8qIEV4cG9ydHNcbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAgJiYgdHlwZW9mIG1vZHVsZS5leHBvcnRzICE9PSAndW5kZWZpbmVkJykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gRXhwb3J0O1xuXG4gIH0gZWxzZSB7XG5cbiAgICBpZih0eXBlb2YgZGVmaW5lID09PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgZGVmaW5lKFtdLCBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIEV4cG9ydDtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB3aW5kb3cuUyA9IEV4cG9ydDtcbiAgICB9XG4gIH1cblxuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLyogM3JkIFBhcnR5IFByaXZhdGUgRnVuY3Rpb25zXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAvL2Zyb20gc3VnYXIuanNcbiAgZnVuY3Rpb24gbXVsdGlBcmdzKGFyZ3MsIGZuKSB7XG4gICAgdmFyIHJlc3VsdCA9IFtdLCBpO1xuICAgIGZvcihpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIHJlc3VsdC5wdXNoKGFyZ3NbaV0pO1xuICAgICAgaWYoZm4pIGZuLmNhbGwoYXJncywgYXJnc1tpXSwgaSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvL2Zyb20gdW5kZXJzY29yZS5zdHJpbmdcbiAgdmFyIGVzY2FwZUNoYXJzID0ge1xuICAgIGx0OiAnPCcsXG4gICAgZ3Q6ICc+JyxcbiAgICBxdW90OiAnXCInLFxuICAgIGFwb3M6IFwiJ1wiLFxuICAgIGFtcDogJyYnXG4gIH07XG5cbiAgLy9mcm9tIHVuZGVyc2NvcmUuc3RyaW5nXG4gIHZhciByZXZlcnNlZEVzY2FwZUNoYXJzID0ge307XG4gIGZvcih2YXIga2V5IGluIGVzY2FwZUNoYXJzKXsgcmV2ZXJzZWRFc2NhcGVDaGFyc1tlc2NhcGVDaGFyc1trZXldXSA9IGtleTsgfVxuXG4gIEVOVElUSUVTID0ge1xuICAgIFwiYW1wXCIgOiBcIiZcIixcbiAgICBcImd0XCIgOiBcIj5cIixcbiAgICBcImx0XCIgOiBcIjxcIixcbiAgICBcInF1b3RcIiA6IFwiXFxcIlwiLFxuICAgIFwiYXBvc1wiIDogXCInXCIsXG4gICAgXCJBRWxpZ1wiIDogMTk4LFxuICAgIFwiQWFjdXRlXCIgOiAxOTMsXG4gICAgXCJBY2lyY1wiIDogMTk0LFxuICAgIFwiQWdyYXZlXCIgOiAxOTIsXG4gICAgXCJBcmluZ1wiIDogMTk3LFxuICAgIFwiQXRpbGRlXCIgOiAxOTUsXG4gICAgXCJBdW1sXCIgOiAxOTYsXG4gICAgXCJDY2VkaWxcIiA6IDE5OSxcbiAgICBcIkVUSFwiIDogMjA4LFxuICAgIFwiRWFjdXRlXCIgOiAyMDEsXG4gICAgXCJFY2lyY1wiIDogMjAyLFxuICAgIFwiRWdyYXZlXCIgOiAyMDAsXG4gICAgXCJFdW1sXCIgOiAyMDMsXG4gICAgXCJJYWN1dGVcIiA6IDIwNSxcbiAgICBcIkljaXJjXCIgOiAyMDYsXG4gICAgXCJJZ3JhdmVcIiA6IDIwNCxcbiAgICBcIkl1bWxcIiA6IDIwNyxcbiAgICBcIk50aWxkZVwiIDogMjA5LFxuICAgIFwiT2FjdXRlXCIgOiAyMTEsXG4gICAgXCJPY2lyY1wiIDogMjEyLFxuICAgIFwiT2dyYXZlXCIgOiAyMTAsXG4gICAgXCJPc2xhc2hcIiA6IDIxNixcbiAgICBcIk90aWxkZVwiIDogMjEzLFxuICAgIFwiT3VtbFwiIDogMjE0LFxuICAgIFwiVEhPUk5cIiA6IDIyMixcbiAgICBcIlVhY3V0ZVwiIDogMjE4LFxuICAgIFwiVWNpcmNcIiA6IDIxOSxcbiAgICBcIlVncmF2ZVwiIDogMjE3LFxuICAgIFwiVXVtbFwiIDogMjIwLFxuICAgIFwiWWFjdXRlXCIgOiAyMjEsXG4gICAgXCJhYWN1dGVcIiA6IDIyNSxcbiAgICBcImFjaXJjXCIgOiAyMjYsXG4gICAgXCJhZWxpZ1wiIDogMjMwLFxuICAgIFwiYWdyYXZlXCIgOiAyMjQsXG4gICAgXCJhcmluZ1wiIDogMjI5LFxuICAgIFwiYXRpbGRlXCIgOiAyMjcsXG4gICAgXCJhdW1sXCIgOiAyMjgsXG4gICAgXCJjY2VkaWxcIiA6IDIzMSxcbiAgICBcImVhY3V0ZVwiIDogMjMzLFxuICAgIFwiZWNpcmNcIiA6IDIzNCxcbiAgICBcImVncmF2ZVwiIDogMjMyLFxuICAgIFwiZXRoXCIgOiAyNDAsXG4gICAgXCJldW1sXCIgOiAyMzUsXG4gICAgXCJpYWN1dGVcIiA6IDIzNyxcbiAgICBcImljaXJjXCIgOiAyMzgsXG4gICAgXCJpZ3JhdmVcIiA6IDIzNixcbiAgICBcIml1bWxcIiA6IDIzOSxcbiAgICBcIm50aWxkZVwiIDogMjQxLFxuICAgIFwib2FjdXRlXCIgOiAyNDMsXG4gICAgXCJvY2lyY1wiIDogMjQ0LFxuICAgIFwib2dyYXZlXCIgOiAyNDIsXG4gICAgXCJvc2xhc2hcIiA6IDI0OCxcbiAgICBcIm90aWxkZVwiIDogMjQ1LFxuICAgIFwib3VtbFwiIDogMjQ2LFxuICAgIFwic3psaWdcIiA6IDIyMyxcbiAgICBcInRob3JuXCIgOiAyNTQsXG4gICAgXCJ1YWN1dGVcIiA6IDI1MCxcbiAgICBcInVjaXJjXCIgOiAyNTEsXG4gICAgXCJ1Z3JhdmVcIiA6IDI0OSxcbiAgICBcInV1bWxcIiA6IDI1MixcbiAgICBcInlhY3V0ZVwiIDogMjUzLFxuICAgIFwieXVtbFwiIDogMjU1LFxuICAgIFwiY29weVwiIDogMTY5LFxuICAgIFwicmVnXCIgOiAxNzQsXG4gICAgXCJuYnNwXCIgOiAxNjAsXG4gICAgXCJpZXhjbFwiIDogMTYxLFxuICAgIFwiY2VudFwiIDogMTYyLFxuICAgIFwicG91bmRcIiA6IDE2MyxcbiAgICBcImN1cnJlblwiIDogMTY0LFxuICAgIFwieWVuXCIgOiAxNjUsXG4gICAgXCJicnZiYXJcIiA6IDE2NixcbiAgICBcInNlY3RcIiA6IDE2NyxcbiAgICBcInVtbFwiIDogMTY4LFxuICAgIFwib3JkZlwiIDogMTcwLFxuICAgIFwibGFxdW9cIiA6IDE3MSxcbiAgICBcIm5vdFwiIDogMTcyLFxuICAgIFwic2h5XCIgOiAxNzMsXG4gICAgXCJtYWNyXCIgOiAxNzUsXG4gICAgXCJkZWdcIiA6IDE3NixcbiAgICBcInBsdXNtblwiIDogMTc3LFxuICAgIFwic3VwMVwiIDogMTg1LFxuICAgIFwic3VwMlwiIDogMTc4LFxuICAgIFwic3VwM1wiIDogMTc5LFxuICAgIFwiYWN1dGVcIiA6IDE4MCxcbiAgICBcIm1pY3JvXCIgOiAxODEsXG4gICAgXCJwYXJhXCIgOiAxODIsXG4gICAgXCJtaWRkb3RcIiA6IDE4MyxcbiAgICBcImNlZGlsXCIgOiAxODQsXG4gICAgXCJvcmRtXCIgOiAxODYsXG4gICAgXCJyYXF1b1wiIDogMTg3LFxuICAgIFwiZnJhYzE0XCIgOiAxODgsXG4gICAgXCJmcmFjMTJcIiA6IDE4OSxcbiAgICBcImZyYWMzNFwiIDogMTkwLFxuICAgIFwiaXF1ZXN0XCIgOiAxOTEsXG4gICAgXCJ0aW1lc1wiIDogMjE1LFxuICAgIFwiZGl2aWRlXCIgOiAyNDcsXG4gICAgXCJPRWxpZztcIiA6IDMzOCxcbiAgICBcIm9lbGlnO1wiIDogMzM5LFxuICAgIFwiU2Nhcm9uO1wiIDogMzUyLFxuICAgIFwic2Nhcm9uO1wiIDogMzUzLFxuICAgIFwiWXVtbDtcIiA6IDM3NixcbiAgICBcImZub2Y7XCIgOiA0MDIsXG4gICAgXCJjaXJjO1wiIDogNzEwLFxuICAgIFwidGlsZGU7XCIgOiA3MzIsXG4gICAgXCJBbHBoYTtcIiA6IDkxMyxcbiAgICBcIkJldGE7XCIgOiA5MTQsXG4gICAgXCJHYW1tYTtcIiA6IDkxNSxcbiAgICBcIkRlbHRhO1wiIDogOTE2LFxuICAgIFwiRXBzaWxvbjtcIiA6IDkxNyxcbiAgICBcIlpldGE7XCIgOiA5MTgsXG4gICAgXCJFdGE7XCIgOiA5MTksXG4gICAgXCJUaGV0YTtcIiA6IDkyMCxcbiAgICBcIklvdGE7XCIgOiA5MjEsXG4gICAgXCJLYXBwYTtcIiA6IDkyMixcbiAgICBcIkxhbWJkYTtcIiA6IDkyMyxcbiAgICBcIk11O1wiIDogOTI0LFxuICAgIFwiTnU7XCIgOiA5MjUsXG4gICAgXCJYaTtcIiA6IDkyNixcbiAgICBcIk9taWNyb247XCIgOiA5MjcsXG4gICAgXCJQaTtcIiA6IDkyOCxcbiAgICBcIlJobztcIiA6IDkyOSxcbiAgICBcIlNpZ21hO1wiIDogOTMxLFxuICAgIFwiVGF1O1wiIDogOTMyLFxuICAgIFwiVXBzaWxvbjtcIiA6IDkzMyxcbiAgICBcIlBoaTtcIiA6IDkzNCxcbiAgICBcIkNoaTtcIiA6IDkzNSxcbiAgICBcIlBzaTtcIiA6IDkzNixcbiAgICBcIk9tZWdhO1wiIDogOTM3LFxuICAgIFwiYWxwaGE7XCIgOiA5NDUsXG4gICAgXCJiZXRhO1wiIDogOTQ2LFxuICAgIFwiZ2FtbWE7XCIgOiA5NDcsXG4gICAgXCJkZWx0YTtcIiA6IDk0OCxcbiAgICBcImVwc2lsb247XCIgOiA5NDksXG4gICAgXCJ6ZXRhO1wiIDogOTUwLFxuICAgIFwiZXRhO1wiIDogOTUxLFxuICAgIFwidGhldGE7XCIgOiA5NTIsXG4gICAgXCJpb3RhO1wiIDogOTUzLFxuICAgIFwia2FwcGE7XCIgOiA5NTQsXG4gICAgXCJsYW1iZGE7XCIgOiA5NTUsXG4gICAgXCJtdTtcIiA6IDk1NixcbiAgICBcIm51O1wiIDogOTU3LFxuICAgIFwieGk7XCIgOiA5NTgsXG4gICAgXCJvbWljcm9uO1wiIDogOTU5LFxuICAgIFwicGk7XCIgOiA5NjAsXG4gICAgXCJyaG87XCIgOiA5NjEsXG4gICAgXCJzaWdtYWY7XCIgOiA5NjIsXG4gICAgXCJzaWdtYTtcIiA6IDk2MyxcbiAgICBcInRhdTtcIiA6IDk2NCxcbiAgICBcInVwc2lsb247XCIgOiA5NjUsXG4gICAgXCJwaGk7XCIgOiA5NjYsXG4gICAgXCJjaGk7XCIgOiA5NjcsXG4gICAgXCJwc2k7XCIgOiA5NjgsXG4gICAgXCJvbWVnYTtcIiA6IDk2OSxcbiAgICBcInRoZXRhc3ltO1wiIDogOTc3LFxuICAgIFwidXBzaWg7XCIgOiA5NzgsXG4gICAgXCJwaXY7XCIgOiA5ODIsXG4gICAgXCJlbnNwO1wiIDogODE5NCxcbiAgICBcImVtc3A7XCIgOiA4MTk1LFxuICAgIFwidGhpbnNwO1wiIDogODIwMSxcbiAgICBcInp3bmo7XCIgOiA4MjA0LFxuICAgIFwiendqO1wiIDogODIwNSxcbiAgICBcImxybTtcIiA6IDgyMDYsXG4gICAgXCJybG07XCIgOiA4MjA3LFxuICAgIFwibmRhc2g7XCIgOiA4MjExLFxuICAgIFwibWRhc2g7XCIgOiA4MjEyLFxuICAgIFwibHNxdW87XCIgOiA4MjE2LFxuICAgIFwicnNxdW87XCIgOiA4MjE3LFxuICAgIFwic2JxdW87XCIgOiA4MjE4LFxuICAgIFwibGRxdW87XCIgOiA4MjIwLFxuICAgIFwicmRxdW87XCIgOiA4MjIxLFxuICAgIFwiYmRxdW87XCIgOiA4MjIyLFxuICAgIFwiZGFnZ2VyO1wiIDogODIyNCxcbiAgICBcIkRhZ2dlcjtcIiA6IDgyMjUsXG4gICAgXCJidWxsO1wiIDogODIyNixcbiAgICBcImhlbGxpcDtcIiA6IDgyMzAsXG4gICAgXCJwZXJtaWw7XCIgOiA4MjQwLFxuICAgIFwicHJpbWU7XCIgOiA4MjQyLFxuICAgIFwiUHJpbWU7XCIgOiA4MjQzLFxuICAgIFwibHNhcXVvO1wiIDogODI0OSxcbiAgICBcInJzYXF1bztcIiA6IDgyNTAsXG4gICAgXCJvbGluZTtcIiA6IDgyNTQsXG4gICAgXCJmcmFzbDtcIiA6IDgyNjAsXG4gICAgXCJldXJvO1wiIDogODM2NCxcbiAgICBcImltYWdlO1wiIDogODQ2NSxcbiAgICBcIndlaWVycDtcIiA6IDg0NzIsXG4gICAgXCJyZWFsO1wiIDogODQ3NixcbiAgICBcInRyYWRlO1wiIDogODQ4MixcbiAgICBcImFsZWZzeW07XCIgOiA4NTAxLFxuICAgIFwibGFycjtcIiA6IDg1OTIsXG4gICAgXCJ1YXJyO1wiIDogODU5MyxcbiAgICBcInJhcnI7XCIgOiA4NTk0LFxuICAgIFwiZGFycjtcIiA6IDg1OTUsXG4gICAgXCJoYXJyO1wiIDogODU5NixcbiAgICBcImNyYXJyO1wiIDogODYyOSxcbiAgICBcImxBcnI7XCIgOiA4NjU2LFxuICAgIFwidUFycjtcIiA6IDg2NTcsXG4gICAgXCJyQXJyO1wiIDogODY1OCxcbiAgICBcImRBcnI7XCIgOiA4NjU5LFxuICAgIFwiaEFycjtcIiA6IDg2NjAsXG4gICAgXCJmb3JhbGw7XCIgOiA4NzA0LFxuICAgIFwicGFydDtcIiA6IDg3MDYsXG4gICAgXCJleGlzdDtcIiA6IDg3MDcsXG4gICAgXCJlbXB0eTtcIiA6IDg3MDksXG4gICAgXCJuYWJsYTtcIiA6IDg3MTEsXG4gICAgXCJpc2luO1wiIDogODcxMixcbiAgICBcIm5vdGluO1wiIDogODcxMyxcbiAgICBcIm5pO1wiIDogODcxNSxcbiAgICBcInByb2Q7XCIgOiA4NzE5LFxuICAgIFwic3VtO1wiIDogODcyMSxcbiAgICBcIm1pbnVzO1wiIDogODcyMixcbiAgICBcImxvd2FzdDtcIiA6IDg3MjcsXG4gICAgXCJyYWRpYztcIiA6IDg3MzAsXG4gICAgXCJwcm9wO1wiIDogODczMyxcbiAgICBcImluZmluO1wiIDogODczNCxcbiAgICBcImFuZztcIiA6IDg3MzYsXG4gICAgXCJhbmQ7XCIgOiA4NzQzLFxuICAgIFwib3I7XCIgOiA4NzQ0LFxuICAgIFwiY2FwO1wiIDogODc0NSxcbiAgICBcImN1cDtcIiA6IDg3NDYsXG4gICAgXCJpbnQ7XCIgOiA4NzQ3LFxuICAgIFwidGhlcmU0O1wiIDogODc1NixcbiAgICBcInNpbTtcIiA6IDg3NjQsXG4gICAgXCJjb25nO1wiIDogODc3MyxcbiAgICBcImFzeW1wO1wiIDogODc3NixcbiAgICBcIm5lO1wiIDogODgwMCxcbiAgICBcImVxdWl2O1wiIDogODgwMSxcbiAgICBcImxlO1wiIDogODgwNCxcbiAgICBcImdlO1wiIDogODgwNSxcbiAgICBcInN1YjtcIiA6IDg4MzQsXG4gICAgXCJzdXA7XCIgOiA4ODM1LFxuICAgIFwibnN1YjtcIiA6IDg4MzYsXG4gICAgXCJzdWJlO1wiIDogODgzOCxcbiAgICBcInN1cGU7XCIgOiA4ODM5LFxuICAgIFwib3BsdXM7XCIgOiA4ODUzLFxuICAgIFwib3RpbWVzO1wiIDogODg1NSxcbiAgICBcInBlcnA7XCIgOiA4ODY5LFxuICAgIFwic2RvdDtcIiA6IDg5MDEsXG4gICAgXCJsY2VpbDtcIiA6IDg5NjgsXG4gICAgXCJyY2VpbDtcIiA6IDg5NjksXG4gICAgXCJsZmxvb3I7XCIgOiA4OTcwLFxuICAgIFwicmZsb29yO1wiIDogODk3MSxcbiAgICBcImxhbmc7XCIgOiA5MDAxLFxuICAgIFwicmFuZztcIiA6IDkwMDIsXG4gICAgXCJsb3o7XCIgOiA5Njc0LFxuICAgIFwic3BhZGVzO1wiIDogOTgyNCxcbiAgICBcImNsdWJzO1wiIDogOTgyNyxcbiAgICBcImhlYXJ0cztcIiA6IDk4MjksXG4gICAgXCJkaWFtcztcIiA6IDk4MzBcbiAgfVxuXG5cbn0pLmNhbGwodGhpcyk7XG4iLCJsZXQgcCA9IFN5bWJvbCgpLFxuXHRIdG1sID0ge1xuXHRwYXJzZUFsbChodG1sKSB7XG5cdFx0bGV0IGVsICAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHRlbC5pbm5lckhUTUwgPSBodG1sO1xuXHRcdHJldHVybiBBcnJheS5wcm90b3R5cGUuc2xpY2UuYXBwbHkoZWwuY2hpbGROb2Rlcyk7XG5cdH0sXG5cdHBhcnNlKGh0bWwpIHtcblx0XHRyZXR1cm4gdGhpcy5wYXJzZUFsbChodG1sKVswXTtcblx0fVxufTtcblxuY2xhc3MgRG9tU3RyZWFtIHtcblx0Y29uc3RydWN0b3Ioc291cmNlKSB7XG5cdFx0dGhpc1twXSA9IHNvdXJjZTtcblx0fVxuXHRhcHBseURpc3BsYXkoZWwsIGRpc3BsYXkgPSBcIlwiKSB7XG5cdFx0bGV0IG9sZCA9IGVsLnN0eWxlLmRpc3BsYXksXG5cdFx0XHTGkiA9ICh2KSA9PiBlbC5zdHlsZS5kaXNwbGF5ID0gdiA/IGRpc3BsYXkgOiBcIm5vbmVcIjtcblx0XHR0aGlzW3BdLnN1YnNjcmliZSjGkik7XG5cdFx0cmV0dXJuICgpID0+IHtcblx0XHRcdHRoaXNbcF0udW5zdWJzY3JpYmUoxpIpO1xuXHRcdFx0ZWwuc3R5bGUuZGlzcGxheSA9IG9sZDtcblx0XHR9O1xuXHR9XG5cdGFwcGx5VGV4dChlbCkge1xuXHRcdGxldCBvbGQgPSBlbC5pbm5lckhUTUwsXG5cdFx0XHTGkiA9ICh2KSA9PiBlbC5pbm5lckhUTUwgPSB2IHx8IFwiXCI7XG5cdFx0dGhpc1twXS5zdWJzY3JpYmUoxpIpO1xuXHRcdHJldHVybiAoKSA9PiB7XG5cdFx0XHR0aGlzW3BdLnVuc3Vic2NyaWJlKMaSKTtcblx0XHRcdMaSKG9sZCk7XG5cdFx0fTtcblx0fVxuXHRhcHBseUF0dHJpYnV0ZShuYW1lLCBlbCkge1xuXHRcdGxldCBvbGQgPSBlbC5nZXRBdHRyaWJ1dGUobmFtZSksXG5cdFx0XHTGkiA9ICh2KSA9PiB7XG5cdFx0XHRcdHYgPT0gbnVsbCA/IGVsLnJlbW92ZUF0dHJpYnV0ZShuYW1lKSA6IGVsLnNldEF0dHJpYnV0ZShuYW1lLCB2KTtcblx0XHRcdH1cblx0XHR0aGlzW3BdLnN1YnNjcmliZSjGkik7XG5cdFx0cmV0dXJuICgpID0+IHtcblx0XHRcdHRoaXNbcF0udW5zdWJzY3JpYmUoxpIpO1xuXHRcdFx0xpIob2xkKTtcblx0XHR9O1xuXHR9XG5cdGFwcGx5U3dhcENsYXNzKGVsLCBjbGFzc05hbWUpIHtcblx0XHRsZXQgaGFzID0gZWwuY2xhc3NMaXN0LmNvbnRhaW5zKGNsYXNzTmFtZSksXG5cdFx0XHTGkiA9ICh2KSA9PiB2ID8gZWwuY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpIDogZWwuY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWUpO1xuXHRcdHRoaXNbcF0uc3Vic2NyaWJlKMaSKTtcblx0XHRyZXR1cm4gKCkgPT4ge1xuXHRcdFx0dGhpc1twXS51bnN1YnNjcmliZSjGkik7XG5cdFx0XHTGkihoYXMpO1xuXHRcdH07XG5cdH1cbn1cblxubGV0IERvbSA9IHtcblx0c3RyZWFtKHNvdXJjZSkge1xuXHRcdHJldHVybiBuZXcgRG9tU3RyZWFtKHNvdXJjZSk7XG5cdH0sXG5cdHJlYWR5KMaSKSB7XG5cdFx0aWYoxpIpXG5cdFx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCDGkiwgZmFsc2UpO1xuXHRcdGVsc2Vcblx0XHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgcmVzb2x2ZSwgZmFsc2UpKTtcblx0fVxufVxuXG5sZXQgUXVlcnkgPSB7XG5cdGZpcnN0KHNlbGVjdG9yLCBjdHgpIHtcblx0XHRyZXR1cm4gKGN0eCB8fCBkb2N1bWVudCkucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XG5cdH0sXG5cblx0YWxsKHNlbGVjdG9yLCBjdHgpIHtcblx0XHRyZXR1cm4gKGN0eCB8fCBkb2N1bWVudCkucXVlcnkoc2VsZWN0b3IpO1xuXHR9XG59O1xuXG5leHBvcnQgeyBIdG1sLCBRdWVyeSwgRG9tIH07IiwibGV0IGltbWVkaWF0ZSA9IHJlcXVpcmUoJ2ltbWVkaWF0ZScpLFxuXHRUaW1lciA9IHtcblx0ZGVsYXkobXMsIMaSKSB7XG5cdFx0aWYoxpIpXG5cdFx0XHRyZXR1cm4gc2V0VGltZW91dCjGkiwgbXMpO1xuXHRcdGVsc2Vcblx0XHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCBtcykpO1xuXHR9LFxuXHRpbW1lZGlhdGUoxpIpIHtcblx0XHRpZijGkilcblx0XHRcdHJldHVybiBpbW1lZGlhdGUoxpIpO1xuXHRcdGVsc2Vcblx0XHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gaW1tZWRpYXRlKHJlc29sdmUpKTtcblx0fSxcblx0ZGVib3VuY2UoxpIsIG1zID0gMCkge1xuXHRcdGxldCB0aWQsIGNvbnRleHQsIGFyZ3MsIGxhdGVyxpI7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29udGV4dCA9IHRoaXM7XG5cdFx0XHRhcmdzID0gYXJndW1lbnRzO1xuXHRcdFx0bGF0ZXLGkiA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRpZiAoIWltbWVkaWF0ZSkgxpIuYXBwbHkoY29udGV4dCwgYXJncyk7XG5cdFx0XHR9O1xuXHRcdFx0Y2xlYXJUaW1lb3V0KHRpZCk7XG5cdFx0XHR0aWQgPSBzZXRUaW1lb3V0KGxhdGVyxpIsIG1zKTtcblx0XHR9O1xuXHR9LFxuXHRyZWR1Y2UoxpIsIG1zID0gMCkge1xuXHRcdGxldCB0aWQsIGNvbnRleHQsIGFyZ3M7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29udGV4dCA9IHRoaXM7XG5cdFx0XHRhcmdzID0gYXJndW1lbnRzO1xuXHRcdFx0aWYodGlkKSByZXR1cm47XG5cdFx0XHR0aWQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdFx0XHR0aWQgPSBudWxsO1xuXHRcdFx0XHTGki5hcHBseShjb250ZXh0LCBhcmdzKTtcblx0XHRcdH0sIG1zKTtcblx0XHR9O1xuXHR9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBUaW1lcjsiXX0=
