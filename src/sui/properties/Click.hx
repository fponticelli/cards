package sui.properties;

import js.html.Event;
import steamer.Producer;
import sui.components.Component;
using steamer.dom.Dom;
import thx.Assert;

class Click extends Property {
	public static function asClickable(component : Component) : Click {
		var property = component.properties.get('click');
		Assert.is(property, Click);
		return cast property;
	}

	public function new(component : Component)
		super(component, 'click');

	public var clicks(default, null) : Producer<Event>;
	override function init() {
		var tuple = component.el.produceEvent('click');
		clicks = tuple.producer;
		return tuple.cancel;
	}
}