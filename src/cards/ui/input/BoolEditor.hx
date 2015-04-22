package cards.ui.input;

import cards.components.ComponentOptions;
import cards.model.SchemaType;
import js.html.DOMElement as Element;
import js.html.InputElement;
import udom.Dom.Query;
using thx.stream.dom.Dom;
import cards.components.Component;

class BoolEditor extends Editor {
  public function new(container : Element,parent : Component) {
    var options = {
      template  : '<input class="editor bool" placeholder="on/off" type="checkbox" />',
      container : container,
      parent : parent
    };
    super(BoolType, options);

    var el : InputElement = cast component.el;
    el.streamEvent('change')
      .map(function(_) return (el.checked : TypedValue))
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