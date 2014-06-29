package sui.properties;

import js.html.Event;
import steamer.Producer;
import sui.components.Component;
using steamer.dom.Dom;
import thx.Assert;

class Click extends Property {
	public var clicks(default, null) : Producer<Event>;
	public function new(component : Component) {
		super(component, 'click');
		var tuple = component.el.produceEvent('click');
		clicks = tuple.producer;
		cancels.push(tuple.cancel);
	}
}