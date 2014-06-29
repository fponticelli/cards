(function ($hx_exports) { "use strict";
$hx_exports.promhx = $hx_exports.promhx || {};
var $estr = function() { return js.Boot.__string_rec(this,''); };
function $extend(from, fields) {
	function Inherit() {} Inherit.prototype = from; var proto = new Inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var Config = function() { };
Config.__name__ = ["Config"];
var EReg = function(r,opt) {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
};
EReg.__name__ = ["EReg"];
EReg.prototype = {
	r: null
	,match: function(s) {
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
HxOverrides.dateStr = function(date) {
	var m = date.getMonth() + 1;
	var d = date.getDate();
	var h = date.getHours();
	var mi = date.getMinutes();
	var s = date.getSeconds();
	return date.getFullYear() + "-" + (m < 10?"0" + m:"" + m) + "-" + (d < 10?"0" + d:"" + d) + " " + (h < 10?"0" + h:"" + h) + ":" + (mi < 10?"0" + mi:"" + mi) + ":" + (s < 10?"0" + s:"" + s);
};
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
var Lambda = function() { };
Lambda.__name__ = ["Lambda"];
Lambda.array = function(it) {
	var a = new Array();
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var i = $it0.next();
		a.push(i);
	}
	return a;
};
Lambda.has = function(it,elt) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(x == elt) return true;
	}
	return false;
};
var List = function() {
	this.length = 0;
};
List.__name__ = ["List"];
List.prototype = {
	h: null
	,q: null
	,length: null
	,add: function(item) {
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
		var data = new ui.Data({ });
		var model = new ui.Model(data);
		ui.Card.create(model,container);
	});
};
var IMap = function() { };
IMap.__name__ = ["IMap"];
Math.__name__ = ["Math"];
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
Reflect.isFunction = function(f) {
	return typeof(f) == "function" && !(f.__name__ || f.__ename__);
};
Reflect.compareMethods = function(f1,f2) {
	if(f1 == f2) return true;
	if(!Reflect.isFunction(f1) || !Reflect.isFunction(f2)) return false;
	return f1.scope == f2.scope && f1.method == f2.method && f1.method != null;
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
	b: null
	,add: function(x) {
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
Type.getEnum = function(o) {
	if(o == null) return null;
	return o.__enum__;
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
Type.getInstanceFields = function(c) {
	var a = [];
	for(var i in c.prototype) a.push(i);
	HxOverrides.remove(a,"__class__");
	HxOverrides.remove(a,"__properties__");
	return a;
};
Type["typeof"] = function(v) {
	var _g = typeof(v);
	switch(_g) {
	case "boolean":
		return ValueType.TBool;
	case "string":
		return ValueType.TClass(String);
	case "number":
		if(Math.ceil(v) == v % 2147483648.0) return ValueType.TInt;
		return ValueType.TFloat;
	case "object":
		if(v == null) return ValueType.TNull;
		var e = v.__enum__;
		if(e != null) return ValueType.TEnum(e);
		var c;
		if((v instanceof Array) && v.__enum__ == null) c = Array; else c = v.__class__;
		if(c != null) return ValueType.TClass(c);
		return ValueType.TObject;
	case "function":
		if(v.__name__ || v.__ename__) return ValueType.TObject;
		return ValueType.TFunction;
	case "undefined":
		return ValueType.TNull;
	default:
		return ValueType.TUnknown;
	}
};
Type.enumConstructor = function(e) {
	return e[0];
};
Type.enumParameters = function(e) {
	return e.slice(2);
};
Type.enumIndex = function(e) {
	return e[1];
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
haxe.StackItem = { __ename__ : ["haxe","StackItem"], __constructs__ : ["CFunction","Module","FilePos","Method","LocalFunction"] };
haxe.StackItem.CFunction = ["CFunction",0];
haxe.StackItem.CFunction.toString = $estr;
haxe.StackItem.CFunction.__enum__ = haxe.StackItem;
haxe.StackItem.Module = function(m) { var $x = ["Module",1,m]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; };
haxe.StackItem.FilePos = function(s,file,line) { var $x = ["FilePos",2,s,file,line]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; };
haxe.StackItem.Method = function(classname,method) { var $x = ["Method",3,classname,method]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; };
haxe.StackItem.LocalFunction = function(v) { var $x = ["LocalFunction",4,v]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; };
haxe.CallStack = function() { };
haxe.CallStack.__name__ = ["haxe","CallStack"];
haxe.CallStack.callStack = function() {
	var oldValue = Error.prepareStackTrace;
	Error.prepareStackTrace = function(error,callsites) {
		var stack = [];
		var _g = 0;
		while(_g < callsites.length) {
			var site = callsites[_g];
			++_g;
			var method = null;
			var fullName = site.getFunctionName();
			if(fullName != null) {
				var idx = fullName.lastIndexOf(".");
				if(idx >= 0) {
					var className = HxOverrides.substr(fullName,0,idx);
					var methodName = HxOverrides.substr(fullName,idx + 1,null);
					method = haxe.StackItem.Method(className,methodName);
				}
			}
			stack.push(haxe.StackItem.FilePos(method,site.getFileName(),site.getLineNumber()));
		}
		return stack;
	};
	var a = haxe.CallStack.makeStack(new Error().stack);
	a.shift();
	Error.prepareStackTrace = oldValue;
	return a;
};
haxe.CallStack.exceptionStack = function() {
	return [];
};
haxe.CallStack.makeStack = function(s) {
	if(typeof(s) == "string") {
		var stack = s.split("\n");
		var m = [];
		var _g = 0;
		while(_g < stack.length) {
			var line = stack[_g];
			++_g;
			m.push(haxe.StackItem.Module(line));
		}
		return m;
	} else return s;
};
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
	h: null
	,set: function(key,value) {
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
	h: null
	,set: function(key,value) {
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
haxe.ds.Option = { __ename__ : ["haxe","ds","Option"], __constructs__ : ["Some","None"] };
haxe.ds.Option.Some = function(v) { var $x = ["Some",0,v]; $x.__enum__ = haxe.ds.Option; $x.toString = $estr; return $x; };
haxe.ds.Option.None = ["None",1];
haxe.ds.Option.None.toString = $estr;
haxe.ds.Option.None.__enum__ = haxe.ds.Option;
haxe.ds.StringMap = function() {
	this.h = { };
};
haxe.ds.StringMap.__name__ = ["haxe","ds","StringMap"];
haxe.ds.StringMap.__interfaces__ = [IMap];
haxe.ds.StringMap.prototype = {
	h: null
	,set: function(key,value) {
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
haxe.io = {};
haxe.io.Bytes = function() { };
haxe.io.Bytes.__name__ = ["haxe","io","Bytes"];
haxe.io.Bytes.prototype = {
	length: null
	,b: null
	,__class__: haxe.io.Bytes
};
haxe.io.Eof = function() { };
haxe.io.Eof.__name__ = ["haxe","io","Eof"];
haxe.io.Eof.prototype = {
	toString: function() {
		return "Eof";
	}
	,__class__: haxe.io.Eof
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
	id: null
	,_val: null
	,_resolved: null
	,_fulfilled: null
	,_pending: null
	,_update: null
	,_error: null
	,_errorMap: null
	,catchError: function(f) {
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
	_rejected: null
	,isRejected: function() {
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
steamer._Consumer = {};
steamer._Consumer.Consumer_Impl_ = function() { };
steamer._Consumer.Consumer_Impl_.__name__ = ["steamer","_Consumer","Consumer_Impl_"];
steamer._Consumer.Consumer_Impl_._new = function(consumer) {
	return consumer;
};
steamer._Consumer.Consumer_Impl_.fromConsumer = function(consumer) {
	return consumer;
};
steamer._Consumer.Consumer_Impl_.fromFunction = function(f) {
	return { onPulse : function(pulse) {
		switch(pulse[1]) {
		case 0:
			var v = pulse[2];
			f(v);
			break;
		default:
		}
	}};
};
steamer._Consumer.Consumer_Impl_.fromObject = function(o) {
	if(null == o.emit) o.emit = function(_) {
	};
	if(null == o.end) o.end = function() {
	};
	if(null == o.error) o.error = function(e) {
		throw e;
	};
	return { onPulse : function(pulse) {
		switch(pulse[1]) {
		case 0:
			var v = pulse[2];
			o.emit(v);
			break;
		case 1:
			o.end();
			break;
		case 2:
			var e1 = pulse[2];
			o.error(e1);
			break;
		}
	}};
};
steamer._Consumer.Consumer_Impl_.toImplementation = function(this1) {
	return this1;
};
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
		producer.feed((function($this) {
			var $r;
			var consumer = steamer.Bus.passOn(function(arr) {
				arr.map(function(value) {
					forward(steamer.Pulse.Emit(value));
				});
			},forward);
			$r = consumer;
			return $r;
		}(this)));
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
		producer.feed((function($this) {
			var $r;
			var consumer = new steamer.Bus(function(v) {
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
			});
			$r = consumer;
			return $r;
		}(this)));
	},producer.endOnError);
};
steamer.Producer.prototype = {
	handler: null
	,endOnError: null
	,feed: function(consumer) {
		var _g = this;
		var ended = false;
		var sendPulse = function(v) {
			if(ended) throw new thx.Error("Feed already reached end but still receiving pulses: ${v}",null,{ fileName : "Producer.hx", lineNumber : 22, className : "steamer.Producer", methodName : "feed"}); else switch(v[1]) {
			case 2:
				if(_g.endOnError) {
					thx.Timer.setImmediate((function(f,a1) {
						return function() {
							return f(a1);
						};
					})(($_=consumer,$bind($_,$_.onPulse)),v));
					thx.Timer.setImmediate((function(f1,a11) {
						return function() {
							return f1(a11);
						};
					})(($_=consumer,$bind($_,$_.onPulse)),steamer.Pulse.End));
				} else thx.Timer.setImmediate((function(f2,a12) {
					return function() {
						return f2(a12);
					};
				})(($_=consumer,$bind($_,$_.onPulse)),v));
				break;
			case 1:
				ended = true;
				thx.Timer.setImmediate((function(f3,a13) {
					return function() {
						return f3(a13);
					};
				})(($_=consumer,$bind($_,$_.onPulse)),steamer.Pulse.End));
				break;
			default:
				thx.Timer.setImmediate((function(f2,a12) {
					return function() {
						return f2(a12);
					};
				})(($_=consumer,$bind($_,$_.onPulse)),v));
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
			_g.feed((function($this) {
				var $r;
				var consumer = steamer.Bus.passOn(function(value) {
					try {
						var t = function(v) {
							forward(steamer.Pulse.Emit(v));
						};
						transform(value,t);
					} catch( $e0 ) {
						if( js.Boot.__instanceof($e0,thx.Error) ) {
							var e = $e0;
							forward(steamer.Pulse.Fail(e));
						} else {
						var e1 = $e0;
						forward(steamer.Pulse.Fail(new thx.Error(Std.string(e1),null,{ fileName : "Producer.hx", lineNumber : 50, className : "steamer.Producer", methodName : "mapAsync"})));
						}
					}
				},forward);
				$r = consumer;
				return $r;
			}(this)));
		},this.endOnError);
	}
	,log: function(prefix,posInfo) {
		if(prefix == null) prefix = ""; else prefix = "" + prefix + ": ";
		return this.map(function(v) {
			haxe.Log.trace(v,posInfo);
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
			_g.feed((function($this) {
				var $r;
				var consumer = steamer.Bus.passOn(function(value) {
					try {
						var t = function(v) {
							if(v) forward(steamer.Pulse.Emit(value));
						};
						f(value,t);
					} catch( $e0 ) {
						if( js.Boot.__instanceof($e0,thx.Error) ) {
							var e = $e0;
							forward(steamer.Pulse.Fail(e));
						} else {
						var e1 = $e0;
						forward(steamer.Pulse.Fail(new thx.Error(Std.string(e1),null,{ fileName : "Producer.hx", lineNumber : 80, className : "steamer.Producer", methodName : "filterAsync"})));
						}
					}
				},forward);
				$r = consumer;
				return $r;
			}(this)));
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
			_g.feed((function($this) {
				var $r;
				var consumer = new steamer.Bus(emit,end,fail);
				$r = consumer;
				return $r;
			}(this)));
			other.feed((function($this) {
				var $r;
				var consumer1 = new steamer.Bus(emit,end,fail);
				$r = consumer1;
				return $r;
			}(this)));
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
			_g.feed((function($this) {
				var $r;
				var consumer = new steamer.Bus(emit,function() {
					other.feed((function($this) {
						var $r;
						var consumer1 = steamer.Bus.passOn(emit,forward);
						$r = consumer1;
						return $r;
					}(this)));
				},fail);
				$r = consumer;
				return $r;
			}(this)));
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
			_g.feed((function($this) {
				var $r;
				var consumer = new steamer.Bus(function(value) {
					if(ended) return;
					buffA.push(value);
					produce();
				},function() {
					endA = true;
					produce();
				},function(error) {
					forward(steamer.Pulse.Fail(error));
				});
				$r = consumer;
				return $r;
			}(this)));
			other.feed((function($this) {
				var $r;
				var consumer1 = new steamer.Bus(function(value1) {
					if(ended) return;
					buffB.push(value1);
					produce();
				},function() {
					endB = true;
					produce();
				},function(error1) {
					forward(steamer.Pulse.Fail(error1));
				});
				$r = consumer1;
				return $r;
			}(this)));
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
			_g.feed((function($this) {
				var $r;
				var consumer = new steamer.Bus(function(value) {
					buffA = value;
					produce();
				},function() {
					endA = true;
					produce();
				},function(error) {
					forward(steamer.Pulse.Fail(error));
				});
				$r = consumer;
				return $r;
			}(this)));
			other.feed((function($this) {
				var $r;
				var consumer1 = new steamer.Bus(function(value1) {
					buffB = value1;
					produce();
				},function() {
					endB = true;
					produce();
				},function(error1) {
					forward(steamer.Pulse.Fail(error1));
				});
				$r = consumer1;
				return $r;
			}(this)));
		},this.endOnError);
	}
	,distinct: function(equals) {
		var _g = this;
		var last = null;
		if(null == equals) equals = function(a,b) {
			return a == b;
		};
		return new steamer.Producer(function(forward) {
			_g.feed((function($this) {
				var $r;
				var consumer = steamer.Bus.passOn(function(v) {
					if(equals(v,last)) return;
					last = v;
					forward(steamer.Pulse.Emit(v));
				},forward);
				$r = consumer;
				return $r;
			}(this)));
		},this.endOnError);
	}
	,debounce: function(delay) {
		var _g = this;
		var id = null;
		return new steamer.Producer(function(forward) {
			_g.feed((function($this) {
				var $r;
				var consumer = steamer.Bus.passOn(function(v) {
					thx.Timer.clearTimer(id);
					id = thx.Timer.setTimeout((function(f,a1) {
						return function() {
							return f(a1);
						};
					})(forward,steamer.Pulse.Emit(v)),delay);
				},forward);
				$r = consumer;
				return $r;
			}(this)));
		},this.endOnError);
	}
	,sampleBy: function(sampler) {
		var _g = this;
		var latest = null;
		return new steamer.Producer(function(forward) {
			_g.feed((function($this) {
				var $r;
				var consumer = steamer.Bus.passOn(function(v) {
					latest = v;
				},forward);
				$r = consumer;
				return $r;
			}(this)));
			sampler.feed((function($this) {
				var $r;
				var consumer1 = steamer.Bus.passOn(function(v1) {
					if(null == latest) return;
					forward(steamer.Pulse.Emit({ left : latest, right : v1}));
					latest = null;
				},forward);
				$r = consumer1;
				return $r;
			}(this)));
		},this.endOnError);
	}
	,__class__: steamer.Producer
};
steamer.MultiProducer = function(endOnError) {
	if(endOnError == null) endOnError = true;
	this.producers = [];
	this.consumers = [];
	steamer.Producer.call(this,function(pulse) {
	},endOnError);
};
steamer.MultiProducer.__name__ = ["steamer","MultiProducer"];
steamer.MultiProducer.__super__ = steamer.Producer;
steamer.MultiProducer.prototype = $extend(steamer.Producer.prototype,{
	producers: null
	,consumers: null
	,add: function(producer) {
		this.producers.push(producer);
		var _g = 0;
		var _g1 = this.consumers;
		while(_g < _g1.length) {
			var consumer = _g1[_g];
			++_g;
			producer.feed(consumer);
		}
	}
	,remove: function(producer) {
		HxOverrides.remove(this.producers,producer);
	}
	,feed: function(consumer) {
		var _g = 0;
		var _g1 = this.producers;
		while(_g < _g1.length) {
			var producer = _g1[_g];
			++_g;
			producer.feed(consumer);
		}
		this.consumers.push(consumer);
	}
	,__class__: steamer.MultiProducer
});
steamer.Bus = function(emit,end,fail) {
	this.emit = emit;
	this.end = end;
	this.fail = fail;
};
steamer.Bus.__name__ = ["steamer","Bus"];
steamer.Bus.feed = function(forward) {
	return new steamer.Bus(function(v) {
		forward(steamer.Pulse.Emit(v));
	},function() {
		forward(steamer.Pulse.End);
	},function(error) {
		forward(steamer.Pulse.Fail(error));
	});
};
steamer.Bus.passOn = function(emit,forward) {
	return new steamer.Bus(emit,function() {
		forward(steamer.Pulse.End);
	},function(error) {
		forward(steamer.Pulse.Fail(error));
	});
};
steamer.Bus.prototype = {
	emit: null
	,end: null
	,fail: null
	,onPulse: function(pulse) {
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
	value: null
	,defaultValue: null
	,forwards: null
	,forward: function(pulse) {
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
	,onPulse: function(pulse) {
		switch(pulse[1]) {
		case 0:
			var v = pulse[2];
			this.set_value(v);
			break;
		case 2:
			var e = pulse[2];
			this.forward(steamer.Pulse.Fail(e));
			break;
		case 1:
			this.forward(steamer.Pulse.End);
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
steamer.consumers = {};
steamer.consumers.LoggerConsumer = function(prefix,pos) {
	this.prefix = prefix;
	this.pos = pos;
	var p = function() {
		return " ---> " + pos.className + "." + pos.methodName + "() at " + pos.lineNumber;
	};
	this.log = function(v) {
		console.log(v,p());
	};
	this.warn = function(v1) {
		console.warn(v1,p());
	};
	this.error = function(v2) {
		console.error(v2,p());
	};
};
steamer.consumers.LoggerConsumer.__name__ = ["steamer","consumers","LoggerConsumer"];
steamer.consumers.LoggerConsumer.prototype = {
	prefix: null
	,pos: null
	,onPulse: function(pulse) {
		switch(pulse[1]) {
		case 0:
			var v = pulse[2];
			this.log(this.p(v));
			break;
		case 1:
			this.warn(this.p("End"));
			break;
		case 2:
			var err = pulse[2];
			this.error(this.p(Std.string(err)));
			break;
		}
	}
	,p: function(v) {
		return (null == this.prefix?"":this.prefix + ": ") + v;
	}
	,log: function(v) {
		haxe.Log.trace(v,this.pos);
	}
	,warn: function(v) {
		haxe.Log.trace("[W] " + v,this.pos);
	}
	,error: function(v) {
		haxe.Log.trace("[E] " + v,this.pos);
	}
	,__class__: steamer.consumers.LoggerConsumer
};
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
	var originalText = el.innerText;
	var consume = function(text) {
		el.innerText = text;
	};
	return steamer._Consumer.Consumer_Impl_.fromObject({ emit : consume, end : (function(f,a1) {
		return function() {
			return f(a1);
		};
	})(consume,originalText)});
};
steamer.dom.Dom.consumeHtml = function(el) {
	var originalHtml = el.innerHTML;
	var consume = function(html) {
		el.innerHTML = html;
	};
	return steamer._Consumer.Consumer_Impl_.fromObject({ emit : consume, end : (function(f,a1) {
		return function() {
			return f(a1);
		};
	})(consume,originalHtml)});
};
steamer.dom.Dom.consumeAttribute = function(el,name) {
	var originalValue = el.getAttribute(name);
	var consume = function(value) {
		el.setAttribute(name,value);
	};
	return steamer._Consumer.Consumer_Impl_.fromObject({ emit : consume, end : null == originalValue?function() {
		el.removeAttribute(name);
	}:(function(f,a1) {
		return function() {
			return f(a1);
		};
	})(consume,originalValue)});
};
steamer.dom.Dom.consumeToggleAttribute = function(el,name) {
	var originalValue = el.hasAttribute(name);
	var consume = function(v) {
		if(v) el.setAttribute(name,name); else el.removeAttribute(name);
	};
	return steamer._Consumer.Consumer_Impl_.fromObject({ emit : consume, end : (function(f,v1) {
		return function() {
			return f(v1);
		};
	})(consume,originalValue)});
};
steamer.dom.Dom.consumeToggleClass = function(el,name) {
	var originalValue = el.hasAttribute(name);
	var consume = function(v) {
		if(v) el.classList.add(name); else el.classList.remove(name);
	};
	return steamer._Consumer.Consumer_Impl_.fromObject({ emit : consume, end : (function(f,v1) {
		return function() {
			return f(v1);
		};
	})(consume,originalValue)});
};
steamer.dom.Dom.consumeToggleVisibility = function(el) {
	var originalDisplay = el.style.display;
	thx.Assert.notNull(originalDisplay,"original element.style.display for visibility is NULL",{ fileName : "Dom.hx", lineNumber : 86, className : "steamer.dom.Dom", methodName : "consumeToggleVisibility"});
	if(originalDisplay == "none") originalDisplay = "";
	var consume = function(value) {
		if(value) el.style.display = originalDisplay; else el.style.display = "none";
	};
	return steamer._Consumer.Consumer_Impl_.fromObject({ emit : consume, end : (function(f,a1) {
		return function() {
			return f(a1);
		};
	})(consume,true)});
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
var sui = {};
sui.components = {};
sui.components.Component = function(options) {
	this.isAttached = false;
	this.list = [];
	this.properties = new sui.components.Properties(this);
	if(null == options.template) {
		if(null == options.el) throw "" + Std.string(this) + " needs a template"; else {
			this.el = options.el;
			if(null != this.el.parentElement) this.isAttached = true;
		}
	} else this.el = dom.Html.parseList(options.template)[0];
	if(null != options.classes) options.classes.split(" ").map(($_=this.el.classList,$bind($_,$_.add)));
	if(null != options.parent) options.parent.add(this);
	if(null != options.container) this.appendTo(options.container);
};
sui.components.Component.__name__ = ["sui","components","Component"];
sui.components.Component.prototype = {
	children: null
	,isAttached: null
	,parent: null
	,properties: null
	,el: null
	,list: null
	,appendTo: function(container) {
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
	,__class__: sui.components.Component
};
sui.components.Properties = function(target) {
	this.target = target;
	this.properties = new haxe.ds.StringMap();
};
sui.components.Properties.__name__ = ["sui","components","Properties"];
sui.components.Properties.prototype = {
	properties: null
	,target: null
	,removeAll: function() {
		var $it0 = this.properties.keys();
		while( $it0.hasNext() ) {
			var name = $it0.next();
			this.remove(name);
		}
	}
	,add: function(property) {
		if(this.properties.exists(property.name)) throw "" + Std.string(this.target) + " already has a property " + Std.string(property);
		this.properties.set(property.name,property);
	}
	,get: function(name) {
		return this.properties.get(name);
	}
	,exists: function(name) {
		return this.properties.exists(name);
	}
	,remove: function(name) {
		if(!this.properties.exists(name)) throw "property \"" + name + "\" does not exist in " + Std.string(this.target);
		var prop = this.properties.get(name);
		this.properties.remove(name);
		prop.dispose();
	}
	,__class__: sui.components.Properties
};
sui.properties = {};
sui.properties.Property = function(component,name) {
	this.component = component;
	this.name = name;
	this.cancels = [];
	this.cancels.push(this.init());
	component.properties.add(this);
};
sui.properties.Property.__name__ = ["sui","properties","Property"];
sui.properties.Property.prototype = {
	component: null
	,name: null
	,cancels: null
	,init: function() {
		throw "abstact function init, must override";
	}
	,dispose: function() {
		while(this.cancels.length > 0) (this.cancels.shift())();
		if(this.component.properties.exists(this.name)) {
			this.component.properties.remove(this.name);
			this.component = null;
		}
	}
	,toString: function() {
		return Type.getClassName(Type.getClass(this)).split(".").pop();
	}
	,__class__: sui.properties.Property
};
sui.properties.ValueProperty = function(defaultValue,component,name) {
	this.stream = new steamer.Value(defaultValue);
	sui.properties.Property.call(this,component,name);
};
sui.properties.ValueProperty.__name__ = ["sui","properties","ValueProperty"];
sui.properties.ValueProperty.__super__ = sui.properties.Property;
sui.properties.ValueProperty.prototype = $extend(sui.properties.Property.prototype,{
	defaultValue: null
	,stream: null
	,dispose: function() {
		this.stream.terminate();
		sui.properties.Property.prototype.dispose.call(this);
		this.set_value(null);
		this.stream = null;
	}
	,get_defaultValue: function() {
		return this.stream.defaultValue;
	}
	,get_value: function() {
		return this.stream.get_value();
	}
	,set_value: function(value) {
		return this.stream.set_value(value);
	}
	,__class__: sui.properties.ValueProperty
});
sui.properties.Attribute = function(component,name,attributeName,defaultValue) {
	if(null == attributeName) this.attributeName = name; else this.attributeName = attributeName;
	sui.properties.ValueProperty.call(this,defaultValue,component,name);
};
sui.properties.Attribute.__name__ = ["sui","properties","Attribute"];
sui.properties.Attribute.__super__ = sui.properties.ValueProperty;
sui.properties.Attribute.prototype = $extend(sui.properties.ValueProperty.prototype,{
	attributeName: null
	,init: function() {
		this.stream.feed(steamer.dom.Dom.consumeAttribute(this.component.el,this.attributeName));
		return function() {
		};
	}
	,__class__: sui.properties.Attribute
});
sui.properties._PropertyName = {};
sui.properties._PropertyName.PropertyName_Impl_ = function() { };
sui.properties._PropertyName.PropertyName_Impl_.__name__ = ["sui","properties","_PropertyName","PropertyName_Impl_"];
sui.properties._PropertyName.PropertyName_Impl_.fromProperty = function(property) {
	return property.name;
};
sui.properties._PropertyName.PropertyName_Impl_.fromString = function(name) {
	return name;
};
sui.properties._PropertyName.PropertyName_Impl_._new = function(name) {
	return name;
};
sui.properties._PropertyName.PropertyName_Impl_.toString = function(this1) {
	return this1;
};
sui.properties.Text = function(component,defaultText) {
	sui.properties.ValueProperty.call(this,defaultText,component,"text");
};
sui.properties.Text.__name__ = ["sui","properties","Text"];
sui.properties.Text.__super__ = sui.properties.ValueProperty;
sui.properties.Text.prototype = $extend(sui.properties.ValueProperty.prototype,{
	init: function() {
		var el = this.component.el;
		var original = el.innerText;
		this.stream.feed(steamer._Consumer.Consumer_Impl_.fromObject({ emit : function(value) {
			el.innerText = value;
		}, end : function() {
			el.innerText = original;
		}}));
		return function() {
		};
	}
	,__class__: sui.properties.Text
});
sui.properties.ToggleClass = function(component,name,className) {
	var defaultValue = component.el.classList.contains(className);
	if(null == className) this.className = name; else this.className = className;
	sui.properties.ValueProperty.call(this,defaultValue,component,name);
};
sui.properties.ToggleClass.__name__ = ["sui","properties","ToggleClass"];
sui.properties.ToggleClass.__super__ = sui.properties.ValueProperty;
sui.properties.ToggleClass.prototype = $extend(sui.properties.ValueProperty.prototype,{
	className: null
	,init: function() {
		var _g = this;
		this.stream.feed(steamer.dom.Dom.consumeToggleClass(this.component.el,this.className));
		return function() {
			if(_g.get_defaultValue()) _g.component.el.classList.add(_g.className); else _g.component.el.classList.remove(_g.className);
		};
	}
	,__class__: sui.properties.ToggleClass
});
sui.properties.Visible = function(component,defaultValue) {
	sui.properties.ValueProperty.call(this,defaultValue,component,"visible");
};
sui.properties.Visible.__name__ = ["sui","properties","Visible"];
sui.properties.Visible.__super__ = sui.properties.ValueProperty;
sui.properties.Visible.prototype = $extend(sui.properties.ValueProperty.prototype,{
	init: function() {
		this.stream.feed(steamer.dom.Dom.consumeToggleVisibility(this.component.el));
		return function() {
		};
	}
	,__class__: sui.properties.Visible
});
thx.Error = function(message,stack,pos) {
	this.message = message;
	if(null == stack) {
		stack = haxe.CallStack.exceptionStack();
		if(stack.length == 0) stack = haxe.CallStack.callStack();
	}
	this.stack = stack;
	this.pos = pos;
};
thx.Error.__name__ = ["thx","Error"];
thx.Error.__super__ = Error;
thx.Error.prototype = $extend(Error.prototype,{
	stack: null
	,pos: null
	,__class__: thx.Error
});
thx.Assert = function() { };
thx.Assert.__name__ = ["thx","Assert"];
thx.Assert.isTrue = function(cond,msg,pos) {
	if(thx.Assert.results == null) throw "Assert.results is not currently bound to any assert context";
	if(null == msg) msg = "expected true";
	if(cond) thx.Assert.results.add(thx.core.Assertion.Success(pos)); else thx.Assert.results.add(thx.core.Assertion.Failure(msg,pos));
};
thx.Assert.isFalse = function(value,msg,pos) {
	if(null == msg) msg = "expected false";
	thx.Assert.isTrue(value == false,msg,pos);
};
thx.Assert.isNull = function(value,msg,pos) {
	if(msg == null) msg = "expected null but was " + thx.Assert.q(value);
	thx.Assert.isTrue(value == null,msg,pos);
};
thx.Assert.notNull = function(value,msg,pos) {
	if(null == msg) msg = "expected not null";
	thx.Assert.isTrue(value != null,msg,pos);
};
thx.Assert["is"] = function(value,type,msg,pos) {
	if(msg == null) msg = "expected type " + thx.Assert.typeToString(type) + " but was " + thx.Assert.typeToString(value);
	thx.Assert.isTrue(js.Boot.__instanceof(value,type),msg,pos);
};
thx.Assert.notEquals = function(expected,value,msg,pos) {
	if(msg == null) msg = "expected " + thx.Assert.q(expected) + " and testa value " + thx.Assert.q(value) + " should be different";
	thx.Assert.isFalse(expected == value,msg,pos);
};
thx.Assert.equals = function(expected,value,msg,pos) {
	if(msg == null) msg = "expected " + thx.Assert.q(expected) + " but was " + thx.Assert.q(value);
	thx.Assert.isTrue(expected == value,msg,pos);
};
thx.Assert.match = function(pattern,value,msg,pos) {
	if(msg == null) msg = "the value " + thx.Assert.q(value) + "does not match the provided pattern";
	thx.Assert.isTrue(pattern.match(value),msg,pos);
};
thx.Assert.floatEquals = function(expected,value,approx,msg,pos) {
	if(msg == null) msg = "expected " + thx.Assert.q(expected) + " but was " + thx.Assert.q(value);
	return thx.Assert.isTrue(thx.Assert._floatEquals(expected,value,approx),msg,pos);
};
thx.Assert._floatEquals = function(expected,value,approx) {
	if(isNaN(expected)) return isNaN(value); else if(isNaN(value)) return false; else if(!isFinite(expected) && !isFinite(value)) return expected > 0 == value > 0;
	if(null == approx) approx = 1e-5;
	return Math.abs(value - expected) < approx;
};
thx.Assert.getTypeName = function(v) {
	{
		var _g = Type["typeof"](v);
		switch(_g[1]) {
		case 0:
			return "[null]";
		case 1:
			return "Int";
		case 2:
			return "Float";
		case 3:
			return "Bool";
		case 5:
			return "function";
		case 6:
			var c = _g[2];
			return Type.getClassName(c);
		case 7:
			var e = _g[2];
			return Type.getEnumName(e);
		case 4:
			return "Object";
		case 8:
			return "Unknown";
		}
	}
};
thx.Assert.isIterable = function(v,isAnonym) {
	var fields;
	if(isAnonym) fields = Reflect.fields(v); else fields = Type.getInstanceFields(Type.getClass(v));
	if(!Lambda.has(fields,"iterator")) return false;
	return Reflect.isFunction(Reflect.field(v,"iterator"));
};
thx.Assert.isIterator = function(v,isAnonym) {
	var fields;
	if(isAnonym) fields = Reflect.fields(v); else fields = Type.getInstanceFields(Type.getClass(v));
	if(!Lambda.has(fields,"next") || !Lambda.has(fields,"hasNext")) return false;
	return Reflect.isFunction(Reflect.field(v,"next")) && Reflect.isFunction(Reflect.field(v,"hasNext"));
};
thx.Assert.sameAs = function(expected,value,status) {
	var texpected = thx.Assert.getTypeName(expected);
	var tvalue = thx.Assert.getTypeName(value);
	if(texpected != tvalue) {
		status.error = "expected type " + texpected + " but it is " + tvalue + (status.path == ""?"":" for field " + status.path);
		return false;
	}
	{
		var _g = Type["typeof"](expected);
		switch(_g[1]) {
		case 2:
			if(!thx.Assert._floatEquals(expected,value)) {
				status.error = "expected " + thx.Assert.q(expected) + " but it is " + thx.Assert.q(value) + (status.path == ""?"":" for field " + status.path);
				return false;
			}
			return true;
		case 0:case 1:case 3:
			if(expected != value) {
				status.error = "expected " + thx.Assert.q(expected) + " but it is " + thx.Assert.q(value) + (status.path == ""?"":" for field " + status.path);
				return false;
			}
			return true;
		case 5:
			if(!Reflect.compareMethods(expected,value)) {
				status.error = "expected same function reference" + (status.path == ""?"":" for field " + status.path);
				return false;
			}
			return true;
		case 6:
			var c = _g[2];
			var cexpected = Type.getClassName(c);
			var cvalue = Type.getClassName(Type.getClass(value));
			if(cexpected != cvalue) {
				status.error = "expected instance of " + thx.Assert.q(cexpected) + " but it is " + thx.Assert.q(cvalue) + (status.path == ""?"":" for field " + status.path);
				return false;
			}
			if(typeof(expected) == "string" && expected != value) {
				status.error = "expected '" + Std.string(expected) + "' but it is '" + Std.string(value) + "'";
				return false;
			}
			if((expected instanceof Array) && expected.__enum__ == null) {
				if(status.recursive || status.path == "") {
					if(expected.length != value.length) {
						status.error = "expected " + Std.string(expected.length) + " elements but they were " + Std.string(value.length) + (status.path == ""?"":" for field " + status.path);
						return false;
					}
					var path = status.path;
					var _g2 = 0;
					var _g1 = expected.length;
					while(_g2 < _g1) {
						var i = _g2++;
						if(path == "") status.path = "array[" + i + "]"; else status.path = path + "[" + i + "]";
						if(!thx.Assert.sameAs(expected[i],value[i],status)) {
							status.error = "expected " + thx.Assert.q(expected) + " but it is " + thx.Assert.q(value) + (status.path == ""?"":" for field " + status.path);
							return false;
						}
					}
				}
				return true;
			}
			if(js.Boot.__instanceof(expected,Date)) {
				if(expected.getTime() != value.getTime()) {
					status.error = "expected " + thx.Assert.q(expected) + " but it is " + thx.Assert.q(value) + (status.path == ""?"":" for field " + status.path);
					return false;
				}
				return true;
			}
			if(js.Boot.__instanceof(expected,haxe.io.Bytes)) {
				if(status.recursive || status.path == "") {
					var ebytes = expected;
					var vbytes = value;
					if(ebytes.length != vbytes.length) return false;
					var _g21 = 0;
					var _g11 = ebytes.length;
					while(_g21 < _g11) {
						var i1 = _g21++;
						if(ebytes.b[i1] != vbytes.b[i1]) {
							status.error = "expected byte " + ebytes.b[i1] + " but wss " + ebytes.b[i1] + (status.path == ""?"":" for field " + status.path);
							return false;
						}
					}
				}
				return true;
			}
			if(js.Boot.__instanceof(expected,haxe.ds.StringMap) || js.Boot.__instanceof(expected,haxe.ds.IntMap)) {
				if(status.recursive || status.path == "") {
					var keys = Lambda.array({ iterator : function() {
						return expected.keys();
					}});
					var vkeys = Lambda.array({ iterator : function() {
						return value.keys();
					}});
					if(keys.length != vkeys.length) {
						status.error = "expected " + keys.length + " keys but they were " + vkeys.length + (status.path == ""?"":" for field " + status.path);
						return false;
					}
					var path1 = status.path;
					var _g12 = 0;
					while(_g12 < keys.length) {
						var key = keys[_g12];
						++_g12;
						if(path1 == "") status.path = "hash[" + key + "]"; else status.path = path1 + "[" + key + "]";
						if(!thx.Assert.sameAs(expected.get(key),value.get(key),status)) {
							status.error = "expected " + thx.Assert.q(expected) + " but it is " + thx.Assert.q(value) + (status.path == ""?"":" for field " + status.path);
							return false;
						}
					}
				}
				return true;
			}
			if(thx.Assert.isIterator(expected,false)) {
				if(status.recursive || status.path == "") {
					var evalues = Lambda.array({ iterator : function() {
						return expected;
					}});
					var vvalues = Lambda.array({ iterator : function() {
						return value;
					}});
					if(evalues.length != vvalues.length) {
						status.error = "expected " + evalues.length + " values in Iterator but they were " + vvalues.length + (status.path == ""?"":" for field " + status.path);
						return false;
					}
					var path2 = status.path;
					var _g22 = 0;
					var _g13 = evalues.length;
					while(_g22 < _g13) {
						var i2 = _g22++;
						if(path2 == "") status.path = "iterator[" + i2 + "]"; else status.path = path2 + "[" + i2 + "]";
						if(!thx.Assert.sameAs(evalues[i2],vvalues[i2],status)) {
							status.error = "expected " + thx.Assert.q(expected) + " but it is " + thx.Assert.q(value) + (status.path == ""?"":" for field " + status.path);
							return false;
						}
					}
				}
				return true;
			}
			if(thx.Assert.isIterable(expected,false)) {
				if(status.recursive || status.path == "") {
					var evalues1 = Lambda.array(expected);
					var vvalues1 = Lambda.array(value);
					if(evalues1.length != vvalues1.length) {
						status.error = "expected " + evalues1.length + " values in Iterable but they were " + vvalues1.length + (status.path == ""?"":" for field " + status.path);
						return false;
					}
					var path3 = status.path;
					var _g23 = 0;
					var _g14 = evalues1.length;
					while(_g23 < _g14) {
						var i3 = _g23++;
						if(path3 == "") status.path = "iterable[" + i3 + "]"; else status.path = path3 + "[" + i3 + "]";
						if(!thx.Assert.sameAs(evalues1[i3],vvalues1[i3],status)) return false;
					}
				}
				return true;
			}
			if(status.recursive || status.path == "") {
				var fields = Type.getInstanceFields(Type.getClass(expected));
				var path4 = status.path;
				var _g15 = 0;
				while(_g15 < fields.length) {
					var field = fields[_g15];
					++_g15;
					if(path4 == "") status.path = field; else status.path = path4 + "." + field;
					var e = Reflect.field(expected,field);
					if(Reflect.isFunction(e)) continue;
					var v = Reflect.field(value,field);
					if(!thx.Assert.sameAs(e,v,status)) return false;
				}
			}
			return true;
		case 7:
			var e1 = _g[2];
			var eexpected = Type.getEnumName(e1);
			var evalue = Type.getEnumName(Type.getEnum(value));
			if(eexpected != evalue) {
				status.error = "expected enumeration of " + thx.Assert.q(eexpected) + " but it is " + thx.Assert.q(evalue) + (status.path == ""?"":" for field " + status.path);
				return false;
			}
			if(status.recursive || status.path == "") {
				if(Type.enumIndex(expected) != Type.enumIndex(value)) {
					status.error = "expected " + thx.Assert.q(Type.enumConstructor(expected)) + " but is " + thx.Assert.q(Type.enumConstructor(value)) + (status.path == ""?"":" for field " + status.path);
					return false;
				}
				var eparams = Type.enumParameters(expected);
				var vparams = Type.enumParameters(value);
				var path5 = status.path;
				var _g24 = 0;
				var _g16 = eparams.length;
				while(_g24 < _g16) {
					var i4 = _g24++;
					if(path5 == "") status.path = "enum[" + i4 + "]"; else status.path = path5 + "[" + i4 + "]";
					if(!thx.Assert.sameAs(eparams[i4],vparams[i4],status)) {
						status.error = "expected " + thx.Assert.q(expected) + " but it is " + thx.Assert.q(value) + (status.path == ""?"":" for field " + status.path);
						return false;
					}
				}
			}
			return true;
		case 4:
			if(status.recursive || status.path == "") {
				var tfields = Reflect.fields(value);
				var fields1 = Reflect.fields(expected);
				var path6 = status.path;
				var _g17 = 0;
				while(_g17 < fields1.length) {
					var field1 = fields1[_g17];
					++_g17;
					HxOverrides.remove(tfields,field1);
					if(path6 == "") status.path = field1; else status.path = path6 + "." + field1;
					if(!Object.prototype.hasOwnProperty.call(value,field1)) {
						status.error = "expected field " + status.path + " does not exist in " + thx.Assert.q(value);
						return false;
					}
					var e2 = Reflect.field(expected,field1);
					if(Reflect.isFunction(e2)) continue;
					var v1 = Reflect.field(value,field1);
					if(!thx.Assert.sameAs(e2,v1,status)) return false;
				}
				if(tfields.length > 0) {
					status.error = "the tested object has extra field(s) (" + tfields.join(", ") + ") not included in the expected ones";
					return false;
				}
			}
			if(thx.Assert.isIterator(expected,true)) {
				if(!thx.Assert.isIterator(value,true)) {
					status.error = "expected Iterable but it is not " + (status.path == ""?"":" for field " + status.path);
					return false;
				}
				if(status.recursive || status.path == "") {
					var evalues2 = Lambda.array({ iterator : function() {
						return expected;
					}});
					var vvalues2 = Lambda.array({ iterator : function() {
						return value;
					}});
					if(evalues2.length != vvalues2.length) {
						status.error = "expected " + evalues2.length + " values in Iterator but they were " + vvalues2.length + (status.path == ""?"":" for field " + status.path);
						return false;
					}
					var path7 = status.path;
					var _g25 = 0;
					var _g18 = evalues2.length;
					while(_g25 < _g18) {
						var i5 = _g25++;
						if(path7 == "") status.path = "iterator[" + i5 + "]"; else status.path = path7 + "[" + i5 + "]";
						if(!thx.Assert.sameAs(evalues2[i5],vvalues2[i5],status)) {
							status.error = "expected " + thx.Assert.q(expected) + " but it is " + thx.Assert.q(value) + (status.path == ""?"":" for field " + status.path);
							return false;
						}
					}
				}
				return true;
			}
			if(thx.Assert.isIterable(expected,true)) {
				if(!thx.Assert.isIterable(value,true)) {
					status.error = "expected Iterator but it is not " + (status.path == ""?"":" for field " + status.path);
					return false;
				}
				if(status.recursive || status.path == "") {
					var evalues3 = Lambda.array(expected);
					var vvalues3 = Lambda.array(value);
					if(evalues3.length != vvalues3.length) {
						status.error = "expected " + evalues3.length + " values in Iterable but they were " + vvalues3.length + (status.path == ""?"":" for field " + status.path);
						return false;
					}
					var path8 = status.path;
					var _g26 = 0;
					var _g19 = evalues3.length;
					while(_g26 < _g19) {
						var i6 = _g26++;
						if(path8 == "") status.path = "iterable[" + i6 + "]"; else status.path = path8 + "[" + i6 + "]";
						if(!thx.Assert.sameAs(evalues3[i6],vvalues3[i6],status)) return false;
					}
				}
				return true;
			}
			return true;
		case 8:
			throw "Unable to compare two unknown types";
			break;
		}
	}
	throw "Unable to compare values: " + thx.Assert.q(expected) + " and " + thx.Assert.q(value);
};
thx.Assert.q = function(v) {
	if(typeof(v) == "string") return "\"" + StringTools.replace(v,"\"","\\\"") + "\""; else return Std.string(v);
};
thx.Assert.same = function(expected,value,recursive,msg,pos) {
	var status = { recursive : null == recursive?true:recursive, path : "", error : null};
	if(thx.Assert.sameAs(expected,value,status)) thx.Assert.isTrue(true,msg,pos); else thx.Assert.fail(msg == null?status.error:msg,pos);
};
thx.Assert.raises = function(method,type,msgNotThrown,msgWrongType,pos) {
	if(type == null) type = String;
	try {
		method();
		var name = Type.getClassName(type);
		if(name == null) name = "" + Std.string(type);
		if(null == msgNotThrown) msgNotThrown = "exception of type " + name + " not raised";
		thx.Assert.fail(msgNotThrown,pos);
	} catch( ex ) {
		var name1 = Type.getClassName(type);
		if(name1 == null) name1 = "" + Std.string(type);
		if(null == msgWrongType) msgWrongType = "expected throw of type " + name1 + " but was " + Std.string(ex);
		thx.Assert.isTrue(js.Boot.__instanceof(ex,type),msgWrongType,pos);
	}
};
thx.Assert.allows = function(possibilities,value,msg,pos) {
	if(Lambda.has(possibilities,value)) thx.Assert.isTrue(true,msg,pos); else thx.Assert.fail(msg == null?"value " + thx.Assert.q(value) + " not found in the expected possibilities " + Std.string(possibilities):msg,pos);
};
thx.Assert.contains = function(match,values,msg,pos) {
	if(Lambda.has(values,match)) thx.Assert.isTrue(true,msg,pos); else thx.Assert.fail(msg == null?"values " + thx.Assert.q(values) + " do not contain " + Std.string(match):msg,pos);
};
thx.Assert.notContains = function(match,values,msg,pos) {
	if(!Lambda.has(values,match)) thx.Assert.isTrue(true,msg,pos); else thx.Assert.fail(msg == null?"values " + thx.Assert.q(values) + " do contain " + Std.string(match):msg,pos);
};
thx.Assert.stringContains = function(match,value,msg,pos) {
	if(value != null && value.indexOf(match) >= 0) thx.Assert.isTrue(true,msg,pos); else thx.Assert.fail(msg == null?"value " + thx.Assert.q(value) + " does not contain " + thx.Assert.q(match):msg,pos);
};
thx.Assert.stringSequence = function(sequence,value,msg,pos) {
	if(null == value) {
		thx.Assert.fail(msg == null?"null argument value":msg,pos);
		return;
	}
	var p = 0;
	var _g = 0;
	while(_g < sequence.length) {
		var s = sequence[_g];
		++_g;
		var p2 = value.indexOf(s,p);
		if(p2 < 0) {
			if(msg == null) {
				msg = "expected '" + s + "' after ";
				if(p > 0) {
					var cut = HxOverrides.substr(value,0,p);
					if(cut.length > 30) cut = "..." + HxOverrides.substr(cut,-27,null);
					msg += " '" + cut + "'";
				} else msg += " begin";
			}
			thx.Assert.fail(msg,pos);
			return;
		}
		p = p2 + s.length;
	}
	thx.Assert.isTrue(true,msg,pos);
};
thx.Assert.fail = function(msg,pos) {
	if(msg == null) msg = "failure expected";
	thx.Assert.isTrue(false,msg,pos);
};
thx.Assert.warn = function(msg) {
	thx.Assert.results.add(thx.core.Assertion.Warning(msg));
};
thx.Assert.createAsync = function(f,timeout) {
	return function() {
	};
};
thx.Assert.createEvent = function(f,timeout) {
	return function(e) {
	};
};
thx.Assert.typeToString = function(t) {
	try {
		var _t = Type.getClass(t);
		if(_t != null) t = _t;
	} catch( e ) {
	}
	try {
		return Type.getClassName(t);
	} catch( e1 ) {
	}
	try {
		var _t1 = Type.getEnum(t);
		if(_t1 != null) t = _t1;
	} catch( e2 ) {
	}
	try {
		return Type.getEnumName(t);
	} catch( e3 ) {
	}
	try {
		return Std.string(Type["typeof"](t));
	} catch( e4 ) {
	}
	try {
		return Std.string(t);
	} catch( e5 ) {
	}
	return "<unable to retrieve type name>";
};
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
thx.core.Assertion = { __ename__ : ["thx","core","Assertion"], __constructs__ : ["Success","Failure","Error","PreConditionError","PostConditionError","Warning"] };
thx.core.Assertion.Success = function(pos) { var $x = ["Success",0,pos]; $x.__enum__ = thx.core.Assertion; $x.toString = $estr; return $x; };
thx.core.Assertion.Failure = function(msg,pos) { var $x = ["Failure",1,msg,pos]; $x.__enum__ = thx.core.Assertion; $x.toString = $estr; return $x; };
thx.core.Assertion.Error = function(e,stack) { var $x = ["Error",2,e,stack]; $x.__enum__ = thx.core.Assertion; $x.toString = $estr; return $x; };
thx.core.Assertion.PreConditionError = function(e,stack) { var $x = ["PreConditionError",3,e,stack]; $x.__enum__ = thx.core.Assertion; $x.toString = $estr; return $x; };
thx.core.Assertion.PostConditionError = function(e,stack) { var $x = ["PostConditionError",4,e,stack]; $x.__enum__ = thx.core.Assertion; $x.toString = $estr; return $x; };
thx.core.Assertion.Warning = function(msg) { var $x = ["Warning",5,msg]; $x.__enum__ = thx.core.Assertion; $x.toString = $estr; return $x; };
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
	parent: null
	,getRoot: function() {
		var ref = this;
		while(!js.Boot.__instanceof(ref.parent,thx.ref.EmptyParent)) ref = ref.parent;
		return ref;
	}
	,__class__: thx.ref.BaseRef
};
thx.ref.IParentRef = function() { };
thx.ref.IParentRef.__name__ = ["thx","ref","IParentRef"];
thx.ref.IParentRef.prototype = {
	removeChild: null
	,__class__: thx.ref.IParentRef
};
thx.ref.IRef = function() { };
thx.ref.IRef.__name__ = ["thx","ref","IRef"];
thx.ref.IRef.prototype = {
	parent: null
	,get: null
	,set: null
	,remove: null
	,hasValue: null
	,resolve: null
	,getRoot: null
	,__class__: thx.ref.IRef
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
	items: null
	,inverse: null
	,get: function() {
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
	fields: null
	,inverse: null
	,get: function() {
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
	ref: null
	,hasRef: null
	,get: function() {
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
	_hasValue: null
	,value: null
	,get: function() {
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
ui.AnchorPoint = { __ename__ : ["ui","AnchorPoint"], __constructs__ : ["TopLeft","Top","TopRight","Left","Center","Right","BottomLeft","Bottom","BottomRight"] };
ui.AnchorPoint.TopLeft = ["TopLeft",0];
ui.AnchorPoint.TopLeft.toString = $estr;
ui.AnchorPoint.TopLeft.__enum__ = ui.AnchorPoint;
ui.AnchorPoint.Top = ["Top",1];
ui.AnchorPoint.Top.toString = $estr;
ui.AnchorPoint.Top.__enum__ = ui.AnchorPoint;
ui.AnchorPoint.TopRight = ["TopRight",2];
ui.AnchorPoint.TopRight.toString = $estr;
ui.AnchorPoint.TopRight.__enum__ = ui.AnchorPoint;
ui.AnchorPoint.Left = ["Left",3];
ui.AnchorPoint.Left.toString = $estr;
ui.AnchorPoint.Left.__enum__ = ui.AnchorPoint;
ui.AnchorPoint.Center = ["Center",4];
ui.AnchorPoint.Center.toString = $estr;
ui.AnchorPoint.Center.__enum__ = ui.AnchorPoint;
ui.AnchorPoint.Right = ["Right",5];
ui.AnchorPoint.Right.toString = $estr;
ui.AnchorPoint.Right.__enum__ = ui.AnchorPoint;
ui.AnchorPoint.BottomLeft = ["BottomLeft",6];
ui.AnchorPoint.BottomLeft.toString = $estr;
ui.AnchorPoint.BottomLeft.__enum__ = ui.AnchorPoint;
ui.AnchorPoint.Bottom = ["Bottom",7];
ui.AnchorPoint.Bottom.toString = $estr;
ui.AnchorPoint.Bottom.__enum__ = ui.AnchorPoint;
ui.AnchorPoint.BottomRight = ["BottomRight",8];
ui.AnchorPoint.BottomRight.toString = $estr;
ui.AnchorPoint.BottomRight.__enum__ = ui.AnchorPoint;
ui.Article = function(options) {
	if(null == options.el && null == options.template) options.template = "<article></article>";
	this.component = new sui.components.Component(options);
	this.fragments = new haxe.ds.ObjectMap();
	this.current = new steamer.MultiProducer();
};
ui.Article.__name__ = ["ui","Article"];
ui.Article.prototype = {
	component: null
	,current: null
	,fragments: null
	,addFragment: function(fragment) {
		var _g = this;
		var addFocus = fragment.focus.filter(function(v) {
			return v;
		}).map(function(_) {
			return fragment;
		});
		this.current.add(addFocus);
		this.fragments.set(fragment,function() {
			_g.current.remove(addFocus);
		});
	}
	,addBlock: function() {
		var fragment = new ui.Block({ parent : this.component, container : this.component.el, defaultText : "block"});
		this.addFragment(fragment);
		return fragment;
	}
	,addReadonly: function() {
		var fragment = new ui.ReadonlyBlock({ parent : this.component, container : this.component.el});
		this.addFragment(fragment);
		return fragment;
	}
	,removeFragment: function(fragment) {
		var finalizer = this.fragments.h[fragment.__id__];
		thx.Assert.notNull(finalizer,null,{ fileName : "Article.hx", lineNumber : 57, className : "ui.Article", methodName : "removeFragment"});
		finalizer();
	}
	,__class__: ui.Article
};
ui.Fragment = function() { };
ui.Fragment.__name__ = ["ui","Fragment"];
ui.Fragment.prototype = {
	name: null
	,component: null
	,focus: null
	,toString: null
	,__class__: ui.Fragment
};
ui.Block = function(options) {
	this.name = "block";
	if(null == options.el && null == options.template) options.template = "<section class=\"block\"></div>";
	this.editor = new ui.TextEditor(options);
	this.classActive = new sui.properties.ToggleClass(this.editor.component,"active");
	this.editor.focus.feed(this.classActive.stream);
	this.focus = this.editor.focus;
	this.component = this.editor.component;
};
ui.Block.__name__ = ["ui","Block"];
ui.Block.__interfaces__ = [ui.Fragment];
ui.Block.prototype = {
	name: null
	,editor: null
	,component: null
	,focus: null
	,classActive: null
	,destroy: function() {
		this.editor.destroy();
	}
	,toString: function() {
		return this.name;
	}
	,__class__: ui.Block
};
ui.Button = function(text,icon) {
	if(text == null) text = "";
	var _g = this;
	this.component = new sui.components.Component({ template : null == icon?"<button>" + text + "</button>":"<button class=\"fa fa-" + icon + "\">" + text + "</button>"});
	var pair = steamer.dom.Dom.produceEvent(this.component.el,"click");
	this.clicks = pair.producer;
	this.cancel = pair.cancel;
	this.enabled = new steamer.Value(true);
	this.enabled.feed((function($this) {
		var $r;
		var f = function(value) {
			if(value) _g.component.el.removeAttribute("disabled"); else _g.component.el.setAttribute("disabled","disabled");
		};
		$r = { onPulse : function(pulse) {
			switch(pulse[1]) {
			case 0:
				var v = pulse[2];
				f(v);
				break;
			default:
			}
		}};
		return $r;
	}(this)));
};
ui.Button.__name__ = ["ui","Button"];
ui.Button.prototype = {
	component: null
	,clicks: null
	,enabled: null
	,cancel: null
	,destroy: function() {
		this.cancel();
		this.component.destroy();
	}
	,__class__: ui.Button
};
ui.Card = function() { };
ui.Card.__name__ = ["ui","Card"];
ui.Card.create = function(model,container) {
	var card = new sui.components.Component({ template : "<div class=\"card\"><div class=\"doc\"></div><aside><div class=\"context\"></div><div class=\"model\"></div></aside></div>"});
	var context = dom.Query.first(".context",card.el);
	var modelView = new ui.ModelView();
	var document = new ui.Document({ el : dom.Query.first(".doc",card.el)});
	var context1 = new ui.Context({ el : dom.Query.first(".context",card.el)});
	document.article.current.feed(context1.fragments);
	document.article.current.feed(document.fragments);
	modelView.component.appendTo(dom.Query.first(".model",card.el));
	modelView.schema.feed(model.schemaEventConsumer);
	modelView.data.feed(model.dataEventConsumer);
	card.appendTo(container);
	model.data.stream.map(function(o) {
		return JSON.stringify(o);
	}).feed((function($this) {
		var $r;
		var consumer = new steamer.consumers.LoggerConsumer(null,{ fileName : "Card.hx", lineNumber : 28, className : "ui.Card", methodName : "create"});
		$r = consumer;
		return $r;
	}(this)));
};
ui.Context = function(options) {
	var _g = this;
	this.component = new sui.components.Component(options);
	this.toolbar = new ui.Toolbar({ parent : this.component, container : this.component.el});
	this.fieldsEl = dom.Html.parseList("<div class=\"fields\"><div></div></div>")[0];
	this.component.el.appendChild(this.fieldsEl);
	this.fieldsEl = dom.Query.first("div",this.fieldsEl);
	this.buttonAdd = this.toolbar.left.addButton("add property",Config.icons.dropDown);
	this.menuAdd = new ui.Menu({ parent : this.component});
	this.menuAdd.anchorTo(this.buttonAdd.component.el);
	this.buttonAdd.clicks.map(function(_) {
		return true;
	}).feed(this.menuAdd.visible.stream);
	var f = $bind(this,this.setFragmentStatus);
	this.fragments = { onPulse : function(pulse) {
		switch(pulse[1]) {
		case 0:
			var v = pulse[2];
			f(v);
			break;
		default:
		}
	}};
	this.buttonAdd.enabled.set_value(false);
	this.buttonRemove = this.toolbar.right.addButton("",Config.icons.remove);
	this.buttonRemove.enabled.set_value(false);
	this.buttonRemove.clicks.feed((function($this) {
		var $r;
		var f1 = function(_1) {
			{
				var _g1 = _g.field.get_value();
				switch(_g1[1]) {
				case 0:
					var field = _g1[2];
					_g.currentFragment.component.properties.get(field.name).dispose();
					field.destroy();
					_g.setAddMenuItems(_g.currentFragment);
					break;
				default:
				}
			}
		};
		$r = { onPulse : function(pulse1) {
			switch(pulse1[1]) {
			case 0:
				var v1 = pulse1[2];
				f1(v1);
				break;
			default:
			}
		}};
		return $r;
	}(this)));
	this.field = new steamer.Value(haxe.ds.Option.None);
	this.field.feed((function($this) {
		var $r;
		var f2 = function(option) {
			switch(option[1]) {
			case 0:
				var field1 = option[2];
				_g.buttonRemove.enabled.set_value(true);
				break;
			case 1:
				_g.buttonRemove.enabled.set_value(false);
				break;
			}
		};
		$r = { onPulse : function(pulse2) {
			switch(pulse2[1]) {
			case 0:
				var v2 = pulse2[2];
				f2(v2);
				break;
			default:
			}
		}};
		return $r;
	}(this)));
	this.expressions = new haxe.ds.StringMap();
};
ui.Context.__name__ = ["ui","Context"];
ui.Context.createToggleInfo = function(display,name) {
	return { display : display, name : name, create : function(target,value) {
		var toggle = new sui.properties.ToggleClass(target,name,name);
		value.feed(toggle.stream);
	}, type : ui.SchemaType.BoolType, code : "true", transform : function(v) {
		return !!(v);
	}, defaultf : function() {
		return false;
	}};
};
ui.Context.createTextInfo = function() {
	return { display : "content", name : "text", create : function(target,value) {
		var text = new sui.properties.Text(target,"");
		value.feed(text.stream);
	}, type : ui.SchemaType.StringType, code : "\"franco\"", transform : ui.Context.valueToString, defaultf : function() {
		return "";
	}};
};
ui.Context.valueToString = function(value) {
	if(js.Boot.__instanceof(value,Date)) return HxOverrides.dateStr(value);
	if(typeof(value) == "boolean") if(value) return "Yes"; else return "No";
	if(typeof(value) == "string") return value;
	if((value instanceof Array) && value.__enum__ == null) return value.map(ui.Context.valueToString).join(", ");
	if(Reflect.isObject(value)) return Reflect.fields(value).map(function(field) {
		return "" + field + ": " + ui.Context.valueToString(Reflect.field(value,field));
	}).join(", ");
	return "" + Std.string(value);
};
ui.Context.prototype = {
	component: null
	,toolbar: null
	,fragments: null
	,currentFragment: null
	,fieldsEl: null
	,menuAdd: null
	,buttonAdd: null
	,buttonRemove: null
	,expressions: null
	,field: null
	,setFragmentStatus: function(fragment) {
		this.currentFragment = fragment;
		this.setFields(fragment);
		this.setAddMenuItems(fragment);
	}
	,setFields: function(fragment) {
		this.fieldsEl.innerHTML = "";
		var fields = this.getAttachedPropertiesForFragment(fragment);
		fields.map($bind(this,this.addField));
	}
	,addField: function(fieldInfo) {
		var pair = this.expressions.get(fieldInfo.name);
		var f = new ui.ContextField({ container : this.fieldsEl, parent : this.component, display : fieldInfo.display, name : fieldInfo.name, value : null == pair.code.get_value()?fieldInfo.code:pair.code.get_value()});
		f.focus.map(function(v) {
			if(v) return haxe.ds.Option.Some(f); else return haxe.ds.Option.None;
		}).feed(this.field);
		var expression = pair.expression;
		var exp = f.value.text.debounce(250).distinct().map(function(code) {
			return ui.Expressions.toExpression(code);
		});
		f.value.text.feed(pair.code);
		var mixed = exp.merge(expression);
		mixed.map(function(e) {
			switch(e[1]) {
			case 0:
				var f1 = e[2];
				return haxe.ds.Option.None;
			case 1:
				var e1 = e[2];
				return haxe.ds.Option.Some(e1);
			case 2:
				var e2 = e[2];
				return haxe.ds.Option.Some(e2);
			}
		}).feed(f.withError);
		exp.feed(expression);
	}
	,setAddMenuItems: function(fragment) {
		var _g = this;
		if(null == fragment) {
			this.buttonAdd.enabled.set_value(false);
			return;
		}
		var attachables = this.getAttachablePropertiesForFragment(fragment);
		this.buttonAdd.enabled.set_value(attachables.length > 0);
		this.menuAdd.clear();
		attachables.map(function(fieldInfo) {
			var button = new ui.Button("add " + fieldInfo.display);
			_g.menuAdd.addItem(button.component);
			button.clicks.feed((function($this) {
				var $r;
				var f = function(_) {
					var pair = _g.createFeedExpression(fieldInfo.transform,fieldInfo.defaultf);
					var expression = pair.expression;
					var value = pair.value;
					fieldInfo.create(fragment.component,value);
					var value1 = { expression : expression, code : new steamer.Value(null)};
					_g.expressions.set(fieldInfo.name,value1);
					_g.setFragmentStatus(fragment);
				};
				$r = { onPulse : function(pulse) {
					switch(pulse[1]) {
					case 0:
						var v = pulse[2];
						f(v);
						break;
					default:
					}
				}};
				return $r;
			}(this)));
		});
	}
	,createFeedExpression: function(transform,defaultf) {
		var expression = new steamer.Value(ui.Expression.Fun(defaultf));
		var value = new steamer.Value(null);
		var state = null;
		expression.map(function(exp) {
			switch(exp[1]) {
			case 0:
				var f = exp[2];
				return f;
			default:
				return null;
			}
		}).filter(function(f1) {
			return f1 != null;
		}).filter(function(f2) {
			try {
				state = f2();
				return true;
			} catch( e ) {
				expression.set_value(ui.Expression.RuntimeError(Std.string(e)));
				return false;
			}
		}).map(function(_) {
			return state;
		}).map(transform).feed(value);
		return { expression : expression, value : value};
	}
	,getAttachedPropertiesForFragment: function(fragment) {
		return this.getPropertiesForFragment(fragment).filter(function(fieldInfo) {
			return fragment.component.properties.exists(fieldInfo.name);
		});
	}
	,getAttachablePropertiesForFragment: function(fragment) {
		return this.getPropertiesForFragment(fragment).filter(function(fieldInfo) {
			return !fragment.component.properties.exists(fieldInfo.name);
		});
	}
	,getPropertiesForFragment: function(fragment) {
		var _g = fragment.name;
		switch(_g) {
		case "block":
			return [ui.Context.createToggleInfo("bold","strong"),ui.Context.createToggleInfo("italic","emphasis")];
		case "readonly":
			return [ui.Context.createToggleInfo("bold","strong"),ui.Context.createToggleInfo("italic","emphasis"),ui.Context.createTextInfo()];
		default:
			return [];
		}
	}
	,__class__: ui.Context
};
ui.FrameOverlay = function(options) {
	var _g = this;
	if(null == options.el && null == options.template) options.template = "<div class=\"frame-overlay\"></div>";
	this.component = new sui.components.Component(options);
	this.visible = new sui.properties.Visible(this.component,false);
	var clear = function(_) {
		_g.visible.set_value(false);
	};
	this.visible.stream.filter(function(b) {
		return !b;
	}).feed((function($this) {
		var $r;
		var f = function(_1) {
			window.document.removeEventListener("mouseup",clear,false);
		};
		$r = { onPulse : function(pulse) {
			switch(pulse[1]) {
			case 0:
				var v = pulse[2];
				f(v);
				break;
			default:
			}
		}};
		return $r;
	}(this)));
	this.visible.stream.filter(function(b1) {
		return b1;
	}).feed((function($this) {
		var $r;
		var f1 = function(_2) {
			window.document.addEventListener("mouseup",clear,false);
			_g.reposition();
		};
		$r = { onPulse : function(pulse1) {
			switch(pulse1[1]) {
			case 0:
				var v1 = pulse1[2];
				f1(v1);
				break;
			default:
			}
		}};
		return $r;
	}(this)));
	this.anchorElement = window.document.body;
};
ui.FrameOverlay.__name__ = ["ui","FrameOverlay"];
ui.FrameOverlay.prototype = {
	component: null
	,visible: null
	,anchorElement: null
	,my: null
	,at: null
	,anchorTo: function(el,my,at) {
		this.anchorElement = el;
		if(null == my) this.my = ui.AnchorPoint.TopLeft; else this.my = my;
		if(null == at) this.at = ui.AnchorPoint.BottomLeft; else this.at = at;
		if(this.visible.get_value()) this.reposition();
	}
	,reposition: function() {
		if(!this.component.isAttached) {
			var parent = [dom.Query.first(Config.selectors.app),window.document.body].filter(function(v) {
				return null != v;
			}).shift();
			this.component.appendTo(parent);
		}
		var style = this.component.el.style;
		style.position = "fixed";
		var atrect = this.anchorElement.getBoundingClientRect();
		var myrect = this.component.el.getBoundingClientRect();
		var x = 0.0;
		var y = 0.0;
		var _g = this.at;
		switch(_g[1]) {
		case 0:case 1:case 2:
			y = atrect.top;
			break;
		case 3:case 4:case 5:
			y = atrect.top + atrect.height / 2;
			break;
		case 6:case 7:case 8:
			y = atrect.top + atrect.height;
			break;
		}
		var _g1 = this.at;
		switch(_g1[1]) {
		case 0:case 3:case 6:
			x = atrect.left;
			break;
		case 1:case 4:case 7:
			x = atrect.left + atrect.width / 2;
			break;
		case 2:case 5:case 8:
			x = atrect.left + atrect.width;
			break;
		}
		var _g2 = this.my;
		switch(_g2[1]) {
		case 0:case 1:case 2:
			y -= 0;
			break;
		case 3:case 4:case 5:
			y -= myrect.height / 2;
			break;
		case 6:case 7:case 8:
			y -= myrect.height;
			break;
		}
		var _g3 = this.my;
		switch(_g3[1]) {
		case 0:case 3:case 6:
			x -= 0;
			break;
		case 1:case 4:case 7:
			x -= myrect.width / 2;
			break;
		case 2:case 5:case 8:
			x -= myrect.width;
			break;
		}
		style.top = y + "px";
		style.left = x + "px";
	}
	,__class__: ui.FrameOverlay
};
ui.Tooltip = function(options) {
	ui.FrameOverlay.call(this,options);
};
ui.Tooltip.__name__ = ["ui","Tooltip"];
ui.Tooltip.__super__ = ui.FrameOverlay;
ui.Tooltip.prototype = $extend(ui.FrameOverlay.prototype,{
	setContent: function(html) {
		this.component.el.innerHTML = html;
	}
	,__class__: ui.Tooltip
});
ui.ContextField = function(options) {
	var _g = this;
	if(null == options.template && null == options.el) options.template = "<div class=\"field\"><div class=\"key\"></div><div class=\"value\"></div></div>";
	this.component = new sui.components.Component(options);
	var key = dom.Query.first(".key",this.component.el);
	key.innerText = options.display;
	this.name = options.name;
	this.value = new ui.TextEditor({ el : dom.Query.first(".value",this.component.el), parent : this.component, defaultText : options.value});
	this.focus = this.value.focus.debounce(250).distinct();
	this.classActive = new sui.properties.ToggleClass(this.component,"active");
	this.focus.feed(this.classActive.stream);
	var hasError = steamer.dom.Dom.consumeToggleClass(this.component.el,"error");
	this.withError = new steamer.Value(haxe.ds.Option.None);
	this.withError.map(function(o) {
		switch(o[1]) {
		case 1:
			return false;
		case 0:
			return true;
		}
	}).feed(hasError);
	this.withError.feed((function($this) {
		var $r;
		var f = function(o1) {
			switch(o1[1]) {
			case 0:
				var err = o1[2];
				ui.ContextField.tooltip.setContent(err);
				ui.ContextField.tooltip.anchorTo(_g.component.el,ui.AnchorPoint.Top,ui.AnchorPoint.Bottom);
				ui.ContextField.tooltip.visible.set_value(true);
				break;
			default:
				if(ui.ContextField.tooltip.anchorElement == _g.component.el) ui.ContextField.tooltip.visible.set_value(false);
			}
		};
		$r = { onPulse : function(pulse) {
			switch(pulse[1]) {
			case 0:
				var v = pulse[2];
				f(v);
				break;
			default:
			}
		}};
		return $r;
	}(this)));
};
ui.ContextField.__name__ = ["ui","ContextField"];
ui.ContextField.prototype = {
	component: null
	,value: null
	,focus: null
	,name: null
	,withError: null
	,classActive: null
	,destroy: function() {
		this.classActive.dispose();
		this.component.destroy();
		this.value = null;
		this.focus = null;
	}
	,__class__: ui.ContextField
};
ui.Data = function(data) {
	var _g = this;
	this.feed = function(p) {
	};
	this.stream = new steamer.Producer(function(feed) {
		_g.feed = feed;
	}).debounce(100);
	this.reset(data);
};
ui.Data.__name__ = ["ui","Data"];
ui.Data.prototype = {
	root: null
	,cache: null
	,feed: null
	,stream: null
	,resolve: function(path) {
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
ui.DataEvent = { __ename__ : ["ui","DataEvent"], __constructs__ : ["SetValue"] };
ui.DataEvent.SetValue = function(path,value,type) { var $x = ["SetValue",0,path,value,type]; $x.__enum__ = ui.DataEvent; $x.toString = $estr; return $x; };
ui.Document = function(options) {
	var _g = this;
	this.component = new sui.components.Component(options);
	this.toolbar = new ui.Toolbar({ parent : this.component, container : this.component.el});
	this.article = new ui.Article({ parent : this.component, container : this.component.el});
	this.statusbar = new ui.Statusbar({ parent : this.component, container : this.component.el});
	var buttonRemove = this.toolbar.right.addButton("",Config.icons.remove);
	var setFragment = function(fragment) {
		_g.currentFragment = fragment;
		buttonRemove.enabled.set_value(null != fragment);
	};
	var f = setFragment;
	this.fragments = { onPulse : function(pulse) {
		switch(pulse[1]) {
		case 0:
			var v = pulse[2];
			f(v);
			break;
		default:
		}
	}};
	var buttonAdd = this.toolbar.left.addButton("",Config.icons.add);
	buttonAdd.clicks.feed((function($this) {
		var $r;
		var f1 = function(_) {
			_g.article.addBlock();
		};
		$r = { onPulse : function(pulse1) {
			switch(pulse1[1]) {
			case 0:
				var v1 = pulse1[2];
				f1(v1);
				break;
			default:
			}
		}};
		return $r;
	}(this)));
	buttonRemove.enabled.set_value(false);
	buttonRemove.clicks.feed((function($this) {
		var $r;
		var f2 = function(_1) {
			_g.currentFragment.component.destroy();
			setFragment(null);
		};
		$r = { onPulse : function(pulse2) {
			switch(pulse2[1]) {
			case 0:
				var v2 = pulse2[2];
				f2(v2);
				break;
			default:
			}
		}};
		return $r;
	}(this)));
	this.article.addReadonly();
	this.article.addBlock();
	this.article.addBlock();
	this.article.addBlock();
	this.article.addBlock();
};
ui.Document.__name__ = ["ui","Document"];
ui.Document.prototype = {
	component: null
	,toolbar: null
	,article: null
	,statusbar: null
	,currentFragment: null
	,fragments: null
	,__class__: ui.Document
};
ui.Editor = function() { };
ui.Editor.__name__ = ["ui","Editor"];
ui.Editor.prototype = {
	value: null
	,type: null
	,__class__: ui.Editor
};
ui.Expression = { __ename__ : ["ui","Expression"], __constructs__ : ["Fun","SyntaxError","RuntimeError"] };
ui.Expression.Fun = function(f) { var $x = ["Fun",0,f]; $x.__enum__ = ui.Expression; $x.toString = $estr; return $x; };
ui.Expression.SyntaxError = function(msg) { var $x = ["SyntaxError",1,msg]; $x.__enum__ = ui.Expression; $x.toString = $estr; return $x; };
ui.Expression.RuntimeError = function(msg) { var $x = ["RuntimeError",2,msg]; $x.__enum__ = ui.Expression; $x.toString = $estr; return $x; };
ui.Expressions = function() { };
ui.Expressions.__name__ = ["ui","Expressions"];
ui.Expressions.createFunction = function(args,code) {
	return new Function(args.join(","),code);
};
ui.Expressions.toExpression = function(code) {
	try {
		return ui.Expression.Fun(ui.Expressions.createFunction([],"return " + code));
	} catch( e ) {
		return ui.Expression.SyntaxError(Std.string(e));
	}
};
ui.Menu = function(options) {
	if(null == options.el && null == options.template) options.template = "<menu class=\"frame-overlay\"><ul></ul></menu>";
	ui.FrameOverlay.call(this,options);
	this.ul = dom.Query.first("ul",this.component.el);
	this.items = new haxe.ds.ObjectMap();
};
ui.Menu.__name__ = ["ui","Menu"];
ui.Menu.__super__ = ui.FrameOverlay;
ui.Menu.prototype = $extend(ui.FrameOverlay.prototype,{
	items: null
	,ul: null
	,clear: function() {
		this.ul.innerHTML = "";
		this.items = new haxe.ds.ObjectMap();
	}
	,addItem: function(item) {
		var el;
		var _this = window.document;
		el = _this.createElement("li");
		item.appendTo(el);
		this.component.add(item);
		this.ul.appendChild(el);
		this.items.set(item,el);
	}
	,removeItem: function(item) {
		thx.Assert.notNull(item,null,{ fileName : "Menu.hx", lineNumber : 40, className : "ui.Menu", methodName : "removeItem"});
		thx.Assert.isTrue(this.items.h.__keys__[item.__id__] != null,null,{ fileName : "Menu.hx", lineNumber : 41, className : "ui.Menu", methodName : "removeItem"});
		var el = this.items.h[item.__id__];
		item.detach();
		this.ul.removeChild(el);
	}
	,__class__: ui.Menu
});
ui.Model = function(data) {
	var _g = this;
	this.data = data;
	this.schema = new ui.Schema();
	var f = function(e) {
		{
			var type = e[4];
			var value = e[3];
			var path = e[2];
			data.set(path,value);
		}
	};
	this.dataEventConsumer = { onPulse : function(pulse) {
		switch(pulse[1]) {
		case 0:
			var v = pulse[2];
			f(v);
			break;
		default:
		}
	}};
	var f1 = function(e1) {
		switch(e1[1]) {
		case 0:
			var list = e1[2];
			var $it0 = $iterator(list)();
			while( $it0.hasNext() ) {
				var item = $it0.next();
				_g.schema.add(item.name,item.type);
			}
			break;
		case 1:
			var type1 = e1[3];
			var path1 = e1[2];
			_g.schema.add(path1,type1);
			break;
		case 2:
			var path2 = e1[2];
			_g.schema["delete"](path2);
			data.remove(path2);
			break;
		case 3:
			var newpath = e1[3];
			var oldpath = e1[2];
			_g.schema.rename(oldpath,newpath);
			data.rename(oldpath,newpath);
			break;
		case 4:
			var type2 = e1[3];
			var path3 = e1[2];
			_g.schema.retype(path3,type2);
			break;
		}
	};
	this.schemaEventConsumer = { onPulse : function(pulse1) {
		switch(pulse1[1]) {
		case 0:
			var v1 = pulse1[2];
			f1(v1);
			break;
		default:
		}
	}};
};
ui.Model.__name__ = ["ui","Model"];
ui.Model.prototype = {
	data: null
	,schema: null
	,keys: null
	,dataEventConsumer: null
	,schemaEventConsumer: null
	,get_keys: function() {
		return [];
	}
	,__class__: ui.Model
};
ui.ModelChange = { __ename__ : ["ui","ModelChange"], __constructs__ : [] };
ui.ModelView = function() {
	var _g = this;
	this.component = new sui.components.Component({ template : "<div class=\"modelview\"></div>"});
	this.toolbar = new ui.Toolbar({ });
	this.toolbar.component.appendTo(this.component.el);
	var buttonAdd = this.toolbar.left.addButton("",Config.icons.add);
	buttonAdd.clicks.feed((function($this) {
		var $r;
		var f = function(_) {
			_g.addField(_g.guessFieldName(),ui.SchemaType.StringType);
		};
		$r = { onPulse : function(pulse) {
			switch(pulse[1]) {
			case 0:
				var v = pulse[2];
				f(v);
				break;
			default:
			}
		}};
		return $r;
	}(this)));
	var buttonRemove = this.toolbar.right.addButton("",Config.icons.remove);
	buttonRemove.clicks.feed((function($this) {
		var $r;
		var f1 = function(_1) {
			_g.removeField(_g.currentField);
		};
		$r = { onPulse : function(pulse1) {
			switch(pulse1[1]) {
			case 0:
				var v1 = pulse1[2];
				f1(v1);
				break;
			default:
			}
		}};
		return $r;
	}(this)));
	buttonRemove.enabled.set_value(false);
	this.pairs = dom.Html.parseList("<div class=\"fields\"><div></div></div>")[0];
	this.component.el.appendChild(this.pairs);
	this.pairs = dom.Query.first("div",this.pairs);
	this.feedSchema = function(_2) {
	};
	this.schema = new steamer.Producer(function(feed) {
		_g.feedSchema = feed;
	});
	this.feedData = function(_3) {
	};
	this.data = new steamer.Producer(function(feed1) {
		_g.feedData = feed1;
	});
	this.fields = new haxe.ds.StringMap();
	this.fieldFocus = new steamer.MultiProducer();
	this.fieldFocus.feed((function($this) {
		var $r;
		var f2 = function(field) {
			_g.currentField = field;
			buttonRemove.enabled.set_value(null != field);
		};
		$r = { onPulse : function(pulse2) {
			switch(pulse2[1]) {
			case 0:
				var v2 = pulse2[2];
				f2(v2);
				break;
			default:
			}
		}};
		return $r;
	}(this)));
};
ui.ModelView.__name__ = ["ui","ModelView"];
ui.ModelView.prototype = {
	component: null
	,schema: null
	,data: null
	,toolbar: null
	,currentField: null
	,pairs: null
	,feedSchema: null
	,feedData: null
	,fields: null
	,fieldFocus: null
	,fieldBlur: null
	,guessFieldName: function() {
		var id = 0;
		var prefix = "field";
		var t;
		var assemble = function(id1) {
			if(id1 > 0) return [prefix,"" + id1].join("_"); else return prefix;
		};
		while((function($this) {
			var $r;
			var key = t = assemble(id);
			$r = $this.fields.exists(key);
			return $r;
		}(this))) id++;
		return t;
	}
	,removeFieldByName: function(name) {
		var field = this.fields.get(name);
		this.removeField(field);
	}
	,removeField: function(field) {
		thx.Assert.notNull(field,"when removing a field it should not be null",{ fileName : "ModelView.hx", lineNumber : 92, className : "ui.ModelView", methodName : "removeField"});
		var name = field.key.text.get_value();
		field.destroy();
		if(this.fields.remove(name)) this.feedSchema(steamer.Pulse.Emit(ui.SchemaEvent.DeleteField(name)));
	}
	,addField: function(name,type) {
		var _g = this;
		var field = new ui.ModelViewField({ container : this.pairs, parent : this.component, key : name});
		var oldname = null;
		var createSetValue = function() {
			return ui.DataEvent.SetValue(field.key.text.get_value(),field.value.value.get_value(),field.value.type);
		};
		field.key.text.filter(function(newname) {
			if(_g.fields.exists(newname)) {
				field.key.text.set_value(oldname);
				return false;
			} else return true;
		}).map(function(newname1) {
			if(null == oldname) {
				oldname = newname1;
				return ui.SchemaEvent.AddField(newname1,field.value.type);
			} else {
				var v = _g.fields.get(oldname);
				_g.fields.remove(oldname);
				_g.fields.set(newname1,v);
				var r = ui.SchemaEvent.RenameField(oldname,newname1);
				oldname = newname1;
				return r;
			}
		}).feed((function($this) {
			var $r;
			var consumer = steamer.Bus.feed($this.feedSchema);
			$r = consumer;
			return $r;
		}(this)));
		field.value.text.map(function(_) {
			return createSetValue();
		}).debounce(250).feed((function($this) {
			var $r;
			var consumer1 = steamer.Bus.feed($this.feedData);
			$r = consumer1;
			return $r;
		}(this)));
		this.fieldFocus.add(field.focus.map(function(v1) {
			if(v1) return field; else return null;
		}));
		this.fields.set(name,field);
	}
	,__class__: ui.ModelView
};
ui.ModelViewField = function(options) {
	if(null == options.template && null == options.el) options.template = "<div class=\"field\"><div class=\"key\"></div><div class=\"value\"></div></div>";
	this.component = new sui.components.Component(options);
	this.key = new ui.TextEditor({ el : dom.Query.first(".key",this.component.el), parent : this.component, defaultText : options.key});
	this.value = new ui.TextEditor({ el : dom.Query.first(".value",this.component.el), parent : this.component, defaultText : ""});
	var f = this.key.focus.merge(this.value.focus);
	this.focus = f.debounce(250).distinct();
	this.classActive = new sui.properties.ToggleClass(this.component,"active");
	f.feed(this.classActive.stream);
};
ui.ModelViewField.__name__ = ["ui","ModelViewField"];
ui.ModelViewField.prototype = {
	component: null
	,key: null
	,value: null
	,focus: null
	,classActive: null
	,destroy: function() {
		this.classActive.dispose();
		this.component.destroy();
		this.key = null;
		this.value = null;
		this.focus = null;
	}
	,__class__: ui.ModelViewField
};
ui.ReadonlyBlock = function(options) {
	this.name = "readonly";
	var _g = this;
	if(null == options.el && null == options.template) options.template = "<section class=\"readonly block\" tabindex=\"0\">readonly</div>";
	this.component = new sui.components.Component(options);
	this.focus = new steamer.Value(false);
	this.focusEvent = steamer.dom.Dom.produceEvent(this.component.el,"focus");
	this.blurEvent = steamer.dom.Dom.produceEvent(this.component.el,"blur");
	this.focusEvent.producer.map(function(_) {
		return true;
	}).merge(this.blurEvent.producer.map(function(_1) {
		return false;
	})).feed(this.focus);
	this.focus.feed((function($this) {
		var $r;
		var f = function(focused) {
			if(focused) _g.component.el.classList.add("active"); else _g.component.el.classList.remove("active");
		};
		$r = { onPulse : function(pulse) {
			switch(pulse[1]) {
			case 0:
				var v = pulse[2];
				f(v);
				break;
			default:
			}
		}};
		return $r;
	}(this)));
};
ui.ReadonlyBlock.__name__ = ["ui","ReadonlyBlock"];
ui.ReadonlyBlock.__interfaces__ = [ui.Fragment];
ui.ReadonlyBlock.prototype = {
	name: null
	,component: null
	,focus: null
	,focusEvent: null
	,blurEvent: null
	,destroy: function() {
		this.focusEvent.cancel();
		this.blurEvent.cancel();
		this.component.destroy();
	}
	,toString: function() {
		return this.name;
	}
	,__class__: ui.ReadonlyBlock
};
ui.Schema = function() {
	var _g = this;
	this.fields = new haxe.ds.StringMap();
	this.feed = function(_) {
	};
	this.stream = new ui.SchemaProducer($bind(this,this.getPairs),function(feed) {
		_g.feed = feed;
	});
};
ui.Schema.__name__ = ["ui","Schema"];
ui.Schema.prototype = {
	fields: null
	,stream: null
	,feed: null
	,add: function(name,type) {
		if(this.fields.exists(name)) throw new thx.Error("Schema already contains a field \"" + name + "\"",null,{ fileName : "Schema.hx", lineNumber : 26, className : "ui.Schema", methodName : "add"});
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
		if(!this.fields.exists(name)) throw new thx.Error("Schema does not contain a field \"" + name + "\"",null,{ fileName : "Schema.hx", lineNumber : 43, className : "ui.Schema", methodName : "delete"});
		this.fields.remove(name);
		this.feed(steamer.Pulse.Emit(ui.SchemaEvent.DeleteField(name)));
	}
	,rename: function(oldname,newname) {
		if(!this.fields.exists(oldname)) throw new thx.Error("Schema does not contain a field \"" + oldname + "\"",null,{ fileName : "Schema.hx", lineNumber : 50, className : "ui.Schema", methodName : "rename"});
		var type = this.fields.get(oldname);
		this.fields.remove(oldname);
		this.fields.set(newname,type);
		this.feed(steamer.Pulse.Emit(ui.SchemaEvent.RenameField(oldname,newname)));
	}
	,retype: function(name,type) {
		if(!this.fields.exists(name)) throw new thx.Error("Schema does not contain a field \"" + name + "\"",null,{ fileName : "Schema.hx", lineNumber : 59, className : "ui.Schema", methodName : "retype"});
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
	getPairs: null
	,feed: function(consumer) {
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
ui.Statusbar = function(options) {
	if(null == options.el && null == options.template) options.template = "<footer class=\"statusbar\"></footer>";
	this.component = new sui.components.Component(options);
};
ui.Statusbar.__name__ = ["ui","Statusbar"];
ui.Statusbar.prototype = {
	component: null
	,__class__: ui.Statusbar
};
ui.TextEditor = function(options) {
	this.type = ui.SchemaType.StringType;
	if(null == options.defaultText) options.defaultText = "";
	if(null == options.el && null == options.template) options.template = "<span></span>";
	this.component = new sui.components.Component(options);
	this.component.el.setAttribute("contenteditable",true);
	var text = new sui.properties.Text(this.component,options.defaultText);
	var inputPair = steamer.dom.Dom.produceEvent(this.component.el,"input");
	var focusPair = steamer.dom.Dom.produceEvent(this.component.el,"focus");
	var blurPair = steamer.dom.Dom.produceEvent(this.component.el,"blur");
	this.text = text.stream;
	this.value = new steamer.Value(options.defaultText);
	this.text.feed(this.value);
	inputPair.producer.map(function(_) {
		return text.component.el.textContent;
	}).feed(this.text);
	this.focus = new steamer.Value(false);
	focusPair.producer.map(function(_1) {
		return true;
	}).merge(blurPair.producer.map(function(_2) {
		return false;
	})).feed(this.focus);
	this.cancel = function() {
		text.dispose();
		inputPair.cancel();
		focusPair.cancel();
		blurPair.cancel();
	};
};
ui.TextEditor.__name__ = ["ui","TextEditor"];
ui.TextEditor.__interfaces__ = [ui.Editor];
ui.TextEditor.prototype = {
	component: null
	,text: null
	,focus: null
	,value: null
	,type: null
	,cancel: null
	,destroy: function() {
		this.text.terminate();
		this.component.destroy();
		this.cancel();
	}
	,__class__: ui.TextEditor
};
ui.Toolbar = function(options) {
	if(null == options.el && null == options.template) options.template = "<header class=\"toolbar\"><div><div class=\"left\"></div><div class=\"center\"></div><div class=\"right\"></div></div></header>";
	this.component = new sui.components.Component(options);
	this.left = new ui.ToolbarGroup(dom.Query.first(".left",this.component.el),this.component);
	this.center = new ui.ToolbarGroup(dom.Query.first(".center",this.component.el),this.component);
	this.right = new ui.ToolbarGroup(dom.Query.first(".right",this.component.el),this.component);
};
ui.Toolbar.__name__ = ["ui","Toolbar"];
ui.Toolbar.prototype = {
	component: null
	,left: null
	,center: null
	,right: null
	,__class__: ui.Toolbar
};
ui.ToolbarGroup = function(el,component) {
	this.el = el;
	this.component = component;
};
ui.ToolbarGroup.__name__ = ["ui","ToolbarGroup"];
ui.ToolbarGroup.prototype = {
	el: null
	,component: null
	,addButton: function(text,icon) {
		if(text == null) text = "";
		var button = new ui.Button(text,icon);
		button.component.appendTo(this.el);
		this.component.add(button.component);
		return button;
	}
	,__class__: ui.ToolbarGroup
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
Date.prototype.__class__ = Date;
Date.__name__ = ["Date"];
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
var posToString = function(pos) {
	return pos;
};
thx.Assert.results = { add : function(assertion) {
	switch(assertion[1]) {
	case 1:
		var pos1 = assertion[3];
		var msg = assertion[2];
		throw new thx.Error(msg,null,pos1);
		break;
	case 2:
		var stack = assertion[3];
		var e = assertion[2];
		throw new thx.Error(Std.string(e),stack,{ fileName : "Assert.hx", lineNumber : 710, className : "thx.Assert", methodName : "__init__"});
		break;
	case 3:
		var stack = assertion[3];
		var e = assertion[2];
		throw new thx.Error(Std.string(e),stack,{ fileName : "Assert.hx", lineNumber : 710, className : "thx.Assert", methodName : "__init__"});
		break;
	case 4:
		var stack = assertion[3];
		var e = assertion[2];
		throw new thx.Error(Std.string(e),stack,{ fileName : "Assert.hx", lineNumber : 710, className : "thx.Assert", methodName : "__init__"});
		break;
	case 5:
		var msg1 = assertion[2];
		haxe.Log.trace(msg1,{ fileName : "Assert.hx", lineNumber : 712, className : "thx.Assert", methodName : "__init__"});
		break;
	case 0:
		var pos2 = assertion[2];
		break;
	}
}};
Config.icons = { add : "plus", remove : "minus", dropDown : "arrow-down"};
Config.selectors = { app : ".card"};
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
ui.ContextField.tooltip = new ui.Tooltip({ classes : "tooltip error"});
Main.main();
})(typeof window != "undefined" ? window : exports);

//# sourceMappingURL=app.js.map