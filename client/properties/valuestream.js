import { BaseProperty } from './base';
import { ƒ } from 'util/ƒ';

let _p = Symbol();

class ValueStreamProperty extends BaseProperty {
	constructor(name, valueƒ, wireƒ) {
		super(name);
		this[_p] = { valueƒ, wireƒ };
	}

	inject(target) {
		let value = this[_p].valueƒ();
		this.defineProperty(target, this.name, () => value, value.push.bind(value));

		return ƒ.join(
			this[_p].wireƒ(target, value),
			() => value.cancel()
		);
	}
}

export { ValueStreamProperty };