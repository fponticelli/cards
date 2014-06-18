package ui.properties;

import ui.components.Component;

class PropertyImplementation<TProperty : Property<Dynamic>> {
	public var component(default, null) : Component;
	public var property(default, null) : TProperty;
	var _dispose : Void -> Void;
	public function new(component : Component, property : TProperty) {
		this.component   = component;
		this.property = property;
		this._dispose = init();
	}

	function init() : Void -> Void {
		return throw "abstact function init, must override";
	}

	public function dispose() {
		_dispose();
		this.component = null;
	}

	public function toString()
		return Type.getClassName(Type.getClass(this)).split('.').pop();
}