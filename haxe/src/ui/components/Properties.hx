package ui.components;

import ui.properties.Implementations;
import ui.properties.Property;

@:access(ui.properties.Implementations)
class Properties {
	public var implementations(default, null) : Implementations;
	var properties : Map<String, Property<Dynamic>>;
	var target : Component;
	public function new(target : Component) {
		this.target = target;
		implementations = new Implementations();
		properties = new Map();
	}

	public function removeAll() {
		for(name in properties.keys())
			removeByName(name);
	}

	public function add(property : Property<Dynamic>) {
		if(properties.exists(property.name))
			throw '$target already has a property $property';
		properties.set(property.name, property);
		implementations.set(property.name, property.inject(target));
	}

	public function get(name : String) {
		return properties.get(name);
	}

	public function exists(name : String) {
		return properties.exists(name);
	}

	public function remove(property : Property<Dynamic>) {
		removeByName(property.name);
	}

	public function removeByName(name : String) {
		if(!properties.exists(name))
			throw 'property "${name}" does not exist in $target';
		implementations.get(name).dispose();
		implementations.remove(name);
		properties.remove(name);
	}

	public function copyTo(other : Component) {
		for(name in properties.keys())
			other.properties.add(get(name));
	}
}