import { BaseProperty } from './base';
import { Properties } from './properties';

let _p = Symbol();

class PropertyContainer {
	constructor(parent) {
		this[_p] = parent;
		new Properties(this);
	}

	get parent() {
		return this[_p];
	}
}

class ContainerProperty extends BaseProperty {
	constructor(name, defaultField, wireƒ) {
		super(name);
		wireƒ = wireƒ || (() => {});
		this[_p] = { defaultField, wireƒ };
	}

	inject(target) {
		let container = new PropertyContainer(target),
			setter = (this[_p].defaultField) ?
				(v) => container[this[_p].defaultField].push(v) :
				undefined;

		this.defineProperty(
			target,
			this.name,
			() => container,
			setter
		);

		return this[_p].wireƒ(target) || (() => {});
	}
}

export { ContainerProperty };

/*
	addContainer(name, defaultField, wire) {
		if(this[u][name])
			throw new Error(`A property '${name}' already exists`);
		let container = new PropertyContainer(this[$], this),
			setter = (defaultField) ?
				function(v) { container[defaultField].push(v); } :
				function() { throw new Error('Property Container doesn\'t have a default field'); },
			unwire = wire && wire.call(this, this[$]) || function(){};
		this[u][name] = () => {
			unwire();
			container.removeAll.call(container);
		};
		Object.defineProperty(this, name, {
			configurable: true,
			enumerable: true,
			writeable: false,
			get: () => container,
			set: setter
		});
		return container;
	}
*/