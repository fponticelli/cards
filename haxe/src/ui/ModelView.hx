package ui;

import js.html.Element;
import steamer.Producer;
import steamer.Pulse;
import steamer.SimpleConsumer;
import sui.components.Component;
import sui.properties.Attribute;
import sui.properties.Text;
import sui.properties.ToggleAttribute;
using steamer.dom.Dom;
import ui.DataEvent;
import ui.SchemaEvent;

class ModelView {
	public var component(default, null) : Component;
	public var schema(default, null) : Producer<SchemaEvent>;
	public var data(default, null) : Producer<DataEvent>;
	var feedSchema : Pulse<SchemaEvent> -> Void;
	var feedData : Pulse<DataEvent> -> Void;
	public function new() {
		component = new Component({
			template : '<div class="modelview"></div>'
		});

		this.feedSchema = function(_) {};
		schema = new Producer(function(feed) {
			this.feedSchema = feed;
		});

		this.feedData = function(_) {};
		data = new Producer(function(feed) {
			this.feedData = feed;
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

		var oldname = null;
		keyText.text.map(function(newname : String) {
			var r = RenameField(oldname, newname);
			oldname = newname;
			return r;
		}).feed(Bus.feed(feedSchema));

		// setup field value
		// TODO support multiple editors data types
		var valueEditor = new Attribute(field.value, 'contenteditable', 'contenteditable', 'true');
		var valueText   = new Text(field.value, "");
		var valueInput  = field.value.el.produceEvent('input');
		valueInput.producer.map(function(_) {
			return field.value.el.textContent;
		}).feed(valueText.text);
		valueText.text.map(function(text : String) {
			return SetStringValue(keyText.text.value, text);
		}).feed(Bus.feed(feedData));
	}
}