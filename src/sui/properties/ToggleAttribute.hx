package sui.properties;

using steamer.dom.Dom;
import sui.components.Component;

class ToggleAttribute extends ValueProperty<Bool> {
	public function new(component : Component, name : String, ?attributeName : String, defaultValue = true) {
		super(defaultValue, component, name);
		attributeName = null == attributeName ? name : attributeName;
		value.feed(component.el.consumeToggleAttribute(attributeName));
	}
}