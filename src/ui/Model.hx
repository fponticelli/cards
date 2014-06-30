package ui;

import steamer.Consumer;

class Model {
	public var data(default, null) : Data;
	public var schema(default, null) : Schema;
	public var keys(get, null) : Array<String>;

	public var dataEventConsumer(default, null) : Consumer<DataEvent>;
	public var schemaEventConsumer(default, null) : Consumer<SchemaEvent>;

	public function new(data : Data) {
		this.data = data;
		this.schema = new Schema();
		this.dataEventConsumer = function(e : DataEvent) {
			switch e {
				case SetValue(path, value, type):
					data.set(path, value);
			}
		};
		this.schemaEventConsumer = function(e : SchemaEvent) {
			switch e {
				case ListFields(list):
					for(item in list)
						schema.add(item.name, item.type);
				case AddField(path, type):
					schema.add(path, type);
				case DeleteField(path):
					schema.delete(path);
					data.remove(path);
				case RenameField(oldpath, newpath):
					schema.rename(oldpath, newpath);
					data.rename(oldpath, newpath);
				case RetypeField(path, type):
					schema.retype(path, type);
			}
		};
	}

	function get_keys() {
		return [];
	}

}

enum ModelChange {

}