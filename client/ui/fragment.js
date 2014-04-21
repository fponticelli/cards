import { Html } from 'ui/dom';

let template = require('./fragment.jade')(),
	$ = Symbol(),
	p = Symbol(),
	u = Symbol(),
	parent = Symbol();

// TODO, add properties iterator
class PropertyContainer {
	constructor(parent) {
		this[parent] = parent;
		this[u] = {};
	}

	addPropertyValue(name, value, wire) {
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

	addPropertyContainer(name, defaultField) {
		if(this[u][name])
			throw new Error(`A property '${name}' already exists`);
		let container = new PropertyContainer(),
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

class Fragment extends PropertyContainer {
	constructor() {
		this[$] = Html.parse(template);
		this[p] = {};
		this[u] = {};
	}

	attachTo(container) {
		container.appendChild(this[$]);
	}

	detach() {
		if(!this[$].parentNode)
			throw new Error('Fragment is not attached');
		this[$].parentNode.removeChild(this[$]);
	}
}



export { Fragment, PropertyContainer, $, p };