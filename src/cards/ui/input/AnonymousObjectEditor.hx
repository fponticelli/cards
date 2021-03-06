package cards.ui.input;

import cards.ui.input.TypedValue;
import cards.ui.widgets.Button;
import cards.ui.widgets.Menu;
import haxe.ds.Option;
import cards.ui.widgets.Toolbar;
import cards.model.SchemaType;
import js.Browser;
import js.html.DOMElement as Element;
import js.html.TableCellElement;
import js.html.TableElement;
using thx.Arrays;
using thx.Iterables;
using thx.Options;
using thx.stream.Emitter;
using udom.Dom;
import thx.stream.Value;
import cards.components.Component;

class AnonymousObjectEditor extends BaseObjectEditor {
  public static var defaultTypes(default, null) : Array<{ type : SchemaType, description : String }> = (function() {
      var types = [
          { type : StringType,     description : "text" },
          { type : FloatType,      description : "number" },
          { type : DateType,       description : "date" },
          { type : CodeType,       description : "code" },
          { type : BoolType,       description : "yes/no" },
          { type : ObjectType([]), description : "object" }
        ];
      types = types
        .concat(types.map(function(o) return {
          type : ArrayType(o.type),
          description : 'list of ${o.description}'
        }))
        //.concat(types.map(function(o) return {
        //  type : ArrayType(ArrayType(o.type)),
        //  description : 'list of list of ${o.description}'
        //}))
        ;
      return types;
    })();
  var menuAdd : Menu;
  var allowedTypes : Array<{ type : SchemaType, description : String }>;
  public function new(container : Element, parent : Component, ?allowedTypes : Array<{ type : SchemaType, description : String }>) {
    super(container, parent, []);
    this.allowedTypes = null == allowedTypes ? defaultTypes : allowedTypes;
    menuAdd = new Menu({ parent : component });
    initMenu();

    var buttonAdd = toolbar.left.addButton('', Config.icons.addMenu);

    buttonAdd.clicks
      .subscribe(function(_) {
        menuAdd.anchorTo(buttonAdd.component.el);
        menuAdd.visible.stream.set(true);
      });
  }

  function initMenu()
    allowedTypes.map(function(item) {
      var button = new Button('add <b>${item.description}</b>');
      button.clicks
        .subscribe(function(_) {
          var name = guessFieldName();
          addFieldDefinition({ name : name, type : item.type, optional : true });
          realizeField(name);
          editors.get(name).focus.set(true);
        });
      menuAdd.addItem(button.component);
    });

  override public function removeField(name : String) {
    super.removeField(name);
    fields = fields.filter(function(field) return field.name != name);
    this.type = ObjectType(fields);
    defMap.remove(name);
  }

  override function createFieldLabel(parent : Component, container : Element, name : String) {
    var editor = new cards.ui.input.FieldNameEditor(container, parent);
    // TODO: change model
    editor.stream
      .map(function(v) return v.asValue())
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