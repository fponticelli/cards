let _name = Symbol();

class BaseInjector {
	inject(target) {
		throw new Error("abstract method: inject");
	}

	defineProperty(target, name, getter, setter) {
		Object.defineProperty(target, name, {
			configurable: true,
			enumerable: true,
			writeable: false,
			get: getter,
			set: setter
		});
	}
}

class BaseProperty extends BaseInjector {
	constructor(name) {
		this[_name] = name;
	}

	get name() {
		return this[_name];
	}
}

export { BaseProperty, BaseInjector };