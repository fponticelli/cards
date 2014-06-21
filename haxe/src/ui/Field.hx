package ui;

import sui.components.Component;
import dom.Dom;
import sui.components.ComponentOptions;

class Field {
	public static function create(options : ComponentOptions) {
		if(null == options.template && null == options.el)
			options.template = '<div class="field"><div class="key"></div><div class="value"></div></div>';
		var field = new Component(options),
			key   = new Component({ parent : field, el : Query.first('.key', field.el) }),
			value = new Component({ parent : field, el : Query.first('.value', field.el) });

		return {
			field : field,
			key   : key,
			value : value
		};
	}
}