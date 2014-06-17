package ui.properties;

import steamer.Value;

class VisibleProperty extends Property {
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

class VisiblePropertyImplementation extends PropertyImplementation {
	public static function asVisible(component : Component) : VisiblePropertyImplementation {
		return component.properties.implementations.get('visible');
	}

	public var visible(default, null) : Value<Bool>;

	public function new(component : Component, property : Property) {
		super(component, property);
	}

	override function init() : Void -> Void {
		visible = new Value(property.defaultValue);

	}
}