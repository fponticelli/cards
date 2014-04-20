(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
var __moduleName = "client/main";
var Stream = require('cards/model/stream').Stream;
var Fragment = require('./ui/fragment').Fragment;
var Properties = require('./ui/properties').Properties;
document.addEventListener("DOMContentLoaded", function() {
  var container = document.querySelector('.container'),
      number = new Fragment(),
      fragment = new Fragment();
  number.attachTo(container);
  fragment.attachTo(container);
  Properties.addText(fragment);
  Properties.addText(number);
  Properties.addValue(fragment, "String");
  fragment.properties.value = "Hey Franco";
  fragment.properties.value.feed(fragment.properties.text);
  Properties.addValue(number, "Float");
  Properties.addVisible(fragment);
  Stream.interval(750).reduce(true, (function(acc) {
    return !acc;
  })).feed(fragment.properties.visible);
  Properties.addStrong(fragment, true);
  Properties.addNumericFormat(number, "$ 0,0.00");
  Stream.interval(1000).reduce(0, (function(acc) {
    return acc + 3 / 7;
  })).feed(number.properties.value);
}, false);


},{"./ui/fragment":3,"./ui/properties":4,"cards/model/stream":6}],2:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<span class=\"fragment\"><span class=\"content\"></span></span>");;return buf.join("");
};
},{"jade/runtime":16}],3:[function(require,module,exports){
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
  this[p] = {};
  this[u] = {};
};
var $PropertyContainer = PropertyContainer;
($traceurRuntime.createClass)(PropertyContainer, {
  get data() {
    var out = {},
        properties = this.properties;
    for (var $key in properties) {
      try {
        throw undefined;
      } catch (key) {
        key = $key;
        if (properties[key] instanceof $PropertyContainer) {
          out[key] = properties[key].data;
        } else if (!properties[key].isDefault) {
          out[key] = properties[key].value;
        }
      }
    }
    return out;
  },
  set data(o) {
    var properties = this.properties;
    for (var $key in o) {
      try {
        throw undefined;
      } catch (key) {
        key = $key;
        if (!properties[key])
          continue;
        if (properties[key] instanceof $PropertyContainer) {
          properties[key].data = o[key];
        } else {
          properties[key].value = o[key];
        }
      }
    }
  },
  addPropertyValue: function(name, value, wire) {
    if (this[u][name])
      throw new Error(("A property " + name + " already exists"));
    Object.defineProperty(this[p], name, {
      configurable: true,
      enumerable: true,
      writeable: false,
      get: (function() {
        return value;
      }),
      set: (function(v) {
        return value.set(v);
      })
    });
    this[u][name] = wire.call(this.properties, value, this[$]);
  },
  addPropertyContainer: function(name, defaultField) {
    if (this[u][name])
      throw new Error(("A property " + name + " already exists"));
    var container = this[u][name] = new $PropertyContainer(),
        setter = (defaultField) ? function(v) {
          container[defaultField].set(v);
        } : function() {
          throw new Error('Property Container doesn\'t have a default field');
        };
    Object.defineProperty(this[p], name, {
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
      throw ("Object doesn't contain a property " + name);
    if (this[u][name] instanceof $PropertyContainer)
      this[u][name].removeProperties();
    else
      this[u][name]();
    delete this[u][name];
    delete this[p][name];
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
  get properties() {
    return this[p];
  },
  get parent() {
    return this[parent];
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
var $__1 = require('ui/dom'),
    Dom = $__1.Dom,
    Query = $__1.Query;
var $__1 = require('cards/model/value'),
    StringValue = $__1.StringValue,
    BoolValue = $__1.BoolValue,
    FloatValue = $__1.FloatValue;
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
      return Dom.stream(value).applyAttribute(attribute, content);
    });
  };
}
function createValue(type, a, b, c, d, e) {
  switch (type) {
    case "String":
      return new StringValue(a, b, c, d, e);
    case "Bool":
      return new BoolValue(a, b, c, d, e);
    case "Float":
      return new FloatValue(a, b, c, d, e);
  }
}
var p = {
  value: function(fragment, type) {
    for (var args = [],
        $__0 = 2; $__0 < arguments.length; $__0++)
      args[$__0 - 2] = arguments[$__0];
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
  tooltip: addAttributeFragment('tooltip', 'title')
};
var Properties = {
  addNumericFormat: function(fragment) {
    var defaultFormat = arguments[1] !== (void 0) ? arguments[1] : "";
    var value = fragment.properties.value,
        text = fragment.properties.text;
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
  removeFormat: function(fragment) {
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
  __esModule: true
};


},{"cards/model/value":7,"numeral":17,"string":18,"ui/dom":19}],5:[function(require,module,exports){
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
"use strict";
var __moduleName = "node_modules/cards/model/stream";
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
  interval: function(ms) {
    var stream = new PushSource();
    setInterval((function() {
      return stream.push();
    }), ms);
    return stream;
  },
  delay: function(ms) {
    var stream = new PushSource();
    setTimeout((function() {
      return stream.push();
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
  feed: function(source, destValue) {
    var ƒ = (function(v) {
      return destValue.set(v);
    });
    source.subscribe(ƒ);
    return (function() {
      return source.unsubscribe(ƒ);
    });
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


},{"ui/timer":20}],7:[function(require,module,exports){
"use strict";
var __moduleName = "node_modules/cards/model/value";
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
  },
  set: function(value) {
    if (value === this[_value])
      return;
    this[_value] = value;
    this[_update](value);
  },
  get value() {
    return this[_value];
  },
  set value(v) {
    this.set(v);
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
($traceurRuntime.createClass)(StringValue, {set: function(value) {
    $traceurRuntime.superCall(this, $StringValue.prototype, "set", [(value && value.toString && value.toString()) || (value && ("" + value)) || ""]);
  }}, {}, Value);
var BoolValue = function BoolValue() {
  var value = arguments[0] !== (void 0) ? arguments[0] : false;
  var defaultValue = arguments[1] !== (void 0) ? arguments[1] : value;
  $traceurRuntime.superCall(this, $BoolValue.prototype, "constructor", [value, defaultValue]);
};
var $BoolValue = BoolValue;
($traceurRuntime.createClass)(BoolValue, {
  set: function(value) {
    $traceurRuntime.superCall(this, $BoolValue.prototype, "set", [!!value]);
  },
  toggle: function() {
    this.set(!this.value);
  }
}, {}, Value);
var FloatValue = function FloatValue() {
  var value = arguments[0] !== (void 0) ? arguments[0] : 0.0;
  var defaultValue = arguments[1] !== (void 0) ? arguments[1] : value;
  $traceurRuntime.superCall(this, $FloatValue.prototype, "constructor", [value, defaultValue]);
};
var $FloatValue = FloatValue;
($traceurRuntime.createClass)(FloatValue, {
  set: function(value) {
    $traceurRuntime.superCall(this, $FloatValue.prototype, "set", [+new Number(value)]);
  },
  asInt: function() {
    return Stream.map(this, (function(v) {
      return Math.round(v);
    }));
  }
}, {}, Value);
var defaultDate = new Date(null);
var DateValue = function DateValue() {
  var value = arguments[0] !== (void 0) ? arguments[0] : defaultDate;
  var defaultValue = arguments[1] !== (void 0) ? arguments[1] : value;
  $traceurRuntime.superCall(this, $DateValue.prototype, "constructor", [value, defaultValue]);
};
var $DateValue = DateValue;
($traceurRuntime.createClass)(DateValue, {set: function(value) {
    $traceurRuntime.superCall(this, $DateValue.prototype, "set", [new Date(value)]);
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


},{"./stream":6}],8:[function(require,module,exports){
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
},{"/Users/francoponticelli/projects/cards/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":5}],9:[function(require,module,exports){
"use strict";
exports.test = function () {
    return false;
};
},{}],10:[function(require,module,exports){
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

},{"./messageChannel":11,"./mutation":12,"./nextTick":9,"./postMessage":13,"./stateChange":14,"./timeout":15}],11:[function(require,module,exports){
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
},{}],12:[function(require,module,exports){
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
},{}],13:[function(require,module,exports){
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
},{}],14:[function(require,module,exports){
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
},{}],15:[function(require,module,exports){
"use strict";
exports.test = function () {
    return true;
};

exports.install = function (t) {
    return function () {
        setTimeout(t, 0);
    };
};
},{}],16:[function(require,module,exports){
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
},{}],17:[function(require,module,exports){
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

},{}],18:[function(require,module,exports){
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
var p = Symbol();
var Html = {
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
          return el.innerHTML = v;
        });
    this[p].subscribe(ƒ);
    return (function() {
      $__0[p].unsubscribe(ƒ);
      el.innerHTML = old;
    });
  },
  applyAttribute: function(name, el) {
    var $__0 = this;
    var old = el.getAttribute(name),
        ƒ = (function(v) {
          return el.setAttribute(name, v);
        });
    this[p].subscribe(ƒ);
    return (function() {
      $__0[p].unsubscribe(ƒ);
      if (old !== undefined)
        el.setAttribute(name, old);
      else
        el.removeAttribute(name);
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
      if (has)
        el.classList.add(className);
      else
        el.classList.remove(className);
    });
  }
}, {});
var Dom = {
  swapClass: function(el, className) {
    return (function(value) {
      return value ? el.classList.add(className) : el.classList.remove(className);
    });
  },
  stream: function(source) {
    return new DomStream(source);
  }
};
var StreamDom = {};
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
var immediate = require('immediate');
var Timer = {
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


},{"immediate":10}]},{},[8,1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvZnJhbmNvcG9udGljZWxsaS9wcm9qZWN0cy9jYXJkcy9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvY2xpZW50L21haW4uanMiLCIvVXNlcnMvZnJhbmNvcG9udGljZWxsaS9wcm9qZWN0cy9jYXJkcy9jbGllbnQvdWkvZnJhZ21lbnQuamFkZSIsIi9Vc2Vycy9mcmFuY29wb250aWNlbGxpL3Byb2plY3RzL2NhcmRzL2NsaWVudC91aS9mcmFnbWVudC5qcyIsIi9Vc2Vycy9mcmFuY29wb250aWNlbGxpL3Byb2plY3RzL2NhcmRzL2NsaWVudC91aS9wcm9wZXJ0aWVzLmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2luc2VydC1tb2R1bGUtZ2xvYmFscy9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL2NhcmRzL21vZGVsL3N0cmVhbS5qcyIsIi9Vc2Vycy9mcmFuY29wb250aWNlbGxpL3Byb2plY3RzL2NhcmRzL25vZGVfbW9kdWxlcy9jYXJkcy9tb2RlbC92YWx1ZS5qcyIsIi9Vc2Vycy9mcmFuY29wb250aWNlbGxpL3Byb2plY3RzL2NhcmRzL25vZGVfbW9kdWxlcy9lczZpZnkvbm9kZV9tb2R1bGVzL3RyYWNldXIvYmluL3RyYWNldXItcnVudGltZS5qcyIsIi9Vc2Vycy9mcmFuY29wb250aWNlbGxpL3Byb2plY3RzL2NhcmRzL25vZGVfbW9kdWxlcy9pbW1lZGlhdGUvbGliL2Zha2VOZXh0VGljay5qcyIsIi9Vc2Vycy9mcmFuY29wb250aWNlbGxpL3Byb2plY3RzL2NhcmRzL25vZGVfbW9kdWxlcy9pbW1lZGlhdGUvbGliL2luZGV4LmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL2ltbWVkaWF0ZS9saWIvbWVzc2FnZUNoYW5uZWwuanMiLCIvVXNlcnMvZnJhbmNvcG9udGljZWxsaS9wcm9qZWN0cy9jYXJkcy9ub2RlX21vZHVsZXMvaW1tZWRpYXRlL2xpYi9tdXRhdGlvbi5qcyIsIi9Vc2Vycy9mcmFuY29wb250aWNlbGxpL3Byb2plY3RzL2NhcmRzL25vZGVfbW9kdWxlcy9pbW1lZGlhdGUvbGliL3Bvc3RNZXNzYWdlLmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL2ltbWVkaWF0ZS9saWIvc3RhdGVDaGFuZ2UuanMiLCIvVXNlcnMvZnJhbmNvcG9udGljZWxsaS9wcm9qZWN0cy9jYXJkcy9ub2RlX21vZHVsZXMvaW1tZWRpYXRlL2xpYi90aW1lb3V0LmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL2phZGUvcnVudGltZS5qcyIsIi9Vc2Vycy9mcmFuY29wb250aWNlbGxpL3Byb2plY3RzL2NhcmRzL25vZGVfbW9kdWxlcy9udW1lcmFsL251bWVyYWwuanMiLCIvVXNlcnMvZnJhbmNvcG9udGljZWxsaS9wcm9qZWN0cy9jYXJkcy9ub2RlX21vZHVsZXMvc3RyaW5nL2xpYi9zdHJpbmcuanMiLCIvVXNlcnMvZnJhbmNvcG9udGljZWxsaS9wcm9qZWN0cy9jYXJkcy9ub2RlX21vZHVsZXMvdWkvZG9tLmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL3VpL3RpbWVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7O3FCQUF1QixvQkFBb0I7dUJBQ2xCLGVBQWU7eUJBQ2IsaUJBQWlCO0FBRTVDLENBQUEsT0FBUSxpQkFB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QUFVLEdBQUksS0FBSSxDQUFDLEtBQUssQ0FBQyxHQUFFO0dBQzNCLE1BTjZCLE1BQUs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Q0FPbkM7OztBQ2hGRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzl6Q0E7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2cUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwOUJBOztHQUFJLENBQUEsQ0FBQyxFQUFHLENBQUEsTUFBTSxFQUFFO1VBRUw7Q0FDVixTQUFR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QixDQUFBLFVBQUcsRUFBRyxLQUFJLENBQUM7QUFDWCxDQUFBLFFBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBRSxLQUFJLENBQUMsQ0FBQztPQUN2QixDQUFFLEdBQUUsQ0FBQyxDQUFDO0tBQ1AsQ0FBQztHQUNGO0NBQ0Q7Z0JBRWMsTUFBSzs7Ozs7OztDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgeyBTdHJlYW0gfSBmcm9tICdjYXJkcy9tb2RlbC9zdHJlYW0nO1xuaW1wb3J0IHsgRnJhZ21lbnQgfSBmcm9tICcuL3VpL2ZyYWdtZW50JztcbmltcG9ydCB7IFByb3BlcnRpZXMgfSBmcm9tICcuL3VpL3Byb3BlcnRpZXMnO1xuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBmdW5jdGlvbigpIHtcblx0bGV0IGNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb250YWluZXInKSxcblx0XHRudW1iZXIgICAgPSBuZXcgRnJhZ21lbnQoKSxcblx0XHRmcmFnbWVudCAgPSBuZXcgRnJhZ21lbnQoKTtcblxuXHRudW1iZXIuYXR0YWNoVG8oY29udGFpbmVyKTtcblx0ZnJhZ21lbnQuYXR0YWNoVG8oY29udGFpbmVyKTtcblxuXHQvLyBhZGQgdGV4dCBwcm9wZXJ0eSBhbmQgcmVuZGVyaW5nXG5cdFByb3BlcnRpZXMuYWRkVGV4dChmcmFnbWVudCk7XG5cdFByb3BlcnRpZXMuYWRkVGV4dChudW1iZXIpO1xuXG5cdC8vIGFkZCBhIHZhbHVlXG5cdFByb3BlcnRpZXMuYWRkVmFsdWUoZnJhZ21lbnQsIFwiU3RyaW5nXCIpO1xuXHRmcmFnbWVudC5wcm9wZXJ0aWVzLnZhbHVlID0gXCJIZXkgRnJhbmNvXCI7XG5cdGZyYWdtZW50LnByb3BlcnRpZXMudmFsdWUuZmVlZChmcmFnbWVudC5wcm9wZXJ0aWVzLnRleHQpO1xuXG5cdFByb3BlcnRpZXMuYWRkVmFsdWUobnVtYmVyLCBcIkZsb2F0XCIpO1xuXG5cdC8vIG1ha2UgaXQgYmxpbmtcblx0UHJvcGVydGllcy5hZGRWaXNpYmxlKGZyYWdtZW50KTtcblx0U3RyZWFtLmludGVydmFsKDc1MClcblx0XHQucmVkdWNlKHRydWUsIChhY2MpID0+ICFhY2MpXG5cdFx0LmZlZWQoZnJhZ21lbnQucHJvcGVydGllcy52aXNpYmxlKTtcblxuXHQvLyBtYWtlIGJvbGRcblx0UHJvcGVydGllcy5hZGRTdHJvbmcoZnJhZ21lbnQsIHRydWUpO1xuXG5cdC8vIGFkZCBmb3JtYXRcblx0UHJvcGVydGllcy5hZGROdW1lcmljRm9ybWF0KG51bWJlciwgXCIkIDAsMC4wMFwiKTtcblxuXHQvLyB1cGRhdGUgbnVtYmVyXG5cdFN0cmVhbS5pbnRlcnZhbCgxMDAwKVxuXHRcdC5yZWR1Y2UoMCwgKGFjYykgPT4gYWNjICsgMy83KVxuXHRcdC5mZWVkKG51bWJlci5wcm9wZXJ0aWVzLnZhbHVlKTtcbn0sIGZhbHNlKTtcblxuIiwidmFyIGphZGUgPSByZXF1aXJlKFwiamFkZS9ydW50aW1lXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge1xudmFyIGJ1ZiA9IFtdO1xudmFyIGphZGVfbWl4aW5zID0ge307XG52YXIgamFkZV9pbnRlcnA7XG5cbmJ1Zi5wdXNoKFwiPHNwYW4gY2xhc3M9XFxcImZyYWdtZW50XFxcIj48c3BhbiBjbGFzcz1cXFwiY29udGVudFxcXCI+PC9zcGFuPjwvc3Bhbj5cIik7O3JldHVybiBidWYuam9pbihcIlwiKTtcbn07IiwiaW1wb3J0IHsgSHRtbCB9IGZyb20gJ3VpL2RvbSc7XG5cbmxldCB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4vZnJhZ21lbnQuamFkZScpKCksXG5cdCQgPSBTeW1ib2woKSxcblx0cCA9IFN5bWJvbCgpLFxuXHR1ID0gU3ltYm9sKCksXG5cdHBhcmVudCA9IFN5bWJvbCgpO1xuXG4vLyBUT0RPLCBhZGQgcHJvcGVydGllcyBpdGVyYXRvclxuY2xhc3MgUHJvcGVydHlDb250YWluZXIge1xuXHRjb25zdHJ1Y3RvcihwYXJlbnQpIHtcblx0XHR0aGlzW3BhcmVudF0gPSBwYXJlbnQ7XG5cdFx0dGhpc1twXSA9IHt9O1xuXHRcdHRoaXNbdV0gPSB7fTtcblx0fVxuXG5cdGdldCBkYXRhKCkge1xuXHRcdGxldCBvdXQgPSB7fSxcblx0XHRcdHByb3BlcnRpZXMgPSB0aGlzLnByb3BlcnRpZXM7XG5cdFx0Zm9yKGxldCBrZXkgaW4gcHJvcGVydGllcykge1xuXHRcdFx0aWYocHJvcGVydGllc1trZXldIGluc3RhbmNlb2YgUHJvcGVydHlDb250YWluZXIpIHtcblx0XHRcdFx0b3V0W2tleV0gPSBwcm9wZXJ0aWVzW2tleV0uZGF0YTtcblx0XHRcdH0gZWxzZSBpZighcHJvcGVydGllc1trZXldLmlzRGVmYXVsdCkge1xuXHRcdFx0XHRvdXRba2V5XSA9IHByb3BlcnRpZXNba2V5XS52YWx1ZTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIG91dDtcblx0fVxuXG5cdHNldCBkYXRhKG8pIHtcblx0XHRsZXQgcHJvcGVydGllcyA9IHRoaXMucHJvcGVydGllcztcblx0XHRmb3IobGV0IGtleSBpbiBvKSB7XG5cdFx0XHRpZighcHJvcGVydGllc1trZXldKVxuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdGlmKHByb3BlcnRpZXNba2V5XSBpbnN0YW5jZW9mIFByb3BlcnR5Q29udGFpbmVyKSB7XG5cdFx0XHRcdHByb3BlcnRpZXNba2V5XS5kYXRhID0gb1trZXldO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cHJvcGVydGllc1trZXldLnZhbHVlID0gb1trZXldO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdGFkZFByb3BlcnR5VmFsdWUobmFtZSwgdmFsdWUsIHdpcmUpIHtcblx0XHRpZih0aGlzW3VdW25hbWVdKVxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBBIHByb3BlcnR5ICR7bmFtZX0gYWxyZWFkeSBleGlzdHNgKTtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpc1twXSwgbmFtZSwge1xuXHRcdFx0Y29uZmlndXJhYmxlOiB0cnVlLFxuXHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcblx0XHRcdHdyaXRlYWJsZTogZmFsc2UsXG5cdFx0XHRnZXQ6ICgpID0+IHZhbHVlLFxuXHRcdFx0c2V0OiAodikgPT4gdmFsdWUuc2V0KHYpXG5cdFx0fSk7XG5cdFx0dGhpc1t1XVtuYW1lXSA9IHdpcmUuY2FsbCh0aGlzLnByb3BlcnRpZXMsIHZhbHVlLCB0aGlzWyRdKTtcblx0fVxuXG5cdGFkZFByb3BlcnR5Q29udGFpbmVyKG5hbWUsIGRlZmF1bHRGaWVsZCkge1xuXHRcdGlmKHRoaXNbdV1bbmFtZV0pXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEEgcHJvcGVydHkgJHtuYW1lfSBhbHJlYWR5IGV4aXN0c2ApO1xuXHRcdGxldCBjb250YWluZXIgPSB0aGlzW3VdW25hbWVdID0gbmV3IFByb3BlcnR5Q29udGFpbmVyKCksXG5cdFx0XHRzZXR0ZXIgPSAoZGVmYXVsdEZpZWxkKSA/XG5cdFx0XHRcdGZ1bmN0aW9uKHYpIHsgY29udGFpbmVyW2RlZmF1bHRGaWVsZF0uc2V0KHYpOyB9IDpcblx0XHRcdFx0ZnVuY3Rpb24oKSB7IHRocm93IG5ldyBFcnJvcignUHJvcGVydHkgQ29udGFpbmVyIGRvZXNuXFwndCBoYXZlIGEgZGVmYXVsdCBmaWVsZCcpOyB9O1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzW3BdLCBuYW1lLCB7XG5cdFx0XHRjb25maWd1cmFibGU6IHRydWUsXG5cdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuXHRcdFx0d3JpdGVhYmxlOiBmYWxzZSxcblx0XHRcdGdldDogKCkgPT4gY29udGFpbmVyLFxuXHRcdFx0c2V0OiBzZXR0ZXJcblx0XHR9KTtcblx0XHRyZXR1cm4gY29udGFpbmVyO1xuXHR9XG5cblx0cmVtb3ZlUHJvcGVydHkobmFtZSkge1xuXHRcdGlmKCF0aGlzW3VdW25hbWVdKVxuXHRcdFx0dGhyb3cgYE9iamVjdCBkb2Vzbid0IGNvbnRhaW4gYSBwcm9wZXJ0eSAke25hbWV9YDtcblx0XHRpZih0aGlzW3VdW25hbWVdIGluc3RhbmNlb2YgUHJvcGVydHlDb250YWluZXIpXG5cdFx0XHR0aGlzW3VdW25hbWVdLnJlbW92ZVByb3BlcnRpZXMoKTtcblx0XHRlbHNlXG5cdFx0XHR0aGlzW3VdW25hbWVdKCk7XG5cdFx0ZGVsZXRlIHRoaXNbdV1bbmFtZV07XG5cdFx0ZGVsZXRlIHRoaXNbcF1bbmFtZV07XG5cdH1cblxuXHRyZW1vdmVQcm9wZXJ0aWVzKCkge1xuXHRcdGZvcihsZXQga2V5IGluIHRoaXNbdV0pXG5cdFx0XHR0aGlzLnJlbW92ZVByb3BlcnR5KGtleSk7XG5cdH1cblxuXHRnZXQgcHJvcGVydGllcygpIHtcblx0XHRyZXR1cm4gdGhpc1twXTtcblx0fVxuXG5cdGdldCBwYXJlbnQoKSB7XG5cdFx0cmV0dXJuIHRoaXNbcGFyZW50XTtcblx0fVxufVxuXG5jbGFzcyBGcmFnbWVudCBleHRlbmRzIFByb3BlcnR5Q29udGFpbmVyIHtcblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0dGhpc1skXSA9IEh0bWwucGFyc2UodGVtcGxhdGUpO1xuXHRcdHRoaXNbcF0gPSB7fTtcblx0XHR0aGlzW3VdID0ge307XG5cdH1cblxuXHRhdHRhY2hUbyhjb250YWluZXIpIHtcblx0XHRjb250YWluZXIuYXBwZW5kQ2hpbGQodGhpc1skXSk7XG5cdH1cblxuXHRkZXRhY2goKSB7XG5cdFx0dGhpc1skXS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRoaXNbJF0pO1xuXHR9XG59XG5cblxuXG5leHBvcnQgeyBGcmFnbWVudCwgUHJvcGVydHlDb250YWluZXIsICQsIHAgfTsiLCJsZXQgc3RyaW5nICA9IHJlcXVpcmUoJ3N0cmluZycpLFxuXHRudW1lcmFsID0gcmVxdWlyZSgnbnVtZXJhbCcpO1xuXG5pbXBvcnQgeyBEb20sIFF1ZXJ5IH0gZnJvbSAndWkvZG9tJztcbmltcG9ydCB7IFN0cmluZ1ZhbHVlLCBCb29sVmFsdWUsIEZsb2F0VmFsdWUgfSBmcm9tICdjYXJkcy9tb2RlbC92YWx1ZSc7XG5cbmZ1bmN0aW9uIGFkZFN3YXBDbGFzc0ZyYWdtZW50KG5hbWUsIGNsYXNzTmFtZSA9IG5hbWUpIHtcblx0cmV0dXJuIGZ1bmN0aW9uKGZyYWdtZW50LCBkZWZhdWx0VmFsdWUgPSBmYWxzZSkge1xuXHRcdGZyYWdtZW50LmFkZFByb3BlcnR5VmFsdWUobmFtZSwgbmV3IEJvb2xWYWx1ZShkZWZhdWx0VmFsdWUpLCBmdW5jdGlvbih2YWx1ZSwgZWwpIHtcblx0XHRcdHJldHVybiBEb20uc3RyZWFtKHZhbHVlKS5hcHBseVN3YXBDbGFzcyhlbCwgY2xhc3NOYW1lKTtcblx0XHR9KTtcblx0fTtcbn1cblxuZnVuY3Rpb24gYWRkQXR0cmlidXRlRnJhZ21lbnQobmFtZSwgYXR0cmlidXRlKSB7XG5cdHJldHVybiBmdW5jdGlvbihmcmFnbWVudCwgdGV4dCA9IFwiXCIpIHtcblx0XHRmcmFnbWVudC5hZGRQcm9wZXJ0eVZhbHVlKG5hbWUsIG5ldyBTdHJpbmdWYWx1ZSh0ZXh0KSwgZnVuY3Rpb24odmFsdWUsIGVsKSB7XG5cdFx0XHRyZXR1cm4gRG9tLnN0cmVhbSh2YWx1ZSkuYXBwbHlBdHRyaWJ1dGUoYXR0cmlidXRlLCBjb250ZW50KTtcblx0XHR9KTtcblx0fVxufVxuXG5mdW5jdGlvbiBjcmVhdGVWYWx1ZSh0eXBlLCBhLCBiLCBjLCBkLCBlKSB7XG5cdHN3aXRjaCh0eXBlKSB7XG5cdFx0Y2FzZSBcIlN0cmluZ1wiOlxuXHRcdFx0cmV0dXJuIG5ldyBTdHJpbmdWYWx1ZShhLCBiLCBjLCBkLCBlKTtcblx0XHRjYXNlIFwiQm9vbFwiOlxuXHRcdFx0cmV0dXJuIG5ldyBCb29sVmFsdWUoYSwgYiwgYywgZCwgZSk7XG5cdFx0Y2FzZSBcIkZsb2F0XCI6XG5cdFx0XHRyZXR1cm4gbmV3IEZsb2F0VmFsdWUoYSwgYiwgYywgZCwgZSk7XG5cdH1cbn1cblxuLy8gVE9ETyBhZGQgbGlua1xubGV0IHAgPSB7XG5cdHZhbHVlOiBmdW5jdGlvbihmcmFnbWVudCwgdHlwZSwgLi4uYXJncykge1xuXHRcdGxldCB2YWx1ZSA9IHR5cGVvZiB0eXBlID09PSBcInN0cmluZ1wiID8gY3JlYXRlVmFsdWUodHlwZSwgLi4uYXJncykgOiB0eXBlO1xuXHRcdGZyYWdtZW50LmFkZFByb3BlcnR5VmFsdWUoXCJ2YWx1ZVwiLCB2YWx1ZSwgZnVuY3Rpb24odmFsdWUsIGVsKSB7XG5cdFx0XHRyZXR1cm4gKCkgPT4ge307XG5cdFx0fSk7XG5cdH0sXG5cdHRleHQ6IGZ1bmN0aW9uKGZyYWdtZW50LCB0ZXh0ID0gXCJcIikge1xuXHRcdGZyYWdtZW50LmFkZFByb3BlcnR5VmFsdWUoXCJ0ZXh0XCIsIG5ldyBTdHJpbmdWYWx1ZSh0ZXh0KSwgZnVuY3Rpb24odmFsdWUsIGVsKSB7XG5cdFx0XHRsZXQgY29udGVudCA9IFF1ZXJ5LmZpcnN0KCcuY29udGVudCcsIGVsKTtcblx0XHRcdHJldHVybiBEb20uc3RyZWFtKHZhbHVlKS5hcHBseVRleHQoY29udGVudCk7XG5cdFx0fSk7XG5cdH0sXG5cdHZpc2libGU6IGZ1bmN0aW9uKGZyYWdtZW50LCBkZWZhdWx0VmFsdWUgPSB0cnVlKSB7XG5cdFx0ZnJhZ21lbnQuYWRkUHJvcGVydHlWYWx1ZShcInZpc2libGVcIiwgbmV3IEJvb2xWYWx1ZShkZWZhdWx0VmFsdWUpLCBmdW5jdGlvbih2YWx1ZSwgZWwpIHtcblx0XHRcdHJldHVybiBEb20uc3RyZWFtKHZhbHVlKS5hcHBseURpc3BsYXkoZWwpO1xuXHRcdH0pO1xuXHR9LFxuXHRzdHJvbmc6IGFkZFN3YXBDbGFzc0ZyYWdtZW50KCdzdHJvbmcnKSxcblx0ZW1waGFzaXM6IGFkZFN3YXBDbGFzc0ZyYWdtZW50KCdlbXBoYXNpcycpLFxuXHRzdHJpa2U6IGFkZFN3YXBDbGFzc0ZyYWdtZW50KCdzdHJpa2UnKSxcblx0dG9vbHRpcDogYWRkQXR0cmlidXRlRnJhZ21lbnQoJ3Rvb2x0aXAnLCAndGl0bGUnKVxufTtcblxubGV0IFByb3BlcnRpZXMgPSB7XG5cdGFkZE51bWVyaWNGb3JtYXQoZnJhZ21lbnQsIGRlZmF1bHRGb3JtYXQgPSBcIlwiKSB7XG5cdFx0bGV0IHZhbHVlID0gZnJhZ21lbnQucHJvcGVydGllcy52YWx1ZSxcblx0XHRcdHRleHQgID0gZnJhZ21lbnQucHJvcGVydGllcy50ZXh0O1xuXHRcdGlmKCF2YWx1ZSkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiJ2Zvcm1hdCcgcmVxdWlyZXMgdGhlIHByb3BlcnR5ICd2YWx1ZSdcIik7XG5cdFx0fVxuXHRcdGlmKCF0ZXh0KSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCInZm9ybWF0JyByZXF1aXJlcyB0aGUgcHJvcGVydHkgJ3RleHQnXCIpO1xuXHRcdH1cblx0XHRmcmFnbWVudC5hZGRQcm9wZXJ0eVZhbHVlKFwiZm9ybWF0XCIsIG5ldyBTdHJpbmdWYWx1ZShkZWZhdWx0Rm9ybWF0KSwgZnVuY3Rpb24oZm9ybWF0KSB7XG5cdFx0XHRsZXQgc3RyZWFtID0gdmFsdWUuemlwKGZvcm1hdCk7XG5cdFx0XHRzdHJlYW0uc3ByZWFkKCh2YWx1ZSwgZm9ybWF0KSA9PiB7XG5cdFx0XHRcdFx0aWYoZm9ybWF0ID09PSBcIlwiKSB7XG5cdFx0XHRcdFx0XHRmb3JtYXQgPSBNYXRoLmZsb29yKHZhbHVlKSA9PT0gdmFsdWUgPyBcIjAsMFwiIDogXCIwLDAuMDAwXCI7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHRleHQudmFsdWUgPSBudW1lcmFsKHZhbHVlKS5mb3JtYXQoZm9ybWF0KTtcblx0XHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gc3RyZWFtLmNhbmNlbC5iaW5kKHN0cmVhbSk7XG5cdFx0fSk7XG5cdH0sXG5cdHJlbW92ZUZvcm1hdChmcmFnbWVudCkge1xuXHRcdGZyYWdtZW50LnJlbW92ZVByb3BlcnR5KCdmb3JtYXQnKTtcblx0fVxufVxuXG5mb3IobGV0IG5hbWUgaW4gcCkge1xuXHRsZXQgY2FwICAgICAgID0gc3RyaW5nKG5hbWUpLmNhcGl0YWxpemUoKS5zLFxuXHRcdGtleVJlbW92ZSA9ICdyZW1vdmUnICsgY2FwLFxuXHRcdGtleUFkZCAgICA9ICdhZGQnICsgY2FwO1xuXHRQcm9wZXJ0aWVzW2tleUFkZF0gPSBwW25hbWVdO1xuXHRQcm9wZXJ0aWVzW2tleVJlbW92ZV0gPSBmdW5jdGlvbihmcmFnbWVudCkgeyBmcmFnbWVudC5yZW1vdmVQcm9wZXJ0eShuYW1lKTsgfTtcbn1cblxuZXhwb3J0IHsgUHJvcGVydGllcyB9OyIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxuXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbnByb2Nlc3MubmV4dFRpY2sgPSAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBjYW5TZXRJbW1lZGlhdGUgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJ1xuICAgICYmIHdpbmRvdy5zZXRJbW1lZGlhdGU7XG4gICAgdmFyIGNhblBvc3QgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJ1xuICAgICYmIHdpbmRvdy5wb3N0TWVzc2FnZSAmJiB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lclxuICAgIDtcblxuICAgIGlmIChjYW5TZXRJbW1lZGlhdGUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChmKSB7IHJldHVybiB3aW5kb3cuc2V0SW1tZWRpYXRlKGYpIH07XG4gICAgfVxuXG4gICAgaWYgKGNhblBvc3QpIHtcbiAgICAgICAgdmFyIHF1ZXVlID0gW107XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgZnVuY3Rpb24gKGV2KSB7XG4gICAgICAgICAgICB2YXIgc291cmNlID0gZXYuc291cmNlO1xuICAgICAgICAgICAgaWYgKChzb3VyY2UgPT09IHdpbmRvdyB8fCBzb3VyY2UgPT09IG51bGwpICYmIGV2LmRhdGEgPT09ICdwcm9jZXNzLXRpY2snKSB7XG4gICAgICAgICAgICAgICAgZXYuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgaWYgKHF1ZXVlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZuID0gcXVldWUuc2hpZnQoKTtcbiAgICAgICAgICAgICAgICAgICAgZm4oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHRydWUpO1xuXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiBuZXh0VGljayhmbikge1xuICAgICAgICAgICAgcXVldWUucHVzaChmbik7XG4gICAgICAgICAgICB3aW5kb3cucG9zdE1lc3NhZ2UoJ3Byb2Nlc3MtdGljaycsICcqJyk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIG5leHRUaWNrKGZuKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZm4sIDApO1xuICAgIH07XG59KSgpO1xuXG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufVxuXG4vLyBUT0RPKHNodHlsbWFuKVxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG4iLCJpbXBvcnQgVGltZXIgZnJvbSAndWkvdGltZXInO1xuXG5sZXQgX2xpc3RlbmVycyA9IFN5bWJvbCgpO1xuXG5jbGFzcyBTb3VyY2Uge1xuXHRjb25zdHJ1Y3RvcihjYWxsYmFjaykge1xuXHRcdC8vIFRPRE8sIHJlcGxhY2Ugd2l0aCBNYXAgb3IgV2Vha01hcD9cblx0XHR0aGlzW19saXN0ZW5lcnNdID0gW107XG5cdFx0Ly8gVE9ETywgZGVsYXkgYnV0IGRvbid0IHJlZHVjZVxuXHRcdGxldCBzaW5rID0gKHZhbHVlKSA9PiB7XG5cdFx0XHRUaW1lci5pbW1lZGlhdGUoKCkgPT4ge1xuXHRcdFx0XHR0aGlzW19saXN0ZW5lcnNdLm1hcCjGkiA9PiDGkih2YWx1ZSkpO1xuXHRcdFx0fSk7XG5cdFx0fTtcblx0XHRjYWxsYmFjayhzaW5rKTtcblx0fVxuXHRjYW5jZWwoKSB7XG5cdFx0dGhpc1tfbGlzdGVuZXJzXSA9IFtdO1xuXHR9XG5cdHN1YnNjcmliZSjGkikge1xuXHRcdHRoaXNbX2xpc3RlbmVyc10ucHVzaCjGkik7XG5cdH1cblx0dW5zdWJzY3JpYmUoxpIpIHtcblx0XHR0aGlzW19saXN0ZW5lcnNdLnNwbGljZSh0aGlzW19saXN0ZW5lcnNdLmluZGV4T2YoxpIpLCAxKTtcblx0fVxuXHRtYXAoxpIpIHtcblx0XHRyZXR1cm4gU3RyZWFtLm1hcCh0aGlzLCDGkik7XG5cdH1cblx0ZmlsdGVyKMaSKSB7XG5cdFx0cmV0dXJuIFN0cmVhbS5maWx0ZXIodGhpcywgxpIpO1xuXHR9XG5cdHVuaXF1ZSgpIHtcblx0XHRyZXR1cm4gU3RyZWFtLnVuaXF1ZSh0aGlzKTtcblx0fVxuXHRsb2cocHJlZml4KSB7XG5cdFx0cmV0dXJuIFN0cmVhbS5sb2codGhpcywgcHJlZml4KTtcblx0fVxuXHR0b0Jvb2woKSB7XG5cdFx0cmV0dXJuIFN0cmVhbS50b0Jvb2wodGhpcyk7XG5cdH1cblx0bmVnYXRlKCkge1xuXHRcdHJldHVybiBTdHJlYW0ubmVnYXRlKHRoaXMpO1xuXHR9XG5cdHppcCguLi5vdGhlcnMpIHtcblx0XHRyZXR1cm4gU3RyZWFtLnppcCh0aGlzLCAuLi5vdGhlcnMpO1xuXHR9XG5cdHNwcmVhZCjGkikge1xuXHRcdHJldHVybiBTdHJlYW0uc3ByZWFkKHRoaXMsIMaSKTtcblx0fVxuXHRmbGF0TWFwKCkge1xuXHRcdHJldHVybiBTdHJlYW0uZmxhdE1hcCh0aGlzKTtcblx0fVxuXHRtZXJnZSguLi5vdGhlcnMpIHtcblx0XHRyZXR1cm4gU3RyZWFtLm1lcmdlKHRoaXMsIC4uLm90aGVycyk7XG5cdH1cblx0cmVkdWNlKGFjYywgxpIpIHtcblx0XHRyZXR1cm4gU3RyZWFtLnJlZHVjZSh0aGlzLCBhY2MsIMaSKTtcblx0fVxuXHRmZWVkKGRlc3RWYWx1ZSkge1xuXHRcdHJldHVybiBTdHJlYW0uZmVlZCh0aGlzLCBkZXN0VmFsdWUpO1xuXHR9XG59XG5cbmNsYXNzIFB1c2hTb3VyY2UgZXh0ZW5kcyBTb3VyY2Uge1xuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRzdXBlcigoc2luaykgPT4gdGhpcy5wdXNoID0gc2luayk7XG5cdH1cbn1cblxubGV0IFN0cmVhbSA9IHtcblx0bWFwKHNvdXJjZSwgxpIpIHtcblx0XHRsZXQgc3RyZWFtID0gbmV3IFB1c2hTb3VyY2UoKTtcblx0XHRzb3VyY2Uuc3Vic2NyaWJlKCh2YWx1ZSkgPT4ge1xuXHRcdFx0c3RyZWFtLnB1c2goxpIodmFsdWUpKTtcblx0XHR9KTtcblx0XHRyZXR1cm4gc3RyZWFtO1xuXHR9LFxuXHRmaWx0ZXIoc291cmNlLCDGkikge1xuXHRcdGxldCBzdHJlYW0gPSBuZXcgUHVzaFNvdXJjZSgpO1xuXHRcdHNvdXJjZS5zdWJzY3JpYmUoKHZhbHVlKSA9PiB7XG5cdFx0XHRpZijGkih2YWx1ZSkpXG5cdFx0XHRcdHN0cmVhbS5wdXNoKHZhbHVlKTtcblx0XHR9KTtcblx0XHRyZXR1cm4gc3RyZWFtO1xuXHR9LFxuXHR1bmlxdWUoc291cmNlKSB7XG5cdFx0cmV0dXJuIHRoaXMuZmlsdGVyKHNvdXJjZSwgKGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIGxhc3Q7XG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24odikge1xuXHRcdFx0XHRpZihsYXN0ICE9PSB2KSB7XG5cdFx0XHRcdFx0bGFzdCA9IHY7XG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdH0pKCkpO1xuXHR9LFxuXHR0b0Jvb2woc291cmNlKSB7XG5cdFx0cmV0dXJuIHRoaXMubWFwKHNvdXJjZSwgKHYpID0+ICEhdik7XG5cdH0sXG5cdG5lZ2F0ZShzb3VyY2UpIHtcblx0XHRyZXR1cm4gdGhpcy5tYXAoc291cmNlLCAodikgPT4gIXYpO1xuXHR9LFxuXHRsb2coc291cmNlLCBwcmVmaXgpIHtcblx0XHRyZXR1cm4gdGhpcy5tYXAoc291cmNlLCAodikgPT4ge1xuXHRcdFx0aWYocHJlZml4KVxuXHRcdFx0XHRjb25zb2xlLmxvZyhwcmVmaXgsIHYpO1xuXHRcdFx0ZWxzZVxuXHRcdFx0XHRjb25zb2xlLmxvZyh2KTtcblx0XHRcdHJldHVybiB2O1xuXHRcdH0pO1xuXHR9LFxuXHR6aXAoLi4uc291cmNlcykge1xuXHRcdGxldCBsZW5ndGggPSBzb3VyY2VzLmxlbmd0aCxcblx0XHRcdHN0cmVhbSA9IG5ldyBQdXNoU291cmNlKCksXG5cdFx0XHR2YWx1ZXMgPSBuZXcgQXJyYXkobGVuZ3RoKSxcblx0XHRcdGZsYWdzICA9IG5ldyBBcnJheShsZW5ndGgpLFxuXHRcdFx0dXBkYXRlID0gKCkgPT4ge1xuXHRcdFx0XHRpZihmbGFncy5maWx0ZXIoKHYpID0+IHYpLmxlbmd0aCA9PT0gbGVuZ3RoKSB7XG5cdFx0XHRcdFx0dXBkYXRlID0gKCkgPT4gc3RyZWFtLnB1c2godmFsdWVzKTtcblx0XHRcdFx0XHR1cGRhdGUoKTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblxuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuXHRcdFx0KChpKSA9PiB7XG5cdFx0XHRcdHNvdXJjZXNbaV0uc3Vic2NyaWJlKCh2KSA9PiB7XG5cdFx0XHRcdFx0dmFsdWVzW2ldID0gdjtcblx0XHRcdFx0XHRmbGFnc1tpXSA9IHRydWU7XG5cdFx0XHRcdFx0dXBkYXRlKCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSkoaSk7XG5cdFx0fVxuXHRcdHJldHVybiBzdHJlYW07XG5cdH0sXG5cdHNwcmVhZChzb3VyY2UsIMaSKSB7XG5cdFx0bGV0IHN0cmVhbSA9IG5ldyBQdXNoU291cmNlKCk7XG5cdFx0c291cmNlLnN1YnNjcmliZSgoYXJyKSA9PiB7XG5cdFx0XHRzdHJlYW0ucHVzaCjGki5hcHBseSh0aGlzLCBhcnIpKTtcblx0XHR9KTtcblx0XHRyZXR1cm4gc3RyZWFtO1xuXHR9LFxuXHRmbGF0TWFwKHNvdXJjZSkge1xuXHRcdGxldCBzdHJlYW0gPSBuZXcgUHVzaFNvdXJjZSgpO1xuXHRcdHNvdXJjZS5zdWJzY3JpYmUoKGFycikgPT4ge1xuXHRcdFx0Zm9yKGxldCB2IGluIGFycilcblx0XHRcdFx0c3RyZWFtLnB1c2godik7XG5cdFx0fSk7XG5cdFx0cmV0dXJuIHN0cmVhbTtcblx0fSxcblx0bWVyZ2UoLi4uc291cmNlcykge1xuXHRcdGxldCBzdHJlYW0gPSBuZXcgUHVzaFNvdXJjZSgpO1xuXHRcdGZvcihsZXQgc291cmNlIG9mIHNvdXJjZXMpIHtcblx0XHRcdHNvdXJjZS5zdWJzY3JpYmUoKHYpID0+IHtcblx0XHRcdFx0c3RyZWFtLnB1c2godik7XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0cmV0dXJuIHN0cmVhbTtcblx0fSxcblx0Ly8gVE9ETyBubyB3YXkgdG8gY2FuY2VsXG5cdGludGVydmFsKG1zKSB7XG5cdFx0bGV0IHN0cmVhbSA9IG5ldyBQdXNoU291cmNlKCk7XG5cdFx0c2V0SW50ZXJ2YWwoKCkgPT4gc3RyZWFtLnB1c2goKSwgbXMpO1xuXHRcdHJldHVybiBzdHJlYW07XG5cdH0sXG5cdGRlbGF5KG1zKSB7XG5cdFx0bGV0IHN0cmVhbSA9IG5ldyBQdXNoU291cmNlKCk7XG5cdFx0c2V0VGltZW91dCgoKSA9PiBzdHJlYW0ucHVzaCgpLCBtcyk7XG5cdFx0cmV0dXJuIHN0cmVhbTtcblx0fSxcblx0cmVkdWNlKHNvdXJjZSwgYWNjLCDGkikge1xuXHRcdGxldCBzdHJlYW0gPSBuZXcgUHVzaFNvdXJjZSgpO1xuXHRcdHNvdXJjZS5zdWJzY3JpYmUoKHZhbHVlKSA9PiBzdHJlYW0ucHVzaChhY2MgPSDGkihhY2MsIHZhbHVlKSkpO1xuXHRcdHJldHVybiBzdHJlYW07XG5cdH0sXG5cdGZlZWQoc291cmNlLCBkZXN0VmFsdWUpIHtcblx0XHRsZXQgxpIgPSAodikgPT4gZGVzdFZhbHVlLnNldCh2KTtcblx0XHRzb3VyY2Uuc3Vic2NyaWJlKMaSKTtcblx0XHRyZXR1cm4gKCkgPT4gc291cmNlLnVuc3Vic2NyaWJlKMaSKTtcblx0fVxufVxuXG5leHBvcnQgeyBTdHJlYW0sIFNvdXJjZSwgUHVzaFNvdXJjZSB9OyIsImltcG9ydCB7IFNvdXJjZSwgU3RyZWFtIH0gZnJvbSAnLi9zdHJlYW0nXG5cbnZhciBfdmFsdWUgPSBTeW1ib2woKSxcblx0X2RlZmF1bHRWYWx1ZSA9IFN5bWJvbCgpLFxuXHRfdXBkYXRlID0gU3ltYm9sKCk7XG5cbmV4cG9ydCBjbGFzcyBWYWx1ZSBleHRlbmRzIFNvdXJjZSB7XG5cdGNvbnN0cnVjdG9yKHZhbHVlLCBkZWZhdWx0VmFsdWUpIHtcblx0XHRsZXQgY2FsbGJhY2sgPSAoc2luaykgPT4ge1xuXHRcdFx0dGhpc1tfdXBkYXRlXSA9IHNpbms7XG5cdFx0fTtcblx0XHRzdXBlcihjYWxsYmFjayk7XG5cdFx0dGhpc1tfZGVmYXVsdFZhbHVlXSA9IGRlZmF1bHRWYWx1ZTtcblx0XHR0aGlzW192YWx1ZV0gPSB2YWx1ZTtcblx0fVxuXHRzdWJzY3JpYmUoxpIpIHtcblx0XHTGkih0aGlzW192YWx1ZV0pO1xuXHRcdHN1cGVyLnN1YnNjcmliZSjGkik7XG5cdH1cblx0c2V0KHZhbHVlKSB7XG5cdFx0aWYodmFsdWUgPT09IHRoaXNbX3ZhbHVlXSlcblx0XHRcdHJldHVybjtcblx0XHR0aGlzW192YWx1ZV0gPSB2YWx1ZTtcblx0XHR0aGlzW191cGRhdGVdKHZhbHVlKTtcblx0fVxuXHRnZXQgdmFsdWUoKSB7XG5cdFx0cmV0dXJuIHRoaXNbX3ZhbHVlXTtcblx0fVxuXHRzZXQgdmFsdWUodikge1xuXHRcdHRoaXMuc2V0KHYpO1xuXHR9XG5cdGdldCBpc0RlZmF1bHQoKSB7XG5cdFx0cmV0dXJuIHRoaXNbX3ZhbHVlXSA9PT0gdGhpc1tfZGVmYXVsdFZhbHVlXTtcblx0fVxuXHRyZXNldCgpIHtcblx0XHR0aGlzLnZhbHVlID0gdGhpc1tfZGVmYXVsdFZhbHVlXTtcblx0fVxufVxuXG5leHBvcnQgY2xhc3MgU3RyaW5nVmFsdWUgZXh0ZW5kcyBWYWx1ZSB7XG5cdGNvbnN0cnVjdG9yKHZhbHVlID0gXCJcIiwgZGVmYXVsdFZhbHVlID0gdmFsdWUpIHtcblx0XHRzdXBlcih2YWx1ZSwgZGVmYXVsdFZhbHVlKTtcblx0fVxuXHRzZXQodmFsdWUpIHtcblx0XHRzdXBlci5zZXQoKHZhbHVlICYmIHZhbHVlLnRvU3RyaW5nICYmIHZhbHVlLnRvU3RyaW5nKCkpIHx8ICh2YWx1ZSAmJiAoXCJcIiArIHZhbHVlKSkgfHwgXCJcIik7XG5cdH1cbn1cblxuZXhwb3J0IGNsYXNzIEJvb2xWYWx1ZSBleHRlbmRzIFZhbHVlIHtcblx0Y29uc3RydWN0b3IodmFsdWUgPSBmYWxzZSwgZGVmYXVsdFZhbHVlID0gdmFsdWUpIHtcblx0XHRzdXBlcih2YWx1ZSwgZGVmYXVsdFZhbHVlKTtcblx0fVxuXHRzZXQodmFsdWUpIHtcblx0XHRzdXBlci5zZXQoISF2YWx1ZSk7XG5cdH1cblx0dG9nZ2xlKCkge1xuXHRcdHRoaXMuc2V0KCF0aGlzLnZhbHVlKTtcblx0fVxufVxuXG5leHBvcnQgY2xhc3MgRmxvYXRWYWx1ZSBleHRlbmRzIFZhbHVlIHtcblx0Y29uc3RydWN0b3IodmFsdWUgPSAwLjAsIGRlZmF1bHRWYWx1ZSA9IHZhbHVlKSB7XG5cdFx0c3VwZXIodmFsdWUsIGRlZmF1bHRWYWx1ZSk7XG5cdH1cblx0c2V0KHZhbHVlKSB7XG5cdFx0c3VwZXIuc2V0KCtuZXcgTnVtYmVyKHZhbHVlKSk7XG5cdH1cblx0YXNJbnQoKSB7XG5cdFx0cmV0dXJuIFN0cmVhbS5tYXAodGhpcywgKHYpID0+IE1hdGgucm91bmQodikpO1xuXHR9XG59XG5cbnZhciBkZWZhdWx0RGF0ZSA9IG5ldyBEYXRlKG51bGwpO1xuZXhwb3J0IGNsYXNzIERhdGVWYWx1ZSBleHRlbmRzIFZhbHVlIHtcblx0Y29uc3RydWN0b3IodmFsdWUgPSBkZWZhdWx0RGF0ZSwgZGVmYXVsdFZhbHVlID0gdmFsdWUpIHtcblx0XHRzdXBlcih2YWx1ZSwgZGVmYXVsdFZhbHVlKTtcblx0fVxuXHRzZXQodmFsdWUpIHtcblx0XHRzdXBlci5zZXQobmV3IERhdGUodmFsdWUpKTtcblx0fVxufSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwpe1xuKGZ1bmN0aW9uKGdsb2JhbCkge1xuICAndXNlIHN0cmljdCc7XG4gIGlmIChnbG9iYWwuJHRyYWNldXJSdW50aW1lKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHZhciAkT2JqZWN0ID0gT2JqZWN0O1xuICB2YXIgJFR5cGVFcnJvciA9IFR5cGVFcnJvcjtcbiAgdmFyICRjcmVhdGUgPSAkT2JqZWN0LmNyZWF0ZTtcbiAgdmFyICRkZWZpbmVQcm9wZXJ0aWVzID0gJE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzO1xuICB2YXIgJGRlZmluZVByb3BlcnR5ID0gJE9iamVjdC5kZWZpbmVQcm9wZXJ0eTtcbiAgdmFyICRmcmVlemUgPSAkT2JqZWN0LmZyZWV6ZTtcbiAgdmFyICRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPSAkT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcjtcbiAgdmFyICRnZXRPd25Qcm9wZXJ0eU5hbWVzID0gJE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzO1xuICB2YXIgJGdldFByb3RvdHlwZU9mID0gJE9iamVjdC5nZXRQcm90b3R5cGVPZjtcbiAgdmFyICRoYXNPd25Qcm9wZXJ0eSA9ICRPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuICB2YXIgJHRvU3RyaW5nID0gJE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG4gIGZ1bmN0aW9uIG5vbkVudW0odmFsdWUpIHtcbiAgICByZXR1cm4ge1xuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICB3cml0YWJsZTogdHJ1ZVxuICAgIH07XG4gIH1cbiAgdmFyIHR5cGVzID0ge1xuICAgIHZvaWQ6IGZ1bmN0aW9uIHZvaWRUeXBlKCkge30sXG4gICAgYW55OiBmdW5jdGlvbiBhbnkoKSB7fSxcbiAgICBzdHJpbmc6IGZ1bmN0aW9uIHN0cmluZygpIHt9LFxuICAgIG51bWJlcjogZnVuY3Rpb24gbnVtYmVyKCkge30sXG4gICAgYm9vbGVhbjogZnVuY3Rpb24gYm9vbGVhbigpIHt9XG4gIH07XG4gIHZhciBtZXRob2QgPSBub25FbnVtO1xuICB2YXIgY291bnRlciA9IDA7XG4gIGZ1bmN0aW9uIG5ld1VuaXF1ZVN0cmluZygpIHtcbiAgICByZXR1cm4gJ19fJCcgKyBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxZTkpICsgJyQnICsgKytjb3VudGVyICsgJyRfXyc7XG4gIH1cbiAgdmFyIHN5bWJvbEludGVybmFsUHJvcGVydHkgPSBuZXdVbmlxdWVTdHJpbmcoKTtcbiAgdmFyIHN5bWJvbERlc2NyaXB0aW9uUHJvcGVydHkgPSBuZXdVbmlxdWVTdHJpbmcoKTtcbiAgdmFyIHN5bWJvbERhdGFQcm9wZXJ0eSA9IG5ld1VuaXF1ZVN0cmluZygpO1xuICB2YXIgc3ltYm9sVmFsdWVzID0gJGNyZWF0ZShudWxsKTtcbiAgZnVuY3Rpb24gaXNTeW1ib2woc3ltYm9sKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBzeW1ib2wgPT09ICdvYmplY3QnICYmIHN5bWJvbCBpbnN0YW5jZW9mIFN5bWJvbFZhbHVlO1xuICB9XG4gIGZ1bmN0aW9uIHR5cGVPZih2KSB7XG4gICAgaWYgKGlzU3ltYm9sKHYpKVxuICAgICAgcmV0dXJuICdzeW1ib2wnO1xuICAgIHJldHVybiB0eXBlb2YgdjtcbiAgfVxuICBmdW5jdGlvbiBTeW1ib2woZGVzY3JpcHRpb24pIHtcbiAgICB2YXIgdmFsdWUgPSBuZXcgU3ltYm9sVmFsdWUoZGVzY3JpcHRpb24pO1xuICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBTeW1ib2wpKVxuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1N5bWJvbCBjYW5ub3QgYmUgbmV3XFwnZWQnKTtcbiAgfVxuICAkZGVmaW5lUHJvcGVydHkoU3ltYm9sLnByb3RvdHlwZSwgJ2NvbnN0cnVjdG9yJywgbm9uRW51bShTeW1ib2wpKTtcbiAgJGRlZmluZVByb3BlcnR5KFN5bWJvbC5wcm90b3R5cGUsICd0b1N0cmluZycsIG1ldGhvZChmdW5jdGlvbigpIHtcbiAgICB2YXIgc3ltYm9sVmFsdWUgPSB0aGlzW3N5bWJvbERhdGFQcm9wZXJ0eV07XG4gICAgaWYgKCFnZXRPcHRpb24oJ3N5bWJvbHMnKSlcbiAgICAgIHJldHVybiBzeW1ib2xWYWx1ZVtzeW1ib2xJbnRlcm5hbFByb3BlcnR5XTtcbiAgICBpZiAoIXN5bWJvbFZhbHVlKVxuICAgICAgdGhyb3cgVHlwZUVycm9yKCdDb252ZXJzaW9uIGZyb20gc3ltYm9sIHRvIHN0cmluZycpO1xuICAgIHZhciBkZXNjID0gc3ltYm9sVmFsdWVbc3ltYm9sRGVzY3JpcHRpb25Qcm9wZXJ0eV07XG4gICAgaWYgKGRlc2MgPT09IHVuZGVmaW5lZClcbiAgICAgIGRlc2MgPSAnJztcbiAgICByZXR1cm4gJ1N5bWJvbCgnICsgZGVzYyArICcpJztcbiAgfSkpO1xuICAkZGVmaW5lUHJvcGVydHkoU3ltYm9sLnByb3RvdHlwZSwgJ3ZhbHVlT2YnLCBtZXRob2QoZnVuY3Rpb24oKSB7XG4gICAgdmFyIHN5bWJvbFZhbHVlID0gdGhpc1tzeW1ib2xEYXRhUHJvcGVydHldO1xuICAgIGlmICghc3ltYm9sVmFsdWUpXG4gICAgICB0aHJvdyBUeXBlRXJyb3IoJ0NvbnZlcnNpb24gZnJvbSBzeW1ib2wgdG8gc3RyaW5nJyk7XG4gICAgaWYgKCFnZXRPcHRpb24oJ3N5bWJvbHMnKSlcbiAgICAgIHJldHVybiBzeW1ib2xWYWx1ZVtzeW1ib2xJbnRlcm5hbFByb3BlcnR5XTtcbiAgICByZXR1cm4gc3ltYm9sVmFsdWU7XG4gIH0pKTtcbiAgZnVuY3Rpb24gU3ltYm9sVmFsdWUoZGVzY3JpcHRpb24pIHtcbiAgICB2YXIga2V5ID0gbmV3VW5pcXVlU3RyaW5nKCk7XG4gICAgJGRlZmluZVByb3BlcnR5KHRoaXMsIHN5bWJvbERhdGFQcm9wZXJ0eSwge3ZhbHVlOiB0aGlzfSk7XG4gICAgJGRlZmluZVByb3BlcnR5KHRoaXMsIHN5bWJvbEludGVybmFsUHJvcGVydHksIHt2YWx1ZToga2V5fSk7XG4gICAgJGRlZmluZVByb3BlcnR5KHRoaXMsIHN5bWJvbERlc2NyaXB0aW9uUHJvcGVydHksIHt2YWx1ZTogZGVzY3JpcHRpb259KTtcbiAgICAkZnJlZXplKHRoaXMpO1xuICAgIHN5bWJvbFZhbHVlc1trZXldID0gdGhpcztcbiAgfVxuICAkZGVmaW5lUHJvcGVydHkoU3ltYm9sVmFsdWUucHJvdG90eXBlLCAnY29uc3RydWN0b3InLCBub25FbnVtKFN5bWJvbCkpO1xuICAkZGVmaW5lUHJvcGVydHkoU3ltYm9sVmFsdWUucHJvdG90eXBlLCAndG9TdHJpbmcnLCB7XG4gICAgdmFsdWU6IFN5bWJvbC5wcm90b3R5cGUudG9TdHJpbmcsXG4gICAgZW51bWVyYWJsZTogZmFsc2VcbiAgfSk7XG4gICRkZWZpbmVQcm9wZXJ0eShTeW1ib2xWYWx1ZS5wcm90b3R5cGUsICd2YWx1ZU9mJywge1xuICAgIHZhbHVlOiBTeW1ib2wucHJvdG90eXBlLnZhbHVlT2YsXG4gICAgZW51bWVyYWJsZTogZmFsc2VcbiAgfSk7XG4gICRmcmVlemUoU3ltYm9sVmFsdWUucHJvdG90eXBlKTtcbiAgU3ltYm9sLml0ZXJhdG9yID0gU3ltYm9sKCk7XG4gIGZ1bmN0aW9uIHRvUHJvcGVydHkobmFtZSkge1xuICAgIGlmIChpc1N5bWJvbChuYW1lKSlcbiAgICAgIHJldHVybiBuYW1lW3N5bWJvbEludGVybmFsUHJvcGVydHldO1xuICAgIHJldHVybiBuYW1lO1xuICB9XG4gIGZ1bmN0aW9uIGdldE93blByb3BlcnR5TmFtZXMob2JqZWN0KSB7XG4gICAgdmFyIHJ2ID0gW107XG4gICAgdmFyIG5hbWVzID0gJGdldE93blByb3BlcnR5TmFtZXMob2JqZWN0KTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5hbWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgbmFtZSA9IG5hbWVzW2ldO1xuICAgICAgaWYgKCFzeW1ib2xWYWx1ZXNbbmFtZV0pXG4gICAgICAgIHJ2LnB1c2gobmFtZSk7XG4gICAgfVxuICAgIHJldHVybiBydjtcbiAgfVxuICBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqZWN0LCBuYW1lKSB7XG4gICAgcmV0dXJuICRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqZWN0LCB0b1Byb3BlcnR5KG5hbWUpKTtcbiAgfVxuICBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMob2JqZWN0KSB7XG4gICAgdmFyIHJ2ID0gW107XG4gICAgdmFyIG5hbWVzID0gJGdldE93blByb3BlcnR5TmFtZXMob2JqZWN0KTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5hbWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgc3ltYm9sID0gc3ltYm9sVmFsdWVzW25hbWVzW2ldXTtcbiAgICAgIGlmIChzeW1ib2wpXG4gICAgICAgIHJ2LnB1c2goc3ltYm9sKTtcbiAgICB9XG4gICAgcmV0dXJuIHJ2O1xuICB9XG4gIGZ1bmN0aW9uIGhhc093blByb3BlcnR5KG5hbWUpIHtcbiAgICByZXR1cm4gJGhhc093blByb3BlcnR5LmNhbGwodGhpcywgdG9Qcm9wZXJ0eShuYW1lKSk7XG4gIH1cbiAgZnVuY3Rpb24gZ2V0T3B0aW9uKG5hbWUpIHtcbiAgICByZXR1cm4gZ2xvYmFsLnRyYWNldXIgJiYgZ2xvYmFsLnRyYWNldXIub3B0aW9uc1tuYW1lXTtcbiAgfVxuICBmdW5jdGlvbiBzZXRQcm9wZXJ0eShvYmplY3QsIG5hbWUsIHZhbHVlKSB7XG4gICAgdmFyIHN5bSxcbiAgICAgICAgZGVzYztcbiAgICBpZiAoaXNTeW1ib2wobmFtZSkpIHtcbiAgICAgIHN5bSA9IG5hbWU7XG4gICAgICBuYW1lID0gbmFtZVtzeW1ib2xJbnRlcm5hbFByb3BlcnR5XTtcbiAgICB9XG4gICAgb2JqZWN0W25hbWVdID0gdmFsdWU7XG4gICAgaWYgKHN5bSAmJiAoZGVzYyA9ICRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqZWN0LCBuYW1lKSkpXG4gICAgICAkZGVmaW5lUHJvcGVydHkob2JqZWN0LCBuYW1lLCB7ZW51bWVyYWJsZTogZmFsc2V9KTtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgZnVuY3Rpb24gZGVmaW5lUHJvcGVydHkob2JqZWN0LCBuYW1lLCBkZXNjcmlwdG9yKSB7XG4gICAgaWYgKGlzU3ltYm9sKG5hbWUpKSB7XG4gICAgICBpZiAoZGVzY3JpcHRvci5lbnVtZXJhYmxlKSB7XG4gICAgICAgIGRlc2NyaXB0b3IgPSAkY3JlYXRlKGRlc2NyaXB0b3IsIHtlbnVtZXJhYmxlOiB7dmFsdWU6IGZhbHNlfX0pO1xuICAgICAgfVxuICAgICAgbmFtZSA9IG5hbWVbc3ltYm9sSW50ZXJuYWxQcm9wZXJ0eV07XG4gICAgfVxuICAgICRkZWZpbmVQcm9wZXJ0eShvYmplY3QsIG5hbWUsIGRlc2NyaXB0b3IpO1xuICAgIHJldHVybiBvYmplY3Q7XG4gIH1cbiAgZnVuY3Rpb24gcG9seWZpbGxPYmplY3QoT2JqZWN0KSB7XG4gICAgJGRlZmluZVByb3BlcnR5KE9iamVjdCwgJ2RlZmluZVByb3BlcnR5Jywge3ZhbHVlOiBkZWZpbmVQcm9wZXJ0eX0pO1xuICAgICRkZWZpbmVQcm9wZXJ0eShPYmplY3QsICdnZXRPd25Qcm9wZXJ0eU5hbWVzJywge3ZhbHVlOiBnZXRPd25Qcm9wZXJ0eU5hbWVzfSk7XG4gICAgJGRlZmluZVByb3BlcnR5KE9iamVjdCwgJ2dldE93blByb3BlcnR5RGVzY3JpcHRvcicsIHt2YWx1ZTogZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yfSk7XG4gICAgJGRlZmluZVByb3BlcnR5KE9iamVjdC5wcm90b3R5cGUsICdoYXNPd25Qcm9wZXJ0eScsIHt2YWx1ZTogaGFzT3duUHJvcGVydHl9KTtcbiAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzID0gZ2V0T3duUHJvcGVydHlTeW1ib2xzO1xuICAgIGZ1bmN0aW9uIGlzKGxlZnQsIHJpZ2h0KSB7XG4gICAgICBpZiAobGVmdCA9PT0gcmlnaHQpXG4gICAgICAgIHJldHVybiBsZWZ0ICE9PSAwIHx8IDEgLyBsZWZ0ID09PSAxIC8gcmlnaHQ7XG4gICAgICByZXR1cm4gbGVmdCAhPT0gbGVmdCAmJiByaWdodCAhPT0gcmlnaHQ7XG4gICAgfVxuICAgICRkZWZpbmVQcm9wZXJ0eShPYmplY3QsICdpcycsIG1ldGhvZChpcykpO1xuICAgIGZ1bmN0aW9uIGFzc2lnbih0YXJnZXQsIHNvdXJjZSkge1xuICAgICAgdmFyIHByb3BzID0gJGdldE93blByb3BlcnR5TmFtZXMoc291cmNlKTtcbiAgICAgIHZhciBwLFxuICAgICAgICAgIGxlbmd0aCA9IHByb3BzLmxlbmd0aDtcbiAgICAgIGZvciAocCA9IDA7IHAgPCBsZW5ndGg7IHArKykge1xuICAgICAgICB0YXJnZXRbcHJvcHNbcF1dID0gc291cmNlW3Byb3BzW3BdXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgfVxuICAgICRkZWZpbmVQcm9wZXJ0eShPYmplY3QsICdhc3NpZ24nLCBtZXRob2QoYXNzaWduKSk7XG4gICAgZnVuY3Rpb24gbWl4aW4odGFyZ2V0LCBzb3VyY2UpIHtcbiAgICAgIHZhciBwcm9wcyA9ICRnZXRPd25Qcm9wZXJ0eU5hbWVzKHNvdXJjZSk7XG4gICAgICB2YXIgcCxcbiAgICAgICAgICBkZXNjcmlwdG9yLFxuICAgICAgICAgIGxlbmd0aCA9IHByb3BzLmxlbmd0aDtcbiAgICAgIGZvciAocCA9IDA7IHAgPCBsZW5ndGg7IHArKykge1xuICAgICAgICBkZXNjcmlwdG9yID0gJGdldE93blByb3BlcnR5RGVzY3JpcHRvcihzb3VyY2UsIHByb3BzW3BdKTtcbiAgICAgICAgJGRlZmluZVByb3BlcnR5KHRhcmdldCwgcHJvcHNbcF0sIGRlc2NyaXB0b3IpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICB9XG4gICAgJGRlZmluZVByb3BlcnR5KE9iamVjdCwgJ21peGluJywgbWV0aG9kKG1peGluKSk7XG4gIH1cbiAgZnVuY3Rpb24gZXhwb3J0U3RhcihvYmplY3QpIHtcbiAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIG5hbWVzID0gJGdldE93blByb3BlcnR5TmFtZXMoYXJndW1lbnRzW2ldKTtcbiAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgbmFtZXMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgKGZ1bmN0aW9uKG1vZCwgbmFtZSkge1xuICAgICAgICAgICRkZWZpbmVQcm9wZXJ0eShvYmplY3QsIG5hbWUsIHtcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHJldHVybiBtb2RbbmFtZV07XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgICAgIH0pO1xuICAgICAgICB9KShhcmd1bWVudHNbaV0sIG5hbWVzW2pdKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG9iamVjdDtcbiAgfVxuICBmdW5jdGlvbiB0b09iamVjdCh2YWx1ZSkge1xuICAgIGlmICh2YWx1ZSA9PSBudWxsKVxuICAgICAgdGhyb3cgJFR5cGVFcnJvcigpO1xuICAgIHJldHVybiAkT2JqZWN0KHZhbHVlKTtcbiAgfVxuICBmdW5jdGlvbiBzcHJlYWQoKSB7XG4gICAgdmFyIHJ2ID0gW10sXG4gICAgICAgIGsgPSAwO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgdmFsdWVUb1NwcmVhZCA9IHRvT2JqZWN0KGFyZ3VtZW50c1tpXSk7XG4gICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHZhbHVlVG9TcHJlYWQubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgcnZbaysrXSA9IHZhbHVlVG9TcHJlYWRbal07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBydjtcbiAgfVxuICBmdW5jdGlvbiBnZXRQcm9wZXJ0eURlc2NyaXB0b3Iob2JqZWN0LCBuYW1lKSB7XG4gICAgd2hpbGUgKG9iamVjdCAhPT0gbnVsbCkge1xuICAgICAgdmFyIHJlc3VsdCA9ICRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqZWN0LCBuYW1lKTtcbiAgICAgIGlmIChyZXN1bHQpXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICBvYmplY3QgPSAkZ2V0UHJvdG90eXBlT2Yob2JqZWN0KTtcbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuICBmdW5jdGlvbiBzdXBlckRlc2NyaXB0b3IoaG9tZU9iamVjdCwgbmFtZSkge1xuICAgIHZhciBwcm90byA9ICRnZXRQcm90b3R5cGVPZihob21lT2JqZWN0KTtcbiAgICBpZiAoIXByb3RvKVxuICAgICAgdGhyb3cgJFR5cGVFcnJvcignc3VwZXIgaXMgbnVsbCcpO1xuICAgIHJldHVybiBnZXRQcm9wZXJ0eURlc2NyaXB0b3IocHJvdG8sIG5hbWUpO1xuICB9XG4gIGZ1bmN0aW9uIHN1cGVyQ2FsbChzZWxmLCBob21lT2JqZWN0LCBuYW1lLCBhcmdzKSB7XG4gICAgdmFyIGRlc2NyaXB0b3IgPSBzdXBlckRlc2NyaXB0b3IoaG9tZU9iamVjdCwgbmFtZSk7XG4gICAgaWYgKGRlc2NyaXB0b3IpIHtcbiAgICAgIGlmICgndmFsdWUnIGluIGRlc2NyaXB0b3IpXG4gICAgICAgIHJldHVybiBkZXNjcmlwdG9yLnZhbHVlLmFwcGx5KHNlbGYsIGFyZ3MpO1xuICAgICAgaWYgKGRlc2NyaXB0b3IuZ2V0KVxuICAgICAgICByZXR1cm4gZGVzY3JpcHRvci5nZXQuY2FsbChzZWxmKS5hcHBseShzZWxmLCBhcmdzKTtcbiAgICB9XG4gICAgdGhyb3cgJFR5cGVFcnJvcihcInN1cGVyIGhhcyBubyBtZXRob2QgJ1wiICsgbmFtZSArIFwiJy5cIik7XG4gIH1cbiAgZnVuY3Rpb24gc3VwZXJHZXQoc2VsZiwgaG9tZU9iamVjdCwgbmFtZSkge1xuICAgIHZhciBkZXNjcmlwdG9yID0gc3VwZXJEZXNjcmlwdG9yKGhvbWVPYmplY3QsIG5hbWUpO1xuICAgIGlmIChkZXNjcmlwdG9yKSB7XG4gICAgICBpZiAoZGVzY3JpcHRvci5nZXQpXG4gICAgICAgIHJldHVybiBkZXNjcmlwdG9yLmdldC5jYWxsKHNlbGYpO1xuICAgICAgZWxzZSBpZiAoJ3ZhbHVlJyBpbiBkZXNjcmlwdG9yKVxuICAgICAgICByZXR1cm4gZGVzY3JpcHRvci52YWx1ZTtcbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuICBmdW5jdGlvbiBzdXBlclNldChzZWxmLCBob21lT2JqZWN0LCBuYW1lLCB2YWx1ZSkge1xuICAgIHZhciBkZXNjcmlwdG9yID0gc3VwZXJEZXNjcmlwdG9yKGhvbWVPYmplY3QsIG5hbWUpO1xuICAgIGlmIChkZXNjcmlwdG9yICYmIGRlc2NyaXB0b3Iuc2V0KSB7XG4gICAgICBkZXNjcmlwdG9yLnNldC5jYWxsKHNlbGYsIHZhbHVlKTtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG4gICAgdGhyb3cgJFR5cGVFcnJvcihcInN1cGVyIGhhcyBubyBzZXR0ZXIgJ1wiICsgbmFtZSArIFwiJy5cIik7XG4gIH1cbiAgZnVuY3Rpb24gZ2V0RGVzY3JpcHRvcnMob2JqZWN0KSB7XG4gICAgdmFyIGRlc2NyaXB0b3JzID0ge30sXG4gICAgICAgIG5hbWUsXG4gICAgICAgIG5hbWVzID0gJGdldE93blByb3BlcnR5TmFtZXMob2JqZWN0KTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5hbWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgbmFtZSA9IG5hbWVzW2ldO1xuICAgICAgZGVzY3JpcHRvcnNbbmFtZV0gPSAkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iamVjdCwgbmFtZSk7XG4gICAgfVxuICAgIHJldHVybiBkZXNjcmlwdG9ycztcbiAgfVxuICBmdW5jdGlvbiBjcmVhdGVDbGFzcyhjdG9yLCBvYmplY3QsIHN0YXRpY09iamVjdCwgc3VwZXJDbGFzcykge1xuICAgICRkZWZpbmVQcm9wZXJ0eShvYmplY3QsICdjb25zdHJ1Y3RvcicsIHtcbiAgICAgIHZhbHVlOiBjdG9yLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICB3cml0YWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMykge1xuICAgICAgaWYgKHR5cGVvZiBzdXBlckNsYXNzID09PSAnZnVuY3Rpb24nKVxuICAgICAgICBjdG9yLl9fcHJvdG9fXyA9IHN1cGVyQ2xhc3M7XG4gICAgICBjdG9yLnByb3RvdHlwZSA9ICRjcmVhdGUoZ2V0UHJvdG9QYXJlbnQoc3VwZXJDbGFzcyksIGdldERlc2NyaXB0b3JzKG9iamVjdCkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjdG9yLnByb3RvdHlwZSA9IG9iamVjdDtcbiAgICB9XG4gICAgJGRlZmluZVByb3BlcnR5KGN0b3IsICdwcm90b3R5cGUnLCB7XG4gICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgd3JpdGFibGU6IGZhbHNlXG4gICAgfSk7XG4gICAgcmV0dXJuICRkZWZpbmVQcm9wZXJ0aWVzKGN0b3IsIGdldERlc2NyaXB0b3JzKHN0YXRpY09iamVjdCkpO1xuICB9XG4gIGZ1bmN0aW9uIGdldFByb3RvUGFyZW50KHN1cGVyQ2xhc3MpIHtcbiAgICBpZiAodHlwZW9mIHN1cGVyQ2xhc3MgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHZhciBwcm90b3R5cGUgPSBzdXBlckNsYXNzLnByb3RvdHlwZTtcbiAgICAgIGlmICgkT2JqZWN0KHByb3RvdHlwZSkgPT09IHByb3RvdHlwZSB8fCBwcm90b3R5cGUgPT09IG51bGwpXG4gICAgICAgIHJldHVybiBzdXBlckNsYXNzLnByb3RvdHlwZTtcbiAgICB9XG4gICAgaWYgKHN1cGVyQ2xhc3MgPT09IG51bGwpXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCk7XG4gIH1cbiAgZnVuY3Rpb24gZGVmYXVsdFN1cGVyQ2FsbChzZWxmLCBob21lT2JqZWN0LCBhcmdzKSB7XG4gICAgaWYgKCRnZXRQcm90b3R5cGVPZihob21lT2JqZWN0KSAhPT0gbnVsbClcbiAgICAgIHN1cGVyQ2FsbChzZWxmLCBob21lT2JqZWN0LCAnY29uc3RydWN0b3InLCBhcmdzKTtcbiAgfVxuICB2YXIgU1RfTkVXQk9STiA9IDA7XG4gIHZhciBTVF9FWEVDVVRJTkcgPSAxO1xuICB2YXIgU1RfU1VTUEVOREVEID0gMjtcbiAgdmFyIFNUX0NMT1NFRCA9IDM7XG4gIHZhciBFTkRfU1RBVEUgPSAtMjtcbiAgdmFyIFJFVEhST1dfU1RBVEUgPSAtMztcbiAgZnVuY3Rpb24gYWRkSXRlcmF0b3Iob2JqZWN0KSB7XG4gICAgcmV0dXJuIGRlZmluZVByb3BlcnR5KG9iamVjdCwgU3ltYm9sLml0ZXJhdG9yLCBub25FbnVtKGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSkpO1xuICB9XG4gIGZ1bmN0aW9uIGdldEludGVybmFsRXJyb3Ioc3RhdGUpIHtcbiAgICByZXR1cm4gbmV3IEVycm9yKCdUcmFjZXVyIGNvbXBpbGVyIGJ1ZzogaW52YWxpZCBzdGF0ZSBpbiBzdGF0ZSBtYWNoaW5lOiAnICsgc3RhdGUpO1xuICB9XG4gIGZ1bmN0aW9uIEdlbmVyYXRvckNvbnRleHQoKSB7XG4gICAgdGhpcy5zdGF0ZSA9IDA7XG4gICAgdGhpcy5HU3RhdGUgPSBTVF9ORVdCT1JOO1xuICAgIHRoaXMuc3RvcmVkRXhjZXB0aW9uID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuZmluYWxseUZhbGxUaHJvdWdoID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuc2VudF8gPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5yZXR1cm5WYWx1ZSA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLnRyeVN0YWNrXyA9IFtdO1xuICB9XG4gIEdlbmVyYXRvckNvbnRleHQucHJvdG90eXBlID0ge1xuICAgIHB1c2hUcnk6IGZ1bmN0aW9uKGNhdGNoU3RhdGUsIGZpbmFsbHlTdGF0ZSkge1xuICAgICAgaWYgKGZpbmFsbHlTdGF0ZSAhPT0gbnVsbCkge1xuICAgICAgICB2YXIgZmluYWxseUZhbGxUaHJvdWdoID0gbnVsbDtcbiAgICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5U3RhY2tfLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgaWYgKHRoaXMudHJ5U3RhY2tfW2ldLmNhdGNoICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGZpbmFsbHlGYWxsVGhyb3VnaCA9IHRoaXMudHJ5U3RhY2tfW2ldLmNhdGNoO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChmaW5hbGx5RmFsbFRocm91Z2ggPT09IG51bGwpXG4gICAgICAgICAgZmluYWxseUZhbGxUaHJvdWdoID0gUkVUSFJPV19TVEFURTtcbiAgICAgICAgdGhpcy50cnlTdGFja18ucHVzaCh7XG4gICAgICAgICAgZmluYWxseTogZmluYWxseVN0YXRlLFxuICAgICAgICAgIGZpbmFsbHlGYWxsVGhyb3VnaDogZmluYWxseUZhbGxUaHJvdWdoXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgaWYgKGNhdGNoU3RhdGUgIT09IG51bGwpIHtcbiAgICAgICAgdGhpcy50cnlTdGFja18ucHVzaCh7Y2F0Y2g6IGNhdGNoU3RhdGV9KTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHBvcFRyeTogZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLnRyeVN0YWNrXy5wb3AoKTtcbiAgICB9LFxuICAgIGdldCBzZW50KCkge1xuICAgICAgdGhpcy5tYXliZVRocm93KCk7XG4gICAgICByZXR1cm4gdGhpcy5zZW50XztcbiAgICB9LFxuICAgIHNldCBzZW50KHYpIHtcbiAgICAgIHRoaXMuc2VudF8gPSB2O1xuICAgIH0sXG4gICAgZ2V0IHNlbnRJZ25vcmVUaHJvdygpIHtcbiAgICAgIHJldHVybiB0aGlzLnNlbnRfO1xuICAgIH0sXG4gICAgbWF5YmVUaHJvdzogZnVuY3Rpb24oKSB7XG4gICAgICBpZiAodGhpcy5hY3Rpb24gPT09ICd0aHJvdycpIHtcbiAgICAgICAgdGhpcy5hY3Rpb24gPSAnbmV4dCc7XG4gICAgICAgIHRocm93IHRoaXMuc2VudF87XG4gICAgICB9XG4gICAgfSxcbiAgICBlbmQ6IGZ1bmN0aW9uKCkge1xuICAgICAgc3dpdGNoICh0aGlzLnN0YXRlKSB7XG4gICAgICAgIGNhc2UgRU5EX1NUQVRFOlxuICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICBjYXNlIFJFVEhST1dfU1RBVEU6XG4gICAgICAgICAgdGhyb3cgdGhpcy5zdG9yZWRFeGNlcHRpb247XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgdGhyb3cgZ2V0SW50ZXJuYWxFcnJvcih0aGlzLnN0YXRlKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG4gIGZ1bmN0aW9uIGdldE5leHRPclRocm93KGN0eCwgbW92ZU5leHQsIGFjdGlvbikge1xuICAgIHJldHVybiBmdW5jdGlvbih4KSB7XG4gICAgICBzd2l0Y2ggKGN0eC5HU3RhdGUpIHtcbiAgICAgICAgY2FzZSBTVF9FWEVDVVRJTkc6XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKChcIlxcXCJcIiArIGFjdGlvbiArIFwiXFxcIiBvbiBleGVjdXRpbmcgZ2VuZXJhdG9yXCIpKTtcbiAgICAgICAgY2FzZSBTVF9DTE9TRUQ6XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKChcIlxcXCJcIiArIGFjdGlvbiArIFwiXFxcIiBvbiBjbG9zZWQgZ2VuZXJhdG9yXCIpKTtcbiAgICAgICAgY2FzZSBTVF9ORVdCT1JOOlxuICAgICAgICAgIGlmIChhY3Rpb24gPT09ICd0aHJvdycpIHtcbiAgICAgICAgICAgIGN0eC5HU3RhdGUgPSBTVF9DTE9TRUQ7XG4gICAgICAgICAgICB0aHJvdyB4O1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoeCAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgdGhyb3cgJFR5cGVFcnJvcignU2VudCB2YWx1ZSB0byBuZXdib3JuIGdlbmVyYXRvcicpO1xuICAgICAgICBjYXNlIFNUX1NVU1BFTkRFRDpcbiAgICAgICAgICBjdHguR1N0YXRlID0gU1RfRVhFQ1VUSU5HO1xuICAgICAgICAgIGN0eC5hY3Rpb24gPSBhY3Rpb247XG4gICAgICAgICAgY3R4LnNlbnQgPSB4O1xuICAgICAgICAgIHZhciB2YWx1ZSA9IG1vdmVOZXh0KGN0eCk7XG4gICAgICAgICAgdmFyIGRvbmUgPSB2YWx1ZSA9PT0gY3R4O1xuICAgICAgICAgIGlmIChkb25lKVxuICAgICAgICAgICAgdmFsdWUgPSBjdHgucmV0dXJuVmFsdWU7XG4gICAgICAgICAgY3R4LkdTdGF0ZSA9IGRvbmUgPyBTVF9DTE9TRUQgOiBTVF9TVVNQRU5ERUQ7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICAgIGRvbmU6IGRvbmVcbiAgICAgICAgICB9O1xuICAgICAgfVxuICAgIH07XG4gIH1cbiAgZnVuY3Rpb24gZ2VuZXJhdG9yV3JhcChpbm5lckZ1bmN0aW9uLCBzZWxmKSB7XG4gICAgdmFyIG1vdmVOZXh0ID0gZ2V0TW92ZU5leHQoaW5uZXJGdW5jdGlvbiwgc2VsZik7XG4gICAgdmFyIGN0eCA9IG5ldyBHZW5lcmF0b3JDb250ZXh0KCk7XG4gICAgcmV0dXJuIGFkZEl0ZXJhdG9yKHtcbiAgICAgIG5leHQ6IGdldE5leHRPclRocm93KGN0eCwgbW92ZU5leHQsICduZXh0JyksXG4gICAgICB0aHJvdzogZ2V0TmV4dE9yVGhyb3coY3R4LCBtb3ZlTmV4dCwgJ3Rocm93JylcbiAgICB9KTtcbiAgfVxuICBmdW5jdGlvbiBBc3luY0Z1bmN0aW9uQ29udGV4dCgpIHtcbiAgICBHZW5lcmF0b3JDb250ZXh0LmNhbGwodGhpcyk7XG4gICAgdGhpcy5lcnIgPSB1bmRlZmluZWQ7XG4gICAgdmFyIGN0eCA9IHRoaXM7XG4gICAgY3R4LnJlc3VsdCA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgY3R4LnJlc29sdmUgPSByZXNvbHZlO1xuICAgICAgY3R4LnJlamVjdCA9IHJlamVjdDtcbiAgICB9KTtcbiAgfVxuICBBc3luY0Z1bmN0aW9uQ29udGV4dC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEdlbmVyYXRvckNvbnRleHQucHJvdG90eXBlKTtcbiAgQXN5bmNGdW5jdGlvbkNvbnRleHQucHJvdG90eXBlLmVuZCA9IGZ1bmN0aW9uKCkge1xuICAgIHN3aXRjaCAodGhpcy5zdGF0ZSkge1xuICAgICAgY2FzZSBFTkRfU1RBVEU6XG4gICAgICAgIHJldHVybjtcbiAgICAgIGNhc2UgUkVUSFJPV19TVEFURTpcbiAgICAgICAgdGhpcy5yZWplY3QodGhpcy5zdG9yZWRFeGNlcHRpb24pO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhpcy5yZWplY3QoZ2V0SW50ZXJuYWxFcnJvcih0aGlzLnN0YXRlKSk7XG4gICAgfVxuICB9O1xuICBmdW5jdGlvbiBhc3luY1dyYXAoaW5uZXJGdW5jdGlvbiwgc2VsZikge1xuICAgIHZhciBtb3ZlTmV4dCA9IGdldE1vdmVOZXh0KGlubmVyRnVuY3Rpb24sIHNlbGYpO1xuICAgIHZhciBjdHggPSBuZXcgQXN5bmNGdW5jdGlvbkNvbnRleHQoKTtcbiAgICBjdHguY3JlYXRlQ2FsbGJhY2sgPSBmdW5jdGlvbihuZXdTdGF0ZSkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIGN0eC5zdGF0ZSA9IG5ld1N0YXRlO1xuICAgICAgICBjdHgudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgbW92ZU5leHQoY3R4KTtcbiAgICAgIH07XG4gICAgfTtcbiAgICBjdHguY3JlYXRlRXJyYmFjayA9IGZ1bmN0aW9uKG5ld1N0YXRlKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgIGN0eC5zdGF0ZSA9IG5ld1N0YXRlO1xuICAgICAgICBjdHguZXJyID0gZXJyO1xuICAgICAgICBtb3ZlTmV4dChjdHgpO1xuICAgICAgfTtcbiAgICB9O1xuICAgIG1vdmVOZXh0KGN0eCk7XG4gICAgcmV0dXJuIGN0eC5yZXN1bHQ7XG4gIH1cbiAgZnVuY3Rpb24gZ2V0TW92ZU5leHQoaW5uZXJGdW5jdGlvbiwgc2VsZikge1xuICAgIHJldHVybiBmdW5jdGlvbihjdHgpIHtcbiAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcmV0dXJuIGlubmVyRnVuY3Rpb24uY2FsbChzZWxmLCBjdHgpO1xuICAgICAgICB9IGNhdGNoIChleCkge1xuICAgICAgICAgIGN0eC5zdG9yZWRFeGNlcHRpb24gPSBleDtcbiAgICAgICAgICB2YXIgbGFzdCA9IGN0eC50cnlTdGFja19bY3R4LnRyeVN0YWNrXy5sZW5ndGggLSAxXTtcbiAgICAgICAgICBpZiAoIWxhc3QpIHtcbiAgICAgICAgICAgIGN0eC5HU3RhdGUgPSBTVF9DTE9TRUQ7XG4gICAgICAgICAgICBjdHguc3RhdGUgPSBFTkRfU1RBVEU7XG4gICAgICAgICAgICB0aHJvdyBleDtcbiAgICAgICAgICB9XG4gICAgICAgICAgY3R4LnN0YXRlID0gbGFzdC5jYXRjaCAhPT0gdW5kZWZpbmVkID8gbGFzdC5jYXRjaCA6IGxhc3QuZmluYWxseTtcbiAgICAgICAgICBpZiAobGFzdC5maW5hbGx5RmFsbFRocm91Z2ggIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIGN0eC5maW5hbGx5RmFsbFRocm91Z2ggPSBsYXN0LmZpbmFsbHlGYWxsVGhyb3VnaDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gIH1cbiAgZnVuY3Rpb24gc2V0dXBHbG9iYWxzKGdsb2JhbCkge1xuICAgIGdsb2JhbC5TeW1ib2wgPSBTeW1ib2w7XG4gICAgcG9seWZpbGxPYmplY3QoZ2xvYmFsLk9iamVjdCk7XG4gIH1cbiAgc2V0dXBHbG9iYWxzKGdsb2JhbCk7XG4gIGdsb2JhbC4kdHJhY2V1clJ1bnRpbWUgPSB7XG4gICAgYXN5bmNXcmFwOiBhc3luY1dyYXAsXG4gICAgY3JlYXRlQ2xhc3M6IGNyZWF0ZUNsYXNzLFxuICAgIGRlZmF1bHRTdXBlckNhbGw6IGRlZmF1bHRTdXBlckNhbGwsXG4gICAgZXhwb3J0U3RhcjogZXhwb3J0U3RhcixcbiAgICBnZW5lcmF0b3JXcmFwOiBnZW5lcmF0b3JXcmFwLFxuICAgIHNldFByb3BlcnR5OiBzZXRQcm9wZXJ0eSxcbiAgICBzZXR1cEdsb2JhbHM6IHNldHVwR2xvYmFscyxcbiAgICBzcHJlYWQ6IHNwcmVhZCxcbiAgICBzdXBlckNhbGw6IHN1cGVyQ2FsbCxcbiAgICBzdXBlckdldDogc3VwZXJHZXQsXG4gICAgc3VwZXJTZXQ6IHN1cGVyU2V0LFxuICAgIHRvT2JqZWN0OiB0b09iamVjdCxcbiAgICB0b1Byb3BlcnR5OiB0b1Byb3BlcnR5LFxuICAgIHR5cGU6IHR5cGVzLFxuICAgIHR5cGVvZjogdHlwZU9mXG4gIH07XG59KSh0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJyA/IGdsb2JhbCA6IHRoaXMpO1xuKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBidWlsZEZyb21FbmNvZGVkUGFydHMob3B0X3NjaGVtZSwgb3B0X3VzZXJJbmZvLCBvcHRfZG9tYWluLCBvcHRfcG9ydCwgb3B0X3BhdGgsIG9wdF9xdWVyeURhdGEsIG9wdF9mcmFnbWVudCkge1xuICAgIHZhciBvdXQgPSBbXTtcbiAgICBpZiAob3B0X3NjaGVtZSkge1xuICAgICAgb3V0LnB1c2gob3B0X3NjaGVtZSwgJzonKTtcbiAgICB9XG4gICAgaWYgKG9wdF9kb21haW4pIHtcbiAgICAgIG91dC5wdXNoKCcvLycpO1xuICAgICAgaWYgKG9wdF91c2VySW5mbykge1xuICAgICAgICBvdXQucHVzaChvcHRfdXNlckluZm8sICdAJyk7XG4gICAgICB9XG4gICAgICBvdXQucHVzaChvcHRfZG9tYWluKTtcbiAgICAgIGlmIChvcHRfcG9ydCkge1xuICAgICAgICBvdXQucHVzaCgnOicsIG9wdF9wb3J0KTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKG9wdF9wYXRoKSB7XG4gICAgICBvdXQucHVzaChvcHRfcGF0aCk7XG4gICAgfVxuICAgIGlmIChvcHRfcXVlcnlEYXRhKSB7XG4gICAgICBvdXQucHVzaCgnPycsIG9wdF9xdWVyeURhdGEpO1xuICAgIH1cbiAgICBpZiAob3B0X2ZyYWdtZW50KSB7XG4gICAgICBvdXQucHVzaCgnIycsIG9wdF9mcmFnbWVudCk7XG4gICAgfVxuICAgIHJldHVybiBvdXQuam9pbignJyk7XG4gIH1cbiAgO1xuICB2YXIgc3BsaXRSZSA9IG5ldyBSZWdFeHAoJ14nICsgJyg/OicgKyAnKFteOi8/Iy5dKyknICsgJzopPycgKyAnKD86Ly8nICsgJyg/OihbXi8/I10qKUApPycgKyAnKFtcXFxcd1xcXFxkXFxcXC1cXFxcdTAxMDAtXFxcXHVmZmZmLiVdKiknICsgJyg/OjooWzAtOV0rKSk/JyArICcpPycgKyAnKFtePyNdKyk/JyArICcoPzpcXFxcPyhbXiNdKikpPycgKyAnKD86IyguKikpPycgKyAnJCcpO1xuICB2YXIgQ29tcG9uZW50SW5kZXggPSB7XG4gICAgU0NIRU1FOiAxLFxuICAgIFVTRVJfSU5GTzogMixcbiAgICBET01BSU46IDMsXG4gICAgUE9SVDogNCxcbiAgICBQQVRIOiA1LFxuICAgIFFVRVJZX0RBVEE6IDYsXG4gICAgRlJBR01FTlQ6IDdcbiAgfTtcbiAgZnVuY3Rpb24gc3BsaXQodXJpKSB7XG4gICAgcmV0dXJuICh1cmkubWF0Y2goc3BsaXRSZSkpO1xuICB9XG4gIGZ1bmN0aW9uIHJlbW92ZURvdFNlZ21lbnRzKHBhdGgpIHtcbiAgICBpZiAocGF0aCA9PT0gJy8nKVxuICAgICAgcmV0dXJuICcvJztcbiAgICB2YXIgbGVhZGluZ1NsYXNoID0gcGF0aFswXSA9PT0gJy8nID8gJy8nIDogJyc7XG4gICAgdmFyIHRyYWlsaW5nU2xhc2ggPSBwYXRoLnNsaWNlKC0xKSA9PT0gJy8nID8gJy8nIDogJyc7XG4gICAgdmFyIHNlZ21lbnRzID0gcGF0aC5zcGxpdCgnLycpO1xuICAgIHZhciBvdXQgPSBbXTtcbiAgICB2YXIgdXAgPSAwO1xuICAgIGZvciAodmFyIHBvcyA9IDA7IHBvcyA8IHNlZ21lbnRzLmxlbmd0aDsgcG9zKyspIHtcbiAgICAgIHZhciBzZWdtZW50ID0gc2VnbWVudHNbcG9zXTtcbiAgICAgIHN3aXRjaCAoc2VnbWVudCkge1xuICAgICAgICBjYXNlICcnOlxuICAgICAgICBjYXNlICcuJzpcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnLi4nOlxuICAgICAgICAgIGlmIChvdXQubGVuZ3RoKVxuICAgICAgICAgICAgb3V0LnBvcCgpO1xuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHVwKys7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgb3V0LnB1c2goc2VnbWVudCk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICghbGVhZGluZ1NsYXNoKSB7XG4gICAgICB3aGlsZSAodXAtLSA+IDApIHtcbiAgICAgICAgb3V0LnVuc2hpZnQoJy4uJyk7XG4gICAgICB9XG4gICAgICBpZiAob3V0Lmxlbmd0aCA9PT0gMClcbiAgICAgICAgb3V0LnB1c2goJy4nKTtcbiAgICB9XG4gICAgcmV0dXJuIGxlYWRpbmdTbGFzaCArIG91dC5qb2luKCcvJykgKyB0cmFpbGluZ1NsYXNoO1xuICB9XG4gIGZ1bmN0aW9uIGpvaW5BbmRDYW5vbmljYWxpemVQYXRoKHBhcnRzKSB7XG4gICAgdmFyIHBhdGggPSBwYXJ0c1tDb21wb25lbnRJbmRleC5QQVRIXSB8fCAnJztcbiAgICBwYXRoID0gcmVtb3ZlRG90U2VnbWVudHMocGF0aCk7XG4gICAgcGFydHNbQ29tcG9uZW50SW5kZXguUEFUSF0gPSBwYXRoO1xuICAgIHJldHVybiBidWlsZEZyb21FbmNvZGVkUGFydHMocGFydHNbQ29tcG9uZW50SW5kZXguU0NIRU1FXSwgcGFydHNbQ29tcG9uZW50SW5kZXguVVNFUl9JTkZPXSwgcGFydHNbQ29tcG9uZW50SW5kZXguRE9NQUlOXSwgcGFydHNbQ29tcG9uZW50SW5kZXguUE9SVF0sIHBhcnRzW0NvbXBvbmVudEluZGV4LlBBVEhdLCBwYXJ0c1tDb21wb25lbnRJbmRleC5RVUVSWV9EQVRBXSwgcGFydHNbQ29tcG9uZW50SW5kZXguRlJBR01FTlRdKTtcbiAgfVxuICBmdW5jdGlvbiBjYW5vbmljYWxpemVVcmwodXJsKSB7XG4gICAgdmFyIHBhcnRzID0gc3BsaXQodXJsKTtcbiAgICByZXR1cm4gam9pbkFuZENhbm9uaWNhbGl6ZVBhdGgocGFydHMpO1xuICB9XG4gIGZ1bmN0aW9uIHJlc29sdmVVcmwoYmFzZSwgdXJsKSB7XG4gICAgdmFyIHBhcnRzID0gc3BsaXQodXJsKTtcbiAgICB2YXIgYmFzZVBhcnRzID0gc3BsaXQoYmFzZSk7XG4gICAgaWYgKHBhcnRzW0NvbXBvbmVudEluZGV4LlNDSEVNRV0pIHtcbiAgICAgIHJldHVybiBqb2luQW5kQ2Fub25pY2FsaXplUGF0aChwYXJ0cyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBhcnRzW0NvbXBvbmVudEluZGV4LlNDSEVNRV0gPSBiYXNlUGFydHNbQ29tcG9uZW50SW5kZXguU0NIRU1FXTtcbiAgICB9XG4gICAgZm9yICh2YXIgaSA9IENvbXBvbmVudEluZGV4LlNDSEVNRTsgaSA8PSBDb21wb25lbnRJbmRleC5QT1JUOyBpKyspIHtcbiAgICAgIGlmICghcGFydHNbaV0pIHtcbiAgICAgICAgcGFydHNbaV0gPSBiYXNlUGFydHNbaV07XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChwYXJ0c1tDb21wb25lbnRJbmRleC5QQVRIXVswXSA9PSAnLycpIHtcbiAgICAgIHJldHVybiBqb2luQW5kQ2Fub25pY2FsaXplUGF0aChwYXJ0cyk7XG4gICAgfVxuICAgIHZhciBwYXRoID0gYmFzZVBhcnRzW0NvbXBvbmVudEluZGV4LlBBVEhdO1xuICAgIHZhciBpbmRleCA9IHBhdGgubGFzdEluZGV4T2YoJy8nKTtcbiAgICBwYXRoID0gcGF0aC5zbGljZSgwLCBpbmRleCArIDEpICsgcGFydHNbQ29tcG9uZW50SW5kZXguUEFUSF07XG4gICAgcGFydHNbQ29tcG9uZW50SW5kZXguUEFUSF0gPSBwYXRoO1xuICAgIHJldHVybiBqb2luQW5kQ2Fub25pY2FsaXplUGF0aChwYXJ0cyk7XG4gIH1cbiAgZnVuY3Rpb24gaXNBYnNvbHV0ZShuYW1lKSB7XG4gICAgaWYgKCFuYW1lKVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIGlmIChuYW1lWzBdID09PSAnLycpXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB2YXIgcGFydHMgPSBzcGxpdChuYW1lKTtcbiAgICBpZiAocGFydHNbQ29tcG9uZW50SW5kZXguU0NIRU1FXSlcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICAkdHJhY2V1clJ1bnRpbWUuY2Fub25pY2FsaXplVXJsID0gY2Fub25pY2FsaXplVXJsO1xuICAkdHJhY2V1clJ1bnRpbWUuaXNBYnNvbHV0ZSA9IGlzQWJzb2x1dGU7XG4gICR0cmFjZXVyUnVudGltZS5yZW1vdmVEb3RTZWdtZW50cyA9IHJlbW92ZURvdFNlZ21lbnRzO1xuICAkdHJhY2V1clJ1bnRpbWUucmVzb2x2ZVVybCA9IHJlc29sdmVVcmw7XG59KSgpO1xuKGZ1bmN0aW9uKGdsb2JhbCkge1xuICAndXNlIHN0cmljdCc7XG4gIHZhciAkX18yID0gJHRyYWNldXJSdW50aW1lLFxuICAgICAgY2Fub25pY2FsaXplVXJsID0gJF9fMi5jYW5vbmljYWxpemVVcmwsXG4gICAgICByZXNvbHZlVXJsID0gJF9fMi5yZXNvbHZlVXJsLFxuICAgICAgaXNBYnNvbHV0ZSA9ICRfXzIuaXNBYnNvbHV0ZTtcbiAgdmFyIG1vZHVsZUluc3RhbnRpYXRvcnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICB2YXIgYmFzZVVSTDtcbiAgaWYgKGdsb2JhbC5sb2NhdGlvbiAmJiBnbG9iYWwubG9jYXRpb24uaHJlZilcbiAgICBiYXNlVVJMID0gcmVzb2x2ZVVybChnbG9iYWwubG9jYXRpb24uaHJlZiwgJy4vJyk7XG4gIGVsc2VcbiAgICBiYXNlVVJMID0gJyc7XG4gIHZhciBVbmNvYXRlZE1vZHVsZUVudHJ5ID0gZnVuY3Rpb24gVW5jb2F0ZWRNb2R1bGVFbnRyeSh1cmwsIHVuY29hdGVkTW9kdWxlKSB7XG4gICAgdGhpcy51cmwgPSB1cmw7XG4gICAgdGhpcy52YWx1ZV8gPSB1bmNvYXRlZE1vZHVsZTtcbiAgfTtcbiAgKCR0cmFjZXVyUnVudGltZS5jcmVhdGVDbGFzcykoVW5jb2F0ZWRNb2R1bGVFbnRyeSwge30sIHt9KTtcbiAgdmFyIFVuY29hdGVkTW9kdWxlSW5zdGFudGlhdG9yID0gZnVuY3Rpb24gVW5jb2F0ZWRNb2R1bGVJbnN0YW50aWF0b3IodXJsLCBmdW5jKSB7XG4gICAgJHRyYWNldXJSdW50aW1lLnN1cGVyQ2FsbCh0aGlzLCAkVW5jb2F0ZWRNb2R1bGVJbnN0YW50aWF0b3IucHJvdG90eXBlLCBcImNvbnN0cnVjdG9yXCIsIFt1cmwsIG51bGxdKTtcbiAgICB0aGlzLmZ1bmMgPSBmdW5jO1xuICB9O1xuICB2YXIgJFVuY29hdGVkTW9kdWxlSW5zdGFudGlhdG9yID0gVW5jb2F0ZWRNb2R1bGVJbnN0YW50aWF0b3I7XG4gICgkdHJhY2V1clJ1bnRpbWUuY3JlYXRlQ2xhc3MpKFVuY29hdGVkTW9kdWxlSW5zdGFudGlhdG9yLCB7Z2V0VW5jb2F0ZWRNb2R1bGU6IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHRoaXMudmFsdWVfKVxuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZV87XG4gICAgICByZXR1cm4gdGhpcy52YWx1ZV8gPSB0aGlzLmZ1bmMuY2FsbChnbG9iYWwpO1xuICAgIH19LCB7fSwgVW5jb2F0ZWRNb2R1bGVFbnRyeSk7XG4gIGZ1bmN0aW9uIGdldFVuY29hdGVkTW9kdWxlSW5zdGFudGlhdG9yKG5hbWUpIHtcbiAgICBpZiAoIW5hbWUpXG4gICAgICByZXR1cm47XG4gICAgdmFyIHVybCA9IE1vZHVsZVN0b3JlLm5vcm1hbGl6ZShuYW1lKTtcbiAgICByZXR1cm4gbW9kdWxlSW5zdGFudGlhdG9yc1t1cmxdO1xuICB9XG4gIDtcbiAgdmFyIG1vZHVsZUluc3RhbmNlcyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gIHZhciBsaXZlTW9kdWxlU2VudGluZWwgPSB7fTtcbiAgZnVuY3Rpb24gTW9kdWxlKHVuY29hdGVkTW9kdWxlKSB7XG4gICAgdmFyIGlzTGl2ZSA9IGFyZ3VtZW50c1sxXTtcbiAgICB2YXIgY29hdGVkTW9kdWxlID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh1bmNvYXRlZE1vZHVsZSkuZm9yRWFjaCgoZnVuY3Rpb24obmFtZSkge1xuICAgICAgdmFyIGdldHRlcixcbiAgICAgICAgICB2YWx1ZTtcbiAgICAgIGlmIChpc0xpdmUgPT09IGxpdmVNb2R1bGVTZW50aW5lbCkge1xuICAgICAgICB2YXIgZGVzY3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHVuY29hdGVkTW9kdWxlLCBuYW1lKTtcbiAgICAgICAgaWYgKGRlc2NyLmdldClcbiAgICAgICAgICBnZXR0ZXIgPSBkZXNjci5nZXQ7XG4gICAgICB9XG4gICAgICBpZiAoIWdldHRlcikge1xuICAgICAgICB2YWx1ZSA9IHVuY29hdGVkTW9kdWxlW25hbWVdO1xuICAgICAgICBnZXR0ZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoY29hdGVkTW9kdWxlLCBuYW1lLCB7XG4gICAgICAgIGdldDogZ2V0dGVyLFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICB9KTtcbiAgICB9KSk7XG4gICAgT2JqZWN0LnByZXZlbnRFeHRlbnNpb25zKGNvYXRlZE1vZHVsZSk7XG4gICAgcmV0dXJuIGNvYXRlZE1vZHVsZTtcbiAgfVxuICB2YXIgTW9kdWxlU3RvcmUgPSB7XG4gICAgbm9ybWFsaXplOiBmdW5jdGlvbihuYW1lLCByZWZlcmVyTmFtZSwgcmVmZXJlckFkZHJlc3MpIHtcbiAgICAgIGlmICh0eXBlb2YgbmFtZSAhPT0gXCJzdHJpbmdcIilcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIm1vZHVsZSBuYW1lIG11c3QgYmUgYSBzdHJpbmcsIG5vdCBcIiArIHR5cGVvZiBuYW1lKTtcbiAgICAgIGlmIChpc0Fic29sdXRlKG5hbWUpKVxuICAgICAgICByZXR1cm4gY2Fub25pY2FsaXplVXJsKG5hbWUpO1xuICAgICAgaWYgKC9bXlxcLl1cXC9cXC5cXC5cXC8vLnRlc3QobmFtZSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdtb2R1bGUgbmFtZSBlbWJlZHMgLy4uLzogJyArIG5hbWUpO1xuICAgICAgfVxuICAgICAgaWYgKG5hbWVbMF0gPT09ICcuJyAmJiByZWZlcmVyTmFtZSlcbiAgICAgICAgcmV0dXJuIHJlc29sdmVVcmwocmVmZXJlck5hbWUsIG5hbWUpO1xuICAgICAgcmV0dXJuIGNhbm9uaWNhbGl6ZVVybChuYW1lKTtcbiAgICB9LFxuICAgIGdldDogZnVuY3Rpb24obm9ybWFsaXplZE5hbWUpIHtcbiAgICAgIHZhciBtID0gZ2V0VW5jb2F0ZWRNb2R1bGVJbnN0YW50aWF0b3Iobm9ybWFsaXplZE5hbWUpO1xuICAgICAgaWYgKCFtKVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgdmFyIG1vZHVsZUluc3RhbmNlID0gbW9kdWxlSW5zdGFuY2VzW20udXJsXTtcbiAgICAgIGlmIChtb2R1bGVJbnN0YW5jZSlcbiAgICAgICAgcmV0dXJuIG1vZHVsZUluc3RhbmNlO1xuICAgICAgbW9kdWxlSW5zdGFuY2UgPSBNb2R1bGUobS5nZXRVbmNvYXRlZE1vZHVsZSgpLCBsaXZlTW9kdWxlU2VudGluZWwpO1xuICAgICAgcmV0dXJuIG1vZHVsZUluc3RhbmNlc1ttLnVybF0gPSBtb2R1bGVJbnN0YW5jZTtcbiAgICB9LFxuICAgIHNldDogZnVuY3Rpb24obm9ybWFsaXplZE5hbWUsIG1vZHVsZSkge1xuICAgICAgbm9ybWFsaXplZE5hbWUgPSBTdHJpbmcobm9ybWFsaXplZE5hbWUpO1xuICAgICAgbW9kdWxlSW5zdGFudGlhdG9yc1tub3JtYWxpemVkTmFtZV0gPSBuZXcgVW5jb2F0ZWRNb2R1bGVJbnN0YW50aWF0b3Iobm9ybWFsaXplZE5hbWUsIChmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIG1vZHVsZTtcbiAgICAgIH0pKTtcbiAgICAgIG1vZHVsZUluc3RhbmNlc1tub3JtYWxpemVkTmFtZV0gPSBtb2R1bGU7XG4gICAgfSxcbiAgICBnZXQgYmFzZVVSTCgpIHtcbiAgICAgIHJldHVybiBiYXNlVVJMO1xuICAgIH0sXG4gICAgc2V0IGJhc2VVUkwodikge1xuICAgICAgYmFzZVVSTCA9IFN0cmluZyh2KTtcbiAgICB9LFxuICAgIHJlZ2lzdGVyTW9kdWxlOiBmdW5jdGlvbihuYW1lLCBmdW5jKSB7XG4gICAgICB2YXIgbm9ybWFsaXplZE5hbWUgPSBNb2R1bGVTdG9yZS5ub3JtYWxpemUobmFtZSk7XG4gICAgICBpZiAobW9kdWxlSW5zdGFudGlhdG9yc1tub3JtYWxpemVkTmFtZV0pXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignZHVwbGljYXRlIG1vZHVsZSBuYW1lZCAnICsgbm9ybWFsaXplZE5hbWUpO1xuICAgICAgbW9kdWxlSW5zdGFudGlhdG9yc1tub3JtYWxpemVkTmFtZV0gPSBuZXcgVW5jb2F0ZWRNb2R1bGVJbnN0YW50aWF0b3Iobm9ybWFsaXplZE5hbWUsIGZ1bmMpO1xuICAgIH0sXG4gICAgYnVuZGxlU3RvcmU6IE9iamVjdC5jcmVhdGUobnVsbCksXG4gICAgcmVnaXN0ZXI6IGZ1bmN0aW9uKG5hbWUsIGRlcHMsIGZ1bmMpIHtcbiAgICAgIGlmICghZGVwcyB8fCAhZGVwcy5sZW5ndGgpIHtcbiAgICAgICAgdGhpcy5yZWdpc3Rlck1vZHVsZShuYW1lLCBmdW5jKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuYnVuZGxlU3RvcmVbbmFtZV0gPSB7XG4gICAgICAgICAgZGVwczogZGVwcyxcbiAgICAgICAgICBleGVjdXRlOiBmdW5jXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSxcbiAgICBnZXRBbm9ueW1vdXNNb2R1bGU6IGZ1bmN0aW9uKGZ1bmMpIHtcbiAgICAgIHJldHVybiBuZXcgTW9kdWxlKGZ1bmMuY2FsbChnbG9iYWwpLCBsaXZlTW9kdWxlU2VudGluZWwpO1xuICAgIH0sXG4gICAgZ2V0Rm9yVGVzdGluZzogZnVuY3Rpb24obmFtZSkge1xuICAgICAgdmFyICRfXzAgPSB0aGlzO1xuICAgICAgaWYgKCF0aGlzLnRlc3RpbmdQcmVmaXhfKSB7XG4gICAgICAgIE9iamVjdC5rZXlzKG1vZHVsZUluc3RhbmNlcykuc29tZSgoZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgICAgdmFyIG0gPSAvKHRyYWNldXJAW15cXC9dKlxcLykvLmV4ZWMoa2V5KTtcbiAgICAgICAgICBpZiAobSkge1xuICAgICAgICAgICAgJF9fMC50ZXN0aW5nUHJlZml4XyA9IG1bMV07XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLmdldCh0aGlzLnRlc3RpbmdQcmVmaXhfICsgbmFtZSk7XG4gICAgfVxuICB9O1xuICBNb2R1bGVTdG9yZS5zZXQoJ0B0cmFjZXVyL3NyYy9ydW50aW1lL01vZHVsZVN0b3JlJywgbmV3IE1vZHVsZSh7TW9kdWxlU3RvcmU6IE1vZHVsZVN0b3JlfSkpO1xuICB2YXIgc2V0dXBHbG9iYWxzID0gJHRyYWNldXJSdW50aW1lLnNldHVwR2xvYmFscztcbiAgJHRyYWNldXJSdW50aW1lLnNldHVwR2xvYmFscyA9IGZ1bmN0aW9uKGdsb2JhbCkge1xuICAgIHNldHVwR2xvYmFscyhnbG9iYWwpO1xuICB9O1xuICAkdHJhY2V1clJ1bnRpbWUuTW9kdWxlU3RvcmUgPSBNb2R1bGVTdG9yZTtcbiAgZ2xvYmFsLlN5c3RlbSA9IHtcbiAgICByZWdpc3RlcjogTW9kdWxlU3RvcmUucmVnaXN0ZXIuYmluZChNb2R1bGVTdG9yZSksXG4gICAgZ2V0OiBNb2R1bGVTdG9yZS5nZXQsXG4gICAgc2V0OiBNb2R1bGVTdG9yZS5zZXQsXG4gICAgbm9ybWFsaXplOiBNb2R1bGVTdG9yZS5ub3JtYWxpemVcbiAgfTtcbiAgJHRyYWNldXJSdW50aW1lLmdldE1vZHVsZUltcGwgPSBmdW5jdGlvbihuYW1lKSB7XG4gICAgdmFyIGluc3RhbnRpYXRvciA9IGdldFVuY29hdGVkTW9kdWxlSW5zdGFudGlhdG9yKG5hbWUpO1xuICAgIHJldHVybiBpbnN0YW50aWF0b3IgJiYgaW5zdGFudGlhdG9yLmdldFVuY29hdGVkTW9kdWxlKCk7XG4gIH07XG59KSh0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJyA/IGdsb2JhbCA6IHRoaXMpO1xuU3lzdGVtLnJlZ2lzdGVyKFwidHJhY2V1ci1ydW50aW1lQDAuMC4zMi9zcmMvcnVudGltZS9wb2x5ZmlsbHMvdXRpbHNcIiwgW10sIGZ1bmN0aW9uKCkge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgdmFyIF9fbW9kdWxlTmFtZSA9IFwidHJhY2V1ci1ydW50aW1lQDAuMC4zMi9zcmMvcnVudGltZS9wb2x5ZmlsbHMvdXRpbHNcIjtcbiAgdmFyIHRvT2JqZWN0ID0gJHRyYWNldXJSdW50aW1lLnRvT2JqZWN0O1xuICBmdW5jdGlvbiB0b1VpbnQzMih4KSB7XG4gICAgcmV0dXJuIHggfCAwO1xuICB9XG4gIHJldHVybiB7XG4gICAgZ2V0IHRvT2JqZWN0KCkge1xuICAgICAgcmV0dXJuIHRvT2JqZWN0O1xuICAgIH0sXG4gICAgZ2V0IHRvVWludDMyKCkge1xuICAgICAgcmV0dXJuIHRvVWludDMyO1xuICAgIH1cbiAgfTtcbn0pO1xuU3lzdGVtLnJlZ2lzdGVyKFwidHJhY2V1ci1ydW50aW1lQDAuMC4zMi9zcmMvcnVudGltZS9wb2x5ZmlsbHMvQXJyYXlJdGVyYXRvclwiLCBbXSwgZnVuY3Rpb24oKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuICB2YXIgJF9fNDtcbiAgdmFyIF9fbW9kdWxlTmFtZSA9IFwidHJhY2V1ci1ydW50aW1lQDAuMC4zMi9zcmMvcnVudGltZS9wb2x5ZmlsbHMvQXJyYXlJdGVyYXRvclwiO1xuICB2YXIgJF9fNSA9IFN5c3RlbS5nZXQoXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjMyL3NyYy9ydW50aW1lL3BvbHlmaWxscy91dGlsc1wiKSxcbiAgICAgIHRvT2JqZWN0ID0gJF9fNS50b09iamVjdCxcbiAgICAgIHRvVWludDMyID0gJF9fNS50b1VpbnQzMjtcbiAgdmFyIEFSUkFZX0lURVJBVE9SX0tJTkRfS0VZUyA9IDE7XG4gIHZhciBBUlJBWV9JVEVSQVRPUl9LSU5EX1ZBTFVFUyA9IDI7XG4gIHZhciBBUlJBWV9JVEVSQVRPUl9LSU5EX0VOVFJJRVMgPSAzO1xuICB2YXIgQXJyYXlJdGVyYXRvciA9IGZ1bmN0aW9uIEFycmF5SXRlcmF0b3IoKSB7fTtcbiAgKCR0cmFjZXVyUnVudGltZS5jcmVhdGVDbGFzcykoQXJyYXlJdGVyYXRvciwgKCRfXzQgPSB7fSwgT2JqZWN0LmRlZmluZVByb3BlcnR5KCRfXzQsIFwibmV4dFwiLCB7XG4gICAgdmFsdWU6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGl0ZXJhdG9yID0gdG9PYmplY3QodGhpcyk7XG4gICAgICB2YXIgYXJyYXkgPSBpdGVyYXRvci5pdGVyYXRvck9iamVjdF87XG4gICAgICBpZiAoIWFycmF5KSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ09iamVjdCBpcyBub3QgYW4gQXJyYXlJdGVyYXRvcicpO1xuICAgICAgfVxuICAgICAgdmFyIGluZGV4ID0gaXRlcmF0b3IuYXJyYXlJdGVyYXRvck5leHRJbmRleF87XG4gICAgICB2YXIgaXRlbUtpbmQgPSBpdGVyYXRvci5hcnJheUl0ZXJhdGlvbktpbmRfO1xuICAgICAgdmFyIGxlbmd0aCA9IHRvVWludDMyKGFycmF5Lmxlbmd0aCk7XG4gICAgICBpZiAoaW5kZXggPj0gbGVuZ3RoKSB7XG4gICAgICAgIGl0ZXJhdG9yLmFycmF5SXRlcmF0b3JOZXh0SW5kZXhfID0gSW5maW5pdHk7XG4gICAgICAgIHJldHVybiBjcmVhdGVJdGVyYXRvclJlc3VsdE9iamVjdCh1bmRlZmluZWQsIHRydWUpO1xuICAgICAgfVxuICAgICAgaXRlcmF0b3IuYXJyYXlJdGVyYXRvck5leHRJbmRleF8gPSBpbmRleCArIDE7XG4gICAgICBpZiAoaXRlbUtpbmQgPT0gQVJSQVlfSVRFUkFUT1JfS0lORF9WQUxVRVMpXG4gICAgICAgIHJldHVybiBjcmVhdGVJdGVyYXRvclJlc3VsdE9iamVjdChhcnJheVtpbmRleF0sIGZhbHNlKTtcbiAgICAgIGlmIChpdGVtS2luZCA9PSBBUlJBWV9JVEVSQVRPUl9LSU5EX0VOVFJJRVMpXG4gICAgICAgIHJldHVybiBjcmVhdGVJdGVyYXRvclJlc3VsdE9iamVjdChbaW5kZXgsIGFycmF5W2luZGV4XV0sIGZhbHNlKTtcbiAgICAgIHJldHVybiBjcmVhdGVJdGVyYXRvclJlc3VsdE9iamVjdChpbmRleCwgZmFsc2UpO1xuICAgIH0sXG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgd3JpdGFibGU6IHRydWVcbiAgfSksIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSgkX180LCBTeW1ib2wuaXRlcmF0b3IsIHtcbiAgICB2YWx1ZTogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgIHdyaXRhYmxlOiB0cnVlXG4gIH0pLCAkX180KSwge30pO1xuICBmdW5jdGlvbiBjcmVhdGVBcnJheUl0ZXJhdG9yKGFycmF5LCBraW5kKSB7XG4gICAgdmFyIG9iamVjdCA9IHRvT2JqZWN0KGFycmF5KTtcbiAgICB2YXIgaXRlcmF0b3IgPSBuZXcgQXJyYXlJdGVyYXRvcjtcbiAgICBpdGVyYXRvci5pdGVyYXRvck9iamVjdF8gPSBvYmplY3Q7XG4gICAgaXRlcmF0b3IuYXJyYXlJdGVyYXRvck5leHRJbmRleF8gPSAwO1xuICAgIGl0ZXJhdG9yLmFycmF5SXRlcmF0aW9uS2luZF8gPSBraW5kO1xuICAgIHJldHVybiBpdGVyYXRvcjtcbiAgfVxuICBmdW5jdGlvbiBjcmVhdGVJdGVyYXRvclJlc3VsdE9iamVjdCh2YWx1ZSwgZG9uZSkge1xuICAgIHJldHVybiB7XG4gICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICBkb25lOiBkb25lXG4gICAgfTtcbiAgfVxuICBmdW5jdGlvbiBlbnRyaWVzKCkge1xuICAgIHJldHVybiBjcmVhdGVBcnJheUl0ZXJhdG9yKHRoaXMsIEFSUkFZX0lURVJBVE9SX0tJTkRfRU5UUklFUyk7XG4gIH1cbiAgZnVuY3Rpb24ga2V5cygpIHtcbiAgICByZXR1cm4gY3JlYXRlQXJyYXlJdGVyYXRvcih0aGlzLCBBUlJBWV9JVEVSQVRPUl9LSU5EX0tFWVMpO1xuICB9XG4gIGZ1bmN0aW9uIHZhbHVlcygpIHtcbiAgICByZXR1cm4gY3JlYXRlQXJyYXlJdGVyYXRvcih0aGlzLCBBUlJBWV9JVEVSQVRPUl9LSU5EX1ZBTFVFUyk7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBnZXQgZW50cmllcygpIHtcbiAgICAgIHJldHVybiBlbnRyaWVzO1xuICAgIH0sXG4gICAgZ2V0IGtleXMoKSB7XG4gICAgICByZXR1cm4ga2V5cztcbiAgICB9LFxuICAgIGdldCB2YWx1ZXMoKSB7XG4gICAgICByZXR1cm4gdmFsdWVzO1xuICAgIH1cbiAgfTtcbn0pO1xuU3lzdGVtLnJlZ2lzdGVyKFwidHJhY2V1ci1ydW50aW1lQDAuMC4zMi9ub2RlX21vZHVsZXMvcnN2cC9saWIvcnN2cC9hc2FwXCIsIFtdLCBmdW5jdGlvbigpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG4gIHZhciBfX21vZHVsZU5hbWUgPSBcInRyYWNldXItcnVudGltZUAwLjAuMzIvbm9kZV9tb2R1bGVzL3JzdnAvbGliL3JzdnAvYXNhcFwiO1xuICB2YXIgJF9fZGVmYXVsdCA9IGZ1bmN0aW9uIGFzYXAoY2FsbGJhY2ssIGFyZykge1xuICAgIHZhciBsZW5ndGggPSBxdWV1ZS5wdXNoKFtjYWxsYmFjaywgYXJnXSk7XG4gICAgaWYgKGxlbmd0aCA9PT0gMSkge1xuICAgICAgc2NoZWR1bGVGbHVzaCgpO1xuICAgIH1cbiAgfTtcbiAgdmFyIGJyb3dzZXJHbG9iYWwgPSAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpID8gd2luZG93IDoge307XG4gIHZhciBCcm93c2VyTXV0YXRpb25PYnNlcnZlciA9IGJyb3dzZXJHbG9iYWwuTXV0YXRpb25PYnNlcnZlciB8fCBicm93c2VyR2xvYmFsLldlYktpdE11dGF0aW9uT2JzZXJ2ZXI7XG4gIGZ1bmN0aW9uIHVzZU5leHRUaWNrKCkge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHByb2Nlc3MubmV4dFRpY2soZmx1c2gpO1xuICAgIH07XG4gIH1cbiAgZnVuY3Rpb24gdXNlTXV0YXRpb25PYnNlcnZlcigpIHtcbiAgICB2YXIgaXRlcmF0aW9ucyA9IDA7XG4gICAgdmFyIG9ic2VydmVyID0gbmV3IEJyb3dzZXJNdXRhdGlvbk9ic2VydmVyKGZsdXNoKTtcbiAgICB2YXIgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcnKTtcbiAgICBvYnNlcnZlci5vYnNlcnZlKG5vZGUsIHtjaGFyYWN0ZXJEYXRhOiB0cnVlfSk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgbm9kZS5kYXRhID0gKGl0ZXJhdGlvbnMgPSArK2l0ZXJhdGlvbnMgJSAyKTtcbiAgICB9O1xuICB9XG4gIGZ1bmN0aW9uIHVzZVNldFRpbWVvdXQoKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgc2V0VGltZW91dChmbHVzaCwgMSk7XG4gICAgfTtcbiAgfVxuICB2YXIgcXVldWUgPSBbXTtcbiAgZnVuY3Rpb24gZmx1c2goKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBxdWV1ZS5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHR1cGxlID0gcXVldWVbaV07XG4gICAgICB2YXIgY2FsbGJhY2sgPSB0dXBsZVswXSxcbiAgICAgICAgICBhcmcgPSB0dXBsZVsxXTtcbiAgICAgIGNhbGxiYWNrKGFyZyk7XG4gICAgfVxuICAgIHF1ZXVlID0gW107XG4gIH1cbiAgdmFyIHNjaGVkdWxlRmx1c2g7XG4gIGlmICh0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcgJiYge30udG9TdHJpbmcuY2FsbChwcm9jZXNzKSA9PT0gJ1tvYmplY3QgcHJvY2Vzc10nKSB7XG4gICAgc2NoZWR1bGVGbHVzaCA9IHVzZU5leHRUaWNrKCk7XG4gIH0gZWxzZSBpZiAoQnJvd3Nlck11dGF0aW9uT2JzZXJ2ZXIpIHtcbiAgICBzY2hlZHVsZUZsdXNoID0gdXNlTXV0YXRpb25PYnNlcnZlcigpO1xuICB9IGVsc2Uge1xuICAgIHNjaGVkdWxlRmx1c2ggPSB1c2VTZXRUaW1lb3V0KCk7XG4gIH1cbiAgcmV0dXJuIHtnZXQgZGVmYXVsdCgpIHtcbiAgICAgIHJldHVybiAkX19kZWZhdWx0O1xuICAgIH19O1xufSk7XG5TeXN0ZW0ucmVnaXN0ZXIoXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjMyL3NyYy9ydW50aW1lL3BvbHlmaWxscy9Qcm9taXNlXCIsIFtdLCBmdW5jdGlvbigpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG4gIHZhciBfX21vZHVsZU5hbWUgPSBcInRyYWNldXItcnVudGltZUAwLjAuMzIvc3JjL3J1bnRpbWUvcG9seWZpbGxzL1Byb21pc2VcIjtcbiAgdmFyIGFzeW5jID0gU3lzdGVtLmdldChcInRyYWNldXItcnVudGltZUAwLjAuMzIvbm9kZV9tb2R1bGVzL3JzdnAvbGliL3JzdnAvYXNhcFwiKS5kZWZhdWx0O1xuICBmdW5jdGlvbiBpc1Byb21pc2UoeCkge1xuICAgIHJldHVybiB4ICYmIHR5cGVvZiB4ID09PSAnb2JqZWN0JyAmJiB4LnN0YXR1c18gIT09IHVuZGVmaW5lZDtcbiAgfVxuICBmdW5jdGlvbiBjaGFpbihwcm9taXNlKSB7XG4gICAgdmFyIG9uUmVzb2x2ZSA9IGFyZ3VtZW50c1sxXSAhPT0gKHZvaWQgMCkgPyBhcmd1bWVudHNbMV0gOiAoZnVuY3Rpb24oeCkge1xuICAgICAgcmV0dXJuIHg7XG4gICAgfSk7XG4gICAgdmFyIG9uUmVqZWN0ID0gYXJndW1lbnRzWzJdICE9PSAodm9pZCAwKSA/IGFyZ3VtZW50c1syXSA6IChmdW5jdGlvbihlKSB7XG4gICAgICB0aHJvdyBlO1xuICAgIH0pO1xuICAgIHZhciBkZWZlcnJlZCA9IGdldERlZmVycmVkKHByb21pc2UuY29uc3RydWN0b3IpO1xuICAgIHN3aXRjaCAocHJvbWlzZS5zdGF0dXNfKSB7XG4gICAgICBjYXNlIHVuZGVmaW5lZDpcbiAgICAgICAgdGhyb3cgVHlwZUVycm9yO1xuICAgICAgY2FzZSAncGVuZGluZyc6XG4gICAgICAgIHByb21pc2Uub25SZXNvbHZlXy5wdXNoKFtkZWZlcnJlZCwgb25SZXNvbHZlXSk7XG4gICAgICAgIHByb21pc2Uub25SZWplY3RfLnB1c2goW2RlZmVycmVkLCBvblJlamVjdF0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3Jlc29sdmVkJzpcbiAgICAgICAgcHJvbWlzZVJlYWN0KGRlZmVycmVkLCBvblJlc29sdmUsIHByb21pc2UudmFsdWVfKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdyZWplY3RlZCc6XG4gICAgICAgIHByb21pc2VSZWFjdChkZWZlcnJlZCwgb25SZWplY3QsIHByb21pc2UudmFsdWVfKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICB9XG4gIGZ1bmN0aW9uIGdldERlZmVycmVkKEMpIHtcbiAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgcmVzdWx0LnByb21pc2UgPSBuZXcgQygoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICByZXN1bHQucmVzb2x2ZSA9IHJlc29sdmU7XG4gICAgICByZXN1bHQucmVqZWN0ID0gcmVqZWN0O1xuICAgIH0pKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIHZhciBQcm9taXNlID0gZnVuY3Rpb24gUHJvbWlzZShyZXNvbHZlcikge1xuICAgIHZhciAkX182ID0gdGhpcztcbiAgICB0aGlzLnN0YXR1c18gPSAncGVuZGluZyc7XG4gICAgdGhpcy5vblJlc29sdmVfID0gW107XG4gICAgdGhpcy5vblJlamVjdF8gPSBbXTtcbiAgICByZXNvbHZlcigoZnVuY3Rpb24oeCkge1xuICAgICAgcHJvbWlzZVJlc29sdmUoJF9fNiwgeCk7XG4gICAgfSksIChmdW5jdGlvbihyKSB7XG4gICAgICBwcm9taXNlUmVqZWN0KCRfXzYsIHIpO1xuICAgIH0pKTtcbiAgfTtcbiAgKCR0cmFjZXVyUnVudGltZS5jcmVhdGVDbGFzcykoUHJvbWlzZSwge1xuICAgIGNhdGNoOiBmdW5jdGlvbihvblJlamVjdCkge1xuICAgICAgcmV0dXJuIHRoaXMudGhlbih1bmRlZmluZWQsIG9uUmVqZWN0KTtcbiAgICB9LFxuICAgIHRoZW46IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIG9uUmVzb2x2ZSA9IGFyZ3VtZW50c1swXSAhPT0gKHZvaWQgMCkgPyBhcmd1bWVudHNbMF0gOiAoZnVuY3Rpb24oeCkge1xuICAgICAgICByZXR1cm4geDtcbiAgICAgIH0pO1xuICAgICAgdmFyIG9uUmVqZWN0ID0gYXJndW1lbnRzWzFdO1xuICAgICAgdmFyICRfXzYgPSB0aGlzO1xuICAgICAgdmFyIGNvbnN0cnVjdG9yID0gdGhpcy5jb25zdHJ1Y3RvcjtcbiAgICAgIHJldHVybiBjaGFpbih0aGlzLCAoZnVuY3Rpb24oeCkge1xuICAgICAgICB4ID0gcHJvbWlzZUNvZXJjZShjb25zdHJ1Y3RvciwgeCk7XG4gICAgICAgIHJldHVybiB4ID09PSAkX182ID8gb25SZWplY3QobmV3IFR5cGVFcnJvcikgOiBpc1Byb21pc2UoeCkgPyB4LnRoZW4ob25SZXNvbHZlLCBvblJlamVjdCkgOiBvblJlc29sdmUoeCk7XG4gICAgICB9KSwgb25SZWplY3QpO1xuICAgIH1cbiAgfSwge1xuICAgIHJlc29sdmU6IGZ1bmN0aW9uKHgpIHtcbiAgICAgIHJldHVybiBuZXcgdGhpcygoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIHJlc29sdmUoeCk7XG4gICAgICB9KSk7XG4gICAgfSxcbiAgICByZWplY3Q6IGZ1bmN0aW9uKHIpIHtcbiAgICAgIHJldHVybiBuZXcgdGhpcygoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIHJlamVjdChyKTtcbiAgICAgIH0pKTtcbiAgICB9LFxuICAgIGNhc3Q6IGZ1bmN0aW9uKHgpIHtcbiAgICAgIGlmICh4IGluc3RhbmNlb2YgdGhpcylcbiAgICAgICAgcmV0dXJuIHg7XG4gICAgICBpZiAoaXNQcm9taXNlKHgpKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSBnZXREZWZlcnJlZCh0aGlzKTtcbiAgICAgICAgY2hhaW4oeCwgcmVzdWx0LnJlc29sdmUsIHJlc3VsdC5yZWplY3QpO1xuICAgICAgICByZXR1cm4gcmVzdWx0LnByb21pc2U7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5yZXNvbHZlKHgpO1xuICAgIH0sXG4gICAgYWxsOiBmdW5jdGlvbih2YWx1ZXMpIHtcbiAgICAgIHZhciBkZWZlcnJlZCA9IGdldERlZmVycmVkKHRoaXMpO1xuICAgICAgdmFyIGNvdW50ID0gMDtcbiAgICAgIHZhciByZXNvbHV0aW9ucyA9IFtdO1xuICAgICAgdHJ5IHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2YWx1ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICArK2NvdW50O1xuICAgICAgICAgIHRoaXMuY2FzdCh2YWx1ZXNbaV0pLnRoZW4oZnVuY3Rpb24oaSwgeCkge1xuICAgICAgICAgICAgcmVzb2x1dGlvbnNbaV0gPSB4O1xuICAgICAgICAgICAgaWYgKC0tY291bnQgPT09IDApXG4gICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUocmVzb2x1dGlvbnMpO1xuICAgICAgICAgIH0uYmluZCh1bmRlZmluZWQsIGkpLCAoZnVuY3Rpb24ocikge1xuICAgICAgICAgICAgaWYgKGNvdW50ID4gMClcbiAgICAgICAgICAgICAgY291bnQgPSAwO1xuICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KHIpO1xuICAgICAgICAgIH0pKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY291bnQgPT09IDApXG4gICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShyZXNvbHV0aW9ucyk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGRlZmVycmVkLnJlamVjdChlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgIH0sXG4gICAgcmFjZTogZnVuY3Rpb24odmFsdWVzKSB7XG4gICAgICB2YXIgZGVmZXJyZWQgPSBnZXREZWZlcnJlZCh0aGlzKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmFsdWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgdGhpcy5jYXN0KHZhbHVlc1tpXSkudGhlbigoZnVuY3Rpb24oeCkge1xuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSh4KTtcbiAgICAgICAgICB9KSwgKGZ1bmN0aW9uKHIpIHtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdChyKTtcbiAgICAgICAgICB9KSk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgZGVmZXJyZWQucmVqZWN0KGUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgfVxuICB9KTtcbiAgZnVuY3Rpb24gcHJvbWlzZVJlc29sdmUocHJvbWlzZSwgeCkge1xuICAgIHByb21pc2VEb25lKHByb21pc2UsICdyZXNvbHZlZCcsIHgsIHByb21pc2Uub25SZXNvbHZlXyk7XG4gIH1cbiAgZnVuY3Rpb24gcHJvbWlzZVJlamVjdChwcm9taXNlLCByKSB7XG4gICAgcHJvbWlzZURvbmUocHJvbWlzZSwgJ3JlamVjdGVkJywgciwgcHJvbWlzZS5vblJlamVjdF8pO1xuICB9XG4gIGZ1bmN0aW9uIHByb21pc2VEb25lKHByb21pc2UsIHN0YXR1cywgdmFsdWUsIHJlYWN0aW9ucykge1xuICAgIGlmIChwcm9taXNlLnN0YXR1c18gIT09ICdwZW5kaW5nJylcbiAgICAgIHJldHVybjtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlYWN0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgcHJvbWlzZVJlYWN0KHJlYWN0aW9uc1tpXVswXSwgcmVhY3Rpb25zW2ldWzFdLCB2YWx1ZSk7XG4gICAgfVxuICAgIHByb21pc2Uuc3RhdHVzXyA9IHN0YXR1cztcbiAgICBwcm9taXNlLnZhbHVlXyA9IHZhbHVlO1xuICAgIHByb21pc2Uub25SZXNvbHZlXyA9IHByb21pc2Uub25SZWplY3RfID0gdW5kZWZpbmVkO1xuICB9XG4gIGZ1bmN0aW9uIHByb21pc2VSZWFjdChkZWZlcnJlZCwgaGFuZGxlciwgeCkge1xuICAgIGFzeW5jKChmdW5jdGlvbigpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHZhciB5ID0gaGFuZGxlcih4KTtcbiAgICAgICAgaWYgKHkgPT09IGRlZmVycmVkLnByb21pc2UpXG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcjtcbiAgICAgICAgZWxzZSBpZiAoaXNQcm9taXNlKHkpKVxuICAgICAgICAgIGNoYWluKHksIGRlZmVycmVkLnJlc29sdmUsIGRlZmVycmVkLnJlamVjdCk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHkpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBkZWZlcnJlZC5yZWplY3QoZSk7XG4gICAgICB9XG4gICAgfSkpO1xuICB9XG4gIHZhciB0aGVuYWJsZVN5bWJvbCA9ICdAQHRoZW5hYmxlJztcbiAgZnVuY3Rpb24gcHJvbWlzZUNvZXJjZShjb25zdHJ1Y3RvciwgeCkge1xuICAgIGlmIChpc1Byb21pc2UoeCkpIHtcbiAgICAgIHJldHVybiB4O1xuICAgIH0gZWxzZSBpZiAoeCAmJiB0eXBlb2YgeC50aGVuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB2YXIgcCA9IHhbdGhlbmFibGVTeW1ib2xdO1xuICAgICAgaWYgKHApIHtcbiAgICAgICAgcmV0dXJuIHA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgZGVmZXJyZWQgPSBnZXREZWZlcnJlZChjb25zdHJ1Y3Rvcik7XG4gICAgICAgIHhbdGhlbmFibGVTeW1ib2xdID0gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB4LnRoZW4oZGVmZXJyZWQucmVzb2x2ZSwgZGVmZXJyZWQucmVqZWN0KTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIGRlZmVycmVkLnJlamVjdChlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHg7XG4gICAgfVxuICB9XG4gIHJldHVybiB7Z2V0IFByb21pc2UoKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZTtcbiAgICB9fTtcbn0pO1xuU3lzdGVtLnJlZ2lzdGVyKFwidHJhY2V1ci1ydW50aW1lQDAuMC4zMi9zcmMvcnVudGltZS9wb2x5ZmlsbHMvU3RyaW5nXCIsIFtdLCBmdW5jdGlvbigpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG4gIHZhciBfX21vZHVsZU5hbWUgPSBcInRyYWNldXItcnVudGltZUAwLjAuMzIvc3JjL3J1bnRpbWUvcG9seWZpbGxzL1N0cmluZ1wiO1xuICB2YXIgJHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcbiAgdmFyICRpbmRleE9mID0gU3RyaW5nLnByb3RvdHlwZS5pbmRleE9mO1xuICB2YXIgJGxhc3RJbmRleE9mID0gU3RyaW5nLnByb3RvdHlwZS5sYXN0SW5kZXhPZjtcbiAgZnVuY3Rpb24gc3RhcnRzV2l0aChzZWFyY2gpIHtcbiAgICB2YXIgc3RyaW5nID0gU3RyaW5nKHRoaXMpO1xuICAgIGlmICh0aGlzID09IG51bGwgfHwgJHRvU3RyaW5nLmNhbGwoc2VhcmNoKSA9PSAnW29iamVjdCBSZWdFeHBdJykge1xuICAgICAgdGhyb3cgVHlwZUVycm9yKCk7XG4gICAgfVxuICAgIHZhciBzdHJpbmdMZW5ndGggPSBzdHJpbmcubGVuZ3RoO1xuICAgIHZhciBzZWFyY2hTdHJpbmcgPSBTdHJpbmcoc2VhcmNoKTtcbiAgICB2YXIgc2VhcmNoTGVuZ3RoID0gc2VhcmNoU3RyaW5nLmxlbmd0aDtcbiAgICB2YXIgcG9zaXRpb24gPSBhcmd1bWVudHMubGVuZ3RoID4gMSA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZDtcbiAgICB2YXIgcG9zID0gcG9zaXRpb24gPyBOdW1iZXIocG9zaXRpb24pIDogMDtcbiAgICBpZiAoaXNOYU4ocG9zKSkge1xuICAgICAgcG9zID0gMDtcbiAgICB9XG4gICAgdmFyIHN0YXJ0ID0gTWF0aC5taW4oTWF0aC5tYXgocG9zLCAwKSwgc3RyaW5nTGVuZ3RoKTtcbiAgICByZXR1cm4gJGluZGV4T2YuY2FsbChzdHJpbmcsIHNlYXJjaFN0cmluZywgcG9zKSA9PSBzdGFydDtcbiAgfVxuICBmdW5jdGlvbiBlbmRzV2l0aChzZWFyY2gpIHtcbiAgICB2YXIgc3RyaW5nID0gU3RyaW5nKHRoaXMpO1xuICAgIGlmICh0aGlzID09IG51bGwgfHwgJHRvU3RyaW5nLmNhbGwoc2VhcmNoKSA9PSAnW29iamVjdCBSZWdFeHBdJykge1xuICAgICAgdGhyb3cgVHlwZUVycm9yKCk7XG4gICAgfVxuICAgIHZhciBzdHJpbmdMZW5ndGggPSBzdHJpbmcubGVuZ3RoO1xuICAgIHZhciBzZWFyY2hTdHJpbmcgPSBTdHJpbmcoc2VhcmNoKTtcbiAgICB2YXIgc2VhcmNoTGVuZ3RoID0gc2VhcmNoU3RyaW5nLmxlbmd0aDtcbiAgICB2YXIgcG9zID0gc3RyaW5nTGVuZ3RoO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgdmFyIHBvc2l0aW9uID0gYXJndW1lbnRzWzFdO1xuICAgICAgaWYgKHBvc2l0aW9uICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcG9zID0gcG9zaXRpb24gPyBOdW1iZXIocG9zaXRpb24pIDogMDtcbiAgICAgICAgaWYgKGlzTmFOKHBvcykpIHtcbiAgICAgICAgICBwb3MgPSAwO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHZhciBlbmQgPSBNYXRoLm1pbihNYXRoLm1heChwb3MsIDApLCBzdHJpbmdMZW5ndGgpO1xuICAgIHZhciBzdGFydCA9IGVuZCAtIHNlYXJjaExlbmd0aDtcbiAgICBpZiAoc3RhcnQgPCAwKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiAkbGFzdEluZGV4T2YuY2FsbChzdHJpbmcsIHNlYXJjaFN0cmluZywgc3RhcnQpID09IHN0YXJ0O1xuICB9XG4gIGZ1bmN0aW9uIGNvbnRhaW5zKHNlYXJjaCkge1xuICAgIGlmICh0aGlzID09IG51bGwpIHtcbiAgICAgIHRocm93IFR5cGVFcnJvcigpO1xuICAgIH1cbiAgICB2YXIgc3RyaW5nID0gU3RyaW5nKHRoaXMpO1xuICAgIHZhciBzdHJpbmdMZW5ndGggPSBzdHJpbmcubGVuZ3RoO1xuICAgIHZhciBzZWFyY2hTdHJpbmcgPSBTdHJpbmcoc2VhcmNoKTtcbiAgICB2YXIgc2VhcmNoTGVuZ3RoID0gc2VhcmNoU3RyaW5nLmxlbmd0aDtcbiAgICB2YXIgcG9zaXRpb24gPSBhcmd1bWVudHMubGVuZ3RoID4gMSA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZDtcbiAgICB2YXIgcG9zID0gcG9zaXRpb24gPyBOdW1iZXIocG9zaXRpb24pIDogMDtcbiAgICBpZiAoaXNOYU4ocG9zKSkge1xuICAgICAgcG9zID0gMDtcbiAgICB9XG4gICAgdmFyIHN0YXJ0ID0gTWF0aC5taW4oTWF0aC5tYXgocG9zLCAwKSwgc3RyaW5nTGVuZ3RoKTtcbiAgICByZXR1cm4gJGluZGV4T2YuY2FsbChzdHJpbmcsIHNlYXJjaFN0cmluZywgcG9zKSAhPSAtMTtcbiAgfVxuICBmdW5jdGlvbiByZXBlYXQoY291bnQpIHtcbiAgICBpZiAodGhpcyA9PSBudWxsKSB7XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoKTtcbiAgICB9XG4gICAgdmFyIHN0cmluZyA9IFN0cmluZyh0aGlzKTtcbiAgICB2YXIgbiA9IGNvdW50ID8gTnVtYmVyKGNvdW50KSA6IDA7XG4gICAgaWYgKGlzTmFOKG4pKSB7XG4gICAgICBuID0gMDtcbiAgICB9XG4gICAgaWYgKG4gPCAwIHx8IG4gPT0gSW5maW5pdHkpIHtcbiAgICAgIHRocm93IFJhbmdlRXJyb3IoKTtcbiAgICB9XG4gICAgaWYgKG4gPT0gMCkge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgICB2YXIgcmVzdWx0ID0gJyc7XG4gICAgd2hpbGUgKG4tLSkge1xuICAgICAgcmVzdWx0ICs9IHN0cmluZztcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICBmdW5jdGlvbiBjb2RlUG9pbnRBdChwb3NpdGlvbikge1xuICAgIGlmICh0aGlzID09IG51bGwpIHtcbiAgICAgIHRocm93IFR5cGVFcnJvcigpO1xuICAgIH1cbiAgICB2YXIgc3RyaW5nID0gU3RyaW5nKHRoaXMpO1xuICAgIHZhciBzaXplID0gc3RyaW5nLmxlbmd0aDtcbiAgICB2YXIgaW5kZXggPSBwb3NpdGlvbiA/IE51bWJlcihwb3NpdGlvbikgOiAwO1xuICAgIGlmIChpc05hTihpbmRleCkpIHtcbiAgICAgIGluZGV4ID0gMDtcbiAgICB9XG4gICAgaWYgKGluZGV4IDwgMCB8fCBpbmRleCA+PSBzaXplKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICB2YXIgZmlyc3QgPSBzdHJpbmcuY2hhckNvZGVBdChpbmRleCk7XG4gICAgdmFyIHNlY29uZDtcbiAgICBpZiAoZmlyc3QgPj0gMHhEODAwICYmIGZpcnN0IDw9IDB4REJGRiAmJiBzaXplID4gaW5kZXggKyAxKSB7XG4gICAgICBzZWNvbmQgPSBzdHJpbmcuY2hhckNvZGVBdChpbmRleCArIDEpO1xuICAgICAgaWYgKHNlY29uZCA+PSAweERDMDAgJiYgc2Vjb25kIDw9IDB4REZGRikge1xuICAgICAgICByZXR1cm4gKGZpcnN0IC0gMHhEODAwKSAqIDB4NDAwICsgc2Vjb25kIC0gMHhEQzAwICsgMHgxMDAwMDtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZpcnN0O1xuICB9XG4gIGZ1bmN0aW9uIHJhdyhjYWxsc2l0ZSkge1xuICAgIHZhciByYXcgPSBjYWxsc2l0ZS5yYXc7XG4gICAgdmFyIGxlbiA9IHJhdy5sZW5ndGggPj4+IDA7XG4gICAgaWYgKGxlbiA9PT0gMClcbiAgICAgIHJldHVybiAnJztcbiAgICB2YXIgcyA9ICcnO1xuICAgIHZhciBpID0gMDtcbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgcyArPSByYXdbaV07XG4gICAgICBpZiAoaSArIDEgPT09IGxlbilcbiAgICAgICAgcmV0dXJuIHM7XG4gICAgICBzICs9IGFyZ3VtZW50c1srK2ldO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBmcm9tQ29kZVBvaW50KCkge1xuICAgIHZhciBjb2RlVW5pdHMgPSBbXTtcbiAgICB2YXIgZmxvb3IgPSBNYXRoLmZsb29yO1xuICAgIHZhciBoaWdoU3Vycm9nYXRlO1xuICAgIHZhciBsb3dTdXJyb2dhdGU7XG4gICAgdmFyIGluZGV4ID0gLTE7XG4gICAgdmFyIGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgaWYgKCFsZW5ndGgpIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG4gICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgIHZhciBjb2RlUG9pbnQgPSBOdW1iZXIoYXJndW1lbnRzW2luZGV4XSk7XG4gICAgICBpZiAoIWlzRmluaXRlKGNvZGVQb2ludCkgfHwgY29kZVBvaW50IDwgMCB8fCBjb2RlUG9pbnQgPiAweDEwRkZGRiB8fCBmbG9vcihjb2RlUG9pbnQpICE9IGNvZGVQb2ludCkge1xuICAgICAgICB0aHJvdyBSYW5nZUVycm9yKCdJbnZhbGlkIGNvZGUgcG9pbnQ6ICcgKyBjb2RlUG9pbnQpO1xuICAgICAgfVxuICAgICAgaWYgKGNvZGVQb2ludCA8PSAweEZGRkYpIHtcbiAgICAgICAgY29kZVVuaXRzLnB1c2goY29kZVBvaW50KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvZGVQb2ludCAtPSAweDEwMDAwO1xuICAgICAgICBoaWdoU3Vycm9nYXRlID0gKGNvZGVQb2ludCA+PiAxMCkgKyAweEQ4MDA7XG4gICAgICAgIGxvd1N1cnJvZ2F0ZSA9IChjb2RlUG9pbnQgJSAweDQwMCkgKyAweERDMDA7XG4gICAgICAgIGNvZGVVbml0cy5wdXNoKGhpZ2hTdXJyb2dhdGUsIGxvd1N1cnJvZ2F0ZSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KG51bGwsIGNvZGVVbml0cyk7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBnZXQgc3RhcnRzV2l0aCgpIHtcbiAgICAgIHJldHVybiBzdGFydHNXaXRoO1xuICAgIH0sXG4gICAgZ2V0IGVuZHNXaXRoKCkge1xuICAgICAgcmV0dXJuIGVuZHNXaXRoO1xuICAgIH0sXG4gICAgZ2V0IGNvbnRhaW5zKCkge1xuICAgICAgcmV0dXJuIGNvbnRhaW5zO1xuICAgIH0sXG4gICAgZ2V0IHJlcGVhdCgpIHtcbiAgICAgIHJldHVybiByZXBlYXQ7XG4gICAgfSxcbiAgICBnZXQgY29kZVBvaW50QXQoKSB7XG4gICAgICByZXR1cm4gY29kZVBvaW50QXQ7XG4gICAgfSxcbiAgICBnZXQgcmF3KCkge1xuICAgICAgcmV0dXJuIHJhdztcbiAgICB9LFxuICAgIGdldCBmcm9tQ29kZVBvaW50KCkge1xuICAgICAgcmV0dXJuIGZyb21Db2RlUG9pbnQ7XG4gICAgfVxuICB9O1xufSk7XG5TeXN0ZW0ucmVnaXN0ZXIoXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjMyL3NyYy9ydW50aW1lL3BvbHlmaWxscy9wb2x5ZmlsbHNcIiwgW10sIGZ1bmN0aW9uKCkge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgdmFyIF9fbW9kdWxlTmFtZSA9IFwidHJhY2V1ci1ydW50aW1lQDAuMC4zMi9zcmMvcnVudGltZS9wb2x5ZmlsbHMvcG9seWZpbGxzXCI7XG4gIHZhciBQcm9taXNlID0gU3lzdGVtLmdldChcInRyYWNldXItcnVudGltZUAwLjAuMzIvc3JjL3J1bnRpbWUvcG9seWZpbGxzL1Byb21pc2VcIikuUHJvbWlzZTtcbiAgdmFyICRfXzkgPSBTeXN0ZW0uZ2V0KFwidHJhY2V1ci1ydW50aW1lQDAuMC4zMi9zcmMvcnVudGltZS9wb2x5ZmlsbHMvU3RyaW5nXCIpLFxuICAgICAgY29kZVBvaW50QXQgPSAkX185LmNvZGVQb2ludEF0LFxuICAgICAgY29udGFpbnMgPSAkX185LmNvbnRhaW5zLFxuICAgICAgZW5kc1dpdGggPSAkX185LmVuZHNXaXRoLFxuICAgICAgZnJvbUNvZGVQb2ludCA9ICRfXzkuZnJvbUNvZGVQb2ludCxcbiAgICAgIHJlcGVhdCA9ICRfXzkucmVwZWF0LFxuICAgICAgcmF3ID0gJF9fOS5yYXcsXG4gICAgICBzdGFydHNXaXRoID0gJF9fOS5zdGFydHNXaXRoO1xuICB2YXIgJF9fOSA9IFN5c3RlbS5nZXQoXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjMyL3NyYy9ydW50aW1lL3BvbHlmaWxscy9BcnJheUl0ZXJhdG9yXCIpLFxuICAgICAgZW50cmllcyA9ICRfXzkuZW50cmllcyxcbiAgICAgIGtleXMgPSAkX185LmtleXMsXG4gICAgICB2YWx1ZXMgPSAkX185LnZhbHVlcztcbiAgZnVuY3Rpb24gbWF5YmVEZWZpbmVNZXRob2Qob2JqZWN0LCBuYW1lLCB2YWx1ZSkge1xuICAgIGlmICghKG5hbWUgaW4gb2JqZWN0KSkge1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwgbmFtZSwge1xuICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlXG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gbWF5YmVBZGRGdW5jdGlvbnMob2JqZWN0LCBmdW5jdGlvbnMpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGZ1bmN0aW9ucy5sZW5ndGg7IGkgKz0gMikge1xuICAgICAgdmFyIG5hbWUgPSBmdW5jdGlvbnNbaV07XG4gICAgICB2YXIgdmFsdWUgPSBmdW5jdGlvbnNbaSArIDFdO1xuICAgICAgbWF5YmVEZWZpbmVNZXRob2Qob2JqZWN0LCBuYW1lLCB2YWx1ZSk7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIHBvbHlmaWxsUHJvbWlzZShnbG9iYWwpIHtcbiAgICBpZiAoIWdsb2JhbC5Qcm9taXNlKVxuICAgICAgZ2xvYmFsLlByb21pc2UgPSBQcm9taXNlO1xuICB9XG4gIGZ1bmN0aW9uIHBvbHlmaWxsU3RyaW5nKFN0cmluZykge1xuICAgIG1heWJlQWRkRnVuY3Rpb25zKFN0cmluZy5wcm90b3R5cGUsIFsnY29kZVBvaW50QXQnLCBjb2RlUG9pbnRBdCwgJ2NvbnRhaW5zJywgY29udGFpbnMsICdlbmRzV2l0aCcsIGVuZHNXaXRoLCAnc3RhcnRzV2l0aCcsIHN0YXJ0c1dpdGgsICdyZXBlYXQnLCByZXBlYXRdKTtcbiAgICBtYXliZUFkZEZ1bmN0aW9ucyhTdHJpbmcsIFsnZnJvbUNvZGVQb2ludCcsIGZyb21Db2RlUG9pbnQsICdyYXcnLCByYXddKTtcbiAgfVxuICBmdW5jdGlvbiBwb2x5ZmlsbEFycmF5KEFycmF5LCBTeW1ib2wpIHtcbiAgICBtYXliZUFkZEZ1bmN0aW9ucyhBcnJheS5wcm90b3R5cGUsIFsnZW50cmllcycsIGVudHJpZXMsICdrZXlzJywga2V5cywgJ3ZhbHVlcycsIHZhbHVlc10pO1xuICAgIGlmIChTeW1ib2wgJiYgU3ltYm9sLml0ZXJhdG9yKSB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoQXJyYXkucHJvdG90eXBlLCBTeW1ib2wuaXRlcmF0b3IsIHtcbiAgICAgICAgdmFsdWU6IHZhbHVlcyxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgd3JpdGFibGU6IHRydWVcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBwb2x5ZmlsbChnbG9iYWwpIHtcbiAgICBwb2x5ZmlsbFByb21pc2UoZ2xvYmFsKTtcbiAgICBwb2x5ZmlsbFN0cmluZyhnbG9iYWwuU3RyaW5nKTtcbiAgICBwb2x5ZmlsbEFycmF5KGdsb2JhbC5BcnJheSwgZ2xvYmFsLlN5bWJvbCk7XG4gIH1cbiAgcG9seWZpbGwodGhpcyk7XG4gIHZhciBzZXR1cEdsb2JhbHMgPSAkdHJhY2V1clJ1bnRpbWUuc2V0dXBHbG9iYWxzO1xuICAkdHJhY2V1clJ1bnRpbWUuc2V0dXBHbG9iYWxzID0gZnVuY3Rpb24oZ2xvYmFsKSB7XG4gICAgc2V0dXBHbG9iYWxzKGdsb2JhbCk7XG4gICAgcG9seWZpbGwoZ2xvYmFsKTtcbiAgfTtcbiAgcmV0dXJuIHt9O1xufSk7XG5TeXN0ZW0ucmVnaXN0ZXIoXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjMyL3NyYy9ydW50aW1lL3BvbHlmaWxsLWltcG9ydFwiLCBbXSwgZnVuY3Rpb24oKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuICB2YXIgX19tb2R1bGVOYW1lID0gXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjMyL3NyYy9ydW50aW1lL3BvbHlmaWxsLWltcG9ydFwiO1xuICB2YXIgJF9fMTEgPSBTeXN0ZW0uZ2V0KFwidHJhY2V1ci1ydW50aW1lQDAuMC4zMi9zcmMvcnVudGltZS9wb2x5ZmlsbHMvcG9seWZpbGxzXCIpO1xuICByZXR1cm4ge307XG59KTtcblN5c3RlbS5nZXQoXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjMyL3NyYy9ydW50aW1lL3BvbHlmaWxsLWltcG9ydFwiICsgJycpO1xuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcIi9Vc2Vycy9mcmFuY29wb250aWNlbGxpL3Byb2plY3RzL2NhcmRzL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9pbnNlcnQtbW9kdWxlLWdsb2JhbHMvbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qc1wiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pIiwiXCJ1c2Ugc3RyaWN0XCI7XG5leHBvcnRzLnRlc3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xufTsiLCJcInVzZSBzdHJpY3RcIjtcbnZhciB0eXBlcyA9IFtcbiAgICByZXF1aXJlKFwiLi9uZXh0VGlja1wiKSxcbiAgICByZXF1aXJlKFwiLi9tdXRhdGlvblwiKSxcbiAgICByZXF1aXJlKFwiLi9wb3N0TWVzc2FnZVwiKSxcbiAgICByZXF1aXJlKFwiLi9tZXNzYWdlQ2hhbm5lbFwiKSxcbiAgICByZXF1aXJlKFwiLi9zdGF0ZUNoYW5nZVwiKSxcbiAgICByZXF1aXJlKFwiLi90aW1lb3V0XCIpXG5dO1xudmFyIGhhbmRsZXJRdWV1ZSA9IFtdO1xuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICB2YXIgaSA9IDAsXG4gICAgICAgIHRhc2ssXG4gICAgICAgIGlubmVyUXVldWUgPSBoYW5kbGVyUXVldWU7XG5cdGhhbmRsZXJRdWV1ZSA9IFtdO1xuXHQvKmpzbGludCBib3NzOiB0cnVlICovXG5cdHdoaWxlICh0YXNrID0gaW5uZXJRdWV1ZVtpKytdKSB7XG5cdFx0dGFzaygpO1xuXHR9XG59XG52YXIgbmV4dFRpY2s7XG52YXIgaSA9IC0xO1xudmFyIGxlbiA9IHR5cGVzLmxlbmd0aDtcbndoaWxlICgrKyBpIDwgbGVuKSB7XG4gICAgaWYgKHR5cGVzW2ldLnRlc3QoKSkge1xuICAgICAgICBuZXh0VGljayA9IHR5cGVzW2ldLmluc3RhbGwoZHJhaW5RdWV1ZSk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHRhc2spIHtcbiAgICB2YXIgbGVuLCBpLCBhcmdzO1xuICAgIHZhciBuVGFzayA9IHRhc2s7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIHR5cGVvZiB0YXNrID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgICAgIGkgPSAwO1xuICAgICAgICB3aGlsZSAoKytpIDwgYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICAgICAgblRhc2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0YXNrLmFwcGx5KHVuZGVmaW5lZCwgYXJncyk7XG4gICAgICAgIH07XG4gICAgfVxuICAgIGlmICgobGVuID0gaGFuZGxlclF1ZXVlLnB1c2goblRhc2spKSA9PT0gMSkge1xuICAgICAgICBuZXh0VGljayhkcmFpblF1ZXVlKTtcbiAgICB9XG4gICAgcmV0dXJuIGxlbjtcbn07XG5tb2R1bGUuZXhwb3J0cy5jbGVhciA9IGZ1bmN0aW9uIChuKSB7XG4gICAgaWYgKG4gPD0gaGFuZGxlclF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBoYW5kbGVyUXVldWVbbiAtIDFdID0gZnVuY3Rpb24gKCkge307XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xufTtcbiIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcblwidXNlIHN0cmljdFwiO1xuXG5leHBvcnRzLnRlc3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBnbG9iYWwuTWVzc2FnZUNoYW5uZWwgIT09IFwidW5kZWZpbmVkXCI7XG59O1xuXG5leHBvcnRzLmluc3RhbGwgPSBmdW5jdGlvbiAoZnVuYykge1xuICAgIHZhciBjaGFubmVsID0gbmV3IGdsb2JhbC5NZXNzYWdlQ2hhbm5lbCgpO1xuICAgIGNoYW5uZWwucG9ydDEub25tZXNzYWdlID0gZnVuYztcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICBjaGFubmVsLnBvcnQyLnBvc3RNZXNzYWdlKDApO1xuICAgIH07XG59O1xufSkuY2FsbCh0aGlzLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG5cInVzZSBzdHJpY3RcIjtcbi8vYmFzZWQgb2ZmIHJzdnBcbi8vaHR0cHM6Ly9naXRodWIuY29tL3RpbGRlaW8vcnN2cC5qcy9ibG9iL21hc3Rlci9saWIvcnN2cC9hc3luYy5qc1xuXG52YXIgTXV0YXRpb25PYnNlcnZlciA9IGdsb2JhbC5NdXRhdGlvbk9ic2VydmVyIHx8IGdsb2JhbC5XZWJLaXRNdXRhdGlvbk9ic2VydmVyO1xuXG5leHBvcnRzLnRlc3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIE11dGF0aW9uT2JzZXJ2ZXI7XG59O1xuXG5leHBvcnRzLmluc3RhbGwgPSBmdW5jdGlvbiAoaGFuZGxlKSB7XG4gICAgdmFyIG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoaGFuZGxlKTtcbiAgICB2YXIgZWxlbWVudCA9IGdsb2JhbC5kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIG9ic2VydmVyLm9ic2VydmUoZWxlbWVudCwgeyBhdHRyaWJ1dGVzOiB0cnVlIH0pO1xuXG4gICAgLy8gQ2hyb21lIE1lbW9yeSBMZWFrOiBodHRwczovL2J1Z3Mud2Via2l0Lm9yZy9zaG93X2J1Zy5jZ2k/aWQ9OTM2NjFcbiAgICBnbG9iYWwuYWRkRXZlbnRMaXN0ZW5lcihcInVubG9hZFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIG9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgb2JzZXJ2ZXIgPSBudWxsO1xuICAgIH0sIGZhbHNlKTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShcImRyYWluUXVldWVcIiwgXCJkcmFpblF1ZXVlXCIpO1xuICAgIH07XG59O1xufSkuY2FsbCh0aGlzLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG5cInVzZSBzdHJpY3RcIjtcbmV4cG9ydHMudGVzdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAvLyBUaGUgdGVzdCBhZ2FpbnN0IGBpbXBvcnRTY3JpcHRzYCBwcmV2ZW50cyB0aGlzIGltcGxlbWVudGF0aW9uIGZyb20gYmVpbmcgaW5zdGFsbGVkIGluc2lkZSBhIHdlYiB3b3JrZXIsXG4gICAgLy8gd2hlcmUgYGdsb2JhbC5wb3N0TWVzc2FnZWAgbWVhbnMgc29tZXRoaW5nIGNvbXBsZXRlbHkgZGlmZmVyZW50IGFuZCBjYW5cInQgYmUgdXNlZCBmb3IgdGhpcyBwdXJwb3NlLlxuXG4gICAgaWYgKCFnbG9iYWwucG9zdE1lc3NhZ2UgfHwgZ2xvYmFsLmltcG9ydFNjcmlwdHMpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHZhciBwb3N0TWVzc2FnZUlzQXN5bmNocm9ub3VzID0gdHJ1ZTtcbiAgICB2YXIgb2xkT25NZXNzYWdlID0gZ2xvYmFsLm9ubWVzc2FnZTtcbiAgICBnbG9iYWwub25tZXNzYWdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBwb3N0TWVzc2FnZUlzQXN5bmNocm9ub3VzID0gZmFsc2U7XG4gICAgfTtcbiAgICBnbG9iYWwucG9zdE1lc3NhZ2UoXCJcIiwgXCIqXCIpO1xuICAgIGdsb2JhbC5vbm1lc3NhZ2UgPSBvbGRPbk1lc3NhZ2U7XG5cbiAgICByZXR1cm4gcG9zdE1lc3NhZ2VJc0FzeW5jaHJvbm91cztcbn07XG5cbmV4cG9ydHMuaW5zdGFsbCA9IGZ1bmN0aW9uIChmdW5jKSB7XG4gICAgdmFyIGNvZGVXb3JkID0gXCJjb20uY2FsdmlubWV0Y2FsZi5zZXRJbW1lZGlhdGVcIiArIE1hdGgucmFuZG9tKCk7XG4gICAgZnVuY3Rpb24gZ2xvYmFsTWVzc2FnZShldmVudCkge1xuICAgICAgICBpZiAoZXZlbnQuc291cmNlID09PSBnbG9iYWwgJiYgZXZlbnQuZGF0YSA9PT0gY29kZVdvcmQpIHtcbiAgICAgICAgICAgIGZ1bmMoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAoZ2xvYmFsLmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgICAgICAgZ2xvYmFsLmFkZEV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIGdsb2JhbE1lc3NhZ2UsIGZhbHNlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBnbG9iYWwuYXR0YWNoRXZlbnQoXCJvbm1lc3NhZ2VcIiwgZ2xvYmFsTWVzc2FnZSk7XG4gICAgfVxuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGdsb2JhbC5wb3N0TWVzc2FnZShjb2RlV29yZCwgXCIqXCIpO1xuICAgIH07XG59O1xufSkuY2FsbCh0aGlzLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG5cInVzZSBzdHJpY3RcIjtcblxuZXhwb3J0cy50ZXN0ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBcImRvY3VtZW50XCIgaW4gZ2xvYmFsICYmIFwib25yZWFkeXN0YXRlY2hhbmdlXCIgaW4gZ2xvYmFsLmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7XG59O1xuXG5leHBvcnRzLmluc3RhbGwgPSBmdW5jdGlvbiAoaGFuZGxlKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAvLyBDcmVhdGUgYSA8c2NyaXB0PiBlbGVtZW50OyBpdHMgcmVhZHlzdGF0ZWNoYW5nZSBldmVudCB3aWxsIGJlIGZpcmVkIGFzeW5jaHJvbm91c2x5IG9uY2UgaXQgaXMgaW5zZXJ0ZWRcbiAgICAgICAgLy8gaW50byB0aGUgZG9jdW1lbnQuIERvIHNvLCB0aHVzIHF1ZXVpbmcgdXAgdGhlIHRhc2suIFJlbWVtYmVyIHRvIGNsZWFuIHVwIG9uY2UgaXQncyBiZWVuIGNhbGxlZC5cbiAgICAgICAgdmFyIHNjcmlwdEVsID0gZ2xvYmFsLmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7XG4gICAgICAgIHNjcmlwdEVsLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGhhbmRsZSgpO1xuXG4gICAgICAgICAgICBzY3JpcHRFbC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBudWxsO1xuICAgICAgICAgICAgc2NyaXB0RWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzY3JpcHRFbCk7XG4gICAgICAgICAgICBzY3JpcHRFbCA9IG51bGw7XG4gICAgICAgIH07XG4gICAgICAgIGdsb2JhbC5kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuYXBwZW5kQ2hpbGQoc2NyaXB0RWwpO1xuXG4gICAgICAgIHJldHVybiBoYW5kbGU7XG4gICAgfTtcbn07XG59KS5jYWxsKHRoaXMsdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KSIsIlwidXNlIHN0cmljdFwiO1xuZXhwb3J0cy50ZXN0ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0cnVlO1xufTtcblxuZXhwb3J0cy5pbnN0YWxsID0gZnVuY3Rpb24gKHQpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICBzZXRUaW1lb3V0KHQsIDApO1xuICAgIH07XG59OyIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbiFmdW5jdGlvbihlKXtpZihcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyltb2R1bGUuZXhwb3J0cz1lKCk7ZWxzZSBpZihcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQpZGVmaW5lKGUpO2Vsc2V7dmFyIGY7XCJ1bmRlZmluZWRcIiE9dHlwZW9mIHdpbmRvdz9mPXdpbmRvdzpcInVuZGVmaW5lZFwiIT10eXBlb2YgZ2xvYmFsP2Y9Z2xvYmFsOlwidW5kZWZpbmVkXCIhPXR5cGVvZiBzZWxmJiYoZj1zZWxmKSxmLmphZGU9ZSgpfX0oZnVuY3Rpb24oKXt2YXIgZGVmaW5lLG1vZHVsZSxleHBvcnRzO3JldHVybiAoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSh7MTpbZnVuY3Rpb24oX2RlcmVxXyxtb2R1bGUsZXhwb3J0cyl7XG4ndXNlIHN0cmljdCc7XG5cbi8qKlxuICogTWVyZ2UgdHdvIGF0dHJpYnV0ZSBvYmplY3RzIGdpdmluZyBwcmVjZWRlbmNlXG4gKiB0byB2YWx1ZXMgaW4gb2JqZWN0IGBiYC4gQ2xhc3NlcyBhcmUgc3BlY2lhbC1jYXNlZFxuICogYWxsb3dpbmcgZm9yIGFycmF5cyBhbmQgbWVyZ2luZy9qb2luaW5nIGFwcHJvcHJpYXRlbHlcbiAqIHJlc3VsdGluZyBpbiBhIHN0cmluZy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gYVxuICogQHBhcmFtIHtPYmplY3R9IGJcbiAqIEByZXR1cm4ge09iamVjdH0gYVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZXhwb3J0cy5tZXJnZSA9IGZ1bmN0aW9uIG1lcmdlKGEsIGIpIHtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICB2YXIgYXR0cnMgPSBhWzBdO1xuICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYS5sZW5ndGg7IGkrKykge1xuICAgICAgYXR0cnMgPSBtZXJnZShhdHRycywgYVtpXSk7XG4gICAgfVxuICAgIHJldHVybiBhdHRycztcbiAgfVxuICB2YXIgYWMgPSBhWydjbGFzcyddO1xuICB2YXIgYmMgPSBiWydjbGFzcyddO1xuXG4gIGlmIChhYyB8fCBiYykge1xuICAgIGFjID0gYWMgfHwgW107XG4gICAgYmMgPSBiYyB8fCBbXTtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoYWMpKSBhYyA9IFthY107XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGJjKSkgYmMgPSBbYmNdO1xuICAgIGFbJ2NsYXNzJ10gPSBhYy5jb25jYXQoYmMpLmZpbHRlcihudWxscyk7XG4gIH1cblxuICBmb3IgKHZhciBrZXkgaW4gYikge1xuICAgIGlmIChrZXkgIT0gJ2NsYXNzJykge1xuICAgICAgYVtrZXldID0gYltrZXldO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBhO1xufTtcblxuLyoqXG4gKiBGaWx0ZXIgbnVsbCBgdmFsYHMuXG4gKlxuICogQHBhcmFtIHsqfSB2YWxcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBudWxscyh2YWwpIHtcbiAgcmV0dXJuIHZhbCAhPSBudWxsICYmIHZhbCAhPT0gJyc7XG59XG5cbi8qKlxuICogam9pbiBhcnJheSBhcyBjbGFzc2VzLlxuICpcbiAqIEBwYXJhbSB7Kn0gdmFsXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmV4cG9ydHMuam9pbkNsYXNzZXMgPSBqb2luQ2xhc3NlcztcbmZ1bmN0aW9uIGpvaW5DbGFzc2VzKHZhbCkge1xuICByZXR1cm4gQXJyYXkuaXNBcnJheSh2YWwpID8gdmFsLm1hcChqb2luQ2xhc3NlcykuZmlsdGVyKG51bGxzKS5qb2luKCcgJykgOiB2YWw7XG59XG5cbi8qKlxuICogUmVuZGVyIHRoZSBnaXZlbiBjbGFzc2VzLlxuICpcbiAqIEBwYXJhbSB7QXJyYXl9IGNsYXNzZXNcbiAqIEBwYXJhbSB7QXJyYXkuPEJvb2xlYW4+fSBlc2NhcGVkXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmV4cG9ydHMuY2xzID0gZnVuY3Rpb24gY2xzKGNsYXNzZXMsIGVzY2FwZWQpIHtcbiAgdmFyIGJ1ZiA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGNsYXNzZXMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoZXNjYXBlZCAmJiBlc2NhcGVkW2ldKSB7XG4gICAgICBidWYucHVzaChleHBvcnRzLmVzY2FwZShqb2luQ2xhc3NlcyhbY2xhc3Nlc1tpXV0pKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGJ1Zi5wdXNoKGpvaW5DbGFzc2VzKGNsYXNzZXNbaV0pKTtcbiAgICB9XG4gIH1cbiAgdmFyIHRleHQgPSBqb2luQ2xhc3NlcyhidWYpO1xuICBpZiAodGV4dC5sZW5ndGgpIHtcbiAgICByZXR1cm4gJyBjbGFzcz1cIicgKyB0ZXh0ICsgJ1wiJztcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gJyc7XG4gIH1cbn07XG5cbi8qKlxuICogUmVuZGVyIHRoZSBnaXZlbiBhdHRyaWJ1dGUuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGtleVxuICogQHBhcmFtIHtTdHJpbmd9IHZhbFxuICogQHBhcmFtIHtCb29sZWFufSBlc2NhcGVkXG4gKiBAcGFyYW0ge0Jvb2xlYW59IHRlcnNlXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmV4cG9ydHMuYXR0ciA9IGZ1bmN0aW9uIGF0dHIoa2V5LCB2YWwsIGVzY2FwZWQsIHRlcnNlKSB7XG4gIGlmICgnYm9vbGVhbicgPT0gdHlwZW9mIHZhbCB8fCBudWxsID09IHZhbCkge1xuICAgIGlmICh2YWwpIHtcbiAgICAgIHJldHVybiAnICcgKyAodGVyc2UgPyBrZXkgOiBrZXkgKyAnPVwiJyArIGtleSArICdcIicpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICB9IGVsc2UgaWYgKDAgPT0ga2V5LmluZGV4T2YoJ2RhdGEnKSAmJiAnc3RyaW5nJyAhPSB0eXBlb2YgdmFsKSB7XG4gICAgcmV0dXJuICcgJyArIGtleSArIFwiPSdcIiArIEpTT04uc3RyaW5naWZ5KHZhbCkucmVwbGFjZSgvJy9nLCAnJmFwb3M7JykgKyBcIidcIjtcbiAgfSBlbHNlIGlmIChlc2NhcGVkKSB7XG4gICAgcmV0dXJuICcgJyArIGtleSArICc9XCInICsgZXhwb3J0cy5lc2NhcGUodmFsKSArICdcIic7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuICcgJyArIGtleSArICc9XCInICsgdmFsICsgJ1wiJztcbiAgfVxufTtcblxuLyoqXG4gKiBSZW5kZXIgdGhlIGdpdmVuIGF0dHJpYnV0ZXMgb2JqZWN0LlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEBwYXJhbSB7T2JqZWN0fSBlc2NhcGVkXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmV4cG9ydHMuYXR0cnMgPSBmdW5jdGlvbiBhdHRycyhvYmosIHRlcnNlKXtcbiAgdmFyIGJ1ZiA9IFtdO1xuXG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXMob2JqKTtcblxuICBpZiAoa2V5cy5sZW5ndGgpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyArK2kpIHtcbiAgICAgIHZhciBrZXkgPSBrZXlzW2ldXG4gICAgICAgICwgdmFsID0gb2JqW2tleV07XG5cbiAgICAgIGlmICgnY2xhc3MnID09IGtleSkge1xuICAgICAgICBpZiAodmFsID0gam9pbkNsYXNzZXModmFsKSkge1xuICAgICAgICAgIGJ1Zi5wdXNoKCcgJyArIGtleSArICc9XCInICsgdmFsICsgJ1wiJyk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGJ1Zi5wdXNoKGV4cG9ydHMuYXR0cihrZXksIHZhbCwgZmFsc2UsIHRlcnNlKSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGJ1Zi5qb2luKCcnKTtcbn07XG5cbi8qKlxuICogRXNjYXBlIHRoZSBnaXZlbiBzdHJpbmcgb2YgYGh0bWxgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBodG1sXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5leHBvcnRzLmVzY2FwZSA9IGZ1bmN0aW9uIGVzY2FwZShodG1sKXtcbiAgdmFyIHJlc3VsdCA9IFN0cmluZyhodG1sKVxuICAgIC5yZXBsYWNlKC8mL2csICcmYW1wOycpXG4gICAgLnJlcGxhY2UoLzwvZywgJyZsdDsnKVxuICAgIC5yZXBsYWNlKC8+L2csICcmZ3Q7JylcbiAgICAucmVwbGFjZSgvXCIvZywgJyZxdW90OycpO1xuICBpZiAocmVzdWx0ID09PSAnJyArIGh0bWwpIHJldHVybiBodG1sO1xuICBlbHNlIHJldHVybiByZXN1bHQ7XG59O1xuXG4vKipcbiAqIFJlLXRocm93IHRoZSBnaXZlbiBgZXJyYCBpbiBjb250ZXh0IHRvIHRoZVxuICogdGhlIGphZGUgaW4gYGZpbGVuYW1lYCBhdCB0aGUgZ2l2ZW4gYGxpbmVub2AuXG4gKlxuICogQHBhcmFtIHtFcnJvcn0gZXJyXG4gKiBAcGFyYW0ge1N0cmluZ30gZmlsZW5hbWVcbiAqIEBwYXJhbSB7U3RyaW5nfSBsaW5lbm9cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmV4cG9ydHMucmV0aHJvdyA9IGZ1bmN0aW9uIHJldGhyb3coZXJyLCBmaWxlbmFtZSwgbGluZW5vLCBzdHIpe1xuICBpZiAoIShlcnIgaW5zdGFuY2VvZiBFcnJvcikpIHRocm93IGVycjtcbiAgaWYgKCh0eXBlb2Ygd2luZG93ICE9ICd1bmRlZmluZWQnIHx8ICFmaWxlbmFtZSkgJiYgIXN0cikge1xuICAgIGVyci5tZXNzYWdlICs9ICcgb24gbGluZSAnICsgbGluZW5vO1xuICAgIHRocm93IGVycjtcbiAgfVxuICB0cnkge1xuICAgIHN0ciA9ICBzdHIgfHwgX2RlcmVxXygnZnMnKS5yZWFkRmlsZVN5bmMoZmlsZW5hbWUsICd1dGY4JylcbiAgfSBjYXRjaCAoZXgpIHtcbiAgICByZXRocm93KGVyciwgbnVsbCwgbGluZW5vKVxuICB9XG4gIHZhciBjb250ZXh0ID0gM1xuICAgICwgbGluZXMgPSBzdHIuc3BsaXQoJ1xcbicpXG4gICAgLCBzdGFydCA9IE1hdGgubWF4KGxpbmVubyAtIGNvbnRleHQsIDApXG4gICAgLCBlbmQgPSBNYXRoLm1pbihsaW5lcy5sZW5ndGgsIGxpbmVubyArIGNvbnRleHQpO1xuXG4gIC8vIEVycm9yIGNvbnRleHRcbiAgdmFyIGNvbnRleHQgPSBsaW5lcy5zbGljZShzdGFydCwgZW5kKS5tYXAoZnVuY3Rpb24obGluZSwgaSl7XG4gICAgdmFyIGN1cnIgPSBpICsgc3RhcnQgKyAxO1xuICAgIHJldHVybiAoY3VyciA9PSBsaW5lbm8gPyAnICA+ICcgOiAnICAgICcpXG4gICAgICArIGN1cnJcbiAgICAgICsgJ3wgJ1xuICAgICAgKyBsaW5lO1xuICB9KS5qb2luKCdcXG4nKTtcblxuICAvLyBBbHRlciBleGNlcHRpb24gbWVzc2FnZVxuICBlcnIucGF0aCA9IGZpbGVuYW1lO1xuICBlcnIubWVzc2FnZSA9IChmaWxlbmFtZSB8fCAnSmFkZScpICsgJzonICsgbGluZW5vXG4gICAgKyAnXFxuJyArIGNvbnRleHQgKyAnXFxuXFxuJyArIGVyci5tZXNzYWdlO1xuICB0aHJvdyBlcnI7XG59O1xuXG59LHtcImZzXCI6Mn1dLDI6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpe1xuXG59LHt9XX0se30sWzFdKVxuKDEpXG59KTtcbn0pLmNhbGwodGhpcyx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pIiwiLyohXG4gKiBudW1lcmFsLmpzXG4gKiB2ZXJzaW9uIDogMS41LjNcbiAqIGF1dGhvciA6IEFkYW0gRHJhcGVyXG4gKiBsaWNlbnNlIDogTUlUXG4gKiBodHRwOi8vYWRhbXdkcmFwZXIuZ2l0aHViLmNvbS9OdW1lcmFsLWpzL1xuICovXG5cbihmdW5jdGlvbiAoKSB7XG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgIENvbnN0YW50c1xuICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgIHZhciBudW1lcmFsLFxuICAgICAgICBWRVJTSU9OID0gJzEuNS4zJyxcbiAgICAgICAgLy8gaW50ZXJuYWwgc3RvcmFnZSBmb3IgbGFuZ3VhZ2UgY29uZmlnIGZpbGVzXG4gICAgICAgIGxhbmd1YWdlcyA9IHt9LFxuICAgICAgICBjdXJyZW50TGFuZ3VhZ2UgPSAnZW4nLFxuICAgICAgICB6ZXJvRm9ybWF0ID0gbnVsbCxcbiAgICAgICAgZGVmYXVsdEZvcm1hdCA9ICcwLDAnLFxuICAgICAgICAvLyBjaGVjayBmb3Igbm9kZUpTXG4gICAgICAgIGhhc01vZHVsZSA9ICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cyk7XG5cblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgQ29uc3RydWN0b3JzXG4gICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5cbiAgICAvLyBOdW1lcmFsIHByb3RvdHlwZSBvYmplY3RcbiAgICBmdW5jdGlvbiBOdW1lcmFsIChudW1iZXIpIHtcbiAgICAgICAgdGhpcy5fdmFsdWUgPSBudW1iZXI7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW1wbGVtZW50YXRpb24gb2YgdG9GaXhlZCgpIHRoYXQgdHJlYXRzIGZsb2F0cyBtb3JlIGxpa2UgZGVjaW1hbHNcbiAgICAgKlxuICAgICAqIEZpeGVzIGJpbmFyeSByb3VuZGluZyBpc3N1ZXMgKGVnLiAoMC42MTUpLnRvRml4ZWQoMikgPT09ICcwLjYxJykgdGhhdCBwcmVzZW50XG4gICAgICogcHJvYmxlbXMgZm9yIGFjY291bnRpbmctIGFuZCBmaW5hbmNlLXJlbGF0ZWQgc29mdHdhcmUuXG4gICAgICovXG4gICAgZnVuY3Rpb24gdG9GaXhlZCAodmFsdWUsIHByZWNpc2lvbiwgcm91bmRpbmdGdW5jdGlvbiwgb3B0aW9uYWxzKSB7XG4gICAgICAgIHZhciBwb3dlciA9IE1hdGgucG93KDEwLCBwcmVjaXNpb24pLFxuICAgICAgICAgICAgb3B0aW9uYWxzUmVnRXhwLFxuICAgICAgICAgICAgb3V0cHV0O1xuICAgICAgICAgICAgXG4gICAgICAgIC8vcm91bmRpbmdGdW5jdGlvbiA9IChyb3VuZGluZ0Z1bmN0aW9uICE9PSB1bmRlZmluZWQgPyByb3VuZGluZ0Z1bmN0aW9uIDogTWF0aC5yb3VuZCk7XG4gICAgICAgIC8vIE11bHRpcGx5IHVwIGJ5IHByZWNpc2lvbiwgcm91bmQgYWNjdXJhdGVseSwgdGhlbiBkaXZpZGUgYW5kIHVzZSBuYXRpdmUgdG9GaXhlZCgpOlxuICAgICAgICBvdXRwdXQgPSAocm91bmRpbmdGdW5jdGlvbih2YWx1ZSAqIHBvd2VyKSAvIHBvd2VyKS50b0ZpeGVkKHByZWNpc2lvbik7XG5cbiAgICAgICAgaWYgKG9wdGlvbmFscykge1xuICAgICAgICAgICAgb3B0aW9uYWxzUmVnRXhwID0gbmV3IFJlZ0V4cCgnMHsxLCcgKyBvcHRpb25hbHMgKyAnfSQnKTtcbiAgICAgICAgICAgIG91dHB1dCA9IG91dHB1dC5yZXBsYWNlKG9wdGlvbmFsc1JlZ0V4cCwgJycpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICB9XG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgIEZvcm1hdHRpbmdcbiAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAvLyBkZXRlcm1pbmUgd2hhdCB0eXBlIG9mIGZvcm1hdHRpbmcgd2UgbmVlZCB0byBkb1xuICAgIGZ1bmN0aW9uIGZvcm1hdE51bWVyYWwgKG4sIGZvcm1hdCwgcm91bmRpbmdGdW5jdGlvbikge1xuICAgICAgICB2YXIgb3V0cHV0O1xuXG4gICAgICAgIC8vIGZpZ3VyZSBvdXQgd2hhdCBraW5kIG9mIGZvcm1hdCB3ZSBhcmUgZGVhbGluZyB3aXRoXG4gICAgICAgIGlmIChmb3JtYXQuaW5kZXhPZignJCcpID4gLTEpIHsgLy8gY3VycmVuY3khISEhIVxuICAgICAgICAgICAgb3V0cHV0ID0gZm9ybWF0Q3VycmVuY3kobiwgZm9ybWF0LCByb3VuZGluZ0Z1bmN0aW9uKTtcbiAgICAgICAgfSBlbHNlIGlmIChmb3JtYXQuaW5kZXhPZignJScpID4gLTEpIHsgLy8gcGVyY2VudGFnZVxuICAgICAgICAgICAgb3V0cHV0ID0gZm9ybWF0UGVyY2VudGFnZShuLCBmb3JtYXQsIHJvdW5kaW5nRnVuY3Rpb24pO1xuICAgICAgICB9IGVsc2UgaWYgKGZvcm1hdC5pbmRleE9mKCc6JykgPiAtMSkgeyAvLyB0aW1lXG4gICAgICAgICAgICBvdXRwdXQgPSBmb3JtYXRUaW1lKG4sIGZvcm1hdCk7XG4gICAgICAgIH0gZWxzZSB7IC8vIHBsYWluIG9sJyBudW1iZXJzIG9yIGJ5dGVzXG4gICAgICAgICAgICBvdXRwdXQgPSBmb3JtYXROdW1iZXIobi5fdmFsdWUsIGZvcm1hdCwgcm91bmRpbmdGdW5jdGlvbik7XG4gICAgICAgIH1cblxuICAgICAgICAvLyByZXR1cm4gc3RyaW5nXG4gICAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgfVxuXG4gICAgLy8gcmV2ZXJ0IHRvIG51bWJlclxuICAgIGZ1bmN0aW9uIHVuZm9ybWF0TnVtZXJhbCAobiwgc3RyaW5nKSB7XG4gICAgICAgIHZhciBzdHJpbmdPcmlnaW5hbCA9IHN0cmluZyxcbiAgICAgICAgICAgIHRob3VzYW5kUmVnRXhwLFxuICAgICAgICAgICAgbWlsbGlvblJlZ0V4cCxcbiAgICAgICAgICAgIGJpbGxpb25SZWdFeHAsXG4gICAgICAgICAgICB0cmlsbGlvblJlZ0V4cCxcbiAgICAgICAgICAgIHN1ZmZpeGVzID0gWydLQicsICdNQicsICdHQicsICdUQicsICdQQicsICdFQicsICdaQicsICdZQiddLFxuICAgICAgICAgICAgYnl0ZXNNdWx0aXBsaWVyID0gZmFsc2UsXG4gICAgICAgICAgICBwb3dlcjtcblxuICAgICAgICBpZiAoc3RyaW5nLmluZGV4T2YoJzonKSA+IC0xKSB7XG4gICAgICAgICAgICBuLl92YWx1ZSA9IHVuZm9ybWF0VGltZShzdHJpbmcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHN0cmluZyA9PT0gemVyb0Zvcm1hdCkge1xuICAgICAgICAgICAgICAgIG4uX3ZhbHVlID0gMDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKGxhbmd1YWdlc1tjdXJyZW50TGFuZ3VhZ2VdLmRlbGltaXRlcnMuZGVjaW1hbCAhPT0gJy4nKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0cmluZyA9IHN0cmluZy5yZXBsYWNlKC9cXC4vZywnJykucmVwbGFjZShsYW5ndWFnZXNbY3VycmVudExhbmd1YWdlXS5kZWxpbWl0ZXJzLmRlY2ltYWwsICcuJyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gc2VlIGlmIGFiYnJldmlhdGlvbnMgYXJlIHRoZXJlIHNvIHRoYXQgd2UgY2FuIG11bHRpcGx5IHRvIHRoZSBjb3JyZWN0IG51bWJlclxuICAgICAgICAgICAgICAgIHRob3VzYW5kUmVnRXhwID0gbmV3IFJlZ0V4cCgnW15hLXpBLVpdJyArIGxhbmd1YWdlc1tjdXJyZW50TGFuZ3VhZ2VdLmFiYnJldmlhdGlvbnMudGhvdXNhbmQgKyAnKD86XFxcXCl8KFxcXFwnICsgbGFuZ3VhZ2VzW2N1cnJlbnRMYW5ndWFnZV0uY3VycmVuY3kuc3ltYm9sICsgJyk/KD86XFxcXCkpPyk/JCcpO1xuICAgICAgICAgICAgICAgIG1pbGxpb25SZWdFeHAgPSBuZXcgUmVnRXhwKCdbXmEtekEtWl0nICsgbGFuZ3VhZ2VzW2N1cnJlbnRMYW5ndWFnZV0uYWJicmV2aWF0aW9ucy5taWxsaW9uICsgJyg/OlxcXFwpfChcXFxcJyArIGxhbmd1YWdlc1tjdXJyZW50TGFuZ3VhZ2VdLmN1cnJlbmN5LnN5bWJvbCArICcpPyg/OlxcXFwpKT8pPyQnKTtcbiAgICAgICAgICAgICAgICBiaWxsaW9uUmVnRXhwID0gbmV3IFJlZ0V4cCgnW15hLXpBLVpdJyArIGxhbmd1YWdlc1tjdXJyZW50TGFuZ3VhZ2VdLmFiYnJldmlhdGlvbnMuYmlsbGlvbiArICcoPzpcXFxcKXwoXFxcXCcgKyBsYW5ndWFnZXNbY3VycmVudExhbmd1YWdlXS5jdXJyZW5jeS5zeW1ib2wgKyAnKT8oPzpcXFxcKSk/KT8kJyk7XG4gICAgICAgICAgICAgICAgdHJpbGxpb25SZWdFeHAgPSBuZXcgUmVnRXhwKCdbXmEtekEtWl0nICsgbGFuZ3VhZ2VzW2N1cnJlbnRMYW5ndWFnZV0uYWJicmV2aWF0aW9ucy50cmlsbGlvbiArICcoPzpcXFxcKXwoXFxcXCcgKyBsYW5ndWFnZXNbY3VycmVudExhbmd1YWdlXS5jdXJyZW5jeS5zeW1ib2wgKyAnKT8oPzpcXFxcKSk/KT8kJyk7XG5cbiAgICAgICAgICAgICAgICAvLyBzZWUgaWYgYnl0ZXMgYXJlIHRoZXJlIHNvIHRoYXQgd2UgY2FuIG11bHRpcGx5IHRvIHRoZSBjb3JyZWN0IG51bWJlclxuICAgICAgICAgICAgICAgIGZvciAocG93ZXIgPSAwOyBwb3dlciA8PSBzdWZmaXhlcy5sZW5ndGg7IHBvd2VyKyspIHtcbiAgICAgICAgICAgICAgICAgICAgYnl0ZXNNdWx0aXBsaWVyID0gKHN0cmluZy5pbmRleE9mKHN1ZmZpeGVzW3Bvd2VyXSkgPiAtMSkgPyBNYXRoLnBvdygxMDI0LCBwb3dlciArIDEpIDogZmFsc2U7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGJ5dGVzTXVsdGlwbGllcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBkbyBzb21lIG1hdGggdG8gY3JlYXRlIG91ciBudW1iZXJcbiAgICAgICAgICAgICAgICBuLl92YWx1ZSA9ICgoYnl0ZXNNdWx0aXBsaWVyKSA/IGJ5dGVzTXVsdGlwbGllciA6IDEpICogKChzdHJpbmdPcmlnaW5hbC5tYXRjaCh0aG91c2FuZFJlZ0V4cCkpID8gTWF0aC5wb3coMTAsIDMpIDogMSkgKiAoKHN0cmluZ09yaWdpbmFsLm1hdGNoKG1pbGxpb25SZWdFeHApKSA/IE1hdGgucG93KDEwLCA2KSA6IDEpICogKChzdHJpbmdPcmlnaW5hbC5tYXRjaChiaWxsaW9uUmVnRXhwKSkgPyBNYXRoLnBvdygxMCwgOSkgOiAxKSAqICgoc3RyaW5nT3JpZ2luYWwubWF0Y2godHJpbGxpb25SZWdFeHApKSA/IE1hdGgucG93KDEwLCAxMikgOiAxKSAqICgoc3RyaW5nLmluZGV4T2YoJyUnKSA+IC0xKSA/IDAuMDEgOiAxKSAqICgoKHN0cmluZy5zcGxpdCgnLScpLmxlbmd0aCArIE1hdGgubWluKHN0cmluZy5zcGxpdCgnKCcpLmxlbmd0aC0xLCBzdHJpbmcuc3BsaXQoJyknKS5sZW5ndGgtMSkpICUgMik/IDE6IC0xKSAqIE51bWJlcihzdHJpbmcucmVwbGFjZSgvW14wLTlcXC5dKy9nLCAnJykpO1xuXG4gICAgICAgICAgICAgICAgLy8gcm91bmQgaWYgd2UgYXJlIHRhbGtpbmcgYWJvdXQgYnl0ZXNcbiAgICAgICAgICAgICAgICBuLl92YWx1ZSA9IChieXRlc011bHRpcGxpZXIpID8gTWF0aC5jZWlsKG4uX3ZhbHVlKSA6IG4uX3ZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuLl92YWx1ZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmb3JtYXRDdXJyZW5jeSAobiwgZm9ybWF0LCByb3VuZGluZ0Z1bmN0aW9uKSB7XG4gICAgICAgIHZhciBzeW1ib2xJbmRleCA9IGZvcm1hdC5pbmRleE9mKCckJyksXG4gICAgICAgICAgICBvcGVuUGFyZW5JbmRleCA9IGZvcm1hdC5pbmRleE9mKCcoJyksXG4gICAgICAgICAgICBtaW51c1NpZ25JbmRleCA9IGZvcm1hdC5pbmRleE9mKCctJyksXG4gICAgICAgICAgICBzcGFjZSA9ICcnLFxuICAgICAgICAgICAgc3BsaWNlSW5kZXgsXG4gICAgICAgICAgICBvdXRwdXQ7XG5cbiAgICAgICAgLy8gY2hlY2sgZm9yIHNwYWNlIGJlZm9yZSBvciBhZnRlciBjdXJyZW5jeVxuICAgICAgICBpZiAoZm9ybWF0LmluZGV4T2YoJyAkJykgPiAtMSkge1xuICAgICAgICAgICAgc3BhY2UgPSAnICc7XG4gICAgICAgICAgICBmb3JtYXQgPSBmb3JtYXQucmVwbGFjZSgnICQnLCAnJyk7XG4gICAgICAgIH0gZWxzZSBpZiAoZm9ybWF0LmluZGV4T2YoJyQgJykgPiAtMSkge1xuICAgICAgICAgICAgc3BhY2UgPSAnICc7XG4gICAgICAgICAgICBmb3JtYXQgPSBmb3JtYXQucmVwbGFjZSgnJCAnLCAnJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmb3JtYXQgPSBmb3JtYXQucmVwbGFjZSgnJCcsICcnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGZvcm1hdCB0aGUgbnVtYmVyXG4gICAgICAgIG91dHB1dCA9IGZvcm1hdE51bWJlcihuLl92YWx1ZSwgZm9ybWF0LCByb3VuZGluZ0Z1bmN0aW9uKTtcblxuICAgICAgICAvLyBwb3NpdGlvbiB0aGUgc3ltYm9sXG4gICAgICAgIGlmIChzeW1ib2xJbmRleCA8PSAxKSB7XG4gICAgICAgICAgICBpZiAob3V0cHV0LmluZGV4T2YoJygnKSA+IC0xIHx8IG91dHB1dC5pbmRleE9mKCctJykgPiAtMSkge1xuICAgICAgICAgICAgICAgIG91dHB1dCA9IG91dHB1dC5zcGxpdCgnJyk7XG4gICAgICAgICAgICAgICAgc3BsaWNlSW5kZXggPSAxO1xuICAgICAgICAgICAgICAgIGlmIChzeW1ib2xJbmRleCA8IG9wZW5QYXJlbkluZGV4IHx8IHN5bWJvbEluZGV4IDwgbWludXNTaWduSW5kZXgpe1xuICAgICAgICAgICAgICAgICAgICAvLyB0aGUgc3ltYm9sIGFwcGVhcnMgYmVmb3JlIHRoZSBcIihcIiBvciBcIi1cIlxuICAgICAgICAgICAgICAgICAgICBzcGxpY2VJbmRleCA9IDA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG91dHB1dC5zcGxpY2Uoc3BsaWNlSW5kZXgsIDAsIGxhbmd1YWdlc1tjdXJyZW50TGFuZ3VhZ2VdLmN1cnJlbmN5LnN5bWJvbCArIHNwYWNlKTtcbiAgICAgICAgICAgICAgICBvdXRwdXQgPSBvdXRwdXQuam9pbignJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG91dHB1dCA9IGxhbmd1YWdlc1tjdXJyZW50TGFuZ3VhZ2VdLmN1cnJlbmN5LnN5bWJvbCArIHNwYWNlICsgb3V0cHV0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKG91dHB1dC5pbmRleE9mKCcpJykgPiAtMSkge1xuICAgICAgICAgICAgICAgIG91dHB1dCA9IG91dHB1dC5zcGxpdCgnJyk7XG4gICAgICAgICAgICAgICAgb3V0cHV0LnNwbGljZSgtMSwgMCwgc3BhY2UgKyBsYW5ndWFnZXNbY3VycmVudExhbmd1YWdlXS5jdXJyZW5jeS5zeW1ib2wpO1xuICAgICAgICAgICAgICAgIG91dHB1dCA9IG91dHB1dC5qb2luKCcnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgb3V0cHV0ID0gb3V0cHV0ICsgc3BhY2UgKyBsYW5ndWFnZXNbY3VycmVudExhbmd1YWdlXS5jdXJyZW5jeS5zeW1ib2w7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZvcm1hdFBlcmNlbnRhZ2UgKG4sIGZvcm1hdCwgcm91bmRpbmdGdW5jdGlvbikge1xuICAgICAgICB2YXIgc3BhY2UgPSAnJyxcbiAgICAgICAgICAgIG91dHB1dCxcbiAgICAgICAgICAgIHZhbHVlID0gbi5fdmFsdWUgKiAxMDA7XG5cbiAgICAgICAgLy8gY2hlY2sgZm9yIHNwYWNlIGJlZm9yZSAlXG4gICAgICAgIGlmIChmb3JtYXQuaW5kZXhPZignICUnKSA+IC0xKSB7XG4gICAgICAgICAgICBzcGFjZSA9ICcgJztcbiAgICAgICAgICAgIGZvcm1hdCA9IGZvcm1hdC5yZXBsYWNlKCcgJScsICcnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZvcm1hdCA9IGZvcm1hdC5yZXBsYWNlKCclJywgJycpO1xuICAgICAgICB9XG5cbiAgICAgICAgb3V0cHV0ID0gZm9ybWF0TnVtYmVyKHZhbHVlLCBmb3JtYXQsIHJvdW5kaW5nRnVuY3Rpb24pO1xuICAgICAgICBcbiAgICAgICAgaWYgKG91dHB1dC5pbmRleE9mKCcpJykgPiAtMSApIHtcbiAgICAgICAgICAgIG91dHB1dCA9IG91dHB1dC5zcGxpdCgnJyk7XG4gICAgICAgICAgICBvdXRwdXQuc3BsaWNlKC0xLCAwLCBzcGFjZSArICclJyk7XG4gICAgICAgICAgICBvdXRwdXQgPSBvdXRwdXQuam9pbignJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvdXRwdXQgPSBvdXRwdXQgKyBzcGFjZSArICclJztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZm9ybWF0VGltZSAobikge1xuICAgICAgICB2YXIgaG91cnMgPSBNYXRoLmZsb29yKG4uX3ZhbHVlLzYwLzYwKSxcbiAgICAgICAgICAgIG1pbnV0ZXMgPSBNYXRoLmZsb29yKChuLl92YWx1ZSAtIChob3VycyAqIDYwICogNjApKS82MCksXG4gICAgICAgICAgICBzZWNvbmRzID0gTWF0aC5yb3VuZChuLl92YWx1ZSAtIChob3VycyAqIDYwICogNjApIC0gKG1pbnV0ZXMgKiA2MCkpO1xuICAgICAgICByZXR1cm4gaG91cnMgKyAnOicgKyAoKG1pbnV0ZXMgPCAxMCkgPyAnMCcgKyBtaW51dGVzIDogbWludXRlcykgKyAnOicgKyAoKHNlY29uZHMgPCAxMCkgPyAnMCcgKyBzZWNvbmRzIDogc2Vjb25kcyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdW5mb3JtYXRUaW1lIChzdHJpbmcpIHtcbiAgICAgICAgdmFyIHRpbWVBcnJheSA9IHN0cmluZy5zcGxpdCgnOicpLFxuICAgICAgICAgICAgc2Vjb25kcyA9IDA7XG4gICAgICAgIC8vIHR1cm4gaG91cnMgYW5kIG1pbnV0ZXMgaW50byBzZWNvbmRzIGFuZCBhZGQgdGhlbSBhbGwgdXBcbiAgICAgICAgaWYgKHRpbWVBcnJheS5sZW5ndGggPT09IDMpIHtcbiAgICAgICAgICAgIC8vIGhvdXJzXG4gICAgICAgICAgICBzZWNvbmRzID0gc2Vjb25kcyArIChOdW1iZXIodGltZUFycmF5WzBdKSAqIDYwICogNjApO1xuICAgICAgICAgICAgLy8gbWludXRlc1xuICAgICAgICAgICAgc2Vjb25kcyA9IHNlY29uZHMgKyAoTnVtYmVyKHRpbWVBcnJheVsxXSkgKiA2MCk7XG4gICAgICAgICAgICAvLyBzZWNvbmRzXG4gICAgICAgICAgICBzZWNvbmRzID0gc2Vjb25kcyArIE51bWJlcih0aW1lQXJyYXlbMl0pO1xuICAgICAgICB9IGVsc2UgaWYgKHRpbWVBcnJheS5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgICAgIC8vIG1pbnV0ZXNcbiAgICAgICAgICAgIHNlY29uZHMgPSBzZWNvbmRzICsgKE51bWJlcih0aW1lQXJyYXlbMF0pICogNjApO1xuICAgICAgICAgICAgLy8gc2Vjb25kc1xuICAgICAgICAgICAgc2Vjb25kcyA9IHNlY29uZHMgKyBOdW1iZXIodGltZUFycmF5WzFdKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gTnVtYmVyKHNlY29uZHMpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZvcm1hdE51bWJlciAodmFsdWUsIGZvcm1hdCwgcm91bmRpbmdGdW5jdGlvbikge1xuICAgICAgICB2YXIgbmVnUCA9IGZhbHNlLFxuICAgICAgICAgICAgc2lnbmVkID0gZmFsc2UsXG4gICAgICAgICAgICBvcHREZWMgPSBmYWxzZSxcbiAgICAgICAgICAgIGFiYnIgPSAnJyxcbiAgICAgICAgICAgIGFiYnJLID0gZmFsc2UsIC8vIGZvcmNlIGFiYnJldmlhdGlvbiB0byB0aG91c2FuZHNcbiAgICAgICAgICAgIGFiYnJNID0gZmFsc2UsIC8vIGZvcmNlIGFiYnJldmlhdGlvbiB0byBtaWxsaW9uc1xuICAgICAgICAgICAgYWJickIgPSBmYWxzZSwgLy8gZm9yY2UgYWJicmV2aWF0aW9uIHRvIGJpbGxpb25zXG4gICAgICAgICAgICBhYmJyVCA9IGZhbHNlLCAvLyBmb3JjZSBhYmJyZXZpYXRpb24gdG8gdHJpbGxpb25zXG4gICAgICAgICAgICBhYmJyRm9yY2UgPSBmYWxzZSwgLy8gZm9yY2UgYWJicmV2aWF0aW9uXG4gICAgICAgICAgICBieXRlcyA9ICcnLFxuICAgICAgICAgICAgb3JkID0gJycsXG4gICAgICAgICAgICBhYnMgPSBNYXRoLmFicyh2YWx1ZSksXG4gICAgICAgICAgICBzdWZmaXhlcyA9IFsnQicsICdLQicsICdNQicsICdHQicsICdUQicsICdQQicsICdFQicsICdaQicsICdZQiddLFxuICAgICAgICAgICAgbWluLFxuICAgICAgICAgICAgbWF4LFxuICAgICAgICAgICAgcG93ZXIsXG4gICAgICAgICAgICB3LFxuICAgICAgICAgICAgcHJlY2lzaW9uLFxuICAgICAgICAgICAgdGhvdXNhbmRzLFxuICAgICAgICAgICAgZCA9ICcnLFxuICAgICAgICAgICAgbmVnID0gZmFsc2U7XG5cbiAgICAgICAgLy8gY2hlY2sgaWYgbnVtYmVyIGlzIHplcm8gYW5kIGEgY3VzdG9tIHplcm8gZm9ybWF0IGhhcyBiZWVuIHNldFxuICAgICAgICBpZiAodmFsdWUgPT09IDAgJiYgemVyb0Zvcm1hdCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIHplcm9Gb3JtYXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBzZWUgaWYgd2Ugc2hvdWxkIHVzZSBwYXJlbnRoZXNlcyBmb3IgbmVnYXRpdmUgbnVtYmVyIG9yIGlmIHdlIHNob3VsZCBwcmVmaXggd2l0aCBhIHNpZ25cbiAgICAgICAgICAgIC8vIGlmIGJvdGggYXJlIHByZXNlbnQgd2UgZGVmYXVsdCB0byBwYXJlbnRoZXNlc1xuICAgICAgICAgICAgaWYgKGZvcm1hdC5pbmRleE9mKCcoJykgPiAtMSkge1xuICAgICAgICAgICAgICAgIG5lZ1AgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGZvcm1hdCA9IGZvcm1hdC5zbGljZSgxLCAtMSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGZvcm1hdC5pbmRleE9mKCcrJykgPiAtMSkge1xuICAgICAgICAgICAgICAgIHNpZ25lZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgZm9ybWF0ID0gZm9ybWF0LnJlcGxhY2UoL1xcKy9nLCAnJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHNlZSBpZiBhYmJyZXZpYXRpb24gaXMgd2FudGVkXG4gICAgICAgICAgICBpZiAoZm9ybWF0LmluZGV4T2YoJ2EnKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgLy8gY2hlY2sgaWYgYWJicmV2aWF0aW9uIGlzIHNwZWNpZmllZFxuICAgICAgICAgICAgICAgIGFiYnJLID0gZm9ybWF0LmluZGV4T2YoJ2FLJykgPj0gMDtcbiAgICAgICAgICAgICAgICBhYmJyTSA9IGZvcm1hdC5pbmRleE9mKCdhTScpID49IDA7XG4gICAgICAgICAgICAgICAgYWJickIgPSBmb3JtYXQuaW5kZXhPZignYUInKSA+PSAwO1xuICAgICAgICAgICAgICAgIGFiYnJUID0gZm9ybWF0LmluZGV4T2YoJ2FUJykgPj0gMDtcbiAgICAgICAgICAgICAgICBhYmJyRm9yY2UgPSBhYmJySyB8fCBhYmJyTSB8fCBhYmJyQiB8fCBhYmJyVDtcblxuICAgICAgICAgICAgICAgIC8vIGNoZWNrIGZvciBzcGFjZSBiZWZvcmUgYWJicmV2aWF0aW9uXG4gICAgICAgICAgICAgICAgaWYgKGZvcm1hdC5pbmRleE9mKCcgYScpID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgYWJiciA9ICcgJztcbiAgICAgICAgICAgICAgICAgICAgZm9ybWF0ID0gZm9ybWF0LnJlcGxhY2UoJyBhJywgJycpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGZvcm1hdCA9IGZvcm1hdC5yZXBsYWNlKCdhJywgJycpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChhYnMgPj0gTWF0aC5wb3coMTAsIDEyKSAmJiAhYWJickZvcmNlIHx8IGFiYnJUKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHRyaWxsaW9uXG4gICAgICAgICAgICAgICAgICAgIGFiYnIgPSBhYmJyICsgbGFuZ3VhZ2VzW2N1cnJlbnRMYW5ndWFnZV0uYWJicmV2aWF0aW9ucy50cmlsbGlvbjtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZSAvIE1hdGgucG93KDEwLCAxMik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChhYnMgPCBNYXRoLnBvdygxMCwgMTIpICYmIGFicyA+PSBNYXRoLnBvdygxMCwgOSkgJiYgIWFiYnJGb3JjZSB8fCBhYmJyQikge1xuICAgICAgICAgICAgICAgICAgICAvLyBiaWxsaW9uXG4gICAgICAgICAgICAgICAgICAgIGFiYnIgPSBhYmJyICsgbGFuZ3VhZ2VzW2N1cnJlbnRMYW5ndWFnZV0uYWJicmV2aWF0aW9ucy5iaWxsaW9uO1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlIC8gTWF0aC5wb3coMTAsIDkpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYWJzIDwgTWF0aC5wb3coMTAsIDkpICYmIGFicyA+PSBNYXRoLnBvdygxMCwgNikgJiYgIWFiYnJGb3JjZSB8fCBhYmJyTSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBtaWxsaW9uXG4gICAgICAgICAgICAgICAgICAgIGFiYnIgPSBhYmJyICsgbGFuZ3VhZ2VzW2N1cnJlbnRMYW5ndWFnZV0uYWJicmV2aWF0aW9ucy5taWxsaW9uO1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlIC8gTWF0aC5wb3coMTAsIDYpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYWJzIDwgTWF0aC5wb3coMTAsIDYpICYmIGFicyA+PSBNYXRoLnBvdygxMCwgMykgJiYgIWFiYnJGb3JjZSB8fCBhYmJySykge1xuICAgICAgICAgICAgICAgICAgICAvLyB0aG91c2FuZFxuICAgICAgICAgICAgICAgICAgICBhYmJyID0gYWJiciArIGxhbmd1YWdlc1tjdXJyZW50TGFuZ3VhZ2VdLmFiYnJldmlhdGlvbnMudGhvdXNhbmQ7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUgLyBNYXRoLnBvdygxMCwgMyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBzZWUgaWYgd2UgYXJlIGZvcm1hdHRpbmcgYnl0ZXNcbiAgICAgICAgICAgIGlmIChmb3JtYXQuaW5kZXhPZignYicpID4gLTEpIHtcbiAgICAgICAgICAgICAgICAvLyBjaGVjayBmb3Igc3BhY2UgYmVmb3JlXG4gICAgICAgICAgICAgICAgaWYgKGZvcm1hdC5pbmRleE9mKCcgYicpID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgYnl0ZXMgPSAnICc7XG4gICAgICAgICAgICAgICAgICAgIGZvcm1hdCA9IGZvcm1hdC5yZXBsYWNlKCcgYicsICcnKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBmb3JtYXQgPSBmb3JtYXQucmVwbGFjZSgnYicsICcnKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBmb3IgKHBvd2VyID0gMDsgcG93ZXIgPD0gc3VmZml4ZXMubGVuZ3RoOyBwb3dlcisrKSB7XG4gICAgICAgICAgICAgICAgICAgIG1pbiA9IE1hdGgucG93KDEwMjQsIHBvd2VyKTtcbiAgICAgICAgICAgICAgICAgICAgbWF4ID0gTWF0aC5wb3coMTAyNCwgcG93ZXIrMSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlID49IG1pbiAmJiB2YWx1ZSA8IG1heCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnl0ZXMgPSBieXRlcyArIHN1ZmZpeGVzW3Bvd2VyXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtaW4gPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZSAvIG1pbjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBzZWUgaWYgb3JkaW5hbCBpcyB3YW50ZWRcbiAgICAgICAgICAgIGlmIChmb3JtYXQuaW5kZXhPZignbycpID4gLTEpIHtcbiAgICAgICAgICAgICAgICAvLyBjaGVjayBmb3Igc3BhY2UgYmVmb3JlXG4gICAgICAgICAgICAgICAgaWYgKGZvcm1hdC5pbmRleE9mKCcgbycpID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgb3JkID0gJyAnO1xuICAgICAgICAgICAgICAgICAgICBmb3JtYXQgPSBmb3JtYXQucmVwbGFjZSgnIG8nLCAnJyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZm9ybWF0ID0gZm9ybWF0LnJlcGxhY2UoJ28nLCAnJyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgb3JkID0gb3JkICsgbGFuZ3VhZ2VzW2N1cnJlbnRMYW5ndWFnZV0ub3JkaW5hbCh2YWx1ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChmb3JtYXQuaW5kZXhPZignWy5dJykgPiAtMSkge1xuICAgICAgICAgICAgICAgIG9wdERlYyA9IHRydWU7XG4gICAgICAgICAgICAgICAgZm9ybWF0ID0gZm9ybWF0LnJlcGxhY2UoJ1suXScsICcuJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHcgPSB2YWx1ZS50b1N0cmluZygpLnNwbGl0KCcuJylbMF07XG4gICAgICAgICAgICBwcmVjaXNpb24gPSBmb3JtYXQuc3BsaXQoJy4nKVsxXTtcbiAgICAgICAgICAgIHRob3VzYW5kcyA9IGZvcm1hdC5pbmRleE9mKCcsJyk7XG5cbiAgICAgICAgICAgIGlmIChwcmVjaXNpb24pIHtcbiAgICAgICAgICAgICAgICBpZiAocHJlY2lzaW9uLmluZGV4T2YoJ1snKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIHByZWNpc2lvbiA9IHByZWNpc2lvbi5yZXBsYWNlKCddJywgJycpO1xuICAgICAgICAgICAgICAgICAgICBwcmVjaXNpb24gPSBwcmVjaXNpb24uc3BsaXQoJ1snKTtcbiAgICAgICAgICAgICAgICAgICAgZCA9IHRvRml4ZWQodmFsdWUsIChwcmVjaXNpb25bMF0ubGVuZ3RoICsgcHJlY2lzaW9uWzFdLmxlbmd0aCksIHJvdW5kaW5nRnVuY3Rpb24sIHByZWNpc2lvblsxXS5sZW5ndGgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGQgPSB0b0ZpeGVkKHZhbHVlLCBwcmVjaXNpb24ubGVuZ3RoLCByb3VuZGluZ0Z1bmN0aW9uKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB3ID0gZC5zcGxpdCgnLicpWzBdO1xuXG4gICAgICAgICAgICAgICAgaWYgKGQuc3BsaXQoJy4nKVsxXS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgZCA9IGxhbmd1YWdlc1tjdXJyZW50TGFuZ3VhZ2VdLmRlbGltaXRlcnMuZGVjaW1hbCArIGQuc3BsaXQoJy4nKVsxXTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBkID0gJyc7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKG9wdERlYyAmJiBOdW1iZXIoZC5zbGljZSgxKSkgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgZCA9ICcnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdyA9IHRvRml4ZWQodmFsdWUsIG51bGwsIHJvdW5kaW5nRnVuY3Rpb24pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBmb3JtYXQgbnVtYmVyXG4gICAgICAgICAgICBpZiAody5pbmRleE9mKCctJykgPiAtMSkge1xuICAgICAgICAgICAgICAgIHcgPSB3LnNsaWNlKDEpO1xuICAgICAgICAgICAgICAgIG5lZyA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aG91c2FuZHMgPiAtMSkge1xuICAgICAgICAgICAgICAgIHcgPSB3LnRvU3RyaW5nKCkucmVwbGFjZSgvKFxcZCkoPz0oXFxkezN9KSsoPyFcXGQpKS9nLCAnJDEnICsgbGFuZ3VhZ2VzW2N1cnJlbnRMYW5ndWFnZV0uZGVsaW1pdGVycy50aG91c2FuZHMpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoZm9ybWF0LmluZGV4T2YoJy4nKSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHcgPSAnJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuICgobmVnUCAmJiBuZWcpID8gJygnIDogJycpICsgKCghbmVnUCAmJiBuZWcpID8gJy0nIDogJycpICsgKCghbmVnICYmIHNpZ25lZCkgPyAnKycgOiAnJykgKyB3ICsgZCArICgob3JkKSA/IG9yZCA6ICcnKSArICgoYWJicikgPyBhYmJyIDogJycpICsgKChieXRlcykgPyBieXRlcyA6ICcnKSArICgobmVnUCAmJiBuZWcpID8gJyknIDogJycpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICBUb3AgTGV2ZWwgRnVuY3Rpb25zXG4gICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgbnVtZXJhbCA9IGZ1bmN0aW9uIChpbnB1dCkge1xuICAgICAgICBpZiAobnVtZXJhbC5pc051bWVyYWwoaW5wdXQpKSB7XG4gICAgICAgICAgICBpbnB1dCA9IGlucHV0LnZhbHVlKCk7XG4gICAgICAgIH0gZWxzZSBpZiAoaW5wdXQgPT09IDAgfHwgdHlwZW9mIGlucHV0ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgaW5wdXQgPSAwO1xuICAgICAgICB9IGVsc2UgaWYgKCFOdW1iZXIoaW5wdXQpKSB7XG4gICAgICAgICAgICBpbnB1dCA9IG51bWVyYWwuZm4udW5mb3JtYXQoaW5wdXQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBOdW1lcmFsKE51bWJlcihpbnB1dCkpO1xuICAgIH07XG5cbiAgICAvLyB2ZXJzaW9uIG51bWJlclxuICAgIG51bWVyYWwudmVyc2lvbiA9IFZFUlNJT047XG5cbiAgICAvLyBjb21wYXJlIG51bWVyYWwgb2JqZWN0XG4gICAgbnVtZXJhbC5pc051bWVyYWwgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgIHJldHVybiBvYmogaW5zdGFuY2VvZiBOdW1lcmFsO1xuICAgIH07XG5cbiAgICAvLyBUaGlzIGZ1bmN0aW9uIHdpbGwgbG9hZCBsYW5ndWFnZXMgYW5kIHRoZW4gc2V0IHRoZSBnbG9iYWwgbGFuZ3VhZ2UuICBJZlxuICAgIC8vIG5vIGFyZ3VtZW50cyBhcmUgcGFzc2VkIGluLCBpdCB3aWxsIHNpbXBseSByZXR1cm4gdGhlIGN1cnJlbnQgZ2xvYmFsXG4gICAgLy8gbGFuZ3VhZ2Uga2V5LlxuICAgIG51bWVyYWwubGFuZ3VhZ2UgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZXMpIHtcbiAgICAgICAgaWYgKCFrZXkpIHtcbiAgICAgICAgICAgIHJldHVybiBjdXJyZW50TGFuZ3VhZ2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoa2V5ICYmICF2YWx1ZXMpIHtcbiAgICAgICAgICAgIGlmKCFsYW5ndWFnZXNba2V5XSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBsYW5ndWFnZSA6ICcgKyBrZXkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY3VycmVudExhbmd1YWdlID0ga2V5O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHZhbHVlcyB8fCAhbGFuZ3VhZ2VzW2tleV0pIHtcbiAgICAgICAgICAgIGxvYWRMYW5ndWFnZShrZXksIHZhbHVlcyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbnVtZXJhbDtcbiAgICB9O1xuICAgIFxuICAgIC8vIFRoaXMgZnVuY3Rpb24gcHJvdmlkZXMgYWNjZXNzIHRvIHRoZSBsb2FkZWQgbGFuZ3VhZ2UgZGF0YS4gIElmXG4gICAgLy8gbm8gYXJndW1lbnRzIGFyZSBwYXNzZWQgaW4sIGl0IHdpbGwgc2ltcGx5IHJldHVybiB0aGUgY3VycmVudFxuICAgIC8vIGdsb2JhbCBsYW5ndWFnZSBvYmplY3QuXG4gICAgbnVtZXJhbC5sYW5ndWFnZURhdGEgPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIGlmICgha2V5KSB7XG4gICAgICAgICAgICByZXR1cm4gbGFuZ3VhZ2VzW2N1cnJlbnRMYW5ndWFnZV07XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGlmICghbGFuZ3VhZ2VzW2tleV0pIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBsYW5ndWFnZSA6ICcgKyBrZXkpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gbGFuZ3VhZ2VzW2tleV07XG4gICAgfTtcblxuICAgIG51bWVyYWwubGFuZ3VhZ2UoJ2VuJywge1xuICAgICAgICBkZWxpbWl0ZXJzOiB7XG4gICAgICAgICAgICB0aG91c2FuZHM6ICcsJyxcbiAgICAgICAgICAgIGRlY2ltYWw6ICcuJ1xuICAgICAgICB9LFxuICAgICAgICBhYmJyZXZpYXRpb25zOiB7XG4gICAgICAgICAgICB0aG91c2FuZDogJ2snLFxuICAgICAgICAgICAgbWlsbGlvbjogJ20nLFxuICAgICAgICAgICAgYmlsbGlvbjogJ2InLFxuICAgICAgICAgICAgdHJpbGxpb246ICd0J1xuICAgICAgICB9LFxuICAgICAgICBvcmRpbmFsOiBmdW5jdGlvbiAobnVtYmVyKSB7XG4gICAgICAgICAgICB2YXIgYiA9IG51bWJlciAlIDEwO1xuICAgICAgICAgICAgcmV0dXJuICh+fiAobnVtYmVyICUgMTAwIC8gMTApID09PSAxKSA/ICd0aCcgOlxuICAgICAgICAgICAgICAgIChiID09PSAxKSA/ICdzdCcgOlxuICAgICAgICAgICAgICAgIChiID09PSAyKSA/ICduZCcgOlxuICAgICAgICAgICAgICAgIChiID09PSAzKSA/ICdyZCcgOiAndGgnO1xuICAgICAgICB9LFxuICAgICAgICBjdXJyZW5jeToge1xuICAgICAgICAgICAgc3ltYm9sOiAnJCdcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgbnVtZXJhbC56ZXJvRm9ybWF0ID0gZnVuY3Rpb24gKGZvcm1hdCkge1xuICAgICAgICB6ZXJvRm9ybWF0ID0gdHlwZW9mKGZvcm1hdCkgPT09ICdzdHJpbmcnID8gZm9ybWF0IDogbnVsbDtcbiAgICB9O1xuXG4gICAgbnVtZXJhbC5kZWZhdWx0Rm9ybWF0ID0gZnVuY3Rpb24gKGZvcm1hdCkge1xuICAgICAgICBkZWZhdWx0Rm9ybWF0ID0gdHlwZW9mKGZvcm1hdCkgPT09ICdzdHJpbmcnID8gZm9ybWF0IDogJzAuMCc7XG4gICAgfTtcblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgSGVscGVyc1xuICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgIGZ1bmN0aW9uIGxvYWRMYW5ndWFnZShrZXksIHZhbHVlcykge1xuICAgICAgICBsYW5ndWFnZXNba2V5XSA9IHZhbHVlcztcbiAgICB9XG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgIEZsb2F0aW5nLXBvaW50IGhlbHBlcnNcbiAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAvLyBUaGUgZmxvYXRpbmctcG9pbnQgaGVscGVyIGZ1bmN0aW9ucyBhbmQgaW1wbGVtZW50YXRpb25cbiAgICAvLyBib3Jyb3dzIGhlYXZpbHkgZnJvbSBzaW5mdWwuanM6IGh0dHA6Ly9ndWlwbi5naXRodWIuaW8vc2luZnVsLmpzL1xuXG4gICAgLyoqXG4gICAgICogQXJyYXkucHJvdG90eXBlLnJlZHVjZSBmb3IgYnJvd3NlcnMgdGhhdCBkb24ndCBzdXBwb3J0IGl0XG4gICAgICogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvQXJyYXkvUmVkdWNlI0NvbXBhdGliaWxpdHlcbiAgICAgKi9cbiAgICBpZiAoJ2Z1bmN0aW9uJyAhPT0gdHlwZW9mIEFycmF5LnByb3RvdHlwZS5yZWR1Y2UpIHtcbiAgICAgICAgQXJyYXkucHJvdG90eXBlLnJlZHVjZSA9IGZ1bmN0aW9uIChjYWxsYmFjaywgb3B0X2luaXRpYWxWYWx1ZSkge1xuICAgICAgICAgICAgJ3VzZSBzdHJpY3QnO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAobnVsbCA9PT0gdGhpcyB8fCAndW5kZWZpbmVkJyA9PT0gdHlwZW9mIHRoaXMpIHtcbiAgICAgICAgICAgICAgICAvLyBBdCB0aGUgbW9tZW50IGFsbCBtb2Rlcm4gYnJvd3NlcnMsIHRoYXQgc3VwcG9ydCBzdHJpY3QgbW9kZSwgaGF2ZVxuICAgICAgICAgICAgICAgIC8vIG5hdGl2ZSBpbXBsZW1lbnRhdGlvbiBvZiBBcnJheS5wcm90b3R5cGUucmVkdWNlLiBGb3IgaW5zdGFuY2UsIElFOFxuICAgICAgICAgICAgICAgIC8vIGRvZXMgbm90IHN1cHBvcnQgc3RyaWN0IG1vZGUsIHNvIHRoaXMgY2hlY2sgaXMgYWN0dWFsbHkgdXNlbGVzcy5cbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcnJheS5wcm90b3R5cGUucmVkdWNlIGNhbGxlZCBvbiBudWxsIG9yIHVuZGVmaW5lZCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoJ2Z1bmN0aW9uJyAhPT0gdHlwZW9mIGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihjYWxsYmFjayArICcgaXMgbm90IGEgZnVuY3Rpb24nKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGluZGV4LFxuICAgICAgICAgICAgICAgIHZhbHVlLFxuICAgICAgICAgICAgICAgIGxlbmd0aCA9IHRoaXMubGVuZ3RoID4+PiAwLFxuICAgICAgICAgICAgICAgIGlzVmFsdWVTZXQgPSBmYWxzZTtcblxuICAgICAgICAgICAgaWYgKDEgPCBhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBvcHRfaW5pdGlhbFZhbHVlO1xuICAgICAgICAgICAgICAgIGlzVmFsdWVTZXQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IgKGluZGV4ID0gMDsgbGVuZ3RoID4gaW5kZXg7ICsraW5kZXgpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5oYXNPd25Qcm9wZXJ0eShpbmRleCkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzVmFsdWVTZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gY2FsbGJhY2sodmFsdWUsIHRoaXNbaW5kZXhdLCBpbmRleCwgdGhpcyk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHRoaXNbaW5kZXhdO1xuICAgICAgICAgICAgICAgICAgICAgICAgaXNWYWx1ZVNldCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghaXNWYWx1ZVNldCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1JlZHVjZSBvZiBlbXB0eSBhcnJheSB3aXRoIG5vIGluaXRpYWwgdmFsdWUnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIFxuICAgIC8qKlxuICAgICAqIENvbXB1dGVzIHRoZSBtdWx0aXBsaWVyIG5lY2Vzc2FyeSB0byBtYWtlIHggPj0gMSxcbiAgICAgKiBlZmZlY3RpdmVseSBlbGltaW5hdGluZyBtaXNjYWxjdWxhdGlvbnMgY2F1c2VkIGJ5XG4gICAgICogZmluaXRlIHByZWNpc2lvbi5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBtdWx0aXBsaWVyKHgpIHtcbiAgICAgICAgdmFyIHBhcnRzID0geC50b1N0cmluZygpLnNwbGl0KCcuJyk7XG4gICAgICAgIGlmIChwYXJ0cy5sZW5ndGggPCAyKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gTWF0aC5wb3coMTAsIHBhcnRzWzFdLmxlbmd0aCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2l2ZW4gYSB2YXJpYWJsZSBudW1iZXIgb2YgYXJndW1lbnRzLCByZXR1cm5zIHRoZSBtYXhpbXVtXG4gICAgICogbXVsdGlwbGllciB0aGF0IG11c3QgYmUgdXNlZCB0byBub3JtYWxpemUgYW4gb3BlcmF0aW9uIGludm9sdmluZ1xuICAgICAqIGFsbCBvZiB0aGVtLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGNvcnJlY3Rpb25GYWN0b3IoKSB7XG4gICAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICAgICAgcmV0dXJuIGFyZ3MucmVkdWNlKGZ1bmN0aW9uIChwcmV2LCBuZXh0KSB7XG4gICAgICAgICAgICB2YXIgbXAgPSBtdWx0aXBsaWVyKHByZXYpLFxuICAgICAgICAgICAgICAgIG1uID0gbXVsdGlwbGllcihuZXh0KTtcbiAgICAgICAgcmV0dXJuIG1wID4gbW4gPyBtcCA6IG1uO1xuICAgICAgICB9LCAtSW5maW5pdHkpO1xuICAgIH0gICAgICAgIFxuXG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgIE51bWVyYWwgUHJvdG90eXBlXG4gICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5cbiAgICBudW1lcmFsLmZuID0gTnVtZXJhbC5wcm90b3R5cGUgPSB7XG5cbiAgICAgICAgY2xvbmUgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVtZXJhbCh0aGlzKTtcbiAgICAgICAgfSxcblxuICAgICAgICBmb3JtYXQgOiBmdW5jdGlvbiAoaW5wdXRTdHJpbmcsIHJvdW5kaW5nRnVuY3Rpb24pIHtcbiAgICAgICAgICAgIHJldHVybiBmb3JtYXROdW1lcmFsKHRoaXMsIFxuICAgICAgICAgICAgICAgICAgaW5wdXRTdHJpbmcgPyBpbnB1dFN0cmluZyA6IGRlZmF1bHRGb3JtYXQsIFxuICAgICAgICAgICAgICAgICAgKHJvdW5kaW5nRnVuY3Rpb24gIT09IHVuZGVmaW5lZCkgPyByb3VuZGluZ0Z1bmN0aW9uIDogTWF0aC5yb3VuZFxuICAgICAgICAgICAgICApO1xuICAgICAgICB9LFxuXG4gICAgICAgIHVuZm9ybWF0IDogZnVuY3Rpb24gKGlucHV0U3RyaW5nKSB7XG4gICAgICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGlucHV0U3RyaW5nKSA9PT0gJ1tvYmplY3QgTnVtYmVyXScpIHsgXG4gICAgICAgICAgICAgICAgcmV0dXJuIGlucHV0U3RyaW5nOyBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB1bmZvcm1hdE51bWVyYWwodGhpcywgaW5wdXRTdHJpbmcgPyBpbnB1dFN0cmluZyA6IGRlZmF1bHRGb3JtYXQpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHZhbHVlIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICAgICAgICB9LFxuXG4gICAgICAgIHZhbHVlT2YgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdmFsdWU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0IDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLl92YWx1ZSA9IE51bWJlcih2YWx1ZSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcblxuICAgICAgICBhZGQgOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIHZhciBjb3JyRmFjdG9yID0gY29ycmVjdGlvbkZhY3Rvci5jYWxsKG51bGwsIHRoaXMuX3ZhbHVlLCB2YWx1ZSk7XG4gICAgICAgICAgICBmdW5jdGlvbiBjYmFjayhhY2N1bSwgY3VyciwgY3VyckksIE8pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYWNjdW0gKyBjb3JyRmFjdG9yICogY3VycjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX3ZhbHVlID0gW3RoaXMuX3ZhbHVlLCB2YWx1ZV0ucmVkdWNlKGNiYWNrLCAwKSAvIGNvcnJGYWN0b3I7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcblxuICAgICAgICBzdWJ0cmFjdCA6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgdmFyIGNvcnJGYWN0b3IgPSBjb3JyZWN0aW9uRmFjdG9yLmNhbGwobnVsbCwgdGhpcy5fdmFsdWUsIHZhbHVlKTtcbiAgICAgICAgICAgIGZ1bmN0aW9uIGNiYWNrKGFjY3VtLCBjdXJyLCBjdXJySSwgTykge1xuICAgICAgICAgICAgICAgIHJldHVybiBhY2N1bSAtIGNvcnJGYWN0b3IgKiBjdXJyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fdmFsdWUgPSBbdmFsdWVdLnJlZHVjZShjYmFjaywgdGhpcy5fdmFsdWUgKiBjb3JyRmFjdG9yKSAvIGNvcnJGYWN0b3I7ICAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcblxuICAgICAgICBtdWx0aXBseSA6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgZnVuY3Rpb24gY2JhY2soYWNjdW0sIGN1cnIsIGN1cnJJLCBPKSB7XG4gICAgICAgICAgICAgICAgdmFyIGNvcnJGYWN0b3IgPSBjb3JyZWN0aW9uRmFjdG9yKGFjY3VtLCBjdXJyKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gKGFjY3VtICogY29yckZhY3RvcikgKiAoY3VyciAqIGNvcnJGYWN0b3IpIC9cbiAgICAgICAgICAgICAgICAgICAgKGNvcnJGYWN0b3IgKiBjb3JyRmFjdG9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX3ZhbHVlID0gW3RoaXMuX3ZhbHVlLCB2YWx1ZV0ucmVkdWNlKGNiYWNrLCAxKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9LFxuXG4gICAgICAgIGRpdmlkZSA6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgZnVuY3Rpb24gY2JhY2soYWNjdW0sIGN1cnIsIGN1cnJJLCBPKSB7XG4gICAgICAgICAgICAgICAgdmFyIGNvcnJGYWN0b3IgPSBjb3JyZWN0aW9uRmFjdG9yKGFjY3VtLCBjdXJyKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gKGFjY3VtICogY29yckZhY3RvcikgLyAoY3VyciAqIGNvcnJGYWN0b3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fdmFsdWUgPSBbdGhpcy5fdmFsdWUsIHZhbHVlXS5yZWR1Y2UoY2JhY2spOyAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZGlmZmVyZW5jZSA6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIE1hdGguYWJzKG51bWVyYWwodGhpcy5fdmFsdWUpLnN1YnRyYWN0KHZhbHVlKS52YWx1ZSgpKTtcbiAgICAgICAgfVxuXG4gICAgfTtcblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgRXhwb3NpbmcgTnVtZXJhbFxuICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgIC8vIENvbW1vbkpTIG1vZHVsZSBpcyBkZWZpbmVkXG4gICAgaWYgKGhhc01vZHVsZSkge1xuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IG51bWVyYWw7XG4gICAgfVxuXG4gICAgLypnbG9iYWwgZW5kZXI6ZmFsc2UgKi9cbiAgICBpZiAodHlwZW9mIGVuZGVyID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAvLyBoZXJlLCBgdGhpc2AgbWVhbnMgYHdpbmRvd2AgaW4gdGhlIGJyb3dzZXIsIG9yIGBnbG9iYWxgIG9uIHRoZSBzZXJ2ZXJcbiAgICAgICAgLy8gYWRkIGBudW1lcmFsYCBhcyBhIGdsb2JhbCBvYmplY3QgdmlhIGEgc3RyaW5nIGlkZW50aWZpZXIsXG4gICAgICAgIC8vIGZvciBDbG9zdXJlIENvbXBpbGVyICdhZHZhbmNlZCcgbW9kZVxuICAgICAgICB0aGlzWydudW1lcmFsJ10gPSBudW1lcmFsO1xuICAgIH1cblxuICAgIC8qZ2xvYmFsIGRlZmluZTpmYWxzZSAqL1xuICAgIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAgICAgZGVmaW5lKFtdLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVtZXJhbDtcbiAgICAgICAgfSk7XG4gICAgfVxufSkuY2FsbCh0aGlzKTtcbiIsIi8qXG5zdHJpbmcuanMgLSBDb3B5cmlnaHQgKEMpIDIwMTItMjAxMywgSlAgUmljaGFyZHNvbiA8anByaWNoYXJkc29uQGdtYWlsLmNvbT5cbiovXG5cbiEoZnVuY3Rpb24oKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIHZhciBWRVJTSU9OID0gJzEuOC4wJztcblxuICB2YXIgRU5USVRJRVMgPSB7fTtcblxuLy8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8vIEFkZGVkIGFuIGluaXRpYWxpemUgZnVuY3Rpb24gd2hpY2ggaXMgZXNzZW50aWFsbHkgdGhlIGNvZGUgZnJvbSB0aGUgU1xuLy8gY29uc3RydWN0b3IuICBOb3csIHRoZSBTIGNvbnN0cnVjdG9yIGNhbGxzIHRoaXMgYW5kIGEgbmV3IG1ldGhvZCBuYW1lZFxuLy8gc2V0VmFsdWUgY2FsbHMgaXQgYXMgd2VsbC4gIFRoZSBzZXRWYWx1ZSBmdW5jdGlvbiBhbGxvd3MgY29uc3RydWN0b3JzIGZvclxuLy8gbW9kdWxlcyB0aGF0IGV4dGVuZCBzdHJpbmcuanMgdG8gc2V0IHRoZSBpbml0aWFsIHZhbHVlIG9mIGFuIG9iamVjdCB3aXRob3V0XG4vLyBrbm93aW5nIHRoZSBpbnRlcm5hbCB3b3JraW5ncyBvZiBzdHJpbmcuanMuXG4vL1xuLy8gQWxzbywgYWxsIG1ldGhvZHMgd2hpY2ggcmV0dXJuIGEgbmV3IFMgb2JqZWN0IG5vdyBjYWxsOlxuLy9cbi8vICAgICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKHMpO1xuLy9cbi8vIGluc3RlYWQgb2Y6XG4vL1xuLy8gICAgICByZXR1cm4gbmV3IFMocyk7XG4vL1xuLy8gVGhpcyBhbGxvd3MgZXh0ZW5kZWQgb2JqZWN0cyB0byBrZWVwIHRoZWlyIHByb3BlciBpbnN0YW5jZU9mIGFuZCBjb25zdHJ1Y3Rvci5cbi8vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cbiAgZnVuY3Rpb24gaW5pdGlhbGl6ZSAob2JqZWN0LCBzKSB7XG4gICAgaWYgKHMgIT09IG51bGwgJiYgcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAodHlwZW9mIHMgPT09ICdzdHJpbmcnKVxuICAgICAgICBvYmplY3QucyA9IHM7XG4gICAgICBlbHNlXG4gICAgICAgIG9iamVjdC5zID0gcy50b1N0cmluZygpO1xuICAgIH0gZWxzZSB7XG4gICAgICBvYmplY3QucyA9IHM7IC8vbnVsbCBvciB1bmRlZmluZWRcbiAgICB9XG5cbiAgICBvYmplY3Qub3JpZyA9IHM7IC8vb3JpZ2luYWwgb2JqZWN0LCBjdXJyZW50bHkgb25seSB1c2VkIGJ5IHRvQ1NWKCkgYW5kIHRvQm9vbGVhbigpXG5cbiAgICBpZiAocyAhPT0gbnVsbCAmJiBzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGlmIChvYmplY3QuX19kZWZpbmVHZXR0ZXJfXykge1xuICAgICAgICBvYmplY3QuX19kZWZpbmVHZXR0ZXJfXygnbGVuZ3RoJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIG9iamVjdC5zLmxlbmd0aDtcbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9iamVjdC5sZW5ndGggPSBzLmxlbmd0aDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgb2JqZWN0Lmxlbmd0aCA9IC0xO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIFMocykge1xuICBcdGluaXRpYWxpemUodGhpcywgcyk7XG4gIH1cblxuICB2YXIgX19uc3AgPSBTdHJpbmcucHJvdG90eXBlO1xuICB2YXIgX19zcCA9IFMucHJvdG90eXBlID0ge1xuXG4gICAgYmV0d2VlbjogZnVuY3Rpb24obGVmdCwgcmlnaHQpIHtcbiAgICAgIHZhciBzID0gdGhpcy5zO1xuICAgICAgdmFyIHN0YXJ0UG9zID0gcy5pbmRleE9mKGxlZnQpO1xuICAgICAgdmFyIGVuZFBvcyA9IHMuaW5kZXhPZihyaWdodCwgc3RhcnRQb3MgKyBsZWZ0Lmxlbmd0aCk7XG4gICAgICBpZiAoZW5kUG9zID09IC0xICYmIHJpZ2h0ICE9IG51bGwpIFxuICAgICAgICByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3IoJycpXG4gICAgICBlbHNlIGlmIChlbmRQb3MgPT0gLTEgJiYgcmlnaHQgPT0gbnVsbClcbiAgICAgICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKHMuc3Vic3RyaW5nKHN0YXJ0UG9zICsgbGVmdC5sZW5ndGgpKVxuICAgICAgZWxzZSBcbiAgICAgICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKHMuc2xpY2Uoc3RhcnRQb3MgKyBsZWZ0Lmxlbmd0aCwgZW5kUG9zKSk7XG4gICAgfSxcblxuICAgIC8vIyBtb2RpZmllZCBzbGlnaHRseSBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9lcGVsaS91bmRlcnNjb3JlLnN0cmluZ1xuICAgIGNhbWVsaXplOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBzID0gdGhpcy50cmltKCkucy5yZXBsYWNlKC8oXFwtfF98XFxzKSsoLik/L2csIGZ1bmN0aW9uKG1hdGhjLCBzZXAsIGMpIHtcbiAgICAgICAgcmV0dXJuIChjID8gYy50b1VwcGVyQ2FzZSgpIDogJycpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3Iocyk7XG4gICAgfSxcblxuICAgIGNhcGl0YWxpemU6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKHRoaXMucy5zdWJzdHIoMCwgMSkudG9VcHBlckNhc2UoKSArIHRoaXMucy5zdWJzdHJpbmcoMSkudG9Mb3dlckNhc2UoKSk7XG4gICAgfSxcblxuICAgIGNoYXJBdDogZnVuY3Rpb24oaW5kZXgpIHtcbiAgICAgIHJldHVybiB0aGlzLnMuY2hhckF0KGluZGV4KTtcbiAgICB9LFxuXG4gICAgY2hvbXBMZWZ0OiBmdW5jdGlvbihwcmVmaXgpIHtcbiAgICAgIHZhciBzID0gdGhpcy5zO1xuICAgICAgaWYgKHMuaW5kZXhPZihwcmVmaXgpID09PSAwKSB7XG4gICAgICAgICBzID0gcy5zbGljZShwcmVmaXgubGVuZ3RoKTtcbiAgICAgICAgIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3RvcihzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBjaG9tcFJpZ2h0OiBmdW5jdGlvbihzdWZmaXgpIHtcbiAgICAgIGlmICh0aGlzLmVuZHNXaXRoKHN1ZmZpeCkpIHtcbiAgICAgICAgdmFyIHMgPSB0aGlzLnM7XG4gICAgICAgIHMgPSBzLnNsaWNlKDAsIHMubGVuZ3RoIC0gc3VmZml4Lmxlbmd0aCk7XG4gICAgICAgIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3RvcihzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyN0aGFua3MgR29vZ2xlXG4gICAgY29sbGFwc2VXaGl0ZXNwYWNlOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBzID0gdGhpcy5zLnJlcGxhY2UoL1tcXHNcXHhhMF0rL2csICcgJykucmVwbGFjZSgvXlxccyt8XFxzKyQvZywgJycpO1xuICAgICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKHMpO1xuICAgIH0sXG5cbiAgICBjb250YWluczogZnVuY3Rpb24oc3MpIHtcbiAgICAgIHJldHVybiB0aGlzLnMuaW5kZXhPZihzcykgPj0gMDtcbiAgICB9LFxuXG4gICAgY291bnQ6IGZ1bmN0aW9uKHNzKSB7XG4gICAgICB2YXIgY291bnQgPSAwXG4gICAgICAgICwgcG9zID0gdGhpcy5zLmluZGV4T2Yoc3MpXG5cbiAgICAgIHdoaWxlIChwb3MgPj0gMCkge1xuICAgICAgICBjb3VudCArPSAxXG4gICAgICAgIHBvcyA9IHRoaXMucy5pbmRleE9mKHNzLCBwb3MgKyAxKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gY291bnRcbiAgICB9LFxuXG4gICAgLy8jbW9kaWZpZWQgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vZXBlbGkvdW5kZXJzY29yZS5zdHJpbmdcbiAgICBkYXNoZXJpemU6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHMgPSB0aGlzLnRyaW0oKS5zLnJlcGxhY2UoL1tfXFxzXSsvZywgJy0nKS5yZXBsYWNlKC8oW0EtWl0pL2csICctJDEnKS5yZXBsYWNlKC8tKy9nLCAnLScpLnRvTG93ZXJDYXNlKCk7XG4gICAgICByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3Iocyk7XG4gICAgfSxcblxuICAgIGRlY29kZUh0bWxFbnRpdGllczogZnVuY3Rpb24oKSB7IC8vaHR0cHM6Ly9naXRodWIuY29tL3N1YnN0YWNrL25vZGUtZW50L2Jsb2IvbWFzdGVyL2luZGV4LmpzXG4gICAgICB2YXIgcyA9IHRoaXMucztcbiAgICAgIHMgPSBzLnJlcGxhY2UoLyYjKFxcZCspOz8vZywgZnVuY3Rpb24gKF8sIGNvZGUpIHtcbiAgICAgICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUoY29kZSk7XG4gICAgICB9KVxuICAgICAgLnJlcGxhY2UoLyYjW3hYXShbQS1GYS1mMC05XSspOz8vZywgZnVuY3Rpb24gKF8sIGhleCkge1xuICAgICAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZShwYXJzZUludChoZXgsIDE2KSk7XG4gICAgICB9KVxuICAgICAgLnJlcGxhY2UoLyYoW147XFxXXSs7PykvZywgZnVuY3Rpb24gKG0sIGUpIHtcbiAgICAgICAgdmFyIGVlID0gZS5yZXBsYWNlKC87JC8sICcnKTtcbiAgICAgICAgdmFyIHRhcmdldCA9IEVOVElUSUVTW2VdIHx8IChlLm1hdGNoKC87JC8pICYmIEVOVElUSUVTW2VlXSk7XG4gICAgICAgICAgICBcbiAgICAgICAgaWYgKHR5cGVvZiB0YXJnZXQgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUodGFyZ2V0KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0eXBlb2YgdGFyZ2V0ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIG07XG4gICAgICAgIH1cbiAgICAgIH0pXG5cbiAgICAgIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3RvcihzKTtcbiAgICB9LFxuXG4gICAgZW5kc1dpdGg6IGZ1bmN0aW9uKHN1ZmZpeCkge1xuICAgICAgdmFyIGwgID0gdGhpcy5zLmxlbmd0aCAtIHN1ZmZpeC5sZW5ndGg7XG4gICAgICByZXR1cm4gbCA+PSAwICYmIHRoaXMucy5pbmRleE9mKHN1ZmZpeCwgbCkgPT09IGw7XG4gICAgfSxcblxuICAgIGVzY2FwZUhUTUw6IGZ1bmN0aW9uKCkgeyAvL2Zyb20gdW5kZXJzY29yZS5zdHJpbmdcbiAgICAgIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3Rvcih0aGlzLnMucmVwbGFjZSgvWyY8PlwiJ10vZywgZnVuY3Rpb24obSl7IHJldHVybiAnJicgKyByZXZlcnNlZEVzY2FwZUNoYXJzW21dICsgJzsnOyB9KSk7XG4gICAgfSxcblxuICAgIGVuc3VyZUxlZnQ6IGZ1bmN0aW9uKHByZWZpeCkge1xuICAgICAgdmFyIHMgPSB0aGlzLnM7XG4gICAgICBpZiAocy5pbmRleE9mKHByZWZpeCkgPT09IDApIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3IocHJlZml4ICsgcyk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIGVuc3VyZVJpZ2h0OiBmdW5jdGlvbihzdWZmaXgpIHtcbiAgICAgIHZhciBzID0gdGhpcy5zO1xuICAgICAgaWYgKHRoaXMuZW5kc1dpdGgoc3VmZml4KSkgIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3IocyArIHN1ZmZpeCk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIGh1bWFuaXplOiBmdW5jdGlvbigpIHsgLy9tb2RpZmllZCBmcm9tIHVuZGVyc2NvcmUuc3RyaW5nXG4gICAgICBpZiAodGhpcy5zID09PSBudWxsIHx8IHRoaXMucyA9PT0gdW5kZWZpbmVkKVxuICAgICAgICByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3IoJycpXG4gICAgICB2YXIgcyA9IHRoaXMudW5kZXJzY29yZSgpLnJlcGxhY2UoL19pZCQvLCcnKS5yZXBsYWNlKC9fL2csICcgJykudHJpbSgpLmNhcGl0YWxpemUoKVxuICAgICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKHMpXG4gICAgfSxcblxuICAgIGlzQWxwaGE6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuICEvW15hLXpcXHhDMC1cXHhGRl0vLnRlc3QodGhpcy5zLnRvTG93ZXJDYXNlKCkpO1xuICAgIH0sXG5cbiAgICBpc0FscGhhTnVtZXJpYzogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gIS9bXjAtOWEtelxceEMwLVxceEZGXS8udGVzdCh0aGlzLnMudG9Mb3dlckNhc2UoKSk7XG4gICAgfSxcblxuICAgIGlzRW1wdHk6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMucyA9PT0gbnVsbCB8fCB0aGlzLnMgPT09IHVuZGVmaW5lZCA/IHRydWUgOiAvXltcXHNcXHhhMF0qJC8udGVzdCh0aGlzLnMpO1xuICAgIH0sXG5cbiAgICBpc0xvd2VyOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLmlzQWxwaGEoKSAmJiB0aGlzLnMudG9Mb3dlckNhc2UoKSA9PT0gdGhpcy5zO1xuICAgIH0sXG5cbiAgICBpc051bWVyaWM6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuICEvW14wLTldLy50ZXN0KHRoaXMucyk7XG4gICAgfSxcblxuICAgIGlzVXBwZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuaXNBbHBoYSgpICYmIHRoaXMucy50b1VwcGVyQ2FzZSgpID09PSB0aGlzLnM7XG4gICAgfSxcblxuICAgIGxlZnQ6IGZ1bmN0aW9uKE4pIHtcbiAgICAgIGlmIChOID49IDApIHtcbiAgICAgICAgdmFyIHMgPSB0aGlzLnMuc3Vic3RyKDAsIE4pO1xuICAgICAgICByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3Iocyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5yaWdodCgtTik7XG4gICAgICB9XG4gICAgfSxcbiAgICBcbiAgICBsaW5lczogZnVuY3Rpb24oKSB7IC8vY29udmVydCB3aW5kb3dzIG5ld2xpbmVzIHRvIHVuaXggbmV3bGluZXMgdGhlbiBjb252ZXJ0IHRvIGFuIEFycmF5IG9mIGxpbmVzXG4gICAgICByZXR1cm4gdGhpcy5yZXBsYWNlQWxsKCdcXHJcXG4nLCAnXFxuJykucy5zcGxpdCgnXFxuJyk7XG4gICAgfSxcblxuICAgIHBhZDogZnVuY3Rpb24obGVuLCBjaCkgeyAvL2h0dHBzOi8vZ2l0aHViLmNvbS9jb21wb25lbnQvcGFkXG4gICAgICBpZiAoY2ggPT0gbnVsbCkgY2ggPSAnICc7XG4gICAgICBpZiAodGhpcy5zLmxlbmd0aCA+PSBsZW4pIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3Rvcih0aGlzLnMpO1xuICAgICAgbGVuID0gbGVuIC0gdGhpcy5zLmxlbmd0aDtcbiAgICAgIHZhciBsZWZ0ID0gQXJyYXkoTWF0aC5jZWlsKGxlbiAvIDIpICsgMSkuam9pbihjaCk7XG4gICAgICB2YXIgcmlnaHQgPSBBcnJheShNYXRoLmZsb29yKGxlbiAvIDIpICsgMSkuam9pbihjaCk7XG4gICAgICByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3IobGVmdCArIHRoaXMucyArIHJpZ2h0KTtcbiAgICB9LFxuXG4gICAgcGFkTGVmdDogZnVuY3Rpb24obGVuLCBjaCkgeyAvL2h0dHBzOi8vZ2l0aHViLmNvbS9jb21wb25lbnQvcGFkXG4gICAgICBpZiAoY2ggPT0gbnVsbCkgY2ggPSAnICc7XG4gICAgICBpZiAodGhpcy5zLmxlbmd0aCA+PSBsZW4pIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3Rvcih0aGlzLnMpO1xuICAgICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKEFycmF5KGxlbiAtIHRoaXMucy5sZW5ndGggKyAxKS5qb2luKGNoKSArIHRoaXMucyk7XG4gICAgfSxcblxuICAgIHBhZFJpZ2h0OiBmdW5jdGlvbihsZW4sIGNoKSB7IC8vaHR0cHM6Ly9naXRodWIuY29tL2NvbXBvbmVudC9wYWRcbiAgICAgIGlmIChjaCA9PSBudWxsKSBjaCA9ICcgJztcbiAgICAgIGlmICh0aGlzLnMubGVuZ3RoID49IGxlbikgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKHRoaXMucyk7XG4gICAgICByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3IodGhpcy5zICsgQXJyYXkobGVuIC0gdGhpcy5zLmxlbmd0aCArIDEpLmpvaW4oY2gpKTtcbiAgICB9LFxuXG4gICAgcGFyc2VDU1Y6IGZ1bmN0aW9uKGRlbGltaXRlciwgcXVhbGlmaWVyLCBlc2NhcGUsIGxpbmVEZWxpbWl0ZXIpIHsgLy90cnkgdG8gcGFyc2Ugbm8gbWF0dGVyIHdoYXRcbiAgICAgIGRlbGltaXRlciA9IGRlbGltaXRlciB8fCAnLCc7XG4gICAgICBlc2NhcGUgPSBlc2NhcGUgfHwgJ1xcXFwnXG4gICAgICBpZiAodHlwZW9mIHF1YWxpZmllciA9PSAndW5kZWZpbmVkJylcbiAgICAgICAgcXVhbGlmaWVyID0gJ1wiJztcblxuICAgICAgdmFyIGkgPSAwLCBmaWVsZEJ1ZmZlciA9IFtdLCBmaWVsZHMgPSBbXSwgbGVuID0gdGhpcy5zLmxlbmd0aCwgaW5GaWVsZCA9IGZhbHNlLCBzZWxmID0gdGhpcztcbiAgICAgIHZhciBjYSA9IGZ1bmN0aW9uKGkpe3JldHVybiBzZWxmLnMuY2hhckF0KGkpfTtcbiAgICAgIGlmICh0eXBlb2YgbGluZURlbGltaXRlciAhPT0gJ3VuZGVmaW5lZCcpIHZhciByb3dzID0gW107XG5cbiAgICAgIGlmICghcXVhbGlmaWVyKVxuICAgICAgICBpbkZpZWxkID0gdHJ1ZTtcblxuICAgICAgd2hpbGUgKGkgPCBsZW4pIHtcbiAgICAgICAgdmFyIGN1cnJlbnQgPSBjYShpKTtcbiAgICAgICAgc3dpdGNoIChjdXJyZW50KSB7XG4gICAgICAgICAgY2FzZSBlc2NhcGU6XG4gICAgICAgICAgLy9maXggZm9yIGlzc3VlcyAjMzIgYW5kICMzNVxuICAgICAgICAgIGlmIChpbkZpZWxkICYmICgoZXNjYXBlICE9PSBxdWFsaWZpZXIpIHx8IGNhKGkrMSkgPT09IHF1YWxpZmllcikpIHtcbiAgICAgICAgICAgICAgaSArPSAxO1xuICAgICAgICAgICAgICBmaWVsZEJ1ZmZlci5wdXNoKGNhKGkpKTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChlc2NhcGUgIT09IHF1YWxpZmllcikgYnJlYWs7XG4gICAgICAgICAgY2FzZSBxdWFsaWZpZXI6XG4gICAgICAgICAgICBpbkZpZWxkID0gIWluRmllbGQ7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIGRlbGltaXRlcjpcbiAgICAgICAgICAgIGlmIChpbkZpZWxkICYmIHF1YWxpZmllcilcbiAgICAgICAgICAgICAgZmllbGRCdWZmZXIucHVzaChjdXJyZW50KTtcbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICBmaWVsZHMucHVzaChmaWVsZEJ1ZmZlci5qb2luKCcnKSlcbiAgICAgICAgICAgICAgZmllbGRCdWZmZXIubGVuZ3RoID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgbGluZURlbGltaXRlcjpcbiAgICAgICAgICAgIGlmIChpbkZpZWxkKSB7XG4gICAgICAgICAgICAgICAgZmllbGRCdWZmZXIucHVzaChjdXJyZW50KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHJvd3MpIHtcbiAgICAgICAgICAgICAgICAgICAgZmllbGRzLnB1c2goZmllbGRCdWZmZXIuam9pbignJykpXG4gICAgICAgICAgICAgICAgICAgIHJvd3MucHVzaChmaWVsZHMpO1xuICAgICAgICAgICAgICAgICAgICBmaWVsZHMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgZmllbGRCdWZmZXIubGVuZ3RoID0gMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgaWYgKGluRmllbGQpXG4gICAgICAgICAgICAgIGZpZWxkQnVmZmVyLnB1c2goY3VycmVudCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBpICs9IDE7XG4gICAgICB9XG5cbiAgICAgIGZpZWxkcy5wdXNoKGZpZWxkQnVmZmVyLmpvaW4oJycpKTtcbiAgICAgIGlmIChyb3dzKSB7XG4gICAgICAgIHJvd3MucHVzaChmaWVsZHMpO1xuICAgICAgICByZXR1cm4gcm93cztcbiAgICAgIH1cbiAgICAgIHJldHVybiBmaWVsZHM7XG4gICAgfSxcblxuICAgIHJlcGxhY2VBbGw6IGZ1bmN0aW9uKHNzLCByKSB7XG4gICAgICAvL3ZhciBzID0gdGhpcy5zLnJlcGxhY2UobmV3IFJlZ0V4cChzcywgJ2cnKSwgcik7XG4gICAgICB2YXIgcyA9IHRoaXMucy5zcGxpdChzcykuam9pbihyKVxuICAgICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKHMpO1xuICAgIH0sXG5cbiAgICByaWdodDogZnVuY3Rpb24oTikge1xuICAgICAgaWYgKE4gPj0gMCkge1xuICAgICAgICB2YXIgcyA9IHRoaXMucy5zdWJzdHIodGhpcy5zLmxlbmd0aCAtIE4sIE4pO1xuICAgICAgICByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3Iocyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5sZWZ0KC1OKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgc2V0VmFsdWU6IGZ1bmN0aW9uIChzKSB7XG5cdCAgaW5pdGlhbGl6ZSh0aGlzLCBzKTtcblx0ICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgc2x1Z2lmeTogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgc2wgPSAobmV3IFModGhpcy5zLnJlcGxhY2UoL1teXFx3XFxzLV0vZywgJycpLnRvTG93ZXJDYXNlKCkpKS5kYXNoZXJpemUoKS5zO1xuICAgICAgaWYgKHNsLmNoYXJBdCgwKSA9PT0gJy0nKVxuICAgICAgICBzbCA9IHNsLnN1YnN0cigxKTtcbiAgICAgIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3RvcihzbCk7XG4gICAgfSxcblxuICAgIHN0YXJ0c1dpdGg6IGZ1bmN0aW9uKHByZWZpeCkge1xuICAgICAgcmV0dXJuIHRoaXMucy5sYXN0SW5kZXhPZihwcmVmaXgsIDApID09PSAwO1xuICAgIH0sXG5cbiAgICBzdHJpcFB1bmN0dWF0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgIC8vcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKHRoaXMucy5yZXBsYWNlKC9bXFwuLC1cXC8jISQlXFxeJlxcKjs6e309XFwtX2B+KCldL2csXCJcIikpO1xuICAgICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKHRoaXMucy5yZXBsYWNlKC9bXlxcd1xcc118Xy9nLCBcIlwiKS5yZXBsYWNlKC9cXHMrL2csIFwiIFwiKSk7XG4gICAgfSxcblxuICAgIHN0cmlwVGFnczogZnVuY3Rpb24oKSB7IC8vZnJvbSBzdWdhci5qc1xuICAgICAgdmFyIHMgPSB0aGlzLnMsIGFyZ3MgPSBhcmd1bWVudHMubGVuZ3RoID4gMCA/IGFyZ3VtZW50cyA6IFsnJ107XG4gICAgICBtdWx0aUFyZ3MoYXJncywgZnVuY3Rpb24odGFnKSB7XG4gICAgICAgIHMgPSBzLnJlcGxhY2UoUmVnRXhwKCc8XFwvPycgKyB0YWcgKyAnW148Pl0qPicsICdnaScpLCAnJyk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3RvcihzKTtcbiAgICB9LFxuXG4gICAgdGVtcGxhdGU6IGZ1bmN0aW9uKHZhbHVlcywgb3BlbmluZywgY2xvc2luZykge1xuICAgICAgdmFyIHMgPSB0aGlzLnNcbiAgICAgIHZhciBvcGVuaW5nID0gb3BlbmluZyB8fCBFeHBvcnQuVE1QTF9PUEVOXG4gICAgICB2YXIgY2xvc2luZyA9IGNsb3NpbmcgfHwgRXhwb3J0LlRNUExfQ0xPU0VcblxuICAgICAgdmFyIG9wZW4gPSBvcGVuaW5nLnJlcGxhY2UoL1stW1xcXSgpKlxcc10vZywgXCJcXFxcJCZcIikucmVwbGFjZSgvXFwkL2csICdcXFxcJCcpXG4gICAgICB2YXIgY2xvc2UgPSBjbG9zaW5nLnJlcGxhY2UoL1stW1xcXSgpKlxcc10vZywgXCJcXFxcJCZcIikucmVwbGFjZSgvXFwkL2csICdcXFxcJCcpXG4gICAgICB2YXIgciA9IG5ldyBSZWdFeHAob3BlbiArICcoLis/KScgKyBjbG9zZSwgJ2cnKVxuICAgICAgICAvLywgciA9IC9cXHtcXHsoLis/KVxcfVxcfS9nXG4gICAgICB2YXIgbWF0Y2hlcyA9IHMubWF0Y2gocikgfHwgW107XG5cbiAgICAgIG1hdGNoZXMuZm9yRWFjaChmdW5jdGlvbihtYXRjaCkge1xuICAgICAgICB2YXIga2V5ID0gbWF0Y2guc3Vic3RyaW5nKG9wZW5pbmcubGVuZ3RoLCBtYXRjaC5sZW5ndGggLSBjbG9zaW5nLmxlbmd0aCk7Ly9jaG9wIHt7IGFuZCB9fVxuICAgICAgICBpZiAodHlwZW9mIHZhbHVlc1trZXldICE9ICd1bmRlZmluZWQnKVxuICAgICAgICAgIHMgPSBzLnJlcGxhY2UobWF0Y2gsIHZhbHVlc1trZXldKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKHMpO1xuICAgIH0sXG5cbiAgICB0aW1lczogZnVuY3Rpb24obikge1xuICAgICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKG5ldyBBcnJheShuICsgMSkuam9pbih0aGlzLnMpKTtcbiAgICB9LFxuXG4gICAgdG9Cb29sZWFuOiBmdW5jdGlvbigpIHtcbiAgICAgIGlmICh0eXBlb2YgdGhpcy5vcmlnID09PSAnc3RyaW5nJykge1xuICAgICAgICB2YXIgcyA9IHRoaXMucy50b0xvd2VyQ2FzZSgpO1xuICAgICAgICByZXR1cm4gcyA9PT0gJ3RydWUnIHx8IHMgPT09ICd5ZXMnIHx8IHMgPT09ICdvbic7XG4gICAgICB9IGVsc2VcbiAgICAgICAgcmV0dXJuIHRoaXMub3JpZyA9PT0gdHJ1ZSB8fCB0aGlzLm9yaWcgPT09IDE7XG4gICAgfSxcblxuICAgIHRvRmxvYXQ6IGZ1bmN0aW9uKHByZWNpc2lvbikge1xuICAgICAgdmFyIG51bSA9IHBhcnNlRmxvYXQodGhpcy5zKVxuICAgICAgaWYgKHByZWNpc2lvbilcbiAgICAgICAgcmV0dXJuIHBhcnNlRmxvYXQobnVtLnRvRml4ZWQocHJlY2lzaW9uKSlcbiAgICAgIGVsc2VcbiAgICAgICAgcmV0dXJuIG51bVxuICAgIH0sXG5cbiAgICB0b0ludDogZnVuY3Rpb24oKSB7IC8vdGhhbmtzIEdvb2dsZVxuICAgICAgLy8gSWYgdGhlIHN0cmluZyBzdGFydHMgd2l0aCAnMHgnIG9yICctMHgnLCBwYXJzZSBhcyBoZXguXG4gICAgICByZXR1cm4gL15cXHMqLT8weC9pLnRlc3QodGhpcy5zKSA/IHBhcnNlSW50KHRoaXMucywgMTYpIDogcGFyc2VJbnQodGhpcy5zLCAxMClcbiAgICB9LFxuXG4gICAgdHJpbTogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcztcbiAgICAgIGlmICh0eXBlb2YgX19uc3AudHJpbSA9PT0gJ3VuZGVmaW5lZCcpIFxuICAgICAgICBzID0gdGhpcy5zLnJlcGxhY2UoLyheXFxzKnxcXHMqJCkvZywgJycpXG4gICAgICBlbHNlIFxuICAgICAgICBzID0gdGhpcy5zLnRyaW0oKVxuICAgICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKHMpO1xuICAgIH0sXG5cbiAgICB0cmltTGVmdDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcztcbiAgICAgIGlmIChfX25zcC50cmltTGVmdClcbiAgICAgICAgcyA9IHRoaXMucy50cmltTGVmdCgpO1xuICAgICAgZWxzZVxuICAgICAgICBzID0gdGhpcy5zLnJlcGxhY2UoLyheXFxzKikvZywgJycpO1xuICAgICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKHMpO1xuICAgIH0sXG5cbiAgICB0cmltUmlnaHQ6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHM7XG4gICAgICBpZiAoX19uc3AudHJpbVJpZ2h0KVxuICAgICAgICBzID0gdGhpcy5zLnRyaW1SaWdodCgpO1xuICAgICAgZWxzZVxuICAgICAgICBzID0gdGhpcy5zLnJlcGxhY2UoL1xccyskLywgJycpO1xuICAgICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKHMpO1xuICAgIH0sXG5cbiAgICB0cnVuY2F0ZTogZnVuY3Rpb24obGVuZ3RoLCBwcnVuZVN0cikgeyAvL2Zyb20gdW5kZXJzY29yZS5zdHJpbmcsIGF1dGhvcjogZ2l0aHViLmNvbS9yd3pcbiAgICAgIHZhciBzdHIgPSB0aGlzLnM7XG5cbiAgICAgIGxlbmd0aCA9IH5+bGVuZ3RoO1xuICAgICAgcHJ1bmVTdHIgPSBwcnVuZVN0ciB8fCAnLi4uJztcblxuICAgICAgaWYgKHN0ci5sZW5ndGggPD0gbGVuZ3RoKSByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3Ioc3RyKTtcblxuICAgICAgdmFyIHRtcGwgPSBmdW5jdGlvbihjKXsgcmV0dXJuIGMudG9VcHBlckNhc2UoKSAhPT0gYy50b0xvd2VyQ2FzZSgpID8gJ0EnIDogJyAnOyB9LFxuICAgICAgICB0ZW1wbGF0ZSA9IHN0ci5zbGljZSgwLCBsZW5ndGgrMSkucmVwbGFjZSgvLig/PVxcVypcXHcqJCkvZywgdG1wbCk7IC8vICdIZWxsbywgd29ybGQnIC0+ICdIZWxsQUEgQUFBQUEnXG5cbiAgICAgIGlmICh0ZW1wbGF0ZS5zbGljZSh0ZW1wbGF0ZS5sZW5ndGgtMikubWF0Y2goL1xcd1xcdy8pKVxuICAgICAgICB0ZW1wbGF0ZSA9IHRlbXBsYXRlLnJlcGxhY2UoL1xccypcXFMrJC8sICcnKTtcbiAgICAgIGVsc2VcbiAgICAgICAgdGVtcGxhdGUgPSBuZXcgUyh0ZW1wbGF0ZS5zbGljZSgwLCB0ZW1wbGF0ZS5sZW5ndGgtMSkpLnRyaW1SaWdodCgpLnM7XG5cbiAgICAgIHJldHVybiAodGVtcGxhdGUrcHJ1bmVTdHIpLmxlbmd0aCA+IHN0ci5sZW5ndGggPyBuZXcgUyhzdHIpIDogbmV3IFMoc3RyLnNsaWNlKDAsIHRlbXBsYXRlLmxlbmd0aCkrcHJ1bmVTdHIpO1xuICAgIH0sXG5cbiAgICB0b0NTVjogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZGVsaW0gPSAnLCcsIHF1YWxpZmllciA9ICdcIicsIGVzY2FwZSA9ICdcXFxcJywgZW5jbG9zZU51bWJlcnMgPSB0cnVlLCBrZXlzID0gZmFsc2U7XG4gICAgICB2YXIgZGF0YUFycmF5ID0gW107XG5cbiAgICAgIGZ1bmN0aW9uIGhhc1ZhbChpdCkge1xuICAgICAgICByZXR1cm4gaXQgIT09IG51bGwgJiYgaXQgIT09ICcnO1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIGFyZ3VtZW50c1swXSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgZGVsaW0gPSBhcmd1bWVudHNbMF0uZGVsaW1pdGVyIHx8IGRlbGltO1xuICAgICAgICBkZWxpbSA9IGFyZ3VtZW50c1swXS5zZXBhcmF0b3IgfHwgZGVsaW07XG4gICAgICAgIHF1YWxpZmllciA9IGFyZ3VtZW50c1swXS5xdWFsaWZpZXIgfHwgcXVhbGlmaWVyO1xuICAgICAgICBlbmNsb3NlTnVtYmVycyA9ICEhYXJndW1lbnRzWzBdLmVuY2xvc2VOdW1iZXJzO1xuICAgICAgICBlc2NhcGUgPSBhcmd1bWVudHNbMF0uZXNjYXBlIHx8IGVzY2FwZTtcbiAgICAgICAga2V5cyA9ICEhYXJndW1lbnRzWzBdLmtleXM7XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiBhcmd1bWVudHNbMF0gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGRlbGltID0gYXJndW1lbnRzWzBdO1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIGFyZ3VtZW50c1sxXSA9PT0gJ3N0cmluZycpXG4gICAgICAgIHF1YWxpZmllciA9IGFyZ3VtZW50c1sxXTtcblxuICAgICAgaWYgKGFyZ3VtZW50c1sxXSA9PT0gbnVsbClcbiAgICAgICAgcXVhbGlmaWVyID0gbnVsbDtcblxuICAgICAgIGlmICh0aGlzLm9yaWcgaW5zdGFuY2VvZiBBcnJheSlcbiAgICAgICAgZGF0YUFycmF5ICA9IHRoaXMub3JpZztcbiAgICAgIGVsc2UgeyAvL29iamVjdFxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gdGhpcy5vcmlnKVxuICAgICAgICAgIGlmICh0aGlzLm9yaWcuaGFzT3duUHJvcGVydHkoa2V5KSlcbiAgICAgICAgICAgIGlmIChrZXlzKVxuICAgICAgICAgICAgICBkYXRhQXJyYXkucHVzaChrZXkpO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICBkYXRhQXJyYXkucHVzaCh0aGlzLm9yaWdba2V5XSk7XG4gICAgICB9XG5cbiAgICAgIHZhciByZXAgPSBlc2NhcGUgKyBxdWFsaWZpZXI7XG4gICAgICB2YXIgYnVpbGRTdHJpbmcgPSBbXTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YUFycmF5Lmxlbmd0aDsgKytpKSB7XG4gICAgICAgIHZhciBzaG91bGRRdWFsaWZ5ID0gaGFzVmFsKHF1YWxpZmllcilcbiAgICAgICAgaWYgKHR5cGVvZiBkYXRhQXJyYXlbaV0gPT0gJ251bWJlcicpXG4gICAgICAgICAgc2hvdWxkUXVhbGlmeSAmPSBlbmNsb3NlTnVtYmVycztcbiAgICAgICAgXG4gICAgICAgIGlmIChzaG91bGRRdWFsaWZ5KVxuICAgICAgICAgIGJ1aWxkU3RyaW5nLnB1c2gocXVhbGlmaWVyKTtcbiAgICAgICAgXG4gICAgICAgIGlmIChkYXRhQXJyYXlbaV0gIT09IG51bGwgJiYgZGF0YUFycmF5W2ldICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICB2YXIgZCA9IG5ldyBTKGRhdGFBcnJheVtpXSkucmVwbGFjZUFsbChxdWFsaWZpZXIsIHJlcCkucztcbiAgICAgICAgICBidWlsZFN0cmluZy5wdXNoKGQpO1xuICAgICAgICB9IGVsc2UgXG4gICAgICAgICAgYnVpbGRTdHJpbmcucHVzaCgnJylcblxuICAgICAgICBpZiAoc2hvdWxkUXVhbGlmeSlcbiAgICAgICAgICBidWlsZFN0cmluZy5wdXNoKHF1YWxpZmllcik7XG4gICAgICAgIFxuICAgICAgICBpZiAoZGVsaW0pXG4gICAgICAgICAgYnVpbGRTdHJpbmcucHVzaChkZWxpbSk7XG4gICAgICB9XG5cbiAgICAgIC8vY2hvcCBsYXN0IGRlbGltXG4gICAgICAvL2NvbnNvbGUubG9nKGJ1aWxkU3RyaW5nLmxlbmd0aClcbiAgICAgIGJ1aWxkU3RyaW5nLmxlbmd0aCA9IGJ1aWxkU3RyaW5nLmxlbmd0aCAtIDE7XG4gICAgICByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3IoYnVpbGRTdHJpbmcuam9pbignJykpO1xuICAgIH0sXG5cbiAgICB0b1N0cmluZzogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5zO1xuICAgIH0sXG5cbiAgICAvLyNtb2RpZmllZCBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9lcGVsaS91bmRlcnNjb3JlLnN0cmluZ1xuICAgIHVuZGVyc2NvcmU6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHMgPSB0aGlzLnRyaW0oKS5zLnJlcGxhY2UoLyhbYS16XFxkXSkoW0EtWl0rKS9nLCAnJDFfJDInKS5yZXBsYWNlKC9bLVxcc10rL2csICdfJykudG9Mb3dlckNhc2UoKTtcbiAgICAgIGlmICgobmV3IFModGhpcy5zLmNoYXJBdCgwKSkpLmlzVXBwZXIoKSkge1xuICAgICAgICBzID0gJ18nICsgcztcbiAgICAgIH1cbiAgICAgIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3RvcihzKTtcbiAgICB9LFxuXG4gICAgdW5lc2NhcGVIVE1MOiBmdW5jdGlvbigpIHsgLy9mcm9tIHVuZGVyc2NvcmUuc3RyaW5nXG4gICAgICByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3IodGhpcy5zLnJlcGxhY2UoL1xcJihbXjtdKyk7L2csIGZ1bmN0aW9uKGVudGl0eSwgZW50aXR5Q29kZSl7XG4gICAgICAgIHZhciBtYXRjaDtcblxuICAgICAgICBpZiAoZW50aXR5Q29kZSBpbiBlc2NhcGVDaGFycykge1xuICAgICAgICAgIHJldHVybiBlc2NhcGVDaGFyc1tlbnRpdHlDb2RlXTtcbiAgICAgICAgfSBlbHNlIGlmIChtYXRjaCA9IGVudGl0eUNvZGUubWF0Y2goL14jeChbXFxkYS1mQS1GXSspJC8pKSB7XG4gICAgICAgICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUocGFyc2VJbnQobWF0Y2hbMV0sIDE2KSk7XG4gICAgICAgIH0gZWxzZSBpZiAobWF0Y2ggPSBlbnRpdHlDb2RlLm1hdGNoKC9eIyhcXGQrKSQvKSkge1xuICAgICAgICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKH5+bWF0Y2hbMV0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBlbnRpdHk7XG4gICAgICAgIH1cbiAgICAgIH0pKTtcbiAgICB9LFxuXG4gICAgdmFsdWVPZjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5zLnZhbHVlT2YoKTtcbiAgICB9XG5cbiAgfVxuXG4gIHZhciBtZXRob2RzQWRkZWQgPSBbXTtcbiAgZnVuY3Rpb24gZXh0ZW5kUHJvdG90eXBlKCkge1xuICAgIGZvciAodmFyIG5hbWUgaW4gX19zcCkge1xuICAgICAgKGZ1bmN0aW9uKG5hbWUpe1xuICAgICAgICB2YXIgZnVuYyA9IF9fc3BbbmFtZV07XG4gICAgICAgIGlmICghX19uc3AuaGFzT3duUHJvcGVydHkobmFtZSkpIHtcbiAgICAgICAgICBtZXRob2RzQWRkZWQucHVzaChuYW1lKTtcbiAgICAgICAgICBfX25zcFtuYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgU3RyaW5nLnByb3RvdHlwZS5zID0gdGhpcztcbiAgICAgICAgICAgIHJldHVybiBmdW5jLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KShuYW1lKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiByZXN0b3JlUHJvdG90eXBlKCkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbWV0aG9kc0FkZGVkLmxlbmd0aDsgKytpKVxuICAgICAgZGVsZXRlIFN0cmluZy5wcm90b3R5cGVbbWV0aG9kc0FkZGVkW2ldXTtcbiAgICBtZXRob2RzQWRkZWQubGVuZ3RoID0gMDtcbiAgfVxuXG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vKiBBdHRhY2ggTmF0aXZlIEphdmFTY3JpcHQgU3RyaW5nIFByb3BlcnRpZXNcbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gIHZhciBuYXRpdmVQcm9wZXJ0aWVzID0gZ2V0TmF0aXZlU3RyaW5nUHJvcGVydGllcygpO1xuICBmb3IgKHZhciBuYW1lIGluIG5hdGl2ZVByb3BlcnRpZXMpIHtcbiAgICAoZnVuY3Rpb24obmFtZSkge1xuICAgICAgdmFyIHN0cmluZ1Byb3AgPSBfX25zcFtuYW1lXTtcbiAgICAgIGlmICh0eXBlb2Ygc3RyaW5nUHJvcCA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIC8vY29uc29sZS5sb2coc3RyaW5nUHJvcClcbiAgICAgICAgaWYgKCFfX3NwW25hbWVdKSB7XG4gICAgICAgICAgaWYgKG5hdGl2ZVByb3BlcnRpZXNbbmFtZV0gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBfX3NwW25hbWVdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIC8vY29uc29sZS5sb2cobmFtZSlcbiAgICAgICAgICAgICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKHN0cmluZ1Byb3AuYXBwbHkodGhpcywgYXJndW1lbnRzKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIF9fc3BbbmFtZV0gPSBzdHJpbmdQcm9wO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pKG5hbWUpO1xuICB9XG5cblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8qIEZ1bmN0aW9uIEFsaWFzZXNcbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gIF9fc3AucmVwZWF0ID0gX19zcC50aW1lcztcbiAgX19zcC5pbmNsdWRlID0gX19zcC5jb250YWlucztcbiAgX19zcC50b0ludGVnZXIgPSBfX3NwLnRvSW50O1xuICBfX3NwLnRvQm9vbCA9IF9fc3AudG9Cb29sZWFuO1xuICBfX3NwLmRlY29kZUhUTUxFbnRpdGllcyA9IF9fc3AuZGVjb2RlSHRtbEVudGl0aWVzIC8vZW5zdXJlIGNvbnNpc3RlbnQgY2FzaW5nIHNjaGVtZSBvZiAnSFRNTCdcblxuXG4vLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLy8gU2V0IHRoZSBjb25zdHJ1Y3Rvci4gIFdpdGhvdXQgdGhpcywgc3RyaW5nLmpzIG9iamVjdHMgYXJlIGluc3RhbmNlcyBvZlxuLy8gT2JqZWN0IGluc3RlYWQgb2YgUy5cbi8vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cbiAgX19zcC5jb25zdHJ1Y3RvciA9IFM7XG5cblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8qIFByaXZhdGUgRnVuY3Rpb25zXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICBmdW5jdGlvbiBnZXROYXRpdmVTdHJpbmdQcm9wZXJ0aWVzKCkge1xuICAgIHZhciBuYW1lcyA9IGdldE5hdGl2ZVN0cmluZ1Byb3BlcnR5TmFtZXMoKTtcbiAgICB2YXIgcmV0T2JqID0ge307XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5hbWVzLmxlbmd0aDsgKytpKSB7XG4gICAgICB2YXIgbmFtZSA9IG5hbWVzW2ldO1xuICAgICAgdmFyIGZ1bmMgPSBfX25zcFtuYW1lXTtcbiAgICAgIHRyeSB7XG4gICAgICAgIHZhciB0eXBlID0gdHlwZW9mIGZ1bmMuYXBwbHkoJ3Rlc3RzdHJpbmcnLCBbXSk7XG4gICAgICAgIHJldE9ialtuYW1lXSA9IHR5cGU7XG4gICAgICB9IGNhdGNoIChlKSB7fVxuICAgIH1cbiAgICByZXR1cm4gcmV0T2JqO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0TmF0aXZlU3RyaW5nUHJvcGVydHlOYW1lcygpIHtcbiAgICB2YXIgcmVzdWx0cyA9IFtdO1xuICAgIGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcykge1xuICAgICAgcmVzdWx0cyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKF9fbnNwKTtcbiAgICAgIHJlc3VsdHMuc3BsaWNlKHJlc3VsdHMuaW5kZXhPZigndmFsdWVPZicpLCAxKTtcbiAgICAgIHJlc3VsdHMuc3BsaWNlKHJlc3VsdHMuaW5kZXhPZigndG9TdHJpbmcnKSwgMSk7XG4gICAgICByZXR1cm4gcmVzdWx0cztcbiAgICB9IGVsc2UgeyAvL21lYW50IGZvciBsZWdhY3kgY3J1ZnQsIHRoaXMgY291bGQgcHJvYmFibHkgYmUgbWFkZSBtb3JlIGVmZmljaWVudFxuICAgICAgdmFyIHN0cmluZ05hbWVzID0ge307XG4gICAgICB2YXIgb2JqZWN0TmFtZXMgPSBbXTtcbiAgICAgIGZvciAodmFyIG5hbWUgaW4gU3RyaW5nLnByb3RvdHlwZSlcbiAgICAgICAgc3RyaW5nTmFtZXNbbmFtZV0gPSBuYW1lO1xuXG4gICAgICBmb3IgKHZhciBuYW1lIGluIE9iamVjdC5wcm90b3R5cGUpXG4gICAgICAgIGRlbGV0ZSBzdHJpbmdOYW1lc1tuYW1lXTtcblxuICAgICAgLy9zdHJpbmdOYW1lc1sndG9TdHJpbmcnXSA9ICd0b1N0cmluZyc7IC8vdGhpcyB3YXMgZGVsZXRlZCB3aXRoIHRoZSByZXN0IG9mIHRoZSBvYmplY3QgbmFtZXNcbiAgICAgIGZvciAodmFyIG5hbWUgaW4gc3RyaW5nTmFtZXMpIHtcbiAgICAgICAgcmVzdWx0cy5wdXNoKG5hbWUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gRXhwb3J0KHN0cikge1xuICAgIHJldHVybiBuZXcgUyhzdHIpO1xuICB9O1xuXG4gIC8vYXR0YWNoIGV4cG9ydHMgdG8gU3RyaW5nSlNXcmFwcGVyXG4gIEV4cG9ydC5leHRlbmRQcm90b3R5cGUgPSBleHRlbmRQcm90b3R5cGU7XG4gIEV4cG9ydC5yZXN0b3JlUHJvdG90eXBlID0gcmVzdG9yZVByb3RvdHlwZTtcbiAgRXhwb3J0LlZFUlNJT04gPSBWRVJTSU9OO1xuICBFeHBvcnQuVE1QTF9PUEVOID0gJ3t7JztcbiAgRXhwb3J0LlRNUExfQ0xPU0UgPSAnfX0nO1xuICBFeHBvcnQuRU5USVRJRVMgPSBFTlRJVElFUztcblxuXG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vKiBFeHBvcnRzXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICBpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgICYmIHR5cGVvZiBtb2R1bGUuZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IEV4cG9ydDtcblxuICB9IGVsc2Uge1xuXG4gICAgaWYodHlwZW9mIGRlZmluZSA9PT0gXCJmdW5jdGlvblwiICYmIGRlZmluZS5hbWQpIHtcbiAgICAgIGRlZmluZShbXSwgZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBFeHBvcnQ7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgd2luZG93LlMgPSBFeHBvcnQ7XG4gICAgfVxuICB9XG5cblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8qIDNyZCBQYXJ0eSBQcml2YXRlIEZ1bmN0aW9uc1xuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgLy9mcm9tIHN1Z2FyLmpzXG4gIGZ1bmN0aW9uIG11bHRpQXJncyhhcmdzLCBmbikge1xuICAgIHZhciByZXN1bHQgPSBbXSwgaTtcbiAgICBmb3IoaSA9IDA7IGkgPCBhcmdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICByZXN1bHQucHVzaChhcmdzW2ldKTtcbiAgICAgIGlmKGZuKSBmbi5jYWxsKGFyZ3MsIGFyZ3NbaV0sIGkpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLy9mcm9tIHVuZGVyc2NvcmUuc3RyaW5nXG4gIHZhciBlc2NhcGVDaGFycyA9IHtcbiAgICBsdDogJzwnLFxuICAgIGd0OiAnPicsXG4gICAgcXVvdDogJ1wiJyxcbiAgICBhcG9zOiBcIidcIixcbiAgICBhbXA6ICcmJ1xuICB9O1xuXG4gIC8vZnJvbSB1bmRlcnNjb3JlLnN0cmluZ1xuICB2YXIgcmV2ZXJzZWRFc2NhcGVDaGFycyA9IHt9O1xuICBmb3IodmFyIGtleSBpbiBlc2NhcGVDaGFycyl7IHJldmVyc2VkRXNjYXBlQ2hhcnNbZXNjYXBlQ2hhcnNba2V5XV0gPSBrZXk7IH1cblxuICBFTlRJVElFUyA9IHtcbiAgICBcImFtcFwiIDogXCImXCIsXG4gICAgXCJndFwiIDogXCI+XCIsXG4gICAgXCJsdFwiIDogXCI8XCIsXG4gICAgXCJxdW90XCIgOiBcIlxcXCJcIixcbiAgICBcImFwb3NcIiA6IFwiJ1wiLFxuICAgIFwiQUVsaWdcIiA6IDE5OCxcbiAgICBcIkFhY3V0ZVwiIDogMTkzLFxuICAgIFwiQWNpcmNcIiA6IDE5NCxcbiAgICBcIkFncmF2ZVwiIDogMTkyLFxuICAgIFwiQXJpbmdcIiA6IDE5NyxcbiAgICBcIkF0aWxkZVwiIDogMTk1LFxuICAgIFwiQXVtbFwiIDogMTk2LFxuICAgIFwiQ2NlZGlsXCIgOiAxOTksXG4gICAgXCJFVEhcIiA6IDIwOCxcbiAgICBcIkVhY3V0ZVwiIDogMjAxLFxuICAgIFwiRWNpcmNcIiA6IDIwMixcbiAgICBcIkVncmF2ZVwiIDogMjAwLFxuICAgIFwiRXVtbFwiIDogMjAzLFxuICAgIFwiSWFjdXRlXCIgOiAyMDUsXG4gICAgXCJJY2lyY1wiIDogMjA2LFxuICAgIFwiSWdyYXZlXCIgOiAyMDQsXG4gICAgXCJJdW1sXCIgOiAyMDcsXG4gICAgXCJOdGlsZGVcIiA6IDIwOSxcbiAgICBcIk9hY3V0ZVwiIDogMjExLFxuICAgIFwiT2NpcmNcIiA6IDIxMixcbiAgICBcIk9ncmF2ZVwiIDogMjEwLFxuICAgIFwiT3NsYXNoXCIgOiAyMTYsXG4gICAgXCJPdGlsZGVcIiA6IDIxMyxcbiAgICBcIk91bWxcIiA6IDIxNCxcbiAgICBcIlRIT1JOXCIgOiAyMjIsXG4gICAgXCJVYWN1dGVcIiA6IDIxOCxcbiAgICBcIlVjaXJjXCIgOiAyMTksXG4gICAgXCJVZ3JhdmVcIiA6IDIxNyxcbiAgICBcIlV1bWxcIiA6IDIyMCxcbiAgICBcIllhY3V0ZVwiIDogMjIxLFxuICAgIFwiYWFjdXRlXCIgOiAyMjUsXG4gICAgXCJhY2lyY1wiIDogMjI2LFxuICAgIFwiYWVsaWdcIiA6IDIzMCxcbiAgICBcImFncmF2ZVwiIDogMjI0LFxuICAgIFwiYXJpbmdcIiA6IDIyOSxcbiAgICBcImF0aWxkZVwiIDogMjI3LFxuICAgIFwiYXVtbFwiIDogMjI4LFxuICAgIFwiY2NlZGlsXCIgOiAyMzEsXG4gICAgXCJlYWN1dGVcIiA6IDIzMyxcbiAgICBcImVjaXJjXCIgOiAyMzQsXG4gICAgXCJlZ3JhdmVcIiA6IDIzMixcbiAgICBcImV0aFwiIDogMjQwLFxuICAgIFwiZXVtbFwiIDogMjM1LFxuICAgIFwiaWFjdXRlXCIgOiAyMzcsXG4gICAgXCJpY2lyY1wiIDogMjM4LFxuICAgIFwiaWdyYXZlXCIgOiAyMzYsXG4gICAgXCJpdW1sXCIgOiAyMzksXG4gICAgXCJudGlsZGVcIiA6IDI0MSxcbiAgICBcIm9hY3V0ZVwiIDogMjQzLFxuICAgIFwib2NpcmNcIiA6IDI0NCxcbiAgICBcIm9ncmF2ZVwiIDogMjQyLFxuICAgIFwib3NsYXNoXCIgOiAyNDgsXG4gICAgXCJvdGlsZGVcIiA6IDI0NSxcbiAgICBcIm91bWxcIiA6IDI0NixcbiAgICBcInN6bGlnXCIgOiAyMjMsXG4gICAgXCJ0aG9yblwiIDogMjU0LFxuICAgIFwidWFjdXRlXCIgOiAyNTAsXG4gICAgXCJ1Y2lyY1wiIDogMjUxLFxuICAgIFwidWdyYXZlXCIgOiAyNDksXG4gICAgXCJ1dW1sXCIgOiAyNTIsXG4gICAgXCJ5YWN1dGVcIiA6IDI1MyxcbiAgICBcInl1bWxcIiA6IDI1NSxcbiAgICBcImNvcHlcIiA6IDE2OSxcbiAgICBcInJlZ1wiIDogMTc0LFxuICAgIFwibmJzcFwiIDogMTYwLFxuICAgIFwiaWV4Y2xcIiA6IDE2MSxcbiAgICBcImNlbnRcIiA6IDE2MixcbiAgICBcInBvdW5kXCIgOiAxNjMsXG4gICAgXCJjdXJyZW5cIiA6IDE2NCxcbiAgICBcInllblwiIDogMTY1LFxuICAgIFwiYnJ2YmFyXCIgOiAxNjYsXG4gICAgXCJzZWN0XCIgOiAxNjcsXG4gICAgXCJ1bWxcIiA6IDE2OCxcbiAgICBcIm9yZGZcIiA6IDE3MCxcbiAgICBcImxhcXVvXCIgOiAxNzEsXG4gICAgXCJub3RcIiA6IDE3MixcbiAgICBcInNoeVwiIDogMTczLFxuICAgIFwibWFjclwiIDogMTc1LFxuICAgIFwiZGVnXCIgOiAxNzYsXG4gICAgXCJwbHVzbW5cIiA6IDE3NyxcbiAgICBcInN1cDFcIiA6IDE4NSxcbiAgICBcInN1cDJcIiA6IDE3OCxcbiAgICBcInN1cDNcIiA6IDE3OSxcbiAgICBcImFjdXRlXCIgOiAxODAsXG4gICAgXCJtaWNyb1wiIDogMTgxLFxuICAgIFwicGFyYVwiIDogMTgyLFxuICAgIFwibWlkZG90XCIgOiAxODMsXG4gICAgXCJjZWRpbFwiIDogMTg0LFxuICAgIFwib3JkbVwiIDogMTg2LFxuICAgIFwicmFxdW9cIiA6IDE4NyxcbiAgICBcImZyYWMxNFwiIDogMTg4LFxuICAgIFwiZnJhYzEyXCIgOiAxODksXG4gICAgXCJmcmFjMzRcIiA6IDE5MCxcbiAgICBcImlxdWVzdFwiIDogMTkxLFxuICAgIFwidGltZXNcIiA6IDIxNSxcbiAgICBcImRpdmlkZVwiIDogMjQ3LFxuICAgIFwiT0VsaWc7XCIgOiAzMzgsXG4gICAgXCJvZWxpZztcIiA6IDMzOSxcbiAgICBcIlNjYXJvbjtcIiA6IDM1MixcbiAgICBcInNjYXJvbjtcIiA6IDM1MyxcbiAgICBcIll1bWw7XCIgOiAzNzYsXG4gICAgXCJmbm9mO1wiIDogNDAyLFxuICAgIFwiY2lyYztcIiA6IDcxMCxcbiAgICBcInRpbGRlO1wiIDogNzMyLFxuICAgIFwiQWxwaGE7XCIgOiA5MTMsXG4gICAgXCJCZXRhO1wiIDogOTE0LFxuICAgIFwiR2FtbWE7XCIgOiA5MTUsXG4gICAgXCJEZWx0YTtcIiA6IDkxNixcbiAgICBcIkVwc2lsb247XCIgOiA5MTcsXG4gICAgXCJaZXRhO1wiIDogOTE4LFxuICAgIFwiRXRhO1wiIDogOTE5LFxuICAgIFwiVGhldGE7XCIgOiA5MjAsXG4gICAgXCJJb3RhO1wiIDogOTIxLFxuICAgIFwiS2FwcGE7XCIgOiA5MjIsXG4gICAgXCJMYW1iZGE7XCIgOiA5MjMsXG4gICAgXCJNdTtcIiA6IDkyNCxcbiAgICBcIk51O1wiIDogOTI1LFxuICAgIFwiWGk7XCIgOiA5MjYsXG4gICAgXCJPbWljcm9uO1wiIDogOTI3LFxuICAgIFwiUGk7XCIgOiA5MjgsXG4gICAgXCJSaG87XCIgOiA5MjksXG4gICAgXCJTaWdtYTtcIiA6IDkzMSxcbiAgICBcIlRhdTtcIiA6IDkzMixcbiAgICBcIlVwc2lsb247XCIgOiA5MzMsXG4gICAgXCJQaGk7XCIgOiA5MzQsXG4gICAgXCJDaGk7XCIgOiA5MzUsXG4gICAgXCJQc2k7XCIgOiA5MzYsXG4gICAgXCJPbWVnYTtcIiA6IDkzNyxcbiAgICBcImFscGhhO1wiIDogOTQ1LFxuICAgIFwiYmV0YTtcIiA6IDk0NixcbiAgICBcImdhbW1hO1wiIDogOTQ3LFxuICAgIFwiZGVsdGE7XCIgOiA5NDgsXG4gICAgXCJlcHNpbG9uO1wiIDogOTQ5LFxuICAgIFwiemV0YTtcIiA6IDk1MCxcbiAgICBcImV0YTtcIiA6IDk1MSxcbiAgICBcInRoZXRhO1wiIDogOTUyLFxuICAgIFwiaW90YTtcIiA6IDk1MyxcbiAgICBcImthcHBhO1wiIDogOTU0LFxuICAgIFwibGFtYmRhO1wiIDogOTU1LFxuICAgIFwibXU7XCIgOiA5NTYsXG4gICAgXCJudTtcIiA6IDk1NyxcbiAgICBcInhpO1wiIDogOTU4LFxuICAgIFwib21pY3JvbjtcIiA6IDk1OSxcbiAgICBcInBpO1wiIDogOTYwLFxuICAgIFwicmhvO1wiIDogOTYxLFxuICAgIFwic2lnbWFmO1wiIDogOTYyLFxuICAgIFwic2lnbWE7XCIgOiA5NjMsXG4gICAgXCJ0YXU7XCIgOiA5NjQsXG4gICAgXCJ1cHNpbG9uO1wiIDogOTY1LFxuICAgIFwicGhpO1wiIDogOTY2LFxuICAgIFwiY2hpO1wiIDogOTY3LFxuICAgIFwicHNpO1wiIDogOTY4LFxuICAgIFwib21lZ2E7XCIgOiA5NjksXG4gICAgXCJ0aGV0YXN5bTtcIiA6IDk3NyxcbiAgICBcInVwc2loO1wiIDogOTc4LFxuICAgIFwicGl2O1wiIDogOTgyLFxuICAgIFwiZW5zcDtcIiA6IDgxOTQsXG4gICAgXCJlbXNwO1wiIDogODE5NSxcbiAgICBcInRoaW5zcDtcIiA6IDgyMDEsXG4gICAgXCJ6d25qO1wiIDogODIwNCxcbiAgICBcInp3ajtcIiA6IDgyMDUsXG4gICAgXCJscm07XCIgOiA4MjA2LFxuICAgIFwicmxtO1wiIDogODIwNyxcbiAgICBcIm5kYXNoO1wiIDogODIxMSxcbiAgICBcIm1kYXNoO1wiIDogODIxMixcbiAgICBcImxzcXVvO1wiIDogODIxNixcbiAgICBcInJzcXVvO1wiIDogODIxNyxcbiAgICBcInNicXVvO1wiIDogODIxOCxcbiAgICBcImxkcXVvO1wiIDogODIyMCxcbiAgICBcInJkcXVvO1wiIDogODIyMSxcbiAgICBcImJkcXVvO1wiIDogODIyMixcbiAgICBcImRhZ2dlcjtcIiA6IDgyMjQsXG4gICAgXCJEYWdnZXI7XCIgOiA4MjI1LFxuICAgIFwiYnVsbDtcIiA6IDgyMjYsXG4gICAgXCJoZWxsaXA7XCIgOiA4MjMwLFxuICAgIFwicGVybWlsO1wiIDogODI0MCxcbiAgICBcInByaW1lO1wiIDogODI0MixcbiAgICBcIlByaW1lO1wiIDogODI0MyxcbiAgICBcImxzYXF1bztcIiA6IDgyNDksXG4gICAgXCJyc2FxdW87XCIgOiA4MjUwLFxuICAgIFwib2xpbmU7XCIgOiA4MjU0LFxuICAgIFwiZnJhc2w7XCIgOiA4MjYwLFxuICAgIFwiZXVybztcIiA6IDgzNjQsXG4gICAgXCJpbWFnZTtcIiA6IDg0NjUsXG4gICAgXCJ3ZWllcnA7XCIgOiA4NDcyLFxuICAgIFwicmVhbDtcIiA6IDg0NzYsXG4gICAgXCJ0cmFkZTtcIiA6IDg0ODIsXG4gICAgXCJhbGVmc3ltO1wiIDogODUwMSxcbiAgICBcImxhcnI7XCIgOiA4NTkyLFxuICAgIFwidWFycjtcIiA6IDg1OTMsXG4gICAgXCJyYXJyO1wiIDogODU5NCxcbiAgICBcImRhcnI7XCIgOiA4NTk1LFxuICAgIFwiaGFycjtcIiA6IDg1OTYsXG4gICAgXCJjcmFycjtcIiA6IDg2MjksXG4gICAgXCJsQXJyO1wiIDogODY1NixcbiAgICBcInVBcnI7XCIgOiA4NjU3LFxuICAgIFwickFycjtcIiA6IDg2NTgsXG4gICAgXCJkQXJyO1wiIDogODY1OSxcbiAgICBcImhBcnI7XCIgOiA4NjYwLFxuICAgIFwiZm9yYWxsO1wiIDogODcwNCxcbiAgICBcInBhcnQ7XCIgOiA4NzA2LFxuICAgIFwiZXhpc3Q7XCIgOiA4NzA3LFxuICAgIFwiZW1wdHk7XCIgOiA4NzA5LFxuICAgIFwibmFibGE7XCIgOiA4NzExLFxuICAgIFwiaXNpbjtcIiA6IDg3MTIsXG4gICAgXCJub3RpbjtcIiA6IDg3MTMsXG4gICAgXCJuaTtcIiA6IDg3MTUsXG4gICAgXCJwcm9kO1wiIDogODcxOSxcbiAgICBcInN1bTtcIiA6IDg3MjEsXG4gICAgXCJtaW51cztcIiA6IDg3MjIsXG4gICAgXCJsb3dhc3Q7XCIgOiA4NzI3LFxuICAgIFwicmFkaWM7XCIgOiA4NzMwLFxuICAgIFwicHJvcDtcIiA6IDg3MzMsXG4gICAgXCJpbmZpbjtcIiA6IDg3MzQsXG4gICAgXCJhbmc7XCIgOiA4NzM2LFxuICAgIFwiYW5kO1wiIDogODc0MyxcbiAgICBcIm9yO1wiIDogODc0NCxcbiAgICBcImNhcDtcIiA6IDg3NDUsXG4gICAgXCJjdXA7XCIgOiA4NzQ2LFxuICAgIFwiaW50O1wiIDogODc0NyxcbiAgICBcInRoZXJlNDtcIiA6IDg3NTYsXG4gICAgXCJzaW07XCIgOiA4NzY0LFxuICAgIFwiY29uZztcIiA6IDg3NzMsXG4gICAgXCJhc3ltcDtcIiA6IDg3NzYsXG4gICAgXCJuZTtcIiA6IDg4MDAsXG4gICAgXCJlcXVpdjtcIiA6IDg4MDEsXG4gICAgXCJsZTtcIiA6IDg4MDQsXG4gICAgXCJnZTtcIiA6IDg4MDUsXG4gICAgXCJzdWI7XCIgOiA4ODM0LFxuICAgIFwic3VwO1wiIDogODgzNSxcbiAgICBcIm5zdWI7XCIgOiA4ODM2LFxuICAgIFwic3ViZTtcIiA6IDg4MzgsXG4gICAgXCJzdXBlO1wiIDogODgzOSxcbiAgICBcIm9wbHVzO1wiIDogODg1MyxcbiAgICBcIm90aW1lcztcIiA6IDg4NTUsXG4gICAgXCJwZXJwO1wiIDogODg2OSxcbiAgICBcInNkb3Q7XCIgOiA4OTAxLFxuICAgIFwibGNlaWw7XCIgOiA4OTY4LFxuICAgIFwicmNlaWw7XCIgOiA4OTY5LFxuICAgIFwibGZsb29yO1wiIDogODk3MCxcbiAgICBcInJmbG9vcjtcIiA6IDg5NzEsXG4gICAgXCJsYW5nO1wiIDogOTAwMSxcbiAgICBcInJhbmc7XCIgOiA5MDAyLFxuICAgIFwibG96O1wiIDogOTY3NCxcbiAgICBcInNwYWRlcztcIiA6IDk4MjQsXG4gICAgXCJjbHVicztcIiA6IDk4MjcsXG4gICAgXCJoZWFydHM7XCIgOiA5ODI5LFxuICAgIFwiZGlhbXM7XCIgOiA5ODMwXG4gIH1cblxuXG59KS5jYWxsKHRoaXMpO1xuIiwibGV0IHAgPSBTeW1ib2woKTtcblxubGV0IEh0bWwgPSB7XG5cdHBhcnNlQWxsKGh0bWwpIHtcblx0XHRsZXQgZWwgICA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdGVsLmlubmVySFRNTCA9IGh0bWw7XG5cdFx0cmV0dXJuIEFycmF5LnByb3RvdHlwZS5zbGljZS5hcHBseShlbC5jaGlsZE5vZGVzKTtcblx0fSxcblx0cGFyc2UoaHRtbCkge1xuXHRcdHJldHVybiB0aGlzLnBhcnNlQWxsKGh0bWwpWzBdO1xuXHR9XG59O1xuXG5jbGFzcyBEb21TdHJlYW0ge1xuXHRjb25zdHJ1Y3Rvcihzb3VyY2UpIHtcblx0XHR0aGlzW3BdID0gc291cmNlO1xuXHR9XG5cdGFwcGx5RGlzcGxheShlbCwgZGlzcGxheSA9IFwiXCIpIHtcblx0XHRsZXQgb2xkID0gZWwuc3R5bGUuZGlzcGxheSxcblx0XHRcdMaSID0gKHYpID0+IGVsLnN0eWxlLmRpc3BsYXkgPSB2ID8gZGlzcGxheSA6IFwibm9uZVwiO1xuXHRcdHRoaXNbcF0uc3Vic2NyaWJlKMaSKTtcblx0XHRyZXR1cm4gKCkgPT4ge1xuXHRcdFx0dGhpc1twXS51bnN1YnNjcmliZSjGkik7XG5cdFx0XHRlbC5zdHlsZS5kaXNwbGF5ID0gb2xkO1xuXHRcdH07XG5cdH1cblx0YXBwbHlUZXh0KGVsKSB7XG5cdFx0bGV0IG9sZCA9IGVsLmlubmVySFRNTCxcblx0XHRcdMaSID0gKHYpID0+IGVsLmlubmVySFRNTCA9IHY7XG5cdFx0dGhpc1twXS5zdWJzY3JpYmUoxpIpO1xuXHRcdHJldHVybiAoKSA9PiB7XG5cdFx0XHR0aGlzW3BdLnVuc3Vic2NyaWJlKMaSKTtcblx0XHRcdGVsLmlubmVySFRNTCA9IG9sZDtcblx0XHR9O1xuXHR9XG5cdGFwcGx5QXR0cmlidXRlKG5hbWUsIGVsKSB7XG5cdFx0bGV0IG9sZCA9IGVsLmdldEF0dHJpYnV0ZShuYW1lKSxcblx0XHRcdMaSID0gKHYpID0+IGVsLnNldEF0dHJpYnV0ZShuYW1lLCB2KTtcblx0XHR0aGlzW3BdLnN1YnNjcmliZSjGkik7XG5cdFx0cmV0dXJuICgpID0+IHtcblx0XHRcdHRoaXNbcF0udW5zdWJzY3JpYmUoxpIpO1xuXHRcdFx0aWYob2xkICE9PSB1bmRlZmluZWQpXG5cdFx0XHRcdGVsLnNldEF0dHJpYnV0ZShuYW1lLCBvbGQpO1xuXHRcdFx0ZWxzZVxuXHRcdFx0XHRlbC5yZW1vdmVBdHRyaWJ1dGUobmFtZSk7XG5cdFx0fTtcblx0fVxuXHRhcHBseVN3YXBDbGFzcyhlbCwgY2xhc3NOYW1lKSB7XG5cdFx0bGV0IGhhcyA9IGVsLmNsYXNzTGlzdC5jb250YWlucyhjbGFzc05hbWUpLFxuXHRcdFx0xpIgPSAodikgPT4gdiA/IGVsLmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKSA6IGVsLmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lKTtcblx0XHR0aGlzW3BdLnN1YnNjcmliZSjGkik7XG5cdFx0cmV0dXJuICgpID0+IHtcblx0XHRcdHRoaXNbcF0udW5zdWJzY3JpYmUoxpIpO1xuXHRcdFx0aWYoaGFzKVxuXHRcdFx0XHRlbC5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSk7XG5cdFx0XHRlbHNlXG5cdFx0XHRcdGVsLmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lKTtcblx0XHR9O1xuXHR9XG59XG5cbmxldCBEb20gPSB7XG5cdHN3YXBDbGFzcyhlbCwgY2xhc3NOYW1lKSB7XG5cdFx0cmV0dXJuICh2YWx1ZSkgPT4gdmFsdWUgPyBlbC5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSkgOiBlbC5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzTmFtZSk7XG5cdH0sXG5cdHN0cmVhbShzb3VyY2UpIHtcblx0XHRyZXR1cm4gbmV3IERvbVN0cmVhbShzb3VyY2UpO1xuXHR9XG59XG5cbmxldCBTdHJlYW1Eb20gPSB7XG5cbn1cbi8qXG5jbGFzcyBEb21BcHBsaWVyIHtcblx0Y29uc3RydWN0b3IoxpIpIHtcblx0XHR0aGlzLsaSID0gxpI7XG5cdH1cblx0dG8oZWwpIHtcblx0XHRyZXR1cm4gdGhpcy7GkihlbCk7XG5cdH1cblx0dG9BbGwoZWwpIHtcblx0XHRyZXR1cm4gZWwubWFwKHRoaXMuxpIpO1xuXHR9XG5cdHdoZW4oZWwpIHtcblx0XHRpZihudWxsID09IGVsKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiB0aGlzLsaSKGVsKTtcblx0XHR9XG5cdH1cbn1cblxubGV0IERvbSA9IHtcblx0YWRkQ2xhc3MoY2xhc3NOYW1lKSB7XG5cdFx0cmV0dXJuIG5ldyBEb21BcHBsaWVyKGVsID0+IGVsLmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKSk7XG5cdH0sXG5cblx0cmVtb3ZlQ2xhc3MoY2xhc3NOYW1lKSB7XG5cdFx0cmV0dXJuIG5ldyBEb21BcHBsaWVyKGVsID0+IGVsLmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lKSk7XG5cdH0sXG5cblx0dG9nZ2xlQ2xhc3MoY2xhc3NOYW1lKSB7XG5cdFx0cmV0dXJuIG5ldyBEb21BcHBsaWVyKGVsID0+IGVsLmNsYXNzTGlzdC50b2dnbGUoY2xhc3NOYW1lKSk7XG5cdH0sXG5cblx0aGFzQ2xhc3MoY2xhc3NOYW1lKSB7XG5cdFx0cmV0dXJuIG5ldyBEb21BcHBsaWVyKGVsID0+IGVsLmNsYXNzTGlzdC5jb250YWlucyhjbGFzc05hbWUpKTtcblx0fVxufVxuKi9cblxubGV0IFF1ZXJ5ID0ge1xuXHRmaXJzdChzZWxlY3RvciwgY3R4KSB7XG5cdFx0cmV0dXJuIChjdHggfHwgZG9jdW1lbnQpLnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xuXHR9LFxuXG5cdGFsbChzZWxlY3RvciwgY3R4KSB7XG5cdFx0cmV0dXJuIChjdHggfHwgZG9jdW1lbnQpLnF1ZXJ5KHNlbGVjdG9yKTtcblx0fVxufTtcblxuLypcbkRvbS5hZGRDbGFzcyhcInNlbGVjdGVkXCIpLnRvKGVsKTtcbkRvbS5hZGRDbGFzcyhcInNlbGVjdGVkXCIpLnRvQWxsKFF1ZXJ5LmFsbCgnLmVkaXRvcicpKTtcbkRvbS5hZGRDbGFzcyhcInNlbGVjdGVkXCIpLndoZW4oUXVlcnkuZmlyc3QoJy5lZGl0b3InKSk7XG5cbnZhciBiID0gSHRtbC5wYXJzZSgnPGI+PC9iPicpLCAvLyBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdiJylcblx0YyA9IGVsLnBhcmVudE5vZGU7XG5iLmFwcGVuZENoaWxkKGVsKTtcbmMuYXBwZW5kQ2hpbGQoYik7XG5cbkRvbS53cmFwKGVsKS5pbnRvKEh0bWwucGFyc2UoJzxiPjwvYj4nKSlcblxuUXVlcnkuaWZGaXJzdChcIi5lZGl0b3JcIiwgRG9tLmFkZENsYXNzKFwic2VsZWN0ZWRcIikpXG4qL1xuZXhwb3J0IHsgSHRtbCwgUXVlcnksIERvbSB9OyIsImxldCBpbW1lZGlhdGUgPSByZXF1aXJlKCdpbW1lZGlhdGUnKTtcblxubGV0IFRpbWVyID0ge1xuXHRkZWxheShtcywgxpIpIHtcblx0XHRpZijGkilcblx0XHRcdHJldHVybiBzZXRUaW1lb3V0KMaSLCBtcyk7XG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIG1zKSk7XG5cdH0sXG5cdGltbWVkaWF0ZSjGkikge1xuXHRcdGlmKMaSKVxuXHRcdFx0cmV0dXJuIGltbWVkaWF0ZSjGkik7XG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBpbW1lZGlhdGUocmVzb2x2ZSkpO1xuXHR9LFxuXHRkZWJvdW5jZSjGkiwgbXMgPSAwKSB7XG5cdFx0bGV0IHRpZCwgY29udGV4dCwgYXJncywgbGF0ZXLGkjtcblx0XHRyZXR1cm4gZnVuY3Rpb24oKSB7XG5cdFx0XHRjb250ZXh0ID0gdGhpcztcblx0XHRcdGFyZ3MgPSBhcmd1bWVudHM7XG5cdFx0XHRsYXRlcsaSID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGlmICghaW1tZWRpYXRlKSDGki5hcHBseShjb250ZXh0LCBhcmdzKTtcblx0XHRcdH07XG5cdFx0XHRjbGVhclRpbWVvdXQodGlkKTtcblx0XHRcdHRpZCA9IHNldFRpbWVvdXQobGF0ZXLGkiwgbXMpO1xuXHRcdH07XG5cdH0sXG5cdHJlZHVjZSjGkiwgbXMgPSAwKSB7XG5cdFx0bGV0IHRpZCwgY29udGV4dCwgYXJncztcblx0XHRyZXR1cm4gZnVuY3Rpb24oKSB7XG5cdFx0XHRjb250ZXh0ID0gdGhpcztcblx0XHRcdGFyZ3MgPSBhcmd1bWVudHM7XG5cdFx0XHRpZih0aWQpIHJldHVybjtcblx0XHRcdHRpZCA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHRpZCA9IG51bGw7XG5cdFx0XHRcdMaSLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuXHRcdFx0fSwgbXMpO1xuXHRcdH07XG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgVGltZXI7Il19
