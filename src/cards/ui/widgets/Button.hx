package cards.ui.widgets;

import js.html.MouseEvent;
import thx.stream.Emitter;
import thx.stream.Value;
import cards.components.Component;
using thx.stream.dom.Dom;

class Button {
  public var component(default, null) : Component;
  public var clicks(default, null) : Emitter<MouseEvent>;
  public var enabled(default, null) : Value<Bool>;
  var cancel : Void -> Void;
  public function new(text = '', ?icon : String) {
    component = new Component({
      template : null == icon
        ? '<button>$text</button>'
        : '<button class="fa fa-$icon">$text</button>'
    });
    clicks = component.el.streamClick();

    enabled = new Value(true);
    enabled.subscribe(
      component.el.subscribeToggleAttribute("disabled", "disabled")
    );
  }

  public function destroy() {
    cancel();
    component.destroy();
  }
}