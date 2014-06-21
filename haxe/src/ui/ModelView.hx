package ui;

import js.html.Element;
import sui.components.Component;
import sui.properties.Attribute;
import sui.properties.Text;
import sui.properties.ToggleAttribute;
using steamer.dom.Dom;

class ModelView {
	public var component(default, null) : Component;
	public function new() {
		component = new Component({
			template : '<div class="modelview"></div>'
		});
	}

	public function addField(name : String, type : SchemaType) {
		var field = Field.create({ parent : component });
		field.field.appendTo(component.el);

		// setup field key
		var keyEditor = new Attribute(field.key, 'contenteditable', 'contenteditable', 'true');
		var keyText   = new Text(field.key, name);
		var keyInput  = field.key.el.produceEvent('input');
		keyInput.producer.map(function(_) {
			return field.key.el.textContent;
		}).feed(keyText.text);
		keyText.text.feed(new steamer.consumers.LoggerConsumer('input'));
	}
}