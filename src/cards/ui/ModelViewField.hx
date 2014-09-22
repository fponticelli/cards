package cards.ui;

import thx.stream.Bus;
import thx.stream.Emitter;
import thx.stream.Value;
import udom.Dom;
import cards.components.Component;
import cards.components.ComponentOptions;
import cards.properties.ToggleClass;
import cards.ui.editors.Editor;
import cards.ui.editors.TextEditor;
import cards.types.TypeTransform;
import cards.ui.editors.EditorPicker;
import cards.model.SchemaType;

class ModelViewField {
  public var component(default, null) : Component;
  public var key(default, null) : TextEditor;
  public var editor(default, null) : Editor<Dynamic>;
  public var value(default, null) : Value<Dynamic>;
  public var type(default, null) : SchemaType;
  public var focus(default, null) : Emitter<Bool>;
  var focusBus : Bus<Bool>;

  var classActive : ToggleClass;

  public function new(options : FieldEditableKeyOptions) {
    if(null == options.template && null == options.el)
      options.template = '<div class="field"><div class="key-container"><div class="key"></div></div><div class="value-container"></div></div>';

    component = new Component(options);
    // setup field key
    key = new TextEditor({
      el : Query.first('.key', component.el),
      parent : component,
      defaultText : options.key,
      placeHolder : 'key'
    });

    // setup field value
    // TODO: support multiple editors data types
    /*
    value = new TextEditor({
      //el : Query.first('.value', component.el),
      container : Query.first('.value-container', component.el),
      parent : component,
      defaultText : '',
      placeHolder : 'value'
    });
    // 250 is kind of a magic value and it is enough
    // to be able to click on a button
    // and not have lost focus in the meanwhile
    var f = key.focus.merge(value.focus);
    focus = f.debounce(250).distinct();
    f.feed(classActive.stream);
    */
    value = new Value(null);
    focusBus = new Bus();
    focus = focusBus.debounce(250).distinct();
    key.focus.plug(focusBus);
    classActive = new ToggleClass(component, 'active');
    focus.feed(classActive.stream);
    setEditor(StringType);
  }

  public function setEditor(type) {
    var container = Query.first('.value-container', component.el);
    container.innerHTML = "";
    var v = null;
    if(null != editor) {
      v = TypeTransform.transform(editor.type, type)(editor.value.get());
      editor.value.clear();
      // TODO: add proper editor destroy?
    }
    this.type = type;
    editor = EditorPicker.pick(type, container, component, v);
    editor.component.el.classList.add('value');
    editor.focus.plug(focusBus);
    editor.value.feed(value);
    //var f = key.focus.merge(value.focus);
    //f.debounce(250).distinct().plug(focus);
    //classActive = new ToggleClass(component, 'active');
  }

  public function destroy() {
    classActive.dispose();
    component.destroy();
    value.clear();
    key = null;
    value = null;
    focus = null;
  }
}

typedef FieldEditableKeyOptions = {>ComponentOptions,
  key : String
}