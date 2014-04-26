import { ContainerProperty } from '../container';
import { BehaviorProperty } from '../behavior';
import { ValueProperty } from './value';
import { Dom, Query } from 'ui/dom';

let _bound = Symbol(),
	_bindƒ = Symbol(),
	_unbindƒ = Symbol(),
	valueProperty = new ValueProperty('String', (editor, value) => {
		let el      = editor.parent.el,
			content = Query.first('.content', el),
			stream  = value.map((s) => s.length === 0).unique(),
			cancelƒ = Dom.stream(stream).applySwapClass(content, 'empty'),
			listenƒ = (e) => {
				value.push(el.innerText);
			};

		editor[_bound] = false;
		editor[_bindƒ] = () => {
			if(editor[_bound]) return;
			content.setAttribute("contenteditable", true);
			content.addEventListener("input", listenƒ, false);
			editor[_bound] = true;
		},
		editor[_unbindƒ] = () => {
			if(!editor[_bound]) return;
			content.removeEventListener("input", listenƒ, false);
			content.removeAttribute("contenteditable");
			editor[_bound] = false;
		};

		content.addEventListener("click", () => editor.focus());
		content.addEventListener("blur", () => editor[_unbindƒ]());

		// cancel
		return function() {
			cancelƒ();
			editor[_unbindƒ]();
			delete editor[_unbindƒ];
			delete editor[_bindƒ];
			delete editor[_bound];
			content.removeEventListener("input", listenƒ, false);
			content.removeAttribute("contenteditable");
		};
	}),
	focusProperty = new BehaviorProperty('focus', (target) => {
		let content = Query.first('.content', target.parent.el);
		return function() {
			target[_bindƒ]();
			content.focus();
		};
	}),
	getSelectionProperty = new BehaviorProperty('getSelection', (target) => {
		let content = Query.first('.content', target.parent.el);
		return function() {
			let selection = window.getSelection();
			if(!selection.baseNode in content.childNodes)
				throw new Error("not found!");
			return {
				start: selection.anchorOffset,
				end: selection.focusOffset,
				text: selection.toString()
			};
		};
	}),
	setSelectionProperty = new BehaviorProperty('setSelection', (target) => {
		let content = Query.first('.content', target.parent.el);
		return function(start, end) {
			let node  = content.firstChild,
				range = document.createRange(),
				sel   = window.getSelection();
			target.focus();
			if(!node) {
				return;
			}
			range.setStart(node, Math.max(start, 0));
			range.setEnd(node, Math.min(end, node.wholeText.length));
			sel.removeAllRanges();
			sel.addRange(range);
		};
	});

class TextEditorProperty extends ContainerProperty {
	constructor() {
		super('editor', 'value');
	}

	inject(target) {
		let ƒ = super.inject(target),
			editor = target.editor;

		editor.properties.add(valueProperty);
		editor.properties.add(focusProperty);
		editor.properties.add(getSelectionProperty);
		editor.properties.add(setSelectionProperty);

		return () => {
			editor.properties.remove(focusProperty);
			editor.properties.remove(getSelectionProperty);
			editor.properties.remove(setSelectionProperty);
			ƒ();
		};
	}
}

export { TextEditorProperty };