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
import ui.SchemaType;
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
	public var model(default, null) : Model;
	public var modelView(default, null) : ModelView;
	var el : Element;
	var button : {
		add : Button,
		remove : Button,
		toValue : Button,
		toCode : Button,
		toReference : Button
	};
	var menu : {
		add : Menu
	};
	var mapper : FragmentMapper;

	public function new(document : Document, model : Model, modelView : ModelView, mapper : FragmentMapper, options : ComponentOptions) {
		this.document = document;
		this.model = model;
		this.modelView = modelView;
		this.mapper = mapper;
		component = new Component(options);
		toolbar   = new Toolbar({ parent : component, container : component.el });
		el = Html.parse('<div class="fields"><div></div></div>');
		component.el.appendChild(el);
		el = Query.first('div', el);

		button = {
			add : toolbar.left.addButton('add property', Config.icons.dropdown),
			toValue : toolbar.right.addButton('', Config.icons.value),
			toCode : toolbar.right.addButton('', Config.icons.code),
			toReference : toolbar.right.addButton('', Config.icons.reference),
			remove : toolbar.right.addButton('', Config.icons.remove)
		};
		menu = {
			add : new Menu({ parent : component })
		};

		menu.add.anchorTo(button.add.component.el);
		button.add.clicks.toTrue().feed(menu.add.visible.stream);

		button.add.enabled.value = false;

		button.remove.clicks.feed(function(_) {
			var field = field.value.toValue(),
				fragment = document.article.fragment.value.toValue();
			fragment.component.properties.get(field.name).dispose();
			field.destroy();
			setAddMenuItems(fragment);
		});

		button.toValue.clicks.feed(function(_) {
			var field = field.value.toValue(),
				type  = field.fieldValue.type;
			field.fieldValue.setEditor(field.type);
		});
		button.toCode.clicks.feed(function(_) {
			var field = field.value.toValue(),
				type  = field.fieldValue.type;
			field.fieldValue.setEditor(CodeType);
		});
		button.toReference.clicks.feed(function(_) {
			var field = field.value.toValue(),
				type  = field.fieldValue.type;
			field.fieldValue.setEditor(ReferenceType);
		});

		field = new Value(None);
		var delayed = field
			.debounce(10);

		delayed
			.toBool()
			.feed(button.remove.enabled);
		field
			.filterOption()
			.map(function(v) : Producer<SchemaType> return v.currentType)
			.flatMap()
			.feed(function(type) {
				switch type {
					case CodeType:
						button.toCode.enabled.value = false;
						button.toReference.enabled.value = true;
						button.toValue.enabled.value = true;
					case ReferenceType:
						button.toCode.enabled.value = true;
						button.toReference.enabled.value = false;
						button.toValue.enabled.value = true;
					case _:
						button.toCode.enabled.value = true;
						button.toReference.enabled.value = true;
						button.toValue.enabled.value = false;
				}
			});

		var filtered = field.filterOption();
		filtered.previous().feed(function(field : ContextField)
			field.active.value = false);
		filtered.feed(function(field : ContextField)
			field.active.value = true);

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
				value     : value,
				model     : model,
				modelView : modelView
			});

		f.focus
			.filterValue(true)
			.map(function(_) return Some(f))
			.feed(field);
	}

	function resetAddMenuItems() {
		button.remove.enabled.value = false;
		button.toValue.enabled.value = false;
		button.toCode.enabled.value = false;
		button.toReference.enabled.value = false;
		button.add.enabled.value = false;
		menu.add.clear();
	}

	function setAddMenuItems(fragment : Fragment) {
		resetAddMenuItems();
		var attachables = mapper.getAttachablePropertiesForFragment(fragment);
		button.add.enabled.value = attachables.length > 0;
		attachables.map(function(info) {
			var button = new Button('add ${info.display}');
			menu.add.addItem(button.component);
			button.clicks.feed(function(_) {
				mapper.values.ensure(info.name, fragment.component);
				setFragmentStatus(fragment);
			});
		});
	}
}