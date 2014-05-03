import { PushStream } from 'streamy/stream';

let _data    = Symbol(),
	_schema  = Symbol(),
	_stream  = Symbol(),
	_o       = Symbol(),
	identity = () => false;

function resolveSetter(target, path) {
	if(path in target) {
		return (v) => {
			target[path] = v;
			return true;
		}
	} else {
		return identity;
	}
}

function resolveInitializer(target, path) {
	return (v) => {
		target[path] = v;
		return true;
	};
}

function resolveDeleter(target, path) {
	return () => {
		delete target[path];
		return true;
	};
}

function resolveRenamer(target, path) {
	return (newname) => {
		let old = target[path];
		delete target[path];
		target[newname] = old;
		return true;
	};
}

function guessName(keys, prefix = "field ") {
	let max = -1,
		value;
	for(let key of keys) {
		if(key.indexOf(prefix) === 0) {
			value = parseInt(key.substr(prefix.length), 10);
			if(isNaN(value) || value < 0)
				continue;
			if(value > max)
				max = value;
		}
	}
	return prefix + (max + 1);
}

export class Model {
	constructor() {
		let data    = this[_data]   = new PushStream(),
			schema  = this[_schema] = new PushStream(),
			stream  = new PushStream(),
			o       = this[_o]      = {};

		this[_stream] = stream.debounce(100).unique(JSON.stringify);

		data.subscribe(e => {
			if(resolveSetter(o, e.path)(e.value))
				stream.push(o);
		});
		schema.subscribe(e => {
			switch(e.event) {
				case 'list':
					o = this[_o] = {};
					let res = e.data.map((pair) => resolveInitializer(o, pair.name)(null));
					if(res.filter(r => r).length === res.length)
						stream.push(o);
					break;
				case 'add':
					if(resolveInitializer(o, e.name)(null))
						stream.push(o);
					break;
				case 'delete':
					if(resolveDeleter(o, e.name)())
						stream.push(o);
					break;
				case 'rename':
					if(resolveRenamer(o, e.oldname)(e.newname))
						stream.push(o);
					break;
			}
		});
	}

	get data() {
		return this[_data];
	}

	get schema() {
		return this[_schema];
	}

	get stream() {
		return this[_stream];
	}

	get keys() {
		return Object.keys(this[_o]);
	}

	nextFieldName() {
		return guessName(this.keys);
	}

	toJSON() {
		return this[_o];
	}
}