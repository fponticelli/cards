package ui.properties;

import js.html.Event;
import steamer.Producer;
import ui.components.Component;
using steamer.dom.Dom;

class Click extends Property {
	public inline static function asClickable(component : Component) : Click {
		return cast component.properties.get('click');
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