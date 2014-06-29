package sui.properties;

using steamer.dom.Dom;
import steamer.Value;
import sui.components.Component;
import thx.Assert;

class ToggleAttribute extends ValueProperty<Bool> {
	public function new(component : Component, name : String, ?attributeName : String, defaultValue = true) {
		this.attributeName = null == attributeName ? name : attributeName;
		super(defaultValue, component, name);
	}

	public var attributeName(default, null) : String;

	override function init() : Void -> Void {
		value.feed(component.el.consumeToggleAttribute(attributeName));
		return function() { };
	}
}