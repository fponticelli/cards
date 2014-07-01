package ui;

import dom.Dom;
import haxe.ds.Option;
import js.html.Element;
import steamer.Value;
import sui.components.Component;
import sui.components.ComponentOptions;
import sui.properties.ValueProperties;
import sui.properties.ValueProperty;
import ui.fragments.FragmentMapper;
import ui.widgets.Button;
import ui.fragments.Fragment;
import ui.widgets.Menu;
import ui.widgets.Toolbar;
using thx.core.Options;
using steamer.Producer;

class ContextView {
	public var component(default, null) : Component;
	public var toolbar(default, null) : Toolbar;
	public var document(default, null) : Document;
	public var field(default, null) : Value<Option<ContextField>>;
	var el : Element;
	var add : { menu : Menu, button : Button };
	var remove : { button : Button };
	var mapper : FragmentMapper;

	public function new(document : Document, mapper : FragmentMapper, options : ComponentOptions) {
		this.document = document;
		this.mapper = mapper;
		component = new Component(options);
		toolbar   = new Toolbar({ parent : component, container : component.el });
		el = Html.parse('<div class="fields"><div></div></div>');
		component.el.appendChild(el);
		el = Query.first('div', el);

		add = {
			button : toolbar.left.addButton('add property', Config.icons.dropdown),
			menu : new Menu({ parent : component })
		};

		add.menu.anchorTo(add.button.component.el);
		add.button.clicks.toTrue().feed(add.menu.visible.stream);

		add.button.enabled.value = false;

		remove = { button : toolbar.right.addButton('', Config.icons.remove) };
		remove.button.clicks.feed(function(_) {
			var field = field.value.toValue(),
				fragment = document.article.fragment.value.toValue();
			fragment.component.properties.get(field.name).dispose();
			field.destroy();
			setAddMenuItems(fragment);
		});

		field = new Value(None);
		field.toBool().debounce(10).feed(remove.button.enabled);
		var filtered = field.filterOption();
		filtered.previous().feed(function(field : ContextField) {
			field.active.value = false;
		});
		filtered.feed(function(field : ContextField) {
			field.active.value = true;
		});

		document.article.fragment.feed({
			some : setFragmentStatus,
			none : resetFragmentStatus
		});
	}

	function resetFragmentStatus() {
		resetFields();
		resetAddMenuItems();
	}

	function setFragmentStatus(fragment : Fragment) {
		setFields(fragment);
		setAddMenuItems(fragment);
	}

	function resetFields() {
		el.innerHTML = '';
	}

	function setFields(fragment : Fragment) {
		resetFields();
		mapper
			.getAttachedPropertiesForFragment(fragment)
			.map(function(info) {
				var value = cast(fragment.component.properties.get(info.name), ValueProperty<Dynamic>);
				addField(info, value);
			});
	}

	function addField(info : ValuePropertyInfo<Dynamic>, value : ValueProperty<Dynamic>) {
		var f = new ContextField({
				container : el,
				parent    : component,
				display   : info.display,
				name      : info.name,
				type      : info.type,
				value     : value
			});

		f.focus
			.filterValue(true)
			.map(function(b) return b ? Some(f) : None)
			.feed(field);
	}

	function resetAddMenuItems() {
		remove.button.enabled.value = false;
		add.button.enabled.value = false;
		add.menu.clear();
	}

	function setAddMenuItems(fragment : Fragment) {
		resetAddMenuItems();
		var attachables = mapper.getAttachablePropertiesForFragment(fragment);
		add.button.enabled.value = attachables.length > 0;
		attachables.map(function(info) {
			var button = new Button('add ${info.display}');
			add.menu.addItem(button.component);
			button.clicks.feed(function(_) {
				mapper.values.ensure(info.name, fragment.component);
				setFragmentStatus(fragment);
			});
		});
	}
}