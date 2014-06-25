package sui.properties;

import js.html.Element;
import js.html.InputElement;
import steamer.Pulse.End;
import steamer.Value in V;
import sui.components.Component;
import steamer.SimpleConsumer;
using steamer.dom.Dom;
import thx.Assert;

class Value extends Property {
	public inline static function asValue(component : Component) : Value {
		var property = component.properties.get('value');
		Assert.is(property, Value);
		return cast property;
	}

	public var defaultValue(default, null) : String;
	public var eventName(default, null) : String;
	public var value(default, null) : V<String>;

	public function new(component : Component, eventName : String) {
		this.eventName = eventName;

		super(component, 'value');
	}

	override function init() : Void -> Void {
		var el : InputElement = cast component.el,
			defaultValue = el.value;
		value = new V(defaultValue);

		var pair = el.produceEvent(eventName);

		pair.producer.feed(new SimpleConsumer(
			function(_) {
				if(el.value != value.value)
					value.value = el.value;
			},
			function() el.value = defaultValue
		));

		value.feed(new SimpleConsumer(
			function(value) el.value = value,
			function() el.value = defaultValue
		));

		return function() {
			pair.cancel();
			value.terminate();
			value = null;
		};
	}
}