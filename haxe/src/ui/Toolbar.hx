package ui;

import dom.Dom;
import js.html.Element;
import sui.components.Component;

class Toolbar {
	public var component(default, null) : Component;
	public var left(default, null) : Element;
	public var center(default, null) : Element;
	public var right(default, null) : Element;
	public function new() {
		component = new Component({
			template : '<header class="toolbar"><div class="left"></div><div class="center"></div><div class="right"></div></header>'
		});
		left   = Query.first('.left', component.el);
		center = Query.first('.center', component.el);
		right  = Query.first('.right', component.el);
	}
}