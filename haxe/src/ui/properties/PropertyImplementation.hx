package ui.properties;

class PropertyImplementation {
	public var target(default, null) : Component;
	public var property(default, null) : Property;
	public function new(target : Component, property : Property) {
		this.target = target;
		this.property = property;
		this._dispose = init();
	}

	function init() : Void -> Void {
		return throw "abstact function init, must override";
	}

	public function dispose() {
		_dispose();
		this.target = null;
		this.property = null;
	}
}