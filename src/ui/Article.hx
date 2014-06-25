package ui;

import steamer.MultiProducer;
import steamer.Producer;
import sui.components.Component;
import sui.components.ComponentOptions;
import thx.Assert;
import ui.Block;

class Article {
	public var component(default, null) : Component;
	public var current(default, null) : MultiProducer<Fragment>;

	var blocks : Map<Block, Void -> Void>;
	public function new(options : ComponentOptions) {
		if(null == options.el && null == options.template)
			options.template = '<article></article>';
		component = new Component(options);
		blocks = new Map();
		current = new MultiProducer();
	}

	public function addBlock() {
		var block = new Block({
			parent : component,
			container : component.el,
			defaultText : 'block'
		});
		var addFocus = block.editor.focus
			.filter(function(v) return v)
			.map(function(_) : Fragment return block);
		current.add(addFocus);
		blocks.set(block, function() {
			current.remove(addFocus);
		});
		return block;
	}

	public function removeBlock(block : Block) {
		var finalizer = blocks.get(block);
		Assert.notNull(finalizer);
		finalizer();
	}
}