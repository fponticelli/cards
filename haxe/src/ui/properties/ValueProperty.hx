package ui.properties;

import steamer.Value;

class ValueProperty extends Property {
	var fvalue : ValueFunction;
	var fwire : WireFunction;
	public function new(name : String, fvalue : ValueFunction, fwire : WireFunction) {
		super(name);
		this.fvalue = fvalue;
		this.fwire = fwire;
	}

	override public function inject(target : Component) {
		var value = fvalue();
	}
}


typedef ValueFunction = Void -> Value;
typedef WireFunction = Void -> Void;