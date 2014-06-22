package ui;

enum SchemaEvent {
	ListFields(list : Iterable<FieldPair>);
	AddField(name : String, type : SchemaType);
	DeleteField(name : String);
	RenameField(oldname : String, newname : String);
	RetypeField(name : String, type : SchemaType);
}

typedef FieldPair = {
	name : String,
	type : SchemaType
}
