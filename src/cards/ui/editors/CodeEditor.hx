package cards.ui.editors;

import thx.stream.Emitter;
import cards.components.Component;
import cards.components.ComponentOptions;
import thx.stream.Value;
import cards.properties.Text;
import cards.model.SchemaType;
import cards.ui.editors.TextEditor;
using thx.stream.dom.Dom;

class CodeEditor extends TextEditor {
  public function new(options : TextEditorOptions) {
    if(null == options.inputEvent)
      options.inputEvent = function(component : Component) return component.el.streamEvent('blur');
    super(options);
    component.el.classList.add('code');
  }
}