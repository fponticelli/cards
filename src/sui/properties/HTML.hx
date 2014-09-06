package sui.properties;

import sui.components.Component;

class HTML extends StringProperty {
  public function new(component : Component, ?defaultHTML : String) {
    super(null == defaultHTML ? component.el.innerHTML : defaultHTML, component, 'html');
    value.feed({
      emit : function(value) component.el.innerHTML = value,
      end : function() component.el.innerHTML = defaultValue
    });
  }
}