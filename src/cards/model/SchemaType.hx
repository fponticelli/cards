package cards.model;

enum SchemaType {
  ArrayType(item : SchemaType);
  BoolType;
  DateType;
  FloatType;
  ObjectType(fields : Array<FieldInfo>);
  StringType;
  CodeType;
  ReferenceType;
}

typedef FieldInfo = {
  name : String,
  type : SchemaType,
  optional : Bool
}