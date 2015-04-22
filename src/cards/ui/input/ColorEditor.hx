package cards.ui.input;

import cards.model.SchemaType;
import js.html.DOMElement as Element;
import cards.components.Component;

class ColorEditor extends InputBasedEditor {
  public function new(container : Element, parent : Component) {
    super(container, parent, StringType, 'color');
  }
}