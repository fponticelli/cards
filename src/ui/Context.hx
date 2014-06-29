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
import steamer.Consumer;
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
	var expressions : Map<String, { expression : Value<Expression>, code : Value<String> }>;

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
		}).feed(menuAdd.visible.stream);

		fragments = setFragmentStatus;
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
		});

		field = new Value(None);
		field.feed(function(option) {
			switch option {
				case Some(field):
					buttonRemove.enabled.value = true;
				case None:
					buttonRemove.enabled.value = false;
			}
		});
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

	public function addField(fieldInfo : FieldInfo<Dynamic>) {
		var pair = expressions.get(fieldInfo.name),
			f = new ContextField({
				container : fieldsEl,
				parent : component,
				display : fieldInfo.display,
				name : fieldInfo.name,
				value : null == pair.code.value ? fieldInfo.code : pair.code.value
			});
		f.focus
			.map(function(v) return v ? Some(f) : None)
			.feed(field);

		var expression = pair.expression,
			exp = f.value.text
					.debounce(250)
					.distinct()
					.map(function(code) return code.toExpression());

		f.value.text.feed(pair.code);
		var mixed = exp.merge(expression);
		mixed.map(function(e) {
			return switch e {
				case Fun(f):
					None;
				case SyntaxError(e):
					Some(e);
				case RuntimeError(e):
					Some(e);
			};
		}).feed(f.withError);
		exp.feed(expression);
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
				var pair = createFeedExpression(fieldInfo.transform, fieldInfo.defaultf),
					expression = pair.expression,
					value = pair.value;
				fieldInfo.create(fragment.component, value);
				expressions.set(fieldInfo.name, {
					expression : expression,
					code : new Value<String>(null)
				});
				setFragmentStatus(fragment);
			});
		});
	}

	function createFeedExpression<T>(transform : Dynamic -> T, defaultf : Void -> Dynamic) {
		var expression = new Value(Fun(defaultf)),
			value = new Value(null),
			state : Dynamic = null;

		expression
			.map(function(exp) {
				return switch exp {
					case Fun(f):
						f;
					case _:
						null;
				};
			})
			.filter(function(f) return f != null)
			.filter(function(f) {
				return try {
					state = f();
					true;
				} catch(e : Dynamic) {
					expression.value = RuntimeError(Std.string(e));
					false;
				};
			})
			.map(function(_) return state)
			.map(transform)
			.feed(value);
		return {
			expression : expression,
			value : value
		};
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

	static function createToggleInfo(display : String, name : String) : FieldInfo<Bool> {
		return {
			display   : display,
			name      : name,
			create    : function(target : Component, value : Value<Bool>) {
							var toggle = new sui.properties.ToggleClass(target, name, name);
							value.feed(toggle.stream);
						},
			type      : BoolType,
			code      : 'true',
			transform : function(v : Dynamic) : Dynamic return untyped __js__('!!')(v),
			defaultf  : function() : Dynamic return false
		};
	}

	static function createTextInfo() : FieldInfo<String> {
		return {
			display   : 'content',
			name      : 'text',
			create    : function(target : Component, value : Value<String>) {
							var text = new sui.properties.Text(target, '');
							value.feed(text.stream);
						},
			type      : StringType,
			code      : '"franco"',
			transform : valueToString,
			defaultf  : function() : Dynamic return ""
		};
	}

	static function valueToString(value : Dynamic) {
		if(Std.is(value, Date)) {
			return (value : Date).toString();
		}
		if(Std.is(value, Bool)) {
			return value ? 'Yes' : 'No';
		}
		if(Std.is(value, String)) {
			return value;
		}
		if(Std.is(value, Array)) {
			return (value : Array<Dynamic>).map(valueToString).join(', ');
		}
		if(Reflect.isObject(value)) {
			return Reflect.fields(value).map(function(field) {
				return '$field: ' + valueToString(Reflect.field(value, field));
			}).join(', ');
		}
		return '' + value;
	}

	public function getPropertiesForFragment(fragment : Fragment) : Array<FieldInfo<Dynamic>> {
		return switch fragment.name {
			case 'block':
				[
					createToggleInfo('bold', 'strong'),
					createToggleInfo('italic', 'emphasis'),
				];
			case 'readonly':
				[
					createToggleInfo('bold', 'strong'),
					createToggleInfo('italic', 'emphasis'),
					createTextInfo()
				];
			case _: [];
		}
	}
}

typedef FieldInfo<T> = {
	display : String,
	name : String,
	create : Component -> Value<T> -> Void,
	type : SchemaType,
	code : String,
	transform : Dynamic -> T,
	defaultf : Void -> T
}