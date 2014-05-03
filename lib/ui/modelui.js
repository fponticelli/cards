let _p = Symbol();

import { ModelView, SchemaWrapper } from './modelview';
import { ModelViewToolbar } from './modelviewtoolbar';
import { Component } from './component';

export class ModelUI extends Component {

	constructor(model, schema) {
		super({ template: '<div class="model modelui"></div>' });
		let modelView = new ModelView(),
			wrapper = new SchemaWrapper(schema, modelView),
			toolbar = new ModelViewToolbar(modelView, model, schema);
		this[_p] = {
			model,
			schema,
			modelView,
			toolbar
		};

		toolbar.attachTo(this.el);
		modelView.attachTo(this.el);

		schema.stream.feed(model.schema);
		modelView.data.feed(model.data);
	}

	get model() {
		return this[_p].model;
	}

	get schema() {
		return this[_p].schema;
	}

	get modelView() {
		return this[_p].modelView;
	}

	get toolbar() {
		return this[_p].toolbar;
	}
}