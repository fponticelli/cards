package ui;

import sui.components.Component;
import sui.Footer;

class DocFooter {
	public static function create()
	{
		return {
			footer : Footer.create()
		};
	}
}

typedef DocFooterUI = {
	footer : {
		footer : Component
	}
}