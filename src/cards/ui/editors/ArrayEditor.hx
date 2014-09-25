package cards.ui.editors;

using thx.stream.Emitter;
import cards.components.Component;
import cards.components.ComponentOptions;
import thx.stream.Value;
import cards.model.SchemaType;
using thx.stream.dom.Dom;

class ArrayEditor implements Editor<Array<Dynamic>> {
  public var component(default, null) : Component;
  public var focus(default, null) : Value<Bool>;
  public var value(default, null) : Value<Array<Dynamic>>;
  public var type(default, null) : SchemaType;
  public var innerType(default, null) : SchemaType;
  var cancel : Void -> Void;
  var items : Array<{ item : Component, editor : Editor<Dynamic> }>;
  public function new(options : ArrayEditorOptions) {
    type = ArrayType(this.innerType = options.innerType);
    if(null == options.defaultValue)
      options.defaultValue = [];
    if(null == options.template)
      options.template = '<ul type="array"></ul>';

    component = new Component(options);

    var cls = component.el.classList;
    cls.add('editor');
    cls.add('array');
    component.el.setAttribute('tabindex', '1');

    value = new Value(options.defaultValue);

    focus = new Value(false);
    focus.withValue(true).subscribe(component.el.subscribeFocus());
    var focusStream = component.el.streamFocus().feed(focus);

//    component.el.streamEvent('input')
//      .mapValue(function(_) return (cast component.el : js.html.InputElement).valueAsNumber)
//      .feed(value);
    cancel = function() {
      focusStream.cancel();
    };

    items = [];
    addItem();
    addItem();
    addItem();
  }

  public function addItem(?value : Dynamic) {
    var index = items.length,
        item = new Component({
        template : '<li></li>',
        parent : component,
        container : component.el
      }),
      editor = EditorPicker.pick(innerType, item.el, item, value);

    editor.value
      .map(function(v) {
        var arr = this.value.get().copy();
        arr[index] = v;
        return arr;
      })
      .feed(this.value);

    items.push({
      item : item,
      editor : editor
    });
  }

  public function destroy() {
    cancel();
    component.destroy();
    value.clear();
  }
}

typedef ArrayEditorOptions = {> ComponentOptions,
  defaultValue : Array<Dynamic>,
  innerType : SchemaType
}