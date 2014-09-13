package cards.ui.input;

import js.html.Element;
import cards.components.Component;
import cards.model.SchemaType;

class EditorFactory {
  public static function create(type : SchemaType, container : Element, parent : Component) : IEditor {
    return switch type {
      case CodeType:
        new CodeEditor(container);
      case StringType:
        new TextEditor(container);
      case ArrayType(t):
        new ArrayEditor(container, t);
      case _:
        throw 'Editor for $type has not been implemented yet';
    }
  }
}