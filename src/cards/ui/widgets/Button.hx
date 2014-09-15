package cards.ui.widgets;

import js.html.Audio;
import js.html.MouseEvent;
using thx.stream.Emitter;
import thx.stream.Value;
import cards.components.Component;
using thx.stream.dom.Dom;

class Button {
  public static var sound(default, null) : Audio = (function() {
      var audio = new Audio();
      audio.volume = 0.5;
      audio.src = 'sound/click.mp3';
      return audio;
    })();
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
    clicks = component.el.streamClick()
      .audit(playSound);

    enabled = new Value(true);
    enabled.negate().subscribe(
      component.el.subscribeToggleAttribute("disabled", "disabled")
    );
  }

  function playSound(_) {
    sound.load();
    sound.play();
  }

  public function destroy() {
    cancel();
    component.destroy();
  }
}