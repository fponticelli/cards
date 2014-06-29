package sui.properties;

import js.html.Event;
import steamer.Producer;
import thx.Assert;
import sui.components.Component;
using steamer.dom.Dom;

class Checked extends ValueProperty<Bool> {
	public function new(component : Component, defaultValue : Bool) {
		super(dafaultValue, component, 'checked');
		var tuple = component.el.produceEvent('change');
		tuple.producer
			.map(function(_) return component.el.checked)
			.feed(stream);
		cancels.push(tuple.cancel);
	}
}