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
import ui.Button;
import ui.SchemaType.StringType;
import ui.Toolbar;
import ui.DataEvent;
import ui.SchemaEvent;

class ModelView {
	public var component(default, null) : Component;
	public var schema(default, null) : Producer<SchemaEvent>;
	public var data(default, null) : Producer<DataEvent>;
	public var toolbar(default, null) : Toolbar;
	var feedSchema : Pulse<SchemaEvent> -> Void;
	var feedData : Pulse<DataEvent> -> Void;
	var fields : Map<String, Bool>;
	public function new() {
		component = new Component({
			template : '<div class="modelview"></div>'
		});
		toolbar = new Toolbar();
		toolbar.component.appendTo(component.el);

		var buttonAdd = new Button('', 'plus');
		buttonAdd.component.appendTo(toolbar.left);
		buttonAdd.clicks.feed({
			onPulse : function(pulse) {
				switch pulse {
					case Emit(_):
							addField(guessFieldName(), StringType);
					case _:
				}
			}
		});


		this.feedSchema = function(_) {};
		schema = new Producer(function(feed) {
			this.feedSchema = feed;
		});

		this.feedData = function(_) {};
		data = new Producer(function(feed) {
			this.feedData = feed;
		});

		fields = new Map();
	}

	public function guessFieldName() {
		var id = 0,
			prefix = 'field',
			t;
		function assemble(id) {
			return id > 0 ? [prefix, '$id'].join('_') : prefix;
		}
		while(fields.exists(t = assemble(id))) {
			id++;
		}
		return t;
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

		keyText.text
			.filter(function(newname : String) {
				// check that it doesn't exist already
				if(fields.exists(newname)) {
					// if exists revert and don't propagate
					keyText.text.value = oldname;
					return false;
				} else {
					return true;
				}
			})
			.map(function(newname : String) {
				// rename field name in fields
				if(null != oldname) {
					var v = fields.get(oldname);
					fields.remove(oldname);
					fields.set(newname, v);
				}
				var r = RenameField(oldname, newname);
				oldname = newname;
				return r;
			})
			.feed(Bus.feed(feedSchema));

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

		fields.set(name, true);
	}
}