package ui.fragments;

import steamer.Value;
import sui.components.Component;

interface Fragment {
	public var name(default, null) : String;
	public var component(default, null) : Component;
	public var focus(default, null) : Value<Bool>;
	public var active(default, null) : Value<Bool>;
	public var uid(default, null) : String;
	public function toString() : String;
}