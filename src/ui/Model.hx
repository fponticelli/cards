package ui;

import thx.stream.Emitter;
import thx.stream.Value;

class Model {
  public var data(default, null) : Data;
  public var schema(default, null) : Schema;

  public var dataEventSubscriber(default, null) : DataEvent -> Void;
  public var schemaEventSubscriber(default, null) : SchemaEvent -> Void;

  public var changes(default, null) : Emitter<String>;
  var feeder : Value<String>;

  public function new(data : Data) {
    this.changes = this.feeder = new Value(null);
    this.data = data;
    this.schema = new Schema();
    this.dataEventSubscriber = function(e : DataEvent) {
      switch e {
        case SetValue(path, value, type):
          data.set(path, value);
          feeder.set(path);
      }
    };
    this.schemaEventSubscriber = function(e : SchemaEvent) {
      switch e {
        case ListFields(list):
          for(item in list)
            schema.add(item.name, item.type);
          feeder.set("");
        case AddField(path, type):
          schema.add(path, type);
        case DeleteField(path):
          schema.delete(path);
          data.remove(path);
          feeder.set(path);
        case RenameField(oldpath, newpath):
          schema.rename(oldpath, newpath);
          data.rename(oldpath, newpath);
          feeder.set(oldpath);
          feeder.set(newpath);
        case RetypeField(path, type):
          schema.retype(path, type);
          feeder.set(path);
      }
    };
  }
}