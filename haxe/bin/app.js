(function ($hx_exports) { "use strict";
$hx_exports.promhx = $hx_exports.promhx || {};
var $estr = function() { return js.Boot.__string_rec(this,''); };
function $extend(from, fields) {
	function Inherit() {} Inherit.prototype = from; var proto = new Inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var HxOverrides = function() { };
HxOverrides.__name__ = true;
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
};
var List = function() {
	this.length = 0;
};
List.__name__ = true;
List.prototype = {
	add: function(item) {
		var x = [item];
		if(this.h == null) this.h = x; else this.q[1] = x;
		this.q = x;
		this.length++;
	}
	,pop: function() {
		if(this.h == null) return null;
		var x = this.h[0];
		this.h = this.h[1];
		if(this.h == null) this.q = null;
		this.length--;
		return x;
	}
	,__class__: List
};
var Main = function() { };
Main.__name__ = true;
Main.main = function() {
	dom.Dom.ready().then(function(_) {
		var container = dom.Query.first(".container");
		var schema = new ui.Schema();
		haxe.Log.trace("Hello World",{ fileName : "Main.hx", lineNumber : 9, className : "Main", methodName : "main"});
	});
};
var IMap = function() { };
IMap.__name__ = true;
var Std = function() { };
Std.__name__ = true;
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
};
var dom = {};
dom.Html = function() { };
dom.Html.__name__ = true;
dom.Html.parseList = function(html) {
	var el = window.document.createElement("div");
	el.innerHTML = html;
	return el.childNodes;
};
dom.Html.parseAll = function(html) {
	return dom._Dom.H.toArray(dom.Html.parseList(html));
};
dom.Html.parse = function(html) {
	return dom.Html.parseList(html)[0];
};
dom.Dom = function() { };
dom.Dom.__name__ = true;
dom.Dom.ready = function() {
	var deferred = new promhx.Promise();
	window.document.addEventListener("DOMContentLoaded",function(_) {
		deferred.resolve(thx.Nil.nil);
	},false);
	return deferred;
};
dom.Query = function() { };
dom.Query.__name__ = true;
dom.Query.first = function(selector,ctx) {
	return (ctx != null?dom.Query.doc:ctx).querySelector(selector);
};
dom.Query.list = function(selector,ctx) {
	return (ctx != null?dom.Query.doc:ctx).querySelectorAll(selector);
};
dom.Query.all = function(selector,ctx) {
	return dom._Dom.H.toArray(dom.Query.list(selector,ctx));
};
dom._Dom = {};
dom._Dom.H = function() { };
dom._Dom.H.__name__ = true;
dom._Dom.H.toArray = function(list) {
	return Array.prototype.slice.call(list,0);
};
var haxe = {};
haxe.Log = function() { };
haxe.Log.__name__ = true;
haxe.Log.trace = function(v,infos) {
	js.Boot.__trace(v,infos);
};
haxe.ds = {};
haxe.ds.StringMap = function() {
	this.h = { };
};
haxe.ds.StringMap.__name__ = true;
haxe.ds.StringMap.__interfaces__ = [IMap];
haxe.ds.StringMap.prototype = {
	set: function(key,value) {
		this.h["$" + key] = value;
	}
	,get: function(key) {
		return this.h["$" + key];
	}
	,exists: function(key) {
		return this.h.hasOwnProperty("$" + key);
	}
	,remove: function(key) {
		key = "$" + key;
		if(!this.h.hasOwnProperty(key)) return false;
		delete(this.h[key]);
		return true;
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key.substr(1));
		}
		return HxOverrides.iter(a);
	}
	,__class__: haxe.ds.StringMap
};
var js = {};
js.Boot = function() { };
js.Boot.__name__ = true;
js.Boot.__unhtml = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
};
js.Boot.__trace = function(v,i) {
	var msg;
	if(i != null) msg = i.fileName + ":" + i.lineNumber + ": "; else msg = "";
	msg += js.Boot.__string_rec(v,"");
	if(i != null && i.customParams != null) {
		var _g = 0;
		var _g1 = i.customParams;
		while(_g < _g1.length) {
			var v1 = _g1[_g];
			++_g;
			msg += "," + js.Boot.__string_rec(v1,"");
		}
	}
	var d;
	if(typeof(document) != "undefined" && (d = document.getElementById("haxe:trace")) != null) d.innerHTML += js.Boot.__unhtml(msg) + "<br/>"; else if(typeof console != "undefined" && console.log != null) console.log(msg);
};
js.Boot.getClass = function(o) {
	if((o instanceof Array) && o.__enum__ == null) return Array; else return o.__class__;
};
js.Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str = o[0] + "(";
				s += "\t";
				var _g1 = 2;
				var _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) str += "," + js.Boot.__string_rec(o[i],s); else str += js.Boot.__string_rec(o[i],s);
				}
				return str + ")";
			}
			var l = o.length;
			var i1;
			var str1 = "[";
			s += "\t";
			var _g2 = 0;
			while(_g2 < l) {
				var i2 = _g2++;
				str1 += (i2 > 0?",":"") + js.Boot.__string_rec(o[i2],s);
			}
			str1 += "]";
			return str1;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString) {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str2 = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str2.length != 2) str2 += ", \n";
		str2 += s + k + " : " + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str2 += "\n" + s + "}";
		return str2;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
};
js.Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0;
		var _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js.Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js.Boot.__interfLoop(cc.__super__,cl);
};
js.Boot.__instanceof = function(o,cl) {
	if(cl == null) return false;
	switch(cl) {
	case Int:
		return (o|0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return typeof(o) == "boolean";
	case String:
		return typeof(o) == "string";
	case Array:
		return (o instanceof Array) && o.__enum__ == null;
	case Dynamic:
		return true;
	default:
		if(o != null) {
			if(typeof(cl) == "function") {
				if(o instanceof cl) return true;
				if(js.Boot.__interfLoop(js.Boot.getClass(o),cl)) return true;
			}
		} else return false;
		if(cl == Class && o.__name__ != null) return true;
		if(cl == Enum && o.__ename__ != null) return true;
		return o.__enum__ == cl;
	}
};
var promhx = {};
promhx.base = {};
promhx.base.AsyncBase = function(errorf) {
	this._resolved = false;
	this._pending = false;
	this._fulfilled = false;
	this._update = [];
	this._error = [];
	if(errorf != null) this._error.push(errorf);
};
promhx.base.AsyncBase.__name__ = true;
promhx.base.AsyncBase.link = function(current,next,f) {
	current._update.push({ async : next, linkf : function(x) {
		next.resolve(f(x));
	}});
	promhx.base.AsyncBase.immediateLinkUpdate(current,next,f);
};
promhx.base.AsyncBase.immediateLinkUpdate = function(current,next,f) {
	if(current._resolved && !current._pending) try {
		next.resolve(f(current._val));
	} catch( e ) {
		next.handleError(e);
	}
};
promhx.base.AsyncBase.linkAll = function(all,next) {
	var cthen = function(arr,current,v) {
		if(arr.length == 0 || promhx.base.AsyncBase.allFulfilled(arr)) {
			var vals;
			var _g = [];
			var $it0 = $iterator(all)();
			while( $it0.hasNext() ) {
				var a = $it0.next();
				_g.push(a == current?v:a._val);
			}
			vals = _g;
			next.resolve(vals);
		}
		return null;
	};
	var $it1 = $iterator(all)();
	while( $it1.hasNext() ) {
		var a1 = $it1.next();
		a1._update.push({ async : next, linkf : (function(f,a11,a2) {
			return function(v1) {
				return f(a11,a2,v1);
			};
		})(cthen,(function($this) {
			var $r;
			var _g1 = [];
			var $it2 = $iterator(all)();
			while( $it2.hasNext() ) {
				var a21 = $it2.next();
				if(a21 != a1) _g1.push(a21);
			}
			$r = _g1;
			return $r;
		}(this)),a1)});
	}
	if(promhx.base.AsyncBase.allFulfilled(all)) next.resolve((function($this) {
		var $r;
		var _g2 = [];
		var $it3 = $iterator(all)();
		while( $it3.hasNext() ) {
			var a3 = $it3.next();
			_g2.push(a3._val);
		}
		$r = _g2;
		return $r;
	}(this)));
};
promhx.base.AsyncBase.pipeLink = function(current,ret,f) {
	var linked = false;
	var linkf = function(x) {
		if(!linked) {
			linked = true;
			var pipe_ret = f(x);
			pipe_ret._update.push({ async : ret, linkf : $bind(ret,ret.resolve)});
			promhx.base.AsyncBase.immediateLinkUpdate(pipe_ret,ret,function(x1) {
				return x1;
			});
		}
	};
	current._update.push({ async : ret, linkf : linkf});
	if(current._resolved && !current._pending) try {
		linkf(current._val);
	} catch( e ) {
		ret.handleError(e);
	}
};
promhx.base.AsyncBase.allResolved = function($as) {
	var $it0 = $iterator($as)();
	while( $it0.hasNext() ) {
		var a = $it0.next();
		if(!a._resolved) return false;
	}
	return true;
};
promhx.base.AsyncBase.allFulfilled = function($as) {
	var $it0 = $iterator($as)();
	while( $it0.hasNext() ) {
		var a = $it0.next();
		if(!a._fulfilled) return false;
	}
	return true;
};
promhx.base.AsyncBase.prototype = {
	catchError: function(f) {
		this._error.push(f);
		return this;
	}
	,errorThen: function(f) {
		this._errorMap = f;
		return this;
	}
	,isResolved: function() {
		return this._resolved;
	}
	,isFulfilled: function() {
		return this._fulfilled;
	}
	,isPending: function() {
		return this._pending;
	}
	,resolve: function(val) {
		this._resolve(val);
	}
	,_resolve: function(val,cleanup) {
		var _g = this;
		if(this._pending) return promhx.base.EventLoop.enqueue((function(f,a1,a2) {
			return function() {
				f(a1,a2);
			};
		})($bind(this,this._resolve),val,cleanup));
		this._resolved = true;
		this._pending = true;
		promhx.base.EventLoop.queue.add(function() {
			_g._val = val;
			var _g1 = 0;
			var _g2 = _g._update;
			while(_g1 < _g2.length) {
				var up = _g2[_g1];
				++_g1;
				try {
					up.linkf(val);
				} catch( e ) {
					up.async.handleError(e);
				}
			}
			_g._fulfilled = true;
			_g._pending = false;
			if(cleanup != null) cleanup();
		});
		promhx.base.EventLoop.continueOnNextLoop();
	}
	,handleError: function(error) {
		var _g = this;
		var update_errors = function(e) {
			if(_g._error.length > 0) {
				var _g1 = 0;
				var _g2 = _g._error;
				while(_g1 < _g2.length) {
					var ef = _g2[_g1];
					++_g1;
					ef(e);
				}
			} else if(_g._update.length > 0) {
				var _g11 = 0;
				var _g21 = _g._update;
				while(_g11 < _g21.length) {
					var up = _g21[_g11];
					++_g11;
					up.async.handleError(e);
				}
			} else throw e;
		};
		promhx.base.EventLoop.queue.add(function() {
			if(_g._errorMap != null) try {
				_g.resolve(_g._errorMap(error));
			} catch( e1 ) {
				update_errors(e1);
			} else update_errors(error);
		});
		promhx.base.EventLoop.continueOnNextLoop();
	}
	,then: function(f) {
		var ret = new promhx.base.AsyncBase();
		promhx.base.AsyncBase.link(this,ret,f);
		return ret;
	}
	,unlink: function(to) {
		var _g = this;
		promhx.base.EventLoop.queue.add(function() {
			_g._update = _g._update.filter(function(x) {
				return x.async != to;
			});
		});
		promhx.base.EventLoop.continueOnNextLoop();
	}
	,isLinked: function(to) {
		var updated = false;
		var _g = 0;
		var _g1 = this._update;
		while(_g < _g1.length) {
			var u = _g1[_g];
			++_g;
			if(u.async == to) return true;
		}
		return updated;
	}
	,__class__: promhx.base.AsyncBase
};
promhx.Promise = $hx_exports.promhx.Promise = function(errorf) {
	promhx.base.AsyncBase.call(this,errorf);
	this._rejected = false;
};
promhx.Promise.__name__ = true;
promhx.Promise.whenAll = function(itb) {
	var ret = new promhx.Promise();
	promhx.base.AsyncBase.linkAll(itb,ret);
	return ret;
};
promhx.Promise.promise = function(_val,errorf) {
	var ret = new promhx.Promise(errorf);
	ret.resolve(_val);
	return ret;
};
promhx.Promise.__super__ = promhx.base.AsyncBase;
promhx.Promise.prototype = $extend(promhx.base.AsyncBase.prototype,{
	isRejected: function() {
		return this._rejected;
	}
	,reject: function(e) {
		this._rejected = true;
		this.handleError(e);
	}
	,resolve: function(val) {
		if(this._resolved) {
			var msg = "Promise has already been resolved";
			throw promhx.error.PromiseError.AlreadyResolved(msg);
		}
		this._resolve(val);
	}
	,then: function(f) {
		var ret = new promhx.Promise();
		promhx.base.AsyncBase.link(this,ret,f);
		return ret;
	}
	,unlink: function(to) {
		var _g = this;
		promhx.base.EventLoop.queue.add(function() {
			if(!_g._fulfilled) {
				var msg = "Downstream Promise is not fullfilled";
				_g.handleError(promhx.error.PromiseError.DownstreamNotFullfilled(msg));
			} else _g._update = _g._update.filter(function(x) {
				return x.async != to;
			});
		});
		promhx.base.EventLoop.continueOnNextLoop();
	}
	,pipe: function(f) {
		var ret = new promhx.Promise();
		promhx.base.AsyncBase.pipeLink(this,ret,f);
		return ret;
	}
	,__class__: promhx.Promise
});
promhx.base.EventLoop = function() { };
promhx.base.EventLoop.__name__ = true;
promhx.base.EventLoop.enqueue = function(eqf) {
	promhx.base.EventLoop.queue.add(eqf);
	promhx.base.EventLoop.continueOnNextLoop();
};
promhx.base.EventLoop.set_nextLoop = function(f) {
	if(promhx.base.EventLoop.nextLoop != null) throw "nextLoop has already been set"; else promhx.base.EventLoop.nextLoop = f;
	return promhx.base.EventLoop.nextLoop;
};
promhx.base.EventLoop.queueLength = function() {
	return promhx.base.EventLoop.queue.length;
};
promhx.base.EventLoop.finish = function(max_iterations) {
	if(max_iterations == null) max_iterations = 1000;
	while(promhx.base.EventLoop.queue.length > 0 && max_iterations-- > 0) (promhx.base.EventLoop.queue.pop())();
	return promhx.base.EventLoop.queue.length == 0;
};
promhx.base.EventLoop.clear = function() {
	promhx.base.EventLoop.queue = new List();
};
promhx.base.EventLoop.continueOnNextLoop = function() {
	var f = function() {
		if(promhx.base.EventLoop.queue.length > 0) {
			(promhx.base.EventLoop.queue.pop())();
			promhx.base.EventLoop.continueOnNextLoop();
		}
	};
	if(promhx.base.EventLoop.nextLoop != null) promhx.base.EventLoop.nextLoop(f); else setImmediate(f);
};
promhx.error = {};
promhx.error.PromiseError = { __ename__ : true, __constructs__ : ["AlreadyResolved","DownstreamNotFullfilled"] };
promhx.error.PromiseError.AlreadyResolved = function(message) { var $x = ["AlreadyResolved",0,message]; $x.__enum__ = promhx.error.PromiseError; $x.toString = $estr; return $x; };
promhx.error.PromiseError.DownstreamNotFullfilled = function(message) { var $x = ["DownstreamNotFullfilled",1,message]; $x.__enum__ = promhx.error.PromiseError; $x.toString = $estr; return $x; };
var steamer = {};
steamer.Producer = function(handler,endOnError) {
	if(endOnError == null) endOnError = true;
	this.handler = handler;
	this.endOnError = endOnError;
};
steamer.Producer.__name__ = true;
steamer.Producer.left = function(producer) {
	return producer.map(function(v) {
		return v.left;
	});
};
steamer.Producer.right = function(producer) {
	return producer.map(function(v) {
		return v.right;
	});
};
steamer.Producer.negate = function(producer) {
	return producer.map(function(v) {
		return !v;
	});
};
steamer.Producer.flatMap = function(producer) {
	return new steamer.Producer(function(forward) {
		producer.feed(steamer.Bus.passOn(function(arr) {
			arr.map(function(value) {
				forward(steamer.Pulse.Emit(value));
			});
		},forward));
	},producer.endOnError);
};
steamer.Producer.ofArray = function(values) {
	return new steamer.Producer(function(forward) {
		values.map(function(v) {
			forward(steamer.Pulse.Emit(v));
		});
		forward(steamer.Pulse.End);
	});
};
steamer.Producer.ofTimedArray = function(values,delay) {
	return steamer.Producer.left(steamer.Producer.ofArray(values).zip(new steamer.producers.Interval(delay,values.length)));
};
steamer.Producer.delayed = function(producer,delay) {
	return new steamer.Producer(function(forward) {
		producer.feed(new steamer.Bus(function(v) {
			thx.Timer.setTimeout(function() {
				forward(steamer.Pulse.Emit(v));
			},delay);
		},function() {
			thx.Timer.setTimeout(function() {
				forward(steamer.Pulse.End);
			},delay);
		},function(error) {
			thx.Timer.setTimeout(function() {
				forward(steamer.Pulse.Fail(error));
			},delay);
		}));
	},producer.endOnError);
};
steamer.Producer.prototype = {
	feed: function(consumer) {
		var _g = this;
		var ended = false;
		var sendPulse = function(v) {
			if(ended) throw new Error("Feed already reached end but still receiving pulses: ${v}"); else switch(v[1]) {
			case 2:
				if(_g.endOnError) {
					thx.Timer.setImmediate((function(f,a1) {
						return function() {
							f(a1);
						};
					})($bind(consumer,consumer.onPulse),v));
					thx.Timer.setImmediate((function(f1,a11) {
						return function() {
							f1(a11);
						};
					})($bind(consumer,consumer.onPulse),steamer.Pulse.End));
				} else thx.Timer.setImmediate((function(f2,a12) {
					return function() {
						f2(a12);
					};
				})($bind(consumer,consumer.onPulse),v));
				break;
			case 1:
				ended = true;
				thx.Timer.setImmediate((function(f3,a13) {
					return function() {
						f3(a13);
					};
				})($bind(consumer,consumer.onPulse),steamer.Pulse.End));
				break;
			default:
				thx.Timer.setImmediate((function(f2,a12) {
					return function() {
						f2(a12);
					};
				})($bind(consumer,consumer.onPulse),v));
			}
		};
		this.handler(sendPulse);
	}
	,map: function(transform) {
		return this.mapAsync(function(v,t) {
			t(transform(v));
		});
	}
	,mapAsync: function(transform) {
		var _g = this;
		return new steamer.Producer(function(forward) {
			_g.feed(steamer.Bus.passOn(function(value) {
				try {
					var t = function(v) {
						forward(steamer.Pulse.Emit(v));
					};
					transform(value,t);
				} catch( $e0 ) {
					if( js.Boot.__instanceof($e0,Error) ) {
						var e = $e0;
						forward(steamer.Pulse.Fail(e));
					} else {
					var e1 = $e0;
					forward(steamer.Pulse.Fail(new Error(Std.string(e1))));
					}
				}
			},forward));
		},this.endOnError);
	}
	,log: function(prefix,posInfo) {
		if(prefix == null) prefix = ""; else prefix = "" + prefix + ": ";
		return this.map(function(v) {
			haxe.Log.trace(v,{ fileName : "Producer.hx", lineNumber : 61, className : "steamer.Producer", methodName : "log", customParams : [posInfo]});
			return v;
		});
	}
	,filter: function(f) {
		return this.filterAsync(function(v,t) {
			t(f(v));
		});
	}
	,filterAsync: function(f) {
		var _g = this;
		return new steamer.Producer(function(forward) {
			_g.feed(steamer.Bus.passOn(function(value) {
				try {
					var t = function(v) {
						if(v) forward(steamer.Pulse.Emit(value));
					};
					f(value,t);
				} catch( $e0 ) {
					if( js.Boot.__instanceof($e0,Error) ) {
						var e = $e0;
						forward(steamer.Pulse.Fail(e));
					} else {
					var e1 = $e0;
					forward(steamer.Pulse.Fail(new Error(Std.string(e1))));
					}
				}
			},forward));
		},this.endOnError);
	}
	,merge: function(other) {
		var _g = this;
		var ended = false;
		return new steamer.Producer(function(forward) {
			var emit = function(v) {
				forward(steamer.Pulse.Emit(v));
			};
			var end = function() {
				if(ended) forward(steamer.Pulse.End); else ended = true;
			};
			var fail = function(error) {
				forward(steamer.Pulse.Fail(error));
			};
			_g.feed(new steamer.Bus(emit,end,fail));
			other.feed(new steamer.Bus(emit,end,fail));
		},this.endOnError);
	}
	,concat: function(other) {
		var _g = this;
		return new steamer.Producer(function(forward) {
			var emit = function(v) {
				forward(steamer.Pulse.Emit(v));
			};
			var fail = function(error) {
				forward(steamer.Pulse.Fail(error));
			};
			_g.feed(new steamer.Bus(emit,function() {
				other.feed(steamer.Bus.passOn(emit,forward));
			},fail));
		},this.endOnError);
	}
	,zip: function(other) {
		var _g = this;
		return new steamer.Producer(function(forward) {
			var ended = false;
			var endA = false;
			var endB = false;
			var buffA = [];
			var buffB = [];
			var produce = function() {
				if((buffA.length == 0 && endA || buffB.length == 0 && endB) && !ended) {
					buffA = null;
					buffB = null;
					ended = true;
					return forward(steamer.Pulse.End);
				}
				if(buffA.length == 0 || buffB.length == 0) return;
				forward(steamer.Pulse.Emit({ left : buffA.shift(), right : buffB.shift()}));
			};
			_g.feed(new steamer.Bus(function(value) {
				if(ended) return;
				buffA.push(value);
				produce();
			},function() {
				endA = true;
				produce();
			},function(error) {
				forward(steamer.Pulse.Fail(error));
			}));
			other.feed(new steamer.Bus(function(value1) {
				if(ended) return;
				buffB.push(value1);
				produce();
			},function() {
				endB = true;
				produce();
			},function(error1) {
				forward(steamer.Pulse.Fail(error1));
			}));
		},this.endOnError);
	}
	,blend: function(other,f) {
		return this.zip(other).map(function(tuple) {
			return f(tuple.left,tuple.right);
		});
	}
	,pair: function(other) {
		var _g = this;
		return new steamer.Producer(function(forward) {
			var endA = false;
			var endB = false;
			var buffA = null;
			var buffB = null;
			var produce = function() {
				if(endA && endB) {
					buffA = null;
					buffB = null;
					return forward(steamer.Pulse.End);
				}
				if(buffA == null || buffB == null) return;
				forward(steamer.Pulse.Emit({ left : buffA, right : buffB}));
			};
			_g.feed(new steamer.Bus(function(value) {
				buffA = value;
				produce();
			},function() {
				endA = true;
				produce();
			},function(error) {
				forward(steamer.Pulse.Fail(error));
			}));
			other.feed(new steamer.Bus(function(value1) {
				buffB = value1;
				produce();
			},function() {
				endB = true;
				produce();
			},function(error1) {
				forward(steamer.Pulse.Fail(error1));
			}));
		},this.endOnError);
	}
	,distinct: function() {
		var _g = this;
		var last = null;
		return new steamer.Producer(function(forward) {
			_g.feed(steamer.Bus.passOn(function(v) {
				if(v == last) return;
				last = v;
				forward(steamer.Pulse.Emit(v));
			},forward));
		},this.endOnError);
	}
	,sampleBy: function(sampler) {
		var _g = this;
		var latest = null;
		return new steamer.Producer(function(forward) {
			_g.feed(steamer.Bus.passOn(function(v) {
				latest = v;
			},forward));
			sampler.feed(steamer.Bus.passOn(function(v1) {
				if(null == latest) return;
				forward(steamer.Pulse.Emit({ left : latest, right : v1}));
				latest = null;
			},forward));
		},this.endOnError);
	}
	,__class__: steamer.Producer
};
steamer.Bus = function(emit,end,fail) {
	this.emit = emit;
	this.end = end;
	this.fail = fail;
};
steamer.Bus.__name__ = true;
steamer.Bus.passOn = function(emit,forward) {
	return new steamer.Bus(emit,function() {
		forward(steamer.Pulse.End);
	},function(error) {
		forward(steamer.Pulse.Fail(error));
	});
};
steamer.Bus.prototype = {
	onPulse: function(pulse) {
		switch(pulse[1]) {
		case 0:
			var value = pulse[2];
			this.emit(value);
			break;
		case 1:
			this.end();
			break;
		case 2:
			var error = pulse[2];
			this.fail(error);
			break;
		}
	}
	,__class__: steamer.Bus
};
steamer.Pulse = { __ename__ : true, __constructs__ : ["Emit","End","Fail"] };
steamer.Pulse.Emit = function(value) { var $x = ["Emit",0,value]; $x.__enum__ = steamer.Pulse; $x.toString = $estr; return $x; };
steamer.Pulse.End = ["End",1];
steamer.Pulse.End.toString = $estr;
steamer.Pulse.End.__enum__ = steamer.Pulse;
steamer.Pulse.Fail = function(error) { var $x = ["Fail",2,error]; $x.__enum__ = steamer.Pulse; $x.toString = $estr; return $x; };
var thx = {};
thx.Nil = { __ename__ : true, __constructs__ : ["nil"] };
thx.Nil.nil = ["nil",0];
thx.Nil.nil.toString = $estr;
thx.Nil.nil.__enum__ = thx.Nil;
steamer.Pulses = function() { };
steamer.Pulses.__name__ = true;
steamer.Pulses.times = function(n,pulse) {
	return ((function($this) {
		var $r;
		var _g = [];
		{
			var _g1 = 0;
			while(_g1 < n) {
				var i = _g1++;
				_g.push(pulse);
			}
		}
		$r = _g;
		return $r;
	}(this))).concat([steamer.Pulse.End]);
};
steamer.producers = {};
steamer.producers.Interval = function(delay,times) {
	if(times == null) times = 0;
	steamer.Producer.call(this,function(pulse) {
		var callback = null;
		if(times <= 0) callback = function() {
			thx.Timer.setInterval(function() {
				pulse(steamer.Pulses.nil);
			},delay);
		}; else callback = function() {
			pulse(steamer.Pulses.nil);
			if(0 == --times) pulse(steamer.Pulse.End); else thx.Timer.setTimeout(callback,delay);
		};
		callback();
	});
};
steamer.producers.Interval.__name__ = true;
steamer.producers.Interval.__super__ = steamer.Producer;
steamer.producers.Interval.prototype = $extend(steamer.Producer.prototype,{
	__class__: steamer.producers.Interval
});
thx.Timer = function() { };
thx.Timer.__name__ = true;
thx.Timer.setInterval = function(callback,delay) {
	return setInterval(callback,delay);
};
thx.Timer.setTimeout = function(callback,delay) {
	return setTimeout(callback,delay);
};
thx.Timer.setImmediate = function(callback) {
	return setTimeout(callback,0);
};
thx.Timer.clearTimer = function(id) {
	return clearTimeout(id);
};
var ui = {};
ui.Schema = function() {
	var _g = this;
	this.fields = new haxe.ds.StringMap();
	this.stream = new ui.SchemaProducer($bind(this,this.getPairs),function(feed) {
		_g.feed = feed;
	});
};
ui.Schema.__name__ = true;
ui.Schema.prototype = {
	add: function(name,type) {
		if(this.fields.exists(name)) throw new Error("Schema already contains a field \"" + name + "\"");
		this.fields.set(name,type);
		this.feed(steamer.Pulse.Emit(ui.SchemaEvent.AddField(name,type)));
	}
	,reset: function(list) {
		var _g = this;
		if(null == list) list = [];
		this.fields = new haxe.ds.StringMap();
		list.map(function(pair) {
			_g.fields.set(pair.name,pair.type);
		});
		this.feed(steamer.Pulse.Emit(ui.SchemaEvent.ListFields(list.slice())));
	}
	,'delete': function(name) {
		if(!this.fields.exists(name)) throw new Error("Schema does not contain a field \"" + name + "\"");
		this.fields.remove(name);
		this.feed(steamer.Pulse.Emit(ui.SchemaEvent.DeleteField(name)));
	}
	,rename: function(oldname,newname) {
		if(!this.fields.exists(oldname)) throw new Error("Schema does not contain a field \"" + oldname + "\"");
		var type = this.fields.get(oldname);
		this.fields.remove(oldname);
		this.fields.set(newname,type);
		this.feed(steamer.Pulse.Emit(ui.SchemaEvent.RenameField(oldname,newname)));
	}
	,retype: function(name,type) {
		if(!this.fields.exists(name)) throw new Error("Schema does not contain a field \"" + name + "\"");
		this.fields.set(name,type);
		this.feed(steamer.Pulse.Emit(ui.SchemaEvent.RetypeField(name,type)));
	}
	,getPairs: function() {
		var arr = [];
		var $it0 = this.fields.keys();
		while( $it0.hasNext() ) {
			var key = $it0.next();
			arr.push({ name : key, type : this.fields.get(key)});
		}
		return arr;
	}
	,__class__: ui.Schema
};
ui.SchemaProducer = function(getPairs,handler) {
	this.getPairs = getPairs;
	steamer.Producer.call(this,handler,false);
};
ui.SchemaProducer.__name__ = true;
ui.SchemaProducer.__super__ = steamer.Producer;
ui.SchemaProducer.prototype = $extend(steamer.Producer.prototype,{
	feed: function(consumer) {
		steamer.Producer.prototype.feed.call(this,consumer);
		consumer.onPulse(steamer.Pulse.Emit(ui.SchemaEvent.ListFields(this.getPairs())));
	}
	,__class__: ui.SchemaProducer
});
ui.SchemaEvent = { __ename__ : true, __constructs__ : ["ListFields","AddField","DeleteField","RenameField","RetypeField"] };
ui.SchemaEvent.ListFields = function(list) { var $x = ["ListFields",0,list]; $x.__enum__ = ui.SchemaEvent; $x.toString = $estr; return $x; };
ui.SchemaEvent.AddField = function(name,type) { var $x = ["AddField",1,name,type]; $x.__enum__ = ui.SchemaEvent; $x.toString = $estr; return $x; };
ui.SchemaEvent.DeleteField = function(name) { var $x = ["DeleteField",2,name]; $x.__enum__ = ui.SchemaEvent; $x.toString = $estr; return $x; };
ui.SchemaEvent.RenameField = function(oldname,newname) { var $x = ["RenameField",3,oldname,newname]; $x.__enum__ = ui.SchemaEvent; $x.toString = $estr; return $x; };
ui.SchemaEvent.RetypeField = function(name,type) { var $x = ["RetypeField",4,name,type]; $x.__enum__ = ui.SchemaEvent; $x.toString = $estr; return $x; };
function $iterator(o) { if( o instanceof Array ) return function() { return HxOverrides.iter(o); }; return typeof(o.iterator) == 'function' ? $bind(o,o.iterator) : o.iterator; }
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
String.prototype.__class__ = String;
String.__name__ = true;
Array.__name__ = true;
var Int = { __name__ : ["Int"]};
var Dynamic = { __name__ : ["Dynamic"]};
var Float = Number;
Float.__name__ = ["Float"];
var Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = { __name__ : ["Class"]};
var Enum = { };
if(Array.prototype.map == null) Array.prototype.map = function(f) {
	var a = [];
	var _g1 = 0;
	var _g = this.length;
	while(_g1 < _g) {
		var i = _g1++;
		a[i] = f(this[i]);
	}
	return a;
};
if(Array.prototype.filter == null) Array.prototype.filter = function(f1) {
	var a1 = [];
	var _g11 = 0;
	var _g2 = this.length;
	while(_g11 < _g2) {
		var i1 = _g11++;
		var e = this[i1];
		if(f1(e)) a1.push(e);
	}
	return a1;
};
var global = window;
(function (global, undefined) {
    "use strict";

    var tasks = (function () {
        function Task(handler, args) {
            this.handler = handler;
            this.args = args;
        }
        Task.prototype.run = function () {
            // See steps in section 5 of the spec.
            if (typeof this.handler === "function") {
                // Choice of `thisArg` is not in the setImmediate spec; `undefined` is in the setTimeout spec though:
                // http://www.whatwg.org/specs/web-apps/current-work/multipage/timers.html
                this.handler.apply(undefined, this.args);
            } else {
                var scriptSource = "" + this.handler;
                /*jshint evil: true */
                eval(scriptSource);
            }
        };

        var nextHandle = 1; // Spec says greater than zero
        var tasksByHandle = {};
        var currentlyRunningATask = false;

        return {
            addFromSetImmediateArguments: function (args) {
                var handler = args[0];
                var argsToHandle = Array.prototype.slice.call(args, 1);
                var task = new Task(handler, argsToHandle);

                var thisHandle = nextHandle++;
                tasksByHandle[thisHandle] = task;
                return thisHandle;
            },
            runIfPresent: function (handle) {
                // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
                // So if we're currently running a task, we'll need to delay this invocation.
                if (!currentlyRunningATask) {
                    var task = tasksByHandle[handle];
                    if (task) {
                        currentlyRunningATask = true;
                        try {
                            task.run();
                        } finally {
                            delete tasksByHandle[handle];
                            currentlyRunningATask = false;
                        }
                    }
                } else {
                    // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
                    // "too much recursion" error.
                    global.setTimeout(function () {
                        tasks.runIfPresent(handle);
                    }, 0);
                }
            },
            remove: function (handle) {
                delete tasksByHandle[handle];
            }
        };
    }());

    function canUseNextTick() {
        // Don't get fooled by e.g. browserify environments.
        return typeof process === "object" &&
               Object.prototype.toString.call(process) === "[object process]";
    }

    function canUseMessageChannel() {
        return !!global.MessageChannel;
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.

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
    }

    function canUseReadyStateChange() {
        return "document" in global && "onreadystatechange" in global.document.createElement("script");
    }

    function installNextTickImplementation(attachTo) {
        attachTo.setImmediate = function () {
            var handle = tasks.addFromSetImmediateArguments(arguments);

            process.nextTick(function () {
                tasks.runIfPresent(handle);
            });

            return handle;
        };
    }

    function installMessageChannelImplementation(attachTo) {
        var channel = new global.MessageChannel();
        channel.port1.onmessage = function (event) {
            var handle = event.data;
            tasks.runIfPresent(handle);
        };
        attachTo.setImmediate = function () {
            var handle = tasks.addFromSetImmediateArguments(arguments);

            channel.port2.postMessage(handle);

            return handle;
        };
    }

    function installPostMessageImplementation(attachTo) {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var MESSAGE_PREFIX = "com.bn.NobleJS.setImmediate" + Math.random();

        function isStringAndStartsWith(string, putativeStart) {
            return typeof string === "string" && string.substring(0, putativeStart.length) === putativeStart;
        }

        function onGlobalMessage(event) {
            // This will catch all incoming messages (even from other windows!), so we need to try reasonably hard to
            // avoid letting anyone else trick us into firing off. We test the origin is still this window, and that a
            // (randomly generated) unpredictable identifying prefix is present.
            if (event.source === global && isStringAndStartsWith(event.data, MESSAGE_PREFIX)) {
                var handle = event.data.substring(MESSAGE_PREFIX.length);
                tasks.runIfPresent(handle);
            }
        }
        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        attachTo.setImmediate = function () {
            var handle = tasks.addFromSetImmediateArguments(arguments);

            // Make `global` post a message to itself with the handle and identifying prefix, thus asynchronously
            // invoking our onGlobalMessage listener above.
            global.postMessage(MESSAGE_PREFIX + handle, "*");

            return handle;
        };
    }

    function installReadyStateChangeImplementation(attachTo) {
        attachTo.setImmediate = function () {
            var handle = tasks.addFromSetImmediateArguments(arguments);

            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var scriptEl = global.document.createElement("script");
            scriptEl.onreadystatechange = function () {
                tasks.runIfPresent(handle);

                scriptEl.onreadystatechange = null;
                scriptEl.parentNode.removeChild(scriptEl);
                scriptEl = null;
            };
            global.document.documentElement.appendChild(scriptEl);

            return handle;
        };
    }

    function installSetTimeoutImplementation(attachTo) {
        attachTo.setImmediate = function () {
            var handle = tasks.addFromSetImmediateArguments(arguments);

            global.setTimeout(function () {
                tasks.runIfPresent(handle);
            }, 0);

            return handle;
        };
    }

    if (!global.setImmediate) {
        // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
        var attachTo = typeof Object.getPrototypeOf === "function" && "setTimeout" in Object.getPrototypeOf(global) ?
                          Object.getPrototypeOf(global)
                        : global;

        if (canUseNextTick()) {
            // For Node.js before 0.9
            installNextTickImplementation(attachTo);
        } else if (canUsePostMessage()) {
            // For non-IE10 modern browsers
            installPostMessageImplementation(attachTo);
        } else if (canUseMessageChannel()) {
            // For web workers, where supported
            installMessageChannelImplementation(attachTo);
        } else if (canUseReadyStateChange()) {
            // For IE 6–8
            installReadyStateChangeImplementation(attachTo);
        } else {
            // For older browsers
            installSetTimeoutImplementation(attachTo);
        }

        attachTo.clearImmediate = tasks.remove;
    }
}(typeof global === "object" && global ? global : this));
;
dom.Query.doc = document;
promhx.base.EventLoop.queue = new List();
steamer.Pulses.nil = steamer.Pulse.Emit(thx.Nil.nil);
Main.main();
})(typeof window != "undefined" ? window : exports);
