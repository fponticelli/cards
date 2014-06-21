package ui;

import sui.components.Component;
import ui.ContextToolbar;
import ui.ContextView;

class Context {
	public static function create() {
		var context = {
			context : new Component({ template : '<div class="context"></div>' }),
			toolbar : ContextToolbar.create(),
			view    : ContextView.create(),
		};

		return context;
	}
}

typedef ContextUI = {
	context : Component,
	toolbar : ContextToolbarUI,
	view    : ContextViewUI
}