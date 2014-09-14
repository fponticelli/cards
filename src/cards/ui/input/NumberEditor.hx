package cards.ui.input;

import cards.components.ComponentOptions;
import cards.model.SchemaType;
import js.html.Element;
import js.html.InputElement;
import udom.Dom.Query;
using thx.stream.dom.Dom;

class NumberEditor extends Editor {
  public function new(container : Element) {
    var options = {
      template  : '<input class="editor number" placeholder="type number" type="number" />',
      container : container
    };
    super(FloatType, options);

    var el : InputElement = cast component.el;
    el.streamEvent('input')
      .mapValue(function(_) return (el.valueAsNumber : TypedValue))
      .plug(stream);
    el.streamFocus().feed(focus);

    stream.subscribe(function(num) {
      var v = num.asValue();
      if(el.value != v)
        el.value = v;
    });

    focus.subscribe(el.subscribeFocus());
  }
}