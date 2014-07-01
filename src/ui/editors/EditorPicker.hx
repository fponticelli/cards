package ui.editors;

import js.html.Element;
import sui.components.Component;
import ui.SchemaType;

class EditorPicker {
	public static function pick(type : SchemaType, el : Element, parent : Component, value : Dynamic) : Editor<Dynamic> {
		return switch type {
			case BoolType:
				new BoolEditor({ el : el, parent : parent, defaultValue : value });
			case CodeType:
				new CodeEditor({ el : el, parent : parent, defaultText : value });
			case StringType:
				new TextEditor({ el : el, parent : parent, defaultText : value });
			case _:
				throw 'Editor for $type has not been implemented yet';
		}
	}
}