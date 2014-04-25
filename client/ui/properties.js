let string  = require('string'),
	numeral = require('numeral');

import { Dom, Query } from 'ui/dom';
import { StringValue, BoolValue, FloatValue, DateValue } from 'streamy/value';

function addSwapClassFragment(name, className = name) {
	return function(fragment, defaultValue = false) {
		fragment.addValue(name, new BoolValue(defaultValue), function(value, el) {
			return Dom.stream(value).applySwapClass(el, className);
		});
	};
}

function addAttributeFragment(name, attribute) {
	return function(fragment, text = "") {
		fragment.addValue(name, new StringValue(text), function(value, el) {
			return Dom.stream(value).applyAttribute(attribute, el);
		});
	}
}

function createValue(type, ...args) {
	switch(type) {
		case "String":
			return new StringValue(...args);
		case "Bool":
			return new BoolValue(...args);
		case "Float":
			return new FloatValue(...args);
		case "Date":
			return new DateValue(...args);
	}
}

let p = {
	value: function(fragment, type, ...args) {
		let value = typeof type === "string" ? createValue(type, ...args) : type;
		fragment.addValue("value", value, function(value, el) {
			return () => {};
		});
	},
	text: function(fragment, text = "") {
		fragment.addValue("text", new StringValue(text), function(value, el) {
			let content = Query.first('.content', el);
			return Dom.stream(value).applyText(content);
		});
	},
	visible: function(fragment, defaultValue = true) {
		fragment.addValue("visible", new BoolValue(defaultValue), function(value, el) {
			return Dom.stream(value).applyDisplay(el);
		});
	},
	strong: addSwapClassFragment('strong'),
	emphasis: addSwapClassFragment('emphasis'),
	strike: addSwapClassFragment('strike'),
	tooltip: addAttributeFragment('tooltip', 'title'),
	link: function(fragment, url = "") {
		fragment.addValue("link", new StringValue(url), function(value, el) {
			let a = document.createElement('a'),
				ƒ = (url) => a.href = url;
			a.target = "_blank";
			for(let i = 0; i < el.childNodes.length; i++) {
				a.appendChild(el.childNodes[i]);
			}
			el.appendChild(a);
			value.subscribe(ƒ);
			return () => {
				value.unsubscribe(ƒ);
				el.removeChild(a);
				for(let i = 0; i < a.childNodes.length; i++) {
					el.appendChild(a.childNodes[i]);
				}
			};
		});
	}
};

let Properties = {

};

for(let name in p) {
	let cap       = string(name).capitalize().s,
		keyRemove = 'remove' + cap,
		keyAdd    = 'add' + cap;
	Properties[keyAdd] = p[name];
	Properties[keyRemove] = function(fragment) { fragment.remove(name); };
}

let Formats = {
	addNumeric(fragment, defaultFormat = "") {
		let value = fragment.value,
			text  = fragment.text;
		if(!value) {
			throw new Error("'format' requires the property 'value'");
		}
		if(!text) {
			throw new Error("'format' requires the property 'text'");
		}
		fragment.addValue("format", new StringValue(defaultFormat), function(format) {
			let stream = value.zip(format);
			stream.spread((value, format) => {
					if(format === "") {
						format = Math.floor(value) === value ? "0,0" : "0,0.000";
					}
					text.value = numeral(value).format(format);
				});
			return stream.cancel.bind(stream);
		});
	},
	remove(fragment) {
		fragment.remove('format');
	}
}

let Editors = {
	addText(fragment) {
		var container = fragment.addContainer("editor", "value");
		container.addValue("value", new StringValue(""), function(value, el) {
			let text = this.parent.text;
			if(!text) {
				throw new Error("'editor' requires the property 'text'");
			}
			let content = Query.first('.content', el),
				stream  = text.map((s) => s.length === 0).unique(),
				streamƒ = Dom.stream(stream).applySwapClass(content, 'empty'),
				listenƒ = (e) => {
					value.push(el.innerText);
				};

			content.setAttribute("contenteditable", true);
			content.addEventListener("input", listenƒ, false);

			return function() {
				streamƒ();
				content.removeEventListener("input", listenƒ, false);
				content.removeAttribute("contenteditable");
			};
		});
		container.addBehavior("focus", function(el) {
			let content = Query.first('.content', el)
			return function() { content.focus(); };
		});
	},
	remove(fragment) {
		fragment.remove('editor');
	}
}

export { Properties, Formats, Editors };