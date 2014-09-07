package cards.components;

import cards.properties.Property;
import cards.properties.PropertyName;

class Properties {
  var properties : Map<String, Property>;
  var target : Component;
  public function new(target : Component) {
    this.target = target;
    properties = new Map();
  }

  public function removeAll() {
    for(name in properties.keys())
      remove(name);
  }

  function add(property : Property) {
    if(properties.exists(property.name))
      throw '$target already has a property $property';
    properties.set(property.name, property);
  }

  public function get(name : PropertyName) {
    return properties.get(name);
  }

  public function exists(name : PropertyName) {
    return properties.exists(name);
  }

  function remove(name : PropertyName) {
    if(!properties.exists(name))
      throw 'property "${name}" does not exist in $target';
    var prop = properties.get(name);
    properties.remove(name);
    prop.dispose();
  }
}