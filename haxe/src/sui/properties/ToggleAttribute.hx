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

	public static function asToggleAttribute(component : Component, name : String) : ToggleAttributeImplementation {
		var property = component.properties.get(name);
		Assert.is(property, ToggleAttribute);
		return cast property;
	}

	public function new(component : Component, name : String, attributeName : String) {
		this.attributeName = null == attributeName ? name : attributeName;
		super(component, name);
	}

	public var attributeName(default, null) : Bool;
	public var toggleAttributeName(default, null) : Value<Bool>;

	override function init() : Void -> Void {
		toggleAttributeName = new Value(attributeName);
		toggleAttributeName.feed(component.el.consumeToggleAttribute(attributeName));
		return function() {
			visible.terminate();
			visible = false;
		};
	}
}