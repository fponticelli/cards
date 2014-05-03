import { ModelView, SchemaWrapper } from './modelview';
import { ModelViewToolbar } from './modelviewtoolbar';
import { Component } from './component';

let _p = Symbol();

export class ModelUI extends Component {

	constructor(model, schema) {
		super({ template: '<div class="model"></div>' });
		let view = new ModelView(),
			wrapper = new SchemaWrapper(schema, view),
			toolbar = new ModelViewToolbar(view, model, schema);
		this[_p] = {
			model,
			schema,
			view,
			toolbar
		};

		toolbar.attachTo(this.el);
		view.attachTo(this.el);

		schema.stream.feed(model.schema);
		view.data.feed(model.data);
	}

	get model() {
		return this[_p].model;
	}

	get schema() {
		return this[_p].schema;
	}

	get view() {
		return this[_p].view;
	}

	get toolbar() {
		return this[_p].toolbar;
	}
}