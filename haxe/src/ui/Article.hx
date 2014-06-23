package ui;

import sui.components.Component;
import sui.components.ComponentOptions;
import ui.Block;

class Article {
	public var component(default, null) : Component;
	var blocks : Array<Block>;
	public function new(options : ComponentOptions) {
		if(null == options.el && null == options.template)
			options.template = '<article></article>';
		component = new Component(options);
		blocks = [];
	}

	public function addBlock() {
		var block = new Block({
			parent : component,
			container : component.el,
			defaultText : ''
		});
		blocks.push(block);
		return block;
	}
}