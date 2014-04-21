import { Html } from 'ui/dom';

let u = Symbol(),
	$ = Symbol(),
	parent = Symbol();

// TODO, add properties iterator
class PropertyContainer {
	constructor(element, parent) {
		this[parent] = parent;
		this[u] = {};
		this[$] = element;
	}

	addValue(name, value, wire) {
		if(name in this)
			throw new Error(`A property '${name}' already exists`);
		Object.defineProperty(this, name, {
			configurable: true,
			enumerable: true,
			writeable: false,
			get: () => value,
			set: (v) => value.push(v)
		});
		this[u][name] = wire.call(this, value, this[$]);
	}

	addContainer(name, defaultField) {
		if(this[u][name])
			throw new Error(`A property '${name}' already exists`);
		let container = new PropertyContainer(this[$], this),
			setter = (defaultField) ?
				function(v) { container[defaultField].push(v); } :
				function() { throw new Error('Property Container doesn\'t have a default field'); };
		this[u][name] = container.removeProperties.bind(container);
		Object.defineProperty(this, name, {
			configurable: true,
			enumerable: true,
			writeable: false,
			get: () => container,
			set: setter
		});
		return container;
	}

	removeProperty(name) {
		if(!this[u][name])
			throw `Object doesn't contain a property '${name}'`;
		this[u][name]();
		delete this[u][name];
		delete this[name];
	}

	removeProperties() {
		for(let key in this[u])
			this.removeProperty(key);
	}

	properties() {
		let arr = [];
		for(let key in this[u])
			arr.push(key)
		return arr;
	}

	get parent() {
		return this[parent];
	}

	toJSON() {
		let out = {};
		for(let key in this[u]) {
			if("isDefault" in this[key] && this[key].isDefault)
				continue;
			out[key] = this[key].value;
		}
		return out;
	}
}


export { PropertyContainer, $ };