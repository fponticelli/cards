package cards.ui.editors;

import js.html.DOMElement as Element;
import cards.components.Component;
import cards.model.SchemaType;

class EditorPicker {
  public static function pick(type : SchemaType, container : Element, parent : Component, value : Dynamic) : Editor<Dynamic> {
    return switch type {
      case BoolType:
        new BoolEditor({ container : container, parent : parent, defaultValue : value });
      case CodeType:
        new CodeEditor({ container : container, parent : parent, defaultText : value, placeHolder : 'code' });
      case ReferenceType:
        new ReferenceEditor({ container : container, parent : parent, defaultText : value, placeHolder : 'reference' });
      case StringType:
        new TextEditor({ container : container, parent : parent, defaultText : value, placeHolder : 'content' });
      case DateType:
        new DateEditor({ container : container, parent : parent, defaultValue : value });
      case FloatType:
        new FloatEditor({ container : container, parent : parent, defaultValue : value });
      case ArrayType(t):
        new ArrayEditor({ container : container, parent : parent, defaultValue : value, innerType : t });
      case _:
        throw 'Editor for $type has not been implemented yet';
    }
  }
}