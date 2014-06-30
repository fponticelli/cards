package ui.editors;

import steamer.Value;

interface Editor {
	public var value(default, null) : Value<Dynamic>;
	public var type(default, null) : SchemaType;
}