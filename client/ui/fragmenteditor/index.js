import Html from 'ui/html';
import Query from 'ui/query';

var template = require('./index.jade'),
	$        = Symbol();

export default class FragmentEditor {
	constructor() {
		var $el = Html.parse(template());
		this[$] = {
			el : $el,
			editable : $el
		};
	}
	attachTo(container) {
		container.appendChild(this[$].el)
	}
	focus() {
		Query.first('[contenteditable]').focus();
	}
}