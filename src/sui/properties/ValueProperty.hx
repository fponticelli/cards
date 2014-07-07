package sui.properties;

import haxe.ds.Option;
import sui.components.Component;
import steamer.Value;
import ui.Runtime;
using steamer.Producer;
using steamer.dom.Dom;

class ValueProperty<T> extends Property {
	public var value(get, set) : T;
	public var defaultValue(get, null) : T;
	public var stream(default, null) : Value<T>;
	public var runtime(default, null) : Value<Option<Runtime>>;
	public var runtimeError(default, null) : Value<Option<String>>;

	public function new(defaultValue : T, component : Component, name : String) {
		stream = new Value(defaultValue);
		runtime = new Value(None);
		runtimeError = new Value(None);
		super(component, name);

		runtimeError
			.toBool()
			.feed(component.el.consumeToggleClass('error'));
		runtime.feed(function(opt : Option<Runtime>) {
			switch opt {
				case None:
					component.el.classList.remove('error');
					runtimeError.value = None;
				case Some(runtime):
					switch runtime.expression {
						case SyntaxError(e):
							component.el.classList.add('error');
							runtimeError.value = None;
						case Fun(f):
							component.el.classList.remove('error');
							runtimeError.value = None;
							switch f() {
								case Result(v):
									stream.value = transform(v);
								case Error(e):
									runtimeError.value = Some(e);
							}
					}
			}
		});
	}

	public function transform(value : Dynamic) : T {
		return throw Type.getClassName(Type.getClass(this)).split('.').pop() + '.transform() is abstract and must be overridden';
	}

	override public function dispose() {
		stream.end();
		super.dispose();
	}

	function get_defaultValue()
		return stream.defaultValue;

	function get_value()
		return stream.value;

	function set_value(value : T)
		return stream.value = value;
}