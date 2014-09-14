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
  var editor : Dynamic;
  public function new(container : Element) {
    var options = {
      template  : '<div class="editor code"></div>',
      container : container
    };
    super(CodeType, options);

    editor = untyped __js__('CodeMirror')(component.el, {
      mode : "javascript",
      tabSize : 2,
      lineNumbers : true,
      tabindex : 1,
      lineWrapping : true

    });
    editor.on("changes", changes);
    editor.on("focus", setFocus);
    editor.on("blur", blurFocus);

    stream.subscribe(function(text) {
      var v = text.asValue();
      if(editor.doc.getValue() != v) {
        editor.doc.setValue(v);
      }
    });

    focus.subscribe(function(_) editor.focus());
  }

  function changes() {
    var content = editor.doc.getValue();
    stream.pulse(new TypedValue(CodeType, content));
  }

  function setFocus() focus.set(true);
  function blurFocus() focus.set(false);

  override public function dispose() {
    super.dispose();
    editor.off("changes", changes);
    editor.off("focus", setFocus);
    editor.off("blur", blurFocus);
    editor = null;
  }
}