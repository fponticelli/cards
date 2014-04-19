import { Html, Query, Dom } from 'ui/dom';
import { StringValue, BoolValue } from 'cards/model/value';

let template = require('./index.jade'),
	$ = Symbol(),
	p = Symbol(),
	metaKeys = {
		66 : function() { this[p].strong.toggle(); },
		73 : function() { this[p].emphasis.toggle(); }
	},
	ctrlKeys = {
		85 : function() {/* underline, ignore */},
		72 : function() { this[p].removed.toggle(); } // CTRL + h
	};


// TODO
// editor events should bubble outside and not apply the state directly (strong, emphasis ...)
// visible focus
// placeholder
export default class FragmentEditor {
	constructor(options = {}) {
		let self = this,
			$el = this[$] = Html.parse(template());

		this[p] = {
			text : new StringValue(options.text),
			strong : new BoolValue(options.strong),
			emphasis : new BoolValue(options.emphasis),
			removed : new BoolValue(options.removed)
		}
		$el.addEventListener("input", () => {
			this[p].text.set($el.innerText);
		}, false);

		$el.addEventListener("keydown", (e) => {
			console.log(e);
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

		this[p].text.subscribe(text => $el.innerText = text);
		this[p].text
			.map((t) => t.length === 0)
			.unique()
			.subscribe(Dom.swapClass($el, "empty"));

		// TODO use classes or wrap in strong/em/strike
		this[p].strong.subscribe(Dom.swapClass($el, "strong"));
		this[p].emphasis.subscribe(Dom.swapClass($el, "emphasis"));
		this[p].removed.subscribe(Dom.swapClass($el, "removed"));

		this[p].text.subscribe(text => console.log(text));
	}
	attachTo(container) {
		container.appendChild(this[$])
	}
	focus() {
		this[$].focus();
	}
	get text() {
		return this[p].text;
	}
	get strong() {
		return this[p].strong;
	}
	get emphasis() {
		return this[p].emphasis;
	}
	get removed() {
		return this[p].removed;
	}
}