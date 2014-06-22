package ui;

import steamer.Producer;
import sui.components.Component;
import dom.Dom;
import sui.components.ComponentOptions;
import ui.TextEditor;

class Field {
	public var component(default, null) : Component;
	public var key(default, null) : TextEditor;
	public var value(default, null) : TextEditor;
	public var focus(default, null) : Producer<Bool>;

	public function new(options : FieldOptions) {
		if(null == options.template && null == options.el)
			options.template = '<div class="field"><div class="key"></div><div class="value"></div></div>';

		component = new Component(options);
		// setup field key
		key = new TextEditor({
			el : Query.first('.key', component.el),
			parent : component,
			defaultText : options.key
		});

		// setup field value
		// TODO support multiple editors data types
		value = new TextEditor({
			el : Query.first('.value', component.el),
			parent : component,
			defaultText : ''
		});

		focus = key.focus.merge(value.focus).debounce(20).distinct();
	}
}

typedef FieldOptions = {>ComponentOptions,
	key : String
}