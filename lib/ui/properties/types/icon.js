import { HtmlProperty } from './html';
import { StringValue } from 'streamy/value';
import { Dom, Query } from 'ui/dom';

export class IconProperty extends HtmlProperty {
	assignHtml(target, value) {
		let transform = value.map((icon) => `<i class="fa fa-${icon}"></i>`),
			ƒ = super.assignHtml(target, transform);
		return () => {
			transform.cancel();
			ƒ();
		};
	}
}