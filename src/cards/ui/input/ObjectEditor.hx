package cards.ui.input;

import cards.components.Component;
import cards.model.SchemaType;
import cards.ui.widgets.Button;
import cards.ui.widgets.Menu;
import js.html.Element;
using thx.core.Options;

class ObjectEditor extends BaseObjectEditor {
  var menuAdd : Menu;
  var buttonAdd : Button;
  var inited = false;
  public function new(container : Element, parent : Component, fields : Array<FieldInfo>) {
    super(container, parent, fields);

    buttonAdd = toolbar.left.addButton('', Config.icons.addMenu);
    var buttonRemove = toolbar.right.addButton('', Config.icons.remove);

    buttonAdd.enabled.set(false);
    buttonRemove.enabled.set(false);

    currentField
      .mapValue(function(cur) return switch cur {
        case None: false;
        case Some(name): defMap.get(name).field.optional;
      })
      .feed(buttonRemove.enabled);

    buttonAdd.clicks
      .subscribe(function(_) {
        menuAdd.anchorTo(buttonAdd.component.el);
        menuAdd.visible.stream.set(true);
      });

    buttonRemove.clicks
      .subscribe(function(_) {
        var name = currentField.get().toValue();
        if(null == name)
          return;
        removeField(name);
      });

    menuAdd = new Menu({});
    inited = true;
    setAddState();
  }

  override public function removeField(name : String) {
    super.removeField(name);
    setAddState();
  }

  override public function realizeField(name : String) {
    super.realizeField(name);
    setAddState();
  }

  function setAddState() {
    if(!inited) return;
    var fields = this.fields.copy().filter(function(field) {
      return !editors.exists(field.name);
    });
    var enabled = fields.length > 0;
    buttonAdd.enabled.set(enabled);
    if(enabled) {
      menuAdd.clear();
      fields.map(function(field) {
        var button = new Button('add <b>${field.name}</b>');
        button.clicks
          .subscribe(function(_) {
            realizeField(field.name);
            setAddState();
          });
        menuAdd.addItem(button.component);
      });
    }
  }
}