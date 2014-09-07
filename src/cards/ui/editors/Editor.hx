package cards.ui.editors;

import thx.stream.Value;
import cards.components.Component;
import cards.model.SchemaType;

interface Editor<T> {
  public var value(default, null) : Value<T>;
  public var type(default, null) : SchemaType;
  public var focus(default, null) : Value<Bool>;
  public var component(default, null) : Component;
}