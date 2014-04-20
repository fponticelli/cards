import { BoolValue } from 'cards/model/value';

import { BaseFragment, $, p } from './base';

class TextContainerFragment extends BaseFragment {
	constructor(options = {}) {
		super(options);

		this[p].strong   = new BoolValue(options.strong),
		this[p].emphasis = new BoolValue(options.emphasis),
		this[p].removed  = new BoolValue(options.removed)
	}
}

export { TextContainerFragment, $, p };