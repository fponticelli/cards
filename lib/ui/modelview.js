import { Component } from './component';
import { TextProperty, TextEditorProperty, EditorProperty } from './properties/types'
import { Field } from './field';
import { PushStream } from 'streamy/stream';

let template = require('./modelview.jade')(),
	_fields  = Symbol(),
	_data    = Symbol(),
	_schema  = Symbol();

export class ModelView extends Component {
	constructor(...args) {
		super(template, ...args);
		this[_fields] = {};
		this[_data]   = new PushStream();
		this[_schema] = new PushStream();
	}
	reset() {
		this.array.map((key) => this.deleteField(name));
	}
	addField(name, type) {
		let field = new Field();
		field.attachTo(this.el);

		field.key.properties.add(new TextProperty());
		field.key.properties.add(new TextEditorProperty());
		field.key.editor.value.feed(field.key.text);
		let last;
		field.key.editor.value.map(v => {
			this[_schema].push({ event:'rename', oldname:last, newname: v});
			last = v;
		});
		field.key.editor.value = name;

		field.value.properties.add(EditorProperty.create(type));

		let stream = field.value.editor.value.map(v => ({ path : field.key.editor.value.value, value : v }));
		stream.feed(this[_data]);

		this[_fields][name] = { field, stream }
	}
	deleteField(name) {
		let pair = this.getPair(name);
		pair.field.destroy();
		pair.stream.cancel();
		delete this[_fields][name];
	}
	renameField(oldname, newname) {
		let pair = this.getPair(oldname);
		delete this[_fields][oldname];
		this[_fields][newname] = pair;
		pair.field.key.editor.value = newname;
	}
	retypeField(name, type) {
		let pair = this.getPair(name);
		pair.stream.cancel();
		pair.field.value.properties.remove('editor');
		pair.field.value.properties.add(EditorProperty.create(type));
		let stream = pair.field.value.editor.value.map(v => ({ path : name, value : v }));
		stream.feed(this[_data]);
		pair.field.value.editor.value.feed(pair.field.value.text);
	}

	toString() {
		return `ModelView: ${this.uuid}`;
	}

	getPair(name) {
		let pair = this[_fields][name];
		if(!pair) throw new Error(`field '${name} not found in ModelView'`);
		return pair;
	}

	getField(name) {
		return this.getPair(name).field;
	}

	[Symbol.iterator]() {
		return this.array;
	}

	get array() {
		return Object.keys(this[_fields]);
	}

	get data() {
		return this[_data];
	}

	get schema() {
		return this[_schema];
	}
}

export class SchemaWrapper {
	constructor(schema, view) {
		this.schema = schema;
		this.view = view;
		schema.stream.subscribe(this.handler.bind(this));
		view.schema.subscribe(e => {
			switch(e.event) {
				case 'rename':
					if(e.oldname) {
						schema.rename(e.oldname, e.newname);
					}
					break;
			}
		});
	}

	handler(message) {
		switch(message.event) {
			case 'list':
				return this.handleList(message.data);
			case 'add':
				return this.handleAdd(message.name, message.type);
			case 'delete':
				return this.handleDelete(message.name);
			case 'rename':
				return this.handleRename(message.oldname, message.newname);
			case 'retype':
				return this.handleRetype(message.name, message.type);
			default:
				throw new Error(`invalid message '${message}'`);
		}
	}

	handleList(data) {
		this.view.reset();
		data.map(pair => this.handleAdd(pair.name, pair.type));
	}
	handleAdd(name, type) {
		this.view.addField(name, type);
	}
	handleDelete(name) {
		this.view.deleteField(name);
	}
	handleRename(oldname, newname) {
		this.view.renameField(oldname, newname);
	}
	handleRetype(name, type) {
		this.view.retypeField(name, type);
	}
}