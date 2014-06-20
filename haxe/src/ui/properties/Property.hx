package ui.properties;

import ui.components.Component;

class Property<T : Property<Dynamic>> {
	public var name(default, null) : String;
	public function new(name : String) {
		this.name = name;
	}

	public function inject(target : Component) : Implementation<T> {
		return throw 'inject must be overridden in ${toString()}';
	}

	public function toString()
		return '$name (${Type.getClassName(Type.getClass(this)).split('.').pop()})';
}