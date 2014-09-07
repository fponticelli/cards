package cards.properties;

using thx.stream.dom.Dom;
import cards.components.Component;

class Visible extends BoolProperty {
  public function new(component : Component, defaultValue : Bool) {
    super(defaultValue, component, 'visible');
    stream.subscribe(component.el.subscribeToggleVisibility());
  }
}