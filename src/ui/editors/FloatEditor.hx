package ui.editors;

using steamer.Producer;
import js.html.KeyboardEvent;
import sui.components.Component;
import sui.components.ComponentOptions;
import steamer.Value;
import sui.properties.Text;
import ui.SchemaType;
using steamer.dom.Dom;

class FloatEditor implements Editor<Float> {
  public var component(default, null) : Component;
  public var focus(default, null) : Value<Bool>;
  public var value(default, null) : Value<Float>;
  public var type(default, null) : SchemaType;
  var cancel : Void -> Void;
  public function new(options : FloatEditorOptions) {
    type = BoolType;
    if(null == options.defaultValue)
      options.defaultValue = 0.0;
    if(null == options.template)
      options.template = '<input type="number"/>';

    component = new Component(options);

    var cls = component.el.classList;
    cls.add('editor');
    cls.add('float');
    component.el.setAttribute('tabindex', '0');

    value = new Value(options.defaultValue);
    var inputPair    = component.el.produceEvent('input'),
      focusPair    = component.el.produceEvent('focus'),
      blurPair     = component.el.produceEvent('blur');

    focus = new Value(false);
    focus.filterValue(true).feed(component.el.consumeFocus());
    focusPair.producer
      .map(function(_) return true)
      .merge(
        blurPair.producer
          .map(function(_) return false)
      ).feed(focus);

    inputPair.producer
      .map(function(_) {
        return (cast component.el : js.html.InputElement).valueAsNumber;
      })
      .feed(value);
    cancel = function() {
      inputPair.cancel();
      focusPair.cancel();
      blurPair.cancel();
    };
  }

  public function destroy() {
    cancel();
    component.destroy();
    value.end();
  }
}

typedef FloatEditorOptions = {> ComponentOptions,
  defaultValue : Float
}