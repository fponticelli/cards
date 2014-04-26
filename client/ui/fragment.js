import { Html } from 'ui/dom';
import { Properties } from '../properties/properties';

let template = require('./fragment.jade')(),
	_p = Symbol();

class Fragment {
	constructor() {
		new Properties(this);
		this[_p] = {
			el: Html.parse(template),
			attached: false
		};
	}

	attachTo(container) {
		container.appendChild(this.el);
		this[_p].attached = true;
	}

	detach() {
		if(!this.isAttached)
			throw new Error('Fragment is not attached');
		this.el.parentNode.removeChild(this.el);
		this[_p].attached = false;
	}

	destroy() {
		if(this.isAttached)
			this.detach();
		this.properties.removeAll();
	}

	get el() {
		return this[_p].el;
	}

	get isAttached() {
		return this[_p].attached;
	}
}

export { Fragment };