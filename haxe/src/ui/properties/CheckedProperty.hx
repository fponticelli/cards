package ui.properties;

import js.html.Event;
import steamer.Producer;
import ui.components.Component;
using steamer.dom.Dom;

class CheckedProperty extends Property<CheckedProperty> {
	public function new() {
		super('checked');
	}

	override public function inject(target : Component) : PropertyImplementation<CheckedProperty> {
		return new CheckedPropertyImplementation(target, this);
	}
}

class CheckedPropertyImplementation extends PropertyImplementation<CheckedProperty> {
	public static function asCheckable(component : Component) : CheckedPropertyImplementation {
		return cast component.properties.implementations.get('checked');
	}

	public var checked(default, null) : Producer<Bool>;
	override function init() {
		var tuple = component.el.produceEvent('change');
		checked = tuple.producer.map(function(_) return component.el.checked);
		return tuple.cancel;
	}
}