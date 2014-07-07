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
import ui.FieldValue;
using thx.core.Options;

class ContextField {
	public static var tooltip(default, null) : Tooltip = new Tooltip({ classes : 'tooltip error' });
	public var component(default, null) : Component;
	//public var editor(default, null) : Editor<Dynamic>;
	public var focus(default, null) : Value<Bool>;
	public var active(default, null) : Value<Bool>;
	public var name(default, null) : String;
	public var withError(default, null) : Value<Option<String>>;
	public var fieldValue(default, null) : FieldValue;
	public var type(default, null) : SchemaType;

	public function new(options : ContextFieldOptions) {
		if(null == options.template && null == options.el)
			options.template = '<div class="field"><div class="key-container"><div class="key"></div></div><div class="value-container"></div></div>';

		component = new Component(options);
		// setup field key
		var key = Query.first('.key', component.el);
		key.innerText = options.display;

		name = options.name;
		type = options.type;

		focus = new Value(false);
		active = new Value(false);
		withError = new Value(None);

		fieldValue = new FieldValue(
			component,
			Query.first('.value-container', component.el),
			function(type : SchemaType, editor : Editor<Dynamic>) {
				editor.focus.feed(focus);
				switch type {
					case CodeType:
						editor.value
							.map(Runtime.toRuntime.bind(_, options.scope))
							.toOption()
							.feed(options.value.runtime)
							.map(function(opt) {
								return switch opt {
									case Some(runtime):
										switch runtime.expression {
											case SyntaxError(e): Some(e);
											case _: None;
										};
									case _: None;
								};
							})
							.feed(withError);
						options.value.runtimeError
							.feed(withError);
					case _:
						editor.value.feed(options.value.stream);
						// TODO does this leak?
						options.value.stream.feed(editor.value);
				}
			}
		);

		var runtime = options.value.runtime.value.toValue();
		if(null != runtime)
			fieldValue.setEditor(CodeType, runtime.code);
		else
			fieldValue.setEditor(options.type, options.value.value);

		active.feed(component.el.consumeToggleClass('active'));

		var clickKey = key.produceEvent('click');
		clickKey.producer
			.feed(function(_) {
				if(null != fieldValue.editor)
					fieldValue.editor.focus.value = true;
			});

		var hasError = component.el.consumeToggleClass('error');
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

	}

	public function destroy() {
		component.destroy();
		focus = null;
	}
}

typedef ContextFieldOptions = {>ComponentOptions,
	type : SchemaType,
	display : String,
	name : String,
	value : ValueProperty<Dynamic>,
	scope : Scope
}