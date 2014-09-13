package cards.ui.input;

import cards.components.ComponentOptions;
import cards.model.SchemaType;
import js.html.Element;
import js.html.TextAreaElement;
import udom.Dom.Query;
using thx.stream.dom.Dom;

// TODO focus
class TextEditor extends Editor {
  function resize() {
    var el = component.el;
    el.style.height = "5px";
    el.style.height = (1+el.scrollHeight) + "px";
  }

  public function new(container : Element) {
    var options = {
      template  : '<textarea class="editor text" placeholder="type text"></textarea>',
      container : container
    };
    super(StringType, options);

    var el : TextAreaElement = cast component.el;
    el.style.content = 'type text';
    el.streamEvent('input')
      .audit(function(_) resize())
      .mapValue(function(_) return (el.value : TypedValue))
      .plug(stream);
    el.streamFocus().feed(focus);

    // TODO, this considerably slow downs the creation of many items (like in array)
    //resize();
  }
}