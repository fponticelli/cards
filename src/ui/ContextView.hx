package ui;

import dom.Dom;
import haxe.ds.Option;
import js.html.Element;
import steamer.Value;
import sui.components.Component;
import sui.components.ComponentOptions;
import sui.properties.ValueProperties;
import sui.properties.ValueProperty;
import types.*;
import ui.fragments.FragmentMapper;
import ui.widgets.Button;
import ui.fragments.Fragment;
import ui.widgets.Menu;
import ui.widgets.Toolbar;
using ui.Runtime;
using thx.core.Options;
using steamer.Producer;

class ContextView {
	public var component(default, null) : Component;
	public var toolbar(default, null) : Toolbar;
	public var document(default, null) : Document;
	var el : Element;
	var add : { menu : Menu, button : Button };
	var remove : { button : Button };
	var expressions : Map<String, Value<Runtime>>;
	var mapper : FragmentMapper;

	public var field(default, null) : Value<Option<ContextField>>;

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
		remove.button.enabled.value = false;
		remove.button.clicks.feed(function(_) {
			var field = field.value.toValue(),
				fragment = document.article.fragment.value.toValue();
			fragment.component.properties.get(field.name).dispose();
			field.destroy();
			setAddMenuItems(fragment);
		});

		field = new Value(None);
		field.toBool().feed(remove.button.enabled);
		expressions = new Map();

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
				addField(fragment, info, value);
			});
	}

	function addField(fragment : Fragment, info : ValuePropertyInfo<Dynamic>, value : ValueProperty<Dynamic>) {
		var temp = value.value,
			runtime = ensureRuntime(fragment, info, value),
			f = new ContextField({
				container : el,
				parent    : component,
				display   : info.display,
				name      : info.name,
				type      : info.type,
				value     : valueToCode(info.type)(temp)
			}),
			expression = f.value.value
				.debounce(100)
				.distinct()
				.map(Runtime.toRuntime);
		f.focus
			.map(function(b) return b ? Some(f) : None)
			.feed(field);

		expression
			.merge(runtime)
			.map(Runtime.toErrorOption)
			.feed(f.withError);
		expression.feed(runtime);
	}

	function resetAddMenuItems() {
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

	function ensureRuntime(fragment : Fragment, info : ValuePropertyInfo<Dynamic>, value : ValueProperty<Dynamic>) {
		var key     = '${fragment.uid}:${info.name}',
			runtime = expressions.get(key);
		if(null == runtime) {
			var e = createFeedExpression(
				typeTransform(info.type),
				DynamicTransform.toCode(value.value)
			);
			e.value.feed(value.stream);
			runtime = e.runtime;
			expressions.set(key, runtime);
		}
		return runtime;
	}

	static function valueToCode(type : SchemaType) : Dynamic -> String {
		return switch type {
			case ArrayType(_): ArrayTransform.toCode;
			case BoolType: BoolTransform.toCode;
			case DateType: DateTransform.toCode;
			case FloatType: FloatTransform.toCode;
			case ObjectType(_): ObjectTransform.toCode;
			case StringType: StringTransform.toCode;
			case CodeType: StringTransform.toCode;
		};
	}

	static function typeTransform(type : SchemaType) : Dynamic -> Dynamic {
		return switch type {
			case ArrayType(_): DynamicTransform.toArray;
			case BoolType: DynamicTransform.toBool;
			case DateType: DynamicTransform.toDate;
			case FloatType: DynamicTransform.toFloat;
			case ObjectType(_): DynamicTransform.toObject;
			case StringType: DynamicTransform.toString;
			case CodeType: DynamicTransform.toCode;
		};
	}

	function createFeedExpression<T>(transform : Dynamic -> T, code : String) {
		var runtime = new Value(code.toRuntime()),
			value = new Value(null),
			state : Dynamic = null;

		runtime
			.map(function(r) {
				return switch r.expression {
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
					runtime.value = new Runtime(RuntimeError(Std.string(e)), runtime.value.code);
					false;
				};
			})
			.map(function(_) return state)
			.map(transform)
			.feed(value);
		return {
			runtime : runtime,
			value : value
		};
	}
}