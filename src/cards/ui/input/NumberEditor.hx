package cards.ui.input;

import cards.model.SchemaType;
import js.html.Element;

class NumberEditor extends InputBasedEditor {
  public function new(container : Element) {
    super(container, FloatType, 'number', 'number', 'input', function(el) return (el.valueAsNumber : TypedValue));
  }
}