(function () { "use strict";
var $estr = function() { return js_Boot.__string_rec(this,''); };
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
var Main = function() { };
Main.__name__ = ["Main"];
Main.main = function() {
	thx_stream_dom_Dom.ready().success(function(_) {
		var values = new cards_properties_ValueProperties();
		var fragments = new cards_ui_fragments_FragmentProperties();
		var mapper = new cards_ui_fragments_FragmentMapper(fragments,values);
		PropertyFeeder.feedProperties(values);
		PropertyFeeder.feedFragments(fragments);
		var container = udom_Query.first(".container");
		var data = new cards_model_Data({ });
		var model = new cards_model_Model(data);
		cards_ui_Card.create(model,container,mapper);
	});
};
var IMap = function() { };
IMap.__name__ = ["IMap"];
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
	fragments.associateMany("block",["strong","emphasis","text"]);
	fragments.associateMany("readonly",["strong","emphasis","text"]);
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
	return js_Boot.__string_rec(s,"");
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
var cards_components_Component = function(options) {
	this.isAttached = false;
	this.list = [];
	this.properties = new cards_components_Properties(this);
	if(null == options.template) {
		if(null == options.el) throw "" + Std.string(this) + " needs a template"; else {
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
	var set = new thx_core_Set();
	while(cards_model_Runtime.pattern.match(code)) {
		set.add(cards_model_Runtime.pattern.matched(1));
		code = cards_model_Runtime.pattern.matchedRight();
	}
	return thx_core_Iterators.order(set.iterator(),thx_core_Strings.compare);
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
				return cards_model_RuntimeResult.Error(Std.string(e));
			}
		});
	} catch( e1 ) {
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
		if(this.fields.exists(name)) throw new thx_core_Error("Schema already contains a field \"" + name + "\"",null,{ fileName : "Schema.hx", lineNumber : 20, className : "cards.model.Schema", methodName : "add"});
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
		if(!this.fields.exists(name)) throw new thx_core_Error("Schema does not contain a field \"" + name + "\"",null,{ fileName : "Schema.hx", lineNumber : 37, className : "cards.model.Schema", methodName : "delete"});
		this.fields.remove(name);
		this.bus.pulse(cards_model_SchemaEvent.DeleteField(name));
	}
	,rename: function(oldname,newname) {
		if(!this.fields.exists(oldname)) throw new thx_core_Error("Schema does not contain a field \"" + oldname + "\"",null,{ fileName : "Schema.hx", lineNumber : 44, className : "cards.model.Schema", methodName : "rename"});
		var type = this.fields.get(oldname);
		this.fields.remove(oldname);
		this.fields.set(newname,type);
		this.bus.pulse(cards_model_SchemaEvent.RenameField(oldname,newname));
	}
	,retype: function(name,type) {
		if(!this.fields.exists(name)) throw new thx_core_Error("Schema does not contain a field \"" + name + "\"",null,{ fileName : "Schema.hx", lineNumber : 53, className : "cards.model.Schema", methodName : "retype"});
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
		thx_core_Arrays.order(thx_core_Iterators.toArray(this.items.keys()),thx_core_Ints.compare).map(function(i) {
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
				var value1 = ref = cards_model_ref_Ref.fromValue(v,_g);
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
		if(!cards_model_ref_Ref.reIndex.match(path)) throw "unable to resolve \"" + path + "\" for ArrayRef";
		var index = Std.parseInt(cards_model_ref_Ref.reIndex.matched(1));
		var rest = cards_model_ref_Ref.reIndex.matchedRight();
		var ref = this.items.get(index);
		if(null == ref) {
			var value = ref = cards_model_ref_Ref.fromPath(rest,this,terminal);
			this.items.set(index,value);
			this.inverse.set(ref,index);
		}
		return ref.resolve(rest,terminal);
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
		thx_core_Iterators.map(this.fields.keys(),function(key) {
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
		thx_core_Iterators.map(this.fields.iterator(),function(ref) {
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
		if(!cards_model_ref_Ref.reField.match(path)) throw "unable to resolve \"" + path + "\" for ObjectRef";
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
	if(null == parent) parent = cards_model_ref_EmptyParent.instance;
	if(path == "") if(terminal) return new cards_model_ref_ValueRef(parent); else return new cards_model_ref_UnknownRef(parent); else if(cards_model_ref_Ref.reField.match(path)) return new cards_model_ref_ObjectRef(parent); else if(cards_model_ref_Ref.reIndex.match(path)) return new cards_model_ref_ArrayRef(parent); else throw "invalid path \"" + path + "\"";
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
		if(path != "") throw "unable to resolve path \"" + path + "\" on ValueRef";
		return this;
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
		return Type.getClassName(Type.getClass(this)).split(".").pop();
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
		throw Type.getClassName(Type.getClass(this)).split(".").pop() + ".transform() is abstract and must be overridden";
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
		return this.stream.set(value);
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
var cards_properties__$PropertyName_PropertyName_$Impl_$ = function() { };
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
		thx_Assert.isFalse(this.map.exists(name),"ValueProperties already contains \"" + name + "\"",{ fileName : "ValueProperties.hx", lineNumber : 15, className : "cards.properties.ValueProperties", methodName : "add"});
		this.map.set(name,info);
	}
	,remove: function(name) {
		thx_Assert.isTrue(this.map.exists(name),"ValueProperties does not contain \"" + name + "\"",{ fileName : "ValueProperties.hx", lineNumber : 20, className : "cards.properties.ValueProperties", methodName : "remove"});
		this.map.remove(name);
	}
	,get: function(name) {
		thx_Assert.isTrue(this.map.exists(name),"ValueProperties does not contain \"" + name + "\"",{ fileName : "ValueProperties.hx", lineNumber : 25, className : "cards.properties.ValueProperties", methodName : "get"});
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
	thx_core_Arrays.mapi(cards_types_ArrayTransform.toArray(value),function(v,i) {
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
		return { };
	}
};
cards_types_CodeTransform.toString = function(value) {
	try {
		var t = JSON.parse(cards_types_CodeTransform.toCode(value));
		if(typeof(t) == "string") return t; else return cards_types_DynamicTransform.toString(t);
	} catch( _ ) {
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
	throw "Type of " + Std.string(value) + " cannot be matched by DynamicTransform.toArray";
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
	throw "Type of " + Std.string(value) + " cannot be matched by DynamicTransform.toBool";
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
	throw "Type of " + Std.string(value) + " cannot be matched by DynamicTransform.toDate";
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
	throw "Type of " + Std.string(value) + " cannot be matched by DynamicTransform.toFloat";
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
	throw "Type of " + Std.string(value) + " cannot be matched by DynamicTransform.toObject";
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
	throw "Type of " + Std.string(value) + " cannot be matched by DynamicTransform.toString";
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
	throw "Type of " + Std.string(value) + " cannot be matched by DynamicTransform.toCode";
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
	throw "Type of " + Std.string(value) + " cannot be matched by DynamicTransform.toReference";
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
	return !thx_core_Objects.isEmpty(cards_types_ObjectTransform.toObject(value));
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
	this.fragments = new haxe_ds_ObjectMap();
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
	,fragments: null
	,addFragment: function(fragment) {
		var focusStream = fragment.focus.withValue(true).mapValue(function(_) {
			return fragment;
		}).plug(this.fragmentStream);
		this.fragments.set(fragment,$bind(focusStream,focusStream.cancel));
	}
	,addBlock: function() {
		var fragment = new cards_ui_fragments_Block({ parent : this.component, container : this.component.el, defaultText : "block"});
		this.addFragment(fragment);
		return fragment;
	}
	,addReadonly: function() {
		var fragment = new cards_ui_fragments_ReadonlyBlock({ parent : this.component, container : this.component.el});
		this.addFragment(fragment);
		return fragment;
	}
	,removeFragment: function(fragment) {
		if(thx_core_Options.equalsValue(this.fragment.get(),fragment)) this.fragment.set(haxe_ds_Option.None);
		var finalizer = this.fragments.h[fragment.__id__];
		thx_Assert.notNull(finalizer,null,{ fileName : "Article.hx", lineNumber : 71, className : "cards.ui.Article", methodName : "removeFragment"});
		finalizer();
	}
	,__class__: cards_ui_Article
};
var cards_ui_Card = function() { };
cards_ui_Card.__name__ = ["cards","ui","Card"];
cards_ui_Card.create = function(model,container,mapper) {
	var card = new cards_components_Component({ template : "<div class=\"card\"><div class=\"doc\"></div><aside><div class=\"context\"></div><div class=\"model\"></div></aside></div>"});
	var context = udom_Query.first(".context",card.el);
	var modelView = new cards_ui_ModelView();
	var document = new cards_ui_Document({ el : udom_Query.first(".doc",card.el)});
	var context1 = new cards_ui_ContextView(document,model,modelView,mapper,{ el : udom_Query.first(".context",card.el)});
	modelView.component.appendTo(udom_Query.first(".model",card.el));
	modelView.schema.subscribe(model.schemaEventSubscriber);
	modelView.data.subscribe(model.dataEventSubscriber);
	card.appendTo(container);
	document.article.addReadonly();
	var block = document.article.addBlock();
	mapper.values.ensure("strong",block.component);
	block = document.article.addBlock();
	mapper.values.ensure("emphasis",block.component);
	block = document.article.addBlock();
	mapper.values.ensure("strong",block.component);
	mapper.values.ensure("emphasis",block.component);
	document.article.addBlock();
};
var cards_ui_widgets_FrameOverlay = function(options) {
	var _g = this;
	if(null == options.el && null == options.template) options.template = "<div class=\"frame-overlay\"></div>";
	this.component = new cards_components_Component(options);
	this.visible = new cards_properties_Visible(this.component,false);
	var clear = function(_) {
		_g.visible.stream.set(false);
	};
	this.visible.stream.filterValue(function(b) {
		return !b;
	}).subscribe(function(_1) {
		window.document.removeEventListener("mouseup",clear,false);
	});
	this.visible.stream.filterValue(function(b1) {
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
var cards_ui_widgets_Tooltip = function(options) {
	cards_ui_widgets_FrameOverlay.call(this,options);
};
cards_ui_widgets_Tooltip.__name__ = ["cards","ui","widgets","Tooltip"];
cards_ui_widgets_Tooltip.__super__ = cards_ui_widgets_FrameOverlay;
cards_ui_widgets_Tooltip.prototype = $extend(cards_ui_widgets_FrameOverlay.prototype,{
	setContent: function(html) {
		this.component.el.innerHTML = html;
	}
	,__class__: cards_ui_widgets_Tooltip
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
	if((o instanceof Array) && o.__enum__ == null) return Array; else return o.__class__;
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
				var str = o[0] + "(";
				s += "\t";
				var _g1 = 2;
				var _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) str += "," + js_Boot.__string_rec(o[i],s); else str += js_Boot.__string_rec(o[i],s);
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
				str1 += (i2 > 0?",":"") + js_Boot.__string_rec(o[i2],s);
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
		str2 += s + k + " : " + js_Boot.__string_rec(o[k],s);
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
			}
		} else return false;
		if(cl == Class && o.__name__ != null) return true;
		if(cl == Enum && o.__ename__ != null) return true;
		return o.__enum__ == cl;
	}
};
js_Boot.__cast = function(o,t) {
	if(js_Boot.__instanceof(o,t)) return o; else throw "Cannot cast " + Std.string(o) + " to " + Std.string(t);
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
var thx_stream_dom_Dom = function() { };
thx_stream_dom_Dom.__name__ = ["thx","stream","dom","Dom"];
thx_stream_dom_Dom.ready = function() {
	return thx_promise_Promise.create(function(resolve,_) {
		window.document.addEventListener("DOMContentLoaded",function(_1) {
			resolve(thx_core_Nil.nil);
		},false);
	});
};
thx_stream_dom_Dom.streamEvent = function(el,name,capture) {
	if(capture == null) capture = false;
	return thx_stream_Emitter.create(function(stream) {
		el.addEventListener(name,$bind(stream,stream.pulse),capture);
		stream.addCleanUp(function() {
			el.removeEventListener(name,$bind(stream,stream.pulse),capture);
		});
	});
};
thx_stream_dom_Dom.streamMouseEvent = function(el,name,capture) {
	if(capture == null) capture = false;
	return thx_stream_dom_Dom.streamEvent(el,name,capture);
};
thx_stream_dom_Dom.streamMouseMove = function(el,capture) {
	if(capture == null) capture = false;
	return thx_stream_dom_Dom.streamEvent(el,"mousemove",capture);
};
thx_stream_dom_Dom.streamMouseDown = function(el,capture) {
	if(capture == null) capture = false;
	return thx_stream_dom_Dom.streamEvent(el,"mousedown",capture);
};
thx_stream_dom_Dom.streamMouseUp = function(el,capture) {
	if(capture == null) capture = false;
	return thx_stream_dom_Dom.streamEvent(el,"mouseup",capture);
};
thx_stream_dom_Dom.streamKey = function(el,name,capture) {
	if(capture == null) capture = false;
	return thx_stream_Emitter.create((function($this) {
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
thx_stream_dom_Dom.streamFocus = function(el,capture) {
	if(capture == null) capture = false;
	return thx_stream_dom_Dom.streamEvent(el,"focus",capture).toTrue().merge(thx_stream_dom_Dom.streamEvent(el,"blur",capture).toFalse());
};
thx_stream_dom_Dom.streamClick = function(el,capture) {
	if(capture == null) capture = false;
	return thx_stream_dom_Dom.streamEvent(el,"click",capture);
};
thx_stream_dom_Dom.streamInput = function(el,capture) {
	if(capture == null) capture = false;
	return thx_stream_dom_Dom.streamEvent(el,"input",capture).mapValue(function(_) {
		return el.value;
	});
};
thx_stream_dom_Dom.subscribeText = function(el,force) {
	if(force == null) force = false;
	return function(text) {
		if(el.textContent != text || force) el.textContent = text;
	};
};
thx_stream_dom_Dom.subscribeHTML = function(el) {
	return function(html) {
		el.innerHTML = html;
	};
};
thx_stream_dom_Dom.subscribeFocus = function(el) {
	return function(focus) {
		if(focus) el.focus(); else el.blur();
	};
};
thx_stream_dom_Dom.subscribeAttribute = function(el,name) {
	return function(value) {
		if(null == value) el.removeAttribute(name); else el.setAttribute(name,value);
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
thx_stream_dom_Dom.subscribeToggleVisibility = function(el) {
	var originalDisplay = el.style.display;
	if(originalDisplay == "none") originalDisplay = "";
	return function(on) {
		if(on) el.style.display = originalDisplay; else el.style.display = "none";
	};
};
var thx_stream_Emitter = function(init) {
	this.init = init;
};
thx_stream_Emitter.__name__ = ["thx","stream","Emitter"];
thx_stream_Emitter.create = function(init) {
	return new thx_stream_Emitter(init);
};
thx_stream_Emitter.prototype = {
	init: null
	,sign: function(subscriber) {
		var stream = new thx_stream_Stream(subscriber);
		this.init(stream);
		return stream;
	}
	,subscribe: function(pulse,fail,end) {
		if(null != pulse) pulse = pulse; else pulse = function(_) {
		};
		if(null != fail) fail = fail; else fail = function(_1) {
		};
		if(null != end) end = end; else end = function(_2) {
		};
		var stream = new thx_stream_Stream(function(r) {
			switch(r[1]) {
			case 0:
				var v = r[2];
				pulse(v);
				break;
			case 2:
				var e = r[2];
				fail(e);
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
	,feed: function(value) {
		var stream = new thx_stream_Stream(null);
		stream.subscriber = function(r) {
			switch(r[1]) {
			case 0:
				var v = r[2];
				value.set(v);
				break;
			case 2:
				var e = r[2];
				stream.fail(e);
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
	,delay: function(time) {
		var _g = this;
		return new thx_stream_Emitter(function(stream) {
			var id = setTimeout(function() {
				_g.init(stream);
			},time);
			stream.addCleanUp((function(f,id1) {
				return function() {
					return f(id1);
				};
			})(thx_core_Timer.clear,id));
		});
	}
	,debounce: function(delay) {
		var _g = this;
		return new thx_stream_Emitter(function(stream) {
			var id = null;
			stream.addCleanUp(function() {
				clearTimeout(id);
			});
			_g.init(new thx_stream_Stream(function(r) {
				switch(r[1]) {
				case 0:
					var v = r[2];
					clearTimeout(id);
					id = thx_core_Timer.delay((function(f,v1) {
						return function() {
							return f(v1);
						};
					})($bind(stream,stream.pulse),v),delay);
					break;
				case 2:
					var e = r[2];
					stream.fail(e);
					break;
				case 1:
					switch(r[2]) {
					case true:
						stream.cancel();
						break;
					case false:
						setTimeout($bind(stream,stream.end),delay);
						break;
					}
					break;
				}
			}));
		});
	}
	,map: function(f) {
		var _g = this;
		return new thx_stream_Emitter(function(stream) {
			_g.init(new thx_stream_Stream(function(r) {
				switch(r[1]) {
				case 0:
					var v = r[2];
					f(v).either(function(vout) {
						stream.pulse(vout);
					},function(err) {
						stream.fail(err);
					});
					break;
				case 2:
					var e = r[2];
					stream.fail(e);
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
	,mapValue: function(f) {
		return this.map(function(v) {
			return thx_promise_Promise.value(f(v));
		});
	}
	,takeUntil: function(f) {
		var _g = this;
		return new thx_stream_Emitter(function(stream) {
			var instream = null;
			instream = new thx_stream_Stream(function(r) {
				switch(r[1]) {
				case 0:
					var v = r[2];
					f(v).either(function(c) {
						if(c) stream.pulse(v); else {
							instream.end();
							stream.end();
						}
					},$bind(stream,stream.fail));
					break;
				case 2:
					var e = r[2];
					instream.fail(e);
					stream.fail(e);
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
	,take: function(count) {
		return this.takeUntil((function($this) {
			var $r;
			var counter = 0;
			$r = function(_) {
				return thx_promise_Promise.value(counter++ < count);
			};
			return $r;
		}(this)));
	}
	,audit: function(handler) {
		return this.mapValue(function(v) {
			handler(v);
			return v;
		});
	}
	,filter: function(f) {
		var _g = this;
		return new thx_stream_Emitter(function(stream) {
			_g.init(new thx_stream_Stream(function(r) {
				switch(r[1]) {
				case 0:
					var v = r[2];
					f(v).either(function(c) {
						if(c) stream.pulse(v);
					},function(err) {
						stream.fail(err);
					});
					break;
				case 2:
					var e = r[2];
					stream.fail(e);
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
	,filterValue: function(f) {
		return this.filter(function(v) {
			return thx_promise_Promise.value(f(v));
		});
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
				case 2:
					var e = r[2];
					stream.fail(e);
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
	,merge: function(other) {
		var _g = this;
		return new thx_stream_Emitter(function(stream) {
			_g.init(stream);
			other.init(stream);
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
				case 2:
					var e = r[2];
					stream.fail(e);
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
		return this.mapValue(function(v) {
			if(null == v) return haxe_ds_Option.None; else return haxe_ds_Option.Some(v);
		});
	}
	,toNil: function() {
		return this.mapValue(function(_) {
			return thx_core_Nil.nil;
		});
	}
	,toTrue: function() {
		return this.mapValue(function(_) {
			return true;
		});
	}
	,toFalse: function() {
		return this.mapValue(function(_) {
			return false;
		});
	}
	,toValue: function(value) {
		return this.mapValue(function(_) {
			return value;
		});
	}
	,log: function(prefix,posInfo) {
		if(prefix == null) prefix = ""; else prefix = "" + prefix + ": ";
		return this.mapValue(function(v) {
			haxe_Log.trace("" + prefix + Std.string(v),posInfo);
			return v;
		});
	}
	,withValue: function(expected) {
		return this.filterValue(null == expected?function(v) {
			return v != null;
		}:function(v1) {
			return v1 == expected;
		});
	}
	,distinct: function(equals) {
		var _g = this;
		return new thx_stream_Emitter(function(stream) {
			if(null == equals) equals = function(a,b) {
				return a == b;
			};
			var last = null;
			_g.init(new thx_stream_Stream(function(r) {
				switch(r[1]) {
				case 0:
					var v = r[2];
					if(equals(v,last)) return;
					last = v;
					stream.pulse(v);
					break;
				case 2:
					var e = r[2];
					stream.fail(e);
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
				case 2:
					var e = r[2];
					stream.fail(e);
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
				case 2:
					var e1 = r1[2];
					stream.fail(e1);
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
				case 2:
					var e = r[2];
					stream.fail(e);
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
				case 2:
					var e1 = r1[2];
					stream.fail(e1);
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
				case 2:
					var e = r[2];
					stream.fail(e);
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
				case 2:
					var e1 = r1[2];
					stream.fail(e1);
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
				case 2:
					var e = r[2];
					stream.fail(e);
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
				case 2:
					var e = r[2];
					stream.fail(e);
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
	,__class__: thx_stream_Emitter
};
var thx_stream_Value = function(value) {
	var _g = this;
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
thx_stream_Value.__super__ = thx_stream_Emitter;
thx_stream_Value.prototype = $extend(thx_stream_Emitter.prototype,{
	value: null
	,downStreams: null
	,upStreams: null
	,get: function() {
		return this.value;
	}
	,set: function(value) {
		if(this.value == value) return;
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
	,__class__: thx_stream_Value
});
var haxe_ds_Option = { __ename__ : ["haxe","ds","Option"], __constructs__ : ["Some","None"] };
haxe_ds_Option.Some = function(v) { var $x = ["Some",0,v]; $x.__enum__ = haxe_ds_Option; $x.toString = $estr; return $x; };
haxe_ds_Option.None = ["None",1];
haxe_ds_Option.None.toString = $estr;
haxe_ds_Option.None.__enum__ = haxe_ds_Option;
var thx_stream_EmitterOptions = function() { };
thx_stream_EmitterOptions.__name__ = ["thx","stream","EmitterOptions"];
thx_stream_EmitterOptions.filterOption = function(emitter) {
	return emitter.filterValue(function(opt) {
		return thx_core_Options.toBool(opt);
	}).mapValue(function(opt1) {
		return thx_core_Options.toValue(opt1);
	});
};
thx_stream_EmitterOptions.toValue = function(emitter) {
	return emitter.mapValue(function(opt) {
		return thx_core_Options.toValue(opt);
	});
};
thx_stream_EmitterOptions.toBool = function(emitter) {
	return emitter.mapValue(function(opt) {
		return thx_core_Options.toBool(opt);
	});
};
thx_stream_EmitterOptions.either = function(emitter,some,none,fail,end) {
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
			none;
			break;
		}
	},fail,end);
};
var thx_core_Options = function() { };
thx_core_Options.__name__ = ["thx","core","Options"];
thx_core_Options.toValue = function(option) {
	switch(option[1]) {
	case 1:
		return null;
	case 0:
		var v = option[2];
		return v;
	}
};
thx_core_Options.toBool = function(option) {
	switch(option[1]) {
	case 1:
		return false;
	case 0:
		return true;
	}
};
thx_core_Options.toOption = function(value) {
	if(null == value) return haxe_ds_Option.None; else return haxe_ds_Option.Some(value);
};
thx_core_Options.equals = function(a,b,eq) {
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
thx_core_Options.equalsValue = function(a,b,eq) {
	return thx_core_Options.equals(a,thx_core_Options.toOption(b));
};
var cards_ui_ContextField = function(options) {
	var _g = this;
	if(null == options.template && null == options.el) options.template = "<div class=\"field\"><div class=\"key-container\"><div class=\"key\"></div></div><div class=\"value-container\"></div></div>";
	this.component = new cards_components_Component(options);
	var key = udom_Query.first(".key",this.component.el);
	key.textContent = options.display;
	this.name = options.name;
	this.type = options.type;
	this.currentType = new thx_stream_Value(options.type);
	this.focus = new thx_stream_Value(false);
	this.active = new thx_stream_Value(false);
	this.withError = new thx_stream_Value(haxe_ds_Option.None);
	var wireRuntime = function(editor,convert) {
		var runtime = editor.value.mapValue(convert);
		runtime.distinct(function(a,b) {
			return b != null && thx_core_Arrays.same(a.dependencies,b.dependencies);
		}).subscribe(function(res) {
			options.model.changes.subscribe(function(path) {
				if(thx_core_Arrays.contains(res.dependencies,path,function(a1,b1) {
					return StringTools.startsWith(b1,a1);
				})) options.value.runtime.set(haxe_ds_Option.Some(convert(editor.value.get())));
			});
		});
		runtime.toOption().feed(options.value.runtime);
		runtime.mapValue(function(res1) {
			return cards_model_Expressions.toErrorOption(res1.expression);
		}).merge(options.value.runtimeError).feed(_g.withError);
	};
	var bus = new thx_stream_Bus();
	this.fieldValue = new cards_ui_FieldValue(this.component,udom_Query.first(".value-container",this.component.el),function(type,editor1) {
		editor1.focus.feed(_g.focus);
		_g.currentType.set(type);
		switch(type[1]) {
		case 6:
			wireRuntime(editor1,function(value) {
				return cards_model_Runtime.toRuntime(value,options.model);
			});
			break;
		case 7:
			wireRuntime(editor1,function(value1) {
				return cards_model_Runtime.toRuntime(cards_types_ReferenceTransform.toCode(value1),options.model);
			});
			bus.subscribe(function(value2) {
				var path1 = editor1.value.get();
				options.modelView.setField(path1,value2,options.type);
			});
			options.value.stream.plug(bus);
			break;
		default:
			options.value.runtime.set(haxe_ds_Option.None);
			editor1.value.feed(options.value.stream);
			options.value.stream.feed(editor1.value);
		}
	},function(type1,editor2) {
		switch(type1[1]) {
		case 6:
			break;
		case 7:
			haxe_Log.trace("cancelling",{ fileName : "ContextField.hx", lineNumber : 109, className : "cards.ui.ContextField", methodName : "new"});
			bus.emit(thx_stream_StreamValue.End(true));
			break;
		default:
		}
	});
	var runtime1 = thx_core_Options.toValue(options.value.runtime.get());
	if(null == runtime1) this.fieldValue.setEditor(options.type,options.value.stream.get()); else {
		var reference = cards_types_CodeTransform.toReference(runtime1.code);
		if(null != reference && "" != reference) this.fieldValue.setEditor(cards_model_SchemaType.ReferenceType,cards_types_CodeTransform.toReference(runtime1.code)); else this.fieldValue.setEditor(cards_model_SchemaType.CodeType,runtime1.code);
	}
	this.active.subscribe(thx_stream_dom_Dom.subscribeToggleClass(this.component.el,"active"));
	var clickKeyStream = thx_stream_dom_Dom.streamEvent(key,"click",false).subscribe(function(_) {
		if(null != _g.fieldValue.editor) _g.fieldValue.editor.focus.set(true);
	});
	thx_stream_EmitterOptions.toBool(this.withError).subscribe(thx_stream_dom_Dom.subscribeToggleClass(this.component.el,"error"));
	thx_stream_EmitterOptions.either(this.withError,function(err) {
		cards_ui_ContextField.tooltip.setContent(err);
		cards_ui_ContextField.tooltip.anchorTo(_g.component.el,cards_ui_widgets_AnchorPoint.Top,cards_ui_widgets_AnchorPoint.Bottom);
		cards_ui_ContextField.tooltip.visible.stream.set(true);
	},function() {
		if(cards_ui_ContextField.tooltip.anchorElement == _g.component.el) cards_ui_ContextField.tooltip.visible.stream.set(false);
	});
};
cards_ui_ContextField.__name__ = ["cards","ui","ContextField"];
cards_ui_ContextField.prototype = {
	component: null
	,focus: null
	,active: null
	,name: null
	,withError: null
	,fieldValue: null
	,type: null
	,currentType: null
	,destroy: function() {
		this.component.destroy();
		this.focus = null;
	}
	,__class__: cards_ui_ContextField
};
var cards_ui_ContextView = function(document,model,modelView,mapper,options) {
	var _g = this;
	this.document = document;
	this.model = model;
	this.modelView = modelView;
	this.mapper = mapper;
	this.component = new cards_components_Component(options);
	this.toolbar = new cards_ui_widgets_Toolbar({ parent : this.component, container : this.component.el});
	this.el = udom_Html.parseList(StringTools.ltrim("<div class=\"fields\"><div></div></div>"))[0];
	this.component.el.appendChild(this.el);
	this.el = udom_Query.first("div",this.el);
	this.button = { add : this.toolbar.left.addButton("add property",Config.icons.dropdown), toValue : this.toolbar.right.addButton("",Config.icons.value), toCode : this.toolbar.right.addButton("",Config.icons.code), toReference : this.toolbar.right.addButton("",Config.icons.reference), remove : this.toolbar.right.addButton("",Config.icons.remove)};
	this.menu = { add : new cards_ui_widgets_Menu({ parent : this.component})};
	this.menu.add.anchorTo(this.button.add.component.el);
	this.button.add.clicks.toTrue().feed(this.menu.add.visible.stream);
	this.button.add.enabled.set(false);
	this.button.remove.clicks.subscribe(function(_) {
		var field = thx_core_Options.toValue(_g.field.get());
		var fragment = thx_core_Options.toValue(document.article.fragment.get());
		fragment.component.properties.get(field.name).dispose();
		field.destroy();
		_g.setAddMenuItems(fragment);
	});
	this.button.toValue.clicks.subscribe(function(_1) {
		var field1 = thx_core_Options.toValue(_g.field.get());
		var type = field1.fieldValue.type;
		field1.fieldValue.setEditor(field1.type);
	});
	this.button.toCode.clicks.subscribe(function(_2) {
		var field2 = thx_core_Options.toValue(_g.field.get());
		var type1 = field2.fieldValue.type;
		field2.fieldValue.setEditor(cards_model_SchemaType.CodeType);
	});
	this.button.toReference.clicks.subscribe(function(_3) {
		var field3 = thx_core_Options.toValue(_g.field.get());
		var type2 = field3.fieldValue.type;
		field3.fieldValue.setEditor(cards_model_SchemaType.ReferenceType);
	});
	this.field = new thx_stream_Value(haxe_ds_Option.None);
	var delayed = this.field.debounce(10);
	thx_stream_EmitterOptions.toBool(delayed).feed(this.button.remove.enabled);
	thx_stream_EmitterEmitters.flatMap(thx_stream_EmitterOptions.filterOption(this.field).mapValue(function(v) {
		return v.currentType;
	})).subscribe(function(type3) {
		switch(type3[1]) {
		case 6:
			_g.button.toCode.enabled.set(false);
			_g.button.toReference.enabled.set(true);
			_g.button.toValue.enabled.set(true);
			break;
		case 7:
			_g.button.toCode.enabled.set(true);
			_g.button.toReference.enabled.set(false);
			_g.button.toValue.enabled.set(true);
			break;
		default:
			_g.button.toCode.enabled.set(true);
			_g.button.toReference.enabled.set(true);
			_g.button.toValue.enabled.set(false);
		}
	});
	var filtered = thx_stream_EmitterOptions.filterOption(this.field);
	filtered.previous().subscribe(function(field4) {
		field4.active.set(false);
	});
	filtered.subscribe(function(field5) {
		field5.active.set(true);
	});
	thx_stream_EmitterOptions.either(document.article.fragment,$bind(this,this.setFragmentStatus),$bind(this,this.resetFragmentStatus));
};
cards_ui_ContextView.__name__ = ["cards","ui","ContextView"];
cards_ui_ContextView.prototype = {
	component: null
	,toolbar: null
	,document: null
	,field: null
	,model: null
	,modelView: null
	,el: null
	,button: null
	,menu: null
	,mapper: null
	,resetFragmentStatus: function() {
		this.resetFields();
		this.resetAddMenuItems();
	}
	,setFragmentStatus: function(fragment) {
		this.setFields(fragment);
		this.setAddMenuItems(fragment);
	}
	,resetFields: function() {
		this.el.innerHTML = "";
	}
	,setFields: function(fragment) {
		var _g = this;
		this.resetFields();
		this.mapper.getAttachedPropertiesForFragment(fragment).map(function(info) {
			var value;
			value = js_Boot.__cast(fragment.component.properties.get(info.name) , cards_properties_ValueProperty);
			_g.addField(info,value);
		});
	}
	,addField: function(info,value) {
		var f = new cards_ui_ContextField({ container : this.el, parent : this.component, display : info.display, name : info.name, type : info.type, value : value, model : this.model, modelView : this.modelView});
		f.focus.withValue(true).mapValue(function(_) {
			return haxe_ds_Option.Some(f);
		}).feed(this.field);
	}
	,resetAddMenuItems: function() {
		this.button.remove.enabled.set(false);
		this.button.toValue.enabled.set(false);
		this.button.toCode.enabled.set(false);
		this.button.toReference.enabled.set(false);
		this.button.add.enabled.set(false);
		this.menu.add.clear();
	}
	,setAddMenuItems: function(fragment) {
		var _g = this;
		this.resetAddMenuItems();
		var attachables = this.mapper.getAttachablePropertiesForFragment(fragment);
		this.button.add.enabled.set(attachables.length > 0);
		attachables.map(function(info) {
			var button = new cards_ui_widgets_Button("add " + info.display);
			_g.menu.add.addItem(button.component);
			button.clicks.subscribe(function(_) {
				_g.mapper.values.ensure(info.name,fragment.component);
				_g.setFragmentStatus(fragment);
			});
		});
	}
	,__class__: cards_ui_ContextView
};
var cards_ui_Document = function(options) {
	var _g = this;
	this.component = new cards_components_Component(options);
	this.toolbar = new cards_ui_widgets_Toolbar({ parent : this.component, container : this.component.el});
	this.article = new cards_ui_Article({ parent : this.component, container : this.component.el});
	this.statusbar = new cards_ui_widgets_Statusbar({ parent : this.component, container : this.component.el});
	var buttonRemove = this.toolbar.right.addButton("",Config.icons.remove);
	thx_stream_EmitterOptions.toBool(this.article.fragment).feed(buttonRemove.enabled);
	var buttonAdd = this.toolbar.left.addButton("",Config.icons.add);
	buttonAdd.clicks.subscribe(function(_) {
		_g.article.addBlock();
	});
	buttonRemove.enabled.set(false);
	buttonRemove.clicks.subscribe(function(_1) {
		thx_core_Options.toValue(_g.article.fragment.get()).component.destroy();
		_g.article.fragment.set(haxe_ds_Option.None);
	});
};
cards_ui_Document.__name__ = ["cards","ui","Document"];
cards_ui_Document.prototype = {
	component: null
	,toolbar: null
	,article: null
	,statusbar: null
	,__class__: cards_ui_Document
};
var cards_ui_FieldValue = function(parent,container,afterCreate,afterRemove) {
	this.parent = parent;
	this.container = container;
	this.afterCreate = afterCreate;
	this.afterRemove = afterRemove;
};
cards_ui_FieldValue.__name__ = ["cards","ui","FieldValue"];
cards_ui_FieldValue.prototype = {
	type: null
	,editor: null
	,parent: null
	,container: null
	,afterCreate: null
	,afterRemove: null
	,setEditor: function(type,value) {
		if(null != this.editor) {
			if(null == value) value = (cards_types_TypeTransform.transform(this.type,type))(this.editor.value.get());
			this.afterRemove(this.type,this.editor);
			this.container.innerHTML = "";
		}
		this.type = type;
		this.editor = cards_ui_editors_EditorPicker.pick(type,this.container,this.parent,value);
		this.editor.component.el.classList.add("value");
		this.afterCreate(this.type,this.editor);
	}
	,__class__: cards_ui_FieldValue
};
var cards_ui_ModelView = function() {
	var _g = this;
	this.component = new cards_components_Component({ template : "<div class=\"modelview\"></div>"});
	this.toolbar = new cards_ui_widgets_Toolbar({ });
	this.toolbar.component.appendTo(this.component.el);
	var buttonAdd = this.toolbar.left.addButton("",Config.icons.add);
	buttonAdd.clicks.subscribe(function(_) {
		_g.addField(_g.guessFieldName(),cards_model_SchemaType.StringType);
	});
	var buttonRemove = this.toolbar.right.addButton("",Config.icons.remove);
	buttonRemove.clicks.subscribe(function(_1) {
		_g.removeField(_g.currentField);
	});
	buttonRemove.enabled.set(false);
	this.pairs = udom_Html.parseList(StringTools.ltrim("<div class=\"fields\"><div></div></div>"))[0];
	this.component.el.appendChild(this.pairs);
	this.pairs = udom_Query.first("div",this.pairs);
	this.schema = this.schemaBus = new thx_stream_Bus();
	this.data = this.dataBus = new thx_stream_Bus();
	this.fields = new haxe_ds_StringMap();
	this.fieldFocus = new thx_stream_Bus();
	this.fieldFocus.subscribe(function(field) {
		_g.currentField = field;
		buttonRemove.enabled.set(null != field);
	});
};
cards_ui_ModelView.__name__ = ["cards","ui","ModelView"];
cards_ui_ModelView.prototype = {
	component: null
	,schema: null
	,data: null
	,toolbar: null
	,currentField: null
	,pairs: null
	,schemaBus: null
	,dataBus: null
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
		thx_Assert.notNull(field,"when removing a field it should not be null",{ fileName : "ModelView.hx", lineNumber : 80, className : "cards.ui.ModelView", methodName : "removeField"});
		var name = field.key.value.get();
		field.destroy();
		if(this.fields.remove(name)) this.schemaBus.pulse(cards_model_SchemaEvent.DeleteField(name));
	}
	,setField: function(path,value,type) {
		if(path == "" || path == null) return;
		var field = this.fields.get(path);
		if(null == field) field = this.addField(path,type);
		field.value.value.set((cards_types_TypeTransform.transform(type,field.value.type))(value));
	}
	,addField: function(name,type) {
		var _g = this;
		var field = new cards_ui_ModelViewField({ container : this.pairs, parent : this.component, key : name});
		var oldname = null;
		var createSetValue = function() {
			return cards_model_DataEvent.SetValue(field.key.value.get(),field.value.value.get(),field.value.type);
		};
		field.key.value.filterValue(function(newname) {
			if(_g.fields.exists(newname)) {
				field.key.value.set(oldname);
				return false;
			} else return true;
		}).mapValue(function(newname1) {
			if(null == oldname) {
				oldname = newname1;
				return cards_model_SchemaEvent.AddField(newname1,field.value.type);
			} else {
				var v = _g.fields.get(oldname);
				_g.fields.remove(oldname);
				_g.fields.set(newname1,v);
				var r = cards_model_SchemaEvent.RenameField(oldname,newname1);
				oldname = newname1;
				return r;
			}
		}).plug(this.schemaBus);
		field.value.value.mapValue(function(_) {
			return createSetValue();
		}).debounce(250).plug(this.dataBus);
		field.focus.mapValue(function(v1) {
			if(v1) return field; else return null;
		}).plug(this.fieldFocus);
		this.fields.set(name,field);
		return field;
	}
	,__class__: cards_ui_ModelView
};
var cards_ui_ModelViewField = function(options) {
	if(null == options.template && null == options.el) options.template = "<div class=\"field\"><div class=\"key-container\"><div class=\"key\"></div></div><div class=\"value-container\"><div class=\"value\"></div></div></div>";
	this.component = new cards_components_Component(options);
	this.key = new cards_ui_editors_TextEditor({ el : udom_Query.first(".key",this.component.el), parent : this.component, defaultText : options.key, placeHolder : "key"});
	this.value = new cards_ui_editors_TextEditor({ el : udom_Query.first(".value",this.component.el), parent : this.component, defaultText : "", placeHolder : "value"});
	var f = this.key.focus.merge(this.value.focus);
	this.focus = f.debounce(250).distinct();
	this.classActive = new cards_properties_ToggleClass(this.component,"active");
	f.feed(this.classActive.stream);
};
cards_ui_ModelViewField.__name__ = ["cards","ui","ModelViewField"];
cards_ui_ModelViewField.prototype = {
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
	,__class__: cards_ui_ModelViewField
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
var cards_ui_editors_BoolEditor = function(options) {
	var _g = this;
	this.type = cards_model_SchemaType.BoolType;
	if(null == options.defaultValue) options.defaultValue = false;
	if(null == options.el && null == options.template) options.template = "<div></div>";
	this.component = new cards_components_Component(options);
	var cls = this.component.el.classList;
	cls.add("fa");
	cls.add("editor");
	cls.add("bool");
	cls.add("fa-" + Config.icons.unchecked);
	this.component.el.setAttribute("tabindex","0");
	this.value = new thx_stream_Value(options.defaultValue);
	this.value.subscribe(thx_stream_dom_Dom.subscribeToggleClass(this.component.el,"fa-" + Config.icons.checked));
	thx_stream_EmitterBools.negate(this.value).subscribe(thx_stream_dom_Dom.subscribeToggleClass(this.component.el,"fa-" + Config.icons.unchecked));
	var clickStream = thx_stream_dom_Dom.streamEvent(this.component.el,"click",false).toNil().merge(thx_stream_dom_Dom.streamKey(this.component.el,"up").filterValue(function(e) {
		var _g1 = e.keyCode;
		switch(_g1) {
		case 32:case 13:
			return true;
		default:
			return false;
		}
	}).toNil()).mapValue(function(_) {
		return !_g.value.get();
	}).feed(this.value);
	this.focus = new thx_stream_Value(false);
	this.focus.withValue(true).subscribe(thx_stream_dom_Dom.subscribeFocus(this.component.el));
	var focusStream = thx_stream_dom_Dom.streamEvent(this.component.el,"focus").toTrue().merge(thx_stream_dom_Dom.streamEvent(this.component.el,"blur").toFalse()).feed(this.focus);
	this.cancel = function() {
		clickStream.cancel();
		focusStream.cancel();
	};
};
cards_ui_editors_BoolEditor.__name__ = ["cards","ui","editors","BoolEditor"];
cards_ui_editors_BoolEditor.__interfaces__ = [cards_ui_editors_Editor];
cards_ui_editors_BoolEditor.prototype = {
	component: null
	,focus: null
	,value: null
	,type: null
	,cancel: null
	,destroy: function() {
		this.cancel();
		this.component.destroy();
		this.value.clear();
	}
	,__class__: cards_ui_editors_BoolEditor
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
	this.component.el.setAttribute("tabindex","0");
	this.component.el.setAttribute("contenteditable","true");
	this.component.el.setAttribute("placeholder",options.placeHolder);
	this.component.el.style.content = options.placeHolder;
	var text = new cards_properties_Text(this.component,options.defaultText);
	this.value = text.stream;
	options.inputEvent(this.component).mapValue(function(_) {
		return text.component.el.textContent;
	}).feed(this.value);
	this.focus = new thx_stream_Value(false);
	this.focus.withValue(true).subscribe(thx_stream_dom_Dom.subscribeFocus(this.component.el));
	var focusStream = this.focus.withValue(true).subscribe(function(_1) {
		window.document.getSelection().selectAllChildren(_g.component.el);
	});
	thx_stream_dom_Dom.streamFocus(this.component.el).feed(this.focus);
	this.cancel = function() {
		text.dispose();
		focusStream.cancel();
	};
	var empty = new thx_stream_Value(options.defaultText == "");
	thx_stream_dom_Dom.streamEvent(this.component.el,"input").mapValue(function(_2) {
		return text.component.el.textContent == "";
	}).merge(this.value.mapValue(function(t) {
		return t == "";
	})).feed(empty);
	empty.subscribe(thx_stream_dom_Dom.subscribeToggleClass(this.component.el,"empty"));
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
var cards_ui_editors_CodeEditor = function(options) {
	if(null == options.inputEvent) options.inputEvent = function(component) {
		return thx_stream_dom_Dom.streamEvent(component.el,"blur");
	};
	cards_ui_editors_TextEditor.call(this,options);
	this.component.el.classList.add("code");
};
cards_ui_editors_CodeEditor.__name__ = ["cards","ui","editors","CodeEditor"];
cards_ui_editors_CodeEditor.__super__ = cards_ui_editors_TextEditor;
cards_ui_editors_CodeEditor.prototype = $extend(cards_ui_editors_TextEditor.prototype,{
	__class__: cards_ui_editors_CodeEditor
});
var cards_ui_editors_DateEditor = function(options) {
	this.type = cards_model_SchemaType.BoolType;
	if(null == options.defaultValue) options.defaultValue = new Date();
	if(null == options.template) options.template = "<input type=\"date\"/>";
	this.component = new cards_components_Component(options);
	var cls = this.component.el.classList;
	cls.add("editor");
	cls.add("date");
	this.component.el.setAttribute("tabindex","0");
	this.value = new thx_stream_Value(options.defaultValue);
	this.focus = new thx_stream_Value(false);
	this.focus.withValue(true).subscribe(thx_stream_dom_Dom.subscribeFocus(this.component.el));
	var focusStream = thx_stream_dom_Dom.streamFocus(this.component.el).feed(this.focus);
	var input = this.component.el;
	thx_stream_dom_Dom.streamInput(input,null).mapValue(function(_) {
		return input.valueAsDate;
	}).feed(this.value);
	this.cancel = function() {
		focusStream.cancel();
	};
};
cards_ui_editors_DateEditor.__name__ = ["cards","ui","editors","DateEditor"];
cards_ui_editors_DateEditor.__interfaces__ = [cards_ui_editors_Editor];
cards_ui_editors_DateEditor.prototype = {
	component: null
	,focus: null
	,value: null
	,type: null
	,cancel: null
	,destroy: function() {
		this.cancel();
		this.component.destroy();
		this.value.clear();
	}
	,__class__: cards_ui_editors_DateEditor
};
var cards_ui_editors_EditorPicker = function() { };
cards_ui_editors_EditorPicker.__name__ = ["cards","ui","editors","EditorPicker"];
cards_ui_editors_EditorPicker.pick = function(type,el,parent,value) {
	switch(type[1]) {
	case 1:
		return new cards_ui_editors_BoolEditor({ container : el, parent : parent, defaultValue : value});
	case 6:
		return new cards_ui_editors_CodeEditor({ container : el, parent : parent, defaultText : value, placeHolder : "code"});
	case 7:
		return new cards_ui_editors_ReferenceEditor({ container : el, parent : parent, defaultText : value, placeHolder : "reference"});
	case 5:
		return new cards_ui_editors_TextEditor({ container : el, parent : parent, defaultText : value, placeHolder : "content"});
	case 2:
		return new cards_ui_editors_DateEditor({ container : el, parent : parent, defaultValue : value});
	case 3:
		return new cards_ui_editors_FloatEditor({ container : el, parent : parent, defaultValue : value});
	default:
		throw "Editor for " + Std.string(type) + " has not been implemented yet";
	}
};
var cards_ui_editors_FloatEditor = function(options) {
	var _g = this;
	this.type = cards_model_SchemaType.BoolType;
	if(null == options.defaultValue) options.defaultValue = 0.0;
	if(null == options.template) options.template = "<input type=\"number\"/>";
	this.component = new cards_components_Component(options);
	var cls = this.component.el.classList;
	cls.add("editor");
	cls.add("float");
	this.component.el.setAttribute("tabindex","0");
	this.value = new thx_stream_Value(options.defaultValue);
	this.focus = new thx_stream_Value(false);
	this.focus.withValue(true).subscribe(thx_stream_dom_Dom.subscribeFocus(this.component.el));
	var focusStream = thx_stream_dom_Dom.streamFocus(this.component.el).feed(this.focus);
	thx_stream_dom_Dom.streamEvent(this.component.el,"input").mapValue(function(_) {
		return _g.component.el.valueAsNumber;
	}).feed(this.value);
	this.cancel = function() {
		focusStream.cancel();
	};
};
cards_ui_editors_FloatEditor.__name__ = ["cards","ui","editors","FloatEditor"];
cards_ui_editors_FloatEditor.__interfaces__ = [cards_ui_editors_Editor];
cards_ui_editors_FloatEditor.prototype = {
	component: null
	,focus: null
	,value: null
	,type: null
	,cancel: null
	,destroy: function() {
		this.cancel();
		this.component.destroy();
		this.value.clear();
	}
	,__class__: cards_ui_editors_FloatEditor
};
var cards_ui_editors_ReferenceEditor = function(options) {
	if(null == options.inputEvent) options.inputEvent = function(component) {
		return thx_stream_dom_Dom.streamEvent(component.el,"blur");
	};
	cards_ui_editors_TextEditor.call(this,options);
	this.component.el.classList.add("reference");
};
cards_ui_editors_ReferenceEditor.__name__ = ["cards","ui","editors","ReferenceEditor"];
cards_ui_editors_ReferenceEditor.__super__ = cards_ui_editors_TextEditor;
cards_ui_editors_ReferenceEditor.prototype = $extend(cards_ui_editors_TextEditor.prototype,{
	__class__: cards_ui_editors_ReferenceEditor
});
var cards_ui_fragments_Fragment = function() { };
cards_ui_fragments_Fragment.__name__ = ["cards","ui","fragments","Fragment"];
cards_ui_fragments_Fragment.prototype = {
	name: null
	,component: null
	,focus: null
	,active: null
	,uid: null
	,toString: null
	,__class__: cards_ui_fragments_Fragment
};
var cards_ui_fragments_Block = function(options) {
	this.name = "block";
	if(null == options.el && null == options.template) options.template = "<section class=\"block\"></div>";
	if(null != options.uid) this.uid = options.uid; else this.uid = thx_core_UUID.create();
	if(null == options.placeHolder) options.placeHolder = "block content";
	this.editor = new cards_ui_editors_TextEditor(options);
	this.active = new thx_stream_Value(false);
	this.active.feed(new cards_properties_ToggleClass(this.editor.component,"active").stream);
	this.focus = this.editor.focus;
	this.component = this.editor.component;
};
cards_ui_fragments_Block.__name__ = ["cards","ui","fragments","Block"];
cards_ui_fragments_Block.__interfaces__ = [cards_ui_fragments_Fragment];
cards_ui_fragments_Block.prototype = {
	name: null
	,editor: null
	,component: null
	,focus: null
	,active: null
	,uid: null
	,destroy: function() {
		this.editor.destroy();
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
		return thx_core_Iterators.map(this.fragments.getAssociations(fragment),($_=this.values,$bind($_,$_.get)));
	}
	,getAttachedPropertiesForFragment: function(fragment) {
		return thx_core_Iterators.filter(this.fragments.getAssociations(fragment.name),function(name) {
			return fragment.component.properties.exists(name);
		}).map(($_=this.values,$bind($_,$_.get)));
	}
	,getAttachablePropertiesForFragment: function(fragment) {
		return thx_core_Iterators.filter(this.fragments.getAssociations(fragment.name),function(name) {
			return !fragment.component.properties.exists(name);
		}).map(($_=this.values,$bind($_,$_.get)));
	}
	,__class__: cards_ui_fragments_FragmentMapper
};
var cards_ui_fragments__$FragmentName_FragmentName_$Impl_$ = function() { };
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
			var value = s = new thx_core_Set();
			this.map.set(fragment,value);
		}
		s.add(property);
	}
	,associateMany: function(fragment,properties) {
		thx_core_Iterables.map(properties,(function(f,a1) {
			return function(a2) {
				return f(a1,a2);
			};
		})($bind(this,this.associate),fragment));
	}
	,getAssociations: function(fragment) {
		var s = this.map.get(fragment);
		if(s == null) s = new thx_core_Set();
		return s.iterator();
	}
	,__class__: cards_ui_fragments_FragmentProperties
};
var cards_ui_fragments_ReadonlyBlock = function(options) {
	this.name = "readonly";
	if(null == options.el && null == options.template) options.template = "<section class=\"readonly block\" tabindex=\"0\">readonly</div>";
	this.component = new cards_components_Component(options);
	this.focus = new thx_stream_Value(false);
	this.active = new thx_stream_Value(false);
	if(null != options.uid) this.uid = options.uid; else this.uid = thx_core_UUID.create();
	this.focusStream = thx_stream_dom_Dom.streamEvent(this.component.el,"focus").toTrue().merge(thx_stream_dom_Dom.streamEvent(this.component.el,"blur").toFalse()).feed(this.focus);
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
	this.clicks = thx_stream_dom_Dom.streamEvent(this.component.el,"click",false);
	this.enabled = new thx_stream_Value(true);
	thx_stream_EmitterBools.negate(this.enabled).subscribe(thx_stream_dom_Dom.subscribeToggleAttribute(this.component.el,"disabled","disabled"));
};
cards_ui_widgets_Button.__name__ = ["cards","ui","widgets","Button"];
cards_ui_widgets_Button.prototype = {
	component: null
	,clicks: null
	,enabled: null
	,cancel: null
	,destroy: function() {
		this.cancel();
		this.component.destroy();
	}
	,__class__: cards_ui_widgets_Button
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
		thx_Assert.notNull(item,null,{ fileName : "Menu.hx", lineNumber : 35, className : "cards.ui.widgets.Menu", methodName : "removeItem"});
		thx_Assert.isTrue(this.items.h.__keys__[item.__id__] != null,null,{ fileName : "Menu.hx", lineNumber : 36, className : "cards.ui.widgets.Menu", methodName : "removeItem"});
		var el = this.items.h[item.__id__];
		item.detach();
		this.ul.removeChild(el);
	}
	,__class__: cards_ui_widgets_Menu
});
var cards_ui_widgets_Statusbar = function(options) {
	if(null == options.el && null == options.template) options.template = "<footer class=\"statusbar\"></footer>";
	this.component = new cards_components_Component(options);
};
cards_ui_widgets_Statusbar.__name__ = ["cards","ui","widgets","Statusbar"];
cards_ui_widgets_Statusbar.prototype = {
	component: null
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
var cards_ui_widgets_ToolbarGroup = function(el,component) {
	this.el = el;
	this.component = component;
};
cards_ui_widgets_ToolbarGroup.__name__ = ["cards","ui","widgets","ToolbarGroup"];
cards_ui_widgets_ToolbarGroup.prototype = {
	el: null
	,component: null
	,addButton: function(text,icon) {
		if(text == null) text = "";
		var button = new cards_ui_widgets_Button(text,icon);
		button.component.appendTo(this.el);
		this.component.add(button.component);
		return button;
	}
	,__class__: cards_ui_widgets_ToolbarGroup
};
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
haxe_CallStack.callStack = function() {
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
					method = haxe_StackItem.Method(className,methodName);
				}
			}
			stack.push(haxe_StackItem.FilePos(method,site.getFileName(),site.getLineNumber()));
		}
		return stack;
	};
	var a = haxe_CallStack.makeStack(new Error().stack);
	a.shift();
	Error.prepareStackTrace = oldValue;
	return a;
};
haxe_CallStack.exceptionStack = function() {
	return [];
};
haxe_CallStack.makeStack = function(s) {
	if(typeof(s) == "string") {
		var stack = s.split("\n");
		var m = [];
		var _g = 0;
		while(_g < stack.length) {
			var line = stack[_g];
			++_g;
			m.push(haxe_StackItem.Module(line));
		}
		return m;
	} else return s;
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
haxe_ds_IntMap.__interfaces__ = [IMap];
haxe_ds_IntMap.prototype = {
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
	,__class__: haxe_ds_IntMap
};
var haxe_ds_ObjectMap = function() {
	this.h = { };
	this.h.__keys__ = { };
};
haxe_ds_ObjectMap.__name__ = ["haxe","ds","ObjectMap"];
haxe_ds_ObjectMap.__interfaces__ = [IMap];
haxe_ds_ObjectMap.prototype = {
	h: null
	,set: function(key,value) {
		var id = key.__id__ || (key.__id__ = ++haxe_ds_ObjectMap.count);
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
	,__class__: haxe_ds_ObjectMap
};
var haxe_ds_StringMap = function() {
	this.h = { };
};
haxe_ds_StringMap.__name__ = ["haxe","ds","StringMap"];
haxe_ds_StringMap.__interfaces__ = [IMap];
haxe_ds_StringMap.prototype = {
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
	,__class__: haxe_ds_StringMap
};
var haxe_io_Bytes = function() { };
haxe_io_Bytes.__name__ = ["haxe","io","Bytes"];
haxe_io_Bytes.prototype = {
	length: null
	,b: null
	,__class__: haxe_io_Bytes
};
var haxe_io_Eof = function() { };
haxe_io_Eof.__name__ = ["haxe","io","Eof"];
haxe_io_Eof.prototype = {
	toString: function() {
		return "Eof";
	}
	,__class__: haxe_io_Eof
};
var thx_core_Error = function(message,stack,pos) {
	this.message = message;
	if(null == stack) {
		stack = haxe_CallStack.exceptionStack();
		if(stack.length == 0) stack = haxe_CallStack.callStack();
	}
	this.stack = stack;
	this.pos = pos;
};
thx_core_Error.__name__ = ["thx","core","Error"];
thx_core_Error.fromDynamic = function(err,pos) {
	if(js_Boot.__instanceof(err,thx_core_Error)) return err;
	return new thx_core_Error("" + Std.string(err),null,pos);
};
thx_core_Error.__super__ = Error;
thx_core_Error.prototype = $extend(Error.prototype,{
	stack: null
	,pos: null
	,__class__: thx_core_Error
});
var thx_Assert = function() { };
thx_Assert.__name__ = ["thx","Assert"];
thx_Assert.isTrue = function(cond,msg,pos) {
	if(thx_Assert.results == null) throw "Assert.results is not currently bound to any assert context";
	if(null == msg) msg = "expected true";
	if(cond) thx_Assert.results.add(thx_core_Assertion.Success(pos)); else thx_Assert.results.add(thx_core_Assertion.Failure(msg,pos));
};
thx_Assert.isFalse = function(value,msg,pos) {
	if(null == msg) msg = "expected false";
	thx_Assert.isTrue(value == false,msg,pos);
};
thx_Assert.isNull = function(value,msg,pos) {
	if(msg == null) msg = "expected null but was " + thx_Assert.q(value);
	thx_Assert.isTrue(value == null,msg,pos);
};
thx_Assert.notNull = function(value,msg,pos) {
	if(null == msg) msg = "expected not null";
	thx_Assert.isTrue(value != null,msg,pos);
};
thx_Assert["is"] = function(value,type,msg,pos) {
	if(msg == null) msg = "expected type " + thx_Assert.typeToString(type) + " but was " + thx_Assert.typeToString(value);
	thx_Assert.isTrue(js_Boot.__instanceof(value,type),msg,pos);
};
thx_Assert.notEquals = function(expected,value,msg,pos) {
	if(msg == null) msg = "expected " + thx_Assert.q(expected) + " and testa value " + thx_Assert.q(value) + " should be different";
	thx_Assert.isFalse(expected == value,msg,pos);
};
thx_Assert.equals = function(expected,value,msg,pos) {
	if(msg == null) msg = "expected " + thx_Assert.q(expected) + " but was " + thx_Assert.q(value);
	thx_Assert.isTrue(expected == value,msg,pos);
};
thx_Assert.match = function(pattern,value,msg,pos) {
	if(msg == null) msg = "the value " + thx_Assert.q(value) + "does not match the provided pattern";
	thx_Assert.isTrue(pattern.match(value),msg,pos);
};
thx_Assert.floatEquals = function(expected,value,approx,msg,pos) {
	if(msg == null) msg = "expected " + thx_Assert.q(expected) + " but was " + thx_Assert.q(value);
	return thx_Assert.isTrue(thx_Assert._floatEquals(expected,value,approx),msg,pos);
};
thx_Assert._floatEquals = function(expected,value,approx) {
	if(Math.isNaN(expected)) return Math.isNaN(value); else if(Math.isNaN(value)) return false; else if(!Math.isFinite(expected) && !Math.isFinite(value)) return expected > 0 == value > 0;
	if(null == approx) approx = 1e-5;
	return Math.abs(value - expected) < approx;
};
thx_Assert.getTypeName = function(v) {
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
thx_Assert.isIterable = function(v,isAnonym) {
	var fields;
	if(isAnonym) fields = Reflect.fields(v); else fields = Type.getInstanceFields(Type.getClass(v));
	if(!Lambda.has(fields,"iterator")) return false;
	return Reflect.isFunction(Reflect.field(v,"iterator"));
};
thx_Assert.isIterator = function(v,isAnonym) {
	var fields;
	if(isAnonym) fields = Reflect.fields(v); else fields = Type.getInstanceFields(Type.getClass(v));
	if(!Lambda.has(fields,"next") || !Lambda.has(fields,"hasNext")) return false;
	return Reflect.isFunction(Reflect.field(v,"next")) && Reflect.isFunction(Reflect.field(v,"hasNext"));
};
thx_Assert.sameAs = function(expected,value,status) {
	var texpected = thx_Assert.getTypeName(expected);
	var tvalue = thx_Assert.getTypeName(value);
	if(texpected != tvalue) {
		status.error = "expected type " + texpected + " but it is " + tvalue + (status.path == ""?"":" for field " + status.path);
		return false;
	}
	{
		var _g = Type["typeof"](expected);
		switch(_g[1]) {
		case 2:
			if(!thx_Assert._floatEquals(expected,value)) {
				status.error = "expected " + thx_Assert.q(expected) + " but it is " + thx_Assert.q(value) + (status.path == ""?"":" for field " + status.path);
				return false;
			}
			return true;
		case 0:case 1:case 3:
			if(expected != value) {
				status.error = "expected " + thx_Assert.q(expected) + " but it is " + thx_Assert.q(value) + (status.path == ""?"":" for field " + status.path);
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
				status.error = "expected instance of " + thx_Assert.q(cexpected) + " but it is " + thx_Assert.q(cvalue) + (status.path == ""?"":" for field " + status.path);
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
						if(!thx_Assert.sameAs(expected[i],value[i],status)) {
							status.error = "expected " + thx_Assert.q(expected) + " but it is " + thx_Assert.q(value) + (status.path == ""?"":" for field " + status.path);
							return false;
						}
					}
				}
				return true;
			}
			if(js_Boot.__instanceof(expected,Date)) {
				if(expected.getTime() != value.getTime()) {
					status.error = "expected " + thx_Assert.q(expected) + " but it is " + thx_Assert.q(value) + (status.path == ""?"":" for field " + status.path);
					return false;
				}
				return true;
			}
			if(js_Boot.__instanceof(expected,haxe_io_Bytes)) {
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
			if(js_Boot.__instanceof(expected,haxe_ds_StringMap) || js_Boot.__instanceof(expected,haxe_ds_IntMap)) {
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
						if(!thx_Assert.sameAs(expected.get(key),value.get(key),status)) {
							status.error = "expected " + thx_Assert.q(expected) + " but it is " + thx_Assert.q(value) + (status.path == ""?"":" for field " + status.path);
							return false;
						}
					}
				}
				return true;
			}
			if(thx_Assert.isIterator(expected,false)) {
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
						if(!thx_Assert.sameAs(evalues[i2],vvalues[i2],status)) {
							status.error = "expected " + thx_Assert.q(expected) + " but it is " + thx_Assert.q(value) + (status.path == ""?"":" for field " + status.path);
							return false;
						}
					}
				}
				return true;
			}
			if(thx_Assert.isIterable(expected,false)) {
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
						if(!thx_Assert.sameAs(evalues1[i3],vvalues1[i3],status)) return false;
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
					if(!thx_Assert.sameAs(e,v,status)) return false;
				}
			}
			return true;
		case 7:
			var e1 = _g[2];
			var eexpected = Type.getEnumName(e1);
			var evalue = Type.getEnumName(Type.getEnum(value));
			if(eexpected != evalue) {
				status.error = "expected enumeration of " + thx_Assert.q(eexpected) + " but it is " + thx_Assert.q(evalue) + (status.path == ""?"":" for field " + status.path);
				return false;
			}
			if(status.recursive || status.path == "") {
				if(Type.enumIndex(expected) != Type.enumIndex(value)) {
					status.error = "expected " + thx_Assert.q(Type.enumConstructor(expected)) + " but is " + thx_Assert.q(Type.enumConstructor(value)) + (status.path == ""?"":" for field " + status.path);
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
					if(!thx_Assert.sameAs(eparams[i4],vparams[i4],status)) {
						status.error = "expected " + thx_Assert.q(expected) + " but it is " + thx_Assert.q(value) + (status.path == ""?"":" for field " + status.path);
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
						status.error = "expected field " + status.path + " does not exist in " + thx_Assert.q(value);
						return false;
					}
					var e2 = Reflect.field(expected,field1);
					if(Reflect.isFunction(e2)) continue;
					var v1 = Reflect.field(value,field1);
					if(!thx_Assert.sameAs(e2,v1,status)) return false;
				}
				if(tfields.length > 0) {
					status.error = "the tested object has extra field(s) (" + tfields.join(", ") + ") not included in the expected ones";
					return false;
				}
			}
			if(thx_Assert.isIterator(expected,true)) {
				if(!thx_Assert.isIterator(value,true)) {
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
						if(!thx_Assert.sameAs(evalues2[i5],vvalues2[i5],status)) {
							status.error = "expected " + thx_Assert.q(expected) + " but it is " + thx_Assert.q(value) + (status.path == ""?"":" for field " + status.path);
							return false;
						}
					}
				}
				return true;
			}
			if(thx_Assert.isIterable(expected,true)) {
				if(!thx_Assert.isIterable(value,true)) {
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
						if(!thx_Assert.sameAs(evalues3[i6],vvalues3[i6],status)) return false;
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
	throw "Unable to compare values: " + thx_Assert.q(expected) + " and " + thx_Assert.q(value);
};
thx_Assert.q = function(v) {
	if(typeof(v) == "string") return "\"" + StringTools.replace(v,"\"","\\\"") + "\""; else return Std.string(v);
};
thx_Assert.same = function(expected,value,recursive,msg,pos) {
	var status = { recursive : null == recursive?true:recursive, path : "", error : null};
	if(thx_Assert.sameAs(expected,value,status)) thx_Assert.isTrue(true,msg,pos); else thx_Assert.fail(msg == null?status.error:msg,pos);
};
thx_Assert.raises = function(method,type,msgNotThrown,msgWrongType,pos) {
	if(type == null) type = String;
	try {
		method();
		var name = Type.getClassName(type);
		if(name == null) name = "" + Std.string(type);
		if(null == msgNotThrown) msgNotThrown = "exception of type " + name + " not raised";
		thx_Assert.fail(msgNotThrown,pos);
	} catch( ex ) {
		var name1 = Type.getClassName(type);
		if(name1 == null) name1 = "" + Std.string(type);
		if(null == msgWrongType) msgWrongType = "expected throw of type " + name1 + " but was " + Std.string(ex);
		thx_Assert.isTrue(js_Boot.__instanceof(ex,type),msgWrongType,pos);
	}
};
thx_Assert.allows = function(possibilities,value,msg,pos) {
	if(Lambda.has(possibilities,value)) thx_Assert.isTrue(true,msg,pos); else thx_Assert.fail(msg == null?"value " + thx_Assert.q(value) + " not found in the expected possibilities " + Std.string(possibilities):msg,pos);
};
thx_Assert.contains = function(match,values,msg,pos) {
	if(Lambda.has(values,match)) thx_Assert.isTrue(true,msg,pos); else thx_Assert.fail(msg == null?"values " + thx_Assert.q(values) + " do not contain " + Std.string(match):msg,pos);
};
thx_Assert.notContains = function(match,values,msg,pos) {
	if(!Lambda.has(values,match)) thx_Assert.isTrue(true,msg,pos); else thx_Assert.fail(msg == null?"values " + thx_Assert.q(values) + " do contain " + Std.string(match):msg,pos);
};
thx_Assert.stringContains = function(match,value,msg,pos) {
	if(value != null && value.indexOf(match) >= 0) thx_Assert.isTrue(true,msg,pos); else thx_Assert.fail(msg == null?"value " + thx_Assert.q(value) + " does not contain " + thx_Assert.q(match):msg,pos);
};
thx_Assert.stringSequence = function(sequence,value,msg,pos) {
	if(null == value) {
		thx_Assert.fail(msg == null?"null argument value":msg,pos);
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
			thx_Assert.fail(msg,pos);
			return;
		}
		p = p2 + s.length;
	}
	thx_Assert.isTrue(true,msg,pos);
};
thx_Assert.fail = function(msg,pos) {
	if(msg == null) msg = "failure expected";
	thx_Assert.isTrue(false,msg,pos);
};
thx_Assert.warn = function(msg) {
	thx_Assert.results.add(thx_core_Assertion.Warning(msg));
};
thx_Assert.createAsync = function(f,timeout) {
	return function() {
	};
};
thx_Assert.createEvent = function(f,timeout) {
	return function(e) {
	};
};
thx_Assert.typeToString = function(t) {
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
var thx_core_Arrays = function() { };
thx_core_Arrays.__name__ = ["thx","core","Arrays"];
thx_core_Arrays.same = function(a,b,eq) {
	if(a == null || b == null || a.length != b.length) return false;
	if(null == eq) eq = thx_core_Function.equality;
	var _g1 = 0;
	var _g = a.length;
	while(_g1 < _g) {
		var i = _g1++;
		if(!eq(a[i],b[i])) return false;
	}
	return true;
};
thx_core_Arrays.cross = function(a,b) {
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
thx_core_Arrays.crossMulti = function(a) {
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
thx_core_Arrays.pushIf = function(arr,cond,value) {
	if(cond) arr.push(value);
	return arr;
};
thx_core_Arrays.eachPair = function(arr,handler) {
	var _g1 = 0;
	var _g = arr.length;
	while(_g1 < _g) {
		var i = _g1++;
		var _g3 = i;
		var _g2 = arr.length;
		while(_g3 < _g2) {
			var j = _g3++;
			if(!handler(arr[i],arr[j])) return;
		}
	}
};
thx_core_Arrays.mapi = function(arr,handler) {
	return arr.map(handler);
};
thx_core_Arrays.flatMap = function(arr,callback) {
	return thx_core_Arrays.flatten(arr.map(callback));
};
thx_core_Arrays.flatten = function(arr) {
	return Array.prototype.concat.apply([],arr);
};
thx_core_Arrays.reduce = function(arr,callback,initial) {
	return arr.reduce(callback,initial);
};
thx_core_Arrays.reducei = function(arr,callback,initial) {
	return arr.reduce(callback,initial);
};
thx_core_Arrays.order = function(arr,sort) {
	var n = arr.slice();
	n.sort(sort);
	return n;
};
thx_core_Arrays.isEmpty = function(arr) {
	return arr.length == 0;
};
thx_core_Arrays.contains = function(arr,element,eq) {
	if(null == eq) return HxOverrides.indexOf(arr,element,0) >= 0; else {
		var _g1 = 0;
		var _g = arr.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(eq(arr[i],element)) return true;
		}
		return false;
	}
};
thx_core_Arrays.shuffle = function(a) {
	var t = thx_core_Ints.range(a.length);
	var arr = [];
	while(t.length > 0) {
		var pos = Std.random(t.length);
		var index = t[pos];
		t.splice(pos,1);
		arr.push(a[index]);
	}
	return arr;
};
thx_core_Arrays.extract = function(a,f) {
	var _g1 = 0;
	var _g = a.length;
	while(_g1 < _g) {
		var i = _g1++;
		if(f(a[i])) return a.splice(i,1)[0];
	}
	return null;
};
var thx_core_Assertion = { __ename__ : ["thx","core","Assertion"], __constructs__ : ["Success","Failure","Error","PreConditionError","PostConditionError","Warning"] };
thx_core_Assertion.Success = function(pos) { var $x = ["Success",0,pos]; $x.__enum__ = thx_core_Assertion; $x.toString = $estr; return $x; };
thx_core_Assertion.Failure = function(msg,pos) { var $x = ["Failure",1,msg,pos]; $x.__enum__ = thx_core_Assertion; $x.toString = $estr; return $x; };
thx_core_Assertion.Error = function(e,stack) { var $x = ["Error",2,e,stack]; $x.__enum__ = thx_core_Assertion; $x.toString = $estr; return $x; };
thx_core_Assertion.PreConditionError = function(e,stack) { var $x = ["PreConditionError",3,e,stack]; $x.__enum__ = thx_core_Assertion; $x.toString = $estr; return $x; };
thx_core_Assertion.PostConditionError = function(e,stack) { var $x = ["PostConditionError",4,e,stack]; $x.__enum__ = thx_core_Assertion; $x.toString = $estr; return $x; };
thx_core_Assertion.Warning = function(msg) { var $x = ["Warning",5,msg]; $x.__enum__ = thx_core_Assertion; $x.toString = $estr; return $x; };
var thx_core_Function0 = function() { };
thx_core_Function0.__name__ = ["thx","core","Function0"];
thx_core_Function0.noop = function() {
};
thx_core_Function0.join = function(fa,fb) {
	return function() {
		fa();
		fb();
	};
};
thx_core_Function0.once = function(f) {
	return function() {
		f();
		f = function() {
		};
	};
};
var thx_core_Function1 = function() { };
thx_core_Function1.__name__ = ["thx","core","Function1"];
thx_core_Function1.noop = function(_) {
};
thx_core_Function1.compose = function(fa,fb) {
	return function(v) {
		return fa(fb(v));
	};
};
thx_core_Function1.join = function(fa,fb) {
	return function(v) {
		fa(v);
		fb(v);
	};
};
var thx_core_Function = function() { };
thx_core_Function.__name__ = ["thx","core","Function"];
thx_core_Function.equality = function(a,b) {
	return a == b;
};
var thx_core_Ints = function() { };
thx_core_Ints.__name__ = ["thx","core","Ints"];
thx_core_Ints.clamp = function(v,min,max) {
	if(v < min) return min; else if(v > max) return max; else return v;
};
thx_core_Ints.canParse = function(s) {
	return thx_core_Ints.pattern_parse.match(s);
};
thx_core_Ints.min = function(a,b) {
	if(a < b) return a; else return b;
};
thx_core_Ints.max = function(a,b) {
	if(a > b) return a; else return b;
};
thx_core_Ints.parse = function(s) {
	if(HxOverrides.substr(s,0,1) == "+") s = HxOverrides.substr(s,1,null);
	return Std.parseInt(s);
};
thx_core_Ints.compare = function(a,b) {
	return a - b;
};
thx_core_Ints.range = function(start,stop,step) {
	if(step == null) step = 1;
	if(null == stop) {
		stop = start;
		start = 0;
	}
	if((stop - start) / step == Math.POSITIVE_INFINITY) throw "infinite range";
	var range = [];
	var i = -1;
	var j;
	if(step < 0) while((j = start + step * ++i) > stop) range.push(j); else while((j = start + step * ++i) < stop) range.push(j);
	return range;
};
var thx_core_Iterables = function() { };
thx_core_Iterables.__name__ = ["thx","core","Iterables"];
thx_core_Iterables.map = function(it,f) {
	return thx_core_Iterators.map($iterator(it)(),f);
};
thx_core_Iterables.eachPair = function(it,handler) {
	return thx_core_Iterators.eachPair($iterator(it)(),handler);
};
thx_core_Iterables.toArray = function(it) {
	return thx_core_Iterators.toArray($iterator(it)());
};
thx_core_Iterables.order = function(it,sort) {
	return thx_core_Iterators.order($iterator(it)(),sort);
};
thx_core_Iterables.reduce = function(it,callback,initial) {
	return thx_core_Iterators.reduce($iterator(it)(),callback,initial);
};
thx_core_Iterables.reducei = function(it,callback,initial) {
	return thx_core_Iterators.reducei($iterator(it)(),callback,initial);
};
thx_core_Iterables.isEmpty = function(it) {
	return thx_core_Iterators.isEmpty($iterator(it)());
};
thx_core_Iterables.filter = function(it,predicate) {
	return thx_core_Iterators.filter($iterator(it)(),predicate);
};
var thx_core_Iterators = function() { };
thx_core_Iterators.__name__ = ["thx","core","Iterators"];
thx_core_Iterators.map = function(it,f) {
	var acc = [];
	while( it.hasNext() ) {
		var v = it.next();
		acc.push(f(v));
	}
	return acc;
};
thx_core_Iterators.mapi = function(it,f) {
	var acc = [];
	var i = 0;
	while( it.hasNext() ) {
		var v = it.next();
		acc.push(f(v,i++));
	}
	return acc;
};
thx_core_Iterators.eachPair = function(it,handler) {
	thx_core_Arrays.eachPair(thx_core_Iterators.toArray(it),handler);
};
thx_core_Iterators.toArray = function(it) {
	var items = [];
	while( it.hasNext() ) {
		var item = it.next();
		items.push(item);
	}
	return items;
};
thx_core_Iterators.order = function(it,sort) {
	var n = thx_core_Iterators.toArray(it);
	n.sort(sort);
	return n;
};
thx_core_Iterators.reduce = function(it,callback,initial) {
	thx_core_Iterators.map(it,function(v) {
		initial = callback(initial,v);
	});
	return initial;
};
thx_core_Iterators.reducei = function(it,callback,initial) {
	thx_core_Iterators.mapi(it,function(v,i) {
		initial = callback(initial,v,i);
	});
	return initial;
};
thx_core_Iterators.isEmpty = function(it) {
	return !it.hasNext();
};
thx_core_Iterators.filter = function(it,predicate) {
	return thx_core_Iterators.reduce(it,function(acc,item) {
		if(predicate(item)) acc.push(item);
		return acc;
	},[]);
};
var thx_core_Nil = { __ename__ : ["thx","core","Nil"], __constructs__ : ["nil"] };
thx_core_Nil.nil = ["nil",0];
thx_core_Nil.nil.toString = $estr;
thx_core_Nil.nil.__enum__ = thx_core_Nil;
var thx_core_Objects = function() { };
thx_core_Objects.__name__ = ["thx","core","Objects"];
thx_core_Objects.isEmpty = function(o) {
	return Reflect.fields(o).length == 0;
};
var thx_core_Set = function() {
	this._v = [];
	this.length = 0;
};
thx_core_Set.__name__ = ["thx","core","Set"];
thx_core_Set.ofArray = function(arr) {
	var set = new thx_core_Set();
	var _g = 0;
	while(_g < arr.length) {
		var item = arr[_g];
		++_g;
		set.add(item);
	}
	return set;
};
thx_core_Set.prototype = {
	length: null
	,_v: null
	,add: function(v) {
		HxOverrides.remove(this._v,v);
		this._v.push(v);
		this.length = this._v.length;
	}
	,remove: function(v) {
		var t = HxOverrides.remove(this._v,v);
		this.length = this._v.length;
		return t;
	}
	,exists: function(v) {
		var _g = 0;
		var _g1 = this._v;
		while(_g < _g1.length) {
			var t = _g1[_g];
			++_g;
			if(t == v) return true;
		}
		return false;
	}
	,iterator: function() {
		return HxOverrides.iter(this._v);
	}
	,array: function() {
		return this._v.slice();
	}
	,toString: function() {
		return "{" + this._v.join(", ") + "}";
	}
	,__class__: thx_core_Set
};
var thx_core_Strings = function() { };
thx_core_Strings.__name__ = ["thx","core","Strings"];
thx_core_Strings.upTo = function(value,searchFor) {
	var pos = value.indexOf(searchFor);
	if(pos < 0) return value; else return HxOverrides.substr(value,0,pos);
};
thx_core_Strings.startFrom = function(value,searchFor) {
	var pos = value.indexOf(searchFor);
	if(pos < 0) return value; else return HxOverrides.substr(value,pos + searchFor.length,null);
};
thx_core_Strings.rtrim = function(value,charlist) {
	var len = value.length;
	while(len > 0) {
		var c = HxOverrides.substr(value,len - 1,1);
		if(charlist.indexOf(c) < 0) break;
		len--;
	}
	return HxOverrides.substr(value,0,len);
};
thx_core_Strings.ltrim = function(value,charlist) {
	var start = 0;
	while(start < value.length) {
		var c = HxOverrides.substr(value,start,1);
		if(charlist.indexOf(c) < 0) break;
		start++;
	}
	return HxOverrides.substr(value,start,null);
};
thx_core_Strings.trim = function(value,charlist) {
	return thx_core_Strings.rtrim(thx_core_Strings.ltrim(value,charlist),charlist);
};
thx_core_Strings.collapse = function(value) {
	return thx_core_Strings._reCollapse.replace(StringTools.trim(value)," ");
};
thx_core_Strings.ucfirst = function(value) {
	if(value == null) return null; else return value.charAt(0).toUpperCase() + HxOverrides.substr(value,1,null);
};
thx_core_Strings.lcfirst = function(value) {
	if(value == null) return null; else return value.charAt(0).toLowerCase() + HxOverrides.substr(value,1,null);
};
thx_core_Strings.empty = function(value) {
	return value == null || value == "";
};
thx_core_Strings.isAlphaNum = function(value) {
	if(value == null) return false; else return thx_core_Strings.__alphaNumPattern.match(value);
};
thx_core_Strings.digitsOnly = function(value) {
	if(value == null) return false; else return thx_core_Strings.__digitsPattern.match(value);
};
thx_core_Strings.ucwords = function(value) {
	return thx_core_Strings.__ucwordsPattern.map(value == null?null:value.charAt(0).toUpperCase() + HxOverrides.substr(value,1,null),thx_core_Strings.__upperMatch);
};
thx_core_Strings.ucwordsws = function(value) {
	return thx_core_Strings.__ucwordswsPattern.map(value == null?null:value.charAt(0).toUpperCase() + HxOverrides.substr(value,1,null),thx_core_Strings.__upperMatch);
};
thx_core_Strings.__upperMatch = function(re) {
	return re.matched(0).toUpperCase();
};
thx_core_Strings.humanize = function(s) {
	return StringTools.replace(thx_core_Strings.underscore(s),"_"," ");
};
thx_core_Strings.capitalize = function(s) {
	return HxOverrides.substr(s,0,1).toUpperCase() + HxOverrides.substr(s,1,null);
};
thx_core_Strings.succ = function(s) {
	return HxOverrides.substr(s,0,-1) + String.fromCharCode((function($this) {
		var $r;
		var _this = HxOverrides.substr(s,-1,null);
		$r = HxOverrides.cca(_this,0);
		return $r;
	}(this)) + 1);
};
thx_core_Strings.underscore = function(s) {
	s = new EReg("::","g").replace(s,"/");
	s = new EReg("([A-Z]+)([A-Z][a-z])","g").replace(s,"$1_$2");
	s = new EReg("([a-z\\d])([A-Z])","g").replace(s,"$1_$2");
	s = new EReg("-","g").replace(s,"_");
	return s.toLowerCase();
};
thx_core_Strings.dasherize = function(s) {
	return StringTools.replace(s,"_","-");
};
thx_core_Strings.repeat = function(s,times) {
	var b = [];
	var _g = 0;
	while(_g < times) {
		var i = _g++;
		b.push(s);
	}
	return b.join("");
};
thx_core_Strings.wrapColumns = function(s,columns,indent,newline) {
	if(newline == null) newline = "\n";
	if(indent == null) indent = "";
	if(columns == null) columns = 78;
	var parts = thx_core_Strings._reSplitWC.split(s);
	var result = [];
	var _g = 0;
	while(_g < parts.length) {
		var part = parts[_g];
		++_g;
		result.push(thx_core_Strings._wrapColumns(StringTools.trim(thx_core_Strings._reReduceWS.replace(part," ")),columns,indent,newline));
	}
	return result.join(newline);
};
thx_core_Strings._wrapColumns = function(s,columns,indent,newline) {
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
thx_core_Strings.stripTags = function(s) {
	return thx_core_Strings._reStripTags.replace(s,"");
};
thx_core_Strings.ellipsis = function(s,maxlen,symbol) {
	if(symbol == null) symbol = "...";
	if(maxlen == null) maxlen = 20;
	if(s.length > maxlen) return HxOverrides.substr(s,0,symbol.length > maxlen - symbol.length?symbol.length:maxlen - symbol.length) + symbol; else return s;
};
thx_core_Strings.compare = function(a,b) {
	if(a < b) return -1; else if(a > b) return 1; else return 0;
};
var thx_core_Timer = function() { };
thx_core_Timer.__name__ = ["thx","core","Timer"];
thx_core_Timer.repeat = function(callback,ms) {
	return setInterval(callback,ms);
};
thx_core_Timer.delay = function(callback,ms) {
	return setTimeout(callback,ms);
};
thx_core_Timer.immediate = function(callback) {
	return setImmediate(callback);
};
thx_core_Timer.clear = function(id) {
	return clearTimeout(id);
};
var thx_core__$Tuple_Tuple0_$Impl_$ = function() { };
thx_core__$Tuple_Tuple0_$Impl_$.__name__ = ["thx","core","_Tuple","Tuple0_Impl_"];
thx_core__$Tuple_Tuple0_$Impl_$._new = function() {
	return thx_core_Nil.nil;
};
thx_core__$Tuple_Tuple0_$Impl_$.toTuple1 = function(this1,v) {
	return v;
};
thx_core__$Tuple_Tuple0_$Impl_$.toString = function(this1) {
	return "Tuple0()";
};
thx_core__$Tuple_Tuple0_$Impl_$.toNil = function(this1) {
	return this1;
};
thx_core__$Tuple_Tuple0_$Impl_$.nilToTuple = function(v) {
	return thx_core_Nil.nil;
};
var thx_core__$Tuple_Tuple1_$Impl_$ = function() { };
thx_core__$Tuple_Tuple1_$Impl_$.__name__ = ["thx","core","_Tuple","Tuple1_Impl_"];
thx_core__$Tuple_Tuple1_$Impl_$._new = function(_0) {
	return _0;
};
thx_core__$Tuple_Tuple1_$Impl_$.get__0 = function(this1) {
	return this1;
};
thx_core__$Tuple_Tuple1_$Impl_$.toTuple2 = function(this1,v) {
	return { _0 : this1, _1 : v};
};
thx_core__$Tuple_Tuple1_$Impl_$.toString = function(this1) {
	return "Tuple1(" + Std.string(this1) + ")";
};
var thx_core__$Tuple_Tuple2_$Impl_$ = function() { };
thx_core__$Tuple_Tuple2_$Impl_$.__name__ = ["thx","core","_Tuple","Tuple2_Impl_"];
thx_core__$Tuple_Tuple2_$Impl_$._new = function(_0,_1) {
	return { _0 : _0, _1 : _1};
};
thx_core__$Tuple_Tuple2_$Impl_$.get__0 = function(this1) {
	return this1._0;
};
thx_core__$Tuple_Tuple2_$Impl_$.get__1 = function(this1) {
	return this1._1;
};
thx_core__$Tuple_Tuple2_$Impl_$.toTuple3 = function(this1,v) {
	return { _0 : this1._0, _1 : this1._1, _2 : v};
};
thx_core__$Tuple_Tuple2_$Impl_$.toString = function(this1) {
	return "Tuple2(" + Std.string(this1._0) + "," + Std.string(this1._1) + ")";
};
var thx_core__$Tuple_Tuple3_$Impl_$ = function() { };
thx_core__$Tuple_Tuple3_$Impl_$.__name__ = ["thx","core","_Tuple","Tuple3_Impl_"];
thx_core__$Tuple_Tuple3_$Impl_$._new = function(_0,_1,_2) {
	return { _0 : _0, _1 : _1, _2 : _2};
};
thx_core__$Tuple_Tuple3_$Impl_$.get__0 = function(this1) {
	return this1._0;
};
thx_core__$Tuple_Tuple3_$Impl_$.get__1 = function(this1) {
	return this1._1;
};
thx_core__$Tuple_Tuple3_$Impl_$.get__2 = function(this1) {
	return this1._2;
};
thx_core__$Tuple_Tuple3_$Impl_$.toTuple4 = function(this1,v) {
	return { _0 : this1._0, _1 : this1._1, _2 : this1._2, _3 : v};
};
thx_core__$Tuple_Tuple3_$Impl_$.toString = function(this1) {
	return "Tuple3(" + Std.string(this1._0) + "," + Std.string(this1._1) + "," + Std.string(this1._2) + ")";
};
var thx_core__$Tuple_Tuple4_$Impl_$ = function() { };
thx_core__$Tuple_Tuple4_$Impl_$.__name__ = ["thx","core","_Tuple","Tuple4_Impl_"];
thx_core__$Tuple_Tuple4_$Impl_$._new = function(_0,_1,_2,_3) {
	return { _0 : _0, _1 : _1, _2 : _2, _3 : _3};
};
thx_core__$Tuple_Tuple4_$Impl_$.get__0 = function(this1) {
	return this1._0;
};
thx_core__$Tuple_Tuple4_$Impl_$.get__1 = function(this1) {
	return this1._1;
};
thx_core__$Tuple_Tuple4_$Impl_$.get__2 = function(this1) {
	return this1._2;
};
thx_core__$Tuple_Tuple4_$Impl_$.get__3 = function(this1) {
	return this1._3;
};
thx_core__$Tuple_Tuple4_$Impl_$.toTuple5 = function(this1,v) {
	return { _0 : this1._0, _1 : this1._1, _2 : this1._2, _3 : this1._3, _4 : v};
};
thx_core__$Tuple_Tuple4_$Impl_$.toString = function(this1) {
	return "Tuple4(" + Std.string(this1._0) + "," + Std.string(this1._1) + "," + Std.string(this1._2) + "," + Std.string(this1._3) + ")";
};
var thx_core__$Tuple_Tuple5_$Impl_$ = function() { };
thx_core__$Tuple_Tuple5_$Impl_$.__name__ = ["thx","core","_Tuple","Tuple5_Impl_"];
thx_core__$Tuple_Tuple5_$Impl_$._new = function(_0,_1,_2,_3,_4) {
	return { _0 : _0, _1 : _1, _2 : _2, _3 : _3, _4 : _4};
};
thx_core__$Tuple_Tuple5_$Impl_$.get__0 = function(this1) {
	return this1._0;
};
thx_core__$Tuple_Tuple5_$Impl_$.get__1 = function(this1) {
	return this1._1;
};
thx_core__$Tuple_Tuple5_$Impl_$.get__2 = function(this1) {
	return this1._2;
};
thx_core__$Tuple_Tuple5_$Impl_$.get__3 = function(this1) {
	return this1._3;
};
thx_core__$Tuple_Tuple5_$Impl_$.get__4 = function(this1) {
	return this1._4;
};
thx_core__$Tuple_Tuple5_$Impl_$.toTuple6 = function(this1,v) {
	return { _0 : this1._0, _1 : this1._1, _2 : this1._2, _3 : this1._3, _4 : this1._4, _5 : v};
};
thx_core__$Tuple_Tuple5_$Impl_$.toString = function(this1) {
	return "Tuple5(" + Std.string(this1._0) + "," + Std.string(this1._1) + "," + Std.string(this1._2) + "," + Std.string(this1._3) + "," + Std.string(this1._4) + ")";
};
var thx_core__$Tuple_Tuple6_$Impl_$ = function() { };
thx_core__$Tuple_Tuple6_$Impl_$.__name__ = ["thx","core","_Tuple","Tuple6_Impl_"];
thx_core__$Tuple_Tuple6_$Impl_$._new = function(_0,_1,_2,_3,_4,_5) {
	return { _0 : _0, _1 : _1, _2 : _2, _3 : _3, _4 : _4, _5 : _5};
};
thx_core__$Tuple_Tuple6_$Impl_$.get__0 = function(this1) {
	return this1._0;
};
thx_core__$Tuple_Tuple6_$Impl_$.get__1 = function(this1) {
	return this1._1;
};
thx_core__$Tuple_Tuple6_$Impl_$.get__2 = function(this1) {
	return this1._2;
};
thx_core__$Tuple_Tuple6_$Impl_$.get__3 = function(this1) {
	return this1._3;
};
thx_core__$Tuple_Tuple6_$Impl_$.get__4 = function(this1) {
	return this1._4;
};
thx_core__$Tuple_Tuple6_$Impl_$.get__5 = function(this1) {
	return this1._5;
};
thx_core__$Tuple_Tuple6_$Impl_$.toString = function(this1) {
	return "Tuple6(" + Std.string(this1._0) + "," + Std.string(this1._1) + "," + Std.string(this1._2) + "," + Std.string(this1._3) + "," + Std.string(this1._4) + "," + Std.string(this1._5) + ")";
};
var thx_core_Types = function() { };
thx_core_Types.__name__ = ["thx","core","Types"];
thx_core_Types.isAnonymousObject = function(v) {
	return Reflect.isObject(v) && null == Type.getClass(v);
};
thx_core_Types.sameType = function(a,b) {
	return thx_core_ValueTypes.toString(Type["typeof"](a)) == thx_core_ValueTypes.toString(Type["typeof"](b));
};
var thx_core_ClassTypes = function() { };
thx_core_ClassTypes.__name__ = ["thx","core","ClassTypes"];
thx_core_ClassTypes.toString = function(cls) {
	return Type.getClassName(cls);
};
thx_core_ClassTypes["as"] = function(value,type) {
	if(js_Boot.__instanceof(value,type)) return value; else return null;
};
var thx_core_ValueTypes = function() { };
thx_core_ValueTypes.__name__ = ["thx","core","ValueTypes"];
thx_core_ValueTypes.typeAsString = function(value) {
	return thx_core_ValueTypes.toString(Type["typeof"](value));
};
thx_core_ValueTypes.toString = function(type) {
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
thx_core_ValueTypes.typeInheritance = function(type) {
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
var thx_core_UUID = function() { };
thx_core_UUID.__name__ = ["thx","core","UUID"];
thx_core_UUID.random = function() {
	return Math.floor(Math.random() * 16);
};
thx_core_UUID.srandom = function() {
	return "" + Math.floor(Math.random() * 16);
};
thx_core_UUID.create = function() {
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
var thx_promise_Deferred = function() {
	this.promise = new thx_promise_Promise();
};
thx_promise_Deferred.__name__ = ["thx","promise","Deferred"];
thx_promise_Deferred.prototype = {
	promise: null
	,rejectWith: function(error) {
		return this.fulfill(thx_promise_PromiseValue.Failure(thx_core_Error.fromDynamic(error,{ fileName : "Deferred.hx", lineNumber : 13, className : "thx.promise.Deferred", methodName : "rejectWith"})));
	}
	,reject: function(error) {
		return this.fulfill(thx_promise_PromiseValue.Failure(error));
	}
	,resolve: function(value) {
		return this.fulfill(thx_promise_PromiseValue.Success(value));
	}
	,fulfill: function(result) {
		return this.promise.setState(result);
	}
	,toString: function() {
		return "Deferred";
	}
	,__class__: thx_promise_Deferred
};
var thx_promise_Promise = function() {
	this.handlers = [];
	this.state = haxe_ds_Option.None;
};
thx_promise_Promise.__name__ = ["thx","promise","Promise"];
thx_promise_Promise.create = function(callback) {
	var deferred = new thx_promise_Deferred();
	callback($bind(deferred,deferred.resolve),$bind(deferred,deferred.reject));
	return deferred.promise;
};
thx_promise_Promise.fulfilled = function(callback) {
	var deferred = new thx_promise_Deferred();
	callback($bind(deferred,deferred.fulfill));
	return deferred.promise;
};
thx_promise_Promise.all = function(arr) {
	return thx_promise_Promise.create(function(resolve,reject) {
		var results = [];
		var counter = 0;
		var hasError = false;
		arr.map(function(p,i) {
			p.either(function(value) {
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
thx_promise_Promise.value = function(v) {
	return thx_promise_Promise.create(function(resolve,_) {
		resolve(v);
	});
};
thx_promise_Promise.error = function(err) {
	return thx_promise_Promise.create(function(_,reject) {
		reject(err);
	});
};
thx_promise_Promise.prototype = {
	handlers: null
	,state: null
	,then: function(handler) {
		this.handlers.push(handler);
		this.update();
		return this;
	}
	,either: function(success,failure) {
		this.then(function(r) {
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
		return this;
	}
	,success: function(success) {
		return this.either(success,function(_) {
		});
	}
	,failure: function(failure) {
		return this.either(function(_) {
		},failure);
	}
	,throwFailure: function() {
		return this.failure(function(err) {
			throw err;
		});
	}
	,map: function(handler) {
		var _g = this;
		return thx_promise_Promise.fulfilled(function(fulfill) {
			_g.then(function(result) {
				handler(result).then(fulfill);
			});
		});
	}
	,mapEither: function(success,failure) {
		return this.map(function(result) {
			switch(result[1]) {
			case 1:
				var value = result[2];
				return success(value);
			case 0:
				var error = result[2];
				return failure(error);
			}
		});
	}
	,mapSuccess: function(success) {
		return this.mapEither(success,function(err) {
			return thx_promise_Promise.error(err);
		});
	}
	,mapFailure: function(failure) {
		return this.mapEither(function(value) {
			return thx_promise_Promise.value(value);
		},failure);
	}
	,always: function(handler) {
		this.then(function(_) {
			handler();
		});
	}
	,mapAlways: function(handler) {
		this.map(function(_) {
			return handler();
		});
	}
	,isResolved: function() {
		{
			var _g = this.state;
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
	}
	,isFailure: function() {
		{
			var _g = this.state;
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
	}
	,isComplete: function() {
		{
			var _g = this.state;
			switch(_g[1]) {
			case 1:
				return false;
			case 0:
				return true;
			}
		}
	}
	,toString: function() {
		return "Promise";
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
				throw new thx_core_Error("promise was already " + Std.string(r) + ", can't apply new state " + Std.string(newstate),null,{ fileName : "Promise.hx", lineNumber : 128, className : "thx.promise.Promise", methodName : "setState"});
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
				var handler;
				while(null != (handler = this.handlers.shift())) handler(result);
				break;
			}
		}
	}
	,__class__: thx_promise_Promise
};
var thx_promise_Promises = function() { };
thx_promise_Promises.__name__ = ["thx","promise","Promises"];
thx_promise_Promises.log = function(promise,prefix) {
	if(prefix == null) prefix = "";
	return promise.either(function(r) {
		haxe_Log.trace("" + prefix + " SUCCESS: " + Std.string(r),{ fileName : "Promise.hx", lineNumber : 148, className : "thx.promise.Promises", methodName : "log"});
	},function(e) {
		haxe_Log.trace("" + prefix + " ERROR: " + e.toString(),{ fileName : "Promise.hx", lineNumber : 149, className : "thx.promise.Promises", methodName : "log"});
	});
};
thx_promise_Promises.delay = function(p,interval) {
	return p.map(function(r) {
		return thx_promise_Promise.fulfilled(null == interval?function(fulfill) {
			thx_core_Timer.immediate((function(f,a1) {
				return function() {
					return f(a1);
				};
			})(fulfill,r));
		}:function(fulfill1) {
			thx_core_Timer.delay((function(f1,a11) {
				return function() {
					return f1(a11);
				};
			})(fulfill1,r),interval);
		});
	});
};
thx_promise_Promises.join = function(p1,p2) {
	return thx_promise_Promise.create(function(resolve,reject) {
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
		p1.either(function(v) {
			if(hasError) return;
			counter++;
			v1 = v;
			complete();
		},handleError);
		p2.either(function(v3) {
			if(hasError) return;
			counter++;
			v2 = v3;
			complete();
		},handleError);
	});
};
var thx_promise_PromiseTuple6 = function() { };
thx_promise_PromiseTuple6.__name__ = ["thx","promise","PromiseTuple6"];
thx_promise_PromiseTuple6.mapTuple = function(promise,success) {
	return promise.mapSuccess(function(t) {
		return success(t._0,t._1,t._2,t._3,t._4,t._5);
	});
};
thx_promise_PromiseTuple6.tuple = function(promise,success,failure) {
	return promise.either(function(t) {
		success(t._0,t._1,t._2,t._3,t._4,t._5);
	},null == failure?function(_) {
	}:failure);
};
var thx_promise_PromiseTuple5 = function() { };
thx_promise_PromiseTuple5.__name__ = ["thx","promise","PromiseTuple5"];
thx_promise_PromiseTuple5.join = function(p1,p2) {
	return thx_promise_Promise.create(function(resolve,reject) {
		thx_promise_Promises.join(p1,p2).either(function(t) {
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
thx_promise_PromiseTuple5.mapTuple = function(promise,success) {
	return promise.mapSuccess(function(t) {
		return success(t._0,t._1,t._2,t._3,t._4);
	});
};
thx_promise_PromiseTuple5.tuple = function(promise,success,failure) {
	return promise.either(function(t) {
		success(t._0,t._1,t._2,t._3,t._4);
	},null == failure?function(_) {
	}:failure);
};
var thx_promise_PromiseTuple4 = function() { };
thx_promise_PromiseTuple4.__name__ = ["thx","promise","PromiseTuple4"];
thx_promise_PromiseTuple4.join = function(p1,p2) {
	return thx_promise_Promise.create(function(resolve,reject) {
		thx_promise_Promises.join(p1,p2).either(function(t) {
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
thx_promise_PromiseTuple4.mapTuple = function(promise,success) {
	return promise.mapSuccess(function(t) {
		return success(t._0,t._1,t._2,t._3);
	});
};
thx_promise_PromiseTuple4.tuple = function(promise,success,failure) {
	return promise.either(function(t) {
		success(t._0,t._1,t._2,t._3);
	},null == failure?function(_) {
	}:failure);
};
var thx_promise_PromiseTuple3 = function() { };
thx_promise_PromiseTuple3.__name__ = ["thx","promise","PromiseTuple3"];
thx_promise_PromiseTuple3.join = function(p1,p2) {
	return thx_promise_Promise.create(function(resolve,reject) {
		thx_promise_Promises.join(p1,p2).either(function(t) {
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
thx_promise_PromiseTuple3.mapTuple = function(promise,success) {
	return promise.mapSuccess(function(t) {
		return success(t._0,t._1,t._2);
	});
};
thx_promise_PromiseTuple3.tuple = function(promise,success,failure) {
	return promise.either(function(t) {
		success(t._0,t._1,t._2);
	},null == failure?function(_) {
	}:failure);
};
var thx_promise_PromiseTuple2 = function() { };
thx_promise_PromiseTuple2.__name__ = ["thx","promise","PromiseTuple2"];
thx_promise_PromiseTuple2.join = function(p1,p2) {
	return thx_promise_Promise.create(function(resolve,reject) {
		thx_promise_Promises.join(p1,p2).either(function(t) {
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
thx_promise_PromiseTuple2.mapTuple = function(promise,success) {
	return promise.mapSuccess(function(t) {
		return success(t._0,t._1);
	});
};
thx_promise_PromiseTuple2.tuple = function(promise,success,failure) {
	return promise.either(function(t) {
		success(t._0,t._1);
	},null == failure?function(_) {
	}:failure);
};
var thx_promise_PromiseNil = function() { };
thx_promise_PromiseNil.__name__ = ["thx","promise","PromiseNil"];
thx_promise_PromiseNil.join = function(p1,p2) {
	return thx_promise_Promise.create(function(resolve,reject) {
		thx_promise_Promises.join(p1,p2).either(function(t) {
			resolve(t._1);
		},function(e) {
			reject(e);
		});
	});
};
var thx_promise_PromiseValue = { __ename__ : ["thx","promise","PromiseValue"], __constructs__ : ["Failure","Success"] };
thx_promise_PromiseValue.Failure = function(err) { var $x = ["Failure",0,err]; $x.__enum__ = thx_promise_PromiseValue; $x.toString = $estr; return $x; };
thx_promise_PromiseValue.Success = function(value) { var $x = ["Success",1,value]; $x.__enum__ = thx_promise_PromiseValue; $x.toString = $estr; return $x; };
var thx_stream_Bus = function() {
	var _g = this;
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
	,emit: function(value) {
		switch(value[1]) {
		case 0:
			var v = value[2];
			var _g = 0;
			var _g1 = this.downStreams.slice();
			while(_g < _g1.length) {
				var stream = _g1[_g];
				++_g;
				stream.pulse(v);
			}
			break;
		case 2:
			var e = value[2];
			var _g2 = 0;
			var _g11 = this.downStreams.slice();
			while(_g2 < _g11.length) {
				var stream1 = _g11[_g2];
				++_g2;
				stream1.fail(e);
			}
			break;
		case 1:
			switch(value[2]) {
			case true:
				var _g3 = 0;
				var _g12 = this.downStreams.slice();
				while(_g3 < _g12.length) {
					var stream2 = _g12[_g3];
					++_g3;
					stream2.cancel();
				}
				break;
			case false:
				var _g4 = 0;
				var _g13 = this.downStreams.slice();
				while(_g4 < _g13.length) {
					var stream3 = _g13[_g4];
					++_g4;
					stream3.end();
				}
				break;
			}
			break;
		}
	}
	,pulse: function(value) {
		this.emit(thx_stream_StreamValue.Pulse(value));
	}
	,fail: function(error) {
		this.emit(thx_stream_StreamValue.Failure(error));
	}
	,end: function() {
		this.emit(thx_stream_StreamValue.End(false));
	}
	,cancel: function() {
		this.emit(thx_stream_StreamValue.End(true));
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
	,__class__: thx_stream_Bus
});
var thx_stream_EmitterStrings = function() { };
thx_stream_EmitterStrings.__name__ = ["thx","stream","EmitterStrings"];
thx_stream_EmitterStrings.toBool = function(emitter) {
	return emitter.mapValue(function(s) {
		return s != null && s != "";
	});
};
var thx_stream_EmitterInts = function() { };
thx_stream_EmitterInts.__name__ = ["thx","stream","EmitterInts"];
thx_stream_EmitterInts.toBool = function(emitter) {
	return emitter.mapValue(function(i) {
		return i != 0;
	});
};
var thx_stream_Emitters = function() { };
thx_stream_Emitters.__name__ = ["thx","stream","Emitters"];
thx_stream_Emitters.skipNull = function(emitter) {
	return emitter.filterValue(function(value) {
		return null != value;
	});
};
var thx_stream_EmitterBools = function() { };
thx_stream_EmitterBools.__name__ = ["thx","stream","EmitterBools"];
thx_stream_EmitterBools.negate = function(emitter) {
	return emitter.mapValue(function(v) {
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
			case 2:
				var e = r[2];
				stream.fail(e);
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
thx_stream_EmitterEmitters.flatten = function(emitter) {
	return new thx_stream_Emitter(function(stream) {
		emitter.init(new thx_stream_Stream(function(r) {
			switch(r[1]) {
			case 0:
				var arr = r[2];
				arr.map($bind(stream,stream.pulse));
				break;
			case 2:
				var e = r[2];
				stream.fail(e);
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
	return emitter.mapValue(function(v) {
		return v._0;
	});
};
thx_stream_EmitterValues.right = function(emitter) {
	return emitter.mapValue(function(v) {
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
	,pulse: function(v) {
		this.subscriber(thx_stream_StreamValue.Pulse(v));
	}
	,end: function() {
		this.finalize(thx_stream_StreamValue.End(false));
	}
	,cancel: function() {
		this.canceled = true;
		this.finalize(thx_stream_StreamValue.End(true));
	}
	,fail: function(error) {
		this.finalize(thx_stream_StreamValue.Failure(error));
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
var thx_stream_StreamValue = { __ename__ : ["thx","stream","StreamValue"], __constructs__ : ["Pulse","End","Failure"] };
thx_stream_StreamValue.Pulse = function(value) { var $x = ["Pulse",0,value]; $x.__enum__ = thx_stream_StreamValue; $x.toString = $estr; return $x; };
thx_stream_StreamValue.End = function(cancel) { var $x = ["End",1,cancel]; $x.__enum__ = thx_stream_StreamValue; $x.toString = $estr; return $x; };
thx_stream_StreamValue.Failure = function(err) { var $x = ["Failure",2,err]; $x.__enum__ = thx_stream_StreamValue; $x.toString = $estr; return $x; };
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
Math.NaN = Number.NaN;
Math.NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
Math.POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
Math.isFinite = function(i) {
	return isFinite(i);
};
Math.isNaN = function(i1) {
	return isNaN(i1);
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
var posToString = function(pos) {
	return pos;
};
thx_Assert.results = { add : function(assertion) {
	switch(assertion[1]) {
	case 1:
		var pos1 = assertion[3];
		var msg = assertion[2];
		throw new thx_core_Error(msg,null,pos1);
		break;
	case 2:
		var stack = assertion[3];
		var e = assertion[2];
		throw new thx_core_Error(Std.string(e),stack,{ fileName : "Assert.hx", lineNumber : 675, className : "thx.Assert", methodName : "__init__"});
		break;
	case 3:
		var stack = assertion[3];
		var e = assertion[2];
		throw new thx_core_Error(Std.string(e),stack,{ fileName : "Assert.hx", lineNumber : 675, className : "thx.Assert", methodName : "__init__"});
		break;
	case 4:
		var stack = assertion[3];
		var e = assertion[2];
		throw new thx_core_Error(Std.string(e),stack,{ fileName : "Assert.hx", lineNumber : 675, className : "thx.Assert", methodName : "__init__"});
		break;
	case 5:
		var msg1 = assertion[2];
		haxe_Log.trace(msg1,{ fileName : "Assert.hx", lineNumber : 677, className : "thx.Assert", methodName : "__init__"});
		break;
	case 0:
		var pos2 = assertion[2];
		break;
	}
}};
var scope = ("undefined" !== typeof window && window) || ("undefined" !== typeof global && global) || this;
if(!scope.setImmediate) scope.setImmediate = function(callback) {
	scope.setTimeout(callback,0);
};
Config.icons = { add : "plus-circle", remove : "ban", dropdown : "reorder", checked : "dot-circle-o", unchecked : "circle-o", switchtype : "bolt", code : "bolt", value : "pencil", reference : "link"};
Config.selectors = { app : ".card"};
PropertyFeeder.classes = [{ display : "bold", name : "strong"},{ display : "italic", name : "emphasis"}];
cards_model_Runtime.pattern = new EReg("\\$\\.(.+?)\\b","");
cards_model_ref_EmptyParent.instance = new cards_model_ref_EmptyParent();
cards_model_ref_Ref.reField = new EReg("^\\.?([^.\\[]+)","");
cards_model_ref_Ref.reIndex = new EReg("^\\[(\\d+)\\]","");
cards_types_CodeTransform.datePattern = new EReg("Date\\(-?\\d+(:?\\.\\d+)?(:?e-?\\d+)?\\)","");
cards_types_CodeTransform.PATTERN = new EReg("^\\s*\\$\\.([a-z](:?(\\.|\\[\\d+\\])?[a-z0-9]*)*)\\s*$","");
cards_ui_ContextField.tooltip = new cards_ui_widgets_Tooltip({ classes : "tooltip error"});
haxe_ds_ObjectMap.count = 0;
thx_core_Ints.pattern_parse = new EReg("^[+-]?(\\d+|0x[0-9A-F]+)$","i");
thx_core_Strings._reSplitWC = new EReg("(\r\n|\n\r|\n|\r)","g");
thx_core_Strings._reReduceWS = new EReg("\\s+","");
thx_core_Strings._reStripTags = new EReg("(<[a-z]+[^>/]*/?>|</[a-z]+>)","i");
thx_core_Strings._reCollapse = new EReg("\\s+","g");
thx_core_Strings.__ucwordsPattern = new EReg("[^a-zA-Z]([a-z])","g");
thx_core_Strings.__ucwordswsPattern = new EReg("\\s[a-z]","g");
thx_core_Strings.__alphaNumPattern = new EReg("^[a-z0-9]+$","i");
thx_core_Strings.__digitsPattern = new EReg("^[0-9]+$","");
thx_core_UUID.itoh = "0123456789ABCDEF";
thx_promise_Promise.nil = thx_promise_Promise.value(thx_core_Nil.nil);
udom_Query.doc = document;
Main.main();
})();

//# sourceMappingURL=app.js.map