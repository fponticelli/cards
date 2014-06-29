package sui.properties;

using steamer.dom.Dom;
import steamer.Value;
import sui.components.Component;
import thx.Assert;

class Visible extends ValueProperty<Bool> {
	public function new(component : Component, defaultValue : Bool) {
		super(defaultValue, component, 'visible');
		stream.feed(component.el.consumeToggleVisibility());
	}
}