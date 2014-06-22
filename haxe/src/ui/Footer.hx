package sui;

import dom.Dom;
import sui.components.Component;

class Footer {
	public static function create() {
		var footer = new Component({
			template : '<footer/>'
		});

		return {
			footer : footer
		};
	}
}

typedef FooterUI = {
	public var footer(default, null) : Component;
}