package ui.properties;

import js.html.Event;
import steamer.Producer;
import ui.components.Component;
using steamer.dom.Dom;

class ClickProperty extends Property<ClickProperty> {
	public function new() {
		super('click');
	}

	override public function inject(target : Component) : PropertyImplementation<ClickProperty> {
		return new ClickPropertyImplementation(target, this);
	}
}

class ClickPropertyImplementation extends PropertyImplementation<ClickProperty> {
	public static function asClickable(component : Component) : ClickPropertyImplementation {
		return cast component.properties.implementations.get('click');
	}

	public var clicks(default, null) : Producer<Event>;
	override function init() {
		var tuple = component.el.produceEvent('click');
		clicks = tuple.producer;
		return tuple.cancel;
	}
}