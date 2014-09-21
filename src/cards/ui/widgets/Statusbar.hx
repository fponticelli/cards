package cards.ui.widgets;

import cards.components.Component;
import cards.components.ComponentOptions;
import cards.ui.widgets.Toolbar.ToolbarGroup;
import udom.Dom;

class Statusbar {
  public var component(default, null) : Component;
  public var left(default, null) : ToolbarGroup;
  public var center(default, null) : ToolbarGroup;
  public var right(default, null) : ToolbarGroup;
  public function new(options : ComponentOptions) {
    if(null == options.el && null == options.template)
      options.template = '<footer class="statusbar"><div><div class="left"></div><div class="center"></div><div class="right"></div></div></footer>';
    component = new Component(options);
    left   = new ToolbarGroup(Query.first('.left',   component.el), component);
    center = new ToolbarGroup(Query.first('.center', component.el), component);
    right  = new ToolbarGroup(Query.first('.right',  component.el), component);
  }
}