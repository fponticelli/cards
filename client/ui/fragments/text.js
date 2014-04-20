import { Dom } from 'ui/dom';
import { StringValue } from 'cards/model/value';

import { TextContainerFragment, $, p } from './textcontainer';

class TextFragment extends TextContainerFragment {
	constructor(options = {}) {
		super(options);
		this[p].text = new StringValue(options.text),
		Dom.stream(this[p].text).applyText(this[$]);
	}

	get text() {
		return this[p].text;
	}
}

export { TextFragment, $, p };