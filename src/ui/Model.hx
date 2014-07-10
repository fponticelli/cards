package ui;

import steamer.Consumer;
import steamer.Feeder;
import steamer.Producer;

class Model {
	public var data(default, null) : Data;
	public var schema(default, null) : Schema;

	public var dataEventConsumer(default, null) : Consumer<DataEvent>;
	public var schemaEventConsumer(default, null) : Consumer<SchemaEvent>;

	public var changes(default, null) : Producer<String>;
	var feeder : Feeder<String>;

	public function new(data : Data) {
		this.changes = this.feeder = new Feeder();
		this.data = data;
		this.schema = new Schema();
		this.dataEventConsumer = function(e : DataEvent) {
			switch e {
				case SetValue(path, value, type):
					data.set(path, value);
					feeder.forward(Emit(path));
			}
		};
		this.schemaEventConsumer = function(e : SchemaEvent) {
			switch e {
				case ListFields(list):
					for(item in list)
						schema.add(item.name, item.type);
					feeder.forward(Emit(""));
				case AddField(path, type):
					schema.add(path, type);
				case DeleteField(path):
					schema.delete(path);
					data.remove(path);
					feeder.forward(Emit(path));
				case RenameField(oldpath, newpath):
					schema.rename(oldpath, newpath);
					data.rename(oldpath, newpath);
					feeder.forward(Emit(oldpath));
					feeder.forward(Emit(newpath));
				case RetypeField(path, type):
					schema.retype(path, type);
					feeder.forward(Emit(path));
			}
		};
	}
}