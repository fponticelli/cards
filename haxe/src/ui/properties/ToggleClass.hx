package ui.properties;

using steamer.dom.Dom;
import steamer.Value;
import ui.components.Component;

class ToggleClass extends Property<ToggleClass> {
	public static var strong(default, null) : ToggleClass = new ToggleClass('strong', 'strong', false);
	public static var emphasis(default, null) : ToggleClass = new ToggleClass('emphasis', 'emphasis', false);

	public var className(default, null) : String;
	public var defaultValue(default, null) : Bool;
	public function new(name : String, className : String, defaultValue : Bool) {
		super(name);
		this.className = className;
		this.defaultValue = defaultValue;
	}

	override public function inject(component : Component)
		return new ToggleClassImplementation(component, this);
}

class ToggleClassImplementation extends Implementation<ToggleClass> {
	public static function asToggleEmphasis(name : String, component : Component) : ToggleClassImplementation
		return asToggleClass('emphasis');
	public static function asToggleStrong(name : String, component : Component) : ToggleClassImplementation
		return asToggleClass('strong');
	public static function asToggleClass(name : String, component : Component) : ToggleClassImplementation
		return cast component.properties.implementations.get(name);

	public var toggle(default, null) : Value<Bool>;

	override function init() : Void -> Void {
		toggle = new Value(.defaultValue);
		toggle.feed(component.el.consumeToggleClass(property.className));
		return function() {
			visible.terminate();
			visible = false;
		};
	}
}