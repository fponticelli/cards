import { BoolEditorProperty } from './booleditor';
import { TextEditorProperty } from './texteditor';

export let EditorProperty = {
	create(type, ...args) {
		switch(type) {
			case 'String':
				return new TextEditorProperty(...args);
			case 'Bool':
				return new BoolEditorProperty(...args);
			default:
				throw new Error(`Invalid editor type '${type}'`);
		}
	}
}