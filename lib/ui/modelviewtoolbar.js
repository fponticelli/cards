import { Component } from './component';
import { TextProperty, TextEditorProperty, EditorProperty, EnableProperty } from './properties/types'
import { Field } from './field';
import { PushStream } from 'streamy/stream';
import { Query } from 'ui/dom';
import { Button } from 'ui/button';

let template = require('./modelviewtoolbar.jade')(),
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

export class ModelViewToolbar extends Toolbar {
	constructor(view, options) {
		super(options);

		let remove = Button.icon('ban', { parent: this });
		remove.properties.add(new EnableProperty(false));
		this.right.add(remove);
		view.focusStream.map((v) => !!v).debounce(200).feed(remove.enable);

		view.focusStream
			.filter((v) => v !== null)
			.zip(remove.click)
			.log()
			.spread(fragment => fragment)
			.log()
			.map(fragment => fragment.parent.key.value)
			.log();
		remove.click.log();
	}
}