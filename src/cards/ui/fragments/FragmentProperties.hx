package cards.ui.fragments;

import thx.Set;
import cards.properties.PropertyName;
using thx.Iterables;

class FragmentProperties {
  var map : Map<String, Set<String>>;
  public function new() {
    map = new Map();
  }

  public function associate(fragment : FragmentName, property : PropertyName) {
    var s = map.get(fragment);
    if(null == s)
      map.set(fragment, s = []);
    s.add(property);
  }

  public function associateMany(fragment : FragmentName, properties : Iterable<PropertyName>)
    properties.map(associate.bind(fragment, _));

  public function getAssociations(fragment : FragmentName) : Iterator<String> {
    var s = map.get(fragment);
    if(s == null)
      s = [];
    return s.iterator();
  }
}