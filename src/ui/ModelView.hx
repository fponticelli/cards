package ui;

import js.html.Element;
import steamer.MultiProducer;
using steamer.Producer;
import steamer.Pulse;
import sui.components.Component;
import thx.Assert;
import ui.DataEvent;
import ui.SchemaEvent;
import ui.widgets.Toolbar;
import dom.Dom;

class ModelView {
	public var component(default, null) : Component;
	public var schema(default, null) : Producer<SchemaEvent>;
	public var data(default, null) : Producer<DataEvent>;
	public var toolbar(default, null) : Toolbar;
	public var currentField(default, null) : Null<ModelViewField>;

	var pairs : Element;

	var feedSchema : Pulse<SchemaEvent> -> Void;
	var feedData : Pulse<DataEvent> -> Void;
	var fields : Map<String, ModelViewField>;
	var fieldFocus : MultiProducer<ModelViewField>;
	var fieldBlur : MultiProducer<ModelViewField>;

	public function new() {
		component = new Component({
			template : '<div class="modelview"></div>'
		});
		toolbar = new Toolbar({});
		toolbar.component.appendTo(component.el);

		var buttonAdd = toolbar.left.addButton('', Config.icons.add);
		buttonAdd.clicks.feed(function(_){
			addField(guessFieldName(), StringType);
		});

		var buttonRemove = toolbar.right.addButton('', Config.icons.remove);
		buttonRemove.clicks.feed(function(_) {
			removeField(currentField);
		});
		buttonRemove.enabled.value = false;

		pairs = Html.parse('<div class="fields"><div></div></div>');
		component.el.appendChild(pairs);
		pairs = Query.first('div', pairs);

		this.feedSchema = function(_) {};
		schema = new Producer(function(feed) {
			this.feedSchema = feed;
		});

		this.feedData = function(_) {};
		data = new Producer(function(feed) {
			this.feedData = feed;
		});

		fields = new Map();

		fieldFocus = new MultiProducer();
		fieldFocus.feed(function(field) {
			this.currentField = field;
			buttonRemove.enabled.value = null != field;
		});
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

	public function removeFieldByName(name : String) {
		var field = fields.get(name);
		removeField(field);
	}

	public function removeField(field : ModelViewField) {
		Assert.notNull(field, 'when removing a field it should not be null');
		var name = field.key.value.value;
		field.destroy();
		if(fields.remove(name)) {
			feedSchema(Emit(DeleteField(name)));
		}
	}

	public function addField(name : String, type : SchemaType) {
		var field = new ModelViewField({
			container : pairs,
			parent : component,
			key : name
		});

		// setup field key
		var oldname = null;

		function createSetValue() {
			return SetValue(field.key.value.value, field.value.value.value, field.value.type);
		}

		field.key.value
			.filter(function(newname : String) {
				// check that it doesn't exist already
				if(fields.exists(newname)) {
					// if exists revert and don't propagate
					field.key.value.value = oldname;
					return false;
				} else {
					return true;
				}
			})
			.map(function(newname : String) {
				if(null == oldname) {
					// new field
					oldname = newname;
					return AddField(newname, field.value.type);
				} else {
					// rename field name in fields
					var v = fields.get(oldname);
					fields.remove(oldname);
					fields.set(newname, v);
					var r = RenameField(oldname, newname);
					oldname = newname;
					return r;
				}
			})
			.feed(Bus.feed(feedSchema));

		// setup field value
		// TODO support multiple editors data types
		// the debounce is not only practical to avoid too many calls
		// but also helps so that data events occur after schema
		// events (not the best synch mechanism ever)
		field.value.value.map(function(_ : String) {
			return createSetValue();
		}).debounce(250).feed(Bus.feed(feedData));
		fieldFocus.add(field.focus.map(function(v) return v ? field : null));

		fields.set(name, field);
	}
}