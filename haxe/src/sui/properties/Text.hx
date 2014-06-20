package sui.properties;

import js.html.Element;
import steamer.Pulse.End;
import steamer.Value;
import sui.components.Component;
import steamer.SimpleConsumer;
import thx.Assert;

class Text extends Property {
	public static function asText(component : Component) : TextImplementation {
		var property = component.properties.get('text');
		Assert.is(property, Text);
		return cast property;
	}

	public var defaultText(default, null) : String;
	public var text(default, null) : Value<String>;

	public function new(component : Component, defaultText : String) {
		this.defaultText = defaultText;
		super(component);
	}

	override function init() : Void -> Void {
		var el       = component.el,
			original = el.innerText;
		text = new Value(property.defaultText);
		text.feed(new SimpleConsumer(
			function(value) el.innerText = value,
			function() el.innerText = original
		));
		return function() {
			text.terminate();
			text = null;
		};
	}
}