import { Component } from './component';

let template = require('./footer.jade')(),
	_el      = Symbol();

export class Footer extends Component {
	constructor(options = {}) {
		if(!('template' in options))
			options.template = template;
		super(options);
	}

	add(comp) {
		comp.attachTo(this.el);
	}
}