import { ValueStreamProperty } from '../valuestream';
import { BoolValue } from 'streamy/value';
import { Dom } from 'ui/dom';

class VisibleProperty extends ValueStreamProperty {
	constructor(defaultValue = true) {
		super(
			"visible",
			() => new BoolValue(defaultValue),
			(target, value)  =>
				Dom.stream(value).applyDisplay(target.el)
		);
	}
}

export { VisibleProperty };