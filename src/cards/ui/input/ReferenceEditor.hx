package cards.ui.input;

import cards.model.SchemaType;
import js.html.Element;
import cards.components.Component;

class ReferenceEditor extends InputBasedEditor {
  public function new(container : Element, parent : Component) {
    super(container, parent, ReferenceType, 'reference', 'text', 'input', function(el) return new TypedValue(ReferenceType, el.value));
  }
}