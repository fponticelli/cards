import { BaseProperty } from './base';

let _ƒ = Symbol();

class BehaviorProperty extends BaseProperty {
	constructor(name, ƒ) {
		super(name);
		this[_ƒ] = ƒ;
	}

	inject(target) {
		let ƒ = this[_ƒ](target).bind(target);
		this.defineProperty(
			target,
			this.name,
			() => ƒ
		);
		return () => {};
	}
}

export { BehaviorProperty };