package cards.ui.input;

import cards.model.SchemaType;
import js.html.Element;
import cards.components.Component;

class RangeEditor extends InputBasedEditor {
  public function new(container : Element, parent : Component) {
    super(container, parent, FloatType, 'range', 'range', 'input', function(el) return (el.valueAsNumber : TypedValue));
  }
}