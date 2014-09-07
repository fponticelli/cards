package cards.properties;

import cards.components.Component;
using thx.stream.dom.Dom;

class HTML extends StringProperty {
  public function new(component : Component, ?defaultHTML : String) {
    super(null == defaultHTML ? component.el.innerHTML : defaultHTML, component, 'html');
    stream.subscribe(component.el.subscribeHTML());
  }
}