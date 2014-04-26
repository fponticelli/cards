import { ValueStreamProperty } from '../valuestream';
import { BoolValue } from 'streamy/value';
import { Dom } from 'ui/dom';

class SwapClassProperty extends ValueStreamProperty {
	constructor(name, className = name, defaultValue = false) {
		super(
			name,
			() => new BoolValue(defaultValue),
			(target, value)  =>
				Dom.stream(value).applySwapClass(target.el, className)
		);
	}
}

class StrongProperty extends SwapClassProperty {
	constructor(defaultValue = false) {
		super("strong", "strong", defaultValue);
	}
}

class EmphasisProperty extends SwapClassProperty {
	constructor(defaultValue = false) {
		super("emphasis", "emphasis", defaultValue);
	}
}

class StrikeProperty extends SwapClassProperty {
	constructor(defaultValue = false) {
		super("strike", "strike", defaultValue);
	}
}

export { StrongProperty, EmphasisProperty, StrikeProperty, SwapClassProperty };