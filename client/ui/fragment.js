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
		this[p] = {};
		this[u] = {};
	}

	get data() {
		let out = {},
			properties = this.properties;
		for(let key in properties) {
			if(properties[key] instanceof PropertyContainer) {
				out[key] = properties[key].data;
			} else if(!properties[key].isDefault) {
				out[key] = properties[key].value;
			}
		}
		return out;
	}

	set data(o) {
		let properties = this.properties;
		for(let key in o) {
			if(!properties[key])
				continue;
			if(properties[key] instanceof PropertyContainer) {
				properties[key].data = o[key];
			} else {
				properties[key].value = o[key];
			}
		}
	}

	addPropertyValue(name, value, wire) {
		if(this[u][name])
			throw new Error(`A property '${name}' already exists`);
		Object.defineProperty(this[p], name, {
			configurable: true,
			enumerable: true,
			writeable: false,
			get: () => value,
			set: (v) => value.push(v)
		});
		this[u][name] = wire.call(this.properties, value, this[$]);
	}

	addPropertyContainer(name, defaultField) {
		if(this[u][name])
			throw new Error(`A property '${name}' already exists`);
		let container = this[u][name] = new PropertyContainer(),
			setter = (defaultField) ?
				function(v) { container[defaultField].push(v); } :
				function() { throw new Error('Property Container doesn\'t have a default field'); };
		Object.defineProperty(this[p], name, {
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
		if(this[u][name] instanceof PropertyContainer)
			this[u][name].removeProperties();
		else
			this[u][name]();
		delete this[u][name];
		delete this[p][name];
	}

	removeProperties() {
		for(let key in this[u])
			this.removeProperty(key);
	}

	get properties() {
		return this[p];
	}

	get parent() {
		return this[parent];
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
		this[$].parentNode.removeChild(this[$]);
	}

	toJSON() {
		return this.data;
	}
}



export { Fragment, PropertyContainer, $, p };