(function () { "use strict";
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
var Main = function(container) {
	this.container = container;
	this.demos = window.document.createElement("div");
	this.demos.className = "demos";
	this.output = window.document.createElement("div");
	this.output.className = "output";
	this.focus = window.document.createElement("div");
	this.focus.className = "focus";
	container.appendChild(this.demos);
	container.appendChild(this.focus);
	container.appendChild(this.output);
};
Main.__name__ = ["Main"];
Main.main = function() {
	thx.stream.dom.Dom.ready().success(function(_) {
		var main = new Main(udom.Query.first(".container"));
		main.addDemo("array editor with StringType",function(el) {
			var editor = new cards.ui.input.ArrayEditor(el,cards.model.SchemaType.StringType);
			var _g = 0;
			while(_g < 3) {
				var i = _g++;
				editor.pushItem((function($this) {
					var $r;
					var _1 = "f " + i;
					$r = { _0 : cards.model.SchemaType.StringType, _1 : _1};
					return $r;
				}(this)));
			}
			var _g1 = 0;
			while(_g1 < 3) {
				var i1 = _g1++;
				editor.insertItem(i1 * 2,(function($this) {
					var $r;
					var _11 = "s " + i1;
					$r = { _0 : cards.model.SchemaType.StringType, _1 : _11};
					return $r;
				}(this)));
			}
			return editor;
		});
		main.addDemo("array editor with ArrayType<CodeType>",function(el1) {
			return new cards.ui.input.ArrayEditor(el1,cards.model.SchemaType.ArrayType(cards.model.SchemaType.CodeType));
		});
		main.addDemo("text editor",function(el2) {
			return new cards.ui.input.TextEditor(el2);
		});
		main.addDemo("code editor",function(el3) {
			return new cards.ui.input.CodeEditor(el3);
		});
		main.addDemo("reference editor",Main.toDo());
		main.addDemo("float editor",Main.toDo());
		main.addDemo("date editor",Main.toDo());
		main.addDemo("date time editor",Main.toDo());
		main.addDemo("bool editor",Main.toDo());
		main.addDemo("object editor",Main.toDo());
	});
};
Main.toDo = function() {
	return function(el) {
		el.textContent = "TODO";
		return null;
	};
};
Main.prototype = {
	container: null
	,demos: null
	,output: null
	,focus: null
	,addDemo: function(title,handler) {
		var heading = window.document.createElement("h2");
		var el = window.document.createElement("div");
		var sample = window.document.createElement("div");
		sample.className = "sample";
		el.className = "card";
		heading.textContent = title;
		sample.appendChild(heading);
		sample.appendChild(el);
		this.demos.appendChild(sample);
		var editor = handler(el);
		if(null == editor) return;
		editor.stream.mapValue(function(v) {
			return "content: " + cards.ui.input._TypedValue.TypedValue_Impl_.toString(v);
		}).subscribe(thx.stream.dom.Dom.subscribeText(this.output));
		editor.focus.withValue(true).mapValue(function(_) {
			return "focus: " + editor.toString();
		}).subscribe(thx.stream.dom.Dom.subscribeText(this.focus));
	}
	,__class__: Main
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
var Reflect = function() { };
Reflect.__name__ = ["Reflect"];
Reflect.field = function(o,field) {
	try {
		return o[field];
	} catch( e ) {
		return null;
	}
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
Std.random = function(x) {
	if(x <= 0) return 0; else return Math.floor(Math.random() * x);
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
cards.model.SchemaType = { __ename__ : ["cards","model","SchemaType"], __constructs__ : ["ArrayType","BoolType","DateType","FloatType","ObjectType","StringType","CodeType","ReferenceType"] };
cards.model.SchemaType.ArrayType = function(item) { var $x = ["ArrayType",0,item]; $x.__enum__ = cards.model.SchemaType; $x.toString = $estr; return $x; };
cards.model.SchemaType.BoolType = ["BoolType",1];
cards.model.SchemaType.BoolType.toString = $estr;
cards.model.SchemaType.BoolType.__enum__ = cards.model.SchemaType;
cards.model.SchemaType.DateType = ["DateType",2];
cards.model.SchemaType.DateType.toString = $estr;
cards.model.SchemaType.DateType.__enum__ = cards.model.SchemaType;
cards.model.SchemaType.FloatType = ["FloatType",3];
cards.model.SchemaType.FloatType.toString = $estr;
cards.model.SchemaType.FloatType.__enum__ = cards.model.SchemaType;
cards.model.SchemaType.ObjectType = function(fields) { var $x = ["ObjectType",4,fields]; $x.__enum__ = cards.model.SchemaType; $x.toString = $estr; return $x; };
cards.model.SchemaType.StringType = ["StringType",5];
cards.model.SchemaType.StringType.toString = $estr;
cards.model.SchemaType.StringType.__enum__ = cards.model.SchemaType;
cards.model.SchemaType.CodeType = ["CodeType",6];
cards.model.SchemaType.CodeType.toString = $estr;
cards.model.SchemaType.CodeType.__enum__ = cards.model.SchemaType;
cards.model.SchemaType.ReferenceType = ["ReferenceType",7];
cards.model.SchemaType.ReferenceType.toString = $estr;
cards.model.SchemaType.ReferenceType.__enum__ = cards.model.SchemaType;
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
cards.ui = {};
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
	,__class__: cards.ui.input.RouteEditor
});
cards.ui.input.ArrayEditor = function(container,innerType) {
	var _g2 = this;
	this.values = [];
	this.editors = [];
	this.currentIndex = thx.stream.Value.createOption();
	var options = { template : "<div class=\"editor array\"></div>", container : container};
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
								if(js.Boot.__instanceof(_g2.editors[index],cards.ui.input.IRouteEditor)) _g2.editors[index].diff.emit(thx.stream.StreamValue.Pulse({ _0 : path, _1 : diff})); else throw "unable to assign " + cards.ui.input._DiffAt.DiffAt_Impl_.toString(d) + " within ArrayEditor";
								break;
							default:
								throw "unable to assign " + cards.ui.input._DiffAt.DiffAt_Impl_.toString(d) + " within ArrayEditor";
							}
						} else throw "unable to assign " + cards.ui.input._DiffAt.DiffAt_Impl_.toString(d) + " within ArrayEditor";
						break;
					default:
						if(path.length > 0) {
							var first = path.shift();
							switch(first[1]) {
							case 1:
								var index = first[2];
								if(js.Boot.__instanceof(_g2.editors[index],cards.ui.input.IRouteEditor)) _g2.editors[index].diff.emit(thx.stream.StreamValue.Pulse({ _0 : path, _1 : diff})); else throw "unable to assign " + cards.ui.input._DiffAt.DiffAt_Impl_.toString(d) + " within ArrayEditor";
								break;
							default:
								throw "unable to assign " + cards.ui.input._DiffAt.DiffAt_Impl_.toString(d) + " within ArrayEditor";
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
							if(js.Boot.__instanceof(_g2.editors[index],cards.ui.input.IRouteEditor)) _g2.editors[index].diff.emit(thx.stream.StreamValue.Pulse({ _0 : path, _1 : diff})); else throw "unable to assign " + cards.ui.input._DiffAt.DiffAt_Impl_.toString(d) + " within ArrayEditor";
							break;
						default:
							throw "unable to assign " + cards.ui.input._DiffAt.DiffAt_Impl_.toString(d) + " within ArrayEditor";
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
						if(js.Boot.__instanceof(_g2.editors[index],cards.ui.input.IRouteEditor)) _g2.editors[index].diff.emit(thx.stream.StreamValue.Pulse({ _0 : path, _1 : diff})); else throw "unable to assign " + cards.ui.input._DiffAt.DiffAt_Impl_.toString(d) + " within ArrayEditor";
						break;
					default:
						throw "unable to assign " + cards.ui.input._DiffAt.DiffAt_Impl_.toString(d) + " within ArrayEditor";
					}
				} else throw "unable to assign " + cards.ui.input._DiffAt.DiffAt_Impl_.toString(d) + " within ArrayEditor";
			}
		}
		_g2.pulse();
	});
	thx.stream.EmitterOptions.filterOption(this.currentIndex.audit(function(_) {
		var prev = udom.Query.first("li.active",_g2.list);
		if(null == prev) return;
		prev.classList.remove("active");
	})).subscribe(function(index1) {
		udom.Query.first("li:nth-child(" + (index1 + 1) + ")",_g2.list).classList.add("active");
	});
	buttonAdd.clicks.subscribe(function(_1) {
		var index2;
		if(thx.core.Options.toBool(_g2.currentIndex.get())) index2 = thx.core.Options.toValue(_g2.currentIndex.get()) + 1; else index2 = _g2.values.length;
		_g2.diff.pulse((function($this) {
			var $r;
			var path1 = cards.ui.input._Path.Path_Impl_.intAsPath(index2);
			$r = { _0 : path1, _1 : cards.ui.input.Diff.AddItem};
			return $r;
		}(this)));
	});
	buttonRemove.clicks.subscribe(function(_2) {
		if(!thx.core.Options.toBool(_g2.currentIndex.get())) return;
		var index3 = thx.core.Options.toValue(_g2.currentIndex.get());
		_g2.diff.pulse((function($this) {
			var $r;
			var path2 = cards.ui.input._Path.Path_Impl_.intAsPath(index3);
			$r = { _0 : path2, _1 : cards.ui.input.Diff.RemoveItem};
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
			$r = { _0 : path, _1 : cards.ui.input.Diff.AddItem};
			return $r;
		}(this)));
		if(null != value) this.diff.pulse((function($this) {
			var $r;
			var path1 = cards.ui.input._Path.Path_Impl_.intAsPath(index);
			var diff = cards.ui.input.Diff.SetValue(value);
			$r = { _0 : path1, _1 : diff};
			return $r;
		}(this)));
	}
	,createEditor: function(index) {
		var _g = this;
		var item;
		var _this = window.document;
		item = _this.createElement("li");
		var ref = udom.Query.first("li:nth-child(" + (index + 1) + ")",this.list);
		if(null == ref) this.list.appendChild(item); else this.list.insertBefore(item,ref);
		var editor = cards.ui.input.EditorFactory.create(this.innerType,item,this.component);
		this.editors.splice(index,0,editor);
		editor.focus.feed(this.focus);
		editor.focus.withValue(true).mapValue(function(_) {
			return editor.component.el.parentElement;
		}).mapValue(function(el) {
			return udom.Query.getElementIndex(el);
		}).toOption().feed(this.currentIndex);
		editor.stream.filterValue(function(v) {
			return thx.core.Options.toBool(_g.currentIndex.get());
		}).mapValue(function(v1) {
			var path = cards.ui.input._Path.Path_Impl_.intAsPath(thx.core.Options.toValue(_g.currentIndex.get()));
			var diff = cards.ui.input.Diff.SetValue(v1);
			return { _0 : path, _1 : diff};
		}).distinct(cards.ui.input._DiffAt.DiffAt_Impl_.equal).subscribe(function(v2) {
			_g.diff.emit(thx.stream.StreamValue.Pulse(v2));
		});
	}
	,setEditor: function(index,value) {
		this.editors[index].stream.emit(thx.stream.StreamValue.Pulse(value));
	}
	,removeEditor: function(index) {
		var item = udom.Query.first("li:nth-child(" + (index + 1) + ")",this.list);
		var editor = this.editors[index];
		this.list.removeChild(item);
		editor.dispose();
		this.editors.splice(index,1);
		this.currentIndex.set(haxe.ds.Option.None);
	}
	,pulse: function() {
		this.stream.pulse((function($this) {
			var $r;
			var value = $this.values.slice();
			$r = (function($this) {
				var $r;
				var _1 = value;
				$r = { _0 : $this.type, _1 : _1};
				return $r;
			}($this));
			return $r;
		}(this)));
	}
	,__class__: cards.ui.input.ArrayEditor
});
cards.ui.input.CodeEditor = function(container) {
	var _g = this;
	var options = { template : "<div class=\"editor code\"></div>", container : container};
	cards.ui.input.Editor.call(this,cards.model.SchemaType.CodeType,options);
	this.editor = CodeMirror(this.component.el,{ mode : "javascript", tabSize : 2, lineNumbers : true, tabindex : 1, lineWrapping : true});
	this.editor.on("changes",$bind(this,this.changes));
	this.editor.on("focus",$bind(this,this.setFocus));
	this.editor.on("blur",$bind(this,this.blurFocus));
	this.stream.subscribe(function(text) {
		var v = text._1;
		if(_g.editor.doc.getValue() != v) _g.editor.doc.setValue(v);
	});
};
cards.ui.input.CodeEditor.__name__ = ["cards","ui","input","CodeEditor"];
cards.ui.input.CodeEditor.__super__ = cards.ui.input.Editor;
cards.ui.input.CodeEditor.prototype = $extend(cards.ui.input.Editor.prototype,{
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
	,__class__: cards.ui.input.CodeEditor
});
cards.ui.input.Diff = { __ename__ : ["cards","ui","input","Diff"], __constructs__ : ["RemoveItem","AddItem","SetValue"] };
cards.ui.input.Diff.RemoveItem = ["RemoveItem",0];
cards.ui.input.Diff.RemoveItem.toString = $estr;
cards.ui.input.Diff.RemoveItem.__enum__ = cards.ui.input.Diff;
cards.ui.input.Diff.AddItem = ["AddItem",1];
cards.ui.input.Diff.AddItem.toString = $estr;
cards.ui.input.Diff.AddItem.__enum__ = cards.ui.input.Diff;
cards.ui.input.Diff.SetValue = function(value) { var $x = ["SetValue",2,value]; $x.__enum__ = cards.ui.input.Diff; $x.toString = $estr; return $x; };
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
	if(null == a && null == b) return true; else if(null == a || null == b) return false; else return cards.ui.input._Path.Path_Impl_.equal(a._0,b._0) && thx.core.Dynamics.same(a._1,b._1);
};
cards.ui.input._DiffAt.DiffAt_Impl_.toString = function(this1) {
	return cards.ui.input._Path.Path_Impl_.toString(this1._0) + ":" + Std.string(this1._1);
};
cards.ui.input.EditorFactory = function() { };
cards.ui.input.EditorFactory.__name__ = ["cards","ui","input","EditorFactory"];
cards.ui.input.EditorFactory.create = function(type,container,parent) {
	switch(type[1]) {
	case 6:
		return new cards.ui.input.CodeEditor(container);
	case 5:
		return new cards.ui.input.TextEditor(container);
	case 0:
		var t = type[2];
		return new cards.ui.input.ArrayEditor(container,t);
	default:
		throw "Editor for " + Std.string(type) + " has not been implemented yet";
	}
};
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
cards.ui.input.PathItem.Field = function(name) { var $x = ["Field",0,name]; $x.__enum__ = cards.ui.input.PathItem; $x.toString = $estr; return $x; };
cards.ui.input.PathItem.Index = function(pos) { var $x = ["Index",1,pos]; $x.__enum__ = cards.ui.input.PathItem; $x.toString = $estr; return $x; };
cards.ui.input.TextEditor = function(container) {
	var _g = this;
	var options = { template : "<textarea class=\"editor text\" placeholder=\"type text\"></textarea>", container : container};
	cards.ui.input.Editor.call(this,cards.model.SchemaType.StringType,options);
	var el = this.component.el;
	el.style.content = "type text";
	thx.stream.dom.Dom.streamEvent(el,"input").audit(function(_) {
		_g.resize();
	}).mapValue(function(_1) {
		var _11 = el.value;
		return { _0 : cards.model.SchemaType.StringType, _1 : _11};
	}).plug(this.stream);
	thx.stream.dom.Dom.streamFocus(el).feed(this.focus);
	this.stream.subscribe(function(text) {
		var v = text._1;
		if(el.value != v) el.value = v;
	});
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
cards.ui.input._TypedValue.TypedValue_Impl_.asString = function(this1) {
	return Std.string(this1._1);
};
cards.ui.input._TypedValue.TypedValue_Impl_.equal = function(a,b) {
	if(null == a && null == b) return true; else if(null == a || null == b) return false; else return thx.core.Dynamics.same(a._1,b._1) && thx.core.Dynamics.same(a._0,b._0);
};
cards.ui.input._TypedValue.TypedValue_Impl_.toString = function(this1) {
	return Std.string(this1._1) + " : " + Std.string(this1._0);
};
cards.ui.widgets = {};
cards.ui.widgets.Button = function(text,icon) {
	if(text == null) text = "";
	this.component = new cards.components.Component({ template : null == icon?"<button>" + text + "</button>":"<button class=\"fa fa-" + icon + "\">" + text + "</button>"});
	this.clicks = thx.stream.dom.Dom.streamEvent(this.component.el,"click",false);
	this.enabled = new thx.stream.Value(true);
	thx.stream.EmitterBools.negate(this.enabled).subscribe(thx.stream.dom.Dom.subscribeToggleAttribute(this.component.el,"disabled","disabled"));
};
cards.ui.widgets.Button.__name__ = ["cards","ui","widgets","Button"];
cards.ui.widgets.Button.prototype = {
	component: null
	,clicks: null
	,enabled: null
	,cancel: null
	,destroy: function() {
		this.cancel();
		this.component.destroy();
	}
	,__class__: cards.ui.widgets.Button
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
cards.ui.widgets.ToolbarGroup = function(el,component) {
	this.el = el;
	this.component = component;
};
cards.ui.widgets.ToolbarGroup.__name__ = ["cards","ui","widgets","ToolbarGroup"];
cards.ui.widgets.ToolbarGroup.prototype = {
	el: null
	,component: null
	,addButton: function(text,icon) {
		if(text == null) text = "";
		var button = new cards.ui.widgets.Button(text,icon);
		button.component.appendTo(this.el);
		this.component.add(button.component);
		return button;
	}
	,__class__: cards.ui.widgets.ToolbarGroup
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
thx.core.Dynamics = function() { };
thx.core.Dynamics.__name__ = ["thx","core","Dynamics"];
thx.core.Dynamics.same = function(a,b) {
	if(a == b) return true;
	if(!thx.core.Types.sameType(a,b)) return false;
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
					if(!thx.core.Dynamics.same(aa[i],ab[i])) return false;
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
					if(!hb.exists(key) || !thx.core.Dynamics.same(ha.get(key),hb.get(key))) return false;
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
					if(!thx.core.Dynamics.same(va[i1],vb[i1])) return false;
				}
				return true;
			}
			var fields = Type.getInstanceFields(Type.getClass(a));
			var _g13 = 0;
			while(_g13 < fields.length) {
				var field = fields[_g13];
				++_g13;
				var va1 = Reflect.field(a,field);
				if(Reflect.isFunction(va1)) continue;
				var vb1 = Reflect.field(b,field);
				if(!thx.core.Dynamics.same(va1,vb1)) return false;
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
				if(!thx.core.Dynamics.same(pa[i2],pb[i2])) return false;
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
				if(!thx.core.Dynamics.same(va2,vb2)) return false;
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
					if(!thx.core.Dynamics.same(aa1[i3],ab1[i3])) return false;
				}
				return true;
			}
			return true;
		case 8:
			throw "Unable to compare two unknown types";
			break;
		}
	}
	throw new thx.core.Error("Unable to compare values: " + Std.string(a) + " and " + Std.string(b),null,{ fileName : "Dynamics.hx", lineNumber : 138, className : "thx.core.Dynamics", methodName : "same"});
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
	stack: null
	,pos: null
	,__class__: thx.core.Error
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
thx.core.Iterables.isIterable = function(v) {
	var fields;
	if(Reflect.isObject(v) && null == Type.getClass(v)) fields = Reflect.fields(v); else fields = Type.getInstanceFields(Type.getClass(v));
	if(!Lambda.has(fields,"iterator")) return false;
	return Reflect.isFunction(Reflect.field(v,"iterator"));
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
thx.core.Iterators.isIterator = function(v) {
	var fields;
	if(Reflect.isObject(v) && null == Type.getClass(v)) fields = Reflect.fields(v); else fields = Type.getInstanceFields(Type.getClass(v));
	if(!Lambda.has(fields,"next") || !Lambda.has(fields,"hasNext")) return false;
	return Reflect.isFunction(Reflect.field(v,"next")) && Reflect.isFunction(Reflect.field(v,"hasNext"));
};
thx.core.Nil = { __ename__ : ["thx","core","Nil"], __constructs__ : ["nil"] };
thx.core.Nil.nil = ["nil",0];
thx.core.Nil.nil.toString = $estr;
thx.core.Nil.nil.__enum__ = thx.core.Nil;
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
	return thx.core.Options.equals(a,thx.core.Options.toOption(b),eq);
};
thx.core.Timer = function() { };
thx.core.Timer.__name__ = ["thx","core","Timer"];
thx.core.Timer.repeat = function(callback,ms) {
	return setInterval(callback,ms);
};
thx.core.Timer.delay = function(callback,ms) {
	return setTimeout(callback,ms);
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
	promise: null
	,rejectWith: function(error) {
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
thx.promise.PromiseValue.Failure = function(err) { var $x = ["Failure",0,err]; $x.__enum__ = thx.promise.PromiseValue; $x.toString = $estr; return $x; };
thx.promise.PromiseValue.Success = function(value) { var $x = ["Success",1,value]; $x.__enum__ = thx.promise.PromiseValue; $x.toString = $estr; return $x; };
thx.stream = {};
thx.stream.Emitter = function(init) {
	this.init = init;
};
thx.stream.Emitter.__name__ = ["thx","stream","Emitter"];
thx.stream.Emitter.create = function(init) {
	return new thx.stream.Emitter(init);
};
thx.stream.Emitter.prototype = {
	init: null
	,sign: function(subscriber) {
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
	,debounce: function(delay) {
		var _g = this;
		return new thx.stream.Emitter(function(stream) {
			var id = null;
			stream.addCleanUp(function() {
				clearTimeout(id);
			});
			_g.init(new thx.stream.Stream(function(r) {
				switch(r[1]) {
				case 0:
					var v = r[2];
					clearTimeout(id);
					id = thx.core.Timer.delay((function(f,v1) {
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
	,distinct: function(equals) {
		var _g = this;
		return new thx.stream.Emitter(function(stream) {
			if(null == equals) equals = function(a,b) {
				return a == b;
			};
			var last = null;
			_g.init(new thx.stream.Stream(function(r) {
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
			other.init(new thx.stream.Stream(function(r1) {
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
			other.init(new thx.stream.Stream(function(r1) {
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
			sampler.init(new thx.stream.Stream(function(r1) {
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
	,__class__: thx.stream.Emitter
};
thx.stream.Bus = function(unique,equal) {
	if(unique == null) unique = false;
	var _g = this;
	this.unique = unique;
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
	,unique: null
	,equal: null
	,value: null
	,emit: function(value) {
		switch(value[1]) {
		case 0:
			var v = value[2];
			if(this.unique) {
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
thx.stream.EmitterInts = function() { };
thx.stream.EmitterInts.__name__ = ["thx","stream","EmitterInts"];
thx.stream.EmitterInts.toBool = function(emitter) {
	return emitter.mapValue(function(i) {
		return i != 0;
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
thx.stream.EmitterOptions.either = function(emitter,some,none,fail,end) {
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
	},fail,end);
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
thx.stream.EmitterEmitters.flatten = function(emitter) {
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
thx.stream.StreamValue.Pulse = function(value) { var $x = ["Pulse",0,value]; $x.__enum__ = thx.stream.StreamValue; $x.toString = $estr; return $x; };
thx.stream.StreamValue.End = function(cancel) { var $x = ["End",1,cancel]; $x.__enum__ = thx.stream.StreamValue; $x.toString = $estr; return $x; };
thx.stream.StreamValue.Failure = function(err) { var $x = ["Failure",2,err]; $x.__enum__ = thx.stream.StreamValue; $x.toString = $estr; return $x; };
thx.stream.Value = function(value,equal) {
	var _g = this;
	if(null == equal) this.equal = function(a,b) {
		return a == b;
	}; else this.equal = equal;
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
thx.stream.Value.createOption = function(value,equal) {
	var def;
	if(null == value) def = haxe.ds.Option.None; else def = haxe.ds.Option.Some(value);
	return new thx.stream.Value(def,(function(f,eq) {
		return function(a,b) {
			return f(a,b,eq);
		};
	})(thx.core.Options.equals,equal));
};
thx.stream.Value.__super__ = thx.stream.Emitter;
thx.stream.Value.prototype = $extend(thx.stream.Emitter.prototype,{
	value: null
	,downStreams: null
	,upStreams: null
	,equal: null
	,get: function() {
		return this.value;
	}
	,set: function(value) {
		if(this.equal(this.value,value)) return;
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
thx.stream.dom.Dom.streamMouseMove = function(el,capture) {
	if(capture == null) capture = false;
	return thx.stream.dom.Dom.streamEvent(el,"mousemove",capture);
};
thx.stream.dom.Dom.streamMouseDown = function(el,capture) {
	if(capture == null) capture = false;
	return thx.stream.dom.Dom.streamEvent(el,"mousedown",capture);
};
thx.stream.dom.Dom.streamMouseUp = function(el,capture) {
	if(capture == null) capture = false;
	return thx.stream.dom.Dom.streamEvent(el,"mouseup",capture);
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
thx.stream.dom.Dom.streamFocus = function(el,capture) {
	if(capture == null) capture = false;
	return thx.stream.dom.Dom.streamEvent(el,"focus",capture).toTrue().merge(thx.stream.dom.Dom.streamEvent(el,"blur",capture).toFalse());
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
thx.stream.dom.Dom.subscribeText = function(el,force) {
	if(force == null) force = false;
	return function(text) {
		if(el.textContent != text || force) el.textContent = text;
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
var scope = ("undefined" !== typeof window && window) || ("undefined" !== typeof global && global) || this;
if(!scope.setImmediate) scope.setImmediate = function(callback) {
	scope.setTimeout(callback,0);
};
Config.icons = { add : "plus-circle", remove : "ban", dropdown : "reorder", checked : "toggle-on", unchecked : "toggle-off", switchtype : "bolt", code : "bolt", value : "pencil", reference : "link", bool : "check-circle", text : "pencil", number : "superscript", date : "calendar", array : "list", object : "table"};
Config.selectors = { app : ".card"};
thx.core.Ints.pattern_parse = new EReg("^[+-]?(\\d+|0x[0-9A-F]+)$","i");
thx.promise.Promise.nil = thx.promise.Promise.value(thx.core.Nil.nil);
udom.Query.doc = document;
Main.main();
})();

//# sourceMappingURL=editors.js.map