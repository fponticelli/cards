package ui.properties;

import js.html.Event;
import steamer.Producer;
import ui.components.Component;
using steamer.dom.Dom;

class Checked extends Property<Checked> {
	public function new() {
		super('checked');
	}

	override public function inject(target : Component) : Implementation<Checked> {
		return new CheckedImplementation(target, this);
	}
}

class CheckedImplementation extends Implementation<Checked> {
	public static function asCheckable(component : Component) : CheckedImplementation {
		return cast component.properties.implementations.get('checked');
	}

	public var checked(default, null) : Producer<Bool>;
	override function init() {
		var tuple = component.el.produceEvent('change');
		checked = tuple.producer.map(function(_) return component.el.checked);
		return tuple.cancel;
	}
}