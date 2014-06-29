package sui.properties;

using steamer.dom.Dom;
import steamer.Value;
import sui.components.Component;
import thx.Assert;

class ToggleClass extends ValueProperty<Bool> {
	public function new(component : Component, name : String, ?className : String) {
		var defaultValue = component.el.classList.contains(className);
		super(defaultValue, component, name);
		className = null == className ? name : className;
		stream.feed(component.el.consumeToggleClass(className));
		cancels.push(function() {
			if(defaultValue)
				component.el.classList.add(className);
			else
				component.el.classList.remove(className);
		});
	}
}