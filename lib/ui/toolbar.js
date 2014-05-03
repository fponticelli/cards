import { Component } from './component';
import { Query } from 'ui/dom';

let template = require('./toolbar.jade')(),
	_left    = Symbol(),
	_middle  = Symbol(),
	_right   = Symbol(),
	_el      = Symbol();

export class ToolbarGroup {
	constructor(el) {
		this[_el] = el;
	}

	get el() {
		return this[_el];
	}

	add(comp) {
		comp.attachTo(this.el);
	}
}

export class Toolbar extends Component {
	constructor(options = {}) {
		if(!('template' in options))
			options.template = template;
		super(options);
		this[_left]   = new ToolbarGroup(Query.first('.left', this.el));
		this[_middle] = new ToolbarGroup(Query.first('.middle', this.el));
		this[_right]  = new ToolbarGroup(Query.first('.right', this.el));
	}

	get left() {
		return this[_left];
	}

	get middle() {
		return this[_middle];
	}

	get right() {
		return this[_right];
	}
}