import { Component } from './component';

let template = require('./fragment.jade')();

class Fragment extends Component {
	constructor(...args) {
		super(template, ...args);
	}
}

export { Fragment };