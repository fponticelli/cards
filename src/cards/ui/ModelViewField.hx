package cards.ui;

import thx.stream.Emitter;
import udom.Dom;
import cards.components.Component;
import cards.components.ComponentOptions;
import cards.properties.ToggleClass;
import cards.ui.editors.TextEditor;

class ModelViewField {
  public var component(default, null) : Component;
  public var key(default, null) : TextEditor;
  public var value(default, null) : TextEditor;
  public var focus(default, null) : Emitter<Bool>;

  var classActive : ToggleClass;

  public function new(options : FieldEditableKeyOptions) {
    if(null == options.template && null == options.el)
      options.template = '<div class="field"><div class="key-container"><div class="key"></div></div><div class="value-container"><div class="value"></div></div></div>';

    component = new Component(options);
    // setup field key
    key = new TextEditor({
      el : Query.first('.key', component.el),
      parent : component,
      defaultText : options.key,
      placeHolder : 'key'
    });

    // setup field value
    // TODO support multiple editors data types
    value = new TextEditor({
      el : Query.first('.value', component.el),
      parent : component,
      defaultText : '',
      placeHolder : 'value'
    });
    // 250 is kind of a magic value and it is enough
    // to be able to click on a button
    // and not have lost focus in the meanwhile
    var f = key.focus.merge(value.focus);
    focus = f.debounce(250).distinct();
    classActive = new ToggleClass(component, 'active');
    f.feed(classActive.stream);
  }

  public function destroy() {
    classActive.dispose();
    component.destroy();
    key = null;
    value = null;
    focus = null;
  }
}

typedef FieldEditableKeyOptions = {>ComponentOptions,
  key : String
}