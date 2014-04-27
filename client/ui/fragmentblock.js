import { Block } from './block';
import { Fragment } from './fragment';

let _fragments = Symbol();

class FragmentBlock extends Block {
	constructor(...args) {
		super(...args);
		this[_fragments] = [];
	}

	createFragment() {
		var fragment = new Fragment();
		this[_fragments].push(fragment);
		fragment.attachTo(this.el);
		return fragment;
	}
}

export { FragmentBlock };