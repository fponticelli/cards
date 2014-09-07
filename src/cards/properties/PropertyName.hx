package cards.properties;

abstract PropertyName(String) {
  @:from public inline static function fromProperty(property : Property)
    return new PropertyName(property.name);

  @:from public inline static function fromString(name : String)
    return new PropertyName(name);

  public inline function new(name : String)
    this = name;

  @:to public inline function toString()
    return this;
}