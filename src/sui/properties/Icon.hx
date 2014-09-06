package sui.properties;

import js.html.Element;
import sui.components.Component;

class Icon extends StringProperty {
  static function getCurrentIcon(el : Element) {
    for(i in 0...el.classList.length) {
      var className = el.classList.item(i);
      if(className.substr(0, 3) == "fa-")
        return className.substr(3);
    }
    return null;
  }

  public function new(component : Component, defaultIcon : String) {
    super(defaultIcon, component, 'icon');

    var el       = component.el,
        current  = getCurrentIcon(el),
        original = current,
        needsFa  = current == null;
    if(needsFa)
      el.classList.add('fa');
    value.feed({
      emit : function(value) {
        if(null != current)
          el.classList.remove(current);
        el.classList.add(current = 'fa-$value');
      },
      end : function() {
        if(needsFa)
          el.classList.remove('fa');
        el.classList.remove(current);
        if(null != original)
          el.classList.add(original);
      }
    });
  }
}