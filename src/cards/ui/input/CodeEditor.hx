package cards.ui.input;

import cards.components.ComponentOptions;
import cards.model.SchemaType;
import cards.ui.input.TypedValue;
import js.html.Element;
import js.html.TextAreaElement;
import udom.Dom.Query;
using thx.stream.dom.Dom;

// TODO focus
class CodeEditor extends Editor {
  public function new(container : Element) {
    var options = {
      template  : '<div class="editor code"></div>',
      container : container
    };
    super(CodeType, options);

    var editor : Dynamic = untyped __js__('CodeMirror')(component.el, {
      mode : "javascript",
      tabSize : 2,
      lineNumbers : true,
      tabindex : 1,
      lineWrapping : true

    });
    editor.on("changes", function() {
      var content = editor.doc.getValue();
      stream.pulse(new TypedValue(CodeType, content));
    });
    editor.on("focus", function() {
      focus.set(true);
    });
    editor.on("blur", function() {
      focus.set(false);
    });
  }
}