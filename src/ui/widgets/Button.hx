package ui.widgets;

import js.html.Event;
import thx.stream.Emitter;
import thx.stream.Value;
import sui.components.Component;
using thx.stream.dom.Dom;

class Button {
  public var component(default, null) : Component;
  public var clicks(default, null) : Producer<Event>;
  public var enabled(default, null) : Value<Bool>;
  var cancel : Void -> Void;
  public function new(text = '', ?icon : String) {
    component = new Component({
      template : null == icon
        ? '<button>$text</button>'
        : '<button class="fa fa-$icon">$text</button>'
    });
    var pair = component.el.produceEvent('click');
    clicks = pair.producer;
    cancel = pair.cancel;

    enabled = new Value(true);
    enabled.feed(function(value : Bool) {
      if(value)
        component.el.removeAttribute("disabled");
      else
        component.el.setAttribute("disabled", "disabled");
    });
  }

  public function destroy() {
    cancel();
    component.destroy();
  }
}