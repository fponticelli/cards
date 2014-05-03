import { Component } from './component';

let template = require('./docview.jade')();

export class DocView extends Component {
	constructor(options = {}) {
		if(!('template' in options))
			options.template = template;
		super(options);
	}
}