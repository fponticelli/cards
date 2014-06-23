package ui;

import sui.components.Component;
import sui.components.ComponentOptions;

class Article {
	public var component(default, null) : Component;
	public function new(options : ComponentOptions) {
		if(null == options.el && null == options.template)
			options.template = '<article></article>';
		component = new Component(options);
	}
}