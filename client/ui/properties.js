let string  = require('string'),
	numeral = require('numeral');

import { Dom, Query } from 'ui/dom';
import { StringValue, BoolValue, FloatValue } from 'cards/model/value';

function addSwapClassFragment(name, className = name) {
	return function(fragment, defaultValue = false) {
		fragment.addPropertyValue(name, new BoolValue(defaultValue), function(value, el) {
			return Dom.stream(value).applySwapClass(el, className);
		});
	};
}

function addAttributeFragment(name, attribute) {
	return function(fragment, text = "") {
		fragment.addPropertyValue(name, new StringValue(text), function(value, el) {
			return Dom.stream(value).applyAttribute(attribute, content);
		});
	}
}

function createValue(type, a, b, c, d, e) {
	switch(type) {
		case "String":
			return new StringValue(a, b, c, d, e);
		case "Bool":
			return new BoolValue(a, b, c, d, e);
		case "Float":
			return new FloatValue(a, b, c, d, e);
	}
}

let p = {
	value: function(fragment, type, ...args) {
		let value = typeof type === "string" ? createValue(type, ...args) : type;
		fragment.addPropertyValue("value", value, function(value, el) {
			return () => {};
		});
	},
	text: function(fragment, text = "") {
		fragment.addPropertyValue("text", new StringValue(text), function(value, el) {
			let content = Query.first('.content', el);
			return Dom.stream(value).applyText(content);
		});
	},
	visible: function(fragment, defaultValue = true) {
		fragment.addPropertyValue("visible", new BoolValue(defaultValue), function(value, el) {
			return Dom.stream(value).applyDisplay(el);
		});
	},
	strong: addSwapClassFragment('strong'),
	emphasis: addSwapClassFragment('emphasis'),
	strike: addSwapClassFragment('strike'),
	tooltip: addAttributeFragment('tooltip', 'title'),
	link: function(fragment, url = "") {
		fragment.addPropertyValue("link", new StringValue(url), function(value, el) {
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
	addNumericFormat(fragment, defaultFormat = "") {
		let value = fragment.properties.value,
			text  = fragment.properties.text;
		if(!value) {
			throw new Error("'format' requires the property 'value'");
		}
		if(!text) {
			throw new Error("'format' requires the property 'text'");
		}
		fragment.addPropertyValue("format", new StringValue(defaultFormat), function(format) {
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
	removeFormat(fragment) {
		fragment.removeProperty('format');
	}
}

for(let name in p) {
	let cap       = string(name).capitalize().s,
		keyRemove = 'remove' + cap,
		keyAdd    = 'add' + cap;
	Properties[keyAdd] = p[name];
	Properties[keyRemove] = function(fragment) { fragment.removeProperty(name); };
}

export { Properties };