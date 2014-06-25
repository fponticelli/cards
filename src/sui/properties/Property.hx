package sui.properties;

import sui.components.Component;
using thx.core.Functions;

@:access(sui.components.Properties)
class Property {
	public var component(default, null) : Component;
	public var name(default, null) : String;
	var _dispose : Void -> Void;
	public function new(component : Component, name : String) {
		this.component = component;
		this.name  = name;
		this._dispose  = init().once();
		component.properties.add(this);
	}

	function init() : Void -> Void {
		return throw "abstact function init, must override";
	}

	public function dispose() {
		_dispose();
		if(this.component.properties.exists(name)) {
			this.component.properties.remove(name);
			this.component = null;
		}
	}

	public function toString()
		return Type.getClassName(Type.getClass(this)).split('.').pop();
}