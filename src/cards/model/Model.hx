package cards.model;

import thx.stream.Bus;
import thx.stream.Emitter;

class Model {
  public var data(default, null) : Data;
  public var schema(default, null) : Schema;

  public var dataEventSubscriber(default, null) : DataEvent -> Void;
  public var schemaEventSubscriber(default, null) : SchemaEvent -> Void;

  public var changes(default, null) : Emitter<String>;
  var bus : Bus<String>;

  public function new(data : Data) {
    this.changes = this.bus = new Bus();
    this.data = data;
    this.schema = new Schema();
    this.dataEventSubscriber = function(e : DataEvent)
      switch e {
        case SetValue(path, value, type):
          data.set(path, value);
          bus.pulse(path);
      };

    this.schemaEventSubscriber = function(e : SchemaEvent) {
      switch e {
        case ListFields(list):
          for(item in list)
            schema.add(item.name, item.type);
          bus.pulse("");
        case AddField(path, type):
          schema.add(path, type);
        case DeleteField(path):
          schema.delete(path);
          data.remove(path);
          bus.pulse(path);
        case RenameField(oldpath, newpath):
          schema.rename(oldpath, newpath);
          data.rename(oldpath, newpath);
          bus.pulse(oldpath);
          bus.pulse(newpath);
        case RetypeField(path, type):
          schema.retype(path, type);
          data.remove(path);
          bus.pulse(path);
      }
    };
  }
}