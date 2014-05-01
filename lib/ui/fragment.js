import { Component } from './component';

let template = require('./fragment.jade')();

class Fragment extends Component {
	constructor(options = {}) {
		if(!('template' in options))
			options.template = template;
		super(options);
	}
}

export { Fragment };