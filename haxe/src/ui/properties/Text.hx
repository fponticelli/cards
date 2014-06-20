package ui.properties;

import js.html.Element;
import steamer.Pulse.End;
import steamer.Value;
import ui.components.Component;
import steamer.SimpleConsumer;

class Text extends Property {
	public inline static function asText(component : Component) : TextImplementation {
		return cast component.properties.get('text');
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