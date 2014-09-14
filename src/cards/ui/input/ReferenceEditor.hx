package cards.ui.input;

import cards.model.SchemaType;
import js.html.Element;

class ReferenceEditor extends InputBasedEditor {
  public function new(container : Element) {
    super(container, ReferenceType, 'reference', 'text', 'input', function(el) return new TypedValue(ReferenceType, el.value));
  }
}