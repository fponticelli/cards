import { PushStream } from 'streamy/stream';

let _fields = Symbol(),
	_stream = Symbol();

export class Model {
	constructor(list) {
		this[_stream] = new PushStream();
		this.reset(list);
	}

	add(name, value) {
		if(name in this[_fields])
			throw new Error(`Model already contains a field '${name}'`);
		this[_fields][name] = value;
		this[_stream].push({
			event:'add',
			name:name,
			type:value.type
		});
	}

	reset(list = []) {
		this[_fields] = {};
		this[_stream].push({
			event:'list',
			data:list.map(pair => ({
							name:pair.name,
							type:pair.value.type
						}))
		});
	}

	delete(name) {
		if(!(name in this[_fields]))
			throw new Error(`Model does not contain a field '${name}'`);
		let old = this[_fields][name];
		old.cancel();
		delete this[_fields][name];
		this[_stream].push({
			event:'delete',
			name:name
		});
	}

	rename(oldname, newname) {
		if(!(oldname in this[_fields]))
			throw new Error(`Model does not contain a field '${oldname}'`);
		let value = this[_fields][oldname];
		delete this[_fields][oldname];
		this[_fields][newname] = value;
		this[_stream].push({
			event:'rename',
			oldname:oldname,
			newname:newname
		});
	}

	retype(name, value) {
		if(!(name in this[_fields]))
			throw new Error(`Model doesn't container field '${name}' for retype()`);
		let old = this[_fields][name];
		old.cancel();
		this[_fields][name] = value;
		this[_stream].push({
			event:'retype',
			name:name,
			type:value.type
		});
	}

	get(name) {
		return this[_fields][name];
	}

	has(name) {
		return name in this[_fields];
	}

	[Symbol.iterator]() {
		return this.array;
	}

	get array() {
		return Object.keys(this[_fields]);
	}

	get stream() {
		return this[_stream];
	}
}