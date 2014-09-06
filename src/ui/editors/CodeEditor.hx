package ui.editors;

import thx.stream.Emitter;
import sui.components.Component;
import sui.components.ComponentOptions;
import thx.stream.Value;
import sui.properties.Text;
import ui.SchemaType;
import ui.editors.TextEditor;
using thx.stream.dom.Dom;

class CodeEditor extends TextEditor {
  public function new(options : TextEditorOptions) {
    if(null == options.inputEvent)
      options.inputEvent = function(component : Component) return component.el.produceEvent('blur');
    super(options);
    component.el.classList.add('code');
  }
}