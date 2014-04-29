import { ValueStreamProperty } from '../valuestream';
import { StringValue, BoolValue, FloatValue, DateValue } from 'streamy/value';

function valueFunctor(type, ...args) {
	switch(type) {
		case "String":
			return new StringValue(...args);
		case "Bool":
			return new BoolValue(...args);
		case "Float":
			return new FloatValue(...args);
		case "Date":
			return new DateValue(...args);
		default:
			throw new Error(`type '${type}' not found`);
	}
}

class ValueProperty extends ValueStreamProperty {
	constructor(type, wireƒ, ...args) {
		super(
			"value",
			() => typeof type === 'string' ? valueFunctor(type, ...args) : type,
			wireƒ || (()  => (() => {}))
		);
	}
}

export { ValueProperty };