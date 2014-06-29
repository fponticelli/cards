package sui.properties;

import js.html.Element;
import steamer.Pulse.End;
import steamer.Value;
import sui.components.Component;
import thx.Assert;

class HTML extends ValueProperty<String> {
	public function new(component : Component, ?defaultHTML : String) {
		super(null == defaultHTML ? component.el.innerHTML : defaultHTML, component, 'html');
		value.feed({
			emit : function(value) component.el.innerHTML = value,
			end : function() component.el.innerHTML = defaultValue
		});
	}
}