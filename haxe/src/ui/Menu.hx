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

class Menu {
	public var component(default, null) : Component;
	public var visible(default, null) : Visible;
	var items : Map<Component, Element>;
	var reference : Element;
	public function new(options : ComponentOptions) {
		if(null == options.el && null == options.template)
			options.template = '<menu></menu>';
		if(options.container == null)
			options.container = Browser.document.body;
		component = new Component(options);
		items = new Map();
		visible = new Visible(component, false);
		function clear(_) {
			visible.visible.value = false;
		}
		visible.visible
			.filter(function(b) {
				return !b;
			})
			.feed(function(_) {
				Browser.document.removeEventListener('mouseup', clear, false);
			}.toConsumer());
		visible.visible
			.filter(function(b) {
				return b;
			})
			.feed(function(_) {
				Browser.document.addEventListener('mouseup', clear, false);
				reposition();
			}.toConsumer());
		reference = Browser.document.body;
	}

	public function addItem(item : Component) {
		var el = Browser.document.createLIElement();
		item.appendTo(el);
		component.add(item);
		component.el.appendChild(el);
		items.set(item, el);
	}

	public function removeItem(item : Component) {
		Assert.notNull(item);
		Assert.isTrue(items.exists(item));
		var el = items.get(item);
		component.el.removeChild(el);
		item.detach();
	}

	public function anchorTo(el : Element) {
		reference = el;
		if(visible.visible.value)
			reposition();
	}

	public function reposition() {
		var style  = component.el.style;
		style.position = "absolute";
		style.top  = (reference.offsetTop + reference.offsetHeight) + 'px';
		style.left = (reference.offsetLeft) + 'px';
	}
}