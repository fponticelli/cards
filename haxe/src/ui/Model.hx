package ui;

import steamer.Producer;
import steamer.Pulse;
import ui.Schema;

class Model {
	public var data(default, null) : Data;
	public var schema(default, null) : Schema;
	public var changes(default, null) : Producer<ModelChange>;
	public var keys(get, null) : Array<String>;

	public function new(data : Data) {
		this.data = data;
		this.schema = new Schema();
		this.changes = new Producer(function(feed) {
			data.stream.feed({
				onPulse : function(p : Pulse<{}>) {
					switch(p) {
						case Emit(o):

						case Fail(e):
							feed(Fail(e));
						case End:
							feed(End);
					}

				}
			});
			schema.stream.feed({
				onPulse : function(p : Pulse<SchemaEvent>) {
					switch(p) {
						case Emit(e):
							switch(e) {
								case ListFields(list):

								case AddField(name, type):

								case DeleteField(name):

								case RenameField(oldname, newname):

								case _:
							}
						case Fail(e):
							feed(Fail(e));
						case End:
							feed(End);
					}

				}
			});
		});
	}

	function get_keys() {
		return [];
	}

}

enum ModelChange {

}