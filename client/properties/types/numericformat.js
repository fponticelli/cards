import { StringValue } from 'streamy/value';
import { ValueStreamProperty } from '../valuestream';

let numeral = require('numeral');

class NumericFormatProperty extends ValueStreamProperty {
	constructor(defaultFormat = "") {
		super(
			"format",
			() => new StringValue(defaultFormat),
			(target, format) => {
				let value = target.value,
					text  = target.text;
				if(!value) {
					throw new Error("'format' requires the property 'value'");
				}
				if(!text) {
					throw new Error("'format' requires the property 'text'");
				}
				let stream = value.zip(format);
				stream.spread((value, format) => {
					if(format === "") {
						format = Math.floor(value) === value ? "0,0" : "0,0.000";
					}
					text.value = numeral(value).format(format);
				});
				return stream.cancel.bind(stream);
			}
		);
	}
}

export { NumericFormatProperty };