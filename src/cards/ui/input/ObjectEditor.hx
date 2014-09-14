package cards.ui.input;

import cards.ui.widgets.Toolbar;
import cards.model.SchemaType;
import js.Browser;
import js.html.Element;
import js.html.TableCellElement;
import js.html.TableElement;
using thx.core.Arrays;

class ObjectEditor extends RouteEditor {
  var fields : Array<FieldInfo>;
  var object : {};
  var fieldMap : Map<String, Dynamic>;
  var table : TableElement;
  public function new(container : Element, fields : Array<FieldInfo>) {
    this.object = {};
    fieldMap = new Map();
    var options = {
      template  : '<div class="editor table"></div>',
      container : container
    };
    super(ObjectType([]), options);
    this.fields = [];

    var toolbar = new Toolbar({
      parent : component,
      container : component.el
    });

    var buttonAdd = toolbar.left.addButton('', Config.icons.addMenu),
        buttonRemove = toolbar.right.addButton('', Config.icons.remove);

    buttonAdd.enabled.set(false);
    buttonRemove.enabled.set(false);

    table = Browser.document.createTableElement();
    component.el.appendChild(table);

    diff.subscribe(function(d) {
      trace("TODO " + d);
    });

    for(field in fields) {
      addFieldDefinition(field);
    }
  }

  public function addFieldDefinition(field : FieldInfo) {
    checkUnique(field.name);
    fields.push(field);
    this.type = ObjectType(fields);
    if(!field.optional)
      realizeField(field.name);
  }

  public function realizeField(name : String) {
    var def = fields.first(function(field) return field.name == name);
    if(null == def) throw 'unable to realize $name because it is not defined in ObjectType';

    switch def.type {
      case ObjectType(_), ArrayType(_):
        var rowh = Browser.document.createTableRowElement(),
            rowd = Browser.document.createTableRowElement(),
            th : TableCellElement = cast Browser.document.createElement('th'),
            td : TableCellElement = cast Browser.document.createElement('td');
        th.colSpan = 2;
        th.textContent = name;
        th.className = "composite";
        td.colSpan = 2;
        td.className = "composite";
        var editor = EditorFactory.create(def.type, td, component);
        rowh.appendChild(th);
        rowd.appendChild(td);
        table.appendChild(rowh);
        table.appendChild(rowd);
      case _:
        var row = Browser.document.createTableRowElement(),
            th  = Browser.document.createElement('th'),
            td  = Browser.document.createElement('td');
        th.textContent = name;
        th.className = "primitive";
        td.className = "primitive";
        var editor = EditorFactory.create(def.type, td, component);
        row.appendChild(th);
        row.appendChild(td);
        table.appendChild(row);
    }
  }

  function checkUnique(name : String)
    for(field in fields)
      if(name == field.name)
        throw '$name field already exists in this ObjectType';
}