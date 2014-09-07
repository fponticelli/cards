package cards.properties;

import cards.components.Component;
using thx.stream.dom.Dom;

class ToggleClass extends BoolProperty {
  public function new(component : Component, name : String, ?className : String) {
    var defaultValue = component.el.classList.contains(className);
    super(defaultValue, component, name);
    className = null == className ? name : className;
    stream.subscribe(component.el.subscribeToggleClass(className));
  }
}