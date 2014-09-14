package cards.ui.input;

import cards.components.ComponentOptions;
import cards.model.SchemaType;
import js.html.Element;
import js.html.InputElement;
import udom.Dom.Query;
using thx.stream.dom.Dom;
import thx.date.ISO8601;

class DateEditor extends Editor {
  var format : String;
  public function new(container : Element, useTime = true) {
    format = useTime ? '%Y-%m-%dT%H:%M' : '%Y-%m-%d';
    var options = {
      template  : '<input class="editor date" placeholder="type date" type="${useTime?"datetime-local":"date"}" />',
      container : container
    };
    super(DateType, options);

    var el : InputElement = cast component.el;
    el.streamEvent('input')
      .mapValue(function(_) return try (ISO8601.parseDateTime(el.value) : TypedValue) catch(e : Dynamic) null)
      .withValue()
      .filterValue(function(v) return Math.isNaN(v.asValue().getTime()))
      .plug(stream);
    el.streamFocus().feed(focus);

    stream.subscribe(function(num) {
      var v = num.asValue(),
          s = DateTools.format(v, format);
      if(el.value != s)
        el.value = s;
    });

    focus.subscribe(el.subscribeFocus());
  }
}