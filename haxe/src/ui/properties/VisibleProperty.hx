package ui.properties;

using steamer.dom.Dom;
import steamer.Value;
import ui.components.Component;

class VisibleProperty extends Property<VisibleProperty> {
	public static var visible(default, null) : VisibleProperty = new VisibleProperty(true);
	public static var invisible(default, null) : VisibleProperty = new VisibleProperty(false);

	public var defaultValue(default, null) : Bool;
	public function new(defaultValue : Bool) {
		super('visible');
		this.defaultValue = defaultValue;
	}

	override public function inject(component : Component) {
		return new VisiblePropertyImplementation(component, this);
	}
}

class VisiblePropertyImplementation extends PropertyImplementation<VisibleProperty> {
	public static function asVisible(component : Component) : VisiblePropertyImplementation {
		return component.properties.implementations.get('visible');
	}

	public static function makeVisible(component : Component, defaultValue = true) : VisiblePropertyImplementation {
		if(!component.properties.exists('visible'))
			component.properties.add(defaultValue ? VisibleProperty.visible : VisibleProperty.invisible);
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