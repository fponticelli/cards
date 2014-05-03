import { DocToolbar } from './doctoolbar';
import { DocFooter } from './docfooter';
import { DocView } from './docview';
import { Component } from './component';

let _p = Symbol();

export class DocUI extends Component {
	constructor() {
		super({ template: '<div class="doc"></div>' });
		let toolbar = new DocToolbar(),
			view    = new DocView(),
			footer  = new DocFooter();

		this[_p] = {
			toolbar,
			view,
			footer
		};

		toolbar.attachTo(this.el);
		view.attachTo(this.el);
		footer.attachTo(this.el);
	}

	get toolbar() {
		return this[_p].toolbar;
	}

	get footer() {
		return this[_p].footer;
	}

	get view() {
		return this[_p].view;
	}
}