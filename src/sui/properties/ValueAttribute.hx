package sui.properties;

import js.html.Element;
import js.html.InputElement;
import steamer.Pulse.End;
import steamer.Value;
import sui.components.Component;
import steamer.SimpleConsumer;
using steamer.dom.Dom;
import thx.Assert;

class ValueAttribute extends ValueProperty<String> {
	public var eventName(default, null) : String;
	public function new(component : Component, eventName : String) {
		this.eventName = eventName;
		super(component.el.getAttribute('value'), component, 'value');
	}

	override function init() : Void -> Void {
		var el : InputElement = cast component.el,
			defaultValue = el.value;

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
		};
	}
}