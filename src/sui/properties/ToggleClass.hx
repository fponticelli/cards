package sui.properties;

using steamer.dom.Dom;
import steamer.Value;
import sui.components.Component;
import thx.Assert;

class ToggleClass extends Property {
	public static function asToggleClass(component : Component, name : String) : ToggleClass {
		var property = component.properties.get(name);
		Assert.is(property, ToggleClass);
		return cast property;
	}

	public function new(component : Component, name : String, ?className : String) {
		this.className = null == className ? name : className;
		super(component, name);
	}

	public var originalHasClass(default, null) : Bool;
	public var className(default, null) : String;
	public var toggleClassName(default, null) : Value<Bool>;

	override function init() : Void -> Void {
		originalHasClass = component.el.classList.contains(className);
		toggleClassName = new Value(originalHasClass);
		toggleClassName.feed(component.el.consumeToggleClass(className));
		return function() {
			if(originalHasClass)
				component.el.classList.add(className);
			else
				component.el.classList.remove(className);
			toggleClassName.terminate();
			toggleClassName = null;
		};
	}
}