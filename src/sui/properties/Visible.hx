package sui.properties;

using steamer.dom.Dom;
import steamer.Value;
import sui.components.Component;
import thx.Assert;

class Visible extends Property {
	public var defaultValue(default, null) : Bool;
	public var visible(default, null) : Value<Bool>;

	public function new(component : Component, defaultValue : Bool) {
		this.defaultValue = defaultValue;
		super(component, 'visible');
	}

	override function init() : Void -> Void {
		visible = new Value(defaultValue);
		visible.feed(component.el.consumeToggleVisibility());
		return function() {
			visible.terminate();
			visible = null;
		};
	}
}