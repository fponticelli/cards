import { Component } from './component';
import { DocUI } from './docui';
import { ContextUI } from './contextui';
import { ModelUI } from './modelui';

let _p = Symbol();

export class CardUI extends Component {
	constructor(schema, model) {
		super({ template: '<div class="card"></div>' });
		let docui = new DocUI(),
			contextui = new ContextUI(),
			modelui = new ModelUI(model, schema);

		this[_p] = {
			docui,
			contextui,
			modelui,
			schema,
			model
		};

		docui.attachTo(this.el);

		let aside = document.createElement('aside');
		this.el.appendChild(aside);

		contextui.attachTo(aside);

		modelui.attachTo(aside);
	}

	get docui() {
		return this[_p].docui;
	}

	get contextui() {
		return this[_p].contextui;
	}

	get modelui() {
		return this[_p].modelui;
	}

	get schema() {
		return this[_p].schema;
	}

	get model() {
		return this[_p].model;
	}
}