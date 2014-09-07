package cards.ui.widgets;

import cards.components.Component;
import cards.components.ComponentOptions;

class Statusbar {
  public var component(default, null) : Component;
  public function new(options : ComponentOptions) {
    if(null == options.el && null == options.template)
      options.template = '<footer class="statusbar"></footer>';
    component = new Component(options);
  }
}