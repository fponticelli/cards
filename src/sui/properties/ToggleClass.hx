package sui.properties;

using thx.stream.dom.Dom;
import sui.components.Component;

class ToggleClass extends BoolProperty {
  public function new(component : Component, name : String, ?className : String) {
    var defaultValue = component.el.classList.contains(className);
    super(defaultValue, component, name);
    className = null == className ? name : className;
    stream.subscribe(component.el.subscribeToggleClass(className));
    cancels.push(function() {
      if(defaultValue)
        component.el.classList.add(className);
      else
        component.el.classList.remove(className);
    });
  }
}