var _p = Symbol;

class Properties {
	constructor(target) {
		this[_p] = {
			target: target,
			properties: {},
			disposables: {}
		};

		Object.defineProperty(target, "properties", {
			configurable: true,
			enumerable: true,
			writeable: false,
			get: () => this
		});
	}

	add(property) {
		let name = property.name;
		if(name in this[_p].target)
			throw new Error(`property 'name' already exists`);
		this[_p].properties[name] = property;
		this[_p].disposables[name] = property.inject(this[_p].target);
	}

	remove(property) {
		let name = property.name || property;
		if(!(name in this[_p].properties))
			throw new Error(`property 'name' doesn't exist`);
		this[_p].disposables[name]();
		delete this[_p].disposables[name];
		delete this[_p].properties[name];
	}

	get(name) {
		return this[_p].properties[name];
	}

	removeAll() {
		for(let name of this) {
			this.remove(name);
		}
	}

	[Symbol.iterator]() {
		return this.array;
	}

	get array() {
		return Object.keys(this[_p].properties);
	}

	copyTo(target) {
		for(let key of this.array) {
			target.properties.add(this.get(key));
		}
	}
}

export { Properties };