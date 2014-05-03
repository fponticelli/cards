import { Component } from './component';
import { Field } from './field';

let template = require('./contextview.jade')();

export class ContextView extends Component {
	constructor(options = {}) {
		if(!('template' in options))
			options.template = template;
		super(options);
	}
}