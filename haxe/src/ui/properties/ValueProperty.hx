package ui.properties;

import js.html.Element;
import js.html.InputElement;
import steamer.Pulse.End;
import steamer.Value;
import ui.components.Component;
import steamer.SimpleConsumer;
using steamer.dom.Dom;

class ValueProperty extends Property<ValueProperty> {
	public var defaultValue(default, null) : String;
	public var eventName(default, null) : String;
	public function new(defaultValue : String, eventName : String = 'input') {
		super('value');
		this.defaultValue = defaultValue;
		this.eventName = eventName;
	}

	override public function inject(component : Component) {
		return new ValuePropertyImplementation(component, this);
	}
}

class ValuePropertyImplementation extends PropertyImplementation<ValueProperty> {
	public static function asValue(component : Component) : ValuePropertyImplementation {
		return cast component.properties.implementations.get('value');
	}

	public var value(default, null) : Value<String>;

	override function init() : Void -> Void {
		var el : InputElement = cast component.el,
			original = el.value;
		value = new Value(property.defaultValue);

		var pair = el.produceEvent(property.eventName);

		pair.producer.feed(new SimpleConsumer(
			function(_) {
				if(el.value != value.value)
					value.value = el.value;
			},
			function() el.value = original
		));

		value.feed(new SimpleConsumer(
			function(value) el.value = value,
			function() el.value = original
		));

		return function() {
			pair.cancel();
			value.terminate();
			value = null;
		};
	}
}