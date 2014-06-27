package ui;

import js.Browser;
import sui.components.Component;
import sui.components.ComponentOptions;
import js.html.Element;
import sui.properties.Visible;
import thx.Assert;
using steamer.Consumer;
import steamer.Value;
using steamer.dom.Dom;
import dom.Dom;
import ui.FrameOverlay;

class Menu extends FrameOverlay {
	var items : Map<Component, Element>;
	var ul : Element;
	public function new(options : ComponentOptions) {
		if(null == options.el && null == options.template)
			options.template = '<menu class="frame-overlay"><ul></ul></menu>';
		super(options);
		ul = Query.first('ul', component.el);
		items = new Map();
	}

	public function clear() {
		ul.innerHTML = '';
		items = new Map();
	}

	public function addItem(item : Component) {
		var el = Browser.document.createLIElement();
		item.appendTo(el);
		component.add(item);
		ul.appendChild(el);
		items.set(item, el);
	}

	public function removeItem(item : Component) {
		Assert.notNull(item);
		Assert.isTrue(items.exists(item));
		var el = items.get(item);
		item.detach();
		ul.removeChild(el);
	}
}