package cards.ui.input;

import cards.components.Component;
import cards.model.SchemaType;
import thx.stream.Bus;
import thx.stream.Value;

interface IEditor {
  public var stream(default, null) : Bus<TypedValue>;
  public var type(default, null) : SchemaType;
  public var focus(default, null) : Value<Bool>;
  public var component(default, null) : Component;
//  public var parent(default, null) : IEditor;
//  public var children(default, null) : Array<IEditor>;
}