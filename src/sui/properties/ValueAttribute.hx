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
	public function new(component : Component, eventName : String) {
		var el : InputElement = cast component.el;
		super(el.value, component, 'value');
		var pair = el.produceEvent(eventName);

		pair.producer.feed({
			emit : function(_) {
				if(el.value != value.value)
					value.value = el.value;
			},
			end : function() el.value = defaultValue
		});

		value.feed({
			emit : function(value) el.value = value,
			end  : function() el.value = defaultValue
		});

		cancels.push(pair.cancel);
	}
}