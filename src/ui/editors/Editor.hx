package ui.editors;

import steamer.Value;
import sui.components.Component;

interface Editor<T> {
	public var value(default, null) : Value<T>;
	public var type(default, null) : SchemaType;
	public var focus(default, null) : Value<Bool>;
	public var component(default, null) : Component;
}