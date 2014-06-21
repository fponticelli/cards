package sui.properties;

using steamer.dom.Dom;
import steamer.Value;
import sui.components.Component;
import thx.Assert;

class Attribute extends Property {
	public static function asAttribute<T>(component : Component, name : String) : Attribute {
		var property = component.properties.get(name);
		Assert.is(property, Attribute);
		return cast property;
	}

	public function new(component : Component, name : String, ?attributeName : String, defaultValue : String) {
		this.attributeName = null == attributeName ? name : attributeName;
		this.defaultValue = defaultValue;
		super(component, name);
	}

	public var defaultValue(default, null) : String;
	public var attributeName(default, null) : String;
	public var attribute(default, null) : Value<String>;

	override function init() : Void -> Void {
		attribute = new Value(defaultValue);
		attribute.feed(component.el.consumeAttribute(attributeName));
		return function() {
			attribute.terminate();
			attribute = null;
		};
	}
}