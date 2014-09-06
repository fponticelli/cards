package ui.editors;

import steamer.Producer;
import sui.components.Component;
import sui.components.ComponentOptions;
import steamer.Value;
import sui.properties.Text;
import ui.SchemaType;
import ui.editors.TextEditor;
using steamer.dom.Dom;

class ReferenceEditor extends TextEditor {
  public function new(options : TextEditorOptions) {
    if(null == options.inputEvent)
      options.inputEvent = function(component : Component) return component.el.produceEvent('blur');
    super(options);
    component.el.classList.add('reference');
  }
}