package ui.properties;

using steamer.dom.Dom;
import steamer.Value;
import ui.components.Component;

class ToggleClassProperty extends Property<ToggleClassProperty> {
	public static var strong(default, null) : ToggleClassProperty = new ToggleClassProperty('strong', 'strong', false);
	public static var emphasis(default, null) : ToggleClassProperty = new ToggleClassProperty('emphasis', 'emphasis', false);

	public var className(default, null) : String;
	public var defaultValue(default, null) : Bool;
	public function new(name : String, className : String, defaultValue : Bool) {
		super(name);
		this.className = className;
		this.defaultValue = defaultValue;
	}

	override public function inject(component : Component)
		return new ToggleClassPropertyImplementation(component, this);
}

class ToggleClassPropertyImplementation extends PropertyImplementation<ToggleClassProperty> {
	public static function asToggleEmphasis(name : String, component : Component) : ToggleClassPropertyImplementation
		return asToggleClass('emphasis');
	public static function asToggleStrong(name : String, component : Component) : ToggleClassPropertyImplementation
		return asToggleClass('strong');
	public static function asToggleClass(name : String, component : Component) : ToggleClassPropertyImplementation
		return cast component.properties.implementations.get(name);

	public var toggle(default, null) : Value<Bool>;

	override function init() : Void -> Void {
		toggle = new Value(property.defaultValue);
		toggle.feed(component.el.consumeToggleClass(property.className));
		return function() {
			visible.terminate();
			visible = false;
		};
	}
}