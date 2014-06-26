package ui;

import js.html.Element;
import steamer.Producer;
import steamer.Value;
import sui.components.Component;
import dom.Dom;
import sui.components.ComponentOptions;
import sui.properties.ToggleClass;
import ui.TextEditor;
using steamer.Consumer;
using ui.Expression;
using steamer.dom.Dom;
import haxe.ds.Option;

class ContextField {
	public var component(default, null) : Component;
	public var value(default, null) : TextEditor;
	public var focus(default, null) : Producer<Bool>;
	public var name(default, null) : String;
	public var withError(default, null) : Value<Option<String>>;

	var classActive : ToggleClass;

	public function new(options : ContextFieldOptions) {
		if(null == options.template && null == options.el)
			options.template = '<div class="field"><div class="key"></div><div class="value"></div></div>';

		component = new Component(options);
		// setup field key
		var key = Query.first('.key', component.el);
		key.innerText = options.display;

		this.name = options.name;

		// setup field value
		// TODO support multiple editors data types
		value = new TextEditor({
			el : Query.first('.value', component.el),
			parent : component,
			defaultText : options.value
		});
		// 250 is kind of a magic value and it is enough
		// to be able to click on a button
		// and not have lost focus in the meanwhile
		focus = value.focus.debounce(250).distinct();
		classActive = new ToggleClass(component, 'active');
		focus.feed(classActive.toggleClassName);

		var hasError = component.el.consumeToggleClass('error');
		withError = new Value(None);
		withError.map(function(o) {
			return switch o {
				case None: false;
				case Some(_): true;
			}
		}).feed(hasError);
	}

	public function destroy() {
		classActive.dispose();
		component.destroy();
		value = null;
		focus = null;
	}
}

typedef ContextFieldOptions = {>ComponentOptions,
	display : String,
	name : String,
	value : String
}