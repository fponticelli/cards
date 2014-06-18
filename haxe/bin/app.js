(function ($hx_exports) { "use strict";
$hx_exports.promhx = $hx_exports.promhx || {};
var $estr = function() { return js.Boot.__string_rec(this,''); };
function $extend(from, fields) {
	function Inherit() {} Inherit.prototype = from; var proto = new Inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var EReg = function(r,opt) {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
};
EReg.__name__ = ["EReg"];
EReg.prototype = {
	match: function(s) {
		if(this.r.global) this.r.lastIndex = 0;
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
	,matched: function(n) {
		if(this.r.m != null && n >= 0 && n < this.r.m.length) return this.r.m[n]; else throw "EReg::matched";
	}
	,matchedRight: function() {
		if(this.r.m == null) throw "No string matched";
		var sz = this.r.m.index + this.r.m[0].length;
		return this.r.s.substr(sz,this.r.s.length - sz);
	}
	,matchedPos: function() {
		if(this.r.m == null) throw "No string matched";
		return { pos : this.r.m.index, len : this.r.m[0].length};
	}
	,matchSub: function(s,pos,len) {
		if(len == null) len = -1;
		if(this.r.global) {
			this.r.lastIndex = pos;
			this.r.m = this.r.exec(len < 0?s:HxOverrides.substr(s,0,pos + len));
			var b = this.r.m != null;
			if(b) this.r.s = s;
			return b;
		} else {
			var b1 = this.match(len < 0?HxOverrides.substr(s,pos,null):HxOverrides.substr(s,pos,len));
			if(b1) {
				this.r.s = s;
				this.r.m.index += pos;
			}
			return b1;
		}
	}
	,split: function(s) {
		var d = "#__delim__#";
		return s.replace(this.r,d).split(d);
	}
	,replace: function(s,by) {
		return s.replace(this.r,by);
	}
	,map: function(s,f) {
		var offset = 0;
		var buf = new StringBuf();
		do {
			if(offset >= s.length) break; else if(!this.matchSub(s,offset)) {
				buf.add(HxOverrides.substr(s,offset,null));
				break;
			}
			var p = this.matchedPos();
			buf.add(HxOverrides.substr(s,offset,p.pos - offset));
			buf.add(f(this));
			if(p.len == 0) {
				buf.add(HxOverrides.substr(s,p.pos,1));
				offset = p.pos + 1;
			} else offset = p.pos + p.len;
		} while(this.r.global);
		if(!this.r.global && offset > 0 && offset < s.length) buf.add(HxOverrides.substr(s,offset,null));
		return buf.b;
	}
	,__class__: EReg
};
var HxOverrides = function() { };
HxOverrides.__name__ = ["HxOverrides"];
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
};
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
};
HxOverrides.indexOf = function(a,obj,i) {
	var len = a.length;
	if(i < 0) {
		i += len;
		if(i < 0) i = 0;
	}
	while(i < len) {
		if(a[i] === obj) return i;
		i++;
	}
	return -1;
};
HxOverrides.remove = function(a,obj) {
	var i = HxOverrides.indexOf(a,obj,0);
	if(i == -1) return false;
	a.splice(i,1);
	return true;
};
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
List.__name__ = ["List"];
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
Main.__name__ = ["Main"];
Main.main = function() {
	dom.Dom.ready().then(function(_) {
		var container = dom.Query.first(".container");
		var schema = new ui.Schema();
		var data = new ui.Data({ name : "Franco", contacts : [{ type : "email", value : "franco.ponticelli@gmail.com"},{ type : "phone", value : "7206902488"}]});
		var model = new ui.Model(data);
		haxe.Log.trace("Hello World",{ fileName : "Main.hx", lineNumber : 26, className : "Main", methodName : "main"});
		data.set("contacts[2]",{ type : "twitter", value : "fponticelli"});
		data.set("contacts[3].type","skype");
		data.set("contacts[3].value","francoponticelli");
		haxe.Log.trace(data.toJSON(),{ fileName : "Main.hx", lineNumber : 30, className : "Main", methodName : "main"});
		var component = ui.components.Button.withIcon("cubes",{ });
		component.appendTo(container);
		ui.properties.ClickPropertyImplementation.asClickable(component).clicks.feed({ onPulse : function(e) {
			haxe.Log.trace(e,{ fileName : "Main.hx", lineNumber : 36, className : "Main", methodName : "main"});
		}});
	});
};
var IMap = function() { };
IMap.__name__ = ["IMap"];
var Reflect = function() { };
Reflect.__name__ = ["Reflect"];
Reflect.field = function(o,field) {
	try {
		return o[field];
	} catch( e ) {
		return null;
	}
};
Reflect.setField = function(o,field,value) {
	o[field] = value;
};
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(f != "__id__" && f != "hx__closures__" && hasOwnProperty.call(o,f)) a.push(f);
		}
	}
	return a;
};
Reflect.isObject = function(v) {
	if(v == null) return false;
	var t = typeof(v);
	return t == "string" || t == "object" && v.__enum__ == null || t == "function" && (v.__name__ || v.__ename__) != null;
};
var Std = function() { };
Std.__name__ = ["Std"];
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
};
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
};
var StringBuf = function() {
	this.b = "";
};
StringBuf.__name__ = ["StringBuf"];
StringBuf.prototype = {
	add: function(x) {
		this.b += Std.string(x);
	}
	,__class__: StringBuf
};
var StringTools = function() { };
StringTools.__name__ = ["StringTools"];
StringTools.isSpace = function(s,pos) {
	var c = HxOverrides.cca(s,pos);
	return c > 8 && c < 14 || c == 32;
};
StringTools.ltrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,r)) r++;
	if(r > 0) return HxOverrides.substr(s,r,l - r); else return s;
};
StringTools.rtrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,l - r - 1)) r++;
	if(r > 0) return HxOverrides.substr(s,0,l - r); else return s;
};
StringTools.trim = function(s) {
	return StringTools.ltrim(StringTools.rtrim(s));
};
StringTools.replace = function(s,sub,by) {
	return s.split(sub).join(by);
};
var ValueType = { __ename__ : ["ValueType"], __constructs__ : ["TNull","TInt","TFloat","TBool","TObject","TFunction","TClass","TEnum","TUnknown"] };
ValueType.TNull = ["TNull",0];
ValueType.TNull.toString = $estr;
ValueType.TNull.__enum__ = ValueType;
ValueType.TInt = ["TInt",1];
ValueType.TInt.toString = $estr;
ValueType.TInt.__enum__ = ValueType;
ValueType.TFloat = ["TFloat",2];
ValueType.TFloat.toString = $estr;
ValueType.TFloat.__enum__ = ValueType;
ValueType.TBool = ["TBool",3];
ValueType.TBool.toString = $estr;
ValueType.TBool.__enum__ = ValueType;
ValueType.TObject = ["TObject",4];
ValueType.TObject.toString = $estr;
ValueType.TObject.__enum__ = ValueType;
ValueType.TFunction = ["TFunction",5];
ValueType.TFunction.toString = $estr;
ValueType.TFunction.__enum__ = ValueType;
ValueType.TClass = function(c) { var $x = ["TClass",6,c]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; };
ValueType.TEnum = function(e) { var $x = ["TEnum",7,e]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; };
ValueType.TUnknown = ["TUnknown",8];
ValueType.TUnknown.toString = $estr;
ValueType.TUnknown.__enum__ = ValueType;
var Type = function() { };
Type.__name__ = ["Type"];
Type.getClass = function(o) {
	if(o == null) return null;
	if((o instanceof Array) && o.__enum__ == null) return Array; else return o.__class__;
};
Type.getSuperClass = function(c) {
	return c.__super__;
};
Type.getClassName = function(c) {
	var a = c.__name__;
	return a.join(".");
};
Type.getEnumName = function(e) {
	var a = e.__ename__;
	return a.join(".");
};
var dom = {};
dom.Html = function() { };
dom.Html.__name__ = ["dom","Html"];
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
dom.Dom.__name__ = ["dom","Dom"];
dom.Dom.ready = function() {
	var deferred = new promhx.Promise();
	window.document.addEventListener("DOMContentLoaded",function(_) {
		deferred.resolve(thx.Nil.nil);
	},false);
	return deferred;
};
dom.Query = function() { };
dom.Query.__name__ = ["dom","Query"];
dom.Query.first = function(selector,ctx) {
	return (ctx != null?ctx:dom.Query.doc).querySelector(selector);
};
dom.Query.list = function(selector,ctx) {
	return (ctx != null?ctx:dom.Query.doc).querySelectorAll(selector);
};
dom.Query.all = function(selector,ctx) {
	return dom._Dom.H.toArray(dom.Query.list(selector,ctx));
};
dom._Dom = {};
dom._Dom.H = function() { };
dom._Dom.H.__name__ = ["dom","_Dom","H"];
dom._Dom.H.toArray = function(list) {
	return Array.prototype.slice.call(list,0);
};
var haxe = {};
haxe.Log = function() { };
haxe.Log.__name__ = ["haxe","Log"];
haxe.Log.trace = function(v,infos) {
	js.Boot.__trace(v,infos);
};
haxe.ds = {};
haxe.ds.IntMap = function() {
	this.h = { };
};
haxe.ds.IntMap.__name__ = ["haxe","ds","IntMap"];
haxe.ds.IntMap.__interfaces__ = [IMap];
haxe.ds.IntMap.prototype = {
	set: function(key,value) {
		this.h[key] = value;
	}
	,get: function(key) {
		return this.h[key];
	}
	,remove: function(key) {
		if(!this.h.hasOwnProperty(key)) return false;
		delete(this.h[key]);
		return true;
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key | 0);
		}
		return HxOverrides.iter(a);
	}
	,iterator: function() {
		return { ref : this.h, it : this.keys(), hasNext : function() {
			return this.it.hasNext();
		}, next : function() {
			var i = this.it.next();
			return this.ref[i];
		}};
	}
	,__class__: haxe.ds.IntMap
};
haxe.ds.ObjectMap = function() {
	this.h = { };
	this.h.__keys__ = { };
};
haxe.ds.ObjectMap.__name__ = ["haxe","ds","ObjectMap"];
haxe.ds.ObjectMap.__interfaces__ = [IMap];
haxe.ds.ObjectMap.prototype = {
	set: function(key,value) {
		var id = key.__id__ || (key.__id__ = ++haxe.ds.ObjectMap.count);
		this.h[id] = value;
		this.h.__keys__[id] = key;
	}
	,remove: function(key) {
		var id = key.__id__;
		if(this.h.__keys__[id] == null) return false;
		delete(this.h[id]);
		delete(this.h.__keys__[id]);
		return true;
	}
	,__class__: haxe.ds.ObjectMap
};
haxe.ds.StringMap = function() {
	this.h = { };
};
haxe.ds.StringMap.__name__ = ["haxe","ds","StringMap"];
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
	,iterator: function() {
		return { ref : this.h, it : this.keys(), hasNext : function() {
			return this.it.hasNext();
		}, next : function() {
			var i = this.it.next();
			return this.ref["$" + i];
		}};
	}
	,__class__: haxe.ds.StringMap
};
var js = {};
js.Boot = function() { };
js.Boot.__name__ = ["js","Boot"];
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
	this.id = promhx.base.AsyncBase.id_ctr += 1;
	this._resolved = false;
	this._pending = false;
	this._fulfilled = false;
	this._update = [];
	this._error = [];
	if(errorf != null) this._error.push(errorf);
};
promhx.base.AsyncBase.__name__ = ["promhx","base","AsyncBase"];
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
				return f(a1,a2);
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
promhx.Promise.__name__ = ["promhx","Promise"];
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
promhx.base.EventLoop.__name__ = ["promhx","base","EventLoop"];
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
promhx.error.PromiseError = { __ename__ : ["promhx","error","PromiseError"], __constructs__ : ["AlreadyResolved","DownstreamNotFullfilled"] };
promhx.error.PromiseError.AlreadyResolved = function(message) { var $x = ["AlreadyResolved",0,message]; $x.__enum__ = promhx.error.PromiseError; $x.toString = $estr; return $x; };
promhx.error.PromiseError.DownstreamNotFullfilled = function(message) { var $x = ["DownstreamNotFullfilled",1,message]; $x.__enum__ = promhx.error.PromiseError; $x.toString = $estr; return $x; };
var steamer = {};
steamer.Producer = function(handler,endOnError) {
	if(endOnError == null) endOnError = true;
	this.handler = handler;
	this.endOnError = endOnError;
};
steamer.Producer.__name__ = ["steamer","Producer"];
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
							return f(a1);
						};
					})($bind(consumer,consumer.onPulse),v));
					thx.Timer.setImmediate((function(f1,a11) {
						return function() {
							return f1(a11);
						};
					})($bind(consumer,consumer.onPulse),steamer.Pulse.End));
				} else thx.Timer.setImmediate((function(f2,a12) {
					return function() {
						return f2(a12);
					};
				})($bind(consumer,consumer.onPulse),v));
				break;
			case 1:
				ended = true;
				thx.Timer.setImmediate((function(f3,a13) {
					return function() {
						return f3(a13);
					};
				})($bind(consumer,consumer.onPulse),steamer.Pulse.End));
				break;
			default:
				thx.Timer.setImmediate((function(f2,a12) {
					return function() {
						return f2(a12);
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
steamer.Bus.__name__ = ["steamer","Bus"];
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
steamer.Pulse = { __ename__ : ["steamer","Pulse"], __constructs__ : ["Emit","End","Fail"] };
steamer.Pulse.Emit = function(value) { var $x = ["Emit",0,value]; $x.__enum__ = steamer.Pulse; $x.toString = $estr; return $x; };
steamer.Pulse.End = ["End",1];
steamer.Pulse.End.toString = $estr;
steamer.Pulse.End.__enum__ = steamer.Pulse;
steamer.Pulse.Fail = function(error) { var $x = ["Fail",2,error]; $x.__enum__ = steamer.Pulse; $x.toString = $estr; return $x; };
var thx = {};
thx.Nil = { __ename__ : ["thx","Nil"], __constructs__ : ["nil"] };
thx.Nil.nil = ["nil",0];
thx.Nil.nil.toString = $estr;
thx.Nil.nil.__enum__ = thx.Nil;
steamer.Pulses = function() { };
steamer.Pulses.__name__ = ["steamer","Pulses"];
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
steamer.Value = function(initialValue,defaultValue) {
	var _g = this;
	this.forwards = [];
	steamer.Producer.call(this,function(forward) {
		_g.forwards.push(forward);
	},false);
	if(null == defaultValue) this.defaultValue = initialValue; else this.defaultValue = defaultValue;
	this.set_value(initialValue);
};
steamer.Value.__name__ = ["steamer","Value"];
steamer.Value.string = function(value,defaultValue) {
	if(value == null) value = "";
	return new steamer.Value(value,defaultValue);
};
steamer.Value.number = function(value,defaultValue) {
	if(value == null) value = 0.0;
	return new steamer.Value(value,defaultValue);
};
steamer.Value.bool = function(value,defaultValue) {
	if(value == null) value = false;
	return new steamer.Value(value,defaultValue);
};
steamer.Value.__super__ = steamer.Producer;
steamer.Value.prototype = $extend(steamer.Producer.prototype,{
	forward: function(pulse) {
		var _g = 0;
		var _g1 = this.forwards;
		while(_g < _g1.length) {
			var f = _g1[_g];
			++_g;
			f(pulse);
		}
		switch(pulse[1]) {
		case 1:
			this.forwards = [];
			break;
		default:
		}
	}
	,get_value: function() {
		return this.value;
	}
	,set_value: function(v) {
		if(v == this.get_value()) return v;
		this.value = v;
		this.forward(steamer.Pulse.Emit(v));
		return v;
	}
	,feed: function(consumer) {
		steamer.Producer.prototype.feed.call(this,consumer);
		consumer.onPulse(steamer.Pulse.Emit(this.get_value()));
	}
	,terminate: function() {
		this.forward(steamer.Pulse.End);
	}
	,onValue: function(pulse) {
		switch(pulse[1]) {
		case 0:
			var v = pulse[2];
			this.set_value(v);
			break;
		case 2:
			var e = pulse[2];
			throw e;
			break;
		case 1:
			break;
		}
	}
	,reset: function() {
		this.set_value(this.defaultValue);
	}
	,isDefault: function() {
		return this.set_value(this.defaultValue);
	}
	,__class__: steamer.Value
});
steamer.dom = {};
steamer.dom.Dom = function() { };
steamer.dom.Dom.__name__ = ["steamer","dom","Dom"];
steamer.dom.Dom.produceEvent = function(el,name) {
	var cancel = null;
	var producer = new steamer.Producer(function(forward) {
		var f = function(e) {
			forward(steamer.Pulse.Emit(e));
		};
		el.addEventListener(name,f,false);
		cancel = function() {
			el.removeEventListener(name,f,false);
			forward(steamer.Pulse.End);
		};
	});
	return { producer : producer, cancel : cancel};
};
steamer.dom.Dom.consumeText = function(el) {
	return steamer.dom.Dom.createConsumer(function(v) {
		el.innerText = v;
	});
};
steamer.dom.Dom.consumeHtml = function(el) {
	return steamer.dom.Dom.createConsumer(function(v) {
		el.innerHTML = v;
	});
};
steamer.dom.Dom.consumeAttribute = function(el,attr) {
	return steamer.dom.Dom.createConsumer(function(v) {
		el.setAttribute(attr,v);
	});
};
steamer.dom.Dom.consumeToggleClass = function(el,name) {
	return steamer.dom.Dom.createConsumer(function(v) {
		if(v) el.classList.add(name); else el.classList.remove(name);
	});
};
steamer.dom.Dom.consumeToggleVisibility = function(el) {
	return steamer.dom.Dom.createConsumer(function(v) {
		if(v) el.style.display = ""; else el.style.display = "none";
	});
};
steamer.dom.Dom.createConsumer = function(f) {
	return { onPulse : function(pulse) {
		switch(pulse[1]) {
		case 0:
			var v = pulse[2];
			f(v);
			break;
		case 1:
			break;
		case 2:
			var error = pulse[2];
			throw error;
			break;
		}
	}};
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
steamer.producers.Interval.__name__ = ["steamer","producers","Interval"];
steamer.producers.Interval.__super__ = steamer.Producer;
steamer.producers.Interval.prototype = $extend(steamer.Producer.prototype,{
	__class__: steamer.producers.Interval
});
thx.Timer = function() { };
thx.Timer.__name__ = ["thx","Timer"];
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
thx.core = {};
thx.core.Arrays = function() { };
thx.core.Arrays.__name__ = ["thx","core","Arrays"];
thx.core.Arrays.cross = function(a,b) {
	var r = [];
	var _g = 0;
	while(_g < a.length) {
		var va = a[_g];
		++_g;
		var _g1 = 0;
		while(_g1 < b.length) {
			var vb = b[_g1];
			++_g1;
			r.push([va,vb]);
		}
	}
	return r;
};
thx.core.Arrays.crossMulti = function(a) {
	var acopy = a.slice();
	var result = acopy.shift().map(function(v) {
		return [v];
	});
	while(acopy.length > 0) {
		var arr = acopy.shift();
		var tresult = result;
		result = [];
		var _g = 0;
		while(_g < arr.length) {
			var v1 = arr[_g];
			++_g;
			var _g1 = 0;
			while(_g1 < tresult.length) {
				var ar = tresult[_g1];
				++_g1;
				var t = ar.slice();
				t.push(v1);
				result.push(t);
			}
		}
	}
	return result;
};
thx.core.Arrays.pushIf = function(arr,cond,value) {
	if(cond) arr.push(value);
	return arr;
};
thx.core.Arrays.mapi = function(arr,handler) {
	return arr.map(handler);
};
thx.core.Arrays.flatMap = function(arr,callback) {
	return thx.core.Arrays.flatten(arr.map(callback));
};
thx.core.Arrays.flatten = function(arr) {
	return Array.prototype.concat.apply([],arr);
};
thx.core.Arrays.reduce = function(arr,callback,initial) {
	return arr.reduce(callback,initial);
};
thx.core.Arrays.reducei = function(arr,callback,initial) {
	return arr.reduce(callback,initial);
};
thx.core.Arrays.order = function(arr,sort) {
	var n = arr.slice();
	n.sort(sort);
	return n;
};
thx.core.Arrays.isEmpty = function(arr) {
	return arr.length == 0;
};
thx.core.Ints = function() { };
thx.core.Ints.__name__ = ["thx","core","Ints"];
thx.core.Ints.clamp = function(v,min,max) {
	if(v < min) return min; else if(v > max) return max; else return v;
};
thx.core.Ints.canParse = function(s) {
	return thx.core.Ints.pattern_parse.match(s);
};
thx.core.Ints.min = function(a,b) {
	if(a < b) return a; else return b;
};
thx.core.Ints.max = function(a,b) {
	if(a > b) return a; else return b;
};
thx.core.Ints.parse = function(s) {
	if(HxOverrides.substr(s,0,1) == "+") s = HxOverrides.substr(s,1,null);
	return Std.parseInt(s);
};
thx.core.Ints.compare = function(a,b) {
	return a - b;
};
thx.core.Iterables = function() { };
thx.core.Iterables.__name__ = ["thx","core","Iterables"];
thx.core.Iterables.map = function(it,f) {
	return thx.core.Iterators.map($iterator(it)(),f);
};
thx.core.Iterables.toArray = function(it) {
	return thx.core.Iterators.toArray($iterator(it)());
};
thx.core.Iterables.order = function(it,sort) {
	return thx.core.Iterators.order($iterator(it)(),sort);
};
thx.core.Iterables.reduce = function(it,callback,initial) {
	return thx.core.Iterators.reduce($iterator(it)(),callback,initial);
};
thx.core.Iterables.reducei = function(it,callback,initial) {
	return thx.core.Iterators.reducei($iterator(it)(),callback,initial);
};
thx.core.Iterables.isEmpty = function(it) {
	return thx.core.Iterators.isEmpty($iterator(it)());
};
thx.core.Iterators = function() { };
thx.core.Iterators.__name__ = ["thx","core","Iterators"];
thx.core.Iterators.map = function(it,f) {
	var acc = [];
	while( it.hasNext() ) {
		var v = it.next();
		acc.push(f(v));
	}
	return acc;
};
thx.core.Iterators.mapi = function(it,f) {
	var acc = [];
	var i = 0;
	while( it.hasNext() ) {
		var v = it.next();
		acc.push(f(v,i++));
	}
	return acc;
};
thx.core.Iterators.toArray = function(it) {
	var items = [];
	while( it.hasNext() ) {
		var item = it.next();
		items.push(item);
	}
	return items;
};
thx.core.Iterators.order = function(it,sort) {
	var n = thx.core.Iterators.toArray(it);
	n.sort(sort);
	return n;
};
thx.core.Iterators.reduce = function(it,callback,initial) {
	thx.core.Iterators.map(it,function(v) {
		initial = callback(initial,v);
	});
	return initial;
};
thx.core.Iterators.reducei = function(it,callback,initial) {
	thx.core.Iterators.mapi(it,function(v,i) {
		initial = callback(initial,v,i);
	});
	return initial;
};
thx.core.Iterators.isEmpty = function(it) {
	return !it.hasNext();
};
thx.core.Objects = function() { };
thx.core.Objects.__name__ = ["thx","core","Objects"];
thx.core.Objects.isEmpty = function(o) {
	return Reflect.fields(o).length == 0;
};
thx.core.Strings = function() { };
thx.core.Strings.__name__ = ["thx","core","Strings"];
thx.core.Strings.upTo = function(value,searchFor) {
	var pos = value.indexOf(searchFor);
	if(pos < 0) return value; else return HxOverrides.substr(value,0,pos);
};
thx.core.Strings.startFrom = function(value,searchFor) {
	var pos = value.indexOf(searchFor);
	if(pos < 0) return value; else return HxOverrides.substr(value,pos + searchFor.length,null);
};
thx.core.Strings.rtrim = function(value,charlist) {
	var len = value.length;
	while(len > 0) {
		var c = HxOverrides.substr(value,len - 1,1);
		if(charlist.indexOf(c) < 0) break;
		len--;
	}
	return HxOverrides.substr(value,0,len);
};
thx.core.Strings.ltrim = function(value,charlist) {
	var start = 0;
	while(start < value.length) {
		var c = HxOverrides.substr(value,start,1);
		if(charlist.indexOf(c) < 0) break;
		start++;
	}
	return HxOverrides.substr(value,start,null);
};
thx.core.Strings.trim = function(value,charlist) {
	return thx.core.Strings.rtrim(thx.core.Strings.ltrim(value,charlist),charlist);
};
thx.core.Strings.collapse = function(value) {
	return thx.core.Strings._reCollapse.replace(StringTools.trim(value)," ");
};
thx.core.Strings.ucfirst = function(value) {
	if(value == null) return null; else return value.charAt(0).toUpperCase() + HxOverrides.substr(value,1,null);
};
thx.core.Strings.lcfirst = function(value) {
	if(value == null) return null; else return value.charAt(0).toLowerCase() + HxOverrides.substr(value,1,null);
};
thx.core.Strings.empty = function(value) {
	return value == null || value == "";
};
thx.core.Strings.isAlphaNum = function(value) {
	if(value == null) return false; else return thx.core.Strings.__alphaNumPattern.match(value);
};
thx.core.Strings.digitsOnly = function(value) {
	if(value == null) return false; else return thx.core.Strings.__digitsPattern.match(value);
};
thx.core.Strings.ucwords = function(value) {
	return thx.core.Strings.__ucwordsPattern.map(value == null?null:value.charAt(0).toUpperCase() + HxOverrides.substr(value,1,null),thx.core.Strings.__upperMatch);
};
thx.core.Strings.ucwordsws = function(value) {
	return thx.core.Strings.__ucwordswsPattern.map(value == null?null:value.charAt(0).toUpperCase() + HxOverrides.substr(value,1,null),thx.core.Strings.__upperMatch);
};
thx.core.Strings.__upperMatch = function(re) {
	return re.matched(0).toUpperCase();
};
thx.core.Strings.humanize = function(s) {
	return StringTools.replace(thx.core.Strings.underscore(s),"_"," ");
};
thx.core.Strings.capitalize = function(s) {
	return HxOverrides.substr(s,0,1).toUpperCase() + HxOverrides.substr(s,1,null);
};
thx.core.Strings.succ = function(s) {
	return HxOverrides.substr(s,0,-1) + String.fromCharCode((function($this) {
		var $r;
		var _this = HxOverrides.substr(s,-1,null);
		$r = HxOverrides.cca(_this,0);
		return $r;
	}(this)) + 1);
};
thx.core.Strings.underscore = function(s) {
	s = new EReg("::","g").replace(s,"/");
	s = new EReg("([A-Z]+)([A-Z][a-z])","g").replace(s,"$1_$2");
	s = new EReg("([a-z\\d])([A-Z])","g").replace(s,"$1_$2");
	s = new EReg("-","g").replace(s,"_");
	return s.toLowerCase();
};
thx.core.Strings.dasherize = function(s) {
	return StringTools.replace(s,"_","-");
};
thx.core.Strings.repeat = function(s,times) {
	var b = [];
	var _g = 0;
	while(_g < times) {
		var i = _g++;
		b.push(s);
	}
	return b.join("");
};
thx.core.Strings.wrapColumns = function(s,columns,indent,newline) {
	if(newline == null) newline = "\n";
	if(indent == null) indent = "";
	if(columns == null) columns = 78;
	var parts = thx.core.Strings._reSplitWC.split(s);
	var result = [];
	var _g = 0;
	while(_g < parts.length) {
		var part = parts[_g];
		++_g;
		result.push(thx.core.Strings._wrapColumns(StringTools.trim(thx.core.Strings._reReduceWS.replace(part," ")),columns,indent,newline));
	}
	return result.join(newline);
};
thx.core.Strings._wrapColumns = function(s,columns,indent,newline) {
	var parts = [];
	var pos = 0;
	var len = s.length;
	var ilen = indent.length;
	columns -= ilen;
	while(true) {
		if(pos + columns >= len - ilen) {
			parts.push(HxOverrides.substr(s,pos,null));
			break;
		}
		var i = 0;
		while(!StringTools.isSpace(s,pos + columns - i) && i < columns) i++;
		if(i == columns) {
			i = 0;
			while(!StringTools.isSpace(s,pos + columns + i) && pos + columns + i < len) i++;
			parts.push(HxOverrides.substr(s,pos,columns + i));
			pos += columns + i + 1;
		} else {
			parts.push(HxOverrides.substr(s,pos,columns - i));
			pos += columns - i + 1;
		}
	}
	return indent + parts.join(newline + indent);
};
thx.core.Strings.stripTags = function(s) {
	return thx.core.Strings._reStripTags.replace(s,"");
};
thx.core.Strings.ellipsis = function(s,maxlen,symbol) {
	if(symbol == null) symbol = "...";
	if(maxlen == null) maxlen = 20;
	if(s.length > maxlen) return HxOverrides.substr(s,0,symbol.length > maxlen - symbol.length?symbol.length:maxlen - symbol.length) + symbol; else return s;
};
thx.core.Strings.compare = function(a,b) {
	if(a < b) return -1; else if(a > b) return 1; else return 0;
};
thx.core.Types = function() { };
thx.core.Types.__name__ = ["thx","core","Types"];
thx.core.Types.isAnonymousObject = function(v) {
	return Reflect.isObject(v) && null == Type.getClass(v);
};
thx.core.ClassTypes = function() { };
thx.core.ClassTypes.__name__ = ["thx","core","ClassTypes"];
thx.core.ClassTypes.toString = function(cls) {
	return Type.getClassName(cls);
};
thx.core.ClassTypes["as"] = function(value,type) {
	if(js.Boot.__instanceof(value,type)) return value; else return null;
};
thx.core.ValueTypes = function() { };
thx.core.ValueTypes.__name__ = ["thx","core","ValueTypes"];
thx.core.ValueTypes.toString = function(type) {
	switch(type[1]) {
	case 1:
		return "Int";
	case 2:
		return "Float";
	case 3:
		return "Bool";
	case 4:
		return "Dynamic";
	case 5:
		return "Function";
	case 6:
		var c = type[2];
		return Type.getClassName(c);
	case 7:
		var e = type[2];
		return Type.getEnumName(e);
	default:
		return null;
	}
};
thx.core.ValueTypes.typeInheritance = function(type) {
	switch(type[1]) {
	case 1:
		return ["Int"];
	case 2:
		return ["Float"];
	case 3:
		return ["Bool"];
	case 4:
		return ["Dynamic"];
	case 5:
		return ["Function"];
	case 6:
		var c = type[2];
		var classes = [];
		while(null != c) {
			classes.push(c);
			c = Type.getSuperClass(c);
		}
		return classes.map(Type.getClassName);
	case 7:
		var e = type[2];
		return [Type.getEnumName(e)];
	default:
		return null;
	}
};
thx.ref = {};
thx.ref.BaseRef = function(parent) {
	if(null != parent) this.parent = parent; else this.parent = thx.ref.EmptyParent.instance;
};
thx.ref.BaseRef.__name__ = ["thx","ref","BaseRef"];
thx.ref.BaseRef.prototype = {
	getRoot: function() {
		var ref = this;
		while(!js.Boot.__instanceof(ref.parent,thx.ref.EmptyParent)) ref = ref.parent;
		return ref;
	}
	,__class__: thx.ref.BaseRef
};
thx.ref.IParentRef = function() { };
thx.ref.IParentRef.__name__ = ["thx","ref","IParentRef"];
thx.ref.IParentRef.prototype = {
	__class__: thx.ref.IParentRef
};
thx.ref.IRef = function() { };
thx.ref.IRef.__name__ = ["thx","ref","IRef"];
thx.ref.IRef.prototype = {
	__class__: thx.ref.IRef
};
thx.ref.ArrayRef = function(parent) {
	thx.ref.BaseRef.call(this,parent);
	this.items = new haxe.ds.IntMap();
	this.inverse = new haxe.ds.ObjectMap();
};
thx.ref.ArrayRef.__name__ = ["thx","ref","ArrayRef"];
thx.ref.ArrayRef.__interfaces__ = [thx.ref.IParentRef,thx.ref.IRef];
thx.ref.ArrayRef.__super__ = thx.ref.BaseRef;
thx.ref.ArrayRef.prototype = $extend(thx.ref.BaseRef.prototype,{
	get: function() {
		var _g = this;
		var res = [];
		thx.core.Arrays.order(thx.core.Iterators.toArray(this.items.keys()),thx.core.Ints.compare).map(function(i) {
			return _g.items.get(i);
		}).map(function(ref) {
			if(ref.hasValue()) res.push(ref.get());
		});
		return res;
	}
	,set: function(value) {
		var _g = this;
		if(!((value instanceof Array) && value.__enum__ == null)) throw "value \"" + Std.string(value) + "\" is not an array";
		value.map(function(v,i) {
			var ref = _g.items.get(i);
			if(null == ref) {
				var value1 = ref = thx.ref.Ref.fromValue(v,_g);
				_g.items.set(i,value1);
				_g.inverse.set(ref,i);
			} else ref.set(v);
		});
	}
	,remove: function() {
		var $it0 = this.items.iterator();
		while( $it0.hasNext() ) {
			var ref = $it0.next();
			ref.remove();
		}
		this.parent.removeChild(this);
	}
	,removeChild: function(child) {
		var i = this.inverse.h[child.__id__];
		if(null == i) throw "\"" + Std.string(child) + "\" is not child of \"" + Std.string(this) + "\"";
		this.items.remove(i);
		this.inverse.remove(child);
	}
	,hasValue: function() {
		var $it0 = this.items.iterator();
		while( $it0.hasNext() ) {
			var ref = $it0.next();
			if(ref.hasValue()) return true;
		}
		return false;
	}
	,resolve: function(path,terminal) {
		if(terminal == null) terminal = true;
		if(path == "") return this;
		if(!thx.ref.Ref.reIndex.match(path)) throw "unable to resolve \"" + path + "\" for ArrayRef";
		var index = Std.parseInt(thx.ref.Ref.reIndex.matched(1));
		var rest = thx.ref.Ref.reIndex.matchedRight();
		var ref = this.items.get(index);
		if(null == ref) {
			var value = ref = thx.ref.Ref.fromPath(rest,this,terminal);
			this.items.set(index,value);
			this.inverse.set(ref,index);
		}
		return ref.resolve(rest,terminal);
	}
	,__class__: thx.ref.ArrayRef
});
thx.ref.EmptyParent = function() {
};
thx.ref.EmptyParent.__name__ = ["thx","ref","EmptyParent"];
thx.ref.EmptyParent.__interfaces__ = [thx.ref.IParentRef];
thx.ref.EmptyParent.prototype = {
	removeChild: function(child) {
	}
	,__class__: thx.ref.EmptyParent
};
thx.ref.ObjectRef = function(parent) {
	thx.ref.BaseRef.call(this,parent);
	this.fields = new haxe.ds.StringMap();
	this.inverse = new haxe.ds.ObjectMap();
};
thx.ref.ObjectRef.__name__ = ["thx","ref","ObjectRef"];
thx.ref.ObjectRef.__interfaces__ = [thx.ref.IParentRef,thx.ref.IRef];
thx.ref.ObjectRef.__super__ = thx.ref.BaseRef;
thx.ref.ObjectRef.prototype = $extend(thx.ref.BaseRef.prototype,{
	get: function() {
		var _g = this;
		var o = { };
		thx.core.Iterators.map(this.fields.keys(),function(key) {
			var ref = _g.fields.get(key);
			if(!ref.hasValue()) return;
			Reflect.setField(o,key,ref.get());
		});
		return o;
	}
	,set: function(obj) {
		var _g = this;
		if(!(Reflect.isObject(obj) && null == Type.getClass(obj))) throw "object \"" + Std.string(obj) + "\" is not an anonymous object";
		Reflect.fields(obj).map(function(field) {
			var ref = _g.fields.get(field);
			var value = Reflect.field(obj,field);
			if(null == ref) {
				ref = thx.ref.Ref.fromValue(value,_g);
				_g.fields.set(field,ref);
				_g.inverse.set(ref,field);
			} else ref.set(value);
		});
	}
	,hasValue: function() {
		var $it0 = this.fields.iterator();
		while( $it0.hasNext() ) {
			var ref = $it0.next();
			if(ref.hasValue()) return true;
		}
		return false;
	}
	,remove: function() {
		thx.core.Iterators.map(this.fields.iterator(),function(ref) {
			ref.remove();
		});
		this.parent.removeChild(this);
	}
	,removeChild: function(child) {
		var key = this.inverse.h[child.__id__];
		if(null == key) throw "\"" + Std.string(child) + "\" is not child of \"" + Std.string(this) + "\"";
		this.inverse.remove(child);
		this.fields.remove(key);
	}
	,resolve: function(path,terminal) {
		if(terminal == null) terminal = true;
		if(path == "") return this;
		if(!thx.ref.Ref.reField.match(path)) throw "unable to resolve \"" + path + "\" for ObjectRef";
		var field = thx.ref.Ref.reField.matched(1);
		var rest = thx.ref.Ref.reField.matchedRight();
		var ref = this.fields.get(field);
		if(null == ref) {
			var value = ref = thx.ref.Ref.fromPath(rest,this,terminal);
			this.fields.set(field,value);
			this.inverse.set(ref,field);
		}
		return ref.resolve(rest,terminal);
	}
	,__class__: thx.ref.ObjectRef
});
thx.ref.Ref = function() { };
thx.ref.Ref.__name__ = ["thx","ref","Ref"];
thx.ref.Ref.fromValue = function(value,parent) {
	if(null == parent) parent = thx.ref.EmptyParent.instance;
	var ref;
	if((value instanceof Array) && value.__enum__ == null) ref = new thx.ref.ArrayRef(parent); else if(Reflect.isObject(value) && null == Type.getClass(value)) ref = new thx.ref.ObjectRef(parent); else ref = new thx.ref.ValueRef(parent);
	ref.set(value);
	return ref;
};
thx.ref.Ref.fromPath = function(path,parent,terminal) {
	if(terminal == null) terminal = true;
	if(null == parent) parent = thx.ref.EmptyParent.instance;
	if(path == "") if(terminal) return new thx.ref.ValueRef(parent); else return new thx.ref.UnknownRef(parent); else if(thx.ref.Ref.reField.match(path)) return new thx.ref.ObjectRef(parent); else if(thx.ref.Ref.reIndex.match(path)) return new thx.ref.ArrayRef(parent); else throw "invalid path \"" + path + "\"";
};
thx.ref.Ref.resolvePath = function(path,parent,terminal) {
	if(terminal == null) terminal = true;
	var ref = thx.ref.Ref.fromPath(path,parent,terminal);
	return ref.resolve(path);
};
thx.ref.UnknownRef = function(parent) {
	this.hasRef = false;
	thx.ref.BaseRef.call(this,parent);
};
thx.ref.UnknownRef.__name__ = ["thx","ref","UnknownRef"];
thx.ref.UnknownRef.__interfaces__ = [thx.ref.IParentRef,thx.ref.IRef];
thx.ref.UnknownRef.__super__ = thx.ref.BaseRef;
thx.ref.UnknownRef.prototype = $extend(thx.ref.BaseRef.prototype,{
	get: function() {
		if(this.hasRef) return this.ref.get(); else return null;
	}
	,set: function(value) {
		if(this.hasRef) this.ref.set(value); else {
			this.hasRef = true;
			this.ref = thx.ref.Ref.fromValue(value,this);
		}
	}
	,remove: function() {
		if(this.hasRef) this.ref.remove();
		this.parent.removeChild(this);
	}
	,removeChild: function(child) {
		if(this.hasRef) {
			this.ref = null;
			this.hasRef = false;
		}
	}
	,hasValue: function() {
		return this.hasRef && this.ref.hasValue();
	}
	,resolve: function(path,terminal) {
		if(terminal == null) terminal = true;
		if(this.hasRef) return this.ref.resolve(path,terminal);
		if(path == "") return this;
		this.hasRef = true;
		this.ref = thx.ref.Ref.fromPath(path,this,terminal);
		return this.ref.resolve(path,terminal);
	}
	,__class__: thx.ref.UnknownRef
});
thx.ref.ValueRef = function(parent) {
	this._hasValue = false;
	thx.ref.BaseRef.call(this,parent);
};
thx.ref.ValueRef.__name__ = ["thx","ref","ValueRef"];
thx.ref.ValueRef.__interfaces__ = [thx.ref.IRef];
thx.ref.ValueRef.__super__ = thx.ref.BaseRef;
thx.ref.ValueRef.prototype = $extend(thx.ref.BaseRef.prototype,{
	get: function() {
		return this.value;
	}
	,set: function(value) {
		this.value = value;
		this._hasValue = true;
	}
	,remove: function() {
		this.value = null;
		this._hasValue = false;
		this.parent.removeChild(this);
	}
	,hasValue: function() {
		return this._hasValue;
	}
	,resolve: function(path,terminal) {
		if(terminal == null) terminal = true;
		if(path != "") throw "unable to resolve path \"" + path + "\" on ValueRef";
		return this;
	}
	,__class__: thx.ref.ValueRef
});
var ui = {};
ui.Data = function(data) {
	var _g = this;
	this.feed = function(p) {
	};
	this.stream = new steamer.Producer(function(feed) {
		_g.feed = feed;
	});
	this.reset(data);
};
ui.Data.__name__ = ["ui","Data"];
ui.Data.prototype = {
	resolve: function(path) {
		var ref = this.cache.get(path);
		if(null == ref) {
			ref = this.root.resolve(path);
			if(ref.hasValue()) this.cache.set(path,ref);
		}
		return ref;
	}
	,get: function(path) {
		return this.resolve(path).get();
	}
	,hasValue: function(path) {
		return this.resolve(path).hasValue();
	}
	,set: function(path,value) {
		var ref = this.resolve(path);
		this.cache.set(path,ref);
		if(ref.get() != value) {
			ref.set(value);
			this.feed(steamer.Pulse.Emit(this.toObject()));
		}
		return this;
	}
	,reset: function(value) {
		this.root = new thx.ref.ObjectRef(null);
		this.cache = new haxe.ds.StringMap();
		if(null != value) this.set("",value);
		this.feed(steamer.Pulse.Emit(this.toObject()));
		return this;
	}
	,remove: function(path) {
		var ref = this.cache.get(path);
		if(null == ref) ref = this.root.resolve(path);
		if(ref.hasValue()) {
			ref.remove();
			this.feed(steamer.Pulse.Emit(this.toObject()));
		}
		this.cache.remove(path);
	}
	,rename: function(oldpath,newpath) {
		if(!this.hasValue(oldpath) || this.hasValue(newpath)) return false;
		var v = this.get(oldpath);
		this.remove(oldpath);
		this.set(newpath,v);
		this.feed(steamer.Pulse.Emit(this.toObject()));
		return true;
	}
	,toObject: function() {
		return this.root.get();
	}
	,toJSON: function() {
		return JSON.stringify(this.toObject());
	}
	,__class__: ui.Data
};
ui.Model = function(data) {
	var _g = this;
	this.data = data;
	this.schema = new ui.Schema();
	this.changes = new steamer.Producer(function(feed) {
		data.stream.feed({ onPulse : function(p) {
			switch(p[1]) {
			case 0:
				var o = p[2];
				break;
			case 2:
				var e = p[2];
				feed(steamer.Pulse.Fail(e));
				break;
			case 1:
				feed(steamer.Pulse.End);
				break;
			}
		}});
		_g.schema.stream.feed({ onPulse : function(p1) {
			switch(p1[1]) {
			case 0:
				var e1 = p1[2];
				switch(e1[1]) {
				case 0:
					var list = e1[2];
					break;
				case 1:
					var type = e1[3];
					var name = e1[2];
					break;
				case 2:
					var name1 = e1[2];
					break;
				case 3:
					var newname = e1[3];
					var oldname = e1[2];
					break;
				default:
				}
				break;
			case 2:
				var e2 = p1[2];
				feed(steamer.Pulse.Fail(e2));
				break;
			case 1:
				feed(steamer.Pulse.End);
				break;
			}
		}});
	});
};
ui.Model.__name__ = ["ui","Model"];
ui.Model.prototype = {
	get_keys: function() {
		return [];
	}
	,__class__: ui.Model
};
ui.ModelChange = { __ename__ : ["ui","ModelChange"], __constructs__ : [] };
ui.Schema = function() {
	var _g = this;
	this.fields = new haxe.ds.StringMap();
	this.stream = new ui.SchemaProducer($bind(this,this.getPairs),function(feed) {
		_g.feed = feed;
	});
};
ui.Schema.__name__ = ["ui","Schema"];
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
	,get: function(name) {
		return this.fields.get(name);
	}
	,exists: function(name) {
		return this.fields.exists(name);
	}
	,getFieldNames: function() {
		var arr = [];
		var $it0 = this.fields.keys();
		while( $it0.hasNext() ) {
			var key = $it0.next();
			arr.push(key);
		}
		return arr;
	}
	,getPairs: function() {
		var _g = this;
		return this.getFieldNames().map(function(key) {
			return { name : key, type : _g.fields.get(key)};
		});
	}
	,__class__: ui.Schema
};
ui.SchemaProducer = function(getPairs,handler) {
	this.getPairs = getPairs;
	steamer.Producer.call(this,handler,false);
};
ui.SchemaProducer.__name__ = ["ui","SchemaProducer"];
ui.SchemaProducer.__super__ = steamer.Producer;
ui.SchemaProducer.prototype = $extend(steamer.Producer.prototype,{
	feed: function(consumer) {
		steamer.Producer.prototype.feed.call(this,consumer);
		consumer.onPulse(steamer.Pulse.Emit(ui.SchemaEvent.ListFields(this.getPairs())));
	}
	,__class__: ui.SchemaProducer
});
ui.SchemaEvent = { __ename__ : ["ui","SchemaEvent"], __constructs__ : ["ListFields","AddField","DeleteField","RenameField","RetypeField"] };
ui.SchemaEvent.ListFields = function(list) { var $x = ["ListFields",0,list]; $x.__enum__ = ui.SchemaEvent; $x.toString = $estr; return $x; };
ui.SchemaEvent.AddField = function(name,type) { var $x = ["AddField",1,name,type]; $x.__enum__ = ui.SchemaEvent; $x.toString = $estr; return $x; };
ui.SchemaEvent.DeleteField = function(name) { var $x = ["DeleteField",2,name]; $x.__enum__ = ui.SchemaEvent; $x.toString = $estr; return $x; };
ui.SchemaEvent.RenameField = function(oldname,newname) { var $x = ["RenameField",3,oldname,newname]; $x.__enum__ = ui.SchemaEvent; $x.toString = $estr; return $x; };
ui.SchemaEvent.RetypeField = function(name,type) { var $x = ["RetypeField",4,name,type]; $x.__enum__ = ui.SchemaEvent; $x.toString = $estr; return $x; };
ui.SchemaType = { __ename__ : ["ui","SchemaType"], __constructs__ : ["ArrayType","BoolType","DateType","FloatType","ObjectType","StringType"] };
ui.SchemaType.ArrayType = function(item) { var $x = ["ArrayType",0,item]; $x.__enum__ = ui.SchemaType; $x.toString = $estr; return $x; };
ui.SchemaType.BoolType = ["BoolType",1];
ui.SchemaType.BoolType.toString = $estr;
ui.SchemaType.BoolType.__enum__ = ui.SchemaType;
ui.SchemaType.DateType = ["DateType",2];
ui.SchemaType.DateType.toString = $estr;
ui.SchemaType.DateType.__enum__ = ui.SchemaType;
ui.SchemaType.FloatType = ["FloatType",3];
ui.SchemaType.FloatType.toString = $estr;
ui.SchemaType.FloatType.__enum__ = ui.SchemaType;
ui.SchemaType.ObjectType = function(fields) { var $x = ["ObjectType",4,fields]; $x.__enum__ = ui.SchemaType; $x.toString = $estr; return $x; };
ui.SchemaType.StringType = ["StringType",5];
ui.SchemaType.StringType.toString = $estr;
ui.SchemaType.StringType.__enum__ = ui.SchemaType;
ui.components = {};
ui.components.Component = function(options) {
	this.isAttached = false;
	this.list = [];
	this.properties = new ui.components.Properties(this);
	if(null == options.template) throw "" + Std.string(this) + " needs a template";
	this.el = dom.Html.parseList(options.template)[0];
	if(null != options.classes) this.el.classList.add(options.classes);
	if(null != options.parent) options.parent.add(this);
};
ui.components.Component.__name__ = ["ui","components","Component"];
ui.components.Component.prototype = {
	appendTo: function(container) {
		container.appendChild(this.el);
		this.isAttached = true;
	}
	,detach: function() {
		if(!this.isAttached) throw "Component is not attached";
		this.el.parentElement.removeChild(this.el);
		this.isAttached = false;
	}
	,destroy: function() {
		if(null != this.parent) this.parent.remove(this);
		if(this.isAttached) this.detach();
		this.properties.removeAll();
	}
	,add: function(child) {
		if(null != child.parent) child.parent.remove(child);
		this.list.push(child);
		child.parent = this;
	}
	,remove: function(child) {
		if(!HxOverrides.remove(this.list,child)) throw "" + Std.string(child) + " is not a child of " + Std.string(this);
		child.parent = null;
	}
	,get_children: function() {
		return this.list;
	}
	,toString: function() {
		return Type.getClassName(Type.getClass(this)).split(".").pop();
	}
	,__class__: ui.components.Component
};
ui.components.Button = function(options) {
	if(null == options.template) options.template = ui.components.Button.template;
	ui.components.Component.call(this,options);
	this.properties.add(new ui.properties.ClickProperty());
};
ui.components.Button.__name__ = ["ui","components","Button"];
ui.components.Button.withIcon = function(name,options) {
	var button = new ui.components.Button(options);
	button.properties.add(new ui.properties.IconProperty(name));
	return button;
};
ui.components.Button.__super__ = ui.components.Component;
ui.components.Button.prototype = $extend(ui.components.Component.prototype,{
	__class__: ui.components.Button
});
ui.components.Properties = function(target) {
	this.target = target;
	this.implementations = new ui.properties.Implementations();
	this.properties = new haxe.ds.StringMap();
};
ui.components.Properties.__name__ = ["ui","components","Properties"];
ui.components.Properties.prototype = {
	removeAll: function() {
		var $it0 = this.properties.keys();
		while( $it0.hasNext() ) {
			var name = $it0.next();
			this.removeByName(name);
		}
	}
	,add: function(property) {
		if(this.properties.exists(property.name)) throw "" + Std.string(this.target) + " already has a property " + Std.string(property);
		this.properties.set(property.name,property);
		this.implementations.set(property.name,property.inject(this.target));
	}
	,get: function(name) {
		return this.properties.get(name);
	}
	,exists: function(name) {
		return this.properties.exists(name);
	}
	,remove: function(property) {
		this.removeByName(property.name);
	}
	,removeByName: function(name) {
		if(!this.properties.exists(name)) throw "property \"" + name + "\" does not exist in " + Std.string(this.target);
		this.implementations.get(name).dispose();
		this.implementations.remove(name);
		this.properties.remove(name);
	}
	,copyTo: function(other) {
		var $it0 = this.properties.keys();
		while( $it0.hasNext() ) {
			var name = $it0.next();
			other.properties.add(this.get(name));
		}
	}
	,__class__: ui.components.Properties
};
ui.properties = {};
ui.properties.Property = function(name) {
	this.name = name;
};
ui.properties.Property.__name__ = ["ui","properties","Property"];
ui.properties.Property.prototype = {
	inject: function(target) {
		throw "inject must be overridden in " + this.toString();
	}
	,toString: function() {
		return "" + this.name + " (" + Type.getClassName(Type.getClass(this)).split(".").pop() + ")";
	}
	,__class__: ui.properties.Property
};
ui.properties.ClickProperty = function() {
	ui.properties.Property.call(this,"click");
};
ui.properties.ClickProperty.__name__ = ["ui","properties","ClickProperty"];
ui.properties.ClickProperty.__super__ = ui.properties.Property;
ui.properties.ClickProperty.prototype = $extend(ui.properties.Property.prototype,{
	inject: function(target) {
		return new ui.properties.ClickPropertyImplementation(target,this);
	}
	,__class__: ui.properties.ClickProperty
});
ui.properties.PropertyImplementation = function(component,property) {
	this.component = component;
	this.property = property;
	this._dispose = this.init();
};
ui.properties.PropertyImplementation.__name__ = ["ui","properties","PropertyImplementation"];
ui.properties.PropertyImplementation.prototype = {
	init: function() {
		throw "abstact function init, must override";
	}
	,dispose: function() {
		this._dispose();
		this.component = null;
	}
	,toString: function() {
		return Type.getClassName(Type.getClass(this)).split(".").pop();
	}
	,__class__: ui.properties.PropertyImplementation
};
ui.properties.ClickPropertyImplementation = function(component,property) {
	ui.properties.PropertyImplementation.call(this,component,property);
};
ui.properties.ClickPropertyImplementation.__name__ = ["ui","properties","ClickPropertyImplementation"];
ui.properties.ClickPropertyImplementation.asClickable = function(component) {
	return component.properties.implementations.get("click");
};
ui.properties.ClickPropertyImplementation.__super__ = ui.properties.PropertyImplementation;
ui.properties.ClickPropertyImplementation.prototype = $extend(ui.properties.PropertyImplementation.prototype,{
	init: function() {
		var tuple = steamer.dom.Dom.produceEvent(this.component.el,"click");
		this.clicks = tuple.producer;
		return tuple.cancel;
	}
	,__class__: ui.properties.ClickPropertyImplementation
});
ui.properties.IconProperty = function(iconName) {
	ui.properties.Property.call(this,"icon");
	this.iconName = iconName;
};
ui.properties.IconProperty.__name__ = ["ui","properties","IconProperty"];
ui.properties.IconProperty.__super__ = ui.properties.Property;
ui.properties.IconProperty.prototype = $extend(ui.properties.Property.prototype,{
	inject: function(component) {
		return new ui.properties.IconPropertyImplementation(component,this);
	}
	,__class__: ui.properties.IconProperty
});
ui.properties.IconPropertyImplementation = function(component,property) {
	ui.properties.PropertyImplementation.call(this,component,property);
};
ui.properties.IconPropertyImplementation.__name__ = ["ui","properties","IconPropertyImplementation"];
ui.properties.IconPropertyImplementation.asIcon = function(component) {
	return component.properties.implementations.get("icon");
};
ui.properties.IconPropertyImplementation.getCurrentIcon = function(el) {
	var _g1 = 0;
	var _g = el.classList.length;
	while(_g1 < _g) {
		var i = _g1++;
		var className = el.classList.item(i);
		if(HxOverrides.substr(className,0,3) == "fa-") return HxOverrides.substr(className,3,null);
	}
	return null;
};
ui.properties.IconPropertyImplementation.__super__ = ui.properties.PropertyImplementation;
ui.properties.IconPropertyImplementation.prototype = $extend(ui.properties.PropertyImplementation.prototype,{
	init: function() {
		var _g = this;
		var current = ui.properties.IconPropertyImplementation.getCurrentIcon(this.component.el);
		var needsFa = current == null;
		this.icon = new steamer.Value(this.property.iconName);
		if(needsFa) this.component.el.classList.add("fa");
		this.icon.feed({ onPulse : function(pulse) {
			switch(pulse[1]) {
			case 0:
				var value = pulse[2];
				if(null != current) _g.component.el.classList.remove(current);
				_g.component.el.classList.add(current = "fa-" + value);
				break;
			case 1:
				if(needsFa) _g.component.el.classList.remove("fa");
				break;
			default:
			}
		}});
		return function() {
			_g.icon.terminate();
			_g.icon = null;
		};
	}
	,__class__: ui.properties.IconPropertyImplementation
});
ui.properties.Implementations = function() {
	this.map = new haxe.ds.StringMap();
};
ui.properties.Implementations.__name__ = ["ui","properties","Implementations"];
ui.properties.Implementations.prototype = {
	get: function(name) {
		return this.map.get(name);
	}
	,remove: function(name) {
		return this.map.remove(name);
	}
	,set: function(name,implementation) {
		this.map.set(name,implementation);
	}
	,exists: function(name) {
		return this.map.exists(name);
	}
	,__class__: ui.properties.Implementations
};
function $iterator(o) { if( o instanceof Array ) return function() { return HxOverrides.iter(o); }; return typeof(o.iterator) == 'function' ? $bind(o,o.iterator) : o.iterator; }
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
if(Array.prototype.indexOf) HxOverrides.indexOf = function(a,o,i) {
	return Array.prototype.indexOf.call(a,o,i);
};
String.prototype.__class__ = String;
String.__name__ = ["String"];
Array.__name__ = ["Array"];
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
haxe.ds.ObjectMap.count = 0;
promhx.base.AsyncBase.id_ctr = 0;
promhx.base.EventLoop.queue = new List();
steamer.Pulses.nil = steamer.Pulse.Emit(thx.Nil.nil);
thx.core.Ints.pattern_parse = new EReg("^[+-]?(\\d+|0x[0-9A-F]+)$","i");
thx.core.Strings._reSplitWC = new EReg("(\r\n|\n\r|\n|\r)","g");
thx.core.Strings._reReduceWS = new EReg("\\s+","");
thx.core.Strings._reStripTags = new EReg("(<[a-z]+[^>/]*/?>|</[a-z]+>)","i");
thx.core.Strings._reCollapse = new EReg("\\s+","g");
thx.core.Strings.__ucwordsPattern = new EReg("[^a-zA-Z]([a-z])","g");
thx.core.Strings.__ucwordswsPattern = new EReg("\\s[a-z]","g");
thx.core.Strings.__alphaNumPattern = new EReg("^[a-z0-9]+$","i");
thx.core.Strings.__digitsPattern = new EReg("^[0-9]+$","");
thx.ref.EmptyParent.instance = new thx.ref.EmptyParent();
thx.ref.Ref.reField = new EReg("^\\.?([^.\\[]+)","");
thx.ref.Ref.reIndex = new EReg("^\\[(\\d+)\\]","");
ui.components.Button.template = "<button></button>";
Main.main();
})(typeof window != "undefined" ? window : exports);

//# sourceMappingURL=app.js.map