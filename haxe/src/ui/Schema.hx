package ui;

import steamer.Consumer;
import steamer.Producer;
import steamer.Pulse;
import thx.Error;
using Lambda;

class Schema {
	var fields : Map<String, FieldType>;
	var stream : SchemaProducer;
	var feed : Pulse<SchemaEvent> -> Void;

	public function new() {
		fields = new Map();
		stream = new SchemaProducer(getPairs, function(feed : Pulse<SchemaEvent> -> Void) {
			this.feed = feed;
		});
	}

	public function add(name : String, type : FieldType) {
		if(fields.exists(name))
			throw new Error('Schema already contains a field "$name"');
		fields.set(name, type);
		feed(Emit(AddField(name, type)));
	}

	public function reset(?list : Array<FieldPair>) {
		if(null == list)
			list = [];
		fields = new Map();
		list.map(function(pair) {
			fields.set(pair.name, pair.type);
		});
		feed(Emit(ListFields(list.copy())));
	}

	public function delete(name : String) {
		if(!fields.exists(name))
			throw new Error('Schema does not contain a field "${name}"');
		fields.remove(name);
		feed(Emit(DeleteField(name)));
	}

	public function rename(oldname : String, newname : String) {
		if(!fields.exists(oldname))
			throw new Error('Schema does not contain a field "${oldname}"');
		var type = fields.get(oldname);
		fields.remove(oldname);
		fields.set(newname, type);
		feed(Emit(RenameField(oldname, newname)));
	}

	public function retype(name : String, type : FieldType) {
		if(!fields.exists(name))
			throw new Error('Schema does not contain a field "${name}"');
		fields.set(name, type);
		feed(Emit(RetypeField(name, type)));
	}

	public function getPairs() {
		var arr = [];
		for(key in fields.keys()) {
			arr.push({
				name : key,
				type : fields.get(key)
			});
		}
		return arr;
	}
}

class SchemaProducer extends Producer<SchemaEvent> {
	var getPairs : Void -> Array<FieldPair>;
	public function new(getPairs : Void -> Array<FieldPair>, handler : (Pulse<SchemaEvent> -> Void) -> Void) {
		this.getPairs = getPairs;
		super(handler, false);
	}

	override function feed(consumer : Consumer<SchemaEvent>) {
		super.feed(consumer);
		consumer.onPulse(Emit(ListFields(getPairs())));
	}
}

enum SchemaEvent {
	ListFields(list : Array<FieldPair>);
	AddField(name : String, type : FieldType);
	DeleteField(name : String);
	RenameField(oldname : String, newname : String);
	RetypeField(name : String, type : FieldType);
}

typedef FieldPair = {
	name : String,
	type : FieldType
}

typedef FieldType = {

}