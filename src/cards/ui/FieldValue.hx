package cards.ui;

import js.html.Element;
import cards.components.Component;
import cards.model.SchemaType;
import thx.Assert;
import cards.ui.editors.EditorPicker;
import cards.ui.editors.Editor;
import udom.Dom;
import cards.types.TypeTransform;

class FieldValue {
  public var type(default, null) : SchemaType;
  public var editor(default, null) : Null<Editor<Dynamic>>;
  var parent : Component;
  var container : Element;
  var afterCreate : InitFunction;
  var afterRemove : InitFunction;
  public function new(parent : Component, container : Element, afterCreate : InitFunction, afterRemove : InitFunction) {
    this.parent = parent;
    this.container = container;
    this.afterCreate = afterCreate;
    this.afterRemove = afterRemove;
  }

  public function setEditor(type, ?value : Dynamic) {
    if(null != editor) {
      if(null == value) {
        value = TypeTransform.transform(this.type, type)(editor.value.get());
      }
      afterRemove(this.type, editor);
      container.innerHTML = '';
    }
    this.type = type;
    editor = EditorPicker.pick(type, container, parent, value);
    editor.component.el.classList.add('value');
    afterCreate(this.type, editor);
  }
}

typedef InitFunction = SchemaType -> Editor<Dynamic> -> Void;