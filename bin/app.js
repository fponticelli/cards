(function () { "use strict";
function $extend(from, fields) {
	function Inherit() {} Inherit.prototype = from; var proto = new Inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var Config = function() { };
Config.__name__ = ["Config"];
var DateTools = function() { };
DateTools.__name__ = ["DateTools"];
DateTools.__format_get = function(d,e) {
	switch(e) {
	case "%":
		return "%";
	case "C":
		return StringTools.lpad(Std.string(Std["int"](d.getFullYear() / 100)),"0",2);
	case "d":
		return StringTools.lpad(Std.string(d.getDate()),"0",2);
	case "D":
		return DateTools.__format(d,"%m/%d/%y");
	case "e":
		return Std.string(d.getDate());
	case "H":case "k":
		return StringTools.lpad(Std.string(d.getHours()),e == "H"?"0":" ",2);
	case "I":case "l":
		var hour = d.getHours() % 12;
		return StringTools.lpad(Std.string(hour == 0?12:hour),e == "I"?"0":" ",2);
	case "m":
		return StringTools.lpad(Std.string(d.getMonth() + 1),"0",2);
	case "M":
		return StringTools.lpad(Std.string(d.getMinutes()),"0",2);
	case "n":
		return "\n";
	case "p":
		if(d.getHours() > 11) return "PM"; else return "AM";
		break;
	case "r":
		return DateTools.__format(d,"%I:%M:%S %p");
	case "R":
		return DateTools.__format(d,"%H:%M");
	case "s":
		return Std.string(Std["int"](d.getTime() / 1000));
	case "S":
		return StringTools.lpad(Std.string(d.getSeconds()),"0",2);
	case "t":
		return "\t";
	case "T":
		return DateTools.__format(d,"%H:%M:%S");
	case "u":
		var t = d.getDay();
		if(t == 0) return "7"; else if(t == null) return "null"; else return "" + t;
		break;
	case "w":
		return Std.string(d.getDay());
	case "y":
		return StringTools.lpad(Std.string(d.getFullYear() % 100),"0",2);
	case "Y":
		return Std.string(d.getFullYear());
	default:
		throw "Date.format %" + e + "- not implemented yet.";
	}
};
DateTools.__format = function(d,f) {
	var r = new StringBuf();
	var p = 0;
	while(true) {
		var np = f.indexOf("%",p);
		if(np < 0) break;
		r.addSub(f,p,np - p);
		r.add(DateTools.__format_get(d,HxOverrides.substr(f,np + 1,1)));
		p = np + 2;
	}
	r.addSub(f,p,f.length - p);
	return r.b;
};
DateTools.format = function(d,f) {
	return DateTools.__format(d,f);
};
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
HxOverrides.strDate = function(s) {
	var _g = s.length;
	switch(_g) {
	case 8:
		var k = s.split(":");
		var d = new Date();
		d.setTime(0);
		d.setUTCHours(k[0]);
		d.setUTCMinutes(k[1]);
		d.setUTCSeconds(k[2]);
		return d;
	case 10:
		var k1 = s.split("-");
		return new Date(k1[0],k1[1] - 1,k1[2],0,0,0);
	case 19:
		var k2 = s.split(" ");
		var y = k2[0].split("-");
		var t = k2[1].split(":");
		return new Date(y[0],y[1] - 1,y[2],t[0],t[1],t[2]);
	default:
		throw "Invalid date format : " + s;
	}
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
Lambda.has = function(it,elt) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(x == elt) return true;
	}
	return false;
};
var Main = function() { };
Main.__name__ = ["Main"];
Main.main = function() {
	var version = "0.1.31+135";
	thx.promise._Promise.Promise_Impl_.success(thx.stream.dom.Dom.ready(),function(_) {
		var values = new cards.properties.ValueProperties();
		var fragments = new cards.ui.fragments.FragmentProperties();
		var mapper = new cards.ui.fragments.FragmentMapper(fragments,values);
		PropertyFeeder.feedProperties(values);
		PropertyFeeder.feedFragments(fragments);
		var container = udom.Query.first(".container");
		var data = new cards.model.Data({ });
		var model = new cards.model.Model(data);
		var items = cards.ui.Card.create(model,container,mapper);
		items.document.statusbar.right.component.el.innerHTML = version.toString();
	});
};
var _Map = {};
_Map.Map_Impl_ = function() { };
_Map.Map_Impl_.__name__ = ["_Map","Map_Impl_"];
var IMap = function() { };
IMap.__name__ = ["IMap"];
IMap.prototype = {
	get: null
	,exists: null
	,keys: null
	,__class__: IMap
};
Math.__name__ = ["Math"];
var PropertyFeeder = function() { };
PropertyFeeder.__name__ = ["PropertyFeeder"];
PropertyFeeder.feedProperties = function(properties) {
	PropertyFeeder.classes.map(function(p) {
		properties.add(p.name,PropertyFeeder.createToggleClass(p.display,p.name));
	});
	properties.add("text",PropertyFeeder.createText());
};
PropertyFeeder.feedFragments = function(fragments) {
	fragments.associateMany("text",["strong","emphasis","text"]);
	fragments.associateMany("block",["strong","emphasis"]);
};
PropertyFeeder.createToggleClass = function(display,name) {
	return { name : name, display : display, type : cards.model.SchemaType.BoolType, create : function(component) {
		var cls = new cards.properties.ToggleClass(component,name,name);
		cls.stream.set(true);
		return cls;
	}};
};
PropertyFeeder.createText = function() {
	return { name : "text", display : "content", type : cards.model.SchemaType.StringType, create : function(component) {
		return new cards.properties.Text(component,null);
	}};
};
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
Std["is"] = function(v,t) {
	return js.Boot.__instanceof(v,t);
};
Std.instance = function(value,c) {
	if((value instanceof c)) return value; else return null;
};
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
};
Std["int"] = function(x) {
	return x | 0;
};
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
};
Std.parseFloat = function(x) {
	return parseFloat(x);
};
Std.random = function(x) {
	if(x <= 0) return 0; else return Math.floor(Math.random() * x);
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
	,addSub: function(s,pos,len) {
		if(len == null) this.b += HxOverrides.substr(s,pos,null); else this.b += HxOverrides.substr(s,pos,len);
	}
	,__class__: StringBuf
};
var StringTools = function() { };
StringTools.__name__ = ["StringTools"];
StringTools.startsWith = function(s,start) {
	return s.length >= start.length && HxOverrides.substr(s,0,start.length) == start;
};
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
StringTools.lpad = function(s,c,l) {
	if(c.length <= 0) return s;
	while(s.length < l) s = c + s;
	return s;
};
StringTools.replace = function(s,sub,by) {
	return s.split(sub).join(by);
};
var ValueType = { __ename__ : ["ValueType"], __constructs__ : ["TNull","TInt","TFloat","TBool","TObject","TFunction","TClass","TEnum","TUnknown"] };
ValueType.TNull = ["TNull",0];
ValueType.TNull.__enum__ = ValueType;
ValueType.TInt = ["TInt",1];
ValueType.TInt.__enum__ = ValueType;
ValueType.TFloat = ["TFloat",2];
ValueType.TFloat.__enum__ = ValueType;
ValueType.TBool = ["TBool",3];
ValueType.TBool.__enum__ = ValueType;
ValueType.TObject = ["TObject",4];
ValueType.TObject.__enum__ = ValueType;
ValueType.TFunction = ["TFunction",5];
ValueType.TFunction.__enum__ = ValueType;
ValueType.TClass = function(c) { var $x = ["TClass",6,c]; $x.__enum__ = ValueType; return $x; };
ValueType.TEnum = function(e) { var $x = ["TEnum",7,e]; $x.__enum__ = ValueType; return $x; };
ValueType.TUnknown = ["TUnknown",8];
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
Type.enumEq = function(a,b) {
	if(a == b) return true;
	try {
		if(a[0] != b[0]) return false;
		var _g1 = 2;
		var _g = a.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(!Type.enumEq(a[i],b[i])) return false;
		}
		var e = a.__enum__;
		if(e != b.__enum__ || e == null) return false;
	} catch( e1 ) {
		return false;
	}
	return true;
};
var cards = {};
cards.components = {};
cards.components.Component = function(options) {
	this.isAttached = false;
	this.list = [];
	this.properties = new cards.components.Properties(this);
	if(null == options.template) {
		if(null == options.el) throw "" + Std.string(this) + " needs a template"; else {
			this.el = options.el;
			if(null != this.el.parentElement) this.isAttached = true;
		}
	} else this.el = udom.Html.parseList(StringTools.ltrim(options.template))[0];
	if(null != options.classes) options.classes.split(" ").map(($_=this.el.classList,$bind($_,$_.add)));
	if(null != options.parent) options.parent.add(this);
	if(null != options.container) this.appendTo(options.container);
};
cards.components.Component.__name__ = ["cards","components","Component"];
cards.components.Component.prototype = {
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
	,__class__: cards.components.Component
};
cards.components.Properties = function(target) {
	this.target = target;
	this.properties = new haxe.ds.StringMap();
};
cards.components.Properties.__name__ = ["cards","components","Properties"];
cards.components.Properties.prototype = {
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
	,__class__: cards.components.Properties
};
cards.model = {};
cards.model.Data = function(data) {
	this.value = new thx.stream.Value(data);
	this.reset(data);
};
cards.model.Data.__name__ = ["cards","model","Data"];
cards.model.Data.prototype = {
	root: null
	,cache: null
	,value: null
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
			this.value.set(this.toObject());
		}
		return this;
	}
	,reset: function(value) {
		this.root = new cards.model.ref.ObjectRef(null);
		this.cache = new haxe.ds.StringMap();
		if(null != value) this.set("",value);
		this.value.set(this.toObject());
		return this;
	}
	,remove: function(path) {
		var ref = this.cache.get(path);
		if(null == ref) ref = this.root.resolve(path);
		if(ref.hasValue()) {
			ref.remove();
			this.value.set(this.toObject());
		}
		this.cache.remove(path);
	}
	,rename: function(oldpath,newpath) {
		if(!this.hasValue(oldpath) || this.hasValue(newpath)) return false;
		var v = this.get(oldpath);
		this.remove(oldpath);
		this.set(newpath,v);
		this.value.set(this.toObject());
		return true;
	}
	,toObject: function() {
		return this.root.get();
	}
	,toJSON: function() {
		return JSON.stringify(this.toObject());
	}
	,__class__: cards.model.Data
};
cards.model.DataEvent = { __ename__ : ["cards","model","DataEvent"], __constructs__ : ["SetValue"] };
cards.model.DataEvent.SetValue = function(path,value,type) { var $x = ["SetValue",0,path,value,type]; $x.__enum__ = cards.model.DataEvent; return $x; };
cards.model.Expression = { __ename__ : ["cards","model","Expression"], __constructs__ : ["Fun","SyntaxError"] };
cards.model.Expression.Fun = function(f) { var $x = ["Fun",0,f]; $x.__enum__ = cards.model.Expression; return $x; };
cards.model.Expression.SyntaxError = function(msg) { var $x = ["SyntaxError",1,msg]; $x.__enum__ = cards.model.Expression; return $x; };
cards.model.Expressions = function() { };
cards.model.Expressions.__name__ = ["cards","model","Expressions"];
cards.model.Expressions.toErrorOption = function(exp) {
	switch(exp[1]) {
	case 1:
		var e = exp[2];
		return haxe.ds.Option.Some(e);
	default:
		return haxe.ds.Option.None;
	}
};
cards.model.Model = function(data) {
	var _g = this;
	this.changes = this.bus = new thx.stream.Bus();
	this.data = data;
	this.schema = new cards.model.Schema();
	this.dataEventSubscriber = function(e) {
		{
			var type = e[4];
			var value = e[3];
			var path = e[2];
			data.set(path,value);
			_g.bus.emit(thx.stream.StreamValue.Pulse(path));
		}
	};
	this.schemaEventSubscriber = function(e1) {
		switch(e1[1]) {
		case 0:
			var list = e1[2];
			var $it0 = $iterator(list)();
			while( $it0.hasNext() ) {
				var item = $it0.next();
				_g.schema.add(item.name,item.type);
			}
			_g.bus.emit(thx.stream.StreamValue.Pulse(""));
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
			_g.bus.emit(thx.stream.StreamValue.Pulse(path2));
			break;
		case 3:
			var newpath = e1[3];
			var oldpath = e1[2];
			_g.schema.rename(oldpath,newpath);
			data.rename(oldpath,newpath);
			_g.bus.emit(thx.stream.StreamValue.Pulse(oldpath));
			_g.bus.emit(thx.stream.StreamValue.Pulse(newpath));
			break;
		case 4:
			var type2 = e1[3];
			var path3 = e1[2];
			_g.schema.retype(path3,type2);
			data.remove(path3);
			_g.bus.emit(thx.stream.StreamValue.Pulse(path3));
			break;
		}
	};
};
cards.model.Model.__name__ = ["cards","model","Model"];
cards.model.Model.prototype = {
	data: null
	,schema: null
	,dataEventSubscriber: null
	,schemaEventSubscriber: null
	,changes: null
	,bus: null
	,__class__: cards.model.Model
};
cards.model.Runtime = function(expression,code) {
	this.expression = expression;
	this.code = code;
	this.dependencies = cards.model.Runtime.extractDependencies(code);
};
cards.model.Runtime.__name__ = ["cards","model","Runtime"];
cards.model.Runtime.createFunction = function(args,code) {
	return new Function(args.join(","),code);
};
cards.model.Runtime.formatCode = function(code,scope) {
	var prelim = Reflect.fields(scope).map(function(field) {
		return "var " + field + " = scope." + field + ";";
	}).join("\n");
	return "" + prelim + "\ndelete scope;\nreturn " + code + ";";
};
cards.model.Runtime.extractDependencies = function(code) {
	var set = thx.core._Set.Set_Impl_.arrayToSet([]);
	while(cards.model.Runtime.pattern.match(code)) {
		thx.core._Set.Set_Impl_.add(set,cards.model.Runtime.pattern.matched(1));
		code = cards.model.Runtime.pattern.matchedRight();
	}
	return thx.core.Iterables.order(thx.core._Set.Set_Impl_.setToArray(set),thx.core.Strings.compare);
};
cards.model.Runtime.toRuntime = function(code,model) {
	var expression;
	try {
		var scope = new cards.model.Scope();
		var formatted = cards.model.Runtime.formatCode(code,scope);
		var f = cards.model.Runtime.createFunction(["$","scope"],formatted);
		expression = cards.model.Expression.Fun(function() {
			try {
				return cards.model.RuntimeResult.Result(f(model.data.toObject(),scope));
			} catch( e ) {
				return cards.model.RuntimeResult.Error(Std.string(e));
			}
		});
	} catch( e1 ) {
		expression = cards.model.Expression.SyntaxError(Std.string(e1));
	}
	return new cards.model.Runtime(expression,code);
};
cards.model.Runtime.toErrorOption = function(runtime) {
	{
		var _g = runtime.expression;
		switch(_g[1]) {
		case 1:
			var e = _g[2];
			return haxe.ds.Option.Some(e);
		default:
			return haxe.ds.Option.None;
		}
	}
};
cards.model.Runtime.prototype = {
	expression: null
	,code: null
	,dependencies: null
	,__class__: cards.model.Runtime
};
cards.model.RuntimeResult = { __ename__ : ["cards","model","RuntimeResult"], __constructs__ : ["Result","Error"] };
cards.model.RuntimeResult.Result = function(value) { var $x = ["Result",0,value]; $x.__enum__ = cards.model.RuntimeResult; return $x; };
cards.model.RuntimeResult.Error = function(msg) { var $x = ["Error",1,msg]; $x.__enum__ = cards.model.RuntimeResult; return $x; };
cards.model.Schema = function() {
	this.fields = new haxe.ds.StringMap();
	this.stream = this.bus = new thx.stream.Bus();
};
cards.model.Schema.__name__ = ["cards","model","Schema"];
cards.model.Schema.prototype = {
	fields: null
	,stream: null
	,bus: null
	,add: function(name,type) {
		if(this.fields.exists(name)) throw new thx.core.Error("Schema already contains a field \"" + name + "\"",null,{ fileName : "Schema.hx", lineNumber : 20, className : "cards.model.Schema", methodName : "add"});
		this.fields.set(name,type);
		this.bus.pulse(cards.model.SchemaEvent.AddField(name,type));
	}
	,reset: function(list) {
		var _g = this;
		if(null == list) list = [];
		this.fields = new haxe.ds.StringMap();
		list.map(function(pair) {
			_g.fields.set(pair.name,pair.type);
		});
		this.bus.pulse(cards.model.SchemaEvent.ListFields(list.slice()));
	}
	,'delete': function(name) {
		if(!this.fields.exists(name)) throw new thx.core.Error("Schema does not contain a field \"" + name + "\"",null,{ fileName : "Schema.hx", lineNumber : 37, className : "cards.model.Schema", methodName : "delete"});
		this.fields.remove(name);
		this.bus.pulse(cards.model.SchemaEvent.DeleteField(name));
	}
	,rename: function(oldname,newname) {
		if(!this.fields.exists(oldname)) throw new thx.core.Error("Schema does not contain a field \"" + oldname + "\"",null,{ fileName : "Schema.hx", lineNumber : 44, className : "cards.model.Schema", methodName : "rename"});
		var type = this.fields.get(oldname);
		this.fields.remove(oldname);
		this.fields.set(newname,type);
		this.bus.pulse(cards.model.SchemaEvent.RenameField(oldname,newname));
	}
	,retype: function(name,type) {
		if(!this.fields.exists(name)) throw new thx.core.Error("Schema does not contain a field \"" + name + "\"",null,{ fileName : "Schema.hx", lineNumber : 53, className : "cards.model.Schema", methodName : "retype"});
		this.fields.set(name,type);
		this.bus.pulse(cards.model.SchemaEvent.RetypeField(name,type));
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
	,__class__: cards.model.Schema
};
cards.model.SchemaEvent = { __ename__ : ["cards","model","SchemaEvent"], __constructs__ : ["ListFields","AddField","DeleteField","RenameField","RetypeField"] };
cards.model.SchemaEvent.ListFields = function(list) { var $x = ["ListFields",0,list]; $x.__enum__ = cards.model.SchemaEvent; return $x; };
cards.model.SchemaEvent.AddField = function(name,type) { var $x = ["AddField",1,name,type]; $x.__enum__ = cards.model.SchemaEvent; return $x; };
cards.model.SchemaEvent.DeleteField = function(name) { var $x = ["DeleteField",2,name]; $x.__enum__ = cards.model.SchemaEvent; return $x; };
cards.model.SchemaEvent.RenameField = function(oldname,newname) { var $x = ["RenameField",3,oldname,newname]; $x.__enum__ = cards.model.SchemaEvent; return $x; };
cards.model.SchemaEvent.RetypeField = function(name,type) { var $x = ["RetypeField",4,name,type]; $x.__enum__ = cards.model.SchemaEvent; return $x; };
cards.model.SchemaType = { __ename__ : ["cards","model","SchemaType"], __constructs__ : ["ArrayType","BoolType","DateType","FloatType","ObjectType","StringType","CodeType","ReferenceType"] };
cards.model.SchemaType.ArrayType = function(item) { var $x = ["ArrayType",0,item]; $x.__enum__ = cards.model.SchemaType; return $x; };
cards.model.SchemaType.BoolType = ["BoolType",1];
cards.model.SchemaType.BoolType.__enum__ = cards.model.SchemaType;
cards.model.SchemaType.DateType = ["DateType",2];
cards.model.SchemaType.DateType.__enum__ = cards.model.SchemaType;
cards.model.SchemaType.FloatType = ["FloatType",3];
cards.model.SchemaType.FloatType.__enum__ = cards.model.SchemaType;
cards.model.SchemaType.ObjectType = function(fields) { var $x = ["ObjectType",4,fields]; $x.__enum__ = cards.model.SchemaType; return $x; };
cards.model.SchemaType.StringType = ["StringType",5];
cards.model.SchemaType.StringType.__enum__ = cards.model.SchemaType;
cards.model.SchemaType.CodeType = ["CodeType",6];
cards.model.SchemaType.CodeType.__enum__ = cards.model.SchemaType;
cards.model.SchemaType.ReferenceType = ["ReferenceType",7];
cards.model.SchemaType.ReferenceType.__enum__ = cards.model.SchemaType;
cards.model.Scope = function() {
	this.name = "Franco";
};
cards.model.Scope.__name__ = ["cards","model","Scope"];
cards.model.Scope.prototype = {
	name: null
	,__class__: cards.model.Scope
};
cards.model.ref = {};
cards.model.ref.BaseRef = function(parent) {
	if(null != parent) this.parent = parent; else this.parent = cards.model.ref.EmptyParent.instance;
};
cards.model.ref.BaseRef.__name__ = ["cards","model","ref","BaseRef"];
cards.model.ref.BaseRef.prototype = {
	parent: null
	,getRoot: function() {
		var ref = this;
		while(!js.Boot.__instanceof(ref.parent,cards.model.ref.EmptyParent)) ref = ref.parent;
		return ref;
	}
	,__class__: cards.model.ref.BaseRef
};
cards.model.ref.IParentRef = function() { };
cards.model.ref.IParentRef.__name__ = ["cards","model","ref","IParentRef"];
cards.model.ref.IParentRef.prototype = {
	removeChild: null
	,__class__: cards.model.ref.IParentRef
};
cards.model.ref.IRef = function() { };
cards.model.ref.IRef.__name__ = ["cards","model","ref","IRef"];
cards.model.ref.IRef.prototype = {
	parent: null
	,get: null
	,set: null
	,remove: null
	,hasValue: null
	,resolve: null
	,getRoot: null
	,toString: null
	,__class__: cards.model.ref.IRef
};
cards.model.ref.ArrayRef = function(parent) {
	cards.model.ref.BaseRef.call(this,parent);
	this.items = new haxe.ds.IntMap();
	this.inverse = new haxe.ds.ObjectMap();
};
cards.model.ref.ArrayRef.__name__ = ["cards","model","ref","ArrayRef"];
cards.model.ref.ArrayRef.__interfaces__ = [cards.model.ref.IParentRef,cards.model.ref.IRef];
cards.model.ref.ArrayRef.__super__ = cards.model.ref.BaseRef;
cards.model.ref.ArrayRef.prototype = $extend(cards.model.ref.BaseRef.prototype,{
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
		thx.core.Arrays.mapi(value,function(v,i) {
			var ref = _g.items.get(i);
			if(null == ref) {
				var value1 = ref = cards.model.ref.Ref.fromValue(v,_g);
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
		if(!cards.model.ref.Ref.reIndex.match(path)) throw "unable to resolve \"" + path + "\" for ArrayRef";
		var index = Std.parseInt(cards.model.ref.Ref.reIndex.matched(1));
		var rest = cards.model.ref.Ref.reIndex.matchedRight();
		var ref = this.items.get(index);
		if(null == ref) {
			var value = ref = cards.model.ref.Ref.fromPath(rest,this,terminal);
			this.items.set(index,value);
			this.inverse.set(ref,index);
		}
		return ref.resolve(rest,terminal);
	}
	,toString: function() {
		return "ArrayRef: " + this.items.toString();
	}
	,__class__: cards.model.ref.ArrayRef
});
cards.model.ref.EmptyParent = function() {
};
cards.model.ref.EmptyParent.__name__ = ["cards","model","ref","EmptyParent"];
cards.model.ref.EmptyParent.__interfaces__ = [cards.model.ref.IParentRef];
cards.model.ref.EmptyParent.prototype = {
	removeChild: function(child) {
	}
	,__class__: cards.model.ref.EmptyParent
};
cards.model.ref.ObjectRef = function(parent) {
	cards.model.ref.BaseRef.call(this,parent);
	this.fields = new haxe.ds.StringMap();
	this.inverse = new haxe.ds.ObjectMap();
};
cards.model.ref.ObjectRef.__name__ = ["cards","model","ref","ObjectRef"];
cards.model.ref.ObjectRef.__interfaces__ = [cards.model.ref.IParentRef,cards.model.ref.IRef];
cards.model.ref.ObjectRef.__super__ = cards.model.ref.BaseRef;
cards.model.ref.ObjectRef.prototype = $extend(cards.model.ref.BaseRef.prototype,{
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
				ref = cards.model.ref.Ref.fromValue(value,_g);
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
		if(terminal == null) terminal = false;
		if(path == "") return this;
		if(!cards.model.ref.Ref.reField.match(path)) throw "unable to resolve \"" + path + "\" for ObjectRef";
		var field = cards.model.ref.Ref.reField.matched(1);
		var rest = cards.model.ref.Ref.reField.matchedRight();
		var ref = this.fields.get(field);
		if(null == ref) {
			var value = ref = cards.model.ref.Ref.fromPath(rest,this,terminal);
			this.fields.set(field,value);
			this.inverse.set(ref,field);
		}
		return ref.resolve(rest,terminal);
	}
	,toString: function() {
		return "ObjectRef: " + this.fields.toString();
	}
	,__class__: cards.model.ref.ObjectRef
});
cards.model.ref.Ref = function() { };
cards.model.ref.Ref.__name__ = ["cards","model","ref","Ref"];
cards.model.ref.Ref.fromValue = function(value,parent) {
	if(null == parent) parent = cards.model.ref.EmptyParent.instance;
	var ref;
	if((value instanceof Array) && value.__enum__ == null) ref = new cards.model.ref.ArrayRef(parent); else if(Reflect.isObject(value) && null == Type.getClass(value)) ref = new cards.model.ref.ObjectRef(parent); else ref = new cards.model.ref.ValueRef(parent);
	ref.set(value);
	return ref;
};
cards.model.ref.Ref.fromPath = function(path,parent,terminal) {
	if(terminal == null) terminal = true;
	haxe.Log.trace("" + path + " with " + Std.string(parent) + " " + (terminal == null?"null":"" + terminal),{ fileName : "Ref.hx", lineNumber : 23, className : "cards.model.ref.Ref", methodName : "fromPath"});
	if(null == parent) parent = cards.model.ref.EmptyParent.instance;
	if(path == "") if(terminal) return new cards.model.ref.ValueRef(parent); else return new cards.model.ref.UnknownRef(parent); else if(cards.model.ref.Ref.reField.match(path)) return new cards.model.ref.ObjectRef(parent); else if(cards.model.ref.Ref.reIndex.match(path)) return new cards.model.ref.ArrayRef(parent); else throw "invalid path \"" + path + "\"";
};
cards.model.ref.Ref.resolvePath = function(path,parent,terminal) {
	if(terminal == null) terminal = true;
	var ref = cards.model.ref.Ref.fromPath(path,parent,terminal);
	return ref.resolve(path);
};
cards.model.ref.UnknownRef = function(parent) {
	this.hasRef = false;
	cards.model.ref.BaseRef.call(this,parent);
};
cards.model.ref.UnknownRef.__name__ = ["cards","model","ref","UnknownRef"];
cards.model.ref.UnknownRef.__interfaces__ = [cards.model.ref.IParentRef,cards.model.ref.IRef];
cards.model.ref.UnknownRef.__super__ = cards.model.ref.BaseRef;
cards.model.ref.UnknownRef.prototype = $extend(cards.model.ref.BaseRef.prototype,{
	ref: null
	,hasRef: null
	,get: function() {
		if(this.hasRef) return this.ref.get(); else return null;
	}
	,set: function(value) {
		if(this.hasRef) this.ref.set(value); else {
			this.hasRef = true;
			this.ref = cards.model.ref.Ref.fromValue(value,this);
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
		this.ref = cards.model.ref.Ref.fromPath(path,this,terminal);
		return this.ref.resolve(path,terminal);
	}
	,toString: function() {
		return "UnknownRef: " + Std.string(this.ref);
	}
	,__class__: cards.model.ref.UnknownRef
});
cards.model.ref.ValueRef = function(parent) {
	this._hasValue = false;
	cards.model.ref.BaseRef.call(this,parent);
};
cards.model.ref.ValueRef.__name__ = ["cards","model","ref","ValueRef"];
cards.model.ref.ValueRef.__interfaces__ = [cards.model.ref.IRef];
cards.model.ref.ValueRef.__super__ = cards.model.ref.BaseRef;
cards.model.ref.ValueRef.prototype = $extend(cards.model.ref.BaseRef.prototype,{
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
	,toString: function() {
		return "ValueRef: " + Std.string(this.value);
	}
	,__class__: cards.model.ref.ValueRef
});
cards.properties = {};
cards.properties.Property = function(component,name) {
	this.component = component;
	this.name = name;
	this.cancels = [];
	component.properties.add(this);
};
cards.properties.Property.__name__ = ["cards","properties","Property"];
cards.properties.Property.prototype = {
	component: null
	,name: null
	,cancels: null
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
	,__class__: cards.properties.Property
};
cards.properties.ValueProperty = function(defaultValue,component,name) {
	var _g = this;
	this.stream = new thx.stream.Value(defaultValue);
	this.runtime = new thx.stream.Value(haxe.ds.Option.None);
	this.runtimeError = new thx.stream.Value(haxe.ds.Option.None);
	cards.properties.Property.call(this,component,name);
	thx.stream.EmitterOptions.toBool(this.runtimeError).subscribe(thx.stream.dom.Dom.subscribeToggleClass(component.el,"error"));
	this.runtime.subscribe(function(opt) {
		switch(opt[1]) {
		case 1:
			component.el.classList.remove("error");
			_g.runtimeError.set(haxe.ds.Option.None);
			break;
		case 0:
			var runtime = opt[2];
			{
				var _g1 = runtime.expression;
				switch(_g1[1]) {
				case 1:
					var e = _g1[2];
					component.el.classList.add("error");
					_g.runtimeError.set(haxe.ds.Option.None);
					break;
				case 0:
					var f = _g1[2];
					component.el.classList.remove("error");
					_g.runtimeError.set(haxe.ds.Option.None);
					{
						var _g2 = f();
						switch(_g2[1]) {
						case 0:
							var v = _g2[2];
							_g.stream.set(_g.transform(v));
							break;
						case 1:
							var e1 = _g2[2];
							_g.runtimeError.set(haxe.ds.Option.Some(e1));
							break;
						}
					}
					break;
				}
			}
			break;
		}
	});
};
cards.properties.ValueProperty.__name__ = ["cards","properties","ValueProperty"];
cards.properties.ValueProperty.__super__ = cards.properties.Property;
cards.properties.ValueProperty.prototype = $extend(cards.properties.Property.prototype,{
	stream: null
	,runtime: null
	,runtimeError: null
	,transform: function(value) {
		throw Type.getClassName(Type.getClass(this)).split(".").pop() + ".transform() is abstract and must be overridden";
	}
	,dispose: function() {
		this.stream.clear();
		this.runtime.clear();
		this.runtimeError.clear();
		cards.properties.Property.prototype.dispose.call(this);
	}
	,get_value: function() {
		return this.stream.get();
	}
	,set_value: function(value) {
		return this.stream.set(value);
	}
	,__class__: cards.properties.ValueProperty
});
cards.properties.BoolProperty = function(defaultValue,component,name) {
	cards.properties.ValueProperty.call(this,defaultValue,component,name);
};
cards.properties.BoolProperty.__name__ = ["cards","properties","BoolProperty"];
cards.properties.BoolProperty.__super__ = cards.properties.ValueProperty;
cards.properties.BoolProperty.prototype = $extend(cards.properties.ValueProperty.prototype,{
	transform: function(value) {
		return cards.types.DynamicTransform.toBool(value);
	}
	,__class__: cards.properties.BoolProperty
});
cards.properties._PropertyName = {};
cards.properties._PropertyName.PropertyName_Impl_ = function() { };
cards.properties._PropertyName.PropertyName_Impl_.__name__ = ["cards","properties","_PropertyName","PropertyName_Impl_"];
cards.properties._PropertyName.PropertyName_Impl_.fromProperty = function(property) {
	return property.name;
};
cards.properties._PropertyName.PropertyName_Impl_.fromString = function(name) {
	return name;
};
cards.properties._PropertyName.PropertyName_Impl_._new = function(name) {
	return name;
};
cards.properties._PropertyName.PropertyName_Impl_.toString = function(this1) {
	return this1;
};
cards.properties.StringProperty = function(defaultValue,component,name) {
	cards.properties.ValueProperty.call(this,defaultValue,component,name);
};
cards.properties.StringProperty.__name__ = ["cards","properties","StringProperty"];
cards.properties.StringProperty.__super__ = cards.properties.ValueProperty;
cards.properties.StringProperty.prototype = $extend(cards.properties.ValueProperty.prototype,{
	transform: function(value) {
		return cards.types.DynamicTransform.toString(value);
	}
	,__class__: cards.properties.StringProperty
});
cards.properties.Text = function(component,defaultText) {
	cards.properties.StringProperty.call(this,null == defaultText?component.el.textContent:defaultText,component,"text");
	this.stream.subscribe(thx.stream.dom.Dom.subscribeText(component.el));
};
cards.properties.Text.__name__ = ["cards","properties","Text"];
cards.properties.Text.__super__ = cards.properties.StringProperty;
cards.properties.Text.prototype = $extend(cards.properties.StringProperty.prototype,{
	__class__: cards.properties.Text
});
cards.properties.ToggleClass = function(component,name,className) {
	var defaultValue = component.el.classList.contains(className);
	cards.properties.BoolProperty.call(this,defaultValue,component,name);
	if(null == className) className = name; else className = className;
	this.stream.subscribe(thx.stream.dom.Dom.subscribeToggleClass(component.el,className));
};
cards.properties.ToggleClass.__name__ = ["cards","properties","ToggleClass"];
cards.properties.ToggleClass.__super__ = cards.properties.BoolProperty;
cards.properties.ToggleClass.prototype = $extend(cards.properties.BoolProperty.prototype,{
	__class__: cards.properties.ToggleClass
});
cards.properties.ValueProperties = function() {
	this.map = new haxe.ds.StringMap();
};
cards.properties.ValueProperties.__name__ = ["cards","properties","ValueProperties"];
cards.properties.ValueProperties.prototype = {
	map: null
	,add: function(name,info) {
		this.map.set(name,info);
	}
	,remove: function(name) {
		this.map.remove(name);
	}
	,get: function(name) {
		return this.map.get(name);
	}
	,ensure: function(name,component) {
		if(component.properties.exists(name)) return js.Boot.__cast(component.properties.get(name) , cards.properties.ValueProperty); else return this.get(name).create(component);
	}
	,list: function() {
		return this.map.keys();
	}
	,__class__: cards.properties.ValueProperties
};
cards.properties.Visible = function(component,defaultValue) {
	cards.properties.BoolProperty.call(this,defaultValue,component,"visible");
	this.stream.subscribe(thx.stream.dom.Dom.subscribeToggleVisibility(component.el));
};
cards.properties.Visible.__name__ = ["cards","properties","Visible"];
cards.properties.Visible.__super__ = cards.properties.BoolProperty;
cards.properties.Visible.prototype = $extend(cards.properties.BoolProperty.prototype,{
	__class__: cards.properties.Visible
});
cards.types = {};
cards.types.ArrayTransform = function() { };
cards.types.ArrayTransform.__name__ = ["cards","types","ArrayTransform"];
cards.types.ArrayTransform.toArray = function(value) {
	if(null != value) return value; else return [];
};
cards.types.ArrayTransform.toBool = function(value) {
	return cards.types.ArrayTransform.toArray(value).length > 0;
};
cards.types.ArrayTransform.toDate = function(value) {
	var defaults = [2000,0,1,0,0,0];
	var values = cards.types.ArrayTransform.toArray(value).map(cards.types.DynamicTransform.toFloat).map(function(v) {
		return Math.round(v);
	}).slice(0,defaults.length);
	values = values.concat(defaults.slice(values.length));
	return new Date(values[0],values[1],values[2],values[3],values[4],values[5]);
};
cards.types.ArrayTransform.toFloat = function(value) {
	return cards.types.ArrayTransform.toArray(value).length;
};
cards.types.ArrayTransform.toObject = function(value) {
	var obj = { };
	thx.core.Arrays.mapi(cards.types.ArrayTransform.toArray(value),function(v,i) {
		obj["field_" + (i + 1)] = v;
	});
	return obj;
};
cards.types.ArrayTransform.toString = function(value) {
	return cards.types.ArrayTransform.toArray(value).map(cards.types.DynamicTransform.toString).join(", ");
};
cards.types.ArrayTransform.toCode = function(value) {
	return "[" + cards.types.ArrayTransform.toArray(value).map(cards.types.DynamicTransform.toCode).join(",") + "]";
};
cards.types.ArrayTransform.toReference = function(value) {
	return "";
};
cards.types.BoolTransform = function() { };
cards.types.BoolTransform.__name__ = ["cards","types","BoolTransform"];
cards.types.BoolTransform.toArray = function(value) {
	return [cards.types.BoolTransform.toBool(value)?false:value];
};
cards.types.BoolTransform.toBool = function(value) {
	return null != value && value;
};
cards.types.BoolTransform.toDate = function(value) {
	return new Date();
};
cards.types.BoolTransform.toFloat = function(value) {
	if(cards.types.BoolTransform.toBool(value)) return 1; else return 0;
};
cards.types.BoolTransform.toObject = function(value) {
	return cards.types.ArrayTransform.toObject([cards.types.BoolTransform.toBool(value)]);
};
cards.types.BoolTransform.toString = function(value) {
	if(cards.types.BoolTransform.toBool(value)) return "Yes"; else return "No";
};
cards.types.BoolTransform.toCode = function(value) {
	if(cards.types.BoolTransform.toBool(value)) return "true"; else return "false";
};
cards.types.BoolTransform.toReference = function(value) {
	return "";
};
cards.types.CodeTransform = function() { };
cards.types.CodeTransform.__name__ = ["cards","types","CodeTransform"];
cards.types.CodeTransform.toArray = function(value) {
	try {
		var t = JSON.parse(cards.types.CodeTransform.toCode(value));
		if((t instanceof Array) && t.__enum__ == null) return t; else return cards.types.DynamicTransform.toArray(t);
	} catch( _ ) {
		return [];
	}
};
cards.types.CodeTransform.toBool = function(value) {
	var _g = cards.types.CodeTransform.toCode(value);
	switch(_g) {
	case "true":case "1":
		return true;
	default:
		return false;
	}
};
cards.types.CodeTransform.toDate = function(value) {
	if(cards.types.CodeTransform.datePattern.match(value)) {
		var t = Std.parseFloat(cards.types.CodeTransform.datePattern.matched(1));
		var d = new Date();
		d.setTime(t);
		return d;
	} else return new Date();
};
cards.types.CodeTransform.toFloat = function(value) {
	return Std.parseFloat(cards.types.CodeTransform.toCode(value));
};
cards.types.CodeTransform.toObject = function(value) {
	try {
		var t = JSON.parse(cards.types.CodeTransform.toCode(value));
		if(Reflect.isObject(t) && !(typeof(t) == "string")) return t; else return cards.types.DynamicTransform.toObject(t);
	} catch( _ ) {
		return { };
	}
};
cards.types.CodeTransform.toString = function(value) {
	try {
		var t = JSON.parse(cards.types.CodeTransform.toCode(value));
		if(typeof(t) == "string") return t; else return cards.types.DynamicTransform.toString(t);
	} catch( _ ) {
		return "";
	}
};
cards.types.CodeTransform.toCode = function(value) {
	if(null != value) return StringTools.trim(value); else return "null";
};
cards.types.CodeTransform.toReference = function(value) {
	var code = cards.types.CodeTransform.toCode(value);
	if(cards.types.CodeTransform.PATTERN.match(code)) return cards.types.CodeTransform.PATTERN.matched(1); else return "";
};
cards.types.DateTransform = function() { };
cards.types.DateTransform.__name__ = ["cards","types","DateTransform"];
cards.types.DateTransform.toArray = function(value) {
	return [cards.types.DateTransform.toDate(value)];
};
cards.types.DateTransform.toBool = function(value) {
	return false;
};
cards.types.DateTransform.toDate = function(value) {
	if(null != value) return value; else return new Date();
};
cards.types.DateTransform.toFloat = function(value) {
	return cards.types.DateTransform.toDate(value).getTime();
};
cards.types.DateTransform.toObject = function(value) {
	return cards.types.ArrayTransform.toObject([cards.types.DateTransform.toDate(value)]);
};
cards.types.DateTransform.toString = function(value) {
	var _this = cards.types.DateTransform.toDate(value);
	return HxOverrides.dateStr(_this);
};
cards.types.DateTransform.toCode = function(value) {
	return "new Date(" + cards.types.DateTransform.toDate(value).getTime() + ")";
};
cards.types.DateTransform.toReference = function(value) {
	return "";
};
cards.types.DynamicTransform = function() { };
cards.types.DynamicTransform.__name__ = ["cards","types","DynamicTransform"];
cards.types.DynamicTransform.toArray = function(value) {
	if(null == value) return [];
	if((value instanceof Array) && value.__enum__ == null) return cards.types.ArrayTransform.toArray(value);
	if(typeof(value) == "boolean") return cards.types.BoolTransform.toArray(value);
	if(js.Boot.__instanceof(value,Date)) return cards.types.DateTransform.toArray(value);
	if(typeof(value) == "number") return cards.types.FloatTransform.toArray(value);
	if(typeof(value) == "string") return cards.types.StringTransform.toArray(value);
	if(Reflect.isObject(value)) return cards.types.ObjectTransform.toArray(value);
	if(Reflect.isFunction(value)) return cards.types.DynamicTransform.toArray(null);
	throw "Type of " + Std.string(value) + " cannot be matched by DynamicTransform.toArray";
};
cards.types.DynamicTransform.toBool = function(value) {
	if(null == value) return false;
	if((value instanceof Array) && value.__enum__ == null) return cards.types.ArrayTransform.toBool(value);
	if(typeof(value) == "boolean") return cards.types.BoolTransform.toBool(value);
	if(js.Boot.__instanceof(value,Date)) return cards.types.DateTransform.toBool(value);
	if(typeof(value) == "number") return cards.types.FloatTransform.toBool(value);
	if(typeof(value) == "string") return cards.types.StringTransform.toBool(value);
	if(Reflect.isObject(value)) return cards.types.ObjectTransform.toBool(value);
	if(Reflect.isFunction(value)) return cards.types.DynamicTransform.toBool(null);
	throw "Type of " + Std.string(value) + " cannot be matched by DynamicTransform.toBool";
};
cards.types.DynamicTransform.toDate = function(value) {
	if(null == value) return new Date();
	if((value instanceof Array) && value.__enum__ == null) return cards.types.ArrayTransform.toDate(value);
	if(typeof(value) == "boolean") return cards.types.BoolTransform.toDate(value);
	if(js.Boot.__instanceof(value,Date)) return cards.types.DateTransform.toDate(value);
	if(typeof(value) == "number") return cards.types.FloatTransform.toDate(value);
	if(typeof(value) == "string") return cards.types.StringTransform.toDate(value);
	if(Reflect.isObject(value)) return cards.types.ObjectTransform.toDate(value);
	if(Reflect.isFunction(value)) return cards.types.DynamicTransform.toDate(null);
	throw "Type of " + Std.string(value) + " cannot be matched by DynamicTransform.toDate";
};
cards.types.DynamicTransform.toFloat = function(value) {
	if(null == value) return 0;
	if((value instanceof Array) && value.__enum__ == null) return cards.types.ArrayTransform.toFloat(value);
	if(typeof(value) == "boolean") return cards.types.BoolTransform.toFloat(value);
	if(js.Boot.__instanceof(value,Date)) return cards.types.DateTransform.toFloat(value);
	if(typeof(value) == "number") return cards.types.FloatTransform.toFloat(value);
	if(typeof(value) == "string") return cards.types.StringTransform.toFloat(value);
	if(Reflect.isObject(value)) return cards.types.ObjectTransform.toFloat(value);
	if(Reflect.isFunction(value)) return cards.types.DynamicTransform.toFloat(null);
	throw "Type of " + Std.string(value) + " cannot be matched by DynamicTransform.toFloat";
};
cards.types.DynamicTransform.toObject = function(value) {
	if(null == value) return { };
	if((value instanceof Array) && value.__enum__ == null) return cards.types.ArrayTransform.toObject(value);
	if(typeof(value) == "boolean") return cards.types.BoolTransform.toObject(value);
	if(js.Boot.__instanceof(value,Date)) return cards.types.DateTransform.toObject(value);
	if(typeof(value) == "number") return cards.types.FloatTransform.toObject(value);
	if(typeof(value) == "string") return cards.types.StringTransform.toObject(value);
	if(Reflect.isObject(value)) return cards.types.ObjectTransform.toObject(value);
	if(Reflect.isFunction(value)) return cards.types.DynamicTransform.toObject(null);
	throw "Type of " + Std.string(value) + " cannot be matched by DynamicTransform.toObject";
};
cards.types.DynamicTransform.toString = function(value) {
	if(null == value) return "";
	if((value instanceof Array) && value.__enum__ == null) return cards.types.ArrayTransform.toString(value);
	if(typeof(value) == "boolean") return cards.types.BoolTransform.toString(value);
	if(js.Boot.__instanceof(value,Date)) return cards.types.DateTransform.toString(value);
	if(typeof(value) == "number") return cards.types.FloatTransform.toString(value);
	if(typeof(value) == "string") return cards.types.StringTransform.toString(value);
	if(Reflect.isObject(value)) return cards.types.ObjectTransform.toString(value);
	if(Reflect.isFunction(value)) return cards.types.DynamicTransform.toString(null);
	throw "Type of " + Std.string(value) + " cannot be matched by DynamicTransform.toString";
};
cards.types.DynamicTransform.toCode = function(value) {
	if(null == value) return "null";
	if((value instanceof Array) && value.__enum__ == null) return cards.types.ArrayTransform.toCode(value);
	if(typeof(value) == "boolean") return cards.types.BoolTransform.toCode(value);
	if(js.Boot.__instanceof(value,Date)) return cards.types.DateTransform.toCode(value);
	if(typeof(value) == "number") return cards.types.FloatTransform.toCode(value);
	if(typeof(value) == "string") return cards.types.StringTransform.toCode(value);
	if(Reflect.isObject(value)) return cards.types.ObjectTransform.toCode(value);
	if(Reflect.isFunction(value)) return cards.types.DynamicTransform.toCode(null);
	throw "Type of " + Std.string(value) + " cannot be matched by DynamicTransform.toCode";
};
cards.types.DynamicTransform.toReference = function(value) {
	if(null == value) return "";
	if((value instanceof Array) && value.__enum__ == null) return cards.types.ArrayTransform.toReference(value);
	if(typeof(value) == "boolean") return cards.types.BoolTransform.toReference(value);
	if(js.Boot.__instanceof(value,Date)) return cards.types.DateTransform.toReference(value);
	if(typeof(value) == "number") return cards.types.FloatTransform.toReference(value);
	if(typeof(value) == "string") return cards.types.StringTransform.toReference(value);
	if(Reflect.isObject(value)) return cards.types.ObjectTransform.toReference(value);
	if(Reflect.isFunction(value)) return cards.types.DynamicTransform.toReference(null);
	throw "Type of " + Std.string(value) + " cannot be matched by DynamicTransform.toReference";
};
cards.types.FloatTransform = function() { };
cards.types.FloatTransform.__name__ = ["cards","types","FloatTransform"];
cards.types.FloatTransform.toArray = function(value) {
	return [cards.types.FloatTransform.toFloat(value)];
};
cards.types.FloatTransform.toBool = function(value) {
	return cards.types.FloatTransform.toFloat(value) != 0;
};
cards.types.FloatTransform.toDate = function(value) {
	var t = cards.types.FloatTransform.toFloat(value);
	var d = new Date();
	d.setTime(t);
	return d;
};
cards.types.FloatTransform.toFloat = function(value) {
	if(null != value) return value; else return 0.0;
};
cards.types.FloatTransform.toObject = function(value) {
	return cards.types.ArrayTransform.toObject([cards.types.FloatTransform.toFloat(value)]);
};
cards.types.FloatTransform.toString = function(value) {
	return "" + cards.types.FloatTransform.toFloat(value);
};
cards.types.FloatTransform.toCode = function(value) {
	return "" + cards.types.FloatTransform.toFloat(value);
};
cards.types.FloatTransform.toReference = function(value) {
	return "";
};
cards.types.ObjectTransform = function() { };
cards.types.ObjectTransform.__name__ = ["cards","types","ObjectTransform"];
cards.types.ObjectTransform.toArray = function(value) {
	return [cards.types.ObjectTransform.toObject(value)];
};
cards.types.ObjectTransform.toBool = function(value) {
	return !thx.core.Objects.isEmpty(cards.types.ObjectTransform.toObject(value));
};
cards.types.ObjectTransform.toDate = function(value) {
	return new Date();
};
cards.types.ObjectTransform.toFloat = function(value) {
	return Reflect.fields(cards.types.ObjectTransform.toObject(value)).length;
};
cards.types.ObjectTransform.toObject = function(value) {
	if(null != value) return value; else return { };
};
cards.types.ObjectTransform.toString = function(value) {
	return Reflect.fields(cards.types.ObjectTransform.toObject(value)).map(function(field) {
		return "" + field + ": " + cards.types.DynamicTransform.toString(Reflect.field(value,field));
	}).join(", ");
};
cards.types.ObjectTransform.toCode = function(value) {
	return "{" + Reflect.fields(cards.types.ObjectTransform.toObject(value)).map(function(field) {
		return "\"" + field + "\" : " + cards.types.DynamicTransform.toCode(Reflect.field(value,field));
	}).join(", ") + "}";
};
cards.types.ObjectTransform.toReference = function(value) {
	return "";
};
cards.types.ReferenceTransform = function() { };
cards.types.ReferenceTransform.__name__ = ["cards","types","ReferenceTransform"];
cards.types.ReferenceTransform.toArray = function(value) {
	return cards.types.ArrayTransform.toArray(null);
};
cards.types.ReferenceTransform.toBool = function(value) {
	return cards.types.BoolTransform.toBool(null);
};
cards.types.ReferenceTransform.toDate = function(value) {
	return cards.types.DateTransform.toDate(null);
};
cards.types.ReferenceTransform.toFloat = function(value) {
	return cards.types.FloatTransform.toFloat(null);
};
cards.types.ReferenceTransform.toObject = function(value) {
	return cards.types.ObjectTransform.toObject(null);
};
cards.types.ReferenceTransform.toString = function(value) {
	return cards.types.StringTransform.toString(null);
};
cards.types.ReferenceTransform.toCode = function(value) {
	value = cards.types.ReferenceTransform.toReference(value);
	if("" == value) return ""; else return "$." + value;
};
cards.types.ReferenceTransform.toReference = function(value) {
	if(null == value) return ""; else return value;
};
cards.types.StringTransform = function() { };
cards.types.StringTransform.__name__ = ["cards","types","StringTransform"];
cards.types.StringTransform.toArray = function(value) {
	return cards.types.StringTransform.toString(value).split(",").map(StringTools.trim);
};
cards.types.StringTransform.toBool = function(value) {
	var _g = StringTools.trim(cards.types.StringTransform.toString(value)).toLowerCase();
	switch(_g) {
	case "":case "off":case "no":case "false":case "0":
		return false;
	default:
		return true;
	}
};
cards.types.StringTransform.toDate = function(value) {
	try {
		return HxOverrides.strDate(value);
	} catch( e ) {
		return new Date();
	}
};
cards.types.StringTransform.toFloat = function(value) {
	return Std.parseFloat(cards.types.StringTransform.toString(value));
};
cards.types.StringTransform.toObject = function(value) {
	return cards.types.ArrayTransform.toObject([cards.types.StringTransform.toString(value)]);
};
cards.types.StringTransform.toString = function(value) {
	if(null != value) return value; else return "";
};
cards.types.StringTransform.toCode = function(value) {
	return "\"" + StringTools.replace(cards.types.StringTransform.toString(value),"\"","\\\"") + "\"";
};
cards.types.StringTransform.toReference = function(value) {
	return "";
};
cards.types.TypeTransform = function() { };
cards.types.TypeTransform.__name__ = ["cards","types","TypeTransform"];
cards.types.TypeTransform.transform = function(srcType,dstType) {
	switch(srcType[1]) {
	case 0:
		switch(dstType[1]) {
		case 0:
			return cards.types.ArrayTransform.toArray;
		case 1:
			return cards.types.ArrayTransform.toBool;
		case 2:
			return cards.types.ArrayTransform.toDate;
		case 3:
			return cards.types.ArrayTransform.toFloat;
		case 4:
			return cards.types.ArrayTransform.toObject;
		case 5:
			return cards.types.ArrayTransform.toString;
		case 6:
			return cards.types.ArrayTransform.toCode;
		case 7:
			return cards.types.ArrayTransform.toReference;
		}
		break;
	case 1:
		switch(dstType[1]) {
		case 0:
			return cards.types.BoolTransform.toArray;
		case 1:
			return cards.types.BoolTransform.toBool;
		case 2:
			return cards.types.BoolTransform.toDate;
		case 3:
			return cards.types.BoolTransform.toFloat;
		case 4:
			return cards.types.BoolTransform.toObject;
		case 5:
			return cards.types.BoolTransform.toString;
		case 6:
			return cards.types.BoolTransform.toCode;
		case 7:
			return cards.types.BoolTransform.toReference;
		}
		break;
	case 2:
		switch(dstType[1]) {
		case 0:
			return cards.types.DateTransform.toArray;
		case 1:
			return cards.types.DateTransform.toBool;
		case 2:
			return cards.types.DateTransform.toDate;
		case 3:
			return cards.types.DateTransform.toFloat;
		case 4:
			return cards.types.DateTransform.toObject;
		case 5:
			return cards.types.DateTransform.toString;
		case 6:
			return cards.types.DateTransform.toCode;
		case 7:
			return cards.types.DateTransform.toReference;
		}
		break;
	case 3:
		switch(dstType[1]) {
		case 0:
			return cards.types.FloatTransform.toArray;
		case 1:
			return cards.types.FloatTransform.toBool;
		case 2:
			return cards.types.FloatTransform.toDate;
		case 3:
			return cards.types.FloatTransform.toFloat;
		case 4:
			return cards.types.FloatTransform.toObject;
		case 5:
			return cards.types.FloatTransform.toString;
		case 6:
			return cards.types.FloatTransform.toCode;
		case 7:
			return cards.types.FloatTransform.toReference;
		}
		break;
	case 4:
		switch(dstType[1]) {
		case 0:
			return cards.types.ObjectTransform.toArray;
		case 1:
			return cards.types.ObjectTransform.toBool;
		case 2:
			return cards.types.ObjectTransform.toDate;
		case 3:
			return cards.types.ObjectTransform.toFloat;
		case 4:
			return cards.types.ObjectTransform.toObject;
		case 5:
			return cards.types.ObjectTransform.toString;
		case 6:
			return cards.types.ObjectTransform.toCode;
		case 7:
			return cards.types.ObjectTransform.toReference;
		}
		break;
	case 5:
		switch(dstType[1]) {
		case 0:
			return cards.types.StringTransform.toArray;
		case 1:
			return cards.types.StringTransform.toBool;
		case 2:
			return cards.types.StringTransform.toDate;
		case 3:
			return cards.types.StringTransform.toFloat;
		case 4:
			return cards.types.StringTransform.toObject;
		case 5:
			return cards.types.StringTransform.toString;
		case 6:
			return cards.types.StringTransform.toCode;
		case 7:
			return cards.types.StringTransform.toReference;
		}
		break;
	case 6:
		switch(dstType[1]) {
		case 0:
			return cards.types.CodeTransform.toArray;
		case 1:
			return cards.types.CodeTransform.toBool;
		case 2:
			return cards.types.CodeTransform.toDate;
		case 3:
			return cards.types.CodeTransform.toFloat;
		case 4:
			return cards.types.CodeTransform.toObject;
		case 5:
			return cards.types.CodeTransform.toString;
		case 6:
			return cards.types.CodeTransform.toCode;
		case 7:
			return cards.types.CodeTransform.toReference;
		}
		break;
	case 7:
		switch(dstType[1]) {
		case 0:
			return cards.types.ReferenceTransform.toArray;
		case 1:
			return cards.types.ReferenceTransform.toBool;
		case 2:
			return cards.types.ReferenceTransform.toDate;
		case 3:
			return cards.types.ReferenceTransform.toFloat;
		case 4:
			return cards.types.ReferenceTransform.toObject;
		case 5:
			return cards.types.ReferenceTransform.toString;
		case 6:
			return cards.types.ReferenceTransform.toCode;
		case 7:
			return cards.types.ReferenceTransform.toReference;
		}
		break;
	}
};
cards.ui = {};
cards.ui.Article = function(options) {
	if(null == options.el && null == options.template) options.template = "<article></article>";
	this.component = new cards.components.Component(options);
	this.fragmentsMap = new haxe.ds.ObjectMap();
	this.fragmentStream = new thx.stream.Bus();
	this.fragment = new thx.stream.Value(haxe.ds.Option.None);
	this.fragmentStream.toOption().feed(this.fragment);
	var filtered = thx.stream.EmitterOptions.filterOption(this.fragment);
	filtered.previous().subscribe(function(fragment) {
		fragment.active.set(false);
	});
	filtered.subscribe(function(fragment1) {
		fragment1.active.set(true);
	});
};
cards.ui.Article.__name__ = ["cards","ui","Article"];
cards.ui.Article.prototype = {
	component: null
	,fragment: null
	,fragmentStream: null
	,fragmentsMap: null
	,addFragment: function(fragment) {
		var focusStream = fragment.focus.withValue(true).map(function(_) {
			return fragment;
		}).plug(this.fragmentStream);
		this.fragmentsMap.set(fragment,$bind(focusStream,focusStream.cancel));
	}
	,addBlock: function() {
		var fragment = new cards.ui.fragments.Block({ parent : this.component, container : this.component.el});
		this.addFragment(fragment);
		this.addInlineText(fragment);
		return fragment;
	}
	,addInlineText: function(parent) {
		var fragment = new cards.ui.fragments.InlineText({ fragmentParent : parent, container : parent.component.el, defaultText : ""});
		this.addFragment(fragment);
		fragment.focus.set(true);
	}
	,addReadonly: function() {
		var fragment = new cards.ui.fragments.ReadonlyBlock({ parent : this.component, container : this.component.el});
		this.addFragment(fragment);
		return fragment;
	}
	,removeFragment: function(fragment) {
		if(thx.core.Options.equalsValue(this.fragment.get(),fragment)) this.fragment.set(haxe.ds.Option.None);
		var finalizer = this.fragmentsMap.h[fragment.__id__];
		this.fragmentsMap.remove(fragment);
		finalizer();
	}
	,__class__: cards.ui.Article
};
cards.ui.Card = function() { };
cards.ui.Card.__name__ = ["cards","ui","Card"];
cards.ui.Card.create = function(model,container,mapper) {
	var card = new cards.components.Component({ template : "<div class=\"card\"><div class=\"doc\"></div><aside><div class=\"context\"></div><div class=\"model\"></div></aside></div>"});
	var modelView = new cards.ui.ModelView();
	var document = new cards.ui.Document({ el : udom.Query.first(".doc",card.el)});
	var context = new cards.ui.ContextView(document,mapper,udom.Query.first(".context",card.el),document.component);
	modelView.component.appendTo(udom.Query.first(".model",card.el));
	modelView.data.subscribe(model.dataEventSubscriber);
	card.appendTo(container);
	document.article.addBlock();
	return { card : card, modelView : modelView, document : document, context : context};
};
cards.ui.ContextView = function(document,mapper,container,parent) {
	this.container = container;
	this.parent = parent;
	this.mapper = mapper;
	this.resetEditor();
	thx.stream.EmitterOptions.either(document.article.fragment,$bind(this,this.setFragmentStatus),$bind(this,this.resetEditor));
};
cards.ui.ContextView.__name__ = ["cards","ui","ContextView"];
cards.ui.ContextView.prototype = {
	editor: null
	,container: null
	,parent: null
	,mapper: null
	,resetEditor: function() {
		if(null != this.editor) this.editor.dispose();
		this.container.innerHTML = "";
	}
	,setFragmentStatus: function(fragment) {
		this.resetEditor();
		haxe.Log.trace(fragment,{ fileName : "ContextView.hx", lineNumber : 32, className : "cards.ui.ContextView", methodName : "setFragmentStatus"});
		var fields = this.mapper.getAttachedPropertiesForFragment(fragment).map(function(info) {
			return { name : info.name, type : info.type, optional : false};
		}).concat(this.mapper.getAttachablePropertiesForFragment(fragment).map(function(info1) {
			return { name : info1.name, type : info1.type, optional : true};
		}));
		this.editor = new cards.ui.input.RuntimeObjectEditor(this.container,this.parent,fields);
		this.editor.stream.subscribe(function(v) {
			haxe.Log.trace(cards.ui.input._TypedValue.TypedValue_Impl_.toString(v),{ fileName : "ContextView.hx", lineNumber : 55, className : "cards.ui.ContextView", methodName : "setFragmentStatus"});
		});
	}
	,__class__: cards.ui.ContextView
};
cards.ui.Document = function(options) {
	var _g = this;
	this.component = new cards.components.Component(options);
	this.toolbar = new cards.ui.widgets.Toolbar({ parent : this.component, container : this.component.el});
	this.article = new cards.ui.Article({ parent : this.component, container : this.component.el});
	this.statusbar = new cards.ui.widgets.Statusbar({ parent : this.component, container : this.component.el});
	this.article.fragment.map(function(r) {
		switch(r[1]) {
		case 0:
			var v = r[2];
			return "" + Std.string(v);
		case 1:
			return "no fragment selected";
		}
	}).subscribe(thx.stream.dom.Dom.subscribeHTML(this.statusbar.left.component.el));
	this.toolbar.left.addButton("block",Config.icons.add).clicks.subscribe(function(_) {
		_g.article.addBlock();
	});
	var buttonAddText = this.toolbar.left.addButton("text",Config.icons.add);
	buttonAddText.clicks.subscribe(function(_1) {
		var block = cards.ui.Document.getNearestBlock(thx.core.Options.toValue(_g.article.fragment.get()));
		if(null == block) return;
		_g.article.addInlineText(block);
	});
	buttonAddText.enabled.set(false);
	this.article.fragment.map(function(r1) {
		switch(r1[1]) {
		case 0:
			var v1 = r1[2];
			return cards.ui.Document.getNearestBlock(v1) != null;
		case 1:
			return false;
		}
	}).feed(buttonAddText.enabled);
	var buttonRemove = this.toolbar.right.addButton("",Config.icons.remove);
	buttonRemove.enabled.set(false);
	buttonRemove.clicks.subscribe(function(_2) {
		thx.core.Options.toValue(_g.article.fragment.get()).component.destroy();
		_g.article.fragment.set(haxe.ds.Option.None);
	});
	thx.stream.EmitterOptions.toBool(this.article.fragment).feed(buttonRemove.enabled);
};
cards.ui.Document.__name__ = ["cards","ui","Document"];
cards.ui.Document.getNearestBlock = function(fragment) {
	if(null == fragment) return null;
	if(js.Boot.__instanceof(fragment,cards.ui.fragments.Block)) return fragment;
	return cards.ui.Document.getNearestBlock(fragment.parent);
};
cards.ui.Document.prototype = {
	component: null
	,toolbar: null
	,article: null
	,statusbar: null
	,__class__: cards.ui.Document
};
cards.ui.ModelView = function() {
	var _g2 = this;
	this.component = new cards.components.Component({ template : "<div class=\"modelview\"></div>"});
	this.data = this.dataBus = new thx.stream.Bus();
	this.editor = new cards.ui.input.AnonymousObjectEditor(this.component.el,this.component);
	this.editor.diff.subscribe(function(d) {
		{
			var _g = d._1;
			var _g1 = d._0;
			switch(_g[1]) {
			case 1:
				var path = _g1;
				break;
			case 0:
				var path1 = _g1;
				break;
			case 2:
				var path2 = _g1;
				var v = _g[2];
				_g2.dataBus.pulse(cards.model.DataEvent.SetValue(cards.ui.input._Path.Path_Impl_.toString(path2),v._1,v._0));
				break;
			}
		}
	});
};
cards.ui.ModelView.__name__ = ["cards","ui","ModelView"];
cards.ui.ModelView.prototype = {
	component: null
	,data: null
	,dataBus: null
	,editor: null
	,setField: function(path,value,type) {
		if(cards.ui.input._Path.Path_Impl_.equal(path,cards.ui.input._Path.Path_Impl_.stringAsPath("")) || cards.ui.input._Path.Path_Impl_.equal(path,null)) return;
		this.editor.diff.pulse((function($this) {
			var $r;
			var diff = cards.ui.input.Diff.Set((function($this) {
				var $r;
				var _1 = value;
				$r = { _0 : type, _1 : _1};
				return $r;
			}($this)));
			$r = { _0 : path, _1 : diff};
			return $r;
		}(this)));
	}
	,__class__: cards.ui.ModelView
};
cards.ui.editors = {};
cards.ui.editors.Editor = function() { };
cards.ui.editors.Editor.__name__ = ["cards","ui","editors","Editor"];
cards.ui.editors.Editor.prototype = {
	value: null
	,type: null
	,focus: null
	,component: null
	,__class__: cards.ui.editors.Editor
};
cards.ui.editors.TextEditor = function(options) {
	var _g = this;
	this.type = cards.model.SchemaType.StringType;
	if(null == options.defaultText) options.defaultText = "";
	if(null == options.placeHolder) options.placeHolder = "";
	if(null == options.el && null == options.template) options.template = "<div></div>";
	if(null == options.inputEvent) options.inputEvent = function(component) {
		return thx.stream.dom.Dom.streamEvent(component.el,"input");
	};
	this.component = new cards.components.Component(options);
	this.component.el.classList.add("editor");
	this.component.el.classList.add("text");
	this.component.el.setAttribute("tabindex","1");
	this.component.el.setAttribute("contenteditable","true");
	this.component.el.setAttribute("placeholder",options.placeHolder);
	this.component.el.addEventListener("dragstart",function(e) {
		e.preventDefault();
	},false);
	this.component.el.addEventListener("drop",function(e1) {
		e1.preventDefault();
	},false);
	this.component.el.style.content = options.placeHolder;
	var text = new cards.properties.Text(this.component,options.defaultText);
	this.value = text.stream;
	options.inputEvent(this.component).map(function(_) {
		return text.component.el.textContent;
	}).feed(this.value);
	this.focus = new thx.stream.Value(false);
	this.focus.withValue(true).subscribe(thx.stream.dom.Dom.subscribeFocus(this.component.el));
	var focusStream = this.focus.withValue(true).subscribe(function(_1) {
		window.document.getSelection().selectAllChildren(_g.component.el);
	});
	thx.stream.dom.Dom.streamFocus(this.component.el).feed(this.focus);
	this.cancel = function() {
		text.dispose();
		focusStream.cancel();
	};
	var empty = new thx.stream.Value(options.defaultText == "");
	thx.stream.dom.Dom.streamEvent(this.component.el,"input").map(function(_2) {
		return text.component.el.textContent == "";
	}).merge(this.value.map(function(t) {
		return t == "";
	})).feed(empty);
	empty.subscribe(thx.stream.dom.Dom.subscribeToggleClass(this.component.el,"empty"));
	thx.stream.dom.Dom.streamEvent(this.component.el,"paste").map(function(ev) {
		var e2 = ev;
		e2.preventDefault();
		var data;
		if(null == e2.clipboardData) data = ""; else data = e2.clipboardData.getData("text/plain");
		var current = _g.value.get();
		var selection = window.getSelection();
		var start = selection.anchorOffset;
		var end = selection.extentOffset;
		return HxOverrides.substr(current,0,start) + data + HxOverrides.substr(current,end,null);
	}).filter(function(v) {
		return v.length > 0;
	}).feed(this.value);
};
cards.ui.editors.TextEditor.__name__ = ["cards","ui","editors","TextEditor"];
cards.ui.editors.TextEditor.__interfaces__ = [cards.ui.editors.Editor];
cards.ui.editors.TextEditor.prototype = {
	component: null
	,focus: null
	,value: null
	,type: null
	,cancel: null
	,destroy: function() {
		this.value.clear();
		this.component.destroy();
		this.cancel();
	}
	,__class__: cards.ui.editors.TextEditor
};
cards.ui.fragments = {};
cards.ui.fragments.Fragment = function() { };
cards.ui.fragments.Fragment.__name__ = ["cards","ui","fragments","Fragment"];
cards.ui.fragments.Fragment.prototype = {
	name: null
	,component: null
	,focus: null
	,active: null
	,uid: null
	,parent: null
	,toString: null
	,__class__: cards.ui.fragments.Fragment
};
cards.ui.fragments.Block = function(options) {
	this.name = "block";
	if(null == options.el && null == options.template) options.template = "<div class=\"block\" tabindex=\"1\"></div>";
	this.parent = options.fragmentParent;
	if(null != options.uid) this.uid = options.uid; else this.uid = thx.core.UUID.create();
	this.component = new cards.components.Component(options);
	this.active = new thx.stream.Value(false);
	this.active.feed(new cards.properties.ToggleClass(this.component,"active").stream);
	this.focus = new thx.stream.Value(false);
	thx.stream.dom.Dom.streamFocus(this.component.el).feed(this.focus);
};
cards.ui.fragments.Block.__name__ = ["cards","ui","fragments","Block"];
cards.ui.fragments.Block.__interfaces__ = [cards.ui.fragments.Fragment];
cards.ui.fragments.Block.prototype = {
	name: null
	,component: null
	,focus: null
	,active: null
	,uid: null
	,parent: null
	,destroy: function() {
		this.focus.clear();
		this.component.destroy();
	}
	,toString: function() {
		return this.name;
	}
	,__class__: cards.ui.fragments.Block
};
cards.ui.fragments.FragmentMapper = function(fragments,values) {
	this.fragments = fragments;
	this.values = values;
};
cards.ui.fragments.FragmentMapper.__name__ = ["cards","ui","fragments","FragmentMapper"];
cards.ui.fragments.FragmentMapper.prototype = {
	fragments: null
	,values: null
	,getValuePropertyInfoForFragment: function(fragment) {
		return thx.core.Iterators.map(this.fragments.getAssociations(fragment),($_=this.values,$bind($_,$_.get)));
	}
	,getAttachedPropertiesForFragment: function(fragment) {
		return thx.core.Iterators.filter(this.fragments.getAssociations(fragment.name),function(name) {
			return fragment.component.properties.exists(name);
		}).map(($_=this.values,$bind($_,$_.get)));
	}
	,getAttachablePropertiesForFragment: function(fragment) {
		return thx.core.Iterators.filter(this.fragments.getAssociations(fragment.name),function(name) {
			return !fragment.component.properties.exists(name);
		}).map(($_=this.values,$bind($_,$_.get)));
	}
	,__class__: cards.ui.fragments.FragmentMapper
};
cards.ui.fragments._FragmentName = {};
cards.ui.fragments._FragmentName.FragmentName_Impl_ = function() { };
cards.ui.fragments._FragmentName.FragmentName_Impl_.__name__ = ["cards","ui","fragments","_FragmentName","FragmentName_Impl_"];
cards.ui.fragments._FragmentName.FragmentName_Impl_.fromFragment = function(fragment) {
	return fragment.name;
};
cards.ui.fragments._FragmentName.FragmentName_Impl_.fromString = function(name) {
	return name;
};
cards.ui.fragments._FragmentName.FragmentName_Impl_._new = function(name) {
	return name;
};
cards.ui.fragments._FragmentName.FragmentName_Impl_.toString = function(this1) {
	return this1;
};
cards.ui.fragments.FragmentProperties = function() {
	this.map = new haxe.ds.StringMap();
};
cards.ui.fragments.FragmentProperties.__name__ = ["cards","ui","fragments","FragmentProperties"];
cards.ui.fragments.FragmentProperties.prototype = {
	map: null
	,associate: function(fragment,property) {
		var s = this.map.get(fragment);
		if(null == s) {
			var value = s = thx.core._Set.Set_Impl_.arrayToSet([]);
			this.map.set(fragment,value);
		}
		thx.core._Set.Set_Impl_.add(s,property);
	}
	,associateMany: function(fragment,properties) {
		thx.core.Iterables.map(properties,(function(f,a1) {
			return function(a2) {
				return f(a1,a2);
			};
		})($bind(this,this.associate),fragment));
	}
	,getAssociations: function(fragment) {
		var s = this.map.get(fragment);
		if(s == null) s = thx.core._Set.Set_Impl_.arrayToSet([]);
		return HxOverrides.iter(s);
	}
	,__class__: cards.ui.fragments.FragmentProperties
};
cards.ui.fragments.InlineText = function(options) {
	this.name = "text";
	if(null == options.el && null == options.template) options.template = "<span class=\"text\"></span>";
	if(null != options.uid) this.uid = options.uid; else this.uid = thx.core.UUID.create();
	if(null == options.placeHolder) options.placeHolder = "type some content";
	this.parent = options.fragmentParent;
	this.editor = new cards.ui.editors.TextEditor(options);
	this.active = new thx.stream.Value(false);
	this.active.feed(new cards.properties.ToggleClass(this.editor.component,"active").stream);
	this.focus = this.editor.focus;
	this.component = this.editor.component;
};
cards.ui.fragments.InlineText.__name__ = ["cards","ui","fragments","InlineText"];
cards.ui.fragments.InlineText.__interfaces__ = [cards.ui.fragments.Fragment];
cards.ui.fragments.InlineText.prototype = {
	name: null
	,editor: null
	,component: null
	,focus: null
	,active: null
	,uid: null
	,parent: null
	,destroy: function() {
		this.editor.destroy();
	}
	,toString: function() {
		return this.name;
	}
	,__class__: cards.ui.fragments.InlineText
};
cards.ui.fragments.ReadonlyBlock = function(options) {
	this.name = "readonly";
	if(null == options.el && null == options.template) options.template = "<div class=\"readonly block\" tabindex=\"1\">readonly</div>";
	this.component = new cards.components.Component(options);
	this.focus = new thx.stream.Value(false);
	this.active = new thx.stream.Value(false);
	if(null != options.uid) this.uid = options.uid; else this.uid = thx.core.UUID.create();
	this.focusStream = thx.stream.dom.Dom.streamFocus(this.component.el).feed(this.focus);
	this.active.subscribe(thx.stream.dom.Dom.subscribeToggleClass(this.component.el,"active"));
};
cards.ui.fragments.ReadonlyBlock.__name__ = ["cards","ui","fragments","ReadonlyBlock"];
cards.ui.fragments.ReadonlyBlock.__interfaces__ = [cards.ui.fragments.Fragment];
cards.ui.fragments.ReadonlyBlock.prototype = {
	name: null
	,component: null
	,focus: null
	,active: null
	,uid: null
	,parent: null
	,focusStream: null
	,destroy: function() {
		this.focusStream.cancel();
		this.component.destroy();
	}
	,toString: function() {
		return this.name;
	}
	,__class__: cards.ui.fragments.ReadonlyBlock
};
cards.ui.input = {};
cards.ui.input.IEditor = function() { };
cards.ui.input.IEditor.__name__ = ["cards","ui","input","IEditor"];
cards.ui.input.IEditor.prototype = {
	stream: null
	,type: null
	,focus: null
	,component: null
	,toString: null
	,dispose: null
	,__class__: cards.ui.input.IEditor
};
cards.ui.input.Editor = function(type,options) {
	this.stream = new thx.stream.Bus(true,cards.ui.input._TypedValue.TypedValue_Impl_.equal);
	this.type = type;
	this.focus = new thx.stream.Value(false);
	this.component = new cards.components.Component(options);
};
cards.ui.input.Editor.__name__ = ["cards","ui","input","Editor"];
cards.ui.input.Editor.__interfaces__ = [cards.ui.input.IEditor];
cards.ui.input.Editor.prototype = {
	stream: null
	,type: null
	,focus: null
	,component: null
	,dispose: function() {
		this.stream.clear();
		this.focus.clear();
		this.component.destroy();
	}
	,toString: function() {
		return Type.getClassName(Type.getClass(this)).split(".").pop();
	}
	,__class__: cards.ui.input.Editor
};
cards.ui.input.IRouteEditor = function() { };
cards.ui.input.IRouteEditor.__name__ = ["cards","ui","input","IRouteEditor"];
cards.ui.input.IRouteEditor.__interfaces__ = [cards.ui.input.IEditor];
cards.ui.input.IRouteEditor.prototype = {
	diff: null
	,typeAt: null
	,__class__: cards.ui.input.IRouteEditor
};
cards.ui.input.RouteEditor = function(type,options) {
	cards.ui.input.Editor.call(this,type,options);
	this.diff = new thx.stream.Bus();
};
cards.ui.input.RouteEditor.__name__ = ["cards","ui","input","RouteEditor"];
cards.ui.input.RouteEditor.__interfaces__ = [cards.ui.input.IRouteEditor];
cards.ui.input.RouteEditor.__super__ = cards.ui.input.Editor;
cards.ui.input.RouteEditor.prototype = $extend(cards.ui.input.Editor.prototype,{
	diff: null
	,dispose: function() {
		cards.ui.input.Editor.prototype.dispose.call(this);
		this.diff.clear();
	}
	,typeAt: function(path) {
		throw "abstract method";
	}
	,__class__: cards.ui.input.RouteEditor
});
cards.ui.input.BaseObjectEditor = function(container,parent,fields) {
	var _g = this;
	this.object = { };
	this.editors = new haxe.ds.StringMap();
	this.defMap = new haxe.ds.StringMap();
	this.currentField = thx.stream.Value.createOption();
	var options = { template : "<div class=\"editor table\"></div>", container : container, parent : parent};
	cards.ui.input.RouteEditor.call(this,cards.model.SchemaType.ObjectType([]),options);
	this.fields = [];
	this.toolbar = new cards.ui.widgets.Toolbar({ parent : this.component, container : this.component.el});
	var buttonRemove = this.toolbar.right.addButton("",Config.icons.remove);
	buttonRemove.enabled.set(false);
	this.currentField.map(function(cur) {
		switch(cur[1]) {
		case 1:
			return false;
		case 0:
			var name = cur[2];
			return _g.defMap.get(name).field.optional;
		}
	}).feed(buttonRemove.enabled);
	buttonRemove.clicks.subscribe(function(_) {
		var name1 = thx.core.Options.toValue(_g.currentField.get());
		if(null == name1) return;
		_g.removeField(name1);
	});
	var _this = window.document;
	this.table = _this.createElement("table");
	this.component.el.appendChild(this.table);
	this.diff.subscribe(function(d) {
		{
			var _g1 = d._0;
			var _g11 = d._1;
			var path = _g1;
			switch(_g1.length) {
			case 1:
				switch(_g1[0][1]) {
				case 0:
					var diff = _g11;
					switch(_g11[1]) {
					case 0:
						var name2 = _g1[0][2];
						if(_g.editors.exists(name2)) _g.removeField(name2);
						break;
					case 1:
						var name3 = _g1[0][2];
						_g.ensureField(name3);
						break;
					case 2:
						var name4 = _g1[0][2];
						var tv = _g11[2];
						if(Type.enumEq(tv._0,_g.defMap.get(name4).field.type)) _g.ensureField(name4).stream.emit(thx.stream.StreamValue.Pulse(tv)); else if(path.length > 0) {
							var first = path.shift();
							switch(first[1]) {
							case 0:
								var name5 = first[2];
								if((function($this) {
									var $r;
									var _g2 = _g.defMap.get(name5).field.type;
									$r = (function($this) {
										var $r;
										switch(_g2[1]) {
										case 4:case 0:
											$r = true;
											break;
										default:
											$r = false;
										}
										return $r;
									}($this));
									return $r;
								}(this))) _g.ensureField(name5).diff.emit(thx.stream.StreamValue.Pulse({ _0 : path, _1 : diff})); else throw "unable to forward " + cards.ui.input._DiffAt.DiffAt_Impl_.toString(d) + " within ObjectEditor";
								break;
							default:
								throw "unable to forward " + cards.ui.input._DiffAt.DiffAt_Impl_.toString(d) + " within ObjectEditor";
							}
						} else {
							haxe.Log.trace(cards.ui.input._Path.Path_Impl_.toString(d._0),{ fileName : "BaseObjectEditor.hx", lineNumber : 88, className : "cards.ui.input.BaseObjectEditor", methodName : "new"});
							haxe.Log.trace((function($this) {
								var $r;
								var _g21 = d._1;
								$r = (function($this) {
									var $r;
									switch(_g21[1]) {
									case 2:
										$r = (function($this) {
											var $r;
											var d1 = _g21[2];
											$r = cards.ui.input._TypedValue.TypedValue_Impl_.toString(d1);
											return $r;
										}($this));
										break;
									default:
										$r = Std.string(d._1);
									}
									return $r;
								}($this));
								return $r;
							}(this)),{ fileName : "BaseObjectEditor.hx", lineNumber : 89, className : "cards.ui.input.BaseObjectEditor", methodName : "new"});
							throw "unable to assign " + cards.ui.input._DiffAt.DiffAt_Impl_.toString(d) + " within ObjectEditor";
						}
						break;
					default:
						if(path.length > 0) {
							var first = path.shift();
							switch(first[1]) {
							case 0:
								var name5 = first[2];
								if((function($this) {
									var $r;
									var _g2 = _g.defMap.get(name5).field.type;
									$r = (function($this) {
										var $r;
										switch(_g2[1]) {
										case 4:case 0:
											$r = true;
											break;
										default:
											$r = false;
										}
										return $r;
									}($this));
									return $r;
								}(this))) _g.ensureField(name5).diff.emit(thx.stream.StreamValue.Pulse({ _0 : path, _1 : diff})); else throw "unable to forward " + cards.ui.input._DiffAt.DiffAt_Impl_.toString(d) + " within ObjectEditor";
								break;
							default:
								throw "unable to forward " + cards.ui.input._DiffAt.DiffAt_Impl_.toString(d) + " within ObjectEditor";
							}
						} else {
							haxe.Log.trace(cards.ui.input._Path.Path_Impl_.toString(d._0),{ fileName : "BaseObjectEditor.hx", lineNumber : 88, className : "cards.ui.input.BaseObjectEditor", methodName : "new"});
							haxe.Log.trace((function($this) {
								var $r;
								var _g21 = d._1;
								$r = (function($this) {
									var $r;
									switch(_g21[1]) {
									case 2:
										$r = (function($this) {
											var $r;
											var d1 = _g21[2];
											$r = cards.ui.input._TypedValue.TypedValue_Impl_.toString(d1);
											return $r;
										}($this));
										break;
									default:
										$r = Std.string(d._1);
									}
									return $r;
								}($this));
								return $r;
							}(this)),{ fileName : "BaseObjectEditor.hx", lineNumber : 89, className : "cards.ui.input.BaseObjectEditor", methodName : "new"});
							throw "unable to assign " + cards.ui.input._DiffAt.DiffAt_Impl_.toString(d) + " within ObjectEditor";
						}
					}
					break;
				default:
					var diff = _g11;
					if(path.length > 0) {
						var first = path.shift();
						switch(first[1]) {
						case 0:
							var name5 = first[2];
							if((function($this) {
								var $r;
								var _g2 = _g.defMap.get(name5).field.type;
								$r = (function($this) {
									var $r;
									switch(_g2[1]) {
									case 4:case 0:
										$r = true;
										break;
									default:
										$r = false;
									}
									return $r;
								}($this));
								return $r;
							}(this))) _g.ensureField(name5).diff.emit(thx.stream.StreamValue.Pulse({ _0 : path, _1 : diff})); else throw "unable to forward " + cards.ui.input._DiffAt.DiffAt_Impl_.toString(d) + " within ObjectEditor";
							break;
						default:
							throw "unable to forward " + cards.ui.input._DiffAt.DiffAt_Impl_.toString(d) + " within ObjectEditor";
						}
					} else {
						haxe.Log.trace(cards.ui.input._Path.Path_Impl_.toString(d._0),{ fileName : "BaseObjectEditor.hx", lineNumber : 88, className : "cards.ui.input.BaseObjectEditor", methodName : "new"});
						haxe.Log.trace((function($this) {
							var $r;
							var _g21 = d._1;
							$r = (function($this) {
								var $r;
								switch(_g21[1]) {
								case 2:
									$r = (function($this) {
										var $r;
										var d1 = _g21[2];
										$r = cards.ui.input._TypedValue.TypedValue_Impl_.toString(d1);
										return $r;
									}($this));
									break;
								default:
									$r = Std.string(d._1);
								}
								return $r;
							}($this));
							return $r;
						}(this)),{ fileName : "BaseObjectEditor.hx", lineNumber : 89, className : "cards.ui.input.BaseObjectEditor", methodName : "new"});
						throw "unable to assign " + cards.ui.input._DiffAt.DiffAt_Impl_.toString(d) + " within ObjectEditor";
					}
				}
				break;
			case 0:
				var diff = _g11;
				if(path.length > 0) {
					var first = path.shift();
					switch(first[1]) {
					case 0:
						var name5 = first[2];
						if((function($this) {
							var $r;
							var _g2 = _g.defMap.get(name5).field.type;
							$r = (function($this) {
								var $r;
								switch(_g2[1]) {
								case 4:case 0:
									$r = true;
									break;
								default:
									$r = false;
								}
								return $r;
							}($this));
							return $r;
						}(this))) _g.ensureField(name5).diff.emit(thx.stream.StreamValue.Pulse({ _0 : path, _1 : diff})); else throw "unable to forward " + cards.ui.input._DiffAt.DiffAt_Impl_.toString(d) + " within ObjectEditor";
						break;
					default:
						throw "unable to forward " + cards.ui.input._DiffAt.DiffAt_Impl_.toString(d) + " within ObjectEditor";
					}
				} else switch(_g11[1]) {
				case 2:
					var tv1 = _g11[2];
					if(Type.enumEq(_g.type,tv1._0)) {
					} else {
						haxe.Log.trace(cards.ui.input._Path.Path_Impl_.toString(d._0),{ fileName : "BaseObjectEditor.hx", lineNumber : 88, className : "cards.ui.input.BaseObjectEditor", methodName : "new"});
						haxe.Log.trace((function($this) {
							var $r;
							var _g21 = d._1;
							$r = (function($this) {
								var $r;
								switch(_g21[1]) {
								case 2:
									$r = (function($this) {
										var $r;
										var d1 = _g21[2];
										$r = cards.ui.input._TypedValue.TypedValue_Impl_.toString(d1);
										return $r;
									}($this));
									break;
								default:
									$r = Std.string(d._1);
								}
								return $r;
							}($this));
							return $r;
						}(this)),{ fileName : "BaseObjectEditor.hx", lineNumber : 89, className : "cards.ui.input.BaseObjectEditor", methodName : "new"});
						throw "unable to assign " + cards.ui.input._DiffAt.DiffAt_Impl_.toString(d) + " within ObjectEditor";
					}
					break;
				default:
					haxe.Log.trace(cards.ui.input._Path.Path_Impl_.toString(d._0),{ fileName : "BaseObjectEditor.hx", lineNumber : 88, className : "cards.ui.input.BaseObjectEditor", methodName : "new"});
					haxe.Log.trace((function($this) {
						var $r;
						var _g21 = d._1;
						$r = (function($this) {
							var $r;
							switch(_g21[1]) {
							case 2:
								$r = (function($this) {
									var $r;
									var d1 = _g21[2];
									$r = cards.ui.input._TypedValue.TypedValue_Impl_.toString(d1);
									return $r;
								}($this));
								break;
							default:
								$r = Std.string(d._1);
							}
							return $r;
						}($this));
						return $r;
					}(this)),{ fileName : "BaseObjectEditor.hx", lineNumber : 89, className : "cards.ui.input.BaseObjectEditor", methodName : "new"});
					throw "unable to assign " + cards.ui.input._DiffAt.DiffAt_Impl_.toString(d) + " within ObjectEditor";
				}
				break;
			default:
				var diff = _g11;
				if(path.length > 0) {
					var first = path.shift();
					switch(first[1]) {
					case 0:
						var name5 = first[2];
						if((function($this) {
							var $r;
							var _g2 = _g.defMap.get(name5).field.type;
							$r = (function($this) {
								var $r;
								switch(_g2[1]) {
								case 4:case 0:
									$r = true;
									break;
								default:
									$r = false;
								}
								return $r;
							}($this));
							return $r;
						}(this))) _g.ensureField(name5).diff.emit(thx.stream.StreamValue.Pulse({ _0 : path, _1 : diff})); else throw "unable to forward " + cards.ui.input._DiffAt.DiffAt_Impl_.toString(d) + " within ObjectEditor";
						break;
					default:
						throw "unable to forward " + cards.ui.input._DiffAt.DiffAt_Impl_.toString(d) + " within ObjectEditor";
					}
				} else {
					haxe.Log.trace(cards.ui.input._Path.Path_Impl_.toString(d._0),{ fileName : "BaseObjectEditor.hx", lineNumber : 88, className : "cards.ui.input.BaseObjectEditor", methodName : "new"});
					haxe.Log.trace((function($this) {
						var $r;
						var _g21 = d._1;
						$r = (function($this) {
							var $r;
							switch(_g21[1]) {
							case 2:
								$r = (function($this) {
									var $r;
									var d1 = _g21[2];
									$r = cards.ui.input._TypedValue.TypedValue_Impl_.toString(d1);
									return $r;
								}($this));
								break;
							default:
								$r = Std.string(d._1);
							}
							return $r;
						}($this));
						return $r;
					}(this)),{ fileName : "BaseObjectEditor.hx", lineNumber : 89, className : "cards.ui.input.BaseObjectEditor", methodName : "new"});
					throw "unable to assign " + cards.ui.input._DiffAt.DiffAt_Impl_.toString(d) + " within ObjectEditor";
				}
			}
		}
		_g.pulse();
	});
	thx.core.Arrays.mapi(fields,function(field,i) {
		_g.addFieldDefinition(field,i);
	});
};
cards.ui.input.BaseObjectEditor.__name__ = ["cards","ui","input","BaseObjectEditor"];
cards.ui.input.BaseObjectEditor.findRef = function(table,index) {
	var trs = udom.Query.childrenOf(udom._Dom.H.toArray(udom.Query.list("tr",table)),table);
	var _g = 0;
	while(_g < trs.length) {
		var tr = trs[_g];
		++_g;
		var ref = tr.getAttribute("data-index");
		if(ref > index) return tr;
	}
	return null;
};
cards.ui.input.BaseObjectEditor.__super__ = cards.ui.input.RouteEditor;
cards.ui.input.BaseObjectEditor.prototype = $extend(cards.ui.input.RouteEditor.prototype,{
	fields: null
	,object: null
	,editors: null
	,defMap: null
	,table: null
	,currentField: null
	,toolbar: null
	,ensureField: function(name) {
		if(!this.editors.exists(name)) this.realizeField(name);
		return this.editors.get(name);
	}
	,addFieldDefinition: function(field,index) {
		this.checkUnique(field.name);
		if(null == index) index = this.fields.length;
		this.defMap.set(field.name,{ field : field, index : index});
		this.fields.push(field);
		this.type = cards.model.SchemaType.ObjectType(this.fields);
		if(!field.optional) this.realizeField(field.name);
	}
	,createFieldLabel: function(parent,container,name) {
		container.textContent = name;
	}
	,realizeField: function(name,type) {
		if(this.editors.exists(name)) throw "field " + name + " already realized";
		var def = thx.core.Arrays.find(this.fields,function(field) {
			return field.name == name;
		});
		if(null == def) throw "unable to realize " + name + " because it is not defined in ObjectType";
		if(null == type) type = def.type;
		var editor;
		switch(type[1]) {
		case 4:case 0:
			var rowh;
			var _this = window.document;
			rowh = _this.createElement("tr");
			var rowd;
			var _this1 = window.document;
			rowd = _this1.createElement("tr");
			var th = window.document.createElement("th");
			var td = window.document.createElement("td");
			var index = this.defMap.get(name).index;
			rowh.setAttribute("data-index",index);
			rowd.setAttribute("data-index",index);
			th.colSpan = 2;
			this.createFieldLabel(this.component,th,name);
			th.className = "composite";
			td.colSpan = 2;
			td.className = "composite";
			var editor1 = cards.ui.input.EditorFactory.create(type,td,this.component);
			rowh.appendChild(th);
			rowd.appendChild(td);
			var ref = cards.ui.input.BaseObjectEditor.findRef(this.table,index);
			if(null != ref) this.table.insertBefore(rowd,ref); else this.table.appendChild(rowd);
			this.table.insertBefore(rowh,rowd);
			editor = editor1;
			break;
		default:
			var row;
			var _this2 = window.document;
			row = _this2.createElement("tr");
			var th1 = window.document.createElement("th");
			var td1 = window.document.createElement("td");
			var index1 = this.defMap.get(name).index;
			row.setAttribute("data-index",index1);
			this.createFieldLabel(this.component,th1,name);
			th1.className = "primitive";
			td1.className = "primitive";
			var editor2 = cards.ui.input.EditorFactory.create(type,td1,this.component);
			row.appendChild(th1);
			row.appendChild(td1);
			var ref1 = cards.ui.input.BaseObjectEditor.findRef(this.table,index1);
			if(null != ref1) this.table.insertBefore(row,ref1); else this.table.appendChild(row);
			editor = editor2;
		}
		this.editors.set(name,editor);
		editor.focus.feed(this.focus);
		editor.focus.withValue(true).map(function(_) {
			return def.name;
		}).toOption().feed(this.currentField);
		editor.stream.map(function(v) {
			var path = cards.ui.input._Path.Path_Impl_.stringAsPath(name);
			var diff = cards.ui.input.Diff.Set(v);
			return { _0 : path, _1 : diff};
		}).plug(this.diff);
		this.diff.pulse((function($this) {
			var $r;
			var path1 = cards.ui.input._Path.Path_Impl_.stringAsPath(name);
			$r = { _0 : path1, _1 : cards.ui.input.Diff.Add};
			return $r;
		}(this)));
	}
	,typeAt: function(path) {
		{
			var _g = path;
			var arr = _g;
			switch(_g.length) {
			case 1:
				switch(_g[0][1]) {
				case 0:
					var name = _g[0][2];
					return this.editors.get(name).type;
				case 1:
					throw "invalid path " + cards.ui.input._Path.Path_Impl_.toString(path);
					break;
				}
				break;
			case 0:
				return this.type;
			default:
				arr = arr.slice();
				var first = arr.pop();
				switch(first[1]) {
				case 0:
					var name1 = first[2];
					if(Std["is"](this.editors.get(name1),cards.ui.input.IRouteEditor)) return Std.instance(this.editors.get(name1),cards.ui.input.IRouteEditor).typeAt(arr); else throw "invalid path " + Std.string(arr);
					break;
				default:
					throw "invalid path " + Std.string(arr);
				}
			}
		}
	}
	,removeField: function(name) {
		var _g = this;
		var editor = this.editors.get(name);
		var def = this.defMap.get(name);
		editor.dispose();
		this.editors.remove(name);
		var rows = udom.Query.childrenOf(udom._Dom.H.toArray(udom.Query.list("tr[data-index=\"" + def.index + "\"]",this.table)),this.table);
		rows.slice().map(function(row) {
			_g.table.removeChild(row);
		});
		this.currentField.set(haxe.ds.Option.None);
	}
	,checkUnique: function(name) {
		var _g = 0;
		var _g1 = this.fields;
		while(_g < _g1.length) {
			var field = _g1[_g];
			++_g;
			if(name == field.name) throw "" + name + " field already exists in this ObjectType";
		}
	}
	,pulse: function() {
		this.stream.emit(thx.stream.StreamValue.Pulse((function($this) {
			var $r;
			var _1 = $this.object;
			$r = { _0 : $this.type, _1 : _1};
			return $r;
		}(this))));
	}
	,__class__: cards.ui.input.BaseObjectEditor
});
cards.ui.input.AnonymousObjectEditor = function(container,parent,allowedTypes) {
	var _g = this;
	cards.ui.input.BaseObjectEditor.call(this,container,parent,[]);
	if(null == allowedTypes) this.allowedTypes = cards.ui.input.AnonymousObjectEditor.defaultTypes; else this.allowedTypes = allowedTypes;
	this.menuAdd = new cards.ui.widgets.Menu({ parent : this.component});
	this.initMenu();
	var buttonAdd = this.toolbar.left.addButton("",Config.icons.addMenu);
	buttonAdd.clicks.subscribe(function(_) {
		_g.menuAdd.anchorTo(buttonAdd.component.el);
		_g.menuAdd.visible.stream.set(true);
	});
};
cards.ui.input.AnonymousObjectEditor.__name__ = ["cards","ui","input","AnonymousObjectEditor"];
cards.ui.input.AnonymousObjectEditor.__super__ = cards.ui.input.BaseObjectEditor;
cards.ui.input.AnonymousObjectEditor.prototype = $extend(cards.ui.input.BaseObjectEditor.prototype,{
	menuAdd: null
	,allowedTypes: null
	,initMenu: function() {
		var _g = this;
		this.allowedTypes.map(function(item) {
			var button = new cards.ui.widgets.Button("add <b>" + item.description + "</b>");
			button.clicks.subscribe(function(_) {
				var name = _g.guessFieldName();
				_g.addFieldDefinition({ name : name, type : item.type, optional : true});
				_g.realizeField(name);
				_g.editors.get(name).focus.set(true);
			});
			_g.menuAdd.addItem(button.component);
		});
	}
	,removeField: function(name) {
		cards.ui.input.BaseObjectEditor.prototype.removeField.call(this,name);
		this.fields = this.fields.filter(function(field) {
			return field.name != name;
		});
		this.type = cards.model.SchemaType.ObjectType(this.fields);
		this.defMap.remove(name);
	}
	,createFieldLabel: function(parent,container,name) {
		var _g = this;
		var editor = new cards.ui.input.FieldNameEditor(container,parent);
		editor.stream.map(function(v) {
			return v._1;
		}).debounce(10).window(2,false).subscribe(function(names) {
			switch(names.length) {
			case 2:
				var n = names[1];
				var o = names[0];
				if(_g.editors.exists(n)) editor.stream.pulse((function($this) {
					var $r;
					var s = _g.guessFieldName(n);
					$r = (function($this) {
						var $r;
						var _1 = s;
						$r = { _0 : cards.model.SchemaType.StringType, _1 : _1};
						return $r;
					}($this));
					return $r;
				}(this))); else {
					var n1 = names[1];
					var o1 = names[0];
					var def = _g.defMap.get(o1);
					_g.defMap.remove(o1);
					def.field.name = n1;
					_g.defMap.set(n1,def);
					_g.editors.remove(o1);
					_g.editors.set(n1,editor);
					_g.type = cards.model.SchemaType.ObjectType(thx.core.Iterators.order(_g.defMap.iterator(),function(a,b) {
						return a.index - b.index;
					}).map(function(v1) {
						return v1.field;
					}));
				}
				break;
			default:
				throw "createFieldLabel should never reach this point";
			}
		});
		editor.stream.emit(thx.stream.StreamValue.Pulse((function($this) {
			var $r;
			var _11 = name;
			$r = { _0 : cards.model.SchemaType.StringType, _1 : _11};
			return $r;
		}(this))));
	}
	,guessFieldName: function(prefix) {
		if(prefix == null) prefix = "field";
		var id = 0;
		var t;
		var assemble = function(id1) {
			if(id1 > 0) return [prefix,"" + id1].join("_"); else return prefix;
		};
		while((function($this) {
			var $r;
			var key = t = assemble(id);
			$r = $this.editors.exists(key);
			return $r;
		}(this))) id++;
		return t;
	}
	,__class__: cards.ui.input.AnonymousObjectEditor
});
cards.ui.input.ArrayEditor = function(container,parent,innerType) {
	var _g2 = this;
	this.values = [];
	this.editors = [];
	this.currentIndex = thx.stream.Value.createOption();
	var options = { template : "<div class=\"editor array\"></div>", container : container, parent : parent};
	cards.ui.input.RouteEditor.call(this,cards.model.SchemaType.ArrayType(innerType),options);
	this.innerType = innerType;
	var toolbar = new cards.ui.widgets.Toolbar({ parent : this.component, container : this.component.el});
	var _this = window.document;
	this.list = _this.createElement("ol");
	var items;
	var _this1 = window.document;
	items = _this1.createElement("div");
	items.className = "items";
	this.component.el.appendChild(items);
	items.appendChild(this.list);
	var buttonAdd = toolbar.left.addButton("",Config.icons.add);
	var buttonRemove = toolbar.right.addButton("",Config.icons.remove);
	thx.stream.EmitterOptions.toBool(this.currentIndex).feed(buttonRemove.enabled);
	this.diff.subscribe(function(d) {
		{
			var _g = d._0;
			var _g1 = d._1;
			var path = _g;
			switch(_g.length) {
			case 1:
				switch(_g[0][1]) {
				case 1:
					var diff = _g1;
					switch(_g1[1]) {
					case 0:
						var i = _g[0][2];
						_g2.values.splice(i,1);
						_g2.removeEditor(i);
						break;
					case 1:
						var i1 = _g[0][2];
						var x = null;
						_g2.values.splice(i1,0,x);
						_g2.createEditor(i1);
						break;
					case 2:
						var i2 = _g[0][2];
						var tv = _g1[2];
						if(Type.enumEq(tv._0,innerType)) {
							_g2.values[i2] = tv._1;
							_g2.setEditor(i2,tv);
						} else if(path.length > 0) {
							var first = path.shift();
							switch(first[1]) {
							case 1:
								var index = first[2];
								if(js.Boot.__instanceof(_g2.editors[index],cards.ui.input.IRouteEditor)) _g2.editors[index].diff.emit(thx.stream.StreamValue.Pulse({ _0 : path, _1 : diff})); else throw "unable to forward " + cards.ui.input._DiffAt.DiffAt_Impl_.toString(d) + " within ArrayEditor";
								break;
							default:
								throw "unable to forward " + cards.ui.input._DiffAt.DiffAt_Impl_.toString(d) + " within ArrayEditor";
							}
						} else throw "unable to assign " + cards.ui.input._DiffAt.DiffAt_Impl_.toString(d) + " within ArrayEditor";
						break;
					default:
						if(path.length > 0) {
							var first = path.shift();
							switch(first[1]) {
							case 1:
								var index = first[2];
								if(js.Boot.__instanceof(_g2.editors[index],cards.ui.input.IRouteEditor)) _g2.editors[index].diff.emit(thx.stream.StreamValue.Pulse({ _0 : path, _1 : diff})); else throw "unable to forward " + cards.ui.input._DiffAt.DiffAt_Impl_.toString(d) + " within ArrayEditor";
								break;
							default:
								throw "unable to forward " + cards.ui.input._DiffAt.DiffAt_Impl_.toString(d) + " within ArrayEditor";
							}
						} else throw "unable to assign " + cards.ui.input._DiffAt.DiffAt_Impl_.toString(d) + " within ArrayEditor";
					}
					break;
				default:
					var diff = _g1;
					if(path.length > 0) {
						var first = path.shift();
						switch(first[1]) {
						case 1:
							var index = first[2];
							if(js.Boot.__instanceof(_g2.editors[index],cards.ui.input.IRouteEditor)) _g2.editors[index].diff.emit(thx.stream.StreamValue.Pulse({ _0 : path, _1 : diff})); else throw "unable to forward " + cards.ui.input._DiffAt.DiffAt_Impl_.toString(d) + " within ArrayEditor";
							break;
						default:
							throw "unable to forward " + cards.ui.input._DiffAt.DiffAt_Impl_.toString(d) + " within ArrayEditor";
						}
					} else throw "unable to assign " + cards.ui.input._DiffAt.DiffAt_Impl_.toString(d) + " within ArrayEditor";
				}
				break;
			case 0:
				var diff = _g1;
				if(path.length > 0) {
					var first = path.shift();
					switch(first[1]) {
					case 1:
						var index = first[2];
						if(js.Boot.__instanceof(_g2.editors[index],cards.ui.input.IRouteEditor)) _g2.editors[index].diff.emit(thx.stream.StreamValue.Pulse({ _0 : path, _1 : diff})); else throw "unable to forward " + cards.ui.input._DiffAt.DiffAt_Impl_.toString(d) + " within ArrayEditor";
						break;
					default:
						throw "unable to forward " + cards.ui.input._DiffAt.DiffAt_Impl_.toString(d) + " within ArrayEditor";
					}
				} else switch(_g1[1]) {
				case 2:
					var tv1 = _g1[2];
					if(Type.enumEq(_g2.type,tv1._0)) {
					} else throw "unable to assign " + cards.ui.input._DiffAt.DiffAt_Impl_.toString(d) + " within ArrayEditor";
					break;
				default:
					throw "unable to assign " + cards.ui.input._DiffAt.DiffAt_Impl_.toString(d) + " within ArrayEditor";
				}
				break;
			default:
				var diff = _g1;
				if(path.length > 0) {
					var first = path.shift();
					switch(first[1]) {
					case 1:
						var index = first[2];
						if(js.Boot.__instanceof(_g2.editors[index],cards.ui.input.IRouteEditor)) _g2.editors[index].diff.emit(thx.stream.StreamValue.Pulse({ _0 : path, _1 : diff})); else throw "unable to forward " + cards.ui.input._DiffAt.DiffAt_Impl_.toString(d) + " within ArrayEditor";
						break;
					default:
						throw "unable to forward " + cards.ui.input._DiffAt.DiffAt_Impl_.toString(d) + " within ArrayEditor";
					}
				} else throw "unable to assign " + cards.ui.input._DiffAt.DiffAt_Impl_.toString(d) + " within ArrayEditor";
			}
		}
		_g2.pulse();
	});
	thx.stream.EmitterOptions.filterOption(this.currentIndex.audit(function(_) {
		var prev = udom.Query.childOf(udom.Query.first("li.active",_g2.list),_g2.list);
		if(null == prev) return;
		prev.classList.remove("active");
	})).subscribe(function(index1) {
		var el = udom.Query.childOf(udom.Query.first("li:nth-child(" + (index1 + 1) + ")",_g2.list),_g2.list);
		if(null == el) return;
		el.classList.add("active");
	});
	buttonAdd.clicks.subscribe(function(_1) {
		var index2;
		if(thx.core.Options.toBool(_g2.currentIndex.get())) index2 = thx.core.Options.toValue(_g2.currentIndex.get()) + 1; else index2 = _g2.values.length;
		_g2.diff.pulse((function($this) {
			var $r;
			var path1 = cards.ui.input._Path.Path_Impl_.intAsPath(index2);
			$r = { _0 : path1, _1 : cards.ui.input.Diff.Add};
			return $r;
		}(this)));
		_g2.editors[index2].focus.set(true);
	});
	buttonRemove.clicks.subscribe(function(_2) {
		if(!thx.core.Options.toBool(_g2.currentIndex.get())) return;
		var index3 = thx.core.Options.toValue(_g2.currentIndex.get());
		_g2.diff.pulse((function($this) {
			var $r;
			var path2 = cards.ui.input._Path.Path_Impl_.intAsPath(index3);
			$r = { _0 : path2, _1 : cards.ui.input.Diff.Remove};
			return $r;
		}(this)));
	});
};
cards.ui.input.ArrayEditor.__name__ = ["cards","ui","input","ArrayEditor"];
cards.ui.input.ArrayEditor.__super__ = cards.ui.input.RouteEditor;
cards.ui.input.ArrayEditor.prototype = $extend(cards.ui.input.RouteEditor.prototype,{
	list: null
	,editors: null
	,innerType: null
	,currentIndex: null
	,values: null
	,pushItem: function(value) {
		this.insertItem(this.values.length,value);
	}
	,insertItem: function(index,value) {
		this.diff.pulse((function($this) {
			var $r;
			var path = cards.ui.input._Path.Path_Impl_.intAsPath(index);
			$r = { _0 : path, _1 : cards.ui.input.Diff.Add};
			return $r;
		}(this)));
		if(null != value) this.diff.pulse((function($this) {
			var $r;
			var path1 = cards.ui.input._Path.Path_Impl_.intAsPath(index);
			var diff = cards.ui.input.Diff.Set(value);
			$r = { _0 : path1, _1 : diff};
			return $r;
		}(this)));
	}
	,typeAt: function(path) {
		{
			var _g = path;
			var arr = _g;
			switch(_g.length) {
			case 1:
				switch(_g[0][1]) {
				case 1:
					return this.innerType;
				default:
					arr = arr.slice();
					var first = arr.pop();
					switch(first[1]) {
					case 1:
						var i = first[2];
						if(js.Boot.__instanceof(this.editors[i],cards.ui.input.IRouteEditor)) return Std.instance(this.editors[i],cards.ui.input.IRouteEditor).typeAt(arr); else throw "invalid path " + Std.string(arr);
						break;
					default:
						throw "invalid path " + Std.string(arr);
					}
				}
				break;
			case 0:
				return this.type;
			default:
				arr = arr.slice();
				var first = arr.pop();
				switch(first[1]) {
				case 1:
					var i = first[2];
					if(js.Boot.__instanceof(this.editors[i],cards.ui.input.IRouteEditor)) return Std.instance(this.editors[i],cards.ui.input.IRouteEditor).typeAt(arr); else throw "invalid path " + Std.string(arr);
					break;
				default:
					throw "invalid path " + Std.string(arr);
				}
			}
		}
	}
	,createEditor: function(index) {
		var _g = this;
		var item;
		var _this = window.document;
		item = _this.createElement("li");
		var ref = udom.Query.childOf(udom.Query.first("li:nth-child(" + (index + 1) + ")",this.list),this.list);
		if(null == ref) this.list.appendChild(item); else this.list.insertBefore(item,ref);
		var editor = cards.ui.input.EditorFactory.create(this.innerType,item,this.component);
		this.editors.splice(index,0,editor);
		editor.focus.feed(this.focus);
		editor.focus.withValue(true).map(function(_) {
			return editor.component.el.parentElement;
		}).map(function(el) {
			return udom.Query.getElementIndex(el);
		}).toOption().feed(this.currentIndex);
		editor.stream.filter(function(v) {
			return thx.core.Options.toBool(_g.currentIndex.get());
		}).map(function(v1) {
			var path = cards.ui.input._Path.Path_Impl_.intAsPath(thx.core.Options.toValue(_g.currentIndex.get()));
			var diff = cards.ui.input.Diff.Set(v1);
			return { _0 : path, _1 : diff};
		}).distinct(cards.ui.input._DiffAt.DiffAt_Impl_.equal).subscribe(function(v2) {
			_g.diff.emit(thx.stream.StreamValue.Pulse(v2));
		});
	}
	,setEditor: function(index,value) {
		this.editors[index].stream.emit(thx.stream.StreamValue.Pulse(value));
	}
	,removeEditor: function(index) {
		var _g = this;
		var item = udom.Query.childOf(udom.Query.first("li:nth-child(" + (index + 1) + ")",this.list),this.list);
		var editor = this.editors[index];
		this.list.removeChild(item);
		editor.dispose();
		this.editors.splice(index,1);
		this.currentIndex.set(haxe.ds.Option.None);
		thx.core.Timer.delay(function() {
			if(_g.editors.length == 0) return;
			if(index == _g.editors.length) index--;
			_g.editors[index].focus.set(true);
		},10);
	}
	,pulse: function() {
		this.stream.emit(thx.stream.StreamValue.Pulse((function($this) {
			var $r;
			var _1 = $this.values;
			$r = { _0 : $this.type, _1 : _1};
			return $r;
		}(this))));
	}
	,__class__: cards.ui.input.ArrayEditor
});
cards.ui.input.BoolEditor = function(container,parent) {
	var options = { template : "<input class=\"editor bool\" placeholder=\"on/off\" type=\"checkbox\" />", container : container, parent : parent};
	cards.ui.input.Editor.call(this,cards.model.SchemaType.BoolType,options);
	var el = this.component.el;
	thx.stream.dom.Dom.streamEvent(el,"change").map(function(_) {
		var _1 = el.checked;
		return { _0 : cards.model.SchemaType.BoolType, _1 : _1};
	}).plug(this.stream);
	thx.stream.dom.Dom.streamFocus(el).feed(this.focus);
	this.stream.subscribe(function(num) {
		var v = num._1;
		if(el.value != v) el.value = v;
	});
	this.focus.subscribe(thx.stream.dom.Dom.subscribeFocus(el));
};
cards.ui.input.BoolEditor.__name__ = ["cards","ui","input","BoolEditor"];
cards.ui.input.BoolEditor.__super__ = cards.ui.input.Editor;
cards.ui.input.BoolEditor.prototype = $extend(cards.ui.input.Editor.prototype,{
	__class__: cards.ui.input.BoolEditor
});
cards.ui.input.CodeMirrorEditor = function(container,parent) {
	var _g = this;
	var options = { template : "<div class=\"editor code\"></div>", container : container, parent : parent};
	cards.ui.input.Editor.call(this,cards.model.SchemaType.CodeType,options);
	this.editor = CodeMirror(this.component.el,{ mode : "javascript", tabSize : 2, lineNumbers : true, tabindex : 1, lineWrapping : true});
	this.editor.on("changes",$bind(this,this.changes));
	this.editor.on("focus",$bind(this,this.setFocus));
	this.editor.on("blur",$bind(this,this.blurFocus));
	this.stream.subscribe(function(text) {
		var v = text._1;
		if(_g.editor.doc.getValue() != v) _g.editor.doc.setValue(v);
	});
	this.focus.subscribe(function(_) {
		_g.editor.focus();
	});
	thx.core.Timer.delay(function() {
		_g.editor.refresh();
	},10);
};
cards.ui.input.CodeMirrorEditor.__name__ = ["cards","ui","input","CodeMirrorEditor"];
cards.ui.input.CodeMirrorEditor.__super__ = cards.ui.input.Editor;
cards.ui.input.CodeMirrorEditor.prototype = $extend(cards.ui.input.Editor.prototype,{
	editor: null
	,changes: function() {
		var content = this.editor.doc.getValue();
		this.stream.emit(thx.stream.StreamValue.Pulse((function($this) {
			var $r;
			var _1 = content;
			$r = { _0 : cards.model.SchemaType.CodeType, _1 : _1};
			return $r;
		}(this))));
	}
	,setFocus: function() {
		this.focus.set(true);
	}
	,blurFocus: function() {
		this.focus.set(false);
	}
	,dispose: function() {
		cards.ui.input.Editor.prototype.dispose.call(this);
		this.editor.off("changes",$bind(this,this.changes));
		this.editor.off("focus",$bind(this,this.setFocus));
		this.editor.off("blur",$bind(this,this.blurFocus));
		this.editor = null;
	}
	,__class__: cards.ui.input.CodeMirrorEditor
});
cards.ui.input.DateEditor = function(container,parent,useTime) {
	if(useTime == null) useTime = true;
	var _g = this;
	if(useTime) this.format = "%Y-%m-%dT%H:%M"; else this.format = "%Y-%m-%d";
	var options = { template : "<input class=\"editor date\" placeholder=\"insert date\" type=\"" + (useTime?"datetime-local":"date") + "\" />", container : container, parent : parent};
	cards.ui.input.Editor.call(this,cards.model.SchemaType.DateType,options);
	var el = this.component.el;
	thx.stream.dom.Dom.streamEvent(el,"change").map(function(_) {
		try {
			var d = HxOverrides.strDate(el.value);
			var _1 = d;
			return { _0 : cards.model.SchemaType.DateType, _1 : _1};
		} catch( e ) {
			return null;
		}
	}).notNull().filter(function(v) {
		return !(function($this) {
			var $r;
			var f = v._1.getTime();
			$r = isNaN(f);
			return $r;
		}(this));
	}).plug(this.stream);
	thx.stream.dom.Dom.streamFocus(el).feed(this.focus);
	this.stream.subscribe(function(num) {
		var v1 = num._1;
		var s = DateTools.format(v1,_g.format);
		if(el.value != s) el.value = s;
	});
	this.focus.subscribe(thx.stream.dom.Dom.subscribeFocus(el));
};
cards.ui.input.DateEditor.__name__ = ["cards","ui","input","DateEditor"];
cards.ui.input.DateEditor.__super__ = cards.ui.input.Editor;
cards.ui.input.DateEditor.prototype = $extend(cards.ui.input.Editor.prototype,{
	format: null
	,__class__: cards.ui.input.DateEditor
});
cards.ui.input.Diff = { __ename__ : ["cards","ui","input","Diff"], __constructs__ : ["Remove","Add","Set"] };
cards.ui.input.Diff.Remove = ["Remove",0];
cards.ui.input.Diff.Remove.__enum__ = cards.ui.input.Diff;
cards.ui.input.Diff.Add = ["Add",1];
cards.ui.input.Diff.Add.__enum__ = cards.ui.input.Diff;
cards.ui.input.Diff.Set = function(value) { var $x = ["Set",2,value]; $x.__enum__ = cards.ui.input.Diff; return $x; };
cards.ui.input._DiffAt = {};
cards.ui.input._DiffAt.DiffAt_Impl_ = function() { };
cards.ui.input._DiffAt.DiffAt_Impl_.__name__ = ["cards","ui","input","_DiffAt","DiffAt_Impl_"];
cards.ui.input._DiffAt.DiffAt_Impl_._new = function(path,diff) {
	return { _0 : path, _1 : diff};
};
cards.ui.input._DiffAt.DiffAt_Impl_.get_path = function(this1) {
	return this1._0;
};
cards.ui.input._DiffAt.DiffAt_Impl_.get_diff = function(this1) {
	return this1._1;
};
cards.ui.input._DiffAt.DiffAt_Impl_.equal = function(a,b) {
	if(null == a && null == b) return true; else if(null == a || null == b) return false; else return cards.ui.input._Path.Path_Impl_.equal(a._0,b._0) && thx.core.Dynamics.equals(a._1,b._1);
};
cards.ui.input._DiffAt.DiffAt_Impl_.toString = function(this1) {
	return cards.ui.input._Path.Path_Impl_.toString(this1._0) + ":" + Std.string(this1._1);
};
cards.ui.input.EditorFactory = function() { };
cards.ui.input.EditorFactory.__name__ = ["cards","ui","input","EditorFactory"];
cards.ui.input.EditorFactory.create = function(type,container,parent) {
	switch(type[1]) {
	case 0:
		var t = type[2];
		return new cards.ui.input.ArrayEditor(container,parent,t);
	case 1:
		return new cards.ui.input.BoolEditor(container,parent);
	case 6:
		return new cards.ui.input.CodeMirrorEditor(container,parent);
	case 2:
		return new cards.ui.input.DateEditor(container,parent,false);
	case 3:
		return new cards.ui.input.NumberEditor(container,parent);
	case 4:
		var fields = type[2];
		if(fields.length == 0) return new cards.ui.input.AnonymousObjectEditor(container,parent); else return new cards.ui.input.ObjectEditor(container,parent,fields);
		break;
	case 7:
		return new cards.ui.input.ReferenceEditor(container,parent);
	case 5:
		return new cards.ui.input.TextEditor(container,parent);
	}
};
cards.ui.input.InputBasedEditor = function(container,parent,valueType,name,type,event,extract,assign) {
	if(event == null) event = "change";
	if(null == type) type = name;
	if(null == extract) extract = function(input) {
		var _1 = input.value;
		return { _0 : cards.model.SchemaType.StringType, _1 : _1};
	};
	if(null == assign) assign = function(input1,value) {
		input1.value = value._1;
	};
	var options = { template : "<input class=\"editor " + name + "\" placeholder=\"" + name + "\" type=\"" + type + "\" />", container : container, parent : parent};
	cards.ui.input.Editor.call(this,valueType,options);
	var el = this.component.el;
	thx.stream.dom.Dom.streamEvent(el,event).map(function(_) {
		return extract(el);
	}).plug(this.stream);
	thx.stream.dom.Dom.streamFocus(el).feed(this.focus);
	this.stream.subscribe(function(value1) {
		var v = value1._1;
		if(extract(el) != v) assign(el,value1);
	});
	this.focus.subscribe(thx.stream.dom.Dom.subscribeFocus(el));
};
cards.ui.input.InputBasedEditor.__name__ = ["cards","ui","input","InputBasedEditor"];
cards.ui.input.InputBasedEditor.__super__ = cards.ui.input.Editor;
cards.ui.input.InputBasedEditor.prototype = $extend(cards.ui.input.Editor.prototype,{
	__class__: cards.ui.input.InputBasedEditor
});
cards.ui.input.FieldNameEditor = function(container,parent) {
	cards.ui.input.InputBasedEditor.call(this,container,parent,cards.model.SchemaType.FloatType,"fieldname","text","change");
	this.component.el.addEventListener("keyup",function(e) {
	},false);
};
cards.ui.input.FieldNameEditor.__name__ = ["cards","ui","input","FieldNameEditor"];
cards.ui.input.FieldNameEditor.__super__ = cards.ui.input.InputBasedEditor;
cards.ui.input.FieldNameEditor.prototype = $extend(cards.ui.input.InputBasedEditor.prototype,{
	__class__: cards.ui.input.FieldNameEditor
});
cards.ui.input.NumberEditor = function(container,parent) {
	cards.ui.input.InputBasedEditor.call(this,container,parent,cards.model.SchemaType.FloatType,"number","number","input",function(el) {
		var _1 = el.valueAsNumber;
		return { _0 : cards.model.SchemaType.FloatType, _1 : _1};
	});
};
cards.ui.input.NumberEditor.__name__ = ["cards","ui","input","NumberEditor"];
cards.ui.input.NumberEditor.__super__ = cards.ui.input.InputBasedEditor;
cards.ui.input.NumberEditor.prototype = $extend(cards.ui.input.InputBasedEditor.prototype,{
	__class__: cards.ui.input.NumberEditor
});
cards.ui.input.ObjectEditor = function(container,parent,fields) {
	this.inited = false;
	var _g = this;
	cards.ui.input.BaseObjectEditor.call(this,container,parent,fields);
	this.buttonAdd = this.toolbar.left.addButton("",Config.icons.addMenu);
	this.buttonAdd.enabled.set(false);
	this.buttonAdd.clicks.subscribe(function(_) {
		_g.menuAdd.anchorTo(_g.buttonAdd.component.el);
		_g.menuAdd.visible.stream.set(true);
	});
	this.menuAdd = new cards.ui.widgets.Menu({ parent : this.component});
	this.inited = true;
	this.setAddState();
};
cards.ui.input.ObjectEditor.__name__ = ["cards","ui","input","ObjectEditor"];
cards.ui.input.ObjectEditor.__super__ = cards.ui.input.BaseObjectEditor;
cards.ui.input.ObjectEditor.prototype = $extend(cards.ui.input.BaseObjectEditor.prototype,{
	menuAdd: null
	,buttonAdd: null
	,inited: null
	,removeField: function(name) {
		cards.ui.input.BaseObjectEditor.prototype.removeField.call(this,name);
		this.setAddState();
	}
	,realizeField: function(name,type) {
		cards.ui.input.BaseObjectEditor.prototype.realizeField.call(this,name,type);
		this.setAddState();
	}
	,setAddState: function() {
		var _g = this;
		if(!this.inited) return;
		var fields = this.fields.slice().filter(function(field) {
			return !_g.editors.exists(field.name);
		});
		var enabled = fields.length > 0;
		this.buttonAdd.enabled.set(enabled);
		if(enabled) {
			this.menuAdd.clear();
			fields.map(function(field1) {
				var button = new cards.ui.widgets.Button("add <b>" + field1.name + "</b>");
				button.clicks.subscribe(function(_) {
					_g.realizeField(field1.name);
					_g.setAddState();
					_g.editors.get(field1.name).focus.set(true);
				});
				_g.menuAdd.addItem(button.component);
			});
		}
	}
	,__class__: cards.ui.input.ObjectEditor
});
cards.ui.input._Path = {};
cards.ui.input._Path.Path_Impl_ = function() { };
cards.ui.input._Path.Path_Impl_.__name__ = ["cards","ui","input","_Path","Path_Impl_"];
cards.ui.input._Path.Path_Impl_._new = function(arr) {
	return arr;
};
cards.ui.input._Path.Path_Impl_.stringAsPath = function(path) {
	return StringTools.replace(path,"[",".[").split(".").filter(function(s) {
		return s.length > 0;
	}).map(function(v) {
		if(HxOverrides.substr(v,0,1) == "[") return cards.ui.input.PathItem.Index(Std.parseInt(HxOverrides.substr(v,1,v.length - 1))); else return cards.ui.input.PathItem.Field(v);
	});
};
cards.ui.input._Path.Path_Impl_.intAsPath = function(index) {
	var arr = [cards.ui.input.PathItem.Index(index)];
	return arr;
};
cards.ui.input._Path.Path_Impl_.asArray = function(this1) {
	return this1;
};
cards.ui.input._Path.Path_Impl_.toString = function(this1) {
	if(null == this1) return "";
	return StringTools.replace(this1.map(function(item) {
		switch(item[1]) {
		case 0:
			var name = item[2];
			return StringTools.replace(name,".","\\.");
		case 1:
			var pos = item[2];
			return "[" + pos + "]";
		}
	}).join("."),".[","[");
};
cards.ui.input._Path.Path_Impl_.equal = function(this1,other) {
	var other1 = other;
	if(this1 == null || other1 == null) return false;
	if(this1.length != other1.length) return false;
	var _g1 = 0;
	var _g = this1.length;
	while(_g1 < _g) {
		var i = _g1++;
		if(!Type.enumEq(this1[i],other1[i])) return false;
	}
	return true;
};
cards.ui.input.PathItem = { __ename__ : ["cards","ui","input","PathItem"], __constructs__ : ["Field","Index"] };
cards.ui.input.PathItem.Field = function(name) { var $x = ["Field",0,name]; $x.__enum__ = cards.ui.input.PathItem; return $x; };
cards.ui.input.PathItem.Index = function(pos) { var $x = ["Index",1,pos]; $x.__enum__ = cards.ui.input.PathItem; return $x; };
cards.ui.input.ReferenceEditor = function(container,parent) {
	cards.ui.input.InputBasedEditor.call(this,container,parent,cards.model.SchemaType.ReferenceType,"reference","text","input",function(el) {
		var _1 = el.value;
		return { _0 : cards.model.SchemaType.ReferenceType, _1 : _1};
	});
};
cards.ui.input.ReferenceEditor.__name__ = ["cards","ui","input","ReferenceEditor"];
cards.ui.input.ReferenceEditor.__super__ = cards.ui.input.InputBasedEditor;
cards.ui.input.ReferenceEditor.prototype = $extend(cards.ui.input.InputBasedEditor.prototype,{
	__class__: cards.ui.input.ReferenceEditor
});
cards.ui.input.RuntimeObjectEditor = function(container,parent,fields) {
	var _g = this;
	cards.ui.input.ObjectEditor.call(this,container,parent,fields);
	var buttonValue = this.toolbar.center.addButton(null,Config.icons.value);
	var buttonCode = this.toolbar.center.addButton(null,Config.icons.code);
	var buttonReference = this.toolbar.center.addButton(null,Config.icons.reference);
	var buttons = [buttonValue,buttonCode,buttonReference];
	var disableAllButtons = function() {
		buttons.map(function(button) {
			button.enabled.set(false);
		});
	};
	thx.stream.EmitterOptions.either(this.currentField,function(name) {
		disableAllButtons();
		var editor = _g.editors.get(name);
		if(null == editor) return;
		var toEnable = buttons.slice();
		if(Type.enumEq(editor.type,cards.model.SchemaType.ReferenceType)) HxOverrides.remove(toEnable,buttonReference); else if(Type.enumEq(editor.type,cards.model.SchemaType.CodeType)) HxOverrides.remove(toEnable,buttonCode); else HxOverrides.remove(toEnable,buttonValue);
		toEnable.map(function(button1) {
			button1.enabled.set(true);
		});
	},disableAllButtons);
	var changeEditorType = function(name1,newType) {
		_g.removeField(name1);
		_g.realizeField(name1,newType);
		_g.editors.get(name1).focus.set(true);
	};
	thx.stream.EmitterValues.left(thx.stream.EmitterOptions.filterOption(this.currentField).sampleBy(buttonCode.clicks)).subscribe((function(f,a2) {
		return function(a1) {
			return f(a1,a2);
		};
	})(changeEditorType,cards.model.SchemaType.CodeType));
	thx.stream.EmitterValues.left(thx.stream.EmitterOptions.filterOption(this.currentField).sampleBy(buttonReference.clicks)).subscribe((function(f1,a21) {
		return function(a11) {
			return f1(a11,a21);
		};
	})(changeEditorType,cards.model.SchemaType.ReferenceType));
	thx.stream.EmitterValues.left(thx.stream.EmitterOptions.filterOption(this.currentField).sampleBy(buttonValue.clicks)).subscribe((function(f2,a22) {
		return function(a12) {
			return f2(a12,a22);
		};
	})(changeEditorType,null));
};
cards.ui.input.RuntimeObjectEditor.__name__ = ["cards","ui","input","RuntimeObjectEditor"];
cards.ui.input.RuntimeObjectEditor.__super__ = cards.ui.input.ObjectEditor;
cards.ui.input.RuntimeObjectEditor.prototype = $extend(cards.ui.input.ObjectEditor.prototype,{
	__class__: cards.ui.input.RuntimeObjectEditor
});
cards.ui.input.TextEditor = function(container,parent) {
	var _g = this;
	var options = { template : "<textarea class=\"editor text\" placeholder=\"text\"></textarea>", container : container, parent : parent};
	cards.ui.input.Editor.call(this,cards.model.SchemaType.StringType,options);
	var el = this.component.el;
	thx.stream.dom.Dom.streamEvent(el,"input").audit(function(_) {
		_g.resize();
	}).map(function(_1) {
		var _11 = el.value;
		return { _0 : cards.model.SchemaType.StringType, _1 : _11};
	}).plug(this.stream);
	thx.stream.dom.Dom.streamFocus(el).feed(this.focus);
	this.stream.subscribe(function(text) {
		var v = text._1;
		if(el.value != v) el.value = v;
	});
	this.focus.subscribe(thx.stream.dom.Dom.subscribeFocus(el));
};
cards.ui.input.TextEditor.__name__ = ["cards","ui","input","TextEditor"];
cards.ui.input.TextEditor.__super__ = cards.ui.input.Editor;
cards.ui.input.TextEditor.prototype = $extend(cards.ui.input.Editor.prototype,{
	resize: function() {
		var el = this.component.el;
		el.style.height = "5px";
		el.style.height = 1 + el.scrollHeight + "px";
	}
	,__class__: cards.ui.input.TextEditor
});
cards.ui.input._TypedValue = {};
cards.ui.input._TypedValue.TypedValue_Impl_ = function() { };
cards.ui.input._TypedValue.TypedValue_Impl_.__name__ = ["cards","ui","input","_TypedValue","TypedValue_Impl_"];
cards.ui.input._TypedValue.TypedValue_Impl_._new = function(type,value) {
	var _1 = value;
	return { _0 : type, _1 : _1};
};
cards.ui.input._TypedValue.TypedValue_Impl_.asType = function(this1) {
	return this1._0;
};
cards.ui.input._TypedValue.TypedValue_Impl_.asValue = function(this1) {
	return this1._1;
};
cards.ui.input._TypedValue.TypedValue_Impl_.fromString = function(s) {
	var _1 = s;
	return { _0 : cards.model.SchemaType.StringType, _1 : _1};
};
cards.ui.input._TypedValue.TypedValue_Impl_.fromFloat = function(f) {
	var _1 = f;
	return { _0 : cards.model.SchemaType.FloatType, _1 : _1};
};
cards.ui.input._TypedValue.TypedValue_Impl_.fromDate = function(d) {
	var _1 = d;
	return { _0 : cards.model.SchemaType.DateType, _1 : _1};
};
cards.ui.input._TypedValue.TypedValue_Impl_.fromBool = function(b) {
	var _1 = b;
	return { _0 : cards.model.SchemaType.BoolType, _1 : _1};
};
cards.ui.input._TypedValue.TypedValue_Impl_.asString = function(this1) {
	return Std.string(this1._1);
};
cards.ui.input._TypedValue.TypedValue_Impl_.equal = function(a,b) {
	if(null == a && null == b) return true; else if(null == a || null == b) return false; else return thx.core.Dynamics.equals(a._1,b._1) && thx.core.Dynamics.equals(a._0,b._0);
};
cards.ui.input._TypedValue.TypedValue_Impl_.toString = function(this1) {
	return Std.string(this1._1) + " : " + Std.string(this1._0);
};
cards.ui.widgets = {};
cards.ui.widgets.AnchorPoint = { __ename__ : ["cards","ui","widgets","AnchorPoint"], __constructs__ : ["TopLeft","Top","TopRight","Left","Center","Right","BottomLeft","Bottom","BottomRight"] };
cards.ui.widgets.AnchorPoint.TopLeft = ["TopLeft",0];
cards.ui.widgets.AnchorPoint.TopLeft.__enum__ = cards.ui.widgets.AnchorPoint;
cards.ui.widgets.AnchorPoint.Top = ["Top",1];
cards.ui.widgets.AnchorPoint.Top.__enum__ = cards.ui.widgets.AnchorPoint;
cards.ui.widgets.AnchorPoint.TopRight = ["TopRight",2];
cards.ui.widgets.AnchorPoint.TopRight.__enum__ = cards.ui.widgets.AnchorPoint;
cards.ui.widgets.AnchorPoint.Left = ["Left",3];
cards.ui.widgets.AnchorPoint.Left.__enum__ = cards.ui.widgets.AnchorPoint;
cards.ui.widgets.AnchorPoint.Center = ["Center",4];
cards.ui.widgets.AnchorPoint.Center.__enum__ = cards.ui.widgets.AnchorPoint;
cards.ui.widgets.AnchorPoint.Right = ["Right",5];
cards.ui.widgets.AnchorPoint.Right.__enum__ = cards.ui.widgets.AnchorPoint;
cards.ui.widgets.AnchorPoint.BottomLeft = ["BottomLeft",6];
cards.ui.widgets.AnchorPoint.BottomLeft.__enum__ = cards.ui.widgets.AnchorPoint;
cards.ui.widgets.AnchorPoint.Bottom = ["Bottom",7];
cards.ui.widgets.AnchorPoint.Bottom.__enum__ = cards.ui.widgets.AnchorPoint;
cards.ui.widgets.AnchorPoint.BottomRight = ["BottomRight",8];
cards.ui.widgets.AnchorPoint.BottomRight.__enum__ = cards.ui.widgets.AnchorPoint;
cards.ui.widgets.Button = function(text,icon) {
	if(text == null) text = "";
	this.component = new cards.components.Component({ template : null == icon?"<button>" + text + "</button>":"<button class=\"fa fa-" + icon + "\">" + text + "</button>"});
	this.clicks = thx.stream.dom.Dom.streamEvent(this.component.el,"click",false).audit($bind(this,this.playSound));
	this.enabled = new thx.stream.Value(true);
	thx.stream.EmitterBools.negate(this.enabled).subscribe(thx.stream.dom.Dom.subscribeToggleAttribute(this.component.el,"disabled","disabled"));
};
cards.ui.widgets.Button.__name__ = ["cards","ui","widgets","Button"];
cards.ui.widgets.Button.prototype = {
	component: null
	,clicks: null
	,enabled: null
	,cancel: null
	,playSound: function(_) {
		cards.ui.widgets.Button.sound.load();
		cards.ui.widgets.Button.sound.play();
	}
	,destroy: function() {
		this.cancel();
		this.component.destroy();
	}
	,__class__: cards.ui.widgets.Button
};
cards.ui.widgets.FrameOverlay = function(options) {
	var _g = this;
	if(null == options.el && null == options.template) options.template = "<div class=\"frame-overlay\"></div>";
	this.component = new cards.components.Component(options);
	this.visible = new cards.properties.Visible(this.component,false);
	var clear = function(_) {
		_g.visible.stream.set(false);
	};
	this.visible.stream.filter(function(b) {
		return !b;
	}).subscribe(function(_1) {
		window.document.removeEventListener("mouseup",clear,false);
	});
	this.visible.stream.filter(function(b1) {
		return b1;
	}).subscribe(function(_2) {
		window.document.addEventListener("mouseup",clear,false);
		_g.reposition();
	});
	this.anchorElement = window.document.body;
};
cards.ui.widgets.FrameOverlay.__name__ = ["cards","ui","widgets","FrameOverlay"];
cards.ui.widgets.FrameOverlay.prototype = {
	component: null
	,visible: null
	,anchorElement: null
	,my: null
	,at: null
	,anchorTo: function(el,my,at) {
		this.anchorElement = el;
		if(null == my) this.my = cards.ui.widgets.AnchorPoint.TopLeft; else this.my = my;
		if(null == at) this.at = cards.ui.widgets.AnchorPoint.BottomLeft; else this.at = at;
		if(this.visible.stream.get()) this.reposition();
	}
	,reposition: function() {
		if(!this.component.isAttached) {
			var parent = [udom.Query.first(Config.selectors.app),window.document.body].filter(function(v) {
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
	,__class__: cards.ui.widgets.FrameOverlay
};
cards.ui.widgets.Menu = function(options) {
	if(null == options.el && null == options.template) options.template = "<menu class=\"frame-overlay\"><ul></ul></menu>";
	cards.ui.widgets.FrameOverlay.call(this,options);
	this.ul = udom.Query.first("ul",this.component.el);
	this.items = new haxe.ds.ObjectMap();
};
cards.ui.widgets.Menu.__name__ = ["cards","ui","widgets","Menu"];
cards.ui.widgets.Menu.__super__ = cards.ui.widgets.FrameOverlay;
cards.ui.widgets.Menu.prototype = $extend(cards.ui.widgets.FrameOverlay.prototype,{
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
		var el = this.items.h[item.__id__];
		item.detach();
		this.ul.removeChild(el);
	}
	,__class__: cards.ui.widgets.Menu
});
cards.ui.widgets.Statusbar = function(options) {
	if(null == options.el && null == options.template) options.template = "<footer class=\"statusbar\"><div><div class=\"left\"></div><div class=\"center\"></div><div class=\"right\"></div></div></footer>";
	this.component = new cards.components.Component(options);
	this.left = new cards.ui.widgets.ToolbarGroup(udom.Query.first(".left",this.component.el),this.component);
	this.center = new cards.ui.widgets.ToolbarGroup(udom.Query.first(".center",this.component.el),this.component);
	this.right = new cards.ui.widgets.ToolbarGroup(udom.Query.first(".right",this.component.el),this.component);
};
cards.ui.widgets.Statusbar.__name__ = ["cards","ui","widgets","Statusbar"];
cards.ui.widgets.Statusbar.prototype = {
	component: null
	,left: null
	,center: null
	,right: null
	,__class__: cards.ui.widgets.Statusbar
};
cards.ui.widgets.Toolbar = function(options) {
	if(null == options.el && null == options.template) options.template = "<header class=\"toolbar\"><div><div class=\"left\"></div><div class=\"center\"></div><div class=\"right\"></div></div></header>";
	this.component = new cards.components.Component(options);
	this.left = new cards.ui.widgets.ToolbarGroup(udom.Query.first(".left",this.component.el),this.component);
	this.center = new cards.ui.widgets.ToolbarGroup(udom.Query.first(".center",this.component.el),this.component);
	this.right = new cards.ui.widgets.ToolbarGroup(udom.Query.first(".right",this.component.el),this.component);
};
cards.ui.widgets.Toolbar.__name__ = ["cards","ui","widgets","Toolbar"];
cards.ui.widgets.Toolbar.prototype = {
	component: null
	,left: null
	,center: null
	,right: null
	,__class__: cards.ui.widgets.Toolbar
};
cards.ui.widgets.ToolbarGroup = function(el,parent) {
	this.component = new cards.components.Component({ el : el, parent : parent});
};
cards.ui.widgets.ToolbarGroup.__name__ = ["cards","ui","widgets","ToolbarGroup"];
cards.ui.widgets.ToolbarGroup.prototype = {
	component: null
	,addButton: function(text,icon) {
		if(text == null) text = "";
		var button = new cards.ui.widgets.Button(text,icon);
		button.component.appendTo(this.component.el);
		this.component.add(button.component);
		return button;
	}
	,__class__: cards.ui.widgets.ToolbarGroup
};
cards.util = {};
cards.util.MacroVersion = function() { };
cards.util.MacroVersion.__name__ = ["cards","util","MacroVersion"];
var haxe = {};
haxe.StackItem = { __ename__ : ["haxe","StackItem"], __constructs__ : ["CFunction","Module","FilePos","Method","LocalFunction"] };
haxe.StackItem.CFunction = ["CFunction",0];
haxe.StackItem.CFunction.__enum__ = haxe.StackItem;
haxe.StackItem.Module = function(m) { var $x = ["Module",1,m]; $x.__enum__ = haxe.StackItem; return $x; };
haxe.StackItem.FilePos = function(s,file,line) { var $x = ["FilePos",2,s,file,line]; $x.__enum__ = haxe.StackItem; return $x; };
haxe.StackItem.Method = function(classname,method) { var $x = ["Method",3,classname,method]; $x.__enum__ = haxe.StackItem; return $x; };
haxe.StackItem.LocalFunction = function(v) { var $x = ["LocalFunction",4,v]; $x.__enum__ = haxe.StackItem; return $x; };
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
haxe.CallStack.toString = function(stack) {
	var b = new StringBuf();
	var _g = 0;
	while(_g < stack.length) {
		var s = stack[_g];
		++_g;
		b.b += "\nCalled from ";
		haxe.CallStack.itemToString(b,s);
	}
	return b.b;
};
haxe.CallStack.itemToString = function(b,s) {
	switch(s[1]) {
	case 0:
		b.b += "a C function";
		break;
	case 1:
		var m = s[2];
		b.b += "module ";
		if(m == null) b.b += "null"; else b.b += "" + m;
		break;
	case 2:
		var line = s[4];
		var file = s[3];
		var s1 = s[2];
		if(s1 != null) {
			haxe.CallStack.itemToString(b,s1);
			b.b += " (";
		}
		if(file == null) b.b += "null"; else b.b += "" + file;
		b.b += " line ";
		if(line == null) b.b += "null"; else b.b += "" + line;
		if(s1 != null) b.b += ")";
		break;
	case 3:
		var meth = s[3];
		var cname = s[2];
		if(cname == null) b.b += "null"; else b.b += "" + cname;
		b.b += ".";
		if(meth == null) b.b += "null"; else b.b += "" + meth;
		break;
	case 4:
		var n = s[2];
		b.b += "local function #";
		if(n == null) b.b += "null"; else b.b += "" + n;
		break;
	}
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
	,exists: function(key) {
		return this.h.hasOwnProperty(key);
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
	,toString: function() {
		var s = new StringBuf();
		s.b += "{";
		var it = this.keys();
		while( it.hasNext() ) {
			var i = it.next();
			if(i == null) s.b += "null"; else s.b += "" + i;
			s.b += " => ";
			s.add(Std.string(this.get(i)));
			if(it.hasNext()) s.b += ", ";
		}
		s.b += "}";
		return s.b;
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
	,get: function(key) {
		return this.h[key.__id__];
	}
	,exists: function(key) {
		return this.h.__keys__[key.__id__] != null;
	}
	,remove: function(key) {
		var id = key.__id__;
		if(this.h.__keys__[id] == null) return false;
		delete(this.h[id]);
		delete(this.h.__keys__[id]);
		return true;
	}
	,keys: function() {
		var a = [];
		for( var key in this.h.__keys__ ) {
		if(this.h.hasOwnProperty(key)) a.push(this.h.__keys__[key]);
		}
		return HxOverrides.iter(a);
	}
	,__class__: haxe.ds.ObjectMap
};
haxe.ds.Option = { __ename__ : ["haxe","ds","Option"], __constructs__ : ["Some","None"] };
haxe.ds.Option.Some = function(v) { var $x = ["Some",0,v]; $x.__enum__ = haxe.ds.Option; return $x; };
haxe.ds.Option.None = ["None",1];
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
	,toString: function() {
		var s = new StringBuf();
		s.b += "{";
		var it = this.keys();
		while( it.hasNext() ) {
			var i = it.next();
			if(i == null) s.b += "null"; else s.b += "" + i;
			s.b += " => ";
			s.add(Std.string(this.get(i)));
			if(it.hasNext()) s.b += ", ";
		}
		s.b += "}";
		return s.b;
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
js.Boot.__cast = function(o,t) {
	if(js.Boot.__instanceof(o,t)) return o; else throw "Cannot cast " + Std.string(o) + " to " + Std.string(t);
};
var thx = {};
thx.core = {};
thx.core.Arrays = function() { };
thx.core.Arrays.__name__ = ["thx","core","Arrays"];
thx.core.Arrays.after = function(array,element) {
	return array.slice(HxOverrides.indexOf(array,element,0) + 1);
};
thx.core.Arrays.all = function(arr,predicate) {
	var _g = 0;
	while(_g < arr.length) {
		var item = arr[_g];
		++_g;
		if(!predicate(item)) return false;
	}
	return true;
};
thx.core.Arrays.any = function(arr,predicate) {
	var _g = 0;
	while(_g < arr.length) {
		var item = arr[_g];
		++_g;
		if(predicate(item)) return true;
	}
	return false;
};
thx.core.Arrays.at = function(arr,indexes) {
	return indexes.map(function(i) {
		return arr[i];
	});
};
thx.core.Arrays.before = function(array,element) {
	return array.slice(0,HxOverrides.indexOf(array,element,0));
};
thx.core.Arrays.compact = function(arr) {
	return arr.filter(function(v) {
		return null != v;
	});
};
thx.core.Arrays.contains = function(array,element,eq) {
	if(null == eq) return HxOverrides.indexOf(array,element,0) >= 0; else {
		var _g1 = 0;
		var _g = array.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(eq(array[i],element)) return true;
		}
		return false;
	}
};
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
thx.core.Arrays.crossMulti = function(array) {
	var acopy = array.slice();
	var result = acopy.shift().map(function(v) {
		return [v];
	});
	while(acopy.length > 0) {
		var array1 = acopy.shift();
		var tresult = result;
		result = [];
		var _g = 0;
		while(_g < array1.length) {
			var v1 = array1[_g];
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
thx.core.Arrays.eachPair = function(array,callback) {
	var _g1 = 0;
	var _g = array.length;
	while(_g1 < _g) {
		var i = _g1++;
		var _g3 = i;
		var _g2 = array.length;
		while(_g3 < _g2) {
			var j = _g3++;
			if(!callback(array[i],array[j])) return;
		}
	}
};
thx.core.Arrays.equals = function(a,b,equality) {
	if(a == null || b == null || a.length != b.length) return false;
	if(null == equality) equality = thx.core.Functions.equality;
	var _g1 = 0;
	var _g = a.length;
	while(_g1 < _g) {
		var i = _g1++;
		if(!equality(a[i],b[i])) return false;
	}
	return true;
};
thx.core.Arrays.extract = function(a,predicate) {
	var _g1 = 0;
	var _g = a.length;
	while(_g1 < _g) {
		var i = _g1++;
		if(predicate(a[i])) return a.splice(i,1)[0];
	}
	return null;
};
thx.core.Arrays.find = function(array,predicate) {
	var _g = 0;
	while(_g < array.length) {
		var item = array[_g];
		++_g;
		if(predicate(item)) return item;
	}
	return null;
};
thx.core.Arrays.findLast = function(array,predicate) {
	var len = array.length;
	var j;
	var _g = 0;
	while(_g < len) {
		var i = _g++;
		j = len - i - 1;
		if(predicate(array[j])) return array[j];
	}
	return null;
};
thx.core.Arrays.first = function(array) {
	return array[0];
};
thx.core.Arrays.flatMap = function(array,callback) {
	return thx.core.Arrays.flatten(array.map(callback));
};
thx.core.Arrays.flatten = function(array) {
	return Array.prototype.concat.apply([],array);
};
thx.core.Arrays.from = function(array,element) {
	return array.slice(HxOverrides.indexOf(array,element,0));
};
thx.core.Arrays.head = function(array) {
	return array[0];
};
thx.core.Arrays.initial = function(array) {
	return array.slice(0,array.length - 1);
};
thx.core.Arrays.isEmpty = function(array) {
	return array.length == 0;
};
thx.core.Arrays.last = function(array) {
	return array[array.length - 1];
};
thx.core.Arrays.mapi = function(array,callback) {
	var r = [];
	var _g1 = 0;
	var _g = array.length;
	while(_g1 < _g) {
		var i = _g1++;
		r.push(callback(array[i],i));
	}
	return r;
};
thx.core.Arrays.mapRight = function(array,callback) {
	var i = array.length;
	var result = [];
	while(--i >= 0) result.push(callback(array[i]));
	return result;
};
thx.core.Arrays.order = function(array,sort) {
	var n = array.slice();
	n.sort(sort);
	return n;
};
thx.core.Arrays.pull = function(array,toRemove,equality) {
	var _g = 0;
	while(_g < toRemove.length) {
		var item = toRemove[_g];
		++_g;
		thx.core.Arrays.removeAll(array,item,equality);
	}
};
thx.core.Arrays.pushIf = function(array,condition,value) {
	if(condition) array.push(value);
	return array;
};
thx.core.Arrays.reduce = function(array,callback,initial) {
	return array.reduce(callback,initial);
};
thx.core.Arrays.reducei = function(array,callback,initial) {
	return array.reduce(callback,initial);
};
thx.core.Arrays.reduceRight = function(array,callback,initial) {
	var i = array.length;
	while(--i >= 0) initial = callback(initial,array[i]);
	return initial;
};
thx.core.Arrays.removeAll = function(array,element,equality) {
	if(null == equality) equality = thx.core.Functions.equality;
	var i = array.length;
	while(--i >= 0) if(equality(array[i],element)) array.splice(i,1);
};
thx.core.Arrays.rest = function(array) {
	return array.slice(1);
};
thx.core.Arrays.sample = function(array,n) {
	if(n > array.length) n = array.length;
	var copy = array.slice();
	var result = [];
	var _g = 0;
	while(_g < n) {
		var i = _g++;
		result.push(copy.splice(Std.random(copy.length),1)[0]);
	}
	return result;
};
thx.core.Arrays.sampleOne = function(array) {
	return array[Std.random(array.length)];
};
thx.core.Arrays.shuffle = function(a) {
	var t = thx.core.Ints.range(a.length);
	var array = [];
	while(t.length > 0) {
		var pos = Std.random(t.length);
		var index = t[pos];
		t.splice(pos,1);
		array.push(a[index]);
	}
	return array;
};
thx.core.Arrays.take = function(arr,n) {
	return arr.slice(0,n);
};
thx.core.Arrays.takeLast = function(arr,n) {
	return arr.slice(arr.length - n);
};
thx.core.Arrays.zip = function(array1,array2) {
	var length = thx.core.Ints.min(array1.length,array2.length);
	var array = [];
	var _g = 0;
	while(_g < length) {
		var i = _g++;
		array.push({ _0 : array1[i], _1 : array2[i]});
	}
	return array;
};
thx.core.Arrays.zip3 = function(array1,array2,array3) {
	var length = thx.core.ArrayInts.min([array1.length,array2.length,array3.length]);
	var array = [];
	var _g = 0;
	while(_g < length) {
		var i = _g++;
		array.push({ _0 : array1[i], _1 : array2[i], _2 : array3[i]});
	}
	return array;
};
thx.core.Arrays.zip4 = function(array1,array2,array3,array4) {
	var length = thx.core.ArrayInts.min([array1.length,array2.length,array3.length,array4.length]);
	var array = [];
	var _g = 0;
	while(_g < length) {
		var i = _g++;
		array.push({ _0 : array1[i], _1 : array2[i], _2 : array3[i], _3 : array4[i]});
	}
	return array;
};
thx.core.Arrays.zip5 = function(array1,array2,array3,array4,array5) {
	var length = thx.core.ArrayInts.min([array1.length,array2.length,array3.length,array4.length,array5.length]);
	var array = [];
	var _g = 0;
	while(_g < length) {
		var i = _g++;
		array.push({ _0 : array1[i], _1 : array2[i], _2 : array3[i], _3 : array4[i], _4 : array5[i]});
	}
	return array;
};
thx.core.Arrays.unzip = function(array) {
	var a1 = [];
	var a2 = [];
	array.map(function(t) {
		a1.push(t._0);
		a2.push(t._1);
	});
	return { _0 : a1, _1 : a2};
};
thx.core.Arrays.unzip3 = function(array) {
	var a1 = [];
	var a2 = [];
	var a3 = [];
	array.map(function(t) {
		a1.push(t._0);
		a2.push(t._1);
		a3.push(t._2);
	});
	return { _0 : a1, _1 : a2, _2 : a3};
};
thx.core.Arrays.unzip4 = function(array) {
	var a1 = [];
	var a2 = [];
	var a3 = [];
	var a4 = [];
	array.map(function(t) {
		a1.push(t._0);
		a2.push(t._1);
		a3.push(t._2);
		a4.push(t._3);
	});
	return { _0 : a1, _1 : a2, _2 : a3, _3 : a4};
};
thx.core.Arrays.unzip5 = function(array) {
	var a1 = [];
	var a2 = [];
	var a3 = [];
	var a4 = [];
	var a5 = [];
	array.map(function(t) {
		a1.push(t._0);
		a2.push(t._1);
		a3.push(t._2);
		a4.push(t._3);
		a5.push(t._4);
	});
	return { _0 : a1, _1 : a2, _2 : a3, _3 : a4, _4 : a5};
};
thx.core.ArrayFloats = function() { };
thx.core.ArrayFloats.__name__ = ["thx","core","ArrayFloats"];
thx.core.ArrayFloats.average = function(arr) {
	if(arr.length == 0) return null;
	var sum = arr.reduce(function(acc,v) {
		acc.count++;
		acc.sum += v;
		return acc;
	},{ count : 0, sum : 0.0});
	return sum.sum / sum.count;
};
thx.core.ArrayFloats.compact = function(arr) {
	return arr.filter(function(v) {
		return null != v && isFinite(v);
	});
};
thx.core.ArrayFloats.max = function(arr) {
	if(arr.length == 0) return null; else return arr.reduce(function(max,v) {
		if(v > max) return v; else return max;
	},arr[0]);
};
thx.core.ArrayFloats.min = function(arr) {
	if(arr.length == 0) return null; else return arr.reduce(function(min,v) {
		if(v < min) return v; else return min;
	},arr[0]);
};
thx.core.ArrayInts = function() { };
thx.core.ArrayInts.__name__ = ["thx","core","ArrayInts"];
thx.core.ArrayInts.average = function(arr) {
	return thx.core.ArrayFloats.average(arr);
};
thx.core.ArrayInts.max = function(arr) {
	if(arr.length == 0) return null; else return arr.reduce(function(max,v) {
		if(v > max) return v; else return max;
	},arr[0]);
};
thx.core.ArrayInts.min = function(arr) {
	if(arr.length == 0) return null; else return arr.reduce(function(min,v) {
		if(v < min) return v; else return min;
	},arr[0]);
};
thx.core.ArrayStrings = function() { };
thx.core.ArrayStrings.__name__ = ["thx","core","ArrayStrings"];
thx.core.ArrayStrings.compact = function(arr) {
	return arr.filter(function(v) {
		return !thx.core.Strings.isEmpty(v);
	});
};
thx.core.ArrayStrings.max = function(arr) {
	if(arr.length == 0) return null; else return arr.reduce(function(max,v) {
		if(v > max) return v; else return max;
	},arr[0]);
};
thx.core.ArrayStrings.min = function(arr) {
	if(arr.length == 0) return null; else return arr.reduce(function(min,v) {
		if(v < min) return v; else return min;
	},arr[0]);
};
thx.core.Dynamics = function() { };
thx.core.Dynamics.__name__ = ["thx","core","Dynamics"];
thx.core.Dynamics.equals = function(a,b) {
	if(!thx.core.Types.sameType(a,b)) return false;
	if(a == b) return true;
	{
		var _g = Type["typeof"](a);
		switch(_g[1]) {
		case 2:case 0:case 1:case 3:
			return false;
		case 5:
			return Reflect.compareMethods(a,b);
		case 6:
			var c = _g[2];
			var ca = Type.getClassName(c);
			var cb = Type.getClassName(Type.getClass(b));
			if(ca != cb) return false;
			if(typeof(a) == "string") return false;
			if((a instanceof Array) && a.__enum__ == null) {
				var aa = a;
				var ab = b;
				if(aa.length != ab.length) return false;
				var _g2 = 0;
				var _g1 = aa.length;
				while(_g2 < _g1) {
					var i = _g2++;
					if(!thx.core.Dynamics.equals(aa[i],ab[i])) return false;
				}
				return true;
			}
			if(js.Boot.__instanceof(a,Date)) return a.getTime() == b.getTime();
			if(js.Boot.__instanceof(a,_Map.Map_Impl_)) {
				var ha = a;
				var hb = b;
				var ka = thx.core.Iterators.toArray(ha.keys());
				var kb = thx.core.Iterators.toArray(hb.keys());
				if(ka.length != kb.length) return false;
				var _g11 = 0;
				while(_g11 < ka.length) {
					var key = ka[_g11];
					++_g11;
					if(!hb.exists(key) || !thx.core.Dynamics.equals(ha.get(key),hb.get(key))) return false;
				}
				return true;
			}
			var t = false;
			if((t = thx.core.Iterators.isIterator(a)) || thx.core.Iterables.isIterable(a)) {
				var va;
				if(t) va = thx.core.Iterators.toArray(a); else va = thx.core.Iterators.toArray($iterator(a)());
				var vb;
				if(t) vb = thx.core.Iterators.toArray(b); else vb = thx.core.Iterators.toArray($iterator(b)());
				if(va.length != vb.length) return false;
				var _g21 = 0;
				var _g12 = va.length;
				while(_g21 < _g12) {
					var i1 = _g21++;
					if(!thx.core.Dynamics.equals(va[i1],vb[i1])) return false;
				}
				return true;
			}
			var f;
			if(Object.prototype.hasOwnProperty.call(a,"equals") && Reflect.isFunction(f = Reflect.field(a,"equals"))) return f.apply(a,[b]);
			var fields = Type.getInstanceFields(Type.getClass(a));
			var _g13 = 0;
			while(_g13 < fields.length) {
				var field = fields[_g13];
				++_g13;
				var va1 = Reflect.field(a,field);
				if(Reflect.isFunction(va1)) continue;
				var vb1 = Reflect.field(b,field);
				if(!thx.core.Dynamics.equals(va1,vb1)) return false;
			}
			return true;
		case 7:
			var e = _g[2];
			var ea = Type.getEnumName(e);
			var teb = Type.getEnum(b);
			var eb = Type.getEnumName(teb);
			if(ea != eb) return false;
			if(a[1] != b[1]) return false;
			var pa = a.slice(2);
			var pb = b.slice(2);
			var _g22 = 0;
			var _g14 = pa.length;
			while(_g22 < _g14) {
				var i2 = _g22++;
				if(!thx.core.Dynamics.equals(pa[i2],pb[i2])) return false;
			}
			return true;
		case 4:
			var fa = Reflect.fields(a);
			var fb = Reflect.fields(b);
			var _g15 = 0;
			while(_g15 < fa.length) {
				var field1 = fa[_g15];
				++_g15;
				HxOverrides.remove(fb,field1);
				if(!Object.prototype.hasOwnProperty.call(b,field1)) return false;
				var va2 = Reflect.field(a,field1);
				if(Reflect.isFunction(va2)) continue;
				var vb2 = Reflect.field(b,field1);
				if(!thx.core.Dynamics.equals(va2,vb2)) return false;
			}
			if(fb.length > 0) return false;
			var t1 = false;
			if((t1 = thx.core.Iterators.isIterator(a)) || thx.core.Iterables.isIterable(a)) {
				if(t1 && !thx.core.Iterators.isIterator(b)) return false;
				if(!t1 && !thx.core.Iterables.isIterable(b)) return false;
				var aa1;
				if(t1) aa1 = thx.core.Iterators.toArray(a); else aa1 = thx.core.Iterators.toArray($iterator(a)());
				var ab1;
				if(t1) ab1 = thx.core.Iterators.toArray(b); else ab1 = thx.core.Iterators.toArray($iterator(b)());
				if(aa1.length != ab1.length) return false;
				var _g23 = 0;
				var _g16 = aa1.length;
				while(_g23 < _g16) {
					var i3 = _g23++;
					if(!thx.core.Dynamics.equals(aa1[i3],ab1[i3])) return false;
				}
				return true;
			}
			return true;
		case 8:
			throw "Unable to compare two unknown types";
			break;
		}
	}
	throw new thx.core.Error("Unable to compare values: " + Std.string(a) + " and " + Std.string(b),null,{ fileName : "Dynamics.hx", lineNumber : 149, className : "thx.core.Dynamics", methodName : "equals"});
};
thx.core.Either = { __ename__ : ["thx","core","Either"], __constructs__ : ["Left","Right"] };
thx.core.Either.Left = function(value) { var $x = ["Left",0,value]; $x.__enum__ = thx.core.Either; return $x; };
thx.core.Either.Right = function(value) { var $x = ["Right",1,value]; $x.__enum__ = thx.core.Either; return $x; };
thx.core.Error = function(message,stack,pos) {
	Error.call(this,message);
	if(null == stack) {
		try {
			stack = haxe.CallStack.exceptionStack();
		} catch( e ) {
			stack = [];
		}
		if(stack.length == 0) try {
			stack = haxe.CallStack.callStack();
		} catch( e1 ) {
			stack = [];
		}
	}
	this.stackItems = stack;
	this.pos = pos;
};
thx.core.Error.__name__ = ["thx","core","Error"];
thx.core.Error.fromDynamic = function(err,pos) {
	if(js.Boot.__instanceof(err,thx.core.Error)) return err;
	return new thx.core.Error("" + Std.string(err),null,pos);
};
thx.core.Error.__super__ = Error;
thx.core.Error.prototype = $extend(Error.prototype,{
	pos: null
	,stackItems: null
	,toString: function() {
		return this.message + "from: " + this.pos.className + "." + this.pos.methodName + "() at " + this.pos.lineNumber + "\n\n" + haxe.CallStack.toString(this.stackItems);
	}
	,__class__: thx.core.Error
});
thx.core.Function0 = function() { };
thx.core.Function0.__name__ = ["thx","core","Function0"];
thx.core.Function0.after = function(n,callback) {
	return function() {
		if(--n == 0) callback();
	};
};
thx.core.Function0.join = function(fa,fb) {
	return function() {
		fa();
		fb();
	};
};
thx.core.Function0.once = function(f) {
	return function() {
		var t = f;
		f = thx.core.Functions.noop;
		t();
	};
};
thx.core.Function0.negate = function(callback) {
	return function() {
		return !callback();
	};
};
thx.core.Function0.times = function(n,callback) {
	return function() {
		return thx.core.Ints.range(n).map(function(_) {
			return callback();
		});
	};
};
thx.core.Function0.timesi = function(n,callback) {
	return function() {
		return thx.core.Ints.range(n).map(function(i) {
			return callback(i);
		});
	};
};
thx.core.Function1 = function() { };
thx.core.Function1.__name__ = ["thx","core","Function1"];
thx.core.Function1.compose = function(fa,fb) {
	return function(v) {
		return fa(fb(v));
	};
};
thx.core.Function1.join = function(fa,fb) {
	return function(v) {
		fa(v);
		fb(v);
	};
};
thx.core.Function1.memoize = function(callback,resolver) {
	if(null == resolver) resolver = function(v) {
		return "" + Std.string(v);
	};
	var map = new haxe.ds.StringMap();
	return function(v1) {
		var key = resolver(v1);
		if(map.exists(key)) return map.get(key);
		var result = callback(v1);
		map.set(key,result);
		return result;
	};
};
thx.core.Function1.negate = function(callback) {
	return function(v) {
		return !callback(v);
	};
};
thx.core.Function1.noop = function(_) {
};
thx.core.Function1.times = function(n,callback) {
	return function(value) {
		return thx.core.Ints.range(n).map(function(_) {
			return callback(value);
		});
	};
};
thx.core.Function1.timesi = function(n,callback) {
	return function(value) {
		return thx.core.Ints.range(n).map(function(i) {
			return callback(value,i);
		});
	};
};
thx.core.Function1.swapArguments = function(callback) {
	return function(a2,a1) {
		return callback(a1,a2);
	};
};
thx.core.Function2 = function() { };
thx.core.Function2.__name__ = ["thx","core","Function2"];
thx.core.Function2.memoize = function(callback,resolver) {
	if(null == resolver) resolver = function(v1,v2) {
		return "" + Std.string(v1) + ":" + Std.string(v2);
	};
	var map = new haxe.ds.StringMap();
	return function(v11,v21) {
		var key = resolver(v11,v21);
		if(map.exists(key)) return map.get(key);
		var result = callback(v11,v21);
		map.set(key,result);
		return result;
	};
};
thx.core.Function2.negate = function(callback) {
	return function(v1,v2) {
		return !callback(v1,v2);
	};
};
thx.core.Function3 = function() { };
thx.core.Function3.__name__ = ["thx","core","Function3"];
thx.core.Function3.memoize = function(callback,resolver) {
	if(null == resolver) resolver = function(v1,v2,v3) {
		return "" + Std.string(v1) + ":" + Std.string(v2) + ":" + Std.string(v3);
	};
	var map = new haxe.ds.StringMap();
	return function(v11,v21,v31) {
		var key = resolver(v11,v21,v31);
		if(map.exists(key)) return map.get(key);
		var result = callback(v11,v21,v31);
		map.set(key,result);
		return result;
	};
};
thx.core.Function3.negate = function(callback) {
	return function(v1,v2,v3) {
		return !callback(v1,v2,v3);
	};
};
thx.core.Functions = function() { };
thx.core.Functions.__name__ = ["thx","core","Functions"];
thx.core.Functions.constant = function(v) {
	return function() {
		return v;
	};
};
thx.core.Functions.equality = function(a,b) {
	return a == b;
};
thx.core.Functions.identity = function(value) {
	return value;
};
thx.core.Functions.noop = function() {
};
thx.core.Ints = function() { };
thx.core.Ints.__name__ = ["thx","core","Ints"];
thx.core.Ints.abs = function(v) {
	if(v < 0) return -v; else return v;
};
thx.core.Ints.canParse = function(s) {
	return thx.core.Ints.pattern_parse.match(s);
};
thx.core.Ints.clamp = function(v,min,max) {
	if(v < min) return min; else if(v > max) return max; else return v;
};
thx.core.Ints.clampSym = function(v,max) {
	return thx.core.Ints.clamp(v,-max,max);
};
thx.core.Ints.compare = function(a,b) {
	return a - b;
};
thx.core.Ints.max = function(a,b) {
	if(a > b) return a; else return b;
};
thx.core.Ints.min = function(a,b) {
	if(a < b) return a; else return b;
};
thx.core.Ints.parse = function(s) {
	if(HxOverrides.substr(s,0,1) == "+") s = HxOverrides.substr(s,1,null);
	return Std.parseInt(s);
};
thx.core.Ints.random = function(min,max) {
	if(min == null) min = 0;
	return Std.random(max + 1) + min;
};
thx.core.Ints.range = function(start,stop,step) {
	if(step == null) step = 1;
	if(null == stop) {
		stop = start;
		start = 0;
	}
	if((stop - start) / step == Infinity) throw "infinite range";
	var range = [];
	var i = -1;
	var j;
	if(step < 0) while((j = start + step * ++i) > stop) range.push(j); else while((j = start + step * ++i) < stop) range.push(j);
	return range;
};
thx.core.Ints.wrapCircular = function(v,max) {
	v = v % max;
	if(v < 0) v += max;
	return v;
};
thx.core.Iterables = function() { };
thx.core.Iterables.__name__ = ["thx","core","Iterables"];
thx.core.Iterables.all = function(it,predicate) {
	return thx.core.Iterators.all($iterator(it)(),predicate);
};
thx.core.Iterables.any = function(it,predicate) {
	return thx.core.Iterators.any($iterator(it)(),predicate);
};
thx.core.Iterables.eachPair = function(it,handler) {
	return thx.core.Iterators.eachPair($iterator(it)(),handler);
};
thx.core.Iterables.filter = function(it,predicate) {
	return thx.core.Iterators.filter($iterator(it)(),predicate);
};
thx.core.Iterables.find = function(it,predicate) {
	return thx.core.Iterators.find($iterator(it)(),predicate);
};
thx.core.Iterables.first = function(it) {
	return thx.core.Iterators.first($iterator(it)());
};
thx.core.Iterables.last = function(it) {
	return thx.core.Iterators.last($iterator(it)());
};
thx.core.Iterables.isEmpty = function(it) {
	return thx.core.Iterators.isEmpty($iterator(it)());
};
thx.core.Iterables.isIterable = function(v) {
	var fields;
	if(Reflect.isObject(v) && null == Type.getClass(v)) fields = Reflect.fields(v); else fields = Type.getInstanceFields(Type.getClass(v));
	if(!Lambda.has(fields,"iterator")) return false;
	return Reflect.isFunction(Reflect.field(v,"iterator"));
};
thx.core.Iterables.map = function(it,f) {
	return thx.core.Iterators.map($iterator(it)(),f);
};
thx.core.Iterables.mapi = function(it,f) {
	return thx.core.Iterators.mapi($iterator(it)(),f);
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
thx.core.Iterables.toArray = function(it) {
	return thx.core.Iterators.toArray($iterator(it)());
};
thx.core.Iterators = function() { };
thx.core.Iterators.__name__ = ["thx","core","Iterators"];
thx.core.Iterators.all = function(it,predicate) {
	while( it.hasNext() ) {
		var item = it.next();
		if(!predicate(item)) return false;
	}
	return true;
};
thx.core.Iterators.any = function(it,predicate) {
	while( it.hasNext() ) {
		var item = it.next();
		if(predicate(item)) return true;
	}
	return false;
};
thx.core.Iterators.eachPair = function(it,handler) {
	thx.core.Arrays.eachPair(thx.core.Iterators.toArray(it),handler);
};
thx.core.Iterators.filter = function(it,predicate) {
	return thx.core.Iterators.reduce(it,function(acc,item) {
		if(predicate(item)) acc.push(item);
		return acc;
	},[]);
};
thx.core.Iterators.find = function(it,f) {
	while( it.hasNext() ) {
		var item = it.next();
		if(f(item)) return item;
	}
	return null;
};
thx.core.Iterators.first = function(it) {
	if(it.hasNext()) return it.next(); else return null;
};
thx.core.Iterators.isEmpty = function(it) {
	return !it.hasNext();
};
thx.core.Iterators.isIterator = function(v) {
	var fields;
	if(Reflect.isObject(v) && null == Type.getClass(v)) fields = Reflect.fields(v); else fields = Type.getInstanceFields(Type.getClass(v));
	if(!Lambda.has(fields,"next") || !Lambda.has(fields,"hasNext")) return false;
	return Reflect.isFunction(Reflect.field(v,"next")) && Reflect.isFunction(Reflect.field(v,"hasNext"));
};
thx.core.Iterators.last = function(it) {
	var buf = null;
	while(it.hasNext()) buf = it.next();
	return buf;
};
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
thx.core.Iterators.toArray = function(it) {
	var items = [];
	while( it.hasNext() ) {
		var item = it.next();
		items.push(item);
	}
	return items;
};
thx.core.Nil = { __ename__ : ["thx","core","Nil"], __constructs__ : ["nil"] };
thx.core.Nil.nil = ["nil",0];
thx.core.Nil.nil.__enum__ = thx.core.Nil;
thx.core.Objects = function() { };
thx.core.Objects.__name__ = ["thx","core","Objects"];
thx.core.Objects.isEmpty = function(o) {
	return Reflect.fields(o).length == 0;
};
thx.core.Objects.exists = function(o,name) {
	return Object.prototype.hasOwnProperty.call(o,name);
};
thx.core.Objects.fields = function(o) {
	return Reflect.fields(o);
};
thx.core.Objects.size = function(o) {
	return Reflect.fields(o).length;
};
thx.core.Objects.values = function(o) {
	return Reflect.fields(o).map(function(key) {
		return Reflect.field(o,key);
	});
};
thx.core.Objects.tuples = function(o) {
	return Reflect.fields(o).map(function(key) {
		var _1 = Reflect.field(o,key);
		return { _0 : key, _1 : _1};
	});
};
thx.core.Objects.objectToMap = function(o) {
	return thx.core.Arrays.reduce(thx.core.Objects.tuples(o),function(map,t) {
		var value = t._1;
		map.set(t._0,value);
		return map;
	},new haxe.ds.StringMap());
};
thx.core.Options = function() { };
thx.core.Options.__name__ = ["thx","core","Options"];
thx.core.Options.equals = function(a,b,eq) {
	switch(a[1]) {
	case 1:
		switch(b[1]) {
		case 1:
			return true;
		default:
			return false;
		}
		break;
	case 0:
		switch(b[1]) {
		case 0:
			var a1 = a[2];
			var b1 = b[2];
			if(null == eq) eq = function(a2,b2) {
				return a2 == b2;
			};
			return eq(a1,b1);
		default:
			return false;
		}
		break;
	}
};
thx.core.Options.equalsValue = function(a,b,eq) {
	return thx.core.Options.equals(a,null == b?haxe.ds.Option.None:haxe.ds.Option.Some(b),eq);
};
thx.core.Options.flatMap = function(option,callback) {
	switch(option[1]) {
	case 1:
		return [];
	case 0:
		var v = option[2];
		return callback(v);
	}
};
thx.core.Options.map = function(option,callback) {
	switch(option[1]) {
	case 1:
		return haxe.ds.Option.None;
	case 0:
		var v = option[2];
		return haxe.ds.Option.Some(callback(v));
	}
};
thx.core.Options.toArray = function(option) {
	switch(option[1]) {
	case 1:
		return [];
	case 0:
		var v = option[2];
		return [v];
	}
};
thx.core.Options.toBool = function(option) {
	switch(option[1]) {
	case 1:
		return false;
	case 0:
		return true;
	}
};
thx.core.Options.toOption = function(value) {
	if(null == value) return haxe.ds.Option.None; else return haxe.ds.Option.Some(value);
};
thx.core.Options.toValue = function(option) {
	switch(option[1]) {
	case 1:
		return null;
	case 0:
		var v = option[2];
		return v;
	}
};
thx.core._Result = {};
thx.core._Result.Result_Impl_ = function() { };
thx.core._Result.Result_Impl_.__name__ = ["thx","core","_Result","Result_Impl_"];
thx.core._Result.Result_Impl_.optionValue = function(this1) {
	switch(this1[1]) {
	case 1:
		var v = this1[2];
		return haxe.ds.Option.Some(v);
	default:
		return haxe.ds.Option.None;
	}
};
thx.core._Result.Result_Impl_.optionError = function(this1) {
	switch(this1[1]) {
	case 0:
		var v = this1[2];
		return haxe.ds.Option.Some(v);
	default:
		return haxe.ds.Option.None;
	}
};
thx.core._Result.Result_Impl_.value = function(this1) {
	switch(this1[1]) {
	case 1:
		var v = this1[2];
		return v;
	default:
		return null;
	}
};
thx.core._Result.Result_Impl_.error = function(this1) {
	switch(this1[1]) {
	case 0:
		var v = this1[2];
		return v;
	default:
		return null;
	}
};
thx.core._Result.Result_Impl_.get_isSuccess = function(this1) {
	switch(this1[1]) {
	case 1:
		return true;
	default:
		return false;
	}
};
thx.core._Result.Result_Impl_.get_isFailure = function(this1) {
	switch(this1[1]) {
	case 0:
		return true;
	default:
		return false;
	}
};
thx.core._Set = {};
thx.core._Set.Set_Impl_ = function() { };
thx.core._Set.Set_Impl_.__name__ = ["thx","core","_Set","Set_Impl_"];
thx.core._Set.Set_Impl_.arrayToSet = function(arr) {
	var set = [];
	var _g = 0;
	while(_g < arr.length) {
		var v = arr[_g];
		++_g;
		thx.core._Set.Set_Impl_.push(set,v);
	}
	return set;
};
thx.core._Set.Set_Impl_._new = function(arr) {
	return arr;
};
thx.core._Set.Set_Impl_.add = function(this1,v) {
	if(thx.core._Set.Set_Impl_.exists(this1,v)) return false; else {
		this1.push(v);
		return true;
	}
};
thx.core._Set.Set_Impl_.copy = function(this1) {
	var arr = this1.slice();
	return arr;
};
thx.core._Set.Set_Impl_.difference = function(this1,set) {
	var result = this1.slice();
	var $it0 = HxOverrides.iter(set);
	while( $it0.hasNext() ) {
		var item = $it0.next();
		HxOverrides.remove(result,item);
	}
	return result;
};
thx.core._Set.Set_Impl_.exists = function(this1,v) {
	var _g = 0;
	while(_g < this1.length) {
		var t = this1[_g];
		++_g;
		if(t == v) return true;
	}
	return false;
};
thx.core._Set.Set_Impl_.get = function(this1,index) {
	return this1[index];
};
thx.core._Set.Set_Impl_.intersection = function(this1,set) {
	var result = [];
	var _g = 0;
	while(_g < this1.length) {
		var item = this1[_g];
		++_g;
		if(thx.core._Set.Set_Impl_.exists(set,item)) result.push(item);
	}
	return result;
};
thx.core._Set.Set_Impl_.push = function(this1,v) {
	thx.core._Set.Set_Impl_.add(this1,v);
};
thx.core._Set.Set_Impl_.slice = function(this1,pos,end) {
	var arr = this1.slice(pos,end);
	return arr;
};
thx.core._Set.Set_Impl_.splice = function(this1,pos,len) {
	var arr = this1.splice(pos,len);
	return arr;
};
thx.core._Set.Set_Impl_.union = function(this1,set) {
	return thx.core._Set.Set_Impl_.arrayToSet(this1.concat(thx.core._Set.Set_Impl_.setToArray(set)));
};
thx.core._Set.Set_Impl_.setToArray = function(this1) {
	return this1.slice();
};
thx.core._Set.Set_Impl_.toString = function(this1) {
	return "{" + this1.join(", ") + "}";
};
thx.core.Strings = function() { };
thx.core.Strings.__name__ = ["thx","core","Strings"];
thx.core.Strings.after = function(value,searchFor) {
	var pos = value.indexOf(searchFor);
	if(pos < 0) return ""; else return HxOverrides.substr(value,pos + searchFor.length,null);
};
thx.core.Strings.capitalize = function(s) {
	return HxOverrides.substr(s,0,1).toUpperCase() + HxOverrides.substr(s,1,null);
};
thx.core.Strings.capitalizeWords = function(value,whiteSpaceOnly) {
	if(whiteSpaceOnly == null) whiteSpaceOnly = false;
	if(whiteSpaceOnly) return thx.core.Strings.UCWORDSWS.map(HxOverrides.substr(value,0,1).toUpperCase() + HxOverrides.substr(value,1,null),thx.core.Strings.upperMatch); else return thx.core.Strings.UCWORDS.map(HxOverrides.substr(value,0,1).toUpperCase() + HxOverrides.substr(value,1,null),thx.core.Strings.upperMatch);
};
thx.core.Strings.compare = function(a,b) {
	if(a < b) return -1; else if(a > b) return 1; else return 0;
};
thx.core.Strings.contains = function(s,test) {
	return s.indexOf(test) >= 0;
};
thx.core.Strings.collapse = function(value) {
	return thx.core.Strings.WSG.replace(StringTools.trim(value)," ");
};
thx.core.Strings.dasherize = function(s) {
	return StringTools.replace(s,"_","-");
};
thx.core.Strings.ellipsis = function(s,maxlen,symbol) {
	if(symbol == null) symbol = "...";
	if(maxlen == null) maxlen = 20;
	if(s.length > maxlen) return HxOverrides.substr(s,0,symbol.length > maxlen - symbol.length?symbol.length:maxlen - symbol.length) + symbol; else return s;
};
thx.core.Strings.filter = function(s,predicate) {
	return s.split("").filter(predicate).join("");
};
thx.core.Strings.filterCharcode = function(s,predicate) {
	return thx.core.Strings.toCharcodeArray(s).filter(predicate).map(function(i) {
		return String.fromCharCode(i);
	}).join("");
};
thx.core.Strings.from = function(value,searchFor) {
	var pos = value.indexOf(searchFor);
	if(pos < 0) return ""; else return HxOverrides.substr(value,pos,null);
};
thx.core.Strings.humanize = function(s) {
	return StringTools.replace(thx.core.Strings.underscore(s),"_"," ");
};
thx.core.Strings.isAlphaNum = function(value) {
	return thx.core.Strings.ALPHANUM.match(value);
};
thx.core.Strings.isDigitsOnly = function(value) {
	return thx.core.Strings.DIGITS.match(value);
};
thx.core.Strings.isEmpty = function(value) {
	return value == null || value == "";
};
thx.core.Strings.iterator = function(s) {
	var _this = s.split("");
	return HxOverrides.iter(_this);
};
thx.core.Strings.map = function(value,callback) {
	return value.split("").map(callback).join("");
};
thx.core.Strings.repeat = function(s,times) {
	return ((function($this) {
		var $r;
		var _g = [];
		{
			var _g1 = 0;
			while(_g1 < times) {
				var i = _g1++;
				_g.push(s);
			}
		}
		$r = _g;
		return $r;
	}(this))).join("");
};
thx.core.Strings.stripTags = function(s) {
	return thx.core.Strings.STRIPTAGS.replace(s,"");
};
thx.core.Strings.toArray = function(s) {
	return s.split("");
};
thx.core.Strings.toCharcodeArray = function(s) {
	return s.split("").map(function(s1) {
		return HxOverrides.cca(s1,0);
	});
};
thx.core.Strings.trim = function(value,charlist) {
	return thx.core.Strings.trimRight(thx.core.Strings.trimLeft(value,charlist),charlist);
};
thx.core.Strings.trimLeft = function(value,charlist) {
	var pos = 0;
	var _g1 = 0;
	var _g = value.length;
	while(_g1 < _g) {
		var i = _g1++;
		if(thx.core.Strings.contains(charlist,value.charAt(i))) pos++; else break;
	}
	return HxOverrides.substr(value,pos,null);
};
thx.core.Strings.trimRight = function(value,charlist) {
	var len = value.length;
	var pos = len;
	var i;
	var _g = 0;
	while(_g < len) {
		var j = _g++;
		i = len - j - 1;
		if(thx.core.Strings.contains(charlist,value.charAt(i))) pos = i; else break;
	}
	return HxOverrides.substr(value,0,pos);
};
thx.core.Strings.underscore = function(s) {
	s = new EReg("::","g").replace(s,"/");
	s = new EReg("([A-Z]+)([A-Z][a-z])","g").replace(s,"$1_$2");
	s = new EReg("([a-z\\d])([A-Z])","g").replace(s,"$1_$2");
	s = new EReg("-","g").replace(s,"_");
	return s.toLowerCase();
};
thx.core.Strings.upTo = function(value,searchFor) {
	var pos = value.indexOf(searchFor);
	if(pos < 0) return value; else return HxOverrides.substr(value,0,pos);
};
thx.core.Strings.wrapColumns = function(s,columns,indent,newline) {
	if(newline == null) newline = "\n";
	if(indent == null) indent = "";
	if(columns == null) columns = 78;
	return thx.core.Strings.SPLIT_LINES.split(s).map(function(part) {
		return thx.core.Strings.wrapLine(StringTools.trim(thx.core.Strings.WSG.replace(part," ")),columns,indent,newline);
	}).join(newline);
};
thx.core.Strings.upperMatch = function(re) {
	return re.matched(0).toUpperCase();
};
thx.core.Strings.wrapLine = function(s,columns,indent,newline) {
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
thx.core.Timer = function() { };
thx.core.Timer.__name__ = ["thx","core","Timer"];
thx.core.Timer.debounce = function(callback,delayms,leading) {
	if(leading == null) leading = false;
	var cancel = thx.core.Functions.noop;
	var poll = function() {
		cancel();
		cancel = thx.core.Timer.delay(callback,delayms);
	};
	return function() {
		if(leading) {
			leading = false;
			callback();
		}
		poll();
	};
};
thx.core.Timer.throttle = function(callback,delayms,leading) {
	if(leading == null) leading = false;
	var waiting = false;
	var poll = function() {
		waiting = true;
		thx.core.Timer.delay(callback,delayms);
	};
	return function() {
		if(leading) {
			leading = false;
			callback();
			return;
		}
		if(waiting) return;
		poll();
	};
};
thx.core.Timer.repeat = function(callback,delayms) {
	return (function(f,id) {
		return function() {
			return f(id);
		};
	})(thx.core.Timer.clear,setInterval(callback,delayms));
};
thx.core.Timer.delay = function(callback,delayms) {
	return (function(f,id) {
		return function() {
			return f(id);
		};
	})(thx.core.Timer.clear,setTimeout(callback,delayms));
};
thx.core.Timer.immediate = function(callback) {
	return (function(f,id) {
		return function() {
			return f(id);
		};
	})(thx.core.Timer.clear,setImmediate(callback));
};
thx.core.Timer.clear = function(id) {
	return clearTimeout(id);
};
thx.core._Tuple = {};
thx.core._Tuple.Tuple0_Impl_ = function() { };
thx.core._Tuple.Tuple0_Impl_.__name__ = ["thx","core","_Tuple","Tuple0_Impl_"];
thx.core._Tuple.Tuple0_Impl_._new = function() {
	return thx.core.Nil.nil;
};
thx.core._Tuple.Tuple0_Impl_["with"] = function(this1,v) {
	return v;
};
thx.core._Tuple.Tuple0_Impl_.toString = function(this1) {
	return "Tuple0()";
};
thx.core._Tuple.Tuple0_Impl_.toNil = function(this1) {
	return this1;
};
thx.core._Tuple.Tuple0_Impl_.nilToTuple = function(v) {
	return thx.core.Nil.nil;
};
thx.core._Tuple.Tuple1_Impl_ = function() { };
thx.core._Tuple.Tuple1_Impl_.__name__ = ["thx","core","_Tuple","Tuple1_Impl_"];
thx.core._Tuple.Tuple1_Impl_._new = function(_0) {
	return _0;
};
thx.core._Tuple.Tuple1_Impl_.get__0 = function(this1) {
	return this1;
};
thx.core._Tuple.Tuple1_Impl_["with"] = function(this1,v) {
	return { _0 : this1, _1 : v};
};
thx.core._Tuple.Tuple1_Impl_.toString = function(this1) {
	return "Tuple1(" + Std.string(this1) + ")";
};
thx.core._Tuple.Tuple2_Impl_ = function() { };
thx.core._Tuple.Tuple2_Impl_.__name__ = ["thx","core","_Tuple","Tuple2_Impl_"];
thx.core._Tuple.Tuple2_Impl_._new = function(_0,_1) {
	return { _0 : _0, _1 : _1};
};
thx.core._Tuple.Tuple2_Impl_.get_left = function(this1) {
	return this1._0;
};
thx.core._Tuple.Tuple2_Impl_.get_right = function(this1) {
	return this1._1;
};
thx.core._Tuple.Tuple2_Impl_.flip = function(this1) {
	return { _0 : this1._1, _1 : this1._0};
};
thx.core._Tuple.Tuple2_Impl_.dropLeft = function(this1) {
	return this1._1;
};
thx.core._Tuple.Tuple2_Impl_.dropRight = function(this1) {
	return this1._0;
};
thx.core._Tuple.Tuple2_Impl_["with"] = function(this1,v) {
	return { _0 : this1._0, _1 : this1._1, _2 : v};
};
thx.core._Tuple.Tuple2_Impl_.toString = function(this1) {
	return "Tuple2(" + Std.string(this1._0) + "," + Std.string(this1._1) + ")";
};
thx.core._Tuple.Tuple3_Impl_ = function() { };
thx.core._Tuple.Tuple3_Impl_.__name__ = ["thx","core","_Tuple","Tuple3_Impl_"];
thx.core._Tuple.Tuple3_Impl_._new = function(_0,_1,_2) {
	return { _0 : _0, _1 : _1, _2 : _2};
};
thx.core._Tuple.Tuple3_Impl_.flip = function(this1) {
	return { _0 : this1._2, _1 : this1._1, _2 : this1._0};
};
thx.core._Tuple.Tuple3_Impl_.dropLeft = function(this1) {
	return { _0 : this1._1, _1 : this1._2};
};
thx.core._Tuple.Tuple3_Impl_.dropRight = function(this1) {
	return { _0 : this1._0, _1 : this1._1};
};
thx.core._Tuple.Tuple3_Impl_["with"] = function(this1,v) {
	return { _0 : this1._0, _1 : this1._1, _2 : this1._2, _3 : v};
};
thx.core._Tuple.Tuple3_Impl_.toString = function(this1) {
	return "Tuple3(" + Std.string(this1._0) + "," + Std.string(this1._1) + "," + Std.string(this1._2) + ")";
};
thx.core._Tuple.Tuple4_Impl_ = function() { };
thx.core._Tuple.Tuple4_Impl_.__name__ = ["thx","core","_Tuple","Tuple4_Impl_"];
thx.core._Tuple.Tuple4_Impl_._new = function(_0,_1,_2,_3) {
	return { _0 : _0, _1 : _1, _2 : _2, _3 : _3};
};
thx.core._Tuple.Tuple4_Impl_.flip = function(this1) {
	return { _0 : this1._3, _1 : this1._2, _2 : this1._1, _3 : this1._0};
};
thx.core._Tuple.Tuple4_Impl_.dropLeft = function(this1) {
	return { _0 : this1._1, _1 : this1._2, _2 : this1._3};
};
thx.core._Tuple.Tuple4_Impl_.dropRight = function(this1) {
	return { _0 : this1._0, _1 : this1._1, _2 : this1._2};
};
thx.core._Tuple.Tuple4_Impl_["with"] = function(this1,v) {
	return { _0 : this1._0, _1 : this1._1, _2 : this1._2, _3 : this1._3, _4 : v};
};
thx.core._Tuple.Tuple4_Impl_.toString = function(this1) {
	return "Tuple4(" + Std.string(this1._0) + "," + Std.string(this1._1) + "," + Std.string(this1._2) + "," + Std.string(this1._3) + ")";
};
thx.core._Tuple.Tuple5_Impl_ = function() { };
thx.core._Tuple.Tuple5_Impl_.__name__ = ["thx","core","_Tuple","Tuple5_Impl_"];
thx.core._Tuple.Tuple5_Impl_._new = function(_0,_1,_2,_3,_4) {
	return { _0 : _0, _1 : _1, _2 : _2, _3 : _3, _4 : _4};
};
thx.core._Tuple.Tuple5_Impl_.flip = function(this1) {
	return { _0 : this1._4, _1 : this1._3, _2 : this1._2, _3 : this1._1, _4 : this1._0};
};
thx.core._Tuple.Tuple5_Impl_.dropLeft = function(this1) {
	return { _0 : this1._1, _1 : this1._2, _2 : this1._3, _3 : this1._4};
};
thx.core._Tuple.Tuple5_Impl_.dropRight = function(this1) {
	return { _0 : this1._0, _1 : this1._1, _2 : this1._2, _3 : this1._3};
};
thx.core._Tuple.Tuple5_Impl_["with"] = function(this1,v) {
	return { _0 : this1._0, _1 : this1._1, _2 : this1._2, _3 : this1._3, _4 : this1._4, _5 : v};
};
thx.core._Tuple.Tuple5_Impl_.toString = function(this1) {
	return "Tuple5(" + Std.string(this1._0) + "," + Std.string(this1._1) + "," + Std.string(this1._2) + "," + Std.string(this1._3) + "," + Std.string(this1._4) + ")";
};
thx.core._Tuple.Tuple6_Impl_ = function() { };
thx.core._Tuple.Tuple6_Impl_.__name__ = ["thx","core","_Tuple","Tuple6_Impl_"];
thx.core._Tuple.Tuple6_Impl_._new = function(_0,_1,_2,_3,_4,_5) {
	return { _0 : _0, _1 : _1, _2 : _2, _3 : _3, _4 : _4, _5 : _5};
};
thx.core._Tuple.Tuple6_Impl_.flip = function(this1) {
	return { _0 : this1._5, _1 : this1._4, _2 : this1._3, _3 : this1._2, _4 : this1._1, _5 : this1._0};
};
thx.core._Tuple.Tuple6_Impl_.dropLeft = function(this1) {
	return { _0 : this1._1, _1 : this1._2, _2 : this1._3, _3 : this1._4, _4 : this1._5};
};
thx.core._Tuple.Tuple6_Impl_.dropRight = function(this1) {
	return { _0 : this1._0, _1 : this1._1, _2 : this1._2, _3 : this1._3, _4 : this1._4};
};
thx.core._Tuple.Tuple6_Impl_.toString = function(this1) {
	return "Tuple6(" + Std.string(this1._0) + "," + Std.string(this1._1) + "," + Std.string(this1._2) + "," + Std.string(this1._3) + "," + Std.string(this1._4) + "," + Std.string(this1._5) + ")";
};
thx.core.Types = function() { };
thx.core.Types.__name__ = ["thx","core","Types"];
thx.core.Types.isAnonymousObject = function(v) {
	return Reflect.isObject(v) && null == Type.getClass(v);
};
thx.core.Types.sameType = function(a,b) {
	return thx.core.Types.typeToString(Type["typeof"](a)) == thx.core.Types.typeToString(Type["typeof"](b));
};
thx.core.Types.valueTypeToString = function(value) {
	return thx.core.Types.typeToString(Type["typeof"](value));
};
thx.core.Types.typeToString = function(type) {
	switch(type[1]) {
	case 1:
		return "Int";
	case 2:
		return "Float";
	case 3:
		return "Bool";
	case 4:
		return "{}";
	case 5:
		return "Function";
	case 6:
		var c = type[2];
		return Type.getClassName(c);
	case 7:
		var e = type[2];
		return Type.getEnumName(e);
	default:
		throw "invalid type " + Std.string(type);
	}
};
thx.core.Types.typeInheritance = function(type) {
	switch(type[1]) {
	case 1:
		return ["Int"];
	case 2:
		return ["Float"];
	case 3:
		return ["Bool"];
	case 4:
		return ["{}"];
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
		throw "invalid type " + Std.string(type);
	}
};
thx.core.Types.valueTypeInheritance = function(value) {
	return thx.core.Types.typeInheritance(Type["typeof"](value));
};
thx.core.UUID = function() { };
thx.core.UUID.__name__ = ["thx","core","UUID"];
thx.core.UUID.random = function() {
	return Math.floor(Math.random() * 16);
};
thx.core.UUID.srandom = function() {
	return "" + Math.floor(Math.random() * 16);
};
thx.core.UUID.create = function() {
	var s = [];
	var _g = 0;
	while(_g < 8) {
		var i = _g++;
		s[i] = "" + Math.floor(Math.random() * 16);
	}
	s[8] = "-";
	var _g1 = 9;
	while(_g1 < 13) {
		var i1 = _g1++;
		s[i1] = "" + Math.floor(Math.random() * 16);
	}
	s[13] = "-";
	s[14] = "4";
	var _g2 = 15;
	while(_g2 < 18) {
		var i2 = _g2++;
		s[i2] = "" + Math.floor(Math.random() * 16);
	}
	s[18] = "-";
	s[19] = "" + (Math.floor(Math.random() * 16) & 3 | 8);
	var _g3 = 20;
	while(_g3 < 23) {
		var i3 = _g3++;
		s[i3] = "" + Math.floor(Math.random() * 16);
	}
	s[23] = "-";
	var _g4 = 24;
	while(_g4 < 36) {
		var i4 = _g4++;
		s[i4] = "" + Math.floor(Math.random() * 16);
	}
	return s.join("");
};
thx.promise = {};
thx.promise.Future = function() {
	this.handlers = [];
	this.state = haxe.ds.Option.None;
};
thx.promise.Future.__name__ = ["thx","promise","Future"];
thx.promise.Future.all = function(arr) {
	return thx.promise.Future.create(function(callback) {
		var results = [];
		var counter = 0;
		thx.core.Arrays.mapi(arr,function(p,i) {
			p.then(function(value) {
				results[i] = value;
				counter++;
				if(counter == arr.length) callback(results);
			});
		});
	});
};
thx.promise.Future.create = function(handler) {
	var future = new thx.promise.Future();
	handler($bind(future,future.setState));
	return future;
};
thx.promise.Future.flatMap = function(future) {
	return thx.promise.Future.create(function(callback) {
		future.then(function(future1) {
			future1.then(callback);
		});
	});
};
thx.promise.Future.value = function(v) {
	return thx.promise.Future.create(function(callback) {
		callback(v);
	});
};
thx.promise.Future.prototype = {
	handlers: null
	,state: null
	,delay: function(delayms) {
		if(null == delayms) return thx.promise.Future.flatMap(this.map(function(value) {
			return thx.promise.Timer.immediateValue(value);
		})); else return thx.promise.Future.flatMap(this.map(function(value1) {
			return thx.promise.Timer.delayValue(value1,delayms);
		}));
	}
	,hasValue: function() {
		return thx.core.Options.toBool(this.state);
	}
	,map: function(handler) {
		var _g = this;
		return thx.promise.Future.create(function(callback) {
			_g.then(function(value) {
				callback(handler(value));
			});
		});
	}
	,mapAsync: function(handler) {
		var _g = this;
		return thx.promise.Future.create(function(callback) {
			_g.then(function(result) {
				handler(result,callback);
			});
		});
	}
	,mapFuture: function(handler) {
		return thx.promise.Future.flatMap(this.map(handler));
	}
	,then: function(handler) {
		this.handlers.push(handler);
		this.update();
		return this;
	}
	,toString: function() {
		return "Future";
	}
	,setState: function(newstate) {
		{
			var _g = this.state;
			switch(_g[1]) {
			case 1:
				this.state = haxe.ds.Option.Some(newstate);
				break;
			case 0:
				var r = _g[2];
				throw new thx.core.Error("future was already \"" + Std.string(r) + "\", can't apply the new state \"" + Std.string(newstate) + "\"",null,{ fileName : "Future.hx", lineNumber : 85, className : "thx.promise.Future", methodName : "setState"});
				break;
			}
		}
		this.update();
		return this;
	}
	,update: function() {
		{
			var _g = this.state;
			switch(_g[1]) {
			case 1:
				break;
			case 0:
				var result = _g[2];
				var index = -1;
				while(++index < this.handlers.length) this.handlers[index](result);
				this.handlers = [];
				break;
			}
		}
	}
	,__class__: thx.promise.Future
};
thx.promise.Futures = function() { };
thx.promise.Futures.__name__ = ["thx","promise","Futures"];
thx.promise.Futures.join = function(p1,p2) {
	return thx.promise.Future.create(function(callback) {
		var counter = 0;
		var v1 = null;
		var v2 = null;
		var complete = function() {
			if(counter < 2) return;
			callback({ _0 : v1, _1 : v2});
		};
		p1.then(function(v) {
			counter++;
			v1 = v;
			complete();
		});
		p2.then(function(v3) {
			counter++;
			v2 = v3;
			complete();
		});
	});
};
thx.promise.Futures.log = function(future,prefix) {
	if(prefix == null) prefix = "";
	return future.then(function(r) {
		haxe.Log.trace("" + prefix + " VALUE: " + Std.string(r),{ fileName : "Future.hx", lineNumber : 132, className : "thx.promise.Futures", methodName : "log"});
	});
};
thx.promise.FutureTuple6 = function() { };
thx.promise.FutureTuple6.__name__ = ["thx","promise","FutureTuple6"];
thx.promise.FutureTuple6.mapTuple = function(future,callback) {
	return future.map(function(t) {
		return callback(t._0,t._1,t._2,t._3,t._4,t._5);
	});
};
thx.promise.FutureTuple6.mapTupleAsync = function(future,callback) {
	return future.mapAsync(function(t,cb) {
		return callback(t._0,t._1,t._2,t._3,t._4,t._5,cb);
	});
};
thx.promise.FutureTuple6.mapTupleFuture = function(future,callback) {
	return thx.promise.Future.flatMap(future.map(function(t) {
		return callback(t._0,t._1,t._2,t._3,t._4,t._5);
	}));
};
thx.promise.FutureTuple6.tuple = function(future,callback) {
	return future.then(function(t) {
		callback(t._0,t._1,t._2,t._3,t._4,t._5);
	});
};
thx.promise.FutureTuple5 = function() { };
thx.promise.FutureTuple5.__name__ = ["thx","promise","FutureTuple5"];
thx.promise.FutureTuple5.join = function(p1,p2) {
	return thx.promise.Future.create(function(callback) {
		thx.promise.Futures.join(p1,p2).then(function(t) {
			callback((function($this) {
				var $r;
				var this1 = t._0;
				$r = { _0 : this1._0, _1 : this1._1, _2 : this1._2, _3 : this1._3, _4 : this1._4, _5 : t._1};
				return $r;
			}(this)));
		});
	});
};
thx.promise.FutureTuple5.mapTuple = function(future,callback) {
	return future.map(function(t) {
		return callback(t._0,t._1,t._2,t._3,t._4);
	});
};
thx.promise.FutureTuple5.mapTupleAsync = function(future,callback) {
	return future.mapAsync(function(t,cb) {
		return callback(t._0,t._1,t._2,t._3,t._4,cb);
	});
};
thx.promise.FutureTuple5.mapTupleFuture = function(future,callback) {
	return thx.promise.Future.flatMap(future.map(function(t) {
		return callback(t._0,t._1,t._2,t._3,t._4);
	}));
};
thx.promise.FutureTuple5.tuple = function(future,callback) {
	return future.then(function(t) {
		callback(t._0,t._1,t._2,t._3,t._4);
	});
};
thx.promise.FutureTuple4 = function() { };
thx.promise.FutureTuple4.__name__ = ["thx","promise","FutureTuple4"];
thx.promise.FutureTuple4.join = function(p1,p2) {
	return thx.promise.Future.create(function(callback) {
		thx.promise.Futures.join(p1,p2).then(function(t) {
			callback((function($this) {
				var $r;
				var this1 = t._0;
				$r = { _0 : this1._0, _1 : this1._1, _2 : this1._2, _3 : this1._3, _4 : t._1};
				return $r;
			}(this)));
		});
	});
};
thx.promise.FutureTuple4.mapTuple = function(future,callback) {
	return future.map(function(t) {
		return callback(t._0,t._1,t._2,t._3);
	});
};
thx.promise.FutureTuple4.mapTupleAsync = function(future,callback) {
	return future.mapAsync(function(t,cb) {
		return callback(t._0,t._1,t._2,t._3,cb);
	});
};
thx.promise.FutureTuple4.mapTupleFuture = function(future,callback) {
	return thx.promise.Future.flatMap(future.map(function(t) {
		return callback(t._0,t._1,t._2,t._3);
	}));
};
thx.promise.FutureTuple4.tuple = function(future,callback) {
	return future.then(function(t) {
		callback(t._0,t._1,t._2,t._3);
	});
};
thx.promise.FutureTuple3 = function() { };
thx.promise.FutureTuple3.__name__ = ["thx","promise","FutureTuple3"];
thx.promise.FutureTuple3.join = function(p1,p2) {
	return thx.promise.Future.create(function(callback) {
		thx.promise.Futures.join(p1,p2).then(function(t) {
			callback((function($this) {
				var $r;
				var this1 = t._0;
				$r = { _0 : this1._0, _1 : this1._1, _2 : this1._2, _3 : t._1};
				return $r;
			}(this)));
		});
	});
};
thx.promise.FutureTuple3.mapTuple = function(future,callback) {
	return future.map(function(t) {
		return callback(t._0,t._1,t._2);
	});
};
thx.promise.FutureTuple3.mapTupleAsync = function(future,callback) {
	return future.mapAsync(function(t,cb) {
		return callback(t._0,t._1,t._2,cb);
	});
};
thx.promise.FutureTuple3.mapTupleFuture = function(future,callback) {
	return thx.promise.Future.flatMap(future.map(function(t) {
		return callback(t._0,t._1,t._2);
	}));
};
thx.promise.FutureTuple3.tuple = function(future,callback) {
	return future.then(function(t) {
		callback(t._0,t._1,t._2);
	});
};
thx.promise.FutureTuple2 = function() { };
thx.promise.FutureTuple2.__name__ = ["thx","promise","FutureTuple2"];
thx.promise.FutureTuple2.join = function(p1,p2) {
	return thx.promise.Future.create(function(callback) {
		thx.promise.Futures.join(p1,p2).then(function(t) {
			callback((function($this) {
				var $r;
				var this1 = t._0;
				$r = { _0 : this1._0, _1 : this1._1, _2 : t._1};
				return $r;
			}(this)));
		});
	});
};
thx.promise.FutureTuple2.mapTuple = function(future,callback) {
	return future.map(function(t) {
		return callback(t._0,t._1);
	});
};
thx.promise.FutureTuple2.mapTupleAsync = function(future,callback) {
	return future.mapAsync(function(t,cb) {
		return callback(t._0,t._1,cb);
	});
};
thx.promise.FutureTuple2.mapTupleFuture = function(future,callback) {
	return thx.promise.Future.flatMap(future.map(function(t) {
		return callback(t._0,t._1);
	}));
};
thx.promise.FutureTuple2.tuple = function(future,callback) {
	return future.then(function(t) {
		callback(t._0,t._1);
	});
};
thx.promise.FutureNil = function() { };
thx.promise.FutureNil.__name__ = ["thx","promise","FutureNil"];
thx.promise.FutureNil.join = function(p1,p2) {
	return thx.promise.Future.create(function(callback) {
		thx.promise.Futures.join(p1,p2).then(function(t) {
			callback(t._1);
		});
	});
};
thx.promise._Promise = {};
thx.promise._Promise.Promise_Impl_ = function() { };
thx.promise._Promise.Promise_Impl_.__name__ = ["thx","promise","_Promise","Promise_Impl_"];
thx.promise._Promise.Promise_Impl_.futureToPromise = function(future) {
	return future.map(function(v) {
		return thx.core.Either.Right(v);
	});
};
thx.promise._Promise.Promise_Impl_.all = function(arr) {
	return thx.promise._Promise.Promise_Impl_.create(function(resolve,reject) {
		var results = [];
		var counter = 0;
		var hasError = false;
		thx.core.Arrays.mapi(arr,function(p,i) {
			thx.promise._Promise.Promise_Impl_.either(p,function(value) {
				if(hasError) return;
				results[i] = value;
				counter++;
				if(counter == arr.length) resolve(results);
			},function(err) {
				if(hasError) return;
				hasError = true;
				reject(err);
			});
		});
	});
};
thx.promise._Promise.Promise_Impl_.create = function(callback) {
	return thx.promise.Future.create(function(cb) {
		callback(function(value) {
			cb(thx.core.Either.Right(value));
		},function(error) {
			cb(thx.core.Either.Left(error));
		});
	});
};
thx.promise._Promise.Promise_Impl_.createFulfill = function(callback) {
	return thx.promise.Future.create(callback);
};
thx.promise._Promise.Promise_Impl_.error = function(err) {
	return thx.promise._Promise.Promise_Impl_.create(function(_,reject) {
		reject(err);
	});
};
thx.promise._Promise.Promise_Impl_.value = function(v) {
	return thx.promise._Promise.Promise_Impl_.create(function(resolve,_) {
		resolve(v);
	});
};
thx.promise._Promise.Promise_Impl_.always = function(this1,handler) {
	this1.then(function(_) {
		handler();
	});
};
thx.promise._Promise.Promise_Impl_.either = function(this1,success,failure) {
	this1.then(function(r) {
		switch(r[1]) {
		case 1:
			var value = r[2];
			success(value);
			break;
		case 0:
			var error = r[2];
			failure(error);
			break;
		}
	});
	return this1;
};
thx.promise._Promise.Promise_Impl_.delay = function(this1,delayms) {
	return this1.delay(delayms);
};
thx.promise._Promise.Promise_Impl_.isFailure = function(this1) {
	{
		var _g = this1.state;
		switch(_g[1]) {
		case 1:
			return false;
		case 0:
			switch(_g[2][1]) {
			case 1:
				return false;
			default:
				return true;
			}
			break;
		}
	}
};
thx.promise._Promise.Promise_Impl_.isResolved = function(this1) {
	{
		var _g = this1.state;
		switch(_g[1]) {
		case 1:
			return false;
		case 0:
			switch(_g[2][1]) {
			case 0:
				return false;
			default:
				return true;
			}
			break;
		}
	}
};
thx.promise._Promise.Promise_Impl_.failure = function(this1,failure) {
	return thx.promise._Promise.Promise_Impl_.either(this1,function(_) {
	},failure);
};
thx.promise._Promise.Promise_Impl_.mapAlways = function(this1,handler) {
	return this1.map(function(_) {
		return handler();
	});
};
thx.promise._Promise.Promise_Impl_.mapAlwaysAsync = function(this1,handler) {
	return this1.mapAsync(function(_,cb) {
		return handler(cb);
	});
};
thx.promise._Promise.Promise_Impl_.mapAlwaysFuture = function(this1,handler) {
	return thx.promise.Future.flatMap(this1.map(function(_) {
		return handler();
	}));
};
thx.promise._Promise.Promise_Impl_.mapEither = function(this1,success,failure) {
	return this1.map(function(result) {
		switch(result[1]) {
		case 1:
			var value = result[2];
			return success(value);
		case 0:
			var error = result[2];
			return failure(error);
		}
	});
};
thx.promise._Promise.Promise_Impl_.mapEitherFuture = function(this1,success,failure) {
	return thx.promise.Future.flatMap(this1.map(function(result) {
		switch(result[1]) {
		case 1:
			var value = result[2];
			return success(value);
		case 0:
			var error = result[2];
			return failure(error);
		}
	}));
};
thx.promise._Promise.Promise_Impl_.mapFailure = function(this1,failure) {
	return thx.promise._Promise.Promise_Impl_.mapEither(this1,function(value) {
		return value;
	},failure);
};
thx.promise._Promise.Promise_Impl_.mapFailureFuture = function(this1,failure) {
	return thx.promise._Promise.Promise_Impl_.mapEitherFuture(this1,function(value) {
		return thx.promise.Future.value(value);
	},failure);
};
thx.promise._Promise.Promise_Impl_.mapSuccess = function(this1,success) {
	return thx.promise._Promise.Promise_Impl_.mapEitherFuture(this1,function(v) {
		return thx.promise._Promise.Promise_Impl_.value(success(v));
	},function(err) {
		return thx.promise._Promise.Promise_Impl_.error(err);
	});
};
thx.promise._Promise.Promise_Impl_.mapSuccessPromise = function(this1,success) {
	return thx.promise._Promise.Promise_Impl_.mapEitherFuture(this1,success,function(err) {
		return thx.promise._Promise.Promise_Impl_.error(err);
	});
};
thx.promise._Promise.Promise_Impl_.success = function(this1,success) {
	return thx.promise._Promise.Promise_Impl_.either(this1,success,function(_) {
	});
};
thx.promise._Promise.Promise_Impl_.throwFailure = function(this1) {
	return thx.promise._Promise.Promise_Impl_.failure(this1,function(err) {
		throw err;
	});
};
thx.promise._Promise.Promise_Impl_.toString = function(this1) {
	return "Promise";
};
thx.promise.Promises = function() { };
thx.promise.Promises.__name__ = ["thx","promise","Promises"];
thx.promise.Promises.join = function(p1,p2) {
	return thx.promise._Promise.Promise_Impl_.create(function(resolve,reject) {
		var hasError = false;
		var counter = 0;
		var v1 = null;
		var v2 = null;
		var complete = function() {
			if(counter < 2) return;
			resolve({ _0 : v1, _1 : v2});
		};
		var handleError = function(error) {
			if(hasError) return;
			hasError = true;
			reject(error);
		};
		thx.promise._Promise.Promise_Impl_.either(p1,function(v) {
			if(hasError) return;
			counter++;
			v1 = v;
			complete();
		},handleError);
		thx.promise._Promise.Promise_Impl_.either(p2,function(v3) {
			if(hasError) return;
			counter++;
			v2 = v3;
			complete();
		},handleError);
	});
};
thx.promise.Promises.log = function(promise,prefix) {
	if(prefix == null) prefix = "";
	return thx.promise._Promise.Promise_Impl_.either(promise,function(r) {
		haxe.Log.trace("" + prefix + " SUCCESS: " + Std.string(r),{ fileName : "Promise.hx", lineNumber : 174, className : "thx.promise.Promises", methodName : "log"});
	},function(e) {
		haxe.Log.trace("" + prefix + " ERROR: " + e.toString(),{ fileName : "Promise.hx", lineNumber : 175, className : "thx.promise.Promises", methodName : "log"});
	});
};
thx.promise.PromiseTuple6 = function() { };
thx.promise.PromiseTuple6.__name__ = ["thx","promise","PromiseTuple6"];
thx.promise.PromiseTuple6.mapTuplePromise = function(promise,success) {
	return thx.promise._Promise.Promise_Impl_.mapSuccessPromise(promise,function(t) {
		return success(t._0,t._1,t._2,t._3,t._4,t._5);
	});
};
thx.promise.PromiseTuple6.mapTuple = function(promise,success) {
	return thx.promise._Promise.Promise_Impl_.mapSuccess(promise,function(t) {
		return success(t._0,t._1,t._2,t._3,t._4,t._5);
	});
};
thx.promise.PromiseTuple6.tuple = function(promise,success,failure) {
	return thx.promise._Promise.Promise_Impl_.either(promise,function(t) {
		success(t._0,t._1,t._2,t._3,t._4,t._5);
	},null == failure?function(_) {
	}:failure);
};
thx.promise.PromiseTuple5 = function() { };
thx.promise.PromiseTuple5.__name__ = ["thx","promise","PromiseTuple5"];
thx.promise.PromiseTuple5.join = function(p1,p2) {
	return thx.promise._Promise.Promise_Impl_.create(function(resolve,reject) {
		thx.promise._Promise.Promise_Impl_.either(thx.promise.Promises.join(p1,p2),function(t) {
			resolve((function($this) {
				var $r;
				var this1 = t._0;
				$r = { _0 : this1._0, _1 : this1._1, _2 : this1._2, _3 : this1._3, _4 : this1._4, _5 : t._1};
				return $r;
			}(this)));
		},function(e) {
			reject(e);
		});
	});
};
thx.promise.PromiseTuple5.mapTuplePromise = function(promise,success) {
	return thx.promise._Promise.Promise_Impl_.mapSuccessPromise(promise,function(t) {
		return success(t._0,t._1,t._2,t._3,t._4);
	});
};
thx.promise.PromiseTuple5.mapTuple = function(promise,success) {
	return thx.promise._Promise.Promise_Impl_.mapSuccess(promise,function(t) {
		return success(t._0,t._1,t._2,t._3,t._4);
	});
};
thx.promise.PromiseTuple5.tuple = function(promise,success,failure) {
	return thx.promise._Promise.Promise_Impl_.either(promise,function(t) {
		success(t._0,t._1,t._2,t._3,t._4);
	},null == failure?function(_) {
	}:failure);
};
thx.promise.PromiseTuple4 = function() { };
thx.promise.PromiseTuple4.__name__ = ["thx","promise","PromiseTuple4"];
thx.promise.PromiseTuple4.join = function(p1,p2) {
	return thx.promise._Promise.Promise_Impl_.create(function(resolve,reject) {
		thx.promise._Promise.Promise_Impl_.either(thx.promise.Promises.join(p1,p2),function(t) {
			resolve((function($this) {
				var $r;
				var this1 = t._0;
				$r = { _0 : this1._0, _1 : this1._1, _2 : this1._2, _3 : this1._3, _4 : t._1};
				return $r;
			}(this)));
		},function(e) {
			reject(e);
		});
	});
};
thx.promise.PromiseTuple4.mapTuplePromise = function(promise,success) {
	return thx.promise._Promise.Promise_Impl_.mapSuccessPromise(promise,function(t) {
		return success(t._0,t._1,t._2,t._3);
	});
};
thx.promise.PromiseTuple4.mapTuple = function(promise,success) {
	return thx.promise._Promise.Promise_Impl_.mapSuccess(promise,function(t) {
		return success(t._0,t._1,t._2,t._3);
	});
};
thx.promise.PromiseTuple4.tuple = function(promise,success,failure) {
	return thx.promise._Promise.Promise_Impl_.either(promise,function(t) {
		success(t._0,t._1,t._2,t._3);
	},null == failure?function(_) {
	}:failure);
};
thx.promise.PromiseTuple3 = function() { };
thx.promise.PromiseTuple3.__name__ = ["thx","promise","PromiseTuple3"];
thx.promise.PromiseTuple3.join = function(p1,p2) {
	return thx.promise._Promise.Promise_Impl_.create(function(resolve,reject) {
		thx.promise._Promise.Promise_Impl_.either(thx.promise.Promises.join(p1,p2),function(t) {
			resolve((function($this) {
				var $r;
				var this1 = t._0;
				$r = { _0 : this1._0, _1 : this1._1, _2 : this1._2, _3 : t._1};
				return $r;
			}(this)));
		},function(e) {
			reject(e);
		});
	});
};
thx.promise.PromiseTuple3.mapTuplePromise = function(promise,success) {
	return thx.promise._Promise.Promise_Impl_.mapSuccessPromise(promise,function(t) {
		return success(t._0,t._1,t._2);
	});
};
thx.promise.PromiseTuple3.mapTuple = function(promise,success) {
	return thx.promise._Promise.Promise_Impl_.mapSuccess(promise,function(t) {
		return success(t._0,t._1,t._2);
	});
};
thx.promise.PromiseTuple3.tuple = function(promise,success,failure) {
	return thx.promise._Promise.Promise_Impl_.either(promise,function(t) {
		success(t._0,t._1,t._2);
	},null == failure?function(_) {
	}:failure);
};
thx.promise.PromiseTuple2 = function() { };
thx.promise.PromiseTuple2.__name__ = ["thx","promise","PromiseTuple2"];
thx.promise.PromiseTuple2.join = function(p1,p2) {
	return thx.promise._Promise.Promise_Impl_.create(function(resolve,reject) {
		thx.promise._Promise.Promise_Impl_.either(thx.promise.Promises.join(p1,p2),function(t) {
			resolve((function($this) {
				var $r;
				var this1 = t._0;
				$r = { _0 : this1._0, _1 : this1._1, _2 : t._1};
				return $r;
			}(this)));
		},function(e) {
			reject(e);
		});
	});
};
thx.promise.PromiseTuple2.mapTuplePromise = function(promise,success) {
	return thx.promise._Promise.Promise_Impl_.mapSuccessPromise(promise,function(t) {
		return success(t._0,t._1);
	});
};
thx.promise.PromiseTuple2.mapTuple = function(promise,success) {
	return thx.promise._Promise.Promise_Impl_.mapSuccess(promise,function(t) {
		return success(t._0,t._1);
	});
};
thx.promise.PromiseTuple2.tuple = function(promise,success,failure) {
	return thx.promise._Promise.Promise_Impl_.either(promise,function(t) {
		success(t._0,t._1);
	},null == failure?function(_) {
	}:failure);
};
thx.promise.PromiseNil = function() { };
thx.promise.PromiseNil.__name__ = ["thx","promise","PromiseNil"];
thx.promise.PromiseNil.join = function(p1,p2) {
	return thx.promise._Promise.Promise_Impl_.create(function(resolve,reject) {
		thx.promise._Promise.Promise_Impl_.either(thx.promise.Promises.join(p1,p2),function(t) {
			resolve(t._1);
		},function(e) {
			reject(e);
		});
	});
};
thx.promise.Timer = function() { };
thx.promise.Timer.__name__ = ["thx","promise","Timer"];
thx.promise.Timer.delay = function(delayms) {
	return thx.promise.Timer.delayValue(thx.core.Nil.nil,delayms);
};
thx.promise.Timer.delayValue = function(value,delayms) {
	return thx.promise.Future.create(function(callback) {
		thx.core.Timer.delay((function(f,a1) {
			return function() {
				return f(a1);
			};
		})(callback,value),delayms);
	});
};
thx.promise.Timer.immediate = function() {
	return thx.promise.Timer.immediateValue(thx.core.Nil.nil);
};
thx.promise.Timer.immediateValue = function(value) {
	return thx.promise.Future.create(function(callback) {
		thx.core.Timer.immediate((function(f,a1) {
			return function() {
				return f(a1);
			};
		})(callback,value));
	});
};
thx.stream = {};
thx.stream.Emitter = function(init) {
	this.init = init;
};
thx.stream.Emitter.__name__ = ["thx","stream","Emitter"];
thx.stream.Emitter.prototype = {
	init: null
	,feed: function(value) {
		var stream = new thx.stream.Stream(null);
		stream.subscriber = function(r) {
			switch(r[1]) {
			case 0:
				var v = r[2];
				value.set(v);
				break;
			case 1:
				var c = r[2];
				if(c) stream.cancel(); else stream.end();
				break;
			}
		};
		value.upStreams.push(stream);
		stream.addCleanUp(function() {
			HxOverrides.remove(value.upStreams,stream);
		});
		this.init(stream);
		return stream;
	}
	,plug: function(bus) {
		var stream = new thx.stream.Stream(null);
		stream.subscriber = $bind(bus,bus.emit);
		bus.upStreams.push(stream);
		stream.addCleanUp(function() {
			HxOverrides.remove(bus.upStreams,stream);
		});
		this.init(stream);
		return stream;
	}
	,sign: function(subscriber) {
		var stream = new thx.stream.Stream(subscriber);
		this.init(stream);
		return stream;
	}
	,subscribe: function(pulse,end) {
		if(null != pulse) pulse = pulse; else pulse = function(_) {
		};
		if(null != end) end = end; else end = function(_1) {
		};
		var stream = new thx.stream.Stream(function(r) {
			switch(r[1]) {
			case 0:
				var v = r[2];
				pulse(v);
				break;
			case 1:
				var c = r[2];
				end(c);
				break;
			}
		});
		this.init(stream);
		return stream;
	}
	,concat: function(other) {
		var _g = this;
		return new thx.stream.Emitter(function(stream) {
			_g.init(new thx.stream.Stream(function(r) {
				switch(r[1]) {
				case 0:
					var v = r[2];
					stream.pulse(v);
					break;
				case 1:
					switch(r[2]) {
					case true:
						stream.cancel();
						break;
					case false:
						other.init(stream);
						break;
					}
					break;
				}
			}));
		});
	}
	,count: function() {
		return this.map((function() {
			var c = 0;
			return function(_) {
				return ++c;
			};
		})());
	}
	,debounce: function(delay) {
		var _g = this;
		return new thx.stream.Emitter(function(stream) {
			var cancel = function() {
			};
			stream.addCleanUp(function() {
				cancel();
			});
			_g.init(new thx.stream.Stream(function(r) {
				switch(r[1]) {
				case 0:
					var v = r[2];
					cancel();
					cancel = thx.core.Timer.delay((function(f,v1) {
						return function() {
							return f(v1);
						};
					})($bind(stream,stream.pulse),v),delay);
					break;
				case 1:
					switch(r[2]) {
					case true:
						stream.cancel();
						break;
					case false:
						thx.core.Timer.delay($bind(stream,stream.end),delay);
						break;
					}
					break;
				}
			}));
		});
	}
	,delay: function(time) {
		var _g = this;
		return new thx.stream.Emitter(function(stream) {
			var cancel = thx.core.Timer.delay(function() {
				_g.init(stream);
			},time);
			stream.addCleanUp(cancel);
		});
	}
	,diff: function(init,f) {
		return this.window(2,null != init).map(function(a) {
			if(a.length == 1) return f(init,a[0]); else return f(a[0],a[1]);
		});
	}
	,merge: function(other) {
		var _g = this;
		return new thx.stream.Emitter(function(stream) {
			_g.init(stream);
			other.init(stream);
		});
	}
	,previous: function() {
		var _g = this;
		return new thx.stream.Emitter(function(stream) {
			var value = null;
			var first = true;
			var pulse = function() {
				if(first) {
					first = false;
					return;
				}
				stream.pulse(value);
			};
			_g.init(new thx.stream.Stream(function(r) {
				switch(r[1]) {
				case 0:
					var v = r[2];
					pulse();
					value = v;
					break;
				case 1:
					switch(r[2]) {
					case true:
						stream.cancel();
						break;
					case false:
						stream.end();
						break;
					}
					break;
				}
			}));
		});
	}
	,reduce: function(acc,f) {
		var _g = this;
		return new thx.stream.Emitter(function(stream) {
			_g.init(new thx.stream.Stream(function(r) {
				switch(r[1]) {
				case 0:
					var v = r[2];
					acc = f(acc,v);
					stream.pulse(acc);
					break;
				case 1:
					switch(r[2]) {
					case true:
						stream.cancel();
						break;
					case false:
						stream.end();
						break;
					}
					break;
				}
			}));
		});
	}
	,window: function(size,emitWithLess) {
		if(emitWithLess == null) emitWithLess = false;
		var _g = this;
		return new thx.stream.Emitter(function(stream) {
			var buf = [];
			var pulse = function() {
				if(buf.length > size) buf.shift();
				if(buf.length == size || emitWithLess) stream.pulse(buf.slice());
			};
			_g.init(new thx.stream.Stream(function(r) {
				switch(r[1]) {
				case 0:
					var v = r[2];
					buf.push(v);
					pulse();
					break;
				case 1:
					switch(r[2]) {
					case true:
						stream.cancel();
						break;
					case false:
						stream.end();
						break;
					}
					break;
				}
			}));
		});
	}
	,mapFuture: function(f) {
		var _g = this;
		return new thx.stream.Emitter(function(stream) {
			_g.init(new thx.stream.Stream(function(r) {
				switch(r[1]) {
				case 0:
					var v = r[2];
					f(v).then($bind(stream,stream.pulse));
					break;
				case 1:
					switch(r[2]) {
					case true:
						stream.cancel();
						break;
					case false:
						stream.end();
						break;
					}
					break;
				}
			}));
		});
	}
	,map: function(f) {
		return this.mapFuture(function(v) {
			return thx.promise.Future.value(f(v));
		});
	}
	,toOption: function() {
		return this.map(function(v) {
			if(null == v) return haxe.ds.Option.None; else return haxe.ds.Option.Some(v);
		});
	}
	,toNil: function() {
		return this.map(function(_) {
			return thx.core.Nil.nil;
		});
	}
	,toTrue: function() {
		return this.map(function(_) {
			return true;
		});
	}
	,toFalse: function() {
		return this.map(function(_) {
			return false;
		});
	}
	,toValue: function(value) {
		return this.map(function(_) {
			return value;
		});
	}
	,filterFuture: function(f) {
		var _g = this;
		return new thx.stream.Emitter(function(stream) {
			_g.init(new thx.stream.Stream(function(r) {
				switch(r[1]) {
				case 0:
					var v = r[2];
					f(v).then(function(c) {
						if(c) stream.pulse(v);
					});
					break;
				case 1:
					switch(r[2]) {
					case true:
						stream.cancel();
						break;
					case false:
						stream.end();
						break;
					}
					break;
				}
			}));
		});
	}
	,filter: function(f) {
		return this.filterFuture(function(v) {
			return thx.promise.Future.value(f(v));
		});
	}
	,first: function() {
		return this.take(1);
	}
	,distinct: function(equals) {
		if(null == equals) equals = function(a,b) {
			return a == b;
		};
		var last = null;
		return this.filter(function(v) {
			if(equals(v,last)) return false; else {
				last = v;
				return true;
			}
		});
	}
	,last: function() {
		var _g = this;
		return new thx.stream.Emitter(function(stream) {
			var last = null;
			_g.init(new thx.stream.Stream(function(r) {
				switch(r[1]) {
				case 0:
					var v = r[2];
					last = v;
					break;
				case 1:
					switch(r[2]) {
					case true:
						stream.cancel();
						break;
					case false:
						stream.pulse(last);
						stream.end();
						break;
					}
					break;
				}
			}));
		});
	}
	,memberOf: function(arr,equality) {
		return this.filter(function(v) {
			return thx.core.Arrays.contains(arr,v,equality);
		});
	}
	,notNull: function() {
		return this.filter(function(v) {
			return v != null;
		});
	}
	,skip: function(n) {
		return this.skipUntil((function() {
			var count = 0;
			return function(_) {
				return count++ < n;
			};
		})());
	}
	,skipUntil: function(predicate) {
		return this.filter((function() {
			var flag = false;
			return function(v) {
				if(flag) return true;
				if(predicate(v)) return false;
				return flag = true;
			};
		})());
	}
	,take: function(count) {
		return this.takeUntil((function(counter) {
			return function(_) {
				return counter++ < count;
			};
		})(0));
	}
	,takeAt: function(index) {
		return this.take(index + 1).last();
	}
	,takeLast: function(n) {
		return thx.stream.EmitterArrays.flatten(this.window(n).last());
	}
	,takeUntil: function(f) {
		var _g = this;
		return new thx.stream.Emitter(function(stream) {
			var instream = null;
			instream = new thx.stream.Stream(function(r) {
				switch(r[1]) {
				case 0:
					var v = r[2];
					if(f(v)) stream.pulse(v); else {
						instream.end();
						stream.end();
					}
					break;
				case 1:
					switch(r[2]) {
					case true:
						instream.cancel();
						stream.cancel();
						break;
					case false:
						instream.end();
						stream.end();
						break;
					}
					break;
				}
			});
			_g.init(instream);
		});
	}
	,withValue: function(expected) {
		return this.filter(function(v) {
			return v == expected;
		});
	}
	,split: function() {
		var _g = this;
		var inited = false;
		var streams = [];
		var init = function(stream) {
			streams.push(stream);
			if(!inited) {
				inited = true;
				thx.core.Timer.immediate(function() {
					_g.init(new thx.stream.Stream(function(r) {
						switch(r[1]) {
						case 0:
							var v = r[2];
							var _g1 = 0;
							while(_g1 < streams.length) {
								var s = streams[_g1];
								++_g1;
								s.pulse(v);
							}
							break;
						case 1:
							switch(r[2]) {
							case true:
								var _g11 = 0;
								while(_g11 < streams.length) {
									var s1 = streams[_g11];
									++_g11;
									s1.cancel();
								}
								break;
							case false:
								var _g12 = 0;
								while(_g12 < streams.length) {
									var s2 = streams[_g12];
									++_g12;
									s2.end();
								}
								break;
							}
							break;
						}
					}));
				});
			}
		};
		var _0 = new thx.stream.Emitter(init);
		var _1 = new thx.stream.Emitter(init);
		return { _0 : _0, _1 : _1};
	}
	,audit: function(handler) {
		return this.map(function(v) {
			handler(v);
			return v;
		});
	}
	,log: function(prefix,posInfo) {
		if(prefix == null) prefix = ""; else prefix = "" + prefix + ": ";
		return this.map(function(v) {
			haxe.Log.trace("" + prefix + Std.string(v),posInfo);
			return v;
		});
	}
	,pair: function(other) {
		var _g = this;
		return new thx.stream.Emitter(function(stream) {
			var _0 = null;
			var _1 = null;
			stream.addCleanUp(function() {
				_0 = null;
				_1 = null;
			});
			var pulse = function() {
				if(null == _0 || null == _1) return;
				stream.pulse({ _0 : _0, _1 : _1});
			};
			_g.init(new thx.stream.Stream(function(r) {
				switch(r[1]) {
				case 0:
					var v = r[2];
					_0 = v;
					pulse();
					break;
				case 1:
					switch(r[2]) {
					case true:
						stream.cancel();
						break;
					case false:
						stream.end();
						break;
					}
					break;
				}
			}));
			other.init(new thx.stream.Stream(function(r1) {
				switch(r1[1]) {
				case 0:
					var v1 = r1[2];
					_1 = v1;
					pulse();
					break;
				case 1:
					switch(r1[2]) {
					case true:
						stream.cancel();
						break;
					case false:
						stream.end();
						break;
					}
					break;
				}
			}));
		});
	}
	,sampleBy: function(sampler) {
		var _g = this;
		return new thx.stream.Emitter(function(stream) {
			var _0 = null;
			var _1 = null;
			stream.addCleanUp(function() {
				_0 = null;
				_1 = null;
			});
			var pulse = function() {
				if(null == _0 || null == _1) return;
				stream.pulse({ _0 : _0, _1 : _1});
			};
			_g.init(new thx.stream.Stream(function(r) {
				switch(r[1]) {
				case 0:
					var v = r[2];
					_0 = v;
					break;
				case 1:
					switch(r[2]) {
					case true:
						stream.cancel();
						break;
					case false:
						stream.end();
						break;
					}
					break;
				}
			}));
			sampler.init(new thx.stream.Stream(function(r1) {
				switch(r1[1]) {
				case 0:
					var v1 = r1[2];
					_1 = v1;
					pulse();
					break;
				case 1:
					switch(r1[2]) {
					case true:
						stream.cancel();
						break;
					case false:
						stream.end();
						break;
					}
					break;
				}
			}));
		});
	}
	,samplerOf: function(sampled) {
		return sampled.sampleBy(this).map(function(t) {
			return { _0 : t._1, _1 : t._0};
		});
	}
	,zip: function(other) {
		var _g = this;
		return new thx.stream.Emitter(function(stream) {
			var _0 = [];
			var _1 = [];
			stream.addCleanUp(function() {
				_0 = null;
				_1 = null;
			});
			var pulse = function() {
				if(_0.length == 0 || _1.length == 0) return;
				stream.pulse((function($this) {
					var $r;
					var _01 = _0.shift();
					var _11 = _1.shift();
					$r = { _0 : _01, _1 : _11};
					return $r;
				}(this)));
			};
			_g.init(new thx.stream.Stream(function(r) {
				switch(r[1]) {
				case 0:
					var v = r[2];
					_0.push(v);
					pulse();
					break;
				case 1:
					switch(r[2]) {
					case true:
						stream.cancel();
						break;
					case false:
						stream.end();
						break;
					}
					break;
				}
			}));
			other.init(new thx.stream.Stream(function(r1) {
				switch(r1[1]) {
				case 0:
					var v1 = r1[2];
					_1.push(v1);
					pulse();
					break;
				case 1:
					switch(r1[2]) {
					case true:
						stream.cancel();
						break;
					case false:
						stream.end();
						break;
					}
					break;
				}
			}));
		});
	}
	,__class__: thx.stream.Emitter
};
thx.stream.Bus = function(distinctValuesOnly,equal) {
	if(distinctValuesOnly == null) distinctValuesOnly = false;
	var _g = this;
	this.distinctValuesOnly = distinctValuesOnly;
	if(null == equal) this.equal = function(a,b) {
		return a == b;
	}; else this.equal = equal;
	this.downStreams = [];
	this.upStreams = [];
	thx.stream.Emitter.call(this,function(stream) {
		_g.downStreams.push(stream);
		stream.addCleanUp(function() {
			HxOverrides.remove(_g.downStreams,stream);
		});
	});
};
thx.stream.Bus.__name__ = ["thx","stream","Bus"];
thx.stream.Bus.__super__ = thx.stream.Emitter;
thx.stream.Bus.prototype = $extend(thx.stream.Emitter.prototype,{
	downStreams: null
	,upStreams: null
	,distinctValuesOnly: null
	,equal: null
	,value: null
	,cancel: function() {
		this.emit(thx.stream.StreamValue.End(true));
	}
	,clearStreams: function() {
		var _g = 0;
		var _g1 = this.downStreams.slice();
		while(_g < _g1.length) {
			var stream = _g1[_g];
			++_g;
			stream.end();
		}
	}
	,clearEmitters: function() {
		var _g = 0;
		var _g1 = this.upStreams.slice();
		while(_g < _g1.length) {
			var stream = _g1[_g];
			++_g;
			stream.cancel();
		}
	}
	,clear: function() {
		this.clearEmitters();
		this.clearStreams();
	}
	,emit: function(value) {
		switch(value[1]) {
		case 0:
			var v = value[2];
			if(this.distinctValuesOnly) {
				if(this.equal(v,this.value)) return;
				this.value = v;
			}
			var _g = 0;
			var _g1 = this.downStreams.slice();
			while(_g < _g1.length) {
				var stream = _g1[_g];
				++_g;
				stream.pulse(v);
			}
			break;
		case 1:
			switch(value[2]) {
			case true:
				var _g2 = 0;
				var _g11 = this.downStreams.slice();
				while(_g2 < _g11.length) {
					var stream1 = _g11[_g2];
					++_g2;
					stream1.cancel();
				}
				break;
			case false:
				var _g3 = 0;
				var _g12 = this.downStreams.slice();
				while(_g3 < _g12.length) {
					var stream2 = _g12[_g3];
					++_g3;
					stream2.end();
				}
				break;
			}
			break;
		}
	}
	,end: function() {
		this.emit(thx.stream.StreamValue.End(false));
	}
	,pulse: function(value) {
		this.emit(thx.stream.StreamValue.Pulse(value));
	}
	,__class__: thx.stream.Bus
});
thx.stream.Emitters = function() { };
thx.stream.Emitters.__name__ = ["thx","stream","Emitters"];
thx.stream.Emitters.skipNull = function(emitter) {
	return emitter.filter(function(value) {
		return null != value;
	});
};
thx.stream.Emitters.unique = function(emitter) {
	return emitter.filter((function() {
		var buf = [];
		return function(v) {
			if(HxOverrides.indexOf(buf,v,0) >= 0) return false; else {
				buf.push(v);
				return true;
			}
		};
	})());
};
thx.stream.EmitterStrings = function() { };
thx.stream.EmitterStrings.__name__ = ["thx","stream","EmitterStrings"];
thx.stream.EmitterStrings.match = function(emitter,pattern) {
	return emitter.filter(function(s) {
		return pattern.match(s);
	});
};
thx.stream.EmitterStrings.toBool = function(emitter) {
	return emitter.map(function(s) {
		return s != null && s != "";
	});
};
thx.stream.EmitterStrings.truthy = function(emitter) {
	return emitter.filter(function(s) {
		return s != null && s != "";
	});
};
thx.stream.EmitterStrings.unique = function(emitter) {
	return emitter.filter((function() {
		var buf = new haxe.ds.StringMap();
		return function(v) {
			if(buf.exists(v)) return false; else {
				buf.set(v,true);
				return true;
			}
		};
	})());
};
thx.stream.EmitterInts = function() { };
thx.stream.EmitterInts.__name__ = ["thx","stream","EmitterInts"];
thx.stream.EmitterInts.average = function(emitter) {
	return emitter.map((function() {
		var sum = 0.0;
		var count = 0;
		return function(v) {
			return (sum += v) / ++count;
		};
	})());
};
thx.stream.EmitterInts.greaterThan = function(emitter,x) {
	return emitter.filter(function(v) {
		return v > x;
	});
};
thx.stream.EmitterInts.greaterThanOrEqualTo = function(emitter,x) {
	return emitter.filter(function(v) {
		return v >= x;
	});
};
thx.stream.EmitterInts.inRange = function(emitter,min,max) {
	return emitter.filter(function(v) {
		return v <= max && v >= min;
	});
};
thx.stream.EmitterInts.insideRange = function(emitter,min,max) {
	return emitter.filter(function(v) {
		return v < max && v > min;
	});
};
thx.stream.EmitterInts.lessThan = function(emitter,x) {
	return emitter.filter(function(v) {
		return v < x;
	});
};
thx.stream.EmitterInts.lessThanOrEqualTo = function(emitter,x) {
	return emitter.filter(function(v) {
		return v <= x;
	});
};
thx.stream.EmitterInts.max = function(emitter) {
	return emitter.filter((function() {
		var max = null;
		return function(v) {
			if(null == max || v > max) {
				max = v;
				return true;
			} else return false;
		};
	})());
};
thx.stream.EmitterInts.min = function(emitter) {
	return emitter.filter((function() {
		var min = null;
		return function(v) {
			if(null == min || v < min) {
				min = v;
				return true;
			} else return false;
		};
	})());
};
thx.stream.EmitterInts.sum = function(emitter) {
	return emitter.map((function() {
		var value = 0;
		return function(v) {
			return value += v;
		};
	})());
};
thx.stream.EmitterInts.toBool = function(emitter) {
	return emitter.map(function(i) {
		return i != 0;
	});
};
thx.stream.EmitterInts.unique = function(emitter) {
	return emitter.filter((function() {
		var buf = new haxe.ds.IntMap();
		return function(v) {
			if(buf.exists(v)) return false; else {
				buf.set(v,true);
				return true;
			}
		};
	})());
};
thx.stream.EmitterFloats = function() { };
thx.stream.EmitterFloats.__name__ = ["thx","stream","EmitterFloats"];
thx.stream.EmitterFloats.average = function(emitter) {
	return emitter.map((function() {
		var sum = 0.0;
		var count = 0;
		return function(v) {
			return (sum += v) / ++count;
		};
	})());
};
thx.stream.EmitterFloats.greaterThan = function(emitter,x) {
	return emitter.filter(function(v) {
		return v > x;
	});
};
thx.stream.EmitterFloats.greaterThanOrEqualTo = function(emitter,x) {
	return emitter.filter(function(v) {
		return v >= x;
	});
};
thx.stream.EmitterFloats.inRange = function(emitter,min,max) {
	return emitter.filter(function(v) {
		return v <= max && v >= min;
	});
};
thx.stream.EmitterFloats.insideRange = function(emitter,min,max) {
	return emitter.filter(function(v) {
		return v < max && v > min;
	});
};
thx.stream.EmitterFloats.lessThan = function(emitter,x) {
	return emitter.filter(function(v) {
		return v < x;
	});
};
thx.stream.EmitterFloats.lessThanOrEqualTo = function(emitter,x) {
	return emitter.filter(function(v) {
		return v <= x;
	});
};
thx.stream.EmitterFloats.max = function(emitter) {
	return emitter.filter((function() {
		var max = -Infinity;
		return function(v) {
			if(v > max) {
				max = v;
				return true;
			} else return false;
		};
	})());
};
thx.stream.EmitterFloats.min = function(emitter) {
	return emitter.filter((function() {
		var min = Infinity;
		return function(v) {
			if(v < min) {
				min = v;
				return true;
			} else return false;
		};
	})());
};
thx.stream.EmitterFloats.sum = function(emitter) {
	return emitter.map((function() {
		var sum = 0.0;
		return function(v) {
			return sum += v;
		};
	})());
};
thx.stream.EmitterOptions = function() { };
thx.stream.EmitterOptions.__name__ = ["thx","stream","EmitterOptions"];
thx.stream.EmitterOptions.either = function(emitter,some,none,end) {
	if(null == some) some = function(_) {
	};
	if(null == none) none = function() {
	};
	return emitter.subscribe(function(o) {
		switch(o[1]) {
		case 0:
			var v = o[2];
			some(v);
			break;
		case 1:
			none();
			break;
		}
	},end);
};
thx.stream.EmitterOptions.filterOption = function(emitter) {
	return emitter.filter(function(opt) {
		return thx.core.Options.toBool(opt);
	}).map(function(opt1) {
		return thx.core.Options.toValue(opt1);
	});
};
thx.stream.EmitterOptions.toBool = function(emitter) {
	return emitter.map(function(opt) {
		return thx.core.Options.toBool(opt);
	});
};
thx.stream.EmitterOptions.toValue = function(emitter) {
	return emitter.map(function(opt) {
		return thx.core.Options.toValue(opt);
	});
};
thx.stream.EmitterBools = function() { };
thx.stream.EmitterBools.__name__ = ["thx","stream","EmitterBools"];
thx.stream.EmitterBools.negate = function(emitter) {
	return emitter.map(function(v) {
		return !v;
	});
};
thx.stream.EmitterEmitters = function() { };
thx.stream.EmitterEmitters.__name__ = ["thx","stream","EmitterEmitters"];
thx.stream.EmitterEmitters.flatMap = function(emitter) {
	return new thx.stream.Emitter(function(stream) {
		emitter.init(new thx.stream.Stream(function(r) {
			switch(r[1]) {
			case 0:
				var em = r[2];
				em.init(stream);
				break;
			case 1:
				switch(r[2]) {
				case true:
					stream.cancel();
					break;
				case false:
					stream.end();
					break;
				}
				break;
			}
		}));
	});
};
thx.stream.EmitterArrays = function() { };
thx.stream.EmitterArrays.__name__ = ["thx","stream","EmitterArrays"];
thx.stream.EmitterArrays.containerOf = function(emitter,value) {
	return emitter.filter(function(arr) {
		return HxOverrides.indexOf(arr,value,0) >= 0;
	});
};
thx.stream.EmitterArrays.flatten = function(emitter) {
	return new thx.stream.Emitter(function(stream) {
		emitter.init(new thx.stream.Stream(function(r) {
			switch(r[1]) {
			case 0:
				var arr = r[2];
				arr.map($bind(stream,stream.pulse));
				break;
			case 1:
				switch(r[2]) {
				case true:
					stream.cancel();
					break;
				case false:
					stream.end();
					break;
				}
				break;
			}
		}));
	});
};
thx.stream.EmitterValues = function() { };
thx.stream.EmitterValues.__name__ = ["thx","stream","EmitterValues"];
thx.stream.EmitterValues.left = function(emitter) {
	return emitter.map(function(v) {
		return v._0;
	});
};
thx.stream.EmitterValues.right = function(emitter) {
	return emitter.map(function(v) {
		return v._1;
	});
};
thx.stream.IStream = function() { };
thx.stream.IStream.__name__ = ["thx","stream","IStream"];
thx.stream.IStream.prototype = {
	cancel: null
	,__class__: thx.stream.IStream
};
thx.stream.Stream = function(subscriber) {
	this.subscriber = subscriber;
	this.cleanUps = [];
	this.finalized = false;
	this.canceled = false;
};
thx.stream.Stream.__name__ = ["thx","stream","Stream"];
thx.stream.Stream.__interfaces__ = [thx.stream.IStream];
thx.stream.Stream.prototype = {
	subscriber: null
	,cleanUps: null
	,finalized: null
	,canceled: null
	,addCleanUp: function(f) {
		this.cleanUps.push(f);
	}
	,cancel: function() {
		this.canceled = true;
		this.finalize(thx.stream.StreamValue.End(true));
	}
	,end: function() {
		this.finalize(thx.stream.StreamValue.End(false));
	}
	,pulse: function(v) {
		this.subscriber(thx.stream.StreamValue.Pulse(v));
	}
	,finalize: function(signal) {
		if(this.finalized) return;
		this.finalized = true;
		while(this.cleanUps.length > 0) (this.cleanUps.shift())();
		this.subscriber(signal);
		this.subscriber = function(_) {
		};
	}
	,__class__: thx.stream.Stream
};
thx.stream.StreamValue = { __ename__ : ["thx","stream","StreamValue"], __constructs__ : ["Pulse","End"] };
thx.stream.StreamValue.Pulse = function(value) { var $x = ["Pulse",0,value]; $x.__enum__ = thx.stream.StreamValue; return $x; };
thx.stream.StreamValue.End = function(cancel) { var $x = ["End",1,cancel]; $x.__enum__ = thx.stream.StreamValue; return $x; };
thx.stream.Value = function(value,equals) {
	var _g = this;
	if(null == equals) this.equals = function(a,b) {
		return a == b;
	}; else this.equals = equals;
	this.value = value;
	this.downStreams = [];
	this.upStreams = [];
	thx.stream.Emitter.call(this,function(stream) {
		_g.downStreams.push(stream);
		stream.addCleanUp(function() {
			HxOverrides.remove(_g.downStreams,stream);
		});
		stream.pulse(_g.value);
	});
};
thx.stream.Value.__name__ = ["thx","stream","Value"];
thx.stream.Value.createOption = function(value,equals) {
	var def;
	if(null == value) def = haxe.ds.Option.None; else def = haxe.ds.Option.Some(value);
	return new thx.stream.Value(def,function(a,b) {
		return thx.core.Options.equals(a,b,equals);
	});
};
thx.stream.Value.__super__ = thx.stream.Emitter;
thx.stream.Value.prototype = $extend(thx.stream.Emitter.prototype,{
	value: null
	,downStreams: null
	,upStreams: null
	,equals: null
	,get: function() {
		return this.value;
	}
	,set: function(value) {
		if(this.equals(this.value,value)) return;
		this.value = value;
		this.update();
	}
	,clearStreams: function() {
		var _g = 0;
		var _g1 = this.downStreams.slice();
		while(_g < _g1.length) {
			var stream = _g1[_g];
			++_g;
			stream.end();
		}
	}
	,clearEmitters: function() {
		var _g = 0;
		var _g1 = this.upStreams.slice();
		while(_g < _g1.length) {
			var stream = _g1[_g];
			++_g;
			stream.cancel();
		}
	}
	,clear: function() {
		this.clearEmitters();
		this.clearStreams();
	}
	,update: function() {
		var _g = 0;
		var _g1 = this.downStreams.slice();
		while(_g < _g1.length) {
			var stream = _g1[_g];
			++_g;
			stream.pulse(this.value);
		}
	}
	,__class__: thx.stream.Value
});
thx.stream.dom = {};
thx.stream.dom.Dom = function() { };
thx.stream.dom.Dom.__name__ = ["thx","stream","dom","Dom"];
thx.stream.dom.Dom.ready = function() {
	return thx.promise._Promise.Promise_Impl_.create(function(resolve,_) {
		window.document.addEventListener("DOMContentLoaded",function(_1) {
			resolve(thx.core.Nil.nil);
		},false);
	});
};
thx.stream.dom.Dom.streamClick = function(el,capture) {
	if(capture == null) capture = false;
	return thx.stream.dom.Dom.streamEvent(el,"click",capture);
};
thx.stream.dom.Dom.streamEvent = function(el,name,capture) {
	if(capture == null) capture = false;
	return new thx.stream.Emitter(function(stream) {
		el.addEventListener(name,$bind(stream,stream.pulse),capture);
		stream.addCleanUp(function() {
			el.removeEventListener(name,$bind(stream,stream.pulse),capture);
		});
	});
};
thx.stream.dom.Dom.streamFocus = function(el,capture) {
	if(capture == null) capture = false;
	return thx.stream.dom.Dom.streamEvent(el,"focus",capture).toTrue().merge(thx.stream.dom.Dom.streamEvent(el,"blur",capture).toFalse());
};
thx.stream.dom.Dom.streamKey = function(el,name,capture) {
	if(capture == null) capture = false;
	return new thx.stream.Emitter((function($this) {
		var $r;
		if(!StringTools.startsWith(name,"key")) name = "key" + name;
		$r = function(stream) {
			el.addEventListener(name,$bind(stream,stream.pulse),capture);
			stream.addCleanUp(function() {
				el.removeEventListener(name,$bind(stream,stream.pulse),capture);
			});
		};
		return $r;
	}(this)));
};
thx.stream.dom.Dom.streamInput = function(el,capture) {
	if(capture == null) capture = false;
	return thx.stream.dom.Dom.streamEvent(el,"input",capture).map(function(_) {
		return el.value;
	});
};
thx.stream.dom.Dom.streamMouseDown = function(el,capture) {
	if(capture == null) capture = false;
	return thx.stream.dom.Dom.streamEvent(el,"mousedown",capture);
};
thx.stream.dom.Dom.streamMouseEvent = function(el,name,capture) {
	if(capture == null) capture = false;
	return thx.stream.dom.Dom.streamEvent(el,name,capture);
};
thx.stream.dom.Dom.streamMouseMove = function(el,capture) {
	if(capture == null) capture = false;
	return thx.stream.dom.Dom.streamEvent(el,"mousemove",capture);
};
thx.stream.dom.Dom.streamMouseUp = function(el,capture) {
	if(capture == null) capture = false;
	return thx.stream.dom.Dom.streamEvent(el,"mouseup",capture);
};
thx.stream.dom.Dom.subscribeAttribute = function(el,name) {
	return function(value) {
		if(null == value) el.removeAttribute(name); else el.setAttribute(name,value);
	};
};
thx.stream.dom.Dom.subscribeFocus = function(el) {
	return function(focus) {
		if(focus) el.focus(); else el.blur();
	};
};
thx.stream.dom.Dom.subscribeHTML = function(el) {
	return function(html) {
		el.innerHTML = html;
	};
};
thx.stream.dom.Dom.subscribeText = function(el,force) {
	if(force == null) force = false;
	return function(text) {
		if(el.textContent != text || force) el.textContent = text;
	};
};
thx.stream.dom.Dom.subscribeToggleAttribute = function(el,name,value) {
	if(null == value) value = el.getAttribute(name);
	return function(on) {
		if(on) el.setAttribute(name,value); else el.removeAttribute(name);
	};
};
thx.stream.dom.Dom.subscribeToggleClass = function(el,name) {
	return function(on) {
		if(on) el.classList.add(name); else el.classList.remove(name);
	};
};
thx.stream.dom.Dom.subscribeToggleVisibility = function(el) {
	var originalDisplay = el.style.display;
	if(originalDisplay == "none") originalDisplay = "";
	return function(on) {
		if(on) el.style.display = originalDisplay; else el.style.display = "none";
	};
};
var udom = {};
udom.Html = function() { };
udom.Html.__name__ = ["udom","Html"];
udom.Html.parseList = function(html) {
	var el = window.document.createElement("div");
	el.innerHTML = html;
	return el.childNodes;
};
udom.Html.parseAll = function(html) {
	return udom._Dom.H.toArray(udom.Html.parseList(StringTools.trim(html)));
};
udom.Html.parse = function(html) {
	return udom.Html.parseList(StringTools.ltrim(html))[0];
};
udom.Query = function() { };
udom.Query.__name__ = ["udom","Query"];
udom.Query.first = function(selector,ctx) {
	return (ctx != null?ctx:udom.Query.doc).querySelector(selector);
};
udom.Query.list = function(selector,ctx) {
	return (ctx != null?ctx:udom.Query.doc).querySelectorAll(selector);
};
udom.Query.all = function(selector,ctx) {
	return udom._Dom.H.toArray(udom.Query.list(selector,ctx));
};
udom.Query.getElementIndex = function(el) {
	var index = 0;
	while(null != (el = el.previousElementSibling)) index++;
	return index;
};
udom.Query.childOf = function(child,parent) {
	if(null != child && child.parentElement == parent) return child; else return null;
};
udom.Query.childrenOf = function(children,parent) {
	return children.filter(function(child) {
		return child.parentElement == parent;
	});
};
udom._Dom = {};
udom._Dom.H = function() { };
udom._Dom.H.__name__ = ["udom","_Dom","H"];
udom._Dom.H.toArray = function(list) {
	return Array.prototype.slice.call(list,0);
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

      // Production steps of ECMA-262, Edition 5, 15.4.4.21
      // Reference: http://es5.github.io/#x15.4.4.21
      if (!Array.prototype.reduce) {
        Array.prototype.reduce = function(callback /*, initialValue*/) {
          'use strict';
          if (this == null) {
            throw new TypeError('Array.prototype.reduce called on null or undefined');
          }
          if (typeof callback !== 'function') {
            throw new TypeError(callback + ' is not a function');
          }
          var t = Object(this), len = t.length >>> 0, k = 0, value;
          if (arguments.length == 2) {
            value = arguments[1];
          } else {
            while (k < len && ! k in t) {
              k++;
            }
            if (k >= len) {
              throw new TypeError('Reduce of empty array with no initial value');
            }
            value = t[k++];
          }
          for (; k < len; k++) {
            if (k in t) {
              value = callback(value, t[k], k, t);
            }
          }
          return value;
        };
      }
    ;
var scope = ("undefined" !== typeof window && window) || ("undefined" !== typeof global && global) || this;
if(!scope.setImmediate) scope.setImmediate = function(callback) {
	scope.setTimeout(callback,0);
};
var lastTime = 0;
var vendors = ["webkit","moz"];
var x = 0;
while(x < vendors.length && !scope.requestAnimationFrame) {
	scope.requestAnimationFrame = scope[vendors[x] + "RequestAnimationFrame"];
	scope.cancelAnimationFrame = scope[vendors[x] + "CancelAnimationFrame"] || scope[vendors[x] + "CancelRequestAnimationFrame"];
	x++;
}
if(!scope.requestAnimationFrame) scope.requestAnimationFrame = function(callback1) {
	var currTime = new Date().getTime();
	var timeToCall = Math.max(0,16 - (currTime - lastTime));
	var id = scope.setTimeout(function() {
		callback1(currTime + timeToCall);
	},timeToCall);
	lastTime = currTime + timeToCall;
	return id;
};
if(!scope.cancelAnimationFrame) scope.cancelAnimationFrame = function(id1) {
	scope.clearTimeout(id1);
};
Config.icons = { add : "plus-circle", addMenu : "plus-square", remove : "ban", dropdown : "reorder", checked : "toggle-on", unchecked : "toggle-off", switchtype : "bolt", code : "bolt", value : "pencil", reference : "link", bool : "check-circle", text : "pencil", number : "superscript", date : "calendar", array : "list", object : "table"};
Config.selectors = { app : ".card"};
PropertyFeeder.classes = [{ display : "bold", name : "strong"},{ display : "italic", name : "emphasis"}];
cards.model.Runtime.pattern = new EReg("\\$\\.(.+?)\\b","");
cards.model.ref.EmptyParent.instance = new cards.model.ref.EmptyParent();
cards.model.ref.Ref.reField = new EReg("^\\.?([^.\\[]+)","");
cards.model.ref.Ref.reIndex = new EReg("^\\[(\\d+)\\]","");
cards.types.CodeTransform.datePattern = new EReg("Date\\(-?\\d+(:?\\.\\d+)?(:?e-?\\d+)?\\)","");
cards.types.CodeTransform.PATTERN = new EReg("^\\s*\\$\\.([a-z](:?(\\.|\\[\\d+\\])?[a-z0-9]*)*)\\s*$","");
cards.ui.input.AnonymousObjectEditor.defaultTypes = (function() {
	var types = [{ type : cards.model.SchemaType.StringType, description : "text"},{ type : cards.model.SchemaType.FloatType, description : "number"},{ type : cards.model.SchemaType.DateType, description : "date"},{ type : cards.model.SchemaType.CodeType, description : "code"},{ type : cards.model.SchemaType.BoolType, description : "yes/no"},{ type : cards.model.SchemaType.ObjectType([]), description : "object"}];
	types = types.concat(types.map(function(o) {
		return { type : cards.model.SchemaType.ArrayType(o.type), description : "list of " + o.description};
	}));
	return types;
})();
cards.ui.widgets.Button.sound = (function() {
	var audio = new Audio();
	audio.volume = 0.5;
	audio.src = "sound/click.mp3";
	return audio;
})();
haxe.ds.ObjectMap.count = 0;
thx.core.Ints.pattern_parse = new EReg("^[+-]?(\\d+|0x[0-9A-F]+)$","i");
thx.core.Strings.UCWORDS = new EReg("[^a-zA-Z]([a-z])","g");
thx.core.Strings.UCWORDSWS = new EReg("\\s[a-z]","g");
thx.core.Strings.ALPHANUM = new EReg("^[a-z0-9]+$","i");
thx.core.Strings.DIGITS = new EReg("^[0-9]+$","");
thx.core.Strings.STRIPTAGS = new EReg("</?[a-z]+[^>]*?/?>","gi");
thx.core.Strings.WSG = new EReg("\\s+","g");
thx.core.Strings.SPLIT_LINES = new EReg("\r\n|\n\r|\n|\r","g");
thx.promise._Promise.Promise_Impl_.nil = thx.promise._Promise.Promise_Impl_.value(thx.core.Nil.nil);
udom.Query.doc = document;
Main.main();
})();

//# sourceMappingURL=app.js.map