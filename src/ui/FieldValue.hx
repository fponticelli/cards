package ui;

import js.html.Element;
import sui.components.Component;
import ui.SchemaType;
import thx.Assert;
import ui.editors.EditorPicker;
import ui.editors.Editor;
import dom.Dom;
import types.TypeTransform;

class FieldValue {
	var type : SchemaType;
	var editor : Editor<Dynamic>;
	var parent : Component;
	var container : Element;
	var afterCreate : InitFunction;
	var afterRemove : InitFunction;
	public function new(parent : Component, container : Element, afterCreate : InitFunction, afterRemove : InitFunction) {
		this.parent = parent;
		this.container = container;
		this.afterCreate = afterCreate;
		this.afterRemove = afterRemove;
	}

	public function setEditor(type, ?value : Dynamic) {
		if(null != editor) {
			if(null == value) {
				value = TypeTransform.transform(this.type, type)(editor.value.value);
			}
			afterRemove(this.type, editor);
			editor.value.terminate();
			editor.focus.terminate();
		}
		container.innerHTML = '<div class="value"></div>';
		var el = Query.first('.value', container);
		this.type = type;
		editor = EditorPicker.pick(type, el, parent, value);
		afterCreate(this.type, editor);
	}
}

typedef InitFunction = SchemaType -> Editor<Dynamic> -> Void;