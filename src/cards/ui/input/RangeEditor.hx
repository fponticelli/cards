package cards.ui.input;

import cards.model.SchemaType;
import js.html.Element;

class RangeEditor extends InputBasedEditor {
  public function new(container : Element) {
    super(container, FloatType, 'range', 'range', 'input', function(el) return (el.valueAsNumber : TypedValue));
  }
}