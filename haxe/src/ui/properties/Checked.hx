package ui.properties;

import js.html.Event;
import steamer.Producer;
import thx.Assert;
import ui.components.Component;
using steamer.dom.Dom;

class Checked extends Property {
	public static function asCheckable(component : Component) : Checked {
		var property = component.properties.get('checked');
		Assert.is(property, Checked);
		return cast property;
	}

	public var defaultValue(default, null) : Bool;
	public var checked(default, null) : Producer<Bool>;

	public function new(target : Component) {
		this.defaultValue = dafaultValue;
		super(target, 'checked');
	}

	override function init() {
		var tuple = component.el.produceEvent('change');
		checked = tuple.producer.map(function(_) return component.el.checked);
		return tuple.cancel;
	}
}