package ui.properties;

import ui.components.Component;

@:access(ui.components.Properties)
class Property {
	public var component(default, null) : Component;
	public var name(default, null) : String;
	var _dispose : Void -> Void;
	public function new(component : Component, name : String) {
		this.component = component;
		this.name  = name;
		this._dispose  = init();
		component.properties.add(this);
	}

	function init() : Void -> Void {
		return throw "abstact function init, must override";
	}

	public function dispose() {
		_dispose();
		this.component.properties.remove(name);
		this.component = null;
	}

	public function toString()
		return Type.getClassName(Type.getClass(this)).split('.').pop();
}