package cards.ui.input;

import cards.components.ComponentOptions;
import cards.model.SchemaType;
import js.html.Element;
import udom.Dom.Query;
using thx.stream.dom.Dom;

class TextEditor extends Editor {
  public function new(container : Element) {
    var options = {
      template  : '<span class="editor text" contenteditable>text</span>',
      container : container
    };
    super(StringType, options);

    var el = component.el;
    el.style.content = 'type text';
    el.streamEvent('input')
      .mapValue(function(_) return (el.textContent : TypedValue))
      .plug(stream);
  }
}