package ui;

import dom.Dom;
import haxe.ds.Option;
import js.html.Element;
import steamer.Value;
import sui.components.Component;
import sui.components.ComponentOptions;
import sui.properties.ToggleClass;
import ui.Button;
import ui.Expression;
import ui.Fragment;
import ui.Menu;
import ui.SchemaType;
import ui.Toolbar;
using steamer.Consumer;
using ui.Expression;

class Context {
	public var component(default, null) : Component;
	public var toolbar(default, null) : Toolbar;
	public var fragments(default, null) : Consumer<Fragment>;
	public var currentFragment(default, null) : Null<Fragment>;
	var fieldsEl : Element;
	var menuAdd : Menu;
	var buttonAdd : Button;
	var buttonRemove : Button;
	var expressions : Map<String, Value<Expression>>;

	public var field(default, null) : Value<Option<ContextField>>;

	public function new(options : ComponentOptions) {
		component = new Component(options);
		toolbar   = new Toolbar({ parent : component, container : component.el });
		fieldsEl = Html.parse('<div class="fields"><div></div></div>');
		component.el.appendChild(fieldsEl);
		fieldsEl = Query.first('div', fieldsEl);

		buttonAdd = toolbar.left.addButton('add property', Config.icons.dropDown);
		menuAdd = new Menu({ parent : component });

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
		expressions = new Map();
	}

	function setFragmentStatus(fragment : Fragment) {
		currentFragment = fragment;
		setFields(fragment);
		setAddMenuItems(fragment);
	}

	function setFields(fragment : Fragment) {
		fieldsEl.innerHTML = '';
		var fields = getAttachedPropertiesForFragment(fragment);
		fields.map(addField);
	}

	public function addField(fieldInfo : FieldInfo) {
		var f = new ContextField({
			container : fieldsEl,
			parent : component,
			display : fieldInfo.display,
			name : fieldInfo.name,
			value : fieldInfo.code
		});
		f.focus
			.map(function(v) return v ? Some(f) : None)
			.feed(field);

		var exp = f.value.text
				.debounce(250)
				.distinct()
				.map(function(code) return code.toExpression());

		exp.map(function(e) {
			return switch e {
				case Fun(f): None;
				case SyntaxError(e): Some(e);
			};
		}).feed(f.withError);
		exp.feed(expressions.get(fieldInfo.name));
	}

	function setAddMenuItems(fragment : Fragment) {
		if(null == fragment) {
			buttonAdd.enabled.value = false;
			return;
		}

		var attachables = getAttachablePropertiesForFragment(fragment);
		buttonAdd.enabled.value = attachables.length > 0;
		menuAdd.clear();
		attachables.map(function(fieldInfo) {
			var button = new Button('add ${fieldInfo.display}');
			menuAdd.addItem(button.component);
			button.clicks.feed(function(_) {
				expressions.set(fieldInfo.name, fieldInfo.create(fragment.component));
				setFragmentStatus(fragment);
			}.toConsumer());
		});
	}

	public function getAttachedPropertiesForFragment(fragment : Fragment) {
		return getPropertiesForFragment(fragment).filter(function(fieldInfo) {
			return fragment.component.properties.exists(fieldInfo.name);
		});
	}

	public function getAttachablePropertiesForFragment(fragment : Fragment) {
		return getPropertiesForFragment(fragment).filter(function(fieldInfo) {
			return !fragment.component.properties.exists(fieldInfo.name);
		});
	}

	static function toggleClass(name : String) {
		return function(target : Component) {
			var toggle     = new ToggleClass(target, name, name),
				expression = new Value(Fun(function() return false)),
				state : Dynamic = null;
			expression
				.map(function(exp) {
					return switch exp { case Fun(f): f; case _: null; };
				})
				.filter(function(f) return f != null)
				.filter(function(f) {
					return try {
						state = f();
						true;
					} catch(e : Dynamic) {
						trace(e);
						false;
					};
				})
				.map(function(_) {
					return (untyped __js__("!!"))(state);
				})
				.feed(toggle.toggleClassName);
			return expression;
		};
	}

	public function getPropertiesForFragment(fragment : Fragment) : Array<FieldInfo> {
		return [{
			display : 'bold',
			name : 'strong',
			create : toggleClass('strong'),
			type : BoolType,
			code : 'true'
		}, {
			display : 'italic',
			name : 'emphasis',
			create : toggleClass('emphasis'),
			type : BoolType,
			code : 'true'
		}];
	}
}

typedef FieldInfo = {
	display : String,
	name : String,
	create : Component -> Value<Expression>,
	type : SchemaType,
	code : String
}