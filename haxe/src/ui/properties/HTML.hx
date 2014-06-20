package ui.properties;

import js.html.Element;
import steamer.Pulse.End;
import steamer.Value;
import ui.components.Component;
import thx.Assert;

class HTML extends Property {
	public static function asHTML(component : Component) : HTML {
		var property = component.properties.get('html');
		Assert.is(property, HTML);
		return cast property;
	}

	public function new(component : Component, defaultHtml : String) {
		this.defaultHTML = defaultHTML;
		super(component, 'html');
	}

	public var html(default, null) : Value<String>;
	public var defaultHTML(default, null) : String;

	override function init() : Void -> Void {
		var el       = component.el,
			original = el.innerHTML;
		html = new Value(defaultHTML);
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