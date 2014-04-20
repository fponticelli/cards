import { Html, Dom } from 'ui/dom';
import { BoolValue } from 'cards/model/value';

let template = require('./base.jade')(),
	$ = Symbol(),
	p = Symbol();

class BaseFragment {
	constructor(options) {
		this[$] = Html.parse(template);
		this[p] = {
			visible : new BoolValue(options.visible !== undefined ? options.visible : true, true),
		};

		Dom.stream(this[p].visible).applyDisplay(this[$]);
	}

	attachTo(container) {
		container.appendChild(this[$]);
	}

	get data() {
		let out = {};
		for(let key in this[p]) {
			if(this[p][key].isDefault)
				continue;
			out[key] = this[p][key].value;
		}
		return out;
	}

	set data(o) {
		for(let key in o) {
			if(!this[p][key])
				continue;
			this[p][key].value = o[key];
		}
	}

	get visible() {
		return this[p].visible;
	}
}

export { BaseFragment, $, p };