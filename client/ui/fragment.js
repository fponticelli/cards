import { Html } from 'ui/dom';
import { PropertyContainer, $ } from './propertycontainer';

let template = require('./fragment.jade')();

class Fragment extends PropertyContainer {
	constructor() {
		super(Html.parse(template));
	}

	attachTo(container) {
		container.appendChild(this[$]);
	}

	detach() {
		if(!this[$].parentNode)
			throw new Error('Fragment is not attached');
		this[$].parentNode.removeChild(this[$]);
	}
}

export { Fragment };