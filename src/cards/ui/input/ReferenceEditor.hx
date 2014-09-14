package cards.ui.input;

import cards.components.ComponentOptions;
import cards.model.SchemaType;
import js.html.Element;
import js.html.InputElement;
import udom.Dom.Query;
using thx.stream.dom.Dom;

class ReferenceEditor extends Editor {
  public function new(container : Element) {
    var options = {
      template  : '<input class="editor reference" placeholder="type a reference"/>',
      container : container
    };
    super(ReferenceType, options);

    var el : InputElement = cast component.el;
    el.streamEvent('input')
      .mapValue(function(_) return (new TypedValue(ReferenceType, el.value)))
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