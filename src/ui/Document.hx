package ui;

import sui.components.Component;
import sui.components.ComponentOptions;
import ui.Button;
import ui.Fragment;
import ui.Toolbar;
using steamer.Consumer;

class Document {
	public var component(default, null) : Component;
	public var toolbar(default, null) : Toolbar;
	public var article(default, null) : Article;
	public var statusbar(default, null) : Statusbar;
	public var currentFragment(default, null) : Null<Fragment>;
	public var fragments(default, null) : Consumer<Fragment>;

	public function new(options : ComponentOptions) {
		component = new Component(options);
		toolbar   = new Toolbar({ parent : component, container : component.el });
		article   = new Article({ parent : component, container : component.el });
		statusbar = new Statusbar({ parent : component, container : component.el });

		var buttonRemove = toolbar.right.addButton('', Config.icons.remove);

		function setFragment(fragment) {
			currentFragment = fragment;
			buttonRemove.enabled.value = null != fragment;
		}

		fragments = setFragment.toConsumer();

		var buttonAdd = toolbar.left.addButton('', Config.icons.add);
		buttonAdd.clicks.feed(function(_) {
			article.addBlock();
		}.toConsumer());

		buttonRemove.enabled.value = false;
		buttonRemove.clicks.feed(function(_) {
			currentFragment.component.destroy();
			setFragment(null);
		}.toConsumer());

		article.current.map(function(v) return v.toString()).feed(new steamer.consumers.LoggerConsumer());


		// TODO remove me
		article.addBlock();
		article.addBlock();
		article.addBlock();
		article.addBlock();
	}
}