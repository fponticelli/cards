import { Component } from './component';
import { TextProperty, TextEditorProperty, EditorProperty } from './properties/types'
import { Field } from './field';

let template = require('./modelview.jade')(),
	_fields = Symbol();

export class ModelView extends Component {
	constructor(...args) {
		super(template, ...args);
		this[_fields] = {};
	}
	reset() {
		this.array.map((key) => this.deleteField(name));
	}
	addField(name, type) {
		let f = this[_fields][name] = new Field();
		f.attachTo(this.el);

		f.key.properties.add(new TextProperty());
		f.key.properties.add(new TextEditorProperty());
		f.key.editor.value.feed(f.key.text);
		f.key.editor.value = name;

		f.value.properties.add(EditorProperty.create(type));
	}
	deleteField(name) {
		let f = this.getField(name);
		f.destroy();
		delete this[_fields][name];
	}
	renameField(oldname, newname) {
		let f = this.getField(oldname);
		delete this[_fields][oldname];
		this[_fields][newname] = f;
		f.key.editor.value = newname;
	}
	retypeField(name, type) {
		let f = this.getField(name);
		f.value.properties.remove('editor');
		f.value.properties.add(EditorProperty.create(type));
		f.value.editor.value.feed(f.value.text);
	}

	toString() {
		return `ModelView: ${this.uuid}`;
	}

	getField(name) {
		let f = this[_fields][name];
		if(!f) throw new Error(`field '${name} not found in ModelView'`);
		return f;
	}

	[Symbol.iterator]() {
		return this.array;
	}

	get array() {
		return Object.keys(this[_fields]);
	}
}

export class SchemaWrapper {
	constructor(schema, view) {
		this.schema = schema;
		this.view = view;
		schema.stream.subscribe(this.handler.bind(this));
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