import { PushStream } from 'streamy/stream';

let _fields = Symbol(),
	_stream = Symbol();

export class Schema {
	constructor(list) {
		this[_stream] = new PushStream();
		this.reset(list);
	}

	add(name, type) {
		if(name in this[_fields])
			throw new Error(`Schema already contains a field '${name}'`);
		this[_fields][name] = type;
		this[_stream].push({
			event:'add',
			name:name,
			type:type
		});
	}

	reset(list = []) {
		this[_fields] = {};
		this[_stream].push({
			event:'list',
			data:list.map(pair => ({
							name:pair.name,
							type:pair.type
						}))
		});
	}

	delete(name) {
		if(!(name in this[_fields]))
			throw new Error(`Schema does not contain a field '${name}'`);
		delete this[_fields][name];
		this[_stream].push({
			event:'delete',
			name:name
		});
	}

	rename(oldname, newname) {
		if(!(oldname in this[_fields]))
			throw new Error(`Schema does not contain a field '${oldname}'`);
		let type = this[_fields][oldname];
		delete this[_fields][oldname];
		this[_fields][newname] = type;
		this[_stream].push({
			event:'rename',
			oldname:oldname,
			newname:newname
		});
	}

	retype(name, type) {
		if(!(name in this[_fields]))
			throw new Error(`Schema doesn't container field '${name}' for retype()`);
		this[_fields][name];
		this[_fields][name] = type;
		this[_stream].push({
			event:'retype',
			name:name,
			type:type
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