pacakge ui.properties;

class Property {
	public var name(default, null) : String;
	public function new(name : String) {
		this.name = name;
	}

	public function inject(target : Component) {
		throw 'inject is an abstract method and must be overridden';
	}

	public function toString()
		return '$name (${Type.getClass(this).split(".").pop()})';
}