package ui;

import sui.components.Component;

interface Fragment {
	public var name(default, null) : String;
	public var component(default, null) : Component;
	public function toString() : String;
}