package ui.properties;

using steamer.dom.Dom;
import steamer.Value;
import ui.components.Component;
import thx.Assert;

class Visible extends Property {
	public static function createVisible(component : Component)
		return new Visible(component, true);
	public static function createInvisible(component : Component)
		return new Visible(component, false);

	public inline static function asVisible(component : Component) : Visible {
		var property = component.properties.get('visible');
		Assert.is(property, Visible);
		return cast property;
	}

	public var defaultValue(default, null) : Bool;
	public var visible(default, null) : Value<Bool>;

	public function new(component : Component, defaultValue : Bool) {
		this.defaultValue = defaultValue;
		super(component);
	}

	override function init() : Void -> Void {
		visible = new Value(property.defaultValue);
		visible.feed(component.el.consumeToggleVisibility());
		return function() {
			visible.terminate();
			visible = false;
		};
	}
}