package ui;

import steamer.Producer;
import steamer.Value;
import sui.components.Component;
import sui.components.ComponentOptions;
import dom.Dom;
import sui.properties.ToggleClass;
import sui.properties.ValueProperty;
import ui.editors.CodeEditor;
import ui.editors.Editor;
import ui.editors.EditorPicker;
using steamer.dom.Dom;
import haxe.ds.Option;
import ui.SchemaType;
import ui.widgets.Tooltip;

class ContextField {
	public static var tooltip(default, null) : Tooltip = new Tooltip({ classes : 'tooltip error' });
	public var component(default, null) : Component;
	public var editor(default, null) : Editor<Dynamic>;
	public var focus(default, null) : Value<Bool>;
	public var active(default, null) : Value<Bool>;
	public var name(default, null) : String;
	public var withError(default, null) : Value<Option<String>>;

	public function new(options : ContextFieldOptions) {
		if(null == options.template && null == options.el)
			options.template = '<div class="field"><div class="key-container"><div class="key"></div></div><div class="value-container"><div class="value"></div></div></div>';

		component = new Component(options);
		// setup field key
		var key = Query.first('.key', component.el);
		key.innerText = options.display;

		this.name = options.name;

		// setup field value
		// TODO support multiple editors data types
		editor = EditorPicker.pick(
			options.type,
			Query.first('.value', component.el),
			component,
			options.value.value
		);
		// 250 is kind of a magic value and it is enough
		// to be able to click on a button
		// and not have lost focus in the meanwhile
		focus  = new Value(false);
		active = new Value(false);
		editor.focus.debounce(250).distinct().feed(focus);
		active.feed(component.el.consumeToggleClass('active'));

		var hasError = component.el.consumeToggleClass('error');
		withError = new Value(None);
		withError.map(function(o) {
			return switch o {
				case None: false;
				case Some(_): true;
			}
		}).feed(hasError);
		withError.feed(function(o) {
			switch o {
				case Some(err):
					tooltip.setContent(err);
					tooltip.anchorTo(component.el, Top, Bottom);
					tooltip.visible.value = true;
				case _:
					if(tooltip.anchorElement == component.el)
						tooltip.visible.value = false;
			}
		});

		editor.value.feed(options.value.stream);
		// TODO does this leak?
		options.value.stream.feed(editor.value);
	}

	public function destroy() {
		component.destroy();
		editor = null;
		focus = null;
	}
}

typedef ContextFieldOptions = {>ComponentOptions,
	type : SchemaType,
	display : String,
	name : String,
	value : ValueProperty<Dynamic>
}