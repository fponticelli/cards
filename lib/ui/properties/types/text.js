import { ValueStreamProperty } from '../valuestream';
import { StringValue } from 'streamy/value';
import { Dom, Query } from 'ui/dom';

class TextProperty extends ValueStreamProperty {
	constructor(text) {
		super(
			"text",
			() => new StringValue(text),
			(target, value)  =>
				Dom.stream(value).applyText(Query.first('.content', target.el))
		);
	}
}

export { TextProperty };