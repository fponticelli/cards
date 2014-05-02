import { ValueStreamProperty } from '../valuestream';
import { BoolValue } from 'streamy/value';
import { Dom, Query } from 'ui/dom';

export class EnableProperty extends ValueStreamProperty {
	constructor(defaultValue = true) {
		super(
			'enable',
			() => new BoolValue(defaultValue),
			(target, value)  => {
				let negated = value.negate(),
					els = Query.all('input,select,textarea,button', target.el)
							.concat([target.el]);
				let ƒ   = els.map((el) => Dom.stream(negated).applySwapAttribute('disabled', target.el))
							.concat([
								Dom.stream(negated).applySwapClass(target.el, 'disabled')
							]);

				return () => {
					negated.cancel();
					ƒ.map((ƒ) => ƒ());
				};
			}
		);
	}
}