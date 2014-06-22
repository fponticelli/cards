package ui;

import js.html.Element;
using steamer.Consumer;
using steamer.dom.Dom;
import steamer.Producer;
import steamer.Pulse;
import sui.components.Component;
import sui.properties.Attribute;
import sui.properties.Text;
import ui.DataEvent;
import ui.SchemaEvent;
import ui.SchemaType;
import ui.TextEditor;

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
		buttonAdd.clicks.feed(function(_){
			addField(guessFieldName(), StringType);
		}.toConsumer());

		var buttonRemove = new Button('', 'minus');
		buttonRemove.component.appendTo(toolbar.right);
		buttonRemove.clicks.feed(function(_) {
			trace('remove');
		}.toConsumer());


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
		function assemble(id)
			return id > 0 ? [prefix, '$id'].join('_') : prefix;
		while(fields.exists(t = assemble(id))) id++;
		return t;
	}

	public function addField(name : String, type : SchemaType) {
		var field = new Field({
			container : component.el,
			parent : component,
			key : name
		});

		// setup field key
		var oldname = null;

		field.key.text
			.filter(function(newname : String) {
				// check that it doesn't exist already
				if(fields.exists(newname)) {
					// if exists revert and don't propagate
					field.key.text.value = oldname;
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
		field.value.text.map(function(text : String) {
			return SetStringValue(field.value.text.value, text);
		}).feed(Bus.feed(feedData));

		fields.set(name, true);
	}
}