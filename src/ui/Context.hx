package ui;

import dom.Dom;
import js.html.Element;
import sui.components.Component;
import sui.components.ComponentOptions;
import sui.properties.ToggleClass;
import ui.Button;
import ui.Fragment;
import ui.Menu;
import ui.Toolbar;
using steamer.Consumer;

class Context {
	public var component(default, null) : Component;
	public var toolbar(default, null) : Toolbar;
	public var currentFragment(default, null) : Consumer<Fragment>;
	var pairs : Element;
	var menuAdd : Menu;
	var buttonAdd : Button;

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

		currentFragment = setFragmentStatus.toConsumer();
		buttonAdd.enabled.value = false;
	}

	function setFragmentStatus(fragment : Fragment) {
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

	public function getVisiblePropertiesForFragment(fragment : Fragment) {
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
				return new ToggleClass(target, 'strong', 'strong', true);
			}
		}, {
			display : 'italic',
			name : 'emphasis',
			create : function(target : Component) {
				return new ToggleClass(target, 'emphasis', 'emphasis', true);
			}
		}];
	}
}