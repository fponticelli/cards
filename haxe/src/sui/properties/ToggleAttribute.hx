package sui.properties;

using steamer.dom.Dom;
import steamer.Value;
import sui.components.Component;
import thx.Assert;

class ToggleAttribute extends Property {
	public static function createContentEditable(component : Component)
		return new ToggleAttribute(component, 'contentEditable');

	public static function asContentEditable(component : Component)
		return asToggleAttribute(component, 'contentEditable');

	public static function asToggleAttribute(component : Component, name : String) : ToggleAttribute {
		var property = component.properties.get(name);
		Assert.is(property, ToggleAttribute);
		return cast property;
	}

	public function new(component : Component, name : String, ?attributeName : String, defaultValue = true) {
		this.attributeName = null == attributeName ? name : attributeName;
		this.defaultValue = defaultValue;
		super(component, name);
	}

	public var defaultValue(default, null) : Bool;
	public var attributeName(default, null) : String;
	public var toggleAttributeName(default, null) : Value<Bool>;

	override function init() : Void -> Void {
		toggleAttributeName = new Value(defaultValue);
		toggleAttributeName.feed(component.el.consumeToggleAttribute(attributeName));
		return function() {
			toggleAttributeName.terminate();
			toggleAttributeName = null;
		};
	}
}