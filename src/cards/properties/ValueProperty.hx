package cards.properties;

import haxe.ds.Option;
import cards.components.Component;
import thx.stream.Value;
import cards.model.Runtime;
using thx.stream.Emitter;
using thx.stream.dom.Dom;

class ValueProperty<T> extends Property {
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
      .subscribe(component.el.subscribeToggleClass('error'));

    runtime
      .subscribe(function(opt : Option<Runtime>) switch opt {
        case None:
          // TODO Remove?
          component.el.classList.remove('error');
          runtimeError.set(None);
        case Some(runtime):
          switch runtime.expression {
            case SyntaxError(e):
              // TODO Remove?
              component.el.classList.add('error');
              runtimeError.set(None);
            case Fun(f):
              // TODO Remove?
              component.el.classList.remove('error');
              runtimeError.set(None);
              switch f() {
                case Result(v):
                  stream.set(transform(v));
                case Error(e):
                  runtimeError.set(Some(e));
              }
          }
      });
  }

  public function transform(value : Dynamic) : T {
    return throw Type.getClassName(Type.getClass(this)).split('.').pop() + '.transform() is abstract and must be overridden';
  }

  override public function dispose() {
    stream.clear();
    runtime.clear();
    runtimeError.clear();
    super.dispose();
  }

  function get_value()
    return stream.get();

  function set_value(value : T)
    return stream.set(value);
}