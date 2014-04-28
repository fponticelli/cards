import { Component } from './component';
import { Fragment } from './fragment';
import { Query } from 'ui/dom';

let template = require('./field.jade')(),
	_p = Symbol();

export class Field extends Component {
	constructor(...args) {
		super(template, ...args);

		let key   = new Fragment(),
			value = new Fragment();

		key.attachTo(Query.first('.key', this.el));
		value.attachTo(Query.first('.value', this.el));

		this[_p] = { key, value };
	}

	get key() {
		return this[_p].key;
	}

	get value() {
		return this[_p].value;
	}
}