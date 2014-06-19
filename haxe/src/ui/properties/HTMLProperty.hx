package ui.properties;

import js.html.Element;
import steamer.Pulse.End;
import steamer.Value;
import ui.components.Component;

class HTMLProperty extends Property<HTMLProperty> {
	public var defaultHTML(default, null) : String;
	public function new(defaultHTML : String) {
		super('html');
		this.defaultHTML = defaultHTML;
	}

	override public function inject(component : Component) {
		return new HTMLPropertyImplementation(component, this);
	}
}

class HTMLPropertyImplementation extends PropertyImplementation<HTMLProperty> {
	public static function asHTML(component : Component) : HTMLPropertyImplementation {
		return cast component.properties.implementations.get('html');
	}

	public var html(default, null) : Value<String>;

	override function init() : Void -> Void {
		var el       = component.el,
			original = el.innerHTML;
		html = new Value(property.defaultText);
		html.feed(new SimpleConsumer(
			function(value) el.innerHTML = value,
			function() el.innerHTML = original
		));
		return function() {
			html.terminate();
			html = null;
		};
	}
}