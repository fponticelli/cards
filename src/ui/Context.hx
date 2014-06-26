package ui;

import dom.Dom;
import haxe.ds.Option;
import js.html.Element;
import steamer.Value;
import sui.components.Component;
import sui.components.ComponentOptions;
import sui.properties.ToggleClass;
import ui.Button;
import ui.Fragment;
import ui.Menu;
import ui.SchemaType;
import ui.Toolbar;
using steamer.Consumer;

class Context {
	public var component(default, null) : Component;
	public var toolbar(default, null) : Toolbar;
	public var fragments(default, null) : Consumer<Fragment>;
	public var currentFragment(default, null) : Null<Fragment>;
	var pairs : Element;
	var menuAdd : Menu;
	var buttonAdd : Button;
	var buttonRemove : Button;

	public var field(default, null) : Value<Option<ContextField>>;

	public function new(options : ComponentOptions) {
		component = new Component(options);
		toolbar   = new Toolbar({ parent : component, container : component.el });
		pairs = Html.parse('<div class="fields"><div></div></div>');
		component.el.appendChild(pairs);
		pairs = Query.first('div', pairs);

		buttonAdd = toolbar.left.addButton('add property', Config.icons.dropDown);
		menuAdd = new Menu({ parent : component });

		var addSomething = new Button('add something');
		menuAdd.anchorTo(buttonAdd.component.el);
		buttonAdd.clicks.map(function(_) {
			return true;
		}).feed(menuAdd.visible.visible);

		fragments = setFragmentStatus.toConsumer();
		buttonAdd.enabled.value = false;

		buttonRemove = toolbar.right.addButton('', Config.icons.remove);
		buttonRemove.enabled.value = false;
		buttonRemove.clicks.feed(function(_) {
			switch field.value {
				case Some(field):
					currentFragment.component.properties.get(field.name).dispose();
					field.destroy();
					setAddMenuItems(currentFragment);
				case _:
			}
		}.toConsumer());

		field = new Value(None);
		field.feed(function(option) {
			switch option {
				case Some(field):
					buttonRemove.enabled.value = true;
				case None:
					buttonRemove.enabled.value = false;
			}
		}.toConsumer());
	}

	function setFragmentStatus(fragment : Fragment) {
		currentFragment = fragment;
		setFields(fragment);
		setAddMenuItems(fragment);
	}

	function setFields(fragment : Fragment) {
		pairs.innerHTML = '';
		var fields = getAttachedPropertiesForFragment(fragment);
		fields.map(addField);
	}

	public function addField(pair) {
		var f = new ContextField({
			container : pairs,
			parent : component,
			display : pair.display,
			name : pair.name,
			value : 'true'
		});
		f.focus.map(function(v) {
			return v ? Some(f) : None;
		}).feed(field);
	}

	function setAddMenuItems(fragment : Fragment) {
		if(null == fragment) {
			buttonAdd.enabled.value = false;
			return;
		}

		var attachables = getAttachablePropertiesForFragment(fragment);
		buttonAdd.enabled.value = attachables.length > 0;
		menuAdd.clear();
		attachables.map(function(pair) {
			var button = new Button('add ${pair.name}');
			menuAdd.addItem(button.component);
			button.clicks.feed(function(_) {
				pair.create(fragment.component);
				setFragmentStatus(fragment);
			}.toConsumer());
		});
	}

	public function getAttachedPropertiesForFragment(fragment : Fragment) {
		return getPropertiesForFragment(fragment).filter(function(pair) {
			return fragment.component.properties.exists(pair.name);
		});
	}

	public function getAttachablePropertiesForFragment(fragment : Fragment) {
		return getPropertiesForFragment(fragment).filter(function(pair) {
			return !fragment.component.properties.exists(pair.name);
		});
	}

	public function getPropertiesForFragment(fragment : Fragment) {
		return [{
			display : 'bold',
			name : 'strong',
			create : function(target : Component) {
				var toggle = new ToggleClass(target, 'strong', 'strong');
				toggle.toggleClassName.value = true;
				return toggle;
			},
			type : BoolType
		}, {
			display : 'italic',
			name : 'emphasis',
			create : function(target : Component) {
				var toggle = new ToggleClass(target, 'emphasis', 'emphasis');
				toggle.toggleClassName.value = true;
				return toggle;
			},
			type : BoolType
		}];
	}
}