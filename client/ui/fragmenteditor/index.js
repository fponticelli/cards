import { Html, Query } from 'ui/dom';
import { StringValue, BoolValue } from 'cards/model/value';

let template = require('./index.jade'),
	$ = Symbol(),
	p = Symbol(),
	metaKeys = {
		66 : function() { this[p].bold.toggle(); },
		73 : function() { this[p].italic.toggle(); }
	},
	ctrlKeys = {
		85 : function() {/* underline, ignore */}
	};



// visible focus
// placeholder
export default class FragmentEditor {
	constructor() {
		let self = this,
			$el = Html.parse(template()),
			editable = Query.first('[contenteditable]', $el);
		this[$] = {
			el: $el,
			editable: editable
		};
		this[p] = {
			text : new StringValue("some text "),
			bold : new BoolValue(),
			italic : new BoolValue(),
			strikethrough : new BoolValue()
		}
		editable.addEventListener("input", () => {
			this[p].text.set(editable.innerText);
		}, false);

		editable.addEventListener("keydown", (e) => {
			if(e.metaKey) { // TODO test on Win, Linux
				let ƒ = metaKeys[e.keyCode];
				if(ƒ) {
					ƒ.call(this, e);
					e.preventDefault();
				}
			}
			if(e.ctrlKey) {
				let ƒ = ctrlKeys[e.keyCode];
				if(ƒ) {
					ƒ.call(this, e);
					e.preventDefault();
				}
			}
		}, false);

		this[p].text.subscribe(text => editable.innerText = text);
		this[p].bold.subscribe(value => $el.style.fontWeight = value ? "bold" : "normal");
		this[p].italic.subscribe(value => $el.style.fontStyle = value ? "italic" : "normal");
		this[p].strikethrough.subscribe(value => $el.style.textDecoration = value ? "line-through" : "none");

	}
	attachTo(container) {
		container.appendChild(this[$].el)
	}
	focus() {
		this[$].editable.focus();
	}
	get text() {
		return this[p].text;
	}
	get bold() {
		return this[p].bold;
	}
	get italic() {
		return this[p].italic;
	}
	get strikethrough() {
		return this[p].strikethrough;
	}
}