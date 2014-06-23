package sui.properties;

using steamer.dom.Dom;
import steamer.Value;
import sui.components.Component;
import thx.Assert;

class ToggleClass extends Property {
	public inline static function asToggleEmphasis(component : Component, name : String) : ToggleClass
		return asToggleClass(component, 'emphasis');
	public inline static function asToggleStrong(component : Component, name : String) : ToggleClass
		return asToggleClass(component, 'strong');
	public static function asToggleClass(component : Component, name : String) : ToggleClass {
		var property = component.properties.get(name);
		Assert.is(property, ToggleClass);
		return cast property;
	}

	public static function createStrong(component : Component)
		return new ToggleClass(component, 'strong');
	public static function createEmphasis(component : Component)
		return new ToggleClass(component, 'emphasis');

	public function new(component : Component, name : String, ?className : String, ?defaultHasClass = false) {
		this.defaultHasClass = defaultHasClass;
		this.className = null == className ? name : className;
		super(component, name);
	}

	public var defaultHasClass(default, null) : Bool;
	public var className(default, null) : String;
	public var toggleClassName(default, null) : Value<Bool>;

	override function init() : Void -> Void {
		toggleClassName = new Value(defaultHasClass);
		toggleClassName.feed(component.el.consumeToggleClass(className));
		return function() {
			toggleClassName.terminate();
			toggleClassName = null;
		};
	}
}