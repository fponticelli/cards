package cards.ui.input;

import js.html.Element;
import cards.components.Component;
import cards.model.SchemaType;
using thx.stream.Emitter;

class RuntimeObjectEditor extends ObjectEditor {
  public function new(container : Element, parent : Component, fields : Array<FieldInfo>) {
    super(container, parent, fields);

    var buttonValue     = toolbar.center.addButton(null, Config.icons.value),
        buttonCode      = toolbar.center.addButton(null, Config.icons.code),
        buttonReference = toolbar.center.addButton(null, Config.icons.reference),
        buttons         = [buttonValue, buttonCode, buttonReference];

    function disableAllButtons()
      buttons.map(function(button) button.enabled.set(false));

    currentField
      .either(function(name) {
          disableAllButtons();
          var editor = this.editors.get(name);
          if(null == editor)
            return;
          var toEnable = buttons.copy();
          if(Type.enumEq(editor.type, ReferenceType))
            toEnable.remove(buttonReference);
          else if(Type.enumEq(editor.type, CodeType))
            toEnable.remove(buttonCode);
          else
            toEnable.remove(buttonValue);
          toEnable.map(function(button) button.enabled.set(true));
        }, disableAllButtons);

    function changeEditorType(name : String, newType : SchemaType) {
        removeField(name);
        realizeField(name, newType);
        editors.get(name).focus.set(true);
    }

    currentField
      .filterOption()
      .sampleBy(buttonCode.clicks)
      .left()
      .subscribe(changeEditorType.bind(_, CodeType));

    currentField
      .filterOption()
      .sampleBy(buttonReference.clicks)
      .left()
      .subscribe(changeEditorType.bind(_, ReferenceType));

    currentField
      .filterOption()
      .sampleBy(buttonValue.clicks)
      .left()
      .subscribe(changeEditorType.bind(_, null));
  }
}