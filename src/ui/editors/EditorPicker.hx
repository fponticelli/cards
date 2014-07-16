package ui.editors;

import js.html.Element;
import sui.components.Component;
import ui.SchemaType;

class EditorPicker {
	public static function pick(type : SchemaType, el : Element, parent : Component, value : Dynamic) : Editor<Dynamic> {
		return switch type {
			case BoolType:
				new BoolEditor({ container : el, parent : parent, defaultValue : value });
			case CodeType:
				new CodeEditor({ container : el, parent : parent, defaultText : value, placeHolder : 'code' });
			case ReferenceType:
				new ReferenceEditor({ container : el, parent : parent, defaultText : value, placeHolder : 'reference' });
			case StringType:
				new TextEditor({ container : el, parent : parent, defaultText : value, placeHolder : 'content' });
			case DateType:
				new DateEditor({ container : el, parent : parent, defaultValue : value });
			case FloatType:
				new FloatEditor({ container : el, parent : parent, defaultValue : value });
			case _:
				throw 'Editor for $type has not been implemented yet';
		}
	}
}