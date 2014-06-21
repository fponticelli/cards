package ui;

import sui.components.Component;
import sui.Toolbar;

class DocToolbar {
	public static function create()
	{
		return {
			toolbar : Toolbar.create()
		};
	}
}

typedef DocToolbarUI = {
	toolbar : Component
}