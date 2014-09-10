package cards.ui;

import cards.types.TypeTransform;
import js.html.Element;
using thx.stream.Emitter;
import cards.components.Component;
import thx.Assert;
import cards.model.DataEvent;
import cards.model.SchemaEvent;
import cards.model.SchemaType;
import cards.ui.widgets.Toolbar;
import udom.Dom;
import thx.stream.Bus;

class ModelView {
  public static var typeDefinitions = [
    { type : StringType, icon : Config.icons.text },
    { type : BoolType,   icon : Config.icons.bool },
    { type : FloatType,  icon : Config.icons.number },
    { type : DateType,   icon : Config.icons.date },
    { type : ArrayType(StringType),  icon : Config.icons.array },
  ];

  public var component(default, null) : Component;
  public var schema(default, null) : Emitter<SchemaEvent>;
  public var data(default, null) : Emitter<DataEvent>;
  public var toolbar(default, null) : Toolbar;
  public var currentField(default, null) : Null<ModelViewField>;

  var pairs : Element;

  var schemaBus : Bus<SchemaEvent>;
  var dataBus : Bus<DataEvent>;
  var fields : Map<String, ModelViewField>;
  var fieldFocus : Bus<ModelViewField>;
  var fieldBlur : Bus<ModelViewField>;

  public function new() {
    component = new Component({
      template : '<div class="modelview"></div>'
    });
    toolbar = new Toolbar({});
    toolbar.component.appendTo(component.el);

    var buttonAdd = toolbar.left.addButton('', Config.icons.add);
    buttonAdd.clicks.subscribe(function(_){
      addField(guessFieldName(), StringType);
    });


    var buttonRemove = toolbar.right.addButton('', Config.icons.remove);
    buttonRemove.clicks.subscribe(function(_) {
      removeField(currentField);
    });
    buttonRemove.enabled.set(false);

    pairs = Html.parse('<div class="fields"><div></div></div>');
    component.el.appendChild(pairs);
    pairs = Query.first('div', pairs);

    schema = this.schemaBus = new Bus();
    data = this.dataBus = new Bus();

    fields = new Map();

    fieldFocus = new Bus();
    fieldFocus.subscribe(function(field) {
      this.currentField = field;
      buttonRemove.enabled.set(null != field);
    });

    addButtonTypes();
  }

  function addButtonTypes() {
/*
    var buttonToText = toolbar.center.addButton('', Config.icons.text);
    buttonToText.clicks.subscribe(function(_) {
      trace("switch to text");
    });
    buttonToText.enabled.set(false);

    var buttonToNumber = toolbar.center.addButton('', Config.icons.number);
    buttonToNumber.clicks.subscribe(function(_) {
      if(null == currentField) return;
      currentField.setEditor(FloatType);
    });
    buttonToNumber.enabled.set(false);
*/
    for(def in typeDefinitions) {
      var button = toolbar.center.addButton('', def.icon);
      button.enabled.set(false);
      button.clicks.subscribe(function(_) {
        if(null == currentField) return;
        schemaBus.pulse(SchemaEvent.RetypeField(currentField.key.value.get(), def.type));
        currentField.setEditor(def.type);
        var editor = currentField.editor;
        thx.core.Timer.delay(function() editor.focus.set(true), 300);
      });
      fieldFocus.subscribe(function(field) {
        if(null == field)
          return button.enabled.set(false);
        var type = field.type;
        button.enabled.set(!Type.enumEq(type, def.type));
      });
    }
  }

  public function guessFieldName() {
    var id = 0,
      prefix = 'field',
      t;
    function assemble(id)
      return id > 0 ? [prefix, '$id'].join('_') : prefix;
    while(fields.exists(t = assemble(id))) id++;
    return t;
  }

  public function removeFieldByName(name : String) {
    var field = fields.get(name);
    removeField(field);
  }

  public function removeField(field : ModelViewField) {
    Assert.notNull(field, 'when removing a field it should not be null');
    var name = field.key.value.get();
    field.destroy();
    if(fields.remove(name)) {
      schemaBus.pulse(DeleteField(name));
    }
  }

  public function setField(path : String, value : Dynamic, type : SchemaType) {
    if(path == "" || path == null)
      return;
    var field = fields.get(path);
    if(null == field)
      field = addField(path, type);
    field.value.set(TypeTransform.transform(type, field.type)(value));
  }

  public function addField(name : String, type : SchemaType) {
    var field = new ModelViewField({
      container : pairs,
      parent : component,
      key : name
    });

    // setup field key
    var oldname = null;

    function createSetValue() {
      return SetValue(field.key.value.get(), field.value.get(), field.type);
    }

    field.key.value
      .filterValue(function(newname : String) {
        // check that it doesn't exist already
        if(fields.exists(newname)) {
          // if exists revert and don't propagate
          field.key.value.set(oldname);
          return false;
        } else {
          return true;
        }
      })
      .mapValue(function(newname : String) {
        if(null == oldname) {
          // new field
          oldname = newname;
          return AddField(newname, field.type);
        } else {
          // rename field name in fields
          var v = fields.get(oldname);
          fields.remove(oldname);
          fields.set(newname, v);
          var r = RenameField(oldname, newname);
          oldname = newname;
          return r;
        }
      })
      .plug(schemaBus);

    // setup field value
    // TODO support multiple editors data types
    // the debounce is not only practical to avoid too many calls
    // but also helps so that data events occur after schema
    // events (not the best synch mechanism ever)
    field.value
      .mapValue(function(_ : String) {
        return createSetValue();
      })
      .debounce(250)
      .plug(dataBus);

    field.focus
      .mapValue(function(v) return v ? field : null)
      .plug(fieldFocus);
    fields.set(name, field);

    return field;
  }
}