package sui.properties;

import js.html.Element;
import steamer.Pulse.End;
import steamer.Value;
import sui.components.Component;
import thx.Assert;

class Text extends Property {
	public var defaultText(default, null) : String;
	public var text(default, null) : Value<String>;

	public function new(component : Component, defaultText : String) {
		this.defaultText = defaultText;
		super(component, 'text');
	}

	override function init() : Void -> Void {
		var el       = component.el,
			original = el.innerText;
		text = new Value(defaultText);
		text.feed({
			emit : function(value) el.innerText = value,
			end : function() el.innerText = original
		});
		return function() {
			text.terminate();
			text = null;
		};
	}
}