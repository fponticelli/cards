package ui.properties;

class Implementations {
	var map : Map<String, Implementation<Dynamic>>;
	public function new() {
		map = new Map();
	}

	public function get(name : String) : Implementation<Dynamic> {
		return map.get(name);
	}

	public function remove(name : String) : Bool {
		return map.remove(name);
	}

	public function set(name : String, implementation : Implementation<Dynamic>) : Void {
		map.set(name, implementation);
	}

	public function exists(name : String) : Bool {
		return map.exists(name);
	}
}