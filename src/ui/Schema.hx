package ui;

import thx.stream.Emitter;
import thx.stream.Value;
import thx.core.Error;
import ui.SchemaEvent;

class Schema {
  var fields : Map<String, SchemaType>;
  public var stream(default, null) : Emitter<SchemaEvent>;
  var feeder : Value<SchemaEvent>;

  public function new() {
    fields = new Map();
    stream = feeder = new Value(null);
  }

  public function add(name : String, type : SchemaType) {
    if(fields.exists(name))
      throw new Error('Schema already contains a field "$name"');
    fields.set(name, type);
    feeder.set(AddField(name, type));
  }

  public function reset(?list : Array<FieldPair>) {
    if(null == list)
      list = [];
    fields = new Map();
    list.map(function(pair) {
      fields.set(pair.name, pair.type);
    });
    feeder.set(ListFields(list.copy()));
  }

  public function delete(name : String) {
    if(!fields.exists(name))
      throw new Error('Schema does not contain a field "${name}"');
    fields.remove(name);
    feeder.set(DeleteField(name));
  }

  public function rename(oldname : String, newname : String) {
    if(!fields.exists(oldname))
      throw new Error('Schema does not contain a field "${oldname}"');
    var type = fields.get(oldname);
    fields.remove(oldname);
    fields.set(newname, type);
    feeder.set(RenameField(oldname, newname));
  }

  public function retype(name : String, type : SchemaType) {
    if(!fields.exists(name))
      throw new Error('Schema does not contain a field "${name}"');
    fields.set(name, type);
    feeder.set(RetypeField(name, type));
  }

  public function get(name : String) {
    return fields.get(name);
  }

  public function exists(name : String) {
    return fields.exists(name);
  }

  public function getFieldNames() {
    var arr = [];
    for(key in fields.keys())
      arr.push(key);
    return arr;
  }

  public function getPairs() {
    return getFieldNames().map(function(key) {
      return {
        name : key,
        type : fields.get(key)
      };
    });
  }
}