package sui.properties;

import sui.components.Component;
import steamer.Value;

class ValueProperty<T> extends Property {
	public var value(get, set) : T;
	public var defaultValue(get, null) : T;
	public var stream(default, null) : Value<T>;
	public function new(defaultValue : T, component : Component, name : String) {
		stream = new Value(defaultValue);
		super(component, name);
	}

	override public function dispose() {
		stream.terminate();
		super.dispose();
		value  = null;
		stream = null;
	}

	function get_defaultValue()
		return stream.defaultValue;

	function get_value()
		return stream.value;

	function set_value(value : T)
		return stream.value = value;
}