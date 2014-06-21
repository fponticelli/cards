package sui;

import dom.Dom;
import sui.components.Component;

class Toolbar {
	public static function create() {
		var toolbar = new Component({
			template : '<header class="toolbar"><div class="left"/><div class="center"/><div class="right"/></header>'
		});

		return {
			toolbar : toolbar,
			left    : Query.first('.left', toolbar.el),
			center  : Query.first('.center', toolbar.el),
			right   : Query.first('.right', toolbar.el)
		};
	}
}

typedef ToolbarUI = {
	public var toolbar(default, null) : Component;
	public var left(default, null) : Component;
	public var center(default, null) : Component;
	public var right(default, null) : Component;
}