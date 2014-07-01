package ui;

import sui.components.Component;
import sui.components.ComponentOptions;
import ui.fragments.Fragment;
import ui.widgets.Toolbar;
import ui.widgets.Statusbar;
import steamer.Consumer;
using steamer.Producer;
using thx.core.Options;
using steamer.dom.Dom;

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

		var buttonRemove = toolbar.right.addButton('', Config.icons.remove);
		article.fragment.toBool().feed(buttonRemove.enabled);

		var buttonAdd = toolbar.left.addButton('', Config.icons.add);
		buttonAdd.clicks.feed(function(_) {
			article.addBlock();
		});

		buttonRemove.enabled.value = false;
		buttonRemove.clicks.feed(function(_) {
			article.fragment.value.toValue().component.destroy();
			article.fragment.value = None;
		});
	}
}