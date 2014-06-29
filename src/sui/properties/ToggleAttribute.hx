package sui.properties;

using steamer.dom.Dom;
import steamer.Value;
import sui.components.Component;
import thx.Assert;

class ToggleAttribute extends ValueProperty<Bool> {
	public function new(component : Component, name : String, ?attributeName : String, defaultValue = true) {
		super(defaultValue, component, name);
		attributeName = null == attributeName ? name : attributeName;
		value.feed(component.el.consumeToggleAttribute(attributeName));
	}
}