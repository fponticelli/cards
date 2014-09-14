package cards.ui.input;

import cards.model.SchemaType;
import js.html.Element;

class ColorEditor extends InputBasedEditor {
  public function new(container : Element) {
    super(container, StringType, 'color');
  }
}