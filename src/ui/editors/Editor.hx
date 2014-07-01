package ui.editors;

import steamer.Value;

interface Editor<T> {
	public var value(default, null) : Value<T>;
	public var type(default, null) : SchemaType;
	public var focus(default, null) : Value<Bool>;
}