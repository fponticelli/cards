package cards.properties;

import cards.components.Component;
using thx.stream.dom.Dom;

class Text extends StringProperty {
  public function new(component : Component, ?defaultText : String) {
    super(null == defaultText ? component.el.textContent : defaultText, component, 'text');
    stream.subscribe(component.el.subscribeText());
  }
}