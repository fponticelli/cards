import { StringValue } from 'streamy/value';
import { ValueStreamProperty } from '../valuestream';
import { Dom } from 'ui/dom';

class AttributeProperty extends ValueStreamProperty {
	constructor(name, attribute, text = "") {
		super(
			name,
			() => new StringValue(text),
			(target, value)  =>
				Dom.stream(value).applyAttribute(attribute, target.el)
		);
	}
}

class TooltipProperty extends AttributeProperty {
	constructor(defaultValue = false) {
		super("tooltip", "title", defaultValue);
	}
}

export { TooltipProperty, AttributeProperty };