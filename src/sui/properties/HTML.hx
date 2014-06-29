package sui.properties;

import js.html.Element;
import steamer.Pulse.End;
import steamer.Value;
import sui.components.Component;
import thx.Assert;

class HTML extends ValueProperty<String> {
	public function new(component : Component, defaultHtml : String) {
		super(defaultHtml, component, 'html');
	}

	override function init() : Void -> Void {
		var el       = component.el,
			original = el.innerHTML;
		value.feed({
			emit : function(value) el.innerHTML = value,
			end : function() el.innerHTML = original
		});
		return function() { };
	}
}