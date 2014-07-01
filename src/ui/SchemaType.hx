package ui;

enum SchemaType {
	ArrayType(item : SchemaType);
	BoolType;
	DateType;
	FloatType;
	ObjectType(fields : Iterable<{ name : String, type : SchemaType }>);
	StringType;
	CodeType;
}