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
  fragment.properties.value = " Hey Franco";
  fragment.properties.value.feed(fragment.properties.text);
  Properties.addValue(number, "Float");
  Properties.addVisible(fragment);
  Stream.interval(300).cancelOn(Stream.delay(6500).subscribe((function() {
    return Properties.removeVisible(fragment);
  }))).reduce(true, (function(acc) {
    return !acc;
  })).feed(fragment.properties.visible);
  Properties.addStrong(fragment, true);
  Properties.addNumericFormat(number, "$ 0,0.00");
  Properties.addLink(number, "http://google.com");
  Stream.delay(5000).subscribe((function() {
    return Properties.removeLink(number);
  }));
  Stream.delay(8000).subscribe((function() {
    return Properties.removeTooltip(number);
  }));
  Properties.addTooltip(number, "tooltip text goes here");
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
      return Dom.stream(value).applyAttribute(attribute, el);
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
  interval: function(ms) {
    var id,
        stream = new CancelableSource(function() {
          clearInterval(id);
        });
    id = setInterval((function() {
      return stream.push();
    }), ms);
    return stream;
  },
  delay: function(ms) {
    var id,
        stream = new CancelableSource(function() {
          clearTimeout(id);
        });
    id = setTimeout((function() {
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
    return this;
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
var Dom = {stream: function(source) {
    return new DomStream(source);
  }};
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvZnJhbmNvcG9udGljZWxsaS9wcm9qZWN0cy9jYXJkcy9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvY2xpZW50L21haW4uanMiLCIvVXNlcnMvZnJhbmNvcG9udGljZWxsaS9wcm9qZWN0cy9jYXJkcy9jbGllbnQvdWkvZnJhZ21lbnQuamFkZSIsIi9Vc2Vycy9mcmFuY29wb250aWNlbGxpL3Byb2plY3RzL2NhcmRzL2NsaWVudC91aS9mcmFnbWVudC5qcyIsIi9Vc2Vycy9mcmFuY29wb250aWNlbGxpL3Byb2plY3RzL2NhcmRzL2NsaWVudC91aS9wcm9wZXJ0aWVzLmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2luc2VydC1tb2R1bGUtZ2xvYmFscy9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL2NhcmRzL21vZGVsL3N0cmVhbS5qcyIsIi9Vc2Vycy9mcmFuY29wb250aWNlbGxpL3Byb2plY3RzL2NhcmRzL25vZGVfbW9kdWxlcy9jYXJkcy9tb2RlbC92YWx1ZS5qcyIsIi9Vc2Vycy9mcmFuY29wb250aWNlbGxpL3Byb2plY3RzL2NhcmRzL25vZGVfbW9kdWxlcy9lczZpZnkvbm9kZV9tb2R1bGVzL3RyYWNldXIvYmluL3RyYWNldXItcnVudGltZS5qcyIsIi9Vc2Vycy9mcmFuY29wb250aWNlbGxpL3Byb2plY3RzL2NhcmRzL25vZGVfbW9kdWxlcy9pbW1lZGlhdGUvbGliL2Zha2VOZXh0VGljay5qcyIsIi9Vc2Vycy9mcmFuY29wb250aWNlbGxpL3Byb2plY3RzL2NhcmRzL25vZGVfbW9kdWxlcy9pbW1lZGlhdGUvbGliL2luZGV4LmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL2ltbWVkaWF0ZS9saWIvbWVzc2FnZUNoYW5uZWwuanMiLCIvVXNlcnMvZnJhbmNvcG9udGljZWxsaS9wcm9qZWN0cy9jYXJkcy9ub2RlX21vZHVsZXMvaW1tZWRpYXRlL2xpYi9tdXRhdGlvbi5qcyIsIi9Vc2Vycy9mcmFuY29wb250aWNlbGxpL3Byb2plY3RzL2NhcmRzL25vZGVfbW9kdWxlcy9pbW1lZGlhdGUvbGliL3Bvc3RNZXNzYWdlLmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL2ltbWVkaWF0ZS9saWIvc3RhdGVDaGFuZ2UuanMiLCIvVXNlcnMvZnJhbmNvcG9udGljZWxsaS9wcm9qZWN0cy9jYXJkcy9ub2RlX21vZHVsZXMvaW1tZWRpYXRlL2xpYi90aW1lb3V0LmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL2phZGUvcnVudGltZS5qcyIsIi9Vc2Vycy9mcmFuY29wb250aWNlbGxpL3Byb2plY3RzL2NhcmRzL25vZGVfbW9kdWxlcy9udW1lcmFsL251bWVyYWwuanMiLCIvVXNlcnMvZnJhbmNvcG9udGljZWxsaS9wcm9qZWN0cy9jYXJkcy9ub2RlX21vZHVsZXMvc3RyaW5nL2xpYi9zdHJpbmcuanMiLCIvVXNlcnMvZnJhbmNvcG9udGljZWxsaS9wcm9qZWN0cy9jYXJkcy9ub2RlX21vZHVsZXMvdWkvZG9tLmpzIiwiL1VzZXJzL2ZyYW5jb3BvbnRpY2VsbGkvcHJvamVjdHMvY2FyZHMvbm9kZV9tb2R1bGVzL3VpL3RpbWVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7O3FCQUF1QixvQkFBb0I7dUJBQ2xCLGVBQWU7eUJBQ2IsaUJBQWlCO0FBRTVDLENBQUEsT0FBUSxpQkFB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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzl6Q0E7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2cUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwOUJBOztHQUFJLENBQUEsQ0FBQyxFQUFHLENBQUEsTUFBTSxFQUFFO1VBRUw7Q0FDVixTQUFRLENBQVIsVUFBUyxJQUFJO09BQ1IsQ0FBQSxFQUFFLEVBQUssQ0FBQSxRQUFRLGNBQWMsQ0FBQyxLQUFLLENBQUM7QUFDeEMsQ0FBQSxLQUFFLFVBQVUsRUFBRyxLQUFJLENBQUM7Q0FDcEIsU0FBTyxDQUFBLEtBQUssVUFBVSxNQUFNLE1BQU0sQ0FBQyxFQUFFLFdBQVcsQ0FBQyxDQUFDO0dBQ2xEO0NBQ0QsTUFBSyxDQUFMLFVBQU0sSUFBSSxDQUFFO0NBQ1gsU0FBTyxDQUFBLElBQUksU0FB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QyxPQUFPLENBQUUsS0FBSSxDQUFDLENBQUM7Q0FBQSxNQUN2QyxDQUFDO0FBQ0YsQ0FBQSxpQkFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2xCLENBQUEsUUFBRyxFQUFHLENBQUEsVUFBVSxDQUFDLE1BQU0sQ0FBRSxHQUFFLENBQUMsQ0FBQztLQUM3QixDQUFDO0dBQ0Y7Q0FDRCxPQUFNLENBQU4sVUFBTyxDQUFDLEFBQVE7T0FBTixHQUFFLDZDQUFHLEVBQUM7T0FDWCxDQUFBLEdBQUc7QUFBRSxDQUFBLGNBQU87QUFBRSxDQUFBLFdBQUk7Q0FDdEIsU0FBTyxVQUFTLENBQUU7QUFDakIsQ0FBQSxZQUFPLEVBQUcsS0FBSSxDQUFDO0FBQ2YsQ0FBQSxTQUFJLEVBQUcsVUFBUyxDQUFDO0NBQ2pCLFNBQUcsR0FBRztDQUFFLGNBQU87QUFDZixDQURlLFFBQ1osRUFBRyxDQUFBLFVBQVUsQ0FBQyxTQUFTLENBQUU7QUFDM0IsQ0FBQSxVQUFHLEVBQUcsS0FBSSxDQUFDO0FBQ1gsQ0FBQSxRQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUUsS0FBSSxDQUFDLENBQUM7T0FDdkIsQ0FBRSxHQUFFLENBQUMsQ0FBQztLQUNQLENBQUM7R0FDRjtDQUNEO2dCQUVjLE1BQUs7Ozs7Ozs7Q0FBQyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IHsgU3RyZWFtIH0gZnJvbSAnY2FyZHMvbW9kZWwvc3RyZWFtJztcbmltcG9ydCB7IEZyYWdtZW50IH0gZnJvbSAnLi91aS9mcmFnbWVudCc7XG5pbXBvcnQgeyBQcm9wZXJ0aWVzIH0gZnJvbSAnLi91aS9wcm9wZXJ0aWVzJztcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgZnVuY3Rpb24oKSB7XG5cdGxldCBjb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY29udGFpbmVyJyksXG5cdFx0bnVtYmVyICAgID0gbmV3IEZyYWdtZW50KCksXG5cdFx0ZnJhZ21lbnQgID0gbmV3IEZyYWdtZW50KCk7XG5cblx0bnVtYmVyLmF0dGFjaFRvKGNvbnRhaW5lcik7XG5cdGZyYWdtZW50LmF0dGFjaFRvKGNvbnRhaW5lcik7XG5cblx0Ly8gYWRkIHRleHQgcHJvcGVydHkgYW5kIHJlbmRlcmluZ1xuXHRQcm9wZXJ0aWVzLmFkZFRleHQoZnJhZ21lbnQpO1xuXHRQcm9wZXJ0aWVzLmFkZFRleHQobnVtYmVyKTtcblxuXHQvLyBhZGQgYSB2YWx1ZVxuXHRQcm9wZXJ0aWVzLmFkZFZhbHVlKGZyYWdtZW50LCBcIlN0cmluZ1wiKTtcblx0ZnJhZ21lbnQucHJvcGVydGllcy52YWx1ZSA9IFwiIEhleSBGcmFuY29cIjtcblx0Ly8gbWFudWFsbHkgd2lyZSB2YWx1ZSB0byB0ZXh0XG5cdGZyYWdtZW50LnByb3BlcnRpZXMudmFsdWUuZmVlZChmcmFnbWVudC5wcm9wZXJ0aWVzLnRleHQpO1xuXG5cdFByb3BlcnRpZXMuYWRkVmFsdWUobnVtYmVyLCBcIkZsb2F0XCIpO1xuXG5cdC8vIG1ha2UgaXQgYmxpbmtcblx0UHJvcGVydGllcy5hZGRWaXNpYmxlKGZyYWdtZW50KTtcblx0U3RyZWFtLmludGVydmFsKDMwMClcblx0XHQuY2FuY2VsT24oU3RyZWFtLmRlbGF5KDY1MDApLnN1YnNjcmliZSgoKSA9PiBQcm9wZXJ0aWVzLnJlbW92ZVZpc2libGUoZnJhZ21lbnQpKSlcblx0XHQucmVkdWNlKHRydWUsIChhY2MpID0+ICFhY2MpXG5cdFx0LmZlZWQoZnJhZ21lbnQucHJvcGVydGllcy52aXNpYmxlKTtcblxuXHQvLyBtYWtlIGJvbGRcblx0UHJvcGVydGllcy5hZGRTdHJvbmcoZnJhZ21lbnQsIHRydWUpO1xuXG5cdC8vIGFkZCBmb3JtYXRcblx0UHJvcGVydGllcy5hZGROdW1lcmljRm9ybWF0KG51bWJlciwgXCIkIDAsMC4wMFwiKTtcblxuXHQvLyBhZGQgbGlua1xuXHRQcm9wZXJ0aWVzLmFkZExpbmsobnVtYmVyLCBcImh0dHA6Ly9nb29nbGUuY29tXCIpO1xuXHQvLyByZW1vdmUgbGluayBhZnRlciA1IHNlY3Ncblx0U3RyZWFtLmRlbGF5KDUwMDApXG5cdFx0LnN1YnNjcmliZSgoKSA9PiBQcm9wZXJ0aWVzLnJlbW92ZUxpbmsobnVtYmVyKSk7XG5cblx0Ly8gcmVtb3ZlIHRvb2x0aXAgYWZ0ZXIgOCBzZWNzXG5cdFN0cmVhbS5kZWxheSg4MDAwKVxuXHRcdC5zdWJzY3JpYmUoKCkgPT4gUHJvcGVydGllcy5yZW1vdmVUb29sdGlwKG51bWJlcikpO1xuXG5cdC8vIGFkZCB0b29sdGlwXG5cdFByb3BlcnRpZXMuYWRkVG9vbHRpcChudW1iZXIsIFwidG9vbHRpcCB0ZXh0IGdvZXMgaGVyZVwiKTtcblxuXHQvLyB1cGRhdGUgbnVtYmVyXG5cdFN0cmVhbS5pbnRlcnZhbCgxMDAwKVxuXHRcdC5yZWR1Y2UoMCwgKGFjYykgPT4gYWNjICsgMy83KVxuXHRcdC5mZWVkKG51bWJlci5wcm9wZXJ0aWVzLnZhbHVlKTtcbn0sIGZhbHNlKTtcblxuIiwidmFyIGphZGUgPSByZXF1aXJlKFwiamFkZS9ydW50aW1lXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge1xudmFyIGJ1ZiA9IFtdO1xudmFyIGphZGVfbWl4aW5zID0ge307XG52YXIgamFkZV9pbnRlcnA7XG5cbmJ1Zi5wdXNoKFwiPHNwYW4gY2xhc3M9XFxcImZyYWdtZW50XFxcIj48c3BhbiBjbGFzcz1cXFwiY29udGVudFxcXCI+PC9zcGFuPjwvc3Bhbj5cIik7O3JldHVybiBidWYuam9pbihcIlwiKTtcbn07IiwiaW1wb3J0IHsgSHRtbCB9IGZyb20gJ3VpL2RvbSc7XG5cbmxldCB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4vZnJhZ21lbnQuamFkZScpKCksXG5cdCQgPSBTeW1ib2woKSxcblx0cCA9IFN5bWJvbCgpLFxuXHR1ID0gU3ltYm9sKCksXG5cdHBhcmVudCA9IFN5bWJvbCgpO1xuXG4vLyBUT0RPLCBhZGQgcHJvcGVydGllcyBpdGVyYXRvclxuY2xhc3MgUHJvcGVydHlDb250YWluZXIge1xuXHRjb25zdHJ1Y3RvcihwYXJlbnQpIHtcblx0XHR0aGlzW3BhcmVudF0gPSBwYXJlbnQ7XG5cdFx0dGhpc1twXSA9IHt9O1xuXHRcdHRoaXNbdV0gPSB7fTtcblx0fVxuXG5cdGdldCBkYXRhKCkge1xuXHRcdGxldCBvdXQgPSB7fSxcblx0XHRcdHByb3BlcnRpZXMgPSB0aGlzLnByb3BlcnRpZXM7XG5cdFx0Zm9yKGxldCBrZXkgaW4gcHJvcGVydGllcykge1xuXHRcdFx0aWYocHJvcGVydGllc1trZXldIGluc3RhbmNlb2YgUHJvcGVydHlDb250YWluZXIpIHtcblx0XHRcdFx0b3V0W2tleV0gPSBwcm9wZXJ0aWVzW2tleV0uZGF0YTtcblx0XHRcdH0gZWxzZSBpZighcHJvcGVydGllc1trZXldLmlzRGVmYXVsdCkge1xuXHRcdFx0XHRvdXRba2V5XSA9IHByb3BlcnRpZXNba2V5XS52YWx1ZTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIG91dDtcblx0fVxuXG5cdHNldCBkYXRhKG8pIHtcblx0XHRsZXQgcHJvcGVydGllcyA9IHRoaXMucHJvcGVydGllcztcblx0XHRmb3IobGV0IGtleSBpbiBvKSB7XG5cdFx0XHRpZighcHJvcGVydGllc1trZXldKVxuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdGlmKHByb3BlcnRpZXNba2V5XSBpbnN0YW5jZW9mIFByb3BlcnR5Q29udGFpbmVyKSB7XG5cdFx0XHRcdHByb3BlcnRpZXNba2V5XS5kYXRhID0gb1trZXldO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cHJvcGVydGllc1trZXldLnZhbHVlID0gb1trZXldO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdGFkZFByb3BlcnR5VmFsdWUobmFtZSwgdmFsdWUsIHdpcmUpIHtcblx0XHRpZih0aGlzW3VdW25hbWVdKVxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBBIHByb3BlcnR5ICR7bmFtZX0gYWxyZWFkeSBleGlzdHNgKTtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpc1twXSwgbmFtZSwge1xuXHRcdFx0Y29uZmlndXJhYmxlOiB0cnVlLFxuXHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcblx0XHRcdHdyaXRlYWJsZTogZmFsc2UsXG5cdFx0XHRnZXQ6ICgpID0+IHZhbHVlLFxuXHRcdFx0c2V0OiAodikgPT4gdmFsdWUuc2V0KHYpXG5cdFx0fSk7XG5cdFx0dGhpc1t1XVtuYW1lXSA9IHdpcmUuY2FsbCh0aGlzLnByb3BlcnRpZXMsIHZhbHVlLCB0aGlzWyRdKTtcblx0fVxuXG5cdGFkZFByb3BlcnR5Q29udGFpbmVyKG5hbWUsIGRlZmF1bHRGaWVsZCkge1xuXHRcdGlmKHRoaXNbdV1bbmFtZV0pXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEEgcHJvcGVydHkgJHtuYW1lfSBhbHJlYWR5IGV4aXN0c2ApO1xuXHRcdGxldCBjb250YWluZXIgPSB0aGlzW3VdW25hbWVdID0gbmV3IFByb3BlcnR5Q29udGFpbmVyKCksXG5cdFx0XHRzZXR0ZXIgPSAoZGVmYXVsdEZpZWxkKSA/XG5cdFx0XHRcdGZ1bmN0aW9uKHYpIHsgY29udGFpbmVyW2RlZmF1bHRGaWVsZF0uc2V0KHYpOyB9IDpcblx0XHRcdFx0ZnVuY3Rpb24oKSB7IHRocm93IG5ldyBFcnJvcignUHJvcGVydHkgQ29udGFpbmVyIGRvZXNuXFwndCBoYXZlIGEgZGVmYXVsdCBmaWVsZCcpOyB9O1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzW3BdLCBuYW1lLCB7XG5cdFx0XHRjb25maWd1cmFibGU6IHRydWUsXG5cdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuXHRcdFx0d3JpdGVhYmxlOiBmYWxzZSxcblx0XHRcdGdldDogKCkgPT4gY29udGFpbmVyLFxuXHRcdFx0c2V0OiBzZXR0ZXJcblx0XHR9KTtcblx0XHRyZXR1cm4gY29udGFpbmVyO1xuXHR9XG5cblx0cmVtb3ZlUHJvcGVydHkobmFtZSkge1xuXHRcdGlmKCF0aGlzW3VdW25hbWVdKVxuXHRcdFx0dGhyb3cgYE9iamVjdCBkb2Vzbid0IGNvbnRhaW4gYSBwcm9wZXJ0eSAke25hbWV9YDtcblx0XHRpZih0aGlzW3VdW25hbWVdIGluc3RhbmNlb2YgUHJvcGVydHlDb250YWluZXIpXG5cdFx0XHR0aGlzW3VdW25hbWVdLnJlbW92ZVByb3BlcnRpZXMoKTtcblx0XHRlbHNlXG5cdFx0XHR0aGlzW3VdW25hbWVdKCk7XG5cdFx0ZGVsZXRlIHRoaXNbdV1bbmFtZV07XG5cdFx0ZGVsZXRlIHRoaXNbcF1bbmFtZV07XG5cdH1cblxuXHRyZW1vdmVQcm9wZXJ0aWVzKCkge1xuXHRcdGZvcihsZXQga2V5IGluIHRoaXNbdV0pXG5cdFx0XHR0aGlzLnJlbW92ZVByb3BlcnR5KGtleSk7XG5cdH1cblxuXHRnZXQgcHJvcGVydGllcygpIHtcblx0XHRyZXR1cm4gdGhpc1twXTtcblx0fVxuXG5cdGdldCBwYXJlbnQoKSB7XG5cdFx0cmV0dXJuIHRoaXNbcGFyZW50XTtcblx0fVxufVxuXG5jbGFzcyBGcmFnbWVudCBleHRlbmRzIFByb3BlcnR5Q29udGFpbmVyIHtcblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0dGhpc1skXSA9IEh0bWwucGFyc2UodGVtcGxhdGUpO1xuXHRcdHRoaXNbcF0gPSB7fTtcblx0XHR0aGlzW3VdID0ge307XG5cdH1cblxuXHRhdHRhY2hUbyhjb250YWluZXIpIHtcblx0XHRjb250YWluZXIuYXBwZW5kQ2hpbGQodGhpc1skXSk7XG5cdH1cblxuXHRkZXRhY2goKSB7XG5cdFx0dGhpc1skXS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRoaXNbJF0pO1xuXHR9XG59XG5cblxuXG5leHBvcnQgeyBGcmFnbWVudCwgUHJvcGVydHlDb250YWluZXIsICQsIHAgfTsiLCJsZXQgc3RyaW5nICA9IHJlcXVpcmUoJ3N0cmluZycpLFxuXHRudW1lcmFsID0gcmVxdWlyZSgnbnVtZXJhbCcpO1xuXG5pbXBvcnQgeyBEb20sIFF1ZXJ5IH0gZnJvbSAndWkvZG9tJztcbmltcG9ydCB7IFN0cmluZ1ZhbHVlLCBCb29sVmFsdWUsIEZsb2F0VmFsdWUgfSBmcm9tICdjYXJkcy9tb2RlbC92YWx1ZSc7XG5cbmZ1bmN0aW9uIGFkZFN3YXBDbGFzc0ZyYWdtZW50KG5hbWUsIGNsYXNzTmFtZSA9IG5hbWUpIHtcblx0cmV0dXJuIGZ1bmN0aW9uKGZyYWdtZW50LCBkZWZhdWx0VmFsdWUgPSBmYWxzZSkge1xuXHRcdGZyYWdtZW50LmFkZFByb3BlcnR5VmFsdWUobmFtZSwgbmV3IEJvb2xWYWx1ZShkZWZhdWx0VmFsdWUpLCBmdW5jdGlvbih2YWx1ZSwgZWwpIHtcblx0XHRcdHJldHVybiBEb20uc3RyZWFtKHZhbHVlKS5hcHBseVN3YXBDbGFzcyhlbCwgY2xhc3NOYW1lKTtcblx0XHR9KTtcblx0fTtcbn1cblxuZnVuY3Rpb24gYWRkQXR0cmlidXRlRnJhZ21lbnQobmFtZSwgYXR0cmlidXRlKSB7XG5cdHJldHVybiBmdW5jdGlvbihmcmFnbWVudCwgdGV4dCA9IFwiXCIpIHtcblx0XHRmcmFnbWVudC5hZGRQcm9wZXJ0eVZhbHVlKG5hbWUsIG5ldyBTdHJpbmdWYWx1ZSh0ZXh0KSwgZnVuY3Rpb24odmFsdWUsIGVsKSB7XG5cdFx0XHRyZXR1cm4gRG9tLnN0cmVhbSh2YWx1ZSkuYXBwbHlBdHRyaWJ1dGUoYXR0cmlidXRlLCBlbCk7XG5cdFx0fSk7XG5cdH1cbn1cblxuZnVuY3Rpb24gY3JlYXRlVmFsdWUodHlwZSwgYSwgYiwgYywgZCwgZSkge1xuXHRzd2l0Y2godHlwZSkge1xuXHRcdGNhc2UgXCJTdHJpbmdcIjpcblx0XHRcdHJldHVybiBuZXcgU3RyaW5nVmFsdWUoYSwgYiwgYywgZCwgZSk7XG5cdFx0Y2FzZSBcIkJvb2xcIjpcblx0XHRcdHJldHVybiBuZXcgQm9vbFZhbHVlKGEsIGIsIGMsIGQsIGUpO1xuXHRcdGNhc2UgXCJGbG9hdFwiOlxuXHRcdFx0cmV0dXJuIG5ldyBGbG9hdFZhbHVlKGEsIGIsIGMsIGQsIGUpO1xuXHR9XG59XG5cbmxldCBwID0ge1xuXHR2YWx1ZTogZnVuY3Rpb24oZnJhZ21lbnQsIHR5cGUsIC4uLmFyZ3MpIHtcblx0XHRsZXQgdmFsdWUgPSB0eXBlb2YgdHlwZSA9PT0gXCJzdHJpbmdcIiA/IGNyZWF0ZVZhbHVlKHR5cGUsIC4uLmFyZ3MpIDogdHlwZTtcblx0XHRmcmFnbWVudC5hZGRQcm9wZXJ0eVZhbHVlKFwidmFsdWVcIiwgdmFsdWUsIGZ1bmN0aW9uKHZhbHVlLCBlbCkge1xuXHRcdFx0cmV0dXJuICgpID0+IHt9O1xuXHRcdH0pO1xuXHR9LFxuXHR0ZXh0OiBmdW5jdGlvbihmcmFnbWVudCwgdGV4dCA9IFwiXCIpIHtcblx0XHRmcmFnbWVudC5hZGRQcm9wZXJ0eVZhbHVlKFwidGV4dFwiLCBuZXcgU3RyaW5nVmFsdWUodGV4dCksIGZ1bmN0aW9uKHZhbHVlLCBlbCkge1xuXHRcdFx0bGV0IGNvbnRlbnQgPSBRdWVyeS5maXJzdCgnLmNvbnRlbnQnLCBlbCk7XG5cdFx0XHRyZXR1cm4gRG9tLnN0cmVhbSh2YWx1ZSkuYXBwbHlUZXh0KGNvbnRlbnQpO1xuXHRcdH0pO1xuXHR9LFxuXHR2aXNpYmxlOiBmdW5jdGlvbihmcmFnbWVudCwgZGVmYXVsdFZhbHVlID0gdHJ1ZSkge1xuXHRcdGZyYWdtZW50LmFkZFByb3BlcnR5VmFsdWUoXCJ2aXNpYmxlXCIsIG5ldyBCb29sVmFsdWUoZGVmYXVsdFZhbHVlKSwgZnVuY3Rpb24odmFsdWUsIGVsKSB7XG5cdFx0XHRyZXR1cm4gRG9tLnN0cmVhbSh2YWx1ZSkuYXBwbHlEaXNwbGF5KGVsKTtcblx0XHR9KTtcblx0fSxcblx0c3Ryb25nOiBhZGRTd2FwQ2xhc3NGcmFnbWVudCgnc3Ryb25nJyksXG5cdGVtcGhhc2lzOiBhZGRTd2FwQ2xhc3NGcmFnbWVudCgnZW1waGFzaXMnKSxcblx0c3RyaWtlOiBhZGRTd2FwQ2xhc3NGcmFnbWVudCgnc3RyaWtlJyksXG5cdHRvb2x0aXA6IGFkZEF0dHJpYnV0ZUZyYWdtZW50KCd0b29sdGlwJywgJ3RpdGxlJyksXG5cdGxpbms6IGZ1bmN0aW9uKGZyYWdtZW50LCB1cmwgPSBcIlwiKSB7XG5cdFx0ZnJhZ21lbnQuYWRkUHJvcGVydHlWYWx1ZShcImxpbmtcIiwgbmV3IFN0cmluZ1ZhbHVlKHVybCksIGZ1bmN0aW9uKHZhbHVlLCBlbCkge1xuXHRcdFx0bGV0IGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyksXG5cdFx0XHRcdMaSID0gKHVybCkgPT4gYS5ocmVmID0gdXJsO1xuXHRcdFx0YS50YXJnZXQgPSBcIl9ibGFua1wiO1xuXHRcdFx0Zm9yKGxldCBpID0gMDsgaSA8IGVsLmNoaWxkTm9kZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0YS5hcHBlbmRDaGlsZChlbC5jaGlsZE5vZGVzW2ldKTtcblx0XHRcdH1cblx0XHRcdGVsLmFwcGVuZENoaWxkKGEpO1xuXHRcdFx0dmFsdWUuc3Vic2NyaWJlKMaSKTtcblx0XHRcdHJldHVybiAoKSA9PiB7XG5cdFx0XHRcdHZhbHVlLnVuc3Vic2NyaWJlKMaSKTtcblx0XHRcdFx0ZWwucmVtb3ZlQ2hpbGQoYSk7XG5cdFx0XHRcdGZvcihsZXQgaSA9IDA7IGkgPCBhLmNoaWxkTm9kZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRlbC5hcHBlbmRDaGlsZChhLmNoaWxkTm9kZXNbaV0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdH0pO1xuXHR9XG59O1xuXG5sZXQgUHJvcGVydGllcyA9IHtcblx0YWRkTnVtZXJpY0Zvcm1hdChmcmFnbWVudCwgZGVmYXVsdEZvcm1hdCA9IFwiXCIpIHtcblx0XHRsZXQgdmFsdWUgPSBmcmFnbWVudC5wcm9wZXJ0aWVzLnZhbHVlLFxuXHRcdFx0dGV4dCAgPSBmcmFnbWVudC5wcm9wZXJ0aWVzLnRleHQ7XG5cdFx0aWYoIXZhbHVlKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCInZm9ybWF0JyByZXF1aXJlcyB0aGUgcHJvcGVydHkgJ3ZhbHVlJ1wiKTtcblx0XHR9XG5cdFx0aWYoIXRleHQpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihcIidmb3JtYXQnIHJlcXVpcmVzIHRoZSBwcm9wZXJ0eSAndGV4dCdcIik7XG5cdFx0fVxuXHRcdGZyYWdtZW50LmFkZFByb3BlcnR5VmFsdWUoXCJmb3JtYXRcIiwgbmV3IFN0cmluZ1ZhbHVlKGRlZmF1bHRGb3JtYXQpLCBmdW5jdGlvbihmb3JtYXQpIHtcblx0XHRcdGxldCBzdHJlYW0gPSB2YWx1ZS56aXAoZm9ybWF0KTtcblx0XHRcdHN0cmVhbS5zcHJlYWQoKHZhbHVlLCBmb3JtYXQpID0+IHtcblx0XHRcdFx0XHRpZihmb3JtYXQgPT09IFwiXCIpIHtcblx0XHRcdFx0XHRcdGZvcm1hdCA9IE1hdGguZmxvb3IodmFsdWUpID09PSB2YWx1ZSA/IFwiMCwwXCIgOiBcIjAsMC4wMDBcIjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dGV4dC52YWx1ZSA9IG51bWVyYWwodmFsdWUpLmZvcm1hdChmb3JtYXQpO1xuXHRcdFx0XHR9KTtcblx0XHRcdHJldHVybiBzdHJlYW0uY2FuY2VsLmJpbmQoc3RyZWFtKTtcblx0XHR9KTtcblx0fSxcblx0cmVtb3ZlRm9ybWF0KGZyYWdtZW50KSB7XG5cdFx0ZnJhZ21lbnQucmVtb3ZlUHJvcGVydHkoJ2Zvcm1hdCcpO1xuXHR9XG59XG5cbmZvcihsZXQgbmFtZSBpbiBwKSB7XG5cdGxldCBjYXAgICAgICAgPSBzdHJpbmcobmFtZSkuY2FwaXRhbGl6ZSgpLnMsXG5cdFx0a2V5UmVtb3ZlID0gJ3JlbW92ZScgKyBjYXAsXG5cdFx0a2V5QWRkICAgID0gJ2FkZCcgKyBjYXA7XG5cdFByb3BlcnRpZXNba2V5QWRkXSA9IHBbbmFtZV07XG5cdFByb3BlcnRpZXNba2V5UmVtb3ZlXSA9IGZ1bmN0aW9uKGZyYWdtZW50KSB7IGZyYWdtZW50LnJlbW92ZVByb3BlcnR5KG5hbWUpOyB9O1xufVxuXG5leHBvcnQgeyBQcm9wZXJ0aWVzIH07IiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG5cbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxucHJvY2Vzcy5uZXh0VGljayA9IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNhblNldEltbWVkaWF0ZSA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnXG4gICAgJiYgd2luZG93LnNldEltbWVkaWF0ZTtcbiAgICB2YXIgY2FuUG9zdCA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnXG4gICAgJiYgd2luZG93LnBvc3RNZXNzYWdlICYmIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyXG4gICAgO1xuXG4gICAgaWYgKGNhblNldEltbWVkaWF0ZSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGYpIHsgcmV0dXJuIHdpbmRvdy5zZXRJbW1lZGlhdGUoZikgfTtcbiAgICB9XG5cbiAgICBpZiAoY2FuUG9zdCkge1xuICAgICAgICB2YXIgcXVldWUgPSBbXTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBmdW5jdGlvbiAoZXYpIHtcbiAgICAgICAgICAgIHZhciBzb3VyY2UgPSBldi5zb3VyY2U7XG4gICAgICAgICAgICBpZiAoKHNvdXJjZSA9PT0gd2luZG93IHx8IHNvdXJjZSA9PT0gbnVsbCkgJiYgZXYuZGF0YSA9PT0gJ3Byb2Nlc3MtdGljaycpIHtcbiAgICAgICAgICAgICAgICBldi5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICBpZiAocXVldWUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZm4gPSBxdWV1ZS5zaGlmdCgpO1xuICAgICAgICAgICAgICAgICAgICBmbigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgdHJ1ZSk7XG5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIG5leHRUaWNrKGZuKSB7XG4gICAgICAgICAgICBxdWV1ZS5wdXNoKGZuKTtcbiAgICAgICAgICAgIHdpbmRvdy5wb3N0TWVzc2FnZSgncHJvY2Vzcy10aWNrJywgJyonKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gbmV4dFRpY2soZm4pIHtcbiAgICAgICAgc2V0VGltZW91dChmbiwgMCk7XG4gICAgfTtcbn0pKCk7XG5cbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59XG5cbi8vIFRPRE8oc2h0eWxtYW4pXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbiIsImltcG9ydCBUaW1lciBmcm9tICd1aS90aW1lcic7XG5cbmxldCBfbGlzdGVuZXJzID0gU3ltYm9sKCk7XG5cbmNsYXNzIFNvdXJjZSB7XG5cdGNvbnN0cnVjdG9yKGNhbGxiYWNrKSB7XG5cdFx0Ly8gVE9ETywgcmVwbGFjZSB3aXRoIE1hcCBvciBXZWFrTWFwP1xuXHRcdHRoaXNbX2xpc3RlbmVyc10gPSBbXTtcblx0XHQvLyBUT0RPLCBkZWxheSBidXQgZG9uJ3QgcmVkdWNlXG5cdFx0bGV0IHNpbmsgPSAodmFsdWUpID0+IHtcblx0XHRcdFRpbWVyLmltbWVkaWF0ZSgoKSA9PiB7XG5cdFx0XHRcdHRoaXNbX2xpc3RlbmVyc10ubWFwKMaSID0+IMaSKHZhbHVlKSk7XG5cdFx0XHR9KTtcblx0XHR9O1xuXHRcdGNhbGxiYWNrKHNpbmspO1xuXHR9XG5cdGNhbmNlbCgpIHtcblx0XHR0aGlzW19saXN0ZW5lcnNdID0gW107XG5cdH1cblx0c3Vic2NyaWJlKMaSKSB7XG5cdFx0dGhpc1tfbGlzdGVuZXJzXS5wdXNoKMaSKTtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXHR1bnN1YnNjcmliZSjGkikge1xuXHRcdHRoaXNbX2xpc3RlbmVyc10uc3BsaWNlKHRoaXNbX2xpc3RlbmVyc10uaW5kZXhPZijGkiksIDEpO1xuXHR9XG5cdG1hcCjGkikge1xuXHRcdHJldHVybiBTdHJlYW0ubWFwKHRoaXMsIMaSKTtcblx0fVxuXHRmaWx0ZXIoxpIpIHtcblx0XHRyZXR1cm4gU3RyZWFtLmZpbHRlcih0aGlzLCDGkik7XG5cdH1cblx0dW5pcXVlKCkge1xuXHRcdHJldHVybiBTdHJlYW0udW5pcXVlKHRoaXMpO1xuXHR9XG5cdGxvZyhwcmVmaXgpIHtcblx0XHRyZXR1cm4gU3RyZWFtLmxvZyh0aGlzLCBwcmVmaXgpO1xuXHR9XG5cdHRvQm9vbCgpIHtcblx0XHRyZXR1cm4gU3RyZWFtLnRvQm9vbCh0aGlzKTtcblx0fVxuXHRuZWdhdGUoKSB7XG5cdFx0cmV0dXJuIFN0cmVhbS5uZWdhdGUodGhpcyk7XG5cdH1cblx0emlwKC4uLm90aGVycykge1xuXHRcdHJldHVybiBTdHJlYW0uemlwKHRoaXMsIC4uLm90aGVycyk7XG5cdH1cblx0c3ByZWFkKMaSKSB7XG5cdFx0cmV0dXJuIFN0cmVhbS5zcHJlYWQodGhpcywgxpIpO1xuXHR9XG5cdGZsYXRNYXAoKSB7XG5cdFx0cmV0dXJuIFN0cmVhbS5mbGF0TWFwKHRoaXMpO1xuXHR9XG5cdG1lcmdlKC4uLm90aGVycykge1xuXHRcdHJldHVybiBTdHJlYW0ubWVyZ2UodGhpcywgLi4ub3RoZXJzKTtcblx0fVxuXHRyZWR1Y2UoYWNjLCDGkikge1xuXHRcdHJldHVybiBTdHJlYW0ucmVkdWNlKHRoaXMsIGFjYywgxpIpO1xuXHR9XG5cdGZlZWQoZGVzdFZhbHVlKSB7XG5cdFx0cmV0dXJuIFN0cmVhbS5mZWVkKHRoaXMsIGRlc3RWYWx1ZSk7XG5cdH1cbn1cblxuY2xhc3MgUHVzaFNvdXJjZSBleHRlbmRzIFNvdXJjZSB7XG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHN1cGVyKChzaW5rKSA9PiB0aGlzLnB1c2ggPSBzaW5rKTtcblx0fVxufVxuXG5jbGFzcyBDYW5jZWxhYmxlU291cmNlIGV4dGVuZHMgUHVzaFNvdXJjZSB7XG5cdGNvbnN0cnVjdG9yKGNhbmNlbMaSKSB7XG5cdFx0c3VwZXIoKTtcblx0XHR0aGlzLmNhbmNlbCA9IGNhbmNlbMaSLmJpbmQodGhpcyk7XG5cdH1cblx0Y2FuY2VsT24oc291cmNlKSB7XG5cdFx0c291cmNlLnN1YnNjcmliZSh0aGlzLmNhbmNlbCk7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cbn1cblxubGV0IFN0cmVhbSA9IHtcblx0bWFwKHNvdXJjZSwgxpIpIHtcblx0XHRsZXQgc3RyZWFtID0gbmV3IFB1c2hTb3VyY2UoKTtcblx0XHRzb3VyY2Uuc3Vic2NyaWJlKCh2YWx1ZSkgPT4ge1xuXHRcdFx0c3RyZWFtLnB1c2goxpIodmFsdWUpKTtcblx0XHR9KTtcblx0XHRyZXR1cm4gc3RyZWFtO1xuXHR9LFxuXHRmaWx0ZXIoc291cmNlLCDGkikge1xuXHRcdGxldCBzdHJlYW0gPSBuZXcgUHVzaFNvdXJjZSgpO1xuXHRcdHNvdXJjZS5zdWJzY3JpYmUoKHZhbHVlKSA9PiB7XG5cdFx0XHRpZijGkih2YWx1ZSkpXG5cdFx0XHRcdHN0cmVhbS5wdXNoKHZhbHVlKTtcblx0XHR9KTtcblx0XHRyZXR1cm4gc3RyZWFtO1xuXHR9LFxuXHR1bmlxdWUoc291cmNlKSB7XG5cdFx0cmV0dXJuIHRoaXMuZmlsdGVyKHNvdXJjZSwgKGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIGxhc3Q7XG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24odikge1xuXHRcdFx0XHRpZihsYXN0ICE9PSB2KSB7XG5cdFx0XHRcdFx0bGFzdCA9IHY7XG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdH0pKCkpO1xuXHR9LFxuXHR0b0Jvb2woc291cmNlKSB7XG5cdFx0cmV0dXJuIHRoaXMubWFwKHNvdXJjZSwgKHYpID0+ICEhdik7XG5cdH0sXG5cdG5lZ2F0ZShzb3VyY2UpIHtcblx0XHRyZXR1cm4gdGhpcy5tYXAoc291cmNlLCAodikgPT4gIXYpO1xuXHR9LFxuXHRsb2coc291cmNlLCBwcmVmaXgpIHtcblx0XHRyZXR1cm4gdGhpcy5tYXAoc291cmNlLCAodikgPT4ge1xuXHRcdFx0aWYocHJlZml4KVxuXHRcdFx0XHRjb25zb2xlLmxvZyhwcmVmaXgsIHYpO1xuXHRcdFx0ZWxzZVxuXHRcdFx0XHRjb25zb2xlLmxvZyh2KTtcblx0XHRcdHJldHVybiB2O1xuXHRcdH0pO1xuXHR9LFxuXHR6aXAoLi4uc291cmNlcykge1xuXHRcdGxldCBsZW5ndGggPSBzb3VyY2VzLmxlbmd0aCxcblx0XHRcdHN0cmVhbSA9IG5ldyBQdXNoU291cmNlKCksXG5cdFx0XHR2YWx1ZXMgPSBuZXcgQXJyYXkobGVuZ3RoKSxcblx0XHRcdGZsYWdzICA9IG5ldyBBcnJheShsZW5ndGgpLFxuXHRcdFx0dXBkYXRlID0gKCkgPT4ge1xuXHRcdFx0XHRpZihmbGFncy5maWx0ZXIoKHYpID0+IHYpLmxlbmd0aCA9PT0gbGVuZ3RoKSB7XG5cdFx0XHRcdFx0dXBkYXRlID0gKCkgPT4gc3RyZWFtLnB1c2godmFsdWVzKTtcblx0XHRcdFx0XHR1cGRhdGUoKTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblxuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuXHRcdFx0KChpKSA9PiB7XG5cdFx0XHRcdHNvdXJjZXNbaV0uc3Vic2NyaWJlKCh2KSA9PiB7XG5cdFx0XHRcdFx0dmFsdWVzW2ldID0gdjtcblx0XHRcdFx0XHRmbGFnc1tpXSA9IHRydWU7XG5cdFx0XHRcdFx0dXBkYXRlKCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSkoaSk7XG5cdFx0fVxuXHRcdHJldHVybiBzdHJlYW07XG5cdH0sXG5cdHNwcmVhZChzb3VyY2UsIMaSKSB7XG5cdFx0bGV0IHN0cmVhbSA9IG5ldyBQdXNoU291cmNlKCk7XG5cdFx0c291cmNlLnN1YnNjcmliZSgoYXJyKSA9PiB7XG5cdFx0XHRzdHJlYW0ucHVzaCjGki5hcHBseSh0aGlzLCBhcnIpKTtcblx0XHR9KTtcblx0XHRyZXR1cm4gc3RyZWFtO1xuXHR9LFxuXHRmbGF0TWFwKHNvdXJjZSkge1xuXHRcdGxldCBzdHJlYW0gPSBuZXcgUHVzaFNvdXJjZSgpO1xuXHRcdHNvdXJjZS5zdWJzY3JpYmUoKGFycikgPT4ge1xuXHRcdFx0Zm9yKGxldCB2IGluIGFycilcblx0XHRcdFx0c3RyZWFtLnB1c2godik7XG5cdFx0fSk7XG5cdFx0cmV0dXJuIHN0cmVhbTtcblx0fSxcblx0bWVyZ2UoLi4uc291cmNlcykge1xuXHRcdGxldCBzdHJlYW0gPSBuZXcgUHVzaFNvdXJjZSgpO1xuXHRcdGZvcihsZXQgc291cmNlIG9mIHNvdXJjZXMpIHtcblx0XHRcdHNvdXJjZS5zdWJzY3JpYmUoKHYpID0+IHtcblx0XHRcdFx0c3RyZWFtLnB1c2godik7XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0cmV0dXJuIHN0cmVhbTtcblx0fSxcblx0Ly8gVE9ETyBubyB3YXkgdG8gY2FuY2VsXG5cdGludGVydmFsKG1zKSB7XG5cdFx0bGV0IGlkLFxuXHRcdFx0c3RyZWFtID0gbmV3IENhbmNlbGFibGVTb3VyY2UoZnVuY3Rpb24oKSB7IGNsZWFySW50ZXJ2YWwoaWQpOyB9KTtcblx0XHRpZCA9IHNldEludGVydmFsKCgpID0+IHN0cmVhbS5wdXNoKCksIG1zKTtcblx0XHRyZXR1cm4gc3RyZWFtO1xuXHR9LFxuXHRkZWxheShtcykge1xuXHRcdGxldCBpZCxcblx0XHRcdHN0cmVhbSA9IG5ldyBDYW5jZWxhYmxlU291cmNlKGZ1bmN0aW9uKCkgeyBjbGVhclRpbWVvdXQoaWQpOyB9KTtcblx0XHRpZCA9IHNldFRpbWVvdXQoKCkgPT4gc3RyZWFtLnB1c2goKSwgbXMpO1xuXHRcdHJldHVybiBzdHJlYW07XG5cdH0sXG5cdHJlZHVjZShzb3VyY2UsIGFjYywgxpIpIHtcblx0XHRsZXQgc3RyZWFtID0gbmV3IFB1c2hTb3VyY2UoKTtcblx0XHRzb3VyY2Uuc3Vic2NyaWJlKCh2YWx1ZSkgPT4gc3RyZWFtLnB1c2goYWNjID0gxpIoYWNjLCB2YWx1ZSkpKTtcblx0XHRyZXR1cm4gc3RyZWFtO1xuXHR9LFxuXHRmZWVkKHNvdXJjZSwgZGVzdFZhbHVlKSB7XG5cdFx0bGV0IMaSID0gKHYpID0+IGRlc3RWYWx1ZS5zZXQodik7XG5cdFx0c291cmNlLnN1YnNjcmliZSjGkik7XG5cdFx0cmV0dXJuICgpID0+IHNvdXJjZS51bnN1YnNjcmliZSjGkik7XG5cdH1cbn1cblxuZXhwb3J0IHsgU3RyZWFtLCBTb3VyY2UsIFB1c2hTb3VyY2UgfTsiLCJpbXBvcnQgeyBTb3VyY2UsIFN0cmVhbSB9IGZyb20gJy4vc3RyZWFtJ1xuXG52YXIgX3ZhbHVlID0gU3ltYm9sKCksXG5cdF9kZWZhdWx0VmFsdWUgPSBTeW1ib2woKSxcblx0X3VwZGF0ZSA9IFN5bWJvbCgpO1xuXG5leHBvcnQgY2xhc3MgVmFsdWUgZXh0ZW5kcyBTb3VyY2Uge1xuXHRjb25zdHJ1Y3Rvcih2YWx1ZSwgZGVmYXVsdFZhbHVlKSB7XG5cdFx0bGV0IGNhbGxiYWNrID0gKHNpbmspID0+IHtcblx0XHRcdHRoaXNbX3VwZGF0ZV0gPSBzaW5rO1xuXHRcdH07XG5cdFx0c3VwZXIoY2FsbGJhY2spO1xuXHRcdHRoaXNbX2RlZmF1bHRWYWx1ZV0gPSBkZWZhdWx0VmFsdWU7XG5cdFx0dGhpc1tfdmFsdWVdID0gdmFsdWU7XG5cdH1cblx0c3Vic2NyaWJlKMaSKSB7XG5cdFx0xpIodGhpc1tfdmFsdWVdKTtcblx0XHRzdXBlci5zdWJzY3JpYmUoxpIpO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cdHNldCh2YWx1ZSkge1xuXHRcdGlmKHZhbHVlID09PSB0aGlzW192YWx1ZV0pXG5cdFx0XHRyZXR1cm47XG5cdFx0dGhpc1tfdmFsdWVdID0gdmFsdWU7XG5cdFx0dGhpc1tfdXBkYXRlXSh2YWx1ZSk7XG5cdH1cblx0Z2V0IHZhbHVlKCkge1xuXHRcdHJldHVybiB0aGlzW192YWx1ZV07XG5cdH1cblx0c2V0IHZhbHVlKHYpIHtcblx0XHR0aGlzLnNldCh2KTtcblx0fVxuXHRnZXQgaXNEZWZhdWx0KCkge1xuXHRcdHJldHVybiB0aGlzW192YWx1ZV0gPT09IHRoaXNbX2RlZmF1bHRWYWx1ZV07XG5cdH1cblx0cmVzZXQoKSB7XG5cdFx0dGhpcy52YWx1ZSA9IHRoaXNbX2RlZmF1bHRWYWx1ZV07XG5cdH1cbn1cblxuZXhwb3J0IGNsYXNzIFN0cmluZ1ZhbHVlIGV4dGVuZHMgVmFsdWUge1xuXHRjb25zdHJ1Y3Rvcih2YWx1ZSA9IFwiXCIsIGRlZmF1bHRWYWx1ZSA9IHZhbHVlKSB7XG5cdFx0c3VwZXIodmFsdWUsIGRlZmF1bHRWYWx1ZSk7XG5cdH1cblx0c2V0KHZhbHVlKSB7XG5cdFx0c3VwZXIuc2V0KCh2YWx1ZSAmJiB2YWx1ZS50b1N0cmluZyAmJiB2YWx1ZS50b1N0cmluZygpKSB8fCAodmFsdWUgJiYgKFwiXCIgKyB2YWx1ZSkpIHx8IFwiXCIpO1xuXHR9XG59XG5cbmV4cG9ydCBjbGFzcyBCb29sVmFsdWUgZXh0ZW5kcyBWYWx1ZSB7XG5cdGNvbnN0cnVjdG9yKHZhbHVlID0gZmFsc2UsIGRlZmF1bHRWYWx1ZSA9IHZhbHVlKSB7XG5cdFx0c3VwZXIodmFsdWUsIGRlZmF1bHRWYWx1ZSk7XG5cdH1cblx0c2V0KHZhbHVlKSB7XG5cdFx0c3VwZXIuc2V0KCEhdmFsdWUpO1xuXHR9XG5cdHRvZ2dsZSgpIHtcblx0XHR0aGlzLnNldCghdGhpcy52YWx1ZSk7XG5cdH1cbn1cblxuZXhwb3J0IGNsYXNzIEZsb2F0VmFsdWUgZXh0ZW5kcyBWYWx1ZSB7XG5cdGNvbnN0cnVjdG9yKHZhbHVlID0gMC4wLCBkZWZhdWx0VmFsdWUgPSB2YWx1ZSkge1xuXHRcdHN1cGVyKHZhbHVlLCBkZWZhdWx0VmFsdWUpO1xuXHR9XG5cdHNldCh2YWx1ZSkge1xuXHRcdHN1cGVyLnNldCgrbmV3IE51bWJlcih2YWx1ZSkpO1xuXHR9XG5cdGFzSW50KCkge1xuXHRcdHJldHVybiBTdHJlYW0ubWFwKHRoaXMsICh2KSA9PiBNYXRoLnJvdW5kKHYpKTtcblx0fVxufVxuXG52YXIgZGVmYXVsdERhdGUgPSBuZXcgRGF0ZShudWxsKTtcbmV4cG9ydCBjbGFzcyBEYXRlVmFsdWUgZXh0ZW5kcyBWYWx1ZSB7XG5cdGNvbnN0cnVjdG9yKHZhbHVlID0gZGVmYXVsdERhdGUsIGRlZmF1bHRWYWx1ZSA9IHZhbHVlKSB7XG5cdFx0c3VwZXIodmFsdWUsIGRlZmF1bHRWYWx1ZSk7XG5cdH1cblx0c2V0KHZhbHVlKSB7XG5cdFx0c3VwZXIuc2V0KG5ldyBEYXRlKHZhbHVlKSk7XG5cdH1cbn0iLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsKXtcbihmdW5jdGlvbihnbG9iYWwpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuICBpZiAoZ2xvYmFsLiR0cmFjZXVyUnVudGltZSkge1xuICAgIHJldHVybjtcbiAgfVxuICB2YXIgJE9iamVjdCA9IE9iamVjdDtcbiAgdmFyICRUeXBlRXJyb3IgPSBUeXBlRXJyb3I7XG4gIHZhciAkY3JlYXRlID0gJE9iamVjdC5jcmVhdGU7XG4gIHZhciAkZGVmaW5lUHJvcGVydGllcyA9ICRPYmplY3QuZGVmaW5lUHJvcGVydGllcztcbiAgdmFyICRkZWZpbmVQcm9wZXJ0eSA9ICRPYmplY3QuZGVmaW5lUHJvcGVydHk7XG4gIHZhciAkZnJlZXplID0gJE9iamVjdC5mcmVlemU7XG4gIHZhciAkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID0gJE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7XG4gIHZhciAkZ2V0T3duUHJvcGVydHlOYW1lcyA9ICRPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcztcbiAgdmFyICRnZXRQcm90b3R5cGVPZiA9ICRPYmplY3QuZ2V0UHJvdG90eXBlT2Y7XG4gIHZhciAkaGFzT3duUHJvcGVydHkgPSAkT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbiAgdmFyICR0b1N0cmluZyA9ICRPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuICBmdW5jdGlvbiBub25FbnVtKHZhbHVlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgd3JpdGFibGU6IHRydWVcbiAgICB9O1xuICB9XG4gIHZhciB0eXBlcyA9IHtcbiAgICB2b2lkOiBmdW5jdGlvbiB2b2lkVHlwZSgpIHt9LFxuICAgIGFueTogZnVuY3Rpb24gYW55KCkge30sXG4gICAgc3RyaW5nOiBmdW5jdGlvbiBzdHJpbmcoKSB7fSxcbiAgICBudW1iZXI6IGZ1bmN0aW9uIG51bWJlcigpIHt9LFxuICAgIGJvb2xlYW46IGZ1bmN0aW9uIGJvb2xlYW4oKSB7fVxuICB9O1xuICB2YXIgbWV0aG9kID0gbm9uRW51bTtcbiAgdmFyIGNvdW50ZXIgPSAwO1xuICBmdW5jdGlvbiBuZXdVbmlxdWVTdHJpbmcoKSB7XG4gICAgcmV0dXJuICdfXyQnICsgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMWU5KSArICckJyArICsrY291bnRlciArICckX18nO1xuICB9XG4gIHZhciBzeW1ib2xJbnRlcm5hbFByb3BlcnR5ID0gbmV3VW5pcXVlU3RyaW5nKCk7XG4gIHZhciBzeW1ib2xEZXNjcmlwdGlvblByb3BlcnR5ID0gbmV3VW5pcXVlU3RyaW5nKCk7XG4gIHZhciBzeW1ib2xEYXRhUHJvcGVydHkgPSBuZXdVbmlxdWVTdHJpbmcoKTtcbiAgdmFyIHN5bWJvbFZhbHVlcyA9ICRjcmVhdGUobnVsbCk7XG4gIGZ1bmN0aW9uIGlzU3ltYm9sKHN5bWJvbCkge1xuICAgIHJldHVybiB0eXBlb2Ygc3ltYm9sID09PSAnb2JqZWN0JyAmJiBzeW1ib2wgaW5zdGFuY2VvZiBTeW1ib2xWYWx1ZTtcbiAgfVxuICBmdW5jdGlvbiB0eXBlT2Yodikge1xuICAgIGlmIChpc1N5bWJvbCh2KSlcbiAgICAgIHJldHVybiAnc3ltYm9sJztcbiAgICByZXR1cm4gdHlwZW9mIHY7XG4gIH1cbiAgZnVuY3Rpb24gU3ltYm9sKGRlc2NyaXB0aW9uKSB7XG4gICAgdmFyIHZhbHVlID0gbmV3IFN5bWJvbFZhbHVlKGRlc2NyaXB0aW9uKTtcbiAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgU3ltYm9sKSlcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdTeW1ib2wgY2Fubm90IGJlIG5ld1xcJ2VkJyk7XG4gIH1cbiAgJGRlZmluZVByb3BlcnR5KFN5bWJvbC5wcm90b3R5cGUsICdjb25zdHJ1Y3RvcicsIG5vbkVudW0oU3ltYm9sKSk7XG4gICRkZWZpbmVQcm9wZXJ0eShTeW1ib2wucHJvdG90eXBlLCAndG9TdHJpbmcnLCBtZXRob2QoZnVuY3Rpb24oKSB7XG4gICAgdmFyIHN5bWJvbFZhbHVlID0gdGhpc1tzeW1ib2xEYXRhUHJvcGVydHldO1xuICAgIGlmICghZ2V0T3B0aW9uKCdzeW1ib2xzJykpXG4gICAgICByZXR1cm4gc3ltYm9sVmFsdWVbc3ltYm9sSW50ZXJuYWxQcm9wZXJ0eV07XG4gICAgaWYgKCFzeW1ib2xWYWx1ZSlcbiAgICAgIHRocm93IFR5cGVFcnJvcignQ29udmVyc2lvbiBmcm9tIHN5bWJvbCB0byBzdHJpbmcnKTtcbiAgICB2YXIgZGVzYyA9IHN5bWJvbFZhbHVlW3N5bWJvbERlc2NyaXB0aW9uUHJvcGVydHldO1xuICAgIGlmIChkZXNjID09PSB1bmRlZmluZWQpXG4gICAgICBkZXNjID0gJyc7XG4gICAgcmV0dXJuICdTeW1ib2woJyArIGRlc2MgKyAnKSc7XG4gIH0pKTtcbiAgJGRlZmluZVByb3BlcnR5KFN5bWJvbC5wcm90b3R5cGUsICd2YWx1ZU9mJywgbWV0aG9kKGZ1bmN0aW9uKCkge1xuICAgIHZhciBzeW1ib2xWYWx1ZSA9IHRoaXNbc3ltYm9sRGF0YVByb3BlcnR5XTtcbiAgICBpZiAoIXN5bWJvbFZhbHVlKVxuICAgICAgdGhyb3cgVHlwZUVycm9yKCdDb252ZXJzaW9uIGZyb20gc3ltYm9sIHRvIHN0cmluZycpO1xuICAgIGlmICghZ2V0T3B0aW9uKCdzeW1ib2xzJykpXG4gICAgICByZXR1cm4gc3ltYm9sVmFsdWVbc3ltYm9sSW50ZXJuYWxQcm9wZXJ0eV07XG4gICAgcmV0dXJuIHN5bWJvbFZhbHVlO1xuICB9KSk7XG4gIGZ1bmN0aW9uIFN5bWJvbFZhbHVlKGRlc2NyaXB0aW9uKSB7XG4gICAgdmFyIGtleSA9IG5ld1VuaXF1ZVN0cmluZygpO1xuICAgICRkZWZpbmVQcm9wZXJ0eSh0aGlzLCBzeW1ib2xEYXRhUHJvcGVydHksIHt2YWx1ZTogdGhpc30pO1xuICAgICRkZWZpbmVQcm9wZXJ0eSh0aGlzLCBzeW1ib2xJbnRlcm5hbFByb3BlcnR5LCB7dmFsdWU6IGtleX0pO1xuICAgICRkZWZpbmVQcm9wZXJ0eSh0aGlzLCBzeW1ib2xEZXNjcmlwdGlvblByb3BlcnR5LCB7dmFsdWU6IGRlc2NyaXB0aW9ufSk7XG4gICAgJGZyZWV6ZSh0aGlzKTtcbiAgICBzeW1ib2xWYWx1ZXNba2V5XSA9IHRoaXM7XG4gIH1cbiAgJGRlZmluZVByb3BlcnR5KFN5bWJvbFZhbHVlLnByb3RvdHlwZSwgJ2NvbnN0cnVjdG9yJywgbm9uRW51bShTeW1ib2wpKTtcbiAgJGRlZmluZVByb3BlcnR5KFN5bWJvbFZhbHVlLnByb3RvdHlwZSwgJ3RvU3RyaW5nJywge1xuICAgIHZhbHVlOiBTeW1ib2wucHJvdG90eXBlLnRvU3RyaW5nLFxuICAgIGVudW1lcmFibGU6IGZhbHNlXG4gIH0pO1xuICAkZGVmaW5lUHJvcGVydHkoU3ltYm9sVmFsdWUucHJvdG90eXBlLCAndmFsdWVPZicsIHtcbiAgICB2YWx1ZTogU3ltYm9sLnByb3RvdHlwZS52YWx1ZU9mLFxuICAgIGVudW1lcmFibGU6IGZhbHNlXG4gIH0pO1xuICAkZnJlZXplKFN5bWJvbFZhbHVlLnByb3RvdHlwZSk7XG4gIFN5bWJvbC5pdGVyYXRvciA9IFN5bWJvbCgpO1xuICBmdW5jdGlvbiB0b1Byb3BlcnR5KG5hbWUpIHtcbiAgICBpZiAoaXNTeW1ib2wobmFtZSkpXG4gICAgICByZXR1cm4gbmFtZVtzeW1ib2xJbnRlcm5hbFByb3BlcnR5XTtcbiAgICByZXR1cm4gbmFtZTtcbiAgfVxuICBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eU5hbWVzKG9iamVjdCkge1xuICAgIHZhciBydiA9IFtdO1xuICAgIHZhciBuYW1lcyA9ICRnZXRPd25Qcm9wZXJ0eU5hbWVzKG9iamVjdCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuYW1lcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIG5hbWUgPSBuYW1lc1tpXTtcbiAgICAgIGlmICghc3ltYm9sVmFsdWVzW25hbWVdKVxuICAgICAgICBydi5wdXNoKG5hbWUpO1xuICAgIH1cbiAgICByZXR1cm4gcnY7XG4gIH1cbiAgZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iamVjdCwgbmFtZSkge1xuICAgIHJldHVybiAkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iamVjdCwgdG9Qcm9wZXJ0eShuYW1lKSk7XG4gIH1cbiAgZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlTeW1ib2xzKG9iamVjdCkge1xuICAgIHZhciBydiA9IFtdO1xuICAgIHZhciBuYW1lcyA9ICRnZXRPd25Qcm9wZXJ0eU5hbWVzKG9iamVjdCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuYW1lcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHN5bWJvbCA9IHN5bWJvbFZhbHVlc1tuYW1lc1tpXV07XG4gICAgICBpZiAoc3ltYm9sKVxuICAgICAgICBydi5wdXNoKHN5bWJvbCk7XG4gICAgfVxuICAgIHJldHVybiBydjtcbiAgfVxuICBmdW5jdGlvbiBoYXNPd25Qcm9wZXJ0eShuYW1lKSB7XG4gICAgcmV0dXJuICRoYXNPd25Qcm9wZXJ0eS5jYWxsKHRoaXMsIHRvUHJvcGVydHkobmFtZSkpO1xuICB9XG4gIGZ1bmN0aW9uIGdldE9wdGlvbihuYW1lKSB7XG4gICAgcmV0dXJuIGdsb2JhbC50cmFjZXVyICYmIGdsb2JhbC50cmFjZXVyLm9wdGlvbnNbbmFtZV07XG4gIH1cbiAgZnVuY3Rpb24gc2V0UHJvcGVydHkob2JqZWN0LCBuYW1lLCB2YWx1ZSkge1xuICAgIHZhciBzeW0sXG4gICAgICAgIGRlc2M7XG4gICAgaWYgKGlzU3ltYm9sKG5hbWUpKSB7XG4gICAgICBzeW0gPSBuYW1lO1xuICAgICAgbmFtZSA9IG5hbWVbc3ltYm9sSW50ZXJuYWxQcm9wZXJ0eV07XG4gICAgfVxuICAgIG9iamVjdFtuYW1lXSA9IHZhbHVlO1xuICAgIGlmIChzeW0gJiYgKGRlc2MgPSAkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iamVjdCwgbmFtZSkpKVxuICAgICAgJGRlZmluZVByb3BlcnR5KG9iamVjdCwgbmFtZSwge2VudW1lcmFibGU6IGZhbHNlfSk7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIGZ1bmN0aW9uIGRlZmluZVByb3BlcnR5KG9iamVjdCwgbmFtZSwgZGVzY3JpcHRvcikge1xuICAgIGlmIChpc1N5bWJvbChuYW1lKSkge1xuICAgICAgaWYgKGRlc2NyaXB0b3IuZW51bWVyYWJsZSkge1xuICAgICAgICBkZXNjcmlwdG9yID0gJGNyZWF0ZShkZXNjcmlwdG9yLCB7ZW51bWVyYWJsZToge3ZhbHVlOiBmYWxzZX19KTtcbiAgICAgIH1cbiAgICAgIG5hbWUgPSBuYW1lW3N5bWJvbEludGVybmFsUHJvcGVydHldO1xuICAgIH1cbiAgICAkZGVmaW5lUHJvcGVydHkob2JqZWN0LCBuYW1lLCBkZXNjcmlwdG9yKTtcbiAgICByZXR1cm4gb2JqZWN0O1xuICB9XG4gIGZ1bmN0aW9uIHBvbHlmaWxsT2JqZWN0KE9iamVjdCkge1xuICAgICRkZWZpbmVQcm9wZXJ0eShPYmplY3QsICdkZWZpbmVQcm9wZXJ0eScsIHt2YWx1ZTogZGVmaW5lUHJvcGVydHl9KTtcbiAgICAkZGVmaW5lUHJvcGVydHkoT2JqZWN0LCAnZ2V0T3duUHJvcGVydHlOYW1lcycsIHt2YWx1ZTogZ2V0T3duUHJvcGVydHlOYW1lc30pO1xuICAgICRkZWZpbmVQcm9wZXJ0eShPYmplY3QsICdnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3InLCB7dmFsdWU6IGdldE93blByb3BlcnR5RGVzY3JpcHRvcn0pO1xuICAgICRkZWZpbmVQcm9wZXJ0eShPYmplY3QucHJvdG90eXBlLCAnaGFzT3duUHJvcGVydHknLCB7dmFsdWU6IGhhc093blByb3BlcnR5fSk7XG4gICAgT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyA9IGdldE93blByb3BlcnR5U3ltYm9scztcbiAgICBmdW5jdGlvbiBpcyhsZWZ0LCByaWdodCkge1xuICAgICAgaWYgKGxlZnQgPT09IHJpZ2h0KVxuICAgICAgICByZXR1cm4gbGVmdCAhPT0gMCB8fCAxIC8gbGVmdCA9PT0gMSAvIHJpZ2h0O1xuICAgICAgcmV0dXJuIGxlZnQgIT09IGxlZnQgJiYgcmlnaHQgIT09IHJpZ2h0O1xuICAgIH1cbiAgICAkZGVmaW5lUHJvcGVydHkoT2JqZWN0LCAnaXMnLCBtZXRob2QoaXMpKTtcbiAgICBmdW5jdGlvbiBhc3NpZ24odGFyZ2V0LCBzb3VyY2UpIHtcbiAgICAgIHZhciBwcm9wcyA9ICRnZXRPd25Qcm9wZXJ0eU5hbWVzKHNvdXJjZSk7XG4gICAgICB2YXIgcCxcbiAgICAgICAgICBsZW5ndGggPSBwcm9wcy5sZW5ndGg7XG4gICAgICBmb3IgKHAgPSAwOyBwIDwgbGVuZ3RoOyBwKyspIHtcbiAgICAgICAgdGFyZ2V0W3Byb3BzW3BdXSA9IHNvdXJjZVtwcm9wc1twXV07XG4gICAgICB9XG4gICAgICByZXR1cm4gdGFyZ2V0O1xuICAgIH1cbiAgICAkZGVmaW5lUHJvcGVydHkoT2JqZWN0LCAnYXNzaWduJywgbWV0aG9kKGFzc2lnbikpO1xuICAgIGZ1bmN0aW9uIG1peGluKHRhcmdldCwgc291cmNlKSB7XG4gICAgICB2YXIgcHJvcHMgPSAkZ2V0T3duUHJvcGVydHlOYW1lcyhzb3VyY2UpO1xuICAgICAgdmFyIHAsXG4gICAgICAgICAgZGVzY3JpcHRvcixcbiAgICAgICAgICBsZW5ndGggPSBwcm9wcy5sZW5ndGg7XG4gICAgICBmb3IgKHAgPSAwOyBwIDwgbGVuZ3RoOyBwKyspIHtcbiAgICAgICAgZGVzY3JpcHRvciA9ICRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Ioc291cmNlLCBwcm9wc1twXSk7XG4gICAgICAgICRkZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIHByb3BzW3BdLCBkZXNjcmlwdG9yKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgfVxuICAgICRkZWZpbmVQcm9wZXJ0eShPYmplY3QsICdtaXhpbicsIG1ldGhvZChtaXhpbikpO1xuICB9XG4gIGZ1bmN0aW9uIGV4cG9ydFN0YXIob2JqZWN0KSB7XG4gICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBuYW1lcyA9ICRnZXRPd25Qcm9wZXJ0eU5hbWVzKGFyZ3VtZW50c1tpXSk7XG4gICAgICBmb3IgKHZhciBqID0gMDsgaiA8IG5hbWVzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgIChmdW5jdGlvbihtb2QsIG5hbWUpIHtcbiAgICAgICAgICAkZGVmaW5lUHJvcGVydHkob2JqZWN0LCBuYW1lLCB7XG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICByZXR1cm4gbW9kW25hbWVdO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSkoYXJndW1lbnRzW2ldLCBuYW1lc1tqXSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvYmplY3Q7XG4gIH1cbiAgZnVuY3Rpb24gdG9PYmplY3QodmFsdWUpIHtcbiAgICBpZiAodmFsdWUgPT0gbnVsbClcbiAgICAgIHRocm93ICRUeXBlRXJyb3IoKTtcbiAgICByZXR1cm4gJE9iamVjdCh2YWx1ZSk7XG4gIH1cbiAgZnVuY3Rpb24gc3ByZWFkKCkge1xuICAgIHZhciBydiA9IFtdLFxuICAgICAgICBrID0gMDtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHZhbHVlVG9TcHJlYWQgPSB0b09iamVjdChhcmd1bWVudHNbaV0pO1xuICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCB2YWx1ZVRvU3ByZWFkLmxlbmd0aDsgaisrKSB7XG4gICAgICAgIHJ2W2srK10gPSB2YWx1ZVRvU3ByZWFkW2pdO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcnY7XG4gIH1cbiAgZnVuY3Rpb24gZ2V0UHJvcGVydHlEZXNjcmlwdG9yKG9iamVjdCwgbmFtZSkge1xuICAgIHdoaWxlIChvYmplY3QgIT09IG51bGwpIHtcbiAgICAgIHZhciByZXN1bHQgPSAkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iamVjdCwgbmFtZSk7XG4gICAgICBpZiAocmVzdWx0KVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgb2JqZWN0ID0gJGdldFByb3RvdHlwZU9mKG9iamVjdCk7XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbiAgZnVuY3Rpb24gc3VwZXJEZXNjcmlwdG9yKGhvbWVPYmplY3QsIG5hbWUpIHtcbiAgICB2YXIgcHJvdG8gPSAkZ2V0UHJvdG90eXBlT2YoaG9tZU9iamVjdCk7XG4gICAgaWYgKCFwcm90bylcbiAgICAgIHRocm93ICRUeXBlRXJyb3IoJ3N1cGVyIGlzIG51bGwnKTtcbiAgICByZXR1cm4gZ2V0UHJvcGVydHlEZXNjcmlwdG9yKHByb3RvLCBuYW1lKTtcbiAgfVxuICBmdW5jdGlvbiBzdXBlckNhbGwoc2VsZiwgaG9tZU9iamVjdCwgbmFtZSwgYXJncykge1xuICAgIHZhciBkZXNjcmlwdG9yID0gc3VwZXJEZXNjcmlwdG9yKGhvbWVPYmplY3QsIG5hbWUpO1xuICAgIGlmIChkZXNjcmlwdG9yKSB7XG4gICAgICBpZiAoJ3ZhbHVlJyBpbiBkZXNjcmlwdG9yKVxuICAgICAgICByZXR1cm4gZGVzY3JpcHRvci52YWx1ZS5hcHBseShzZWxmLCBhcmdzKTtcbiAgICAgIGlmIChkZXNjcmlwdG9yLmdldClcbiAgICAgICAgcmV0dXJuIGRlc2NyaXB0b3IuZ2V0LmNhbGwoc2VsZikuYXBwbHkoc2VsZiwgYXJncyk7XG4gICAgfVxuICAgIHRocm93ICRUeXBlRXJyb3IoXCJzdXBlciBoYXMgbm8gbWV0aG9kICdcIiArIG5hbWUgKyBcIicuXCIpO1xuICB9XG4gIGZ1bmN0aW9uIHN1cGVyR2V0KHNlbGYsIGhvbWVPYmplY3QsIG5hbWUpIHtcbiAgICB2YXIgZGVzY3JpcHRvciA9IHN1cGVyRGVzY3JpcHRvcihob21lT2JqZWN0LCBuYW1lKTtcbiAgICBpZiAoZGVzY3JpcHRvcikge1xuICAgICAgaWYgKGRlc2NyaXB0b3IuZ2V0KVxuICAgICAgICByZXR1cm4gZGVzY3JpcHRvci5nZXQuY2FsbChzZWxmKTtcbiAgICAgIGVsc2UgaWYgKCd2YWx1ZScgaW4gZGVzY3JpcHRvcilcbiAgICAgICAgcmV0dXJuIGRlc2NyaXB0b3IudmFsdWU7XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbiAgZnVuY3Rpb24gc3VwZXJTZXQoc2VsZiwgaG9tZU9iamVjdCwgbmFtZSwgdmFsdWUpIHtcbiAgICB2YXIgZGVzY3JpcHRvciA9IHN1cGVyRGVzY3JpcHRvcihob21lT2JqZWN0LCBuYW1lKTtcbiAgICBpZiAoZGVzY3JpcHRvciAmJiBkZXNjcmlwdG9yLnNldCkge1xuICAgICAgZGVzY3JpcHRvci5zZXQuY2FsbChzZWxmLCB2YWx1ZSk7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuICAgIHRocm93ICRUeXBlRXJyb3IoXCJzdXBlciBoYXMgbm8gc2V0dGVyICdcIiArIG5hbWUgKyBcIicuXCIpO1xuICB9XG4gIGZ1bmN0aW9uIGdldERlc2NyaXB0b3JzKG9iamVjdCkge1xuICAgIHZhciBkZXNjcmlwdG9ycyA9IHt9LFxuICAgICAgICBuYW1lLFxuICAgICAgICBuYW1lcyA9ICRnZXRPd25Qcm9wZXJ0eU5hbWVzKG9iamVjdCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuYW1lcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIG5hbWUgPSBuYW1lc1tpXTtcbiAgICAgIGRlc2NyaXB0b3JzW25hbWVdID0gJGdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmplY3QsIG5hbWUpO1xuICAgIH1cbiAgICByZXR1cm4gZGVzY3JpcHRvcnM7XG4gIH1cbiAgZnVuY3Rpb24gY3JlYXRlQ2xhc3MoY3Rvciwgb2JqZWN0LCBzdGF0aWNPYmplY3QsIHN1cGVyQ2xhc3MpIHtcbiAgICAkZGVmaW5lUHJvcGVydHkob2JqZWN0LCAnY29uc3RydWN0b3InLCB7XG4gICAgICB2YWx1ZTogY3RvcixcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgd3JpdGFibGU6IHRydWVcbiAgICB9KTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDMpIHtcbiAgICAgIGlmICh0eXBlb2Ygc3VwZXJDbGFzcyA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgY3Rvci5fX3Byb3RvX18gPSBzdXBlckNsYXNzO1xuICAgICAgY3Rvci5wcm90b3R5cGUgPSAkY3JlYXRlKGdldFByb3RvUGFyZW50KHN1cGVyQ2xhc3MpLCBnZXREZXNjcmlwdG9ycyhvYmplY3QpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY3Rvci5wcm90b3R5cGUgPSBvYmplY3Q7XG4gICAgfVxuICAgICRkZWZpbmVQcm9wZXJ0eShjdG9yLCAncHJvdG90eXBlJywge1xuICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgIHdyaXRhYmxlOiBmYWxzZVxuICAgIH0pO1xuICAgIHJldHVybiAkZGVmaW5lUHJvcGVydGllcyhjdG9yLCBnZXREZXNjcmlwdG9ycyhzdGF0aWNPYmplY3QpKTtcbiAgfVxuICBmdW5jdGlvbiBnZXRQcm90b1BhcmVudChzdXBlckNsYXNzKSB7XG4gICAgaWYgKHR5cGVvZiBzdXBlckNsYXNzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB2YXIgcHJvdG90eXBlID0gc3VwZXJDbGFzcy5wcm90b3R5cGU7XG4gICAgICBpZiAoJE9iamVjdChwcm90b3R5cGUpID09PSBwcm90b3R5cGUgfHwgcHJvdG90eXBlID09PSBudWxsKVxuICAgICAgICByZXR1cm4gc3VwZXJDbGFzcy5wcm90b3R5cGU7XG4gICAgfVxuICAgIGlmIChzdXBlckNsYXNzID09PSBudWxsKVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcigpO1xuICB9XG4gIGZ1bmN0aW9uIGRlZmF1bHRTdXBlckNhbGwoc2VsZiwgaG9tZU9iamVjdCwgYXJncykge1xuICAgIGlmICgkZ2V0UHJvdG90eXBlT2YoaG9tZU9iamVjdCkgIT09IG51bGwpXG4gICAgICBzdXBlckNhbGwoc2VsZiwgaG9tZU9iamVjdCwgJ2NvbnN0cnVjdG9yJywgYXJncyk7XG4gIH1cbiAgdmFyIFNUX05FV0JPUk4gPSAwO1xuICB2YXIgU1RfRVhFQ1VUSU5HID0gMTtcbiAgdmFyIFNUX1NVU1BFTkRFRCA9IDI7XG4gIHZhciBTVF9DTE9TRUQgPSAzO1xuICB2YXIgRU5EX1NUQVRFID0gLTI7XG4gIHZhciBSRVRIUk9XX1NUQVRFID0gLTM7XG4gIGZ1bmN0aW9uIGFkZEl0ZXJhdG9yKG9iamVjdCkge1xuICAgIHJldHVybiBkZWZpbmVQcm9wZXJ0eShvYmplY3QsIFN5bWJvbC5pdGVyYXRvciwgbm9uRW51bShmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0pKTtcbiAgfVxuICBmdW5jdGlvbiBnZXRJbnRlcm5hbEVycm9yKHN0YXRlKSB7XG4gICAgcmV0dXJuIG5ldyBFcnJvcignVHJhY2V1ciBjb21waWxlciBidWc6IGludmFsaWQgc3RhdGUgaW4gc3RhdGUgbWFjaGluZTogJyArIHN0YXRlKTtcbiAgfVxuICBmdW5jdGlvbiBHZW5lcmF0b3JDb250ZXh0KCkge1xuICAgIHRoaXMuc3RhdGUgPSAwO1xuICAgIHRoaXMuR1N0YXRlID0gU1RfTkVXQk9STjtcbiAgICB0aGlzLnN0b3JlZEV4Y2VwdGlvbiA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLmZpbmFsbHlGYWxsVGhyb3VnaCA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLnNlbnRfID0gdW5kZWZpbmVkO1xuICAgIHRoaXMucmV0dXJuVmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy50cnlTdGFja18gPSBbXTtcbiAgfVxuICBHZW5lcmF0b3JDb250ZXh0LnByb3RvdHlwZSA9IHtcbiAgICBwdXNoVHJ5OiBmdW5jdGlvbihjYXRjaFN0YXRlLCBmaW5hbGx5U3RhdGUpIHtcbiAgICAgIGlmIChmaW5hbGx5U3RhdGUgIT09IG51bGwpIHtcbiAgICAgICAgdmFyIGZpbmFsbHlGYWxsVGhyb3VnaCA9IG51bGw7XG4gICAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeVN0YWNrXy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgIGlmICh0aGlzLnRyeVN0YWNrX1tpXS5jYXRjaCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBmaW5hbGx5RmFsbFRocm91Z2ggPSB0aGlzLnRyeVN0YWNrX1tpXS5jYXRjaDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoZmluYWxseUZhbGxUaHJvdWdoID09PSBudWxsKVxuICAgICAgICAgIGZpbmFsbHlGYWxsVGhyb3VnaCA9IFJFVEhST1dfU1RBVEU7XG4gICAgICAgIHRoaXMudHJ5U3RhY2tfLnB1c2goe1xuICAgICAgICAgIGZpbmFsbHk6IGZpbmFsbHlTdGF0ZSxcbiAgICAgICAgICBmaW5hbGx5RmFsbFRocm91Z2g6IGZpbmFsbHlGYWxsVGhyb3VnaFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGlmIChjYXRjaFN0YXRlICE9PSBudWxsKSB7XG4gICAgICAgIHRoaXMudHJ5U3RhY2tfLnB1c2goe2NhdGNoOiBjYXRjaFN0YXRlfSk7XG4gICAgICB9XG4gICAgfSxcbiAgICBwb3BUcnk6IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy50cnlTdGFja18ucG9wKCk7XG4gICAgfSxcbiAgICBnZXQgc2VudCgpIHtcbiAgICAgIHRoaXMubWF5YmVUaHJvdygpO1xuICAgICAgcmV0dXJuIHRoaXMuc2VudF87XG4gICAgfSxcbiAgICBzZXQgc2VudCh2KSB7XG4gICAgICB0aGlzLnNlbnRfID0gdjtcbiAgICB9LFxuICAgIGdldCBzZW50SWdub3JlVGhyb3coKSB7XG4gICAgICByZXR1cm4gdGhpcy5zZW50XztcbiAgICB9LFxuICAgIG1heWJlVGhyb3c6IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHRoaXMuYWN0aW9uID09PSAndGhyb3cnKSB7XG4gICAgICAgIHRoaXMuYWN0aW9uID0gJ25leHQnO1xuICAgICAgICB0aHJvdyB0aGlzLnNlbnRfO1xuICAgICAgfVxuICAgIH0sXG4gICAgZW5kOiBmdW5jdGlvbigpIHtcbiAgICAgIHN3aXRjaCAodGhpcy5zdGF0ZSkge1xuICAgICAgICBjYXNlIEVORF9TVEFURTpcbiAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgY2FzZSBSRVRIUk9XX1NUQVRFOlxuICAgICAgICAgIHRocm93IHRoaXMuc3RvcmVkRXhjZXB0aW9uO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHRocm93IGdldEludGVybmFsRXJyb3IodGhpcy5zdGF0ZSk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuICBmdW5jdGlvbiBnZXROZXh0T3JUaHJvdyhjdHgsIG1vdmVOZXh0LCBhY3Rpb24pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oeCkge1xuICAgICAgc3dpdGNoIChjdHguR1N0YXRlKSB7XG4gICAgICAgIGNhc2UgU1RfRVhFQ1VUSU5HOlxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcigoXCJcXFwiXCIgKyBhY3Rpb24gKyBcIlxcXCIgb24gZXhlY3V0aW5nIGdlbmVyYXRvclwiKSk7XG4gICAgICAgIGNhc2UgU1RfQ0xPU0VEOlxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcigoXCJcXFwiXCIgKyBhY3Rpb24gKyBcIlxcXCIgb24gY2xvc2VkIGdlbmVyYXRvclwiKSk7XG4gICAgICAgIGNhc2UgU1RfTkVXQk9STjpcbiAgICAgICAgICBpZiAoYWN0aW9uID09PSAndGhyb3cnKSB7XG4gICAgICAgICAgICBjdHguR1N0YXRlID0gU1RfQ0xPU0VEO1xuICAgICAgICAgICAgdGhyb3cgeDtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHggIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHRocm93ICRUeXBlRXJyb3IoJ1NlbnQgdmFsdWUgdG8gbmV3Ym9ybiBnZW5lcmF0b3InKTtcbiAgICAgICAgY2FzZSBTVF9TVVNQRU5ERUQ6XG4gICAgICAgICAgY3R4LkdTdGF0ZSA9IFNUX0VYRUNVVElORztcbiAgICAgICAgICBjdHguYWN0aW9uID0gYWN0aW9uO1xuICAgICAgICAgIGN0eC5zZW50ID0geDtcbiAgICAgICAgICB2YXIgdmFsdWUgPSBtb3ZlTmV4dChjdHgpO1xuICAgICAgICAgIHZhciBkb25lID0gdmFsdWUgPT09IGN0eDtcbiAgICAgICAgICBpZiAoZG9uZSlcbiAgICAgICAgICAgIHZhbHVlID0gY3R4LnJldHVyblZhbHVlO1xuICAgICAgICAgIGN0eC5HU3RhdGUgPSBkb25lID8gU1RfQ0xPU0VEIDogU1RfU1VTUEVOREVEO1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgICAgICBkb25lOiBkb25lXG4gICAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG4gIGZ1bmN0aW9uIGdlbmVyYXRvcldyYXAoaW5uZXJGdW5jdGlvbiwgc2VsZikge1xuICAgIHZhciBtb3ZlTmV4dCA9IGdldE1vdmVOZXh0KGlubmVyRnVuY3Rpb24sIHNlbGYpO1xuICAgIHZhciBjdHggPSBuZXcgR2VuZXJhdG9yQ29udGV4dCgpO1xuICAgIHJldHVybiBhZGRJdGVyYXRvcih7XG4gICAgICBuZXh0OiBnZXROZXh0T3JUaHJvdyhjdHgsIG1vdmVOZXh0LCAnbmV4dCcpLFxuICAgICAgdGhyb3c6IGdldE5leHRPclRocm93KGN0eCwgbW92ZU5leHQsICd0aHJvdycpXG4gICAgfSk7XG4gIH1cbiAgZnVuY3Rpb24gQXN5bmNGdW5jdGlvbkNvbnRleHQoKSB7XG4gICAgR2VuZXJhdG9yQ29udGV4dC5jYWxsKHRoaXMpO1xuICAgIHRoaXMuZXJyID0gdW5kZWZpbmVkO1xuICAgIHZhciBjdHggPSB0aGlzO1xuICAgIGN0eC5yZXN1bHQgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIGN0eC5yZXNvbHZlID0gcmVzb2x2ZTtcbiAgICAgIGN0eC5yZWplY3QgPSByZWplY3Q7XG4gICAgfSk7XG4gIH1cbiAgQXN5bmNGdW5jdGlvbkNvbnRleHQucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShHZW5lcmF0b3JDb250ZXh0LnByb3RvdHlwZSk7XG4gIEFzeW5jRnVuY3Rpb25Db250ZXh0LnByb3RvdHlwZS5lbmQgPSBmdW5jdGlvbigpIHtcbiAgICBzd2l0Y2ggKHRoaXMuc3RhdGUpIHtcbiAgICAgIGNhc2UgRU5EX1NUQVRFOlxuICAgICAgICByZXR1cm47XG4gICAgICBjYXNlIFJFVEhST1dfU1RBVEU6XG4gICAgICAgIHRoaXMucmVqZWN0KHRoaXMuc3RvcmVkRXhjZXB0aW9uKTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRoaXMucmVqZWN0KGdldEludGVybmFsRXJyb3IodGhpcy5zdGF0ZSkpO1xuICAgIH1cbiAgfTtcbiAgZnVuY3Rpb24gYXN5bmNXcmFwKGlubmVyRnVuY3Rpb24sIHNlbGYpIHtcbiAgICB2YXIgbW92ZU5leHQgPSBnZXRNb3ZlTmV4dChpbm5lckZ1bmN0aW9uLCBzZWxmKTtcbiAgICB2YXIgY3R4ID0gbmV3IEFzeW5jRnVuY3Rpb25Db250ZXh0KCk7XG4gICAgY3R4LmNyZWF0ZUNhbGxiYWNrID0gZnVuY3Rpb24obmV3U3RhdGUpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICBjdHguc3RhdGUgPSBuZXdTdGF0ZTtcbiAgICAgICAgY3R4LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIG1vdmVOZXh0KGN0eCk7XG4gICAgICB9O1xuICAgIH07XG4gICAgY3R4LmNyZWF0ZUVycmJhY2sgPSBmdW5jdGlvbihuZXdTdGF0ZSkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKGVycikge1xuICAgICAgICBjdHguc3RhdGUgPSBuZXdTdGF0ZTtcbiAgICAgICAgY3R4LmVyciA9IGVycjtcbiAgICAgICAgbW92ZU5leHQoY3R4KTtcbiAgICAgIH07XG4gICAgfTtcbiAgICBtb3ZlTmV4dChjdHgpO1xuICAgIHJldHVybiBjdHgucmVzdWx0O1xuICB9XG4gIGZ1bmN0aW9uIGdldE1vdmVOZXh0KGlubmVyRnVuY3Rpb24sIHNlbGYpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oY3R4KSB7XG4gICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHJldHVybiBpbm5lckZ1bmN0aW9uLmNhbGwoc2VsZiwgY3R4KTtcbiAgICAgICAgfSBjYXRjaCAoZXgpIHtcbiAgICAgICAgICBjdHguc3RvcmVkRXhjZXB0aW9uID0gZXg7XG4gICAgICAgICAgdmFyIGxhc3QgPSBjdHgudHJ5U3RhY2tfW2N0eC50cnlTdGFja18ubGVuZ3RoIC0gMV07XG4gICAgICAgICAgaWYgKCFsYXN0KSB7XG4gICAgICAgICAgICBjdHguR1N0YXRlID0gU1RfQ0xPU0VEO1xuICAgICAgICAgICAgY3R4LnN0YXRlID0gRU5EX1NUQVRFO1xuICAgICAgICAgICAgdGhyb3cgZXg7XG4gICAgICAgICAgfVxuICAgICAgICAgIGN0eC5zdGF0ZSA9IGxhc3QuY2F0Y2ggIT09IHVuZGVmaW5lZCA/IGxhc3QuY2F0Y2ggOiBsYXN0LmZpbmFsbHk7XG4gICAgICAgICAgaWYgKGxhc3QuZmluYWxseUZhbGxUaHJvdWdoICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICBjdHguZmluYWxseUZhbGxUaHJvdWdoID0gbGFzdC5maW5hbGx5RmFsbFRocm91Z2g7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICB9XG4gIGZ1bmN0aW9uIHNldHVwR2xvYmFscyhnbG9iYWwpIHtcbiAgICBnbG9iYWwuU3ltYm9sID0gU3ltYm9sO1xuICAgIHBvbHlmaWxsT2JqZWN0KGdsb2JhbC5PYmplY3QpO1xuICB9XG4gIHNldHVwR2xvYmFscyhnbG9iYWwpO1xuICBnbG9iYWwuJHRyYWNldXJSdW50aW1lID0ge1xuICAgIGFzeW5jV3JhcDogYXN5bmNXcmFwLFxuICAgIGNyZWF0ZUNsYXNzOiBjcmVhdGVDbGFzcyxcbiAgICBkZWZhdWx0U3VwZXJDYWxsOiBkZWZhdWx0U3VwZXJDYWxsLFxuICAgIGV4cG9ydFN0YXI6IGV4cG9ydFN0YXIsXG4gICAgZ2VuZXJhdG9yV3JhcDogZ2VuZXJhdG9yV3JhcCxcbiAgICBzZXRQcm9wZXJ0eTogc2V0UHJvcGVydHksXG4gICAgc2V0dXBHbG9iYWxzOiBzZXR1cEdsb2JhbHMsXG4gICAgc3ByZWFkOiBzcHJlYWQsXG4gICAgc3VwZXJDYWxsOiBzdXBlckNhbGwsXG4gICAgc3VwZXJHZXQ6IHN1cGVyR2V0LFxuICAgIHN1cGVyU2V0OiBzdXBlclNldCxcbiAgICB0b09iamVjdDogdG9PYmplY3QsXG4gICAgdG9Qcm9wZXJ0eTogdG9Qcm9wZXJ0eSxcbiAgICB0eXBlOiB0eXBlcyxcbiAgICB0eXBlb2Y6IHR5cGVPZlxuICB9O1xufSkodHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcgPyBnbG9iYWwgOiB0aGlzKTtcbihmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gYnVpbGRGcm9tRW5jb2RlZFBhcnRzKG9wdF9zY2hlbWUsIG9wdF91c2VySW5mbywgb3B0X2RvbWFpbiwgb3B0X3BvcnQsIG9wdF9wYXRoLCBvcHRfcXVlcnlEYXRhLCBvcHRfZnJhZ21lbnQpIHtcbiAgICB2YXIgb3V0ID0gW107XG4gICAgaWYgKG9wdF9zY2hlbWUpIHtcbiAgICAgIG91dC5wdXNoKG9wdF9zY2hlbWUsICc6Jyk7XG4gICAgfVxuICAgIGlmIChvcHRfZG9tYWluKSB7XG4gICAgICBvdXQucHVzaCgnLy8nKTtcbiAgICAgIGlmIChvcHRfdXNlckluZm8pIHtcbiAgICAgICAgb3V0LnB1c2gob3B0X3VzZXJJbmZvLCAnQCcpO1xuICAgICAgfVxuICAgICAgb3V0LnB1c2gob3B0X2RvbWFpbik7XG4gICAgICBpZiAob3B0X3BvcnQpIHtcbiAgICAgICAgb3V0LnB1c2goJzonLCBvcHRfcG9ydCk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChvcHRfcGF0aCkge1xuICAgICAgb3V0LnB1c2gob3B0X3BhdGgpO1xuICAgIH1cbiAgICBpZiAob3B0X3F1ZXJ5RGF0YSkge1xuICAgICAgb3V0LnB1c2goJz8nLCBvcHRfcXVlcnlEYXRhKTtcbiAgICB9XG4gICAgaWYgKG9wdF9mcmFnbWVudCkge1xuICAgICAgb3V0LnB1c2goJyMnLCBvcHRfZnJhZ21lbnQpO1xuICAgIH1cbiAgICByZXR1cm4gb3V0LmpvaW4oJycpO1xuICB9XG4gIDtcbiAgdmFyIHNwbGl0UmUgPSBuZXcgUmVnRXhwKCdeJyArICcoPzonICsgJyhbXjovPyMuXSspJyArICc6KT8nICsgJyg/Oi8vJyArICcoPzooW14vPyNdKilAKT8nICsgJyhbXFxcXHdcXFxcZFxcXFwtXFxcXHUwMTAwLVxcXFx1ZmZmZi4lXSopJyArICcoPzo6KFswLTldKykpPycgKyAnKT8nICsgJyhbXj8jXSspPycgKyAnKD86XFxcXD8oW14jXSopKT8nICsgJyg/OiMoLiopKT8nICsgJyQnKTtcbiAgdmFyIENvbXBvbmVudEluZGV4ID0ge1xuICAgIFNDSEVNRTogMSxcbiAgICBVU0VSX0lORk86IDIsXG4gICAgRE9NQUlOOiAzLFxuICAgIFBPUlQ6IDQsXG4gICAgUEFUSDogNSxcbiAgICBRVUVSWV9EQVRBOiA2LFxuICAgIEZSQUdNRU5UOiA3XG4gIH07XG4gIGZ1bmN0aW9uIHNwbGl0KHVyaSkge1xuICAgIHJldHVybiAodXJpLm1hdGNoKHNwbGl0UmUpKTtcbiAgfVxuICBmdW5jdGlvbiByZW1vdmVEb3RTZWdtZW50cyhwYXRoKSB7XG4gICAgaWYgKHBhdGggPT09ICcvJylcbiAgICAgIHJldHVybiAnLyc7XG4gICAgdmFyIGxlYWRpbmdTbGFzaCA9IHBhdGhbMF0gPT09ICcvJyA/ICcvJyA6ICcnO1xuICAgIHZhciB0cmFpbGluZ1NsYXNoID0gcGF0aC5zbGljZSgtMSkgPT09ICcvJyA/ICcvJyA6ICcnO1xuICAgIHZhciBzZWdtZW50cyA9IHBhdGguc3BsaXQoJy8nKTtcbiAgICB2YXIgb3V0ID0gW107XG4gICAgdmFyIHVwID0gMDtcbiAgICBmb3IgKHZhciBwb3MgPSAwOyBwb3MgPCBzZWdtZW50cy5sZW5ndGg7IHBvcysrKSB7XG4gICAgICB2YXIgc2VnbWVudCA9IHNlZ21lbnRzW3Bvc107XG4gICAgICBzd2l0Y2ggKHNlZ21lbnQpIHtcbiAgICAgICAgY2FzZSAnJzpcbiAgICAgICAgY2FzZSAnLic6XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJy4uJzpcbiAgICAgICAgICBpZiAob3V0Lmxlbmd0aClcbiAgICAgICAgICAgIG91dC5wb3AoKTtcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICB1cCsrO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIG91dC5wdXNoKHNlZ21lbnQpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoIWxlYWRpbmdTbGFzaCkge1xuICAgICAgd2hpbGUgKHVwLS0gPiAwKSB7XG4gICAgICAgIG91dC51bnNoaWZ0KCcuLicpO1xuICAgICAgfVxuICAgICAgaWYgKG91dC5sZW5ndGggPT09IDApXG4gICAgICAgIG91dC5wdXNoKCcuJyk7XG4gICAgfVxuICAgIHJldHVybiBsZWFkaW5nU2xhc2ggKyBvdXQuam9pbignLycpICsgdHJhaWxpbmdTbGFzaDtcbiAgfVxuICBmdW5jdGlvbiBqb2luQW5kQ2Fub25pY2FsaXplUGF0aChwYXJ0cykge1xuICAgIHZhciBwYXRoID0gcGFydHNbQ29tcG9uZW50SW5kZXguUEFUSF0gfHwgJyc7XG4gICAgcGF0aCA9IHJlbW92ZURvdFNlZ21lbnRzKHBhdGgpO1xuICAgIHBhcnRzW0NvbXBvbmVudEluZGV4LlBBVEhdID0gcGF0aDtcbiAgICByZXR1cm4gYnVpbGRGcm9tRW5jb2RlZFBhcnRzKHBhcnRzW0NvbXBvbmVudEluZGV4LlNDSEVNRV0sIHBhcnRzW0NvbXBvbmVudEluZGV4LlVTRVJfSU5GT10sIHBhcnRzW0NvbXBvbmVudEluZGV4LkRPTUFJTl0sIHBhcnRzW0NvbXBvbmVudEluZGV4LlBPUlRdLCBwYXJ0c1tDb21wb25lbnRJbmRleC5QQVRIXSwgcGFydHNbQ29tcG9uZW50SW5kZXguUVVFUllfREFUQV0sIHBhcnRzW0NvbXBvbmVudEluZGV4LkZSQUdNRU5UXSk7XG4gIH1cbiAgZnVuY3Rpb24gY2Fub25pY2FsaXplVXJsKHVybCkge1xuICAgIHZhciBwYXJ0cyA9IHNwbGl0KHVybCk7XG4gICAgcmV0dXJuIGpvaW5BbmRDYW5vbmljYWxpemVQYXRoKHBhcnRzKTtcbiAgfVxuICBmdW5jdGlvbiByZXNvbHZlVXJsKGJhc2UsIHVybCkge1xuICAgIHZhciBwYXJ0cyA9IHNwbGl0KHVybCk7XG4gICAgdmFyIGJhc2VQYXJ0cyA9IHNwbGl0KGJhc2UpO1xuICAgIGlmIChwYXJ0c1tDb21wb25lbnRJbmRleC5TQ0hFTUVdKSB7XG4gICAgICByZXR1cm4gam9pbkFuZENhbm9uaWNhbGl6ZVBhdGgocGFydHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYXJ0c1tDb21wb25lbnRJbmRleC5TQ0hFTUVdID0gYmFzZVBhcnRzW0NvbXBvbmVudEluZGV4LlNDSEVNRV07XG4gICAgfVxuICAgIGZvciAodmFyIGkgPSBDb21wb25lbnRJbmRleC5TQ0hFTUU7IGkgPD0gQ29tcG9uZW50SW5kZXguUE9SVDsgaSsrKSB7XG4gICAgICBpZiAoIXBhcnRzW2ldKSB7XG4gICAgICAgIHBhcnRzW2ldID0gYmFzZVBhcnRzW2ldO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAocGFydHNbQ29tcG9uZW50SW5kZXguUEFUSF1bMF0gPT0gJy8nKSB7XG4gICAgICByZXR1cm4gam9pbkFuZENhbm9uaWNhbGl6ZVBhdGgocGFydHMpO1xuICAgIH1cbiAgICB2YXIgcGF0aCA9IGJhc2VQYXJ0c1tDb21wb25lbnRJbmRleC5QQVRIXTtcbiAgICB2YXIgaW5kZXggPSBwYXRoLmxhc3RJbmRleE9mKCcvJyk7XG4gICAgcGF0aCA9IHBhdGguc2xpY2UoMCwgaW5kZXggKyAxKSArIHBhcnRzW0NvbXBvbmVudEluZGV4LlBBVEhdO1xuICAgIHBhcnRzW0NvbXBvbmVudEluZGV4LlBBVEhdID0gcGF0aDtcbiAgICByZXR1cm4gam9pbkFuZENhbm9uaWNhbGl6ZVBhdGgocGFydHMpO1xuICB9XG4gIGZ1bmN0aW9uIGlzQWJzb2x1dGUobmFtZSkge1xuICAgIGlmICghbmFtZSlcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICBpZiAobmFtZVswXSA9PT0gJy8nKVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgdmFyIHBhcnRzID0gc3BsaXQobmFtZSk7XG4gICAgaWYgKHBhcnRzW0NvbXBvbmVudEluZGV4LlNDSEVNRV0pXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgJHRyYWNldXJSdW50aW1lLmNhbm9uaWNhbGl6ZVVybCA9IGNhbm9uaWNhbGl6ZVVybDtcbiAgJHRyYWNldXJSdW50aW1lLmlzQWJzb2x1dGUgPSBpc0Fic29sdXRlO1xuICAkdHJhY2V1clJ1bnRpbWUucmVtb3ZlRG90U2VnbWVudHMgPSByZW1vdmVEb3RTZWdtZW50cztcbiAgJHRyYWNldXJSdW50aW1lLnJlc29sdmVVcmwgPSByZXNvbHZlVXJsO1xufSkoKTtcbihmdW5jdGlvbihnbG9iYWwpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuICB2YXIgJF9fMiA9ICR0cmFjZXVyUnVudGltZSxcbiAgICAgIGNhbm9uaWNhbGl6ZVVybCA9ICRfXzIuY2Fub25pY2FsaXplVXJsLFxuICAgICAgcmVzb2x2ZVVybCA9ICRfXzIucmVzb2x2ZVVybCxcbiAgICAgIGlzQWJzb2x1dGUgPSAkX18yLmlzQWJzb2x1dGU7XG4gIHZhciBtb2R1bGVJbnN0YW50aWF0b3JzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgdmFyIGJhc2VVUkw7XG4gIGlmIChnbG9iYWwubG9jYXRpb24gJiYgZ2xvYmFsLmxvY2F0aW9uLmhyZWYpXG4gICAgYmFzZVVSTCA9IHJlc29sdmVVcmwoZ2xvYmFsLmxvY2F0aW9uLmhyZWYsICcuLycpO1xuICBlbHNlXG4gICAgYmFzZVVSTCA9ICcnO1xuICB2YXIgVW5jb2F0ZWRNb2R1bGVFbnRyeSA9IGZ1bmN0aW9uIFVuY29hdGVkTW9kdWxlRW50cnkodXJsLCB1bmNvYXRlZE1vZHVsZSkge1xuICAgIHRoaXMudXJsID0gdXJsO1xuICAgIHRoaXMudmFsdWVfID0gdW5jb2F0ZWRNb2R1bGU7XG4gIH07XG4gICgkdHJhY2V1clJ1bnRpbWUuY3JlYXRlQ2xhc3MpKFVuY29hdGVkTW9kdWxlRW50cnksIHt9LCB7fSk7XG4gIHZhciBVbmNvYXRlZE1vZHVsZUluc3RhbnRpYXRvciA9IGZ1bmN0aW9uIFVuY29hdGVkTW9kdWxlSW5zdGFudGlhdG9yKHVybCwgZnVuYykge1xuICAgICR0cmFjZXVyUnVudGltZS5zdXBlckNhbGwodGhpcywgJFVuY29hdGVkTW9kdWxlSW5zdGFudGlhdG9yLnByb3RvdHlwZSwgXCJjb25zdHJ1Y3RvclwiLCBbdXJsLCBudWxsXSk7XG4gICAgdGhpcy5mdW5jID0gZnVuYztcbiAgfTtcbiAgdmFyICRVbmNvYXRlZE1vZHVsZUluc3RhbnRpYXRvciA9IFVuY29hdGVkTW9kdWxlSW5zdGFudGlhdG9yO1xuICAoJHRyYWNldXJSdW50aW1lLmNyZWF0ZUNsYXNzKShVbmNvYXRlZE1vZHVsZUluc3RhbnRpYXRvciwge2dldFVuY29hdGVkTW9kdWxlOiBmdW5jdGlvbigpIHtcbiAgICAgIGlmICh0aGlzLnZhbHVlXylcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVfO1xuICAgICAgcmV0dXJuIHRoaXMudmFsdWVfID0gdGhpcy5mdW5jLmNhbGwoZ2xvYmFsKTtcbiAgICB9fSwge30sIFVuY29hdGVkTW9kdWxlRW50cnkpO1xuICBmdW5jdGlvbiBnZXRVbmNvYXRlZE1vZHVsZUluc3RhbnRpYXRvcihuYW1lKSB7XG4gICAgaWYgKCFuYW1lKVxuICAgICAgcmV0dXJuO1xuICAgIHZhciB1cmwgPSBNb2R1bGVTdG9yZS5ub3JtYWxpemUobmFtZSk7XG4gICAgcmV0dXJuIG1vZHVsZUluc3RhbnRpYXRvcnNbdXJsXTtcbiAgfVxuICA7XG4gIHZhciBtb2R1bGVJbnN0YW5jZXMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICB2YXIgbGl2ZU1vZHVsZVNlbnRpbmVsID0ge307XG4gIGZ1bmN0aW9uIE1vZHVsZSh1bmNvYXRlZE1vZHVsZSkge1xuICAgIHZhciBpc0xpdmUgPSBhcmd1bWVudHNbMV07XG4gICAgdmFyIGNvYXRlZE1vZHVsZSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModW5jb2F0ZWRNb2R1bGUpLmZvckVhY2goKGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgIHZhciBnZXR0ZXIsXG4gICAgICAgICAgdmFsdWU7XG4gICAgICBpZiAoaXNMaXZlID09PSBsaXZlTW9kdWxlU2VudGluZWwpIHtcbiAgICAgICAgdmFyIGRlc2NyID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih1bmNvYXRlZE1vZHVsZSwgbmFtZSk7XG4gICAgICAgIGlmIChkZXNjci5nZXQpXG4gICAgICAgICAgZ2V0dGVyID0gZGVzY3IuZ2V0O1xuICAgICAgfVxuICAgICAgaWYgKCFnZXR0ZXIpIHtcbiAgICAgICAgdmFsdWUgPSB1bmNvYXRlZE1vZHVsZVtuYW1lXTtcbiAgICAgICAgZ2V0dGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvYXRlZE1vZHVsZSwgbmFtZSwge1xuICAgICAgICBnZXQ6IGdldHRlcixcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgfSk7XG4gICAgfSkpO1xuICAgIE9iamVjdC5wcmV2ZW50RXh0ZW5zaW9ucyhjb2F0ZWRNb2R1bGUpO1xuICAgIHJldHVybiBjb2F0ZWRNb2R1bGU7XG4gIH1cbiAgdmFyIE1vZHVsZVN0b3JlID0ge1xuICAgIG5vcm1hbGl6ZTogZnVuY3Rpb24obmFtZSwgcmVmZXJlck5hbWUsIHJlZmVyZXJBZGRyZXNzKSB7XG4gICAgICBpZiAodHlwZW9mIG5hbWUgIT09IFwic3RyaW5nXCIpXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJtb2R1bGUgbmFtZSBtdXN0IGJlIGEgc3RyaW5nLCBub3QgXCIgKyB0eXBlb2YgbmFtZSk7XG4gICAgICBpZiAoaXNBYnNvbHV0ZShuYW1lKSlcbiAgICAgICAgcmV0dXJuIGNhbm9uaWNhbGl6ZVVybChuYW1lKTtcbiAgICAgIGlmICgvW15cXC5dXFwvXFwuXFwuXFwvLy50ZXN0KG5hbWUpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignbW9kdWxlIG5hbWUgZW1iZWRzIC8uLi86ICcgKyBuYW1lKTtcbiAgICAgIH1cbiAgICAgIGlmIChuYW1lWzBdID09PSAnLicgJiYgcmVmZXJlck5hbWUpXG4gICAgICAgIHJldHVybiByZXNvbHZlVXJsKHJlZmVyZXJOYW1lLCBuYW1lKTtcbiAgICAgIHJldHVybiBjYW5vbmljYWxpemVVcmwobmFtZSk7XG4gICAgfSxcbiAgICBnZXQ6IGZ1bmN0aW9uKG5vcm1hbGl6ZWROYW1lKSB7XG4gICAgICB2YXIgbSA9IGdldFVuY29hdGVkTW9kdWxlSW5zdGFudGlhdG9yKG5vcm1hbGl6ZWROYW1lKTtcbiAgICAgIGlmICghbSlcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIHZhciBtb2R1bGVJbnN0YW5jZSA9IG1vZHVsZUluc3RhbmNlc1ttLnVybF07XG4gICAgICBpZiAobW9kdWxlSW5zdGFuY2UpXG4gICAgICAgIHJldHVybiBtb2R1bGVJbnN0YW5jZTtcbiAgICAgIG1vZHVsZUluc3RhbmNlID0gTW9kdWxlKG0uZ2V0VW5jb2F0ZWRNb2R1bGUoKSwgbGl2ZU1vZHVsZVNlbnRpbmVsKTtcbiAgICAgIHJldHVybiBtb2R1bGVJbnN0YW5jZXNbbS51cmxdID0gbW9kdWxlSW5zdGFuY2U7XG4gICAgfSxcbiAgICBzZXQ6IGZ1bmN0aW9uKG5vcm1hbGl6ZWROYW1lLCBtb2R1bGUpIHtcbiAgICAgIG5vcm1hbGl6ZWROYW1lID0gU3RyaW5nKG5vcm1hbGl6ZWROYW1lKTtcbiAgICAgIG1vZHVsZUluc3RhbnRpYXRvcnNbbm9ybWFsaXplZE5hbWVdID0gbmV3IFVuY29hdGVkTW9kdWxlSW5zdGFudGlhdG9yKG5vcm1hbGl6ZWROYW1lLCAoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBtb2R1bGU7XG4gICAgICB9KSk7XG4gICAgICBtb2R1bGVJbnN0YW5jZXNbbm9ybWFsaXplZE5hbWVdID0gbW9kdWxlO1xuICAgIH0sXG4gICAgZ2V0IGJhc2VVUkwoKSB7XG4gICAgICByZXR1cm4gYmFzZVVSTDtcbiAgICB9LFxuICAgIHNldCBiYXNlVVJMKHYpIHtcbiAgICAgIGJhc2VVUkwgPSBTdHJpbmcodik7XG4gICAgfSxcbiAgICByZWdpc3Rlck1vZHVsZTogZnVuY3Rpb24obmFtZSwgZnVuYykge1xuICAgICAgdmFyIG5vcm1hbGl6ZWROYW1lID0gTW9kdWxlU3RvcmUubm9ybWFsaXplKG5hbWUpO1xuICAgICAgaWYgKG1vZHVsZUluc3RhbnRpYXRvcnNbbm9ybWFsaXplZE5hbWVdKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2R1cGxpY2F0ZSBtb2R1bGUgbmFtZWQgJyArIG5vcm1hbGl6ZWROYW1lKTtcbiAgICAgIG1vZHVsZUluc3RhbnRpYXRvcnNbbm9ybWFsaXplZE5hbWVdID0gbmV3IFVuY29hdGVkTW9kdWxlSW5zdGFudGlhdG9yKG5vcm1hbGl6ZWROYW1lLCBmdW5jKTtcbiAgICB9LFxuICAgIGJ1bmRsZVN0b3JlOiBPYmplY3QuY3JlYXRlKG51bGwpLFxuICAgIHJlZ2lzdGVyOiBmdW5jdGlvbihuYW1lLCBkZXBzLCBmdW5jKSB7XG4gICAgICBpZiAoIWRlcHMgfHwgIWRlcHMubGVuZ3RoKSB7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJNb2R1bGUobmFtZSwgZnVuYyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmJ1bmRsZVN0b3JlW25hbWVdID0ge1xuICAgICAgICAgIGRlcHM6IGRlcHMsXG4gICAgICAgICAgZXhlY3V0ZTogZnVuY1xuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0sXG4gICAgZ2V0QW5vbnltb3VzTW9kdWxlOiBmdW5jdGlvbihmdW5jKSB7XG4gICAgICByZXR1cm4gbmV3IE1vZHVsZShmdW5jLmNhbGwoZ2xvYmFsKSwgbGl2ZU1vZHVsZVNlbnRpbmVsKTtcbiAgICB9LFxuICAgIGdldEZvclRlc3Rpbmc6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgIHZhciAkX18wID0gdGhpcztcbiAgICAgIGlmICghdGhpcy50ZXN0aW5nUHJlZml4Xykge1xuICAgICAgICBPYmplY3Qua2V5cyhtb2R1bGVJbnN0YW5jZXMpLnNvbWUoKGZ1bmN0aW9uKGtleSkge1xuICAgICAgICAgIHZhciBtID0gLyh0cmFjZXVyQFteXFwvXSpcXC8pLy5leGVjKGtleSk7XG4gICAgICAgICAgaWYgKG0pIHtcbiAgICAgICAgICAgICRfXzAudGVzdGluZ1ByZWZpeF8gPSBtWzFdO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9KSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5nZXQodGhpcy50ZXN0aW5nUHJlZml4XyArIG5hbWUpO1xuICAgIH1cbiAgfTtcbiAgTW9kdWxlU3RvcmUuc2V0KCdAdHJhY2V1ci9zcmMvcnVudGltZS9Nb2R1bGVTdG9yZScsIG5ldyBNb2R1bGUoe01vZHVsZVN0b3JlOiBNb2R1bGVTdG9yZX0pKTtcbiAgdmFyIHNldHVwR2xvYmFscyA9ICR0cmFjZXVyUnVudGltZS5zZXR1cEdsb2JhbHM7XG4gICR0cmFjZXVyUnVudGltZS5zZXR1cEdsb2JhbHMgPSBmdW5jdGlvbihnbG9iYWwpIHtcbiAgICBzZXR1cEdsb2JhbHMoZ2xvYmFsKTtcbiAgfTtcbiAgJHRyYWNldXJSdW50aW1lLk1vZHVsZVN0b3JlID0gTW9kdWxlU3RvcmU7XG4gIGdsb2JhbC5TeXN0ZW0gPSB7XG4gICAgcmVnaXN0ZXI6IE1vZHVsZVN0b3JlLnJlZ2lzdGVyLmJpbmQoTW9kdWxlU3RvcmUpLFxuICAgIGdldDogTW9kdWxlU3RvcmUuZ2V0LFxuICAgIHNldDogTW9kdWxlU3RvcmUuc2V0LFxuICAgIG5vcm1hbGl6ZTogTW9kdWxlU3RvcmUubm9ybWFsaXplXG4gIH07XG4gICR0cmFjZXVyUnVudGltZS5nZXRNb2R1bGVJbXBsID0gZnVuY3Rpb24obmFtZSkge1xuICAgIHZhciBpbnN0YW50aWF0b3IgPSBnZXRVbmNvYXRlZE1vZHVsZUluc3RhbnRpYXRvcihuYW1lKTtcbiAgICByZXR1cm4gaW5zdGFudGlhdG9yICYmIGluc3RhbnRpYXRvci5nZXRVbmNvYXRlZE1vZHVsZSgpO1xuICB9O1xufSkodHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcgPyBnbG9iYWwgOiB0aGlzKTtcblN5c3RlbS5yZWdpc3RlcihcInRyYWNldXItcnVudGltZUAwLjAuMzIvc3JjL3J1bnRpbWUvcG9seWZpbGxzL3V0aWxzXCIsIFtdLCBmdW5jdGlvbigpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG4gIHZhciBfX21vZHVsZU5hbWUgPSBcInRyYWNldXItcnVudGltZUAwLjAuMzIvc3JjL3J1bnRpbWUvcG9seWZpbGxzL3V0aWxzXCI7XG4gIHZhciB0b09iamVjdCA9ICR0cmFjZXVyUnVudGltZS50b09iamVjdDtcbiAgZnVuY3Rpb24gdG9VaW50MzIoeCkge1xuICAgIHJldHVybiB4IHwgMDtcbiAgfVxuICByZXR1cm4ge1xuICAgIGdldCB0b09iamVjdCgpIHtcbiAgICAgIHJldHVybiB0b09iamVjdDtcbiAgICB9LFxuICAgIGdldCB0b1VpbnQzMigpIHtcbiAgICAgIHJldHVybiB0b1VpbnQzMjtcbiAgICB9XG4gIH07XG59KTtcblN5c3RlbS5yZWdpc3RlcihcInRyYWNldXItcnVudGltZUAwLjAuMzIvc3JjL3J1bnRpbWUvcG9seWZpbGxzL0FycmF5SXRlcmF0b3JcIiwgW10sIGZ1bmN0aW9uKCkge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgdmFyICRfXzQ7XG4gIHZhciBfX21vZHVsZU5hbWUgPSBcInRyYWNldXItcnVudGltZUAwLjAuMzIvc3JjL3J1bnRpbWUvcG9seWZpbGxzL0FycmF5SXRlcmF0b3JcIjtcbiAgdmFyICRfXzUgPSBTeXN0ZW0uZ2V0KFwidHJhY2V1ci1ydW50aW1lQDAuMC4zMi9zcmMvcnVudGltZS9wb2x5ZmlsbHMvdXRpbHNcIiksXG4gICAgICB0b09iamVjdCA9ICRfXzUudG9PYmplY3QsXG4gICAgICB0b1VpbnQzMiA9ICRfXzUudG9VaW50MzI7XG4gIHZhciBBUlJBWV9JVEVSQVRPUl9LSU5EX0tFWVMgPSAxO1xuICB2YXIgQVJSQVlfSVRFUkFUT1JfS0lORF9WQUxVRVMgPSAyO1xuICB2YXIgQVJSQVlfSVRFUkFUT1JfS0lORF9FTlRSSUVTID0gMztcbiAgdmFyIEFycmF5SXRlcmF0b3IgPSBmdW5jdGlvbiBBcnJheUl0ZXJhdG9yKCkge307XG4gICgkdHJhY2V1clJ1bnRpbWUuY3JlYXRlQ2xhc3MpKEFycmF5SXRlcmF0b3IsICgkX180ID0ge30sIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSgkX180LCBcIm5leHRcIiwge1xuICAgIHZhbHVlOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBpdGVyYXRvciA9IHRvT2JqZWN0KHRoaXMpO1xuICAgICAgdmFyIGFycmF5ID0gaXRlcmF0b3IuaXRlcmF0b3JPYmplY3RfO1xuICAgICAgaWYgKCFhcnJheSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdPYmplY3QgaXMgbm90IGFuIEFycmF5SXRlcmF0b3InKTtcbiAgICAgIH1cbiAgICAgIHZhciBpbmRleCA9IGl0ZXJhdG9yLmFycmF5SXRlcmF0b3JOZXh0SW5kZXhfO1xuICAgICAgdmFyIGl0ZW1LaW5kID0gaXRlcmF0b3IuYXJyYXlJdGVyYXRpb25LaW5kXztcbiAgICAgIHZhciBsZW5ndGggPSB0b1VpbnQzMihhcnJheS5sZW5ndGgpO1xuICAgICAgaWYgKGluZGV4ID49IGxlbmd0aCkge1xuICAgICAgICBpdGVyYXRvci5hcnJheUl0ZXJhdG9yTmV4dEluZGV4XyA9IEluZmluaXR5O1xuICAgICAgICByZXR1cm4gY3JlYXRlSXRlcmF0b3JSZXN1bHRPYmplY3QodW5kZWZpbmVkLCB0cnVlKTtcbiAgICAgIH1cbiAgICAgIGl0ZXJhdG9yLmFycmF5SXRlcmF0b3JOZXh0SW5kZXhfID0gaW5kZXggKyAxO1xuICAgICAgaWYgKGl0ZW1LaW5kID09IEFSUkFZX0lURVJBVE9SX0tJTkRfVkFMVUVTKVxuICAgICAgICByZXR1cm4gY3JlYXRlSXRlcmF0b3JSZXN1bHRPYmplY3QoYXJyYXlbaW5kZXhdLCBmYWxzZSk7XG4gICAgICBpZiAoaXRlbUtpbmQgPT0gQVJSQVlfSVRFUkFUT1JfS0lORF9FTlRSSUVTKVxuICAgICAgICByZXR1cm4gY3JlYXRlSXRlcmF0b3JSZXN1bHRPYmplY3QoW2luZGV4LCBhcnJheVtpbmRleF1dLCBmYWxzZSk7XG4gICAgICByZXR1cm4gY3JlYXRlSXRlcmF0b3JSZXN1bHRPYmplY3QoaW5kZXgsIGZhbHNlKTtcbiAgICB9LFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgIHdyaXRhYmxlOiB0cnVlXG4gIH0pLCBPYmplY3QuZGVmaW5lUHJvcGVydHkoJF9fNCwgU3ltYm9sLml0ZXJhdG9yLCB7XG4gICAgdmFsdWU6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICB3cml0YWJsZTogdHJ1ZVxuICB9KSwgJF9fNCksIHt9KTtcbiAgZnVuY3Rpb24gY3JlYXRlQXJyYXlJdGVyYXRvcihhcnJheSwga2luZCkge1xuICAgIHZhciBvYmplY3QgPSB0b09iamVjdChhcnJheSk7XG4gICAgdmFyIGl0ZXJhdG9yID0gbmV3IEFycmF5SXRlcmF0b3I7XG4gICAgaXRlcmF0b3IuaXRlcmF0b3JPYmplY3RfID0gb2JqZWN0O1xuICAgIGl0ZXJhdG9yLmFycmF5SXRlcmF0b3JOZXh0SW5kZXhfID0gMDtcbiAgICBpdGVyYXRvci5hcnJheUl0ZXJhdGlvbktpbmRfID0ga2luZDtcbiAgICByZXR1cm4gaXRlcmF0b3I7XG4gIH1cbiAgZnVuY3Rpb24gY3JlYXRlSXRlcmF0b3JSZXN1bHRPYmplY3QodmFsdWUsIGRvbmUpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgZG9uZTogZG9uZVxuICAgIH07XG4gIH1cbiAgZnVuY3Rpb24gZW50cmllcygpIHtcbiAgICByZXR1cm4gY3JlYXRlQXJyYXlJdGVyYXRvcih0aGlzLCBBUlJBWV9JVEVSQVRPUl9LSU5EX0VOVFJJRVMpO1xuICB9XG4gIGZ1bmN0aW9uIGtleXMoKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUFycmF5SXRlcmF0b3IodGhpcywgQVJSQVlfSVRFUkFUT1JfS0lORF9LRVlTKTtcbiAgfVxuICBmdW5jdGlvbiB2YWx1ZXMoKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUFycmF5SXRlcmF0b3IodGhpcywgQVJSQVlfSVRFUkFUT1JfS0lORF9WQUxVRVMpO1xuICB9XG4gIHJldHVybiB7XG4gICAgZ2V0IGVudHJpZXMoKSB7XG4gICAgICByZXR1cm4gZW50cmllcztcbiAgICB9LFxuICAgIGdldCBrZXlzKCkge1xuICAgICAgcmV0dXJuIGtleXM7XG4gICAgfSxcbiAgICBnZXQgdmFsdWVzKCkge1xuICAgICAgcmV0dXJuIHZhbHVlcztcbiAgICB9XG4gIH07XG59KTtcblN5c3RlbS5yZWdpc3RlcihcInRyYWNldXItcnVudGltZUAwLjAuMzIvbm9kZV9tb2R1bGVzL3JzdnAvbGliL3JzdnAvYXNhcFwiLCBbXSwgZnVuY3Rpb24oKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuICB2YXIgX19tb2R1bGVOYW1lID0gXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjMyL25vZGVfbW9kdWxlcy9yc3ZwL2xpYi9yc3ZwL2FzYXBcIjtcbiAgdmFyICRfX2RlZmF1bHQgPSBmdW5jdGlvbiBhc2FwKGNhbGxiYWNrLCBhcmcpIHtcbiAgICB2YXIgbGVuZ3RoID0gcXVldWUucHVzaChbY2FsbGJhY2ssIGFyZ10pO1xuICAgIGlmIChsZW5ndGggPT09IDEpIHtcbiAgICAgIHNjaGVkdWxlRmx1c2goKTtcbiAgICB9XG4gIH07XG4gIHZhciBicm93c2VyR2xvYmFsID0gKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSA/IHdpbmRvdyA6IHt9O1xuICB2YXIgQnJvd3Nlck11dGF0aW9uT2JzZXJ2ZXIgPSBicm93c2VyR2xvYmFsLk11dGF0aW9uT2JzZXJ2ZXIgfHwgYnJvd3Nlckdsb2JhbC5XZWJLaXRNdXRhdGlvbk9ic2VydmVyO1xuICBmdW5jdGlvbiB1c2VOZXh0VGljaygpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICBwcm9jZXNzLm5leHRUaWNrKGZsdXNoKTtcbiAgICB9O1xuICB9XG4gIGZ1bmN0aW9uIHVzZU11dGF0aW9uT2JzZXJ2ZXIoKSB7XG4gICAgdmFyIGl0ZXJhdGlvbnMgPSAwO1xuICAgIHZhciBvYnNlcnZlciA9IG5ldyBCcm93c2VyTXV0YXRpb25PYnNlcnZlcihmbHVzaCk7XG4gICAgdmFyIG5vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnJyk7XG4gICAgb2JzZXJ2ZXIub2JzZXJ2ZShub2RlLCB7Y2hhcmFjdGVyRGF0YTogdHJ1ZX0pO1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIG5vZGUuZGF0YSA9IChpdGVyYXRpb25zID0gKytpdGVyYXRpb25zICUgMik7XG4gICAgfTtcbiAgfVxuICBmdW5jdGlvbiB1c2VTZXRUaW1lb3V0KCkge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHNldFRpbWVvdXQoZmx1c2gsIDEpO1xuICAgIH07XG4gIH1cbiAgdmFyIHF1ZXVlID0gW107XG4gIGZ1bmN0aW9uIGZsdXNoKCkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcXVldWUubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciB0dXBsZSA9IHF1ZXVlW2ldO1xuICAgICAgdmFyIGNhbGxiYWNrID0gdHVwbGVbMF0sXG4gICAgICAgICAgYXJnID0gdHVwbGVbMV07XG4gICAgICBjYWxsYmFjayhhcmcpO1xuICAgIH1cbiAgICBxdWV1ZSA9IFtdO1xuICB9XG4gIHZhciBzY2hlZHVsZUZsdXNoO1xuICBpZiAodHlwZW9mIHByb2Nlc3MgIT09ICd1bmRlZmluZWQnICYmIHt9LnRvU3RyaW5nLmNhbGwocHJvY2VzcykgPT09ICdbb2JqZWN0IHByb2Nlc3NdJykge1xuICAgIHNjaGVkdWxlRmx1c2ggPSB1c2VOZXh0VGljaygpO1xuICB9IGVsc2UgaWYgKEJyb3dzZXJNdXRhdGlvbk9ic2VydmVyKSB7XG4gICAgc2NoZWR1bGVGbHVzaCA9IHVzZU11dGF0aW9uT2JzZXJ2ZXIoKTtcbiAgfSBlbHNlIHtcbiAgICBzY2hlZHVsZUZsdXNoID0gdXNlU2V0VGltZW91dCgpO1xuICB9XG4gIHJldHVybiB7Z2V0IGRlZmF1bHQoKSB7XG4gICAgICByZXR1cm4gJF9fZGVmYXVsdDtcbiAgICB9fTtcbn0pO1xuU3lzdGVtLnJlZ2lzdGVyKFwidHJhY2V1ci1ydW50aW1lQDAuMC4zMi9zcmMvcnVudGltZS9wb2x5ZmlsbHMvUHJvbWlzZVwiLCBbXSwgZnVuY3Rpb24oKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuICB2YXIgX19tb2R1bGVOYW1lID0gXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjMyL3NyYy9ydW50aW1lL3BvbHlmaWxscy9Qcm9taXNlXCI7XG4gIHZhciBhc3luYyA9IFN5c3RlbS5nZXQoXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjMyL25vZGVfbW9kdWxlcy9yc3ZwL2xpYi9yc3ZwL2FzYXBcIikuZGVmYXVsdDtcbiAgZnVuY3Rpb24gaXNQcm9taXNlKHgpIHtcbiAgICByZXR1cm4geCAmJiB0eXBlb2YgeCA9PT0gJ29iamVjdCcgJiYgeC5zdGF0dXNfICE9PSB1bmRlZmluZWQ7XG4gIH1cbiAgZnVuY3Rpb24gY2hhaW4ocHJvbWlzZSkge1xuICAgIHZhciBvblJlc29sdmUgPSBhcmd1bWVudHNbMV0gIT09ICh2b2lkIDApID8gYXJndW1lbnRzWzFdIDogKGZ1bmN0aW9uKHgpIHtcbiAgICAgIHJldHVybiB4O1xuICAgIH0pO1xuICAgIHZhciBvblJlamVjdCA9IGFyZ3VtZW50c1syXSAhPT0gKHZvaWQgMCkgPyBhcmd1bWVudHNbMl0gOiAoZnVuY3Rpb24oZSkge1xuICAgICAgdGhyb3cgZTtcbiAgICB9KTtcbiAgICB2YXIgZGVmZXJyZWQgPSBnZXREZWZlcnJlZChwcm9taXNlLmNvbnN0cnVjdG9yKTtcbiAgICBzd2l0Y2ggKHByb21pc2Uuc3RhdHVzXykge1xuICAgICAgY2FzZSB1bmRlZmluZWQ6XG4gICAgICAgIHRocm93IFR5cGVFcnJvcjtcbiAgICAgIGNhc2UgJ3BlbmRpbmcnOlxuICAgICAgICBwcm9taXNlLm9uUmVzb2x2ZV8ucHVzaChbZGVmZXJyZWQsIG9uUmVzb2x2ZV0pO1xuICAgICAgICBwcm9taXNlLm9uUmVqZWN0Xy5wdXNoKFtkZWZlcnJlZCwgb25SZWplY3RdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdyZXNvbHZlZCc6XG4gICAgICAgIHByb21pc2VSZWFjdChkZWZlcnJlZCwgb25SZXNvbHZlLCBwcm9taXNlLnZhbHVlXyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAncmVqZWN0ZWQnOlxuICAgICAgICBwcm9taXNlUmVhY3QoZGVmZXJyZWQsIG9uUmVqZWN0LCBwcm9taXNlLnZhbHVlXyk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgfVxuICBmdW5jdGlvbiBnZXREZWZlcnJlZChDKSB7XG4gICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgIHJlc3VsdC5wcm9taXNlID0gbmV3IEMoKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgcmVzdWx0LnJlc29sdmUgPSByZXNvbHZlO1xuICAgICAgcmVzdWx0LnJlamVjdCA9IHJlamVjdDtcbiAgICB9KSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICB2YXIgUHJvbWlzZSA9IGZ1bmN0aW9uIFByb21pc2UocmVzb2x2ZXIpIHtcbiAgICB2YXIgJF9fNiA9IHRoaXM7XG4gICAgdGhpcy5zdGF0dXNfID0gJ3BlbmRpbmcnO1xuICAgIHRoaXMub25SZXNvbHZlXyA9IFtdO1xuICAgIHRoaXMub25SZWplY3RfID0gW107XG4gICAgcmVzb2x2ZXIoKGZ1bmN0aW9uKHgpIHtcbiAgICAgIHByb21pc2VSZXNvbHZlKCRfXzYsIHgpO1xuICAgIH0pLCAoZnVuY3Rpb24ocikge1xuICAgICAgcHJvbWlzZVJlamVjdCgkX182LCByKTtcbiAgICB9KSk7XG4gIH07XG4gICgkdHJhY2V1clJ1bnRpbWUuY3JlYXRlQ2xhc3MpKFByb21pc2UsIHtcbiAgICBjYXRjaDogZnVuY3Rpb24ob25SZWplY3QpIHtcbiAgICAgIHJldHVybiB0aGlzLnRoZW4odW5kZWZpbmVkLCBvblJlamVjdCk7XG4gICAgfSxcbiAgICB0aGVuOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBvblJlc29sdmUgPSBhcmd1bWVudHNbMF0gIT09ICh2b2lkIDApID8gYXJndW1lbnRzWzBdIDogKGZ1bmN0aW9uKHgpIHtcbiAgICAgICAgcmV0dXJuIHg7XG4gICAgICB9KTtcbiAgICAgIHZhciBvblJlamVjdCA9IGFyZ3VtZW50c1sxXTtcbiAgICAgIHZhciAkX182ID0gdGhpcztcbiAgICAgIHZhciBjb25zdHJ1Y3RvciA9IHRoaXMuY29uc3RydWN0b3I7XG4gICAgICByZXR1cm4gY2hhaW4odGhpcywgKGZ1bmN0aW9uKHgpIHtcbiAgICAgICAgeCA9IHByb21pc2VDb2VyY2UoY29uc3RydWN0b3IsIHgpO1xuICAgICAgICByZXR1cm4geCA9PT0gJF9fNiA/IG9uUmVqZWN0KG5ldyBUeXBlRXJyb3IpIDogaXNQcm9taXNlKHgpID8geC50aGVuKG9uUmVzb2x2ZSwgb25SZWplY3QpIDogb25SZXNvbHZlKHgpO1xuICAgICAgfSksIG9uUmVqZWN0KTtcbiAgICB9XG4gIH0sIHtcbiAgICByZXNvbHZlOiBmdW5jdGlvbih4KSB7XG4gICAgICByZXR1cm4gbmV3IHRoaXMoKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICByZXNvbHZlKHgpO1xuICAgICAgfSkpO1xuICAgIH0sXG4gICAgcmVqZWN0OiBmdW5jdGlvbihyKSB7XG4gICAgICByZXR1cm4gbmV3IHRoaXMoKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICByZWplY3Qocik7XG4gICAgICB9KSk7XG4gICAgfSxcbiAgICBjYXN0OiBmdW5jdGlvbih4KSB7XG4gICAgICBpZiAoeCBpbnN0YW5jZW9mIHRoaXMpXG4gICAgICAgIHJldHVybiB4O1xuICAgICAgaWYgKGlzUHJvbWlzZSh4KSkge1xuICAgICAgICB2YXIgcmVzdWx0ID0gZ2V0RGVmZXJyZWQodGhpcyk7XG4gICAgICAgIGNoYWluKHgsIHJlc3VsdC5yZXNvbHZlLCByZXN1bHQucmVqZWN0KTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdC5wcm9taXNlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMucmVzb2x2ZSh4KTtcbiAgICB9LFxuICAgIGFsbDogZnVuY3Rpb24odmFsdWVzKSB7XG4gICAgICB2YXIgZGVmZXJyZWQgPSBnZXREZWZlcnJlZCh0aGlzKTtcbiAgICAgIHZhciBjb3VudCA9IDA7XG4gICAgICB2YXIgcmVzb2x1dGlvbnMgPSBbXTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmFsdWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgKytjb3VudDtcbiAgICAgICAgICB0aGlzLmNhc3QodmFsdWVzW2ldKS50aGVuKGZ1bmN0aW9uKGksIHgpIHtcbiAgICAgICAgICAgIHJlc29sdXRpb25zW2ldID0geDtcbiAgICAgICAgICAgIGlmICgtLWNvdW50ID09PSAwKVxuICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHJlc29sdXRpb25zKTtcbiAgICAgICAgICB9LmJpbmQodW5kZWZpbmVkLCBpKSwgKGZ1bmN0aW9uKHIpIHtcbiAgICAgICAgICAgIGlmIChjb3VudCA+IDApXG4gICAgICAgICAgICAgIGNvdW50ID0gMDtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdChyKTtcbiAgICAgICAgICB9KSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvdW50ID09PSAwKVxuICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUocmVzb2x1dGlvbnMpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBkZWZlcnJlZC5yZWplY3QoZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICB9LFxuICAgIHJhY2U6IGZ1bmN0aW9uKHZhbHVlcykge1xuICAgICAgdmFyIGRlZmVycmVkID0gZ2V0RGVmZXJyZWQodGhpcyk7XG4gICAgICB0cnkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZhbHVlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHRoaXMuY2FzdCh2YWx1ZXNbaV0pLnRoZW4oKGZ1bmN0aW9uKHgpIHtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoeCk7XG4gICAgICAgICAgfSksIChmdW5jdGlvbihyKSB7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZWplY3Qocik7XG4gICAgICAgICAgfSkpO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGRlZmVycmVkLnJlamVjdChlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgIH1cbiAgfSk7XG4gIGZ1bmN0aW9uIHByb21pc2VSZXNvbHZlKHByb21pc2UsIHgpIHtcbiAgICBwcm9taXNlRG9uZShwcm9taXNlLCAncmVzb2x2ZWQnLCB4LCBwcm9taXNlLm9uUmVzb2x2ZV8pO1xuICB9XG4gIGZ1bmN0aW9uIHByb21pc2VSZWplY3QocHJvbWlzZSwgcikge1xuICAgIHByb21pc2VEb25lKHByb21pc2UsICdyZWplY3RlZCcsIHIsIHByb21pc2Uub25SZWplY3RfKTtcbiAgfVxuICBmdW5jdGlvbiBwcm9taXNlRG9uZShwcm9taXNlLCBzdGF0dXMsIHZhbHVlLCByZWFjdGlvbnMpIHtcbiAgICBpZiAocHJvbWlzZS5zdGF0dXNfICE9PSAncGVuZGluZycpXG4gICAgICByZXR1cm47XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZWFjdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHByb21pc2VSZWFjdChyZWFjdGlvbnNbaV1bMF0sIHJlYWN0aW9uc1tpXVsxXSwgdmFsdWUpO1xuICAgIH1cbiAgICBwcm9taXNlLnN0YXR1c18gPSBzdGF0dXM7XG4gICAgcHJvbWlzZS52YWx1ZV8gPSB2YWx1ZTtcbiAgICBwcm9taXNlLm9uUmVzb2x2ZV8gPSBwcm9taXNlLm9uUmVqZWN0XyA9IHVuZGVmaW5lZDtcbiAgfVxuICBmdW5jdGlvbiBwcm9taXNlUmVhY3QoZGVmZXJyZWQsIGhhbmRsZXIsIHgpIHtcbiAgICBhc3luYygoZnVuY3Rpb24oKSB7XG4gICAgICB0cnkge1xuICAgICAgICB2YXIgeSA9IGhhbmRsZXIoeCk7XG4gICAgICAgIGlmICh5ID09PSBkZWZlcnJlZC5wcm9taXNlKVxuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3I7XG4gICAgICAgIGVsc2UgaWYgKGlzUHJvbWlzZSh5KSlcbiAgICAgICAgICBjaGFpbih5LCBkZWZlcnJlZC5yZXNvbHZlLCBkZWZlcnJlZC5yZWplY3QpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSh5KTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgZGVmZXJyZWQucmVqZWN0KGUpO1xuICAgICAgfVxuICAgIH0pKTtcbiAgfVxuICB2YXIgdGhlbmFibGVTeW1ib2wgPSAnQEB0aGVuYWJsZSc7XG4gIGZ1bmN0aW9uIHByb21pc2VDb2VyY2UoY29uc3RydWN0b3IsIHgpIHtcbiAgICBpZiAoaXNQcm9taXNlKHgpKSB7XG4gICAgICByZXR1cm4geDtcbiAgICB9IGVsc2UgaWYgKHggJiYgdHlwZW9mIHgudGhlbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdmFyIHAgPSB4W3RoZW5hYmxlU3ltYm9sXTtcbiAgICAgIGlmIChwKSB7XG4gICAgICAgIHJldHVybiBwO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIGRlZmVycmVkID0gZ2V0RGVmZXJyZWQoY29uc3RydWN0b3IpO1xuICAgICAgICB4W3RoZW5hYmxlU3ltYm9sXSA9IGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgeC50aGVuKGRlZmVycmVkLnJlc29sdmUsIGRlZmVycmVkLnJlamVjdCk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB4O1xuICAgIH1cbiAgfVxuICByZXR1cm4ge2dldCBQcm9taXNlKCkge1xuICAgICAgcmV0dXJuIFByb21pc2U7XG4gICAgfX07XG59KTtcblN5c3RlbS5yZWdpc3RlcihcInRyYWNldXItcnVudGltZUAwLjAuMzIvc3JjL3J1bnRpbWUvcG9seWZpbGxzL1N0cmluZ1wiLCBbXSwgZnVuY3Rpb24oKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuICB2YXIgX19tb2R1bGVOYW1lID0gXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjMyL3NyYy9ydW50aW1lL3BvbHlmaWxscy9TdHJpbmdcIjtcbiAgdmFyICR0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG4gIHZhciAkaW5kZXhPZiA9IFN0cmluZy5wcm90b3R5cGUuaW5kZXhPZjtcbiAgdmFyICRsYXN0SW5kZXhPZiA9IFN0cmluZy5wcm90b3R5cGUubGFzdEluZGV4T2Y7XG4gIGZ1bmN0aW9uIHN0YXJ0c1dpdGgoc2VhcmNoKSB7XG4gICAgdmFyIHN0cmluZyA9IFN0cmluZyh0aGlzKTtcbiAgICBpZiAodGhpcyA9PSBudWxsIHx8ICR0b1N0cmluZy5jYWxsKHNlYXJjaCkgPT0gJ1tvYmplY3QgUmVnRXhwXScpIHtcbiAgICAgIHRocm93IFR5cGVFcnJvcigpO1xuICAgIH1cbiAgICB2YXIgc3RyaW5nTGVuZ3RoID0gc3RyaW5nLmxlbmd0aDtcbiAgICB2YXIgc2VhcmNoU3RyaW5nID0gU3RyaW5nKHNlYXJjaCk7XG4gICAgdmFyIHNlYXJjaExlbmd0aCA9IHNlYXJjaFN0cmluZy5sZW5ndGg7XG4gICAgdmFyIHBvc2l0aW9uID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWQ7XG4gICAgdmFyIHBvcyA9IHBvc2l0aW9uID8gTnVtYmVyKHBvc2l0aW9uKSA6IDA7XG4gICAgaWYgKGlzTmFOKHBvcykpIHtcbiAgICAgIHBvcyA9IDA7XG4gICAgfVxuICAgIHZhciBzdGFydCA9IE1hdGgubWluKE1hdGgubWF4KHBvcywgMCksIHN0cmluZ0xlbmd0aCk7XG4gICAgcmV0dXJuICRpbmRleE9mLmNhbGwoc3RyaW5nLCBzZWFyY2hTdHJpbmcsIHBvcykgPT0gc3RhcnQ7XG4gIH1cbiAgZnVuY3Rpb24gZW5kc1dpdGgoc2VhcmNoKSB7XG4gICAgdmFyIHN0cmluZyA9IFN0cmluZyh0aGlzKTtcbiAgICBpZiAodGhpcyA9PSBudWxsIHx8ICR0b1N0cmluZy5jYWxsKHNlYXJjaCkgPT0gJ1tvYmplY3QgUmVnRXhwXScpIHtcbiAgICAgIHRocm93IFR5cGVFcnJvcigpO1xuICAgIH1cbiAgICB2YXIgc3RyaW5nTGVuZ3RoID0gc3RyaW5nLmxlbmd0aDtcbiAgICB2YXIgc2VhcmNoU3RyaW5nID0gU3RyaW5nKHNlYXJjaCk7XG4gICAgdmFyIHNlYXJjaExlbmd0aCA9IHNlYXJjaFN0cmluZy5sZW5ndGg7XG4gICAgdmFyIHBvcyA9IHN0cmluZ0xlbmd0aDtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgIHZhciBwb3NpdGlvbiA9IGFyZ3VtZW50c1sxXTtcbiAgICAgIGlmIChwb3NpdGlvbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHBvcyA9IHBvc2l0aW9uID8gTnVtYmVyKHBvc2l0aW9uKSA6IDA7XG4gICAgICAgIGlmIChpc05hTihwb3MpKSB7XG4gICAgICAgICAgcG9zID0gMDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICB2YXIgZW5kID0gTWF0aC5taW4oTWF0aC5tYXgocG9zLCAwKSwgc3RyaW5nTGVuZ3RoKTtcbiAgICB2YXIgc3RhcnQgPSBlbmQgLSBzZWFyY2hMZW5ndGg7XG4gICAgaWYgKHN0YXJ0IDwgMCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gJGxhc3RJbmRleE9mLmNhbGwoc3RyaW5nLCBzZWFyY2hTdHJpbmcsIHN0YXJ0KSA9PSBzdGFydDtcbiAgfVxuICBmdW5jdGlvbiBjb250YWlucyhzZWFyY2gpIHtcbiAgICBpZiAodGhpcyA9PSBudWxsKSB7XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoKTtcbiAgICB9XG4gICAgdmFyIHN0cmluZyA9IFN0cmluZyh0aGlzKTtcbiAgICB2YXIgc3RyaW5nTGVuZ3RoID0gc3RyaW5nLmxlbmd0aDtcbiAgICB2YXIgc2VhcmNoU3RyaW5nID0gU3RyaW5nKHNlYXJjaCk7XG4gICAgdmFyIHNlYXJjaExlbmd0aCA9IHNlYXJjaFN0cmluZy5sZW5ndGg7XG4gICAgdmFyIHBvc2l0aW9uID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWQ7XG4gICAgdmFyIHBvcyA9IHBvc2l0aW9uID8gTnVtYmVyKHBvc2l0aW9uKSA6IDA7XG4gICAgaWYgKGlzTmFOKHBvcykpIHtcbiAgICAgIHBvcyA9IDA7XG4gICAgfVxuICAgIHZhciBzdGFydCA9IE1hdGgubWluKE1hdGgubWF4KHBvcywgMCksIHN0cmluZ0xlbmd0aCk7XG4gICAgcmV0dXJuICRpbmRleE9mLmNhbGwoc3RyaW5nLCBzZWFyY2hTdHJpbmcsIHBvcykgIT0gLTE7XG4gIH1cbiAgZnVuY3Rpb24gcmVwZWF0KGNvdW50KSB7XG4gICAgaWYgKHRoaXMgPT0gbnVsbCkge1xuICAgICAgdGhyb3cgVHlwZUVycm9yKCk7XG4gICAgfVxuICAgIHZhciBzdHJpbmcgPSBTdHJpbmcodGhpcyk7XG4gICAgdmFyIG4gPSBjb3VudCA/IE51bWJlcihjb3VudCkgOiAwO1xuICAgIGlmIChpc05hTihuKSkge1xuICAgICAgbiA9IDA7XG4gICAgfVxuICAgIGlmIChuIDwgMCB8fCBuID09IEluZmluaXR5KSB7XG4gICAgICB0aHJvdyBSYW5nZUVycm9yKCk7XG4gICAgfVxuICAgIGlmIChuID09IDApIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG4gICAgdmFyIHJlc3VsdCA9ICcnO1xuICAgIHdoaWxlIChuLS0pIHtcbiAgICAgIHJlc3VsdCArPSBzdHJpbmc7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgZnVuY3Rpb24gY29kZVBvaW50QXQocG9zaXRpb24pIHtcbiAgICBpZiAodGhpcyA9PSBudWxsKSB7XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoKTtcbiAgICB9XG4gICAgdmFyIHN0cmluZyA9IFN0cmluZyh0aGlzKTtcbiAgICB2YXIgc2l6ZSA9IHN0cmluZy5sZW5ndGg7XG4gICAgdmFyIGluZGV4ID0gcG9zaXRpb24gPyBOdW1iZXIocG9zaXRpb24pIDogMDtcbiAgICBpZiAoaXNOYU4oaW5kZXgpKSB7XG4gICAgICBpbmRleCA9IDA7XG4gICAgfVxuICAgIGlmIChpbmRleCA8IDAgfHwgaW5kZXggPj0gc2l6ZSkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgdmFyIGZpcnN0ID0gc3RyaW5nLmNoYXJDb2RlQXQoaW5kZXgpO1xuICAgIHZhciBzZWNvbmQ7XG4gICAgaWYgKGZpcnN0ID49IDB4RDgwMCAmJiBmaXJzdCA8PSAweERCRkYgJiYgc2l6ZSA+IGluZGV4ICsgMSkge1xuICAgICAgc2Vjb25kID0gc3RyaW5nLmNoYXJDb2RlQXQoaW5kZXggKyAxKTtcbiAgICAgIGlmIChzZWNvbmQgPj0gMHhEQzAwICYmIHNlY29uZCA8PSAweERGRkYpIHtcbiAgICAgICAgcmV0dXJuIChmaXJzdCAtIDB4RDgwMCkgKiAweDQwMCArIHNlY29uZCAtIDB4REMwMCArIDB4MTAwMDA7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmaXJzdDtcbiAgfVxuICBmdW5jdGlvbiByYXcoY2FsbHNpdGUpIHtcbiAgICB2YXIgcmF3ID0gY2FsbHNpdGUucmF3O1xuICAgIHZhciBsZW4gPSByYXcubGVuZ3RoID4+PiAwO1xuICAgIGlmIChsZW4gPT09IDApXG4gICAgICByZXR1cm4gJyc7XG4gICAgdmFyIHMgPSAnJztcbiAgICB2YXIgaSA9IDA7XG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgIHMgKz0gcmF3W2ldO1xuICAgICAgaWYgKGkgKyAxID09PSBsZW4pXG4gICAgICAgIHJldHVybiBzO1xuICAgICAgcyArPSBhcmd1bWVudHNbKytpXTtcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gZnJvbUNvZGVQb2ludCgpIHtcbiAgICB2YXIgY29kZVVuaXRzID0gW107XG4gICAgdmFyIGZsb29yID0gTWF0aC5mbG9vcjtcbiAgICB2YXIgaGlnaFN1cnJvZ2F0ZTtcbiAgICB2YXIgbG93U3Vycm9nYXRlO1xuICAgIHZhciBpbmRleCA9IC0xO1xuICAgIHZhciBsZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgIGlmICghbGVuZ3RoKSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgICB2YXIgY29kZVBvaW50ID0gTnVtYmVyKGFyZ3VtZW50c1tpbmRleF0pO1xuICAgICAgaWYgKCFpc0Zpbml0ZShjb2RlUG9pbnQpIHx8IGNvZGVQb2ludCA8IDAgfHwgY29kZVBvaW50ID4gMHgxMEZGRkYgfHwgZmxvb3IoY29kZVBvaW50KSAhPSBjb2RlUG9pbnQpIHtcbiAgICAgICAgdGhyb3cgUmFuZ2VFcnJvcignSW52YWxpZCBjb2RlIHBvaW50OiAnICsgY29kZVBvaW50KTtcbiAgICAgIH1cbiAgICAgIGlmIChjb2RlUG9pbnQgPD0gMHhGRkZGKSB7XG4gICAgICAgIGNvZGVVbml0cy5wdXNoKGNvZGVQb2ludCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb2RlUG9pbnQgLT0gMHgxMDAwMDtcbiAgICAgICAgaGlnaFN1cnJvZ2F0ZSA9IChjb2RlUG9pbnQgPj4gMTApICsgMHhEODAwO1xuICAgICAgICBsb3dTdXJyb2dhdGUgPSAoY29kZVBvaW50ICUgMHg0MDApICsgMHhEQzAwO1xuICAgICAgICBjb2RlVW5pdHMucHVzaChoaWdoU3Vycm9nYXRlLCBsb3dTdXJyb2dhdGUpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShudWxsLCBjb2RlVW5pdHMpO1xuICB9XG4gIHJldHVybiB7XG4gICAgZ2V0IHN0YXJ0c1dpdGgoKSB7XG4gICAgICByZXR1cm4gc3RhcnRzV2l0aDtcbiAgICB9LFxuICAgIGdldCBlbmRzV2l0aCgpIHtcbiAgICAgIHJldHVybiBlbmRzV2l0aDtcbiAgICB9LFxuICAgIGdldCBjb250YWlucygpIHtcbiAgICAgIHJldHVybiBjb250YWlucztcbiAgICB9LFxuICAgIGdldCByZXBlYXQoKSB7XG4gICAgICByZXR1cm4gcmVwZWF0O1xuICAgIH0sXG4gICAgZ2V0IGNvZGVQb2ludEF0KCkge1xuICAgICAgcmV0dXJuIGNvZGVQb2ludEF0O1xuICAgIH0sXG4gICAgZ2V0IHJhdygpIHtcbiAgICAgIHJldHVybiByYXc7XG4gICAgfSxcbiAgICBnZXQgZnJvbUNvZGVQb2ludCgpIHtcbiAgICAgIHJldHVybiBmcm9tQ29kZVBvaW50O1xuICAgIH1cbiAgfTtcbn0pO1xuU3lzdGVtLnJlZ2lzdGVyKFwidHJhY2V1ci1ydW50aW1lQDAuMC4zMi9zcmMvcnVudGltZS9wb2x5ZmlsbHMvcG9seWZpbGxzXCIsIFtdLCBmdW5jdGlvbigpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG4gIHZhciBfX21vZHVsZU5hbWUgPSBcInRyYWNldXItcnVudGltZUAwLjAuMzIvc3JjL3J1bnRpbWUvcG9seWZpbGxzL3BvbHlmaWxsc1wiO1xuICB2YXIgUHJvbWlzZSA9IFN5c3RlbS5nZXQoXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjMyL3NyYy9ydW50aW1lL3BvbHlmaWxscy9Qcm9taXNlXCIpLlByb21pc2U7XG4gIHZhciAkX185ID0gU3lzdGVtLmdldChcInRyYWNldXItcnVudGltZUAwLjAuMzIvc3JjL3J1bnRpbWUvcG9seWZpbGxzL1N0cmluZ1wiKSxcbiAgICAgIGNvZGVQb2ludEF0ID0gJF9fOS5jb2RlUG9pbnRBdCxcbiAgICAgIGNvbnRhaW5zID0gJF9fOS5jb250YWlucyxcbiAgICAgIGVuZHNXaXRoID0gJF9fOS5lbmRzV2l0aCxcbiAgICAgIGZyb21Db2RlUG9pbnQgPSAkX185LmZyb21Db2RlUG9pbnQsXG4gICAgICByZXBlYXQgPSAkX185LnJlcGVhdCxcbiAgICAgIHJhdyA9ICRfXzkucmF3LFxuICAgICAgc3RhcnRzV2l0aCA9ICRfXzkuc3RhcnRzV2l0aDtcbiAgdmFyICRfXzkgPSBTeXN0ZW0uZ2V0KFwidHJhY2V1ci1ydW50aW1lQDAuMC4zMi9zcmMvcnVudGltZS9wb2x5ZmlsbHMvQXJyYXlJdGVyYXRvclwiKSxcbiAgICAgIGVudHJpZXMgPSAkX185LmVudHJpZXMsXG4gICAgICBrZXlzID0gJF9fOS5rZXlzLFxuICAgICAgdmFsdWVzID0gJF9fOS52YWx1ZXM7XG4gIGZ1bmN0aW9uIG1heWJlRGVmaW5lTWV0aG9kKG9iamVjdCwgbmFtZSwgdmFsdWUpIHtcbiAgICBpZiAoIShuYW1lIGluIG9iamVjdCkpIHtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsIG5hbWUsIHtcbiAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZVxuICAgICAgfSk7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIG1heWJlQWRkRnVuY3Rpb25zKG9iamVjdCwgZnVuY3Rpb25zKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmdW5jdGlvbnMubGVuZ3RoOyBpICs9IDIpIHtcbiAgICAgIHZhciBuYW1lID0gZnVuY3Rpb25zW2ldO1xuICAgICAgdmFyIHZhbHVlID0gZnVuY3Rpb25zW2kgKyAxXTtcbiAgICAgIG1heWJlRGVmaW5lTWV0aG9kKG9iamVjdCwgbmFtZSwgdmFsdWUpO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBwb2x5ZmlsbFByb21pc2UoZ2xvYmFsKSB7XG4gICAgaWYgKCFnbG9iYWwuUHJvbWlzZSlcbiAgICAgIGdsb2JhbC5Qcm9taXNlID0gUHJvbWlzZTtcbiAgfVxuICBmdW5jdGlvbiBwb2x5ZmlsbFN0cmluZyhTdHJpbmcpIHtcbiAgICBtYXliZUFkZEZ1bmN0aW9ucyhTdHJpbmcucHJvdG90eXBlLCBbJ2NvZGVQb2ludEF0JywgY29kZVBvaW50QXQsICdjb250YWlucycsIGNvbnRhaW5zLCAnZW5kc1dpdGgnLCBlbmRzV2l0aCwgJ3N0YXJ0c1dpdGgnLCBzdGFydHNXaXRoLCAncmVwZWF0JywgcmVwZWF0XSk7XG4gICAgbWF5YmVBZGRGdW5jdGlvbnMoU3RyaW5nLCBbJ2Zyb21Db2RlUG9pbnQnLCBmcm9tQ29kZVBvaW50LCAncmF3JywgcmF3XSk7XG4gIH1cbiAgZnVuY3Rpb24gcG9seWZpbGxBcnJheShBcnJheSwgU3ltYm9sKSB7XG4gICAgbWF5YmVBZGRGdW5jdGlvbnMoQXJyYXkucHJvdG90eXBlLCBbJ2VudHJpZXMnLCBlbnRyaWVzLCAna2V5cycsIGtleXMsICd2YWx1ZXMnLCB2YWx1ZXNdKTtcbiAgICBpZiAoU3ltYm9sICYmIFN5bWJvbC5pdGVyYXRvcikge1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEFycmF5LnByb3RvdHlwZSwgU3ltYm9sLml0ZXJhdG9yLCB7XG4gICAgICAgIHZhbHVlOiB2YWx1ZXMsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlXG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gcG9seWZpbGwoZ2xvYmFsKSB7XG4gICAgcG9seWZpbGxQcm9taXNlKGdsb2JhbCk7XG4gICAgcG9seWZpbGxTdHJpbmcoZ2xvYmFsLlN0cmluZyk7XG4gICAgcG9seWZpbGxBcnJheShnbG9iYWwuQXJyYXksIGdsb2JhbC5TeW1ib2wpO1xuICB9XG4gIHBvbHlmaWxsKHRoaXMpO1xuICB2YXIgc2V0dXBHbG9iYWxzID0gJHRyYWNldXJSdW50aW1lLnNldHVwR2xvYmFscztcbiAgJHRyYWNldXJSdW50aW1lLnNldHVwR2xvYmFscyA9IGZ1bmN0aW9uKGdsb2JhbCkge1xuICAgIHNldHVwR2xvYmFscyhnbG9iYWwpO1xuICAgIHBvbHlmaWxsKGdsb2JhbCk7XG4gIH07XG4gIHJldHVybiB7fTtcbn0pO1xuU3lzdGVtLnJlZ2lzdGVyKFwidHJhY2V1ci1ydW50aW1lQDAuMC4zMi9zcmMvcnVudGltZS9wb2x5ZmlsbC1pbXBvcnRcIiwgW10sIGZ1bmN0aW9uKCkge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgdmFyIF9fbW9kdWxlTmFtZSA9IFwidHJhY2V1ci1ydW50aW1lQDAuMC4zMi9zcmMvcnVudGltZS9wb2x5ZmlsbC1pbXBvcnRcIjtcbiAgdmFyICRfXzExID0gU3lzdGVtLmdldChcInRyYWNldXItcnVudGltZUAwLjAuMzIvc3JjL3J1bnRpbWUvcG9seWZpbGxzL3BvbHlmaWxsc1wiKTtcbiAgcmV0dXJuIHt9O1xufSk7XG5TeXN0ZW0uZ2V0KFwidHJhY2V1ci1ydW50aW1lQDAuMC4zMi9zcmMvcnVudGltZS9wb2x5ZmlsbC1pbXBvcnRcIiArICcnKTtcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCIvVXNlcnMvZnJhbmNvcG9udGljZWxsaS9wcm9qZWN0cy9jYXJkcy9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvaW5zZXJ0LW1vZHVsZS1nbG9iYWxzL25vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanNcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KSIsIlwidXNlIHN0cmljdFwiO1xuZXhwb3J0cy50ZXN0ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBmYWxzZTtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgdHlwZXMgPSBbXG4gICAgcmVxdWlyZShcIi4vbmV4dFRpY2tcIiksXG4gICAgcmVxdWlyZShcIi4vbXV0YXRpb25cIiksXG4gICAgcmVxdWlyZShcIi4vcG9zdE1lc3NhZ2VcIiksXG4gICAgcmVxdWlyZShcIi4vbWVzc2FnZUNoYW5uZWxcIiksXG4gICAgcmVxdWlyZShcIi4vc3RhdGVDaGFuZ2VcIiksXG4gICAgcmVxdWlyZShcIi4vdGltZW91dFwiKVxuXTtcbnZhciBoYW5kbGVyUXVldWUgPSBbXTtcbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgdmFyIGkgPSAwLFxuICAgICAgICB0YXNrLFxuICAgICAgICBpbm5lclF1ZXVlID0gaGFuZGxlclF1ZXVlO1xuXHRoYW5kbGVyUXVldWUgPSBbXTtcblx0Lypqc2xpbnQgYm9zczogdHJ1ZSAqL1xuXHR3aGlsZSAodGFzayA9IGlubmVyUXVldWVbaSsrXSkge1xuXHRcdHRhc2soKTtcblx0fVxufVxudmFyIG5leHRUaWNrO1xudmFyIGkgPSAtMTtcbnZhciBsZW4gPSB0eXBlcy5sZW5ndGg7XG53aGlsZSAoKysgaSA8IGxlbikge1xuICAgIGlmICh0eXBlc1tpXS50ZXN0KCkpIHtcbiAgICAgICAgbmV4dFRpY2sgPSB0eXBlc1tpXS5pbnN0YWxsKGRyYWluUXVldWUpO1xuICAgICAgICBicmVhaztcbiAgICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh0YXNrKSB7XG4gICAgdmFyIGxlbiwgaSwgYXJncztcbiAgICB2YXIgblRhc2sgPSB0YXNrO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSAmJiB0eXBlb2YgdGFzayA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgICAgICBpID0gMDtcbiAgICAgICAgd2hpbGUgKCsraSA8IGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgICAgIG5UYXNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGFzay5hcHBseSh1bmRlZmluZWQsIGFyZ3MpO1xuICAgICAgICB9O1xuICAgIH1cbiAgICBpZiAoKGxlbiA9IGhhbmRsZXJRdWV1ZS5wdXNoKG5UYXNrKSkgPT09IDEpIHtcbiAgICAgICAgbmV4dFRpY2soZHJhaW5RdWV1ZSk7XG4gICAgfVxuICAgIHJldHVybiBsZW47XG59O1xubW9kdWxlLmV4cG9ydHMuY2xlYXIgPSBmdW5jdGlvbiAobikge1xuICAgIGlmIChuIDw9IGhhbmRsZXJRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgaGFuZGxlclF1ZXVlW24gLSAxXSA9IGZ1bmN0aW9uICgpIHt9O1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbn07XG4iLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG5cInVzZSBzdHJpY3RcIjtcblxuZXhwb3J0cy50ZXN0ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0eXBlb2YgZ2xvYmFsLk1lc3NhZ2VDaGFubmVsICE9PSBcInVuZGVmaW5lZFwiO1xufTtcblxuZXhwb3J0cy5pbnN0YWxsID0gZnVuY3Rpb24gKGZ1bmMpIHtcbiAgICB2YXIgY2hhbm5lbCA9IG5ldyBnbG9iYWwuTWVzc2FnZUNoYW5uZWwoKTtcbiAgICBjaGFubmVsLnBvcnQxLm9ubWVzc2FnZSA9IGZ1bmM7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2hhbm5lbC5wb3J0Mi5wb3N0TWVzc2FnZSgwKTtcbiAgICB9O1xufTtcbn0pLmNhbGwodGhpcyx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pIiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xuXCJ1c2Ugc3RyaWN0XCI7XG4vL2Jhc2VkIG9mZiByc3ZwXG4vL2h0dHBzOi8vZ2l0aHViLmNvbS90aWxkZWlvL3JzdnAuanMvYmxvYi9tYXN0ZXIvbGliL3JzdnAvYXN5bmMuanNcblxudmFyIE11dGF0aW9uT2JzZXJ2ZXIgPSBnbG9iYWwuTXV0YXRpb25PYnNlcnZlciB8fCBnbG9iYWwuV2ViS2l0TXV0YXRpb25PYnNlcnZlcjtcblxuZXhwb3J0cy50ZXN0ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBNdXRhdGlvbk9ic2VydmVyO1xufTtcblxuZXhwb3J0cy5pbnN0YWxsID0gZnVuY3Rpb24gKGhhbmRsZSkge1xuICAgIHZhciBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKGhhbmRsZSk7XG4gICAgdmFyIGVsZW1lbnQgPSBnbG9iYWwuZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBvYnNlcnZlci5vYnNlcnZlKGVsZW1lbnQsIHsgYXR0cmlidXRlczogdHJ1ZSB9KTtcblxuICAgIC8vIENocm9tZSBNZW1vcnkgTGVhazogaHR0cHM6Ly9idWdzLndlYmtpdC5vcmcvc2hvd19idWcuY2dpP2lkPTkzNjYxXG4gICAgZ2xvYmFsLmFkZEV2ZW50TGlzdGVuZXIoXCJ1bmxvYWRcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICBvYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgICAgIG9ic2VydmVyID0gbnVsbDtcbiAgICB9LCBmYWxzZSk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJkcmFpblF1ZXVlXCIsIFwiZHJhaW5RdWV1ZVwiKTtcbiAgICB9O1xufTtcbn0pLmNhbGwodGhpcyx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pIiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xuXCJ1c2Ugc3RyaWN0XCI7XG5leHBvcnRzLnRlc3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgLy8gVGhlIHRlc3QgYWdhaW5zdCBgaW1wb3J0U2NyaXB0c2AgcHJldmVudHMgdGhpcyBpbXBsZW1lbnRhdGlvbiBmcm9tIGJlaW5nIGluc3RhbGxlZCBpbnNpZGUgYSB3ZWIgd29ya2VyLFxuICAgIC8vIHdoZXJlIGBnbG9iYWwucG9zdE1lc3NhZ2VgIG1lYW5zIHNvbWV0aGluZyBjb21wbGV0ZWx5IGRpZmZlcmVudCBhbmQgY2FuXCJ0IGJlIHVzZWQgZm9yIHRoaXMgcHVycG9zZS5cblxuICAgIGlmICghZ2xvYmFsLnBvc3RNZXNzYWdlIHx8IGdsb2JhbC5pbXBvcnRTY3JpcHRzKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICB2YXIgcG9zdE1lc3NhZ2VJc0FzeW5jaHJvbm91cyA9IHRydWU7XG4gICAgdmFyIG9sZE9uTWVzc2FnZSA9IGdsb2JhbC5vbm1lc3NhZ2U7XG4gICAgZ2xvYmFsLm9ubWVzc2FnZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcG9zdE1lc3NhZ2VJc0FzeW5jaHJvbm91cyA9IGZhbHNlO1xuICAgIH07XG4gICAgZ2xvYmFsLnBvc3RNZXNzYWdlKFwiXCIsIFwiKlwiKTtcbiAgICBnbG9iYWwub25tZXNzYWdlID0gb2xkT25NZXNzYWdlO1xuXG4gICAgcmV0dXJuIHBvc3RNZXNzYWdlSXNBc3luY2hyb25vdXM7XG59O1xuXG5leHBvcnRzLmluc3RhbGwgPSBmdW5jdGlvbiAoZnVuYykge1xuICAgIHZhciBjb2RlV29yZCA9IFwiY29tLmNhbHZpbm1ldGNhbGYuc2V0SW1tZWRpYXRlXCIgKyBNYXRoLnJhbmRvbSgpO1xuICAgIGZ1bmN0aW9uIGdsb2JhbE1lc3NhZ2UoZXZlbnQpIHtcbiAgICAgICAgaWYgKGV2ZW50LnNvdXJjZSA9PT0gZ2xvYmFsICYmIGV2ZW50LmRhdGEgPT09IGNvZGVXb3JkKSB7XG4gICAgICAgICAgICBmdW5jKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKGdsb2JhbC5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgICAgIGdsb2JhbC5hZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCBnbG9iYWxNZXNzYWdlLCBmYWxzZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZ2xvYmFsLmF0dGFjaEV2ZW50KFwib25tZXNzYWdlXCIsIGdsb2JhbE1lc3NhZ2UpO1xuICAgIH1cbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICBnbG9iYWwucG9zdE1lc3NhZ2UoY29kZVdvcmQsIFwiKlwiKTtcbiAgICB9O1xufTtcbn0pLmNhbGwodGhpcyx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pIiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbmV4cG9ydHMudGVzdCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gXCJkb2N1bWVudFwiIGluIGdsb2JhbCAmJiBcIm9ucmVhZHlzdGF0ZWNoYW5nZVwiIGluIGdsb2JhbC5kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpO1xufTtcblxuZXhwb3J0cy5pbnN0YWxsID0gZnVuY3Rpb24gKGhhbmRsZSkge1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgLy8gQ3JlYXRlIGEgPHNjcmlwdD4gZWxlbWVudDsgaXRzIHJlYWR5c3RhdGVjaGFuZ2UgZXZlbnQgd2lsbCBiZSBmaXJlZCBhc3luY2hyb25vdXNseSBvbmNlIGl0IGlzIGluc2VydGVkXG4gICAgICAgIC8vIGludG8gdGhlIGRvY3VtZW50LiBEbyBzbywgdGh1cyBxdWV1aW5nIHVwIHRoZSB0YXNrLiBSZW1lbWJlciB0byBjbGVhbiB1cCBvbmNlIGl0J3MgYmVlbiBjYWxsZWQuXG4gICAgICAgIHZhciBzY3JpcHRFbCA9IGdsb2JhbC5kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpO1xuICAgICAgICBzY3JpcHRFbC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBoYW5kbGUoKTtcblxuICAgICAgICAgICAgc2NyaXB0RWwub25yZWFkeXN0YXRlY2hhbmdlID0gbnVsbDtcbiAgICAgICAgICAgIHNjcmlwdEVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc2NyaXB0RWwpO1xuICAgICAgICAgICAgc2NyaXB0RWwgPSBudWxsO1xuICAgICAgICB9O1xuICAgICAgICBnbG9iYWwuZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmFwcGVuZENoaWxkKHNjcmlwdEVsKTtcblxuICAgICAgICByZXR1cm4gaGFuZGxlO1xuICAgIH07XG59O1xufSkuY2FsbCh0aGlzLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCJcInVzZSBzdHJpY3RcIjtcbmV4cG9ydHMudGVzdCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbn07XG5cbmV4cG9ydHMuaW5zdGFsbCA9IGZ1bmN0aW9uICh0KSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc2V0VGltZW91dCh0LCAwKTtcbiAgICB9O1xufTsiLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG4hZnVuY3Rpb24oZSl7aWYoXCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHMpbW9kdWxlLmV4cG9ydHM9ZSgpO2Vsc2UgaWYoXCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kKWRlZmluZShlKTtlbHNle3ZhciBmO1widW5kZWZpbmVkXCIhPXR5cGVvZiB3aW5kb3c/Zj13aW5kb3c6XCJ1bmRlZmluZWRcIiE9dHlwZW9mIGdsb2JhbD9mPWdsb2JhbDpcInVuZGVmaW5lZFwiIT10eXBlb2Ygc2VsZiYmKGY9c2VsZiksZi5qYWRlPWUoKX19KGZ1bmN0aW9uKCl7dmFyIGRlZmluZSxtb2R1bGUsZXhwb3J0cztyZXR1cm4gKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkoezE6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpe1xuJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIE1lcmdlIHR3byBhdHRyaWJ1dGUgb2JqZWN0cyBnaXZpbmcgcHJlY2VkZW5jZVxuICogdG8gdmFsdWVzIGluIG9iamVjdCBgYmAuIENsYXNzZXMgYXJlIHNwZWNpYWwtY2FzZWRcbiAqIGFsbG93aW5nIGZvciBhcnJheXMgYW5kIG1lcmdpbmcvam9pbmluZyBhcHByb3ByaWF0ZWx5XG4gKiByZXN1bHRpbmcgaW4gYSBzdHJpbmcuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGFcbiAqIEBwYXJhbSB7T2JqZWN0fSBiXG4gKiBAcmV0dXJuIHtPYmplY3R9IGFcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmV4cG9ydHMubWVyZ2UgPSBmdW5jdGlvbiBtZXJnZShhLCBiKSB7XG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgdmFyIGF0dHJzID0gYVswXTtcbiAgICBmb3IgKHZhciBpID0gMTsgaSA8IGEubGVuZ3RoOyBpKyspIHtcbiAgICAgIGF0dHJzID0gbWVyZ2UoYXR0cnMsIGFbaV0pO1xuICAgIH1cbiAgICByZXR1cm4gYXR0cnM7XG4gIH1cbiAgdmFyIGFjID0gYVsnY2xhc3MnXTtcbiAgdmFyIGJjID0gYlsnY2xhc3MnXTtcblxuICBpZiAoYWMgfHwgYmMpIHtcbiAgICBhYyA9IGFjIHx8IFtdO1xuICAgIGJjID0gYmMgfHwgW107XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGFjKSkgYWMgPSBbYWNdO1xuICAgIGlmICghQXJyYXkuaXNBcnJheShiYykpIGJjID0gW2JjXTtcbiAgICBhWydjbGFzcyddID0gYWMuY29uY2F0KGJjKS5maWx0ZXIobnVsbHMpO1xuICB9XG5cbiAgZm9yICh2YXIga2V5IGluIGIpIHtcbiAgICBpZiAoa2V5ICE9ICdjbGFzcycpIHtcbiAgICAgIGFba2V5XSA9IGJba2V5XTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gYTtcbn07XG5cbi8qKlxuICogRmlsdGVyIG51bGwgYHZhbGBzLlxuICpcbiAqIEBwYXJhbSB7Kn0gdmFsXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gbnVsbHModmFsKSB7XG4gIHJldHVybiB2YWwgIT0gbnVsbCAmJiB2YWwgIT09ICcnO1xufVxuXG4vKipcbiAqIGpvaW4gYXJyYXkgYXMgY2xhc3Nlcy5cbiAqXG4gKiBAcGFyYW0geyp9IHZhbFxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5leHBvcnRzLmpvaW5DbGFzc2VzID0gam9pbkNsYXNzZXM7XG5mdW5jdGlvbiBqb2luQ2xhc3Nlcyh2YWwpIHtcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkodmFsKSA/IHZhbC5tYXAoam9pbkNsYXNzZXMpLmZpbHRlcihudWxscykuam9pbignICcpIDogdmFsO1xufVxuXG4vKipcbiAqIFJlbmRlciB0aGUgZ2l2ZW4gY2xhc3Nlcy5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBjbGFzc2VzXG4gKiBAcGFyYW0ge0FycmF5LjxCb29sZWFuPn0gZXNjYXBlZFxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5leHBvcnRzLmNscyA9IGZ1bmN0aW9uIGNscyhjbGFzc2VzLCBlc2NhcGVkKSB7XG4gIHZhciBidWYgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBjbGFzc2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKGVzY2FwZWQgJiYgZXNjYXBlZFtpXSkge1xuICAgICAgYnVmLnB1c2goZXhwb3J0cy5lc2NhcGUoam9pbkNsYXNzZXMoW2NsYXNzZXNbaV1dKSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBidWYucHVzaChqb2luQ2xhc3NlcyhjbGFzc2VzW2ldKSk7XG4gICAgfVxuICB9XG4gIHZhciB0ZXh0ID0gam9pbkNsYXNzZXMoYnVmKTtcbiAgaWYgKHRleHQubGVuZ3RoKSB7XG4gICAgcmV0dXJuICcgY2xhc3M9XCInICsgdGV4dCArICdcIic7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuICcnO1xuICB9XG59O1xuXG4vKipcbiAqIFJlbmRlciB0aGUgZ2l2ZW4gYXR0cmlidXRlLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBrZXlcbiAqIEBwYXJhbSB7U3RyaW5nfSB2YWxcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gZXNjYXBlZFxuICogQHBhcmFtIHtCb29sZWFufSB0ZXJzZVxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5leHBvcnRzLmF0dHIgPSBmdW5jdGlvbiBhdHRyKGtleSwgdmFsLCBlc2NhcGVkLCB0ZXJzZSkge1xuICBpZiAoJ2Jvb2xlYW4nID09IHR5cGVvZiB2YWwgfHwgbnVsbCA9PSB2YWwpIHtcbiAgICBpZiAodmFsKSB7XG4gICAgICByZXR1cm4gJyAnICsgKHRlcnNlID8ga2V5IDoga2V5ICsgJz1cIicgKyBrZXkgKyAnXCInKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgfSBlbHNlIGlmICgwID09IGtleS5pbmRleE9mKCdkYXRhJykgJiYgJ3N0cmluZycgIT0gdHlwZW9mIHZhbCkge1xuICAgIHJldHVybiAnICcgKyBrZXkgKyBcIj0nXCIgKyBKU09OLnN0cmluZ2lmeSh2YWwpLnJlcGxhY2UoLycvZywgJyZhcG9zOycpICsgXCInXCI7XG4gIH0gZWxzZSBpZiAoZXNjYXBlZCkge1xuICAgIHJldHVybiAnICcgKyBrZXkgKyAnPVwiJyArIGV4cG9ydHMuZXNjYXBlKHZhbCkgKyAnXCInO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiAnICcgKyBrZXkgKyAnPVwiJyArIHZhbCArICdcIic7XG4gIH1cbn07XG5cbi8qKlxuICogUmVuZGVyIHRoZSBnaXZlbiBhdHRyaWJ1dGVzIG9iamVjdC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcGFyYW0ge09iamVjdH0gZXNjYXBlZFxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5leHBvcnRzLmF0dHJzID0gZnVuY3Rpb24gYXR0cnMob2JqLCB0ZXJzZSl7XG4gIHZhciBidWYgPSBbXTtcblxuICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKG9iaik7XG5cbiAgaWYgKGtleXMubGVuZ3RoKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgKytpKSB7XG4gICAgICB2YXIga2V5ID0ga2V5c1tpXVxuICAgICAgICAsIHZhbCA9IG9ialtrZXldO1xuXG4gICAgICBpZiAoJ2NsYXNzJyA9PSBrZXkpIHtcbiAgICAgICAgaWYgKHZhbCA9IGpvaW5DbGFzc2VzKHZhbCkpIHtcbiAgICAgICAgICBidWYucHVzaCgnICcgKyBrZXkgKyAnPVwiJyArIHZhbCArICdcIicpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBidWYucHVzaChleHBvcnRzLmF0dHIoa2V5LCB2YWwsIGZhbHNlLCB0ZXJzZSkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBidWYuam9pbignJyk7XG59O1xuXG4vKipcbiAqIEVzY2FwZSB0aGUgZ2l2ZW4gc3RyaW5nIG9mIGBodG1sYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gaHRtbFxuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZXhwb3J0cy5lc2NhcGUgPSBmdW5jdGlvbiBlc2NhcGUoaHRtbCl7XG4gIHZhciByZXN1bHQgPSBTdHJpbmcoaHRtbClcbiAgICAucmVwbGFjZSgvJi9nLCAnJmFtcDsnKVxuICAgIC5yZXBsYWNlKC88L2csICcmbHQ7JylcbiAgICAucmVwbGFjZSgvPi9nLCAnJmd0OycpXG4gICAgLnJlcGxhY2UoL1wiL2csICcmcXVvdDsnKTtcbiAgaWYgKHJlc3VsdCA9PT0gJycgKyBodG1sKSByZXR1cm4gaHRtbDtcbiAgZWxzZSByZXR1cm4gcmVzdWx0O1xufTtcblxuLyoqXG4gKiBSZS10aHJvdyB0aGUgZ2l2ZW4gYGVycmAgaW4gY29udGV4dCB0byB0aGVcbiAqIHRoZSBqYWRlIGluIGBmaWxlbmFtZWAgYXQgdGhlIGdpdmVuIGBsaW5lbm9gLlxuICpcbiAqIEBwYXJhbSB7RXJyb3J9IGVyclxuICogQHBhcmFtIHtTdHJpbmd9IGZpbGVuYW1lXG4gKiBAcGFyYW0ge1N0cmluZ30gbGluZW5vXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5leHBvcnRzLnJldGhyb3cgPSBmdW5jdGlvbiByZXRocm93KGVyciwgZmlsZW5hbWUsIGxpbmVubywgc3RyKXtcbiAgaWYgKCEoZXJyIGluc3RhbmNlb2YgRXJyb3IpKSB0aHJvdyBlcnI7XG4gIGlmICgodHlwZW9mIHdpbmRvdyAhPSAndW5kZWZpbmVkJyB8fCAhZmlsZW5hbWUpICYmICFzdHIpIHtcbiAgICBlcnIubWVzc2FnZSArPSAnIG9uIGxpbmUgJyArIGxpbmVubztcbiAgICB0aHJvdyBlcnI7XG4gIH1cbiAgdHJ5IHtcbiAgICBzdHIgPSAgc3RyIHx8IF9kZXJlcV8oJ2ZzJykucmVhZEZpbGVTeW5jKGZpbGVuYW1lLCAndXRmOCcpXG4gIH0gY2F0Y2ggKGV4KSB7XG4gICAgcmV0aHJvdyhlcnIsIG51bGwsIGxpbmVubylcbiAgfVxuICB2YXIgY29udGV4dCA9IDNcbiAgICAsIGxpbmVzID0gc3RyLnNwbGl0KCdcXG4nKVxuICAgICwgc3RhcnQgPSBNYXRoLm1heChsaW5lbm8gLSBjb250ZXh0LCAwKVxuICAgICwgZW5kID0gTWF0aC5taW4obGluZXMubGVuZ3RoLCBsaW5lbm8gKyBjb250ZXh0KTtcblxuICAvLyBFcnJvciBjb250ZXh0XG4gIHZhciBjb250ZXh0ID0gbGluZXMuc2xpY2Uoc3RhcnQsIGVuZCkubWFwKGZ1bmN0aW9uKGxpbmUsIGkpe1xuICAgIHZhciBjdXJyID0gaSArIHN0YXJ0ICsgMTtcbiAgICByZXR1cm4gKGN1cnIgPT0gbGluZW5vID8gJyAgPiAnIDogJyAgICAnKVxuICAgICAgKyBjdXJyXG4gICAgICArICd8ICdcbiAgICAgICsgbGluZTtcbiAgfSkuam9pbignXFxuJyk7XG5cbiAgLy8gQWx0ZXIgZXhjZXB0aW9uIG1lc3NhZ2VcbiAgZXJyLnBhdGggPSBmaWxlbmFtZTtcbiAgZXJyLm1lc3NhZ2UgPSAoZmlsZW5hbWUgfHwgJ0phZGUnKSArICc6JyArIGxpbmVub1xuICAgICsgJ1xcbicgKyBjb250ZXh0ICsgJ1xcblxcbicgKyBlcnIubWVzc2FnZTtcbiAgdGhyb3cgZXJyO1xufTtcblxufSx7XCJmc1wiOjJ9XSwyOltmdW5jdGlvbihfZGVyZXFfLG1vZHVsZSxleHBvcnRzKXtcblxufSx7fV19LHt9LFsxXSlcbigxKVxufSk7XG59KS5jYWxsKHRoaXMsdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KSIsIi8qIVxuICogbnVtZXJhbC5qc1xuICogdmVyc2lvbiA6IDEuNS4zXG4gKiBhdXRob3IgOiBBZGFtIERyYXBlclxuICogbGljZW5zZSA6IE1JVFxuICogaHR0cDovL2FkYW13ZHJhcGVyLmdpdGh1Yi5jb20vTnVtZXJhbC1qcy9cbiAqL1xuXG4oZnVuY3Rpb24gKCkge1xuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICBDb25zdGFudHNcbiAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICB2YXIgbnVtZXJhbCxcbiAgICAgICAgVkVSU0lPTiA9ICcxLjUuMycsXG4gICAgICAgIC8vIGludGVybmFsIHN0b3JhZ2UgZm9yIGxhbmd1YWdlIGNvbmZpZyBmaWxlc1xuICAgICAgICBsYW5ndWFnZXMgPSB7fSxcbiAgICAgICAgY3VycmVudExhbmd1YWdlID0gJ2VuJyxcbiAgICAgICAgemVyb0Zvcm1hdCA9IG51bGwsXG4gICAgICAgIGRlZmF1bHRGb3JtYXQgPSAnMCwwJyxcbiAgICAgICAgLy8gY2hlY2sgZm9yIG5vZGVKU1xuICAgICAgICBoYXNNb2R1bGUgPSAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpO1xuXG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgIENvbnN0cnVjdG9yc1xuICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuXG4gICAgLy8gTnVtZXJhbCBwcm90b3R5cGUgb2JqZWN0XG4gICAgZnVuY3Rpb24gTnVtZXJhbCAobnVtYmVyKSB7XG4gICAgICAgIHRoaXMuX3ZhbHVlID0gbnVtYmVyO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEltcGxlbWVudGF0aW9uIG9mIHRvRml4ZWQoKSB0aGF0IHRyZWF0cyBmbG9hdHMgbW9yZSBsaWtlIGRlY2ltYWxzXG4gICAgICpcbiAgICAgKiBGaXhlcyBiaW5hcnkgcm91bmRpbmcgaXNzdWVzIChlZy4gKDAuNjE1KS50b0ZpeGVkKDIpID09PSAnMC42MScpIHRoYXQgcHJlc2VudFxuICAgICAqIHByb2JsZW1zIGZvciBhY2NvdW50aW5nLSBhbmQgZmluYW5jZS1yZWxhdGVkIHNvZnR3YXJlLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHRvRml4ZWQgKHZhbHVlLCBwcmVjaXNpb24sIHJvdW5kaW5nRnVuY3Rpb24sIG9wdGlvbmFscykge1xuICAgICAgICB2YXIgcG93ZXIgPSBNYXRoLnBvdygxMCwgcHJlY2lzaW9uKSxcbiAgICAgICAgICAgIG9wdGlvbmFsc1JlZ0V4cCxcbiAgICAgICAgICAgIG91dHB1dDtcbiAgICAgICAgICAgIFxuICAgICAgICAvL3JvdW5kaW5nRnVuY3Rpb24gPSAocm91bmRpbmdGdW5jdGlvbiAhPT0gdW5kZWZpbmVkID8gcm91bmRpbmdGdW5jdGlvbiA6IE1hdGgucm91bmQpO1xuICAgICAgICAvLyBNdWx0aXBseSB1cCBieSBwcmVjaXNpb24sIHJvdW5kIGFjY3VyYXRlbHksIHRoZW4gZGl2aWRlIGFuZCB1c2UgbmF0aXZlIHRvRml4ZWQoKTpcbiAgICAgICAgb3V0cHV0ID0gKHJvdW5kaW5nRnVuY3Rpb24odmFsdWUgKiBwb3dlcikgLyBwb3dlcikudG9GaXhlZChwcmVjaXNpb24pO1xuXG4gICAgICAgIGlmIChvcHRpb25hbHMpIHtcbiAgICAgICAgICAgIG9wdGlvbmFsc1JlZ0V4cCA9IG5ldyBSZWdFeHAoJzB7MSwnICsgb3B0aW9uYWxzICsgJ30kJyk7XG4gICAgICAgICAgICBvdXRwdXQgPSBvdXRwdXQucmVwbGFjZShvcHRpb25hbHNSZWdFeHAsICcnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgfVxuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICBGb3JtYXR0aW5nXG4gICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgLy8gZGV0ZXJtaW5lIHdoYXQgdHlwZSBvZiBmb3JtYXR0aW5nIHdlIG5lZWQgdG8gZG9cbiAgICBmdW5jdGlvbiBmb3JtYXROdW1lcmFsIChuLCBmb3JtYXQsIHJvdW5kaW5nRnVuY3Rpb24pIHtcbiAgICAgICAgdmFyIG91dHB1dDtcblxuICAgICAgICAvLyBmaWd1cmUgb3V0IHdoYXQga2luZCBvZiBmb3JtYXQgd2UgYXJlIGRlYWxpbmcgd2l0aFxuICAgICAgICBpZiAoZm9ybWF0LmluZGV4T2YoJyQnKSA+IC0xKSB7IC8vIGN1cnJlbmN5ISEhISFcbiAgICAgICAgICAgIG91dHB1dCA9IGZvcm1hdEN1cnJlbmN5KG4sIGZvcm1hdCwgcm91bmRpbmdGdW5jdGlvbik7XG4gICAgICAgIH0gZWxzZSBpZiAoZm9ybWF0LmluZGV4T2YoJyUnKSA+IC0xKSB7IC8vIHBlcmNlbnRhZ2VcbiAgICAgICAgICAgIG91dHB1dCA9IGZvcm1hdFBlcmNlbnRhZ2UobiwgZm9ybWF0LCByb3VuZGluZ0Z1bmN0aW9uKTtcbiAgICAgICAgfSBlbHNlIGlmIChmb3JtYXQuaW5kZXhPZignOicpID4gLTEpIHsgLy8gdGltZVxuICAgICAgICAgICAgb3V0cHV0ID0gZm9ybWF0VGltZShuLCBmb3JtYXQpO1xuICAgICAgICB9IGVsc2UgeyAvLyBwbGFpbiBvbCcgbnVtYmVycyBvciBieXRlc1xuICAgICAgICAgICAgb3V0cHV0ID0gZm9ybWF0TnVtYmVyKG4uX3ZhbHVlLCBmb3JtYXQsIHJvdW5kaW5nRnVuY3Rpb24pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gcmV0dXJuIHN0cmluZ1xuICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgIH1cblxuICAgIC8vIHJldmVydCB0byBudW1iZXJcbiAgICBmdW5jdGlvbiB1bmZvcm1hdE51bWVyYWwgKG4sIHN0cmluZykge1xuICAgICAgICB2YXIgc3RyaW5nT3JpZ2luYWwgPSBzdHJpbmcsXG4gICAgICAgICAgICB0aG91c2FuZFJlZ0V4cCxcbiAgICAgICAgICAgIG1pbGxpb25SZWdFeHAsXG4gICAgICAgICAgICBiaWxsaW9uUmVnRXhwLFxuICAgICAgICAgICAgdHJpbGxpb25SZWdFeHAsXG4gICAgICAgICAgICBzdWZmaXhlcyA9IFsnS0InLCAnTUInLCAnR0InLCAnVEInLCAnUEInLCAnRUInLCAnWkInLCAnWUInXSxcbiAgICAgICAgICAgIGJ5dGVzTXVsdGlwbGllciA9IGZhbHNlLFxuICAgICAgICAgICAgcG93ZXI7XG5cbiAgICAgICAgaWYgKHN0cmluZy5pbmRleE9mKCc6JykgPiAtMSkge1xuICAgICAgICAgICAgbi5fdmFsdWUgPSB1bmZvcm1hdFRpbWUoc3RyaW5nKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChzdHJpbmcgPT09IHplcm9Gb3JtYXQpIHtcbiAgICAgICAgICAgICAgICBuLl92YWx1ZSA9IDA7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChsYW5ndWFnZXNbY3VycmVudExhbmd1YWdlXS5kZWxpbWl0ZXJzLmRlY2ltYWwgIT09ICcuJykge1xuICAgICAgICAgICAgICAgICAgICBzdHJpbmcgPSBzdHJpbmcucmVwbGFjZSgvXFwuL2csJycpLnJlcGxhY2UobGFuZ3VhZ2VzW2N1cnJlbnRMYW5ndWFnZV0uZGVsaW1pdGVycy5kZWNpbWFsLCAnLicpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIHNlZSBpZiBhYmJyZXZpYXRpb25zIGFyZSB0aGVyZSBzbyB0aGF0IHdlIGNhbiBtdWx0aXBseSB0byB0aGUgY29ycmVjdCBudW1iZXJcbiAgICAgICAgICAgICAgICB0aG91c2FuZFJlZ0V4cCA9IG5ldyBSZWdFeHAoJ1teYS16QS1aXScgKyBsYW5ndWFnZXNbY3VycmVudExhbmd1YWdlXS5hYmJyZXZpYXRpb25zLnRob3VzYW5kICsgJyg/OlxcXFwpfChcXFxcJyArIGxhbmd1YWdlc1tjdXJyZW50TGFuZ3VhZ2VdLmN1cnJlbmN5LnN5bWJvbCArICcpPyg/OlxcXFwpKT8pPyQnKTtcbiAgICAgICAgICAgICAgICBtaWxsaW9uUmVnRXhwID0gbmV3IFJlZ0V4cCgnW15hLXpBLVpdJyArIGxhbmd1YWdlc1tjdXJyZW50TGFuZ3VhZ2VdLmFiYnJldmlhdGlvbnMubWlsbGlvbiArICcoPzpcXFxcKXwoXFxcXCcgKyBsYW5ndWFnZXNbY3VycmVudExhbmd1YWdlXS5jdXJyZW5jeS5zeW1ib2wgKyAnKT8oPzpcXFxcKSk/KT8kJyk7XG4gICAgICAgICAgICAgICAgYmlsbGlvblJlZ0V4cCA9IG5ldyBSZWdFeHAoJ1teYS16QS1aXScgKyBsYW5ndWFnZXNbY3VycmVudExhbmd1YWdlXS5hYmJyZXZpYXRpb25zLmJpbGxpb24gKyAnKD86XFxcXCl8KFxcXFwnICsgbGFuZ3VhZ2VzW2N1cnJlbnRMYW5ndWFnZV0uY3VycmVuY3kuc3ltYm9sICsgJyk/KD86XFxcXCkpPyk/JCcpO1xuICAgICAgICAgICAgICAgIHRyaWxsaW9uUmVnRXhwID0gbmV3IFJlZ0V4cCgnW15hLXpBLVpdJyArIGxhbmd1YWdlc1tjdXJyZW50TGFuZ3VhZ2VdLmFiYnJldmlhdGlvbnMudHJpbGxpb24gKyAnKD86XFxcXCl8KFxcXFwnICsgbGFuZ3VhZ2VzW2N1cnJlbnRMYW5ndWFnZV0uY3VycmVuY3kuc3ltYm9sICsgJyk/KD86XFxcXCkpPyk/JCcpO1xuXG4gICAgICAgICAgICAgICAgLy8gc2VlIGlmIGJ5dGVzIGFyZSB0aGVyZSBzbyB0aGF0IHdlIGNhbiBtdWx0aXBseSB0byB0aGUgY29ycmVjdCBudW1iZXJcbiAgICAgICAgICAgICAgICBmb3IgKHBvd2VyID0gMDsgcG93ZXIgPD0gc3VmZml4ZXMubGVuZ3RoOyBwb3dlcisrKSB7XG4gICAgICAgICAgICAgICAgICAgIGJ5dGVzTXVsdGlwbGllciA9IChzdHJpbmcuaW5kZXhPZihzdWZmaXhlc1twb3dlcl0pID4gLTEpID8gTWF0aC5wb3coMTAyNCwgcG93ZXIgKyAxKSA6IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChieXRlc011bHRpcGxpZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gZG8gc29tZSBtYXRoIHRvIGNyZWF0ZSBvdXIgbnVtYmVyXG4gICAgICAgICAgICAgICAgbi5fdmFsdWUgPSAoKGJ5dGVzTXVsdGlwbGllcikgPyBieXRlc011bHRpcGxpZXIgOiAxKSAqICgoc3RyaW5nT3JpZ2luYWwubWF0Y2godGhvdXNhbmRSZWdFeHApKSA/IE1hdGgucG93KDEwLCAzKSA6IDEpICogKChzdHJpbmdPcmlnaW5hbC5tYXRjaChtaWxsaW9uUmVnRXhwKSkgPyBNYXRoLnBvdygxMCwgNikgOiAxKSAqICgoc3RyaW5nT3JpZ2luYWwubWF0Y2goYmlsbGlvblJlZ0V4cCkpID8gTWF0aC5wb3coMTAsIDkpIDogMSkgKiAoKHN0cmluZ09yaWdpbmFsLm1hdGNoKHRyaWxsaW9uUmVnRXhwKSkgPyBNYXRoLnBvdygxMCwgMTIpIDogMSkgKiAoKHN0cmluZy5pbmRleE9mKCclJykgPiAtMSkgPyAwLjAxIDogMSkgKiAoKChzdHJpbmcuc3BsaXQoJy0nKS5sZW5ndGggKyBNYXRoLm1pbihzdHJpbmcuc3BsaXQoJygnKS5sZW5ndGgtMSwgc3RyaW5nLnNwbGl0KCcpJykubGVuZ3RoLTEpKSAlIDIpPyAxOiAtMSkgKiBOdW1iZXIoc3RyaW5nLnJlcGxhY2UoL1teMC05XFwuXSsvZywgJycpKTtcblxuICAgICAgICAgICAgICAgIC8vIHJvdW5kIGlmIHdlIGFyZSB0YWxraW5nIGFib3V0IGJ5dGVzXG4gICAgICAgICAgICAgICAgbi5fdmFsdWUgPSAoYnl0ZXNNdWx0aXBsaWVyKSA/IE1hdGguY2VpbChuLl92YWx1ZSkgOiBuLl92YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbi5fdmFsdWU7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZm9ybWF0Q3VycmVuY3kgKG4sIGZvcm1hdCwgcm91bmRpbmdGdW5jdGlvbikge1xuICAgICAgICB2YXIgc3ltYm9sSW5kZXggPSBmb3JtYXQuaW5kZXhPZignJCcpLFxuICAgICAgICAgICAgb3BlblBhcmVuSW5kZXggPSBmb3JtYXQuaW5kZXhPZignKCcpLFxuICAgICAgICAgICAgbWludXNTaWduSW5kZXggPSBmb3JtYXQuaW5kZXhPZignLScpLFxuICAgICAgICAgICAgc3BhY2UgPSAnJyxcbiAgICAgICAgICAgIHNwbGljZUluZGV4LFxuICAgICAgICAgICAgb3V0cHV0O1xuXG4gICAgICAgIC8vIGNoZWNrIGZvciBzcGFjZSBiZWZvcmUgb3IgYWZ0ZXIgY3VycmVuY3lcbiAgICAgICAgaWYgKGZvcm1hdC5pbmRleE9mKCcgJCcpID4gLTEpIHtcbiAgICAgICAgICAgIHNwYWNlID0gJyAnO1xuICAgICAgICAgICAgZm9ybWF0ID0gZm9ybWF0LnJlcGxhY2UoJyAkJywgJycpO1xuICAgICAgICB9IGVsc2UgaWYgKGZvcm1hdC5pbmRleE9mKCckICcpID4gLTEpIHtcbiAgICAgICAgICAgIHNwYWNlID0gJyAnO1xuICAgICAgICAgICAgZm9ybWF0ID0gZm9ybWF0LnJlcGxhY2UoJyQgJywgJycpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZm9ybWF0ID0gZm9ybWF0LnJlcGxhY2UoJyQnLCAnJyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBmb3JtYXQgdGhlIG51bWJlclxuICAgICAgICBvdXRwdXQgPSBmb3JtYXROdW1iZXIobi5fdmFsdWUsIGZvcm1hdCwgcm91bmRpbmdGdW5jdGlvbik7XG5cbiAgICAgICAgLy8gcG9zaXRpb24gdGhlIHN5bWJvbFxuICAgICAgICBpZiAoc3ltYm9sSW5kZXggPD0gMSkge1xuICAgICAgICAgICAgaWYgKG91dHB1dC5pbmRleE9mKCcoJykgPiAtMSB8fCBvdXRwdXQuaW5kZXhPZignLScpID4gLTEpIHtcbiAgICAgICAgICAgICAgICBvdXRwdXQgPSBvdXRwdXQuc3BsaXQoJycpO1xuICAgICAgICAgICAgICAgIHNwbGljZUluZGV4ID0gMTtcbiAgICAgICAgICAgICAgICBpZiAoc3ltYm9sSW5kZXggPCBvcGVuUGFyZW5JbmRleCB8fCBzeW1ib2xJbmRleCA8IG1pbnVzU2lnbkluZGV4KXtcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhlIHN5bWJvbCBhcHBlYXJzIGJlZm9yZSB0aGUgXCIoXCIgb3IgXCItXCJcbiAgICAgICAgICAgICAgICAgICAgc3BsaWNlSW5kZXggPSAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBvdXRwdXQuc3BsaWNlKHNwbGljZUluZGV4LCAwLCBsYW5ndWFnZXNbY3VycmVudExhbmd1YWdlXS5jdXJyZW5jeS5zeW1ib2wgKyBzcGFjZSk7XG4gICAgICAgICAgICAgICAgb3V0cHV0ID0gb3V0cHV0LmpvaW4oJycpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBvdXRwdXQgPSBsYW5ndWFnZXNbY3VycmVudExhbmd1YWdlXS5jdXJyZW5jeS5zeW1ib2wgKyBzcGFjZSArIG91dHB1dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChvdXRwdXQuaW5kZXhPZignKScpID4gLTEpIHtcbiAgICAgICAgICAgICAgICBvdXRwdXQgPSBvdXRwdXQuc3BsaXQoJycpO1xuICAgICAgICAgICAgICAgIG91dHB1dC5zcGxpY2UoLTEsIDAsIHNwYWNlICsgbGFuZ3VhZ2VzW2N1cnJlbnRMYW5ndWFnZV0uY3VycmVuY3kuc3ltYm9sKTtcbiAgICAgICAgICAgICAgICBvdXRwdXQgPSBvdXRwdXQuam9pbignJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG91dHB1dCA9IG91dHB1dCArIHNwYWNlICsgbGFuZ3VhZ2VzW2N1cnJlbnRMYW5ndWFnZV0uY3VycmVuY3kuc3ltYm9sO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmb3JtYXRQZXJjZW50YWdlIChuLCBmb3JtYXQsIHJvdW5kaW5nRnVuY3Rpb24pIHtcbiAgICAgICAgdmFyIHNwYWNlID0gJycsXG4gICAgICAgICAgICBvdXRwdXQsXG4gICAgICAgICAgICB2YWx1ZSA9IG4uX3ZhbHVlICogMTAwO1xuXG4gICAgICAgIC8vIGNoZWNrIGZvciBzcGFjZSBiZWZvcmUgJVxuICAgICAgICBpZiAoZm9ybWF0LmluZGV4T2YoJyAlJykgPiAtMSkge1xuICAgICAgICAgICAgc3BhY2UgPSAnICc7XG4gICAgICAgICAgICBmb3JtYXQgPSBmb3JtYXQucmVwbGFjZSgnICUnLCAnJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmb3JtYXQgPSBmb3JtYXQucmVwbGFjZSgnJScsICcnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIG91dHB1dCA9IGZvcm1hdE51bWJlcih2YWx1ZSwgZm9ybWF0LCByb3VuZGluZ0Z1bmN0aW9uKTtcbiAgICAgICAgXG4gICAgICAgIGlmIChvdXRwdXQuaW5kZXhPZignKScpID4gLTEgKSB7XG4gICAgICAgICAgICBvdXRwdXQgPSBvdXRwdXQuc3BsaXQoJycpO1xuICAgICAgICAgICAgb3V0cHV0LnNwbGljZSgtMSwgMCwgc3BhY2UgKyAnJScpO1xuICAgICAgICAgICAgb3V0cHV0ID0gb3V0cHV0LmpvaW4oJycpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb3V0cHV0ID0gb3V0cHV0ICsgc3BhY2UgKyAnJSc7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZvcm1hdFRpbWUgKG4pIHtcbiAgICAgICAgdmFyIGhvdXJzID0gTWF0aC5mbG9vcihuLl92YWx1ZS82MC82MCksXG4gICAgICAgICAgICBtaW51dGVzID0gTWF0aC5mbG9vcigobi5fdmFsdWUgLSAoaG91cnMgKiA2MCAqIDYwKSkvNjApLFxuICAgICAgICAgICAgc2Vjb25kcyA9IE1hdGgucm91bmQobi5fdmFsdWUgLSAoaG91cnMgKiA2MCAqIDYwKSAtIChtaW51dGVzICogNjApKTtcbiAgICAgICAgcmV0dXJuIGhvdXJzICsgJzonICsgKChtaW51dGVzIDwgMTApID8gJzAnICsgbWludXRlcyA6IG1pbnV0ZXMpICsgJzonICsgKChzZWNvbmRzIDwgMTApID8gJzAnICsgc2Vjb25kcyA6IHNlY29uZHMpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHVuZm9ybWF0VGltZSAoc3RyaW5nKSB7XG4gICAgICAgIHZhciB0aW1lQXJyYXkgPSBzdHJpbmcuc3BsaXQoJzonKSxcbiAgICAgICAgICAgIHNlY29uZHMgPSAwO1xuICAgICAgICAvLyB0dXJuIGhvdXJzIGFuZCBtaW51dGVzIGludG8gc2Vjb25kcyBhbmQgYWRkIHRoZW0gYWxsIHVwXG4gICAgICAgIGlmICh0aW1lQXJyYXkubGVuZ3RoID09PSAzKSB7XG4gICAgICAgICAgICAvLyBob3Vyc1xuICAgICAgICAgICAgc2Vjb25kcyA9IHNlY29uZHMgKyAoTnVtYmVyKHRpbWVBcnJheVswXSkgKiA2MCAqIDYwKTtcbiAgICAgICAgICAgIC8vIG1pbnV0ZXNcbiAgICAgICAgICAgIHNlY29uZHMgPSBzZWNvbmRzICsgKE51bWJlcih0aW1lQXJyYXlbMV0pICogNjApO1xuICAgICAgICAgICAgLy8gc2Vjb25kc1xuICAgICAgICAgICAgc2Vjb25kcyA9IHNlY29uZHMgKyBOdW1iZXIodGltZUFycmF5WzJdKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aW1lQXJyYXkubGVuZ3RoID09PSAyKSB7XG4gICAgICAgICAgICAvLyBtaW51dGVzXG4gICAgICAgICAgICBzZWNvbmRzID0gc2Vjb25kcyArIChOdW1iZXIodGltZUFycmF5WzBdKSAqIDYwKTtcbiAgICAgICAgICAgIC8vIHNlY29uZHNcbiAgICAgICAgICAgIHNlY29uZHMgPSBzZWNvbmRzICsgTnVtYmVyKHRpbWVBcnJheVsxXSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIE51bWJlcihzZWNvbmRzKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmb3JtYXROdW1iZXIgKHZhbHVlLCBmb3JtYXQsIHJvdW5kaW5nRnVuY3Rpb24pIHtcbiAgICAgICAgdmFyIG5lZ1AgPSBmYWxzZSxcbiAgICAgICAgICAgIHNpZ25lZCA9IGZhbHNlLFxuICAgICAgICAgICAgb3B0RGVjID0gZmFsc2UsXG4gICAgICAgICAgICBhYmJyID0gJycsXG4gICAgICAgICAgICBhYmJySyA9IGZhbHNlLCAvLyBmb3JjZSBhYmJyZXZpYXRpb24gdG8gdGhvdXNhbmRzXG4gICAgICAgICAgICBhYmJyTSA9IGZhbHNlLCAvLyBmb3JjZSBhYmJyZXZpYXRpb24gdG8gbWlsbGlvbnNcbiAgICAgICAgICAgIGFiYnJCID0gZmFsc2UsIC8vIGZvcmNlIGFiYnJldmlhdGlvbiB0byBiaWxsaW9uc1xuICAgICAgICAgICAgYWJiclQgPSBmYWxzZSwgLy8gZm9yY2UgYWJicmV2aWF0aW9uIHRvIHRyaWxsaW9uc1xuICAgICAgICAgICAgYWJickZvcmNlID0gZmFsc2UsIC8vIGZvcmNlIGFiYnJldmlhdGlvblxuICAgICAgICAgICAgYnl0ZXMgPSAnJyxcbiAgICAgICAgICAgIG9yZCA9ICcnLFxuICAgICAgICAgICAgYWJzID0gTWF0aC5hYnModmFsdWUpLFxuICAgICAgICAgICAgc3VmZml4ZXMgPSBbJ0InLCAnS0InLCAnTUInLCAnR0InLCAnVEInLCAnUEInLCAnRUInLCAnWkInLCAnWUInXSxcbiAgICAgICAgICAgIG1pbixcbiAgICAgICAgICAgIG1heCxcbiAgICAgICAgICAgIHBvd2VyLFxuICAgICAgICAgICAgdyxcbiAgICAgICAgICAgIHByZWNpc2lvbixcbiAgICAgICAgICAgIHRob3VzYW5kcyxcbiAgICAgICAgICAgIGQgPSAnJyxcbiAgICAgICAgICAgIG5lZyA9IGZhbHNlO1xuXG4gICAgICAgIC8vIGNoZWNrIGlmIG51bWJlciBpcyB6ZXJvIGFuZCBhIGN1c3RvbSB6ZXJvIGZvcm1hdCBoYXMgYmVlbiBzZXRcbiAgICAgICAgaWYgKHZhbHVlID09PSAwICYmIHplcm9Gb3JtYXQgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiB6ZXJvRm9ybWF0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gc2VlIGlmIHdlIHNob3VsZCB1c2UgcGFyZW50aGVzZXMgZm9yIG5lZ2F0aXZlIG51bWJlciBvciBpZiB3ZSBzaG91bGQgcHJlZml4IHdpdGggYSBzaWduXG4gICAgICAgICAgICAvLyBpZiBib3RoIGFyZSBwcmVzZW50IHdlIGRlZmF1bHQgdG8gcGFyZW50aGVzZXNcbiAgICAgICAgICAgIGlmIChmb3JtYXQuaW5kZXhPZignKCcpID4gLTEpIHtcbiAgICAgICAgICAgICAgICBuZWdQID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBmb3JtYXQgPSBmb3JtYXQuc2xpY2UoMSwgLTEpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChmb3JtYXQuaW5kZXhPZignKycpID4gLTEpIHtcbiAgICAgICAgICAgICAgICBzaWduZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGZvcm1hdCA9IGZvcm1hdC5yZXBsYWNlKC9cXCsvZywgJycpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBzZWUgaWYgYWJicmV2aWF0aW9uIGlzIHdhbnRlZFxuICAgICAgICAgICAgaWYgKGZvcm1hdC5pbmRleE9mKCdhJykgPiAtMSkge1xuICAgICAgICAgICAgICAgIC8vIGNoZWNrIGlmIGFiYnJldmlhdGlvbiBpcyBzcGVjaWZpZWRcbiAgICAgICAgICAgICAgICBhYmJySyA9IGZvcm1hdC5pbmRleE9mKCdhSycpID49IDA7XG4gICAgICAgICAgICAgICAgYWJick0gPSBmb3JtYXQuaW5kZXhPZignYU0nKSA+PSAwO1xuICAgICAgICAgICAgICAgIGFiYnJCID0gZm9ybWF0LmluZGV4T2YoJ2FCJykgPj0gMDtcbiAgICAgICAgICAgICAgICBhYmJyVCA9IGZvcm1hdC5pbmRleE9mKCdhVCcpID49IDA7XG4gICAgICAgICAgICAgICAgYWJickZvcmNlID0gYWJicksgfHwgYWJick0gfHwgYWJickIgfHwgYWJiclQ7XG5cbiAgICAgICAgICAgICAgICAvLyBjaGVjayBmb3Igc3BhY2UgYmVmb3JlIGFiYnJldmlhdGlvblxuICAgICAgICAgICAgICAgIGlmIChmb3JtYXQuaW5kZXhPZignIGEnKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIGFiYnIgPSAnICc7XG4gICAgICAgICAgICAgICAgICAgIGZvcm1hdCA9IGZvcm1hdC5yZXBsYWNlKCcgYScsICcnKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBmb3JtYXQgPSBmb3JtYXQucmVwbGFjZSgnYScsICcnKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoYWJzID49IE1hdGgucG93KDEwLCAxMikgJiYgIWFiYnJGb3JjZSB8fCBhYmJyVCkge1xuICAgICAgICAgICAgICAgICAgICAvLyB0cmlsbGlvblxuICAgICAgICAgICAgICAgICAgICBhYmJyID0gYWJiciArIGxhbmd1YWdlc1tjdXJyZW50TGFuZ3VhZ2VdLmFiYnJldmlhdGlvbnMudHJpbGxpb247XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUgLyBNYXRoLnBvdygxMCwgMTIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYWJzIDwgTWF0aC5wb3coMTAsIDEyKSAmJiBhYnMgPj0gTWF0aC5wb3coMTAsIDkpICYmICFhYmJyRm9yY2UgfHwgYWJickIpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gYmlsbGlvblxuICAgICAgICAgICAgICAgICAgICBhYmJyID0gYWJiciArIGxhbmd1YWdlc1tjdXJyZW50TGFuZ3VhZ2VdLmFiYnJldmlhdGlvbnMuYmlsbGlvbjtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZSAvIE1hdGgucG93KDEwLCA5KTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGFicyA8IE1hdGgucG93KDEwLCA5KSAmJiBhYnMgPj0gTWF0aC5wb3coMTAsIDYpICYmICFhYmJyRm9yY2UgfHwgYWJick0pIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gbWlsbGlvblxuICAgICAgICAgICAgICAgICAgICBhYmJyID0gYWJiciArIGxhbmd1YWdlc1tjdXJyZW50TGFuZ3VhZ2VdLmFiYnJldmlhdGlvbnMubWlsbGlvbjtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZSAvIE1hdGgucG93KDEwLCA2KTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGFicyA8IE1hdGgucG93KDEwLCA2KSAmJiBhYnMgPj0gTWF0aC5wb3coMTAsIDMpICYmICFhYmJyRm9yY2UgfHwgYWJickspIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhvdXNhbmRcbiAgICAgICAgICAgICAgICAgICAgYWJiciA9IGFiYnIgKyBsYW5ndWFnZXNbY3VycmVudExhbmd1YWdlXS5hYmJyZXZpYXRpb25zLnRob3VzYW5kO1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlIC8gTWF0aC5wb3coMTAsIDMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gc2VlIGlmIHdlIGFyZSBmb3JtYXR0aW5nIGJ5dGVzXG4gICAgICAgICAgICBpZiAoZm9ybWF0LmluZGV4T2YoJ2InKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgLy8gY2hlY2sgZm9yIHNwYWNlIGJlZm9yZVxuICAgICAgICAgICAgICAgIGlmIChmb3JtYXQuaW5kZXhPZignIGInKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIGJ5dGVzID0gJyAnO1xuICAgICAgICAgICAgICAgICAgICBmb3JtYXQgPSBmb3JtYXQucmVwbGFjZSgnIGInLCAnJyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZm9ybWF0ID0gZm9ybWF0LnJlcGxhY2UoJ2InLCAnJyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZm9yIChwb3dlciA9IDA7IHBvd2VyIDw9IHN1ZmZpeGVzLmxlbmd0aDsgcG93ZXIrKykge1xuICAgICAgICAgICAgICAgICAgICBtaW4gPSBNYXRoLnBvdygxMDI0LCBwb3dlcik7XG4gICAgICAgICAgICAgICAgICAgIG1heCA9IE1hdGgucG93KDEwMjQsIHBvd2VyKzEpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZSA+PSBtaW4gJiYgdmFsdWUgPCBtYXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ5dGVzID0gYnl0ZXMgKyBzdWZmaXhlc1twb3dlcl07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobWluID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUgLyBtaW47XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gc2VlIGlmIG9yZGluYWwgaXMgd2FudGVkXG4gICAgICAgICAgICBpZiAoZm9ybWF0LmluZGV4T2YoJ28nKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgLy8gY2hlY2sgZm9yIHNwYWNlIGJlZm9yZVxuICAgICAgICAgICAgICAgIGlmIChmb3JtYXQuaW5kZXhPZignIG8nKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIG9yZCA9ICcgJztcbiAgICAgICAgICAgICAgICAgICAgZm9ybWF0ID0gZm9ybWF0LnJlcGxhY2UoJyBvJywgJycpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGZvcm1hdCA9IGZvcm1hdC5yZXBsYWNlKCdvJywgJycpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIG9yZCA9IG9yZCArIGxhbmd1YWdlc1tjdXJyZW50TGFuZ3VhZ2VdLm9yZGluYWwodmFsdWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoZm9ybWF0LmluZGV4T2YoJ1suXScpID4gLTEpIHtcbiAgICAgICAgICAgICAgICBvcHREZWMgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGZvcm1hdCA9IGZvcm1hdC5yZXBsYWNlKCdbLl0nLCAnLicpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB3ID0gdmFsdWUudG9TdHJpbmcoKS5zcGxpdCgnLicpWzBdO1xuICAgICAgICAgICAgcHJlY2lzaW9uID0gZm9ybWF0LnNwbGl0KCcuJylbMV07XG4gICAgICAgICAgICB0aG91c2FuZHMgPSBmb3JtYXQuaW5kZXhPZignLCcpO1xuXG4gICAgICAgICAgICBpZiAocHJlY2lzaW9uKSB7XG4gICAgICAgICAgICAgICAgaWYgKHByZWNpc2lvbi5pbmRleE9mKCdbJykgPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICBwcmVjaXNpb24gPSBwcmVjaXNpb24ucmVwbGFjZSgnXScsICcnKTtcbiAgICAgICAgICAgICAgICAgICAgcHJlY2lzaW9uID0gcHJlY2lzaW9uLnNwbGl0KCdbJyk7XG4gICAgICAgICAgICAgICAgICAgIGQgPSB0b0ZpeGVkKHZhbHVlLCAocHJlY2lzaW9uWzBdLmxlbmd0aCArIHByZWNpc2lvblsxXS5sZW5ndGgpLCByb3VuZGluZ0Z1bmN0aW9uLCBwcmVjaXNpb25bMV0ubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBkID0gdG9GaXhlZCh2YWx1ZSwgcHJlY2lzaW9uLmxlbmd0aCwgcm91bmRpbmdGdW5jdGlvbik7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdyA9IGQuc3BsaXQoJy4nKVswXTtcblxuICAgICAgICAgICAgICAgIGlmIChkLnNwbGl0KCcuJylbMV0ubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIGQgPSBsYW5ndWFnZXNbY3VycmVudExhbmd1YWdlXS5kZWxpbWl0ZXJzLmRlY2ltYWwgKyBkLnNwbGl0KCcuJylbMV07XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZCA9ICcnO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChvcHREZWMgJiYgTnVtYmVyKGQuc2xpY2UoMSkpID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGQgPSAnJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHcgPSB0b0ZpeGVkKHZhbHVlLCBudWxsLCByb3VuZGluZ0Z1bmN0aW9uKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gZm9ybWF0IG51bWJlclxuICAgICAgICAgICAgaWYgKHcuaW5kZXhPZignLScpID4gLTEpIHtcbiAgICAgICAgICAgICAgICB3ID0gdy5zbGljZSgxKTtcbiAgICAgICAgICAgICAgICBuZWcgPSB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhvdXNhbmRzID4gLTEpIHtcbiAgICAgICAgICAgICAgICB3ID0gdy50b1N0cmluZygpLnJlcGxhY2UoLyhcXGQpKD89KFxcZHszfSkrKD8hXFxkKSkvZywgJyQxJyArIGxhbmd1YWdlc1tjdXJyZW50TGFuZ3VhZ2VdLmRlbGltaXRlcnMudGhvdXNhbmRzKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGZvcm1hdC5pbmRleE9mKCcuJykgPT09IDApIHtcbiAgICAgICAgICAgICAgICB3ID0gJyc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiAoKG5lZ1AgJiYgbmVnKSA/ICcoJyA6ICcnKSArICgoIW5lZ1AgJiYgbmVnKSA/ICctJyA6ICcnKSArICgoIW5lZyAmJiBzaWduZWQpID8gJysnIDogJycpICsgdyArIGQgKyAoKG9yZCkgPyBvcmQgOiAnJykgKyAoKGFiYnIpID8gYWJiciA6ICcnKSArICgoYnl0ZXMpID8gYnl0ZXMgOiAnJykgKyAoKG5lZ1AgJiYgbmVnKSA/ICcpJyA6ICcnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgVG9wIExldmVsIEZ1bmN0aW9uc1xuICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgIG51bWVyYWwgPSBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICAgICAgaWYgKG51bWVyYWwuaXNOdW1lcmFsKGlucHV0KSkge1xuICAgICAgICAgICAgaW5wdXQgPSBpbnB1dC52YWx1ZSgpO1xuICAgICAgICB9IGVsc2UgaWYgKGlucHV0ID09PSAwIHx8IHR5cGVvZiBpbnB1dCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGlucHV0ID0gMDtcbiAgICAgICAgfSBlbHNlIGlmICghTnVtYmVyKGlucHV0KSkge1xuICAgICAgICAgICAgaW5wdXQgPSBudW1lcmFsLmZuLnVuZm9ybWF0KGlucHV0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXcgTnVtZXJhbChOdW1iZXIoaW5wdXQpKTtcbiAgICB9O1xuXG4gICAgLy8gdmVyc2lvbiBudW1iZXJcbiAgICBudW1lcmFsLnZlcnNpb24gPSBWRVJTSU9OO1xuXG4gICAgLy8gY29tcGFyZSBudW1lcmFsIG9iamVjdFxuICAgIG51bWVyYWwuaXNOdW1lcmFsID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgICByZXR1cm4gb2JqIGluc3RhbmNlb2YgTnVtZXJhbDtcbiAgICB9O1xuXG4gICAgLy8gVGhpcyBmdW5jdGlvbiB3aWxsIGxvYWQgbGFuZ3VhZ2VzIGFuZCB0aGVuIHNldCB0aGUgZ2xvYmFsIGxhbmd1YWdlLiAgSWZcbiAgICAvLyBubyBhcmd1bWVudHMgYXJlIHBhc3NlZCBpbiwgaXQgd2lsbCBzaW1wbHkgcmV0dXJuIHRoZSBjdXJyZW50IGdsb2JhbFxuICAgIC8vIGxhbmd1YWdlIGtleS5cbiAgICBudW1lcmFsLmxhbmd1YWdlID0gZnVuY3Rpb24gKGtleSwgdmFsdWVzKSB7XG4gICAgICAgIGlmICgha2V5KSB7XG4gICAgICAgICAgICByZXR1cm4gY3VycmVudExhbmd1YWdlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGtleSAmJiAhdmFsdWVzKSB7XG4gICAgICAgICAgICBpZighbGFuZ3VhZ2VzW2tleV0pIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gbGFuZ3VhZ2UgOiAnICsga2V5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGN1cnJlbnRMYW5ndWFnZSA9IGtleTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh2YWx1ZXMgfHwgIWxhbmd1YWdlc1trZXldKSB7XG4gICAgICAgICAgICBsb2FkTGFuZ3VhZ2Uoa2V5LCB2YWx1ZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG51bWVyYWw7XG4gICAgfTtcbiAgICBcbiAgICAvLyBUaGlzIGZ1bmN0aW9uIHByb3ZpZGVzIGFjY2VzcyB0byB0aGUgbG9hZGVkIGxhbmd1YWdlIGRhdGEuICBJZlxuICAgIC8vIG5vIGFyZ3VtZW50cyBhcmUgcGFzc2VkIGluLCBpdCB3aWxsIHNpbXBseSByZXR1cm4gdGhlIGN1cnJlbnRcbiAgICAvLyBnbG9iYWwgbGFuZ3VhZ2Ugb2JqZWN0LlxuICAgIG51bWVyYWwubGFuZ3VhZ2VEYXRhID0gZnVuY3Rpb24gKGtleSkge1xuICAgICAgICBpZiAoIWtleSkge1xuICAgICAgICAgICAgcmV0dXJuIGxhbmd1YWdlc1tjdXJyZW50TGFuZ3VhZ2VdO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBpZiAoIWxhbmd1YWdlc1trZXldKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gbGFuZ3VhZ2UgOiAnICsga2V5KTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIGxhbmd1YWdlc1trZXldO1xuICAgIH07XG5cbiAgICBudW1lcmFsLmxhbmd1YWdlKCdlbicsIHtcbiAgICAgICAgZGVsaW1pdGVyczoge1xuICAgICAgICAgICAgdGhvdXNhbmRzOiAnLCcsXG4gICAgICAgICAgICBkZWNpbWFsOiAnLidcbiAgICAgICAgfSxcbiAgICAgICAgYWJicmV2aWF0aW9uczoge1xuICAgICAgICAgICAgdGhvdXNhbmQ6ICdrJyxcbiAgICAgICAgICAgIG1pbGxpb246ICdtJyxcbiAgICAgICAgICAgIGJpbGxpb246ICdiJyxcbiAgICAgICAgICAgIHRyaWxsaW9uOiAndCdcbiAgICAgICAgfSxcbiAgICAgICAgb3JkaW5hbDogZnVuY3Rpb24gKG51bWJlcikge1xuICAgICAgICAgICAgdmFyIGIgPSBudW1iZXIgJSAxMDtcbiAgICAgICAgICAgIHJldHVybiAofn4gKG51bWJlciAlIDEwMCAvIDEwKSA9PT0gMSkgPyAndGgnIDpcbiAgICAgICAgICAgICAgICAoYiA9PT0gMSkgPyAnc3QnIDpcbiAgICAgICAgICAgICAgICAoYiA9PT0gMikgPyAnbmQnIDpcbiAgICAgICAgICAgICAgICAoYiA9PT0gMykgPyAncmQnIDogJ3RoJztcbiAgICAgICAgfSxcbiAgICAgICAgY3VycmVuY3k6IHtcbiAgICAgICAgICAgIHN5bWJvbDogJyQnXG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIG51bWVyYWwuemVyb0Zvcm1hdCA9IGZ1bmN0aW9uIChmb3JtYXQpIHtcbiAgICAgICAgemVyb0Zvcm1hdCA9IHR5cGVvZihmb3JtYXQpID09PSAnc3RyaW5nJyA/IGZvcm1hdCA6IG51bGw7XG4gICAgfTtcblxuICAgIG51bWVyYWwuZGVmYXVsdEZvcm1hdCA9IGZ1bmN0aW9uIChmb3JtYXQpIHtcbiAgICAgICAgZGVmYXVsdEZvcm1hdCA9IHR5cGVvZihmb3JtYXQpID09PSAnc3RyaW5nJyA/IGZvcm1hdCA6ICcwLjAnO1xuICAgIH07XG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgIEhlbHBlcnNcbiAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICBmdW5jdGlvbiBsb2FkTGFuZ3VhZ2Uoa2V5LCB2YWx1ZXMpIHtcbiAgICAgICAgbGFuZ3VhZ2VzW2tleV0gPSB2YWx1ZXM7XG4gICAgfVxuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICBGbG9hdGluZy1wb2ludCBoZWxwZXJzXG4gICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgLy8gVGhlIGZsb2F0aW5nLXBvaW50IGhlbHBlciBmdW5jdGlvbnMgYW5kIGltcGxlbWVudGF0aW9uXG4gICAgLy8gYm9ycm93cyBoZWF2aWx5IGZyb20gc2luZnVsLmpzOiBodHRwOi8vZ3VpcG4uZ2l0aHViLmlvL3NpbmZ1bC5qcy9cblxuICAgIC8qKlxuICAgICAqIEFycmF5LnByb3RvdHlwZS5yZWR1Y2UgZm9yIGJyb3dzZXJzIHRoYXQgZG9uJ3Qgc3VwcG9ydCBpdFxuICAgICAqIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL0FycmF5L1JlZHVjZSNDb21wYXRpYmlsaXR5XG4gICAgICovXG4gICAgaWYgKCdmdW5jdGlvbicgIT09IHR5cGVvZiBBcnJheS5wcm90b3R5cGUucmVkdWNlKSB7XG4gICAgICAgIEFycmF5LnByb3RvdHlwZS5yZWR1Y2UgPSBmdW5jdGlvbiAoY2FsbGJhY2ssIG9wdF9pbml0aWFsVmFsdWUpIHtcbiAgICAgICAgICAgICd1c2Ugc3RyaWN0JztcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKG51bGwgPT09IHRoaXMgfHwgJ3VuZGVmaW5lZCcgPT09IHR5cGVvZiB0aGlzKSB7XG4gICAgICAgICAgICAgICAgLy8gQXQgdGhlIG1vbWVudCBhbGwgbW9kZXJuIGJyb3dzZXJzLCB0aGF0IHN1cHBvcnQgc3RyaWN0IG1vZGUsIGhhdmVcbiAgICAgICAgICAgICAgICAvLyBuYXRpdmUgaW1wbGVtZW50YXRpb24gb2YgQXJyYXkucHJvdG90eXBlLnJlZHVjZS4gRm9yIGluc3RhbmNlLCBJRThcbiAgICAgICAgICAgICAgICAvLyBkb2VzIG5vdCBzdXBwb3J0IHN0cmljdCBtb2RlLCBzbyB0aGlzIGNoZWNrIGlzIGFjdHVhbGx5IHVzZWxlc3MuXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJyYXkucHJvdG90eXBlLnJlZHVjZSBjYWxsZWQgb24gbnVsbCBvciB1bmRlZmluZWQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKCdmdW5jdGlvbicgIT09IHR5cGVvZiBjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoY2FsbGJhY2sgKyAnIGlzIG5vdCBhIGZ1bmN0aW9uJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBpbmRleCxcbiAgICAgICAgICAgICAgICB2YWx1ZSxcbiAgICAgICAgICAgICAgICBsZW5ndGggPSB0aGlzLmxlbmd0aCA+Pj4gMCxcbiAgICAgICAgICAgICAgICBpc1ZhbHVlU2V0ID0gZmFsc2U7XG5cbiAgICAgICAgICAgIGlmICgxIDwgYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gb3B0X2luaXRpYWxWYWx1ZTtcbiAgICAgICAgICAgICAgICBpc1ZhbHVlU2V0ID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9yIChpbmRleCA9IDA7IGxlbmd0aCA+IGluZGV4OyArK2luZGV4KSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaGFzT3duUHJvcGVydHkoaW5kZXgpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpc1ZhbHVlU2V0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IGNhbGxiYWNrKHZhbHVlLCB0aGlzW2luZGV4XSwgaW5kZXgsIHRoaXMpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB0aGlzW2luZGV4XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzVmFsdWVTZXQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIWlzVmFsdWVTZXQpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdSZWR1Y2Ugb2YgZW1wdHkgYXJyYXkgd2l0aCBubyBpbml0aWFsIHZhbHVlJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBcbiAgICAvKipcbiAgICAgKiBDb21wdXRlcyB0aGUgbXVsdGlwbGllciBuZWNlc3NhcnkgdG8gbWFrZSB4ID49IDEsXG4gICAgICogZWZmZWN0aXZlbHkgZWxpbWluYXRpbmcgbWlzY2FsY3VsYXRpb25zIGNhdXNlZCBieVxuICAgICAqIGZpbml0ZSBwcmVjaXNpb24uXG4gICAgICovXG4gICAgZnVuY3Rpb24gbXVsdGlwbGllcih4KSB7XG4gICAgICAgIHZhciBwYXJ0cyA9IHgudG9TdHJpbmcoKS5zcGxpdCgnLicpO1xuICAgICAgICBpZiAocGFydHMubGVuZ3RoIDwgMikge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIE1hdGgucG93KDEwLCBwYXJ0c1sxXS5sZW5ndGgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdpdmVuIGEgdmFyaWFibGUgbnVtYmVyIG9mIGFyZ3VtZW50cywgcmV0dXJucyB0aGUgbWF4aW11bVxuICAgICAqIG11bHRpcGxpZXIgdGhhdCBtdXN0IGJlIHVzZWQgdG8gbm9ybWFsaXplIGFuIG9wZXJhdGlvbiBpbnZvbHZpbmdcbiAgICAgKiBhbGwgb2YgdGhlbS5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBjb3JyZWN0aW9uRmFjdG9yKCkge1xuICAgICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgICAgIHJldHVybiBhcmdzLnJlZHVjZShmdW5jdGlvbiAocHJldiwgbmV4dCkge1xuICAgICAgICAgICAgdmFyIG1wID0gbXVsdGlwbGllcihwcmV2KSxcbiAgICAgICAgICAgICAgICBtbiA9IG11bHRpcGxpZXIobmV4dCk7XG4gICAgICAgIHJldHVybiBtcCA+IG1uID8gbXAgOiBtbjtcbiAgICAgICAgfSwgLUluZmluaXR5KTtcbiAgICB9ICAgICAgICBcblxuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICBOdW1lcmFsIFByb3RvdHlwZVxuICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuXG4gICAgbnVtZXJhbC5mbiA9IE51bWVyYWwucHJvdG90eXBlID0ge1xuXG4gICAgICAgIGNsb25lIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIG51bWVyYWwodGhpcyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZm9ybWF0IDogZnVuY3Rpb24gKGlucHV0U3RyaW5nLCByb3VuZGluZ0Z1bmN0aW9uKSB7XG4gICAgICAgICAgICByZXR1cm4gZm9ybWF0TnVtZXJhbCh0aGlzLCBcbiAgICAgICAgICAgICAgICAgIGlucHV0U3RyaW5nID8gaW5wdXRTdHJpbmcgOiBkZWZhdWx0Rm9ybWF0LCBcbiAgICAgICAgICAgICAgICAgIChyb3VuZGluZ0Z1bmN0aW9uICE9PSB1bmRlZmluZWQpID8gcm91bmRpbmdGdW5jdGlvbiA6IE1hdGgucm91bmRcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgfSxcblxuICAgICAgICB1bmZvcm1hdCA6IGZ1bmN0aW9uIChpbnB1dFN0cmluZykge1xuICAgICAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChpbnB1dFN0cmluZykgPT09ICdbb2JqZWN0IE51bWJlcl0nKSB7IFxuICAgICAgICAgICAgICAgIHJldHVybiBpbnB1dFN0cmluZzsgXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdW5mb3JtYXROdW1lcmFsKHRoaXMsIGlucHV0U3RyaW5nID8gaW5wdXRTdHJpbmcgOiBkZWZhdWx0Rm9ybWF0KTtcbiAgICAgICAgfSxcblxuICAgICAgICB2YWx1ZSA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl92YWx1ZTtcbiAgICAgICAgfSxcblxuICAgICAgICB2YWx1ZU9mIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICAgICAgICB9LFxuXG4gICAgICAgIHNldCA6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5fdmFsdWUgPSBOdW1iZXIodmFsdWUpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgYWRkIDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICB2YXIgY29yckZhY3RvciA9IGNvcnJlY3Rpb25GYWN0b3IuY2FsbChudWxsLCB0aGlzLl92YWx1ZSwgdmFsdWUpO1xuICAgICAgICAgICAgZnVuY3Rpb24gY2JhY2soYWNjdW0sIGN1cnIsIGN1cnJJLCBPKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFjY3VtICsgY29yckZhY3RvciAqIGN1cnI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl92YWx1ZSA9IFt0aGlzLl92YWx1ZSwgdmFsdWVdLnJlZHVjZShjYmFjaywgMCkgLyBjb3JyRmFjdG9yO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc3VidHJhY3QgOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIHZhciBjb3JyRmFjdG9yID0gY29ycmVjdGlvbkZhY3Rvci5jYWxsKG51bGwsIHRoaXMuX3ZhbHVlLCB2YWx1ZSk7XG4gICAgICAgICAgICBmdW5jdGlvbiBjYmFjayhhY2N1bSwgY3VyciwgY3VyckksIE8pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYWNjdW0gLSBjb3JyRmFjdG9yICogY3VycjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX3ZhbHVlID0gW3ZhbHVlXS5yZWR1Y2UoY2JhY2ssIHRoaXMuX3ZhbHVlICogY29yckZhY3RvcikgLyBjb3JyRmFjdG9yOyAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgbXVsdGlwbHkgOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIGZ1bmN0aW9uIGNiYWNrKGFjY3VtLCBjdXJyLCBjdXJySSwgTykge1xuICAgICAgICAgICAgICAgIHZhciBjb3JyRmFjdG9yID0gY29ycmVjdGlvbkZhY3RvcihhY2N1bSwgY3Vycik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIChhY2N1bSAqIGNvcnJGYWN0b3IpICogKGN1cnIgKiBjb3JyRmFjdG9yKSAvXG4gICAgICAgICAgICAgICAgICAgIChjb3JyRmFjdG9yICogY29yckZhY3Rvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl92YWx1ZSA9IFt0aGlzLl92YWx1ZSwgdmFsdWVdLnJlZHVjZShjYmFjaywgMSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcblxuICAgICAgICBkaXZpZGUgOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIGZ1bmN0aW9uIGNiYWNrKGFjY3VtLCBjdXJyLCBjdXJySSwgTykge1xuICAgICAgICAgICAgICAgIHZhciBjb3JyRmFjdG9yID0gY29ycmVjdGlvbkZhY3RvcihhY2N1bSwgY3Vycik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIChhY2N1bSAqIGNvcnJGYWN0b3IpIC8gKGN1cnIgKiBjb3JyRmFjdG9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX3ZhbHVlID0gW3RoaXMuX3ZhbHVlLCB2YWx1ZV0ucmVkdWNlKGNiYWNrKTsgICAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9LFxuXG4gICAgICAgIGRpZmZlcmVuY2UgOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiBNYXRoLmFicyhudW1lcmFsKHRoaXMuX3ZhbHVlKS5zdWJ0cmFjdCh2YWx1ZSkudmFsdWUoKSk7XG4gICAgICAgIH1cblxuICAgIH07XG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgIEV4cG9zaW5nIE51bWVyYWxcbiAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAvLyBDb21tb25KUyBtb2R1bGUgaXMgZGVmaW5lZFxuICAgIGlmIChoYXNNb2R1bGUpIHtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBudW1lcmFsO1xuICAgIH1cblxuICAgIC8qZ2xvYmFsIGVuZGVyOmZhbHNlICovXG4gICAgaWYgKHR5cGVvZiBlbmRlciA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgLy8gaGVyZSwgYHRoaXNgIG1lYW5zIGB3aW5kb3dgIGluIHRoZSBicm93c2VyLCBvciBgZ2xvYmFsYCBvbiB0aGUgc2VydmVyXG4gICAgICAgIC8vIGFkZCBgbnVtZXJhbGAgYXMgYSBnbG9iYWwgb2JqZWN0IHZpYSBhIHN0cmluZyBpZGVudGlmaWVyLFxuICAgICAgICAvLyBmb3IgQ2xvc3VyZSBDb21waWxlciAnYWR2YW5jZWQnIG1vZGVcbiAgICAgICAgdGhpc1snbnVtZXJhbCddID0gbnVtZXJhbDtcbiAgICB9XG5cbiAgICAvKmdsb2JhbCBkZWZpbmU6ZmFsc2UgKi9cbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIGRlZmluZShbXSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIG51bWVyYWw7XG4gICAgICAgIH0pO1xuICAgIH1cbn0pLmNhbGwodGhpcyk7XG4iLCIvKlxuc3RyaW5nLmpzIC0gQ29weXJpZ2h0IChDKSAyMDEyLTIwMTMsIEpQIFJpY2hhcmRzb24gPGpwcmljaGFyZHNvbkBnbWFpbC5jb20+XG4qL1xuXG4hKGZ1bmN0aW9uKCkge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICB2YXIgVkVSU0lPTiA9ICcxLjguMCc7XG5cbiAgdmFyIEVOVElUSUVTID0ge307XG5cbi8vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vLyBBZGRlZCBhbiBpbml0aWFsaXplIGZ1bmN0aW9uIHdoaWNoIGlzIGVzc2VudGlhbGx5IHRoZSBjb2RlIGZyb20gdGhlIFNcbi8vIGNvbnN0cnVjdG9yLiAgTm93LCB0aGUgUyBjb25zdHJ1Y3RvciBjYWxscyB0aGlzIGFuZCBhIG5ldyBtZXRob2QgbmFtZWRcbi8vIHNldFZhbHVlIGNhbGxzIGl0IGFzIHdlbGwuICBUaGUgc2V0VmFsdWUgZnVuY3Rpb24gYWxsb3dzIGNvbnN0cnVjdG9ycyBmb3Jcbi8vIG1vZHVsZXMgdGhhdCBleHRlbmQgc3RyaW5nLmpzIHRvIHNldCB0aGUgaW5pdGlhbCB2YWx1ZSBvZiBhbiBvYmplY3Qgd2l0aG91dFxuLy8ga25vd2luZyB0aGUgaW50ZXJuYWwgd29ya2luZ3Mgb2Ygc3RyaW5nLmpzLlxuLy9cbi8vIEFsc28sIGFsbCBtZXRob2RzIHdoaWNoIHJldHVybiBhIG5ldyBTIG9iamVjdCBub3cgY2FsbDpcbi8vXG4vLyAgICAgIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3RvcihzKTtcbi8vXG4vLyBpbnN0ZWFkIG9mOlxuLy9cbi8vICAgICAgcmV0dXJuIG5ldyBTKHMpO1xuLy9cbi8vIFRoaXMgYWxsb3dzIGV4dGVuZGVkIG9iamVjdHMgdG8ga2VlcCB0aGVpciBwcm9wZXIgaW5zdGFuY2VPZiBhbmQgY29uc3RydWN0b3IuXG4vLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuXG4gIGZ1bmN0aW9uIGluaXRpYWxpemUgKG9iamVjdCwgcykge1xuICAgIGlmIChzICE9PSBudWxsICYmIHMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKHR5cGVvZiBzID09PSAnc3RyaW5nJylcbiAgICAgICAgb2JqZWN0LnMgPSBzO1xuICAgICAgZWxzZVxuICAgICAgICBvYmplY3QucyA9IHMudG9TdHJpbmcoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgb2JqZWN0LnMgPSBzOyAvL251bGwgb3IgdW5kZWZpbmVkXG4gICAgfVxuXG4gICAgb2JqZWN0Lm9yaWcgPSBzOyAvL29yaWdpbmFsIG9iamVjdCwgY3VycmVudGx5IG9ubHkgdXNlZCBieSB0b0NTVigpIGFuZCB0b0Jvb2xlYW4oKVxuXG4gICAgaWYgKHMgIT09IG51bGwgJiYgcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAob2JqZWN0Ll9fZGVmaW5lR2V0dGVyX18pIHtcbiAgICAgICAgb2JqZWN0Ll9fZGVmaW5lR2V0dGVyX18oJ2xlbmd0aCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiBvYmplY3Qucy5sZW5ndGg7XG4gICAgICAgIH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvYmplY3QubGVuZ3RoID0gcy5sZW5ndGg7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIG9iamVjdC5sZW5ndGggPSAtMTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBTKHMpIHtcbiAgXHRpbml0aWFsaXplKHRoaXMsIHMpO1xuICB9XG5cbiAgdmFyIF9fbnNwID0gU3RyaW5nLnByb3RvdHlwZTtcbiAgdmFyIF9fc3AgPSBTLnByb3RvdHlwZSA9IHtcblxuICAgIGJldHdlZW46IGZ1bmN0aW9uKGxlZnQsIHJpZ2h0KSB7XG4gICAgICB2YXIgcyA9IHRoaXMucztcbiAgICAgIHZhciBzdGFydFBvcyA9IHMuaW5kZXhPZihsZWZ0KTtcbiAgICAgIHZhciBlbmRQb3MgPSBzLmluZGV4T2YocmlnaHQsIHN0YXJ0UG9zICsgbGVmdC5sZW5ndGgpO1xuICAgICAgaWYgKGVuZFBvcyA9PSAtMSAmJiByaWdodCAhPSBudWxsKSBcbiAgICAgICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKCcnKVxuICAgICAgZWxzZSBpZiAoZW5kUG9zID09IC0xICYmIHJpZ2h0ID09IG51bGwpXG4gICAgICAgIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3RvcihzLnN1YnN0cmluZyhzdGFydFBvcyArIGxlZnQubGVuZ3RoKSlcbiAgICAgIGVsc2UgXG4gICAgICAgIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3RvcihzLnNsaWNlKHN0YXJ0UG9zICsgbGVmdC5sZW5ndGgsIGVuZFBvcykpO1xuICAgIH0sXG5cbiAgICAvLyMgbW9kaWZpZWQgc2xpZ2h0bHkgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vZXBlbGkvdW5kZXJzY29yZS5zdHJpbmdcbiAgICBjYW1lbGl6ZTogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcyA9IHRoaXMudHJpbSgpLnMucmVwbGFjZSgvKFxcLXxffFxccykrKC4pPy9nLCBmdW5jdGlvbihtYXRoYywgc2VwLCBjKSB7XG4gICAgICAgIHJldHVybiAoYyA/IGMudG9VcHBlckNhc2UoKSA6ICcnKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKHMpO1xuICAgIH0sXG5cbiAgICBjYXBpdGFsaXplOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3Rvcih0aGlzLnMuc3Vic3RyKDAsIDEpLnRvVXBwZXJDYXNlKCkgKyB0aGlzLnMuc3Vic3RyaW5nKDEpLnRvTG93ZXJDYXNlKCkpO1xuICAgIH0sXG5cbiAgICBjaGFyQXQ6IGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgICByZXR1cm4gdGhpcy5zLmNoYXJBdChpbmRleCk7XG4gICAgfSxcblxuICAgIGNob21wTGVmdDogZnVuY3Rpb24ocHJlZml4KSB7XG4gICAgICB2YXIgcyA9IHRoaXMucztcbiAgICAgIGlmIChzLmluZGV4T2YocHJlZml4KSA9PT0gMCkge1xuICAgICAgICAgcyA9IHMuc2xpY2UocHJlZml4Lmxlbmd0aCk7XG4gICAgICAgICByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3Iocyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgY2hvbXBSaWdodDogZnVuY3Rpb24oc3VmZml4KSB7XG4gICAgICBpZiAodGhpcy5lbmRzV2l0aChzdWZmaXgpKSB7XG4gICAgICAgIHZhciBzID0gdGhpcy5zO1xuICAgICAgICBzID0gcy5zbGljZSgwLCBzLmxlbmd0aCAtIHN1ZmZpeC5sZW5ndGgpO1xuICAgICAgICByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3Iocyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8jdGhhbmtzIEdvb2dsZVxuICAgIGNvbGxhcHNlV2hpdGVzcGFjZTogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcyA9IHRoaXMucy5yZXBsYWNlKC9bXFxzXFx4YTBdKy9nLCAnICcpLnJlcGxhY2UoL15cXHMrfFxccyskL2csICcnKTtcbiAgICAgIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3RvcihzKTtcbiAgICB9LFxuXG4gICAgY29udGFpbnM6IGZ1bmN0aW9uKHNzKSB7XG4gICAgICByZXR1cm4gdGhpcy5zLmluZGV4T2Yoc3MpID49IDA7XG4gICAgfSxcblxuICAgIGNvdW50OiBmdW5jdGlvbihzcykge1xuICAgICAgdmFyIGNvdW50ID0gMFxuICAgICAgICAsIHBvcyA9IHRoaXMucy5pbmRleE9mKHNzKVxuXG4gICAgICB3aGlsZSAocG9zID49IDApIHtcbiAgICAgICAgY291bnQgKz0gMVxuICAgICAgICBwb3MgPSB0aGlzLnMuaW5kZXhPZihzcywgcG9zICsgMSlcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGNvdW50XG4gICAgfSxcblxuICAgIC8vI21vZGlmaWVkIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL2VwZWxpL3VuZGVyc2NvcmUuc3RyaW5nXG4gICAgZGFzaGVyaXplOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBzID0gdGhpcy50cmltKCkucy5yZXBsYWNlKC9bX1xcc10rL2csICctJykucmVwbGFjZSgvKFtBLVpdKS9nLCAnLSQxJykucmVwbGFjZSgvLSsvZywgJy0nKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKHMpO1xuICAgIH0sXG5cbiAgICBkZWNvZGVIdG1sRW50aXRpZXM6IGZ1bmN0aW9uKCkgeyAvL2h0dHBzOi8vZ2l0aHViLmNvbS9zdWJzdGFjay9ub2RlLWVudC9ibG9iL21hc3Rlci9pbmRleC5qc1xuICAgICAgdmFyIHMgPSB0aGlzLnM7XG4gICAgICBzID0gcy5yZXBsYWNlKC8mIyhcXGQrKTs/L2csIGZ1bmN0aW9uIChfLCBjb2RlKSB7XG4gICAgICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKGNvZGUpO1xuICAgICAgfSlcbiAgICAgIC5yZXBsYWNlKC8mI1t4WF0oW0EtRmEtZjAtOV0rKTs/L2csIGZ1bmN0aW9uIChfLCBoZXgpIHtcbiAgICAgICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUocGFyc2VJbnQoaGV4LCAxNikpO1xuICAgICAgfSlcbiAgICAgIC5yZXBsYWNlKC8mKFteO1xcV10rOz8pL2csIGZ1bmN0aW9uIChtLCBlKSB7XG4gICAgICAgIHZhciBlZSA9IGUucmVwbGFjZSgvOyQvLCAnJyk7XG4gICAgICAgIHZhciB0YXJnZXQgPSBFTlRJVElFU1tlXSB8fCAoZS5tYXRjaCgvOyQvKSAmJiBFTlRJVElFU1tlZV0pO1xuICAgICAgICAgICAgXG4gICAgICAgIGlmICh0eXBlb2YgdGFyZ2V0ID09PSAnbnVtYmVyJykge1xuICAgICAgICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKHRhcmdldCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodHlwZW9mIHRhcmdldCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICByZXR1cm4gdGFyZ2V0O1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIHJldHVybiBtO1xuICAgICAgICB9XG4gICAgICB9KVxuXG4gICAgICByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3Iocyk7XG4gICAgfSxcblxuICAgIGVuZHNXaXRoOiBmdW5jdGlvbihzdWZmaXgpIHtcbiAgICAgIHZhciBsICA9IHRoaXMucy5sZW5ndGggLSBzdWZmaXgubGVuZ3RoO1xuICAgICAgcmV0dXJuIGwgPj0gMCAmJiB0aGlzLnMuaW5kZXhPZihzdWZmaXgsIGwpID09PSBsO1xuICAgIH0sXG5cbiAgICBlc2NhcGVIVE1MOiBmdW5jdGlvbigpIHsgLy9mcm9tIHVuZGVyc2NvcmUuc3RyaW5nXG4gICAgICByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3IodGhpcy5zLnJlcGxhY2UoL1smPD5cIiddL2csIGZ1bmN0aW9uKG0peyByZXR1cm4gJyYnICsgcmV2ZXJzZWRFc2NhcGVDaGFyc1ttXSArICc7JzsgfSkpO1xuICAgIH0sXG5cbiAgICBlbnN1cmVMZWZ0OiBmdW5jdGlvbihwcmVmaXgpIHtcbiAgICAgIHZhciBzID0gdGhpcy5zO1xuICAgICAgaWYgKHMuaW5kZXhPZihwcmVmaXgpID09PSAwKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKHByZWZpeCArIHMpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBlbnN1cmVSaWdodDogZnVuY3Rpb24oc3VmZml4KSB7XG4gICAgICB2YXIgcyA9IHRoaXMucztcbiAgICAgIGlmICh0aGlzLmVuZHNXaXRoKHN1ZmZpeCkpICB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKHMgKyBzdWZmaXgpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBodW1hbml6ZTogZnVuY3Rpb24oKSB7IC8vbW9kaWZpZWQgZnJvbSB1bmRlcnNjb3JlLnN0cmluZ1xuICAgICAgaWYgKHRoaXMucyA9PT0gbnVsbCB8fCB0aGlzLnMgPT09IHVuZGVmaW5lZClcbiAgICAgICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKCcnKVxuICAgICAgdmFyIHMgPSB0aGlzLnVuZGVyc2NvcmUoKS5yZXBsYWNlKC9faWQkLywnJykucmVwbGFjZSgvXy9nLCAnICcpLnRyaW0oKS5jYXBpdGFsaXplKClcbiAgICAgIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3RvcihzKVxuICAgIH0sXG5cbiAgICBpc0FscGhhOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiAhL1teYS16XFx4QzAtXFx4RkZdLy50ZXN0KHRoaXMucy50b0xvd2VyQ2FzZSgpKTtcbiAgICB9LFxuXG4gICAgaXNBbHBoYU51bWVyaWM6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuICEvW14wLTlhLXpcXHhDMC1cXHhGRl0vLnRlc3QodGhpcy5zLnRvTG93ZXJDYXNlKCkpO1xuICAgIH0sXG5cbiAgICBpc0VtcHR5OiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLnMgPT09IG51bGwgfHwgdGhpcy5zID09PSB1bmRlZmluZWQgPyB0cnVlIDogL15bXFxzXFx4YTBdKiQvLnRlc3QodGhpcy5zKTtcbiAgICB9LFxuXG4gICAgaXNMb3dlcjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5pc0FscGhhKCkgJiYgdGhpcy5zLnRvTG93ZXJDYXNlKCkgPT09IHRoaXMucztcbiAgICB9LFxuXG4gICAgaXNOdW1lcmljOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiAhL1teMC05XS8udGVzdCh0aGlzLnMpO1xuICAgIH0sXG5cbiAgICBpc1VwcGVyOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLmlzQWxwaGEoKSAmJiB0aGlzLnMudG9VcHBlckNhc2UoKSA9PT0gdGhpcy5zO1xuICAgIH0sXG5cbiAgICBsZWZ0OiBmdW5jdGlvbihOKSB7XG4gICAgICBpZiAoTiA+PSAwKSB7XG4gICAgICAgIHZhciBzID0gdGhpcy5zLnN1YnN0cigwLCBOKTtcbiAgICAgICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKHMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmlnaHQoLU4pO1xuICAgICAgfVxuICAgIH0sXG4gICAgXG4gICAgbGluZXM6IGZ1bmN0aW9uKCkgeyAvL2NvbnZlcnQgd2luZG93cyBuZXdsaW5lcyB0byB1bml4IG5ld2xpbmVzIHRoZW4gY29udmVydCB0byBhbiBBcnJheSBvZiBsaW5lc1xuICAgICAgcmV0dXJuIHRoaXMucmVwbGFjZUFsbCgnXFxyXFxuJywgJ1xcbicpLnMuc3BsaXQoJ1xcbicpO1xuICAgIH0sXG5cbiAgICBwYWQ6IGZ1bmN0aW9uKGxlbiwgY2gpIHsgLy9odHRwczovL2dpdGh1Yi5jb20vY29tcG9uZW50L3BhZFxuICAgICAgaWYgKGNoID09IG51bGwpIGNoID0gJyAnO1xuICAgICAgaWYgKHRoaXMucy5sZW5ndGggPj0gbGVuKSByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3IodGhpcy5zKTtcbiAgICAgIGxlbiA9IGxlbiAtIHRoaXMucy5sZW5ndGg7XG4gICAgICB2YXIgbGVmdCA9IEFycmF5KE1hdGguY2VpbChsZW4gLyAyKSArIDEpLmpvaW4oY2gpO1xuICAgICAgdmFyIHJpZ2h0ID0gQXJyYXkoTWF0aC5mbG9vcihsZW4gLyAyKSArIDEpLmpvaW4oY2gpO1xuICAgICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKGxlZnQgKyB0aGlzLnMgKyByaWdodCk7XG4gICAgfSxcblxuICAgIHBhZExlZnQ6IGZ1bmN0aW9uKGxlbiwgY2gpIHsgLy9odHRwczovL2dpdGh1Yi5jb20vY29tcG9uZW50L3BhZFxuICAgICAgaWYgKGNoID09IG51bGwpIGNoID0gJyAnO1xuICAgICAgaWYgKHRoaXMucy5sZW5ndGggPj0gbGVuKSByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3IodGhpcy5zKTtcbiAgICAgIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3RvcihBcnJheShsZW4gLSB0aGlzLnMubGVuZ3RoICsgMSkuam9pbihjaCkgKyB0aGlzLnMpO1xuICAgIH0sXG5cbiAgICBwYWRSaWdodDogZnVuY3Rpb24obGVuLCBjaCkgeyAvL2h0dHBzOi8vZ2l0aHViLmNvbS9jb21wb25lbnQvcGFkXG4gICAgICBpZiAoY2ggPT0gbnVsbCkgY2ggPSAnICc7XG4gICAgICBpZiAodGhpcy5zLmxlbmd0aCA+PSBsZW4pIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3Rvcih0aGlzLnMpO1xuICAgICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKHRoaXMucyArIEFycmF5KGxlbiAtIHRoaXMucy5sZW5ndGggKyAxKS5qb2luKGNoKSk7XG4gICAgfSxcblxuICAgIHBhcnNlQ1NWOiBmdW5jdGlvbihkZWxpbWl0ZXIsIHF1YWxpZmllciwgZXNjYXBlLCBsaW5lRGVsaW1pdGVyKSB7IC8vdHJ5IHRvIHBhcnNlIG5vIG1hdHRlciB3aGF0XG4gICAgICBkZWxpbWl0ZXIgPSBkZWxpbWl0ZXIgfHwgJywnO1xuICAgICAgZXNjYXBlID0gZXNjYXBlIHx8ICdcXFxcJ1xuICAgICAgaWYgKHR5cGVvZiBxdWFsaWZpZXIgPT0gJ3VuZGVmaW5lZCcpXG4gICAgICAgIHF1YWxpZmllciA9ICdcIic7XG5cbiAgICAgIHZhciBpID0gMCwgZmllbGRCdWZmZXIgPSBbXSwgZmllbGRzID0gW10sIGxlbiA9IHRoaXMucy5sZW5ndGgsIGluRmllbGQgPSBmYWxzZSwgc2VsZiA9IHRoaXM7XG4gICAgICB2YXIgY2EgPSBmdW5jdGlvbihpKXtyZXR1cm4gc2VsZi5zLmNoYXJBdChpKX07XG4gICAgICBpZiAodHlwZW9mIGxpbmVEZWxpbWl0ZXIgIT09ICd1bmRlZmluZWQnKSB2YXIgcm93cyA9IFtdO1xuXG4gICAgICBpZiAoIXF1YWxpZmllcilcbiAgICAgICAgaW5GaWVsZCA9IHRydWU7XG5cbiAgICAgIHdoaWxlIChpIDwgbGVuKSB7XG4gICAgICAgIHZhciBjdXJyZW50ID0gY2EoaSk7XG4gICAgICAgIHN3aXRjaCAoY3VycmVudCkge1xuICAgICAgICAgIGNhc2UgZXNjYXBlOlxuICAgICAgICAgIC8vZml4IGZvciBpc3N1ZXMgIzMyIGFuZCAjMzVcbiAgICAgICAgICBpZiAoaW5GaWVsZCAmJiAoKGVzY2FwZSAhPT0gcXVhbGlmaWVyKSB8fCBjYShpKzEpID09PSBxdWFsaWZpZXIpKSB7XG4gICAgICAgICAgICAgIGkgKz0gMTtcbiAgICAgICAgICAgICAgZmllbGRCdWZmZXIucHVzaChjYShpKSk7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoZXNjYXBlICE9PSBxdWFsaWZpZXIpIGJyZWFrO1xuICAgICAgICAgIGNhc2UgcXVhbGlmaWVyOlxuICAgICAgICAgICAgaW5GaWVsZCA9ICFpbkZpZWxkO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSBkZWxpbWl0ZXI6XG4gICAgICAgICAgICBpZiAoaW5GaWVsZCAmJiBxdWFsaWZpZXIpXG4gICAgICAgICAgICAgIGZpZWxkQnVmZmVyLnB1c2goY3VycmVudCk7XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgZmllbGRzLnB1c2goZmllbGRCdWZmZXIuam9pbignJykpXG4gICAgICAgICAgICAgIGZpZWxkQnVmZmVyLmxlbmd0aCA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIGxpbmVEZWxpbWl0ZXI6XG4gICAgICAgICAgICBpZiAoaW5GaWVsZCkge1xuICAgICAgICAgICAgICAgIGZpZWxkQnVmZmVyLnB1c2goY3VycmVudCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChyb3dzKSB7XG4gICAgICAgICAgICAgICAgICAgIGZpZWxkcy5wdXNoKGZpZWxkQnVmZmVyLmpvaW4oJycpKVxuICAgICAgICAgICAgICAgICAgICByb3dzLnB1c2goZmllbGRzKTtcbiAgICAgICAgICAgICAgICAgICAgZmllbGRzID0gW107XG4gICAgICAgICAgICAgICAgICAgIGZpZWxkQnVmZmVyLmxlbmd0aCA9IDA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGlmIChpbkZpZWxkKVxuICAgICAgICAgICAgICBmaWVsZEJ1ZmZlci5wdXNoKGN1cnJlbnQpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgaSArPSAxO1xuICAgICAgfVxuXG4gICAgICBmaWVsZHMucHVzaChmaWVsZEJ1ZmZlci5qb2luKCcnKSk7XG4gICAgICBpZiAocm93cykge1xuICAgICAgICByb3dzLnB1c2goZmllbGRzKTtcbiAgICAgICAgcmV0dXJuIHJvd3M7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmllbGRzO1xuICAgIH0sXG5cbiAgICByZXBsYWNlQWxsOiBmdW5jdGlvbihzcywgcikge1xuICAgICAgLy92YXIgcyA9IHRoaXMucy5yZXBsYWNlKG5ldyBSZWdFeHAoc3MsICdnJyksIHIpO1xuICAgICAgdmFyIHMgPSB0aGlzLnMuc3BsaXQoc3MpLmpvaW4ocilcbiAgICAgIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3RvcihzKTtcbiAgICB9LFxuXG4gICAgcmlnaHQ6IGZ1bmN0aW9uKE4pIHtcbiAgICAgIGlmIChOID49IDApIHtcbiAgICAgICAgdmFyIHMgPSB0aGlzLnMuc3Vic3RyKHRoaXMucy5sZW5ndGggLSBOLCBOKTtcbiAgICAgICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKHMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubGVmdCgtTik7XG4gICAgICB9XG4gICAgfSxcblxuICAgIHNldFZhbHVlOiBmdW5jdGlvbiAocykge1xuXHQgIGluaXRpYWxpemUodGhpcywgcyk7XG5cdCAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIHNsdWdpZnk6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHNsID0gKG5ldyBTKHRoaXMucy5yZXBsYWNlKC9bXlxcd1xccy1dL2csICcnKS50b0xvd2VyQ2FzZSgpKSkuZGFzaGVyaXplKCkucztcbiAgICAgIGlmIChzbC5jaGFyQXQoMCkgPT09ICctJylcbiAgICAgICAgc2wgPSBzbC5zdWJzdHIoMSk7XG4gICAgICByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3Ioc2wpO1xuICAgIH0sXG5cbiAgICBzdGFydHNXaXRoOiBmdW5jdGlvbihwcmVmaXgpIHtcbiAgICAgIHJldHVybiB0aGlzLnMubGFzdEluZGV4T2YocHJlZml4LCAwKSA9PT0gMDtcbiAgICB9LFxuXG4gICAgc3RyaXBQdW5jdHVhdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAvL3JldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3Rvcih0aGlzLnMucmVwbGFjZSgvW1xcLiwtXFwvIyEkJVxcXiZcXCo7Ont9PVxcLV9gfigpXS9nLFwiXCIpKTtcbiAgICAgIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3Rvcih0aGlzLnMucmVwbGFjZSgvW15cXHdcXHNdfF8vZywgXCJcIikucmVwbGFjZSgvXFxzKy9nLCBcIiBcIikpO1xuICAgIH0sXG5cbiAgICBzdHJpcFRhZ3M6IGZ1bmN0aW9uKCkgeyAvL2Zyb20gc3VnYXIuanNcbiAgICAgIHZhciBzID0gdGhpcy5zLCBhcmdzID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgPyBhcmd1bWVudHMgOiBbJyddO1xuICAgICAgbXVsdGlBcmdzKGFyZ3MsIGZ1bmN0aW9uKHRhZykge1xuICAgICAgICBzID0gcy5yZXBsYWNlKFJlZ0V4cCgnPFxcLz8nICsgdGFnICsgJ1tePD5dKj4nLCAnZ2knKSwgJycpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3Iocyk7XG4gICAgfSxcblxuICAgIHRlbXBsYXRlOiBmdW5jdGlvbih2YWx1ZXMsIG9wZW5pbmcsIGNsb3NpbmcpIHtcbiAgICAgIHZhciBzID0gdGhpcy5zXG4gICAgICB2YXIgb3BlbmluZyA9IG9wZW5pbmcgfHwgRXhwb3J0LlRNUExfT1BFTlxuICAgICAgdmFyIGNsb3NpbmcgPSBjbG9zaW5nIHx8IEV4cG9ydC5UTVBMX0NMT1NFXG5cbiAgICAgIHZhciBvcGVuID0gb3BlbmluZy5yZXBsYWNlKC9bLVtcXF0oKSpcXHNdL2csIFwiXFxcXCQmXCIpLnJlcGxhY2UoL1xcJC9nLCAnXFxcXCQnKVxuICAgICAgdmFyIGNsb3NlID0gY2xvc2luZy5yZXBsYWNlKC9bLVtcXF0oKSpcXHNdL2csIFwiXFxcXCQmXCIpLnJlcGxhY2UoL1xcJC9nLCAnXFxcXCQnKVxuICAgICAgdmFyIHIgPSBuZXcgUmVnRXhwKG9wZW4gKyAnKC4rPyknICsgY2xvc2UsICdnJylcbiAgICAgICAgLy8sIHIgPSAvXFx7XFx7KC4rPylcXH1cXH0vZ1xuICAgICAgdmFyIG1hdGNoZXMgPSBzLm1hdGNoKHIpIHx8IFtdO1xuXG4gICAgICBtYXRjaGVzLmZvckVhY2goZnVuY3Rpb24obWF0Y2gpIHtcbiAgICAgICAgdmFyIGtleSA9IG1hdGNoLnN1YnN0cmluZyhvcGVuaW5nLmxlbmd0aCwgbWF0Y2gubGVuZ3RoIC0gY2xvc2luZy5sZW5ndGgpOy8vY2hvcCB7eyBhbmQgfX1cbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZXNba2V5XSAhPSAndW5kZWZpbmVkJylcbiAgICAgICAgICBzID0gcy5yZXBsYWNlKG1hdGNoLCB2YWx1ZXNba2V5XSk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3RvcihzKTtcbiAgICB9LFxuXG4gICAgdGltZXM6IGZ1bmN0aW9uKG4pIHtcbiAgICAgIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3RvcihuZXcgQXJyYXkobiArIDEpLmpvaW4odGhpcy5zKSk7XG4gICAgfSxcblxuICAgIHRvQm9vbGVhbjogZnVuY3Rpb24oKSB7XG4gICAgICBpZiAodHlwZW9mIHRoaXMub3JpZyA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgdmFyIHMgPSB0aGlzLnMudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgcmV0dXJuIHMgPT09ICd0cnVlJyB8fCBzID09PSAneWVzJyB8fCBzID09PSAnb24nO1xuICAgICAgfSBlbHNlXG4gICAgICAgIHJldHVybiB0aGlzLm9yaWcgPT09IHRydWUgfHwgdGhpcy5vcmlnID09PSAxO1xuICAgIH0sXG5cbiAgICB0b0Zsb2F0OiBmdW5jdGlvbihwcmVjaXNpb24pIHtcbiAgICAgIHZhciBudW0gPSBwYXJzZUZsb2F0KHRoaXMucylcbiAgICAgIGlmIChwcmVjaXNpb24pXG4gICAgICAgIHJldHVybiBwYXJzZUZsb2F0KG51bS50b0ZpeGVkKHByZWNpc2lvbikpXG4gICAgICBlbHNlXG4gICAgICAgIHJldHVybiBudW1cbiAgICB9LFxuXG4gICAgdG9JbnQ6IGZ1bmN0aW9uKCkgeyAvL3RoYW5rcyBHb29nbGVcbiAgICAgIC8vIElmIHRoZSBzdHJpbmcgc3RhcnRzIHdpdGggJzB4JyBvciAnLTB4JywgcGFyc2UgYXMgaGV4LlxuICAgICAgcmV0dXJuIC9eXFxzKi0/MHgvaS50ZXN0KHRoaXMucykgPyBwYXJzZUludCh0aGlzLnMsIDE2KSA6IHBhcnNlSW50KHRoaXMucywgMTApXG4gICAgfSxcblxuICAgIHRyaW06IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHM7XG4gICAgICBpZiAodHlwZW9mIF9fbnNwLnRyaW0gPT09ICd1bmRlZmluZWQnKSBcbiAgICAgICAgcyA9IHRoaXMucy5yZXBsYWNlKC8oXlxccyp8XFxzKiQpL2csICcnKVxuICAgICAgZWxzZSBcbiAgICAgICAgcyA9IHRoaXMucy50cmltKClcbiAgICAgIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3RvcihzKTtcbiAgICB9LFxuXG4gICAgdHJpbUxlZnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHM7XG4gICAgICBpZiAoX19uc3AudHJpbUxlZnQpXG4gICAgICAgIHMgPSB0aGlzLnMudHJpbUxlZnQoKTtcbiAgICAgIGVsc2VcbiAgICAgICAgcyA9IHRoaXMucy5yZXBsYWNlKC8oXlxccyopL2csICcnKTtcbiAgICAgIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3RvcihzKTtcbiAgICB9LFxuXG4gICAgdHJpbVJpZ2h0OiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBzO1xuICAgICAgaWYgKF9fbnNwLnRyaW1SaWdodClcbiAgICAgICAgcyA9IHRoaXMucy50cmltUmlnaHQoKTtcbiAgICAgIGVsc2VcbiAgICAgICAgcyA9IHRoaXMucy5yZXBsYWNlKC9cXHMrJC8sICcnKTtcbiAgICAgIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3RvcihzKTtcbiAgICB9LFxuXG4gICAgdHJ1bmNhdGU6IGZ1bmN0aW9uKGxlbmd0aCwgcHJ1bmVTdHIpIHsgLy9mcm9tIHVuZGVyc2NvcmUuc3RyaW5nLCBhdXRob3I6IGdpdGh1Yi5jb20vcnd6XG4gICAgICB2YXIgc3RyID0gdGhpcy5zO1xuXG4gICAgICBsZW5ndGggPSB+fmxlbmd0aDtcbiAgICAgIHBydW5lU3RyID0gcHJ1bmVTdHIgfHwgJy4uLic7XG5cbiAgICAgIGlmIChzdHIubGVuZ3RoIDw9IGxlbmd0aCkgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKHN0cik7XG5cbiAgICAgIHZhciB0bXBsID0gZnVuY3Rpb24oYyl7IHJldHVybiBjLnRvVXBwZXJDYXNlKCkgIT09IGMudG9Mb3dlckNhc2UoKSA/ICdBJyA6ICcgJzsgfSxcbiAgICAgICAgdGVtcGxhdGUgPSBzdHIuc2xpY2UoMCwgbGVuZ3RoKzEpLnJlcGxhY2UoLy4oPz1cXFcqXFx3KiQpL2csIHRtcGwpOyAvLyAnSGVsbG8sIHdvcmxkJyAtPiAnSGVsbEFBIEFBQUFBJ1xuXG4gICAgICBpZiAodGVtcGxhdGUuc2xpY2UodGVtcGxhdGUubGVuZ3RoLTIpLm1hdGNoKC9cXHdcXHcvKSlcbiAgICAgICAgdGVtcGxhdGUgPSB0ZW1wbGF0ZS5yZXBsYWNlKC9cXHMqXFxTKyQvLCAnJyk7XG4gICAgICBlbHNlXG4gICAgICAgIHRlbXBsYXRlID0gbmV3IFModGVtcGxhdGUuc2xpY2UoMCwgdGVtcGxhdGUubGVuZ3RoLTEpKS50cmltUmlnaHQoKS5zO1xuXG4gICAgICByZXR1cm4gKHRlbXBsYXRlK3BydW5lU3RyKS5sZW5ndGggPiBzdHIubGVuZ3RoID8gbmV3IFMoc3RyKSA6IG5ldyBTKHN0ci5zbGljZSgwLCB0ZW1wbGF0ZS5sZW5ndGgpK3BydW5lU3RyKTtcbiAgICB9LFxuXG4gICAgdG9DU1Y6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGRlbGltID0gJywnLCBxdWFsaWZpZXIgPSAnXCInLCBlc2NhcGUgPSAnXFxcXCcsIGVuY2xvc2VOdW1iZXJzID0gdHJ1ZSwga2V5cyA9IGZhbHNlO1xuICAgICAgdmFyIGRhdGFBcnJheSA9IFtdO1xuXG4gICAgICBmdW5jdGlvbiBoYXNWYWwoaXQpIHtcbiAgICAgICAgcmV0dXJuIGl0ICE9PSBudWxsICYmIGl0ICE9PSAnJztcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiBhcmd1bWVudHNbMF0gPT09ICdvYmplY3QnKSB7XG4gICAgICAgIGRlbGltID0gYXJndW1lbnRzWzBdLmRlbGltaXRlciB8fCBkZWxpbTtcbiAgICAgICAgZGVsaW0gPSBhcmd1bWVudHNbMF0uc2VwYXJhdG9yIHx8IGRlbGltO1xuICAgICAgICBxdWFsaWZpZXIgPSBhcmd1bWVudHNbMF0ucXVhbGlmaWVyIHx8IHF1YWxpZmllcjtcbiAgICAgICAgZW5jbG9zZU51bWJlcnMgPSAhIWFyZ3VtZW50c1swXS5lbmNsb3NlTnVtYmVycztcbiAgICAgICAgZXNjYXBlID0gYXJndW1lbnRzWzBdLmVzY2FwZSB8fCBlc2NhcGU7XG4gICAgICAgIGtleXMgPSAhIWFyZ3VtZW50c1swXS5rZXlzO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgYXJndW1lbnRzWzBdID09PSAnc3RyaW5nJykge1xuICAgICAgICBkZWxpbSA9IGFyZ3VtZW50c1swXTtcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiBhcmd1bWVudHNbMV0gPT09ICdzdHJpbmcnKVxuICAgICAgICBxdWFsaWZpZXIgPSBhcmd1bWVudHNbMV07XG5cbiAgICAgIGlmIChhcmd1bWVudHNbMV0gPT09IG51bGwpXG4gICAgICAgIHF1YWxpZmllciA9IG51bGw7XG5cbiAgICAgICBpZiAodGhpcy5vcmlnIGluc3RhbmNlb2YgQXJyYXkpXG4gICAgICAgIGRhdGFBcnJheSAgPSB0aGlzLm9yaWc7XG4gICAgICBlbHNlIHsgLy9vYmplY3RcbiAgICAgICAgZm9yICh2YXIga2V5IGluIHRoaXMub3JpZylcbiAgICAgICAgICBpZiAodGhpcy5vcmlnLmhhc093blByb3BlcnR5KGtleSkpXG4gICAgICAgICAgICBpZiAoa2V5cylcbiAgICAgICAgICAgICAgZGF0YUFycmF5LnB1c2goa2V5KTtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgZGF0YUFycmF5LnB1c2godGhpcy5vcmlnW2tleV0pO1xuICAgICAgfVxuXG4gICAgICB2YXIgcmVwID0gZXNjYXBlICsgcXVhbGlmaWVyO1xuICAgICAgdmFyIGJ1aWxkU3RyaW5nID0gW107XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRhdGFBcnJheS5sZW5ndGg7ICsraSkge1xuICAgICAgICB2YXIgc2hvdWxkUXVhbGlmeSA9IGhhc1ZhbChxdWFsaWZpZXIpXG4gICAgICAgIGlmICh0eXBlb2YgZGF0YUFycmF5W2ldID09ICdudW1iZXInKVxuICAgICAgICAgIHNob3VsZFF1YWxpZnkgJj0gZW5jbG9zZU51bWJlcnM7XG4gICAgICAgIFxuICAgICAgICBpZiAoc2hvdWxkUXVhbGlmeSlcbiAgICAgICAgICBidWlsZFN0cmluZy5wdXNoKHF1YWxpZmllcik7XG4gICAgICAgIFxuICAgICAgICBpZiAoZGF0YUFycmF5W2ldICE9PSBudWxsICYmIGRhdGFBcnJheVtpXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgdmFyIGQgPSBuZXcgUyhkYXRhQXJyYXlbaV0pLnJlcGxhY2VBbGwocXVhbGlmaWVyLCByZXApLnM7XG4gICAgICAgICAgYnVpbGRTdHJpbmcucHVzaChkKTtcbiAgICAgICAgfSBlbHNlIFxuICAgICAgICAgIGJ1aWxkU3RyaW5nLnB1c2goJycpXG5cbiAgICAgICAgaWYgKHNob3VsZFF1YWxpZnkpXG4gICAgICAgICAgYnVpbGRTdHJpbmcucHVzaChxdWFsaWZpZXIpO1xuICAgICAgICBcbiAgICAgICAgaWYgKGRlbGltKVxuICAgICAgICAgIGJ1aWxkU3RyaW5nLnB1c2goZGVsaW0pO1xuICAgICAgfVxuXG4gICAgICAvL2Nob3AgbGFzdCBkZWxpbVxuICAgICAgLy9jb25zb2xlLmxvZyhidWlsZFN0cmluZy5sZW5ndGgpXG4gICAgICBidWlsZFN0cmluZy5sZW5ndGggPSBidWlsZFN0cmluZy5sZW5ndGggLSAxO1xuICAgICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKGJ1aWxkU3RyaW5nLmpvaW4oJycpKTtcbiAgICB9LFxuXG4gICAgdG9TdHJpbmc6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMucztcbiAgICB9LFxuXG4gICAgLy8jbW9kaWZpZWQgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vZXBlbGkvdW5kZXJzY29yZS5zdHJpbmdcbiAgICB1bmRlcnNjb3JlOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBzID0gdGhpcy50cmltKCkucy5yZXBsYWNlKC8oW2EtelxcZF0pKFtBLVpdKykvZywgJyQxXyQyJykucmVwbGFjZSgvWy1cXHNdKy9nLCAnXycpLnRvTG93ZXJDYXNlKCk7XG4gICAgICBpZiAoKG5ldyBTKHRoaXMucy5jaGFyQXQoMCkpKS5pc1VwcGVyKCkpIHtcbiAgICAgICAgcyA9ICdfJyArIHM7XG4gICAgICB9XG4gICAgICByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3Iocyk7XG4gICAgfSxcblxuICAgIHVuZXNjYXBlSFRNTDogZnVuY3Rpb24oKSB7IC8vZnJvbSB1bmRlcnNjb3JlLnN0cmluZ1xuICAgICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKHRoaXMucy5yZXBsYWNlKC9cXCYoW147XSspOy9nLCBmdW5jdGlvbihlbnRpdHksIGVudGl0eUNvZGUpe1xuICAgICAgICB2YXIgbWF0Y2g7XG5cbiAgICAgICAgaWYgKGVudGl0eUNvZGUgaW4gZXNjYXBlQ2hhcnMpIHtcbiAgICAgICAgICByZXR1cm4gZXNjYXBlQ2hhcnNbZW50aXR5Q29kZV07XG4gICAgICAgIH0gZWxzZSBpZiAobWF0Y2ggPSBlbnRpdHlDb2RlLm1hdGNoKC9eI3goW1xcZGEtZkEtRl0rKSQvKSkge1xuICAgICAgICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKHBhcnNlSW50KG1hdGNoWzFdLCAxNikpO1xuICAgICAgICB9IGVsc2UgaWYgKG1hdGNoID0gZW50aXR5Q29kZS5tYXRjaCgvXiMoXFxkKykkLykpIHtcbiAgICAgICAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZSh+fm1hdGNoWzFdKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gZW50aXR5O1xuICAgICAgICB9XG4gICAgICB9KSk7XG4gICAgfSxcblxuICAgIHZhbHVlT2Y6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMucy52YWx1ZU9mKCk7XG4gICAgfVxuXG4gIH1cblxuICB2YXIgbWV0aG9kc0FkZGVkID0gW107XG4gIGZ1bmN0aW9uIGV4dGVuZFByb3RvdHlwZSgpIHtcbiAgICBmb3IgKHZhciBuYW1lIGluIF9fc3ApIHtcbiAgICAgIChmdW5jdGlvbihuYW1lKXtcbiAgICAgICAgdmFyIGZ1bmMgPSBfX3NwW25hbWVdO1xuICAgICAgICBpZiAoIV9fbnNwLmhhc093blByb3BlcnR5KG5hbWUpKSB7XG4gICAgICAgICAgbWV0aG9kc0FkZGVkLnB1c2gobmFtZSk7XG4gICAgICAgICAgX19uc3BbbmFtZV0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIFN0cmluZy5wcm90b3R5cGUucyA9IHRoaXM7XG4gICAgICAgICAgICByZXR1cm4gZnVuYy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSkobmFtZSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcmVzdG9yZVByb3RvdHlwZSgpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1ldGhvZHNBZGRlZC5sZW5ndGg7ICsraSlcbiAgICAgIGRlbGV0ZSBTdHJpbmcucHJvdG90eXBlW21ldGhvZHNBZGRlZFtpXV07XG4gICAgbWV0aG9kc0FkZGVkLmxlbmd0aCA9IDA7XG4gIH1cblxuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLyogQXR0YWNoIE5hdGl2ZSBKYXZhU2NyaXB0IFN0cmluZyBQcm9wZXJ0aWVzXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICB2YXIgbmF0aXZlUHJvcGVydGllcyA9IGdldE5hdGl2ZVN0cmluZ1Byb3BlcnRpZXMoKTtcbiAgZm9yICh2YXIgbmFtZSBpbiBuYXRpdmVQcm9wZXJ0aWVzKSB7XG4gICAgKGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgIHZhciBzdHJpbmdQcm9wID0gX19uc3BbbmFtZV07XG4gICAgICBpZiAodHlwZW9mIHN0cmluZ1Byb3AgPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAvL2NvbnNvbGUubG9nKHN0cmluZ1Byb3ApXG4gICAgICAgIGlmICghX19zcFtuYW1lXSkge1xuICAgICAgICAgIGlmIChuYXRpdmVQcm9wZXJ0aWVzW25hbWVdID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgX19zcFtuYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKG5hbWUpXG4gICAgICAgICAgICAgIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3RvcihzdHJpbmdQcm9wLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBfX3NwW25hbWVdID0gc3RyaW5nUHJvcDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KShuYW1lKTtcbiAgfVxuXG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vKiBGdW5jdGlvbiBBbGlhc2VzXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICBfX3NwLnJlcGVhdCA9IF9fc3AudGltZXM7XG4gIF9fc3AuaW5jbHVkZSA9IF9fc3AuY29udGFpbnM7XG4gIF9fc3AudG9JbnRlZ2VyID0gX19zcC50b0ludDtcbiAgX19zcC50b0Jvb2wgPSBfX3NwLnRvQm9vbGVhbjtcbiAgX19zcC5kZWNvZGVIVE1MRW50aXRpZXMgPSBfX3NwLmRlY29kZUh0bWxFbnRpdGllcyAvL2Vuc3VyZSBjb25zaXN0ZW50IGNhc2luZyBzY2hlbWUgb2YgJ0hUTUwnXG5cblxuLy8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8vIFNldCB0aGUgY29uc3RydWN0b3IuICBXaXRob3V0IHRoaXMsIHN0cmluZy5qcyBvYmplY3RzIGFyZSBpbnN0YW5jZXMgb2Zcbi8vIE9iamVjdCBpbnN0ZWFkIG9mIFMuXG4vLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuXG4gIF9fc3AuY29uc3RydWN0b3IgPSBTO1xuXG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vKiBQcml2YXRlIEZ1bmN0aW9uc1xuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgZnVuY3Rpb24gZ2V0TmF0aXZlU3RyaW5nUHJvcGVydGllcygpIHtcbiAgICB2YXIgbmFtZXMgPSBnZXROYXRpdmVTdHJpbmdQcm9wZXJ0eU5hbWVzKCk7XG4gICAgdmFyIHJldE9iaiA9IHt9O1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuYW1lcy5sZW5ndGg7ICsraSkge1xuICAgICAgdmFyIG5hbWUgPSBuYW1lc1tpXTtcbiAgICAgIHZhciBmdW5jID0gX19uc3BbbmFtZV07XG4gICAgICB0cnkge1xuICAgICAgICB2YXIgdHlwZSA9IHR5cGVvZiBmdW5jLmFwcGx5KCd0ZXN0c3RyaW5nJywgW10pO1xuICAgICAgICByZXRPYmpbbmFtZV0gPSB0eXBlO1xuICAgICAgfSBjYXRjaCAoZSkge31cbiAgICB9XG4gICAgcmV0dXJuIHJldE9iajtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldE5hdGl2ZVN0cmluZ1Byb3BlcnR5TmFtZXMoKSB7XG4gICAgdmFyIHJlc3VsdHMgPSBbXTtcbiAgICBpZiAoT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMpIHtcbiAgICAgIHJlc3VsdHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhfX25zcCk7XG4gICAgICByZXN1bHRzLnNwbGljZShyZXN1bHRzLmluZGV4T2YoJ3ZhbHVlT2YnKSwgMSk7XG4gICAgICByZXN1bHRzLnNwbGljZShyZXN1bHRzLmluZGV4T2YoJ3RvU3RyaW5nJyksIDEpO1xuICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgfSBlbHNlIHsgLy9tZWFudCBmb3IgbGVnYWN5IGNydWZ0LCB0aGlzIGNvdWxkIHByb2JhYmx5IGJlIG1hZGUgbW9yZSBlZmZpY2llbnRcbiAgICAgIHZhciBzdHJpbmdOYW1lcyA9IHt9O1xuICAgICAgdmFyIG9iamVjdE5hbWVzID0gW107XG4gICAgICBmb3IgKHZhciBuYW1lIGluIFN0cmluZy5wcm90b3R5cGUpXG4gICAgICAgIHN0cmluZ05hbWVzW25hbWVdID0gbmFtZTtcblxuICAgICAgZm9yICh2YXIgbmFtZSBpbiBPYmplY3QucHJvdG90eXBlKVxuICAgICAgICBkZWxldGUgc3RyaW5nTmFtZXNbbmFtZV07XG5cbiAgICAgIC8vc3RyaW5nTmFtZXNbJ3RvU3RyaW5nJ10gPSAndG9TdHJpbmcnOyAvL3RoaXMgd2FzIGRlbGV0ZWQgd2l0aCB0aGUgcmVzdCBvZiB0aGUgb2JqZWN0IG5hbWVzXG4gICAgICBmb3IgKHZhciBuYW1lIGluIHN0cmluZ05hbWVzKSB7XG4gICAgICAgIHJlc3VsdHMucHVzaChuYW1lKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHRzO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIEV4cG9ydChzdHIpIHtcbiAgICByZXR1cm4gbmV3IFMoc3RyKTtcbiAgfTtcblxuICAvL2F0dGFjaCBleHBvcnRzIHRvIFN0cmluZ0pTV3JhcHBlclxuICBFeHBvcnQuZXh0ZW5kUHJvdG90eXBlID0gZXh0ZW5kUHJvdG90eXBlO1xuICBFeHBvcnQucmVzdG9yZVByb3RvdHlwZSA9IHJlc3RvcmVQcm90b3R5cGU7XG4gIEV4cG9ydC5WRVJTSU9OID0gVkVSU0lPTjtcbiAgRXhwb3J0LlRNUExfT1BFTiA9ICd7eyc7XG4gIEV4cG9ydC5UTVBMX0NMT1NFID0gJ319JztcbiAgRXhwb3J0LkVOVElUSUVTID0gRU5USVRJRVM7XG5cblxuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLyogRXhwb3J0c1xuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICAmJiB0eXBlb2YgbW9kdWxlLmV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBFeHBvcnQ7XG5cbiAgfSBlbHNlIHtcblxuICAgIGlmKHR5cGVvZiBkZWZpbmUgPT09IFwiZnVuY3Rpb25cIiAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICBkZWZpbmUoW10sIGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gRXhwb3J0O1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHdpbmRvdy5TID0gRXhwb3J0O1xuICAgIH1cbiAgfVxuXG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vKiAzcmQgUGFydHkgUHJpdmF0ZSBGdW5jdGlvbnNcbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gIC8vZnJvbSBzdWdhci5qc1xuICBmdW5jdGlvbiBtdWx0aUFyZ3MoYXJncywgZm4pIHtcbiAgICB2YXIgcmVzdWx0ID0gW10sIGk7XG4gICAgZm9yKGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7IGkrKykge1xuICAgICAgcmVzdWx0LnB1c2goYXJnc1tpXSk7XG4gICAgICBpZihmbikgZm4uY2FsbChhcmdzLCBhcmdzW2ldLCBpKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8vZnJvbSB1bmRlcnNjb3JlLnN0cmluZ1xuICB2YXIgZXNjYXBlQ2hhcnMgPSB7XG4gICAgbHQ6ICc8JyxcbiAgICBndDogJz4nLFxuICAgIHF1b3Q6ICdcIicsXG4gICAgYXBvczogXCInXCIsXG4gICAgYW1wOiAnJidcbiAgfTtcblxuICAvL2Zyb20gdW5kZXJzY29yZS5zdHJpbmdcbiAgdmFyIHJldmVyc2VkRXNjYXBlQ2hhcnMgPSB7fTtcbiAgZm9yKHZhciBrZXkgaW4gZXNjYXBlQ2hhcnMpeyByZXZlcnNlZEVzY2FwZUNoYXJzW2VzY2FwZUNoYXJzW2tleV1dID0ga2V5OyB9XG5cbiAgRU5USVRJRVMgPSB7XG4gICAgXCJhbXBcIiA6IFwiJlwiLFxuICAgIFwiZ3RcIiA6IFwiPlwiLFxuICAgIFwibHRcIiA6IFwiPFwiLFxuICAgIFwicXVvdFwiIDogXCJcXFwiXCIsXG4gICAgXCJhcG9zXCIgOiBcIidcIixcbiAgICBcIkFFbGlnXCIgOiAxOTgsXG4gICAgXCJBYWN1dGVcIiA6IDE5MyxcbiAgICBcIkFjaXJjXCIgOiAxOTQsXG4gICAgXCJBZ3JhdmVcIiA6IDE5MixcbiAgICBcIkFyaW5nXCIgOiAxOTcsXG4gICAgXCJBdGlsZGVcIiA6IDE5NSxcbiAgICBcIkF1bWxcIiA6IDE5NixcbiAgICBcIkNjZWRpbFwiIDogMTk5LFxuICAgIFwiRVRIXCIgOiAyMDgsXG4gICAgXCJFYWN1dGVcIiA6IDIwMSxcbiAgICBcIkVjaXJjXCIgOiAyMDIsXG4gICAgXCJFZ3JhdmVcIiA6IDIwMCxcbiAgICBcIkV1bWxcIiA6IDIwMyxcbiAgICBcIklhY3V0ZVwiIDogMjA1LFxuICAgIFwiSWNpcmNcIiA6IDIwNixcbiAgICBcIklncmF2ZVwiIDogMjA0LFxuICAgIFwiSXVtbFwiIDogMjA3LFxuICAgIFwiTnRpbGRlXCIgOiAyMDksXG4gICAgXCJPYWN1dGVcIiA6IDIxMSxcbiAgICBcIk9jaXJjXCIgOiAyMTIsXG4gICAgXCJPZ3JhdmVcIiA6IDIxMCxcbiAgICBcIk9zbGFzaFwiIDogMjE2LFxuICAgIFwiT3RpbGRlXCIgOiAyMTMsXG4gICAgXCJPdW1sXCIgOiAyMTQsXG4gICAgXCJUSE9STlwiIDogMjIyLFxuICAgIFwiVWFjdXRlXCIgOiAyMTgsXG4gICAgXCJVY2lyY1wiIDogMjE5LFxuICAgIFwiVWdyYXZlXCIgOiAyMTcsXG4gICAgXCJVdW1sXCIgOiAyMjAsXG4gICAgXCJZYWN1dGVcIiA6IDIyMSxcbiAgICBcImFhY3V0ZVwiIDogMjI1LFxuICAgIFwiYWNpcmNcIiA6IDIyNixcbiAgICBcImFlbGlnXCIgOiAyMzAsXG4gICAgXCJhZ3JhdmVcIiA6IDIyNCxcbiAgICBcImFyaW5nXCIgOiAyMjksXG4gICAgXCJhdGlsZGVcIiA6IDIyNyxcbiAgICBcImF1bWxcIiA6IDIyOCxcbiAgICBcImNjZWRpbFwiIDogMjMxLFxuICAgIFwiZWFjdXRlXCIgOiAyMzMsXG4gICAgXCJlY2lyY1wiIDogMjM0LFxuICAgIFwiZWdyYXZlXCIgOiAyMzIsXG4gICAgXCJldGhcIiA6IDI0MCxcbiAgICBcImV1bWxcIiA6IDIzNSxcbiAgICBcImlhY3V0ZVwiIDogMjM3LFxuICAgIFwiaWNpcmNcIiA6IDIzOCxcbiAgICBcImlncmF2ZVwiIDogMjM2LFxuICAgIFwiaXVtbFwiIDogMjM5LFxuICAgIFwibnRpbGRlXCIgOiAyNDEsXG4gICAgXCJvYWN1dGVcIiA6IDI0MyxcbiAgICBcIm9jaXJjXCIgOiAyNDQsXG4gICAgXCJvZ3JhdmVcIiA6IDI0MixcbiAgICBcIm9zbGFzaFwiIDogMjQ4LFxuICAgIFwib3RpbGRlXCIgOiAyNDUsXG4gICAgXCJvdW1sXCIgOiAyNDYsXG4gICAgXCJzemxpZ1wiIDogMjIzLFxuICAgIFwidGhvcm5cIiA6IDI1NCxcbiAgICBcInVhY3V0ZVwiIDogMjUwLFxuICAgIFwidWNpcmNcIiA6IDI1MSxcbiAgICBcInVncmF2ZVwiIDogMjQ5LFxuICAgIFwidXVtbFwiIDogMjUyLFxuICAgIFwieWFjdXRlXCIgOiAyNTMsXG4gICAgXCJ5dW1sXCIgOiAyNTUsXG4gICAgXCJjb3B5XCIgOiAxNjksXG4gICAgXCJyZWdcIiA6IDE3NCxcbiAgICBcIm5ic3BcIiA6IDE2MCxcbiAgICBcImlleGNsXCIgOiAxNjEsXG4gICAgXCJjZW50XCIgOiAxNjIsXG4gICAgXCJwb3VuZFwiIDogMTYzLFxuICAgIFwiY3VycmVuXCIgOiAxNjQsXG4gICAgXCJ5ZW5cIiA6IDE2NSxcbiAgICBcImJydmJhclwiIDogMTY2LFxuICAgIFwic2VjdFwiIDogMTY3LFxuICAgIFwidW1sXCIgOiAxNjgsXG4gICAgXCJvcmRmXCIgOiAxNzAsXG4gICAgXCJsYXF1b1wiIDogMTcxLFxuICAgIFwibm90XCIgOiAxNzIsXG4gICAgXCJzaHlcIiA6IDE3MyxcbiAgICBcIm1hY3JcIiA6IDE3NSxcbiAgICBcImRlZ1wiIDogMTc2LFxuICAgIFwicGx1c21uXCIgOiAxNzcsXG4gICAgXCJzdXAxXCIgOiAxODUsXG4gICAgXCJzdXAyXCIgOiAxNzgsXG4gICAgXCJzdXAzXCIgOiAxNzksXG4gICAgXCJhY3V0ZVwiIDogMTgwLFxuICAgIFwibWljcm9cIiA6IDE4MSxcbiAgICBcInBhcmFcIiA6IDE4MixcbiAgICBcIm1pZGRvdFwiIDogMTgzLFxuICAgIFwiY2VkaWxcIiA6IDE4NCxcbiAgICBcIm9yZG1cIiA6IDE4NixcbiAgICBcInJhcXVvXCIgOiAxODcsXG4gICAgXCJmcmFjMTRcIiA6IDE4OCxcbiAgICBcImZyYWMxMlwiIDogMTg5LFxuICAgIFwiZnJhYzM0XCIgOiAxOTAsXG4gICAgXCJpcXVlc3RcIiA6IDE5MSxcbiAgICBcInRpbWVzXCIgOiAyMTUsXG4gICAgXCJkaXZpZGVcIiA6IDI0NyxcbiAgICBcIk9FbGlnO1wiIDogMzM4LFxuICAgIFwib2VsaWc7XCIgOiAzMzksXG4gICAgXCJTY2Fyb247XCIgOiAzNTIsXG4gICAgXCJzY2Fyb247XCIgOiAzNTMsXG4gICAgXCJZdW1sO1wiIDogMzc2LFxuICAgIFwiZm5vZjtcIiA6IDQwMixcbiAgICBcImNpcmM7XCIgOiA3MTAsXG4gICAgXCJ0aWxkZTtcIiA6IDczMixcbiAgICBcIkFscGhhO1wiIDogOTEzLFxuICAgIFwiQmV0YTtcIiA6IDkxNCxcbiAgICBcIkdhbW1hO1wiIDogOTE1LFxuICAgIFwiRGVsdGE7XCIgOiA5MTYsXG4gICAgXCJFcHNpbG9uO1wiIDogOTE3LFxuICAgIFwiWmV0YTtcIiA6IDkxOCxcbiAgICBcIkV0YTtcIiA6IDkxOSxcbiAgICBcIlRoZXRhO1wiIDogOTIwLFxuICAgIFwiSW90YTtcIiA6IDkyMSxcbiAgICBcIkthcHBhO1wiIDogOTIyLFxuICAgIFwiTGFtYmRhO1wiIDogOTIzLFxuICAgIFwiTXU7XCIgOiA5MjQsXG4gICAgXCJOdTtcIiA6IDkyNSxcbiAgICBcIlhpO1wiIDogOTI2LFxuICAgIFwiT21pY3JvbjtcIiA6IDkyNyxcbiAgICBcIlBpO1wiIDogOTI4LFxuICAgIFwiUmhvO1wiIDogOTI5LFxuICAgIFwiU2lnbWE7XCIgOiA5MzEsXG4gICAgXCJUYXU7XCIgOiA5MzIsXG4gICAgXCJVcHNpbG9uO1wiIDogOTMzLFxuICAgIFwiUGhpO1wiIDogOTM0LFxuICAgIFwiQ2hpO1wiIDogOTM1LFxuICAgIFwiUHNpO1wiIDogOTM2LFxuICAgIFwiT21lZ2E7XCIgOiA5MzcsXG4gICAgXCJhbHBoYTtcIiA6IDk0NSxcbiAgICBcImJldGE7XCIgOiA5NDYsXG4gICAgXCJnYW1tYTtcIiA6IDk0NyxcbiAgICBcImRlbHRhO1wiIDogOTQ4LFxuICAgIFwiZXBzaWxvbjtcIiA6IDk0OSxcbiAgICBcInpldGE7XCIgOiA5NTAsXG4gICAgXCJldGE7XCIgOiA5NTEsXG4gICAgXCJ0aGV0YTtcIiA6IDk1MixcbiAgICBcImlvdGE7XCIgOiA5NTMsXG4gICAgXCJrYXBwYTtcIiA6IDk1NCxcbiAgICBcImxhbWJkYTtcIiA6IDk1NSxcbiAgICBcIm11O1wiIDogOTU2LFxuICAgIFwibnU7XCIgOiA5NTcsXG4gICAgXCJ4aTtcIiA6IDk1OCxcbiAgICBcIm9taWNyb247XCIgOiA5NTksXG4gICAgXCJwaTtcIiA6IDk2MCxcbiAgICBcInJobztcIiA6IDk2MSxcbiAgICBcInNpZ21hZjtcIiA6IDk2MixcbiAgICBcInNpZ21hO1wiIDogOTYzLFxuICAgIFwidGF1O1wiIDogOTY0LFxuICAgIFwidXBzaWxvbjtcIiA6IDk2NSxcbiAgICBcInBoaTtcIiA6IDk2NixcbiAgICBcImNoaTtcIiA6IDk2NyxcbiAgICBcInBzaTtcIiA6IDk2OCxcbiAgICBcIm9tZWdhO1wiIDogOTY5LFxuICAgIFwidGhldGFzeW07XCIgOiA5NzcsXG4gICAgXCJ1cHNpaDtcIiA6IDk3OCxcbiAgICBcInBpdjtcIiA6IDk4MixcbiAgICBcImVuc3A7XCIgOiA4MTk0LFxuICAgIFwiZW1zcDtcIiA6IDgxOTUsXG4gICAgXCJ0aGluc3A7XCIgOiA4MjAxLFxuICAgIFwienduajtcIiA6IDgyMDQsXG4gICAgXCJ6d2o7XCIgOiA4MjA1LFxuICAgIFwibHJtO1wiIDogODIwNixcbiAgICBcInJsbTtcIiA6IDgyMDcsXG4gICAgXCJuZGFzaDtcIiA6IDgyMTEsXG4gICAgXCJtZGFzaDtcIiA6IDgyMTIsXG4gICAgXCJsc3F1bztcIiA6IDgyMTYsXG4gICAgXCJyc3F1bztcIiA6IDgyMTcsXG4gICAgXCJzYnF1bztcIiA6IDgyMTgsXG4gICAgXCJsZHF1bztcIiA6IDgyMjAsXG4gICAgXCJyZHF1bztcIiA6IDgyMjEsXG4gICAgXCJiZHF1bztcIiA6IDgyMjIsXG4gICAgXCJkYWdnZXI7XCIgOiA4MjI0LFxuICAgIFwiRGFnZ2VyO1wiIDogODIyNSxcbiAgICBcImJ1bGw7XCIgOiA4MjI2LFxuICAgIFwiaGVsbGlwO1wiIDogODIzMCxcbiAgICBcInBlcm1pbDtcIiA6IDgyNDAsXG4gICAgXCJwcmltZTtcIiA6IDgyNDIsXG4gICAgXCJQcmltZTtcIiA6IDgyNDMsXG4gICAgXCJsc2FxdW87XCIgOiA4MjQ5LFxuICAgIFwicnNhcXVvO1wiIDogODI1MCxcbiAgICBcIm9saW5lO1wiIDogODI1NCxcbiAgICBcImZyYXNsO1wiIDogODI2MCxcbiAgICBcImV1cm87XCIgOiA4MzY0LFxuICAgIFwiaW1hZ2U7XCIgOiA4NDY1LFxuICAgIFwid2VpZXJwO1wiIDogODQ3MixcbiAgICBcInJlYWw7XCIgOiA4NDc2LFxuICAgIFwidHJhZGU7XCIgOiA4NDgyLFxuICAgIFwiYWxlZnN5bTtcIiA6IDg1MDEsXG4gICAgXCJsYXJyO1wiIDogODU5MixcbiAgICBcInVhcnI7XCIgOiA4NTkzLFxuICAgIFwicmFycjtcIiA6IDg1OTQsXG4gICAgXCJkYXJyO1wiIDogODU5NSxcbiAgICBcImhhcnI7XCIgOiA4NTk2LFxuICAgIFwiY3JhcnI7XCIgOiA4NjI5LFxuICAgIFwibEFycjtcIiA6IDg2NTYsXG4gICAgXCJ1QXJyO1wiIDogODY1NyxcbiAgICBcInJBcnI7XCIgOiA4NjU4LFxuICAgIFwiZEFycjtcIiA6IDg2NTksXG4gICAgXCJoQXJyO1wiIDogODY2MCxcbiAgICBcImZvcmFsbDtcIiA6IDg3MDQsXG4gICAgXCJwYXJ0O1wiIDogODcwNixcbiAgICBcImV4aXN0O1wiIDogODcwNyxcbiAgICBcImVtcHR5O1wiIDogODcwOSxcbiAgICBcIm5hYmxhO1wiIDogODcxMSxcbiAgICBcImlzaW47XCIgOiA4NzEyLFxuICAgIFwibm90aW47XCIgOiA4NzEzLFxuICAgIFwibmk7XCIgOiA4NzE1LFxuICAgIFwicHJvZDtcIiA6IDg3MTksXG4gICAgXCJzdW07XCIgOiA4NzIxLFxuICAgIFwibWludXM7XCIgOiA4NzIyLFxuICAgIFwibG93YXN0O1wiIDogODcyNyxcbiAgICBcInJhZGljO1wiIDogODczMCxcbiAgICBcInByb3A7XCIgOiA4NzMzLFxuICAgIFwiaW5maW47XCIgOiA4NzM0LFxuICAgIFwiYW5nO1wiIDogODczNixcbiAgICBcImFuZDtcIiA6IDg3NDMsXG4gICAgXCJvcjtcIiA6IDg3NDQsXG4gICAgXCJjYXA7XCIgOiA4NzQ1LFxuICAgIFwiY3VwO1wiIDogODc0NixcbiAgICBcImludDtcIiA6IDg3NDcsXG4gICAgXCJ0aGVyZTQ7XCIgOiA4NzU2LFxuICAgIFwic2ltO1wiIDogODc2NCxcbiAgICBcImNvbmc7XCIgOiA4NzczLFxuICAgIFwiYXN5bXA7XCIgOiA4Nzc2LFxuICAgIFwibmU7XCIgOiA4ODAwLFxuICAgIFwiZXF1aXY7XCIgOiA4ODAxLFxuICAgIFwibGU7XCIgOiA4ODA0LFxuICAgIFwiZ2U7XCIgOiA4ODA1LFxuICAgIFwic3ViO1wiIDogODgzNCxcbiAgICBcInN1cDtcIiA6IDg4MzUsXG4gICAgXCJuc3ViO1wiIDogODgzNixcbiAgICBcInN1YmU7XCIgOiA4ODM4LFxuICAgIFwic3VwZTtcIiA6IDg4MzksXG4gICAgXCJvcGx1cztcIiA6IDg4NTMsXG4gICAgXCJvdGltZXM7XCIgOiA4ODU1LFxuICAgIFwicGVycDtcIiA6IDg4NjksXG4gICAgXCJzZG90O1wiIDogODkwMSxcbiAgICBcImxjZWlsO1wiIDogODk2OCxcbiAgICBcInJjZWlsO1wiIDogODk2OSxcbiAgICBcImxmbG9vcjtcIiA6IDg5NzAsXG4gICAgXCJyZmxvb3I7XCIgOiA4OTcxLFxuICAgIFwibGFuZztcIiA6IDkwMDEsXG4gICAgXCJyYW5nO1wiIDogOTAwMixcbiAgICBcImxvejtcIiA6IDk2NzQsXG4gICAgXCJzcGFkZXM7XCIgOiA5ODI0LFxuICAgIFwiY2x1YnM7XCIgOiA5ODI3LFxuICAgIFwiaGVhcnRzO1wiIDogOTgyOSxcbiAgICBcImRpYW1zO1wiIDogOTgzMFxuICB9XG5cblxufSkuY2FsbCh0aGlzKTtcbiIsImxldCBwID0gU3ltYm9sKCk7XG5cbmxldCBIdG1sID0ge1xuXHRwYXJzZUFsbChodG1sKSB7XG5cdFx0bGV0IGVsICAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHRlbC5pbm5lckhUTUwgPSBodG1sO1xuXHRcdHJldHVybiBBcnJheS5wcm90b3R5cGUuc2xpY2UuYXBwbHkoZWwuY2hpbGROb2Rlcyk7XG5cdH0sXG5cdHBhcnNlKGh0bWwpIHtcblx0XHRyZXR1cm4gdGhpcy5wYXJzZUFsbChodG1sKVswXTtcblx0fVxufTtcblxuY2xhc3MgRG9tU3RyZWFtIHtcblx0Y29uc3RydWN0b3Ioc291cmNlKSB7XG5cdFx0dGhpc1twXSA9IHNvdXJjZTtcblx0fVxuXHRhcHBseURpc3BsYXkoZWwsIGRpc3BsYXkgPSBcIlwiKSB7XG5cdFx0bGV0IG9sZCA9IGVsLnN0eWxlLmRpc3BsYXksXG5cdFx0XHTGkiA9ICh2KSA9PiBlbC5zdHlsZS5kaXNwbGF5ID0gdiA/IGRpc3BsYXkgOiBcIm5vbmVcIjtcblx0XHR0aGlzW3BdLnN1YnNjcmliZSjGkik7XG5cdFx0cmV0dXJuICgpID0+IHtcblx0XHRcdHRoaXNbcF0udW5zdWJzY3JpYmUoxpIpO1xuXHRcdFx0ZWwuc3R5bGUuZGlzcGxheSA9IG9sZDtcblx0XHR9O1xuXHR9XG5cdGFwcGx5VGV4dChlbCkge1xuXHRcdGxldCBvbGQgPSBlbC5pbm5lckhUTUwsXG5cdFx0XHTGkiA9ICh2KSA9PiBlbC5pbm5lckhUTUwgPSB2IHx8IFwiXCI7XG5cdFx0dGhpc1twXS5zdWJzY3JpYmUoxpIpO1xuXHRcdHJldHVybiAoKSA9PiB7XG5cdFx0XHR0aGlzW3BdLnVuc3Vic2NyaWJlKMaSKTtcblx0XHRcdMaSKG9sZCk7XG5cdFx0fTtcblx0fVxuXHRhcHBseUF0dHJpYnV0ZShuYW1lLCBlbCkge1xuXHRcdGxldCBvbGQgPSBlbC5nZXRBdHRyaWJ1dGUobmFtZSksXG5cdFx0XHTGkiA9ICh2KSA9PiB7XG5cdFx0XHRcdHYgPT0gbnVsbCA/IGVsLnJlbW92ZUF0dHJpYnV0ZShuYW1lKSA6IGVsLnNldEF0dHJpYnV0ZShuYW1lLCB2KTtcblx0XHRcdH1cblx0XHR0aGlzW3BdLnN1YnNjcmliZSjGkik7XG5cdFx0cmV0dXJuICgpID0+IHtcblx0XHRcdHRoaXNbcF0udW5zdWJzY3JpYmUoxpIpO1xuXHRcdFx0xpIob2xkKTtcblx0XHR9O1xuXHR9XG5cdGFwcGx5U3dhcENsYXNzKGVsLCBjbGFzc05hbWUpIHtcblx0XHRsZXQgaGFzID0gZWwuY2xhc3NMaXN0LmNvbnRhaW5zKGNsYXNzTmFtZSksXG5cdFx0XHTGkiA9ICh2KSA9PiB2ID8gZWwuY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpIDogZWwuY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWUpO1xuXHRcdHRoaXNbcF0uc3Vic2NyaWJlKMaSKTtcblx0XHRyZXR1cm4gKCkgPT4ge1xuXHRcdFx0dGhpc1twXS51bnN1YnNjcmliZSjGkik7XG5cdFx0XHTGkihoYXMpO1xuXHRcdH07XG5cdH1cbn1cblxubGV0IERvbSA9IHtcblx0c3RyZWFtKHNvdXJjZSkge1xuXHRcdHJldHVybiBuZXcgRG9tU3RyZWFtKHNvdXJjZSk7XG5cdH1cbn1cblxubGV0IFF1ZXJ5ID0ge1xuXHRmaXJzdChzZWxlY3RvciwgY3R4KSB7XG5cdFx0cmV0dXJuIChjdHggfHwgZG9jdW1lbnQpLnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xuXHR9LFxuXG5cdGFsbChzZWxlY3RvciwgY3R4KSB7XG5cdFx0cmV0dXJuIChjdHggfHwgZG9jdW1lbnQpLnF1ZXJ5KHNlbGVjdG9yKTtcblx0fVxufTtcblxuZXhwb3J0IHsgSHRtbCwgUXVlcnksIERvbSB9OyIsImxldCBpbW1lZGlhdGUgPSByZXF1aXJlKCdpbW1lZGlhdGUnKTtcblxubGV0IFRpbWVyID0ge1xuXHRkZWxheShtcywgxpIpIHtcblx0XHRpZijGkilcblx0XHRcdHJldHVybiBzZXRUaW1lb3V0KMaSLCBtcyk7XG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIG1zKSk7XG5cdH0sXG5cdGltbWVkaWF0ZSjGkikge1xuXHRcdGlmKMaSKVxuXHRcdFx0cmV0dXJuIGltbWVkaWF0ZSjGkik7XG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBpbW1lZGlhdGUocmVzb2x2ZSkpO1xuXHR9LFxuXHRkZWJvdW5jZSjGkiwgbXMgPSAwKSB7XG5cdFx0bGV0IHRpZCwgY29udGV4dCwgYXJncywgbGF0ZXLGkjtcblx0XHRyZXR1cm4gZnVuY3Rpb24oKSB7XG5cdFx0XHRjb250ZXh0ID0gdGhpcztcblx0XHRcdGFyZ3MgPSBhcmd1bWVudHM7XG5cdFx0XHRsYXRlcsaSID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGlmICghaW1tZWRpYXRlKSDGki5hcHBseShjb250ZXh0LCBhcmdzKTtcblx0XHRcdH07XG5cdFx0XHRjbGVhclRpbWVvdXQodGlkKTtcblx0XHRcdHRpZCA9IHNldFRpbWVvdXQobGF0ZXLGkiwgbXMpO1xuXHRcdH07XG5cdH0sXG5cdHJlZHVjZSjGkiwgbXMgPSAwKSB7XG5cdFx0bGV0IHRpZCwgY29udGV4dCwgYXJncztcblx0XHRyZXR1cm4gZnVuY3Rpb24oKSB7XG5cdFx0XHRjb250ZXh0ID0gdGhpcztcblx0XHRcdGFyZ3MgPSBhcmd1bWVudHM7XG5cdFx0XHRpZih0aWQpIHJldHVybjtcblx0XHRcdHRpZCA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHRpZCA9IG51bGw7XG5cdFx0XHRcdMaSLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuXHRcdFx0fSwgbXMpO1xuXHRcdH07XG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgVGltZXI7Il19
