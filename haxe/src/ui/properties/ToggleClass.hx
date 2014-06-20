package ui.properties;

using steamer.dom.Dom;
import steamer.Value;
import ui.components.Component;

class ToggleClass extends Property {
	public inline static function asToggleEmphasis(component : Component, name : String) : ToggleClassImplementation
		return asToggleClass('emphasis');
	public inline static function asToggleStrong(component : Component, name : String) : ToggleClassImplementation
		return asToggleClass('strong');
	public inline static function asToggleClass(component : Component, name : String) : ToggleClassImplementation
		return cast component.properties.get(name);

	public static function createStrong(component : Component)
		return new ToggleClass(component, 'strong');
	public static function createEmphasis(component : Component)
		return new ToggleClass(component, 'emphasis');

	public function new(component : Component, name : String, className : String) {
		this.className = null == className ? name : className;
		super(component, name);
	}

	public var className(default, null) : Bool;
	public var toggleClassName(default, null) : Value<Bool>;

	override function init() : Void -> Void {
		toggleClassName = new Value(className);
		toggleClassName.feed(component.el.consumeToggleClass(className));
		return function() {
			visible.terminate();
			visible = false;
		};
	}
}