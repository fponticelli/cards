package cards.ui.input;

import cards.components.Component;
import cards.model.SchemaType;
import cards.ui.widgets.Toolbar;
import js.Browser;
import js.html.Element;
import js.html.TableCellElement;
import js.html.TableElement;
import haxe.ds.Option;
using thx.core.Arrays;
using thx.core.Options;
using thx.stream.Emitter;
import thx.stream.Value;
using udom.Dom;

class BaseObjectEditor extends RouteEditor {
  var fields : Array<FieldInfo>;
  var object : {};
  var editors : Map<String, IEditor>;
  var defMap : Map<String, { field : FieldInfo, index : Int }>;
  var table : TableElement;
  var currentField : Value<Option<String>>;
  var toolbar : Toolbar;
  public function new(container : Element, parent : Component, fields : Array<FieldInfo>) {
    this.object = {};
    editors = new Map();
    defMap = new Map();
    currentField = Value.createOption();
    var options = {
      template  : '<div class="editor table"></div>',
      container : container,
      parent : parent
    };
    super(ObjectType([]), options);
    this.fields = [];

    toolbar = new Toolbar({
      parent : component,
      container : component.el
    });

    var buttonRemove = toolbar.right.addButton('', Config.icons.remove);
    buttonRemove.enabled.set(false);

    currentField
      .mapValue(function(cur) return switch cur {
        case None: false;
        case Some(name): defMap.get(name).field.optional;
      })
      .feed(buttonRemove.enabled);

    buttonRemove.clicks
      .subscribe(function(_) {
        var name = currentField.get().toValue();
        if(null == name)
          return;
        removeField(name);
      });

    table = Browser.document.createTableElement();
    component.el.appendChild(table);

    diff.subscribe(function(d) {
      switch [d.path.asArray(), d.diff] {
        case [[Field(name)], Remove]:
          if(editors.exists(name))
            removeField(name);
        case [[Field(name)], Add]:
          ensureField(name);
        case [[Field(name)], Set(tv)] if(Type.enumEq(tv.asType(), defMap.get(name).field.type)):
          ensureField(name).stream.pulse(tv);
        case [path, diff] if(path.length > 0):
          var first = path.shift();
          switch first {
            case Field(name) if(switch defMap.get(name).field.type {
                case ObjectType(_), ArrayType(_): true;
                case _: false;
              }):
              (cast ensureField(name) : IRouteEditor)
                .diff.pulse(new DiffAt(path, diff));
            case _:
              throw 'unable to forward $d within ObjectEditor';
          }
        case [[], Set(tv)] if(Type.enumEq(type, tv.asType())):
          // TODO set value?
        case _:
          trace(d.path.toString());
          trace(switch d.diff {
            case Set(d): Std.string(d);
            case _: Std.string(d.diff);
          });
          throw 'unable to assign $d within ObjectEditor';
      }
      pulse();
    });

    fields.mapi(function(field, i) {
      addFieldDefinition(field, i);
    });

    currentField
      .toBool()
      .feed(focus);
  }

  function ensureField(name : String) {
    if(!editors.exists(name))
      realizeField(name);
    return editors.get(name);
  }

  public function addFieldDefinition(field : FieldInfo, ?index : Int) {
    checkUnique(field.name);
    if(null == index)
      index = fields.length;
    defMap.set(field.name, { field : field, index : index });
    fields.push(field);
    this.type = ObjectType(fields);
    if(!field.optional)
      realizeField(field.name);
  }

  public function realizeField(name : String) {
    if(editors.exists(name))
      throw 'field $name already realized';
    var def = fields.first(function(field) return field.name == name);
    if(null == def) throw 'unable to realize $name because it is not defined in ObjectType';

    var editor = switch def.type {
      case ObjectType(_), ArrayType(_):
        var rowh = Browser.document.createTableRowElement(),
            rowd = Browser.document.createTableRowElement(),
            th : TableCellElement = cast Browser.document.createElement('th'),
            td : TableCellElement = cast Browser.document.createElement('td');
        var index = defMap.get(name).index;
        rowh.setAttribute('data-index', cast index);
        rowd.setAttribute('data-index', cast index);
        th.colSpan = 2;
        th.textContent = name;
        th.className = "composite";
        td.colSpan = 2;
        td.className = "composite";
        var editor = EditorFactory.create(def.type, td, component);
        rowh.appendChild(th);
        rowd.appendChild(td);
        var ref = findRef(table, index);
        if(null != ref) {
          table.insertBefore(rowd, ref);
        } else {
          table.appendChild(rowd);
        }
        table.insertBefore(rowh, rowd);
        editor;
      case _:
        var row = Browser.document.createTableRowElement(),
            th  = Browser.document.createElement('th'),
            td  = Browser.document.createElement('td');
        var index = defMap.get(name).index;
        row.setAttribute('data-index', cast index);
        th.textContent = name;
        th.className = "primitive";
        td.className = "primitive";
        var editor = EditorFactory.create(def.type, td, component);
        row.appendChild(th);
        row.appendChild(td);
        var ref = findRef(table, index);
        if(null != ref) {
          table.insertBefore(row, ref);
        } else {
          table.appendChild(row);
        }
        editor;
    }
    editors.set(name, editor);

    editor.focus
      .withValue(true)
      .mapValue(function(_) return name)
      .toOption()
      .feed(currentField);

    editor.focus.set(true);
  }

  static function findRef(table : TableElement, index : Int) {
    var trs = Query.all('tr', table).childrenOf(table);
    for(tr in trs) {
      var ref : Int = cast tr.getAttribute("data-index");
      if(ref > index)
        return tr;
    }
    return null;
  }

  public function removeField(name : String) {
    var editor = editors.get(name),
        def    = defMap.get(name);
    editor.dispose();
    editors.remove(name);
    var rows = Query.all('tr[data-index="${def.index}"]', table).childrenOf(table);
    rows.map(function(row) {
      table.removeChild(row);
    });
    currentField.set(None);
  }

  function checkUnique(name : String)
    for(field in fields)
      if(name == field.name)
        throw '$name field already exists in this ObjectType';

  // TODO pulse passes original object and bad things can happen if it is modified elsewhere
  function pulse()
    stream.pulse(new TypedValue(type, object));
}