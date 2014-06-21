package ui;

import sui.components.Component;
import sui.components.ComponentOptions;
import ui.DocFooter;
import ui.DocToolbar;
import ui.DocView;

class Doc {
	public static function create(options : ComponentOptions) {
		var doc     = new Component(options),
			toolbar = DocToolbar.create(),
			view    = DocView.create(),
			footer  = DocFooter.create();
		toolbar.toolbar.toolbar.appendTo(doc.el);
		view.view.appendTo(doc.el);
		footer.footer.footer.appendTo(doc.el);
		return {
			doc       : doc,
			toolbarui : toolbar,
			viewui    : view,
			footerui  : footer
		};
	}
}

typedef DocUI = {
	public var doc(default, null) : Component;
	public var toolbarui(default, null) : DocToolbarUI;
	public var viewui(default, null) : DocViewUI;
	public var footerui(default, null) : DocFooterUI;
}