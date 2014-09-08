package cards.ui.editors;

using thx.stream.Emitter;
import js.html.KeyboardEvent;
import cards.components.Component;
import cards.components.ComponentOptions;
import thx.stream.Value;
import cards.properties.Text;
import cards.model.SchemaType;
using thx.stream.dom.Dom;

class BoolEditor implements Editor<Bool> {
  public var component(default, null) : Component;
  public var focus(default, null) : Value<Bool>;
  public var value(default, null) : Value<Bool>;
  public var type(default, null) : SchemaType;
  var cancel : Void -> Void;
  public function new(options : BoolEditorOptions) {
    type = BoolType;
    if(null == options.defaultValue)
      options.defaultValue = false;
    if(null == options.el && null == options.template)
      options.template = '<div></div>';
    component = new Component(options);
    var cls = component.el.classList;
    cls.add('fa');
    cls.add('editor');
    cls.add('bool');
    cls.add('fa-' + Config.icons.unchecked);
    component.el.setAttribute('tabindex', '1');

    value = new Value(options.defaultValue);

    value
      .subscribe(component.el.subscribeToggleClass('fa-' + Config.icons.checked));
    value
      .negate()
      .subscribe(component.el.subscribeToggleClass('fa-' + Config.icons.unchecked));

    var clickStream = component.el.streamClick()
      .toNil()
      .merge(
        component.el.streamKey('up')
          .filterValue(function(e : KeyboardEvent) {
            return switch e.keyCode {
              case 32, 13: // spacebar, return
                true;
              case _:
                false;
            };
          })
          .toNil()
      )
      .mapValue(function(_) return !value.get())
      .feed(value);

    focus = new Value(false);
    focus.withValue(true).subscribe(component.el.subscribeFocus());
    var focusStream = component.el.streamEvent('focus')
      .toTrue()
      .merge(
        component.el.streamEvent('blur').toFalse()
      ).feed(focus);
    cancel = function() {
      clickStream.cancel();
      focusStream.cancel();
    };
  }

  public function destroy() {
    cancel();
    component.destroy();
    value.clear();
  }
}

typedef BoolEditorOptions = {> ComponentOptions,
  defaultValue : Bool
}