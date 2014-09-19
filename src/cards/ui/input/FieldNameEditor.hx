package cards.ui.input;

import cards.model.SchemaType;
import js.html.Element;
import cards.components.Component;
import js.html.KeyboardEvent;

// TODO limit input to acceptable field value
// TODO limit paste values
class FieldNameEditor extends InputBasedEditor {
  //static var pattern = ~/[a-z]_/i;
  public function new(container : Element, parent : Component) {
    super(container, parent, FloatType, 'fieldname', 'text', 'change');
    component.el.addEventListener('keyup', function(e : KeyboardEvent) {

    }, false);
  }
}