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

class Menu {
	public var component(default, null) : Component;
	public var visible(default, null) : Visible;
	var items : Map<Component, Element>;
	var reference : Element;
	var ul : Element;
	public function new(options : ComponentOptions) {
		if(null == options.el && null == options.template)
			options.template = '<menu><ul></ul></menu>';
		component = new Component(options);
		ul = Query.first('ul', component.el);
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

	public function anchorTo(el : Element) {
		reference = el;
		if(visible.visible.value)
			reposition();
	}

	public function reposition() {
		if(!component.isAttached) {
			var parent = [Query.first(Config.selectors.app), Browser.document.body].filter(function(v) return null != v).shift();
			component.appendTo(parent);
		}

		var rect = reference.getBoundingClientRect(),
			style  = component.el.style;
		style.position = "fixed";
		style.top  = (rect.top + rect.height) + 'px';
		style.left = (rect.left) + 'px';
	}
}