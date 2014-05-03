import { EnableProperty } from './properties/types'
import { Button } from 'ui/button';

import { Toolbar } from './toolbar';

export class ModelViewToolbar extends Toolbar {
	constructor(view, model, schema, options) {
		super(options);

		// REMOVE
		let remove = Button.icon('ban', { parent: this, classes: 'alert' });
		remove.properties.add(new EnableProperty(false));
		this.right.add(remove);
		view.focusStream.map((v) => !!v).debounce(200).feed(remove.enable);

		view.focusStream
			.filter((v) => v !== null)
			.sync(remove.click)
			.map(fragment => fragment.parent.key.editor.value.value)
			.subscribe(key => view.deleteField(key));

		// INSERT TEXT
		let insertText = Button.icon('font', { parent: this });
		this.left.add(insertText);
		insertText.click.subscribe(() => {
			let key = model.nextFieldName();
			schema.add(key, "String");
		})

		// INSERT BOOLEAN
		let insertBool = Button.icon('check-square-o', { parent: this });
		this.left.add(insertBool);
		insertBool.click.subscribe(() => {
			let key = model.nextFieldName();
			schema.add(key, "Bool");
		})
	}
}