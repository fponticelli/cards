import { PushStream } from 'streamy/stream';
import { BoolValue } from 'streamy/value';
import { StreamProperty } from '../stream';
import { Dom } from 'ui/dom';

export class ClickProperty extends StreamProperty {
	constructor() {
		super(
			"click",
			() => new PushStream(),
			(target, value)  =>
				Dom.stream(value).on("click", target.el)
		);
	}
}