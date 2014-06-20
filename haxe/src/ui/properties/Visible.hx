package ui.properties;

using steamer.dom.Dom;
import steamer.Value;
import ui.components.Component;

class Visible extends Property<Visible> {
	public static var visible(default, null) : Visible = new Visible(true);
	public static var invisible(default, null) : Visible = new Visible(false);

	public var defaultValue(default, null) : Bool;
	public function new(defaultValue : Bool) {
		super('visible');
		this.defaultValue = defaultValue;
	}

	override public function inject(component : Component) {
		return new VisibleImplementation(component, this);
	}
}

class VisibleImplementation extends Implementation<Visible> {
	public static function asVisible(component : Component) : VisibleImplementation {
		return component.properties.implementations.get('visible');
	}

	public static function makeVisible(component : Component, defaultValue = true) : VisibleImplementation {
		if(!component.properties.exists('visible'))
			component.properties.add(defaultValue ? Visible.visible : Visible.invisible);
		return asVisible(component);
	}

	public var visible(default, null) : Value<Bool>;

	override function init() : Void -> Void {
		visible = new Value(property.defaultValue);
		visible.feed(component.el.consumeToggleVisibility());
		return function() {
			visible.terminate();
			visible = false;
		};
	}
}