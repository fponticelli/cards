package cards.properties;

using steamer.dom.Dom;
import cards.components.Component;

class Visible extends BoolProperty {
  public function new(component : Component, defaultValue : Bool) {
    super(defaultValue, component, 'visible');
    stream.feed(component.el.consumeToggleVisibility());
  }
}