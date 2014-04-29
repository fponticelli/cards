import { ValueStreamProperty } from '../valuestream';
import { StringValue } from 'streamy/value';
import { Dom, Query } from 'ui/dom';

export class HtmlProperty extends ValueStreamProperty {
	constructor(html) {
		super(
			"html",
			() => new StringValue(html),
			this.assignHtml
		);
	}

	assignHtml(target, value) {
		Dom.stream(value).applyHtml(Query.first('.content', target.el))
	}
}