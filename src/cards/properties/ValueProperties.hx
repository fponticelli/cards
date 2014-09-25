package cards.properties;

import cards.components.Component;
import cards.properties.ValueProperty;
import cards.model.SchemaType;

class ValueProperties {
  public var map : Map<String, ValuePropertyInfo<Dynamic>>;
  public function new() {
    map = new Map();
  }

  public function add(name : String, info : ValuePropertyInfo<Dynamic>)
    map.set(name, info);

  public function remove(name : String)
    map.remove(name);

  public function get(name : String)
    return map.get(name);

  public function ensure(name : String, component : Component) : ValueProperty<Dynamic>
    return if(component.properties.exists(name))
      cast(component.properties.get(name), ValueProperty<Dynamic>);
    else
      get(name).create(component);

  public function list()
    return map.keys();
}

typedef ValuePropertyInfo<T> = {
  name    : String,
  display : String,
  create  : Component -> ValueProperty<T>,
  type    : SchemaType
}