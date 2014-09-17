package cards.ui.widgets;

import udom.Dom;
import js.html.Element;
import cards.components.Component;
import cards.components.ComponentOptions;

class Toolbar {
  public var component(default, null) : Component;
  public var left(default, null) : ToolbarGroup;
  public var center(default, null) : ToolbarGroup;
  public var right(default, null) : ToolbarGroup;
  public function new(options : ComponentOptions) {
    if(null == options.el && null == options.template)
      options.template = '<header class="toolbar"><div><div class="left"></div><div class="center"></div><div class="right"></div></div></header>';
    component = new Component(options);
    left   = new ToolbarGroup(Query.first('.left', component.el), component);
    center = new ToolbarGroup(Query.first('.center', component.el), component);
    right  = new ToolbarGroup(Query.first('.right', component.el), component);
  }
}

class ToolbarGroup {
  public var component(default, null) : Component;

  public function new(el : Element, parent : Component) {
    this.component =  new Component({ el : el, parent : parent});
  }

  public function addButton(text = '', ?icon : String) {
    var button = new Button(text, icon);
    button.component.appendTo(component.el);
    component.add(button.component);
    return button;
  }
}