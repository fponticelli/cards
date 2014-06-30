package sui.properties;

import sui.components.Component;
using steamer.dom.Dom;

class Attribute extends ValueProperty<String> {
	public var attributeName(default, null) : String;
	public function new(component : Component, name : String, ?attributeName : String, defaultValue : String) {
		this.attributeName = null == attributeName ? name : attributeName;
		super(defaultValue, component, name);
		stream.feed(component.el.consumeAttribute(attributeName));
	}
}