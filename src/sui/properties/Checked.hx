package sui.properties;

import js.html.Event;
import steamer.Producer;
import thx.Assert;
import sui.components.Component;
using steamer.dom.Dom;

class Checked extends Property {
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