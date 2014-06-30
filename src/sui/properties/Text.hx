package sui.properties;

import sui.components.Component;

class Text extends ValueProperty<String> {
	public function new(component : Component, ?defaultText : String) {
		super(null == defaultText ? component.el.innerText : defaultText, component, 'text');
		stream.feed({
			emit : function(value) component.el.innerText = value,
			end : function() component.el.innerText = defaultValue
		});
	}
}