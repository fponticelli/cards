package cards.ui.input;

import cards.components.Component;
import cards.components.ComponentOptions;
import cards.model.SchemaType;
import thx.stream.Bus;
import thx.stream.Value;

// TODO add interface IRoutedEditor to support path
class Editor implements IEditor {
  public var stream(default, null) : Bus<TypedValue>;
  public var type(default, null) : SchemaType;
  public var focus(default, null) : Value<Bool>;
  public var component(default, null) : Component;

  public function new(type : SchemaType, options : ComponentOptions) {
    this.stream    = new Bus(true, TypedValue.equal);
    this.type      = type;
    this.focus     = new Value(false);
    this.component = new Component(options);
  }

  public function dispose() {
    stream.clear();
    focus.clear();
    component.destroy();
  }

  public function toString()
    return Type.getClassName(Type.getClass(this)).split('.').pop();
}