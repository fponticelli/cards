package cards.ui.input;

import cards.model.SchemaType;
import js.html.Element;
import cards.components.Component;

class NumberEditor extends InputBasedEditor {
  public function new(container : Element, parent : Component) {
    super(container, parent, FloatType, 'number', 'number', 'input', function(el) return (el.valueAsNumber : TypedValue));
  }
}