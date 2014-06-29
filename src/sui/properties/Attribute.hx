package sui.properties;

using steamer.dom.Dom;
import steamer.Value;
import sui.components.Component;
import thx.Assert;

class Attribute extends ValueProperty<String> {
	public var attributeName(default, null) : String;
	public function new(component : Component, name : String, ?attributeName : String, defaultValue : String) {
		this.attributeName = null == attributeName ? name : attributeName;
		super(defaultValue, component, name);
		stream.feed(component.el.consumeAttribute(attributeName));
	}
}