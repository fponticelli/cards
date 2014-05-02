import { ContainerProperty } from '../container';
import { BehaviorProperty } from '../behavior';
import { ValueProperty } from './value';
import { Dom, Query, Html } from 'ui/dom';

let template = require('./booleditor.jade');

let _bound = Symbol(),
	_bindƒ = Symbol(),
	_unbindƒ = Symbol(),
	valueProperty = new ValueProperty('Bool', (editor, value) => {
		let el       = editor.parent.el,
			content  = Query.first('.content', el),
			listenƒ  = () => {
				value.push(input.checked);
			},
			input    = Html.parse(template({ checked : value.value })),
			focusƒ   = () => editor.parent.focusStream.push(editor.parent),
			unfocusƒ = () => editor.parent.focusStream.push(null);

		content.appendChild(input);

		input.addEventListener("change", listenƒ, false);
		input.addEventListener("focus", focusƒ, false);
		input.addEventListener("blur", unfocusƒ, false);

		// cancel
		return function() {
			input.removeEventListener("focus", focusƒ, false);
			input.removeEventListener("blur", unfocusƒ, false);
			input.removeEventListener("change", listenƒ, false);
		};
	}),
	focusProperty = new BehaviorProperty('focus', (target) => {
		let content = Query.first('.content', target.parent.el);
		return function() {
			content.focus();
		};
	});

class BoolEditorProperty extends ContainerProperty {
	constructor() {
		super('editor', 'value');
	}

	inject(target) {
		let ƒ = super.inject(target),
			editor = target.editor;

		editor.properties.add(valueProperty);
		editor.properties.add(focusProperty);

		return () => {
			editor.properties.remove(focusProperty);
			ƒ();
		};
	}
}

export { BoolEditorProperty };