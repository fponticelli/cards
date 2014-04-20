import { Dom } from 'ui/dom';
import { StringValue, FloatValue } from 'cards/model/value';
import { TextContainerFragment, $, p } from './textcontainer';

let numeral = require('numeral');

class NumberFragment extends TextContainerFragment {
	constructor(options = {}) {
		super(options);
		this[p].format = new StringValue(options.format || "0,0");
		this[p].value  = new FloatValue(options.value);

		this[p].value
			.zip(this[p].format)
			.spread((value, format) => {
				this[$].innerText = numeral(value)(format);
			});
	}
}

export { NumberFragment, $, p };