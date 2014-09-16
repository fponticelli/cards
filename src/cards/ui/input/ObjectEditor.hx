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

class ObjectEditor extends RouteEditor {
  var fields : Array<FieldInfo>;
  var object : {};
  var fieldMap : Map<String, IEditor>;
  var defMap : Map<String, { field : FieldInfo, index : Int }>;
  var table : TableElement;
  var currentField : Value<Option<String>>;
  var menuAdd : Menu;
  var buttonAdd : Button;
  public function new(container : Element, parent : Component, fields : Array<FieldInfo>) {
    this.object = {};
    fieldMap = new Map();
    defMap = new Map();
    currentField = Value.createOption();
    var options = {
      template  : '<div class="editor table"></div>',
      container : container,
      parent : parent
    };
    super(ObjectType([]), options);
    this.fields = [];

    var toolbar = new Toolbar({
      parent : component,
      container : component.el
    });

    buttonAdd = toolbar.left.addButton('', Config.icons.addMenu);
    var buttonRemove = toolbar.right.addButton('', Config.icons.remove);

    buttonAdd.enabled.set(false);
    buttonRemove.enabled.set(false);

    table = Browser.document.createTableElement();
    component.el.appendChild(table);

    diff.subscribe(function(d) {
      trace("TODO " + d);
    });

    fields.mapi(function(field, i) {
      defMap.set(field.name, { field : field, index : i });
      addFieldDefinition(field);
    });

    currentField
      .mapValue(function(cur) return switch cur {
        case None: false;
        case Some(name): defMap.get(name).field.optional;
      })
      .feed(buttonRemove.enabled);

    currentField
      .toBool()
      .feed(focus);

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

    setAddState();
  }

  public function addFieldDefinition(field : FieldInfo) {
    checkUnique(field.name);
    fields.push(field);
    this.type = ObjectType(fields);
    if(!field.optional)
      realizeField(field.name);
  }

  public function realizeField(name : String) {
    if(fieldMap.exists(name))
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
    fieldMap.set(name, editor);

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
    var editor = fieldMap.get(name),
        def    = defMap.get(name);
    editor.dispose();
    fieldMap.remove(name);
    var rows = Query.all('tr[data-index="${def.index}"]', table).childrenOf(table);
    rows.map(function(row) {
      table.removeChild(row);
    });
    setAddState();
  }

  function setAddState() {
    var fields = this.fields.copy().filter(function(field) {
      return !fieldMap.exists(field.name);
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

  function checkUnique(name : String)
    for(field in fields)
      if(name == field.name)
        throw '$name field already exists in this ObjectType';
}