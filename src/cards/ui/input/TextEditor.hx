package cards.ui.input;

import cards.components.ComponentOptions;
import cards.model.SchemaType;
import js.html.DOMElement as Element;
import js.html.TextAreaElement;
import udom.Dom.Query;
using thx.stream.dom.Dom;
import cards.components.Component;

class TextEditor extends Editor {
  function resize() {
    var el = component.el;
    el.style.height = "5px";
    el.style.height = (1+el.scrollHeight) + "px";
  }

  public function new(container : Element, parent : Component) {
    var options = {
      template  : '<textarea class="editor text" placeholder="text"></textarea>',
      container : container,
      parent : parent
    };
    super(StringType, options);

    var el : TextAreaElement = cast component.el;
    el.streamEvent('input')
      .audit(function(_) resize())
      .map(function(_) return (el.value : TypedValue))
      .plug(stream);
    el.streamFocus().feed(focus);

    stream.subscribe(function(text) {
      var v = text.asValue();
      if(el.value != v)
        el.value = v;
    });

    focus.subscribe(el.subscribeFocus());
  }
}