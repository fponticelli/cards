package cards.ui.input;

import js.html.Element;
import cards.components.Component;
import cards.model.SchemaType;

class EditorFactory {
  public static function create(type : SchemaType, container : Element, parent : Component) : IEditor {
    return switch type {
      case ArrayType(t):
        new ArrayEditor(container, parent, t);
      case BoolType:
        new BoolEditor(container, parent);
      case CodeType:
        new CodeEditor(container, parent);
      case DateType:
        new DateEditor(container, parent, true);
      case FloatType:
        new NumberEditor(container, parent);
      case ObjectType(fields):
        new ObjectEditor(container, parent, fields);
      case ReferenceType:
        new ReferenceEditor(container, parent);
      case StringType:
        new TextEditor(container, parent);
      case _:
        throw 'Editor for $type has not been implemented yet';
    }
  }
}