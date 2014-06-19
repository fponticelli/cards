package ui.properties;

import js.html.Element;
import steamer.Pulse.End;
import steamer.Value;
import ui.components.Component;
import steamer.SimpleConsumer;

class TextProperty extends Property<TextProperty> {
	public var defaultText(default, null) : String;
	public function new(defaultText : String) {
		super('text');
		this.defaultText = defaultText;
	}

	override public function inject(component : Component) {
		return new TextPropertyImplementation(component, this);
	}
}

class TextPropertyImplementation extends PropertyImplementation<TextProperty> {
	public static function asText(component : Component) : TextPropertyImplementation {
		return cast component.properties.implementations.get('text');
	}

	public var text(default, null) : Value<String>;

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