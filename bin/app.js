(function () { "use strict";
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
var Main = function() { };
Main.__name__ = ["Main"];
Main.main = function() {
	thx.stream.dom.Dom.ready().success(function(_) {
		var container = udom.Query.first(".container");
		var data = new cards.model.Data({ });
		var model = new cards.model.Model(data);
		var component = new cards.components.Component({ template : "<div></div>"});
		component.appendTo(container);
		var html = new cards.properties.HTML(component);
		thx.stream.Timer.ofArray(["a","b","C","a","b","X","a","b","c"],400).feed(html.stream);
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
	add: function(x) {
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
	,__class__: cards.components.Component
};
cards.components.Properties = function(target) {
	this.target = target;
	this.properties = new haxe.ds.StringMap();
};
cards.components.Properties.__name__ = ["cards","components","Properties"];
cards.components.Properties.prototype = {
	removeAll: function() {
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
			_g.bus.emit(thx.stream.StreamValue.Pulse(path3));
			break;
		}
	};
};
cards.model.Model.__name__ = ["cards","model","Model"];
cards.model.Model.prototype = {
	__class__: cards.model.Model
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
	var set = new thx.core.Set();
	while(cards.model.Runtime.pattern.match(code)) {
		set.add(cards.model.Runtime.pattern.matched(1));
		code = cards.model.Runtime.pattern.matchedRight();
	}
	return thx.core.Iterators.order(set.iterator(),thx.core.Strings.compare);
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
	__class__: cards.model.Runtime
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
	add: function(name,type) {
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
	__class__: cards.model.Scope
};
cards.model.ref = {};
cards.model.ref.BaseRef = function(parent) {
	if(null != parent) this.parent = parent; else this.parent = cards.model.ref.EmptyParent.instance;
};
cards.model.ref.BaseRef.__name__ = ["cards","model","ref","BaseRef"];
cards.model.ref.BaseRef.prototype = {
	getRoot: function() {
		var ref = this;
		while(!js.Boot.__instanceof(ref.parent,cards.model.ref.EmptyParent)) ref = ref.parent;
		return ref;
	}
	,__class__: cards.model.ref.BaseRef
};
cards.model.ref.IParentRef = function() { };
cards.model.ref.IParentRef.__name__ = ["cards","model","ref","IParentRef"];
cards.model.ref.IParentRef.prototype = {
	__class__: cards.model.ref.IParentRef
};
cards.model.ref.IRef = function() { };
cards.model.ref.IRef.__name__ = ["cards","model","ref","IRef"];
cards.model.ref.IRef.prototype = {
	__class__: cards.model.ref.IRef
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
		if(terminal == null) terminal = true;
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
	get: function() {
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
	dispose: function() {
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
	transform: function(value) {
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
cards.properties.HTML = function(component,defaultHTML) {
	cards.properties.StringProperty.call(this,null == defaultHTML?component.el.innerHTML:defaultHTML,component,"html");
	this.stream.subscribe(thx.stream.dom.Dom.subscribeHTML(component.el));
};
cards.properties.HTML.__name__ = ["cards","properties","HTML"];
cards.properties.HTML.__super__ = cards.properties.StringProperty;
cards.properties.HTML.prototype = $extend(cards.properties.StringProperty.prototype,{
	__class__: cards.properties.HTML
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
var thx = {};
thx.core = {};
thx.core.Arrays = function() { };
thx.core.Arrays.__name__ = ["thx","core","Arrays"];
thx.core.Arrays.same = function(a,b,eq) {
	if(a == null || b == null || a.length != b.length) return false;
	if(null == eq) eq = thx.core.Function.equality;
	var _g1 = 0;
	var _g = a.length;
	while(_g1 < _g) {
		var i = _g1++;
		if(!eq(a[i],b[i])) return false;
	}
	return true;
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
thx.core.Arrays.eachPair = function(arr,handler) {
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
thx.core.Arrays.contains = function(arr,element,eq) {
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
thx.core.Arrays.shuffle = function(a) {
	var t = thx.core.Ints.range(a.length);
	var arr = [];
	while(t.length > 0) {
		var pos = Std.random(t.length);
		var index = t[pos];
		t.splice(pos,1);
		arr.push(a[index]);
	}
	return arr;
};
thx.core.Arrays.extract = function(a,f) {
	var _g1 = 0;
	var _g = a.length;
	while(_g1 < _g) {
		var i = _g1++;
		if(f(a[i])) return a.splice(i,1)[0];
	}
	return null;
};
thx.core.Error = function(message,stack,pos) {
	this.message = message;
	if(null == stack) {
		stack = haxe.CallStack.exceptionStack();
		if(stack.length == 0) stack = haxe.CallStack.callStack();
	}
	this.stack = stack;
	this.pos = pos;
};
thx.core.Error.__name__ = ["thx","core","Error"];
thx.core.Error.fromDynamic = function(err,pos) {
	if(js.Boot.__instanceof(err,thx.core.Error)) return err;
	return new thx.core.Error("" + Std.string(err),null,pos);
};
thx.core.Error.__super__ = Error;
thx.core.Error.prototype = $extend(Error.prototype,{
	__class__: thx.core.Error
});
thx.core.Function0 = function() { };
thx.core.Function0.__name__ = ["thx","core","Function0"];
thx.core.Function0.noop = function() {
};
thx.core.Function0.join = function(fa,fb) {
	return function() {
		fa();
		fb();
	};
};
thx.core.Function0.once = function(f) {
	return function() {
		f();
		f = function() {
		};
	};
};
thx.core.Function1 = function() { };
thx.core.Function1.__name__ = ["thx","core","Function1"];
thx.core.Function1.noop = function(_) {
};
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
thx.core.Function = function() { };
thx.core.Function.__name__ = ["thx","core","Function"];
thx.core.Function.equality = function(a,b) {
	return a == b;
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
thx.core.Iterables = function() { };
thx.core.Iterables.__name__ = ["thx","core","Iterables"];
thx.core.Iterables.map = function(it,f) {
	return thx.core.Iterators.map($iterator(it)(),f);
};
thx.core.Iterables.eachPair = function(it,handler) {
	return thx.core.Iterators.eachPair($iterator(it)(),handler);
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
thx.core.Iterables.filter = function(it,predicate) {
	return thx.core.Iterators.filter($iterator(it)(),predicate);
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
thx.core.Iterators.eachPair = function(it,handler) {
	thx.core.Arrays.eachPair(thx.core.Iterators.toArray(it),handler);
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
thx.core.Iterators.filter = function(it,predicate) {
	return thx.core.Iterators.reduce(it,function(acc,item) {
		if(predicate(item)) acc.push(item);
		return acc;
	},[]);
};
thx.core.Nil = { __ename__ : ["thx","core","Nil"], __constructs__ : ["nil"] };
thx.core.Nil.nil = ["nil",0];
thx.core.Nil.nil.__enum__ = thx.core.Nil;
thx.core.Objects = function() { };
thx.core.Objects.__name__ = ["thx","core","Objects"];
thx.core.Objects.isEmpty = function(o) {
	return Reflect.fields(o).length == 0;
};
thx.core.Options = function() { };
thx.core.Options.__name__ = ["thx","core","Options"];
thx.core.Options.toValue = function(option) {
	switch(option[1]) {
	case 1:
		return null;
	case 0:
		var v = option[2];
		return v;
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
	return thx.core.Options.equals(a,thx.core.Options.toOption(b));
};
thx.core.Set = function() {
	this._v = [];
	this.length = 0;
};
thx.core.Set.__name__ = ["thx","core","Set"];
thx.core.Set.ofArray = function(arr) {
	var set = new thx.core.Set();
	var _g = 0;
	while(_g < arr.length) {
		var item = arr[_g];
		++_g;
		set.add(item);
	}
	return set;
};
thx.core.Set.prototype = {
	add: function(v) {
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
	,__class__: thx.core.Set
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
thx.core.Timer = function() { };
thx.core.Timer.__name__ = ["thx","core","Timer"];
thx.core.Timer.repeat = function(callback,delay) {
	return setInterval(callback,delay);
};
thx.core.Timer.delay = function(callback,delay) {
	return setTimeout(callback,delay);
};
thx.core.Timer.immediate = function(callback) {
	return setImmediate(callback);
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
thx.core._Tuple.Tuple0_Impl_.toTuple1 = function(this1,v) {
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
thx.core._Tuple.Tuple1_Impl_.toTuple2 = function(this1,v) {
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
thx.core._Tuple.Tuple2_Impl_.get__0 = function(this1) {
	return this1._0;
};
thx.core._Tuple.Tuple2_Impl_.get__1 = function(this1) {
	return this1._1;
};
thx.core._Tuple.Tuple2_Impl_.toTuple3 = function(this1,v) {
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
thx.core._Tuple.Tuple3_Impl_.get__0 = function(this1) {
	return this1._0;
};
thx.core._Tuple.Tuple3_Impl_.get__1 = function(this1) {
	return this1._1;
};
thx.core._Tuple.Tuple3_Impl_.get__2 = function(this1) {
	return this1._2;
};
thx.core._Tuple.Tuple3_Impl_.toTuple4 = function(this1,v) {
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
thx.core._Tuple.Tuple4_Impl_.get__0 = function(this1) {
	return this1._0;
};
thx.core._Tuple.Tuple4_Impl_.get__1 = function(this1) {
	return this1._1;
};
thx.core._Tuple.Tuple4_Impl_.get__2 = function(this1) {
	return this1._2;
};
thx.core._Tuple.Tuple4_Impl_.get__3 = function(this1) {
	return this1._3;
};
thx.core._Tuple.Tuple4_Impl_.toTuple5 = function(this1,v) {
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
thx.core._Tuple.Tuple5_Impl_.get__0 = function(this1) {
	return this1._0;
};
thx.core._Tuple.Tuple5_Impl_.get__1 = function(this1) {
	return this1._1;
};
thx.core._Tuple.Tuple5_Impl_.get__2 = function(this1) {
	return this1._2;
};
thx.core._Tuple.Tuple5_Impl_.get__3 = function(this1) {
	return this1._3;
};
thx.core._Tuple.Tuple5_Impl_.get__4 = function(this1) {
	return this1._4;
};
thx.core._Tuple.Tuple5_Impl_.toTuple6 = function(this1,v) {
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
thx.core._Tuple.Tuple6_Impl_.get__0 = function(this1) {
	return this1._0;
};
thx.core._Tuple.Tuple6_Impl_.get__1 = function(this1) {
	return this1._1;
};
thx.core._Tuple.Tuple6_Impl_.get__2 = function(this1) {
	return this1._2;
};
thx.core._Tuple.Tuple6_Impl_.get__3 = function(this1) {
	return this1._3;
};
thx.core._Tuple.Tuple6_Impl_.get__4 = function(this1) {
	return this1._4;
};
thx.core._Tuple.Tuple6_Impl_.get__5 = function(this1) {
	return this1._5;
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
	return thx.core.ValueTypes.toString(Type["typeof"](a)) == thx.core.ValueTypes.toString(Type["typeof"](b));
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
thx.core.ValueTypes.typeAsString = function(value) {
	return thx.core.ValueTypes.toString(Type["typeof"](value));
};
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
thx.promise = {};
thx.promise.Deferred = function() {
	this.promise = new thx.promise.Promise();
};
thx.promise.Deferred.__name__ = ["thx","promise","Deferred"];
thx.promise.Deferred.prototype = {
	rejectWith: function(error) {
		return this.fulfill(thx.promise.PromiseValue.Failure(thx.core.Error.fromDynamic(error,{ fileName : "Deferred.hx", lineNumber : 13, className : "thx.promise.Deferred", methodName : "rejectWith"})));
	}
	,reject: function(error) {
		return this.fulfill(thx.promise.PromiseValue.Failure(error));
	}
	,resolve: function(value) {
		return this.fulfill(thx.promise.PromiseValue.Success(value));
	}
	,fulfill: function(result) {
		return this.promise.setState(result);
	}
	,toString: function() {
		return "Deferred";
	}
	,__class__: thx.promise.Deferred
};
thx.promise.Promise = function() {
	this.handlers = [];
	this.state = haxe.ds.Option.None;
};
thx.promise.Promise.__name__ = ["thx","promise","Promise"];
thx.promise.Promise.create = function(callback) {
	var deferred = new thx.promise.Deferred();
	callback($bind(deferred,deferred.resolve),$bind(deferred,deferred.reject));
	return deferred.promise;
};
thx.promise.Promise.fulfilled = function(callback) {
	var deferred = new thx.promise.Deferred();
	callback($bind(deferred,deferred.fulfill));
	return deferred.promise;
};
thx.promise.Promise.all = function(arr) {
	return thx.promise.Promise.create(function(resolve,reject) {
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
thx.promise.Promise.value = function(v) {
	return thx.promise.Promise.create(function(resolve,_) {
		resolve(v);
	});
};
thx.promise.Promise.error = function(err) {
	return thx.promise.Promise.create(function(_,reject) {
		reject(err);
	});
};
thx.promise.Promise.prototype = {
	then: function(handler) {
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
		return thx.promise.Promise.fulfilled(function(fulfill) {
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
			return thx.promise.Promise.error(err);
		});
	}
	,mapFailure: function(failure) {
		return this.mapEither(function(value) {
			return thx.promise.Promise.value(value);
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
				this.state = haxe.ds.Option.Some(newstate);
				break;
			case 0:
				var r = _g[2];
				throw new thx.core.Error("promise was already " + Std.string(r) + ", can't apply new state " + Std.string(newstate),null,{ fileName : "Promise.hx", lineNumber : 128, className : "thx.promise.Promise", methodName : "setState"});
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
	,__class__: thx.promise.Promise
};
thx.promise.Promises = function() { };
thx.promise.Promises.__name__ = ["thx","promise","Promises"];
thx.promise.Promises.log = function(promise,prefix) {
	if(prefix == null) prefix = "";
	return promise.either(function(r) {
		haxe.Log.trace("" + prefix + " SUCCESS: " + Std.string(r),{ fileName : "Promise.hx", lineNumber : 148, className : "thx.promise.Promises", methodName : "log"});
	},function(e) {
		haxe.Log.trace("" + prefix + " ERROR: " + e.toString(),{ fileName : "Promise.hx", lineNumber : 149, className : "thx.promise.Promises", methodName : "log"});
	});
};
thx.promise.Promises.delay = function(p,interval) {
	return p.map(function(r) {
		return thx.promise.Promise.fulfilled(null == interval?function(fulfill) {
			thx.core.Timer.immediate((function(f,a1) {
				return function() {
					return f(a1);
				};
			})(fulfill,r));
		}:function(fulfill1) {
			thx.core.Timer.delay((function(f1,a11) {
				return function() {
					return f1(a11);
				};
			})(fulfill1,r),interval);
		});
	});
};
thx.promise.Promises.join = function(p1,p2) {
	return thx.promise.Promise.create(function(resolve,reject) {
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
thx.promise.PromiseTuple6 = function() { };
thx.promise.PromiseTuple6.__name__ = ["thx","promise","PromiseTuple6"];
thx.promise.PromiseTuple6.mapTuple = function(promise,success) {
	return promise.mapSuccess(function(t) {
		return success(t._0,t._1,t._2,t._3,t._4,t._5);
	});
};
thx.promise.PromiseTuple6.tuple = function(promise,success,failure) {
	return promise.either(function(t) {
		success(t._0,t._1,t._2,t._3,t._4,t._5);
	},null == failure?function(_) {
	}:failure);
};
thx.promise.PromiseTuple5 = function() { };
thx.promise.PromiseTuple5.__name__ = ["thx","promise","PromiseTuple5"];
thx.promise.PromiseTuple5.join = function(p1,p2) {
	return thx.promise.Promise.create(function(resolve,reject) {
		thx.promise.Promises.join(p1,p2).either(function(t) {
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
thx.promise.PromiseTuple5.mapTuple = function(promise,success) {
	return promise.mapSuccess(function(t) {
		return success(t._0,t._1,t._2,t._3,t._4);
	});
};
thx.promise.PromiseTuple5.tuple = function(promise,success,failure) {
	return promise.either(function(t) {
		success(t._0,t._1,t._2,t._3,t._4);
	},null == failure?function(_) {
	}:failure);
};
thx.promise.PromiseTuple4 = function() { };
thx.promise.PromiseTuple4.__name__ = ["thx","promise","PromiseTuple4"];
thx.promise.PromiseTuple4.join = function(p1,p2) {
	return thx.promise.Promise.create(function(resolve,reject) {
		thx.promise.Promises.join(p1,p2).either(function(t) {
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
thx.promise.PromiseTuple4.mapTuple = function(promise,success) {
	return promise.mapSuccess(function(t) {
		return success(t._0,t._1,t._2,t._3);
	});
};
thx.promise.PromiseTuple4.tuple = function(promise,success,failure) {
	return promise.either(function(t) {
		success(t._0,t._1,t._2,t._3);
	},null == failure?function(_) {
	}:failure);
};
thx.promise.PromiseTuple3 = function() { };
thx.promise.PromiseTuple3.__name__ = ["thx","promise","PromiseTuple3"];
thx.promise.PromiseTuple3.join = function(p1,p2) {
	return thx.promise.Promise.create(function(resolve,reject) {
		thx.promise.Promises.join(p1,p2).either(function(t) {
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
thx.promise.PromiseTuple3.mapTuple = function(promise,success) {
	return promise.mapSuccess(function(t) {
		return success(t._0,t._1,t._2);
	});
};
thx.promise.PromiseTuple3.tuple = function(promise,success,failure) {
	return promise.either(function(t) {
		success(t._0,t._1,t._2);
	},null == failure?function(_) {
	}:failure);
};
thx.promise.PromiseTuple2 = function() { };
thx.promise.PromiseTuple2.__name__ = ["thx","promise","PromiseTuple2"];
thx.promise.PromiseTuple2.join = function(p1,p2) {
	return thx.promise.Promise.create(function(resolve,reject) {
		thx.promise.Promises.join(p1,p2).either(function(t) {
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
thx.promise.PromiseTuple2.mapTuple = function(promise,success) {
	return promise.mapSuccess(function(t) {
		return success(t._0,t._1);
	});
};
thx.promise.PromiseTuple2.tuple = function(promise,success,failure) {
	return promise.either(function(t) {
		success(t._0,t._1);
	},null == failure?function(_) {
	}:failure);
};
thx.promise.PromiseNil = function() { };
thx.promise.PromiseNil.__name__ = ["thx","promise","PromiseNil"];
thx.promise.PromiseNil.join = function(p1,p2) {
	return thx.promise.Promise.create(function(resolve,reject) {
		thx.promise.Promises.join(p1,p2).either(function(t) {
			resolve(t._1);
		},function(e) {
			reject(e);
		});
	});
};
thx.promise.PromiseValue = { __ename__ : ["thx","promise","PromiseValue"], __constructs__ : ["Failure","Success"] };
thx.promise.PromiseValue.Failure = function(err) { var $x = ["Failure",0,err]; $x.__enum__ = thx.promise.PromiseValue; return $x; };
thx.promise.PromiseValue.Success = function(value) { var $x = ["Success",1,value]; $x.__enum__ = thx.promise.PromiseValue; return $x; };
thx.stream = {};
thx.stream.Emitter = function(init) {
	this.init = init;
};
thx.stream.Emitter.__name__ = ["thx","stream","Emitter"];
thx.stream.Emitter.create = function(init) {
	return new thx.stream.Emitter(init);
};
thx.stream.Emitter.prototype = {
	sign: function(subscriber) {
		var stream = new thx.stream.Stream(subscriber);
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
		var stream = new thx.stream.Stream(function(r) {
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
		var stream = new thx.stream.Stream(null);
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
		var stream = new thx.stream.Stream(null);
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
		return new thx.stream.Emitter(function(stream) {
			var id = setTimeout(function() {
				_g.init(stream);
			},time);
			stream.addCleanUp((function(f,id1) {
				return function() {
					return f(id1);
				};
			})(thx.core.Timer.clear,id));
		});
	}
	,map: function(f) {
		var _g = this;
		return new thx.stream.Emitter(function(stream) {
			_g.init(new thx.stream.Stream(function(r) {
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
			return thx.promise.Promise.value(f(v));
		});
	}
	,takeUntil: function(f) {
		var _g = this;
		return new thx.stream.Emitter(function(stream) {
			var instream = null;
			instream = new thx.stream.Stream(function(r) {
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
				return thx.promise.Promise.value(counter++ < count);
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
		return new thx.stream.Emitter(function(stream) {
			_g.init(new thx.stream.Stream(function(r) {
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
			return thx.promise.Promise.value(f(v));
		});
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
		return new thx.stream.Emitter(function(stream) {
			_g.init(stream);
			other.init(stream);
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
			if(null == v) return haxe.ds.Option.None; else return haxe.ds.Option.Some(v);
		});
	}
	,toNil: function() {
		return this.mapValue(function(_) {
			return thx.core.Nil.nil;
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
			haxe.Log.trace("" + prefix + Std.string(v),posInfo);
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
	,__class__: thx.stream.Emitter
};
thx.stream.Bus = function() {
	var _g = this;
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
	emit: function(value) {
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
		this.emit(thx.stream.StreamValue.Pulse(value));
	}
	,fail: function(error) {
		this.emit(thx.stream.StreamValue.Failure(error));
	}
	,end: function() {
		this.emit(thx.stream.StreamValue.End(false));
	}
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
	,__class__: thx.stream.Bus
});
thx.stream.EmitterStrings = function() { };
thx.stream.EmitterStrings.__name__ = ["thx","stream","EmitterStrings"];
thx.stream.EmitterStrings.toBool = function(emitter) {
	return emitter.mapValue(function(s) {
		return s != null && s != "";
	});
};
thx.stream.EmitterOptions = function() { };
thx.stream.EmitterOptions.__name__ = ["thx","stream","EmitterOptions"];
thx.stream.EmitterOptions.filterOption = function(emitter) {
	return emitter.filterValue(function(opt) {
		return thx.core.Options.toBool(opt);
	}).mapValue(function(opt1) {
		return thx.core.Options.toValue(opt1);
	});
};
thx.stream.EmitterOptions.toValue = function(emitter) {
	return emitter.mapValue(function(opt) {
		return thx.core.Options.toValue(opt);
	});
};
thx.stream.EmitterOptions.toBool = function(emitter) {
	return emitter.mapValue(function(opt) {
		return thx.core.Options.toBool(opt);
	});
};
thx.stream.Emitters = function() { };
thx.stream.Emitters.__name__ = ["thx","stream","Emitters"];
thx.stream.Emitters.skipNull = function(emitter) {
	return emitter.filterValue(function(value) {
		return null != value;
	});
};
thx.stream.EmitterBools = function() { };
thx.stream.EmitterBools.__name__ = ["thx","stream","EmitterBools"];
thx.stream.EmitterBools.negate = function(emitter) {
	return emitter.mapValue(function(v) {
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
thx.stream.EmitterValues = function() { };
thx.stream.EmitterValues.__name__ = ["thx","stream","EmitterValues"];
thx.stream.EmitterValues.left = function(emitter) {
	return emitter.mapValue(function(v) {
		return v._0;
	});
};
thx.stream.EmitterValues.right = function(emitter) {
	return emitter.mapValue(function(v) {
		return v._1;
	});
};
thx.stream.IStream = function() { };
thx.stream.IStream.__name__ = ["thx","stream","IStream"];
thx.stream.IStream.prototype = {
	__class__: thx.stream.IStream
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
	addCleanUp: function(f) {
		this.cleanUps.push(f);
	}
	,pulse: function(v) {
		this.subscriber(thx.stream.StreamValue.Pulse(v));
	}
	,end: function() {
		this.finalize(thx.stream.StreamValue.End(false));
	}
	,cancel: function() {
		this.canceled = true;
		this.finalize(thx.stream.StreamValue.End(true));
	}
	,fail: function(error) {
		this.finalize(thx.stream.StreamValue.Failure(error));
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
thx.stream.StreamValue = { __ename__ : ["thx","stream","StreamValue"], __constructs__ : ["Pulse","End","Failure"] };
thx.stream.StreamValue.Pulse = function(value) { var $x = ["Pulse",0,value]; $x.__enum__ = thx.stream.StreamValue; return $x; };
thx.stream.StreamValue.End = function(cancel) { var $x = ["End",1,cancel]; $x.__enum__ = thx.stream.StreamValue; return $x; };
thx.stream.StreamValue.Failure = function(err) { var $x = ["Failure",2,err]; $x.__enum__ = thx.stream.StreamValue; return $x; };
thx.stream.Timer = function() { };
thx.stream.Timer.__name__ = ["thx","stream","Timer"];
thx.stream.Timer.repeat = function(repetitions,delay) {
	return thx.stream.Timer.beacon(delay).take(repetitions);
};
thx.stream.Timer.beacon = function(delay) {
	return thx.stream.Emitter.create(function(stream) {
		var id = thx.core.Timer.repeat((function(f,v) {
			return function() {
				return f(v);
			};
		})($bind(stream,stream.pulse),thx.core.Nil.nil),delay);
		stream.addCleanUp((function(f1,id1) {
			return function() {
				return f1(id1);
			};
		})(thx.core.Timer.clear,id));
	});
};
thx.stream.Timer.sequenceNil = function(repetitions,delay,build) {
	return thx.stream.Timer.repeat(repetitions,delay).mapValue(build);
};
thx.stream.Timer.sequence = function(repetitions,delay,build) {
	return thx.stream.Timer.repeat(repetitions,delay).mapValue(function(_) {
		return build();
	});
};
thx.stream.Timer.sequencei = function(repetitions,delay,build) {
	return thx.stream.Timer.sequence(repetitions,delay,(function($this) {
		var $r;
		var i = 0;
		$r = function() {
			return build(i++);
		};
		return $r;
	}(this)));
};
thx.stream.Timer.ofArray = function(arr,delay) {
	return thx.stream.Timer.sequencei(arr.length,delay,function(i) {
		return arr[i];
	});
};
thx.stream.Value = function(value) {
	var _g = this;
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
thx.stream.Value.__super__ = thx.stream.Emitter;
thx.stream.Value.prototype = $extend(thx.stream.Emitter.prototype,{
	get: function() {
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
	,__class__: thx.stream.Value
});
thx.stream.dom = {};
thx.stream.dom.Dom = function() { };
thx.stream.dom.Dom.__name__ = ["thx","stream","dom","Dom"];
thx.stream.dom.Dom.ready = function() {
	return thx.promise.Promise.create(function(resolve,_) {
		window.document.addEventListener("DOMContentLoaded",function(_1) {
			resolve(thx.core.Nil.nil);
		},false);
	});
};
thx.stream.dom.Dom.streamEvent = function(el,name,capture) {
	if(capture == null) capture = false;
	return thx.stream.Emitter.create(function(stream) {
		el.addEventListener(name,$bind(stream,stream.pulse),capture);
		stream.addCleanUp(function() {
			el.removeEventListener(name,$bind(stream,stream.pulse),capture);
		});
	});
};
thx.stream.dom.Dom.streamMouseEvent = function(el,name,capture) {
	if(capture == null) capture = false;
	return thx.stream.dom.Dom.streamEvent(el,name,capture);
};
thx.stream.dom.Dom.streamKey = function(el,name,capture) {
	if(capture == null) capture = false;
	return thx.stream.Emitter.create((function($this) {
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
thx.stream.dom.Dom.streamClick = function(el,capture) {
	if(capture == null) capture = false;
	return thx.stream.dom.Dom.streamEvent(el,"click",capture);
};
thx.stream.dom.Dom.streamInput = function(el,capture) {
	if(capture == null) capture = false;
	return thx.stream.dom.Dom.streamEvent(el,"input",capture).mapValue(function(_) {
		return el.value;
	});
};
thx.stream.dom.Dom.subscribeText = function(el) {
	return function(text) {
		el.innerText = text;
	};
};
thx.stream.dom.Dom.subscribeHTML = function(el) {
	return function(html) {
		el.innerHTML = html;
	};
};
thx.stream.dom.Dom.subscribeFocus = function(el) {
	return function(focus) {
		if(focus) el.focus(); else el.blur();
	};
};
thx.stream.dom.Dom.subscribeAttribute = function(el,name) {
	return function(value) {
		if(null == value) el.removeAttribute(name); else el.setAttribute(name,value);
	};
};
thx.stream.dom.Dom.subscribeToggleAttribute = function(el,name,value) {
	if(null == value) value = el.getAttribute(name);
	return function(on) {
		if(on) el.removeAttribute(name); else el.setAttribute(name,value);
	};
};
thx.stream.dom.Dom.subscribeToggleClass = function(el,name) {
	return function(on) {
		if(on) el.classList.remove(name); else el.classList.add(name);
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
var scope = ("undefined" !== typeof window && window) || ("undefined" !== typeof global && global) || this;
if(!scope.setImmediate) scope.setImmediate = function(callback) {
	scope.setTimeout(callback,0);
};
cards.model.Runtime.pattern = new EReg("\\$\\.(.+?)\\b","");
cards.model.ref.EmptyParent.instance = new cards.model.ref.EmptyParent();
cards.model.ref.Ref.reField = new EReg("^\\.?([^.\\[]+)","");
cards.model.ref.Ref.reIndex = new EReg("^\\[(\\d+)\\]","");
haxe.ds.ObjectMap.count = 0;
thx.core.Ints.pattern_parse = new EReg("^[+-]?(\\d+|0x[0-9A-F]+)$","i");
thx.core.Strings._reSplitWC = new EReg("(\r\n|\n\r|\n|\r)","g");
thx.core.Strings._reReduceWS = new EReg("\\s+","");
thx.core.Strings._reStripTags = new EReg("(<[a-z]+[^>/]*/?>|</[a-z]+>)","i");
thx.core.Strings._reCollapse = new EReg("\\s+","g");
thx.core.Strings.__ucwordsPattern = new EReg("[^a-zA-Z]([a-z])","g");
thx.core.Strings.__ucwordswsPattern = new EReg("\\s[a-z]","g");
thx.core.Strings.__alphaNumPattern = new EReg("^[a-z0-9]+$","i");
thx.core.Strings.__digitsPattern = new EReg("^[0-9]+$","");
thx.promise.Promise.nil = thx.promise.Promise.value(thx.core.Nil.nil);
udom.Query.doc = document;
Main.main();
})();

//# sourceMappingURL=app.js.map