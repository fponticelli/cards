import { ContextToolbar } from './contexttoolbar';
import { ContextView } from './contextview';
import { Component } from './component';

let _p = Symbol();

export class ContextUI extends Component {

	constructor() {
		super({ template: '<div class="context"></div>' });
		let toolbar = new ContextToolbar(),
			view    = new ContextView();

		this[_p] = {
			toolbar,
			view
		};

		toolbar.attachTo(this.el);
		view.attachTo(this.el);
	}

	get toolbar() {
		return this[_p].toolbar;
	}

	get view() {
		return this[_p].view;
	}
}