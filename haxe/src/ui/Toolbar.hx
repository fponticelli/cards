package ui;

import dom.Dom;
import js.html.Element;
import sui.components.Component;
import sui.components.ComponentOptions;

class Toolbar {
	public var component(default, null) : Component;
	public var left(default, null) : Element;
	public var center(default, null) : Element;
	public var right(default, null) : Element;
	public function new(options : ComponentOptions) {
		if(null == options.el && null == options.template)
			options.template = '<header class="toolbar"><div class="left"></div><div class="center"></div><div class="right"></div></header>';
		component = new Component(options);
		left   = Query.first('.left', component.el);
		center = Query.first('.center', component.el);
		right  = Query.first('.right', component.el);
	}
}