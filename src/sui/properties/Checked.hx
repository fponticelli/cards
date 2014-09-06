package sui.properties;

import sui.components.Component;
using steamer.dom.Dom;

class Checked extends BoolProperty {
  public function new(component : Component, defaultValue : Bool) {
    super(dafaultValue, component, 'checked');
    var tuple = component.el.produceEvent('change');
    tuple.producer
      .map(function(_) return component.el.checked)
      .feed(stream);
    cancels.push(tuple.cancel);
  }
}