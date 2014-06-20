package ui.properties;

using steamer.dom.Dom;
import steamer.Value;
import ui.components.Component;

class Visible extends Property {
	public static function createVisible(component : Component)
		return new Visible(component, true);
	public static function createInvisible(component : Component)
		return new Visible(component, false);

	public inline static function asVisible(component : Component) : VisibleImplementation {
		return component.properties.get('visible');
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