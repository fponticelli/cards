package ui;

import sui.components.Component;
import sui.components.ComponentOptions;
import ui.Button;
import ui.Toolbar;

class Document {
	public var component(default, null) : Component;
	public var toolbar(default, null) : Toolbar;
	public var article(default, null) : Article;
	public var statusbar(default, null) : Statusbar;

	public function new(options : ComponentOptions) {
		component = new Component(options);
		toolbar   = new Toolbar({ parent : component, container : component.el });
		article   = new Article({ parent : component, container : component.el });
		statusbar = new Statusbar({ parent : component, container : component.el });

		var buttonAdd = toolbar.left.addButton('', Config.icons.add);

	}
}