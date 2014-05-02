import { BaseProperty } from './base';
import { ƒ } from 'util/ƒ';

let _p = Symbol();

export class StreamProperty extends BaseProperty {
	constructor(name, streamƒ, wireƒ) {
		super(name);
		this[_p] = { streamƒ, wireƒ };
	}

	inject(target) {
		let stream = this[_p].streamƒ();
		this.defineProperty(target, this.name, () => stream);

		return ƒ.join(
			this[_p].wireƒ(target, stream),
			() => stream.cancel()
		);
	}
}