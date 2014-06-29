package ui;

import steamer.MultiProducer;
import steamer.Producer;
import sui.components.Component;
import sui.components.ComponentOptions;
import thx.Assert;
import ui.Block;
import ui.ReadonlyBlock;
import ui.Fragment;

class Article {
	public var component(default, null) : Component;
	public var current(default, null) : MultiProducer<Fragment>;

	var fragments : Map<Fragment, Void -> Void>;
	public function new(options : ComponentOptions) {
		if(null == options.el && null == options.template)
			options.template = '<article></article>';
		component = new Component(options);
		fragments = new Map();
		current = new MultiProducer();
	}

	function addFragment(fragment : Fragment) {
		var addFocus = fragment
			.focus
			.filter(function(v) return v)
			.map(function(_) : Fragment return fragment);
		current.add(addFocus);
		fragments.set(fragment, function() {
			current.remove(addFocus);
		});
	}

	public function addBlock() {
		var fragment = new Block({
				parent : component,
				container : component.el,
				defaultText : 'block'
			});
		addFragment(fragment);
		return fragment;
	}

	public function addReadonly() {
		var fragment = new ReadonlyBlock({
				parent : component,
				container : component.el
			});
		addFragment(fragment);
		return fragment;
	}

	public function removeFragment(fragment : Fragment) {
		var finalizer = fragments.get(fragment);
		Assert.notNull(finalizer);
		finalizer();
	}
}