package sui.properties;

import js.html.Element;
import steamer.Pulse.End;
import steamer.Value;
import sui.components.Component;
import thx.Assert;

class Text extends ValueProperty<String> {
	public function new(component : Component, defaultText : String) {
		super(defaultText, component, 'text');
	}

	override function init() : Void -> Void {
		var el       = component.el,
			original = el.innerText;
		stream.feed({
			emit : function(value) el.innerText = value,
			end : function() el.innerText = original
		});
		return function() {};
	}
}