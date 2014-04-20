import { Dom } from 'ui/dom';
import { StringValue, FloatValue } from 'cards/model/value';
import { TextContainerFragment, $, p } from './textcontainer';

let numeral = require('numeral');

class NumberFragment extends TextContainerFragment {
	constructor(options = {}) {
		super(options);
		this[p].format = new StringValue(options.format || "");
		this[p].value  = new FloatValue(options.value);

		this[p].value
			.zip(this[p].format)
			.spread((value, format) => {
				if(format === "") {
					format = Math.floor(value) === value ? "0,0" : "0,0.000";
				}
				this[$].innerText = numeral(value).format(format);
			});
	}

	get value() {
		return this[p].value;
	}

	get format() {
		return this[p].format;
	}
}

export { NumberFragment, $, p };