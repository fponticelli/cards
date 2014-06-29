package sui.properties;

import sui.components.Component;

@:access(sui.components.Properties)
class Property {
	public var component(default, null) : Component;
	public var name(default, null) : String;
	var cancels : Array<Void -> Void>;
	public function new(component : Component, name : String) {
		this.component = component;
		this.name = name;
		cancels = [];
		component.properties.add(this);
	}

	public function dispose() {
		while(cancels.length > 0)
			cancels.shift()();
		if(this.component.properties.exists(name)) {
			this.component.properties.remove(name);
			this.component = null;
		}
	}

	public function toString()
		return Type.getClassName(Type.getClass(this)).split('.').pop();
}