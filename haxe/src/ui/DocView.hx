package ui;

import sui.components.Component;

class DocView {
	public static function create()
	{
		return {
			view : new Component({ template : '<article class="docview"/>' })
		};
	}
}

typedef DocViewUI = {
	view : Component
}