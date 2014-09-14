package cards.ui.input;

import cards.components.ComponentOptions;
import cards.model.SchemaType;
import js.html.Element;
import js.html.InputElement;
import udom.Dom.Query;
using thx.stream.dom.Dom;

class InputBasedEditor extends Editor {
  public function new(container : Element, valueType : SchemaType, name : String, ?type : String, ?event : String = 'change', ?extract : InputElement -> TypedValue, ?assign : InputElement -> TypedValue -> Void) {
    if(null == type)
      type = name;
    if(null == extract)
      extract = function(input) return (input.value : TypedValue);
    if(null == assign)
      assign = function(input, value) input.value = value.asValue();
    var options = {
      template  : '<input class="editor $name" placeholder="select $name" type="$type" />',
      container : container
    };
    super(valueType, options);

    var el : InputElement = cast component.el;
    el.streamEvent(event)
      .mapValue(function(_) return extract(el))
      .plug(stream);
    el.streamFocus().feed(focus);

    stream.subscribe(function(value) {
      var v = value.asValue();
      if(extract(el) != v)
        assign(el, value);
    });

    focus.subscribe(el.subscribeFocus());
  }
}