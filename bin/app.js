(function (console) { "use strict";
var $estr = function() { return js_Boot.__string_rec(this,''); };
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
	case "F":
		return DateTools.__format(d,"%Y-%m-%d");
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
		throw new js__$Boot_HaxeError("Date.format %" + e + "- not implemented yet.");
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
		if(this.r.m != null && n >= 0 && n < this.r.m.length) return this.r.m[n]; else throw new js__$Boot_HaxeError("EReg::matched");
	}
	,matchedRight: function() {
		if(this.r.m == null) throw new js__$Boot_HaxeError("No string matched");
		var sz = this.r.m.index + this.r.m[0].length;
		return HxOverrides.substr(this.r.s,sz,this.r.s.length - sz);
	}
	,matchedPos: function() {
		if(this.r.m == null) throw new js__$Boot_HaxeError("No string matched");
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
		throw new js__$Boot_HaxeError("Invalid date format : " + s);
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
	var version = "0.1.31+161";
	thx_promise__$Promise_Promise_$Impl_$.success(thx_stream_dom_Dom.ready(),function(_) {
		var values = new cards_properties_ValueProperties();
		var fragments = new cards_ui_fragments_FragmentProperties();
		var mapper = new cards_ui_fragments_FragmentMapper(fragments,values);
		PropertyFeeder.feedProperties(values);
		PropertyFeeder.feedFragments(fragments);
		var container = udom_Query.first(".container");
		var data = new cards_model_Data({ });
		var model = new cards_model_Model(data);
		var items = cards_ui_Card.create(model,container,mapper);
		items.document.statusbar.right.component.el.innerHTML = version.toString();
	});
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
	return { name : name, display : display, type : cards_model_SchemaType.BoolType, create : function(component) {
		var cls = new cards_properties_ToggleClass(component,name,name);
		cls.stream.set(true);
		return cls;
	}};
};
PropertyFeeder.createText = function() {
	return { name : "text", display : "content", type : cards_model_SchemaType.StringType, create : function(component) {
		return new cards_properties_Text(component,null);
	}};
};
var Reflect = function() { };
Reflect.__name__ = ["Reflect"];
Reflect.field = function(o,field) {
	try {
		return o[field];
	} catch( e ) {
		haxe_CallStack.lastException = e;
		if (e instanceof js__$Boot_HaxeError) e = e.val;
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
	return js_Boot.__instanceof(v,t);
};
Std.instance = function(value,c) {
	if((value instanceof c)) return value; else return null;
};
Std.string = function(s) {
	return js_Boot.__string_rec(s,"");
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
StringTools.endsWith = function(s,end) {
	var elen = end.length;
	var slen = s.length;
	return slen >= elen && HxOverrides.substr(s,slen - elen,elen) == end;
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
	if(o == null) return null; else return js_Boot.getClass(o);
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
	if(a == null) return null;
	return a.join(".");
};
Type.getEnumName = function(e) {
	var a = e.__ename__;
	return a.join(".");
};
Type.createEmptyInstance = function(cl) {
	function empty() {}; empty.prototype = cl.prototype;
	return new empty();
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
		var c = js_Boot.getClass(v);
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
		haxe_CallStack.lastException = e1;
		if (e1 instanceof js__$Boot_HaxeError) e1 = e1.val;
		return false;
	}
	return true;
};
var cards_components_Component = function(options) {
	this.isAttached = false;
	this.list = [];
	this.properties = new cards_components_Properties(this);
	if(null == options.template) {
		if(null == options.el) throw new js__$Boot_HaxeError("" + Std.string(this) + " needs a template"); else {
			this.el = options.el;
			if(null != this.el.parentElement) this.isAttached = true;
		}
	} else this.el = udom_Html.parseList(StringTools.ltrim(options.template))[0];
	if(null != options.classes) options.classes.split(" ").map(($_=this.el.classList,$bind($_,$_.add)));
	if(null != options.parent) options.parent.add(this);
	if(null != options.container) this.appendTo(options.container);
};
cards_components_Component.__name__ = ["cards","components","Component"];
cards_components_Component.prototype = {
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
		if(!this.isAttached) throw new js__$Boot_HaxeError("Component is not attached");
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
		if(!HxOverrides.remove(this.list,child)) throw new js__$Boot_HaxeError("" + Std.string(child) + " is not a child of " + Std.string(this));
		child.parent = null;
	}
	,get_children: function() {
		return this.list;
	}
	,toString: function() {
		return Type.getClassName(js_Boot.getClass(this)).split(".").pop();
	}
	,__class__: cards_components_Component
};
var cards_components_Properties = function(target) {
	this.target = target;
	this.properties = new haxe_ds_StringMap();
};
cards_components_Properties.__name__ = ["cards","components","Properties"];
cards_components_Properties.prototype = {
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
		if(this.properties.exists(property.name)) throw new js__$Boot_HaxeError("" + Std.string(this.target) + " already has a property " + Std.string(property));
		this.properties.set(property.name,property);
	}
	,get: function(name) {
		return this.properties.get(name);
	}
	,exists: function(name) {
		return this.properties.exists(name);
	}
	,remove: function(name) {
		if(!this.properties.exists(name)) throw new js__$Boot_HaxeError("property \"" + name + "\" does not exist in " + Std.string(this.target));
		var prop = this.properties.get(name);
		this.properties.remove(name);
		prop.dispose();
	}
	,__class__: cards_components_Properties
};
var cards_model_Data = function(data) {
	this.value = new thx_stream_Value(data);
	this.reset(data);
};
cards_model_Data.__name__ = ["cards","model","Data"];
cards_model_Data.prototype = {
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
		this.root = new cards_model_ref_ObjectRef(null);
		this.cache = new haxe_ds_StringMap();
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
	,__class__: cards_model_Data
};
var cards_model_DataEvent = { __ename__ : ["cards","model","DataEvent"], __constructs__ : ["SetValue"] };
cards_model_DataEvent.SetValue = function(path,value,type) { var $x = ["SetValue",0,path,value,type]; $x.__enum__ = cards_model_DataEvent; $x.toString = $estr; return $x; };
var cards_model_Expression = { __ename__ : ["cards","model","Expression"], __constructs__ : ["Fun","SyntaxError"] };
cards_model_Expression.Fun = function(f) { var $x = ["Fun",0,f]; $x.__enum__ = cards_model_Expression; $x.toString = $estr; return $x; };
cards_model_Expression.SyntaxError = function(msg) { var $x = ["SyntaxError",1,msg]; $x.__enum__ = cards_model_Expression; $x.toString = $estr; return $x; };
var cards_model_Expressions = function() { };
cards_model_Expressions.__name__ = ["cards","model","Expressions"];
cards_model_Expressions.toErrorOption = function(exp) {
	switch(exp[1]) {
	case 1:
		var e = exp[2];
		return haxe_ds_Option.Some(e);
	default:
		return haxe_ds_Option.None;
	}
};
var cards_model_Model = function(data) {
	var _g = this;
	this.changes = this.bus = new thx_stream_Bus();
	this.data = data;
	this.schema = new cards_model_Schema();
	this.dataEventSubscriber = function(e) {
		{
			var type = e[4];
			var value = e[3];
			var path = e[2];
			data.set(path,value);
			_g.bus.emit(thx_stream_StreamValue.Pulse(path));
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
			_g.bus.emit(thx_stream_StreamValue.Pulse(""));
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
			_g.bus.emit(thx_stream_StreamValue.Pulse(path2));
			break;
		case 3:
			var newpath = e1[3];
			var oldpath = e1[2];
			_g.schema.rename(oldpath,newpath);
			data.rename(oldpath,newpath);
			_g.bus.emit(thx_stream_StreamValue.Pulse(oldpath));
			_g.bus.emit(thx_stream_StreamValue.Pulse(newpath));
			break;
		case 4:
			var type2 = e1[3];
			var path3 = e1[2];
			_g.schema.retype(path3,type2);
			data.remove(path3);
			_g.bus.emit(thx_stream_StreamValue.Pulse(path3));
			break;
		}
	};
};
cards_model_Model.__name__ = ["cards","model","Model"];
cards_model_Model.prototype = {
	data: null
	,schema: null
	,dataEventSubscriber: null
	,schemaEventSubscriber: null
	,changes: null
	,bus: null
	,__class__: cards_model_Model
};
var cards_model_Runtime = function(expression,code) {
	this.expression = expression;
	this.code = code;
	this.dependencies = cards_model_Runtime.extractDependencies(code);
};
cards_model_Runtime.__name__ = ["cards","model","Runtime"];
cards_model_Runtime.createFunction = function(args,code) {
	return new Function(args.join(","),code);
};
cards_model_Runtime.formatCode = function(code,scope) {
	var prelim = Reflect.fields(scope).map(function(field) {
		return "var " + field + " = scope." + field + ";";
	}).join("\n");
	return "" + prelim + "\ndelete scope;\nreturn " + code + ";";
};
cards_model_Runtime.extractDependencies = function(code) {
	var set = thx__$Set_Set_$Impl_$.arrayToSet([]);
	while(cards_model_Runtime.pattern.match(code)) {
		thx__$Set_Set_$Impl_$.add(set,cards_model_Runtime.pattern.matched(1));
		code = cards_model_Runtime.pattern.matchedRight();
	}
	return thx_Iterables.order(thx__$Set_Set_$Impl_$.setToArray(set),thx_Strings.compare);
};
cards_model_Runtime.toRuntime = function(code,model) {
	var expression;
	try {
		var scope = new cards_model_Scope();
		var formatted = cards_model_Runtime.formatCode(code,scope);
		var f = cards_model_Runtime.createFunction(["$","scope"],formatted);
		expression = cards_model_Expression.Fun(function() {
			try {
				return cards_model_RuntimeResult.Result(f(model.data.toObject(),scope));
			} catch( e ) {
				haxe_CallStack.lastException = e;
				if (e instanceof js__$Boot_HaxeError) e = e.val;
				return cards_model_RuntimeResult.Error(Std.string(e));
			}
		});
	} catch( e1 ) {
		haxe_CallStack.lastException = e1;
		if (e1 instanceof js__$Boot_HaxeError) e1 = e1.val;
		expression = cards_model_Expression.SyntaxError(Std.string(e1));
	}
	return new cards_model_Runtime(expression,code);
};
cards_model_Runtime.toErrorOption = function(runtime) {
	{
		var _g = runtime.expression;
		switch(_g[1]) {
		case 1:
			var e = _g[2];
			return haxe_ds_Option.Some(e);
		default:
			return haxe_ds_Option.None;
		}
	}
};
cards_model_Runtime.prototype = {
	expression: null
	,code: null
	,dependencies: null
	,__class__: cards_model_Runtime
};
var cards_model_RuntimeResult = { __ename__ : ["cards","model","RuntimeResult"], __constructs__ : ["Result","Error"] };
cards_model_RuntimeResult.Result = function(value) { var $x = ["Result",0,value]; $x.__enum__ = cards_model_RuntimeResult; $x.toString = $estr; return $x; };
cards_model_RuntimeResult.Error = function(msg) { var $x = ["Error",1,msg]; $x.__enum__ = cards_model_RuntimeResult; $x.toString = $estr; return $x; };
var cards_model_Schema = function() {
	this.fields = new haxe_ds_StringMap();
	this.stream = this.bus = new thx_stream_Bus();
};
cards_model_Schema.__name__ = ["cards","model","Schema"];
cards_model_Schema.prototype = {
	fields: null
	,stream: null
	,bus: null
	,add: function(name,type) {
		if(this.fields.exists(name)) throw new thx_Error("Schema already contains a field \"" + name + "\"",null,{ fileName : "Schema.hx", lineNumber : 20, className : "cards.model.Schema", methodName : "add"});
		this.fields.set(name,type);
		this.bus.pulse(cards_model_SchemaEvent.AddField(name,type));
	}
	,reset: function(list) {
		var _g = this;
		if(null == list) list = [];
		this.fields = new haxe_ds_StringMap();
		list.map(function(pair) {
			_g.fields.set(pair.name,pair.type);
		});
		this.bus.pulse(cards_model_SchemaEvent.ListFields(list.slice()));
	}
	,'delete': function(name) {
		if(!this.fields.exists(name)) throw new thx_Error("Schema does not contain a field \"" + name + "\"",null,{ fileName : "Schema.hx", lineNumber : 37, className : "cards.model.Schema", methodName : "delete"});
		this.fields.remove(name);
		this.bus.pulse(cards_model_SchemaEvent.DeleteField(name));
	}
	,rename: function(oldname,newname) {
		if(!this.fields.exists(oldname)) throw new thx_Error("Schema does not contain a field \"" + oldname + "\"",null,{ fileName : "Schema.hx", lineNumber : 44, className : "cards.model.Schema", methodName : "rename"});
		var type = this.fields.get(oldname);
		this.fields.remove(oldname);
		this.fields.set(newname,type);
		this.bus.pulse(cards_model_SchemaEvent.RenameField(oldname,newname));
	}
	,retype: function(name,type) {
		if(!this.fields.exists(name)) throw new thx_Error("Schema does not contain a field \"" + name + "\"",null,{ fileName : "Schema.hx", lineNumber : 53, className : "cards.model.Schema", methodName : "retype"});
		this.fields.set(name,type);
		this.bus.pulse(cards_model_SchemaEvent.RetypeField(name,type));
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
	,__class__: cards_model_Schema
};
var cards_model_SchemaEvent = { __ename__ : ["cards","model","SchemaEvent"], __constructs__ : ["ListFields","AddField","DeleteField","RenameField","RetypeField"] };
cards_model_SchemaEvent.ListFields = function(list) { var $x = ["ListFields",0,list]; $x.__enum__ = cards_model_SchemaEvent; $x.toString = $estr; return $x; };
cards_model_SchemaEvent.AddField = function(name,type) { var $x = ["AddField",1,name,type]; $x.__enum__ = cards_model_SchemaEvent; $x.toString = $estr; return $x; };
cards_model_SchemaEvent.DeleteField = function(name) { var $x = ["DeleteField",2,name]; $x.__enum__ = cards_model_SchemaEvent; $x.toString = $estr; return $x; };
cards_model_SchemaEvent.RenameField = function(oldname,newname) { var $x = ["RenameField",3,oldname,newname]; $x.__enum__ = cards_model_SchemaEvent; $x.toString = $estr; return $x; };
cards_model_SchemaEvent.RetypeField = function(name,type) { var $x = ["RetypeField",4,name,type]; $x.__enum__ = cards_model_SchemaEvent; $x.toString = $estr; return $x; };
var cards_model_SchemaType = { __ename__ : ["cards","model","SchemaType"], __constructs__ : ["ArrayType","BoolType","DateType","FloatType","ObjectType","StringType","CodeType","ReferenceType"] };
cards_model_SchemaType.ArrayType = function(item) { var $x = ["ArrayType",0,item]; $x.__enum__ = cards_model_SchemaType; $x.toString = $estr; return $x; };
cards_model_SchemaType.BoolType = ["BoolType",1];
cards_model_SchemaType.BoolType.toString = $estr;
cards_model_SchemaType.BoolType.__enum__ = cards_model_SchemaType;
cards_model_SchemaType.DateType = ["DateType",2];
cards_model_SchemaType.DateType.toString = $estr;
cards_model_SchemaType.DateType.__enum__ = cards_model_SchemaType;
cards_model_SchemaType.FloatType = ["FloatType",3];
cards_model_SchemaType.FloatType.toString = $estr;
cards_model_SchemaType.FloatType.__enum__ = cards_model_SchemaType;
cards_model_SchemaType.ObjectType = function(fields) { var $x = ["ObjectType",4,fields]; $x.__enum__ = cards_model_SchemaType; $x.toString = $estr; return $x; };
cards_model_SchemaType.StringType = ["StringType",5];
cards_model_SchemaType.StringType.toString = $estr;
cards_model_SchemaType.StringType.__enum__ = cards_model_SchemaType;
cards_model_SchemaType.CodeType = ["CodeType",6];
cards_model_SchemaType.CodeType.toString = $estr;
cards_model_SchemaType.CodeType.__enum__ = cards_model_SchemaType;
cards_model_SchemaType.ReferenceType = ["ReferenceType",7];
cards_model_SchemaType.ReferenceType.toString = $estr;
cards_model_SchemaType.ReferenceType.__enum__ = cards_model_SchemaType;
var cards_model_Scope = function() {
	this.name = "Franco";
};
cards_model_Scope.__name__ = ["cards","model","Scope"];
cards_model_Scope.prototype = {
	name: null
	,__class__: cards_model_Scope
};
var cards_model_ref_BaseRef = function(parent) {
	if(null != parent) this.parent = parent; else this.parent = cards_model_ref_EmptyParent.instance;
};
cards_model_ref_BaseRef.__name__ = ["cards","model","ref","BaseRef"];
cards_model_ref_BaseRef.prototype = {
	parent: null
	,getRoot: function() {
		var ref = this;
		while(!js_Boot.__instanceof(ref.parent,cards_model_ref_EmptyParent)) ref = ref.parent;
		return ref;
	}
	,__class__: cards_model_ref_BaseRef
};
var cards_model_ref_IParentRef = function() { };
cards_model_ref_IParentRef.__name__ = ["cards","model","ref","IParentRef"];
cards_model_ref_IParentRef.prototype = {
	removeChild: null
	,__class__: cards_model_ref_IParentRef
};
var cards_model_ref_IRef = function() { };
cards_model_ref_IRef.__name__ = ["cards","model","ref","IRef"];
cards_model_ref_IRef.prototype = {
	parent: null
	,get: null
	,set: null
	,remove: null
	,hasValue: null
	,resolve: null
	,getRoot: null
	,toString: null
	,__class__: cards_model_ref_IRef
};
var cards_model_ref_ArrayRef = function(parent) {
	cards_model_ref_BaseRef.call(this,parent);
	this.items = new haxe_ds_IntMap();
	this.inverse = new haxe_ds_ObjectMap();
};
cards_model_ref_ArrayRef.__name__ = ["cards","model","ref","ArrayRef"];
cards_model_ref_ArrayRef.__interfaces__ = [cards_model_ref_IParentRef,cards_model_ref_IRef];
cards_model_ref_ArrayRef.__super__ = cards_model_ref_BaseRef;
cards_model_ref_ArrayRef.prototype = $extend(cards_model_ref_BaseRef.prototype,{
	items: null
	,inverse: null
	,get: function() {
		var _g = this;
		var res = [];
		thx_Arrays.order(thx_Iterators.toArray(this.items.keys()),thx_Ints.compare).map(function(i) {
			return _g.items.h[i];
		}).map(function(ref) {
			if(ref.hasValue()) res.push(ref.get());
		});
		return res;
	}
	,set: function(value) {
		var _g = this;
		if(!((value instanceof Array) && value.__enum__ == null)) throw new js__$Boot_HaxeError("value \"" + Std.string(value) + "\" is not an array");
		thx_Arrays.mapi(value,function(v,i) {
			var ref = _g.items.h[i];
			if(null == ref) {
				var value1 = ref = cards_model_ref_Ref.fromValue(v,_g);
				_g.items.h[i] = value1;
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
		if(null == i) throw new js__$Boot_HaxeError("\"" + Std.string(child) + "\" is not child of \"" + Std.string(this) + "\"");
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
		if(!cards_model_ref_Ref.reIndex.match(path)) throw new js__$Boot_HaxeError("unable to resolve \"" + path + "\" for ArrayRef");
		var index = Std.parseInt(cards_model_ref_Ref.reIndex.matched(1));
		var rest = cards_model_ref_Ref.reIndex.matchedRight();
		var ref = this.items.h[index];
		if(null == ref) {
			var value = ref = cards_model_ref_Ref.fromPath(rest,this,terminal);
			this.items.h[index] = value;
			this.inverse.set(ref,index);
		}
		return ref.resolve(rest,terminal);
	}
	,toString: function() {
		return "ArrayRef: " + this.items.toString();
	}
	,__class__: cards_model_ref_ArrayRef
});
var cards_model_ref_EmptyParent = function() {
};
cards_model_ref_EmptyParent.__name__ = ["cards","model","ref","EmptyParent"];
cards_model_ref_EmptyParent.__interfaces__ = [cards_model_ref_IParentRef];
cards_model_ref_EmptyParent.prototype = {
	removeChild: function(child) {
	}
	,__class__: cards_model_ref_EmptyParent
};
var cards_model_ref_ObjectRef = function(parent) {
	cards_model_ref_BaseRef.call(this,parent);
	this.fields = new haxe_ds_StringMap();
	this.inverse = new haxe_ds_ObjectMap();
};
cards_model_ref_ObjectRef.__name__ = ["cards","model","ref","ObjectRef"];
cards_model_ref_ObjectRef.__interfaces__ = [cards_model_ref_IParentRef,cards_model_ref_IRef];
cards_model_ref_ObjectRef.__super__ = cards_model_ref_BaseRef;
cards_model_ref_ObjectRef.prototype = $extend(cards_model_ref_BaseRef.prototype,{
	fields: null
	,inverse: null
	,get: function() {
		var _g = this;
		var o = { };
		thx_Iterators.map(this.fields.keys(),function(key) {
			var ref = _g.fields.get(key);
			if(!ref.hasValue()) return;
			Reflect.setField(o,key,ref.get());
		});
		return o;
	}
	,set: function(obj) {
		var _g = this;
		if(!(Reflect.isObject(obj) && null == Type.getClass(obj))) throw new js__$Boot_HaxeError("object \"" + Std.string(obj) + "\" is not an anonymous object");
		Reflect.fields(obj).map(function(field) {
			var ref = _g.fields.get(field);
			var value = Reflect.field(obj,field);
			if(null == ref) {
				ref = cards_model_ref_Ref.fromValue(value,_g);
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
		thx_Iterators.map(this.fields.iterator(),function(ref) {
			ref.remove();
		});
		this.parent.removeChild(this);
	}
	,removeChild: function(child) {
		var key = this.inverse.h[child.__id__];
		if(null == key) throw new js__$Boot_HaxeError("\"" + Std.string(child) + "\" is not child of \"" + Std.string(this) + "\"");
		this.inverse.remove(child);
		this.fields.remove(key);
	}
	,resolve: function(path,terminal) {
		if(terminal == null) terminal = false;
		if(path == "") return this;
		if(!cards_model_ref_Ref.reField.match(path)) throw new js__$Boot_HaxeError("unable to resolve \"" + path + "\" for ObjectRef");
		var field = cards_model_ref_Ref.reField.matched(1);
		var rest = cards_model_ref_Ref.reField.matchedRight();
		var ref = this.fields.get(field);
		if(null == ref) {
			var value = ref = cards_model_ref_Ref.fromPath(rest,this,terminal);
			this.fields.set(field,value);
			this.inverse.set(ref,field);
		}
		return ref.resolve(rest,terminal);
	}
	,toString: function() {
		return "ObjectRef: " + this.fields.toString();
	}
	,__class__: cards_model_ref_ObjectRef
});
var cards_model_ref_Ref = function() { };
cards_model_ref_Ref.__name__ = ["cards","model","ref","Ref"];
cards_model_ref_Ref.fromValue = function(value,parent) {
	if(null == parent) parent = cards_model_ref_EmptyParent.instance;
	var ref;
	if((value instanceof Array) && value.__enum__ == null) ref = new cards_model_ref_ArrayRef(parent); else if(Reflect.isObject(value) && null == Type.getClass(value)) ref = new cards_model_ref_ObjectRef(parent); else ref = new cards_model_ref_ValueRef(parent);
	ref.set(value);
	return ref;
};
cards_model_ref_Ref.fromPath = function(path,parent,terminal) {
	if(terminal == null) terminal = true;
	haxe_Log.trace("" + path + " with " + Std.string(parent) + " " + (terminal == null?"null":"" + terminal),{ fileName : "Ref.hx", lineNumber : 23, className : "cards.model.ref.Ref", methodName : "fromPath"});
	if(null == parent) parent = cards_model_ref_EmptyParent.instance;
	if(path == "") if(terminal) return new cards_model_ref_ValueRef(parent); else return new cards_model_ref_UnknownRef(parent); else if(cards_model_ref_Ref.reField.match(path)) return new cards_model_ref_ObjectRef(parent); else if(cards_model_ref_Ref.reIndex.match(path)) return new cards_model_ref_ArrayRef(parent); else throw new js__$Boot_HaxeError("invalid path \"" + path + "\"");
};
cards_model_ref_Ref.resolvePath = function(path,parent,terminal) {
	if(terminal == null) terminal = true;
	var ref = cards_model_ref_Ref.fromPath(path,parent,terminal);
	return ref.resolve(path);
};
var cards_model_ref_UnknownRef = function(parent) {
	this.hasRef = false;
	cards_model_ref_BaseRef.call(this,parent);
};
cards_model_ref_UnknownRef.__name__ = ["cards","model","ref","UnknownRef"];
cards_model_ref_UnknownRef.__interfaces__ = [cards_model_ref_IParentRef,cards_model_ref_IRef];
cards_model_ref_UnknownRef.__super__ = cards_model_ref_BaseRef;
cards_model_ref_UnknownRef.prototype = $extend(cards_model_ref_BaseRef.prototype,{
	ref: null
	,hasRef: null
	,get: function() {
		if(this.hasRef) return this.ref.get(); else return null;
	}
	,set: function(value) {
		if(this.hasRef) this.ref.set(value); else {
			this.hasRef = true;
			this.ref = cards_model_ref_Ref.fromValue(value,this);
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
		this.ref = cards_model_ref_Ref.fromPath(path,this,terminal);
		return this.ref.resolve(path,terminal);
	}
	,toString: function() {
		return "UnknownRef: " + Std.string(this.ref);
	}
	,__class__: cards_model_ref_UnknownRef
});
var cards_model_ref_ValueRef = function(parent) {
	this._hasValue = false;
	cards_model_ref_BaseRef.call(this,parent);
};
cards_model_ref_ValueRef.__name__ = ["cards","model","ref","ValueRef"];
cards_model_ref_ValueRef.__interfaces__ = [cards_model_ref_IRef];
cards_model_ref_ValueRef.__super__ = cards_model_ref_BaseRef;
cards_model_ref_ValueRef.prototype = $extend(cards_model_ref_BaseRef.prototype,{
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
		if(path != "") throw new js__$Boot_HaxeError("unable to resolve path \"" + path + "\" on ValueRef");
		return this;
	}
	,toString: function() {
		return "ValueRef: " + Std.string(this.value);
	}
	,__class__: cards_model_ref_ValueRef
});
var cards_properties_Property = function(component,name) {
	this.component = component;
	this.name = name;
	this.cancels = [];
	component.properties.add(this);
};
cards_properties_Property.__name__ = ["cards","properties","Property"];
cards_properties_Property.prototype = {
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
		return Type.getClassName(js_Boot.getClass(this)).split(".").pop();
	}
	,__class__: cards_properties_Property
};
var cards_properties_ValueProperty = function(defaultValue,component,name) {
	var _g = this;
	this.stream = new thx_stream_Value(defaultValue);
	this.runtime = new thx_stream_Value(haxe_ds_Option.None);
	this.runtimeError = new thx_stream_Value(haxe_ds_Option.None);
	cards_properties_Property.call(this,component,name);
	thx_stream_EmitterOptions.toBool(this.runtimeError).subscribe(thx_stream_dom_Dom.subscribeToggleClass(component.el,"error"));
	this.runtime.subscribe(function(opt) {
		switch(opt[1]) {
		case 1:
			component.el.classList.remove("error");
			_g.runtimeError.set(haxe_ds_Option.None);
			break;
		case 0:
			var runtime = opt[2];
			{
				var _g1 = runtime.expression;
				switch(_g1[1]) {
				case 1:
					var e = _g1[2];
					component.el.classList.add("error");
					_g.runtimeError.set(haxe_ds_Option.None);
					break;
				case 0:
					var f = _g1[2];
					component.el.classList.remove("error");
					_g.runtimeError.set(haxe_ds_Option.None);
					{
						var _g2 = f();
						switch(_g2[1]) {
						case 0:
							var v = _g2[2];
							_g.stream.set(_g.transform(v));
							break;
						case 1:
							var e1 = _g2[2];
							_g.runtimeError.set(haxe_ds_Option.Some(e1));
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
cards_properties_ValueProperty.__name__ = ["cards","properties","ValueProperty"];
cards_properties_ValueProperty.__super__ = cards_properties_Property;
cards_properties_ValueProperty.prototype = $extend(cards_properties_Property.prototype,{
	stream: null
	,runtime: null
	,runtimeError: null
	,transform: function(value) {
		throw new js__$Boot_HaxeError(Type.getClassName(js_Boot.getClass(this)).split(".").pop() + ".transform() is abstract and must be overridden");
	}
	,dispose: function() {
		this.stream.clear();
		this.runtime.clear();
		this.runtimeError.clear();
		cards_properties_Property.prototype.dispose.call(this);
	}
	,get_value: function() {
		return this.stream.get();
	}
	,set_value: function(value) {
		this.stream.set(value);
		return;
	}
	,__class__: cards_properties_ValueProperty
});
var cards_properties_BoolProperty = function(defaultValue,component,name) {
	cards_properties_ValueProperty.call(this,defaultValue,component,name);
};
cards_properties_BoolProperty.__name__ = ["cards","properties","BoolProperty"];
cards_properties_BoolProperty.__super__ = cards_properties_ValueProperty;
cards_properties_BoolProperty.prototype = $extend(cards_properties_ValueProperty.prototype,{
	transform: function(value) {
		return cards_types_DynamicTransform.toBool(value);
	}
	,__class__: cards_properties_BoolProperty
});
var cards_properties__$PropertyName_PropertyName_$Impl_$ = {};
cards_properties__$PropertyName_PropertyName_$Impl_$.__name__ = ["cards","properties","_PropertyName","PropertyName_Impl_"];
cards_properties__$PropertyName_PropertyName_$Impl_$.fromProperty = function(property) {
	return property.name;
};
cards_properties__$PropertyName_PropertyName_$Impl_$.fromString = function(name) {
	return name;
};
cards_properties__$PropertyName_PropertyName_$Impl_$._new = function(name) {
	return name;
};
cards_properties__$PropertyName_PropertyName_$Impl_$.toString = function(this1) {
	return this1;
};
var cards_properties_StringProperty = function(defaultValue,component,name) {
	cards_properties_ValueProperty.call(this,defaultValue,component,name);
};
cards_properties_StringProperty.__name__ = ["cards","properties","StringProperty"];
cards_properties_StringProperty.__super__ = cards_properties_ValueProperty;
cards_properties_StringProperty.prototype = $extend(cards_properties_ValueProperty.prototype,{
	transform: function(value) {
		return cards_types_DynamicTransform.toString(value);
	}
	,__class__: cards_properties_StringProperty
});
var cards_properties_Text = function(component,defaultText) {
	cards_properties_StringProperty.call(this,null == defaultText?component.el.textContent:defaultText,component,"text");
	this.stream.subscribe(thx_stream_dom_Dom.subscribeText(component.el));
};
cards_properties_Text.__name__ = ["cards","properties","Text"];
cards_properties_Text.__super__ = cards_properties_StringProperty;
cards_properties_Text.prototype = $extend(cards_properties_StringProperty.prototype,{
	__class__: cards_properties_Text
});
var cards_properties_ToggleClass = function(component,name,className) {
	var defaultValue = component.el.classList.contains(className);
	cards_properties_BoolProperty.call(this,defaultValue,component,name);
	if(null == className) className = name; else className = className;
	this.stream.subscribe(thx_stream_dom_Dom.subscribeToggleClass(component.el,className));
};
cards_properties_ToggleClass.__name__ = ["cards","properties","ToggleClass"];
cards_properties_ToggleClass.__super__ = cards_properties_BoolProperty;
cards_properties_ToggleClass.prototype = $extend(cards_properties_BoolProperty.prototype,{
	__class__: cards_properties_ToggleClass
});
var cards_properties_ValueProperties = function() {
	this.map = new haxe_ds_StringMap();
};
cards_properties_ValueProperties.__name__ = ["cards","properties","ValueProperties"];
cards_properties_ValueProperties.prototype = {
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
		if(component.properties.exists(name)) return js_Boot.__cast(component.properties.get(name) , cards_properties_ValueProperty); else return this.get(name).create(component);
	}
	,list: function() {
		return this.map.keys();
	}
	,__class__: cards_properties_ValueProperties
};
var cards_properties_Visible = function(component,defaultValue) {
	cards_properties_BoolProperty.call(this,defaultValue,component,"visible");
	this.stream.subscribe(thx_stream_dom_Dom.subscribeToggleVisibility(component.el));
};
cards_properties_Visible.__name__ = ["cards","properties","Visible"];
cards_properties_Visible.__super__ = cards_properties_BoolProperty;
cards_properties_Visible.prototype = $extend(cards_properties_BoolProperty.prototype,{
	__class__: cards_properties_Visible
});
var cards_types_ArrayTransform = function() { };
cards_types_ArrayTransform.__name__ = ["cards","types","ArrayTransform"];
cards_types_ArrayTransform.toArray = function(value) {
	if(null != value) return value; else return [];
};
cards_types_ArrayTransform.toBool = function(value) {
	return cards_types_ArrayTransform.toArray(value).length > 0;
};
cards_types_ArrayTransform.toDate = function(value) {
	var defaults = [2000,0,1,0,0,0];
	var values = cards_types_ArrayTransform.toArray(value).map(cards_types_DynamicTransform.toFloat).map(function(v) {
		return Math.round(v);
	}).slice(0,defaults.length);
	values = values.concat(defaults.slice(values.length));
	return new Date(values[0],values[1],values[2],values[3],values[4],values[5]);
};
cards_types_ArrayTransform.toFloat = function(value) {
	return cards_types_ArrayTransform.toArray(value).length;
};
cards_types_ArrayTransform.toObject = function(value) {
	var obj = { };
	thx_Arrays.mapi(cards_types_ArrayTransform.toArray(value),function(v,i) {
		obj["field_" + (i + 1)] = v;
	});
	return obj;
};
cards_types_ArrayTransform.toString = function(value) {
	return cards_types_ArrayTransform.toArray(value).map(cards_types_DynamicTransform.toString).join(", ");
};
cards_types_ArrayTransform.toCode = function(value) {
	return "[" + cards_types_ArrayTransform.toArray(value).map(cards_types_DynamicTransform.toCode).join(",") + "]";
};
cards_types_ArrayTransform.toReference = function(value) {
	return "";
};
var cards_types_BoolTransform = function() { };
cards_types_BoolTransform.__name__ = ["cards","types","BoolTransform"];
cards_types_BoolTransform.toArray = function(value) {
	return [cards_types_BoolTransform.toBool(value)?false:value];
};
cards_types_BoolTransform.toBool = function(value) {
	return null != value && value;
};
cards_types_BoolTransform.toDate = function(value) {
	return new Date();
};
cards_types_BoolTransform.toFloat = function(value) {
	if(cards_types_BoolTransform.toBool(value)) return 1; else return 0;
};
cards_types_BoolTransform.toObject = function(value) {
	return cards_types_ArrayTransform.toObject([cards_types_BoolTransform.toBool(value)]);
};
cards_types_BoolTransform.toString = function(value) {
	if(cards_types_BoolTransform.toBool(value)) return "Yes"; else return "No";
};
cards_types_BoolTransform.toCode = function(value) {
	if(cards_types_BoolTransform.toBool(value)) return "true"; else return "false";
};
cards_types_BoolTransform.toReference = function(value) {
	return "";
};
var cards_types_CodeTransform = function() { };
cards_types_CodeTransform.__name__ = ["cards","types","CodeTransform"];
cards_types_CodeTransform.toArray = function(value) {
	try {
		var t = JSON.parse(cards_types_CodeTransform.toCode(value));
		if((t instanceof Array) && t.__enum__ == null) return t; else return cards_types_DynamicTransform.toArray(t);
	} catch( _ ) {
		haxe_CallStack.lastException = _;
		if (_ instanceof js__$Boot_HaxeError) _ = _.val;
		return [];
	}
};
cards_types_CodeTransform.toBool = function(value) {
	var _g = cards_types_CodeTransform.toCode(value);
	switch(_g) {
	case "true":case "1":
		return true;
	default:
		return false;
	}
};
cards_types_CodeTransform.toDate = function(value) {
	if(cards_types_CodeTransform.datePattern.match(value)) {
		var t = Std.parseFloat(cards_types_CodeTransform.datePattern.matched(1));
		var d = new Date();
		d.setTime(t);
		return d;
	} else return new Date();
};
cards_types_CodeTransform.toFloat = function(value) {
	return Std.parseFloat(cards_types_CodeTransform.toCode(value));
};
cards_types_CodeTransform.toObject = function(value) {
	try {
		var t = JSON.parse(cards_types_CodeTransform.toCode(value));
		if(Reflect.isObject(t) && !(typeof(t) == "string")) return t; else return cards_types_DynamicTransform.toObject(t);
	} catch( _ ) {
		haxe_CallStack.lastException = _;
		if (_ instanceof js__$Boot_HaxeError) _ = _.val;
		return { };
	}
};
cards_types_CodeTransform.toString = function(value) {
	try {
		var t = JSON.parse(cards_types_CodeTransform.toCode(value));
		if(typeof(t) == "string") return t; else return cards_types_DynamicTransform.toString(t);
	} catch( _ ) {
		haxe_CallStack.lastException = _;
		if (_ instanceof js__$Boot_HaxeError) _ = _.val;
		return "";
	}
};
cards_types_CodeTransform.toCode = function(value) {
	if(null != value) return StringTools.trim(value); else return "null";
};
cards_types_CodeTransform.toReference = function(value) {
	var code = cards_types_CodeTransform.toCode(value);
	if(cards_types_CodeTransform.PATTERN.match(code)) return cards_types_CodeTransform.PATTERN.matched(1); else return "";
};
var cards_types_DateTransform = function() { };
cards_types_DateTransform.__name__ = ["cards","types","DateTransform"];
cards_types_DateTransform.toArray = function(value) {
	return [cards_types_DateTransform.toDate(value)];
};
cards_types_DateTransform.toBool = function(value) {
	return false;
};
cards_types_DateTransform.toDate = function(value) {
	if(null != value) return value; else return new Date();
};
cards_types_DateTransform.toFloat = function(value) {
	return cards_types_DateTransform.toDate(value).getTime();
};
cards_types_DateTransform.toObject = function(value) {
	return cards_types_ArrayTransform.toObject([cards_types_DateTransform.toDate(value)]);
};
cards_types_DateTransform.toString = function(value) {
	var _this = cards_types_DateTransform.toDate(value);
	return HxOverrides.dateStr(_this);
};
cards_types_DateTransform.toCode = function(value) {
	return "new Date(" + cards_types_DateTransform.toDate(value).getTime() + ")";
};
cards_types_DateTransform.toReference = function(value) {
	return "";
};
var cards_types_DynamicTransform = function() { };
cards_types_DynamicTransform.__name__ = ["cards","types","DynamicTransform"];
cards_types_DynamicTransform.toArray = function(value) {
	if(null == value) return [];
	if((value instanceof Array) && value.__enum__ == null) return cards_types_ArrayTransform.toArray(value);
	if(typeof(value) == "boolean") return cards_types_BoolTransform.toArray(value);
	if(js_Boot.__instanceof(value,Date)) return cards_types_DateTransform.toArray(value);
	if(typeof(value) == "number") return cards_types_FloatTransform.toArray(value);
	if(typeof(value) == "string") return cards_types_StringTransform.toArray(value);
	if(Reflect.isObject(value)) return cards_types_ObjectTransform.toArray(value);
	if(Reflect.isFunction(value)) return cards_types_DynamicTransform.toArray(null);
	throw new js__$Boot_HaxeError("Type of " + Std.string(value) + " cannot be matched by DynamicTransform.toArray");
};
cards_types_DynamicTransform.toBool = function(value) {
	if(null == value) return false;
	if((value instanceof Array) && value.__enum__ == null) return cards_types_ArrayTransform.toBool(value);
	if(typeof(value) == "boolean") return cards_types_BoolTransform.toBool(value);
	if(js_Boot.__instanceof(value,Date)) return cards_types_DateTransform.toBool(value);
	if(typeof(value) == "number") return cards_types_FloatTransform.toBool(value);
	if(typeof(value) == "string") return cards_types_StringTransform.toBool(value);
	if(Reflect.isObject(value)) return cards_types_ObjectTransform.toBool(value);
	if(Reflect.isFunction(value)) return cards_types_DynamicTransform.toBool(null);
	throw new js__$Boot_HaxeError("Type of " + Std.string(value) + " cannot be matched by DynamicTransform.toBool");
};
cards_types_DynamicTransform.toDate = function(value) {
	if(null == value) return new Date();
	if((value instanceof Array) && value.__enum__ == null) return cards_types_ArrayTransform.toDate(value);
	if(typeof(value) == "boolean") return cards_types_BoolTransform.toDate(value);
	if(js_Boot.__instanceof(value,Date)) return cards_types_DateTransform.toDate(value);
	if(typeof(value) == "number") return cards_types_FloatTransform.toDate(value);
	if(typeof(value) == "string") return cards_types_StringTransform.toDate(value);
	if(Reflect.isObject(value)) return cards_types_ObjectTransform.toDate(value);
	if(Reflect.isFunction(value)) return cards_types_DynamicTransform.toDate(null);
	throw new js__$Boot_HaxeError("Type of " + Std.string(value) + " cannot be matched by DynamicTransform.toDate");
};
cards_types_DynamicTransform.toFloat = function(value) {
	if(null == value) return 0;
	if((value instanceof Array) && value.__enum__ == null) return cards_types_ArrayTransform.toFloat(value);
	if(typeof(value) == "boolean") return cards_types_BoolTransform.toFloat(value);
	if(js_Boot.__instanceof(value,Date)) return cards_types_DateTransform.toFloat(value);
	if(typeof(value) == "number") return cards_types_FloatTransform.toFloat(value);
	if(typeof(value) == "string") return cards_types_StringTransform.toFloat(value);
	if(Reflect.isObject(value)) return cards_types_ObjectTransform.toFloat(value);
	if(Reflect.isFunction(value)) return cards_types_DynamicTransform.toFloat(null);
	throw new js__$Boot_HaxeError("Type of " + Std.string(value) + " cannot be matched by DynamicTransform.toFloat");
};
cards_types_DynamicTransform.toObject = function(value) {
	if(null == value) return { };
	if((value instanceof Array) && value.__enum__ == null) return cards_types_ArrayTransform.toObject(value);
	if(typeof(value) == "boolean") return cards_types_BoolTransform.toObject(value);
	if(js_Boot.__instanceof(value,Date)) return cards_types_DateTransform.toObject(value);
	if(typeof(value) == "number") return cards_types_FloatTransform.toObject(value);
	if(typeof(value) == "string") return cards_types_StringTransform.toObject(value);
	if(Reflect.isObject(value)) return cards_types_ObjectTransform.toObject(value);
	if(Reflect.isFunction(value)) return cards_types_DynamicTransform.toObject(null);
	throw new js__$Boot_HaxeError("Type of " + Std.string(value) + " cannot be matched by DynamicTransform.toObject");
};
cards_types_DynamicTransform.toString = function(value) {
	if(null == value) return "";
	if((value instanceof Array) && value.__enum__ == null) return cards_types_ArrayTransform.toString(value);
	if(typeof(value) == "boolean") return cards_types_BoolTransform.toString(value);
	if(js_Boot.__instanceof(value,Date)) return cards_types_DateTransform.toString(value);
	if(typeof(value) == "number") return cards_types_FloatTransform.toString(value);
	if(typeof(value) == "string") return cards_types_StringTransform.toString(value);
	if(Reflect.isObject(value)) return cards_types_ObjectTransform.toString(value);
	if(Reflect.isFunction(value)) return cards_types_DynamicTransform.toString(null);
	throw new js__$Boot_HaxeError("Type of " + Std.string(value) + " cannot be matched by DynamicTransform.toString");
};
cards_types_DynamicTransform.toCode = function(value) {
	if(null == value) return "null";
	if((value instanceof Array) && value.__enum__ == null) return cards_types_ArrayTransform.toCode(value);
	if(typeof(value) == "boolean") return cards_types_BoolTransform.toCode(value);
	if(js_Boot.__instanceof(value,Date)) return cards_types_DateTransform.toCode(value);
	if(typeof(value) == "number") return cards_types_FloatTransform.toCode(value);
	if(typeof(value) == "string") return cards_types_StringTransform.toCode(value);
	if(Reflect.isObject(value)) return cards_types_ObjectTransform.toCode(value);
	if(Reflect.isFunction(value)) return cards_types_DynamicTransform.toCode(null);
	throw new js__$Boot_HaxeError("Type of " + Std.string(value) + " cannot be matched by DynamicTransform.toCode");
};
cards_types_DynamicTransform.toReference = function(value) {
	if(null == value) return "";
	if((value instanceof Array) && value.__enum__ == null) return cards_types_ArrayTransform.toReference(value);
	if(typeof(value) == "boolean") return cards_types_BoolTransform.toReference(value);
	if(js_Boot.__instanceof(value,Date)) return cards_types_DateTransform.toReference(value);
	if(typeof(value) == "number") return cards_types_FloatTransform.toReference(value);
	if(typeof(value) == "string") return cards_types_StringTransform.toReference(value);
	if(Reflect.isObject(value)) return cards_types_ObjectTransform.toReference(value);
	if(Reflect.isFunction(value)) return cards_types_DynamicTransform.toReference(null);
	throw new js__$Boot_HaxeError("Type of " + Std.string(value) + " cannot be matched by DynamicTransform.toReference");
};
var cards_types_FloatTransform = function() { };
cards_types_FloatTransform.__name__ = ["cards","types","FloatTransform"];
cards_types_FloatTransform.toArray = function(value) {
	return [cards_types_FloatTransform.toFloat(value)];
};
cards_types_FloatTransform.toBool = function(value) {
	return cards_types_FloatTransform.toFloat(value) != 0;
};
cards_types_FloatTransform.toDate = function(value) {
	var t = cards_types_FloatTransform.toFloat(value);
	var d = new Date();
	d.setTime(t);
	return d;
};
cards_types_FloatTransform.toFloat = function(value) {
	if(null != value) return value; else return 0.0;
};
cards_types_FloatTransform.toObject = function(value) {
	return cards_types_ArrayTransform.toObject([cards_types_FloatTransform.toFloat(value)]);
};
cards_types_FloatTransform.toString = function(value) {
	return "" + cards_types_FloatTransform.toFloat(value);
};
cards_types_FloatTransform.toCode = function(value) {
	return "" + cards_types_FloatTransform.toFloat(value);
};
cards_types_FloatTransform.toReference = function(value) {
	return "";
};
var cards_types_ObjectTransform = function() { };
cards_types_ObjectTransform.__name__ = ["cards","types","ObjectTransform"];
cards_types_ObjectTransform.toArray = function(value) {
	return [cards_types_ObjectTransform.toObject(value)];
};
cards_types_ObjectTransform.toBool = function(value) {
	return !thx_Objects.isEmpty(cards_types_ObjectTransform.toObject(value));
};
cards_types_ObjectTransform.toDate = function(value) {
	return new Date();
};
cards_types_ObjectTransform.toFloat = function(value) {
	return Reflect.fields(cards_types_ObjectTransform.toObject(value)).length;
};
cards_types_ObjectTransform.toObject = function(value) {
	if(null != value) return value; else return { };
};
cards_types_ObjectTransform.toString = function(value) {
	return Reflect.fields(cards_types_ObjectTransform.toObject(value)).map(function(field) {
		return "" + field + ": " + cards_types_DynamicTransform.toString(Reflect.field(value,field));
	}).join(", ");
};
cards_types_ObjectTransform.toCode = function(value) {
	return "{" + Reflect.fields(cards_types_ObjectTransform.toObject(value)).map(function(field) {
		return "\"" + field + "\" : " + cards_types_DynamicTransform.toCode(Reflect.field(value,field));
	}).join(", ") + "}";
};
cards_types_ObjectTransform.toReference = function(value) {
	return "";
};
var cards_types_ReferenceTransform = function() { };
cards_types_ReferenceTransform.__name__ = ["cards","types","ReferenceTransform"];
cards_types_ReferenceTransform.toArray = function(value) {
	return cards_types_ArrayTransform.toArray(null);
};
cards_types_ReferenceTransform.toBool = function(value) {
	return cards_types_BoolTransform.toBool(null);
};
cards_types_ReferenceTransform.toDate = function(value) {
	return cards_types_DateTransform.toDate(null);
};
cards_types_ReferenceTransform.toFloat = function(value) {
	return cards_types_FloatTransform.toFloat(null);
};
cards_types_ReferenceTransform.toObject = function(value) {
	return cards_types_ObjectTransform.toObject(null);
};
cards_types_ReferenceTransform.toString = function(value) {
	return cards_types_StringTransform.toString(null);
};
cards_types_ReferenceTransform.toCode = function(value) {
	value = cards_types_ReferenceTransform.toReference(value);
	if("" == value) return ""; else return "$." + value;
};
cards_types_ReferenceTransform.toReference = function(value) {
	if(null == value) return ""; else return value;
};
var cards_types_StringTransform = function() { };
cards_types_StringTransform.__name__ = ["cards","types","StringTransform"];
cards_types_StringTransform.toArray = function(value) {
	return cards_types_StringTransform.toString(value).split(",").map(StringTools.trim);
};
cards_types_StringTransform.toBool = function(value) {
	var _g = StringTools.trim(cards_types_StringTransform.toString(value)).toLowerCase();
	switch(_g) {
	case "":case "off":case "no":case "false":case "0":
		return false;
	default:
		return true;
	}
};
cards_types_StringTransform.toDate = function(value) {
	try {
		return HxOverrides.strDate(value);
	} catch( e ) {
		haxe_CallStack.lastException = e;
		if (e instanceof js__$Boot_HaxeError) e = e.val;
		return new Date();
	}
};
cards_types_StringTransform.toFloat = function(value) {
	return Std.parseFloat(cards_types_StringTransform.toString(value));
};
cards_types_StringTransform.toObject = function(value) {
	return cards_types_ArrayTransform.toObject([cards_types_StringTransform.toString(value)]);
};
cards_types_StringTransform.toString = function(value) {
	if(null != value) return value; else return "";
};
cards_types_StringTransform.toCode = function(value) {
	return "\"" + StringTools.replace(cards_types_StringTransform.toString(value),"\"","\\\"") + "\"";
};
cards_types_StringTransform.toReference = function(value) {
	return "";
};
var cards_types_TypeTransform = function() { };
cards_types_TypeTransform.__name__ = ["cards","types","TypeTransform"];
cards_types_TypeTransform.transform = function(srcType,dstType) {
	switch(srcType[1]) {
	case 0:
		switch(dstType[1]) {
		case 0:
			return cards_types_ArrayTransform.toArray;
		case 1:
			return cards_types_ArrayTransform.toBool;
		case 2:
			return cards_types_ArrayTransform.toDate;
		case 3:
			return cards_types_ArrayTransform.toFloat;
		case 4:
			return cards_types_ArrayTransform.toObject;
		case 5:
			return cards_types_ArrayTransform.toString;
		case 6:
			return cards_types_ArrayTransform.toCode;
		case 7:
			return cards_types_ArrayTransform.toReference;
		}
		break;
	case 1:
		switch(dstType[1]) {
		case 0:
			return cards_types_BoolTransform.toArray;
		case 1:
			return cards_types_BoolTransform.toBool;
		case 2:
			return cards_types_BoolTransform.toDate;
		case 3:
			return cards_types_BoolTransform.toFloat;
		case 4:
			return cards_types_BoolTransform.toObject;
		case 5:
			return cards_types_BoolTransform.toString;
		case 6:
			return cards_types_BoolTransform.toCode;
		case 7:
			return cards_types_BoolTransform.toReference;
		}
		break;
	case 2:
		switch(dstType[1]) {
		case 0:
			return cards_types_DateTransform.toArray;
		case 1:
			return cards_types_DateTransform.toBool;
		case 2:
			return cards_types_DateTransform.toDate;
		case 3:
			return cards_types_DateTransform.toFloat;
		case 4:
			return cards_types_DateTransform.toObject;
		case 5:
			return cards_types_DateTransform.toString;
		case 6:
			return cards_types_DateTransform.toCode;
		case 7:
			return cards_types_DateTransform.toReference;
		}
		break;
	case 3:
		switch(dstType[1]) {
		case 0:
			return cards_types_FloatTransform.toArray;
		case 1:
			return cards_types_FloatTransform.toBool;
		case 2:
			return cards_types_FloatTransform.toDate;
		case 3:
			return cards_types_FloatTransform.toFloat;
		case 4:
			return cards_types_FloatTransform.toObject;
		case 5:
			return cards_types_FloatTransform.toString;
		case 6:
			return cards_types_FloatTransform.toCode;
		case 7:
			return cards_types_FloatTransform.toReference;
		}
		break;
	case 4:
		switch(dstType[1]) {
		case 0:
			return cards_types_ObjectTransform.toArray;
		case 1:
			return cards_types_ObjectTransform.toBool;
		case 2:
			return cards_types_ObjectTransform.toDate;
		case 3:
			return cards_types_ObjectTransform.toFloat;
		case 4:
			return cards_types_ObjectTransform.toObject;
		case 5:
			return cards_types_ObjectTransform.toString;
		case 6:
			return cards_types_ObjectTransform.toCode;
		case 7:
			return cards_types_ObjectTransform.toReference;
		}
		break;
	case 5:
		switch(dstType[1]) {
		case 0:
			return cards_types_StringTransform.toArray;
		case 1:
			return cards_types_StringTransform.toBool;
		case 2:
			return cards_types_StringTransform.toDate;
		case 3:
			return cards_types_StringTransform.toFloat;
		case 4:
			return cards_types_StringTransform.toObject;
		case 5:
			return cards_types_StringTransform.toString;
		case 6:
			return cards_types_StringTransform.toCode;
		case 7:
			return cards_types_StringTransform.toReference;
		}
		break;
	case 6:
		switch(dstType[1]) {
		case 0:
			return cards_types_CodeTransform.toArray;
		case 1:
			return cards_types_CodeTransform.toBool;
		case 2:
			return cards_types_CodeTransform.toDate;
		case 3:
			return cards_types_CodeTransform.toFloat;
		case 4:
			return cards_types_CodeTransform.toObject;
		case 5:
			return cards_types_CodeTransform.toString;
		case 6:
			return cards_types_CodeTransform.toCode;
		case 7:
			return cards_types_CodeTransform.toReference;
		}
		break;
	case 7:
		switch(dstType[1]) {
		case 0:
			return cards_types_ReferenceTransform.toArray;
		case 1:
			return cards_types_ReferenceTransform.toBool;
		case 2:
			return cards_types_ReferenceTransform.toDate;
		case 3:
			return cards_types_ReferenceTransform.toFloat;
		case 4:
			return cards_types_ReferenceTransform.toObject;
		case 5:
			return cards_types_ReferenceTransform.toString;
		case 6:
			return cards_types_ReferenceTransform.toCode;
		case 7:
			return cards_types_ReferenceTransform.toReference;
		}
		break;
	}
};
var cards_ui_Article = function(options) {
	if(null == options.el && null == options.template) options.template = "<article></article>";
	this.component = new cards_components_Component(options);
	this.fragmentsMap = new haxe_ds_ObjectMap();
	this.fragmentStream = new thx_stream_Bus();
	this.fragment = new thx_stream_Value(haxe_ds_Option.None);
	this.fragmentStream.toOption().feed(this.fragment);
	var filtered = thx_stream_EmitterOptions.filterOption(this.fragment);
	filtered.previous().subscribe(function(fragment) {
		fragment.active.set(false);
	});
	filtered.subscribe(function(fragment1) {
		fragment1.active.set(true);
	});
};
cards_ui_Article.__name__ = ["cards","ui","Article"];
cards_ui_Article.prototype = {
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
		var fragment = new cards_ui_fragments_Block({ parent : this.component, container : this.component.el});
		this.addFragment(fragment);
		this.addInlineText(fragment);
		return fragment;
	}
	,addInlineText: function(parent) {
		var fragment = new cards_ui_fragments_InlineText({ fragmentParent : parent, container : parent.component.el, defaultText : ""});
		this.addFragment(fragment);
		fragment.focus.set(true);
	}
	,addReadonly: function() {
		var fragment = new cards_ui_fragments_ReadonlyBlock({ parent : this.component, container : this.component.el});
		this.addFragment(fragment);
		return fragment;
	}
	,removeFragment: function(fragment) {
		if(thx_Options.equalsValue(this.fragment.get(),fragment)) this.fragment.set(haxe_ds_Option.None);
		var finalizer = this.fragmentsMap.h[fragment.__id__];
		this.fragmentsMap.remove(fragment);
		finalizer();
	}
	,__class__: cards_ui_Article
};
var cards_ui_Card = function() { };
cards_ui_Card.__name__ = ["cards","ui","Card"];
cards_ui_Card.create = function(model,container,mapper) {
	var card = new cards_components_Component({ template : "<div class=\"card\"><div class=\"doc\"></div><aside><div class=\"context\"></div><div class=\"model\"></div></aside></div>"});
	var modelView = new cards_ui_ModelView();
	var document = new cards_ui_Document({ el : udom_Query.first(".doc",card.el)});
	var context = new cards_ui_ContextView(document,mapper,udom_Query.first(".context",card.el),document.component);
	modelView.component.appendTo(udom_Query.first(".model",card.el));
	modelView.data.subscribe(model.dataEventSubscriber);
	card.appendTo(container);
	document.article.addBlock();
	return { card : card, modelView : modelView, document : document, context : context};
};
var cards_ui_ContextView = function(document,mapper,container,parent) {
	this.container = container;
	this.parent = parent;
	this.mapper = mapper;
	this.resetEditor();
	thx_stream_EmitterOptions.either(document.article.fragment,$bind(this,this.setFragmentStatus),$bind(this,this.resetEditor));
};
cards_ui_ContextView.__name__ = ["cards","ui","ContextView"];
cards_ui_ContextView.prototype = {
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
		haxe_Log.trace(fragment,{ fileName : "ContextView.hx", lineNumber : 32, className : "cards.ui.ContextView", methodName : "setFragmentStatus"});
		var fields = this.mapper.getAttachedPropertiesForFragment(fragment).map(function(info) {
			return { name : info.name, type : info.type, optional : false};
		}).concat(this.mapper.getAttachablePropertiesForFragment(fragment).map(function(info1) {
			return { name : info1.name, type : info1.type, optional : true};
		}));
		this.editor = new cards_ui_input_RuntimeObjectEditor(this.container,this.parent,fields);
	}
	,__class__: cards_ui_ContextView
};
var cards_ui_Document = function(options) {
	var _g = this;
	this.component = new cards_components_Component(options);
	this.toolbar = new cards_ui_widgets_Toolbar({ parent : this.component, container : this.component.el});
	this.article = new cards_ui_Article({ parent : this.component, container : this.component.el});
	this.statusbar = new cards_ui_widgets_Statusbar({ parent : this.component, container : this.component.el});
	this.article.fragment.map(function(r) {
		switch(r[1]) {
		case 0:
			var v = r[2];
			return "" + Std.string(v);
		case 1:
			return "no fragment selected";
		}
	}).subscribe(thx_stream_dom_Dom.subscribeHTML(this.statusbar.left.component.el));
	this.toolbar.left.addButton("block",Config.icons.add).clicks.subscribe(function(_) {
		_g.article.addBlock();
	});
	var buttonAddText = this.toolbar.left.addButton("text",Config.icons.add);
	buttonAddText.clicks.subscribe(function(_1) {
		var block = cards_ui_Document.getNearestBlock(thx_Options.toValue(_g.article.fragment.get()));
		if(null == block) return;
		_g.article.addInlineText(block);
	});
	buttonAddText.enabled.set(false);
	this.article.fragment.map(function(r1) {
		switch(r1[1]) {
		case 0:
			var v1 = r1[2];
			return cards_ui_Document.getNearestBlock(v1) != null;
		case 1:
			return false;
		}
	}).feed(buttonAddText.enabled);
	var buttonRemove = this.toolbar.right.addButton("",Config.icons.remove);
	buttonRemove.enabled.set(false);
	buttonRemove.clicks.subscribe(function(_2) {
		thx_Options.toValue(_g.article.fragment.get()).component.destroy();
		_g.article.fragment.set(haxe_ds_Option.None);
	});
	thx_stream_EmitterOptions.toBool(this.article.fragment).feed(buttonRemove.enabled);
};
cards_ui_Document.__name__ = ["cards","ui","Document"];
cards_ui_Document.getNearestBlock = function(fragment) {
	if(null == fragment) return null;
	if(js_Boot.__instanceof(fragment,cards_ui_fragments_Block)) return fragment;
	return cards_ui_Document.getNearestBlock(fragment.parent);
};
cards_ui_Document.prototype = {
	component: null
	,toolbar: null
	,article: null
	,statusbar: null
	,__class__: cards_ui_Document
};
var cards_ui_ModelView = function() {
	var _g2 = this;
	this.component = new cards_components_Component({ template : "<div class=\"modelview\"></div>"});
	this.data = this.dataBus = new thx_stream_Bus();
	this.editor = new cards_ui_input_AnonymousObjectEditor(this.component.el,this.component);
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
				_g2.dataBus.pulse(cards_model_DataEvent.SetValue(cards_ui_input__$Path_Path_$Impl_$.toString(path2),v._1,v._0));
				break;
			}
		}
	});
};
cards_ui_ModelView.__name__ = ["cards","ui","ModelView"];
cards_ui_ModelView.prototype = {
	component: null
	,data: null
	,dataBus: null
	,editor: null
	,setField: function(path,value,type) {
		if(cards_ui_input__$Path_Path_$Impl_$.equal(path,cards_ui_input__$Path_Path_$Impl_$.stringAsPath("")) || path == null) return;
		this.editor.diff.pulse((function($this) {
			var $r;
			var diff = cards_ui_input_Diff.Set((function($this) {
				var $r;
				var _1 = value;
				$r = { _0 : type, _1 : _1};
				return $r;
			}($this)));
			$r = { _0 : path, _1 : diff};
			return $r;
		}(this)));
	}
	,__class__: cards_ui_ModelView
};
var cards_ui_editors_Editor = function() { };
cards_ui_editors_Editor.__name__ = ["cards","ui","editors","Editor"];
cards_ui_editors_Editor.prototype = {
	value: null
	,type: null
	,focus: null
	,component: null
	,__class__: cards_ui_editors_Editor
};
var cards_ui_editors_TextEditor = function(options) {
	var _g = this;
	this.type = cards_model_SchemaType.StringType;
	if(null == options.defaultText) options.defaultText = "";
	if(null == options.placeHolder) options.placeHolder = "";
	if(null == options.el && null == options.template) options.template = "<div></div>";
	if(null == options.inputEvent) options.inputEvent = function(component) {
		return thx_stream_dom_Dom.streamEvent(component.el,"input");
	};
	this.component = new cards_components_Component(options);
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
	var text = new cards_properties_Text(this.component,options.defaultText);
	this.value = text.stream;
	options.inputEvent(this.component).map(function(_1) {
		return text.component.el.textContent;
	}).feed(this.value);
	this.focus = new thx_stream_Value(false);
	this.focus.withValue(true).subscribe(thx_stream_dom_Dom.subscribeFocus(this.component.el));
	var focusStream = this.focus.withValue(true).subscribe(function(_) {
		window.document.getSelection().selectAllChildren(_g.component.el);
	});
	thx_stream_dom_Dom.streamFocus(this.component.el).feed(this.focus);
	this.cancel = function() {
		text.dispose();
		focusStream.cancel();
	};
	var empty = new thx_stream_Value(options.defaultText == "");
	thx_stream_dom_Dom.streamEvent(this.component.el,"input").map(function(_2) {
		return text.component.el.textContent == "";
	}).merge(this.value.map(function(t) {
		return t == "";
	})).feed(empty);
	empty.subscribe(thx_stream_dom_Dom.subscribeToggleClass(this.component.el,"empty"));
	thx_stream_dom_Dom.streamEvent(this.component.el,"paste").map(function(ev) {
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
cards_ui_editors_TextEditor.__name__ = ["cards","ui","editors","TextEditor"];
cards_ui_editors_TextEditor.__interfaces__ = [cards_ui_editors_Editor];
cards_ui_editors_TextEditor.prototype = {
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
	,__class__: cards_ui_editors_TextEditor
};
var cards_ui_fragments_Fragment = function() { };
cards_ui_fragments_Fragment.__name__ = ["cards","ui","fragments","Fragment"];
cards_ui_fragments_Fragment.prototype = {
	name: null
	,component: null
	,focus: null
	,active: null
	,uid: null
	,parent: null
	,toString: null
	,__class__: cards_ui_fragments_Fragment
};
var cards_ui_fragments_Block = function(options) {
	this.name = "block";
	if(null == options.el && null == options.template) options.template = "<div class=\"block\" tabindex=\"1\"></div>";
	this.parent = options.fragmentParent;
	if(null != options.uid) this.uid = options.uid; else this.uid = thx_Uuid.create();
	this.component = new cards_components_Component(options);
	this.active = new thx_stream_Value(false);
	this.active.feed(new cards_properties_ToggleClass(this.component,"active").stream);
	this.focus = new thx_stream_Value(false);
	thx_stream_dom_Dom.streamFocus(this.component.el).feed(this.focus);
};
cards_ui_fragments_Block.__name__ = ["cards","ui","fragments","Block"];
cards_ui_fragments_Block.__interfaces__ = [cards_ui_fragments_Fragment];
cards_ui_fragments_Block.prototype = {
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
	,__class__: cards_ui_fragments_Block
};
var cards_ui_fragments_FragmentMapper = function(fragments,values) {
	this.fragments = fragments;
	this.values = values;
};
cards_ui_fragments_FragmentMapper.__name__ = ["cards","ui","fragments","FragmentMapper"];
cards_ui_fragments_FragmentMapper.prototype = {
	fragments: null
	,values: null
	,getValuePropertyInfoForFragment: function(fragment) {
		return thx_Iterators.map(this.fragments.getAssociations(fragment),($_=this.values,$bind($_,$_.get)));
	}
	,getAttachedPropertiesForFragment: function(fragment) {
		return thx_Iterators.filter(this.fragments.getAssociations(fragment.name),function(name) {
			return fragment.component.properties.exists(name);
		}).map(($_=this.values,$bind($_,$_.get)));
	}
	,getAttachablePropertiesForFragment: function(fragment) {
		return thx_Iterators.filter(this.fragments.getAssociations(fragment.name),function(name) {
			return !fragment.component.properties.exists(name);
		}).map(($_=this.values,$bind($_,$_.get)));
	}
	,__class__: cards_ui_fragments_FragmentMapper
};
var cards_ui_fragments__$FragmentName_FragmentName_$Impl_$ = {};
cards_ui_fragments__$FragmentName_FragmentName_$Impl_$.__name__ = ["cards","ui","fragments","_FragmentName","FragmentName_Impl_"];
cards_ui_fragments__$FragmentName_FragmentName_$Impl_$.fromFragment = function(fragment) {
	return fragment.name;
};
cards_ui_fragments__$FragmentName_FragmentName_$Impl_$.fromString = function(name) {
	return name;
};
cards_ui_fragments__$FragmentName_FragmentName_$Impl_$._new = function(name) {
	return name;
};
cards_ui_fragments__$FragmentName_FragmentName_$Impl_$.toString = function(this1) {
	return this1;
};
var cards_ui_fragments_FragmentProperties = function() {
	this.map = new haxe_ds_StringMap();
};
cards_ui_fragments_FragmentProperties.__name__ = ["cards","ui","fragments","FragmentProperties"];
cards_ui_fragments_FragmentProperties.prototype = {
	map: null
	,associate: function(fragment,property) {
		var s = this.map.get(fragment);
		if(null == s) {
			var value = s = thx__$Set_Set_$Impl_$.arrayToSet([]);
			this.map.set(fragment,value);
		}
		thx__$Set_Set_$Impl_$.add(s,property);
	}
	,associateMany: function(fragment,properties) {
		thx_Iterables.map(properties,(function(f,a1) {
			return function(a2) {
				f(a1,a2);
			};
		})($bind(this,this.associate),fragment));
	}
	,getAssociations: function(fragment) {
		var s = this.map.get(fragment);
		if(s == null) s = thx__$Set_Set_$Impl_$.arrayToSet([]);
		return HxOverrides.iter(s);
	}
	,__class__: cards_ui_fragments_FragmentProperties
};
var cards_ui_fragments_InlineText = function(options) {
	this.name = "text";
	if(null == options.el && null == options.template) options.template = "<span class=\"text\"></span>";
	if(null != options.uid) this.uid = options.uid; else this.uid = thx_Uuid.create();
	if(null == options.placeHolder) options.placeHolder = "type some content";
	this.parent = options.fragmentParent;
	this.editor = new cards_ui_editors_TextEditor(options);
	this.active = new thx_stream_Value(false);
	this.active.feed(new cards_properties_ToggleClass(this.editor.component,"active").stream);
	this.focus = this.editor.focus;
	this.component = this.editor.component;
};
cards_ui_fragments_InlineText.__name__ = ["cards","ui","fragments","InlineText"];
cards_ui_fragments_InlineText.__interfaces__ = [cards_ui_fragments_Fragment];
cards_ui_fragments_InlineText.prototype = {
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
	,__class__: cards_ui_fragments_InlineText
};
var cards_ui_fragments_ReadonlyBlock = function(options) {
	this.name = "readonly";
	if(null == options.el && null == options.template) options.template = "<div class=\"readonly block\" tabindex=\"1\">readonly</div>";
	this.component = new cards_components_Component(options);
	this.focus = new thx_stream_Value(false);
	this.active = new thx_stream_Value(false);
	if(null != options.uid) this.uid = options.uid; else this.uid = thx_Uuid.create();
	this.focusStream = thx_stream_dom_Dom.streamFocus(this.component.el).feed(this.focus);
	this.active.subscribe(thx_stream_dom_Dom.subscribeToggleClass(this.component.el,"active"));
};
cards_ui_fragments_ReadonlyBlock.__name__ = ["cards","ui","fragments","ReadonlyBlock"];
cards_ui_fragments_ReadonlyBlock.__interfaces__ = [cards_ui_fragments_Fragment];
cards_ui_fragments_ReadonlyBlock.prototype = {
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
	,__class__: cards_ui_fragments_ReadonlyBlock
};
var cards_ui_input_IEditor = function() { };
cards_ui_input_IEditor.__name__ = ["cards","ui","input","IEditor"];
cards_ui_input_IEditor.prototype = {
	stream: null
	,type: null
	,focus: null
	,component: null
	,toString: null
	,dispose: null
	,__class__: cards_ui_input_IEditor
};
var cards_ui_input_Editor = function(type,options) {
	this.stream = new thx_stream_Bus(true,cards_ui_input__$TypedValue_TypedValue_$Impl_$.equal);
	this.type = type;
	this.focus = new thx_stream_Value(false);
	this.component = new cards_components_Component(options);
};
cards_ui_input_Editor.__name__ = ["cards","ui","input","Editor"];
cards_ui_input_Editor.__interfaces__ = [cards_ui_input_IEditor];
cards_ui_input_Editor.prototype = {
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
		return Type.getClassName(js_Boot.getClass(this)).split(".").pop();
	}
	,__class__: cards_ui_input_Editor
};
var cards_ui_input_IRouteEditor = function() { };
cards_ui_input_IRouteEditor.__name__ = ["cards","ui","input","IRouteEditor"];
cards_ui_input_IRouteEditor.__interfaces__ = [cards_ui_input_IEditor];
cards_ui_input_IRouteEditor.prototype = {
	diff: null
	,typeAt: null
	,__class__: cards_ui_input_IRouteEditor
};
var cards_ui_input_RouteEditor = function(type,options) {
	cards_ui_input_Editor.call(this,type,options);
	this.diff = new thx_stream_Bus();
};
cards_ui_input_RouteEditor.__name__ = ["cards","ui","input","RouteEditor"];
cards_ui_input_RouteEditor.__interfaces__ = [cards_ui_input_IRouteEditor];
cards_ui_input_RouteEditor.__super__ = cards_ui_input_Editor;
cards_ui_input_RouteEditor.prototype = $extend(cards_ui_input_Editor.prototype,{
	diff: null
	,dispose: function() {
		cards_ui_input_Editor.prototype.dispose.call(this);
		this.diff.clear();
	}
	,typeAt: function(path) {
		throw new js__$Boot_HaxeError("abstract method");
	}
	,__class__: cards_ui_input_RouteEditor
});
var cards_ui_input_BaseObjectEditor = function(container,parent,fields) {
	var _g = this;
	this.object = { };
	this.editors = new haxe_ds_StringMap();
	this.defMap = new haxe_ds_StringMap();
	this.currentField = thx_stream_Value.createOption();
	var options = { template : "<div class=\"editor table\"></div>", container : container, parent : parent};
	cards_ui_input_RouteEditor.call(this,cards_model_SchemaType.ObjectType([]),options);
	this.fields = [];
	this.toolbar = new cards_ui_widgets_Toolbar({ parent : this.component, container : this.component.el});
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
		var name1 = thx_Options.toValue(_g.currentField.get());
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
						if(Type.enumEq(tv._0,_g.defMap.get(name4).field.type)) _g.ensureField(name4).stream.pulse(tv); else if(path.length > 0) {
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
								}(this))) _g.ensureField(name5).diff.pulse({ _0 : path, _1 : diff}); else throw new js__$Boot_HaxeError("unable to forward " + cards_ui_input__$DiffAt_DiffAt_$Impl_$.toString(d) + " within ObjectEditor");
								break;
							default:
								throw new js__$Boot_HaxeError("unable to forward " + cards_ui_input__$DiffAt_DiffAt_$Impl_$.toString(d) + " within ObjectEditor");
							}
						} else {
							haxe_Log.trace(cards_ui_input__$Path_Path_$Impl_$.toString(d._0),{ fileName : "BaseObjectEditor.hx", lineNumber : 88, className : "cards.ui.input.BaseObjectEditor", methodName : "new"});
							haxe_Log.trace((function($this) {
								var $r;
								var _g21 = d._1;
								$r = (function($this) {
									var $r;
									switch(_g21[1]) {
									case 2:
										$r = (function($this) {
											var $r;
											var d1 = _g21[2];
											$r = cards_ui_input__$TypedValue_TypedValue_$Impl_$.toString(d1);
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
							throw new js__$Boot_HaxeError("unable to assign " + cards_ui_input__$DiffAt_DiffAt_$Impl_$.toString(d) + " within ObjectEditor");
						}
						break;
					default:
						if(path.length > 0) {
							var first1 = path.shift();
							switch(first1[1]) {
							case 0:
								var name6 = first1[2];
								if((function($this) {
									var $r;
									var _g22 = _g.defMap.get(name6).field.type;
									$r = (function($this) {
										var $r;
										switch(_g22[1]) {
										case 4:case 0:
											$r = true;
											break;
										default:
											$r = false;
										}
										return $r;
									}($this));
									return $r;
								}(this))) _g.ensureField(name6).diff.pulse({ _0 : path, _1 : diff}); else throw new js__$Boot_HaxeError("unable to forward " + cards_ui_input__$DiffAt_DiffAt_$Impl_$.toString(d) + " within ObjectEditor");
								break;
							default:
								throw new js__$Boot_HaxeError("unable to forward " + cards_ui_input__$DiffAt_DiffAt_$Impl_$.toString(d) + " within ObjectEditor");
							}
						} else {
							haxe_Log.trace(cards_ui_input__$Path_Path_$Impl_$.toString(d._0),{ fileName : "BaseObjectEditor.hx", lineNumber : 88, className : "cards.ui.input.BaseObjectEditor", methodName : "new"});
							haxe_Log.trace((function($this) {
								var $r;
								var _g23 = d._1;
								$r = (function($this) {
									var $r;
									switch(_g23[1]) {
									case 2:
										$r = (function($this) {
											var $r;
											var d2 = _g23[2];
											$r = cards_ui_input__$TypedValue_TypedValue_$Impl_$.toString(d2);
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
							throw new js__$Boot_HaxeError("unable to assign " + cards_ui_input__$DiffAt_DiffAt_$Impl_$.toString(d) + " within ObjectEditor");
						}
					}
					break;
				default:
					var diff1 = _g11;
					if(path.length > 0) {
						var first2 = path.shift();
						switch(first2[1]) {
						case 0:
							var name7 = first2[2];
							if((function($this) {
								var $r;
								var _g24 = _g.defMap.get(name7).field.type;
								$r = (function($this) {
									var $r;
									switch(_g24[1]) {
									case 4:case 0:
										$r = true;
										break;
									default:
										$r = false;
									}
									return $r;
								}($this));
								return $r;
							}(this))) _g.ensureField(name7).diff.pulse({ _0 : path, _1 : diff1}); else throw new js__$Boot_HaxeError("unable to forward " + cards_ui_input__$DiffAt_DiffAt_$Impl_$.toString(d) + " within ObjectEditor");
							break;
						default:
							throw new js__$Boot_HaxeError("unable to forward " + cards_ui_input__$DiffAt_DiffAt_$Impl_$.toString(d) + " within ObjectEditor");
						}
					} else {
						haxe_Log.trace(cards_ui_input__$Path_Path_$Impl_$.toString(d._0),{ fileName : "BaseObjectEditor.hx", lineNumber : 88, className : "cards.ui.input.BaseObjectEditor", methodName : "new"});
						haxe_Log.trace((function($this) {
							var $r;
							var _g25 = d._1;
							$r = (function($this) {
								var $r;
								switch(_g25[1]) {
								case 2:
									$r = (function($this) {
										var $r;
										var d3 = _g25[2];
										$r = cards_ui_input__$TypedValue_TypedValue_$Impl_$.toString(d3);
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
						throw new js__$Boot_HaxeError("unable to assign " + cards_ui_input__$DiffAt_DiffAt_$Impl_$.toString(d) + " within ObjectEditor");
					}
				}
				break;
			case 0:
				var diff2 = _g11;
				if(path.length > 0) {
					var first3 = path.shift();
					switch(first3[1]) {
					case 0:
						var name8 = first3[2];
						if((function($this) {
							var $r;
							var _g26 = _g.defMap.get(name8).field.type;
							$r = (function($this) {
								var $r;
								switch(_g26[1]) {
								case 4:case 0:
									$r = true;
									break;
								default:
									$r = false;
								}
								return $r;
							}($this));
							return $r;
						}(this))) _g.ensureField(name8).diff.pulse({ _0 : path, _1 : diff2}); else throw new js__$Boot_HaxeError("unable to forward " + cards_ui_input__$DiffAt_DiffAt_$Impl_$.toString(d) + " within ObjectEditor");
						break;
					default:
						throw new js__$Boot_HaxeError("unable to forward " + cards_ui_input__$DiffAt_DiffAt_$Impl_$.toString(d) + " within ObjectEditor");
					}
				} else switch(_g11[1]) {
				case 2:
					var tv1 = _g11[2];
					if(Type.enumEq(_g.type,tv1._0)) {
					} else {
						haxe_Log.trace(cards_ui_input__$Path_Path_$Impl_$.toString(d._0),{ fileName : "BaseObjectEditor.hx", lineNumber : 88, className : "cards.ui.input.BaseObjectEditor", methodName : "new"});
						haxe_Log.trace((function($this) {
							var $r;
							var _g27 = d._1;
							$r = (function($this) {
								var $r;
								switch(_g27[1]) {
								case 2:
									$r = (function($this) {
										var $r;
										var d4 = _g27[2];
										$r = cards_ui_input__$TypedValue_TypedValue_$Impl_$.toString(d4);
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
						throw new js__$Boot_HaxeError("unable to assign " + cards_ui_input__$DiffAt_DiffAt_$Impl_$.toString(d) + " within ObjectEditor");
					}
					break;
				default:
					haxe_Log.trace(cards_ui_input__$Path_Path_$Impl_$.toString(d._0),{ fileName : "BaseObjectEditor.hx", lineNumber : 88, className : "cards.ui.input.BaseObjectEditor", methodName : "new"});
					haxe_Log.trace((function($this) {
						var $r;
						var _g28 = d._1;
						$r = (function($this) {
							var $r;
							switch(_g28[1]) {
							case 2:
								$r = (function($this) {
									var $r;
									var d5 = _g28[2];
									$r = cards_ui_input__$TypedValue_TypedValue_$Impl_$.toString(d5);
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
					throw new js__$Boot_HaxeError("unable to assign " + cards_ui_input__$DiffAt_DiffAt_$Impl_$.toString(d) + " within ObjectEditor");
				}
				break;
			default:
				var diff3 = _g11;
				if(path.length > 0) {
					var first4 = path.shift();
					switch(first4[1]) {
					case 0:
						var name9 = first4[2];
						if((function($this) {
							var $r;
							var _g29 = _g.defMap.get(name9).field.type;
							$r = (function($this) {
								var $r;
								switch(_g29[1]) {
								case 4:case 0:
									$r = true;
									break;
								default:
									$r = false;
								}
								return $r;
							}($this));
							return $r;
						}(this))) _g.ensureField(name9).diff.pulse({ _0 : path, _1 : diff3}); else throw new js__$Boot_HaxeError("unable to forward " + cards_ui_input__$DiffAt_DiffAt_$Impl_$.toString(d) + " within ObjectEditor");
						break;
					default:
						throw new js__$Boot_HaxeError("unable to forward " + cards_ui_input__$DiffAt_DiffAt_$Impl_$.toString(d) + " within ObjectEditor");
					}
				} else {
					haxe_Log.trace(cards_ui_input__$Path_Path_$Impl_$.toString(d._0),{ fileName : "BaseObjectEditor.hx", lineNumber : 88, className : "cards.ui.input.BaseObjectEditor", methodName : "new"});
					haxe_Log.trace((function($this) {
						var $r;
						var _g210 = d._1;
						$r = (function($this) {
							var $r;
							switch(_g210[1]) {
							case 2:
								$r = (function($this) {
									var $r;
									var d6 = _g210[2];
									$r = cards_ui_input__$TypedValue_TypedValue_$Impl_$.toString(d6);
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
					throw new js__$Boot_HaxeError("unable to assign " + cards_ui_input__$DiffAt_DiffAt_$Impl_$.toString(d) + " within ObjectEditor");
				}
			}
		}
		_g.pulse();
	});
	thx_Arrays.mapi(fields,function(field,i) {
		_g.addFieldDefinition(field,i);
	});
};
cards_ui_input_BaseObjectEditor.__name__ = ["cards","ui","input","BaseObjectEditor"];
cards_ui_input_BaseObjectEditor.findRef = function(table,index) {
	var trs = udom_Query.childrenOf(udom__$Dom_H.toArray(udom_Query.list("tr",table)),table);
	var _g = 0;
	while(_g < trs.length) {
		var tr = trs[_g];
		++_g;
		var ref = tr.getAttribute("data-index");
		if(ref > index) return tr;
	}
	return null;
};
cards_ui_input_BaseObjectEditor.__super__ = cards_ui_input_RouteEditor;
cards_ui_input_BaseObjectEditor.prototype = $extend(cards_ui_input_RouteEditor.prototype,{
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
		this.type = cards_model_SchemaType.ObjectType(this.fields);
		if(!field.optional) this.realizeField(field.name);
	}
	,createFieldLabel: function(parent,container,name) {
		container.textContent = name;
	}
	,realizeField: function(name,type) {
		if(this.editors.exists(name)) throw new js__$Boot_HaxeError("field " + name + " already realized");
		var def = thx_Arrays.find(this.fields,function(field) {
			return field.name == name;
		});
		if(null == def) throw new js__$Boot_HaxeError("unable to realize " + name + " because it is not defined in ObjectType");
		if(null == type) type = def.type;
		var editor;
		if(type != null) switch(type[1]) {
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
			var editor1 = cards_ui_input_EditorFactory.create(type,td,this.component);
			rowh.appendChild(th);
			rowd.appendChild(td);
			var ref = cards_ui_input_BaseObjectEditor.findRef(this.table,index);
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
			var editor2 = cards_ui_input_EditorFactory.create(type,td1,this.component);
			row.appendChild(th1);
			row.appendChild(td1);
			var ref1 = cards_ui_input_BaseObjectEditor.findRef(this.table,index1);
			if(null != ref1) this.table.insertBefore(row,ref1); else this.table.appendChild(row);
			editor = editor2;
		} else {
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
			var editor2 = cards_ui_input_EditorFactory.create(type,td1,this.component);
			row.appendChild(th1);
			row.appendChild(td1);
			var ref1 = cards_ui_input_BaseObjectEditor.findRef(this.table,index1);
			if(null != ref1) this.table.insertBefore(row,ref1); else this.table.appendChild(row);
			editor = editor2;
		}
		this.editors.set(name,editor);
		editor.focus.feed(this.focus);
		editor.focus.withValue(true).map(function(_) {
			return def.name;
		}).toOption().feed(this.currentField);
		editor.stream.map(function(v) {
			var path = cards_ui_input__$Path_Path_$Impl_$.stringAsPath(name);
			var diff = cards_ui_input_Diff.Set(v);
			return { _0 : path, _1 : diff};
		}).plug(this.diff);
		this.diff.pulse((function($this) {
			var $r;
			var path1 = cards_ui_input__$Path_Path_$Impl_$.stringAsPath(name);
			$r = { _0 : path1, _1 : cards_ui_input_Diff.Add};
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
					throw new js__$Boot_HaxeError("invalid path " + cards_ui_input__$Path_Path_$Impl_$.toString(path));
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
					if(Std["is"](this.editors.get(name1),cards_ui_input_IRouteEditor)) return Std.instance(this.editors.get(name1),cards_ui_input_IRouteEditor).typeAt(arr); else throw new js__$Boot_HaxeError("invalid path " + Std.string(arr));
					break;
				default:
					throw new js__$Boot_HaxeError("invalid path " + Std.string(arr));
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
		var rows = udom_Query.childrenOf(udom__$Dom_H.toArray(udom_Query.list("tr[data-index=\"" + def.index + "\"]",this.table)),this.table);
		rows.slice().map(function(row) {
			_g.table.removeChild(row);
		});
		this.currentField.set(haxe_ds_Option.None);
	}
	,checkUnique: function(name) {
		var _g = 0;
		var _g1 = this.fields;
		while(_g < _g1.length) {
			var field = _g1[_g];
			++_g;
			if(name == field.name) throw new js__$Boot_HaxeError("" + name + " field already exists in this ObjectType");
		}
	}
	,pulse: function() {
		this.stream.emit(thx_stream_StreamValue.Pulse((function($this) {
			var $r;
			var _1 = $this.object;
			$r = { _0 : $this.type, _1 : _1};
			return $r;
		}(this))));
	}
	,__class__: cards_ui_input_BaseObjectEditor
});
var cards_ui_input_AnonymousObjectEditor = function(container,parent,allowedTypes) {
	var _g = this;
	cards_ui_input_BaseObjectEditor.call(this,container,parent,[]);
	if(null == allowedTypes) this.allowedTypes = cards_ui_input_AnonymousObjectEditor.defaultTypes; else this.allowedTypes = allowedTypes;
	this.menuAdd = new cards_ui_widgets_Menu({ parent : this.component});
	this.initMenu();
	var buttonAdd = this.toolbar.left.addButton("",Config.icons.addMenu);
	buttonAdd.clicks.subscribe(function(_) {
		_g.menuAdd.anchorTo(buttonAdd.component.el);
		_g.menuAdd.visible.stream.set(true);
	});
};
cards_ui_input_AnonymousObjectEditor.__name__ = ["cards","ui","input","AnonymousObjectEditor"];
cards_ui_input_AnonymousObjectEditor.__super__ = cards_ui_input_BaseObjectEditor;
cards_ui_input_AnonymousObjectEditor.prototype = $extend(cards_ui_input_BaseObjectEditor.prototype,{
	menuAdd: null
	,allowedTypes: null
	,initMenu: function() {
		var _g = this;
		this.allowedTypes.map(function(item) {
			var button = new cards_ui_widgets_Button("add <b>" + item.description + "</b>");
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
		cards_ui_input_BaseObjectEditor.prototype.removeField.call(this,name);
		this.fields = this.fields.filter(function(field) {
			return field.name != name;
		});
		this.type = cards_model_SchemaType.ObjectType(this.fields);
		this.defMap.remove(name);
	}
	,createFieldLabel: function(parent,container,name) {
		var _g = this;
		var editor = new cards_ui_input_FieldNameEditor(container,parent);
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
						$r = { _0 : cards_model_SchemaType.StringType, _1 : _1};
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
					_g.type = cards_model_SchemaType.ObjectType(thx_Iterators.order(_g.defMap.iterator(),function(a,b) {
						return a.index - b.index;
					}).map(function(v1) {
						return v1.field;
					}));
				}
				break;
			default:
				throw new js__$Boot_HaxeError("createFieldLabel should never reach this point");
			}
		});
		editor.stream.emit(thx_stream_StreamValue.Pulse((function($this) {
			var $r;
			var _11 = name;
			$r = { _0 : cards_model_SchemaType.StringType, _1 : _11};
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
	,__class__: cards_ui_input_AnonymousObjectEditor
});
var cards_ui_input_ArrayEditor = function(container,parent,innerType) {
	var _g2 = this;
	this.values = [];
	this.editors = [];
	this.currentIndex = thx_stream_Value.createOption();
	var options = { template : "<div class=\"editor array\"></div>", container : container, parent : parent};
	cards_ui_input_RouteEditor.call(this,cards_model_SchemaType.ArrayType(innerType),options);
	this.innerType = innerType;
	var toolbar = new cards_ui_widgets_Toolbar({ parent : this.component, container : this.component.el});
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
	thx_stream_EmitterOptions.toBool(this.currentIndex).feed(buttonRemove.enabled);
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
								if(js_Boot.__instanceof(_g2.editors[index],cards_ui_input_IRouteEditor)) _g2.editors[index].diff.emit(thx_stream_StreamValue.Pulse({ _0 : path, _1 : diff})); else throw new js__$Boot_HaxeError("unable to forward " + cards_ui_input__$DiffAt_DiffAt_$Impl_$.toString(d) + " within ArrayEditor");
								break;
							default:
								throw new js__$Boot_HaxeError("unable to forward " + cards_ui_input__$DiffAt_DiffAt_$Impl_$.toString(d) + " within ArrayEditor");
							}
						} else throw new js__$Boot_HaxeError("unable to assign " + cards_ui_input__$DiffAt_DiffAt_$Impl_$.toString(d) + " within ArrayEditor");
						break;
					default:
						if(path.length > 0) {
							var first1 = path.shift();
							switch(first1[1]) {
							case 1:
								var index1 = first1[2];
								if(js_Boot.__instanceof(_g2.editors[index1],cards_ui_input_IRouteEditor)) _g2.editors[index1].diff.emit(thx_stream_StreamValue.Pulse({ _0 : path, _1 : diff})); else throw new js__$Boot_HaxeError("unable to forward " + cards_ui_input__$DiffAt_DiffAt_$Impl_$.toString(d) + " within ArrayEditor");
								break;
							default:
								throw new js__$Boot_HaxeError("unable to forward " + cards_ui_input__$DiffAt_DiffAt_$Impl_$.toString(d) + " within ArrayEditor");
							}
						} else throw new js__$Boot_HaxeError("unable to assign " + cards_ui_input__$DiffAt_DiffAt_$Impl_$.toString(d) + " within ArrayEditor");
					}
					break;
				default:
					var diff1 = _g1;
					if(path.length > 0) {
						var first2 = path.shift();
						switch(first2[1]) {
						case 1:
							var index2 = first2[2];
							if(js_Boot.__instanceof(_g2.editors[index2],cards_ui_input_IRouteEditor)) _g2.editors[index2].diff.emit(thx_stream_StreamValue.Pulse({ _0 : path, _1 : diff1})); else throw new js__$Boot_HaxeError("unable to forward " + cards_ui_input__$DiffAt_DiffAt_$Impl_$.toString(d) + " within ArrayEditor");
							break;
						default:
							throw new js__$Boot_HaxeError("unable to forward " + cards_ui_input__$DiffAt_DiffAt_$Impl_$.toString(d) + " within ArrayEditor");
						}
					} else throw new js__$Boot_HaxeError("unable to assign " + cards_ui_input__$DiffAt_DiffAt_$Impl_$.toString(d) + " within ArrayEditor");
				}
				break;
			case 0:
				var diff2 = _g1;
				if(path.length > 0) {
					var first3 = path.shift();
					switch(first3[1]) {
					case 1:
						var index3 = first3[2];
						if(js_Boot.__instanceof(_g2.editors[index3],cards_ui_input_IRouteEditor)) _g2.editors[index3].diff.emit(thx_stream_StreamValue.Pulse({ _0 : path, _1 : diff2})); else throw new js__$Boot_HaxeError("unable to forward " + cards_ui_input__$DiffAt_DiffAt_$Impl_$.toString(d) + " within ArrayEditor");
						break;
					default:
						throw new js__$Boot_HaxeError("unable to forward " + cards_ui_input__$DiffAt_DiffAt_$Impl_$.toString(d) + " within ArrayEditor");
					}
				} else switch(_g1[1]) {
				case 2:
					var tv1 = _g1[2];
					if(Type.enumEq(_g2.type,tv1._0)) {
					} else throw new js__$Boot_HaxeError("unable to assign " + cards_ui_input__$DiffAt_DiffAt_$Impl_$.toString(d) + " within ArrayEditor");
					break;
				default:
					throw new js__$Boot_HaxeError("unable to assign " + cards_ui_input__$DiffAt_DiffAt_$Impl_$.toString(d) + " within ArrayEditor");
				}
				break;
			default:
				var diff3 = _g1;
				if(path.length > 0) {
					var first4 = path.shift();
					switch(first4[1]) {
					case 1:
						var index4 = first4[2];
						if(js_Boot.__instanceof(_g2.editors[index4],cards_ui_input_IRouteEditor)) _g2.editors[index4].diff.emit(thx_stream_StreamValue.Pulse({ _0 : path, _1 : diff3})); else throw new js__$Boot_HaxeError("unable to forward " + cards_ui_input__$DiffAt_DiffAt_$Impl_$.toString(d) + " within ArrayEditor");
						break;
					default:
						throw new js__$Boot_HaxeError("unable to forward " + cards_ui_input__$DiffAt_DiffAt_$Impl_$.toString(d) + " within ArrayEditor");
					}
				} else throw new js__$Boot_HaxeError("unable to assign " + cards_ui_input__$DiffAt_DiffAt_$Impl_$.toString(d) + " within ArrayEditor");
			}
		}
		_g2.pulse();
	});
	thx_stream_EmitterOptions.filterOption(this.currentIndex.audit(function(_) {
		var prev = udom_Query.childOf(udom_Query.first("li.active",_g2.list),_g2.list);
		if(null == prev) return;
		prev.classList.remove("active");
	})).subscribe(function(index5) {
		var el = udom_Query.childOf(udom_Query.first("li:nth-child(" + (index5 + 1) + ")",_g2.list),_g2.list);
		if(null == el) return;
		el.classList.add("active");
	});
	buttonAdd.clicks.subscribe(function(_1) {
		var index6;
		if(thx_Options.toBool(_g2.currentIndex.get())) index6 = thx_Options.toValue(_g2.currentIndex.get()) + 1; else index6 = _g2.values.length;
		_g2.diff.pulse((function($this) {
			var $r;
			var path1 = cards_ui_input__$Path_Path_$Impl_$.intAsPath(index6);
			$r = { _0 : path1, _1 : cards_ui_input_Diff.Add};
			return $r;
		}(this)));
		_g2.editors[index6].focus.set(true);
	});
	buttonRemove.clicks.subscribe(function(_2) {
		if(!thx_Options.toBool(_g2.currentIndex.get())) return;
		var index7 = thx_Options.toValue(_g2.currentIndex.get());
		_g2.diff.pulse((function($this) {
			var $r;
			var path2 = cards_ui_input__$Path_Path_$Impl_$.intAsPath(index7);
			$r = { _0 : path2, _1 : cards_ui_input_Diff.Remove};
			return $r;
		}(this)));
	});
};
cards_ui_input_ArrayEditor.__name__ = ["cards","ui","input","ArrayEditor"];
cards_ui_input_ArrayEditor.__super__ = cards_ui_input_RouteEditor;
cards_ui_input_ArrayEditor.prototype = $extend(cards_ui_input_RouteEditor.prototype,{
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
			var path = cards_ui_input__$Path_Path_$Impl_$.intAsPath(index);
			$r = { _0 : path, _1 : cards_ui_input_Diff.Add};
			return $r;
		}(this)));
		if(null != value) this.diff.pulse((function($this) {
			var $r;
			var path1 = cards_ui_input__$Path_Path_$Impl_$.intAsPath(index);
			var diff = cards_ui_input_Diff.Set(value);
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
						if(js_Boot.__instanceof(this.editors[i],cards_ui_input_IRouteEditor)) return Std.instance(this.editors[i],cards_ui_input_IRouteEditor).typeAt(arr); else throw new js__$Boot_HaxeError("invalid path " + Std.string(arr));
						break;
					default:
						throw new js__$Boot_HaxeError("invalid path " + Std.string(arr));
					}
				}
				break;
			case 0:
				return this.type;
			default:
				arr = arr.slice();
				var first1 = arr.pop();
				switch(first1[1]) {
				case 1:
					var i1 = first1[2];
					if(js_Boot.__instanceof(this.editors[i1],cards_ui_input_IRouteEditor)) return Std.instance(this.editors[i1],cards_ui_input_IRouteEditor).typeAt(arr); else throw new js__$Boot_HaxeError("invalid path " + Std.string(arr));
					break;
				default:
					throw new js__$Boot_HaxeError("invalid path " + Std.string(arr));
				}
			}
		}
	}
	,createEditor: function(index) {
		var _g = this;
		var item;
		var _this = window.document;
		item = _this.createElement("li");
		var ref = udom_Query.childOf(udom_Query.first("li:nth-child(" + (index + 1) + ")",this.list),this.list);
		if(null == ref) this.list.appendChild(item); else this.list.insertBefore(item,ref);
		var editor = cards_ui_input_EditorFactory.create(this.innerType,item,this.component);
		this.editors.splice(index,0,editor);
		editor.focus.feed(this.focus);
		editor.focus.withValue(true).map(function(_) {
			return editor.component.el.parentElement;
		}).map(function(el) {
			return udom_Query.getElementIndex(el);
		}).toOption().feed(this.currentIndex);
		editor.stream.filter(function(v) {
			return thx_Options.toBool(_g.currentIndex.get());
		}).map(function(v1) {
			var path = cards_ui_input__$Path_Path_$Impl_$.intAsPath(thx_Options.toValue(_g.currentIndex.get()));
			var diff = cards_ui_input_Diff.Set(v1);
			return { _0 : path, _1 : diff};
		}).distinct(cards_ui_input__$DiffAt_DiffAt_$Impl_$.equal).subscribe(function(v2) {
			_g.diff.emit(thx_stream_StreamValue.Pulse(v2));
		});
	}
	,setEditor: function(index,value) {
		this.editors[index].stream.emit(thx_stream_StreamValue.Pulse(value));
	}
	,removeEditor: function(index) {
		var _g = this;
		var item = udom_Query.childOf(udom_Query.first("li:nth-child(" + (index + 1) + ")",this.list),this.list);
		var editor = this.editors[index];
		this.list.removeChild(item);
		editor.dispose();
		this.editors.splice(index,1);
		this.currentIndex.set(haxe_ds_Option.None);
		thx_Timer.delay(function() {
			if(_g.editors.length == 0) return;
			if(index == _g.editors.length) index--;
			_g.editors[index].focus.set(true);
		},10);
	}
	,pulse: function() {
		this.stream.emit(thx_stream_StreamValue.Pulse((function($this) {
			var $r;
			var _1 = $this.values;
			$r = { _0 : $this.type, _1 : _1};
			return $r;
		}(this))));
	}
	,__class__: cards_ui_input_ArrayEditor
});
var cards_ui_input_BoolEditor = function(container,parent) {
	var options = { template : "<input class=\"editor bool\" placeholder=\"on/off\" type=\"checkbox\" />", container : container, parent : parent};
	cards_ui_input_Editor.call(this,cards_model_SchemaType.BoolType,options);
	var el = this.component.el;
	thx_stream_dom_Dom.streamEvent(el,"change").map(function(_) {
		return (function($this) {
			var $r;
			var _1 = el.checked;
			$r = { _0 : cards_model_SchemaType.BoolType, _1 : _1};
			return $r;
		}(this));
	}).plug(this.stream);
	thx_stream_dom_Dom.streamFocus(el).feed(this.focus);
	this.stream.subscribe(function(num) {
		var v = num._1;
		if(el.value != v) el.value = v;
	});
	this.focus.subscribe(thx_stream_dom_Dom.subscribeFocus(el));
};
cards_ui_input_BoolEditor.__name__ = ["cards","ui","input","BoolEditor"];
cards_ui_input_BoolEditor.__super__ = cards_ui_input_Editor;
cards_ui_input_BoolEditor.prototype = $extend(cards_ui_input_Editor.prototype,{
	__class__: cards_ui_input_BoolEditor
});
var cards_ui_input_CodeMirrorEditor = function(container,parent) {
	var _g = this;
	var options = { template : "<div class=\"editor code\"></div>", container : container, parent : parent};
	cards_ui_input_Editor.call(this,cards_model_SchemaType.CodeType,options);
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
	thx_Timer.delay(function() {
		_g.editor.refresh();
	},10);
};
cards_ui_input_CodeMirrorEditor.__name__ = ["cards","ui","input","CodeMirrorEditor"];
cards_ui_input_CodeMirrorEditor.__super__ = cards_ui_input_Editor;
cards_ui_input_CodeMirrorEditor.prototype = $extend(cards_ui_input_Editor.prototype,{
	editor: null
	,changes: function() {
		var content = this.editor.doc.getValue();
		this.stream.emit(thx_stream_StreamValue.Pulse((function($this) {
			var $r;
			var _1 = content;
			$r = { _0 : cards_model_SchemaType.CodeType, _1 : _1};
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
		cards_ui_input_Editor.prototype.dispose.call(this);
		this.editor.off("changes",$bind(this,this.changes));
		this.editor.off("focus",$bind(this,this.setFocus));
		this.editor.off("blur",$bind(this,this.blurFocus));
		this.editor = null;
	}
	,__class__: cards_ui_input_CodeMirrorEditor
});
var cards_ui_input_DateEditor = function(container,parent,useTime) {
	if(useTime == null) useTime = true;
	var _g = this;
	if(useTime) this.format = "%Y-%m-%dT%H:%M"; else this.format = "%Y-%m-%d";
	var options = { template : "<input class=\"editor date\" placeholder=\"insert date\" type=\"" + (useTime?"datetime-local":"date") + "\" />", container : container, parent : parent};
	cards_ui_input_Editor.call(this,cards_model_SchemaType.DateType,options);
	var el = this.component.el;
	thx_stream_dom_Dom.streamEvent(el,"change").map(function(_) {
		try {
			{
				var d = HxOverrides.strDate(el.value);
				return (function($this) {
					var $r;
					var _1 = d;
					$r = { _0 : cards_model_SchemaType.DateType, _1 : _1};
					return $r;
				}(this));
			}
		} catch( e ) {
			haxe_CallStack.lastException = e;
			if (e instanceof js__$Boot_HaxeError) e = e.val;
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
	thx_stream_dom_Dom.streamFocus(el).feed(this.focus);
	this.stream.subscribe(function(num) {
		var v1 = num._1;
		var s = DateTools.format(v1,_g.format);
		if(el.value != s) el.value = s;
	});
	this.focus.subscribe(thx_stream_dom_Dom.subscribeFocus(el));
};
cards_ui_input_DateEditor.__name__ = ["cards","ui","input","DateEditor"];
cards_ui_input_DateEditor.__super__ = cards_ui_input_Editor;
cards_ui_input_DateEditor.prototype = $extend(cards_ui_input_Editor.prototype,{
	format: null
	,__class__: cards_ui_input_DateEditor
});
var cards_ui_input_Diff = { __ename__ : ["cards","ui","input","Diff"], __constructs__ : ["Remove","Add","Set"] };
cards_ui_input_Diff.Remove = ["Remove",0];
cards_ui_input_Diff.Remove.toString = $estr;
cards_ui_input_Diff.Remove.__enum__ = cards_ui_input_Diff;
cards_ui_input_Diff.Add = ["Add",1];
cards_ui_input_Diff.Add.toString = $estr;
cards_ui_input_Diff.Add.__enum__ = cards_ui_input_Diff;
cards_ui_input_Diff.Set = function(value) { var $x = ["Set",2,value]; $x.__enum__ = cards_ui_input_Diff; $x.toString = $estr; return $x; };
var cards_ui_input__$DiffAt_DiffAt_$Impl_$ = {};
cards_ui_input__$DiffAt_DiffAt_$Impl_$.__name__ = ["cards","ui","input","_DiffAt","DiffAt_Impl_"];
cards_ui_input__$DiffAt_DiffAt_$Impl_$._new = function(path,diff) {
	return { _0 : path, _1 : diff};
};
cards_ui_input__$DiffAt_DiffAt_$Impl_$.get_path = function(this1) {
	return this1._0;
};
cards_ui_input__$DiffAt_DiffAt_$Impl_$.get_diff = function(this1) {
	return this1._1;
};
cards_ui_input__$DiffAt_DiffAt_$Impl_$.equal = function(a,b) {
	if(null == a && null == b) return true; else if(null == a || null == b) return false; else return cards_ui_input__$Path_Path_$Impl_$.equal(a._0,b._0) && thx_Dynamics.equals(a._1,b._1);
};
cards_ui_input__$DiffAt_DiffAt_$Impl_$.toString = function(this1) {
	return cards_ui_input__$Path_Path_$Impl_$.toString(this1._0) + ":" + Std.string(this1._1);
};
var cards_ui_input_EditorFactory = function() { };
cards_ui_input_EditorFactory.__name__ = ["cards","ui","input","EditorFactory"];
cards_ui_input_EditorFactory.create = function(type,container,parent) {
	switch(type[1]) {
	case 0:
		var t = type[2];
		return new cards_ui_input_ArrayEditor(container,parent,t);
	case 1:
		return new cards_ui_input_BoolEditor(container,parent);
	case 6:
		return new cards_ui_input_CodeMirrorEditor(container,parent);
	case 2:
		return new cards_ui_input_DateEditor(container,parent,false);
	case 3:
		return new cards_ui_input_NumberEditor(container,parent);
	case 4:
		var fields = type[2];
		if(fields.length == 0) return new cards_ui_input_AnonymousObjectEditor(container,parent); else return new cards_ui_input_ObjectEditor(container,parent,fields);
		break;
	case 7:
		return new cards_ui_input_ReferenceEditor(container,parent);
	case 5:
		return new cards_ui_input_TextEditor(container,parent);
	}
};
var cards_ui_input_InputBasedEditor = function(container,parent,valueType,name,type,event,extract,assign) {
	if(event == null) event = "change";
	if(null == type) type = name;
	if(null == extract) extract = function(input) {
		return (function($this) {
			var $r;
			var _1 = input.value;
			$r = { _0 : cards_model_SchemaType.StringType, _1 : _1};
			return $r;
		}(this));
	};
	if(null == assign) assign = function(input1,value) {
		input1.value = value._1;
	};
	var options = { template : "<input class=\"editor " + name + "\" placeholder=\"" + name + "\" type=\"" + type + "\" />", container : container, parent : parent};
	cards_ui_input_Editor.call(this,valueType,options);
	var el = this.component.el;
	thx_stream_dom_Dom.streamEvent(el,event).map(function(_) {
		return extract(el);
	}).plug(this.stream);
	thx_stream_dom_Dom.streamFocus(el).feed(this.focus);
	this.stream.subscribe(function(value1) {
		var v = value1._1;
		if(extract(el) != v) assign(el,value1);
	});
	this.focus.subscribe(thx_stream_dom_Dom.subscribeFocus(el));
};
cards_ui_input_InputBasedEditor.__name__ = ["cards","ui","input","InputBasedEditor"];
cards_ui_input_InputBasedEditor.__super__ = cards_ui_input_Editor;
cards_ui_input_InputBasedEditor.prototype = $extend(cards_ui_input_Editor.prototype,{
	__class__: cards_ui_input_InputBasedEditor
});
var cards_ui_input_FieldNameEditor = function(container,parent) {
	cards_ui_input_InputBasedEditor.call(this,container,parent,cards_model_SchemaType.FloatType,"fieldname","text","change");
	this.component.el.addEventListener("keyup",function(e) {
	},false);
};
cards_ui_input_FieldNameEditor.__name__ = ["cards","ui","input","FieldNameEditor"];
cards_ui_input_FieldNameEditor.__super__ = cards_ui_input_InputBasedEditor;
cards_ui_input_FieldNameEditor.prototype = $extend(cards_ui_input_InputBasedEditor.prototype,{
	__class__: cards_ui_input_FieldNameEditor
});
var cards_ui_input_NumberEditor = function(container,parent) {
	cards_ui_input_InputBasedEditor.call(this,container,parent,cards_model_SchemaType.FloatType,"number","number","input",function(el) {
		return (function($this) {
			var $r;
			var _1 = el.valueAsNumber;
			$r = { _0 : cards_model_SchemaType.FloatType, _1 : _1};
			return $r;
		}(this));
	});
};
cards_ui_input_NumberEditor.__name__ = ["cards","ui","input","NumberEditor"];
cards_ui_input_NumberEditor.__super__ = cards_ui_input_InputBasedEditor;
cards_ui_input_NumberEditor.prototype = $extend(cards_ui_input_InputBasedEditor.prototype,{
	__class__: cards_ui_input_NumberEditor
});
var cards_ui_input_ObjectEditor = function(container,parent,fields) {
	this.inited = false;
	var _g = this;
	cards_ui_input_BaseObjectEditor.call(this,container,parent,fields);
	this.buttonAdd = this.toolbar.left.addButton("",Config.icons.addMenu);
	this.buttonAdd.enabled.set(false);
	this.buttonAdd.clicks.subscribe(function(_) {
		_g.menuAdd.anchorTo(_g.buttonAdd.component.el);
		_g.menuAdd.visible.stream.set(true);
	});
	this.menuAdd = new cards_ui_widgets_Menu({ parent : this.component});
	this.inited = true;
	this.setAddState();
};
cards_ui_input_ObjectEditor.__name__ = ["cards","ui","input","ObjectEditor"];
cards_ui_input_ObjectEditor.__super__ = cards_ui_input_BaseObjectEditor;
cards_ui_input_ObjectEditor.prototype = $extend(cards_ui_input_BaseObjectEditor.prototype,{
	menuAdd: null
	,buttonAdd: null
	,inited: null
	,removeField: function(name) {
		cards_ui_input_BaseObjectEditor.prototype.removeField.call(this,name);
		this.setAddState();
	}
	,realizeField: function(name,type) {
		cards_ui_input_BaseObjectEditor.prototype.realizeField.call(this,name,type);
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
				var button = new cards_ui_widgets_Button("add <b>" + field1.name + "</b>");
				button.clicks.subscribe(function(_) {
					_g.realizeField(field1.name);
					_g.setAddState();
					_g.editors.get(field1.name).focus.set(true);
				});
				_g.menuAdd.addItem(button.component);
			});
		}
	}
	,__class__: cards_ui_input_ObjectEditor
});
var cards_ui_input__$Path_Path_$Impl_$ = {};
cards_ui_input__$Path_Path_$Impl_$.__name__ = ["cards","ui","input","_Path","Path_Impl_"];
cards_ui_input__$Path_Path_$Impl_$._new = function(arr) {
	return arr;
};
cards_ui_input__$Path_Path_$Impl_$.stringAsPath = function(path) {
	return StringTools.replace(path,"[",".[").split(".").filter(function(s) {
		return s.length > 0;
	}).map(function(v) {
		if(HxOverrides.substr(v,0,1) == "[") return cards_ui_input_PathItem.Index(Std.parseInt(HxOverrides.substr(v,1,v.length - 1))); else return cards_ui_input_PathItem.Field(v);
	});
};
cards_ui_input__$Path_Path_$Impl_$.intAsPath = function(index) {
	var arr = [cards_ui_input_PathItem.Index(index)];
	return arr;
};
cards_ui_input__$Path_Path_$Impl_$.asArray = function(this1) {
	return this1;
};
cards_ui_input__$Path_Path_$Impl_$.toString = function(this1) {
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
cards_ui_input__$Path_Path_$Impl_$.equal = function(this1,other) {
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
var cards_ui_input_PathItem = { __ename__ : ["cards","ui","input","PathItem"], __constructs__ : ["Field","Index"] };
cards_ui_input_PathItem.Field = function(name) { var $x = ["Field",0,name]; $x.__enum__ = cards_ui_input_PathItem; $x.toString = $estr; return $x; };
cards_ui_input_PathItem.Index = function(pos) { var $x = ["Index",1,pos]; $x.__enum__ = cards_ui_input_PathItem; $x.toString = $estr; return $x; };
var cards_ui_input_ReferenceEditor = function(container,parent) {
	cards_ui_input_InputBasedEditor.call(this,container,parent,cards_model_SchemaType.ReferenceType,"reference","text","input",function(el) {
		return (function($this) {
			var $r;
			var _1 = el.value;
			$r = { _0 : cards_model_SchemaType.ReferenceType, _1 : _1};
			return $r;
		}(this));
	});
};
cards_ui_input_ReferenceEditor.__name__ = ["cards","ui","input","ReferenceEditor"];
cards_ui_input_ReferenceEditor.__super__ = cards_ui_input_InputBasedEditor;
cards_ui_input_ReferenceEditor.prototype = $extend(cards_ui_input_InputBasedEditor.prototype,{
	__class__: cards_ui_input_ReferenceEditor
});
var cards_ui_input_RuntimeObjectEditor = function(container,parent,fields) {
	var _g = this;
	cards_ui_input_ObjectEditor.call(this,container,parent,fields);
	var buttonValue = this.toolbar.center.addButton(null,Config.icons.value);
	var buttonCode = this.toolbar.center.addButton(null,Config.icons.code);
	var buttonReference = this.toolbar.center.addButton(null,Config.icons.reference);
	var buttons = [buttonValue,buttonCode,buttonReference];
	var disableAllButtons = function() {
		buttons.map(function(button) {
			button.enabled.set(false);
		});
	};
	thx_stream_EmitterOptions.either(this.currentField,function(name1) {
		disableAllButtons();
		var editor = _g.editors.get(name1);
		if(null == editor) return;
		var toEnable = buttons.slice();
		if(Type.enumEq(editor.type,cards_model_SchemaType.ReferenceType)) HxOverrides.remove(toEnable,buttonReference); else if(Type.enumEq(editor.type,cards_model_SchemaType.CodeType)) HxOverrides.remove(toEnable,buttonCode); else HxOverrides.remove(toEnable,buttonValue);
		toEnable.map(function(button1) {
			button1.enabled.set(true);
		});
	},disableAllButtons);
	var changeEditorType = function(name,newType) {
		_g.removeField(name);
		_g.realizeField(name,newType);
		_g.editors.get(name).focus.set(true);
	};
	thx_stream_EmitterValues.left(thx_stream_EmitterOptions.filterOption(this.currentField).sampleBy(buttonCode.clicks)).subscribe((function(f,a2) {
		return function(a1) {
			f(a1,a2);
		};
	})(changeEditorType,cards_model_SchemaType.CodeType));
	thx_stream_EmitterValues.left(thx_stream_EmitterOptions.filterOption(this.currentField).sampleBy(buttonReference.clicks)).subscribe((function(f1,a21) {
		return function(a11) {
			f1(a11,a21);
		};
	})(changeEditorType,cards_model_SchemaType.ReferenceType));
	thx_stream_EmitterValues.left(thx_stream_EmitterOptions.filterOption(this.currentField).sampleBy(buttonValue.clicks)).subscribe((function(f2,a22) {
		return function(a12) {
			f2(a12,a22);
		};
	})(changeEditorType,null));
};
cards_ui_input_RuntimeObjectEditor.__name__ = ["cards","ui","input","RuntimeObjectEditor"];
cards_ui_input_RuntimeObjectEditor.__super__ = cards_ui_input_ObjectEditor;
cards_ui_input_RuntimeObjectEditor.prototype = $extend(cards_ui_input_ObjectEditor.prototype,{
	__class__: cards_ui_input_RuntimeObjectEditor
});
var cards_ui_input_TextEditor = function(container,parent) {
	var _g = this;
	var options = { template : "<textarea class=\"editor text\" placeholder=\"text\"></textarea>", container : container, parent : parent};
	cards_ui_input_Editor.call(this,cards_model_SchemaType.StringType,options);
	var el = this.component.el;
	thx_stream_dom_Dom.streamEvent(el,"input").audit(function(_) {
		_g.resize();
	}).map(function(_1) {
		return (function($this) {
			var $r;
			var _11 = el.value;
			$r = { _0 : cards_model_SchemaType.StringType, _1 : _11};
			return $r;
		}(this));
	}).plug(this.stream);
	thx_stream_dom_Dom.streamFocus(el).feed(this.focus);
	this.stream.subscribe(function(text) {
		var v = text._1;
		if(el.value != v) el.value = v;
	});
	this.focus.subscribe(thx_stream_dom_Dom.subscribeFocus(el));
};
cards_ui_input_TextEditor.__name__ = ["cards","ui","input","TextEditor"];
cards_ui_input_TextEditor.__super__ = cards_ui_input_Editor;
cards_ui_input_TextEditor.prototype = $extend(cards_ui_input_Editor.prototype,{
	resize: function() {
		var el = this.component.el;
		el.style.height = "5px";
		el.style.height = 1 + el.scrollHeight + "px";
	}
	,__class__: cards_ui_input_TextEditor
});
var cards_ui_input__$TypedValue_TypedValue_$Impl_$ = {};
cards_ui_input__$TypedValue_TypedValue_$Impl_$.__name__ = ["cards","ui","input","_TypedValue","TypedValue_Impl_"];
cards_ui_input__$TypedValue_TypedValue_$Impl_$._new = function(type,value) {
	return (function($this) {
		var $r;
		var _1 = value;
		$r = { _0 : type, _1 : _1};
		return $r;
	}(this));
};
cards_ui_input__$TypedValue_TypedValue_$Impl_$.asType = function(this1) {
	return this1._0;
};
cards_ui_input__$TypedValue_TypedValue_$Impl_$.asValue = function(this1) {
	return this1._1;
};
cards_ui_input__$TypedValue_TypedValue_$Impl_$.fromString = function(s) {
	return (function($this) {
		var $r;
		var _1 = s;
		$r = { _0 : cards_model_SchemaType.StringType, _1 : _1};
		return $r;
	}(this));
};
cards_ui_input__$TypedValue_TypedValue_$Impl_$.fromFloat = function(f) {
	return (function($this) {
		var $r;
		var _1 = f;
		$r = { _0 : cards_model_SchemaType.FloatType, _1 : _1};
		return $r;
	}(this));
};
cards_ui_input__$TypedValue_TypedValue_$Impl_$.fromDate = function(d) {
	return (function($this) {
		var $r;
		var _1 = d;
		$r = { _0 : cards_model_SchemaType.DateType, _1 : _1};
		return $r;
	}(this));
};
cards_ui_input__$TypedValue_TypedValue_$Impl_$.fromBool = function(b) {
	return (function($this) {
		var $r;
		var _1 = b;
		$r = { _0 : cards_model_SchemaType.BoolType, _1 : _1};
		return $r;
	}(this));
};
cards_ui_input__$TypedValue_TypedValue_$Impl_$.asString = function(this1) {
	return Std.string(this1._1);
};
cards_ui_input__$TypedValue_TypedValue_$Impl_$.equal = function(a,b) {
	if(null == a && null == b) return true; else if(null == a || null == b) return false; else return thx_Dynamics.equals(a._1,b._1) && thx_Dynamics.equals(a._0,b._0);
};
cards_ui_input__$TypedValue_TypedValue_$Impl_$.toString = function(this1) {
	return Std.string(this1._1) + " : " + Std.string(this1._0);
};
var cards_ui_widgets_AnchorPoint = { __ename__ : ["cards","ui","widgets","AnchorPoint"], __constructs__ : ["TopLeft","Top","TopRight","Left","Center","Right","BottomLeft","Bottom","BottomRight"] };
cards_ui_widgets_AnchorPoint.TopLeft = ["TopLeft",0];
cards_ui_widgets_AnchorPoint.TopLeft.toString = $estr;
cards_ui_widgets_AnchorPoint.TopLeft.__enum__ = cards_ui_widgets_AnchorPoint;
cards_ui_widgets_AnchorPoint.Top = ["Top",1];
cards_ui_widgets_AnchorPoint.Top.toString = $estr;
cards_ui_widgets_AnchorPoint.Top.__enum__ = cards_ui_widgets_AnchorPoint;
cards_ui_widgets_AnchorPoint.TopRight = ["TopRight",2];
cards_ui_widgets_AnchorPoint.TopRight.toString = $estr;
cards_ui_widgets_AnchorPoint.TopRight.__enum__ = cards_ui_widgets_AnchorPoint;
cards_ui_widgets_AnchorPoint.Left = ["Left",3];
cards_ui_widgets_AnchorPoint.Left.toString = $estr;
cards_ui_widgets_AnchorPoint.Left.__enum__ = cards_ui_widgets_AnchorPoint;
cards_ui_widgets_AnchorPoint.Center = ["Center",4];
cards_ui_widgets_AnchorPoint.Center.toString = $estr;
cards_ui_widgets_AnchorPoint.Center.__enum__ = cards_ui_widgets_AnchorPoint;
cards_ui_widgets_AnchorPoint.Right = ["Right",5];
cards_ui_widgets_AnchorPoint.Right.toString = $estr;
cards_ui_widgets_AnchorPoint.Right.__enum__ = cards_ui_widgets_AnchorPoint;
cards_ui_widgets_AnchorPoint.BottomLeft = ["BottomLeft",6];
cards_ui_widgets_AnchorPoint.BottomLeft.toString = $estr;
cards_ui_widgets_AnchorPoint.BottomLeft.__enum__ = cards_ui_widgets_AnchorPoint;
cards_ui_widgets_AnchorPoint.Bottom = ["Bottom",7];
cards_ui_widgets_AnchorPoint.Bottom.toString = $estr;
cards_ui_widgets_AnchorPoint.Bottom.__enum__ = cards_ui_widgets_AnchorPoint;
cards_ui_widgets_AnchorPoint.BottomRight = ["BottomRight",8];
cards_ui_widgets_AnchorPoint.BottomRight.toString = $estr;
cards_ui_widgets_AnchorPoint.BottomRight.__enum__ = cards_ui_widgets_AnchorPoint;
var cards_ui_widgets_Button = function(text,icon) {
	if(text == null) text = "";
	this.component = new cards_components_Component({ template : null == icon?"<button>" + text + "</button>":"<button class=\"fa fa-" + icon + "\">" + text + "</button>"});
	this.clicks = thx_stream_dom_Dom.streamEvent(this.component.el,"click",false).audit($bind(this,this.playSound));
	this.enabled = new thx_stream_Value(true);
	thx_stream_EmitterBools.negate(this.enabled).subscribe(thx_stream_dom_Dom.subscribeToggleAttribute(this.component.el,"disabled","disabled"));
};
cards_ui_widgets_Button.__name__ = ["cards","ui","widgets","Button"];
cards_ui_widgets_Button.prototype = {
	component: null
	,clicks: null
	,enabled: null
	,cancel: null
	,playSound: function(_) {
		cards_ui_widgets_Button.sound.load();
		cards_ui_widgets_Button.sound.play();
	}
	,destroy: function() {
		this.cancel();
		this.component.destroy();
	}
	,__class__: cards_ui_widgets_Button
};
var cards_ui_widgets_FrameOverlay = function(options) {
	var _g = this;
	if(null == options.el && null == options.template) options.template = "<div class=\"frame-overlay\"></div>";
	this.component = new cards_components_Component(options);
	this.visible = new cards_properties_Visible(this.component,false);
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
cards_ui_widgets_FrameOverlay.__name__ = ["cards","ui","widgets","FrameOverlay"];
cards_ui_widgets_FrameOverlay.prototype = {
	component: null
	,visible: null
	,anchorElement: null
	,my: null
	,at: null
	,anchorTo: function(el,my,at) {
		this.anchorElement = el;
		if(null == my) this.my = cards_ui_widgets_AnchorPoint.TopLeft; else this.my = my;
		if(null == at) this.at = cards_ui_widgets_AnchorPoint.BottomLeft; else this.at = at;
		if(this.visible.stream.get()) this.reposition();
	}
	,reposition: function() {
		if(!this.component.isAttached) {
			var parent = [udom_Query.first(Config.selectors.app),window.document.body].filter(function(v) {
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
	,__class__: cards_ui_widgets_FrameOverlay
};
var cards_ui_widgets_Menu = function(options) {
	if(null == options.el && null == options.template) options.template = "<menu class=\"frame-overlay\"><ul></ul></menu>";
	cards_ui_widgets_FrameOverlay.call(this,options);
	this.ul = udom_Query.first("ul",this.component.el);
	this.items = new haxe_ds_ObjectMap();
};
cards_ui_widgets_Menu.__name__ = ["cards","ui","widgets","Menu"];
cards_ui_widgets_Menu.__super__ = cards_ui_widgets_FrameOverlay;
cards_ui_widgets_Menu.prototype = $extend(cards_ui_widgets_FrameOverlay.prototype,{
	items: null
	,ul: null
	,clear: function() {
		this.ul.innerHTML = "";
		this.items = new haxe_ds_ObjectMap();
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
	,__class__: cards_ui_widgets_Menu
});
var cards_ui_widgets_Statusbar = function(options) {
	if(null == options.el && null == options.template) options.template = "<footer class=\"statusbar\"><div><div class=\"left\"></div><div class=\"center\"></div><div class=\"right\"></div></div></footer>";
	this.component = new cards_components_Component(options);
	this.left = new cards_ui_widgets_ToolbarGroup(udom_Query.first(".left",this.component.el),this.component);
	this.center = new cards_ui_widgets_ToolbarGroup(udom_Query.first(".center",this.component.el),this.component);
	this.right = new cards_ui_widgets_ToolbarGroup(udom_Query.first(".right",this.component.el),this.component);
};
cards_ui_widgets_Statusbar.__name__ = ["cards","ui","widgets","Statusbar"];
cards_ui_widgets_Statusbar.prototype = {
	component: null
	,left: null
	,center: null
	,right: null
	,__class__: cards_ui_widgets_Statusbar
};
var cards_ui_widgets_Toolbar = function(options) {
	if(null == options.el && null == options.template) options.template = "<header class=\"toolbar\"><div><div class=\"left\"></div><div class=\"center\"></div><div class=\"right\"></div></div></header>";
	this.component = new cards_components_Component(options);
	this.left = new cards_ui_widgets_ToolbarGroup(udom_Query.first(".left",this.component.el),this.component);
	this.center = new cards_ui_widgets_ToolbarGroup(udom_Query.first(".center",this.component.el),this.component);
	this.right = new cards_ui_widgets_ToolbarGroup(udom_Query.first(".right",this.component.el),this.component);
};
cards_ui_widgets_Toolbar.__name__ = ["cards","ui","widgets","Toolbar"];
cards_ui_widgets_Toolbar.prototype = {
	component: null
	,left: null
	,center: null
	,right: null
	,__class__: cards_ui_widgets_Toolbar
};
var cards_ui_widgets_ToolbarGroup = function(el,parent) {
	this.component = new cards_components_Component({ el : el, parent : parent});
};
cards_ui_widgets_ToolbarGroup.__name__ = ["cards","ui","widgets","ToolbarGroup"];
cards_ui_widgets_ToolbarGroup.prototype = {
	component: null
	,addButton: function(text,icon) {
		if(text == null) text = "";
		var button = new cards_ui_widgets_Button(text,icon);
		button.component.appendTo(this.component.el);
		this.component.add(button.component);
		return button;
	}
	,__class__: cards_ui_widgets_ToolbarGroup
};
var cards_util_MacroVersion = function() { };
cards_util_MacroVersion.__name__ = ["cards","util","MacroVersion"];
var haxe_StackItem = { __ename__ : ["haxe","StackItem"], __constructs__ : ["CFunction","Module","FilePos","Method","LocalFunction"] };
haxe_StackItem.CFunction = ["CFunction",0];
haxe_StackItem.CFunction.toString = $estr;
haxe_StackItem.CFunction.__enum__ = haxe_StackItem;
haxe_StackItem.Module = function(m) { var $x = ["Module",1,m]; $x.__enum__ = haxe_StackItem; $x.toString = $estr; return $x; };
haxe_StackItem.FilePos = function(s,file,line) { var $x = ["FilePos",2,s,file,line]; $x.__enum__ = haxe_StackItem; $x.toString = $estr; return $x; };
haxe_StackItem.Method = function(classname,method) { var $x = ["Method",3,classname,method]; $x.__enum__ = haxe_StackItem; $x.toString = $estr; return $x; };
haxe_StackItem.LocalFunction = function(v) { var $x = ["LocalFunction",4,v]; $x.__enum__ = haxe_StackItem; $x.toString = $estr; return $x; };
var haxe_CallStack = function() { };
haxe_CallStack.__name__ = ["haxe","CallStack"];
haxe_CallStack.getStack = function(e) {
	if(e == null) return [];
	var oldValue = Error.prepareStackTrace;
	Error.prepareStackTrace = function(error,callsites) {
		var stack = [];
		var _g = 0;
		while(_g < callsites.length) {
			var site = callsites[_g];
			++_g;
			if(haxe_CallStack.wrapCallSite != null) site = haxe_CallStack.wrapCallSite(site);
			var method = null;
			var fullName = site.getFunctionName();
			if(fullName != null) {
				var idx = fullName.lastIndexOf(".");
				if(idx >= 0) {
					var className = HxOverrides.substr(fullName,0,idx);
					var methodName = HxOverrides.substr(fullName,idx + 1,null);
					method = haxe_StackItem.Method(className,methodName);
				}
			}
			stack.push(haxe_StackItem.FilePos(method,site.getFileName(),site.getLineNumber()));
		}
		return stack;
	};
	var a = haxe_CallStack.makeStack(e.stack);
	Error.prepareStackTrace = oldValue;
	return a;
};
haxe_CallStack.callStack = function() {
	try {
		throw new Error();
	} catch( e ) {
		haxe_CallStack.lastException = e;
		if (e instanceof js__$Boot_HaxeError) e = e.val;
		var a = haxe_CallStack.getStack(e);
		a.shift();
		return a;
	}
};
haxe_CallStack.exceptionStack = function() {
	return haxe_CallStack.getStack(haxe_CallStack.lastException);
};
haxe_CallStack.toString = function(stack) {
	var b = new StringBuf();
	var _g = 0;
	while(_g < stack.length) {
		var s = stack[_g];
		++_g;
		b.b += "\nCalled from ";
		haxe_CallStack.itemToString(b,s);
	}
	return b.b;
};
haxe_CallStack.itemToString = function(b,s) {
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
			haxe_CallStack.itemToString(b,s1);
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
haxe_CallStack.makeStack = function(s) {
	if(s == null) return []; else if(typeof(s) == "string") {
		var stack = s.split("\n");
		if(stack[0] == "Error") stack.shift();
		var m = [];
		var rie10 = new EReg("^   at ([A-Za-z0-9_. ]+) \\(([^)]+):([0-9]+):([0-9]+)\\)$","");
		var _g = 0;
		while(_g < stack.length) {
			var line = stack[_g];
			++_g;
			if(rie10.match(line)) {
				var path = rie10.matched(1).split(".");
				var meth = path.pop();
				var file = rie10.matched(2);
				var line1 = Std.parseInt(rie10.matched(3));
				m.push(haxe_StackItem.FilePos(meth == "Anonymous function"?haxe_StackItem.LocalFunction():meth == "Global code"?null:haxe_StackItem.Method(path.join("."),meth),file,line1));
			} else m.push(haxe_StackItem.Module(StringTools.trim(line)));
		}
		return m;
	} else return s;
};
var haxe_IMap = function() { };
haxe_IMap.__name__ = ["haxe","IMap"];
haxe_IMap.prototype = {
	get: null
	,set: null
	,exists: null
	,keys: null
	,__class__: haxe_IMap
};
var haxe_Log = function() { };
haxe_Log.__name__ = ["haxe","Log"];
haxe_Log.trace = function(v,infos) {
	js_Boot.__trace(v,infos);
};
var haxe_ds_IntMap = function() {
	this.h = { };
};
haxe_ds_IntMap.__name__ = ["haxe","ds","IntMap"];
haxe_ds_IntMap.__interfaces__ = [haxe_IMap];
haxe_ds_IntMap.prototype = {
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
		var s_b = "";
		s_b += "{";
		var it = this.keys();
		while( it.hasNext() ) {
			var i = it.next();
			if(i == null) s_b += "null"; else s_b += "" + i;
			s_b += " => ";
			s_b += Std.string(Std.string(this.h[i]));
			if(it.hasNext()) s_b += ", ";
		}
		s_b += "}";
		return s_b;
	}
	,__class__: haxe_ds_IntMap
};
var haxe_ds_ObjectMap = function() {
	this.h = { };
	this.h.__keys__ = { };
};
haxe_ds_ObjectMap.__name__ = ["haxe","ds","ObjectMap"];
haxe_ds_ObjectMap.__interfaces__ = [haxe_IMap];
haxe_ds_ObjectMap.prototype = {
	h: null
	,set: function(key,value) {
		var id = key.__id__ || (key.__id__ = ++haxe_ds_ObjectMap.count);
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
	,__class__: haxe_ds_ObjectMap
};
var haxe_ds_Option = { __ename__ : ["haxe","ds","Option"], __constructs__ : ["Some","None"] };
haxe_ds_Option.Some = function(v) { var $x = ["Some",0,v]; $x.__enum__ = haxe_ds_Option; $x.toString = $estr; return $x; };
haxe_ds_Option.None = ["None",1];
haxe_ds_Option.None.toString = $estr;
haxe_ds_Option.None.__enum__ = haxe_ds_Option;
var haxe_ds__$StringMap_StringMapIterator = function(map,keys) {
	this.map = map;
	this.keys = keys;
	this.index = 0;
	this.count = keys.length;
};
haxe_ds__$StringMap_StringMapIterator.__name__ = ["haxe","ds","_StringMap","StringMapIterator"];
haxe_ds__$StringMap_StringMapIterator.prototype = {
	map: null
	,keys: null
	,index: null
	,count: null
	,hasNext: function() {
		return this.index < this.count;
	}
	,next: function() {
		return this.map.get(this.keys[this.index++]);
	}
	,__class__: haxe_ds__$StringMap_StringMapIterator
};
var haxe_ds_StringMap = function() {
	this.h = { };
};
haxe_ds_StringMap.__name__ = ["haxe","ds","StringMap"];
haxe_ds_StringMap.__interfaces__ = [haxe_IMap];
haxe_ds_StringMap.prototype = {
	h: null
	,rh: null
	,set: function(key,value) {
		if(__map_reserved[key] != null) this.setReserved(key,value); else this.h[key] = value;
	}
	,get: function(key) {
		if(__map_reserved[key] != null) return this.getReserved(key);
		return this.h[key];
	}
	,exists: function(key) {
		if(__map_reserved[key] != null) return this.existsReserved(key);
		return this.h.hasOwnProperty(key);
	}
	,setReserved: function(key,value) {
		if(this.rh == null) this.rh = { };
		this.rh["$" + key] = value;
	}
	,getReserved: function(key) {
		if(this.rh == null) return null; else return this.rh["$" + key];
	}
	,existsReserved: function(key) {
		if(this.rh == null) return false;
		return this.rh.hasOwnProperty("$" + key);
	}
	,remove: function(key) {
		if(__map_reserved[key] != null) {
			key = "$" + key;
			if(this.rh == null || !this.rh.hasOwnProperty(key)) return false;
			delete(this.rh[key]);
			return true;
		} else {
			if(!this.h.hasOwnProperty(key)) return false;
			delete(this.h[key]);
			return true;
		}
	}
	,keys: function() {
		var _this = this.arrayKeys();
		return HxOverrides.iter(_this);
	}
	,arrayKeys: function() {
		var out = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) out.push(key);
		}
		if(this.rh != null) {
			for( var key in this.rh ) {
			if(key.charCodeAt(0) == 36) out.push(key.substr(1));
			}
		}
		return out;
	}
	,iterator: function() {
		return new haxe_ds__$StringMap_StringMapIterator(this,this.arrayKeys());
	}
	,toString: function() {
		var s = new StringBuf();
		s.b += "{";
		var keys = this.arrayKeys();
		var _g1 = 0;
		var _g = keys.length;
		while(_g1 < _g) {
			var i = _g1++;
			var k = keys[i];
			if(k == null) s.b += "null"; else s.b += "" + k;
			s.b += " => ";
			s.add(Std.string(__map_reserved[k] != null?this.getReserved(k):this.h[k]));
			if(i < keys.length) s.b += ", ";
		}
		s.b += "}";
		return s.b;
	}
	,__class__: haxe_ds_StringMap
};
var js__$Boot_HaxeError = function(val) {
	Error.call(this);
	this.val = val;
	this.message = String(val);
	if(Error.captureStackTrace) Error.captureStackTrace(this,js__$Boot_HaxeError);
};
js__$Boot_HaxeError.__name__ = ["js","_Boot","HaxeError"];
js__$Boot_HaxeError.__super__ = Error;
js__$Boot_HaxeError.prototype = $extend(Error.prototype,{
	val: null
	,__class__: js__$Boot_HaxeError
});
var js_Boot = function() { };
js_Boot.__name__ = ["js","Boot"];
js_Boot.__unhtml = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
};
js_Boot.__trace = function(v,i) {
	var msg;
	if(i != null) msg = i.fileName + ":" + i.lineNumber + ": "; else msg = "";
	msg += js_Boot.__string_rec(v,"");
	if(i != null && i.customParams != null) {
		var _g = 0;
		var _g1 = i.customParams;
		while(_g < _g1.length) {
			var v1 = _g1[_g];
			++_g;
			msg += "," + js_Boot.__string_rec(v1,"");
		}
	}
	var d;
	if(typeof(document) != "undefined" && (d = document.getElementById("haxe:trace")) != null) d.innerHTML += js_Boot.__unhtml(msg) + "<br/>"; else if(typeof console != "undefined" && console.log != null) console.log(msg);
};
js_Boot.getClass = function(o) {
	if((o instanceof Array) && o.__enum__ == null) return Array; else {
		var cl = o.__class__;
		if(cl != null) return cl;
		var name = js_Boot.__nativeClassName(o);
		if(name != null) return js_Boot.__resolveNativeClass(name);
		return null;
	}
};
js_Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str2 = o[0] + "(";
				s += "\t";
				var _g1 = 2;
				var _g = o.length;
				while(_g1 < _g) {
					var i1 = _g1++;
					if(i1 != 2) str2 += "," + js_Boot.__string_rec(o[i1],s); else str2 += js_Boot.__string_rec(o[i1],s);
				}
				return str2 + ")";
			}
			var l = o.length;
			var i;
			var str1 = "[";
			s += "\t";
			var _g2 = 0;
			while(_g2 < l) {
				var i2 = _g2++;
				str1 += (i2 > 0?",":"") + js_Boot.__string_rec(o[i2],s);
			}
			str1 += "]";
			return str1;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			haxe_CallStack.lastException = e;
			if (e instanceof js__$Boot_HaxeError) e = e.val;
			return "???";
		}
		if(tostr != null && tostr != Object.toString && typeof(tostr) == "function") {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js_Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
};
js_Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0;
		var _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js_Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js_Boot.__interfLoop(cc.__super__,cl);
};
js_Boot.__instanceof = function(o,cl) {
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
				if(js_Boot.__interfLoop(js_Boot.getClass(o),cl)) return true;
			} else if(typeof(cl) == "object" && js_Boot.__isNativeObj(cl)) {
				if(o instanceof cl) return true;
			}
		} else return false;
		if(cl == Class && o.__name__ != null) return true;
		if(cl == Enum && o.__ename__ != null) return true;
		return o.__enum__ == cl;
	}
};
js_Boot.__cast = function(o,t) {
	if(js_Boot.__instanceof(o,t)) return o; else throw new js__$Boot_HaxeError("Cannot cast " + Std.string(o) + " to " + Std.string(t));
};
js_Boot.__nativeClassName = function(o) {
	var name = js_Boot.__toStr.call(o).slice(8,-1);
	if(name == "Object" || name == "Function" || name == "Math" || name == "JSON") return null;
	return name;
};
js_Boot.__isNativeObj = function(o) {
	return js_Boot.__nativeClassName(o) != null;
};
js_Boot.__resolveNativeClass = function(name) {
	if(typeof window != "undefined") return window[name]; else return global[name];
};
var thx_Arrays = function() { };
thx_Arrays.__name__ = ["thx","Arrays"];
thx_Arrays.after = function(array,element) {
	return array.slice(HxOverrides.indexOf(array,element,0) + 1);
};
thx_Arrays.all = function(arr,predicate) {
	var _g = 0;
	while(_g < arr.length) {
		var item = arr[_g];
		++_g;
		if(!predicate(item)) return false;
	}
	return true;
};
thx_Arrays.any = function(arr,predicate) {
	var _g = 0;
	while(_g < arr.length) {
		var item = arr[_g];
		++_g;
		if(predicate(item)) return true;
	}
	return false;
};
thx_Arrays.at = function(arr,indexes) {
	return indexes.map(function(i) {
		return arr[i];
	});
};
thx_Arrays.before = function(array,element) {
	return array.slice(0,HxOverrides.indexOf(array,element,0));
};
thx_Arrays.compact = function(arr) {
	return arr.filter(function(v) {
		return null != v;
	});
};
thx_Arrays.contains = function(array,element,eq) {
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
thx_Arrays.cross = function(a,b) {
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
thx_Arrays.crossMulti = function(array) {
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
thx_Arrays.distinct = function(array,predicate) {
	var result = [];
	if(array.length <= 1) return array;
	if(null == predicate) predicate = thx_Functions.equality;
	var _g = 0;
	while(_g < array.length) {
		var v = [array[_g]];
		++_g;
		var keep = !thx_Arrays.any(result,(function(v) {
			return function(r) {
				return predicate(r,v[0]);
			};
		})(v));
		if(keep) result.push(v[0]);
	}
	return result;
};
thx_Arrays.eachPair = function(array,callback) {
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
thx_Arrays.equals = function(a,b,equality) {
	if(a == null || b == null || a.length != b.length) return false;
	if(null == equality) equality = thx_Functions.equality;
	var _g1 = 0;
	var _g = a.length;
	while(_g1 < _g) {
		var i = _g1++;
		if(!equality(a[i],b[i])) return false;
	}
	return true;
};
thx_Arrays.extract = function(a,predicate) {
	var _g1 = 0;
	var _g = a.length;
	while(_g1 < _g) {
		var i = _g1++;
		if(predicate(a[i])) return a.splice(i,1)[0];
	}
	return null;
};
thx_Arrays.find = function(array,predicate) {
	var _g = 0;
	while(_g < array.length) {
		var item = array[_g];
		++_g;
		if(predicate(item)) return item;
	}
	return null;
};
thx_Arrays.findLast = function(array,predicate) {
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
thx_Arrays.first = function(array) {
	return array[0];
};
thx_Arrays.flatMap = function(array,callback) {
	return thx_Arrays.flatten(array.map(callback));
};
thx_Arrays.flatten = function(array) {
	return Array.prototype.concat.apply([],array);
};
thx_Arrays.from = function(array,element) {
	return array.slice(HxOverrides.indexOf(array,element,0));
};
thx_Arrays.groupByAppend = function(arr,resolver,map) {
	arr.map(function(v) {
		var key = resolver(v);
		var arr1 = map.get(key);
		if(null == arr1) {
			arr1 = [v];
			map.set(key,arr1);
		} else arr1.push(v);
	});
	return map;
};
thx_Arrays.head = function(array) {
	return array[0];
};
thx_Arrays.ifEmpty = function(value,alt) {
	if(null != value && 0 != value.length) return value; else return alt;
};
thx_Arrays.initial = function(array) {
	return array.slice(0,array.length - 1);
};
thx_Arrays.isEmpty = function(array) {
	return array.length == 0;
};
thx_Arrays.last = function(array) {
	return array[array.length - 1];
};
thx_Arrays.mapi = function(array,callback) {
	var r = [];
	var _g1 = 0;
	var _g = array.length;
	while(_g1 < _g) {
		var i = _g1++;
		r.push(callback(array[i],i));
	}
	return r;
};
thx_Arrays.mapRight = function(array,callback) {
	var i = array.length;
	var result = [];
	while(--i >= 0) result.push(callback(array[i]));
	return result;
};
thx_Arrays.order = function(array,sort) {
	var n = array.slice();
	n.sort(sort);
	return n;
};
thx_Arrays.pull = function(array,toRemove,equality) {
	var _g = 0;
	while(_g < toRemove.length) {
		var item = toRemove[_g];
		++_g;
		thx_Arrays.removeAll(array,item,equality);
	}
};
thx_Arrays.pushIf = function(array,condition,value) {
	if(condition) array.push(value);
	return array;
};
thx_Arrays.reduce = function(array,callback,initial) {
	return array.reduce(callback,initial);
};
thx_Arrays.resize = function(array,length,fill) {
	while(array.length < length) array.push(fill);
	array.splice(length,array.length - length);
	return array;
};
thx_Arrays.reducei = function(array,callback,initial) {
	return array.reduce(callback,initial);
};
thx_Arrays.reduceRight = function(array,callback,initial) {
	var i = array.length;
	while(--i >= 0) initial = callback(initial,array[i]);
	return initial;
};
thx_Arrays.removeAll = function(array,element,equality) {
	if(null == equality) equality = thx_Functions.equality;
	var i = array.length;
	while(--i >= 0) if(equality(array[i],element)) array.splice(i,1);
};
thx_Arrays.rest = function(array) {
	return array.slice(1);
};
thx_Arrays.sample = function(array,n) {
	n = thx_Ints.min(n,array.length);
	var copy = array.slice();
	var result = [];
	var _g = 0;
	while(_g < n) {
		var i = _g++;
		result.push(copy.splice(Std.random(copy.length),1)[0]);
	}
	return result;
};
thx_Arrays.sampleOne = function(array) {
	return array[Std.random(array.length)];
};
thx_Arrays.shuffle = function(a) {
	var t = thx_Ints.range(a.length);
	var array = [];
	while(t.length > 0) {
		var pos = Std.random(t.length);
		var index = t[pos];
		t.splice(pos,1);
		array.push(a[index]);
	}
	return array;
};
thx_Arrays.take = function(arr,n) {
	return arr.slice(0,n);
};
thx_Arrays.takeLast = function(arr,n) {
	return arr.slice(arr.length - n);
};
thx_Arrays.rotate = function(arr) {
	var result = [];
	var _g1 = 0;
	var _g = arr[0].length;
	while(_g1 < _g) {
		var i = _g1++;
		var row = [];
		result.push(row);
		var _g3 = 0;
		var _g2 = arr.length;
		while(_g3 < _g2) {
			var j = _g3++;
			row.push(arr[j][i]);
		}
	}
	return result;
};
thx_Arrays.zip = function(array1,array2) {
	var length = thx_Ints.min(array1.length,array2.length);
	var array = [];
	var _g = 0;
	while(_g < length) {
		var i = _g++;
		array.push({ _0 : array1[i], _1 : array2[i]});
	}
	return array;
};
thx_Arrays.zip3 = function(array1,array2,array3) {
	var length = thx_ArrayInts.min([array1.length,array2.length,array3.length]);
	var array = [];
	var _g = 0;
	while(_g < length) {
		var i = _g++;
		array.push({ _0 : array1[i], _1 : array2[i], _2 : array3[i]});
	}
	return array;
};
thx_Arrays.zip4 = function(array1,array2,array3,array4) {
	var length = thx_ArrayInts.min([array1.length,array2.length,array3.length,array4.length]);
	var array = [];
	var _g = 0;
	while(_g < length) {
		var i = _g++;
		array.push({ _0 : array1[i], _1 : array2[i], _2 : array3[i], _3 : array4[i]});
	}
	return array;
};
thx_Arrays.zip5 = function(array1,array2,array3,array4,array5) {
	var length = thx_ArrayInts.min([array1.length,array2.length,array3.length,array4.length,array5.length]);
	var array = [];
	var _g = 0;
	while(_g < length) {
		var i = _g++;
		array.push({ _0 : array1[i], _1 : array2[i], _2 : array3[i], _3 : array4[i], _4 : array5[i]});
	}
	return array;
};
thx_Arrays.unzip = function(array) {
	var a1 = [];
	var a2 = [];
	array.map(function(t) {
		a1.push(t._0);
		a2.push(t._1);
	});
	return { _0 : a1, _1 : a2};
};
thx_Arrays.unzip3 = function(array) {
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
thx_Arrays.unzip4 = function(array) {
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
thx_Arrays.unzip5 = function(array) {
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
var thx_ArrayFloats = function() { };
thx_ArrayFloats.__name__ = ["thx","ArrayFloats"];
thx_ArrayFloats.average = function(arr) {
	return thx_ArrayFloats.sum(arr) / arr.length;
};
thx_ArrayFloats.compact = function(arr) {
	return arr.filter(function(v) {
		return null != v && isFinite(v);
	});
};
thx_ArrayFloats.max = function(arr) {
	if(arr.length == 0) return null; else return arr.reduce(function(max,v) {
		if(v > max) return v; else return max;
	},arr[0]);
};
thx_ArrayFloats.min = function(arr) {
	if(arr.length == 0) return null; else return arr.reduce(function(min,v) {
		if(v < min) return v; else return min;
	},arr[0]);
};
thx_ArrayFloats.resize = function(array,length,fill) {
	if(fill == null) fill = 0.0;
	while(array.length < length) array.push(fill);
	array.splice(length,array.length - length);
	return array;
};
thx_ArrayFloats.sum = function(arr) {
	return arr.reduce(function(tot,v) {
		return tot + v;
	},0.0);
};
var thx_ArrayInts = function() { };
thx_ArrayInts.__name__ = ["thx","ArrayInts"];
thx_ArrayInts.average = function(arr) {
	return thx_ArrayInts.sum(arr) / arr.length;
};
thx_ArrayInts.max = function(arr) {
	if(arr.length == 0) return null; else return arr.reduce(function(max,v) {
		if(v > max) return v; else return max;
	},arr[0]);
};
thx_ArrayInts.min = function(arr) {
	if(arr.length == 0) return null; else return arr.reduce(function(min,v) {
		if(v < min) return v; else return min;
	},arr[0]);
};
thx_ArrayInts.resize = function(array,length,fill) {
	if(fill == null) fill = 0;
	while(array.length < length) array.push(fill);
	array.splice(length,array.length - length);
	return array;
};
thx_ArrayInts.sum = function(arr) {
	return arr.reduce(function(tot,v) {
		return tot + v;
	},0);
};
var thx_ArrayStrings = function() { };
thx_ArrayStrings.__name__ = ["thx","ArrayStrings"];
thx_ArrayStrings.compact = function(arr) {
	return arr.filter(function(v) {
		return !thx_Strings.isEmpty(v);
	});
};
thx_ArrayStrings.max = function(arr) {
	if(arr.length == 0) return null; else return arr.reduce(function(max,v) {
		if(v > max) return v; else return max;
	},arr[0]);
};
thx_ArrayStrings.min = function(arr) {
	if(arr.length == 0) return null; else return arr.reduce(function(min,v) {
		if(v < min) return v; else return min;
	},arr[0]);
};
var thx_Dynamics = function() { };
thx_Dynamics.__name__ = ["thx","Dynamics"];
thx_Dynamics.equals = function(a,b) {
	if(!thx_Types.sameType(a,b)) return false;
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
			var cb = Type.getClassName(b == null?null:js_Boot.getClass(b));
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
					if(!thx_Dynamics.equals(aa[i],ab[i])) return false;
				}
				return true;
			}
			if(js_Boot.__instanceof(a,Date)) return a.getTime() == b.getTime();
			if(js_Boot.__instanceof(a,haxe_IMap)) {
				var ha = a;
				var hb = b;
				var ka = thx_Iterators.toArray(ha.keys());
				var kb = thx_Iterators.toArray(hb.keys());
				if(ka.length != kb.length) return false;
				var _g11 = 0;
				while(_g11 < ka.length) {
					var key = ka[_g11];
					++_g11;
					if(!hb.exists(key) || !thx_Dynamics.equals(ha.get(key),hb.get(key))) return false;
				}
				return true;
			}
			var t = false;
			if((t = thx_Iterators.isIterator(a)) || thx_Iterables.isIterable(a)) {
				var va;
				if(t) va = thx_Iterators.toArray(a); else va = thx_Iterators.toArray($iterator(a)());
				var vb;
				if(t) vb = thx_Iterators.toArray(b); else vb = thx_Iterators.toArray($iterator(b)());
				if(va.length != vb.length) return false;
				var _g21 = 0;
				var _g12 = va.length;
				while(_g21 < _g12) {
					var i1 = _g21++;
					if(!thx_Dynamics.equals(va[i1],vb[i1])) return false;
				}
				return true;
			}
			var f = null;
			if(Object.prototype.hasOwnProperty.call(a,"equals") && Reflect.isFunction(f = Reflect.field(a,"equals"))) return f.apply(a,[b]);
			var fields = Type.getInstanceFields(a == null?null:js_Boot.getClass(a));
			var _g13 = 0;
			while(_g13 < fields.length) {
				var field = fields[_g13];
				++_g13;
				var va1 = Reflect.field(a,field);
				if(Reflect.isFunction(va1)) continue;
				var vb1 = Reflect.field(b,field);
				if(!thx_Dynamics.equals(va1,vb1)) return false;
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
				if(!thx_Dynamics.equals(pa[i2],pb[i2])) return false;
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
				if(!thx_Dynamics.equals(va2,vb2)) return false;
			}
			if(fb.length > 0) return false;
			var t1 = false;
			if((t1 = thx_Iterators.isIterator(a)) || thx_Iterables.isIterable(a)) {
				if(t1 && !thx_Iterators.isIterator(b)) return false;
				if(!t1 && !thx_Iterables.isIterable(b)) return false;
				var aa1;
				if(t1) aa1 = thx_Iterators.toArray(a); else aa1 = thx_Iterators.toArray($iterator(a)());
				var ab1;
				if(t1) ab1 = thx_Iterators.toArray(b); else ab1 = thx_Iterators.toArray($iterator(b)());
				if(aa1.length != ab1.length) return false;
				var _g23 = 0;
				var _g16 = aa1.length;
				while(_g23 < _g16) {
					var i3 = _g23++;
					if(!thx_Dynamics.equals(aa1[i3],ab1[i3])) return false;
				}
				return true;
			}
			return true;
		case 8:
			throw new js__$Boot_HaxeError("Unable to compare two unknown types");
			break;
		}
	}
	throw new thx_Error("Unable to compare values: " + Std.string(a) + " and " + Std.string(b),null,{ fileName : "Dynamics.hx", lineNumber : 151, className : "thx.Dynamics", methodName : "equals"});
};
thx_Dynamics.clone = function(v,cloneInstances) {
	if(cloneInstances == null) cloneInstances = false;
	{
		var _g = Type["typeof"](v);
		switch(_g[1]) {
		case 0:
			return null;
		case 1:case 2:case 3:case 7:case 8:case 5:
			return v;
		case 4:
			return thx_Objects.copyTo(v,{ });
		case 6:
			var c = _g[2];
			var name = Type.getClassName(c);
			switch(name) {
			case "Array":
				return v.map(function(v1) {
					return thx_Dynamics.clone(v1,cloneInstances);
				});
			case "String":case "Date":
				return v;
			default:
				if(cloneInstances) {
					var o = Type.createEmptyInstance(c);
					var _g1 = 0;
					var _g2 = Type.getInstanceFields(c);
					while(_g1 < _g2.length) {
						var field = _g2[_g1];
						++_g1;
						Reflect.setField(o,field,thx_Dynamics.clone(Reflect.field(v,field),cloneInstances));
					}
					return o;
				} else return v;
			}
			break;
		}
	}
};
var thx_Either = { __ename__ : ["thx","Either"], __constructs__ : ["Left","Right"] };
thx_Either.Left = function(value) { var $x = ["Left",0,value]; $x.__enum__ = thx_Either; $x.toString = $estr; return $x; };
thx_Either.Right = function(value) { var $x = ["Right",1,value]; $x.__enum__ = thx_Either; $x.toString = $estr; return $x; };
var thx_Error = function(message,stack,pos) {
	Error.call(this,message);
	this.message = message;
	if(null == stack) {
		try {
			stack = haxe_CallStack.exceptionStack();
		} catch( e ) {
			haxe_CallStack.lastException = e;
			if (e instanceof js__$Boot_HaxeError) e = e.val;
			stack = [];
		}
		if(stack.length == 0) try {
			stack = haxe_CallStack.callStack();
		} catch( e1 ) {
			haxe_CallStack.lastException = e1;
			if (e1 instanceof js__$Boot_HaxeError) e1 = e1.val;
			stack = [];
		}
	}
	this.stackItems = stack;
	this.pos = pos;
};
thx_Error.__name__ = ["thx","Error"];
thx_Error.fromDynamic = function(err,pos) {
	if(js_Boot.__instanceof(err,thx_Error)) return err;
	return new thx_error_ErrorWrapper("" + Std.string(err),err,null,pos);
};
thx_Error.__super__ = Error;
thx_Error.prototype = $extend(Error.prototype,{
	pos: null
	,stackItems: null
	,toString: function() {
		return this.message + "\nfrom: " + this.pos.className + "." + this.pos.methodName + "() at " + this.pos.lineNumber + "\n\n" + haxe_CallStack.toString(this.stackItems);
	}
	,__class__: thx_Error
});
var thx_Functions0 = function() { };
thx_Functions0.__name__ = ["thx","Functions0"];
thx_Functions0.after = function(callback,n) {
	return function() {
		if(--n == 0) callback();
	};
};
thx_Functions0.join = function(fa,fb) {
	return function() {
		fa();
		fb();
	};
};
thx_Functions0.once = function(f) {
	return function() {
		var t = f;
		f = thx_Functions.noop;
		t();
	};
};
thx_Functions0.negate = function(callback) {
	return function() {
		return !callback();
	};
};
thx_Functions0.times = function(n,callback) {
	return function() {
		return thx_Ints.range(n).map(function(_) {
			return callback();
		});
	};
};
thx_Functions0.timesi = function(n,callback) {
	return function() {
		return thx_Ints.range(n).map(function(i) {
			return callback(i);
		});
	};
};
var thx_Functions1 = function() { };
thx_Functions1.__name__ = ["thx","Functions1"];
thx_Functions1.compose = function(fa,fb) {
	return function(v) {
		return fa(fb(v));
	};
};
thx_Functions1.join = function(fa,fb) {
	return function(v) {
		fa(v);
		fb(v);
	};
};
thx_Functions1.memoize = function(callback,resolver) {
	if(null == resolver) resolver = function(v) {
		return "" + Std.string(v);
	};
	var map = new haxe_ds_StringMap();
	return function(v1) {
		var key = resolver(v1);
		if(__map_reserved[key] != null?map.existsReserved(key):map.h.hasOwnProperty(key)) return __map_reserved[key] != null?map.getReserved(key):map.h[key];
		var result = callback(v1);
		if(__map_reserved[key] != null) map.setReserved(key,result); else map.h[key] = result;
		return result;
	};
};
thx_Functions1.negate = function(callback) {
	return function(v) {
		return !callback(v);
	};
};
thx_Functions1.noop = function(_) {
};
thx_Functions1.times = function(n,callback) {
	return function(value) {
		return thx_Ints.range(n).map(function(_) {
			return callback(value);
		});
	};
};
thx_Functions1.timesi = function(n,callback) {
	return function(value) {
		return thx_Ints.range(n).map(function(i) {
			return callback(value,i);
		});
	};
};
thx_Functions1.swapArguments = function(callback) {
	return function(a2,a1) {
		return callback(a1,a2);
	};
};
var thx_Functions2 = function() { };
thx_Functions2.__name__ = ["thx","Functions2"];
thx_Functions2.memoize = function(callback,resolver) {
	if(null == resolver) resolver = function(v1,v2) {
		return "" + Std.string(v1) + ":" + Std.string(v2);
	};
	var map = new haxe_ds_StringMap();
	return function(v11,v21) {
		var key = resolver(v11,v21);
		if(__map_reserved[key] != null?map.existsReserved(key):map.h.hasOwnProperty(key)) return __map_reserved[key] != null?map.getReserved(key):map.h[key];
		var result = callback(v11,v21);
		if(__map_reserved[key] != null) map.setReserved(key,result); else map.h[key] = result;
		return result;
	};
};
thx_Functions2.negate = function(callback) {
	return function(v1,v2) {
		return !callback(v1,v2);
	};
};
var thx_Functions3 = function() { };
thx_Functions3.__name__ = ["thx","Functions3"];
thx_Functions3.memoize = function(callback,resolver) {
	if(null == resolver) resolver = function(v1,v2,v3) {
		return "" + Std.string(v1) + ":" + Std.string(v2) + ":" + Std.string(v3);
	};
	var map = new haxe_ds_StringMap();
	return function(v11,v21,v31) {
		var key = resolver(v11,v21,v31);
		if(__map_reserved[key] != null?map.existsReserved(key):map.h.hasOwnProperty(key)) return __map_reserved[key] != null?map.getReserved(key):map.h[key];
		var result = callback(v11,v21,v31);
		if(__map_reserved[key] != null) map.setReserved(key,result); else map.h[key] = result;
		return result;
	};
};
thx_Functions3.negate = function(callback) {
	return function(v1,v2,v3) {
		return !callback(v1,v2,v3);
	};
};
var thx_Functions = function() { };
thx_Functions.__name__ = ["thx","Functions"];
thx_Functions.constant = function(v) {
	return function() {
		return v;
	};
};
thx_Functions.equality = function(a,b) {
	return a == b;
};
thx_Functions.identity = function(value) {
	return value;
};
thx_Functions.noop = function() {
};
var thx_Ints = function() { };
thx_Ints.__name__ = ["thx","Ints"];
thx_Ints.abs = function(v) {
	if(v < 0) return -v; else return v;
};
thx_Ints.canParse = function(s) {
	return thx_Ints.pattern_parse.match(s);
};
thx_Ints.clamp = function(v,min,max) {
	if(v < min) return min; else if(v > max) return max; else return v;
};
thx_Ints.clampSym = function(v,max) {
	return thx_Ints.clamp(v,-max,max);
};
thx_Ints.compare = function(a,b) {
	return a - b;
};
thx_Ints.interpolate = function(f,a,b) {
	return Math.round(a + (b - a) * f);
};
thx_Ints.isEven = function(v) {
	return v % 2 == 0;
};
thx_Ints.isOdd = function(v) {
	return v % 2 != 0;
};
thx_Ints.max = function(a,b) {
	if(a > b) return a; else return b;
};
thx_Ints.min = function(a,b) {
	if(a < b) return a; else return b;
};
thx_Ints.parse = function(s,base) {
	var v = parseInt(s,base);
	if(isNaN(v)) return null; else return v;
};
thx_Ints.random = function(min,max) {
	if(min == null) min = 0;
	return Std.random(max + 1) + min;
};
thx_Ints.range = function(start,stop,step) {
	if(step == null) step = 1;
	if(null == stop) {
		stop = start;
		start = 0;
	}
	if((stop - start) / step == Infinity) throw new js__$Boot_HaxeError("infinite range");
	var range = [];
	var i = -1;
	var j;
	if(step < 0) while((j = start + step * ++i) > stop) range.push(j); else while((j = start + step * ++i) < stop) range.push(j);
	return range;
};
thx_Ints.toString = function(value,base) {
	return value.toString(base);
};
thx_Ints.toBool = function(v) {
	return v != 0;
};
thx_Ints.sign = function(value) {
	if(value < 0) return -1; else return 1;
};
thx_Ints.wrapCircular = function(v,max) {
	v = v % max;
	if(v < 0) v += max;
	return v;
};
var thx_Iterables = function() { };
thx_Iterables.__name__ = ["thx","Iterables"];
thx_Iterables.all = function(it,predicate) {
	return thx_Iterators.all($iterator(it)(),predicate);
};
thx_Iterables.any = function(it,predicate) {
	return thx_Iterators.any($iterator(it)(),predicate);
};
thx_Iterables.eachPair = function(it,handler) {
	thx_Iterators.eachPair($iterator(it)(),handler);
	return;
};
thx_Iterables.filter = function(it,predicate) {
	return thx_Iterators.filter($iterator(it)(),predicate);
};
thx_Iterables.find = function(it,predicate) {
	return thx_Iterators.find($iterator(it)(),predicate);
};
thx_Iterables.first = function(it) {
	return thx_Iterators.first($iterator(it)());
};
thx_Iterables.last = function(it) {
	return thx_Iterators.last($iterator(it)());
};
thx_Iterables.isEmpty = function(it) {
	return thx_Iterators.isEmpty($iterator(it)());
};
thx_Iterables.isIterable = function(v) {
	var fields;
	if(Reflect.isObject(v) && null == Type.getClass(v)) fields = Reflect.fields(v); else fields = Type.getInstanceFields(Type.getClass(v));
	if(!Lambda.has(fields,"iterator")) return false;
	return Reflect.isFunction(Reflect.field(v,"iterator"));
};
thx_Iterables.map = function(it,f) {
	return thx_Iterators.map($iterator(it)(),f);
};
thx_Iterables.mapi = function(it,f) {
	return thx_Iterators.mapi($iterator(it)(),f);
};
thx_Iterables.order = function(it,sort) {
	return thx_Iterators.order($iterator(it)(),sort);
};
thx_Iterables.reduce = function(it,callback,initial) {
	return thx_Iterators.reduce($iterator(it)(),callback,initial);
};
thx_Iterables.reducei = function(it,callback,initial) {
	return thx_Iterators.reducei($iterator(it)(),callback,initial);
};
thx_Iterables.toArray = function(it) {
	return thx_Iterators.toArray($iterator(it)());
};
var thx_Iterators = function() { };
thx_Iterators.__name__ = ["thx","Iterators"];
thx_Iterators.all = function(it,predicate) {
	while( it.hasNext() ) {
		var item = it.next();
		if(!predicate(item)) return false;
	}
	return true;
};
thx_Iterators.any = function(it,predicate) {
	while( it.hasNext() ) {
		var item = it.next();
		if(predicate(item)) return true;
	}
	return false;
};
thx_Iterators.eachPair = function(it,handler) {
	thx_Arrays.eachPair(thx_Iterators.toArray(it),handler);
};
thx_Iterators.filter = function(it,predicate) {
	return thx_Iterators.reduce(it,function(acc,item) {
		if(predicate(item)) acc.push(item);
		return acc;
	},[]);
};
thx_Iterators.find = function(it,f) {
	while( it.hasNext() ) {
		var item = it.next();
		if(f(item)) return item;
	}
	return null;
};
thx_Iterators.first = function(it) {
	if(it.hasNext()) return it.next(); else return null;
};
thx_Iterators.isEmpty = function(it) {
	return !it.hasNext();
};
thx_Iterators.isIterator = function(v) {
	var fields;
	if(Reflect.isObject(v) && null == Type.getClass(v)) fields = Reflect.fields(v); else fields = Type.getInstanceFields(Type.getClass(v));
	if(!Lambda.has(fields,"next") || !Lambda.has(fields,"hasNext")) return false;
	return Reflect.isFunction(Reflect.field(v,"next")) && Reflect.isFunction(Reflect.field(v,"hasNext"));
};
thx_Iterators.last = function(it) {
	var buf = null;
	while(it.hasNext()) buf = it.next();
	return buf;
};
thx_Iterators.map = function(it,f) {
	var acc = [];
	while( it.hasNext() ) {
		var v = it.next();
		acc.push(f(v));
	}
	return acc;
};
thx_Iterators.mapi = function(it,f) {
	var acc = [];
	var i = 0;
	while( it.hasNext() ) {
		var v = it.next();
		acc.push(f(v,i++));
	}
	return acc;
};
thx_Iterators.order = function(it,sort) {
	var n = thx_Iterators.toArray(it);
	n.sort(sort);
	return n;
};
thx_Iterators.reduce = function(it,callback,initial) {
	thx_Iterators.map(it,function(v) {
		initial = callback(initial,v);
	});
	return initial;
};
thx_Iterators.reducei = function(it,callback,initial) {
	thx_Iterators.mapi(it,function(v,i) {
		initial = callback(initial,v,i);
	});
	return initial;
};
thx_Iterators.toArray = function(it) {
	var items = [];
	while( it.hasNext() ) {
		var item = it.next();
		items.push(item);
	}
	return items;
};
var thx_Maps = function() { };
thx_Maps.__name__ = ["thx","Maps"];
thx_Maps.tuples = function(map) {
	return thx_Iterators.map(map.keys(),function(key) {
		var _1 = map.get(key);
		return { _0 : key, _1 : _1};
	});
};
thx_Maps.mapToObject = function(map) {
	return thx_Arrays.reduce(thx_Maps.tuples(map),function(o,t) {
		o[t._0] = t._1;
		return o;
	},{ });
};
thx_Maps.getAlt = function(map,key,alt) {
	var v = map.get(key);
	if(null == v) return alt; else return v;
};
thx_Maps.isMap = function(v) {
	return js_Boot.__instanceof(v,haxe_IMap);
};
var thx_Nil = { __ename__ : ["thx","Nil"], __constructs__ : ["nil"] };
thx_Nil.nil = ["nil",0];
thx_Nil.nil.toString = $estr;
thx_Nil.nil.__enum__ = thx_Nil;
var thx_Objects = function() { };
thx_Objects.__name__ = ["thx","Objects"];
thx_Objects.isEmpty = function(o) {
	return Reflect.fields(o).length == 0;
};
thx_Objects.exists = function(o,name) {
	return Object.prototype.hasOwnProperty.call(o,name);
};
thx_Objects.fields = function(o) {
	return Reflect.fields(o);
};
thx_Objects.merge = function(to,from,replacef) {
	if(null == replacef) replacef = function(field,oldv,newv) {
		return newv;
	};
	var _g = 0;
	var _g1 = Reflect.fields(from);
	while(_g < _g1.length) {
		var field1 = _g1[_g];
		++_g;
		var newv1 = Reflect.field(from,field1);
		if(Object.prototype.hasOwnProperty.call(to,field1)) Reflect.setField(to,field1,replacef(field1,Reflect.field(to,field1),newv1)); else to[field1] = newv1;
	}
	return to;
};
thx_Objects.copyTo = function(src,dst,cloneInstances) {
	if(cloneInstances == null) cloneInstances = false;
	var _g = 0;
	var _g1 = Reflect.fields(src);
	while(_g < _g1.length) {
		var field = _g1[_g];
		++_g;
		var sv = thx_Dynamics.clone(Reflect.field(src,field),cloneInstances);
		var dv = Reflect.field(dst,field);
		if(Reflect.isObject(sv) && null == Type.getClass(sv) && (Reflect.isObject(dv) && null == Type.getClass(dv))) thx_Objects.copyTo(sv,dv); else dst[field] = sv;
	}
	return dst;
};
thx_Objects.clone = function(src,cloneInstances) {
	if(cloneInstances == null) cloneInstances = false;
	return thx_Dynamics.clone(src,cloneInstances);
};
thx_Objects.objectToMap = function(o) {
	return thx_Arrays.reduce(thx_Objects.tuples(o),function(map,t) {
		var value = t._1;
		map.set(t._0,value);
		return map;
	},new haxe_ds_StringMap());
};
thx_Objects.size = function(o) {
	return Reflect.fields(o).length;
};
thx_Objects.values = function(o) {
	return Reflect.fields(o).map(function(key) {
		return Reflect.field(o,key);
	});
};
thx_Objects.tuples = function(o) {
	return Reflect.fields(o).map(function(key) {
		var _1 = Reflect.field(o,key);
		return { _0 : key, _1 : _1};
	});
};
var thx_Options = function() { };
thx_Options.__name__ = ["thx","Options"];
thx_Options.equals = function(a,b,eq) {
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
thx_Options.equalsValue = function(a,b,eq) {
	return thx_Options.equals(a,null == b?haxe_ds_Option.None:haxe_ds_Option.Some(b),eq);
};
thx_Options.flatMap = function(option,callback) {
	switch(option[1]) {
	case 1:
		return [];
	case 0:
		var v = option[2];
		return callback(v);
	}
};
thx_Options.map = function(option,callback) {
	switch(option[1]) {
	case 1:
		return haxe_ds_Option.None;
	case 0:
		var v = option[2];
		return haxe_ds_Option.Some(callback(v));
	}
};
thx_Options.toArray = function(option) {
	switch(option[1]) {
	case 1:
		return [];
	case 0:
		var v = option[2];
		return [v];
	}
};
thx_Options.toBool = function(option) {
	switch(option[1]) {
	case 1:
		return false;
	case 0:
		return true;
	}
};
thx_Options.toOption = function(value) {
	if(null == value) return haxe_ds_Option.None; else return haxe_ds_Option.Some(value);
};
thx_Options.toValue = function(option) {
	switch(option[1]) {
	case 1:
		return null;
	case 0:
		var v = option[2];
		return v;
	}
};
var thx__$Result_Result_$Impl_$ = {};
thx__$Result_Result_$Impl_$.__name__ = ["thx","_Result","Result_Impl_"];
thx__$Result_Result_$Impl_$.optionValue = function(this1) {
	switch(this1[1]) {
	case 1:
		var v = this1[2];
		return haxe_ds_Option.Some(v);
	default:
		return haxe_ds_Option.None;
	}
};
thx__$Result_Result_$Impl_$.optionError = function(this1) {
	switch(this1[1]) {
	case 0:
		var v = this1[2];
		return haxe_ds_Option.Some(v);
	default:
		return haxe_ds_Option.None;
	}
};
thx__$Result_Result_$Impl_$.value = function(this1) {
	switch(this1[1]) {
	case 1:
		var v = this1[2];
		return v;
	default:
		return null;
	}
};
thx__$Result_Result_$Impl_$.error = function(this1) {
	switch(this1[1]) {
	case 0:
		var v = this1[2];
		return v;
	default:
		return null;
	}
};
thx__$Result_Result_$Impl_$.get_isSuccess = function(this1) {
	switch(this1[1]) {
	case 1:
		return true;
	default:
		return false;
	}
};
thx__$Result_Result_$Impl_$.get_isFailure = function(this1) {
	switch(this1[1]) {
	case 0:
		return true;
	default:
		return false;
	}
};
var thx__$Set_Set_$Impl_$ = {};
thx__$Set_Set_$Impl_$.__name__ = ["thx","_Set","Set_Impl_"];
thx__$Set_Set_$Impl_$.arrayToSet = function(arr) {
	var set = [];
	var _g = 0;
	while(_g < arr.length) {
		var v = arr[_g];
		++_g;
		thx__$Set_Set_$Impl_$.push(set,v);
	}
	return set;
};
thx__$Set_Set_$Impl_$.create = function(arr) {
	if(null == arr) return []; else return thx__$Set_Set_$Impl_$.arrayToSet(arr);
};
thx__$Set_Set_$Impl_$._new = function(arr) {
	return arr;
};
thx__$Set_Set_$Impl_$.add = function(this1,v) {
	if(thx__$Set_Set_$Impl_$.exists(this1,v)) return false; else {
		this1.push(v);
		return true;
	}
};
thx__$Set_Set_$Impl_$.copy = function(this1) {
	var arr = this1.slice();
	return arr;
};
thx__$Set_Set_$Impl_$.difference = function(this1,set) {
	var result = this1.slice();
	var $it0 = HxOverrides.iter(set);
	while( $it0.hasNext() ) {
		var item = $it0.next();
		HxOverrides.remove(result,item);
	}
	return result;
};
thx__$Set_Set_$Impl_$.exists = function(this1,v) {
	var _g = 0;
	while(_g < this1.length) {
		var t = this1[_g];
		++_g;
		if(t == v) return true;
	}
	return false;
};
thx__$Set_Set_$Impl_$.get = function(this1,index) {
	return this1[index];
};
thx__$Set_Set_$Impl_$.intersection = function(this1,set) {
	var result = [];
	var _g = 0;
	while(_g < this1.length) {
		var item = this1[_g];
		++_g;
		if(thx__$Set_Set_$Impl_$.exists(set,item)) result.push(item);
	}
	return result;
};
thx__$Set_Set_$Impl_$.push = function(this1,v) {
	thx__$Set_Set_$Impl_$.add(this1,v);
};
thx__$Set_Set_$Impl_$.slice = function(this1,pos,end) {
	var arr = this1.slice(pos,end);
	return arr;
};
thx__$Set_Set_$Impl_$.splice = function(this1,pos,len) {
	var arr = this1.splice(pos,len);
	return arr;
};
thx__$Set_Set_$Impl_$.union = function(this1,set) {
	return thx__$Set_Set_$Impl_$.arrayToSet(this1.concat(thx__$Set_Set_$Impl_$.setToArray(set)));
};
thx__$Set_Set_$Impl_$.setToArray = function(this1) {
	return this1.slice();
};
thx__$Set_Set_$Impl_$.toString = function(this1) {
	return "{" + this1.join(", ") + "}";
};
var thx_Strings = function() { };
thx_Strings.__name__ = ["thx","Strings"];
thx_Strings.after = function(value,searchFor) {
	var pos = value.indexOf(searchFor);
	if(pos < 0) return ""; else return value.substring(pos + searchFor.length);
};
thx_Strings.capitalize = function(s) {
	return s.substring(0,1).toUpperCase() + s.substring(1);
};
thx_Strings.capitalizeWords = function(value,whiteSpaceOnly) {
	if(whiteSpaceOnly == null) whiteSpaceOnly = false;
	if(whiteSpaceOnly) return thx_Strings.UCWORDSWS.map(value.substring(0,1).toUpperCase() + value.substring(1),thx_Strings.upperMatch); else return thx_Strings.UCWORDS.map(value.substring(0,1).toUpperCase() + value.substring(1),thx_Strings.upperMatch);
};
thx_Strings.collapse = function(value) {
	return thx_Strings.WSG.replace(StringTools.trim(value)," ");
};
thx_Strings.compare = function(a,b) {
	if(a < b) return -1; else if(a > b) return 1; else return 0;
};
thx_Strings.contains = function(s,test) {
	return s.indexOf(test) >= 0;
};
thx_Strings.dasherize = function(s) {
	return StringTools.replace(s,"_","-");
};
thx_Strings.ellipsis = function(s,maxlen,symbol) {
	if(symbol == null) symbol = "...";
	if(maxlen == null) maxlen = 20;
	if(s.length > maxlen) return s.substring(0,symbol.length > maxlen - symbol.length?symbol.length:maxlen - symbol.length) + symbol; else return s;
};
thx_Strings.filter = function(s,predicate) {
	return s.split("").filter(predicate).join("");
};
thx_Strings.filterCharcode = function(s,predicate) {
	return thx_Strings.toCharcodeArray(s).filter(predicate).map(function(i) {
		return String.fromCharCode(i);
	}).join("");
};
thx_Strings.from = function(value,searchFor) {
	var pos = value.indexOf(searchFor);
	if(pos < 0) return ""; else return value.substring(pos);
};
thx_Strings.humanize = function(s) {
	return StringTools.replace(thx_Strings.underscore(s),"_"," ");
};
thx_Strings.isAlphaNum = function(value) {
	return thx_Strings.ALPHANUM.match(value);
};
thx_Strings.isLowerCase = function(value) {
	return value.toLowerCase() == value;
};
thx_Strings.isUpperCase = function(value) {
	return value.toUpperCase() == value;
};
thx_Strings.ifEmpty = function(value,alt) {
	if(null != value && "" != value) return value; else return alt;
};
thx_Strings.isDigitsOnly = function(value) {
	return thx_Strings.DIGITS.match(value);
};
thx_Strings.isEmpty = function(value) {
	return value == null || value == "";
};
thx_Strings.random = function(value,length) {
	if(length == null) length = 1;
	var pos = Math.floor((value.length - length + 1) * Math.random());
	return HxOverrides.substr(value,pos,length);
};
thx_Strings.iterator = function(s) {
	var _this = s.split("");
	return HxOverrides.iter(_this);
};
thx_Strings.map = function(value,callback) {
	return value.split("").map(callback);
};
thx_Strings.remove = function(value,toremove) {
	return StringTools.replace(value,toremove,"");
};
thx_Strings.removeAfter = function(value,toremove) {
	if(StringTools.endsWith(value,toremove)) return value.substring(0,value.length - toremove.length); else return value;
};
thx_Strings.removeBefore = function(value,toremove) {
	if(StringTools.startsWith(value,toremove)) return value.substring(toremove.length); else return value;
};
thx_Strings.repeat = function(s,times) {
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
thx_Strings.reverse = function(s) {
	var arr = s.split("");
	arr.reverse();
	return arr.join("");
};
thx_Strings.stripTags = function(s) {
	return thx_Strings.STRIPTAGS.replace(s,"");
};
thx_Strings.surround = function(s,left,right) {
	return "" + left + s + (null == right?left:right);
};
thx_Strings.toArray = function(s) {
	return s.split("");
};
thx_Strings.toCharcodeArray = function(s) {
	return thx_Strings.map(s,function(s1) {
		return HxOverrides.cca(s1,0);
	});
};
thx_Strings.toChunks = function(s,len) {
	var chunks = [];
	while(s.length > 0) {
		chunks.push(s.substring(0,len));
		s = s.substring(len);
	}
	return chunks;
};
thx_Strings.trimChars = function(value,charlist) {
	return thx_Strings.trimCharsRight(thx_Strings.trimCharsLeft(value,charlist),charlist);
};
thx_Strings.trimCharsLeft = function(value,charlist) {
	var pos = 0;
	var _g1 = 0;
	var _g = value.length;
	while(_g1 < _g) {
		var i = _g1++;
		if(thx_Strings.contains(charlist,value.charAt(i))) pos++; else break;
	}
	return value.substring(pos);
};
thx_Strings.trimCharsRight = function(value,charlist) {
	var len = value.length;
	var pos = len;
	var i;
	var _g = 0;
	while(_g < len) {
		var j = _g++;
		i = len - j - 1;
		if(thx_Strings.contains(charlist,value.charAt(i))) pos = i; else break;
	}
	return value.substring(0,pos);
};
thx_Strings.underscore = function(s) {
	s = new EReg("::","g").replace(s,"/");
	s = new EReg("([A-Z]+)([A-Z][a-z])","g").replace(s,"$1_$2");
	s = new EReg("([a-z\\d])([A-Z])","g").replace(s,"$1_$2");
	s = new EReg("-","g").replace(s,"_");
	return s.toLowerCase();
};
thx_Strings.upTo = function(value,searchFor) {
	var pos = value.indexOf(searchFor);
	if(pos < 0) return value; else return value.substring(0,pos);
};
thx_Strings.wrapColumns = function(s,columns,indent,newline) {
	if(newline == null) newline = "\n";
	if(indent == null) indent = "";
	if(columns == null) columns = 78;
	return thx_Strings.SPLIT_LINES.split(s).map(function(part) {
		return thx_Strings.wrapLine(StringTools.trim(thx_Strings.WSG.replace(part," ")),columns,indent,newline);
	}).join(newline);
};
thx_Strings.upperMatch = function(re) {
	return re.matched(0).toUpperCase();
};
thx_Strings.wrapLine = function(s,columns,indent,newline) {
	var parts = [];
	var pos = 0;
	var len = s.length;
	var ilen = indent.length;
	columns -= ilen;
	while(true) {
		if(pos + columns >= len - ilen) {
			parts.push(s.substring(pos));
			break;
		}
		var i = 0;
		while(!StringTools.isSpace(s,pos + columns - i) && i < columns) i++;
		if(i == columns) {
			i = 0;
			while(!StringTools.isSpace(s,pos + columns + i) && pos + columns + i < len) i++;
			parts.push(s.substring(pos,pos + columns + i));
			pos += columns + i + 1;
		} else {
			parts.push(s.substring(pos,pos + columns - i));
			pos += columns - i + 1;
		}
	}
	return indent + parts.join(newline + indent);
};
var thx_Timer = function() { };
thx_Timer.__name__ = ["thx","Timer"];
thx_Timer.debounce = function(callback,delayms,leading) {
	if(leading == null) leading = false;
	var cancel = thx_Functions.noop;
	var poll = function() {
		cancel();
		cancel = thx_Timer.delay(callback,delayms);
	};
	return function() {
		if(leading) {
			leading = false;
			callback();
		}
		poll();
	};
};
thx_Timer.throttle = function(callback,delayms,leading) {
	if(leading == null) leading = false;
	var waiting = false;
	var poll = function() {
		waiting = true;
		thx_Timer.delay(callback,delayms);
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
thx_Timer.repeat = function(callback,delayms) {
	return (function(f,id) {
		return function() {
			f(id);
		};
	})(thx_Timer.clear,setInterval(callback,delayms));
};
thx_Timer.delay = function(callback,delayms) {
	return (function(f,id) {
		return function() {
			f(id);
		};
	})(thx_Timer.clear,setTimeout(callback,delayms));
};
thx_Timer.frame = function(callback) {
	var cancelled = false;
	var f = thx_Functions.noop;
	var current = performance.now();
	var next;
	f = function() {
		if(cancelled) return;
		next = performance.now();
		callback(next - current);
		current = next;
		requestAnimationFrame(f);
	};
	requestAnimationFrame(f);
	return function() {
		cancelled = true;
	};
};
thx_Timer.nextFrame = function(callback) {
	var id = requestAnimationFrame(callback);
	return function() {
		cancelAnimationFrame(id);
	};
};
thx_Timer.immediate = function(callback) {
	return (function(f,id) {
		return function() {
			f(id);
		};
	})(thx_Timer.clear,setImmediate(callback));
};
thx_Timer.clear = function(id) {
	clearTimeout(id);
	return;
};
thx_Timer.time = function() {
	return performance.now();
};
var thx__$Tuple_Tuple0_$Impl_$ = {};
thx__$Tuple_Tuple0_$Impl_$.__name__ = ["thx","_Tuple","Tuple0_Impl_"];
thx__$Tuple_Tuple0_$Impl_$._new = function() {
	return thx_Nil.nil;
};
thx__$Tuple_Tuple0_$Impl_$["with"] = function(this1,v) {
	return v;
};
thx__$Tuple_Tuple0_$Impl_$.toString = function(this1) {
	return "Tuple0()";
};
thx__$Tuple_Tuple0_$Impl_$.toNil = function(this1) {
	return this1;
};
thx__$Tuple_Tuple0_$Impl_$.nilToTuple = function(v) {
	return thx_Nil.nil;
};
var thx__$Tuple_Tuple1_$Impl_$ = {};
thx__$Tuple_Tuple1_$Impl_$.__name__ = ["thx","_Tuple","Tuple1_Impl_"];
thx__$Tuple_Tuple1_$Impl_$._new = function(_0) {
	return _0;
};
thx__$Tuple_Tuple1_$Impl_$.get__0 = function(this1) {
	return this1;
};
thx__$Tuple_Tuple1_$Impl_$["with"] = function(this1,v) {
	return { _0 : this1, _1 : v};
};
thx__$Tuple_Tuple1_$Impl_$.toString = function(this1) {
	return "Tuple1(" + Std.string(this1) + ")";
};
thx__$Tuple_Tuple1_$Impl_$.arrayToTuple = function(v) {
	return v[0];
};
var thx__$Tuple_Tuple2_$Impl_$ = {};
thx__$Tuple_Tuple2_$Impl_$.__name__ = ["thx","_Tuple","Tuple2_Impl_"];
thx__$Tuple_Tuple2_$Impl_$._new = function(_0,_1) {
	return { _0 : _0, _1 : _1};
};
thx__$Tuple_Tuple2_$Impl_$.get_left = function(this1) {
	return this1._0;
};
thx__$Tuple_Tuple2_$Impl_$.get_right = function(this1) {
	return this1._1;
};
thx__$Tuple_Tuple2_$Impl_$.flip = function(this1) {
	return { _0 : this1._1, _1 : this1._0};
};
thx__$Tuple_Tuple2_$Impl_$.dropLeft = function(this1) {
	return this1._1;
};
thx__$Tuple_Tuple2_$Impl_$.dropRight = function(this1) {
	return this1._0;
};
thx__$Tuple_Tuple2_$Impl_$["with"] = function(this1,v) {
	return { _0 : this1._0, _1 : this1._1, _2 : v};
};
thx__$Tuple_Tuple2_$Impl_$.toString = function(this1) {
	return "Tuple2(" + Std.string(this1._0) + "," + Std.string(this1._1) + ")";
};
thx__$Tuple_Tuple2_$Impl_$.arrayToTuple2 = function(v) {
	return { _0 : v[0], _1 : v[1]};
};
var thx__$Tuple_Tuple3_$Impl_$ = {};
thx__$Tuple_Tuple3_$Impl_$.__name__ = ["thx","_Tuple","Tuple3_Impl_"];
thx__$Tuple_Tuple3_$Impl_$._new = function(_0,_1,_2) {
	return { _0 : _0, _1 : _1, _2 : _2};
};
thx__$Tuple_Tuple3_$Impl_$.flip = function(this1) {
	return { _0 : this1._2, _1 : this1._1, _2 : this1._0};
};
thx__$Tuple_Tuple3_$Impl_$.dropLeft = function(this1) {
	return { _0 : this1._1, _1 : this1._2};
};
thx__$Tuple_Tuple3_$Impl_$.dropRight = function(this1) {
	return { _0 : this1._0, _1 : this1._1};
};
thx__$Tuple_Tuple3_$Impl_$["with"] = function(this1,v) {
	return { _0 : this1._0, _1 : this1._1, _2 : this1._2, _3 : v};
};
thx__$Tuple_Tuple3_$Impl_$.toString = function(this1) {
	return "Tuple3(" + Std.string(this1._0) + "," + Std.string(this1._1) + "," + Std.string(this1._2) + ")";
};
thx__$Tuple_Tuple3_$Impl_$.arrayToTuple3 = function(v) {
	return { _0 : v[0], _1 : v[1], _2 : v[2]};
};
var thx__$Tuple_Tuple4_$Impl_$ = {};
thx__$Tuple_Tuple4_$Impl_$.__name__ = ["thx","_Tuple","Tuple4_Impl_"];
thx__$Tuple_Tuple4_$Impl_$._new = function(_0,_1,_2,_3) {
	return { _0 : _0, _1 : _1, _2 : _2, _3 : _3};
};
thx__$Tuple_Tuple4_$Impl_$.flip = function(this1) {
	return { _0 : this1._3, _1 : this1._2, _2 : this1._1, _3 : this1._0};
};
thx__$Tuple_Tuple4_$Impl_$.dropLeft = function(this1) {
	return { _0 : this1._1, _1 : this1._2, _2 : this1._3};
};
thx__$Tuple_Tuple4_$Impl_$.dropRight = function(this1) {
	return { _0 : this1._0, _1 : this1._1, _2 : this1._2};
};
thx__$Tuple_Tuple4_$Impl_$["with"] = function(this1,v) {
	return { _0 : this1._0, _1 : this1._1, _2 : this1._2, _3 : this1._3, _4 : v};
};
thx__$Tuple_Tuple4_$Impl_$.toString = function(this1) {
	return "Tuple4(" + Std.string(this1._0) + "," + Std.string(this1._1) + "," + Std.string(this1._2) + "," + Std.string(this1._3) + ")";
};
thx__$Tuple_Tuple4_$Impl_$.arrayToTuple4 = function(v) {
	return { _0 : v[0], _1 : v[1], _2 : v[2], _3 : v[3]};
};
var thx__$Tuple_Tuple5_$Impl_$ = {};
thx__$Tuple_Tuple5_$Impl_$.__name__ = ["thx","_Tuple","Tuple5_Impl_"];
thx__$Tuple_Tuple5_$Impl_$._new = function(_0,_1,_2,_3,_4) {
	return { _0 : _0, _1 : _1, _2 : _2, _3 : _3, _4 : _4};
};
thx__$Tuple_Tuple5_$Impl_$.flip = function(this1) {
	return { _0 : this1._4, _1 : this1._3, _2 : this1._2, _3 : this1._1, _4 : this1._0};
};
thx__$Tuple_Tuple5_$Impl_$.dropLeft = function(this1) {
	return { _0 : this1._1, _1 : this1._2, _2 : this1._3, _3 : this1._4};
};
thx__$Tuple_Tuple5_$Impl_$.dropRight = function(this1) {
	return { _0 : this1._0, _1 : this1._1, _2 : this1._2, _3 : this1._3};
};
thx__$Tuple_Tuple5_$Impl_$["with"] = function(this1,v) {
	return { _0 : this1._0, _1 : this1._1, _2 : this1._2, _3 : this1._3, _4 : this1._4, _5 : v};
};
thx__$Tuple_Tuple5_$Impl_$.toString = function(this1) {
	return "Tuple5(" + Std.string(this1._0) + "," + Std.string(this1._1) + "," + Std.string(this1._2) + "," + Std.string(this1._3) + "," + Std.string(this1._4) + ")";
};
thx__$Tuple_Tuple5_$Impl_$.arrayToTuple5 = function(v) {
	return { _0 : v[0], _1 : v[1], _2 : v[2], _3 : v[3], _4 : v[4]};
};
var thx__$Tuple_Tuple6_$Impl_$ = {};
thx__$Tuple_Tuple6_$Impl_$.__name__ = ["thx","_Tuple","Tuple6_Impl_"];
thx__$Tuple_Tuple6_$Impl_$._new = function(_0,_1,_2,_3,_4,_5) {
	return { _0 : _0, _1 : _1, _2 : _2, _3 : _3, _4 : _4, _5 : _5};
};
thx__$Tuple_Tuple6_$Impl_$.flip = function(this1) {
	return { _0 : this1._5, _1 : this1._4, _2 : this1._3, _3 : this1._2, _4 : this1._1, _5 : this1._0};
};
thx__$Tuple_Tuple6_$Impl_$.dropLeft = function(this1) {
	return { _0 : this1._1, _1 : this1._2, _2 : this1._3, _3 : this1._4, _4 : this1._5};
};
thx__$Tuple_Tuple6_$Impl_$.dropRight = function(this1) {
	return { _0 : this1._0, _1 : this1._1, _2 : this1._2, _3 : this1._3, _4 : this1._4};
};
thx__$Tuple_Tuple6_$Impl_$.toString = function(this1) {
	return "Tuple6(" + Std.string(this1._0) + "," + Std.string(this1._1) + "," + Std.string(this1._2) + "," + Std.string(this1._3) + "," + Std.string(this1._4) + "," + Std.string(this1._5) + ")";
};
thx__$Tuple_Tuple6_$Impl_$.arrayToTuple6 = function(v) {
	return { _0 : v[0], _1 : v[1], _2 : v[2], _3 : v[3], _4 : v[4], _5 : v[5]};
};
var thx_Types = function() { };
thx_Types.__name__ = ["thx","Types"];
thx_Types.isAnonymousObject = function(v) {
	return Reflect.isObject(v) && null == Type.getClass(v);
};
thx_Types.isPrimitive = function(v) {
	{
		var _g = Type["typeof"](v);
		switch(_g[1]) {
		case 1:case 2:case 3:
			return true;
		case 0:case 5:case 7:case 4:case 8:
			return false;
		case 6:
			var c = _g[2];
			return Type.getClassName(c) == "String";
		}
	}
};
thx_Types.hasSuperClass = function(cls,sup) {
	while(null != cls) {
		if(cls == sup) return true;
		cls = Type.getSuperClass(cls);
	}
	return false;
};
thx_Types.sameType = function(a,b) {
	return thx_Types.typeToString(Type["typeof"](a)) == thx_Types.typeToString(Type["typeof"](b));
};
thx_Types.typeInheritance = function(type) {
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
		throw new js__$Boot_HaxeError("invalid type " + Std.string(type));
	}
};
thx_Types.typeToString = function(type) {
	switch(type[1]) {
	case 0:
		return "Null";
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
		throw new js__$Boot_HaxeError("invalid type " + Std.string(type));
	}
};
thx_Types.valueTypeInheritance = function(value) {
	return thx_Types.typeInheritance(Type["typeof"](value));
};
thx_Types.valueTypeToString = function(value) {
	return thx_Types.typeToString(Type["typeof"](value));
};
var thx_Uuid = function() { };
thx_Uuid.__name__ = ["thx","Uuid"];
thx_Uuid.random = function() {
	return Math.floor(Math.random() * 16);
};
thx_Uuid.srandom = function() {
	return "" + Math.floor(Math.random() * 16);
};
thx_Uuid.create = function() {
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
var thx_error_ErrorWrapper = function(message,innerError,stack,pos) {
	thx_Error.call(this,message,stack,pos);
	this.innerError = innerError;
};
thx_error_ErrorWrapper.__name__ = ["thx","error","ErrorWrapper"];
thx_error_ErrorWrapper.__super__ = thx_Error;
thx_error_ErrorWrapper.prototype = $extend(thx_Error.prototype,{
	innerError: null
	,__class__: thx_error_ErrorWrapper
});
var thx_promise_Future = function() {
	this.handlers = [];
	this.state = haxe_ds_Option.None;
};
thx_promise_Future.__name__ = ["thx","promise","Future"];
thx_promise_Future.sequence = function(arr) {
	return thx_promise_Future.create(function(callback) {
		var poll;
		var poll1 = null;
		poll1 = function(_) {
			if(arr.length == 0) callback(thx_Nil.nil); else arr.shift().then(poll1);
		};
		poll = poll1;
		poll(null);
	});
};
thx_promise_Future.afterAll = function(arr) {
	return thx_promise_Future.create(function(callback) {
		thx_promise_Future.all(arr).then(function(_) {
			callback(thx_Nil.nil);
		});
	});
};
thx_promise_Future.all = function(arr) {
	return thx_promise_Future.create(function(callback) {
		var results = [];
		var counter = 0;
		thx_Arrays.mapi(arr,function(p,i) {
			p.then(function(value) {
				results[i] = value;
				counter++;
				if(counter == arr.length) callback(results);
			});
		});
	});
};
thx_promise_Future.create = function(handler) {
	var future = new thx_promise_Future();
	handler($bind(future,future.setState));
	return future;
};
thx_promise_Future.flatMap = function(future) {
	return thx_promise_Future.create(function(callback) {
		future.then(function(future1) {
			future1.then(callback);
		});
	});
};
thx_promise_Future.value = function(v) {
	return thx_promise_Future.create(function(callback) {
		callback(v);
	});
};
thx_promise_Future.prototype = {
	handlers: null
	,state: null
	,delay: function(delayms) {
		if(null == delayms) return thx_promise_Future.flatMap(this.map(function(value) {
			return thx_promise_Timer.immediateValue(value);
		})); else return thx_promise_Future.flatMap(this.map(function(value1) {
			return thx_promise_Timer.delayValue(value1,delayms);
		}));
	}
	,hasValue: function() {
		return thx_Options.toBool(this.state);
	}
	,map: function(handler) {
		var _g = this;
		return thx_promise_Future.create(function(callback) {
			_g.then(function(value) {
				callback(handler(value));
			});
		});
	}
	,mapAsync: function(handler) {
		var _g = this;
		return thx_promise_Future.create(function(callback) {
			_g.then(function(result) {
				handler(result,callback);
			});
		});
	}
	,mapPromise: function(handler) {
		var _g = this;
		return thx_promise__$Promise_Promise_$Impl_$.create(function(resolve,reject) {
			_g.then(function(result) {
				thx_promise__$Promise_Promise_$Impl_$.failure(thx_promise__$Promise_Promise_$Impl_$.success(handler(result),resolve),reject);
			});
		});
	}
	,mapFuture: function(handler) {
		return thx_promise_Future.flatMap(this.map(handler));
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
				this.state = haxe_ds_Option.Some(newstate);
				break;
			case 0:
				var r = _g[2];
				throw new thx_Error("future was already \"" + Std.string(r) + "\", can't apply the new state \"" + Std.string(newstate) + "\"",null,{ fileName : "Future.hx", lineNumber : 108, className : "thx.promise.Future", methodName : "setState"});
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
	,__class__: thx_promise_Future
};
var thx_promise_Futures = function() { };
thx_promise_Futures.__name__ = ["thx","promise","Futures"];
thx_promise_Futures.join = function(p1,p2) {
	return thx_promise_Future.create(function(callback) {
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
thx_promise_Futures.log = function(future,prefix) {
	if(prefix == null) prefix = "";
	return future.then(function(r) {
		haxe_Log.trace("" + prefix + " VALUE: " + Std.string(r),{ fileName : "Future.hx", lineNumber : 155, className : "thx.promise.Futures", methodName : "log"});
	});
};
var thx_promise_FutureTuple6 = function() { };
thx_promise_FutureTuple6.__name__ = ["thx","promise","FutureTuple6"];
thx_promise_FutureTuple6.mapTuple = function(future,callback) {
	return future.map(function(t) {
		return callback(t._0,t._1,t._2,t._3,t._4,t._5);
	});
};
thx_promise_FutureTuple6.mapTupleAsync = function(future,callback) {
	return future.mapAsync(function(t,cb) {
		callback(t._0,t._1,t._2,t._3,t._4,t._5,cb);
		return;
	});
};
thx_promise_FutureTuple6.mapTupleFuture = function(future,callback) {
	return thx_promise_Future.flatMap(future.map(function(t) {
		return callback(t._0,t._1,t._2,t._3,t._4,t._5);
	}));
};
thx_promise_FutureTuple6.tuple = function(future,callback) {
	return future.then(function(t) {
		callback(t._0,t._1,t._2,t._3,t._4,t._5);
	});
};
var thx_promise_FutureTuple5 = function() { };
thx_promise_FutureTuple5.__name__ = ["thx","promise","FutureTuple5"];
thx_promise_FutureTuple5.join = function(p1,p2) {
	return thx_promise_Future.create(function(callback) {
		thx_promise_Futures.join(p1,p2).then(function(t) {
			callback((function($this) {
				var $r;
				var this1 = t._0;
				$r = { _0 : this1._0, _1 : this1._1, _2 : this1._2, _3 : this1._3, _4 : this1._4, _5 : t._1};
				return $r;
			}(this)));
		});
	});
};
thx_promise_FutureTuple5.mapTuple = function(future,callback) {
	return future.map(function(t) {
		return callback(t._0,t._1,t._2,t._3,t._4);
	});
};
thx_promise_FutureTuple5.mapTupleAsync = function(future,callback) {
	return future.mapAsync(function(t,cb) {
		callback(t._0,t._1,t._2,t._3,t._4,cb);
		return;
	});
};
thx_promise_FutureTuple5.mapTupleFuture = function(future,callback) {
	return thx_promise_Future.flatMap(future.map(function(t) {
		return callback(t._0,t._1,t._2,t._3,t._4);
	}));
};
thx_promise_FutureTuple5.tuple = function(future,callback) {
	return future.then(function(t) {
		callback(t._0,t._1,t._2,t._3,t._4);
	});
};
var thx_promise_FutureTuple4 = function() { };
thx_promise_FutureTuple4.__name__ = ["thx","promise","FutureTuple4"];
thx_promise_FutureTuple4.join = function(p1,p2) {
	return thx_promise_Future.create(function(callback) {
		thx_promise_Futures.join(p1,p2).then(function(t) {
			callback((function($this) {
				var $r;
				var this1 = t._0;
				$r = { _0 : this1._0, _1 : this1._1, _2 : this1._2, _3 : this1._3, _4 : t._1};
				return $r;
			}(this)));
		});
	});
};
thx_promise_FutureTuple4.mapTuple = function(future,callback) {
	return future.map(function(t) {
		return callback(t._0,t._1,t._2,t._3);
	});
};
thx_promise_FutureTuple4.mapTupleAsync = function(future,callback) {
	return future.mapAsync(function(t,cb) {
		callback(t._0,t._1,t._2,t._3,cb);
		return;
	});
};
thx_promise_FutureTuple4.mapTupleFuture = function(future,callback) {
	return thx_promise_Future.flatMap(future.map(function(t) {
		return callback(t._0,t._1,t._2,t._3);
	}));
};
thx_promise_FutureTuple4.tuple = function(future,callback) {
	return future.then(function(t) {
		callback(t._0,t._1,t._2,t._3);
	});
};
var thx_promise_FutureTuple3 = function() { };
thx_promise_FutureTuple3.__name__ = ["thx","promise","FutureTuple3"];
thx_promise_FutureTuple3.join = function(p1,p2) {
	return thx_promise_Future.create(function(callback) {
		thx_promise_Futures.join(p1,p2).then(function(t) {
			callback((function($this) {
				var $r;
				var this1 = t._0;
				$r = { _0 : this1._0, _1 : this1._1, _2 : this1._2, _3 : t._1};
				return $r;
			}(this)));
		});
	});
};
thx_promise_FutureTuple3.mapTuple = function(future,callback) {
	return future.map(function(t) {
		return callback(t._0,t._1,t._2);
	});
};
thx_promise_FutureTuple3.mapTupleAsync = function(future,callback) {
	return future.mapAsync(function(t,cb) {
		callback(t._0,t._1,t._2,cb);
		return;
	});
};
thx_promise_FutureTuple3.mapTupleFuture = function(future,callback) {
	return thx_promise_Future.flatMap(future.map(function(t) {
		return callback(t._0,t._1,t._2);
	}));
};
thx_promise_FutureTuple3.tuple = function(future,callback) {
	return future.then(function(t) {
		callback(t._0,t._1,t._2);
	});
};
var thx_promise_FutureTuple2 = function() { };
thx_promise_FutureTuple2.__name__ = ["thx","promise","FutureTuple2"];
thx_promise_FutureTuple2.join = function(p1,p2) {
	return thx_promise_Future.create(function(callback) {
		thx_promise_Futures.join(p1,p2).then(function(t) {
			callback((function($this) {
				var $r;
				var this1 = t._0;
				$r = { _0 : this1._0, _1 : this1._1, _2 : t._1};
				return $r;
			}(this)));
		});
	});
};
thx_promise_FutureTuple2.mapTuple = function(future,callback) {
	return future.map(function(t) {
		return callback(t._0,t._1);
	});
};
thx_promise_FutureTuple2.mapTupleAsync = function(future,callback) {
	return future.mapAsync(function(t,cb) {
		callback(t._0,t._1,cb);
		return;
	});
};
thx_promise_FutureTuple2.mapTupleFuture = function(future,callback) {
	return thx_promise_Future.flatMap(future.map(function(t) {
		return callback(t._0,t._1);
	}));
};
thx_promise_FutureTuple2.tuple = function(future,callback) {
	return future.then(function(t) {
		callback(t._0,t._1);
	});
};
var thx_promise_FutureNil = function() { };
thx_promise_FutureNil.__name__ = ["thx","promise","FutureNil"];
thx_promise_FutureNil.join = function(p1,p2) {
	return thx_promise_Future.create(function(callback) {
		thx_promise_Futures.join(p1,p2).then(function(t) {
			callback(t._1);
		});
	});
};
thx_promise_FutureNil.nil = function(p) {
	return thx_promise_Future.create(function(callback) {
		p.then(function(_) {
			callback(thx_Nil.nil);
		});
	});
};
var thx_promise__$Promise_Promise_$Impl_$ = {};
thx_promise__$Promise_Promise_$Impl_$.__name__ = ["thx","promise","_Promise","Promise_Impl_"];
thx_promise__$Promise_Promise_$Impl_$.futureToPromise = function(future) {
	return future.map(function(v) {
		return thx_Either.Right(v);
	});
};
thx_promise__$Promise_Promise_$Impl_$.sequence = function(arr) {
	return thx_promise__$Promise_Promise_$Impl_$.create(function(resolve,reject) {
		var poll;
		var poll1 = null;
		poll1 = function(_) {
			if(arr.length == 0) resolve(thx_promise__$Promise_Promise_$Impl_$.nil); else thx_promise__$Promise_Promise_$Impl_$.mapFailure(thx_promise__$Promise_Promise_$Impl_$.mapSuccess(arr.shift(),poll1),reject);
		};
		poll = poll1;
		poll(null);
	});
};
thx_promise__$Promise_Promise_$Impl_$.afterAll = function(arr) {
	return thx_promise__$Promise_Promise_$Impl_$.create(function(resolve,reject) {
		thx_promise__$Promise_Promise_$Impl_$.either(thx_promise__$Promise_Promise_$Impl_$.all(arr),function(_) {
			resolve(thx_Nil.nil);
		},reject);
	});
};
thx_promise__$Promise_Promise_$Impl_$.all = function(arr) {
	if(arr.length == 0) return thx_promise__$Promise_Promise_$Impl_$.value([]);
	return thx_promise__$Promise_Promise_$Impl_$.create(function(resolve,reject) {
		var results = [];
		var counter = 0;
		var hasError = false;
		thx_Arrays.mapi(arr,function(p,i) {
			thx_promise__$Promise_Promise_$Impl_$.either(p,function(value) {
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
thx_promise__$Promise_Promise_$Impl_$.create = function(callback) {
	return thx_promise_Future.create(function(cb) {
		callback(function(value) {
			cb(thx_Either.Right(value));
		},function(error) {
			cb(thx_Either.Left(error));
		});
	});
};
thx_promise__$Promise_Promise_$Impl_$.createFulfill = function(callback) {
	return thx_promise_Future.create(callback);
};
thx_promise__$Promise_Promise_$Impl_$.error = function(err) {
	return thx_promise__$Promise_Promise_$Impl_$.create(function(_,reject) {
		reject(err);
	});
};
thx_promise__$Promise_Promise_$Impl_$.value = function(v) {
	return thx_promise__$Promise_Promise_$Impl_$.create(function(resolve,_) {
		resolve(v);
	});
};
thx_promise__$Promise_Promise_$Impl_$.always = function(this1,handler) {
	this1.then(function(_) {
		handler();
	});
};
thx_promise__$Promise_Promise_$Impl_$.either = function(this1,success,failure) {
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
thx_promise__$Promise_Promise_$Impl_$.delay = function(this1,delayms) {
	return this1.delay(delayms);
};
thx_promise__$Promise_Promise_$Impl_$.isFailure = function(this1) {
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
thx_promise__$Promise_Promise_$Impl_$.isResolved = function(this1) {
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
thx_promise__$Promise_Promise_$Impl_$.failure = function(this1,failure) {
	return thx_promise__$Promise_Promise_$Impl_$.either(this1,function(_) {
	},failure);
};
thx_promise__$Promise_Promise_$Impl_$.mapAlways = function(this1,handler) {
	return this1.map(function(_) {
		return handler();
	});
};
thx_promise__$Promise_Promise_$Impl_$.mapAlwaysAsync = function(this1,handler) {
	return this1.mapAsync(function(_,cb) {
		handler(cb);
		return;
	});
};
thx_promise__$Promise_Promise_$Impl_$.mapAlwaysFuture = function(this1,handler) {
	return thx_promise_Future.flatMap(this1.map(function(_) {
		return handler();
	}));
};
thx_promise__$Promise_Promise_$Impl_$.mapEither = function(this1,success,failure) {
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
thx_promise__$Promise_Promise_$Impl_$.mapEitherFuture = function(this1,success,failure) {
	return thx_promise_Future.flatMap(this1.map(function(result) {
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
thx_promise__$Promise_Promise_$Impl_$.mapFailure = function(this1,failure) {
	return thx_promise__$Promise_Promise_$Impl_$.mapEither(this1,function(value) {
		return value;
	},failure);
};
thx_promise__$Promise_Promise_$Impl_$.mapFailureFuture = function(this1,failure) {
	return thx_promise__$Promise_Promise_$Impl_$.mapEitherFuture(this1,function(value) {
		return thx_promise_Future.value(value);
	},failure);
};
thx_promise__$Promise_Promise_$Impl_$.mapFailurePromise = function(this1,failure) {
	return thx_promise__$Promise_Promise_$Impl_$.mapEitherFuture(this1,function(value) {
		return thx_promise__$Promise_Promise_$Impl_$.value(value);
	},failure);
};
thx_promise__$Promise_Promise_$Impl_$.mapSuccess = function(this1,success) {
	return thx_promise__$Promise_Promise_$Impl_$.mapEitherFuture(this1,function(v) {
		return thx_promise__$Promise_Promise_$Impl_$.value(success(v));
	},function(err) {
		return thx_promise__$Promise_Promise_$Impl_$.error(err);
	});
};
thx_promise__$Promise_Promise_$Impl_$.mapSuccessPromise = function(this1,success) {
	return thx_promise__$Promise_Promise_$Impl_$.mapEitherFuture(this1,success,function(err) {
		return thx_promise__$Promise_Promise_$Impl_$.error(err);
	});
};
thx_promise__$Promise_Promise_$Impl_$.success = function(this1,success) {
	return thx_promise__$Promise_Promise_$Impl_$.either(this1,success,function(_) {
	});
};
thx_promise__$Promise_Promise_$Impl_$.throwFailure = function(this1) {
	return thx_promise__$Promise_Promise_$Impl_$.failure(this1,function(err) {
		throw err;
	});
};
thx_promise__$Promise_Promise_$Impl_$.toString = function(this1) {
	return "Promise";
};
var thx_promise_Promises = function() { };
thx_promise_Promises.__name__ = ["thx","promise","Promises"];
thx_promise_Promises.join = function(p1,p2) {
	return thx_promise__$Promise_Promise_$Impl_$.create(function(resolve,reject) {
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
		thx_promise__$Promise_Promise_$Impl_$.either(p1,function(v) {
			if(hasError) return;
			counter++;
			v1 = v;
			complete();
		},handleError);
		thx_promise__$Promise_Promise_$Impl_$.either(p2,function(v3) {
			if(hasError) return;
			counter++;
			v2 = v3;
			complete();
		},handleError);
	});
};
thx_promise_Promises.log = function(promise,prefix) {
	if(prefix == null) prefix = "";
	return thx_promise__$Promise_Promise_$Impl_$.either(promise,function(r) {
		haxe_Log.trace("" + prefix + " SUCCESS: " + Std.string(r),{ fileName : "Promise.hx", lineNumber : 202, className : "thx.promise.Promises", methodName : "log"});
	},function(e) {
		haxe_Log.trace("" + prefix + " ERROR: " + e.toString(),{ fileName : "Promise.hx", lineNumber : 203, className : "thx.promise.Promises", methodName : "log"});
	});
};
var thx_promise_PromiseTuple6 = function() { };
thx_promise_PromiseTuple6.__name__ = ["thx","promise","PromiseTuple6"];
thx_promise_PromiseTuple6.mapTuplePromise = function(promise,success) {
	return thx_promise__$Promise_Promise_$Impl_$.mapSuccessPromise(promise,function(t) {
		return success(t._0,t._1,t._2,t._3,t._4,t._5);
	});
};
thx_promise_PromiseTuple6.mapTuple = function(promise,success) {
	return thx_promise__$Promise_Promise_$Impl_$.mapSuccess(promise,function(t) {
		return success(t._0,t._1,t._2,t._3,t._4,t._5);
	});
};
thx_promise_PromiseTuple6.tuple = function(promise,success,failure) {
	return thx_promise__$Promise_Promise_$Impl_$.either(promise,function(t) {
		success(t._0,t._1,t._2,t._3,t._4,t._5);
	},null == failure?function(_) {
	}:failure);
};
var thx_promise_PromiseTuple5 = function() { };
thx_promise_PromiseTuple5.__name__ = ["thx","promise","PromiseTuple5"];
thx_promise_PromiseTuple5.join = function(p1,p2) {
	return thx_promise__$Promise_Promise_$Impl_$.create(function(resolve,reject) {
		thx_promise__$Promise_Promise_$Impl_$.either(thx_promise_Promises.join(p1,p2),function(t) {
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
thx_promise_PromiseTuple5.mapTuplePromise = function(promise,success) {
	return thx_promise__$Promise_Promise_$Impl_$.mapSuccessPromise(promise,function(t) {
		return success(t._0,t._1,t._2,t._3,t._4);
	});
};
thx_promise_PromiseTuple5.mapTuple = function(promise,success) {
	return thx_promise__$Promise_Promise_$Impl_$.mapSuccess(promise,function(t) {
		return success(t._0,t._1,t._2,t._3,t._4);
	});
};
thx_promise_PromiseTuple5.tuple = function(promise,success,failure) {
	return thx_promise__$Promise_Promise_$Impl_$.either(promise,function(t) {
		success(t._0,t._1,t._2,t._3,t._4);
	},null == failure?function(_) {
	}:failure);
};
var thx_promise_PromiseTuple4 = function() { };
thx_promise_PromiseTuple4.__name__ = ["thx","promise","PromiseTuple4"];
thx_promise_PromiseTuple4.join = function(p1,p2) {
	return thx_promise__$Promise_Promise_$Impl_$.create(function(resolve,reject) {
		thx_promise__$Promise_Promise_$Impl_$.either(thx_promise_Promises.join(p1,p2),function(t) {
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
thx_promise_PromiseTuple4.mapTuplePromise = function(promise,success) {
	return thx_promise__$Promise_Promise_$Impl_$.mapSuccessPromise(promise,function(t) {
		return success(t._0,t._1,t._2,t._3);
	});
};
thx_promise_PromiseTuple4.mapTuple = function(promise,success) {
	return thx_promise__$Promise_Promise_$Impl_$.mapSuccess(promise,function(t) {
		return success(t._0,t._1,t._2,t._3);
	});
};
thx_promise_PromiseTuple4.tuple = function(promise,success,failure) {
	return thx_promise__$Promise_Promise_$Impl_$.either(promise,function(t) {
		success(t._0,t._1,t._2,t._3);
	},null == failure?function(_) {
	}:failure);
};
var thx_promise_PromiseTuple3 = function() { };
thx_promise_PromiseTuple3.__name__ = ["thx","promise","PromiseTuple3"];
thx_promise_PromiseTuple3.join = function(p1,p2) {
	return thx_promise__$Promise_Promise_$Impl_$.create(function(resolve,reject) {
		thx_promise__$Promise_Promise_$Impl_$.either(thx_promise_Promises.join(p1,p2),function(t) {
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
thx_promise_PromiseTuple3.mapTuplePromise = function(promise,success) {
	return thx_promise__$Promise_Promise_$Impl_$.mapSuccessPromise(promise,function(t) {
		return success(t._0,t._1,t._2);
	});
};
thx_promise_PromiseTuple3.mapTuple = function(promise,success) {
	return thx_promise__$Promise_Promise_$Impl_$.mapSuccess(promise,function(t) {
		return success(t._0,t._1,t._2);
	});
};
thx_promise_PromiseTuple3.tuple = function(promise,success,failure) {
	return thx_promise__$Promise_Promise_$Impl_$.either(promise,function(t) {
		success(t._0,t._1,t._2);
	},null == failure?function(_) {
	}:failure);
};
var thx_promise_PromiseTuple2 = function() { };
thx_promise_PromiseTuple2.__name__ = ["thx","promise","PromiseTuple2"];
thx_promise_PromiseTuple2.join = function(p1,p2) {
	return thx_promise__$Promise_Promise_$Impl_$.create(function(resolve,reject) {
		thx_promise__$Promise_Promise_$Impl_$.either(thx_promise_Promises.join(p1,p2),function(t) {
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
thx_promise_PromiseTuple2.mapTuplePromise = function(promise,success) {
	return thx_promise__$Promise_Promise_$Impl_$.mapSuccessPromise(promise,function(t) {
		return success(t._0,t._1);
	});
};
thx_promise_PromiseTuple2.mapTuple = function(promise,success) {
	return thx_promise__$Promise_Promise_$Impl_$.mapSuccess(promise,function(t) {
		return success(t._0,t._1);
	});
};
thx_promise_PromiseTuple2.tuple = function(promise,success,failure) {
	return thx_promise__$Promise_Promise_$Impl_$.either(promise,function(t) {
		success(t._0,t._1);
	},null == failure?function(_) {
	}:failure);
};
var thx_promise_PromiseNil = function() { };
thx_promise_PromiseNil.__name__ = ["thx","promise","PromiseNil"];
thx_promise_PromiseNil.join = function(p1,p2) {
	return thx_promise__$Promise_Promise_$Impl_$.create(function(resolve,reject) {
		thx_promise__$Promise_Promise_$Impl_$.either(thx_promise_Promises.join(p1,p2),function(t) {
			resolve(t._1);
		},function(e) {
			reject(e);
		});
	});
};
thx_promise_PromiseNil.nil = function(p) {
	return thx_promise__$Promise_Promise_$Impl_$.create(function(resolve,reject) {
		thx_promise__$Promise_Promise_$Impl_$.failure(thx_promise__$Promise_Promise_$Impl_$.success(p,function(_) {
			resolve(thx_Nil.nil);
		}),reject);
	});
};
var thx_promise_PromiseAPlus = function() { };
thx_promise_PromiseAPlus.__name__ = ["thx","promise","PromiseAPlus"];
thx_promise_PromiseAPlus.promise = function(p) {
	return thx_promise__$Promise_Promise_$Impl_$.create(function(resolve,reject) {
		p.then(resolve,function(e) {
			reject(thx_Error.fromDynamic(e,{ fileName : "Promise.hx", lineNumber : 352, className : "thx.promise.PromiseAPlus", methodName : "promise"}));
		});
	});
};
thx_promise_PromiseAPlus.aPlus = function(p) {
	return new Promise(function(resolve,reject) {
		thx_promise__$Promise_Promise_$Impl_$.failure(thx_promise__$Promise_Promise_$Impl_$.success(p,resolve),reject);
	});
};
var thx_promise_PromiseAPlusVoid = function() { };
thx_promise_PromiseAPlusVoid.__name__ = ["thx","promise","PromiseAPlusVoid"];
thx_promise_PromiseAPlusVoid.promise = function(p) {
	return thx_promise__$Promise_Promise_$Impl_$.create(function(resolve,reject) {
		p.then(function() {
			resolve(thx_Nil.nil);
		},function(e) {
			reject(thx_Error.fromDynamic(e,{ fileName : "Promise.hx", lineNumber : 364, className : "thx.promise.PromiseAPlusVoid", methodName : "promise"}));
		});
	});
};
thx_promise_PromiseAPlusVoid.aPlus = function(p) {
	return new Promise(function(resolve,reject) {
		thx_promise__$Promise_Promise_$Impl_$.failure(thx_promise__$Promise_Promise_$Impl_$.success(p,function() {
			resolve(thx_Nil.nil);
		}),reject);
	});
};
var thx_promise_Timer = function() { };
thx_promise_Timer.__name__ = ["thx","promise","Timer"];
thx_promise_Timer.delay = function(delayms) {
	return thx_promise_Timer.delayValue(thx_Nil.nil,delayms);
};
thx_promise_Timer.delayValue = function(value,delayms) {
	return thx_promise_Future.create(function(callback) {
		thx_Timer.delay((function(f,a1) {
			return function() {
				f(a1);
			};
		})(callback,value),delayms);
	});
};
thx_promise_Timer.immediate = function() {
	return thx_promise_Timer.immediateValue(thx_Nil.nil);
};
thx_promise_Timer.immediateValue = function(value) {
	return thx_promise_Future.create(function(callback) {
		thx_Timer.immediate((function(f,a1) {
			return function() {
				f(a1);
			};
		})(callback,value));
	});
};
var thx_stream_Emitter = function(init) {
	this.init = init;
};
thx_stream_Emitter.__name__ = ["thx","stream","Emitter"];
thx_stream_Emitter.prototype = {
	init: null
	,feed: function(value) {
		var stream = new thx_stream_Stream(null);
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
		var stream = new thx_stream_Stream(null);
		stream.subscriber = $bind(bus,bus.emit);
		bus.upStreams.push(stream);
		stream.addCleanUp(function() {
			HxOverrides.remove(bus.upStreams,stream);
		});
		this.init(stream);
		return stream;
	}
	,sign: function(subscriber) {
		var stream = new thx_stream_Stream(subscriber);
		this.init(stream);
		return stream;
	}
	,subscribe: function(pulse,end) {
		if(null != pulse) pulse = pulse; else pulse = function(_) {
		};
		if(null != end) end = end; else end = function(_1) {
		};
		var stream = new thx_stream_Stream(function(r) {
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
		return new thx_stream_Emitter(function(stream) {
			_g.init(new thx_stream_Stream(function(r) {
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
		return new thx_stream_Emitter(function(stream) {
			var cancel = function() {
			};
			stream.addCleanUp(function() {
				cancel();
			});
			_g.init(new thx_stream_Stream(function(r) {
				switch(r[1]) {
				case 0:
					var v = r[2];
					cancel();
					cancel = thx_Timer.delay((function(f,v1) {
						return function() {
							f(v1);
						};
					})($bind(stream,stream.pulse),v),delay);
					break;
				case 1:
					switch(r[2]) {
					case true:
						stream.cancel();
						break;
					case false:
						thx_Timer.delay($bind(stream,stream.end),delay);
						break;
					}
					break;
				}
			}));
		});
	}
	,delay: function(time) {
		var _g = this;
		return new thx_stream_Emitter(function(stream) {
			var cancel = thx_Timer.delay(function() {
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
		return new thx_stream_Emitter(function(stream) {
			_g.init(stream);
			other.init(stream);
		});
	}
	,previous: function() {
		var _g = this;
		return new thx_stream_Emitter(function(stream) {
			var value = null;
			var first = true;
			var pulse = function() {
				if(first) {
					first = false;
					return;
				}
				stream.pulse(value);
			};
			_g.init(new thx_stream_Stream(function(r) {
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
		return new thx_stream_Emitter(function(stream) {
			_g.init(new thx_stream_Stream(function(r) {
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
		return new thx_stream_Emitter(function(stream) {
			var buf = [];
			var pulse = function() {
				if(buf.length > size) buf.shift();
				if(buf.length == size || emitWithLess) stream.pulse(buf.slice());
			};
			_g.init(new thx_stream_Stream(function(r) {
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
	,map: function(f) {
		return this.mapFuture(function(v) {
			return thx_promise_Future.value(f(v));
		});
	}
	,mapFuture: function(f) {
		var _g = this;
		return new thx_stream_Emitter(function(stream) {
			_g.init(new thx_stream_Stream(function(r) {
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
	,toOption: function() {
		return this.map(function(v) {
			if(null == v) return haxe_ds_Option.None; else return haxe_ds_Option.Some(v);
		});
	}
	,toNil: function() {
		return this.map(function(_) {
			return thx_Nil.nil;
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
	,filter: function(f) {
		return this.filterFuture(function(v) {
			return thx_promise_Future.value(f(v));
		});
	}
	,filterFuture: function(f) {
		var _g = this;
		return new thx_stream_Emitter(function(stream) {
			_g.init(new thx_stream_Stream(function(r) {
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
		return new thx_stream_Emitter(function(stream) {
			var last = null;
			_g.init(new thx_stream_Stream(function(r) {
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
			return thx_Arrays.contains(arr,v,equality);
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
		return thx_stream_EmitterArrays.flatten(this.window(n).last());
	}
	,takeUntil: function(f) {
		var _g = this;
		return new thx_stream_Emitter(function(stream) {
			var instream = null;
			instream = new thx_stream_Stream(function(r) {
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
	,pair: function(other) {
		var _g = this;
		return new thx_stream_Emitter(function(stream) {
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
			_g.init(new thx_stream_Stream(function(r) {
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
			other.init(new thx_stream_Stream(function(r1) {
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
		return new thx_stream_Emitter(function(stream) {
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
			_g.init(new thx_stream_Stream(function(r) {
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
			sampler.init(new thx_stream_Stream(function(r1) {
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
		return new thx_stream_Emitter(function(stream) {
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
			_g.init(new thx_stream_Stream(function(r) {
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
			other.init(new thx_stream_Stream(function(r1) {
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
	,audit: function(handler) {
		return this.map(function(v) {
			handler(v);
			return v;
		});
	}
	,log: function(prefix,posInfo) {
		if(prefix == null) prefix = ""; else prefix = "" + prefix + ": ";
		return this.map(function(v) {
			haxe_Log.trace("" + prefix + Std.string(v),posInfo);
			return v;
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
				thx_Timer.immediate(function() {
					_g.init(new thx_stream_Stream(function(r) {
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
		var _0 = new thx_stream_Emitter(init);
		var _1 = new thx_stream_Emitter(init);
		return { _0 : _0, _1 : _1};
	}
	,__class__: thx_stream_Emitter
};
var thx_stream_Bus = function(distinctValuesOnly,equal) {
	if(distinctValuesOnly == null) distinctValuesOnly = false;
	var _g = this;
	this.distinctValuesOnly = distinctValuesOnly;
	if(null == equal) this.equal = function(a,b) {
		return a == b;
	}; else this.equal = equal;
	this.downStreams = [];
	this.upStreams = [];
	thx_stream_Emitter.call(this,function(stream) {
		_g.downStreams.push(stream);
		stream.addCleanUp(function() {
			HxOverrides.remove(_g.downStreams,stream);
		});
	});
};
thx_stream_Bus.__name__ = ["thx","stream","Bus"];
thx_stream_Bus.__super__ = thx_stream_Emitter;
thx_stream_Bus.prototype = $extend(thx_stream_Emitter.prototype,{
	downStreams: null
	,upStreams: null
	,distinctValuesOnly: null
	,equal: null
	,value: null
	,cancel: function() {
		this.emit(thx_stream_StreamValue.End(true));
	}
	,clear: function() {
		this.clearEmitters();
		this.clearStreams();
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
		this.emit(thx_stream_StreamValue.End(false));
	}
	,pulse: function(value) {
		this.emit(thx_stream_StreamValue.Pulse(value));
	}
	,__class__: thx_stream_Bus
});
var thx_stream_Emitters = function() { };
thx_stream_Emitters.__name__ = ["thx","stream","Emitters"];
thx_stream_Emitters.skipNull = function(emitter) {
	return emitter.filter(function(value) {
		return null != value;
	});
};
thx_stream_Emitters.unique = function(emitter) {
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
var thx_stream_EmitterStrings = function() { };
thx_stream_EmitterStrings.__name__ = ["thx","stream","EmitterStrings"];
thx_stream_EmitterStrings.match = function(emitter,pattern) {
	return emitter.filter(function(s) {
		return pattern.match(s);
	});
};
thx_stream_EmitterStrings.toBool = function(emitter) {
	return emitter.map(function(s) {
		return s != null && s != "";
	});
};
thx_stream_EmitterStrings.truthy = function(emitter) {
	return emitter.filter(function(s) {
		return s != null && s != "";
	});
};
thx_stream_EmitterStrings.unique = function(emitter) {
	return emitter.filter((function() {
		var buf = new haxe_ds_StringMap();
		return function(v) {
			if(__map_reserved[v] != null?buf.existsReserved(v):buf.h.hasOwnProperty(v)) return false; else {
				if(__map_reserved[v] != null) buf.setReserved(v,true); else buf.h[v] = true;
				return true;
			}
		};
	})());
};
var thx_stream_EmitterInts = function() { };
thx_stream_EmitterInts.__name__ = ["thx","stream","EmitterInts"];
thx_stream_EmitterInts.average = function(emitter) {
	return emitter.map((function() {
		var sum = 0.0;
		var count = 0;
		return function(v) {
			return (sum += v) / ++count;
		};
	})());
};
thx_stream_EmitterInts.greaterThan = function(emitter,x) {
	return emitter.filter(function(v) {
		return v > x;
	});
};
thx_stream_EmitterInts.greaterThanOrEqualTo = function(emitter,x) {
	return emitter.filter(function(v) {
		return v >= x;
	});
};
thx_stream_EmitterInts.inRange = function(emitter,min,max) {
	return emitter.filter(function(v) {
		return v <= max && v >= min;
	});
};
thx_stream_EmitterInts.insideRange = function(emitter,min,max) {
	return emitter.filter(function(v) {
		return v < max && v > min;
	});
};
thx_stream_EmitterInts.lessThan = function(emitter,x) {
	return emitter.filter(function(v) {
		return v < x;
	});
};
thx_stream_EmitterInts.lessThanOrEqualTo = function(emitter,x) {
	return emitter.filter(function(v) {
		return v <= x;
	});
};
thx_stream_EmitterInts.max = function(emitter) {
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
thx_stream_EmitterInts.min = function(emitter) {
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
thx_stream_EmitterInts.sum = function(emitter) {
	return emitter.map((function() {
		var value = 0;
		return function(v) {
			return value += v;
		};
	})());
};
thx_stream_EmitterInts.toBool = function(emitter) {
	return emitter.map(function(i) {
		return i != 0;
	});
};
thx_stream_EmitterInts.unique = function(emitter) {
	return emitter.filter((function() {
		var buf = new haxe_ds_IntMap();
		return function(v) {
			if(buf.h.hasOwnProperty(v)) return false; else {
				buf.h[v] = true;
				return true;
			}
		};
	})());
};
var thx_stream_EmitterFloats = function() { };
thx_stream_EmitterFloats.__name__ = ["thx","stream","EmitterFloats"];
thx_stream_EmitterFloats.average = function(emitter) {
	return emitter.map((function() {
		var sum = 0.0;
		var count = 0;
		return function(v) {
			return (sum += v) / ++count;
		};
	})());
};
thx_stream_EmitterFloats.greaterThan = function(emitter,x) {
	return emitter.filter(function(v) {
		return v > x;
	});
};
thx_stream_EmitterFloats.greaterThanOrEqualTo = function(emitter,x) {
	return emitter.filter(function(v) {
		return v >= x;
	});
};
thx_stream_EmitterFloats.inRange = function(emitter,min,max) {
	return emitter.filter(function(v) {
		return v <= max && v >= min;
	});
};
thx_stream_EmitterFloats.insideRange = function(emitter,min,max) {
	return emitter.filter(function(v) {
		return v < max && v > min;
	});
};
thx_stream_EmitterFloats.lessThan = function(emitter,x) {
	return emitter.filter(function(v) {
		return v < x;
	});
};
thx_stream_EmitterFloats.lessThanOrEqualTo = function(emitter,x) {
	return emitter.filter(function(v) {
		return v <= x;
	});
};
thx_stream_EmitterFloats.max = function(emitter) {
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
thx_stream_EmitterFloats.min = function(emitter) {
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
thx_stream_EmitterFloats.sum = function(emitter) {
	return emitter.map((function() {
		var sum = 0.0;
		return function(v) {
			return sum += v;
		};
	})());
};
var thx_stream_EmitterOptions = function() { };
thx_stream_EmitterOptions.__name__ = ["thx","stream","EmitterOptions"];
thx_stream_EmitterOptions.either = function(emitter,some,none,end) {
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
thx_stream_EmitterOptions.filterOption = function(emitter) {
	return emitter.filter(function(opt) {
		return thx_Options.toBool(opt);
	}).map(function(opt1) {
		return thx_Options.toValue(opt1);
	});
};
thx_stream_EmitterOptions.toBool = function(emitter) {
	return emitter.map(function(opt) {
		return thx_Options.toBool(opt);
	});
};
thx_stream_EmitterOptions.toValue = function(emitter) {
	return emitter.map(function(opt) {
		return thx_Options.toValue(opt);
	});
};
var thx_stream_EmitterBools = function() { };
thx_stream_EmitterBools.__name__ = ["thx","stream","EmitterBools"];
thx_stream_EmitterBools.negate = function(emitter) {
	return emitter.map(function(v) {
		return !v;
	});
};
var thx_stream_EmitterEmitters = function() { };
thx_stream_EmitterEmitters.__name__ = ["thx","stream","EmitterEmitters"];
thx_stream_EmitterEmitters.flatMap = function(emitter) {
	return new thx_stream_Emitter(function(stream) {
		emitter.init(new thx_stream_Stream(function(r) {
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
var thx_stream_EmitterArrays = function() { };
thx_stream_EmitterArrays.__name__ = ["thx","stream","EmitterArrays"];
thx_stream_EmitterArrays.containerOf = function(emitter,value) {
	return emitter.filter(function(arr) {
		return HxOverrides.indexOf(arr,value,0) >= 0;
	});
};
thx_stream_EmitterArrays.flatten = function(emitter) {
	return new thx_stream_Emitter(function(stream) {
		emitter.init(new thx_stream_Stream(function(r) {
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
var thx_stream_EmitterValues = function() { };
thx_stream_EmitterValues.__name__ = ["thx","stream","EmitterValues"];
thx_stream_EmitterValues.left = function(emitter) {
	return emitter.map(function(v) {
		return v._0;
	});
};
thx_stream_EmitterValues.right = function(emitter) {
	return emitter.map(function(v) {
		return v._1;
	});
};
var thx_stream_IStream = function() { };
thx_stream_IStream.__name__ = ["thx","stream","IStream"];
thx_stream_IStream.prototype = {
	cancel: null
	,__class__: thx_stream_IStream
};
var thx_stream_Stream = function(subscriber) {
	this.subscriber = subscriber;
	this.cleanUps = [];
	this.finalized = false;
	this.canceled = false;
};
thx_stream_Stream.__name__ = ["thx","stream","Stream"];
thx_stream_Stream.__interfaces__ = [thx_stream_IStream];
thx_stream_Stream.prototype = {
	subscriber: null
	,cleanUps: null
	,finalized: null
	,canceled: null
	,addCleanUp: function(f) {
		this.cleanUps.push(f);
	}
	,cancel: function() {
		this.canceled = true;
		this.finalize(thx_stream_StreamValue.End(true));
	}
	,end: function() {
		this.finalize(thx_stream_StreamValue.End(false));
	}
	,pulse: function(v) {
		this.subscriber(thx_stream_StreamValue.Pulse(v));
	}
	,finalize: function(signal) {
		if(this.finalized) return;
		this.finalized = true;
		while(this.cleanUps.length > 0) (this.cleanUps.shift())();
		this.subscriber(signal);
		this.subscriber = function(_) {
		};
	}
	,__class__: thx_stream_Stream
};
var thx_stream_StreamValue = { __ename__ : ["thx","stream","StreamValue"], __constructs__ : ["Pulse","End"] };
thx_stream_StreamValue.Pulse = function(value) { var $x = ["Pulse",0,value]; $x.__enum__ = thx_stream_StreamValue; $x.toString = $estr; return $x; };
thx_stream_StreamValue.End = function(cancel) { var $x = ["End",1,cancel]; $x.__enum__ = thx_stream_StreamValue; $x.toString = $estr; return $x; };
var thx_stream_Value = function(value,equals) {
	var _g = this;
	if(null == equals) this.equals = thx_Functions.equality; else this.equals = equals;
	this.value = value;
	this.downStreams = [];
	this.upStreams = [];
	thx_stream_Emitter.call(this,function(stream) {
		_g.downStreams.push(stream);
		stream.addCleanUp(function() {
			HxOverrides.remove(_g.downStreams,stream);
		});
		stream.pulse(_g.value);
	});
};
thx_stream_Value.__name__ = ["thx","stream","Value"];
thx_stream_Value.createOption = function(value,equals) {
	var def;
	if(null == value) def = haxe_ds_Option.None; else def = haxe_ds_Option.Some(value);
	return new thx_stream_Value(def,function(a,b) {
		return thx_Options.equals(a,b,equals);
	});
};
thx_stream_Value.__super__ = thx_stream_Emitter;
thx_stream_Value.prototype = $extend(thx_stream_Emitter.prototype,{
	value: null
	,downStreams: null
	,upStreams: null
	,equals: null
	,get: function() {
		return this.value;
	}
	,clear: function() {
		this.clearEmitters();
		this.clearStreams();
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
	,set: function(value) {
		if(this.equals(this.value,value)) return;
		this.value = value;
		this.update();
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
	,__class__: thx_stream_Value
});
var thx_stream_dom_Dom = function() { };
thx_stream_dom_Dom.__name__ = ["thx","stream","dom","Dom"];
thx_stream_dom_Dom.ready = function() {
	return thx_promise__$Promise_Promise_$Impl_$.create(function(resolve,_) {
		window.document.addEventListener("DOMContentLoaded",function(_1) {
			resolve(thx_Nil.nil);
		},false);
	});
};
thx_stream_dom_Dom.streamClick = function(el,capture) {
	if(capture == null) capture = false;
	return thx_stream_dom_Dom.streamEvent(el,"click",capture);
};
thx_stream_dom_Dom.streamEvent = function(el,name,capture) {
	if(capture == null) capture = false;
	return new thx_stream_Emitter(function(stream) {
		el.addEventListener(name,$bind(stream,stream.pulse),capture);
		stream.addCleanUp(function() {
			el.removeEventListener(name,$bind(stream,stream.pulse),capture);
		});
	});
};
thx_stream_dom_Dom.streamFocus = function(el,capture) {
	if(capture == null) capture = false;
	return thx_stream_dom_Dom.streamEvent(el,"focus",capture).toTrue().merge(thx_stream_dom_Dom.streamEvent(el,"blur",capture).toFalse());
};
thx_stream_dom_Dom.streamKey = function(el,name,capture) {
	if(capture == null) capture = false;
	return new thx_stream_Emitter((function($this) {
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
thx_stream_dom_Dom.streamChecked = function(el,capture) {
	if(capture == null) capture = false;
	return thx_stream_dom_Dom.streamEvent(el,"change",capture).map(function(_) {
		return el.checked;
	});
};
thx_stream_dom_Dom.streamChange = function(el,capture) {
	if(capture == null) capture = false;
	return thx_stream_dom_Dom.streamEvent(el,"change",capture).map(function(_) {
		return el.value;
	});
};
thx_stream_dom_Dom.streamInput = function(el,capture) {
	if(capture == null) capture = false;
	return thx_stream_dom_Dom.streamEvent(el,"input",capture).map(function(_) {
		return el.value;
	});
};
thx_stream_dom_Dom.streamMouseDown = function(el,capture) {
	if(capture == null) capture = false;
	return thx_stream_dom_Dom.streamEvent(el,"mousedown",capture);
};
thx_stream_dom_Dom.streamMouseEvent = function(el,name,capture) {
	if(capture == null) capture = false;
	return thx_stream_dom_Dom.streamEvent(el,name,capture);
};
thx_stream_dom_Dom.streamMouseMove = function(el,capture) {
	if(capture == null) capture = false;
	return thx_stream_dom_Dom.streamEvent(el,"mousemove",capture);
};
thx_stream_dom_Dom.streamMouseUp = function(el,capture) {
	if(capture == null) capture = false;
	return thx_stream_dom_Dom.streamEvent(el,"mouseup",capture);
};
thx_stream_dom_Dom.subscribeAttribute = function(el,name) {
	return function(value) {
		if(null == value) el.removeAttribute(name); else el.setAttribute(name,value);
	};
};
thx_stream_dom_Dom.subscribeFocus = function(el) {
	return function(focus) {
		if(focus) el.focus(); else el.blur();
	};
};
thx_stream_dom_Dom.subscribeHTML = function(el) {
	return function(html) {
		el.innerHTML = html;
	};
};
thx_stream_dom_Dom.subscribeText = function(el,force) {
	if(force == null) force = false;
	return function(text) {
		if(el.textContent != text || force) el.textContent = text;
	};
};
thx_stream_dom_Dom.subscribeToggleAttribute = function(el,name,value) {
	if(null == value) value = el.getAttribute(name);
	return function(on) {
		if(on) el.setAttribute(name,value); else el.removeAttribute(name);
	};
};
thx_stream_dom_Dom.subscribeToggleClass = function(el,name) {
	return function(on) {
		if(on) el.classList.add(name); else el.classList.remove(name);
	};
};
thx_stream_dom_Dom.subscribeSwapClass = function(el,nameOn,nameOff) {
	return function(on) {
		if(on) {
			el.classList.add(nameOn);
			el.classList.remove(nameOff);
		} else {
			el.classList.add(nameOff);
			el.classList.remove(nameOn);
		}
	};
};
thx_stream_dom_Dom.subscribeToggleVisibility = function(el) {
	var originalDisplay = el.style.display;
	if(originalDisplay == "none") originalDisplay = "";
	return function(on) {
		if(on) el.style.display = originalDisplay; else el.style.display = "none";
	};
};
var udom_Html = function() { };
udom_Html.__name__ = ["udom","Html"];
udom_Html.parseList = function(html) {
	var el = window.document.createElement("div");
	el.innerHTML = html;
	return el.childNodes;
};
udom_Html.parseAll = function(html) {
	return udom__$Dom_H.toArray(udom_Html.parseList(StringTools.trim(html)));
};
udom_Html.parse = function(html) {
	return udom_Html.parseList(StringTools.ltrim(html))[0];
};
var udom_Query = function() { };
udom_Query.__name__ = ["udom","Query"];
udom_Query.first = function(selector,ctx) {
	return (ctx != null?ctx:udom_Query.doc).querySelector(selector);
};
udom_Query.list = function(selector,ctx) {
	return (ctx != null?ctx:udom_Query.doc).querySelectorAll(selector);
};
udom_Query.all = function(selector,ctx) {
	return udom__$Dom_H.toArray(udom_Query.list(selector,ctx));
};
udom_Query.getElementIndex = function(el) {
	var index = 0;
	while(null != (el = el.previousElementSibling)) index++;
	return index;
};
udom_Query.childOf = function(child,parent) {
	if(null != child && child.parentElement == parent) return child; else return null;
};
udom_Query.childrenOf = function(children,parent) {
	return children.filter(function(child) {
		return child.parentElement == parent;
	});
};
var udom__$Dom_H = function() { };
udom__$Dom_H.__name__ = ["udom","_Dom","H"];
udom__$Dom_H.toArray = function(list) {
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
var __map_reserved = {}

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
if(typeof(scope.performance) == "undefined") scope.performance = { };
if(typeof(scope.performance.now) == "undefined") {
	var nowOffset = new Date().getTime();
	if(scope.performance.timing && scope.performance.timing.navigationStart) nowOffset = scope.performance.timing.navigationStart;
	var now = function() {
		return new Date() - nowOffset;
	};
	scope.performance.now = now;
}
Config.icons = { add : "plus-circle", addMenu : "plus-square", remove : "ban", dropdown : "reorder", checked : "toggle-on", unchecked : "toggle-off", switchtype : "bolt", code : "bolt", value : "pencil", reference : "link", bool : "check-circle", text : "pencil", number : "superscript", date : "calendar", array : "list", object : "table"};
Config.selectors = { app : ".card"};
PropertyFeeder.classes = [{ display : "bold", name : "strong"},{ display : "italic", name : "emphasis"}];
cards_model_Runtime.pattern = new EReg("\\$\\.(.+?)\\b","");
cards_model_ref_EmptyParent.instance = new cards_model_ref_EmptyParent();
cards_model_ref_Ref.reField = new EReg("^\\.?([^.\\[]+)","");
cards_model_ref_Ref.reIndex = new EReg("^\\[(\\d+)\\]","");
cards_types_CodeTransform.datePattern = new EReg("Date\\(-?\\d+(:?\\.\\d+)?(:?e-?\\d+)?\\)","");
cards_types_CodeTransform.PATTERN = new EReg("^\\s*\\$\\.([a-z](:?(\\.|\\[\\d+\\])?[a-z0-9]*)*)\\s*$","");
cards_ui_input_AnonymousObjectEditor.defaultTypes = (function() {
	var types = [{ type : cards_model_SchemaType.StringType, description : "text"},{ type : cards_model_SchemaType.FloatType, description : "number"},{ type : cards_model_SchemaType.DateType, description : "date"},{ type : cards_model_SchemaType.CodeType, description : "code"},{ type : cards_model_SchemaType.BoolType, description : "yes/no"},{ type : cards_model_SchemaType.ObjectType([]), description : "object"}];
	types = types.concat(types.map(function(o) {
		return { type : cards_model_SchemaType.ArrayType(o.type), description : "list of " + o.description};
	}));
	return types;
})();
cards_ui_widgets_Button.sound = (function() {
	var audio = new Audio();
	audio.volume = 0.5;
	audio.src = "sound/click.mp3";
	return audio;
})();
haxe_ds_ObjectMap.count = 0;
js_Boot.__toStr = {}.toString;
thx_Ints.pattern_parse = new EReg("^[+-]?(\\d+|0x[0-9A-F]+)$","i");
thx_Ints.BASE = "0123456789abcdefghijklmnopqrstuvwxyz";
thx_Strings.UCWORDS = new EReg("[^a-zA-Z]([a-z])","g");
thx_Strings.UCWORDSWS = new EReg("\\s[a-z]","g");
thx_Strings.ALPHANUM = new EReg("^[a-z0-9]+$","i");
thx_Strings.DIGITS = new EReg("^[0-9]+$","");
thx_Strings.STRIPTAGS = new EReg("</?[a-z]+[^>]*?/?>","gi");
thx_Strings.WSG = new EReg("\\s+","g");
thx_Strings.SPLIT_LINES = new EReg("\r\n|\n\r|\n|\r","g");
thx_Timer.FRAME_RATE = Math.round(16.6666666666666679);
thx_promise__$Promise_Promise_$Impl_$.nil = thx_promise__$Promise_Promise_$Impl_$.value(thx_Nil.nil);
udom_Query.doc = document;
Main.main();
})(typeof console != "undefined" ? console : {log:function(){}});

//# sourceMappingURL=app.js.map