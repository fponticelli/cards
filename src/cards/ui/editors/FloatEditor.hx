package cards.ui.editors;

using thx.stream.Emitter;
import js.html.KeyboardEvent;
import cards.components.Component;
import cards.components.ComponentOptions;
import thx.stream.Value;
import cards.properties.Text;
import cards.model.SchemaType;
using thx.stream.dom.Dom;

class FloatEditor implements Editor<Float> {
  public var component(default, null) : Component;
  public var focus(default, null) : Value<Bool>;
  public var value(default, null) : Value<Float>;
  public var type(default, null) : SchemaType;
  var cancel : Void -> Void;
  public function new(options : FloatEditorOptions) {
    type = FloatType;
    if(null == options.defaultValue)
      options.defaultValue = 0.0;
    if(null == options.template)
      options.template = '<input type="number"/>';

    component = new Component(options);

    var cls = component.el.classList;
    cls.add('editor');
    cls.add('float');
    component.el.setAttribute('tabindex', '1');

    value = new Value(options.defaultValue);

    focus = new Value(false);
    focus.withValue(true).subscribe(component.el.subscribeFocus());
    var focusStream = component.el.streamFocus().feed(focus);

    component.el.streamEvent('input')
      .mapValue(function(_) return (cast component.el : js.html.InputElement).valueAsNumber)
      .feed(value);
    cancel = function() {
      focusStream.cancel();
    };
  }

  public function destroy() {
    cancel();
    component.destroy();
    value.clear();
  }
}

typedef FloatEditorOptions = {> ComponentOptions,
  defaultValue : Float
}