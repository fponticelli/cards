package cards.ui.editors;

using thx.stream.Emitter;
import js.html.KeyboardEvent;
import cards.components.Component;
import cards.components.ComponentOptions;
import thx.stream.Value;
import cards.properties.Text;
import cards.model.SchemaType;
using thx.stream.dom.Dom;

class DateEditor implements Editor<Date> {
  public var component(default, null) : Component;
  public var focus(default, null) : Value<Bool>;
  public var value(default, null) : Value<Date>;
  public var type(default, null) : SchemaType;
  var cancel : Void -> Void;
  public function new(options : DateEditorOptions) {
    type = BoolType;
    if(null == options.defaultValue)
      options.defaultValue = Date.now();
    if(null == options.template)
      options.template = '<input type="date"/>';

    component = new Component(options);

    var cls = component.el.classList;
    cls.add('editor');
    cls.add('date');
    component.el.setAttribute('tabindex', '1');

    value = new Value(options.defaultValue);

    focus = new Value(false);
    focus.withValue(true).subscribe(component.el.subscribeFocus());
    var focusStream = component.el.streamFocus().feed(focus);

    var input = (cast component.el : js.html.InputElement);

    input.streamInput()
      .mapValue(function(_) {
        return input.valueAsDate;
      })
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

typedef DateEditorOptions = {> ComponentOptions,
  defaultValue : Date
}