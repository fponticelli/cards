package cards.ui.input;

import js.html.Element;
import cards.components.Component;
import cards.model.SchemaType;


// TODO editors are not picking up parent
class EditorFactory {
  public static function create(type : SchemaType, container : Element, parent : Component) : IEditor {
    return switch type {
      case ArrayType(t):
        new ArrayEditor(container, t);
      case BoolType:
        new BoolEditor(container);
      case CodeType:
        new CodeEditor(container);
      case DateType:
        new DateEditor(container, true);
      case FloatType:
        new NumberEditor(container);
      case ObjectType(fields):
        new ObjectEditor(container, fields);
      case ReferenceType:
        new ReferenceEditor(container);
      case StringType:
        new TextEditor(container);
      case _:
        throw 'Editor for $type has not been implemented yet';
    }
  }
}