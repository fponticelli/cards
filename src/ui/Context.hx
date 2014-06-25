package ui;

import sui.components.Component;
import sui.components.ComponentOptions;
import ui.Button;
import ui.Menu;
import ui.Toolbar;
using steamer.Consumer;

class Context {
	public var component(default, null) : Component;
	public var toolbar(default, null) : Toolbar;

	public function new(options : ComponentOptions) {
		component = new Component(options);
		toolbar   = new Toolbar({ parent : component, container : component.el });

		var buttonAdd = toolbar.left.addButton('add property', Config.icons.dropDown);
		var menuAdd = new Menu({ parent : component });

		var addSomething = new Button('add something');
		menuAdd.addItem(addSomething.component);
		menuAdd.anchorTo(buttonAdd.component.el);
		buttonAdd.clicks.map(function(_) {
			return true;
		}).feed(menuAdd.visible.visible);
	}
}