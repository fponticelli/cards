package cards.ui.input;

import cards.ui.input.TypedValue;
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
using thx.core.Iterables;
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

  override function createFieldLabel(parent : Component, container : Element, name : String) {
    var editor = new cards.ui.input.FieldNameEditor(container, parent);
    // TODO change model
    editor.stream
      .mapValue(function(v) return v.asValue())
      .debounce(10)
      .window(2, false)
      .subscribe(function(names) switch names{
        case [o, n] if(editors.exists(n)): // rename to existing key
          // put in queue again.
          // debounce() ensure that the original name is preserved
          editor.stream.pulse((guessFieldName(n) : TypedValue));
        case [o, n]: // rename
          // change definition
          var def = defMap.get(o);
          defMap.remove(o);
          def.field.name = n;
          defMap.set(n, def);

          // change editor reference
          editors.remove(o);
          editors.set(n, editor);

          // set type
          type = ObjectType(defMap
            .order(function(a, b) return a.index - b.index)
            .map(function(v) return v.field));
        case _:
          throw 'createFieldLabel should never reach this point';
      });
    editor.stream.pulse((name : TypedValue));
  }

  public function guessFieldName(?prefix = 'field') {
    var id = 0,
        t;
    function assemble(id)
      return id > 0 ? [prefix, '$id'].join('_') : prefix;
    while(editors.exists(t = assemble(id))) id++;
    return t;
  }
}