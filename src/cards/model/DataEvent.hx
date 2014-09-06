package cards.model;

enum DataEvent {
  SetValue(path : String, value : Dynamic, type : SchemaType);
}