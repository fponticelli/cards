package ui.properties;

import js.html.Event;
import steamer.Producer;
import ui.components.Component;
using steamer.dom.Dom;

class Click extends Property<Click> {
	public function new() {
		super('click');
	}

	override public function inject(target : Component) : Implementation<Click> {
		return new ClickImplementation(target, this);
	}
}

class ClickImplementation extends Implementation<Click> {
	public static function asClickable(component : Component) : ClickImplementation {
		return cast component.properties.implementations.get('click');
	}

	public var clicks(default, null) : Producer<Event>;
	override function init() {
		var tuple = component.el.produceEvent('click');
		clicks = tuple.producer;
		return tuple.cancel;
	}
}