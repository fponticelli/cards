let string  = require('string'),
	numeral = require('numeral');

import { Dom } from 'ui/dom';
import { StringValue, BoolValue, FloatValue } from 'cards/model/value';

function addSwapClassFragment(name, className = name) {
	return function(fragment, defaultValue = false) {
		fragment.addPropertyValue(name, new BoolValue(defaultValue), function(value, el) {
			return Dom.stream(value).applySwapClass(el, className);
		});
	};
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
			return Dom.stream(value).applyText(el);
		});
	},
	visible: function(fragment, defaultValue = true) {
		fragment.addPropertyValue("visible", new BoolValue(defaultValue), function(value, el) {
			return Dom.stream(value).applyDisplay(el);
		});
	},
	strong: addSwapClassFragment('strong'),
	emphasis: addSwapClassFragment('emphasis'),
	strike: addSwapClassFragment('strike')
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