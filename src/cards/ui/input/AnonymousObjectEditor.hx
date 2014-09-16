package cards.ui.input;

import cards.ui.widgets.Button;
import cards.ui.widgets.Menu;
import haxe.ds.Option;
import cards.ui.widgets.Toolbar;
import cards.model.SchemaType;
import js.Browser;
import js.html.Element;
import js.html.TableCellElement;
import js.html.TableElement;
using thx.core.Arrays;
using thx.core.Options;
using thx.stream.Emitter;
using udom.Dom;
import thx.stream.Value;
import cards.components.Component;

class AnonymousObjectEditor extends BaseObjectEditor {
  public function new(container : Element, parent : Component) {
    super(container, parent, []);

    var buttonAdd = toolbar.left.addButton('', Config.icons.add);

    buttonAdd.clicks
      .subscribe(function(_) {
        realizeField(guessFieldName());
      });
  }

  override public function realizeField(name : String) {
    addFieldDefinition({ name : name, type : StringType, optional : true });
    super.realizeField(name);
  }

  override public function removeField(name : String) {
    super.removeField(name);
    fields = fields.filter(function(field) return field.name != name);
    this.type = ObjectType(fields);
    defMap.remove(name);
  }

  public function guessFieldName() {
    var id = 0,
        prefix = 'field',
        t;
    function assemble(id)
      return id > 0 ? [prefix, '$id'].join('_') : prefix;
    while(editors.exists(t = assemble(id))) id++;
    return t;
  }
}