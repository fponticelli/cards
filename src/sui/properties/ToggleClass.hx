package sui.properties;

using steamer.dom.Dom;
import steamer.Value;
import sui.components.Component;
import thx.Assert;

class ToggleClass extends ValueProperty<Bool> {
	public var className(default, null) : String;

	public function new(component : Component, name : String, ?className : String) {
		var defaultValue = component.el.classList.contains(className);
		this.className = null == className ? name : className;
		super(defaultValue, component, name);
	}

	override function init() : Void -> Void {
		stream.feed(component.el.consumeToggleClass(className));
		return function() {
			if(defaultValue)
				component.el.classList.add(className);
			else
				component.el.classList.remove(className);
		};
	}
}